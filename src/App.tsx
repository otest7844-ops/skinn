import { lazy, Suspense, useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  BarChart3,
  Bell,
  ChevronRight,
  CircleDot,
  CreditCard,
  Dices,
  Gamepad2,
  Grid2X2,
  HelpCircle,
  Home,
  Leaf,
  Minus,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  Search,
  Sparkles,
  Sun,
  Swords,
  Trophy,
  User,
  UserPlus,
  Wallet,
  X,
} from 'lucide-react'
import type { ArcadeGameId } from './ArcadeOnline'
import type { PublicRoom } from './PublicRooms'
import ChicagoWordmark from './ChicagoWordmark'
import PublicRooms from './PublicRooms'
import { getResponsiveImageProps, hideBrokenImage } from './responsive-image'
import './DesktopLayout.css'

const MosswingOnline = lazy(() => import('./MosswingOnline'))
const ArcadeOnline = lazy(() => import('./ArcadeOnline'))
const TicTacToeOnline = lazy(() => import('./TicTacToeOnline'))
const SimpleIntro = lazy(() => import('./SimpleIntro'))
const MemoGame = lazy(() => import('./MemoGame'))
const WordSearchGame = lazy(() => import('./WordSearchGame'))
const DictationGame = lazy(() => import('./DictationGame'))
const TapTapeArena = lazy(() => import('./TapTapeArena'))
const ArenaRoom = lazy(() => import('./ArenaRoom'))
const HeadFootballGame = lazy(() => import('./HeadFootballGame'))
const SoccerArena = lazy(() => import('./SoccerArena'))

type ArenaGameId = 'tic-tac-toe' | ArcadeGameId
type Page = 'popular' | 'games' | 'performance' | 'invite' | 'account'
type ThemeMode = 'dark' | 'light' | 'lime' | 'neon'

type DuelInvite = {
  id: string
  player: string
  game: string
  stake: number
  status: 'pending' | 'accepted' | 'refused'
}

function GameLoadingFallback() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-black text-sm font-bold text-slate-400"
      role="status"
      aria-live="polite"
    >
      Chargement du jeu…
    </div>
  )
}

// Top 10 performers
const allTopPerformers = [
  {
    rank: 1 as const,
    name: 'Astra Void',
    amount: '2 740 000 XOF',
    image: '/images/top-performer-01.jpg',
  },
  {
    rank: 2 as const,
    name: 'Rift Echo',
    amount: '2 360 000 XOF',
    image: '/images/top-performer-02.jpg',
  },
  {
    rank: 3 as const,
    name: 'Nova Dream',
    amount: '1 940 000 XOF',
    image: '/images/top-performer-03.jpg',
  },
  { rank: 4, name: 'Ion Pulse', amount: '1 650 000 XOF', image: '/images/top-performer-04.jpg' },
  { rank: 5, name: 'Comet Rift', amount: '1 420 000 XOF', image: '/images/top-performer-05.jpg' },
  { rank: 6, name: 'Kite Nova', amount: '1 190 000 XOF', image: '/images/top-performer-06.jpg' },
  { rank: 7, name: 'Nexa G', amount: '980 000 XOF', image: '/images/top-performer-07.jpg' },
  { rank: 8, name: 'Luma Fire', amount: '810 000 XOF', image: '/images/top-performer-08.jpg' },
  { rank: 9, name: 'Pixel S', amount: '690 000 XOF', image: '/images/top-performer-09.jpg' },
  { rank: 10, name: 'Vortex Max', amount: '580 000 XOF', image: '/images/top-performer-10.jpg' },
]

// List only distinct, playable games so each game appears once in the platform.
const allGames = [
  {
    id: 'memo-5x5',
    title: 'Mémo 5×5',
    image: '/images/memo-5x5.jpg',
    type: 'memo' as const,
    arcadeGameId: undefined as ArcadeGameId | undefined,
  },
  {
    id: 'word-search',
    title: 'Chasse aux mots',
    image: '/images/game-word-search.jpg',
    type: 'wordsearch' as const,
  },
  {
    id: 'dictation-duel',
    title: 'Dictée Éclair',
    image: '/images/dictee-eclair.jpg',
    type: 'dictation' as const,
  },
  {
    id: 'head-football',
    title: 'Head Football',
    image: '/images/football-19.jpg',
    type: 'headfootball' as const,
  },
  {
    id: 'tap-tape-arena',
    title: 'Tape-Tape Arena',
    image: '/images/tape-tape-arena.jpg',
    type: 'taptape' as const,
    arcadeGameId: undefined as ArcadeGameId | undefined,
  },
  {
    id: 'basketball-stars',
    title: 'Basketball Stars',
    image: '/images/basketball-stars.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'basketball-stars' as ArcadeGameId,
  },
  {
    id: 'quantum-duel',
    title: 'Quantum Duel',
    image: '/images/game-tic-tac-toe.jpg',
    type: 'tictactoe' as const,
  },
  {
    id: 'ping-pong',
    title: 'Ping Pong',
    image: '/images/game-ping-pong.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'ping-pong' as ArcadeGameId,
  },
  {
    id: 'cannon-duel',
    title: 'Canon Duel',
    image: '/images/cannon-duel.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'cannon-duel' as ArcadeGameId,
  },
  {
    id: 'ball-rush-3d',
    title: 'Ball Rush 3D',
    image: '/images/game-ball-rush.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'ball-rush' as ArcadeGameId,
  },
  {
    id: 'mosswing-online',
    title: 'Mosswing Online',
    image: '/images/mosswing-online.jpg',
    type: 'mosswing' as const,
  },
  {
    id: 'forest-bridge',
    title: 'Pont de la forêt 3D',
    image: '/images/forest-bridge.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'forest-bridge' as ArcadeGameId,
  },
  {
    id: 'princess-race',
    title: 'La Course vers la Princesse',
    image: '/images/princess-race.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'princess-race' as ArcadeGameId,
  },
  {
    id: 'damned-maze',
    title: 'Le Labyrinthe des Damnés',
    image: '/images/damned-maze.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'damned-maze' as ArcadeGameId,
  },
  {
    id: 'grotte-aux-couteaux',
    title: 'Grotte aux Couteaux',
    image: '/images/damned-maze.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'grotte-aux-couteaux' as ArcadeGameId,
  },
  {
    id: 'colonnes-du-canyon',
    title: 'Colonnes du Canyon',
    image: '/images/forest-bridge.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'colonnes-du-canyon' as ArcadeGameId,
  },
  {
    id: 'arena-helice',
    title: 'Arène Hélice',
    image: '/images/arena-helice.gif',
    type: 'arcade' as const,
    arcadeGameId: 'arena-helice' as ArcadeGameId,
  },
  {
    id: 'duel-de-troncs',
    title: 'Duel de Troncs',
    image: '/images/duel-de-troncs.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'duel-de-troncs' as ArcadeGameId,
  },
]

