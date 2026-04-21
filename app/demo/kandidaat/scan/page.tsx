'use client'

import { useState, useCallback } from 'react'
import {
  werkzaamheden,
  waarden,
  organisatiekenmerken,
  werkzaamhedenRatingScale,
  waardenRatingScaleKandidaat,
  kenmerkenRatingScale,
  calculateMScore,
  demoOrgResponses,
  scanSteps,
  type ScanResponses,
  type ScanStep,
  type ScanItem,
  type WaardeItem,
  type KenmerkItem,
  type ScaleOption,
} from '@/lib/matching-scan'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    stepPrefix: 'Stap',
    of: 'van',
    backLabel: '← Terug',
    startScan: 'Start de scan →',
    nextStep: 'Volgende →',
    // Intro
    introTitle: 'Matching Scan',
    introDesc: 'De Matching Scan meet in 35 vragen hoe goed u past bij een organisatie. De scan is ontwikkeld met de Vrije Universiteit Amsterdam.',
    howItWorks: 'Hoe werkt het?',
    howStep1: 'Rangschik werkzaamheden naar voorkeur',
    howStep2: 'Beoordeel werkzaamheden op een schaal',
    howStep3: 'Rangschik persoonlijke waarden',
    howStep4: 'Beoordeel uw waarden op een schaal',
    howStep5: 'Rangschik organisatiekenmerken',
    howStep6: 'Beoordeel organisatiekenmerken op een schaal',
    scienceBadge: 'Wetenschappelijk onderbouwd — ontwikkeld i.s.m. de Vrije Universiteit Amsterdam',
    stepsCompleted: '0/6 stappen voltooid',
    // Ranking
    rankingTitle: 'Rangschik de werkzaamheden',
    rankingDesc: 'Geef elke werkzaamheid een unieke rangorde van 1 (minst passend) tot 19 (meest passend). Elk nummer mag maar één keer gebruikt worden.',
    valuesRankingTitle: 'Rangschik de waarden',
    valuesRankingDesc: 'Geef elke waarde een unieke rangorde van 1 (minst belangrijk) tot 9 (meest belangrijk). Elk nummer mag maar één keer gebruikt worden.',
    kenmerkenRankingTitle: 'Rangschik de organisatiekenmerken',
    kenmerkenRankingDesc: 'Geef elk kenmerk een unieke rangorde van 1 (minst belangrijk) tot 7 (meest belangrijk). Elk nummer mag maar één keer gebruikt worden.',
    inUse: '(in gebruik)',
    // Rating
    ratingTitle: 'Beoordeel elke werkzaamheid',
    ratingDesc: 'Geef aan in welke mate u deze werkzaamheid bij u past.',
    valuesRatingTitle: 'Beoordeel elke waarde',
    valuesRatingDesc: 'Geef aan hoe belangrijk deze waarde voor u is.',
    kenmerkenRatingTitle: 'Beoordeel elk organisatiekenmerk',
    kenmerkenRatingDesc: 'Geef aan in welke mate dit kenmerk bij u past.',
    filled: 'van',
    rated: 'beoordeeld',
    // Validation
    valWorkRanking: 'Geef elke werkzaamheid een rangorde.',
    valWorkRankingUnique: 'Elke rangorde mag maar één keer voorkomen.',
    valWorkRating: 'Beoordeel alle werkzaamheden.',
    valValuesRanking: 'Geef elke waarde een rangorde.',
    valValuesRankingUnique: 'Elke rangorde mag maar één keer voorkomen.',
    valValuesRating: 'Beoordeel alle waarden.',
    valKenmerkenRanking: 'Geef elk kenmerk een rangorde.',
    valKenmerkenRankingUnique: 'Elke rangorde mag maar één keer voorkomen.',
    valKenmerkenRating: 'Beoordeel alle kenmerken.',
    // Result
    resultTitle: 'Uw profiel is compleet!',
    resultDesc: 'Hieronder ziet u uw M-Score berekend tegen het demo-organisatieprofiel (TechVentures B.V.)',
    mScoreLabel: 'M-Score',
    strongMatch: 'Sterke match! Uw profiel sluit goed aan bij deze organisatie.',
    moderateMatch: 'Redelijke match. Er zijn overeenkomsten, maar ook verschillen.',
    weakMatch: 'Beperkte match. Uw profiel wijkt af van het organisatieprofiel.',
    breakdownTitle: 'Breakdown per dimensie',
    dimWork: 'Werkzaamheden / Interesses',
    dimValues: 'Waarden',
    dimOrg: 'Organisatiekenmerken',
  },
  en: {
    stepPrefix: 'Step',
    of: 'of',
    backLabel: '← Back',
    startScan: 'Start the scan →',
    nextStep: 'Next →',
    // Intro
    introTitle: 'Matching Scan',
    introDesc: 'The Matching Scan measures in 35 questions how well you fit an organization. The scan was developed with Vrije Universiteit Amsterdam.',
    howItWorks: 'How does it work?',
    howStep1: 'Rank work activities by preference',
    howStep2: 'Rate work activities on a scale',
    howStep3: 'Rank personal values',
    howStep4: 'Rate your values on a scale',
    howStep5: 'Rank organizational traits',
    howStep6: 'Rate organizational traits on a scale',
    scienceBadge: 'Scientifically grounded — developed in collaboration with Vrije Universiteit Amsterdam',
    stepsCompleted: '0/6 steps completed',
    // Ranking
    rankingTitle: 'Rank the work activities',
    rankingDesc: 'Give each work activity a unique rank from 1 (least fitting) to 19 (most fitting). Each number may only be used once.',
    valuesRankingTitle: 'Rank the values',
    valuesRankingDesc: 'Give each value a unique rank from 1 (least important) to 9 (most important). Each number may only be used once.',
    kenmerkenRankingTitle: 'Rank the organizational traits',
    kenmerkenRankingDesc: 'Give each trait a unique rank from 1 (least important) to 7 (most important). Each number may only be used once.',
    inUse: '(in use)',
    // Rating
    ratingTitle: 'Rate each work activity',
    ratingDesc: 'Indicate to what extent this work activity suits you.',
    valuesRatingTitle: 'Rate each value',
    valuesRatingDesc: 'Indicate how important this value is to you.',
    kenmerkenRatingTitle: 'Rate each organizational trait',
    kenmerkenRatingDesc: 'Indicate to what extent this trait suits you.',
    filled: 'of',
    rated: 'rated',
    // Validation
    valWorkRanking: 'Give each work activity a rank.',
    valWorkRankingUnique: 'Each rank may only appear once.',
    valWorkRating: 'Rate all work activities.',
    valValuesRanking: 'Give each value a rank.',
    valValuesRankingUnique: 'Each rank may only appear once.',
    valValuesRating: 'Rate all values.',
    valKenmerkenRanking: 'Give each trait a rank.',
    valKenmerkenRankingUnique: 'Each rank may only appear once.',
    valKenmerkenRating: 'Rate all traits.',
    // Result
    resultTitle: 'Your profile is complete!',
    resultDesc: 'Below you can see your M-Score calculated against the demo organization profile (TechVentures B.V.)',
    mScoreLabel: 'M-Score',
    strongMatch: 'Strong match! Your profile aligns well with this organization.',
    moderateMatch: 'Moderate match. There are similarities, but also differences.',
    weakMatch: 'Limited match. Your profile deviates from the organization profile.',
    breakdownTitle: 'Breakdown by dimension',
    dimWork: 'Work activities / Interests',
    dimValues: 'Values',
    dimOrg: 'Organizational traits',
  },
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STEP_ORDER: ScanStep[] = [
  'intro',
  'werkzaamheden_ranking',
  'werkzaamheden_rating',
  'waarden_ranking',
  'waarden_rating',
  'kenmerken_ranking',
  'kenmerken_rating',
  'result',
]

