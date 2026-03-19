'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  'Welkom',
  'Persoonlijke gegevens',
  'Toestemming',
  'Account aangemaakt',
]

export default function OnboardingKandidaat() {
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
        <span className="text-sm text-ink-muted">Kandidaat registratie</span>
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
          {/* Step 1: Welkom */}
          {currentStep === 0 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👋</span>
              </div>
              <h2 className="text-2xl font-semibold text-ink mb-2">Welkom!</h2>
              <p className="text-ink-muted mb-6 max-w-md mx-auto">
                Je bent uitgenodigd door <span className="font-semibold text-purple">{scoutNaam}</span> voor de functie van <span className="font-semibold text-ink">{vacatureTitle}</span> bij <span className="font-semibold text-ink">{company}</span>.
              </p>
              <div className="bg-surface-muted rounded-lg p-5 text-left max-w-md mx-auto mb-8">
                <h3 className="text-sm font-semibold text-ink mb-3">Wat gebeurt er?</h3>
                <ol className="space-y-2 text-sm text-ink-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-purple font-semibold">1.</span>
                    Maak je account aan met je basisgegevens
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple font-semibold">2.</span>
                    Vul de Matching Scan in (35 vragen, ca. 15 minuten)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple font-semibold">3.</span>
                    Je M-Score wordt berekend en gedeeld met {scoutNaam}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple font-semibold">4.</span>
                    Bij een match word je anoniem voorgedragen aan de opdrachtgever
                  </li>
                </ol>
              </div>
              <button onClick={next} className="px-8 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                Aan de slag
              </button>
            </div>
          )}

          {/* Step 2: Persoonlijke gegevens */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">Persoonlijke gegevens</h2>
              <p className="text-sm text-ink-muted mb-6">Vul je basisgegevens in om je account aan te maken.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Volledige naam *</label>
                  <input type="text" value={form.naam} onChange={e => update('naam', e.target.value)}
                    placeholder="Voornaam + achternaam" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">E-mailadres *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="naam@email.nl" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Telefoonnummer *</label>
                  <input type="tel" value={form.telefoon} onChange={e => update('telefoon', e.target.value)}
                    placeholder="06-12345678" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  Vorige
                </button>
                <button onClick={next} className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                  Volgende
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Toestemming */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">Toestemming geven</h2>
              <p className="text-sm text-ink-muted mb-6">Om je te kunnen matchen met vacatures hebben we je toestemming nodig.</p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.toestemmingsverklaring} onChange={e => update('toestemmingsverklaring', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">Toestemmingsverklaring</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Ik geef toestemming aan Refurzy om mijn profielgegevens en Matching Scan resultaten te delen met Talent Scout {scoutNaam} en potentiele opdrachtgevers (geanonimiseerd). Zie de volledige <span className="text-purple underline">Toestemmingsverklaring</span>.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.privacyverklaring} onChange={e => update('privacyverklaring', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">Privacyverklaring</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Ik heb de <span className="text-purple underline">Privacyverklaring</span> gelezen en begrijp hoe mijn gegevens worden verwerkt.
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  Vorige
                </button>
                <button onClick={next}
                  disabled={!form.toestemmingsverklaring || !form.privacyverklaring}
                  className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Account aanmaken
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Account aangemaakt */}
          {currentStep === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-semibold text-ink mb-2">Account aangemaakt!</h2>
              <p className="text-ink-muted mb-8 max-w-md mx-auto">
                Welkom{form.naam ? `, ${form.naam.split(' ')[0]}` : ''}! Je account is klaar. De volgende stap is het invullen van de Matching Scan om je M-Score te berekenen.
              </p>
              <button onClick={() => router.push('/demo/kandidaat/scan')}
                className="px-8 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                Start Matching Scan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
