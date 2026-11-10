import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'
import { io as createSocket } from 'socket.io-client'
import { createMosswingServer } from './server.mjs'
import { findWordSearchPath } from '../shared/word-search.mjs'

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

async function setup(context, game, countdownMs = 20, stake = 0, roomOptions = {}) {
  const server = createMosswingServer({ port: 0, countdownMs, roomGraceMs: 30 })
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
  const created = await emitAck(first, 'arena:room:create', { game, name: 'Pilote A', stake, ...roomOptions })
  assert.equal(created.ok, true)
  const joined = await emitAck(second, 'arena:room:join', { game, code: created.code, name: 'Pilote B', stake })
  assert.equal(joined.ok, true)
  return { server, first, second, created, joined }
}

test('creates and joins rooms for every supported arena game, including public Canon Duel rooms', async (context) => {
  const server = createMosswingServer({ port: 0 })
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

  const games = [
    'tic-tac-toe', 'ping-pong', 'basketball-stars', 'cannon-duel', 'ball-rush',
    'football-19', 'head-football', 'tap-tape-arena', 'memo-5x5', 'word-search', 'dictation-duel', 'forest-bridge', 'damned-maze', 'princess-race',
    'grotte-aux-couteaux', 'colonnes-du-canyon', 'arena-helice', 'duel-de-troncs', 'chess-3d', 'embuscade',
    'moto-taxi-afrique', 'chemin-de-couleurs', 'duel-de-cartes',
  ]
  for (const game of games) {
    const host = await connect()
    const guest = await connect()
    const waitingForHost = waitFor(host, 'arena:state', (state) => state.game === game && state.players.length === 1)
    const created = await emitAck(host, 'arena:room:create', {
      game,
      name: 'Hôte',
      isPublic: game === 'cannon-duel',
      stake: game === 'cannon-duel' ? 1 : 0,
    })
    assert.equal(created.ok, true, `${game} room creation`)
    await waitingForHost

    const waitingForGuest = waitFor(guest, 'arena:state', (state) => state.game === game && state.players.length === 2)
    const joined = await emitAck(guest, 'arena:room:join', {
      game,
      code: created.code,
      name: 'Invité',
      stake: game === 'cannon-duel' ? 1 : 0,
    })
    assert.equal(joined.ok, true, `${game} room join`)
    assert.equal((await waitingForGuest).yourSlot, 1)
  }
})

test('runs Moto Taxi controls through the server and relays the opponent input', async (context) => {
  const { server, first, second, created } = await setup(context, 'moto-taxi-afrique', 15)
  const started = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started
  const remoteInput = waitFor(second, 'arena:remote-input', (message) => message.slot === 0)
  assert.equal((await emitAck(first, 'arena:input', {
    input: { action: 'gas', pressed: true },
  })).ok, true)
  assert.deepEqual((await remoteInput).input, { action: 'gas', pressed: true })
  await new Promise((resolve) => setTimeout(resolve, 120))
  const state = server.arenaRooms.get(created.code).gameState
  assert.equal(state.players[0].distance, 0)
  state.phase = 'racing'
  await new Promise((resolve) => setTimeout(resolve, 120))
  assert.ok(state.players[0].distance > 0)
  assert.equal(state.players[0].input.gas, true)
})

test('runs Chemin de couleurs with hidden input path and server-checked tiles', async (context) => {
  const { server, first, second, created } = await setup(context, 'chemin-de-couleurs', 15)
  const started = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started
  const room = server.arenaRooms.get(created.code)
  const sequence = [...room.gameState.path]
  room.gameState.phase = 'input'
  room.gameState.phaseEndsAt = null
  room.gameState.inputDeadline = Date.now() + 10_000
  const updated = Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running' && state.gameState.progress[0] === 1),
    waitFor(second, 'arena:state', (state) => state.phase === 'running' && state.gameState.progress[0] === 1),
  ])
  assert.equal((await emitAck(first, 'arena:input', {
    input: { type: 'tile', tile: sequence[0] },
  })).ok, true)
  const [hostState, guestState] = await updated
  assert.equal(hostState.gameState.path, undefined)
  assert.equal(guestState.gameState.path, undefined)
  assert.equal(guestState.gameState.progress[0], 1)
  assert.equal((await emitAck(second, 'arena:input', {
    input: { type: 'tile', tile: (sequence[0] + 1) % 25 },
  })).ok, true)
  assert.equal(room.gameState.failed[1], true)
})

