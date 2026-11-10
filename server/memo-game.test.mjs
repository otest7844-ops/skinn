import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoMatch, flipMemoCard, memoPlayerSnapshot, tickMemoMatch } from './memo-game.mjs'

test('creates a single 5x5 board with twelve pairs and the visible star', () => {
  const first = createMemoMatch(123, 10_000)
  const second = createMemoMatch(123, 10_000)
  assert.deepEqual(first.cards, second.cards)
  assert.equal(first.cards.length, 25)
  assert.equal(first.cards.filter((card) => card.symbol === '⭐' && card.isStar && card.faceUp).length, 1)
  const counts = new Map()
  for (const card of first.cards.filter((item) => !item.isStar)) {
    counts.set(card.symbol, (counts.get(card.symbol) ?? 0) + 1)
  }
  assert.equal(counts.size, 12)
  assert.ok([...counts.values()].every((count) => count === 2))
})

test('allows simultaneous independent play and awards matches to the player who finds them', () => {
  const match = createMemoMatch(13, 10_000)
  const pair = new Map()
  for (const card of match.cards.filter((item) => !item.isStar)) {
    pair.set(card.symbol, [...(pair.get(card.symbol) ?? []), card.id])
  }
  const [pairIds, secondPairIds] = [...pair.values()]
  assert.equal(flipMemoCard(match, 0, pairIds[0], 10_000).ok, true)
  assert.equal(flipMemoCard(match, 1, secondPairIds[0], 10_000).ok, true)
  assert.deepEqual(match.openedBySlot, [[pairIds[0]], [secondPairIds[0]]])
  const firstPartialView = memoPlayerSnapshot(match, 0)
  const secondPartialView = memoPlayerSnapshot(match, 1)
  assert.equal(firstPartialView.cards[pairIds[0]].faceUp, true)
  assert.equal(firstPartialView.cards[secondPairIds[0]].faceUp, false)
  assert.equal(secondPartialView.cards[secondPairIds[0]].faceUp, true)
  assert.equal(secondPartialView.cards[pairIds[0]].faceUp, false)
  assert.equal(flipMemoCard(match, 0, pairIds[1], 10_000).ok, true)
  assert.equal(flipMemoCard(match, 1, secondPairIds[1], 10_000).ok, true)
  assert.deepEqual(match.scores, [1, 1])
  assert.equal(flipMemoCard(match, 0, pairIds[0], 10_000).ok, false)
  const firstView = memoPlayerSnapshot(match, 0)
  const secondView = memoPlayerSnapshot(match, 1)
  assert.equal(firstView.cards[pairIds[0]].faceUp, true)
  assert.equal(firstView.cards[secondPairIds[0]].faceUp, true)
  assert.equal(secondView.cards[secondPairIds[0]].faceUp, true)
  assert.equal(secondView.cards[pairIds[0]].faceUp, true)
  assert.equal('openedBySlot' in firstView, false)
  assert.equal('resolveAtBySlot' in secondView, false)

  const mismatch = createMemoMatch(17, 10_000)
  const unmatchedIds = []
  for (const card of mismatch.cards.filter((item) => !item.isStar)) {
    if (!unmatchedIds.some((id) => mismatch.cards[id].symbol === card.symbol)) unmatchedIds.push(card.id)
  }
  assert.equal(flipMemoCard(mismatch, 0, unmatchedIds[0], 10_000).ok, true)
  assert.equal(flipMemoCard(mismatch, 0, unmatchedIds[1], 10_000).ok, true)
  tickMemoMatch(mismatch, 10_499)
  assert.deepEqual(mismatch.openedBySlot[0], unmatchedIds.slice(0, 2))
  assert.equal(flipMemoCard(mismatch, 1, unmatchedIds[2], 10_499).ok, true)
  assert.deepEqual(mismatch.openedBySlot[1], [unmatchedIds[2]])
  tickMemoMatch(mismatch, 10_500)
  assert.deepEqual(mismatch.openedBySlot[0], [])
  assert.deepEqual(mismatch.openedBySlot[1], [unmatchedIds[2]])
})
