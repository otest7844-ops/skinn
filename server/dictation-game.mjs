const PHRASES = [
  'Le jury sourit lentement',
  'Un chat noir dort sur le bureau',
  'La pluie tombe sur les toits',
  'Mon voisin joue du violon',
  'Les candidats recopient la phrase sans aucune faute',
  'Le boulanger prepare des croissants avant le lever du soleil',
  'La championne garde les yeux fixes sur la ligne darrivee',
  'Les enfants se cachent sous la vieille table de la cuisine',
  'Les oiseaux fatigues se posent sur le clocher avant la nuit',
  'Le capitaine ordonne de hisser les voiles et tout le monde obeit',
  'Une lumiere jaune eclaire la fenetre du quatrieme etage',
  'Une ecriture reguliere et soignee gagne toujours du temps',
]

const ROUND_LIMIT_MS = 60_000
const INTERMISSION_MS = 1_800
const MAX_ROUNDS = 3
const WINS_REQUIRED = 2

function random(state) {
  state.randomState = (state.randomState * 1664525 + 1013904223) >>> 0
  return state.randomState / 0x100000000
}

function pickPhrase(state) {
  const available = PHRASES.filter((phrase) => !state.usedPhrases.includes(phrase))
  const options = available.length ? available : PHRASES
  const index = Math.floor(random(state) * options.length)
  const phrase = options[index]
  state.usedPhrases.push(phrase)
  return phrase
}

function endRound(state, winnerSlot, submittedBy, answer, now) {
  if (winnerSlot === 0 || winnerSlot === 1) state.scores[winnerSlot] += 1
  state.lastResult = {
    round: state.round,
    winnerSlot,
    submittedBy,
    correct: answer === state.sentence,
    elapsedMs: Math.max(0, now - state.roundStartedAt),
  }
  state.phase = 'intermission'
  state.nextRoundAt = now + INTERMISSION_MS

  if (state.scores.some((score) => score >= WINS_REQUIRED) || state.round >= MAX_ROUNDS) {
    state.status = 'finished'
    state.phase = 'finished'
    state.winner = state.scores[0] === state.scores[1]
      ? null
      : state.scores[0] > state.scores[1] ? 0 : 1
  }
}

function normalizeAnswer(value) {
  return value
    .replace(/[‘’ʼ]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function createDictationMatch(seed, now = Date.now()) {
  const state = {
    status: 'playing',
    phase: 'playing',
    round: 1,
    scores: [0, 0],
    sentence: '',
    roundStartedAt: now,
    roundDeadline: now + ROUND_LIMIT_MS,
    nextRoundAt: null,
    lastResult: null,
    winner: null,
    usedPhrases: [],
    randomState: seed >>> 0 || 1,
  }
  state.sentence = pickPhrase(state)
  return state
}

export function submitDictationAnswer(state, slot, answer, now = Date.now()) {
  if (state.status !== 'playing' || state.phase !== 'playing') {
    return { ok: false, error: 'Cette manche n’accepte plus de réponses.' }
  }
  if (slot !== 0 && slot !== 1) return { ok: false, error: 'Joueur invalide.' }
  if (typeof answer !== 'string' || answer.length > 240) {
    return { ok: false, error: 'La copie est invalide.' }
  }
  if (now >= state.roundDeadline) return { ok: false, error: 'Le temps de cette manche est écoulé.' }

  const correct = normalizeAnswer(answer) === state.sentence
  endRound(state, correct ? slot : 1 - slot, slot, answer, now)
  return { ok: true, correct }
}

export function tickDictationMatch(state, now = Date.now()) {
  if (state.status !== 'playing') return state
  if (state.phase === 'playing' && now >= state.roundDeadline) {
    endRound(state, null, null, '', now)
  } else if (state.phase === 'intermission' && now >= state.nextRoundAt) {
    state.round += 1
    state.sentence = pickPhrase(state)
    state.roundStartedAt = now
    state.roundDeadline = now + ROUND_LIMIT_MS
    state.nextRoundAt = null
    state.lastResult = null
    state.phase = 'playing'
  }
  return state
}