test('runs Duel de cartes with private hands, alternating turns and a timed reveal', async (context) => {
  const { server, first, second, created } = await setup(context, 'duel-de-cartes', 15)
  const started = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started
  const room = server.arenaRooms.get(created.code)
  assert.ok(room.gameState.hands[0].every(Number.isInteger))
  const privateFirst = waitFor(first, 'arena:state', (state) => state.phase === 'running' && state.gameState.turn === 1)
  const privateSecond = waitFor(second, 'arena:state', (state) => state.phase === 'running' && state.gameState.turn === 1)
  const firstCard = room.gameState.hands[0][0]
  assert.equal((await emitAck(first, 'arena:input', {
    input: { type: 'play-card', card: firstCard },
  })).ok, true)
  const [firstView, secondView] = await Promise.all([privateFirst, privateSecond])
  assert.equal(firstView.gameState.hands[1].every((card) => card === null), true)
  assert.equal(secondView.gameState.hands[0].every((card) => card === null), true)
  assert.equal(firstView.gameState.played[0], null)
  const secondCard = room.gameState.hands[1][0]
  const reveal = waitFor(first, 'arena:state', (state) => state.phase === 'running' && state.gameState.phase === 'reveal')
  assert.equal((await emitAck(second, 'arena:input', {
    input: { type: 'play-card', card: secondCard },
  })).ok, true)
  assert.deepEqual((await reveal).gameState.played, [firstCard, secondCard])
  const nextRound = waitFor(first, 'arena:state', (state) => state.phase === 'running' && state.gameState.round === 2)
  room.gameState.revealEndsAt = Date.now()
  await nextRound
  assert.equal(room.gameState.phase, 'play')
})

test('runs Chasse aux mots in a shared two-player room and scores validated selections', async (context) => {
  const { server, first, second, created } = await setup(context, 'word-search', 15, 0, { category: 'Animaux' })
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const game = server.arenaRooms.get(created.code).gameState.wordSearch
  assert.equal(game.category, 'Animaux')
  let selected = null
  let expectedPoints = 0
  for (let start = 0; start < game.grid.length && !selected; start += 1) {
    for (let end = 0; end < game.grid.length; end += 1) {
      const path = findWordSearchPath(game, start, end)
      if (path) {
        selected = { start, end }
        expectedPoints = path.points
        break
      }
    }
  }
  assert.ok(selected)
  const updatedStates = Promise.all([
    waitFor(first, 'arena:state', (state) =>
      state.phase === 'running' && state.gameState.wordSearch.found.length === 1,
    ),
    waitFor(second, 'arena:state', (state) =>
    state.phase === 'running' && state.gameState.wordSearch.found.length === 1,
    ),
  ])
  assert.equal((await emitAck(first, 'arena:game:action', {
    type: 'word-search:select', ...selected,
  })).ok, true)
  const [hostState, guestState] = await updatedStates
  assert.equal(guestState.gameState.wordSearch.scores[0], expectedPoints)
  assert.equal(guestState.gameState.wordSearch.foundCounts[0], 1)
  assert.equal(guestState.gameState.wordSearch.found[0].slot, 0)
  assert.deepEqual(hostState.gameState.wordSearch, guestState.gameState.wordSearch)
  assert.equal((await emitAck(first, 'arena:game:action', {
    type: 'word-search:select', ...selected,
  })).ok, false)
  assert.equal(game.scores[0], expectedPoints)

  for (const placement of game.placements) {
    if (game.found.some((entry) => entry.word === placement.word)) continue
    const result = await emitAck(second, 'arena:game:action', {
      type: 'word-search:select',
      start: placement.cells[0],
      end: placement.cells.at(-1),
    })
    assert.equal(result.ok, true)
  }
  assert.equal(server.arenaRooms.get(created.code).phase, 'finished')
  assert.equal(game.status, 'finished')
  assert.equal(game.found.length, game.words.length)
})

test('runs Dictée Éclair in a shared room and awards a round only for an exact copy', async (context) => {
  const { server, first, second, created } = await setup(context, 'dictation-duel', 15)
  const started = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started
  const game = server.arenaRooms.get(created.code).gameState.dictation
  const updates = Promise.all([
    waitFor(first, 'arena:state', (state) =>
      state.phase === 'running' && state.gameState.scores[0] === 1,
    ),
    waitFor(second, 'arena:state', (state) =>
      state.phase === 'running' && state.gameState.scores[0] === 1,
    ),
  ])
  assert.equal((await emitAck(first, 'arena:game:action', {
    type: 'dictation:submit', answer: game.sentence,
  })).ok, true)
  const [hostState, guestState] = await updates
  assert.equal(hostState.gameState.dictation.phase, 'intermission')
  assert.equal(hostState.gameState.dictation.lastResult.correct, true)
  assert.deepEqual(hostState.gameState, guestState.gameState)
  assert.equal((await emitAck(second, 'arena:game:action', {
    type: 'dictation:submit', answer: game.sentence,
  })).ok, false)
})

test('runs Grotte aux Couteaux from validated movement input and broadcasts shared positions', async (context) => {
  const { server, first, second, created } = await setup(context, 'grotte-aux-couteaux', 15, 100)
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const initial = await waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const initialZ = initial.gameState.players[0].z
  assert.equal((await emitAck(first, 'arena:input', { input: { direction: -1 } })).ok, true)
  const [hostUpdate, guestUpdate] = await Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running' && state.gameState.players[0].z < initialZ),
    waitFor(second, 'arena:state', (state) => state.phase === 'running' && state.gameState.players[0].z < initialZ),
  ])
  assert.equal(hostUpdate.gameState.players[0].z, guestUpdate.gameState.players[0].z)
  assert.equal((await emitAck(first, 'arena:input', { input: { z: 100, lives: 0 } })).ok, false)
  assert.equal(hostUpdate.gameState.players[0].lives, 20)
  const room = server.arenaRooms.get(created.code)
  room.gameState.status = 'finished'
  room.gameState.winner = 0
  const finished = await waitFor(first, 'arena:state', (state) => state.phase === 'finished')
  assert.equal(finished.winnerSlot, 0)
  assert.equal(finished.payout, 200)
})

