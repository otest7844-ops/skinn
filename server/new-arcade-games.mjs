const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const KNIFE_Z_MIN = -3.05
const KNIFE_Z_MAX = 3.05
const KNIFE_SCALE = 1.15
const KNIFE_X_START = 10.2
const KNIFE_X_END = -10.8
const KNIFE_PLAYER_X = [-2.7, 2.7]

const CANYON = {
  ground: 470,
  height: 62,
  count: 20,
  first: 640,
  gap: 260,
  start: 140,
  speed: 300,
  jump: 720,
  gravity: 2200,
}
CANYON.cake = CANYON.first + (CANYON.count - 1) * CANYON.gap + 440
CANYON.world = CANYON.cake + 360

function random(state) {
  let value = state.randomState >>> 0
  value ^= value << 13
  value ^= value >>> 17
  value ^= value << 5
  state.randomState = value >>> 0 || 1
  return state.randomState / 0x100000000
}

function makePillars() {
  return Array.from({ length: CANYON.count }, (_, index) => {
    const progress = index / (CANYON.count - 1)
    const rest = 120 + ((index * 37) % 5) * 14
    return {
      i: index,
      x: CANYON.first + index * CANYON.gap,
      rest,
      b: rest,
      state: 'up',
      t: 0,
      dur: 0.3 + ((index * 0.37) % 1.6),
      shake: 0,
      warn: 0,
      slam: 0.09 - 0.02 * progress,
      down: 0.32 - 0.08 * progress,
      rise: 0.4 - 0.08 * progress,
      hold: 0.6 + ((index * 7) % 5) * 0.1,
    }
  })
}

function createCanyonPlayer() {
  return {
    x: CANYON.start,
    y: CANYON.ground,
    vx: 0,
    vy: 0,
    face: 1,
    on: true,
    coyote: 0.1,
    jumpBuffer: 0,
    jumpHeld: false,
    dead: false,
    deadTime: 0,
    deaths: 0,
    passed: 0,
    walk: 0,
    flat: 1,
    scale: 1,
    invulnerable: 0,
    input: { left: false, right: false },
  }
}

function tickPillar(pillar, dt) {
  pillar.t += dt
  if (pillar.state === 'up') {
    pillar.b = pillar.rest
    pillar.shake = 0
    if (pillar.t >= pillar.dur) {
      pillar.state = 'slam'
      pillar.t = 0
    }
  } else if (pillar.state === 'warn') {
    const progress = Math.min(1, pillar.t / pillar.warn)
    pillar.shake = Math.sin(pillar.t * 70) * 2.4 * progress
    pillar.b = pillar.rest - 12 * Math.sin(progress * Math.PI / 2)
    if (pillar.t >= pillar.warn) {
      pillar.state = 'slam'
      pillar.t = 0
      pillar.shake = 0
    }
  } else if (pillar.state === 'slam') {
    const progress = Math.min(1, pillar.t / pillar.slam)
    pillar.b = pillar.rest + (CANYON.ground - pillar.rest) * progress * progress
    if (progress >= 1) {
      pillar.state = 'down'
      pillar.t = 0
      pillar.b = CANYON.ground
    }
  } else if (pillar.state === 'down') {
    pillar.b = CANYON.ground
    if (pillar.t >= pillar.down) {
      pillar.state = 'rise'
      pillar.t = 0
    }
  } else {
    const progress = Math.min(1, pillar.t / pillar.rise)
    const ease = 1 - (1 - progress) * (1 - progress)
    pillar.b = CANYON.ground + (pillar.rest - CANYON.ground) * ease
    if (progress >= 1) {
      pillar.state = 'up'
      pillar.t = 0
      pillar.dur = pillar.hold
    }
  }
}

export function createKnifeDuelState(seed = 1) {
  return {
    game: 'grotte-aux-couteaux',
    status: 'playing',
    winner: null,
    time: 0,
    spawnTime: 1.3,
    volleyTime: 14,
    knifeSequence: 0,
    randomState: seed >>> 0 || 1,
    players: [0, 1].map((slot) => ({
      slot,
      x: KNIFE_PLAYER_X[slot],
      z: slot === 0 ? -0.8 : 2.4,
      velocity: 0,
      lives: 20,
      dodges: 0,
      invulnerable: 0,
      input: { direction: 0, targetZ: null },
    })),
    knives: [],
  }
}

