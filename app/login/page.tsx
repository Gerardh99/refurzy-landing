'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, profileLogin, getRolePath } from '@/lib/auth'
import { logConsent, DocumentType, DOCUMENT_VERSIONS } from '@/lib/consent-log'
import type { Lang } from '@/lib/i18n'
import LangToggle from '@/components/LangToggle'

const loginTexts = {
  nl: {
    subtitle: 'Demo Platform',
    pickProfile: 'Kies een profiel om in te loggen',
    heading: 'Inloggen',
    emailLabel: 'E-mailadres',
    emailPlaceholder: 'je@email.nl',
    passwordLabel: 'Wachtwoord',
    consentHeading: 'Akkoord met voorwaarden',
    consentPrefix: 'Ik ga akkoord met de',
    submitLogin: 'Inloggen',
    submitRegister: 'Registreren & inloggen',
    noAccess: 'Vraag uw demo-inloggegevens aan via',
    forgotPassword: 'Wachtwoord vergeten?',
    invalidCredentials: 'Ongeldige inloggegevens.',
    consentRequired: 'U dient akkoord te gaan met alle voorwaarden.',
  },
  en: {
    subtitle: 'Demo Platform',
    pickProfile: 'Choose a profile to log in',
    heading: 'Log in',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@email.com',
    passwordLabel: 'Password',
    consentHeading: 'Agree to terms',
    consentPrefix: 'I agree to the',
    submitLogin: 'Log in',
    submitRegister: 'Register & log in',
    noAccess: 'Request your demo credentials at',
    forgotPassword: 'Forgot password?',
    invalidCredentials: 'Invalid credentials.',
    consentRequired: 'You must agree to all terms.',
  },
}

const ROLE_CONSENTS: Record<string, { docs: DocumentType[]; labels: string[] }> = {
  'demo@bedrijf.nl': {
    docs: ['algemene_voorwaarden', 'privacybeleid', 'verwerkersovereenkomst_opdrachtgever'],
    labels: ['Algemene Voorwaarden', 'Privacybeleid', 'Verwerkersovereenkomst'],
  },
  'scout@refurzy.com': {
    docs: ['scoutovereenkomst', 'algemene_voorwaarden', 'privacybeleid', 'verwerkersovereenkomst_scout'],
    labels: ['Scoutovereenkomst', 'Algemene Voorwaarden', 'Privacybeleid', 'Verwerkersovereenkomst'],
  },
  'kandidaat@email.com': {
    docs: ['toestemmingsverklaring_kandidaat', 'privacybeleid'],
    labels: ['Toestemmingsverklaring', 'Privacybeleid'],
  },
  'admin@refurzy.com': {
    docs: ['algemene_voorwaarden', 'privacybeleid'],
    labels: ['Algemene Voorwaarden', 'Privacybeleid'],
  },
}

const DOC_URLS: Record<DocumentType, string> = {
  algemene_voorwaarden: '/juridisch/algemene-voorwaarden',
  plaatsingsovereenkomst: '/juridisch/plaatsingsovereenkomst',
  scoutovereenkomst: '/juridisch/scoutovereenkomst',
  privacybeleid: '/juridisch/privacybeleid',
  verwerkersovereenkomst_opdrachtgever: '/juridisch/verwerkersovereenkomst',
  verwerkersovereenkomst_scout: '/juridisch/verwerkersovereenkomst-scout',
  toestemmingsverklaring_kandidaat: '/juridisch/toestemmingsverklaring',
  cookiebeleid: '/juridisch/cookiebeleid',
}

