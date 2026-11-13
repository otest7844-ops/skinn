const RUN_GAME_IDS = new Set(['piaf-plume', 'lave-montante', 'mirror-run'])
const PUBLIC_RUN_GAME_IDS = new Set(['lave-montante', 'mirror-run'])
const RUN_LIMIT_MS = 180_000
const MAX_SCORE = 1_000_000

export function isSuppliedRunGame(game) {
  return RUN_GAME_IDS.has(game)
}

export function isPublicSuppliedRunGame(game) {
  return PUBLIC_RUN_GAME_IDS.has(game)
}

export function createSuppliedRunMatch(game, now = Date.now()) {
  if (!RUN_GAME_IDS.has(game)) throw new Error(`Unknown supplied run game: ${game}`)
  return {
    game,
    status: 'playing',
    scores: [0, 0],
    progress: [0, 0],
    positions: [null, null],
    completed: [false, false],
    winner: null,
    deadline: now + RUN_LIMIT_MS,
    lastUpdateAt: [0, 0],
  }
}

export function updateSuppliedRunMatch(state, slot, input, now = Date.now()) {
  const positionKeys = ['x', 'y', 'z', 'yaw', 'vx', 'vy', 'vz', 'bestY', 'coins', 'alive', 'done']
  const position = input?.position
  const validPosition = position === undefined || (
    position && typeof position === 'object' && !Array.isArray(position)
    && Object.keys(position).every((key) => positionKeys.includes(key))
    && ['x', 'y', 'z'].every((key) => Number.isFinite(position[key]))
    && Math.abs(position.x) <= 1000 && position.y >= -100 && position.y <= 500
    && Math.abs(position.z) <= 1000
    && ['yaw', 'vx', 'vy', 'vz'].every((key) => position[key] === undefined || Number.isFinite(position[key]))
    && (position.bestY === undefined || Number.isFinite(position.bestY) && position.bestY >= 0 && position.bestY <= 500)
    && (position.coins === undefined || Number.isSafeInteger(position.coins) && position.coins >= 0 && position.coins <= 100)
    && ['alive', 'done'].every((key) => position[key] === undefined || typeof position[key] === 'boolean')
  )
  if (!state || state.status !== 'playing' || (slot !== 0 && slot !== 1)
    || !input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).some((key) => !['progress', 'score', 'finished', 'position'].includes(key))
    || !Number.isFinite(input.progress) || input.progress < 0 || input.progress > 100
    || !Number.isSafeInteger(input.score) || input.score < 0 || input.score > MAX_SCORE
    || typeof input.finished !== 'boolean'
    || !validPosition
    || now >= state.deadline
    || state.completed[slot]
    || input.progress < state.progress[slot]
    || input.score < state.scores[slot]
    || !input.finished && now - state.lastUpdateAt[slot] < 100) {
    return { ok: false, error: 'Progression invalide ou partie terminée.' }
  }

  state.progress[slot] = input.progress
  state.scores[slot] = input.score
  if (position) state.positions[slot] = { ...position }
  state.lastUpdateAt[slot] = now
  state.completed[slot] = input.finished
  if (state.completed.every(Boolean)) {
    state.status = 'finished'
    state.winner = state.scores[0] === state.scores[1]
      ? null
      : state.scores[0] > state.scores[1] ? 0 : 1
  }
  return { ok: true }
}

export function tickSuppliedRunMatch(state, now = Date.now()) {
  if (!state || state.status !== 'playing' || now < state.deadline) return false
  state.status = 'finished'
  state.completed = [true, true]
  state.winner = state.scores[0] === state.scores[1]
    ? null
    : state.scores[0] > state.scores[1] ? 0 : 1
  return true
}
