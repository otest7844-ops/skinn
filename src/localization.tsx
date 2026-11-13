import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { LocalizationContext, type LocalizationValue } from './localization-context'

export type Language = 'en' | 'fr' | 'ar' | 'es' | 'de' | 'zh'
export type Currency = 'XOF' | 'USD' | 'NGN' | 'EUR' | 'GBP'

const LANGUAGE_STORAGE_KEY = 'chicago-language'
const CURRENCY_STORAGE_KEY = 'chicago-currency'

const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  es: 'Español',
  de: 'Deutsch',
  zh: '中文',
}

const ratesPerXof: Record<Currency, number> = {
  XOF: 1,
  USD: 0.00165,
  NGN: 2.45,
  EUR: 0.00152,
  GBP: 0.0013,
}

const localeByLanguage: Record<Language, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar',
  es: 'es-ES',
  de: 'de-DE',
  zh: 'zh-CN',
}

const localizedGameTitles: Record<string, Partial<Record<Language, string>>> = {
  'memo-5x5': { en: 'Memo 5×5', ar: 'مذكرة 5×5', es: 'Memo 5×5', de: 'Memo 5×5', zh: '记忆配对 5×5' },
  'word-search': { en: 'Word Search', ar: 'البحث عن الكلمات', es: 'Sopa de letras', de: 'Wortsuche', zh: '找单词' },
  'dictation-duel': { en: 'Lightning Dictation', ar: 'إملاء سريع', es: 'Dictado relámpago', de: 'Blitz-Diktat', zh: '闪电听写' },
  'quiz-arena': { en: 'Quiz Arena', ar: 'ساحة الاختبار', es: 'Arena de preguntas', de: 'Quiz-Arena', zh: '答题竞技场' },
  'tap-tape-arena': { en: 'Tap-Tap Arena', ar: 'ساحة النقر', es: 'Arena Tap-Tap', de: 'Tap-Tap-Arena', zh: '点击竞技场' },
  'forest-bridge': { en: 'Forest Bridge 3D', ar: 'جسر الغابة ثلاثي الأبعاد', es: 'Puente del bosque 3D', de: 'Waldbrücke 3D', zh: '森林桥 3D' },
  'princess-race': { en: 'Race to the Princess', ar: 'سباق الأميرة', es: 'Carrera hacia la princesa', de: 'Rennen zur Prinzessin', zh: '公主竞速' },
  'damned-maze': { en: 'The Damned Maze', ar: 'متاهة الملعونين', es: 'El laberinto maldito', de: 'Das verfluchte Labyrinth', zh: '诅咒迷宫' },
  'grotte-aux-couteaux': { en: 'Knife Cave', ar: 'كهف السكاكين', es: 'Cueva de cuchillos', de: 'Messergrotte', zh: '飞刀洞穴' },
  'colonnes-du-canyon': { en: 'Canyon Columns', ar: 'أعمدة الوادي', es: 'Columnas del cañón', de: 'Canyon-Säulen', zh: '峡谷立柱' },
  'arena-helice': { en: 'Helix Arena', ar: 'ساحة الحلزون', es: 'Arena Helix', de: 'Helix-Arena', zh: '螺旋竞技场' },
  'duel-de-troncs': { en: 'Log Duel', ar: 'مبارزة الأخشاب', es: 'Duelo de troncos', de: 'Baumstamm-Duell', zh: '木桩对决' },
  'chess-3d': { en: '3D Chess', ar: 'شطرنج ثلاثي الأبعاد', es: 'Ajedrez 3D', de: '3D-Schach', zh: '3D 象棋' },
  embuscade: { en: 'Ambush', ar: 'كمين', es: 'Emboscada', de: 'Hinterhalt', zh: '埋伏' },
  'chemin-de-couleurs': { en: 'Color Path 3D', ar: 'مسار الألوان ثلاثي الأبعاد', es: 'Camino de colores 3D', de: 'Farbpfad 3D', zh: '彩色路径 3D' },
  'duel-de-cartes': { en: '3D Card Duel', ar: 'مبارزة البطاقات ثلاثية الأبعاد', es: 'Duelo de cartas 3D', de: '3D-Kartenduell', zh: '3D 卡牌对决' },
}

