'use client'

import { useState } from 'react'
import Link from 'next/link'
import { allVacatures, pipelineSteps } from '@/lib/mock-data'
import { KandidaatMatch, ProcesStatus } from '@/lib/types'
import FitScore from '@/components/FitScore'
import PipelineTracker from '@/components/PipelineTracker'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    pageTitle: 'Mijn Pipeline',
    pageSubtitle: 'Volg de voortgang van al je voorgedragen kandidaten',
    statTotal: 'Totaal voorgedragen',
    statInProcess: 'In proces bij opdrachtgever',
    statSuccessful: 'Succesvol geplaatst',
    statWaiting: 'Wacht op opdrachtgever',
    autoBannerTitle: 'Automatische herinneringen actief',
    autoBannerBody: 'Refurzy stuurt automatisch herinneringen naar opdrachtgevers bij vertragingen. Na 7 dagen zonder actie wordt de voordracht geëscaleerd. Je hoeft zelf niets te doen.',
    filterAll: 'Alle',
    today: 'Vandaag',
    daysInStep: (n: number) => `${n}d in deze stap`,
    mScore: 'M-Score',
    statusWaitingReaction: 'Wacht op reactie opdrachtgever',
    statusProfileUnlocked: 'Opdrachtgever heeft profiel ontgrendeld',
    statusWaitingDate: 'Wacht op gespreksdatum van opdrachtgever',
    statusNoAction: (n: number) => `Al ${n} dagen geen actie`,
    statusInterviewDate: (date: string) => `Gesprek: ${date}`,
    statusCandidateConfirmed: 'Kandidaat heeft bevestigd',
    statusWaitingConfirmation: 'Wacht op bevestiging kandidaat',
    statusWaitingFeedback: 'Wacht op feedback van opdrachtgever',
    statusInterviewWasOn: (date: string) => `Gesprek was op ${date}`,
    statusFollowUp: (date: string) => `Vervolggesprek: ${date}`,
    statusFollowUpTBD: 'datum volgt',
    statusFeedbackFirstInterview: (score: number, summary: string) => `Feedback eerste gesprek: ${score}/5 — ${summary}`,
    statusTermsProposal: 'Voorstel verstuurd naar kandidaat',
    statusTermsNegotiating: 'In onderhandeling',
    statusTermsAgreed: 'Arbeidsvoorwaarden akkoord — wacht op contract',
    statusTermsStarted: 'Arbeidsvoorwaarden fase gestart',
    statusInterviewFeedback: (score: number, summary: string) => `Gespreksfeedback: ${score}/5 — ${summary}`,
    statusInterviewsCompleted: (n: number) => `${n} gesprek${n > 1 ? 'ken' : ''} afgerond`,
    statusStartDate: (date: string) => `Startdatum: ${date}`,
    candidate: 'Kandidaat',
    client: 'Opdrachtgever',
    lastUpdated: 'Laatst bijgewerkt:',
    lastUpdatedToday: 'vandaag',
    lastUpdatedYesterday: 'gisteren',
    lastUpdatedDaysAgo: (n: number) => `${n} dagen geleden`,
    actionNeedsDate: 'Opdrachtgever moet gespreksdatum invoeren',
    actionNeedsFeedback: 'Opdrachtgever moet feedback geven',
    autoReminderActive: '🤖 Auto-herinnering actief',
    successPlacement: 'Succesvolle plaatsing!',
    successFeeNote: 'Fee wordt uitbetaald na bevestiging eerste werkdag',
    noResults: 'Geen kandidaten gevonden met deze filter.',
  },
  en: {
    pageTitle: 'My Pipeline',
    pageSubtitle: 'Track the progress of all your nominated candidates',
    statTotal: 'Total nominated',
    statInProcess: 'In process with client',
    statSuccessful: 'Successfully placed',
    statWaiting: 'Waiting for client',
    autoBannerTitle: 'Automatic reminders active',
    autoBannerBody: 'Refurzy automatically sends reminders to clients when there are delays. After 7 days without action the nomination is escalated. You do not need to do anything yourself.',
    filterAll: 'All',
    today: 'Today',
    daysInStep: (n: number) => `${n}d in this step`,
    mScore: 'M-Score',
    statusWaitingReaction: 'Waiting for client response',
    statusProfileUnlocked: 'Client has unlocked the profile',
    statusWaitingDate: 'Waiting for interview date from client',
    statusNoAction: (n: number) => `No action for ${n} days`,
    statusInterviewDate: (date: string) => `Interview: ${date}`,
    statusCandidateConfirmed: 'Candidate has confirmed',
    statusWaitingConfirmation: 'Waiting for candidate confirmation',
    statusWaitingFeedback: 'Waiting for feedback from client',
    statusInterviewWasOn: (date: string) => `Interview was on ${date}`,
    statusFollowUp: (date: string) => `Follow-up interview: ${date}`,
    statusFollowUpTBD: 'date to follow',
    statusFeedbackFirstInterview: (score: number, summary: string) => `First interview feedback: ${score}/5 — ${summary}`,
    statusTermsProposal: 'Proposal sent to candidate',
    statusTermsNegotiating: 'In negotiation',
    statusTermsAgreed: 'Terms agreed — waiting for contract',
    statusTermsStarted: 'Terms phase started',
    statusInterviewFeedback: (score: number, summary: string) => `Interview feedback: ${score}/5 — ${summary}`,
    statusInterviewsCompleted: (n: number) => `${n} interview${n > 1 ? 's' : ''} completed`,
    statusStartDate: (date: string) => `Start date: ${date}`,
    candidate: 'Candidate',
    client: 'Client',
    lastUpdated: 'Last updated:',
    lastUpdatedToday: 'today',
    lastUpdatedYesterday: 'yesterday',
    lastUpdatedDaysAgo: (n: number) => `${n} days ago`,
    actionNeedsDate: 'Client must enter interview date',
    actionNeedsFeedback: 'Client must provide feedback',
    autoReminderActive: '🤖 Auto-reminder active',
    successPlacement: 'Successful placement!',
    successFeeNote: 'Fee is paid out after confirmation of first working day',
    noResults: 'No candidates found with this filter.',
  },
}

