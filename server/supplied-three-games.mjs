const COLOR_TILES = 25
const COLOR_MAX_LEVEL = COLOR_TILES
const COLOR_INPUT_TIMEOUT_MS = 20_000
const TAXI_DISTANCE = 6000
const TAXI_MAX_DT = 0.05
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

function makeColorPath(level, random) {
  const length = Math.min(COLOR_MAX_LEVEL, level + 2)
  if (level >= 6) return shuffle(Array.from({ length: COLOR_TILES }, (_, index) => index), random).slice(0, length)

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const path = [Math.floor(random() * COLOR_TILES)]
    while (path.length < length) {
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
    if (path.length === length) return path
  }
  return shuffle(Array.from({ length: COLOR_TILES }, (_, index) => index), random).slice(0, length)
}

function beginColorLevel(state, now) {
  state.path = makeColorPath(state.level, state.random)
  state.phase = 'showing'
  state.progress = [0, 0]
  state.failed = [false, false]
  state.completed = [false, false]
  const displaySpeed = Math.max(380, 700 - state.level * 25)
  state.phaseEndsAt = now + 1000 + state.path.length * (displaySpeed + 160)
  state.inputDeadline = null
}

function finishColorMatch(state) {
  state.status = 'finished'
  state.phase = 'finished'
  state.phaseEndsAt = null
  state.inputDeadline = null
  state.winner = state.scores[0] === state.scores[1]
    ? null
    : state.scores[0] > state.scores[1] ? 0 : 1
}

function checkColorMatch(state, now) {
  const bothDone = state.completed.every(Boolean)
  const bothFailed = state.failed.every(Boolean)
  if (state.failed[0] && state.completed[1] || state.failed[1] && state.completed[0]) {
    finishColorMatch(state)
    return
  }
  if (bothFailed) {
    finishColorMatch(state)
    return
  }
  if (bothDone) {
    state.level += 1
    if (state.level > COLOR_MAX_LEVEL) {
      finishColorMatch(state)
      return
    }
    beginColorLevel(state, now)
  }
}

export function createColorPathMatch(seed, now = Date.now()) {
  const state = {
    status: 'playing',
    phase: 'showing',
    level: 1,
    path: [],
    progress: [0, 0],
    scores: [0, 0],
    failed: [false, false],
    completed: [false, false],
    winner: null,
    phaseEndsAt: null,
    inputDeadline: null,
    lastActionAt: [0, 0],
    random: randomSource(seed),
  }
  beginColorLevel(state, now)
  return state
}

export function colorPathPlayerSnapshot(state, slot, now = Date.now()) {
  const snapshot = { ...state }
  delete snapshot.random
  delete snapshot.lastActionAt
  snapshot.path = state.phase === 'showing' ? [...state.path] : undefined
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
    || state.failed[slot] || state.completed[slot]
    || now - state.lastActionAt[slot] < 80) return false

  state.lastActionAt[slot] = now
  if (input.tile !== state.path[state.progress[slot]]) {
    state.failed[slot] = true
    checkColorMatch(state, now)
    return true
  }

  state.progress[slot] += 1
  if (state.progress[slot] === state.path.length) {
    state.completed[slot] = true
    state.scores[slot] = state.level
    checkColorMatch(state, now)
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
    state.failed = state.failed.map((failed, slot) => failed || !state.completed[slot])
    checkColorMatch(state, now)
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
    players: [0, 1].map(() => ({
      distance: 0,
      speed: 0,
      lane: 0,
      finishedAt: null,
      input: { left: false, right: false, gas: false, brake: false, horn: false },
    })),
    elapsed: 0,
    winner: null,
  }
}

export function applyMotoTaxiInput(state, slot, input) {
  const actions = ['left', 'right', 'gas', 'brake', 'horn']
  if (!state || state.status !== 'playing' || (slot !== 0 && slot !== 1)
    || !input || !actions.includes(input.action) || typeof input.pressed !== 'boolean'
    || state.players[slot].finishedAt !== null) return false
  state.players[slot].input[input.action] = input.pressed
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
    if (player.finishedAt !== null) continue
    const input = player.input
    const acceleration = input.brake ? -26 : input.gas ? 9 * (1 - player.speed / 30) + 1 : -2.5
    player.speed = Math.max(0, Math.min(30, player.speed + acceleration * safeDt))
    player.lane = Math.max(-8.4, Math.min(14.5, player.lane + ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * (2.5 + player.speed * 0.2) * safeDt))
    player.distance = Math.min(TAXI_DISTANCE, player.distance + player.speed * safeDt)
    if (player.distance >= TAXI_DISTANCE) player.finishedAt = state.elapsed
    changed = true
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
    players: state.players.map(({ distance, speed, lane, finishedAt }) => ({ distance, speed, lane, finishedAt })),
    scores: state.players.map((player) => player.distance),
    elapsed: state.elapsed,
    winner: state.winner,
  }
}
