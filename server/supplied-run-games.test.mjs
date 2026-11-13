import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createSuppliedRunMatch,
  tickSuppliedRunMatch,
  updateSuppliedRunMatch,
} from './supplied-run-games.mjs'

test('scores two supplied game runs and picks the higher score after both finish', () => {
  const state = createSuppliedRunMatch('piaf-plume', 1000)

  assert.equal(updateSuppliedRunMatch(state, 0, { progress: 50, score: 1200, finished: true }, 1400).ok, true)
  assert.equal(state.status, 'playing')
  assert.equal(state.winner, null)
  assert.equal(updateSuppliedRunMatch(state, 1, { progress: 75, score: 1400, finished: true }, 1400).ok, true)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 1)
})

test('rejects invalid or regressing progress and caps client-reported scores', () => {
  const state = createSuppliedRunMatch('lave-montante', 1000)
  assert.equal(updateSuppliedRunMatch(state, 0, { progress: 70, score: 10, finished: false }, 1400).ok, true)
  assert.equal(updateSuppliedRunMatch(state, 0, { progress: 69, score: 11, finished: false }, 1800).ok, false)
  assert.equal(updateSuppliedRunMatch(state, 0, { progress: 80, score: 1_000_001, finished: false }, 1800).ok, false)
  assert.equal(updateSuppliedRunMatch(state, 1, { progress: 1, score: 1, finished: false, extra: true }, 1800).ok, false)
})

test('shares bounded live player positions with the opponent', () => {
  const state = createSuppliedRunMatch('lave-montante', 1000)
  const position = { x: 2, y: 12, z: -6, vx: 1, vy: 3, vz: -2, bestY: 11, coins: 2, alive: true }
  assert.equal(updateSuppliedRunMatch(state, 0, {
    progress: 20, score: 17, finished: false, position,
  }, 1400).ok, true)
  assert.deepEqual(state.positions[0], position)
  assert.equal(updateSuppliedRunMatch(state, 1, {
    progress: 10, score: 8, finished: false, position: { x: 1001, y: 0, z: 0 },
  }, 1400).ok, false)
  assert.deepEqual(state.positions[1], null)
})

test('ends a supplied game run on its shared deadline and resolves the score', () => {
  const state = createSuppliedRunMatch('mirror-run', 1000)
  assert.equal(updateSuppliedRunMatch(state, 0, { progress: 40, score: 8, finished: false }, 1400).ok, true)
  assert.equal(updateSuppliedRunMatch(state, 1, { progress: 40, score: 4, finished: false }, 1400).ok, true)
  assert.equal(tickSuppliedRunMatch(state, state.deadline - 1), false)
  assert.equal(tickSuppliedRunMatch(state, state.deadline), true)
  assert.equal(state.winner, 0)
  assert.deepEqual(state.completed, [true, true])
})
