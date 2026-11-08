import { useEffect, useRef, useState, useCallback } from 'react'
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Target,
  Zap,
} from 'lucide-react'
import type { ArenaRoomView } from './ArenaRoom'
import { drawMemoSky } from './game-sky'

interface SoccerArenaProps {
  onClose: () => void
  room?: ArenaRoomView | null
  onAction?: (type: string, data?: object) => void
}

type Phase =
  | 'menu'
  | 'aiming'     // player moving aim cursor
  | 'charging'   // holding to charge power
  | 'shooting'   // ball in flight
  | 'saved'
  | 'goal'
  | 'missed'
  | 'result'     // end of 5 kicks series


// ─── Audio ────────────────────────────────────────────────────────────────────
function useAudio(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  return useCallback((type: 'kick' | 'goal' | 'save' | 'crowd' | 'whistle' | 'post') => {
    if (muted) return
    try {
      if (!ctxRef.current) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        ctxRef.current = new Ctor()
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime

      if (type === 'kick') {
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.type = 'triangle'
        o.frequency.setValueAtTime(180, now)
        o.frequency.exponentialRampToValueAtTime(40, now + 0.18)
        g.gain.setValueAtTime(0.5, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.2)
      } else if (type === 'goal') {
        // Crowd roar
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            if (!ctxRef.current) return
            const buf = ctxRef.current.createBuffer(1, ctxRef.current.sampleRate * 0.8, ctxRef.current.sampleRate)
            const d = buf.getChannelData(0)
            for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctxRef.current.sampleRate * 0.35))
            const src = ctxRef.current.createBufferSource()
            const g2 = ctxRef.current.createGain()
            src.buffer = buf; g2.gain.value = 0.4
            src.connect(g2); g2.connect(ctxRef.current.destination); src.start()
          }, i * 300)
        }
      } else if (type === 'save') {
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.type = 'sawtooth'
        o.frequency.setValueAtTime(600, now)
        o.frequency.exponentialRampToValueAtTime(200, now + 0.25)
        g.gain.setValueAtTime(0.25, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.3)
      } else if (type === 'whistle') {
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.type = 'sine'
        o.frequency.setValueAtTime(2400, now)
        o.frequency.setValueAtTime(3000, now + 0.1)
        g.gain.setValueAtTime(0.3, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.32)
      } else if (type === 'post') {
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.type = 'square'
        o.frequency.setValueAtTime(1100, now)
        o.frequency.exponentialRampToValueAtTime(300, now + 0.4)
        g.gain.setValueAtTime(0.2, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.42)
      }
    } catch (_) { /* silent */ }
  }, [muted])
}

// ─── Draw a 3D-perspective penalty pitch ─────────────────────────────────────
function drawPitch(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
) {
  drawMemoSky(ctx, W, H)

  // Grass perspective — vanishing point at center-top
  const vx = W / 2, vy = H * 0.42
  const grassG = ctx.createLinearGradient(0, vy, 0, H)
  grassG.addColorStop(0, '#0B3D1A')
  grassG.addColorStop(0.4, '#0E4E20')
  grassG.addColorStop(1, '#0A3818')
  ctx.fillStyle = grassG
  ctx.fillRect(0, vy, W, H - vy)

  // Perspective turf stripes
  for (let s = 0; s < 14; s++) {
    if (s % 2 === 0) continue
    const t0 = s / 14, t1 = (s + 1) / 14
    ctx.fillStyle = 'rgba(255,255,255,0.022)'
    ctx.beginPath()
    // Left & right edges of stripe converge to vanishing point
    const lx0 = vx + (0 - vx) * t0, rx0 = vx + (W - vx) * t0
    const lx1 = vx + (0 - vx) * t1, rx1 = vx + (W - vx) * t1
    const y0 = vy + (H - vy) * (t0 * 0.6), y1 = vy + (H - vy) * (t1 * 0.6 + 0.02)
    ctx.moveTo(lx0, y0); ctx.lineTo(rx0, y0)
    ctx.lineTo(rx1, y1); ctx.lineTo(lx1, y1)
    ctx.closePath(); ctx.fill()
  }

  // Perspective pitch lines
  ctx.strokeStyle = 'rgba(255,255,255,0.30)'
  ctx.lineWidth = 1.5

  // Penalty arc (partial ellipse in perspective)
  ctx.beginPath()
  ctx.ellipse(W / 2, H * 0.46, W * 0.22, H * 0.04, 0, Math.PI, Math.PI * 2)
  ctx.stroke()

  // Penalty box top line (perspective)
  const boxTop = H * 0.44
  const boxL = W * 0.18, boxR = W * 0.82
  ctx.beginPath()
  ctx.moveTo(boxL, boxTop)
  ctx.lineTo(boxR, boxTop)
  ctx.moveTo(boxL, boxTop)
  ctx.lineTo(vx + (boxL - vx) * 2.2, H)
  ctx.moveTo(boxR, boxTop)
  ctx.lineTo(vx + (boxR - vx) * 2.2, H)
  ctx.stroke()

  // Penalty spot
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.beginPath()
  ctx.arc(W / 2, H * 0.78, 4, 0, Math.PI * 2)
  ctx.fill()
}

