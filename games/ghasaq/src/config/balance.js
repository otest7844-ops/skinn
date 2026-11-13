/*
 * Game balance in one place. Tweak numbers here; no other file needs to change.
 * Distances are metres, times are seconds, damage is hit points (enemies have 100, heavies 260).
 */

export const PLAYER = {
  hp: 100, armor: 50,
  walk: 4.6, sprint: 7.1, crouch: 2.1, adsMove: 0.65,
  jump: 6.0, gravity: 18,   // a 1 m hop; crates and low walls up to 1.6 m are climbed or vaulted (jump + forward)
  stamina: 100, staminaDrain: 24, staminaRegen: 16, staminaDelay: 0.9,
  regenDelay: 5, regenRate: 9, regenStep: 25,   // heals back to the next 25-point segment
  armorAbsorb: 0.5,
};

/*
 * Weapons. Each one owns a niche: the rifle is the all-rounder, the SMG shreds up close and while
 * moving, the shotgun one-shots inside a room, the DMR drops a raider with two body shots (one to the
 * head) at any range and ignores armour, and the pistol is a fast, accurate sidearm (3 body shots).
 * zoom = FOV multiplier when aiming, bloom = spread added per round of sustained fire,
 * adsSpeed = how quickly the sight comes up, ap = full damage against armour plates.
 */
export const WEAPONS = {
  rifle: {
    name: 'Faucon', full: 'Fusil d’assaut « Faucon »', cls: 'Fusil d’assaut', slot: 'primary', rank: 0, mode: 'Automatique',
    auto: true, rpm: 640, dmg: 34, mag: 30, reserve: 120, reserveMax: 180, reload: 2.1, reloadEmpty: 2.6,
    spread: 0.009, moveSpread: 0.045, jumpSpread: 0.12, adsSpread: 0.0012, recoilV: 0.016, recoilH: 0.006, bloom: 0.0022,
    zoom: 0.6, adsSpeed: 14, impulse: 75, falloff: [40, 100, 0.7], pen: 0.5, mobility: 1, sight: 'dot',
  },
  smg: {
    name: 'Tourbillon', full: 'Pistolet-mitrailleur « Tourbillon »', cls: 'Pistolet-mitrailleur', slot: 'primary', rank: 2, mode: 'Automatique',
    auto: true, rpm: 880, dmg: 29, mag: 32, reserve: 160, reserveMax: 224, reload: 1.7, reloadEmpty: 2.05,
    spread: 0.006, moveSpread: 0.012, jumpSpread: 0.06, adsSpread: 0.0024, recoilV: 0.0085, recoilH: 0.0055, bloom: 0.0012,
    zoom: 0.72, adsSpeed: 19, impulse: 60, falloff: [22, 55, 0.6], pen: 0.35, mobility: 1.12, sight: 'dot',
  },
  shotgun: {
    name: 'Faucon', full: 'Fusil à pompe « Faucon »', cls: 'Fusil à pompe', slot: 'primary', rank: 3, mode: 'À pompe',
    auto: false, pump: 0.5, rpm: 85, dmg: 21, pellets: 9, mag: 7, reserve: 35, reserveMax: 49, shellTime: 0.44,
    spread: 0.042, moveSpread: 0.012, jumpSpread: 0.04, adsSpread: 0.029, recoilV: 0.05, recoilH: 0.012, bloom: 0,
    zoom: 0.8, adsSpeed: 15, impulse: 70, falloff: [11, 32, 0.3], pen: 0, mobility: 0.97, sight: 'iron',
  },
  dmr: {
    name: 'Arbalète', full: 'Fusil de précision « Arbalète »', cls: 'Fusil de précision', slot: 'primary', rank: 5, mode: 'Coup par coup',
    auto: false, rpm: 230, dmg: 92, mag: 12, reserve: 48, reserveMax: 72, reload: 2.2, reloadEmpty: 2.7,
    spread: 0.016, moveSpread: 0.055, jumpSpread: 0.15, adsSpread: 0.0002, recoilV: 0.036, recoilH: 0.008, bloom: 0,
    zoom: 0.22, adsSpeed: 11, impulse: 140, falloff: null, pen: 0.75, ap: true, mobility: 0.92, sight: 'scope',
  },
  pistol: {
    name: 'Tigre', full: 'Pistolet « Tigre »', cls: 'Pistolet', slot: 'secondary', rank: 0, mode: 'Coup par coup',
    auto: false, rpm: 450, dmg: 38, mag: 15, reserve: 60, reserveMax: 105, reload: 1.3, reloadEmpty: 1.6,
    spread: 0.007, moveSpread: 0.022, jumpSpread: 0.07, adsSpread: 0.0025, recoilV: 0.024, recoilH: 0.008, bloom: 0.003,
    zoom: 0.8, adsSpeed: 19, impulse: 60, falloff: [25, 55, 0.65], pen: 0.2, mobility: 1.1, sight: 'iron',
  },
};
export const PRIMARIES = ['rifle', 'smg', 'shotgun', 'dmr'];

