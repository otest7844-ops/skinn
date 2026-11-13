import './ArcadeOnline.css'

const controls: Record<string, { keyboard: string[]; touch: string }> = {
  ghasaq: {
    keyboard: ['W/A/S/D ou Z/Q/S/D : se déplacer; souris : viser et tirer', 'Espace : sauter; Maj : courir; R : recharger', '1/2 : changer d’arme; V : couteau; E : interagir'],
    touch: 'Joystick gauche pour avancer; glissez à droite pour viser et utilisez les boutons de tir et de rechargement.',
  },
  'ping-pong': {
    keyboard: ['Souris : déplacer la raquette', 'Clic : servir'],
    touch: 'Glissez sur le terrain pour déplacer la raquette; touchez pour servir.',
  },
  'basketball-stars': {
    keyboard: ['J1 : W/S ou ↑/↓; maintenir Espace pour tirer', 'J2 : I/K; maintenir Entrée pour tirer'],
    touch: 'Glissez pour viser et charger le tir; utilisez le bouton de défense affiché.',
  },
  'ball-rush': {
    keyboard: ['←/Q : gauche', '→/D : droite', '↑/Z : sauter', '↓/S : glisser', 'Espace : hoverboard'],
    touch: 'Boutons gauche, droite, sauter, glisser et hoverboard dans le jeu.',
  },
  'forest-bridge': {
    keyboard: ['Clic : choisir la prochaine plateforme'],
    touch: 'Touchez la plateforme suivante pour avancer.',
  },
  'damned-maze': {
    keyboard: ['W/A/S/D ou Z/Q/S/D : déplacement', 'Pincement / molette : zoom'],
    touch: 'Utilisez le joystick à l’écran pour vous déplacer; glissez pour orienter la vue.',
  },
  'princess-race': {
    keyboard: ['Cliquez sur le dé de votre tour pour lancer.'],
    touch: 'Touchez le dé disponible à votre tour.',
  },
  'grotte-aux-couteaux': {
    keyboard: ['J1 : W/Z pour monter, S/↓ pour descendre', 'J2 : ↑/I pour monter, ↓/K pour descendre'],
    touch: 'Utilisez les commandes tactiles affichées dans la grotte.',
  },
  'colonnes-du-canyon': {
    keyboard: ['←/Q/A : gauche', '→/D : droite', '↑/Z/W/Espace : sauter'],
    touch: 'Touchez les commandes directionnelles et le bouton de saut affichés.',
  },
  'arena-helice': {
    keyboard: ['J1 : W/A/S/D pour bouger, Espace pour sauter', 'J2 : flèches pour bouger, Entrée pour sauter'],
    touch: 'Touchez les commandes du joueur affichées dans l’arène pour bouger et sauter.',
  },
  'duel-de-troncs': {
    keyboard: ['J1 : A/D pour bouger, W ou Espace pour sauter', 'J2 : ←/→ pour bouger, ↑ pour sauter'],
    touch: 'Touchez les commandes de déplacement et d’action affichées à l’écran.',
  },
  'piaf-plume': {
    keyboard: ['Espace, ↑ ou W : battre des ailes', 'Atteignez le nid et ramassez des pièces avant votre adversaire.'],
    touch: 'Touchez le jeu pour battre des ailes; comparez votre progression avec celle de votre adversaire.',
  },
  'lave-montante': {
    keyboard: ['W/A/S/D ou Z/Q/S/D : grimper', 'Espace : sauter; Maj : jetpack'],
    touch: 'Utilisez les commandes du jeu pour grimper, sauter et éviter la lave.',
  },
  'mirror-run': {
    keyboard: ['ZQSD/WASD ou flèches : bouger', 'Espace : sauter; Maj : sprinter; C : descendre; T : vision thermique'],
    touch: 'Utilisez les commandes tactiles pour ramasser les pièces et progresser.',
  },
  'chess-3d': {
    keyboard: ['Touchez ou cliquez une pièce puis sa case de destination.', 'Rouges jouent les premiers; les tours alternent.'],
    touch: 'Touchez une pièce puis sa case de destination pour la déplacer.',
  },
  embuscade: {
    keyboard: ['Souris : viser; clic gauche ou Espace : tirer', 'C : se couvrir; X : se relever; Maj : stabiliser', 'N/T : thermique; Z ou clic droit : lunette'],
    touch: 'Glissez pour viser et utilisez les boutons Tirer, Baisser, Se relever, Thermique et Lunette.',
  },
  'moto-taxi-afrique': {
    keyboard: ['J1 : flèches ←/→ pour tourner, ↑ pour accélérer, ↓ pour freiner', 'J2 : A/D pour tourner, W pour accélérer, S pour freiner'],
    touch: 'Utilisez les boutons directionnels, Gaz et Frein affichés dans le jeu.',
  },
  'chemin-de-couleurs': {
    keyboard: ['Mémorisez la séquence, puis cliquez sur les dalles dans le même ordre.'],
    touch: 'Mémorisez la séquence lumineuse, puis touchez les dalles dans le même ordre.',
  },
  'duel-de-cartes': {
    keyboard: ['Jouez une carte à votre tour; la carte la plus forte remporte la manche.'],
    touch: 'Touchez une carte de votre main à votre tour.',
  },
  'memo-5x5': {
    keyboard: ['Cliquez sur une carte pour la retourner.'],
    touch: 'Touchez les cartes pour les retourner.',
  },
  'word-search': {
    keyboard: ['Cliquez et faites glisser de la première à la dernière lettre.'],
    touch: 'Faites glisser votre doigt sur les lettres pour sélectionner un mot.',
  },
  'dictation-duel': {
    keyboard: ['Saisissez la phrase au clavier puis validez.'],
    touch: 'Touchez le champ de texte pour saisir la phrase.',
  },
  'quiz-arena': {
    keyboard: ['Cliquez sur une réponse avant la fin du compte à rebours.', 'Utilisez un joker 50/50 pour éliminer deux choix.'],
    touch: 'Touchez une réponse avant la fin du compte à rebours; le joker 50/50 élimine deux choix.',
  },
  'head-football': {
    keyboard: ['J1 : A/D pour courir, W pour sauter, F pour tirer, G pour tirer fort', 'J2 : ←/→ pour courir, ↑ pour sauter, Entrée pour tirer, Maj pour tirer fort'],
    touch: 'Utilisez les boutons directionnels, SAUT et TIR du joueur.',
  },
  'football-19': {
    keyboard: ['Glissez / cliquez pour viser; maintenez puis relâchez pour tirer.'],
    touch: 'Glissez pour viser; maintenez le bouton Tirer pour charger puis relâchez.',
  },
  'tap-tape-arena': {
    keyboard: ['J1 : A ou Q pour taper', 'J2 : L ou M pour taper'],
    touch: 'Touchez le grand bouton Tape de votre côté.',
  },
  'tic-tac-toe': {
    keyboard: ['Cliquez sur une case libre.'],
    touch: 'Touchez une case libre du plateau.',
  },
}

export default function GameControlsGuide({
  game,
  playerSlot = null,
}: {
  game: string
  playerSlot?: 0 | 1 | null
}) {
  const guide = controls[game]
  if (!guide) return null
  const keyboard = playerSlot === null
    ? guide.keyboard
    : guide.keyboard.filter((instruction) => !instruction.startsWith('J1 :') && !instruction.startsWith('J2 :')
      || instruction.startsWith(`J${playerSlot + 1} :`))

  return (
    <section className="game-controls-guide" aria-label="Commandes du jeu">
      <strong>Commandes avant de jouer</strong>
      <ul>{keyboard.map((instruction) => <li key={instruction}>{instruction}</li>)}</ul>
      <p><b>Mobile :</b> {guide.touch}</p>
    </section>
  )
}
