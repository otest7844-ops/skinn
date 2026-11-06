const FIELD_WIDTH = 0.6
const CANNON_X = FIELD_WIDTH * 0.76
const GRAVITY = 0.6
const PROJECTILE_SPEED = 0.95
const COOLDOWN = 1.1
const UNIT = 1 / 800

function nextRandom(state) {
  state.random = (1664525 * state.random + 1013904223) >>> 0
  return state.random / 0x100000000
}

function position(slot) {
  return { x: CANNON_X, y: slot === 0 ? 0.23 : 0.84 }
}

function angle(player) {
  return (player.slot === 1 ? 3.737 : 2.546) + Math.sin(player.phase) * 1.095
}

function addEffect(state, type, x, y) {
  state.effects.push({ id: ++state.effectSeq, type, x, y })
  if (state.effects.length > 32) state.effects.shift()
}

function spawnShot(state, player) {
  const theta = angle(player)
  const origin = position(player)
  const muzzle = 56 * UNIT
  state.bullets.push({
    id: ++state.bulletSeq,
    x: origin.x + Math.cos(theta) * muzzle,
    y: origin.y + Math.sin(theta) * muzzle,
    vx: Math.cos(theta) * PROJECTILE_SPEED,
    vy: Math.sin(theta) * PROJECTILE_SPEED,
    owner: player.slot,
    age: 0,
  })
  player.cooldown = COOLDOWN
  addEffect(state, 'fire', origin.x + Math.cos(theta) * muzzle, origin.y + Math.sin(theta) * muzzle)
}

export function createCannonDuelState(seed = 1) {
  const randomState = { random: (seed >>> 0) || 1 }
  const state = {
    game: 'cannon-duel',
    status: 'playing',
    winner: null,
    score: [0, 0],
    speed: 1,
    time: 0,
    random: randomState.random,
    bulletSeq: 0,
    effectSeq: 0,
    bullets: [],
    effects: [],
    players: [0, 1].map((slot) => ({
      slot,
      hp: 20,
      cooldown: 0,
      phase: nextRandom(randomState),
      flash: 0,
      tolerance: 50,
    })),
  }
  state.random = randomState.random
  return state
}

export function applyCannonDuelInput(state, slot, input) {
  if (!state || state.status !== 'playing' || (slot !== 0 && slot !== 1)
    || !input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).some((key) => key !== 'type')
    || input.type !== 'fire') return false
  const player = state.players[slot]
  if (!player || player.cooldown > 0) return false
  spawnShot(state, player)
  return true
}

export function tickCannonDuel(state, dt) {
  if (!state || state.status !== 'playing') return state
  const elapsed = Math.min(1 / 30, Math.max(0, dt))
  state.time += elapsed
  for (const player of state.players) {
    player.phase += elapsed * 0.45 * state.speed * (player.slot === 1 ? 1 : 1.13)
    player.cooldown = Math.max(0, player.cooldown - elapsed)
    player.flash = Math.max(0, player.flash - elapsed)
  }

  for (const bullet of state.bullets) {
    bullet.vy += GRAVITY * elapsed
    bullet.x += bullet.vx * elapsed
    bullet.y += bullet.vy * elapsed
    bullet.age += elapsed

    const ownPosition = position(bullet.owner)
    const ownHit = bullet.age > 0.6 && bullet.vy > 0
      && Math.hypot(bullet.x - ownPosition.x - 10 * UNIT, bullet.y - ownPosition.y) < 40 * UNIT
    const target = state.players[ownHit ? bullet.owner : 1 - bullet.owner]
    const targetPosition = position(target.slot)
    if (Math.hypot(bullet.x - targetPosition.x - 10 * UNIT, bullet.y - targetPosition.y) < 50 * UNIT) {
      bullet.dead = true
      target.hp -= 1
      target.flash = 0.5
      state.speed = Math.min(1.3, state.speed * 1.04)
      state.score[1 - target.slot] += 1
      addEffect(state, 'hit', bullet.x, bullet.y)
      if (target.hp <= 0) {
        state.status = 'finished'
        state.winner = 1 - target.slot
      }
    }

    if (bullet.x > FIELD_WIDTH + 0.1 || bullet.x < -0.125
      || bullet.y > 1.125 || bullet.y < -1.5 || bullet.age > 6) bullet.dead = true
  }

  for (let first = 0; first < state.bullets.length; first += 1) {
    for (let second = first + 1; second < state.bullets.length; second += 1) {
      const a = state.bullets[first]
      const b = state.bullets[second]
      if (a.owner !== b.owner && !a.dead && !b.dead
        && Math.hypot(a.x - b.x, a.y - b.y) < 22 * UNIT) {
        a.dead = true
        b.dead = true
        addEffect(state, 'clash', (a.x + b.x) / 2, (a.y + b.y) / 2)
      }
    }
  }
  state.bullets = state.bullets.filter((bullet) => !bullet.dead)
  return state
}
