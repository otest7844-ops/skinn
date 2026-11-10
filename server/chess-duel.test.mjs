import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createChessDuelState,
  createSniperDuelState,
  submitChessMove,
  tickSniperDuel,
  updateSniperDuelScore,
} from './chess-duel.mjs'

test('chess room validates turns and synchronizes legal moves and captures', () => {
  const state = createChessDuelState()

  assert.equal(submitChessMove(state, 1, 52, 36).ok, false)
  assert.equal(submitChessMove(state, 0, 52, 36).ok, true)
  assert.equal(submitChessMove(state, 0, 11, 27).ok, false)
  assert.equal(submitChessMove(state, 1, 11, 27).ok, true)
  assert.equal(submitChessMove(state, 0, 36, 27).ok, true)
  assert.equal(state.scores[0], 1)
  assert.deepEqual(state.moves, [{ from: 52, to: 36 }, { from: 11, to: 27 }, { from: 36, to: 27 }])
})

test('chess rejects illegal moves and prevents leaving the king in check', () => {
  const state = createChessDuelState()

  assert.equal(submitChessMove(state, 0, 52, 20).ok, false)
  assert.equal(submitChessMove(state, 0, 48, 41).ok, false)
  assert.equal(state.moves.length, 0)
})

test('sniper duel records bounded scores and selects the higher score at timeout', () => {
  const state = createSniperDuelState(1000)

  assert.equal(updateSniperDuelScore(state, 0, { score: 300, kills: 1, finished: false }).ok, true)
  assert.equal(updateSniperDuelScore(state, 1, { score: 400, kills: 1, finished: false }).ok, false)
  assert.equal(updateSniperDuelScore(state, 1, { score: 300, kills: 1, finished: false }).ok, true)
  tickSniperDuel(state, 1)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, null)
})

test('sniper duel finishes early after both players finish and rejects later score changes', () => {
  const state = createSniperDuelState()

  assert.equal(updateSniperDuelScore(state, 0, { score: 300, kills: 1, finished: true }).ok, true)
  assert.equal(state.status, 'playing')
  assert.equal(updateSniperDuelScore(state, 1, { score: 100, kills: 1, finished: true }).ok, true)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 0)
  assert.equal(updateSniperDuelScore(state, 0, { score: 600, kills: 2, finished: true }).ok, false)
})
