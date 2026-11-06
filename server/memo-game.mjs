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
    turn: 0,
    opened: [],
    scores: [0, 0],
    moves: [0, 0],
    totalMoves: 0,
    elapsedSeconds: 0,
    startedAt: now,
    resolveAt: null,
    winner: null,
  }
}

export function flipMemoCard(match, slot, cardId, now = Date.now()) {
  if (match.status !== 'playing') return { ok: false, error: 'La partie est terminée.' }
  if (match.turn !== slot) return { ok: false, error: 'Ce n’est pas votre tour.' }
  if (match.opened.length >= 2 || !Number.isInteger(cardId) || cardId < 0 || cardId >= match.cards.length) {
    return { ok: false, error: 'Cette carte ne peut pas être retournée.' }
  }

  const card = match.cards[cardId]
  if (card.isStar || card.matched || card.faceUp) {
    return { ok: false, error: 'Cette carte est déjà visible.' }
  }

  card.faceUp = true
  match.opened.push(cardId)
  if (match.opened.length < 2) return { ok: true }

  match.moves[slot] += 1
  match.totalMoves += 1
  const [firstId, secondId] = match.opened
  const first = match.cards[firstId]
  const second = match.cards[secondId]
  if (first.symbol === second.symbol) {
    first.matched = true
    second.matched = true
    match.opened = []
    match.scores[slot] += 1
    if (match.scores[0] + match.scores[1] === 12) {
      match.status = 'finished'
      match.winner = match.scores[0] === match.scores[1]
        ? null
        : match.scores[0] > match.scores[1] ? 0 : 1
    }
  } else {
    match.resolveAt = now + 900
  }
  return { ok: true }
}

export function tickMemoMatch(match, now = Date.now()) {
  if (match.status !== 'playing') return match
  match.elapsedSeconds = Math.max(0, Math.floor((now - match.startedAt) / 1000))
  if (match.resolveAt !== null && now >= match.resolveAt) {
    for (const id of match.opened) match.cards[id].faceUp = false
    match.opened = []
    match.turn = 1 - match.turn
    match.resolveAt = null
  }
  return match
}
