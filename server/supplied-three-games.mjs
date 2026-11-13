const COLOR_TILES = 25
const COLOR_PATH_LENGTH = 10
const COLOR_INPUT_TIMEOUT_MS = 20_000
const TAXI_DISTANCE = 6000
const TAXI_MAX_DT = 0.05
const TAXI_LANE_LIMIT = 8.4
const TAXI_PENALTY_SECONDS = 5
const TAXI_SIGNAL_FIRST = 450
const TAXI_SIGNAL_INTERVAL = 700
const CARD_COUNT = 20
const CARD_HAND_SIZE = 10
const CARD_ROUNDS = 10
const CARD_SCORE_TO_WIN = 5
const CARD_REVEAL_MS = 3000

function randomSource(seed) {
  let state = (seed >>> 0) || 1
  return () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function shuffle(values, random) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1))
    ;[values[index], values[other]] = [values[other], values[index]]
  }
  return values
}

function makeColorPath(random) {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const path = [Math.floor(random() * COLOR_TILES)]
    while (path.length < COLOR_PATH_LENGTH) {
      const current = path.at(-1)
      const x = current % 5
      const y = Math.floor(current / 5)
      const neighbors = []
      if (x > 0) neighbors.push(current - 1)
      if (x < 4) neighbors.push(current + 1)
      if (y > 0) neighbors.push(current - 5)
      if (y < 4) neighbors.push(current + 5)
      const next = neighbors.filter((tile) => !path.includes(tile))
      if (next.length === 0) break
      path.push(next[Math.floor(random() * next.length)])
    }
    if (path.length === COLOR_PATH_LENGTH) return path
  }
  return [0, 1, 2, 3, 4, 9, 8, 7, 6, 5]
}

function beginColorTurn(state, slot, now, previousPath = null) {
  let path = makeColorPath(state.random)
  if (previousPath && path.every((tile, index) => tile === previousPath[index])) {
    path = previousPath.slice().reverse()
  }
  state.previousPath = previousPath ? [...previousPath] : null
  state.path = path
  state.turnSlot = slot
  state.turnNumber += 1
  state.phase = 'showing'
  state.progress[slot] = 0
  state.failed[slot] = false
  state.completed[slot] = false
  const displaySpeed = Math.max(380, 700 - state.level * 25)
  state.phaseEndsAt = now + 1000 + state.path.length * (displaySpeed + 160)
  state.inputDeadline = null
}

function finishColorTurn(state, now) {
  const currentSlot = state.turnSlot
  state.scores[currentSlot] = state.progress[currentSlot]
  if (currentSlot === 0) {
    const previousPath = state.path
    beginColorTurn(state, 1, now, previousPath)
    return
  }

  state.status = 'finished'
  state.phase = 'finished'
  state.phaseEndsAt = null
  state.inputDeadline = null
  state.winner = state.scores[0] === state.scores[1]
    ? null
    : state.scores[0] > state.scores[1] ? 0 : 1
}

export function createColorPathMatch(seed, now = Date.now()) {
  const state = {
    status: 'playing',
    phase: 'showing',
    level: 1,
    turnSlot: 0,
    turnNumber: -1,
    path: [],
    progress: [0, 0],
    scores: [0, 0],
    failed: [false, false],
    completed: [false, false],
    winner: null,
    phaseEndsAt: null,
    inputDeadline: null,
    lastActionAt: [0, 0],
    previousPath: null,
    random: randomSource(seed),
  }
  beginColorTurn(state, 0, now)
  return state
}

export function colorPathPlayerSnapshot(state, slot, now = Date.now()) {
  const snapshot = { ...state }
  delete snapshot.random
  delete snapshot.lastActionAt
  delete snapshot.previousPath
  snapshot.path = state.phase === 'showing' && state.turnSlot === slot
    ? [...state.path]
    : undefined
  snapshot.phaseRemainingMs = state.phaseEndsAt === null ? 0 : Math.max(0, state.phaseEndsAt - now)
  snapshot.progress = [...state.progress]
  snapshot.scores = [...state.scores]
  snapshot.failed = [...state.failed]
  snapshot.completed = [...state.completed]
  snapshot.yourProgress = state.progress[slot]
  snapshot.youFailed = state.failed[slot]
  return snapshot
}

export function applyColorPathInput(state, slot, input, now = Date.now()) {
  if (!state || state.status !== 'playing' || state.phase !== 'input'
    || (slot !== 0 && slot !== 1) || !input || input.type !== 'tile'
    || !Number.isInteger(input.tile) || input.tile < 0 || input.tile >= COLOR_TILES
    || slot !== state.turnSlot
    || state.failed[slot] || state.completed[slot]
    || now - state.lastActionAt[slot] < 80) return false

  state.lastActionAt[slot] = now
  if (input.tile !== state.path[state.progress[slot]]) {
    state.failed[slot] = true
    finishColorTurn(state, now)
    return true
  }

  state.progress[slot] += 1
  if (state.progress[slot] === state.path.length) {
    state.completed[slot] = true
    finishColorTurn(state, now)
  }
  return true
}

