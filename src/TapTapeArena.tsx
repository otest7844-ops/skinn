import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { ArenaRoomView } from './ArenaRoom'

interface TapTapeArenaProps {
  onClose: () => void
  room?: ArenaRoomView | null
  onAction?: (type: string, data?: object) => void
}

export default function TapTapeArena({ onClose, room = null, onAction }: TapTapeArenaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const actionRef = useRef(onAction)
  const previousScoresRef = useRef<number[] | null>(null)
  const startedRoundRef = useRef('')
  const [frameReady, setFrameReady] = useState(false)
  useEffect(() => { actionRef.current = onAction }, [onAction])

  const HTML = useMemo(() => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Tape-Tape Arena 3D</title>
<style>
:root{color-scheme:light;--bg:#7fdcfa;--mut:#1b2f7a;--a:#1b2f7a;--b:#f72585}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;margin:0;padding:0}
html,body{height:100%;background:#7fdcfa url('/images/memo-sky.svg') center/100% 100% fixed;color:#1b2f7a;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden;touch-action:none}
#app{height:100%;display:flex;flex-direction:column}
.zone{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:0}
.zone.p2{transform:rotate(180deg)}
.lbl{font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:var(--mut)}
.score{font-size:clamp(36px,7vh,62px);font-weight:200;line-height:1;font-variant-numeric:tabular-nums}
.score small{font-size:.28em;color:var(--mut);font-weight:400;margin-left:6px}
.btn{width:min(22vh,54vw);aspect-ratio:1;border-radius:50%;border:1.5px solid currentColor;background:radial-gradient(circle at 35% 30%,#ffffff14,transparent 60%);color:var(--c);font:600 13px inherit;letter-spacing:.3em;text-transform:uppercase;cursor:pointer;touch-action:none;position:relative;overflow:hidden;transition:transform .06s}
.btn::after{content:"";position:absolute;inset:0;border-radius:50%;background:currentColor;opacity:0}
.btn.hit::after{animation:fl .22s}
@keyframes fl{from{opacity:.3}to{opacity:0}}
.btn:active,.btn.down{transform:scale(.95)}
.p1{--c:var(--a)}.p2{--c:var(--b)}
.p1 .btn{box-shadow:0 0 0 8px #4cc9f00d,0 0 50px #4cc9f022}
.p2 .btn{box-shadow:0 0 0 8px #f725850d,0 0 50px #f7258522}
#arena{flex:0 0 38%;position:relative;border-block:1px solid #ffffff1a}
#cv{width:100%;height:100%;display:block}
#ov{position:fixed;inset:0;background:rgba(127,220,250,.94);backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;z-index:5;padding:24px}
#ov h1{margin:0;font-size:clamp(24px,6vw,40px);font-weight:300;letter-spacing:.2em;text-transform:uppercase}
#ov p{margin:0;color:var(--mut);font-size:13px;letter-spacing:.08em}
#ov button{margin-top:10px;font:600 13px inherit;letter-spacing:.25em;text-transform:uppercase;padding:12px 36px;border-radius:40px;border:1.5px solid #1b2f7a;background:#fff;color:#1b2f7a;cursor:pointer}
#ov.cd{background:transparent;backdrop-filter:none;pointer-events:none}
#ov.cd h1{font-size:20vw;font-weight:100;letter-spacing:0;text-shadow:0 0 40px #000}
</style></head>
<body>
<div id="app">
  <div class="zone p2"><div class="lbl">Joueur 2</div><div class="score" id="s1">0<small>/100</small></div><button class="btn" id="btn1">Tape</button></div>
  <div id="arena"><canvas id="cv"></canvas></div>
  <div class="zone p1"><button class="btn" id="btn0">Tape</button><div class="score" id="s0">0<small>/100</small></div><div class="lbl">Joueur 1</div></div>
</div>
<div id="ov"><h1>Tape-Tape</h1><p>Premier à 100 · Ça recule si tu ralentis · Touches A et L</p><button id="go">Jouer</button></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const $=s=>document.querySelector(s),cv=$('#cv'),ov=$('#ov');
const GOAL=100,COL=[0x4cc9f0,0xf72585],HEX=['#4cc9f0','#f72585'],LZ=[1.4,-1.4],RAD=.55,X0=7;
let state='idle',AC,shake=0,onlineSlot=null,onlineMode=false,startToken=0;
const P=[{s:0,x:-X0,p:0,l:0,f:0},{s:0,x:X0,p:0,l:0,f:0}];
const tx=(i,f)=>i?X0-f*2*X0:-X0+f*2*X0;
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
R.setClearColor(0x000000,0);
R.setPixelRatio(Math.min(devicePixelRatio||1,2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;R.outputEncoding=THREE.sRGBEncoding;
const S=new THREE.Scene();S.background=null;S.fog=new THREE.FogExp2(0x4fcaf5,.035);
const cam=new THREE.PerspectiveCamera(38,1.3,.1,100);
function rs(){const w=cv.clientWidth,h=cv.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;
  cam.userData.d=Math.max(11,9.6/(Math.tan(cam.fov*Math.PI/360)*cam.aspect));cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
S.add(new THREE.HemisphereLight(0x8fa0ff,0x0a0a12,.5));
const rim=new THREE.DirectionalLight(0xffffff,.35);rim.position.set(-6,8,10);S.add(rim);
const k=document.createElement('canvas');k.width=k.height=256;const kx=k.getContext('2d');
kx.fillStyle='#0d0f16';kx.fillRect(0,0,256,256);kx.strokeStyle='#ffffff1c';kx.lineWidth=2;kx.strokeRect(0,0,256,256);
for(let i=0;i<2500;i++){kx.fillStyle='rgba(255,255,255,'+(Math.random()*.05)+')';kx.fillRect(Math.random()*256,Math.random()*256,1.5,1.5)}
const FT=new THREE.CanvasTexture(k);FT.wrapS=FT.wrapT=THREE.RepeatWrapping;FT.repeat.set(30,15);FT.anisotropy=8;
const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,30),new THREE.MeshStandardMaterial({map:FT,roughness:.28,metalness:.6}));
floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;S.add(floor);
const orbs=[],fills=[],spots=[];
const bulb=new THREE.MeshStandardMaterial({color:0x111111,emissive:0xffffff,emissiveIntensity:2});
for(let i=0;i<2;i++){
  const z=LZ[i],c=COL[i];
  const base=new THREE.Mesh(new THREE.BoxGeometry(2*X0+1.2,.05,1.1),new THREE.MeshStandardMaterial({color:0x14171f,roughness:.4,metalness:.7}));
  base.position.set(0,.03,z);base.receiveShadow=true;S.add(base);
  const g=new THREE.BoxGeometry(1,.06,.8);g.translate(.5,0,0);
  const f=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x000000,emissive:c,emissiveIntensity:1.6}));
  f.position.set(tx(i,0),.06,z);f.scale.x=.001;S.add(f);fills.push(f);
  const gx=i?-X0-.9:X0+.9,gm=new THREE.MeshStandardMaterial({color:0x20242e,metalness:.9,roughness:.3});
  for(const dz of[-.8,.8]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,2.2,16),gm);post.position.set(gx,1.1,z+dz);post.castShadow=true;S.add(post)}
  const bar=new THREE.Mesh(new THREE.BoxGeometry(.12,.14,1.7),new THREE.MeshStandardMaterial({color:0,emissive:c,emissiveIntensity:2.4}));
  bar.position.set(gx,2.2,z);S.add(bar);
  const o=new THREE.Mesh(new THREE.SphereGeometry(RAD,48,32),new THREE.MeshPhysicalMaterial({color:c,metalness:.85,roughness:.18,clearcoat:1,clearcoatRoughness:.1,emissive:c,emissiveIntensity:.18}));
  o.castShadow=true;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(RAD+.003,.035,12,48),new THREE.MeshStandardMaterial({color:0xffffff,metalness:.6,roughness:.3}));
  o.add(ring);const ring2=ring.clone();ring2.rotation.y=Math.PI/2;o.add(ring2);
  S.add(o);orbs.push(o);
  const sp=new THREE.SpotLight(c,3.2,30,.5,.65,1.2);sp.position.set(0,9,z+2);sp.castShadow=true;sp.shadow.mapSize.set(1024,1024);
  S.add(sp,sp.target);spots.push(sp);
}
const N=520,crowd=new THREE.InstancedMesh(new THREE.BoxGeometry(.32,.5,.32),new THREE.MeshStandardMaterial({roughness:.8}),N),m=new THREE.Matrix4(),cc=new THREE.Color();
for(let n=0;n<N;n++){const row=Math.floor(n/65),col=n%65,h=.4+Math.random()*.25;
  m.makeTranslation(-11+col*.34+Math.random()*.1,1+row*.5+h/2,-5.2-row*.7);crowd.setMatrixAt(n,m);
  cc.setHSL(Math.random(),.35,.08+Math.random()*.1);crowd.setColorAt(n,cc)}
S.add(crowd);
for(let r=0;r<8;r++){const st=new THREE.Mesh(new THREE.BoxGeometry(26,.5,.7),new THREE.MeshStandardMaterial({color:0x0f1118,roughness:.7}));st.position.set(0,.75+r*.5,-5.2-r*.7);S.add(st)}
const truss=new THREE.Mesh(new THREE.BoxGeometry(24,.1,.1),new THREE.MeshStandardMaterial({color:0x222530,metalness:.9,roughness:.3}));truss.position.set(0,5.2,-2);S.add(truss);
for(let n=0;n<13;n++){const b=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),bulb);b.position.set(-12+n*2,5.1,-2);S.add(b)}
const PN=600,pp=new Float32Array(PN*3),pv=new Float32Array(PN*3),pl=new Float32Array(PN),pcol=new Float32Array(PN*3);let pi=0;
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));pg.setAttribute('color',new THREE.BufferAttribute(pcol,3));
const pts=new THREE.Points(pg,new THREE.PointsMaterial({size:.09,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));pts.frustumCulled=false;S.add(pts);
function spark(i,n,col,sp){sp=sp||1;const c=new THREE.Color(col!=null?col:COL[i]),o=orbs[i].position;
  for(let q=0;q<n;q++){const j=pi++%PN,a=Math.random()*6.28,e=Math.random()*3.14-.3,v=(1+Math.random()*2.5)*sp;
    pp.set([o.x,o.y,o.z],j*3);pv.set([Math.cos(a)*v,Math.abs(Math.sin(e))*v*1.4+1,Math.sin(a)*v*.6],j*3);pl[j]=1;pcol.set([c.r,c.g,c.b],j*3)}}
function beep(f,d){d=d||.07;try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.stop(AC.currentTime+d+.01)}catch(e){}}
const sc=i=>$('#s'+i).innerHTML=Math.floor(P[i].s)+'<small>/100</small>';
function tap(i){
  if(state!=='play')return;
  if(onlineMode){if(i!==onlineSlot)return;parent.postMessage({type:'tape:tap'},'*');return}
  P[i].s++;P[i].f=Math.floor(P[i].s);sc(i);pulseTap(i);
  if(P[i].s>=GOAL)win(i);
}
function pulseTap(i){
  const p=P[i];p.p=1;p.l=performance.now();spark(i,6);beep(300+p.s*3);shake=Math.min(shake+.05,.12);
  const b=$('#btn'+i);b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit');
}
function win(i){
  state='end';beep(660,.4);shake=.25;
  for(let q=0;q<5;q++)setTimeout(function(){spark(i,90,Math.random()*0xffffff,2.2)},q*180);
  setTimeout(function(){ov.className='';ov.style.display='flex';ov.innerHTML='<h1 style="color:'+HEX[i]+'">Joueur '+(i+1)+'</h1><p>remporte la partie \u00b7 '+Math.floor(P[0].s)+' \u2013 '+Math.floor(P[1].s)+'</p><button id="go">Rejouer</button>';$('#go').onclick=start},1100);
}
function start(){
  const token=++startToken;
  P.forEach(function(p,i){p.s=0;p.p=0;p.f=0;p.l=performance.now()+800;sc(i)});
  state='count';ov.className='cd';ov.style.display='flex';
  ['3','2','1','Go'].forEach(function(s,q){setTimeout(function(){if(token!==startToken)return;ov.innerHTML='<h1>'+s+'</h1>';beep(q<3?400:700,.15);if(q===3){state='play';setTimeout(function(){if(token===startToken&&state==='play')ov.style.display='none'},500)}},q*800)});
}
$('#go').onclick=start;
addEventListener('message',function(e){
  if(e.source!==parent||!e.data)return;
  if(e.data.type==='tape:enable'){
    startToken++;
    onlineMode=true;onlineSlot=e.data.slot;
    if(state!=='play'&&state!=='paused'){ov.innerHTML='<h1>Tape-Tape</h1><p>En attente du départ synchronisé…</p>';ov.style.display='flex'}
    return
  }
  if(e.data.type==='tape:start'){
    startToken++;
    P.forEach(function(p,i){p.s=0;p.p=0;p.f=0;p.l=0;sc(i)});
    state='play';ov.style.display='none';beep(700,.15);return
  }
  if(e.data.type==='tape:pause'){if(state==='play')state='paused';return}
  if(e.data.type==='tape:resume'){if(state==='paused')state='play';return}
  if(e.data.type==='tape:state'&&Array.isArray(e.data.scores)){
    P.forEach(function(p,i){p.s=e.data.scores[i]||0;p.f=Math.floor(p.s);sc(i)});
    if(e.data.winner!==null&&e.data.winner!==undefined)state='end';
    return;
  }
  if(e.data.type==='tape:tap-feedback')pulseTap(e.data.slot);
});
['btn0','btn1'].forEach(function(id,i){var b=$('#'+id);b.addEventListener('pointerdown',function(e){e.preventDefault();tap(i)});b.addEventListener('contextmenu',function(e){e.preventDefault()})});
addEventListener('keydown',function(e){if(e.repeat)return;var q=e.key.toLowerCase();if(q==='a'||q==='q'){tap(0);$('#btn0').classList.add('down')}if(q==='l'||q==='m'){tap(1);$('#btn1').classList.add('down')}});
addEventListener('keyup',function(){document.querySelectorAll('.btn').forEach(function(b){b.classList.remove('down')})});
let last=performance.now(),T=0;
function loop(){
  var now=performance.now(),dt=Math.min((now-last)/1000,.1);last=now;T+=dt;
  for(var i=0;i<2;i++){
    var p=P[i];
    if(onlineSlot===null&&state==='play'&&p.s>0&&now-p.l>250){p.s=Math.max(0,p.s-(22+(now-p.l-250)*.035)*dt);if(Math.floor(p.s)!==p.f){p.f=Math.floor(p.s);sc(i)}}
    var old=p.x;p.x+=(tx(i,p.s/GOAL)-p.x)*(1-Math.exp(-12*dt));p.p*=Math.exp(-6*dt);
    var o=orbs[i];o.position.set(p.x,RAD+.05+p.p*.3,LZ[i]);o.rotation.z-=(p.x-old)/RAD;
    o.material.emissiveIntensity=.18+p.p*.9;
    var f=fills[i];f.scale.x=Math.max(.001,Math.abs(p.x-tx(i,0)))*(i?-1:1);
    spots[i].target.position.set(p.x,0,LZ[i]);spots[i].position.x=p.x*.6;
    if(Math.abs(p.x-old)>.01&&state==='play')spark(i,1,0xffb02e,.4);
  }
  for(var j=0;j<PN;j++){if(pl[j]>0){pl[j]-=dt*1.1;pv[j*3+1]-=6*dt;pp[j*3]+=pv[j*3]*dt;pp[j*3+1]=Math.max(.03,pp[j*3+1]+pv[j*3+1]*dt);pp[j*3+2]+=pv[j*3+2]*dt;}else pp[j*3+1]=-9}
  pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true;
  shake*=Math.exp(-9*dt);
  var d=cam.userData.d;
  cam.position.set((Math.random()-.5)*shake,d*.27+(Math.random()-.5)*shake,d);cam.lookAt(0,.4,-.3);
  R.render(S,cam);requestAnimationFrame(loop);
}
loop();
</script></body></html>`, [])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow || event.data?.type !== 'tape:tap') return
      actionRef.current?.('tap')
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    const frame = iframeRef.current?.contentWindow
    if (!frame || !frameReady) return
    if (!room) {
      previousScoresRef.current = null
      startedRoundRef.current = ''
      return
    }

    frame.postMessage({ type: 'tape:enable', slot: room.yourSlot }, '*')
    const roundKey = `${room.code}-${room.round}`
    if (room.phase === 'running' && startedRoundRef.current !== roundKey) {
      startedRoundRef.current = roundKey
      previousScoresRef.current = null
      frame.postMessage({ type: 'tape:start' }, '*')
    } else if (room.phase === 'paused') {
      frame.postMessage({ type: 'tape:pause' }, '*')
    } else if (room.phase === 'running') {
      frame.postMessage({ type: 'tape:resume' }, '*')
    }

    const gameState = room.gameState
    if (!gameState) return
    const scores = gameState.scores
    if (!scores) return
    const previousScores = previousScoresRef.current
    frame.postMessage({
      type: 'tape:state',
      scores,
      winner: gameState.winner ?? null,
    }, '*')
    if (room.phase === 'running' && previousScores) {
      scores.forEach((score, slot) => {
        if (Math.floor(score) > Math.floor(previousScores[slot] ?? 0)) {
          frame.postMessage({ type: 'tape:tap-feedback', slot }, '*')
        }
      })
    }
    previousScoresRef.current = scores.slice()
  }, [frameReady, room])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[120] bg-[#7fdcfa] flex flex-col overflow-hidden">
      {/* Header bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 bg-black/60 backdrop-blur-md border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
        >
          <ArrowLeft size={14} />
          <span>Quitter</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[#4cc9f0] font-black text-sm">●</span>
          <span className="text-white font-black text-sm tracking-widest uppercase">Tape-Tape Arena</span>
          <span className="text-[#f72585] font-black text-sm">●</span>
        </div>
        <div className="w-16" />
      </div>

      {/* The game iframe fills all remaining space */}
      <iframe
        ref={iframeRef}
        srcDoc={HTML}
        title="Tape-Tape Arena 3D"
        className="flex-1 w-full border-0"
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setFrameReady(true)}
      />
    </div>
  )
}
