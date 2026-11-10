import { randomBytes, randomInt, randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { Server } from 'socket.io'
import { FlightModel, seededRandom } from './flight-model.mjs'
import { attachArenaManager } from './arena-manager.mjs'

const PORT = Number(process.env.PORT) || 3001
const ROUND_LIMIT_MS = 120_000
const COUNTDOWN_MS = 10_000
const STEP_SECONDS = 1 / 120
const TICK_MS = 1000 / 60
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function createMosswingServer({
  port = PORT,
  countdownMs = COUNTDOWN_MS,
  roundLimitMs = ROUND_LIMIT_MS,
  tickMs = TICK_MS,
  forestWaitingMs,
  forestEmptyMs,
  forestDisconnectMs,
  forestFinishedMs,
  mazeWaitingMs,
  mazeEmptyMs,
  mazeDisconnectMs,
  mazeFinishedMs,
} = {}) {
  const app = express()
  app.get('/health', (_request, response) => response.json({ status: 'ok', game: 'mosswing-online' }))

  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: { origin: true, methods: ['GET', 'POST'] },
    pingInterval: 5000,
    pingTimeout: 10000,
  })
  const arenaManager = attachArenaManager(io, {
    countdownMs,
    forestWaitingMs,
    forestEmptyMs,
    forestDisconnectMs,
    forestFinishedMs,
    mazeWaitingMs,
    mazeEmptyMs,
    mazeDisconnectMs,
    mazeFinishedMs,
  })

  const rooms = new Map()
  const matchmaking = []
  const playerRooms = new Map()
  let tickTimer

  function makeCode() {
    let code
    do {
      const bytes = randomBytes(6)
      code = Array.from(bytes, (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join('')
    } while (rooms.has(code))
    return code
  }

  function sendAck(callback, result) {
    if (typeof callback === 'function') callback(result)
  }

  function socketFor(player) {
    return player.socketId ? io.sockets.sockets.get(player.socketId) : undefined
  }

  function roomSnapshot(room, recipientToken) {
    const recipient = room.players.find((player) => player.token === recipientToken)
    return {
      code: room.code,
      phase: room.phase,
      seed: room.seed,
      countdownEndsAt: room.countdownEndsAt,
      startedAt: room.startedAt,
      deadline: room.deadline,
      winnerSlot: room.winnerSlot,
      result: room.result,
      isPublic: room.isPublic,
      stake: room.stake,
      payout: room.payout,
      ping: room.ping,
      round: room.round,
      players: room.players.map((player, slot) => ({
        slot,
        you: player.token === recipientToken,
        connected: player.connected,
        ready: player.ready,
        score: player.model?.score ?? 0,
        coins: player.model?.coins ?? 0,
        alive: player.model?.alive ?? true,
        name: player.name,
        x: player.model?.x ?? (slot === 0 ? -1.25 : -0.15),
        y: player.model?.y ?? 0,
        vy: player.model?.vy ?? 0,
        distance: player.model?.distance ?? 0,
        elapsed: player.model?.elapsed ?? 0,
        nextCoinAt: player.model?.nextCoinAt ?? 5,
      })),
      gates: room.course?.gates.map(({ id, x, center }) => ({ id, x, center })) ?? [],
      yourSlot: recipient ? room.players.indexOf(recipient) : -1,
    }
  }

  function broadcastRoom(room) {
    for (const player of room.players) {
      if (player.connected && player.socketId) {
        io.to(player.socketId).emit('room:state', roomSnapshot(room, player.token))
      }
    }
  }

  function publicRoomList() {
    return [...rooms.values()]
      .filter((room) => room.isPublic && room.phase === 'waiting' && room.players.length < 2)
      .map((room) => ({
        code: room.code,
        game: 'mosswing-online',
        phase: room.phase,
        host: room.players[0]?.name ?? 'Joueur 1',
        players: room.players.length,
        stake: room.stake,
      }))
  }

  function broadcastPublicRooms() {
    io.emit('mosswing:public-rooms', publicRoomList())
  }

  function removeRoom(room) {
    io.to(room.code).emit('room:closed')
    if (room.countdownTimer) clearTimeout(room.countdownTimer)
    for (const [slot, player] of room.players.entries()) {
      const refund = room.escrowed[slot] ?? 0
      if (refund > 0) {
        arenaManager.addDemoCredits(player.walletId, refund)
        arenaManager.sendDemoBalance(player)
        room.escrowed[slot] = 0
      }
      if (player.socketId) playerRooms.delete(player.socketId)
    }
    rooms.delete(room.code)
  }

  function createRoom(players, { isPublic = false, stake = 0 } = {}) {
    const code = makeCode()
    const room = {
      code,
      phase: 'waiting',
      players,
      isPublic,
      stake,
      escrowed: players.map(() => stake),
      settled: false,
      payout: 0,
      seed: null,
      countdownEndsAt: null,
      startedAt: null,
      deadline: null,
      pausedAt: null,
      priorPhase: null,
      round: 0,
      simulationTick: 0,
      countdownTimer: null,
      winnerSlot: null,
      result: null,
      ping: null,
      lastBroadcastAt: 0,
      course: null,
    }

    rooms.set(code, room)
    for (const player of players) {
      player.roomCode = code
      if (player.socketId) {
        playerRooms.set(player.socketId, { code, token: player.token })
        socketFor(player)?.join(code)
      }
    }
    return room
  }

  function playerName(value, slot) {
    if (typeof value !== 'string') return `Joueur ${slot + 1}`
    const name = Array.from(value, (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127 ? '' : character)
      .join('').trim().slice(0, 18)
    return name || `Joueur ${slot + 1}`
  }

  function createPlayer(socket, slot, name, walletValue) {
    return {
      token: randomUUID(),
      walletId: typeof walletValue === 'string' && /^[a-z0-9-]{8,64}$/i.test(walletValue)
        ? walletValue
        : randomUUID(),
      socketId: socket.id,
      name: playerName(name, slot),
      eliminatedAt: null,
      roomCode: null,
      connected: true,
      ready: false,
      model: null,
      lastFlapAt: 0,
      slot,
    }
  }

  function acknowledgeRoom(socket, room, player, callback) {
    sendAck(callback, { ok: true, code: room.code, token: player.token, slot: room.players.indexOf(player) })
    broadcastRoom(room)
    socket.emit('room:joined', { code: room.code, token: player.token })
  }

  function finishRoom(room, winnerSlot, result) {
    if (room.phase === 'finished') return
    if (room.countdownTimer) clearTimeout(room.countdownTimer)
    room.countdownTimer = null
    room.phase = 'finished'
    room.winnerSlot = winnerSlot
    room.result = result
    room.settled = true
    room.payout = winnerSlot === null ? 0 : room.stake * 2
    if (room.stake > 0) {
      if (winnerSlot === null) {
        room.players.forEach((player, slot) => {
          if (room.escrowed[slot] > 0) arenaManager.addDemoCredits(player.walletId, room.escrowed[slot])
        })
      } else {
        const winner = room.players[winnerSlot]
        if (winner) arenaManager.addDemoCredits(winner.walletId, room.payout)
      }
      room.escrowed = [0, 0]
      room.players.forEach(arenaManager.sendDemoBalance)
    }
    room.players.forEach((player) => { player.ready = false })
    broadcastRoom(room)
    broadcastPublicRooms()
  }

  function beginRound(room) {
    if (room.players.length !== 2 || room.players.some((player) => !player.connected || !player.ready)) {
      room.phase = 'waiting'
      room.countdownEndsAt = null
      broadcastRoom(room)
      return
    }

    room.round += 1
    room.seed = randomInt(1, 0x7fffffff)
    room.players.forEach((player) => {
      player.model = new FlightModel(seededRandom(room.seed))
      player.model.limit = 5.555
      player.model.reset(player.slot === 0 ? -1.25 : -0.15)
      player.model.flap()
      player.lastFlapAt = 0
      player.eliminatedAt = null
    })
    room.course = {
      gates: room.players[0].model.gates.map(({ id, x, center }) => ({ id, x, center })),
      speed: 2.4,
      random: seededRandom(room.seed ^ 0x9e3779b9),
      nextGateId: 6,
    }
    room.startedAt = Date.now()
    room.deadline = room.startedAt + roundLimitMs
    room.countdownEndsAt = null
    room.phase = 'running'
    room.winnerSlot = null
    room.result = null
    broadcastRoom(room)
    io.to(room.code).emit('game:started', {
      seed: room.seed,
      round: room.round,
      startAt: room.startedAt,
      deadline: room.deadline,
    })
  }

  function startCountdown(room) {
    if (room.phase === 'countdown' || room.phase === 'running') return
    if (room.players.length !== 2 || room.players.some((player) => !player.connected || !player.ready)) return

    room.phase = 'countdown'
    room.countdownEndsAt = Date.now() + countdownMs
    broadcastRoom(room)
    room.countdownTimer = setTimeout(() => beginRound(room), countdownMs)
    room.countdownTimer.unref?.()
  }

  function findPlayer(socket) {
    const current = playerRooms.get(socket.id)
    if (!current) return null
    const room = rooms.get(current.code)
    const player = room?.players.find((item) => item.token === current.token)
    return room && player ? { room, player } : null
  }

  function removeFromMatchmaking(socket) {
    const index = matchmaking.findIndex((entry) => entry.socketId === socket.id)
    if (index >= 0) matchmaking.splice(index, 1)
  }

  function queueForMatch(socket, callback, name) {
    removeFromMatchmaking(socket)
    const opponentIndex = matchmaking.findIndex((entry) => io.sockets.sockets.has(entry.socketId))
    if (opponentIndex < 0) {
      matchmaking.push({ socketId: socket.id, name: playerName(name, 0) })
      sendAck(callback, { ok: true, queued: true })
      socket.emit('matchmaking:queued')
      return
    }

    const [opponentEntry] = matchmaking.splice(opponentIndex, 1)
    const opponentSocket = io.sockets.sockets.get(opponentEntry.socketId)
    if (!opponentSocket) return queueForMatch(socket, callback)

    const players = [createPlayer(opponentSocket, 0, opponentEntry.name), createPlayer(socket, 1, playerName(name, 1))]
    const room = createRoom(players)
    for (const player of players) {
      const target = socketFor(player)
      if (target) {
        target.emit('match:found', { code: room.code, token: player.token })
        target.emit('room:state', roomSnapshot(room, player.token))
      }
    }
    sendAck(callback, { ok: true, queued: false, code: room.code })
  }

  io.on('connection', (socket) => {
    socket.on('room:create', (payload, callback) => {
      if (findPlayer(socket)) return sendAck(callback, { ok: false, error: 'Vous êtes déjà dans une salle.' })
      if (rooms.size >= 300) return sendAck(callback, { ok: false, error: 'Les salles sont temporairement complètes.' })
      const stake = payload?.stake ?? 0
      if (!Number.isSafeInteger(stake) || stake < 0 || stake > 1_000_000) {
        return sendAck(callback, { ok: false, error: 'La mise de démonstration est invalide.' })
      }
      if (payload?.isPublic === true && stake < 1) {
        return sendAck(callback, { ok: false, error: 'Un salon public doit avoir une mise de démonstration positive.' })
      }
      const player = createPlayer(socket, 0, payload?.name, payload?.walletId)
      if (!arenaManager.reserveDemoStake(player, stake)) {
        return sendAck(callback, { ok: false, error: 'Solde de démonstration insuffisant pour cette mise.' })
      }
      const room = createRoom([player], { isPublic: payload?.isPublic === true, stake })
      acknowledgeRoom(socket, room, player, callback)
      arenaManager.sendDemoBalance(player)
      broadcastPublicRooms()
    })

    socket.on('room:join', (payload, callback) => {
      const code = typeof payload?.code === 'string' ? payload.code.trim().toUpperCase() : ''
      if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) return sendAck(callback, { ok: false, error: 'Le code doit contenir 6 caractères.' })
      const room = rooms.get(code)
      if (!room || room.phase === 'finished') return sendAck(callback, { ok: false, error: 'Salle introuvable ou déjà terminée.' })
      if (room.players.length >= 2) return sendAck(callback, { ok: false, error: 'Cette salle est déjà complète.' })
      if (findPlayer(socket)) return sendAck(callback, { ok: false, error: 'Vous êtes déjà dans une salle.' })
      if ((payload?.stake ?? 0) !== room.stake) {
        return sendAck(callback, { ok: false, error: 'La mise doit être identique à celle affichée dans le salon.' })
      }
      const player = createPlayer(socket, 1, payload?.name, payload?.walletId)
      if (!arenaManager.reserveDemoStake(player, room.stake)) {
        return sendAck(callback, { ok: false, error: 'Solde de démonstration insuffisant pour cette mise.' })
      }
      room.players.push(player)
      room.escrowed[player.slot] = room.stake
      player.roomCode = room.code
      playerRooms.set(socket.id, { code: room.code, token: player.token })
      socket.join(room.code)
      acknowledgeRoom(socket, room, player, callback)
      arenaManager.sendDemoBalance(player)
      broadcastPublicRooms()
    })

    socket.on('mosswing:public-rooms:request', () => {
      socket.emit('mosswing:public-rooms', publicRoomList())
    })

    socket.on('room:reconnect', (payload, callback) => {
      const code = typeof payload?.code === 'string' ? payload.code.toUpperCase() : ''
      const token = typeof payload?.token === 'string' ? payload.token : ''
      const room = rooms.get(code)
      const player = room?.players.find((item) => item.token === token)
      if (!room || !player || player.connected) {
        return sendAck(callback, { ok: false, error: 'Cette salle ou ce joueur est introuvable.' })
      }
      player.connected = true
      player.socketId = socket.id
      socket.join(code)
      playerRooms.set(socket.id, { code, token })
      if (room.phase === 'paused' && room.players.every((item) => item.connected)) {
        const pauseDuration = Date.now() - room.pausedAt
        if (room.priorPhase === 'countdown') {
          room.countdownEndsAt += pauseDuration
          room.phase = 'countdown'
          room.countdownTimer = setTimeout(() => beginRound(room), Math.max(0, room.countdownEndsAt - Date.now()))
          room.countdownTimer.unref?.()
        } else {
          room.startedAt += pauseDuration
          room.deadline += pauseDuration
          room.phase = 'running'
        }
        room.pausedAt = null
        room.priorPhase = null
      }
      sendAck(callback, { ok: true, code, token, slot: room.players.indexOf(player) })
      broadcastRoom(room)
      broadcastPublicRooms()
    })

    socket.on('room:ready', (payload, callback) => {
      const entry = findPlayer(socket)
      if (!entry || entry.room.phase === 'finished') return sendAck(callback, { ok: false, error: 'Vous n’êtes pas dans une salle active.' })
      entry.player.ready = Boolean(payload?.ready)
      if (!entry.player.ready && entry.room.phase === 'countdown') {
        clearTimeout(entry.room.countdownTimer)
        entry.room.countdownTimer = null
        entry.room.phase = 'waiting'
        entry.room.countdownEndsAt = null
      }
      broadcastRoom(entry.room)
      if (entry.room.players.length === 2 && entry.room.players.every((player) => player.ready)) startCountdown(entry.room)
      sendAck(callback, { ok: true })
    })

    socket.on('room:rematch', (_payload, callback) => {
      const entry = findPlayer(socket)
      if (!entry || entry.room.phase !== 'finished') return sendAck(callback, { ok: false, error: 'La manche en cours n’est pas terminée.' })
      if (entry.room.players.length !== 2 || entry.room.players.some((player) => !player.connected)) {
        return sendAck(callback, { ok: false, error: 'Les deux joueurs doivent être connectés pour la revanche.' })
      }
      entry.player.ready = true
      if (entry.room.players.every((player) => player.ready)) {
        const reserved = []
        if (entry.room.stake > 0) {
          for (const player of entry.room.players) {
            if (!arenaManager.reserveDemoStake(player, entry.room.stake)) {
              reserved.forEach((reservedPlayer) => {
                arenaManager.addDemoCredits(reservedPlayer.walletId, entry.room.stake)
                arenaManager.sendDemoBalance(reservedPlayer)
              })
              entry.room.players.forEach((player) => { player.ready = false })
              broadcastRoom(entry.room)
              return sendAck(callback, { ok: false, error: 'Solde de démonstration insuffisant pour la revanche.' })
            }
            reserved.push(player)
            arenaManager.sendDemoBalance(player)
          }
          entry.room.escrowed = [entry.room.stake, entry.room.stake]
        }
        entry.room.settled = false
        entry.room.payout = 0
        entry.room.phase = 'waiting'
        entry.room.winnerSlot = null
        entry.room.result = null
        entry.room.players.forEach((player) => { player.model = null })
      }
      broadcastRoom(entry.room)
      if (entry.room.phase === 'waiting') startCountdown(entry.room)
      sendAck(callback, { ok: true })
    })

    socket.on('game:flap', (_payload, callback) => {
      const entry = findPlayer(socket)
      if (!entry || entry.room.phase !== 'running' || !entry.player.model?.alive) {
        return sendAck(callback, { ok: false, error: 'Le vol n’est pas actif.' })
      }
      const now = Date.now()
      if (now - entry.player.lastFlapAt < 55) return sendAck(callback, { ok: false, error: 'Action trop rapide.' })
      entry.player.lastFlapAt = now
      entry.player.model.flap()
      broadcastRoom(entry.room)
      sendAck(callback, { ok: true })
    })

    socket.on('network:ping', (_payload, callback) => sendAck(callback, { now: Date.now() }))
    socket.on('matchmaking:join', (payload, callback) => queueForMatch(socket, callback, payload?.name))
    socket.on('matchmaking:leave', () => removeFromMatchmaking(socket))

    socket.on('room:leave', (_payload, callback) => {
      const entry = findPlayer(socket)
      removeFromMatchmaking(socket)
      if (!entry) return sendAck(callback, { ok: true })
      if (entry.room.phase === 'running' || entry.room.phase === 'paused') {
        finishRoom(entry.room, entry.room.players.indexOf(entry.player) === 0 ? 1 : 0, 'abandon')
      } else {
        removeRoom(entry.room)
      }
      broadcastPublicRooms()
      sendAck(callback, { ok: true })
    })

    socket.on('disconnect', () => {
      removeFromMatchmaking(socket)
      const entry = findPlayer(socket)
      if (!entry) return
      const { room, player } = entry
      player.connected = false
      player.socketId = null
      playerRooms.delete(socket.id)
      if (room.phase === 'countdown' || room.phase === 'running') {
        room.priorPhase = room.phase
        room.phase = 'paused'
        room.pausedAt = Date.now()
        if (room.countdownTimer) clearTimeout(room.countdownTimer)
        room.countdownTimer = null
      }
      broadcastRoom(room)
      broadcastPublicRooms()
    })
  })

  function tick() {
    const now = Date.now()
    for (const room of rooms.values()) {
      if (room.phase !== 'running') continue
      if (now >= room.deadline) {
        const [first, second] = room.players
        const winner = first.model.alive !== second.model.alive
          ? (first.model.alive ? 0 : 1)
          : first.model.score === second.model.score ? null : first.model.score > second.model.score ? 0 : 1
        finishRoom(room, winner, 'temps')
        continue
      }

      for (let step = 0; step < 2 && room.phase === 'running'; step += 1) {
        room.simulationTick += 1
        room.course.speed = 2.4 + Math.min(Math.max(...room.players.map((player) => player.model.score)), 35) * 0.008
        for (const gate of room.course.gates) gate.x -= room.course.speed * STEP_SECONDS
        for (const gate of room.course.gates) {
          if (gate.x < -1.25 - 7) {
            gate.x = Math.max(...room.course.gates.map((item) => item.x)) + 8.5
            gate.center = (room.course.random() - 0.5) * 2.2
            gate.id = room.course.nextGateId
            room.course.nextGateId += 1
          }
        }
        const results = room.players.map((player) => player.model.step(STEP_SECONDS, room.course))
        const eliminated = results.map((result, slot) => result.hit ? slot : -1).filter((slot) => slot >= 0)
        if (eliminated.length === 2) {
          finishRoom(room, null, 'egalite')
        } else if (eliminated.length === 1) {
          room.players[eliminated[0]].eliminatedAt = room.simulationTick
          if (room.players.every((player) => !player.model.alive)) {
            const [first, second] = room.players
            const winner = first.eliminatedAt === second.eliminatedAt
              ? null
              : first.eliminatedAt < second.eliminatedAt ? 1 : 0
            finishRoom(room, winner, winner === null ? 'egalite' : 'collision')
          }
        }
      }
      if (room.phase === 'running' && now - room.lastBroadcastAt >= 100) {
        room.lastBroadcastAt = now
        broadcastRoom(room)
      }
    }
  }

  function start() {
    return new Promise((resolve, reject) => {
      httpServer.once('error', reject)
      httpServer.listen(port, '0.0.0.0', () => {
        httpServer.off('error', reject)
        tickTimer = setInterval(tick, tickMs)
        tickTimer.unref?.()
        resolve(httpServer.address())
      })
    })
  }

  async function stop() {
    if (tickTimer) clearInterval(tickTimer)
    for (const room of rooms.values()) removeRoom(room)
    await new Promise((resolve, reject) => {
      io.close((error) => error ? reject(error) : resolve())
    })
  }

  return { app, httpServer, io, rooms, arenaRooms: arenaManager.rooms, start, stop }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createMosswingServer()
  server.start().then((address) => {
    console.log(`Mosswing Online server listening on ${typeof address === 'object' ? address.port : PORT}`)
  }).catch((error) => {
    console.error('Unable to start Mosswing Online server:', error)
    process.exitCode = 1
  })
}
