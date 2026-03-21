'use client'

import { useState } from 'react'

interface FitGarantieClaim {
  id: string
  kandidaatNaam: string
  opdrachtgeverNaam: string
  opdrachtgeverBedrijf: string
  vacature: string
  plaatsingsDatum: string
  claimDatum: string
  reden: string
  toelichting: string
  status: 'in_behandeling' | 'goedgekeurd' | 'afgewezen'
  mScore: number
  opmerkingen: { tekst: string; datum: string; door: string }[]
}

const mockClaims: FitGarantieClaim[] = [
  {
    id: 'claim-1',
    kandidaatNaam: 'Peter Hendriks',
    opdrachtgeverNaam: 'Daan Verhoeven',
    opdrachtgeverBedrijf: 'TechVentures B.V.',
    vacature: 'UX Designer',
    plaatsingsDatum: '2025-08-15',
    claimDatum: '2026-02-20',
    reden: 'Culturele mismatch',
    toelichting: 'Kandidaat past niet binnen de teamdynamiek. Communicatiestijl botst met bestaand team.',
    status: 'in_behandeling',
    mScore: 81,
    opmerkingen: [
      { tekst: 'Claim ontvangen, wordt beoordeeld.', datum: '2026-02-21', door: 'Systeem' },
    ],
  },
  {
    id: 'claim-2',
    kandidaatNaam: 'Maria Lopez',
    opdrachtgeverNaam: 'Erik Smit',
    opdrachtgeverBedrijf: 'GreenLogistics B.V.',
    vacature: 'Operations Manager',
    plaatsingsDatum: '2025-06-01',
    claimDatum: '2025-12-15',
    reden: 'Waarden mismatch',
    toelichting: 'Kandidaat deelt niet dezelfde visie op duurzaamheid en werkethiek als het bedrijf.',
    status: 'goedgekeurd',
    mScore: 83,
    opmerkingen: [
      { tekst: 'Claim ontvangen, wordt beoordeeld.', datum: '2025-12-16', door: 'Systeem' },
      { tekst: 'Na gesprek met opdrachtgever: claim gegrond bevonden. Restitutie gestart.', datum: '2025-12-22', door: 'Admin' },
    ],
  },
  {
    id: 'claim-3',
    kandidaatNaam: 'Kevin de Boer',
    opdrachtgeverNaam: 'Daan Verhoeven',
    opdrachtgeverBedrijf: 'TechVentures B.V.',
    vacature: 'Data Analyst',
    plaatsingsDatum: '2025-04-01',
    claimDatum: '2025-10-10',
    reden: 'Anders',
    toelichting: 'Kandidaat heeft na 5 maanden zelf ontslag genomen wegens verhuizing.',
    status: 'afgewezen',
    mScore: 86,
    opmerkingen: [
      { tekst: 'Claim ontvangen, wordt beoordeeld.', datum: '2025-10-11', door: 'Systeem' },
      { tekst: 'Afgewezen: verhuizing valt onder uitsluitingen van de Fit Garantie.', datum: '2025-10-18', door: 'Admin' },
    ],
  },
]

const statusColors: Record<string, string> = {
  'in_behandeling': 'bg-orange/10 text-orange',
  'goedgekeurd': 'bg-green-100 text-green-700',
  'afgewezen': 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  'in_behandeling': 'In behandeling',
  'goedgekeurd': 'Goedgekeurd',
  'afgewezen': 'Afgewezen',
}

export default function AdminFitGarantie() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newOpmerking, setNewOpmerking] = useState('')

  const stats = {
    actieveGaranties: 12,
    inBehandeling: mockClaims.filter((c) => c.status === 'in_behandeling').length,
    goedgekeurd: mockClaims.filter((c) => c.status === 'goedgekeurd').length,
    afgewezen: mockClaims.filter((c) => c.status === 'afgewezen').length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Fit Garantie Beheer</h1>
        <p className="text-ink-light mt-1">Beheer en beoordeel Fit Garantie claims</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="text-sm text-ink-light">Actieve garanties</div>
          <div className="text-2xl font-bold text-ink mt-1">{stats.actieveGaranties}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="text-sm text-ink-light">Claims in behandeling</div>
          <div className="text-2xl font-bold text-orange mt-1">{stats.inBehandeling}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="text-sm text-ink-light">Goedgekeurd</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.goedgekeurd}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="text-sm text-ink-light">Afgewezen</div>
          <div className="text-2xl font-bold text-red-500 mt-1">{stats.afgewezen}</div>
        </div>
      </div>

      {/* Claims table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-7 gap-4 px-6 py-3 bg-surface-muted border-b border-surface-border text-xs font-medium text-ink-muted uppercase tracking-wide">
          <div>Kandidaat</div>
          <div>Opdrachtgever</div>
          <div>Vacature</div>
          <div>Plaatsingsdatum</div>
          <div>Claimdatum</div>
          <div>Reden</div>
          <div>Status</div>
        </div>

        {mockClaims.map((claim) => {
          const isExpanded = expandedId === claim.id

          return (
            <div key={claim.id} className="border-b border-surface-border last:border-b-0">
              {/* Row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                className="w-full text-left grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-4 px-6 py-4 hover:bg-surface-muted/50 transition-colors"
              >
                <div className="font-medium text-ink text-sm">{claim.kandidaatNaam}</div>
                <div className="text-sm text-ink-light">{claim.opdrachtgeverBedrijf}</div>
                <div className="text-sm text-ink-light">{claim.vacature}</div>
                <div className="text-sm text-ink-light">{new Date(claim.plaatsingsDatum).toLocaleDateString('nl-NL')}</div>
                <div className="text-sm text-ink-light">{new Date(claim.claimDatum).toLocaleDateString('nl-NL')}</div>
                <div className="text-sm text-ink-light">{claim.reden}</div>
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[claim.status]}`}>
                    {statusLabels[claim.status]}
                  </span>
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-4 bg-surface-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-ink-muted mb-1">Opdrachtgever</div>
                        <div className="text-sm text-ink">{claim.opdrachtgeverNaam} - {claim.opdrachtgeverBedrijf}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-ink-muted mb-1">M-Score bij plaatsing</div>
                        <div className="text-sm font-bold text-cyan">{claim.mScore}%</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-ink-muted mb-1">Toelichting</div>
                        <div className="text-sm text-ink bg-white rounded-lg p-3 border border-surface-border">{claim.toelichting}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs font-medium text-ink-muted mb-1">Opmerkingen</div>
                      <div className="space-y-2">
                        {claim.opmerkingen.map((o, i) => (
                          <div key={i} className="bg-white rounded-lg p-3 border border-surface-border">
                            <div className="text-sm text-ink">{o.tekst}</div>
                            <div className="text-xs text-ink-muted mt-1">{o.door} - {new Date(o.datum).toLocaleDateString('nl-NL')}</div>
                          </div>
                        ))}
                      </div>

                      {/* Add remark */}
                      {claim.status === 'in_behandeling' && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Opmerking toevoegen..."
                            value={expandedId === claim.id ? newOpmerking : ''}
                            onChange={(e) => setNewOpmerking(e.target.value)}
                            className="flex-1 bg-white border border-surface-border rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-cyan/50"
                          />
                          <button
                            onClick={() => setNewOpmerking('')}
                            className="px-3 py-2 bg-purple/10 text-purple text-sm font-medium rounded-lg hover:bg-purple/20 transition-colors"
                          >
                            Toevoegen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  {claim.status === 'in_behandeling' && (
                    <div className="flex gap-3 pt-2">
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                        Goedkeuren
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
                        Afwijzen
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
