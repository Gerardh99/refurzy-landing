'use client'

import { useState, useCallback } from 'react'
import {
  waarden,
  organisatiekenmerken,
  waardenRatingScaleOrg,
  kenmerkenRatingScale,
  type ScaleOption,
} from '@/lib/matching-scan'
import { useLang } from '@/lib/i18n'

// ─── Constants ──────────────────────────────────────────────────────────────

type OrgStep = 'intro' | 'waarden_ranking' | 'waarden_rating' | 'kenmerken_ranking' | 'kenmerken_rating' | 'result'

const STEP_ORDER: OrgStep[] = [
  'intro',
  'waarden_ranking',
  'waarden_rating',
  'kenmerken_ranking',
  'kenmerken_rating',
  'result',
]

const texts = {
  nl: {
    stepLabels: {
      intro: 'Introductie',
      waarden_ranking: 'Waarden (rangorde)',
      waarden_rating: 'Waarden (beoordeling)',
      kenmerken_ranking: 'Organisatiekenmerken (rangorde)',
      kenmerken_rating: 'Organisatiekenmerken (beoordeling)',
      result: 'Resultaat',
    } as Record<OrgStep, string>,
    profileAlreadyFilled: 'Organisatieprofiel is al ingevuld',
    profileAlreadyFilledDesc: 'U kunt het profiel hieronder bekijken en aanpassen indien gewenst.',
    stepIndicator: (current: number, total: number, label: string) => `Stap ${current + 1} van ${total} — ${label}`,
    // Intro
    introTitle: 'Organisatieprofiel — Waarden & Kenmerken',
    introDesc: 'Dit profiel wordt eenmalig ingevuld en hergebruikt voor al uw vacatures. Het beschrijft de waarden en kenmerken van uw organisatie, zodat kandidaten gematcht kunnen worden op cultuurfit.',
    intro4StepsLabel: 'Het profiel bestaat uit 4 stappen:',
    intro4Steps: [
      'Rangschik organisatiewaarden (9 vragen) — wat uw organisatie belangrijk vindt',
      'Beoordeel waarden op een schaal',
      'Rangschik organisatiekenmerken (7 vragen) — kenmerken van uw organisatie',
      'Beoordeel organisatiekenmerken op een schaal',
    ],
    introWorkNote: 'Werkzaamheden (dimensie 1) worden per vacature apart ingevuld bij het aanmaken van de vacature. Zo kunt u per functie aangeven welke werkzaamheden het meest relevant zijn.',
    introWorkTitle: 'Werkzaamheden (dimensie 1)',
    introScientific: 'Wetenschappelijk onderbouwd — ontwikkeld i.s.m. de Vrije Universiteit Amsterdam',
    introProgress: '0/4 stappen voltooid',
    // Ranking step
    waardenRankingTitle: 'Rangschik de waarden',
    waardenRankingDesc: 'Geef elke waarde een unieke rangorde van 1 (minst kenmerkend voor uw organisatie) tot 9 (meest kenmerkend). Elk nummer mag maar één keer gebruikt worden.',
    kenmerkenRankingTitle: 'Rangschik de organisatiekenmerken',
    kenmerkenRankingDesc: 'Geef elk kenmerk een unieke rangorde van 1 (minst kenmerkend) tot 7 (meest kenmerkend). Elk nummer mag maar één keer gebruikt worden.',
    // Rating step
    waardenRatingTitle: 'Beoordeel elke waarde',
    waardenRatingDesc: 'Geef aan hoe belangrijk deze waarde is voor uw organisatie.',
    kenmerkenRatingTitle: 'Beoordeel elk organisatiekenmerk',
    kenmerkenRatingDesc: 'Geef aan in welke mate dit kenmerk past bij uw organisatie.',
    // Navigation
    back: '← Terug',
    startProfile: 'Start het profiel →',
    next: 'Volgende →',
    // Ranking UI
    inUse: '(in gebruik)',
    rankingProgress: (done: number, total: number) => `${done} van ${total} ingevuld`,
    ratingProgress: (done: number, total: number) => `${done} van ${total} beoordeeld`,
    // Result/completion
    completionTitle: 'Organisatieprofiel opgeslagen!',
    completionDesc: 'Dit profiel wordt hergebruikt voor al uw vacatures. U kunt het altijd aanpassen.',
    completionWorkNote: 'Per vacature vult u nog de werkzaamheden in (dimensie 1) bij het aanmaken van de vacature.',
    completionMScore: 'Kandidaten die de Matching Scan invullen krijgen een M-Score te zien die aangeeft hoe goed zij bij uw organisatie passen.',
    backToDashboard: 'Terug naar dashboard',
    // Validation
    validationRankAll: 'Geef elke waarde een rangorde.',
    validationRankUnique: 'Elke rangorde mag maar één keer voorkomen.',
    validationRateAll: 'Beoordeel alle waarden.',
    validationRankKenmerken: 'Geef elk kenmerk een rangorde.',
    validationRateKenmerken: 'Beoordeel alle kenmerken.',
  },
  en: {
    stepLabels: {
      intro: 'Introduction',
      waarden_ranking: 'Values (ranking)',
      waarden_rating: 'Values (rating)',
      kenmerken_ranking: 'Organisation characteristics (ranking)',
      kenmerken_rating: 'Organisation characteristics (rating)',
      result: 'Result',
    } as Record<OrgStep, string>,
    profileAlreadyFilled: 'Organisation profile already completed',
    profileAlreadyFilledDesc: 'You can view and update the profile below if desired.',
    stepIndicator: (current: number, total: number, label: string) => `Step ${current + 1} of ${total} — ${label}`,
    // Intro
    introTitle: 'Organisation Profile — Values & Characteristics',
    introDesc: 'This profile is filled in once and reused for all your vacancies. It describes the values and characteristics of your organisation so that candidates can be matched on culture fit.',
    intro4StepsLabel: 'The profile consists of 4 steps:',
    intro4Steps: [
      'Rank organisation values (9 questions) — what your organisation considers important',
      'Rate values on a scale',
      'Rank organisation characteristics (7 questions) — characteristics of your organisation',
      'Rate organisation characteristics on a scale',
    ],
    introWorkNote: 'Job activities (dimension 1) are filled in per vacancy when creating the vacancy. This way you can indicate per role which activities are most relevant.',
    introWorkTitle: 'Job activities (dimension 1)',
    introScientific: 'Scientifically grounded — developed in collaboration with Vrije Universiteit Amsterdam',
    introProgress: '0/4 steps completed',
    // Ranking step
    waardenRankingTitle: 'Rank the values',
    waardenRankingDesc: 'Give each value a unique rank from 1 (least characteristic of your organisation) to 9 (most characteristic). Each number may only be used once.',
    kenmerkenRankingTitle: 'Rank the organisation characteristics',
    kenmerkenRankingDesc: 'Give each characteristic a unique rank from 1 (least characteristic) to 7 (most characteristic). Each number may only be used once.',
    // Rating step
    waardenRatingTitle: 'Rate each value',
    waardenRatingDesc: 'Indicate how important this value is for your organisation.',
    kenmerkenRatingTitle: 'Rate each organisation characteristic',
    kenmerkenRatingDesc: 'Indicate the extent to which this characteristic fits your organisation.',
    // Navigation
    back: '← Back',
    startProfile: 'Start the profile →',
    next: 'Next →',
    // Ranking UI
    inUse: '(in use)',
    rankingProgress: (done: number, total: number) => `${done} of ${total} filled in`,
    ratingProgress: (done: number, total: number) => `${done} of ${total} rated`,
    // Result/completion
    completionTitle: 'Organisation profile saved!',
    completionDesc: 'This profile is reused for all your vacancies. You can always update it.',
    completionWorkNote: 'Per vacancy you still fill in the job activities (dimension 1) when creating the vacancy.',
    completionMScore: 'Candidates who complete the Matching Scan will see an M-Score indicating how well they fit your organisation.',
    backToDashboard: 'Back to dashboard',
    // Validation
    validationRankAll: 'Give each value a rank.',
    validationRankUnique: 'Each rank may only be used once.',
    validationRateAll: 'Rate all values.',
    validationRankKenmerken: 'Give each characteristic a rank.',
    validationRateKenmerken: 'Rate all characteristics.',
  },
}

