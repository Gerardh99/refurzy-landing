'use client'

import { useState } from 'react'
import { vacatures } from '@/lib/mock-data'

type UitnodigingType = 'pool' | 'vacature'

const mockUitnodigingen = [
  { id: 1, naam: 'Eva Bakker', email: 'eva.bakker@email.nl', datum: '2026-03-10', status: 'Geaccepteerd', type: 'pool' as const, vacature: null },
  { id: 2, naam: 'Daan de Wit', email: 'daan.dewit@email.nl', datum: '2026-03-14', status: 'Verstuurd', type: 'vacature' as const, vacature: 'Senior Frontend Developer' },
  { id: 3, naam: 'Sophie Mulder', email: 'sophie.mulder@email.nl', datum: '2026-03-16', status: 'Scan ingevuld', type: 'vacature' as const, vacature: 'Product Manager' },
  { id: 4, naam: 'Tom Hendriks', email: 'tom@email.nl', datum: '2026-03-18', status: 'Verstuurd', type: 'pool' as const, vacature: null },
]

export default function KandidaatUitnodigen() {
  const [type, setType] = useState<UitnodigingType>('pool')
  const [selectedVacature, setSelectedVacature] = useState('')
  const [email, setEmail] = useState('')
  const [naam, setNaam] = useState('')
  const [persoonlijkeBoodschap, setPersoonlijkeBoodschap] = useState('')
  const [copied, setCopied] = useState(false)
  const [emailPreview, setEmailPreview] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const poolLink = 'https://refurzy.com/uitnodiging/SCOUT-abc123'
  const vacatureLink = selectedVacature
    ? `https://refurzy.com/uitnodiging/SCOUT-abc123/vacature/${selectedVacature}`
    : ''

  const activeVacature = vacatures.find(v => v.id === selectedVacature)

  const handleCopy = () => {
    navigator.clipboard.writeText(type === 'pool' ? poolLink : vacatureLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendInvite = () => {
    if (!email || !naam) return
    setToast(`Uitnodiging verstuurd naar ${naam}`)
    setEmail('')
    setNaam('')
    setPersoonlijkeBoodschap('')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-pulse">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Kandidaat uitnodigen</h1>
        <p className="text-gray-400 mt-1">Nodig kandidaten uit voor je talent pool of voor een specifieke vacature</p>
      </div>

      {/* Type selector */}
      <div className="flex gap-1 bg-navy-light rounded-xl p-1 border border-purple/10 w-fit">
        <button
          onClick={() => setType('pool')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            type === 'pool' ? 'bg-purple/15 text-cyan border border-purple/20' : 'text-gray-400 hover:text-white hover:bg-purple/5'
          }`}
        >
          👥 Talent Pool (generiek)
        </button>
        <button
          onClick={() => setType('vacature')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            type === 'vacature' ? 'bg-purple/15 text-cyan border border-purple/20' : 'text-gray-400 hover:text-white hover:bg-purple/5'
          }`}
        >
          📋 Specifieke vacature
        </button>
      </div>

      {/* Uitleg */}
      <div className={`rounded-2xl border p-5 flex items-start gap-3 ${
        type === 'pool'
          ? 'bg-purple/10 border-purple/20'
          : 'bg-cyan/10 border-cyan/20'
      }`}>
        <span className={`text-lg mt-0.5 ${type === 'pool' ? 'text-purple-light' : 'text-cyan'}`}>ℹ️</span>
        <div className="text-sm space-y-1">
          {type === 'pool' ? (
            <>
              <p className="font-medium text-purple-light">Generieke uitnodiging — Talent Pool</p>
              <p className="text-gray-300">De kandidaat wordt toegevoegd aan jouw talent pool. Er hoeft nog geen assessment te worden ingevuld. Zodra je de kandidaat voordraagt voor een specifieke vacature, ontvangt deze een uitnodiging om de 35-vragen M-Score in te vullen.</p>
            </>
          ) : (
            <>
              <p className="font-medium text-cyan">Vacature-specifieke uitnodiging</p>
              <p className="text-gray-300">De kandidaat ontvangt een enthousiasmerende e-mail met vacaturedetails en wordt direct uitgenodigd om de 35-vragen M-Score assessment in te vullen voor deze specifieke vacature. De M-Score moet per vacature opnieuw worden ingevuld.</p>
            </>
          )}
        </div>
      </div>

      {/* Vacature selector (alleen bij vacature-specifiek) */}
      {type === 'vacature' && (
        <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Selecteer vacature</h2>
          <select
            value={selectedVacature}
            onChange={e => setSelectedVacature(e.target.value)}
            className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan/50"
          >
            <option value="">Kies een vacature...</option>
            {vacatures.map(v => (
              <option key={v.id} value={v.id}>{v.title} — {v.company}</option>
            ))}
          </select>

          {activeVacature && (
            <div className="bg-navy rounded-xl border border-cyan/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{activeVacature.title}</h3>
                <span className="text-xs text-cyan bg-cyan/15 px-2 py-1 rounded border border-cyan/20">Geselecteerd</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Bedrijf:</span> <span className="text-gray-300">{activeVacature.company}</span></div>
                <div><span className="text-gray-500">Locatie:</span> <span className="text-gray-300">{activeVacature.location}</span></div>
                <div><span className="text-gray-500">Salaris:</span> <span className="text-gray-300">{activeVacature.salaris}</span></div>
                <div><span className="text-gray-500">Deadline:</span> <span className="text-gray-300">{new Date(activeVacature.deadline).toLocaleDateString('nl-NL')}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uitnodigingsformulier */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">
          {type === 'pool' ? 'Uitnodigen per e-mail of link' : 'Uitnodigen per e-mail'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Naam kandidaat</label>
            <input
              type="text" value={naam} onChange={e => setNaam(e.target.value)}
              placeholder="Volledige naam"
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">E-mailadres</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="naam@email.nl"
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600"
            />
          </div>
        </div>

        {type === 'vacature' && (
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Persoonlijke boodschap (optioneel)</label>
            <textarea
              rows={3} value={persoonlijkeBoodschap}
              onChange={e => setPersoonlijkeBoodschap(e.target.value)}
              placeholder="Hi! Ik denk dat deze vacature goed bij je past omdat..."
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600 resize-none"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSendInvite}
            disabled={!email || !naam || (type === 'vacature' && !selectedVacature)}
            className={`flex-1 px-5 py-3 rounded-lg font-semibold text-sm transition-all ${
              email && naam && (type === 'pool' || selectedVacature)
                ? 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            ✉️ Uitnodiging versturen
          </button>
          {type === 'vacature' && email && naam && activeVacature && (
            <button
              onClick={() => setEmailPreview(true)}
              className="px-5 py-3 bg-purple/15 text-purple-light border border-purple/20 rounded-lg font-semibold text-sm hover:bg-purple/25 transition-colors"
            >
              👁 Preview e-mail
            </button>
          )}
        </div>
      </div>

      {/* Generieke link (alleen bij pool) */}
      {type === 'pool' && (
        <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Of deel je generieke uitnodigingslink</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-navy border border-purple/20 rounded-lg px-4 py-3 text-cyan text-sm font-mono break-all">
              {poolLink}
            </div>
            <button onClick={handleCopy} className="px-5 py-3 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors whitespace-nowrap">
              {copied ? 'Gekopieerd!' : 'Kopieer link'}
            </button>
          </div>
          <p className="text-xs text-gray-600">Kandidaten die via deze link registreren worden direct aan jouw talent pool toegevoegd.</p>
        </div>
      )}

      {/* Recente uitnodigingen */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Recente uitnodigingen</h2>
        <div className="bg-navy-light rounded-2xl border border-purple/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple/10">
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Naam</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Vacature</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Datum</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUitnodigingen.map(u => (
                <tr key={u.id} className="border-b border-purple/5 last:border-0">
                  <td className="px-6 py-3 text-white">{u.naam}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      u.type === 'pool' ? 'bg-purple/15 text-purple-light' : 'bg-cyan/15 text-cyan'
                    }`}>
                      {u.type === 'pool' ? '👥 Pool' : '📋 Vacature'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">{u.vacature || '—'}</td>
                  <td className="px-6 py-3 text-gray-400">{new Date(u.datum).toLocaleDateString('nl-NL')}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                      u.status === 'Geaccepteerd' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                      u.status === 'Scan ingevuld' ? 'bg-cyan/15 text-cyan border-cyan/30' :
                      'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email preview modal */}
      {emailPreview && activeVacature && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Email header */}
            <div className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple p-6">
              <img src="/logo-white.png" alt="Refurzy" className="h-6 mb-4 opacity-80" />
              <h3 className="text-white text-xl font-bold">Er is een vacature die bij je past!</h3>
            </div>
            {/* Email body */}
            <div className="p-6 space-y-4 text-sm text-gray-700">
              <p>Hi {naam || 'kandidaat'},</p>
              <p>
                <strong>Sophie de Graaf</strong> denkt dat onderstaande vacature goed bij jou past
                en nodigt je uit om deel te nemen aan het selectieproces via Refurzy.
              </p>

              {persoonlijkeBoodschap && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 italic text-purple-700">
                  &quot;{persoonlijkeBoodschap}&quot;
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-5 space-y-3 border">
                <h4 className="font-bold text-gray-900 text-base">{activeVacature.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">🏢 Bedrijf:</span> <span className="font-medium">{activeVacature.company}</span></div>
                  <div><span className="text-gray-500">📍 Locatie:</span> <span className="font-medium">{activeVacature.location}</span></div>
                  <div><span className="text-gray-500">💰 Salaris:</span> <span className="font-medium">{activeVacature.salaris}</span></div>
                  <div><span className="text-gray-500">📅 Start:</span> <span className="font-medium">Per direct</span></div>
                  <div><span className="text-gray-500">🏠 Werkwijze:</span> <span className="font-medium">{activeVacature.hardeCriteria.opKantoor}</span></div>
                  <div><span className="text-gray-500">🎓 Niveau:</span> <span className="font-medium">{activeVacature.hardeCriteria.opleidingsniveau}+</span></div>
                </div>
                <div className="border-t pt-3 mt-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Over het team:</p>
                  <p className="text-xs text-gray-600">Een innovatief en informeel team dat werkt aan de toekomst van recruitment. Korte lijnen, veel autonomie en ruimte voor eigen initiatief.</p>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-cyan-800">Wat wordt er van je gevraagd?</p>
                <p className="text-cyan-700 text-xs">Vul een korte vragenlijst in van 35 vragen (± 5 minuten). Op basis hiervan wordt jouw M-Score berekend: een objectieve match-score die aangeeft hoe goed jij bij deze vacature past.</p>
              </div>

              <div className="text-center py-2">
                <div className="inline-block bg-gradient-to-r from-cyan via-blue-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl text-sm">
                  Bekijk vacature en start assessment →
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Je gegevens worden anoniem gepresenteerd aan de opdrachtgever. Pas bij een match worden je contactgegevens gedeeld.
              </p>
            </div>
            {/* Close */}
            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setEmailPreview(false)}
                className="px-5 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
