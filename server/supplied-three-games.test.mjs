import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyCardDuelInput,
  applyColorPathInput,
  applyMotoTaxiInput,
  cardDuelPlayerSnapshot,
  colorPathPlayerSnapshot,
  createCardDuelMatch,
  createColorPathMatch,
  createMotoTaxiMatch,
  motoTaxiPlayerSnapshot,
  tickCardDuelMatch,
  tickColorPathMatch,
  tickMotoTaxiMatch,
} from './supplied-three-games.mjs'

test('Chemin de couleurs validates each player independently and hides the path during input', () => {
  const state = createColorPathMatch(7, 1000)
  assert.equal(state.path.length, 3)
  assert.equal(colorPathPlayerSnapshot(state, 0, 1000).path.length, 3)
  assert.equal(tickColorPathMatch(state, state.phaseEndsAt), true)
  assert.equal(colorPathPlayerSnapshot(state, 0).path, undefined)

  let now = state.inputDeadline - 20_000
  for (const tile of state.path) {
    now += 100
    assert.equal(applyColorPathInput(state, 0, { type: 'tile', tile }, now), true)
  }
  assert.equal(state.completed[0], true)
  assert.equal(state.scores[0], 1)

  const wrongTile = (state.path[0] + 1) % 25
  assert.equal(applyColorPathInput(state, 1, { type: 'tile', tile: wrongTile }, now + 100), true)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 0)
})

test('Duel de cartes hides the opponent hand until each round is revealed', () => {
  const state = createCardDuelMatch(19)
  const firstView = cardDuelPlayerSnapshot(state, 0)
  const secondView = cardDuelPlayerSnapshot(state, 1)
  assert.ok(firstView.hands[0].every(Number.isInteger))
  assert.ok(secondView.hands[1].every(Number.isInteger))
  assert.ok(firstView.hands[1].every((card) => card === null))
  assert.ok(secondView.hands[0].every((card) => card === null))

  const firstCard = state.hands[0][0]
  const secondCard = state.hands[1][0]
  assert.equal(applyCardDuelInput(state, 0, { type: 'play-card', card: firstCard }, 1000), true)
  assert.equal(cardDuelPlayerSnapshot(state, 1).played[0], null)
  assert.equal(applyCardDuelInput(state, 1, { type: 'play-card', card: secondCard }, 1200), true)
  assert.equal(state.phase, 'reveal')
  assert.deepEqual(cardDuelPlayerSnapshot(state, 0).played, [firstCard, secondCard])

  const expectedWinner = firstCard === secondCard ? null : firstCard > secondCard ? 0 : 1
  assert.equal(tickCardDuelMatch(state, state.revealEndsAt), true)
  assert.equal(state.round, 2)
  assert.equal(state.phase, 'play')
  assert.deepEqual(state.scores, expectedWinner === null
    ? [0, 0]
    : expectedWinner === 0 ? [1, 0] : [0, 1])
})

test('Moto Taxi accepts bounded controls and ends when the server race reaches the finish', () => {
  const state = createMotoTaxiMatch()
  assert.equal(applyMotoTaxiInput(state, 0, { action: 'gas', pressed: true }), true)
  assert.equal(applyMotoTaxiInput(state, 0, { action: 'teleport', pressed: true }), false)
  assert.equal(tickMotoTaxiMatch(state, 0.05), true)
  assert.equal(state.players[0].distance, 0)
  state.phase = 'racing'
  assert.equal(tickMotoTaxiMatch(state, 0.05), true)
  assert.ok(state.players[0].speed > 0)
  assert.ok(state.players[0].distance > 0)
  assert.deepEqual(motoTaxiPlayerSnapshot(state).scores, state.players.map((player) => player.distance))

  state.players[0].distance = 5999
  state.players[0].speed = 30
  assert.equal(tickMotoTaxiMatch(state, 0.05), true)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 0)
})
