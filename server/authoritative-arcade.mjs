import { applyCannonDuelInput, createCannonDuelState, tickCannonDuel } from './cannon-duel.mjs'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const PONG = { width: 1.525, length: 2.74, height: 2.2, netHeight: 0.1525, gravity: 9.8, ballRadius: 0.06 }
const HOOPS = { width: 900, height: 500, ground: 430, rim: 250, playerX: 115, gravity: 900, win: 11, radius: 12 }

function makePongState() {
  return {
    game: 'ping-pong',
    score: [0, 0],
    server: 0,
    state: 'serve',
    lastPoint: null,
    hitter: 0,
    ownBounces: 0,
    receivedBounces: 0,
    serving: false,
    netFault: false,
    message: '',
    messageColor: '#fff',
    pause: 0,
    rally: 0,
    time: 0,
    effectSeq: 0,
    effects: [],
    ball: { x: 0, y: 0.1, z: 0.3, vx: 0, vy: 0, vz: 0 },
    players: [
      { x: 0, y: -0.2, z: 0.12, vx: 0, vy: 0, sw: 0, targetX: 0, targetY: -0.2 },
      { x: 0, y: 3, z: 0.12, vx: 0, vy: 0, sw: 0, targetX: 0, targetY: 3 },
    ],
  }
}

function pongEffect(state, type, data = {}) {
  state.effects.push({
    id: ++state.effectSeq,
    type,
    x: state.ball.x,
    y: state.ball.y,
    z: Math.max(0, state.ball.z),
    ...data,
  })
  if (state.effects.length > 32) state.effects.shift()
}

