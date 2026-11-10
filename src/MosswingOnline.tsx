import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Clipboard, Info, LoaderCircle, Search, Settings, Users, Volume2, VolumeX, Wifi, WifiOff, X } from 'lucide-react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import './MosswingOnline.css'
import { getMultiplayerUrl } from './multiplayer-url'
import { getDemoWalletId } from './demo-wallet'

type View = 'menu' | 'join' | 'waiting' | 'playing' | 'solo' | 'result'
type Ack = { ok: boolean; error?: string; code?: string; token?: string; queued?: boolean }
type PlayerState = {
  slot: number
  you: boolean
  connected: boolean
  ready: boolean
  score: number
  coins: number
  alive: boolean
  name: string
  x: number
  y: number
  vy: number
  distance: number
  elapsed: number
  nextCoinAt: number
}
type GateState = { id: number; x: number; center: number }
type RoomState = {
  code: string
  phase: 'waiting' | 'countdown' | 'running' | 'paused' | 'finished'
  seed: number | null
  round: number
  countdownEndsAt: number | null
  startedAt: number | null
  deadline: number | null
  winnerSlot: number | null
  result: string | null
  ping: number | null
  isPublic: boolean
  stake: number
  payout: number
  yourSlot: number
  players: PlayerState[]
  gates: GateState[]
}

const socketUrl = getMultiplayerUrl()

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

function getStoredRoom() {
  const saved = window.sessionStorage.getItem('mosswing-online-room')
  if (!saved) return null
  try {
    const value = JSON.parse(saved) as { code?: string; token?: string }
    return value.code && value.token ? { code: value.code, token: value.token } : null
  } catch (error) {
    window.sessionStorage.removeItem('mosswing-online-room')
    console.warn('Stored Mosswing room data could not be read:', error)
    return null
  }
}

