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
