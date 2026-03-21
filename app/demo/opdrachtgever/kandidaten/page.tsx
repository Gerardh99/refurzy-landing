'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

// Mock data for kandidaten across all vacatures
const mockKandidaten = [
  { id: 'k-1', naam: 'Anna de Jong', anoniem: false, vacature: 'Marketing Manager', vacatureId: 'vac-1', mScore: 87, hardeCriteria: 100, status: 'arbeidsvoorwaarden', scoutNaam: 'Sophie de Graaf', datum: '2026-03-08' },
  { id: 'k-2', naam: 'Jamal Usan', anoniem: true, vacature: 'Marketing Manager', vacatureId: 'vac-1', mScore: 71, hardeCriteria: 92, status: 'voorgedragen', scoutNaam: 'Sophie de Graaf', datum: '2026-03-10' },
  { id: 'k-3', naam: 'Lisa Brouwer', anoniem: true, vacature: 'Marketing Manager', vacatureId: 'vac-1', mScore: 53, hardeCriteria: 76, status: 'afgewezen', scoutNaam: 'Mark Jansen', datum: '2026-03-11' },
  { id: 'k-4', naam: 'Thomas van Dijk', anoniem: false, vacature: 'Senior Software Developer', vacatureId: 'vac-2', mScore: 82, hardeCriteria: 95, status: 'in gesprek', scoutNaam: 'Sophie de Graaf', datum: '2026-03-12' },
  { id: 'k-5', naam: 'Priya Sharma', anoniem: true, vacature: 'Senior Software Developer', vacatureId: 'vac-2', mScore: 68, hardeCriteria: 88, status: 'voorgedragen', scoutNaam: 'Mark Jansen', datum: '2026-03-14' },
  { id: 'k-6', naam: 'Robert Bakker', anoniem: false, vacature: 'HR Business Partner', vacatureId: 'vac-3', mScore: 91, hardeCriteria: 100, status: 'arbeidsvoorwaarden', scoutNaam: 'Sophie de Graaf', datum: '2026-03-09' },
  { id: 'k-7', naam: 'Emma Visser', anoniem: true, vacature: 'Financial Controller', vacatureId: 'vac-4', mScore: 75, hardeCriteria: 84, status: 'in gesprek', scoutNaam: 'Mark Jansen', datum: '2026-03-15' },
]

const vacatureOptions = [
  { value: '', label: 'Alle vacatures' },
  { value: 'vac-1', label: 'Marketing Manager' },
  { value: 'vac-2', label: 'Senior Software Developer' },
  { value: 'vac-3', label: 'HR Business Partner' },
  { value: 'vac-4', label: 'Financial Controller' },
]

const statusOptions = ['alle', 'voorgedragen', 'in gesprek', 'arbeidsvoorwaarden', 'afgewezen']

const statusColors: Record<string, string> = {
  'voorgedragen': 'bg-blue-100 text-blue-700',
  'in gesprek': 'bg-orange/10 text-orange',
  'arbeidsvoorwaarden': 'bg-purple/10 text-purple',
  'afgewezen': 'bg-red-100 text-red-700',
}

function mScoreColor(score: number): string {
  if (score >= 80) return 'text-cyan'
  if (score >= 60) return 'text-orange'
  return 'text-red-500'
}

function mScoreBg(score: number): string {
  if (score >= 80) return 'bg-cyan/10'
  if (score >= 60) return 'bg-orange/10'
  return 'bg-red-50'
}

function hardeCriteriaColor(score: number): string {
  if (score >= 90) return 'text-green-400'
  if (score >= 75) return 'text-orange'
  return 'text-red-500'
}

function hardeCriteriaBg(score: number): string {
  if (score >= 90) return 'bg-green-400/10'
  if (score >= 75) return 'bg-orange/10'
  return 'bg-red-50'
}

function hardeCriteriaIcon(score: number): string {
  return score >= 90 ? '✓' : '⚠'
}

