'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    header: 'Kandidaat registratie',
    steps: ['Welkom', 'Persoonlijke gegevens', 'Toestemming', 'Account aangemaakt'],
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
    previous: 'Vorige',
    next: 'Volgende',
    consentTitle: 'Toestemming geven',
    consentSub: 'Om je te kunnen matchen met vacatures hebben we je toestemming nodig.',
    consentStatement: 'Toestemmingsverklaring',
    consentText: (scout: string) =>
      <>Ik geef toestemming aan Refurzy om mijn profielgegevens en Matching Scan resultaten te delen met Talent Scout {scout} en potentiele opdrachtgevers (geanonimiseerd). Zie de volledige <span className="text-purple underline">Toestemmingsverklaring</span>.</>,
    privacyStatement: 'Privacyverklaring',
    privacyText: <>Ik heb de <span className="text-purple underline">Privacyverklaring</span> gelezen en begrijp hoe mijn gegevens worden verwerkt.</>,
    createAccount: 'Account aanmaken',
    accountCreatedTitle: 'Account aangemaakt!',
    accountCreatedText: (naam: string) =>
      `Welkom${naam ? `, ${naam.split(' ')[0]}` : ''}! Je account is klaar. De volgende stap is het invullen van de Matching Scan om je M-Score te berekenen.`,
    startScan: 'Start Matching Scan',
  },
  en: {
    header: 'Candidate Registration',
    steps: ['Welcome', 'Personal Details', 'Consent', 'Account Created'],
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
    previous: 'Previous',
    next: 'Next',
    consentTitle: 'Give Consent',
    consentSub: 'We need your consent to match you with vacancies.',
    consentStatement: 'Consent Statement',
    consentText: (scout: string) =>
      <>I consent to Refurzy sharing my profile data and Matching Scan results with Talent Scout {scout} and potential employers (anonymised). See the full <span className="text-purple underline">Consent Statement</span>.</>,
    privacyStatement: 'Privacy Policy',
    privacyText: <>I have read the <span className="text-purple underline">Privacy Policy</span> and understand how my data is processed.</>,
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

  const [form, setForm] = useState({
    naam: '',
    email: '',
    telefoon: '',
    toestemmingsverklaring: false,
    privacyverklaring: false,
  })

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
      {/* Header */}
      <header className="bg-white border-b border-surface-border px-8 py-4 flex items-center justify-between">
        <img src="/assets/refurzy-logo.png" alt="Refurzy" className="h-7" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <span className="text-sm text-ink-muted">{t.header}</span>
      </header>

      {/* Progress stepper */}
      <div className="bg-white border-b border-surface-border px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                    i < currentStep ? 'bg-purple text-white border-purple' :
                    i === currentStep ? 'bg-white text-purple border-purple' :
                    'bg-surface-muted text-ink-muted border-surface-border'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 whitespace-nowrap ${
                    i <= currentStep ? 'text-ink font-medium' : 'text-ink-muted'
                  }`}>{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mt-[-1rem] ${
                    i < currentStep ? 'bg-purple' : 'bg-surface-border'
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

          {/* Step 3: Consent */}
          {currentStep === 2 && (
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

          {/* Step 4: Account created */}
          {currentStep === 3 && (
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