export function applyKnifeDuelInput(state, slot, input) {
  if (!state || state.status !== 'playing' || !Number.isInteger(slot) || (slot !== 0 && slot !== 1)
    || !input || typeof input !== 'object' || Array.isArray(input)) return false
  const hasDirection = Object.hasOwn(input, 'direction')
  const hasTarget = Object.hasOwn(input, 'targetZ')
  if ((!hasDirection && !hasTarget)
    || Object.keys(input).some((key) => key !== 'direction' && key !== 'targetZ')
    || hasDirection && (!Number.isInteger(input.direction) || input.direction < -1 || input.direction > 1)
    || hasTarget && input.targetZ !== null && (typeof input.targetZ !== 'number' || !Number.isFinite(input.targetZ))) return false
  const player = state.players[slot]
  if (hasDirection) player.input.direction = input.direction
  if (hasTarget) player.input.targetZ = input.targetZ === null
    ? null
    : clamp(input.targetZ, KNIFE_Z_MIN, KNIFE_Z_MAX)
  return true
}

function spawnKnife(state, z, speed, delay = 0) {
  state.knives.push({
    id: ++state.knifeSequence,
    x: KNIFE_X_START + speed * delay,
    z: clamp(z, KNIFE_Z_MIN, KNIFE_Z_MAX),
    speed,
    type: random(state) < 0.4 ? 1 : 0,
    done: [false, false],
  })
}

export function tickKnifeDuel(state, dt) {
  if (!state || state.status !== 'playing') return
  const elapsed = clamp(dt, 0, 0.05)
  state.time += elapsed
  state.spawnTime -= elapsed
  state.volleyTime -= elapsed

  const difficulty = Math.min(1, state.time / 70)
  const warningTime = 0.75 - difficulty * 0.3
  const knifeSpeed = 5.8 + difficulty * 7.5
  if (state.volleyTime <= 0 && state.time > 14) {
    state.volleyTime = 11 - difficulty * 4
    const gap = Math.floor(random(state) * 5)
    for (let lane = 0; lane < 6; lane += 1) {
      if (lane === gap || lane === gap + 1) continue
      const z = KNIFE_Z_MIN + (KNIFE_Z_MAX - KNIFE_Z_MIN) * lane / 5
      spawnKnife(state, z, knifeSpeed * 0.9, warningTime + 0.1)
    }
    state.spawnTime = Math.max(state.spawnTime, 1.5)
  } else if (state.spawnTime <= 0) {
    state.spawnTime = 1.15 - difficulty * 0.8 + random(state) * 0.25
    const target = state.players[Math.floor(random(state) * 2)]
    const z = random(state) < 0.55
      ? clamp(target.z + (random(state) - 0.5) * 1.2, KNIFE_Z_MIN, KNIFE_Z_MAX)
      : KNIFE_Z_MIN + random(state) * (KNIFE_Z_MAX - KNIFE_Z_MIN)
    spawnKnife(state, z, knifeSpeed, warningTime)
  }

  for (const player of state.players) {
    const { direction, targetZ } = player.input
    const targetVelocity = direction !== 0
      ? direction * 7.8
      : targetZ === null ? 0 : clamp((targetZ - player.z) * 10, -7.8, 7.8)
    player.velocity += (targetVelocity - player.velocity) * Math.min(1, elapsed * 16)
    player.z = clamp(player.z + player.velocity * elapsed, KNIFE_Z_MIN, KNIFE_Z_MAX)
    player.invulnerable = Math.max(0, player.invulnerable - elapsed)
  }

  for (let index = state.knives.length - 1; index >= 0; index -= 1) {
    const knife = state.knives[index]
    knife.x -= knife.speed * elapsed
    for (const player of state.players) {
      const slot = player.slot
      if (knife.done[slot] || player.lives <= 0) continue
      const tip = knife.x - 1.15 * KNIFE_SCALE
      const tail = knife.x + 0.4 * KNIFE_SCALE
      const distance = Math.abs(knife.z - player.z)
      if (tip < player.x + 0.55 && tail > player.x - 0.55 && distance < 0.62) {
        knife.done[slot] = true
        if (player.invulnerable <= 0) {
          player.lives = Math.max(0, player.lives - 1)
          player.invulnerable = 0.25
        }
      } else if (tail < player.x - 0.55) {
        knife.done[slot] = true
        if (distance < 1.05) player.dodges += 1
      }
    }
    if (knife.x < KNIFE_X_END) state.knives.splice(index, 1)
  }
  const eliminated = state.players.filter((player) => player.lives === 0)
  if (eliminated.length > 0) {
    state.status = 'finished'
    state.winner = eliminated.length === 2 ? Math.floor(random(state) * 2) : 1 - eliminated[0].slot
  }
}

