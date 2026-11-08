import { useEffect } from 'react'
import ChicagoWordmark from './ChicagoWordmark'

const INTRO_DURATION_MS = 1_200

export default function SimpleIntro({ onEnter }: { onEnter: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onEnter, INTRO_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [onEnter])

  return (
    <div className="chrome-intro fixed inset-0 z-[150] flex flex-col items-center justify-center gap-8 overflow-hidden">
      <ChicagoWordmark className="chrome-intro-wordmark h-auto w-[min(90vw,540px)]" />
      <div className="flex items-center gap-2.5" role="status" aria-label="Chargement">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className="chrome-loading-dot h-2 w-2 rounded-full"
            style={{ animationDelay: `${index * 120}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
