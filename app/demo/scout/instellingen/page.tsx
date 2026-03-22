'use client'

import { useState } from 'react'

export default function ScoutInstellingen() {
  const [twoFAActive, setTwoFAActive] = useState(false)
  const [showTwoFASetup, setShowTwoFASetup] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const [mode, setMode] = useState<'particulier' | 'zzp'>('particulier')
  const [iban, setIban] = useState('NL91 ABNA 0417 1643 00')
  const [ibanError, setIbanError] = useState('')
  const [kvkNummer, setKvkNummer] = useState('')
  const [kvkVerified, setKvkVerified] = useState(false)
  const [kvkChecking, setKvkChecking] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [saved, setSaved] = useState(false)

  // Mock: particulier limits
  const grensbedrag = 7000 // NL jaargrens particulier
  const huidigVerdiend = 4800
  const aantalBemiddelingen = 2
  const maxBemiddelingenParticulier = 2
  const geblokkeerd = aantalBemiddelingen >= maxBemiddelingenParticulier && mode === 'particulier'

  function handleIbanChange(value: string) {
    setIban(value)
    // Mock: check of IBAN al in gebruik is
    if (value === 'NL91 ABNA 0417 1643 01') {
      setIbanError('Dit IBAN is al geregistreerd bij een ander account. Elk IBAN mag slechts aan één account gekoppeld zijn.')
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
      setMode('zzp')
    }, 1500)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Instellingen & Uitbetaling</h1>
      <p className="text-ink-light mb-8">Beheer je uitbetalingsgegevens en bedrijfsregistratie</p>

      {/* Blokkering banner */}
      {geblokkeerd && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⛔</span>
            <div>
              <h3 className="font-semibold text-red-700 mb-1">Account geblokkeerd voor nieuwe bemiddelingen</h3>
              <p className="text-red-600 text-sm mb-3">
                Je hebt het maximum van {maxBemiddelingenParticulier} bemiddelingen als particulier bereikt.
                Om verder te kunnen bemiddelen moet je je bedrijf registreren bij de KvK.
              </p>
              <button
                onClick={() => setShowUpgrade(true)}
                className="bg-cyan text-navy-dark font-semibold px-4 py-2 rounded-lg text-sm hover:bg-cyan-light transition-colors"
              >
                Upgrade naar zakelijk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status overzicht */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-ink-light text-xs mb-1">Modus</p>
          <p className="text-lg font-semibold">{mode === 'particulier' ? 'Particulier' : 'Zakelijk'}</p>
          {mode === 'particulier' && <p className="text-xs text-orange mt-1">Max {maxBemiddelingenParticulier} bemiddelingen</p>}
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-ink-light text-xs mb-1">Verdiend dit jaar</p>
          <p className="text-lg font-semibold text-cyan">€{huidigVerdiend.toLocaleString()}</p>
          {mode === 'particulier' && (
            <div className="mt-2">
              <div className="w-full bg-surface-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${huidigVerdiend / grensbedrag > 0.8 ? 'bg-orange' : 'bg-cyan'}`}
                  style={{ width: `${Math.min((huidigVerdiend / grensbedrag) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-ink-muted mt-1">€{huidigVerdiend} / €{grensbedrag.toLocaleString()} grens</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-ink-light text-xs mb-1">Bemiddelingen</p>
          <p className="text-lg font-semibold">{aantalBemiddelingen}</p>
          {mode === 'particulier' && (
            <p className={`text-xs mt-1 ${geblokkeerd ? 'text-red-400' : 'text-ink-muted'}`}>
              {geblokkeerd ? 'Limiet bereikt' : `${maxBemiddelingenParticulier - aantalBemiddelingen} resterend`}
            </p>
          )}
        </div>
      </div>

      {/* Belastingdienst info */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Persoonlijke gegevens (verplicht voor belastingdienst)</h2>
        <p className="text-xs text-ink-muted mb-4">
          Wij zijn wettelijk verplicht om jaarlijks een opgave te doen aan de Belastingdienst van alle particulieren die wij hebben uitbetaald.
          Onderstaande gegevens worden 1x per jaar aan de Belastingdienst doorgegeven.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-light mb-1">Volledige naam</label>
            <input defaultValue="Sophie de Graaf" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">BSN</label>
            <input defaultValue="123456789" type="password" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">Adres</label>
            <input defaultValue="Keizersgracht 123, 1015 CJ Amsterdam" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">Geboortedatum</label>
            <input type="date" defaultValue="1990-05-15" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
        </div>
      </div>

      {/* IBAN */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Uitbetalingsgegevens</h2>
        <div>
          <label className="block text-sm text-ink-light mb-1">IBAN rekeningnummer</label>
          <input
            value={iban}
            onChange={e => handleIbanChange(e.target.value)}
            className={`w-full bg-surface-muted border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none ${ibanError ? 'border-red-500' : 'border-surface-border focus:border-cyan'}`}
            placeholder="NL00 BANK 0000 0000 00"
          />
          {ibanError && (
            <p className="text-red-400 text-xs mt-1.5">{ibanError}</p>
          )}
          <p className="text-xs text-ink-muted mt-1.5">
            Elk IBAN mag slechts aan één account gekoppeld zijn om dubbele registraties te voorkomen.
          </p>
        </div>
      </div>

      {/* KVK Upgrade */}
      {(showUpgrade || mode === 'zzp') && (
        <div className="bg-white rounded-2xl border border-cyan/20 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Bedrijfsregistratie</h2>
          <p className="text-sm text-ink-light mb-4">
            Na {maxBemiddelingenParticulier} bemiddelingen als particulier is een KvK-registratie verplicht om verder te kunnen werken op het platform.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ink-light mb-1">KvK-nummer</label>
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
                  {kvkChecking ? 'Controleren...' : 'Verifieer'}
                </button>
              </div>
            </div>
            {kvkVerified && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <div>
                  <p className="text-green-400 text-sm font-medium">KvK-nummer geverifieerd</p>
                  <p className="text-green-400/70 text-xs">De Graaf Consultancy — Actief sinds 2024</p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm text-ink-light mb-1">BTW-nummer (optioneel)</label>
              <input
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan"
                placeholder="NL000000000B01"
              />
            </div>
            <div>
              <label className="block text-sm text-ink-light mb-1">KvK-uittreksel uploaden</label>
              <div className="border-2 border-dashed border-surface-border rounded-lg p-6 text-center hover:border-cyan/30 transition-colors cursor-pointer">
                <p className="text-ink-light text-sm">Sleep je KvK-uittreksel hierheen of klik om te uploaden</p>
                <p className="text-ink-muted text-xs mt-1">PDF of afbeelding, max 5MB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ID Verificatie */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Identiteitsverificatie (EU-wetgeving)</h2>
        <p className="text-sm text-ink-light mb-4">
          Om aan de EU-wetgeving te voldoen voor het uitbetalen van particulieren, dien je een kopie van je paspoort of ID-bewijs te uploaden.
        </p>
        <div className="border-2 border-dashed border-surface-border rounded-lg p-6 text-center hover:border-cyan/30 transition-colors cursor-pointer">
          <p className="text-ink-light text-sm">Upload je paspoort of ID-bewijs</p>
          <p className="text-ink-muted text-xs mt-1">PDF of afbeelding, max 5MB</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span className="text-sm text-green-400/80">ID geverifieerd op 12 maart 2026</span>
        </div>
      </div>

      {/* Uitbetalingsoverzicht */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Uitbetalingshistorie</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border text-ink-light">
              <th className="text-left pb-3">Datum</th>
              <th className="text-left pb-3">Kandidaat</th>
              <th className="text-left pb-3">Opdrachtgever</th>
              <th className="text-right pb-3">Bedrag</th>
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
              <td className="pt-3" colSpan={3}>Totaal dit jaar</td>
              <td className="text-right pt-3 text-cyan">€4.800</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Beveiliging / 2FA */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Beveiliging — Tweestapsverificatie (2FA)</h2>
        <p className="text-sm text-ink-light mb-4">Voeg een extra beveiligingslaag toe aan je account met een authenticator app.</p>

        {twoFAActive && !showTwoFASetup && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="text-green-800 font-semibold text-sm">Tweestapsverificatie is actief</p>
                  <p className="text-green-600 text-xs mt-0.5">Je account is extra beveiligd met 2FA.</p>
                </div>
              </div>
              <button onClick={() => { setTwoFAActive(false); setShowTwoFASetup(false) }} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors">
                Uitschakelen
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
                  <p className="text-ink font-semibold text-sm">Tweestapsverificatie is niet actief</p>
                  <p className="text-ink-muted text-xs mt-0.5">Activeer 2FA om je account beter te beveiligen.</p>
                </div>
              </div>
              <button onClick={() => setShowTwoFASetup(true)} className="px-4 py-2 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-dark transition-colors">
                Activeren
              </button>
            </div>
          </div>
        )}

        {showTwoFASetup && (
          <div className="space-y-5">
            <div className="bg-surface-muted border border-surface-border rounded-xl p-6">
              <h3 className="text-ink font-semibold text-sm mb-4">Stap 1: Scan de QR-code</h3>
              <div className="flex items-center gap-6">
                <div className="w-40 h-40 bg-white border-2 border-dashed border-surface-border rounded-xl flex items-center justify-center text-center p-4">
                  <div>
                    <svg className="w-8 h-8 text-ink-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    <p className="text-xs text-ink-muted">Scan deze QR-code met je authenticator app</p>
                  </div>
                </div>
                <div className="text-sm text-ink-muted">
                  <p className="mb-2">Gebruik een van deze apps:</p>
                  <ul className="space-y-1 text-xs">
                    <li>- Google Authenticator</li>
                    <li>- Microsoft Authenticator</li>
                    <li>- Authy</li>
                  </ul>
                  <p className="mt-3 text-xs bg-surface-muted rounded-lg p-2 border border-surface-border font-mono break-all">
                    DEMO-XXXX-XXXX-XXXX-XXXX
                  </p>
                  <p className="text-xs text-ink-muted mt-1">Of voer deze code handmatig in</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-muted border border-surface-border rounded-xl p-6">
              <h3 className="text-ink font-semibold text-sm mb-3">Stap 2: Voer de verificatiecode in</h3>
              <div className="flex gap-3">
                <input type="text" value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6}
                  className="flex-1 px-4 py-3 rounded-lg border border-surface-border bg-white text-ink text-center text-xl tracking-[0.5em] font-mono placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                <button onClick={() => { if (totpCode.length === 6) { setTwoFAActive(true); setShowTwoFASetup(false); setTotpCode('') } }}
                  disabled={totpCode.length !== 6}
                  className="px-6 py-3 bg-purple text-white rounded-lg font-semibold text-sm hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Bevestigen
                </button>
              </div>
              <p className="text-xs text-ink-muted mt-2">Demo: voer een willekeurige 6-cijferige code in</p>
            </div>

            <button onClick={() => setShowTwoFASetup(false)} className="text-sm text-ink-muted hover:text-ink transition-colors">
              Annuleren
            </button>
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
        className="bg-cyan text-navy-dark font-semibold px-6 py-3 rounded-lg hover:bg-cyan-light transition-colors"
      >
        Opslaan
      </button>
      {saved && (
        <span className="ml-3 text-green-400 text-sm">✓ Opgeslagen</span>
      )}
    </div>
  )
}
