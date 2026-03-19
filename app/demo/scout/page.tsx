'use client'

import { scoutKandidaten } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'

export default function ScoutDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn Talent Pool</h1>
        <p className="text-ink-light mt-1">{scoutKandidaten.length} kandidaten in je netwerk</p>
      </div>

      {/* Introductiekorting banner voor nieuwe scouts */}
      <div className="bg-gradient-to-r from-green-50 to-cyan/5 border border-green-200 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <h3 className="text-ink font-bold text-sm">Jouw eerste match met introductiekorting</h3>
            <p className="text-ink-light text-sm mt-1 leading-relaxed">
              Als nieuwe scout bieden we jouw kandidaten aan met <span className="text-green-600 font-semibold">50% korting</span> voor de opdrachtgever.
              Dit maakt het extra aantrekkelijk om jouw kandidaat een kans te geven. Na je eerste succesvolle plaatsing
              bouw je je reputatie op en gelden de reguliere tarieven.
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="text-ink-muted">Eerste plaatsing: 25% fee voor jou (i.p.v. 50%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan"></span>
                <span className="text-ink-muted">Daarna: reguliere 50% fee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scoutKandidaten.map((k) => (
          <div key={k.id} className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ink">{k.naam}</h3>
                <p className="text-purple text-sm">{k.huidigeRol}</p>
              </div>
              <div className="flex gap-2">
                {k.scanCompleted ? (
                  <StatusBadge status="aangenomen" />
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-orange/15 text-orange border-orange/30">
                    Scan pending
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-ink-muted">Woonplaats</span>
                <p className="text-gray-300">{k.woonplaats}</p>
              </div>
              <div>
                <span className="text-ink-muted">Opleiding</span>
                <p className="text-gray-300">{k.opleidingsniveau}</p>
              </div>
              <div>
                <span className="text-ink-muted">Werkervaring</span>
                <p className="text-gray-300">{k.werkervaring}</p>
              </div>
              <div>
                <span className="text-ink-muted">CV</span>
                <p className="text-gray-300">{k.cvUploaded ? 'Geupload' : 'Ontbreekt'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-border">
              <span className="text-xs text-ink-muted">{k.email}</span>
              <button
                disabled={!k.scanCompleted}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  k.scanCompleted
                    ? 'bg-cyan text-navy-dark hover:bg-cyan/90 cursor-pointer'
                    : 'bg-gray-700 text-ink-muted cursor-not-allowed'
                }`}
              >
                Voordragen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
