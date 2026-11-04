import { useEffect, useRef } from 'react'
import type { ArenaRoomView } from './ArenaRoom'

type HeadFootballInput = { left: boolean; right: boolean; jump: boolean; kick: boolean; power: boolean }
type Action = (type: string, data?: object) => void

const EMPTY_INPUT: HeadFootballInput = { left: false, right: false, jump: false, kick: false, power: false }
const BUTTONS: { key: keyof HeadFootballInput; label: string }[] = [
  { key: 'left', label: '◀' },
  { key: 'right', label: '▶' },
  { key: 'jump', label: 'SAUT' },
  { key: 'kick', label: 'TIR' },
  { key: 'power', label: 'PUISSANT' },
]

export default function HeadFootballGame({
  room,
  local = false,
  onAction,
}: {
  room: ArenaRoomView | null
  local?: boolean
  onAction: Action
}) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const touchRef = useRef<HeadFootballInput[]>([{ ...EMPTY_INPUT }, { ...EMPTY_INPUT }])
  const slots = local ? [0, 1] : room ? [room.yourSlot] : []
  const activeSlot = room?.yourSlot

  function sendTouch(slot: number) {
    frameRef.current?.contentWindow?.postMessage({
      type: 'head-football:touch',
      slot,
      input: touchRef.current[slot],
    }, window.location.origin)
  }

  function updateTouch(slot: number, key: keyof HeadFootballInput, pressed: boolean) {
    touchRef.current[slot] = { ...touchRef.current[slot], [key]: pressed }
    sendTouch(slot)
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow || event.origin !== window.location.origin) return
      if (event.data?.type !== 'head-football:input' || !room || room.phase !== 'running') return
      const input = event.data.input as HeadFootballInput | undefined
      if (!input || Object.keys(EMPTY_INPUT).some((key) => typeof input[key as keyof HeadFootballInput] !== 'boolean')) return
      onAction('input', { input })
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onAction, room])

  useEffect(() => {
    const frame = frameRef.current?.contentWindow
    if (!frame) return
    frame.postMessage({
      type: 'head-football:mode',
      mode: room ? 'online' : local ? 'local' : 'solo',
      slot: room?.yourSlot ?? 0,
    }, window.location.origin)
    if (room) frame.postMessage({ type: 'head-football:state', gameState: room.gameState }, window.location.origin)
  }, [local, room])

  useEffect(() => () => {
    touchRef.current = [{ ...EMPTY_INPUT }, { ...EMPTY_INPUT }]
    const activeSlots = local ? [0, 1] : activeSlot === undefined ? [] : [activeSlot]
    activeSlots.forEach((slot) => {
      frameRef.current?.contentWindow?.postMessage({
        type: 'head-football:touch',
        slot,
        input: EMPTY_INPUT,
      }, window.location.origin)
    })
  }, [activeSlot, local])

  return (
    <div className="head-football-game">
      <iframe
        ref={frameRef}
        className="arcade-game-frame"
        src="/games/head-football.html"
        title="Head Football"
        allow="fullscreen"
        onLoad={() => {
          const frame = frameRef.current?.contentWindow
          if (!frame) return
          frame.postMessage({
            type: 'head-football:mode',
            mode: room ? 'online' : local ? 'local' : 'solo',
            slot: room?.yourSlot ?? 0,
          }, window.location.origin)
          if (room) frame.postMessage({ type: 'head-football:state', gameState: room.gameState }, window.location.origin)
        }}
      />
      {slots.map((slot) => (
        <div key={slot} className={`head-football-touch head-football-touch-${slot === 0 ? 'left' : 'right'}`} aria-label={`Commandes tactiles joueur ${slot + 1}`}>
          <strong>J{slot + 1}</strong>
          <div className="head-football-touch-buttons">
            {BUTTONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                aria-label={`Joueur ${slot + 1} ${label}`}
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.currentTarget.setPointerCapture(event.pointerId)
                  updateTouch(slot, key, true)
                }}
                onPointerUp={() => updateTouch(slot, key, false)}
                onPointerCancel={() => updateTouch(slot, key, false)}
                onLostPointerCapture={() => updateTouch(slot, key, false)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