test('runs Colonnes du Canyon with server-side movement and a shared course', async (context) => {
  const { server, first, second, created } = await setup(context, 'colonnes-du-canyon', 15, 100)
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const initial = await waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const initialX = initial.gameState.players[0].x
  assert.equal((await emitAck(first, 'arena:input', { input: { right: true } })).ok, true)
  const [hostUpdate, guestUpdate] = await Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running' && state.gameState.players[0].x > initialX),
    waitFor(second, 'arena:state', (state) => state.phase === 'running' && state.gameState.players[0].x > initialX),
  ])
  assert.equal(hostUpdate.gameState.players[0].x, guestUpdate.gameState.players[0].x)
  assert.equal(hostUpdate.gameState.pillars.length, 20)
  assert.equal((await emitAck(first, 'arena:input', { input: { x: 10000 } })).ok, false)
  const room = server.arenaRooms.get(created.code)
  room.gameState.status = 'finished'
  room.gameState.winner = 1
  const finished = await waitFor(second, 'arena:state', (state) => state.phase === 'finished')
  assert.equal(finished.winnerSlot, 1)
  assert.equal(finished.payout, 200)
})

test('runs Arène Hélice with validated movement and a shared server simulation', async (context) => {
  const { first, second } = await setup(context, 'arena-helice', 15)
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await waitFor(first, 'arena:state', (state) => state.phase === 'running')
  assert.equal((await emitAck(first, 'arena:input', {
    input: { x: 2, z: 0, jump: true },
  })).ok, false)
  const hostUpdate = waitFor(first, 'arena:state', (state) =>
    state.phase === 'running' && state.gameState.players[0].input.x === 0.75,
  )
  const guestUpdate = waitFor(second, 'arena:state', (state) =>
    state.phase === 'running' && state.gameState.players[0].input.x === 0.75,
  )
  const guestInput = waitFor(second, 'arena:remote-input', (message) => message.slot === 0)
  assert.equal((await emitAck(first, 'arena:input', {
    input: { x: 0.75, z: -0.25, jump: true },
  })).ok, true)
  const [hostState, guestState] = await Promise.all([hostUpdate, guestUpdate])
  assert.deepEqual((await guestInput).input, { x: 0.75, z: -0.25, jump: true })
  assert.deepEqual(hostState.gameState.players, guestState.gameState.players)
  assert.equal(hostState.gameState.players[0].input.jump, true)
  assert.equal(hostState.gameState.target, 5)
  const hostInput = waitFor(first, 'arena:remote-input', (message) => message.slot === 1)
  assert.equal((await emitAck(second, 'arena:input', {
    input: { x: -0.5, z: 0, jump: false },
  })).ok, true)
  assert.deepEqual((await hostInput).input, { x: -0.5, z: 0, jump: false })
  const guestJump = waitFor(first, 'arena:remote-input', (message) =>
    message.slot === 1 && message.input.jump === true,
  )
  assert.equal((await emitAck(second, 'arena:input', {
    input: { x: -0.5, z: 0, jump: true },
  })).ok, true)
  assert.equal((await guestJump).input.jump, true)
})

test('runs Duel de Troncs with validated lane and jump actions in shared rooms', async (context) => {
  const { first, second } = await setup(context, 'duel-de-troncs', 15)
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await waitFor(first, 'arena:state', (state) => state.phase === 'running')
  assert.equal((await emitAck(first, 'arena:input', {
    input: { action: 'admin' },
  })).ok, false)
  const hostUpdate = waitFor(first, 'arena:state', (state) =>
    state.phase === 'running' && state.gameState.players[0].lane === 1,
  )
  const guestUpdate = waitFor(second, 'arena:state', (state) =>
    state.phase === 'running' && state.gameState.players[0].lane === 1,
  )
  assert.equal((await emitAck(first, 'arena:input', {
    input: { action: 'right' },
  })).ok, true)
  const [hostState, guestState] = await Promise.all([hostUpdate, guestUpdate])
  assert.deepEqual(hostState.gameState.players, guestState.gameState.players)
  assert.equal(hostState.gameState.scores.length, 2)
  assert.ok(hostState.gameState.obstacles.length > 0)
  const firstPlayerJump = waitFor(first, 'arena:state', (state) =>
    state.phase === 'running' && state.gameState.players[0].jumpTime > 0,
  )
  assert.equal((await emitAck(first, 'arena:input', {
    input: { action: 'jump' },
  })).ok, true)
  await firstPlayerJump
  const secondPlayerJump = waitFor(second, 'arena:state', (state) =>
    state.phase === 'running' && state.gameState.players[1].jumpTime > 0,
  )
  assert.equal((await emitAck(second, 'arena:input', {
    input: { action: 'jump' },
  })).ok, true)
  await secondPlayerJump
  assert.equal((await emitAck(second, 'arena:state', { state: {} })).ok, false)
})

