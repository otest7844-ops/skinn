import { scene } from './renderer.js';
import { applyTOD } from './sky.js';
import { game, enemies, networkPlayers } from './state.js';
import { player } from '../entities/player.js';
import { buildSoldier } from '../entities/soldier-model.js';
import { rayCharacter } from '../entities/combat.js';

const remoteEnemies = new Map();
let remotePlayer = null;
let enabled = false;
let slot = -1;
let mode = null;
let sendTimer = 0;
let startHandler = () => {};
let remoteShotHandler = () => {};
let getStartConfig = () => null;

function send(input) {
  if (!enabled || !window.ghasaqNetwork) return;
  window.ghasaqNetwork.send(input);
}

function clearRemoteActors() {
  for (const actor of remoteEnemies.values()) scene.remove(actor.root);
  remoteEnemies.clear();
  if (remotePlayer) scene.remove(remotePlayer.root);
  remotePlayer = null;
  for (const target of networkPlayers) {
    target.alive = false;
    target.hurt = () => {};
  }
}

function upsertActor(map, id, kind, role, x, y, z, yaw) {
  let actor = map.get(id);
  if (!actor) {
    actor = buildSoldier(kind, Number(id) || 1, role);
    map.set(id, actor);
    scene.add(actor.root);
  }
  actor.root.position.set(x, y, z);
  actor.root.rotation.y = yaw;
}

function applySnapshot(state) {
  if (!state || !Array.isArray(state.players)) return;
  const opponent = state.players.find((item) => item?.slot !== slot && item?.present === true);
  if (opponent && [opponent.x, opponent.y, opponent.z, opponent.yaw].every(Number.isFinite)) {
    const target = networkPlayers[opponent.slot];
    target.pos.set(opponent.x, opponent.y, opponent.z);
    target.alive = opponent.alive !== false;
    target.speed2d = Number.isFinite(opponent.speed2d) ? opponent.speed2d : 0;
    target.hurt = (damage) => {
      if (mode === 'coop' && slot === 0 && opponent.slot === 1) send({ type: 'coop-damage', damage });
    };
    if (opponent.alive === false) {
      if (remotePlayer) scene.remove(remotePlayer.root);
      remotePlayer = null;
    } else {
      if (!remotePlayer) {
        remotePlayer = buildSoldier('ally', 17 + opponent.slot, 'rifle');
        scene.add(remotePlayer.root);
      }
      remotePlayer.root.position.set(opponent.x, opponent.y, opponent.z);
      remotePlayer.root.rotation.y = opponent.yaw;
    }
  } else if (remotePlayer) {
    scene.remove(remotePlayer.root);
    remotePlayer = null;
  }

  if (mode !== 'coop' || slot === 0 || !Array.isArray(state.enemies)) return;
  if (Number.isFinite(state.wave)) game.wave = state.wave;
  if (Number.isFinite(state.hour) && Math.abs(state.hour - game.hour) > 0.02) {
    game.hour = state.hour;
    applyTOD(state.hour);
  }
  const liveIds = new Set();
  for (const enemy of state.enemies) {
    if (!enemy || !Number.isInteger(enemy.id) || !['raider', 'night', 'heavy'].includes(enemy.kind)
      || !['rifle', 'grenadier', 'sniper'].includes(enemy.role)
      || ![enemy.x, enemy.y, enemy.z, enemy.yaw].every(Number.isFinite)) continue;
    liveIds.add(enemy.id);
    upsertActor(remoteEnemies, enemy.id, enemy.kind, enemy.role, enemy.x, enemy.y, enemy.z, enemy.yaw);
  }
  for (const [id, actor] of remoteEnemies) {
    if (!liveIds.has(id)) {
      scene.remove(actor.root);
      remoteEnemies.delete(id);
    }
  }
}

