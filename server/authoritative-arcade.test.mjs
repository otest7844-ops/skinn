import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyAuthoritativeInput,
  createAuthoritativeGame,
  tickAuthoritativeGame,
} from './authoritative-arcade.mjs'

test('Ping-Pong alternates service after every deuce point and ends two points clear', () => {
  const game = createAuthoritativeGame('ping-pong')
  game.score = [10, 10]
  game.state = 'point'
  game.pause = 0.01
  tickAuthoritativeGame(game, 0.02)
  assert.equal(game.server, 0)
  assert.equal(game.state, 'serve')

  game.score = [10, 11]
  game.state = 'point'
  game.pause = 0.01
  tickAuthoritativeGame(game, 0.02)
  assert.equal(game.server, 1)

  game.score = [11, 9]
  game.state = 'point'
  game.pause = 0.01
  tickAuthoritativeGame(game, 0.02)
  assert.equal(game.state, 'over')
  assert.equal(game.message, 'Victoire !')
})

test('Ping-Pong input cannot move another player or serve out of turn', () => {
  const game = createAuthoritativeGame('ping-pong')
  assert.equal(applyAuthoritativeInput(game, 1, { type: 'move', x: 0.4, y: 0.1 }), true)
  assert.equal(game.players[1].targetX, 0.4)
  assert.equal(game.players[0].targetX, 0)
  assert.equal(applyAuthoritativeInput(game, 1, { type: 'serve' }), false)
  assert.equal(applyAuthoritativeInput(game, 0, { type: 'serve' }), true)
  assert.equal(game.state, 'play')
})

test('Ping-Pong paddles can return fast balls crossing either end of the table', () => {
  const game = createAuthoritativeGame('ping-pong')
  game.state = 'play'
  game.hitter = 1
  game.receivedBounces = 1
  game.ball = { x: 0, y: 0.05, z: 0.2, vx: 0, vy: -25, vz: 0 }

  tickAuthoritativeGame(game, 0.02)

  assert.equal(game.state, 'play')
  assert.equal(game.hitter, 0)
  assert.ok(game.ball.vy > 0)
  assert.deepEqual(game.score, [0, 0])

  game.hitter = 0
  game.receivedBounces = 1
  game.ball = { x: 0, y: 2.69, z: 0.3, vx: 0, vy: 25, vz: 0 }

  tickAuthoritativeGame(game, 0.02)

  assert.equal(game.state, 'play')
  assert.equal(game.hitter, 1)
  assert.ok(game.ball.vy < 0)
  assert.deepEqual(game.score, [0, 0])
})