export const GRENADE = { fuse: 3.0, radius: 7.5, damage: 175, carry: 2, max: 3 };

/* Knife: a quick stab in a cone in front of the player. From behind it always kills. */
export const MELEE = { range: 2.2, cone: 0.75, dmg: 150, duration: 0.5, hitAt: 0.16 };

export const ENEMY = {
  raider: { hp: 100, speed: 3.9, dmg: 10, burst: [3, 5], rof: 0.13, headMul: 4 },
  heavy: { hp: 260, speed: 2.7, dmg: 8, burst: [5, 8], rof: 0.09, headMul: 2.2, torsoMul: 0.8 },
  sniper: { hp: 90, charge: 2.3, dmg: 46, cooldown: 3.6, range: 130 },
  grenadier: { cooldown: [10, 15], range: [8, 32] },
};

export const ALLY = { hp: 160, dmg: 25, regen: 4, burst: [3, 5], rof: 0.12, spread: 0.017 };

/*
 * Difficulty. dmg/spread/react scale the raiders' marksmanship; ai is their tactical profile:
 * fov (degrees they watch), notice (seconds to recognise a target in plain view at 20 m),
 * hear (metres at which gunfire carries), flank/flankers (chance to circle round, and how many at
 * once), nade (chance a rifleman carries a grenade) and nadeGap (seconds between squad grenades),
 * heal (field dressings per man), cover (how reliably they get out of the open), peek (seconds
 * exposed per peek), relocate (peeks before changing cover), settle (how fast their aim tightens),
 * runGun (fire while moving), preaim (watch the last known position), hop (dodge hops),
 * push (bound forward cover to cover), strafe, snipe (sniper charge-time factor), intel (seconds for
 * a sighting to reach the whole squad).
 */
export const DIFFICULTY = {
  recruit: {
    name: 'Recrue', desc: 'Les ennemis réagissent plus lentement et tirent moins juste. Ils contournent rarement vos positions et lancent peu de grenades. Idéal pour apprendre.', xpMul: 0.75, dmg: 0.6, spread: 1.35, react: 1.3, count: 0.8, regen: true,
    ai: { fov: 130, notice: 0.95, hear: 26, flank: 0.12, flankers: 1, nade: 0.2, nadeGap: 16, heal: 0, cover: 0.55, peek: [1.8, 3.2], relocate: 4, settle: 0.8, runGun: false, preaim: 0.25, hop: 0, push: 0.3, strafe: 0.5, snipe: 1.2, intel: 3.5 },
  },
  veteran: {
    name: 'Vétéran', desc: 'Des ennemis tactiques qui se déplacent de couvert en couvert, vous prennent à revers pendant que leurs alliés vous distraient et lancent des grenades contre les défenseurs retranchés.', xpMul: 1, dmg: 1, spread: 0.9, react: 0.85, count: 1, regen: true,
    ai: { fov: 160, notice: 0.45, hear: 42, flank: 0.55, flankers: 2, nade: 0.75, nadeGap: 6, heal: 1, cover: 0.92, peek: [1.1, 2.2], relocate: 3, settle: 1.7, runGun: true, preaim: 0.85, hop: 0.2, push: 0.6, strafe: 0.9, snipe: 0.95, intel: 1.2 },
  },
  legend: {
    name: 'Légende', desc: 'Les ennemis sont plus nombreux, précis et coordonnés. Ils ne vous lâchent jamais et votre santé ne se régénère pas.', xpMul: 1.6, dmg: 1.4, spread: 0.75, react: 0.62, count: 1.25, regen: false,
    ai: { fov: 190, notice: 0.28, hear: 56, flank: 0.7, flankers: 3, nade: 0.95, nadeGap: 4, heal: 2, cover: 1, peek: [0.9, 1.8], relocate: 2, settle: 2.6, runGun: true, preaim: 1, hop: 0.35, push: 0.75, strafe: 1, snipe: 0.8, intel: 0.6 },
  },
};

export const MODES = {
  dusk: { name: 'Opération Ghasaq', tag: '8 heures · survie', desc: 'Tenez de la fin d’après-midi jusqu’à minuit. Huit vagues, une par heure.', rank: 0 },
  dawn: { name: 'Jusqu’à l’aube', tag: 'Survie sans fin', desc: 'Les vagues continuent après minuit, jusqu’à l’aube et au-delà.', rank: 1 },
};

