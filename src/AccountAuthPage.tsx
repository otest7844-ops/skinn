import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, Copy, Laptop, RefreshCw, ShieldAlert, ShieldCheck, Smartphone, Tablet } from 'lucide-react'
import { getAuthApiBaseUrl } from './multiplayer-url'

type AuthMode = 'register' | 'login'

type Account = {
  id: string
  name: string
  country: string
  deviceType?: string
}

type Challenge = {
  challengeId: string
  question: string
}

type ApiResult = {
  error?: string
  account?: Account
  credentials?: { id: string; password: string }
}

const DEVICE_TOKEN_KEY = 'chicago-browser-device-token'
const COUNTRY_CODES = `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW`.split(' ')

const terms = [
  {
    title: '1. Comment jouer ?',
    paragraphs: [
      'Avec un ami : créez une salle et partagez son code ou invitez-le par son pseudonyme.',
      'Avec un inconnu : lancez le scanner pour rechercher automatiquement un adversaire.',
      'En solo : entraînez-vous gratuitement, sans mise.',
    ],
  },
  {
    title: '2. Règles des parties',
    paragraphs: [
      'Vérifiez votre connexion avant chaque partie. Confirmez votre participation dans les 10 secondes prévues avant le lancement. Une fois la partie commencée, évitez de quitter volontairement. Un abandon peut entraîner une défaite selon les règles du jeu.',
      'Une déconnexion technique ne constitue pas automatiquement une fraude. Les résultats sont déterminés selon les règles et les performances des joueurs.',
    ],
  },
  {
    title: '3. Gestion des mises',
    paragraphs: [
      'Les conditions ci-dessous sont fournies à titre informatif : les mises et paiements réels ne sont pas actifs dans cette version démo.',
      'Pour une partie avec mise, les montants des deux joueurs seraient réservés avant le lancement. Le gagnant recevrait le montant qui lui revient, le perdant perdrait sa mise, et les règles du jeu s’appliqueraient en cas d’égalité. En cas d’annulation technique, les mises seraient remboursées. Les résultats et transactions seraient enregistrés dans l’historique.',
    ],
  },
  {
    title: '4. Les trois soldes',
    paragraphs: [
      'Solde principal : argent disponible pour les opérations autorisées. Solde retrait : gains et sommes disponibles au retrait. Solde bonus : récompenses promotionnelles et parrainages. Dans cette démo, les crédits affichés sont fictifs.',
    ],
  },
  {
    title: '5. Parrainage',
    paragraphs: [
      'Chaque utilisateur possède un code promotionnel. La récompense annoncée de 100 FCFA pour une personne parrainée qui s’inscrit avec votre code et effectue son premier dépôt confirmé n’est pas active dans cette démo. Les inscriptions fictives et les comptes frauduleux sont interdits.',
    ],
  },
  {
    title: '6. Frais de retrait',
    paragraphs: [
      'Le texte fourni annonce des frais de 10 % (par exemple, 1 000 FCFA sur une demande de retrait de 10 000 FCFA), affichés avant confirmation. Ces frais ne sont pas appliqués : les paiements réels et retraits ne sont pas disponibles dans cette version.',
    ],
  },
  {
    title: '7. Comment retirer ?',
    paragraphs: [
      'Le parcours indiqué dans le texte fourni est : ouvrir « Compte », sélectionner « Retrait », saisir le montant, vérifier les frais, confirmer et récupérer le ticket, puis envoyer le ticket dans la boîte de retrait du Dashboard et remplir le formulaire. Ce parcours n’est pas disponible dans cette démo : aucun ticket ni paiement réel ne peut être émis. Le délai annoncé de 24 heures après réception d’un dossier complet n’est pas applicable.',
    ],
  },
  {
    title: '8. Fraude et tricherie',
    paragraphs: [
      'Les logiciels de triche, la manipulation des résultats, l’exploitation volontaire des bugs, la fraude financière et la collusion entre joueurs sont interdits. Une suspension peut être appliquée après vérification des faits et toute sanction doit pouvoir être contestée.',
    ],
  },
  {
    title: '9. Dépôts et assistance',
    paragraphs: [
      'Le texte fourni prévoit un crédit du dépôt après confirmation du prestataire de paiement, ainsi qu’une assistance pour un dépôt non crédité, un retrait en attente, un résultat contesté, un problème technique ou une erreur de solde. Les dépôts et paiements ne sont pas actifs dans cette version démo et aucun dépôt réel ne sera crédité.',
    ],
  },
  {
    title: '10. Responsabilité',
    paragraphs: [
      'Chaque joueur est responsable de son compte et de ses actions. Il doit protéger ses identifiants, respecter les autres joueurs et vérifier les conditions avant de participer. Les utilisateurs doivent respecter les restrictions d’âge et les lois applicables.',
    ],
  },
]

