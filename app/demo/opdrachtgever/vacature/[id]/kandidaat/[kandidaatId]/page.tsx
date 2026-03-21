'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { vacatures, pipelineSteps, afwijzingsRedenen, calculateFee } from '@/lib/mock-data'
import { ProcesStatus, AfwijzingsReden, Gesprek } from '@/lib/types'
import FitScore from '@/components/FitScore'
import HardeCriteriaDetail from '@/components/HardeCriteriaDetail'
import PipelineTracker from '@/components/PipelineTracker'
import { calculateHardeCriteriaMatch } from '@/lib/matching'

// ─── Mock CV data per kandidaat ──────────────────────────────────────────────
interface CVData {
  samenvatting: string
  opleiding: { titel: string; instelling: string; jaar: string; extra?: string }[]
  werkervaring: { functie: string; bedrijf: string; periode: string; beschrijving: string }[]
  vaardigheden: string[]
  certificeringen?: string[]
  talen: { taal: string; niveau: string }[]
  scoutToelichting: string
}

const mockCVData: Record<string, CVData> = {
  'k-1': {
    samenvatting: 'Resultaatgerichte Marketing Manager met 8 jaar ervaring in digitale marketing, merkstrategie en teamleiderschap. Bewezen trackrecord in het opzetten van succesvolle campagnes en het aansturen van multidisciplinaire teams.',
    opleiding: [
      { titel: 'MSc Marketing Management', instelling: 'Universiteit van Amsterdam', jaar: '2016-2018' },
      { titel: 'BSc Bedrijfskunde', instelling: 'Universiteit van Amsterdam', jaar: '2012-2016' },
    ],
    werkervaring: [
      { functie: 'Senior Marketing Manager', bedrijf: 'DigitalFirst B.V.', periode: '2021 – heden', beschrijving: 'Verantwoordelijk voor de gehele marketingstrategie met een team van 6 marketeers. Realiseerde 35% groei in online conversies en 25% toename in merkbekendheid.' },
      { functie: 'Marketing Manager', bedrijf: 'BrandWorks Agency', periode: '2018 – 2021', beschrijving: 'Ontwikkelde en implementeerde cross-channel campagnes voor B2B en B2C klanten. Beheerde budget van €500K+.' },
      { functie: 'Marketing Coordinator', bedrijf: 'StartupHub Amsterdam', periode: '2016 – 2018', beschrijving: 'Content marketing, social media en eventorganisatie voor een tech-incubator met 50+ startups.' },
    ],
    vaardigheden: ['Digitale strategie', 'Google Analytics / GA4', 'HubSpot', 'Teamleiderschap', 'Budget management', 'SEO/SEA', 'Content marketing', 'A/B testing'],
    certificeringen: ['Google Analytics Certified', 'HubSpot Inbound Marketing', 'Meta Blueprint'],
    talen: [{ taal: 'Nederlands', niveau: 'Moedertaal (C2)' }, { taal: 'Engels', niveau: 'Uitstekend (C1)' }],
    scoutToelichting: 'Anna is een uitstekende match voor deze rol. Ze heeft ruime ervaring in digitale marketing en heeft bewezen dat ze een team kan aansturen. Haar trackrecord bij DigitalFirst laat zien dat ze meetbare resultaten behaalt. Cultureel past ze goed bij de innovatieve sfeer van TechVentures.',
  },
  'k-10': {
    samenvatting: 'Creatieve marketeer met 4 jaar ervaring in campagnemanagement en data-gedreven marketing. Sterk in analytics en het vertalen van data naar actiegerichte inzichten.',
    opleiding: [
      { titel: 'MSc Communication Science', instelling: 'Universiteit Leiden', jaar: '2020-2022' },
      { titel: 'BSc Communicatiewetenschap', instelling: 'Universiteit Leiden', jaar: '2017-2020' },
    ],
    werkervaring: [
      { functie: 'Marketing Specialist', bedrijf: 'DataDriven Marketing', periode: '2022 – heden', beschrijving: 'Verantwoordelijk voor campagne-optimalisatie, A/B testing en marketing automation. Verhoogde email open rates met 40%.' },
      { functie: 'Junior Marketeer', bedrijf: 'CreativeMinds Agency', periode: '2020 – 2022', beschrijving: 'Social media management en content creatie voor diverse klanten in retail en e-commerce.' },
    ],
    vaardigheden: ['Marketing automation', 'Data-analyse', 'Mailchimp/ActiveCampaign', 'Social media', 'Copywriting', 'Photoshop/Canva'],
    certificeringen: ['Google Ads Certified', 'Mailchimp Expert'],
    talen: [{ taal: 'Nederlands', niveau: 'Uitstekend (C1)' }, { taal: 'Engels', niveau: 'Goed (B2)' }],
    scoutToelichting: 'Nadia is een sterke analytische marketeer die goed past bij de data-gedreven cultuur van TechVentures. Ze heeft minder leidinggevende ervaring maar compenseert dit met haar sterke technische skills en leergierigheid.',
  },
  'k-3': {
    samenvatting: 'Ambitieuze marketing professional met 4 jaar ervaring, gespecialiseerd in social media en contentmarketing.',
    opleiding: [
      { titel: 'BSc Commerciële Economie', instelling: 'Haagse Hogeschool', jaar: '2018-2022' },
    ],
    werkervaring: [
      { functie: 'Social Media Manager', bedrijf: 'SocialBuzz', periode: '2022 – heden', beschrijving: 'Beheer van social media kanalen voor 10+ klanten. Focus op TikTok en Instagram groeistrategieën.' },
      { functie: 'Marketing Stagiair', bedrijf: 'RetailGroup NL', periode: '2021 – 2022', beschrijving: 'Ondersteuning bij campagneontwikkeling en marktonderzoek.' },
    ],
    vaardigheden: ['Social media management', 'Content creatie', 'Instagram/TikTok', 'Canva', 'Basis SEO'],
    talen: [{ taal: 'Nederlands', niveau: 'Goed (B2)' }, { taal: 'Engels', niveau: 'Redelijk (B1)' }],
    scoutToelichting: 'Lisa is een gedreven junior marketeer met veel potentieel. Ze heeft minder ervaring dan gevraagd maar haar social media expertise kan waardevol zijn voor het team.',
  },
  'k-20': {
    samenvatting: 'Veelzijdige marketeer met 6 jaar ervaring in B2B marketing, leadgeneratie en marketing automation.',
    opleiding: [
      { titel: 'BSc Marketing Management', instelling: 'Hogeschool van Amsterdam', jaar: '2015-2019' },
    ],
    werkervaring: [
      { functie: 'Marketing Manager', bedrijf: 'B2B Solutions', periode: '2021 – heden', beschrijving: 'Verantwoordelijk voor de volledige marketing funnel inclusief lead scoring, nurturing en pipeline rapportage.' },
      { functie: 'Marketing Executive', bedrijf: 'TechScale', periode: '2019 – 2021', beschrijving: 'Opzetten van HubSpot, implementatie van marketing automation flows en content strategie.' },
    ],
    vaardigheden: ['HubSpot', 'Marketing automation', 'Lead generation', 'B2B marketing', 'CRM management', 'LinkedIn Ads'],
    certificeringen: ['HubSpot Marketing Software', 'LinkedIn Marketing Certified'],
    talen: [{ taal: 'Nederlands', niveau: 'Moedertaal (C2)' }, { taal: 'Engels', niveau: 'Redelijk (B1)' }],
    scoutToelichting: 'Mees heeft sterke B2B marketing ervaring en is erg goed in marketing automation. Hij kan direct aan de slag met het opschalen van de marketing funnel.',
  },
  'k-21': {
    samenvatting: 'Jonge, energieke marketing professional met 3 jaar ervaring in brand management en event marketing.',
    opleiding: [
      { titel: 'MSc Strategic Management', instelling: 'Universiteit Utrecht', jaar: '2021-2023' },
      { titel: 'BSc Bedrijfskunde', instelling: 'Universiteit Utrecht', jaar: '2018-2021' },
    ],
    werkervaring: [
      { functie: 'Brand Manager', bedrijf: 'FreshBrands NL', periode: '2023 – heden', beschrijving: 'Verantwoordelijk voor merkpositionering en marketingstrategie van 3 FMCG-merken.' },
      { functie: 'Marketing Assistent', bedrijf: 'EventPro', periode: '2021 – 2023', beschrijving: 'Organisatie van corporate events en ondersteunende marketingactiviteiten.' },
    ],
    vaardigheden: ['Brand management', 'Event marketing', 'Strategisch denken', 'Presenteren', 'Adobe Creative Suite'],
    talen: [{ taal: 'Nederlands', niveau: 'Uitstekend (C1)' }, { taal: 'Engels', niveau: 'Uitstekend (C1)' }],
    scoutToelichting: 'Yara is strategisch sterk en heeft een frisse kijk op brand management. Ze heeft minder jaren ervaring maar haar snelle groei en WO-achtergrond compenseren dit ruimschoots.',
  },
  'k-22': {
    samenvatting: 'Ervaren marketing leider met 9 jaar ervaring in zowel corporate als agency-omgevingen. Expert in merkstrategie en digitale transformatie.',
    opleiding: [
      { titel: 'MBA', instelling: 'Rotterdam School of Management', jaar: '2019-2021', extra: 'Specialisatie Marketing & Innovation' },
      { titel: 'BSc Communicatiewetenschappen', instelling: 'Vrije Universiteit Amsterdam', jaar: '2013-2017' },
    ],
    werkervaring: [
      { functie: 'Head of Marketing', bedrijf: 'ScaleUp Ventures', periode: '2022 – heden', beschrijving: 'Leidt een team van 8 marketeers. Verantwoordelijk voor een marketingbudget van €1.2M en realiseerde 50% groei in MQLs.' },
      { functie: 'Senior Marketing Consultant', bedrijf: 'McKinnon & Partners', periode: '2019 – 2022', beschrijving: 'Strategisch advies aan Fortune 500 bedrijven op het gebied van digitale transformatie en merkstrategie.' },
      { functie: 'Marketing Manager', bedrijf: 'MediaGroup NL', periode: '2017 – 2019', beschrijving: 'Opbouw en leiding van het digitale marketing team. Lancering van 3 succesvolle productlanceringen.' },
    ],
    vaardigheden: ['Strategisch marketing leiderschap', 'Digitale transformatie', 'Team management', 'Budget planning', 'Stakeholder management', 'Google Analytics', 'Salesforce'],
    certificeringen: ['MBA Marketing & Innovation', 'Salesforce Marketing Cloud'],
    talen: [{ taal: 'Nederlands', niveau: 'Moedertaal (C2)' }, { taal: 'Engels', niveau: 'Uitstekend (C1)' }],
    scoutToelichting: 'Bram is een zeer ervaren marketing leider met een MBA en bewezen resultaten in het opschalen van marketingteams. Hij brengt zowel strategisch denken als hands-on ervaring mee.',
  },
  'k-4': {
    samenvatting: 'Full-stack developer met 10 jaar ervaring in enterprise software development. Expert in React, Node.js en cloud architectuur.',
    opleiding: [
      { titel: 'MSc Computer Science', instelling: 'TU Delft', jaar: '2014-2016' },
      { titel: 'BSc Informatica', instelling: 'TU Delft', jaar: '2010-2014' },
    ],
    werkervaring: [
      { functie: 'Lead Developer', bedrijf: 'CloudNine Technologies', periode: '2020 – heden', beschrijving: 'Leidt een team van 5 developers. Architectuur en implementatie van microservices op AWS. Migreerde legacy monolith naar cloud-native architectuur.' },
      { functie: 'Senior Software Developer', bedrijf: 'FinTech Innovations', periode: '2017 – 2020', beschrijving: 'Ontwikkeling van real-time trading platform in React/Node.js. Implementatie van CI/CD pipelines.' },
      { functie: 'Software Developer', bedrijf: 'WebAgency Pro', periode: '2016 – 2017', beschrijving: 'Full-stack development van enterprise web applicaties.' },
    ],
    vaardigheden: ['React/Next.js', 'Node.js/TypeScript', 'AWS/Azure', 'Docker/Kubernetes', 'PostgreSQL/MongoDB', 'CI/CD', 'Agile/Scrum', 'System design'],
    certificeringen: ['AWS Solutions Architect', 'Kubernetes Administrator (CKA)'],
    talen: [{ taal: 'Engels', niveau: 'Moedertaal (C2)' }, { taal: 'Nederlands', niveau: 'Goed (B2)' }],
    scoutToelichting: 'Thomas is een uitzonderlijke developer met diepe technische kennis en leidinggevende ervaring. Zijn AWS expertise en ervaring met microservices sluiten perfect aan bij de technische roadmap van TechVentures.',
  },
  'k-5': {
    samenvatting: 'Backend developer met 7 jaar ervaring in Java en Python. Sterk in data engineering en API design.',
    opleiding: [
      { titel: 'BSc Software Engineering', instelling: 'Hogeschool Rotterdam', jaar: '2015-2019' },
    ],
    werkervaring: [
      { functie: 'Senior Backend Developer', bedrijf: 'DataPipeline B.V.', periode: '2021 – heden', beschrijving: 'Ontwerp en ontwikkeling van high-throughput data pipelines. Verwerkt 10M+ events per dag.' },
      { functie: 'Backend Developer', bedrijf: 'LogiSoft', periode: '2019 – 2021', beschrijving: 'REST API development en database optimalisatie voor logistieke software.' },
    ],
    vaardigheden: ['Java/Spring Boot', 'Python', 'PostgreSQL', 'Apache Kafka', 'REST APIs', 'Docker', 'Git'],
    certificeringen: ['Oracle Java Certified Professional'],
    talen: [{ taal: 'Engels', niveau: 'Uitstekend (C1)' }, { taal: 'Nederlands', niveau: 'Goed (B2)' }, { taal: 'Hindi', niveau: 'Moedertaal (C2)' }],
    scoutToelichting: 'Priya is technisch sterk met veel ervaring in data-intensieve applicaties. Ze is pragmatisch, levert snel en werkt goed samen in teams.',
  },
}

