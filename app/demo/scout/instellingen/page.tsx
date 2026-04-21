'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/lib/i18n'
import {
  getScoutEarnedTotal,
  getCountryThreshold,
  getScoutKvkStatus,
  saveScoutKvkStatus,
} from '@/lib/scout-registration'

const texts = {
  nl: {
    pageTitle: 'Instellingen & Uitbetaling',
    pageSubtitle: 'Beheer je uitbetalingsgegevens en bedrijfsregistratie',
    blockedTitle: 'Account geblokkeerd voor nieuwe bemiddelingen',
    blockedBody: (max: number) =>
      `Je hebt de jaargrens van €${max.toLocaleString('nl-NL')} als particulier talent scout bereikt. Om verder te kunnen bemiddelen moet je je bedrijf registreren bij de KvK.`,
    upgradeBtn: 'Upgrade naar zakelijk',
    statusModus: 'Modus',
    statusParticulier: 'Particulier',
    statusZakelijk: 'Zakelijk',
    statusMaxMediations: (max: number) => `Grens €${max.toLocaleString('nl-NL')}`,
    statusEarned: 'Verdiend dit jaar',
    statusMediations: 'Bemiddelingen',
    statusLimitReached: 'Limiet bereikt',
    statusRemaining: (n: number) => `€${n.toLocaleString('nl-NL')} ruimte over`,
    personalDataTitle: 'Persoonlijke gegevens (verplicht voor belastingdienst)',
    personalDataNote: 'Wij zijn wettelijk verplicht om jaarlijks een opgave te doen aan de Belastingdienst van alle particulieren die wij hebben uitbetaald. Onderstaande gegevens worden 1x per jaar aan de Belastingdienst doorgegeven.',
    labelFullName: 'Volledige naam',
    labelBSN: 'BSN',
    labelAddress: 'Adres',
    labelDOB: 'Geboortedatum',
    payoutTitle: 'Uitbetalingsgegevens',
    labelIBAN: 'IBAN rekeningnummer',
    ibanNote: 'Elk IBAN mag slechts aan één account gekoppeld zijn om dubbele registraties te voorkomen.',
    businessTitle: 'Bedrijfsregistratie',
    businessNote: (max: number) =>
      `Scouts die de jaargrens van €${max.toLocaleString('nl-NL')} overschrijden zijn verplicht zich als zelfstandige (zzp/eenmanszaak) te registreren bij de Kamer van Koophandel.`,
    labelKvK: 'KvK-nummer',
    kvkChecking: 'Controleren...',
    kvkVerify: 'Verifieer',
    kvkVerifiedTitle: 'KvK-nummer geverifieerd',
    kvkVerifiedSub: 'De Graaf Consultancy — Actief sinds 2024',
    labelVAT: 'BTW-nummer (optioneel)',
    kvkUploadLabel: 'KvK-uittreksel uploaden',
    kvkUploadHint: 'Sleep je KvK-uittreksel hierheen of klik om te uploaden',
    uploadNote: 'PDF of afbeelding, max 5MB',
    idVerifTitle: 'Identiteitsverificatie (EU-wetgeving)',
    idVerifNote: 'Om aan de EU-wetgeving te voldoen voor het uitbetalen van particulieren, dien je een kopie van je paspoort of ID-bewijs te uploaden.',
    idUploadHint: 'Upload je paspoort of ID-bewijs',
    idVerifiedText: 'ID geverifieerd op 12 maart 2026',
    payoutHistoryTitle: 'Uitbetalingshistorie',
    colDate: 'Datum',
    colCandidate: 'Kandidaat',
    colClient: 'Opdrachtgever',
    colAmount: 'Bedrag',
    totalThisYear: 'Totaal dit jaar',
    securityTitle: 'Beveiliging — Tweestapsverificatie (2FA)',
    securityNote: 'Voeg een extra beveiligingslaag toe aan je account met een authenticator app.',
    twoFAActiveTitle: 'Tweestapsverificatie is actief',
    twoFAActiveSub: 'Je account is extra beveiligd met 2FA.',
    twoFADisable: 'Uitschakelen',
    twoFAInactiveTitle: 'Tweestapsverificatie is niet actief',
    twoFAInactiveSub: 'Activeer 2FA om je account beter te beveiligen.',
    twoFAActivate: 'Activeren',
    twoFAStep1: 'Stap 1: Scan de QR-code',
    twoFAQRHint: 'Scan deze QR-code met je authenticator app',
    twoFAAppsLabel: 'Gebruik een van deze apps:',
    twoFAManualHint: 'Of voer deze code handmatig in',
    twoFAStep2: 'Stap 2: Voer de verificatiecode in',
    twoFAConfirm: 'Bevestigen',
    twoFADemoHint: 'Demo: voer een willekeurige 6-cijferige code in',
    twoFACancel: 'Annuleren',
    saveBtn: 'Opslaan',
    savedMsg: '✓ Opgeslagen',
    ibanErrorDuplicate: 'Dit IBAN is al geregistreerd bij een ander account. Elk IBAN mag slechts aan één account gekoppeld zijn.',
    grensLabel: (current: number, max: number) => `€${current} / €${max.toLocaleString()} grens`,
  },
  en: {
    pageTitle: 'Settings & Payout',
    pageSubtitle: 'Manage your payout details and business registration',
    blockedTitle: 'Account blocked for new mediations',
    blockedBody: (max: number) =>
      `You have reached the annual threshold of €${max.toLocaleString('nl-NL')} as a private talent scout. To continue mediating you must register your business with the Chamber of Commerce.`,
    upgradeBtn: 'Upgrade to business',
    statusModus: 'Mode',
    statusParticulier: 'Private',
    statusZakelijk: 'Business',
    statusMaxMediations: (max: number) => `Threshold €${max.toLocaleString('nl-NL')}`,
    statusEarned: 'Earned this year',
    statusMediations: 'Mediations',
    statusLimitReached: 'Limit reached',
    statusRemaining: (n: number) => `€${n.toLocaleString('nl-NL')} remaining`,
    personalDataTitle: 'Personal details (required for tax authority)',
    personalDataNote: 'We are legally required to submit an annual report to the tax authority for all private individuals we have paid out. The details below are submitted once a year.',
    labelFullName: 'Full name',
    labelBSN: 'BSN',
    labelAddress: 'Address',
    labelDOB: 'Date of birth',
    payoutTitle: 'Payout details',
    labelIBAN: 'IBAN account number',
    ibanNote: 'Each IBAN may only be linked to one account to prevent duplicate registrations.',
    businessTitle: 'Business registration',
    businessNote: (max: number) =>
      `Scouts who exceed the annual threshold of €${max.toLocaleString('nl-NL')} are required to register as self-employed (freelancer / sole trader) with the Chamber of Commerce.`,
    labelKvK: 'Chamber of Commerce number',
    kvkChecking: 'Checking...',
    kvkVerify: 'Verify',
    kvkVerifiedTitle: 'Chamber of Commerce number verified',
    kvkVerifiedSub: 'De Graaf Consultancy — Active since 2024',
    labelVAT: 'VAT number (optional)',
    kvkUploadLabel: 'Upload Chamber of Commerce extract',
    kvkUploadHint: 'Drag your CoC extract here or click to upload',
    uploadNote: 'PDF or image, max 5MB',
    idVerifTitle: 'Identity verification (EU legislation)',
    idVerifNote: 'To comply with EU legislation for paying out private individuals, you must upload a copy of your passport or ID.',
    idUploadHint: 'Upload your passport or ID',
    idVerifiedText: 'ID verified on 12 March 2026',
    payoutHistoryTitle: 'Payout history',
    colDate: 'Date',
    colCandidate: 'Candidate',
    colClient: 'Client',
    colAmount: 'Amount',
    totalThisYear: 'Total this year',
    securityTitle: 'Security — Two-factor authentication (2FA)',
    securityNote: 'Add an extra layer of security to your account with an authenticator app.',
    twoFAActiveTitle: 'Two-factor authentication is active',
    twoFAActiveSub: 'Your account is extra secured with 2FA.',
    twoFADisable: 'Disable',
    twoFAInactiveTitle: 'Two-factor authentication is not active',
    twoFAInactiveSub: 'Activate 2FA to better secure your account.',
    twoFAActivate: 'Activate',
    twoFAStep1: 'Step 1: Scan the QR code',
    twoFAQRHint: 'Scan this QR code with your authenticator app',
    twoFAAppsLabel: 'Use one of these apps:',
    twoFAManualHint: 'Or enter this code manually',
    twoFAStep2: 'Step 2: Enter the verification code',
    twoFAConfirm: 'Confirm',
    twoFADemoHint: 'Demo: enter any 6-digit code',
    twoFACancel: 'Cancel',
    saveBtn: 'Save',
    savedMsg: '✓ Saved',
    ibanErrorDuplicate: 'This IBAN is already registered with another account. Each IBAN may only be linked to one account.',
    grensLabel: (current: number, max: number) => `€${current} / €${max.toLocaleString()} limit`,
  },
}

