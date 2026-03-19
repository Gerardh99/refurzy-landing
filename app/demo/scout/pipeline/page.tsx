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
  const [showNudgeModal, setShowNudgeModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedKandidaat, setSelectedKandidaat] = useState<typeof allKandidaten[0] | null>(null)
  const [nudgeSent, setNudgeSent] = useState<Set<string>>(new Set())
  const [reportSent, setReportSent] = useState<Set<string>>(new Set())

  const filtered = filter === 'alle' ? allKandidaten : allKandidaten.filter(k => k.procesStatus === filter)

  const statusCounts = allKandidaten.reduce((acc, k) => {
    acc[k.procesStatus] = (acc[k.procesStatus] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleNudge = (k: typeof allKandidaten[0]) => {
    setSelectedKandidaat(k)
    const nudgeCount = (k.nudges?.length || 0) + (nudgeSent.has(k.id) ? 1 : 0)
    if (nudgeCount >= 2) {
      setShowReportModal(true)
    } else {
      setShowNudgeModal(true)
    }
  }

  const sendNudge = () => {
    if (selectedKandidaat) {
      setNudgeSent(new Set(Array.from(nudgeSent).concat(selectedKandidaat.id)))
    }
    setShowNudgeModal(false)
  }

  const sendReport = () => {
    if (selectedKandidaat) {
      setReportSent(new Set(Array.from(reportSent).concat(selectedKandidaat.id)))
    }
    setShowReportModal(false)
  }

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
          <p className="text-xs text-ink-muted">Totaal voorgedragen</p>
          <p className="text-2xl font-bold text-ink">{allKandidaten.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-xs text-ink-muted">Actief in pipeline</p>
          <p className="text-2xl font-bold text-cyan">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-xs text-ink-muted">Succesvol geplaatst</p>
          <p className="text-2xl font-bold text-green-600">{successCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-xs text-ink-muted">Actie vereist</p>
          <p className="text-2xl font-bold text-orange">
            {allKandidaten.filter(k =>
              k.procesStatus === 'gesprek_plannen' || k.procesStatus === 'feedback_geven'
            ).length}
          </p>
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
          const nudgeCount = (k.nudges?.length || 0) + (nudgeSent.has(k.id) ? 1 : 0)
          const isReported = reportSent.has(k.id)

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
                    <p className="text-ink font-semibold">{k.naam}</p>
                    <p className="text-xs text-ink-muted">{k.vacatureTitle} · {k.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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

              {/* Action bar */}
              {needsAction && (
                <div className="flex items-center justify-between bg-orange/5 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-orange">⚠️</span>
                    <p className="text-sm text-orange font-medium">
                      {k.procesStatus === 'gesprek_plannen'
                        ? 'Opdrachtgever moet gespreksdatum invoeren'
                        : 'Opdrachtgever moet feedback geven'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isReported ? (
                      <button onClick={() => handleNudge(k)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          nudgeCount === 0
                            ? 'bg-orange/20 text-orange hover:bg-orange/30'
                            : nudgeCount === 1
                              ? 'bg-orange text-white hover:bg-orange/90'
                              : 'bg-red-500 text-white hover:bg-red-600'
                        }`}>
                        {nudgeCount === 0 ? '💬 Herinnering sturen' :
                         nudgeCount === 1 ? '⚠️ Urgente herinnering' : '🚨 Rapporteer bij Refurzy'}
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-medium">
                        🚨 Gerapporteerd — Refurzy neemt contact op
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Contract getekend celebration */}
              {k.procesStatus === 'contract_getekend' && (
                <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-sm font-medium text-green-700">Succesvolle plaatsing!</p>
                    <p className="text-xs text-green-600">Fee wordt uitbetaald na bevestiging</p>
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

      {/* ─── Nudge modal ─────────────────────────────────────────────────────────── */}
      {showNudgeModal && selectedKandidaat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-ink">Herinnering sturen</h2>
            <p className="text-ink-light text-sm">
              Stuur een herinnering aan de opdrachtgever om actie te ondernemen voor {selectedKandidaat.naam}.
            </p>
            <div className="bg-surface-muted rounded-xl p-4">
              <p className="text-sm text-ink">
                {(selectedKandidaat.nudges?.length || 0) === 0
                  ? `"Hi! ${selectedKandidaat.naam} wacht op een uitnodiging voor een gesprek. Plan je het deze week in?"`
                  : `"⚠️ Urgente herinnering: ${selectedKandidaat.naam} wacht al een tijd op een reactie. Kun je vandaag nog actie ondernemen?"`
                }
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNudgeModal(false)}
                className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                Annuleren
              </button>
              <button onClick={sendNudge}
                className="flex-1 py-2.5 bg-orange text-white rounded-lg font-semibold text-sm hover:bg-orange/90 transition-colors">
                Verstuur herinnering
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Report modal ────────────────────────────────────────────────────────── */}
      {showReportModal && selectedKandidaat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-red-600">🚨 Rapporteer bij Refurzy</h2>
            <p className="text-ink-light text-sm">
              Je hebt al 2 herinneringen gestuurd, maar de opdrachtgever reageert niet.
              Refurzy neemt persoonlijk contact op.
            </p>
            <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700">
              <p className="font-medium">Wat gebeurt er?</p>
              <ul className="mt-2 space-y-1 text-red-600">
                <li>• Refurzy belt de opdrachtgever binnen 24 uur</li>
                <li>• De kandidaat wordt op de hoogte gesteld van de vertraging</li>
                <li>• Dit wordt geregistreerd op het account van de opdrachtgever</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReportModal(false)}
                className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                Annuleren
              </button>
              <button onClick={sendReport}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors">
                Rapporteer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
