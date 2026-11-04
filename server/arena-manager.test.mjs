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

async function setup(context, game, countdownMs = 20) {
  const server = createMosswingServer({ port: 0, countdownMs })
  const address = await server.start()
  const sockets = []
  context.after(async () => {
    sockets.forEach((socket) => socket.disconnect())
    await server.stop()
  })
  async function connect() {
    const socket = createSocket(`http://127.0.0.1:${address.port}`, { transports: ['websocket'], reconnection: false })
    sockets.push(socket)
    await once(socket, 'connect')
    return socket
  }
  const first = await connect()
  const second = await connect()
  const created = await emitAck(first, 'arena:room:create', { game, name: 'Pilote A' })
  assert.equal(created.ok, true)
  const joined = await emitAck(second, 'arena:room:join', { game, code: created.code, name: 'Pilote B' })
  assert.equal(joined.ok, true)
  return { server, first, second, created, joined }
}

test('validates Tic-Tac-Toe turns and synchronizes the winning board', async (context) => {
  const { first, second } = await setup(context, 'tic-tac-toe')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await Promise.all([firstStarted, secondStarted])

  assert.equal((await emitAck(second, 'arena:ttt:move', { cell: 0 })).ok, false)
  assert.equal((await emitAck(first, 'arena:ttt:move', { cell: 0 })).ok, true)
  assert.equal((await emitAck(first, 'arena:ttt:move', { cell: 1 })).ok, false)
  assert.equal((await emitAck(second, 'arena:ttt:move', { cell: 3 })).ok, true)
  await emitAck(first, 'arena:ttt:move', { cell: 1 })
  await emitAck(second, 'arena:ttt:move', { cell: 4 })
  const finalState = waitFor(second, 'arena:state', (state) => state.phase === 'finished')
  assert.equal((await emitAck(first, 'arena:ttt:move', { cell: 2 })).ok, true)
  const result = await finalState
  assert.deepEqual(result.gameState.board, [1, 1, 1, 2, 2, 0, 0, 0, 0])
  assert.equal(result.gameState.winner, 0)
  assert.deepEqual(result.gameState.scores, [1, 0])
})

test('scores two five-shot Football 19 rounds in shared room state', async (context) => {
  const { first, second, created } = await setup(context, 'football-19')
  assert.equal((await emitAck(first, 'arena:room:join', {
    game: 'tap-tape-arena',
    code: created.code,
  })).ok, false)
  const started = Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running'),
    waitFor(second, 'arena:state', (state) => state.phase === 'running'),
  ])
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started

  assert.equal((await emitAck(first, 'arena:game:action', { type: 'shot', scored: true })).ok, true)
  assert.equal((await emitAck(first, 'arena:game:action', { type: 'shot', scored: 'yes' })).ok, false)
  for (let shot = 1; shot < 5; shot += 1) {
    assert.equal((await emitAck(first, 'arena:game:action', { type: 'shot', scored: false })).ok, true)
  }
  for (let shot = 0; shot < 4; shot += 1) {
    assert.equal((await emitAck(second, 'arena:game:action', { type: 'shot', scored: false })).ok, true)
  }

  const finished = waitFor(first, 'arena:state', (state) => state.phase === 'finished')
  assert.equal((await emitAck(second, 'arena:game:action', { type: 'shot', scored: false })).ok, true)
  const result = await finished
  assert.deepEqual(result.gameState.scores, [1, 0])
  assert.deepEqual(result.gameState.attempts, [5, 5])
  assert.equal(result.gameState.winner, 0)
})

test('synchronizes and rate-limits Tape-Tape taps', async (context) => {
  const { first, second } = await setup(context, 'tap-tape-arena')
  const started = Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running'),
    waitFor(second, 'arena:state', (state) => state.phase === 'running'),
  ])
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started

  assert.equal((await emitAck(first, 'arena:game:action', { type: 'tap' })).ok, true)
  assert.equal((await emitAck(first, 'arena:game:action', { type: 'tap' })).ok, false)
  await new Promise((resolve) => setTimeout(resolve, 75))
  const synced = waitFor(second, 'arena:state', (state) => state.gameState?.scores?.[0] === 2)
  assert.equal((await emitAck(first, 'arena:game:action', { type: 'tap' })).ok, true)
  assert.deepEqual((await synced).gameState.scores, [2, 0])

  const decayed = waitFor(second, 'arena:state', (state) => state.gameState?.scores?.[0] < 2)
  assert.ok((await decayed).gameState.scores[0] < 2)
})

