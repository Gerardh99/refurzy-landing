'use client'

import { useState } from 'react'
import { mockContracten } from '@/lib/mock-data'
import { Contract } from '@/lib/types'
import { useLang } from '@/lib/i18n'

type StatusFilter = 'alle' | 'getekend' | 'actief' | 'verlopen'

const texts = {
  nl: {
    pageTitle: 'Mijn contracten',
    pageSubtitle: 'Overzicht van al uw getekende plaatsingsovereenkomsten. Klik op een contract om het in te zien.',
    statTotalLabel: 'Totaal contracten',
    statFeeLabel: 'Totaal fee committed',
    statFeeNote: 'excl. BTW',
    statFitLabel: 'Actieve Fit Garantie',
    statFitNote: '12 maanden bescherming',
    filterAll: 'Alle',
    filterSigned: 'Getekend',
    filterActive: 'Actief',
    filterExpired: 'Verlopen',
    colContractNr: 'Contract nr',
    colDate: 'Datum',
    colVacature: 'Vacature',
    colKandidaat: 'Kandidaat',
    colFee: 'Fee (excl BTW)',
    colStatus: 'Status',
    colActions: 'Acties',
    actionView: 'Inzien',
    actionPdf: 'PDF',
    noContracts: 'Geen contracten gevonden.',
    // Modal
    modalTitle: 'Plaatsingsovereenkomst',
    partyEmployer: 'Opdrachtgever',
    partyMediator: 'Bemiddelaar',
    labelVacature: 'Vacature',
    labelKandidaat: 'Kandidaat',
    labelTalentScout: 'Talent Scout',
    labelMScore: 'M-Score',
    articlesTitle: 'Artikelen',
    art1Title: 'Artikel 1 — No cure, no pay',
    art1: 'Opdrachtgever betaalt uitsluitend een plaatsingsfee bij daadwerkelijke start van de kandidaat. Het ontgrendelen van kandidaatprofielen is kosteloos.',
    art2Title: 'Artikel 2 — Plaatsingsfee',
    art2: (fee: string, level: string, exp: string) => `De plaatsingsfee bedraagt ${fee} excl. BTW, gebaseerd op opleidingsniveau (${level}) en werkervaring (${exp}). Over dit bedrag wordt 21% BTW in rekening gebracht.`,
    art3Title: 'Artikel 3 — Fit Garantie',
    art3Yes: (score: number) => `Bij een M-Score van ${score}% (≥80%) geldt een Fit Garantie van 12 maanden vanaf de bevestigde startdatum. De garantie dekt uitsluitend vertrek dat aantoonbaar het gevolg is van een mismatch op cultuurfit, waardenfit of organisatiefit. Niet gedekt: functioneringsproblemen, persoonlijke omstandigheden, extern aanbod, gewijzigde functie-inhoud, mismanagement, reorganisatie, ziekte/arbeidsongeschiktheid, en situaties waarin de input in de Matching Scan niet overeenkomt met de praktijk (oordeel medewerker). Procedure: opdrachtgever meldt vertrek binnen 30 kalenderdagen; Refurzy voert een exitgesprek met de medewerker; de medewerker bevestigt de fit-mismatch; het eindoordeel ligt bij Refurzy. Zonder exitgesprek vervalt de claim. Bij goedkeuring levert Refurzy eenmalig een vervangende kandidaat zonder nieuwe plaatsingsfee.`,
    art3No: (score: number) => `De M-Score van ${score}% ligt onder de 80%-grens. De Fit Garantie is niet van toepassing op deze plaatsing.`,
    art4Title: 'Artikel 4 — Betaling',
    art4: 'De fee wordt gefactureerd op de eerste werkdag van de kandidaat. Beide partijen bevestigen de startdatum en de daadwerkelijke start via het platform.',
    art5Title: 'Artikel 5 — Terugtrekking vóór startdatum',
    art5: 'Trekt de kandidaat zich vóór de startdatum terug, dan betaalt de opdrachtgever niets. Trekt de opdrachtgever zich terug, dan wordt 50% van de plaatsingsfee in rekening gebracht.',
    art6Title: 'Artikel 6 — Anti-omzeiling',
    art6: 'Bemiddeling buiten het Refurzy platform om van kandidaten die via Refurzy zijn geïntroduceerd, resulteert in een boete van 100% van de plaatsingsfee.',
    finTitle: 'Financieel overzicht',
    finFeeExcl: 'Plaatsingsfee (excl. BTW)',
    finBtw: 'BTW (21%)',
    finTotal: 'Totaal incl. BTW',
    signedTitle: 'Digitaal ondertekend',
    signedBy: 'Ondertekend door',
    signedAt: 'Datum en tijd',
    fitActive: 'Fit Garantie actief',
    fitDesc: (date: string) => `12 maanden bescherming bij M-Score ≥80%. Geldig tot ${date}`,
    downloadPdf: '📥 Download PDF',
    close: 'Sluiten',
    statusActief: 'Actief',
    statusGetekend: 'Getekend',
    statusVerlopen: 'Verlopen',
  },
  en: {
    pageTitle: 'My contracts',
    pageSubtitle: 'Overview of all your signed placement agreements. Click on a contract to view it.',
    statTotalLabel: 'Total contracts',
    statFeeLabel: 'Total fee committed',
    statFeeNote: 'excl. VAT',
    statFitLabel: 'Active Fit Guarantee',
    statFitNote: '12 months protection',
    filterAll: 'All',
    filterSigned: 'Signed',
    filterActive: 'Active',
    filterExpired: 'Expired',
    colContractNr: 'Contract no.',
    colDate: 'Date',
    colVacature: 'Vacancy',
    colKandidaat: 'Candidate',
    colFee: 'Fee (excl VAT)',
    colStatus: 'Status',
    colActions: 'Actions',
    actionView: 'View',
    actionPdf: 'PDF',
    noContracts: 'No contracts found.',
    // Modal
    modalTitle: 'Placement Agreement',
    partyEmployer: 'Employer',
    partyMediator: 'Mediator',
    labelVacature: 'Vacancy',
    labelKandidaat: 'Candidate',
    labelTalentScout: 'Talent Scout',
    labelMScore: 'M-Score',
    articlesTitle: 'Articles',
    art1Title: 'Article 1 — No cure, no pay',
    art1: 'The employer pays a placement fee only upon actual start of the candidate. Unlocking candidate profiles is free of charge.',
    art2Title: 'Article 2 — Placement fee',
    art2: (fee: string, level: string, exp: string) => `The placement fee amounts to ${fee} excl. VAT, based on education level (${level}) and work experience (${exp}). 21% VAT will be charged on this amount.`,
    art3Title: 'Article 3 — Fit Guarantee',
    art3Yes: (score: number) => `With an M-Score of ${score}% (≥80%) a Fit Guarantee of 12 months applies from the confirmed start date. The guarantee covers only departures demonstrably caused by a mismatch in culture fit, values fit or organisational fit. Not covered: performance issues, personal circumstances, external offers, changed job content, mismanagement, reorganisation, illness/incapacity, and situations where the input in the Matching Scan does not match reality (employee's assessment). Procedure: employer reports departure within 30 calendar days; Refurzy conducts an exit interview with the employee; the employee confirms the fit mismatch; final judgement rests with Refurzy. Without an exit interview the claim lapses. If approved, Refurzy delivers one replacement candidate without a new placement fee.`,
    art3No: (score: number) => `The M-Score of ${score}% is below the 80% threshold. The Fit Guarantee does not apply to this placement.`,
    art4Title: 'Article 4 — Payment',
    art4: 'The fee is invoiced on the first working day of the candidate. Both parties confirm the start date and actual start via the platform.',
    art5Title: 'Article 5 — Withdrawal before start date',
    art5: 'If the candidate withdraws before the start date, the employer pays nothing. If the employer withdraws, 50% of the placement fee will be charged.',
    art6Title: 'Article 6 — Anti-circumvention',
    art6: 'Mediation outside the Refurzy platform of candidates introduced via Refurzy results in a penalty of 100% of the placement fee.',
    finTitle: 'Financial overview',
    finFeeExcl: 'Placement fee (excl. VAT)',
    finBtw: 'VAT (21%)',
    finTotal: 'Total incl. VAT',
    signedTitle: 'Digitally signed',
    signedBy: 'Signed by',
    signedAt: 'Date and time',
    fitActive: 'Fit Guarantee active',
    fitDesc: (date: string) => `12 months protection at M-Score ≥80%. Valid until ${date}`,
    downloadPdf: '📥 Download PDF',
    close: 'Close',
    statusActief: 'Active',
    statusGetekend: 'Signed',
    statusVerlopen: 'Expired',
  },
}

