export const HEAD_FOOTBALL_WIDTH = 1266
export const HEAD_FOOTBALL_GROUND = 395
const BALL_RADIUS = 16
const GOAL_BAR = 215

function player(x, facing, selection) {
  return {
    x,
    y: 0,
    vy: 0,
    vx: 0,
    facing,
    kickTimer: 0,
    hit: 0,
    power: 0,
    cooldown: 0,
    jumpKick: 0,
    progress: 0,
    selection,
  }
}

export function createHeadFootballMatch(selections) {
  return {
    status: 'count',
    phaseElapsed: 0,
    remaining: 0,
    scores: [0, 0],
    winner: null,
    players: [player(330, 1, selections[0]), player(936, -1, selections[1])],
    ball: { x: 633, y: 120, vx: 0, vy: 0, rotation: 0, fire: 0 },
  }
}

function ballPlayerCollision(state, cx, cy, radius, playerVelocity) {
  const { ball } = state
  const dx = ball.x - cx
  const dy = ball.y - cy
  const distance = Math.hypot(dx, dy)
  const minimumDistance = radius + BALL_RADIUS
  if (distance >= minimumDistance || distance <= 0.01) return

  const nx = dx / distance
  const ny = dy / distance
  ball.x = cx + nx * minimumDistance
  ball.y = cy + ny * minimumDistance
  const normalVelocity = ball.vx * nx + ball.vy * ny
  if (normalVelocity < 0) {
    ball.vx -= 1.75 * normalVelocity * nx
    ball.vy -= 1.75 * normalVelocity * ny
  }
  ball.vx += playerVelocity * 0.5
}

function updatePlayer(state, player, dt, input) {
  player.vx = (Number(input.right === true) - Number(input.left === true)) * 320
  player.x = Math.max(150, Math.min(HEAD_FOOTBALL_WIDTH - 150, player.x + player.vx * dt))

  if (input.jump && player.y <= 0 && player.kickTimer <= 0) {
    player.vy = 720
    player.kickTimer = 0.22
    player.hit = 0
    player.power = 0
    player.jumpKick = 1
  }
  if (input.kick && player.kickTimer <= 0) {
    player.kickTimer = 0.22
    player.hit = 0
    player.power = 0
    player.jumpKick = 0
  }
  if (input.power && player.kickTimer <= 0) {
    player.kickTimer = 0.26
    player.hit = 0
    player.power = 1
    player.cooldown = 0
    player.jumpKick = 0
  }

  player.cooldown = Math.max(0, player.cooldown - dt)
  player.vy -= 2000 * dt
  player.y += player.vy * dt
  if (player.y < 0) {
    player.y = 0
    player.vy = 0
  }

  const duration = player.power ? 0.26 : 0.22
  player.progress = 0
  if (player.kickTimer <= 0) return
  player.kickTimer -= dt
  player.progress = Math.max(0, 1 - player.kickTimer / duration)
  if (player.progress <= 0.2 || player.progress >= 0.85 || player.hit) return

  const footX = player.x + player.facing * 42
  const footY = HEAD_FOOTBALL_GROUND - player.y - 18
  if (Math.hypot(state.ball.x - footX, state.ball.y - footY) >= BALL_RADIUS + 36) return

  player.hit = 1
  state.ball.vx = player.facing * (player.power ? 1250 : 780)
  state.ball.vy = player.power ? -150 : (player.jumpKick || player.y > 5 ? -600 : -340)
  if (player.power) state.ball.fire = 1.2
}

function collidePlayer(state, player) {
  ballPlayerCollision(state, player.x, HEAD_FOOTBALL_GROUND - player.y - 54, 34, player.vx)
  ballPlayerCollision(state, player.x + player.facing * 20, HEAD_FOOTBALL_GROUND - player.y - 16, 19, player.vx)
  ballPlayerCollision(state, player.x, HEAD_FOOTBALL_GROUND - player.y - 30, 26, player.vx)
}

