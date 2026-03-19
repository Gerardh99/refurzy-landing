'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  'Bedrijfsgegevens',
  'Contactpersoon',
  'KVK Verificatie',
  'Voorwaarden',
  'Account aangemaakt',
]

export default function OnboardingOpdrachtgever() {
  const [currentStep, setCurrentStep] = useState(0)
  const [kvkExists, setKvkExists] = useState(false)
  const [accessRequestSent, setAccessRequestSent] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    kvkNummer: '',
    bedrijfsnaam: '',
    adres: '',
    postcode: '',
    plaats: '',
    sector: '',
    naam: '',
    email: '',
    telefoon: '',
    functie: '',
    algVoorwaarden: false,
    privacyverklaring: false,
    verwerkersovereenkomst: false,
  })

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }
  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  // Mock KVK check: "12345678" is already registered
  const checkKvk = () => {
    if (form.kvkNummer === '12345678') {
      setKvkExists(true)
    } else {
      setKvkExists(false)
      next()
    }
  }

  const sendAccessRequest = () => {
    setAccessRequestSent(true)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-surface-border px-8 py-4 flex items-center justify-between">
        <img src="/assets/refurzy-logo.png" alt="Refurzy" className="h-7" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <span className="text-sm text-ink-muted">Registratie Opdrachtgever</span>
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
          {/* Step 1: Bedrijfsgegevens */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">Bedrijfsgegevens</h2>
              <p className="text-sm text-ink-muted mb-6">Vul de gegevens van uw bedrijf in.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">KVK Nummer *</label>
                  <input type="text" value={form.kvkNummer} onChange={e => update('kvkNummer', e.target.value)}
                    placeholder="Bijv. 87654321" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Bedrijfsnaam *</label>
                  <input type="text" value={form.bedrijfsnaam} onChange={e => update('bedrijfsnaam', e.target.value)}
                    placeholder="Uw bedrijfsnaam" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Adres *</label>
                    <input type="text" value={form.adres} onChange={e => update('adres', e.target.value)}
                      placeholder="Straat + huisnummer" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Postcode *</label>
                    <input type="text" value={form.postcode} onChange={e => update('postcode', e.target.value)}
                      placeholder="1234 AB" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Plaats *</label>
                    <input type="text" value={form.plaats} onChange={e => update('plaats', e.target.value)}
                      placeholder="Amsterdam" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Sector *</label>
                    <select value={form.sector} onChange={e => update('sector', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                      <option value="">Selecteer sector</option>
                      <option value="tech">Technologie</option>
                      <option value="finance">Financieel</option>
                      <option value="health">Gezondheidszorg</option>
                      <option value="retail">Retail</option>
                      <option value="logistics">Logistiek</option>
                      <option value="education">Onderwijs</option>
                      <option value="overig">Overig</option>
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

          {/* Step 2: Contactpersoon */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">Contactpersoon</h2>
              <p className="text-sm text-ink-muted mb-6">Wie is het eerste aanspreekpunt?</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Volledige naam *</label>
                  <input type="text" value={form.naam} onChange={e => update('naam', e.target.value)}
                    placeholder="Voornaam + achternaam" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">E-mailadres *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="naam@bedrijf.nl" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Telefoonnummer *</label>
                  <input type="tel" value={form.telefoon} onChange={e => update('telefoon', e.target.value)}
                    placeholder="06-12345678" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Functie *</label>
                  <input type="text" value={form.functie} onChange={e => update('functie', e.target.value)}
                    placeholder="Bijv. HR Manager" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
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

          {/* Step 3: KVK Verificatie */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">KVK Verificatie</h2>
              <p className="text-sm text-ink-muted mb-6">We controleren of uw KVK-nummer al bekend is in ons systeem.</p>

              {!kvkExists && !accessRequestSent && (
                <div>
                  <div className="bg-surface-muted rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🔍</span>
                      <div>
                        <p className="font-medium text-ink">KVK-nummer: {form.kvkNummer || '—'}</p>
                        <p className="text-sm text-ink-muted">Bedrijf: {form.bedrijfsnaam || '—'}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={checkKvk} className="w-full px-6 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                    Verifieer KVK-nummer
                  </button>
                  <p className="text-xs text-ink-muted mt-3 text-center">
                    Demo: gebruik KVK &quot;12345678&quot; om de duplicaatcheck te testen.
                  </p>
                </div>
              )}

              {kvkExists && !accessRequestSent && (
                <div>
                  <div className="bg-orange/10 border border-orange/30 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <p className="font-medium text-ink">Dit KVK-nummer is al geregistreerd</p>
                        <p className="text-sm text-ink-muted mt-1">
                          Het bedrijf &quot;TechVentures B.V.&quot; met KVK {form.kvkNummer} heeft al een account.
                          U kunt een toegangsverzoek sturen naar de beheerder van dit account.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setKvkExists(false) }} className="flex-1 px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                      KVK wijzigen
                    </button>
                    <button onClick={sendAccessRequest} className="flex-1 px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                      Toegangsverzoek sturen
                    </button>
                  </div>
                </div>
              )}

              {accessRequestSent && (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-medium text-ink">Verzoek verstuurd!</p>
                        <p className="text-sm text-ink-muted mt-1">
                          De beheerder van TechVentures B.V. ontvangt een e-mail met uw verzoek.
                          U krijgt bericht zodra uw toegang is goedgekeurd.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => router.push('/login')} className="w-full px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                    Terug naar inloggen
                  </button>
                </div>
              )}

              {!kvkExists && !accessRequestSent && (
                <div className="flex justify-between mt-6">
                  <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                    Vorige
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Voorwaarden */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">Voorwaarden accepteren</h2>
              <p className="text-sm text-ink-muted mb-6">Lees en accepteer de volgende documenten om verder te gaan.</p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.algVoorwaarden} onChange={e => update('algVoorwaarden', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">Algemene Voorwaarden</p>
                    <p className="text-xs text-ink-muted mt-0.5">Ik ga akkoord met de <span className="text-purple underline">Algemene Voorwaarden</span> van Refurzy.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.privacyverklaring} onChange={e => update('privacyverklaring', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">Privacyverklaring</p>
                    <p className="text-xs text-ink-muted mt-0.5">Ik heb de <span className="text-purple underline">Privacyverklaring</span> gelezen en ga akkoord.</p>
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
                  disabled={!form.algVoorwaarden || !form.privacyverklaring || !form.verwerkersovereenkomst}
                  className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Account aanmaken
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Account aangemaakt */}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-semibold text-ink mb-2">Account aangemaakt!</h2>
              <p className="text-ink-muted mb-8 max-w-md mx-auto">
                Welkom bij Refurzy, {form.bedrijfsnaam || 'uw bedrijf'}. Uw account is succesvol aangemaakt. U wordt doorverwezen naar uw dashboard.
              </p>
              <button onClick={() => router.push('/demo/opdrachtgever')}
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
