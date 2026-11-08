import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import type { ArenaRoomView } from './ArenaRoom'
import {
  createWordSearchMatch,
  findWordSearchPath,
  submitWordSearchWord,
  tickWordSearchMatch,
  WORD_SEARCH_CATEGORIES,
  WORD_SEARCH_COUNT,
} from '../shared/word-search.mjs'
import type { WordSearchMatch } from '../shared/word-search.mjs'
import './WordSearchGame.css'

type GameMode = 'solo' | 'local'
type HistoryEntry = { mode: string; score: number; opponentScore: number; words: string; result: 'V' | 'D' | 'N' }

function selectionCells(start: number, end: number, size: number) {
  const startRow = Math.floor(start / size)
  const startColumn = start % size
  const rowDelta = Math.floor(end / size) - startRow
  const columnDelta = end % size - startColumn
  if (rowDelta !== 0 && columnDelta !== 0 && Math.abs(rowDelta) !== Math.abs(columnDelta)) {
    return [...new Set([start, end])]
  }
  const length = Math.max(Math.abs(rowDelta), Math.abs(columnDelta)) + 1
  return Array.from({ length }, (_, index) =>
    (startRow + Math.sign(rowDelta) * index) * size + startColumn + Math.sign(columnDelta) * index,
  )
}

const AI_LEVELS = [
  { label: 'Facile', value: 7000 },
  { label: 'Moyen', value: 4500 },
  { label: 'Difficile (rapide)', value: 2500 },
]
const CATEGORY_NAMES = Object.keys(WORD_SEARCH_CATEGORIES)

function randomSeed() {
  return Math.floor(Math.random() * 0x7fffffff) || 1
}

function loadHistory(): HistoryEntry[] {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem('mm') ?? '{"h":[]}')
    if (!saved || typeof saved !== 'object' || !('h' in saved) || !Array.isArray(saved.h)) return []
    return saved.h.filter((entry): entry is HistoryEntry =>
      entry && typeof entry === 'object'
      && typeof entry.mode === 'string'
      && typeof entry.score === 'number'
      && typeof entry.opponentScore === 'number'
      && typeof entry.words === 'string'
      && ['V', 'D', 'N'].includes(entry.result),
    ).slice(-50)
  } catch (error) {
    console.warn('Could not read word-search statistics:', error)
    return []
  }
}

function recordResult(entry: HistoryEntry) {
  try {
    window.localStorage.setItem('mm', JSON.stringify({ h: [...loadHistory(), entry].slice(-50) }))
  } catch (error) {
    console.warn('Could not save word-search statistics:', error)
  }
}

