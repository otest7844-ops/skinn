import * as THREE from 'three';
import { arNum, clamp, damp, fmtClock, fmtNum, randi } from '../core/utils.js';
import { scene, camera, keyLight } from '../core/renderer.js';
import { applyTOD, tod } from '../core/sky.js';
import { game } from '../core/state.js';
import { settings, saveSettings, resetSettings, SETTINGS_SCHEMA, SETTINGS_TABS, isTouch } from '../config/settings.js';
import { WEAPONS, PRIMARIES, DIFFICULTY, MODES, SKINS, MEDALS, RANKS, MAPS } from '../config/balance.js';
import { loadMap, MAP_INFO, SNIPER_SPOTS, PLAYER_START } from '../world/map.js';
import { initAudio, audio } from '../audio/engine.js';
import { sfx } from '../audio/sfx.js';
import { music } from '../audio/music.js';
import { buildSoldier, animateSoldier } from '../entities/soldier-model.js';
import { lockPointer, unlockPointer, releaseAll } from '../input/input.js';
import { profile, saveProfile, rankProgress, rankIndex, weaponUnlocked, skinUnlocked, modeUnlocked } from '../systems/progression.js';
import { startRun, endRun, clearBattlefield } from '../systems/waves.js';
import { setFocus, focus } from '../systems/focus.js';
import { dailyChallenges, resetsIn } from '../systems/challenges.js';
import { showHUD } from './hud.js';
import { WEAPON_ICONS, rankInsignia, medalIcon } from './icons.js';
import { setMenuFx } from './menufx.js';
import { armoryShow, armoryHide, armoryUpdate } from './armory.js';
import { shots, missingShots, renderMissingShots } from './mapshots.js';
import { $, $$, el, esc } from './dom.js';
import { requestMultiplayerStart } from '../core/multiplayer.js';

/* Menus and their navigation (mouse, touch, keyboard arrows and gamepad). */

const SCREENS = ['boot', 'splash', 'main', 'brief', 'record', 'settings', 'controls', 'pause', 'aar'];
const FX_MODE = { boot: 'title', splash: 'title', main: 'menu', brief: 'page', record: 'page', settings: 'page', controls: 'page', aar: 'page' };
let current = 'boot', settingsReturn = 'main', controlsReturn = 'main';
export function showScreen(id) {
  current = id;
  for (const s of SCREENS) $(s).hidden = s !== id;
  document.body.dataset.screen = id || '';
  setMenuFx(FX_MODE[id] || 'off');
  if (id !== 'brief') armoryHide();
  if (!id) resetMenuCamera();
  const menu = id && $(id).querySelector('.menu');
  if (menu && menu.firstMenuItem) menu.placeBar(menu.firstMenuItem());
  const first = id && $(id).querySelector('[data-autofocus]') || (id && $(id).querySelector('.nav:not([disabled])'));
  if (first && !isTouch) first.focus({ preventScroll: true });
}
export const currentScreen = () => current;

/* ---------- menu background: three raiders on the current map, filmed by a calm camera ---------- */
const showcase = [];
export function buildShowcase() {
  clearShowcase();
  for (const [kind, role, x, z, yaw] of MAP_INFO.showcase.soldiers) {
    const ch = buildSoldier(kind, randi(1e6), role);
    ch.root.position.set(x, 0, z);
    ch.root.rotation.y = yaw;
    ch.lookT = Math.random() * 5;
    scene.add(ch.root);
    showcase.push(ch);
  }
}
export function clearShowcase() { for (const ch of showcase) scene.remove(ch.root); showcase.length = 0; }

/*
 * The menu camera eases between three shots:
 *   show   - the establishing shot of the raiders (splash, main menu, pages), wide and calm
 *   aerial - a slow orbit high over the map, framed inside the briefing viewport
 *   armory - high up, looking away from the sun into the dusk sky, behind the 3D weapon
 * A view offset slides the subject into the free part of the screen instead of its centre.
 */
const V3 = THREE.Vector3;
const cam = { pos: new V3(), look: new V3(), off: 0, offY: 0, fov: 46, init: false };
const tgt = { pos: new V3(), look: new V3(), off: 0, offY: 0, fov: 46 };
const _v = new V3(), _d = new V3();
let orbitA = 0.7, fogK = 1, fogBase = null, shadowSaved = null, readT = 0;

function wideShadows(on) {
  const sc = keyLight.shadow.camera;
  if (on && !shadowSaved) {
    shadowSaved = { l: sc.left, r: sc.right, t: sc.top, b: sc.bottom };
    sc.left = -96; sc.right = 96; sc.top = 96; sc.bottom = -96; sc.updateProjectionMatrix();
  } else if (!on && shadowSaved) {
    sc.left = shadowSaved.l; sc.right = shadowSaved.r; sc.top = shadowSaved.t; sc.bottom = shadowSaved.b; sc.updateProjectionMatrix();
    shadowSaved = null;
  }
}
/** Back to a plain gameplay camera: no view offset, normal shadows and fog. */
function resetMenuCamera() {
  camera.clearViewOffset();
  wideShadows(false);
  if (fogK !== 1 && fogBase != null) scene.fog.density = fogBase;
  fogK = 1; fogBase = null;
  cam.init = false;
}
const rectOf = (id) => { const n = $(id); return n && !n.hidden && n.offsetParent !== null ? n.getBoundingClientRect() : null; };

