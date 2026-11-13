import { useEffect } from 'react'
import { useLocalization } from './useLocalization'

const INTRO_DURATION_MS = 3_900

export default function SimpleIntro({ onEnter }: { onEnter: () => void }) {
  const { t } = useLocalization()
  useEffect(() => {
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 700
      : INTRO_DURATION_MS
    const timer = window.setTimeout(onEnter, duration)
    return () => window.clearTimeout(timer)
  }, [onEnter])

  return (
    <div className="chrome-intro fixed inset-0 z-[150] flex flex-col items-center justify-center overflow-hidden">
      <svg
        className="chicago-ink-scene"
        viewBox="350 70 650 300"
        role="img"
        aria-label="Chicago écrit à l’encre"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="intro-ink" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#ffe7a4" />
            <stop offset=".48" stopColor="#e9b64d" />
            <stop offset="1" stopColor="#a66c20" />
          </linearGradient>
          <filter id="intro-ink-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="intro-arabesque intro-arabesque-top" d="M383 105c34-31 63-28 72-8 9 21-16 32-28 17-11-15 8-29 28-21 25 10 54 3 82-13m-4 0c18 20 34 21 47 10 12-10 5-23-8-20-13 3-12 17 2 22 17 6 36-4 50-17" />
        <text
          className="intro-ink-word"
          x="675"
          y="235"
          textAnchor="middle"
          textLength="545"
          lengthAdjust="spacingAndGlyphs"
          fill="url(#intro-ink)"
          stroke="#f1c96e"
          strokeWidth="1.25"
          paintOrder="stroke"
          fontFamily="'Segoe Script', 'Brush Script MT', 'URW Chancery L', cursive"
          fontSize="156"
          fontStyle="italic"
        >
          Chicago
        </text>
        <path className="intro-arabesque intro-arabesque-bottom" d="M405 260c44 20 89 17 121 2 22-10 35-27 53-26 16 1 17 20 3 25-14 5-23-10-12-19 14-12 33-5 50 5 31 18 70 17 111-5m-61 24c30 9 51 3 66-12 13-13 4-27-10-21-12 5-8 19 5 23 14 4 28-3 40-12" />
        <text className="intro-arabic-name" x="680" y="323" textAnchor="middle" direction="rtl">
          شيكاغو
        </text>

      </svg>

      <div className="chrome-intro-caption">
        <span className="chrome-intro-rule" />
        <span>{t('intro.caption')}</span>
        <span className="chrome-intro-rule" />
      </div>
      <div className="chrome-loading-dots" role="status" aria-label={t('intro.loading')}>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className="chrome-loading-dot"
            style={{ animationDelay: `${index * 120}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
