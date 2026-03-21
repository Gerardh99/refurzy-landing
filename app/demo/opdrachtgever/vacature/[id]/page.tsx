'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { vacatures } from '@/lib/mock-data'
import { KandidaatMatch, AfwijzingsReden } from '@/lib/types'
import { afwijzingsRedenen } from '@/lib/mock-data'
import FitScore from '@/components/FitScore'
import StarRating from '@/components/StarRating'
// StatusBadge removed — scores tell the full story
import HardeCriteriaDetail from '@/components/HardeCriteriaDetail'
import Link from 'next/link'
import { logConsent } from '@/lib/consent-log'


function isNewScout(scoutNaam: string) {
  return scoutNaam === 'Mark Jansen' // mock: Mark Jansen is new scout
}

export default function VacatureDetailPage() {
  const params = useParams()
  const vacature = vacatures.find((v) => v.id === params.id)
  const [kandidaten, setKandidaten] = useState<KandidaatMatch[]>(vacature?.kandidaten ?? [])
  const [contractModal, setContractModal] = useState<string | null>(null)
  const [akkoord, setAkkoord] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [exclusief, setExclusief] = useState(false)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectRating, setRejectRating] = useState(0)
  const [rejectReason, setRejectReason] = useState<AfwijzingsReden | ''>('')
  const [rejectNote, setRejectNote] = useState('')
  const [editing, setEditing] = useState(false)
  const [beschrijving, setBeschrijving] = useState(
    `We zoeken een ervaren ${vacature?.title || 'professional'} die ons team versterkt. De ideale kandidaat combineert vakkennis met een sterke culturele fit.\n\nWat ga je doen?\n• Verantwoordelijk voor het ontwikkelen en uitvoeren van de ${vacature?.title || ''} strategie\n• Samenwerken met interne stakeholders en externe partners\n• Bijdragen aan de groeidoelstellingen van de organisatie\n• Rapporteren aan het management team\n\nWat vragen wij?\n• Minimaal ${vacature?.hardeCriteria?.minimaleErvaring || '5 jaar'} relevante werkervaring\n• ${vacature?.hardeCriteria?.opleidingsniveau || 'HBO'} werk- en denkniveau\n• Uitstekende communicatieve vaardigheden in woord en geschrift\n• Proactieve houding en teamspeler\n\nWat bieden wij?\n• Salaris: ${vacature?.salaris || 'Marktconform'}\n• ${vacature?.hardeCriteria?.opKantoor || 'Hybride werken'}\n• 25 vakantiedagen + 13 ADV-dagen\n• Pensioenregeling en reiskostenvergoeding`
  )
  const [savedToast, setSavedToast] = useState(false)

  if (!vacature) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-ink-light">Vacature niet gevonden</div>
      </div>
    )
  }

  const handleUnlock = (kandidaatId: string) => {
    // Log consent for plaatsingsovereenkomst
    logConsent('demo@bedrijf.nl', 'opdrachtgever', 'plaatsingsovereenkomst', true, 'checkbox')

    setKandidaten((prev) =>
      prev.map((k) => (k.id === kandidaatId ? { ...k, unlocked: true, anoniem: false } : k))
    )
    setContractModal(null)
    setAkkoord(false)
    setToast('Profiel ontgrendeld — plaatsingsovereenkomst getekend!')
    setTimeout(() => setToast(null), 4000)
  }

  // Minimum scout rating based on pipeline phase reached
  const getMinRating = (procesStatus: string) => {
    if (['contract_akkoord', 'gesprek_plannen', 'gesprek_gepland', 'feedback_geven'].includes(procesStatus)) return 3
    if (procesStatus === 'arbeidsvoorwaarden') return 4
    return 0 // voorgesteld: no minimum
  }

  const openRejectModal = (kandidaatId: string) => {
    const k = kandidaten.find(c => c.id === kandidaatId)
    const min = k ? getMinRating(k.procesStatus) : 0
    setRejectModal(kandidaatId)
    setRejectRating(min > 0 ? min : 0)
    setRejectReason('')
    setRejectNote('')
  }

  const handleAfwijzen = () => {
    if (!rejectModal || !rejectReason || rejectRating === 0) return
    setKandidaten((prev) =>
      prev.map((k) =>
        k.id === rejectModal ? {
          ...k,
          status: 'afgewezen' as const,
          procesStatus: 'afgewezen' as const,
          afwijzingsReden: rejectReason as AfwijzingsReden,
          afwijzingsToelichting: rejectNote || undefined,
          afwijzingsRating: rejectRating,
        } : k
      )
    )
    setRejectModal(null)
    setToast('Kandidaat afgewezen — feedback opgeslagen')
    setTimeout(() => setToast(null), 4000)
  }

  // Sort by M-Score descending
  // Sort by combined score: hard criteria (40%) + M-Score (40%) + scout rating normalized (20%)
  const sorted = [...kandidaten].sort((a, b) => {
    const scoreA = a.hardeCriteriaMatch * 0.4 + a.deVriesFit * 0.4 + (a.scoutRating / 5) * 100 * 0.2
    const scoreB = b.hardeCriteriaMatch * 0.4 + b.deVriesFit * 0.4 + (b.scoutRating / 5) * 100 * 0.2
    return scoreB - scoreA
  })

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-pulse">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          ← Terug naar dashboard
        </Link>
        <div className="flex items-start justify-between mt-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{vacature.title}</h1>
            <p className="text-ink-light font-medium mt-1">{vacature.company} &middot; {vacature.location}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Exclusiviteit toggle */}
            <div className="bg-surface-muted rounded-xl border border-surface-border px-4 py-2 text-center">
              <p className="text-[10px] text-ink-muted mb-0.5">Exclusiviteit</p>
              <button
                onClick={() => setExclusief(!exclusief)}
                className={`text-xs font-semibold px-2 py-0.5 rounded ${exclusief ? 'bg-orange/15 text-orange border border-orange/30' : 'bg-purple/10 text-ink-light border border-surface-border'}`}
              >
                {exclusief ? '2 weken actief — +30%' : 'Niet actief'}
              </button>
            </div>
            <div className="text-right">
              <div className="text-sm text-ink-light">Deadline</div>
              <div className="text-ink font-semibold">{new Date(vacature.deadline).toLocaleDateString('nl-NL')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vacaturebeschrijving */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-ink font-semibold">Vacaturebeschrijving</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple border border-purple/20 rounded-lg hover:bg-purple/5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              Bewerken
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-xs font-medium text-ink-light border border-surface-border rounded-lg hover:text-ink transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setSavedToast(true)
                  setTimeout(() => setSavedToast(false), 3000)
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-purple rounded-lg hover:bg-purple/90 transition-colors"
              >
                Opslaan
              </button>
            </div>
          )}
        </div>
        {editing ? (
          <textarea
            value={beschrijving}
            onChange={(e) => setBeschrijving(e.target.value)}
            className="w-full min-h-[280px] px-4 py-3 border border-surface-border rounded-xl text-sm text-ink leading-relaxed placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple resize-y"
          />
        ) : (
          <div className="text-sm text-ink-light leading-relaxed whitespace-pre-line">
            {beschrijving}
          </div>
        )}
      </div>

      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-purple text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-sm">
          &#10003; Vacaturebeschrijving opgeslagen
        </div>
      )}

      {/* M-Score Profiel Status */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-ink font-semibold mb-4">M-Score Profiel</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-400">&#10003;</span>
              <span className="text-sm text-ink">Organisatieprofiel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400 font-medium">Ingevuld</span>
              <Link
                href="/demo/opdrachtgever/matching-profiel"
                className="text-xs text-purple font-medium hover:text-purple/80 transition-colors"
              >
                Bekijken
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-400">&#10003;</span>
              <span className="text-sm text-ink">Werkzaamheden (vac.)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400 font-medium">Ingevuld</span>
              <button className="text-xs text-purple font-medium hover:text-purple/80 transition-colors">
                Bewerken
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-surface-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-green-400 font-medium">Volledig &mdash; kandidaten worden gematcht</span>
          </div>
        </div>
      </div>

      {/* Exclusiviteit banner */}
      {exclusief && (
        <div className="bg-orange/10 border border-orange/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-orange font-semibold text-sm">Exclusiviteitsperiode actief — 30% premium</p>
            <p className="text-orange/70 text-xs">Kandidaten zijn 2 weken exclusief voor u beschikbaar. De bemiddelingsvergoeding wordt met 30% verhoogd. Dit premium bedrag gaat volledig naar de Talent Scout.</p>
          </div>
        </div>
      )}

      {/* Harde Criteria Summary */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-ink font-semibold mb-4">Harde Criteria</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Opleiding', value: vacature.hardeCriteria.opleidingsniveau },
            { label: 'Ervaring', value: vacature.hardeCriteria.minimaleErvaring },
            { label: 'Locatie', value: vacature.hardeCriteria.locatie },
            { label: 'Op kantoor', value: vacature.hardeCriteria.opKantoor },
            { label: 'Max reistijd', value: vacature.hardeCriteria.maxReistijd },
            { label: 'Salaris', value: vacature.salarisMin && vacature.salarisMax ? `€${vacature.salarisMin.toLocaleString('nl-NL')} – €${vacature.salarisMax.toLocaleString('nl-NL')}` : vacature.salaris },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs text-ink-muted mb-1">{item.label}</div>
              <div className="text-sm text-purple font-medium">{item.value}</div>
            </div>
          ))}
        </div>
        {vacature.hardeCriteria.talen && vacature.hardeCriteria.talen.length > 0 && (
          <div>
            <div className="text-xs text-ink-muted mb-2">Vereiste talen</div>
            <div className="flex flex-wrap gap-2">
              {vacature.hardeCriteria.talen.map((t, i) => (
                <span key={i} className="px-2.5 py-1 bg-purple/10 text-purple text-xs rounded-lg font-medium border border-purple/20">
                  {t.taal} — min. {t.minimaalNiveau}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Score legenda */}
      <div className="bg-white rounded-2xl border border-surface-border p-4 mb-6">
        <div className="flex items-center gap-6 text-xs text-ink-light">
          <span className="font-semibold text-ink">Score legenda:</span>
          <span><span className="text-cyan font-medium">M-Score</span> = uitkomst 35-vragen Matching Scan</span>
          <span><span className="text-orange font-medium">50% korting</span> = nieuwe scout zonder track record</span>
        </div>
      </div>

      {/* Kandidaten tabel */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="p-6 border-b border-surface-border">
          <h2 className="text-ink font-semibold">Kandidaten ({kandidaten.length})</h2>
        </div>

        <div className="hidden md:grid grid-cols-[2.5fr_1.2fr_1fr_1.2fr_1.5fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
          <div>Kandidaat</div>
          <div className="text-center">Harde Criteria</div>
          <div className="text-center">M-Score</div>
          <div className="text-center">Scout Rating</div>
          <div className="text-right">Acties</div>
        </div>

        {sorted.map((k) => {
          const newScout = isNewScout(k.scoutNaam)
          const isMaster = k.scoutRating >= 4.0

          return (
            <Link
              key={k.id}
              href={`/demo/opdrachtgever/vacature/${vacature.id}/kandidaat/${k.id}`}
              className="grid grid-cols-1 md:grid-cols-[2.5fr_1.2fr_1fr_1.2fr_1.5fr] gap-2 px-6 py-4 border-b border-surface-border items-center hover:bg-surface-muted transition-colors cursor-pointer"
            >
              {/* Kandidaat */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center text-purple font-bold text-sm">
                  {k.initialen}
                </div>
                <div>
                  <div className="text-ink font-medium text-sm">
                    {k.anoniem ? `Kandidaat ${k.initialen}` : k.naam}
                  </div>
                  <div className="text-xs text-ink-muted flex items-center gap-1">
                    via {k.scoutNaam}
                    {isMaster && <span className="px-1 py-0.5 bg-orange/15 text-orange text-[9px] font-bold rounded border border-orange/30 ml-1">MASTER</span>}
                    {newScout && <span className="px-1 py-0.5 bg-green-500/15 text-green-400 text-[9px] font-bold rounded border border-green-500/30 ml-1">50% KORTING</span>}
                  </div>
                </div>
              </div>

              {/* Harde Criteria */}
              <div className="flex items-center justify-center">
                <HardeCriteriaDetail kandidaat={k} hardeCriteria={vacature.hardeCriteria} size="sm" />
              </div>

              {/* M-Score */}
              <div className="flex justify-center">
                <FitScore score={k.deVriesFit} size="sm" />
              </div>

              {/* Scout Rating */}
              <div className="flex justify-center">
                <StarRating rating={k.scoutRating} />
              </div>

              {/* Acties */}
              <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                {k.unlocked ? (
                  <span className="bg-cyan/15 text-cyan px-3 py-1.5 rounded-lg text-xs font-semibold border border-cyan/20">
                    Bekijk proces →
                  </span>
                ) : (
                  <span className="bg-cyan text-navy-dark px-3 py-1.5 rounded-lg text-xs font-semibold">
                    Bekijk & ontgrendel →
                  </span>
                )}
                {k.status !== 'afgewezen' && (
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); openRejectModal(k.id) }} className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20">
                    Afwijzen
                  </button>
                )}
              </div>
            </Link>
          )
        })}

        {kandidaten.length === 0 && (
          <div className="p-12 text-center text-ink-muted">Nog geen kandidaten voor deze vacature</div>
        )}
      </div>

      {/* Contract Modal */}
      {contractModal && (() => {
        const k = kandidaten.find(c => c.id === contractModal)
        const newScout = k ? isNewScout(k.scoutNaam) : false
        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-surface-border p-8 max-w-lg w-full shadow-2xl">
              <h3 className="text-xl font-bold text-ink mb-2">Profiel ontgrendelen</h3>
              <p className="text-ink-light font-medium text-sm mb-4">
                Om het profiel en contactgegevens te bekijken, gaat u akkoord met de plaatsingsovereenkomst. Het ontgrendelen is kosteloos — u betaalt alleen bij een succesvolle match.
              </p>

              {newScout && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🎉</span>
                    <span className="text-green-600 font-bold text-sm">50% introductiekorting!</span>
                  </div>
                  <p className="text-green-600/80 text-xs leading-relaxed">
                    Deze Talent Scout doet zijn/haar eerste bemiddeling via Refurzy en heeft daarom nog geen reputatiescore.
                    Om u te laten kennismaken betaalt u slechts de helft van de plaatsingsfee bij een succesvolle match.
                  </p>
                </div>
              )}

              <div className="bg-surface-muted rounded-xl border border-surface-border p-4 mb-4 text-sm text-ink-light max-h-40 overflow-y-auto">
                <p className="font-semibold text-ink mb-2">Plaatsingsovereenkomst</p>
                <ul className="space-y-1.5 text-xs leading-relaxed">
                  <li>• Het ontgrendelen van het profiel is <span className="text-ink font-medium">kosteloos</span>.</li>
                  <li>• U betaalt <span className="text-ink font-medium">alleen bij een succesvolle plaatsing</span> (ondertekend arbeidscontract).</li>
                  <li>• De plaatsingsfee is afhankelijk van opleidingsniveau en werkervaring{newScout ? ' (50% introductiekorting toegepast)' : ''}.</li>
                  <li>• Bemiddeling buiten het platform om resulteert in een boete van 100% van de vergoeding.</li>
                  <li>• Bij M-Score ≥80% geldt de <span className="text-ink font-medium">Fit Garantie</span> (12 maanden).</li>
                </ul>
              </div>

              <label className="flex items-start gap-3 mb-4 cursor-pointer group">
                <input type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-surface-muted accent-cyan" />
                <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
                  Ik ga akkoord met de{' '}
                  <a href="/juridisch/plaatsingsovereenkomst" target="_blank" rel="noopener noreferrer" className="text-cyan underline hover:text-cyan/80">Plaatsingsovereenkomst</a>
                  {' '}(v1.0), het penalty-beding en de{' '}
                  <a href="/juridisch/privacybeleid" target="_blank" rel="noopener noreferrer" className="text-cyan underline hover:text-cyan/80">AVG-bepalingen</a>
                </span>
              </label>

              <div className="flex gap-3">
                <button onClick={() => { setContractModal(null); setAkkoord(false) }} className="flex-1 bg-surface-muted border border-surface-border text-ink-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-ink transition-colors">
                  Annuleren
                </button>
                <button onClick={() => handleUnlock(contractModal)} disabled={!akkoord} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${akkoord ? 'bg-cyan text-navy-dark hover:bg-cyan-light' : 'bg-surface-muted text-ink-muted cursor-not-allowed'}`}>
                  Akkoord &amp; profiel bekijken
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ─── Reject Modal ──────────────────────────────────────────────────── */}
      {rejectModal && (() => {
        const k = kandidaten.find(c => c.id === rejectModal)
        if (!k) return null
        const minRating = getMinRating(k.procesStatus)
        const isAutoRating = k.procesStatus === 'arbeidsvoorwaarden'
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
              <h2 className="text-lg font-bold text-ink">Kandidaat afwijzen</h2>
              <p className="text-ink-light text-sm">
                {k.anoniem ? `Kandidaat ${k.initialen}` : k.naam} — via {k.scoutNaam}
              </p>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Reden van afwijzing *</label>
                <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value as AfwijzingsReden)}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
                  <option value="">Selecteer een reden</option>
                  {afwijzingsRedenen.map(r => (
                    <option key={r.key} value={r.key}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Beoordeling scout *</label>
                {isAutoRating ? (
                  <>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-2xl ${star <= 4 ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-green-600 mt-1">Automatisch 4 sterren — kandidaat bereikte arbeidsvoorwaarden fase</p>
                  </>
                ) : (
                  <>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button"
                          onClick={() => setRejectRating(Math.max(star, minRating))}
                          className={`text-2xl transition-colors ${star <= rejectRating ? 'text-yellow-400' : 'text-surface-border hover:text-yellow-200'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                    {minRating >= 3 ? (
                      <p className="text-xs text-ink-muted mt-1">Minimaal {minRating} sterren — kandidaat kwam tot gespreksfase</p>
                    ) : (
                      <p className="text-xs text-ink-muted mt-1">Hoe goed was de voordracht van de scout?</p>
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Toelichting</label>
                <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={2}
                  placeholder="Optioneel: geef extra context"
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRejectModal(null)}
                  className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                  Annuleren
                </button>
                <button onClick={handleAfwijzen} disabled={!rejectReason || (!isAutoRating && rejectRating === 0)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-40">
                  Afwijzen
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
