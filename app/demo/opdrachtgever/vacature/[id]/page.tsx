'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { vacatures } from '@/lib/mock-data'
import { KandidaatMatch, AfwijzingsReden } from '@/lib/types'
import { afwijzingsRedenen } from '@/lib/mock-data'
import FitScore from '@/components/FitScore'
import StarRating from '@/components/StarRating'
// StatusBadge removed — scores tell the full story
import HardeCriteriaDetail from '@/components/HardeCriteriaDetail'
import Link from 'next/link'
import { logConsent } from '@/lib/consent-log'
import { MASTER_SCOUT_THRESHOLD } from '@/lib/constants'
import FraudReportModal from '@/components/FraudReportModal'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    backToDashboard: '← Terug naar dashboard',
    deadline: 'Deadline',
    exclusivityLabel: 'Exclusiviteit',
    exclusivityActive: '2 weken actief — +25%',
    exclusivityInactive: 'Niet actief',
    exclusivityBannerTitle: 'Exclusiviteitsperiode actief — 25% premium',
    exclusivityBannerText: 'Kandidaten zijn 2 weken exclusief voor u beschikbaar. De bemiddelingsvergoeding wordt met 25% verhoogd. Dit premium bedrag gaat volledig naar de Talent Scout.',
    scoreLegendTitle: 'Score legenda:',
    scoreMScore: 'M-Score',
    scoreMScoreDesc: '= uitkomst 35-vragen Matching Scan',
    scoreDiscount: '50% korting',
    scoreDiscountDesc: '= eerste voordracht / nieuwe scout zonder track record',
    candidatesTitle: (n: number) => `Kandidaten (${n})`,
    colKandidaat: 'Kandidaat',
    colHardeCriteria: 'Harde Criteria',
    colMScore: 'M-Score',
    colScoutRating: 'Scout Rating',
    colActies: 'Acties',
    via: 'via',
    masterBadge: 'MASTER',
    firstNominationBadge: 'EERSTE VOORDRACHT — 50% KORTING',
    discountBadge: '50% KORTING',
    viewProcess: 'Bekijk proces →',
    viewUnlock: 'Bekijk & ontgrendel →',
    reject: 'Afwijzen',
    noCandidates: 'Nog geen kandidaten voor deze vacature',
    vacancyDescTitle: 'Vacaturebeschrijving',
    edit: 'Bewerken',
    cancel: 'Annuleren',
    save: 'Opslaan',
    descSaved: '✓ Vacaturebeschrijving opgeslagen',
    mScoreProfileTitle: 'M-Score Profiel',
    orgProfile: 'Organisatieprofiel',
    jobActivities: 'Werkzaamheden (vac.)',
    filled: 'Ingevuld',
    view: 'Bekijken',
    editShort: 'Bewerken',
    profileComplete: 'Volledig — kandidaten worden gematcht',
    hardeCriteriaTitle: 'Harde Criteria',
    criteriaOpleiding: 'Opleiding',
    criteriaErvaring: 'Ervaring',
    criteriaLocatie: 'Locatie',
    criteriaOpKantoor: 'Op kantoor',
    criteriaMaxReistijd: 'Max reistijd',
    criteriaSalaris: 'Salaris',
    requiredLanguages: 'Vereiste talen',
    contractModalTitle: 'Profiel ontgrendelen',
    contractModalSubtitle: 'Om het profiel en contactgegevens te bekijken, gaat u akkoord met de plaatsingsovereenkomst. Het ontgrendelen is kosteloos — u betaalt alleen bij een succesvolle match.',
    discountBannerTitle: '50% introductiekorting!',
    discountBannerText: 'Deze Talent Scout doet zijn/haar eerste bemiddeling via Refurzy en heeft daarom nog geen reputatiescore. Om u te laten kennismaken betaalt u slechts de helft van de plaatsingsfee bij een succesvolle match.',
    placementAgreement: 'Plaatsingsovereenkomst',
    contractBullet1: 'Het ontgrendelen van het profiel is',
    contractBullet1Bold: 'kosteloos',
    contractBullet2: 'U betaalt',
    contractBullet2Bold: 'alleen bij een succesvolle plaatsing',
    contractBullet2End: '(ondertekend arbeidscontract).',
    contractBullet3: (newScout: boolean) => `De plaatsingsfee is afhankelijk van opleidingsniveau en werkervaring${newScout ? ' (50% introductiekorting toegepast)' : ''}.`,
    contractBullet4: 'Bemiddeling buiten het platform om resulteert in een boete van 100% van de vergoeding.',
    contractBullet5: 'Bij M-Score ≥80% geldt de',
    contractBullet5Bold: 'Fit Garantie',
    contractBullet5End: '(12 maanden, uitsluitend bij aantoonbare fit-mismatch).',
    agreeCheckbox: 'Ik ga akkoord met de',
    placementOvereenkomst: 'Plaatsingsovereenkomst',
    penaltyAnd: 'het penalty-beding en de',
    avgLink: 'AVG-bepalingen',
    cancelBtn: 'Annuleren',
    agreeViewProfile: 'Akkoord & profiel bekijken',
    rejectModalTitle: 'Kandidaat afwijzen',
    rejectReasonLabel: 'Reden van afwijzing *',
    rejectReasonPlaceholder: 'Selecteer een reden',
    rejectScoutRatingLabel: 'Beoordeling scout *',
    autoRatingText: 'Automatisch 4 sterren — kandidaat bereikte arbeidsvoorwaarden fase',
    minRatingText: (n: number) => `Minimaal ${n} sterren — kandidaat kwam tot gespreksfase`,
    scoutQualityText: 'Hoe goed was de voordracht van de scout?',
    rejectNoteLabel: 'Toelichting',
    rejectNotePlaceholder: 'Optioneel: geef extra context',
    rejectBtn: 'Afwijzen',
    toastUnlocked: 'Profiel ontgrendeld — plaatsingsovereenkomst getekend!',
    toastRejected: 'Kandidaat afgewezen — feedback opgeslagen',
    notFound: 'Vacature niet gevonden',
    anonimous: (initialen: string) => `Kandidaat ${initialen}`,
    btnReportScout: 'Melden',
  },
  en: {
    backToDashboard: '← Back to dashboard',
    deadline: 'Deadline',
    exclusivityLabel: 'Exclusivity',
    exclusivityActive: '2 weeks active — +25%',
    exclusivityInactive: 'Not active',
    exclusivityBannerTitle: 'Exclusivity period active — 25% premium',
    exclusivityBannerText: 'Candidates are exclusively available to you for 2 weeks. The placement fee is increased by 25%. This premium goes entirely to the Talent Scout.',
    scoreLegendTitle: 'Score legend:',
    scoreMScore: 'M-Score',
    scoreMScoreDesc: '= result of 35-question Matching Scan',
    scoreDiscount: '50% discount',
    scoreDiscountDesc: '= first nomination / new scout without track record',
    candidatesTitle: (n: number) => `Candidates (${n})`,
    colKandidaat: 'Candidate',
    colHardeCriteria: 'Hard Criteria',
    colMScore: 'M-Score',
    colScoutRating: 'Scout Rating',
    colActies: 'Actions',
    via: 'via',
    masterBadge: 'MASTER',
    firstNominationBadge: 'FIRST NOMINATION — 50% DISCOUNT',
    discountBadge: '50% DISCOUNT',
    viewProcess: 'View process →',
    viewUnlock: 'View & unlock →',
    reject: 'Reject',
    noCandidates: 'No candidates for this vacancy yet',
    vacancyDescTitle: 'Vacancy description',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    descSaved: '✓ Vacancy description saved',
    mScoreProfileTitle: 'M-Score Profile',
    orgProfile: 'Organisation profile',
    jobActivities: 'Job activities (vac.)',
    filled: 'Filled in',
    view: 'View',
    editShort: 'Edit',
    profileComplete: 'Complete — candidates are being matched',
    hardeCriteriaTitle: 'Hard Criteria',
    criteriaOpleiding: 'Education',
    criteriaErvaring: 'Experience',
    criteriaLocatie: 'Location',
    criteriaOpKantoor: 'In office',
    criteriaMaxReistijd: 'Max commute',
    criteriaSalaris: 'Salary',
    requiredLanguages: 'Required languages',
    contractModalTitle: 'Unlock profile',
    contractModalSubtitle: 'To view the profile and contact details, you agree to the placement agreement. Unlocking is free — you only pay upon a successful match.',
    discountBannerTitle: '50% introductory discount!',
    discountBannerText: 'This Talent Scout is making their first placement via Refurzy and therefore has no reputation score yet. As an introduction you pay only half the placement fee upon a successful match.',
    placementAgreement: 'Placement Agreement',
    contractBullet1: 'Unlocking the profile is',
    contractBullet1Bold: 'free of charge',
    contractBullet2: 'You pay',
    contractBullet2Bold: 'only upon a successful placement',
    contractBullet2End: '(signed employment contract).',
    contractBullet3: (newScout: boolean) => `The placement fee is based on education level and work experience${newScout ? ' (50% introductory discount applied)' : ''}.`,
    contractBullet4: 'Mediation outside the platform results in a penalty of 100% of the fee.',
    contractBullet5: 'With an M-Score ≥80% the',
    contractBullet5Bold: 'Fit Guarantee',
    contractBullet5End: 'applies (12 months, only in case of demonstrable fit mismatch).',
    agreeCheckbox: 'I agree to the',
    placementOvereenkomst: 'Placement Agreement',
    penaltyAnd: 'the penalty clause and the',
    avgLink: 'GDPR provisions',
    cancelBtn: 'Cancel',
    agreeViewProfile: 'Agree & view profile',
    rejectModalTitle: 'Reject candidate',
    rejectReasonLabel: 'Reason for rejection *',
    rejectReasonPlaceholder: 'Select a reason',
    rejectScoutRatingLabel: 'Scout rating *',
    autoRatingText: 'Automatic 4 stars — candidate reached employment terms phase',
    minRatingText: (n: number) => `Minimum ${n} stars — candidate reached interview phase`,
    scoutQualityText: 'How good was the scout\'s nomination?',
    rejectNoteLabel: 'Notes',
    rejectNotePlaceholder: 'Optional: provide additional context',
    rejectBtn: 'Reject',
    toastUnlocked: 'Profile unlocked — placement agreement signed!',
    toastRejected: 'Candidate rejected — feedback saved',
    notFound: 'Vacancy not found',
    anonimous: (initialen: string) => `Candidate ${initialen}`,
    btnReportScout: 'Report',
  },
}

