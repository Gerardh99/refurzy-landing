'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { vacatures } from '@/lib/mock-data'
import { KandidaatMatch } from '@/lib/types'
import FitScore from '@/components/FitScore'
import StarRating from '@/components/StarRating'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

const procesStappen = [
  { key: 'nieuw', label: 'Nieuw' },
  { key: 'kennismaking', label: 'Kennismaking' },
  { key: 'arbeidsvoorwaarden', label: 'Arbeidsvoorwaarden' },
  { key: 'contract_getekend', label: 'Contract getekend' },
]

export default function KandidaatDetailPage() {
  const params = useParams()
  const kandidaatId = params.id as string

  // Find kandidaat across all vacatures
  let foundKandidaat: KandidaatMatch | null = null
  let foundVacature: { id: string; title: string; company: string } | null = null
  for (const v of vacatures) {
    const k = v.kandidaten.find((k) => k.id === kandidaatId)
    if (k) {
      foundKandidaat = k
      foundVacature = { id: v.id, title: v.title, company: v.company }
      break
    }
  }

  const [kandidaat, setKandidaat] = useState<KandidaatMatch | null>(foundKandidaat)
  const [toast, setToast] = useState<string | null>(null)

  if (!kandidaat || !foundVacature) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Kandidaat niet gevonden</div>
      </div>
    )
  }

  const isLocked = kandidaat.anoniem || !kandidaat.unlocked

  const updateStatus = (newStatus: string) => {
    setKandidaat((prev) =>
      prev ? { ...prev, procesStatus: newStatus as KandidaatMatch['procesStatus'] } : prev
    )
    setToast(`Status gewijzigd naar ${newStatus.replace('_', ' ')}`)
    setTimeout(() => setToast(null), 3000)
  }

  const currentStepIndex = procesStappen.findIndex(
    (s) => s.key === (kandidaat.procesStatus || 'nieuw')
  )
  const isAfgewezen = kandidaat.procesStatus === 'afgewezen'

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-pulse">
          {toast}
        </div>
      )}

      {/* Navigation */}
      <Link
        href={`/demo/opdrachtgever/vacature/${foundVacature.id}`}
        className="text-gray-400 hover:text-cyan text-sm mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← Terug naar {foundVacature.title}
      </Link>

      {/* Locked overlay */}
      {isLocked ? (
        <div className="mt-4">
          <div className="bg-navy-light rounded-2xl border border-purple/10 p-12 text-center max-w-lg mx-auto">
            <div className="text-6xl mb-4 opacity-50">🔒</div>
            <h2 className="text-xl font-bold text-white mb-2">Profiel vergrendeld</h2>
            <p className="text-gray-400 mb-6">
              Teken het contract om het volledige profiel en de contactgegevens van deze kandidaat te bekijken.
            </p>

            {/* Blurred preview */}
            <div className="bg-navy rounded-xl border border-purple/10 p-6 mb-6 relative overflow-hidden">
              <div className="blur-md select-none pointer-events-none">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-purple/20" />
                  <div>
                    <div className="h-5 w-40 bg-purple/20 rounded mb-2" />
                    <div className="h-4 w-28 bg-purple/10 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-4 bg-purple/10 rounded" />
                  <div className="h-4 bg-purple/10 rounded" />
                  <div className="h-4 bg-purple/10 rounded" />
                  <div className="h-4 bg-purple/10 rounded" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-purple-light text-sm font-semibold bg-navy/80 px-4 py-2 rounded-lg border border-purple/20">
                  Kandidaat {kandidaat.initialen}
                </span>
              </div>
            </div>

            {/* Visible scores */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-navy rounded-xl border border-purple/10 p-4">
                <div className="text-xs text-gray-500 mb-2">De Vries Fit</div>
                <div className="flex justify-center">
                  <FitScore score={kandidaat.deVriesFit} size="md" />
                </div>
              </div>
              <div className="bg-navy rounded-xl border border-purple/10 p-4">
                <div className="text-xs text-gray-500 mb-2">Harde Criteria</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {kandidaat.hardeCriteriaIcon === 'check' ? (
                    <span className="text-green-400">&#10003;</span>
                  ) : (
                    <span className="text-orange">&#9888;</span>
                  )}
                  <span className={`font-bold ${kandidaat.hardeCriteriaIcon === 'check' ? 'text-green-400' : 'text-orange'}`}>
                    {kandidaat.hardeCriteriaMatch}%
                  </span>
                </div>
              </div>
              <div className="bg-navy rounded-xl border border-purple/10 p-4">
                <div className="text-xs text-gray-500 mb-2">Scout Rating</div>
                <div className="mt-2">
                  <StarRating rating={kandidaat.scoutRating} />
                </div>
              </div>
            </div>

            <Link
              href={`/demo/opdrachtgever/vacature/${foundVacature.id}`}
              className="bg-cyan text-navy-dark px-6 py-3 rounded-lg font-semibold hover:bg-cyan-light transition-colors inline-block"
            >
              Teken contract om profiel te ontgrendelen
            </Link>
          </div>
        </div>
      ) : (
        /* Unlocked profile */
        <div className="mt-4 space-y-6">
          {/* Profile header */}
          <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-purple/20 border-2 border-purple/30 flex items-center justify-center text-purple-light text-2xl font-bold flex-shrink-0">
                {kandidaat.initialen}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{kandidaat.naam}</h1>
                <p className="text-gray-400 mt-1">
                  {kandidaat.opleidingsniveau} &middot; {kandidaat.werkervaring} ervaring &middot; {kandidaat.woonplaats}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <StatusBadge status={kandidaat.status} />
                  {kandidaat.procesStatus && (
                    <StatusBadge status={kandidaat.procesStatus} />
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-gray-500 mb-1">Vacature</div>
                <div className="text-sm text-purple-light font-medium">{foundVacature.title}</div>
                <div className="text-xs text-gray-500">{foundVacature.company}</div>
              </div>
            </div>
          </div>

          {/* Contact & details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
              <h2 className="text-white font-semibold mb-4">Contactgegevens</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="text-white text-sm">{kandidaat.email || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Telefoon</span>
                  <span className="text-white text-sm">{kandidaat.telefoon || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Woonplaats</span>
                  <span className="text-white text-sm">{kandidaat.woonplaats}</span>
                </div>
              </div>
            </div>

            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
              <h2 className="text-white font-semibold mb-4">Profiel</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Opleidingsniveau</span>
                  <span className="text-white text-sm">{kandidaat.opleidingsniveau}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Werkervaring</span>
                  <span className="text-white text-sm">{kandidaat.werkervaring}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Scout</span>
                  <span className="text-purple-light text-sm">{kandidaat.scoutNaam}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 flex flex-col items-center">
              <div className="text-sm text-gray-400 mb-3">De Vries Fit</div>
              <FitScore score={kandidaat.deVriesFit} size="lg" />
            </div>
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 flex flex-col items-center">
              <div className="text-sm text-gray-400 mb-3">Harde Criteria</div>
              <div className="flex items-center gap-2 mt-2">
                {kandidaat.hardeCriteriaIcon === 'check' ? (
                  <span className="text-green-400 text-2xl">&#10003;</span>
                ) : (
                  <span className="text-orange text-2xl">&#9888;</span>
                )}
                <span className={`text-2xl font-bold ${kandidaat.hardeCriteriaIcon === 'check' ? 'text-green-400' : 'text-orange'}`}>
                  {kandidaat.hardeCriteriaMatch}%
                </span>
              </div>
            </div>
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 flex flex-col items-center">
              <div className="text-sm text-gray-400 mb-3">Scout Rating</div>
              <div className="mt-2">
                <StarRating rating={kandidaat.scoutRating} />
              </div>
            </div>
          </div>

          {/* Proces Timeline */}
          <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
            <h2 className="text-white font-semibold mb-6">Proces Status</h2>

            {isAfgewezen ? (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <span className="text-red-400 text-xl">&#10005;</span>
                <span className="text-red-400 font-semibold">Kandidaat is afgewezen</span>
              </div>
            ) : (
              <div className="flex items-center gap-0 mb-8">
                {procesStappen.map((stap, i) => {
                  const isCompleted = i <= currentStepIndex
                  const isCurrent = i === currentStepIndex
                  return (
                    <div key={stap.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                            isCurrent
                              ? 'bg-cyan text-navy-dark border-cyan'
                              : isCompleted
                              ? 'bg-cyan/20 text-cyan border-cyan/40'
                              : 'bg-navy border-purple/20 text-gray-600'
                          }`}
                        >
                          {isCompleted && !isCurrent ? '✓' : i + 1}
                        </div>
                        <div
                          className={`text-xs mt-2 text-center ${
                            isCurrent ? 'text-cyan font-semibold' : isCompleted ? 'text-cyan/60' : 'text-gray-600'
                          }`}
                        >
                          {stap.label}
                        </div>
                      </div>
                      {i < procesStappen.length - 1 && (
                        <div
                          className={`h-px w-full -mt-5 ${
                            i < currentStepIndex ? 'bg-cyan/40' : 'bg-purple/10'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Status actions */}
            {!isAfgewezen && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple/10">
                <span className="text-sm text-gray-500 mr-2 self-center">Wijzig status:</span>
                {procesStappen.map((stap) => (
                  <button
                    key={stap.key}
                    onClick={() => updateStatus(stap.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      kandidaat.procesStatus === stap.key
                        ? 'bg-cyan/20 text-cyan border border-cyan/30'
                        : 'bg-navy border border-purple/10 text-gray-400 hover:text-white hover:border-purple/30'
                    }`}
                  >
                    {stap.label}
                  </button>
                ))}
                <button
                  onClick={() => updateStatus('afgewezen')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors ml-auto"
                >
                  Afwijzen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