function menuShot() {
  if (current === 'brief') return briefTab === 'gear' ? 'armory' : 'aerial';
  return 'show';
}
/** Called every menu frame from the main loop. Returns the lens (vertical FOV) to use. */
export function updateMenuScene(dt) {
  const t = performance.now() * 0.001, S = MAP_INFO.showcase, W = innerWidth, H = innerHeight;
  const shot = menuShot();
  let mapRect = null, stageRect = null;
  if (shot === 'show') {
    const [cx, cy, cz] = S.cam, [lx, ly, lz] = S.look;
    const back = current === 'splash' || current === 'boot' ? 1.38 : 1.14;
    const dx = (cx - lx) * back, dz = (cz - lz) * back, r = Math.hypot(dx, dz), a = Math.atan2(dx, dz) + Math.sin(t * 0.05) * 0.12;
    tgt.pos.set(lx + Math.sin(a) * r, cy + (back - 1) * 2.2 + Math.sin(t * 0.08) * 0.15, lz + Math.cos(a) * r);
    tgt.look.set(lx, ly + (back - 1) * 0.6, lz);
    tgt.fov = 46; tgt.offY = 0;
    // main menu: the raiders sit left of the menu column; wide screens only
    tgt.off = current === 'main' && W > 700 ? 0.07 : 0;
  } else if (shot === 'aerial') {
    mapRect = rectOf('briefMapWrap');
    orbitA += dt * 0.035;
    const R = 70, Hh = 60;
    tgt.pos.set(Math.sin(orbitA) * R, Hh, Math.cos(orbitA) * R);
    tgt.look.set(0, -3, 0);
    tgt.fov = 40;
    if (mapRect) { tgt.off = 0.5 - (mapRect.left + mapRect.width / 2) / W; tgt.offY = 0.5 - (mapRect.top + mapRect.height / 2) / H; }
  } else {
    stageRect = rectOf('armStage');
    const R = 62, Hh = 34;
    tgt.pos.set(Math.sin(orbitA) * R, Hh, Math.cos(orbitA) * R);
    // look away from the sun: the weapon is lit from behind the camera against the darker sky
    _d.set(-tod.sunDir.x, 0, -tod.sunDir.z);
    if (_d.lengthSq() < 1e-4) _d.set(0, 0, -1);
    _d.normalize();
    tgt.look.copy(tgt.pos).addScaledVector(_d, 30); tgt.look.y += 4.5 + Math.sin(t * 0.1) * 0.4;
    tgt.fov = 40; tgt.off = 0; tgt.offY = 0;
  }
  if (!cam.init) {
    cam.pos.copy(tgt.pos); cam.look.copy(tgt.look); cam.off = tgt.off; cam.offY = tgt.offY; cam.fov = tgt.fov; cam.init = true;
  } else {
    const k = damp(2.1, dt), ky = damp(tgt.pos.y > cam.pos.y + 4 ? 3.2 : 2.1, dt);
    cam.pos.x += (tgt.pos.x - cam.pos.x) * k; cam.pos.z += (tgt.pos.z - cam.pos.z) * k; cam.pos.y += (tgt.pos.y - cam.pos.y) * ky;
    cam.look.lerp(tgt.look, damp(2.6, dt));
    cam.off += (tgt.off - cam.off) * damp(4, dt);
    cam.offY += (tgt.offY - cam.offY) * damp(4, dt);
    cam.fov += (tgt.fov - cam.fov) * damp(3, dt);
  }
  camera.position.copy(cam.pos);
  camera.lookAt(cam.look);
  if (Math.abs(camera.fov - cam.fov) > 0.01) camera.fov = cam.fov;
  if (Math.abs(cam.off) > 0.001 || Math.abs(cam.offY) > 0.001) camera.setViewOffset(W, H, cam.off * W, cam.offY * H, W, H);
  else if (camera.view && camera.view.enabled) camera.clearViewOffset();
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();

  // high shots: thinner fog and a shadow frustum big enough to cover the map from the air
  const high = shot !== 'show';
  wideShadows(high || cam.pos.y > 12);
  if (fogK === 1 && !high) fogBase = scene.fog.density;
  else {
    if (fogBase == null) fogBase = scene.fog.density;
    fogK += ((high ? 0.45 : 1) - fogK) * damp(2.5, dt);
    if (!high && Math.abs(fogK - 1) < 0.01) fogK = 1;
    scene.fog.density = fogBase * fogK;
  }

  if (mapRect) updateMarks(mapRect, dt);
  armoryUpdate(dt, stageRect);
  for (const ch of showcase) {
    ch.lookT += dt;
    animateSoldier(ch, dt, { speed: 0, pitch: -0.12, look: Math.sin(ch.lookT * 0.5) * 0.5, twist: Math.sin(ch.lookT * 0.3) * 0.15 });
  }
  return cam.fov;
}

/* tactical markers projected from the 3D map into the briefing viewport */
const marks = [];
let marksVer = -1;
function buildMarks() {
  marksVer = MAP_INFO.version;
  const box = $('briefMarks');
  box.innerHTML = '';
  marks.length = 0;
  const add = (cls, x, y, z, text) => {
    const e = el('span', 'mk ' + cls, `<i></i>${text ? `<span>${esc(text)}</span>` : ''}`);
    box.appendChild(e);
    marks.push({ e, v: new V3(x, y, z) });
  };
  for (const l of MAP_INFO.labels) add('foe', l.x, 1.5, l.z, l.t);
  for (const s of SNIPER_SPOTS) add('sniper', s.x, s.y + 1.2, s.z);
  add('you', PLAYER_START.x, 1, PLAYER_START.z, 'Vous');
}
function updateMarks(rect, dt) {
  if (marksVer !== MAP_INFO.version) buildMarks();
  const W = innerWidth, H = innerHeight;
  for (const m of marks) {
    _v.copy(m.v).project(camera);
    const x = ((_v.x + 1) / 2) * W - rect.left, y = ((1 - _v.y) / 2) * H - rect.top;
    const vis = _v.z < 1 && x > 10 && y > 34 && x < rect.width - 10 && y < rect.height - 10;
    m.e.style.opacity = vis ? '1' : '0';
    m.e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
  }
  readT -= dt;
  if (readT <= 0) {
    readT = 0.25;
    const hd = Math.round(((Math.atan2(-(cam.look.x - cam.pos.x), cam.look.z - cam.pos.z) * 180) / Math.PI + 360) % 360);
    $('vfRead').innerHTML = `Altitude <b>${Math.round(cam.pos.y)}</b> m · Cap <b>${hd}</b>°`;
  }
}

/* ---------- splash → main ---------- */
export function enterMenu() {
  if (initAudio()) { sfx.initAmbience(); music.init(); }
  music.setState('menu');
  sfx.select();
  openMain();
}
const TIPS = [
  'Le tireur d’élite révèle sa position par le reflet de sa lunette avant de tirer. Mettez-vous à couvert dès que vous le repérez.',
  'Les balles traversent les caisses en bois. Ne vous y abritez pas trop longtemps.',
  'Garder la grenade en main raccourcit sa mèche : maintenez le bouton, puis lancez-la.',
  'Concentrez vos tirs sur l’hélicoptère de transport pendant son vol pour l’abattre.',
  'La frappe aérienne ne fait pas de distinction. Ne désignez pas une cible proche de vous.',
  'La tempête de sable aveugle aussi les ennemis. Profitez-en pour avancer.',
  'Vos alliés vous suivent et couvrent vos flancs. Ne vous placez pas entre eux et l’ennemi.',
  'Appuyez sur Q quand la jauge de concentration est pleine pour ralentir le temps.',
  'Le conteneur de ravitaillement contient une arme supplémentaire : approchez-vous et appuyez sur E pour la prendre.',
];
export function openMain() {
  game.state = 'menu';
  const rp = rankProgress();
  const pc = $('profileCard');
  pc.className = 'profile brk';
  pc.innerHTML = `${rankInsignia(rp.idx, 56)}
    <div class="pc-body"><span class="pc-k">Votre grade</span>
    <div class="pc-row"><b>${rp.rank.name}</b><span class="pc-lv">${arNum(rp.idx + 1)} / ${arNum(RANKS.length)}</span></div>
    <span class="xpbar"><i style="transform:scaleX(${rp.frac.toFixed(3)})"></i></span>
    <span class="pc-x">${fmtNum(profile.xp)} XP${rp.next ? ` · prochain grade : ${rp.next.name} à ${fmtNum(rp.next.xp)} XP` : ' · grade maximal'}</span></div>`;
  $('mainEyebrow').textContent = `${MAP_INFO.name} · Tenez jusqu’à minuit`;
  $('mainTip').textContent = TIPS[randi(TIPS.length)];
  const dc = $('dailyCard');
  dc.className = 'orders brk';
  dc.innerHTML = dailyHTML(true);
  showScreen('main');
}
function dailyHTML(withHead) {
  const list = dailyChallenges();
  return (withHead ? `<div class="ord-head"><b>Ordres du jour<span class="ord-stamp">URGENT</span></b><span>Renouvellement dans ${resetsIn()}</span></div>` : '<h3>Ordres du jour</h3>') +
    list.map((c) => `<div class="dc${c.done ? ' done' : ''}"><i class="dc-box"></i><span class="dc-t">${c.text}</span><span class="dc-x">${plus(c.xp)} XP</span>
      <span class="xpbar"><i style="transform:scaleX(${clamp(c.progress / c.target, 0, 1).toFixed(3)})"></i></span><span class="dc-p">${c.done ? 'Terminé' : `${c.progress}/${c.target}`}</span></div>`).join('');
}