test('runs Princess Race with server dice, pays the winner in demo credits, and supports a rematch', async (context) => {
  const server = createMosswingServer({ port: 0, countdownMs: 15, forestFinishedMs: 60_000 })
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
  const wallets = ['princess-race-host-wallet', 'princess-race-guest-wallet']
  const created = await emitAck(first, 'arena:room:create', {
    game: 'princess-race', name: 'Chevalier OR', walletId: wallets[0], stake: 100, isPublic: true,
  })
  assert.equal(created.ok, true)
  const joined = await emitAck(second, 'arena:room:join', {
    game: 'princess-race', code: created.code, name: 'Chevalier BLEU', walletId: wallets[1], stake: 100,
  })
  assert.equal(joined.ok, true)

  const started = Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running'),
    waitFor(second, 'arena:state', (state) => state.phase === 'running'),
  ])
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const [firstRunning, secondRunning] = await started
  assert.deepEqual(firstRunning.gameState, secondRunning.gameState)
  assert.deepEqual(firstRunning.gameState.positions, [0, 0])
  assert.deepEqual(firstRunning.gameState.redDice, [3, 3])
  assert.equal((await emitAck(second, 'arena:input', { input: { die: 'white' } })).ok, false)

  const firstAction = waitFor(first, 'arena:state', (state) => state.gameState?.lastAction?.id === 1)
  assert.equal((await emitAck(first, 'arena:input', { input: { die: 'red', result: 6 } })).ok, true)
  const afterAttack = await firstAction
  assert.equal(afterAttack.gameState.lastAction.result >= 1 && afterAttack.gameState.lastAction.result <= 6, true)
  assert.equal(afterAttack.gameState.redDice[0], 2)
  assert.equal((await emitAck(first, 'arena:input', { input: { die: 'white' } })).ok, false)

  let state = afterAttack.gameState
  while (state.winner === null) {
    const player = state.turn === 0 ? first : second
    const nextActionId = state.actionSeq + 1
    const update = waitFor(player, 'arena:state', (next) => next.gameState?.actionSeq === nextActionId)
    assert.equal((await emitAck(player, 'arena:input', { input: { die: 'white' } })).ok, true)
    state = (await update).gameState
  }

  const finished = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out waiting for settled Princess Race room')), 3000)
    const check = () => {
      const room = server.arenaRooms.get(created.code)
      if (room?.phase !== 'finished' || !room.settled) return setTimeout(check, 5)
      clearTimeout(timer)
      resolve(room)
    }
    check()
  })
  assert.equal(finished.winnerSlot, state.winner)
  assert.equal(finished.payout, 200)

  async function balance(socket, walletId) {
    const response = waitFor(socket, 'arena:demo-wallet')
    socket.emit('arena:demo-wallet:request', { walletId })
    return (await response).balance
  }
  assert.equal(await balance(state.winner === 0 ? first : second, wallets[state.winner]), 10_100)
  assert.equal(await balance(state.winner === 0 ? second : first, wallets[1 - state.winner]), 9_900)

  const rematchStarted = waitFor(first, 'arena:state', (next) => next.phase === 'running' && next.round === 2)
  await Promise.all([
    emitAck(first, 'arena:room:rematch', { ready: true }),
    emitAck(second, 'arena:room:rematch', { ready: true }),
  ])
  const rematch = await rematchStarted
  assert.deepEqual(rematch.gameState.positions, [0, 0])
  assert.deepEqual(rematch.gameState.redDice, [3, 3])
})

test('restores a Princess Race room and its authoritative progress after reconnection', async (context) => {
  const server = createMosswingServer({ port: 0, countdownMs: 15, forestDisconnectMs: 100 })
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

  let first = await connect()
  const second = await connect()
  const created = await emitAck(first, 'arena:room:create', { game: 'princess-race' })
  await emitAck(second, 'arena:room:join', { game: 'princess-race', code: created.code })
  const started = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started
  const moved = waitFor(first, 'arena:state', (state) => state.gameState?.actionSeq === 1)
  await emitAck(first, 'arena:input', { input: { die: 'white' } })
  const beforeDisconnect = await moved
  const paused = waitFor(second, 'arena:state', (state) => state.phase === 'paused')
  first.disconnect()
  await paused

  first = await connect()
  const restored = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  assert.equal((await emitAck(first, 'arena:room:reconnect', { code: created.code, token: created.token })).ok, true)
  const resumed = await restored
  assert.deepEqual(resumed.gameState.positions, beforeDisconnect.gameState.positions)
  assert.deepEqual(resumed.gameState.redDice, beforeDisconnect.gameState.redDice)
  assert.equal(resumed.gameState.actionSeq, beforeDisconnect.gameState.actionSeq)
})

