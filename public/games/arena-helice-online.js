(() => {
  const gameId = 'arena-helice'
  const keyActions = {
    KeyW: { slot: 0, z: -1 }, KeyS: { slot: 0, z: 1 },
    KeyA: { slot: 0, x: -1 }, KeyD: { slot: 0, x: 1 },
    Space: { slot: 0, jump: true }, ShiftLeft: { slot: 0, jump: true },
    ArrowUp: { slot: 1, z: -1 }, ArrowDown: { slot: 1, z: 1 },
    ArrowLeft: { slot: 1, x: -1 }, ArrowRight: { slot: 1, x: 1 },
    Enter: { slot: 1, jump: true }, ShiftRight: { slot: 1, jump: true },
    Numpad0: { slot: 1, jump: true }, NumpadEnter: { slot: 1, jump: true },
  }
  const keyboardNames = {
    KeyW: 'w', KeyS: 's', KeyA: 'a', KeyD: 'd', Space: ' ',
    ShiftLeft: 'Shift', ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', Enter: 'Enter',
    ShiftRight: 'Shift', Numpad0: '0', NumpadEnter: 'Enter',
  }
  const localKeys = new Set()
  const remoteKeys = new Set()
  const joysticks = new Map()
  const touchJumps = new Set()
  const jumpPointers = new Map()
  const pointers = new Map()
  let online = false
  let paused = false
  let slot = 0
  let started = false
  let lastSent = ''
  let authoritativeState = null
  let authoritativeStateAt = 0
  let syncedScene = null
  let playerRoots = []
  let playerRings = []
  let spinner = null
  let lastRoomDisplayKey = ''
  let touchControlsObserver = null

  function findSceneParts(scene) {
    if (scene === syncedScene) return
    syncedScene = scene
    playerRoots = []
    playerRings = []
    spinner = null
    scene.traverse((object) => {
      if (object.type !== 'Group') return
      if (object.children.some((child) => child.isSprite)
        && object.children.some((child) => child.type === 'Group')) {
        playerRoots.push(object)
      }
      if (!spinner && object.children.some((child) => child.geometry?.type === 'ExtrudeGeometry')) {
        spinner = object
      }
      const ringGroup = object.children.find((child) => child.type === 'Group'
        && child.children.some((part) => part.geometry?.type === 'RingGeometry')
        && child.children.some((part) => part.geometry?.type === 'CircleGeometry'))
      if (ringGroup) {
        const ring = ringGroup.children.find((part) => part.geometry?.type === 'RingGeometry')
        const color = ring?.material?.color?.getHex()
        const index = color === 0xff5b3a ? 1 : color === 0x27c5ff ? 0 : -1
        if (index >= 0) playerRings[index] = object
      }
    })
  }

  function syncAuthoritativeScene(scene) {
    const state = authoritativeState
    if (!online || !state || !Array.isArray(state.players) || state.players.length !== 2) return
    findSceneParts(scene)
    if (playerRoots.length < 2) return
    const elapsed = Math.min(0.12, Math.max(0, (performance.now() - authoritativeStateAt) / 1000))
    state.players.forEach((player, index) => {
      const root = playerRoots[index]
      if (!root) return
      root.position.set(
        player.x + player.vx * elapsed,
        player.y + player.vy * elapsed,
        player.z + player.vz * elapsed,
      )
      root.visible = player.alive || player.y > -40
      const ring = playerRings[index]
      if (ring) ring.position.set(player.x, 0, player.z)
    })
    if (spinner && Number.isFinite(state.spinAngle)) {
      const elapsedSpin = state.phase === 'playing'
        ? (state.spinSpeed ?? 0) * (state.spinDirection ?? 1) * elapsed
        : 0
      spinner.rotation.y = state.spinAngle + elapsedSpin
    }
  }

  function installSceneSync() {
    const rendererType = window.THREE?.WebGLRenderer
    if (!rendererType || rendererType.prototype.__arenaHelixSync) return
    const render = rendererType.prototype.render
    rendererType.prototype.render = function (scene, camera) {
      syncAuthoritativeScene(scene)
      return render.call(this, scene, camera)
    }
    rendererType.prototype.__arenaHelixSync = true
  }

  function post(type, data = {}) {
    if (window.parent === window) return
    window.parent.postMessage({ type: `${gameId}:${type}`, ...data }, window.location.origin)
  }

  function publishInput() {
    if (!online || paused) return
    let x = 0
    let z = 0
    let jump = touchJumps.size > 0
    for (const code of localKeys) {
      const action = keyActions[code]
      if (!action || action.slot !== slot) continue
      x += action.x ?? 0
      z += action.z ?? 0
      jump ||= Boolean(action.jump)
    }
    const joystick = joysticks.get(slot)
    if (joystick) {
      x += joystick.x
      z += joystick.z
    }
    const magnitude = Math.hypot(x, z)
    if (magnitude > 1) {
      x /= magnitude
      z /= magnitude
    }
    const input = {
      x: Math.round(x * 100) / 100,
      z: Math.round(z * 100) / 100,
      jump,
    }
    const encoded = JSON.stringify(input)
    if (encoded === lastSent) return
    lastSent = encoded
    post('input', { input })
  }

  function dispatchKey(code, type) {
    window.dispatchEvent(new KeyboardEvent(type, {
      code,
      key: keyboardNames[code] ?? code,
      bubbles: true,
      cancelable: true,
    }))
  }

  function applyRemoteInput(message) {
    if (!online || message.slot === slot || !message.input || typeof message.input !== 'object') return
    const remoteSlot = message.slot
    const input = message.input
    const desired = new Set()
    if (remoteSlot === 0) {
      if (input.x < -0.04) desired.add('KeyA')
      if (input.x > 0.04) desired.add('KeyD')
      if (input.z < -0.04) desired.add('KeyW')
      if (input.z > 0.04) desired.add('KeyS')
      if (input.jump) desired.add('Space')
    } else {
      if (input.x < -0.04) desired.add('ArrowLeft')
      if (input.x > 0.04) desired.add('ArrowRight')
      if (input.z < -0.04) desired.add('ArrowUp')
      if (input.z > 0.04) desired.add('ArrowDown')
      if (input.jump) desired.add('Enter')
    }
    for (const code of remoteKeys) {
      if (!desired.has(code)) dispatchKey(code, 'keyup')
    }
    for (const code of desired) {
      if (!remoteKeys.has(code)) dispatchKey(code, 'keydown')
    }
    remoteKeys.clear()
    desired.forEach((code) => remoteKeys.add(code))
  }

  function setOnlineLayout() {
    document.body.classList.toggle('arena-online', online)
    let style = document.getElementById('arena-online-style')
    if (!style) {
      style = document.createElement('style')
      style.id = 'arena-online-style'
      style.textContent = [
        'body.arena-online #menu .ctl:not(.p' + (slot + 1) + '){display:none}',
        'body.arena-online #menu .lead{display:none}',
        'body.arena-online #menu .note::after{content:" Vos commandes sont synchronisées avec le salon."}',
        'body.arena-online #touch{display:none!important}',
      ].join('')
      document.head.append(style)
    } else {
      style.textContent = [
        'body.arena-online #menu .ctl:not(.p' + (slot + 1) + '){display:none}',
        'body.arena-online #menu .lead{display:none}',
        'body.arena-online #menu .note::after{content:" Vos commandes sont synchronisées avec le salon."}',
        'body.arena-online #touch{display:none!important}',
      ].join('')
    }
    const controls = document.querySelectorAll('#touch .pad')
    controls.forEach((pad, index) => { pad.hidden = online && index !== slot })
    const panel = document.getElementById('menu')
    if (panel) {
      const eyebrow = panel.querySelector('.eyebrow')
      if (eyebrow) eyebrow.textContent = online ? 'Salon multijoueur · en ligne' : 'Duel à deux · même écran'
    }
  }

  function ensureTouchControls() {
    const shouldShow = window.matchMedia('(pointer: coarse)').matches
      || navigator.maxTouchPoints > 0
      || window.innerWidth <= 600
    if (!shouldShow) return
    document.documentElement.classList.add('touch')
    const touch = document.getElementById('touch')
    if (touch) touch.hidden = false
    document.getElementById('hint')?.setAttribute('hidden', '')
    if (touchControlsObserver || !touch) return
    touchControlsObserver = new MutationObserver(() => {
      if (online && document.getElementById('touch')?.hidden) {
        document.getElementById('touch').hidden = false
      }
    })
    touchControlsObserver.observe(touch, { attributes: true, attributeFilter: ['hidden'] })
  }

  function enterOnline(nextSlot) {
    online = true
    paused = false
    slot = nextSlot === 1 ? 1 : 0
    localKeys.clear()
    remoteKeys.clear()
    joysticks.clear()
    touchJumps.clear()
    lastSent = ''
    lastRoomDisplayKey = ''
    setOnlineLayout()
    const button = document.getElementById(started ? 'again' : 'start')
    if (button) button.click()
    started = true
    ensureTouchControls()
  }

  function syncRoomState(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.scores)) return
    authoritativeState = snapshot
    authoritativeStateAt = performance.now()
    const firstScore = document.getElementById('s1')
    const secondScore = document.getElementById('s2')
    if (firstScore) firstScore.textContent = String(snapshot.scores[0] ?? 0)
    if (secondScore) secondScore.textContent = String(snapshot.scores[1] ?? 0)
    const timer = document.getElementById('timer')
    const rpm = document.getElementById('rpm')
    if (timer && Number.isFinite(snapshot.roundTime)) {
      const minutes = Math.floor(snapshot.roundTime / 60)
      const seconds = snapshot.roundTime - minutes * 60
      timer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(1)}`
    }
    if (rpm && Number.isFinite(snapshot.spinSpeed)) {
      rpm.textContent = snapshot.spinSpeed > 0
        ? `Hélice ${Math.round(Math.abs(snapshot.spinSpeed * snapshot.spinDirection) * 60 / (2 * Math.PI))} tr/min`
        : 'Hélice à l’arrêt'
    }
    const menu = document.getElementById('menu')
    const over = document.getElementById('over')
    const pause = document.getElementById('pause')
    const title = document.getElementById('t-over')
    const score = document.getElementById('over-score')
    const banner = document.getElementById('banner')
    if (menu) menu.hidden = true
    if (pause) pause.hidden = true
    if (snapshot.status === 'finished') {
      if (over) over.hidden = false
      if (title) title.textContent = `Joueur ${(snapshot.winner ?? 0) + 1} gagne`
      if (score) score.textContent = `${snapshot.scores[0] ?? 0} – ${snapshot.scores[1] ?? 0}`
      if (banner) banner.hidden = true
      lastRoomDisplayKey = `finished:${snapshot.round}`
      return
    }
    if (over) over.hidden = true
    if (!banner) return
    if (snapshot.phase === 'roundover') {
      const displayKey = `${snapshot.round}:roundover:${snapshot.roundWinner}`
      if (displayKey === lastRoomDisplayKey) return
      lastRoomDisplayKey = displayKey
      const winner = snapshot.roundWinner
      const headline = document.createElement('span')
      headline.textContent = winner === null ? 'Égalité' : `Point J${winner + 1}`
      const details = document.createElement('small')
      details.textContent = winner === null
        ? 'Personne ne marque'
        : `${snapshot.scores[0] ?? 0} – ${snapshot.scores[1] ?? 0}`
      banner.replaceChildren(headline, details)
      banner.style.color = winner === 0 ? 'var(--p1)' : winner === 1 ? 'var(--p2)' : 'var(--fg)'
      banner.hidden = false
    } else if (snapshot.phase === 'countdown') {
      const count = Math.max(1, Math.ceil((snapshot.countdown ?? 0) / 0.8))
      const displayKey = `${snapshot.round}:countdown:${count}`
      if (displayKey !== lastRoomDisplayKey) {
        lastRoomDisplayKey = displayKey
        banner.textContent = String(count)
        banner.style.color = 'var(--fg)'
        banner.hidden = false
      }
    } else {
      const displayKey = `${snapshot.round}:${snapshot.phase}`
      if (displayKey !== lastRoomDisplayKey) {
        lastRoomDisplayKey = displayKey
        banner.hidden = true
      }
    }
  }

  window.addEventListener('keydown', (event) => {
    if (!online || !event.isTrusted) return
    const action = keyActions[event.code]
    if (!action) return
    if (action.slot !== slot) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    if (!event.repeat) {
      localKeys.add(event.code)
      publishInput()
    }
  }, true)

  window.addEventListener('keyup', (event) => {
    if (!online || !event.isTrusted) return
    const action = keyActions[event.code]
    if (!action) return
    if (action.slot !== slot) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    localKeys.delete(event.code)
    publishInput()
  }, true)

  window.addEventListener('pointerdown', (event) => {
    if (!online || !event.isTrusted || !(event.target instanceof Element)) return
    const stick = event.target.closest('#st1, #st2')
    const jump = event.target.closest('#j1, #j2')
    if (!stick && !jump) return
    const controlSlot = Number((stick ?? jump).id.slice(-1)) - 1
    if (controlSlot !== slot) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    if (stick) {
      const rect = stick.getBoundingClientRect()
      pointers.set(event.pointerId, {
        slot: controlSlot,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    } else {
      touchJumps.add(controlSlot)
      jumpPointers.set(event.pointerId, controlSlot)
      publishInput()
    }
  }, true)

  window.addEventListener('pointermove', (event) => {
    if (!online || !event.isTrusted) return
    const pointer = pointers.get(event.pointerId)
    if (!pointer) return
    const dx = event.clientX - pointer.x
    const dy = event.clientY - pointer.y
    const distance = Math.hypot(dx, dy)
    const scale = distance > 44 ? 44 / distance : 1
    joysticks.set(pointer.slot, {
      x: Math.abs(dx) < 8 ? 0 : dx * scale / 44,
      z: Math.abs(dy) < 8 ? 0 : dy * scale / 44,
    })
    publishInput()
  }, true)

  function releasePointer(event) {
    const jumpSlot = jumpPointers.get(event.pointerId)
    if (jumpSlot !== undefined) {
      jumpPointers.delete(event.pointerId)
      touchJumps.delete(jumpSlot)
      publishInput()
      return
    }
    const pointer = pointers.get(event.pointerId)
    if (!pointer) return
    pointers.delete(event.pointerId)
    joysticks.delete(pointer.slot)
    publishInput()
  }

  window.addEventListener('pointerup', releasePointer, true)
  window.addEventListener('pointercancel', releasePointer, true)
  window.addEventListener('blur', () => {
    if (!online) return
    localKeys.clear()
    joysticks.clear()
    touchJumps.clear()
    jumpPointers.clear()
    pointers.clear()
    publishInput()
  })

  window.addEventListener('click', (event) => {
    if (!online || !(event.target instanceof Element)) return
    if (event.target.closest('#again')) {
      event.preventDefault()
      event.stopImmediatePropagation()
      post('rematch')
    }
  }, true)

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return
    if (message.type === `${gameId}:enable`) {
      enterOnline(message.slot)
    } else if (message.type === `${gameId}:state`) {
      syncRoomState(message.state)
    } else if (message.type === `${gameId}:remote-input`) {
      applyRemoteInput(message)
    } else if (message.type === `${gameId}:keyboard`) {
      if (!online) return
      if (message.reset) {
        for (const code of localKeys) dispatchKey(code, 'keyup')
        localKeys.clear()
        publishInput()
        return
      }
      const { code, pressed } = message
      const action = keyActions[code]
      if (!action || action.slot !== slot || typeof pressed !== 'boolean') return
      if (pressed) {
        if (localKeys.has(code)) return
        localKeys.add(code)
        dispatchKey(code, 'keydown')
      } else {
        if (!localKeys.delete(code)) return
        dispatchKey(code, 'keyup')
      }
      publishInput()
    } else if (message.type === `${gameId}:pause`) {
      paused = true
      publishInput()
    } else if (message.type === `${gameId}:resume`) {
      paused = false
      publishInput()
    } else if (message.type === `${gameId}:solo` || message.type === `${gameId}:local`) {
      online = false
      paused = false
      authoritativeState = null
      setOnlineLayout()
    }
  })

  installSceneSync()
})()
