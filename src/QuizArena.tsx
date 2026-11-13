import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Zap } from 'lucide-react'
import type { ArenaRoomView } from './ArenaRoom'
import './QuizArena.css'

type QuizArenaProps = {
  room: ArenaRoomView | null
  onClose: () => void
  onAction: (type: string, data?: object) => void
}

export default function QuizArena({ room, onClose, onAction }: QuizArenaProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [selection, setSelection] = useState<{ round: number; answer: number } | null>(null)
  const round = room?.gameState?.round ?? -1
  const selectedAnswer = selection?.round === round ? selection.answer : null

  useEffect(() => {
    if (room) return
    function handleMessage(event: MessageEvent) {
      if (
        event.origin === window.location.origin
        && event.source === frameRef.current?.contentWindow
        && event.data?.type === 'quiz-arena:close'
      ) {
        onClose()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onClose, room])

  if (room?.gameState) {
    const gameState = room.gameState
    const questionActive = room.phase === 'running' && gameState.phase === 'question'
    const hasAnswered = gameState.submitted?.[room.yourSlot] ?? false
    const remaining = gameState.roundRemainingMs ?? 0
    const revealRemaining = gameState.revealRemainingMs ?? 0
    const isRevealing = gameState.phase === 'reveal' || gameState.phase === 'finished'
    const opponentSlot = 1 - room.yourSlot
    const opponentName = room.players.find((player) => player.slot !== room.yourSlot)?.name ?? 'Adversaire'
    const questionNumber = (gameState.round ?? 0) + 1
    const ownAnswer = gameState.answers?.[room.yourSlot] ?? null
    const opponentAnswer = gameState.answers?.[opponentSlot] ?? null

    return (
      <main className="quiz-arena-online">
        <header className="quiz-arena-online-header">
          <button type="button" className="quiz-arena-back" onClick={onClose} aria-label="Quitter le quiz">
            <ArrowLeft size={22} />
          </button>
          <span className="quiz-arena-question-count">QUESTION {questionNumber}/15</span>
          <span className="quiz-arena-mode-mark" aria-label="Duel multijoueur">⚔️</span>
        </header>
        <section className="quiz-arena-online-card">
          <div className="quiz-arena-online-meta">
            <span>{gameState.question?.category ?? 'Quiz Arène'}</span>
            <span>{isRevealing ? 'Réponses révélées' : gameState.submitted?.[opponentSlot] ? `${opponentName} a choisi · le chrono continue` : `${opponentName} réfléchit…`}</span>
          </div>
          <div className="quiz-arena-progress" aria-label={`${Math.ceil((questionActive ? remaining : revealRemaining) / 1000)} secondes restantes`}>
            <span style={{ width: `${Math.min(100, questionActive ? remaining / 150 : revealRemaining / 50)}%` }} />
          </div>
          <strong className="quiz-arena-timer" aria-live="off">
            {questionActive ? Math.ceil(remaining / 1000) : gameState.phase === 'reveal' ? Math.ceil(revealRemaining / 1000) : '—'}
          </strong>
          <h1>{gameState.question?.prompt ?? 'En attente de la question…'}</h1>
          <div className="quiz-arena-options">
            {(gameState.question?.options ?? []).map((option, index) => {
              const yourAnswer = isRevealing ? ownAnswer === index : selectedAnswer === index
              const opponentSelected = isRevealing && opponentAnswer === index
              const correct = isRevealing && gameState.question?.correctIndex === index
              const wrongSelection = isRevealing && !correct && (yourAnswer || opponentSelected)
              const className = [
                correct ? 'is-correct' : '',
                wrongSelection ? 'is-wrong' : '',
                !isRevealing && yourAnswer ? 'is-selected' : '',
              ].filter(Boolean).join(' ')
              return (
                <button
                  type="button"
                  key={`${gameState.round}-${index}`}
                  className={className}
                  disabled={!questionActive || hasAnswered || gameState.eliminated?.includes(index)}
                  onClick={() => {
                    setSelection({ round, answer: index })
                    onAction('quiz:answer', { answer: index })
                  }}
                >
                  <b>{'ABCD'[index]}</b>
                  <span className="quiz-arena-option-text">{option}</span>
                  {isRevealing && yourAnswer && <span className="quiz-arena-answer-badge">Vous · {'ABCD'[index]}</span>}
                  {opponentSelected && <span className="quiz-arena-answer-badge is-opponent">{opponentName} · {'ABCD'[index]}</span>}
                </button>
              )
            })}
          </div>
          <div className="quiz-arena-vs">
            <div className="is-you">Vous <b>{gameState.scores?.[room.yourSlot] ?? 0}</b></div>
            <div className="is-opponent">{opponentName} <b>{gameState.scores?.[opponentSlot] ?? 0}</b></div>
          </div>
          <div className="quiz-arena-online-footer">
            <button
              type="button"
              className="quiz-arena-joker"
              disabled={!questionActive || hasAnswered || (gameState.jokers?.[room.yourSlot] ?? 0) < 1 || (gameState.eliminated?.length ?? 0) > 0}
              onClick={() => onAction('quiz:joker')}
            >
              <Zap size={21} fill="currentColor" /> Joker 50/50
              <b>{gameState.jokers?.[room.yourSlot] ?? 0}</b>
            </button>
          </div>
          {gameState.phase === 'reveal' && (
            <p className="quiz-arena-feedback" role="status">
              Vous : {ownAnswer === null ? 'aucune réponse' : `choix ${'ABCD'[ownAnswer]}`} · {opponentName} : {opponentAnswer === null ? 'aucune réponse' : `choix ${'ABCD'[opponentAnswer]}`}. La bonne réponse reste affichée pendant 5 secondes.
            </p>
          )}
          {hasAnswered && gameState.phase === 'question' && (
            <p className="quiz-arena-feedback" role="status">Réponse enregistrée. Le chrono partagé continue jusqu’à 0, même si les deux joueurs ont répondu.</p>
          )}
          {gameState.phase === 'finished' && (
            <p className="quiz-arena-feedback" role="status">
              {gameState.winner === null ? 'Égalité !' : gameState.winner === room.yourSlot ? 'Victoire !' : 'Défaite.'}
            </p>
          )}
        </section>
      </main>
    )
  }

  return (
    <iframe
      ref={frameRef}
      className="quiz-arena-frame"
      src="/games/quiz-arene.html"
      title="Quiz Arène"
      allow="autoplay"
    />
  )
}
