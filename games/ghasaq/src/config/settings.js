import { store } from '../core/utils.js';

/* Player-facing settings, quality presets and the schema the settings screen renders from. */

// '#touch' in the address forces the phone controls on a desktop (handy for testing the layout)
export const isTouch = (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches) || location.hash.includes('touch');
export const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const QUALITY = {
  low: { label: 'Faible', pr: 0.75, shadow: 512, bloom: false, samples: 0, particles: 0.45 },
  medium: { label: 'Moyenne', pr: 1, shadow: 1024, bloom: false, samples: 2, particles: 0.7 },
  high: { label: 'Élevée', pr: 1.5, shadow: 2048, bloom: true, samples: 4, particles: 1 },
  ultra: { label: 'Ultra', pr: 2, shadow: 4096, bloom: true, samples: 4, particles: 1 },
};

const DEFAULTS = {
  // graphics
  quality: isTouch ? 'medium' : 'high',
  dynRes: true,
  fov: 80,
  grain: true,
  fps: false,
  // controls
  sens: 1,
  adsSens: 0.85,
  invertY: false,
  touchSens: 1,
  aimAssist: true,
  autoFire: false,
  hudScale: 1,
  // audio
  master: 0.85,
  music: 0.35,
  sfx: 1,
  muted: false,
  vocals: true,
  // gameplay
  blood: true,
  crosshair: 'cross',
  hints: true,
};

const KEY = 'ghasaq.settings.v2';
export const settings = Object.assign({}, DEFAULTS, store.get(KEY, {}));
if (!QUALITY[settings.quality]) settings.quality = DEFAULTS.quality;
// the first release shipped the music too loud: move anyone still on that default to the new one
if (!settings.mixV3) { if (settings.music === 0.55) settings.music = DEFAULTS.music; settings.mixV3 = true; store.set(KEY, settings); }

const listeners = [];
export function onSettingsChange(fn) { listeners.push(fn); }
export function saveSettings(changedKey) {
  store.set(KEY, settings);
  for (const fn of listeners) fn(changedKey, settings[changedKey]);
}
export function resetSettings() {
  Object.assign(settings, DEFAULTS);
  saveSettings('*');
}

const pct = (v) => Math.round(v * 100) + '%';
export const SETTINGS_TABS = [
  { id: 'gfx', label: 'Graphismes' },
  { id: 'ctl', label: 'Commandes' },
  { id: 'snd', label: 'Audio' },
  { id: 'play', label: 'Jeu' },
];
export const SETTINGS_SCHEMA = [
  { tab: 'gfx', key: 'quality', label: 'Qualité graphique', type: 'seg', opts: Object.entries(QUALITY).map(([k, q]) => [k, q.label]), hint: 'Ombres, bloom et résolution' },
  { tab: 'gfx', key: 'dynRes', label: 'Résolution dynamique (légère baisse en cas de charge pour préserver la fluidité)', type: 'toggle' },
  { tab: 'gfx', key: 'fov', label: 'Champ de vision', type: 'range', min: 65, max: 100, step: 1, fmt: (v) => v + '°' },
  { tab: 'gfx', key: 'grain', label: 'Grain de pellicule', type: 'toggle' },
  { tab: 'gfx', key: 'fps', label: 'Compteur d’images par seconde', type: 'toggle' },
  { tab: 'ctl', key: 'sens', label: 'Sensibilité de la souris', type: 'range', min: 0.2, max: 3, step: 0.05, fmt: (v) => Number(v).toFixed(2) },
  { tab: 'ctl', key: 'adsSens', label: 'Sensibilité en visée', type: 'range', min: 0.3, max: 1.5, step: 0.05, fmt: (v) => Number(v).toFixed(2) },
  { tab: 'ctl', key: 'invertY', label: 'Inverser l’axe vertical', type: 'toggle' },
  { tab: 'ctl', key: 'touchSens', label: 'Sensibilité tactile', type: 'range', min: 0.3, max: 2.5, step: 0.05, fmt: (v) => Number(v).toFixed(2) },
  { tab: 'ctl', key: 'aimAssist', label: 'Assistance à la visée (tactile et manette)', type: 'toggle' },
  { tab: 'ctl', key: 'autoFire', label: 'Tir automatique quand un ennemi est dans le viseur (tactile)', type: 'toggle' },
  { tab: 'ctl', key: 'hudScale', label: 'Taille de l’interface', type: 'range', min: 0.8, max: 1.3, step: 0.05, fmt: pct },
  { tab: 'snd', key: 'muted', label: 'Couper le son', type: 'toggle' },
  { tab: 'snd', key: 'master', label: 'Volume général', type: 'range', min: 0, max: 1, step: 0.05, fmt: pct },
  { tab: 'snd', key: 'music', label: 'Musique', type: 'range', min: 0, max: 1, step: 0.05, fmt: pct },
  { tab: 'snd', key: 'sfx', label: 'Effets sonores', type: 'range', min: 0, max: 1, step: 0.05, fmt: pct },
  { tab: 'snd', key: 'vocals', label: 'Voix du joueur quand il est touché', type: 'toggle' },
  { tab: 'play', key: 'blood', label: 'Sang et blessures', type: 'toggle' },
  { tab: 'play', key: 'crosshair', label: 'Réticule', type: 'seg', opts: [['cross', 'Croix'], ['dot', 'Point'], ['circle', 'Cercle']] },
  { tab: 'play', key: 'hints', label: 'Conseils pour débutants', type: 'toggle' },
];
