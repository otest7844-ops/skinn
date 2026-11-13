import assert from 'node:assert/strict'
import test from 'node:test'
import { createMosswingServer } from './server.mjs'

async function createChallenge(baseUrl) {
  const response = await fetch(`${baseUrl}/api/auth/captcha`)
  assert.equal(response.status, 200)
  return response.json()
}

function captchaAnswer(challenge) {
  const match = challenge.question.match(/^(\d+) \+ (\d+) = \?$/)
  assert.ok(match)
  return String(Number(match[1]) + Number(match[2]))
}

async function registerAccount(baseUrl, challenge, overrides = {}) {
  return fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      challengeId: challenge.challengeId,
      captchaAnswer: '2',
      name: 'Joueur Test',
      country: 'CI',
      deviceType: 'phone',
      deviceToken: 'a'.repeat(64),
      termsRead: true,
      acceptances: { contract: true, rules: true, financial: true, terms: true },
      ...overrides,
    }),
  })
}

test('creates a demo account with an eight-letter password and an HttpOnly session', async (context) => {
  const server = createMosswingServer({ port: 0, authDatabasePath: ':memory:' })
  const address = await server.start()
  context.after(() => server.stop())
  const baseUrl = `http://127.0.0.1:${address.port}`
  const challenge = await createChallenge(baseUrl)
  const response = await registerAccount(baseUrl, challenge, {
    captchaAnswer: String(Number(captchaAnswer(challenge)) + 1),
  })

  assert.equal(response.status, 400)
  const refreshedChallenge = await createChallenge(baseUrl)
  const created = await registerAccount(baseUrl, refreshedChallenge, { captchaAnswer: captchaAnswer(refreshedChallenge) })
  assert.equal(created.status, 201)
  const data = await created.json()
  assert.match(data.credentials.id, /^\d{10}$/)
  assert.match(data.credentials.password, /^[A-Za-z]{8}$/)
  assert.equal(data.account.country, 'CI')
  assert.equal(data.account.deviceType, 'phone')
  assert.match(created.headers.get('set-cookie'), /HttpOnly/)
  assert.match(created.headers.get('set-cookie'), /SameSite=Strict/)

  const cookie = created.headers.get('set-cookie').split(';')[0]
  const session = await fetch(`${baseUrl}/api/auth/me`, { headers: { cookie } })
  assert.equal(session.status, 200)
  assert.equal((await session.json()).account.id, data.credentials.id)
})

test('rejects generated-password formats that are not eight alphabetic letters', async (context) => {
  const server = createMosswingServer({ port: 0, authDatabasePath: ':memory:' })
  const address = await server.start()
  context.after(() => server.stop())
  const baseUrl = `http://127.0.0.1:${address.port}`
  const challenge = await createChallenge(baseUrl)
  const created = await registerAccount(baseUrl, challenge, { captchaAnswer: captchaAnswer(challenge) })
  const credentials = (await created.json()).credentials

  for (const password of ['ABCDEFG', 'ABCDEF12', 'ABCDEF!@']) {
    const loginChallenge = await createChallenge(baseUrl)
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        challengeId: loginChallenge.challengeId,
        captchaAnswer: captchaAnswer(loginChallenge),
        id: credentials.id,
        password,
        deviceType: 'phone',
        deviceToken: 'b'.repeat(64),
      }),
    })
    assert.equal(response.status, 400)
  }
})

test('requires all four terms and rejects a second account on the same browser', async (context) => {
  const server = createMosswingServer({ port: 0, authDatabasePath: ':memory:' })
  const address = await server.start()
  context.after(() => server.stop())
  const baseUrl = `http://127.0.0.1:${address.port}`

  const challenge = await createChallenge(baseUrl)
  const unreadTerms = await registerAccount(baseUrl, challenge, { captchaAnswer: captchaAnswer(challenge), termsRead: false })
  assert.equal(unreadTerms.status, 400)

  const termsChallenge = await createChallenge(baseUrl)
  const missingAcceptance = await registerAccount(baseUrl, challenge, {
    challengeId: termsChallenge.challengeId,
    captchaAnswer: captchaAnswer(termsChallenge),
    acceptances: { contract: true, rules: true, financial: false, terms: true },
  })
  assert.equal(missingAcceptance.status, 400)

  const nextChallenge = await createChallenge(baseUrl)
  const created = await registerAccount(baseUrl, nextChallenge, { captchaAnswer: captchaAnswer(nextChallenge) })
  assert.equal(created.status, 201)
  const duplicateChallenge = await createChallenge(baseUrl)
  const duplicate = await registerAccount(baseUrl, duplicateChallenge, {
    captchaAnswer: captchaAnswer(duplicateChallenge),
    deviceToken: 'a'.repeat(64),
  })
  assert.equal(duplicate.status, 409)
})

