'use client'

import { useState } from 'react'

const signaleringen = [
  {
    id: 0,
    type: 'beschikbaar',
    bericht: 'Roos van der Berg is weer beschikbaar voor vacatures',
    datum: '2026-03-21',
    actie: null,
    verzonden: false,
  },
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
  { id: 0, datum: '2026-03-21', bericht: 'Kandidaat Roos van der Berg heeft haar profiel weer op beschikbaar gezet', type: 'beschikbaar' },
  { id: 1, datum: '2026-03-11', bericht: 'Herinnering verstuurd aan FinTechCo over kandidaat Thomas van Dijk', type: 'verstuurd' },
  { id: 2, datum: '2026-03-09', bericht: 'Status bijgewerkt door GreenLogistics B.V. - binnen deadline', type: 'opgelost' },
  { id: 3, datum: '2026-03-05', bericht: 'Automatische signalering: MedTech Solutions heeft 5 dagen niet gereageerd', type: 'waarschuwing' },
  { id: 4, datum: '2026-03-03', bericht: 'Herinnering verstuurd aan MedTech Solutions over kandidaat Eva Bakker', type: 'verstuurd' },
  { id: 5, datum: '2026-02-28', bericht: 'Kandidaat Pieter Jansen heeft zijn profiel gepauzeerd — tijdelijk niet beschikbaar', type: 'gepauzeerd' },
]

export default function ScoutMeldingen() {
  const [herinneringVerstuurd, setHerinneringVerstuurd] = useState(false)

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Signaleringen</h1>
        <p className="text-ink-light font-medium mt-1">Meldingen over je kandidaten en opdrachtgevers</p>
      </div>

      {/* Kandidaat weer beschikbaar notification */}
      <div className="bg-white rounded-2xl border border-green-200 p-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-green-600 text-lg">&#9998;</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-ink font-semibold text-sm">{signaleringen[0].bericht}</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">Nieuw</span>
            </div>
            <p className="text-ink-light text-sm mt-1">
              Deze kandidaat was tijdelijk niet beschikbaar en heeft haar profiel weer geactiveerd.
              Je kunt haar nu voordragen op openstaande vacatures.
            </p>
            <p className="text-ink-muted text-xs mt-2">{new Date(signaleringen[0].datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Opdrachtgever herinnering */}
      <div className="bg-white rounded-2xl border border-orange/30 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0">
            <span className="text-orange text-lg">&#9888;</span>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-ink font-semibold text-sm">{signaleringen[1].bericht}</p>
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
            <div key={item.id} className={`bg-white rounded-2xl border p-4 flex items-start gap-4 ${
              item.type === 'beschikbaar' ? 'border-green-200' :
              item.type === 'gepauzeerd' ? 'border-amber-200' :
              'border-surface-border'
            }`}>
              <div className="flex-shrink-0 mt-1">
                {item.type === 'verstuurd' && <span className="text-cyan text-sm">&#9993;</span>}
                {item.type === 'opgelost' && <span className="text-green-400 text-sm">&#10003;</span>}
                {item.type === 'waarschuwing' && <span className="text-orange text-sm">&#9888;</span>}
                {item.type === 'beschikbaar' && <span className="text-green-600 text-sm">&#9998;</span>}
                {item.type === 'gepauzeerd' && <span className="text-amber-500 text-sm">&#9208;</span>}
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