/** A menu list with a selection bar that slides to the focused item; the description line follows. */
function wireMenu(nav, desc) {
  const bar = nav.querySelector('.msel');
  const items = () => $$('.mitem', nav);
  nav.placeBar = (b) => {
    if (!b) return;
    for (const i of items()) i.classList.toggle('cur', i === b);
    bar.style.transform = `translateY(${b.offsetTop}px)`;
    bar.style.height = b.offsetHeight + 'px';
    nav.classList.add('has-sel');
    if (desc && b.dataset.desc && desc.textContent !== b.dataset.desc) {
      desc.textContent = b.dataset.desc;
      desc.classList.remove('swap'); void desc.offsetWidth; desc.classList.add('swap');
    }
  };
  nav.firstMenuItem = () => (nav.contains(document.activeElement) && document.activeElement.classList.contains('mitem') ? document.activeElement : items()[0]);
  nav.addEventListener('focusin', (e) => { const b = e.target.closest('.mitem'); if (b) nav.placeBar(b); });
  addEventListener('resize', () => { const c = nav.querySelector('.mitem.cur'); if (c) nav.placeBar(c); });
}

/* ---------- guide: how to play + controls ---------- */
const HOW = [
  ['Objectif', 'Tenez de <b>16 h</b> à <b>minuit</b>. Une vague d’ennemis arrive chaque heure ; ils sont plus nombreux et plus habiles à la tombée de la nuit. En mode « Jusqu’à l’aube », les vagues sont infinies.'],
  ['Combat', 'La visée précise (clic droit) resserre vos tirs ; accroupissez-vous avec <kbd>C</kbd> pour stabiliser votre arme. Les tirs à la tête infligent bien plus de dégâts. Les balles traversent le bois, mais pas la pierre.'],
  ['Ennemis', 'Ils combattent comme de vrais joueurs : courent entre les abris, tirent depuis leur couvert puis se cachent, et certains vous contournent pendant que les autres vous occupent. Ils entendent vos pas et vos tirs, lancent des grenades contre ceux qui restent cachés et communiquent par radio. En difficulté Vétéran et Légende, ils sont bien plus rapides et précis.'],
  ['Déplacement et escalade', 'Sautez avec <kbd>Espace</kbd> en avançant vers une caisse ou un rebord (jusqu’à environ 1,5 m) pour l’escalader ; franchissez les murs bas d’un bond. Certaines maisons ont un escalier extérieur qui mène au toit.'],
  ['Points d’appui', 'Chaque élimination rapporte des points à dépenser avec les touches <kbd>3</kbd> à <kbd>6</kbd> : le drone révèle les ennemis, le ravitaillement largue un conteneur, un allié est parachuté et la frappe aérienne bombarde la cible désignée au laser.'],
  ['Ravitaillement', 'Le conteneur est toujours largué à portée, à l’intérieur des remparts ; sa fumée verte et son signal lumineux le rendent visible. Approchez-vous pour récupérer munitions, armure et grenades, puis appuyez sur <kbd>E</kbd> pour prendre l’arme posée dessus.'],
  ['Armes', 'Vous pouvez porter deux armes principales et un pistolet. Changez d’arme avec <kbd>1</kbd>, <kbd>2</kbd> ou la molette ; votre arsenal apparaît en bas à droite.'],
  ['Concentration · touche Q', 'La jauge de concentration (en bas à droite, au-dessus de l’arme) se remplit avec les éliminations et les tirs à la tête. Appuyez sur <kbd>Q</kbd> à partir de 30 % : le monde ralentit tandis que vous restez rapide quelques secondes. Elle est assez chargée au début de chaque mission pour une activation.'],
  ['Alliés', 'Vous pouvez appeler jusqu’à deux alliés ; le second coûte plus cher. Ils vous suivent, combattent et communiquent par radio. Ne leur tirez pas dessus : vos balles les blessent et ils saignent.'],
  ['Couteau', 'Appuyez sur <kbd>V</kbd> pour poignarder au corps à corps. Une attaque par derrière est toujours mortelle.'],
  ['Dangers', 'La lunette du tireur d’élite brille avant son tir : mettez-vous immédiatement à couvert. L’hélicoptère dépose une escouade en rappel et peut être abattu. Une flèche rouge indique les grenades proches. La tempête de sable aveugle tout le monde.'],
];
const CONTROLS = [
  ['Clavier et souris', [['W A S D', 'Déplacement'], ['Shift', 'Courir · retenir son souffle à la lunette'], ['C', 'S’accroupir'], ['Espace', 'Sauter · escalader'], ['Clic gauche', 'Tirer'], ['Clic droit', 'Visée précise'], ['R', 'Recharger'], ['1 / 2 / molette', 'Changer d’arme'], ['E', 'Prendre l’arme du ravitaillement'], ['Maintenir G', 'Armer puis lancer une grenade'], ['V', 'Couteau'], ['Q', 'Concentration (ralentir le temps)'], ['F', 'Lampe torche'], ['3 4 5 6', 'Reconnaissance · ravitaillement · renfort · frappe'], ['Tab', 'Carte tactique'], ['Esc / P', 'Pause']]],
  ['Manette', [['Stick gauche', 'Déplacement'], ['Stick droit', 'Regarder'], ['RT / LT', 'Tirer / viser'], ['A', 'Sauter'], ['B', 'S’accroupir'], ['X', 'Recharger'], ['Y', 'Prendre une arme · changer d’arme'], ['Maintenir LB', 'Grenade'], ['RB', 'Concentration'], ['R3', 'Couteau'], ['L3', 'Courir'], ['Flèches', 'Appui aérien'], ['Back', 'Carte'], ['Start', 'Pause']]],
  ['Écran tactile', [['Côté gauche', 'Joystick de déplacement à l’endroit touché ; poussez-le à fond pour courir'], ['Côté droit', 'Faites glisser pour regarder'], ['Tir', 'Appuyez et faites glisser pour viser en tirant'], ['Viser / s’accroupir', 'Boutons à bascule'], ['Grenade', 'Maintenez pour l’armer'], ['Couteau', 'Coup rapproché, mortel par derrière'], ['Prendre', 'Apparaît près du conteneur'], ['Concentration', 'Ralentir le temps'], ['Appui', 'Menu d’appui aérien'], ['Carte / II', 'Carte et pause']]],
];
let guideTab = 'how';
function renderGuide() {
  for (const b of $$('#guideTabs button')) b.setAttribute('aria-pressed', String(b.dataset.gtab === guideTab));
  $('howGrid').hidden = guideTab !== 'how';
  $('ctlGrid').hidden = guideTab !== 'keys';
}
export function openControls(from, tab = 'how') {
  controlsReturn = from;
  guideTab = tab;
  $('howGrid').innerHTML = HOW.map(([t, p], i) => `<div class="how" style="--i:${i}"><span class="how-n">${String(i + 1).padStart(2, '0')}</span><b>${t}</b><p>${p}</p></div>`).join('');
  // touch players see the touch column first
  const cols = isTouch ? [CONTROLS[2], CONTROLS[0], CONTROLS[1]] : CONTROLS;
  $('ctlGrid').innerHTML = cols.map(([title, rows]) => `<div class="ctl-col"><h3>${title}</h3>${rows.map(([k, v]) => `<div class="ctl-row"><kbd>${k}</kbd><span>${v}</span></div>`).join('')}</div>`).join('');
  renderGuide();
  showScreen('controls');
  $('controls').querySelector('.page-body').scrollTop = 0;
}

