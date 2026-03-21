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
      if (vals.length < 19) { setValidationError('Geef elke werkzaamheid een rangorde.'); return false }
      const unique = new Set(vals)
      if (unique.size < 19) { setValidationError('Elke rangorde mag maar één keer voorkomen.'); return false }
    }
    if (currentStep === 'werkzaamheden_rating') {
      if (Object.values(responses.werkzaamheden_rating).length < 19) { setValidationError('Beoordeel alle werkzaamheden.'); return false }
    }
    if (currentStep === 'waarden_ranking') {
      const vals = Object.values(responses.waarden_ranking)
      if (vals.length < 9) { setValidationError('Geef elke waarde een rangorde.'); return false }
      const unique = new Set(vals)
      if (unique.size < 9) { setValidationError('Elke rangorde mag maar één keer voorkomen.'); return false }
    }
    if (currentStep === 'waarden_rating') {
      if (Object.values(responses.waarden_rating).length < 9) { setValidationError('Beoordeel alle waarden.'); return false }
    }
    if (currentStep === 'kenmerken_ranking') {
      const vals = Object.values(responses.kenmerken_ranking)
      if (vals.length < 7) { setValidationError('Geef elk kenmerk een rangorde.'); return false }
      const unique = new Set(vals)
      if (unique.size < 7) { setValidationError('Elke rangorde mag maar één keer voorkomen.'); return false }
    }
    if (currentStep === 'kenmerken_rating') {
      if (Object.values(responses.kenmerken_rating).length < 7) { setValidationError('Beoordeel alle kenmerken.'); return false }
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
      <ProgressBar current={stepIndex} total={STEP_ORDER.length} label={stepMeta.label} />

      {/* Step content */}
      {currentStep === 'intro' && <IntroStep />}

      {currentStep === 'werkzaamheden_ranking' && (
        <RankingStep
          title="Rangschik de werkzaamheden"
          description="Geef elke werkzaamheid een unieke rangorde van 1 (minst passend) tot 19 (meest passend). Elk nummer mag maar één keer gebruikt worden."
          items={werkzaamheden.map((w) => ({ id: w.id, label: w.labelKandidaat, description: w.description }))}
          max={19}
          values={responses.werkzaamheden_ranking}
          onChange={(id, v) => setRanking('werkzaamheden_ranking', id, v)}
        />
      )}

      {currentStep === 'werkzaamheden_rating' && (
        <RatingStep
          title="Beoordeel elke werkzaamheid"
          description="Geef aan in welke mate u deze werkzaamheid bij u past."
          items={werkzaamheden.map((w) => ({ id: w.id, label: w.labelKandidaat, description: w.description }))}
          scale={werkzaamhedenRatingScale}
          values={responses.werkzaamheden_rating}
          onChange={(id, v) => setRating('werkzaamheden_rating', id, v)}
        />
      )}

      {currentStep === 'waarden_ranking' && (
        <RankingStep
          title="Rangschik de waarden"
          description="Geef elke waarde een unieke rangorde van 1 (minst belangrijk) tot 9 (meest belangrijk). Elk nummer mag maar één keer gebruikt worden."
          items={waarden.map((w) => ({ id: w.id, label: w.label, description: w.description }))}
          max={9}
          values={responses.waarden_ranking}
          onChange={(id, v) => setRanking('waarden_ranking', id, v)}
        />
      )}

      {currentStep === 'waarden_rating' && (
        <RatingStep
          title="Beoordeel elke waarde"
          description="Geef aan hoe belangrijk deze waarde voor u is."
          items={waarden.map((w) => ({ id: w.id, label: w.label, description: w.description }))}
          scale={waardenRatingScaleKandidaat}
          values={responses.waarden_rating}
          onChange={(id, v) => setRating('waarden_rating', id, v)}
        />
      )}

      {currentStep === 'kenmerken_ranking' && (
        <RankingStep
          title="Rangschik de organisatiekenmerken"
          description="Geef elk kenmerk een unieke rangorde van 1 (minst belangrijk) tot 7 (meest belangrijk). Elk nummer mag maar één keer gebruikt worden."
          items={organisatiekenmerken.map((k) => ({ id: k.id, label: k.label, description: k.description }))}
          max={7}
          values={responses.kenmerken_ranking}
          onChange={(id, v) => setRanking('kenmerken_ranking', id, v)}
        />
      )}

      {currentStep === 'kenmerken_rating' && (
        <RatingStep
          title="Beoordeel elk organisatiekenmerk"
          description="Geef aan in welke mate dit kenmerk bij u past."
          items={organisatiekenmerken.map((k) => ({ id: k.id, label: k.label, description: k.description }))}
          scale={kenmerkenRatingScale}
          values={responses.kenmerken_rating}
          onChange={(id, v) => setRating('kenmerken_rating', id, v)}
        />
      )}

      {currentStep === 'result' && <ResultStep responses={responses} />}

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
            &larr; Terug
          </button>
        ) : (
          <div />
        )}

        {currentStep !== 'result' && (
          <button
            onClick={goNext}
            className="px-6 py-2.5 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors"
          >
            {currentStep === 'intro' ? 'Start de scan \u2192' : 'Volgende \u2192'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Progress Bar ───────────────────────────────────────────────────────────

function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = Math.round((current / (total - 1)) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-ink-light">
          Stap {current + 1} van {total} &mdash; {label}
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

function IntroStep() {
  return (
    <div className="bg-white rounded-2xl border border-surface-border p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Matching Scan</h1>
        <p className="text-ink-light mt-2 leading-relaxed">
          De Matching Scan meet in 35 vragen hoe goed u past bij een organisatie.
          De scan is ontwikkeld met de Vrije Universiteit Amsterdam.
        </p>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-xl p-5 space-y-3">
        <p className="text-sm font-medium text-purple">Hoe werkt het?</p>
        <ul className="text-sm text-ink-light space-y-2">
          <li className="flex gap-2"><span className="text-purple font-bold">1.</span> Rangschik werkzaamheden naar voorkeur</li>
          <li className="flex gap-2"><span className="text-purple font-bold">2.</span> Beoordeel werkzaamheden op een schaal</li>
          <li className="flex gap-2"><span className="text-purple font-bold">3.</span> Rangschik persoonlijke waarden</li>
          <li className="flex gap-2"><span className="text-purple font-bold">4.</span> Beoordeel uw waarden op een schaal</li>
          <li className="flex gap-2"><span className="text-purple font-bold">5.</span> Rangschik organisatiekenmerken</li>
          <li className="flex gap-2"><span className="text-purple font-bold">6.</span> Beoordeel organisatiekenmerken op een schaal</li>
        </ul>
      </div>

      <div className="flex items-center gap-3 text-sm text-ink-muted">
        <span className="text-lg">&#127891;</span>
        <span>Wetenschappelijk onderbouwd &mdash; ontwikkeld i.s.m. de Vrije Universiteit Amsterdam</span>
      </div>

      <p className="text-ink-muted text-sm">0/6 stappen voltooid</p>
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
}: {
  title: string
  description: string
  items: GenericItem[]
  max: number
  values: Record<string, number>
  onChange: (id: string, value: number) => void
}) {
  // Build used-values set
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
                      {n}{taken ? ' (in gebruik)' : ''}
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
        {Object.keys(values).length} van {items.length} ingevuld
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
}: {
  title: string
  description: string
  items: GenericItem[]
  scale: ScaleOption[]
  values: Record<string, number>
  onChange: (id: string, value: number) => void
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
        {Object.keys(values).length} van {items.length} beoordeeld
      </p>
    </div>
  )
}

// ─── Result Step ────────────────────────────────────────────────────────────

function ResultStep({ responses }: { responses: ScanResponses }) {
  const mScore = calculateMScore(demoOrgResponses, responses)

  // Dimension sub-scores for breakdown
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
        <h2 className="text-2xl font-bold text-ink">Uw profiel is compleet!</h2>
        <p className="text-ink-light text-sm">
          Hieronder ziet u uw M-Score berekend tegen het demo-organisatieprofiel (TechVentures B.V.)
        </p>

        {/* Big score circle */}
        <div className="flex justify-center">
          <div className={`w-36 h-36 rounded-full border-4 ${ringColor} flex flex-col items-center justify-center`}>
            <span className={`text-4xl font-bold ${scoreColor}`}>{mScore}</span>
            <span className="text-xs text-ink-muted mt-1">M-Score</span>
          </div>
        </div>

        <p className="text-sm text-ink-muted">
          {mScore >= 70 && 'Sterke match! Uw profiel sluit goed aan bij deze organisatie.'}
          {mScore >= 50 && mScore < 70 && 'Redelijke match. Er zijn overeenkomsten, maar ook verschillen.'}
          {mScore < 50 && 'Beperkte match. Uw profiel wijkt af van het organisatieprofiel.'}
        </p>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-ink">Breakdown per dimensie</h3>

        <DimensionBar label="Werkzaamheden / Interesses" score={werkTotal} />
        <DimensionBar label="Waarden" score={waardenTotal} />
        <DimensionBar label="Organisatiekenmerken" score={kenmTotal} />
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
