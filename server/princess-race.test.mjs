import assert from 'node:assert/strict'
import test from 'node:test'
import { applyPrincessRaceAction, createPrincessRaceState } from './princess-race.mjs'

test('validates turns, applies server rolls, and spends only the active player’s red dice', () => {
  const state = createPrincessRaceState()
  assert.deepEqual(state.positions, [0, 0])
  assert.deepEqual(state.redDice, [3, 3])
  assert.equal(applyPrincessRaceAction(state, 1, { die: 'white' }, 4), false)
  assert.equal(applyPrincessRaceAction(state, 0, { die: 'white', result: 6 }, 7), false)
  assert.equal(applyPrincessRaceAction(state, 0, { die: 'white', result: 6 }, 6), true)
  assert.deepEqual(state.positions, [6, 0])
  assert.equal(state.turn, 1)
  assert.equal(applyPrincessRaceAction(state, 1, { die: 'red' }, 3), true)
  assert.deepEqual(state.positions, [3, 0])
  assert.deepEqual(state.redDice, [3, 2])
  assert.equal(state.lastAction.result, 3)
})

test('prevents exhausted red dice and declares a winner exactly at step 30', () => {
  const state = createPrincessRaceState()
  state.redDice[0] = 0
  assert.equal(applyPrincessRaceAction(state, 0, { die: 'red' }, 4), false)

  state.positions[0] = 27
  assert.equal(applyPrincessRaceAction(state, 0, { die: 'white' }, 6), true)
  assert.equal(state.positions[0], 30)
  assert.equal(state.winner, 0)
  assert.equal(applyPrincessRaceAction(state, 1, { die: 'white' }, 1), false)
})
