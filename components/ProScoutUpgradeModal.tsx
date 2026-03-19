'use client'

import { useState } from 'react'

interface ProScoutUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { bedrijfsnaam: string; kvkNummer: string; btwNummer: string; zakelijkIban: string }) => void
  aantalPlaatsingen: number
}

export default function ProScoutUpgradeModal({ isOpen, onClose, onSubmit, aantalPlaatsingen }: ProScoutUpgradeModalProps) {
  const [bedrijfsnaam, setBedrijfsnaam] = useState('')
  const [kvkNummer, setKvkNummer] = useState('')
  const [btwNummer, setBtwNummer] = useState('')
  const [zakelijkIban, setZakelijkIban] = useState('')
  const [step, setStep] = useState<'celebrate' | 'form'>('celebrate')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!bedrijfsnaam || !kvkNummer) return
    onSubmit({ bedrijfsnaam, kvkNummer, btwNummer, zakelijkIban })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {step === 'celebrate' ? (
          <>
            {/* Celebration header */}
            <div className="bg-gradient-to-br from-cyan via-blue-500 to-purple p-8 text-center text-white">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold">Gefeliciteerd!</h2>
              <p className="text-white/90 mt-2">
                Je hebt al {aantalPlaatsingen} succesvolle plaatsingen gedaan.
                Je bent klaar om professioneel Talent Scout te worden!
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Vision */}
              <div className="bg-surface-muted rounded-xl p-5">
                <p className="text-ink font-medium text-center text-lg">
                  Werk waar je wilt. Wanneer je wilt.<br />
                  <span className="text-cyan">Met alleen een laptop.</span>
                </p>
                <p className="text-ink-light text-sm text-center mt-2">
                  Jouw netwerk is je bedrijf. Of je nu in Amsterdam, Bali of Barcelona zit —
                  als Pro Scout verdien je onbeperkt via het Refurzy platform.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-green-700 font-medium text-sm">💰 Hogere uitbetaling</p>
                  <p className="text-green-600 text-xs mt-1">Geen loonheffing meer — je factureert als ondernemer</p>
                </div>
                <div className="bg-purple/5 rounded-lg p-3">
                  <p className="text-purple font-medium text-sm">♾️ Onbeperkt scouten</p>
                  <p className="text-purple/70 text-xs mt-1">Geen limiet meer op het aantal voordrachten</p>
                </div>
                <div className="bg-cyan/5 rounded-lg p-3">
                  <p className="text-cyan font-medium text-sm">⭐ Pro Scout badge</p>
                  <p className="text-cyan/70 text-xs mt-1">Vergroot je vertrouwen bij opdrachtgevers</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-blue-600 font-medium text-sm">🌍 Werk wereldwijd</p>
                  <p className="text-blue-500 text-xs mt-1">Amsterdam, Bali, Barcelona — jij kiest</p>
                </div>
              </div>

              <button
                onClick={() => setStep('form')}
                className="w-full py-3 bg-gradient-to-r from-cyan to-purple text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Word Pro Scout →
              </button>
              <p className="text-center text-xs text-ink-muted">
                Je hebt een KVK-inschrijving nodig om verder te gaan
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Form header */}
            <div className="bg-purple/5 p-6 border-b border-surface-border">
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                <span>⭐</span> Pro Scout registratie
              </h2>
              <p className="text-ink-light text-sm mt-1">
                Vul je bedrijfsgegevens in om onbeperkt te kunnen scouten
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Bedrijfsnaam *</label>
                <input
                  type="text"
                  value={bedrijfsnaam}
                  onChange={(e) => setBedrijfsnaam(e.target.value)}
                  placeholder="bijv. Scout Solutions B.V."
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">KVK-nummer *</label>
                <input
                  type="text"
                  value={kvkNummer}
                  onChange={(e) => setKvkNummer(e.target.value)}
                  placeholder="12345678"
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
                />
                <p className="text-xs text-ink-muted mt-1">Of buitenlands equivalent (Handelsregister, Companies House, etc.)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">BTW-nummer</label>
                <input
                  type="text"
                  value={btwNummer}
                  onChange={(e) => setBtwNummer(e.target.value)}
                  placeholder="NL001234567B01"
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Zakelijk IBAN</label>
                <input
                  type="text"
                  value={zakelijkIban}
                  onChange={(e) => setZakelijkIban(e.target.value)}
                  placeholder="NL91ABNA0417164300"
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('celebrate')}
                  className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors"
                >
                  Terug
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!bedrijfsnaam || !kvkNummer}
                  className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Activeer Pro Scout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