function stepBall(state, dt, live) {
  const { ball } = state
  ball.vy += 1500 * dt
  ball.x += ball.vx * dt
  ball.y += ball.vy * dt
  ball.rotation += ball.vx * dt / BALL_RADIUS
  ball.fire = Math.max(0, ball.fire - dt)

  const ground = 403 - BALL_RADIUS
  if (ball.y > ground) {
    ball.y = ground
    if (ball.vy > 130) ball.vy *= -0.68
    else ball.vy = 0
    ball.vx *= 0.45 ** dt
  }
  if (ball.x < BALL_RADIUS + 30) {
    ball.x = BALL_RADIUS + 30
    ball.vx *= -0.5
  }
  if (ball.x > HEAD_FOOTBALL_WIDTH - BALL_RADIUS - 30) {
    ball.x = HEAD_FOOTBALL_WIDTH - BALL_RADIUS - 30
    ball.vx *= -0.5
  }
  if ((ball.x < 250 || ball.x > HEAD_FOOTBALL_WIDTH - 250)
    && ball.vy > 0 && ball.y + BALL_RADIUS > GOAL_BAR
    && ball.y + BALL_RADIUS < GOAL_BAR + 45 && ball.y < GOAL_BAR) {
    ball.y = GOAL_BAR - BALL_RADIUS
    ball.vy *= -0.55
  }
  if (ball.x < 195 || ball.x > HEAD_FOOTBALL_WIDTH - 195) ball.vx *= 0.2 ** dt

  if (!live || state.status !== 'play' || ball.y <= GOAL_BAR) return
  if (ball.x < 195) {
    state.scores[1] += 1
    state.status = 'goal'
    state.phaseElapsed = 0
  } else if (ball.x > HEAD_FOOTBALL_WIDTH - 195) {
    state.scores[0] += 1
    state.status = 'goal'
    state.phaseElapsed = 0
  }
}

function resetPositions(state) {
  state.players.forEach((current) => Object.assign(current, {
    x: current.facing === 1 ? 330 : 936,
    y: 0,
    vy: 0,
    vx: 0,
    kickTimer: 0,
    hit: 0,
    power: 0,
    progress: 0,
  }))
  Object.assign(state.ball, { x: 633, y: 120, vx: 0, vy: 0, fire: 0 })
}

export function tickHeadFootballMatch(state, dt, inputs) {
  if (state.status === 'finished') return state
  const elapsed = Math.min(1 / 20, Math.max(0, dt))
  state.phaseElapsed += elapsed

  if (state.status === 'count' && state.phaseElapsed >= 3.6) {
    state.status = 'play'
    state.phaseElapsed = 0
  } else if (state.status === 'goal' && state.phaseElapsed >= 1.8) {
    if (state.scores.some((score) => score >= 10)) {
      state.status = 'finished'
      state.winner = state.scores[0] === state.scores[1]
        ? null
        : state.scores[0] > state.scores[1] ? 0 : 1
      return state
    }
    resetPositions(state)
    state.status = 'play'
    state.phaseElapsed = 0
  }

  const live = state.status === 'play'
  updatePlayer(state, state.players[0], elapsed, live ? inputs[0] : {})
  updatePlayer(state, state.players[1], elapsed, live ? inputs[1] : {})
  for (let step = 0; step < 4; step += 1) {
    stepBall(state, elapsed / 4, live)
    collidePlayer(state, state.players[0])
    collidePlayer(state, state.players[1])
  }

  return state
}

export function sanitizeHeadFootballInput(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const keys = ['left', 'right', 'jump', 'kick', 'power']
  if (Object.keys(value).some((key) => !keys.includes(key))
    || keys.some((key) => value[key] !== undefined && typeof value[key] !== 'boolean')
    || Boolean(value.left) && Boolean(value.right)
    || Boolean(value.kick) && Boolean(value.power)) return null
  return Object.fromEntries(keys.map((key) => [key, Boolean(value[key])]))
}
