import { useEffect, useRef, useState } from 'react'
import './RoomCeremony.css'

type CeremonyPlayer = { slot: number; name: string }
type CeremonyRoom = {
  code: string
  round: number
  phase: 'waiting' | 'countdown' | 'running' | 'paused' | 'finished'
  players: CeremonyPlayer[]
  yourSlot: number
  stake?: number
  payout?: number
}
type CeremonyAnimation = { key: string; phase: 'deposit' | 'result' }

export default function RoomCeremony({
  room,
  title,
  countdown,
  winnerSlot,
}: {
  room: CeremonyRoom | null
  title: string
  countdown: number | null
  winnerSlot: number | null
}) {
  const [animation, setAnimation] = useState<CeremonyAnimation | null>(null)
  const lastAnimationKeyRef = useRef('')
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!room) {
      lastAnimationKeyRef.current = ''
      return
    }
    if (room.phase === 'waiting') lastAnimationKeyRef.current = ''
    const phase = room.phase === 'countdown' ? 'deposit' : room.phase === 'finished' ? 'result' : null
    if (!phase) return
    const key = `${room.code}-${room.round}-${phase}`
    if (lastAnimationKeyRef.current === key) return
    lastAnimationKeyRef.current = key
    setAnimation({ key, phase })
  }, [room])

  useEffect(() => {
    if (!animation) return
    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return
      if (!event.data || typeof event.data !== 'object') return
      const message = event.data as { type?: unknown; key?: unknown }
      if (message.type !== 'room-ceremony-complete' || message.key !== animation.key) return
      setAnimation((current) => current?.key === animation.key ? null : current)
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [animation])

  const activePhase = room?.phase === 'countdown'
    ? 'deposit'
    : room?.phase === 'finished'
      ? 'result'
      : null
  const activeKey = activePhase && room ? `${room.code}-${room.round}-${activePhase}` : null
  const activeAnimation = animation?.key === activeKey ? animation : null
  if (!room || !activeAnimation) return null

  const isWinner = winnerSlot === room.yourSlot
  const winnerName = winnerSlot === null
    ? null
    : room.players.find((player) => player.slot === winnerSlot)?.name ?? `Joueur ${winnerSlot + 1}`
  const playerNames = [0, 1].map((slot) =>
    room.players.find((player) => player.slot === slot)?.name ?? `Joueur ${slot + 1}`,
  )
  const params = new URLSearchParams({
    key: activeAnimation.key,
    code: room.code,
    game: title,
    name0: playerNames[0],
    name1: playerNames[1],
    stake: String(room.stake ?? 0),
    payout: String(room.payout ?? 0),
    winner: String(winnerSlot ?? 0),
    draw: String(activeAnimation.phase === 'result' && winnerSlot === null),
    countdown: String(countdown ?? 0),
  })
  const src = `/animations/room-${activeAnimation.phase}.html?${params.toString()}`
  const description = activeAnimation.phase === 'deposit'
    ? `Animation complète de mise en crédits démo pour ${title}, salle ${room.code}`
    : winnerSlot === null
      ? `Animation complète de résultat nul pour ${title}, salle ${room.code}`
      : `Animation complète de résultat pour ${winnerName} dans ${title}, salle ${room.code}`

  return (
    <div className="room-ceremony" role="dialog" aria-modal="true" aria-label={description}>
      <iframe
        key={activeAnimation.key}
        ref={frameRef}
        className="room-ceremony-frame"
        src={src}
        title={description}
        allow="autoplay"
      />
      <button
        type="button"
        className="room-ceremony-skip"
        onClick={() => setAnimation(null)}
      >
        Passer l’animation
      </button>
      {activeAnimation.phase === 'deposit' && countdown !== null && (
        <span className="room-ceremony-countdown" aria-live="polite">
          La partie commence dans {countdown}…
        </span>
      )}
      {activeAnimation.phase === 'result' && (
        <span className="room-ceremony-result" aria-live="polite">
          {winnerSlot === null ? 'Match nul' : isWinner ? 'Vous avez gagné' : `${winnerName} a gagné`}
          {(room.payout ?? 0) > 0 && ` · ${room.payout?.toLocaleString('fr-FR')} crédits démo`}
        </span>
      )}
    </div>
  )
}
