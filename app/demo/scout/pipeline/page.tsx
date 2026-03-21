'use client'

import { useState } from 'react'
import Link from 'next/link'
import { allVacatures, pipelineSteps } from '@/lib/mock-data'
import { KandidaatMatch, ProcesStatus } from '@/lib/types'
import FitScore from '@/components/FitScore'
import PipelineTracker from '@/components/PipelineTracker'

// Flatten all kandidaten across vacatures for this scout
const scoutId = 'scout-1'
const allKandidaten = allVacatures.flatMap(v =>
  v.kandidaten
    .filter(k => k.scoutId === scoutId)
    .map(k => ({ ...k, vacatureTitle: v.title, vacatureId: v.id, company: v.company }))
)

export default function ScoutPipeline() {
  const [filter, setFilter] = useState<ProcesStatus | 'alle'>('alle')

  const filtered = filter === 'alle' ? allKandidaten : allKandidaten.filter(k => k.procesStatus === filter)

  const statusCounts = allKandidaten.reduce((acc, k) => {
    acc[k.procesStatus] = (acc[k.procesStatus] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Count active (non-final) statuses
  const activeCount = allKandidaten.filter(k => k.procesStatus !== 'contract_getekend' && k.procesStatus !== 'afgewezen').length
  const successCount = allKandidaten.filter(k => k.procesStatus === 'contract_getekend').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn Pipeline</h1>
        <p className="text-ink-light mt-1">Volg de voortgang van al je voorgedragen kandidaten</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-sm text-ink-light font-medium">Totaal voorgedragen</p>
          <p className="text-2xl font-bold text-ink">{allKandidaten.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-sm text-ink-light font-medium">In proces bij opdrachtgever</p>
          <p className="text-2xl font-bold text-cyan">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-sm text-ink-light font-medium">Succesvol geplaatst</p>
          <p className="text-2xl font-bold text-green-600">{successCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-sm text-ink-light font-medium">Wacht op opdrachtgever</p>
          <p className="text-2xl font-bold text-orange">
            {allKandidaten.filter(k =>
              k.procesStatus === 'gesprek_plannen' || k.procesStatus === 'feedback_geven'
            ).length}
          </p>
        </div>
      </div>

      {/* Auto-nudge info banner */}
      <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-lg">🤖</span>
        <div className="text-sm text-ink-light">
          <p className="font-medium text-ink">Automatische herinneringen actief</p>
          <p className="mt-1">Refurzy stuurt automatisch herinneringen naar opdrachtgevers bij vertragingen. Na 7 dagen zonder actie wordt de voordracht geëscaleerd. Je hoeft zelf niets te doen.</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('alle')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'alle' ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
          }`}>
          Alle ({allKandidaten.length})
        </button>
        {pipelineSteps.map(step => (
          statusCounts[step.key] ? (
            <button key={step.key} onClick={() => setFilter(step.key as ProcesStatus)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === step.key ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
              }`}>
              {step.icon} {step.label} ({statusCounts[step.key]})
            </button>
          ) : null
        ))}
      </div>

      {/* Kandidaten list */}
      <div className="space-y-3">
        {filtered.map(k => {
          const needsAction = k.procesStatus === 'gesprek_plannen' || k.procesStatus === 'feedback_geven'
          // Calculate days in current step
          const dagenInStap = k.stapStartDatum
            ? Math.max(0, Math.floor((new Date('2026-03-21').getTime() - new Date(k.stapStartDatum).getTime()) / (1000 * 60 * 60 * 24)))
            : null
          const dagenSindsUpdate = k.laatsteActiviteit
            ? Math.max(0, Math.floor((new Date('2026-03-21').getTime() - new Date(k.laatsteActiviteit).getTime()) / (1000 * 60 * 60 * 24)))
            : null

          return (
            <div key={`${k.vacatureId}-${k.id}`}
              className={`bg-white rounded-2xl border p-5 space-y-3 transition-colors ${
                needsAction ? 'border-orange/40' : 'border-surface-border'
              }`}>
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple/20 text-purple flex items-center justify-center text-sm font-bold">
                    {k.initialen}
                  </div>
                  <div>
                    <p className="text-ink font-bold">{k.naam}</p>
                    <p className="text-sm text-ink-light font-medium">{k.vacatureTitle} · {k.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Days in step indicator */}
                  {dagenInStap !== null && k.procesStatus !== 'contract_getekend' && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                      dagenInStap > 5 ? 'bg-orange/10 text-orange' : 'bg-surface-muted text-ink-muted'
                    }`}>
                      {dagenInStap === 0 ? 'Vandaag' : `${dagenInStap}d in deze stap`}
                    </span>
                  )}
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <FitScore score={k.deVriesFit} size="sm" />
                      <span className="text-xs text-ink-muted">M-Score</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline tracker */}
              <PipelineTracker
                currentStatus={k.procesStatus}
                isRejected={k.procesStatus === 'afgewezen'}
              />

              {/* ─── Detail info block: data from opdrachtgever & kandidaat ─── */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                {/* Voorgesteld — waiting for employer to accept */}
                {k.procesStatus === 'voorgesteld' && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-ink-muted">📋</span>
                    <span className="text-ink-light">Wacht op reactie opdrachtgever</span>
                  </div>
                )}

                {/* Contract akkoord — employer accepted, profile unlocked */}
                {k.procesStatus === 'contract_akkoord' && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>✅</span>
                    <span className="text-ink font-medium">Opdrachtgever heeft profiel ontgrendeld</span>
                  </div>
                )}

                {/* Gesprek plannen — waiting for employer to set date */}
                {k.procesStatus === 'gesprek_plannen' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span>📅</span>
                      <span className="text-orange font-medium">Wacht op gespreksdatum van opdrachtgever</span>
                    </div>
                    {!k.gesprekDatum && dagenInStap !== null && dagenInStap >= 3 && (
                      <div className="flex items-center gap-2 text-sm ml-6">
                        <span className="text-orange">⚠️</span>
                        <span className="text-orange text-xs">Al {dagenInStap} dagen geen actie</span>
                      </div>
                    )}
                  </>
                )}

                {/* Gesprek gepland — date set, waiting for candidate confirmation */}
                {k.procesStatus === 'gesprek_gepland' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span className="text-ink font-medium">
                          Gesprek: {k.gesprekDatum ? new Date(k.gesprekDatum).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm ml-6">
                      {k.kandidaatBevestigd ? (
                        <>
                          <span className="text-green-600">✓</span>
                          <span className="text-green-700 text-xs font-medium">Kandidaat heeft bevestigd</span>
                        </>
                      ) : (
                        <>
                          <span className="text-orange">⏳</span>
                          <span className="text-orange text-xs font-medium">Wacht op bevestiging kandidaat</span>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Feedback geven — interview done, waiting for employer feedback */}
                {k.procesStatus === 'feedback_geven' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span>💬</span>
                      <span className="text-orange font-medium">Wacht op feedback van opdrachtgever</span>
                    </div>
                    {k.gesprekDatum && (
                      <div className="flex items-center gap-2 text-sm ml-6">
                        <span className="text-ink-muted">📅</span>
                        <span className="text-xs text-ink-light">
                          Gesprek was op {new Date(k.gesprekDatum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Vervolggesprek — follow-up scheduled */}
                {k.procesStatus === 'vervolggesprek' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span>🔄</span>
                      <span className="text-ink font-medium">
                        Vervolggesprek: {k.vervolggesprekDatum ? new Date(k.vervolggesprekDatum).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' }) : 'datum volgt'}
                      </span>
                    </div>
                    {k.feedbackScore && (
                      <div className="flex items-center gap-2 text-sm ml-6">
                        <span className="text-ink-muted">⭐</span>
                        <span className="text-xs text-ink-light">
                          Feedback eerste gesprek: {k.feedbackScore}/5 — {k.feedbackSamenvatting || ''}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Arbeidsvoorwaarden — negotiation phase */}
                {k.procesStatus === 'arbeidsvoorwaarden' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span>💼</span>
                      <span className="text-ink font-medium">
                        {k.arbeidsvoorwaardenStatus === 'voorstel_verstuurd' && 'Voorstel verstuurd naar kandidaat'}
                        {k.arbeidsvoorwaardenStatus === 'in_onderhandeling' && 'In onderhandeling'}
                        {k.arbeidsvoorwaardenStatus === 'akkoord' && 'Arbeidsvoorwaarden akkoord — wacht op contract'}
                        {!k.arbeidsvoorwaardenStatus && 'Arbeidsvoorwaarden fase gestart'}
                      </span>
                    </div>
                    {k.feedbackScore && (
                      <div className="flex items-center gap-2 text-sm ml-6">
                        <span className="text-ink-muted">⭐</span>
                        <span className="text-xs text-ink-light">
                          Gespreksfeedback: {k.feedbackScore}/5 — {k.feedbackSamenvatting || ''}
                        </span>
                      </div>
                    )}
                    {k.gesprekken && k.gesprekken.length > 0 && (
                      <div className="flex items-center gap-2 text-sm ml-6">
                        <span className="text-ink-muted">🤝</span>
                        <span className="text-xs text-ink-light">
                          {k.gesprekken.length} gesprek{k.gesprekken.length > 1 ? 'ken' : ''} afgerond
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Contract getekend — placed! */}
                {k.procesStatus === 'contract_getekend' && (
                  <>
                    {k.startDatum && (
                      <div className="flex items-center gap-2 text-sm">
                        <span>📅</span>
                        <span className="text-green-700 font-medium">
                          Startdatum: {new Date(k.startDatum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    {(k.startDatumBevestigdKandidaat !== undefined || k.startDatumBevestigdOpdrachtgever !== undefined) && (
                      <div className="flex items-center gap-4 text-xs ml-6">
                        <span className={k.startDatumBevestigdKandidaat ? 'text-green-600' : 'text-orange'}>
                          {k.startDatumBevestigdKandidaat ? '✓' : '⏳'} Kandidaat
                        </span>
                        <span className={k.startDatumBevestigdOpdrachtgever ? 'text-green-600' : 'text-orange'}>
                          {k.startDatumBevestigdOpdrachtgever ? '✓' : '⏳'} Opdrachtgever
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Last activity line */}
                {dagenSindsUpdate !== null && k.procesStatus !== 'contract_getekend' && (
                  <div className="flex items-center gap-2 text-xs text-ink-muted mt-1 pt-2 border-t border-slate-100">
                    <span>🕐</span>
                    <span>
                      Laatst bijgewerkt: {dagenSindsUpdate === 0 ? 'vandaag' : dagenSindsUpdate === 1 ? 'gisteren' : `${dagenSindsUpdate} dagen geleden`}
                    </span>
                  </div>
                )}
              </div>

              {/* Action bar — auto-nudge status instead of manual nudge buttons */}
              {needsAction && (
                <div className="flex items-center justify-between bg-orange/5 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-orange">⏳</span>
                    <p className="text-sm text-orange font-medium">
                      {k.procesStatus === 'gesprek_plannen'
                        ? 'Opdrachtgever moet gespreksdatum invoeren'
                        : 'Opdrachtgever moet feedback geven'}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-cyan/10 text-cyan rounded-lg text-xs font-medium">
                    🤖 Auto-herinnering actief
                  </span>
                </div>
              )}

              {/* Contract getekend celebration */}
              {k.procesStatus === 'contract_getekend' && (
                <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-sm font-medium text-green-700">Succesvolle plaatsing!</p>
                    <p className="text-xs text-green-600">Fee wordt uitbetaald na bevestiging eerste werkdag</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
          <p className="text-ink-muted text-sm">Geen kandidaten gevonden met deze filter.</p>
        </div>
      )}
    </div>
  )
}
