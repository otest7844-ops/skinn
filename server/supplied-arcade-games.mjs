const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const HELIX_RADIUS = 10
const HELIX_PLAYER_RADIUS = 0.45
const HELIX_HUB_RADIUS = 1.15
const HELIX_HUB_HEIGHT = 1.25
const HELIX_BLADE_HEIGHT = 0.85
const HELIX_BLADE_LENGTH = HELIX_RADIUS - 0.8
const HELIX_BLADE_TIP = 0.4
const HELIX_JUMP_HEIGHT = 12
const HELIX_JUMP_BUFFER = 0.45
const HELIX_GRAVITY = 32
const HELIX_MOVE_SPEED = 6.4
const TRUNK_JUMP_DURATION = 0.8
const TRUNK_JUMP_HEIGHT = 2.4
const TRUNK_JUMP_INPUT_LEAD = 0.1

function randomUnit(state) {
  let value = state.randomState | 0
  value = value + 0x6d2b79f5 | 0
  let mixed = Math.imul(value ^ value >>> 15, 1 | value)
  mixed = mixed + Math.imul(mixed ^ mixed >>> 7, 61 | mixed) ^ mixed
  state.randomState = value >>> 0
  return ((mixed ^ mixed >>> 14) >>> 0) / 0x100000000
}

function makeHelixPlayer(slot) {
  return {
    slot,
    x: slot ? 6 : -6,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    alive: true,
    grounded: true,
    jumpBuffer: 0,
    input: { x: 0, z: 0, jump: false },
  }
}

export function createHelixArenaState(seed = 1) {
  const state = {
    game: 'arena-helice',
    status: 'playing',
    phase: 'countdown',
    round: 1,
    roundTime: 0,
    intermission: 0,
    countdown: 2.4,
    target: 5,
    scores: [0, 0],
    winner: null,
    roundWinner: null,
    randomState: seed >>> 0 || 1,
    spinAngle: Math.PI / 2,
    spinSpeed: 0,
    spinDirection: 1,
    targetDirection: 1,
    flipTimer: 15,
    players: [makeHelixPlayer(0), makeHelixPlayer(1)],
  }
  state.flipTimer = 14 + randomUnit(state) * 6
  return state
}

export function applyHelixArenaInput(state, slot, input) {
  if (!state || state.status !== 'playing' || !['countdown', 'playing'].includes(state.phase)
    || !Number.isInteger(slot) || (slot !== 0 && slot !== 1)
    || !input || typeof input !== 'object' || Array.isArray(input)) return false
  const keys = ['x', 'z', 'jump']
  if (!keys.some((key) => Object.hasOwn(input, key))
    || Object.keys(input).some((key) => !keys.includes(key))
    || ['x', 'z'].some((key) => Object.hasOwn(input, key)
      && (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < -1 || input[key] > 1))
    || Object.hasOwn(input, 'jump') && typeof input.jump !== 'boolean') return false
  const player = state.players[slot]
  if (Object.hasOwn(input, 'x')) player.input.x = input.x
  if (Object.hasOwn(input, 'z')) player.input.z = input.z
  if (Object.hasOwn(input, 'jump')) {
    if (input.jump && !player.input.jump) player.jumpBuffer = HELIX_JUMP_BUFFER
    player.input.jump = input.jump
  }
  return true
}

function helixBladeHit(localX, localSide) {
  let edgeFactor = 1
  if (localX > HELIX_BLADE_LENGTH) {
    const tipPosition = (localX - HELIX_BLADE_LENGTH) / HELIX_BLADE_TIP
    if (tipPosition > 1) return false
    edgeFactor = Math.sqrt(1 - tipPosition * tipPosition)
  }
  const progress = clamp(localX / HELIX_BLADE_LENGTH, 0, 1)
  const chord = 0.42 + 0.54 * Math.pow(Math.sin(Math.PI * Math.pow(progress, 0.8)), 0.75)
  const margin = HELIX_PLAYER_RADIUS * 0.85
  return localSide < chord * 0.44 * edgeFactor + margin
    && localSide > -chord * 0.56 * edgeFactor - margin
}

