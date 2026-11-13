const QUESTION_TIME_MS = 15_000
const REVEAL_TIME_MS = 5000
const QUESTION_COUNT = 15
const STARTING_JOKERS = 3

const KNOWLEDGE_QUESTIONS = [
  { prompt: 'Quelle est la capitale du Sénégal ?', correct: 'Dakar', wrong: ['Abidjan', 'Bamako', 'Conakry'], category: 'Géographie' },
  { prompt: 'Quel est le plus grand océan ?', correct: 'Le Pacifique', wrong: ['L’Atlantique', 'L’océan Indien', 'L’Arctique'], category: 'Culture' },
  { prompt: 'Quel élément a pour symbole chimique Au ?', correct: 'L’or', wrong: ['L’argent', 'Le cuivre', 'Le fer'], category: 'Sciences' },
  { prompt: 'Combien de cœurs possède une pieuvre ?', correct: '3', wrong: ['1', '2', '8'], category: 'Sciences' },
  { prompt: 'Quelle planète est la plus chaude du système solaire ?', correct: 'Vénus', wrong: ['Mercure', 'Mars', 'Jupiter'], category: 'Sciences' },
  { prompt: 'Qui a écrit « Le Petit Prince » ?', correct: 'Antoine de Saint-Exupéry', wrong: ['Jules Verne', 'Victor Hugo', 'Albert Camus'], category: 'Littérature' },
  { prompt: 'Combien de mois ont au moins 28 jours ?', correct: '12', wrong: ['1', '2', '11'], category: 'Logique' },
  { prompt: 'Combien de côtés possède un hexagone ?', correct: '6', wrong: ['5', '7', '8'], category: 'Mathématiques' },
  { prompt: 'Quel animal est le plus rapide en piqué ?', correct: 'Le faucon pèlerin', wrong: ['L’aigle royal', 'Le martinet', 'Le colibri'], category: 'Nature' },
  { prompt: 'Quelle est la capitale du Japon ?', correct: 'Tokyo', wrong: ['Kyoto', 'Osaka', 'Hiroshima'], category: 'Géographie' },
  { prompt: 'Combien d’os compte le squelette adulte humain ?', correct: '206', wrong: ['201', '212', '198'], category: 'Sciences' },
  { prompt: 'Quel est le plus petit pays du monde ?', correct: 'Le Vatican', wrong: ['Monaco', 'Saint-Marin', 'Le Liechtenstein'], category: 'Géographie' },
  { prompt: 'Quel métal est liquide à température ambiante ?', correct: 'Le mercure', wrong: ['Le fer', 'Le zinc', 'L’argent'], category: 'Sciences' },
  { prompt: 'En quelle année est tombé le mur de Berlin ?', correct: '1989', wrong: ['1987', '1990', '1991'], category: 'Histoire' },
  { prompt: 'Quelle est la racine carrée de 144 ?', correct: '12', wrong: ['10', '14', '16'], category: 'Calcul' },
  { prompt: 'Un fermier a 17 moutons. Tous sauf 9 meurent. Combien en reste-t-il ?', correct: '9', wrong: ['8', '17', '0'], category: 'Question piège' },
  { prompt: 'Quel est le symbole chimique du fer ?', correct: 'Fe', wrong: ['F', 'Ir', 'Fr'], category: 'Sciences' },
  { prompt: 'Quelle est la capitale du Cameroun ?', correct: 'Yaoundé', wrong: ['Douala', 'Bamenda', 'Garoua'], category: 'Géographie' },
  { prompt: 'Combien de secondes y a-t-il dans 3 minutes ?', correct: '180', wrong: ['120', '150', '240'], category: 'Calcul' },
  { prompt: 'Quel pays a pour capitale Canberra ?', correct: 'L’Australie', wrong: ['La Nouvelle-Zélande', 'Le Canada', 'L’Afrique du Sud'], category: 'Géographie' },
  { prompt: 'Quel est le plus grand désert du monde ?', correct: 'L’Antarctique', wrong: ['Le Sahara', 'Le Gobi', 'Le désert d’Arabie'], category: 'Géographie' },
  { prompt: 'Quel est le plus petit os du corps humain ?', correct: 'L’étrier', wrong: ['Le marteau', 'L’enclume', 'Le coccyx'], category: 'Sciences' },
  { prompt: 'Quel est le plus long fleuve d’Europe ?', correct: 'La Volga', wrong: ['Le Danube', 'Le Rhin', 'La Seine'], category: 'Géographie' },
  { prompt: 'Quelle est la vitesse de la lumière dans le vide ?', correct: '300 000 km/s', wrong: ['150 000 km/s', '30 000 km/s', '3 000 000 km/s'], category: 'Sciences' },
  { prompt: 'Quel est le seul mammifère capable de voler ?', correct: 'La chauve-souris', wrong: ['L’écureuil volant', 'Le pétauriste', 'Le lémurien'], category: 'Nature' },
  { prompt: 'Qui a découvert la pénicilline ?', correct: 'Alexander Fleming', wrong: ['Louis Pasteur', 'Robert Koch', 'Marie Curie'], category: 'Sciences' },
  { prompt: 'Qui a chanté « Billie Jean » ?', correct: 'Michael Jackson', wrong: ['Prince', 'Stevie Wonder', 'Lionel Richie'], category: 'Artistes' },
  { prompt: 'Qui a peint « Les Demoiselles d’Avignon » ?', correct: 'Picasso', wrong: ['Matisse', 'Braque', 'Dalí'], category: 'Artistes' },
  { prompt: 'Quel est le pays d’origine du chanteur Burna Boy ?', correct: 'Le Nigeria', wrong: ['Le Ghana', 'L’Afrique du Sud', 'Le Kenya'], category: 'Artistes' },
  { prompt: 'Qui a composé « Les Quatre Saisons » ?', correct: 'Vivaldi', wrong: ['Bach', 'Mozart', 'Haendel'], category: 'Artistes' },
  { prompt: 'Qui a sculpté « Le Penseur » ?', correct: 'Rodin', wrong: ['Camille Claudel', 'Michel-Ange', 'Giacometti'], category: 'Artistes' },
  { prompt: 'Qui a écrit « Germinal » ?', correct: 'Émile Zola', wrong: ['Stendhal', 'Victor Hugo', 'Balzac'], category: 'Littérature' },
  { prompt: 'Qui a écrit « Le Rouge et le Noir » ?', correct: 'Stendhal', wrong: ['Émile Zola', 'Camus', 'Flaubert'], category: 'Littérature' },
  { prompt: 'Qui a chanté « Waka Waka » pour la Coupe du monde 2010 ?', correct: 'Shakira', wrong: ['Beyoncé', 'Jennifer Lopez', 'Rihanna'], category: 'Artistes' },
]