function emptyResponses(): ScanResponses {
  return {
    werkzaamheden_ranking: {},
    werkzaamheden_rating: {},
    waarden_ranking: {},
    waarden_rating: {},
    kenmerken_ranking: {},
    kenmerken_rating: {},
  }
}

// ─── Main page component ────────────────────────────────────────────────────

export default function KandidaatMatchingScan() {
  const { lang } = useLang()
  const t = texts[lang]

  const [stepIndex, setStepIndex] = useState(0)
  const [responses, setResponses] = useState<ScanResponses>(emptyResponses)
  const [validationError, setValidationError] = useState('')

  const currentStep = STEP_ORDER[stepIndex]
  const stepMeta = scanSteps[stepIndex]

  const setRanking = useCallback(
    (section: 'werkzaamheden_ranking' | 'waarden_ranking' | 'kenmerken_ranking', itemId: string, value: number) => {
      setResponses((prev) => ({
        ...prev,
        [section]: { ...prev[section], [itemId]: value },
      }))
    },
    []
  )

  const setRating = useCallback(
    (section: 'werkzaamheden_rating' | 'waarden_rating' | 'kenmerken_rating', itemId: string, value: number) => {
      setResponses((prev) => ({
        ...prev,
        [section]: { ...prev[section], [itemId]: value },
      }))
    },
    []
  )

  function validateStep(): boolean {
    setValidationError('')

    if (currentStep === 'werkzaamheden_ranking') {
      const vals = Object.values(responses.werkzaamheden_ranking)
      if (vals.length < 19) { setValidationError(t.valWorkRanking); return false }
      const unique = new Set(vals)
      if (unique.size < 19) { setValidationError(t.valWorkRankingUnique); return false }
    }
    if (currentStep === 'werkzaamheden_rating') {
      if (Object.values(responses.werkzaamheden_rating).length < 19) { setValidationError(t.valWorkRating); return false }
    }
    if (currentStep === 'waarden_ranking') {
      const vals = Object.values(responses.waarden_ranking)
      if (vals.length < 9) { setValidationError(t.valValuesRanking); return false }
      const unique = new Set(vals)
      if (unique.size < 9) { setValidationError(t.valValuesRankingUnique); return false }
    }
    if (currentStep === 'waarden_rating') {
      if (Object.values(responses.waarden_rating).length < 9) { setValidationError(t.valValuesRating); return false }
    }
    if (currentStep === 'kenmerken_ranking') {
      const vals = Object.values(responses.kenmerken_ranking)
      if (vals.length < 7) { setValidationError(t.valKenmerkenRanking); return false }
      const unique = new Set(vals)
      if (unique.size < 7) { setValidationError(t.valKenmerkenRankingUnique); return false }
    }
    if (currentStep === 'kenmerken_rating') {
      if (Object.values(responses.kenmerken_rating).length < 7) { setValidationError(t.valKenmerkenRating); return false }
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
      {/* Progress bar */}
      <ProgressBar current={stepIndex} total={STEP_ORDER.length} label={stepMeta.label} t={t} />

      {/* Step content */}
      {currentStep === 'intro' && <IntroStep t={t} />}

      {currentStep === 'werkzaamheden_ranking' && (
        <RankingStep
          title={t.rankingTitle}
          description={t.rankingDesc}
          items={werkzaamheden.map((w) => ({ id: w.id, label: w.labelKandidaat, description: w.description }))}
          max={19}
          values={responses.werkzaamheden_ranking}
          onChange={(id, v) => setRanking('werkzaamheden_ranking', id, v)}
          inUseLabel={t.inUse}
          filledLabel={t.filled}
        />
      )}

      {currentStep === 'werkzaamheden_rating' && (
        <RatingStep
          title={t.ratingTitle}
          description={t.ratingDesc}
          items={werkzaamheden.map((w) => ({ id: w.id, label: w.labelKandidaat, description: w.description }))}
          scale={werkzaamhedenRatingScale}
          values={responses.werkzaamheden_rating}
          onChange={(id, v) => setRating('werkzaamheden_rating', id, v)}
          ratedLabel={t.rated}
          filledLabel={t.filled}
        />
      )}

      {currentStep === 'waarden_ranking' && (
        <RankingStep
          title={t.valuesRankingTitle}
          description={t.valuesRankingDesc}
          items={waarden.map((w) => ({ id: w.id, label: w.label, description: w.description }))}
          max={9}
          values={responses.waarden_ranking}
          onChange={(id, v) => setRanking('waarden_ranking', id, v)}
          inUseLabel={t.inUse}
          filledLabel={t.filled}
        />
      )}

      {currentStep === 'waarden_rating' && (
        <RatingStep
          title={t.valuesRatingTitle}
          description={t.valuesRatingDesc}
          items={waarden.map((w) => ({ id: w.id, label: w.label, description: w.description }))}
          scale={waardenRatingScaleKandidaat}
          values={responses.waarden_rating}
          onChange={(id, v) => setRating('waarden_rating', id, v)}
          ratedLabel={t.rated}
          filledLabel={t.filled}
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
          filledLabel={t.filled}
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
          ratedLabel={t.rated}
          filledLabel={t.filled}
        />
      )}

      {currentStep === 'result' && <ResultStep responses={responses} t={t} />}

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
            {t.backLabel}
          </button>
        ) : (
          <div />
        )}

        {currentStep !== 'result' && (
          <button
            onClick={goNext}
            className="px-6 py-2.5 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors"
          >
            {currentStep === 'intro' ? t.startScan : t.nextStep}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Progress Bar ───────────────────────────────────────────────────────────

function ProgressBar({ current, total, label, t }: { current: number; total: number; label: string; t: typeof texts['nl'] }) {
  const pct = Math.round((current / (total - 1)) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-ink-light">
          {t.stepPrefix} {current + 1} {t.of} {total} &mdash; {label}
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
        <p className="text-ink-light mt-2 leading-relaxed">{t.introDesc}</p>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-xl p-5 space-y-3">
        <p className="text-sm font-medium text-purple">{t.howItWorks}</p>
        <ul className="text-sm text-ink-light space-y-2">
          <li className="flex gap-2"><span className="text-purple font-bold">1.</span> {t.howStep1}</li>
          <li className="flex gap-2"><span className="text-purple font-bold">2.</span> {t.howStep2}</li>
          <li className="flex gap-2"><span className="text-purple font-bold">3.</span> {t.howStep3}</li>
          <li className="flex gap-2"><span className="text-purple font-bold">4.</span> {t.howStep4}</li>
          <li className="flex gap-2"><span className="text-purple font-bold">5.</span> {t.howStep5}</li>
          <li className="flex gap-2"><span className="text-purple font-bold">6.</span> {t.howStep6}</li>
        </ul>
      </div>

      <div className="flex items-center gap-3 text-sm text-ink-muted">
        <span className="text-lg">&#127891;</span>
        <span>{t.scienceBadge}</span>
      </div>

      <p className="text-ink-muted text-sm">{t.stepsCompleted}</p>
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
  filledLabel,
}: {
  title: string
  description: string
  items: GenericItem[]
  max: number
  values: Record<string, number>
  onChange: (id: string, value: number) => void
  inUseLabel: string
  filledLabel: string
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
                <option value="">—</option>
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
        {Object.keys(values).length} {filledLabel} {items.length}
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
  ratedLabel,
  filledLabel,
}: {
  title: string
  description: string
  items: GenericItem[]
  scale: ScaleOption[]
  values: Record<string, number>
  onChange: (id: string, value: number) => void
  ratedLabel: string
  filledLabel: string
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
        {Object.keys(values).length} {filledLabel} {items.length} {ratedLabel}
      </p>
    </div>
  )
}

// ─── Result Step ────────────────────────────────────────────────────────────

function ResultStep({ responses, t }: { responses: ScanResponses; t: typeof texts['nl'] }) {
  const mScore = calculateMScore(demoOrgResponses, responses)

  const werkRanking = avgPOMPForKeys(responses.werkzaamheden_ranking, 1, 19)
  const werkRating = avgPOMPForKeys(responses.werkzaamheden_rating, 1, 7)
  const werkTotal = Math.round((werkRanking + werkRating) / 2)

  const waardenRanking = avgPOMPForKeys(responses.waarden_ranking, 1, 9)
  const waardenRating = avgPOMPForKeys(responses.waarden_rating, 1, 9)
  const waardenTotal = Math.round((waardenRanking + waardenRating) / 2)

  const kenmRanking = avgPOMPForKeys(responses.kenmerken_ranking, 1, 7)
  const kenmRating = avgPOMPForKeys(responses.kenmerken_rating, 1, 7)
  const kenmTotal = Math.round((kenmRanking + kenmRating) / 2)

  const scoreColor = mScore >= 70 ? 'text-green-400' : mScore >= 50 ? 'text-yellow-400' : 'text-red-400'
  const ringColor = mScore >= 70 ? 'border-green-400' : mScore >= 50 ? 'border-yellow-400' : 'border-red-400'

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-surface-border p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-ink">{t.resultTitle}</h2>
        <p className="text-ink-light text-sm">{t.resultDesc}</p>

        {/* Big score circle */}
        <div className="flex justify-center">
          <div className={`w-36 h-36 rounded-full border-4 ${ringColor} flex flex-col items-center justify-center`}>
            <span className={`text-4xl font-bold ${scoreColor}`}>{mScore}</span>
            <span className="text-xs text-ink-muted mt-1">{t.mScoreLabel}</span>
          </div>
        </div>

        <p className="text-sm text-ink-muted">
          {mScore >= 70 && t.strongMatch}
          {mScore >= 50 && mScore < 70 && t.moderateMatch}
          {mScore < 50 && t.weakMatch}
        </p>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-ink">{t.breakdownTitle}</h3>

        <DimensionBar label={t.dimWork} score={werkTotal} />
        <DimensionBar label={t.dimValues} score={waardenTotal} />
        <DimensionBar label={t.dimOrg} score={kenmTotal} />
      </div>
    </div>
  )
}

function DimensionBar({ label, score }: { label: string; score: number }) {
  const color = score >= 60 ? 'bg-green-400' : score >= 40 ? 'bg-yellow-400' : 'bg-red-400'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-ink-light">{label}</span>
        <span className="text-ink font-medium">{score}%</span>
      </div>
      <div className="h-2.5 bg-surface-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

// ─── Utility ────────────────────────────────────────────────────────────────

function avgPOMPForKeys(data: Record<string, number>, scaleMin: number, scaleMax: number): number {
  const vals = Object.values(data)
  if (vals.length === 0) return 50
  const pompValues = vals.map((v) => (100 / (scaleMax - scaleMin)) * (v - scaleMin))
  return Math.round(pompValues.reduce((a, b) => a + b, 0) / pompValues.length)
}
