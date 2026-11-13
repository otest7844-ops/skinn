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

test('Chemin de couleurs gives each player a different red-path turn of ten cases', () => {
  const state = createColorPathMatch(7, 1000)
  assert.equal(state.path.length, 10)
  assert.equal(state.turnSlot, 0)
  assert.equal(colorPathPlayerSnapshot(state, 0, 1000).path.length, 10)
  assert.equal(colorPathPlayerSnapshot(state, 1, 1000).path, undefined)
  assert.equal(tickColorPathMatch(state, state.phaseEndsAt), true)
  assert.equal(colorPathPlayerSnapshot(state, 0).path, undefined)
  assert.equal(applyColorPathInput(state, 1, { type: 'tile', tile: state.path[0] }, 11_000), false)

  let now = state.inputDeadline - 20_000
  for (const tile of state.path) {
    now += 100
    assert.equal(applyColorPathInput(state, 0, { type: 'tile', tile }, now), true)
  }
  assert.equal(state.completed[0], true)
  assert.equal(state.scores[0], 10)
  assert.equal(state.phase, 'showing')
  assert.equal(state.turnSlot, 1)
  assert.equal(state.path.length, 10)
  assert.notDeepEqual(state.path, state.previousPath)
  assert.equal(colorPathPlayerSnapshot(state, 0, now).path, undefined)
  assert.equal(colorPathPlayerSnapshot(state, 1, now).path.length, 10)

  assert.equal(tickColorPathMatch(state, state.phaseEndsAt), true)
  const wrongTile = (state.path[0] + 1) % 25
  assert.equal(applyColorPathInput(state, 1, { type: 'tile', tile: wrongTile }, state.phaseEndsAt + 100), true)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 0)
  assert.equal(state.scores[1], 0)
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
  assert.deepEqual(state.players.map((player) => player.lane), [-4, 4])
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

test('Moto Taxi server penalties stop collisions and red-light violations for both clients', () => {
  const collision = createMotoTaxiMatch()
  collision.phase = 'racing'
  collision.players[0].speed = 20
  assert.equal(applyMotoTaxiInput(collision, 0, {
    action: 'violation', reason: 'collision', distance: 0,
  }), true)
  assert.equal(applyMotoTaxiInput(collision, 0, {
    action: 'violation', reason: 'collision', distance: 0,
  }), false)
  assert.equal(tickMotoTaxiMatch(collision, 0.05), true)
  assert.equal(collision.players[0].speed, 0)
  assert.ok(collision.players[0].penaltyRemaining < 5)
  assert.equal(motoTaxiPlayerSnapshot(collision).players[0].penaltyReason, 'COLLISION · ')

  const redLight = createMotoTaxiMatch()
  redLight.phase = 'racing'
  redLight.elapsed = 10.9
  redLight.players[0].distance = 449
  redLight.players[0].speed = 30
  redLight.players[0].input.gas = true
  assert.equal(tickMotoTaxiMatch(redLight, 0.05), true)
  assert.equal(redLight.players[0].distance, 448.5)
  assert.equal(redLight.players[0].speed, 0)
  assert.equal(redLight.players[0].penaltyReason, 'FEU ROUGE · ')
})

test('Moto Taxi penalizes players for crossing the road edge and riding into each other', () => {
  const offRoad = createMotoTaxiMatch()
  offRoad.phase = 'racing'
  offRoad.players[0].lane = 8.3
  offRoad.players[0].speed = 30
  offRoad.players[0].input.right = true
  assert.equal(tickMotoTaxiMatch(offRoad, 0.05), true)
  assert.equal(offRoad.players[0].speed, 0)
  assert.equal(offRoad.players[0].penaltyReason, 'HORS ROUTE · ')

  const collision = createMotoTaxiMatch()
  collision.phase = 'racing'
  collision.players.forEach((player, index) => {
    player.distance = index * 0.8
    player.lane = index * 0.5
    player.speed = 30
    player.input.gas = true
  })
  assert.equal(tickMotoTaxiMatch(collision, 0.05), true)
  assert.deepEqual(collision.players.map((player) => player.speed), [0, 0])
  assert.deepEqual(collision.players.map((player) => player.penaltyReason), [
    'COLLISION · ', 'COLLISION · ',
  ])
})
