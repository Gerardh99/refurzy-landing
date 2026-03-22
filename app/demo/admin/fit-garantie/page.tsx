'use client'

import { useState } from 'react'

type ClaimStatus = 'ontvangen' | 'exitgesprek_plannen' | 'exitgesprek_gepland' | 'exitgesprek_afgerond' | 'in_beoordeling' | 'goedgekeurd' | 'afgewezen'

interface FitGarantieClaim {
  id: string
  kandidaatNaam: string
  medewerkerEmail: string
  opdrachtgeverNaam: string
  opdrachtgeverBedrijf: string
  vacature: string
  plaatsingsDatum: string
  claimDatum: string
  reden: string
  toelichting: string
  status: ClaimStatus
  mScore: number
  exitgesprekDatum?: string
  exitgesprekSamenvatting?: string
  medewerkerBevestigt?: boolean
  opmerkingen: { tekst: string; datum: string; door: string }[]
}

const initialClaims: FitGarantieClaim[] = [
  {
    id: 'claim-1',
    kandidaatNaam: 'Peter Hendriks',
    medewerkerEmail: 'p.hendriks@email.nl',
    opdrachtgeverNaam: 'Daan Verhoeven',
    opdrachtgeverBedrijf: 'TechVentures B.V.',
    vacature: 'UX Designer',
    plaatsingsDatum: '2025-08-15',
    claimDatum: '2026-02-20',
    reden: 'Culturele mismatch',
    toelichting: 'Medewerker geeft aan dat de communicatiestijl en teamdynamiek niet overeenkomen met wat in de Matching Scan werd geschetst.',
    status: 'exitgesprek_plannen',
    mScore: 81,
    opmerkingen: [
      { tekst: 'Claim ontvangen, wordt beoordeeld.', datum: '2026-02-21', door: 'Systeem' },
      { tekst: 'Claim voldoet aan basisvoorwaarden (binnen 30 dagen, binnen 12 maanden). Exitgesprek moet gepland worden.', datum: '2026-02-22', door: 'Refurzy' },
    ],
  },
  {
    id: 'claim-2',
    kandidaatNaam: 'Maria Lopez',
    medewerkerEmail: 'm.lopez@email.nl',
    opdrachtgeverNaam: 'Erik Smit',
    opdrachtgeverBedrijf: 'GreenLogistics B.V.',
    vacature: 'Operations Manager',
    plaatsingsDatum: '2025-06-01',
    claimDatum: '2025-12-15',
    reden: 'Waardenmismatch',
    toelichting: 'Medewerker geeft in exitgesprek aan dat de bedrijfswaarden rond duurzaamheid en werkethiek in de praktijk sterk afwijken van wat in de Matching Scan werd gepresenteerd.',
    status: 'goedgekeurd',
    mScore: 83,
    exitgesprekDatum: '2025-12-20',
    exitgesprekSamenvatting: 'Medewerker bevestigt dat de kernwaarden van het bedrijf in de praktijk sterk afwijken van wat tijdens de Matching Scan werd aangegeven. Specifiek: duurzaamheidsclaims zijn niet waargemaakt, werkdruk en werkethiek wijken af. Medewerker bevestigt dat dit de primaire reden voor vertrek is.',
    medewerkerBevestigt: true,
    opmerkingen: [
      { tekst: 'Claim ontvangen, wordt beoordeeld.', datum: '2025-12-16', door: 'Systeem' },
      { tekst: 'Exitgesprek gepland op 20 december 2025.', datum: '2025-12-17', door: 'Refurzy' },
      { tekst: 'Exitgesprek afgerond. Medewerker bevestigt waardenmismatch.', datum: '2025-12-20', door: 'Refurzy' },
      { tekst: 'Claim goedgekeurd — vervangende kandidaat wordt geleverd zonder nieuwe plaatsingsfee.', datum: '2025-12-22', door: 'Refurzy' },
    ],
  },
  {
    id: 'claim-3',
    kandidaatNaam: 'Kevin de Boer',
    medewerkerEmail: 'k.deboer@email.nl',
    opdrachtgeverNaam: 'Daan Verhoeven',
    opdrachtgeverBedrijf: 'TechVentures B.V.',
    vacature: 'Data Analyst',
    plaatsingsDatum: '2025-04-01',
    claimDatum: '2025-10-10',
    reden: 'Organisatiefit-mismatch',
    toelichting: 'Opdrachtgever meldt vertrek na 5 maanden.',
    status: 'afgewezen',
    mScore: 86,
    exitgesprekDatum: '2025-10-14',
    exitgesprekSamenvatting: 'Medewerker geeft aan dat de functie-inhoud substantieel afweek van de vacatureomschrijving. De dagelijkse werkzaamheden kwamen niet overeen met wat was afgesproken. Medewerker bevestigt niet dat dit een fit-mismatch betreft.',
    medewerkerBevestigt: false,
    opmerkingen: [
      { tekst: 'Claim ontvangen, wordt beoordeeld.', datum: '2025-10-11', door: 'Systeem' },
      { tekst: 'Exitgesprek gepland op 14 oktober 2025.', datum: '2025-10-12', door: 'Refurzy' },
      { tekst: 'Exitgesprek afgerond met medewerker.', datum: '2025-10-15', door: 'Refurzy' },
      { tekst: 'Afgewezen: medewerker geeft in exitgesprek aan dat de functie-inhoud afweek van de vacatureomschrijving. Dit is geen fit-mismatch maar een gewijzigde functie — valt buiten de dekking.', datum: '2025-10-18', door: 'Refurzy' },
    ],
  },
]

