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
  land: string
  vakgebied: string
  sector: string
  bedrijf: string
  bedrijfAnoniem: boolean
  mScore: number | null
  mScoreDimensions: { werkzaamheden: number; waarden: number; organisatie: number } | null
  hardeCriteriaFit: number | null
  hardeCriteriaDetails: { label: string; status: 'voldoet' | 'bijna' | 'niet' }[] | null
  pipelineStap: number
  scoutNaam: string
  datum: string
  functieType: string
  werkervaring: string
  opleiding: string
  salaris: string
  opKantoor: string
  maxReistijd: string
  contractType: string
  deadline: string
  omschrijving: string
  taken: string[]
  watBiedenWij: string[]
  afdelingscultuur: string
}> = {
  'kv-1': {
    vacatureTitle: 'Marketing Manager',
    locatie: 'Amsterdam',
    land: 'Nederland',
    vakgebied: 'Marketing & E-commerce',
    sector: 'Technologie',
    bedrijf: 'TechVentures B.V.',
    bedrijfAnoniem: false,
    mScore: 87,
    mScoreDimensions: { werkzaamheden: 91, waarden: 84, organisatie: 86 },
    hardeCriteriaFit: 100,
    hardeCriteriaDetails: [
      { label: 'Opleidingsniveau (HBO)', status: 'voldoet' },
      { label: 'Werkervaring (5-10 jaar)', status: 'voldoet' },
      { label: 'Locatie (Amsterdam)', status: 'voldoet' },
      { label: 'Hybride werken (3 dagen)', status: 'voldoet' },
      { label: 'Max reistijd (45 min)', status: 'voldoet' },
    ],
    pipelineStap: 2,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-01',
    functieType: 'Fulltime',
    werkervaring: '5-10 jaar',
    opleiding: 'HBO / WO',
    salaris: '€4.500 - €6.000 bruto per maand',
    opKantoor: 'Hybride (3 dagen)',
    maxReistijd: '45 minuten',
    contractType: 'Vast',
    deadline: '2026-04-15',
    omschrijving: 'Ben jij een ervaren Marketing Manager en zoek je een nieuwe uitdaging in Amsterdam? Wij zoeken een gedreven professional voor ons marketingteam. Je werkt in een informele, snelgroeiende tech-omgeving waar data-gedreven marketing centraal staat.',
    taken: [
      'Ontwikkelen en uitvoeren van de marketingstrategie, zowel online als offline',
      'Aansturen van het marketingteam en externe bureaus (SEO, SEA, social media)',
      'Analyseren van campagneresultaten, conversiedata en ROI; bijsturen waar nodig',
      'Beheren van het marketingbudget en rapporteren aan het managementteam',
      'Positioneren van het merk in de markt en ontwikkelen van content- en communicatieplannen',
      'Samenwerken met Sales en Product om go-to-market strategieën te ontwikkelen',
    ],
    watBiedenWij: [
      '€4.500 - €6.000 bruto per maand',
      'Vast contract',
      'Hybride werken (3 dagen op kantoor)',
      'Locatie: Amsterdam',
      '25 vakantiedagen + persoonlijk ontwikkelingsbudget',
      'Pensioenregeling en reiskostenvergoeding',
    ],
    afdelingscultuur: 'Ons marketingteam van 8 personen werkt in een informele, energieke omgeving. We combineren data-gedreven beslissingen met creatieve brainstorms. Het tempo is hoog maar de sfeer is open en ondersteunend.',
  },
  'kv-2': {
    vacatureTitle: 'Brand Strategist',
    locatie: 'Utrecht',
    land: 'Nederland',
    vakgebied: 'Marketing & E-commerce',
    sector: 'Marketing & Communicatie',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: 71,
    mScoreDimensions: { werkzaamheden: 68, waarden: 75, organisatie: 70 },
    hardeCriteriaFit: 92,
    hardeCriteriaDetails: [
      { label: 'Opleidingsniveau (HBO)', status: 'voldoet' },
      { label: 'Werkervaring (2-5 jaar)', status: 'voldoet' },
      { label: 'Locatie (Utrecht)', status: 'voldoet' },
      { label: 'Hybride werken (2 dagen)', status: 'voldoet' },
      { label: 'Max reistijd (60 min)', status: 'bijna' },
    ],
    pipelineStap: 1,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-12',
    functieType: 'Fulltime',
    werkervaring: '2-5 jaar',
    opleiding: 'HBO',
    salaris: '€3.500 - €4.500 bruto per maand',
    opKantoor: 'Hybride (2 dagen)',
    maxReistijd: '60 minuten',
    contractType: 'Vast',
    deadline: '2026-04-30',
    omschrijving: 'Wij zoeken een creatieve Brand Strategist die onze merkpositionering naar het volgende niveau tilt. Je werkt nauw samen met het marketingteam en het management aan de merkstrategie.',
    taken: [
      'Ontwikkelen en bewaken van de merkstrategie en brand guidelines',
      'Uitvoeren van markt- en concurrentieanalyses',
      'Adviseren over positionering en communicatie aan het management',
      'Samenwerken met creative teams aan campagnes en content',
      'Monitoren van merkperceptie en merkwaarde via onderzoek',
    ],
    watBiedenWij: [
      '€3.500 - €4.500 bruto per maand',
      'Vast contract',
      'Hybride werken (2 dagen op kantoor)',
      'Locatie: Utrecht',
      '25 vakantiedagen',
      'Opleidingsbudget en pensioenregeling',
    ],
    afdelingscultuur: 'Een klein maar ambitieus team dat merkstrategie combineert met creativiteit. We waarderen eigenaarschap en out-of-the-box denken.',
  },
  'kv-3': {
    vacatureTitle: 'Data Engineer',
    locatie: 'Rotterdam',
    land: 'Nederland',
    vakgebied: 'ICT & Development',
    sector: 'IT & Data',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: null,
    mScoreDimensions: null,
    hardeCriteriaFit: 88,
    hardeCriteriaDetails: [
      { label: 'Opleidingsniveau (WO)', status: 'voldoet' },
      { label: 'Werkervaring (5-10 jaar)', status: 'voldoet' },
      { label: 'Locatie (Rotterdam)', status: 'bijna' },
      { label: 'Hybride werken (3 dagen)', status: 'voldoet' },
      { label: 'Max reistijd (45 min)', status: 'niet' },
    ],
    pipelineStap: 0,
    scoutNaam: 'Mark Jansen',
    datum: '2026-03-16',
    functieType: 'Fulltime',
    werkervaring: '5-10 jaar',
    opleiding: 'WO',
    salaris: '€5.000 - €7.000 bruto per maand',
    opKantoor: 'Hybride (3 dagen)',
    maxReistijd: '45 minuten',
    contractType: 'Vast',
    deadline: '2026-05-15',
    omschrijving: 'Als Data Engineer bouw je aan de data-infrastructuur die het fundament vormt voor onze data-gedreven besluitvorming. Je werkt met moderne cloud-technologieën en big data tools.',
    taken: [
      'Ontwerpen en bouwen van schaalbare data pipelines en ETL-processen',
      'Beheren en optimaliseren van de data warehouse architectuur',
      'Werken met cloud platforms (AWS/Azure/GCP) en big data technologieën',
      'Samenwerken met Data Scientists en Analysts aan data modellen',
      'Waarborgen van datakwaliteit, governance en security',
      'Documenteren van data architectuur en processen',
    ],
    watBiedenWij: [
      '€5.000 - €7.000 bruto per maand',
      'Vast contract',
      'Hybride werken (3 dagen op kantoor)',
      'Locatie: Rotterdam',
      '27 vakantiedagen + opleidingsbudget',
      'Pensioenregeling en thuiswerkvergoeding',
    ],
    afdelingscultuur: 'Een data-team van 12 engineers en scientists in een tech-forward organisatie. We werken met cutting-edge tools en geven veel autonomie.',
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

function HardeCriteriaFitBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-green-400' : score >= 75 ? 'text-orange' : 'text-red-500'
  const bg = score >= 90 ? 'bg-green-400/10 border-green-400/20' : score >= 75 ? 'bg-orange/10 border-orange/20' : 'bg-red-50 border-red-200'
  const icon = score >= 90 ? '✓' : '⚠'
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${bg}`}>
      <span className={`font-bold ${color}`}>{icon}</span>
      <span className={`text-lg font-bold ${color}`}>{score}%</span>
      <span className="text-xs text-ink-muted ml-1">Harde Criteria</span>
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
          <div className="flex items-center gap-3">
            {vac.hardeCriteriaFit !== null && (
              <HardeCriteriaFitBadge score={vac.hardeCriteriaFit} />
            )}
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
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="text-xs bg-cyan/10 text-cyan px-3 py-1 rounded-full font-medium">{vac.vakgebied}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.locatie}, {vac.land}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.functieType}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.werkervaring} ervaring</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.opleiding}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-3 py-1 rounded-full">{vac.contractType}</span>
        </div>
      </div>

      {/* Vacancy details — key info grid */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-4">Vacature details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-ink-muted mb-1">Salaris</div>
            <div className="text-sm text-ink font-medium">{vac.salaris}</div>
          </div>
          <div>
            <div className="text-xs text-ink-muted mb-1">Contracttype</div>
            <div className="text-sm text-ink font-medium">{vac.contractType}</div>
          </div>
          <div>
            <div className="text-xs text-ink-muted mb-1">Op kantoor</div>
            <div className="text-sm text-ink font-medium">{vac.opKantoor}</div>
          </div>
          <div>
            <div className="text-xs text-ink-muted mb-1">Locatie</div>
            <div className="text-sm text-ink font-medium">{vac.locatie}, {vac.land}</div>
          </div>
          <div>
            <div className="text-xs text-ink-muted mb-1">Max reistijd</div>
            <div className="text-sm text-ink font-medium">{vac.maxReistijd}</div>
          </div>
          <div>
            <div className="text-xs text-ink-muted mb-1">Deadline</div>
            <div className="text-sm text-ink font-medium">{new Date(vac.deadline).toLocaleDateString('nl-NL')}</div>
          </div>
        </div>
      </div>

      {/* Omschrijving */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-3">Over de functie</h2>
        <p className="text-sm text-ink-light leading-relaxed">{vac.omschrijving}</p>
      </div>

      {/* Taken */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-3">Wat ga je doen?</h2>
        <ul className="space-y-2">
          {vac.taken.map((taak, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-light">
              <span className="text-purple mt-0.5">•</span>
              <span>{taak}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Wat bieden wij */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-3">Wat bieden wij?</h2>
        <ul className="space-y-2">
          {vac.watBiedenWij.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-light">
              <span className="text-cyan mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Afdelingscultuur */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-3">Over het team</h2>
        <p className="text-sm text-ink-light leading-relaxed">{vac.afdelingscultuur}</p>
      </div>

      {/* Harde Criteria Fit */}
      {vac.hardeCriteriaDetails && (
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink">Jouw fit op harde criteria</h2>
            {vac.hardeCriteriaFit !== null && (
              <HardeCriteriaFitBadge score={vac.hardeCriteriaFit} />
            )}
          </div>
          <div className="space-y-2.5">
            {vac.hardeCriteriaDetails.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-sm ${
                  item.status === 'voldoet' ? 'text-green-400' :
                  item.status === 'bijna' ? 'text-orange' :
                  'text-red-400'
                }`}>
                  {item.status === 'voldoet' ? '✓' : item.status === 'bijna' ? '⚠' : '✕'}
                </span>
                <span className="text-sm text-ink-light flex-1">{item.label}</span>
                <span className={`text-xs font-medium ${
                  item.status === 'voldoet' ? 'text-green-400' :
                  item.status === 'bijna' ? 'text-orange' :
                  'text-red-400'
                }`}>
                  {item.status === 'voldoet' ? 'Voldoet' : item.status === 'bijna' ? 'Bijna' : 'Voldoet niet'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
