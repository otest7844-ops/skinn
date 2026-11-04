type ChicagoWordmarkProps = {
  className?: string
}

export default function ChicagoWordmark({ className = '' }: ChicagoWordmarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 460 190"
      role="img"
      aria-label="Chicago"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chicago-fire" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="58%" stopColor="#fff" />
          <stop offset="76%" stopColor="#ff40b5" />
          <stop offset="100%" stopColor="#f000a8" />
        </linearGradient>
        <filter id="chicago-glow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="3" dy="5" stdDeviation="1.5" floodColor="#a000bd" />
          <feDropShadow dx="0" dy="3" stdDeviation="8" floodColor="#ff009d" floodOpacity=".65" />
        </filter>
      </defs>
      <g filter="url(#chicago-glow)">
        <text
          x="230"
          y="122"
          textAnchor="middle"
          fill="url(#chicago-fire)"
          stroke="#26002d"
          strokeWidth="5"
          paintOrder="stroke"
          fontFamily="Bangers, Impact, 'Arial Black', sans-serif"
          fontSize="106"
          fontWeight="900"
          letterSpacing="1"
        >
          CHICAGO
        </text>
        <path
          d="M66 113c6 10-8 17-5 29 8-5 9-12 13-16 5 10 1 17-5 24-7 9-8 17-5 25 8-8 12-15 14-24 2-10 6-16 12-22 3 12-1 20-5 29-5 11-2 20 3 25 2-11 10-17 12-27 2-8 4-14 10-19 0 13 3 20 8 25 2-10 2-16 7-25 5-10 10-17 11-29Z"
          fill="#ed00a8"
          stroke="#ff72d1"
          strokeWidth="2"
        />
        <path
          d="M168 112c7 12-7 19-4 30 7-5 10-12 14-17 3 12-2 20-8 29-6 10-6 17-2 24 6-8 11-15 13-24 2-9 5-15 11-20 1 12-3 19-7 28-4 9-3 18 2 24 4-10 10-16 13-25 3-9 6-15 12-20 0 12 3 19 8 24 2-10 3-16 8-24 5-9 9-16 10-29Z"
          fill="#ed00a8"
          stroke="#ff72d1"
          strokeWidth="2"
        />
        <path
          d="M278 112c6 11-7 18-4 30 7-5 10-12 14-17 4 11-1 19-7 28-7 10-7 18-3 25 7-9 11-15 14-24 2-9 6-15 12-21 1 12-3 20-7 29-5 10-3 18 2 24 4-10 10-16 13-25 3-8 6-14 12-19 0 12 3 19 8 24 2-10 3-17 8-25 5-9 9-16 10-29Z"
          fill="#ed00a8"
          stroke="#ff72d1"
          strokeWidth="2"
        />
        <path
          d="M378 113c6 10-8 17-5 29 8-5 10-12 13-16 5 10 1 18-5 26-7 9-8 17-5 24 7-8 11-15 13-24 2-9 6-15 12-21 2 12-2 20-6 29-4 10-2 18 3 24 3-10 10-16 12-26 2-8 5-14 11-19 0 12 3 19 8 24 2-10 2-16 7-25 5-10 10-17 11-29Z"
          fill="#ed00a8"
          stroke="#ff72d1"
          strokeWidth="2"
        />
      </g>
    </svg>
  )
}
