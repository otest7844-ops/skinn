import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createWordSearchMatch,
  findWordSearchPath,
  submitWordSearchWord,
  tickWordSearchMatch,
  WORD_SEARCH_COUNT,
  WORD_SEARCH_SIZE,
} from '../shared/word-search.mjs'

function findAllPaths(match) {
  const paths = []
  for (let start = 0; start < match.grid.length; start += 1) {
    for (let end = 0; end < match.grid.length; end += 1) {
      const path = findWordSearchPath(match, start, end)
      if (path) paths.push({ start, end, word: path.word })
    }
  }
  return paths
}

test('creates a repeatable word-search board containing every listed word', () => {
  const first = createWordSearchMatch(312, 100)
  const second = createWordSearchMatch(312, 100)
  assert.deepEqual(first, second)
  assert.equal(first.size, WORD_SEARCH_SIZE)
  assert.equal(first.grid.length, WORD_SEARCH_SIZE ** 2)
  assert.equal(first.words.length, WORD_SEARCH_COUNT)
  assert.equal(new Set(first.placements.flatMap((placement) => placement.cells)).size,
    first.placements.reduce((count, placement) => count + placement.cells.length, 0))
  for (const word of first.words) {
    assert.ok(findAllPaths(first).some((path) => path.word === word), `${word} is present`)
  }
})

test('scores each valid word once and finishes with the correct winner', () => {
  const match = createWordSearchMatch(29)
  const expectedScores = [0, 0]
  for (let index = 0; index < match.words.length; index += 1) {
    const path = findAllPaths(match).find((candidate) =>
      !match.found.some((entry) => entry.word === candidate.word),
    )
    assert.ok(path)
    const slot = index % 2
    const result = submitWordSearchWord(match, slot, path.start, path.end)
    assert.equal(result.ok, true)
    expectedScores[slot] += result.points
  }
  assert.equal(match.status, 'finished')
  assert.deepEqual(match.scores, expectedScores)
  assert.equal(match.winner,
    match.scores[0] === match.scores[1] ? null : match.scores[0] > match.scores[1] ? 0 : 1)
  assert.equal(submitWordSearchWord(match, 0, 0, 0).ok, false)
})

test('rejects invalid paths and updates elapsed time only while active', () => {
  const match = createWordSearchMatch(57, 1000)
  assert.equal(submitWordSearchWord(match, 0, -1, 12).ok, false)
  assert.equal(submitWordSearchWord(match, 2, 0, 1).ok, false)
  assert.equal(tickWordSearchMatch(match, 6100).elapsedSeconds, 5)
})