// ─── Draw goal posts in perspective ──────────────────────────────────────────
function drawGoal(
  ctx: CanvasRenderingContext2D,
  goalRect: { left: number; right: number; top: number; bottom: number },
) {
  const { left, right, top, bottom } = goalRect
  const gW = right - left
  const depth = gW * 0.22

  // Net back panels (perspective)
  // Back net
  ctx.fillStyle = 'rgba(200,220,255,0.04)'
  ctx.strokeStyle = 'rgba(200,220,255,0.18)'
  ctx.lineWidth = 0.7

  // Net mesh
  const cols = 14, rows = 10
  for (let c = 0; c <= cols; c++) {
    const x = left + (c / cols) * gW
    const bx = left + depth * 0.5 + (c / cols) * (gW - depth)
    ctx.beginPath()
    ctx.moveTo(x, top)
    ctx.lineTo(bx, top + (bottom - top) * 0.15)
    ctx.lineTo(bx, bottom)
    ctx.stroke()
  }
  for (let r = 0; r <= rows; r++) {
    const y = top + (r / rows) * (bottom - top)
    ctx.beginPath()
    ctx.moveTo(left, y)
    ctx.lineTo(right, y)
    ctx.stroke()
  }

  // Shadow under crossbar
  const shadowG = ctx.createLinearGradient(left, top, left, top + 30)
  shadowG.addColorStop(0, 'rgba(0,0,0,0.5)')
  shadowG.addColorStop(1, 'transparent')
  ctx.fillStyle = shadowG
  ctx.fillRect(left, top, gW, 30)

  // Post glow
  for (const px of [left, right]) {
    const glow = ctx.createRadialGradient(px, top + (bottom - top) / 2, 0, px, top + (bottom - top) / 2, 18)
    glow.addColorStop(0, 'rgba(255,255,255,0.12)')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(px - 18, top, 36, bottom - top)
  }

  // Posts & crossbar (white with 3D bevel)
  const postW = 7
  ctx.shadowColor = '#aaccff'
  ctx.shadowBlur = 10

  // Left post
  const lGrad = ctx.createLinearGradient(left, 0, left + postW, 0)
  lGrad.addColorStop(0, '#c8d8f0'); lGrad.addColorStop(0.4, '#ffffff'); lGrad.addColorStop(1, '#8899bb')
  ctx.fillStyle = lGrad
  ctx.fillRect(left - postW / 2, top, postW, bottom - top)

  // Right post
  const rGrad = ctx.createLinearGradient(right - postW, 0, right, 0)
  rGrad.addColorStop(0, '#c8d8f0'); rGrad.addColorStop(0.6, '#ffffff'); rGrad.addColorStop(1, '#8899bb')
  ctx.fillStyle = rGrad
  ctx.fillRect(right - postW / 2, top, postW, bottom - top)

  // Crossbar
  const cbGrad = ctx.createLinearGradient(0, top, 0, top + postW)
  cbGrad.addColorStop(0, '#c8d8f0'); cbGrad.addColorStop(0.4, '#ffffff'); cbGrad.addColorStop(1, '#8899bb')
  ctx.fillStyle = cbGrad
  ctx.fillRect(left - postW / 2, top - postW / 2, gW + postW, postW)

  ctx.shadowBlur = 0
}