export default function ContractenPage() {
  const { lang } = useLang()
  const t = texts[lang]

  const statusLabels: Record<Contract['status'], { label: string; className: string }> = {
    getekend: { label: t.statusGetekend, className: 'bg-blue-100 text-blue-700' },
    actief: { label: t.statusActief, className: 'bg-green-100 text-green-700' },
    verlopen: { label: t.statusVerlopen, className: 'bg-gray-100 text-gray-500' },
  }

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'alle', label: t.filterAll },
    { key: 'getekend', label: t.filterSigned },
    { key: 'actief', label: t.filterActive },
    { key: 'verlopen', label: t.filterExpired },
  ]

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

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-light text-sm mt-1">
          {t.pageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted uppercase tracking-wider">{t.statTotalLabel}</p>
          <p className="text-3xl font-bold text-ink mt-1">{mockContracten.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted uppercase tracking-wider">{t.statFeeLabel}</p>
          <p className="text-3xl font-bold text-ink mt-1">{'\u20AC'}{totalFee.toLocaleString('nl-NL')}</p>
          <p className="text-xs text-ink-muted mt-0.5">{t.statFeeNote}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted uppercase tracking-wider">{t.statFitLabel}</p>
          <p className="text-3xl font-bold text-cyan mt-1">{activeFitGarantie}</p>
          <p className="text-xs text-ink-muted mt-0.5">{t.statFitNote}</p>
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
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">{t.colContractNr}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">{t.colDate}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">{t.colVacature}</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">{t.colKandidaat}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">{t.colFee}</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">{t.colStatus}</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-ink-muted uppercase tracking-wider">{t.colActions}</th>
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
                      {t.actionView}
                    </button>
                    <button onClick={() => handleDownload(contract.contractNummer)}
                      className="px-3 py-1.5 bg-cyan/10 text-cyan rounded-lg text-xs font-medium hover:bg-cyan/20 transition-colors">
                      {t.actionPdf}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-ink-muted">{t.noContracts}</td></tr>
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
                <h2 className="text-xl font-bold text-ink">{t.modalTitle}</h2>
                <p className="text-ink-muted text-sm mt-0.5">{selectedContract.contractNummer}</p>
              </div>
              <button onClick={() => setSelectedContract(null)} className="text-ink-muted hover:text-ink text-xl">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Partijen */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">{t.partyEmployer}</p>
                  <p className="text-sm font-semibold text-ink">{selectedContract.opdrachtgeverBedrijf}</p>
                  <p className="text-xs text-ink-light">{selectedContract.opdrachtgeverNaam}</p>
                  <p className="text-xs text-ink-light">{selectedContract.opdrachtgeverAdres}</p>
                  <p className="text-xs text-ink-light">KVK: {selectedContract.opdrachtgeverKvk}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">{t.partyMediator}</p>
                  <p className="text-sm font-semibold text-ink">Refurzy B.V.</p>
                  <p className="text-xs text-ink-light">Keizersgracht 100, 1015 AA Amsterdam</p>
                  <p className="text-xs text-ink-light">KVK: 98765432</p>
                </div>
              </div>

              {/* Vacature & kandidaat */}
              <div className="bg-surface-muted rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-ink-muted text-xs">{t.labelVacature}</p>
                    <p className="text-ink font-medium">{selectedContract.vacatureTitle}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">{t.labelKandidaat}</p>
                    <p className="text-ink font-medium">{selectedContract.kandidaatNaam}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">{t.labelTalentScout}</p>
                    <p className="text-ink">{selectedContract.scoutNaam}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">{t.labelMScore}</p>
                    <p className="text-ink font-medium">{selectedContract.mScore}%</p>
                  </div>
                </div>
              </div>

              {/* Artikelen */}
              <div className="space-y-3 text-sm text-ink-light">
                <h3 className="font-semibold text-ink text-base">{t.articlesTitle}</h3>
                <div className="bg-surface-muted rounded-xl p-4 space-y-3">
                  <p><strong className="text-ink">{t.art1Title}</strong><br />{t.art1}</p>
                  <p><strong className="text-ink">{t.art2Title}</strong><br />
                    {t.art2(`\u20AC${selectedContract.plaatsingsfee.toLocaleString('nl-NL')}`, selectedContract.opleidingsniveau, selectedContract.werkervaring)}
                  </p>
                  <p><strong className="text-ink">{t.art3Title}</strong><br />
                    {selectedContract.fitGarantie
                      ? t.art3Yes(selectedContract.mScore)
                      : t.art3No(selectedContract.mScore)
                    }
                  </p>
                  <p><strong className="text-ink">{t.art4Title}</strong><br />{t.art4}</p>
                  <p><strong className="text-ink">{t.art5Title}</strong><br />{t.art5}</p>
                  <p><strong className="text-ink">{t.art6Title}</strong><br />{t.art6}</p>
                </div>
              </div>

              {/* Financieel overzicht */}
              <div className="border-t border-surface-border pt-4">
                <h3 className="font-semibold text-ink mb-3">{t.finTitle}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-light">{t.finFeeExcl}</span><span className="text-ink">{'\u20AC'}{selectedContract.plaatsingsfee.toLocaleString('nl-NL')}</span></div>
                  <div className="flex justify-between"><span className="text-ink-light">{t.finBtw}</span><span className="text-ink">{'\u20AC'}{selectedContract.btw.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between border-t border-surface-border pt-2 font-bold"><span className="text-ink">{t.finTotal}</span><span className="text-ink">{'\u20AC'}{selectedContract.totaalInclBtw.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
                </div>
              </div>

              {/* Ondertekening */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-medium text-green-700">{t.signedTitle}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-green-600">
                  <div>
                    <p className="text-green-500">{t.signedBy}</p>
                    <p className="font-medium">{selectedContract.ondertekendDoor}</p>
                  </div>
                  <div>
                    <p className="text-green-500">{t.signedAt}</p>
                    <p className="font-medium">{new Date(selectedContract.ondertekendOp).toLocaleString('nl-NL')}</p>
                  </div>
                </div>
              </div>

              {/* Fit Garantie badge */}
              {selectedContract.fitGarantie && selectedContract.status === 'actief' && (
                <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="text-sm font-medium text-cyan">{t.fitActive}</p>
                    <p className="text-xs text-ink-light">{t.fitDesc(
                      new Date(new Date(selectedContract.datum).getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL')
                    )}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => handleDownload(selectedContract.contractNummer)}
                  className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors">
                  {t.downloadPdf}
                </button>
                <button onClick={() => setSelectedContract(null)}
                  className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