/* ---------- briefing: operation, difficulty, loadout ---------- */
function weaponStats(W) {
  const acc = clamp(1 - W.spread / 0.06, 0, 1) * 0.6 + clamp(1 - W.adsSpread / 0.045, 0, 1) * 0.4;
  return [
    ['Dégâts', (W.dmg * (W.pellets || 1)) / 153, W.pellets ? `<bdi dir="ltr">${W.dmg}×${W.pellets}</bdi>` : W.dmg],
    ['Cadence de tir', W.rpm / 900, W.rpm],
    ['Précision', acc, Math.round(acc * 100)],
    ['Portée', W.falloff ? W.falloff[0] / 60 : 1, `${W.falloff ? W.falloff[0] : '+100'}<small>m</small>`],
    ['Mobilité', (W.mobility - 0.85) / 0.3, Math.round(W.mobility * 100)],
  ];
}
/** A signed number that keeps its sign on the left inside Arabic text. */
const plus = (n) => `<span dir="ltr">+${fmtNum(n)}</span>`;
const cellsN = (v) => Math.max(1, Math.round(clamp(v, 0.04, 1) * 10));
let briefTab = 'mission', previewW = null, previewSkin = null, previewT = 0;
export function openBriefing(focusLoadout = false) {
  if (!modeUnlocked(profile.mode)) profile.mode = 'dusk';
  if (!weaponUnlocked(profile.loadout)) profile.loadout = 'rifle';
  if (!skinUnlocked(profile.skin)) profile.skin = 'std';
  if (!MAPS[profile.map]) profile.map = 'citadel';
  previewW = previewSkin = null;
  const missing = missingShots().length;
  buildBriefing();
  setBriefTab(focusLoadout ? 'gear' : 'mission');
  showScreen('brief');
  if (focusLoadout && !isTouch) $('weaponList').querySelector('.sel, .nav')?.focus({ preventScroll: true });
  if (missing) setTimeout(ensureShots, 60);
  // the world may still be on another map (the backdrop follows profile.map)
  else if (MAP_INFO.id !== profile.map) selectMap(profile.map);
}
function setBriefTab(tab) {
  briefTab = tab;
  $('brief').dataset.tab = tab;
  for (const b of $$('#briefTabs button')) b.setAttribute('aria-pressed', String(b.dataset.btab === tab));
  $('bMission').hidden = tab !== 'mission';
  $('bGear').hidden = tab !== 'gear';
  $('briefMapWrap').hidden = tab !== 'mission';
  $('armoryView').hidden = tab !== 'gear';
  $('brief').querySelector('.brief-main').scrollTop = 0;
  if (tab === 'gear') renderHero(); else armoryHide();
}
const lockNote = (rank) => `Débloqué au grade ${RANKS[rank].name}`;
function mapThumb(id) { return shots[id] ? `<img src="${shots[id]}" alt="" draggable="false">` : '<span class="mc-ph"></span>'; }
function buildBriefing() {
  const rk = rankIndex();
  $('mapList').innerHTML = Object.entries(MAPS).map(([id, m], i) => `<button type="button" class="map-card nav" data-map="${id}" style="--i:${i}">
      ${mapThumb(id)}<span class="sel-tag">SÉLECTIONNÉ</span><span class="mc-tag">${m.traits[0]}</span><b>${m.name}</b></button>`).join('');
  $('opsList').innerHTML = Object.entries(MODES).map(([id, m]) => {
    const locked = rk < m.rank;
    return `<button type="button" class="op-card nav${locked ? ' locked' : ''}" data-mode="${id}"${locked ? ' aria-disabled="true"' : ''}>
      <span class="op-sky ${id}"></span><span class="sel-tag">SÉLECTIONNÉ</span><span class="op-tag">${m.tag}</span><b>${m.name}</b>
      ${locked ? `<span class="lock">${lockNote(m.rank)}</span>` : ''}</button>`;
  }).join('');
  $('diffList').innerHTML = Object.entries(DIFFICULTY).map(([id, d], i) => `<button type="button" class="diff nav" data-diff="${id}">
      <b>${d.name}</b><span class="pips">${[0, 1, 2].map((k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</span></button>`).join('');
  $('weaponList').innerHTML = PRIMARIES.map((id) => {
    const W = WEAPONS[id], locked = rk < W.rank;
    return `<button type="button" class="wcard nav${locked ? ' locked' : ''}" data-weapon="${id}"${locked ? ' aria-disabled="true"' : ''}>
      <span class="w-ico">${WEAPON_ICONS[id]}</span><span class="w-t"><span class="w-cls">${W.cls}</span><b>${W.full}</b></span>
      <span class="w-state">${locked ? `<span class="lock">${RANKS[W.rank].name}</span>` : ''}</span></button>`;
  }).join('');
  $('skinList').innerHTML = SKINS.map((s) => {
    const locked = rk < s.rank;
    return `<button type="button" class="skin nav ${s.id}${locked ? ' locked' : ''}" data-skin="${s.id}"${locked ? ' aria-disabled="true"' : ''}><i></i>
      ${locked ? '<span class="lk"></span>' : ''}<span class="sk-t">${s.name}<small>${locked ? RANKS[s.rank].name : 'Disponible'}</small></span></button>`;
  }).join('');
  $('sideList').innerHTML = [['pistol', 'Pistolet « Tigre »'], ['nade', 'Deux grenades'], ['knife', 'Couteau']].map(([k, t]) => `<span>${WEAPON_ICONS[k]}${t}</span>`).join('');
  refreshBriefing();
}
function refreshBriefing() {
  const sel = (sel, key, val) => { for (const b of $$(sel)) b.classList.toggle('sel', b.dataset[key] === val); };
  sel('#mapList .map-card', 'map', profile.map);
  sel('#opsList .op-card', 'mode', profile.mode);
  sel('#diffList .diff', 'diff', profile.diff);
  sel('#weaponList .wcard', 'weapon', profile.loadout);
  sel('#skinList .skin', 'skin', profile.skin);
  for (const b of $$('#weaponList .wcard:not(.locked)')) b.querySelector('.w-state').textContent = b.dataset.weapon === profile.loadout ? 'Équipé' : '';
  for (const b of $$('#skinList .skin:not(.locked)')) b.querySelector('small').textContent = b.dataset.skin === profile.skin ? 'Sélectionné' : 'Disponible';
  const D = DIFFICULTY[profile.diff];
  $('diffNote').innerHTML = `${D.desc}<em>XP ×${D.xpMul}</em>`;
  const M = MAPS[profile.map], cap = $('briefMapWrap').querySelector('.view-cap');
  if ($('mapTitle').textContent !== M.name) { cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap'); }
  $('mapTitle').textContent = M.name;
  $('mapNote').textContent = M.desc;
  $('mapIntel').textContent = M.note;
  $('mapChips').innerHTML = M.traits.map((t) => `<i>${t}</i>`).join('');
  $('briefSummary').innerHTML = [['Zone', M.name], ['Mission', MODES[profile.mode].name], ['Difficulté', D.name], ['Arme', WEAPONS[profile.loadout].name]]
    .map(([k, v]) => `<span class="sum-i"><em>${k}</em><b>${v}</b></span>`).join('');
  if (briefTab === 'gear') renderHero();
}
function renderHero() {
  const key = previewW || profile.loadout, W = WEAPONS[key], W0 = WEAPONS[profile.loadout];
  const locked = rankIndex() < W.rank;
  const cap = $('armoryView').querySelector('.arm-cap');
  if ($('armName').textContent !== W.full) { cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap'); }
  $('armCls').textContent = W.cls;
  $('armName').textContent = W.full;
  const st = $('armState');
  st.className = 'arm-state' + (locked ? ' lockd' : key === profile.loadout ? ' on' : '');
  st.textContent = locked ? lockNote(W.rank) : key === profile.loadout ? 'Équipé' : 'Aperçu · sélectionnez pour équiper';
  $('armSpecs').innerHTML = [['Chargeur', W.mag], ['Réserve', W.reserve], ['Mode de tir', W.mode], ['Cadence', `${W.rpm}<small>coups/min</small>`]]
    .map(([k, v]) => `<span class="spec"><em>${k}</em><b>${v}</b></span>`).join('');
  const base = weaponStats(W0);
  $('armStats').innerHTML = weaponStats(W).map(([k, v, raw], i) => {
    const n = cellsN(v), n0 = key === profile.loadout ? n : cellsN(base[i][1]);
    return `<span class="st"><span>${k}</span><b>${raw}</b><span class="cells">${Array.from({ length: 10 }, (_, c) => `<i class="${c < Math.min(n, n0) ? 'on' : c < n ? 'hi' : ''}"></i>`).join('')}</span></span>`;
  }).join('');
  armoryShow(key, previewSkin || profile.skin);
}
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
let mapBusy = false;
function busy(on) {
  mapBusy = on;
  $('briefStart').classList.toggle('busy', on);
  $('briefMapWrap').classList.toggle('loading', on);
  $('menuVeil').classList.toggle('on', on);
}
/** Rebuild the world for map `id` and put the menu backdrop on it. */
export function switchMap(id) {
  clearShowcase();
  loadMap(id);
  buildShowcase();
  if (current === 'main') $('mainEyebrow').textContent = `${MAP_INFO.name} · Tenez jusqu’à minuit`;
}
/** Switching maps rebuilds the world right away, so the aerial view and the backdrop show it. */
export async function selectMap(id) {
  if (mapBusy || id === MAP_INFO.id) return;
  busy(true);
  await nextFrame(); await nextFrame();
  switchMap(id);
  await nextFrame();
  busy(false);
}
/** First visit: render a picture of every map for the tiles (cached afterwards). */
async function ensureShots() {
  if (mapBusy || current !== 'brief') return;
  busy(true);
  await nextFrame(); await nextFrame();
  try {
    await renderMissingShots(clearShowcase, buildShowcase);
  } catch (err) { console.warn('map thumbnails', err); }
  if (MAP_INFO.id !== profile.map) switchMap(profile.map);
  for (const b of $$('#mapList .map-card')) {
    const ph = b.querySelector('.mc-ph');
    if (ph && shots[b.dataset.map]) ph.outerHTML = mapThumb(b.dataset.map);
  }
  await nextFrame();
  busy(false);
}
function deny(b) { sfx.dry(); b.classList.remove('deny'); void b.offsetWidth; b.classList.add('deny'); }
function bindBriefing() {
  $('briefTabs').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.dataset.btab === briefTab) return;
    sfx.tick();
    previewW = previewSkin = null;
    setBriefTab(b.dataset.btab);
  });
  $('brief').addEventListener('click', (e) => {
    const b = e.target.closest('.page-body button');
    if (!b) return;
    if (b.classList.contains('locked')) { deny(b); return; }
    let changed = true;
    if (b.dataset.map) { if (profile.map !== b.dataset.map) { profile.map = b.dataset.map; selectMap(b.dataset.map); } }
    else if (b.dataset.mode) profile.mode = b.dataset.mode;
    else if (b.dataset.diff) profile.diff = b.dataset.diff;
    else if (b.dataset.weapon) { profile.loadout = b.dataset.weapon; previewW = null; }
    else if (b.dataset.skin) { profile.skin = b.dataset.skin; previewSkin = null; }
    else changed = false;
    if (changed) {
      sfx.select();
      saveProfile();
      if (b.dataset.diff) buildBriefing(); // stars on the mode tile depend on the difficulty
      else refreshBriefing();
      if (b.dataset.diff) $('diffList').querySelector(`[data-diff="${profile.diff}"]`)?.focus({ preventScroll: true });
    }
  });
  // hovering or focusing a weapon or finish previews it on the turntable
  const bGear = $('bGear');
  bGear.addEventListener('focusin', (e) => {
    const w = e.target.closest('.wcard'), s = e.target.closest('.skin');
    clearTimeout(previewT);
    const nw = w ? w.dataset.weapon : previewW, ns = s && !s.classList.contains('locked') ? s.dataset.skin : previewSkin;
    if (nw !== previewW || ns !== previewSkin) { previewW = nw; previewSkin = ns; if (briefTab === 'gear') renderHero(); }
  });
  bGear.addEventListener('focusout', () => {
    clearTimeout(previewT);
    previewT = setTimeout(() => {
      if (bGear.contains(document.activeElement)) return;
      previewW = previewSkin = null;
      if (briefTab === 'gear' && current === 'brief') renderHero();
    }, 80);
  });
  $('briefStart').addEventListener('click', () => {
    if (mapBusy) return;
    sfx.select();
    armoryHide();
    clearShowcase();
    resetMenuCamera();
    const options = { map: profile.map, mode: profile.mode, diff: profile.diff, primary: profile.loadout, skin: profile.skin };
    const networkStart = requestMultiplayerStart(options);
    if (networkStart === 'waiting') {
      showMsg('En attente du lancement par l’hôte…', 2600);
      return;
    }
    startRun(options);
    showScreen(null);
  });
  $('briefBack').addEventListener('click', () => { if (mapBusy) return; sfx.back(); openMain(); });
}

