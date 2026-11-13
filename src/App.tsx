import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  BarChart3,
  Bell,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Gamepad2,
  Grid2X2,
  HelpCircle,
  Home,
  Leaf,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sparkles,
  Sun,
  Swords,
  User,
  UserPlus,
  Wallet,
  X,
} from 'lucide-react'
import type { ArcadeGameId } from './ArcadeOnline'
import type { PublicRoom } from './PublicRooms'
import ChicagoWordmark from './ChicagoWordmark'
import AccountAuthPage from './AccountAuthPage'
import PublicRooms from './PublicRooms'
import { getAuthApiBaseUrl } from './multiplayer-url'
import { getResponsiveImageProps, hideBrokenImage } from './responsive-image'
import { useLocalization } from './useLocalization'
import './DesktopLayout.css'

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
const QuizArena = lazy(() => import('./QuizArena'))

type ArenaGameId = 'tic-tac-toe' | ArcadeGameId
type Page = 'popular' | 'games' | 'performance' | 'invite' | 'account'
type ThemeMode = 'dark' | 'light' | 'lime' | 'neon' | 'melbet'

type DuelInvite = {
  id: string
  player: string
  game: string
  stake: number
  status: 'pending' | 'accepted' | 'refused'
}

type ChicagoAccount = {
  id: string
  name: string
  country: string
}

function GameLoadingFallback() {
  const { t } = useLocalization()
  return (
    <div
      className="grid min-h-screen place-items-center bg-black text-sm font-bold text-slate-400"
      role="status"
      aria-live="polite"
    >
      {t('game.loading')}
    </div>
  )
}

const PROFILE_PHOTO_STORAGE_KEY = 'chicago-profile-photo'
const PROFILE_PHOTO_MAX_BYTES = 8 * 1024 * 1024

function resizeProfilePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('Impossible de préparer la photo de profil.'))
        return
      }

      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
      const width = image.naturalWidth * scale
      const height = image.naturalHeight * scale
      context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)

      try {
        const webpPhoto = canvas.toDataURL('image/webp', 0.85)
        resolve(webpPhoto.startsWith('data:image/webp') ? webpPhoto : canvas.toDataURL('image/png'))
      } catch (error) {
        reject(error)
      }
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Le fichier sélectionné ne peut pas être lu comme une image.'))
    }
    image.src = objectUrl
  })
}

// Top 10 performers
const allTopPerformers = [
  {
    rank: 1 as const,
    name: 'Astra Void',
    amount: 2_740_000,
    image: '/images/top-performer-01.jpg',
  },
  {
    rank: 2 as const,
    name: 'Rift Echo',
    amount: 2_360_000,
    image: '/images/top-performer-02.jpg',
  },
  {
    rank: 3 as const,
    name: 'Nova Dream',
    amount: 1_940_000,
    image: '/images/top-performer-03.jpg',
  },
  { rank: 4, name: 'Ion Pulse', amount: 1_650_000, image: '/images/top-performer-04.jpg' },
  { rank: 5, name: 'Comet Rift', amount: 1_420_000, image: '/images/top-performer-05.jpg' },
  { rank: 6, name: 'Kite Nova', amount: 1_190_000, image: '/images/top-performer-06.jpg' },
  { rank: 7, name: 'Nexa G', amount: 980_000, image: '/images/top-performer-07.jpg' },
  { rank: 8, name: 'Luma Fire', amount: 810_000, image: '/images/top-performer-08.jpg' },
  { rank: 9, name: 'Pixel S', amount: 690_000, image: '/images/top-performer-09.jpg' },
  { rank: 10, name: 'Vortex Max', amount: 580_000, image: '/images/top-performer-10.jpg' },
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
    id: 'quiz-arena',
    title: 'Quiz Arène',
    image: '/images/quiz-arena.jpg',
    type: 'quizarena' as const,
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
    id: 'ball-rush-3d',
    title: 'Ball Rush 3D',
    image: '/images/game-ball-rush.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'ball-rush' as ArcadeGameId,
  },
  {
    id: 'piaf-plume',
    title: 'Piaf Plume',
    image: '/images/piaf-plume.svg',
    type: 'arcade' as const,
    arcadeGameId: 'piaf-plume' as ArcadeGameId,
  },
  {
    id: 'lave-montante',
    title: 'Lave Montante',
    image: '/images/lave-montante.svg',
    type: 'arcade' as const,
    arcadeGameId: 'lave-montante' as ArcadeGameId,
  },
  {
    id: 'mirror-run',
    title: 'Mirror Run',
    image: '/images/mirror-run.svg',
    type: 'arcade' as const,
    arcadeGameId: 'mirror-run' as ArcadeGameId,
  },
  {
    id: 'ghasaq',
    title: 'Ghasaq — FPS de survie',
    image: '/images/ghasaq.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'ghasaq' as ArcadeGameId,
  },
  {
    id: 'counter-siege',
    title: 'Counter Siege',
    image: '/images/ghasaq.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'counter-siege' as ArcadeGameId,
  },
  {
    id: 'dashbot',
    title: 'DashBot',
    image: '/images/duel-de-troncs.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'dashbot' as ArcadeGameId,
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
  {
    id: 'chess-3d',
    title: 'Échecs 3D',
    image: '/images/game-stone.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'chess-3d' as ArcadeGameId,
  },
  {
    id: 'embuscade',
    title: 'Embuscade',
    image: '/images/game-western.svg',
    type: 'arcade' as const,
    arcadeGameId: 'embuscade' as ArcadeGameId,
  },
  {
    id: 'moto-taxi-afrique',
    title: 'Moto Taxi Afrique',
    image: '/images/moto-taxi-afrique.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'moto-taxi-afrique' as ArcadeGameId,
  },
  {
    id: 'chemin-de-couleurs',
    title: 'Chemin de couleurs 3D',
    image: '/images/chemin-de-couleurs.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'chemin-de-couleurs' as ArcadeGameId,
  },
  {
    id: 'duel-de-cartes',
    title: 'Duel de cartes 3D',
    image: '/images/duel-de-cartes.jpg',
    type: 'arcade' as const,
    arcadeGameId: 'duel-de-cartes' as ArcadeGameId,
  },
]

