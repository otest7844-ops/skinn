# Counter Siege • Tactical 1v1 FPS

This directory contains the MIT-licensed source for **Counter Siege** by Akul
Suneesh, imported from
[akulsun/counter-siege](https://github.com/akulsun/counter-siege/tree/ddb0674cb4a622259ce11018245af7ae8cd7ebe9).
The upstream MIT license is included in `LICENSE` and copied into the browser
build. The game and map effects are generated procedurally; no third-party art
or font files are bundled.

[![Deploy to GitHub Pages](https://github.com/akulsun/counter-siege/actions/workflows/deploy.yml/badge.svg)](https://github.com/akulsun/counter-siege/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Three.js](https://img.shields.io/badge/3D-Three.js-black?logo=three.js)](https://threejs.org/)
[![Bundled with Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite)](https://vitejs.dev/)

> A high-performance, tactical 1v1 First-Person Shooter engineered completely for modern web browsers. Featuring procedural map generation, authentic recoil and spray mechanics, dynamic bot AI, procedural Web Audio synthesizer, and peer-to-peer real-time multiplayer.

**[Play Live on GitHub Pages](https://akulsun.github.io/counter-siege/)**

---

## Features

### Tactical Gunplay & Ballistics
- **Authentic Recoil & Spread**: Spray patterns, bloom expansion during continuous fire, and recovery times modeled after classic tactical shooters.
- **Procedural Viewmodel Dynamics**: Smooth weapon bobbing while sprinting, inertia sway during camera pans, and realistic aim-down-sights (ADS).
- **Iconic Arsenal**:
  - **AK-47**: High damage, heavy horizontal and vertical spray pattern requiring burst control.
  - **Desert Eagle (.50 AE)**: Devastating headshot lethality with significant kick.
  - **AWP Sniper Rifle**: Instant-kill torso/head rounds with dual-stage optical zoom vignette and blurred peripherals.
  - **Tactical Combat Knife**: High close-quarters melee damage with custom swipe animations.
- **Procedural Effects**: Real-time muzzle flashes, ejected brass cartridges, smoke wisps, bullet tracers, and surface impact sparks.

### Movement Mechanics
- **Tactical Leaning**: Peek around chokepoints and angles using `Q` and `E` without exposing full body mass.
- **Stance Control**: Crouch (`Ctrl` or `C`) to stabilize recoil spread and lower profile behind cover.
- **Momentum Physics**: Fluid WASD movement with acceleration curves, jump mechanics, and airborne inaccuracy penalties.

### Adaptive Bot AI
- Offline solo play with intelligent bot navigation.
- Dynamic angle peeking, reaction delays, spray compensation, and strategic chokepoint holds.
- Automatic routing across map objectives.

### Host-Managed Room Multiplayer
- The game has no built-in room discovery, PeerJS interface, or direct PeerJS/WebRTC connection.
- Host/guest room creation and packet delivery are provided by the embedding application.
- Player state includes position interpolation, yaw/pitch orientation, lean angles, stance, health, armor, and hit registration.

### Procedural Web Audio Engine
- Built-in procedural audio synthesizer generated entirely in real time via the **Web Audio API**.
- Zero external MP3/WAV dependencies for lightning-fast asset loading.
- Synthesized gunshots, shell casing clinks, footstep cadences, ricochets, reload clicks, and tactical radio cues.

---

## Controls

| Action | Primary Key | Secondary Key |
| :--- | :--- | :--- |
| **Move Forward / Left / Back / Right** | `W` / `A` / `S` / `D` | Arrow Keys |
| **Lean Left / Lean Right** | `Q` / `E` | — |
| **Jump** | `Space` | — |
| **Crouch** | `Left Control` | `C` (Toggle) |
| **Fire / Attack** | `Left Mouse Button` | — |
| **Aim Down Sights (ADS) / Scope** | `Right Mouse Button` | — |
| **Reload** | `R` | — |
| **Primary Weapon (AK-47 / AWP)** | `1` | — |
| **Secondary Weapon (Desert Eagle)** | `2` | — |
| **Melee (Combat Knife)** | `3` | — |
| **Pause / In-Game Menu** | `Esc` | — |

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

## Build

From the repository root, install the game's dependencies once and build its
standalone browser bundle:

```sh
npm install --prefix games/counter-siege
npm run build --prefix games/counter-siege
```

The Vite build writes the runnable iframe page to
`public/games/counter-siege/index.html`, its bundled game code to
`public/games/counter-siege/assets/index-<hash>.js`, the injected online bridge
to `public/games/counter-siege/online.js`, and the MIT `LICENSE` to
`public/games/counter-siege/LICENSE`. To run the source in Vite during
development, use `npm run dev --prefix games/counter-siege`.

## Iframe bridge protocol

The shared online component injects `/games/counter-siege/online.js` into the
same-origin iframe. Messages use the existing shared component envelope
`{ type: "counter-siege:<event>", ... }`; the frame accepts messages only from
its parent and the origin in its referrer. The bridge script translates room
events into the game's network packet handler; it does not open a transport.

**Parent to frame**

- `counter-siege:solo` starts bot solo mode.
- `counter-siege:enable` with `{ slot: 0 | 1 }` starts a room match (`slot: 0`
  is host; `slot: 1` is guest) and opens the original loadout flow.
- `counter-siege:remote-input` with `{ input: packet }` delivers the peer's game
  action packet.
- `counter-siege:state` with `{ state: packet }` delivers the peer's player
  state packet.
- `counter-siege:pause` pauses and `counter-siege:resume` resumes the local
  game.

**Frame to parent**

- `counter-siege:ready` reports protocol version and capabilities.
- `counter-siege:input` with `{ input: packet }` emits game actions such as
  loadout-ready, fire, hit, elimination, rematch, and round reset.
- `counter-siege:state` with `{ state: packet }` emits player state about 30 Hz:
  `{ type: "state", pos, yaw, pitch, lean, crouch, slot, health, armor }`.
- `counter-siege:pause` with `{ paused: boolean }` reports pointer-lock
  pause/resume; `counter-siege:leave` reports local exit.

The host room transport should store/broadcast frame `counter-siege:state`
payloads through the existing room state channel and relay `input` packets as
`counter-siege:remote-input` to the other frame. The current shared component
does not interpret the frame's `counter-siege:pause` or `counter-siege:leave`
notifications; room pause/leave remains controlled by its own controls/API.
Solo mode requires no transport.