/* Campaign waves: hour, count, max alive, and the share of each enemy type. */
export const DUSK_WAVES = [
  { h: 16, n: 4, max: 3, heavy: 0, night: 0, gren: 0, snipers: 0, heli: false, title: 'Fin d’après-midi' },
  { h: 17, n: 6, max: 4, heavy: 0, night: 0, gren: 0, snipers: 0, heli: false, title: 'Avant le coucher du soleil' },
  { h: 18, n: 7, max: 4, heavy: 0.12, night: 0, gren: 0.1, snipers: 1, heli: false, title: 'Coucher du soleil' },
  { h: 19, n: 8, max: 5, heavy: 0.15, night: 0.4, gren: 0.18, snipers: 0, heli: false, title: 'Crépuscule' },
  { h: 20, n: 10, max: 5, heavy: 0.2, night: 0.7, gren: 0.2, snipers: 1, heli: true, title: 'Début de nuit' },
  { h: 21, n: 10, max: 6, heavy: 0.25, night: 0.9, gren: 0.22, snipers: 0, heli: false, title: 'Nuit noire' },
  { h: 22, n: 11, max: 6, heavy: 0.3, night: 1, gren: 0.25, snipers: 2, heli: false, title: 'Calme nocturne' },
  { h: 23, n: 14, max: 7, heavy: 0.35, night: 1, gren: 0.25, snipers: 1, heli: true, title: 'Dernière heure' },
];
const HOUR_TITLES = {
  0: 'Minuit', 1: 'Pleine nuit', 2: 'Pleine nuit', 3: 'Fin de nuit', 4: 'Fin de nuit', 5: 'Avant l’aube',
  6: 'Aube', 7: 'Lever du soleil', 8: 'Matinée', 9: 'Matinée', 10: 'Matinée', 11: 'Fin de matinée', 12: 'Midi', 13: 'Midi',
  14: 'Après-midi', 15: 'Fin d’après-midi', 16: 'Fin d’après-midi', 17: 'Avant le coucher du soleil', 18: 'Coucher du soleil', 19: 'Crépuscule', 20: 'Début de nuit',
  21: 'Nuit noire', 22: 'Calme nocturne', 23: 'Dernière heure',
};
/** Wave definition for index i (0-based). Past the campaign it keeps escalating. */
export function waveDef(i) {
  if (i < DUSK_WAVES.length) return { ...DUSK_WAVES[i], index: i };
  const k = i - DUSK_WAVES.length + 1;
  const h = 16 + i, hod = h % 24;
  const dark = hod >= 19 || hod < 6;
  return {
    index: i, h, n: Math.min(32, 14 + k * 2), max: Math.min(10, 7 + Math.floor(k / 2)),
    heavy: Math.min(0.45, 0.35 + k * 0.02), night: dark ? 1 : 0, gren: 0.28,
    snipers: 1 + (k % 3 === 0 ? 1 : 0), heli: k % 3 === 1, title: HOUR_TITLES[hod],
  };
}
/** Raider aim and pacing tighten with every wave. */
export const waveSkill = (i) => ({
  spread: Math.max(0.018, 0.036 - i * 0.0017),
  react: Math.max(0.55, 1.2 - i * 0.06),
  pause: Math.max(0.65, 1.2 - i * 0.05),
  dmg: Math.min(1.35, 0.85 + i * 0.045),
});

export const SUPPORTS = [
  { id: 'uav', name: 'Drone de reconnaissance', short: 'Reconnaissance', key: '3', cost: 350, cd: 45, dur: 35, desc: 'Survole le champ de bataille et révèle les positions ennemies pendant 35 secondes.' },
  { id: 'supply', name: 'Ravitaillement', short: 'Ravitaillement', key: '4', cost: 450, cd: 60, desc: 'Un avion largue un conteneur de munitions, d’armure et de grenades, avec une arme bonus à récupérer avec E.' },
  { id: 'ally', name: 'Renfort allié', short: 'Renfort', key: '5', cost: 800, cd: 90, desc: 'Un soldat parachuté combat à vos côtés. Deux alliés maximum ; le second coûte plus cher.' },
  { id: 'strike', name: 'Frappe aérienne', short: 'Frappe', key: '6', cost: 1100, cd: 100, desc: 'Désignez une cible au laser : un avion larguera cinq bombes.' },
];

export const SCORE = {
  kill: 100, headshot: 50, longshot: 40, explosive: 50, barrel: 75, multi: 50, allyAssist: 50, melee: 100, backstab: 60,
  heli: 1000, waveBase: 300, wavePer: 100, flawless: 250, victory: 3000,
};

