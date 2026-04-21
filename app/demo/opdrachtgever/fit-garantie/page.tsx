'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'

interface FitGarantie {
  id: string
  kandidaatNaam: string
  vacature: string
  plaatsingsDatum: string
  mScore: number
  status: 'actief' | 'verlopen' | 'claim_ingediend'
  checkIns: { maanden: number; status: 'afgerond' | 'aankomend' | 'toekomstig' }[]
}

const mockGaranties: FitGarantie[] = [
  {
    id: 'fg-1',
    kandidaatNaam: 'Anna de Jong',
    vacature: 'Marketing Manager',
    plaatsingsDatum: '2026-01-15',
    mScore: 87,
    status: 'actief',
    checkIns: [
      { maanden: 3, status: 'afgerond' },
      { maanden: 6, status: 'aankomend' },
      { maanden: 12, status: 'toekomstig' },
    ],
  },
  {
    id: 'fg-2',
    kandidaatNaam: 'Thomas van Dijk',
    vacature: 'Senior Software Developer',
    plaatsingsDatum: '2026-02-01',
    mScore: 82,
    status: 'actief',
    checkIns: [
      { maanden: 3, status: 'aankomend' },
      { maanden: 6, status: 'toekomstig' },
      { maanden: 12, status: 'toekomstig' },
    ],
  },
  {
    id: 'fg-3',
    kandidaatNaam: 'Robert Bakker',
    vacature: 'HR Business Partner',
    plaatsingsDatum: '2025-09-01',
    mScore: 91,
    status: 'actief',
    checkIns: [
      { maanden: 3, status: 'afgerond' },
      { maanden: 6, status: 'afgerond' },
      { maanden: 12, status: 'aankomend' },
    ],
  },
  {
    id: 'fg-4',
    kandidaatNaam: 'Sanne Visser',
    vacature: 'Product Owner',
    plaatsingsDatum: '2025-01-10',
    mScore: 84,
    status: 'verlopen',
    checkIns: [
      { maanden: 3, status: 'afgerond' },
      { maanden: 6, status: 'afgerond' },
      { maanden: 12, status: 'afgerond' },
    ],
  },
]

