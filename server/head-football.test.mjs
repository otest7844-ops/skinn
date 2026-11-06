import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createHeadFootballMatch,
  sanitizeHeadFootballInput,
  tickHeadFootballMatch,
} from './head-football.mjs'

const neutral = { left: false, right: false, jump: false, kick: false, power: false }

test('sanitizes only independent boolean controls', () => {
  assert.deepEqual(sanitizeHeadFootballInput({ ...neutral, jump: true }), { ...neutral, jump: true })
  assert.equal(sanitizeHeadFootballInput({ ...neutral, unknown: true }), null)
  assert.equal(sanitizeHeadFootballInput({ ...neutral, kick: true, power: true }), null)
  assert.equal(sanitizeHeadFootballInput({ ...neutral, left: true, right: true }), null)
})

test('keeps players valid during countdown and moves them once play begins', () => {
  const match = createHeadFootballMatch([{ clubIndex: 0, playerIndex: 0 }, { clubIndex: 1, playerIndex: 1 }])
  const inputs = [{ ...neutral, right: true }, { ...neutral, left: true }]

  tickHeadFootballMatch(match, 1 / 20, inputs)
  assert.equal(match.status, 'count')
  assert.ok(Number.isFinite(match.players[0].x))
  assert.ok(Number.isFinite(match.players[1].x))

  for (let frame = 1; frame <= 72; frame += 1) tickHeadFootballMatch(match, 1 / 20, inputs)
  assert.equal(match.status, 'play')
  assert.ok(match.players[0].x > 330)
  assert.ok(match.players[1].x < 936)
})

test('authoritatively applies kicks and ends the match after a player scores ten goals', () => {
  const match = createHeadFootballMatch([null, null])
  match.status = 'play'
  match.ball = { x: 372, y: 377, vx: 0, vy: 0, rotation: 0, fire: 0 }

  tickHeadFootballMatch(match, 1 / 20, [{ ...neutral, kick: true }, neutral])
  assert.ok(match.ball.vx > 0)

  match.ball = { x: 1080, y: 300, vx: 0, vy: 0, rotation: 0, fire: 0 }
  tickHeadFootballMatch(match, 1 / 20, [neutral, neutral])
  assert.deepEqual(match.scores, [1, 0])
  assert.equal(match.status, 'goal')

  const matchToTen = createHeadFootballMatch([null, null])
  matchToTen.status = 'play'
  matchToTen.scores[0] = 9
  matchToTen.ball = { x: 1080, y: 300, vx: 0, vy: 0, rotation: 0, fire: 0 }
  tickHeadFootballMatch(matchToTen, 1 / 20, [neutral, neutral])
  assert.deepEqual(matchToTen.scores, [10, 0])
  assert.equal(matchToTen.status, 'goal')
  for (let frame = 0; frame < 36; frame += 1) tickHeadFootballMatch(matchToTen, 1 / 20, [neutral, neutral])
  assert.equal(matchToTen.status, 'finished')
  assert.equal(matchToTen.winner, 0)

  const untimedMatch = createHeadFootballMatch([null, null])
  untimedMatch.status = 'play'
  for (let frame = 0; frame < 1200; frame += 1) tickHeadFootballMatch(untimedMatch, 1 / 20, [neutral, neutral])
  assert.equal(untimedMatch.status, 'play')
  assert.deepEqual(untimedMatch.scores, [0, 0])
})
