'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculatePrice, formatPrice, ExperienceLevel, EducationLevel, EXPERIENCE_LABELS, EDUCATION_LABELS, COUNTRIES } from '@/lib/pricing'
import {
  werkzaamheden,
  werkzaamhedenRatingScale,
  type ScaleOption,
} from '@/lib/matching-scan'
import { VAKGEBIEDEN, LANDEN } from '@/lib/constants'

// ─── Role-specific task templates (simulates AI web search for similar vacancies) ───

const ROLE_TASK_TEMPLATES: Record<string, string[]> = {
  'marketing manager': [
    'Ontwikkelen en uitvoeren van de marketingstrategie, zowel online als offline',
    'Aansturen van het marketingteam en externe bureaus (SEO, SEA, social media)',
    'Analyseren van campagneresultaten, conversiedata en ROI; bijsturen waar nodig',
    'Beheren van het marketingbudget en rapporteren aan het managementteam',
    'Positioneren van het merk in de markt en ontwikkelen van content- en communicatieplannen',
    'Samenwerken met Sales en Product om go-to-market strategieën te ontwikkelen',
  ],
  'software developer': [
    'Ontwerpen, bouwen en onderhouden van schaalbare webapplicaties en API\'s',
    'Schrijven van kwalitatief hoogwaardige, testbare code volgens best practices',
    'Deelnemen aan code reviews, sprint planningen en technische architectuurdiscussies',
    'Samenwerken met UX/UI designers om intuïtieve gebruikerservaringen te realiseren',
    'Troubleshooten van bugs en performance-issues in productieomgevingen',
    'Bijdragen aan de technische roadmap en continu verbeteren van de development workflow',
  ],
  'senior software developer': [
    'Leiden van technische architectuurbeslissingen en het ontwerpen van complexe systemen',
    'Mentoren en coachen van junior en medior developers binnen het team',
    'Bouwen van schaalbare microservices, API\'s en cloud-native applicaties',
    'Uitvoeren van code reviews en waarborgen van codekwaliteit en security standaarden',
    'Samenwerken met Product Owners om technische haalbaarheid en prioritering te bepalen',
    'Evalueren en introduceren van nieuwe technologieën en frameworks',
  ],
  'financial controller': [
    'Opstellen van maand-, kwartaal- en jaarrapportages conform IFRS/Dutch GAAP',
    'Bewaken van budgetten, forecasts en cashflowprognoses',
    'Analyseren van financiële afwijkingen en adviseren van het management over verbetermaatregelen',
    'Coördineren van de jaarlijkse accountantscontrole en contact met externe auditors',
    'Doorontwikkelen van financiële processen, systemen en interne controles',
    'Opstellen van business cases en financiële modellen voor strategische beslissingen',
  ],
  'sales manager': [
    'Ontwikkelen en uitvoeren van de salesstrategie om omzetdoelstellingen te realiseren',
    'Aansturen, coachen en motiveren van het salesteam',
    'Opbouwen en onderhouden van relaties met key accounts en strategische partners',
    'Analyseren van verkoopdata, pipeline en conversieratio\'s; vertalen naar acties',
    'Identificeren van nieuwe marktmogelijkheden en het ontwikkelen van proposities',
    'Rapporteren aan de directie over salesresultaten, forecasts en marktontwikkelingen',
  ],
  'hr manager': [
    'Ontwikkelen en implementeren van HR-beleid op het gebied van werving, ontwikkeling en retentie',
    'Adviseren van het managementteam over organisatieontwikkeling en verandermanagement',
    'Begeleiden van het recruitment- en onboardingproces voor nieuwe medewerkers',
    'Opzetten van beoordelings- en ontwikkelcycli en talent management programma\'s',
    'Waarborgen van naleving van arbeidsrechtelijke wet- en regelgeving',
    'Beheren van arbeidsvoorwaarden, verzuim en salarisadministratie',
  ],
  'project manager': [
    'Plannen, coördineren en bewaken van projecten van initiatie tot oplevering',
    'Managen van scope, budget, planning en risico\'s binnen het projectportfolio',
    'Aansturen van multidisciplinaire projectteams en externe leveranciers',
    'Opstellen van projectplannen, voortgangsrapportages en stuurgroeppresentaties',
    'Signaleren van risico\'s en bottlenecks en proactief escaleren waar nodig',
    'Implementeren van verbeteringen in projectmethodieken (Agile, Prince2, Waterfall)',
  ],
  'data analyst': [
    'Verzamelen, opschonen en analyseren van grote datasets uit diverse bronnen',
    'Bouwen van dashboards en rapportages in tools als Power BI, Tableau of Looker',
    'Vertalen van data-inzichten naar concrete aanbevelingen voor stakeholders',
    'Ontwikkelen van KPI-frameworks en monitoren van business performance',
    'Uitvoeren van ad-hoc analyses, A/B-testen en statistische modellen',
    'Samenwerken met IT en Data Engineering aan datainfrastructuur en datakwaliteit',
  ],
  'accountmanager': [
    'Beheren en uitbouwen van een eigen klantenportefeuille',
    'Signaleren van commerciële kansen en vertalen naar concrete proposities',
    'Onderhouden van langdurige klantrelaties en fungeren als eerste aanspreekpunt',
    'Opstellen van offertes, onderhandelen over voorwaarden en sluiten van deals',
    'Samenwerken met interne teams (operations, product, marketing) om klantbehoeften te realiseren',
    'Bijhouden van CRM, rapporteren op KPI\'s en bijdragen aan de teamtargets',
  ],
  'product manager': [
    'Definiëren van de productstrategie en roadmap op basis van markt- en gebruikersonderzoek',
    'Vertalen van klantbehoeften naar user stories, features en acceptatiecriteria',
    'Prioriteren van de product backlog in samenwerking met engineering en design',
    'Analyseren van productmetrics, gebruikersdata en concurrentie om kansen te identificeren',
    'Coördineren van go-to-market lanceringen met marketing, sales en customer success',
    'Faciliteren van stakeholder alignment en communiceren van productupdates aan de organisatie',
  ],
}