// Promotional banners use the supplied campaign artwork.
const promotions = [
  { title: 'Jackpot machines', image: '/images/casino-slots.jpg', desc: 'Découvrez les machines' },
  { title: 'Roulette', image: '/images/roulette.jpg', desc: 'Tentez votre chance' },
  { title: 'Jackpot rose', image: '/images/jackpot-arcade.jpg', desc: 'Une partie, un jackpot' },
  { title: 'Jackpot royal', image: '/images/royal-slots.jpg', desc: 'Faites tourner les rouleaux' },
]

/* SVG Ribbon Medal Component matching the screenshot badges */
function MedalRibbon({ rank }: { rank: 1 | 2 | 3 }) {
  if (rank === 1) {
    return (
      <svg className="w-6 h-8 drop-shadow-sm select-none" viewBox="0 0 28 36" fill="none">
        <path d="M8 20L4 34L14 29L24 34L20 20" fill="#D97706" />
        <path d="M9 20L6 32L14 28L22 32L19 20" fill="#F59E0B" />
        <circle cx="14" cy="14" r="11" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
        <circle cx="14" cy="14" r="8.5" fill="#F59E0B" />
        <text x="14" y="18" textAnchor="middle" fill="#78350F" fontSize="11" fontWeight="900" fontFamily="sans-serif">1</text>
      </svg>
    )
  }
  if (rank === 2) {
    return (
      <svg className="w-6 h-8 drop-shadow-sm select-none" viewBox="0 0 28 36" fill="none">
        <path d="M8 20L4 34L14 29L24 34L20 20" fill="#64748B" />
        <path d="M9 20L6 32L14 28L22 32L19 20" fill="#94A3B8" />
        <circle cx="14" cy="14" r="11" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
        <circle cx="14" cy="14" r="8.5" fill="#CBD5E1" />
        <text x="14" y="18" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="900" fontFamily="sans-serif">2</text>
      </svg>
    )
  }
  return (
    <svg className="w-6 h-8 drop-shadow-sm select-none" viewBox="0 0 28 36" fill="none">
      <path d="M8 20L4 34L14 29L24 34L20 20" fill="#C2410C" />
      <path d="M9 20L6 32L14 28L22 32L19 20" fill="#EA580C" />
      <circle cx="14" cy="14" r="11" fill="#FDBA74" stroke="#EA580C" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="8.5" fill="#FB923C" />
      <text x="14" y="18" textAnchor="middle" fill="#7C2D12" fontSize="11" fontWeight="900" fontFamily="sans-serif">3</text>
    </svg>
  )
}