test('shares the seeded maze and validates movement for both online players', async (context) => {
  const { first, second } = await setup(context, 'damned-maze')
  const running = Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running'),
    waitFor(second, 'arena:state', (state) => state.phase === 'running'),
  ])
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const [firstState, secondState] = await running
  assert.equal(firstState.gameState.game, 'damned-maze')
  assert.deepEqual(firstState.gameState.maze, secondState.gameState.maze)
  assert.ok(firstState.gameState.monsters.length > 0)
  assert.deepEqual(firstState.gameState.monsters, secondState.gameState.monsters)
  assert.equal(firstState.gameState.floorTiles, undefined)
  assert.equal(firstState.gameState.players[0].input, undefined)

  assert.equal((await emitAck(first, 'arena:input', { input: { x: 2, z: 0 } })).ok, false)
  const start = firstState.gameState.players[0]
  const { grid, startX, startY } = firstState.gameState.maze
  const direction = [
    { x: 1, z: 0, dx: 1, dy: 0, axis: 'x' },
    { x: -1, z: 0, dx: -1, dy: 0, axis: 'x' },
    { x: 0, z: 1, dx: 0, dy: 1, axis: 'z' },
    { x: 0, z: -1, dx: 0, dy: -1, axis: 'z' },
  ].find(({ dx, dy }) => grid[startY + dy]?.[startX + dx] === 0)
  assert.ok(direction)
  const firstMoved = waitFor(first, 'arena:state', (state) => Math.abs(state.gameState.players[0][direction.axis] - start[direction.axis]) > 0.1)
  const secondMoved = waitFor(second, 'arena:state', (state) => Math.abs(state.gameState.players[0][direction.axis] - start[direction.axis]) > 0.1)
  assert.equal((await emitAck(first, 'arena:input', { input: { x: direction.x, z: direction.z } })).ok, true)
  const [movedByFirst, movedBySecond] = await Promise.all([firstMoved, secondMoved])
  assert.equal(movedByFirst.gameState.players[0].z, movedBySecond.gameState.players[0].z)

  const secondStart = movedByFirst.gameState.players[1]
  const playerOneMoved = waitFor(first, 'arena:state', (state) =>
    Math.abs(state.gameState.players[1][direction.axis] - secondStart[direction.axis]) > 0.1)
  const playerTwoMoved = waitFor(second, 'arena:state', (state) =>
    Math.abs(state.gameState.players[1][direction.axis] - secondStart[direction.axis]) > 0.1)
  assert.equal((await emitAck(second, 'arena:input', {
    input: { x: direction.x, z: direction.z },
  })).ok, true)
  const [guestState, hostState] = await Promise.all([playerOneMoved, playerTwoMoved])
  assert.deepEqual(guestState.gameState.players, hostState.gameState.players)
  assert.ok(Math.abs(guestState.gameState.players[1][direction.axis] - secondStart[direction.axis]) > 0.1)
})

test('pays the authoritative maze winner from the demo-credit stake pot', async (context) => {
  const server = createMosswingServer({ port: 0, countdownMs: 15 })
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
  const wallets = ['maze-stake-host-wallet', 'maze-stake-guest-wallet']
  const created = await emitAck(first, 'arena:room:create', {
    game: 'damned-maze', name: 'Éclaireur OR', walletId: wallets[0], stake: 100,
  })
  assert.equal(created.ok, true)
  assert.equal((await emitAck(second, 'arena:room:join', {
    game: 'damned-maze', code: created.code, name: 'Éclaireur BLEU', walletId: wallets[1], stake: 100,
  })).ok, true)
  const started = Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running'),
    waitFor(second, 'arena:state', (state) => state.phase === 'running'),
  ])
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started

  const room = server.arenaRooms.get(created.code)
  room.gameState.status = 'finished'
  room.gameState.winner = 1
  room.gameState.result = 'win'
  room.gameState.players[0].status = 'dead'
  room.gameState.players[1].status = 'won'
  const result = await waitFor(first, 'arena:state', (state) => state.phase === 'finished')
  assert.equal(result.winnerSlot, 1)
  assert.equal(result.payout, 200)

  async function getBalance(socket, walletId) {
    const update = waitFor(socket, 'arena:demo-wallet')
    socket.emit('arena:demo-wallet:request', { walletId })
    return (await update).balance
  }
  assert.equal(await getBalance(first, wallets[0]), 9_900)
  assert.equal(await getBalance(second, wallets[1]), 10_100)
})

test('expires a waiting maze room and removes a fully empty maze room', async (context) => {
  const server = createMosswingServer({
    port: 0,
    mazeWaitingMs: 30,
    mazeEmptyMs: 30,
    mazeDisconnectMs: 40,
  })
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

  const host = await connect()
  const expired = waitFor(host, 'arena:expired')
  const closed = waitFor(host, 'arena:closed')
  const waitingRoom = await emitAck(host, 'arena:room:create', { game: 'damned-maze' })
  assert.equal(waitingRoom.ok, true)
  assert.match((await expired).message, /10 minutes/)
  await closed
  assert.equal(server.arenaRooms.has(waitingRoom.code), false)

  const emptyRoom = await emitAck(host, 'arena:room:create', { game: 'damned-maze' })
  assert.equal(emptyRoom.ok, true)
  host.disconnect()
  await new Promise((resolve) => setTimeout(resolve, 90))
  assert.equal(server.arenaRooms.has(emptyRoom.code), false)
})