function getDeviceToken() {
  const existing = window.localStorage.getItem(DEVICE_TOKEN_KEY)
  if (existing && /^[a-f0-9]{64}$/.test(existing)) return existing
  const bytes = window.crypto.getRandomValues(new Uint8Array(32))
  const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  window.localStorage.setItem(DEVICE_TOKEN_KEY, token)
  return token
}

async function getApiError(response: Response) {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    return { error: `Service de connexion indisponible (HTTP ${response.status}).` }
  }
  const result = await response.json() as ApiResult
  return result
}

async function fetchWithTimeout(url: string, options: RequestInit) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('Le serveur de connexion ne répond pas. Réessayez plus tard.')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export default function AccountAuthPage({
  mode,
  onAuthenticated,
}: {
  mode: AuthMode
  onAuthenticated: (account: Account) => void
}) {
  const [activeMode, setActiveMode] = useState(mode)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [deviceType, setDeviceType] = useState('')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [acceptances, setAcceptances] = useState([false, false, false, false])
  const [registerStep, setRegisterStep] = useState(1)
  const [credentials, setCredentials] = useState<{ account: Account; id: string; password: string } | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const [challengeLoading, setChallengeLoading] = useState(false)
  const [termsRead, setTermsRead] = useState(false)
  const termsRef = useRef<HTMLDivElement>(null)
  const countries = useMemo(() => {
    const displayNames = new Intl.DisplayNames(['fr'], { type: 'region' })
    return COUNTRY_CODES.map((code) => ({ code, name: displayNames.of(code) ?? code }))
      .sort((first, second) => first.name.localeCompare(second.name, 'fr'))
  }, [])

  useEffect(() => {
    const previousTheme = document.body.getAttribute('data-theme')
    document.body.setAttribute('data-theme', 'auth')
    return () => {
      if (previousTheme) document.body.setAttribute('data-theme', previousTheme)
      else document.body.removeAttribute('data-theme')
    }
  }, [])

  const requestChallenge = useCallback(async () => {
      const response = await fetchWithTimeout(`${getAuthApiBaseUrl()}/api/auth/captcha`, { credentials: 'include', cache: 'no-store' })
      if (!response.ok) {
        const result = await getApiError(response)
        throw new Error(result.error ?? 'Impossible de charger la vérification.')
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Service de connexion indisponible. Le serveur d’authentification doit être déployé.')
      }
      return response.json() as Promise<Challenge>
  }, [])

  const loadChallenge = useCallback(async (preserveError = false) => {
    setChallengeLoading(true)
    if (!preserveError) setError('')
    try {
      setChallenge(await requestChallenge())
      setCaptchaAnswer('')
    } catch (requestError) {
      if (!preserveError) {
        setError(requestError instanceof TypeError
          ? 'Serveur d’inscription inaccessible. Relancez le serveur de l’application puis actualisez cette page.'
          : requestError instanceof Error ? requestError.message : 'Impossible de joindre le serveur.')
      }
      setChallenge(null)
    } finally {
      setChallengeLoading(false)
    }
  }, [requestChallenge])

  useEffect(() => {
    let active = true
    requestChallenge().then((nextChallenge) => {
      if (active) setChallenge(nextChallenge)
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof TypeError
        ? 'Serveur d’inscription inaccessible. Relancez le serveur de l’application puis actualisez cette page.'
        : requestError instanceof Error ? requestError.message : 'Impossible de joindre le serveur.')
    }).finally(() => {
      if (active) setChallengeLoading(false)
    })
    return () => { active = false }
  }, [requestChallenge])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setCopyMessage('')
    if (activeMode === 'register' && registerStep < 3) {
      continueRegistration()
      return
    }
    if (!challenge) {
      setError('Chargez la vérification avant de continuer.')
      return
    }
    if (activeMode === 'register' && (!acceptances.every(Boolean) || !termsRead)) {
      setError('Faites défiler toutes les conditions jusqu’à la fin et cochez les quatre cases.')
      return
    }
    if (activeMode === 'register' && (!name.trim() || !country || !deviceType)) {
      setRegisterStep(1)
      setError('Complétez votre pseudo, votre pays et votre appareil avant de créer le compte.')
      return
    }

    setBusy(true)
    try {
      const deviceToken = getDeviceToken()
      const payload = activeMode === 'register'
        ? {
            challengeId: challenge.challengeId,
            captchaAnswer,
            name,
            country,
            deviceType,
            deviceToken,
            termsRead,
            acceptances: { contract: acceptances[0], rules: acceptances[1], financial: acceptances[2], terms: acceptances[3] },
          }
        : { challengeId: challenge.challengeId, captchaAnswer, id, password, deviceType, deviceToken }
      const response = await fetchWithTimeout(`${getAuthApiBaseUrl()}/api/auth/${activeMode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Service de connexion indisponible. Le serveur d’authentification doit être déployé.')
      }
      const result = await response.json() as ApiResult
      if (!response.ok) throw new Error(result.error ?? 'La demande a échoué.')
      if (!result.account) throw new Error('Le serveur n’a pas confirmé le compte.')
      if (activeMode === 'register') {
        if (!result.credentials) throw new Error('Les identifiants n’ont pas été reçus. Contactez l’assistance avant de quitter cette page.')
        setCredentials({ account: result.account, ...result.credentials })
      } else {
        onAuthenticated(result.account)
      }
    } catch (requestError) {
      const message = requestError instanceof TypeError
        ? 'Serveur d’inscription inaccessible. Relancez le serveur de l’application puis actualisez cette page.'
        : requestError instanceof Error ? requestError.message : 'Impossible de joindre le serveur.'
      setError(message)
      await loadChallenge(true)
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  async function copyCredential(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyMessage('Copié dans le presse-papiers.')
    } catch (copyError) {
      console.error('Unable to copy account credentials:', copyError)
      setCopyMessage('Copie impossible. Sélectionnez le texte et copiez-le manuellement.')
    }
  }

  const canSubmit = !busy && !challengeLoading && Boolean(challenge && captchaAnswer)
    && (activeMode === 'login'
      ? Boolean(id && password && deviceType)
      : registerStep === 3 && name.trim().length >= 2 && Boolean(country && deviceType && termsRead) && acceptances.every(Boolean))

  function continueRegistration() {
    setError('')
    if (registerStep === 1) {
      if (name.trim().length < 2 || !country || !deviceType) {
        setError('Renseignez un pseudo de 2 caractères minimum, votre pays et votre appareil.')
        return
      }
    } else if (registerStep === 2) {
      if (!termsRead) {
        setError('Faites défiler le texte des conditions jusqu’à sa toute dernière ligne.')
        termsRef.current?.focus()
        return
      }
      if (!acceptances.every(Boolean)) {
        setError('Cochez chacune des quatre déclarations pour continuer.')
        return
      }
    }
    setRegisterStep((current) => Math.min(3, current + 1))
  }

  if (credentials) {
    return (
      <main className="min-h-dvh bg-[#fffdf5] px-4 py-5 text-slate-900 sm:py-8">
        <section className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-5 shadow-xl shadow-amber-100/70 sm:p-8">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-black">Compte créé</h1>
          <p className="mt-1 text-sm text-slate-600">Votre mot de passe comporte 8 lettres. Notez ces identifiants maintenant : il ne sera plus affiché après avoir quitté cet écran.</p>
          <div className="mt-4 grid gap-2">
            {[
              ['Identifiant', credentials.id],
              ['Mot de passe', credentials.password],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-amber-100 bg-amber-50/60 p-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <code className="break-all text-lg font-black tracking-wider text-amber-800">{value}</code>
                  <button type="button" onClick={() => void copyCredential(value)} className="shrink-0 rounded-xl p-2 text-slate-600 hover:bg-amber-100" aria-label={`Copier ${label}`}>
                    <Copy size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 min-h-5 text-xs text-emerald-700" aria-live="polite">{copyMessage}</p>
          <div className="mt-2 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
            <ShieldAlert className="mt-0.5 shrink-0" size={19} />
            <p><strong>Important :</strong> ne partagez jamais vos identifiants. Conservez-les dans un endroit sûr. L’appareil est associé à ce navigateur; une connexion depuis un autre navigateur déplacera l’association et fermera la session précédente.</p>
          </div>
          <button type="button" onClick={() => onAuthenticated(credentials.account)} className="mt-4 w-full rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300">
            Entrez
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-dvh w-full min-w-0 overflow-x-hidden bg-[#fffdf5] px-3 py-3 text-slate-900 sm:px-5 sm:py-5">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-xl shadow-amber-100/60">
          <header className="min-w-0 border-b border-amber-100 bg-gradient-to-r from-white to-amber-50 px-3 py-3 sm:px-6">
            <p className="text-[11px] font-black uppercase tracking-[.2em] text-amber-700">CHICAGO</p>
            <div className="mt-1 flex min-w-0 flex-wrap items-end justify-between gap-2">
              <div className="min-w-0">
                <h1 className="text-xl font-black sm:text-2xl">{activeMode === 'register' ? 'Créer un compte' : 'Connexion'}</h1>
                <p className="mt-0.5 text-xs text-slate-600">Inscription requise avant d’entrer dans la plateforme.</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button type="button" onClick={() => { setActiveMode('register'); setRegisterStep(1); setChallenge(null); setTermsRead(false); void loadChallenge() }} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${activeMode === 'register' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>Inscription</button>
                <button type="button" onClick={() => { setActiveMode('login'); setChallenge(null); void loadChallenge() }} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${activeMode === 'login' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>Connexion</button>
              </div>
            </div>
          </header>

          <form onSubmit={(event) => void submit(event)} className="grid min-w-0 gap-3 px-3 py-3 sm:px-6">
            {activeMode === 'register' ? (
              <>
                <ol className="grid min-w-0 grid-cols-3 gap-1.5 sm:gap-2" aria-label="Étapes de l’inscription">
                  {['Profil', 'Conditions', 'Vérification'].map((label, index) => {
                    const step = index + 1
                    const complete = registerStep > step
                    const current = registerStep === step
                    return (
                      <li key={label} className="min-w-0">
                        <button
                          type="button"
                          aria-current={current ? 'step' : undefined}
                          disabled={step > registerStep}
                          onClick={() => { setError(''); setRegisterStep(step) }}
                          className={`flex min-h-12 w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-1.5 text-[10px] font-black leading-tight transition sm:flex-row sm:gap-1.5 sm:px-2 sm:text-[11px] ${
                            current ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200'
                              : complete ? 'border-orange-200 bg-orange-50 text-orange-800'
                                : 'border-slate-200 bg-slate-50 text-slate-500'
                          }`}
                        >
                          {complete ? <Check size={14} className="shrink-0" /> : <span className="shrink-0">{step}</span>}
                          <span className="max-w-full break-words text-center">{label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>

                <section className="grid min-w-0 gap-3 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-3 sm:p-4" aria-live="polite">
                  <header className="grid gap-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[.16em] text-orange-700">Étape {registerStep} sur 3</p>
                    <h2 className="text-base font-black text-slate-950">
                      {registerStep === 1 ? 'Votre profil' : registerStep === 2 ? 'Lire et accepter les conditions' : 'Vérification finale'}
                    </h2>
                    <p className="text-xs leading-5 text-slate-700">
                      {registerStep === 1 ? 'Choisissez votre pseudo, votre pays et votre appareil.'
                        : registerStep === 2 ? 'Faites défiler la carte orange jusqu’en bas, puis confirmez les quatre points.'
                          : 'Répondez au calcul anti-robot pour créer votre compte.'}
                    </p>
                  </header>

                  {registerStep === 1 && (
                    <div className="grid min-w-0 gap-3">
                      <label className="grid gap-1 text-xs font-bold text-slate-800">
                        Pseudonyme
                        <input required minLength={2} maxLength={24} value={name} onChange={(event) => setName(event.target.value)} autoComplete="nickname" className="min-h-11 w-full min-w-0 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                      </label>
                      <label className="grid gap-1 text-xs font-bold text-slate-800">
                        Pays
                        <select required value={country} onChange={(event) => setCountry(event.target.value)} className="min-h-11 w-full min-w-0 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                          <option value="">Choisir un pays</option>
                          {countries.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-1 text-xs font-bold text-slate-800">
                        Votre appareil
                        <select required value={deviceType} onChange={(event) => setDeviceType(event.target.value)} className="min-h-11 w-full min-w-0 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                          <option value="">Choisir un appareil</option>
                          <option value="phone">Téléphone</option>
                          <option value="tablet">Tablette</option>
                          <option value="computer">Ordinateur</option>
                        </select>
                      </label>
                      <div className="flex min-w-0 items-center gap-2 rounded-xl border border-orange-200 bg-white/70 px-3 py-2 text-[11px] leading-4 text-slate-700">
                        {deviceType === 'phone' ? <Smartphone size={16} className="shrink-0 text-orange-700" /> : deviceType === 'tablet' ? <Tablet size={16} className="shrink-0 text-orange-700" /> : <Laptop size={16} className="shrink-0 text-orange-700" />}
                        <span className="min-w-0 break-words">L’appareil sera associé à ce navigateur par un jeton révocable.</span>
                      </div>
                    </div>
                  )}

                  {registerStep === 2 && (
                    <section className="grid gap-3" aria-labelledby="terms-heading">
                      <div className="flex min-w-0 flex-wrap items-center justify-between gap-1">
                        <h3 id="terms-heading" className="text-sm font-black text-slate-950">Conditions générales</h3>
                        <span className={`text-[10px] font-bold ${termsRead ? 'text-emerald-700' : 'text-orange-800'}`} aria-live="polite">
                          {termsRead ? 'Lecture terminée ✓' : 'Défilez jusqu’à la fin ↓'}
                        </span>
                      </div>
                      <div
                        ref={termsRef}
                        onScroll={(event) => {
                          const element = event.currentTarget
                          if (element.scrollTop + element.clientHeight >= element.scrollHeight - 12) setTermsRead(true)
                        }}
                        tabIndex={0}
                        aria-label="Faites défiler les conditions générales jusqu’à leur fin"
                        className="max-h-48 min-w-0 touch-pan-y overflow-y-auto overscroll-contain rounded-xl border border-orange-300 bg-white px-3 py-3 text-[11px] leading-[1.4rem] text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#f97316 #ffedd5' }}
                      >
                        <p className="mb-2"><strong className="text-slate-950">Bienvenue chez CHICAGO !</strong> CHICAGO est une plateforme de jeux multijoueurs basée sur les compétences, la stratégie et les performances. CHICAGO n’est pas un casino; l’objectif est de valoriser les compétences des joueurs.</p>
                        {terms.map((section) => (
                          <div key={section.title} className="mb-4">
                            <h4 className="font-bold text-slate-950">{section.title}</h4>
                            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-1">{paragraph}</p>)}
                          </div>
                        ))}
                        <h4 className="font-bold text-slate-950">Acceptation du contrat</h4>
                        <p>En vous inscrivant, vous confirmez avoir lu et approuvé le contrat, compris les règles de CHICAGO, accepté les règles des jeux et les présentes conditions générales.</p>
                        <p className="mt-2">Exploitant : à compléter. Pays et juridiction : à compléter. Date de mise à jour : 12 novembre 2026.</p>
                        <p className="mt-2 font-bold text-orange-800">CHICAGO – Vos compétences font la différence !</p>
                      </div>
                      {!termsRead && <p className="text-[11px] font-semibold text-orange-900">Faites glisser ce texte vers le haut jusqu’à afficher « Lecture terminée ».</p>}
                      <div className="rounded-xl border border-orange-200 bg-white/70 px-3 py-2 text-[11px] leading-4 text-slate-800">
                        Version démo : les dépôts, retraits, mises et paiements en argent réel ne sont pas actifs. Seuls des crédits fictifs sont disponibles.
                      </div>
                      <div className="grid min-w-0 gap-1.5">
                        {[
                          'J’ai lu et approuvé ce contrat.',
                          'Je comprends les règles et les conditions de CHICAGO.',
                          'Je confirme accepter les règles des jeux et les conditions financières.',
                          'J’accepte les présentes conditions générales d’utilisation.',
                        ].map((text, index) => (
                          <label key={text} className="flex min-h-10 min-w-0 items-start gap-2 rounded-xl border border-orange-200 bg-white/80 px-3 py-2 text-[11px] leading-4 text-slate-800">
                            <input type="checkbox" checked={acceptances[index]} onChange={(event) => setAcceptances((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600" />
                            <span className="min-w-0 break-words">{text}</span>
                          </label>
                        ))}
                      </div>
                    </section>
                  )}

                  {registerStep === 3 && (
                    <div className="grid gap-3 rounded-xl border border-orange-200 bg-white/80 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Vérification anti-robot (démo)</p>
                          <p className="mt-0.5 text-[10px] text-slate-600">Cette addition locale ne protège pas contre les robots en production.</p>
                        </div>
                        <button type="button" disabled={challengeLoading} onClick={() => void loadChallenge()} className="rounded-lg p-2 text-slate-600 hover:bg-orange-100 disabled:opacity-50" aria-label="Recharger la vérification">
                          <RefreshCw size={17} className={challengeLoading ? 'animate-spin' : ''} />
                        </button>
                      </div>
                      <label className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-3 text-sm font-bold text-slate-900">
                        <span>{challenge?.question ?? (challengeLoading ? 'Chargement…' : 'Vérification indisponible')}</span>
                        <input required inputMode="numeric" pattern="[0-9]{1,3}" maxLength={3} value={captchaAnswer} onChange={(event) => setCaptchaAnswer(event.target.value.replace(/\D/g, '').slice(0, 3))} className="min-h-11 rounded-xl border border-orange-200 bg-white px-3 py-2 text-center text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                      </label>
                    </div>
                  )}
                </section>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-3 sm:grid-cols-2 sm:p-4">
                  <label className="grid gap-1 text-xs font-bold text-slate-800">
                    Identifiant à 10 chiffres
                    <input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={id} onChange={(event) => setId(event.target.value.replace(/\D/g, '').slice(0, 10))} autoComplete="username" className="min-h-11 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500" />
                  </label>
                  <label className="grid gap-1 text-xs font-bold text-slate-800">
                    Mot de passe
                    <input required minLength={8} maxLength={16} pattern="[A-Za-z]{8}|[A-Za-z0-9!@#$%_-]{16}" title="Le nouveau mot de passe contient 8 lettres. Les anciens identifiants restent utilisables." type="password" value={password} onChange={(event) => setPassword(event.target.value.replace(/[^A-Za-z0-9!@#$%_-]/g, '').slice(0, 16))} autoComplete="current-password" className="min-h-11 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500" />
                  </label>
                  <label className="grid gap-1 text-xs font-bold text-slate-800 sm:col-span-2">
                    Appareil utilisé
                    <select required value={deviceType} onChange={(event) => setDeviceType(event.target.value)} className="min-h-11 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500">
                      <option value="">Choisir un appareil</option>
                      <option value="phone">Téléphone</option>
                      <option value="tablet">Tablette</option>
                      <option value="computer">Ordinateur</option>
                    </select>
                  </label>
                </div>
                <div className="grid gap-3 rounded-xl border border-orange-200 bg-white/80 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold">Vérification anti-robot (démo)</p>
                      <p className="mt-0.5 text-[10px] text-slate-600">Cette addition locale ne protège pas contre les robots en production.</p>
                    </div>
                    <button type="button" disabled={challengeLoading} onClick={() => void loadChallenge()} className="rounded-lg p-2 text-slate-600 hover:bg-orange-100 disabled:opacity-50" aria-label="Recharger la vérification">
                      <RefreshCw size={17} className={challengeLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                  <label className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-3 text-sm font-bold">
                    <span>{challenge?.question ?? (challengeLoading ? 'Chargement…' : 'Vérification indisponible')}</span>
                    <input required inputMode="numeric" pattern="[0-9]{1,3}" maxLength={3} value={captchaAnswer} onChange={(event) => setCaptchaAnswer(event.target.value.replace(/\D/g, '').slice(0, 3))} className="min-h-11 rounded-xl border border-orange-200 bg-white px-3 py-2 text-center text-base outline-none focus:border-orange-500" />
                  </label>
                </div>
              </>
            )}

            {error && (
              <div role="alert" className="grid gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <p>{error}</p>
                {(error.includes('déjà un compte') || error.includes('associé à un autre compte')) && (
                  <button type="button" onClick={() => { setActiveMode('login'); setError(''); setChallenge(null); void loadChallenge() }} className="w-fit rounded-lg bg-orange-500 px-3 py-2 font-bold text-white">
                    J’ai déjà un compte : me connecter
                  </button>
                )}
              </div>
            )}

            {activeMode === 'register' ? (
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                <button
                  type="button"
                  disabled={registerStep === 1 || busy}
                  onClick={() => { setError(''); setRegisterStep((current) => Math.max(1, current - 1)) }}
                  className="flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-orange-200 bg-white px-2 py-2 text-xs font-bold text-orange-900 disabled:opacity-40 sm:px-3"
                >
                  <ArrowLeft size={15} /> Retour
                </button>
                <span className="text-center text-[10px] font-bold text-slate-600">{registerStep}/3</span>
                {registerStep < 3 ? (
                  <button type="button" disabled={busy} onClick={continueRegistration} className="flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl bg-orange-500 px-2 py-2 text-xs font-black text-white shadow-sm hover:bg-orange-600 disabled:opacity-50 sm:px-4">
                    Continuer <ArrowRight size={15} />
                  </button>
                ) : (
                  <button type="submit" disabled={!canSubmit} className="min-h-11 min-w-0 rounded-xl bg-orange-500 px-2 py-2 text-xs font-black text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 sm:px-4">
                    {busy ? 'Création…' : 'Créer mon compte'}
                  </button>
                )}
              </div>
            ) : (
              <button type="submit" disabled={!canSubmit} className="min-h-11 w-full rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                {busy ? 'Connexion…' : 'Me connecter'}
              </button>
            )}
            <p className="text-center text-[10px] text-slate-600">Important : ne partagez pas vos informations de connexion.</p>
          </form>
        </section>
      </div>
    </main>
  )
}
