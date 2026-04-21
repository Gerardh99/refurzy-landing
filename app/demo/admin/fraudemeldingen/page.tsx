'use client'

import { useState, useEffect } from 'react'
import {
  getFraudReports,
  updateFraudReport,
  fraudTypeLabels,
  statusLabels,
  statusColors,
  type FraudReport,
  type FraudReportStatus,
} from '@/lib/mock-fraud-reports'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    title: 'Fraudemeldingen',
    subtitle: 'Overzicht van alle binnengekomen fraudemeldingen',
    statNew: 'Nieuw',
    statReview: 'In behandeling',
    statClosed: 'Gesloten',
    statTotal: 'Totaal',
    colDate: 'Datum',
    colReporter: 'Melder',
    colSubject: 'Betrokken partij',
    colType: 'Type',
    colContext: 'Context',
    colStatus: 'Status',
    colActions: 'Actie',
    noReports: 'Geen fraudemeldingen gevonden.',
    filterAll: 'Alle',
    filterNew: 'Nieuw',
    filterReview: 'In behandeling',
    filterClosed: 'Gesloten',
    adminNoteLabel: 'Interne notitie',
    adminNotePlaceholder: 'Voeg een interne notitie toe…',
    btnSaveNote: 'Opslaan',
    btnMarkReview: 'In behandeling',
    btnMarkClosed: 'Sluiten',
    btnMarkNew: 'Heropenen',
    roleLabel: {
      scout: 'Talent Scout',
      opdrachtgever: 'Opdrachtgever',
      kandidaat: 'Kandidaat',
    },
    detailTitle: 'Meldingsdetails',
    detailReporter: 'Ingediend door',
    detailDescription: 'Beschrijving',
    detailAdminSection: 'Beheer',
    detailStatusLabel: 'Status wijzigen',
    btnClose: 'Sluiten',
    emailBadge: '📧 E-mail notificatie gesimuleerd bij indiening',
  },
  en: {
    title: 'Fraud Reports',
    subtitle: 'Overview of all incoming fraud reports',
    statNew: 'New',
    statReview: 'Under review',
    statClosed: 'Closed',
    statTotal: 'Total',
    colDate: 'Date',
    colReporter: 'Reporter',
    colSubject: 'Reported party',
    colType: 'Type',
    colContext: 'Context',
    colStatus: 'Status',
    colActions: 'Action',
    noReports: 'No fraud reports found.',
    filterAll: 'All',
    filterNew: 'New',
    filterReview: 'Under review',
    filterClosed: 'Closed',
    adminNoteLabel: 'Internal note',
    adminNotePlaceholder: 'Add an internal note…',
    btnSaveNote: 'Save',
    btnMarkReview: 'Under review',
    btnMarkClosed: 'Close',
    btnMarkNew: 'Reopen',
    roleLabel: {
      scout: 'Talent Scout',
      opdrachtgever: 'Employer',
      kandidaat: 'Candidate',
    },
    detailTitle: 'Report details',
    detailReporter: 'Submitted by',
    detailDescription: 'Description',
    detailAdminSection: 'Administration',
    detailStatusLabel: 'Change status',
    btnClose: 'Close',
    emailBadge: '📧 Email notification simulated on submission',
  },
}

type Filter = 'all' | FraudReportStatus