const texts = {
  nl: {
    pageTitle: 'Fit Garantie',
    pageSubtitle: 'Overzicht van alle Fit Garanties voor uw plaatsingen',
    activeGuaranteesTitle: 'Actieve garanties',
    noActiveGuarantees: 'Geen actieve garanties.',
    expiredGuaranteesTitle: 'Verlopen garanties',
    placed: 'Geplaatst:',
    mScoreAtPlacement: 'M-Score bij plaatsing',
    monthsElapsed: (n: number) => `${n} van 12 maanden verstreken`,
    submitClaim: 'Claim indienen',
    statusActief: 'Actief',
    statusVerlopen: 'Verlopen',
    statusClaimIngediend: 'Claim ingediend',
    checkInDone: 'afgerond',
    checkInUpcoming: 'aankomend',
    checkInFuture: 'toekomstig',
    months: 'maanden',
    // Claim modal
    claimTitle: 'Claim indienen',
    claimSubmitted: 'Claim ingediend',
    claimSuccessMsg: 'Uw claim is succesvol ingediend. Refurzy neemt binnen 5 werkdagen contact met u op.',
    close: 'Sluiten',
    reasonLabel: 'Reden',
    reasonPlaceholder: 'Selecteer een reden...',
    clarificationLabel: 'Toelichting',
    clarificationPlaceholder: 'Beschrijf de situatie...',
    coverageTitle: 'Dekking',
    coverageText: 'De Fit Garantie dekt uitsluitend vertrek dat aantoonbaar het gevolg is van een mismatch op cultuurfit, waardenfit of organisatiefit — de drie dimensies die de M-Score meet. Bij een geldige claim levert Refurzy eenmalig een vervangende kandidaat zonder nieuwe plaatsingsfee.',
    notCoveredTitle: 'Niet gedekt',
    notCoveredItems: [
      'Functioneringsproblemen (prestaties, competenties)',
      'Persoonlijke omstandigheden (verhuizing, gezin, gezondheid)',
      'Extern aanbod (kandidaat kiest ander aanbod)',
      'Gewijzigde functie (werkzaamheden wijken af van vacatureomschrijving)',
      'Mismanagement door opdrachtgever',
      'Reorganisatie (functie verdwijnt of wijzigt substantieel)',
      'Ziekte of arbeidsongeschiktheid',
      'Input Matching Scan komt niet overeen met de praktijk (oordeel medewerker)',
    ],
    procedureTitle: 'Procedure',
    procedureItems: [
      'Meld vertrek binnen 30 kalenderdagen bij Refurzy',
      'Refurzy voert binnen 10 werkdagen een exitgesprek met de medewerker',
      'De medewerker bevestigt dat het vertrek het gevolg is van een fit-mismatch',
      'Refurzy beoordeelt of de melding binnen de dekking valt',
      'Het eindoordeel ligt te allen tijde bij Refurzy',
    ],
    procedureNote: 'Zonder exitgesprek met de medewerker kan geen claim worden beoordeeld en vervalt het recht op de garantie.',
    cancel: 'Annuleren',
    submitClaimBtn: 'Claim indienen',
    claimReasons: ['Culturele mismatch', 'Waardenmismatch', 'Organisatiefit-mismatch'],
  },
  en: {
    pageTitle: 'Fit Guarantee',
    pageSubtitle: 'Overview of all Fit Guarantees for your placements',
    activeGuaranteesTitle: 'Active guarantees',
    noActiveGuarantees: 'No active guarantees.',
    expiredGuaranteesTitle: 'Expired guarantees',
    placed: 'Placed:',
    mScoreAtPlacement: 'M-Score at placement',
    monthsElapsed: (n: number) => `${n} of 12 months elapsed`,
    submitClaim: 'Submit claim',
    statusActief: 'Active',
    statusVerlopen: 'Expired',
    statusClaimIngediend: 'Claim submitted',
    checkInDone: 'completed',
    checkInUpcoming: 'upcoming',
    checkInFuture: 'future',
    months: 'months',
    // Claim modal
    claimTitle: 'Submit claim',
    claimSubmitted: 'Claim submitted',
    claimSuccessMsg: 'Your claim has been successfully submitted. Refurzy will contact you within 5 working days.',
    close: 'Close',
    reasonLabel: 'Reason',
    reasonPlaceholder: 'Select a reason...',
    clarificationLabel: 'Clarification',
    clarificationPlaceholder: 'Describe the situation...',
    coverageTitle: 'Coverage',
    coverageText: 'The Fit Guarantee covers only departures demonstrably caused by a mismatch in culture fit, values fit or organisational fit — the three dimensions measured by the M-Score. With a valid claim, Refurzy provides one replacement candidate without a new placement fee.',
    notCoveredTitle: 'Not covered',
    notCoveredItems: [
      'Performance issues (results, competencies)',
      'Personal circumstances (relocation, family, health)',
      'External offer (candidate chooses another offer)',
      'Changed role (tasks deviate from vacancy description)',
      'Mismanagement by employer',
      'Reorganisation (role disappears or changes substantially)',
      'Illness or incapacity for work',
      'Input in Matching Scan does not match reality (employee\'s assessment)',
    ],
    procedureTitle: 'Procedure',
    procedureItems: [
      'Report departure to Refurzy within 30 calendar days',
      'Refurzy conducts an exit interview with the employee within 10 working days',
      'The employee confirms that the departure is due to a fit mismatch',
      'Refurzy assesses whether the report falls within the coverage',
      'The final judgement always rests with Refurzy',
    ],
    procedureNote: 'Without an exit interview with the employee, no claim can be assessed and the right to the guarantee lapses.',
    cancel: 'Cancel',
    submitClaimBtn: 'Submit claim',
    claimReasons: ['Cultural mismatch', 'Values mismatch', 'Organisation fit mismatch'],
  },
}

function getMonthsElapsed(plaatsingsDatum: string): number {
  const start = new Date(plaatsingsDatum)
  const now = new Date()
  const diff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.min(Math.max(diff, 0), 12)
}

function CheckInIcon({ status }: { status: string }) {
  if (status === 'afgerond') return <span title="Completed" className="text-green-600">&#10003;</span>
  if (status === 'aankomend') return <span title="Upcoming" className="text-cyan">&#9679;</span>
  return <span title="Future" className="text-ink-muted">&#9633;</span>
}

