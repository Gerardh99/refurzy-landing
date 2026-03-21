'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── 7-step pipeline (kandidaat perspectief) ────────────────────────────────

const pipelineSteps = [
  { key: 'voorgesteld', label: 'Voorgesteld', icon: '📩' },
  { key: 'interesse', label: 'Interesse', icon: '✓' },
  { key: 'scan', label: 'Scan', icon: '🧪' },
  { key: 'voorgedragen', label: 'Voorgedragen', icon: '📤' },
  { key: 'gesprek', label: 'Gesprek', icon: '🤝' },
  { key: 'voorwaarden', label: 'Voorwaarden', icon: '💼' },
  { key: 'contract', label: 'Contract', icon: '🎉' },
]

interface Sollicitatie {
  id: string
  vacatureTitle: string
  bedrijf: string
  bedrijfAnoniem: boolean
  vakgebied: string
  locatie: string
  mScore: number | null
  pipelineStap: number
  scoutNaam: string
  datum: string
  status: 'actief' | 'afgewezen' | 'contract'
  dualStatus?: { opdrachtgever: boolean; kandidaat: boolean }
  statusBericht?: string
  actieNodig?: string
}

const sollicitaties: Sollicitatie[] = [
  {
    id: 'kv-1',
    vacatureTitle: 'Marketing Manager',
    bedrijf: 'TechVentures B.V.',
    bedrijfAnoniem: false,
    vakgebied: 'Marketing & E-commerce',
    locatie: 'Amsterdam',
    mScore: 87,
    pipelineStap: 4,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-01',
    status: 'actief',
    dualStatus: { opdrachtgever: true, kandidaat: true },
    statusBericht: 'Gesprek gepland op 25 maart bij TechVentures B.V.',
    actieNodig: 'Bevestig na je gesprek of het is doorgegaan',
  },
  {
    id: 'kv-2',
    vacatureTitle: 'Brand Strategist',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    vakgebied: 'Marketing & E-commerce',
    locatie: 'Utrecht',
    mScore: 71,
    pipelineStap: 3,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-12',
    status: 'actief',
    dualStatus: { opdrachtgever: false, kandidaat: false },
    statusBericht: 'Je profiel is voorgedragen aan de opdrachtgever. Wacht op review.',
  },
  {
    id: 'kv-3',
    vacatureTitle: 'Data Engineer',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    vakgebied: 'ICT & Development',
    locatie: 'Rotterdam',
    mScore: null,
    pipelineStap: 1,
    scoutNaam: 'Mark Jansen',
    datum: '2026-03-16',
    status: 'actief',
    actieNodig: 'Vul de Matching Scan in om voorgedragen te worden',
  },
  {
    id: 'kv-6',
    vacatureTitle: 'Digital Marketing Lead',
    bedrijf: 'BrandHouse B.V.',
    bedrijfAnoniem: false,
    vakgebied: 'Marketing & E-commerce',
    locatie: 'Amsterdam',
    mScore: 62,
    pipelineStap: 4,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-02-10',
    status: 'afgewezen',
    statusBericht: 'Niet geselecteerd — opdrachtgever heeft voor een andere kandidaat gekozen',
  },
]

function DualStatusBadge({ opdrachtgever, kandidaat }: { opdrachtgever: boolean; kandidaat: boolean }) {
  if (opdrachtgever && kandidaat) return <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">✓✓ Beide bevestigd</span>
  if (opdrachtgever && !kandidaat) return <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">✓? Wacht op jouw bevestiging</span>
  if (!opdrachtgever && kandidaat) return <span className="text-[10px] bg-orange/15 text-orange px-1.5 py-0.5 rounded font-medium">?✓ Opdrachtgever moet bijwerken</span>
  return null
}