test('reconnects maze players without losing state and ends an unrecovered round', async (context) => {
  const server = createMosswingServer({
    port: 0,
    countdownMs: 15,
    mazeDisconnectMs: 45,
    mazeFinishedMs: 35,
  })
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

  let first = await connect()
  const second = await connect()
  const created = await emitAck(first, 'arena:room:create', { game: 'damned-maze' })
  assert.equal((await emitAck(second, 'arena:room:join', { game: 'damned-maze', code: created.code })).ok, true)
  const running = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const beforeDisconnect = await running

  const paused = waitFor(second, 'arena:state', (state) => state.phase === 'paused')
  first.disconnect()
  await paused
  first = await connect()
  const restored = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  assert.equal((await emitAck(first, 'arena:room:reconnect', { code: created.code, token: created.token })).ok, true)
  const reconnectedState = await restored
  assert.deepEqual(reconnectedState.gameState.maze, beforeDisconnect.gameState.maze)
  assert.deepEqual(reconnectedState.gameState.players, beforeDisconnect.gameState.players)

  const finished = waitFor(second, 'arena:state', (state) => state.phase === 'finished')
  const expired = waitFor(second, 'arena:closed')
  first.disconnect()
  const result = await finished
  assert.equal(result.gameState.winner, 1)
  assert.equal(result.gameState.result, 'opponent-disconnected')
  await expired
  assert.equal(server.arenaRooms.has(created.code), false)
})

test('expires forest, princess, and new game rooms through their configured waiting timeout', async (context) => {
  const server = createMosswingServer({ port: 0, forestWaitingMs: 25 })
  const address = await server.start()
  const host = createSocket(`http://127.0.0.1:${address.port}`, { transports: ['websocket'], reconnection: false })
  context.after(async () => {
    host.disconnect()
    await server.stop()
  })
  await once(host, 'connect')
  for (const game of ['forest-bridge', 'princess-race', 'grotte-aux-couteaux', 'colonnes-du-canyon']) {
    const expired = waitFor(host, 'arena:expired')
    const closed = waitFor(host, 'arena:closed')
    const created = await emitAck(host, 'arena:room:create', { game })
    assert.equal(created.ok, true)
    assert.match((await expired).message, /10 minutes/)
    await closed
    assert.equal(server.arenaRooms.has(created.code), false)
  }
})

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

test('shares the server-generated Memory board and allows both players to play simultaneously', async (context) => {
  const { first, second } = await setup(context, 'memo-5x5')
  const started = Promise.all([
    waitFor(first, 'arena:state', (state) => state.phase === 'running'),
    waitFor(second, 'arena:state', (state) => state.phase === 'running'),
  ])
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const [firstState, secondState] = await started
  assert.deepEqual(firstState.gameState.cards, secondState.gameState.cards)
  assert.equal(firstState.gameState.cards.length, 25)
  assert.equal(firstState.gameState.cards.filter((card) => card.isStar).length, 1)

  const matchingIds = new Map()
  for (const card of firstState.gameState.cards.filter((item) => !item.isStar)) {
    matchingIds.set(card.symbol, [...(matchingIds.get(card.symbol) ?? []), card.id])
  }
  const [firstPair, secondPair] = [...matchingIds.values()]
  const firstView = waitFor(first, 'arena:state', (state) => state.gameState.opened.length === 1)
  const secondView = waitFor(second, 'arena:state', (state) => state.gameState.opened.length === 1)
  assert.equal((await emitAck(first, 'arena:game:action', { type: 'memory-flip', cardId: firstPair[0] })).ok, true)
  assert.equal((await emitAck(second, 'arena:game:action', { type: 'memory-flip', cardId: secondPair[0] })).ok, true)
  const [firstOpened, secondOpened] = await Promise.all([firstView, secondView])
  assert.equal(firstOpened.gameState.cards[firstPair[0]].faceUp, true)
  assert.equal(firstOpened.gameState.cards[secondPair[0]].faceUp, false)
  assert.equal(secondOpened.gameState.cards[secondPair[0]].faceUp, true)
  assert.equal(secondOpened.gameState.cards[firstPair[0]].faceUp, false)

  const firstMatched = waitFor(first, 'arena:state', (state) => state.gameState.scores[0] === 1)
  const secondMatched = waitFor(second, 'arena:state', (state) => state.gameState.scores[1] === 1)
  assert.equal((await emitAck(first, 'arena:game:action', { type: 'memory-flip', cardId: firstPair[1] })).ok, true)
  assert.equal((await emitAck(second, 'arena:game:action', { type: 'memory-flip', cardId: secondPair[1] })).ok, true)
  const [firstResult, secondResult] = await Promise.all([firstMatched, secondMatched])
  assert.ok(firstResult.gameState.cards[firstPair[0]].matched && firstResult.gameState.cards[firstPair[1]].matched)
  assert.ok(secondResult.gameState.cards[secondPair[0]].matched && secondResult.gameState.cards[secondPair[1]].matched)
})