export default function ScoutInstellingen() {
  const { lang } = useLang()
  const t = texts[lang]

  const [twoFAActive, setTwoFAActive] = useState(false)
  const [showTwoFASetup, setShowTwoFASetup] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const [iban, setIban] = useState('NL91 ABNA 0417 1643 00')
  const [ibanError, setIbanError] = useState('')
  const [kvkNummer, setKvkNummer] = useState('')
  const [kvkVerified, setKvkVerified] = useState(false)
  const [kvkChecking, setKvkChecking] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [saved, setSaved] = useState(false)

  // Derived from real mock data + localStorage
  const grensbedrag = getCountryThreshold('NL')
  const huidigVerdiend = getScoutEarnedTotal()
  const [kvkStatus, setKvkStatus] = useState(() => getScoutKvkStatus())
  const mode: 'particulier' | 'zzp' = kvkStatus.isRegistered ? 'zzp' : 'particulier'

  // Keep KVK form pre-filled if already registered
  useEffect(() => {
    const status = getScoutKvkStatus()
    setKvkStatus(status)
    if (status.isRegistered) {
      setKvkNummer(status.kvkNummer)
      setKvkVerified(true)
    }
  }, [])

  // Income threshold — scout is blocked from nominating if over threshold without KVK
  const geblokkeerd = huidigVerdiend >= grensbedrag && mode === 'particulier'
  const aantalBemiddelingen = 3 // fixed: 3 placed candidates in demo data

  function handleIbanChange(value: string) {
    setIban(value)
    // Mock: check of IBAN al in gebruik is
    if (value === 'NL91 ABNA 0417 1643 01') {
      setIbanError(t.ibanErrorDuplicate)
    } else {
      setIbanError('')
    }
  }

  function handleKvkCheck() {
    if (!kvkNummer || kvkNummer.length < 8) return
    setKvkChecking(true)
    setTimeout(() => {
      setKvkChecking(false)
      setKvkVerified(true)
      saveScoutKvkStatus({ kvkNummer, bedrijfsnaam: 'Lisa de Groot Recruitment' })
      setKvkStatus(getScoutKvkStatus())
    }, 1500)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">{t.pageTitle}</h1>
      <p className="text-ink-light mb-8">{t.pageSubtitle}</p>

      {/* Blokkering banner */}
      {geblokkeerd && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⛔</span>
            <div>
              <h3 className="font-semibold text-red-700 mb-1">{t.blockedTitle}</h3>
              <p className="text-red-600 text-sm mb-3">
                {t.blockedBody(grensbedrag)}
              </p>
              <button
                onClick={() => setShowUpgrade(true)}
                className="bg-cyan text-navy-dark font-semibold px-4 py-2 rounded-lg text-sm hover:bg-cyan-light transition-colors"
              >
                {t.upgradeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status overzicht */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-ink-light text-xs mb-1">{t.statusModus}</p>
          <p className="text-lg font-semibold">{mode === 'particulier' ? t.statusParticulier : t.statusZakelijk}</p>
          {mode === 'particulier' && <p className="text-xs text-orange mt-1">{t.statusMaxMediations(grensbedrag)}</p>}
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-ink-light text-xs mb-1">{t.statusEarned}</p>
          <p className="text-lg font-semibold text-cyan">€{huidigVerdiend.toLocaleString()}</p>
          {mode === 'particulier' && (
            <div className="mt-2">
              <div className="w-full bg-surface-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${huidigVerdiend / grensbedrag > 0.8 ? 'bg-orange' : 'bg-cyan'}`}
                  style={{ width: `${Math.min((huidigVerdiend / grensbedrag) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-ink-muted mt-1">{t.grensLabel(huidigVerdiend, grensbedrag)}</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-ink-light text-xs mb-1">{t.statusMediations}</p>
          <p className="text-lg font-semibold">{aantalBemiddelingen}</p>
          {mode === 'particulier' && (
            <p className={`text-xs mt-1 ${geblokkeerd ? 'text-red-400' : 'text-ink-muted'}`}>
              {geblokkeerd ? t.statusLimitReached : t.statusRemaining(grensbedrag - huidigVerdiend)}
            </p>
          )}
        </div>
      </div>

      {/* Belastingdienst info */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t.personalDataTitle}</h2>
        <p className="text-xs text-ink-muted mb-4">{t.personalDataNote}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-light mb-1">{t.labelFullName}</label>
            <input defaultValue="Sophie de Graaf" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">{t.labelBSN}</label>
            <input defaultValue="123456789" type="password" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">{t.labelAddress}</label>
            <input defaultValue="Keizersgracht 123, 1015 CJ Amsterdam" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">{t.labelDOB}</label>
            <input type="date" defaultValue="1990-05-15" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
        </div>
      </div>

      {/* IBAN */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t.payoutTitle}</h2>
        <div>
          <label className="block text-sm text-ink-light mb-1">{t.labelIBAN}</label>
          <input
            value={iban}
            onChange={e => handleIbanChange(e.target.value)}
            className={`w-full bg-surface-muted border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none ${ibanError ? 'border-red-500' : 'border-surface-border focus:border-cyan'}`}
            placeholder="NL00 BANK 0000 0000 00"
          />
          {ibanError && (
            <p className="text-red-400 text-xs mt-1.5">{ibanError}</p>
          )}
          <p className="text-xs text-ink-muted mt-1.5">{t.ibanNote}</p>
        </div>
      </div>

      {/* KVK Upgrade */}
      {(showUpgrade || mode === 'zzp') && (
        <div className="bg-white rounded-2xl border border-cyan/20 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">{t.businessTitle}</h2>
          <p className="text-sm text-ink-light mb-4">{t.businessNote(grensbedrag)}</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ink-light mb-1">{t.labelKvK}</label>
              <div className="flex gap-2">
                <input
                  value={kvkNummer}
                  onChange={e => { setKvkNummer(e.target.value); setKvkVerified(false) }}
                  className="flex-1 bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan"
                  placeholder="12345678"
                  maxLength={8}
                />
                <button
                  onClick={handleKvkCheck}
                  disabled={kvkChecking || kvkNummer.length < 8}
                  className="bg-purple text-ink px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-light transition-colors disabled:opacity-50"
                >
                  {kvkChecking ? t.kvkChecking : t.kvkVerify}
                </button>
              </div>
            </div>
            {kvkVerified && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <div>
                  <p className="text-green-400 text-sm font-medium">{t.kvkVerifiedTitle}</p>
                  <p className="text-green-400/70 text-xs">{t.kvkVerifiedSub}</p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm text-ink-light mb-1">{t.labelVAT}</label>
              <input
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan"
                placeholder="NL000000000B01"
              />
            </div>
            <div>
              <label className="block text-sm text-ink-light mb-1">{t.kvkUploadLabel}</label>
              <div className="border-2 border-dashed border-surface-border rounded-lg p-6 text-center hover:border-cyan/30 transition-colors cursor-pointer">
                <p className="text-ink-light text-sm">{t.kvkUploadHint}</p>
                <p className="text-ink-muted text-xs mt-1">{t.uploadNote}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ID Verificatie */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">{t.idVerifTitle}</h2>
        <p className="text-sm text-ink-light mb-4">{t.idVerifNote}</p>
        <div className="border-2 border-dashed border-surface-border rounded-lg p-6 text-center hover:border-cyan/30 transition-colors cursor-pointer">
          <p className="text-ink-light text-sm">{t.idUploadHint}</p>
          <p className="text-ink-muted text-xs mt-1">{t.uploadNote}</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span className="text-sm text-green-400/80">{t.idVerifiedText}</span>
        </div>
      </div>

      {/* Uitbetalingsoverzicht */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t.payoutHistoryTitle}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border text-ink-light">
              <th className="text-left pb-3">{t.colDate}</th>
              <th className="text-left pb-3">{t.colCandidate}</th>
              <th className="text-left pb-3">{t.colClient}</th>
              <th className="text-right pb-3">{t.colAmount}</th>
            </tr>
          </thead>
          <tbody className="text-ink-light">
            <tr className="border-b border-surface-border">
              <td className="py-3">08-03-2026</td>
              <td>Anna de Jong</td>
              <td>TechVentures B.V.</td>
              <td className="text-right text-cyan font-medium">€2.400</td>
            </tr>
            <tr className="border-b border-surface-border">
              <td className="py-3">22-02-2026</td>
              <td>Mark Peters</td>
              <td>GreenLogistics B.V.</td>
              <td className="text-right text-cyan font-medium">€2.400</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="pt-3" colSpan={3}>{t.totalThisYear}</td>
              <td className="text-right pt-3 text-cyan">€4.800</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Beveiliging / 2FA */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">{t.securityTitle}</h2>
        <p className="text-sm text-ink-light mb-4">{t.securityNote}</p>

        {twoFAActive && !showTwoFASetup && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="text-green-800 font-semibold text-sm">{t.twoFAActiveTitle}</p>
                  <p className="text-green-600 text-xs mt-0.5">{t.twoFAActiveSub}</p>
                </div>
              </div>
              <button onClick={() => { setTwoFAActive(false); setShowTwoFASetup(false) }} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors">
                {t.twoFADisable}
              </button>
            </div>
          </div>
        )}

        {!twoFAActive && !showTwoFASetup && (
          <div className="bg-surface-muted border border-surface-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <p className="text-ink font-semibold text-sm">{t.twoFAInactiveTitle}</p>
                  <p className="text-ink-muted text-xs mt-0.5">{t.twoFAInactiveSub}</p>
                </div>
              </div>
              <button onClick={() => setShowTwoFASetup(true)} className="px-4 py-2 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-dark transition-colors">
                {t.twoFAActivate}
              </button>
            </div>
          </div>
        )}

        {showTwoFASetup && (
          <div className="space-y-5">
            <div className="bg-surface-muted border border-surface-border rounded-xl p-6">
              <h3 className="text-ink font-semibold text-sm mb-4">{t.twoFAStep1}</h3>
              <div className="flex items-center gap-6">
                <div className="w-40 h-40 bg-white border-2 border-dashed border-surface-border rounded-xl flex items-center justify-center text-center p-4">
                  <div>
                    <svg className="w-8 h-8 text-ink-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    <p className="text-xs text-ink-muted">{t.twoFAQRHint}</p>
                  </div>
                </div>
                <div className="text-sm text-ink-muted">
                  <p className="mb-2">{t.twoFAAppsLabel}</p>
                  <ul className="space-y-1 text-xs">
                    <li>- Google Authenticator</li>
                    <li>- Microsoft Authenticator</li>
                    <li>- Authy</li>
                  </ul>
                  <p className="mt-3 text-xs bg-surface-muted rounded-lg p-2 border border-surface-border font-mono break-all">
                    DEMO-XXXX-XXXX-XXXX-XXXX
                  </p>
                  <p className="text-xs text-ink-muted mt-1">{t.twoFAManualHint}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-muted border border-surface-border rounded-xl p-6">
              <h3 className="text-ink font-semibold text-sm mb-3">{t.twoFAStep2}</h3>
              <div className="flex gap-3">
                <input type="text" value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6}
                  className="flex-1 px-4 py-3 rounded-lg border border-surface-border bg-white text-ink text-center text-xl tracking-[0.5em] font-mono placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                <button onClick={() => { if (totpCode.length === 6) { setTwoFAActive(true); setShowTwoFASetup(false); setTotpCode('') } }}
                  disabled={totpCode.length !== 6}
                  className="px-6 py-3 bg-purple text-white rounded-lg font-semibold text-sm hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {t.twoFAConfirm}
                </button>
              </div>
              <p className="text-xs text-ink-muted mt-2">{t.twoFADemoHint}</p>
            </div>

            <button onClick={() => setShowTwoFASetup(false)} className="text-sm text-ink-muted hover:text-ink transition-colors">
              {t.twoFACancel}
            </button>
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
        className="bg-cyan text-navy-dark font-semibold px-6 py-3 rounded-lg hover:bg-cyan-light transition-colors"
      >
        {t.saveBtn}
      </button>
      {saved && (
        <span className="ml-3 text-green-400 text-sm">{t.savedMsg}</span>
      )}
    </div>
  )
}
