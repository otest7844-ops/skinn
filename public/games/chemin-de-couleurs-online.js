(() => {
  const gameId = 'chemin-de-couleurs'
  let online = false
  let slot = 0
  let showingLevel = 0
  let animationId = 0

  function send(input) {
    window.parent.postMessage({ type: `${gameId}:input`, input }, window.location.origin)
  }

  function showSequence(sequence, level) {
    const currentAnimation = ++animationId
    path = sequence.slice()
    lvlEl.textContent = String(level)
    lenEl.textContent = String(sequence.length)
    state = 'showing'
    reset()
    msg.textContent = 'Mémorise le chemin…'
    const speed = Math.max(380, 700 - level * 25)
    void (async () => {
      await sleep(900)
      for (let index = 0; index < sequence.length; index += 1) {
        if (currentAnimation !== animationId) return
        setT(sequence[index], .12, BLUE)
        lightOn(sequence[index], BLUE, 3.5)
        beep(300 + index * 35)
        await sleep(speed)
        if (currentAnimation !== animationId) return
        setT(sequence[index], 0, OFF)
        gI = 0
        await sleep(160)
      }
    })()
  }

  function applyState(serverState) {
    if (!serverState || !Array.isArray(serverState.progress)) return
    lvlEl.textContent = String(serverState.level)
    bestEl.textContent = String(Math.max(...serverState.scores))

    if (serverState.status === 'finished') {
      animationId += 1
      state = 'over'
      msg.textContent = serverState.winner === null
        ? 'Égalité — même niveau atteint.'
        : serverState.winner === slot
          ? `Victoire ! Vous avez atteint le niveau ${serverState.scores[slot]}.`
          : `Partie terminée au niveau ${serverState.level}.`
      go.textContent = 'Rejouer'
      go.style.display = ''
      go.onclick = () => window.parent.postMessage({ type: `${gameId}:rematch` }, window.location.origin)
      return
    }

    go.style.display = 'none'
    if (serverState.phase === 'showing' && Array.isArray(serverState.path)
      && showingLevel !== serverState.level) {
      showingLevel = serverState.level
      showSequence(serverState.path, serverState.level)
      return
    }

    if (serverState.phase === 'input') {
      animationId += 1
      path = path.length ? path : Array.isArray(serverState.path) ? serverState.path : []
      state = serverState.failed[slot] || serverState.completed[slot] ? 'done' : 'input'
      step = serverState.progress[slot]
      if (serverState.failed[slot]) {
        msg.textContent = `Vous avez manqué le chemin. Niveau ${serverState.level}.`
      } else if (serverState.completed[slot]) {
        msg.textContent = `Niveau ${serverState.level} réussi ! En attente de l’adversaire…`
      } else {
        msg.textContent = serverState.youFailed
          ? 'Votre adversaire a manqué le chemin.'
          : `À vous : ${step}/${lenEl.textContent} cases.`
      }
    }
  }

  const localTap = tap
  tap = (tile) => {
    if (!online) return localTap(tile)
    if (state !== 'input') return
    send({ type: 'tile', tile })
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return

    if (message.type === `${gameId}:enable`) {
      online = true
      slot = message.slot === 1 ? 1 : 0
      showingLevel = 0
      animationId += 1
      go.style.display = 'none'
      return
    }

    if (message.type === `${gameId}:state`) applyState(message.state)
  })
})()