function killHelixPlayer(player) {
  player.alive = false
  const radius = Math.hypot(player.x, player.z) || 1
  player.vx = player.x / radius * 10
  player.vz = player.z / radius * 10
  player.vy = 9
  player.input = { x: 0, z: 0, jump: false }
}

function tickHelixPlayer(state, player, dt, checkCollisions) {
  if (!player.alive) {
    player.x += player.vx * dt
    player.z += player.vz * dt
    player.vy -= HELIX_GRAVITY * dt
    player.y += player.vy * dt
    return
  }
  const inputLength = Math.hypot(player.input.x, player.input.z)
  const inputX = inputLength > 1 ? player.input.x / inputLength : player.input.x
  const inputZ = inputLength > 1 ? player.input.z / inputLength : player.input.z
  const acceleration = player.grounded ? 70 : 38
  const approach = (current, target) => current < target
    ? Math.min(current + acceleration * dt, target)
    : Math.max(current - acceleration * dt, target)
  player.vx = approach(player.vx, inputX * HELIX_MOVE_SPEED)
  player.vz = approach(player.vz, inputZ * HELIX_MOVE_SPEED)
  player.x += player.vx * dt
  player.z += player.vz * dt
  player.jumpBuffer -= dt
  if (player.jumpBuffer > 0 && player.grounded) {
    player.vy = HELIX_JUMP_HEIGHT
    player.grounded = false
    player.jumpBuffer = 0
  }
  if (!player.grounded) {
    player.vy -= HELIX_GRAVITY * dt
    player.y += player.vy * dt
    if (player.y <= 0) {
      player.y = 0
      player.vy = 0
      player.grounded = true
    }
  }
  const radius = Math.hypot(player.x, player.z)
  const maxRadius = HELIX_RADIUS - HELIX_PLAYER_RADIUS - 0.15
  if (radius > maxRadius) {
    player.x *= maxRadius / radius
    player.z *= maxRadius / radius
  }
  if (!checkCollisions) return
  if (player.y < HELIX_HUB_HEIGHT - 0.05 && radius < HELIX_HUB_RADIUS + HELIX_PLAYER_RADIUS * 0.8) {
    killHelixPlayer(player)
    return
  }
  if (player.y >= HELIX_BLADE_HEIGHT - 0.08) return
  const cosine = Math.cos(state.spinAngle)
  const sine = Math.sin(state.spinAngle)
  const localX = player.x * cosine - player.z * sine
  const localSide = -(player.x * sine + player.z * cosine)
  if (localX > 0 && helixBladeHit(localX, localSide)) killHelixPlayer(player)
}

function startHelixRound(state) {
  state.phase = 'countdown'
  state.countdown = 2.4
  state.roundTime = 0
  state.spinAngle = Math.PI / 2
  state.spinSpeed = 0
  state.spinDirection = 1
  state.targetDirection = 1
  state.flipTimer = 14 + randomUnit(state) * 6
  state.roundWinner = null
  state.players = [makeHelixPlayer(0), makeHelixPlayer(1)]
}

