<p align="center">
  <img src="docs/images/emblem.svg" alt="Ghasaq emblem" width="120" />
</p>

<h1 align="center">Ghasaq</h1>

<p align="center">
  <b>Tenez la forteresse de 16 h à minuit.</b><br />
  Un jeu de survie et de tir à la première personne, directement dans votre navigateur.<br />
  Réalisé avec Three.js, cannon-es et Vite. Textures, modèles et sons sont générés par le code.
</p>

<p align="center">
  <a href="https://ghasaq-game.netlify.app/"><img src="https://img.shields.io/badge/%E2%96%B6%20Jouer%20maintenant-ghasaq--game.netlify.app-ff8a3d?style=for-the-badge" alt="Jouer à Ghasaq" /></a>
</p>

<p align="center">
  <a href="https://github.com/aymansalkhatib/ghasaq/actions/workflows/build.yml"><img src="https://github.com/aymansalkhatib/ghasaq/actions/workflows/build.yml/badge.svg" alt="Build Status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <img src="docs/images/hero.jpg" alt="Ghasaq en jeu : défense de la cour de la citadelle en fin d’après-midi" width="900" />
</p>

---

## About

Ghasaq (qui signifie « crépuscule » en arabe) est un jeu de survie à vagues. Avec votre escouade, défendez une position dans le désert au coucher du soleil : une nouvelle vague d’ennemis attaque chaque heure de jeu, de 16 h à minuit, tandis que la nuit rend les combats plus difficiles et transforme la lumière comme la musique.

Le jeu est entièrement en français et utilise une mise en page de gauche à droite, des menus aux communications radio. Aucune installation ni ressource graphique ou audio à télécharger : le projet ne contient **aucun fichier image ou son**. Les textures sont dessinées sur des canevas, les modèles sont assemblés à partir de formes primitives et les effets sonores ainsi que la musique sont synthétisés avec l’API Web Audio.

## Features

- **Huit vagues, une soirée.** Défendez la position de 16 h à minuit dans *Opération Ghasaq*, ou jouez à *Jusqu’à l’aube*, sans fin. Trois difficultés : Recrue, Vétéran et Légende.
- **Des ennemis tactiques.** Ils courent d’un abri à l’autre, tirent depuis leur couvert, vous contournent pendant que leurs alliés vous clouent sur place, lancent des grenades et entendent vos pas comme vos tirs. Les tireurs d’élite se signalent par un reflet avant de tirer ; les hélicoptères déposent des escouades. En difficulté Légende, les ennemis sont rapides et précis.
- **Trois cartes**, avec des accès, des nids de tireurs et une enceinte pour les ravitaillements : *Citadelle des sables*, *Village abandonné* et *Gare de la vallée*.
- **Cinq armes** avec hausse, viseur point rouge ou lunette (fusil d’assaut, pistolet-mitrailleur, fusil à pompe, fusil de précision et pistolet), ainsi qu’un couteau, des grenades armables, l’escalade et le franchissement.
- **Appui aérien et alliés.** Gagnez des points en éliminant les ennemis et dépensez-les pour un drone de reconnaissance, un conteneur parachuté, un renfort ou une frappe aérienne sur une cible désignée au laser.
- **Concentration.** Les éliminations et tirs à la tête remplissent la jauge ; appuyez sur `Q` pour ralentir le temps quelques secondes tout en restant rapide.
- **Un cycle jour-nuit complet.** La lumière de l’après-midi laisse place au crépuscule et aux étoiles. La nuit, votre lampe (`F`) éclaire votre chemin ; les tempêtes de sable aveuglent tous les combattants.
- **Audio dynamique.** La musique (inspirée du maqâm Hijaz) suit l’intensité du combat avec des accents lors des contacts, assauts et replis. Vous entendez vos blessures et votre cœur battre sous 50 PV. Les échanges radio et les dialogues de l’escouade sont affichés, jamais lus à voix haute.
- **Progression.** 13 grades, 14 médailles, des ordres quotidiens et un dossier militaire, sauvegardés dans le navigateur.
- **Clavier et souris, manette et tactile.** Les commandes tactiles apparaissent automatiquement sur les téléphones et tablettes.

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/images/night.jpg" alt="La citadelle de nuit, éclairée par la lampe de l’arme" /><br /><sub>La citadelle la nuit : réverbères, étoiles et lampe de l’arme</sub></td>
    <td width="50%"><img src="docs/images/village.jpg" alt="Un ennemi près du puits du village" /><br /><sub>Village abandonné : un ennemi près du puits</sub></td>
  </tr>
  <tr>
    <td><img src="docs/images/briefing.jpg" alt="Briefing de mission avec vue aérienne en direct de la carte" /><br /><sub>Briefing : aperçu aérien de la carte, de la mission et de la difficulté choisies</sub></td>
    <td><img src="docs/images/menu.jpg" alt="Menu principal devant la citadelle en direct" /><br /><sub>Menu principal devant la scène, avec le grade et les ordres du jour</sub></td>
  </tr>
</table>

## Getting started

You need **Node.js 18 or newer**.

```bash
npm install
npm run dev        # opens http://localhost:5173
```

