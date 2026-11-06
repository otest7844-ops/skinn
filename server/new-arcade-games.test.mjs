import test from 'node:test'
import assert from 'node:assert/strict'
import {
  applyCanyonRaceInput,
  applyKnifeDuelInput,
  createCanyonRaceState,
  createKnifeDuelState,
  tickCanyonRace,
  tickKnifeDuel,
} from './new-arcade-games.mjs'

test('knife duel only accepts movement commands and clamps pointer targets', () => {
  const state = createKnifeDuelState(21)
  assert.equal(applyKnifeDuelInput(state, 0, { direction: -1 }), true)
  assert.equal(applyKnifeDuelInput(state, 0, { targetZ: 100 }), true)
  assert.equal(state.players[0].input.direction, -1)
  assert.equal(state.players[0].input.targetZ, 3.05)
  assert.equal(applyKnifeDuelInput(state, 1, { x: 900, lives: 0 }), false)
  assert.equal(state.players[1].lives, 20)
})

test('knife duel resolves hits and declares the other player the winner', () => {
  const state = createKnifeDuelState(9)
  state.players[0].lives = 1
  state.knives.push({
    id: 1,
    x: -1.5,
    z: state.players[0].z,
    speed: 5.8,
    type: 0,
    done: [false, false],
  })

  tickKnifeDuel(state, 0.016)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 1)
  assert.equal(state.players[0].lives, 0)
})

test('canyon race validates controls and first player to the cake wins', () => {
  const state = createCanyonRaceState(33)
  assert.equal(applyCanyonRaceInput(state, 1, { right: true, jump: true }), true)
  assert.equal(state.players[1].input.right, true)
  assert.equal(state.players[1].jumpBuffer, 0.13)
  assert.equal(applyCanyonRaceInput(state, 0, { x: 10000 }), false)

  state.players[0].x = 64000
  tickCanyonRace(state, 0.016)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 0)
})

test('canyon columns knock down a player who fails to jump', () => {
  const state = createCanyonRaceState(7)
  const player = state.players[0]
  const pillar = state.pillars[0]
  player.x = pillar.x
  pillar.state = 'down'
  pillar.b = 470
  pillar.t = 0

  tickCanyonRace(state, 0.016)
  assert.equal(player.dead, true)
  assert.equal(player.deaths, 1)
  assert.equal(state.status, 'playing')
})