const messages = {
  'nav.home': { en: 'Home', fr: 'Accueil', ar: 'الرئيسية', es: 'Inicio', de: 'Startseite', zh: '首页' },
  'nav.games': { en: 'Games', fr: 'Jeux', ar: 'الألعاب', es: 'Juegos', de: 'Spiele', zh: '游戏' },
  'nav.performance': { en: 'Leaderboard', fr: 'Classement', ar: 'التصنيف', es: 'Clasificación', de: 'Rangliste', zh: '排行榜' },
  'nav.invite': { en: 'Invite', fr: 'Inviter', ar: 'دعوة', es: 'Invitar', de: 'Einladen', zh: '邀请' },
  'nav.account': { en: 'My account', fr: 'Mon compte', ar: 'حسابي', es: 'Mi cuenta', de: 'Mein Konto', zh: '我的账户' },
  'wallet.demo': { en: 'Demo credits', fr: 'Crédits démo', ar: 'رصيد تجريبي', es: 'Créditos demo', de: 'Demo-Guthaben', zh: '演示积分' },
  'wallet.balance': { en: 'Balance', fr: 'Solde', ar: 'الرصيد', es: 'Saldo', de: 'Guthaben', zh: '余额' },
  'wallet.currency': { en: 'Display currency', fr: 'Devise d’affichage', ar: 'عملة العرض', es: 'Moneda de visualización', de: 'Anzeigewährung', zh: '显示货币' },
  'wallet.currencyNote': { en: 'Approximate display only; actual credits remain in XOF.', fr: 'Conversion indicative uniquement ; les crédits restent en XOF.', ar: 'عرض تقريبي فقط؛ الرصيد الفعلي يبقى بفرنك غرب أفريقيا.', es: 'Conversión orientativa; los créditos reales siguen en XOF.', de: 'Nur eine ungefähre Anzeige; Guthaben bleibt in XOF.', zh: '仅供参考；实际积分仍以西非法郎计。' },
  'currency.fcfa': { en: 'West African CFA franc', fr: 'Franc CFA', ar: 'فرنك غرب أفريقي', es: 'Franco CFA de África Occidental', de: 'CFA-Franc BCEAO', zh: '西非法郎' },
  'currency.dollar': { en: 'US dollar', fr: 'Dollar américain', ar: 'الدولار الأمريكي', es: 'Dólar estadounidense', de: 'US-Dollar', zh: '美元' },
  'currency.naira': { en: 'Nigerian naira', fr: 'Naira nigérian', ar: 'النيرة النيجيرية', es: 'Naira nigeriana', de: 'Nigerianischer Naira', zh: '尼日利亚奈拉' },
  'currency.euro': { en: 'Euro', fr: 'Euro', ar: 'اليورو', es: 'Euro', de: 'Euro', zh: '欧元' },
  'currency.pound': { en: 'British pound', fr: 'Livre sterling', ar: 'الجنيه الإسترليني', es: 'Libra esterlina', de: 'Britisches Pfund', zh: '英镑' },
  'language.label': { en: 'Language', fr: 'Langue', ar: 'اللغة', es: 'Idioma', de: 'Sprache', zh: '语言' },
  'language.savedLocally': { en: 'Saved on this device', fr: 'Enregistré sur cet appareil', ar: 'محفوظ على هذا الجهاز', es: 'Guardado en este dispositivo', de: 'Auf diesem Gerät gespeichert', zh: '保存在此设备' },
  'account.title': { en: 'Account & balances', fr: 'Compte et soldes', ar: 'الحساب والأرصدة', es: 'Cuenta y saldos', de: 'Konto und Guthaben', zh: '账户与余额' },
  'account.wallet': { en: 'My wallet', fr: 'Mon portefeuille', ar: 'محفظتي', es: 'Mi cartera', de: 'Mein Wallet', zh: '我的钱包' },
  'account.demoBalances': { en: 'Demo credit balances', fr: 'Soldes en crédits démo', ar: 'أرصدة تجريبية', es: 'Saldos de créditos demo', de: 'Demo-Guthabenstände', zh: '演示积分余额' },
  'account.withdrawal': { en: 'Withdrawal balance', fr: 'Solde de retrait', ar: 'رصيد السحب', es: 'Saldo de retiro', de: 'Auszahlungsguthaben', zh: '提现余额' },
  'account.availableWithdrawal': { en: 'Available for withdrawal', fr: 'Disponible au retrait', ar: 'متاح للسحب', es: 'Disponible para retirar', de: 'Zur Auszahlung verfügbar', zh: '可提现' },
  'account.bonusBalance': { en: 'Bonus balance', fr: 'Solde bonus', ar: 'رصيد المكافآت', es: 'Saldo de bonificación', de: 'Bonusguthaben', zh: '奖励余额' },
  'account.bonusAvailable': { en: 'Available bonus credits', fr: 'Crédits bonus disponibles', ar: 'رصيد المكافآت المتاح', es: 'Créditos de bonificación disponibles', de: 'Verfügbare Bonusguthaben', zh: '可用奖励积分' },
  'account.deposit': { en: 'Add balance', fr: 'Recharger le solde', ar: 'إضافة رصيد', es: 'Añadir saldo', de: 'Guthaben aufladen', zh: '充值' },
  'account.withdraw': { en: 'Withdraw', fr: 'Retirer', ar: 'سحب', es: 'Retirar', de: 'Auszahlen', zh: '提现' },
  'account.photo': { en: 'Photo', fr: 'Photo', ar: 'الصورة', es: 'Foto', de: 'Foto', zh: '照片' },
  'account.choosePhoto': { en: 'Choose a profile photo', fr: 'Choisir une photo de profil', ar: 'اختر صورة الملف الشخصي', es: 'Elegir foto de perfil', de: 'Profilbild auswählen', zh: '选择头像' },
  'account.theme': { en: 'Theme', fr: 'Thème', ar: 'السمة', es: 'Tema', de: 'Design', zh: '主题' },
  'account.toggle': { en: 'Switch', fr: 'Basculer', ar: 'تبديل', es: 'Cambiar', de: 'Wechseln', zh: '切换' },
  'account.replayIntro': { en: 'Replay Chicago intro', fr: 'Revoir l’intro Chicago', ar: 'إعادة مقدمة شيكاغو', es: 'Ver introducción de Chicago', de: 'Chicago-Intro erneut ansehen', zh: '重看芝加哥介绍' },
  'account.notifications': { en: 'Notifications', fr: 'Notifications', ar: 'الإشعارات', es: 'Notificaciones', de: 'Benachrichtigungen', zh: '通知' },
  'account.support': { en: 'Help and Support', fr: 'Aide et support', ar: 'المساعدة والدعم', es: 'Ayuda y soporte', de: 'Hilfe und Support', zh: '帮助与支持' },
  'account.hideBalance': { en: 'Hide balances', fr: 'Masquer les soldes', ar: 'إخفاء الأرصدة', es: 'Ocultar saldos', de: 'Guthaben ausblenden', zh: '隐藏余额' },
  'account.showBalance': { en: 'Show balances', fr: 'Afficher les soldes', ar: 'إظهار الأرصدة', es: 'Mostrar saldos', de: 'Guthaben anzeigen', zh: '显示余额' },
  'account.tapToHide': { en: 'Tap the eye to hide amounts', fr: 'Touchez l’œil pour masquer les montants', ar: 'اضغط على العين لإخفاء المبالغ', es: 'Toca el ojo para ocultar los importes', de: 'Tippe auf das Auge, um Beträge auszublenden', zh: '点击眼睛图标隐藏金额' },
  'account.tapToShow': { en: 'Tap the eye to show amounts', fr: 'Touchez l’œil pour afficher les montants', ar: 'اضغط على العين لإظهار المبالغ', es: 'Toca el ojo para mostrar los importes', de: 'Tippe auf das Auge, um Beträge anzuzeigen', zh: '点击眼睛图标显示金额' },
  'bonus.title': { en: 'Bonus', fr: 'Bonus', ar: 'المكافآت', es: 'Bonos', de: 'Boni', zh: '奖励' },
  'bonus.offers': { en: 'Offers', fr: 'Offres', ar: 'العروض', es: 'Ofertas', de: 'Angebote', zh: '优惠' },
  'game.back': { en: 'Back', fr: 'Retour', ar: 'رجوع', es: 'Volver', de: 'Zurück', zh: '返回' },
  'game.all': { en: 'All games', fr: 'Tous les jeux', ar: 'كل الألعاب', es: 'Todos los juegos', de: 'Alle Spiele', zh: '所有游戏' },
  'game.available': { en: 'Game available', fr: 'Jeu disponible', ar: 'اللعبة متاحة', es: 'Juego disponible', de: 'Spiel verfügbar', zh: '游戏可用' },
  'performance.title': { en: 'Leaderboard & Performance', fr: 'Classement et performances', ar: 'التصنيف والأداء', es: 'Clasificación y rendimiento', de: 'Rangliste und Leistung', zh: '排行榜与表现' },
  'performance.earnings': { en: 'Total winnings', fr: 'Gains cumulés', ar: 'إجمالي الأرباح', es: 'Ganancias acumuladas', de: 'Gesamtgewinne', zh: '累计奖金' },
  'performance.rank': { en: 'Your rank', fr: 'Votre rang', ar: 'ترتيبك', es: 'Tu posición', de: 'Dein Rang', zh: '你的排名' },
  'performance.top10': { en: 'Top 10 worldwide', fr: 'Top 10 des performeurs mondiaux', ar: 'أفضل 10 لاعبين عالميًا', es: 'Los 10 mejores del mundo', de: 'Weltweite Top 10', zh: '全球前十' },
  'search.placeholder': { en: 'Search for a game or team…', fr: 'Rechercher un jeu ou une équipe…', ar: 'ابحث عن لعبة أو فريق…', es: 'Buscar un juego o equipo…', de: 'Spiel oder Team suchen…', zh: '搜索游戏或队伍…' },
  'search.game': { en: 'Game', fr: 'Jeu', ar: 'لعبة', es: 'Juego', de: 'Spiel', zh: '游戏' },
  'search.none': { en: 'No results', fr: 'Aucun résultat', ar: 'لا توجد نتائج', es: 'Sin resultados', de: 'Keine Ergebnisse', zh: '没有结果' },
  'game.loading': { en: 'Loading game…', fr: 'Chargement du jeu…', ar: 'جارٍ تحميل اللعبة…', es: 'Cargando juego…', de: 'Spiel wird geladen…', zh: '正在加载游戏…' },
  'game.gamesCount': { en: 'games', fr: 'jeux', ar: 'ألعاب', es: 'juegos', de: 'Spiele', zh: '款游戏' },
  'game.group': { en: 'Games', fr: 'Jeux', ar: 'الألعاب', es: 'Juegos', de: 'Spiele', zh: '游戏' },
  'game.launch': { en: 'Launch', fr: 'Lancer', ar: 'تشغيل', es: 'Iniciar', de: 'Starten', zh: '开始' },
  'button.close': { en: 'Close', fr: 'Fermer', ar: 'إغلاق', es: 'Cerrar', de: 'Schließen', zh: '关闭' },
  'button.sendChallenge': { en: 'Send challenge', fr: 'Envoyer le défi', ar: 'إرسال التحدي', es: 'Enviar desafío', de: 'Herausforderung senden', zh: '发送挑战' },
  'button.accept': { en: 'Accept', fr: 'Accepter', ar: 'قبول', es: 'Aceptar', de: 'Annehmen', zh: '接受' },
  'button.decline': { en: 'Decline', fr: 'Refuser', ar: 'رفض', es: 'Rechazar', de: 'Ablehnen', zh: '拒绝' },
  'button.markRead': { en: 'Mark all as read', fr: 'Tout marquer comme lu', ar: 'تحديد الكل كمقروء', es: 'Marcar todo como leído', de: 'Alle als gelesen markieren', zh: '全部标为已读' },
  'wallet.main': { en: 'Main wallet', fr: 'Portefeuille principal', ar: 'المحفظة الرئيسية', es: 'Cartera principal', de: 'Haupt-Wallet', zh: '主钱包' },
  'wallet.creditWarning': { en: 'Demo credits only — no real payment', fr: 'Crédits de démonstration uniquement — aucun paiement réel', ar: 'رصيد تجريبي فقط — لا توجد مدفوعات حقيقية', es: 'Solo créditos demo; no hay pagos reales', de: 'Nur Demo-Guthaben – keine echten Zahlungen', zh: '仅为演示积分，不涉及真实付款' },
  'wallet.credits': { en: 'Demo credits', fr: 'crédits de démonstration', ar: 'رصيد تجريبي', es: 'créditos demo', de: 'Demo-Guthaben', zh: '演示积分' },
  'wallet.rechargeTitle': { en: 'Top up balance', fr: 'Recharger le solde', ar: 'إضافة رصيد', es: 'Recargar saldo', de: 'Guthaben aufladen', zh: '充值余额' },
  'wallet.rechargeInfo': { en: 'Demo wallet: no real deposits or withdrawals are available.', fr: 'Portefeuille démo : aucun dépôt ni retrait réel n’est disponible.', ar: 'محفظة تجريبية: لا تتوفر إيداعات أو سحوبات حقيقية.', es: 'Cartera demo: no se permiten depósitos ni retiros reales.', de: 'Demo-Wallet: keine echten Ein- oder Auszahlungen verfügbar.', zh: '演示钱包：不支持真实存款或提现。' },
  'invite.title': { en: 'Challenges & 1v1 invites', fr: 'Défis et invitations 1v1', ar: 'التحديات ودعوات 1 ضد 1', es: 'Desafíos e invitaciones 1v1', de: 'Herausforderungen und 1-gegen-1-Einladungen', zh: '挑战与一对一邀请' },
  'invite.launch': { en: 'Start a challenge', fr: 'Lancer un défi', ar: 'ابدأ تحديًا', es: 'Iniciar un desafío', de: 'Herausforderung starten', zh: '发起挑战' },
  'invite.player': { en: 'Player name', fr: 'Pseudo du joueur', ar: 'اسم اللاعب', es: 'Nombre del jugador', de: 'Spielername', zh: '玩家名称' },
  'invite.playerExample': { en: 'e.g. Nova Dream, Rift Echo…', fr: 'Ex. : Nova Dream, Rift Echo…', ar: 'مثال: Nova Dream، Rift Echo…', es: 'Ej.: Nova Dream, Rift Echo…', de: 'z. B. Nova Dream, Rift Echo…', zh: '例如：Nova Dream、Rift Echo…' },
  'invite.game': { en: 'Game', fr: 'Jeu', ar: 'اللعبة', es: 'Juego', de: 'Spiel', zh: '游戏' },
  'invite.stake': { en: 'Stake (XOF)', fr: 'Mise (XOF)', ar: 'الرهان (XOF)', es: 'Apuesta (XOF)', de: 'Einsatz (XOF)', zh: '下注 (XOF)' },
  'invite.incoming': { en: 'Pending incoming challenges', fr: 'Défis reçus en attente', ar: 'التحديات الواردة المعلقة', es: 'Desafíos recibidos pendientes', de: 'Ausstehende eingehende Herausforderungen', zh: '待处理的收到的挑战' },
  'invite.sent': { en: 'Sent challenges', fr: 'Défis envoyés', ar: 'التحديات المرسلة', es: 'Desafíos enviados', de: 'Gesendete Herausforderungen', zh: '已发送的挑战' },
  'invite.pending': { en: 'Pending', fr: 'En attente', ar: 'قيد الانتظار', es: 'Pendiente', de: 'Ausstehend', zh: '等待中' },
  'invite.to': { en: 'To:', fr: 'À :', ar: 'إلى:', es: 'Para:', de: 'An:', zh: '发给：' },
  'performance.globalTop12': { en: 'Top 12 worldwide', fr: 'Top 12 mondial', ar: 'ضمن أفضل 12 عالميًا', es: 'Top 12 mundial', de: 'Weltweite Top 12', zh: '全球前十二' },
  'profile.photo': { en: 'Profile photo', fr: 'Photo de profil', ar: 'صورة الملف الشخصي', es: 'Foto de perfil', de: 'Profilbild', zh: '头像' },
  'profile.player': { en: 'Player avatar', fr: 'Avatar du joueur', ar: 'صورة اللاعب', es: 'Avatar del jugador', de: 'Spieler-Avatar', zh: '玩家头像' },
  'notification.welcome': { en: 'Welcome bonus', fr: 'Bonus de bienvenue', ar: 'مكافأة الترحيب', es: 'Bono de bienvenida', de: 'Willkommensbonus', zh: '欢迎奖励' },
  'notification.newChallenge': { en: 'New challenge received', fr: 'Nouveau défi reçu', ar: 'تم استلام تحدٍ جديد', es: 'Nuevo desafío recibido', de: 'Neue Herausforderung erhalten', zh: '收到新挑战' },
  'notification.time5': { en: '5 min ago', fr: 'Il y a 5 min', ar: 'منذ 5 دقائق', es: 'Hace 5 min', de: 'Vor 5 Min.', zh: '5分钟前' },
  'notification.time20': { en: '20 min ago', fr: 'Il y a 20 min', ar: 'منذ 20 دقيقة', es: 'Hace 20 min', de: 'Vor 20 Min.', zh: '20分钟前' },
  'notification.safe': { en: 'Demo credits only. No real deposits, withdrawals, or payments are processed.', fr: 'Crédits de démonstration uniquement. Aucun dépôt, retrait ou paiement réel n’est effectué.', ar: 'رصيد تجريبي فقط. لا تتم معالجة أي إيداعات أو سحوبات أو مدفوعات حقيقية.', es: 'Solo créditos demo. No se procesan depósitos, retiros ni pagos reales.', de: 'Nur Demo-Guthaben. Es werden keine echten Ein- oder Auszahlungen verarbeitet.', zh: '仅为演示积分，不处理真实存款、提现或付款。' },
  'notification.challengeText': { en: 'Astra Void invited you to a Basketball Stars duel (stake: 500 XOF).', fr: 'Astra Void vous a invité pour un duel Basketball Stars (mise : 500 XOF).', ar: 'دعاك Astra Void إلى مواجهة في Basketball Stars (الرهان: 500 XOF).', es: 'Astra Void te invitó a un duelo de Basketball Stars (apuesta: 500 XOF).', de: 'Astra Void hat dich zu einem Basketball-Stars-Duell eingeladen (Einsatz: 500 XOF).', zh: 'Astra Void 邀请你参加 Basketball Stars 对决（下注：500 XOF）。' },
  'notification.markedRead': { en: 'All notifications marked as read.', fr: 'Toutes les notifications ont été marquées comme lues.', ar: 'تم تحديد جميع الإشعارات كمقروءة.', es: 'Todas las notificaciones se marcaron como leídas.', de: 'Alle Benachrichtigungen wurden als gelesen markiert.', zh: '所有通知均已标为已读。' },
  'lobby.quit': { en: 'Quit', fr: 'Quitter', ar: 'خروج', es: 'Salir', de: 'Verlassen', zh: '退出' },
  'lobby.return': { en: 'Back', fr: 'Retour', ar: 'رجوع', es: 'Volver', de: 'Zurück', zh: '返回' },
  'lobby.reconnecting': { en: 'Connection interrupted — reconnecting.', fr: 'Connexion interrompue — reconnexion en cours.', ar: 'انقطع الاتصال — جارٍ إعادة الاتصال.', es: 'Conexión interrumpida: reconectando.', de: 'Verbindung unterbrochen – erneuter Verbindungsaufbau.', zh: '连接中断，正在重新连接。' },
  'lobby.online': { en: 'Connected', fr: 'Connecté', ar: 'متصل', es: 'Conectado', de: 'Verbunden', zh: '已连接' },
  'lobby.offline': { en: 'Offline', fr: 'Hors ligne', ar: 'غير متصل', es: 'Desconectado', de: 'Offline', zh: '离线' },
  'lobby.duelRoom': { en: 'Duel room', fr: 'Salon de duel', ar: 'غرفة المواجهة', es: 'Sala de duelo', de: 'Duellraum', zh: '对决房间' },
  'lobby.playTogether': { en: 'Play together', fr: 'Jouez à deux', ar: 'العبوا معًا', es: 'Jueguen juntos', de: 'Zusammen spielen', zh: '双人游戏' },
  'lobby.nickname': { en: 'Your nickname', fr: 'Votre pseudo', ar: 'اسمك المستعار', es: 'Tu apodo', de: 'Dein Spitzname', zh: '你的昵称' },
  'lobby.player': { en: 'Player', fr: 'Joueur', ar: 'لاعب', es: 'Jugador', de: 'Spieler', zh: '玩家' },
  'lobby.solo': { en: 'Play solo', fr: 'Jouer en solo', ar: 'العب منفردًا', es: 'Jugar en solitario', de: 'Allein spielen', zh: '单人游戏' },
  'lobby.local': { en: 'Local mode · 2 players', fr: 'Mode local · 2 joueurs', ar: 'وضع محلي · لاعبان', es: 'Modo local · 2 jugadores', de: 'Lokaler Modus · 2 Spieler', zh: '本地模式 · 2 名玩家' },
  'lobby.mixed': { en: 'Mixed', fr: 'Mixte', ar: 'مختلط', es: 'Mixto', de: 'Gemischt', zh: '混合' },
  'lobby.demoStake': { en: 'Stake in demo credits', fr: 'Mise en crédits démo', ar: 'الرهان برصيد تجريبي', es: 'Apuesta en créditos demo', de: 'Einsatz in Demo-Guthaben', zh: '演示积分下注' },
  'lobby.public': { en: 'Show my room on the home page', fr: 'Afficher mon salon sur l’accueil', ar: 'إظهار غرفتي في الصفحة الرئيسية', es: 'Mostrar mi sala en la página de inicio', de: 'Meinen Raum auf der Startseite anzeigen', zh: '在首页显示我的房间' },
  'lobby.create': { en: 'Create a room', fr: 'Créer une salle', ar: 'إنشاء غرفة', es: 'Crear una sala', de: 'Raum erstellen', zh: '创建房间' },
  'lobby.joinRoom': { en: 'Join a room', fr: 'Rejoindre une salle', ar: 'الانضمام إلى غرفة', es: 'Unirse a una sala', de: 'Einem Raum beitreten', zh: '加入房间' },
  'lobby.roomCode': { en: 'Room code', fr: 'Code de la salle', ar: 'رمز الغرفة', es: 'Código de sala', de: 'Raumcode', zh: '房间代码' },
  'lobby.sameStake': { en: 'Matching stake in demo credits', fr: 'Mise identique en crédits démo', ar: 'الرهان المطابق برصيد تجريبي', es: 'Apuesta igual en créditos demo', de: 'Gleicher Einsatz in Demo-Guthaben', zh: '相同演示积分下注' },
  'lobby.copy': { en: 'Copy', fr: 'Copier', ar: 'نسخ', es: 'Copiar', de: 'Kopieren', zh: '复制' },
  'lobby.copied': { en: 'Copied', fr: 'Copié', ar: 'تم النسخ', es: 'Copiado', de: 'Kopiert', zh: '已复制' },
  'lobby.publicVisible': { en: 'Public room · visible on the home page', fr: 'Salon public · visible sur l’accueil', ar: 'غرفة عامة · ظاهرة في الصفحة الرئيسية', es: 'Sala pública · visible en inicio', de: 'Öffentlicher Raum · auf der Startseite sichtbar', zh: '公共房间 · 首页可见' },
  'lobby.private': { en: 'Private room', fr: 'Salon privé', ar: 'غرفة خاصة', es: 'Sala privada', de: 'Privater Raum', zh: '私人房间' },
  'lobby.victory': { en: 'VICTORY!', fr: 'VICTOIRE !', ar: 'فوز!', es: '¡VICTORIA!', de: 'SIEG!', zh: '胜利！' },
  'lobby.defeat': { en: 'DEFEAT', fr: 'DÉFAITE', ar: 'هزيمة', es: 'DERROTA', de: 'NIEDERLAGE', zh: '失败' },
  'lobby.draw': { en: 'DRAW', fr: 'ÉGALITÉ', ar: 'تعادل', es: 'EMPATE', de: 'UNENTSCHIEDEN', zh: '平局' },
  'lobby.select': { en: 'Your selection', fr: 'Votre sélection', ar: 'اختيارك', es: 'Tu selección', de: 'Deine Auswahl', zh: '你的选择' },
  'lobby.locked': { en: 'Selection locked', fr: 'Sélection verrouillée', ar: 'تم تثبيت الاختيار', es: 'Selección bloqueada', de: 'Auswahl gesperrt', zh: '选择已锁定' },
  'lobby.updateSelection': { en: 'Update my selection', fr: 'Mettre à jour ma sélection', ar: 'تحديث اختياري', es: 'Actualizar mi selección', de: 'Meine Auswahl aktualisieren', zh: '更新我的选择' },
  'lobby.confirmSelection': { en: 'Confirm my selection', fr: 'Valider ma sélection', ar: 'تأكيد اختياري', es: 'Confirmar mi selección', de: 'Meine Auswahl bestätigen', zh: '确认我的选择' },
  'lobby.startIn': { en: 'Starting in', fr: 'Début dans', ar: 'يبدأ خلال', es: 'Empieza en', de: 'Start in', zh: '即将开始' },
  'lobby.ready': { en: 'Ready', fr: 'Je suis prêt', ar: 'أنا مستعد', es: 'Estoy listo', de: 'Ich bin bereit', zh: '我准备好了' },
  'lobby.rematch': { en: 'Rematch', fr: 'Revanche', ar: 'إعادة المباراة', es: 'Revancha', de: 'Rückspiel', zh: '再来一局' },
  'lobby.waiting': { en: 'Waiting…', fr: 'En attente…', ar: 'قيد الانتظار…', es: 'Esperando…', de: 'Warten…', zh: '等待中…' },
  'lobby.playersReady': { en: 'Both players must be ready.', fr: 'Les deux joueurs doivent être prêts.', ar: 'يجب أن يكون كلا اللاعبين مستعدين.', es: 'Ambos jugadores deben estar listos.', de: 'Beide Spieler müssen bereit sein.', zh: '双方玩家都必须准备就绪。' },
  'lobby.shareCode': { en: 'Share the code to invite an opponent.', fr: 'Partagez le code pour inviter un adversaire.', ar: 'شارك الرمز لدعوة خصم.', es: 'Comparte el código para invitar a un rival.', de: 'Teile den Code, um einen Gegner einzuladen.', zh: '分享代码以邀请对手。' },
  'lobby.connecting': { en: 'Connecting to server…', fr: 'Connexion au serveur…', ar: 'جارٍ الاتصال بالخادم…', es: 'Conectando al servidor…', de: 'Verbindung zum Server…', zh: '正在连接服务器…' },
  'lobby.waitingSelection': { en: 'Waiting for club and player selection', fr: 'Choix du club et du joueur en attente', ar: 'في انتظار اختيار النادي واللاعب', es: 'Esperando la selección de equipo y jugador', de: 'Warten auf Vereins- und Spielerauswahl', zh: '等待选择俱乐部和球员' },
  'home.popular': { en: 'Popular', fr: 'Populaires', ar: 'الأكثر رواجًا', es: 'Populares', de: 'Beliebt', zh: '热门' },
  'home.all': { en: 'All', fr: 'Tout', ar: 'الكل', es: 'Todo', de: 'Alle', zh: '全部' },
  'sidebar.mainMenu': { en: 'MAIN MENU', fr: 'MENU PRINCIPAL', ar: 'القائمة الرئيسية', es: 'MENÚ PRINCIPAL', de: 'HAUPTMENÜ', zh: '主菜单' },
  'sidebar.ready': { en: 'Ready to play?', fr: 'Prêt à jouer ?', ar: 'هل أنت مستعد للعب؟', es: '¿Listo para jugar?', de: 'Bereit zu spielen?', zh: '准备好开始游戏了吗？' },
  'sidebar.multiplayer': { en: 'Discover multiplayer games.', fr: 'Découvre les jeux multijoueurs.', ar: 'اكتشف ألعاب تعدد اللاعبين.', es: 'Descubre juegos multijugador.', de: 'Entdecke Mehrspieler-Spiele.', zh: '探索多人游戏。' },
  'sidebar.explore': { en: 'Explore games', fr: 'Explorer les jeux', ar: 'استكشف الألعاب', es: 'Explorar juegos', de: 'Spiele entdecken', zh: '探索游戏' },
  'sidebar.expand': { en: 'Expand menu', fr: 'Développer le menu', ar: 'توسيع القائمة', es: 'Expandir menú', de: 'Menü erweitern', zh: '展开菜单' },
  'sidebar.collapse': { en: 'Collapse menu', fr: 'Réduire le menu', ar: 'طي القائمة', es: 'Contraer menú', de: 'Menü einklappen', zh: '收起菜单' },
  'theme.dark': { en: 'Dark', fr: 'Sombre', ar: 'داكن', es: 'Oscuro', de: 'Dunkel', zh: '深色' },
  'theme.light': { en: 'Light', fr: 'Clair', ar: 'فاتح', es: 'Claro', de: 'Hell', zh: '浅色' },
  'theme.neon': { en: 'Golden casino', fr: 'Casino doré', ar: 'كازينو ذهبي', es: 'Casino dorado', de: 'Goldenes Casino', zh: '金色赌场' },
  'theme.lime': { en: 'Lime green', fr: 'Vert citron', ar: 'أخضر ليموني', es: 'Verde lima', de: 'Limettengrün', zh: '青柠绿' },
  'theme.melbet': { en: 'Melbet yellow', fr: 'Melbet jaune', ar: 'ميلبيت الأصفر', es: 'Melbet amarillo', de: 'Melbet-Gelb', zh: 'Melbet 黄色' },
  'bonus.slots': { en: 'Slot machines', fr: 'Jackpot machines', ar: 'ماكينات الجوائز', es: 'Máquinas tragamonedas', de: 'Spielautomaten', zh: '老虎机' },
  'bonus.slotsDesc': { en: 'Discover the machines', fr: 'Découvrez les machines', ar: 'اكتشف الماكينات', es: 'Descubre las máquinas', de: 'Entdecke die Automaten', zh: '探索老虎机' },
  'bonus.roulette': { en: 'Roulette', fr: 'Roulette', ar: 'الروليت', es: 'Ruleta', de: 'Roulette', zh: '轮盘' },
  'bonus.rouletteDesc': { en: 'Try your luck', fr: 'Tentez votre chance', ar: 'جرّب حظك', es: 'Prueba tu suerte', de: 'Versuche dein Glück', zh: '试试你的运气' },
  'bonus.pinkJackpot': { en: 'Pink jackpot', fr: 'Jackpot rose', ar: 'الجائزة الكبرى الوردية', es: 'Bote rosa', de: 'Pinkes Jackpot', zh: '粉色大奖' },
  'bonus.oneGame': { en: 'One game, one jackpot', fr: 'Une partie, un jackpot', ar: 'لعبة واحدة، جائزة كبرى واحدة', es: 'Una partida, un bote', de: 'Ein Spiel, ein Jackpot', zh: '一局游戏，一个大奖' },
  'bonus.royalJackpot': { en: 'Royal jackpot', fr: 'Jackpot royal', ar: 'الجائزة الملكية', es: 'Bote real', de: 'Königlicher Jackpot', zh: '皇家大奖' },
  'bonus.spin': { en: 'Spin the reels', fr: 'Faites tourner les rouleaux', ar: 'أدر البكرات', es: 'Gira los rodillos', de: 'Drehe die Walzen', zh: '转动转轴' },
  'bonus.activated': { en: 'Promotion activated', fr: 'Promotion activée', ar: 'تم تفعيل العرض', es: 'Promoción activada', de: 'Aktion aktiviert', zh: '优惠已激活' },
  'rooms.open': { en: 'Open rooms', fr: 'Salons ouverts', ar: 'الغرف المفتوحة', es: 'Salas abiertas', de: 'Offene Räume', zh: '开放房间' },
  'rooms.available': { en: 'available', fr: 'disponible', ar: 'متاح', es: 'disponible', de: 'verfügbar', zh: '可用' },
  'rooms.connecting': { en: 'Connecting…', fr: 'Connexion…', ar: 'جارٍ الاتصال…', es: 'Conectando…', de: 'Verbindung wird hergestellt…', zh: '正在连接…' },
  'rooms.none': { en: 'No public rooms are open right now.', fr: 'Aucun salon public ouvert pour le moment.', ar: 'لا توجد غرف عامة مفتوحة حاليًا.', es: 'No hay salas públicas abiertas en este momento.', de: 'Zurzeit sind keine öffentlichen Räume geöffnet.', zh: '目前没有开放的公共房间。' },
  'rooms.join': { en: 'Join', fr: 'Participer', ar: 'انضمام', es: 'Unirse', de: 'Beitreten', zh: '加入' },
  'rooms.demoStake': { en: 'Demo stake', fr: 'Mise démo', ar: 'رهان تجريبي', es: 'Apuesta demo', de: 'Demo-Einsatz', zh: '演示下注' },
  'rooms.demoOnly': { en: 'Stakes and winnings are demo credits only.', fr: 'Mises et gains en crédits de démonstration uniquement.', ar: 'الرهانات والأرباح برصيد تجريبي فقط.', es: 'Las apuestas y ganancias son solo créditos demo.', de: 'Einsätze und Gewinne sind nur Demo-Guthaben.', zh: '下注和奖金均为演示积分。' },
  'intro.caption': { en: 'Play · Win · Enjoy', fr: 'Jouez · Gagnez · Profitez', ar: 'العب · اربح · استمتع', es: 'Juega · Gana · Disfruta', de: 'Spielen · Gewinnen · Genießen', zh: '玩 · 赢 · 享受' },
  'intro.loading': { en: 'Loading', fr: 'Chargement', ar: 'جارٍ التحميل', es: 'Cargando', de: 'Wird geladen', zh: '加载中' },
  'intro.enter': { en: 'Enter', fr: 'Entrer', ar: 'دخول', es: 'Entrar', de: 'Eintreten', zh: '进入' },
  'home.featuredTitle': { en: 'Find your next favorite game', fr: 'Trouvez votre prochain jeu favori', ar: 'اكتشف لعبتك المفضلة التالية', es: 'Encuentra tu próximo juego favorito', de: 'Finde dein nächstes Lieblingsspiel', zh: '发现你的下一款最爱游戏' },
  'home.featuredDescription': { en: 'Explore the games and offers waiting for you.', fr: 'Découvrez les jeux et les offres qui vous attendent.', ar: 'اكتشف الألعاب والعروض بانتظارك.', es: 'Descubre los juegos y ofertas que te esperan.', de: 'Entdecke Spiele und Angebote, die auf dich warten.', zh: '探索精彩游戏与专属优惠。' },
  'home.featuredAction': { en: 'Explore offers', fr: 'Découvrir les offres', ar: 'اكتشف العروض', es: 'Explorar ofertas', de: 'Angebote entdecken', zh: '探索优惠' },
  'language.arabic': { en: 'Arabic', fr: 'Arabe', ar: 'العربية', es: 'Árabe', de: 'Arabisch', zh: '阿拉伯语' },
  'language.chinese': { en: 'Chinese', fr: 'Chinois', ar: 'الصينية', es: 'Chino', de: 'Chinesisch', zh: '中文' },
} as const

export type MessageKey = keyof typeof messages

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'fr' || value === 'ar' || value === 'es' || value === 'de' || value === 'zh'
}

function isCurrency(value: string | null): value is Currency {
  return value === 'XOF' || value === 'USD' || value === 'NGN' || value === 'EUR' || value === 'GBP'
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isLanguage(saved) ? saved : 'fr'
  })
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY)
    return isCurrency(saved) ? saved : 'XOF'
  })

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  useEffect(() => {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
  }, [currency])

  const value = useMemo<LocalizationValue>(() => ({
    language,
    setLanguage,
    currency,
    setCurrency,
    languageNames,
    t: (key) => messages[key][language],
    gameTitle: (gameId, fallback) => localizedGameTitles[gameId]?.[language] ?? fallback,
    formatAmount: (amountInXof) => {
      const convertedAmount = amountInXof * ratesPerXof[currency]
      return new Intl.NumberFormat(localeByLanguage[language], {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedAmount)
    },
  }), [currency, language])

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>
}
