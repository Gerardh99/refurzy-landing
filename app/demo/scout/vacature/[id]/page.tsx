'use client'

import { useParams } from 'next/navigation'
import { allVacatures } from '@/lib/mock-data'
import FitScore from '@/components/FitScore'
import StatusBadge from '@/components/StatusBadge'

export default function ScoutVacatureDetail() {
  const params = useParams()
  const vacature = allVacatures.find((v) => v.id === params.id)

  if (!vacature) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-light">Vacature niet gevonden.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">{vacature.title}</h1>
          <p className="text-purple mt-1">{vacature.company} &middot; {vacature.location}</p>
        </div>
        <button className="px-5 py-2.5 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors">
          Kandidaat voordragen
        </button>
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
        <h2 className="text-lg font-semibold text-ink">
          Voorgedragen kandidaten ({vacature.kandidaten.length})
        </h2>

        {vacature.kandidaten.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
            <p className="text-ink-light">Nog geen kandidaten voorgedragen voor deze vacature.</p>
            <button className="mt-4 px-5 py-2.5 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors">
              Kandidaat voordragen uit talent pool
            </button>
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
                        {k.hardeCriteriaIcon === 'warning' && (
                          <span className="text-orange text-xs">!</span>
                        )}
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
    </div>
  )
}
