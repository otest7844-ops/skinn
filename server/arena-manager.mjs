import { randomBytes, randomInt, randomUUID } from 'node:crypto'
import { applyAuthoritativeInput, createAuthoritativeGame, tickAuthoritativeGame } from './authoritative-arcade.mjs'
import { createHeadFootballMatch, sanitizeHeadFootballInput, tickHeadFootballMatch } from './head-football.mjs'
import { createMemoMatch, flipMemoCard, memoPlayerSnapshot, tickMemoMatch } from './memo-game.mjs'
import {
  createWordSearchMatch,
  submitWordSearchWord,
  tickWordSearchMatch,
  WORD_SEARCH_CATEGORIES,
} from '../shared/word-search.mjs'
import { createDictationMatch, submitDictationAnswer, tickDictationMatch } from './dictation-game.mjs'
import { applyDamnedMazeInput, createDamnedMazeState, tickDamnedMaze } from './damned-maze.mjs'
import { applyPrincessRaceAction, createPrincessRaceState } from './princess-race.mjs'
import {
  applyCanyonRaceInput,
  applyKnifeDuelInput,
  createCanyonRaceState,
  createKnifeDuelState,
  tickCanyonRace,
  tickKnifeDuel,
} from './new-arcade-games.mjs'
import {
  applyHelixArenaInput,
  applyTrunkDuelInput,
  createHelixArenaState,
  createTrunkDuelState,
  tickHelixArena,
  tickTrunkDuel,
} from './supplied-arcade-games.mjs'
import {
  createChessDuelState,
  createSniperDuelState,
  submitChessMove,
  tickSniperDuel,
  updateSniperDuelScore,
} from './chess-duel.mjs'
import {
  applyCardDuelInput,
  applyColorPathInput,
  applyMotoTaxiInput,
  cardDuelPlayerSnapshot,
  colorPathPlayerSnapshot,
  createCardDuelMatch,
  createColorPathMatch,
  createMotoTaxiMatch,
  motoTaxiPlayerSnapshot,
  tickCardDuelMatch,
  tickColorPathMatch,
  tickMotoTaxiMatch,
} from './supplied-three-games.mjs'

const GAME_IDS = new Set(['tic-tac-toe', 'ping-pong', 'basketball-stars', 'cannon-duel', 'ball-rush', 'football-19', 'head-football', 'tap-tape-arena', 'memo-5x5', 'word-search', 'dictation-duel', 'forest-bridge', 'damned-maze', 'princess-race', 'grotte-aux-couteaux', 'colonnes-du-canyon', 'arena-helice', 'duel-de-troncs', 'chess-3d', 'embuscade', 'moto-taxi-afrique', 'chemin-de-couleurs', 'duel-de-cartes'])
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const TAP_TICK_MS = 50
const TAP_SNAPSHOT_MS = 100
const TAP_DECAY_DELAY_MS = 250
const TAP_DECAY_PER_SECOND = 22
const TAP_IDLE_DECAY_ACCELERATION = 0.035
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function playerName(value, slot) {
  if (typeof value !== 'string') return `Joueur ${slot + 1}`
  const name = Array.from(value, (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127 ? '' : character)
    .join('').trim().slice(0, 18)
  return name || `Joueur ${slot + 1}`
}

function clearForestTimer(room, key) {
  if (room[key]) clearTimeout(room[key])
  room[key] = null
}

function isForestRace(room) {
  return room.game === 'forest-bridge' || room.game === 'princess-race'
    || room.game === 'grotte-aux-couteaux' || room.game === 'colonnes-du-canyon'
    || room.game === 'arena-helice' || room.game === 'duel-de-troncs'
    || room.game === 'moto-taxi-afrique' || room.game === 'chemin-de-couleurs'
    || room.game === 'duel-de-cartes'
}

function boundedObject(value, maxLength) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  try {
    const encoded = JSON.stringify(value)
    return encoded.length <= maxLength ? JSON.parse(encoded) : null
  } catch {
    return null
  }
}

