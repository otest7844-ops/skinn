import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import './GhasaqGame.css'

type GhasaqGameProps = {
  onClose: () => void
}

export default function GhasaqGame({ onClose }: GhasaqGameProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <main className="ghasaq-screen">
      <header className="ghasaq-toolbar">
        <button type="button" onClick={onClose} aria-label="Quitter le jeu">
          <ArrowLeft size={18} />
          <span>Retour</span>
        </button>
        <strong>Ghasaq — FPS de survie</strong>
        <span className="ghasaq-toolbar-hint">Solo</span>
      </header>
      <div className="ghasaq-game-wrap">
        {!loaded && !failed && (
          <div className="ghasaq-game-message" role="status">
            Chargement du jeu…
          </div>
        )}
        {failed && (
          <div className="ghasaq-game-message" role="alert">
            Le jeu n’a pas pu être chargé. Vérifiez le déploiement des fichiers du jeu.
          </div>
        )}
        <iframe
          className="ghasaq-game-frame"
          src="/games/ghasaq/index.html"
          title="Ghasaq, jeu de tir à la première personne"
          allow="autoplay; gamepad"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>
    </main>
  )
}
