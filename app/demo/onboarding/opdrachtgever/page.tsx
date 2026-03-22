'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/i18n'
import { SECTOREN, SECTOREN_EN } from '@/lib/constants'

const texts = {
  nl: {
    headerTitle: 'Registratie Opdrachtgever',
    steps: ['Bedrijfsgegevens', 'Contactpersoon', 'E-mail verificatie', 'KVK Verificatie', 'Voorwaarden', 'Account aangemaakt'],
    // Step 1
    step1Title: 'Bedrijfsgegevens',
    step1Desc: 'Vul de gegevens van uw bedrijf in.',
    kvkLabel: 'KVK Nummer *',
    kvkPlaceholder: 'Bijv. 87654321',
    companyNameLabel: 'Bedrijfsnaam *',
    companyNamePlaceholder: 'Uw bedrijfsnaam',
    addressLabel: 'Adres *',
    addressPlaceholder: 'Straat + huisnummer',
    postcodeLabel: 'Postcode *',
    cityLabel: 'Plaats *',
    sectorLabel: 'Sector *',
    sectorDefault: 'Selecteer sector',
    next: 'Volgende',
    // Step 2
    step2Title: 'Contactpersoon',
    step2Desc: 'Wie is het eerste aanspreekpunt?',
    fullNameLabel: 'Volledige naam *',
    fullNamePlaceholder: 'Voornaam + achternaam',
    emailLabel: 'E-mailadres *',
    emailPlaceholder: 'naam@bedrijf.nl',
    phoneLabel: 'Telefoonnummer *',
    jobTitleLabel: 'Functie *',
    jobTitlePlaceholder: 'Bijv. HR Manager',
    previous: 'Vorige',
    // Step 2b: Email verification
    emailVerifyTitle: 'E-mail verificatie',
    emailVerifyDesc: (email: string) => `We hebben een verificatiecode gestuurd naar ${email}. Controleer je inbox en voer de code in om je e-mailadres te bevestigen.`,
    emailVerifyCodeLabel: 'Verificatiecode',
    emailVerifyBtn: 'Verifiëren',
    emailVerifyResend: 'Opnieuw versturen',
    emailVerifyResent: 'Verificatiecode opnieuw verstuurd',
    // Step 3
    step3Title: 'KVK Verificatie',
    step3Desc: 'We controleren of uw KVK-nummer al bekend is in ons systeem.',
    cocNumberLabel: 'KVK-nummer:',
    companyLabel: 'Bedrijf:',
    verifyCoc: 'Verifieer KVK-nummer',
    demoHint: 'Demo: gebruik KVK "12345678" om de duplicaatcheck te testen.',
    cocAlreadyRegistered: 'Dit KVK-nummer is al geregistreerd',
    cocAlreadyRegisteredDesc: (kvk: string) =>
      `Het bedrijf "TechVentures B.V." met KVK ${kvk} heeft al een account. U kunt een toegangsverzoek sturen naar de beheerder van dit account.`,
    changeCoc: 'KVK wijzigen',
    sendAccessRequest: 'Toegangsverzoek sturen',
    requestSent: 'Verzoek verstuurd!',
    requestSentDesc: 'De beheerder van TechVentures B.V. ontvangt een e-mail met uw verzoek. U krijgt bericht zodra uw toegang is goedgekeurd.',
    backToLogin: 'Terug naar inloggen',
    // Step 4
    step4Title: 'Voorwaarden accepteren',
    step4Desc: 'Lees en accepteer de volgende documenten om verder te gaan.',
    termsTitle: 'Algemene Voorwaarden',
    termsDesc: 'Ik ga akkoord met de Algemene Voorwaarden van Refurzy.',
    privacyTitle: 'Privacyverklaring',
    privacyDesc: 'Ik heb de Privacyverklaring gelezen en ga akkoord.',
    dpaTitle: 'Verwerkersovereenkomst',
    dpaDesc: 'Ik ga akkoord met de Verwerkersovereenkomst.',
    createAccount: 'Account aanmaken',
    // Step 5
    step5Title: 'Account aangemaakt!',
    step5Desc: (company: string) =>
      `Welkom bij Refurzy, ${company}. Uw account is succesvol aangemaakt. U wordt doorverwezen naar uw dashboard.`,
    step5DefaultCompany: 'uw bedrijf',
    goToDashboard: 'Naar dashboard',
  },
  en: {
    headerTitle: 'Employer Registration',
    steps: ['Company Details', 'Contact Person', 'Email Verification', 'CoC Verification', 'Terms', 'Account created'],
    // Step 1
    step1Title: 'Company Details',
    step1Desc: 'Enter your company details.',
    kvkLabel: 'Chamber of Commerce No *',
    kvkPlaceholder: 'E.g. 87654321',
    companyNameLabel: 'Company name *',
    companyNamePlaceholder: 'Your company name',
    addressLabel: 'Address *',
    addressPlaceholder: 'Street + number',
    postcodeLabel: 'Postcode *',
    cityLabel: 'City *',
    sectorLabel: 'Sector *',
    sectorDefault: 'Select sector',
    next: 'Next',
    // Step 2
    step2Title: 'Contact Person',
    step2Desc: 'Who is the primary contact?',
    fullNameLabel: 'Full name *',
    fullNamePlaceholder: 'First name + last name',
    emailLabel: 'Email address *',
    emailPlaceholder: 'name@company.com',
    phoneLabel: 'Phone number *',
    jobTitleLabel: 'Job title *',
    jobTitlePlaceholder: 'E.g. HR Manager',
    previous: 'Previous',
    // Step 2b: Email verification
    emailVerifyTitle: 'Email Verification',
    emailVerifyDesc: (email: string) => `We have sent a verification code to ${email}. Check your inbox and enter the code to verify your email address.`,
    emailVerifyCodeLabel: 'Verification code',
    emailVerifyBtn: 'Verify',
    emailVerifyResend: 'Resend',
    emailVerifyResent: 'Verification code resent',
    // Step 3
    step3Title: 'CoC Verification',
    step3Desc: 'We check if your Chamber of Commerce number is already registered.',
    cocNumberLabel: 'CoC number:',
    companyLabel: 'Company:',
    verifyCoc: 'Verify CoC number',
    demoHint: 'Demo: use CoC "12345678" to test the duplicate check.',
    cocAlreadyRegistered: 'This CoC number is already registered',
    cocAlreadyRegisteredDesc: (kvk: string) =>
      `The company "TechVentures B.V." with CoC ${kvk} already has an account. You can send an access request to the account administrator.`,
    changeCoc: 'Change CoC',
    sendAccessRequest: 'Send access request',
    requestSent: 'Request sent!',
    requestSentDesc: 'The administrator of TechVentures B.V. will receive an email with your request. You will be notified once your access is approved.',
    backToLogin: 'Back to login',
    // Step 4
    step4Title: 'Accept Terms',
    step4Desc: 'Read and accept the following documents to continue.',
    termsTitle: 'Terms & Conditions',
    termsDesc: 'I agree to the Terms & Conditions of Refurzy.',
    privacyTitle: 'Privacy Policy',
    privacyDesc: 'I have read and agree to the Privacy Policy.',
    dpaTitle: 'Data Processing Agreement',
    dpaDesc: 'I agree to the Data Processing Agreement.',
    createAccount: 'Create account',
    // Step 5
    step5Title: 'Account created!',
    step5Desc: (company: string) =>
      `Welcome to Refurzy, ${company}. Your account has been successfully created. You will be redirected to your dashboard.`,
    step5DefaultCompany: 'your company',
    goToDashboard: 'Go to dashboard',
  },
}

