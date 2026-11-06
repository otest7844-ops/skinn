import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoMatch, flipMemoCard, tickMemoMatch } from './memo-game.mjs'

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

test('enforces turns, allows replay after a match, and passes after a mismatch', () => {
  const match = createMemoMatch(13, 10_000)
  const pair = new Map()
  for (const card of match.cards.filter((item) => !item.isStar)) {
    pair.set(card.symbol, [...(pair.get(card.symbol) ?? []), card.id])
  }
  const pairIds = [...pair.values()][0]
  assert.equal(flipMemoCard(match, 1, pairIds[0], 10_000).ok, false)
  assert.equal(flipMemoCard(match, 0, pairIds[0], 10_000).ok, true)
  assert.equal(flipMemoCard(match, 0, pairIds[1], 10_000).ok, true)
  assert.deepEqual(match.scores, [1, 0])
  assert.equal(match.turn, 0)
  assert.equal(flipMemoCard(match, 0, pairIds[0], 10_000).ok, false)

  const mismatch = createMemoMatch(17, 10_000)
  const unmatchedIds = []
  for (const card of mismatch.cards.filter((item) => !item.isStar)) {
    if (!unmatchedIds.some((id) => mismatch.cards[id].symbol === card.symbol)) unmatchedIds.push(card.id)
  }
  assert.equal(flipMemoCard(mismatch, 0, unmatchedIds[0], 10_000).ok, true)
  assert.equal(flipMemoCard(mismatch, 0, unmatchedIds[1], 10_000).ok, true)
  assert.equal(flipMemoCard(mismatch, 1, unmatchedIds[2], 10_000).ok, false)
  tickMemoMatch(mismatch, 10_900)
  assert.equal(mismatch.turn, 1)
  assert.ok(unmatchedIds.slice(0, 2).every((id) => !mismatch.cards[id].faceUp))
})