const ROLE_REQUIREMENT_TEMPLATES: Record<string, string[]> = {
  'marketing manager': [
    'Aantoonbare ervaring met digitale marketing (SEO, SEA, social media, email marketing)',
    'Data-gedreven mindset; ervaring met Google Analytics, HubSpot of vergelijkbare tools',
    'Sterke communicatieve vaardigheden in woord en geschrift (NL en EN)',
  ],
  'software developer': [
    'Ervaring met moderne frameworks (React, Next.js, Node.js of vergelijkbaar)',
    'Kennis van databases (SQL en/of NoSQL), REST API\'s en CI/CD pipelines',
    'Teamspeler met goede communicatieve vaardigheden en oog voor kwaliteit',
  ],
  'senior software developer': [
    'Diepgaande kennis van software architectuur, design patterns en cloud platforms (AWS/Azure/GCP)',
    'Ervaring met het aansturen van technische projecten en mentoren van teamleden',
    'Sterke analytische vaardigheden en vermogen om complexe problemen op te lossen',
  ],
  'financial controller': [
    'RC/RA opleiding (of gevorderde studie) is een pré',
    'Ervaring met ERP-systemen (SAP, Exact, NetSuite) en advanced Excel',
    'Nauwkeurig, analytisch en in staat om financiële data te vertalen naar managementinformatie',
  ],
  'sales manager': [
    'Bewezen track record in het behalen en overtreffen van omzetdoelstellingen',
    'Ervaring met CRM-systemen (Salesforce, HubSpot) en data-gedreven salesprocessen',
    'Coachende leiderschapsstijl en vermogen om een team te inspireren en ontwikkelen',
  ],
  'hr manager': [
    'Kennis van Nederlands arbeidsrecht en relevante wet- en regelgeving',
    'Ervaring met HRIS-systemen en HR-analytics',
    'Uitstekende gespreksvaardigheden en vermogen om vertrouwen op te bouwen',
  ],
  'project manager': [
    'Certificering in projectmanagement (Prince2, PMP, Scrum Master) is een pré',
    'Ervaring met projectmanagementtools (Jira, Asana, MS Project)',
    'Resultaatgericht, stressbestendig en in staat om meerdere projecten tegelijk te managen',
  ],
  'data analyst': [
    'Ervaring met SQL, Python of R en visualisatietools (Power BI, Tableau)',
    'Kennis van statistische methoden en data modelling',
    'Vermogen om complexe analyses helder te presenteren aan niet-technische stakeholders',
  ],
  'accountmanager': [
    'Commercieel inzicht en ervaring met consultative selling',
    'Ervaring met CRM-systemen en het beheren van een salesfunnel',
    'Resultaatgericht, proactief en in staat om zelfstandig relaties te onderhouden',
  ],
  'product manager': [
    'Ervaring met Agile/Scrum methodieken en backlog management',
    'Data-gedreven aanpak; ervaring met productanalytics (Amplitude, Mixpanel, GA)',
    'Uitstekend vermogen om technische en commerciële belangen te verbinden',
  ],
}

function getRoleSpecificTasks(title: string): string[] {
  const normalized = title.toLowerCase().trim()
  // Direct match
  if (ROLE_TASK_TEMPLATES[normalized]) return ROLE_TASK_TEMPLATES[normalized]
  // Partial match — find the best matching template
  for (const [key, tasks] of Object.entries(ROLE_TASK_TEMPLATES)) {
    if (normalized.includes(key) || key.includes(normalized)) return tasks
  }
  // Fallback: generic but professional tasks
  return [
    `Verantwoordelijk voor het ontwikkelen en uitvoeren van de ${title.toLowerCase()} strategie`,
    `Samenwerken met interne teams en externe stakeholders om doelen te realiseren`,
    `Analyseren van resultaten, signaleren van trends en vertalen naar concrete verbeterplannen`,
    `Bijdragen aan innovatie en procesoptimalisatie binnen het team`,
    `Rapporteren over voortgang, KPI's en resultaten aan het managementteam`,
    `Opbouwen en onderhouden van relevante interne en externe relaties`,
  ]
}

function getRoleSpecificRequirements(title: string): string[] {
  const normalized = title.toLowerCase().trim()
  if (ROLE_REQUIREMENT_TEMPLATES[normalized]) return ROLE_REQUIREMENT_TEMPLATES[normalized]
  for (const [key, reqs] of Object.entries(ROLE_REQUIREMENT_TEMPLATES)) {
    if (normalized.includes(key) || key.includes(normalized)) return reqs
  }
  return [
    'Uitstekende communicatieve vaardigheden in woord en geschrift',
    'Proactieve houding, teamspeler en resultaatgericht',
    'Affiniteit met de sector en enthousiasme voor de rol',
  ]
}

type Step = 1 | 2 | 3 | 4 | 5 | 6
type WerkzaamhedenSubStep = 'ranking' | 'rating'

const STEPS = [
  { nr: 1, label: 'Functie', short: 'Titel' },
  { nr: 2, label: 'Details', short: 'Info' },
  { nr: 3, label: 'Harde criteria', short: 'Criteria' },
  { nr: 4, label: 'Omschrijving', short: 'Tekst' },
  { nr: 5, label: 'Controleer & publiceer', short: 'Publiceer' },
  { nr: 6, label: 'Werkzaamheden', short: 'M-Score' },
]

