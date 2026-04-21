'use client'

import { useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { addFraudReport, fraudTypeLabels, type FraudType } from '@/lib/mock-fraud-reports'

interface FraudReportModalProps {
  isOpen: boolean
  onClose: () => void
  lang: Lang
  /** Who is filing the report */
  reporterRole: 'scout' | 'opdrachtgever'
  reporterName: string
  reporterEmail: string
  /** Who is being reported */
  subjectRole: 'scout' | 'opdrachtgever' | 'kandidaat'
  subjectName: string
  subjectEmail: string
  /** E.g. "Senior Developer — TechVentures B.V." */
  context?: string
}

const texts = {
  nl: {
    step1Title: '⚠️ Fraudemelding',
    step1Body:
      'Dit formulier is uitsluitend bedoeld voor het melden van vermoedelijke fraude. Misbruik van dit meldformulier — waaronder ongegronde meldingen — kan leiden tot schorsing of beëindiging van uw account.',
    step1Examples: 'Wanneer dit formulier te gebruiken:',
    step1ExampleItems: [
      'Een partij benadert u buiten het platform om (bijv. om de fee te omzeilen)',
      'Een kandidaat heeft vervalste gegevens ingediend (CV-fraude)',
      'Er is sprake van identiteits- of betalingsfraude',
    ],
    step1Confirm: 'Ik begrijp dit — ga verder',
    step1Cancel: 'Annuleren',
    step2Title: 'Fraudemelding indienen',
    step2SubjectLabel: 'Betrokken partij',
    step2TypeLabel: 'Type fraude',
    step2TypePlaceholder: 'Kies een type...',
    step2DescLabel: 'Beschrijving',
    step2DescPlaceholder:
      'Beschrijf zo gedetailleerd mogelijk wat er is voorgevallen. Minimaal 50 tekens.',
    step2DescHint: (n: number) => `${n}/50 tekens minimum`,
    step2ReporterLabel: 'Uw gegevens (automatisch gekoppeld)',
    step2ContextLabel: 'Gekoppelde context',
    step2Submit: 'Melding versturen',
    step2Cancel: 'Annuleren',
    step2ValidationMsg: 'Kies een type en schrijf minimaal 50 tekens.',
    step3Title: '✓ Melding ontvangen',
    step3Body:
      'Uw melding is anoniem ontvangen en wordt intern behandeld door het Refurzy-team.',
    step3EmailSent: '📧 E-mail notificatie verstuurd naar admin@refurzy.com',
    step3Note:
      'De gemelde partij wordt niet op de hoogte gesteld van uw identiteit. U kunt contact opnemen via info@refurzy.com als u aanvullende informatie wilt toevoegen.',
    step3Close: 'Sluiten',
    subjectRoleLabel: {
      scout: 'Talent Scout',
      opdrachtgever: 'Opdrachtgever',
      kandidaat: 'Kandidaat',
    },
  },
  en: {
    step1Title: '⚠️ Fraud Report',
    step1Body:
      'This form is exclusively for reporting suspected fraud. Misuse — including unfounded reports — may result in suspension or termination of your account.',
    step1Examples: 'When to use this form:',
    step1ExampleItems: [
      'A party contacts you outside the platform (e.g. to bypass the fee)',
      'A candidate submitted falsified information (CV fraud)',
      'Identity or payment fraud has taken place',
    ],
    step1Confirm: 'I understand — continue',
    step1Cancel: 'Cancel',
    step2Title: 'Submit fraud report',
    step2SubjectLabel: 'Reported party',
    step2TypeLabel: 'Type of fraud',
    step2TypePlaceholder: 'Choose a type...',
    step2DescLabel: 'Description',
    step2DescPlaceholder:
      'Describe what happened in as much detail as possible. Minimum 50 characters.',
    step2DescHint: (n: number) => `${n}/50 characters minimum`,
    step2ReporterLabel: 'Your details (automatically attached)',
    step2ContextLabel: 'Linked context',
    step2Submit: 'Submit report',
    step2Cancel: 'Cancel',
    step2ValidationMsg: 'Please choose a type and write at least 50 characters.',
    step3Title: '✓ Report received',
    step3Body:
      'Your report has been received anonymously and will be handled internally by the Refurzy team.',
    step3EmailSent: '📧 Email notification sent to admin@refurzy.com',
    step3Note:
      'The reported party will not be notified of your identity. Contact info@refurzy.com if you wish to add further information.',
    step3Close: 'Close',
    subjectRoleLabel: {
      scout: 'Talent Scout',
      opdrachtgever: 'Employer',
      kandidaat: 'Candidate',
    },
  },
}

const FRAUD_TYPES: FraudType[] = [
  'buiten_platform',
  'cv_fraude',
  'betalingsfraude',
  'identiteitsfraude',
  'overig',
]

export default function FraudReportModal({
  isOpen,
  onClose,
  lang,
  reporterRole,
  reporterName,
  reporterEmail,
  subjectRole,
  subjectName,
  subjectEmail,
  context,
}: FraudReportModalProps) {
  const t = texts[lang]
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [fraudType, setFraudType] = useState<FraudType | ''>('')
  const [description, setDescription] = useState('')
  const [validationError, setValidationError] = useState(false)

  function handleClose() {
    setStep(1)
    setFraudType('')
    setDescription('')
    setValidationError(false)
    onClose()
  }

  function handleSubmit() {
    if (!fraudType || description.trim().length < 50) {
      setValidationError(true)
      return
    }
    setValidationError(false)
    addFraudReport({
      reporter: { name: reporterName, email: reporterEmail, role: reporterRole },
      subject: { name: subjectName, email: subjectEmail, role: subjectRole },
      fraudType: fraudType as FraudType,
      description: description.trim(),
      context,
    })
    setStep(3)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">

        {/* ── Step 1: Warning ── */}
        {step === 1 && (
          <div>
            <div className="bg-red-50 border-b border-red-200 px-6 py-5">
              <h2 className="text-lg font-bold text-red-700">{t.step1Title}</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">{t.step1Body}</p>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">{t.step1Examples}</p>
                <ul className="space-y-1.5">
                  {t.step1ExampleItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.step1Confirm}
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

        {/* ── Step 2: Form ── */}
        {step === 2 && (
          <div>
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">{t.step2Title}</h2>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">

              {/* Reported party */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t.step2SubjectLabel}</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold text-sm">
                      {subjectName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{subjectName}</p>
                    <p className="text-xs text-slate-500">{t.subjectRoleLabel[subjectRole]}{subjectEmail ? ` · ${subjectEmail}` : ''}</p>
                    {context && <p className="text-xs text-slate-400 mt-0.5 italic">{context}</p>}
                  </div>
                </div>
              </div>

              {/* Fraud type */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t.step2TypeLabel}
                </label>
                <select
                  value={fraudType}
                  onChange={e => { setFraudType(e.target.value as FraudType); setValidationError(false) }}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300 ${
                    validationError && !fraudType ? 'border-red-400' : 'border-slate-300'
                  }`}
                >
                  <option value="">{t.step2TypePlaceholder}</option>
                  {FRAUD_TYPES.map(ft => (
                    <option key={ft} value={ft}>{fraudTypeLabels[ft][lang]}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t.step2DescLabel}
                </label>
                <textarea
                  value={description}
                  onChange={e => { setDescription(e.target.value); setValidationError(false) }}
                  rows={5}
                  placeholder={t.step2DescPlaceholder}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300 ${
                    validationError && description.trim().length < 50 ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                <p className={`text-xs mt-1 ${description.trim().length < 50 ? 'text-slate-400' : 'text-green-600'}`}>
                  {t.step2DescHint(description.trim().length)}
                </p>
              </div>

              {validationError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {t.step2ValidationMsg}
                </p>
              )}

              {/* Reporter info (read-only) */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t.step2ReporterLabel}</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <p className="text-sm font-medium text-slate-700">{reporterName}</p>
                  <p className="text-xs text-slate-400">{reporterEmail}</p>
                </div>
              </div>

            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.step2Submit}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.step2Cancel}
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
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <p className="text-sm text-slate-600">{t.step3EmailSent}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{t.step3Note}</p>
            </div>
            <div className="px-6 pb-5">
              <button
                onClick={handleClose}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.step3Close}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
