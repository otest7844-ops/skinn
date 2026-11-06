import { randomInt } from 'node:crypto'

export function createPrincessRaceState() {
  return {
    game: 'princess-race',
    positions: [0, 0],
    redDice: [3, 3],
    turn: 0,
    winner: null,
    actionSeq: 0,
    lastAction: null,
  }
}

export function applyPrincessRaceAction(state, slot, input, roll = randomInt(1, 7)) {
  if (!state || state.game !== 'princess-race' || ![0, 1].includes(slot)
    || state.winner !== null || state.turn !== slot
    || !['white', 'red'].includes(input?.die)
    || !Number.isInteger(roll) || roll < 1 || roll > 6) return false

  if (input.die === 'red' && state.redDice[slot] < 1) return false

  const before = [...state.positions]
  if (input.die === 'white') {
    state.positions[slot] = Math.min(30, state.positions[slot] + roll)
  } else {
    state.redDice[slot] -= 1
    state.positions[1 - slot] = Math.max(0, state.positions[1 - slot] - roll)
  }

  state.actionSeq += 1
  state.lastAction = {
    id: state.actionSeq,
    slot,
    die: input.die,
    result: roll,
    before,
    positions: [...state.positions],
    redDice: [...state.redDice],
  }
  if (state.positions[slot] === 30) state.winner = slot
  else state.turn = 1 - slot
  return true
}
