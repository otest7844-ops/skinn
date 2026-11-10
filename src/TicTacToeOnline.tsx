import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Clipboard, LoaderCircle, Users, Wifi, WifiOff } from 'lucide-react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import './MosswingOnline.css'
import GameControlsGuide from './GameControlsGuide'
import { getMultiplayerUrl } from './multiplayer-url'
import { getDemoWalletId } from './demo-wallet'

type Player = { slot: number; you: boolean; name: string; connected: boolean; ready: boolean }
type Room = {
  code: string
  phase: 'waiting' | 'countdown' | 'running' | 'paused' | 'finished'
  round: number
  countdownEndsAt: number | null
  countdownRemainingMs: number | null
  players: Player[]
  gameState: { board: number[]; turn: number; scores: number[]; winner: number | null }
  yourSlot: number
  stake?: number
  payout?: number
}
type Ack = { ok: boolean; error?: string; code?: string; token?: string }
type View = 'menu' | 'join' | 'waiting' | 'playing' | 'result' | 'solo'

const socketUrl = getMultiplayerUrl()

function makeSource(html: string) {
  const bridge = `
let arenaOnline=false,arenaSlot=-1;
function arenaApply(data){
 if(!data||!data.gameState)return;
 const next=data.gameState;
 board=next.board.slice();an=board.map(function(value,index){return value?Math.max(an[index]||0,.25):0;});
 turn=next.turn+1;sc=[next.scores[0]||0,next.scores[1]||0,sc[2]||0];
 win=next.winner===null?null:LN.find(function(line){return board[line[0]]!==0&&board[line[0]]===board[line[1]]&&board[line[1]]===board[line[2]];});
 winner=next.winner===null?0:next.winner+1;
 state=data.phase==='finished'?'end':'play';
}
cv.addEventListener('pointerdown',function(event){
 if(!arenaOnline)return;
 event.preventDefault();event.stopImmediatePropagation();
 const cell=cellAt(event);
 if(state==='play'&&turn===arenaSlot+1&&cell>=0&&!board[cell]){
  window.parent.postMessage({type:'arena:ttt-move',cell:cell},'*');
 }
},true);
window.addEventListener('message',function(event){
 if(event.source!==window.parent||!event.data)return;
 if(event.data.type==='arena:ttt-enable'){arenaOnline=true;arenaSlot=event.data.slot;return;}
 if(event.data.type==='arena:ttt-state')arenaApply(event.data.state);
});
`
  const closing = html.lastIndexOf('</script>')
  if (closing < 0) throw new Error('Le jeu Tic-Tac-Toe ne contient pas de script intégrable.')
  return html.slice(0, closing) + bridge + html.slice(closing)
}

function emitAck(socket: Socket, event: string, payload: object = {}) {
  return new Promise<Ack>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('Le serveur ne répond pas. Réessayez.')), 5000)
    socket.emit(event, payload, (response: Ack) => {
      window.clearTimeout(timer)
      if (!response?.ok) {
        reject(new Error(response?.error ?? 'La demande a échoué.'))
        return
      }
      resolve(response)
    })
  })
}