test('publishes a client-clock-independent countdown duration', async (context) => {
  const { first, second } = await setup(context, 'ping-pong', 3000)
  const firstCountdown = waitFor(first, 'arena:state', (state) => state.phase === 'countdown')
  const secondCountdown = waitFor(second, 'arena:state', (state) => state.phase === 'countdown')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const [firstState, secondState] = await Promise.all([firstCountdown, secondCountdown])
  for (const state of [firstState, secondState]) {
    assert.ok(state.countdownRemainingMs > 0)
    assert.ok(state.countdownRemainingMs <= 3000)
  }
})

test('runs Ping-Pong from server state and rejects client-published physics', async (context) => {
  const { first, second } = await setup(context, 'ping-pong')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const [firstState] = await Promise.all([firstStarted, secondStarted])
  assert.equal(firstState.gameState.state, 'serve')
  assert.equal((await emitAck(first, 'arena:state', { state: { ball: { x: 1 } } })).ok, false)
  assert.equal((await emitAck(second, 'arena:input', { input: { type: 'serve' } })).ok, false)

  const moved = waitFor(second, 'arena:state', (state) => state.gameState?.players?.[1]?.targetX === 0.3)
  assert.equal((await emitAck(second, 'arena:input', { input: { type: 'move', x: 0.3, y: 2.8 } })).ok, true)
  assert.equal((await moved).gameState.players[1].targetX, 0.3)
  const serving = waitFor(second, 'arena:state', (state) => state.gameState?.state === 'play')
  assert.equal((await emitAck(first, 'arena:input', { input: { type: 'serve' } })).ok, true)
  assert.equal((await serving).gameState.state, 'play')
  assert.equal((await emitAck(first, 'arena:input', { input: { type: 'serve' } })).ok, false)
  assert.equal((await emitAck(second, 'arena:room:finish')).ok, false)
  assert.equal((await emitAck(first, 'arena:room:finish')).ok, false)
})

test('runs Basketball from server physics and accepts only turn-legal shots', async (context) => {
  const { first, second } = await setup(context, 'basketball-stars')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await Promise.all([firstStarted, secondStarted])

  assert.equal((await emitAck(first, 'arena:state', { state: { score: [99, 0] } })).ok, false)
  assert.equal((await emitAck(second, 'arena:input', { input: { type: 'shot', back: 0, rise: 0 } })).ok, false)
  const shotState = waitFor(second, 'arena:state', (state) => state.gameState?.phase === 'fly')
  assert.equal((await emitAck(first, 'arena:input', { input: { type: 'shot', back: 70 / 900, rise: 0.1 } })).ok, true)
  const snapshot = await shotState
  assert.equal(snapshot.gameState.phase, 'fly')
  assert.deepEqual(snapshot.gameState.score, [0, 0])
  const scored = await waitFor(second, 'arena:state', (state) => state.gameState?.score?.[0] === 3)
  assert.deepEqual(scored.gameState.score, [3, 0])
  assert.equal((await emitAck(first, 'arena:room:finish')).ok, false)
})

test('validates both Ball Rush runners and finishes when both are eliminated', async (context) => {
  const { first, second } = await setup(context, 'ball-rush')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await Promise.all([firstStarted, secondStarted])

  const firstSnapshot = { x: -2.4, y: 0, lane: 0, score: 42, coins: 3, alive: true }
  assert.equal((await emitAck(first, 'arena:state', { state: firstSnapshot })).ok, true)
  assert.equal((await emitAck(second, 'arena:state', { state: { ...firstSnapshot, score: -1 } })).ok, false)
  await new Promise((resolve) => setTimeout(resolve, 200))
  assert.equal((await emitAck(first, 'arena:state', {
    state: { ...firstSnapshot, score: 52 },
  })).ok, true)
  await new Promise((resolve) => setTimeout(resolve, 200))
  assert.equal((await emitAck(first, 'arena:state', {
    state: { ...firstSnapshot, score: 1000 },
  })).ok, false)

  assert.equal((await emitAck(first, 'arena:state', {
    state: { ...firstSnapshot, score: 52, alive: false },
  })).ok, true)

  const finished = waitFor(second, 'arena:state', (state) => state.phase === 'finished')
  assert.equal((await emitAck(second, 'arena:state', {
    state: { x: 2.4, y: 1.5, lane: 2, score: 31, coins: 1, alive: false },
  })).ok, true)
  const result = await finished
  assert.deepEqual(result.gameState.players.map((player) => player.alive), [false, false])
  assert.deepEqual(result.gameState.players.map((player) => player.score), [52, 31])
})

