(() => {
  const gameId = 'chemin-de-couleurs'
  let online = false
  let slot = 0
  let showingTurn = -1
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
    msg.textContent = 'Mémorise les 10 cases rouges…'
    const speed = Math.max(380, 700 - level * 25)
    void (async () => {
      await sleep(900)
      for (let index = 0; index < sequence.length; index += 1) {
        if (currentAnimation !== animationId) return
        setT(sequence[index], .12, RED)
        lightOn(sequence[index], RED, 3.5)
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
        ? 'Égalité — même nombre de cases réussies.'
        : serverState.winner === slot
          ? `Victoire ! Vous avez réussi ${serverState.scores[slot]}/10 cases.`
          : `Partie terminée. Votre score : ${serverState.scores[slot]}/10.`
      go.textContent = 'Rejouer'
      go.style.display = ''
      go.onclick = () => window.parent.postMessage({ type: `${gameId}:rematch` }, window.location.origin)
      return
    }

    go.style.display = 'none'
    if (serverState.phase === 'showing') {
      if (serverState.turnSlot !== slot) {
        if (state !== 'waiting') {
          animationId += 1
          reset()
        }
        state = 'waiting'
        msg.textContent = 'Au tour de l’autre joueur…'
      } else if (Array.isArray(serverState.path)
        && showingTurn !== serverState.turnNumber) {
        showingTurn = serverState.turnNumber
        showSequence(serverState.path, serverState.level)
      }
      return
    }

    if (serverState.phase === 'input') {
      animationId += 1
      if (serverState.turnSlot !== slot) {
        state = 'waiting'
        msg.textContent = 'Au tour de l’autre joueur…'
        return
      }
      state = 'input'
      step = serverState.progress[slot]
      msg.textContent = `À vous de reproduire le chemin : ${step}/10 cases.`
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
      showingTurn = -1
      animationId += 1
      go.style.display = 'none'
      return
    }

    if (message.type === `${gameId}:state`) applyState(message.state)
  })
})()
