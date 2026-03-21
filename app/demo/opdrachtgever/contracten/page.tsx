'use client'

import { useState } from 'react'
import { mockContracten } from '@/lib/mock-data'
import { Contract } from '@/lib/types'

type StatusFilter = 'alle' | 'getekend' | 'actief' | 'verlopen'

const statusLabels: Record<Contract['status'], { label: string; className: string }> = {
  getekend: { label: 'Getekend', className: 'bg-blue-100 text-blue-700' },
  actief: { label: 'Actief', className: 'bg-green-100 text-green-700' },
  verlopen: { label: 'Verlopen', className: 'bg-gray-100 text-gray-500' },
}

export default function ContractenPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('alle')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  const filtered = statusFilter === 'alle'
    ? mockContracten
    : mockContracten.filter(c => c.status === statusFilter)

  const totalFee = mockContracten.reduce((sum, c) => sum + c.plaatsingsfee, 0)
  const activeFitGarantie = mockContracten.filter(c => c.fitGarantie && c.status === 'actief').length

  const handleDownload = (contractNummer: string) => {
    alert(`Contract ${contractNummer}.pdf gedownload`)
  }

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'alle', label: 'Alle' },
    { key: 'getekend', label: 'Getekend' },
    { key: 'actief', label: 'Actief' },
    { key: 'verlopen', label: 'Verlopen' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn contracten</h1>
        <p className="text-ink-light text-sm mt-1">
          Overzicht van al uw getekende plaatsingsovereenkomsten. Klik op een contract om het in te zien.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted uppercase tracking-wider">Totaal contracten</p>
          <p className="text-3xl font-bold text-ink mt-1">{mockContracten.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted uppercase tracking-wider">Totaal fee committed</p>
          <p className="text-3xl font-bold text-ink mt-1">{'\u20AC'}{totalFee.toLocaleString('nl-NL')}</p>
          <p className="text-xs text-ink-muted mt-0.5">excl. BTW</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted uppercase tracking-wider">Actieve Fit Garantie</p>
          <p className="text-3xl font-bold text-cyan mt-1">{activeFitGarantie}</p>
          <p className="text-xs text-ink-muted mt-0.5">12 maanden bescherming</p>
        </div>
      </div>

      <div className="flex gap-2">
        {filters.map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === f.key ? 'bg-cyan text-navy-dark' : 'bg-white border border-surface-border text-ink-light hover:border-cyan/40'
            }`}>{f.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/50">
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Contract nr</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Datum</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Vacature</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Kandidaat</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Fee (excl BTW)</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Status</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Acties</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(contract => (
              <tr key={contract.id} onClick={() => setSelectedContract(contract)}
                className="border-b border-surface-border last:border-0 hover:bg-surface-muted/30 transition-colors cursor-pointer">
                <td className="px-5 py-4 font-mono text-ink font-medium">{contract.contractNummer}</td>
                <td className="px-5 py-4 text-ink-light">
                  {new Date(contract.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-4 text-ink">{contract.vacatureTitle}</td>
                <td className="px-5 py-4 text-ink">{contract.kandidaatNaam}</td>
                <td className="px-5 py-4 text-right text-ink font-semibold">
                  {'\u20AC'}{contract.plaatsingsfee.toLocaleString('nl-NL')}
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[contract.status].className}`}>
                    {statusLabels[contract.status].label}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex gap-2 justify-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelectedContract(contract)}
                      className="px-3 py-1.5 bg-purple/10 text-purple rounded-lg text-xs font-medium hover:bg-purple/20 transition-colors">
                      Inzien
                    </button>
                    <button onClick={() => handleDownload(contract.contractNummer)}
                      className="px-3 py-1.5 bg-cyan/10 text-cyan rounded-lg text-xs font-medium hover:bg-cyan/20 transition-colors">
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-ink-muted">Geen contracten gevonden.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Contract detail modal ─────────────────────────────────────────────── */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedContract(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-surface-muted border-b border-surface-border p-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">Plaatsingsovereenkomst</h2>
                <p className="text-ink-muted text-sm mt-0.5">{selectedContract.contractNummer}</p>
              </div>
              <button onClick={() => setSelectedContract(null)} className="text-ink-muted hover:text-ink text-xl">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Partijen */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">Opdrachtgever</p>
                  <p className="text-sm font-semibold text-ink">{selectedContract.opdrachtgeverBedrijf}</p>
                  <p className="text-xs text-ink-light">{selectedContract.opdrachtgeverNaam}</p>
                  <p className="text-xs text-ink-light">{selectedContract.opdrachtgeverAdres}</p>
                  <p className="text-xs text-ink-light">KVK: {selectedContract.opdrachtgeverKvk}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">Bemiddelaar</p>
                  <p className="text-sm font-semibold text-ink">Refurzy B.V.</p>
                  <p className="text-xs text-ink-light">Keizersgracht 100, 1015 AA Amsterdam</p>
                  <p className="text-xs text-ink-light">KVK: 98765432</p>
                </div>
              </div>

              {/* Vacature & kandidaat */}
              <div className="bg-surface-muted rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-ink-muted text-xs">Vacature</p>
                    <p className="text-ink font-medium">{selectedContract.vacatureTitle}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">Kandidaat</p>
                    <p className="text-ink font-medium">{selectedContract.kandidaatNaam}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">Talent Scout</p>
                    <p className="text-ink">{selectedContract.scoutNaam}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">M-Score</p>
                    <p className="text-ink font-medium">{selectedContract.mScore}%</p>
                  </div>
                </div>
              </div>

              {/* Artikelen */}
              <div className="space-y-3 text-sm text-ink-light">
                <h3 className="font-semibold text-ink text-base">Artikelen</h3>
                <div className="bg-surface-muted rounded-xl p-4 space-y-3">
                  <p><strong className="text-ink">Artikel 1 — No cure, no pay</strong><br />
                    Opdrachtgever betaalt uitsluitend een plaatsingsfee bij daadwerkelijke start van de kandidaat. Het ontgrendelen van kandidaatprofielen is kosteloos.</p>
                  <p><strong className="text-ink">Artikel 2 — Plaatsingsfee</strong><br />
                    De plaatsingsfee bedraagt {'\u20AC'}{selectedContract.plaatsingsfee.toLocaleString('nl-NL')} excl. BTW, gebaseerd op opleidingsniveau ({selectedContract.opleidingsniveau}) en werkervaring ({selectedContract.werkervaring}). Over dit bedrag wordt 21% BTW in rekening gebracht.</p>
                  <p><strong className="text-ink">Artikel 3 — Fit Garantie</strong><br />
                    {selectedContract.fitGarantie
                      ? `Bij een M-Score van ${selectedContract.mScore}% (≥80%) geldt een Fit Garantie van 12 maanden. Vertrekt de medewerker binnen 12 maanden — ook op eigen initiatief — dan levert Refurzy eenmalig gratis een vervangende kandidaat. U betaalt hiervoor geen nieuwe plaatsingsfee. Uitsluitingen: (1) werkzaamheden wijken af van de vacatureomschrijving, (2) aantoonbaar mismanagement, (3) reorganisatie / functie verdwijnt. Bij een claim voert Refurzy een exitgesprek met de kandidaat. Meld vertrek binnen 30 dagen.`
                      : `De M-Score van ${selectedContract.mScore}% ligt onder de 80%-grens. De Fit Garantie is niet van toepassing op deze plaatsing.`
                    }</p>
                  <p><strong className="text-ink">Artikel 4 — Betaling</strong><br />
                    De fee wordt gefactureerd op de eerste werkdag van de kandidaat. Beide partijen bevestigen de startdatum en de daadwerkelijke start via het platform.</p>
                  <p><strong className="text-ink">Artikel 5 — Terugtrekking vóór startdatum</strong><br />
                    Trekt de kandidaat zich vóór de startdatum terug, dan betaalt de opdrachtgever niets. Trekt de opdrachtgever zich terug, dan wordt 50% van de plaatsingsfee in rekening gebracht.</p>
                  <p><strong className="text-ink">Artikel 6 — Anti-omzeiling</strong><br />
                    Bemiddeling buiten het Refurzy platform om van kandidaten die via Refurzy zijn geïntroduceerd, resulteert in een boete van 100% van de plaatsingsfee.</p>
                </div>
              </div>

              {/* Financieel overzicht */}
              <div className="border-t border-surface-border pt-4">
                <h3 className="font-semibold text-ink mb-3">Financieel overzicht</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-light">Plaatsingsfee (excl. BTW)</span><span className="text-ink">{'\u20AC'}{selectedContract.plaatsingsfee.toLocaleString('nl-NL')}</span></div>
                  <div className="flex justify-between"><span className="text-ink-light">BTW (21%)</span><span className="text-ink">{'\u20AC'}{selectedContract.btw.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between border-t border-surface-border pt-2 font-bold"><span className="text-ink">Totaal incl. BTW</span><span className="text-ink">{'\u20AC'}{selectedContract.totaalInclBtw.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
                </div>
              </div>

              {/* Ondertekening */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-medium text-green-700">Digitaal ondertekend</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-green-600">
                  <div>
                    <p className="text-green-500">Ondertekend door</p>
                    <p className="font-medium">{selectedContract.ondertekendDoor}</p>
                  </div>
                  <div>
                    <p className="text-green-500">Datum en tijd</p>
                    <p className="font-medium">{new Date(selectedContract.ondertekendOp).toLocaleString('nl-NL')}</p>
                  </div>
                </div>
              </div>

              {/* Fit Garantie badge */}
              {selectedContract.fitGarantie && selectedContract.status === 'actief' && (
                <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="text-sm font-medium text-cyan">Fit Garantie actief</p>
                    <p className="text-xs text-ink-light">12 maanden bescherming bij M-Score ≥80%. Geldig tot {
                      new Date(new Date(selectedContract.datum).getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL')
                    }</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => handleDownload(selectedContract.contractNummer)}
                  className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors">
                  📥 Download PDF
                </button>
                <button onClick={() => setSelectedContract(null)}
                  className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                  Sluiten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