test('locks independent Head Football selections and resumes disconnected matches', async (context) => {
  const { server, first, second, created } = await setup(context, 'head-football')

  assert.equal((await emitAck(first, 'arena:head-football:selection', {
    clubIndex: 30,
    playerIndex: 0,
  })).ok, false)
  assert.equal((await emitAck(first, 'arena:head-football:selection', {
    clubIndex: 2,
    playerIndex: 3,
  })).ok, true)
  assert.equal((await emitAck(second, 'arena:head-football:selection', {
    clubIndex: 7,
    playerIndex: 9,
  })).ok, true)
  assert.equal((await emitAck(first, 'arena:room:ready', { ready: true })).ok, true)
  assert.equal((await emitAck(first, 'arena:head-football:selection', {
    clubIndex: 4,
    playerIndex: 5,
  })).ok, false)

  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await emitAck(second, 'arena:room:ready', { ready: true })
  const [firstState, secondState] = await Promise.all([firstStarted, secondStarted])
  assert.deepEqual(firstState.gameState.selections, [{ clubIndex: 2, playerIndex: 3 }, { clubIndex: 7, playerIndex: 9 }])
  assert.equal(secondState.gameState.match.status, 'count')
  assert.equal((await emitAck(first, 'arena:state', { state: { score: [99, 99] } })).ok, false)
  assert.equal((await emitAck(first, 'arena:game:action', {
    type: 'input',
    input: { right: true, left: true },
  })).ok, false)
  const movement = waitFor(second, 'arena:state', (state) => state.phase === 'running'
    && state.gameState.match?.status === 'play'
    && state.gameState.match.players[0].x > 330
    && state.gameState.match.players[1].x < 936, 6000)
  assert.equal((await emitAck(first, 'arena:game:action', {
    type: 'input',
    input: { left: false, right: true, jump: false, kick: false, power: false },
  })).ok, true)
  assert.equal((await emitAck(second, 'arena:game:action', {
    type: 'input',
    input: { left: true, right: false, jump: false, kick: false, power: false },
  })).ok, true)
  const activeState = await movement

  const paused = waitFor(second, 'arena:state', (state) => state.phase === 'paused')
  first.disconnect()
  await paused

  const reconnect = createSocket(`http://127.0.0.1:${server.httpServer.address().port}`, {
    transports: ['websocket'],
    reconnection: false,
  })
  await once(reconnect, 'connect')
  const resumed = waitFor(second, 'arena:state', (state) => state.phase === 'running' && state.players[0].connected)
  const result = await emitAck(reconnect, 'arena:room:reconnect', {
    code: created.code,
    token: created.token,
  })
  assert.equal(result.ok, true)
  const resumedState = await resumed
  assert.deepEqual(resumedState.gameState.selections, firstState.gameState.selections)
  assert.equal(resumedState.gameState.match.status, 'play')
  assert.deepEqual(resumedState.gameState.match.scores, activeState.gameState.match.scores)
  reconnect.disconnect()
})

test('runs Canon Duel inputs from both assigned player slots on shared server state', async (context) => {
  const { first, second } = await setup(context, 'cannon-duel')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const [firstState, secondState] = await Promise.all([firstStarted, secondStarted])
  assert.equal(firstState.gameState.status, 'playing')
  assert.deepEqual(firstState.gameState.players.map((player) => player.hp), [3, 3])
  assert.deepEqual(secondState.gameState.players.map((player) => player.hp), [3, 3])
  assert.equal((await emitAck(first, 'arena:input', {
    input: { type: 'fire', slot: 1 },
  })).ok, false)

  const synchronized = waitFor(second, 'arena:state', (state) => state.gameState.bullets.length === 2)
  assert.equal((await emitAck(first, 'arena:input', { input: { type: 'fire' } })).ok, true)
  assert.equal((await emitAck(second, 'arena:input', { input: { type: 'fire' } })).ok, true)
  const snapshot = await synchronized
  assert.deepEqual(snapshot.gameState.bullets.map((bullet) => bullet.owner), [0, 1])
  assert.equal((await emitAck(first, 'arena:state', {
    state: { status: 'finished', winner: 0 },
  })).ok, false)
})
