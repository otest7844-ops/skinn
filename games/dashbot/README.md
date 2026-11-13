# DashBot browser bundle

This directory contains Jianong He's MIT-licensed DashBot source, adapted to
run as a self-contained iframe game. The original simulation, interface, and
licensed art/audio are retained. The game's WebSocket server and online lobby
have been removed; room creation and transport belong to the shared host.

Upstream: <https://github.com/jianongHe/DashBot>  
Imported revision: `109fcfd99f58fc8888b5f4a2ed507363448603aa`  
Copyright (c) 2025 Jianong He. See [LICENSE](LICENSE).

## Build

From the repository root:

```powershell
npm ci --prefix games/dashbot
npm run build --prefix games/dashbot
```

Vite writes the complete static bundle, including `online.js`, `LICENSE`, and
`ATTRIBUTION.txt`, to `public/games/dashbot/`. Serve `/games/dashbot/index.html` and load
`/games/dashbot/online.js` into the same-origin iframe. Relative asset URLs keep
the game self-contained; it does not fetch hosted assets or connect to its own
WebSocket service.

## Shared iframe protocol

The bridge follows the shared `ArcadeOnline` envelope:
`{ type: 'dashbot:<event>', ...payload }`. The injected
`public/games/dashbot/online.js` validates messages from the same-origin parent
and dispatches accepted events as `dashbot:bridge-message` custom events for
the game. Outgoing messages use `window.parent.postMessage` and the origin
derived from `document.referrer`.

### Parent → iframe

| Message | Payload | Meaning |
| --- | --- | --- |
| `dashbot:solo` | none | Starts local two-player DashBot. |
| `dashbot:local` | none | Same local two-player mode. |
| `dashbot:enable` | `{ slot: 0 \| 1, ... }` | Starts a room match. Slot 0 is host/player 1; slot 1 is guest/player 2. |
| `dashbot:remote-input` | `{ slot, input }` | Delivers the other player's input packet; `slot` is 0 or 1. |
| `dashbot:state` | `{ state }` | Delivers the host's authoritative state packet. Guests apply it; the host ignores its echoed state. |
| `dashbot:pause` / `dashbot:resume` | none | Pauses or resumes the game. |
| `dashbot:leave` | none | Optional host notification to return the frame to its start screen. |

### Iframe → parent

| Message | Payload | Meaning |
| --- | --- | --- |
| `dashbot:ready` | `{ protocol: 1, capabilities: ['solo', 'room', 'action', 'sync', 'pause', 'leave'] }` | Sent once after game initialization. |
| `dashbot:input` | `{ input }` | Player action packet, forwarded by the room service to the other frame. Charge packets have `type: 'charge_start'` or `type: 'charge_release'`, `playerId` (1 or 2), and their action data. The game-over button emits `type: 'rematch_request'`. |
| `dashbot:state` | `{ state }` | Host snapshot sent about every 50 ms; relay it through the room state channel. |
| `dashbot:pause` | `{ paused: boolean }` | Local pause-state notification. |
| `dashbot:leave` | none | Optional notification when leaving from inside the frame. The shared component's own room controls remain authoritative. |

The state packet is `{ type: 'state', sequence, status, gameOver, winner,
elapsedMs, safeZoneRadius, players }`. `players` contains both
`{ id, x, y, angle, hp, dashVelX, dashVelY, isDashing }` records. Only the host
publishes state; forward it unchanged to the guest as `dashbot:state`. Route
each `dashbot:input` to the other slot, not back to its sender. Verify
`event.source === iframe.contentWindow` and the expected origin in the parent.

The shared host provides matchmaking, room lifecycle, and transport. Solo play
requires no transport or injected lobby UI.
The host remains responsible for ending a room and handling `rematch_request`;
DashBot publishes `status: 'finished'` in its final state but does not own those
room lifecycle transitions.
