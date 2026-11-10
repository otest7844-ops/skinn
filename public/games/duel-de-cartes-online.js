(() => {
  const gameId = 'duel-de-cartes'
  let online = false
  let slot = 0
  let names = ['Joueur 1', 'Joueur 2']
  let lastSignature = ''

  function send(input) {
    window.parent.postMessage({ type: `${gameId}:input`, input }, window.location.origin)
  }

  function removeCards() {
    for (const card of [...hands[0], ...hands[1], ...played]) {
      if (!card) continue
      scene.remove(card)
      card.userData.f.material.map?.dispose()
      card.userData.f.material.dispose()
    }
    hands = [[], []]
    played = [null, null]
  }

  function updateHud(state) {
    score = [...state.scores]
    round = state.round - 1
    turn = state.turn
    hud()
    document.querySelector('#b0 span').textContent = names[0]
    document.querySelector('#b1 span').textContent = names[1]
    $('draw').style.display = 'none'
    $('count').textContent = state.phase === 'reveal'
      ? String(Math.max(1, Math.ceil(state.phaseRemainingMs / 1000)))
      : ''
    $('msg').textContent = state.status === 'finished'
      ? 'Partie terminée'
      : state.phase === 'reveal'
        ? 'Révélation des cartes…'
        : state.turn === slot
          ? `Manche ${state.round} : jouez une carte.`
          : `Manche ${state.round} : ${names[state.turn]} joue.`
  }

  function applyState(state, messageNames) {
    if (!state || !Array.isArray(state.hands) || !Array.isArray(state.scores)) return
    if (Array.isArray(messageNames) && messageNames.length === 2) names = messageNames
    updateHud(state)

    const signature = JSON.stringify({
      status: state.status,
      phase: state.phase,
      round: state.round,
      turn: state.turn,
      scores: state.scores,
      hands: state.hands,
      hasPlayed: state.hasPlayed,
      played: state.played,
      winner: state.winner,
    })
    if (signature !== lastSignature) {
      lastSignature = signature
      removeCards()
      for (let player = 0; player < 2; player += 1) {
        const values = state.hands[player]
        for (let index = 0; index < values.length; index += 1) {
          const card = makeCard(Number.isInteger(values[index]) ? values[index] : 1)
          card.position.copy(handPos(player, index))
          card.userData.fl.rotation.y = player === slot && state.turn === slot && state.phase === 'play'
            ? 0
            : Math.PI
          scene.add(card)
          hands[player].push(card)
        }
      }

      for (let player = 0; player < 2; player += 1) {
        if (!state.hasPlayed[player]) continue
        const value = Array.isArray(state.played) ? state.played[player] : null
        const card = makeCard(Number.isInteger(value) ? value : 1)
        card.position.set(player ? SX : -SX, TY, SZ)
        card.userData.fl.rotation.y = state.phase === 'reveal' || state.phase === 'finished' ? 0 : Math.PI
        scene.add(card)
        played[player] = card
      }
      const remaining = Math.max(0, 20 - (state.round - 1) * 2)
      updDeck(remaining)
      busy = state.status !== 'playing' || state.phase !== 'play' || state.turn !== slot
      if (slot === 1) {
        cam.position.z = -Math.abs(cam.position.z)
        cam.lookAt(0, 0, .3)
      } else {
        cam.position.z = Math.abs(cam.position.z)
        cam.lookAt(0, 0, .3)
      }
    } else {
      busy = state.status !== 'playing' || state.phase !== 'play' || state.turn !== slot
    }

    if (state.status === 'finished') {
      $('count').textContent = ''
      $('eh').textContent = state.winner === null
        ? 'Égalité parfaite !'
        : state.winner === slot ? 'Vous remportez le duel !' : `${names[state.winner]} remporte le duel !`
      $('ep').textContent = `Score final : ${state.scores[0]} – ${state.scores[1]}`
      $('end').style.display = 'flex'
      $('again').onclick = () => window.parent.postMessage({ type: `${gameId}:rematch` }, window.location.origin)
    } else {
      $('end').style.display = 'none'
    }
  }

  const localPlay = play
  play = (card) => {
    if (!online) return localPlay(card)
    if (busy || slot !== turn || !Number.isInteger(card?.userData?.n)) return
    send({ type: 'play-card', card: card.userData.n })
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return

    if (message.type === `${gameId}:enable`) {
      online = true
      slot = message.slot === 1 ? 1 : 0
      names = Array.isArray(message.names) && message.names.length === 2
        ? message.names
        : names
      lastSignature = ''
      $('draw').style.display = 'none'
      return
    }

    if (message.type === `${gameId}:state`) applyState(message.state, message.names)
  })
})()