export function tickColorPathMatch(state, now = Date.now()) {
  if (!state || state.status !== 'playing') return false
  if (state.phase === 'showing' && now >= state.phaseEndsAt) {
    state.phase = 'input'
    state.phaseEndsAt = null
    state.inputDeadline = now + COLOR_INPUT_TIMEOUT_MS
    return true
  }
  if (state.phase === 'input' && now >= state.inputDeadline) {
    state.failed[state.turnSlot] = true
    finishColorTurn(state, now)
    return true
  }
  return false
}

export function createCardDuelMatch(seed) {
  const random = randomSource(seed)
  const deck = shuffle(Array.from({ length: CARD_COUNT }, (_, index) => index + 1), random)
  return {
    status: 'playing',
    phase: 'play',
    round: 1,
    turn: 0,
    scores: [0, 0],
    hands: [deck.slice(0, CARD_HAND_SIZE), deck.slice(CARD_HAND_SIZE)],
    played: [null, null],
    winner: null,
    revealEndsAt: null,
    lastResult: null,
  }
}

export function cardDuelPlayerSnapshot(state, slot, now = Date.now()) {
  const snapshot = {
    status: state.status,
    phase: state.phase,
    round: state.round,
    turn: state.turn,
    scores: [...state.scores],
    hands: state.hands.map((hand, index) => index === slot ? [...hand] : hand.map(() => null)),
    hasPlayed: state.played.map((card) => card !== null),
    played: state.phase === 'reveal' || state.phase === 'finished' ? [...state.played] : [null, null],
    winner: state.winner,
    phaseRemainingMs: state.revealEndsAt === null ? 0 : Math.max(0, state.revealEndsAt - now),
    lastResult: state.lastResult ? { ...state.lastResult } : null,
  }
  return snapshot
}

export function applyCardDuelInput(state, slot, input, now = Date.now()) {
  if (!state || state.status !== 'playing' || state.phase !== 'play'
    || (slot !== 0 && slot !== 1) || state.turn !== slot
    || !input || input.type !== 'play-card'
    || !Number.isInteger(input.card) || !state.hands[slot].includes(input.card)) return false

  state.hands[slot].splice(state.hands[slot].indexOf(input.card), 1)
  state.played[slot] = input.card
  if (slot === 0) {
    state.turn = 1
  } else {
    state.phase = 'reveal'
    state.revealEndsAt = now + CARD_REVEAL_MS
  }
  return true
}

export function tickCardDuelMatch(state, now = Date.now()) {
  if (!state || state.status !== 'playing' || state.phase !== 'reveal' || now < state.revealEndsAt) return false
  const winner = state.played[0] === state.played[1]
    ? null
    : state.played[0] > state.played[1] ? 0 : 1
  if (winner !== null) state.scores[winner] += 1
  state.lastResult = { round: state.round, winner, cards: [...state.played] }

  if (state.scores.some((score) => score >= CARD_SCORE_TO_WIN) || state.round >= CARD_ROUNDS) {
    state.status = 'finished'
    state.phase = 'finished'
    state.winner = state.scores[0] === state.scores[1]
      ? null
      : state.scores[0] > state.scores[1] ? 0 : 1
  } else {
    state.round += 1
    state.turn = 0
    state.played = [null, null]
    state.phase = 'play'
    state.revealEndsAt = null
  }
  return true
}

export function createMotoTaxiMatch() {
  return {
    status: 'playing',
    phase: 'intro',
    introRemaining: 8.6,
    players: [0, 1].map((slot) => ({
      distance: 0,
      speed: 0,
      lane: slot === 0 ? -4 : 4,
      finishedAt: null,
      penaltyRemaining: 0,
      penaltyReason: null,
      collisionCooldown: 0,
      input: { left: false, right: false, gas: false, brake: false, horn: false },
    })),
    elapsed: 0,
    winner: null,
  }
}

export function applyMotoTaxiInput(state, slot, input) {
  const actions = ['left', 'right', 'gas', 'brake', 'horn']
  if (!state || state.status !== 'playing' || (slot !== 0 && slot !== 1) || !input) return false
  const player = state.players[slot]
  if (input.action === 'violation') {
    if (state.phase !== 'racing' || input.reason !== 'collision'
      || !Number.isFinite(input.distance) || Math.abs(input.distance - player.distance) > 24
      || player.speed < 2 || player.finishedAt !== null || player.penaltyRemaining > 0
      || player.collisionCooldown > 0) return false
    player.penaltyRemaining = TAXI_PENALTY_SECONDS
    player.penaltyReason = 'COLLISION · '
    player.collisionCooldown = 2
    player.speed = 0
    player.input = { left: false, right: false, gas: false, brake: false, horn: false }
    return true
  }
  if (!actions.includes(input.action) || typeof input.pressed !== 'boolean'
    || player.finishedAt !== null || player.penaltyRemaining > 0) return false
  player.input[input.action] = input.pressed
  return true
}

