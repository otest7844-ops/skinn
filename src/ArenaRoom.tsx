import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowLeft, Check, Clipboard, Users, Wifi, WifiOff } from 'lucide-react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import './ArcadeOnline.css'
import { getMultiplayerUrl } from './multiplayer-url'
import { getDemoWalletId } from './demo-wallet'
import GameControlsGuide from './GameControlsGuide'
import { HEAD_FOOTBALL_CLUBS, HEAD_FOOTBALL_PLAYERS, type HeadFootballSelection } from './head-football-data'
import { WORD_SEARCH_CATEGORIES } from '../shared/word-search.mjs'

export type OnlineGame = 'football-19' | 'head-football' | 'tap-tape-arena' | 'memo-5x5' | 'word-search' | 'dictation-duel'
type Player = { slot: number; you: boolean; name: string; connected: boolean; ready: boolean }
export type HeadFootballMatch = {
  status: 'count' | 'play' | 'goal' | 'finished'
  phaseElapsed: number
  remaining: number
  scores: number[]
  winner: number | null
  players: Array<Record<string, number | boolean | HeadFootballSelection>>
  ball: Record<string, number>
}
export type ArenaRoomView = {
  code: string
  game: OnlineGame
  category?: string
  phase: 'waiting' | 'countdown' | 'running' | 'paused' | 'finished'
  round: number
  countdownEndsAt: number | null
  countdownRemainingMs: number | null
  players: Player[]
  gameState: {
    scores?: number[]
    attempts?: number[]
    winner?: number | null
    selections?: Array<HeadFootballSelection | null>
    match?: HeadFootballMatch | null
    cards?: Array<{ id: number; symbol: string; faceUp: boolean; matched: boolean; isStar: boolean }>
    status?: string
    turn?: number
    moves?: number[]
    totalMoves?: number
    elapsedSeconds?: number
    opened?: number[]
    wordSearch?: {
      size: number
      category: string
      grid: string[]
      placements: Array<{ word: string; cells: number[] }>
      words: string[]
      found: Array<{ word: string; cells: number[]; slot: number; points: number }>
      scores: [number, number]
      foundCounts: [number, number]
      status: 'playing' | 'finished'
      winner: number | null
      startedAt: number
      elapsedSeconds: number
    }
    dictation?: {
      status: 'playing' | 'finished'
      phase: 'playing' | 'intermission' | 'finished'
      round: number
      scores: [number, number]
      sentence: string
      roundStartedAt: number
      roundDeadline: number
      roundRemainingMs: number
      lastResult: { round: number; winnerSlot: number | null; correct: boolean; elapsedMs: number } | null
      winner: number | null
    }
  } | null
  yourSlot: number
  stake?: number
  isPublic?: boolean
  payout?: number
  winnerSlot?: number | null
}
type Ack = { ok: boolean; code?: string; error?: string }
type GameProps = { room: ArenaRoomView | null; local?: boolean; onClose: () => void; onAction: (type: string, data?: object) => void }

const socketUrl = getMultiplayerUrl()

