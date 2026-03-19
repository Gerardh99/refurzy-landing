'use client'

import { useState } from 'react'

type FactuurStatus = 'betaald' | 'openstaand' | 'creditnota'

interface AdminFactuur {
  id: string
  factuurNummer: string
  datum: string
  opdrachtgever: string
  vacatureTitle: string
  kandidaatNaam: string
  scoutNaam: string
  bedragExclBtw: number
  btw: number
  totaalInclBtw: number
  status: FactuurStatus
}

const mockFacturen: AdminFactuur[] = [
  {
    id: 'af-1',
    factuurNummer: 'RF-F-2026-001',
    datum: '2026-02-15',
    opdrachtgever: 'TechVentures B.V.',
    vacatureTitle: 'Marketing Manager',
    kandidaatNaam: 'Anna de Jong',
    scoutNaam: 'Sophie de Graaf',
    bedragExclBtw: 10800,
    btw: 2268,
    totaalInclBtw: 13068,
    status: 'betaald',
  },
  {
    id: 'af-2',
    factuurNummer: 'RF-F-2026-002',
    datum: '2026-03-05',
    opdrachtgever: 'TechVentures B.V.',
    vacatureTitle: 'Senior Software Developer',
    kandidaatNaam: 'Thomas van Dijk',
    scoutNaam: 'Sophie de Graaf',
    bedragExclBtw: 12000,
    btw: 2520,
    totaalInclBtw: 14520,
    status: 'openstaand',
  },
  {
    id: 'af-3',
    factuurNummer: 'RF-F-2026-003',
    datum: '2026-01-20',
    opdrachtgever: 'GreenLogistics B.V.',
    vacatureTitle: 'HR Business Partner',
    kandidaatNaam: 'Sanne Visser',
    scoutNaam: 'Mark Jansen',
    bedragExclBtw: 7200,
    btw: 1512,
    totaalInclBtw: 8712,
    status: 'betaald',
  },
  {
    id: 'af-4',
    factuurNummer: 'RF-F-2026-004',
    datum: '2026-03-12',
    opdrachtgever: 'MedTech Solutions',
    vacatureTitle: 'Financial Controller',
    kandidaatNaam: 'Priya Sharma',
    scoutNaam: 'Mark Jansen',
    bedragExclBtw: 10800,
    btw: 2268,
    totaalInclBtw: 13068,
    status: 'openstaand',
  },
  {
    id: 'af-5',
    factuurNummer: 'RF-F-2025-047',
    datum: '2025-11-10',
    opdrachtgever: 'TechVentures B.V.',
    vacatureTitle: 'Product Owner',
    kandidaatNaam: 'Lars Hendriks',
    scoutNaam: 'Sophie de Graaf',
    bedragExclBtw: 7200,
    btw: 1512,
    totaalInclBtw: 8712,
    status: 'betaald',
  },
  {
    id: 'af-6',
    factuurNummer: 'RF-CN-2025-001',
    datum: '2025-12-01',
    opdrachtgever: 'TechVentures B.V.',
    vacatureTitle: 'Product Owner',
    kandidaatNaam: 'Lars Hendriks',
    scoutNaam: 'Sophie de Graaf',
    bedragExclBtw: -7200,
    btw: -1512,
    totaalInclBtw: -8712,
    status: 'creditnota',
  },
]

const opdrachtgevers = Array.from(new Set(mockFacturen.map(f => f.opdrachtgever)))