export function tickMotoTaxiMatch(state, dt) {
  if (!state || state.status !== 'playing' || !Number.isFinite(dt) || dt <= 0) return false
  const safeDt = Math.min(TAXI_MAX_DT, dt)
  if (state.phase === 'intro') {
    state.introRemaining = Math.max(0, state.introRemaining - safeDt)
    if (state.introRemaining > 0) return true
    state.phase = 'racing'
  }
  state.elapsed += safeDt
  let changed = false
  for (const player of state.players) {
    player.collisionCooldown = Math.max(0, player.collisionCooldown - safeDt)
    if (player.finishedAt !== null) continue
    if (player.penaltyRemaining > 0) {
      player.penaltyRemaining = Math.max(0, player.penaltyRemaining - safeDt)
      player.speed = 0
      if (player.penaltyRemaining === 0) player.penaltyReason = null
      changed = true
      continue
    }
    const input = player.input
    const acceleration = input.brake ? -26 : input.gas ? 9 * (1 - player.speed / 30) + 1 : -2.5
    player.speed = Math.max(0, Math.min(30, player.speed + acceleration * safeDt))
    const previousDistance = player.distance
    const nextLane = player.lane + ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * (2.5 + player.speed * 0.2) * safeDt
    if (Math.abs(nextLane) > TAXI_LANE_LIMIT && player.speed > 2) {
      player.penaltyRemaining = TAXI_PENALTY_SECONDS
      player.penaltyReason = 'HORS ROUTE · '
      player.speed = 0
      player.input = { left: false, right: false, gas: false, brake: false, horn: false }
      changed = true
      continue
    }
    player.lane = Math.max(-TAXI_LANE_LIMIT, Math.min(TAXI_LANE_LIMIT, nextLane))
    player.distance = Math.min(TAXI_DISTANCE, player.distance + player.speed * safeDt)
    const firstCrossedSignal = Math.max(0, Math.floor((previousDistance - TAXI_SIGNAL_FIRST) / TAXI_SIGNAL_INTERVAL) + 1)
    const lastCrossedSignal = Math.floor((player.distance - TAXI_SIGNAL_FIRST) / TAXI_SIGNAL_INTERVAL)
    for (let signal = firstCrossedSignal; signal <= lastCrossedSignal; signal += 1) {
      const signalDistance = TAXI_SIGNAL_FIRST + signal * TAXI_SIGNAL_INTERVAL
      const signalPhase = (state.elapsed + signal * 5.3) % 16
      if (signalPhase >= 10 && signalPhase < 16) {
        player.distance = signalDistance - 1.5
        player.penaltyRemaining = TAXI_PENALTY_SECONDS
        player.penaltyReason = 'FEU ROUGE · '
        player.speed = 0
        player.input = { left: false, right: false, gas: false, brake: false, horn: false }
      }
    }
    if (player.distance >= TAXI_DISTANCE) player.finishedAt = state.elapsed
    changed = true
  }
  const [first, second] = state.players
  if (first.finishedAt === null && second.finishedAt === null
    && first.penaltyRemaining === 0 && second.penaltyRemaining === 0
    && Math.abs(first.distance - second.distance) < 2.2
    && Math.abs(first.lane - second.lane) < 1.6
    && first.speed > 2 && second.speed > 2) {
    for (const player of state.players) {
      player.penaltyRemaining = TAXI_PENALTY_SECONDS
      player.penaltyReason = 'COLLISION · '
      player.collisionCooldown = 2
      player.speed = 0
      player.input = { left: false, right: false, gas: false, brake: false, horn: false }
    }
  }
  const finishers = state.players
    .map((player, slot) => ({ slot, time: player.finishedAt }))
    .filter((entry) => entry.time !== null)
    .sort((a, b) => a.time - b.time)
  if (finishers.length) {
    state.status = 'finished'
    state.winner = finishers[0].slot
    state.players.forEach((player) => { player.input = { left: false, right: false, gas: false, brake: false, horn: false } })
    changed = true
  }
  return changed
}

export function motoTaxiPlayerSnapshot(state) {
  return {
    status: state.status,
    phase: state.phase,
    players: state.players.map(({ distance, speed, lane, finishedAt, penaltyRemaining, penaltyReason }) => ({
      distance, speed, lane, finishedAt, penaltyRemaining, penaltyReason,
    })),
    scores: state.players.map((player) => player.distance),
    elapsed: state.elapsed,
    winner: state.winner,
  }
}