// Fallback CV generator for kandidaten without specific mock data
function getDefaultCV(k: { naam: string; opleidingsniveau: string; werkervaring: string; woonplaats: string; scoutNaam: string }): CVData {
  return {
    samenvatting: `Ervaren professional met ${k.werkervaring} werkervaring op ${k.opleidingsniveau}-niveau. Zoekt een nieuwe uitdaging in de regio ${k.woonplaats}.`,
    opleiding: [
      { titel: k.opleidingsniveau === 'WO' ? 'MSc Bedrijfskunde' : 'BSc Bedrijfskunde', instelling: k.opleidingsniveau === 'WO' ? 'Universiteit Utrecht' : 'Hogeschool Utrecht', jaar: '2014-2018' },
    ],
    werkervaring: [
      { functie: 'Senior Professional', bedrijf: 'Vorig Bedrijf B.V.', periode: '2020 – heden', beschrijving: 'Verantwoordelijk voor diverse projecten en taken binnen het vakgebied.' },
    ],
    vaardigheden: ['Projectmanagement', 'Communicatie', 'Analyse', 'Teamwerk'],
    talen: [{ taal: 'Nederlands', niveau: 'Uitstekend (C1)' }, { taal: 'Engels', niveau: 'Goed (B2)' }],
    scoutToelichting: `Kandidaat is voorgedragen door ${k.scoutNaam} vanwege een goede match met het profiel en de organisatiecultuur.`,
  }
}

