(() => {
  const gameId = 'duel-de-troncs'
  let online = false
  let paused = false
  let slot = 0
  const forwardedKeys = new Set()
  const keyActions = {
    KeyA: { slot: 0, action: 'left' },
    KeyD: { slot: 0, action: 'right' },
    KeyW: { slot: 0, action: 'jump' },
    Space: { slot: 0, action: 'jump' },
    ArrowLeft: { slot: 1, action: 'left' },
    ArrowRight: { slot: 1, action: 'right' },
    ArrowUp: { slot: 1, action: 'jump' },
  }

  function send(action) {
    if (!online || paused || window.parent === window) return
    window.parent.postMessage({ type: `${gameId}:input`, input: { action } }, window.location.origin)
  }

  function keyboardAction(event) {
    const key = event.code
    if (slot === 0) {
      if (key === 'KeyA') return 'left'
      if (key === 'KeyD') return 'right'
      if (key === 'KeyW' || key === 'Space') return 'jump'
    } else {
      if (key === 'ArrowLeft') return 'left'
      if (key === 'ArrowRight') return 'right'
      if (key === 'ArrowUp' || key === 'Space') return 'jump'
    }
    return null
  }

  window.addEventListener('keydown', (event) => {
    if (!online) return
    const action = keyboardAction(event)
    if (action) {
      event.preventDefault()
      event.stopImmediatePropagation()
      if (!event.repeat) send(action)
    } else if (event.code === 'Escape') {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }, true)

  window.addEventListener('pointerdown', (event) => {
    if (!online || !(event.target instanceof Element)) return
    const button = event.target.closest('.pad button')
    if (!button || Number(button.dataset.p) !== slot) return
    const action = button.dataset.a === 'L' ? 'left'
      : button.dataset.a === 'R' ? 'right'
        : button.dataset.a === 'J' ? 'jump' : null
    if (!action) return
    event.preventDefault()
    event.stopImmediatePropagation()
    send(action)
  }, true)

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return

    if (message.type === `${gameId}:solo`) {
      online = false
      forwardedKeys.clear()
      window.__duelTroncs?.startSolo()
    } else if (message.type === `${gameId}:local`) {
      online = false
      forwardedKeys.clear()
      window.__duelTroncs?.startLocal()
    } else if (message.type === `${gameId}:enable`) {
      online = true
      paused = false
      slot = message.slot === 1 ? 1 : 0
      forwardedKeys.clear()
      window.__duelTroncs?.startOnline(slot, message.seed, message.names)
      const useOuterTouch = window.matchMedia('(pointer: coarse)').matches
        || navigator.maxTouchPoints > 0
        || window.innerWidth <= 760
      if (useOuterTouch) {
        document.querySelectorAll('.pad').forEach((pad) => { pad.style.display = 'none' })
      }
    } else if (message.type === `${gameId}:state`) {
      window.__duelTroncs?.applyOnlineState(message.state)
    } else if (message.type === `${gameId}:keyboard`) {
      if (!online) return
      if (message.reset) {
        forwardedKeys.clear()
        return
      }
      const action = keyActions[message.code]
      if (!action || action.slot !== slot || typeof message.pressed !== 'boolean') return
      if (message.pressed) {
        if (forwardedKeys.has(message.code)) return
        forwardedKeys.add(message.code)
        send(action.action)
      } else {
        forwardedKeys.delete(message.code)
      }
    } else if (message.type === `${gameId}:pause` || message.type === `${gameId}:resume`) {
      paused = message.type === `${gameId}:pause`
      if (paused) forwardedKeys.clear()
      window.__duelTroncs?.setPaused(paused)
    }
  })
})()