export function tickHelixArena(state, dt) {
  if (!state || state.status !== 'playing') return
  const elapsed = clamp(dt, 0, 0.05)
  if (state.phase === 'roundover') {
    state.intermission += elapsed
    if (state.intermission >= 2.2 && state.status === 'playing') {
      state.round += 1
      startHelixRound(state)
    }
  } else if (state.phase === 'countdown') {
    state.countdown -= elapsed
    state.players.forEach((player) => tickHelixPlayer(state, player, elapsed, false))
    if (state.countdown <= 0) state.phase = 'playing'
  } else if (state.phase === 'playing') {
    state.roundTime += elapsed
    state.spinSpeed = 1.1 + 1.9 * Math.min(state.roundTime / 50, 1)
    state.flipTimer -= elapsed
    if (state.flipTimer <= 0) {
      state.targetDirection *= -1
      state.flipTimer = 14 + randomUnit(state) * 6
    }
    state.spinDirection += (state.targetDirection - state.spinDirection) * Math.min(1, elapsed * 1.4)
    state.spinAngle += state.spinSpeed * state.spinDirection * elapsed
    state.players.forEach((player) => tickHelixPlayer(state, player, elapsed, true))
    const eliminated = state.players.filter((player) => !player.alive)
    if (eliminated.length > 0) {
      state.phase = 'roundover'
      state.intermission = 0
      state.roundWinner = eliminated.length === 1 ? 1 - eliminated[0].slot : null
      if (state.roundWinner !== null) state.scores[state.roundWinner] += 1
      if (state.scores.some((score) => score >= state.target)) {
        state.status = 'finished'
        state.phase = 'over'
        state.winner = state.scores[0] > state.scores[1] ? 0 : 1
      }
    }
    const [first, second] = state.players
    if (first.alive && second.alive && Math.abs(first.y - second.y) <= 1.2) {
      const dx = second.x - first.x
      const dz = second.z - first.z
      const distance = Math.hypot(dx, dz)
      const minimum = HELIX_PLAYER_RADIUS * 1.9
      if (distance < minimum && distance > 1e-4) {
        const push = (minimum - distance) / 2
        first.x -= dx / distance * push
        first.z -= dz / distance * push
        second.x += dx / distance * push
        second.z += dz / distance * push
      }
    }
  }
}

function nextTrunkSeed(state) {
  const next = Math.floor(randomUnit(state) * 0x100000000) >>> 0
  return next || 1
}

function randomTrunk(state) {
  const randomState = { randomState: state.roundRandomState }
  const result = randomUnit(randomState)
  state.roundRandomState = randomState.randomState
  return result
}

function createTrunkPlayer(slot) {
  return { slot, lane: 0, jumpTime: -1, alive: true, diedAt: null, input: null }
}

function resetTrunkRound(state) {
  state.phase = 'playing'
  state.time = 0
  state.distance = 0
  state.speed = 5.5
  state.spawnY = 24
  state.obstacles = []
  state.firstDeathTime = null
  state.roundEndTime = 0
  state.roundSeed = nextTrunkSeed(state)
  state.roundRandomState = state.roundSeed
  state.players = [createTrunkPlayer(0), createTrunkPlayer(1)]
}

function spawnTrunkRows(state) {
  while (state.spawnY < state.distance + 50) {
    const roll = randomTrunk(state)
    const lane = Math.floor(randomTrunk(state) * 3) - 1
    const row = state.nextRow++
    if (roll < 0.42) {
      state.obstacles.push({ type: 'thorn', lane, y: state.spawnY, row })
    } else if (roll < 0.64) {
      state.obstacles.push({ type: 'spikes', lane: 0, y: state.spawnY, row })
    } else {
      let other
      do {
        other = Math.floor(randomTrunk(state) * 3) - 1
      } while (other === lane)
      state.obstacles.push({ type: 'thorn', lane, y: state.spawnY, row })
      state.obstacles.push({ type: 'thorn', lane: other, y: state.spawnY, row })
    }
    const speed = Math.min(12.5, 5.5 + (state.time + 6) * 0.14)
    state.spawnY += speed * (1.15 + randomTrunk(state) * 0.8)
  }
}

export function createTrunkDuelState(seed = 1) {
  const state = {
    game: 'duel-de-troncs',
    status: 'playing',
    phase: 'playing',
    winner: null,
    roundWinner: null,
    round: 1,
    time: 0,
    distance: 0,
    speed: 5.5,
    scores: [0, 0],
    randomState: seed >>> 0 || 1,
    roundSeed: 1,
    roundRandomState: 1,
    spawnY: 24,
    nextRow: 0,
    firstDeathTime: null,
    roundEndTime: 0,
    obstacles: [],
    players: [createTrunkPlayer(0), createTrunkPlayer(1)],
  }
  state.roundSeed = nextTrunkSeed(state)
  state.roundRandomState = state.roundSeed
  return state
}