/* ---------- service record ---------- */
const GRADE_AR = { S: 'Exceptionnel', A: 'Excellent', B: 'Très bien', C: 'Bien', D: 'Passable' };
export function openRecord(tab = 'dusk') {
  const rp = rankProgress(), T = profile.totals;
  const rr = $('recRank');
  rr.className = 'rec-rank brk';
  rr.innerHTML = `${rankInsignia(rp.idx, 104)}<div><span class="pc-k">Grade actuel · ${arNum(rp.idx + 1)} sur ${arNum(RANKS.length)}</span><b class="big">${rp.rank.name}</b>
    <span class="xpbar"><i style="transform:scaleX(${rp.frac.toFixed(3)})"></i></span>
    <span class="pc-x">${fmtNum(profile.xp)} XP${rp.next ? ` · ${fmtNum(rp.next.xp - profile.xp)} avant le grade ${rp.next.name}` : ' · grade maximal'}</span></div>`;
  const acc = T.shots ? Math.round((T.hits / T.shots) * 100) : 0;
  const h = Math.floor(T.playTime / 3600), m = Math.floor((T.playTime % 3600) / 60);
  $('recStats').innerHTML = [['Opérations', T.runs], ['Victoires', T.wins], ['Éliminations', fmtNum(T.kills)], ['Tirs à la tête', fmtNum(T.hs)], ['Précision', acc + '%'], ['Hélicoptères abattus', T.heliDowns], ['Éliminations au baril', T.barrelKills], ['Éliminations par un allié', T.allyKills], ['Heure atteinte', T.bestHour ? fmtClock(T.bestHour) : '—'], ['Temps de combat', `${h}:${String(m).padStart(2, '0')}`]]
    .map(([k, v], i) => `<div class="rs" style="--i:${i}"><span>${k}</span><b>${v}</b></div>`).join('');
  $('recStats').classList.add('stagger');
  let got = 0;
  $('recMedals').innerHTML = MEDALS.map((M, i) => {
    const on = !!profile.medals[M.id];
    if (on) got++;
    return `<div class="medal${on ? ' got brk' : ''}" style="--i:${i}">${medalIcon(M.id, on)}<b>${M.name}</b><span>${M.desc}</span><em>${plus(M.xp)} XP</em></div>`;
  }).join('');
  $('recMedals').classList.add('stagger');
  $('medalCount').textContent = `${arNum(got)} sur ${arNum(MEDALS.length)}`;
  renderBoard(tab);
  showScreen('record');
  $('record').querySelector('.page-body').scrollTop = 0;
}
function renderBoard(tab) {
  for (const b of $$('#boardTabs button')) b.setAttribute('aria-pressed', String(b.dataset.tab === tab));
  const list = profile.best[tab] || [];
  $('recBoard').innerHTML = list.length
    ? list.map((e, i) => `<div class="lb"><span class="lb-i">${i + 1}</span><b>${fmtNum(e.score)}</b><span>${fmtClock(e.hour)}</span><span>${e.kills} élim.</span><span class="grade g${e.grade}">${GRADE_AR[e.grade] || e.grade}</span><span class="lb-d">${DIFFICULTY[e.diff] ? DIFFICULTY[e.diff].name : ''}</span></div>`).join('')
    : '<p class="empty">Aucun score pour le moment. Terminez une opération pour l’afficher ici.</p>';
}

