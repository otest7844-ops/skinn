import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Gamepad2, Users } from 'lucide-react'
import { getMultiplayerUrl } from './multiplayer-url'
import { getDemoWalletId } from './demo-wallet'
import { getResponsiveImageProps, hideBrokenImage } from './responsive-image'
import { useLocalization } from './useLocalization'

export type PublicRoom = {
  code: string
  game: string
  phase: 'waiting' | 'countdown'
  host: string
  players: number
  stake: number
}

const TITLES: Record<string, string> = {
  'tic-tac-toe': 'Quantum Duel',
  'ping-pong': 'Ping Pong',
  'basketball-stars': 'Basketball Stars',
  'ball-rush': 'Ball Rush 3D',
  'football-19': 'Football 19',
  'head-football': 'Head Football',
  'tap-tape-arena': 'Tape-Tape Arena',
  'memo-5x5': 'Mémo 5×5',
  'word-search': 'Chasse aux mots',
  'dictation-duel': 'Dictée Éclair',
  'quiz-arena': 'Quiz Arène',
  'forest-bridge': 'Pont de la forêt 3D',
  'damned-maze': 'Le Labyrinthe des Damnés',
  'princess-race': 'La Course vers la Princesse',
  'grotte-aux-couteaux': 'Grotte aux Couteaux',
  'colonnes-du-canyon': 'Colonnes du Canyon',
  'arena-helice': 'Arène Hélice',
  'duel-de-troncs': 'Duel de Troncs',
  'chess-3d': 'Échecs 3D',
  embuscade: 'Embuscade',
  'moto-taxi-afrique': 'Moto Taxi Afrique',
  'chemin-de-couleurs': 'Chemin de couleurs 3D',
  'duel-de-cartes': 'Duel de cartes 3D',
  'lave-montante': 'Lave Montante',
  'mirror-run': 'Mirror Run',
}

const IMAGES: Record<string, string> = {
  'tic-tac-toe': '/images/game-tic-tac-toe.jpg',
  'ping-pong': '/images/game-ping-pong.jpg',
  'basketball-stars': '/images/basketball-stars.jpg',
  'ball-rush': '/images/game-ball-rush.jpg',
  'football-19': '/images/football-19.jpg',
  'head-football': '/images/football-19.jpg',
  'tap-tape-arena': '/images/tape-tape-arena.jpg',
  'memo-5x5': '/images/memo-5x5.jpg',
  'word-search': '/images/game-word-search.jpg',
  'dictation-duel': '/images/dictee-eclair.jpg',
  'quiz-arena': '/images/quiz-arena.jpg',
  'forest-bridge': '/images/forest-bridge.jpg',
  'damned-maze': '/images/damned-maze.jpg',
  'princess-race': '/images/princess-race.jpg',
  'grotte-aux-couteaux': '/images/damned-maze.jpg',
  'colonnes-du-canyon': '/images/forest-bridge.jpg',
  'arena-helice': '/images/arena-helice.gif',
  'duel-de-troncs': '/images/duel-de-troncs.jpg',
  'chess-3d': '/images/game-stone.jpg',
  embuscade: '/images/game-western.svg',
  'moto-taxi-afrique': '/images/moto-taxi-afrique.jpg',
  'chemin-de-couleurs': '/images/chemin-de-couleurs.jpg',
  'duel-de-cartes': '/images/duel-de-cartes.jpg',
  'lave-montante': '/images/lave-montante.svg',
  'mirror-run': '/images/mirror-run.svg',
}

export default function PublicRooms({
  onJoin,
  onWalletBalance,
}: {
  onJoin: (room: PublicRoom) => void
  onWalletBalance: (balance: number) => void
}) {
  const { t, formatAmount } = useLocalization()
  const [arenaRooms, setArenaRooms] = useState<PublicRoom[]>([])
  const [connected, setConnected] = useState(false)
  const rooms = arenaRooms

  useEffect(() => {
    const socket = io(getMultiplayerUrl(), { reconnection: true, reconnectionAttempts: 8, timeout: 8000 })
    socket.on('connect', () => {
      setConnected(true)
      socket.emit('arena:public-rooms:request')
      socket.emit('arena:demo-wallet:request', { walletId: getDemoWalletId() })
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('arena:public-rooms', (next: PublicRoom[]) => {
      setArenaRooms(next.filter((room) => TITLES[room.game]))
    })
    socket.on('arena:demo-wallet', (wallet: { balance: number }) => {
      if (Number.isFinite(wallet?.balance)) onWalletBalance(wallet.balance)
    })
    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [onWalletBalance])

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-black">
          <Users size={15} className="text-pink-400" />
          {t('rooms.open')}
        </h2>
        <span className="text-[10px] font-semibold text-slate-400">
          {connected ? `${rooms.length} ${t('rooms.available')}` : t('rooms.connecting')}
        </span>
      </div>
      {rooms.length === 0 ? (
        <p className="rounded-2xl border border-pink-400/20 bg-pink-500/5 p-3 text-center text-xs text-slate-400">
          {t('rooms.none')}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {rooms.map((room) => (
            <article key={room.code} className="flex items-center gap-3 rounded-2xl border border-pink-400/30 bg-pink-500/10 p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-pink-400/40 bg-pink-500/15">
                <img
                  {...getResponsiveImageProps(IMAGES[room.game], '48px', [64, 128, 192])}
                  alt=""
                  className="h-full w-full object-cover"
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  onError={hideBrokenImage}
                />
                <Gamepad2 size={13} className="absolute bottom-1 right-1 rounded bg-pink-500 p-0.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-xs">{TITLES[room.game]}</strong>
                <span className="block truncate text-[10px] text-slate-400">
                  {room.host} · Code {room.code} · {room.stake === 0 ? 'Gratuit' : `${t('rooms.demoStake')} ${formatAmount(room.stake)}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onJoin(room)}
                className="shrink-0 rounded-xl bg-pink-500 px-3 py-2 text-[10px] font-black text-white hover:bg-pink-600"
              >
                {t('rooms.join')}
              </button>
            </article>
          ))}
        </div>
      )}
      <p className="text-[9px] text-slate-500">{t('rooms.demoOnly')}</p>
    </section>
  )
}
