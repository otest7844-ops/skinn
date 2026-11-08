type ChicagoWordmarkProps = {
  className?: string
}

export default function ChicagoWordmark({ className = '' }: ChicagoWordmarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 190"
      role="img"
      aria-label="Chicago"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chicago-chrome" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--chicago-chrome-1, #f3f3f5)" />
          <stop offset="8%" stopColor="var(--chicago-chrome-2, #767680)" />
          <stop offset="16%" stopColor="var(--chicago-chrome-3, #e4e4e8)" />
          <stop offset="27%" stopColor="var(--chicago-chrome-4, #35353d)" />
          <stop offset="43%" stopColor="var(--chicago-chrome-5, #b9b9c1)" />
          <stop offset="55%" stopColor="var(--chicago-chrome-6, #24242b)" />
          <stop offset="71%" stopColor="var(--chicago-chrome-7, #d7d7dc)" />
          <stop offset="82%" stopColor="var(--chicago-chrome-8, #55555e)" />
          <stop offset="100%" stopColor="var(--chicago-chrome-9, #17171d)" />
        </linearGradient>
        <linearGradient id="chicago-drip" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="var(--chicago-drip-1, #d9d9de)" />
          <stop offset=".18" stopColor="var(--chicago-drip-2, #45454e)" />
          <stop offset=".42" stopColor="var(--chicago-drip-3, #bcbcc4)" />
          <stop offset=".7" stopColor="var(--chicago-drip-4, #25252c)" />
          <stop offset="1" stopColor="var(--chicago-drip-5, #777780)" />
        </linearGradient>
        <filter id="chicago-chrome-bevel" x="-10%" y="-20%" width="120%" height="150%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="4"
            specularConstant=".85"
            specularExponent="18"
            lightingColor="#fff"
            result="shine"
          >
            <fePointLight x="-240" y="-180" z="160" />
          </feSpecularLighting>
          <feComposite in="shine" in2="SourceAlpha" operator="in" result="bevel" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="bevel" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#chicago-chrome-bevel)">
        <path
          d="M66 107c15-4 25-2 35 1v42c0 11 12 11 12 0l2-42c15 2 28 2 43 0v30c0 12 12 13 13 0l2-31c16 2 30 1 43-2v43c0 12 13 12 13 0l1-45c15 1 29 1 44-1v29c0 13 13 12 13 0v-31c15 2 29 1 42-1v48c0 12 13 12 13 0l1-51c15 1 29 0 43-2v35c0 11 13 12 13 0l1-37c16 2 30 0 43-2v45c0 12 13 13 13 0v-47c15 1 29-1 43-3v61c0 13 14 13 14 0l1-64c14 0 29-2 44-6v-8H66Z"
          fill="url(#chicago-drip)"
          stroke="#202027"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <text
          x="320"
          y="116"
          textAnchor="middle"
          textLength="570"
          lengthAdjust="spacingAndGlyphs"
          fill="url(#chicago-chrome)"
          stroke="var(--chicago-wordmark-stroke, #101015)"
          strokeWidth="8"
          paintOrder="stroke"
          fontFamily="Impact, Haettenschweiler, 'Arial Narrow Bold', 'Arial Black', sans-serif"
          fontSize="102"
          fontWeight="900"
          letterSpacing="2"
          filter="url(#chicago-chrome-bevel)"
        >
          CHICAGO
        </text>
        <path
          d="M95 116c8 2 15 2 22 0v38c0 8-11 9-12 0v-20c-1-8-10-9-10-1Zm94 0c8 2 15 2 22 0v51c0 9-11 9-12 0v-29c0-7-10-8-10-1Zm128-2c8 2 15 2 22 0v34c0 9-12 9-12 0v-17c0-8-10-8-10 0Zm129-5c8 2 15 2 22 0v48c0 9-12 9-12 0v-28c0-7-10-8-10-1Zm122-10c8 2 15 2 22 0v70c0 10-12 10-12 0v-44c0-8-10-8-10-1Z"
          fill="url(#chicago-drip)"
          stroke="#292930"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}
