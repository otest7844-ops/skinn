export const WORD_SEARCH_SIZE = 8
export const WORD_SEARCH_COUNT = 10
export const WORD_SEARCH_CATEGORIES = {
  Animaux: 'CHAT CHIEN LION TIGRE ZEBRE SINGE OURS LOUP RENARD CHEVAL VACHE MOUTON LAPIN GIRAFE PANDA AIGLE HIBOU DAUPHIN BALEINE REQUIN SERPENT TORTUE CANARD POULE',
  Pays: 'FRANCE ITALIE ESPAGNE TOGO BENIN GHANA MALI NIGER CHINE JAPON INDE BRESIL CANADA PEROU CUBA SUEDE NORVEGE GRECE EGYPTE KENYA CAMEROUN SENEGAL TUNISIE',
  Capitales: 'PARIS ROME MADRID LOME ACCRA BAMAKO DAKAR TUNIS LE-CAIRE TOKYO PEKIN LIMA LONDRES BERLIN OSLO ATHENES VIENNE LISBONNE OTTAWA BRASILIA NAIROBI ALGER RABAT',
  Villes: 'LYON NICE LILLE NANTES BORDEAUX TOULOUSE MARSEILLE KARA KPALIME SOKODE ATAKPAME DALLAS TURIN MILAN SEVILLE PORTO OSAKA DURBAN LAGOS KUMASI COTONOU ABIDJAN',
  Fruits: 'POMME POIRE BANANE ORANGE CITRON MANGUE ANANAS PECHE CERISE FRAISE RAISIN KIWI PRUNE MELON PASTEQUE GOYAVE PAPAYE FIGUE ABRICOT LITCHI NOIX DATTE COCO',
  Legumes: 'CAROTTE TOMATE OIGNON POIREAU COURGE RADIS NAVET CHOU AIL HARICOT POIVRON AUBERGINE CONCOMBRE EPINARD MAIS MANIOC IGNAME GOMBO CELERI BETTERAVE PATATE LAITUE PETITPOIS',
  Objets: 'TABLE CHAISE LAMPE CLE STYLO LIVRE VERRE ASSIETTE MIROIR HORLOGE TELEPHONE SAC PARAPLUIE BROSSE CISEAUX BALLON VALISE COUSSIN RIDEAU TAPIS BOUGIE PORTE LIT',
  Sports: 'FOOTBALL TENNIS RUGBY BASKET NATATION BOXE JUDO GOLF CYCLISME ATHLETISME HANDBALL VOLLEY ESCRIME SKI SURF KARATE YOGA CRICKET HOCKEY MARATHON PLONGEE ESCALADE',
  Metiers: 'MEDECIN PILOTE MACON CHEF AVOCAT JUGE POLICIER PEINTRE TAILLEUR BERGER FERMIER PLOMBIER BOULANGER ARCHITECTE INGENIEUR PROFESSEUR INFIRMIER CHAUFFEUR COIFFEUR TAXI MUSICIEN',
  Nourriture: 'PAIN RIZ PATES FROMAGE BEURRE SOUPE SALADE GATEAU POISSON POULET OMELETTE PIZZA BISCUIT CHOCOLAT YAOURT HARICOTS FUFU PATE SAUCE MIEL CREPE SUCRE SEL',
  Nature: 'ARBRE FLEUR RIVIERE MONTAGNE FORET OCEAN DESERT PLAGE VOLCAN NUAGE PLUIE SOLEIL LUNE ETOILE VENT ORAGE PRAIRIE LAC CASCADE ROCHER SAVANE JUNGLE COLLINE',
  Technologie: 'ORDINATEUR CLAVIER SOURIS ECRAN INTERNET ROBOT DRONE LOGICIEL APPLICATION SERVEUR RESEAU CAMERA TABLETTE CODE DONNEES PIXEL WIFI BATTERIE PUCE SATELLITE CLOUD MODEM',
  Transport: 'VOITURE AVION BATEAU TRAIN METRO VELO MOTO CAMION BUS TAXI FUSEE TRAMWAY SCOOTER PIROGUE FERRY HELICOPTERE TRACTEUR CAMIONNETTE GARE PORT ROUTE PONT AEROPORT',
  'Corps humain': 'TETE BRAS JAMBE MAIN PIED COEUR FOIE GENOU COUDE EPAULE DOS VENTRE NEZ OEIL OREILLE BOUCHE DENT LANGUE CERVEAU POUMON PEAU DOIGT CHEVILLE MENTON',
}

const DIRECTIONS = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [-1, -1], [1, -1], [-1, 1],
]

function randomGenerator(seed) {
  let state = seed >>> 0 || 1
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function shuffle(items, random) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[items[index], items[swapIndex]] = [items[swapIndex], items[index]]
  }
  return items
}

function pointsForWord(length) {
  return length >= 9 ? 50 : length >= 7 ? 30 : length >= 5 ? 20 : 10
}

