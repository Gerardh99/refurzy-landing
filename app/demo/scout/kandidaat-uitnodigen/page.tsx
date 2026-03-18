'use client'

import { useState } from 'react'

const mockUitnodigingen = [
  { id: 1, naam: 'Eva Bakker', email: 'eva.bakker@email.nl', datum: '2026-03-10', status: 'Geaccepteerd' },
  { id: 2, naam: 'Daan de Wit', email: 'daan.dewit@email.nl', datum: '2026-03-14', status: 'Verstuurd' },
  { id: 3, naam: 'Sophie Mulder', email: 'sophie.mulder@email.nl', datum: '2026-03-16', status: 'Verstuurd' },
]

export default function KandidaatUitnodigen() {
  const [copied, setCopied] = useState(false)
  const inviteLink = 'https://refurzy.com/uitnodiging/SCOUT-abc123'

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Kandidaat uitnodigen</h1>
        <p className="text-gray-400 mt-1">Nodig nieuwe kandidaten uit voor je talent pool</p>
      </div>

      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Jouw uitnodigingslink</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-navy border border-purple/20 rounded-lg px-4 py-3 text-cyan text-sm font-mono break-all">
            {inviteLink}
          </div>
          <button
            onClick={handleCopy}
            className="px-5 py-3 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors whitespace-nowrap"
          >
            {copied ? 'Gekopieerd!' : 'Kopieer link'}
          </button>
        </div>
        <div className="bg-navy rounded-xl border border-purple/10 p-4 text-sm text-gray-400 space-y-2">
          <p className="font-medium text-purple-light">Hoe werkt het?</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Deel deze persoonlijke link met een kandidaat uit je netwerk.</li>
            <li>De kandidaat maakt een account aan en wordt direct aan jouw talent pool gekoppeld.</li>
            <li>Na registratie uploadt de kandidaat een CV en vult de Profiel Match Scan in.</li>
            <li>Zodra de scan is afgerond, kun je de kandidaat voordragen voor passende vacatures.</li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Recente uitnodigingen</h2>
        <div className="bg-navy-light rounded-2xl border border-purple/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple/10">
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Naam</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Datum</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUitnodigingen.map((u) => (
                <tr key={u.id} className="border-b border-purple/5 last:border-0">
                  <td className="px-6 py-3 text-white">{u.naam}</td>
                  <td className="px-6 py-3 text-gray-400">{u.email}</td>
                  <td className="px-6 py-3 text-gray-400">{new Date(u.datum).toLocaleDateString('nl-NL')}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                      u.status === 'Geaccepteerd'
                        ? 'bg-green-500/15 text-green-400 border-green-500/30'
                        : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
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
    </div>
  )
}
