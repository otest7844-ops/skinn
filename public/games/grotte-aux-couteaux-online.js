(() => {
  const gameId = 'grotte-aux-couteaux'
  let online = false
  let slot = 0
  let direction = 0
  let pointerId = null
  let lastTarget = null
  let lastTargetAt = 0
  let pointerBound = false

  const send = (input) => {
    if (!online || !window.parent || window.parent === window) return
    window.parent.postMessage({ type: `${gameId}:input`, input }, window.location.origin)
  }

  const keyDirection = (key) => {
    const up = slot === 0 ? ['z', 'w'] : ['arrowup', 'i']
    const down = slot === 0 ? ['s'] : ['arrowdown', 'k']
    return down.includes(key) ? 1 : up.includes(key) ? -1 : null
  }

  const pressed = new Set()
  const sendDirection = () => {
    const next = [...pressed].map(keyDirection).filter((value) => value !== null)
    const value = next.length ? next[next.length - 1] : 0
    if (value !== direction) {
      direction = value
      send({ direction: value })
    }
  }

  window.addEventListener('keydown', (event) => {
    if (!online) return
    const key = event.key.toLowerCase()
    if (key === 'escape' || key === 'p' || keyDirection(key) !== null) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    if (keyDirection(key) === null || pressed.has(key)) return
    pressed.add(key)
    sendDirection()
  }, true)

  window.addEventListener('keyup', (event) => {
    if (!online) return
    const key = event.key.toLowerCase()
    if (keyDirection(key) === null) return
    event.preventDefault()
    event.stopImmediatePropagation()
    pressed.delete(key)
    sendDirection()
  }, true)

  window.addEventListener('blur', () => {
    if (!online) return
    pressed.clear()
    direction = 0
    send({ direction: 0, targetZ: null })
  })

  function bindPointer() {
    const canvas = window.__gk?.canvas
    if (!canvas || pointerBound) return
    pointerBound = true
    canvas.addEventListener('pointerdown', (event) => {
      if (!online) return
      const bounds = canvas.getBoundingClientRect()
      const pointerSlot = event.clientX < bounds.left + bounds.width / 2 ? 0 : 1
      if (pointerSlot !== slot) return
      event.preventDefault()
      pointerId = event.pointerId
      try { canvas.setPointerCapture(pointerId) } catch { /* pointer capture is optional */ }
      updatePointer(event)
    }, true)
    canvas.addEventListener('pointermove', (event) => {
      if (online && event.pointerId === pointerId) updatePointer(event)
    }, true)
    const releasePointer = (event) => {
      if (!online || event.pointerId !== pointerId) return
      pointerId = null
      lastTarget = null
      send({ targetZ: null })
    }
    canvas.addEventListener('pointerup', releasePointer, true)
    canvas.addEventListener('pointercancel', releasePointer, true)
  }

  function updatePointer(event) {
    const targetZ = window.__gk?.pointerZ(event)
    if (!Number.isFinite(targetZ)) return
    const now = performance.now()
    if (lastTarget !== null && Math.abs(lastTarget - targetZ) < 0.08 && now - lastTargetAt < 45) return
    lastTarget = targetZ
    lastTargetAt = now
    send({ targetZ })
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return

    if (message.type === `${gameId}:solo` || message.type === `${gameId}:local`) {
      online = false
      window.__gk?.setOnline(false)
      window.__gk?.start(message.type.endsWith(':local') ? 2 : 1)
      return
    }
    if (message.type === `${gameId}:enable`) {
      slot = message.slot === 1 ? 1 : 0
      online = true
      direction = 0
      pressed.clear()
      window.__gk?.start(2)
      window.__gk?.setOnline(true)
      bindPointer()
      return
    }
    if (message.type === `${gameId}:state`) {
      window.__gk?.applyOnlineState(message.state)
    }
    if (message.type === `${gameId}:pause` || message.type === `${gameId}:resume`) {
      online = message.type === `${gameId}:resume`
      if (!online) {
        pressed.clear()
        direction = 0
        send({ direction: 0, targetZ: null })
      }
    }
  })
})()
