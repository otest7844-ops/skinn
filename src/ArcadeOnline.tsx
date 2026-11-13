import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { ArrowLeft, Check, Clipboard, LoaderCircle, Users, Wifi, WifiOff } from 'lucide-react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import './ArcadeOnline.css'
import { getMultiplayerUrl } from './multiplayer-url'
import { getDemoWalletId } from './demo-wallet'
import GameControlsGuide from './GameControlsGuide'

export type ArcadeGameId = 'ping-pong' | 'basketball-stars' | 'ball-rush' | 'forest-bridge' | 'damned-maze' | 'princess-race' | 'grotte-aux-couteaux' | 'colonnes-du-canyon' | 'arena-helice' | 'duel-de-troncs' | 'chess-3d' | 'embuscade' | 'moto-taxi-afrique' | 'chemin-de-couleurs' | 'duel-de-cartes' | 'ghasaq' | 'counter-siege' | 'dashbot' | 'piaf-plume' | 'lave-montante' | 'mirror-run'

type Player = { slot: number; you: boolean; name: string; connected: boolean; ready: boolean }
type Room = {
  code: string
  game: ArcadeGameId
  phase: 'waiting' | 'countdown' | 'running' | 'paused' | 'finished'
  round: number
  seed: number | null
  countdownEndsAt: number | null
  countdownRemainingMs: number | null
  players: Player[]
  gameState: unknown
  yourSlot: number
  isPublic?: boolean
  stake?: number
  payout?: number
  winnerSlot?: number | null
  ghasaqMode?: 'coop' | 'duel'
}
type Ack = { ok: boolean; error?: string; code?: string; token?: string }
type View = 'home' | 'join' | 'lobby' | 'game' | 'solo' | 'local'
type ScoreState = { score?: unknown; scores?: unknown; players?: unknown }

const socketUrl = getMultiplayerUrl()
const gameDetails: Record<ArcadeGameId, { title: string; label: string }> = {
  'ping-pong': { title: 'Ping Pong', label: 'PING-PONG' },
  'basketball-stars': { title: 'Basketball Stars', label: 'BASKETBALL' },
  'ball-rush': { title: 'Ball Rush 3D', label: 'BALL RUSH 3D' },
  'forest-bridge': { title: 'Pont de la forêt 3D', label: 'PONT DE LA FORÊT 3D' },
  'damned-maze': { title: 'Le Labyrinthe des Damnés', label: 'LE LABYRINTHE DES DAMNÉS' },
  'princess-race': { title: 'La Course vers la Princesse', label: 'COURSE VERS LA PRINCESSE' },
  'grotte-aux-couteaux': { title: 'Grotte aux Couteaux', label: 'GROTTE AUX COUTEAUX' },
  'colonnes-du-canyon': { title: 'Colonnes du Canyon', label: 'COLONNES DU CANYON' },
  'arena-helice': { title: 'Arène Hélice', label: 'ARÈNE HÉLICE' },
  'duel-de-troncs': { title: 'Duel de Troncs', label: 'DUEL DE TRONCS' },
  'chess-3d': { title: 'Échecs 3D', label: 'ÉCHECS 3D' },
  embuscade: { title: 'Embuscade', label: 'EMBUSCADE' },
  'moto-taxi-afrique': { title: 'Moto Taxi Afrique', label: 'MOTO TAXI AFRIQUE' },
  'chemin-de-couleurs': { title: 'Chemin de couleurs 3D', label: 'CHEMIN DE COULEURS' },
  'duel-de-cartes': { title: 'Duel de cartes 3D', label: 'DUEL DE CARTES' },
  ghasaq: { title: 'Ghasaq — FPS de survie', label: 'GHASAQ' },
  'counter-siege': { title: 'Counter Siege', label: 'COUNTER SIEGE' },
  dashbot: { title: 'DashBot', label: 'DASHBOT' },
  'piaf-plume': { title: 'Piaf Plume', label: 'PIAF PLUME' },
  'lave-montante': { title: 'Lave Montante', label: 'LAVE MONTANTE' },
  'mirror-run': { title: 'Mirror Run', label: 'MIRROR RUN' },
}

function getBridgeName(game: ArcadeGameId) {
  return game === 'basketball-stars' ? 'basketball' : game
}

function usesInjectedBridge(game: ArcadeGameId) {
  return game === 'chess-3d' || game === 'embuscade'
    || game === 'moto-taxi-afrique' || game === 'chemin-de-couleurs'
    || game === 'duel-de-cartes' || game === 'ghasaq'
    || game === 'counter-siege' || game === 'dashbot'
}

function getGameFile(game: ArcadeGameId) {
  if (game === 'ghasaq' || game === 'counter-siege' || game === 'dashbot') return `${game}/index.html`
  return game
}

function isMinimalRoomGame(game: ArcadeGameId) {
  return game === 'counter-siege' || game === 'dashbot'
}

function isFreeOnlyGame(game: ArcadeGameId) {
  return game === 'ghasaq' || isMinimalRoomGame(game)
    || game === 'piaf-plume' || game === 'lave-montante' || game === 'mirror-run'
}

function isSuppliedRunGame(game: ArcadeGameId) {
  return game === 'piaf-plume' || game === 'lave-montante' || game === 'mirror-run'
}

function isPublicFreeRace(game: ArcadeGameId) {
  return game === 'lave-montante' || game === 'mirror-run'
}

function getInjectedBridgeFile(game: ArcadeGameId) {
  return isMinimalRoomGame(game)
    ? `/games/${game}/online.js`
    : `/games/${getBridgeName(game)}-online.js`
}

const helixKeyboardSlots: Record<string, 0 | 1> = {
  KeyW: 0, KeyS: 0, KeyA: 0, KeyD: 0, Space: 0, ShiftLeft: 0,
  ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1,
  Enter: 1, ShiftRight: 1, Numpad0: 1, NumpadEnter: 1,
}

const trunkKeyboardActions: Record<string, { slot: 0 | 1; action: 'left' | 'right' | 'jump' }> = {
  KeyA: { slot: 0, action: 'left' },
  KeyD: { slot: 0, action: 'right' },
  KeyW: { slot: 0, action: 'jump' },
  Space: { slot: 0, action: 'jump' },
  ArrowLeft: { slot: 1, action: 'left' },
  ArrowRight: { slot: 1, action: 'right' },
  ArrowUp: { slot: 1, action: 'jump' },
}

