function initialBoard() {
  const board = Array(64).fill(null)
  const backRank = 'RNBQKBNR'
  for (let column = 0; column < 8; column += 1) {
    board[column] = `b${backRank[column]}`
    board[8 + column] = 'bP'
    board[48 + column] = 'wP'
    board[56 + column] = `w${backRank[column]}`
  }
  return board
}

function pieceMoves(board, index) {
  const piece = board[index]
  if (!piece) return []
  const color = piece[0]
  const type = piece[1]
  const row = index >> 3
  const column = index & 7
  const result = []
  const add = (nextRow, nextColumn) => {
    if (nextRow < 0 || nextRow > 7 || nextColumn < 0 || nextColumn > 7) return false
    const target = nextRow * 8 + nextColumn
    const occupant = board[target]
    if (occupant && occupant[0] === color) return false
    result.push(target)
    return !occupant
  }
  const slide = (directions) => directions.forEach(([rowStep, columnStep]) => {
    let nextRow = row + rowStep
    let nextColumn = column + columnStep
    while (add(nextRow, nextColumn)) {
      nextRow += rowStep
      nextColumn += columnStep
    }
  })
  const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
  const orthogonals = [[1, 0], [-1, 0], [0, 1], [0, -1]]

  if (type === 'P') {
    const direction = color === 'w' ? -1 : 1
    const startRow = color === 'w' ? 6 : 1
    const nextRow = row + direction
    const forward = nextRow * 8 + column
    if (nextRow >= 0 && nextRow < 8) {
      if (!board[forward]) {
        result.push(forward)
        if (row === startRow && !board[forward + direction * 8]) result.push(forward + direction * 8)
      }
      for (const columnStep of [-1, 1]) {
        const nextColumn = column + columnStep
        if (nextColumn < 0 || nextColumn > 7) continue
        const target = nextRow * 8 + nextColumn
        if (board[target] && board[target][0] !== color) result.push(target)
      }
    }
  } else if (type === 'N') {
    for (const [rowStep, columnStep] of [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]) {
      add(row + rowStep, column + columnStep)
    }
  } else if (type === 'K') {
    for (const [rowStep, columnStep] of [...diagonals, ...orthogonals]) add(row + rowStep, column + columnStep)
  } else if (type === 'B') {
    slide(diagonals)
  } else if (type === 'R') {
    slide(orthogonals)
  } else {
    slide([...diagonals, ...orthogonals])
  }
  return result
}

function isInCheck(board, color) {
  const king = board.indexOf(`${color}K`)
  return board.some((piece, index) => piece && piece[0] !== color && pieceMoves(board, index).includes(king))
}

function legalMoves(board, index) {
  const color = board[index]?.[0]
  if (!color) return []
  return pieceMoves(board, index).filter((target) => {
    if (board[target]?.[1] === 'K') return false
    const next = board.slice()
    next[target] = next[index]
    next[index] = null
    return !isInCheck(next, color)
  })
}

function hasLegalMove(board, color) {
  return board.some((piece, index) => piece?.[0] === color && legalMoves(board, index).length > 0)
}

export function createChessDuelState() {
  return {
    board: initialBoard(),
    scores: [0, 0],
    turn: 'w',
    moves: [],
    status: 'playing',
    winner: null,
  }
}

export function submitChessMove(state, slot, from, to) {
  if (state.status !== 'playing' || slot !== (state.turn === 'w' ? 0 : 1)
    || !Number.isInteger(from) || from < 0 || from > 63
    || !Number.isInteger(to) || to < 0 || to > 63
    || !legalMoves(state.board, from).includes(to)) {
    return { ok: false, error: 'Ce coup n’est pas autorisé.' }
  }

  const piece = state.board[from]
  const captured = state.board[to]
  state.board[to] = piece[1] === 'P' && (to >> 3 === 0 || to >> 3 === 7)
    ? `${piece[0]}Q`
    : piece
  state.board[from] = null
  if (captured) state.scores[slot] += 1
  state.moves.push({ from, to })
  state.turn = state.turn === 'w' ? 'b' : 'w'

  if (state.scores[slot] >= 10) {
    state.status = 'finished'
    state.winner = slot
  } else if (!hasLegalMove(state.board, state.turn)) {
    state.status = 'finished'
    state.winner = isInCheck(state.board, state.turn) ? slot : null
  }
  return { ok: true }
}

export function createSniperDuelState(durationMs = 75_000) {
  return {
    status: 'playing',
    scores: [0, 0],
    kills: [0, 0],
    players: [
      { score: 0, kills: 0, finished: false },
      { score: 0, kills: 0, finished: false },
    ],
    remainingMs: durationMs,
    winner: null,
  }
}

export function updateSniperDuelScore(state, slot, report) {
  if (state.status !== 'playing' || (slot !== 0 && slot !== 1)
    || !Number.isSafeInteger(report?.score) || report.score < 0 || report.score > 100_000
    || !Number.isSafeInteger(report?.kills) || report.kills < 0 || report.kills > 100
    || typeof report?.finished !== 'boolean') {
    return { ok: false, error: 'Résultat de tir invalide.' }
  }

  const previous = state.players[slot]
  const scoreIncrease = report.score - previous.score
  const killIncrease = report.kills - previous.kills
  if (report.score < previous.score || report.kills < previous.kills
    || report.score < report.kills * 100 || report.score > report.kills * 300
    || scoreIncrease > killIncrease * 300
    || previous.finished && (scoreIncrease !== 0 || killIncrease !== 0 || !report.finished)) {
    return { ok: false, error: 'Le score de tir ne peut pas diminuer ou dépasser les éliminations.' }
  }

  state.players[slot] = { score: report.score, kills: report.kills, finished: report.finished }
  state.scores[slot] = report.score
  state.kills[slot] = report.kills
  if (state.players.every((player) => player.finished)) finishSniperDuel(state)
  return { ok: true }
}

export function tickSniperDuel(state, dt) {
  if (state.status !== 'playing') return
  state.remainingMs = Math.max(0, state.remainingMs - Math.max(0, dt) * 1000)
  if (state.remainingMs === 0) finishSniperDuel(state)
}

function finishSniperDuel(state) {
  state.status = 'finished'
  state.winner = state.scores[0] === state.scores[1]
    ? null
    : state.scores[0] > state.scores[1] ? 0 : 1
}
