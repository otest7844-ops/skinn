import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'
import { io as createSocket } from 'socket.io-client'
import { createMosswingServer } from './server.mjs'

function emitAck(socket, event, payload = {}) {
  return new Promise((resolve) => socket.emit(event, payload, resolve))
}

function waitFor(socket, event, predicate = () => true, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(event, listener)
      reject(new Error(`Timed out waiting for ${event}`))
    }, timeout)
    function listener(payload) {
      if (!predicate(payload)) return
      clearTimeout(timer)
      socket.off(event, listener)
      resolve(payload)
    }
    socket.on(event, listener)
  })
}

test('creates two-player rooms, rejects a third player, and starts a shared round', async (context) => {
  const gameServer = createMosswingServer({ port: 0, countdownMs: 40, roundLimitMs: 100 })
  const address = await gameServer.start()
  const url = `http://127.0.0.1:${address.port}`
  const sockets = []

  context.after(async () => {
    sockets.forEach((socket) => socket.disconnect())
    await gameServer.stop()
  })

  async function connect() {
    const socket = createSocket(url, { transports: ['websocket'], reconnection: false })
    sockets.push(socket)
    await once(socket, 'connect')
    return socket
  }

  const host = await connect()
  const guest = await connect()
  const third = await connect()

  const created = await emitAck(host, 'room:create', { name: 'Pilote A' })
  assert.equal(created.ok, true)
  assert.match(created.code, /^[A-HJ-NP-Z2-9]{6}$/)

  const joined = await emitAck(guest, 'room:join', { code: created.code, name: 'Pilote B' })
  assert.equal(joined.ok, true)
  const denied = await emitAck(third, 'room:join', { code: created.code })
  assert.equal(denied.ok, false)

  const started = Promise.all([
    waitFor(host, 'game:started'),
    waitFor(guest, 'game:started'),
  ])
  await Promise.all([
    emitAck(host, 'room:ready', { ready: true }),
    emitAck(guest, 'room:ready', { ready: true }),
  ])
  const starts = await started
  assert.equal(starts[0].seed, starts[1].seed)
  assert.equal(starts[0].round, starts[1].round)

  const ownState = waitFor(host, 'room:state', (state) => state.phase === 'running')
  const guestState = waitFor(guest, 'room:state', (state) => state.phase === 'running')
  const guestSeesFlap = waitFor(guest, 'room:state', (state) => state.phase === 'running' && state.players[0].vy === 6.5)
  const acceptedFlap = await emitAck(host, 'game:flap')
  assert.equal(acceptedFlap.ok, true)
  const [hostSnapshot, guestSnapshot] = await Promise.all([ownState, guestState])
  await guestSeesFlap
  assert.equal(hostSnapshot.players.length, 2)
  assert.equal(hostSnapshot.players[0].name, 'Pilote A')
  assert.equal(hostSnapshot.players[1].name, 'Pilote B')
  assert.deepEqual(hostSnapshot.gates, guestSnapshot.gates)
  assert.notEqual(hostSnapshot.players[0].x, hostSnapshot.players[1].x)

  const result = await waitFor(host, 'room:state', (state) => state.phase === 'finished')
  assert.equal(result.result, 'temps')
  assert.equal(result.winnerSlot, null)

  const hostRematchState = waitFor(host, 'room:state', (state) => state.phase === 'finished' && state.players[0].ready)
  assert.equal((await emitAck(host, 'room:rematch')).ok, true)
  assert.equal((await hostRematchState).phase, 'finished')

  const rematchStarted = Promise.all([
    waitFor(host, 'game:started', (event) => event.round === 2),
    waitFor(guest, 'game:started', (event) => event.round === 2),
  ])
  assert.equal((await emitAck(guest, 'room:rematch')).ok, true)
  const nextRound = await rematchStarted
  assert.equal(nextRound[0].seed, nextRound[1].seed)
})