export function applyTrunkDuelInput(state, slot, input) {
  if (!state || state.status !== 'playing' || state.phase !== 'playing'
    || !Number.isInteger(slot) || (slot !== 0 && slot !== 1)
    || !input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).length !== 1 || !['left', 'right', 'jump'].includes(input.action)) return false
  const player = state.players[slot]
  if (!player.alive) return false
  if (input.action === 'left') player.lane = Math.max(-1, player.lane - 1)
  else if (input.action === 'right') player.lane = Math.min(1, player.lane + 1)
  else if (player.jumpTime < 0) player.jumpTime = TRUNK_JUMP_INPUT_LEAD
  return true
}

function finishTrunkRound(state) {
  const dead = state.players.filter((player) => !player.alive)
  if (!dead.length) return
  if (dead.length === 2) {
    const difference = Math.abs(dead[0].diedAt - dead[1].diedAt)
    state.roundWinner = difference > 0.25 ? dead[0].diedAt > dead[1].diedAt ? 0 : 1 : null
  } else {
    state.roundWinner = 1 - dead[0].slot
  }
  if (state.roundWinner !== null) state.scores[state.roundWinner] += 1
  state.phase = 'roundEnd'
  state.roundEndTime = 0
}

export function tickTrunkDuel(state, dt) {
  if (!state || state.status !== 'playing') return
  const elapsed = clamp(dt, 0, 0.05)
  if (state.phase === 'roundEnd') {
    state.roundEndTime += elapsed
    state.distance += state.speed * elapsed * Math.max(0, 1 - state.roundEndTime / 1.2)
    if (state.roundEndTime >= 2.8) {
      if (state.scores.some((score) => score >= 3)) {
        state.status = 'finished'
        state.phase = 'finished'
        state.winner = state.scores[0] > state.scores[1] ? 0 : 1
      } else {
        state.round += 1
        state.nextRow = 0
        resetTrunkRound(state)
      }
    }
    return
  }
  state.time += elapsed
  state.speed = Math.min(12.5, 5.5 + state.time * 0.14)
  state.distance += state.speed * elapsed
  spawnTrunkRows(state)
  for (const player of state.players) {
    if (!player.alive) continue
    if (player.jumpTime >= 0) {
      player.jumpTime += elapsed
      if (player.jumpTime >= TRUNK_JUMP_DURATION) player.jumpTime = -1
    }
    const jumpProgress = player.jumpTime >= 0 ? player.jumpTime / TRUNK_JUMP_DURATION : 0
    const jumpHeight = TRUNK_JUMP_HEIGHT * 4 * jumpProgress * (1 - jumpProgress)
    for (const obstacle of state.obstacles) {
      if (Math.abs(obstacle.y - (state.distance + 0.85)) > (obstacle.type === 'spikes' ? 0.5 : 0.65)) continue
      const obstacleLane = player.slot === 1 ? -obstacle.lane : obstacle.lane
      if (obstacle.type !== 'spikes' && player.lane !== obstacleLane) continue
      const clearance = obstacle.type === 'spikes' ? 1 : 1.1
      if (jumpHeight <= clearance) {
        player.alive = false
        player.diedAt = state.time
        player.jumpTime = -1
        if (state.firstDeathTime === null) state.firstDeathTime = state.time
        break
      }
    }
  }
  state.obstacles = state.obstacles.filter((obstacle) => obstacle.y >= state.distance - 20)
  const deaths = state.players.filter((player) => !player.alive)
  if (deaths.length === 2 || deaths.length === 1 && state.time - state.firstDeathTime > 1.5) {
    finishTrunkRound(state)
  }
}