export default function App() {
  // Simple splash intro state
  const [showIntro, setShowIntro] = useState(true)

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem('game_arena_theme')
    if (saved === 'light' || saved === 'lime' || saved === 'neon') return saved
    return 'neon'
  })

  const [page, setPage] = useState<Page>('popular')
  const [category, setCategory] = useState('Populaires')
  const [sidebarCompact, setSidebarCompact] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Balance and Wallet state
  const [balance, setBalance] = useState(() => {
    const saved = Number(window.localStorage.getItem('chicago-demo-balance'))
    return Number.isFinite(saved) && saved > 0 ? saved : 10_000
  })
  const [balancePulse, setBalancePulse] = useState(false)
  const withdrawalBalance = 0
  const bonusBalance = 0
  const [walletModalOpen, setWalletModalOpen] = useState(false)

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsCount, setNotificationsCount] = useState(2)

  // Playable Games
  const [activeMosswing, setActiveMosswing] = useState(false)
  const [activeArcadeGame, setActiveArcadeGame] = useState<ArenaGameId | null>(null)
  const [activeMemo, setActiveMemo] = useState(false)
  const [activeWordSearch, setActiveWordSearch] = useState(false)
  const [activeDictation, setActiveDictation] = useState(false)
  const [activeTapTape, setActiveTapTape] = useState(false)
  const [activeHeadFootball, setActiveHeadFootball] = useState(false)
  const [activeFootball19, setActiveFootball19] = useState(false)
  const [publicRoomJoin, setPublicRoomJoin] = useState<PublicRoom | null>(null)

  // Duels state
  const [incomingInvites, setIncomingInvites] = useState<DuelInvite[]>([
    { id: 'inv-1', player: 'Astra Void', game: 'Basketball Stars', stake: 500, status: 'pending' },
    { id: 'inv-2', player: 'Nova Dream', game: 'Mosswing Online', stake: 1000, status: 'pending' },
  ])
  const [sentInvites, setSentInvites] = useState<DuelInvite[]>([])
  const [invitePlayer, setInvitePlayer] = useState('')
  const [inviteStake, setInviteStake] = useState('500')
  const [selectedInviteGame, setSelectedInviteGame] = useState('Basketball Stars')

  // Toast notification
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2800)
  }

  const updateDemoBalance = useCallback((value: number) => {
    setBalance(value)
    setBalancePulse(true)
    window.setTimeout(() => setBalancePulse(false), 700)
  }, [])

  // Update HTML body attribute on theme change
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    window.localStorage.setItem('game_arena_theme', theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('chicago-demo-balance', String(balance))
  }, [balance])

  useEffect(() => {
    const revealLoadedImage = (event: Event) => {
      if (event.target instanceof HTMLImageElement && event.target.naturalWidth > 0) {
        event.target.classList.add('is-image-loaded')
      }
    }

    document.addEventListener('load', revealLoadedImage, true)
    document.querySelectorAll('img').forEach((image) => {
      if (image.complete && image.naturalWidth > 0) image.classList.add('is-image-loaded')
    })

    return () => document.removeEventListener('load', revealLoadedImage, true)
  }, [])

  function toggleTheme() {
    setTheme((prev) => prev === 'dark' ? 'neon' : prev === 'neon' ? 'light' : prev === 'light' ? 'lime' : 'dark')
  }

  function handleSendDuel(e: FormEvent) {
    e.preventDefault()
    if (!invitePlayer.trim()) {
      showToast('Veuillez entrer le pseudo du joueur.')
      return
    }
    const amount = Number(inviteStake) || 500
    setSentInvites((prev) => [
      {
        id: `sent-${Date.now()}`,
        player: invitePlayer.trim(),
        game: selectedInviteGame,
        stake: amount,
        status: 'pending',
      },
      ...prev,
    ])
    setInvitePlayer('')
    showToast(`DÃ©fi envoyÃ© Ã  ${invitePlayer.trim()} pour ${amount} XOF !`)
  }

  // Launch a game
  function handleLaunchGame(game: typeof allGames[0]) {
    setPublicRoomJoin(null)
    if (game.id === 'memo-5x5') {
      setActiveMemo(true)
      return
    }
    if (game.id === 'word-search') {
      setActiveWordSearch(true)
      return
    }
    if (game.id === 'dictation-duel') {
      setActiveDictation(true)
      return
    }
    if (game.id === 'head-football') {
      setActiveHeadFootball(true)
      return
    }
    if (game.id === 'tap-tape-arena') {
      setActiveTapTape(true)
      return
    }
    if (game.id === 'mosswing-online') {
      setActiveMosswing(true)
      return
    }
    if (game.id === 'quantum-duel') {
      setActiveArcadeGame('tic-tac-toe')
      return
    }
    if (game.arcadeGameId) {
      setActiveArcadeGame(game.arcadeGameId)
      return
    }
    // For demo games, launch arcade runner or duel
    showToast(`Lancement de ${game.title}...`)
    setActiveArcadeGame('ball-rush')
  }

  function joinPublicRoom(room: PublicRoom) {
    setPublicRoomJoin(room)
    if (room.game === 'tic-tac-toe') {
      setActiveArcadeGame('tic-tac-toe')
    } else if (['ping-pong', 'basketball-stars', 'ball-rush', 'cannon-duel', 'forest-bridge', 'damned-maze', 'princess-race', 'grotte-aux-couteaux', 'colonnes-du-canyon', 'arena-helice', 'duel-de-troncs'].includes(room.game)) {
      setActiveArcadeGame(room.game as ArcadeGameId)
    } else if (room.game === 'football-19') {
      setActiveFootball19(true)
    } else if (room.game === 'memo-5x5') {
      setActiveMemo(true)
    } else if (room.game === 'word-search') {
      setActiveWordSearch(true)
    } else if (room.game === 'dictation-duel') {
      setActiveDictation(true)
    } else if (room.game === 'head-football') {
      setActiveHeadFootball(true)
    } else if (room.game === 'tap-tape-arena') {
      setActiveTapTape(true)
    } else if (room.game === 'mosswing-online') {
      setActiveMosswing(true)
    }
  }

  // If Simple Intro is active
  if (showIntro) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <SimpleIntro onEnter={() => setShowIntro(false)} />
      </Suspense>
    )
  }

  if (activeMemo) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <ArenaRoom
          game="memo-5x5"
          title="MÃ©mo 5Ã—5"
          publicJoin={publicRoomJoin}
          onWalletBalance={updateDemoBalance}
          onClose={() => { setActiveMemo(false); setPublicRoomJoin(null) }}
          renderGame={({ room, local, onClose, onAction }) => (
            <MemoGame room={room} local={local} onAction={onAction} onClose={onClose} />
          )}
        />
      </Suspense>
    )
  }

  if (activeWordSearch) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <ArenaRoom
          game="word-search"
          title="Chasse aux mots"
          publicJoin={publicRoomJoin}
          onWalletBalance={updateDemoBalance}
          onClose={() => { setActiveWordSearch(false); setPublicRoomJoin(null) }}
          renderGame={({ room, local, onClose, onAction }) => (
            <WordSearchGame room={room} local={local} onAction={onAction} onClose={onClose} />
          )}
        />
      </Suspense>
    )
  }

  if (activeDictation) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <ArenaRoom
          game="dictation-duel"
          title="Dictée Éclair"
          publicJoin={publicRoomJoin}
          onWalletBalance={updateDemoBalance}
          onClose={() => { setActiveDictation(false); setPublicRoomJoin(null) }}
          renderGame={({ room, onClose, onAction }) => (
            <DictationGame room={room} onAction={onAction} onClose={onClose} />
          )}
        />
      </Suspense>
    )
  }

  if (activeFootball19) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <ArenaRoom
          game="football-19"
          title="Football 19"
          publicJoin={publicRoomJoin}
          onWalletBalance={updateDemoBalance}
          onClose={() => { setActiveFootball19(false); setPublicRoomJoin(null) }}
          renderGame={({ room, onClose, onAction }) => (
            <SoccerArena room={room} onAction={onAction} onClose={onClose} />
          )}
        />
      </Suspense>
    )
  }

  if (activeHeadFootball) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <ArenaRoom
          game="head-football"
          title="Head Football"
          publicJoin={publicRoomJoin}
          onWalletBalance={updateDemoBalance}
          onClose={() => { setActiveHeadFootball(false); setPublicRoomJoin(null) }}
          renderGame={({ room, local, onAction }) => (
            <HeadFootballGame room={room} local={local} onAction={onAction} />
          )}
        />
      </Suspense>
    )
  }

  // If TapTape Arena is open
  if (activeTapTape) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <ArenaRoom
          game="tap-tape-arena"
          title="Tape-Tape Arena"
          publicJoin={publicRoomJoin}
          onWalletBalance={updateDemoBalance}
          onClose={() => { setActiveTapTape(false); setPublicRoomJoin(null) }}
          renderGame={({ room, onClose, onAction }) => (
            <TapTapeArena onClose={onClose} room={room} onAction={onAction} />
          )}
        />
      </Suspense>
    )
  }

  // If Mosswing 3D WebGL is open
  if (activeMosswing) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <MosswingOnline
          publicJoin={publicRoomJoin}
          onWalletBalance={updateDemoBalance}
          onClose={() => { setActiveMosswing(false); setPublicRoomJoin(null) }}
        />
      </Suspense>
    )
  }

  // If an Arcade duel game is open
  if (activeArcadeGame) {
    if (activeArcadeGame === 'tic-tac-toe') {
      return (
        <Suspense fallback={<GameLoadingFallback />}>
          <TicTacToeOnline publicJoin={publicRoomJoin} onClose={() => { setActiveArcadeGame(null); setPublicRoomJoin(null) }} />
        </Suspense>
      )
    }
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <ArcadeOnline
          game={activeArcadeGame}
          publicJoin={publicRoomJoin}
          onWalletBalance={updateDemoBalance}
          onClose={() => { setActiveArcadeGame(null); setPublicRoomJoin(null) }}
        />
      </Suspense>
    )
  }

  const isDark = theme !== 'light'
  const searchTerm = searchQuery.trim().toLocaleLowerCase()
  const matchingGames = searchTerm
    ? allGames.filter((game) => game.title.toLocaleLowerCase().includes(searchTerm)).slice(0, 5)
    : []
  const desktopNavigation: Array<{ page: Page; label: string; icon: typeof Home }> = [
    { page: 'popular', label: 'Accueil', icon: Home },
    { page: 'games', label: 'Jeux', icon: Grid2X2 },
    { page: 'performance', label: 'Classement', icon: BarChart3 },
    { page: 'invite', label: 'Inviter', icon: UserPlus },
    { page: 'account', label: 'Mon compte', icon: User },
  ]

  return (
    <div
      className={`chicago-world desktop-app-shell ${sidebarCompact ? 'is-sidebar-compact' : ''} relative isolate min-h-screen w-full transition-colors duration-200 overflow-x-clip ${
        theme === 'neon' ? 'bg-[#0c0611] text-white'
          : theme === 'lime' ? 'bg-[#10170b] text-white'
          : isDark ? 'bg-black text-white'
            : 'bg-[#DCEEFF] text-[#0F172A]'
      }`}
    >
      {/* Toast Popup */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full text-xs font-semibold shadow-xl bg-purple-600 text-white animate-bounce">
          {toast}
        </div>
      )}

      <div className="chicago-ambient" aria-hidden="true">
        <span className="chicago-ambient-token chicago-ambient-coin chicago-ambient-one">$</span>
        <span className="chicago-ambient-token chicago-ambient-diamond chicago-ambient-two">♦</span>
        <span className="chicago-ambient-token chicago-ambient-star chicago-ambient-three">✦</span>
        <span className="chicago-ambient-token chicago-ambient-coin chicago-ambient-four">✦</span>
        <span className="chicago-ambient-token chicago-ambient-diamond chicago-ambient-five">✧</span>
        <span className="chicago-ambient-token chicago-ambient-coin chicago-ambient-six">$</span>
      </div>

      <aside className={`desktop-sidebar ${sidebarCompact ? 'is-compact' : ''}`} aria-label="Navigation principale">
        <button type="button" className="desktop-sidebar-brand" onClick={() => setPage('popular')} aria-label="Accueil Chicago">
          <ChicagoWordmark className="desktop-brand-mark" />
          <span className="desktop-brand-copy"><small>ARCADE</small></span>
        </button>
        <div className="desktop-sidebar-label">MENU PRINCIPAL</div>
        <nav className="desktop-sidebar-nav">
          {desktopNavigation.map(({ page: targetPage, label, icon: Icon }) => (
            <button
              type="button"
              key={targetPage}
              onClick={() => setPage(targetPage)}
              className={`desktop-sidebar-link ${page === targetPage ? 'is-active' : ''}`}
              title={sidebarCompact ? label : undefined}
              aria-current={page === targetPage ? 'page' : undefined}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="desktop-sidebar-spacer" />
        <div className="desktop-sidebar-promo">
          <Sparkles size={17} />
          <strong>Prêt à jouer </strong>
          <span>Découvre les jeux multijoueurs.</span>
          <button type="button" onClick={() => setPage('games')}>Explorer les jeux</button>
        </div>
        <button
          type="button"
          className="desktop-sidebar-toggle"
          onClick={() => setSidebarCompact((compact) => !compact)}
          aria-label={sidebarCompact ? 'Développer le menu' : 'Réduire le menu'}
          title={sidebarCompact ? 'Développer le menu' : 'Réduire le menu'}
        >
          {sidebarCompact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          <span>Réduire le menu</span>
        </button>
      </aside>

      {/* Main Mobile App Container: 440px max width for authentic mobile frame matching the images */}
      <div className="desktop-content-shell relative z-10 w-full max-w-[440px] md:max-w-[900px] xl:max-w-[1200px] 2xl:max-w-[1440px] mx-auto min-h-screen flex flex-col pb-28 shadow-2xl">
        {/* ========================================================
            HEADER BANNER (Minecraft Avatar, Chicago Brand, Balance, Bell, Theme Switcher)
           ======================================================== */}
        <header className="desktop-main-header relative px-4 pt-3 pb-3 flex items-center justify-between overflow-hidden">
          {/* Light Theme Background Floating Grass Block */}
          {!isDark && (
            <img
              src="/images/extracted/header-grass-light.png"
              alt=""
              className="absolute -top-1 -right-1 w-14 h-16 object-contain pointer-events-none opacity-90 select-none z-0"
              width={62}
              height={90}
              decoding="async"
              onError={hideBrokenImage}
            />
          )}

          {/* Left: Minecraft Character Avatar */}
          <div className="desktop-avatar relative z-10 flex-shrink-0 cursor-pointer" onClick={() => setPage('account')}>
            <div className="relative w-20 h-20 -my-2 flex items-center justify-center">
              <img
                src={isDark ? '/images/extracted/avatar-dark.png' : '/images/extracted/avatar-light.png'}
                alt="Minecraft Avatar"
                className="w-full h-full object-contain filter drop-shadow-md select-none"
                width={145}
                height={145}
                decoding="async"
                onError={hideBrokenImage}
              />
            </div>
          </div>

          {/* Center: Chrome wordmark & Subtitle */}
          <div className="desktop-wordmark relative z-10 flex flex-col items-center justify-center text-center px-1">
            <ChicagoWordmark className="chicago-header-wordmark" />
            <span
              className={`text-[9.5px] font-medium tracking-tight mt-0.5 whitespace-nowrap ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Jouez • Gagnez • Profitez
            </span>
          </div>

          <div className="desktop-search-box">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && matchingGames.length) handleLaunchGame(matchingGames[0])
              }}
              placeholder="Rechercher un jeu, une équipe..."
              aria-label="Rechercher un jeu ou une équipe"
            />
            {searchTerm && (
              <div className="desktop-search-results">
                {matchingGames.map((game) => (
                  <button type="button" key={game.id} onClick={() => { handleLaunchGame(game); setSearchQuery('') }}>
                    <Gamepad2 size={16} /><span>{game.title}</span><small>Jeu</small>
                  </button>
                ))}
                {!matchingGames.length && <p>Aucun résultat</p>}
              </div>
            )}
          </div>

          {/* Right: Balance Pill, Notification Bell & Theme Switch */}
          <div className="relative z-10 flex items-center gap-1.5 flex-shrink-0">
            {/* Balance Pill */}
            <div
              onClick={() => setWalletModalOpen(true)}
              title="CrÃ©dits de dÃ©monstration uniquement â€” aucun paiement rÃ©el"
              className={`flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-2xl cursor-pointer transition-transform active:scale-95 ${
                isDark ? 'bg-[#161928] border border-white/10 shadow-sm'
                  : 'bg-white border border-slate-100 shadow-sm'
              }`}
            >
              {/* Gold Coin Icon */}
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-inner">
                <span className="text-[9px] font-black text-amber-900">C</span>
              </div>
              {/* Balance Amount */}
              <span
                className={`text-xs font-bold leading-none ${balancePulse ? 'demo-balance-pulse' : ''} ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {balance.toLocaleString('fr-FR')}
              </span>
              {/* Plus Button */}
              <button
                type="button"
                className={`w-4 h-4 rounded-md flex items-center justify-center font-bold text-xs transition-colors ${
                  isDark ? 'bg-[#FBBF24] text-slate-950' : 'bg-[#6B38FB] text-white'
                }`}
              >
                <Plus size={11} strokeWidth={3} />
              </button>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-transform active:scale-95 ${
                isDark ? 'bg-[#161928] border border-white/10 text-white'
                  : 'bg-white border border-slate-100 text-slate-800 shadow-sm'
              }`}
              title="Notifications"
            >
              <Bell size={15} />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white text-[8.5px] font-black flex items-center justify-center border-2 border-transparent">
                  {notificationsCount}
                </span>
              )}
            </button>

            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                isDark ? 'bg-[#161928] border border-purple-500/40 text-[#FBBF24] hover:bg-purple-950/40'
                  : 'bg-white border border-purple-200 text-[#6B38FB] shadow-sm hover:bg-purple-50'
              }`}
              title={`Thème actuel : ${theme === 'neon' ? 'Violet néon' : theme === 'lime' ? 'Vert citron' : theme === 'dark' ? 'Sombre' : 'Clair'}. Cliquer pour changer`}
            >
                  {theme === 'neon' ? <Sparkles size={15} /> : theme === 'lime' ? <Leaf size={15} /> : isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              type="button"
              onClick={() => setPage('account')}
              className="desktop-profile-button"
              title="Mon compte"
              aria-label="Mon compte"
            >
              <User size={17} />
            </button>
          </div>
        </header>

        <div className="desktop-page-content">
        {/* ========================================================
            CATEGORY HORIZONTAL PILLS (Populaires, Sports, E-sport, Casino, Jeux)
           ======================================================== */}
        <div className="desktop-category-bar px-4 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
          {[
            { label: 'Populaires', icon: Trophy },
            { label: 'Sports', icon: CircleDot },
            { label: 'E-sport', icon: Gamepad2 },
            { label: 'Casino', icon: Dices },
            { label: 'Jeux', icon: Grid2X2 },
          ].map(({ label, icon: Icon }) => {
            const isActive = category === label
            return (
              <button
                type="button"
                key={label}
                onClick={() => setCategory(label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                  isActive
                    ? 'bg-[#6B38FB] text-white shadow-md shadow-purple-600/30'
                    : isDark ? 'bg-[#161928] text-slate-300 border border-white/5 hover:bg-[#1f2338]'
                      : 'bg-white text-slate-700 border border-slate-100 shadow-sm hover:bg-slate-50'
                }`}
              >
                <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        {/* ========================================================
            MAIN PAGE CONTENT SWITCHER
           ======================================================== */}
        {page === 'popular' && (
          <div className="desktop-page desktop-popular-page flex flex-col gap-4 px-4 pt-2">
            {/* ----------------------------------------------------
                PROMOTIONS CAROUSEL (DÃ‰FILEMENT HORIZONTAL)
               ---------------------------------------------------- */}
            <div className="promotion-carousel desktop-promotions -mx-4">
              <div className="promotion-track flex w-max items-stretch gap-3 px-4 select-none">
                {[...promotions, ...promotions].map((promo, index) => (
                <div
                  key={`${promo.title}-${index}`}
                  onClick={() => showToast(`Promotion ${promo.title} activÃ©e !`)}
                  className="relative w-[228px] h-[142px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-95 border border-white/10"
                >
                  <img
                    {...getResponsiveImageProps(promo.image, '228px')}
                    alt={promo.title}
                    className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-900 to-indigo-950 object-cover"
                    width={228}
                    height={142}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                    onError={hideBrokenImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <div className="text-sm font-extrabold leading-tight">{promo.title}</div>
                    <div className="text-[11px] text-white/80 font-semibold mt-0.5">{promo.desc}</div>
                  </div>
                </div>
                ))}
              </div>
            </div>

            {/* ----------------------------------------------------
                SECTION 1: TOP 10 DES PERFORMEURS (DÃ‰FILEMENT HORIZONTAL)
               ---------------------------------------------------- */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-4 bg-[#8B5CF6] rounded-full" />
                  <h2
                    className={`text-sm font-black tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Top 10 des performeurs
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPage('performance')}
                  className="flex items-center text-xs font-bold text-[#8B5CF6] hover:underline"
                >
                  <span>Voir tout</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Performer Cards Horizontal Scroll Container */}
              <div
                className="desktop-performer-grid flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 select-none"
                onWheel={(event) => {
                  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) event.currentTarget.scrollLeft += event.deltaY
                }}
              >
                {allTopPerformers.map((player) => (
                  <div
                    key={player.rank}
                    onClick={() => setPage('performance')}
                    className={`relative w-[136px] flex-shrink-0 p-2.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-95 ${
                      isDark ? 'bg-[#161928] border border-white/5'
                        : 'bg-white border border-slate-100 shadow-sm'
                    }`}
                  >
                    {/* Top Left Ribbon Medal Badge (1, 2, 3) or number tag */}
                    <div className="absolute top-2 left-2 z-10">
                      {player.rank <= 3 ? (
                        <MedalRibbon rank={player.rank as 1 | 2 | 3} />
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md bg-purple-600/20 text-purple-400 text-[10px] font-black">
                          #{player.rank}
                        </span>
                      )}
                    </div>

                    {/* Voxel 3D Image (Grass block / Diamond / Creeper) */}
                    <div className="w-full h-20 flex items-center justify-center mt-2 mb-1 overflow-hidden rounded-xl bg-slate-900/10">
                      <img
                        {...getResponsiveImageProps(player.image, '176px', [128, 256, 384, 576])}
                        alt={player.name}
                        className="performer-photo h-full w-full rounded-xl object-cover object-center select-none"
                        width={176}
                        height={128}
                        loading="lazy"
                        decoding="async"
                        onError={hideBrokenImage}
                      />
                    </div>

                    {/* Player Name */}
                    <div
                      className={`text-center font-bold text-[11px] truncate ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {player.name}
                    </div>

                    {/* Amount */}
                    <div
                      className={`text-center font-extrabold text-[10.5px] mt-0.5 mb-2 whitespace-nowrap ${
                        isDark ? 'text-[#FACC15]' : 'text-[#4F46E5]'
                      }`}
                    >
                      {player.amount}
                    </div>

                  </div>
                ))}
              </div>
            </section>

            {/* ----------------------------------------------------
                SECTION 2: LES JEUX (DÃ‰FILEMENT HORIZONTAL)
               ---------------------------------------------------- */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-4 bg-[#8B5CF6] rounded-full" />
                  <h2
                    className={`text-sm font-black tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Les jeux
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPage('games')}
                  className="flex items-center text-xs font-bold text-[#8B5CF6] hover:underline"
                >
                  <span>Voir tout ({allGames.length})</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Unique playable games */}
              <div
                className="desktop-games-grid flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 select-none"
                onWheel={(event) => {
                  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) event.currentTarget.scrollLeft += event.deltaY
                }}
              >
                {allGames.map((game) => (
                  <button
                    type="button"
                    key={game.id}
                    onClick={() => handleLaunchGame(game)}
                    aria-label={`Lancer ${game.title}`}
                    className="game-category-tile"
                  >
                    <img
                      {...getResponsiveImageProps(game.image, '120px', [64, 128, 320, 400, 640])}
                      alt=""
                      className="sports-category-image"
                      width={120}
                      height={198}
                      loading="lazy"
                      decoding="async"
                      onError={hideBrokenImage}
                    />
                    <span className="sports-category-label">{game.title}</span>
                    <span className="sports-category-status">Jeu disponible</span>
                  </button>
                ))}
              </div>
            </section>

            <PublicRooms onJoin={joinPublicRoom} onWalletBalance={updateDemoBalance} />
          </div>
        )}

        {page === 'games' && (
          <div className="desktop-page desktop-games-page flex flex-col gap-4 px-4 pt-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage('popular')}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-[#8B5CF6]"
              >
                â† Retour
              </button>
              <span className="text-xs font-bold text-slate-400">{allGames.length} jeux</span>
            </div>
            <h1 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Tous les jeux</h1>
            <div
              className="desktop-games-catalog no-scrollbar grid grid-cols-2 gap-3 sm:grid-cols-3"
              onWheel={(event) => {
                if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) event.currentTarget.scrollLeft += event.deltaY
              }}
            >
              {allGames.map((game) => (
                <article
                  key={game.id}
                  className={`rounded-2xl p-2 ${
                    isDark ? 'bg-[#161928] border border-white/5'
                      : 'bg-white border border-slate-100 shadow-sm'
                  }`}
                >
                  <img
                    {...getResponsiveImageProps(game.image, '(min-width: 640px) 33vw, 50vw')}
                    alt={game.title}
                    className="h-28 w-full rounded-xl bg-slate-900/10 object-cover"
                    width={320}
                    height={112}
                    loading="lazy"
                    decoding="async"
                    onError={hideBrokenImage}
                  />
                  <h2 className={`mt-2 truncate text-center text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {game.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleLaunchGame(game)}
                    className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-[#6B38FB] py-2 text-xs font-bold text-white"
                  >
                    Jouer <Play size={11} fill="currentColor" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            PAGE 2: PERFORMANCES
           ======================================================== */}
        {page === 'performance' && (
          <div className="desktop-page flex flex-col gap-4 px-4 pt-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-5 bg-[#8B5CF6] rounded-full" />
              <h1 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Classement & Performances
              </h1>
            </div>

            {/* Performance Overview Banner */}
            <div
              className={`p-4 rounded-2xl flex items-center justify-between ${
                isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
              }`}
            >
              <div>
                <span className="text-xs text-slate-400 font-semibold">Gains cumulÃ©s</span>
                <div className={`text-xl font-black ${isDark ? 'text-[#FACC15]' : 'text-[#6B38FB]'}`}>
                  +2 450 000 XOF
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-semibold">Votre rang</span>
                <div className="text-base font-bold text-emerald-500">Top 12 mondial</div>
              </div>
            </div>

            {/* Full Top 10 Performers Leaderboard */}
            <div
              className={`rounded-2xl p-3 flex flex-col gap-2 ${
                isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
              }`}
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Top 10 des performeurs mondiaux
              </h3>

              {allTopPerformers.map((p) => (
                <div
                  key={p.rank}
                  className={`flex items-center justify-between p-2 rounded-xl ${
                    isDark ? 'bg-[#0B0D19]/60' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {p.rank <= 3 ? (
                      <MedalRibbon rank={p.rank as 1 | 2 | 3} />
                    ) : (
                      <span className="text-xs font-black text-purple-400 w-6 text-center">#{p.rank}</span>
                    )}
                    <img
                      {...getResponsiveImageProps(p.image, '40px', [128, 256, 384, 576])}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      onError={hideBrokenImage}
                    />
                    <span className="font-bold text-xs">{p.name}</span>
                  </div>
                  <span className={`font-black text-xs ${isDark ? 'text-[#FACC15]' : 'text-[#4F46E5]'}`}>
                    {p.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            PAGE 4: INVITER (DÃ‰FIS 1 CONTRE 1)
           ======================================================== */}
        {page === 'invite' && (
          <div className="desktop-page flex flex-col gap-4 px-4 pt-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-5 bg-[#8B5CF6] rounded-full" />
              <h1 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                DÃ©fis & Invitations 1v1
              </h1>
            </div>

            {/* Launch Challenge Form */}
            <form
              onSubmit={handleSendDuel}
              className={`p-4 rounded-2xl flex flex-col gap-3 ${
                isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
              }`}
            >
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lancer un dÃ©fi
              </span>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">
                  Pseudo du joueur
                </label>
                <input
                  type="text"
                  placeholder="Ex: Nova Dream, Rift Echo..."
                  value={invitePlayer}
                  onChange={(e) => setInvitePlayer(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border ${
                    isDark ? 'bg-[#0B0D19] border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Jeu</label>
                  <select
                    value={selectedInviteGame}
                    onChange={(e) => setSelectedInviteGame(e.target.value)}
                    className={`w-full py-2 px-2 rounded-xl text-xs font-semibold border ${
                      isDark ? 'bg-[#0B0D19] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {allGames.map((game) => (
                      <option key={game.id} value={game.title}>
                        {game.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Mise (XOF)</label>
                  <input
                    type="number"
                    value={inviteStake}
                    onChange={(e) => setInviteStake(e.target.value)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold border ${
                      isDark ? 'bg-[#0B0D19] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#6B38FB] text-white shadow-md shadow-purple-600/30 hover:bg-[#5B2AE8] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Swords size={14} />
                <span>Envoyer le dÃ©fi</span>
              </button>
            </form>

            {/* Incoming Challenges */}
            <div
              className={`p-4 rounded-2xl flex flex-col gap-2 ${
                isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
              }`}
            >
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                DÃ©fis reÃ§us en attente ({incomingInvites.filter((i) => i.status === 'pending').length})
              </span>
              {incomingInvites
                .filter((i) => i.status === 'pending')
                .map((inv) => (
                  <div
                    key={inv.id}
                    className={`p-3 rounded-xl flex items-center justify-between ${
                      isDark ? 'bg-[#0B0D19]/60' : 'bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{inv.player}</div>
                      <div className="text-[10px] text-slate-400">
                        {inv.game} â€¢ {inv.stake} XOF
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIncomingInvites((prev) =>
                            prev.map((i) => (i.id === inv.id ? { ...i, status: 'accepted' } : i)),
                          )
                          showToast(`DÃ©fi acceptÃ© ! Lancement de ${inv.game}...`)
                          const game = allGames.find((candidate) => candidate.title === inv.game)
                          if (game) handleLaunchGame(game)
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIncomingInvites((prev) =>
                            prev.map((i) => (i.id === inv.id ? { ...i, status: 'refused' } : i)),
                          )
                          showToast('DÃ©fi refusÃ©.')
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-600/80 text-white hover:bg-red-700"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Sent Challenges */}
            {sentInvites.length > 0 && (
              <div
                className={`p-4 rounded-2xl flex flex-col gap-2 ${
                  isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
                }`}
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  DÃ©fis envoyÃ©s ({sentInvites.length})
                </span>
                {sentInvites.map((inv) => (
                  <div
                    key={inv.id}
                    className={`p-3 rounded-xl flex items-center justify-between ${
                      isDark ? 'bg-[#0B0D19]/60' : 'bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">Ã€: {inv.player}</div>
                      <div className="text-[10px] text-slate-400">
                        {inv.game} â€¢ {inv.stake} XOF
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                      En attente
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            PAGE 5: COMPTE & CARTES DE SOLDE (CARROUSEL DE CARTES)
           ======================================================== */}
        {page === 'account' && (
          <div className="desktop-page account-page flex flex-col gap-4 px-4 pt-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-5 bg-[#8B5CF6] rounded-full" />
              <h1 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Mon Compte & Soldes
              </h1>
            </div>

            {/* User Profile Overview */}
            <div className={`account-profile flex items-center gap-3 rounded-2xl p-4 ${
              isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
            }`}>
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-purple-600/20 flex items-center justify-center p-1 border border-purple-500/30">
                <img
                  src={isDark ? '/images/extracted/avatar-dark.png' : '/images/extracted/avatar-light.png'}
                  alt="Player"
                  className="w-full h-full object-contain"
                  width={145}
                  height={145}
                  loading="lazy"
                  decoding="async"
                  onError={hideBrokenImage}
                />
              </div>
              <div>
                <h3 className="font-black text-sm">Champion Player</h3>
                <span className="text-[10px] text-purple-500 font-bold">ID: #GA-89214 â€¢ Rang VIP Platine</span>
              </div>
            </div>

            {/* Soldes du compte */}
            <div className="account-balances">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mes soldes</span>
              <div className="account-balance-grid mt-3 grid gap-3">
                <div className="account-balance-card account-balance-primary flex items-center justify-between p-3 rounded-2xl bg-sky-400/10 border border-sky-400/25">
                  <span className={`text-sm font-bold ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                    Solde du compte
                  </span>
                  <span className={`text-sm font-black ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                    {balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} XOF
                  </span>
                </div>
                <div className="account-balance-card flex items-center justify-between p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center">
                      <Minus size={18} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-bold text-red-500">Retrait</span>
                  </div>
                  <span className="text-sm font-black text-red-500">
                    âˆ’{withdrawalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} XOF
                  </span>
                </div>
                <div className="account-balance-card flex items-center justify-between p-3 rounded-2xl bg-lime-400/10 border border-lime-400/25">
                  <span className={`text-sm font-bold ${isDark ? 'text-lime-400' : 'text-lime-700'}`}>
                    Solde bonus
                  </span>
                  <span className={`text-sm font-black ${isDark ? 'text-lime-400' : 'text-lime-700'}`}>
                    {bonusBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} XOF
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Recharger / Retirer) */}
            <div className="account-actions grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWalletModalOpen(true)}
                className="py-3 px-4 rounded-2xl bg-[#6B38FB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-[#5B2AE8] active:scale-95 transition-all"
              >
                <Plus size={16} />
                <span>Recharger solde</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Demande de retrait dÃ©mo initiÃ©e.')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  isDark ? 'bg-[#161928] border-white/10 text-white hover:bg-[#1f2338]'
                    : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:bg-slate-50'
                }`}
              >
                <CreditCard size={16} />
                <span>Retirer</span>
              </button>
            </div>

            {/* Settings & Extra Options */}
            <div
              className={`account-settings rounded-2xl divide-y ${
                isDark ? 'bg-[#161928] border border-white/5 divide-slate-800'
                  : 'bg-white shadow-sm border border-slate-100 divide-slate-100'
              }`}
            >
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full p-3 flex items-center justify-between text-xs font-bold hover:opacity-80 text-left"
              >
                <div className="flex items-center gap-2">
                  {theme === 'neon' ? (
                    <Sparkles size={16} className="text-pink-400" />
                  ) : theme === 'lime' ? (
                    <Leaf size={16} className="text-lime-400" />
                  ) : isDark ? (
                    <Sun size={16} className="text-[#FBBF24]" />
                  ) : (
                    <Moon size={16} className="text-[#6B38FB]" />
                  )}
                  <span>
                    ThÃ¨me : {theme === 'neon' ? 'Violet néon' : theme === 'lime' ? 'Vert citron' : theme === 'dark' ? 'Sombre' : 'Clair'}
                  </span>
                </div>
                <span className="text-[10px] text-purple-500">Basculer</span>
              </button>

              <button
                type="button"
                onClick={() => setShowIntro(true)}
                className="w-full p-3 flex items-center justify-between text-xs font-bold hover:opacity-80 text-left"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>Revoir l&apos;intro Chicago</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setNotificationsOpen(true)}
                className="w-full p-3 flex items-center justify-between text-xs font-bold hover:opacity-80 text-left"
              >
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-purple-500" />
                  <span>Notifications</span>
                </div>
                <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                  {notificationsCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Support client 24/7 ouvert via chat.')}
                className="w-full p-3 flex items-center justify-between text-xs font-bold hover:opacity-80 text-left"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle size={16} className="text-blue-500" />
                  <span>Aide et Support</span>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            BOTTOM NAVIGATION BAR
           ======================================================== */}
        <nav
          className={`desktop-bottom-nav fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] md:max-w-[900px] xl:max-w-[1200px] 2xl:max-w-[1440px] z-50 px-3 py-1 flex items-center justify-around select-none transition-colors duration-200 ${
            isDark ? 'bg-[#0E101A] border-t border-[#1C2035]'
              : 'bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'
          }`}
        >
          {/* 1. Accueil */}
          <button
            type="button"
            onClick={() => setPage('popular')}
            className="flex flex-col items-center justify-center py-1 flex-1 relative group"
          >
            <Home
              size={19}
              className={`transition-colors ${
                page === 'popular' ? 'text-[#8B5CF6]' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <span
              className={`text-[10px] font-bold mt-0.5 transition-colors ${
                page === 'popular' ? 'text-[#8B5CF6]' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Accueil
            </span>
            {page === 'popular' && (
              <span className="w-6 h-0.5 bg-[#8B5CF6] rounded-full absolute -bottom-0.5" />
            )}
          </button>

          {/* 2. Performances */}
          <button
            type="button"
            onClick={() => setPage('performance')}
            className="flex flex-col items-center justify-center py-1 flex-1 group"
          >
            <BarChart3
              size={19}
              className={`transition-colors ${
                page === 'performance' ? 'text-[#8B5CF6]' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <span
              className={`text-[10px] font-semibold mt-0.5 transition-colors ${
                page === 'performance' ? 'text-[#8B5CF6]' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Performances
            </span>
          </button>

          {/* 3. Inviter */}
          <button
            type="button"
            onClick={() => setPage('invite')}
            className="flex flex-col items-center justify-center py-1 flex-1 group"
          >
            <UserPlus
              size={19}
              className={`transition-colors ${
                page === 'invite' ? 'text-[#8B5CF6]' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <span
              className={`text-[10px] font-semibold mt-0.5 transition-colors ${
                page === 'invite' ? 'text-[#8B5CF6]' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Inviter
            </span>
          </button>

          {/* 4. Compte */}
          <button
            type="button"
            onClick={() => setPage('account')}
            className="flex flex-col items-center justify-center py-1 flex-1 group"
          >
            <User
              size={19}
              className={`transition-colors ${
                page === 'account' ? 'text-[#8B5CF6]' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <span
              className={`text-[10px] font-semibold mt-0.5 transition-colors ${
                page === 'account' ? 'text-[#8B5CF6]' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Compte
            </span>
          </button>
        </nav>
        </div>

        {/* ========================================================
            MODAL: WALLET RECHARGE
           ======================================================== */}
        {walletModalOpen && (
          <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 ${
                isDark ? 'bg-[#161928] text-white border border-white/10' : 'bg-white text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-purple-500" />
                  <h3 className="font-black text-sm">Crédits de démonstration</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setWalletModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className={`rounded-2xl p-6 text-center ${isDark ? 'bg-[#0B0D19]' : 'bg-slate-50'}`}>
                <strong className="block text-4xl font-black">{balance.toLocaleString('fr-FR')}</strong>
                <span className="mt-1 block text-sm text-slate-400">crédits de démonstration</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Ces crédits fictifs servent uniquement aux parties. Aucun dépôt, retrait ou paiement réel n’est possible.
              </p>
              <button
                type="button"
                onClick={() => setWalletModalOpen(false)}
                className="w-full py-3 rounded-xl font-bold text-xs bg-[#6B38FB] text-white shadow-lg shadow-purple-600/30 hover:bg-[#5B2AE8] active:scale-95 transition-all mt-1"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL: NOTIFICATIONS (2 notifications)
           ======================================================== */}
        {notificationsOpen && (
          <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150 ${
                isDark ? 'bg-[#161928] text-white border border-white/10' : 'bg-white text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-purple-500" />
                  <h3 className="font-black text-sm">Notifications ({notificationsCount})</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className={`p-3 rounded-2xl flex flex-col gap-1 ${
                    isDark ? 'bg-[#0B0D19]' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-500">Bonus de Bienvenue</span>
                    <span className="text-[10px] text-slate-400">Il y a 5 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    CrÃ©dits de dÃ©monstration uniquement. Aucun dÃ©pÃ´t, retrait ou paiement rÃ©el nâ€™est effectuÃ©.
                  </p>
                </div>

                <div
                  className={`p-3 rounded-2xl flex flex-col gap-1 ${
                    isDark ? 'bg-[#0B0D19]' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-500">Nouveau DÃ©fi ReÃ§u</span>
                    <span className="text-[10px] text-slate-400">Il y a 20 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Astra Void vous a invitÃ© pour un duel Basketball Stars (Mise : 500 XOF).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNotificationsCount(0)
                  setNotificationsOpen(false)
                  showToast('Toutes les notifications ont Ã©tÃ© marquÃ©es comme lues.')
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 active:scale-95 transition-all mt-1"
              >
                Tout marquer comme lu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
