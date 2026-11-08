import { useState, type FormEvent } from 'react'
import type { ArenaRoomView } from './ArenaRoom'
import './DictationGame.css'

function DictationAnswerForm({
  sentence,
  secondsLeft,
  disabled,
  onSubmit,
}: {
  sentence: string
  secondsLeft: number
  disabled: boolean
  onSubmit: (answer: string) => void
}) {
  const [answer, setAnswer] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!disabled && answer.trim()) onSubmit(answer)
  }

  return (
    <form className="dictation-write" onSubmit={submit}>
      <label htmlFor="dictation-answer">Recopiez la phrase exactement</label>
      <p className="dictation-target">{sentence}</p>
      <textarea
        id="dictation-answer"
        value={answer}
        maxLength={240}
        disabled={disabled}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Votre copie..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <div className="dictation-submit-row">
        <span>{secondsLeft}s restantes</span>
        <button type="submit" disabled={disabled || !answer.trim()}>J’ai fini</button>
      </div>
    </form>
  )
}

export default function DictationGame({
  onClose,
  room = null,
  onAction = () => {},
}: {
  onClose: () => void
  room?: ArenaRoomView | null
  onAction?: (type: string, data?: object) => void
}) {
  const match = room?.gameState?.dictation

  if (!room) {
    return (
      <main className="dictation-solo">
        <button type="button" className="dictation-solo-close" onClick={onClose}>← Quitter la dictée</button>
        <iframe
          src="/games/dictee-eclair.html"
          title="Dictée Éclair — mode solo"
          allow="autoplay"
        />
      </main>
    )
  }

  if (!match) return <p className="dictation-loading">Préparation de la dictée…</p>

  const remaining = Math.max(0, Math.ceil(match.roundRemainingMs / 1000))
  const you = room.yourSlot
  const lastResult = match.lastResult

  return (
    <main className="dictation-online">
      <header className="dictation-online-header">
        <div>
          <span>DUEL DE DICTÉE · MEILLEUR DES TROIS</span>
          <h1>Dictée Éclair</h1>
        </div>
        <span className="dictation-round">MANCHE {match.round}/3</span>
      </header>

      <section className="dictation-scoreboard" aria-label="Score de la partie">
        {[0, 1].map((slot) => {
          const player = room.players.find((item) => item.slot === slot)
          return (
            <div className={`dictation-player dictation-player-${slot + 1}`} key={slot}>
              <span>{player?.you ? 'Vous' : player?.name ?? `Joueur ${slot + 1}`}</span>
              <strong>{match.scores[slot]}</strong>
            </div>
          )
        })}
      </section>

      {match.phase === 'playing' && (
        <DictationAnswerForm
          key={`${match.round}-${match.roundStartedAt}`}
          sentence={match.sentence}
          secondsLeft={remaining}
          disabled={match.status !== 'playing' || !room.players.some((player) => player.slot !== you && player.connected)}
          onSubmit={(answer) => onAction('dictation:submit', { answer })}
        />
      )}

      {match.phase === 'intermission' && lastResult && (
        <section className="dictation-round-result" role="status">
          <span>Copie de la manche {lastResult.round}</span>
          <h2>{lastResult.winnerSlot === null
            ? 'Temps écoulé · manche nulle'
            : lastResult.winnerSlot === you ? 'Manche remportée !' : 'Manche perdue'}</h2>
          <p>
            {lastResult.correct ? 'Copie conforme' : 'Une erreur a fait perdre cette manche'}
            {' · '}{(lastResult.elapsedMs / 1000).toFixed(2).replace('.', ',')} s
          </p>
          <span>La prochaine phrase arrive dans un instant…</span>
        </section>
      )}

      {match.status === 'finished' && (
        <section className="dictation-round-result" role="status">
          <span>FIN DU DUEL · {match.scores[0]} – {match.scores[1]}</span>
          <h2>{match.winner === null
            ? 'Égalité !'
            : match.winner === you ? 'Victoire !' : 'Défaite'}</h2>
          <button type="button" onClick={() => onAction('rematch')}>Demander une revanche</button>
        </section>
      )}
    </main>
  )
}