const statusConfig: Record<ClaimStatus, { label: string; color: string; step: number }> = {
  'ontvangen': { label: 'Ontvangen', color: 'bg-blue-100 text-blue-700', step: 0 },
  'exitgesprek_plannen': { label: 'Exitgesprek plannen', color: 'bg-orange/10 text-orange', step: 1 },
  'exitgesprek_gepland': { label: 'Exitgesprek gepland', color: 'bg-purple/10 text-purple', step: 2 },
  'exitgesprek_afgerond': { label: 'Exitgesprek afgerond', color: 'bg-cyan/10 text-cyan', step: 3 },
  'in_beoordeling': { label: 'In beoordeling', color: 'bg-amber-100 text-amber-700', step: 4 },
  'goedgekeurd': { label: 'Goedgekeurd', color: 'bg-green-100 text-green-700', step: 5 },
  'afgewezen': { label: 'Afgewezen', color: 'bg-red-100 text-red-700', step: 5 },
}

const procedureSteps = [
  'Claim ontvangen',
  'Exitgesprek plannen',
  'Exitgesprek gepland',
  'Exitgesprek afgerond',
  'Beoordeling',
  'Besluit',
]

function StatusBadge({ status }: { status: ClaimStatus }) {
  const cfg = statusConfig[status]
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function ProcedureBar({ status }: { status: ClaimStatus }) {
  const currentStep = statusConfig[status].step
  const isFinal = status === 'goedgekeurd' || status === 'afgewezen'

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-0.5">
        {procedureSteps.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${
            status === 'afgewezen' && i <= currentStep ? 'bg-red-400' :
            status === 'goedgekeurd' && i <= currentStep ? 'bg-green-500' :
            i < currentStep ? 'bg-cyan' :
            i === currentStep ? 'bg-purple' :
            'bg-surface-muted'
          }`} />
        ))}
      </div>
      <div className="flex justify-between">
        {procedureSteps.map((label, i) => (
          <span key={label} className={`text-[9px] flex-1 ${
            isFinal && i === currentStep ? (status === 'goedgekeurd' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold') :
            i === currentStep ? 'text-purple font-semibold' :
            i < currentStep ? 'text-ink-light' :
            'text-ink-muted'
          }`}>
            {i < currentStep ? '\u2713 ' : ''}{label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AdminFitGarantie() {
  const [claims, setClaims] = useState<FitGarantieClaim[]>(initialClaims)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newOpmerking, setNewOpmerking] = useState('')

  // Exitgesprek planning state
  const [showExitgesprekModal, setShowExitgesprekModal] = useState(false)
  const [exitgesprekClaimId, setExitgesprekClaimId] = useState<string | null>(null)
  const [exitgesprekDatum, setExitgesprekDatum] = useState('')

  // Exitgesprek afronden state
  const [showAfrondenModal, setShowAfrondenModal] = useState(false)
  const [afrondenClaimId, setAfrondenClaimId] = useState<string | null>(null)
  const [exitSamenvatting, setExitSamenvatting] = useState('')
  const [medewerkerBevestigt, setMedewerkerBevestigt] = useState<boolean | null>(null)

  // Besluit modal state
  const [showBesluitModal, setShowBesluitModal] = useState(false)
  const [besluitClaimId, setBesluitClaimId] = useState<string | null>(null)
  const [besluitType, setBesluitType] = useState<'goedgekeurd' | 'afgewezen' | null>(null)
  const [besluitToelichting, setBesluitToelichting] = useState('')

  const stats = {
    actieveGaranties: 12,
    openClaims: claims.filter(c => !['goedgekeurd', 'afgewezen'].includes(c.status)).length,
    goedgekeurd: claims.filter(c => c.status === 'goedgekeurd').length,
    afgewezen: claims.filter(c => c.status === 'afgewezen').length,
  }

  const updateClaim = (id: string, updates: Partial<FitGarantieClaim>) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const addOpmerking = (id: string, tekst: string, door: string = 'Refurzy') => {
    setClaims(prev => prev.map(c => c.id === id ? {
      ...c,
      opmerkingen: [...c.opmerkingen, { tekst, datum: new Date().toISOString().split('T')[0], door }],
    } : c))
  }

  // Plan exitgesprek
  const openPlanExitgesprek = (claimId: string) => {
    setExitgesprekClaimId(claimId)
    setExitgesprekDatum('')
    setShowExitgesprekModal(true)
  }

  const handlePlanExitgesprek = () => {
    if (!exitgesprekClaimId || !exitgesprekDatum) return
    const datum = new Date(exitgesprekDatum)
    const datumStr = datum.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    updateClaim(exitgesprekClaimId, { status: 'exitgesprek_gepland', exitgesprekDatum })
    addOpmerking(exitgesprekClaimId, `Exitgesprek met medewerker gepland op ${datumStr}. Uitnodiging verstuurd per e-mail.`)
    setShowExitgesprekModal(false)
  }

  // Afronden exitgesprek
  const openAfrondenExitgesprek = (claimId: string) => {
    setAfrondenClaimId(claimId)
    setExitSamenvatting('')
    setMedewerkerBevestigt(null)
    setShowAfrondenModal(true)
  }

  const handleAfrondenExitgesprek = () => {
    if (!afrondenClaimId || !exitSamenvatting || medewerkerBevestigt === null) return
    updateClaim(afrondenClaimId, {
      status: 'in_beoordeling',
      exitgesprekSamenvatting: exitSamenvatting,
      medewerkerBevestigt,
    })
    const bevestigingTekst = medewerkerBevestigt
      ? 'Medewerker bevestigt dat het vertrek het gevolg is van een fit-mismatch.'
      : 'Medewerker bevestigt niet dat het vertrek het gevolg is van een fit-mismatch.'
    addOpmerking(afrondenClaimId, `Exitgesprek afgerond. ${bevestigingTekst} Claim gaat naar beoordeling.`)
    setShowAfrondenModal(false)
  }

  // Besluit nemen
  const openBesluit = (claimId: string, type: 'goedgekeurd' | 'afgewezen') => {
    setBesluitClaimId(claimId)
    setBesluitType(type)
    setBesluitToelichting('')
    setShowBesluitModal(true)
  }

  const handleBesluit = () => {
    if (!besluitClaimId || !besluitType || !besluitToelichting) return
    updateClaim(besluitClaimId, { status: besluitType })
    const tekst = besluitType === 'goedgekeurd'
      ? `Claim goedgekeurd: ${besluitToelichting}. Vervangende kandidaat wordt geleverd zonder nieuwe plaatsingsfee.`
      : `Claim afgewezen: ${besluitToelichting}`
    addOpmerking(besluitClaimId, tekst)
    setShowBesluitModal(false)
  }

  const handleAddOpmerking = (claimId: string) => {
    if (!newOpmerking.trim()) return
    addOpmerking(claimId, newOpmerking)
    setNewOpmerking('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Fit Garantie Beheer</h1>
        <p className="text-ink-light font-medium mt-1">Beheer en beoordeel Fit Garantie claims</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="text-sm text-ink-light">Actieve garanties</div>
          <div className="text-2xl font-bold text-ink mt-1">{stats.actieveGaranties}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="text-sm text-ink-light">Open claims</div>
          <div className="text-2xl font-bold text-orange mt-1">{stats.openClaims}</div>
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

      {/* Procedure uitleg */}
      <div className="bg-purple/5 border border-purple/15 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-purple mb-3">Claim beoordelingsprocedure</h3>
        <div className="flex items-center gap-2 text-xs text-ink-light">
          {procedureSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="bg-white border border-purple/20 rounded-lg px-2 py-1 font-medium text-ink">{i + 1}. {step}</span>
              {i < procedureSteps.length - 1 && <span className="text-purple">&rarr;</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Claims list */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="hidden md:grid grid-cols-7 gap-4 px-6 py-3 bg-surface-muted border-b border-surface-border text-xs font-medium text-ink-muted uppercase tracking-wide">
          <div>Kandidaat</div>
          <div>Opdrachtgever</div>
          <div>Vacature</div>
          <div>Plaatsingsdatum</div>
          <div>Claimdatum</div>
          <div>Reden</div>
          <div>Status</div>
        </div>

        {claims.map((claim) => {
          const isExpanded = expandedId === claim.id
          const isOpen = !['goedgekeurd', 'afgewezen'].includes(claim.status)

          return (
            <div key={claim.id} className="border-b border-surface-border last:border-b-0">
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
                <div><StatusBadge status={claim.status} /></div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-5 bg-surface-muted/30">
                  {/* Procedure bar */}
                  <ProcedureBar status={claim.status} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column: claim details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs font-medium text-ink-muted mb-1">Opdrachtgever</div>
                          <div className="text-sm text-ink">{claim.opdrachtgeverNaam}</div>
                          <div className="text-xs text-ink-muted">{claim.opdrachtgeverBedrijf}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-ink-muted mb-1">M-Score bij plaatsing</div>
                          <div className="text-sm font-bold text-cyan">{claim.mScore}%</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-ink-muted mb-1">Medewerker e-mail</div>
                          <div className="text-sm text-purple font-medium">{claim.medewerkerEmail}</div>
                        </div>
                        {claim.exitgesprekDatum && (
                          <div>
                            <div className="text-xs font-medium text-ink-muted mb-1">Exitgesprek datum</div>
                            <div className="text-sm text-ink font-medium">{new Date(claim.exitgesprekDatum).toLocaleDateString('nl-NL')}</div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-medium text-ink-muted mb-1">Toelichting opdrachtgever</div>
                        <div className="text-sm text-ink bg-white rounded-lg p-3 border border-surface-border">{claim.toelichting}</div>
                      </div>

                      {/* Exitgesprek samenvatting */}
                      {claim.exitgesprekSamenvatting && (
                        <div>
                          <div className="text-xs font-medium text-ink-muted mb-1">Exitgesprek samenvatting</div>
                          <div className="text-sm text-ink bg-white rounded-lg p-3 border border-surface-border space-y-2">
                            <p>{claim.exitgesprekSamenvatting}</p>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              claim.medewerkerBevestigt ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {claim.medewerkerBevestigt ? '\u2713 Medewerker bevestigt fit-mismatch' : '\u2717 Medewerker bevestigt geen fit-mismatch'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action buttons per status */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        {claim.status === 'exitgesprek_plannen' && (
                          <button
                            onClick={() => openPlanExitgesprek(claim.id)}
                            className="px-4 py-2 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple-dark transition-colors"
                          >
                            Plan exitgesprek
                          </button>
                        )}
                        {claim.status === 'exitgesprek_gepland' && (
                          <button
                            onClick={() => openAfrondenExitgesprek(claim.id)}
                            className="px-4 py-2 bg-cyan text-navy-dark text-sm font-medium rounded-lg hover:bg-cyan/90 transition-colors"
                          >
                            Exitgesprek afronden
                          </button>
                        )}
                        {claim.status === 'in_beoordeling' && (
                          <>
                            <button
                              onClick={() => openBesluit(claim.id, 'goedgekeurd')}
                              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Goedkeuren
                            </button>
                            <button
                              onClick={() => openBesluit(claim.id, 'afgewezen')}
                              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Afwijzen
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right column: opmerkingen */}
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-ink-muted mb-1">Opmerkingen ({claim.opmerkingen.length})</div>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {claim.opmerkingen.map((o, i) => (
                          <div key={i} className="bg-white rounded-lg p-3 border border-surface-border">
                            <div className="text-sm text-ink">{o.tekst}</div>
                            <div className="text-xs text-ink-muted mt-1">{o.door} &mdash; {new Date(o.datum).toLocaleDateString('nl-NL')}</div>
                          </div>
                        ))}
                      </div>

                      {isOpen && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Opmerking toevoegen..."
                            value={expandedId === claim.id ? newOpmerking : ''}
                            onChange={(e) => setNewOpmerking(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddOpmerking(claim.id) }}
                            className="flex-1 bg-white border border-surface-border rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-cyan/50"
                          />
                          <button
                            onClick={() => handleAddOpmerking(claim.id)}
                            className="px-3 py-2 bg-purple/10 text-purple text-sm font-medium rounded-lg hover:bg-purple/20 transition-colors"
                          >
                            Toevoegen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Exitgesprek plannen modal */}
      {showExitgesprekModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-border w-full max-w-md mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Exitgesprek plannen</h3>
              <button onClick={() => setShowExitgesprekModal(false)} className="text-ink-muted hover:text-ink text-xl">&times;</button>
            </div>

            {(() => {
              const claim = claims.find(c => c.id === exitgesprekClaimId)
              if (!claim) return null
              return (
                <div className="space-y-4">
                  <div className="bg-surface-muted rounded-lg p-3 text-sm">
                    <p className="text-ink font-medium">{claim.kandidaatNaam}</p>
                    <p className="text-ink-muted text-xs">{claim.vacature} bij {claim.opdrachtgeverBedrijf}</p>
                  </div>

                  <p className="text-ink-light text-sm">
                    Plan een exitgesprek met de medewerker. Refurzy voert dit gesprek om vast te stellen of het vertrek
                    het gevolg is van een fit-mismatch. Een uitnodiging wordt per e-mail verstuurd naar {claim.medewerkerEmail}.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Datum exitgesprek</label>
                    <input
                      type="date"
                      value={exitgesprekDatum}
                      onChange={(e) => setExitgesprekDatum(e.target.value)}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
                    />
                  </div>

                  <div className="bg-purple/5 border border-purple/15 rounded-lg p-3">
                    <p className="text-xs text-purple font-medium">Binnen 10 werkdagen na ontvangst claim moet het exitgesprek plaatsvinden.</p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowExitgesprekModal(false)} className="px-4 py-2 text-sm text-ink-light hover:text-ink">Annuleren</button>
                    <button
                      onClick={handlePlanExitgesprek}
                      disabled={!exitgesprekDatum}
                      className="px-6 py-2 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verstuur uitnodiging
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Exitgesprek afronden modal */}
      {showAfrondenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-border w-full max-w-lg mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Exitgesprek afronden</h3>
              <button onClick={() => setShowAfrondenModal(false)} className="text-ink-muted hover:text-ink text-xl">&times;</button>
            </div>

            {(() => {
              const claim = claims.find(c => c.id === afrondenClaimId)
              if (!claim) return null
              return (
                <div className="space-y-4">
                  <div className="bg-surface-muted rounded-lg p-3 text-sm">
                    <p className="text-ink font-medium">{claim.kandidaatNaam}</p>
                    <p className="text-ink-muted text-xs">{claim.vacature} bij {claim.opdrachtgeverBedrijf} &middot; Claim: {claim.reden}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Samenvatting exitgesprek</label>
                    <textarea
                      value={exitSamenvatting}
                      onChange={(e) => setExitSamenvatting(e.target.value)}
                      placeholder="Beschrijf de bevindingen uit het exitgesprek..."
                      rows={4}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Bevestigt de medewerker dat het vertrek het gevolg is van een fit-mismatch?</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setMedewerkerBevestigt(true)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                          medewerkerBevestigt === true
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-surface-border bg-white text-ink-light hover:border-green-300'
                        }`}
                      >
                        Ja, bevestigt
                      </button>
                      <button
                        onClick={() => setMedewerkerBevestigt(false)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                          medewerkerBevestigt === false
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-surface-border bg-white text-ink-light hover:border-red-300'
                        }`}
                      >
                        Nee, bevestigt niet
                      </button>
                    </div>
                  </div>

                  {medewerkerBevestigt === false && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-700 font-medium">
                        Let op: Zonder bevestiging van de medewerker kan de claim in principe niet worden goedgekeurd.
                        Het eindoordeel ligt bij Refurzy.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowAfrondenModal(false)} className="px-4 py-2 text-sm text-ink-light hover:text-ink">Annuleren</button>
                    <button
                      onClick={handleAfrondenExitgesprek}
                      disabled={!exitSamenvatting || medewerkerBevestigt === null}
                      className="px-6 py-2 bg-cyan text-navy-dark text-sm font-medium rounded-lg hover:bg-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Exitgesprek afronden
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Besluit modal */}
      {showBesluitModal && besluitType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-border w-full max-w-md mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">
                Claim {besluitType === 'goedgekeurd' ? 'goedkeuren' : 'afwijzen'}
              </h3>
              <button onClick={() => setShowBesluitModal(false)} className="text-ink-muted hover:text-ink text-xl">&times;</button>
            </div>

            {(() => {
              const claim = claims.find(c => c.id === besluitClaimId)
              if (!claim) return null
              return (
                <div className="space-y-4">
                  <div className="bg-surface-muted rounded-lg p-3 text-sm">
                    <p className="text-ink font-medium">{claim.kandidaatNaam} &mdash; {claim.reden}</p>
                    <p className="text-ink-muted text-xs">{claim.vacature} bij {claim.opdrachtgeverBedrijf}</p>
                    {claim.medewerkerBevestigt !== undefined && (
                      <p className={`text-xs font-medium mt-1 ${claim.medewerkerBevestigt ? 'text-green-600' : 'text-red-500'}`}>
                        Medewerker: {claim.medewerkerBevestigt ? 'bevestigt fit-mismatch' : 'bevestigt geen fit-mismatch'}
                      </p>
                    )}
                  </div>

                  {besluitType === 'goedgekeurd' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                      <p className="font-semibold mb-1">Bij goedkeuring:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Opdrachtgever ontvangt bevestiging</li>
                        <li>Refurzy levert een vervangende kandidaat zonder nieuwe plaatsingsfee</li>
                        <li>Scout wordt geinformeerd</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                      <p className="font-semibold mb-1">Bij afwijzing:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Opdrachtgever ontvangt motivatie van de afwijzing</li>
                        <li>Geen vervangende kandidaat</li>
                        <li>Opdrachtgever kan bezwaar maken</li>
                      </ul>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      {besluitType === 'goedgekeurd' ? 'Motivatie goedkeuring' : 'Motivatie afwijzing'}
                    </label>
                    <textarea
                      value={besluitToelichting}
                      onChange={(e) => setBesluitToelichting(e.target.value)}
                      placeholder={besluitType === 'goedgekeurd'
                        ? 'Beschrijf waarom de claim binnen de dekking valt...'
                        : 'Beschrijf waarom de claim buiten de dekking valt...'}
                      rows={3}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowBesluitModal(false)} className="px-4 py-2 text-sm text-ink-light hover:text-ink">Annuleren</button>
                    <button
                      onClick={handleBesluit}
                      disabled={!besluitToelichting}
                      className={`px-6 py-2 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        besluitType === 'goedgekeurd' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {besluitType === 'goedgekeurd' ? 'Goedkeuren' : 'Afwijzen'}
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