export default function VacatureAanmakenPage() {
  const [step, setStep] = useState<Step>(1)
  const [aiLoading, setAiLoading] = useState(false)
  const [akkoord, setAkkoord] = useState(false)
  const [published, setPublished] = useState(false)

  const [form, setForm] = useState({
    titel: '',
    afdeling: '',
    omschrijving: '',
    locatie: '',
    land: 'Nederland',
    vakgebied: '',
    salaris: '',
    salarisPeriode: 'maand' as 'maand' | 'jaar',
    taken: '',
    contractType: 'Vast',
    opKantoor: 'Hybride (3 dagen)',
    maxReistijd: '45 minuten',
    startdatum: '',
    afdelingscultuur: '',
    opleiding: '' as EducationLevel | '',
    ervaring: '' as ExperienceLevel | '',
    exclusief: false,
  })
  const [vakgebiedOpen, setVakgebiedOpen] = useState(false)
  const vakgebiedSuggestions = form.vakgebied.length > 0
    ? VAKGEBIEDEN.filter(v => v.toLowerCase().includes(form.vakgebied.toLowerCase()))
    : VAKGEBIEDEN

  // Werkzaamheden state (step 6)
  const [werkzaamhedenSubStep, setWerkzaamhedenSubStep] = useState<WerkzaamhedenSubStep>('ranking')
  const [werkzaamhedenRankings, setWerkzaamhedenRankings] = useState<Record<string, number>>({})
  const [werkzaamhedenRatings, setWerkzaamhedenRatings] = useState<Record<string, number>>({})

  // Mock: organisation profile status
  const orgProfileFilled = true

  const pricing = COUNTRIES.find(c => c.code === 'NL')!.pricing
  const basePrice = form.opleiding && form.ervaring
    ? calculatePrice(form.ervaring as ExperienceLevel, form.opleiding as EducationLevel, pricing)
    : 0
  const exclusiviteitToeslag = form.exclusief ? Math.round(basePrice * 0.25) : 0
  const price = basePrice + exclusiviteitToeslag

  // Check if enough info is filled for AI generation
  const aiReady = form.titel.length > 0 && form.locatie.length > 0 && form.opleiding !== '' && form.ervaring !== ''
  const aiMissingFields = [
    ...(!form.titel ? ['functietitel'] : []),
    ...(!form.locatie ? ['locatie'] : []),
    ...(!form.opleiding ? ['opleidingsniveau'] : []),
    ...(!form.ervaring ? ['werkervaring'] : []),
  ]

  const canProceed = () => {
    switch (step) {
      case 1: return form.titel.length > 0
      case 2: return form.locatie.length > 0 && form.vakgebied.length > 0 && form.afdelingscultuur.length > 10
      case 3: return form.opleiding !== '' && form.ervaring !== ''
      case 4: return form.omschrijving.length > 20
      case 5: return akkoord
      case 6: {
        if (werkzaamhedenSubStep === 'ranking') {
          const vals = Object.values(werkzaamhedenRankings)
          return vals.length >= 19 && new Set(vals).size >= 19
        }
        return Object.keys(werkzaamhedenRatings).length >= 19
      }
      default: return false
    }
  }

  const handleAiGenerate = () => {
    if (!aiReady) return
    setAiLoading(true)
    setTimeout(() => {
      const titel = form.titel
      const afdeling = form.afdeling || 'het team'
      const locatie = form.locatie
      const salarisLabel = form.salaris
        ? `${form.salaris} bruto per ${form.salarisPeriode}`
        : 'marktconform salaris'
      const contract = form.contractType
      const kantoor = form.opKantoor
      const ervaring = EXPERIENCE_LABELS[form.ervaring as ExperienceLevel] || ''
      const opleiding = form.opleiding
      const cultuur = form.afdelingscultuur

      // Use user-entered tasks if available, otherwise use role-specific templates
      const userTaken = form.taken.trim()
      const takenList = userTaken
        ? userTaken.split('\n').map(t => t.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
        : getRoleSpecificTasks(titel)

      let omschrijving = `Ben jij een ervaren ${titel} en zoek je een nieuwe uitdaging in ${locatie}? Wij zoeken een gedreven professional voor ${afdeling}.`

      omschrijving += `\n\n`

      if (cultuur) {
        omschrijving += `Over het team\n${cultuur}\n\n`
      }

      omschrijving += `Wat ga je doen?\n`
      omschrijving += takenList.map(t => `• ${t}`).join('\n')

      omschrijving += `\n\nWat vragen wij?\n`
      omschrijving += `• Minimaal ${ervaring.toLowerCase()} relevante werkervaring\n`
      omschrijving += `• ${opleiding} werk- en denkniveau\n`
      omschrijving += getRoleSpecificRequirements(titel).map(r => `• ${r}`).join('\n')

      omschrijving += `\n\nWat bieden wij?\n`
      omschrijving += `• Salaris: ${salarisLabel}\n`
      omschrijving += `• ${contract} contract\n`
      omschrijving += `• ${kantoor}\n`
      omschrijving += `• Locatie: ${locatie}\n`
      omschrijving += `• 25 vakantiedagen + persoonlijk ontwikkelingsbudget\n`
      omschrijving += `• Pensioenregeling en reiskostenvergoeding`

      setForm(f => ({ ...f, omschrijving }))
      setAiLoading(false)
    }, 2000)
  }

  const handleStep6Next = () => {
    if (werkzaamhedenSubStep === 'ranking') {
      const vals = Object.values(werkzaamhedenRankings)
      if (vals.length >= 19 && new Set(vals).size >= 19) {
        setWerkzaamhedenSubStep('rating')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      setPublished(true)
    }
  }

  const handleStep6Back = () => {
    if (werkzaamhedenSubStep === 'rating') {
      setWerkzaamhedenSubStep('ranking')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setStep(5)
    }
  }

  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-4xl mx-auto mb-6">&#10003;</div>
          <h2 className="text-2xl font-bold text-ink mb-3">Vacature gepubliceerd!</h2>
          <p className="text-ink-light mb-2"><span className="text-ink font-semibold">{form.titel}</span> staat nu open voor Talent Scouts.</p>
          <p className="text-ink-muted text-sm mb-4">Je ontvangt een melding zodra de eerste kandidaten worden voorgedragen.</p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-6 text-sm text-green-400 font-medium">
            M-Score profiel compleet &mdash; kandidaten worden automatisch gematcht.
          </div>
          <div className="bg-white rounded-2xl border border-surface-border p-4 mb-8 text-left">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-ink-muted">Model:</span> <span className="text-green-400">No Cure No Pay</span></div>
              <div><span className="text-ink-muted">Locatie:</span> <span className="text-ink">{form.locatie}</span></div>
              <div><span className="text-ink-muted">Opleiding:</span> <span className="text-ink">{form.opleiding}</span></div>
              <div><span className="text-ink-muted">Ervaring:</span> <span className="text-ink">{EXPERIENCE_LABELS[form.ervaring as ExperienceLevel]}</span></div>
              <div><span className="text-ink-muted">Exclusief:</span> <span className={form.exclusief ? 'text-purple font-medium' : 'text-ink'}>{form.exclusief ? 'Ja (+25%)' : 'Nee'}</span></div>
              <div><span className="text-ink-muted">Fee:</span> <span className="text-ink font-medium">{formatPrice(price, pricing)}</span></div>
            </div>
          </div>
          <Link href="/demo/opdrachtgever" className="btn-gradient text-white font-semibold px-6 py-3 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            Terug naar dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">&larr; Terug naar dashboard</Link>
        <h1 className="text-2xl font-bold text-ink mt-3">Vacature aanmaken</h1>
        <p className="text-ink-light mt-1">Doorloop de stappen om uw vacature te publiceren</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.nr} className="flex items-center flex-1">
            <button
              onClick={() => s.nr <= step ? setStep(s.nr as Step) : null}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full ${
                s.nr === step ? 'bg-cyan/15 text-cyan border border-cyan/20'
                : s.nr < step ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-pointer'
                : 'bg-surface-muted border border-surface-border text-ink-muted'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                s.nr === step ? 'bg-cyan text-navy-dark' : s.nr < step ? 'bg-green-500 text-white' : 'bg-purple/15 text-ink-muted'
              }`}>{s.nr < step ? '\u2713' : s.nr}</span>
              <span className="hidden lg:inline">{s.label}</span>
              <span className="lg:hidden">{s.short}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`w-4 h-px mx-1 ${s.nr < step ? 'bg-green-500/30' : 'bg-purple/10'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-8">

        {/* ═══ STEP 1: Functietitel ═══ */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Functietitel &amp; afdeling</h2>
            <p className="text-ink-light text-sm mb-8">Geef de functie een duidelijke titel zodat Talent Scouts de juiste kandidaten kunnen vinden.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Functietitel *</label>
                <input type="text" value={form.titel} onChange={e => setForm(f => ({ ...f, titel: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Marketing Manager, Senior Developer, Sales Lead" />
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Afdeling / Team</label>
                <input type="text" value={form.afdeling} onChange={e => setForm(f => ({ ...f, afdeling: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Marketing, Engineering, Sales" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Details + Afdelingscultuur ═══ */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Vacature details</h2>
            <p className="text-ink-light text-sm mb-8">Praktische informatie over de functie en de werkomgeving.</p>
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Locatie *</label>
                <input type="text" value={form.locatie} onChange={e => setForm(f => ({ ...f, locatie: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Amsterdam" />
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Land *</label>
                <select value={form.land} onChange={e => setForm(f => ({ ...f, land: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  {LANDEN.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="col-span-2 relative">
                <label className="block text-sm text-ink-light mb-1.5">Vakgebied *</label>
                <input
                  type="text"
                  value={form.vakgebied}
                  onChange={e => { setForm(f => ({ ...f, vakgebied: e.target.value })); setVakgebiedOpen(true) }}
                  onFocus={() => setVakgebiedOpen(true)}
                  onBlur={() => setTimeout(() => setVakgebiedOpen(false), 200)}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder="Begin te typen om een vakgebied te selecteren..."
                />
                {vakgebiedOpen && vakgebiedSuggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-surface-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {vakgebiedSuggestions.map(v => (
                      <button
                        key={v}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setForm(f => ({ ...f, vakgebied: v })); setVakgebiedOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-cyan/10 transition-colors ${
                          form.vakgebied === v ? 'bg-cyan/10 text-cyan font-medium' : 'text-ink'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Salarisindicatie (bruto)</label>
                <div className="flex gap-2">
                  <input type="text" value={form.salaris} onChange={e => setForm(f => ({ ...f, salaris: e.target.value }))}
                    className="flex-1 bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                    placeholder={form.salarisPeriode === 'maand' ? 'bijv. \u20AC4.000 - \u20AC5.500' : 'bijv. \u20AC48.000 - \u20AC66.000'} />
                  <div className="flex rounded-lg border border-surface-border overflow-hidden shrink-0">
                    <button type="button" onClick={() => setForm(f => ({ ...f, salarisPeriode: 'maand' }))}
                      className={`px-3 py-3 text-xs font-medium transition-colors ${
                        form.salarisPeriode === 'maand' ? 'bg-cyan/15 text-cyan border-r border-cyan/20' : 'bg-surface-muted text-ink-muted hover:text-ink border-r border-surface-border'
                      }`}>
                      /maand
                    </button>
                    <button type="button" onClick={() => setForm(f => ({ ...f, salarisPeriode: 'jaar' }))}
                      className={`px-3 py-3 text-xs font-medium transition-colors ${
                        form.salarisPeriode === 'jaar' ? 'bg-cyan/15 text-cyan' : 'bg-surface-muted text-ink-muted hover:text-ink'
                      }`}>
                      /jaar
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Contracttype</label>
                <select value={form.contractType} onChange={e => setForm(f => ({ ...f, contractType: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  <option>Vast</option><option>Tijdelijk</option><option>Freelance / ZZP</option><option>Stage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Op kantoor</label>
                <select value={form.opKantoor} onChange={e => setForm(f => ({ ...f, opKantoor: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  <option>Op kantoor (5 dagen)</option><option>Hybride (3 dagen)</option><option>Hybride (2 dagen)</option><option>Volledig remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Max reistijd</label>
                <select value={form.maxReistijd} onChange={e => setForm(f => ({ ...f, maxReistijd: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  <option>15 minuten</option><option>30 minuten</option><option>45 minuten</option><option>60 minuten</option><option>Niet van toepassing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Gewenste startdatum</label>
                <input type="date" value={form.startdatum} onChange={e => setForm(f => ({ ...f, startdatum: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors" />
              </div>
            </div>

            {/* Taken & verantwoordelijkheden */}
            <div className="border-t border-surface-border pt-6">
              <label className="block text-sm text-ink-light mb-1.5">Taken &amp; verantwoordelijkheden</label>
              <p className="text-xs text-ink-muted mb-3">
                Beschrijf de belangrijkste taken voor deze functie. Dit wordt door AI gebruikt om de vacaturetekst te genereren. Laat leeg om AI suggesties te krijgen op basis van de functietitel.
              </p>
              <textarea value={form.taken} onChange={e => setForm(f => ({ ...f, taken: e.target.value }))} rows={4}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
                placeholder={"bijv.\n• Ontwikkelen en uitvoeren van de marketingstrategie\n• Aansturen van het marketingteam en externe bureaus\n• Analyseren van campagneresultaten en ROI"} />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-ink-muted">{form.taken.length} tekens</span>
                <span className="text-xs text-ink-muted">Optioneel</span>
              </div>
            </div>

            {/* Afdelingscultuur */}
            <div className="border-t border-surface-border pt-6">
              <label className="block text-sm text-ink-light mb-1.5">Afdelingscultuur &amp; dynamiek *</label>
              <p className="text-xs text-ink-muted mb-3">
                Beschrijf hoe het team samenwerkt, de sfeer, het tempo en wat het uniek maakt. Dit wordt gedeeld met kandidaten en helpt bij de M-Score matching.
              </p>
              <textarea value={form.afdelingscultuur} onChange={e => setForm(f => ({ ...f, afdelingscultuur: e.target.value }))} rows={4}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
                placeholder="bijv. Ons marketingteam van 8 personen werkt in een informele, energieke omgeving. We combineren data-gedreven beslissingen met creatieve brainstorms. Het tempo is hoog maar de sfeer is open en ondersteunend. Fouten maken mag — leren is belangrijker dan perfect zijn." />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-ink-muted">{form.afdelingscultuur.length} tekens</span>
                <span className="text-xs text-ink-muted">Min. 10 tekens</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Harde criteria ═══ */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Harde criteria</h2>
            <p className="text-ink-light text-sm mb-8">Stel de minimale eisen in voor kandidaten op deze vacature.</p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm text-ink-light mb-3">Minimaal opleidingsniveau *</label>
                <div className="space-y-2">
                  {(['MBO', 'HBO', 'WO'] as EducationLevel[]).map(edu => (
                    <button key={edu} onClick={() => setForm(f => ({ ...f, opleiding: edu }))}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        form.opleiding === edu ? 'bg-cyan/15 border-cyan/30 text-cyan' : 'bg-surface-muted border-surface-border text-ink-light hover:border-purple/40 hover:text-ink'
                      }`}>
                      <span>{EDUCATION_LABELS[edu]}</span>
                      <span className="text-xs opacity-60">{edu === 'MBO' ? 'Vocational' : edu === 'HBO' ? 'Applied' : 'Academic'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-3">Minimale werkervaring *</label>
                <div className="space-y-2">
                  {(['0-2', '2-5', '5-10', '10+'] as ExperienceLevel[]).map(exp => (
                    <button key={exp} onClick={() => setForm(f => ({ ...f, ervaring: exp }))}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        form.ervaring === exp ? 'bg-cyan/15 border-cyan/30 text-cyan' : 'bg-surface-muted border-surface-border text-ink-light hover:border-purple/40 hover:text-ink'
                      }`}>
                      <span>{EXPERIENCE_LABELS[exp]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {form.opleiding && form.ervaring && form.opleiding !== 'MBO' && form.ervaring === '10+' && (
              <div className="mt-4 bg-cyan/5 border border-cyan/20 rounded-xl p-3">
                <p className="text-xs text-cyan">&#8505;&#65039; Bij &gt;10 jaar ervaring geldt voor HBO en WO hetzelfde tarief.</p>
              </div>
            )}

            {/* Exclusiviteit optie */}
            <div className="mt-8 pt-6 border-t border-surface-border">
              <label className="block text-sm text-ink-light mb-3">Exclusiviteit</label>
              <div
                onClick={() => { if (!form.exclusief) setForm(f => ({ ...f, exclusief: true })) }}
                className={`rounded-xl border-2 p-5 transition-all ${
                  form.exclusief
                    ? 'bg-purple/5 border-purple/30'
                    : 'bg-surface-muted border-surface-border hover:border-purple/30 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    form.exclusief ? 'bg-purple border-purple text-white' : 'border-surface-border'
                  }`}>
                    {form.exclusief && <span className="text-xs font-bold">&#10003;</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-semibold text-sm">Exclusieve kandidaten</span>
                      <span className="px-2 py-0.5 bg-purple/10 text-purple text-[10px] font-bold rounded-full uppercase tracking-wider">+25%</span>
                    </div>
                    <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                      Voorgedragen kandidaten zijn 14 dagen exclusief beschikbaar voor uw vacature en worden in die periode niet aan andere opdrachtgevers aangeboden voor vacatures in hetzelfde vakgebied. Sollicitaties in andere vakgebieden lopen gewoon door — een vacature in een heel ander vakgebied is immers geen concurrent voor uw positie. De exclusiviteitstoeslag van 25% wordt bij een succesvolle plaatsing toegevoegd aan de plaatsingsfee.
                    </p>
                    <div className="mt-3 bg-cyan/5 border border-cyan/20 rounded-lg p-2.5 flex items-start gap-2">
                      <span className="text-cyan text-xs">🚀</span>
                      <p className="text-xs text-cyan">
                        <strong>Meer kandidaten:</strong> de hogere fee motiveert Talent Scouts extra om voor uw vacature aan de slag te gaan. Exclusieve vacatures ontvangen gemiddeld aanzienlijk meer voorgedragen kandidaten.
                      </p>
                    </div>
                    {form.exclusief && (
                      <div className="mt-3 bg-orange/5 border border-orange/20 rounded-lg p-2.5 flex items-start gap-2">
                        <span className="text-orange text-xs">&#9888;&#65039;</span>
                        <p className="text-xs text-orange">
                          <strong>Let op:</strong> exclusiviteit kan na activering niet meer worden uitgeschakeld voor deze vacature.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Live prijsindicatie */}
              {form.opleiding && form.ervaring && (
                <div className="mt-4 bg-white rounded-xl border border-surface-border p-4">
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Prijsindicatie (no cure, no pay)</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-ink">{formatPrice(price, pricing)}</span>
                        <span className="text-xs text-ink-muted">excl. BTW</span>
                      </div>
                      {form.exclusief && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-ink-muted line-through">{formatPrice(basePrice, pricing)}</span>
                          <span className="text-xs text-purple font-medium">+ {formatPrice(exclusiviteitToeslag, pricing)} exclusiviteit</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-ink-muted">
                      <p>Scout: {formatPrice(Math.round(price / 2), pricing)}</p>
                      <p>Refurzy: {formatPrice(Math.round(price / 2), pricing)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Omschrijving (nu met alle context beschikbaar) ═══ */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Functieomschrijving</h2>
            <p className="text-ink-light text-sm mb-6">
              Schrijf een aantrekkelijke vacaturetekst of laat AI een concept genereren op basis van de informatie die u eerder heeft ingevuld.
            </p>

            {/* AI context summary */}
            <div className="bg-surface-muted rounded-xl border border-surface-border p-4 mb-4">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">AI gebruikt deze context:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className={form.titel ? 'text-green-500' : 'text-ink-muted'}>
                    {form.titel ? '✓' : '○'}
                  </span>
                  <span className={form.titel ? 'text-ink' : 'text-ink-muted'}>
                    {form.titel || 'Functietitel'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={form.locatie ? 'text-green-500' : 'text-ink-muted'}>
                    {form.locatie ? '✓' : '○'}
                  </span>
                  <span className={form.locatie ? 'text-ink' : 'text-ink-muted'}>
                    {form.locatie || 'Locatie'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={form.opleiding ? 'text-green-500' : 'text-ink-muted'}>
                    {form.opleiding ? '✓' : '○'}
                  </span>
                  <span className={form.opleiding ? 'text-ink' : 'text-ink-muted'}>
                    {form.opleiding || 'Opleiding'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={form.ervaring ? 'text-green-500' : 'text-ink-muted'}>
                    {form.ervaring ? '✓' : '○'}
                  </span>
                  <span className={form.ervaring ? 'text-ink' : 'text-ink-muted'}>
                    {form.ervaring ? EXPERIENCE_LABELS[form.ervaring as ExperienceLevel] : 'Ervaring'}
                  </span>
                </div>
                {form.afdeling && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span>
                    <span className="text-ink">{form.afdeling}</span>
                  </div>
                )}
                {form.salaris && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span>
                    <span className="text-ink">{form.salaris} /{form.salarisPeriode}</span>
                  </div>
                )}
                {form.taken && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span>
                    <span className="text-ink">Eigen taken opgegeven</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span className="text-ink">{form.contractType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={form.afdelingscultuur ? 'text-green-500' : 'text-ink-muted'}>
                    {form.afdelingscultuur ? '✓' : '○'}
                  </span>
                  <span className={form.afdelingscultuur ? 'text-ink' : 'text-ink-muted'}>
                    {form.afdelingscultuur ? 'Cultuur beschreven' : 'Cultuur'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI generate button */}
            <div className="flex items-center gap-3 mb-4">
              <button onClick={handleAiGenerate} disabled={aiLoading || !aiReady}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  aiLoading ? 'bg-purple/20 text-purple cursor-wait'
                  : aiReady ? 'btn-gradient text-white hover:-translate-y-px'
                  : 'bg-surface-muted border border-surface-border text-ink-muted cursor-not-allowed'
                }`}>
                {aiLoading ? <><span className="animate-spin">&#10227;</span> AI schrijft...</> : <>&#10024; Genereer met AI</>}
              </button>
              {!aiReady && (
                <span className="text-xs text-ink-muted">
                  Vul eerst {aiMissingFields.join(', ')} in (stap 1-3)
                </span>
              )}
              {aiReady && !aiLoading && (
                <span className="text-xs text-ink-muted">
                  Genereert een vacaturetekst op basis van alle ingevulde gegevens
                </span>
              )}
            </div>

            <textarea value={form.omschrijving} onChange={e => setForm(f => ({ ...f, omschrijving: e.target.value }))} rows={16}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
              placeholder="Beschrijf de functie, verantwoordelijkheden, het team en wat u biedt. Of gebruik de AI-knop hierboven om automatisch een concept te genereren op basis van de stappen die u al heeft doorlopen." />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-ink-muted">{form.omschrijving.length} tekens</span>
              <span className="text-xs text-ink-muted">Min. 20 tekens</span>
            </div>
          </div>
        )}

        {/* ═══ STEP 5: Samenvatting & publiceer ═══ */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Controleer &amp; publiceer</h2>
            <p className="text-ink-light text-sm mb-8">Controleer uw vacature en publiceer deze. Talent Scouts kunnen daarna kandidaten voordragen.</p>

            <div className="bg-surface-muted rounded-2xl border border-surface-border p-6 mb-6">
              <h3 className="text-ink font-semibold mb-4">Samenvatting vacature</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-ink-muted">Functie:</span> <span className="text-ink font-medium">{form.titel}</span></div>
                <div><span className="text-ink-muted">Afdeling:</span> <span className="text-ink">{form.afdeling || '—'}</span></div>
                <div><span className="text-ink-muted">Locatie:</span> <span className="text-ink">{form.locatie}</span></div>
                <div><span className="text-ink-muted">Land:</span> <span className="text-ink">{form.land}</span></div>
                <div><span className="text-ink-muted">Vakgebied:</span> <span className="text-cyan font-medium">{form.vakgebied}</span></div>
                <div><span className="text-ink-muted">Salaris:</span> <span className="text-ink">{form.salaris ? `${form.salaris} bruto p/${form.salarisPeriode === 'maand' ? 'mnd' : 'jr'}` : '—'}</span></div>
                <div><span className="text-ink-muted">Contract:</span> <span className="text-ink">{form.contractType}</span></div>
                <div><span className="text-ink-muted">Op kantoor:</span> <span className="text-ink">{form.opKantoor}</span></div>
                <div><span className="text-ink-muted">Opleiding:</span> <span className="text-cyan font-medium">{form.opleiding}</span></div>
                <div><span className="text-ink-muted">Ervaring:</span> <span className="text-cyan font-medium">{EXPERIENCE_LABELS[form.ervaring as ExperienceLevel]}</span></div>
                <div><span className="text-ink-muted">Exclusiviteit:</span> <span className={form.exclusief ? 'text-purple font-medium' : 'text-ink'}>{form.exclusief ? 'Ja (14 dagen, +25%)' : 'Nee'}</span></div>
                <div><span className="text-ink-muted">Plaatsingsfee:</span> <span className="text-ink font-medium">{formatPrice(price, pricing)} <span className="text-ink-muted font-normal">excl. BTW</span></span></div>
              </div>
              {form.omschrijving && (
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <span className="text-ink-muted text-sm">Vacaturetekst:</span>
                  <p className="text-ink-light text-sm mt-1 leading-relaxed whitespace-pre-line line-clamp-6">{form.omschrijving}</p>
                </div>
              )}
              {form.afdelingscultuur && (
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <span className="text-ink-muted text-sm">Afdelingscultuur:</span>
                  <p className="text-ink-light text-sm mt-1 leading-relaxed">{form.afdelingscultuur}</p>
                </div>
              )}
            </div>

            <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-lg">&#128161;</span>
              <div className="text-sm text-ink-light">
                <p><strong className="text-ink">Hoe werkt het?</strong></p>
                <p className="mt-1">Na publicatie kunnen Talent Scouts kandidaten voordragen. U ontvangt kandidaten met een anonieme M-Score. Wanneer u een profiel wilt bekijken, gaat u akkoord met de plaatsingsovereenkomst. U betaalt alleen bij een succesvolle plaatsing (no cure, no pay).</p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={akkoord} onChange={e => setAkkoord(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-surface-muted accent-cyan" />
              <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
                Ik bevestig dat de bovenstaande gegevens correct zijn en wil deze vacature publiceren.
              </span>
            </label>
          </div>
        )}

        {/* ═══ STEP 6: Werkzaamheden profiel ═══ */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">
              Werkzaamheden profiel &mdash; specifiek voor {form.titel || 'deze vacature'}
            </h2>
            <p className="text-ink-light text-sm mb-2">
              Geef aan welke werkzaamheden het meest relevant zijn voor deze functie. Dit bepaalt de M-Score matching.
            </p>
            <p className="text-xs text-ink-muted mb-4">
              Uw organisatieprofiel (waarden &amp; kenmerken) wordt automatisch gecombineerd.
            </p>

            {/* Org profile status banner */}
            {orgProfileFilled ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
                <span className="text-green-400">&#8505;&#65039;</span>
                <span className="text-green-400 text-sm font-medium">Organisatieprofiel: &#10003; Ingevuld</span>
              </div>
            ) : (
              <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-6 flex items-center gap-2">
                <span className="text-orange">&#9888;&#65039;</span>
                <span className="text-orange text-sm">
                  Niet ingevuld &mdash;{' '}
                  <Link href="/demo/opdrachtgever/matching-profiel" className="underline font-medium hover:text-orange/80">
                    vul eerst uw organisatieprofiel in
                  </Link>
                </span>
              </div>
            )}

            {/* Sub-step progress */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                werkzaamhedenSubStep === 'ranking' ? 'bg-cyan/15 text-cyan border border-cyan/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  werkzaamhedenSubStep === 'ranking' ? 'bg-cyan text-navy-dark' : 'bg-green-500 text-white'
                }`}>{werkzaamhedenSubStep === 'ranking' ? 'a' : '\u2713'}</span>
                Rangorde
              </div>
              <div className="w-6 h-px bg-purple/10" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                werkzaamhedenSubStep === 'rating' ? 'bg-cyan/15 text-cyan border border-cyan/20' : 'bg-surface-muted border border-surface-border text-ink-muted'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  werkzaamhedenSubStep === 'rating' ? 'bg-cyan text-navy-dark' : 'bg-purple/15 text-ink-muted'
                }`}>b</span>
                Beoordeling
              </div>
            </div>

            {/* Sub-step content */}
            {werkzaamhedenSubStep === 'ranking' && (
              <WerkzaamhedenRankingStep
                rankings={werkzaamhedenRankings}
                onChange={(id, v) => setWerkzaamhedenRankings(prev => ({ ...prev, [id]: v }))}
              />
            )}

            {werkzaamhedenSubStep === 'rating' && (
              <WerkzaamhedenRatingStep
                ratings={werkzaamhedenRatings}
                onChange={(id, v) => setWerkzaamhedenRatings(prev => ({ ...prev, [id]: v }))}
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface-border">
          {step === 6 ? (
            <button onClick={handleStep6Back}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-surface-muted border border-surface-border text-ink-light hover:text-ink">
              &larr; {werkzaamhedenSubStep === 'rating' ? 'Terug naar rangorde' : 'Vorige'}
            </button>
          ) : (
            <button onClick={() => setStep((step - 1) as Step)} disabled={step === 1}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                step === 1 ? 'text-ink-muted cursor-not-allowed' : 'bg-surface-muted border border-surface-border text-ink-light hover:text-ink'
              }`}>&larr; Vorige</button>
          )}

          {step < 6 ? (
            <button onClick={() => setStep((step + 1) as Step)} disabled={!canProceed()}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed() ? 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]' : 'bg-gray-700 text-ink-muted cursor-not-allowed'
              }`}>Volgende &rarr;</button>
          ) : (
            <button onClick={handleStep6Next} disabled={!canProceed()}
              className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed()
                  ? werkzaamhedenSubStep === 'rating'
                    ? 'bg-green-500 text-white hover:bg-green-400 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)]'
                    : 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]'
                  : 'bg-gray-700 text-ink-muted cursor-not-allowed'
              }`}>
              {werkzaamhedenSubStep === 'rating' ? '\u2713 Publiceer vacature' : 'Volgende \u2192'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Werkzaamheden Ranking Sub-step ─────────────────────────────────────────

function WerkzaamhedenRankingStep({
  rankings,
  onChange,
}: {
  rankings: Record<string, number>
  onChange: (id: string, value: number) => void
}) {
  const usedValues = new Set(Object.values(rankings))
  const options = Array.from({ length: 19 }, (_, i) => i + 1)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-ink">Rangschik de werkzaamheden</h3>
        <p className="text-ink-light text-sm mt-1">
          Geef elke werkzaamheid een unieke rangorde van 1 (minst relevant voor de vacature) tot 19 (meest relevant). Elk nummer mag maar één keer gebruikt worden.
        </p>
      </div>

      <div className="space-y-3">
        {werkzaamheden.map((item) => {
          const currentVal = rankings[item.id]
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 border-b border-surface-border pb-3 last:border-0 last:pb-0"
            >
              <select
                value={currentVal || ''}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10)
                  if (!isNaN(v)) onChange(item.id, v)
                }}
                className="w-20 shrink-0 mt-0.5 rounded-lg border border-surface-border bg-surface text-ink text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/40"
              >
                <option value="">&mdash;</option>
                {options.map((n) => {
                  const taken = usedValues.has(n) && currentVal !== n
                  return (
                    <option key={n} value={n} disabled={taken}>
                      {n}{taken ? ' (in gebruik)' : ''}
                    </option>
                  )
                })}
              </select>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{item.labelOrg}</p>
                <p className="text-xs text-ink-muted mt-0.5">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-ink-muted">
        {Object.keys(rankings).length} van 19 ingevuld
      </p>
    </div>
  )
}

// ─── Werkzaamheden Rating Sub-step ──────────────────────────────────────────

function WerkzaamhedenRatingStep({
  ratings,
  onChange,
}: {
  ratings: Record<string, number>
  onChange: (id: string, value: number) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-ink">Beoordeel elke werkzaamheid</h3>
        <p className="text-ink-light text-sm mt-1">
          Geef aan in welke mate deze werkzaamheid relevant is voor de vacature.
        </p>
      </div>

      {/* Scale legend */}
      <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
        {werkzaamhedenRatingScale.filter((s) => s.label).map((s) => (
          <span key={s.value} className="bg-surface-muted px-2 py-1 rounded">
            {s.value} = {s.label}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {werkzaamheden.map((item) => {
          const currentVal = ratings[item.id]
          return (
            <div
              key={item.id}
              className="border-b border-surface-border pb-4 last:border-0 last:pb-0 space-y-2"
            >
              <div>
                <p className="text-sm font-medium text-ink">{item.labelOrg}</p>
                <p className="text-xs text-ink-muted">{item.description}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {werkzaamhedenRatingScale.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onChange(item.id, s.value)}
                    title={s.label || String(s.value)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentVal === s.value
                        ? 'bg-cyan text-navy-dark ring-2 ring-cyan/40'
                        : 'bg-surface-muted border border-surface-border text-ink-light hover:border-cyan/30'
                    }`}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-ink-muted">
        {Object.keys(ratings).length} van 19 beoordeeld
      </p>
    </div>
  )
}
