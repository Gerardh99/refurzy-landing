'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/i18n'
import { TALEN, TAALNIVEAUS, TAALNIVEAU_LABELS } from '@/lib/constants'
import type { TaalBeheersing } from '@/lib/types'

const texts = {
  nl: {
    header: 'Kandidaat registratie',
    steps: ['Welkom', 'Gegevens', 'E-mail verificatie', 'Voorkeuren', 'Toestemming', 'Klaar'],
    welcomeTitle: 'Welkom!',
    welcomeInvite: (scout: string, title: string, company: string) =>
      <>Je bent uitgenodigd door <span className="font-semibold text-purple">{scout}</span> voor de functie van <span className="font-semibold text-ink">{title}</span> bij <span className="font-semibold text-ink">{company}</span>.</>,
    whatHappens: 'Wat gebeurt er?',
    step1: 'Maak je account aan met je basisgegevens',
    step2: 'Vul de Matching Scan in (35 vragen, ca. 15 minuten)',
    step3: (scout: string) => `Je M-Score wordt berekend en gedeeld met ${scout}`,
    step4: 'Bij een match word je anoniem voorgedragen aan de opdrachtgever',
    getStarted: 'Aan de slag',
    personalDetails: 'Persoonlijke gegevens',
    personalDetailsSub: 'Vul je basisgegevens in om je account aan te maken.',
    fullName: 'Volledige naam *',
    fullNamePlaceholder: 'Voornaam + achternaam',
    email: 'E-mailadres *',
    phone: 'Telefoonnummer *',
    currentRole: 'Huidige functie *',
    currentRolePlaceholder: 'Bijv. Marketing Manager bij Bedrijf X',
    preferredRole: 'Gewenste functie *',
    preferredRolePlaceholder: 'Bijv. Senior Marketing Manager',
    previous: 'Vorige',
    next: 'Volgende',
    emailVerifyTitle: 'E-mail verificatie',
    emailVerifyDesc: (email: string) => `We hebben een verificatiecode gestuurd naar ${email}. Controleer je inbox en voer de code in om je e-mailadres te bevestigen.`,
    emailVerifyCodeLabel: 'Verificatiecode',
    emailVerifyBtn: 'Verifiëren',
    emailVerifyResend: 'Opnieuw versturen',
    emailVerifyResent: 'Verificatiecode opnieuw verstuurd',
    consentTitle: 'Toestemming geven',
    consentSub: 'Om je te kunnen matchen met vacatures hebben we je toestemming nodig.',
    consentStatement: 'Toestemmingsverklaring',
    consentText: (scout: string) =>
      <>Ik geef toestemming aan Refurzy om mijn profielgegevens en Matching Scan resultaten te delen met Talent Scout {scout} en potentiele opdrachtgevers (geanonimiseerd). Zie de volledige <span className="text-purple underline">Toestemmingsverklaring</span>.</>,
    privacyStatement: 'Privacyverklaring',
    privacyText: <>Ik heb de <span className="text-purple underline">Privacyverklaring</span> gelezen en begrijp hoe mijn gegevens worden verwerkt.</>,
    preferencesTitle: 'Werkvoorkeuren',
    preferencesSub: 'Vul je voorkeuren in zodat we je met de juiste vacatures kunnen matchen.',
    salaryLabel: 'Salarisverwachting (bruto per maand)',
    salaryMin: 'Minimum',
    salaryMax: 'Maximum',
    travelLabel: 'Maximale reistijd',
    officeLabel: 'Bereidheid op kantoor',
    languagesLabel: 'Talen die je beheerst',
    addLanguage: 'Taal toevoegen',
    createAccount: 'Account aanmaken',
    accountCreatedTitle: 'Account aangemaakt!',
    accountCreatedText: (naam: string) =>
      `Welkom${naam ? `, ${naam.split(' ')[0]}` : ''}! Je account is klaar. De volgende stap is het invullen van de Matching Scan om je M-Score te berekenen.`,
    startScan: 'Start Matching Scan',
  },
  en: {
    header: 'Candidate Registration',
    steps: ['Welcome', 'Details', 'Email Verification', 'Preferences', 'Consent', 'Done'],
    welcomeTitle: 'Welcome!',
    welcomeInvite: (scout: string, title: string, company: string) =>
      <>You&apos;ve been invited by <span className="font-semibold text-purple">{scout}</span> for the position of <span className="font-semibold text-ink">{title}</span> at <span className="font-semibold text-ink">{company}</span>.</>,
    whatHappens: 'What happens next?',
    step1: 'Create your account with basic details',
    step2: 'Complete the Matching Scan (35 questions, approx. 15 minutes)',
    step3: (scout: string) => `Your M-Score is calculated and shared with ${scout}`,
    step4: "If there's a match, you'll be anonymously nominated to the employer",
    getStarted: 'Get started',
    personalDetails: 'Personal Details',
    personalDetailsSub: 'Enter your basic details to create your account.',
    fullName: 'Full name *',
    fullNamePlaceholder: 'First name + last name',
    email: 'Email address *',
    phone: 'Phone number *',
    currentRole: 'Current role *',
    currentRolePlaceholder: 'E.g. Marketing Manager at Company X',
    preferredRole: 'Preferred role *',
    preferredRolePlaceholder: 'E.g. Senior Marketing Manager',
    previous: 'Previous',
    next: 'Next',
    emailVerifyTitle: 'Email Verification',
    emailVerifyDesc: (email: string) => `We have sent a verification code to ${email}. Check your inbox and enter the code to verify your email address.`,
    emailVerifyCodeLabel: 'Verification code',
    emailVerifyBtn: 'Verify',
    emailVerifyResend: 'Resend',
    emailVerifyResent: 'Verification code resent',
    consentTitle: 'Give Consent',
    consentSub: 'We need your consent to match you with vacancies.',
    consentStatement: 'Consent Statement',
    consentText: (scout: string) =>
      <>I consent to Refurzy sharing my profile data and Matching Scan results with Talent Scout {scout} and potential employers (anonymised). See the full <span className="text-purple underline">Consent Statement</span>.</>,
    privacyStatement: 'Privacy Policy',
    privacyText: <>I have read the <span className="text-purple underline">Privacy Policy</span> and understand how my data is processed.</>,
    preferencesTitle: 'Work Preferences',
    preferencesSub: 'Fill in your preferences so we can match you with the right vacancies.',
    salaryLabel: 'Salary expectation (gross per month)',
    salaryMin: 'Minimum',
    salaryMax: 'Maximum',
    travelLabel: 'Maximum commute time',
    officeLabel: 'Willingness to work in office',
    languagesLabel: 'Languages you speak',
    addLanguage: 'Add language',
    createAccount: 'Create account',
    accountCreatedTitle: 'Account created!',
    accountCreatedText: (naam: string) =>
      `Welcome${naam ? `, ${naam.split(' ')[0]}` : ''}! Your account is ready. The next step is completing the Matching Scan to calculate your M-Score.`,
    startScan: 'Start Matching Scan',
  },
} as const

