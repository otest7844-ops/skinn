import { applyCannonDuelInput, createCannonDuelState, tickCannonDuel } from './cannon-duel.mjs'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const PONG = {
  tableLeft: -260,
  tableTop: -690,
  tableWidth: 520,
  tableHeight: 1380,
  ballRadius: 44,
  paddleDistance: 104,
  goal: 3,
}
const HOOPS = { width: 900, height: 500, ground: 430, rim: 250, playerX: 115, gravity: 900, win: 11, radius: 12 }

function makePongState() {
  const players = [
    { x: -150, y: -715, targetX: -150, targetY: -715, vx: 0, vy: 0 },
    { x: 40, y: 705, targetX: 40, targetY: 705, vx: 0, vy: 0 },
  ]
  const serveTo = Math.random() < 0.5 ? 0 : 1
  return {
    game: 'ping-pong',
    score: [0, 0],
    server: serveTo,
    state: 'serve',
    serveTo,
    serveTime: 0.8,
    goal: PONG.goal,
    hits: 0,
    lastHit: -1,
    canHit: [true, true],
    botError: 0,
    pause: 0,
    time: 0,
    effectSeq: 0,
    effects: [],
    ball: {
      x: (Math.random() - 0.5) * 200,
      y: serveTo === 0 ? -200 : 200,
      vx: 0,
      vy: 0,
    },
    players,
  }
}

function makeForestBridgeState(seed = 1) {
  let value = seed >>> 0 || 1
  const next = () => {
    value ^= value << 13
    value ^= value >>> 17
    value ^= value << 5
    return (value >>> 0) / 0x100000000
  }
  const traps = Array.from({ length: 9 }, () => [])
  for (let row = 1; row <= 8; row += 1) {
    const first = Math.floor(next() * 5)
    let second = Math.floor(next() * 4)
    if (second >= first) second += 1
    traps[row] = [first, second]
  }
  return {
    game: 'forest-bridge',
    positions: [0, 0],
    columns: [0, 4],
    turn: 0,
    winner: null,
    revealed: Array.from({ length: 9 }, () => Array(5).fill(null)),
    traps,
    moveSeq: 0,
    lastMove: null,
  }
}

function applyForestBridgeInput(state, slot, input) {
  const { row, column } = input
  if (slot !== 0 && slot !== 1 || state.winner !== null || state.turn !== slot
    || !Number.isInteger(row) || row < 1 || row > 8
    || !Number.isInteger(column) || column < 0 || column > 4
    || state.positions[slot] + 1 !== row) return false

  const safe = !state.traps[row].includes(column)
  state.revealed[row][column] = safe ? slot + 1 : 3
  state.moveSeq += 1
  state.lastMove = { id: state.moveSeq, slot, row, column, safe }
  state.positions[slot] = safe ? row : 0
  state.columns[slot] = safe ? column : slot === 0 ? 0 : 4
  if (safe && row === 8) state.winner = slot
  else state.turn = 1 - slot
  return true
}

function pongResetBall(state, serveTo) {
  state.hits = 0
  state.lastHit = -1
  state.canHit = [true, true]
  state.serveTo = serveTo
  state.server = serveTo
  state.ball = {
    x: (Math.random() - 0.5) * 200,
    y: serveTo === 0 ? -200 : 200,
    vx: 0,
    vy: 0,
  }
  state.serveTime = 0.8
  state.state = 'serve'
}

function pongPoint(state, winner) {
  state.score[winner] += 1
  if (state.score[winner] >= PONG.goal) {
    state.state = 'over'
    state.winner = winner
    return
  }
  pongResetBall(state, 1 - winner)
}

function pongHit(state, slot, dx) {
  const player = state.players[slot]
  const direction = slot === 0 ? 1 : -1
  state.hits += 1
  let speed = Math.min(2000, 850 + state.hits * 55)
  speed = Math.min(2200, speed + Math.min(Math.max(0, player.vy * direction), 800) * 0.35)
  const angle = clamp(dx / PONG.paddleDistance, -1, 1) * 0.6
  state.ball.vy = direction * Math.cos(angle) * speed
  state.ball.vx = Math.sin(angle) * speed + player.vx * 0.2
  state.ball.y = player.y + direction * (
    Math.sqrt(Math.max(0, PONG.paddleDistance ** 2 - dx ** 2)) + 2
  )
  state.lastHit = slot
  state.canHit[slot] = false
  state.canHit[1 - slot] = true
}

