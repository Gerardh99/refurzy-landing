'use client'

import { kandidaatSollicitaties } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'

export default function KandidaatDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Mijn Sollicitaties</h1>
        <p className="text-gray-400 mt-1">Overzicht van je voordrachten en sollicitaties</p>
      </div>

      <div className="bg-navy-light rounded-2xl border border-cyan/20 p-5 flex items-start gap-3">
        <span className="text-cyan text-lg mt-0.5">&#9432;</span>
        <div className="text-sm text-gray-300 space-y-1">
          <p className="font-medium text-cyan">Hoe werkt Refurzy voor jou?</p>
          <p>Je Talent Scout draagt je anoniem voor bij passende vacatures. De opdrachtgever ziet alleen je profiel en match-scores, niet je naam of contactgegevens.</p>
          <p>Pas wanneer de opdrachtgever jou selecteert, worden je gegevens gedeeld en wordt er contact opgenomen.</p>
        </div>
      </div>

      <div className="space-y-3">
        {kandidaatSollicitaties.map((s) => (
          <div key={s.id} className="bg-navy-light rounded-2xl border border-purple/10 p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-white font-semibold">{s.vacatureTitle}</h3>
              <p className="text-purple-light text-sm">{s.company}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-sm">{new Date(s.datum).toLocaleDateString('nl-NL')}</span>
              <StatusBadge status={s.status.toLowerCase().replace(/ /g, '_')} />
            </div>
          </div>
        ))}
      </div>

      {kandidaatSollicitaties.length === 0 && (
        <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 text-center">
          <p className="text-gray-400">Je hebt nog geen sollicitaties. Je Talent Scout draagt je voor bij passende vacatures.</p>
        </div>
      )}
    </div>
  )
}
