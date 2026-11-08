export class FlightModel {
  constructor(random = Math.random) {
    this.random = random
    this.limit = 5.555
    this.reset(-3)
  }

  reset(x) {
    this.x = x
    this.y = 0
    this.vy = 0
    this.score = 0
    this.coins = 0
    this.alive = true
    this.distance = 0
    this.elapsed = 0
    this.nextCoinAt = 5
    this.passedGates = new Set()
    this.nextGateId = 6
    this.gates = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      x: x + 5.9 + index * 8.5,
      center: index === 0 ? 0.1 : this.nextCenter(),
      passed: false,
    }))
  }

  nextCenter() {
    return (this.random() - 0.5) * 2.2
  }

  flap() {
    if (this.alive) this.vy = 6.5
  }

  step(dt, course = null) {
    if (!this.alive) return { hit: false, passed: 0 }

    const gates = course?.gates ?? this.gates
    const speed = course?.speed ?? 2.4 + Math.min(this.score, 35) * 0.008
    this.vy = Math.max(-8.5, this.vy - 14.5 * dt)
    this.y += this.vy * dt
    this.distance += speed * dt
    this.elapsed += dt
    while (this.elapsed >= this.nextCoinAt) {
      if (Math.abs(this.y) < 1.1) this.coins += 1
      this.nextCoinAt += 5
    }

    let hit = this.y - 0.27 < -this.limit || this.y + 0.27 > this.limit
    let passed = 0

    if (!course) {
      for (const gate of gates) gate.x -= speed * dt
    }

    for (const gate of this.elapsed >= 10 ? gates : []) {
      if (Math.abs(gate.x - this.x) < 0.83) {
        const dx = Math.max(Math.abs(gate.x - this.x) - 0.56, 0)
        const dy = Math.max(0, 1.82 - Math.abs(this.y - gate.center))
        if (dx * dx + dy * dy < 0.27 * 0.27) hit = true
      }

      if (this.y < -4.29 && this.y > -6.59) {
        const width = 0.22 + 0.78 * Math.min(1, Math.max(0, (this.y + 6.32) / 1.76))
        const dx = Math.max(Math.abs(gate.x - this.x) - width, 0)
        const dy = Math.max(this.y + 4.56, -6.32 - this.y, 0)
        if (dx * dx + dy * dy < 0.27 * 0.27) hit = true
      }
    }

    if (!hit && this.elapsed >= 10) {
      for (const gate of gates) {
        const alreadyPassed = course ? this.passedGates.has(gate.id) : gate.passed
        if (!alreadyPassed && gate.x + 0.56 < this.x - 0.27) {
          if (course) this.passedGates.add(gate.id)
          else gate.passed = true
          this.score += 1
          passed += 1
        }
      }
    }

    if (!course) {
      for (const gate of gates) {
        if (gate.x < this.x - 7) {
          gate.x = Math.max(...gates.map((item) => item.x)) + 8.5
          gate.center = this.nextCenter()
          gate.passed = false
          gate.id = this.nextGateId
          this.nextGateId += 1
        }
      }
    }

    this.alive = !hit
    return { hit, passed }
  }
}

export function seededRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}