function pongLaunch(state) {
  const angle = (Math.random() - 0.5) * 1
  const speed = 780
  state.ball.vx = Math.sin(angle) * speed
  state.ball.vy = (state.serveTo === 0 ? -1 : 1) * Math.cos(angle) * speed
  state.state = 'play'
}

function tickPong(state, dt) {
  state.time += dt
  for (const [slot, player] of state.players.entries()) {
    const minX = -270
    const maxX = 270
    const minY = slot === 0 ? -740 : 305
    const maxY = slot === 0 ? -315 : 730
    player.targetX = clamp(player.targetX, minX, maxX)
    player.targetY = clamp(player.targetY, minY, maxY)
    const oldX = player.x
    const oldY = player.y
    const smoothing = 1 - Math.exp(-dt * 60)
    player.x += (player.targetX - player.x) * smoothing
    player.y += (player.targetY - player.y) * smoothing
    player.vx = dt > 0 ? (player.x - oldX) / dt : 0
    player.vy = dt > 0 ? (player.y - oldY) / dt : 0
  }

  if (state.state === 'serve') {
    state.serveTime -= dt
    if (state.serveTime <= 0) pongLaunch(state)
    return
  }
  if (state.state !== 'play') return

  const ball = state.ball
  ball.x += ball.vx * dt
  ball.y += ball.vy * dt

  for (const [slot, player] of state.players.entries()) {
    if (!state.canHit[slot]) continue
    const direction = slot === 0 ? 1 : -1
    const dx = ball.x - player.x
    const dy = ball.y - player.y
    if (dy * direction > -30 && dx * dx + dy * dy < PONG.paddleDistance ** 2) {
      pongHit(state, slot, dx)
    }
  }

  if (ball.y < PONG.tableTop - PONG.ballRadius - 60) {
    pongPoint(state, 1)
  } else if (ball.y > PONG.tableTop + PONG.tableHeight + PONG.ballRadius + 60) {
    pongPoint(state, 0)
  } else if (ball.x < PONG.tableLeft + PONG.ballRadius) {
    ball.x = PONG.tableLeft + PONG.ballRadius
    ball.vx = Math.abs(ball.vx) * 0.92
  } else if (ball.x > PONG.tableLeft + PONG.tableWidth - PONG.ballRadius) {
    ball.x = PONG.tableLeft + PONG.tableWidth - PONG.ballRadius
    ball.vx = -Math.abs(ball.vx) * 0.92
  }
}

function makeHoopsState() {
  const height = HOOPS.height
  return {
    game: 'basketball-stars',
    width: HOOPS.width,
    height,
    status: 'playing',
    score: [0, 0],
    turn: 0,
    phase: 'aim',
    wait: 0,
    players: [
      { x: HOOPS.playerX, y: HOOPS.ground, vy: 0, dir: 1, has: true, ang: 45, charge: 0, charging: false, block: false },
      { x: HOOPS.width - HOOPS.playerX, y: HOOPS.ground, vy: 0, dir: -1, has: false, ang: 45, charge: 0, charging: false, block: false },
    ],
    ball: { x: HOOPS.playerX + 18, y: HOOPS.ground - 30, vx: 0, vy: 0, owner: 0, time: 0, onFloor: false },
    flight: { time: 0, floor: 0, blocked: false, scored: false },
    message: '',
    messageTime: 0,
  }
}

function hoopFor(slot) {
  return { x: slot === 0 ? HOOPS.width - 45 : 45, dir: slot === 0 ? -1 : 1 }
}

function hoopsNewTurn(state) {
  const shooter = state.players[state.turn]
  const defender = state.players[1 - state.turn]
  state.ball = { x: shooter.x + shooter.dir * 18, y: shooter.y - 30, vx: 0, vy: 0, owner: shooter.id ?? state.turn, time: 0, onFloor: false }
  shooter.has = true
  defender.has = false
  shooter.charge = 0
  shooter.charging = false
  shooter.ang = 45
  state.flight = { time: 0, floor: 0, blocked: false }
  state.phase = 'aim'
}

