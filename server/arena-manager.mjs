import { randomBytes, randomInt, randomUUID } from 'node:crypto'
import { applyAuthoritativeInput, createAuthoritativeGame, tickAuthoritativeGame } from './authoritative-arcade.mjs'
import { createHeadFootballMatch, sanitizeHeadFootballInput, tickHeadFootballMatch } from './head-football.mjs'

const GAME_IDS = new Set(['tic-tac-toe', 'ping-pong', 'basketball-stars', 'cannon-duel', 'ball-rush', 'football-19', 'head-football', 'tap-tape-arena'])
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const TAP_TICK_MS = 50
const TAP_SNAPSHOT_MS = 100
const TAP_DECAY_DELAY_MS = 250
const TAP_DECAY_PER_SECOND = 22
const TAP_IDLE_DECAY_ACCELERATION = 0.035
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function playerName(value, slot) {
  if (typeof value !== 'string') return `Joueur ${slot + 1}`
  const name = Array.from(value, (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127 ? '' : character)
    .join('').trim().slice(0, 18)
  return name || `Joueur ${slot + 1}`
}

function boundedObject(value, maxLength) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  try {
    const encoded = JSON.stringify(value)
    return encoded.length <= maxLength ? JSON.parse(encoded) : null
  } catch {
    return null
  }
}

