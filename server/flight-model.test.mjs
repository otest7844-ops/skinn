import assert from 'node:assert/strict'
import test from 'node:test'
import { FlightModel, seededRandom } from './flight-model.mjs'

test('uses easier flight controls and deterministic, more-spaced obstacles', () => {
  const first = new FlightModel(seededRandom(1234))
  const second = new FlightModel(seededRandom(1234))
  assert.deepEqual(first.gates, second.gates)

  first.flap()
  first.step(1 / 120)
  assert.ok(first.y > 0)
  assert.ok(first.vy < 6.5)
  assert.equal(first.gates[1].x - first.gates[0].x, 8.5)
  assert.ok(first.gates.every((gate) => Math.abs(gate.center) <= 1.1))
})

test('delays obstacles for ten seconds and awards a coin every five seconds', () => {
  const model = new FlightModel(() => 0.5)
  model.y = 0
  model.gates[0].x = model.x
  const firstGateX = model.gates[0].x
  assert.equal(model.step(1 / 120).hit, false)
  assert.ok(model.gates[0].x < firstGateX)
  for (let frame = 0; frame < 1198; frame += 1) {
    model.y = 0
    model.vy = 0
    assert.equal(model.step(1 / 120).hit, false)
  }
  assert.ok(model.elapsed < 10)
  assert.equal(model.score, 0)

  model.reset(-3)
  for (let frame = 0; frame < 1201; frame += 1) {
    model.y = 0
    model.vy = 0
    model.step(1 / 120, { gates: [], speed: 2.4 })
  }
  assert.ok(model.elapsed >= 10)
  assert.equal(model.coins, 2)
})

test('scores each cleared gate once and detects collisions', () => {
  const model = new FlightModel(() => 0.5)
  model.elapsed = 10
  model.gates[0].x = model.x - 0.85
  assert.equal(model.step(1 / 120).passed, 1)
  assert.equal(model.step(1 / 120).passed, 0)
  assert.equal(model.score, 1)

  model.reset(-3)
  model.elapsed = 10
  model.gates[0].x = model.x
  model.y = 2.1
  assert.equal(model.step(1 / 120).hit, true)
  assert.equal(model.alive, false)
})

test('shares obstacle positions while tracking each player score independently', () => {
  const first = new FlightModel(() => 0.5)
  const second = new FlightModel(() => 0.5)
  first.elapsed = 10
  second.elapsed = 10
  const course = { gates: [{ id: 1, x: -3.85, center: 0.1 }], speed: 2.4 }
  const originalX = course.gates[0].x

  assert.equal(first.step(1 / 120, course).passed, 1)
  assert.equal(second.step(1 / 120, course).passed, 1)
  assert.equal(first.score, 1)
  assert.equal(second.score, 1)
  assert.equal(course.gates[0].x, originalX)
})

test('keeps the player safe from obstacles during the ten-second warmup', () => {
  for (const fps of [30, 60, 120]) {
    const model = new FlightModel(() => 0.5)
    for (let frame = 0; frame < fps * 5 && model.alive; frame += 1) {
      if (model.y < -0.25 && model.vy < 0) model.flap()
      for (let step = 0; step < 120 / fps; step += 1) model.step(1 / 120)
    }
    assert.ok(model.alive)
    assert.equal(model.score, 0)
  }
})