function hoopsShoot(state, slot, power, rise) {
  if (state.status !== 'playing' || state.phase !== 'aim' || state.turn !== slot) return false
  const player = state.players[slot]
  const hoop = hoopFor(slot)
  const angle = clamp(45 + rise * HOOPS.height * 0.2, 28, 70) * Math.PI / 180
  const horizontalDistance = Math.abs((hoop.x + hoop.dir * 33) - (player.x + player.dir * 14))
  const verticalDifference = -HOOPS.rim + (player.y - 95)
  const denominator = 2 * Math.cos(angle) ** 2 * (horizontalDistance * Math.tan(angle) - verticalDifference)
  if (!(denominator > 0)) return false
  const idealVelocity = Math.sqrt(HOOPS.gravity * horizontalDistance ** 2 / denominator)
  const powerLevel = clamp(power, 0, 1)
  const velocity = idealVelocity * (0.88 + 0.24 * powerLevel)
  if (!Number.isFinite(velocity) || velocity < 0.1 || velocity > 1500) return false
  state.ball.owner = null
  player.has = false
  state.ball.x = player.x + player.dir * 14
  state.ball.y = player.y - 95
  state.ball.vx = player.dir * velocity * Math.cos(angle)
  state.ball.vy = -velocity * Math.sin(angle)
  state.phase = 'fly'
  return true
}

function hoopsScore(state) {
  const shooter = state.players[state.turn]
  state.score[state.turn] += 3
  state.phase = 'wait'
  state.wait = 1.5
  state.message = '+3  PANIER !'
  state.messageTime = 1.4
  shooter.has = false
}

function hoopsTick(state, dt) {
  const { ground, rim, gravity, radius, width } = HOOPS
  for (const [slot, player] of state.players.entries()) {
    player.y += player.vy * dt
    player.vy += player.y < ground ? gravity * 1.6667 * dt : 0
    if (player.y >= ground) {
      player.y = ground
      player.vy = 0
    }
    if (player.block && player.y >= ground && player !== state.players[state.turn] && state.phase !== 'wait') player.vy = -620
    if (player.charging && player === state.players[state.turn] && state.phase === 'aim') player.charge = Math.min(1, player.charge + dt / 1.4)
    if (slot > 1) player.x = width - HOOPS.playerX
  }

  const ball = state.ball
  if (ball.owner !== null) {
    ball.time += dt
    const player = state.players[ball.owner]
    ball.x = player.x + player.dir * 18
    ball.y = player.y - (player.charging ? 85 : 30 + Math.abs(Math.sin(ball.time * 9)) * 32)
  } else {
    const substeps = 4
    const step = dt / substeps
    for (let count = 0; count < substeps; count += 1) {
      const previousY = ball.y
      ball.x += ball.vx * step
      ball.y += ball.vy * step + 0.5 * gravity * step * step
      ball.vy += gravity * step
      if (ball.y > ground - radius) {
        ball.y = ground - radius
        if (Math.abs(ball.vy) > 70) {
          ball.vy *= -0.72
          ball.vx *= 0.97
        } else ball.vy = 0
        ball.vx *= 0.995
      }
      ball.onFloor = ball.y >= ground - radius - 2
      if (ball.x < radius) { ball.x = radius; ball.vx = Math.abs(ball.vx) * 0.7 }
      if (ball.x > width - radius) { ball.x = width - radius; ball.vx = -Math.abs(ball.vx) * 0.7 }
      for (const [slot, hoop] of [hoopFor(0), hoopFor(1)].entries()) {
        const back = hoop.x + hoop.dir * 8
        const front = hoop.x + hoop.dir * 58
        for (const x of [back, front]) {
          const dx = ball.x - x
          const dy = ball.y - rim
          const distance = Math.hypot(dx, dy)
          if (distance < radius + 4 && distance > 0) {
            const nx = dx / distance
            const ny = dy / distance
            const dot = ball.vx * nx + ball.vy * ny
            if (dot < 0) {
              ball.vx = (ball.vx - 1.55 * dot * nx) * 0.82
              ball.vy = (ball.vy - 1.55 * dot * ny) * 0.82
            }
            ball.x = x + nx * (radius + 4)
            ball.y = rim + ny * (radius + 4)
          }
        }
        const relative = (ball.x - hoop.x) * hoop.dir
        if (ball.y > rim - 90 && ball.y < rim + 8 && relative < radius && relative > -radius - 4) {
          ball.x = hoop.x + hoop.dir * radius
          ball.vx = Math.abs(ball.vx) * hoop.dir * 0.6
        }
        if (state.phase === 'fly' && !state.flight.scored && slot === state.turn && ball.vy > 0 && previousY < rim && ball.y >= rim) {
          const min = Math.min(back, front) + 3
          const max = Math.max(back, front) - 3
          if (ball.x > min && ball.x < max) {
            state.flight.scored = true
            hoopsScore(state)
          }
        }
      }
    }
  }
  if (state.phase === 'fly') {
    state.flight.time += dt
    if (ball.onFloor) state.flight.floor += dt
    const defender = state.players[1 - state.turn]
    if (defender.y < ground - 20 && !state.flight.blocked) {
      const hitX = defender.x + defender.dir * 8
      const hitY = defender.y - 102
      if (Math.hypot(ball.x - hitX, ball.y - hitY) < 38) {
        state.flight.blocked = true
        ball.vx = -Math.sign(ball.vx || 1) * 160
        ball.vy = -140
        state.phase = 'wait'
        state.wait = 1.3
        state.message = 'BLOQUÉ !'
        state.messageTime = 1.2
      }
    }
    if (state.phase === 'fly' && (state.flight.floor > 0.7 || state.flight.time > 6)) {
      state.phase = 'wait'
      state.wait = 0.5
      state.message = 'RATÉ'
      state.messageTime = 0.9
    }
  } else if (state.phase === 'wait') {
    state.wait -= dt
    if (state.wait <= 0) {
      if (state.score.some((value) => value >= HOOPS.win)) {
        state.status = 'finished'
        state.message = state.score[0] === state.score[1] ? 'ÉGALITÉ' : state.score[0] > state.score[1] ? 'VICTOIRE !' : 'DÉFAITE'
        state.messageTime = 3
      } else {
        state.turn = 1 - state.turn
        hoopsNewTurn(state)
      }
    }
  }
  if (state.messageTime > 0) state.messageTime -= dt
  for (const player of state.players) player.block = false
}

