import { useEffect, useRef, useState, type PointerEvent } from 'react'
import './MemoGame.css'

const SYMBOLS = ['🐶', '🐱', '🦊', '🐼', '🐸', '🦁', '🐵', '🐯', '🐙', '🦄', '🐢', '🦋']

type MemoCard = {
  id: number
  symbol: string
  faceUp: boolean
  matched: boolean
  isStar: boolean
}

function shuffle<T,>(items: T[]) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

function makeBoard(): MemoCard[] {
  const pairs = shuffle([...SYMBOLS, ...SYMBOLS])
  pairs.splice(12, 0, '⭐')
  return pairs.map((symbol, id) => ({
    id,
    symbol,
    faceUp: symbol === '⭐',
    matched: false,
    isStar: symbol === '⭐',
  }))
}

export default function MemoGame({ onClose }: { onClose: () => void }) {
  const [cards, setCards] = useState(makeBoard)
  const [moves, setMoves] = useState(0)
  const [pairs, setPairs] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [locked, setLocked] = useState(false)
  const firstCardId = useRef<number | null>(null)
  const timeoutIds = useRef<number[]>([])
  const boardRef = useRef<HTMLDivElement>(null)
  const won = pairs === SYMBOLS.length

  useEffect(() => {
    if (won) return
    const timerId = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => {
      window.clearInterval(timerId)
      timeoutIds.current.forEach(window.clearTimeout)
    }
  }, [won])

  function restart() {
    timeoutIds.current.forEach(window.clearTimeout)
    timeoutIds.current = []
    firstCardId.current = null
    setCards(makeBoard())
    setMoves(0)
    setPairs(0)
    setSeconds(0)
    setLocked(false)
  }

  function flipCard(card: MemoCard) {
    if (locked || card.faceUp || card.matched || card.isStar) return

    setCards((current) => current.map((item) => item.id === card.id ? { ...item, faceUp: true } : item))
    const firstId = firstCardId.current
    if (firstId === null) {
      firstCardId.current = card.id
      return
    }

    firstCardId.current = null
    setMoves((value) => value + 1)
    const firstCard = cards.find((item) => item.id === firstId)
    if (!firstCard) return

    if (firstCard.symbol === card.symbol) {
      setLocked(true)
      const timeoutId = window.setTimeout(() => {
        setCards((current) => current.map((item) =>
          item.id === firstId || item.id === card.id ? { ...item, matched: true } : item,
        ))
        setPairs((value) => value + 1)
        setLocked(false)
      }, 450)
      timeoutIds.current.push(timeoutId)
      return
    }

    setLocked(true)
    const timeoutId = window.setTimeout(() => {
      setCards((current) => current.map((item) =>
        item.id === firstId || item.id === card.id ? { ...item, faceUp: false } : item,
      ))
      setLocked(false)
    }, 900)
    timeoutIds.current.push(timeoutId)
  }

  function tiltBoard(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || !boardRef.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    boardRef.current.style.transform = `rotateX(${20 - y * 12}deg) rotateY(${x * 14}deg)`
  }

  return (
    <main className="memo-game">
      <div className="memo-sky" aria-hidden="true" />
      <div className="memo-cliff" aria-hidden="true" />
      <header className="memo-header">
        <button className="memo-close" type="button" onClick={onClose} aria-label="Quitter le jeu">×</button>
        <h1>MÉMO 5×5</h1>
      </header>

      <section className="memo-status" aria-label="Statistiques de la partie">
        <div className="memo-stats">
          <span>Coups <b>{moves}</b></span>
          <span>Paires <b>{pairs}</b>/12</span>
          <span>⏱ <b>{seconds}</b>s</span>
        </div>
        <button className="memo-restart" type="button" onClick={restart}>REJOUER</button>
      </section>

      <div className="memo-scene" onPointerMove={tiltBoard} onPointerLeave={() => {
        if (boardRef.current) boardRef.current.style.transform = 'rotateX(20deg) rotateY(0deg)'
      }}>
        <div className="memo-board" ref={boardRef}>
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={`memo-card${card.faceUp || card.matched ? ' is-flipped' : ''}${card.isStar ? ' is-star' : ''}${card.matched ? ' is-matched' : ''}`}
              onClick={() => flipCard(card)}
              aria-label={card.isStar ? 'Étoile' : card.faceUp || card.matched ? card.symbol : 'Carte cachée'}
              aria-pressed={card.faceUp || card.matched}
              disabled={card.isStar || card.matched}
            >
              <span className="memo-card-inner">
                <span className="memo-card-back"><i>+</i></span>
                <span className="memo-card-face">{card.symbol}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {won && (
        <div className="memo-win" role="status">
          🎉 BRAVO ! {moves} coups en {seconds} s
          <button type="button" onClick={restart}>Nouvelle partie</button>
        </div>
      )}
    </main>
  )
}
