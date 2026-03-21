'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { allVacatures, scoutKandidaten, calculateFee } from '@/lib/mock-data'
import { Kandidaat } from '@/lib/types'
import FitScore from '@/components/FitScore'
import HardeCriteriaDetail from '@/components/HardeCriteriaDetail'
import StatusBadge from '@/components/StatusBadge'

export default function ScoutVacatureDetail() {
  const params = useParams()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedKandidaat, setSelectedKandidaat] = useState<Kandidaat | null>(null)
  const [toelichting, setToelichting] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const vacature = allVacatures.find((v) => v.id === params.id)

  if (!vacature) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-light">Vacature niet gevonden.</p>
      </div>
    )
  }

  // Filter: only show candidates who completed their scan AND aren't already proposed for this vacancy
  const scoutId = 'scout-1' // current logged-in scout
  const alVoorgedragenIds = vacature.kandidaten.map(k => k.id)
  const aantalVoorgedragenDoorMij = vacature.kandidaten.filter(k => k.scoutId === scoutId).length
  const maxPerScout = 2
  const beschikbareKandidaten = scoutKandidaten.filter(
    k => k.scanCompleted && !alVoorgedragenIds.includes(k.id)
  )

  const handleVoordragen = () => {
    if (!selectedKandidaat) return
    setSubmitted(true)
    // In a real app this would POST to API — here we just show success
  }

  const resetModal = () => {
    setShowModal(false)
    setSelectedKandidaat(null)
    setToelichting('')
    setSubmitted(false)
  }

  return (
    <div className="space-y-8">
      <Link href="/demo/scout/vacatures" className="text-ink-light hover:text-cyan text-sm inline-flex items-center gap-1 transition-colors">← Terug naar vacatures</Link>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">{vacature.title}</h1>
          <p className="text-purple mt-1">{vacature.company} &middot; {vacature.location}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={aantalVoorgedragenDoorMij >= maxPerScout}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            aantalVoorgedragenDoorMij >= maxPerScout
              ? 'bg-surface-muted text-ink-muted cursor-not-allowed'
              : 'bg-cyan text-navy-dark hover:bg-cyan/90'
          }`}
        >
          {aantalVoorgedragenDoorMij >= maxPerScout ? `Max. ${maxPerScout} kandidaten voorgedragen` : 'Kandidaat voordragen'}
        </button>
      </div>

      {/* Vacature info */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div><span className="text-ink-muted">Salaris</span><p className="text-ink font-medium">{vacature.salaris || '€4.000 – €6.000'}</p></div>
          <div><span className="text-ink-muted">Deadline</span><p className="text-ink font-medium">{new Date(vacature.deadline).toLocaleDateString('nl-NL')}</p></div>
          <div><span className="text-ink-muted">Contract</span><p className="text-ink font-medium">Vast</p></div>
          <div><span className="text-ink-muted">Geplaatst</span><p className="text-ink font-medium">2 weken geleden</p></div>
        </div>
        <p className="text-sm text-ink-light leading-relaxed">
          We zoeken een ervaren {vacature.title} die onze organisatie versterkt. De ideale kandidaat combineert vakkennis met een sterke culturele fit. Je werkt nauw samen met het team en draagt bij aan de groeidoelstellingen van {vacature.company}.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-sm font-medium text-ink-muted mb-3">Harde Criteria</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="text-ink-muted">Opleiding</span>
            <p className="text-ink">{vacature.hardeCriteria.opleidingsniveau}</p>
          </div>
          <div>
            <span className="text-ink-muted">Ervaring</span>
            <p className="text-ink">{vacature.hardeCriteria.minimaleErvaring}</p>
          </div>
          <div>
            <span className="text-ink-muted">Locatie</span>
            <p className="text-ink">{vacature.hardeCriteria.locatie}</p>
          </div>
          <div>
            <span className="text-ink-muted">Op kantoor</span>
            <p className="text-ink">{vacature.hardeCriteria.opKantoor}</p>
          </div>
          <div>
            <span className="text-ink-muted">Max. reistijd</span>
            <p className="text-ink">{vacature.hardeCriteria.maxReistijd}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">
            Voorgedragen kandidaten ({vacature.kandidaten.length})
          </h2>
          <span className="text-xs text-ink-muted">
            Jouw voordrachten: {aantalVoorgedragenDoorMij}/{maxPerScout}
          </span>
        </div>

        {vacature.kandidaten.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
            <p className="text-ink-light">Nog geen kandidaten voorgedragen voor deze vacature.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left px-6 py-3 text-ink-muted font-medium">Kandidaat</th>
                  <th className="text-left px-6 py-3 text-ink-muted font-medium">Harde Criteria Match</th>
                  <th className="text-left px-6 py-3 text-ink-muted font-medium">M-Score</th>
                  <th className="text-left px-6 py-3 text-ink-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {vacature.kandidaten.map((k) => (
                  <tr key={k.id} className="border-b border-surface-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple/20 text-purple flex items-center justify-center text-xs font-bold">
                          {k.initialen}
                        </div>
                        <span className="text-ink font-medium">
                          {k.anoniem ? `Kandidaat ${k.initialen}` : k.naam}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FitScore score={k.hardeCriteriaMatch} size="sm" />
                        <HardeCriteriaDetail kandidaat={k} hardeCriteria={vacature?.hardeCriteria} size="sm" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <FitScore score={k.deVriesFit} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={k.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Modal: Kandidaat voordragen ──────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetModal} />

          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-surface-border w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-surface-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Kandidaat voordragen</h2>
                <button onClick={resetModal} className="text-ink-muted hover:text-ink transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-ink-light font-medium mt-1">
                {vacature.title} bij {vacature.company}
              </p>
            </div>

            {!submitted ? (
              <>
                {/* Body */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                  {aantalVoorgedragenDoorMij >= maxPerScout ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">🚫</div>
                      <p className="text-ink font-medium mb-1">Maximum bereikt</p>
                      <p className="text-sm text-ink-light">
                        Je hebt al {maxPerScout} kandidaten voorgedragen voor deze vacature. Dit is het maximale aantal per scout.
                      </p>
                    </div>
                  ) : beschikbareKandidaten.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">👥</div>
                      <p className="text-ink font-medium mb-1">Geen beschikbare kandidaten</p>
                      <p className="text-sm text-ink-light">
                        Al je kandidaten zijn al voorgedragen voor deze vacature, of hebben hun Matching Scan nog niet afgerond.
                      </p>
                      <Link
                        href="/demo/scout/kandidaat-uitnodigen"
                        className="inline-block mt-4 px-4 py-2 bg-purple text-white rounded-lg text-sm font-medium hover:bg-purple/90 transition-colors"
                        onClick={resetModal}
                      >
                        Nieuwe kandidaat uitnodigen
                      </Link>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-ink-muted mb-3">
                        Selecteer een kandidaat uit je talent pool:
                      </p>
                      <div className="space-y-2">
                        {beschikbareKandidaten.map(k => {
                          const isSelected = selectedKandidaat?.id === k.id
                          const feeInfo = calculateFee(k.opleidingsniveau, k.werkervaring)
                          const voorkeurMatcht = vacature.title.toLowerCase().includes(k.voorkeursFunctie.toLowerCase())
                            || k.voorkeursFunctie.toLowerCase().includes(vacature.title.toLowerCase())
                          return (
                            <button
                              key={k.id}
                              onClick={() => setSelectedKandidaat(k)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'border-purple bg-purple/5'
                                  : 'border-surface-border hover:border-purple/30 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                  isSelected ? 'bg-purple text-white' : 'bg-purple/20 text-purple'
                                }`}>
                                  {k.naam.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-ink font-medium">{k.naam}</p>
                                  <p className="text-xs text-ink-light truncate">{k.huidigeRol}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs text-ink-muted">{k.opleidingsniveau} · {k.werkervaring}</p>
                                  <p className="text-xs text-ink-light">{k.woonplaats}</p>
                                </div>
                              </div>
                              {/* Voorkeursfunctie */}
                              <div className="mt-2 flex items-center gap-1.5">
                                {voorkeurMatcht ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    Voorkeur: {k.voorkeursFunctie}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-muted text-ink-muted text-xs">
                                    🎯 Voorkeur: {k.voorkeursFunctie}
                                  </span>
                                )}
                              </div>
                              {isSelected && (
                                <div className="mt-3 pt-3 border-t border-purple/10">
                                  <div className="flex items-center gap-4 text-xs text-ink-muted">
                                    <span>📄 CV geüpload</span>
                                    <span>✅ Matching Scan afgerond</span>
                                    <span className="ml-auto text-purple font-medium">
                                      Fee: €{feeInfo.fee.toLocaleString('nl-NL')}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {selectedKandidaat && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-ink mb-1.5">
                            Toelichting <span className="text-ink-muted font-normal">(optioneel)</span>
                          </label>
                          <textarea
                            value={toelichting}
                            onChange={(e) => setToelichting(e.target.value)}
                            placeholder="Waarom is deze kandidaat geschikt voor deze vacature?"
                            className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple resize-none"
                            rows={3}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                {beschikbareKandidaten.length > 0 && (
                  <div className="px-6 py-4 border-t border-surface-border flex items-center justify-between">
                    <button onClick={resetModal} className="px-4 py-2.5 text-sm text-ink-light hover:text-ink transition-colors">
                      Annuleren
                    </button>
                    <button
                      onClick={handleVoordragen}
                      disabled={!selectedKandidaat}
                      className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedKandidaat
                          ? 'bg-purple text-white hover:bg-purple/90'
                          : 'bg-surface-muted text-ink-muted cursor-not-allowed'
                      }`}
                    >
                      Voordragen
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Success state */
              <div className="px-6 py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">
                  {selectedKandidaat?.naam} voorgedragen!
                </h3>
                <p className="text-sm text-ink-light mb-1">
                  De opdrachtgever ontvangt een notificatie en kan het anonieme profiel bekijken.
                </p>
                <p className="text-sm text-ink-light mb-6">
                  Bij akkoord wordt het contract opgesteld en krijgt de opdrachtgever toegang tot de volledige contactgegevens.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={resetModal}
                    className="px-5 py-2.5 border border-surface-border rounded-lg text-sm font-medium text-ink hover:bg-surface-muted transition-colors"
                  >
                    Sluiten
                  </button>
                  <Link
                    href="/demo/scout/vacatures"
                    className="px-5 py-2.5 bg-purple text-white rounded-lg text-sm font-medium hover:bg-purple/90 transition-colors"
                    onClick={resetModal}
                  >
                    Terug naar vacatures
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
