const SYMBOLS = ['🐶', '🐱', '🦊', '🐼', '🐸', '🦁', '🐵', '🐯', '🐙', '🦄', '🐢', '🦋']

function randomGenerator(seed) {
  let state = seed >>> 0 || 1
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

export function createMemoMatch(seed, now = Date.now()) {
  const random = randomGenerator(seed)
  const symbols = [...SYMBOLS, ...SYMBOLS]
  for (let index = symbols.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[symbols[index], symbols[swapIndex]] = [symbols[swapIndex], symbols[index]]
  }
  symbols.splice(12, 0, '⭐')

  return {
    cards: symbols.map((symbol, id) => ({
      id,
      symbol,
      faceUp: symbol === '⭐',
      matched: false,
      isStar: symbol === '⭐',
    })),
    status: 'playing',
    openedBySlot: [[], []],
    scores: [0, 0],
    moves: [0, 0],
    totalMoves: 0,
    elapsedSeconds: 0,
    startedAt: now,
    resolveAtBySlot: [null, null],
    winner: null,
  }
}

export function flipMemoCard(match, slot, cardId, now = Date.now()) {
  if (match.status !== 'playing') return { ok: false, error: 'La partie est terminée.' }
  if ((slot !== 0 && slot !== 1) || match.openedBySlot[slot].length >= 2
    || !Number.isInteger(cardId) || cardId < 0 || cardId >= match.cards.length) {
    return { ok: false, error: 'Cette carte ne peut pas être retournée.' }
  }

  const card = match.cards[cardId]
  if (card.isStar || card.matched) {
    return { ok: false, error: 'Cette carte est déjà visible.' }
  }

  const opened = match.openedBySlot[slot]
  opened.push(cardId)
  if (opened.length < 2) return { ok: true }

  match.moves[slot] += 1
  match.totalMoves += 1
  const [firstId, secondId] = opened
  const first = match.cards[firstId]
  const second = match.cards[secondId]
  if (first.symbol === second.symbol) {
    first.matched = true
    second.matched = true
    match.openedBySlot.forEach((playerOpened, playerSlot) => {
      match.openedBySlot[playerSlot] = playerOpened.filter((id) => id !== firstId && id !== secondId)
      if (match.openedBySlot[playerSlot].length < 2) match.resolveAtBySlot[playerSlot] = null
    })
    match.scores[slot] += 1
    if (match.scores[0] + match.scores[1] === 12) {
      match.status = 'finished'
      match.winner = match.scores[0] === match.scores[1]
        ? null
        : match.scores[0] > match.scores[1] ? 0 : 1
    }
  } else {
    match.resolveAtBySlot[slot] = now + 500
  }
  return { ok: true }
}

export function memoPlayerSnapshot(match, slot) {
  if (slot !== 0 && slot !== 1) throw new RangeError('Invalid Memo player slot.')
  const publicMatch = { ...match }
  delete publicMatch.openedBySlot
  delete publicMatch.resolveAtBySlot
  const opened = match.openedBySlot[slot]
  return {
    ...publicMatch,
    cards: match.cards.map((card) => ({
      ...card,
      faceUp: card.isStar || card.matched || opened.includes(card.id),
    })),
    opened,
  }
}

export function tickMemoMatch(match, now = Date.now()) {
  if (match.status !== 'playing') return match
  match.elapsedSeconds = Math.max(0, Math.floor((now - match.startedAt) / 1000))
  for (let slot = 0; slot < 2; slot += 1) {
    if (match.resolveAtBySlot[slot] !== null && now >= match.resolveAtBySlot[slot]) {
      match.openedBySlot[slot] = []
      match.resolveAtBySlot[slot] = null
    }
  }
  return match
}