test('lists public rooms, requires equal demo stakes, and pays the winner from the server escrow', async (context) => {
  const server = createMosswingServer({ port: 0, countdownMs: 20 })
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
  const firstWallet = 'wallet-player-one'
  const secondWallet = 'wallet-player-two'
  const secondInitialBalance = waitFor(second, 'arena:demo-wallet', (wallet) => wallet.balance === 10_000)
  second.emit('arena:demo-wallet:request', { walletId: secondWallet })
  assert.equal((await secondInitialBalance).balance, 10_000)
  const firstBalance = waitFor(first, 'arena:demo-wallet', (wallet) => wallet.balance === 9_900)
  const roomListed = waitFor(first, 'arena:public-rooms', (rooms) => rooms.some((room) => room.stake === 100))
  const created = await emitAck(first, 'arena:room:create', {
    game: 'tic-tac-toe',
    name: 'Joueur A',
    walletId: firstWallet,
    isPublic: true,
    stake: 100,
  })
  assert.equal(created.ok, true)
  assert.equal((await firstBalance).balance, 9_900)
  assert.equal((await roomListed)[0].stake, 100)

  assert.equal((await emitAck(second, 'arena:room:join', {
    game: 'tic-tac-toe',
    code: created.code,
    walletId: secondWallet,
    stake: 50,
  })).ok, false)
  const secondBalance = waitFor(second, 'arena:demo-wallet', (wallet) => wallet.balance === 9_900)
  const roomRemoved = waitFor(first, 'arena:public-rooms', (rooms) => !rooms.some((room) => room.code === created.code))
  assert.equal((await emitAck(second, 'arena:room:join', {
    game: 'tic-tac-toe',
    code: created.code,
    walletId: secondWallet,
    stake: 100,
  })).ok, true)
  assert.equal((await secondBalance).balance, 9_900)
  await roomRemoved

  const started = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await started
  await emitAck(first, 'arena:ttt:move', { cell: 0 })
  await emitAck(second, 'arena:ttt:move', { cell: 3 })
  await emitAck(first, 'arena:ttt:move', { cell: 1 })
  await emitAck(second, 'arena:ttt:move', { cell: 4 })
  const winnerWallet = waitFor(first, 'arena:demo-wallet', (wallet) => wallet.balance === 10_100)
  const loserWallet = waitFor(second, 'arena:demo-wallet', (wallet) => wallet.balance === 9_900)
  const finished = waitFor(first, 'arena:state', (state) => state.phase === 'finished')
  assert.equal((await emitAck(first, 'arena:ttt:move', { cell: 2 })).ok, true)
  const state = await finished
  assert.equal(state.winnerSlot, 0)
  assert.equal(state.payout, 200)
  assert.equal((await winnerWallet).balance, 10_100)
  assert.equal((await loserWallet).balance, 9_900)
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

test('starts Forest Bridge quickly even when the multiplayer countdown is ten seconds', async (context) => {
  const { first, second } = await setup(context, 'forest-bridge', 10_000)
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  const readyAt = Date.now()
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await Promise.all([firstStarted, secondStarted])
  assert.ok(Date.now() - readyAt < 1500)
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

  const moved = waitFor(second, 'arena:state', (state) => state.gameState?.players?.[1]?.targetX === 120)
  assert.equal((await emitAck(second, 'arena:input', { input: { type: 'move', x: 120, y: 600 } })).ok, true)
  assert.equal((await moved).gameState.players[1].targetX, 120)
  assert.equal((await emitAck(first, 'arena:input', { input: { type: 'serve' } })).ok, false)
  const serving = waitFor(second, 'arena:state', (state) => state.gameState?.state === 'play')
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

test('ends Ball Rush when a runner reaches 20 obstacle hits and awards the opponent', async (context) => {
  const { first, second } = await setup(context, 'ball-rush')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await Promise.all([firstStarted, secondStarted])

  const firstSnapshot = { x: -2.4, y: 0, lane: 0, score: 42, coins: 3, hits: 0, alive: true }
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

  for (let hits = 1; hits < 20; hits += 1) {
    await new Promise((resolve) => setTimeout(resolve, 40))
    const snapshot = { ...firstSnapshot, score: 52, hits, alive: true }
    assert.equal((await emitAck(first, 'arena:state', { state: snapshot })).ok, true)
  }
  const finished = waitFor(second, 'arena:state', (state) => state.phase === 'finished')
  await new Promise((resolve) => setTimeout(resolve, 40))
  const finalSnapshot = { ...firstSnapshot, score: 52, hits: 20, alive: false }
  assert.equal((await emitAck(first, 'arena:state', { state: finalSnapshot })).ok, true)
  const result = await finished
  assert.equal(result.winnerSlot, 1)
  assert.equal(result.gameState.status, 'finished')
  assert.equal(result.gameState.winner, 1)
  assert.equal(result.gameState.players[0].hits, 20)
  assert.equal(result.gameState.players[0].alive, false)
  assert.equal(result.gameState.players[1].alive, true)
  assert.equal((await emitAck(second, 'arena:state', {
    state: { x: 2.4, y: 1.5, lane: 2, score: 31, coins: 1, hits: 0, alive: true },
  })).ok, false)
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
  await new Promise((resolve) => setTimeout(resolve, 60))
  assert.equal(server.arenaRooms.has(created.code), true)

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
  assert.deepEqual(firstState.gameState.players.map((player) => player.hp), [20, 20])
  assert.deepEqual(secondState.gameState.players.map((player) => player.hp), [20, 20])
  assert.equal((await emitAck(first, 'arena:input', {
    input: { type: 'fire', slot: 1 },
  })).ok, false)

  const hostShot = waitFor(first, 'arena:state', (state) => state.gameState.bullets.length === 1)
  const hostShotForGuest = waitFor(second, 'arena:state', (state) => state.gameState.bullets.length === 1)
  assert.equal((await emitAck(first, 'arena:input', { input: { type: 'fire' } })).ok, true)
  const [hostState, hostStateForGuest] = await Promise.all([hostShot, hostShotForGuest])
  assert.deepEqual(hostState.gameState.bullets.map((bullet) => bullet.owner), [0])
  assert.deepEqual(hostStateForGuest.gameState.bullets.map((bullet) => bullet.owner), [0])
  assert.ok(hostState.gameState.bullets[0].y < 0.5)

  const guestShot = waitFor(first, 'arena:state', (state) => state.gameState.bullets.some((bullet) => bullet.owner === 1))
  const guestShotForGuest = waitFor(second, 'arena:state', (state) => state.gameState.bullets.some((bullet) => bullet.owner === 1))
  assert.equal((await emitAck(second, 'arena:input', { input: { type: 'fire' } })).ok, true)
  const [guestState, guestStateForGuest] = await Promise.all([guestShot, guestShotForGuest])
  assert.ok(guestState.gameState.bullets.some((bullet) => bullet.owner === 1 && bullet.y > 0.5))
  assert.ok(guestStateForGuest.gameState.bullets.some((bullet) => bullet.owner === 1 && bullet.y > 0.5))

  assert.equal((await emitAck(first, 'arena:state', {
    state: { status: 'finished', winner: 0 },
  })).ok, false)
})

test('runs the supplied 3D chess game with server-validated turns and synchronized captures', async (context) => {
  const { first, second } = await setup(context, 'chess-3d')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  const [firstState, secondState] = await Promise.all([firstStarted, secondStarted])
  assert.equal(firstState.gameState.status, 'playing')
  assert.equal(firstState.gameState.turn, 'w')
  assert.deepEqual(secondState.gameState.board, firstState.gameState.board)

  assert.equal((await emitAck(first, 'arena:input', { input: { from: 52, to: 36 } })).ok, true)
  assert.equal((await emitAck(first, 'arena:input', { input: { from: 11, to: 27 } })).ok, false)
  assert.equal((await emitAck(second, 'arena:input', { input: { from: 11, to: 27 } })).ok, true)
  const capture = waitFor(second, 'arena:state', (state) => state.gameState.scores[0] === 1)
  assert.equal((await emitAck(first, 'arena:input', { input: { from: 36, to: 27 } })).ok, true)
  const state = await capture
  assert.equal(state.gameState.board[27], 'wP')
  assert.deepEqual(state.gameState.scores, [1, 0])
  assert.equal(state.gameState.moves.length, 3)
})

test('resets the 3D chess board after a checkmate rematch', async (context) => {
  const { first, second } = await setup(context, 'chess-3d')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await Promise.all([firstStarted, secondStarted])

  assert.equal((await emitAck(first, 'arena:input', { input: { from: 53, to: 45 } })).ok, true)
  assert.equal((await emitAck(second, 'arena:input', { input: { from: 12, to: 28 } })).ok, true)
  assert.equal((await emitAck(first, 'arena:input', { input: { from: 54, to: 38 } })).ok, true)
  const finished = waitFor(first, 'arena:state', (state) => state.phase === 'finished')
  assert.equal((await emitAck(second, 'arena:input', { input: { from: 3, to: 39 } })).ok, true)
  assert.equal((await finished).winnerSlot, 1)

  const secondRound = waitFor(first, 'arena:state', (next) => next.phase === 'running' && next.round === 2)
  await Promise.all([
    emitAck(first, 'arena:room:rematch'),
    emitAck(second, 'arena:room:rematch'),
  ])
  const restarted = await secondRound
  assert.equal(restarted.gameState.turn, 'w')
  assert.deepEqual(restarted.gameState.scores, [0, 0])
  assert.equal(restarted.gameState.moves.length, 0)
})

test('runs Embuscade as a shared timed score duel and rejects impossible reports', async (context) => {
  const { first, second } = await setup(context, 'embuscade')
  const firstStarted = waitFor(first, 'arena:state', (state) => state.phase === 'running')
  const secondStarted = waitFor(second, 'arena:state', (state) => state.phase === 'running')
  await Promise.all([
    emitAck(first, 'arena:room:ready', { ready: true }),
    emitAck(second, 'arena:room:ready', { ready: true }),
  ])
  await Promise.all([firstStarted, secondStarted])

  assert.equal((await emitAck(first, 'arena:state', {
    state: { score: 400, kills: 1, finished: false },
  })).ok, false)
  assert.equal((await emitAck(first, 'arena:state', {
    state: { score: 300, kills: 1, finished: true },
  })).ok, true)
  const finished = waitFor(first, 'arena:state', (state) => state.phase === 'finished')
  assert.equal((await emitAck(second, 'arena:state', {
    state: { score: 100, kills: 1, finished: true },
  })).ok, true)
  const finalState = await finished
  assert.deepEqual(finalState.gameState.scores, [300, 100])
  assert.equal(finalState.winnerSlot, 0)

  const secondRound = waitFor(second, 'arena:state', (state) => state.phase === 'running' && state.round === 2)
  await Promise.all([
    emitAck(first, 'arena:room:rematch'),
    emitAck(second, 'arena:room:rematch'),
  ])
  const restarted = await secondRound
  assert.deepEqual(restarted.gameState.scores, [0, 0])
  assert.equal(restarted.gameState.remainingMs, 75_000)
})