test('logs in with generated credentials and transfers the single active browser session', async (context) => {
  const server = createMosswingServer({ port: 0, authDatabasePath: ':memory:' })
  const address = await server.start()
  context.after(() => server.stop())
  const baseUrl = `http://127.0.0.1:${address.port}`
  const challenge = await createChallenge(baseUrl)
  const created = await registerAccount(baseUrl, challenge, { captchaAnswer: captchaAnswer(challenge) })
  const credentials = (await created.json()).credentials
  const originalCookie = created.headers.get('set-cookie').split(';')[0]

  const loginChallenge = await createChallenge(baseUrl)
  const loggedIn = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      challengeId: loginChallenge.challengeId,
      captchaAnswer: captchaAnswer(loginChallenge),
      id: credentials.id,
      password: credentials.password,
      deviceType: 'tablet',
      deviceToken: 'b'.repeat(64),
    }),
  })
  assert.equal(loggedIn.status, 200)
  assert.equal((await loggedIn.json()).account.id, credentials.id)
  const oldSession = await fetch(`${baseUrl}/api/auth/me`, { headers: { cookie: originalCookie } })
  assert.equal(oldSession.status, 401)

  const activeCookie = loggedIn.headers.get('set-cookie').split(';')[0]
  const logout = await fetch(`${baseUrl}/api/auth/session`, {
    method: 'DELETE',
    headers: { cookie: activeCookie },
  })
  assert.equal(logout.status, 204)
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/)
  const closedSession = await fetch(`${baseUrl}/api/auth/me`, { headers: { cookie: activeCookie } })
  assert.equal(closedSession.status, 401)
})

test('allows an authenticated player to transfer a browser to another account', async (context) => {
  const server = createMosswingServer({ port: 0, authDatabasePath: ':memory:' })
  const address = await server.start()
  context.after(() => server.stop())
  const baseUrl = `http://127.0.0.1:${address.port}`

  const firstChallenge = await createChallenge(baseUrl)
  const firstResponse = await registerAccount(baseUrl, firstChallenge, {
    captchaAnswer: captchaAnswer(firstChallenge),
    deviceToken: 'a'.repeat(64),
  })
  assert.equal(firstResponse.status, 201)
  const firstAccount = (await firstResponse.json()).credentials

  const secondChallenge = await createChallenge(baseUrl)
  const secondResponse = await registerAccount(baseUrl, secondChallenge, {
    captchaAnswer: captchaAnswer(secondChallenge),
    deviceToken: 'b'.repeat(64),
  })
  assert.equal(secondResponse.status, 201)
  const secondAccount = (await secondResponse.json()).credentials

  const loginChallenge = await createChallenge(baseUrl)
  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      challengeId: loginChallenge.challengeId,
      captchaAnswer: captchaAnswer(loginChallenge),
      id: secondAccount.id,
      password: secondAccount.password,
      deviceType: 'phone',
      deviceToken: 'a'.repeat(64),
    }),
  })
  assert.equal(login.status, 200)
  assert.equal((await login.json()).account.id, secondAccount.id)

  const switchBackChallenge = await createChallenge(baseUrl)
  const switchBack = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      challengeId: switchBackChallenge.challengeId,
      captchaAnswer: captchaAnswer(switchBackChallenge),
      id: firstAccount.id,
      password: firstAccount.password,
      deviceType: 'phone',
      deviceToken: 'a'.repeat(64),
    }),
  })
  assert.equal(switchBack.status, 200)
  assert.equal((await switchBack.json()).account.id, firstAccount.id)
})

test('does not set an account session when the CAPTCHA is wrong', async (context) => {
  const server = createMosswingServer({ port: 0, authDatabasePath: ':memory:' })
  const address = await server.start()
  context.after(() => server.stop())
  const baseUrl = `http://127.0.0.1:${address.port}`
  const challenge = await createChallenge(baseUrl)
  const response = await registerAccount(baseUrl, challenge, {
    captchaAnswer: String(Number(captchaAnswer(challenge)) + 1),
  })
  assert.equal(response.status, 400)
  assert.equal(response.headers.get('set-cookie'), null)
})

test('closes authentication storage when the multiplayer port cannot be acquired', async (context) => {
  const activeServer = createMosswingServer({ port: 0, authDatabasePath: ':memory:' })
  const address = await activeServer.start()
  context.after(() => activeServer.stop())
  const duplicateServer = createMosswingServer({ port: address.port, authDatabasePath: ':memory:' })
  await assert.rejects(duplicateServer.start(), (error) => error.code === 'EADDRINUSE')
  await duplicateServer.stop()
})