export default function FraudemeldingenPage() {
  const { lang } = useLang()
  const t = texts[lang]

  const [reports, setReports] = useState<FraudReport[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState('')

  useEffect(() => {
    setReports(getFraudReports())
  }, [])

  const refreshReports = () => setReports(getFraudReports())

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter)
  const selected = selectedId ? reports.find(r => r.id === selectedId) ?? null : null

  const countNew = reports.filter(r => r.status === 'nieuw').length
  const countReview = reports.filter(r => r.status === 'in_behandeling').length
  const countClosed = reports.filter(r => r.status === 'gesloten').length

  function openDetail(r: FraudReport) {
    setSelectedId(r.id)
    setNoteInput(r.adminNote ?? '')
  }

  function handleStatusChange(id: string, status: FraudReportStatus) {
    updateFraudReport(id, { status })
    refreshReports()
  }

  function handleSaveNote(id: string) {
    updateFraudReport(id, { adminNote: noteInput })
    refreshReports()
  }

  const filterBtns: { key: Filter; label: string }[] = [
    { key: 'all', label: t.filterAll },
    { key: 'nieuw', label: t.filterNew },
    { key: 'in_behandeling', label: t.filterReview },
    { key: 'gesloten', label: t.filterClosed },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
          <span>🚨</span> {t.title}
        </h1>
        <p className="text-ink-light font-medium mt-1">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t.statTotal, value: reports.length, color: 'bg-white border-surface-border text-ink' },
          { label: t.statNew, value: countNew, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: t.statReview, value: countReview, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: t.statClosed, value: countClosed, color: 'bg-green-50 border-green-200 text-green-700' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterBtns.map(fb => (
          <button
            key={fb.key}
            onClick={() => setFilter(fb.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === fb.key
                ? 'bg-purple text-white border-purple'
                : 'bg-white border-surface-border text-ink-muted hover:border-purple/30'
            }`}
          >
            {fb.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">{t.noReports}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted">
                  <th className="text-left px-5 py-3 text-ink-muted font-medium text-xs">{t.colDate}</th>
                  <th className="text-left px-5 py-3 text-ink-muted font-medium text-xs">{t.colReporter}</th>
                  <th className="text-left px-5 py-3 text-ink-muted font-medium text-xs">{t.colSubject}</th>
                  <th className="text-left px-5 py-3 text-ink-muted font-medium text-xs">{t.colType}</th>
                  <th className="text-left px-5 py-3 text-ink-muted font-medium text-xs">{t.colContext}</th>
                  <th className="text-left px-5 py-3 text-ink-muted font-medium text-xs">{t.colStatus}</th>
                  <th className="text-right px-5 py-3 text-ink-muted font-medium text-xs">{t.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                    <td className="px-5 py-4 text-ink-muted whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB')}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-ink font-medium">{r.reporter.name}</p>
                      <p className="text-xs text-ink-muted">{t.roleLabel[r.reporter.role]}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-ink font-medium">{r.subject.name}</p>
                      <p className="text-xs text-ink-muted">{t.roleLabel[r.subject.role]}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-ink-light">{fraudTypeLabels[r.fraudType][lang]}</span>
                    </td>
                    <td className="px-5 py-4 max-w-[160px]">
                      <span className="text-xs text-ink-muted italic truncate block">{r.context || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[r.status]}`}>
                        {statusLabels[r.status][lang]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openDetail(r)}
                        className="text-xs font-semibold text-cyan hover:text-cyan/70 transition-colors"
                      >
                        Bekijken →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-red-700">{t.detailTitle}</h2>
                <p className="text-xs text-red-500 mt-0.5">{selected.id} · {new Date(selected.createdAt).toLocaleString(lang === 'nl' ? 'nl-NL' : 'en-GB')}</p>
              </div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[selected.status]}`}>
                {statusLabels[selected.status][lang]}
              </span>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">

              {/* Email badge */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                <p className="text-xs text-blue-700">{t.emailBadge}</p>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.detailReporter}</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                    <p className="text-sm font-semibold text-slate-800">{selected.reporter.name}</p>
                    <p className="text-xs text-slate-500">{t.roleLabel[selected.reporter.role]}</p>
                    <p className="text-xs text-slate-400">{selected.reporter.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.colSubject}</p>
                  <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <p className="text-sm font-semibold text-slate-800">{selected.subject.name}</p>
                    <p className="text-xs text-slate-500">{t.roleLabel[selected.subject.role]}</p>
                    <p className="text-xs text-slate-400">{selected.subject.email}</p>
                  </div>
                </div>
              </div>

              {/* Type & context */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.colType}</p>
                  <p className="text-slate-700">{fraudTypeLabels[selected.fraudType][lang]}</p>
                </div>
                {selected.context && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.colContext}</p>
                    <p className="text-slate-500 italic text-xs">{selected.context}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.detailDescription}</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                </div>
              </div>

              {/* Admin section */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.detailAdminSection}</p>

                {/* Status change */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">{t.detailStatusLabel}</p>
                  <div className="flex gap-2 flex-wrap">
                    {selected.status !== 'nieuw' && (
                      <button
                        onClick={() => { handleStatusChange(selected.id, 'nieuw'); setSelectedId(null) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        {t.btnMarkNew}
                      </button>
                    )}
                    {selected.status !== 'in_behandeling' && (
                      <button
                        onClick={() => { handleStatusChange(selected.id, 'in_behandeling'); setSelectedId(null) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                      >
                        {t.btnMarkReview}
                      </button>
                    )}
                    {selected.status !== 'gesloten' && (
                      <button
                        onClick={() => { handleStatusChange(selected.id, 'gesloten'); setSelectedId(null) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                      >
                        {t.btnMarkClosed}
                      </button>
                    )}
                  </div>
                </div>

                {/* Admin note */}
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">{t.adminNoteLabel}</p>
                  <textarea
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    rows={3}
                    placeholder={t.adminNotePlaceholder}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple/30"
                  />
                  <button
                    onClick={() => { handleSaveNote(selected.id); refreshReports() }}
                    className="mt-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple text-white hover:bg-purple/90 transition-colors"
                  >
                    {t.btnSaveNote}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedId(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {t.btnClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
