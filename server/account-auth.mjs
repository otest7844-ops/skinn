import { randomBytes, randomInt, scryptSync, createHash, timingSafeEqual } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import express from 'express'

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
const CHALLENGE_TTL_MS = 5 * 60 * 1000
const TERMS_VERSION = 'chicago-demo-2026-11-12'
const PASSWORD_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const COUNTRIES = new Set(`AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW`.split(' '))

function hash(value) {
  return createHash('sha256').update(value).digest('hex')
}

function createPassword() {
  return Array.from({ length: 8 }, () => PASSWORD_CHARS[randomInt(PASSWORD_CHARS.length)]).join('')
}

function normalizePlayerName(value) {
  if (typeof value !== 'string') return null
  const name = Array.from(value, (character) => {
    const code = character.codePointAt(0) ?? 0
    return code < 32 || code === 127 ? '' : character
  })
    .join('').trim().slice(0, 24)
  return name.length >= 2 ? name : null
}

function authCookie(token, maxAge, secure) {
  return `chicago_session=${token}; HttpOnly; SameSite=Strict; Path=/api/auth; Max-Age=${maxAge}${secure ? '; Secure' : ''}`
}

export function attachAccountAuth(app, { databasePath = resolve('server', 'data', 'chicago-auth.sqlite') } = {}) {
  if (databasePath !== ':memory:') mkdirSync(dirname(databasePath), { recursive: true })
  const database = new DatabaseSync(databasePath)
  database.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      country TEXT NOT NULL,
      device_type TEXT NOT NULL DEFAULT 'computer',
      device_hash TEXT NOT NULL UNIQUE,
      password_salt TEXT NOT NULL,
      password_hash BLOB NOT NULL,
      terms_version TEXT NOT NULL,
      accepted_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS account_sessions (
      token_hash TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS account_sessions_expiry ON account_sessions(expires_at);
  `)
  const accountColumns = new Set(database.prepare('PRAGMA table_info(accounts)').all().map((column) => column.name))
  if (!accountColumns.has('device_type')) {
    database.exec("ALTER TABLE accounts ADD COLUMN device_type TEXT NOT NULL DEFAULT 'computer'")
  }

  const challenges = new Map()
  const requests = new Map()
  let lastRequestCleanup = 0
  const configuredOrigins = new Set(
    (process.env.AUTH_ALLOWED_ORIGINS ?? '').split(',').map((origin) => origin.trim()).filter(Boolean),
  )

  function isAllowedOrigin(origin) {
    if (configuredOrigins.has(origin)) return true
    try {
      const url = new URL(origin)
      const host = url.hostname
      return (url.protocol === 'http:' || url.protocol === 'https:')
        && (host === 'localhost' || host === '127.0.0.1' || host === '::1'
          || /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)
          || /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)
          || /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host))
    } catch {
      return false
    }
  }

  app.use('/api/auth', (request, response, next) => {
    response.setHeader('Cache-Control', 'no-store')
    const origin = request.get('Origin')
    if (origin && !isAllowedOrigin(origin)) return response.status(403).json({ error: 'Origine non autorisée.' })
    if (origin) {
      response.setHeader('Access-Control-Allow-Origin', origin)
      response.setHeader('Access-Control-Allow-Credentials', 'true')
      response.setHeader('Vary', 'Origin')
    }
    if (request.method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      return response.sendStatus(204)
    }
    next()
  })

  app.use('/api/auth', (request, response, next) => {
    if (request.method === 'GET' || request.method === 'OPTIONS' || request.method === 'DELETE') return next()
    if (!request.is('application/json')) return response.status(415).json({ error: 'Le format JSON est requis.' })
    expressJson(request, response, next)
  })

  function allowRequest(request, response, key, limit, windowMs) {
    const now = Date.now()
    if (now - lastRequestCleanup > 60_000) {
      for (const [requestId, timestamps] of requests) {
        if (timestamps.every((timestamp) => now - timestamp >= 10 * 60 * 1000)) requests.delete(requestId)
      }
      lastRequestCleanup = now
    }
    const ip = request.ip ?? request.socket.remoteAddress ?? 'unknown'
    const id = `${key}:${ip}`
    const recent = (requests.get(id) ?? []).filter((timestamp) => now - timestamp < windowMs)
    if (recent.length >= limit) {
      response.setHeader('Retry-After', String(Math.ceil((windowMs - (now - recent[0])) / 1000)))
      response.status(429).json({ error: 'Trop de tentatives. Réessayez plus tard.' })
      return false
    }
    recent.push(now)
    requests.set(id, recent)
    return true
  }

  function consumeChallenge(request, body) {
    if (typeof body?.challengeId !== 'string' || typeof body?.captchaAnswer !== 'string') return false
    const challenge = challenges.get(body.challengeId)
    challenges.delete(body.challengeId)
    return Boolean(challenge && challenge.expiresAt > Date.now()
      && /^[0-9]{1,3}$/.test(body.captchaAnswer)
      && Number(body.captchaAnswer) === challenge.answer
      && challenge.ip === (request.ip ?? request.socket.remoteAddress ?? 'unknown'))
  }

  function getAccountForSession(request) {
    const cookies = request.get('Cookie') ?? ''
    const token = cookies.match(/(?:^|;\s*)chicago_session=([a-f0-9]{64})(?:;|$)/)?.[1]
    if (!token) return null
    const session = database.prepare(`
      SELECT accounts.id, accounts.display_name AS name, accounts.country, account_sessions.expires_at
      FROM account_sessions JOIN accounts ON accounts.id = account_sessions.account_id
      WHERE account_sessions.token_hash = ? AND account_sessions.expires_at > ?
    `).get(hash(token), Date.now())
    return session ?? null
  }

  function issueSession(request, response, accountId) {
    const token = randomBytes(32).toString('hex')
    const expiresAt = Date.now() + SESSION_TTL_MS
    database.prepare('DELETE FROM account_sessions WHERE account_id = ?').run(accountId)
    database.prepare('INSERT INTO account_sessions(token_hash, account_id, expires_at) VALUES (?, ?, ?)')
      .run(hash(token), accountId, expiresAt)
    database.prepare('DELETE FROM account_sessions WHERE expires_at <= ?').run(Date.now())
    const forwardedProtocol = request.get('x-forwarded-proto')?.split(',')[0].trim().toLowerCase()
    return authCookie(token, Math.floor(SESSION_TTL_MS / 1000), request.secure || forwardedProtocol === 'https')
  }

  app.get('/api/auth/captcha', (request, response) => {
    if (!allowRequest(request, response, 'captcha', 30, 10 * 60 * 1000)) return
    const left = randomInt(2, 10)
    const right = randomInt(2, 10)
    const challengeId = randomBytes(18).toString('hex')
    const now = Date.now()
    for (const [id, challenge] of challenges) if (challenge.expiresAt <= now) challenges.delete(id)
    challenges.set(challengeId, {
      answer: left + right,
      expiresAt: now + CHALLENGE_TTL_MS,
      ip: request.ip ?? request.socket.remoteAddress ?? 'unknown',
    })
    response.json({ challengeId, question: `${left} + ${right} = ?` })
  })

  app.post('/api/auth/register', (request, response) => {
    if (!allowRequest(request, response, 'register', 5, 10 * 60 * 1000)) return
    const body = request.body
    if (!consumeChallenge(request, body)) return response.status(400).json({ error: 'Vérification démo incorrecte ou expirée. Rechargez le calcul.' })
    const displayName = normalizePlayerName(body?.name)
    const country = typeof body?.country === 'string' ? body.country.toUpperCase() : ''
    const deviceToken = body?.deviceToken
    const deviceType = body?.deviceType
    const accepted = body?.acceptances
    if (!displayName || !COUNTRIES.has(country) || !['phone', 'tablet', 'computer'].includes(deviceType)
      || typeof deviceToken !== 'string' || !/^[a-f0-9]{64}$/.test(deviceToken)
      || body?.termsRead !== true || !accepted
      || ['contract', 'rules', 'financial', 'terms'].some((key) => accepted[key] !== true)) {
      return response.status(400).json({ error: 'Vérifiez votre pseudo, votre pays, votre appareil, les quatre acceptations et les données de l’appareil.' })
    }

    const salt = randomBytes(16).toString('base64url')
    const password = createPassword()
    const passwordHash = scryptSync(password, salt, 64)
    const deviceHash = hash(deviceToken)
    let id
    let sessionCookie
    let transactionStarted = false
    try {
      database.exec('BEGIN IMMEDIATE')
      transactionStarted = true
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const candidate = String(randomInt(1_000_000_000, 10_000_000_000))
        if (!database.prepare('SELECT 1 FROM accounts WHERE id = ?').get(candidate)) {
          id = candidate
          break
        }
      }
      if (!id) throw new Error('Unable to allocate an account identifier.')
      const acceptedAt = new Date().toISOString()
      database.prepare(`
        INSERT INTO accounts(id, display_name, country, device_type, device_hash, password_salt, password_hash, terms_version, accepted_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, displayName, country, deviceType, deviceHash, salt, passwordHash, TERMS_VERSION, acceptedAt, acceptedAt)
      sessionCookie = issueSession(request, response, id)
      database.exec('COMMIT')
      transactionStarted = false
    } catch (error) {
      if (transactionStarted) database.exec('ROLLBACK')
      if (error?.errcode === 2067) {
        return response.status(409).json({ error: 'Ce navigateur possède déjà un compte. Connectez-vous ou utilisez un autre navigateur.' })
      }
      console.error('Unable to create Chicago demo account:', error)
      return response.status(500).json({ error: 'Impossible de créer le compte pour le moment.' })
    }
    response.setHeader('Set-Cookie', sessionCookie)
    response.status(201).json({
      account: { id, name: displayName, country, deviceType },
      credentials: { id, password },
      termsVersion: TERMS_VERSION,
    })
  })

  app.post('/api/auth/login', (request, response) => {
    if (!allowRequest(request, response, 'login', 10, 10 * 60 * 1000)) return
    const body = request.body
    if (!consumeChallenge(request, body)) return response.status(400).json({ error: 'Vérification démo incorrecte ou expirée. Rechargez le calcul.' })
    const id = typeof body?.id === 'string' ? body.id : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    const deviceToken = body?.deviceToken
    const deviceType = body?.deviceType
    const validNewPassword = /^[A-Za-z]{8}$/.test(password)
    const validLegacyPassword = /^[A-Za-z0-9!@#$%_-]{16}$/.test(password)
    if (!/^[0-9]{10}$/.test(id) || (!validNewPassword && !validLegacyPassword)
      || !['phone', 'tablet', 'computer'].includes(deviceType)
      || typeof deviceToken !== 'string' || !/^[a-f0-9]{64}$/.test(deviceToken)) {
      return response.status(400).json({ error: 'Identifiants ou appareil invalides.' })
    }
    const account = database.prepare('SELECT id, display_name AS name, country, device_hash, password_salt, password_hash FROM accounts WHERE id = ?').get(id)
    const suppliedHash = scryptSync(password, account?.password_salt ?? randomBytes(16), 64)
    if (!account || !timingSafeEqual(suppliedHash, account.password_hash)) {
      return response.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' })
    }
    const deviceHash = hash(deviceToken)
    let sessionCookie
    let transactionStarted = false
    try {
      database.exec('BEGIN IMMEDIATE')
      transactionStarted = true
      const deviceOwner = database.prepare('SELECT id FROM accounts WHERE device_hash = ?').get(deviceHash)
      if (deviceOwner && deviceOwner.id !== account.id) {
        database.prepare('UPDATE accounts SET device_hash = ? WHERE id = ?')
          .run(hash(randomBytes(32).toString('hex')), deviceOwner.id)
      }
      database.prepare('UPDATE accounts SET device_hash = ?, device_type = ? WHERE id = ?')
        .run(deviceHash, deviceType, account.id)
      sessionCookie = issueSession(request, response, account.id)
      database.exec('COMMIT')
      transactionStarted = false
    } catch (error) {
      if (transactionStarted) database.exec('ROLLBACK')
      console.error('Unable to create Chicago account session:', error)
      return response.status(500).json({ error: 'Impossible d’ouvrir la session pour le moment.' })
    }
    response.setHeader('Set-Cookie', sessionCookie)
    response.json({ account: { id: account.id, name: account.name, country: account.country, deviceType } })
  })

  app.get('/api/auth/me', (request, response) => {
    const account = getAccountForSession(request)
    if (!account) return response.status(401).json({ error: 'Session expirée.' })
    response.json({ account: { id: account.id, name: account.name, country: account.country } })
  })

  app.delete('/api/auth/session', (request, response) => {
    const cookies = request.get('Cookie') ?? ''
    const token = cookies.match(/(?:^|;\s*)chicago_session=([a-f0-9]{64})(?:;|$)/)?.[1]
    if (token) database.prepare('DELETE FROM account_sessions WHERE token_hash = ?').run(hash(token))
    response.setHeader('Set-Cookie', authCookie('', 0, request.secure))
    response.sendStatus(204)
  })

  return { close: () => database.close() }
}

export function createAccountAuthApp(options) {
  const app = express()
  const accountAuth = attachAccountAuth(app, options)
  return {
    app: (request, response) => app(request, response),
    close: accountAuth.close,
  }
}

function expressJson(request, response, next) {
  let body = ''
  let bodyBytes = 0
  let tooLarge = false
  request.setEncoding('utf8')
  request.on('data', (chunk) => {
    if (tooLarge) return
    bodyBytes += Buffer.byteLength(chunk, 'utf8')
    if (bodyBytes > 16_384) {
      tooLarge = true
      return
    }
    body += chunk
  })
  request.on('end', () => {
    if (tooLarge) return response.status(413).json({ error: 'Requête trop volumineuse.' })
    if (response.headersSent) return
    try {
      request.body = body ? JSON.parse(body) : {}
      next()
    } catch {
      response.status(400).json({ error: 'Requête JSON invalide.' })
    }
  })
  request.on('error', (error) => {
    if (!response.headersSent) next(error)
  })
}