function StatusBadge({ status, labels }: { status: string; labels: { actief: string; verlopen: string; claim_ingediend: string } }) {
  const colors: Record<string, string> = {
    'actief': 'bg-green-100 text-green-700',
    'verlopen': 'bg-surface-muted text-ink-light',
    'claim_ingediend': 'bg-orange/10 text-orange',
  }
  const labelMap: Record<string, string> = {
    'actief': labels.actief,
    'verlopen': labels.verlopen,
    'claim_ingediend': labels.claim_ingediend,
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || ''}`}>
      {labelMap[status] || status}
    </span>
  )
}

export default function OpdrachtgeverFitGarantie() {
  const { lang } = useLang()
  const t = texts[lang]

  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimGarantieId, setClaimGarantieId] = useState<string | null>(null)
  const [claimReden, setClaimReden] = useState('')
  const [claimToelichting, setClaimToelichting] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const actieveGaranties = mockGaranties.filter((g) => g.status === 'actief')
  const verlopenGaranties = mockGaranties.filter((g) => g.status === 'verlopen' || g.status === 'claim_ingediend')

  const statusLabels = {
    actief: t.statusActief,
    verlopen: t.statusVerlopen,
    claim_ingediend: t.statusClaimIngediend,
  }

  const openClaimModal = (id: string) => {
    setClaimGarantieId(id)
    setClaimReden('')
    setClaimToelichting('')
    setSubmitted(false)
    setShowClaimModal(true)
  }

  const handleSubmitClaim = () => {
    if (!claimReden) return
    setSubmitted(true)
  }

  const getCheckInLabel = (status: string) => {
    if (status === 'afgerond') return t.checkInDone
    if (status === 'aankomend') return t.checkInUpcoming
    return t.checkInFuture
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.pageSubtitle}</p>
      </div>

      {/* Active guarantees */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">{t.activeGuaranteesTitle}</h2>
        {actieveGaranties.length === 0 ? (
          <p className="text-ink-muted text-sm">{t.noActiveGuarantees}</p>
        ) : (
          <div className="space-y-4">
            {actieveGaranties.map((g) => {
              const monthsElapsed = getMonthsElapsed(g.plaatsingsDatum)
              const progressPct = (monthsElapsed / 12) * 100

              return (
                <div key={g.id} className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-ink">{g.kandidaatNaam}</span>
                        <StatusBadge status={g.status} labels={statusLabels} />
                      </div>
                      <p className="text-sm text-ink-light font-medium mt-1">{g.vacature}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {t.placed} {new Date(g.plaatsingsDatum).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-cyan">{g.mScore}%</div>
                      <div className="text-xs text-ink-muted">{t.mScoreAtPlacement}</div>
                    </div>
                  </div>

                  {/* Timeline bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                      <span>0 mnd</span>
                      <span>3 mnd</span>
                      <span>6 mnd</span>
                      <span>12 mnd</span>
                    </div>
                    <div className="relative w-full h-3 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan to-purple rounded-full transition-all"
                        style={{ width: `${Math.min(progressPct, 100)}%` }}
                      />
                      {/* Markers at 3, 6, 12 months */}
                      <div className="absolute top-0 h-full w-0.5 bg-surface-border" style={{ left: '25%' }} />
                      <div className="absolute top-0 h-full w-0.5 bg-surface-border" style={{ left: '50%' }} />
                    </div>
                    <div className="text-xs text-ink-light mt-1">{t.monthsElapsed(monthsElapsed)}</div>
                  </div>

                  {/* Check-in status */}
                  <div className="flex items-center gap-6">
                    {g.checkIns.map((ci) => (
                      <div key={ci.maanden} className="flex items-center gap-2 text-sm">
                        <CheckInIcon status={ci.status} />
                        <span className="text-ink-light">{ci.maanden} {t.months}</span>
                        <span className="text-xs text-ink-muted">
                          ({getCheckInLabel(ci.status)})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Claim button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => openClaimModal(g.id)}
                      className="px-4 py-2 bg-orange/10 text-orange text-sm font-medium rounded-lg hover:bg-orange/20 transition-colors"
                    >
                      {t.submitClaim}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Expired guarantees */}
      {verlopenGaranties.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink">{t.expiredGuaranteesTitle}</h2>
          <div className="space-y-3">
            {verlopenGaranties.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl border border-surface-border p-6 opacity-70">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-ink">{g.kandidaatNaam}</span>
                      <StatusBadge status={g.status} labels={statusLabels} />
                    </div>
                    <p className="text-sm text-ink-light font-medium mt-1">{g.vacature}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {t.placed} {new Date(g.plaatsingsDatum).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-ink-light">{g.mScore}%</div>
                    <div className="text-xs text-ink-muted">{t.mScoreAtPlacement}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-border w-full max-w-lg mx-4 p-6 space-y-5">
            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="text-4xl">&#10003;</div>
                <h3 className="text-lg font-bold text-ink">{t.claimSubmitted}</h3>
                <p className="text-sm text-ink-light">{t.claimSuccessMsg}</p>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="mt-4 px-6 py-2 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple-dark transition-colors"
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-ink">{t.claimTitle}</h3>
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="text-ink-muted hover:text-ink text-xl transition-colors"
                  >
                    &times;
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">{t.reasonLabel}</label>
                  <select
                    value={claimReden}
                    onChange={(e) => setClaimReden(e.target.value)}
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
                  >
                    <option value="">{t.reasonPlaceholder}</option>
                    {t.claimReasons.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">{t.clarificationLabel}</label>
                  <textarea
                    value={claimToelichting}
                    onChange={(e) => setClaimToelichting(e.target.value)}
                    placeholder={t.clarificationPlaceholder}
                    rows={4}
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50 resize-none"
                  />
                </div>

                <div className="bg-surface-muted rounded-lg p-4 text-sm text-ink-light space-y-3">
                  <p className="font-semibold text-ink">{t.coverageTitle}</p>
                  <p>{t.coverageText}</p>

                  <p className="font-semibold text-ink">{t.notCoveredTitle}</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {t.notCoveredItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <p className="font-semibold text-ink">{t.procedureTitle}</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    {t.procedureItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>

                  <p className="text-xs text-ink-muted">{t.procedureNote}</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="px-4 py-2 text-sm text-ink-light hover:text-ink transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSubmitClaim}
                    disabled={!claimReden}
                    className="px-6 py-2 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.submitClaimBtn}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