/* Rank ladder: name, XP needed, insignia [type, count]. */
export const RANKS = [
  ['Soldat', 0, 'chev', 0], ['Soldat de première classe', 1200, 'chev', 1], ['Caporal', 3000, 'chev', 2], ['Sergent', 6000, 'chev', 3],
  ['Sergent-chef', 10000, 'chev', 4], ['Sous-lieutenant', 15000, 'star', 1], ['Lieutenant', 22000, 'star', 2], ['Capitaine', 30000, 'star', 3],
  ['Commandant', 40000, 'eagle', 0], ['Lieutenant-colonel', 55000, 'eagle', 1], ['Colonel', 75000, 'eagle', 2], ['Général de brigade', 100000, 'eagle', 3],
  ['Général de division', 140000, 'sword', 0],
].map(([name, xp, type, n]) => ({ name, xp, type, n }));

export const SKINS = [
  { id: 'std', name: 'Standard', rank: 0 },
  { id: 'tiger', name: 'Tigre du désert', rank: 1 },
  { id: 'night', name: 'Opérations nocturnes', rank: 3 },
  { id: 'gold', name: 'Doré', rank: 6 },
];

/* Allies: at most two at once; each extra one costs more, so support never becomes an army. */
export const ALLY_ROSTER = ['Sergent Salem', 'Caporal Fahd'];
export const ALLY_MAX = 2;
export const allyCost = (alive) => 800 + alive * 600;

export const MAPS = {
  citadel: {
    name: 'Citadelle des sables', desc: 'Une forteresse ceinte de murs, avec trois portes, une brèche à l’est, une place avec fontaine et un souk couvert. Combats à moyenne portée.', traits: ['Moyenne portée', '3 portes et une brèche', '4 nids de tireurs'],
    note: 'Les ennemis se regroupent sous leurs bannières rouges devant les trois portes et la brèche orientale. Les cercles jaunes indiquent les nids des tireurs sur les quatre tours. Un escalier mène au toit du poste de garde de la porte nord.',
  },
  village: {
    name: 'Village abandonné', desc: 'Ruelles étroites, maisons en ruine, palmeraie et vieux cimetière. Combats rapprochés et surprises à chaque détour.', traits: ['Courte portée', '8 accès', 'Toit accessible'],
    note: 'Les ennemis s’infiltrent par les quatre entrées et les brèches du mur. Nids de tireurs : minaret, château d’eau, tour de guet et toit de la ferme. Un escalier extérieur mène à un toit dominant la rue est.',
  },
  station: {
    name: 'Gare de la vallée', desc: 'Une gare abandonnée dans le désert : quais, wagons de marchandises, entrepôt où combattre et tour d’horloge dominant les environs.', traits: ['Portées variées', 'Wagons', 'Entrepôt fermé'],
    note: 'Les ennemis arrivent par les entrées routières au nord et au sud, le long des voies à l’est et à l’ouest, et par deux brèches. Nids de tireurs : tour d’horloge, poste d’aiguillage, château d’eau et toit de l’entrepôt.',
  },
};

export const MEDALS = [
  { id: 'first', name: 'Premier sang', desc: 'Éliminez votre premier ennemi.', xp: 100 },
  { id: 'hs25', name: 'Œil de faucon', desc: 'Réalisez 25 tirs à la tête en une partie.', xp: 800 },
  { id: 'h20', name: 'Tenace', desc: 'Tenez jusqu’à 20 h.', xp: 500 },
  { id: 'win', name: 'Sentinelle de minuit', desc: 'Tenez jusqu’à minuit.', xp: 2000 },
  { id: 'legend', name: 'Légende du crépuscule', desc: 'Remportez une partie en difficulté Légende.', xp: 5000 },
  { id: 'tri', name: 'Triple élimination', desc: 'Éliminez trois ennemis avec une seule explosion.', xp: 600 },
  { id: 'barrels', name: 'Piège explosif', desc: 'Éliminez dix ennemis avec des barils explosifs au total.', xp: 700 },
  { id: 'longshot', name: 'Tir lointain', desc: 'Éliminez un ennemi à 60 mètres.', xp: 500 },
  { id: 'heli', name: 'Chasseur d’hélicoptères', desc: 'Abattez un hélicoptère ennemi.', xp: 1500 },
  { id: 'flawless', name: 'Intact', desc: 'Terminez une vague sans subir de dégâts.', xp: 400 },
  { id: 'commander', name: 'Chef de l’appui', desc: 'Utilisez les quatre types d’appui en une partie.', xp: 800 },
  { id: 'buddy', name: 'Frère d’armes', desc: 'Votre allié élimine cinq ennemis en une partie.', xp: 600 },
  { id: 'dawn', name: 'Jusqu’à l’aube', desc: 'Tenez jusqu’à 5 h en mode Jusqu’à l’aube.', xp: 4000 },
  { id: 'focus5', name: 'Temps suspendu', desc: 'Éliminez cinq ennemis pendant une activation de concentration.', xp: 700 },
];

export const FOCUS = { min: 30, start: 35, drain: 17, timeScale: 0.32, playerScale: 0.8, killGain: 12, headGain: 28, explosiveGain: 6, multiGain: 10 };
