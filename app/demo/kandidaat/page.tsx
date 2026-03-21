'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── 7-step pipeline (kandidaat perspectief) ────────────────────────────────

const pipelineSteps = [
  { key: 'voorgesteld', label: 'Voorgesteld' },
  { key: 'interesse', label: 'Interesse' },
  { key: 'scan', label: 'Scan' },
  { key: 'voorgedragen', label: 'Voorgedragen' },
  { key: 'gesprek', label: 'Gesprek' },
  { key: 'voorwaarden', label: 'Voorwaarden' },
  { key: 'contract', label: 'Contract' },
]

// ─── Types ──────────────────────────────────────────────────────────────────

type VacatureStatus = 'nieuw' | 'interesse' | 'scan_nodig' | 'scan_aanvullen' | 'scan_compleet' | 'voorgedragen' | 'gesprek' | 'voorwaarden' | 'contract' | 'afgewezen' | 'verlopen' | 'geweigerd'

interface KandidaatVacature {
  id: string
  vacatureTitle: string
  bedrijf: string
  bedrijfAnoniem: boolean
  mScore: number | null
  mScoreIndicatief: boolean
  hardeCriteriaFit: number
  pipelineStap: number // 0-6 index in pipelineSteps
  scoutNaam: string
  datum: string
  vakgebied: string
  locatie: string
  land: string
  salaris: string
  opleiding: string
  status: VacatureStatus
  dualStatus?: { opdrachtgever: boolean; kandidaat: boolean }
  dualStatusLabel?: string
  verloopdatum?: string // when the proposal expires
}

// ─── Mock data ──────────────────────────────────────────────────────────────

const mockVacatures: KandidaatVacature[] = [
  // === NIEUW (inbox) ===
  {
    id: 'kv-4',
    vacatureTitle: 'Product Owner',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: 79,
    mScoreIndicatief: true,
    hardeCriteriaFit: 95,
    pipelineStap: 0,
    scoutNaam: 'Mark Jansen',
    datum: '2026-03-19',
    vakgebied: 'ICT & Development',
    locatie: 'Amsterdam',
    land: 'Nederland',
    salaris: '€7.200 - €10.800',
    opleiding: 'WO',
    status: 'nieuw',
    verloopdatum: '2026-03-24',
  },
  {
    id: 'kv-5',
    vacatureTitle: 'HR Business Partner',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: 74,
    mScoreIndicatief: true,
    hardeCriteriaFit: 88,
    pipelineStap: 0,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-20',
    vakgebied: 'HR & Recruitment',
    locatie: 'Den Haag',
    land: 'Nederland',
    salaris: '€5.400 - €7.200',
    opleiding: 'HBO+',
    status: 'nieuw',
    verloopdatum: '2026-03-25',
  },
  // === ACTIEF ===
  {
    id: 'kv-1',
    vacatureTitle: 'Marketing Manager',
    bedrijf: 'TechVentures B.V.',
    bedrijfAnoniem: false,
    mScore: 87,
    mScoreIndicatief: false,
    hardeCriteriaFit: 100,
    pipelineStap: 4,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-01',
    vakgebied: 'Marketing & E-commerce',
    locatie: 'Amsterdam',
    land: 'Nederland',
    salaris: '€10.800',
    opleiding: 'WO',
    status: 'gesprek',
    dualStatus: { opdrachtgever: true, kandidaat: true },
    dualStatusLabel: 'Gesprek gepland op 25 maart',
  },
  {
    id: 'kv-2',
    vacatureTitle: 'Brand Strategist',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: 71,
    mScoreIndicatief: false,
    hardeCriteriaFit: 92,
    pipelineStap: 3,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-03-12',
    vakgebied: 'Marketing & E-commerce',
    locatie: 'Utrecht',
    land: 'Nederland',
    salaris: '€7.200',
    opleiding: 'HBO',
    status: 'voorgedragen',
    dualStatus: { opdrachtgever: false, kandidaat: false },
    dualStatusLabel: 'Wacht op review opdrachtgever',
  },
  {
    id: 'kv-3',
    vacatureTitle: 'Data Engineer',
    bedrijf: 'Anoniem',
    bedrijfAnoniem: true,
    mScore: 76,
    mScoreIndicatief: true,
    hardeCriteriaFit: 89,
    pipelineStap: 1,
    scoutNaam: 'Mark Jansen',
    datum: '2026-03-16',
    vakgebied: 'ICT & Development',
    locatie: 'Rotterdam',
    land: 'Nederland',
    salaris: '€7.200',
    opleiding: 'HBO+',
    status: 'scan_aanvullen',
  },
  // === AFGEROND ===
  {
    id: 'kv-6',
    vacatureTitle: 'Digital Marketing Lead',
    bedrijf: 'BrandHouse B.V.',
    bedrijfAnoniem: false,
    mScore: 62,
    mScoreIndicatief: false,
    hardeCriteriaFit: 85,
    pipelineStap: 4,
    scoutNaam: 'Sophie de Graaf',
    datum: '2026-02-10',
    vakgebied: 'Marketing & E-commerce',
    locatie: 'Amsterdam',
    land: 'Nederland',
    salaris: '€7.200',
    opleiding: 'HBO',
    status: 'afgewezen',
  },
]

