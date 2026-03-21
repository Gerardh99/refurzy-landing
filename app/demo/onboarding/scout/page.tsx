'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    header: 'Registratie Talent Scout',
    steps: ['Persoonlijke gegevens', 'Professioneel profiel', 'Voorwaarden', 'Account aangemaakt'],
    // Step 1
    step1Title: 'Persoonlijke gegevens',
    step1Desc: 'Vertel ons wie je bent.',
    fullName: 'Volledige naam *',
    fullNamePlaceholder: 'Voornaam + achternaam',
    email: 'E-mailadres *',
    phone: 'Telefoonnummer *',
    city: 'Woonplaats *',
    country: 'Land *',
    countries: {
      Nederland: 'Nederland',
      Belgie: 'België',
      Duitsland: 'Duitsland',
      UK: 'Verenigd Koninkrijk',
      Frankrijk: 'Frankrijk',
      Anders: 'Anders',
    },
    kvk: 'KVK-nummer (optioneel)',
    kvkPlaceholder: '12345678',
    kvkHelp: 'Vul je KVK-nummer in als je een bedrijf hebt. Zonder KVK word je als particulier behandeld en worden betalingen gelogd voor de Belastingdienst (IB-47).',
    kvkZakelijk: 'Zakelijke relatie',
    kvkParticulier: 'Particuliere relatie — betalingen worden gelogd voor belastingaangifte',
    next: 'Volgende',
    // Step 2
    step2Title: 'Professioneel profiel',
    step2Desc: 'Vertel ons over je recruitment-ervaring.',
    sectorExpertise: 'Sector expertise *',
    sectors: ['Technologie', 'Financieel', 'Gezondheidszorg', 'Marketing', 'HR', 'Logistiek', 'Onderwijs', 'Engineering', 'Sales', 'Overig'],
    yearsExperience: 'Jaren ervaring in recruitment *',
    selectPlaceholder: 'Selecteer',
    yearOptions: ['0-1 jaar', '1-3 jaar', '3-5 jaar', '5-10 jaar', '10+ jaar'],
    linkedin: 'LinkedIn profiel URL',
    previous: 'Vorige',
    // Step 3
    step3Title: 'Overeenkomsten accepteren',
    step3Desc: 'Lees en accepteer de volgende documenten om verder te gaan.',
    scoutAgreementTitle: 'Scoutovereenkomst',
    scoutAgreementDesc: 'Ik ga akkoord met de Scoutovereenkomst van Refurzy. Dit bevestigt dat ik als onafhankelijk opdrachtnemer werk.',
    scoutAgreementLink: 'Scoutovereenkomst',
    privacyTitle: 'Privacyverklaring',
    privacyDesc: 'Ik heb de Privacyverklaring gelezen en ga akkoord met de verwerking van mijn persoonsgegevens.',
    privacyLink: 'Privacyverklaring',
    dpaTitle: 'Verwerkersovereenkomst',
    dpaDesc: 'Ik ga akkoord met de Verwerkersovereenkomst.',
    dpaLink: 'Verwerkersovereenkomst',
    createAccount: 'Account aanmaken',
    // Step 4
    step4Title: 'Welkom, Talent Scout!',
    step4Desc: 'Je account is aangemaakt. Begin met het opbouwen van je talent pool door kandidaten uit te nodigen voor de Matching Scan.',
    goToDashboard: 'Naar dashboard',
  },
  en: {
    header: 'Talent Scout Registration',
    steps: ['Personal Details', 'Professional Profile', 'Terms', 'Account Created'],
    // Step 1
    step1Title: 'Personal Details',
    step1Desc: 'Tell us about yourself.',
    fullName: 'Full name *',
    fullNamePlaceholder: 'First name + last name',
    email: 'Email address *',
    phone: 'Phone number *',
    city: 'City *',
    country: 'Country *',
    countries: {
      Nederland: 'Netherlands',
      Belgie: 'Belgium',
      Duitsland: 'Germany',
      UK: 'United Kingdom',
      Frankrijk: 'France',
      Anders: 'Other',
    },
    kvk: 'Chamber of Commerce number (optional)',
    kvkPlaceholder: '12345678',
    kvkHelp: 'Enter your Chamber of Commerce number if you have a registered business. Without a CoC number, you will be treated as a private individual and payments will be reported to the tax authorities.',
    kvkZakelijk: 'Business relationship',
    kvkParticulier: 'Private individual — payments will be logged for tax reporting',
    next: 'Next',
    // Step 2
    step2Title: 'Professional Profile',
    step2Desc: 'Tell us about your recruitment experience.',
    sectorExpertise: 'Sector expertise *',
    sectors: ['Technology', 'Financial', 'Healthcare', 'Marketing', 'HR', 'Logistics', 'Education', 'Engineering', 'Sales', 'Other'],
    yearsExperience: 'Years of recruitment experience *',
    selectPlaceholder: 'Select',
    yearOptions: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
    linkedin: 'LinkedIn profile URL',
    previous: 'Previous',
    // Step 3
    step3Title: 'Accept Agreements',
    step3Desc: 'Read and accept the following documents to continue.',
    scoutAgreementTitle: 'Scout Agreement',
    scoutAgreementDesc: 'I agree to the Scout Agreement of Refurzy. This confirms that I work as an independent contractor.',
    scoutAgreementLink: 'Scout Agreement',
    privacyTitle: 'Privacy Policy',
    privacyDesc: 'I have read the Privacy Policy and agree to the processing of my personal data.',
    privacyLink: 'Privacy Policy',
    dpaTitle: 'Data Processing Agreement',
    dpaDesc: 'I agree to the Data Processing Agreement.',
    dpaLink: 'Data Processing Agreement',
    createAccount: 'Create account',
    // Step 4
    step4Title: 'Welcome, Talent Scout!',
    step4Desc: 'Your account has been created. Start building your talent pool by inviting candidates for the Matching Scan.',
    goToDashboard: 'Go to dashboard',
  },
}

