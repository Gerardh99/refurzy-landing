'use client'

import { useState, useCallback } from 'react'
import {
  werkzaamheden,
  waarden,
  organisatiekenmerken,
  werkzaamhedenRatingScale,
  waardenRatingScaleOrg,
  kenmerkenRatingScale,
  scanSteps,
  type ScanResponses,
  type ScanStep,
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

export default function OpdrachtgeverMatchingProfiel() {
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
          description="Geef elke werkzaamheid een unieke rangorde van 1 (minst relevant voor de vacature) tot 19 (meest relevant). Elk nummer mag maar één keer gebruikt worden."
          items={werkzaamheden.map((w) => ({ id: w.id, label: w.labelOrg, description: w.description }))}
          max={19}
          values={responses.werkzaamheden_ranking}
          onChange={(id, v) => setRanking('werkzaamheden_ranking', id, v)}
        />
      )}

      {currentStep === 'werkzaamheden_rating' && (
        <RatingStep
          title="Beoordeel elke werkzaamheid"
          description="Geef aan in welke mate deze werkzaamheid relevant is voor de vacature."
          items={werkzaamheden.map((w) => ({ id: w.id, label: w.labelOrg, description: w.description }))}
          scale={werkzaamhedenRatingScale}
          values={responses.werkzaamheden_rating}
          onChange={(id, v) => setRating('werkzaamheden_rating', id, v)}
        />
      )}

      {currentStep === 'waarden_ranking' && (
        <RankingStep
          title="Rangschik de waarden"
          description="Geef elke waarde een unieke rangorde van 1 (minst kenmerkend voor uw organisatie) tot 9 (meest kenmerkend). Elk nummer mag maar één keer gebruikt worden."
          items={waarden.map((w) => ({ id: w.id, label: w.label, description: w.description }))}
          max={9}
          values={responses.waarden_ranking}
          onChange={(id, v) => setRanking('waarden_ranking', id, v)}
        />
      )}

      {currentStep === 'waarden_rating' && (
        <RatingStep
          title="Beoordeel elke waarde"
          description="Geef aan hoe belangrijk deze waarde is voor uw organisatie."
          items={waarden.map((w) => ({ id: w.id, label: w.label, description: w.description }))}
          scale={waardenRatingScaleOrg}
          values={responses.waarden_rating}
          onChange={(id, v) => setRating('waarden_rating', id, v)}
        />
      )}

      {currentStep === 'kenmerken_ranking' && (
        <RankingStep
          title="Rangschik de organisatiekenmerken"
          description="Geef elk kenmerk een unieke rangorde van 1 (minst kenmerkend) tot 7 (meest kenmerkend). Elk nummer mag maar één keer gebruikt worden."
          items={organisatiekenmerken.map((k) => ({ id: k.id, label: k.label, description: k.description }))}
          max={7}
          values={responses.kenmerken_ranking}
          onChange={(id, v) => setRanking('kenmerken_ranking', id, v)}
        />
      )}

      {currentStep === 'kenmerken_rating' && (
        <RatingStep
          title="Beoordeel elk organisatiekenmerk"
          description="Geef aan in welke mate dit kenmerk past bij uw organisatie."
          items={organisatiekenmerken.map((k) => ({ id: k.id, label: k.label, description: k.description }))}
          scale={kenmerkenRatingScale}
          values={responses.kenmerken_rating}
          onChange={(id, v) => setRating('kenmerken_rating', id, v)}
        />
      )}

      {currentStep === 'result' && <CompletionStep />}

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
            {currentStep === 'intro' ? 'Start het profiel \u2192' : 'Volgende \u2192'}
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
        <h1 className="text-2xl font-bold text-ink">M-Score Profiel</h1>
        <p className="text-ink-light mt-2 leading-relaxed">
          Vul het M-Score profiel in voor uw vacature. Dit profiel wordt gebruikt om kandidaten
          te matchen op cultuur, waarden en interesses.
        </p>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-xl p-5 space-y-3">
        <p className="text-sm font-medium text-purple">Het profiel bestaat uit 6 stappen:</p>
        <ul className="text-sm text-ink-light space-y-2">
          <li className="flex gap-2"><span className="text-purple font-bold">1.</span> Rangschik werkzaamheden naar relevantie</li>
          <li className="flex gap-2"><span className="text-purple font-bold">2.</span> Beoordeel werkzaamheden op een schaal</li>
          <li className="flex gap-2"><span className="text-purple font-bold">3.</span> Rangschik organisatiewaarden</li>
          <li className="flex gap-2"><span className="text-purple font-bold">4.</span> Beoordeel waarden op een schaal</li>
          <li className="flex gap-2"><span className="text-purple font-bold">5.</span> Rangschik organisatiekenmerken</li>
          <li className="flex gap-2"><span className="text-purple font-bold">6.</span> Beoordeel organisatiekenmerken op een schaal</li>
        </ul>
      </div>

      <div className="flex items-center gap-3 text-sm text-ink-muted">
        <span className="text-lg">&#127891;</span>
        <span>Wetenschappelijk onderbouwd &mdash; ontwikkeld i.s.m. Prof. Dr. R.E. de Vries (VU Amsterdam)</span>
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

// ─── Completion Step ────────────────────────────────────────────────────────

function CompletionStep() {
  return (
    <div className="bg-white rounded-2xl border border-surface-border p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-400 flex items-center justify-center">
          <span className="text-4xl">&#10003;</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-ink">Profiel opgeslagen!</h2>
        <p className="text-ink-light mt-2 text-sm leading-relaxed">
          Het M-Score profiel voor uw vacature is succesvol opgeslagen. Kandidaten worden nu automatisch
          gematcht op basis van cultuur, waarden en interesses.
        </p>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-xl p-4 text-sm text-ink-light">
        Kandidaten die de Matching Scan invullen krijgen een M-Score te zien die aangeeft
        hoe goed zij bij uw organisatie passen.
      </div>

      <a
        href="/demo/opdrachtgever"
        className="inline-block px-6 py-2.5 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors"
      >
        Terug naar dashboard
      </a>
    </div>
  )
}