export default function AdminFacturen() {
  const [statusFilter, setStatusFilter] = useState<'alle' | FactuurStatus>('alle')
  const [ogFilter, setOgFilter] = useState<string>('alle')
  const [periodeFilter, setPeriodeFilter] = useState<string>('alle')

  const filtered = mockFacturen.filter(f => {
    if (statusFilter !== 'alle' && f.status !== statusFilter) return false
    if (ogFilter !== 'alle' && f.opdrachtgever !== ogFilter) return false
    if (periodeFilter !== 'alle') {
      const year = f.datum.substring(0, 4)
      if (periodeFilter === '2026' && year !== '2026') return false
      if (periodeFilter === '2025' && year !== '2025') return false
    }
    return true
  })

  const totaalOmzet = mockFacturen.filter(f => f.status !== 'creditnota').reduce((s, f) => s + f.totaalInclBtw, 0)
  const totaalBetaald = mockFacturen.filter(f => f.status === 'betaald').reduce((s, f) => s + f.totaalInclBtw, 0)
  const totaalOpenstaand = mockFacturen.filter(f => f.status === 'openstaand').reduce((s, f) => s + f.totaalInclBtw, 0)
  const totaalCreditnota = mockFacturen.filter(f => f.status === 'creditnota').reduce((s, f) => s + Math.abs(f.totaalInclBtw), 0)

  const fmt = (n: number) => '\u20AC' + Math.abs(n).toLocaleString('nl-NL', { minimumFractionDigits: 2 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Facturen overzicht</h1>
        <p className="text-ink-light text-sm mt-1">Alle facturen op het platform — admin weergave</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Totaal omzet</p>
          <p className="text-2xl font-bold text-ink mt-1">{fmt(totaalOmzet)}</p>
          <p className="text-[10px] text-ink-muted mt-1">Incl. BTW, excl. creditnota&apos;s</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Betaald</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{fmt(totaalBetaald)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Openstaand</p>
          <p className="text-2xl font-bold text-orange mt-1">{fmt(totaalOpenstaand)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Creditnota&apos;s</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{fmt(totaalCreditnota)}</p>
          <p className="text-[10px] text-ink-muted mt-1">Fit Garantie restituties</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {(['alle', 'betaald', 'openstaand', 'creditnota'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
              }`}>
              {s === 'alle' ? 'Alle' : s === 'betaald' ? 'Betaald' : s === 'openstaand' ? 'Openstaand' : 'Creditnota'}
            </button>
          ))}
        </div>

        <select value={ogFilter} onChange={e => setOgFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-surface-border text-xs text-ink bg-white">
          <option value="alle">Alle opdrachtgevers</option>
          {opdrachtgevers.map(og => (
            <option key={og} value={og}>{og}</option>
          ))}
        </select>

        <select value={periodeFilter} onChange={e => setPeriodeFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-surface-border text-xs text-ink bg-white">
          <option value="alle">Alle periodes</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Factuur nr</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Datum</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Opdrachtgever</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Vacature</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Kandidaat</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Scout</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-ink-muted">Bedrag</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-ink-muted">BTW</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-ink-muted">Totaal</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-ink-muted">Status</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-ink-muted"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/30">
                  <td className="px-4 py-3.5 font-mono text-ink font-medium text-xs">{f.factuurNummer}</td>
                  <td className="px-4 py-3.5 text-ink-light text-xs">{new Date(f.datum).toLocaleDateString('nl-NL')}</td>
                  <td className="px-4 py-3.5 text-ink text-xs">{f.opdrachtgever}</td>
                  <td className="px-4 py-3.5 text-ink text-xs">{f.vacatureTitle}</td>
                  <td className="px-4 py-3.5 text-ink text-xs">{f.kandidaatNaam}</td>
                  <td className="px-4 py-3.5 text-ink text-xs">{f.scoutNaam}</td>
                  <td className="px-4 py-3.5 text-right text-ink text-xs">
                    {f.status === 'creditnota' ? '-' : ''}{fmt(f.bedragExclBtw)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-ink-light text-xs">
                    {f.status === 'creditnota' ? '-' : ''}{fmt(f.btw)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-ink font-semibold text-xs">
                    {f.status === 'creditnota' ? '-' : ''}{fmt(f.totaalInclBtw)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      f.status === 'betaald' ? 'bg-green-100 text-green-700' :
                      f.status === 'openstaand' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {f.status === 'betaald' ? 'Betaald' : f.status === 'openstaand' ? 'Openstaand' : 'Creditnota'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button onClick={() => alert(`Factuur ${f.factuurNummer}.pdf gedownload`)}
                      className="px-3 py-1.5 bg-cyan/10 text-cyan rounded-lg text-xs font-medium hover:bg-cyan/20 transition-colors">
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-ink-muted text-sm">Geen facturen gevonden met de geselecteerde filters.</div>
          )}
        </div>
      </div>
    </div>
  )
}
