'use client'

import { useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { saveScoutKvkStatus } from '@/lib/scout-registration'

interface KvkRegistratieModalProps {
  isOpen: boolean
  onClose: () => void
  onRegistered: () => void
  lang: Lang
  earnedTotal: number
  threshold: number
  potentialFee: number
}

const texts = {
  nl: {
    step1Title: '⚖️ KVK-registratie vereist',
    step1Body: (earned: string, threshold: string, fee: string) =>
      `Je hebt tot nu toe ${earned} verdiend als particulier talent scout. Deze plaatsing zou ${fee} aan je inkomsten toevoegen, waardoor je boven de Nederlandse drempel van ${threshold} uitkomt.`,
    step1Rule: 'Scouts die de jaargrens overschrijden moeten als zelfstandige (zzp/eenmanszaak) geregistreerd zijn bij de Kamer van Koophandel.',
    step1AfterTitle: 'Na registratie:',
    step1Bullets: [
      'Je kunt onbeperkt kandidaten voordragen',
      'Je factureert voortaan als ondernemer (geen loonheffing)',
      'Je ontvangt een Pro Scout badge',
    ],
    step1Continue: 'KVK-gegevens invoeren →',
    step1Cancel: 'Annuleren',
    step2Title: '🏢 Bedrijfsgegevens invoeren',
    step2Subtitle: 'Vul je KVK-registratiegegevens in om door te gaan',
    labelBedrijfsnaam: 'Bedrijfsnaam *',
    placeholderBedrijfsnaam: 'bijv. Lisa de Groot Recruitment',
    labelKvk: 'KVK-nummer *',
    placeholderKvk: '12345678',
    kvkHint: 'Of buitenlands equivalent (Handelsregister, SIREN, Companies House, etc.)',
    labelBtw: 'BTW-nummer',
    placeholderBtw: 'NL001234567B01',
    btwHint: 'Optioneel — vul in indien van toepassing',
    validationMsg: 'Vul bedrijfsnaam en KVK-nummer in.',
    btnBack: 'Terug',
    btnRegister: 'Registreren & voordragen',
    step3Title: '✓ Registratie bevestigd',
    step3Body: 'Je KVK-registratie is opgeslagen. Je kunt nu onbeperkt kandidaten voordragen als zelfstandige talent scout.',
    step3Badge: '⭐ Pro Scout status geactiveerd',
    btnContinue: 'Doorgaan met voordracht',
    currencySymbol: '€',
  },
  en: {
    step1Title: '⚖️ Company registration required',
    step1Body: (earned: string, threshold: string, fee: string) =>
      `You have earned ${earned} as a private talent scout so far. This placement would add ${fee} to your income, pushing you past the threshold of ${threshold}.`,
    step1Rule: 'Scouts who exceed the annual threshold must be registered as self-employed (freelancer / sole trader) with the Chamber of Commerce.',
    step1AfterTitle: 'After registration:',
    step1Bullets: [
      'You can nominate candidates without limit',
      'You invoice as a business professional (no payroll tax)',
      'You receive a Pro Scout badge',
    ],
    step1Continue: 'Enter registration details →',
    step1Cancel: 'Cancel',
    step2Title: '🏢 Enter company details',
    step2Subtitle: 'Fill in your registration details to continue',
    labelBedrijfsnaam: 'Company name *',
    placeholderBedrijfsnaam: 'e.g. Lisa de Groot Recruitment',
    labelKvk: 'Chamber of Commerce number *',
    placeholderKvk: '12345678',
    kvkHint: 'Or international equivalent (Handelsregister, SIREN, Companies House, etc.)',
    labelBtw: 'VAT number',
    placeholderBtw: 'NL001234567B01',
    btwHint: 'Optional — enter if applicable',
    validationMsg: 'Please enter company name and registration number.',
    btnBack: 'Back',
    btnRegister: 'Register & nominate',
    step3Title: '✓ Registration confirmed',
    step3Body: 'Your company registration has been saved. You can now nominate candidates without limit as a self-employed talent scout.',
    step3Badge: '⭐ Pro Scout status activated',
    btnContinue: 'Continue with nomination',
    currencySymbol: '€',
  },
}

function formatCurrency(amount: number): string {
  return `€${amount.toLocaleString('nl-NL')}`
}

export default function KvkRegistratieModal({
  isOpen,
  onClose,
  onRegistered,
  lang,
  earnedTotal,
  threshold,
  potentialFee,
}: KvkRegistratieModalProps) {
  const t = texts[lang]
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [bedrijfsnaam, setBedrijfsnaam] = useState('')
  const [kvkNummer, setKvkNummer] = useState('')
  const [btwNummer, setBtwNummer] = useState('')
  const [validationError, setValidationError] = useState(false)

  function handleClose() {
    setStep(1)
    setBedrijfsnaam('')
    setKvkNummer('')
    setBtwNummer('')
    setValidationError(false)
    onClose()
  }

  function handleRegister() {
    if (!bedrijfsnaam.trim() || !kvkNummer.trim()) {
      setValidationError(true)
      return
    }
    saveScoutKvkStatus({ kvkNummer: kvkNummer.trim(), bedrijfsnaam: bedrijfsnaam.trim(), btwNummer: btwNummer.trim() || undefined })
    setStep(3)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">

        {/* ── Step 1: Warning / explanation ── */}
        {step === 1 && (
          <div>
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-5">
              <h2 className="text-lg font-bold text-amber-800">{t.step1Title}</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Earnings progress */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>{lang === 'nl' ? 'Verdiend tot nu toe' : 'Earned so far'}</span>
                  <span>{lang === 'nl' ? 'Drempel' : 'Threshold'}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2">
                  <div
                    className="h-2.5 rounded-full bg-amber-400 transition-all"
                    style={{ width: `${Math.min(((earnedTotal + potentialFee) / threshold) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-amber-700">
                    {formatCurrency(earnedTotal)} + {formatCurrency(potentialFee)}
                    <span className="text-slate-400 font-normal text-xs ml-1">(= {formatCurrency(earnedTotal + potentialFee)})</span>
                  </span>
                  <span className="text-slate-600">{formatCurrency(threshold)}</span>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {t.step1Body(formatCurrency(earnedTotal), formatCurrency(threshold), formatCurrency(potentialFee))}
              </p>
              <p className="text-sm text-slate-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                {t.step1Rule}
              </p>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.step1AfterTitle}</p>
                <ul className="space-y-1.5">
                  {t.step1Bullets.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.step1Continue}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.step1Cancel}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Registration form ── */}
        {step === 2 && (
          <div>
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">{t.step2Title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t.step2Subtitle}</p>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <div className="px-6 py-5 space-y-4">

              {/* Bedrijfsnaam */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t.labelBedrijfsnaam}
                </label>
                <input
                  type="text"
                  value={bedrijfsnaam}
                  onChange={e => { setBedrijfsnaam(e.target.value); setValidationError(false) }}
                  placeholder={t.placeholderBedrijfsnaam}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                    validationError && !bedrijfsnaam.trim() ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
              </div>

              {/* KVK */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t.labelKvk}
                </label>
                <input
                  type="text"
                  value={kvkNummer}
                  onChange={e => { setKvkNummer(e.target.value); setValidationError(false) }}
                  placeholder={t.placeholderKvk}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                    validationError && !kvkNummer.trim() ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                <p className="text-xs text-slate-400 mt-1">{t.kvkHint}</p>
              </div>

              {/* BTW */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t.labelBtw}
                </label>
                <input
                  type="text"
                  value={btwNummer}
                  onChange={e => setBtwNummer(e.target.value)}
                  placeholder={t.placeholderBtw}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <p className="text-xs text-slate-400 mt-1">{t.btwHint}</p>
              </div>

              {validationError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {t.validationMsg}
                </p>
              )}
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.btnBack}
              </button>
              <button
                onClick={handleRegister}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.btnRegister}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirmation ── */}
        {step === 3 && (
          <div>
            <div className="bg-green-50 border-b border-green-200 px-6 py-5">
              <h2 className="text-lg font-bold text-green-700">{t.step3Title}</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">{t.step3Body}</p>
              <div className="bg-purple/5 border border-purple/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">⭐</span>
                <p className="text-sm font-semibold text-purple">{t.step3Badge}</p>
              </div>
            </div>
            <div className="px-6 pb-5">
              <button
                onClick={() => { handleClose(); onRegistered() }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.btnContinue}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
