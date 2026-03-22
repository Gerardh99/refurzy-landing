'use client'

import { useState } from 'react'
import Link from 'next/link'
import { vacatures, archiefVacatures } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'

type Tab = 'actief' | 'afgerond'

export default function OpdrachtgeverDashboard() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [show2FABanner, setShow2FABanner] = useState(true)
  const [tab, setTab] = useState<Tab>('actief')

  const totalKandidaten = vacatures.reduce((sum, v) => sum + v.kandidaten.length, 0)
  const allScores = vacatures.flatMap(v => v.kandidaten.map(k => k.deVriesFit))
  const gemiddeldeFit = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0

  const stats = [
    { label: 'Actieve vacatures', value: vacatures.length, icon: '📋' },
    { label: 'Totaal kandidaten', value: totalKandidaten, icon: '👥' },
    { label: 'Gem. M-Score', value: `${gemiddeldeFit}%`, icon: '🎯' },
  ]

  const activeVacatures = vacatures
  const archivedVacatures = archiefVacatures

  return (
    <div>
      {/* 2FA Banner */}
      {show2FABanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p className="text-amber-800 font-semibold text-sm">Beveilig je account met tweestapsverificatie (2FA)</p>
              <p className="text-amber-700 text-xs mt-0.5">Dit beschermt je account tegen onbevoegde toegang. Als opdrachtgever heb je toegang tot persoonsgegevens — 2FA is sterk aanbevolen.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/demo/opdrachtgever/instellingen" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors">
              Nu activeren
            </Link>
            <button onClick={() => setShow2FABanner(false)} className="text-amber-400 hover:text-amber-600 transition-colors text-lg" title="Sluiten">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Welkomstbanner */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-cyan/10 via-blue/10 to-purple/10 border border-cyan/20 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏢</span>
            <div>
              <p className="text-ink font-semibold text-sm">Welkom! Stel uw bedrijfsprofiel in</p>
              <p className="text-ink-light text-xs mt-0.5">Vul uw bedrijfsgegevens en omschrijving in zodat kandidaten uw bedrijf zien bij vacatures.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/demo/opdrachtgever/instellingen" className="bg-cyan text-navy-dark px-4 py-2 rounded-lg text-xs font-semibold hover:bg-cyan-light transition-colors">
              Bedrijfsprofiel instellen
            </Link>
            <button onClick={() => setShowWelcome(false)} className="text-ink-muted hover:text-ink-light transition-colors text-lg" title="Sluiten">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-ink-light font-medium mt-1">Overzicht van uw vacatures en kandidaten</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-surface-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-ink text-sm font-medium">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-ink">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Vacatures lijst */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">Uw vacatures</h2>
          <Link
            href="/demo/opdrachtgever/vacature-aanmaken"
            className="bg-cyan text-navy-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-light transition-colors"
          >
            + Nieuwe vacature
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-muted rounded-lg p-1 mb-6">
          <button
            onClick={() => setTab('actief')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'actief'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-light hover:text-ink'
            }`}
          >
            Actief ({activeVacatures.length})
          </button>
          <button
            onClick={() => setTab('afgerond')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'afgerond'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-light hover:text-ink'
            }`}
          >
            Afgerond ({archivedVacatures.length})
          </button>
        </div>

        {/* Actieve vacatures */}
        {tab === 'actief' && (
          <div className="space-y-3">
            {activeVacatures.map((vacature) => {
              const nieuweKandidaten = vacature.kandidaten.filter(
                (k) => k.procesStatus === 'voorgesteld'
              ).length
              const actieVereist = vacature.kandidaten.filter(
                (k) => k.procesStatus === 'gesprek_plannen' || k.procesStatus === 'feedback_geven'
              ).length

              return (
                <Link
                  key={vacature.id}
                  href={`/demo/opdrachtgever/vacature/${vacature.id}`}
                  className="block bg-surface-muted rounded-xl border border-surface-border p-5 hover:border-purple/25 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-ink group-hover:text-cyan transition-colors">
                          {vacature.title}
                        </h3>
                        <StatusBadge status={vacature.status === 'open' ? 'nieuw' : 'afgewezen'} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-ink">
                        <span className="flex items-center gap-1 font-medium">
                          <span className="text-purple">📍</span> {vacature.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-purple">📅</span> Deadline: {new Date(vacature.deadline).toLocaleDateString('nl-NL')}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <span className="text-purple">💰</span> {vacature.salaris}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 ml-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-ink">{vacature.kandidaten.length}</div>
                        <div className="text-sm text-ink-light font-medium">kandidaten</div>
                      </div>
                      {nieuweKandidaten > 0 && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan">{nieuweKandidaten}</div>
                          <div className="text-sm text-cyan font-medium">nieuw</div>
                        </div>
                      )}
                      <span className="text-ink-muted group-hover:text-purple transition-colors text-xl">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}

            {activeVacatures.length === 0 && (
              <div className="text-center py-8 text-ink-muted">
                <p>Geen actieve vacatures</p>
              </div>
            )}
          </div>
        )}

        {/* Afgeronde vacatures */}
        {tab === 'afgerond' && (
          <div className="space-y-3">
            {archivedVacatures.length === 0 ? (
              <div className="text-center py-8 text-ink-muted">
                <p>Geen afgeronde vacatures</p>
              </div>
            ) : (
              archivedVacatures.map((vacature) => {
                const aangenomen = vacature.kandidaten.find(
                  (k) => k.procesStatus === 'contract_getekend'
                )

                return (
                  <div
                    key={vacature.id}
                    className="bg-surface-muted/60 rounded-xl border border-surface-border p-5 opacity-80"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-ink">
                            {vacature.title}
                          </h3>
                          <span className="text-sm px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium">
                            ✓ Vervuld
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-ink">
                          <span className="flex items-center gap-1 font-medium">
                            <span className="text-purple">📍</span> {vacature.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-purple">📅</span> Afgesloten: {new Date(vacature.deadline).toLocaleDateString('nl-NL')}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <span className="text-purple">💰</span> {vacature.salaris}
                          </span>
                        </div>
                        {aangenomen && (
                          <div className="mt-2 text-sm text-green-600">
                            Kandidaat aangenomen: <span className="font-semibold text-green-700">{aangenomen.naam}</span>
                            {aangenomen.contractDatum && (
                              <span> — {new Date(aangenomen.contractDatum).toLocaleDateString('nl-NL')}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-6 ml-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-ink-light">{vacature.kandidaten.length}</div>
                          <div className="text-xs text-ink-muted">kandidaten</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