/* ---------- settings ---------- */
const SET_INFO = {
  quality: 'Définit la qualité des ombres, du bloom et de la résolution. Choisissez Faible ou Moyenne sur les téléphones et appareils modestes, Ultra sur les ordinateurs puissants.',
  dynRes: 'Quand la scène est exigeante, le jeu réduit légèrement la résolution puis la rétablit afin de préserver la fluidité pendant les grands combats.',
  fov: 'Détermine ce que vous voyez autour de vous au combat. Une valeur élevée élargit le champ de vision, mais les éléments paraissent plus petits et plus éloignés. Une valeur basse rapproche l’image au prix d’une vue plus étroite. Ce réglage ne s’applique qu’en partie : les menus gardent un objectif fixe. Essayez-le dans le menu Pause. Valeur par défaut : 80.',
  grain: 'Ajoute de fins points animés évoquant le grain d’un film et donnant un aspect cinématographique. Désactivez-le pour une image plus nette.',
  fps: 'Affiche le nombre d’images par seconde dans un coin de l’écran.',
  sens: 'Vitesse de rotation de la vue lorsque vous déplacez la souris.',
  adsSens: 'Sensibilité de la souris en visée précise, par rapport à la sensibilité normale.',
  invertY: 'La vue s’abaisse quand vous déplacez la souris vers le haut, comme dans certains jeux d’aviation.',
  touchSens: 'Vitesse de rotation de la vue lorsque vous faites glisser un doigt sur la partie droite de l’écran.',
  aimAssist: 'Ralentit légèrement la visée sur les ennemis et aide à les suivre à l’écran tactile ou à la manette.',
  autoFire: 'Sur téléphone : votre arme tire automatiquement quand le réticule se fixe sur un ennemi.',
  hudScale: 'Taille des éléments de l’interface pendant le combat.',
  muted: 'Coupe tous les sons du jeu, musique et effets compris, jusqu’à ce que vous réactiviez le son.',
  master: 'Volume général du jeu.',
  music: 'Volume de la musique dans les menus et en partie.',
  sfx: 'Volume des tirs, explosions, pas et autres effets sonores.',
  vocals: 'Votre voix lorsque vous êtes blessé : gémissement pour une blessure légère, cri pour une blessure grave et souffle court quand votre santé baisse.',
  blood: 'Affiche le sang et les traces de blessures.',
  crosshair: 'Forme du réticule au centre de l’écran.',
  hints: 'De courts messages pour vous guider pendant vos premières opérations.',
};
function setInfo(key) {
  const f = SETTINGS_SCHEMA.find((x) => x.key === key) || SETTINGS_SCHEMA.find((x) => x.tab === settingsTab);
  if (!f) return;
  $('setInfoTab').textContent = (SETTINGS_TABS.find((t) => t.id === f.tab) || {}).label || '';
  $('setInfoName').textContent = f.label.replace(/\s*\(.*\)\s*$/, '');
  $('setInfoText').textContent = SET_INFO[f.key] || f.hint || '';
}
let settingsTab = 'gfx';
export function openSettings(from) {
  settingsReturn = from;
  renderSettings();
  showScreen('settings');
}
const rangePct = (f, v) => (((v - f.min) / (f.max - f.min)) * 100).toFixed(1) + '%';
function renderSettings() {
  $('setTabs').innerHTML = SETTINGS_TABS.map((t) => `<button type="button" class="tab nav" data-tab="${t.id}" aria-pressed="${t.id === settingsTab}">${t.label}</button>`).join('');
  $('setFields').innerHTML = SETTINGS_SCHEMA.filter((f) => f.tab === settingsTab).map((f) => {
    const v = settings[f.key];
    if (f.type === 'range') return `<div class="field"><label for="s_${f.key}">${f.label}</label><output id="o_${f.key}">${f.fmt(v)}</output>
      <input class="nav" id="s_${f.key}" data-key="${f.key}" type="range" min="${f.min}" max="${f.max}" step="${f.step}" value="${v}" style="--p:${rangePct(f, v)}"></div>`;
    if (f.type === 'toggle') return `<div class="field"><span>${f.label}</span><button type="button" class="toggle nav" data-key="${f.key}" aria-pressed="${!!v}"><span class="on">Activé</span><span class="off">Désactivé</span></button></div>`;
    return `<div class="field"><span>${f.label}${f.hint ? `<small>${f.hint}</small>` : ''}</span><span class="seg">${f.opts.map(([k, l]) => `<button type="button" class="nav" data-key="${f.key}" data-val="${k}" aria-pressed="${v === k}">${l}</button>`).join('')}</span></div>`;
  }).join('');
  setInfo();
}
function bindSettings() {
  $('setFields').addEventListener('focusin', (e) => { const k = e.target.dataset && e.target.dataset.key; if (k) setInfo(k); });
  $('setTabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; settingsTab = b.dataset.tab; sfx.tick(); renderSettings(); $('setTabs').querySelector(`[data-tab="${settingsTab}"]`).focus(); });
  $('setFields').addEventListener('input', (e) => {
    const t = e.target; if (!t.dataset.key) return;
    const f = SETTINGS_SCHEMA.find((x) => x.key === t.dataset.key);
    settings[f.key] = Number(t.value);
    $('o_' + f.key).textContent = f.fmt(settings[f.key]);
    t.style.setProperty('--p', rangePct(f, settings[f.key]));
    saveSettings(f.key);
  });
  $('setFields').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const key = b.dataset.key;
    settings[key] = b.classList.contains('toggle') ? !settings[key] : b.dataset.val;
    saveSettings(key);
    sfx.tick();
    renderSettings();
    $('setFields').querySelector(`[data-key="${key}"]${b.dataset.val ? `[data-val="${b.dataset.val}"]` : ''}`)?.focus();
  });
  $('setBack').addEventListener('click', () => { sfx.back(); closeSettings(); });
  $('setReset').addEventListener('click', () => { resetSettings(); sfx.back(); renderSettings(); });
}
function closeSettings() { if (settingsReturn === 'pause') showScreen('pause'); else openMain(); }
function closeControls() { if (controlsReturn === 'pause') showScreen('pause'); else openMain(); }

