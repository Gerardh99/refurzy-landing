'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

const pipelineSteps = [
  { key: 'voorgedragen', label: 'Voorgedragen', icon: '📋' },
  { key: 'gesprek', label: 'Gesprek', icon: '🤝' },
  { key: 'arbeidsvoorwaarden', label: 'Arbeidsvoorwaarden', icon: '💼' },
  { key: 'contract', label: 'Contract', icon: '🎉' },
]

// Mock data for vacature details
const vacatureDetails: Record<string, {
  vacatureTitle: string
  locatie: string
  sector: string
  bedrijf: string
  bedrijfAnoniem: boolean
  mScore: number | null
  mScoreDimensions: { werkzaamheden: number; waarden: number; organisatie: number } | null
  pipelineStap: number
  scoutNaam: string
  datum: string
  functieType: string
  werkervaring: string
  opleiding: string
}> = {
  'kv-1': {
    vacatureTitle: 'Marketing Manager',
    locatie: 'Amsterdam',
    sector: 'Technologie',
    bedrijf: 'TechVentures B.V.',
    bedrijfAnoniem: false,
    mScore: 87,
    mScoreDimensions: { werkzaamheden: 91, waarden: 84, organisatie: 86 },
    pipelineStap: 2,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-01',
    functieType: 'Fulltime',
    werkervaring: '5-10 jaar',
    opleiding: 'HBO / WO',
  },
  'kv-2': {
    vacatureTitle: 'Brand Strategist',
    locatie: 'Utrecht',
    sector: 'Marketing & Communicatie',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: 71,
    mScoreDimensions: { werkzaamheden: 68, waarden: 75, organisatie: 70 },
    pipelineStap: 1,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-12',
    functieType: 'Fulltime',
    werkervaring: '2-5 jaar',
    opleiding: 'HBO',
  },
  'kv-3': {
    vacatureTitle: 'Data Engineer',
    locatie: 'Rotterdam',
    sector: 'IT & Data',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: null,
    mScoreDimensions: null,
    pipelineStap: 0,
    scoutNaam: 'Mark Jansen',
    datum: '2026-03-16',
    functieType: 'Fulltime',
    werkervaring: '5-10 jaar',
    opleiding: 'WO',
  },
}

function BarChart({ dimensions }: { dimensions: { werkzaamheden: number; waarden: number; organisatie: number } }) {
  const bars = [
    { label: 'Werkzaamheden', value: dimensions.werkzaamheden, color: 'bg-cyan' },
    { label: 'Waarden', value: dimensions.waarden, color: 'bg-purple' },
    { label: 'Organisatie', value: dimensions.organisatie, color: 'bg-cyan-light' },
  ]

  return (
    <div className="space-y-3">
      {bars.map(bar => (
        <div key={bar.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-ink-light">{bar.label}</span>
            <span className="text-ink font-semibold">{bar.value}%</span>
          </div>
          <div className="h-3 bg-surface-muted rounded-full overflow-hidden">
            <div className={`h-full ${bar.color} rounded-full transition-all duration-500`}
              style={{ width: `${bar.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function KandidaatVacatureDetail() {
  const params = useParams()
  const id = params.id as string
  const vac = vacatureDetails[id]

  if (!vac) {
    return (
      <div className="space-y-4">
        <Link href="/demo/kandidaat" className="text-cyan text-sm hover:underline">&larr; Terug naar overzicht</Link>
        <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
          <p className="text-ink-muted">Vacature niet gevonden.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/demo/kandidaat" className="text-cyan text-sm hover:underline">&larr; Terug naar overzicht</Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">{vac.vacatureTitle}</h1>
            <p className="text-ink-light mt-1">
              {vac.bedrijfAnoniem ? (
                <span className="text-ink-muted italic">Bedrijfsnaam wordt zichtbaar bij contract</span>
              ) : (
                <span className="text-purple font-medium">{vac.bedrijf}</span>
              )}
            </p>
          </div>
          {vac.mScore !== null && (
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${
              vac.mScore >= 75 ? 'from-cyan to-cyan-light border-cyan/40' :
              vac.mScore >= 50 ? 'from-purple to-purple-light border-purple/40' :
              'from-orange to-orange-light border-orange/40'
            } flex items-center justify-center font-bold text-white text-lg border-2`}>
              {vac.mScore}%
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.locatie}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.sector}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.functieType}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.werkervaring} ervaring</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.opleiding}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* M-Score */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">M-Score analyse</h2>
          {vac.mScoreDimensions ? (
            <div>
              <div className="text-center mb-6">
                <div className={`inline-flex w-20 h-20 rounded-full bg-gradient-to-br ${
                  vac.mScore! >= 75 ? 'from-cyan to-cyan-light' :
                  vac.mScore! >= 50 ? 'from-purple to-purple-light' :
                  'from-orange to-orange-light'
                } items-center justify-center text-white font-bold text-xl`}>
                  {vac.mScore}%
                </div>
                <p className="text-xs text-ink-muted mt-2">Totale match score</p>
              </div>
              <BarChart dimensions={vac.mScoreDimensions} />
              <p className="text-[10px] text-ink-muted mt-4 text-center">
                Gebaseerd op de Matching Scan (VU Amsterdam)
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-orange/15 border-2 border-orange/30 flex items-center justify-center text-orange text-2xl mb-3">
                ?
              </div>
              <p className="text-ink-muted text-sm">M-Score nog niet beschikbaar</p>
              <Link href="/demo/kandidaat/matching-scan"
                className="mt-3 inline-block btn-gradient text-white font-semibold px-5 py-2.5 rounded-[10px] text-sm hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
                Start Matching Scan
              </Link>
            </div>
          )}
        </div>

        {/* Pipeline */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">Pipeline status</h2>
          <div className="space-y-4">
            {pipelineSteps.map((step, i) => {
              const isDone = i < vac.pipelineStap
              const isActive = i === vac.pipelineStap
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    isDone ? 'bg-cyan/15 text-cyan' :
                    isActive ? 'bg-purple/15 text-purple ring-2 ring-purple/30' :
                    'bg-surface-muted text-ink-muted'
                  }`}>
                    {isDone ? '✓' : step.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isDone ? 'text-ink' :
                      isActive ? 'text-purple' :
                      'text-ink-muted'
                    }`}>
                      {step.label}
                    </p>
                    {isActive && (
                      <p className="text-[10px] text-purple/70 mt-0.5">Huidige stap</p>
                    )}
                  </div>
                  {isDone && (
                    <span className="text-xs text-green-600 font-medium">Afgerond</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-surface-border">
            <p className="text-xs text-ink-muted">
              Voorgedragen door <span className="text-ink font-medium">{vac.scoutNaam}</span>
            </p>
            <p className="text-xs text-ink-muted mt-1">
              op {new Date(vac.datum).toLocaleDateString('nl-NL')}
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-surface-muted rounded-xl p-4 text-xs text-ink-light">
        <p>
          <strong className="text-ink">Privacy:</strong> Je profiel wordt anoniem gepresenteerd aan de opdrachtgever.
          Pas wanneer het contract wordt geaccepteerd, worden je contactgegevens gedeeld.
          {vac.bedrijfAnoniem && ' De bedrijfsnaam wordt zichtbaar zodra de contractfase is bereikt.'}
        </p>
      </div>
    </div>
  )
}
