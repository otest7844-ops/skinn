import { randomUUID } from 'node:crypto'

const MATCHES = [
  {
    id: 'bundesliga',
    category: 'football',
    league: 'Allemagne · Bundesliga',
    home: 'Bayern Munich',
    away: 'Borussia Dortmund',
    homeOdds: 1.82,
    drawOdds: 3.65,
    awayOdds: 3.9,
    image: '/images/extracted/event-bundesliga.png',
  },
  {
    id: 'laliga',
    category: 'football',
    league: 'Espagne · La Liga',
    home: 'Real Madrid',
    away: 'FC Barcelone',
    homeOdds: 2.15,
    drawOdds: 3.4,
    awayOdds: 2.95,
    image: '/images/extracted/event-laliga.png',
  },
  {
    id: 'esport-astra',
    category: 'esport',
    league: 'E-sport Pro',
    home: 'Astra Force',
    away: 'Nova Pulse',
    homeOdds: 1.85,
    drawOdds: 3.2,
    awayOdds: 1.95,
    image: '/images/promo-champion.svg',
  },
  {
    id: 'duel-meteor',
    category: 'duel',
    league: 'Duel communautaire',
    home: 'Meteor Club',
    away: 'Comet United',
    homeOdds: 1.74,
    drawOdds: 3.1,
    awayOdds: 2.12,
    image: '/images/game-crash.svg',
  },
  {
    id: 'communaute-bleue',
    category: 'communaute',
    league: 'Choix de la communauté',
    home: 'Équipe bleue',
    away: 'Équipe or',
    homeOdds: 1.91,
    drawOdds: 3.25,
    awayOdds: 1.88,
    image: '/images/promo-bonus.svg',
  },
]

const OPTION_ODDS = {
  V1: (match) => match.homeOdds,
  X: (match) => match.drawOdds,
  V2: (match) => match.awayOdds,
}
const MIN_STAKE = 50
const MAX_STAKE = 10_000
const MAX_POTENTIAL = 1_000_000_000

export function createDemoSportsbook({ getBalance, reserveStake, makeId = randomUUID }) {
  const ticketsByWallet = new Map()
  const idempotency = new Map()

  function getTickets(walletId) {
    return [...(ticketsByWallet.get(walletId) ?? [])]
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  }

  function placeCoupon({ walletId, selections, stake, idempotencyKey }) {
    if (typeof walletId !== 'string' || !/^[a-z0-9-]{8,64}$/i.test(walletId)) {
      return { ok: false, error: 'Identifiant de portefeuille invalide.' }
    }
    if (typeof idempotencyKey !== 'string' || !/^[a-z0-9-]{8,96}$/i.test(idempotencyKey)) {
      return { ok: false, error: 'Identifiant de coupon invalide.' }
    }
    const requestKey = `${walletId}:${idempotencyKey}`
    const previousId = idempotency.get(requestKey)
    if (previousId) {
      const previousTicket = getTickets(walletId).find((ticket) => ticket.id === previousId)
      if (previousTicket) return { ok: true, ticket: previousTicket, balance: getBalance(walletId), duplicate: true }
    }
    if (!Number.isSafeInteger(stake) || stake < MIN_STAKE || stake > MAX_STAKE) {
      return { ok: false, error: `La mise doit être comprise entre ${MIN_STAKE} et ${MAX_STAKE} crédits démo.` }
    }
    if (!Array.isArray(selections) || selections.length < 1 || selections.length > MATCHES.length) {
      return { ok: false, error: 'Sélectionnez entre 1 et 5 événements.' }
    }

    const seenMatches = new Set()
    const picks = []
    let combinedOdds = 1
    for (const selection of selections) {
      if (!selection || typeof selection !== 'object' || Array.isArray(selection)
        || Object.keys(selection).some((key) => key !== 'matchId' && key !== 'option')
        || typeof selection.matchId !== 'string' || !Object.hasOwn(OPTION_ODDS, selection.option)
        || seenMatches.has(selection.matchId)) {
        return { ok: false, error: 'Une sélection du coupon est invalide ou répétée.' }
      }
      const match = MATCHES.find((entry) => entry.id === selection.matchId)
      if (!match) return { ok: false, error: 'Un événement sélectionné n’est pas disponible.' }
      seenMatches.add(match.id)
      const odds = OPTION_ODDS[selection.option](match)
      combinedOdds *= odds
      picks.push({
        matchId: match.id,
        matchTitle: `${match.home} - ${match.away}`,
        selection: selection.option === 'V1' ? match.home : selection.option === 'V2' ? match.away : 'Nul',
        option: selection.option,
        odds,
      })
    }

    const potential = Math.floor(stake * combinedOdds)
    if (!Number.isSafeInteger(potential) || potential > MAX_POTENTIAL) {
      return { ok: false, error: 'Le gain potentiel dépasse la limite du coupon démo.' }
    }
    if (!reserveStake(walletId, stake)) {
      return { ok: false, error: 'Solde de crédits démo insuffisant.' }
    }

    const ticket = {
      id: `DEMO-${makeId()}`,
      selections: picks,
      stake,
      combinedOdds: Number(combinedOdds.toFixed(4)),
      potential,
      createdAt: new Date().toISOString(),
      status: 'pending',
      demoOnly: true,
    }
    const tickets = ticketsByWallet.get(walletId) ?? []
    tickets.push(ticket)
    if (tickets.length > 500) tickets.shift()
    ticketsByWallet.set(walletId, tickets)
    idempotency.set(requestKey, ticket.id)
    if (idempotency.size > 10_000) idempotency.delete(idempotency.keys().next().value)
    return { ok: true, ticket, balance: getBalance(walletId), duplicate: false }
  }

  return {
    catalog: () => MATCHES.map((match) => ({ ...match })),
    getTickets,
    placeCoupon,
  }
}