interface OrgResponses {
  waarden_ranking: Record<string, number>
  waarden_rating: Record<string, number>
  kenmerken_ranking: Record<string, number>
  kenmerken_rating: Record<string, number>
}

function emptyResponses(): OrgResponses {
  return {
    waarden_ranking: {},
    waarden_rating: {},
    kenmerken_ranking: {},
    kenmerken_rating: {},
  }
}

// ─── Main page component ────────────────────────────────────────────────────

export default function OpdrachtgeverMatchingProfiel() {
  const { lang } = useLang()
  const t = texts[lang]

  const [stepIndex, setStepIndex] = useState(0)
  const [responses, setResponses] = useState<OrgResponses>(emptyResponses)
  const [validationError, setValidationError] = useState('')
  const [profileAlreadyFilled, setProfileAlreadyFilled] = useState(false)

  const currentStep = STEP_ORDER[stepIndex]

  const setRanking = useCallback(
    (section: 'waarden_ranking' | 'kenmerken_ranking', itemId: string, value: number) => {
      setResponses((prev) => ({
        ...prev,
        [section]: { ...prev[section], [itemId]: value },
      }))
    },
    []
  )

  const setRating = useCallback(
    (section: 'waarden_rating' | 'kenmerken_rating', itemId: string, value: number) => {
      setResponses((prev) => ({
        ...prev,
        [section]: { ...prev[section], [itemId]: value },
      }))
    },
    []
  )

  function validateStep(): boolean {
    setValidationError('')

    if (currentStep === 'waarden_ranking') {
      const vals = Object.values(responses.waarden_ranking)
      if (vals.length < 9) { setValidationError(t.validationRankAll); return false }
      const unique = new Set(vals)
      if (unique.size < 9) { setValidationError(t.validationRankUnique); return false }
    }
    if (currentStep === 'waarden_rating') {
      if (Object.values(responses.waarden_rating).length < 9) { setValidationError(t.validationRateAll); return false }
    }
    if (currentStep === 'kenmerken_ranking') {
      const vals = Object.values(responses.kenmerken_ranking)
      if (vals.length < 7) { setValidationError(t.validationRankKenmerken); return false }
      const unique = new Set(vals)
      if (unique.size < 7) { setValidationError(t.validationRankUnique); return false }
    }
    if (currentStep === 'kenmerken_rating') {
      if (Object.values(responses.kenmerken_rating).length < 7) { setValidationError(t.validationRateKenmerken); return false }
    }

    return true
  }

  function goNext() {
    if (currentStep !== 'intro' && currentStep !== 'result') {
      if (!validateStep()) return
    }
    if (stepIndex < STEP_ORDER.length - 1) {
      setStepIndex(stepIndex + 1)
      setValidationError('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
      setValidationError('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Green banner when profile already filled */}
      {profileAlreadyFilled && currentStep === 'intro' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-green-400 text-xl">&#10003;</span>
          <div>
            <p className="text-green-400 font-semibold text-sm">{t.profileAlreadyFilled}</p>
            <p className="text-green-400/70 text-xs">{t.profileAlreadyFilledDesc}</p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <ProgressBar current={stepIndex} total={STEP_ORDER.length} label={t.stepLabels[currentStep]} stepIndicator={t.stepIndicator} />

      {/* Step content */}
      {currentStep === 'intro' && <IntroStep t={t} />}

      {currentStep === 'waarden_ranking' && (
        <RankingStep
          title={t.waardenRankingTitle}
          description={t.waardenRankingDesc}
          items={waarden.map((w) => ({ id: w.id, label: w.label, description: w.description }))}
          max={9}
          values={responses.waarden_ranking}
          onChange={(id, v) => setRanking('waarden_ranking', id, v)}
          inUseLabel={t.inUse}
          progressLabel={t.rankingProgress}
        />
      )}

      {currentStep === 'waarden_rating' && (
        <RatingStep
          title={t.waardenRatingTitle}
          description={t.waardenRatingDesc}
          items={waarden.map((w) => ({ id: w.id, label: w.label, description: w.description }))}
          scale={waardenRatingScaleOrg}
          values={responses.waarden_rating}
          onChange={(id, v) => setRating('waarden_rating', id, v)}
          progressLabel={t.ratingProgress}
        />
      )}

      {currentStep === 'kenmerken_ranking' && (
        <RankingStep
          title={t.kenmerkenRankingTitle}
          description={t.kenmerkenRankingDesc}
          items={organisatiekenmerken.map((k) => ({ id: k.id, label: k.label, description: k.description }))}
          max={7}
          values={responses.kenmerken_ranking}
          onChange={(id, v) => setRanking('kenmerken_ranking', id, v)}
          inUseLabel={t.inUse}
          progressLabel={t.rankingProgress}
        />
      )}

      {currentStep === 'kenmerken_rating' && (
        <RatingStep
          title={t.kenmerkenRatingTitle}
          description={t.kenmerkenRatingDesc}
          items={organisatiekenmerken.map((k) => ({ id: k.id, label: k.label, description: k.description }))}
          scale={kenmerkenRatingScale}
          values={responses.kenmerken_rating}
          onChange={(id, v) => setRating('kenmerken_rating', id, v)}
          progressLabel={t.ratingProgress}
        />
      )}

      {currentStep === 'result' && <CompletionStep t={t} />}

      {/* Validation error */}
      {validationError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          {validationError}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        {stepIndex > 0 && currentStep !== 'result' ? (
          <button
            onClick={goBack}
            className="px-5 py-2.5 text-sm font-medium text-ink-light hover:text-ink border border-surface-border rounded-lg transition-colors"
          >
            {t.back}
          </button>
        ) : (
          <div />
        )}

        {currentStep !== 'result' && (
          <button
            onClick={goNext}
            className="px-6 py-2.5 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors"
          >
            {currentStep === 'intro' ? t.startProfile : t.next}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Progress Bar ───────────────────────────────────────────────────────────

function ProgressBar({ current, total, label, stepIndicator }: {
  current: number
  total: number
  label: string
  stepIndicator: (current: number, total: number, label: string) => string
}) {
  const pct = Math.round((current / (total - 1)) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-ink-light">
          {stepIndicator(current, total, label)}
        </span>
        <span className="text-cyan">{pct}%</span>
      </div>
      <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan to-purple-light rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Intro Step ─────────────────────────────────────────────────────────────

function IntroStep({ t }: { t: typeof texts['nl'] }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-border p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.introTitle}</h1>
        <p className="text-ink-light mt-2 leading-relaxed">
          {t.introDesc}
        </p>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-xl p-5 space-y-3">
        <p className="text-sm font-medium text-purple">{t.intro4StepsLabel}</p>
        <ul className="text-sm text-ink-light space-y-2">
          {t.intro4Steps.map((step, i) => (
            <li key={i} className="flex gap-2"><span className="text-purple font-bold">{i + 1}.</span> {step}</li>
          ))}
        </ul>
      </div>

      <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 text-sm text-ink-light">
        <p>
          <strong className="text-ink">{t.introWorkTitle}</strong> {t.introWorkNote}
        </p>
      </div>

      <div className="flex items-center gap-3 text-sm text-ink-muted">
        <span className="text-lg">&#127891;</span>
        <span>{t.introScientific}</span>
      </div>

      <p className="text-ink-muted text-sm">{t.introProgress}</p>
    </div>
  )
}

// ─── Ranking Step ───────────────────────────────────────────────────────────

interface GenericItem {
  id: string
  label: string
  description: string
}

function RankingStep({
  title,
  description,
  items,
  max,
  values,
  onChange,
  inUseLabel,
  progressLabel,
}: {
  title: string
  description: string
  items: GenericItem[]
  max: number
  values: Record<string, number>
  onChange: (id: string, value: number) => void
  inUseLabel: string
  progressLabel: (done: number, total: number) => string
}) {
  const usedValues = new Set(Object.values(values))
  const options = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
        <p className="text-ink-light text-sm mt-1">{description}</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const currentVal = values[item.id]
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
                      {n}{taken ? ` ${inUseLabel}` : ''}
                    </option>
                  )
                })}
              </select>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{item.label}</p>
                <p className="text-xs text-ink-muted mt-0.5">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-ink-muted">
        {progressLabel(Object.keys(values).length, items.length)}
      </p>
    </div>
  )
}

// ─── Rating Step ────────────────────────────────────────────────────────────

function RatingStep({
  title,
  description,
  items,
  scale,
  values,
  onChange,
  progressLabel,
}: {
  title: string
  description: string
  items: GenericItem[]
  scale: ScaleOption[]
  values: Record<string, number>
  onChange: (id: string, value: number) => void
  progressLabel: (done: number, total: number) => string
}) {
  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
        <p className="text-ink-light text-sm mt-1">{description}</p>
      </div>

      {/* Scale legend */}
      <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
        {scale.filter((s) => s.label).map((s) => (
          <span key={s.value} className="bg-surface-muted px-2 py-1 rounded">
            {s.value} = {s.label}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const currentVal = values[item.id]
          return (
            <div
              key={item.id}
              className="border-b border-surface-border pb-4 last:border-0 last:pb-0 space-y-2"
            >
              <div>
                <p className="text-sm font-medium text-ink">{item.label}</p>
                <p className="text-xs text-ink-muted">{item.description}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {scale.map((s) => (
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
        {progressLabel(Object.keys(values).length, items.length)}
      </p>
    </div>
  )
}

// ─── Completion Step ────────────────────────────────────────────────────────

function CompletionStep({ t }: { t: typeof texts['nl'] }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-border p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-400 flex items-center justify-center">
          <span className="text-4xl">&#10003;</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-ink">{t.completionTitle}</h2>
        <p className="text-ink-light mt-2 text-sm leading-relaxed">
          {t.completionDesc}
        </p>
      </div>

      <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 text-sm text-ink-light">
        {t.completionWorkNote}
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-xl p-4 text-sm text-ink-light">
        {t.completionMScore}
      </div>

      <a
        href="/demo/opdrachtgever"
        className="inline-block px-6 py-2.5 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors"
      >
        {t.backToDashboard}
      </a>
    </div>
  )
}