function makeMultiplayerSource(html: string) {
  const flapSource = 'function flap(){model.flap();wingKick=1;puff(3);note(420,760,.095,.035);}'
  const flapReplacement = `function flap(){model.flap();wingKick=1;puff(3);note(420,760,.095,.035);if(mosswingOnlineMode&&!mosswingSuppressInput)window.parent.postMessage({type:'mosswing:flap'},'*');}`
  const limitSource = 'model.limit=worldH*.5/Math.cos(Math.atan(.14));'
  const limitReplacement = 'model.limit=mosswingOnlineMode?5.555:worldH*.5/Math.cos(Math.atan(.14));'
  const originalSky = "background:#7fdcfa url('/images/memo-sky.svg') center/100% 100%"
  const arcadeSky = originalSky
  const originalFog = 'new THREE.Fog(0x9bdff3,42,105)'
  const arcadeFog = 'new THREE.Fog(0x9bdff3,48,120)'
  const stateAnchor = 'let best=0,muted=false,audio=null,oldBest=0,readyPhase=0;'
  const startAnchor = 'oldBest=best;model.reset(-worldW*.23);'
  const renderStartAnchor = "if(state==='playing'){\n   runAge+=dt;"
  const renderReadyAnchor = "}else if(state==='ready'){"
  const gateRenderAnchor = "}else gateMeshes.forEach((g,i)=>{g.root.visible=true;poseGate(g,model.gates[i].x,model.gates[i].center);});"
  if (!html.includes(flapSource) || !html.includes(limitSource) || !html.includes(originalSky)
    || !html.includes(originalFog) || !html.includes(stateAnchor)
    || !html.includes(startAnchor) || !html.includes(renderStartAnchor)
    || !html.includes(renderReadyAnchor) || !html.includes(gateRenderAnchor)) {
    throw new Error('Le code original de Mosswing ne contient pas les points de connexion attendus.')
  }

  const bridge = `
let mosswingRemote=null,mosswingRemotePivot=null,mosswingLocalPlate=null,mosswingRemotePlate=null,mosswingLocalSlot=null,mosswingRemoteSlot=null;
let mosswingOnlineState=null,mosswingTargets=[],mosswingGateTargets=[],mosswingLocalX=null;
function mosswingPlayerColor(slot){return slot===0?0x16b9e8:0x9cdb39;}
function mosswingTintCreature(group,color){
 group.traverse(function(object){
  if(!object.isMesh)return;
  if(Array.isArray(object.material))object.material=object.material.map(function(material){const clone=material.clone();if(clone.color)clone.color.set(color);return clone;});
  else{object.material=object.material.clone();if(object.material.color)object.material.color.set(color);}
 });
}
function mosswingNameplate(color){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=112;
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,toneMapped:false}));
 sprite.scale.set(3.2,.7,1);sprite.position.set(0,1.15,0);sprite.renderOrder=10;
 return {canvas,texture,sprite,color};
}
function mosswingPaintNameplate(plate,player){
 plate.color=player.slot===0?'#16b9e8':'#9cdb39';
 plate.sprite.position.y=player.slot===0?1.15:2.05;
 const ctx=plate.canvas.getContext('2d');ctx.clearRect(0,0,512,112);
 ctx.fillStyle='rgba(7,40,58,.92)';ctx.fillRect(4,5,504,102);
 ctx.fillStyle=plate.color;ctx.beginPath();ctx.arc(39,42,12,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=player.connected?'#8de0ad':'#ffb37d';ctx.beginPath();ctx.arc(39,77,6,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fff';ctx.font='700 27px Arial,sans-serif';ctx.textBaseline='middle';
 ctx.fillText((player.name||('Joueur '+(player.slot+1))).slice(0,18)+'  ·  '+player.score,68,42,420);
 ctx.fillStyle='#d7f5ff';ctx.font='600 19px Arial,sans-serif';
 ctx.fillText((player.connected?'CONNECTÉ':'DÉCONNECTÉ')+'  ·  '+(player.alive?'EN VOL':'ÉLIMINÉ'),68,78,420);
 plate.texture.needsUpdate=true;
}
function mosswingEnsureScene(){
 if(mosswingRemote)return;
 mosswingRemote=creature.clone(true);mosswingRemote.name='Mosswing opponent';
 mosswingTintCreature(mosswingRemote,0x56a8ec);
 scene.add(mosswingRemote);mosswingRemotePivot=mosswingRemote.children[0];
 mosswingLocalPlate=mosswingNameplate('#16b9e8');creature.add(mosswingLocalPlate.sprite);
 mosswingRemotePlate=mosswingNameplate('#9cdb39');mosswingRemote.add(mosswingRemotePlate.sprite);
}
function mosswingApplyState(data){
 if(!data||!Array.isArray(data.players))return;
 mosswingEnsureScene();
 const now=performance.now(),previous=new Map(mosswingTargets.map(function(player){return [player.slot,player];}));
 mosswingTargets=data.players.map(function(player){
  const old=previous.get(player.slot);
  return {slot:player.slot,you:player.you,connected:player.connected,alive:player.alive,name:player.name,score:player.score,
   coins:player.coins,elapsed:player.elapsed,nextCoinAt:player.nextCoinAt,distance:player.distance,
   fromX:old?old.x:player.x,toX:player.x,fromY:old?old.y:player.y,toY:player.y,
   x:player.x,y:player.y,vy:player.vy,receivedAt:now};
 });
 mosswingGateTargets=(data.gates||[]).map(function(gate,index){
  const old=mosswingGateTargets[index];
  return {id:gate.id,fromX:old&&old.id===gate.id?old.toX:gate.x,toX:gate.x,center:gate.center,receivedAt:now};
 });
 mosswingOnlineState=data;
 const localPlayer=mosswingTargets.find(function(player){return player.you;});
 const remotePlayer=mosswingTargets.find(function(player){return !player.you;});
 if(localPlayer&&mosswingLocalSlot!==localPlayer.slot){mosswingTintCreature(creature,mosswingPlayerColor(localPlayer.slot));mosswingLocalSlot=localPlayer.slot;}
 if(remotePlayer&&mosswingRemoteSlot!==remotePlayer.slot){mosswingTintCreature(mosswingRemote,mosswingPlayerColor(remotePlayer.slot));mosswingRemoteSlot=remotePlayer.slot;}
 if(localPlayer)mosswingLocalX=localPlayer.x;
 mosswingRemote.visible=data.phase!=='waiting'&&data.phase!=='countdown';
 mosswingTargets.forEach(function(player){
  mosswingPaintNameplate(player.you?mosswingLocalPlate:mosswingRemotePlate,player);
 });
}
function mosswingMovePlayer(player,group,pivot,fromWing){
 const age=Math.min(1,Math.max(0,(performance.now()-player.receivedAt)/100));
 const x=player.fromX+(player.toX-player.fromX)*age;
 const y=player.fromY+(player.toY-player.fromY)*age;
 group.position.set(x,y,0);
 const body=pivot||group.children[0];
 body.rotation.z=player.alive?Math.max(-.75,Math.min(.38,player.vy*.055)):-.9;
 if(fromWing){model.x=x;model.y=y;model.vy=player.vy;model.score=player.score;model.coins=player.coins;model.elapsed=player.elapsed;model.nextCoinAt=player.nextCoinAt;model.distance=player.distance;model.alive=player.alive;$('score').textContent=String(player.score);$('coin-count').textContent='🪙 '+player.coins+(player.coins===1?' pièce':' pièces');}
}
function mosswingUpdateCharacters(){
 if(!mosswingOnlineState||!mosswingRemote)return;
 const local=mosswingTargets.find(function(player){return player.you;});
 const opponent=mosswingTargets.find(function(player){return !player.you;});
 if(local)mosswingMovePlayer(local,creature,bodyPivot,true);
 if(opponent)mosswingMovePlayer(opponent,mosswingRemote,mosswingRemotePivot,false);
 if(mosswingGateTargets.length){
  gateMeshes.forEach(function(gate,index){
   const data=mosswingGateTargets[index];gate.root.visible=Boolean(data);
   if(data){const age=Math.min(1,Math.max(0,(performance.now()-data.receivedAt)/100));poseGate(gate,data.fromX+(data.toX-data.fromX)*age,data.center);}
  });
 }
 const nextGate=mosswingGateTargets.filter(function(gate){return gate.toX>model.x;}).sort(function(a,b){return a.toX-b.toX;})[0];
 $('obstacle-warning').classList.toggle('visible',Boolean(local&&local.elapsed>=10&&nextGate&&nextGate.toX-model.x<14));
}
window.addEventListener('message',function(event){
 if(event.source!==window.parent||!event.data)return;
 if(event.data.type==='mosswing:online-disable'){
  mosswingOnlineMode=false;mosswingOnlineState=null;mosswingTargets=[];mosswingGateTargets=[];
  if(mosswingRemote)mosswingRemote.visible=false;
  model.limit=worldH*.5/Math.cos(Math.atan(.14));
  return;
 }
 if(event.data.type==='mosswing:online-enable'){mosswingOnlineMode=true;model.limit=5.555;return;}
 if(event.data.type==='mosswing:online-start'){
  mosswingOnlineMode=true;model.limit=5.555;
  let state=Number(event.data.seed)>>>0;
  model.random=()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296;};
  mosswingApplyState(event.data.state);
  mosswingSuppressInput=true;start();mosswingSuppressInput=false;
 }
 if(event.data.type==='mosswing:online-state'){
  mosswingApplyState(event.data.state);
  if(event.data.state?.phase==='finished'){
   mosswingUpdateCharacters();state='online-finished';document.body.className=state;
  }
 }
 if(event.data.type==='mosswing:online-pause')pause();
 if(event.data.type==='mosswing:online-resume'&&state==='paused'){
  state='playing';document.body.className=state;previous=performance.now();accumulator=0;canvas.focus({preventScroll:true});
 }
 if(event.data.type==='mosswing:set-muted'&&Boolean(event.data.muted)!==muted)$('sound').click();
 if(event.data.type==='mosswing:manual-flap')act();
});
`

  const bridged = html
    .replace(originalSky, arcadeSky)
    .replace(originalFog, arcadeFog)
    .replace('0xfff5e9,0x658c83,1.65', '0xe5fbff,0x2d7647,1.8')
    .replace('0xffebd8,2.2', '0xfff0cc,2.2')
    .replace(flapSource, flapReplacement)
    .replace(limitSource, limitReplacement)
    .replace(startAnchor, 'oldBest=best;model.reset(mosswingOnlineMode&&mosswingLocalX!==null?mosswingLocalX:-worldW*.23);')
    .replace(renderStartAnchor, "if(state==='playing'&&!mosswingOnlineMode){\n   runAge+=dt;")
    .replace(renderReadyAnchor, "    }else if(state==='playing'&&mosswingOnlineMode){runAge+=dt;if(runAge>3)$('tap-hint').classList.remove('visible');mosswingUpdateCharacters();}else if(state==='ready'){")
    .replace(gateRenderAnchor, "}else if(mosswingOnlineMode&&mosswingOnlineState){mosswingUpdateCharacters();}else gateMeshes.forEach((g,i)=>{g.root.visible=true;poseGate(g,model.gates[i].x,model.gates[i].center);});")
    .replace(stateAnchor, `let mosswingOnlineMode=false,mosswingSuppressInput=false;\n${stateAnchor}`)
  const closingIndex = bridged.lastIndexOf('})();')
  if (closingIndex < 0) throw new Error('Impossible de préparer le moteur original de Mosswing.')
  return bridged.slice(0, closingIndex) + bridge + bridged.slice(closingIndex)
}

