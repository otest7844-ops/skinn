
const FIELD_WIDTH = 0.6
const CANNON_X = FIELD_WIDTH * 0.76
const GRAVITY = 0.6
const PROJECTILE_SPEED = 0.95
const COOLDOWN = 1.1
const UNIT = 1 / 800
const MAX_DT = 1 / 30
const MAX_BULLETS = 128
const MAX_EFFECTS = 64

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

function addEffect(state, type, x, y, owner = null) {
  state.effects.push({
    id: ++state.effectSeq,
    type,
    x,
    y,
    owner,
    time: state.time,
  })

  if (state.effects.length > MAX_EFFECTS) {
    state.effects.splice(0, state.effects.length - MAX_EFFECTS)
  }
}

function spawnShot(state, player) {
  if (state.bullets.length >= MAX_BULLETS) return false

  const theta = angle(player)
  const origin = position(player.slot)
  const muzzle = 56 * UNIT

  const x = origin.x + Math.cos(theta) * muzzle
  const y = origin.y + Math.sin(theta) * muzzle

  state.bullets.push({
    id: ++state.bulletSeq,
    x,
    y,
    vx: Math.cos(theta) * PROJECTILE_SPEED,
    vy: Math.sin(theta) * PROJECTILE_SPEED,
    owner: player.slot,
    age: 0,
    dead: false,
  })

  player.cooldown = COOLDOWN
  addEffect(state, 'fire', x, y, player.slot)

  return true
}

function validSlot(slot) {
  return slot === 0 || slot === 1
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy

  if (lengthSquared <= 1e-12) {
    return Math.hypot(px - x1, py - y1)
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((px - x1) * dx + (py - y1) * dy) / lengthSquared
    )
  )

  return Math.hypot(
    px - (x1 + t * dx),
    py - (y1 + t * dy)
  )
}

function findHitTarget(state, bullet, previousX, previousY) {
  const ownPosition = position(bullet.owner)

  const selfHit =
    bullet.age > 0.6 &&
    bullet.vy > 0 &&
    distanceToSegment(
      ownPosition.x + 10 * UNIT,
      ownPosition.y,
      previousX,
      previousY,
      bullet.x,
      bullet.y
    ) < 40 * UNIT

  const targetSlot = selfHit
    ? bullet.owner
    : 1 - bullet.owner

  const targetPosition = position(targetSlot)

  const hit = distanceToSegment(
    targetPosition.x + 10 * UNIT,
    targetPosition.y,
    previousX,
    previousY,
    bullet.x,
    bullet.y
  ) < 50 * UNIT

  return hit ? state.players[targetSlot] : null
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
      phase: nextRandom(randomState) * Math.PI * 2,
      flash: 0,
      tolerance: 50,
    })),
  }

  state.random = randomState.random

  return state
}

export function applyCannonDuelInput(state, slot, input) {
  if (
    !state ||
    state.status !== 'playing' ||
    !Array.isArray(state.players) ||
    !validSlot(slot) ||
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input) ||
    Object.keys(input).length !== 1 ||
    input.type !== 'fire'
  ) {
    return false
  }

  const player = state.players[slot]

  if (
    !player ||
    player.slot !== slot ||
    !Number.isFinite(player.cooldown) ||
    player.cooldown > 0
  ) {
    return false
  }

  return spawnShot(state, player)
}

export function tickCannonDuel(state, dt) {
  if (!state || state.status !== 'playing') return state

  if (!Array.isArray(state.players) || state.players.length !== 2) {
    return state
  }

  const safeDt = Number.isFinite(dt)
    ? Math.max(0, Math.min(MAX_DT, dt))
    : 0

  if (safeDt === 0) return state

  state.time += safeDt

  for (const player of state.players) {
    player.phase +=
      safeDt * 0.45 * state.speed *
      (player.slot === 1 ? 1 : 1.13)

    player.cooldown = Math.max(
      0,
      player.cooldown - safeDt
    )

    player.flash = Math.max(
      0,
      player.flash - safeDt
    )
  }

  for (const bullet of state.bullets) {
    if (bullet.dead) continue

    const previousX = bullet.x
    const previousY = bullet.y

    bullet.vy += GRAVITY * safeDt
    bullet.x += bullet.vx * safeDt
    bullet.y += bullet.vy * safeDt
    bullet.age += safeDt

    const target = findHitTarget(
      state,
      bullet,
      previousX,
      previousY
    )

    if (target) {
      bullet.dead = true

      target.hp = Math.max(0, target.hp - 1)
      target.flash = 0.5

      state.speed = Math.min(
        1.3,
        state.speed * 1.04
      )

      state.score[1 - target.slot] += 1

      addEffect(
        state,
        'hit',
        bullet.x,
        bullet.y,
        bullet.owner
      )

      if (target.hp <= 0 && state.status === 'playing') {
        state.status = 'finished'
        state.winner = 1 - target.slot
      }
    }

    if (
      bullet.x > FIELD_WIDTH + 0.1 ||
      bullet.x < -0.125 ||
      bullet.y > 1.125 ||
      bullet.y < -1.5 ||
      bullet.age > 6
    ) {
      bullet.dead = true
    }

    if (state.status !== 'playing') break
  }

  if (state.status === 'playing') {
    for (let first = 0; first < state.bullets.length; first += 1) {
      const a = state.bullets[first]

      if (a.dead) continue

      for (
        let second = first + 1;
        second < state.bullets.length;
        second += 1
      ) {
        const b = state.bullets[second]

        if (
          !b.dead &&
          a.owner !== b.owner &&
          Math.hypot(a.x - b.x, a.y - b.y) < 22 * UNIT
        ) {
          a.dead = true
          b.dead = true

          addEffect(
            state,
            'clash',
            (a.x + b.x) / 2,
            (a.y + b.y) / 2
          )

          break
        }
      }
    }
  }

  state.bullets = state.bullets.filter(
    (bullet) => !bullet.dead
  )

  return state
}