// Flatten all kandidaten across vacatures for this scout
const scoutId = 'scout-1'
const allKandidaten = allVacatures.flatMap(v =>
  v.kandidaten
    .filter(k => k.scoutId === scoutId)
    .map(k => ({ ...k, vacatureTitle: v.title, vacatureId: v.id, company: v.company }))
)

export default function ScoutPipeline() {
  const { lang } = useLang()
  const t = texts[lang]

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
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.pageSubtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-sm text-ink-light font-medium">{t.statTotal}</p>
          <p className="text-2xl font-bold text-ink">{allKandidaten.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-sm text-ink-light font-medium">{t.statInProcess}</p>
          <p className="text-2xl font-bold text-cyan">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-sm text-ink-light font-medium">{t.statSuccessful}</p>
          <p className="text-2xl font-bold text-green-600">{successCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-4">
          <p className="text-sm text-ink-light font-medium">{t.statWaiting}</p>
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
          <p className="font-medium text-ink">{t.autoBannerTitle}</p>
          <p className="mt-1">{t.autoBannerBody}</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('alle')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'alle' ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
          }`}>
          {t.filterAll} ({allKandidaten.length})
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
                      {dagenInStap === 0 ? t.today : t.daysInStep(dagenInStap)}
                    </span>
                  )}
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <FitScore score={k.deVriesFit} size="sm" />
                      <span className="text-xs text-ink-muted">{t.mScore}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline tracker */}
              <PipelineTracker
                currentStatus={k.procesStatus}
                isRejected={k.procesStatus === 'afgewezen'}
              />

              {/* ─── Detail info block ─── */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                {/* Voorgesteld — waiting for employer to accept */}
                {k.procesStatus === 'voorgesteld' && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📋</span>
                    <span className="text-sm text-ink font-medium">{t.statusWaitingReaction}</span>
                  </div>
                )}

                {/* Contract akkoord — employer accepted, profile unlocked */}
                {k.procesStatus === 'contract_akkoord' && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">✅</span>
                    <span className="text-sm text-ink font-semibold">{t.statusProfileUnlocked}</span>
                  </div>
                )}

                {/* Gesprek plannen — waiting for employer to set date */}
                {k.procesStatus === 'gesprek_plannen' && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📅</span>
                      <span className="text-sm text-orange font-semibold">{t.statusWaitingDate}</span>
                    </div>
                    {!k.gesprekDatum && dagenInStap !== null && dagenInStap >= 3 && (
                      <div className="flex items-center gap-2 ml-8">
                        <span className="text-orange">⚠️</span>
                        <span className="text-orange text-sm font-medium">{t.statusNoAction(dagenInStap)}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Gesprek gepland — date set, waiting for candidate confirmation */}
                {k.procesStatus === 'gesprek_gepland' && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📅</span>
                      <span className="text-sm text-ink font-semibold">
                        {t.statusInterviewDate(k.gesprekDatum ? new Date(k.gesprekDatum).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : '—')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-8">
                      {k.kandidaatBevestigd ? (
                        <>
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-green-700 text-sm font-medium">{t.statusCandidateConfirmed}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-orange">⏳</span>
                          <span className="text-orange text-sm font-medium">{t.statusWaitingConfirmation}</span>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Feedback geven — interview done, waiting for employer feedback */}
                {k.procesStatus === 'feedback_geven' && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💬</span>
                      <span className="text-sm text-orange font-semibold">{t.statusWaitingFeedback}</span>
                    </div>
                    {k.gesprekDatum && (
                      <div className="flex items-center gap-2 ml-8">
                        <span>📅</span>
                        <span className="text-sm text-ink-light font-medium">
                          {t.statusInterviewWasOn(new Date(k.gesprekDatum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' }))}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Vervolggesprek — follow-up scheduled */}
                {k.procesStatus === 'vervolggesprek' && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🔄</span>
                      <span className="text-sm text-ink font-semibold">
                        {t.statusFollowUp(k.vervolggesprekDatum ? new Date(k.vervolggesprekDatum).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' }) : t.statusFollowUpTBD)}
                      </span>
                    </div>
                    {k.feedbackScore && (
                      <div className="flex items-center gap-2 ml-8">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-ink font-medium">
                          {t.statusFeedbackFirstInterview(k.feedbackScore, k.feedbackSamenvatting || '')}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Arbeidsvoorwaarden — negotiation phase */}
                {k.procesStatus === 'arbeidsvoorwaarden' && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💼</span>
                      <span className="text-sm text-ink font-semibold">
                        {k.arbeidsvoorwaardenStatus === 'voorstel_verstuurd' && t.statusTermsProposal}
                        {k.arbeidsvoorwaardenStatus === 'in_onderhandeling' && t.statusTermsNegotiating}
                        {k.arbeidsvoorwaardenStatus === 'akkoord' && t.statusTermsAgreed}
                        {!k.arbeidsvoorwaardenStatus && t.statusTermsStarted}
                      </span>
                    </div>
                    {k.feedbackScore && (
                      <div className="flex items-center gap-2 ml-8">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-ink font-medium">
                          {t.statusInterviewFeedback(k.feedbackScore, k.feedbackSamenvatting || '')}
                        </span>
                      </div>
                    )}
                    {k.gesprekken && k.gesprekken.length > 0 && (
                      <div className="flex items-center gap-2 ml-8">
                        <span>🤝</span>
                        <span className="text-sm text-ink font-medium">
                          {t.statusInterviewsCompleted(k.gesprekken.length)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Contract getekend — placed! */}
                {k.procesStatus === 'contract_getekend' && (
                  <>
                    {k.startDatum && (
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📅</span>
                        <span className="text-sm text-green-700 font-semibold">
                          {t.statusStartDate(new Date(k.startDatum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}
                        </span>
                      </div>
                    )}
                    {(k.startDatumBevestigdKandidaat !== undefined || k.startDatumBevestigdOpdrachtgever !== undefined) && (
                      <div className="flex items-center gap-4 text-sm ml-8">
                        <span className={`font-medium ${k.startDatumBevestigdKandidaat ? 'text-green-600' : 'text-orange'}`}>
                          {k.startDatumBevestigdKandidaat ? '✓' : '⏳'} {t.candidate}
                        </span>
                        <span className={`font-medium ${k.startDatumBevestigdOpdrachtgever ? 'text-green-600' : 'text-orange'}`}>
                          {k.startDatumBevestigdOpdrachtgever ? '✓' : '⏳'} {t.client}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Last activity line */}
                {dagenSindsUpdate !== null && k.procesStatus !== 'contract_getekend' && (
                  <div className="flex items-center gap-2 text-sm text-ink-light font-medium mt-1 pt-2 border-t border-slate-200">
                    <span>🕐</span>
                    <span>
                      {t.lastUpdated}{' '}
                      {dagenSindsUpdate === 0 ? t.lastUpdatedToday : dagenSindsUpdate === 1 ? t.lastUpdatedYesterday : t.lastUpdatedDaysAgo(dagenSindsUpdate)}
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
                        ? t.actionNeedsDate
                        : t.actionNeedsFeedback}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-cyan/10 text-cyan rounded-lg text-xs font-medium">
                    {t.autoReminderActive}
                  </span>
                </div>
              )}

              {/* Contract getekend celebration */}
              {k.procesStatus === 'contract_getekend' && (
                <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-sm font-medium text-green-700">{t.successPlacement}</p>
                    <p className="text-xs text-green-600">{t.successFeeNote}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
          <p className="text-ink-muted text-sm">{t.noResults}</p>
        </div>
      )}
    </div>
  )
}