// Promotional banners use the supplied campaign artwork.
const promotions = [
  { title: 'bonus.slots', image: '/images/casino-slots.jpg', desc: 'bonus.slotsDesc' },
  { title: 'bonus.roulette', image: '/images/roulette.jpg', desc: 'bonus.rouletteDesc' },
  { title: 'bonus.pinkJackpot', image: '/images/jackpot-arcade.jpg', desc: 'bonus.oneGame' },
  { title: 'bonus.royalJackpot', image: '/images/royal-slots.jpg', desc: 'bonus.spin' },
] as const

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
  const { language, setLanguage, currency, setCurrency, languageNames, t, gameTitle, formatAmount } = useLocalization()
  const bonusRowRef = useRef<HTMLDivElement>(null)
  const [bonusCarouselPaused, setBonusCarouselPaused] = useState(false)

  // Simple splash intro state
  const [showIntro, setShowIntro] = useState(true)

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem('game_arena_theme')
    if (saved === 'light' || saved === 'lime' || saved === 'neon' || saved === 'melbet') return saved
    return 'light'
  })

  const [page, setPage] = useState<Page>('popular')
  const [authMode, setAuthMode] = useState<'register' | 'login' | null>('register')
  const [authReady, setAuthReady] = useState(false)
  const [account, setAccount] = useState<ChicagoAccount | null>(null)
  const [sidebarCompact, setSidebarCompact] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profilePhoto, setProfilePhoto] = useState(() => window.localStorage.getItem(PROFILE_PHOTO_STORAGE_KEY))
  const profilePhotoInputRef = useRef<HTMLInputElement>(null)

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
  const [walletBalancesVisible, setWalletBalancesVisible] = useState(true)

  // Playable Games
  const [activeArcadeGame, setActiveArcadeGame] = useState<ArenaGameId | null>(null)
  const [activeMemo, setActiveMemo] = useState(false)
  const [activeWordSearch, setActiveWordSearch] = useState(false)
  const [activeDictation, setActiveDictation] = useState(false)
  const [activeTapTape, setActiveTapTape] = useState(false)
  const [activeHeadFootball, setActiveHeadFootball] = useState(false)
  const [activeQuizArena, setActiveQuizArena] = useState(false)
  const [activeFootball19, setActiveFootball19] = useState(false)
  const [publicRoomJoin, setPublicRoomJoin] = useState<PublicRoom | null>(null)

  // Duels state
  const [incomingInvites, setIncomingInvites] = useState<DuelInvite[]>([
    { id: 'inv-1', player: 'Astra Void', game: 'Basketball Stars', stake: 500, status: 'pending' },
    { id: 'inv-2', player: 'Nova Dream', game: 'Quantum Duel', stake: 1000, status: 'pending' },
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

  async function handleProfilePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Choisissez une image JPEG, PNG ou WebP.')
      input.value = ''
      return
    }
    if (file.size > PROFILE_PHOTO_MAX_BYTES) {
      showToast('La photo doit faire 8 Mo maximum.')
      input.value = ''
      return
    }

    try {
      const photo = await resizeProfilePhoto(file)
      try {
        window.localStorage.setItem(PROFILE_PHOTO_STORAGE_KEY, photo)
      } catch (error) {
        console.error('Impossible d’enregistrer la photo de profil.', error)
        showToast('Impossible d’enregistrer cette photo sur cet appareil.')
        return
      }
      setProfilePhoto(photo)
      showToast('Photo de profil mise à jour.')
    } catch (error) {
      console.error('Impossible de traiter la photo de profil.', error)
      showToast('Impossible de lire cette image. Choisissez un autre fichier.')
    } finally {
      input.value = ''
    }
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
    const controller = new AbortController()
    fetch(`${getAuthApiBaseUrl()}/api/auth/me`, {
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    }).then(async (response) => {
      if (response.status === 401) return null
      if (!response.ok) throw new Error(`Account session check failed (${response.status}).`)
      const result = await response.json() as { account: ChicagoAccount }
      return result.account
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) console.warn('Unable to restore the Chicago account session:', error)
      return null
    }).then((restoredAccount) => {
      if (controller.signal.aborted) return
      if (restoredAccount) {
        setAccount(restoredAccount)
        setAuthMode(null)
        setShowIntro(true)
      }
      setAuthReady(true)
    })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    window.localStorage.setItem('chicago-demo-balance', String(balance))
  }, [balance])

  useEffect(() => {
    if (page !== 'popular' || bonusCarouselPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      const row = bonusRowRef.current
      const firstCard = row?.querySelector<HTMLElement>('.home-bonus-card')
      if (!row || !firstCard) return

      const gap = Number.parseFloat(window.getComputedStyle(row).columnGap) || 0
      const nextPosition = row.scrollLeft + firstCard.offsetWidth + gap
      const atEnd = nextPosition >= row.scrollWidth - row.clientWidth - 4
      row.scrollTo({ left: atEnd ? 0 : nextPosition, behavior: 'smooth' })
    }, 3500)

    return () => window.clearInterval(timer)
  }, [bonusCarouselPaused, page])

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
    setTheme((prev) => prev === 'dark' ? 'neon' : prev === 'neon' ? 'light' : prev === 'light' ? 'lime' : prev === 'lime' ? 'melbet' : 'dark')
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
    if (game.id === 'quiz-arena') {
      setActiveQuizArena(true)
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
    if (game.id === 'ghasaq') {
      setActiveArcadeGame('ghasaq')
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
    } else if (room.game === 'quiz-arena') {
      setActiveQuizArena(true)
    } else if (['ping-pong', 'basketball-stars', 'ball-rush', 'forest-bridge', 'damned-maze', 'princess-race', 'grotte-aux-couteaux', 'colonnes-du-canyon', 'arena-helice', 'duel-de-troncs', 'chess-3d', 'embuscade', 'moto-taxi-afrique', 'chemin-de-couleurs', 'duel-de-cartes', 'counter-siege', 'dashbot', 'piaf-plume', 'lave-montante', 'mirror-run'].includes(room.game)) {
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

  if (!authReady) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#fffdf5] px-4 text-slate-800">
        <p role="status" className="rounded-2xl border border-amber-200 bg-white px-5 py-4 text-sm font-bold shadow-lg shadow-amber-100">
          Vérification de votre compte…
        </p>
      </main>
    )
  }

  if (!account || authMode) {
    return (
      <AccountAuthPage
        mode={authMode ?? 'register'}
        onAuthenticated={(authenticatedAccount) => {
          setAccount(authenticatedAccount)
          setAuthMode(null)
          setShowIntro(true)
        }}
      />
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

  if (activeQuizArena) {
    return (
      <ArenaRoom
        game="quiz-arena"
        title="Quiz Arène"
        publicJoin={publicRoomJoin}
        onWalletBalance={updateDemoBalance}
        onClose={() => { setActiveQuizArena(false); setPublicRoomJoin(null) }}
        renderGame={({ room, onClose, onAction }) => (
          <QuizArena room={room} onClose={onClose} onAction={onAction} />
        )}
      />
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

  const isDark = theme !== 'light' && theme !== 'melbet'
  const searchTerm = searchQuery.trim().toLocaleLowerCase()
  const matchingGames = searchTerm
    ? allGames.filter((game) => game.title.toLocaleLowerCase().includes(searchTerm)).slice(0, 5)
    : []
  const desktopNavigation: Array<{ page: Page; label: string; icon: typeof Home }> = [
    { page: 'popular', label: t('nav.home'), icon: Home },
    { page: 'games', label: t('nav.games'), icon: Grid2X2 },
    { page: 'performance', label: t('nav.performance'), icon: BarChart3 },
    { page: 'invite', label: t('nav.invite'), icon: UserPlus },
    { page: 'account', label: t('nav.account'), icon: User },
  ]
  const renderHeaderActions = () => (
    <div className="desktop-header-actions relative z-10 flex items-center gap-1.5 flex-shrink-0">
      <button
        type="button"
        onClick={() => account ? setPage('account') : setAuthMode('register')}
        className={`account-entry-button rounded-xl px-2 py-2 text-[10px] font-black transition sm:px-3 sm:text-xs ${
          isDark ? 'bg-amber-300 text-slate-950 hover:bg-amber-200' : 'bg-purple-600 text-white hover:bg-purple-500'
        }`}
        title={account ? `Compte ${account.id}` : 'Créer un compte'}
      >
        {account ? 'Compte' : 'Inscription'}
      </button>
      <div
        onClick={() => setWalletModalOpen(true)}
        title={t('wallet.creditWarning')}
        className={`flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-2xl cursor-pointer transition-transform active:scale-95 ${
          isDark ? 'bg-[#161928] border border-white/10 shadow-sm'
            : 'bg-white border border-slate-100 shadow-sm'
        }`}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-inner">
          <span className="text-[9px] font-black text-amber-900">C</span>
        </div>
        <span
          className={`text-xs font-bold leading-none ${balancePulse ? 'demo-balance-pulse' : ''} ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {formatAmount(balance)}
        </span>
        <span
          className={`w-4 h-4 rounded-md flex items-center justify-center font-bold text-xs ${
            isDark ? 'bg-[#FBBF24] text-slate-950' : 'bg-[#6B38FB] text-white'
          }`}
          aria-hidden="true"
        >
          <Plus size={11} strokeWidth={3} />
        </span>
      </div>

      <button
        type="button"
        onClick={() => setNotificationsOpen(true)}
        className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-transform active:scale-95 ${
          isDark ? 'bg-[#161928] border border-white/10 text-white'
            : 'bg-white border border-slate-100 text-slate-800 shadow-sm'
        }`}
        title={t('account.notifications')}
        aria-label={`${t('account.notifications')}${notificationsCount > 0 ? ` (${notificationsCount})` : ''}`}
      >
        <Bell size={15} />
        {notificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white text-[8.5px] font-black flex items-center justify-center border-2 border-transparent">
            {notificationsCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
          isDark ? 'bg-[#161928] border border-purple-500/40 text-[#FBBF24] hover:bg-purple-950/40'
            : 'bg-white border border-purple-200 text-[#6B38FB] shadow-sm hover:bg-purple-50'
        }`}
        title={`${t('account.theme')} : ${t(theme === 'neon' ? 'theme.neon' : theme === 'lime' ? 'theme.lime' : theme === 'melbet' ? 'theme.melbet' : theme === 'dark' ? 'theme.dark' : 'theme.light')}`}
        aria-label={t('account.theme')}
      >
        {theme === 'neon' ? <Sparkles size={15} /> : theme === 'lime' ? <Leaf size={15} /> : theme === 'melbet' ? <Palette size={15} /> : isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <button
        type="button"
        onClick={() => setPage('account')}
        className="desktop-profile-button"
        title={t('nav.account')}
        aria-label={t('nav.account')}
      >
        <img
          src={profilePhoto || (isDark ? '/images/extracted/avatar-dark.png' : '/images/extracted/avatar-light.png')}
          alt=""
          width={32}
          height={32}
          onError={hideBrokenImage}
        />
      </button>
    </div>
  )

  return (
    <div
      className={`chicago-world desktop-app-shell ${sidebarCompact ? 'is-sidebar-compact' : ''} relative isolate min-h-screen w-full transition-colors duration-200 overflow-x-clip ${
        theme === 'neon' ? 'bg-[#0c0611] text-white'
          : theme === 'lime' ? 'bg-[#10170b] text-white'
          : theme === 'melbet' ? 'bg-[#E9EDF3] text-[#1B2433]'
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
        <div className="desktop-sidebar-label">{t('sidebar.mainMenu')}</div>
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
          <strong>{t('sidebar.ready')}</strong>
          <span>{t('sidebar.multiplayer')}</span>
          <button type="button" onClick={() => setPage('games')}>{t('sidebar.explore')}</button>
        </div>
        <button
          type="button"
          className="desktop-sidebar-toggle"
          onClick={() => setSidebarCompact((compact) => !compact)}
          aria-label={sidebarCompact ? t('sidebar.expand') : t('sidebar.collapse')}
          title={sidebarCompact ? t('sidebar.expand') : t('sidebar.collapse')}
        >
          {sidebarCompact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          <span>{t('sidebar.collapse')}</span>
        </button>
      </aside>

      {/* Main Mobile App Container: 440px max width for authentic mobile frame matching the images */}
      <div className="desktop-content-shell relative z-10 w-full min-h-screen flex flex-col pb-28 shadow-2xl">
        {/* ========================================================
            HEADER BANNER (Minecraft Avatar, Chicago Brand, Balance, Bell, Theme Switcher)
           ======================================================== */}
        <header className="desktop-main-header relative px-4 pt-3 pb-3 flex items-center justify-between overflow-hidden">
          {/* Light Theme Background Floating Grass Block */}
          {!isDark && theme !== 'melbet' && (
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
                src={profilePhoto || (isDark ? '/images/extracted/avatar-dark.png' : '/images/extracted/avatar-light.png')}
                alt={profilePhoto ? t('profile.photo') : t('profile.player')}
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
              {t('intro.caption')}
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
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
            />
            {searchTerm && (
              <div className="desktop-search-results">
                {matchingGames.map((game) => (
                  <button type="button" key={game.id} onClick={() => { handleLaunchGame(game); setSearchQuery('') }}>
                    <Gamepad2 size={16} /><span>{gameTitle(game.id, game.title)}</span><small>{t('search.game')}</small>
                  </button>
                ))}
                {!matchingGames.length && <p>{t('search.none')}</p>}
              </div>
            )}
          </div>

          {page === 'popular'
            ? <div className="desktop-home-header-actions">{renderHeaderActions()}</div>
            : renderHeaderActions()}
        </header>

        <div className="desktop-page-content">
        {/* ========================================================
            MAIN PAGE CONTENT SWITCHER
           ======================================================== */}
        {page === 'popular' && (
          <div className="desktop-page desktop-popular-page flex flex-col gap-4 px-4 pt-2">
            <div className="home-header-actions-row">{renderHeaderActions()}</div>

            <button
              type="button"
              onClick={() => showToast(`${t('bonus.activated')} : ${t(promotions[0].title)} !`)}
              className="home-featured-promo"
            >
              <img
                {...getResponsiveImageProps(promotions[0].image, '900px', [320, 640, 960, 1280])}
                alt=""
                width={900}
                height={360}
                loading="eager"
                decoding="async"
                onError={hideBrokenImage}
              />
              <span className="home-featured-promo-copy">
                <small>{t('bonus.offers')}</small>
                <strong>{t('home.featuredTitle')}</strong>
                <span>{t('home.featuredDescription')}</span>
                <b>{t('home.featuredAction')} <ChevronRight aria-hidden="true" /></b>
              </span>
              <span className="home-featured-promo-pagination" aria-hidden="true">
                <i className="is-active" /><i /><i /><i />
              </span>
            </button>

            {Array.from({ length: Math.ceil(allGames.length / 5) }, (_, groupIndex) => allGames.slice(groupIndex * 5, (groupIndex + 1) * 5)).map((games, groupIndex) => (
              <div key={groupIndex} className="home-content-group">
                <section className="home-games-group">
                  <div className="home-games-heading">
                    <h2>{t('game.group')}</h2>
                    <span>{groupIndex === 0 ? t('home.popular') : `${t('game.group')} ${groupIndex * 5 + 1}–${groupIndex * 5 + games.length}`}</span>
                    {groupIndex === 0 && (
                      <button type="button" onClick={() => setPage('games')}>
                        {t('home.all')} <ChevronRight aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <div className="home-games-row">
                    {games.map((game) => (
                      <button
                        type="button"
                        key={game.id}
                        onClick={() => handleLaunchGame(game)}
                        aria-label={`${t('game.launch')} ${gameTitle(game.id, game.title)}`}
                        className="game-category-tile"
                      >
                        <img
                          {...getResponsiveImageProps(game.image, '320px', [128, 320, 400, 640])}
                          alt=""
                          className="sports-category-image"
                          width={320}
                          height={198}
                          loading="lazy"
                          decoding="async"
                          onError={hideBrokenImage}
                        />
                        <span className="sports-category-label">{gameTitle(game.id, game.title)}</span>
                      </button>
                    ))}
                  </div>
                </section>
                {groupIndex === 0 && (
                  <section className="home-games-group home-bonuses">
                    <div className="home-games-heading">
                      <h2>{t('bonus.title')}</h2>
                      <span>{t('bonus.offers')}</span>
                    </div>
                    <div
                      className="home-bonus-row"
                      ref={bonusRowRef}
                      aria-label={t('bonus.title')}
                      onMouseEnter={() => setBonusCarouselPaused(true)}
                      onMouseLeave={() => setBonusCarouselPaused(false)}
                      onFocusCapture={() => setBonusCarouselPaused(true)}
                      onBlurCapture={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                          setBonusCarouselPaused(false)
                        }
                      }}
                      onTouchStart={() => setBonusCarouselPaused(true)}
                      onTouchEnd={() => window.setTimeout(() => setBonusCarouselPaused(false), 3500)}
                    >
                      {promotions.map((promo, index) => (
                        <button
                          type="button"
                          key={promo.title}
                          onClick={() => showToast(`${t('bonus.activated')} : ${t(promo.title)} !`)}
                          className="home-bonus-card"
                        >
                          <img
                            {...getResponsiveImageProps(promo.image, '420px', [128, 320, 400, 640])}
                            alt=""
                            width={420}
                            height={220}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            onError={hideBrokenImage}
                          />
                          <span className="home-bonus-copy">
                            <strong>{t(promo.title)}</strong>
                            <small>{t(promo.desc)}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ))}

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
                ← {t('game.back')}
              </button>
              <span className="text-xs font-bold text-slate-400">{allGames.length} {t('game.gamesCount')}</span>
            </div>
            <h1 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('game.all')}</h1>
            <div
              className="desktop-games-catalog no-scrollbar flex flex-col gap-4"
            >
              {Array.from({ length: Math.ceil(allGames.length / 5) }, (_, groupIndex) => allGames.slice(groupIndex * 5, (groupIndex + 1) * 5)).map((games, groupIndex) => (
                <div key={groupIndex} className="home-games-group">
                  <h3 className="home-games-group-title">{t('game.group')} {groupIndex * 5 + 1}–{groupIndex * 5 + games.length}</h3>
                  <div className={`home-games-row${games.length < 5 ? ' is-partial' : ''}`}>
                    {games.map((game) => (
                      <button
                        type="button"
                        key={game.id}
                        onClick={() => handleLaunchGame(game)}
                        aria-label={`${t('game.launch')} ${gameTitle(game.id, game.title)}`}
                        className="game-category-tile"
                      >
                        <img
                          {...getResponsiveImageProps(game.image, '152px', [64, 128, 320, 400, 640])}
                          alt=""
                          className="sports-category-image"
                          width={152}
                          height={208}
                          loading="lazy"
                          decoding="async"
                          onError={hideBrokenImage}
                        />
                        <span className="sports-category-label">{gameTitle(game.id, game.title)}</span>
                        <span className="sports-category-status">{t('game.available')}</span>
                      </button>
                    ))}
                  </div>
                </div>
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
                {t('performance.title')}
              </h1>
            </div>

            {/* Performance Overview Banner */}
            <div
              className={`p-4 rounded-2xl flex items-center justify-between ${
                isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
              }`}
            >
              <div>
                <span className="text-xs text-slate-400 font-semibold">{t('performance.earnings')}</span>
                <div className={`text-xl font-black ${isDark ? 'text-[#FACC15]' : 'text-[#6B38FB]'}`}>
                  {formatAmount(2_450_000)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-semibold">{t('performance.rank')}</span>
                <div className="text-base font-bold text-emerald-500">{t('performance.globalTop12')}</div>
              </div>
            </div>

            {/* Full Top 10 Performers Leaderboard */}
            <div
              className={`rounded-2xl p-3 flex flex-col gap-2 ${
                isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
              }`}
            >
              <h3 className="performer-leaderboard-heading text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t('performance.top10')}
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
                    {formatAmount(p.amount)}
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
                {t('invite.title')}
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
                {t('invite.launch')}
              </span>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">
                  {t('invite.player')}
                </label>
                <input
                  type="text"
                  placeholder={t('invite.playerExample')}
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
                  <label className="text-xs text-slate-400 font-semibold block mb-1">{t('invite.game')}</label>
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
                        {gameTitle(game.id, game.title)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">{t('invite.stake')}</label>
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
                <span>{t('button.sendChallenge')}</span>
              </button>
            </form>

            {/* Incoming Challenges */}
            <div
              className={`p-4 rounded-2xl flex flex-col gap-2 ${
                isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
              }`}
            >
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t('invite.incoming')} ({incomingInvites.filter((i) => i.status === 'pending').length})
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
                        {t('button.accept')}
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
                        {t('button.decline')}
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
                  {t('invite.sent')} ({sentInvites.length})
                </span>
                {sentInvites.map((inv) => (
                  <div
                    key={inv.id}
                    className={`p-3 rounded-xl flex items-center justify-between ${
                      isDark ? 'bg-[#0B0D19]/60' : 'bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{t('invite.to')} {inv.player}</div>
                      <div className="text-[10px] text-slate-400">
                        {inv.game} â€¢ {inv.stake} XOF
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                      {t('invite.pending')}
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
            <div className="account-page-heading flex items-center gap-2 mb-1">
              <span className="w-1.5 h-5 bg-[#8B5CF6] rounded-full" />
              <h1 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('account.title')}
              </h1>
            </div>

            {/* User Profile Overview */}
            <div className={`account-profile flex items-center gap-3 rounded-2xl p-4 ${
              isDark ? 'bg-[#161928] border border-white/5' : 'bg-white shadow-sm border border-slate-100'
            }`}>
              <div className="account-profile-avatar w-12 h-12 rounded-full overflow-hidden bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                <img
                  src={profilePhoto || (isDark ? '/images/extracted/avatar-dark.png' : '/images/extracted/avatar-light.png')}
                  alt={profilePhoto ? t('profile.photo') : t('profile.player')}
                  className="w-full h-full object-cover"
                  width={145}
                  height={145}
                  loading="lazy"
                  decoding="async"
                  onError={hideBrokenImage}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-sm">{account?.name ?? 'Compte démo'}</h3>
                <span className="block truncate text-[10px] text-purple-500 font-bold">
                  {account ? `ID : ${account.id} · ${account.country}` : 'Connectez-vous pour retrouver votre compte'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => profilePhotoInputRef.current?.click()}
                className="account-photo-button flex shrink-0 items-center gap-1.5 rounded-xl border border-purple-500/30 px-2 py-2 text-[10px] font-bold text-purple-400 hover:bg-purple-500/10"
              >
                <User size={14} />
                <span>{t('account.photo')}</span>
              </button>
              <input
                ref={profilePhotoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label={t('account.choosePhoto')}
                className="sr-only"
                onChange={(event) => void handleProfilePhotoChange(event)}
              />
              {account && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await fetch(`${getAuthApiBaseUrl()}/api/auth/session`, {
                        method: 'DELETE',
                        credentials: 'include',
                      })
                      if (!response.ok) throw new Error(`Logout failed (${response.status}).`)
                      setAccount(null)
                      setAuthMode('register')
                      setShowIntro(false)
                      showToast('Vous êtes déconnecté.')
                    } catch (error) {
                      console.error('Unable to sign out of the Chicago account:', error)
                      showToast('Impossible de fermer la session. Réessayez.')
                    }
                  }}
                  className="account-logout-button flex shrink-0 items-center justify-center rounded-xl border border-red-500/30 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10"
                >
                  Déconnexion
                </button>
              )}
            </div>

            {/* Soldes du compte */}
            <div className="account-balances">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('account.wallet')}</span>
                <span className="text-[10px] font-semibold text-slate-500">{t('account.demoBalances')}</span>
              </div>
              <div className="account-wallet-scene">
                <section className="account-wallet-pocket" aria-label={t('wallet.main')}>
                  <div className="account-wallet-pocket-label">
                    <Wallet size={16} />
                    <span>{t('account.wallet')}</span>
                  </div>
                  <div className="account-wallet-balance-row">
                    <strong>
                      {walletBalancesVisible
                          ? formatAmount(balance)
                        : '••••••••'}
                    </strong>
                    <button
                      type="button"
                      className="account-wallet-visibility"
                      onClick={() => setWalletBalancesVisible((visible) => !visible)}
                      aria-label={walletBalancesVisible ? t('account.hideBalance') : t('account.showBalance')}
                      aria-pressed={walletBalancesVisible}
                      title={walletBalancesVisible ? t('account.hideBalance') : t('account.showBalance')}
                    >
                      {walletBalancesVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  <span className="account-wallet-footnote">
                    {walletBalancesVisible ? t('account.tapToHide') : t('account.tapToShow')}
                  </span>
                </section>
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
                <span>{t('account.deposit')}</span>
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
                <span>{t('account.withdraw')}</span>
              </button>
            </div>

            <section className="account-wallet-assets" aria-label={t('account.wallet')}>
              <div className="account-wallet-assets-heading">
                <h2>{t('wallet.balance')}</h2>
                <span>{t('wallet.demo')}</span>
              </div>
              <div className="account-wallet-cards">
                <article className="account-wallet-card account-wallet-card-withdrawal">
                  <span className="account-wallet-card-icon"><CreditCard size={17} /></span>
                  <span className="account-wallet-card-copy">
                    <strong>{t('account.withdrawal')}</strong>
                    <small>{t('account.availableWithdrawal')}</small>
                  </span>
                  <span className="account-wallet-card-amount">
                    {walletBalancesVisible
                      ? formatAmount(withdrawalBalance)
                      : '••••••••'}
                  </span>
                </article>
                <article className="account-wallet-card account-wallet-card-bonus">
                  <span className="account-wallet-card-icon"><Sparkles size={17} /></span>
                  <span className="account-wallet-card-copy">
                    <strong>{t('account.bonusBalance')}</strong>
                    <small>{t('account.bonusAvailable')}</small>
                  </span>
                  <span className="account-wallet-card-amount">
                    {walletBalancesVisible
                      ? formatAmount(bonusBalance)
                      : '••••••••'}
                  </span>
                </article>
              </div>
            </section>

            {/* Settings & Extra Options */}
            <div
              className={`account-settings rounded-2xl divide-y ${
                isDark ? 'bg-[#161928] border border-white/5 divide-slate-800'
                  : 'bg-white shadow-sm border border-slate-100 divide-slate-100'
              }`}
            >
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-[11px] font-bold">
                  <span>{t('language.label')}</span>
                  <select
                    value={language}
                    onChange={(event) => {
                      const value = event.target.value
                      if (value === 'en' || value === 'fr' || value === 'ar' || value === 'es' || value === 'de' || value === 'zh') {
                        setLanguage(value)
                      }
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-xs ${
                      isDark ? 'border-slate-700 bg-[#0B0D19] text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}
                  >
                    {Object.entries(languageNames).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-[11px] font-bold">
                  <span>{t('wallet.currency')}</span>
                  <select
                    value={currency}
                    onChange={(event) => {
                      const value = event.target.value
                      if (value === 'XOF' || value === 'USD' || value === 'NGN' || value === 'EUR' || value === 'GBP') {
                        setCurrency(value)
                      }
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-xs ${
                      isDark ? 'border-slate-700 bg-[#0B0D19] text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}
                  >
                    <option value="XOF">XOF — {t('currency.fcfa')}</option>
                    <option value="USD">USD — {t('currency.dollar')}</option>
                    <option value="NGN">NGN — {t('currency.naira')}</option>
                    <option value="EUR">EUR — {t('currency.euro')}</option>
                    <option value="GBP">GBP — {t('currency.pound')}</option>
                  </select>
                  <span className="text-[10px] font-normal text-slate-500">{t('wallet.currencyNote')}</span>
                </label>
                <span className="text-[10px] font-normal text-slate-500 sm:col-span-2">{t('language.savedLocally')}</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full p-3 flex items-center justify-between text-xs font-bold hover:opacity-80 text-left"
              >
                <div className="flex items-center gap-2">
                  {theme === 'neon' ? (
                    <Sparkles size={16} className="text-amber-300" />
                  ) : theme === 'lime' ? (
                    <Leaf size={16} className="text-lime-400" />
                  ) : theme === 'melbet' ? (
                    <Palette size={16} className="text-amber-500" />
                  ) : isDark ? (
                    <Sun size={16} className="text-[#FBBF24]" />
                  ) : (
                    <Moon size={16} className="text-[#6B38FB]" />
                  )}
                  <span>
                    {t('account.theme')} : {t(theme === 'neon' ? 'theme.neon' : theme === 'lime' ? 'theme.lime' : theme === 'melbet' ? 'theme.melbet' : theme === 'dark' ? 'theme.dark' : 'theme.light')}
                  </span>
                </div>
                <span className="text-[10px] text-purple-500">{t('account.toggle')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowIntro(true)}
                className="w-full p-3 flex items-center justify-between text-xs font-bold hover:opacity-80 text-left"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>{t('account.replayIntro')}</span>
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
                  <span>{t('account.notifications')}</span>
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
                  <span>{t('account.support')}</span>
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
              {t('nav.home')}
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
              {t('nav.performance')}
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
              {t('nav.invite')}
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
              {t('nav.account')}
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
                  <h3 className="font-black text-sm">{t('wallet.rechargeTitle')}</h3>
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
                <strong className="block text-4xl font-black">{formatAmount(balance)}</strong>
                <span className="mt-1 block text-sm text-slate-400">{t('wallet.credits')}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                {t('wallet.rechargeInfo')}
              </p>
              <button
                type="button"
                onClick={() => setWalletModalOpen(false)}
                className="w-full py-3 rounded-xl font-bold text-xs bg-[#6B38FB] text-white shadow-lg shadow-purple-600/30 hover:bg-[#5B2AE8] active:scale-95 transition-all mt-1"
              >
                {t('button.close')}
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
                  <h3 className="font-black text-sm">{t('account.notifications')} ({notificationsCount})</h3>
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
                    <span className="font-bold text-xs text-purple-500">{t('notification.welcome')}</span>
                    <span className="text-[10px] text-slate-400">{t('notification.time5')}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {t('notification.safe')}
                  </p>
                </div>

                <div
                  className={`p-3 rounded-2xl flex flex-col gap-1 ${
                    isDark ? 'bg-[#0B0D19]' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-500">{t('notification.newChallenge')}</span>
                    <span className="text-[10px] text-slate-400">{t('notification.time20')}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {t('notification.challengeText')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNotificationsCount(0)
                  setNotificationsOpen(false)
                  showToast(t('notification.markedRead'))
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 active:scale-95 transition-all mt-1"
              >
                {t('button.markRead')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}