'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, getRolePath } from '@/lib/auth'
import { logConsent, DocumentType, DOCUMENT_VERSIONS } from '@/lib/consent-log'

const ROLE_CONSENTS: Record<string, { docs: DocumentType[]; labels: string[] }> = {
  'demo@bedrijf.nl': {
    docs: ['algemene_voorwaarden', 'privacybeleid', 'verwerkersovereenkomst_opdrachtgever'],
    labels: ['Algemene Voorwaarden', 'Privacybeleid', 'Verwerkersovereenkomst'],
  },
  'scout@refurzy.nl': {
    docs: ['scoutovereenkomst', 'algemene_voorwaarden', 'privacybeleid', 'verwerkersovereenkomst_scout'],
    labels: ['Scoutovereenkomst', 'Algemene Voorwaarden', 'Privacybeleid', 'Verwerkersovereenkomst'],
  },
  'kandidaat@refurzy.nl': {
    docs: ['toestemmingsverklaring_kandidaat', 'privacybeleid'],
    labels: ['Toestemmingsverklaring', 'Privacybeleid'],
  },
  'admin@refurzy.nl': {
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

export default function LoginPage() {
  const [email, setEmail] = useState('demo@bedrijf.nl')
  const [password, setPassword] = useState('Nummer1platform')
  const [error, setError] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [consents, setConsents] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const roleConsents = ROLE_CONSENTS[email]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Check if all consents are given (first login = registration)
    if (roleConsents && showRegister) {
      const allChecked = roleConsents.docs.every(doc => consents[doc])
      if (!allChecked) {
        setError('U dient akkoord te gaan met alle voorwaarden.')
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

    const user = login(email, password)
    if (user) {
      router.push('/homepage')
    } else {
      setError('Ongeldige inloggegevens.')
    }
  }

  function handleDemoClick(demoEmail: string) {
    setEmail(demoEmail)
    setShowRegister(true)
    setConsents({})
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/assets/refurzy-logo-white.png" alt="Refurzy" className="h-10 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-navy-light rounded-2xl p-8 border border-purple/20">
          <h2 className="text-xl font-semibold mb-6">Inloggen</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1.5">E-mailadres</label>
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setShowRegister(false) }}
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-colors"
              placeholder="je@email.nl" required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1.5">Wachtwoord</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-colors"
              placeholder="••••••••" required
            />
          </div>

          {/* Consent checkboxes — shown when demo account selected */}
          {showRegister && roleConsents && (
            <div className="mb-6 bg-navy/50 border border-purple/15 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Akkoord met voorwaarden</p>
              {roleConsents.docs.map((doc, i) => (
                <label key={doc} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consents[doc] || false}
                    onChange={(e) => setConsents(prev => ({ ...prev, [doc]: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-navy accent-cyan flex-shrink-0"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Ik ga akkoord met de{' '}
                    <a href={DOC_URLS[doc]} target="_blank" rel="noopener noreferrer" className="text-cyan underline hover:text-cyan/80">
                      {roleConsents.labels[i]}
                    </a>
                    <span className="text-gray-600 text-xs ml-1">(v{DOCUMENT_VERSIONS[doc]})</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          <button type="submit" className="w-full btn-gradient text-white font-semibold py-3 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            {showRegister ? 'Registreren & inloggen' : 'Inloggen'}
          </button>

        </form>

        {/* Wachtwoord vergeten link voor productie-look */}
        <p className="text-center mt-4">
          <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Wachtwoord vergeten?</a>
        </p>
      </div>
    </div>
  )
}