test('keeps the round active after one player is eliminated and broadcasts both creatures', async (context) => {
  const gameServer = createMosswingServer({ port: 0, countdownMs: 40, roundLimitMs: 5000 })
  const address = await gameServer.start()
  const url = `http://127.0.0.1:${address.port}`
  const sockets = []
  let flapTimer

  context.after(async () => {
    if (flapTimer) clearInterval(flapTimer)
    sockets.forEach((socket) => socket.disconnect())
    await gameServer.stop()
  })

  async function connect() {
    const socket = createSocket(url, { transports: ['websocket'], reconnection: false })
    sockets.push(socket)
    await once(socket, 'connect')
    return socket
  }

  const survivor = await connect()
  const opponent = await connect()
  const created = await emitAck(survivor, 'room:create', { name: 'Survivor' })
  await emitAck(opponent, 'room:join', { code: created.code, name: 'Opponent' })
  const started = waitFor(survivor, 'game:started')
  await Promise.all([
    emitAck(survivor, 'room:ready', { ready: true }),
    emitAck(opponent, 'room:ready', { ready: true }),
  ])
  await started

  flapTimer = setInterval(() => survivor.emit('game:flap'), 400)
  const eliminatedState = await waitFor(
    survivor,
    'room:state',
    (state) => state.phase === 'running' && state.players.some((player) => !player.alive),
    4000,
  )
  assert.equal(eliminatedState.phase, 'running')
  assert.equal(eliminatedState.players.filter((player) => player.alive).length, 1)
  assert.ok(eliminatedState.gates.length > 0)
  const eliminatedSlot = eliminatedState.players.findIndex((player) => !player.alive)
  const survivingSlot = 1 - eliminatedSlot
  const eliminatedSocket = eliminatedSlot === 0 ? survivor : opponent
  const survivingPlayer = eliminatedState.players[survivingSlot]
  assert.equal((await emitAck(eliminatedSocket, 'game:flap')).ok, false)
  const survivorContinues = waitFor(
    survivor,
    'room:state',
    (state) => state.phase === 'running'
      && state.players[survivingSlot].distance > survivingPlayer.distance,
  )
  clearInterval(flapTimer)
  flapTimer = null
  assert.equal((await survivorContinues).phase, 'running')

  const result = await waitFor(survivor, 'room:state', (state) => state.phase === 'finished', 4000)
  assert.equal(result.winnerSlot, survivingSlot)
})

test('restores a disconnected player with the room token', async (context) => {
  const gameServer = createMosswingServer({ port: 0, roomGraceMs: 300 })
  const address = await gameServer.start()
  const url = `http://127.0.0.1:${address.port}`
  const sockets = []

  context.after(async () => {
    sockets.forEach((socket) => socket.disconnect())
    await gameServer.stop()
  })

  async function connect() {
    const socket = createSocket(url, { transports: ['websocket'], reconnection: false })
    sockets.push(socket)
    await once(socket, 'connect')
    return socket
  }

  const host = await connect()
  const guest = await connect()
  const created = await emitAck(host, 'room:create')
  const joined = await emitAck(guest, 'room:join', { code: created.code })
  guest.disconnect()

  const replacement = await connect()
  const restored = await emitAck(replacement, 'room:reconnect', { code: joined.code, token: joined.token })
  assert.equal(restored.ok, true)
  assert.equal(restored.slot, 1)
  assert.equal(gameServer.rooms.has(created.code), true)
})

test('pauses a running round during disconnect and resumes it after reconnect', async (context) => {
  const gameServer = createMosswingServer({ port: 0, countdownMs: 40, roomGraceMs: 600, roundLimitMs: 5000 })
  const address = await gameServer.start()
  const url = `http://127.0.0.1:${address.port}`
  const sockets = []

  context.after(async () => {
    sockets.forEach((socket) => socket.disconnect())
    await gameServer.stop()
  })

  async function connect() {
    const socket = createSocket(url, { transports: ['websocket'], reconnection: false })
    sockets.push(socket)
    await once(socket, 'connect')
    return socket
  }

  const host = await connect()
  const guest = await connect()
  const created = await emitAck(host, 'room:create')
  const joined = await emitAck(guest, 'room:join', { code: created.code })
  const started = waitFor(host, 'game:started')
  await Promise.all([
    emitAck(host, 'room:ready', { ready: true }),
    emitAck(guest, 'room:ready', { ready: true }),
  ])
  await started

  const paused = waitFor(host, 'room:state', (state) => state.phase === 'paused')
  guest.disconnect()
  await paused

  const replacement = await connect()
  const resumed = waitFor(host, 'room:state', (state) => state.phase === 'running')
  const restored = await emitAck(replacement, 'room:reconnect', { code: joined.code, token: joined.token })
  assert.equal(restored.ok, true)
  await resumed
  assert.equal(gameServer.rooms.get(created.code).phase, 'running')
})
