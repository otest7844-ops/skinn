import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Clipboard, LoaderCircle, Users, Wifi, WifiOff } from 'lucide-react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import './ArcadeOnline.css'
import RoomCeremony from './RoomCeremony'
import { getMultiplayerUrl } from './multiplayer-url'
import { getDemoWalletId } from './demo-wallet'

export type ArcadeGameId = 'ping-pong' | 'basketball-stars' | 'ball-rush' | 'cannon-duel' | 'forest-bridge' | 'damned-maze' | 'princess-race' | 'grotte-aux-couteaux' | 'colonnes-du-canyon'

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
}
type Ack = { ok: boolean; error?: string; code?: string; token?: string }
type View = 'home' | 'join' | 'lobby' | 'game' | 'solo' | 'local'
type ScoreState = { score?: unknown; players?: unknown }

const socketUrl = getMultiplayerUrl()
const gameDetails: Record<ArcadeGameId, { title: string; label: string }> = {
  'ping-pong': { title: 'Ping Pong', label: 'PING-PONG' },
  'basketball-stars': { title: 'Basketball Stars', label: 'BASKETBALL' },
  'ball-rush': { title: 'Ball Rush 3D', label: 'BALL RUSH 3D' },
  'cannon-duel': { title: 'Canon Duel', label: 'CANON DUEL' },
  'forest-bridge': { title: 'Pont de la forêt 3D', label: 'PONT DE LA FORÊT 3D' },
  'damned-maze': { title: 'Le Labyrinthe des Damnés', label: 'LE LABYRINTHE DES DAMNÉS' },
  'princess-race': { title: 'La Course vers la Princesse', label: 'COURSE VERS LA PRINCESSE' },
  'grotte-aux-couteaux': { title: 'Grotte aux Couteaux', label: 'GROTTE AUX COUTEAUX' },
  'colonnes-du-canyon': { title: 'Colonnes du Canyon', label: 'COLONNES DU CANYON' },
}