// ─── Draw goalkeeper ─────────────────────────────────────────────────────────
function drawKeeper(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  diveX: number,
  diveY: number,
  diveProgress: number, // 0 = standing, 1 = full dive
  size: number,
) {
  ctx.save()
  ctx.translate(x + diveX * diveProgress, y + diveY * diveProgress)

  const rot = diveProgress * (diveX > 0 ? 0.7 : -0.7)
  ctx.rotate(rot)

  const sc = size / 28

  // Jersey (yellow keeper)
  const jerseyColor = '#EAB308'
  const accentColor = '#7C3AED'
  const skinColor = '#E8A87C'

  // Shadow on ground
  ctx.save()
  ctx.scale(1 + diveProgress * 0.5, 0.2 - diveProgress * 0.15)
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.85, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fill()
  ctx.restore()

  const headR = 10 * sc
  const torsoH = 22 * sc
  const legH = 20 * sc
  const legW = 5 * sc

  const headY = -(torsoH + legH + headR * 1.1)
  const shoulderY = -(torsoH + legH)
  const hipY = -legH

  // Legs
  ctx.lineWidth = legW
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#1a1a2e'

  // Bent legs when diving
  const legBend = diveProgress * 0.6
  ctx.beginPath()
  ctx.moveTo(0, hipY)
  ctx.quadraticCurveTo(-8 * sc, hipY + legH * 0.5 + legBend * 8 * sc, -6 * sc, 0)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, hipY)
  ctx.quadraticCurveTo(8 * sc, hipY + legH * 0.5, 6 * sc, 0)
  ctx.stroke()

  // Boots
  ctx.fillStyle = '#111'
  ctx.beginPath()
  ctx.ellipse(-6 * sc, 0, 9 * sc, 4 * sc, 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(6 * sc, 0, 9 * sc, 4 * sc, -0.2, 0, Math.PI * 2)
  ctx.fill()

  // Torso (yellow jersey)
  ctx.strokeStyle = jerseyColor
  ctx.lineWidth = 11 * sc
  ctx.beginPath()
  ctx.moveTo(0, hipY)
  ctx.lineTo(0, shoulderY)
  ctx.stroke()

  // Purple stripe
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 3 * sc
  ctx.beginPath()
  ctx.moveTo(-5 * sc, hipY - 8 * sc)
  ctx.lineTo(5 * sc, hipY - 8 * sc)
  ctx.stroke()

  // Arms — stretched when diving
  ctx.lineWidth = 4 * sc
  ctx.strokeStyle = jerseyColor
  const armSpread = 1 + diveProgress * 1.4
  // Left arm
  ctx.beginPath()
  ctx.moveTo(-2 * sc, shoulderY)
  ctx.lineTo(-16 * sc * armSpread, shoulderY + 14 * sc * (1 - diveProgress * 0.3))
  ctx.stroke()
  // Right arm (reaching toward dive direction)
  ctx.beginPath()
  ctx.moveTo(2 * sc, shoulderY)
  ctx.lineTo(16 * sc * armSpread * (diveX > 0 ? 1.6 : 0.6), shoulderY + 8 * sc)
  ctx.stroke()

  // Gloves
  ctx.fillStyle = '#F97316'
  ctx.beginPath()
  ctx.arc(-16 * sc * armSpread, shoulderY + 14 * sc * (1 - diveProgress * 0.3), 5 * sc, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(16 * sc * armSpread * (diveX > 0 ? 1.6 : 0.6), shoulderY + 8 * sc, 5 * sc, 0, Math.PI * 2)
  ctx.fill()

  // Neck
  ctx.strokeStyle = skinColor
  ctx.lineWidth = 5 * sc
  ctx.beginPath()
  ctx.moveTo(0, shoulderY)
  ctx.lineTo(0, headY + headR)
  ctx.stroke()

  // Head
  const hg = ctx.createRadialGradient(-2 * sc, headY - 3 * sc, 1, 0, headY, headR)
  hg.addColorStop(0, '#f5c89a'); hg.addColorStop(1, '#c89060')
  ctx.fillStyle = hg
  ctx.beginPath()
  ctx.arc(0, headY, headR, 0, Math.PI * 2)
  ctx.fill()

  // Keeper gloves (yellow cap)
  ctx.fillStyle = jerseyColor
  ctx.beginPath()
  ctx.arc(0, headY - headR * 0.3, headR * 0.8, Math.PI, 0)
  ctx.fill()
  ctx.fillRect(-headR * 1.15, headY - headR * 0.3, headR * 2.3, headR * 0.35)

  // Eyes
  ctx.fillStyle = '#222'
  const eyeDir = diveX > 0 ? 3 : -3
  ctx.beginPath()
  ctx.arc(eyeDir * sc, headY, 1.8 * sc, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// ─── Draw the kicker (player) ─────────────────────────────────────────────────
function drawKicker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  kickPhase: number, // 0 = standing, 1 = full kick
) {
  ctx.save()
  ctx.translate(x, y)
  const sc = 1.1

  const jerseyColor = '#6B38FB'
  const accentColor = '#FBBF24'
  const skinColor = '#E8A87C'

  const headR = 11 * sc
  const torsoH = 22 * sc
  const legH = 24 * sc
  const legW = 6 * sc
  const headY = -(torsoH + legH + headR * 1.1)
  const shoulderY = -(torsoH + legH)
  const hipY = -legH

  // Shadow
  ctx.save()
  ctx.scale(1, 0.22)
  ctx.beginPath()
  ctx.arc(0, 0, 20 * sc, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.fill()
  ctx.restore()

  ctx.lineWidth = legW; ctx.lineCap = 'round'

  // Support leg (back)
  ctx.strokeStyle = '#111827'
  ctx.beginPath()
  ctx.moveTo(0, hipY)
  ctx.lineTo(-8 * sc, 0)
  ctx.stroke()
  ctx.fillStyle = '#111'
  ctx.beginPath()
  ctx.ellipse(-8 * sc, 0, 10 * sc, 4 * sc, 0, 0, Math.PI * 2)
  ctx.fill()

  // Kick leg (animated)
  const kickAngle = kickPhase * 1.4 // swing forward
  ctx.strokeStyle = accentColor
  ctx.lineWidth = legW
  ctx.beginPath()
  ctx.moveTo(0, hipY)
  const lkx = 14 * sc * Math.sin(kickAngle)
  const lky = -legH * 0.5 * Math.cos(kickAngle * 0.7) * kickPhase
  ctx.lineTo(lkx * 0.55, hipY + legH * 0.5 + lky)
  ctx.lineTo(lkx + 4 * sc, hipY + legH * (1 - kickPhase * 0.45) + lky * 0.5)
  ctx.stroke()
  // Boot
  ctx.fillStyle = '#111'
  ctx.beginPath()
  ctx.ellipse(lkx + 4 * sc, hipY + legH * (1 - kickPhase * 0.45) + lky * 0.5, 11 * sc, 4.5 * sc, kickAngle * 0.4, 0, Math.PI * 2)
  ctx.fill()

  // Torso
  ctx.strokeStyle = jerseyColor
  ctx.lineWidth = 12 * sc
  ctx.beginPath()
  ctx.moveTo(0, hipY)
  ctx.lineTo(0, shoulderY)
  ctx.stroke()

  // Stripes
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 3 * sc
  for (let s = 0; s < 3; s++) {
    ctx.beginPath()
    ctx.moveTo(-5 * sc, hipY - 6 * sc - s * 6 * sc)
    ctx.lineTo(5 * sc, hipY - 6 * sc - s * 6 * sc)
    ctx.stroke()
  }

  // Arms counterbalance
  ctx.lineWidth = 4 * sc
  ctx.strokeStyle = jerseyColor
  ctx.beginPath()
  ctx.moveTo(0, shoulderY)
  ctx.lineTo(-16 * sc, shoulderY + 14 * sc - kickPhase * 8 * sc)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, shoulderY)
  ctx.lineTo(16 * sc, shoulderY + 14 * sc + kickPhase * 6 * sc)
  ctx.stroke()

  // Neck
  ctx.strokeStyle = skinColor
  ctx.lineWidth = 5 * sc
  ctx.beginPath()
  ctx.moveTo(0, shoulderY)
  ctx.lineTo(0, headY + headR)
  ctx.stroke()

  // Head
  const hg = ctx.createRadialGradient(-2 * sc, headY - 3 * sc, 1, 0, headY, headR)
  hg.addColorStop(0, '#f5c89a'); hg.addColorStop(1, '#c89060')
  ctx.fillStyle = hg
  ctx.beginPath()
  ctx.arc(0, headY, headR, 0, Math.PI * 2)
  ctx.fill()

  // Dark short hair
  ctx.fillStyle = '#1a0a0a'
  ctx.beginPath()
  ctx.arc(0, headY - headR * 0.2, headR * 0.78, Math.PI, 0)
  ctx.fill()

  // Eyes
  ctx.fillStyle = '#222'
  ctx.beginPath()
  ctx.arc(3.5 * sc, headY, 1.8 * sc, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// ─── Draw the ball in flight ──────────────────────────────────────────────────
function drawBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  shadow: boolean,
) {
  if (shadow) {
    // Ground shadow (scale by height to simulate altitude)
    ctx.save()
    ctx.scale(1, 0.3)
    ctx.beginPath()
    ctx.arc(x, y / 0.3 * 1.2, radius * 0.9, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.28)'
    ctx.fill()
    ctx.restore()
  }

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)

  // Ball body
  const bg = ctx.createRadialGradient(-radius * 0.3, -radius * 0.35, 0, 0, 0, radius)
  bg.addColorStop(0, '#ffffff')
  bg.addColorStop(0.5, '#e8e8e8')
  bg.addColorStop(1, '#888888')
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fill()

  // Pentagon patches
  ctx.fillStyle = '#1a1a1a'
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1
  const patchR = radius * 0.38
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 - Math.PI / 2
    const pcx = Math.cos(ang) * patchR, pcy = Math.sin(ang) * patchR
    ctx.beginPath()
    for (let v = 0; v < 5; v++) {
      const va = (v / 5) * Math.PI * 2 - Math.PI / 2
      const vx = pcx + Math.cos(va) * radius * 0.23
      const vy = pcy + Math.sin(va) * radius * 0.23
      if (v === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy)
    }
    ctx.closePath(); ctx.fill(); ctx.stroke()
  }
  // Center patch
  ctx.beginPath()
  for (let v = 0; v < 5; v++) {
    const va = (v / 5) * Math.PI * 2 - Math.PI / 2
    const vx = Math.cos(va) * radius * 0.23, vy = Math.sin(va) * radius * 0.23
    if (v === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy)
  }
  ctx.closePath(); ctx.fill(); ctx.stroke()

  // Specular
  const spec = ctx.createRadialGradient(-radius * 0.32, -radius * 0.34, 0, -radius * 0.32, -radius * 0.34, radius * 0.42)
  spec.addColorStop(0, 'rgba(255,255,255,0.75)')
  spec.addColorStop(1, 'transparent')
  ctx.fillStyle = spec
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// ─── Aim cursor ───────────────────────────────────────────────────────────────
function drawAimCursor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  power: number, // 0–1
  phase: Phase,
) {
  if (phase !== 'aiming' && phase !== 'charging') return
  const radius = 24 + Math.sin(Date.now() * 0.006) * 3

  // Pulsing ring
  ctx.save()
  ctx.translate(x, y)

  ctx.strokeStyle = `rgba(251,191,36,${0.6 + Math.sin(Date.now() * 0.008) * 0.2})`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.stroke()

  // Cross
  ctx.strokeStyle = 'rgba(251,191,36,0.8)'
  ctx.lineWidth = 1.5
  const cs = 8
  ctx.beginPath()
  ctx.moveTo(-cs, 0); ctx.lineTo(cs, 0)
  ctx.moveTo(0, -cs); ctx.lineTo(0, cs)
  ctx.stroke()

  // Power arc
  if (phase === 'charging' && power > 0) {
    const arcColor = power < 0.5 ? '#22c55e' : power < 0.8 ? '#f59e0b' : '#ef4444'
    ctx.strokeStyle = arcColor
    ctx.lineWidth = 5
    ctx.shadowColor = arcColor
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(0, 0, radius + 8, -Math.PI / 2, -Math.PI / 2 + power * Math.PI * 2)
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  ctx.restore()
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function SoccerArena({ onClose, room = null, onAction }: SoccerArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [muted, setMuted] = useState(false)
  const playSound = useAudio(muted)

  // Game state
  const [phase, setPhase] = useState<Phase>('menu')
  const [playerScore, setPlayerScore] = useState(0)
  const [keeperScore, setKeeperScore] = useState(0)
  const [kick, setKick] = useState(0) // current kick number 1–5
  const [resultMsg, setResultMsg] = useState('')

  useEffect(() => {
    if (room?.phase === 'running' && phaseRef.current === 'menu') startGame()
  }, [room?.phase])

  // Aim state (controlled by touch/mouse)
  const aimRef = useRef({ x: 0.5, y: 0.35 }) // normalized 0–1 within goal
  const powerRef = useRef(0)
  const chargeStartRef = useRef(0)
  const phaseRef = useRef<Phase>('menu')
  phaseRef.current = phase

  // Animation state refs
  const ballRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, rot: 0, radius: 14 })
  const keeperRef = useRef({ x: 0.5, y: 0.5, diveX: 0, diveY: 0, diveProgress: 0 })
  const kickerRef = useRef({ kickPhase: 0 })
  const animFrameRef = useRef(0)
  const goalRectRef = useRef({ left: 0, right: 0, top: 0, bottom: 0 })
  const ballStartRef = useRef({ x: 0, y: 0 })

  // Touch/pointer control for aiming
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'aiming') return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const gr = goalRectRef.current
    const px = (e.clientX - rect.left) * (canvas.width / rect.width)
    const py = (e.clientY - rect.top) * (canvas.height / rect.height)
    // Clamp within goal + small margin
    const margin = 30
    aimRef.current = {
      x: Math.max(0, Math.min(1, (px - (gr.left - margin)) / (gr.right - gr.left + margin * 2))),
      y: Math.max(0, Math.min(1, (py - (gr.top - margin)) / (gr.bottom - gr.top + margin * 2))),
    }
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (phaseRef.current !== 'aiming') return
    e.currentTarget.setPointerCapture(e.pointerId)
    chargeStartRef.current = Date.now()
    setPhase('charging')
  }, [])

  const onPointerUp = useCallback(() => {
    if (phaseRef.current !== 'charging') return
    const held = (Date.now() - chargeStartRef.current) / 1000
    const power = Math.min(1, held / 1.2)
    powerRef.current = Math.max(0.3, power)
    shootBall()
  }, [])

  function shootBall() {
    setPhase('shooting')
    playSound('kick')

    const canvas = canvasRef.current
    if (!canvas) return
    const gr = goalRectRef.current
    const aim = aimRef.current

    // Target point in canvas coordinates
    const targetX = gr.left + aim.x * (gr.right - gr.left)
    const targetY = gr.top + aim.y * (gr.bottom - gr.top)

    const bs = ballStartRef.current
    ballRef.current = {
      x: bs.x, y: bs.y,
      vx: targetX - bs.x, vy: targetY - bs.y,
      rot: 0, radius: 14,
    }

    // Keeper dives opposite or same side (AI — sometimes right guess)
    const kDiveX = aim.x < 0.35 ? 1 : aim.x > 0.65 ? -1 : (Math.random() < 0.5 ? 1 : -1)
    const kDiveY = aim.y < 0.4 ? 1 : -0.5
    const guessRight = (aim.x < 0.4 && kDiveX > 0) || (aim.x > 0.6 && kDiveX < 0)

    keeperRef.current = {
      x: 0.5, y: 0.5,
      diveX: kDiveX * (gr.right - gr.left) * 0.55,
      diveY: kDiveY * (gr.bottom - gr.top) * 0.4,
      diveProgress: 0,
    }
    kickerRef.current.kickPhase = 0

    // Determine outcome
    const normalizedAimX = aim.x
    const normalizedAimY = aim.y

    // Miss = aimed outside goal or very low power corner
    const isMiss =
      normalizedAimX < 0.02 || normalizedAimX > 0.98 ||
      normalizedAimY < 0.02 || normalizedAimY > 0.98

    // Save = keeper guesses right AND close enough
    const keeperReachX = Math.abs(aim.x - (kDiveX > 0 ? 0.85 : 0.15))
    const isSave = !isMiss && guessRight && keeperReachX < 0.32 && normalizedAimY > 0.25

    // Post = aimed very close to edge without miss
    const isPost = !isMiss && !isSave && (
      (normalizedAimX < 0.06 && normalizedAimX > 0.02) ||
      (normalizedAimX > 0.94 && normalizedAimX < 0.98) ||
      (normalizedAimY < 0.06 && normalizedAimY > 0.02)
    )

    setTimeout(() => {
      if (isPost) {
        playSound('post')
        onAction?.('shot', { scored: false })
        setPhase('missed')
        setResultMsg('🏃 Poteau !')
      } else if (isMiss) {
        playSound('save')
        onAction?.('shot', { scored: false })
        setPhase('missed')
        setResultMsg('⚠️ Raté !')
      } else if (isSave) {
        playSound('save')
        onAction?.('shot', { scored: false })
        setPhase('saved')
        setResultMsg('🧤 Arrêt du gardien !')
        setKeeperScore((s) => s + 1)
      } else {
        playSound('goal')
        onAction?.('shot', { scored: true })
        setPhase('goal')
        setResultMsg('⚽ BUT !')
        setPlayerScore((s) => s + 1)
      }
    }, 1100)
  }

  function nextKick() {
    const nextKickNum = kick + 1
    if (nextKickNum > 5) {
      setPhase('result')
    } else {
      setKick(nextKickNum)
      powerRef.current = 0
      aimRef.current = { x: 0.5, y: 0.35 }
      keeperRef.current = { x: 0.5, y: 0.5, diveX: 0, diveY: 0, diveProgress: 0 }
      kickerRef.current.kickPhase = 0
      setPhase('aiming')
    }
  }

  function startGame() {
    setPlayerScore(0); setKeeperScore(0); setKick(1)
    powerRef.current = 0
    aimRef.current = { x: 0.5, y: 0.35 }
    keeperRef.current = { x: 0.5, y: 0.5, diveX: 0, diveY: 0, diveProgress: 0 }
    kickerRef.current.kickPhase = 0
    setPhase('aiming')
  }

  // ─── Render loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true

    function handleResize() {
      if (!canvas) return
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(parent.clientWidth * dpr)
      canvas.height = Math.round(parent.clientHeight * dpr)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    function render() {
      if (!running || !canvas || !ctx) return
      animFrameRef.current = requestAnimationFrame(render)

      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Draw pitch
      drawPitch(ctx, W, H)

      // Goal dimensions (perspective — taller and wider in canvas)
      const goalW = W * 0.55
      const goalH = H * 0.32
      const goalLeft = (W - goalW) / 2
      const goalTop = H * 0.05
      const goalBottom = goalTop + goalH
      goalRectRef.current = { left: goalLeft, right: goalLeft + goalW, top: goalTop, bottom: goalBottom }

      drawGoal(ctx, goalRectRef.current)

      // Ball start position
      const bsY = H * 0.82
      ballStartRef.current = { x: W / 2, y: bsY }

      // Keeper rendering
      const gr = goalRectRef.current
      const kp = keeperRef.current
      const keeperX = gr.left + kp.x * (gr.right - gr.left)
      const keeperY = goalBottom - 5
      const phaseNow = phaseRef.current

      // Animate keeper dive
      if (phaseNow === 'shooting' || phaseNow === 'saved' || phaseNow === 'goal' || phaseNow === 'missed') {
        kp.diveProgress = Math.min(1, kp.diveProgress + 0.04)
      }

      drawKeeper(ctx, keeperX, keeperY, kp.diveX, kp.diveY, kp.diveProgress, 26)

      // Ball rendering
      if (phaseNow === 'shooting') {
        const b = ballRef.current
        const elapsed = (Date.now() % 1200) / 1200
        b.x = ballStartRef.current.x + b.vx * elapsed * 0.95
        b.y = ballStartRef.current.y + b.vy * elapsed * 0.95 - Math.sin(elapsed * Math.PI) * H * 0.18
        b.rot += 0.15
        const scale = 1 - elapsed * 0.45
        const r = b.radius * (1 + (1 - elapsed) * 1.0) * scale
        // Shadow on ground
        ctx.save()
        ctx.translate(b.x, bsY)
        ctx.scale(1, 0.25)
        ctx.beginPath()
        ctx.arc(0, 0, r * (1 - elapsed * 0.5) * 0.9, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,0,0,${0.3 - elapsed * 0.2})`
        ctx.fill()
        ctx.restore()
        drawBall(ctx, b.x, b.y, Math.max(4, r), b.rot, false)
      } else if (phaseNow === 'aiming' || phaseNow === 'charging') {
        // Ball on spot
        drawBall(ctx, W / 2, bsY, ballRef.current.radius + 2, 0, true)
      } else if (phaseNow === 'goal') {
        // Ball bouncing in net
        const t = (Date.now() % 600) / 600
        const aim = aimRef.current
        const bx = gr.left + aim.x * (gr.right - gr.left)
        const by = gr.top + aim.y * (gr.bottom - gr.top)
        const bounce = Math.abs(Math.sin(t * Math.PI * 2)) * 8
        drawBall(ctx, bx, by - bounce, 10, Date.now() * 0.05, false)
      } else {
        drawBall(ctx, W / 2, bsY, ballRef.current.radius + 2, 0, true)
      }

      // Kicker (always visible below)
      if (phaseNow !== 'menu' && phaseNow !== 'result') {
        const kicking = phaseNow === 'shooting' ? Math.min(1, ((Date.now() % 1200) / 1200) * 2) : 0
        kickerRef.current.kickPhase = kicking
        drawKicker(ctx, W / 2, bsY + 5, kicking)
      }

      // Aim cursor
      if (phaseNow === 'aiming' || phaseNow === 'charging') {
        const aim = aimRef.current
        const power = phaseNow === 'charging'
          ? Math.min(1, (Date.now() - chargeStartRef.current) / 1200)
          : 0
        const cursorX = gr.left + aim.x * (gr.right - gr.left)
        const cursorY = gr.top + aim.y * (gr.bottom - gr.top)
        drawAimCursor(ctx, cursorX, cursorY, power, phaseNow)
      }

      // Kick indicator dots (5 kicks)
      const dotY = H * 0.97
      const dotSpacing = 28
      const dotStartX = W / 2 - (5 * dotSpacing) / 2
      for (let i = 0; i < 5; i++) {
        const isCurrentKick = i + 1 === kick
        const isPast = i + 1 < kick
        ctx.beginPath()
        ctx.arc(dotStartX + i * dotSpacing, dotY, 7, 0, Math.PI * 2)
        ctx.fillStyle = isPast ? '#6B38FB' : isCurrentKick ? '#FBBF24' : 'rgba(255,255,255,0.15)'
        ctx.fill()
        if (isCurrentKick) {
          ctx.strokeStyle = '#FBBF24'
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }
    }

    render()
    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [phase])

  const isDone = phase === 'goal' || phase === 'saved' || phase === 'missed'
  const displayedScore = room?.gameState?.scores?.[room.yourSlot] ?? playerScore
  const opponentScore = room ? room.gameState?.scores?.[1 - room.yourSlot] ?? 0 : keeperScore

  return (
    <div className="fixed inset-0 z-[120] bg-[#070913] text-white flex flex-col overflow-hidden select-none">

      {/* ── Top Bar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 pt-3 pb-2 bg-black/70 backdrop-blur-md border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-all"
        >
          <ArrowLeft size={14} /> Quitter
        </button>

        {/* Score */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Toi</div>
            <div className="text-2xl font-black text-white leading-none">{room?.gameState?.scores?.[room.yourSlot] ?? playerScore}</div>
          </div>
          <div className="text-slate-500 font-black text-lg">–</div>
          <div className="text-center">
            <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider">{room ? room.players.find((player) => !player.you)?.name ?? 'Adversaire' : 'Gardien'}</div>
            <div className="text-2xl font-black text-white leading-none">{room ? room.gameState?.scores?.[1 - room.yourSlot] ?? 0 : keeperScore}</div>
          </div>
          <div className="ml-2 text-[10px] text-slate-500 font-bold">
            {kick}/5
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMuted((p) => !p)}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* ── Canvas ── */}
      <div className="relative flex-1 w-full overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />

        {/* Phase overlays */}

        {/* Menu */}
        {phase === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-amber-400 flex items-center justify-center shadow-2xl mb-4">
              <span className="text-4xl">⚽</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-purple-300">
              PENALTY
            </h1>
            <p className="text-sm text-slate-400 mb-1 font-semibold">Série de 5 tirs au but</p>
            <p className="text-xs text-slate-500 mb-8">
              Déplace le curseur · Appuie et tiens pour charger la puissance
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6B38FB] to-[#8B5CF6] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-600/40 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
            >
              <Target size={18} />
              <span>Commencer</span>
            </button>
          </div>
        )}

        {/* Instruction banner (aiming) */}
        {phase === 'aiming' && (
          <div className="absolute bottom-16 inset-x-0 flex flex-col items-center gap-1 pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
              <Target size={13} className="text-amber-400" />
              <span className="text-xs font-bold text-white">Glisse pour viser · Appuie et tiens pour tirer</span>
            </div>
          </div>
        )}
        {(phase === 'aiming' || phase === 'charging') && (
          <button
            type="button"
            className="absolute z-10 bottom-3 left-1/2 -translate-x-1/2 min-h-12 rounded-full border border-amber-200 bg-amber-500 px-7 font-black text-white shadow-lg active:scale-95 touch-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-label="Maintenir pour charger puis relâcher pour tirer"
          >
            {phase === 'charging' ? 'RELÂCHER POUR TIRER' : 'MAINTENIR POUR TIRER'}
          </button>
        )}

        {/* Power bar (charging) */}
        {phase === 'charging' && (
          <div className="absolute bottom-16 inset-x-0 flex flex-col items-center gap-2 pointer-events-none">
            <div className="w-48 h-3 rounded-full bg-white/10 border border-white/20 overflow-hidden">
              <div
                className="h-full rounded-full transition-none"
                style={{
                  width: `${Math.min(100, ((Date.now() - chargeStartRef.current) / 1200) * 100)}%`,
                  background: 'linear-gradient(to right, #22c55e, #f59e0b, #ef4444)',
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Relâche pour tirer !</span>
          </div>
        )}

        {/* Result banner (goal / saved / missed) */}
        {isDone && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[3px]">
            <div className={`px-8 py-5 rounded-3xl border-2 text-center shadow-2xl mb-8 ${
              phase === 'goal'
                ? 'bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 border-white animate-bounce'
                : 'bg-[#161928] border-white/20'
            }`}>
              <div className="text-4xl font-black mb-1">{resultMsg}</div>
              {phase === 'goal' && <Sparkles size={24} className="text-amber-300 mx-auto" />}
            </div>

            {kick < 5 ? (
              <button
                type="button"
                onClick={nextKick}
                className="px-6 py-3 rounded-2xl bg-[#6B38FB] text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-purple-600/40 hover:brightness-110 active:scale-95 transition-all"
              >
                <Zap size={15} />
                <span>Prochain tir ({kick + 1}/5)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPhase('result')}
                className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-black text-sm flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <Trophy size={15} />
                <span>Voir le résultat</span>
              </button>
            )}
          </div>
        )}

        {/* Final result screen */}
        {phase === 'result' && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <Trophy size={52} className={`mb-3 animate-bounce ${displayedScore > opponentScore ? 'text-amber-400' : 'text-slate-400'}`} />
            <h2 className="text-3xl font-black mb-2">
              {displayedScore > opponentScore ? '🏆 Victoire !' : displayedScore < opponentScore ? '😔 Défaite !' : '🤝 Égalité !'}
            </h2>
            <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
              {displayedScore} – {opponentScore}
            </div>
            <div className="text-xs text-slate-400 mb-8 font-semibold">
              {displayedScore === 5 ? 'Score parfait ! ⭐⭐⭐' : displayedScore >= 3 ? 'Bien joué !' : 'Retente ta chance !'}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={room ? undefined : startGame}
                disabled={Boolean(room)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6B38FB] to-[#8B5CF6] text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-purple-600/40"
              >
                <RotateCcw size={14} /> {room ? 'Retour au salon' : 'Rejouer'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm"
              >
                Quitter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom instruction bar ── */}
      {(phase === 'aiming' || phase === 'charging') && (
        <div className="flex-shrink-0 bg-black/70 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-between">
          <div className="text-[10px] text-slate-400">
            <span className="text-amber-400 font-bold">Coup {kick}/5</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Target size={11} className="text-amber-400" />
            <span>{phase === 'aiming' ? 'Glisse pour viser la zone' : 'Relâche pour tirer !'}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            <span className="text-purple-400 font-bold">{playerScore} buts</span>
          </div>
        </div>
      )}
    </div>
  )
}