export default function KandidaatPipeline() {
  const [filter, setFilter] = useState<'alle' | 'actief' | 'afgerond'>('alle')

  const filtered = filter === 'alle' ? sollicitaties :
    filter === 'actief' ? sollicitaties.filter(s => s.status === 'actief') :
    sollicitaties.filter(s => s.status === 'afgewezen' || s.status === 'contract')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn voortgang</h1>
        <p className="text-ink-light mt-1">Volg de status van al je sollicitaties in real-time</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['alle', 'actief', 'afgerond'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? 'bg-purple text-white' : 'bg-surface-muted text-ink-light hover:bg-surface-border'
            }`}
          >
            {f === 'alle' ? `Alle (${sollicitaties.length})` :
             f === 'actief' ? `Actief (${sollicitaties.filter(s => s.status === 'actief').length})` :
             `Afgerond (${sollicitaties.filter(s => s.status !== 'actief').length})`}
          </button>
        ))}
      </div>

      {/* Sollicitaties */}
      <div className="space-y-4">
        {filtered.map(s => (
          <Link key={s.id} href={`/demo/kandidaat/vacature/${s.id}`}
            className={`block bg-white rounded-2xl border p-6 space-y-4 transition-colors ${
              s.status === 'afgewezen' ? 'border-surface-border opacity-60' :
              'border-surface-border hover:border-purple/25'
            }`}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">{s.vacatureTitle}</h2>
                <p className="text-ink-light text-sm">
                  {s.bedrijfAnoniem ? (
                    <span className="text-ink-muted italic">Anoniem bedrijf</span>
                  ) : (
                    <span className="text-purple">{s.bedrijf}</span>
                  )}
                  <span className="mx-2 text-ink-muted">·</span>
                  {s.locatie}
                  <span className="mx-2 text-ink-muted">·</span>
                  <span className="text-cyan">{s.vakgebied}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {s.dualStatus && <DualStatusBadge opdrachtgever={s.dualStatus.opdrachtgever} kandidaat={s.dualStatus.kandidaat} />}
                {s.mScore !== null ? (
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-xs border-2 bg-gradient-to-br ${
                    s.mScore >= 75 ? 'from-cyan to-cyan-light border-cyan/40' :
                    s.mScore >= 50 ? 'from-purple to-purple-light border-purple/40' :
                    'from-orange to-orange-light border-orange/40'
                  }`}>
                    {s.mScore}%
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-orange/15 border-2 border-orange/30 flex items-center justify-center text-orange text-sm font-bold">?</div>
                )}
              </div>
            </div>

            {/* 7-step pipeline visual */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-0.5">
                {pipelineSteps.map((step, i) => {
                  const isDone = i < s.pipelineStap
                  const isActive = i === s.pipelineStap
                  const isRejected = s.status === 'afgewezen'
                  return (
                    <div key={step.key} className={`flex-1 h-2 rounded-full ${
                      isRejected ? (i <= s.pipelineStap ? 'bg-red-400' : 'bg-surface-muted') :
                      isDone ? 'bg-cyan' :
                      isActive ? 'bg-purple' :
                      'bg-surface-muted'
                    }`} />
                  )
                })}
              </div>
              <div className="flex justify-between">
                {pipelineSteps.map((step, i) => {
                  const isDone = i < s.pipelineStap
                  const isActive = i === s.pipelineStap
                  const isRejected = s.status === 'afgewezen'
                  return (
                    <div key={step.key} className="flex-1 text-center">
                      <span className={`text-[9px] ${
                        isRejected && i === s.pipelineStap ? 'text-red-500 font-semibold' :
                        isActive ? 'text-purple font-semibold' :
                        isDone ? 'text-cyan' :
                        'text-ink-muted'
                      }`}>
                        {isDone ? '✓ ' : isActive ? '▶ ' : ''}{step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Status message */}
            {s.statusBericht && (
              <div className={`rounded-xl p-3 flex items-start gap-2 ${
                s.status === 'afgewezen' ? 'bg-red-50' :
                s.actieNodig ? 'bg-orange/10' :
                'bg-surface-muted'
              }`}>
                <span className="text-sm mt-0.5">
                  {s.status === 'afgewezen' ? '❌' :
                   s.pipelineStap === 4 ? '🤝' :
                   s.pipelineStap === 3 ? '⏳' : 'ℹ️'}
                </span>
                <div>
                  <p className={`text-xs ${s.status === 'afgewezen' ? 'text-red-700' : 'text-ink-light'}`}>
                    {s.statusBericht}
                  </p>
                </div>
              </div>
            )}

            {/* Action needed */}
            {s.actieNodig && s.status !== 'afgewezen' && (
              <div className="bg-purple/5 border border-purple/15 rounded-xl p-3 flex items-center gap-2">
                <span className="text-sm">👉</span>
                <p className="text-xs text-purple font-medium">{s.actieNodig}</p>
                <span className="ml-auto text-purple text-xs">→</span>
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-ink-muted pt-1 border-t border-surface-border">
              <span>Via {s.scoutNaam}</span>
              <span>Voorgesteld op {new Date(s.datum).toLocaleDateString('nl-NL')}</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-ink-light mt-3">Geen sollicitaties in deze categorie</p>
        </div>
      )}

      {/* Legenda */}
      <div className="bg-surface-muted rounded-2xl p-5 space-y-3">
        <p className="text-xs font-semibold text-ink">Legenda pipeline</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { color: 'bg-cyan', label: 'Afgerond' },
            { color: 'bg-purple', label: 'Huidige stap' },
            { color: 'bg-surface-muted border border-surface-border', label: 'Nog niet bereikt' },
            { color: 'bg-red-400', label: 'Niet geselecteerd' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-4 h-2 rounded-full ${item.color}`} />
              <span className="text-[10px] text-ink-light">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">✓✓</span>
            <span className="text-[10px] text-ink-light">Beide bevestigd</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">✓?</span>
            <span className="text-[10px] text-ink-light">Wacht op jouw bevestiging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-orange/15 text-orange px-1.5 py-0.5 rounded font-medium">?✓</span>
            <span className="text-[10px] text-ink-light">Opdrachtgever moet bijwerken</span>
          </div>
        </div>
      </div>
    </div>
  )
}