export default function OpdrachtgeverKandidaten() {
  const [vacatureFilter, setVacatureFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('alle')
  const [mScoreMin, setMScoreMin] = useState(0)
  const [sortBy, setSortBy] = useState<'mScore' | 'datum' | 'status'>('mScore')

  const filtered = useMemo(() => {
    let result = mockKandidaten.filter((k) => {
      const matchVacature = !vacatureFilter || k.vacatureId === vacatureFilter
      const matchStatus = statusFilter === 'alle' || k.status === statusFilter
      const matchMScore = k.mScore >= mScoreMin
      return matchVacature && matchStatus && matchMScore
    })

    if (sortBy === 'mScore') {
      result = [...result].sort((a, b) => b.mScore - a.mScore)
    } else if (sortBy === 'datum') {
      result = [...result].sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
    } else if (sortBy === 'status') {
      const order = ['arbeidsvoorwaarden', 'in gesprek', 'voorgedragen', 'afgewezen']
      result = [...result].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
    }

    return result
  }, [vacatureFilter, statusFilter, mScoreMin, sortBy])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Kandidaten</h1>
        <p className="text-ink-light font-medium mt-1">Overzicht van alle voorgedragen kandidaten voor uw vacatures</p>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-light mb-1.5">Vacature</label>
            <select
              value={vacatureFilter}
              onChange={(e) => setVacatureFilter(e.target.value)}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
            >
              {vacatureOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-light mb-1.5">M-Score minimum: {mScoreMin}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={mScoreMin}
              onChange={(e) => setMScoreMin(parseInt(e.target.value))}
              className="w-full accent-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-light mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s === 'alle' ? 'Alle statussen' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-light mb-1.5">Sorteren op</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
            >
              <option value="mScore">M-Score (hoog-laag)</option>
              <option value="datum">Datum (nieuwste eerst)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-ink-light">{filtered.length} kandidat{filtered.length !== 1 ? 'en' : ''} gevonden</p>

      {/* Kandidaten cards */}
      <div className="space-y-3">
        {filtered.map((k) => (
          <div key={k.id} className="bg-white rounded-2xl border border-surface-border p-6 hover:border-purple/30 transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple">
                    {k.anoniem ? '?' : k.naam.charAt(0)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-ink">
                      {k.anoniem ? 'Anoniem' : k.naam}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[k.status] || 'bg-surface-muted text-ink-light'}`}>
                      {k.status.charAt(0).toUpperCase() + k.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-light mt-1">
                    <span>{k.vacature}</span>
                    <span>Scout: {k.scoutNaam}</span>
                    <span>{new Date(k.datum).toLocaleDateString('nl-NL')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Harde Criteria */}
                <div className={`px-3 py-1.5 rounded-lg ${hardeCriteriaBg(k.hardeCriteria)}`}>
                  <span className={`text-sm font-bold ${hardeCriteriaColor(k.hardeCriteria)}`}>{hardeCriteriaIcon(k.hardeCriteria)} {k.hardeCriteria}%</span>
                  <span className="text-xs text-ink-muted ml-1">Criteria</span>
                </div>

                {/* M-Score */}
                <div className={`px-3 py-1.5 rounded-lg ${mScoreBg(k.mScore)}`}>
                  <span className={`text-lg font-bold ${mScoreColor(k.mScore)}`}>{k.mScore}%</span>
                  <span className="text-xs text-ink-muted ml-1">M-Score</span>
                </div>

                <Link
                  href={`/demo/opdrachtgever/kandidaat/${k.vacatureId}/${k.id}`}
                  className="px-4 py-2 bg-purple/10 text-purple text-sm font-medium rounded-lg hover:bg-purple/20 transition-colors"
                >
                  Bekijk profiel
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-ink-muted">
            <p className="text-lg">Geen kandidaten gevonden</p>
            <p className="text-sm mt-1">Pas je filters aan om meer resultaten te zien</p>
          </div>
        )}
      </div>
    </div>
  )
}