export default function MosswingOnline({
  onClose,
  publicJoin = null,
  onWalletBalance,
}: {
  onClose: () => void
  publicJoin?: { game: string; code: string; stake: number } | null
  onWalletBalance?: (balance: number) => void
}) {
  const [view, setView] = useState<View>('menu')
  const [room, setRoom] = useState<RoomState | null>(null)
  const [codeInput, setCodeInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [connected, setConnected] = useState(false)
  const [queued, setQueued] = useState(false)
  const [ping, setPing] = useState<number | null>(null)
  const [frameSource, setFrameSource] = useState('')
  const [frameReady, setFrameReady] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [muted, setMuted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [clock, setClock] = useState(0)
  const [nickname, setNickname] = useState('')
  const [stake, setStake] = useState('500')
  const [joinStake, setJoinStake] = useState('500')
  const [isPublic, setIsPublic] = useState(true)
  const socketRef = useRef<Socket | null>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const startedRoundRef = useRef('')
  const roomRef = useRef<RoomState | null>(null)
  const pausedRoundRef = useRef(false)
  const autoJoinRef = useRef(false)
  const publicJoinRef = useRef(publicJoin)
  const nicknameRef = useRef(nickname)
  const walletBalanceCallbackRef = useRef(onWalletBalance)

  useEffect(() => {
    publicJoinRef.current = publicJoin
    nicknameRef.current = nickname
    walletBalanceCallbackRef.current = onWalletBalance
  }, [nickname, onWalletBalance, publicJoin])

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    fetch('/games/mosswing.html', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Le jeu Mosswing est indisponible (HTTP ${response.status}).`)
        return response.text()
      })
      .then((html) => {
        if (active) setFrameSource(makeMultiplayerSource(html))
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Impossible de charger Mosswing.'
        console.error('Mosswing source loading failed:', error)
        if (active) setFeedback(message)
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
      socket.emit('arena:demo-wallet:request', { walletId: getDemoWalletId() })
      if (publicJoinRef.current?.game === 'mosswing-online' && !autoJoinRef.current) {
        autoJoinRef.current = true
        socket.emit('room:join', {
          code: publicJoinRef.current.code,
          name: nicknameRef.current,
          walletId: getDemoWalletId(),
          stake: publicJoinRef.current.stake,
        }, (response: Ack) => {
          if (!response?.ok) setFeedback(response?.error ?? 'Impossible de rejoindre ce salon.')
        })
        return
      }
      const saved = getStoredRoom()
      if (saved) {
        socket.emit('room:reconnect', saved, (response: Ack) => {
          if (!response?.ok) {
            window.sessionStorage.removeItem('mosswing-online-room')
            setFeedback(response?.error ?? 'La salle précédente n’est plus disponible.')
          }
        })
      }
    })
    socket.on('disconnect', () => {
      setConnected(false)
      setFeedback('Connexion interrompue. Reconnexion automatique en cours…')
    })
    socket.on('connect_error', (error: Error) => {
      setConnected(false)
      setFeedback(`Serveur multijoueur inaccessible : ${error.message}`)
    })
    socket.on('room:state', (nextRoom: RoomState) => {
      roomRef.current = nextRoom
      setRoom(nextRoom)
      setQueued(false)
      if (nextRoom.phase === 'countdown') setClock(Date.now())
      if (nextRoom.phase === 'finished') setView('result')
      else if (nextRoom.phase === 'running' || nextRoom.phase === 'paused') setView('playing')
      else setView('waiting')
    })
    socket.on('room:joined', ({ code, token }: { code: string; token: string }) => {
      window.sessionStorage.setItem('mosswing-online-room', JSON.stringify({ code, token }))
    })
    socket.on('arena:demo-wallet', ({ balance }: { balance: number }) => {
      if (Number.isFinite(balance)) walletBalanceCallbackRef.current?.(balance)
    })
    socket.on('match:found', ({ code, token }: { code: string; token: string }) => {
      window.sessionStorage.setItem('mosswing-online-room', JSON.stringify({ code, token }))
      setFeedback(`Adversaire trouvé · salle ${code}`)
    })
    socket.on('matchmaking:queued', () => setQueued(true))
    socket.on('room:closed', () => {
      window.sessionStorage.removeItem('mosswing-online-room')
      roomRef.current = null
      setRoom(null)
      setView('menu')
      setFeedback('La salle a été fermée.')
    })

    const pingTimer = window.setInterval(() => {
      if (!socket.connected) return
      const sentAt = performance.now()
      socket.emit('network:ping', {}, () => setPing(Math.round(performance.now() - sentAt)))
    }, 2500)

    return () => {
      window.clearInterval(pingTimer)
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket || !connected || !frameReady) return
    const roomState = room
    if (!roomState) {
      frameRef.current?.contentWindow?.postMessage({ type: 'mosswing:online-disable' }, '*')
      return
    }
    if (roomState?.phase === 'running' && roomState.seed !== null) {
      const roundKey = `${roomState.code}:${roomState.round}`
      if (startedRoundRef.current !== roundKey) {
        startedRoundRef.current = roundKey
        frameRef.current?.contentWindow?.postMessage({ type: 'mosswing:online-start', seed: roomState.seed, state: roomState }, '*')
      } else if (pausedRoundRef.current) {
        frameRef.current?.contentWindow?.postMessage({ type: 'mosswing:online-resume' }, '*')
      }
      pausedRoundRef.current = false
    } else if (roomState?.phase === 'paused') {
      frameRef.current?.contentWindow?.postMessage({ type: 'mosswing:online-pause' }, '*')
      pausedRoundRef.current = true
    } else {
      frameRef.current?.contentWindow?.postMessage({ type: 'mosswing:online-enable' }, '*')
    }
  }, [connected, frameReady, room])

  useEffect(() => {
    if (!frameReady || !room || !['running', 'paused', 'finished'].includes(room.phase)) return
    frameRef.current?.contentWindow?.postMessage({ type: 'mosswing:online-state', state: room }, '*')
  }, [frameReady, room])

  useEffect(() => {
    if (!frameReady) return
    frameRef.current?.contentWindow?.postMessage({ type: 'mosswing:set-muted', muted }, '*')
  }, [frameReady, muted])

  useEffect(() => {
    if (room?.phase !== 'countdown') return
    const timer = window.setInterval(() => setClock(Date.now()), 200)
    return () => window.clearInterval(timer)
  }, [room?.phase])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== frameRef.current?.contentWindow || event.data?.type !== 'mosswing:flap') return
      const currentRoom = roomRef.current
      const player = currentRoom?.players.find((entry) => entry.you)
      if (currentRoom?.phase !== 'running' || !player?.alive) return
      const socket = socketRef.current
      if (socket?.connected) {
        socket.emit('game:flap', {}, (response: Ack) => {
          if (!response?.ok && roomRef.current?.phase === 'running') {
            setFeedback(response?.error ?? 'Le battement d’ailes n’a pas été accepté.')
          }
        })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const perform = useCallback(async (event: string, payload: object = {}) => {
    const socket = socketRef.current
    if (!socket?.connected) {
      setFeedback('Le serveur multijoueur n’est pas connecté.')
      return null
    }
    setFeedback('')
    try {
      return await emitAck(socket, event, payload)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'La demande a échoué.'
      setFeedback(message)
      return null
    }
  }, [])

  const createRoom = useCallback(async () => {
    const result = await perform('room:create', {
      name: nickname,
      walletId: getDemoWalletId(),
      stake: Number(stake),
      isPublic,
    })
    if (result?.code && result.token) {
      window.sessionStorage.setItem('mosswing-online-room', JSON.stringify({ code: result.code, token: result.token }))
    }
  }, [isPublic, nickname, perform, stake])

  const joinRoom = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = await perform('room:join', {
      code: codeInput,
      name: nickname,
      walletId: getDemoWalletId(),
      stake: Number(joinStake),
    })
    if (result?.code && result.token) {
      window.sessionStorage.setItem('mosswing-online-room', JSON.stringify({ code: result.code, token: result.token }))
    }
  }, [codeInput, joinStake, nickname, perform])

  const leaveRoom = useCallback(async () => {
    const socket = socketRef.current
    if (socket?.connected && roomRef.current) await perform('room:leave')
    window.sessionStorage.removeItem('mosswing-online-room')
    roomRef.current = null
    setRoom(null)
    setQueued(false)
    setView('menu')
    setFeedback('')
    startedRoundRef.current = ''
  }, [perform])

  async function copyRoomCode() {
    if (!room) return
    try {
      await navigator.clipboard.writeText(room.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      console.error('Could not copy Mosswing room code:', error)
      setFeedback('Copie impossible ici. Sélectionnez le code pour le copier manuellement.')
    }
  }

  function requestFlap() {
    frameRef.current?.contentWindow?.postMessage({ type: 'mosswing:manual-flap' }, '*')
  }

  const players = room?.players ?? []
  const self = players.find((player) => player.you)
  const opponent = players.find((player) => !player.you)
  const countdown = room?.countdownEndsAt ? Math.max(1, Math.ceil((room.countdownEndsAt - clock) / 1000)) : null
  const resultTitle = room?.winnerSlot === null
    ? 'ÉGALITÉ'
    : room?.winnerSlot === room?.yourSlot
      ? 'VICTOIRE'
      : 'DÉFAITE'
  const resultDescription = room?.result === 'deconnexion'
    ? 'Votre adversaire a perdu la connexion.'
    : room?.result === 'abandon'
      ? 'Votre adversaire a quitté la manche.'
      : room?.result === 'temps'
        ? 'Le temps est écoulé.'
        : room?.result === 'egalite'
          ? 'Les deux créatures ont été éliminées en même temps.'
          : room?.result === 'collision'
            ? room.winnerSlot === room.yourSlot
              ? 'Votre adversaire a heurté un obstacle.'
              : 'Vous avez heurté un obstacle ; votre adversaire a tenu plus longtemps.'
            : 'La créature adverse a heurté un obstacle.'

  return (
    <main className="mosswing-online" data-theme="mosswing">
      {frameSource && (
        <iframe
          ref={frameRef}
          className={`mosswing-frame ${view === 'playing' || view === 'solo' || view === 'result' ? 'is-visible' : ''}`}
          title="Mosswing — vol dans le jardin"
          srcDoc={frameSource}
          onLoad={() => setFrameReady(true)}
        />
      )}

      <header className="mosswing-topbar">
        <button type="button" className="mosswing-back" onClick={() => {
          if (room) void leaveRoom()
          else {
            socketRef.current?.emit('matchmaking:leave')
            onClose()
          }
        }} aria-label="Retour">
          <ArrowLeft size={20} />
        </button>
        <div className="mosswing-wordmark"><span className="mosswing-mark">M</span><span>MOSSWING</span></div>
        <span className={`mosswing-connection ${connected ? 'is-online' : ''}`} title={connected ? 'Serveur connecté' : 'Serveur déconnecté'}>
          {connected ? <Wifi size={18} /> : <WifiOff size={18} />}
          <span>{connected ? (ping === null ? 'Connecté' : `${ping} ms`) : 'Hors ligne'}</span>
        </span>
      </header>

      {(view === 'menu' || view === 'join' || view === 'waiting') && (
        <section className="mosswing-lobby" aria-label="Salon Mosswing">
          {view === 'menu' && (
            <div className="mosswing-panel mosswing-home-panel">
              <span className="mosswing-eyebrow">SMALL WINGS · BIG DUEL</span>
              <h1>Mosswing <em>Online</em></h1>
              <p>Un jardin, deux pilotes. Qui tiendra le plus longtemps dans les airs ?</p>
              <label className="mosswing-name-field">
                <span>Votre pseudo</span>
                <input maxLength={18} value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Pilote" />
              </label>
              <label className="mosswing-name-field">
                <span>Mise en crédits démo</span>
                <input type="number" min="1" max="1000000" step="1" value={stake} onChange={(event) => setStake(event.target.value)} />
              </label>
              <label className="mosswing-setting">
                <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} />
                <span>Afficher mon salon sur l’accueil</span>
              </label>
              <div className="mosswing-menu-actions">
                <button type="button" className="mosswing-primary" onClick={() => void createRoom()} disabled={!connected}>
                  <Users size={19} /> Créer une salle
                </button>
                <button type="button" className="mosswing-secondary" onClick={() => setView('join')}>
                  Rejoindre une salle
                </button>
                <button type="button" className="mosswing-secondary" onClick={() => {
                  if (queued) {
                    socketRef.current?.emit('matchmaking:leave')
                    setQueued(false)
                  } else {
                    setQueued(true)
                    void perform('matchmaking:join', { name: nickname })
                  }
                }} disabled={!connected}>
                  <Search size={18} /> {queued ? 'Annuler la recherche' : 'Rechercher un adversaire'}
                </button>
                <button type="button" className="mosswing-secondary" onClick={() => setView('solo')}>
                  Jouer en solo
                </button>
              </div>
              <p className="mosswing-help mosswing-controls-summary">
                Commandes : Espace ou ↑ pour voler; P / Échap pour pause. Sur mobile, touchez l’écran ou le bouton VOLER.
              </p>
              <div className="mosswing-utility-actions">
                <button type="button" onClick={() => setShowSettings((open) => !open)}><Settings size={16} /> Paramètres</button>
                <button type="button" onClick={() => setShowHelp((open) => !open)}><Info size={16} /> Comment jouer</button>
              </div>
              {showSettings && (
                <label className="mosswing-setting">
                  <input type="checkbox" checked={!muted} onChange={(event) => setMuted(!event.target.checked)} />
                  <span>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />} Son du jeu</span>
                </label>
              )}
              {showHelp && <p className="mosswing-help">Espace ou ↑ pour voler; P / Échap pour mettre en pause. Le vol commence sans obstacle pendant 10 secondes, puis un signal annonce les piliers. Une pièce apparaît toutes les 5 secondes : restez près du centre pour la récupérer.</p>}
              {queued && <p className="mosswing-status"><LoaderCircle size={16} className="mosswing-spin" /> Recherche d’un joueur…</p>}
              {!connected && <p className="mosswing-status">Démarrez aussi le serveur Mosswing pour créer des salles.</p>}
            </div>
          )}

          {view === 'join' && (
            <div className="mosswing-panel">
              <button type="button" className="mosswing-panel-back" onClick={() => setView('menu')}><ArrowLeft size={17} /> Menu</button>
              <h1>Rejoindre une salle</h1>
              <p>Entrez le code à six caractères envoyé par votre ami.</p>
              <form className="mosswing-join-form" onSubmit={(event) => void joinRoom(event)}>
                <input
                  aria-label="Code de la salle"
                  autoComplete="off"
                  maxLength={6}
                  value={codeInput}
                  onChange={(event) => setCodeInput(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="ABC123"
                />
                <label className="mosswing-name-field">
                  <span>Mise identique en crédits démo</span>
                  <input
                    aria-label="Mise identique en crédits démo"
                    type="number"
                    min="0"
                    max="1000000"
                    step="1"
                    value={joinStake}
                    onChange={(event) => setJoinStake(event.target.value)}
                  />
                </label>
                <button type="submit" className="mosswing-primary" disabled={!connected || codeInput.length !== 6}>Rejoindre</button>
              </form>
            </div>
          )}

          {view === 'waiting' && room && (
            <div className="mosswing-panel mosswing-room-panel">
              <button type="button" className="mosswing-panel-back" onClick={() => void leaveRoom()}><ArrowLeft size={17} /> Quitter la salle</button>
              <span className="mosswing-eyebrow">SALLE PRIVÉE</span>
              <h1>Prêts à voler ?</h1>
              <button type="button" className="mosswing-room-code" onClick={() => void copyRoomCode()} aria-label="Copier le code de salle">
                <span>{room.code}</span>{copied ? <Check size={19} /> : <Clipboard size={19} />}
              </button>
              <p className="mosswing-status">
                {room.isPublic ? 'Salon public · visible sur l’accueil' : 'Salon privé'}
                {' · Mise démo '}{room.stake.toLocaleString('fr-FR')} crédits
                {' · Pot démo '}{(room.stake * 2).toLocaleString('fr-FR')} crédits
              </p>
              <div className="mosswing-player-slots">
                {[0, 1].map((slot) => {
                  const player = players.find((item) => item.slot === slot)
                  return (
                    <div className={`mosswing-player-slot ${player?.connected ? 'is-connected' : ''}`} key={slot}>
                      <span className="mosswing-player-avatar">{slot === 0 ? '01' : '02'}</span>
                      <span><strong>{player?.name ?? (slot === 0 ? 'Joueur 1' : 'Joueur 2')}{player?.you ? ' · Vous' : ''}</strong><small>{player?.connected ? (player.ready ? 'Prêt à voler' : 'Connecté') : 'Connexion…'}</small></span>
                      <i className={player?.connected ? 'is-connected' : ''} />
                    </div>
                  )
                })}
              </div>
              {room.phase === 'countdown' ? (
                <p className="mosswing-countdown"><span>{countdown}</span> Préparez-vous…</p>
              ) : (
                <button
                  type="button"
                  className={`mosswing-primary mosswing-ready ${self?.ready ? 'is-ready' : ''}`}
                  onClick={() => void perform('room:ready', { ready: !self?.ready })}
                  disabled={!connected || !opponent?.connected}
                >
                  {self?.ready ? <><Check size={19} /> Prêt</> : <><Users size={19} /> Je suis prêt</>}
                </button>
              )}
              {!opponent?.connected && <p className="mosswing-status">En attente du deuxième joueur… Partagez le code ci-dessus.</p>}
            </div>
          )}

          {feedback && <p className="mosswing-feedback" role="status">{feedback}</p>}
        </section>
      )}

      {view === 'playing' && room && (
        <>
          <div className="mosswing-duel-hud">
            <div className="mosswing-score-card is-you"><span>{self?.name ?? 'VOUS'}</span><strong>{self?.score ?? 0}</strong><small>🪙 {self?.coins ?? 0} · {self?.alive === false ? 'Éliminé' : 'En vol'}</small></div>
            <span className="mosswing-vs">VS</span>
            <div className="mosswing-score-card"><span>{opponent?.name ?? 'ADVERSAIRE'}</span><strong>{opponent?.score ?? 0}</strong><small>🪙 {opponent?.coins ?? 0} · {opponent?.connected ? (opponent.alive ? 'En vol' : 'Éliminé') : 'Reconnexion…'}</small></div>
          </div>
          {room.phase === 'paused' && (
            <div className="mosswing-reconnect-notice"><WifiOff size={18} /> Connexion interrompue — attente de reconnexion…</div>
          )}
          {room.phase === 'running' && opponent?.alive === false && (
            <div className="mosswing-reconnect-notice">Adversaire éliminé · Continuez votre vol !</div>
          )}
          {feedback && <p className="mosswing-feedback" role="status">{feedback}</p>}
        </>
      )}

      {view === 'result' && room && (
        <section className={`mosswing-result-shade ${room.winnerSlot === room.yourSlot ? 'is-win' : room.winnerSlot === null ? 'is-draw' : 'is-loss'}`}>
          <div className="mosswing-panel mosswing-result-panel">
            <span className="mosswing-eyebrow">MANCHE TERMINÉE</span>
            <h1>{resultTitle}</h1>
            <p>{resultDescription}</p>
            <div className="mosswing-result-scores">
              <div><small>VOTRE SCORE</small><strong>{self?.score ?? 0}</strong></div>
              <div><small>ADVERSAIRE</small><strong>{opponent?.score ?? 0}</strong></div>
            </div>
            {room.stake > 0 && (
              <p className={`mosswing-status ${room.winnerSlot === room.yourSlot ? 'is-win' : room.winnerSlot === null ? '' : 'is-loss'}`}>
                {room.payout && room.winnerSlot === room.yourSlot
                  ? `🪙 +${room.payout.toLocaleString('fr-FR')} crédits démo`
                  : room.payout ? 'Gain attribué à l’adversaire' : 'Mise remboursée en crédits démo'}
              </p>
            )}
            <button type="button" className="mosswing-primary" onClick={() => void perform('room:rematch')} disabled={!connected || !opponent?.connected || self?.ready}>
              <LoaderCircle size={18} /> {self?.ready ? 'En attente de l’adversaire…' : 'Revanche'}
            </button>
            <button type="button" className="mosswing-secondary" onClick={() => void leaveRoom()}>Retour au menu</button>
          </div>
        </section>
      )}

      {view === 'solo' && (
        <>
        <div className="mosswing-solo-controls">
          <button type="button" onClick={() => setView('menu')} aria-label="Retour au menu"><X size={19} /></button>
          <span>Solo · Espace / ↑ pour voler</span>
        </div>
        <button type="button" className="mosswing-flap-button" onPointerDown={(event) => event.preventDefault()} onClick={requestFlap}>VOLER</button>
        </>
      )}
      {view === 'playing' && room?.phase === 'running' && self?.alive !== false && (
        <button type="button" className="mosswing-flap-button" onPointerDown={(event) => event.preventDefault()} onClick={requestFlap}>VOLER · Espace / ↑</button>
      )}

      {view === 'playing' && room && self?.alive === false && room.phase === 'running' && (
        <div className="mosswing-eliminated">
          <strong>VOL TERMINÉ</strong>
          <span>Score : {self.score}</span>
          {opponent?.alive && <span>Vous pouvez regarder {opponent.name} continuer.</span>}
        </div>
      )}
    </main>
  )
}
