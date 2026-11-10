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

Quantum Duel (Tic-Tac-Toe), Football 19, Tape-Tape Arena, Mémo 5×5, Chasse aux mots, Dictée Éclair, Ping-Pong,
Basketball Stars, Ball Rush 3D, Pont de la forêt 3D, Le Labyrinthe des Damnés,
La Course vers la Princesse, Grotte aux Couteaux, Colonnes du Canyon, Arène
Hélice, Duel de Troncs, Échecs 3D, Embuscade, Moto Taxi Afrique, Chemin de
couleurs 3D, Duel de cartes 3D, and Mosswing use two-player rooms.
Football 19 compares five penalty shots per player, and Tape-Tape synchronizes
the tap race scores and server-side idle decay while each player controls only
their own lane. Ping-Pong and Basketball run
on the room host and relay the other player's controls; their snapshots are
interpolated for the remote player. Ball Rush starts both original runners with
the same course seed and exchanges interpolated player positions, scores, and
elimination status. Some arcade simulations remain browser-driven rather than
fully server-authoritative, so their results are not cheat-proof. Running
rounds pause on disconnect and resume after the player reconnects. Run both
commands above for online matches; each player can create or join a
six-character room code.

### Échecs 3D et Embuscade

The supplied chess and shooter HTML sources are copied unchanged to
`public/games/chess-3d.html` and `public/games/embuscade.html`. Separate
multiplayer bridges connect them to the room service. Chess is a server-validated
Red-versus-Black turn-based match. Embuscade is a simultaneous 75-second score
duel: each player runs the supplied mission independently, and the room server
compares their reported elimination scores.

Only games with actual bundled game engines can currently be played online.
The home-screen demo cards do not yet have game engines and are not online games.

### Moto Taxi Afrique, Chemin de couleurs, and Duel de cartes

The supplied 3D game pages and artwork are bundled in `public/games/` and
`public/images/`. Each game can be launched solo or through a public or private
two-player room. The server validates taxi controls and race progress, checks
each color-path selection without disclosing the path during the response phase,
and keeps card hands private until both players have played.

### Chasse aux mots

The word-search game uses the supplied puzzle artwork in the catalogue. It can
be played against an adjustable AI, locally by two players, or online in a
public or private six-character room. Each match has a shared 8×8 board with
10 non-overlapping words from the selected category; players drag across
letters in any of eight directions. Online, the server validates each word,
tracks length-weighted scores, and settles only demo-credit stakes.

### Dictée Éclair

The supplied Three.js typing duel is available as
`public/games/dictee-eclair.html` for the solo mode. Online rooms use the same
sentence-copy challenge in a best-of-three match: both players receive one
shared phrase per round, and the server validates the submitted copy, round
deadline, score, and winner. Public/private six-character rooms and demo-credit
stakes use the existing arena room flow.

Ping-Pong Arena and Basketball Stars keep their original Canvas clients and
offline modes, while online rounds use server-side fixed-step physics. Clients
send validated paddle, shot, and block inputs; neither client can publish a
score or authoritative game state for these rounds. The server broadcasts
snapshots to both players for rendering and interpolation.

### Le Labyrinthe des Damnés

The supplied Three.js game and icon are available as
`public/games/damned-maze.html` and `public/images/damned-maze.jpg`. Solo keeps
the original scout, demons, procedural shapes, three environments, controls,
and level progression. Local two-player mode uses ZQSD and arrow keys. Online
rooms use one server-generated maze configuration for both players; the server
validates movement and collisions, simulates shared demons and damage, tracks
each player's lives and portal progress, and broadcasts compact snapshots.
Maze rooms pause during reconnects, allow 60 seconds to return, and have
automatic waiting, empty-room, and finished-room expiration.
Maze-duel stakes are held and settled by the server as demo credits only. The
finished result plays a vault-and-prize animation using the server's winner,
player names, and settled pot; it does not represent a real-money payment.

### La Course vers la Princesse

The supplied Three.js castle, knights, dragon, princess, dice, and victory
cinematic are preserved in `public/games/princess-race.html`. Players can use
the original solo bot, take turns in local two-player mode, or create/join a
six-character online room. Online turns and random dice rolls are validated by
the server; it owns both positions, red-die stocks, turn order, and the winner.
Online stakes use the existing demo-credit escrow only; the server credits the
winner with the two-player pot and supports rematches. The room uses the
existing 10-minute waiting, 5-minute empty-room, 60-second reconnection, and
2-minute result-retention timers. The supplied castle and forest-bridge images
are used as their respective game artwork.

### Arène Hélice and Duel de Troncs

The supplied 3D games and artwork are bundled as
`public/games/arena-helice.html`, `public/games/duel-de-troncs.html`,
`public/images/arena-helice.gif`, and `public/images/duel-de-troncs.jpg`.
Both keep their original solo and local controls and can also be played in
public or private six-character rooms. The room server validates movement,
simulates hazards and round scoring, and settles demo-credit stakes; phone
players can use the on-screen controls.

### Fonctions retirées

Les paris sportifs et le jeu 4 Crochets ne sont plus proposés dans l'interface
et leurs fonctions dédiées ont été retirées du serveur.

### PowerShell and phone testing

Run these commands from the project directory in two PowerShell terminals:

```powershell
npm.cmd install
npm.cmd run server
```

In the second terminal:

```powershell
npm.cmd run dev -- --host 0.0.0.0
```

On two phones connected to the same Wi-Fi, open the Vite network URL printed by
the development server. The phones must also be able to reach port `3001` on
the computer running the server; allow that port through the computer's
firewall if needed. Create a maze room on one phone and join its six-character
code on the other. Arène Hélice and Duel de Troncs can be tested the same way.
This local setup does not make the game available between
different networks.

The shared deposit and result animations play automatically in online rooms.
Mobile browsers may block speech until a tap; use the speaker button to restart
the full animation with narration enabled.

## Public internet deployment

`render.yaml` defines a public static frontend and a separate Socket.IO server.
Push this project to a Git provider, then create a new Blueprint on Render and
select that repository. Render will build both services, configure the frontend
to use the server's public hostname over HTTPS/WSS, and provide a health
endpoint at `/health`. Open the static site's public URL on both devices; the
players can then join the same six-character room from different networks.

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
