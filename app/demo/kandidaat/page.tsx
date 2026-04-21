'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    welcomeTitle: 'Welkom, Anna',
    welcomeSub: 'Bekijk voorgestelde vacatures, volg je processen en beheer je scouts.',
    tabNew: 'Nieuw',
    tabActive: 'Actief',
    tabCompleted: 'Afgerond',
    tabScouts: 'Scouts',
    actionRequired: 'Actie vereist',
    // 2FA Banner
    twoFATitle: 'Beveilig je account met tweestapsverificatie (2FA)',
    twoFASub: 'Dit beschermt je account tegen onbevoegde toegang.',
    twoFAActivate: 'Nu activeren',
    twoFAClose: 'Sluiten',
    // Tab: Nieuw
    newProposals: 'Nieuwe voorstellen',
    respond5Days: 'Je hebt 5 dagen om te reageren',
    noNewProposals: 'Geen nieuwe voorstellen',
    scoutsSearching: 'Je Talent Scouts zoeken passende vacatures voor je.',
    newBadge: 'Nieuw',
    expiresIn: 'Verloopt',
    anonymousCompany: 'Anoniem bedrijf',
    nominatedBy: 'Voorgedragen door',
    viewDetails: 'Bekijk details →',
    noInterest: 'Geen interesse',
    interested: '✓ Interesse',
    hardCriteria: 'Harde criteria',
    indicative: '(indicatief)',
    // Tab: Actief
    activeProcesses: 'Actieve processen',
    confirmFaster: 'Sneller duidelijkheid door te bevestigen',
    confirmFasterDesc: 'Bevestig elke stap (gesprek gepland, afgerond, etc.) zodra deze heeft plaatsgevonden. Het systeem stuurt dan automatisch een herinnering naar de opdrachtgever om ook te bevestigen en een beslissing te nemen. Zo krijg jij sneller duidelijkheid over je sollicitatie.',
    noActiveProcesses: 'Geen actieve processen',
    showInterestFirst: 'Toon interesse in een voorgestelde vacature om te beginnen.',
    companyVisibleAfterInterview: 'Bedrijfsnaam zichtbaar na gespreksfase',
    statusAdditionalQuestions: 'Aanvullende vragen',
    statusFillScan: 'Scan invullen',
    statusNominated: 'Voorgedragen',
    statusInterview: 'Gesprek',
    statusConditions: 'Arbeidsvoorwaarden',
    statusContract: 'Contract',
    statusInterestConfirmed: 'Interesse bevestigd',
    fillAdditionalQuestions: 'Vul de aanvullende vragen in voor een definitieve M-Score',
    fillMatchingScan: 'Vul de Matching Scan in om voorgedragen te worden',
    confirmAfterInterview: 'Bevestig na je gesprek: is het gesprek doorgegaan?',
    confirmAfterInterviewDesc: 'Jouw bevestiging zorgt ervoor dat de opdrachtgever wordt gestimuleerd om sneller een beslissing te nemen.',
    via: 'Via',
    // Tab: Afgerond
    completedProcesses: 'Afgeronde processen',
    noCompletedProcesses: 'Geen afgeronde processen',
    statusNoInterest: 'Geen interesse',
    statusNotSelected: 'Niet geselecteerd',
    statusExpired: 'Verlopen',
    // Tab: Scouts
    myScouts: 'Mijn Talent Scouts',
    scoutsSub: 'Je kunt door meerdere scouts tegelijkertijd worden bemiddeld. Elke scout kan je onafhankelijk voordragen op vacatures.',
    placements: 'plaatsing',
    placementsPlural: 'plaatsingen',
    since: 'Sinds',
    vacanciesProposed: 'Vacatures voorgesteld',
    whyConfirm: 'Waarom bevestigen?',
    whyConfirmDesc: 'Wanneer jij een stap bevestigt (bijv. "gesprek heeft plaatsgevonden"), stuurt het systeem automatisch een herinnering naar de opdrachtgever om ook te bevestigen en een beslissing te nemen. Zo krijg je sneller duidelijkheid over je sollicitatie.',
    bothConfirmed: 'Beide bevestigd — proces gaat door',
    employerWaiting: 'Opdrachtgever wacht op jouw bevestiging',
    youConfirmed: 'Jij hebt bevestigd — opdrachtgever krijgt herinnering',
    noneConfirmed: 'Nog niemand heeft bevestigd',
    // Reject modal
    noInterestTitle: 'Geen interesse',
    noInterestDesc: 'Laat je scout weten waarom deze vacature niet past. Dit helpt bij toekomstige voorstellen.',
    reason: 'Reden',
    selectReason: 'Selecteer een reden...',
    explanation: 'Toelichting',
    explainBriefly: 'Vertel kort waarom...',
    cancel: 'Annuleren',
    confirmRejection: 'Bevestig afwijzing',
  },
  en: {
    welcomeTitle: 'Welcome, Anna',
    welcomeSub: 'Review proposed vacancies, track your processes and manage your scouts.',
    tabNew: 'New',
    tabActive: 'Active',
    tabCompleted: 'Completed',
    tabScouts: 'Scouts',
    actionRequired: 'Action required',
    // 2FA Banner
    twoFATitle: 'Secure your account with two-factor authentication (2FA)',
    twoFASub: 'This protects your account against unauthorized access.',
    twoFAActivate: 'Activate now',
    twoFAClose: 'Close',
    // Tab: New
    newProposals: 'New proposals',
    respond5Days: 'You have 5 days to respond',
    noNewProposals: 'No new proposals',
    scoutsSearching: 'Your Talent Scouts are searching for suitable vacancies for you.',
    newBadge: 'New',
    expiresIn: 'Expires',
    anonymousCompany: 'Anonymous company',
    nominatedBy: 'Proposed by',
    viewDetails: 'View details →',
    noInterest: 'Not interested',
    interested: '✓ Interested',
    hardCriteria: 'Hard criteria',
    indicative: '(indicative)',
    // Tab: Active
    activeProcesses: 'Active processes',
    confirmFaster: 'Get clarity faster by confirming',
    confirmFasterDesc: 'Confirm each step (interview scheduled, completed, etc.) as soon as it happens. The system will then automatically remind the employer to also confirm and make a decision. This way you get clarity about your application faster.',
    noActiveProcesses: 'No active processes',
    showInterestFirst: 'Show interest in a proposed vacancy to get started.',
    companyVisibleAfterInterview: 'Company name visible after interview stage',
    statusAdditionalQuestions: 'Additional questions',
    statusFillScan: 'Complete scan',
    statusNominated: 'Nominated',
    statusInterview: 'Interview',
    statusConditions: 'Employment terms',
    statusContract: 'Contract',
    statusInterestConfirmed: 'Interest confirmed',
    fillAdditionalQuestions: 'Complete the additional questions for a definitive M-Score',
    fillMatchingScan: 'Complete the Matching Scan to be nominated',
    confirmAfterInterview: 'Confirm after your interview: did the interview take place?',
    confirmAfterInterviewDesc: 'Your confirmation encourages the employer to make a decision faster.',
    via: 'Via',
    // Tab: Completed
    completedProcesses: 'Completed processes',
    noCompletedProcesses: 'No completed processes',
    statusNoInterest: 'Not interested',
    statusNotSelected: 'Not selected',
    statusExpired: 'Expired',
    // Tab: Scouts
    myScouts: 'My Talent Scouts',
    scoutsSub: 'You can be mediated by multiple scouts simultaneously. Each scout can independently nominate you for vacancies.',
    placements: 'placement',
    placementsPlural: 'placements',
    since: 'Since',
    vacanciesProposed: 'Vacancies proposed',
    whyConfirm: 'Why confirm?',
    whyConfirmDesc: 'When you confirm a step (e.g. "interview took place"), the system automatically reminds the employer to also confirm and make a decision. This way you get clarity about your application faster.',
    bothConfirmed: 'Both confirmed — process continues',
    employerWaiting: 'Employer waiting for your confirmation',
    youConfirmed: 'You have confirmed — employer gets reminder',
    noneConfirmed: 'No one has confirmed yet',
    // Reject modal
    noInterestTitle: 'Not interested',
    noInterestDesc: 'Let your scout know why this vacancy does not fit. This helps with future proposals.',
    reason: 'Reason',
    selectReason: 'Select a reason...',
    explanation: 'Explanation',
    explainBriefly: 'Briefly explain why...',
    cancel: 'Cancel',
    confirmRejection: 'Confirm rejection',
  },
}

