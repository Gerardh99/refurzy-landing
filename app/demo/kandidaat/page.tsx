'use client'

import Link from 'next/link'

const pipelineSteps = [
  { key: 'voorgedragen', label: 'Voorgedragen' },
  { key: 'gesprek', label: 'Gesprek' },
  { key: 'arbeidsvoorwaarden', label: 'Arbeidsvoorwaarden' },
  { key: 'contract', label: 'Contract' },
]

interface KandidaatVacature {
  id: string
  vacatureTitle: string
  bedrijf: string
  bedrijfAnoniem: boolean
  mScore: number | null
  pipelineStap: number // 0-3 index in pipelineSteps
  scoutNaam: string
  datum: string
  sector: string
  locatie: string
}

const mockVacatures: KandidaatVacature[] = [
  {
    id: 'kv-1',
    vacatureTitle: 'Marketing Manager',
    bedrijf: 'TechVentures B.V.',
    bedrijfAnoniem: false,
    mScore: 87,
    pipelineStap: 2,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-01',
    sector: 'Technologie',
    locatie: 'Amsterdam',
  },
  {
    id: 'kv-2',
    vacatureTitle: 'Brand Strategist',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: 71,
    pipelineStap: 1,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-12',
    sector: 'Marketing & Communicatie',
    locatie: 'Utrecht',
  },
  {
    id: 'kv-3',
    vacatureTitle: 'Data Engineer',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: null,
    pipelineStap: 0,
    scoutNaam: 'Mark Jansen',
    datum: '2026-03-16',
    sector: 'IT & Data',
    locatie: 'Rotterdam',
  },
]

const mockDocumenten = [
  { naam: 'Toestemmingsverklaring', status: 'getekend', datum: '2026-02-28' },
  { naam: 'Privacyverklaring', status: 'getekend', datum: '2026-02-28' },
]

function MScoreCircle({ score }: { score: number }) {
  const color = score >= 75 ? 'from-cyan to-cyan-light border-cyan/40' :
    score >= 50 ? 'from-purple to-purple-light border-purple/40' :
    'from-orange to-orange-light border-orange/40'
  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white text-sm border-2`}>
      {score}%
    </div>
  )
}

export default function KandidaatDashboard() {
  const scanCompleted = true
  const aantalVacatures = mockVacatures.length
  const actieveProcessen = mockVacatures.filter(v => v.pipelineStap > 0).length

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Welkom, Anna</h1>
        <p className="text-ink-light mt-1">Hier vind je een overzicht van je vacatures, pipeline en documenten.</p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">🧪</span>
            <p className="text-xs text-ink-muted">Matching Scan</p>
          </div>
          {scanCompleted ? (
            <p className="text-lg font-semibold text-green-600">Ingevuld &#10003;</p>
          ) : (
            <div>
              <p className="text-lg font-semibold text-orange">Nog niet ingevuld</p>
              <Link href="/demo/kandidaat/matching-scan"
                className="mt-2 inline-block text-xs text-cyan font-medium hover:underline">
                Vul nu in &rarr;
              </Link>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">📋</span>
            <p className="text-xs text-ink-muted">Aantal vacatures</p>
          </div>
          <p className="text-2xl font-bold text-ink">{aantalVacatures}</p>
          <p className="text-[10px] text-ink-muted mt-1">vacatures waarvoor je bent voorgedragen</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">📈</span>
            <p className="text-xs text-ink-muted">Pipeline</p>
          </div>
          <p className="text-2xl font-bold text-ink">{actieveProcessen}</p>
          <p className="text-[10px] text-ink-muted mt-1">actieve processen</p>
        </div>
      </div>

      {/* Mijn vacatures */}
      <div>
        <h2 className="text-lg font-semibold text-ink mb-4">Mijn vacatures</h2>
        <div className="space-y-4">
          {mockVacatures.map(v => (
            <Link key={v.id} href={`/demo/kandidaat/vacature/${v.id}`}
              className="block bg-white rounded-2xl border border-surface-border p-6 hover:border-purple/25 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-ink font-semibold">{v.vacatureTitle}</h3>
                  <p className="text-ink-light text-sm">
                    {v.bedrijfAnoniem ? (
                      <span className="text-ink-muted italic">Bedrijfsnaam zichtbaar na contract</span>
                    ) : (
                      <span className="text-purple">{v.bedrijf}</span>
                    )}
                    <span className="mx-2 text-ink-faint">|</span>
                    {v.locatie}
                    <span className="mx-2 text-ink-faint">|</span>
                    {v.sector}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {v.mScore !== null ? (
                    <MScoreCircle score={v.mScore} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange/15 border-2 border-orange/30 flex items-center justify-center text-orange text-lg font-bold">
                      ?
                    </div>
                  )}
                </div>
              </div>

              {/* Pipeline */}
              <div className="flex items-center gap-1">
                {pipelineSteps.map((step, i) => {
                  const isActive = i === v.pipelineStap
                  const isDone = i < v.pipelineStap
                  return (
                    <div key={step.key} className="flex-1 flex items-center gap-1">
                      <div className={`flex-1 h-2 rounded-full ${
                        isDone ? 'bg-cyan' :
                        isActive ? 'bg-purple' :
                        'bg-surface-muted'
                      }`} />
                      {i < pipelineSteps.length - 1 && <div className="w-1" />}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-1.5">
                {pipelineSteps.map((step, i) => {
                  const isActive = i === v.pipelineStap
                  return (
                    <span key={step.key} className={`text-[10px] flex-1 ${
                      isActive ? 'text-purple font-semibold' : 'text-ink-muted'
                    }`}>
                      {step.label}
                    </span>
                  )
                })}
              </div>

              <div className="mt-3 text-xs text-ink-muted">
                Voorgedragen door <span className="text-ink-light font-medium">{v.scoutNaam}</span>
                <span className="mx-2 text-ink-faint">|</span>
                {new Date(v.datum).toLocaleDateString('nl-NL')}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mijn documenten */}
      <div>
        <h2 className="text-lg font-semibold text-ink mb-4">Mijn documenten</h2>
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">Document</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">Datum</th>
              </tr>
            </thead>
            <tbody>
              {mockDocumenten.map(d => (
                <tr key={d.naam} className="border-b border-surface-border last:border-0">
                  <td className="px-5 py-3.5 text-ink font-medium">{d.naam}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Getekend
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-ink-light text-xs">
                    {new Date(d.datum).toLocaleDateString('nl-NL')}
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