function onNetworkMessage(event) {
  const message = event.detail;
  if (!message || typeof message.type !== 'string') return;
  if (message.type === 'ghasaq:enable') {
    clearRemoteActors();
    enabled = Number.isInteger(message.slot) && (message.slot === 0 || message.slot === 1);
    slot = enabled ? message.slot : -1;
    mode = message.mode === 'duel' ? 'duel' : 'coop';
    game.onlineMode = mode;
    game.onlineSlot = slot;
    game.onlineStarted = false;
    game.onlineFinished = false;
    sendTimer = 0;
    if (enabled && slot === 0) {
      const config = message.startConfig ?? getStartConfig();
      if (config) {
        if (!message.startConfig) requestMultiplayerStart(config);
        game.onlineStarted = true;
        startHandler(config);
      }
    }
    return;
  }
  if (message.type === 'ghasaq:state' && enabled) {
    applySnapshot(message.state);
    const self = message.state?.players?.find((item) => item?.slot === slot && item?.present === true);
    if ((mode === 'duel' || mode === 'coop' && slot === 1) && self
      && Number.isFinite(self.hp) && Number.isFinite(self.armor)) {
      const damage = Math.max(0, player.hp - self.hp);
      if (damage > 0) player.hurt(damage, remotePlayer?.root.position ?? null, false, 'Adversaire');
      player.hp = self.hp;
      player.armor = self.armor;
      player.alive = self.alive !== false;
    }
    const config = message.state?.startConfig;
    if (slot === 1 && config && !game.onlineStarted) {
      game.onlineStarted = true;
      startHandler(config);
    }
    return;
  }
  if (message.type === 'ghasaq:remote-input' && enabled && slot === 0
    && mode === 'coop' && message.slot === 1 && message.input?.type === 'shot') {
    remoteShotHandler(message.input);
  }
}

export function initMultiplayer({ onStart, onRemoteShot, getConfig }) {
  startHandler = onStart ?? (() => {});
  remoteShotHandler = onRemoteShot ?? (() => {});
  getStartConfig = getConfig ?? (() => null);
  window.addEventListener('ghasaq:network', onNetworkMessage);
}

export function requestMultiplayerStart(config) {
  if (!enabled) return 'offline';
  if (slot !== 0) return 'waiting';
  game.onlineStarted = true;
  send({ type: 'start', config });
  return 'started';
}

export function sendMultiplayerShot(origin, direction, weapon, worldEnd) {
  if (!enabled || mode === 'coop' && slot === 0) return;
  if (mode === 'duel') {
    if (!remotePlayer) return;
    const distance = rayCharacter(origin, direction, { pos: remotePlayer.root.position, eyeH: 1.85 });
    if (distance < 0 || distance > origin.distanceTo(worldEnd)) return;
  }
  send({
    type: 'shot',
    weapon,
    origin: { x: origin.x, y: origin.y, z: origin.z },
    direction: { x: direction.x, y: direction.y, z: direction.z },
  });
}

export function updateMultiplayer(dt) {
  if (!enabled) return;
  if (mode === 'coop' && slot === 0 && game.state === 'over' && !game.onlineFinished) {
    game.onlineFinished = true;
    send({ type: 'finish' });
    return;
  }
  if (game.state !== 'playing') return;
  sendTimer -= dt;
  if (sendTimer > 0) return;
  sendTimer = 0.08;
  const ownState = {
    slot,
    x: player.pos.x,
    y: player.pos.y,
    z: player.pos.z,
    yaw: player.yaw,
    pitch: player.pitch,
    hp: player.hp,
    armor: player.armor,
    alive: player.alive,
    speed2d: player.speed2d,
  };
  const state = { player: ownState };
  if (mode === 'coop' && slot === 0) {
    state.enemies = enemies.slice(0, 32).map((enemy) => ({
      id: enemy.netId,
      kind: enemy.kind,
      role: enemy.role,
      x: enemy.pos.x,
      y: enemy.pos.y,
      z: enemy.pos.z,
      yaw: enemy.yaw,
    }));
    state.wave = game.wave;
    state.hour = game.hour;
    state.toSpawn = game.toSpawn;
    state.finished = game.state === 'over';
  }
  send({ type: 'snapshot', state });
}

export function leaveMultiplayer() {
  enabled = false;
  slot = -1;
  mode = null;
  game.onlineMode = null;
  game.onlineSlot = -1;
  game.onlineStarted = false;
  game.onlineFinished = false;
  clearRemoteActors();
}

window.addEventListener('beforeunload', leaveMultiplayer);
