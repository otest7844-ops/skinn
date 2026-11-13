import { ArrowLeft } from 'lucide-react'
import './StandaloneGame.css'

export type StandaloneGameId = 'piaf-plume' | 'lave-montante' | 'mirror-run'

type StandaloneGameProps = {
  game: StandaloneGameId
  title: string
  onClose: () => void
}

export default function StandaloneGame({ game, title, onClose }: StandaloneGameProps) {
  return (
    <main className="standalone-game">
      <iframe
        className="standalone-game-frame"
        src={`/games/${game}.html`}
        title={title}
        allow="autoplay; fullscreen"
      />
      <header className="standalone-game-toolbar">
        <button type="button" onClick={onClose} aria-label={`Quitter ${title}`}>
          <ArrowLeft size={18} />
          <span>Retour</span>
        </button>
        <strong>{title}</strong>
        <span>Solo</span>
      </header>
    </main>
  )
}
