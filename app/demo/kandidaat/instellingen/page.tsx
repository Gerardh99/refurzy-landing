'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function KandidaatInstellingen() {
  const [twoFAActive, setTwoFAActive] = useState(false)
  const [showTwoFASetup, setShowTwoFASetup] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <Link href="/demo/kandidaat" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">
        &larr; Terug naar dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-2 mt-3">Instellingen</h1>
      <p className="text-ink-light mb-8">Beheer je profiel en accountbeveiliging</p>

      {/* Profielgegevens */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profielgegevens</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-light mb-1">Volledige naam</label>
            <input defaultValue="Anna de Jong" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">E-mailadres</label>
            <input defaultValue="anna@email.nl" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">Telefoonnummer</label>
            <input defaultValue="06-12345678" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-ink-light mb-1">Woonplaats</label>
            <input defaultValue="Amsterdam" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan" />
          </div>
        </div>
      </div>

      {/* Notificatievoorkeuren */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Notificatievoorkeuren</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-surface-border text-purple focus:ring-purple/30" />
            <span className="text-sm text-ink">E-mailnotificaties bij nieuwe vacaturevoorstellen</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-surface-border text-purple focus:ring-purple/30" />
            <span className="text-sm text-ink">E-mailnotificaties bij statuswijzigingen</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-surface-border text-purple focus:ring-purple/30" />
            <span className="text-sm text-ink">Marketingcommunicatie en tips</span>
          </label>
        </div>
      </div>

      {/* Beveiliging / 2FA */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Beveiliging &mdash; Tweestapsverificatie (2FA)</h2>
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
        <span className="ml-3 text-green-400 text-sm">Opgeslagen</span>
      )}
    </div>
  )
}
