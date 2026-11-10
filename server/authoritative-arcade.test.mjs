import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyAuthoritativeInput,
  createAuthoritativeGame,
  tickAuthoritativeGame,
} from './authoritative-arcade.mjs'

test('Ping-Pong uses the solo three-point match and automatically serves after a point', () => {
  const game = createAuthoritativeGame('ping-pong')
  game.score = [0, 2]
  game.state = 'play'
  game.ball = { x: 0, y: -795, vx: 0, vy: -100 }
  tickAuthoritativeGame(game, 0.02)
  assert.equal(game.state, 'over')
  assert.equal(game.winner, 1)
  assert.deepEqual(game.score, [0, 3])

  game.score = [1, 0]
  game.state = 'play'
  game.ball = { x: 0, y: -795, vx: 0, vy: -100 }
  tickAuthoritativeGame(game, 0.02)
  assert.equal(game.state, 'serve')
  assert.equal(game.serveTo, 0)
  assert.equal(game.serveTime, 0.8)
  tickAuthoritativeGame(game, 0.81)
  assert.equal(game.state, 'play')
})

test('Ping-Pong input moves only the assigned racket within the solo court limits', () => {
  const game = createAuthoritativeGame('ping-pong')
  assert.deepEqual(game.players.map(({ x, y }) => ({ x, y })), [
    { x: -150, y: -715 },
    { x: 40, y: 705 },
  ])
  assert.equal(applyAuthoritativeInput(game, 1, { type: 'move', x: 400, y: 0 }), true)
  assert.equal(game.players[1].targetX, 270)
  assert.equal(game.players[1].targetY, 305)
  assert.equal(game.players[0].targetX, -150)
  assert.equal(applyAuthoritativeInput(game, 1, { type: 'serve' }), false)
})

test('Ping-Pong uses the solo paddle-hit speed and bounces for both rackets', () => {
  const game = createAuthoritativeGame('ping-pong')
  game.state = 'play'
  game.ball = { x: -150, y: -600, vx: 0, vy: -1000 }

  tickAuthoritativeGame(game, 0.02)

  assert.equal(game.state, 'play')
  assert.equal(game.lastHit, 0)
  assert.ok(game.ball.vy > 850)
  assert.deepEqual(game.score, [0, 0])

  game.ball = { x: 40, y: 600, vx: 0, vy: 1000 }
  game.canHit = [true, true]

  tickAuthoritativeGame(game, 0.02)

  assert.equal(game.state, 'play')
  assert.equal(game.lastHit, 1)
  assert.ok(game.ball.vy < -850)
  assert.deepEqual(game.score, [0, 0])
})