function emitAck(socket: Socket, event: string, payload: object = {}) {
  return new Promise<Ack>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('Le serveur ne répond pas. Réessayez.')), 5000)
    socket.emit(event, payload, (response: Ack) => {
      window.clearTimeout(timer)
      if (!response?.ok) {
        reject(new Error(response?.error ?? 'La demande a échoué.'))
        return
      }
      resolve(response)
    })
  })
}

function getGhasaqStartConfig(state: unknown): object | null {
  if (!state || typeof state !== 'object' || !('startConfig' in state)) return null
  const config = state.startConfig
  return config && typeof config === 'object' ? config : null
}

function getScores(state: unknown, game: ArcadeGameId): [number, number] | null {
  if (!state || typeof state !== 'object') return null
  const result = state as ScoreState
  if (game === 'ball-rush' && Array.isArray(result.players) && result.players.length === 2) {
    const scores = result.players.map((player) => player && typeof player === 'object'
      ? (player as { score?: unknown }).score
      : null)
    if (scores.every((score): score is number => typeof score === 'number' && Number.isFinite(score))) {
      return [scores[0], scores[1]]
    }
    return null
  }
  const scores = Array.isArray(result.scores) ? result.scores : result.score
  if (Array.isArray(scores) && scores.length === 2
    && scores.every((score): score is number => typeof score === 'number' && Number.isFinite(score))) {
    return [scores[0], scores[1]]
  }
  return null
}