// ─── 7-step pipeline (kandidaat perspectief) ────────────────────────────────

const pipelineStepsNl = [
  { key: 'voorgesteld', label: 'Voorgesteld' },
  { key: 'interesse', label: 'Interesse' },
  { key: 'scan', label: 'Scan' },
  { key: 'voorgedragen', label: 'Voorgedragen' },
  { key: 'gesprek', label: 'Gesprek' },
  { key: 'voorwaarden', label: 'Voorwaarden' },
  { key: 'contract', label: 'Contract' },
]

const pipelineStepsEn = [
  { key: 'voorgesteld', label: 'Proposed' },
  { key: 'interesse', label: 'Interested' },
  { key: 'scan', label: 'Scan' },
  { key: 'voorgedragen', label: 'Nominated' },
  { key: 'gesprek', label: 'Interview' },
  { key: 'voorwaarden', label: 'Conditions' },
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

const afwijzingsRedenenNl = [
  'Salaris niet aantrekkelijk',
  'Locatie niet haalbaar',
  'Functie past niet bij mijn ambitie',
  'Sector spreekt mij niet aan',
  'Ik ben al in gesprek voor een vergelijkbare rol',
  'Anders',
]

const afwijzingsRedenenEn = [
  'Salary not attractive',
  'Location not feasible',
  'Role does not match my ambition',
  'Sector does not appeal to me',
  'I am already in talks for a similar role',
  'Other',
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

function PipelineBar({ step, status, pipelineSteps }: { step: number; status: VacatureStatus; pipelineSteps: { key: string; label: string }[] }) {
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
            <span key={s.key} className={`text-[10px] flex-1 ${
              isAfgewezen && i === step ? 'text-red-500 font-semibold' :
              isActive ? 'text-purple font-semibold' : 'text-ink-light'
            }`}>
              {i < step ? '✓' : ''} {s.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function dagenGeleden(datum: string, lang: 'nl' | 'en') {
  const diff = Math.floor((new Date('2026-03-21').getTime() - new Date(datum).getTime()) / (1000 * 60 * 60 * 24))
  if (lang === 'en') {
    if (diff === 0) return 'today'
    if (diff === 1) return '1 day ago'
    return `${diff} days ago`
  }
  if (diff === 0) return 'vandaag'
  if (diff === 1) return '1 dag geleden'
  return `${diff} dagen geleden`
}

function dagenTot(datum: string, lang: 'nl' | 'en') {
  const diff = Math.floor((new Date(datum).getTime() - new Date('2026-03-21').getTime()) / (1000 * 60 * 60 * 24))
  if (lang === 'en') {
    if (diff <= 0) return 'today'
    if (diff === 1) return '1 day left'
    return `${diff} days left`
  }
  if (diff <= 0) return 'vandaag'
  if (diff === 1) return 'nog 1 dag'
  return `nog ${diff} dagen`
}

// ─── Component ──────────────────────────────────────────────────────────────

type Tab = 'nieuw' | 'actief' | 'afgerond' | 'scouts'

export default function KandidaatDashboard() {
  const { lang } = useLang()
  const t = texts[lang]
  const pipelineSteps = lang === 'en' ? pipelineStepsEn : pipelineStepsNl
  const afwijzingsRedenen = lang === 'en' ? afwijzingsRedenenEn : afwijzingsRedenenNl

  const [show2FABanner, setShow2FABanner] = useState(true)
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
    { key: 'nieuw', label: t.tabNew, count: nieuweVacatures.length, icon: '🆕' },
    { key: 'actief', label: t.tabActive, count: actieveVacatures.length, icon: '📋' },
    { key: 'afgerond', label: t.tabCompleted, count: afgerondeVacatures.length, icon: '✅' },
    { key: 'scouts', label: t.tabScouts, count: mockScouts.length, icon: '👥' },
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
      {/* 2FA Banner */}
      {show2FABanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p className="text-amber-800 font-semibold text-sm">{t.twoFATitle}</p>
              <p className="text-amber-700 text-xs mt-0.5">{t.twoFASub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/demo/kandidaat/instellingen" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors">
              {t.twoFAActivate}
            </Link>
            <button onClick={() => setShow2FABanner(false)} className="text-amber-400 hover:text-amber-600 transition-colors text-lg" title={t.twoFAClose}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.welcomeTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.welcomeSub}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              activeTab === tab.key
                ? 'border-purple bg-purple/5 shadow-sm'
                : 'border-surface-border bg-white hover:border-purple/25'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs text-ink-muted">{tab.label}</span>
            </div>
            <p className={`text-2xl font-bold ${
              activeTab === tab.key ? 'text-purple' : 'text-ink'
            }`}>{tab.count}</p>
            {tab.key === 'nieuw' && tab.count > 0 && (
              <p className="text-[10px] text-orange font-medium mt-0.5">{t.actionRequired}</p>
            )}
          </button>
        ))}
      </div>

      {/* ═══ TAB: NIEUW ═══ */}
      {activeTab === 'nieuw' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">{t.newProposals}</h2>
            <p className="text-xs text-ink-muted">{t.respond5Days}</p>
          </div>

          {nieuweVacatures.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
              <span className="text-4xl">📭</span>
              <p className="text-ink-light mt-3">{t.noNewProposals}</p>
              <p className="text-ink-muted text-sm mt-1">{t.scoutsSearching}</p>
            </div>
          ) : (
            nieuweVacatures.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border-2 border-purple/20 p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-purple/15 text-purple px-2.5 py-1 rounded-full font-semibold">{t.newBadge}</span>
                      <span className="text-xs text-ink-light">{dagenGeleden(v.datum, lang)}</span>
                      {v.verloopdatum && (
                        <span className="text-xs text-orange font-semibold">· {t.expiresIn} {dagenTot(v.verloopdatum, lang)}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-ink">{v.vacatureTitle}</h3>
                    <p className="text-sm text-ink mt-1">
                      <span className="text-ink-light italic">{t.anonymousCompany}</span>
                      <span className="mx-2 text-ink-muted">·</span>
                      <span className="font-medium">{v.locatie}, {v.land}</span>
                      <span className="mx-2 text-ink-muted">·</span>
                      <span className="text-purple font-medium">{v.vakgebied}</span>
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
                <div className="flex flex-wrap gap-2.5 text-sm">
                  <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-ink font-medium">💰 {v.salaris}</span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-ink font-medium">📋 {v.opleiding}</span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-ink font-medium">📍 {v.locatie}</span>
                  <span className={`px-3 py-1.5 rounded-lg font-semibold ${
                    v.hardeCriteriaFit >= 90 ? 'bg-green-100 text-green-800' :
                    v.hardeCriteriaFit >= 75 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t.hardCriteria}: {v.hardeCriteriaFit}%
                  </span>
                  {v.mScore !== null && (
                    <span className={`px-3 py-1.5 rounded-lg font-semibold ${
                      v.mScore >= 75 ? 'bg-cyan/15 text-cyan' :
                      v.mScore >= 50 ? 'bg-purple/15 text-purple' :
                      'bg-orange/15 text-orange'
                    }`}>
                      M-Score: {v.mScore}%{v.mScoreIndicatief ? ` ${t.indicative}` : ''}
                    </span>
                  )}
                </div>

                {/* Scout info */}
                <div className="text-sm text-ink-light">
                  {t.nominatedBy} <span className="text-ink font-semibold">{v.scoutNaam}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-surface-border">
                  <Link
                    href={`/demo/kandidaat/vacature/${v.id}`}
                    className="text-sm text-purple hover:underline font-semibold"
                  >
                    {t.viewDetails}
                  </Link>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleReject(v.id)}
                    className="px-4 py-2.5 text-sm border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
                  >
                    {t.noInterest}
                  </button>
                  <button
                    onClick={() => handleAccept(v.id)}
                    className="px-6 py-2.5 text-sm bg-purple text-white rounded-xl hover:bg-purple/90 transition-colors font-semibold shadow-sm"
                  >
                    {t.interested}
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
          <h2 className="text-lg font-semibold text-ink">{t.activeProcesses}</h2>

          {/* Incentive banner */}
          <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-semibold text-ink">{t.confirmFaster}</p>
              <p className="text-sm text-ink-light mt-0.5">{t.confirmFasterDesc}</p>
            </div>
          </div>

          {actieveVacatures.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
              <span className="text-4xl">📂</span>
              <p className="text-ink-light mt-3">{t.noActiveProcesses}</p>
              <p className="text-ink-muted text-sm mt-1">{t.showInterestFirst}</p>
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
                        {accepted.has(v.id) ? t.statusAdditionalQuestions :
                         v.status === 'scan_nodig' ? t.statusFillScan :
                         v.status === 'scan_aanvullen' ? t.statusAdditionalQuestions :
                         v.status === 'voorgedragen' ? t.statusNominated :
                         v.status === 'gesprek' ? t.statusInterview :
                         v.status === 'voorwaarden' ? t.statusConditions :
                         v.status === 'contract' ? t.statusContract :
                         v.status === 'interesse' ? t.statusInterestConfirmed :
                         v.status}
                      </span>
                      {v.dualStatus && <DualStatusBadge opdrachtgever={v.dualStatus.opdrachtgever} kandidaat={v.dualStatus.kandidaat} />}
                    </div>
                    <h3 className="text-lg font-bold text-ink">{v.vacatureTitle}</h3>
                    <p className="text-sm text-ink mt-1">
                      {v.bedrijfAnoniem ? (
                        <span className="text-ink-light italic">{t.companyVisibleAfterInterview}</span>
                      ) : (
                        <span className="text-purple font-medium">{v.bedrijf}</span>
                      )}
                      <span className="mx-2 text-ink-muted">·</span>
                      <span className="font-medium">{v.locatie}</span>
                      <span className="mx-2 text-ink-muted">·</span>
                      <span className="text-purple font-medium">{v.vakgebied}</span>
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
                <PipelineBar step={accepted.has(v.id) ? 1 : v.pipelineStap} status={v.status} pipelineSteps={pipelineSteps} />

                {/* Status message */}
                {(v.status === 'scan_aanvullen' || accepted.has(v.id)) && (
                  <div className="bg-orange/10 rounded-xl p-3 flex items-center gap-2">
                    <span>🧪</span>
                    <p className="text-sm text-orange font-medium">{t.fillAdditionalQuestions}</p>
                    <span className="ml-auto text-sm text-orange">→</span>
                  </div>
                )}
                {v.status === 'scan_nodig' && (
                  <div className="bg-orange/10 rounded-xl p-3 flex items-center gap-2">
                    <span>🧪</span>
                    <p className="text-sm text-orange font-medium">{t.fillMatchingScan}</p>
                    <span className="ml-auto text-sm text-orange">→</span>
                  </div>
                )}
                {v.dualStatusLabel && (
                  <div className={`rounded-xl p-3 flex items-center gap-2 ${
                    v.dualStatus && !v.dualStatus.opdrachtgever && v.dualStatus.kandidaat
                      ? 'bg-orange/10' : 'bg-surface-muted'
                  }`}>
                    <span>{v.status === 'gesprek' ? '🤝' : v.status === 'voorgedragen' ? '⏳' : '💼'}</span>
                    <p className="text-sm text-ink-light font-medium">{v.dualStatusLabel}</p>
                  </div>
                )}
                {v.status === 'gesprek' && v.dualStatus && v.dualStatus.opdrachtgever && v.dualStatus.kandidaat && (
                  <div className="bg-blue-50 rounded-xl p-3 space-y-1">
                    <p className="text-sm text-blue-700 font-semibold">{t.confirmAfterInterview}</p>
                    <p className="text-xs text-blue-600">{t.confirmAfterInterviewDesc}</p>
                  </div>
                )}

                {/* Meta */}
                <div className="text-sm text-ink-light">
                  {t.via} <span className="text-ink font-semibold">{v.scoutNaam}</span>
                  <span className="mx-2 text-ink-muted">·</span>
                  {new Date(v.datum).toLocaleDateString(lang === 'en' ? 'en-GB' : 'nl-NL')}
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* ═══ TAB: AFGEROND ═══ */}
      {activeTab === 'afgerond' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink">{t.completedProcesses}</h2>

          {afgerondeVacatures.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
              <span className="text-4xl">📁</span>
              <p className="text-ink-light mt-3">{t.noCompletedProcesses}</p>
            </div>
          ) : (
            afgerondeVacatures.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-surface-border p-6 space-y-3 opacity-80">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium ${
                        rejected.has(v.id) ? 'bg-gray-100 text-gray-600' :
                        v.status === 'afgewezen' ? 'bg-red-100 text-red-700' :
                        v.status === 'verlopen' ? 'bg-gray-100 text-gray-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {rejected.has(v.id) ? t.statusNoInterest :
                         v.status === 'afgewezen' ? t.statusNotSelected :
                         v.status === 'verlopen' ? t.statusExpired : v.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-ink">{v.vacatureTitle}</h3>
                    <p className="text-sm text-ink mt-1">
                      {v.bedrijfAnoniem ? <span className="text-ink-light italic">{t.anonymousCompany}</span> : <span className="font-medium">{v.bedrijf}</span>}
                      <span className="mx-2 text-ink-muted">·</span>
                      <span className="font-medium">{v.locatie}</span>
                      <span className="mx-2 text-ink-muted">·</span>
                      <span className="text-purple font-medium">{v.vakgebied}</span>
                    </p>
                  </div>
                  {v.mScore !== null && <MScoreCircle score={v.mScore} />}
                </div>
                {!rejected.has(v.id) && <PipelineBar step={v.pipelineStap} status={v.status} pipelineSteps={pipelineSteps} />}
                <div className="text-sm text-ink-light">
                  {t.via} <span className="font-semibold">{v.scoutNaam}</span> · {new Date(v.datum).toLocaleDateString(lang === 'en' ? 'en-GB' : 'nl-NL')}
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
            <h2 className="text-lg font-semibold text-ink">{t.myScouts}</h2>
            <p className="text-ink-muted text-xs mt-1">{t.scoutsSub}</p>
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
                  <span>{s.plaatsingen} {s.plaatsingen !== 1 ? t.placementsPlural : t.placements}</span>
                  <span>{t.since} {new Date(s.sinds).toLocaleDateString(lang === 'en' ? 'en-GB' : 'nl-NL', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-muted">{t.vacanciesProposed}</p>
                <p className="text-lg font-bold text-ink">
                  {mockVacatures.filter(v => v.scoutNaam === s.naam).length}
                </p>
              </div>
            </div>
          ))}

          {/* Legend dual status */}
          <div className="bg-surface-muted rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-ink">{t.whyConfirm}</p>
            <p className="text-sm text-ink-light">{t.whyConfirmDesc}</p>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <DualStatusBadge opdrachtgever={true} kandidaat={true} />
                <span className="text-xs text-ink-light">{t.bothConfirmed}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DualStatusBadge opdrachtgever={true} kandidaat={false} />
                <span className="text-xs text-ink-light">{t.employerWaiting}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DualStatusBadge opdrachtgever={false} kandidaat={true} />
                <span className="text-xs text-ink-light">{t.youConfirmed}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DualStatusBadge opdrachtgever={false} kandidaat={false} />
                <span className="text-xs text-ink-light">{t.noneConfirmed}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ REJECT MODAL ═══ */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-ink">{t.noInterestTitle}</h3>
            <p className="text-sm text-ink-light">{t.noInterestDesc}</p>

            <div>
              <label className="text-xs font-medium text-ink-light block mb-1.5">{t.reason}</label>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full border border-surface-border rounded-xl px-3 py-2.5 text-sm text-ink"
              >
                <option value="">{t.selectReason}</option>
                {afwijzingsRedenen.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {rejectReason === afwijzingsRedenen[afwijzingsRedenen.length - 1] && (
              <div>
                <label className="text-xs font-medium text-ink-light block mb-1.5">{t.explanation}</label>
                <textarea
                  value={rejectNote}
                  onChange={e => setRejectNote(e.target.value)}
                  rows={3}
                  className="w-full border border-surface-border rounded-xl px-3 py-2.5 text-sm text-ink resize-none"
                  placeholder={t.explainBriefly}
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setRejectingId(null); setRejectReason(''); setRejectNote('') }}
                className="flex-1 py-2.5 border border-surface-border rounded-xl text-sm text-ink-light hover:bg-surface-muted transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.confirmRejection}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