function getBridgeName(game: ArcadeGameId) {
  return game === 'basketball-stars' ? 'basketball' : game
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
  if (Array.isArray(result.score) && result.score.length === 2
    && result.score.every((score): score is number => typeof score === 'number' && Number.isFinite(score))) {
    return [result.score[0], result.score[1]]
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
  const [feedback, setFeedback] = useState('')
  const [connected, setConnected] = useState(false)
  const [copied, setCopied] = useState(false)
  const [clock, setClock] = useState(0)
  const socketRef = useRef<Socket | null>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const roomRef = useRef<Room | null>(null)
  const enabledRoundRef = useRef('')
  const finishRequestedRef = useRef(false)
  const attemptedPublicJoinRef = useRef('')
  const cannonFireAtRef = useRef(0)
  const nicknameRef = useRef(nickname)
  const walletBalanceCallbackRef = useRef(onWalletBalance)
  nicknameRef.current = nickname
  walletBalanceCallbackRef.current = onWalletBalance

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
          || game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon') ? 'game' : 'lobby')
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
      if (slot !== 1 || roomRef.current?.game !== game) return
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
    const roundKey = `${current.code}-${current.round}`
    if (current.phase === 'running' && enabledRoundRef.current !== roundKey) {
      enabledRoundRef.current = roundKey
      frameRef.current.contentWindow.postMessage({
        type: `${getBridgeName(game)}:enable`,
        slot: current.yourSlot,
        phase: current.phase,
        seed: current.seed,
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
      if ((game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon')
        && current.phase === 'finished' && message.type === `${getBridgeName(game)}:rematch`) {
        socket.emit('arena:room:rematch', {}, (result: Ack) => {
          if (!result?.ok) setFeedback(result?.error ?? 'Impossible de relancer la partie.')
        })
        return
      }
      if (!socket.connected || current.phase !== 'running'
        && !(game === 'princess-race' && current.phase === 'finished')
        && !((game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon') && current.phase === 'finished')) return
      if (message.type === `${getBridgeName(game)}:input`) {
        socket.emit('arena:input', { input: message.input }, (result: Ack) => {
          if (!result?.ok) {
            if (game === 'princess-race') {
              frameRef.current?.contentWindow?.postMessage({
                type: 'princess-race:rejected',
                error: result?.error ?? 'Action refusée par le serveur.',
              }, window.location.origin)
            } else if (game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon') {
              setFeedback(result?.error ?? 'Le serveur a refusé cette commande.')
            }
          }
        })
      } else if (game === 'princess-race' && message.type === 'princess-race:rematch') {
        socket.emit('arena:room:rematch', {}, (result: Ack) => {
          if (!result?.ok) setFeedback(result.error ?? 'Impossible de relancer la partie.')
        })
      } else if (message.type === `${getBridgeName(game)}:state`) {
        socket.emit('arena:state', { state: message.state })
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

  async function fireCannon() {
    const now = performance.now()
    if (now - cannonFireAtRef.current < 1200) return
    cannonFireAtRef.current = now
    await perform('arena:input', { input: { type: 'fire' } })
  }

  async function createRoom() {
    const result = await perform('arena:room:create', {
      game,
      name: nickname,
      walletId: getDemoWalletId(),
      isPublic: publicRoom,
      stake: Number(stake),
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
      stake: Number(joinStake),
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
  const mazeState = finishedRoom && game === 'damned-maze'
    ? finishedRoom.gameState as { winner?: number | null; level?: number; result?: string }
    : null
  const mazeOutcome = mazeState
    ? mazeState.winner === null || mazeState.winner === undefined
      ? 'Égalité'
      : mazeState.winner === finishedRoom?.yourSlot ? 'Victoire' : 'Défaite'
    : null
  const resultTitle = finalScores && finishedRoom
    ? game === 'ball-rush' && (finishedRoom.winnerSlot === 0 || finishedRoom.winnerSlot === 1)
      ? finishedRoom.winnerSlot === finishedRoom.yourSlot ? 'Victoire' : 'Défaite'
      : finalScores[finishedRoom.yourSlot] === finalScores[1 - finishedRoom.yourSlot]
        ? 'Égalité'
        : finalScores[finishedRoom.yourSlot] > finalScores[1 - finishedRoom.yourSlot] ? 'Victoire' : 'Défaite'
    : null
  const gameStateWinner = finishedRoom?.gameState && typeof finishedRoom.gameState === 'object'
    ? (finishedRoom.gameState as { winner?: unknown }).winner
    : null
  const resolvedWinnerSlot = finishedRoom?.winnerSlot === 0 || finishedRoom?.winnerSlot === 1
    ? finishedRoom.winnerSlot
    : gameStateWinner === 0 || gameStateWinner === 1
      ? gameStateWinner
      : resultTitle === 'Victoire' || resultTitle === 'Défaite'
        ? resultTitle === 'Victoire' ? finishedRoom?.yourSlot ?? null : finishedRoom?.yourSlot === 0 ? 1 : 0
        : null
  const seconds = room?.countdownEndsAt
    ? clock ? Math.max(1, Math.ceil((room.countdownEndsAt - clock) / 1000)) : 3
    : null
  const details = gameDetails[game]

  return (
    <section className={`arcade-online-screen${game === 'princess-race' ? ' arcade-online-screen--princess' : ''}`} aria-label={`Salon ${details.title}`}>
      {view === 'solo' || view === 'local' || view === 'game' && (room?.phase === 'running' || room?.phase === 'paused' || room?.phase === 'finished' && (game === 'princess-race' || game === 'damned-maze' || game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon')) ? (
        <>
          <iframe
            ref={frameRef}
            className="arcade-game-frame"
            src={game === 'ping-pong' && view !== 'game'
              ? '/games/ping-pong.html'
              : `/games/${game === 'ping-pong' ? 'ping-pong-online' : game}.html`}
            title={details.title}
            onLoad={() => {
              if (view === 'local' && game === 'cannon-duel') {
                frameRef.current?.contentWindow?.postMessage({ type: 'cannon-duel:local' }, window.location.origin)
                return
              }
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
              const current = roomRef.current
              if (game === 'grotte-aux-couteaux' && view === 'solo') {
                frameRef.current?.contentWindow?.postMessage({ type: 'grotte-aux-couteaux:solo' }, window.location.origin)
                return
              }
              if (game === 'colonnes-du-canyon' && view === 'solo') {
                frameRef.current?.contentWindow?.postMessage({ type: 'colonnes-du-canyon:solo' }, window.location.origin)
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
            <button type="button" className="arcade-back-button" onClick={view === 'solo' || view === 'local' ? () => setView('home') : leaveRoom}><ArrowLeft size={17} /> {view === 'solo' || view === 'local' ? 'Retour' : 'Quitter'}</button>
            <div className="arcade-match-label"><i /> {details.label}{room && view !== 'solo' && view !== 'local' ? ` · SALLE ${room.code}` : view === 'local' ? ' · LOCAL' : ' · SOLO'}</div>
            <span className="arcade-connection" title={connected ? 'Connecté' : 'Hors ligne'}>
              {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
            </span>
          </header>
          {room && view !== 'solo' && <div className="arcade-score-strip">
            {room.players.map((player) => (
              <span key={player.slot} className={player.you ? 'is-you' : ''}>
                <i className={player.connected ? 'is-connected' : ''} />{player.you ? 'Vous' : player.name}
              </span>
            ))}
          </div>}
          {game === 'cannon-duel' && room?.phase === 'running' && (
            <button type="button" className="arcade-cannon-fire" onClick={() => void fireCannon()}>
              Tirer avec votre canon
            </button>
          )}
              {(game === 'princess-race' || game === 'grotte-aux-couteaux' || game === 'colonnes-du-canyon')
                && room?.phase === 'finished' && (
                <div className="arcade-princess-result" role="status">
                  <strong>{game === 'princess-race'
                    ? room.winnerSlot === room.yourSlot ? 'Victoire — la princesse est sauvée !' : 'Défaite — votre adversaire a gagné.'
                    : game === 'colonnes-du-canyon'
                      ? room.winnerSlot === room.yourSlot ? 'Victoire — vous avez atteint le gâteau en premier !' : 'Défaite — votre adversaire a atteint le gâteau.'
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
            <span>{details.label} · DUEL EN LIGNE</span>
            <span className={`arcade-connection ${connected ? 'is-connected' : ''}`}>
              {connected ? <Wifi size={16} /> : <WifiOff size={16} />} {connected ? 'Connecté' : 'Hors ligne'}
            </span>
          </header>
          <main className="arcade-lobby-card">
            <span className="arcade-lobby-eyebrow"><Users size={15} /> 1 CONTRE 1 · EN LIGNE</span>
            <h1>{room ? 'Salon de duel' : 'Jouez à deux'}</h1>
            {!room ? (
              <>
                <label className="arcade-field">
                  Votre pseudo
                  <input value={nickname} maxLength={18} onChange={(event) => setNickname(event.target.value)} placeholder="Joueur" />
                </label>
                <button type="button" className="arcade-secondary-button" onClick={() => setView('solo')}>Jouer en solo</button>
                {game === 'cannon-duel' && <button type="button" className="arcade-secondary-button" onClick={() => setView('local')}>2 joueurs sur cet appareil</button>}
                {['damned-maze', 'princess-race', 'grotte-aux-couteaux'].includes(game) && <button type="button" className="arcade-secondary-button" onClick={() => setView('local')}>Jouer en local à deux</button>}
                <label className="arcade-field">Mise en crédits démo
                  <input type="number" min="1" max="1000000" step="1" value={stake} onChange={(event) => setStake(event.target.value)} />
                </label>
                <label className="arcade-public-toggle">
                  <input type="checkbox" checked={publicRoom} onChange={(event) => setPublicRoom(event.target.checked)} />
                  Afficher mon salon sur l’accueil
                </label>
                <button type="button" className="arcade-primary-button" disabled={!connected} onClick={createRoom}>Créer une salle</button>
                <button type="button" className="arcade-secondary-button" disabled={!connected} onClick={() => { setView('join'); setFeedback('') }}>Rejoindre une salle</button>
                {view === 'join' && (
                  <form className="arcade-join-form" onSubmit={joinRoom}>
                    <label className="arcade-field">Code de la salle
                      <input value={codeInput} maxLength={6} onChange={(event) => setCodeInput(event.target.value.toUpperCase())} placeholder="ABC123" />
                    </label>
                    <label className="arcade-field">Mise identique en crédits démo
                      <input type="number" min="0" max="1000000" step="1" value={joinStake} onChange={(event) => setJoinStake(event.target.value)} />
                    </label>
                    <button type="submit" className="arcade-primary-button" disabled={!connected || codeInput.length !== 6}>Rejoindre</button>
                  </form>
                )}
              </>
            ) : (
              <>
                <div className="arcade-room-code"><strong>{room.code}</strong><button type="button" onClick={copyCode}>{copied ? <Check size={17} /> : <Clipboard size={17} />}{copied ? 'Copié' : 'Copier'}</button></div>
                <p className="arcade-lobby-hint">
                  {room.isPublic ? 'Salon public · visible sur l’accueil' : 'Salon privé'}
                  {' · Mise démo '}{(room.stake ?? 0).toLocaleString('fr-FR')} crédits
                  {' · Pot démo '}{((room.stake ?? 0) * 2).toLocaleString('fr-FR')} crédits
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
      <RoomCeremony
        room={room}
        title={details.title}
        countdown={seconds}
        winnerSlot={resolvedWinnerSlot}
      />
    </section>
  )
}
