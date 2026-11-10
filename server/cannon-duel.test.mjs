import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyCannonDuelInput,
  createCannonDuelState,
  tickCannonDuel,
} from './cannon-duel.mjs'

const FIELD_CENTER_X = 0.6 * 0.76

test('creates a deterministic match and authorizes only the firing player', () => {
  const first = createCannonDuelState(42)
  const second = createCannonDuelState(42)
  assert.deepEqual(first.players.map((player) => player.phase), second.players.map((player) => player.phase))
  assert.deepEqual(first.players.map((player) => player.hp), [20, 20])
  assert.equal(applyCannonDuelInput(first, 0, { type: 'fire', slot: 1 }), false)
  assert.equal(applyCannonDuelInput(first, 0, { type: 'fire' }), true)
  assert.equal(first.bullets[0].owner, 0)
  assert.equal(applyCannonDuelInput(first, 0, { type: 'fire' }), false)
  assert.equal(applyCannonDuelInput(first, 1, { type: 'fire' }), true)
  assert.deepEqual(first.bullets.map((bullet) => bullet.owner), [0, 1])
})

test('spawns each cannon shot at its own muzzle and toward the opposing cannon', () => {
  const blueState = createCannonDuelState(42)
  blueState.players[0].phase = Math.asin((Math.PI / 2 - 2.546) / 1.095)
  assert.equal(applyCannonDuelInput(blueState, 0, { type: 'fire' }), true)
  const blueShot = blueState.bullets[0]
  assert.equal(blueShot.owner, 0)
  assert.ok(Math.abs(blueShot.y - 0.23 - 56 / 800) < 1e-12)
  assert.ok(Math.abs(blueShot.x - FIELD_CENTER_X) < 1e-12)
  assert.ok(blueShot.vy > 0)
  assert.equal(blueState.effects[0].owner, 0)

  const redState = createCannonDuelState(42)
  redState.players[1].phase = Math.asin((3 * Math.PI / 2 - 3.737) / 1.095)
  assert.equal(applyCannonDuelInput(redState, 1, { type: 'fire' }), true)
  const redShot = redState.bullets[0]
  assert.equal(redShot.owner, 1)
  assert.ok(Math.abs(redShot.y - 0.84 + 56 / 800) < 1e-12)
  assert.ok(Math.abs(redShot.x - FIELD_CENTER_X) < 1e-12)
  assert.ok(redShot.vy < 0)
  assert.equal(redState.effects[0].owner, 1)
})

test('simulates projectile gravity, opposing projectile clashes, and damage authoritatively', () => {
  const state = createCannonDuelState(7)
  state.players[0].phase = Math.asin((Math.PI / 2 - 2.546) / 1.095)
  const initialY = state.players[0].phase
  assert.equal(applyCannonDuelInput(state, 0, { type: 'fire' }), true)
  const shot = state.bullets[0]
  const startY = shot.y
  tickCannonDuel(state, 0.2)
  assert.ok(shot.y > startY)
  assert.notEqual(state.players[0].phase, initialY)

  state.bullets = [
    { id: 20, x: 0.1, y: 0.5, vx: 0, vy: 0, owner: 0, age: 0 },
    { id: 21, x: 0.11, y: 0.5, vx: 0, vy: 0, owner: 1, age: 0 },
  ]
  tickCannonDuel(state, 0.01)
  assert.equal(state.bullets.length, 0)
  assert.ok(state.effects.some((effect) => effect.type === 'clash'))

  state.bullets = [{
    id: 22,
    x: FIELD_CENTER_X + 10 / 800,
    y: 0.84,
    vx: 0,
    vy: 0,
    owner: 0,
    age: 0,
  }]
  tickCannonDuel(state, 0.01)
  assert.equal(state.players[1].hp, 19)
  assert.deepEqual(state.score, [1, 0])
  assert.ok(state.effects.some((effect) => effect.type === 'hit' && effect.owner === 0))
})

test('credits self-inflicted damage to the opponent and declares a single winner', () => {
  const state = createCannonDuelState(3)
  state.players[0].hp = 1
  state.bullets = [{
    id: 1,
    x: FIELD_CENTER_X + 10 / 800,
    y: 0.23,
    vx: 0,
    vy: 0.1,
    owner: 0,
    age: 0.7,
  }]

  tickCannonDuel(state, 0.01)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 1)
  assert.deepEqual(state.score, [0, 1])
  assert.equal(applyCannonDuelInput(state, 1, { type: 'fire' }), false)
})
