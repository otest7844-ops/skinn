(() => {
  const gameId = 'embuscade'
  const originalAnimationFrame = window.requestAnimationFrame.bind(window)
  let online = false
  let paused = false
  let slot = 0
  let finished = false
  let heldFrame = null
  let lastReport = ''
  let names = ['Joueur 1', 'Joueur 2']
  let scoreboard

  window.requestAnimationFrame = (callback) => originalAnimationFrame((time) => {
    if (paused) {
      heldFrame = callback
      return
    }
    callback(time)
  })

  function send(type, payload = {}) {
    if (!window.parent || window.parent === window) return
    window.parent.postMessage({ type: `${gameId}:${type}`, ...payload }, window.location.origin)
  }

  function readNumber(id) {
    const value = Number.parseInt(document.getElementById(id)?.textContent ?? '', 10)
    return Number.isSafeInteger(value) && value >= 0 ? value : 0
  }

  function reportScore() {
    if (!online || finished) return
    const state = {
      score: readNumber('sc'),
      kills: Number.parseInt(document.getElementById('ki')?.textContent ?? '', 10) || 0,
      finished: !document.getElementById('end')?.classList.contains('off'),
    }
    const signature = JSON.stringify(state)
    if (signature === lastReport) return
    lastReport = signature
    send('state', { state })
  }

  function createScoreboard() {
    scoreboard = document.createElement('div')
    scoreboard.id = 'embuscadeOnlineScore'
    scoreboard.setAttribute('role', 'status')
    scoreboard.setAttribute('aria-live', 'polite')
    Object.assign(scoreboard.style, {
      position: 'fixed',
      zIndex: '10',
      top: 'max(12px, env(safe-area-inset-top))',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '7px 12px',
      border: '1px solid rgba(232,169,58,.8)',
      borderRadius: '4px',
      background: 'rgba(12,15,10,.88)',
      color: '#ece6d0',
      font: '700 14px Barlow Condensed, Arial, sans-serif',
      textAlign: 'center',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    })
    document.body.append(scoreboard)
  }

  function updateScoreboard(state) {
    if (!scoreboard) return
    const scores = Array.isArray(state?.scores) ? state.scores : [0, 0]
    const remaining = Number.isFinite(state?.remainingMs) ? Math.ceil(state.remainingMs / 1000) : 75
    scoreboard.textContent = `${names[0]} ${scores[0] ?? 0} — ${scores[1] ?? 0} ${names[1]} · ${remaining}s`
    if (state?.status === 'finished') {
      finished = true
      paused = true
      scoreboard.textContent += state.winner === null
        ? ' · Égalité'
        : state.winner === slot ? ' · Victoire' : ' · Défaite'
    }
  }

  createScoreboard()
  new MutationObserver(reportScore).observe(document.body, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  })
  window.setInterval(reportScore, 350)

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return

    if (message.type === `${gameId}:enable`) {
      online = true
      paused = false
      finished = false
      slot = message.slot === 1 ? 1 : 0
      names = Array.isArray(message.names) ? message.names.slice(0, 2) : names
      names = [names[0] ?? 'Joueur 1', names[1] ?? 'Joueur 2']
      lastReport = ''
      const replay = document.getElementById('again')
      if (replay) replay.hidden = true
      document.getElementById('go')?.click()
      reportScore()
      return
    }

    if (message.type === `${gameId}:pause` || message.type === `${gameId}:resume`) {
      paused = finished || message.type === `${gameId}:pause`
      if (!paused && heldFrame) {
        const callback = heldFrame
        heldFrame = null
        originalAnimationFrame(callback)
      }
      return
    }

    if (message.type === `${gameId}:state`) updateScoreboard(message.state)
  })
})()
