import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createQuizArenaMatch,
  quizArenaPlayerSnapshot,
  submitQuizArenaAnswer,
  tickQuizArenaMatch,
  useQuizArenaJoker,
} from './quiz-arena.mjs'

test('creates reproducible questions without exposing answers in active snapshots', () => {
  const first = createQuizArenaMatch(417, 1000)
  const second = createQuizArenaMatch(417, 1000)

  assert.equal(first.questions.length, 15)
  assert.deepEqual(first.questions, second.questions)
  const snapshot = quizArenaPlayerSnapshot(first, 0, 1000)
  assert.equal(snapshot.question.options.length, 4)
  assert.equal('correctIndex' in snapshot.question, false)
  assert.deepEqual(snapshot.answers, [null, null])
  assert.deepEqual(snapshot.results, null)
  assert.equal('lives' in snapshot, false)
  assert.equal(snapshot.roundRemainingMs, 15_000)
})

test('validates answers, scores both players, and hides private joker choices', () => {
  const state = createQuizArenaMatch(219, 5000)
  const correct = state.questions[0].correctIndex

  assert.equal(useQuizArenaJoker(state, 0, 5000).ok, true)
  assert.equal(state.eliminated[0].length, 2)
  assert.equal(state.eliminated[0].includes(correct), false)
  assert.deepEqual(quizArenaPlayerSnapshot(state, 1, 5000).eliminated, [])
  assert.equal(useQuizArenaJoker(state, 0, 5000).ok, false)
  assert.equal(submitQuizArenaAnswer(state, 0, -1, 5000).ok, false)
  assert.equal(submitQuizArenaAnswer(state, 0, correct, 5000).ok, true)
  assert.equal(submitQuizArenaAnswer(state, 0, correct, 5000).ok, false)
  assert.deepEqual(quizArenaPlayerSnapshot(state, 1, 5000).answers, [null, null])
  assert.equal(submitQuizArenaAnswer(state, 1, (correct + 1) % 4, 5000).ok, true)
  assert.equal(state.phase, 'question')
  assert.deepEqual(state.scores, [0, 0])
  assert.deepEqual(quizArenaPlayerSnapshot(state, 0, 5000).answers, [null, null])
  const bothChosen = quizArenaPlayerSnapshot(state, 0, 8000)
  assert.equal(bothChosen.phase, 'question')
  assert.equal(bothChosen.roundRemainingMs, 12_000)
  assert.equal(tickQuizArenaMatch(state, 19_999), false)
  assert.equal(tickQuizArenaMatch(state, 20_000), true)

  const first = quizArenaPlayerSnapshot(state, 0, 20_000)
  const second = quizArenaPlayerSnapshot(state, 1, 20_000)
  assert.equal(first.revealRemainingMs, 5000)
  assert.equal('correctIndex' in first.question, true)
  assert.deepEqual(first.scores, [100, 0])
  assert.deepEqual(first.results, [true, false])
  assert.deepEqual(first.answers, [correct, (correct + 1) % 4])
  assert.equal(second.results[0], true)
})

test('times out unanswered players and finishes after fifteen questions with a five-second reveal', () => {
  const timedOut = createQuizArenaMatch(123, 10_000)

  assert.equal(tickQuizArenaMatch(timedOut, 24_999), false)
  assert.equal(tickQuizArenaMatch(timedOut, 25_000), true)
  assert.equal(timedOut.phase, 'reveal')
  assert.deepEqual(timedOut.scores, [0, 0])
  assert.equal(quizArenaPlayerSnapshot(timedOut, 0, 25_000).revealRemainingMs, 5000)

  const state = createQuizArenaMatch(456, 20_000)
  let now = 20_000
  for (let round = 0; round < 15; round += 1) {
    const correct = state.questions[state.round].correctIndex
    assert.equal(submitQuizArenaAnswer(state, 0, correct, now).ok, true)
    assert.equal(submitQuizArenaAnswer(state, 1, correct, now).ok, true)
    assert.equal(state.phase, 'question')
    assert.equal(tickQuizArenaMatch(state, now + 14_999), false)
    assert.equal(tickQuizArenaMatch(state, now + 15_000), true)
    assert.equal(tickQuizArenaMatch(state, now + 19_999), false)
    assert.equal(tickQuizArenaMatch(state, now + 20_000), true)
    now += 20_000
  }

  assert.equal(state.status, 'finished')
  assert.equal(state.phase, 'finished')
  assert.equal(state.winner, null)
})

test('awards a completed match to the player with the higher score', () => {
  const state = createQuizArenaMatch(97, 30_000)
  state.round = state.questions.length - 1
  state.phase = 'reveal'
  state.revealEndsAt = 30_000
  state.scores = [400, 300]

  assert.equal(tickQuizArenaMatch(state, 30_000), true)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 0)
})