export default function OnboardingOpdrachtgever() {
  const { lang } = useLang()
  const t = texts[lang]

  const [currentStep, setCurrentStep] = useState(0)
  const [kvkExists, setKvkExists] = useState(false)
  const [accessRequestSent, setAccessRequestSent] = useState(false)
  const [emailCode, setEmailCode] = useState('123456')
  const [emailResent, setEmailResent] = useState(false)
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
    if (currentStep < t.steps.length - 1) setCurrentStep(currentStep + 1)
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
      {/* Header + Progress stepper on navy background */}
      <div className="bg-navy px-8 pt-4 pb-6">
        <header className="flex items-center justify-between mb-6">
          <img src="/logo-white.png" alt="Refurzy" className="h-7" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <span className="text-sm text-white/50">{t.headerTitle}</span>
        </header>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {t.steps.map((label, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                    i < currentStep ? 'bg-purple text-white border-purple' :
                    i === currentStep ? 'bg-white text-purple border-purple' :
                    'bg-white/10 text-white/40 border-white/20'
                  }`}>
                    {i < currentStep ? '\u2713' : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 whitespace-nowrap ${
                    i <= currentStep ? 'text-white font-medium' : 'text-white/40'
                  }`}>{label}</span>
                </div>
                {i < t.steps.length - 1 && (
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
          {/* Step 1: Bedrijfsgegevens */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.step1Title}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.step1Desc}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.kvkLabel}</label>
                  <input type="text" value={form.kvkNummer} onChange={e => update('kvkNummer', e.target.value)}
                    placeholder={t.kvkPlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.companyNameLabel}</label>
                  <input type="text" value={form.bedrijfsnaam} onChange={e => update('bedrijfsnaam', e.target.value)}
                    placeholder={t.companyNamePlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t.addressLabel}</label>
                    <input type="text" value={form.adres} onChange={e => update('adres', e.target.value)}
                      placeholder={t.addressPlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t.postcodeLabel}</label>
                    <input type="text" value={form.postcode} onChange={e => update('postcode', e.target.value)}
                      placeholder="1234 AB" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t.cityLabel}</label>
                    <input type="text" value={form.plaats} onChange={e => update('plaats', e.target.value)}
                      placeholder="Amsterdam" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t.sectorLabel}</label>
                    <select value={form.sector} onChange={e => update('sector', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple">
                      <option value="">{t.sectorDefault}</option>
                      {SECTOREN.map(s => (
                        <option key={s} value={s}>{lang === 'en' ? (SECTOREN_EN[s] || s) : s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={next} className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Contactpersoon */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.step2Title}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.step2Desc}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.fullNameLabel}</label>
                  <input type="text" value={form.naam} onChange={e => update('naam', e.target.value)}
                    placeholder={t.fullNamePlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.emailLabel}</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder={t.emailPlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.phoneLabel}</label>
                  <input type="tel" value={form.telefoon} onChange={e => update('telefoon', e.target.value)}
                    placeholder="06-12345678" className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.jobTitleLabel}</label>
                  <input type="text" value={form.functie} onChange={e => update('functie', e.target.value)}
                    placeholder={t.jobTitlePlaceholder} className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-white text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
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
              <p className="text-sm text-ink-muted mb-6">{t.emailVerifyDesc(form.email || 'naam@bedrijf.nl')}</p>
              <div className="bg-surface-muted rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-medium text-ink">{form.email || 'naam@bedrijf.nl'}</p>
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

          {/* Step 4: KVK Verificatie */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.step3Title}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.step3Desc}</p>

              {!kvkExists && !accessRequestSent && (
                <div>
                  <div className="bg-surface-muted rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🔍</span>
                      <div>
                        <p className="font-medium text-ink">{t.cocNumberLabel} {form.kvkNummer || '\u2014'}</p>
                        <p className="text-sm text-ink-muted">{t.companyLabel} {form.bedrijfsnaam || '\u2014'}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={checkKvk} className="w-full px-6 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                    {t.verifyCoc}
                  </button>
                  <p className="text-xs text-ink-muted mt-3 text-center">
                    {t.demoHint}
                  </p>
                </div>
              )}

              {kvkExists && !accessRequestSent && (
                <div>
                  <div className="bg-orange/10 border border-orange/30 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <p className="font-medium text-ink">{t.cocAlreadyRegistered}</p>
                        <p className="text-sm text-ink-muted mt-1">
                          {t.cocAlreadyRegisteredDesc(form.kvkNummer)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setKvkExists(false) }} className="flex-1 px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                      {t.changeCoc}
                    </button>
                    <button onClick={sendAccessRequest} className="flex-1 px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                      {t.sendAccessRequest}
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
                        <p className="font-medium text-ink">{t.requestSent}</p>
                        <p className="text-sm text-ink-muted mt-1">
                          {t.requestSentDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => router.push('/login')} className="w-full px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors">
                    {t.backToLogin}
                  </button>
                </div>
              )}

              {!kvkExists && !accessRequestSent && (
                <div className="flex justify-between mt-6">
                  <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                    {t.previous}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Voorwaarden */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-1">{t.step4Title}</h2>
              <p className="text-sm text-ink-muted mb-6">{t.step4Desc}</p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.algVoorwaarden} onChange={e => update('algVoorwaarden', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.termsTitle}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{t.termsDesc}</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.privacyverklaring} onChange={e => update('privacyverklaring', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.privacyTitle}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{t.privacyDesc}</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                  <input type="checkbox" checked={form.verwerkersovereenkomst} onChange={e => update('verwerkersovereenkomst', e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-surface-border text-purple focus:ring-purple/30" />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.dpaTitle}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{t.dpaDesc}</p>
                  </div>
                </label>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="px-6 py-2.5 border border-surface-border text-ink rounded-lg font-medium hover:bg-surface-muted transition-colors">
                  {t.previous}
                </button>
                <button onClick={next}
                  disabled={!form.algVoorwaarden || !form.privacyverklaring || !form.verwerkersovereenkomst}
                  className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {t.createAccount}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Account aangemaakt */}
          {currentStep === 5 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-semibold text-ink mb-2">{t.step5Title}</h2>
              <p className="text-ink-muted mb-8 max-w-md mx-auto">
                {t.step5Desc(form.bedrijfsnaam || t.step5DefaultCompany)}
              </p>
              <button onClick={() => router.push('/demo/opdrachtgever')}
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