export default function ArcadeOnline({
  game,
  onClose,
  publicJoin = null,
  onWalletBalance,
}: {
  game: ArcadeGameId
  onClose: () => void
  publicJoin?: { game: string; code: string; stake: number } | null
  onWalletBalance?: (balance: number) => void
}) {
  const [view, setView] = useState<View>('home')
  const [room, setRoom] = useState<Room | null>(null)
  const [nickname, setNickname] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [joinStake, setJoinStake] = useState('500')
  const [stake, setStake] = useState('500')
  const [publicRoom, setPublicRoom] = useState(true)
  const [ghasaqMode, setGhasaqMode] = useState<'coop' | 'duel'>('coop')
  const [feedback, setFeedback] = useState('')
  const [connected, setConnected] = useState(false)
  const [copied, setCopied] = useState(false)
  const [clock, setClock] = useState(0)
  const socketRef = useRef<Socket | null>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const frameBridgeReadyRef = useRef(false)
  const roomRef = useRef<Room | null>(null)
  const enabledRoundRef = useRef('')
  const finishRequestedRef = useRef(false)
  const attemptedPublicJoinRef = useRef('')
  const helixHeldKeysRef = useRef(new Set<string>())
  const trunkHeldKeysRef = useRef(new Set<string>())
  const helixTouchPointersRef = useRef(new Map<number, 'left' | 'right' | 'up' | 'down' | 'jump'>())
  const nicknameRef = useRef(nickname)
  const walletBalanceCallbackRef = useRef(onWalletBalance)
  nicknameRef.current = nickname
  walletBalanceCallbackRef.current = onWalletBalance

  useEffect(() => {
    if (game !== 'arena-helice') return

    function sendKeyboard(code?: string, pressed?: boolean) {
      frameRef.current?.contentWindow?.postMessage({
        type: 'arena-helice:keyboard',
        ...(code ? { code, pressed } : { reset: true }),
      }, window.location.origin)
    }

    function onKeyDown(event: KeyboardEvent) {
      const current = roomRef.current
      const slot = helixKeyboardSlots[event.code]
      if (slot === undefined || !current || current.game !== game || current.phase !== 'running') return
      event.preventDefault()
      if (slot !== current.yourSlot || event.repeat || helixHeldKeysRef.current.has(event.code)) return
      helixHeldKeysRef.current.add(event.code)
      sendKeyboard(event.code, true)
    }

    function onKeyUp(event: KeyboardEvent) {
      if (!helixHeldKeysRef.current.delete(event.code)) return
      event.preventDefault()
      sendKeyboard(event.code, false)
    }

    function releaseKeys() {
      if (helixHeldKeysRef.current.size === 0) return
      helixHeldKeysRef.current.clear()
      sendKeyboard()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', releaseKeys)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', releaseKeys)
      releaseKeys()
    }
  }, [game, view])

  useEffect(() => {
    if (game !== 'duel-de-troncs') return

    function sendKeyboard(code?: string, pressed?: boolean) {
      frameRef.current?.contentWindow?.postMessage({
        type: 'duel-de-troncs:keyboard',
        ...(code ? { code, pressed } : { reset: true }),
      }, window.location.origin)
    }

    function onKeyDown(event: KeyboardEvent) {
      const current = roomRef.current
      const control = trunkKeyboardActions[event.code]
      if (!control || current?.game !== game || current.phase !== 'running') return
      event.preventDefault()
      if (control.slot !== current.yourSlot || event.repeat || trunkHeldKeysRef.current.has(event.code)) return
      trunkHeldKeysRef.current.add(event.code)
      sendKeyboard(event.code, true)
    }

    function onKeyUp(event: KeyboardEvent) {
      if (!trunkHeldKeysRef.current.delete(event.code)) return
      event.preventDefault()
      sendKeyboard(event.code, false)
    }

    function releaseKeys() {
      if (trunkHeldKeysRef.current.size === 0) return
      trunkHeldKeysRef.current.clear()
      sendKeyboard()
    }

    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('keyup', onKeyUp, true)
    window.addEventListener('blur', releaseKeys)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('keyup', onKeyUp, true)
      window.removeEventListener('blur', releaseKeys)
      releaseKeys()
    }
  }, [game])

  useEffect(() => {
    const socket = io(socketUrl, { reconnection: true, reconnectionAttempts: 8, timeout: 8000 })
    socketRef.current = socket
    socket.on('connect', () => {
      setConnected(true)
      setFeedback('')
      const publicJoinKey = publicJoin?.game === game
        ? `${game}:${publicJoin.code}:${publicJoin.stake}`
        : ''
      if (publicJoin && publicJoin.game === game
        && publicJoinKey && attemptedPublicJoinRef.current !== publicJoinKey) {
        attemptedPublicJoinRef.current = publicJoinKey
        socket.emit('arena:room:join', {
          game,
          code: publicJoin.code,
          stake: publicJoin.stake,
          name: nicknameRef.current,
          walletId: getDemoWalletId(),
        }, (result: Ack) => {
          if (!result?.ok) setFeedback(result.error ?? 'Impossible de rejoindre ce salon.')
        })
        return
      }
      const saved = window.sessionStorage.getItem(`arcade-online-${game}`)
      if (!saved) {
        if (roomRef.current) {
          roomRef.current = null
          setRoom(null)
          setView('home')
          enabledRoundRef.current = ''
        }
        return
      }
      try {
        socket.emit('arena:room:reconnect', JSON.parse(saved), (result: Ack) => {
          if (!result?.ok) {
            window.sessionStorage.removeItem(`arcade-online-${game}`)
            roomRef.current = null
            setRoom(null)
            setView('home')
            enabledRoundRef.current = ''
            setFeedback(result?.error ?? 'La salle précédente n’est plus disponible.')
          }
        })
      } catch (error) {
        window.sessionStorage.removeItem(`arcade-online-${game}`)
        console.warn('Stored arcade room data could not be read:', error)
        setFeedback('Les informations de reconnexion sont invalides.')
      }
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', (error: Error) => {
      setConnected(false)
      setFeedback(`Serveur multijoueur inaccessible : ${error.message}`)
    })
    socket.on('arena:state', (next: Room) => {
      const localRoom = next.countdownRemainingMs === null
        ? next
        : { ...next, countdownEndsAt: Date.now() + next.countdownRemainingMs }
      roomRef.current = localRoom
      setRoom(localRoom)
      if (localRoom.phase === 'countdown') setClock(Date.now())
      if (next.phase !== 'running') finishRequestedRef.current = false
      setView(next.phase === 'running' || next.phase === 'paused'
        || next.phase === 'finished' && (game === 'princess-race' || game === 'damned-maze'
          || game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon'
          || game === 'moto-taxi-afrique' || game === 'chemin-de-couleurs'
        || game === 'duel-de-cartes' || game === 'ghasaq' || isMinimalRoomGame(game)
        || isSuppliedRunGame(game)) ? 'game' : 'lobby')
      if (next.phase === 'running' || next.phase === 'paused') {
        frameRef.current?.contentWindow?.postMessage({
          type: `${getBridgeName(game)}:${next.phase === 'paused' ? 'pause' : 'resume'}`,
        }, window.location.origin)
      }
    })
    socket.on('arena:room:joined', ({ code, token }: { code: string; token: string }) => {
      window.sessionStorage.setItem(`arcade-online-${game}`, JSON.stringify({ code, token }))
    })
    socket.on('arena:demo-wallet', ({ balance }: { balance: number }) => {
      if (Number.isFinite(balance)) walletBalanceCallbackRef.current?.(balance)
    })
    socket.on('arena:remote-input', ({ slot, input }: { slot: number; input: unknown }) => {
      const current = roomRef.current
      if (current?.game !== game) return
      if (isMinimalRoomGame(game)) {
        if (slot === current.yourSlot) return
      } else if (game === 'arena-helice' || game === 'moto-taxi-afrique') {
        if (slot === current.yourSlot) return
      } else if (slot !== 1 && game !== 'ghasaq') return
      frameRef.current?.contentWindow?.postMessage({ type: `${getBridgeName(game)}:remote-input`, input }, window.location.origin)
    })
    socket.on('arena:expired', ({ message }: { message?: string }) => {
      window.sessionStorage.removeItem(`arcade-online-${game}`)
      roomRef.current = null
      setRoom(null)
      setView('home')
      setFeedback(message ?? 'Le salon a expiré.')
    })
    socket.on('arena:closed', ({ reason }: { reason?: string } = {}) => {
      window.sessionStorage.removeItem(`arcade-online-${game}`)
      roomRef.current = null
      setRoom(null)
      setView('home')
      setFeedback(reason ?? 'La salle a été fermée.')
    })
    return () => {
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
      roomRef.current = null
    }
  }, [game, publicJoin, publicJoin?.code, publicJoin?.game, publicJoin?.stake])

  useEffect(() => {
    if (room?.phase !== 'countdown') return
    const timer = window.setInterval(() => setClock(Date.now()), 150)
    return () => window.clearInterval(timer)
  }, [room?.phase])

  useEffect(() => {
    const current = room
    if (!current || !['running', 'finished'].includes(current.phase) || !frameRef.current?.contentWindow) return
    if (usesInjectedBridge(game) && !frameBridgeReadyRef.current) return
    const roundKey = `${current.code}-${current.round}`
    if (current.phase === 'running' && enabledRoundRef.current !== roundKey) {
      enabledRoundRef.current = roundKey
      frameRef.current.contentWindow.postMessage({
        type: `${getBridgeName(game)}:enable`,
        slot: current.yourSlot,
        mode: current.ghasaqMode,
        phase: current.phase,
        seed: current.seed,
        startConfig: getGhasaqStartConfig(current.gameState),
        names: current.players.map((player) => player.name),
      }, window.location.origin)
    }
    if (current.gameState) {
      frameRef.current.contentWindow.postMessage({
        type: `${getBridgeName(game)}:state`,
        state: current.gameState,
        slot: current.yourSlot,
        phase: current.phase,
        result: {
          code: current.code,
          round: current.round,
          yourSlot: current.yourSlot,
          winnerSlot: current.winnerSlot,
          stake: current.stake,
          payout: current.payout,
          players: current.players,
        },
      }, window.location.origin)
    }
  }, [game, room])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== frameRef.current?.contentWindow || event.origin !== window.location.origin) return
      const message = event.data as { type?: unknown; state?: unknown; input?: unknown } | null
      if (!message || typeof message.type !== 'string') return
      const current = roomRef.current
      const socket = socketRef.current
      if (!current || !socket) return
      if (game === 'damned-maze' && current.phase === 'finished' && message.type === 'damned-maze:lobby') {
        setView('lobby')
        return
      }
      if (game === 'damned-maze' && current.phase === 'finished' && message.type === 'damned-maze:rematch') {
        socket.emit('arena:room:rematch', {}, (result: Ack) => {
          if (!result?.ok) setFeedback(result?.error ?? 'Impossible de relancer la partie.')
        })
        return
      }
      if ((game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon'
        || game === 'arena-helice' || game === 'duel-de-troncs'
        || game === 'moto-taxi-afrique' || game === 'chemin-de-couleurs'
        || game === 'duel-de-cartes')
        && current.phase === 'finished' && message.type === `${getBridgeName(game)}:rematch`) {
        socket.emit('arena:room:rematch', {}, (result: Ack) => {
          if (!result?.ok) setFeedback(result?.error ?? 'Impossible de relancer la partie.')
        })
        return
      }
      if (!socket.connected || current.phase !== 'running'
        && !(game === 'princess-race' && current.phase === 'finished')
        && !((game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon'
          || game === 'moto-taxi-afrique' || game === 'chemin-de-couleurs'
          || game === 'duel-de-cartes' || isMinimalRoomGame(game)) && current.phase === 'finished')) return
      if (message.type === `${getBridgeName(game)}:input`) {
        if (game === 'dashbot'
          && message.input && (message.input as { type?: unknown }).type === 'rematch_request') {
          socket.emit('arena:room:rematch', {}, (result: Ack) => {
            if (!result?.ok) setFeedback(result.error ?? 'Impossible de relancer la partie.')
          })
          return
        }
        socket.emit('arena:input', { input: message.input }, (result: Ack) => {
          if (!result?.ok) {
            if (game === 'chess-3d') {
              frameRef.current?.contentWindow?.postMessage({
                type: 'chess-3d:input-rejected',
              }, window.location.origin)
            }
            if (game === 'princess-race') {
              frameRef.current?.contentWindow?.postMessage({
                type: 'princess-race:rejected',
                error: result?.error ?? 'Action refusée par le serveur.',
              }, window.location.origin)
            } else if (game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon'
              || game === 'arena-helice' || game === 'duel-de-troncs') {
              setFeedback(result?.error ?? 'Le serveur a refusé cette commande.')
            } else if (game === 'ghasaq' && message.input && (message.input as { type?: unknown }).type !== 'snapshot') {
              setFeedback(result?.error ?? 'Le serveur a refusé cette commande.')
            }
          }
        })
      } else if (game === 'princess-race' && message.type === 'princess-race:rematch') {
        socket.emit('arena:room:rematch', {}, (result: Ack) => {
          if (!result?.ok) setFeedback(result.error ?? 'Impossible de relancer la partie.')
        })
      } else if (message.type === `${getBridgeName(game)}:state` && game === 'counter-siege') {
        socket.emit('arena:input', { input: message.state }, (result: Ack) => {
          if (!result?.ok) setFeedback(result.error ?? 'La synchronisation du joueur a été refusée.')
        })
      } else if (message.type === `${getBridgeName(game)}:state`) {
        socket.emit('arena:state', { state: message.state }, (result: Ack) => {
          if (!result?.ok && game === 'embuscade' && result.error) setFeedback(result.error)
        })
        const state = message.state as { status?: unknown; state?: unknown } | null
        const hasFinished = game === 'basketball-stars'
          ? state?.status === 'finished'
          : game === 'ping-pong' && state?.state === 'over'
        if (hasFinished && !finishRequestedRef.current) {
          finishRequestedRef.current = true
          socket.emit('arena:room:finish')
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [game])

  async function perform(event: string, payload: object = {}) {
    const socket = socketRef.current
    if (!socket?.connected) {
      setFeedback('Le serveur multijoueur n’est pas connecté.')
      return null
    }
    try {
      setFeedback('')
      return await emitAck(socket, event, payload)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'La demande a échoué.')
      return null
    }
  }

  function sendFrameKey(key: string, code: string, pressed: boolean) {
    const frame = frameRef.current?.contentWindow
    if (!frame) return
    frame.dispatchEvent(new KeyboardEvent(pressed ? 'keydown' : 'keyup', {
      key,
      code,
      bubbles: true,
      cancelable: true,
    }))
  }

  function holdFrameKey(key: string, code: string, event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    sendFrameKey(key, code, true)
  }

  function releaseFrameKey(key: string, code: string) {
    sendFrameKey(key, code, false)
  }

  function sendHelixTouchInput() {
    let x = 0
    let z = 0
    let jump = false
    for (const action of helixTouchPointersRef.current.values()) {
      if (action === 'left') x -= 1
      else if (action === 'right') x += 1
      else if (action === 'up') z -= 1
      else if (action === 'down') z += 1
      else jump = true
    }
    const magnitude = Math.hypot(x, z)
    if (magnitude > 1) {
      x /= magnitude
      z /= magnitude
    }
    void perform('arena:input', { input: { x, z, jump } })
  }

  function startHelixTouch(action: 'left' | 'right' | 'up' | 'down' | 'jump', event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    helixTouchPointersRef.current.set(event.pointerId, action)
    sendHelixTouchInput()
  }

  function stopHelixTouch(event: PointerEvent<HTMLButtonElement>) {
    if (!helixTouchPointersRef.current.delete(event.pointerId)) return
    sendHelixTouchInput()
  }

  async function createRoom() {
    const result = await perform('arena:room:create', {
      game,
      ...(game === 'ghasaq' ? { ghasaqMode } : {}),
      name: nickname,
      walletId: getDemoWalletId(),
      isPublic: isPublicFreeRace(game) ? publicRoom : isFreeOnlyGame(game) ? false : publicRoom,
      stake: isFreeOnlyGame(game) ? 0 : Number(stake),
    })
    if (result) setView('lobby')
  }

  async function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await perform('arena:room:join', {
      game,
      code: codeInput,
      name: nickname,
      walletId: getDemoWalletId(),
      stake: isFreeOnlyGame(game) ? 0 : Number(joinStake),
    })
    if (result) setView('lobby')
  }

  async function toggleReady() {
    if (!room) return
    await perform('arena:room:ready', {
      ready: !room.players.find((player) => player.you)?.ready,
    })
  }

  async function requestRematch() {
    await perform('arena:room:rematch')
  }

  async function leaveRoom() {
    await perform('arena:room:leave')
    window.sessionStorage.removeItem(`arcade-online-${game}`)
    roomRef.current = null
    setRoom(null)
    setView('home')
    enabledRoundRef.current = ''
  }

  async function copyCode() {
    if (!room) return
    try {
      await navigator.clipboard.writeText(room.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch (error) {
      console.error('Unable to copy the arcade room code:', error)
      setFeedback('Impossible de copier le code. Sélectionnez-le pour le copier manuellement.')
    }
  }

  const ownPlayer = room?.players.find((player) => player.you)
  const finishedRoom = room?.phase === 'finished' ? room : null
  const finalScores = finishedRoom ? getScores(finishedRoom.gameState, game) : null
  const gameStateWinner = finishedRoom?.gameState && typeof finishedRoom.gameState === 'object'
    ? (finishedRoom.gameState as { winner?: unknown }).winner
    : null
  const reportedWinnerSlot = finishedRoom?.winnerSlot === 0 || finishedRoom?.winnerSlot === 1
    ? finishedRoom.winnerSlot
    : gameStateWinner === 0 || gameStateWinner === 1 ? gameStateWinner : null
  const mazeState = finishedRoom && game === 'damned-maze'
    ? finishedRoom.gameState as { winner?: number | null; level?: number; result?: string }
    : null
  const mazeOutcome = mazeState
    ? mazeState.winner === null || mazeState.winner === undefined
      ? 'Égalité'
      : mazeState.winner === finishedRoom?.yourSlot ? 'Victoire' : 'Défaite'
    : null
  const resultTitle = finalScores && finishedRoom
    ? reportedWinnerSlot !== null
      ? reportedWinnerSlot === finishedRoom.yourSlot ? 'Victoire' : 'Défaite'
      : finalScores[finishedRoom.yourSlot] === finalScores[1 - finishedRoom.yourSlot]
        ? 'Égalité'
        : finalScores[finishedRoom.yourSlot] > finalScores[1 - finishedRoom.yourSlot] ? 'Victoire' : 'Défaite'
    : null
  const seconds = room?.countdownEndsAt
    ? clock ? Math.max(1, Math.ceil((room.countdownEndsAt - clock) / 1000)) : game === 'forest-bridge' ? 1 : 10
    : null
  const details = gameDetails[game]
  const caveTouchKeys = view === 'local'
    ? [
        { label: 'J1 ↑', key: 'w', code: 'KeyW' },
        { label: 'J1 ↓', key: 's', code: 'KeyS' },
        { label: 'J2 ↑', key: 'i', code: 'KeyI' },
        { label: 'J2 ↓', key: 'k', code: 'KeyK' },
      ]
    : [
        {
          label: '↑',
          key: room?.yourSlot === 1 ? 'ArrowUp' : view === 'solo' ? 'ArrowUp' : 'w',
          code: room?.yourSlot === 1 || view === 'solo' ? 'ArrowUp' : 'KeyW',
        },
        {
          label: '↓',
          key: room?.yourSlot === 1 || view === 'solo' ? 'ArrowDown' : 's',
          code: room?.yourSlot === 1 || view === 'solo' ? 'ArrowDown' : 'KeyS',
        },
      ]

  return (
    <section className={`arcade-online-screen${game === 'princess-race' ? ' arcade-online-screen--princess' : ''}${game === 'colonnes-du-canyon' ? ' arcade-online-screen--canyon' : ''}`} aria-label={`Salon ${details.title}`}>
      {view === 'solo' || view === 'local' || view === 'game' && (room?.phase === 'running' || room?.phase === 'paused' || room?.phase === 'finished' && (game === 'princess-race' || game === 'damned-maze' || game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon' || game === 'arena-helice' || game === 'duel-de-troncs' || game === 'moto-taxi-afrique' || game === 'chemin-de-couleurs' || game === 'duel-de-cartes' || game === 'ghasaq' || isMinimalRoomGame(game) || isSuppliedRunGame(game))) ? (
        <>
          <iframe
            ref={frameRef}
            className="arcade-game-frame"
            src={`/games/${getGameFile(game)}${game === 'ghasaq' || isMinimalRoomGame(game) ? '' : '.html'}${game === 'colonnes-du-canyon' ? '?v=canyon-fullscreen-20261111' : game === 'grotte-aux-couteaux' ? '?v=mobile-portrait-2' : ''}`}
            title={details.title}
            onLoad={() => {
              const frame = frameRef.current?.contentWindow
              if (usesInjectedBridge(game) && frame) {
                frameBridgeReadyRef.current = false
                const script = frame.document.createElement('script')
                script.src = getInjectedBridgeFile(game)
                script.onload = () => {
                  frameBridgeReadyRef.current = true
                  const current = roomRef.current
                  if (isMinimalRoomGame(game) && view === 'solo') {
                    frame.postMessage({ type: `${getBridgeName(game)}:solo` }, window.location.origin)
                    return
                  }
                  if (!current || !['running', 'paused', 'finished'].includes(current.phase)) return
                  enabledRoundRef.current = `${current.code}-${current.round}`
                  frame.postMessage({
                    type: `${getBridgeName(game)}:enable`,
                    slot: current.yourSlot,
                    mode: current.ghasaqMode,
                    phase: current.phase,
                    seed: current.seed,
                    startConfig: getGhasaqStartConfig(current.gameState),
                    names: current.players.map((player) => player.name),
                  }, window.location.origin)
                  if (current.gameState) {
                    frame.postMessage({
                      type: `${getBridgeName(game)}:state`,
                      state: current.gameState,
                      slot: current.yourSlot,
                      phase: current.phase,
                      names: current.players.map((player) => player.name),
                    }, window.location.origin)
                  }
                  if (current.phase === 'paused') {
                    frame.postMessage({ type: `${getBridgeName(game)}:pause` }, window.location.origin)
                  }
                }
                script.onerror = () => setFeedback(`Le pont multijoueur de ${details.title} n’a pas pu être chargé.`)
                frame.document.head.append(script)
                return
              }
              frameBridgeReadyRef.current = true
              if (view === 'local' && game === 'damned-maze') {
                frameRef.current?.contentWindow?.postMessage({ type: 'damned-maze:local' }, window.location.origin)
                return
              }
              if (game === 'princess-race' && view === 'local') {
                frameRef.current?.contentWindow?.postMessage({ type: 'princess-race:local' }, window.location.origin)
                return
              }
              if (view === 'local' && (game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon')) {
                frameRef.current?.contentWindow?.postMessage({ type: `${getBridgeName(game)}:local` }, window.location.origin)
                return
              }
              if (view === 'local' && (game === 'arena-helice' || game === 'duel-de-troncs')) {
                frameRef.current?.contentWindow?.postMessage({ type: `${getBridgeName(game)}:local` }, window.location.origin)
                return
              }
              const current = roomRef.current
              if (game === 'grotte-aux-couteaux' && view === 'solo') {
                frameRef.current?.contentWindow?.postMessage({ type: 'grotte-aux-couteaux:solo' }, window.location.origin)
                return
              }
              if (game === 'colonnes-du-canyon' && view === 'solo') {
                frameRef.current?.contentWindow?.postMessage({ type: 'colonnes-du-canyon:solo' }, window.location.origin)
                return
              }
              if ((game === 'arena-helice' || game === 'duel-de-troncs') && view === 'solo') {
                frameRef.current?.contentWindow?.postMessage({ type: `${getBridgeName(game)}:solo` }, window.location.origin)
                return
              }
              if (game === 'princess-race' && view === 'solo') {
                frameRef.current?.contentWindow?.postMessage({ type: 'princess-race:solo' }, window.location.origin)
                return
              }
              if (!current || !['running', 'paused', 'finished'].includes(current.phase)) return
              enabledRoundRef.current = ''
              frameRef.current?.contentWindow?.postMessage({
                type: `${getBridgeName(game)}:enable`,
                slot: current.yourSlot,
                phase: current.phase,
                seed: current.seed,
                names: current.players.map((player) => player.name),
              }, window.location.origin)
              enabledRoundRef.current = `${current.code}-${current.round}`
              if (current.gameState) {
                frameRef.current?.contentWindow?.postMessage({
                  type: `${getBridgeName(game)}:state`,
                  state: current.gameState,
                  slot: current.yourSlot,
                  phase: current.phase,
                  names: current.players.map((player) => player.name),
                  result: {
                    code: current.code,
                    round: current.round,
                    yourSlot: current.yourSlot,
                    winnerSlot: current.winnerSlot,
                    stake: current.stake,
                    payout: current.payout,
                    players: current.players,
                  },
                }, window.location.origin)
              }
              if (current.phase === 'paused') {
                frameRef.current?.contentWindow?.postMessage({ type: `${getBridgeName(game)}:pause` }, window.location.origin)
              }
            }}
          />
          <header className="arcade-game-topbar">
            <button type="button" className="arcade-back-button" aria-label={view === 'solo' || view === 'local' ? 'Retour' : 'Quitter'} onClick={view === 'solo' || view === 'local' ? () => setView('home') : leaveRoom}><ArrowLeft size={17} /><span>{view === 'solo' || view === 'local' ? 'Retour' : 'Quitter'}</span></button>
            <div className="arcade-match-label"><i /> {details.label}{room && view !== 'solo' && view !== 'local' ? ` · ${room.ghasaqMode === 'duel' && game === 'ghasaq' ? 'DUEL' : game === 'ghasaq' ? 'COOP' : `SALLE ${room.code}`}` : view === 'local' ? ' · LOCAL' : ' · SOLO'}</div>
            <span className="arcade-connection" title={connected ? 'Connecté' : 'Hors ligne'}>
              {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
            </span>
          </header>
          {game === 'ghasaq' && room?.phase === 'finished' && (
            <div className="arcade-princess-result" role="status">
              <strong>{room.ghasaqMode === 'duel'
                ? room.winnerSlot === room.yourSlot ? 'Victoire — vous avez éliminé votre adversaire !' : 'Défaite — votre adversaire a gagné le duel.'
                : 'Mission coopérative terminée'}</strong>
              <span>{room.ghasaqMode === 'duel' ? 'Le duel est terminé.' : 'La partie partagée est terminée.'}</span>
              <button type="button" className="arcade-primary-button" disabled={!connected || ownPlayer?.ready} onClick={requestRematch}>
                {ownPlayer?.ready ? 'Revanche demandée' : 'Rejouer'}
              </button>
            </div>
          )}
          {isSuppliedRunGame(game) && room?.phase === 'finished' && (
            <div className="arcade-princess-result" role="status">
              <strong>{room.winnerSlot === null
                ? 'Égalité — les deux parcours ont le même score.'
                : room.winnerSlot === room.yourSlot ? 'Victoire — votre parcours est le meilleur !' : 'Défaite — votre adversaire a fait le meilleur parcours.'}</strong>
              <span>{getScores(room.gameState, game)?.join(' : ') ?? '0 : 0'} points · parcours terminé</span>
              <button type="button" className="arcade-primary-button" disabled={!connected || ownPlayer?.ready} onClick={requestRematch}>
                {ownPlayer?.ready ? 'Revanche demandée' : 'Rejouer'}
              </button>
            </div>
          )}
          {room && view !== 'solo' && <div className="arcade-score-strip">
            {room.players.map((player) => (
              <span key={player.slot} className={player.you ? 'is-you' : ''}>
                <i className={player.connected ? 'is-connected' : ''} />{player.you ? 'Vous' : player.name}
                {(game === 'chess-3d' || game === 'embuscade' || isSuppliedRunGame(game)) && (() => {
                  const scores = getScores(room.gameState, game)
                  return scores ? ` · ${scores[player.slot]}${game === 'chess-3d' ? ' prises' : ' pts'}` : ''
                })()}
              </span>
            ))}
          </div>}
          {game === 'grotte-aux-couteaux' && (view === 'solo' || view === 'local' || room?.phase === 'running') && (
            <div className="arcade-action-pad arcade-arena-controls" aria-label="Commandes tactiles Grotte aux Couteaux">
              {caveTouchKeys.map(({ label, key, code }) => (
                <button
                  type="button"
                  key={label}
                  aria-label={view === 'local' ? `${label.includes('J1') ? 'Joueur 1' : 'Joueur 2'}, ${label.endsWith('↑') ? 'monter' : 'descendre'}` : label === '↑' ? 'Monter' : 'Descendre'}
                  onPointerDown={(event) => holdFrameKey(key, code, event)}
                  onPointerUp={() => releaseFrameKey(key, code)}
                  onPointerCancel={() => releaseFrameKey(key, code)}
                  onLostPointerCapture={() => releaseFrameKey(key, code)}
                >{label}</button>
              ))}
            </div>
          )}
          {game === 'ball-rush' && (view === 'solo' || view === 'local' || room?.phase === 'running') && (
            <div className="arcade-action-pad" aria-label="Commandes tactiles Ball Rush">
              {[
                { label: 'Gauche', key: 'ArrowLeft', code: 'ArrowLeft' },
                { label: 'Droite', key: 'ArrowRight', code: 'ArrowRight' },
                { label: 'Sauter', key: 'ArrowUp', code: 'ArrowUp' },
                { label: 'Glisser', key: 'ArrowDown', code: 'ArrowDown' },
                { label: 'Hoverboard', key: ' ', code: 'Space' },
              ].map(({ label, key, code }) => (
                <button
                  type="button"
                  key={label}
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.currentTarget.setPointerCapture(event.pointerId)
                    sendFrameKey(key, code, true)
                  }}
                  onPointerUp={() => sendFrameKey(key, code, false)}
                  onPointerCancel={() => sendFrameKey(key, code, false)}
                  onLostPointerCapture={() => sendFrameKey(key, code, false)}
                >{label}</button>
              ))}
            </div>
          )}
          {game === 'arena-helice' && room?.phase === 'running' && (
            <div className="arcade-action-pad arcade-arena-controls" aria-label={`Commandes tactiles du joueur ${room.yourSlot + 1}`}>
              <span>J{room.yourSlot + 1}</span>
              {([
                ['left', '←', 'Gauche'],
                ['down', '↓', 'Bas'],
                ['up', '↑', 'Haut'],
                ['right', '→', 'Droite'],
                ['jump', 'SAUT', 'Sauter'],
              ] as const).map(([action, label, description]) => (
                <button
                  type="button"
                  key={action}
                  aria-label={description}
                  onPointerDown={(event) => startHelixTouch(action, event)}
                  onPointerUp={stopHelixTouch}
                  onPointerCancel={stopHelixTouch}
                  onLostPointerCapture={stopHelixTouch}
                >{label}</button>
              ))}
            </div>
          )}
          {game === 'duel-de-troncs' && room?.phase === 'running' && (
            <div className="arcade-action-pad arcade-arena-controls" aria-label={`Commandes tactiles du joueur ${room.yourSlot + 1}`}>
              <span>J{room.yourSlot + 1}</span>
              {([
                ['left', '←', 'Aller à gauche'],
                ['jump', 'SAUT', 'Sauter'],
                ['right', '→', 'Aller à droite'],
              ] as const).map(([action, label, description]) => (
                <button
                  type="button"
                  key={action}
                  aria-label={description}
                  onPointerDown={(event) => {
                    event.preventDefault()
                    void perform('arena:input', { input: { action } })
                  }}
                >{label}</button>
              ))}
            </div>
          )}
              {(game === 'princess-race' || game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon' || game === 'arena-helice' || game === 'duel-de-troncs' || game === 'moto-taxi-afrique' || game === 'chemin-de-couleurs' || game === 'duel-de-cartes')
                && room?.phase === 'finished' && (
                <div className="arcade-princess-result" role="status">
                  <strong>{game === 'moto-taxi-afrique'
                    ? room.winnerSlot === room.yourSlot ? 'Victoire — vous avez livré le premier !' : 'Défaite — votre adversaire a terminé la course en premier.'
                    : game === 'chemin-de-couleurs'
                      ? room.winnerSlot === null ? 'Égalité — vous avez atteint le même niveau.' : room.winnerSlot === room.yourSlot ? 'Victoire — vous avez mémorisé le plus long chemin !' : 'Défaite — votre adversaire a mémorisé le plus long chemin.'
                      : game === 'duel-de-cartes'
                        ? room.winnerSlot === null ? 'Égalité parfaite !' : room.winnerSlot === room.yourSlot ? 'Victoire — votre main était la plus forte !' : 'Défaite — votre adversaire remporte le duel.'
                    : game === 'princess-race'
                    ? room.winnerSlot === room.yourSlot ? 'Victoire — la princesse est sauvée !' : 'Défaite — votre adversaire a gagné.'
                    : game === 'colonnes-du-canyon'
                      ? room.winnerSlot === room.yourSlot ? 'Victoire — vous avez atteint le gâteau en premier !' : 'Défaite — votre adversaire a atteint le gâteau.'
                      : game === 'arena-helice'
                        ? room.winnerSlot === room.yourSlot ? 'Victoire — vous avez dominé l’Arène Hélice !' : 'Défaite — l’adversaire a survécu à l’hélice.'
                        : game === 'duel-de-troncs'
                          ? room.winnerSlot === room.yourSlot ? 'Victoire — vous avez grimpé plus haut !' : 'Défaite — l’adversaire a gagné le duel.'
                      : room.winnerSlot === room.yourSlot ? 'Victoire — vous avez survécu à la grotte !' : 'Défaite — votre adversaire a survécu.'}</strong>
                  <span>{room.stake ? `Pot de ${room.payout?.toLocaleString('fr-FR') ?? 0} crédits démo` : 'Partie terminée'}</span>
                  {room.payout && room.winnerSlot === room.yourSlot && <b>+{room.payout.toLocaleString('fr-FR')} crédits démo versés</b>}
                  <button type="button" className="arcade-primary-button" disabled={!connected || ownPlayer?.ready} onClick={requestRematch}>
                    {ownPlayer?.ready ? 'Revanche demandée' : 'Rejouer'}
                  </button>
                </div>
              )}
          {room?.phase === 'paused' && (
            <div className="arcade-disconnect-notice" role="status">
              <WifiOff size={17} /> Connexion interrompue — la manche reprendra après reconnexion.
            </div>
          )}
        </>
      ) : (
        <div className="arcade-lobby">
          <header className="arcade-lobby-header">
            <button type="button" className="arcade-back-button" onClick={room ? leaveRoom : onClose}><ArrowLeft size={17} /> Retour</button>
            <span>{details.label} · {game === 'ghasaq' ? 'COOPÉRATION / DUEL' : 'DUEL EN LIGNE'}</span>
            <span className={`arcade-connection ${connected ? 'is-connected' : ''}`}>
              {connected ? <Wifi size={16} /> : <WifiOff size={16} />} {connected ? 'Connecté' : 'Hors ligne'}
            </span>
          </header>
          <main className="arcade-lobby-card">
            <span className="arcade-lobby-eyebrow"><Users size={15} /> {game === 'ghasaq' ? '2 JOUEURS · EN LIGNE' : '1 CONTRE 1 · EN LIGNE'}</span>
            <h1>{room && game === 'ghasaq'
              ? room.ghasaqMode === 'duel' ? 'Salon de duel' : 'Salon coopératif'
              : room ? 'Salon de duel' : 'Jouez à deux'}</h1>
            <GameControlsGuide
              game={game}
              playerSlot={room ? room.yourSlot === 1 ? 1 : 0 : null}
            />
            {!room ? (
              <>
                {game === 'ghasaq' && (
                  <label className="arcade-field">Mode multijoueur
                    <select value={ghasaqMode} onChange={(event) => setGhasaqMode(event.target.value as 'coop' | 'duel')}>
                      <option value="coop">Coopération — vagues d’ennemis partagées</option>
                      <option value="duel">Duel — combat entre joueurs</option>
                    </select>
                  </label>
                )}
                <label className="arcade-field">
                  Votre pseudo
                  <input value={nickname} maxLength={18} onChange={(event) => setNickname(event.target.value)} placeholder="Joueur" />
                </label>
                {game === 'duel-de-cartes'
                ? <button type="button" className="arcade-secondary-button" onClick={() => setView('local')}>Jouer à deux en local</button>
                : <button type="button" className="arcade-secondary-button" onClick={() => setView('solo')}>Jouer en solo</button>}
                {!isMinimalRoomGame(game) && ['damned-maze', 'princess-race', 'grotte-aux-couteaux', 'colonnes-du-canyon', 'arena-helice', 'duel-de-troncs', 'moto-taxi-afrique'].includes(game) && <button type="button" className="arcade-secondary-button" onClick={() => setView('local')}>Jouer en local à deux</button>}
                {isSuppliedRunGame(game) && <p className="arcade-lobby-hint">Duel gratuit : jouez chacun votre parcours et comparez vos scores en direct.</p>}
                {isPublicFreeRace(game) && (
                  <label className="arcade-public-toggle">
                    <input type="checkbox" checked={publicRoom} onChange={(event) => setPublicRoom(event.target.checked)} />
                    Afficher mon salon gratuit sur l’accueil
                  </label>
                )}
                {!isFreeOnlyGame(game) && <>
                  <label className="arcade-field">Mise en crédits démo
                    <input type="number" min="1" max="1000000" step="1" value={stake} onChange={(event) => setStake(event.target.value)} />
                  </label>
                  <label className="arcade-public-toggle">
                    <input type="checkbox" checked={publicRoom} onChange={(event) => setPublicRoom(event.target.checked)} />
                    Afficher mon salon sur l’accueil
                  </label>
                </>}
                <button type="button" className="arcade-primary-button" disabled={!connected} onClick={createRoom}>Créer une salle</button>
                <button type="button" className="arcade-secondary-button" disabled={!connected} onClick={() => { setView('join'); setFeedback('') }}>Rejoindre une salle</button>
                {view === 'join' && (
                  <form className="arcade-join-form" onSubmit={joinRoom}>
                    <label className="arcade-field">Code de la salle
                      <input value={codeInput} maxLength={6} onChange={(event) => setCodeInput(event.target.value.toUpperCase())} placeholder="ABC123" />
                    </label>
                    {!isFreeOnlyGame(game) && <label className="arcade-field">Mise identique en crédits démo
                      <input type="number" min="0" max="1000000" step="1" value={joinStake} onChange={(event) => setJoinStake(event.target.value)} />
                    </label>}
                    <button type="submit" className="arcade-primary-button" disabled={!connected || codeInput.length !== 6}>Rejoindre</button>
                  </form>
                )}
              </>
            ) : (
              <>
                <div className="arcade-room-code"><strong>{room.code}</strong><button type="button" onClick={copyCode}>{copied ? <Check size={17} /> : <Clipboard size={17} />}{copied ? 'Copié' : 'Copier'}</button></div>
                <p className="arcade-lobby-hint">
                  {game === 'ghasaq'
                    ? room.ghasaqMode === 'duel' ? 'Duel en ligne · premier joueur éliminé perd' : 'Coopération · vagues partagées contre les ennemis'
                    : isSuppliedRunGame(game)
                      ? `${room.isPublic ? 'Salon gratuit visible sur l’accueil' : 'Salon gratuit privé'} · jouez dans la même course et voyez votre adversaire.`
                    : isMinimalRoomGame(game)
                      ? 'Salon privé · partagez le code pour inviter un adversaire.'
                      : `${room.isPublic ? 'Salon public · visible sur l’accueil' : 'Salon privé'} · Mise démo ${(room.stake ?? 0).toLocaleString('fr-FR')} crédits · Pot démo ${((room.stake ?? 0) * 2).toLocaleString('fr-FR')} crédits`}
                </p>
                {room.phase === 'finished' && finalScores && resultTitle && (
                  <div className={`arcade-result-score ${resultTitle === 'Victoire' ? 'is-win' : resultTitle === 'Défaite' ? 'is-loss' : 'is-draw'}`}>
                    <strong>{resultTitle}</strong>
                    <span>{finalScores[room.yourSlot]} <i>:</i> {finalScores[1 - room.yourSlot]}</span>
                    {room.payout && room.winnerSlot === room.yourSlot
                      ? <b>🪙 +{room.payout.toLocaleString('fr-FR')} crédits démo</b>
                      : room.stake ? <b>{room.payout ? 'Gain attribué à l’adversaire' : 'Mise remboursée en crédits démo'}</b> : null}
                  </div>
                )}
                {room.phase === 'finished' && mazeOutcome && (
                  <div className={`arcade-result-score ${mazeOutcome === 'Victoire' ? 'is-win' : mazeOutcome === 'Défaite' ? 'is-loss' : 'is-draw'}`}>
                    <strong>{mazeOutcome}</strong>
                    <span>Niveau atteint : {mazeState?.level ?? 1}</span>
                    <b>{mazeState?.result === 'opponent-disconnected' ? 'Le joueur adverse ne s’est pas reconnecté à temps.' : 'La partie est terminée.'}</b>
                  </div>
                )}
                <div className="arcade-player-list">
                  {[0, 1].map((slot) => {
                    const player = room.players.find((entry) => entry.slot === slot)
                    return <div key={slot}><i className={player?.connected ? 'is-connected' : ''} /><span><b>{player?.you ? 'Vous' : player?.name ?? `Joueur ${slot + 1}`}</b><small>{player ? (player.connected ? (player.ready ? 'Prêt' : 'Connecté') : 'Reconnexion…') : 'En attente…'}</small></span></div>
                  })}
                </div>
                {seconds ? <p className="arcade-countdown">Début dans <b>{seconds}</b></p> : room.phase === 'finished' ? (
                  <button type="button" className={`arcade-primary-button ${ownPlayer?.ready ? 'is-ready' : ''}`} disabled={!room.players[1] || !connected || ownPlayer?.ready} onClick={requestRematch}>
                    {ownPlayer?.ready ? 'Revanche demandée' : 'Demander la revanche'}
                  </button>
                ) : (
                  <button type="button" className={`arcade-primary-button ${ownPlayer?.ready ? 'is-ready' : ''}`} disabled={!room.players[1] || !connected} onClick={toggleReady}>
                    {ownPlayer?.ready ? 'Annuler prêt' : 'Je suis prêt'}
                  </button>
                )}
                <p className="arcade-lobby-hint">{room.phase === 'finished' ? 'La manche est terminée. Les deux joueurs peuvent demander une revanche.' : room.players[1] ? 'Les deux joueurs doivent être prêts.' : 'Partagez le code pour inviter un adversaire.'}</p>
              </>
            )}
            {feedback && <p className="arcade-feedback" role="status">{feedback}</p>}
            {!connected && !feedback && <p className="arcade-feedback"><LoaderCircle size={15} /> Connexion au serveur…</p>}
          </main>
        </div>
      )}
    </section>
  )
}