/* ---------- pause ---------- */
export function pause() {
  if (game.state !== 'playing') return;
  game.state = 'paused';
  for (const id of ['pSetBtn', 'pCtlBtn', 'restartBtn', 'quitBtn']) {
    $(id).hidden = game.onlineMode !== null;
  }
  releaseAll();
  if (focus.active) setFocus(false);
  unlockPointer();
  if (audio.ctx) audio.ctx.suspend();
  $('pauseMeta').textContent = `${MAP_INFO.name} · ${fmtClock(game.hour)} · Vague ${arNum((game.wave || 0) + 1)}`;
  showScreen('pause');
}
export function resume() {
  if (game.state !== 'paused') return;
  showScreen(null);
  if (audio.ctx) audio.ctx.resume();
  game.state = 'playing';
  lockPointer();
}

/* ---------- after-action report ---------- */
export function openAAR(r) {
  if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume();
  $('aarEyebrow').textContent = r.won ? (r.mode === 'dusk' ? 'Victoire · Minuit' : 'Fin de l’opération') : 'Rapport de fin de mission';
  $('aarTitle').textContent = r.won ? 'Vous avez tenu jusqu’à minuit' : `Vous êtes tombé à ${fmtClock(r.hour)}`;
  $('aarMeta').textContent = `${MAP_INFO.name} · ${MODES[r.mode].name} · ${DIFFICULTY[r.diff].name}${r.place >= 0 ? ` · Place ${arNum(r.place + 1)} dans votre classement` : ''}`;
  $('aarGrade').textContent = GRADE_AR[r.grade] || r.grade;
  $('aarGrade').className = 'grade-stamp g' + r.grade;
  $('aarStars').innerHTML = r.mode === 'dusk' ? [1, 2, 3].map((s) => `<i class="${r.stars >= s ? 'on' : ''}"></i>`).join('') : '';
  const S = r.stats;
  $('aarStats').innerHTML = [['Éliminations', S.kills], ['Tirs à la tête', S.hs], ['Précision', S.acc + '%'], ['Plus longue série', S.streak], ['Vagues', S.waves], ['Durée', `${Math.floor(S.time / 60)}:${String(Math.floor(S.time % 60)).padStart(2, '0')}`]]
    .map(([k, v], i) => `<div class="rs" style="--i:${i}"><span>${k}</span><b>${v}</b></div>`).join('');
  $('aarStats').classList.add('stagger');
  const lines = $('aarLines');
  lines.innerHTML = '';
  $('aarTotal').textContent = '0';
  $('aarUnlocks').innerHTML = '';
  $('aarMedals').innerHTML = r.medals.map((M) => `<div class="medal got small">${medalIcon(M.id, true)}<b>${M.name}</b></div>`).join('');
  $('aarDaily').innerHTML = dailyHTML(false);
  $('aarRank').classList.remove('promoted');
  showScreen('aar');
  // count the report up line by line
  let total = 0, i = 0;
  const step = () => {
    if (current !== 'aar') return;
    if (i < r.lines.length) {
      const l = r.lines[i++];
      total += l.pts;
      lines.appendChild(el('div', 'aar-line', `<span>${esc(l.label)}${l.count > 1 ? ` <em>×${l.count}</em>` : ''}</span><b>${plus(l.pts)}</b>`));
      lines.scrollTop = lines.scrollHeight;
      $('aarTotal').textContent = fmtNum(total);
      sfx.tick();
      setTimeout(step, 140);
    } else animateRank(r);
  };
  animateRank(r, true);
  setTimeout(step, 500);
}
function animateRank(r, initial) {
  const box = $('aarRank');
  box.className = 'rec-rank small brk';
  const xp = initial ? r.xpBefore : r.xpAfter;
  const rp = rankProgress(xp);
  box.innerHTML = `${rankInsignia(rp.idx, 64)}<div><b>${rp.rank.name}</b><span class="xpbar"><i style="transform:scaleX(${rp.frac.toFixed(3)})"></i></span><span class="pc-x">${fmtNum(xp)} XP · ${plus(r.xpAfter - r.xpBefore)} pour cette opération</span></div>`;
  if (initial) return;
  if (r.rankAfter > r.rankBefore) {
    box.classList.add('promoted');
    box.insertAdjacentHTML('afterbegin', `<span class="promo">Promotion !</span>`);
    music.stinger('rank');
  }
  $('aarUnlocks').innerHTML = r.unlocks.map((u) => `<div class="unlock"><em>Nouveau : ${u.kind}</em><b>${u.name}</b></div>`).join('');
}