export function createCanyonRaceState(seed = 1) {
  return {
    game: 'colonnes-du-canyon',
    status: 'playing',
    winner: null,
    time: 0,
    randomState: seed >>> 0 || 1,
    players: [0, 1].map((slot) => ({ ...createCanyonPlayer(), slot })),
    pillars: makePillars(),
  }
}

export function applyCanyonRaceInput(state, slot, input) {
  if (!state || state.status !== 'playing' || !Number.isInteger(slot) || (slot !== 0 && slot !== 1)
    || !input || typeof input !== 'object' || Array.isArray(input)) return false
  const fields = ['left', 'right', 'jump']
  if (!fields.some((key) => Object.hasOwn(input, key))
    || Object.keys(input).some((key) => !fields.includes(key))
    || fields.some((key) => Object.hasOwn(input, key) && typeof input[key] !== 'boolean')) return false
  const player = state.players[slot]
  if (typeof input.left === 'boolean') player.input.left = input.left
  if (typeof input.right === 'boolean') player.input.right = input.right
  if (typeof input.jump === 'boolean') {
    if (input.jump && !player.jumpHeld) player.jumpBuffer = 0.13
    player.jumpHeld = input.jump
  }
  return true
}

function respawnCanyonPlayer(player) {
  const fresh = createCanyonPlayer()
  fresh.invulnerable = 0.6
  Object.assign(player, fresh, { deaths: player.deaths, input: { ...player.input } })
}

function tickCanyonPlayer(state, player, dt) {
  if (player.dead) {
    player.deadTime -= dt
    player.vy += CANYON.gravity * dt
    player.y = Math.min(CANYON.ground, player.y + player.vy * dt)
    player.flat += (0.1 - player.flat) * Math.min(1, dt * 18)
    if (player.deadTime <= 0) respawnCanyonPlayer(player)
    return
  }

  player.scale += (1 - player.scale) * Math.min(1, dt * 12)
  player.invulnerable = Math.max(0, player.invulnerable - dt)
  const direction = Number(player.input.right) - Number(player.input.left)
  player.vx += (direction * CANYON.speed - player.vx) * Math.min(1, dt * (player.on ? 14 : 7))
  if (direction) player.face = direction
  player.jumpBuffer = Math.max(0, player.jumpBuffer - dt)
  player.coyote = player.on ? 0.1 : player.coyote - dt
  if (player.jumpBuffer > 0 && player.coyote > 0) {
    player.vy = -CANYON.jump
    player.on = false
    player.coyote = 0
    player.jumpBuffer = 0
    player.scale = 1.28
  }
  if (!player.on && player.vy < -260 && !player.jumpHeld) player.vy += CANYON.gravity * 1.6 * dt
  player.vy += CANYON.gravity * dt
  player.x += player.vx * dt
  player.y += player.vy * dt
  if (player.y >= CANYON.ground) {
    player.y = CANYON.ground
    player.vy = 0
    player.on = true
  }
  player.x = clamp(player.x, 34, CANYON.world - 34)
  player.walk += (player.on ? Math.abs(player.vx) : 0) * dt * 0.05

  if (player.invulnerable <= 0) {
    const head = player.y - CANYON.height
    const pillar = state.pillars.find((item) => item.b > head + 2 && Math.abs(player.x - (item.x + item.shake)) < 54)
    if (pillar) {
      player.dead = true
      player.deadTime = 1
      player.deaths += 1
      player.vx = 0
      player.vy = 0
      player.flat = 1
      return
    }
  }

  for (const pillar of state.pillars) {
    if (player.x > pillar.x + 80 && player.passed <= pillar.i) player.passed = pillar.i + 1
  }
  return player.x >= CANYON.cake - 30
}

export function tickCanyonRace(state, dt) {
  if (!state || state.status !== 'playing') return
  const elapsed = clamp(dt, 0, 0.05)
  state.time += elapsed
  state.pillars.forEach((pillar) => tickPillar(pillar, elapsed))
  const finishLine = CANYON.cake - 30
  const finishers = []
  for (const player of state.players) {
    const previousX = player.x
    if (tickCanyonPlayer(state, player, elapsed)) {
      const progress = player.x <= previousX
        ? 0
        : clamp((finishLine - previousX) / (player.x - previousX), 0, 1)
      finishers.push({ slot: player.slot, progress })
    }
  }
  if (finishers.length > 0) {
    finishers.sort((first, second) => first.progress - second.progress)
    state.status = 'finished'
    state.winner = finishers.length > 1 && Math.abs(finishers[0].progress - finishers[1].progress) < 1e-6
      ? Math.floor(random(state) * 2)
      : finishers[0].slot
  }
}