export default function TicTacToeOnline({
  onClose,
  publicJoin = null,
}: {
  onClose: () => void
  publicJoin?: { game: string; code: string; stake: number } | null
}) {
  const [view, setView] = useState<View>('menu')
  const [room, setRoom] = useState<Room | null>(null)
  const [nickname, setNickname] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [connected, setConnected] = useState(false)
  const [copied, setCopied] = useState(false)
  const [clock, setClock] = useState(0)
  const [frameSource, setFrameSource] = useState('')
  const [frameReady, setFrameReady] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const roomRef = useRef<Room | null>(null)
  const attemptedPublicJoinRef = useRef('')
  const nicknameRef = useRef('')

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    fetch('/games/tic-tac-toe.html', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Tic-Tac-Toe est indisponible (HTTP ${response.status}).`)
        return response.text()
      })
      .then((html) => {
        if (active) setFrameSource(makeSource(html))
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error('Unable to load Tic-Tac-Toe:', error)
        if (active) setFeedback(error instanceof Error ? error.message : 'Impossible de charger le jeu.')
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const socket = io(socketUrl, { reconnection: true, reconnectionAttempts: 8, timeout: 8000 })
    socketRef.current = socket
    socket.on('connect', () => {
      setConnected(true)
      setFeedback('')
      const publicJoinKey = publicJoin?.game === 'tic-tac-toe'
        ? `${publicJoin.game}:${publicJoin.code}:${publicJoin.stake}`
        : ''
      if (publicJoin && publicJoin.game === 'tic-tac-toe'
        && publicJoinKey && attemptedPublicJoinRef.current !== publicJoinKey) {
        attemptedPublicJoinRef.current = publicJoinKey
        socket.emit('arena:room:join', {
          game: 'tic-tac-toe',
          code: publicJoin.code,
          stake: publicJoin.stake,
          name: nicknameRef.current,
          walletId: getDemoWalletId(),
        }, (result: Ack) => {
          if (!result?.ok) setFeedback(result.error ?? 'Impossible de rejoindre ce salon.')
        })
        return
      }
      const saved = window.sessionStorage.getItem('tic-tac-toe-online-room')
      if (!saved) {
        if (roomRef.current) {
          roomRef.current = null
          setRoom(null)
          setView('menu')
        }
        return
      }
      try {
        socket.emit('arena:room:reconnect', JSON.parse(saved), (result: Ack) => {
          if (!result?.ok) {
            window.sessionStorage.removeItem('tic-tac-toe-online-room')
            roomRef.current = null
            setRoom(null)
            setView('menu')
            setFeedback(result?.error ?? 'La salle précédente n’est plus disponible.')
          }
        })
      } catch (error) {
        window.sessionStorage.removeItem('tic-tac-toe-online-room')
        console.warn('Stored Tic-Tac-Toe room data could not be read:', error)
        roomRef.current = null
        setRoom(null)
        setView('menu')
        setFeedback('Les informations de reconnexion sont invalides.')
      }
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', (error: Error) => {
      setConnected(false)
      setFeedback(`Serveur multijoueur inaccessible : ${error.message}`)
    })
    socket.on('arena:state', (next: Room) => {
      const localRoom = next.countdownRemainingMs === null
        ? next
        : { ...next, countdownEndsAt: Date.now() + next.countdownRemainingMs }
      roomRef.current = localRoom
      setRoom(localRoom)
      if (next.phase === 'countdown') setClock(Date.now())
      setView(next.phase === 'finished' ? 'result'
        : ['running', 'paused'].includes(next.phase) ? 'playing' : 'waiting')
    })
    socket.on('arena:expired', ({ message }: { message?: string }) => {
      window.sessionStorage.removeItem('tic-tac-toe-online-room')
      roomRef.current = null
      setRoom(null)
      setView('menu')
      setFeedback(message ?? 'Le salon a expiré.')
    })
    socket.on('arena:closed', ({ reason }: { reason?: string } = {}) => {
      window.sessionStorage.removeItem('tic-tac-toe-online-room')
      roomRef.current = null
      setRoom(null)
      setView('menu')
      setFeedback(reason ?? 'La salle a été fermée.')
    })
    socket.on('arena:room:joined', ({ code, token }: { code: string; token: string }) => {
      window.sessionStorage.setItem('tic-tac-toe-online-room', JSON.stringify({ code, token }))
    })
    return () => {
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
    }
  }, [publicJoin, publicJoin?.code, publicJoin?.game, publicJoin?.stake])

  useEffect(() => {
    if (room?.phase !== 'countdown') return
    const timer = window.setInterval(() => setClock(Date.now()), 200)
    return () => window.clearInterval(timer)
  }, [room?.phase])

  useEffect(() => {
    if (!room || !frameReady) return
    frameRef.current?.contentWindow?.postMessage({ type: 'arena:ttt-enable', slot: room.yourSlot }, '*')
    if (['running', 'paused', 'finished'].includes(room.phase)) {
      frameRef.current?.contentWindow?.postMessage({ type: 'arena:ttt-state', state: room }, '*')
    }
  }, [frameReady, room])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== frameRef.current?.contentWindow || event.data?.type !== 'arena:ttt-move') return
      const socket = socketRef.current
      if (!socket?.connected || roomRef.current?.phase !== 'running') return
      socket.emit('arena:ttt:move', { cell: event.data.cell }, (result: Ack) => {
        if (!result?.ok && roomRef.current?.phase === 'running') {
          setFeedback(result.error ?? 'Ce coup n’a pas été accepté.')
        }
      })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  async function perform(event: string, payload: object = {}) {
    const socket = socketRef.current
    if (!socket?.connected) {
      setFeedback('Le serveur multijoueur n’est pas connecté.')
      return null
    }
    try {
      setFeedback('')
      return await emitAck(socket, event, payload)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'La demande a échoué.')
      return null
    }
  }

  async function createRoom() {
    const result = await perform('arena:room:create', { game: 'tic-tac-toe', name: nickname })
    if (result?.code) {
      setView('waiting')
      try {
        await navigator.clipboard.writeText(result.code)
        setCopied(true)
      } catch (error) {
        console.error('Unable to copy the Tic-Tac-Toe room code:', error)
        setFeedback('Salle créée. Copiez le code affiché pour inviter votre adversaire.')
      }
    }
  }

  async function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await perform('arena:room:join', { game: 'tic-tac-toe', code: codeInput, name: nickname })
    if (result?.code) setView('waiting')
  }

  async function leaveRoom() {
    await perform('arena:room:leave')
    window.sessionStorage.removeItem('tic-tac-toe-online-room')
    roomRef.current = null
    setRoom(null)
    setView('menu')
  }

  const self = room?.players.find((player) => player.you)
  const opponent = room?.players.find((player) => !player.you)
  const countdown = room?.countdownEndsAt ? Math.max(0, Math.ceil((room.countdownEndsAt - clock) / 1000)) : 3

  return (
    <main className="mosswing-online" data-theme="mosswing">
      {frameSource && (
        <iframe
          ref={frameRef}
          className={`mosswing-frame ${view === 'playing' || view === 'solo' || view === 'result' ? 'is-visible' : ''}`}
          title="Quantum Duel — Tic-Tac-Toe"
          srcDoc={view === 'solo' ? frameSource.replace(
            /let arenaOnline=false,arenaSlot=-1;[\s\S]*?window\.addEventListener\('message'[\s\S]*?\}\);\s*/,
            '',
          ) : frameSource}
          onLoad={() => setFrameReady(true)}
        />
      )}
      <header className="mosswing-topbar">
        <button type="button" className="mosswing-back" onClick={() => room ? void leaveRoom() : onClose()} aria-label="Retour">
          <ArrowLeft size={20} />
        </button>
        <div className="mosswing-wordmark"><span className="mosswing-mark">Q</span><span>QUANTUM DUEL</span></div>
        <span className={`mosswing-connection ${connected ? 'is-online' : ''}`}>
          {connected ? <Wifi size={18} /> : <WifiOff size={18} />}
          <span>{connected ? 'En ligne' : 'Hors ligne'}</span>
        </span>
      </header>

      {['menu', 'join', 'waiting'].includes(view) && (
        <section className="mosswing-lobby" aria-label="Salon Tic-Tac-Toe">
          <div className="mosswing-panel mosswing-room-panel">
            {view !== 'menu' && <button type="button" className="mosswing-panel-back" onClick={() => view === 'waiting' ? void leaveRoom() : setView('menu')}><ArrowLeft size={17} /> Retour</button>}
            {view === 'menu' && <>
              <span className="mosswing-eyebrow">QUANTUM DUEL · 1 CONTRE 1</span>
              <h1>Choisissez votre partie</h1>
              <GameControlsGuide game="tic-tac-toe" />
              <label className="mosswing-name-field"><span>Votre pseudo</span><input value={nickname} maxLength={18} onChange={(event) => { nicknameRef.current = event.target.value; setNickname(event.target.value) }} placeholder="Pilote" /></label>
              <div className="mosswing-actions">
                <button type="button" className="mosswing-primary" onClick={() => { setView('solo'); setFrameReady(false) }}>Jouer en solo</button>
                <button type="button" className="mosswing-primary" disabled={!connected} onClick={() => void createRoom()}><Users size={18} /> Créer une salle</button>
                <button type="button" className="mosswing-secondary" disabled={!connected} onClick={() => setView('join')}>Rejoindre une salle</button>
              </div>
              {!connected && <p className="mosswing-status">Démarrez aussi le serveur pour jouer en ligne.</p>}
            </>}
            {view === 'join' && <>
              <span className="mosswing-eyebrow">REJOINDRE UN DUEL</span><h1>Entrez le code</h1>
              <form className="mosswing-join-form" onSubmit={(event) => void joinRoom(event)}>
                <input aria-label="Code de la salle" maxLength={6} value={codeInput} onChange={(event) => setCodeInput(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="ABC123" />
                <button type="submit" className="mosswing-primary" disabled={!connected || codeInput.length !== 6}>Rejoindre</button>
              </form>
            </>}
            {view === 'waiting' && room && <>
              <span className="mosswing-eyebrow">SALLE PRIVÉE</span><h1>Prêts à jouer ?</h1>
              <button type="button" className="mosswing-room-code" onClick={() => {
                void navigator.clipboard.writeText(room.code).then(() => setCopied(true)).catch((error: unknown) => {
                  console.error('Unable to copy the Tic-Tac-Toe room code:', error)
                  setFeedback('Copie impossible. Notez le code affiché.')
                })
              }}><span>{room.code}</span>{copied ? <Check size={19} /> : <Clipboard size={19} />}</button>
              <div className="mosswing-player-slots">{[0, 1].map((slot) => {
                const player = room.players.find((item) => item.slot === slot)
                return <div className={`mosswing-player-slot ${player?.connected ? 'is-connected' : ''}`} key={slot}>
                  <span className="mosswing-player-avatar">{slot === 0 ? '01' : '02'}</span>
                  <span><strong>{player?.name ?? `Joueur ${slot + 1}`}{player?.you ? ' · Vous' : ''}</strong><small>{player?.connected ? player.ready ? 'Prêt' : 'Connecté' : 'Connexion…'}</small></span>
                  <i className={player?.connected ? 'is-connected' : ''} />
                </div>
              })}</div>
              {room.phase === 'countdown' ? <p className="mosswing-countdown"><span>{countdown}</span> Le duel commence…</p> : (
                <button type="button" className="mosswing-primary mosswing-ready" disabled={!connected || !opponent?.connected || Boolean(self?.ready)} onClick={() => void perform('arena:room:ready', { ready: true })}>
                  {self?.ready ? <><Check size={19} /> Prêt</> : <><Users size={19} /> Je suis prêt</>}
                </button>
              )}
              {!opponent?.connected && <p className="mosswing-status">En attente du deuxième joueur… Partagez le code.</p>}
            </>}
            {feedback && <p className="mosswing-feedback" role="status">{feedback}</p>}
          </div>
        </section>
      )}

      {view === 'playing' && room && (
        <>
          <div className="mosswing-duel-hud">
            <div className="mosswing-score-card is-you"><span>{self?.name ?? 'VOUS'}</span><strong>{room.gameState.scores[room.yourSlot] ?? 0}</strong><small>{room.gameState.turn === room.yourSlot ? 'À vous de jouer' : 'À l’adversaire'}</small></div>
            <span className="mosswing-vs">VS</span>
            <div className="mosswing-score-card"><span>{opponent?.name ?? 'ADVERSAIRE'}</span><strong>{room.gameState.scores[1 - room.yourSlot] ?? 0}</strong><small>{opponent?.connected ? 'Connecté' : 'Reconnexion…'}</small></div>
          </div>
          {feedback && <p className="mosswing-feedback" role="status">{feedback}</p>}
        </>
      )}

      {view === 'result' && room && (
        <section className="mosswing-result-shade">
          <div className="mosswing-panel mosswing-result-panel">
            <span className="mosswing-eyebrow">MANCHE TERMINÉE</span>
            <h1>{room.gameState.winner === null ? 'ÉGALITÉ' : room.gameState.winner === room.yourSlot ? 'VICTOIRE' : 'DÉFAITE'}</h1>
            <p>{room.gameState.winner === null ? 'La grille est complète : égalité !' : `${room.players.find((item) => item.slot === room.gameState.winner)?.name ?? 'Un joueur'} remporte la manche.`}</p>
            <div className="mosswing-result-scores"><div><small>VOTRE SCORE</small><strong>{room.gameState.scores[room.yourSlot] ?? 0}</strong></div><div><small>ADVERSAIRE</small><strong>{room.gameState.scores[1 - room.yourSlot] ?? 0}</strong></div></div>
            <button type="button" className="mosswing-primary" disabled={!connected || !opponent?.connected || Boolean(self?.ready)} onClick={() => void perform('arena:room:rematch')}>{self?.ready ? <><LoaderCircle size={18} /> En attente…</> : 'Revanche'}</button>
            <button type="button" className="mosswing-secondary" onClick={() => void leaveRoom()}>Retour au menu</button>
          </div>
        </section>
      )}
      {view === 'solo' && <div className="mosswing-solo-controls"><button type="button" onClick={() => setView('menu')} aria-label="Retour au menu"><ArrowLeft size={19} /></button><span>Mode solo</span></div>}
    </main>
  )
}
