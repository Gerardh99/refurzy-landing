'use client'

import { kandidaatSollicitaties, pipelineSteps } from '@/lib/mock-data'
import PipelineTracker from '@/components/PipelineTracker'

export default function KandidaatPipeline() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn sollicitaties</h1>
        <p className="text-ink-light mt-1">Volg de status van je sollicitaties in real-time</p>
      </div>

      <div className="space-y-4">
        {kandidaatSollicitaties.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">{s.vacatureTitle}</h2>
                <p className="text-ink-light text-sm">{s.company}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                s.procesStatus === 'contract_getekend' ? 'bg-green-100 text-green-700' :
                s.procesStatus === 'afgewezen' ? 'bg-red-100 text-red-700' :
                'bg-cyan/10 text-cyan'
              }`}>
                {pipelineSteps.find(p => p.key === s.procesStatus)?.label || s.status}
              </span>
            </div>

            {s.procesStatus && (
              <PipelineTracker
                currentStatus={s.procesStatus}
                isRejected={s.procesStatus === 'afgewezen'}
              />
            )}

            {/* Status specific messages */}
            {s.procesStatus === 'arbeidsvoorwaarden' && (
              <div className="bg-purple/5 rounded-xl p-4 flex items-start gap-3">
                <span className="text-lg">💼</span>
                <div>
                  <p className="text-sm font-medium text-ink">Arbeidsvoorwaardenfase</p>
                  <p className="text-xs text-ink-light mt-1">
                    De opdrachtgever is enthousiast en wil de arbeidsvoorwaarden met je bespreken.
                    Je Talent Scout houdt je op de hoogte.
                  </p>
                </div>
              </div>
            )}

            {s.procesStatus === 'gesprek_gepland' && (
              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                <span className="text-lg">🤝</span>
                <div>
                  <p className="text-sm font-medium text-ink">Gesprek gepland</p>
                  <p className="text-xs text-ink-light mt-1">
                    Er staat een gesprek gepland met {s.company}. Bereid je goed voor!
                    Je Talent Scout kan je tips geven.
                  </p>
                </div>
              </div>
            )}

            {s.procesStatus === 'contract_getekend' && (
              <div className="bg-gradient-to-r from-green-50 to-cyan/10 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-sm font-medium text-green-700">Gefeliciteerd met je nieuwe baan!</p>
                  <p className="text-xs text-green-600 mt-1">
                    Je bent gematcht op basis van je M-Score. Dit is een wetenschappelijk onderbouwde match
                    die aansluit bij je waarden, cultuur en interesses. Veel succes!
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-ink-muted">
              <span>Voorgesteld op {new Date(s.datum).toLocaleDateString('nl-NL')}</span>
            </div>
          </div>
        ))}
      </div>

      {kandidaatSollicitaties.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-ink-light mt-3">Je bent nog niet voorgedragen voor een vacature.</p>
          <p className="text-ink-muted text-sm mt-1">Je Talent Scout zoekt de beste match voor jou.</p>
        </div>
      )}
    </div>
  )
}
