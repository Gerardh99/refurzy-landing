'use client'

import { useState } from 'react'

export default function ScoutInstellingen() {
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
      <p className="text-gray-400 mb-8">Beheer je uitbetalingsgegevens en bedrijfsregistratie</p>

      {/* Blokkering banner */}
      {geblokkeerd && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⛔</span>
            <div>
              <h3 className="font-semibold text-red-400 mb-1">Account geblokkeerd voor nieuwe bemiddelingen</h3>
              <p className="text-red-300/80 text-sm mb-3">
                Je hebt het maximum van {maxBemiddelingenParticulier} bemiddelingen als particulier bereikt.
                Om verder te kunnen bemiddelen moet je je registreren als ZZP&apos;er bij de KvK.
              </p>
              <button
                onClick={() => setShowUpgrade(true)}
                className="bg-cyan text-navy-dark font-semibold px-4 py-2 rounded-lg text-sm hover:bg-cyan-light transition-colors"
              >
                Upgrade naar ZZP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status overzicht */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-navy-light rounded-2xl border border-purple/10 p-5">
          <p className="text-gray-400 text-xs mb-1">Modus</p>
          <p className="text-lg font-semibold">{mode === 'particulier' ? 'Particulier' : 'ZZP / Bedrijf'}</p>
          {mode === 'particulier' && <p className="text-xs text-orange mt-1">Max {maxBemiddelingenParticulier} bemiddelingen</p>}
        </div>
        <div className="bg-navy-light rounded-2xl border border-purple/10 p-5">
          <p className="text-gray-400 text-xs mb-1">Verdiend dit jaar</p>
          <p className="text-lg font-semibold text-cyan">€{huidigVerdiend.toLocaleString()}</p>
          {mode === 'particulier' && (
            <div className="mt-2">
              <div className="w-full bg-navy rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${huidigVerdiend / grensbedrag > 0.8 ? 'bg-orange' : 'bg-cyan'}`}
                  style={{ width: `${Math.min((huidigVerdiend / grensbedrag) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">€{huidigVerdiend} / €{grensbedrag.toLocaleString()} grens</p>
            </div>
          )}
        </div>
        <div className="bg-navy-light rounded-2xl border border-purple/10 p-5">
          <p className="text-gray-400 text-xs mb-1">Bemiddelingen</p>
          <p className="text-lg font-semibold">{aantalBemiddelingen}</p>
          {mode === 'particulier' && (
            <p className={`text-xs mt-1 ${geblokkeerd ? 'text-red-400' : 'text-gray-500'}`}>
              {geblokkeerd ? 'Limiet bereikt' : `${maxBemiddelingenParticulier - aantalBemiddelingen} resterend`}
            </p>
          )}
        </div>
      </div>

      {/* Belastingdienst info */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Persoonlijke gegevens (verplicht voor belastingdienst)</h2>
        <p className="text-xs text-gray-500 mb-4">
          Wij zijn wettelijk verplicht om jaarlijks een opgave te doen aan de Belastingdienst van alle particulieren die wij hebben uitbetaald.
          Onderstaande gegevens worden 1x per jaar aan de Belastingdienst doorgegeven.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Volledige naam</label>
            <input defaultValue="Sophie de Graaf" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">BSN</label>
            <input defaultValue="123456789" type="password" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Adres</label>
            <input defaultValue="Keizersgracht 123, 1015 CJ Amsterdam" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Geboortedatum</label>
            <input type="date" defaultValue="1990-05-15" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan" />
          </div>
        </div>
      </div>

      {/* IBAN */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Uitbetalingsgegevens</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1">IBAN rekeningnummer</label>
          <input
            value={iban}
            onChange={e => handleIbanChange(e.target.value)}
            className={`w-full bg-navy border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none ${ibanError ? 'border-red-500' : 'border-purple/20 focus:border-cyan'}`}
            placeholder="NL00 BANK 0000 0000 00"
          />
          {ibanError && (
            <p className="text-red-400 text-xs mt-1.5">{ibanError}</p>
          )}
          <p className="text-xs text-gray-500 mt-1.5">
            Elk IBAN mag slechts aan één account gekoppeld zijn om dubbele registraties te voorkomen.
          </p>
        </div>
      </div>

      {/* KVK Upgrade */}
      {(showUpgrade || mode === 'zzp') && (
        <div className="bg-navy-light rounded-2xl border border-cyan/20 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">ZZP / Bedrijfsregistratie</h2>
          <p className="text-sm text-gray-400 mb-4">
            Na {maxBemiddelingenParticulier} bemiddelingen als particulier is een KvK-registratie als ZZP&apos;er verplicht om verder te kunnen werken op het platform.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">KvK-nummer</label>
              <div className="flex gap-2">
                <input
                  value={kvkNummer}
                  onChange={e => { setKvkNummer(e.target.value); setKvkVerified(false) }}
                  className="flex-1 bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan"
                  placeholder="12345678"
                  maxLength={8}
                />
                <button
                  onClick={handleKvkCheck}
                  disabled={kvkChecking || kvkNummer.length < 8}
                  className="bg-purple text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-light transition-colors disabled:opacity-50"
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
              <label className="block text-sm text-gray-400 mb-1">BTW-nummer (optioneel)</label>
              <input
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan"
                placeholder="NL000000000B01"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">KvK-uittreksel uploaden</label>
              <div className="border-2 border-dashed border-purple/20 rounded-lg p-6 text-center hover:border-cyan/30 transition-colors cursor-pointer">
                <p className="text-gray-400 text-sm">Sleep je KvK-uittreksel hierheen of klik om te uploaden</p>
                <p className="text-gray-600 text-xs mt-1">PDF of afbeelding, max 5MB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ID Verificatie */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Identiteitsverificatie (EU-wetgeving)</h2>
        <p className="text-sm text-gray-400 mb-4">
          Om aan de EU-wetgeving te voldoen voor het uitbetalen van particulieren, dien je een kopie van je paspoort of ID-bewijs te uploaden.
        </p>
        <div className="border-2 border-dashed border-purple/20 rounded-lg p-6 text-center hover:border-cyan/30 transition-colors cursor-pointer">
          <p className="text-gray-400 text-sm">Upload je paspoort of ID-bewijs</p>
          <p className="text-gray-600 text-xs mt-1">PDF of afbeelding, max 5MB</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span className="text-sm text-green-400/80">ID geverifieerd op 12 maart 2026</span>
        </div>
      </div>

      {/* Uitbetalingsoverzicht */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Uitbetalingshistorie</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple/10 text-gray-400">
              <th className="text-left pb-3">Datum</th>
              <th className="text-left pb-3">Kandidaat</th>
              <th className="text-left pb-3">Opdrachtgever</th>
              <th className="text-right pb-3">Bedrag</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-purple/5">
              <td className="py-3">08-03-2026</td>
              <td>Anna de Jong</td>
              <td>TechVentures B.V.</td>
              <td className="text-right text-cyan font-medium">€2.400</td>
            </tr>
            <tr className="border-b border-purple/5">
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
