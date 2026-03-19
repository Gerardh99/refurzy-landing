'use client'

import { useState } from 'react'

const werkinteressen = [
  'Ik werk graag aan creatieve projecten',
  'Ik vind het belangrijk om anderen te helpen',
  'Ik zoek uitdaging in complexe problemen',
]

const kernwaarden = [
  'Integriteit is voor mij de basis van samenwerking',
  'Ik hecht veel waarde aan persoonlijke groei',
]

const organisatiecultuur = [
  'Ik werk het beste in een informele werkomgeving',
  'Ik vind hiërarchie en duidelijke structuur belangrijk',
]

export default function ProfielMatchScan() {
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const handleAnswer = (key: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const answeredCount = Object.keys(answers).length
  const totalQuestions = 35

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Matching Scan</h1>
        <p className="text-ink-light mt-1">
          Beantwoord 35 vragen over je werkinteresses, kernwaarden en ideale organisatiecultuur
        </p>
      </div>

      <div className="bg-purple/10 border border-surface-border rounded-2xl p-5 flex items-start gap-3">
        <span className="text-purple text-lg mt-0.5">&#127891;</span>
        <div className="text-sm text-gray-300 space-y-1">
          <p className="font-medium text-purple">Wetenschappelijk onderbouwd</p>
          <p>Ontwikkeld i.s.m. Prof. Dr. R.E. de Vries — Vrije Universiteit Amsterdam</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-ink-light">{answeredCount} van {totalQuestions} vragen beantwoord</span>
          <span className="text-cyan">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan to-purple-light rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Section 1: Werkinteresses */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Werkinteresses</h2>
          <p className="text-ink-muted text-sm mt-1">19 items — hieronder een preview van 3 vragen</p>
        </div>
        {werkinteressen.map((vraag, i) => (
          <LikertItem
            key={`werk-${i}`}
            id={`werk-${i}`}
            label={vraag}
            value={answers[`werk-${i}`]}
            onChange={(v) => handleAnswer(`werk-${i}`, v)}
          />
        ))}
      </div>

      {/* Section 2: Kernwaarden */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Kernwaarden</h2>
          <p className="text-ink-muted text-sm mt-1">9 items — hieronder een preview van 2 vragen</p>
        </div>
        {kernwaarden.map((vraag, i) => (
          <LikertItem
            key={`kern-${i}`}
            id={`kern-${i}`}
            label={vraag}
            value={answers[`kern-${i}`]}
            onChange={(v) => handleAnswer(`kern-${i}`, v)}
          />
        ))}
      </div>

      {/* Section 3: Organisatiecultuur */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Organisatiecultuur</h2>
          <p className="text-ink-muted text-sm mt-1">7 types — hieronder een preview van 2 vragen</p>
        </div>
        {organisatiecultuur.map((vraag, i) => (
          <LikertItem
            key={`cult-${i}`}
            id={`cult-${i}`}
            label={vraag}
            value={answers[`cult-${i}`]}
            onChange={(v) => handleAnswer(`cult-${i}`, v)}
          />
        ))}
      </div>

      <button className="px-6 py-3 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors">
        Volgende
      </button>

      <div className="bg-orange/10 border border-orange/30 rounded-2xl p-5 flex items-start gap-3">
        <span className="text-orange text-lg mt-0.5">&#9888;</span>
        <p className="text-sm text-orange">
          Dit is een demo-weergave. De volledige vragenlijst wordt in de productieversie geladen.
        </p>
      </div>
    </div>
  )
}

function LikertItem({ id, label, value, onChange }: { id: string; label: string; value?: number; onChange: (v: number) => void }) {
  const labels = ['Helemaal mee oneens', 'Mee oneens', 'Neutraal', 'Mee eens', 'Helemaal mee eens']

  return (
    <div className="space-y-3 border-b border-surface-border pb-5 last:border-0 last:pb-0">
      <p className="text-gray-300 text-sm">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-faint w-12 text-right shrink-0">1</span>
        <div className="flex-1 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all ${
                value === n
                  ? 'bg-cyan text-navy-dark'
                  : 'bg-surface-muted border border-surface-border text-ink-light hover:border-cyan/30 hover:text-gray-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-xs text-ink-faint w-12 shrink-0">5</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint px-14">
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>
    </div>
  )
}
