'use client'

import { useState } from 'react'

const signaleringen = [
  {
    id: 1,
    type: 'herinnering',
    bericht: 'Opdrachtgever TechVentures B.V. heeft de status van kandidaat Anna de Jong niet bijgewerkt',
    datum: '2026-03-18',
    actie: 'Stuur herinnering',
    verzonden: false,
  },
]

const tijdlijn = [
  { id: 1, datum: '2026-03-11', bericht: 'Herinnering verstuurd aan TechVentures B.V. over kandidaat Thomas van Dijk', type: 'verstuurd' },
  { id: 2, datum: '2026-03-09', bericht: 'Status bijgewerkt door GreenLogistics B.V. - binnen deadline', type: 'opgelost' },
  { id: 3, datum: '2026-03-05', bericht: 'Automatische signalering: MedTech Solutions heeft 5 dagen niet gereageerd', type: 'waarschuwing' },
  { id: 4, datum: '2026-03-03', bericht: 'Herinnering verstuurd aan MedTech Solutions over kandidaat Eva Bakker', type: 'verstuurd' },
]

export default function ScoutMeldingen() {
  const [herinneringVerstuurd, setHerinneringVerstuurd] = useState(false)

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Signaleringen</h1>
        <p className="text-ink-light font-medium mt-1">Houd bij of opdrachtgevers tijdig reageren</p>
      </div>

      {/* Active notification */}
      <div className="bg-white rounded-2xl border border-orange/30 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-orange text-xl mt-0.5">&#9888;</span>
          <div className="flex-1 space-y-2">
            <p className="text-ink font-medium">{signaleringen[0].bericht}</p>
            <p className="text-orange text-sm">
              Let op: Opdrachtgevers zijn contractueel verplicht binnen 7 dagen te reageren.
              Bij overschrijding kan een boeteclausule van toepassing zijn.
            </p>
          </div>
        </div>

        {herinneringVerstuurd ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 flex items-center gap-2">
            <span className="text-green-400">&#10003;</span>
            <span className="text-green-400 text-sm">Herinnering is verstuurd naar TechVentures B.V.</span>
          </div>
        ) : (
          <button
            onClick={() => setHerinneringVerstuurd(true)}
            className="px-5 py-2.5 bg-orange text-navy-dark rounded-lg font-medium text-sm hover:bg-orange/90 transition-colors"
          >
            Stuur herinnering
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Signalering log</h2>
        <div className="space-y-3">
          {tijdlijn.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-surface-border p-4 flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {item.type === 'verstuurd' && <span className="text-cyan text-sm">&#9993;</span>}
                {item.type === 'opgelost' && <span className="text-green-400 text-sm">&#10003;</span>}
                {item.type === 'waarschuwing' && <span className="text-orange text-sm">&#9888;</span>}
              </div>
              <div className="flex-1">
                <p className="text-ink-light text-sm">{item.bericht}</p>
                <p className="text-ink-muted text-xs mt-1">{new Date(item.datum).toLocaleDateString('nl-NL')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
