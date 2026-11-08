import assert from 'node:assert/strict'
import test from 'node:test'
import { createDictationMatch, submitDictationAnswer, tickDictationMatch } from './dictation-game.mjs'

test('shares a deterministic sentence and only awards exact answers', () => {
  const first = createDictationMatch(321, 1000)
  const second = createDictationMatch(321, 1000)
  assert.equal(first.sentence, second.sentence)
  assert.equal(submitDictationAnswer(first, 0, `${first.sentence} !`, 2000).correct, false)
  assert.deepEqual(first.scores, [0, 1])
  assert.equal(first.lastResult.winnerSlot, 1)
  assert.equal(submitDictationAnswer(first, 1, first.sentence, 3000).ok, false)
})

test('plays a best-of-three match and identifies the winner', () => {
  const match = createDictationMatch(112, 1000)
  assert.equal(submitDictationAnswer(match, 1, match.sentence, 2000).correct, true)
  tickDictationMatch(match, 4000)
  assert.equal(match.round, 2)
  assert.equal(submitDictationAnswer(match, 1, match.sentence, 5000).correct, true)
  assert.equal(match.status, 'finished')
  assert.equal(match.winner, 1)
})

test('ends a round on timeout and draws the match after three unanswered rounds', () => {
  const match = createDictationMatch(44, 1000)
  tickDictationMatch(match, 62_000)
  assert.equal(match.phase, 'intermission')
  tickDictationMatch(match, 64_000)
  tickDictationMatch(match, 124_000)
  tickDictationMatch(match, 126_000)
  tickDictationMatch(match, 186_000)
  assert.equal(match.status, 'finished')
  assert.equal(match.winner, null)
  assert.deepEqual(match.scores, [0, 0])
})
