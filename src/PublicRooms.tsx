import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Gamepad2, Users } from 'lucide-react'
import { getMultiplayerUrl } from './multiplayer-url'
import { getDemoWalletId } from './demo-wallet'

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
  'cannon-duel': 'Canon Duel',
  'football-19': 'Football 19',
  'head-football': 'Head Football',
  'tap-tape-arena': 'Tape-Tape Arena',
  'memo-5x5': 'Mémo 5×5',
  'mosswing-online': 'Mosswing Online',
  'forest-bridge': 'Pont de la forêt 3D',
  'damned-maze': 'Le Labyrinthe des Damnés',
  'princess-race': 'La Course vers la Princesse',
  'grotte-aux-couteaux': 'Grotte aux Couteaux',
  'colonnes-du-canyon': 'Colonnes du Canyon',
}

const IMAGES: Record<string, string> = {
  'tic-tac-toe': '/images/game-tic-tac-toe.jpg',
  'ping-pong': '/images/game-ping-pong.jpg',
  'basketball-stars': '/images/basketball-stars.jpg',
  'ball-rush': '/images/game-ball-rush.jpg',
  'cannon-duel': '/images/cannon-duel.jpg',
  'football-19': '/images/football-19.jpg',
  'head-football': '/images/football-19.jpg',
  'tap-tape-arena': '/images/tape-tape-arena.jpg',
  'memo-5x5': '/images/memo-5x5.jpg',
  'mosswing-online': '/images/mosswing-online.jpg',
  'forest-bridge': '/images/forest-bridge.jpg',
  'damned-maze': '/images/damned-maze.jpg',
  'princess-race': '/images/princess-race.jpg',
  'grotte-aux-couteaux': '/images/damned-maze.jpg',
  'colonnes-du-canyon': '/images/forest-bridge.jpg',
}

export default function PublicRooms({
  onJoin,
  onWalletBalance,
}: {
  onJoin: (room: PublicRoom) => void
  onWalletBalance: (balance: number) => void
}) {
  const [arenaRooms, setArenaRooms] = useState<PublicRoom[]>([])
  const [mosswingRooms, setMosswingRooms] = useState<PublicRoom[]>([])
  const [connected, setConnected] = useState(false)
  const rooms = [...arenaRooms, ...mosswingRooms]

  useEffect(() => {
    const socket = io(getMultiplayerUrl(), { reconnection: true, reconnectionAttempts: 8, timeout: 8000 })
    socket.on('connect', () => {
      setConnected(true)
      socket.emit('arena:public-rooms:request')
      socket.emit('mosswing:public-rooms:request')
      socket.emit('arena:demo-wallet:request', { walletId: getDemoWalletId() })
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('arena:public-rooms', (next: PublicRoom[]) => {
      setArenaRooms(next.filter((room) => TITLES[room.game]))
    })
    socket.on('mosswing:public-rooms', (next: PublicRoom[]) => {
      setMosswingRooms(next.filter((room) => TITLES[room.game]))
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
          Salons ouverts
        </h2>
        <span className="text-[10px] font-semibold text-slate-400">
          {connected ? `${rooms.length} disponible${rooms.length === 1 ? '' : 's'}` : 'Connexion…'}
        </span>
      </div>
      {rooms.length === 0 ? (
        <p className="rounded-2xl border border-pink-400/20 bg-pink-500/5 p-3 text-center text-xs text-slate-400">
          Aucun salon public ouvert pour le moment.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {rooms.map((room) => (
            <article key={room.code} className="flex items-center gap-3 rounded-2xl border border-pink-400/30 bg-pink-500/10 p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-pink-400/40 bg-pink-500/15">
                <img src={IMAGES[room.game]} alt="" className="h-full w-full object-cover" />
                <Gamepad2 size={13} className="absolute bottom-1 right-1 rounded bg-pink-500 p-0.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-xs">{TITLES[room.game]}</strong>
                <span className="block truncate text-[10px] text-slate-400">
                  {room.host} · Code {room.code} · Mise démo {room.stake.toLocaleString('fr-FR')} crédits
                </span>
              </div>
              <button
                type="button"
                onClick={() => onJoin(room)}
                className="shrink-0 rounded-xl bg-pink-500 px-3 py-2 text-[10px] font-black text-white hover:bg-pink-600"
              >
                Participer
              </button>
            </article>
          ))}
        </div>
      )}
      <p className="text-[9px] text-slate-500">Mises et gains en crédits de démonstration uniquement.</p>
    </section>
  )
}
