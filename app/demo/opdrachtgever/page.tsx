'use client'

import { useState } from 'react'
import Link from 'next/link'
import { vacatures } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'

export default function OpdrachtgeverDashboard() {
  const [showWelcome, setShowWelcome] = useState(true)
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

  return (
    <div>
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
            <button onClick={() => setShowWelcome(false)} className="text-ink-faint hover:text-ink-light transition-colors text-lg" title="Sluiten">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-ink-light mt-1">Overzicht van uw vacatures en kandidaten</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-surface-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-ink-light text-sm">{stat.label}</span>
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

        <div className="space-y-3">
          {vacatures.map((vacature) => {
            const nieuweKandidaten = vacature.kandidaten.filter(
              (k) => k.procesStatus === 'nieuw'
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
                      <h3 className="text-ink font-semibold group-hover:text-cyan transition-colors">
                        {vacature.title}
                      </h3>
                      <StatusBadge status={vacature.status === 'open' ? 'nieuw' : 'afgewezen'} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-ink-light">
                      <span className="flex items-center gap-1">
                        <span className="text-purple">📍</span> {vacature.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-purple">📅</span> Deadline: {new Date(vacature.deadline).toLocaleDateString('nl-NL')}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-purple">💰</span> {vacature.salaris}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-ink">{vacature.kandidaten.length}</div>
                      <div className="text-xs text-ink-muted">kandidaten</div>
                    </div>
                    {nieuweKandidaten > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan">{nieuweKandidaten}</div>
                        <div className="text-xs text-cyan/70">nieuw</div>
                      </div>
                    )}
                    <span className="text-ink-faint group-hover:text-purple transition-colors text-xl">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