const yearValues = ['0-1', '1-3', '3-5', '5-10', '10+']
const countryKeys = ['Nederland', 'Belgie', 'Duitsland', 'UK', 'Frankrijk', 'Anders'] as const

export default function OnboardingScout() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const { lang } = useLang()
  const t = texts[lang]

  const [form, setForm] = useState({
    naam: '',
    email: '',
    telefoon: '',
    woonplaats: '',
    land: 'Nederland',
    kvkNummer: '',
    sectorExpertise: [] as string[],
    jarenErvaring: '',
    linkedinUrl: '',
    scoutovereenkomst: false,
    privacyverklaring: false,
    verwerkersovereenkomst: false,
  })

  const update = (field: string, value: string | boolean | string[]) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleSector = (sectorIndex: number) => {
    const sectorKey = texts.nl.sectors[sectorIndex]
    setForm(prev => ({
      ...prev,
      sectorExpertise: prev.sectorExpertise.includes(sectorKey)
        ? prev.sectorExpertise.filter(s => s !== sectorKey)
        : [...prev.sectorExpertise, sectorKey],
    }))
  }

  const next = () => {
    if (currentStep < t.steps.length - 1) setCurrentStep(currentStep + 1)
  }
  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

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
            {t.steps.map((label, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                    i < currentStep ? 'bg-purple text-white border-purple' :
                    i === currentStep ? 'bg-white text-purple border-purple' :
                    'bg-surface-muted text-ink-muted border-surface-border'
                  }`}>
                    {i < currentStep ? '\u2713' : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 whitespace-nowrap ${
                    i <= currentStep ? 'text-ink font-medium' : 'text-ink-muted'
                  }`}>{label}</span>
                </div>
                {i < t.steps.length - 1 && (
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
          {/* Step 1: Personal details */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.step1Title}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.step1Desc}</p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t.city}</label>
                    <input type="text" value={form.woonplaats} onChange={e => update('woonplaats', e.target.value)}
                      placeholder="Amsterdam" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t.country}</label>
                    <select value={form.land} onChange={e => update('land', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                      {countryKeys.map(key => (
                        <option key={key} value={key}>{t.countries[key]}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.kvk}</label>
                  <input type="text" value={form.kvkNummer} onChange={e => update('kvkNummer', e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder={t.kvkPlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  <p className="text-xs text-ink-muted mt-1.5">{t.kvkHelp}</p>
                  {form.kvkNummer.length > 0 ? (
                    <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-cyan/5 border border-cyan/20 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-cyan"></span>
                      <span className="text-xs text-cyan font-medium">{t.kvkZakelijk}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span className="text-xs text-amber-700 font-medium">{t.kvkParticulier}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={next} className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Professional profile */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.step2Title}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.step2Desc}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">{t.sectorExpertise}</label>
                  <div className="flex flex-wrap gap-2">
                    {t.sectors.map((sector, idx) => (
                      <button key={idx} onClick={() => toggleSector(idx)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          form.sectorExpertise.includes(texts.nl.sectors[idx])
                            ? 'bg-purple text-white border-purple'
                            : 'bg-white text-ink border-surface-border hover:border-purple/40'
                        }`}>
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.yearsExperience}</label>
                  <select value={form.jarenErvaring} onChange={e => update('jarenErvaring', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                    <option value="">{t.selectPlaceholder}</option>
                    {yearValues.map((val, idx) => (
                      <option key={val} value={val}>{t.yearOptions[idx]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.linkedin}</label>
                  <input type="url" value={form.linkedinUrl} onChange={e => update('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/jouw-profiel" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
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

          {/* Step 3: Terms */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.step3Title}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.step3Desc}</p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.scoutovereenkomst} onChange={e => update('scoutovereenkomst', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.scoutAgreementTitle}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{t.scoutAgreementDesc.split(t.scoutAgreementLink)[0]}<span className="text-purple underline">{t.scoutAgreementLink}</span>{t.scoutAgreementDesc.split(t.scoutAgreementLink).slice(1).join(t.scoutAgreementLink)}</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.privacyverklaring} onChange={e => update('privacyverklaring', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.privacyTitle}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{t.privacyDesc.split(t.privacyLink)[0]}<span className="text-purple underline">{t.privacyLink}</span>{t.privacyDesc.split(t.privacyLink).slice(1).join(t.privacyLink)}</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.verwerkersovereenkomst} onChange={e => update('verwerkersovereenkomst', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.dpaTitle}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{t.dpaDesc.split(t.dpaLink)[0]}<span className="text-purple underline">{t.dpaLink}</span>{t.dpaDesc.split(t.dpaLink).slice(1).join(t.dpaLink)}</p>
                  </div>
                </label>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  {t.previous}
                </button>
                <button onClick={next}
                  disabled={!form.scoutovereenkomst || !form.privacyverklaring || !form.verwerkersovereenkomst}
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
              <h2 className="text-2xl font-semibold text-ink mb-2">{t.step4Title}</h2>
              <p className="text-ink-muted mb-8 max-w-md mx-auto">
                {t.step4Desc}
              </p>
              <button onClick={() => router.push('/demo/scout')}
                className="px-8 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                {t.goToDashboard}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