export default function OpdrachtgeverKandidaatProces() {
  const params = useParams()
  const vacature = vacatures.find(v => v.id === params.id)
  const kandidaat = vacature?.kandidaten.find(k => k.id === params.kandidaatId)

  const [procesStatus, setProcesStatus] = useState<ProcesStatus>(kandidaat?.procesStatus || 'voorgesteld')
  const [unlocked, setUnlocked] = useState(kandidaat?.unlocked || false)
  const [contractAccepted, setContractAccepted] = useState(procesStatus !== 'voorgesteld')
  const [gesprekken, setGesprekken] = useState<Gesprek[]>(kandidaat?.gesprekken || [])
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [showCelebrateModal, setShowCelebrateModal] = useState(false)
  const [rejectRating, setRejectRating] = useState(0)
  const [rejectReason, setRejectReason] = useState<AfwijzingsReden | ''>('')
  const [rejectNote, setRejectNote] = useState('')
  const [newGesprekDatum, setNewGesprekDatum] = useState('')
  const [newGesprekType, setNewGesprekType] = useState<'kennismaking' | 'verdieping' | 'arbeidsvoorwaarden'>('kennismaking')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [isRejected, setIsRejected] = useState(false)
  const [ondertekeningNaam, setOndertekeningNaam] = useState('')
  const [creditcardNummer, setCreditcardNummer] = useState('')
  const [creditcardExpiry, setCreditcardExpiry] = useState('')
  const [creditcardCvc, setCreditcardCvc] = useState('')

  // Minimum scout rating based on pipeline phase reached
  const getMinRating = (status: string) => {
    if (['contract_akkoord', 'gesprek_plannen', 'gesprek_gepland', 'feedback_geven'].includes(status)) return 3
    if (status === 'arbeidsvoorwaarden') return 4
    return 0 // voorgesteld: no minimum
  }
  const minRating = getMinRating(procesStatus)

  if (!vacature || !kandidaat) {
    return <div className="flex items-center justify-center h-64"><p className="text-ink-light">Kandidaat niet gevonden.</p></div>
  }

  const fee = calculateFee(kandidaat.opleidingsniveau, kandidaat.werkervaring)
  const lastGesprek = gesprekken[gesprekken.length - 1]
  const needsFeedback = lastGesprek && lastGesprek.status === 'afgerond' && !lastGesprek.feedback
  const cv = mockCVData[kandidaat.id] || getDefaultCV(kandidaat)

  // Calculate detailed harde criteria match using same mock data as HardeCriteriaDetail
  const mockKandidaatData: Record<string, { salarisMin: number; salarisMax: number; maxReistijd: string; opKantoor: string; talen: { taal: string; niveau: 'A2' | 'B1' | 'B2' | 'C1' | 'C2' }[] }> = {
    'k-1': { salarisMin: 4800, salarisMax: 5800, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-10': { salarisMin: 4000, salarisMax: 5000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'B2' }] },
    'k-3': { salarisMin: 4500, salarisMax: 6500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-4': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-5': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Engels', niveau: 'C1' }] },
    'k-20': { salarisMin: 4200, salarisMax: 5500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-21': { salarisMin: 3500, salarisMax: 4500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-22': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-23': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-24': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '30 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Engels', niveau: 'B2' }] },
    'k-25': { salarisMin: 7000, salarisMax: 8500, maxReistijd: '30 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-30': { salarisMin: 4000, salarisMax: 5000, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'B2' }] },
    'k-31': { salarisMin: 3800, salarisMax: 4800, maxReistijd: '30 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-32': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-33': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' }, { taal: 'Engels', niveau: 'B1' }] },
  }
  const kData = mockKandidaatData[kandidaat.id] || { salarisMin: 4000, salarisMax: 5500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' as const }, { taal: 'Engels', niveau: 'B1' as const }] }
  const hardeCriteriaResult = vacature.hardeCriteria ? calculateHardeCriteriaMatch(vacature.hardeCriteria, {
    opleidingsniveau: kandidaat.opleidingsniveau,
    werkervaring: kandidaat.werkervaring,
    ...kData,
  }) : null
  const failedCriteria = hardeCriteriaResult?.criteria.filter(c => !c.voldaan) || []

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleAcceptContract = () => {
    setContractAccepted(true)
    setUnlocked(true)
    setProcesStatus('gesprek_plannen')
    setShowContractModal(false)
  }

  const handlePlanGesprek = () => {
    if (!newGesprekDatum) return
    const gesprek: Gesprek = {
      id: `g-new-${Date.now()}`,
      type: newGesprekType,
      datum: newGesprekDatum,
      status: 'gepland',
    }
    setGesprekken([...gesprekken, gesprek])
    setProcesStatus('gesprek_gepland')
    setShowPlanModal(false)
    setNewGesprekDatum('')
  }

  const handleMarkGesprekDone = (gesprekId: string) => {
    setGesprekken(gesprekken.map(g => g.id === gesprekId ? { ...g, status: 'afgerond' as const } : g))
    setProcesStatus('feedback_geven')
  }

  const handleSubmitFeedback = (gesprekId: string) => {
    if (!feedbackText) return
    setGesprekken(gesprekken.map(g =>
      g.id === gesprekId ? { ...g, feedback: feedbackText, rating: feedbackRating || undefined } : g
    ))
    setProcesStatus('vervolggesprek')
    setFeedbackText('')
    setFeedbackRating(0)
  }

  const handleStartArbeidsvoorwaarden = () => {
    setProcesStatus('arbeidsvoorwaarden')
    setNewGesprekType('arbeidsvoorwaarden')
  }

  const handleContractGetekend = () => {
    setProcesStatus('contract_getekend')
    setShowCelebrateModal(true)
  }

  const handleReject = () => {
    if (!rejectReason || rejectRating === 0) return
    setIsRejected(true)
    setProcesStatus('afgewezen')
    setShowRejectModal(false)
  }

  // ─── Star rating component ─────────────────────────────────────────────────
  const StarRating = ({ value, onChange, size = 'md' }: { value: number; onChange: (v: number) => void; size?: 'sm' | 'md' }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} onClick={() => onChange(star)}
          className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} transition-colors ${star <= value ? 'text-yellow-400' : 'text-surface-border hover:text-yellow-300'}`}>
          ★
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm inline-flex items-center gap-1 transition-colors">
        ← Terug naar dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple/20 text-purple flex items-center justify-center text-lg font-bold">
              {kandidaat.initialen}
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">
                {unlocked ? kandidaat.naam : `Kandidaat ${kandidaat.initialen}`}
              </h1>
              <p className="text-ink-light text-sm">{vacature.title} · {vacature.company}</p>
            </div>
          </div>
        </div>
        {!isRejected && procesStatus !== 'contract_getekend' && (
          <button onClick={() => { setRejectRating(minRating > 0 ? minRating : 0); setShowRejectModal(true) }}
            className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors">
            Afwijzen
          </button>
        )}
      </div>

      {/* Pipeline tracker */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-xs font-medium text-ink-muted mb-4 uppercase tracking-wider">Voortgang</h2>
        <PipelineTracker currentStatus={procesStatus} isRejected={isRejected} />
      </div>

      {/* M-Score + Criteria */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted mb-2">M-Score</p>
          <div className="flex items-center gap-3">
            <FitScore score={kandidaat.deVriesFit} size="lg" />
            <div>
              <p className="text-ink font-semibold">{kandidaat.deVriesFit}%</p>
              <p className="text-xs text-ink-muted">Culturele match</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted mb-2">Harde Criteria</p>
          <div className="flex items-center gap-3">
            <FitScore score={kandidaat.hardeCriteriaMatch} size="lg" />
            <div>
              <HardeCriteriaDetail kandidaat={kandidaat} hardeCriteria={vacature?.hardeCriteria} size="lg" />
              <p className="text-xs text-ink-muted">{kandidaat.opleidingsniveau} · {kandidaat.werkervaring}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scout Toelichting ──────────────────────────────────────────────── */}
      <div className="bg-purple/5 rounded-2xl border border-purple/20 p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-purple/20 text-purple flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
            {kandidaat.scoutNaam.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-semibold text-ink">Toelichting van {kandidaat.scoutNaam}</h2>
              <span className="text-[10px] text-ink-muted bg-surface-muted px-1.5 py-0.5 rounded">Talent Scout</span>
            </div>
            <p className="text-sm text-ink-light leading-relaxed">{cv.scoutToelichting}</p>
          </div>
        </div>
      </div>

      {/* ─── Harde Criteria Detail (afwijkingen prominent) ──────────────────── */}
      {hardeCriteriaResult && (
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Harde Criteria Match — {kandidaat.hardeCriteriaMatch}%</h2>
          <div className="space-y-2">
            {hardeCriteriaResult.criteria.map((c, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${
                c.voldaan ? 'bg-green-50/50' : 'bg-red-50 border border-red-100'
              }`}>
                <span className={`text-base flex-shrink-0 ${c.voldaan ? 'text-green-500' : 'text-red-400'}`}>
                  {c.voldaan ? '✓' : '✕'}
                </span>
                <span className={`font-medium flex-shrink-0 w-28 ${c.voldaan ? 'text-ink' : 'text-red-700'}`}>
                  {c.naam}
                </span>
                <span className={`flex-1 ${c.voldaan ? 'text-ink-light' : 'text-red-600'}`}>
                  {c.detail}
                </span>
              </div>
            ))}
          </div>
          {failedCriteria.length > 0 && (
            <div className="mt-3 pt-3 border-t border-surface-border">
              <p className="text-xs text-orange font-medium">
                ⚠ {failedCriteria.length} {failedCriteria.length === 1 ? 'criterium wijkt af' : 'criteria wijken af'} — overweeg of dit acceptabel is voor deze rol.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── CV / Profiel ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">Curriculum Vitae</h2>

        {/* Samenvatting */}
        <div>
          <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">Profiel</h3>
          <p className="text-sm text-ink-light leading-relaxed">{cv.samenvatting}</p>
        </div>

        {/* Werkervaring */}
        <div>
          <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-3">Werkervaring</h3>
          <div className="space-y-4">
            {cv.werkervaring.map((w, i) => (
              <div key={i} className="relative pl-5 border-l-2 border-purple/20">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-purple" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{w.functie}</p>
                    <p className="text-xs text-purple font-medium">{w.bedrijf}</p>
                  </div>
                  <span className="text-xs text-ink-muted flex-shrink-0 ml-4">{w.periode}</span>
                </div>
                <p className="text-sm text-ink-light mt-1 leading-relaxed">{w.beschrijving}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Opleiding */}
        <div>
          <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-3">Opleiding</h3>
          <div className="space-y-3">
            {cv.opleiding.map((o, i) => (
              <div key={i} className="relative pl-5 border-l-2 border-cyan/20">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{o.titel}</p>
                    <p className="text-xs text-cyan font-medium">{o.instelling}</p>
                    {o.extra && <p className="text-xs text-ink-muted mt-0.5">{o.extra}</p>}
                  </div>
                  <span className="text-xs text-ink-muted flex-shrink-0 ml-4">{o.jaar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vaardigheden + Talen in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">Vaardigheden</h3>
            <div className="flex flex-wrap gap-1.5">
              {cv.vaardigheden.map((v, i) => (
                <span key={i} className="px-2.5 py-1 bg-surface-muted text-ink text-xs rounded-lg border border-surface-border">{v}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">Talen</h3>
            <div className="space-y-1.5">
              {cv.talen.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{t.taal}</span>
                  <span className="text-ink-muted text-xs">{t.niveau}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificeringen */}
        {cv.certificeringen && cv.certificeringen.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">Certificeringen</h3>
            <div className="flex flex-wrap gap-1.5">
              {cv.certificeringen.map((c, i) => (
                <span key={i} className="px-2.5 py-1 bg-cyan/10 text-cyan text-xs rounded-lg border border-cyan/20 font-medium">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact details (only when unlocked) */}
      {unlocked && (
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <h2 className="text-sm font-medium text-ink mb-3">Contactgegevens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-ink-muted text-xs">Email</p>
              <p className="text-ink font-medium">{kandidaat.email || 'anna.dejong@email.nl'}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">Telefoon</p>
              <p className="text-ink font-medium">{kandidaat.telefoon || '06-12345678'}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">Woonplaats</p>
              <p className="text-ink font-medium">{kandidaat.woonplaats}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">Scout</p>
              <p className="text-ink font-medium">{kandidaat.scoutNaam}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 1: Profiel bekijken → Contract accepteren ─────────────────────── */}
      {procesStatus === 'voorgesteld' && !contractAccepted && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Kandidaat voorgesteld door {kandidaat.scoutNaam}</h2>
              <p className="text-ink-light text-sm mt-1">
                Om de contactgegevens van deze kandidaat te ontvangen, dient u akkoord te gaan met de plaatsingsovereenkomst.
                U betaalt alleen bij een succesvolle plaatsing (no cure, no pay).
              </p>
            </div>
          </div>

          <div className="bg-surface-muted rounded-xl p-4">
            <h3 className="text-sm font-medium text-ink mb-2">Plaatsingsvoorwaarden</h3>
            <div className="space-y-2 text-sm text-ink-light">
              <div className="flex justify-between">
                <span>Plaatsingsfee bij aanname (excl. BTW)</span>
                <span className="text-ink font-semibold">€{fee.fee.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span>Betaalmoment</span>
                <span className="text-ink">Na ondertekening arbeidsovereenkomst</span>
              </div>
              <div className="flex justify-between">
                <span>Fit Garantie</span>
                <span className="text-ink">12 maanden (bij M-Score ≥80%)</span>
              </div>
            </div>
          </div>

          <button onClick={() => setShowContractModal(true)}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            Bekijk contract en ga akkoord →
          </button>
        </div>
      )}

      {/* ─── Step 2: Gesprek plannen ────────────────────────────────────────────── */}
      {procesStatus === 'gesprek_plannen' && (
        <div className="bg-white rounded-2xl border-2 border-orange/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Plan een kennismakingsgesprek</h2>
              <p className="text-ink-light text-sm mt-1">
                Neem contact op met {unlocked ? kandidaat.naam : `Kandidaat ${kandidaat.initialen}`} en plan een gesprek. Voer de datum hieronder in.
              </p>
            </div>
          </div>

          <button onClick={() => { setNewGesprekType('kennismaking'); setShowPlanModal(true) }}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            Gespreksdatum invoeren →
          </button>
        </div>
      )}

      {/* ─── Step 3: Gesprek gepland ────────────────────────────────────────────── */}
      {procesStatus === 'gesprek_gepland' && lastGesprek && (
        <div className="bg-white rounded-2xl border-2 border-blue-300/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {lastGesprek.type === 'kennismaking' ? 'Kennismakingsgesprek' :
                 lastGesprek.type === 'verdieping' ? 'Verdiepingsgesprek' : 'Arbeidsvoorwaardengesprek'} gepland
              </h2>
              <p className="text-ink-light text-sm mt-1">
                Op <strong className="text-ink">{new Date(lastGesprek.datum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </p>
            </div>
          </div>

          <button onClick={() => handleMarkGesprekDone(lastGesprek.id)}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            Gesprek is afgerond — geef feedback →
          </button>
        </div>
      )}

      {/* ─── Step 4: Feedback geven ─────────────────────────────────────────────── */}
      {procesStatus === 'feedback_geven' && lastGesprek && (
        <div className="bg-white rounded-2xl border-2 border-yellow-300/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Hoe ging het gesprek?</h2>
              <p className="text-ink-light text-sm mt-1">
                Geef feedback over het {lastGesprek.type === 'kennismaking' ? 'kennismakings' : lastGesprek.type === 'verdieping' ? 'verdiepings' : 'arbeidsvoorwaarden'}gesprek.
                Dit helpt de Talent Scout u de volgende keer nog beter van dienst te zijn.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Beoordeling</label>
            <StarRating value={feedbackRating} onChange={setFeedbackRating} />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Feedback *</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              placeholder="Hoe verliep het gesprek? Wat viel op?"
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none"
            />
          </div>

          <button onClick={() => handleSubmitFeedback(lastGesprek.id)}
            disabled={!feedbackText}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Feedback opslaan →
          </button>
        </div>
      )}

      {/* ─── Step 5: Vervolg bepalen ────────────────────────────────────────────── */}
      {procesStatus === 'vervolggesprek' && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Wat is de volgende stap?</h2>
              <p className="text-ink-light text-sm mt-1">
                Kies hoe u verder wilt met {unlocked ? kandidaat.naam : `Kandidaat ${kandidaat.initialen}`}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={() => { setNewGesprekType('verdieping'); setShowPlanModal(true) }}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-cyan/5 hover:border-cyan/30 border border-surface-border transition-colors">
              <span className="text-lg">🤝</span>
              <p className="text-sm font-medium text-ink mt-2">Vervolggesprek plannen</p>
              <p className="text-xs text-ink-muted mt-1">Plan nog een gesprek met de kandidaat</p>
            </button>
            <button onClick={handleStartArbeidsvoorwaarden}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-green-50 hover:border-green-300 border border-surface-border transition-colors">
              <span className="text-lg">💼</span>
              <p className="text-sm font-medium text-ink mt-2">Arbeidsvoorwaarden bespreken</p>
              <p className="text-xs text-ink-muted mt-1">Ga naar de onderhandelingsfase</p>
            </button>
            <button onClick={() => { setRejectRating(minRating > 0 ? minRating : 0); setShowRejectModal(true) }}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-red-50 hover:border-red-300 border border-surface-border transition-colors">
              <span className="text-lg">✕</span>
              <p className="text-sm font-medium text-ink mt-2">Afwijzen</p>
              <p className="text-xs text-ink-muted mt-1">Deze kandidaat past niet</p>
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 6: Arbeidsvoorwaarden ─────────────────────────────────────────── */}
      {procesStatus === 'arbeidsvoorwaarden' && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💼</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Arbeidsvoorwaarden</h2>
              <p className="text-ink-light text-sm mt-1">
                U bent in gesprek over de arbeidsvoorwaarden met {unlocked ? kandidaat.naam : `Kandidaat ${kandidaat.initialen}`}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button onClick={handleContractGetekend}
              className="p-4 bg-green-50 rounded-xl text-left hover:bg-green-100 border border-green-200 transition-colors">
              <span className="text-2xl">🎉</span>
              <p className="text-sm font-semibold text-green-700 mt-2">Contract getekend!</p>
              <p className="text-xs text-green-600 mt-1">De kandidaat heeft het contract ondertekend</p>
            </button>
            <button onClick={() => { setNewGesprekType('arbeidsvoorwaarden'); setShowPlanModal(true) }}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-cyan/5 border border-surface-border transition-colors">
              <span className="text-lg">📅</span>
              <p className="text-sm font-medium text-ink mt-2">Nog een gesprek plannen</p>
              <p className="text-xs text-ink-muted mt-1">Nog niet rond — plan een vervolggesprek</p>
            </button>
          </div>
        </div>
      )}

      {/* ─── Contract getekend! ─────────────────────────────────────────────────── */}
      {procesStatus === 'contract_getekend' && (
        <div className="bg-gradient-to-br from-green-50 to-cyan/10 rounded-2xl border-2 border-green-300 p-8 text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-2xl font-bold text-ink">Succesvolle match!</h2>
          <p className="text-ink-light max-w-md mx-auto">
            {kandidaat.naam} is aangenomen als {vacature.title} bij {vacature.company}.
            De Fit Garantie van 12 maanden is nu actief.
          </p>
          <div className="bg-white rounded-xl p-4 max-w-sm mx-auto">
            <p className="text-xs text-ink-muted">Plaatsingsfee (excl. BTW)</p>
            <p className="text-2xl font-bold text-ink">€{fee.fee.toLocaleString('nl-NL')}</p>
            <p className="text-xs text-ink-muted mt-1">+ 21% BTW. Wordt geïncasseerd via uw creditcard.</p>
          </div>
        </div>
      )}

      {/* ─── Afgewezen ──────────────────────────────────────────────────────────── */}
      {isRejected && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✕</span>
            <div>
              <h2 className="text-lg font-semibold text-red-700">Kandidaat afgewezen</h2>
              <p className="text-red-600 text-sm mt-1">
                {afwijzingsRedenen.find(r => r.key === rejectReason)?.label}
                {rejectNote && ` — "${rejectNote}"`}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`text-sm ${s <= rejectRating ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                ))}
                <span className="text-xs text-ink-muted ml-1">Scout rating</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Gesprekken timeline ─────────────────────────────────────────────────── */}
      {gesprekken.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-sm font-medium text-ink-muted mb-4">Gespreksverloop</h2>
          <div className="space-y-4">
            {gesprekken.map((g, i) => (
              <div key={g.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    g.status === 'afgerond' ? 'bg-green-100 text-green-600' :
                    g.status === 'gepland' ? 'bg-blue-100 text-blue-600' : 'bg-surface-muted text-ink-muted'
                  }`}>
                    {g.status === 'afgerond' ? '✓' : g.status === 'gepland' ? '📅' : '—'}
                  </div>
                  {i < gesprekken.length - 1 && <div className="w-px h-full bg-surface-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink">
                      {g.type === 'kennismaking' ? 'Kennismakingsgesprek' :
                       g.type === 'verdieping' ? 'Verdiepingsgesprek' : 'Arbeidsvoorwaardengesprek'}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      g.status === 'afgerond' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {g.status === 'afgerond' ? 'Afgerond' : 'Gepland'}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {new Date(g.datum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  {g.feedback && (
                    <div className="mt-2 bg-surface-muted rounded-lg p-3">
                      <p className="text-sm text-ink-light">{g.feedback}</p>
                      {g.rating && (
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`text-xs ${s <= g.rating! ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Contract Modal ──────────────────────────────────────────────────────── */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-purple/5 p-6 border-b border-surface-border">
              <h2 className="text-xl font-bold text-ink">Plaatsingsovereenkomst</h2>
              <p className="text-ink-light text-sm mt-1">Lees de voorwaarden en ga akkoord om de contactgegevens te ontsluiten.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-surface-muted rounded-xl p-4 space-y-3 text-sm text-ink-light">
                <p><strong className="text-ink">Artikel 1 — No cure, no pay</strong><br />U betaalt alleen een plaatsingsfee bij daadwerkelijke start van de kandidaat.</p>
                <p><strong className="text-ink">Artikel 2 — Plaatsingsfee</strong><br />De fee bedraagt {'\u20AC'}{fee.fee.toLocaleString('nl-NL')} excl. BTW, gebaseerd op opleidingsniveau ({kandidaat.opleidingsniveau}) en werkervaring ({kandidaat.werkervaring}).</p>
                <p><strong className="text-ink">Artikel 3 — Fit Garantie</strong><br />Bij een M-Score van {'\u2265'}80% geldt een Fit Garantie van 12 maanden. Vertrekt de medewerker binnen die periode — ook op eigen initiatief — dan levert Refurzy eenmalig gratis een vervangende kandidaat. Uitsluitingen: afwijkende werkzaamheden, mismanagement of reorganisatie. Refurzy voert een exitgesprek met de kandidaat ter beoordeling.</p>
                <p><strong className="text-ink">Artikel 4 — Betaling</strong><br />De fee wordt gefactureerd op de eerste werkdag van de kandidaat. Beide partijen bevestigen de start via het platform.</p>
                <p><strong className="text-ink">Artikel 5 — Terugtrekking</strong><br />Trekt de kandidaat zich v{'\u00F3\u00F3'}r de startdatum terug: geen kosten. Trekt u zich terug: 50% van de fee.</p>
              </div>

              {/* Creditcard gegevens */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-ink">Betaalgegevens</h3>
                <div>
                  <label className="block text-xs text-ink-muted mb-1">Creditcardnummer</label>
                  <input type="text" value={creditcardNummer} onChange={(e) => setCreditcardNummer(e.target.value)}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-ink-muted mb-1">Vervaldatum (MM/JJ)</label>
                    <input type="text" value={creditcardExpiry} onChange={(e) => setCreditcardExpiry(e.target.value)}
                      placeholder="MM/JJ" maxLength={5}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-ink-muted mb-1">CVC</label>
                    <input type="text" value={creditcardCvc} onChange={(e) => setCreditcardCvc(e.target.value)}
                      placeholder="123" maxLength={4}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50" />
                  </div>
                </div>
              </div>

              {/* Ondertekening */}
              <div className="space-y-3 border-t border-surface-border pt-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Uw naam (ter ondertekening)</label>
                  <input type="text" value={ondertekeningNaam} onChange={(e) => setOndertekeningNaam(e.target.value)}
                    placeholder="Volledige naam"
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50" />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Door hieronder uw naam in te vullen en te klikken op &lsquo;Onderteken&rsquo;, gaat u digitaal akkoord met de bovenstaande plaatsingsovereenkomst. Dit contract wordt opgeslagen en is te downloaden via Mijn Contracten.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowContractModal(false)}
                  className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                  Annuleren
                </button>
                <button onClick={handleAcceptContract}
                  disabled={!ondertekeningNaam.trim()}
                  className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Onderteken plaatsingsovereenkomst
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Plan gesprek modal ──────────────────────────────────────────────────── */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-ink">
              {newGesprekType === 'kennismaking' ? 'Kennismakingsgesprek plannen' :
               newGesprekType === 'verdieping' ? 'Verdiepingsgesprek plannen' : 'Arbeidsvoorwaardengesprek plannen'}
            </h2>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Datum en tijd *</label>
              <input type="datetime-local" value={newGesprekDatum} onChange={(e) => setNewGesprekDatum(e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPlanModal(false)}
                className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                Annuleren
              </button>
              <button onClick={handlePlanGesprek} disabled={!newGesprekDatum}
                className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40">
                Gesprek plannen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Reject modal ────────────────────────────────────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-ink">Kandidaat afwijzen</h2>
            <p className="text-ink-light text-sm">Uw beoordeling helpt de Talent Scout beter te matchen in de toekomst.</p>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Reden van afwijzing *</label>
              <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value as AfwijzingsReden)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
                <option value="">Selecteer een reden</option>
                {afwijzingsRedenen.map(r => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Beoordeling scout *</label>
              {procesStatus === 'arbeidsvoorwaarden' ? (
                <>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-2xl ${star <= 4 ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-xs text-green-600 mt-1">Automatisch 4 sterren — kandidaat bereikte arbeidsvoorwaarden fase</p>
                </>
              ) : (
                <>
                  <StarRating value={rejectRating} onChange={(v) => setRejectRating(Math.max(v, minRating))} />
                  {minRating >= 3 ? (
                    <p className="text-xs text-ink-muted mt-1">Minimaal {minRating} sterren — kandidaat kwam tot gespreksfase</p>
                  ) : (
                    <p className="text-xs text-ink-muted mt-1">Hoe goed was de voordracht van de scout?</p>
                  )}
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Toelichting</label>
              <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={2}
                placeholder="Optioneel: geef extra context"
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                Annuleren
              </button>
              <button onClick={handleReject} disabled={!rejectReason || rejectRating === 0}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-40">
                Afwijzen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Celebrate modal ─────────────────────────────────────────────────────── */}
      {showCelebrateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-br from-cyan via-blue-500 to-purple p-8 text-center text-white">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold">Gefeliciteerd!</h2>
              <p className="text-white/90 mt-2">{kandidaat.naam} wordt de nieuwe {vacature.title} bij {vacature.company}!</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-surface-muted rounded-xl p-4 space-y-2 text-sm">
                <p className="text-ink-muted">📧 E-mails worden verstuurd naar:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">Opdrachtgever</p>
                    <p className="text-ink-muted">Welkom & onboarding tips</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">Kandidaat</p>
                    <p className="text-ink-muted">Felicitatie & eerste werkdag</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">Scout</p>
                    <p className="text-ink-muted">Fee bevestiging & uitbetaling</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-700">Fit Garantie actief</p>
                    <p className="text-xs text-green-600">12 maanden bescherming bij M-Score ≥80%</p>
                  </div>
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
              <button onClick={() => setShowCelebrateModal(false)}
                className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
