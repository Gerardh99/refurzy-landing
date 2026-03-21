'use client'

import { useState } from 'react'

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

const claimRedenen = [
  'Kandidaat heeft ontslag genomen',
  'Culturele mismatch',
  'Waarden mismatch',
  'Functioneringsprobleem',
  'Anders',
]

function getMonthsElapsed(plaatsingsDatum: string): number {
  const start = new Date(plaatsingsDatum)
  const now = new Date()
  const diff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.min(Math.max(diff, 0), 12)
}

function CheckInIcon({ status }: { status: string }) {
  if (status === 'afgerond') return <span title="Afgerond" className="text-green-600">&#10003;</span>
  if (status === 'aankomend') return <span title="Aankomend" className="text-cyan">&#9679;</span>
  return <span title="Toekomstig" className="text-ink-muted">&#9633;</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'actief': 'bg-green-100 text-green-700',
    'verlopen': 'bg-surface-muted text-ink-light',
    'claim_ingediend': 'bg-orange/10 text-orange',
  }
  const labels: Record<string, string> = {
    'actief': 'Actief',
    'verlopen': 'Verlopen',
    'claim_ingediend': 'Claim ingediend',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || ''}`}>
      {labels[status] || status}
    </span>
  )
}

export default function OpdrachtgeverFitGarantie() {
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimGarantieId, setClaimGarantieId] = useState<string | null>(null)
  const [claimReden, setClaimReden] = useState('')
  const [claimToelichting, setClaimToelichting] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const actieveGaranties = mockGaranties.filter((g) => g.status === 'actief')
  const verlopenGaranties = mockGaranties.filter((g) => g.status === 'verlopen' || g.status === 'claim_ingediend')

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Fit Garantie</h1>
        <p className="text-ink-light mt-1">Overzicht van alle Fit Garanties voor uw plaatsingen</p>
      </div>

      {/* Active guarantees */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Actieve garanties</h2>
        {actieveGaranties.length === 0 ? (
          <p className="text-ink-muted text-sm">Geen actieve garanties.</p>
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
                        <StatusBadge status={g.status} />
                      </div>
                      <p className="text-sm text-ink-light mt-1">{g.vacature}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        Geplaatst: {new Date(g.plaatsingsDatum).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-cyan">{g.mScore}%</div>
                      <div className="text-xs text-ink-muted">M-Score bij plaatsing</div>
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
                    <div className="text-xs text-ink-light mt-1">{monthsElapsed} van 12 maanden verstreken</div>
                  </div>

                  {/* Check-in status */}
                  <div className="flex items-center gap-6">
                    {g.checkIns.map((ci) => (
                      <div key={ci.maanden} className="flex items-center gap-2 text-sm">
                        <CheckInIcon status={ci.status} />
                        <span className="text-ink-light">{ci.maanden} maanden</span>
                        <span className="text-xs text-ink-muted">
                          ({ci.status === 'afgerond' ? 'afgerond' : ci.status === 'aankomend' ? 'aankomend' : 'toekomstig'})
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
                      Claim indienen
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
          <h2 className="text-lg font-semibold text-ink">Verlopen garanties</h2>
          <div className="space-y-3">
            {verlopenGaranties.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl border border-surface-border p-6 opacity-70">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-ink">{g.kandidaatNaam}</span>
                      <StatusBadge status={g.status} />
                    </div>
                    <p className="text-sm text-ink-light mt-1">{g.vacature}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Geplaatst: {new Date(g.plaatsingsDatum).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-ink-light">{g.mScore}%</div>
                    <div className="text-xs text-ink-muted">M-Score bij plaatsing</div>
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
                <h3 className="text-lg font-bold text-ink">Claim ingediend</h3>
                <p className="text-sm text-ink-light">Uw claim is succesvol ingediend. Refurzy neemt binnen 5 werkdagen contact met u op.</p>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="mt-4 px-6 py-2 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple-dark transition-colors"
                >
                  Sluiten
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-ink">Claim indienen</h3>
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="text-ink-muted hover:text-ink text-xl transition-colors"
                  >
                    &times;
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Reden</label>
                  <select
                    value={claimReden}
                    onChange={(e) => setClaimReden(e.target.value)}
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
                  >
                    <option value="">Selecteer een reden...</option>
                    {claimRedenen.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Toelichting</label>
                  <textarea
                    value={claimToelichting}
                    onChange={(e) => setClaimToelichting(e.target.value)}
                    placeholder="Beschrijf de situatie..."
                    rows={4}
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50 resize-none"
                  />
                </div>

                <div className="bg-surface-muted rounded-lg p-4 text-sm text-ink-light space-y-2">
                  <p className="font-semibold text-ink">De Fit Garantie dekt ook vrijwillig vertrek door de kandidaat.</p>
                  <p><strong className="text-ink">Niet van toepassing bij:</strong> (1) werkzaamheden wijken af van de vacatureomschrijving, (2) aantoonbaar mismanagement, (3) reorganisatie / functie verdwijnt.</p>
                  <p className="text-ink-light">Na uw claim voert Refurzy een exitgesprek met de kandidaat om de situatie te beoordelen. Meld vertrek binnen 30 dagen.</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="px-4 py-2 text-sm text-ink-light hover:text-ink transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleSubmitClaim}
                    disabled={!claimReden}
                    className="px-6 py-2 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Claim indienen
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