export default function ArenaRoom({
  game,
  title,
  onClose,
  renderGame,
  publicJoin = null,
  onWalletBalance,
}: {
  game: OnlineGame
  title: string
  onClose: () => void
  renderGame: (props: GameProps) => ReactNode
  publicJoin?: { game: string; code: string; stake: number } | null
  onWalletBalance?: (balance: number) => void
}) {
  const [view, setView] = useState<'home' | 'join' | 'lobby' | 'playing' | 'solo' | 'local'>('home')
  const [room, setRoom] = useState<ArenaRoomView | null>(null)
  const [name, setName] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [clubIndex, setClubIndex] = useState(0)
  const [playerIndex, setPlayerIndex] = useState(0)
  const [wordSearchCategory, setWordSearchCategory] = useState('*')
  const [publicRoom, setPublicRoom] = useState(true)
  const [stake, setStake] = useState('500')
  const [joinStake, setJoinStake] = useState('500')
  const [connected, setConnected] = useState(false)
  const [clock, setClock] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [copied, setCopied] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const attemptedPublicJoinRef = useRef('')
  const nameRef = useRef(name)
  const walletBalanceCallbackRef = useRef(onWalletBalance)
  nameRef.current = name
  walletBalanceCallbackRef.current = onWalletBalance
  const storageKey = `arena-room-${game}`

  useEffect(() => {
    const socket = io(socketUrl, { reconnection: true, reconnectionAttempts: 8, timeout: 8000 })
    socket.on('connect', () => {
      setSocket(socket)
      setConnected(true)
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
          name: nameRef.current,
          walletId: getDemoWalletId(),
        }, (result: Ack) => {
          if (!result?.ok) setFeedback(result.error ?? 'Impossible de rejoindre ce salon.')
        })
        return
      }
      const saved = window.sessionStorage.getItem(storageKey)
      if (saved) {
        try {
          socket.emit('arena:room:reconnect', JSON.parse(saved), (result: Ack) => {
            if (!result?.ok) {
              window.sessionStorage.removeItem(storageKey)
              setFeedback(result.error ?? 'La salle précédente n’est plus disponible.')
            }
          })
        } catch (error) {
          window.sessionStorage.removeItem(storageKey)
          console.warn('Stored room data could not be read:', error)
          setFeedback('Les informations de reconnexion sont invalides.')
        }
      }
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', (error: Error) => {
      setConnected(false)
      setFeedback(`Serveur multijoueur inaccessible : ${error.message}`)
    })
    socket.on('arena:state', (next: ArenaRoomView) => {
      if (next.game !== game) return
      const localRoom = next.countdownRemainingMs === null
        ? next
        : { ...next, countdownEndsAt: Date.now() + next.countdownRemainingMs }
      setRoom(localRoom)
      if (localRoom.phase === 'countdown') setClock(Date.now())
      setView(localRoom.phase === 'running' || localRoom.phase === 'paused' ? 'playing' : 'lobby')
    })
    socket.on('arena:room:joined', ({ code, token }: { code: string; token: string }) => {
      window.sessionStorage.setItem(storageKey, JSON.stringify({ code, token }))
    })
    socket.on('arena:demo-wallet', ({ balance }: { balance: number }) => {
      if (Number.isFinite(balance)) walletBalanceCallbackRef.current?.(balance)
    })
    socket.on('arena:expired', ({ message }: { message?: string }) => {
      window.sessionStorage.removeItem(storageKey)
      setRoom(null)
      setView('home')
      setFeedback(message ?? 'Le salon a expiré.')
    })
    socket.on('arena:closed', ({ reason }: { reason?: string } = {}) => {
      window.sessionStorage.removeItem(storageKey)
      setRoom(null)
      setView('home')
      setFeedback(reason ?? 'La salle a été fermée.')
    })
    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [game, storageKey, publicJoin, publicJoin?.code, publicJoin?.game, publicJoin?.stake])

  useEffect(() => {
    if (room?.phase !== 'countdown') return
    const timer = window.setInterval(() => setClock(Date.now()), 150)
    return () => window.clearInterval(timer)
  }, [room?.phase])

  function perform(event: string, payload: object = {}) {
    if (!socket?.connected) {
      setFeedback('Le serveur multijoueur n’est pas connecté.')
      return
    }
    socket.emit(event, payload, (result: Ack) => {
      if (!result?.ok) setFeedback(result?.error ?? 'La demande a échoué.')
      else setFeedback('')
    })
  }

  function createRoom() {
    perform('arena:room:create', {
      game,
      name,
      walletId: getDemoWalletId(),
      isPublic: publicRoom,
      stake: Number(stake),
      ...(game === 'word-search' ? { category: wordSearchCategory } : {}),
    })
  }

  function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    perform('arena:room:join', { game, code: codeInput, name, walletId: getDemoWalletId(), stake: Number(joinStake) })
  }

  function leaveRoom() {
    perform('arena:room:leave')
    window.sessionStorage.removeItem(storageKey)
    setRoom(null)
    setView('home')
  }

  async function copyCode() {
    if (!room) return
    try {
      await navigator.clipboard.writeText(room.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Unable to copy the room code:', error)
      setFeedback('Copie impossible. Notez le code affiché.')
    }
  }

  const self = room?.players.find((player) => player.you)
  const opponent = room?.players.find((player) => !player.you)
  const winnerSlot = room?.gameState?.match?.winner ?? room?.gameState?.winner ?? room?.winnerSlot ?? null
  const countdown = room?.countdownEndsAt
    ? clock ? Math.max(1, Math.ceil((room.countdownEndsAt - clock) / 1000)) : 10
    : null
  const outcome = !room || room.phase !== 'finished'
    ? null
    : winnerSlot === null ? 'is-draw' : winnerSlot === room.yourSlot ? 'is-win' : 'is-loss'
  const exitGame = () => room ? leaveRoom() : setView('home')

  if (view === 'playing' || view === 'solo' || view === 'local') {
    return (
      <section className="arcade-online-screen" aria-label={title}>
        <header className="arcade-game-topbar">
          <button type="button" className="arcade-back-button" onClick={exitGame}><ArrowLeft size={17} /> Quitter</button>
          <div className="arcade-match-label">{title}{room ? ` · SALLE ${room.code}` : view === 'local' ? ' · LOCAL' : ' · SOLO'}</div>
          {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
        </header>
        {room?.phase === 'paused' && <div className="arcade-disconnect-notice">Connexion interrompue — reconnexion en cours.</div>}
        {renderGame({
          room: view === 'solo' || view === 'local' ? null : room,
          local: view === 'local',
          onClose: exitGame,
          onAction: (type, data = {}) => type === 'rematch'
            ? perform('arena:room:rematch')
            : perform('arena:game:action', { type, ...data }),
        })}
      </section>
    )
  }

  return (
    <div className="arcade-online-screen">
      <div className="arcade-lobby">
        <header className="arcade-lobby-header">
          <button type="button" className="arcade-back-button" onClick={room ? leaveRoom : onClose}><ArrowLeft size={17} /> Retour</button>
          <span>{title} · DUEL EN LIGNE</span>
          <span className={`arcade-connection ${connected ? 'is-connected' : ''}`}>{connected ? <Wifi size={16} /> : <WifiOff size={16} />} {connected ? 'Connecté' : 'Hors ligne'}</span>
        </header>
        <main className="arcade-lobby-card">
          <span className="arcade-lobby-eyebrow"><Users size={15} /> 1 CONTRE 1 · EN LIGNE</span>
          <h1>{room ? 'Salon de duel' : 'Jouez à deux'}</h1>
          <GameControlsGuide
            game={game}
            playerSlot={room ? room.yourSlot === 1 ? 1 : 0 : null}
          />
          {!room ? <>
            <label className="arcade-field">Votre pseudo<input value={name} maxLength={18} onChange={(event) => setName(event.target.value)} placeholder="Joueur" /></label>
            <button type="button" className="arcade-secondary-button" onClick={() => setView('solo')}>Jouer en solo</button>
            {(game === 'head-football' || game === 'memo-5x5' || game === 'word-search') && <button type="button" className="arcade-secondary-button" onClick={() => setView('local')}>Mode local · 2 joueurs</button>}
            {game === 'word-search' && <label className="arcade-field">Catégorie de la grille
              <select value={wordSearchCategory} onChange={(event) => setWordSearchCategory(event.target.value)}>
                <option value="*">Mixte</option>
                {Object.keys(WORD_SEARCH_CATEGORIES).map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>}
            <label className="arcade-field">Mise en crédits démo<input type="number" min="1" max="1000000" step="1" value={stake} onChange={(event) => setStake(event.target.value)} /></label>
            <label className="arcade-public-toggle"><input type="checkbox" checked={publicRoom} onChange={(event) => setPublicRoom(event.target.checked)} /> Afficher mon salon sur l’accueil</label>
            <button type="button" className="arcade-primary-button" disabled={!connected} onClick={createRoom}>Créer une salle</button>
            <button type="button" className="arcade-secondary-button" disabled={!connected} onClick={() => setView('join')}>Rejoindre une salle</button>
            {view === 'join' && <form className="arcade-join-form" onSubmit={joinRoom}>
              <label className="arcade-field">Code de la salle<input value={codeInput} maxLength={6} onChange={(event) => setCodeInput(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="ABC123" /></label>
              <label className="arcade-field">Mise identique en crédits démo<input type="number" min="0" max="1000000" step="1" value={joinStake} onChange={(event) => setJoinStake(event.target.value)} /></label>
              <button type="submit" className="arcade-primary-button" disabled={!connected || codeInput.length !== 6}>Rejoindre</button>
            </form>}
          </> : <>
            <div className="arcade-room-code"><strong>{room.code}</strong><button type="button" onClick={() => void copyCode()}>{copied ? <Check size={17} /> : <Clipboard size={17} />}{copied ? 'Copié' : 'Copier'}</button></div>
            <p className="arcade-lobby-hint">
              {room.isPublic ? 'Salon public · visible sur l’accueil' : 'Salon privé'}
              {' · Mise démo '}{(room.stake ?? 0).toLocaleString('fr-FR')} crédits
              {' · Pot démo '}{((room.stake ?? 0) * 2).toLocaleString('fr-FR')} crédits
            </p>
            {outcome && <div className={`arcade-result-score ${outcome}`}>
              <strong>{outcome === 'is-win' ? 'VICTOIRE !' : outcome === 'is-loss' ? 'DÉFAITE' : 'ÉGALITÉ'}</strong>
              <span>{room.gameState?.match?.scores.join(' – ') ?? room.gameState?.scores?.join(' – ') ?? ''}</span>
              <b>{room.payout && winnerSlot === room.yourSlot
                ? `🪙 +${room.payout.toLocaleString('fr-FR')} crédits démo`
                : room.stake ? room.payout ? 'Gain attribué à l’adversaire' : 'Mise remboursée en crédits démo' : ''}</b>
            </div>}
            <div className="arcade-player-list">{[0, 1].map((slot) => {
              const player = room.players.find((item) => item.slot === slot)
              const selected = room.gameState?.selections?.[slot]
              const club = selected ? HEAD_FOOTBALL_CLUBS[selected.clubIndex]?.[0] : null
              const footballer = selected ? HEAD_FOOTBALL_PLAYERS[selected.playerIndex] : null
              return <div key={slot}><i className={player?.connected ? 'is-connected' : ''} /><span><b>{player?.you ? 'Vous' : player?.name ?? `Joueur ${slot + 1}`}</b><small>{player ? player.connected ? player.ready ? 'Sélection validée · prêt' : 'Connecté' : 'Reconnexion…' : 'En attente…'}</small>{game === 'head-football' && <small>{club && footballer ? `${club} · ${footballer}` : 'Choix du club et du joueur en attente'}</small>}</span></div>
            })}</div>
            {game === 'head-football' && room.phase !== 'finished' && <div className="head-football-selection">
              <h2>Votre sélection</h2>
              <label className="arcade-field">Club
                <select value={clubIndex} disabled={Boolean(self?.ready) || room.phase !== 'waiting'} onChange={(event) => setClubIndex(Number(event.target.value))}>
                  {HEAD_FOOTBALL_CLUBS.map(([club], index) => <option key={club} value={index}>{club}</option>)}
                </select>
              </label>
              <label className="arcade-field">Footballeur
                <select value={playerIndex} disabled={Boolean(self?.ready) || room.phase !== 'waiting'} onChange={(event) => setPlayerIndex(Number(event.target.value))}>
                  {HEAD_FOOTBALL_PLAYERS.map((footballer, index) => <option key={footballer} value={index}>{footballer}</option>)}
                </select>
              </label>
              <button type="button" className="arcade-secondary-button" disabled={Boolean(self?.ready) || room.phase !== 'waiting'} onClick={() => perform('arena:head-football:selection', { clubIndex, playerIndex })}>
                {self?.ready ? 'Sélection verrouillée' : room.gameState?.selections?.[self?.slot ?? 0] ? 'Mettre à jour ma sélection' : 'Valider ma sélection'}
              </button>
            </div>}
            {room.phase === 'finished' && <p className="arcade-lobby-hint">
              Match terminé · {room.gameState?.match?.scores.join(' – ') ?? room.gameState?.scores?.join(' – ')}
            </p>}
            {countdown !== null
              ? <p className="arcade-countdown">Début dans <b>{countdown}</b></p>
              : <button type="button" className="arcade-primary-button" disabled={!opponent?.connected || !connected || Boolean(self?.ready) || (game === 'head-football' && !room.gameState?.selections?.[self?.slot ?? 0])} onClick={() => perform(room.phase === 'finished' ? 'arena:room:rematch' : 'arena:room:ready', room.phase === 'finished' ? {} : { ready: true })}>
                {self?.ready ? 'En attente…' : room.phase === 'finished' ? 'Revanche' : game === 'head-football' ? 'PRÊT' : 'Je suis prêt'}
              </button>}
            <p className="arcade-lobby-hint">{opponent?.connected ? 'Les deux joueurs doivent être prêts.' : 'Partagez le code pour inviter un adversaire.'}</p>
          </>}
          {feedback && <p className="arcade-feedback" role="status">{feedback}</p>}
          {!connected && !feedback && <p className="arcade-feedback">Connexion au serveur…</p>}
        </main>
      </div>
    </div>
  )
}
