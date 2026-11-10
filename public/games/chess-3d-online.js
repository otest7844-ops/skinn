(() => {
  const gameId = 'chess-3d'
  const originalMove = window.doMove
  const originalClick = window.click
  let online = false
  let paused = false
  let replaying = false
  let pending = false
  let slot = 0
  let turn = 'w'
  let appliedMoves = 0
  let latestMoves = []
  let replayTimer = 0

  if (typeof originalMove !== 'function' || typeof originalClick !== 'function') return

  const send = (type, payload = {}) => {
    if (!window.parent || window.parent === window) return
    window.parent.postMessage({ type: `${gameId}:${type}`, ...payload }, window.location.origin)
  }

  function applyMoves() {
    if (!online || paused || replayTimer || appliedMoves >= latestMoves.length) return
    const move = latestMoves[appliedMoves]
    replaying = true
    originalMove(move.from, move.to)
    replaying = false
    appliedMoves += 1
    pending = false
    replayTimer = window.setTimeout(() => {
      replayTimer = 0
      applyMoves()
    }, 520)
  }

  window.doMove = (from, to) => {
    if (!online || replaying) return originalMove(from, to)
    if (paused || pending || slot !== (turn === 'w' ? 0 : 1)) return
    pending = true
    send('input', { input: { from, to } })
  }

  window.click = (index) => {
    if (online && (paused || pending || slot !== (turn === 'w' ? 0 : 1))) return
    return originalClick(index)
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return
    const message = event.data
    if (!message || typeof message.type !== 'string' || !message.type.startsWith(`${gameId}:`)) return

    if (message.type === `${gameId}:enable`) {
      online = true
      paused = false
      slot = message.slot === 1 ? 1 : 0
      turn = 'w'
      appliedMoves = 0
      latestMoves = []
      pending = false
      window.clearTimeout(replayTimer)
      replayTimer = 0
      const settings = document.getElementById('lv2')
      if (settings?.textContent !== '2 JOUEURS') document.getElementById('md')?.click()
      for (const id of ['nw', 'un', 'hn', 'md']) {
        const button = document.getElementById(id)
        if (button) button.disabled = true
      }
      return
    }

    if (message.type === `${gameId}:input-rejected`) {
      pending = false
      return
    }

    if (message.type === `${gameId}:pause` || message.type === `${gameId}:resume`) {
      paused = message.type === `${gameId}:pause`
      if (!paused) applyMoves()
      return
    }

    if (message.type !== `${gameId}:state` || !message.state || !Array.isArray(message.state.moves)) return
    turn = message.state.turn === 'b' ? 'b' : 'w'
    latestMoves = message.state.moves
    if (latestMoves.length >= appliedMoves) pending = false
    applyMoves()
  })
})()