function speak(text: string, soundOn: boolean) {
  if (!soundOn || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  utterance.rate = 1.1
  window.speechSynthesis.speak(utterance)
}

export default function WordSearchGame({
  onClose,
  room = null,
  local = false,
  onAction = () => {},
}: {
  onClose: () => void
  room?: ArenaRoomView | null
  local?: boolean
  onAction?: (type: string, data?: object) => void
}) {
  const [soloSeed] = useState(randomSeed)
  const [soloMatch, setSoloMatch] = useState(() => createWordSearchMatch(soloSeed))
  const [category, setCategory] = useState('*')
  const [aiDelay, setAiDelay] = useState(2500)
  const [mode, setMode] = useState<GameMode>(local ? 'local' : 'solo')
  const [started, setStarted] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [selection, setSelection] = useState<number[]>([])
  const [wrongSelection, setWrongSelection] = useState<number[]>([])
  const [localTurn, setLocalTurn] = useState(0)
  const [toast, setToast] = useState('')
  const [toastIsError, setToastIsError] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)
  const gridRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<number | null>(null)
  const matchRef = useRef<WordSearchMatch>(soloMatch)
  const announcedFoundRef = useRef(0)
  const endSavedRef = useRef(false)
  const toastTimerRef = useRef<number | null>(null)
  const wrongSelectionTimerRef = useRef<number | null>(null)

  const onlineMatch = room?.gameState?.wordSearch
  const match: WordSearchMatch = onlineMatch ?? soloMatch
  const online = Boolean(room)
  const playing = online ? room?.phase === 'running' : started && countdown === null
  const finished = match.status === 'finished'
  const completedCells = useMemo(
    () => new Map(match.found.flatMap((entry) => entry.cells.map((cell) => [cell, entry.slot] as const))),
    [match.found],
  )
  const seconds = match.elapsedSeconds

  function showToast(message: string, isError = false) {
    setToast(message)
    setToastIsError(isError)
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1500)
  }

  function startGame(nextMode: GameMode) {
    const next = createWordSearchMatch(randomSeed(), Date.now(), category)
    setSoloMatch(next)
    matchRef.current = next
    setMode(nextMode)
    setStarted(true)
    setCountdown(3)
    setSelection([])
    setWrongSelection([])
    setLocalTurn(0)
    endSavedRef.current = false
    announcedFoundRef.current = 0
    speak('Bienvenue dans l’arène ! Trouvez les mots avant votre adversaire.', soundOn)
  }

  function cellAtPoint(clientX: number, clientY: number) {
    const cell = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>('[data-word-cell]')
    if (!cell || !gridRef.current?.contains(cell)) return null
    const value = Number(cell.dataset.wordCell)
    return Number.isInteger(value) ? value : null
  }

  function updateSelection(start: number, end: number) {
    const size = matchRef.current.size
    const startRow = Math.floor(start / size)
    const startColumn = start % size
    const endRow = Math.floor(end / size)
    const endColumn = end % size
    const rowDelta = endRow - startRow
    const columnDelta = endColumn - startColumn
    if (rowDelta !== 0 && columnDelta !== 0 && Math.abs(rowDelta) !== Math.abs(columnDelta)) return
    const rowStep = Math.sign(rowDelta)
    const columnStep = Math.sign(columnDelta)
    const length = Math.max(Math.abs(rowDelta), Math.abs(columnDelta)) + 1
    setSelection(Array.from({ length }, (_, index) =>
      (startRow + rowStep * index) * size + startColumn + columnStep * index,
    ))
  }

  function submitSelection(start: number, end: number) {
    const current = matchRef.current
    if (!playing || current.status !== 'playing') return
    const path = findWordSearchPath(current, start, end)
    if (!path) {
      const alreadyFound = current.placements.some((placement) =>
        (placement.cells[0] === start && placement.cells.at(-1) === end)
        || (placement.cells[0] === end && placement.cells.at(-1) === start),
      )
      setWrongSelection(selectionCells(start, end, current.size))
      if (wrongSelectionTimerRef.current !== null) window.clearTimeout(wrongSelectionTimerRef.current)
      wrongSelectionTimerRef.current = window.setTimeout(() => setWrongSelection([]), 700)
      showToast(alreadyFound ? 'Déjà trouvé !' : 'Mot incorrect !', true)
      return
    }

    if (online) {
      setWrongSelection([])
      onAction('word-search:select', { start, end })
      return
    }
    const next: WordSearchMatch = {
      ...current,
      grid: [...current.grid],
      words: [...current.words],
      placements: [...current.placements],
      found: [...current.found],
      scores: [...current.scores],
      foundCounts: [...current.foundCounts],
    }
    const result = submitWordSearchWord(next, mode === 'local' ? localTurn : 0, start, end)
    if (!result.ok) {
      setWrongSelection(selectionCells(start, end, current.size))
      if (wrongSelectionTimerRef.current !== null) window.clearTimeout(wrongSelectionTimerRef.current)
      wrongSelectionTimerRef.current = window.setTimeout(() => setWrongSelection([]), 700)
      showToast(result.error ?? 'Mot incorrect !', true)
      return
    }
    setWrongSelection([])
    matchRef.current = next
    setSoloMatch(next)
    if (mode === 'local') setLocalTurn((currentTurn) => 1 - currentTurn)
    showToast(`+${result.points} · ${result.word}`)
    speak(`Bravo ! ${result.word} trouvé !`, soundOn)
  }

  function onGridPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!playing || match.status !== 'playing') return
    const cell = cellAtPoint(event.clientX, event.clientY)
    if (cell === null || completedCells.has(cell)) return
    event.preventDefault()
    setWrongSelection([])
    dragStartRef.current = cell
    setSelection([cell])
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onGridPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = dragStartRef.current
    if (start === null) return
    const cell = cellAtPoint(event.clientX, event.clientY)
    if (cell !== null) updateSelection(start, cell)
  }

  function onGridPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = dragStartRef.current
    if (start === null) return
    const end = cellAtPoint(event.clientX, event.clientY)
    dragStartRef.current = null
    if (end !== null) submitSelection(start, end)
    setSelection([])
  }

  function onGridPointerCancel() {
    dragStartRef.current = null
    setSelection([])
  }

  function onGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const cell = Number((event.target as HTMLElement).dataset.wordCell)
    if (!Number.isInteger(cell)) return
    event.preventDefault()
    if (selection.length === 0) setSelection([cell])
    else {
      submitSelection(selection[0], cell)
      setSelection([])
    }
  }

  const finishGame = useCallback((current: WordSearchMatch) => {
    if (endSavedRef.current) return
    endSavedRef.current = true
    const mySlot = online ? room?.yourSlot ?? 0 : 0
    const opponentSlot = 1 - mySlot
    const myCount = current.foundCounts[mySlot]
    const opponentCount = current.foundCounts[opponentSlot]
    const result = myCount === opponentCount
      ? current.scores[mySlot] === current.scores[opponentSlot]
        ? 'N'
        : current.scores[mySlot] > current.scores[opponentSlot] ? 'V' : 'D'
      : myCount > opponentCount ? 'V' : 'D'
    const entry: HistoryEntry = {
      mode: online ? 'Multi' : mode === 'solo' ? 'IA' : 'Local',
      score: current.scores[mySlot],
      opponentScore: current.scores[opponentSlot],
      words: `${myCount}/${current.words.length}`,
      result,
    }
    recordResult(entry)
    setHistory(loadHistory())
  }, [mode, online, room?.yourSlot])

  useEffect(() => {
    matchRef.current = match
  }, [match])

  useEffect(() => {
    if (countdown === null || online) return
    if (countdown === 0) {
      const timer = window.setTimeout(() => {
        const next = { ...matchRef.current, startedAt: Date.now(), elapsedSeconds: 0 }
        matchRef.current = next
        setSoloMatch(next)
        setCountdown(null)
        speak('Que le combat commence !', soundOn)
      }, 700)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => setCountdown((value) => value === null ? null : value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown, online, soundOn])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      if (!online) {
        const next = { ...matchRef.current }
        tickWordSearchMatch(next)
        matchRef.current = next
        setSoloMatch(next)
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [online, playing])

  useEffect(() => {
    if (!playing || online || mode !== 'solo' || finished) return
    const timer = window.setInterval(() => {
      const current = matchRef.current
      const available = current.placements.filter((placement) =>
        !current.found.some((entry) => entry.word === placement.word),
      )
      if (available.length === 0) return
      const placement = available[Math.floor(Math.random() * available.length)]
      const next: WordSearchMatch = {
        ...current,
        grid: [...current.grid],
        words: [...current.words],
        placements: [...current.placements],
        found: [...current.found],
        scores: [...current.scores],
        foundCounts: [...current.foundCounts],
      }
      const result = submitWordSearchWord(next, 1, placement.cells[0], placement.cells.at(-1) ?? placement.cells[0])
      if (!result.ok) return
      matchRef.current = next
      setSoloMatch(next)
      showToast(`L’IA trouve ${result.word} !`)
      speak(`L’intelligence artificielle trouve ${result.word} !`, soundOn)
    }, aiDelay * (0.7 + Math.random() * 0.6))
    return () => window.clearInterval(timer)
  }, [aiDelay, finished, mode, online, playing, soundOn])

  useEffect(() => {
    if (online && match.found.length > announcedFoundRef.current) {
      const entry = match.found.at(-1)
      if (entry) speak(`${room?.players.find((player) => player.slot === entry.slot)?.name ?? `Joueur ${entry.slot + 1}`} trouve ${entry.word} !`, soundOn)
      announcedFoundRef.current = match.found.length
    }
    if (finished) finishGame(match)
  }, [finishGame, finished, match, online, room?.players, soundOn])

  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current)
    if (wrongSelectionTimerRef.current !== null) window.clearTimeout(wrongSelectionTimerRef.current)
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  if (!online && !started) {
    const wins = history.filter((entry) => entry.result === 'V').length
    const best = Math.max(0, ...history.map((entry) => entry.score))
    return (
      <main className="word-search-menu">
        <h1>MOTS <span>MÊLÉS</span></h1>
        <section className="word-search-menu-card">
          <label>Niveau<select value="8" disabled><option value="8">8 × 8 · {WORD_SEARCH_COUNT} mots</option></select></label>
          <label>Catégorie<select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="*">Mixte</option>
            {CATEGORY_NAMES.map((name) => <option key={name}>{name}</option>)}
          </select></label>
          <label>Difficulté de l’IA<select value={aiDelay} onChange={(event) => setAiDelay(Number(event.target.value))}>
            {AI_LEVELS.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
          </select></label>
          <button type="button" onClick={() => startGame('solo')}>Jouer contre l’IA</button>
          <button type="button" className="is-secondary" onClick={() => startGame('local')}>Mode local · 2 joueurs</button>
          <button type="button" className="is-secondary" onClick={onClose}>Retour aux jeux</button>
        </section>
        <section className="word-search-menu-card">
          <strong>Statistiques</strong>
          <p>{history.length} parties · {wins} victoires · meilleur score {best}</p>
          <strong>Historique</strong>
          {history.length === 0 ? <p>Aucune partie terminée.</p> : (
            <div className="word-search-history">
              <div><b>Mode</b><b>Score</b><b>Mots</b><b>Résultat</b></div>
              {[...history].reverse().slice(0, 6).map((entry, index) => (
                <div key={`${entry.mode}-${index}`}><span>{entry.mode}</span><span>{entry.score}–{entry.opponentScore}</span><span>{entry.words}</span><span>{entry.result === 'V' ? 'Victoire' : entry.result === 'N' ? 'Nul' : 'Défaite'}</span></div>
              ))}
            </div>
          )}
        </section>
      </main>
    )
  }

  const playerNames = online
    ? [room?.players.find((player) => player.slot === room.yourSlot)?.name ?? 'Vous',
      room?.players.find((player) => player.slot !== room.yourSlot)?.name ?? 'Adversaire']
    : mode === 'solo' ? ['Vous', 'IA'] : ['Joueur 1', 'Joueur 2']

  return (
    <main className="word-search-game">
      <header className="word-search-header">
        <button type="button" className="word-search-close" onClick={onClose}>Quitter</button>
        <div><p>MOTS MÊLÉS · {match.category === '*' ? 'MIXTE' : match.category.toUpperCase()}</p><h1>Chasse aux mots</h1></div>
        <button type="button" className="word-search-sound" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? 'Désactiver la voix' : 'Activer la voix'}>
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <span className="word-search-clock">{seconds}s</span>
      </header>

      <section className="word-search-scoreboard" aria-label="Scores">
        {(online ? [room?.yourSlot ?? 0, 1 - (room?.yourSlot ?? 0)] : [0, 1]).map((slot, displaySlot) => {
          return (
            <div className={`word-search-player word-search-player-${displaySlot + 1}${online && displaySlot === 0 ? ' is-own-score' : ''}${!online && mode === 'local' && slot === localTurn ? ' is-active' : ''}`} key={slot}>
              <span className="word-search-player-label">
                {online ? displaySlot === 0 ? 'VOTRE SCORE' : 'ADVERSAIRE'
                  : mode === 'local' ? `SCORE ${playerNames[displaySlot].toUpperCase()}`
                    : displaySlot === 0 ? 'VOTRE SCORE' : 'SCORE IA'}
              </span>
              <strong className="word-search-player-points">{match.scores[slot]} <small>pts</small></strong>
              <small className="word-search-player-count">{match.foundCounts[slot]} mots trouvés</small>
            </div>
          )
        })}
      </section>

      <section className="word-search-arena">
        <div className="word-search-stage" aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span><span>✦</span></div>
        <div className="word-search-board" ref={gridRef} role="grid" aria-label="Grille de lettres"
          onPointerDown={onGridPointerDown} onPointerMove={onGridPointerMove}
          onPointerUp={onGridPointerUp} onPointerCancel={onGridPointerCancel}
          onKeyDown={onGridKeyDown}>
          {match.grid.map((letter, cell) => {
            const foundBy = completedCells.get(cell)
            return (
              <button
                type="button"
                role="gridcell"
                tabIndex={0}
                data-word-cell={cell}
                key={cell}
                className={[
                  'word-search-cell',
                  selection.includes(cell) ? 'is-selected' : '',
                  wrongSelection.includes(cell) ? 'is-incorrect' : '',
                  foundBy === 0 ? 'is-found-one' : '',
                  foundBy === 1 ? 'is-found-two' : '',
                ].filter(Boolean).join(' ')}
                aria-label={`Ligne ${Math.floor(cell / match.size) + 1}, colonne ${cell % match.size + 1}, ${letter}`}
              >
                {letter}
              </button>
            )
          })}
        </div>
        {countdown !== null && <div className="word-search-countdown" role="status">{countdown || 'GO !'}</div>}
      </section>

      <section className="word-search-word-list" aria-label="Mots à trouver">
        {match.words.map((word) => {
          const foundEntry = match.found.find((entry) => entry.word === word)
          return <span className={foundEntry ? `is-found-player-${foundEntry.slot + 1}` : ''} key={word}>{word}</span>
        })}
      </section>

      <div className={`word-search-voice${toastIsError && toast ? ' is-error' : ''}`} aria-live="polite">
        {finished
          ? match.winner === null ? '🤝 Match nul, quel duel !' : `${playerNames[online ? match.winner === room?.yourSlot ? 0 : 1 : match.winner]} remporte la partie !`
        : toast || (playing
          ? !online && mode === 'local' ? `Tour de ${playerNames[localTurn]} · faites glisser sur les lettres.`
            : 'Faites glisser votre doigt sur les lettres pour trouver un mot.'
          : 'Préparez-vous…')}
      </div>

      {finished && (
        <section className="word-search-finish" role="status">
          <strong>{match.winner === null ? 'Match nul !' : match.winner === (online ? room?.yourSlot : 0) ? 'Victoire !' : 'Défaite'}</strong>
          <span>{match.scores[online ? room?.yourSlot ?? 0 : 0]} pts · {match.foundCounts[online ? room?.yourSlot ?? 0 : 0]} mots trouvés</span>
          {online
            ? <button type="button" onClick={() => onAction('rematch')}>Demander une revanche</button>
            : <button type="button" onClick={() => startGame(mode)}>Rejouer</button>}
        </section>
      )}
    </main>
  )
}