function pongServe(state) {
  state.state = 'serve'
  state.netFault = false
  const player = state.players[state.server]
  state.ball = { x: player.x, y: state.server === 0 ? 0.1 : PONG.length - 0.1, z: 0.3, vx: 0, vy: 0, vz: 0 }
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

function pongStartRally(state, slot) {
  state.hitter = slot
  state.serving = true
  state.ownBounces = 0
  state.receivedBounces = 0
  state.netFault = false
  state.rally = 0
  state.state = 'play'
}

function pongPoint(state, winner) {
  if (state.state !== 'play') return
  state.score[winner] += 1
  state.lastPoint = winner
  state.lastPoint = winner
  state.state = 'point'
  state.pause = 1.4
  state.message = winner === 0 ? 'Point pour vous !' : 'Point pour l’adversaire'
  state.messageColor = winner === 0 ? '#ff9a8c' : '#8ad6ff'
  state.ball.vx = 0
  state.ball.vy = 0
  state.ball.vz = 0
  pongEffect(state, 'point', { winner })
}

function pongStrike(state, slot, speed, targetX, targetY) {
  const ball = state.ball
  const direction = slot === 0 ? 1 : -1
  const flightTime = Math.abs(targetY - ball.y) / speed
  if (!Number.isFinite(flightTime) || flightTime < 0.01) return
  let vz = (PONG.gravity * flightTime * flightTime / 2 - ball.z) / flightTime
  const netTime = Math.abs(PONG.length / 2 - ball.y) / speed
  const netHeight = ball.z + vz * netTime - PONG.gravity * netTime * netTime / 2
  if (netTime > 0 && netHeight < 0.22) vz += (0.22 - netHeight) / netTime
  ball.vx = (targetX - ball.x) / flightTime
  ball.vy = direction * speed
  ball.vz = vz
  state.hitter = slot
  state.ownBounces = 0
  state.receivedBounces = 0
  state.serving = false
  state.rally += 1
  pongEffect(state, 'strike')
}

function pongPaddleContact(ball, previous, player, dt) {
  const minY = player.y - 0.32
  const maxY = player.y + 0.12
  if (Math.max(previous.y, ball.y) < minY || Math.min(previous.y, ball.y) > maxY) return null

  const travelY = ball.y - previous.y
  const contactY = clamp(player.y, Math.min(previous.y, ball.y), Math.max(previous.y, ball.y))
  const contactTime = Math.abs(travelY) > 1e-6
    ? clamp((contactY - previous.y) / travelY, 0, 1)
    : 1
  const x = previous.x + (ball.x - previous.x) * contactTime
  const z = previous.z + (ball.z - previous.z) * contactTime
  const playerX = player.x - player.vx * dt * (1 - contactTime)
  if (Math.abs(x - playerX) >= 0.28 || z <= -0.08 || z >= 0.75) return null

  return { x, y: contactY, z }
}

function tickPong(state, dt) {
  state.time += dt
  const [bottom, top] = state.players
  const ball = state.ball
  for (const [slot, player] of state.players.entries()) {
    const minY = slot === 0 ? -0.55 : PONG.length / 2 + 0.18
    const maxY = slot === 0 ? PONG.length / 2 - 0.18 : PONG.length + 0.55
    const nextX = clamp(player.targetX, -PONG.width / 2 + 0.14, PONG.width / 2 - 0.14)
    const nextY = clamp(player.targetY, minY, maxY)
    const step = slot === 0 ? 32 : 22
    const oldX = player.x
    const oldY = player.y
    player.x += (nextX - player.x) * (1 - Math.exp(-step * dt))
    player.y += (nextY - player.y) * (1 - Math.exp(-step * dt))
    player.vx = dt > 0 ? (player.x - oldX) / dt : 0
    player.vy = dt > 0 ? (player.y - oldY) / dt : 0
    const towardPaddle = slot === 0 ? ball.vy < 0 && ball.y < player.y + 1 : ball.vy > 0 && ball.y > player.y - 1
    const near = towardPaddle && Math.abs(ball.y - player.y) < 1.15
    player.z += ((near ? clamp(ball.z, 0.08, 0.5) : 0.12) - player.z) * Math.min(1, dt * 30)
    player.sw *= Math.exp(-dt * 10)
  }

  if (state.state === 'serve') {
    const server = state.players[state.server]
    ball.x = server.x
    ball.y = state.server === 0 ? 0.1 : PONG.length - 0.1
    ball.z = 0.3 + Math.sin(state.time * 4) * 0.02
    return
  }
  if (state.state === 'point') {
    state.pause -= dt
    if (state.pause <= 0) {
      const total = state.score[0] + state.score[1]
      if ((state.score[0] >= 11 || state.score[1] >= 11) && Math.abs(state.score[0] - state.score[1]) >= 2) {
        state.state = 'over'
        state.message = state.score[0] === state.score[1] ? 'Égalité' : state.score[0] > state.score[1] ? 'Victoire !' : 'Défaite'
        return
      }
      state.server = total >= 20 ? total % 2 : Math.floor(total / 2) % 2
      pongServe(state)
      return
    }
  }
  if (state.state !== 'play') return

  const previousY = ball.y
  const previous = { x: ball.x, y: previousY, z: ball.z }
  ball.vz -= PONG.gravity * dt
  ball.x += ball.vx * dt
  ball.y += ball.vy * dt
  ball.z += ball.vz * dt
  if (ball.z < -0.8) {
    ball.z = -0.8
    ball.vx = ball.vy = ball.vz = 0
  }
  if (!state.netFault && state.receivedBounces >= 1) {
    if (state.hitter === 1 && ball.vy < 0) {
      const contact = pongPaddleContact(ball, previous, bottom, dt)
      if (contact) {
        Object.assign(ball, contact)
        const power = clamp(bottom.vy, 0, 4)
        bottom.sw = 1
        pongStrike(state, 0, 3.1 + power * 0.35,
          clamp(ball.x + (ball.x - bottom.x) * 2 + bottom.vx * 0.12, -PONG.width / 2 + 0.1, PONG.width / 2 - 0.1),
          2 + power * 0.1)
        return
      }
    } else if (state.hitter === 0 && ball.vy > 0) {
      const contact = pongPaddleContact(ball, previous, top, dt)
      if (contact) {
        Object.assign(ball, contact)
        top.sw = 1
        pongStrike(state, 1, 3.35, clamp((bottom.targetX - PONG.width / 2) * 1.4, -1.1, 1.1), 0.7)
        return
      }
    }
  }
  if (previousY >= 0 && ball.y < 0) return pongPoint(state, 1)
  if (previousY <= PONG.length && ball.y > PONG.length) return pongPoint(state, 0)
  if (!state.netFault && ((previousY < PONG.length / 2 && ball.y >= PONG.length / 2)
    || (previousY > PONG.length / 2 && ball.y <= PONG.length / 2)) && ball.z < PONG.netHeight + 0.02) {
    state.netFault = true
    ball.vy *= -0.15
    ball.vx *= 0.3
    pongEffect(state, 'net')
  }
  const halfWidth = PONG.width / 2
  if (ball.z <= 0 && ball.vz < 0 && Math.abs(ball.x) <= halfWidth && ball.y >= 0 && ball.y <= PONG.length && ball.z > -0.3) {
    ball.z = 0
    ball.vz = -ball.vz * 0.88
    ball.vx *= 0.99
    ball.vy *= 0.99
    const side = ball.y < PONG.length / 2 ? 0 : 1
    if (side === state.hitter) {
      if (state.serving && state.ownBounces === 0) state.ownBounces = 1
      else return pongPoint(state, 1 - state.hitter)
    } else {
      if (state.serving && state.ownBounces === 0) return pongPoint(state, 1 - state.hitter)
      state.receivedBounces += 1
      if (state.receivedBounces >= 2) return pongPoint(state, state.hitter)
    }
    pongEffect(state, 'bounce')
  }
  if (ball.z < -0.35) return pongPoint(state, state.netFault || state.receivedBounces === 0 ? 1 - state.hitter : state.hitter)

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
      player.targetX = clamp(input.x, -PONG.width / 2 + 0.14, PONG.width / 2 - 0.14)
      player.targetY = clamp(input.y, slot === 0 ? -0.55 : PONG.length / 2 + 0.18, slot === 0 ? PONG.length / 2 - 0.18 : PONG.length + 0.55)
      return true
    }
    if (input.type === 'serve' && state.state === 'serve' && state.server === slot) {
      const direction = slot === 0 ? 1 : -1
      Object.assign(state.ball, { x: player.x, y: slot === 0 ? 0.1 : PONG.length - 0.1, z: 0.3, vx: clamp(player.vx * 0.1, -0.6, 0.6), vy: direction * 2.9, vz: 0 })
      pongStartRally(state, slot)
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