function generateBoard(random, category, count) {
  const categories = category === '*'
    ? Object.values(WORD_SEARCH_CATEGORIES)
    : [WORD_SEARCH_CATEGORIES[category]]
  if (!categories[0]) return null

  const wordPool = [...new Set(categories.flatMap((words) => words.split(' ')))]
    .map((word) => word.replace(/[^A-Z]/g, ''))
    .filter((word) => word.length >= 3 && word.length <= 5)

  for (let attempt = 0; attempt < 80; attempt += 1) {
    shuffle(wordPool, random)
    const grid = Array.from({ length: WORD_SEARCH_SIZE }, () => Array(WORD_SEARCH_SIZE).fill(''))
    const placements = []

    for (const word of wordPool) {
      if (placements.length >= count) break
      for (let placementAttempt = 0; placementAttempt < 400; placementAttempt += 1) {
        const [rowStep, columnStep] = DIRECTIONS[Math.floor(random() * DIRECTIONS.length)]
        const row = Math.floor(random() * WORD_SEARCH_SIZE)
        const column = Math.floor(random() * WORD_SEARCH_SIZE)
        const endRow = row + rowStep * (word.length - 1)
        const endColumn = column + columnStep * (word.length - 1)
        if (endRow < 0 || endRow >= WORD_SEARCH_SIZE || endColumn < 0 || endColumn >= WORD_SEARCH_SIZE) continue

        const cells = Array.from({ length: word.length }, (_, index) =>
          (row + rowStep * index) * WORD_SEARCH_SIZE + column + columnStep * index,
        )
        if (cells.some((cell) => grid[Math.floor(cell / WORD_SEARCH_SIZE)][cell % WORD_SEARCH_SIZE])) continue

        cells.forEach((cell, index) => {
          grid[Math.floor(cell / WORD_SEARCH_SIZE)][cell % WORD_SEARCH_SIZE] = word[index]
        })
        placements.push({ word, cells })
        break
      }
    }

    if (placements.length !== count) continue
    for (const row of grid) {
      for (let column = 0; column < row.length; column += 1) {
        if (!row[column]) row[column] = String.fromCharCode(65 + Math.floor(random() * 26))
      }
    }
    return { grid: grid.flat(), placements }
  }
  return null
}

export function createWordSearchMatch(seed, now = Date.now(), category = '*', count = WORD_SEARCH_COUNT) {
  const random = randomGenerator(seed)
  let board = generateBoard(random, category, count)
  let actualCategory = category
  let actualCount = count
  if (!board && category !== '*') {
    board = generateBoard(random, '*', count)
    actualCategory = '*'
  }
  while (!board && actualCount > 3) {
    actualCount -= 1
    board = generateBoard(random, '*', actualCount)
    actualCategory = '*'
  }
  if (!board) throw new Error('Unable to generate a word-search grid.')

  return {
    size: WORD_SEARCH_SIZE,
    category: actualCategory,
    grid: board.grid,
    placements: board.placements,
    words: board.placements.map((placement) => placement.word),
    found: [],
    scores: [0, 0],
    foundCounts: [0, 0],
    status: 'playing',
    winner: null,
    startedAt: now,
    elapsedSeconds: 0,
  }
}

export function findWordSearchPath(state, start, end) {
  const cellCount = state?.size * state?.size
  if (!Number.isInteger(start) || !Number.isInteger(end)
    || start < 0 || end < 0 || start >= cellCount || end >= cellCount) return null

  const startRow = Math.floor(start / state.size)
  const startColumn = start % state.size
  const endRow = Math.floor(end / state.size)
  const endColumn = end % state.size
  const rowDelta = endRow - startRow
  const columnDelta = endColumn - startColumn
  if (rowDelta !== 0 && columnDelta !== 0 && Math.abs(rowDelta) !== Math.abs(columnDelta)) return null
  if (rowDelta === 0 && columnDelta === 0) return null

  const rowStep = Math.sign(rowDelta)
  const columnStep = Math.sign(columnDelta)
  const length = Math.max(Math.abs(rowDelta), Math.abs(columnDelta)) + 1
  const cells = Array.from({ length }, (_, index) =>
    (startRow + rowStep * index) * state.size + startColumn + columnStep * index,
  )
  const target = state.placements.find((placement) =>
    !state.found.some((entry) => entry.word === placement.word)
    && (placement.cells.join(',') === cells.join(',')
      || [...placement.cells].reverse().join(',') === cells.join(',')),
  )
  return target ? { word: target.word, cells, points: pointsForWord(target.word.length) } : null
}

export function submitWordSearchWord(state, slot, start, end) {
  if (state.status !== 'playing') return { ok: false, error: 'La partie est terminée.' }
  if (slot !== 0 && slot !== 1) return { ok: false, error: 'Joueur invalide.' }
  const path = findWordSearchPath(state, start, end)
  if (!path) return { ok: false, error: 'Aucun nouveau mot à cet endroit.' }

  state.found.push({ ...path, slot })
  state.scores[slot] += path.points
  state.foundCounts[slot] += 1
  if (state.found.length === state.words.length) {
    state.status = 'finished'
    state.winner = state.foundCounts[0] === state.foundCounts[1]
      ? state.scores[0] === state.scores[1] ? null : state.scores[0] > state.scores[1] ? 0 : 1
      : state.foundCounts[0] > state.foundCounts[1] ? 0 : 1
  }
  return { ok: true, word: path.word, points: path.points }
}

export function tickWordSearchMatch(state, now = Date.now()) {
  if (state.status === 'playing') {
    state.elapsedSeconds = Math.max(0, Math.floor((now - state.startedAt) / 1000))
  }
  return state
}