function randomSource(seed) {
  let state = (seed >>> 0) || 1
  return () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function shuffle(values, random) {
  const shuffled = values.slice()
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]]
  }
  return shuffled
}

function formatNumber(value) {
  return value.toLocaleString('fr-FR')
}

function createNumericQuestion(random, level) {
  const generators = [
    () => {
      const a = 11 + Math.floor(random() * (50 + level * 3))
      const b = 3 + Math.floor(random() * (10 + level))
      return [`Combien font ${a} × ${b} ?`, a * b, 'Calcul']
    },
    () => {
      const a = 100 + Math.floor(random() * 900)
      const b = 100 + Math.floor(random() * 900)
      return [`Combien font ${formatNumber(a)} + ${formatNumber(b)} ?`, a + b, 'Calcul']
    },
    () => {
      const a = 500 + Math.floor(random() * 500)
      const b = 100 + Math.floor(random() * 400)
      return [`Combien font ${formatNumber(a)} − ${formatNumber(b)} ?`, a - b, 'Calcul']
    },
    () => {
      const percent = shuffle([5, 10, 15, 20, 25, 30, 40, 60, 75, 80, 90], random)[0]
      const amount = 20 * (1 + Math.floor(random() * 100))
      return [`Combien font ${percent} % de ${formatNumber(amount)} ?`, percent * amount / 100, 'Pourcentage']
    },
    () => {
      const start = 1 + Math.floor(random() * 60)
      const difference = 2 + Math.floor(random() * 28)
      return [`Suite : ${start}, ${start + difference}, ${start + 2 * difference}, ${start + 3 * difference}, … ?`, start + 4 * difference, 'Logique']
    },
    () => {
      const start = 2 + Math.floor(random() * 5)
      const ratio = 2 + Math.floor(random() * 3)
      return [`Suite : ${start}, ${start * ratio}, ${start * ratio ** 2}, ${start * ratio ** 3}, … ?`, start * ratio ** 4, 'Logique']
    },
    () => {
      const minutes = 11 + Math.floor(random() * 89)
      return [`Combien de secondes dans ${minutes} minutes ?`, minutes * 60, 'Conversion']
    },
    () => {
      const root = 11 + Math.floor(random() * 89)
      return [`Quelle est la racine carrée de ${formatNumber(root * root)} ?`, root, 'Calcul']
    },
  ]
  const [prompt, correct, category] = generators[Math.floor(random() * generators.length)]()
  const offsets = shuffle([1, -1, 2, -2, 10, -10, 100, -100, 5, -5, 11, -9, Math.round(correct * 0.1), -Math.round(correct * 0.1)], random)
  const wrong = [...new Set(offsets.map((offset) => correct + offset).filter((value) => value >= 0 && value !== correct))].slice(0, 3)
  while (wrong.length < 3) wrong.push(correct + wrong.length + 1)
  const options = shuffle([correct, ...wrong].map(formatNumber), random)
  return { prompt, category, options, correctIndex: options.indexOf(formatNumber(correct)) }
}