const PROFILE_CARDS = [
  { icon: '\uD83D\uDC54', label: 'Opdrachtgever', name: 'Daan Verhoeven', email: 'demo@bedrijf.nl', color: 'from-cyan/20 to-cyan/5', border: 'border-cyan/30', hoverBorder: 'hover:border-cyan/60' },
  { icon: '\uD83D\uDD0D', label: 'Talent Scout', name: 'Lisa de Groot', email: 'scout@refurzy.com', color: 'from-purple/20 to-purple/5', border: 'border-purple/30', hoverBorder: 'hover:border-purple/60' },
  { icon: '\uD83D\uDC64', label: 'Kandidaat', name: 'Thomas Bakker', email: 'kandidaat@email.com', color: 'from-blue-400/20 to-blue-400/5', border: 'border-blue-400/30', hoverBorder: 'hover:border-blue-400/60' },
  { icon: '\u2699\uFE0F', label: 'Admin', name: 'Refurzy Admin', email: 'admin@refurzy.com', color: 'from-gray-400/20 to-gray-400/5', border: 'border-gray-400/30', hoverBorder: 'hover:border-gray-400/60' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [consents, setConsents] = useState<Record<string, boolean>>({})
  const [hasDemoAccess, setHasDemoAccess] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [lang, setLangState] = useState<Lang>('nl')
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('refurzy_lang') as Lang
    if (saved === 'nl' || saved === 'en') setLangState(saved)
  }, [])

  function changeLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('refurzy_lang', l)
  }

  const lt = loginTexts[lang]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const access = sessionStorage.getItem('refurzy_demo_access')
      setHasDemoAccess(access === 'true')
    }
  }, [])

  const roleConsents = ROLE_CONSENTS[email]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Check if all consents are given (first login = registration)
    if (roleConsents && showRegister) {
      const allChecked = roleConsents.docs.every(doc => consents[doc])
      if (!allChecked) {
        setError(lt.consentRequired)
        return
      }
      // Log all consents
      const role = email.includes('bedrijf') ? 'opdrachtgever'
        : email.includes('scout') ? 'scout'
        : email.includes('kandidaat') ? 'kandidaat'
        : 'admin'
      roleConsents.docs.forEach(doc => {
        logConsent(email, role as 'opdrachtgever' | 'scout' | 'kandidaat' | 'admin', doc, true, 'checkbox')
      })
    }

    // Profile switch (via profile card): no password needed
    // Normal login (typed credentials): requires password
    const user = selectedProfile
      ? await profileLogin(email)
      : await login(email, password)
    if (user) {
      // demo@refurzy.com is the gate account — redirect to /homepage and set demo access
      if (email.toLowerCase() === 'demo@refurzy.com') {
        sessionStorage.setItem('refurzy_demo_access', 'true')
        router.push('/homepage')
      } else {
        router.push(getRolePath(user.role))
      }
    } else {
      setError(lt.invalidCredentials)
    }
  }

  function handleProfileClick(profileEmail: string) {
    setEmail(profileEmail)
    setPassword('')
    setSelectedProfile(profileEmail)
    setShowRegister(true)
    setConsents({})
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 relative">
      {/* Lang toggle top-right */}
      <div className="absolute top-5 right-6">
        <LangToggle lang={lang} setLang={changeLang} variant="dark" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo-dark.png" alt="Refurzy" className="h-10 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">{lt.subtitle}</p>
        </div>

        {/* Profile picker — only shown when user has demo access */}
        {hasDemoAccess && (
          <div className="mb-6">
            <p className="text-sm text-gray-400 text-center mb-4">{lt.pickProfile}</p>
            <div className="grid grid-cols-2 gap-3">
              {PROFILE_CARDS.map(card => (
                <button
                  key={card.email}
                  onClick={() => handleProfileClick(card.email)}
                  className={`
                    bg-gradient-to-br ${card.color} border ${card.border} ${card.hoverBorder}
                    rounded-xl p-4 text-left transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple/5
                    ${selectedProfile === card.email ? 'ring-2 ring-cyan/50 -translate-y-0.5 shadow-lg shadow-cyan/10' : ''}
                  `}
                >
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <div className="text-sm font-semibold text-white">{card.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{card.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">{card.email}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-navy-light rounded-2xl p-8 border border-purple/20">
          <h2 className="text-xl font-semibold mb-6">{lt.heading}</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1.5">{lt.emailLabel}</label>
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setShowRegister(false); setSelectedProfile(null) }}
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-colors"
              placeholder={lt.emailPlaceholder} required
            />
          </div>

          {/* Password field: hidden when using profile card (no password needed) */}
          {!selectedProfile && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1.5">{lt.passwordLabel}</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-colors"
                placeholder="••••••••" required
              />
            </div>
          )}

          {/* Consent checkboxes — shown when demo account selected */}
          {showRegister && roleConsents && (
            <div className="mb-6 bg-navy/50 border border-purple/15 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">{lt.consentHeading}</p>
              {roleConsents.docs.map((doc, i) => (
                <label key={doc} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consents[doc] || false}
                    onChange={(e) => setConsents(prev => ({ ...prev, [doc]: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-navy accent-cyan flex-shrink-0"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {lt.consentPrefix}{' '}
                    <a href={DOC_URLS[doc]} target="_blank" rel="noopener noreferrer" className="text-cyan underline hover:text-cyan/80">
                      {roleConsents.labels[i]}
                    </a>
                    <span className="text-gray-500 text-xs ml-1">(v{DOCUMENT_VERSIONS[doc]})</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          <button type="submit" className="w-full btn-gradient text-white font-semibold py-3 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            {showRegister ? lt.submitRegister : lt.submitLogin}
          </button>

          {/* Hint for non-demo users */}
          {!hasDemoAccess && (
            <p className="text-xs text-gray-500 text-center mt-4">
              {lt.noAccess}{' '}
              <a href="mailto:info@refurzy.com" className="text-cyan/70 hover:text-cyan transition-colors">info@refurzy.com</a>
            </p>
          )}

        </form>

        <p className="text-center mt-4">
          <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">{lt.forgotPassword}</a>
        </p>
      </div>
    </div>
  )
}
