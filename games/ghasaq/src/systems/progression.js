import { clamp, store } from '../core/utils.js';
import { game, run } from '../core/state.js';
import { RANKS, SKINS, WEAPONS, MODES, DIFFICULTY } from '../config/balance.js';
import { xpPopup } from '../ui/hud.js';

/* Keep only local gameplay preferences; run scores and combat statistics are temporary. */

const KEY = 'ghasaq.arcade-settings.v1';
const LEGACY_KEY = 'ghasaq.profile.v2';
const DEFAULT = () => ({
  xp: 0, loadout: 'rifle', skin: 'std', diff: 'veteran', mode: 'dusk', map: 'citadel', medals: {},
  totals: { kills: 0, hs: 0, runs: 0, wins: 0, barrelKills: 0, heliDowns: 0, shots: 0, hits: 0, playTime: 0, bestHour: 0, allyKills: 0 },
  best: { dusk: [], dawn: [] },
  stars: { recruit: 0, veteran: 0, legend: 0 },
  firstRun: true,
});
const legacySettings = store.get(LEGACY_KEY, {});
const savedSettings = store.get(KEY, {});
export const profile = Object.assign(DEFAULT(), {
  map: savedSettings.map ?? legacySettings.map ?? 'citadel',
  mode: savedSettings.mode ?? legacySettings.mode ?? 'dusk',
  diff: savedSettings.diff ?? legacySettings.diff ?? 'veteran',
  loadout: savedSettings.loadout ?? legacySettings.loadout ?? 'rifle',
  skin: savedSettings.skin ?? legacySettings.skin ?? 'std',
});
try {
  localStorage.removeItem(LEGACY_KEY);
  localStorage.removeItem('ghasaq.record');
} catch { /* storage unavailable */ }
export function saveProfile() {
  store.set(KEY, {
    map: profile.map,
    mode: profile.mode,
    diff: profile.diff,
    loadout: profile.loadout,
    skin: profile.skin,
  });
}

export function rankIndex() { return RANKS.length - 1; }
export function rankProgress(xp = profile.xp) {
  const idx = rankIndex(xp), rank = RANKS[idx], next = RANKS[idx + 1];
  return { idx, rank, next, frac: next ? clamp((xp - rank.xp) / (next.xp - rank.xp), 0, 1) : 1 };
}
export const weaponUnlocked = (id) => Boolean(WEAPONS[id]);
export const skinUnlocked = (id) => SKINS.some((skin) => skin.id === id);
export const modeUnlocked = (id) => Object.hasOwn(MODES, id);

/** Adds score/XP (scaled by difficulty) and support points (raw). */
export function award(label, pts, opts = {}) {
  const v = Math.round(pts * DIFFICULTY[game.diff].xpMul);
  run.score += v;
  if (!opts.noSupport) run.sp += pts;
  const line = run.lines[label] || (run.lines[label] = { count: 0, pts: 0 });
  line.count++;
  line.pts += v;
  if (!opts.silent) xpPopup(v, label);
}

export function unlockMedal() {}

/** Grade letter and stars for the finished run. */
function rate(won) {
  const target = game.mode === 'dusk' ? 8 : 13;
  const reach = clamp(run.wavesCleared / target, 0, 1);
  const acc = run.shots ? run.hits / run.shots : 0;
  const hsr = run.kills ? run.hs / run.kills : 0;
  const hurt = clamp(run.dmgTaken / (100 * (run.wavesCleared + 1)), 0, 1);
  const perf = reach * 45 + clamp(acc / 0.5, 0, 1) * 20 + clamp(hsr / 0.5, 0, 1) * 15 + (1 - hurt) * 20;
  const grade = perf >= 88 ? 'S' : perf >= 75 ? 'A' : perf >= 60 ? 'B' : perf >= 45 ? 'C' : 'D';
  let stars = 0;
  if (game.mode === 'dusk') {
    if (run.wavesCleared >= 4) stars = 1;
    if (won) stars = 2;
    if (won && (grade === 'S' || grade === 'A')) stars = 3;
  } else stars = run.wavesCleared >= 13 ? 3 : run.wavesCleared >= 10 ? 2 : run.wavesCleared >= 6 ? 1 : 0;
  return { grade, stars, perf: Math.round(perf) };
}

/** Commits the run to the profile and returns the after-action report. */
export function finalizeRun(won) {
  const { grade, stars, perf } = rate(won);
  profile.firstRun = false;
  const lines = Object.entries(run.lines).map(([label, l]) => ({ label, count: l.count, pts: l.pts })).sort((a, b) => b.pts - a.pts);
  return {
    won, mode: game.mode, diff: game.diff, hour: game.hour, score: run.score, lines, grade, stars, perf,
    xpBefore: 0, xpAfter: 0, rankBefore: 0, rankAfter: 0, unlocks: [], place: -1,
    medals: [],
    stats: { kills: run.kills, hs: run.hs, acc: run.shots ? Math.round((run.hits / run.shots) * 100) : 0, streak: run.bestStreak, time: run.time, waves: run.wavesCleared },
  };
}