export function attachArenaManager(io, {
  countdownMs = 10_000,
  forestWaitingMs = 10 * 60_000,
  forestEmptyMs = 5 * 60_000,
  forestDisconnectMs = 60_000,
  forestFinishedMs = 2 * 60_000,
  mazeWaitingMs = 10 * 60_000,
  mazeEmptyMs = 5 * 60_000,
  mazeDisconnectMs = 60_000,
  mazeFinishedMs = 2 * 60_000,
} = {}) {
  const rooms = new Map()
  const socketPlayers = new Map()
  const demoWallets = new Map()

  function expireForestRoom(room, reason) {
    if (!isForestRace(room) || !rooms.has(room.code)) return
    for (const player of room.players) {
      if (player.connected && player.socketId) io.to(player.socketId).emit('arena:expired', { message: reason })
    }
    removeRoom(room, reason)
  }

  function scheduleForestExpiry(room, key, delay, reason, condition = () => true) {
    clearForestTimer(room, key)
    room[key] = setTimeout(() => {
      room[key] = null
      if (rooms.get(room.code) !== room || !condition()) return
      expireForestRoom(room, reason)
    }, delay)
    room[key].unref?.()
  }

  function scheduleForestWaitingExpiry(room) {
    if (!isForestRace(room) || room.players.length !== 1) return
    scheduleForestExpiry(
      room,
      'waitingTimer',
      forestWaitingMs,
      'Le salon a expiré après 10 minutes sans deuxième joueur.',
      () => room.phase === 'waiting' && room.players.length === 1,
    )
  }

  function scheduleForestFinishedExpiry(room) {
    if (!isForestRace(room)) return
    scheduleForestExpiry(
      room,
      'finishedTimer',
      forestFinishedMs,
      'Le salon terminé a expiré.',
      () => room.phase === 'finished',
    )
  }

  function finishForestRoom(room, winnerSlot = null) {
    if (!isForestRace(room) || room.phase === 'finished') return
    clearForestTimer(room, 'waitingTimer')
    stopGameTimer(room)
    room.phase = 'finished'
    room.winnerSlot = winnerSlot
    if (room.gameState) {
      room.gameState.winner = winnerSlot
      if (room.game === 'grotte-aux-couteaux' || room.game === 'colonnes-du-canyon'
        || room.game === 'arena-helice' || room.game === 'duel-de-troncs'
        || room.game === 'moto-taxi-afrique' || room.game === 'chemin-de-couleurs'
        || room.game === 'duel-de-cartes') {
        room.gameState.status = 'finished'
        room.gameState.players?.forEach((state) => {
          if (state.input?.direction !== undefined) state.input = { direction: 0, targetZ: null }
          else if (state.input?.x !== undefined) state.input = { x: 0, z: 0, jump: false }
          else state.input = null
        })
      }
    }
    room.players.forEach((player) => { player.ready = false })
    broadcast(room)
    scheduleForestFinishedExpiry(room)
  }

  function scheduleForestDisconnectExpiry(room, player) {
    if (!isForestRace(room)) return
    clearForestTimer(room, 'disconnectTimer')
    room.disconnectTimer = setTimeout(() => {
      room.disconnectTimer = null
      if (rooms.get(room.code) !== room || player.connected || room.phase === 'finished') return
      const connectedPlayer = room.players.find((item) => item.connected)
      if (!connectedPlayer) {
        scheduleForestExpiry(
          room,
          'emptyTimer',
          forestEmptyMs,
          'Le salon vide a expiré après 5 minutes.',
          () => room.players.every((item) => !item.connected),
        )
        return
      }
      finishForestRoom(room, connectedPlayer.slot)
    }, forestDisconnectMs)
    room.disconnectTimer.unref?.()
  }

  function clearMazeTimer(room, key) {
    if (room[key]) clearTimeout(room[key])
    room[key] = null
  }

  function expireMazeRoom(room, reason) {
    if (room.game !== 'damned-maze' || !rooms.has(room.code)) return
    for (const player of room.players) {
      if (player.connected && player.socketId) io.to(player.socketId).emit('arena:expired', { message: reason })
    }
    removeRoom(room, reason)
  }

  function scheduleMazeExpiry(room, key, delay, reason, condition = () => true) {
    clearMazeTimer(room, key)
    room[key] = setTimeout(() => {
      room[key] = null
      if (rooms.get(room.code) !== room || !condition()) return
      expireMazeRoom(room, reason)
    }, delay)
    room[key].unref?.()
  }

  function scheduleMazeWaitingExpiry(room) {
    if (room.game !== 'damned-maze' || room.players.length !== 1) return
    scheduleMazeExpiry(
      room,
      'waitingTimer',
      mazeWaitingMs,
      'Le salon a expiré après 10 minutes sans deuxième joueur.',
      () => room.phase === 'waiting' && room.players.length === 1,
    )
  }

  function scheduleMazeEmptyExpiry(room) {
    if (room.game !== 'damned-maze' || room.players.some((player) => player.connected) || room.emptyTimer) return
    scheduleMazeExpiry(
      room,
      'emptyTimer',
      mazeEmptyMs,
      'Le salon vide a expiré après 5 minutes.',
      () => room.players.every((player) => !player.connected),
    )
  }

  function scheduleMazeFinishedExpiry(room) {
    if (room.game !== 'damned-maze') return
    scheduleMazeExpiry(
      room,
      'finishedTimer',
      mazeFinishedMs,
      'Le salon terminé a expiré.',
      () => room.phase === 'finished',
    )
  }

  function finishMazeRoom(room, winnerSlot, result) {
    if (room.game !== 'damned-maze' || room.phase === 'finished') return
    clearMazeTimer(room, 'waitingTimer')
    stopGameTimer(room)
    room.phase = 'finished'
    room.winnerSlot = winnerSlot
    if (room.gameState) {
      room.gameState.status = 'finished'
      room.gameState.winner = winnerSlot
      room.gameState.result = result
      room.gameState.players.forEach((player, slot) => {
        player.status = winnerSlot === null ? 'dead' : slot === winnerSlot ? 'won' : 'dead'
        player.input = { x: 0, z: 0 }
      })
    }
    room.players.forEach((player) => { player.ready = false })
    broadcast(room)
    scheduleMazeFinishedExpiry(room)
  }

  function scheduleMazeDisconnectExpiry(room, player) {
    if (room.game !== 'damned-maze') return
    scheduleMazeEmptyExpiry(room)
    clearMazeTimer(room, 'disconnectTimer')
    if (player.connected || room.phase === 'finished') return
    const disconnectedPlayer = room.players
      .filter((item) => !item.connected)
      .sort((a, b) => (a.disconnectedAt ?? Date.now()) - (b.disconnectedAt ?? Date.now()))[0]
    if (!disconnectedPlayer) return
    const disconnectedAt = disconnectedPlayer.disconnectedAt ?? Date.now()
    room.disconnectTimer = setTimeout(() => {
      room.disconnectTimer = null
      if (rooms.get(room.code) !== room || disconnectedPlayer.connected || room.phase === 'finished') return
      const remainingPlayer = room.players.find((item) => item.connected)
      if (remainingPlayer) finishMazeRoom(room, remainingPlayer.slot, 'opponent-disconnected')
      else scheduleMazeEmptyExpiry(room)
    }, Math.max(0, disconnectedAt + mazeDisconnectMs - Date.now()))
    room.disconnectTimer.unref?.()
  }

  function getDemoBalance(walletId) {
    if (!demoWallets.has(walletId)) demoWallets.set(walletId, 10_000)
    return demoWallets.get(walletId)
  }

  function sendDemoBalance(player) {
    if (player.connected && player.socketId) {
      io.to(player.socketId).emit('arena:demo-wallet', { balance: getDemoBalance(player.walletId) })
    }
  }

  function reserveDemoStake(player, stake) {
    const balance = getDemoBalance(player.walletId)
    if (balance < stake) return false
    demoWallets.set(player.walletId, balance - stake)
    return true
  }

  function addDemoCredits(walletId, amount) {
    const balance = getDemoBalance(walletId) + amount
    demoWallets.set(walletId, balance)
    return balance
  }

  function finishedWinner(room) {
    const state = room.gameState
    const winner = room.game === 'head-football' ? state?.match?.winner : state?.winner
    if (winner === 0 || winner === 1) return winner
    if (room.game === 'ball-rush' && Array.isArray(state?.players) && state.players.length === 2) {
      const scores = state.players.map((player) => player?.score)
      if (scores.every(Number.isFinite) && scores[0] !== scores[1]) return scores[0] > scores[1] ? 0 : 1
    }
    const scores = Array.isArray(state?.scores) ? state.scores
      : Array.isArray(state?.score) ? state.score
        : null
    if (!scores || scores.length !== 2 || !scores.every(Number.isFinite) || scores[0] === scores[1]) return null
    return scores[0] > scores[1] ? 0 : 1
  }

  function settleDemoPot(room) {
    if (room.phase !== 'finished' || room.settled) return
    room.settled = true
    room.winnerSlot = finishedWinner(room)
    room.payout = room.winnerSlot === null ? 0 : room.stake * 2
    if (room.winnerSlot === null) {
      room.players.forEach((player, slot) => {
        const refund = room.escrowed[slot]
        if (refund > 0) demoWallets.set(player.walletId, getDemoBalance(player.walletId) + refund)
      })
    } else {
      const winner = room.players[room.winnerSlot]
      if (winner) demoWallets.set(winner.walletId, getDemoBalance(winner.walletId) + room.payout)
    }
    room.escrowed = [0, 0]
    room.players.forEach(sendDemoBalance)
  }

  function makeCode() {
    let code
    do {
      code = Array.from(randomBytes(6), (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join('')
    } while (rooms.has(code))
    return code
  }

  function lookup(socket) {
    const current = socketPlayers.get(socket.id)
    if (!current) return null
    const room = rooms.get(current.code)
    const player = room?.players.find((item) => item.token === current.token)
    return room && player ? { room, player } : null
  }

  function snapshot(room, recipientToken) {
    settleDemoPot(room)
    let gameState = room.gameState
    if (room.game === 'forest-bridge' && gameState) {
      gameState = { ...gameState }
      delete gameState.traps
    } else if (room.game === 'dictation-duel' && gameState) {
      gameState = {
        ...gameState,
        dictation: {
          ...gameState.dictation,
          roundRemainingMs: gameState.dictation.phase === 'playing'
            ? Math.max(0, gameState.dictation.roundDeadline - Date.now())
            : 0,
        },
      }
      delete gameState.dictation.randomState
      delete gameState.dictation.usedPhrases
    } else if ((room.game === 'grotte-aux-couteaux' || room.game === 'colonnes-du-canyon') && gameState) {
      gameState = { ...gameState }
      delete gameState.randomState
    } else if (room.game === 'damned-maze' && gameState) {
      const recipient = room.players.find((player) => player.token === recipientToken)
      const sendMaze = recipient?.mazeSeed !== gameState.maze.seed
      if (recipient && sendMaze) recipient.mazeSeed = gameState.maze.seed
      gameState = {
        ...gameState,
        maze: sendMaze ? gameState.maze : undefined,
        floorTiles: undefined,
        randomState: undefined,
        players: gameState.players.map(({ input, ...player }) => {
          void input
          return player
        }),
      }
    } else if (room.game === 'moto-taxi-afrique' && gameState) {
      gameState = motoTaxiPlayerSnapshot(gameState)
    } else if (room.game === 'chemin-de-couleurs' && gameState) {
      gameState = colorPathPlayerSnapshot(
        gameState,
        room.players.findIndex((player) => player.token === recipientToken),
      )
    } else if (room.game === 'duel-de-cartes' && gameState) {
      gameState = cardDuelPlayerSnapshot(
        gameState,
        room.players.findIndex((player) => player.token === recipientToken),
      )
    } else if (room.game === 'memo-5x5' && gameState) {
      const slot = room.players.findIndex((player) => player.token === recipientToken)
      gameState = memoPlayerSnapshot(gameState, slot)
    }
    return {
      code: room.code,
      game: room.game,
      category: room.wordSearchCategory,
      isPublic: room.isPublic,
      stake: room.stake,
      payout: room.payout,
      winnerSlot: room.winnerSlot,
      phase: room.phase,
      round: room.round,
      seed: room.seed,
      countdownEndsAt: room.countdownEndsAt,
      countdownRemainingMs: room.countdownEndsAt === null ? null : Math.max(0, room.countdownEndsAt - Date.now()),
      players: room.players.map((player, slot) => ({
        slot,
        you: player.token === recipientToken,
        name: player.name,
        connected: player.connected,
        ready: player.ready,
      })),
      gameState,
      yourSlot: room.players.findIndex((player) => player.token === recipientToken),
    }
  }

  function broadcast(room) {
    for (const player of room.players) {
      if (!player.connected || !player.socketId) continue
      io.to(player.socketId).emit('arena:state', snapshot(room, player.token))
    }
  }

  function publicRoomList() {
    return [...rooms.values()]
      .filter((room) => room.isPublic && room.players.length < 2 && ['waiting', 'countdown'].includes(room.phase))
      .map((room) => ({
        code: room.code,
        game: room.game,
        phase: room.phase,
        host: room.players[0]?.name ?? 'Joueur',
        players: room.players.length,
        stake: room.stake,
      }))
  }

  function broadcastPublicRooms() {
    io.emit('arena:public-rooms', publicRoomList())
  }

  function stopGameTimer(room) {
    if (room.gameTimer) clearInterval(room.gameTimer)
    room.gameTimer = null
  }

  function startHeadFootballTimer(room) {
    stopGameTimer(room)
    room.lastGameBroadcastAt = Date.now()
    let lastTickAt = Date.now()
    room.gameTimer = setInterval(() => {
      if (room.phase !== 'running') return
      const now = Date.now()
      const dt = Math.min(1 / 20, Math.max(0, (now - lastTickAt) / 1000))
      lastTickAt = now
      tickHeadFootballMatch(room.gameState.match, dt, room.players.map((player) => player.input))
      if (room.gameState.match.status === 'finished') {
        room.phase = 'finished'
        room.players.forEach((player) => { player.ready = false })
        stopGameTimer(room)
      }
      if (now - room.lastGameBroadcastAt >= 50 || room.phase === 'finished') {
        room.lastGameBroadcastAt = now
        broadcast(room)
      }
    }, 16)
    room.gameTimer.unref?.()
  }

  function startTapTimer(room) {
    stopGameTimer(room)
    room.lastGameBroadcastAt = Date.now()
    room.gameTimer = setInterval(() => {
      if (room.phase !== 'running') return
      const now = Date.now()
      room.players.forEach((player) => {
        const score = room.gameState.scores[player.slot]
        const idleMs = now - player.lastActionAt
        if (score <= 0 || !player.lastActionAt || idleMs <= TAP_DECAY_DELAY_MS) return
        const decay = (TAP_DECAY_PER_SECOND + (idleMs - TAP_DECAY_DELAY_MS) * TAP_IDLE_DECAY_ACCELERATION) * TAP_TICK_MS / 1000
        room.gameState.scores[player.slot] = Math.max(0, score - decay)
      })
      if (now - room.lastGameBroadcastAt >= TAP_SNAPSHOT_MS) {
        room.lastGameBroadcastAt = now
        broadcast(room)
      }
    }, TAP_TICK_MS)
    room.gameTimer.unref?.()
  }

  function startAuthoritativeTimer(room) {
    stopGameTimer(room)
    room.lastGameBroadcastAt = Date.now()
    let lastTickAt = Date.now()
    room.gameTimer = setInterval(() => {
      if (room.phase !== 'running') return
      const now = Date.now()
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTickAt) / 1000))
      lastTickAt = now
      if (room.game === 'memo-5x5') tickMemoMatch(room.gameState, now)
      else if (room.game === 'word-search') tickWordSearchMatch(room.gameState, now)
      else if (room.game === 'dictation-duel') tickDictationMatch(room.gameState.dictation, now)
      else if (room.game === 'damned-maze') tickDamnedMaze(room.gameState, dt)
      else if (room.game === 'grotte-aux-couteaux') tickKnifeDuel(room.gameState, dt)
      else if (room.game === 'colonnes-du-canyon') tickCanyonRace(room.gameState, dt)
      else if (room.game === 'arena-helice') tickHelixArena(room.gameState, dt)
      else if (room.game === 'duel-de-troncs') tickTrunkDuel(room.gameState, dt)
      else if (room.game === 'embuscade') tickSniperDuel(room.gameState, dt)
      else if (room.game === 'moto-taxi-afrique') tickMotoTaxiMatch(room.gameState, dt)
      else if (room.game === 'chemin-de-couleurs') tickColorPathMatch(room.gameState, now)
      else if (room.game === 'duel-de-cartes') tickCardDuelMatch(room.gameState, now)
      else tickAuthoritativeGame(room.gameState, dt)
      if ((room.game === 'grotte-aux-couteaux' || room.game === 'colonnes-du-canyon')
        && room.gameState.status === 'finished') {
        finishForestRoom(room, room.gameState.winner)
        return
      }
      if ((room.game === 'arena-helice' || room.game === 'duel-de-troncs')
        && room.gameState.status === 'finished') {
        finishForestRoom(room, room.gameState.winner)
        return
      }
      if (['moto-taxi-afrique', 'chemin-de-couleurs', 'duel-de-cartes'].includes(room.game)
        && room.gameState.status === 'finished') {
        finishForestRoom(room, room.gameState.winner)
        return
      }
      const finished = room.game === 'dictation-duel'
        ? room.gameState.dictation.status === 'finished'
        : room.game === 'ping-pong'
        ? room.gameState.state === 'over'
        : room.game === 'forest-bridge' || room.game === 'princess-race'
          ? room.gameState.winner !== null
          : room.gameState.status === 'finished'
      if (finished) {
        room.phase = 'finished'
        room.players.forEach((player) => { player.ready = false })
        stopGameTimer(room)
        if (room.game === 'damned-maze') scheduleMazeFinishedExpiry(room)
      }
      const broadcastInterval = room.game === 'arena-helice' ? 33 : room.game === 'embuscade' ? 250 : 50
      if (now - room.lastGameBroadcastAt >= broadcastInterval || finished) {
        room.lastGameBroadcastAt = now
        broadcast(room)
      }
    }, 16)
    room.gameTimer.unref?.()
  }

  function removeRoom(room, reason = null) {
    if (room.countdownTimer) clearTimeout(room.countdownTimer)
    for (const key of ['waitingTimer', 'emptyTimer', 'disconnectTimer', 'finishedTimer']) clearForestTimer(room, key)
    stopGameTimer(room)
    for (const [slot, player] of room.players.entries()) {
      const refund = room.escrowed?.[slot] ?? 0
      if (refund > 0) {
        demoWallets.set(player.walletId, getDemoBalance(player.walletId) + refund)
        sendDemoBalance(player)
        room.escrowed[slot] = 0
      }
      if (player.socketId) socketPlayers.delete(player.socketId)
    }
    rooms.delete(room.code)
    io.to(room.code).emit('arena:closed', { reason })
  }

  function makeRoom(game, players, { isPublic = false, stake = 0, wordSearchCategory = '*' } = {}) {
    const code = makeCode()
    const room = {
      code,
      game,
      wordSearchCategory,
      isPublic,
      stake,
      escrowed: [stake, 0],
      settled: false,
      winnerSlot: null,
      payout: 0,
      phase: 'waiting',
      round: 0,
      seed: null,
      countdownEndsAt: null,
      countdownTimer: null,
      gameTimer: null,
      waitingTimer: null,
      emptyTimer: null,
      disconnectTimer: null,
      finishedTimer: null,
      lastGameBroadcastAt: 0,
      pausedAt: null,
      pausedFrom: null,
      gameState: game === 'tic-tac-toe'
        ? { board: Array(9).fill(0), turn: 0, scores: [0, 0], winner: null }
        : game === 'ball-rush'
          ? { players: [null, null] }
          : game === 'chess-3d'
            ? createChessDuelState()
          : game === 'football-19'
            ? { scores: [0, 0], attempts: [0, 0] }
            : game === 'head-football'
              ? { selections: [null, null], match: null }
            : game === 'tap-tape-arena'
              ? { scores: [0, 0], winner: null }
        : null,
      players,
    }
    rooms.set(code, room)
    scheduleForestWaitingExpiry(room)
    scheduleMazeWaitingExpiry(room)
    for (const player of players) {
      player.roomCode = code
      socketPlayers.set(player.socketId, { code, token: player.token })
      io.sockets.sockets.get(player.socketId)?.join(code)
    }
    broadcastPublicRooms()
    return room
  }

  function createPlayer(socket, slot, name, walletValue) {
    const walletId = typeof walletValue === 'string' && /^[a-z0-9-]{8,64}$/i.test(walletValue)
      ? walletValue
      : randomUUID()
    return {
      token: randomUUID(),
      walletId,
      socketId: socket.id,
      name: playerName(name, slot),
      connected: true,
      ready: false,
      roomCode: null,
      slot,
      mazeSeed: null,
      lastActionAt: 0,
      disconnectedAt: null,
      input: { left: false, right: false, jump: false, kick: false, power: false },
    }
  }

  function startRound(room) {
    if (room.players.length !== 2 || room.players.some((player) => !player.connected || !player.ready)) {
      room.phase = 'waiting'
      room.countdownEndsAt = null
      broadcast(room)
      return
    }
    room.round += 1
    clearForestTimer(room, 'waitingTimer')
    clearForestTimer(room, 'emptyTimer')
    clearForestTimer(room, 'finishedTimer')
    clearMazeTimer(room, 'waitingTimer')
    clearMazeTimer(room, 'emptyTimer')
    clearMazeTimer(room, 'finishedTimer')
    room.seed = randomInt(1, 0x7fffffff)
    room.phase = 'running'
    room.countdownEndsAt = null
    room.players.forEach((player) => { player.ready = false })
    if (room.game === 'tic-tac-toe') {
      const scores = room.gameState?.scores ?? [0, 0]
      room.gameState = { board: Array(9).fill(0), turn: (room.round - 1) % 2, scores, winner: null }
    } else if (room.game === 'ball-rush') {
      room.gameState = {
        players: [0, 1].map(() => ({
          x: 0,
          y: 0,
          lane: 1,
          score: 0,
          coins: 0,
          hits: 0,
          alive: true,
        })),
        status: 'playing',
        winner: null,
      }
    } else if (room.game === 'football-19') {
      room.gameState = { scores: [0, 0], attempts: [0, 0] }
    } else if (room.game === 'head-football') {
      room.gameState = {
        selections: room.gameState?.selections ?? [null, null],
        match: createHeadFootballMatch(room.gameState?.selections ?? [null, null]),
      }
      room.players.forEach((player) => {
        player.input = { left: false, right: false, jump: false, kick: false, power: false }
      })
      startHeadFootballTimer(room)
    } else if (room.game === 'tap-tape-arena') {
      room.gameState = { scores: [0, 0], winner: null }
      room.players.forEach((player) => { player.lastActionAt = 0 })
      startTapTimer(room)
    } else if (room.game === 'memo-5x5') {
      room.gameState = createMemoMatch(room.seed)
      startAuthoritativeTimer(room)
    } else if (room.game === 'word-search') {
      room.gameState = {
        wordSearch: createWordSearchMatch(room.seed, Date.now(), room.wordSearchCategory),
        scores: [0, 0],
      }
      startAuthoritativeTimer(room)
    } else if (room.game === 'dictation-duel') {
      room.gameState = { dictation: createDictationMatch(room.seed), scores: [0, 0] }
      startAuthoritativeTimer(room)
    } else if (room.game === 'damned-maze') {
      room.gameState = createDamnedMazeState(room.seed)
      startAuthoritativeTimer(room)
    } else if (room.game === 'princess-race') {
      room.gameState = createPrincessRaceState()
    } else if (room.game === 'grotte-aux-couteaux') {
      room.gameState = createKnifeDuelState(room.seed)
      startAuthoritativeTimer(room)
    } else if (room.game === 'colonnes-du-canyon') {
      room.gameState = createCanyonRaceState(room.seed)
      startAuthoritativeTimer(room)
    } else if (room.game === 'arena-helice') {
      room.gameState = createHelixArenaState(room.seed)
      startAuthoritativeTimer(room)
    } else if (room.game === 'duel-de-troncs') {
      room.gameState = createTrunkDuelState(room.seed)
      startAuthoritativeTimer(room)
    } else if (room.game === 'chess-3d') {
      room.gameState = createChessDuelState()
    } else if (room.game === 'embuscade') {
      room.gameState = createSniperDuelState()
      startAuthoritativeTimer(room)
    } else if (room.game === 'moto-taxi-afrique') {
      room.gameState = createMotoTaxiMatch()
      startAuthoritativeTimer(room)
    } else if (room.game === 'chemin-de-couleurs') {
      room.gameState = createColorPathMatch(room.seed)
      startAuthoritativeTimer(room)
    } else if (room.game === 'duel-de-cartes') {
      room.gameState = createCardDuelMatch(room.seed)
      startAuthoritativeTimer(room)
    } else if (room.game === 'ping-pong' || room.game === 'basketball-stars' || room.game === 'cannon-duel' || room.game === 'forest-bridge') {
      room.gameState = createAuthoritativeGame(room.game, room.seed)
      startAuthoritativeTimer(room)
    } else {
      room.gameState = null
    }
    broadcast(room)
    io.to(room.code).emit('arena:started', { game: room.game, round: room.round, seed: room.seed })
  }

  function startCountdown(room) {
    if (room.phase === 'countdown' || room.phase === 'running') return
    if (room.players.length !== 2 || room.players.some((player) => !player.connected || !player.ready)) return
    const roomCountdownMs = room.game === 'forest-bridge'
      ? Math.min(countdownMs, 500)
      : countdownMs
    room.phase = 'countdown'
    room.countdownEndsAt = Date.now() + roomCountdownMs
    room.countdownTimer = setTimeout(() => startRound(room), roomCountdownMs)
    room.countdownTimer.unref?.()
    broadcast(room)
  }

  function acknowledge(socket, callback, room, player) {
    if (typeof callback === 'function') callback({ ok: true, code: room.code, token: player.token, slot: room.players.indexOf(player) })
    socket.emit('arena:room:joined', { code: room.code, token: player.token })
    sendDemoBalance(player)
    broadcast(room)
  }

  function finishTicTacToe(room, winner) {
    const state = room.gameState
    state.winner = winner
    if (winner === 0 || winner === 1) state.scores[winner] += 1
    room.phase = 'finished'
    room.players.forEach((player) => { player.ready = false })
    broadcast(room)
  }

  io.on('connection', (socket) => {
    socket.on('arena:room:create', (payload, callback) => {
      if (!GAME_IDS.has(payload?.game)) return callback?.({ ok: false, error: 'Jeu en ligne inconnu.' })
      if (lookup(socket)) return callback?.({ ok: false, error: 'Vous êtes déjà dans une salle.' })
      if (rooms.size >= 300) return callback?.({ ok: false, error: 'Les salles sont temporairement complètes.' })
      const stake = payload?.stake ?? 0
      if (!Number.isSafeInteger(stake) || stake < 0 || stake > 1_000_000) {
        return callback?.({ ok: false, error: 'La mise de démonstration est invalide.' })
      }
      if (payload?.isPublic === true && stake < 1) {
        return callback?.({ ok: false, error: 'Un salon public doit avoir une mise de démonstration positive.' })
      }
      const player = createPlayer(socket, 0, payload?.name, payload?.walletId)
      if (!reserveDemoStake(player, stake)) {
        return callback?.({ ok: false, error: 'Solde de démonstration insuffisant pour cette mise.' })
      }
      const wordSearchCategory = payload?.game === 'word-search'
        && (payload?.category === '*' || Object.hasOwn(WORD_SEARCH_CATEGORIES, payload?.category))
        ? payload.category
        : '*'
      const room = makeRoom(payload.game, [player], {
        isPublic: payload?.isPublic === true,
        stake,
        wordSearchCategory,
      })
      acknowledge(socket, callback, room, player)
    })

    socket.on('arena:public-rooms:request', () => {
      socket.emit('arena:public-rooms', publicRoomList())
    })

    socket.on('arena:demo-wallet:request', (payload) => {
      const walletId = typeof payload?.walletId === 'string' && /^[a-z0-9-]{8,64}$/i.test(payload.walletId)
        ? payload.walletId
        : null
      if (walletId) socket.emit('arena:demo-wallet', { balance: getDemoBalance(walletId) })
    })

    socket.on('arena:room:join', (payload, callback) => {
      const code = typeof payload?.code === 'string' ? payload.code.trim().toUpperCase() : ''
      const room = rooms.get(code)
      if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code) || !room || room.phase === 'finished') {
        return callback?.({ ok: false, error: 'Salle introuvable ou déjà terminée.' })
      }
      if (payload?.game !== undefined && payload.game !== room.game) {
        return callback?.({ ok: false, error: 'Cette salle est réservée à un autre jeu.' })
      }
      if ((payload?.stake ?? 0) !== room.stake) {
        return callback?.({ ok: false, error: 'La mise doit être identique à celle affichée dans le salon.' })
      }
      if (room.players.length >= 2) return callback?.({ ok: false, error: 'Cette salle est déjà complète.' })
      if (lookup(socket)) return callback?.({ ok: false, error: 'Vous êtes déjà dans une salle.' })
      const player = createPlayer(socket, 1, payload?.name, payload?.walletId)
      if (!reserveDemoStake(player, room.stake)) {
        return callback?.({ ok: false, error: 'Solde de démonstration insuffisant pour cette mise.' })
      }
      room.players.push(player)
      clearForestTimer(room, 'waitingTimer')
      clearForestTimer(room, 'emptyTimer')
      clearMazeTimer(room, 'waitingTimer')
      clearMazeTimer(room, 'emptyTimer')
      room.escrowed[player.slot] = room.stake
      player.roomCode = code
      socketPlayers.set(socket.id, { code, token: player.token })
      socket.join(code)
      broadcastPublicRooms()
      acknowledge(socket, callback, room, player)
    })

    socket.on('arena:room:reconnect', (payload, callback) => {
      const code = typeof payload?.code === 'string' ? payload.code.toUpperCase() : ''
      const token = typeof payload?.token === 'string' ? payload.token : ''
      const room = rooms.get(code)
      const player = room?.players.find((item) => item.token === token)
      if (!room || !player || player.connected) {
        return callback?.({ ok: false, error: 'Cette salle ou ce joueur est introuvable.' })
      }
      player.connected = true
      clearForestTimer(room, 'disconnectTimer')
      clearForestTimer(room, 'emptyTimer')
      clearMazeTimer(room, 'disconnectTimer')
      clearMazeTimer(room, 'emptyTimer')
      player.disconnectedAt = null
      player.mazeSeed = null
      player.socketId = socket.id
      socketPlayers.set(socket.id, { code, token })
      socket.join(code)
      if (room.players.every((item) => item.connected) && room.phase === 'paused') {
        const pauseDuration = room.pausedAt === null ? 0 : Date.now() - room.pausedAt
        room.players.forEach((item) => {
          if (item.lastActionAt) item.lastActionAt += pauseDuration
        })
        room.pausedAt = null
        if (isForestRace(room) && room.players.length === 1) scheduleForestWaitingExpiry(room)
        if (room.pausedFrom === 'countdown') {
          room.players.forEach((item) => { item.ready = false })
          room.countdownEndsAt = null
          room.phase = 'waiting'
        } else {
          room.phase = 'running'
        }
        room.pausedFrom = null
      }
      const disconnected = room.players.find((item) => !item.connected)
      if (disconnected && isForestRace(room)) scheduleForestDisconnectExpiry(room, disconnected)
      if (disconnected && room.game === 'damned-maze') scheduleMazeDisconnectExpiry(room, disconnected)
      acknowledge(socket, callback, room, player)
    })

    socket.on('arena:room:ready', (payload, callback) => {
      const entry = lookup(socket)
      if (!entry || !['waiting', 'countdown'].includes(entry.room.phase)) {
        return callback?.({ ok: false, error: 'La salle n’accepte pas les inscriptions.' })
      }
      if (entry.room.game === 'head-football' && payload?.ready
        && !entry.room.gameState.selections[entry.player.slot]) {
        return callback?.({ ok: false, error: 'Choisissez et validez votre club et votre joueur avant de vous déclarer prêt.' })
      }
      entry.player.ready = Boolean(payload?.ready)
      if (!entry.player.ready && entry.room.phase === 'countdown') {
        clearTimeout(entry.room.countdownTimer)
        entry.room.countdownTimer = null
        entry.room.phase = 'waiting'
        entry.room.countdownEndsAt = null
      }
      broadcast(entry.room)
      startCountdown(entry.room)
      broadcastPublicRooms()
      callback?.({ ok: true })
    })

    socket.on('arena:head-football:selection', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      const { clubIndex, playerIndex } = payload ?? {}
      if (!room || room.game !== 'head-football' || !['waiting', 'countdown'].includes(room.phase)
        || player.ready || !Number.isInteger(clubIndex) || clubIndex < 0 || clubIndex >= 30
        || !Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= 40) {
        return callback?.({ ok: false, error: 'La sélection est invalide ou déjà verrouillée.' })
      }
      room.gameState.selections[player.slot] = { clubIndex, playerIndex }
      broadcast(room)
      broadcastPublicRooms()
      callback?.({ ok: true })
    })

    socket.on('arena:ttt:move', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      const cell = payload?.cell
      if (!room || room.game !== 'tic-tac-toe' || room.phase !== 'running' || !Number.isInteger(cell)
        || cell < 0 || cell > 8 || room.gameState.turn !== player.slot || room.gameState.board[cell] !== 0) {
        return callback?.({ ok: false, error: 'Ce coup n’est pas autorisé.' })
      }
      const state = room.gameState
      state.board[cell] = player.slot + 1
      const line = WIN_LINES.find(([a, b, c]) => state.board[a] !== 0 && state.board[a] === state.board[b] && state.board[b] === state.board[c])
      if (line) {
        finishTicTacToe(room, player.slot)
      } else if (state.board.every((value) => value !== 0)) {
        finishTicTacToe(room, null)
      } else {
        state.turn = 1 - player.slot
        broadcast(room)
      }
      callback?.({ ok: true })
    })

    socket.on('arena:game:action', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      if (!room || room.phase !== 'running') {
        return callback?.({ ok: false, error: 'La partie n’est pas active.' })
      }

      if (room.game === 'football-19' && payload?.type === 'shot' && typeof payload.scored === 'boolean') {
        const state = room.gameState
        if (state.attempts[player.slot] >= 5) {
          return callback?.({ ok: false, error: 'Vos cinq tirs sont déjà terminés.' })
        }
        state.attempts[player.slot] += 1
        if (payload.scored) state.scores[player.slot] += 1
        if (state.attempts.every((attempts) => attempts >= 5)) {
          state.winner = state.scores[0] === state.scores[1] ? null : state.scores[0] > state.scores[1] ? 0 : 1
          room.phase = 'finished'
          room.players.forEach((entry) => { entry.ready = false })
        }
      } else if (['ping-pong', 'basketball-stars', 'cannon-duel'].includes(room.game)) {
        const input = boundedObject(payload?.input, 2048)
        if (!input || !applyAuthoritativeInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Action invalide ou non autorisée pour cette manche.' })
        }
        callback?.({ ok: true })
        return
      } else if (room.game === 'head-football' && payload?.type === 'input') {
        const input = sanitizeHeadFootballInput(payload.input)
        if (room.phase !== 'running' || !input || room.gameState.match?.status === 'finished') {
          return callback?.({ ok: false, error: 'Les commandes de match sont invalides ou la manche est inactive.' })
        }
        player.input = input
        callback?.({ ok: true })
        return
      } else if (room.game === 'memo-5x5' && payload?.type === 'memory-flip') {
        const result = flipMemoCard(room.gameState, player.slot, payload.cardId)
        if (!result.ok) return callback?.(result)
      } else if (room.game === 'word-search' && payload?.type === 'word-search:select') {
        const result = submitWordSearchWord(room.gameState.wordSearch, player.slot, payload.start, payload.end)
        if (!result.ok) return callback?.(result)
        room.gameState.scores = [...room.gameState.wordSearch.scores]
        if (room.gameState.wordSearch.status === 'finished') {
          room.gameState.winner = room.gameState.wordSearch.winner
          room.phase = 'finished'
          room.players.forEach((entry) => { entry.ready = false })
          stopGameTimer(room)
        }
      } else if (room.game === 'dictation-duel' && payload?.type === 'dictation:submit') {
        const result = submitDictationAnswer(room.gameState.dictation, player.slot, payload.answer)
        if (!result.ok) return callback?.(result)
        room.gameState.scores = [...room.gameState.dictation.scores]
        if (room.gameState.dictation.status === 'finished') {
          room.phase = 'finished'
          room.players.forEach((entry) => { entry.ready = false })
          stopGameTimer(room)
        }
      } else if (room.game === 'tap-tape-arena' && payload?.type === 'tap') {
        const now = Date.now()
        if (now - player.lastActionAt < 65) {
          return callback?.({ ok: false, error: 'Action trop rapide.' })
        }
        player.lastActionAt = now
        const state = room.gameState
        if (state.winner !== null) return callback?.({ ok: false, error: 'La partie est terminée.' })
        state.scores[player.slot] += 1
        if (state.scores[player.slot] >= 100) {
          state.winner = player.slot
          room.phase = 'finished'
          room.players.forEach((entry) => { entry.ready = false })
          stopGameTimer(room)
        }
      } else {
        return callback?.({ ok: false, error: 'Action invalide pour ce jeu.' })
      }

      broadcast(room)
      callback?.({ ok: true })
    })

    socket.on('arena:state', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      const state = boundedObject(payload?.state, 24_000)
      if (!room || room.phase !== 'running' || room.game === 'tic-tac-toe'
        || room.game === 'ping-pong' || room.game === 'basketball-stars' || room.game === 'cannon-duel'
        || room.game === 'forest-bridge' || room.game === 'princess-race' || room.game === 'damned-maze'
        || room.game === 'head-football' || room.game === 'arena-helice' || room.game === 'duel-de-troncs'
        || room.game === 'chess-3d' || !state) {
        return callback?.({ ok: false, error: 'État de partie non autorisé ou invalide.' })
      }
      if (room.game === 'ball-rush') {
        const { x, y, lane, score, coins, hits, alive } = state
        if (!Number.isFinite(x) || x < -3.2 || x > 3.2
          || !Number.isFinite(y) || y < 0 || y > 12
          || !Number.isInteger(lane) || lane < 0 || lane > 2
          || !Number.isFinite(score) || score < 0 || score > 10_000_000
          || !Number.isFinite(coins) || coins < 0 || coins > 1_000_000
          || !Number.isInteger(hits) || hits < 0 || hits > 20
          || typeof alive !== 'boolean' || alive !== (hits < 20)) {
          return callback?.({ ok: false, error: 'État de course invalide.' })
        }
        const players = room.gameState?.players ?? [null, null]
        const previous = players[player.slot]
        const now = Date.now()
        const elapsedMs = previous?.updatedAt ? now - previous.updatedAt : Number.POSITIVE_INFINITY
        const maxPlausibleScoreIncrease = Math.max(8, elapsedMs * 0.11 + 2)
        if (previous && (elapsedMs < 35
          || score < previous.score
          || score - previous.score > maxPlausibleScoreIncrease
          || hits < previous.hits
          || hits - previous.hits > 1
          || !previous.alive && (alive || score !== previous.score || hits !== previous.hits))) {
          return callback?.({ ok: false, error: 'Mise à jour de course trop rapide ou incohérente.' })
        }
        players[player.slot] = { x, y, lane, score, coins, hits, alive, updatedAt: now }
        room.gameState.players = players
        if (hits === 20) {
          room.gameState.status = 'finished'
          room.gameState.winner = 1 - player.slot
          room.winnerSlot = 1 - player.slot
          room.phase = 'finished'
          room.players.forEach((entry) => { entry.ready = false })
          stopGameTimer(room)
        }
      } else if (room.game === 'embuscade') {
        const result = updateSniperDuelScore(room.gameState, player.slot, state)
        if (!result.ok) return callback?.(result)
        if (room.gameState.status === 'finished') {
          room.phase = 'finished'
          room.winnerSlot = room.gameState.winner
          room.players.forEach((entry) => { entry.ready = false })
          stopGameTimer(room)
        }
      } else {
        if (player.slot !== 0) {
          return callback?.({ ok: false, error: 'Seul le joueur hôte peut publier cet état.' })
        }
        room.gameState = state
      }
      broadcast(room)
      callback?.({ ok: true })
    })

    socket.on('arena:room:finish', (_payload, callback) => {
      const entry = lookup(socket)
      if (!entry || entry.room.phase !== 'running' || entry.player.slot !== 0
      || ['ball-rush', 'ping-pong', 'basketball-stars', 'head-football', 'forest-bridge', 'damned-maze', 'princess-race', 'grotte-aux-couteaux', 'colonnes-du-canyon', 'arena-helice', 'duel-de-troncs', 'chess-3d', 'embuscade'].includes(entry.room.game)) {
        return callback?.({ ok: false, error: 'Cette manche ne peut pas être terminée par ce joueur.' })
      }
      entry.room.phase = 'finished'
      entry.room.players.forEach((player) => { player.ready = false })
      broadcast(entry.room)
      callback?.({ ok: true })
    })

    socket.on('arena:input', (payload, callback) => {
      const entry = lookup(socket)
      const { room, player } = entry ?? {}
      const input = boundedObject(payload?.input, 2048)
      if (!room || room.phase !== 'running' || room.game === 'tic-tac-toe' || !input) {
        return callback?.({ ok: false, error: 'Entrée de jeu non autorisée ou invalide.' })
      }
      if (room.game === 'chess-3d') {
        const result = submitChessMove(room.gameState, player.slot, input.from, input.to)
        if (!result.ok) return callback?.(result)
        if (room.gameState.status === 'finished') {
          room.phase = 'finished'
          room.winnerSlot = room.gameState.winner
          room.players.forEach((entry) => { entry.ready = false })
        }
        broadcast(room)
        callback?.({ ok: true })
        return
      }
      if (room.game === 'ping-pong' || room.game === 'basketball-stars' || room.game === 'cannon-duel') {
        if (!applyAuthoritativeInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Action invalide ou non autorisée pour cette manche.' })
        }
        if (room.game === 'cannon-duel') broadcast(room)
        callback?.({ ok: true })
        return
      }
      if (room.game === 'forest-bridge') {
        if (!applyAuthoritativeInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Le saut est invalide ou ce n’est pas votre tour.' })
        }
        if (room.gameState.winner !== null) {
          finishForestRoom(room, room.gameState.winner)
          callback?.({ ok: true })
          return
        }
        broadcast(room)
        callback?.({ ok: true })
        return
      }
      if (room.game === 'princess-race') {
        if (!applyPrincessRaceAction(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Dé invalide, dé rouge épuisé ou ce n’est pas votre tour.' })
        }
        if (room.gameState.winner !== null) finishForestRoom(room, room.gameState.winner)
        else broadcast(room)
        callback?.({ ok: true })
        return
      }
      if (room.game === 'damned-maze') {
        if (!applyDamnedMazeInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Le déplacement est invalide ou la partie n’est plus active.' })
        }
        callback?.({ ok: true })
        return
      }
      if (room.game === 'grotte-aux-couteaux') {
        if (!applyKnifeDuelInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Déplacement invalide ou partie terminée.' })
        }
        callback?.({ ok: true })
        return
      }
      if (room.game === 'colonnes-du-canyon') {
        if (!applyCanyonRaceInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Commande invalide ou partie terminée.' })
        }
        callback?.({ ok: true })
        return
      }
      if (room.game === 'arena-helice') {
        if (!applyHelixArenaInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Commande invalide ou partie terminée.' })
        }
        const opponent = room.players.find((item) => item.slot !== player.slot)
        if (opponent?.connected && opponent.socketId) {
          io.to(opponent.socketId).emit('arena:remote-input', { slot: player.slot, input })
        }
        callback?.({ ok: true })
        return
      }
      if (room.game === 'duel-de-troncs') {
        if (!applyTrunkDuelInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Commande invalide ou partie terminée.' })
        }
        callback?.({ ok: true })
        return
      }
      if (room.game === 'moto-taxi-afrique') {
        if (!applyMotoTaxiInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Commande de conduite invalide ou partie terminée.' })
        }
        const opponent = room.players.find((item) => item.slot !== player.slot)
        if (opponent?.connected && opponent.socketId) {
          io.to(opponent.socketId).emit('arena:remote-input', { slot: player.slot, input })
        }
        callback?.({ ok: true })
        return
      }
      if (room.game === 'chemin-de-couleurs') {
        if (!applyColorPathInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Case invalide ou phase de réponse inactive.' })
        }
        if (room.gameState.status === 'finished') finishForestRoom(room, room.gameState.winner)
        else broadcast(room)
        callback?.({ ok: true })
        return
      }
      if (room.game === 'duel-de-cartes') {
        if (!applyCardDuelInput(room.gameState, player.slot, input)) {
          return callback?.({ ok: false, error: 'Cette carte n’est pas disponible ou ce n’est pas votre tour.' })
        }
        broadcast(room)
        callback?.({ ok: true })
        return
      }
      const recipient = room.players.find((item) => item.slot === 0)
      if (recipient?.socketId) {
        io.to(recipient.socketId).emit('arena:remote-input', { slot: player.slot, input })
      }
      callback?.({ ok: true })
    })

    socket.on('arena:room:rematch', (_payload, callback) => {
      const entry = lookup(socket)
      if (!entry || entry.room.phase !== 'finished') return callback?.({ ok: false, error: 'La manche en cours n’est pas terminée.' })
      entry.player.ready = true
      if (entry.room.players.every((player) => player.connected && player.ready)) {
        clearForestTimer(entry.room, 'finishedTimer')
        if (entry.room.stake > 0) {
          for (const player of entry.room.players) {
            if (getDemoBalance(player.walletId) < entry.room.stake) {
              entry.room.players.forEach((item) => { item.ready = false })
              broadcast(entry.room)
              return callback?.({ ok: false, error: 'Solde démo insuffisant pour rejouer cette mise.' })
            }
          }
          entry.room.players.forEach((player, slot) => {
            reserveDemoStake(player, entry.room.stake)
            entry.room.escrowed[slot] = entry.room.stake
          })
        }
        entry.room.settled = false
        entry.room.payout = 0
        entry.room.winnerSlot = null
        entry.room.phase = 'waiting'
        if (entry.room.game === 'tic-tac-toe') {
          entry.room.gameState = { ...entry.room.gameState, board: Array(9).fill(0), winner: null }
        } else if (entry.room.game === 'football-19') {
          entry.room.gameState = { scores: [0, 0], attempts: [0, 0] }
        } else if (entry.room.game === 'head-football') {
          entry.room.gameState = {
            selections: entry.room.gameState.selections,
            match: null,
          }
          entry.room.players.forEach((player) => {
            player.input = { left: false, right: false, jump: false, kick: false, power: false }
          })
        } else if (entry.room.game === 'tap-tape-arena') {
          entry.room.gameState = { scores: [0, 0], winner: null }
        } else if (entry.room.game === 'damned-maze' || entry.room.game === 'princess-race'
          || entry.room.game === 'grotte-aux-couteaux' || entry.room.game === 'colonnes-du-canyon') {
          entry.room.gameState = null
        }
      }
      broadcast(entry.room)
      startCountdown(entry.room)
      callback?.({ ok: true })
    })

    socket.on('arena:room:leave', (_payload, callback) => {
      const entry = lookup(socket)
      if (!entry) return callback?.({ ok: true })
      removeRoom(entry.room)
      broadcastPublicRooms()
      callback?.({ ok: true })
    })

    socket.on('disconnect', () => {
      const entry = lookup(socket)
      if (!entry) return
      const { room, player } = entry
      player.connected = false
      player.socketId = null
      player.disconnectedAt = Date.now()
      player.input = { left: false, right: false, jump: false, kick: false, power: false }
      if (room.game === 'grotte-aux-couteaux' && room.gameState?.players[player.slot]) {
        room.gameState.players[player.slot].input = { direction: 0, targetZ: null }
      }
      if (room.game === 'colonnes-du-canyon' && room.gameState?.players[player.slot]) {
        room.gameState.players[player.slot].input = { left: false, right: false, jump: false }
        room.gameState.players[player.slot].jumpHeld = false
        room.gameState.players[player.slot].jumpBuffer = 0
      }
      socketPlayers.delete(socket.id)
      if (isForestRace(room)) scheduleForestDisconnectExpiry(room, player)
      if (room.game === 'damned-maze') scheduleMazeDisconnectExpiry(room, player)
      if (room.phase === 'running' || room.phase === 'countdown') {
        room.pausedFrom = room.phase
        if (room.countdownTimer) clearTimeout(room.countdownTimer)
        room.countdownTimer = null
        room.phase = 'paused'
        room.countdownEndsAt = null
        room.pausedAt = Date.now()
      }
      broadcast(room)
      broadcastPublicRooms()
    })
  })

  return { rooms, getDemoBalance, reserveDemoStake, addDemoCredits, sendDemoBalance }
}
