# React + TypeScript + Vite

## Mosswing Online

The original Mosswing WebGL game is kept at `public/games/mosswing.html`. Online
matches reuse its Three.js scene and creature model, showing both players and
their in-world nameplates together. The Socket.IO server authoritatively
simulates both flight states against one shared, seeded obstacle course and
broadcasts interpolated player positions, scores, and connection status.
Flight controls and obstacle spacing are tuned to be more forgiving, and the
game now uses a brighter sky with green gates. An eliminated player can still
watch the surviving creature fly; elimination and result screens do not blur
the game scene.

Run the app and multiplayer server in two terminals:

```sh
npm run dev
npm run server
```

## Arcade duels

Quantum Duel (Tic-Tac-Toe), Football 19, Tape-Tape Arena, Cosmic Arena
(Ping-Pong), Basketball Stars, Ball Rush 3D, and Mosswing use two-player rooms.
Football 19 compares five penalty shots per player, and Tape-Tape synchronizes
the tap race scores and server-side idle decay while each player controls only
their own lane. Ping-Pong and Basketball run
on the room host and relay the other player's controls; their snapshots are
interpolated for the remote player. Ball Rush starts both original runners with
the same course seed and exchanges interpolated player positions, scores, and
elimination status. Arcade simulations remain browser-driven rather than fully
server-authoritative, so their results are not cheat-proof. Running rounds
pause on disconnect and resume after the player reconnects. Run both commands
above for online matches; each player can create or join a six-character room
code.

Only games with actual bundled game engines can currently be played online.
The home-screen demo cards do not yet have game engines and are not online games.

Ping-Pong Arena and Basketball Stars keep their original Canvas clients and
offline modes, while online rounds use server-side fixed-step physics. Clients
send validated paddle, shot, and block inputs; neither client can publish a
score or authoritative game state for these rounds. The server broadcasts
snapshots to both players for rendering and interpolation.

For phone testing on the same Wi-Fi, open the Vite network URL shown by the dev
server. The phone must also be able to reach port `3001` on the computer running
the game server. This local setup does not make the game available between
countries.

## Public internet deployment

`render.yaml` defines a public static frontend and a separate Socket.IO server.
To create public URLs, push this project to a Git provider, then create a new
Blueprint on Render and select that repository. Render will build both services,
configure the frontend to use the server's public hostname over HTTPS/WSS, and
provide a health endpoint at `/health`. Open the static site's public URL on
both devices; the players can then join the same six-character room from
different networks.

The free server plan may sleep when idle, so its first connection can take a
little time to wake up. Public deployment has not been performed from this local
workspace; a Render account and a repository connected to Render are required
to obtain the actual public URL.

Set `PORT` to change the multiplayer server port. Run `npm run test:server` for
the physics, room lifecycle, and two-player multiplayer tests. Browser/device
testing across public networks still requires deployment; it has not been
performed from this workspace.

Mosswing and its bundled Three.js library are from
[Ayi1337/gpt6-astra-one-shot-games](https://github.com/Ayi1337/gpt6-astra-one-shot-games/tree/main/mosswing).

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
