(() => {
  const gameId = 'moto-taxi-afrique'
  const keys = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'gas',
    ArrowDown: 'brake',
    KeyH: 'horn',
    KeyA: 'left',
    KeyD: 'right',
    KeyW: 'gas',
    KeyS: 'brake',
    KeyF: 'horn',
  }
  const actions = ['left', 'right', 'gas', 'brake', 'horn']
  const held = new Map(actions.map((action) => [action, new Set()]))
  let online = false
  let slot = 0
  let pausedOnline = false
  let done = false

  function send(input) {
    window.parent.postMessage({ type: `${gameId}:input`, input }, window.location.origin)
  }

  function setAction(action, source, pressed, notify = true) {
    const sources = held.get(action)
    if (!sources) return
    const wasPressed = sources.size > 0
    if (pressed) sources.add(source)
    else sources.delete(source)
    const isPressed = sources.size > 0
    if (wasPressed === isPressed) return
    IN[slot][action === 'gas' ? 'g' : action === 'brake' ? 'b' : action === 'horn' ? 'h' : action === 'left' ? 'l' : 'r'] = isPressed ? 1 : 0
    if (notify) send({ action, pressed: isPressed })
  }

  function clearInputs() {
    for (const action of actions) {
      held.get(action).clear()
      for (const input of IN) {
        input[action === 'gas' ? 'g' : action === 'brake' ? 'b' : action === 'horn' ? 'h' : action === 'left' ? 'l' : 'r'] = 0
      }
    }
  }

  function clearPlayerInputs(playerSlot) {
    const input = IN[playerSlot]
    if (!input) return
    for (const action of actions) {
      input[action === 'gas' ? 'g' : action === 'brake' ? 'b' : action === 'horn' ? 'h' : action === 'left' ? 'l' : 'r'] = 0
      if (playerSlot === slot) held.get(action).clear()
    }
  }

  window.motoTaxiReportViolation = (reason, distance) => {
    if (online && reason === 'collision' && Number.isFinite(distance)) {
      send({ action: 'violation', reason, distance })
    }
  }

  const pointerActions = [['bl', 'left'], ['br', 'right'], ['bg', 'gas'], ['bb', 'brake'], ['bh', 'horn']]
  for (const [id, action] of pointerActions) {
    const button = document.getElementById(id)
    button?.addEventListener('pointerdown', (event) => {
      if (!online) return
      event.preventDefault()
      event.stopImmediatePropagation()
      button.setPointerCapture(event.pointerId)
      setAction(action, `pointer-${event.pointerId}`, true)
    }, true)
    button?.addEventListener('pointerup', (event) => {
      if (!online) return
      event.preventDefault()
      event.stopImmediatePropagation()
      setAction(action, `pointer-${event.pointerId}`, false)
    }, true)
    button?.addEventListener('pointercancel', (event) => {
      if (online) setAction(action, `pointer-${event.pointerId}`, false)
    }, true)
    button?.addEventListener('lostpointercapture', (event) => {
      if (online) setAction(action, `pointer-${event.pointerId}`, false)
    }, true)
  }

  window.addEventListener('keydown', (event) => {
    if (!online || pausedOnline || done || !keys[event.code]) return
    const keySlot = event.code.startsWith('KeyA') || event.code.startsWith('KeyD')
      || event.code.startsWith('KeyW') || event.code.startsWith('KeyS') || event.code === 'KeyF'
      ? 1
      : 0
    if (keySlot !== slot) return
    event.preventDefault()
    event.stopImmediatePropagation()
    setAction(keys[event.code], `key-${event.code}`, true)
  }, true)

  window.addEventListener('keyup', (event) => {
    if (!online || !keys[event.code]) return
    const keySlot = event.code.startsWith('KeyA') || event.code.startsWith('KeyD')
      || event.code.startsWith('KeyW') || event.code.startsWith('KeyS') || event.code === 'KeyF'
      ? 1
      : 0
    if (keySlot !== slot) return
    event.preventDefault()
    event.stopImmediatePropagation()
    setAction(keys[event.code], `key-${event.code}`, false)
  }, true)

  window.addEventListener('blur', () => {
    if (online) clearInputs()
  })

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return

    if (message.type === `${gameId}:enable`) {
      online = true
      window.motoTaxiOnline = true
      slot = message.slot === 1 ? 1 : 0
      window.motoTaxiSlot = slot
      pausedOnline = false
      done = false
      clearInputs()
      const random = (() => {
        let value = (Number(message.seed) >>> 0) || 1
        return () => {
          value = (1664525 * value + 1013904223) >>> 0
          return value / 0x100000000
        }
      })()
      order = Array.from({ length: CS.length }, (_, index) => index)
      for (let index = order.length - 1; index > 0; index -= 1) {
        const other = Math.floor(random() * (index + 1))
        ;[order[index], order[other]] = [order[other], order[index]]
      }
      endRound = () => {}
      $('ov').style.display = 'none'
      window.go(2)
      return
    }

    if (message.type === `${gameId}:remote-input`) {
      const input = message.input
      if (!input || !actions.includes(input.action) || typeof input.pressed !== 'boolean') return
      const remoteSlot = 1 - slot
      IN[remoteSlot][input.action === 'gas' ? 'g' : input.action === 'brake' ? 'b' : input.action === 'horn' ? 'h' : input.action === 'left' ? 'l' : 'r'] = input.pressed ? 1 : 0
      return
    }

    if (message.type === `${gameId}:state`) {
      const state = message.state
      if (!state || !Array.isArray(state.players) || state.players.length !== 2) return
      state.players.forEach((player, index) => {
        if (!hs[index] || !Number.isFinite(player.distance) || !Number.isFinite(player.speed) || !Number.isFinite(player.lane)) return
        hs[index].serverTarget = { s: player.distance, v: player.speed, l: player.lane }
        hs[index].fin = player.finishedAt === null ? 0 : player.finishedAt
        const penalty = Number.isFinite(player.penaltyRemaining) ? Math.max(0, player.penaltyRemaining) : 0
        if (penalty > 0) {
          clearPlayerInputs(index)
          hs[index].stun = penalty
          hs[index].why = typeof player.penaltyReason === 'string' ? player.penaltyReason : ''
          if (!hs[index].pol) police(hs[index])
        } else if (hs[index].pol) {
          sc.remove(hs[index].pol)
          hs[index].pol = 0
          hs[index].stun = 0
          hs[index].inv = 2.5
          hs[index].why = ''
        }
      })
      if (state.status === 'finished' && !done) {
        done = true
        pausedOnline = true
        clearInputs()
        paused = true
        ovT('COURSE TERMINÉE', state.winner === slot ? 'Vous avez livré le premier !' : 'Votre adversaire a gagné.')
      }
      return
    }

    if (message.type === `${gameId}:pause`) {
      pausedOnline = true
      clearInputs()
    } else if (message.type === `${gameId}:resume`) {
      pausedOnline = false
    }
  })
})()
