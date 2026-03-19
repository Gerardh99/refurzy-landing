'use client'

import { useState } from 'react'
import { mockContracten } from '@/lib/mock-data'

// Generate invoices from contracts (one invoice per contract upon placement)
const mockFacturen = mockContracten.map(c => ({
  id: `fac-${c.id}`,
  factuurNummer: c.contractNummer.replace('RF-C', 'RF-F'),
  datum: c.datum,
  contractNummer: c.contractNummer,
  vacatureTitle: c.vacatureTitle,
  kandidaatNaam: c.kandidaatNaam,
  bedragExclBtw: c.plaatsingsfee,
  btw: c.btw,
  totaalInclBtw: c.totaalInclBtw,
  status: c.status === 'verlopen' ? 'betaald' as const : c.status === 'actief' ? 'betaald' as const : 'openstaand' as const,
  betaaldOp: c.status !== 'getekend' ? new Date(new Date(c.datum).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString() : '',
}))

export default function OpdrachtgeverFacturen() {
  const [filter, setFilter] = useState<'alle' | 'betaald' | 'openstaand'>('alle')

  const filtered = filter === 'alle' ? mockFacturen : mockFacturen.filter(f => f.status === filter)
  const totaalBetaald = mockFacturen.filter(f => f.status === 'betaald').reduce((sum, f) => sum + f.totaalInclBtw, 0)
  const totaalOpenstaand = mockFacturen.filter(f => f.status === 'openstaand').reduce((sum, f) => sum + f.totaalInclBtw, 0)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn facturen</h1>
        <p className="text-ink-light text-sm mt-1">
          Overzicht van alle facturen voor succesvolle plaatsingen. Facturen worden automatisch gegenereerd bij ondertekening van de arbeidsovereenkomst.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Totaal facturen</p>
          <p className="text-2xl font-bold text-ink mt-1">{mockFacturen.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Betaald (incl. BTW)</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{'\u20AC'}{totaalBetaald.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Openstaand (incl. BTW)</p>
          <p className="text-2xl font-bold text-orange mt-1">{'\u20AC'}{totaalOpenstaand.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['alle', 'betaald', 'openstaand'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
            }`}>
            {f === 'alle' ? 'Alle' : f === 'betaald' ? 'Betaald' : 'Openstaand'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/50">
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">Factuur nr</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">Datum</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">Vacature</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">Kandidaat</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-ink-muted">Excl. BTW</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-ink-muted">BTW</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-ink-muted">Totaal</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-ink-muted">Status</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-ink-muted">Download</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/30">
                <td className="px-5 py-4 font-mono text-ink font-medium text-xs">{f.factuurNummer}</td>
                <td className="px-5 py-4 text-ink-light text-xs">{new Date(f.datum).toLocaleDateString('nl-NL')}</td>
                <td className="px-5 py-4 text-ink">{f.vacatureTitle}</td>
                <td className="px-5 py-4 text-ink">{f.kandidaatNaam}</td>
                <td className="px-5 py-4 text-right text-ink">{'\u20AC'}{f.bedragExclBtw.toLocaleString('nl-NL')}</td>
                <td className="px-5 py-4 text-right text-ink-light">{'\u20AC'}{f.btw.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-4 text-right text-ink font-semibold">{'\u20AC'}{f.totaalInclBtw.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    f.status === 'betaald' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {f.status === 'betaald' ? 'Betaald' : 'Openstaand'}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
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
          <div className="p-8 text-center text-ink-muted text-sm">Geen facturen gevonden.</div>
        )}
      </div>

      {/* Info */}
      <div className="bg-surface-muted rounded-xl p-4 text-xs text-ink-light">
        <p><strong className="text-ink">Hoe werkt facturatie?</strong> Na elke succesvolle plaatsing (ondertekening arbeidsovereenkomst) genereert Refurzy automatisch een factuur. Het bedrag wordt geïncasseerd via uw creditcard. Alle bedragen zijn exclusief 21% BTW.</p>
      </div>
    </div>
  )
}