On Windows you can also double-click `start.bat` (installs the packages on the first run, then starts the game) or `start-mobile.bat` (serves the game on your local network so you can open it from a phone on the same Wi-Fi: open the *Network* address it prints and rotate the phone to landscape).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run dev:mobile` | Same, but reachable from other devices on your network |
| `npm run build` | Production build in `dist/`, ready for any static host |
| `npm run build:single` | The whole game as one self-contained file, `dist-single/ghasaq.html` (open it directly or send it as is) |
| `npm run preview` | Serves the production build from `dist/` |
| `npm test` | Runs the production build integrity check |

### Standalone Single-File Game

Run `npm run build:single` to bundle the entire game into **`dist-single/ghasaq.html`** (~1 MB). All scripts, styles, procedural textures, 3D models, and synthesized Web Audio sound effects are completely contained within this one file. You can double-click and play it offline in any modern browser without needing a web server.

## Controls

| Keyboard and mouse | Action |
| --- | --- |
| `W` `A` `S` `D` | Move |
| `Shift` | Sprint; hold your breath while aiming through a scope |
| `C` | Crouch (steadies your aim) |
| `Space` | Jump; toward a crate or ledge (up to about 1.5 m) it climbs |
| Left / right mouse button | Fire / aim down sights |
| `R` | Reload |
| `1` `2` / mouse wheel | Switch weapon |
| `E` | Take the weapon shown above a supply crate |
| Hold `G` | Cook a grenade, release to throw |
| `V` | Knife (always lethal from behind) |
| `Q` | Focus: slow time down |
| `F` | Weapon light |
| `3` `4` `5` `6` | Recon · supply drop · ally · airstrike |
| `Tab` | Tactical map |
| `Esc` / `P` | Pause |

A gamepad works out of the box, and touch players get an on-screen layout (virtual stick on the left, look on the right, drag on the fire button to aim while shooting). The in-game **Guide** lists every control.

## Project structure

```
ghasaq/
├─ index.html              All screens and the HUD markup
├─ vite.config.js          Build configuration
├─ start.bat, start-mobile.bat   Windows launchers
├─ scripts/build-single.mjs      Builds the one-file version
├─ docs/images/            README images
└─ src/
   ├─ main.js              Entry point: loading, wiring buttons to actions
   ├─ config/              The numbers that drive the game
   │  ├─ balance.js        Weapons, enemies, difficulties, waves, support, ranks, medals, maps
   │  └─ settings.js       Player settings and their defaults
   ├─ core/                Renderer, sky and time of day, physics, main loop, shared state
   ├─ world/               Map loader, one file per map (maps/), building pieces, collision,
   │                       navigation grid, physics props, ambient lights, flags and birds
   ├─ entities/            Player, raiders and their AI, allies, the soldier model and animation, ragdolls
   ├─ weapons/             Weapons, their first-person models, grenades
   ├─ vehicles/            Aircraft, the helicopter, parachutes, the supply crate
   ├─ systems/             Waves, air support, pickups, focus, progression, daily challenges, tension
   ├─ fx/                  Particles, explosions, bullet marks, blood, weather, the weapon light
   ├─ audio/               Sound effects, music, heartbeat, pain sounds, radio
   ├─ ui/                  HUD, screens and menus, aerial map previews, armory, touch controls
   ├─ input/               Keyboard and mouse, gamepad
   ├─ styles/              CSS
   └─ dev/autotest.js      Ready-made test scenes (developer tool)
```

## Tuning and extending

| To change | Open |
| --- | --- |
| A weapon's damage, fire rate or ammo | `src/config/balance.js` → `WEAPONS` |
| How hard the raiders are | `src/config/balance.js` → `ENEMY`, `DIFFICULTY`, `waveDef` |
| Cost or duration of air support | `src/config/balance.js` → `SUPPORTS` |
| A map (buildings, cover, entry points, sniper nests) | `src/world/maps/citadel.js`, `village.js` or `station.js` |
| Add a map | Copy a file in `src/world/maps/`, register it in `MAP_DEFS` in `src/world/map.js`, and add its name and description to `MAPS` in `balance.js` |
| Menu text | `index.html` and `src/ui/screens.js` |
| Colours and fonts | `src/styles/base.css` (variables at the top) |
| Default volume | `src/config/settings.js` → `DEFAULTS` |

Each map describes where raiders enter (`spawns`), where the helicopter hovers (`hover`), the sniper nests (`snipers`), your start position (`start`) and the walled interior (`interior`) where supply crates may land, so a crate never falls outside the walls.

## Testing

Append `#autotest-<name>` to the address to jump straight into a ready-made scene, for example `#autotest-combat`, `#autotest-village` or `#autotest-torch-citadel`. Prefix it with `touch-` (`#touch-autotest-combat`) to try the touch layout on a desktop browser. The scenes are listed at the top of `src/dev/autotest.js`.

`#autotest-droptest` runs 400 supply drops from random positions on every map and prints the result to the console. It must report `bad=0`.


## Tech

- [Three.js](https://threejs.org) r170 for rendering, [cannon-es](https://pmndrs.github.io/cannon-es/) for physics, [Vite](https://vitejs.dev) for development and bundling.
- Plain JavaScript modules, no framework. Two runtime dependencies.
- Web Audio synthesis for every sound, including the music.
- The raiders are a fictional invading faction.

## Credits and licenses

- **Code**: Released under the [MIT License](LICENSE).
- **Core libraries**: [Three.js](https://threejs.org) (MIT) and [cannon-es](https://pmndrs.github.io/cannon-es/) (MIT).
- **Typography**: [Changa](https://fonts.google.com/specimen/Changa), [IBM Plex Sans Arabic](https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic), and [Oswald](https://fonts.google.com/specimen/Oswald) are distributed under the [SIL Open Font License 1.1](https://openfontlicense.org/).
- **Artwork and audio**: 100% procedurally generated in code — zero external image, model, or audio files.