export default function VacatureDetailPage() {
  const params = useParams()
  const { lang } = useLang()
  const t = texts[lang]

  const vacature = vacatures.find((v) => v.id === params.id)
  const [kandidaten, setKandidaten] = useState<KandidaatMatch[]>(vacature?.kandidaten ?? [])
  const [contractModal, setContractModal] = useState<string | null>(null)
  const [akkoord, setAkkoord] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [exclusief, setExclusief] = useState(false)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectRating, setRejectRating] = useState(0)
  const [rejectReason, setRejectReason] = useState<AfwijzingsReden | ''>('')
  const [rejectNote, setRejectNote] = useState('')
  const [fraudScout, setFraudScout] = useState<{ name: string } | null>(null)
  const [editing, setEditing] = useState(false)
  const [beschrijving, setBeschrijving] = useState(
    `We zoeken een ervaren ${vacature?.title || 'professional'} die ons team versterkt. De ideale kandidaat combineert vakkennis met een sterke culturele fit.\n\nWat ga je doen?\n• Verantwoordelijk voor het ontwikkelen en uitvoeren van de ${vacature?.title || ''} strategie\n• Samenwerken met interne stakeholders en externe partners\n• Bijdragen aan de groeidoelstellingen van de organisatie\n• Rapporteren aan het management team\n\nWat vragen wij?\n• Minimaal ${vacature?.hardeCriteria?.minimaleErvaring || '5 jaar'} relevante werkervaring\n• ${vacature?.hardeCriteria?.opleidingsniveau || 'HBO'} werk- en denkniveau\n• Uitstekende communicatieve vaardigheden in woord en geschrift\n• Proactieve houding en teamspeler\n\nWat bieden wij?\n• Salaris: ${vacature?.salaris || 'Marktconform'}\n• ${vacature?.hardeCriteria?.opKantoor || 'Hybride werken'}\n• 25 vakantiedagen + 13 ADV-dagen\n• Pensioenregeling en reiskostenvergoeding`
  )
  const [savedToast, setSavedToast] = useState(false)

  if (!vacature) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-ink-light">{t.notFound}</div>
      </div>
    )
  }

  const handleUnlock = (kandidaatId: string) => {
    // Log consent for plaatsingsovereenkomst
    logConsent('demo@bedrijf.nl', 'opdrachtgever', 'plaatsingsovereenkomst', true, 'checkbox')

    setKandidaten((prev) =>
      prev.map((k) => (k.id === kandidaatId ? { ...k, unlocked: true, anoniem: false } : k))
    )
    setContractModal(null)
    setAkkoord(false)
    setToast(t.toastUnlocked)
    setTimeout(() => setToast(null), 4000)
  }

  // Minimum scout rating based on pipeline phase reached
  const getMinRating = (procesStatus: string) => {
    if (['contract_akkoord', 'gesprek_plannen', 'gesprek_gepland', 'feedback_geven'].includes(procesStatus)) return 3
    if (procesStatus === 'arbeidsvoorwaarden') return 4
    return 0 // voorgesteld: no minimum
  }

  const openRejectModal = (kandidaatId: string) => {
    const k = kandidaten.find(c => c.id === kandidaatId)
    const min = k ? getMinRating(k.procesStatus) : 0
    setRejectModal(kandidaatId)
    setRejectRating(min > 0 ? min : 0)
    setRejectReason('')
    setRejectNote('')
  }

  const handleAfwijzen = () => {
    if (!rejectModal || !rejectReason || rejectRating === 0) return
    setKandidaten((prev) =>
      prev.map((k) =>
        k.id === rejectModal ? {
          ...k,
          status: 'afgewezen' as const,
          procesStatus: 'afgewezen' as const,
          afwijzingsReden: rejectReason as AfwijzingsReden,
          afwijzingsToelichting: rejectNote || undefined,
          afwijzingsRating: rejectRating,
        } : k
      )
    )
    setRejectModal(null)
    setToast(t.toastRejected)
    setTimeout(() => setToast(null), 4000)
  }

  // Sort by combined score: hard criteria (40%) + M-Score (40%) + scout rating normalized (20%)
  const sorted = [...kandidaten].sort((a, b) => {
    const scoreA = a.hardeCriteriaMatch * 0.4 + a.deVriesFit * 0.4 + (a.scoutRating / 5) * 100 * 0.2
    const scoreB = b.hardeCriteriaMatch * 0.4 + b.deVriesFit * 0.4 + (b.scoutRating / 5) * 100 * 0.2
    return scoreB - scoreA
  })

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-pulse">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          {t.backToDashboard}
        </Link>
        <div className="flex items-start justify-between mt-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{vacature.title}</h1>
            <p className="text-ink-light font-medium mt-1">{vacature.company} &middot; {vacature.location}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Exclusiviteit toggle */}
            <div className="bg-surface-muted rounded-xl border border-surface-border px-4 py-2 text-center">
              <p className="text-[10px] text-ink-muted mb-0.5">{t.exclusivityLabel}</p>
              <button
                onClick={() => setExclusief(!exclusief)}
                className={`text-xs font-semibold px-2 py-0.5 rounded ${exclusief ? 'bg-orange/15 text-orange border border-orange/30' : 'bg-purple/10 text-ink-light border border-surface-border'}`}
              >
                {exclusief ? t.exclusivityActive : t.exclusivityInactive}
              </button>
            </div>
            <div className="text-right">
              <div className="text-sm text-ink-light">{t.deadline}</div>
              <div className="text-ink font-semibold">{new Date(vacature.deadline).toLocaleDateString('nl-NL')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exclusiviteit banner */}
      {exclusief && (
        <div className="bg-orange/10 border border-orange/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-orange font-semibold text-sm">{t.exclusivityBannerTitle}</p>
            <p className="text-orange/70 text-xs">{t.exclusivityBannerText}</p>
          </div>
        </div>
      )}

      {/* Score legenda */}
      <div className="bg-white rounded-2xl border border-surface-border p-4 mb-6">
        <div className="flex items-center gap-6 text-xs text-ink-light">
          <span className="font-semibold text-ink">{t.scoreLegendTitle}</span>
          <span><span className="text-cyan font-medium">{t.scoreMScore}</span> {t.scoreMScoreDesc}</span>
          <span><span className="text-orange font-medium">{t.scoreDiscount}</span> {t.scoreDiscountDesc}</span>
        </div>
      </div>

      {/* Kandidaten tabel */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden mb-6">
        <div className="p-6 border-b border-surface-border">
          <h2 className="text-ink font-semibold">{t.candidatesTitle(kandidaten.length)}</h2>
        </div>

        <div className="hidden md:grid grid-cols-[2.5fr_1.2fr_1fr_1.2fr_1.5fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
          <div>{t.colKandidaat}</div>
          <div className="text-center">{t.colHardeCriteria}</div>
          <div className="text-center">{t.colMScore}</div>
          <div className="text-center">{t.colScoutRating}</div>
          <div className="text-right">{t.colActies}</div>
        </div>

        {sorted.map((k) => {
          const newScout = k.scoutRating < 4.0
          const isMaster = k.scoutRating >= MASTER_SCOUT_THRESHOLD

          return (
            <Link
              key={k.id}
              href={`/demo/opdrachtgever/vacature/${vacature.id}/kandidaat/${k.id}`}
              className="grid grid-cols-1 md:grid-cols-[2.5fr_1.2fr_1fr_1.2fr_1.5fr] gap-2 px-6 py-4 border-b border-surface-border items-center hover:bg-surface-muted transition-colors cursor-pointer"
            >
              {/* Kandidaat */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center text-purple font-bold text-sm">
                  {k.initialen}
                </div>
                <div>
                  <div className="text-ink font-medium text-sm">
                    {k.anoniem ? t.anonimous(k.initialen) : k.naam}
                  </div>
                  <div className="text-xs text-ink-muted flex items-center gap-1">
                    {t.via} {k.scoutNaam}
                    {isMaster && <span className="px-1 py-0.5 bg-orange/15 text-orange text-[9px] font-bold rounded border border-orange/30 ml-1">{t.masterBadge}</span>}
                    {k.eersteVoordracht && <span className="px-1 py-0.5 bg-green-500/15 text-green-400 text-[9px] font-bold rounded border border-green-500/30 ml-1">{t.firstNominationBadge}</span>}
                    {newScout && !k.eersteVoordracht && <span className="px-1 py-0.5 bg-green-500/15 text-green-400 text-[9px] font-bold rounded border border-green-500/30 ml-1">{t.discountBadge}</span>}
                  </div>
                </div>
              </div>

              {/* Harde Criteria */}
              <div className="flex items-center justify-center">
                <HardeCriteriaDetail kandidaat={k} hardeCriteria={vacature.hardeCriteria} size="sm" />
              </div>

              {/* M-Score */}
              <div className="flex justify-center">
                <FitScore score={k.deVriesFit} size="sm" />
              </div>

              {/* Scout Rating */}
              <div className="flex justify-center">
                <StarRating rating={k.scoutRating} />
              </div>

              {/* Acties */}
              <div className="flex justify-end gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
                {k.unlocked ? (
                  <span className="bg-cyan/15 text-cyan px-3 py-1.5 rounded-lg text-xs font-semibold border border-cyan/20">
                    {t.viewProcess}
                  </span>
                ) : (
                  <span className="bg-cyan text-navy-dark px-3 py-1.5 rounded-lg text-xs font-semibold">
                    {t.viewUnlock}
                  </span>
                )}
                {k.status !== 'afgewezen' && (
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); openRejectModal(k.id) }} className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20">
                    {t.reject}
                  </button>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFraudScout({ name: k.scoutNaam }) }}
                  className="bg-orange/10 text-orange border border-orange/20 px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange/20 transition-colors"
                  title={`${t.btnReportScout}: ${k.scoutNaam}`}
                >
                  🚨
                </button>
              </div>
            </Link>
          )
        })}

        {kandidaten.length === 0 && (
          <div className="p-12 text-center text-ink-muted">{t.noCandidates}</div>
        )}
      </div>

      {/* Vacaturebeschrijving */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-ink font-semibold">{t.vacancyDescTitle}</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple border border-purple/20 rounded-lg hover:bg-purple/5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              {t.edit}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-xs font-medium text-ink-light border border-surface-border rounded-lg hover:text-ink transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setSavedToast(true)
                  setTimeout(() => setSavedToast(false), 3000)
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-purple rounded-lg hover:bg-purple/90 transition-colors"
              >
                {t.save}
              </button>
            </div>
          )}
        </div>
        {editing ? (
          <textarea
            value={beschrijving}
            onChange={(e) => setBeschrijving(e.target.value)}
            className="w-full min-h-[280px] px-4 py-3 border border-surface-border rounded-xl text-sm text-ink leading-relaxed placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple resize-y"
          />
        ) : (
          <div className="text-sm text-ink-light leading-relaxed whitespace-pre-line">
            {beschrijving}
          </div>
        )}
      </div>

      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-purple text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-sm">
          {t.descSaved}
        </div>
      )}

      {/* M-Score Profiel Status */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-ink font-semibold mb-4">{t.mScoreProfileTitle}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-400">&#10003;</span>
              <span className="text-sm text-ink">{t.orgProfile}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400 font-medium">{t.filled}</span>
              <Link
                href="/demo/opdrachtgever/matching-profiel"
                className="text-xs text-purple font-medium hover:text-purple/80 transition-colors"
              >
                {t.view}
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-400">&#10003;</span>
              <span className="text-sm text-ink">{t.jobActivities}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400 font-medium">{t.filled}</span>
              <button className="text-xs text-purple font-medium hover:text-purple/80 transition-colors">
                {t.editShort}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-surface-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-green-400 font-medium">{t.profileComplete}</span>
          </div>
        </div>
      </div>

      {/* Harde Criteria Summary */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-ink font-semibold mb-4">{t.hardeCriteriaTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: t.criteriaOpleiding, value: vacature.hardeCriteria.opleidingsniveau },
            { label: t.criteriaErvaring, value: vacature.hardeCriteria.minimaleErvaring },
            { label: t.criteriaLocatie, value: vacature.hardeCriteria.locatie },
            { label: t.criteriaOpKantoor, value: vacature.hardeCriteria.opKantoor },
            { label: t.criteriaMaxReistijd, value: vacature.hardeCriteria.maxReistijd },
            { label: t.criteriaSalaris, value: vacature.salarisMin && vacature.salarisMax ? `€${vacature.salarisMin.toLocaleString('nl-NL')} – €${vacature.salarisMax.toLocaleString('nl-NL')}` : vacature.salaris },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs text-ink-muted mb-1">{item.label}</div>
              <div className="text-sm text-purple font-medium">{item.value}</div>
            </div>
          ))}
        </div>
        {vacature.hardeCriteria.talen && vacature.hardeCriteria.talen.length > 0 && (
          <div>
            <div className="text-xs text-ink-muted mb-2">{t.requiredLanguages}</div>
            <div className="flex flex-wrap gap-2">
              {vacature.hardeCriteria.talen.map((tl, i) => (
                <span key={i} className="px-2.5 py-1 bg-purple/10 text-purple text-xs rounded-lg font-medium border border-purple/20">
                  {tl.taal} — min. {tl.minimaalNiveau}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contract Modal */}
      {contractModal && (() => {
        const k = kandidaten.find(c => c.id === contractModal)
        const newScout = k ? k.scoutRating < 4.0 : false
        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-surface-border p-8 max-w-lg w-full shadow-2xl">
              <h3 className="text-xl font-bold text-ink mb-2">{t.contractModalTitle}</h3>
              <p className="text-ink-light font-medium text-sm mb-4">
                {t.contractModalSubtitle}
              </p>

              {newScout && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🎉</span>
                    <span className="text-green-600 font-bold text-sm">{t.discountBannerTitle}</span>
                  </div>
                  <p className="text-green-600/80 text-xs leading-relaxed">
                    {t.discountBannerText}
                  </p>
                </div>
              )}

              <div className="bg-surface-muted rounded-xl border border-surface-border p-4 mb-4 text-sm text-ink-light max-h-40 overflow-y-auto">
                <p className="font-semibold text-ink mb-2">{t.placementAgreement}</p>
                <ul className="space-y-1.5 text-xs leading-relaxed">
                  <li>• {t.contractBullet1} <span className="text-ink font-medium">{t.contractBullet1Bold}</span>.</li>
                  <li>• {t.contractBullet2} <span className="text-ink font-medium">{t.contractBullet2Bold}</span> {t.contractBullet2End}</li>
                  <li>• {t.contractBullet3(newScout)}</li>
                  <li>• {t.contractBullet4}</li>
                  <li>• {t.contractBullet5} <span className="text-ink font-medium">{t.contractBullet5Bold}</span> {t.contractBullet5End}</li>
                </ul>
              </div>

              <label className="flex items-start gap-3 mb-4 cursor-pointer group">
                <input type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-surface-muted accent-cyan" />
                <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
                  {t.agreeCheckbox}{' '}
                  <a href="/juridisch/plaatsingsovereenkomst" target="_blank" rel="noopener noreferrer" className="text-cyan underline hover:text-cyan/80">{t.placementOvereenkomst}</a>
                  {' '}(v1.0), {t.penaltyAnd}{' '}
                  <a href="/juridisch/privacybeleid" target="_blank" rel="noopener noreferrer" className="text-cyan underline hover:text-cyan/80">{t.avgLink}</a>
                </span>
              </label>

              <div className="flex gap-3">
                <button onClick={() => { setContractModal(null); setAkkoord(false) }} className="flex-1 bg-surface-muted border border-surface-border text-ink-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-ink transition-colors">
                  {t.cancelBtn}
                </button>
                <button onClick={() => handleUnlock(contractModal)} disabled={!akkoord} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${akkoord ? 'bg-cyan text-navy-dark hover:bg-cyan-light' : 'bg-surface-muted text-ink-muted cursor-not-allowed'}`}>
                  {t.agreeViewProfile}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ─── Reject Modal ──────────────────────────────────────────────────── */}
      {rejectModal && (() => {
        const k = kandidaten.find(c => c.id === rejectModal)
        if (!k) return null
        const minRating = getMinRating(k.procesStatus)
        const isAutoRating = k.procesStatus === 'arbeidsvoorwaarden'
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
              <h2 className="text-lg font-bold text-ink">{t.rejectModalTitle}</h2>
              <p className="text-ink-light text-sm">
                {k.anoniem ? t.anonimous(k.initialen) : k.naam} — {t.via} {k.scoutNaam}
              </p>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">{t.rejectReasonLabel}</label>
                <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value as AfwijzingsReden)}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
                  <option value="">{t.rejectReasonPlaceholder}</option>
                  {afwijzingsRedenen.map(r => (
                    <option key={r.key} value={r.key}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">{t.rejectScoutRatingLabel}</label>
                {isAutoRating ? (
                  <>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-2xl ${star <= 4 ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-green-600 mt-1">{t.autoRatingText}</p>
                  </>
                ) : (
                  <>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button"
                          onClick={() => setRejectRating(Math.max(star, minRating))}
                          className={`text-2xl transition-colors ${star <= rejectRating ? 'text-yellow-400' : 'text-surface-border hover:text-yellow-200'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                    {minRating >= 3 ? (
                      <p className="text-xs text-ink-muted mt-1">{t.minRatingText(minRating)}</p>
                    ) : (
                      <p className="text-xs text-ink-muted mt-1">{t.scoutQualityText}</p>
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">{t.rejectNoteLabel}</label>
                <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={2}
                  placeholder={t.rejectNotePlaceholder}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRejectModal(null)}
                  className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                  {t.cancelBtn}
                </button>
                <button onClick={handleAfwijzen} disabled={!rejectReason || (!isAutoRating && rejectRating === 0)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-40">
                  {t.rejectBtn}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ─── Fraud Report Modal (report scout) ───────────────────────────────── */}
      {fraudScout && (
        <FraudReportModal
          isOpen={!!fraudScout}
          onClose={() => setFraudScout(null)}
          lang={lang}
          reporterRole="opdrachtgever"
          reporterName="Daan Verhoeven"
          reporterEmail="demo@bedrijf.nl"
          subjectRole="scout"
          subjectName={fraudScout.name}
          subjectEmail="scout@refurzy.com"
          context={vacature ? `${vacature.title} — ${vacature.company}` : undefined}
        />
      )}
    </div>
  )
}