/* ---------- keyboard / gamepad navigation ---------- */
function focusables() { return $$('.nav:not([disabled])', $(current)).filter((n) => n.offsetParent !== null); }
export function moveFocus(dir) {
  const list = focusables();
  if (!list.length) return;
  let i = list.indexOf(document.activeElement);
  const step = dir === 'up' || dir === 'right' ? -1 : 1;
  i = i < 0 ? 0 : (i + step + list.length) % list.length;
  list[i].focus();
  list[i].scrollIntoView({ block: 'nearest' });
}
export function back() {
  if (current === 'brief' || current === 'record') { if (mapBusy) return; sfx.back(); openMain(); }
  else if (current === 'settings') { sfx.back(); closeSettings(); }
  else if (current === 'controls') { sfx.back(); closeControls(); }
  else if (current === 'pause') resume();
}
export function menuKey(e) {
  if (current === 'splash') { enterMenu(); return; }
  if (current === 'boot' || current === null) return;
  if (e.target instanceof HTMLInputElement && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) { e.preventDefault(); moveFocus({ ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[e.code]); }
  else if (e.code === 'Escape' || e.code === 'Backspace') { e.preventDefault(); back(); }
}
export function menuNav(dir) {
  if (current === 'splash') { enterMenu(); return; }
  if (dir === 'ok') { const a = document.activeElement; if (a && a.click) a.click(); }
  else if (dir === 'back') back();
  else if (dir === 'start' && current === 'pause') resume();
  else moveFocus(dir);
}

// the loading screen shows the percentage main.js writes into the bar
{
  if (/autotest/.test(location.hash)) document.documentElement.classList.add('autotest');
  const bar = $('bootBar'), pct = $('bootPct');
  if (bar && pct && typeof MutationObserver !== 'undefined') {
    new MutationObserver(() => {
      const m = /scaleX\(([\d.]+)\)/.exec(bar.style.transform);
      if (m) pct.textContent = Math.round(Number(m[1]) * 100) + '%';
    }).observe(bar, { attributes: true, attributeFilter: ['style'] });
  }
  setMenuFx('title', true);
}

export function initScreens() {
  if (isTouch) $('pressLine').textContent = 'Touchez l’écran pour commencer';
  $('splash').addEventListener('pointerdown', enterMenu);
  wireMenu($('mainMenu'), $('menuDesc'));
  wireMenu($('pauseMenu'));
  $('main').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    sfx.select();
    const act = b.dataset.act;
    if (act === 'play') openBriefing();
    else if (act === 'loadout') openBriefing(true);
    else if (act === 'record') openRecord();
    else if (act === 'settings') openSettings('main');
    else if (act === 'guide') openControls('main');
  });
  $('ctlBack').addEventListener('click', () => { sfx.back(); closeControls(); });
  $('guideTabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; guideTab = b.dataset.gtab; sfx.tick(); renderGuide(); $('controls').querySelector('.page-body').scrollTop = 0; });
  $('pCtlBtn').addEventListener('click', () => { sfx.select(); openControls('pause'); });
  bindBriefing();
  bindSettings();
  $('boardTabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { sfx.tick(); renderBoard(b.dataset.tab); } });
  $('recBack').addEventListener('click', () => { sfx.back(); openMain(); });
  $('resumeBtn').addEventListener('click', resume);
  $('pSetBtn').addEventListener('click', () => { sfx.select(); openSettings('pause'); });
  $('restartBtn').addEventListener('click', () => {
    if (audio.ctx) audio.ctx.resume();
    startRun({ map: profile.map, mode: profile.mode, diff: profile.diff, primary: profile.loadout, skin: profile.skin });
    showScreen(null);
  });
  $('quitBtn').addEventListener('click', () => { if (audio.ctx) audio.ctx.resume(); endRun(false); });
  $('aarAgain').addEventListener('click', () => { sfx.select(); buildShowcaseIfNeeded(); openBriefing(); });
  $('aarMenu').addEventListener('click', () => { sfx.back(); clearBattlefield(); showHUD(false); returnToMenuScene(); openMain(); });
  document.addEventListener('focusin', (e) => { if (e.target.classList && e.target.classList.contains('nav') && !isTouch) sfx.hover(); });
  // game menus: pointing at an item selects it (same state as keyboard / gamepad focus)
  if (!isTouch) {
    document.addEventListener('pointerover', (e) => {
      const n = e.target.closest && e.target.closest('.nav');
      if (!n || n === document.activeElement || n.disabled || e.buttons) return;
      if (!n.closest('.screen:not([hidden])')) return;
      n.focus({ preventScroll: true });
    });
  }
}
function buildShowcaseIfNeeded() { if (!showcase.length) returnToMenuScene(); }
function returnToMenuScene() { clearBattlefield(); game.state = 'menu'; game.hour = 18.4; applyTOD(18.4); buildShowcase(); }
