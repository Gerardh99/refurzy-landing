'use client'

import { useState } from 'react'
import { mockContracten } from '@/lib/mock-data'
import { useLang } from '@/lib/i18n'

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

const texts = {
  nl: {
    pageTitle: 'Mijn facturen',
    pageSubtitle: 'Overzicht van alle facturen voor succesvolle plaatsingen. Facturen worden automatisch gegenereerd bij ondertekening van de arbeidsovereenkomst.',
    statTotal: 'Totaal facturen',
    statPaid: 'Betaald (incl. BTW)',
    statOpen: 'Openstaand (incl. BTW)',
    filterAll: 'Alle',
    filterPaid: 'Betaald',
    filterOpen: 'Openstaand',
    colInvoiceNr: 'Factuur nr',
    colDate: 'Datum',
    colVacature: 'Vacature',
    colKandidaat: 'Kandidaat',
    colExclVat: 'Excl. BTW',
    colVat: 'BTW',
    colTotal: 'Totaal',
    colStatus: 'Status',
    colDownload: 'Download',
    statusPaid: 'Betaald',
    statusOpen: 'Openstaand',
    noInvoices: 'Geen facturen gevonden.',
    infoTitle: 'Hoe werkt facturatie?',
    infoText: 'Na elke succesvolle plaatsing (ondertekening arbeidsovereenkomst) genereert Refurzy automatisch een factuur. Het bedrag wordt geïncasseerd via uw creditcard. Alle bedragen zijn exclusief 21% BTW.',
  },
  en: {
    pageTitle: 'My invoices',
    pageSubtitle: 'Overview of all invoices for successful placements. Invoices are automatically generated upon signing of the employment contract.',
    statTotal: 'Total invoices',
    statPaid: 'Paid (incl. VAT)',
    statOpen: 'Outstanding (incl. VAT)',
    filterAll: 'All',
    filterPaid: 'Paid',
    filterOpen: 'Outstanding',
    colInvoiceNr: 'Invoice no.',
    colDate: 'Date',
    colVacature: 'Vacancy',
    colKandidaat: 'Candidate',
    colExclVat: 'Excl. VAT',
    colVat: 'VAT',
    colTotal: 'Total',
    colStatus: 'Status',
    colDownload: 'Download',
    statusPaid: 'Paid',
    statusOpen: 'Outstanding',
    noInvoices: 'No invoices found.',
    infoTitle: 'How does invoicing work?',
    infoText: 'After every successful placement (signing of employment contract) Refurzy automatically generates an invoice. The amount is collected via your credit card. All amounts are exclusive of 21% VAT.',
  },
}

export default function OpdrachtgeverFacturen() {
  const { lang } = useLang()
  const t = texts[lang]

  const [filter, setFilter] = useState<'alle' | 'betaald' | 'openstaand'>('alle')

  const filtered = filter === 'alle' ? mockFacturen : mockFacturen.filter(f => f.status === filter)
  const totaalBetaald = mockFacturen.filter(f => f.status === 'betaald').reduce((sum, f) => sum + f.totaalInclBtw, 0)
  const totaalOpenstaand = mockFacturen.filter(f => f.status === 'openstaand').reduce((sum, f) => sum + f.totaalInclBtw, 0)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-light text-sm mt-1">
          {t.pageSubtitle}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">{t.statTotal}</p>
          <p className="text-2xl font-bold text-ink mt-1">{mockFacturen.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">{t.statPaid}</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{'\u20AC'}{totaalBetaald.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">{t.statOpen}</p>
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
            {f === 'alle' ? t.filterAll : f === 'betaald' ? t.filterPaid : t.filterOpen}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/50">
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">{t.colInvoiceNr}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">{t.colDate}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">{t.colVacature}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted">{t.colKandidaat}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-ink-muted">{t.colExclVat}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-ink-muted">{t.colVat}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-ink-muted">{t.colTotal}</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-ink-muted">{t.colStatus}</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-ink-muted">{t.colDownload}</th>
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
                    {f.status === 'betaald' ? t.statusPaid : t.statusOpen}
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
          <div className="p-8 text-center text-ink-muted text-sm">{t.noInvoices}</div>
        )}
      </div>

      {/* Info */}
      <div className="bg-surface-muted rounded-xl p-4 text-xs text-ink-light">
        <p><strong className="text-ink">{t.infoTitle}</strong> {t.infoText}</p>
      </div>
    </div>
  )
}