export function createAuthoritativeGame(game, seed) {
  if (game === 'ping-pong') return makePongState()
  if (game === 'forest-bridge') return makeForestBridgeState(seed)
  if (game === 'basketball-stars') return makeHoopsState()
  if (game === 'cannon-duel') return createCannonDuelState(seed)
  return null
}

export function applyAuthoritativeInput(state, slot, input) {
  if (!state || !input || typeof input !== 'object' || Array.isArray(input)) return false
  if (state.game === 'cannon-duel') return applyCannonDuelInput(state, slot, input)
  if (state.game === 'forest-bridge' && input.type === 'step') return applyForestBridgeInput(state, slot, input)
  if (state.game === 'ping-pong') {
    if (slot !== 0 && slot !== 1) return false
    const player = state.players[slot]
    if (input.type === 'move' && Number.isFinite(input.x) && Number.isFinite(input.y)) {
      player.targetX = clamp(input.x, -270, 270)
      player.targetY = clamp(input.y, slot === 0 ? -740 : 305, slot === 0 ? -315 : 730)
      return true
    }
    return false
  }
  if (state.game === 'basketball-stars') {
    const player = state.players[slot]
    if (input.type === 'shot' && Number.isFinite(input.back) && Number.isFinite(input.rise)) {
      const power = clamp(input.back * HOOPS.width / 140, 0, 1)
      return hoopsShoot(state, slot, power, clamp(input.rise, -1, 1))
    }
    if (input.type === 'block' && typeof input.down === 'boolean') {
      player.block = input.down
      if (input.down && slot !== state.turn && state.phase !== 'wait' && player.y >= HOOPS.ground) player.vy = -620
      return true
    }
    if (input.type === 'key' && ['enter', ' ', 'arrowup', 'arrowdown', 'w', 's', 'i', 'k'].includes(input.key) && typeof input.down === 'boolean') {
      if (input.key === 'enter' || input.key === ' ') {
        if (input.down && state.phase === 'aim' && state.turn === slot && !player.charging) {
          player.charging = true
          player.charge = 0
        } else if (!input.down && player.charging) {
          const accepted = hoopsShoot(state, slot, player.charge, (player.ang - 45) / (HOOPS.height * 0.2))
          player.charging = false
          return accepted
        }
      } else if (input.down && state.phase === 'aim' && state.turn === slot) {
        const increase = ['arrowup', 'w', 'i'].includes(input.key)
        const decrease = ['arrowdown', 's', 'k'].includes(input.key)
        if (increase || decrease) player.ang = clamp(player.ang + (increase ? 2 : -2), 28, 70)
      } else if (input.down && slot !== state.turn && player.y >= HOOPS.ground && state.phase !== 'wait'
        && ['arrowup', 'w', 'i'].includes(input.key)) {
        player.vy = -620
      }
      return true
    }
  }
  return false
}

export function tickAuthoritativeGame(state, dt) {
  if (!state) return
  if (state.game === 'ping-pong') tickPong(state, dt)
  else if (state.game === 'basketball-stars') hoopsTick(state, dt)
  else if (state.game === 'cannon-duel') tickCannonDuel(state, dt)
  if (state.game === 'basketball-stars' && state.status === 'finished') return
}
