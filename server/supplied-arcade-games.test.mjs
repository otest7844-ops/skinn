import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyHelixArenaInput,
  applyTrunkDuelInput,
  createHelixArenaState,
  createTrunkDuelState,
  tickHelixArena,
  tickTrunkDuel,
} from './supplied-arcade-games.mjs'

test('Arène Hélice validates movement and advances a shared seeded round', () => {
  const state = createHelixArenaState(123)
  assert.equal(applyHelixArenaInput(state, 0, { x: 2 }), false)
  assert.equal(applyHelixArenaInput(state, 2, { jump: true }), false)
  assert.equal(applyHelixArenaInput(state, 0, { x: 1, z: 0, jump: true }), true)
  assert.equal(applyHelixArenaInput(state, 1, { jump: true }), true)
  assert.ok(state.players[0].jumpBuffer > 0)
  assert.ok(state.players[1].jumpBuffer > 0)
  for (let frame = 0; frame < 60; frame += 1) tickHelixArena(state, 0.05)
  assert.equal(state.phase, 'playing')
  assert.ok(Number.isFinite(state.players[0].x))
  assert.ok(state.players[0].x > -6)
  assert.equal(state.target, 5)
})

test('Arène Hélice buffers both players’ jumps across network delay', () => {
  const state = createHelixArenaState(987)
  state.phase = 'playing'
  for (const player of state.players) {
    player.y = 1
    player.vy = 0
    player.grounded = false
  }
  assert.equal(applyHelixArenaInput(state, 0, { jump: true }), true)
  assert.equal(applyHelixArenaInput(state, 1, { jump: true }), true)
  assert.ok(state.players.every((player) => player.jumpBuffer >= 0.45))
  for (let frame = 0; frame < 6; frame += 1) tickHelixArena(state, 0.05)
  assert.ok(state.players.every((player) => player.y > 0 && player.grounded === false))
  assert.ok(state.players.every((player) => player.vy > 0))
})

test('Arène Hélice awards the surviving player and ends at the match target', () => {
  const state = createHelixArenaState(321)
  state.phase = 'playing'
  state.players[0].x = 0
  state.players[0].z = 0
  state.players[1].x = 6
  state.players[1].z = 0
  tickHelixArena(state, 0.02)
  assert.equal(state.phase, 'roundover')
  assert.equal(state.roundWinner, 1)
  assert.deepEqual(state.scores, [0, 1])

  state.phase = 'playing'
  state.scores[1] = 4
  state.players[0].x = 0
  state.players[0].z = 0
  state.players[1].x = 6
  state.players[1].z = 0
  tickHelixArena(state, 0.02)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 1)
})

test('Duel de Troncs generates deterministic hazards and validates discrete controls', () => {
  const first = createTrunkDuelState(456)
  const second = createTrunkDuelState(456)
  for (let frame = 0; frame < 20; frame += 1) {
    tickTrunkDuel(first, 0.05)
    tickTrunkDuel(second, 0.05)
  }
  assert.deepEqual(first, second)
  assert.ok(first.obstacles.length > 0)
  assert.equal(applyTrunkDuelInput(first, 0, { action: 'admin' }), false)
  assert.equal(applyTrunkDuelInput(first, 0, { action: 'right' }), true)
  assert.equal(first.players[0].lane, 1)
  assert.equal(applyTrunkDuelInput(first, 0, { action: 'jump' }), true)
  tickTrunkDuel(first, 0.05)
  assert.ok(first.players[0].jumpTime > 0)
})

test('Duel de Troncs jump clears a nearby thorn with network input lead', () => {
  const state = createTrunkDuelState(654)
  state.obstacles = [{ type: 'thorn', lane: 0, y: 0.85, row: 0 }]
  state.spawnY = 100_000
  assert.equal(applyTrunkDuelInput(state, 0, { action: 'jump' }), true)
  tickTrunkDuel(state, 0.05)
  assert.equal(state.players[0].alive, true)
  assert.ok(state.players[0].jumpTime > 0)
})

test('Duel de Troncs awards the last surviving runner after an obstacle collision', () => {
  const state = createTrunkDuelState(789)
  state.obstacles = [{ type: 'thorn', lane: 0, y: 0.85, row: 0 }]
  state.spawnY = 100_000
  state.players[1].lane = 1
  tickTrunkDuel(state, 0.05)
  assert.equal(state.players[0].alive, false)
  assert.equal(state.players[1].alive, true)
  for (let frame = 0; frame < 32; frame += 1) tickTrunkDuel(state, 0.05)
  assert.equal(state.phase, 'roundEnd')
  assert.equal(state.roundWinner, 1)
  assert.deepEqual(state.scores, [0, 1])
})