function createQuestion(random, level) {
  if (random() < 0.45) {
    return createNumericQuestion(random, level)
  }

  const source = KNOWLEDGE_QUESTIONS[Math.floor(random() * KNOWLEDGE_QUESTIONS.length)]
  const options = shuffle([source.correct, ...source.wrong], random)
  return {
    prompt: source.prompt,
    category: source.category,
    options,
    correctIndex: options.indexOf(source.correct),
  }
}

function finishRoundReveal(state, now) {
  state.phase = 'reveal'
  state.revealEndsAt = now + REVEAL_TIME_MS
  state.roundDeadline = null
}

function finishMatch(state) {
  state.status = 'finished'
  state.phase = 'finished'
  state.winner = state.scores[0] === state.scores[1]
    ? null
    : state.scores[0] > state.scores[1] ? 0 : 1
}

export function createQuizArenaMatch(seed, now = Date.now()) {
  const random = randomSource(seed)
  const questions = Array.from({ length: QUESTION_COUNT }, (_, index) => createQuestion(random, index))
  return {
    status: 'playing',
    phase: 'question',
    round: 0,
    questions,
    scores: [0, 0],
    jokers: [STARTING_JOKERS, STARTING_JOKERS],
    submitted: [false, false],
    answers: [null, null],
    results: [null, null],
    eliminated: [[], []],
    roundDeadline: now + QUESTION_TIME_MS,
    revealEndsAt: null,
    winner: null,
  }
}

export function quizArenaPlayerSnapshot(state, slot, now = Date.now()) {
  const question = state.questions[state.round]
  return {
    status: state.status,
    phase: state.phase,
    round: state.round,
    question: question ? {
      prompt: question.prompt,
      category: question.category,
      options: [...question.options],
      ...(state.phase === 'reveal' || state.phase === 'finished'
        ? { correctIndex: question.correctIndex }
        : {}),
    } : null,
    scores: [...state.scores],
    jokers: [...state.jokers],
    submitted: [...state.submitted],
    answers: state.phase === 'reveal' || state.phase === 'finished' ? [...state.answers] : [null, null],
    results: state.phase === 'reveal' || state.phase === 'finished' ? [...state.results] : null,
    eliminated: [...state.eliminated[slot]],
    roundRemainingMs: state.phase === 'question' ? Math.max(0, state.roundDeadline - now) : 0,
    revealRemainingMs: state.phase === 'reveal' ? Math.max(0, state.revealEndsAt - now) : 0,
    winner: state.winner,
  }
}

export function submitQuizArenaAnswer(state, slot, answer, now = Date.now()) {
  if (!state || state.status !== 'playing' || state.phase !== 'question'
    || (slot !== 0 && slot !== 1) || !Number.isInteger(answer) || answer < 0 || answer > 3
    || state.submitted[slot] || now >= state.roundDeadline) {
    return { ok: false, error: 'Cette réponse n’est plus disponible.' }
  }

  state.submitted[slot] = true
  state.answers[slot] = answer
  return { ok: true }
}

export function useQuizArenaJoker(state, slot, now = Date.now()) {
  if (!state || state.status !== 'playing' || state.phase !== 'question'
    || (slot !== 0 && slot !== 1) || state.submitted[slot]
    || state.jokers[slot] <= 0 || now >= state.roundDeadline) {
    return { ok: false, error: 'Ce joker n’est plus disponible.' }
  }
  if (state.eliminated[slot].length > 0) {
    return { ok: false, error: 'Le joker a déjà été utilisé pour cette question.' }
  }

  const correctIndex = state.questions[state.round].correctIndex
  const wrongOptions = [0, 1, 2, 3].filter((index) => index !== correctIndex)
  const random = randomSource((state.round + 1) * 7919 + slot * 104729 + state.scores[slot])
  state.eliminated[slot] = shuffle(wrongOptions, random).slice(0, 2)
  state.jokers[slot] -= 1
  return { ok: true }
}

export function tickQuizArenaMatch(state, now = Date.now()) {
  if (!state || state.status !== 'playing') return false

  if (state.phase === 'question' && now >= state.roundDeadline) {
    const correctIndex = state.questions[state.round].correctIndex
    state.answers.forEach((answer, slot) => {
      if (answer === null) {
        state.results[slot] = null
        return
      }
      const correct = answer === correctIndex
      state.results[slot] = correct
      if (correct) state.scores[slot] += 100
    })
    finishRoundReveal(state, now)
    return true
  }

  if (state.phase !== 'reveal' || now < state.revealEndsAt) return false
  if (state.round >= state.questions.length - 1) {
    finishMatch(state)
    return true
  }

  state.round += 1
  state.phase = 'question'
  state.submitted = [false, false]
  state.answers = [null, null]
  state.results = [null, null]
  state.eliminated = [[], []]
  state.roundDeadline = now + QUESTION_TIME_MS
  state.revealEndsAt = null
  return true
}