export function attachArenaManager(io, { countdownMs = 3000, roomGraceMs = 25_000 } = {}) {
  const rooms = new Map()
  const socketPlayers = new Map()

  function makeCode() {
    let code
    do {
      code = Array.from(randomBytes(6), (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join('')
    } while (rooms.has(code))
    return code
  }

  function lookup(socket) {
    const current = socketPlayers.get(socket.id)
    if (!current) return null
    const room = rooms.get(current.code)
    const player = room?.players.find((item) => item.token === current.token)
    return room && player ? { room, player } : null
  }

  function snapshot(room, recipientToken) {
    return {
      code: room.code,
      game: room.game,
      phase: room.phase,
      round: room.round,
      seed: room.seed,
      countdownEndsAt: room.countdownEndsAt,
      countdownRemainingMs: room.countdownEndsAt === null ? null : Math.max(0, room.countdownEndsAt - Date.now()),
      players: room.players.map((player, slot) => ({
        slot,
        you: player.token === recipientToken,
        name: player.name,
        connected: player.connected,
        ready: player.ready,
      })),
      gameState: room.gameState,
      yourSlot: room.players.findIndex((player) => player.token === recipientToken),
    }
  }

  function broadcast(room) {
    for (const player of room.players) {
      if (!player.connected || !player.socketId) continue
      io.to(player.socketId).emit('arena:state', snapshot(room, player.token))
    }
  }

  function stopGameTimer(room) {
    if (room.gameTimer) clearInterval(room.gameTimer)
    room.gameTimer = null
  }

  function startHeadFootballTimer(room) {
    stopGameTimer(room)
    room.lastGameBroadcastAt = Date.now()
    let lastTickAt = Date.now()
    room.gameTimer = setInterval(() => {
      if (room.phase !== 'running') return
      const now = Date.now()
      const dt = Math.min(1 / 20, Math.max(0, (now - lastTickAt) / 1000))
      lastTickAt = now
      tickHeadFootballMatch(room.gameState.match, dt, room.players.map((player) => player.input))
      if (room.gameState.match.status === 'finished') {
        room.phase = 'finished'
        room.players.forEach((player) => { player.ready = false })
        stopGameTimer(room)
      }
      if (now - room.lastGameBroadcastAt >= 50 || room.phase === 'finished') {
        room.lastGameBroadcastAt = now
        broadcast(room)
      }
    }, 16)
    room.gameTimer.unref?.()
  }

  function startTapTimer(room) {
    stopGameTimer(room)
    room.lastGameBroadcastAt = Date.now()
    room.gameTimer = setInterval(() => {
      if (room.phase !== 'running') return
      const now = Date.now()
      room.players.forEach((player) => {
        const score = room.gameState.scores[player.slot]
        const idleMs = now - player.lastActionAt
        if (score <= 0 || !player.lastActionAt || idleMs <= TAP_DECAY_DELAY_MS) return
        const decay = (TAP_DECAY_PER_SECOND + (idleMs - TAP_DECAY_DELAY_MS) * TAP_IDLE_DECAY_ACCELERATION) * TAP_TICK_MS / 1000
        room.gameState.scores[player.slot] = Math.max(0, score - decay)
      })
      if (now - room.lastGameBroadcastAt >= TAP_SNAPSHOT_MS) {
        room.lastGameBroadcastAt = now
        broadcast(room)
      }
    }, TAP_TICK_MS)
    room.gameTimer.unref?.()
  }

  function startAuthoritativeTimer(room) {
    stopGameTimer(room)
    room.lastGameBroadcastAt = Date.now()
    let lastTickAt = Date.now()
    room.gameTimer = setInterval(() => {
      if (room.phase !== 'running') return
      const now = Date.now()
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTickAt) / 1000))
      lastTickAt = now
      tickAuthoritativeGame(room.gameState, dt)
      const finished = room.game === 'ping-pong'
        ? room.gameState.state === 'over'
        : room.gameState.status === 'finished'
      if (finished) {
        room.phase = 'finished'
        room.players.forEach((player) => { player.ready = false })
        stopGameTimer(room)
      }
      if (now - room.lastGameBroadcastAt >= 50 || finished) {
        room.lastGameBroadcastAt = now
        broadcast(room)
      }
    }, 16)
    room.gameTimer.unref?.()
  }

  function removeRoom(room) {
    if (room.countdownTimer) clearTimeout(room.countdownTimer)
    stopGameTimer(room)
    if (room.cleanupTimer) clearTimeout(room.cleanupTimer)
    if (room.disconnectTimer) clearTimeout(room.disconnectTimer)
    for (const player of room.players) {
      if (player.socketId) socketPlayers.delete(player.socketId)
    }
    rooms.delete(room.code)
    io.to(room.code).emit('arena:closed')
  }

  function makeRoom(game, players) {
    const code = makeCode()
    const room = {
      code,
      game,
      phase: 'waiting',
      round: 0,
      seed: null,
      countdownEndsAt: null,
      countdownTimer: null,
      gameTimer: null,
      lastGameBroadcastAt: 0,
      pausedAt: null,
      pausedFrom: null,
      cleanupTimer: null,
      disconnectTimer: null,
      gameState: game === 'tic-tac-toe'
        ? { board: Array(9).fill(0), turn: 0, scores: [0, 0], winner: null }
        : game === 'ball-rush'
          ? { players: [null, null] }
          : game === 'football-19'
            ? { scores: [0, 0], attempts: [0, 0] }
            : game === 'head-football'
              ? { selections: [null, null], match: null }
            : game === 'tap-tape-arena'
              ? { scores: [0, 0], winner: null }
        : null,
      players,
    }
    rooms.set(code, room)
    for (const player of players) {
      player.roomCode = code
      socketPlayers.set(player.socketId, { code, token: player.token })
      io.sockets.sockets.get(player.socketId)?.join(code)
    }
    return room
  }

  function createPlayer(socket, slot, name) {
    return {
      token: randomUUID(),
      socketId: socket.id,
      name: playerName(name, slot),
      connected: true,
      ready: false,
      roomCode: null,
      slot,
      lastActionAt: 0,
      input: { left: false, right: false, jump: false, kick: false, power: false },
    }
  }

  function startRound(room) {
    if (room.players.length !== 2 || room.players.some((player) => !player.connected || !player.ready)) {
      room.phase = 'waiting'
      room.countdownEndsAt = null
      broadcast(room)
      return
    }
    room.round += 1
    room.seed = randomInt(1, 0x7fffffff)
    room.phase = 'running'
    room.countdownEndsAt = null
    room.players.forEach((player) => { player.ready = false })
    if (room.game === 'tic-tac-toe') {
      const scores = room.gameState?.scores ?? [0, 0]
      room.gameState = { board: Array(9).fill(0), turn: (room.round - 1) % 2, scores, winner: null }
    } else if (room.game === 'ball-rush') {
      room.gameState = { players: [null, null] }
    } else if (room.game === 'football-19') {
      room.gameState = { scores: [0, 0], attempts: [0, 0] }
    } else if (room.game === 'head-football') {
      room.gameState = {
        selections: room.gameState?.selections ?? [null, null],
        match: createHeadFootballMatch(room.gameState?.selections ?? [null, null]),
      }
      room.players.forEach((player) => {
        player.input = { left: false, right: false, jump: false, kick: false, power: false }
      })
      startHeadFootballTimer(room)
    } else if (room.game === 'tap-tape-arena') {
      room.gameState = { scores: [0, 0], winner: null }
      room.players.forEach((player) => { player.lastActionAt = 0 })
      startTapTimer(room)
    } else if (room.game === 'ping-pong' || room.game === 'basketball-stars' || room.game === 'cannon-duel') {
      room.gameState = createAuthoritativeGame(room.game, room.seed)
      startAuthoritativeTimer(room)
    } else {
      room.gameState = null
    }
    broadcast(room)
    io.to(room.code).emit('arena:started', { game: room.game, round: room.round, seed: room.seed })
  }

  function startCountdown(room) {
    if (room.phase === 'countdown' || room.phase === 'running') return
    if (room.players.length !== 2 || room.players.some((player) => !player.connected || !player.ready)) return
    room.phase = 'countdown'
    room.countdownEndsAt = Date.now() + countdownMs
    room.countdownTimer = setTimeout(() => startRound(room), countdownMs)
    room.countdownTimer.unref?.()
    broadcast(room)
  }

  function acknowledge(socket, callback, room, player) {
    if (typeof callback === 'function') callback({ ok: true, code: room.code, token: player.token, slot: room.players.indexOf(player) })
    socket.emit('arena:room:joined', { code: room.code, token: player.token })
    broadcast(room)
  }

  function finishTicTacToe(room, winner) {
    const state = room.gameState
    state.winner = winner
    if (winner === 0 || winner === 1) state.scores[winner] += 1
    room.phase = 'finished'
    room.players.forEach((player) => { player.ready = false })
    broadcast(room)
  }

  io.on('connection', (socket) => {
    socket.on('arena:room:create', (payload, callback) => {
      if (!GAME_IDS.has(payload?.game)) return callback?.({ ok: false, error: 'Jeu en ligne inconnu.' })
      if (lookup(socket)) return callback?.({ ok: false, error: 'Vous êtes déjà dans une salle.' })
      if (rooms.size >= 300) return callback?.({ ok: false, error: 'Les salles sont temporairement complètes.' })
      const player = createPlayer(socket, 0, payload?.name)
      const room = makeRoom(payload.game, [player])
      acknowledge(socket, callback, room, player)
    })

    socket.on('arena:room:join', (payload, callback) => {
      const code = typeof payload?.code === 'string' ? payload.code.trim().toUpperCase() : ''
      const room = rooms.get(code)
      if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code) || !room || room.phase === 'finished') {
        return callback?.({ ok: false, error: 'Salle introuvable ou déjà terminée.' })
      }
      if (payload?.game !== undefined && payload.game !== room.game) {
        return callback?.({ ok: false, error: 'Cette salle est réservée à un autre jeu.' })
      }
      if (room.players.length >= 2) return callback?.({ ok: false, error: 'Cette salle est déjà complète.' })
      if (lookup(socket)) return callback?.({ ok: false, error: 'Vous êtes déjà dans une salle.' })
      const player = createPlayer(socket, 1, payload?.name)
      room.players.push(player)
      player.roomCode = code
      socketPlayers.set(socket.id, { code, token: player.token })
      socket.join(code)
      acknowledge(socket, callback, room, player)
    })

    socket.on('arena:room:reconnect', (payload, callback) => {
      const code = typeof payload?.code === 'string' ? payload.code.toUpperCase() : ''
      const token = typeof payload?.token === 'string' ? payload.token : ''
      const room = rooms.get(code)
      const player = room?.players.find((item) => item.token === token)
      if (!room || !player || player.connected || room.phase === 'finished') {
        return callback?.({ ok: false, error: 'La reconnexion à cette salle a expiré.' })
      }
      if (room.disconnectTimer) clearTimeout(room.disconnectTimer)
      room.disconnectTimer = null
      player.connected = true
      player.socketId = socket.id
      socketPlayers.set(socket.id, { code, token })
      socket.join(code)
      if (room.players.every((item) => item.connected) && room.phase === 'paused') {
        const pauseDuration = room.pausedAt === null ? 0 : Date.now() - room.pausedAt
        room.players.forEach((item) => {
          if (item.lastActionAt) item.lastActionAt += pauseDuration
        })
        room.pausedAt = null
        if (room.pausedFrom === 'countdown') {
          room.players.forEach((item) => { item.ready = false })
          room.countdownEndsAt = null
          room.phase = 'waiting'
        } else {
          room.phase = 'running'
        }
        room.pausedFrom = null
      }
      acknowledge(socket, callback, room, player)
    })

    socket.on('arena:room:ready', (payload, callback) => {
      const entry = lookup(socket)
      if (!entry || !['waiting', 'countdown'].includes(entry.room.phase)) {
        return callback?.({ ok: false, error: 'La salle n’accepte pas les inscriptions.' })
      }
      if (entry.room.game === 'head-football' && payload?.ready
        && !entry.room.gameState.selections[entry.player.slot]) {
        return callback?.({ ok: false, error: 'Choisissez et validez votre club et votre joueur avant de vous déclarer prêt.' })
      }
      entry.player.ready = Boolean(payload?.ready)
      if (!entry.player.ready && entry.room.phase === 'countdown') {
        clearTimeout(entry.room.countdownTimer)
        entry.room.countdownTimer = null
        entry.room.phase = 'waiting'
        entry.room.countdownEndsAt = null
      }
      broadcast(entry.room)
      startCountdown(entry.room)
      callback?.({ ok: true })
    })

    socket.on('arena:head-football:selection', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      const { clubIndex, playerIndex } = payload ?? {}
      if (!room || room.game !== 'head-football' || !['waiting', 'countdown'].includes(room.phase)
        || player.ready || !Number.isInteger(clubIndex) || clubIndex < 0 || clubIndex >= 30
        || !Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= 40) {
        return callback?.({ ok: false, error: 'La sélection est invalide ou déjà verrouillée.' })
      }
      room.gameState.selections[player.slot] = { clubIndex, playerIndex }
      broadcast(room)
      callback?.({ ok: true })
    })

    socket.on('arena:ttt:move', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      const cell = payload?.cell
      if (!room || room.game !== 'tic-tac-toe' || room.phase !== 'running' || !Number.isInteger(cell)
        || cell < 0 || cell > 8 || room.gameState.turn !== player.slot || room.gameState.board[cell] !== 0) {
        return callback?.({ ok: false, error: 'Ce coup n’est pas autorisé.' })
      }
      const state = room.gameState
      state.board[cell] = player.slot + 1
      const line = WIN_LINES.find(([a, b, c]) => state.board[a] !== 0 && state.board[a] === state.board[b] && state.board[b] === state.board[c])
      if (line) {
        finishTicTacToe(room, player.slot)
      } else if (state.board.every((value) => value !== 0)) {
        finishTicTacToe(room, null)
      } else {
        state.turn = 1 - player.slot
        broadcast(room)
      }
      callback?.({ ok: true })
    })

    socket.on('arena:game:action', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      if (!room || room.phase !== 'running') {
        return callback?.({ ok: false, error: 'La partie n’est pas active.' })
      }

      if (room.game === 'football-19' && payload?.type === 'shot' && typeof payload.scored === 'boolean') {
        const state = room.gameState
        if (state.attempts[player.slot] >= 5) {
          return callback?.({ ok: false, error: 'Vos cinq tirs sont déjà terminés.' })
        }
        state.attempts[player.slot] += 1
        if (payload.scored) state.scores[player.slot] += 1
        if (state.attempts.every((attempts) => attempts >= 5)) {
          state.winner = state.scores[0] === state.scores[1] ? null : state.scores[0] > state.scores[1] ? 0 : 1
          room.phase = 'finished'
          room.players.forEach((entry) => { entry.ready = false })
        }
      } else if (['ping-pong', 'basketball-stars', 'cannon-duel'].includes(room.game)) {
        const input = boundedObject(payload?.input, 2048)
        if (!input || !applyAuthoritativeInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Action invalide ou non autorisée pour cette manche.' })
        }
        callback?.({ ok: true })
        return
      } else if (room.game === 'head-football' && payload?.type === 'input') {
        const input = sanitizeHeadFootballInput(payload.input)
        if (room.phase !== 'running' || !input || room.gameState.match?.status === 'finished') {
          return callback?.({ ok: false, error: 'Les commandes de match sont invalides ou la manche est inactive.' })
        }
        player.input = input
        callback?.({ ok: true })
        return
      } else if (room.game === 'tap-tape-arena' && payload?.type === 'tap') {
        const now = Date.now()
        if (now - player.lastActionAt < 65) {
          return callback?.({ ok: false, error: 'Action trop rapide.' })
        }
        player.lastActionAt = now
        const state = room.gameState
        if (state.winner !== null) return callback?.({ ok: false, error: 'La partie est terminée.' })
        state.scores[player.slot] += 1
        if (state.scores[player.slot] >= 100) {
          state.winner = player.slot
          room.phase = 'finished'
          room.players.forEach((entry) => { entry.ready = false })
          stopGameTimer(room)
        }
      } else {
        return callback?.({ ok: false, error: 'Action invalide pour ce jeu.' })
      }

      broadcast(room)
      callback?.({ ok: true })
    })

    socket.on('arena:state', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      const state = boundedObject(payload?.state, 24_000)
      if (!room || room.phase !== 'running' || room.game === 'tic-tac-toe'
        || room.game === 'ping-pong' || room.game === 'basketball-stars' || room.game === 'cannon-duel'
        || room.game === 'head-football' || !state) {
        return callback?.({ ok: false, error: 'État de partie non autorisé ou invalide.' })
      }
      if (room.game === 'ball-rush') {
        const { x, y, lane, score, coins, alive } = state
        if (!Number.isFinite(x) || x < -3.2 || x > 3.2
          || !Number.isFinite(y) || y < 0 || y > 12
          || !Number.isInteger(lane) || lane < 0 || lane > 2
          || !Number.isFinite(score) || score < 0 || score > 10_000_000
          || !Number.isFinite(coins) || coins < 0 || coins > 1_000_000
          || typeof alive !== 'boolean') {
          return callback?.({ ok: false, error: 'État de course invalide.' })
        }
        const players = room.gameState?.players ?? [null, null]
        const previous = players[player.slot]
        const now = Date.now()
        const elapsedMs = previous ? now - previous.updatedAt : Number.POSITIVE_INFINITY
        const maxPlausibleScoreIncrease = Math.max(8, elapsedMs * 0.11 + 2)
        if (previous && (elapsedMs < 35
          || score < previous.score
          || score - previous.score > maxPlausibleScoreIncrease
          || !previous.alive && (alive || score !== previous.score))) {
          return callback?.({ ok: false, error: 'Mise à jour de course trop rapide ou incohérente.' })
        }
        players[player.slot] = { x, y, lane, score, coins, alive, updatedAt: now }
        room.gameState = { players }
        if (players.every((entry) => entry && !entry.alive)) {
          room.phase = 'finished'
          room.players.forEach((entry) => { entry.ready = false })
        }
      } else {
        if (player.slot !== 0) {
          return callback?.({ ok: false, error: 'Seul le joueur hôte peut publier cet état.' })
        }
        room.gameState = state
      }
      broadcast(room)
      callback?.({ ok: true })
    })

    socket.on('arena:room:finish', (_payload, callback) => {
      const entry = lookup(socket)
      if (!entry || entry.room.phase !== 'running' || entry.player.slot !== 0
        || ['ball-rush', 'ping-pong', 'basketball-stars', 'head-football'].includes(entry.room.game)) {
        return callback?.({ ok: false, error: 'Cette manche ne peut pas être terminée par ce joueur.' })
      }
      entry.room.phase = 'finished'
      entry.room.players.forEach((player) => { player.ready = false })
      broadcast(entry.room)
      callback?.({ ok: true })
    })

    socket.on('arena:input', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      const input = boundedObject(payload?.input, 2048)
      if (!room || room.phase !== 'running' || room.game === 'tic-tac-toe' || !input) {
        return callback?.({ ok: false, error: 'Entrée de jeu non autorisée ou invalide.' })
      }
      if (room.game === 'ping-pong' || room.game === 'basketball-stars' || room.game === 'cannon-duel') {
        if (!applyAuthoritativeInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Action invalide ou non autorisée pour cette manche.' })
        }
        callback?.({ ok: true })
        return
      }
      const recipient = room.players.find((item) => item.slot === 0)
      if (recipient?.socketId) {
        io.to(recipient.socketId).emit('arena:remote-input', { slot: player.slot, input })
      }
      callback?.({ ok: true })
    })

    socket.on('arena:room:rematch', (_payload, callback) => {
      const entry = lookup(socket)
      if (!entry || entry.room.phase !== 'finished') return callback?.({ ok: false, error: 'La manche en cours n’est pas terminée.' })
      entry.player.ready = true
      if (entry.room.players.every((player) => player.connected && player.ready)) {
        entry.room.phase = 'waiting'
        if (entry.room.game === 'tic-tac-toe') {
          entry.room.gameState = { ...entry.room.gameState, board: Array(9).fill(0), winner: null }
        } else if (entry.room.game === 'football-19') {
          entry.room.gameState = { scores: [0, 0], attempts: [0, 0] }
        } else if (entry.room.game === 'head-football') {
          entry.room.gameState = {
            selections: entry.room.gameState.selections,
            match: null,
          }
          entry.room.players.forEach((player) => {
            player.input = { left: false, right: false, jump: false, kick: false, power: false }
          })
        } else if (entry.room.game === 'tap-tape-arena') {
          entry.room.gameState = { scores: [0, 0], winner: null }
        }
      }
      broadcast(entry.room)
      startCountdown(entry.room)
      callback?.({ ok: true })
    })

    socket.on('arena:room:leave', (_payload, callback) => {
      const entry = lookup(socket)
      if (!entry) return callback?.({ ok: true })
      removeRoom(entry.room)
      callback?.({ ok: true })
    })

    socket.on('disconnect', () => {
      const entry = lookup(socket)
      if (!entry) return
      const { room, player } = entry
      player.connected = false
      player.socketId = null
      player.input = { left: false, right: false, jump: false, kick: false, power: false }
      socketPlayers.delete(socket.id)
      if (room.phase === 'running' || room.phase === 'countdown') {
        room.pausedFrom = room.phase
        if (room.countdownTimer) clearTimeout(room.countdownTimer)
        room.countdownTimer = null
        room.phase = 'paused'
        room.countdownEndsAt = null
        room.pausedAt = Date.now()
      }
      broadcast(room)
      room.disconnectTimer = setTimeout(() => {
        if (!player.connected) removeRoom(room)
      }, roomGraceMs)
      room.disconnectTimer.unref?.()
    })
  })

  return { rooms }
}