const mockScouts = [
  { naam: 'Sophie de Graaf', rating: 4.9, plaatsingen: 3, sinds: '2026-01-15' },
  { naam: 'Mark Jansen', rating: 4.1, plaatsingen: 1, sinds: '2026-03-10' },
]

const afwijzingsRedenen = [
  'Salaris niet aantrekkelijk',
  'Locatie niet haalbaar',
  'Functie past niet bij mijn ambitie',
  'Sector spreekt mij niet aan',
  'Ik ben al in gesprek voor een vergelijkbare rol',
  'Anders',
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function MScoreCircle({ score, indicatief }: { score: number; indicatief?: boolean }) {
  const color = score >= 75 ? 'from-cyan to-cyan-light border-cyan/40' :
    score >= 50 ? 'from-purple to-purple-light border-purple/40' :
    'from-orange to-orange-light border-orange/40'
  return (
    <div className="relative">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white text-sm border-2`}>
        {score}%
      </div>
      {indicatief && (
        <span className="absolute -bottom-1 -right-1 text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded font-medium">~</span>
      )}
    </div>
  )
}

function DualStatusBadge({ opdrachtgever, kandidaat }: { opdrachtgever: boolean; kandidaat: boolean }) {
  if (opdrachtgever && kandidaat) return <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">✓✓</span>
  if (opdrachtgever && !kandidaat) return <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">✓?</span>
  if (!opdrachtgever && kandidaat) return <span className="text-[10px] bg-orange/15 text-orange px-1.5 py-0.5 rounded font-medium">?✓</span>
  return <span className="text-[10px] bg-gray-100 text-ink-muted px-1.5 py-0.5 rounded font-medium">??</span>
}

function PipelineBar({ step, status }: { step: number; status: VacatureStatus }) {
  const isAfgewezen = status === 'afgewezen'
  return (
    <div>
      <div className="flex items-center gap-0.5">
        {pipelineSteps.map((s, i) => {
          const isDone = i < step
          const isActive = i === step
          return (
            <div key={s.key} className={`flex-1 h-1.5 rounded-full ${
              isAfgewezen ? (i <= step ? 'bg-red-400' : 'bg-surface-muted') :
              isDone ? 'bg-cyan' :
              isActive ? 'bg-purple' :
              'bg-surface-muted'
            }`} />
          )
        })}
      </div>
      <div className="flex justify-between mt-1">
        {pipelineSteps.map((s, i) => {
          const isActive = i === step
          return (
            <span key={s.key} className={`text-[8px] flex-1 ${
              isAfgewezen && i === step ? 'text-red-500 font-semibold' :
              isActive ? 'text-purple font-semibold' : 'text-ink-muted'
            }`}>
              {i < step ? '✓' : ''} {s.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function dagenGeleden(datum: string) {
  const diff = Math.floor((new Date('2026-03-21').getTime() - new Date(datum).getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'vandaag'
  if (diff === 1) return '1 dag geleden'
  return `${diff} dagen geleden`
}

function dagenTot(datum: string) {
  const diff = Math.floor((new Date(datum).getTime() - new Date('2026-03-21').getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'vandaag'
  if (diff === 1) return 'nog 1 dag'
  return `nog ${diff} dagen`
}

// ─── Component ──────────────────────────────────────────────────────────────

type Tab = 'nieuw' | 'actief' | 'afgerond' | 'scouts'

export default function KandidaatDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('nieuw')
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectNote, setRejectNote] = useState('')
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [rejected, setRejected] = useState<Set<string>>(new Set())

  const nieuweVacatures = mockVacatures.filter(v => v.status === 'nieuw' && !accepted.has(v.id) && !rejected.has(v.id))
  const actieveVacatures = mockVacatures.filter(v =>
    ['interesse', 'scan_nodig', 'scan_aanvullen', 'scan_compleet', 'voorgedragen', 'gesprek', 'voorwaarden', 'contract'].includes(v.status)
    || accepted.has(v.id)
  )
  const afgerondeVacatures = mockVacatures.filter(v =>
    ['afgewezen', 'verlopen', 'geweigerd'].includes(v.status) || rejected.has(v.id)
  )

  const tabs: { key: Tab; label: string; count: number; icon: string }[] = [
    { key: 'nieuw', label: 'Nieuw', count: nieuweVacatures.length, icon: '🆕' },
    { key: 'actief', label: 'Actief', count: actieveVacatures.length, icon: '📋' },
    { key: 'afgerond', label: 'Afgerond', count: afgerondeVacatures.length, icon: '✅' },
    { key: 'scouts', label: 'Scouts', count: mockScouts.length, icon: '👥' },
  ]

  const handleAccept = (id: string) => {
    setAccepted(prev => new Set(prev).add(id))
  }

  const handleReject = (id: string) => {
    setRejectingId(id)
  }

  const confirmReject = () => {
    if (rejectingId) {
      setRejected(prev => new Set(prev).add(rejectingId))
      setRejectingId(null)
      setRejectReason('')
      setRejectNote('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Welkom, Anna</h1>
        <p className="text-ink-light mt-1">Bekijk voorgestelde vacatures, volg je processen en beheer je scouts.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              activeTab === t.key
                ? 'border-purple bg-purple/5 shadow-sm'
                : 'border-surface-border bg-white hover:border-purple/25'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{t.icon}</span>
              <span className="text-xs text-ink-muted">{t.label}</span>
            </div>
            <p className={`text-2xl font-bold ${
              activeTab === t.key ? 'text-purple' : 'text-ink'
            }`}>{t.count}</p>
            {t.key === 'nieuw' && t.count > 0 && (
              <p className="text-[10px] text-orange font-medium mt-0.5">Actie vereist</p>
            )}
          </button>
        ))}
      </div>

      {/* ═══ TAB: NIEUW ═══ */}
      {activeTab === 'nieuw' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Nieuwe voorstellen</h2>
            <p className="text-xs text-ink-muted">Je hebt 5 dagen om te reageren</p>
          </div>

          {nieuweVacatures.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
              <span className="text-4xl">📭</span>
              <p className="text-ink-light mt-3">Geen nieuwe voorstellen</p>
              <p className="text-ink-muted text-sm mt-1">Je Talent Scouts zoeken passende vacatures voor je.</p>
            </div>
          ) : (
            nieuweVacatures.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border-2 border-purple/20 p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-purple/10 text-purple px-2 py-0.5 rounded-full font-medium">Nieuw</span>
                      <span className="text-[10px] text-ink-muted">{dagenGeleden(v.datum)}</span>
                      {v.verloopdatum && (
                        <span className="text-[10px] text-orange font-medium">· Verloopt {dagenTot(v.verloopdatum)}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-ink">{v.vacatureTitle}</h3>
                    <p className="text-ink-light text-sm">
                      <span className="text-ink-muted italic">Anoniem bedrijf</span>
                      <span className="mx-2 text-ink-muted">·</span>
                      {v.locatie}, {v.land}
                      <span className="mx-2 text-ink-muted">·</span>
                      <span className="text-cyan">{v.vakgebied}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {v.mScore !== null ? (
                      <MScoreCircle score={v.mScore} indicatief={v.mScoreIndicatief} />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange/15 border-2 border-orange/30 flex items-center justify-center text-orange text-lg font-bold">
                        ?
                      </div>
                    )}
                  </div>
                </div>

                {/* Details row */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="bg-surface-muted px-2.5 py-1 rounded-lg text-ink-light">💰 {v.salaris}</span>
                  <span className="bg-surface-muted px-2.5 py-1 rounded-lg text-ink-light">📋 {v.opleiding}</span>
                  <span className="bg-surface-muted px-2.5 py-1 rounded-lg text-ink-light">📍 {v.locatie}</span>
                  <span className={`px-2.5 py-1 rounded-lg font-medium ${
                    v.hardeCriteriaFit >= 90 ? 'bg-green-100 text-green-700' :
                    v.hardeCriteriaFit >= 75 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Harde criteria: {v.hardeCriteriaFit}%
                  </span>
                  {v.mScore !== null && (
                    <span className={`px-2.5 py-1 rounded-lg font-medium ${
                      v.mScore >= 75 ? 'bg-cyan/10 text-cyan' :
                      v.mScore >= 50 ? 'bg-purple/10 text-purple' :
                      'bg-orange/10 text-orange'
                    }`}>
                      M-Score: {v.mScore}%{v.mScoreIndicatief ? ' (indicatief)' : ''}
                    </span>
                  )}
                </div>

                {/* Scout info */}
                <div className="text-xs text-ink-muted">
                  Voorgedragen door <span className="text-ink-light font-medium">{v.scoutNaam}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
                  <Link
                    href={`/demo/kandidaat/vacature/${v.id}`}
                    className="text-xs text-cyan hover:underline font-medium"
                  >
                    Bekijk details →
                  </Link>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleReject(v.id)}
                    className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Geen interesse
                  </button>
                  <button
                    onClick={() => setActiveTab('actief')}
                    className="text-xs text-ink-muted hover:text-ink-light px-3 py-2"
                  >
                    Later bekijken
                  </button>
                  <button
                    onClick={() => handleAccept(v.id)}
                    className="px-6 py-2 text-sm bg-purple text-white rounded-xl hover:bg-purple/90 transition-colors font-medium"
                  >
                    ✓ Interesse
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ═══ TAB: ACTIEF ═══ */}
      {activeTab === 'actief' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink">Actieve processen</h2>

          {actieveVacatures.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
              <span className="text-4xl">📂</span>
              <p className="text-ink-light mt-3">Geen actieve processen</p>
              <p className="text-ink-muted text-sm mt-1">Toon interesse in een voorgestelde vacature om te beginnen.</p>
            </div>
          ) : (
            actieveVacatures.map(v => (
              <Link key={v.id} href={`/demo/kandidaat/vacature/${v.id}`}
                className="block bg-white rounded-2xl border border-surface-border p-6 hover:border-purple/25 transition-colors space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        v.status === 'scan_nodig' || v.status === 'scan_aanvullen' ? 'bg-orange/15 text-orange' :
                        v.status === 'voorgedragen' ? 'bg-blue-100 text-blue-700' :
                        v.status === 'gesprek' ? 'bg-cyan/10 text-cyan' :
                        v.status === 'voorwaarden' ? 'bg-purple/10 text-purple' :
                        v.status === 'contract' ? 'bg-green-100 text-green-700' :
                        accepted.has(v.id) ? 'bg-orange/15 text-orange' :
                        'bg-cyan/10 text-cyan'
                      }`}>
                        {accepted.has(v.id) ? 'Aanvullende vragen' :
                         v.status === 'scan_nodig' ? 'Scan invullen' :
                         v.status === 'scan_aanvullen' ? 'Aanvullende vragen' :
                         v.status === 'voorgedragen' ? 'Voorgedragen' :
                         v.status === 'gesprek' ? 'Gesprek' :
                         v.status === 'voorwaarden' ? 'Arbeidsvoorwaarden' :
                         v.status === 'contract' ? 'Contract' :
                         v.status === 'interesse' ? 'Interesse bevestigd' :
                         v.status}
                      </span>
                      {v.dualStatus && <DualStatusBadge opdrachtgever={v.dualStatus.opdrachtgever} kandidaat={v.dualStatus.kandidaat} />}
                    </div>
                    <h3 className="text-ink font-semibold">{v.vacatureTitle}</h3>
                    <p className="text-ink-light text-sm">
                      {v.bedrijfAnoniem ? (
                        <span className="text-ink-muted italic">Bedrijfsnaam zichtbaar na gespreksfase</span>
                      ) : (
                        <span className="text-purple">{v.bedrijf}</span>
                      )}
                      <span className="mx-2 text-ink-muted">·</span>
                      {v.locatie}
                      <span className="mx-2 text-ink-muted">·</span>
                      <span className="text-cyan">{v.vakgebied}</span>
                    </p>
                  </div>
                  {v.mScore !== null ? (
                    <MScoreCircle score={v.mScore} indicatief={v.mScoreIndicatief} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange/15 border-2 border-orange/30 flex items-center justify-center text-orange text-lg font-bold">
                      ?
                    </div>
                  )}
                </div>

                {/* Pipeline */}
                <PipelineBar step={accepted.has(v.id) ? 1 : v.pipelineStap} status={v.status} />

                {/* Status message */}
                {(v.status === 'scan_aanvullen' || accepted.has(v.id)) && (
                  <div className="bg-orange/10 rounded-xl p-3 flex items-center gap-2">
                    <span>🧪</span>
                    <p className="text-xs text-orange font-medium">Vul de aanvullende vragen in voor een definitieve M-Score</p>
                    <span className="ml-auto text-xs text-orange">→</span>
                  </div>
                )}
                {v.status === 'scan_nodig' && (
                  <div className="bg-orange/10 rounded-xl p-3 flex items-center gap-2">
                    <span>🧪</span>
                    <p className="text-xs text-orange font-medium">Vul de Matching Scan in om voorgedragen te worden</p>
                    <span className="ml-auto text-xs text-orange">→</span>
                  </div>
                )}
                {v.dualStatusLabel && (
                  <div className={`rounded-xl p-3 flex items-center gap-2 ${
                    v.dualStatus && !v.dualStatus.opdrachtgever && v.dualStatus.kandidaat
                      ? 'bg-orange/10' : 'bg-surface-muted'
                  }`}>
                    <span>{v.status === 'gesprek' ? '🤝' : v.status === 'voorgedragen' ? '⏳' : '💼'}</span>
                    <p className="text-xs text-ink-light">{v.dualStatusLabel}</p>
                  </div>
                )}
                {v.status === 'gesprek' && v.dualStatus && v.dualStatus.opdrachtgever && v.dualStatus.kandidaat && (
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-700 font-medium">Bevestig na je gesprek: is het gesprek doorgegaan?</p>
                  </div>
                )}

                {/* Meta */}
                <div className="text-xs text-ink-muted">
                  Via <span className="text-ink-light font-medium">{v.scoutNaam}</span>
                  <span className="mx-2">·</span>
                  {new Date(v.datum).toLocaleDateString('nl-NL')}
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* ═══ TAB: AFGEROND ═══ */}
      {activeTab === 'afgerond' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink">Afgeronde processen</h2>

          {afgerondeVacatures.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
              <span className="text-4xl">📁</span>
              <p className="text-ink-light mt-3">Geen afgeronde processen</p>
            </div>
          ) : (
            afgerondeVacatures.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-surface-border p-6 space-y-3 opacity-75">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        rejected.has(v.id) ? 'bg-gray-100 text-ink-muted' :
                        v.status === 'afgewezen' ? 'bg-red-100 text-red-700' :
                        v.status === 'verlopen' ? 'bg-gray-100 text-ink-muted' :
                        'bg-gray-100 text-ink-muted'
                      }`}>
                        {rejected.has(v.id) ? 'Geen interesse' :
                         v.status === 'afgewezen' ? 'Niet geselecteerd' :
                         v.status === 'verlopen' ? 'Verlopen' : v.status}
                      </span>
                    </div>
                    <h3 className="text-ink font-semibold">{v.vacatureTitle}</h3>
                    <p className="text-ink-light text-sm">
                      {v.bedrijfAnoniem ? 'Anoniem bedrijf' : v.bedrijf}
                      <span className="mx-2 text-ink-muted">·</span>
                      {v.locatie}
                      <span className="mx-2 text-ink-muted">·</span>
                      {v.vakgebied}
                    </p>
                  </div>
                  {v.mScore !== null && <MScoreCircle score={v.mScore} />}
                </div>
                {!rejected.has(v.id) && <PipelineBar step={v.pipelineStap} status={v.status} />}
                <div className="text-xs text-ink-muted">
                  Via {v.scoutNaam} · {new Date(v.datum).toLocaleDateString('nl-NL')}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ═══ TAB: SCOUTS ═══ */}
      {activeTab === 'scouts' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Mijn Talent Scouts</h2>
            <p className="text-ink-muted text-xs mt-1">
              Je kunt door meerdere scouts tegelijkertijd worden bemiddeld. Elke scout kan je onafhankelijk voordragen op vacatures.
            </p>
          </div>

          {mockScouts.map(s => (
            <div key={s.naam} className="bg-white rounded-2xl border border-surface-border p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-purple/10 flex items-center justify-center text-purple font-bold text-lg">
                {s.naam.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-ink font-semibold">{s.naam}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-ink-light">
                  <span>
                    <span className="text-yellow-500">{'★'.repeat(Math.round(s.rating))}</span>{' '}
                    {s.rating}
                  </span>
                  <span>{s.plaatsingen} plaatsing{s.plaatsingen !== 1 ? 'en' : ''}</span>
                  <span>Sinds {new Date(s.sinds).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-muted">Vacatures voorgesteld</p>
                <p className="text-lg font-bold text-ink">
                  {mockVacatures.filter(v => v.scoutNaam === s.naam).length}
                </p>
              </div>
            </div>
          ))}

          {/* Legend dual status */}
          <div className="bg-surface-muted rounded-2xl p-5 space-y-2">
            <p className="text-xs font-semibold text-ink">Dual-status indicatoren</p>
            <p className="text-[11px] text-ink-light">Bij actieve processen zie je een status-indicator die aangeeft of zowel de opdrachtgever als jij de huidige stap hebben bevestigd:</p>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <DualStatusBadge opdrachtgever={true} kandidaat={true} />
                <span className="text-[10px] text-ink-light">Beide bevestigd</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DualStatusBadge opdrachtgever={true} kandidaat={false} />
                <span className="text-[10px] text-ink-light">Alleen opdrachtgever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DualStatusBadge opdrachtgever={false} kandidaat={true} />
                <span className="text-[10px] text-ink-light">Alleen jij — opdrachtgever loopt achter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DualStatusBadge opdrachtgever={false} kandidaat={false} />
                <span className="text-[10px] text-ink-light">Geen van beiden</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ REJECT MODAL ═══ */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-ink">Geen interesse</h3>
            <p className="text-sm text-ink-light">
              Laat je scout weten waarom deze vacature niet past. Dit helpt bij toekomstige voorstellen.
            </p>

            <div>
              <label className="text-xs font-medium text-ink-light block mb-1.5">Reden</label>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full border border-surface-border rounded-xl px-3 py-2.5 text-sm text-ink"
              >
                <option value="">Selecteer een reden...</option>
                {afwijzingsRedenen.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {rejectReason === 'Anders' && (
              <div>
                <label className="text-xs font-medium text-ink-light block mb-1.5">Toelichting</label>
                <textarea
                  value={rejectNote}
                  onChange={e => setRejectNote(e.target.value)}
                  rows={3}
                  className="w-full border border-surface-border rounded-xl px-3 py-2.5 text-sm text-ink resize-none"
                  placeholder="Vertel kort waarom..."
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setRejectingId(null); setRejectReason(''); setRejectNote('') }}
                className="flex-1 py-2.5 border border-surface-border rounded-xl text-sm text-ink-light hover:bg-surface-muted transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bevestig afwijzing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
