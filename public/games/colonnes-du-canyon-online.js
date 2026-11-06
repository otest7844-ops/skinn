(() => {
  const gameId = 'colonnes-du-canyon'
  let online = false
  let paused = false
  let slot = 0
  let names = ['Joueur 1', 'Joueur 2']
  let lastSent = { left: false, right: false, jump: false }
  let touchControls

  const send = (input) => {
    if (!online || paused || !window.parent || window.parent === window) return
    window.parent.postMessage({ type: `${gameId}:input`, input }, window.location.origin)
  }

  const setInput = (patch) => {
    const next = { ...lastSent, ...patch }
    if (next.left === lastSent.left && next.right === lastSent.right && next.jump === lastSent.jump) return
    lastSent = next
    send(next)
  }

  const updateInputFromKeys = () => {
    const keys = window.__canyonKeys ?? {}
    setInput({
      left: Boolean(keys.left),
      right: Boolean(keys.right),
      jump: Boolean(keys.jump),
    })
  }

  const onKey = (event, pressed) => {
    const key = event.key.toLowerCase()
    if (!['arrowleft', 'a', 'q', 'arrowright', 'd', 'arrowup', 'w', ' '].includes(key)) return
    event.preventDefault()
    event.stopImmediatePropagation()
    const keys = window.__canyonKeys ?? (window.__canyonKeys = {})
    if (key === 'arrowleft' || key === 'a' || key === 'q') keys.left = pressed
    if (key === 'arrowright' || key === 'd') keys.right = pressed
    if (key === 'arrowup' || key === 'w' || key === ' ') keys.jump = pressed
    updateInputFromKeys()
  }

  window.addEventListener('keydown', (event) => {
    if (online) onKey(event, true)
  }, true)
  window.addEventListener('keyup', (event) => {
    if (online) onKey(event, false)
  }, true)
  window.addEventListener('blur', () => {
    window.__canyonKeys = {}
    if (online) setInput({ left: false, right: false, jump: false })
  })

  function createTouchControls() {
    const style = document.createElement('style')
    style.textContent = `
      #canyonOnlineControls{position:fixed;z-index:20;left:12px;right:12px;bottom:12px;display:none;justify-content:space-between;align-items:end;pointer-events:none;font:700 14px Arial,sans-serif}
      #canyonOnlineControls button{width:64px;height:58px;border:1px solid rgba(255,230,180,.55);border-radius:16px;background:rgba(44,23,17,.76);color:#fff3d4;font-size:21px;touch-action:none;pointer-events:auto}
      #canyonOnlineControls .jump{width:88px;height:68px;background:rgba(139,54,30,.82);font-size:14px}
      #canyonOnlineControls button:focus-visible{outline:3px solid #ffd36b;outline-offset:2px}
    `
    const panel = document.createElement('div')
    panel.id = 'canyonOnlineControls'
    panel.innerHTML = '<button type="button" aria-label="Aller à gauche">◀</button><button type="button" class="jump" aria-label="Sauter">SAUT</button><button type="button" aria-label="Aller à droite">▶</button>'
    const [left, jump, right] = panel.querySelectorAll('button')
    const bind = (button, key) => {
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault()
        button.setPointerCapture(event.pointerId)
        const keys = window.__canyonKeys ?? (window.__canyonKeys = {})
        keys[key] = true
        updateInputFromKeys()
      })
      const release = (event) => {
        event.preventDefault()
        const keys = window.__canyonKeys ?? (window.__canyonKeys = {})
        keys[key] = false
        updateInputFromKeys()
      }
      button.addEventListener('pointerup', release)
      button.addEventListener('pointercancel', release)
      button.addEventListener('lostpointercapture', release)
    }
    bind(left, 'left')
    bind(jump, 'jump')
    bind(right, 'right')
    document.head.append(style)
    document.body.append(panel)
    return panel
  }

  touchControls = createTouchControls()

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return

    if (message.type === `${gameId}:solo` || message.type === `${gameId}:local`) {
      online = false
      touchControls.style.display = 'none'
      window.__canyon?.startSolo()
      return
    }
    if (message.type === `${gameId}:enable`) {
      online = true
      paused = false
      slot = message.slot === 1 ? 1 : 0
      names = Array.isArray(message.names) ? message.names.slice(0, 2) : names
      lastSent = { left: false, right: false, jump: false }
      window.__canyon?.startOnline(slot, names)
      touchControls.style.display = 'flex'
      return
    }
    if (message.type === `${gameId}:pause` || message.type === `${gameId}:resume`) {
      paused = message.type === `${gameId}:pause`
      window.__canyon?.setPaused(paused)
      return
    }
    if (message.type === `${gameId}:state`) window.__canyon?.applyOnlineState(message.state)
  })
})()
