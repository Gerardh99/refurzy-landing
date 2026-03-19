'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  'Persoonlijke gegevens',
  'Professioneel profiel',
  'Voorwaarden',
  'Account aangemaakt',
]

export default function OnboardingScout() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const [form, setForm] = useState({
    naam: '',
    email: '',
    telefoon: '',
    woonplaats: '',
    land: 'Nederland',
    sectorExpertise: [] as string[],
    jarenErvaring: '',
    linkedinUrl: '',
    scoutovereenkomst: false,
    privacyverklaring: false,
    verwerkersovereenkomst: false,
  })

  const update = (field: string, value: string | boolean | string[]) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleSector = (sector: string) => {
    setForm(prev => ({
      ...prev,
      sectorExpertise: prev.sectorExpertise.includes(sector)
        ? prev.sectorExpertise.filter(s => s !== sector)
        : [...prev.sectorExpertise, sector],
    }))
  }

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }
  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const sectors = ['Technologie', 'Financieel', 'Gezondheidszorg', 'Marketing', 'HR', 'Logistiek', 'Onderwijs', 'Engineering', 'Sales', 'Overig']

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-surface-border px-8 py-4 flex items-center justify-between">
        <img src="/assets/refurzy-logo.png" alt="Refurzy" className="h-7" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <span className="text-sm text-ink-muted">Registratie Talent Scout</span>
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
          {/* Step 1: Persoonlijke gegevens */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">Persoonlijke gegevens</h2>
              <p className="text-sm text-ink-muted mb-6">Vertel ons wie je bent.</p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Woonplaats *</label>
                    <input type="text" value={form.woonplaats} onChange={e => update('woonplaats', e.target.value)}
                      placeholder="Amsterdam" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Land *</label>
                    <select value={form.land} onChange={e => update('land', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                      <option value="Nederland">Nederland</option>
                      <option value="Belgie">België</option>
                      <option value="Duitsland">Duitsland</option>
                      <option value="UK">Verenigd Koninkrijk</option>
                      <option value="Frankrijk">Frankrijk</option>
                      <option value="Anders">Anders</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={next} className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                  Volgende
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Professioneel profiel */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">Professioneel profiel</h2>
              <p className="text-sm text-ink-muted mb-6">Vertel ons over je recruitment-ervaring.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Sector expertise *</label>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map(sector => (
                      <button key={sector} onClick={() => toggleSector(sector)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          form.sectorExpertise.includes(sector)
                            ? 'bg-purple text-white border-purple'
                            : 'bg-white text-ink border-surface-border hover:border-purple/40'
                        }`}>
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Jaren ervaring in recruitment *</label>
                  <select value={form.jarenErvaring} onChange={e => update('jarenErvaring', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                    <option value="">Selecteer</option>
                    <option value="0-1">0-1 jaar</option>
                    <option value="1-3">1-3 jaar</option>
                    <option value="3-5">3-5 jaar</option>
                    <option value="5-10">5-10 jaar</option>
                    <option value="10+">10+ jaar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">LinkedIn profiel URL</label>
                  <input type="url" value={form.linkedinUrl} onChange={e => update('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/jouw-profiel" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
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

          {/* Step 3: Voorwaarden */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">Overeenkomsten accepteren</h2>
              <p className="text-sm text-ink-muted mb-6">Lees en accepteer de volgende documenten om verder te gaan.</p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.scoutovereenkomst} onChange={e => update('scoutovereenkomst', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">Scoutovereenkomst</p>
                    <p className="text-xs text-ink-muted mt-0.5">Ik ga akkoord met de <span className="text-purple underline">Scoutovereenkomst</span> van Refurzy. Dit bevestigt dat ik als onafhankelijk opdrachtnemer werk.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.privacyverklaring} onChange={e => update('privacyverklaring', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">Privacyverklaring</p>
                    <p className="text-xs text-ink-muted mt-0.5">Ik heb de <span className="text-purple underline">Privacyverklaring</span> gelezen en ga akkoord met de verwerking van mijn persoonsgegevens.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.verwerkersovereenkomst} onChange={e => update('verwerkersovereenkomst', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">Verwerkersovereenkomst</p>
                    <p className="text-xs text-ink-muted mt-0.5">Ik ga akkoord met de <span className="text-purple underline">Verwerkersovereenkomst</span>.</p>
                  </div>
                </label>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  Vorige
                </button>
                <button onClick={next}
                  disabled={!form.scoutovereenkomst || !form.privacyverklaring || !form.verwerkersovereenkomst}
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
              <h2 className="text-2xl font-semibold text-ink mb-2">Welkom, Talent Scout!</h2>
              <p className="text-ink-muted mb-8 max-w-md mx-auto">
                Je account is aangemaakt. Begin met het opbouwen van je talent pool door kandidaten uit te nodigen voor de Matching Scan.
              </p>
              <button onClick={() => router.push('/demo/scout')}
                className="px-8 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                Naar dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
