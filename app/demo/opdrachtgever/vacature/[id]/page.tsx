'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { vacatures } from '@/lib/mock-data'
import { KandidaatMatch } from '@/lib/types'
import FitScore from '@/components/FitScore'
import StarRating from '@/components/StarRating'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'


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

  if (!vacature) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-ink-light">Vacature niet gevonden</div>
      </div>
    )
  }

  const handleUnlock = (kandidaatId: string) => {
    setKandidaten((prev) =>
      prev.map((k) => (k.id === kandidaatId ? { ...k, unlocked: true, anoniem: false } : k))
    )
    setContractModal(null)
    setAkkoord(false)
    setToast('Profiel ontgrendeld!')
    setTimeout(() => setToast(null), 3000)
  }

  const handleAfwijzen = (kandidaatId: string) => {
    setKandidaten((prev) =>
      prev.map((k) =>
        k.id === kandidaatId ? { ...k, status: 'afgewezen' as const, procesStatus: 'afgewezen' as const } : k
      )
    )
  }

  // Sort by M-Score descending
  const sorted = [...kandidaten].sort((a, b) => b.deVriesFit - a.deVriesFit)

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
            <p className="text-ink-light mt-1">{vacature.company} &middot; {vacature.location}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Opleiding', value: vacature.hardeCriteria.opleidingsniveau },
            { label: 'Ervaring', value: vacature.hardeCriteria.minimaleErvaring },
            { label: 'Locatie', value: vacature.hardeCriteria.locatie },
            { label: 'Op kantoor', value: vacature.hardeCriteria.opKantoor },
            { label: 'Max reistijd', value: vacature.hardeCriteria.maxReistijd },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs text-ink-muted mb-1">{item.label}</div>
              <div className="text-sm text-purple font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Score legenda */}
      <div className="bg-white rounded-2xl border border-surface-border p-4 mb-6">
        <div className="flex items-center gap-6 text-xs text-ink-light">
          <span className="font-semibold text-ink">Score legenda:</span>
          <span><span className="text-cyan font-medium">M-Score</span> = uitkomst 35-vragen Profiel Match assessment</span>
          <span><span className="text-orange font-medium">50% korting</span> = nieuwe scout zonder track record</span>
        </div>
      </div>

      {/* Kandidaten tabel */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="p-6 border-b border-surface-border">
          <h2 className="text-ink font-semibold">Kandidaten ({kandidaten.length})</h2>
        </div>

        <div className="hidden md:grid grid-cols-[2.5fr_1.2fr_1fr_1.2fr_1fr_2fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
          <div>Kandidaat</div>
          <div className="text-center">Harde Criteria</div>
          <div className="text-center">M-Score</div>
          <div className="text-center">Scout Rating</div>
          <div className="text-center">Status</div>
          <div className="text-right">Acties</div>
        </div>

        {sorted.map((k) => {
          const newScout = isNewScout(k.scoutNaam)
          const isMaster = k.scoutRating >= 3.5

          return (
            <div key={k.id} className="grid grid-cols-1 md:grid-cols-[2.5fr_1.2fr_1fr_1.2fr_1fr_2fr] gap-2 px-6 py-4 border-b border-surface-border items-center hover:bg-surface-muted transition-colors">
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
              <div className="flex items-center justify-center gap-1.5">
                <span className={k.hardeCriteriaIcon === 'check' ? 'text-green-400' : 'text-orange'}>
                  {k.hardeCriteriaIcon === 'check' ? '✓' : '⚠'}
                </span>
                <span className={`text-sm font-semibold ${k.hardeCriteriaIcon === 'check' ? 'text-green-400' : 'text-orange'}`}>
                  {k.hardeCriteriaMatch}%
                </span>
              </div>

              {/* M-Score */}
              <div className="flex justify-center">
                <FitScore score={k.deVriesFit} size="sm" />
              </div>

              {/* Scout Rating */}
              <div className="flex justify-center">
                <StarRating rating={k.scoutRating} />
              </div>

              {/* Status */}
              <div className="flex justify-center">
                <StatusBadge status={k.status} />
              </div>

              {/* Acties */}
              <div className="flex justify-end gap-2">
                {k.unlocked ? (
                  <Link href={`/demo/opdrachtgever/kandidaat/${k.id}`} className="bg-cyan/15 text-cyan px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-cyan/25 transition-colors border border-cyan/20">
                    Bekijk profiel
                  </Link>
                ) : (
                  <button onClick={() => setContractModal(k.id)} className="bg-cyan text-navy-dark px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-cyan-light transition-colors">
                    Ontgrendel
                  </button>
                )}
                {k.status !== 'afgewezen' && (
                  <button onClick={() => handleAfwijzen(k.id)} className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20">
                    Afwijzen
                  </button>
                )}
              </div>
            </div>
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
              <p className="text-ink-light text-sm mb-4">
                Om het profiel en contactgegevens te bekijken, gaat u akkoord met de voorwaarden.
              </p>

              {newScout && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4 text-sm">
                  <span className="text-green-400 font-semibold">50% introductiekorting!</span>
                  <span className="text-green-400/70 ml-1">Deze Talent Scout heeft nog geen reputatiescore. U betaalt slechts de helft.</span>
                </div>
              )}

              <div className="bg-surface-muted rounded-xl border border-surface-border p-4 mb-4 text-sm text-gray-300 max-h-32 overflow-y-auto">
                <p className="font-semibold text-ink mb-2">Contractvoorwaarden</p>
                <p>Door het ontgrendelen gaat u akkoord met de introductie-vergoeding. Bemiddeling buiten het platform om resulteert in een penalty van 100% van de vergoeding.</p>
                <p className="mt-2">De vergoeding is afhankelijk van opleidingsniveau en werkervaring. Factuur volgt bij ondertekening arbeidscontract.</p>
              </div>

              <label className="flex items-start gap-3 mb-4 cursor-pointer group">
                <input type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-surface-muted accent-cyan" />
                <span className="text-sm text-gray-300 group-hover:text-ink transition-colors">
                  Ik ga akkoord met de voorwaarden, het penalty-beding en de AVG-bepalingen
                </span>
              </label>

              <div className="mb-6">
                <p className="text-sm text-ink font-semibold mb-3">Betaalgegevens</p>
                <div className="space-y-3">
                  <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder-ink-faint focus:outline-none focus:border-cyan/50" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/JJ" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder-ink-faint focus:outline-none focus:border-cyan/50" />
                    <input type="text" placeholder="CVC" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder-ink-faint focus:outline-none focus:border-cyan/50" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setContractModal(null); setAkkoord(false) }} className="flex-1 bg-surface-muted border border-surface-border text-ink-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-ink transition-colors">
                  Annuleren
                </button>
                <button onClick={() => handleUnlock(contractModal)} disabled={!akkoord} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${akkoord ? 'bg-cyan text-navy-dark hover:bg-cyan-light' : 'bg-gray-700 text-ink-muted cursor-not-allowed'}`}>
                  Onderteken &amp; betaal
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
