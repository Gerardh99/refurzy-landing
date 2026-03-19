'use client'

import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'

const mockVoordrachten = [
  {
    id: 'v1',
    vacatureTitle: 'Senior Frontend Developer',
    company: 'TechVentures B.V.',
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-10',
    scanStatus: 'afgerond' as const,
    mScore: 87,
    procesStatus: 'kennismaking',
  },
  {
    id: 'v2',
    vacatureTitle: 'Product Manager',
    company: 'GrowthCo',
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-16',
    scanStatus: 'open' as const,
    mScore: null,
    procesStatus: 'scan_nodig',
  },
  {
    id: 'v3',
    vacatureTitle: 'Data Engineer',
    company: 'DataFirst B.V.',
    scoutNaam: 'Mark Jansen',
    datum: '2026-03-05',
    scanStatus: 'afgerond' as const,
    mScore: 71,
    procesStatus: 'voorgedragen',
  },
]

export default function KandidaatDashboard() {
  const openScans = mockVoordrachten.filter(v => v.scanStatus === 'open').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Mijn Vacatures</h1>
        <p className="text-gray-400 mt-1">Overzicht van vacatures waarvoor je bent voorgedragen</p>
      </div>

      {/* Scan alert */}
      {openScans > 0 && (
        <div className="bg-orange/10 border border-orange/30 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧪</span>
            <div>
              <p className="text-orange font-semibold text-sm">{openScans} assessment{openScans > 1 ? 's' : ''} nog in te vullen</p>
              <p className="text-orange/70 text-xs mt-0.5">Vul de M-Score vragenlijst in om gematcht te worden aan de vacature</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-navy-light rounded-2xl border border-cyan/20 p-5 flex items-start gap-3">
        <span className="text-cyan text-lg mt-0.5">ℹ️</span>
        <div className="text-sm text-gray-300 space-y-1">
          <p className="font-medium text-cyan">Hoe werkt Refurzy voor jou?</p>
          <p>Je Talent Scout draagt je voor bij passende vacatures. Per vacature vul je een korte vragenlijst in (35 vragen, ± 5 min) waarmee je M-Score wordt berekend.</p>
          <p>Je wordt anoniem gepresenteerd. Pas wanneer de opdrachtgever jou selecteert, worden je gegevens gedeeld.</p>
        </div>
      </div>

      {/* Voordrachten */}
      <div className="space-y-3">
        {mockVoordrachten.map(v => (
          <div key={v.id} className="bg-navy-light rounded-2xl border border-purple/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">{v.vacatureTitle}</h3>
                <p className="text-purple-light text-sm">{v.company}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-500 text-xs">Via {v.scoutNaam}</span>
                <div className="text-gray-600 text-xs mt-0.5">{new Date(v.datum).toLocaleDateString('nl-NL')}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* M-Score */}
                {v.mScore ? (
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                      v.mScore >= 75 ? 'from-cyan to-cyan-light border-cyan/40' :
                      v.mScore >= 50 ? 'from-purple to-purple-light border-purple/40' :
                      'from-orange to-orange-light border-orange/40'
                    } flex items-center justify-center font-bold text-white text-xs border-2`}>
                      {v.mScore}%
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">M-Score</div>
                      <div className="text-xs text-green-400">✓ Assessment afgerond</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-orange/15 border-2 border-orange/30 flex items-center justify-center text-orange text-lg">
                      ?
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">M-Score</div>
                      <div className="text-xs text-orange">⚠ Assessment nog invullen</div>
                    </div>
                  </div>
                )}

                {/* Status */}
                <StatusBadge status={v.procesStatus === 'scan_nodig' ? 'nieuw' : v.procesStatus === 'kennismaking' ? 'bekijk' : 'aanbevolen'} />
              </div>

              {/* Action */}
              {v.scanStatus === 'open' ? (
                <Link
                  href={`/demo/kandidaat/scan?vacature=${v.id}`}
                  className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-[10px] text-sm hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all"
                >
                  🧪 Start M-Score assessment
                </Link>
              ) : (
                <Link
                  href={`/demo/kandidaat/scan?vacature=${v.id}`}
                  className="bg-purple/15 text-purple-light px-5 py-2.5 rounded-[10px] text-sm font-semibold border border-purple/20 hover:bg-purple/25 transition-colors"
                >
                  Bekijk resultaat
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {mockVoordrachten.length === 0 && (
        <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 text-center">
          <p className="text-gray-400">Je bent nog niet voorgedragen voor vacatures. Je Talent Scout draagt je voor bij passende vacatures.</p>
        </div>
      )}
    </div>
  )
}