export default function OnboardingKandidaat() {
  const { lang } = useLang()
  const t = texts[lang] || texts.nl
  const steps = t.steps

  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const [emailCode, setEmailCode] = useState('123456')
  const [emailResent, setEmailResent] = useState(false)

  const [form, setForm] = useState({
    naam: '',
    email: '',
    telefoon: '',
    huidigeRol: '',
    voorkeursFunctie: '',
    salarisMin: '',
    salarisMax: '',
    maxReistijd: '45 minuten',
    opKantoor: 'Hybride (3 dagen)',
    toestemmingsverklaring: false,
    privacyverklaring: false,
  })
  const [talen, setTalen] = useState<TaalBeheersing[]>([{ taal: 'Nederlands', niveau: 'C2' }])

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }
  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  // Mock scout name from "invitation link"
  const scoutNaam = 'Sophie de Graaf'
  const vacatureTitle = 'Marketing Manager'
  const company = 'TechVentures B.V.'

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header + Progress stepper on navy background */}
      <div className="bg-navy px-8 pt-4 pb-6">
        <header className="flex items-center justify-between mb-6">
          <img src="/logo-white.png" alt="Refurzy" className="h-7" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <span className="text-sm text-white/50">{t.header}</span>
        </header>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                    i < currentStep ? 'bg-purple text-white border-purple' :
                    i === currentStep ? 'bg-white text-purple border-purple' :
                    'bg-white/10 text-white/40 border-white/20'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 whitespace-nowrap ${
                    i <= currentStep ? 'text-white font-medium' : 'text-white/40'
                  }`}>{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mt-[-1rem] ${
                    i < currentStep ? 'bg-purple' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-xl border border-surface-border p-8">
          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👋</span>
              </div>
              <h2 className="text-2xl font-semibold text-ink mb-2">{t.welcomeTitle}</h2>
              <p className="text-ink-muted mb-6 max-w-md mx-auto">
                {t.welcomeInvite(scoutNaam, vacatureTitle, company)}
              </p>
              <div className="bg-surface-muted rounded-lg p-5 text-left max-w-md mx-auto mb-8">
                <h3 className="text-sm font-semibold text-ink mb-3">{t.whatHappens}</h3>
                <ol className="space-y-2 text-sm text-ink-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-purple font-semibold">1.</span>
                    {t.step1}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple font-semibold">2.</span>
                    {t.step2}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple font-semibold">3.</span>
                    {t.step3(scoutNaam)}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple font-semibold">4.</span>
                    {t.step4}
                  </li>
                </ol>
              </div>
              <button onClick={next} className="px-8 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                {t.getStarted}
              </button>
            </div>
          )}

          {/* Step 2: Personal details */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.personalDetails}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.personalDetailsSub}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.fullName}</label>
                  <input type="text" value={form.naam} onChange={e => update('naam', e.target.value)}
                    placeholder={t.fullNamePlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.email}</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="naam@email.nl" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.phone}</label>
                  <input type="tel" value={form.telefoon} onChange={e => update('telefoon', e.target.value)}
                    placeholder="06-12345678" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.currentRole}</label>
                  <input type="text" value={form.huidigeRol} onChange={e => update('huidigeRol', e.target.value)}
                    placeholder={t.currentRolePlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.preferredRole}</label>
                  <input type="text" value={form.voorkeursFunctie} onChange={e => update('voorkeursFunctie', e.target.value)}
                    placeholder={t.preferredRolePlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  {t.previous}
                </button>
                <button onClick={next} className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Email Verificatie */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.emailVerifyTitle}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.emailVerifyDesc(form.email || 'naam@email.nl')}</p>
              <div className="bg-surface-muted rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-medium text-ink">{form.email || 'naam@email.nl'}</p>
                    <p className="text-xs text-ink-muted">Voer de 6-cijferige code in die je hebt ontvangen</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.emailVerifyCodeLabel}</label>
                  <input type="text" value={emailCode} onChange={e => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000" maxLength={6}
                    className="w-full px-4 py-3 rounded-lg border border-surface-border bg-white text-ink text-center text-2xl tracking-[0.5em] font-mono placeholder:text-ink-muted placeholder:tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
              </div>
              <button onClick={next}
                disabled={emailCode.length !== 6}
                className="w-full px-6 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {t.emailVerifyBtn}
              </button>
              <div className="text-center mt-4">
                <button onClick={() => { setEmailResent(true); setTimeout(() => setEmailResent(false), 3000) }}
                  className="text-sm text-purple hover:text-purple-dark font-medium transition-colors">
                  {t.emailVerifyResend}
                </button>
                {emailResent && (
                  <p className="text-xs text-green-600 mt-2">{t.emailVerifyResent}</p>
                )}
              </div>
              <div className="flex justify-start mt-6">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  {t.previous}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.preferencesTitle}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.preferencesSub}</p>
              <div className="space-y-5">
                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.salaryLabel}</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">€</span>
                      <input type="number" value={form.salarisMin} onChange={e => update('salarisMin', e.target.value)}
                        placeholder={t.salaryMin} className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                    </div>
                    <span className="text-ink-muted">–</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">€</span>
                      <input type="number" value={form.salarisMax} onChange={e => update('salarisMax', e.target.value)}
                        placeholder={t.salaryMax} className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                    </div>
                  </div>
                </div>

                {/* Travel time */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.travelLabel}</label>
                  <select value={form.maxReistijd} onChange={e => update('maxReistijd', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                    <option>15 minuten</option><option>30 minuten</option><option>45 minuten</option><option>60 minuten</option><option>Niet van toepassing</option>
                  </select>
                </div>

                {/* Office days */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.officeLabel}</label>
                  <select value={form.opKantoor} onChange={e => update('opKantoor', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                    <option>Op kantoor (5 dagen)</option><option>Hybride (3 dagen)</option><option>Hybride (2 dagen)</option><option>Volledig remote</option>
                  </select>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.languagesLabel}</label>
                  {talen.map((taalItem, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <select value={taalItem.taal} onChange={e => {
                        const updated = [...talen]; updated[idx] = { ...updated[idx], taal: e.target.value }; setTalen(updated)
                      }} className="flex-1 px-4 py-2.5 rounded-lg border border-surface-border bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                        <option value="">Selecteer...</option>
                        {TALEN.filter(t => t === taalItem.taal || !talen.some(x => x.taal === t)).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <select value={taalItem.niveau} onChange={e => {
                        const updated = [...talen]; updated[idx] = { ...updated[idx], niveau: e.target.value as TaalBeheersing['niveau'] }; setTalen(updated)
                      }} className="w-44 px-4 py-2.5 rounded-lg border border-surface-border bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                        {TAALNIVEAUS.map(n => <option key={n} value={n}>{n} — {TAALNIVEAU_LABELS[n]}</option>)}
                      </select>
                      {talen.length > 1 && (
                        <button type="button" onClick={() => setTalen(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-red-400 hover:text-red-500 rounded transition-colors" title="Verwijderen">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setTalen(prev => [...prev, { taal: '', niveau: 'B1' }])}
                    className="mt-1 flex items-center gap-2 text-sm text-purple hover:text-purple-dark font-medium transition-colors">
                    <span className="w-5 h-5 rounded-full border-2 border-purple/40 flex items-center justify-center text-xs">+</span>
                    {t.addLanguage}
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  {t.previous}
                </button>
                <button onClick={next} className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Consent */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.consentTitle}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.consentSub}</p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.toestemmingsverklaring} onChange={e => update('toestemmingsverklaring', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.consentStatement}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {t.consentText(scoutNaam)}
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.privacyverklaring} onChange={e => update('privacyverklaring', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.privacyStatement}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {t.privacyText}
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  {t.previous}
                </button>
                <button onClick={next}
                  disabled={!form.toestemmingsverklaring || !form.privacyverklaring}
                  className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {t.createAccount}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Account created */}
          {currentStep === 5 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-semibold text-ink mb-2">{t.accountCreatedTitle}</h2>
              <p className="text-ink-muted mb-8 max-w-md mx-auto">
                {t.accountCreatedText(form.naam)}
              </p>
              <button onClick={() => router.push('/demo/kandidaat/scan')}
                className="px-8 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                {t.startScan}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
