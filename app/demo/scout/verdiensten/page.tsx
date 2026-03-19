'use client'

import { useState } from 'react'

interface Verdienste {
  id: string
  datum: string
  vacatureTitle: string
  kandidaatNaam: string
  opdrachtgever: string
  plaatsingsfee: number
  jouwDeel: number
  deelPercentage: number
  introductiekorting: boolean
  status: 'uitbetaald' | 'openstaand' | 'wacht_op_betaling'
}

const mockVerdiensten: Verdienste[] = [
  {
    id: 'v-1',
    datum: '2026-01-20',
    vacatureTitle: 'Marketing Manager',
    kandidaatNaam: 'Anna de Jong',
    opdrachtgever: 'TechVentures B.V.',
    plaatsingsfee: 10800,
    jouwDeel: 2700,
    deelPercentage: 25,
    introductiekorting: true,
    status: 'uitbetaald',
  },
  {
    id: 'v-2',
    datum: '2026-02-10',
    vacatureTitle: 'Senior Software Developer',
    kandidaatNaam: 'Thomas van Dijk',
    opdrachtgever: 'TechVentures B.V.',
    plaatsingsfee: 12000,
    jouwDeel: 6000,
    deelPercentage: 50,
    introductiekorting: false,
    status: 'uitbetaald',
  },
  {
    id: 'v-3',
    datum: '2026-03-05',
    vacatureTitle: 'HR Business Partner',
    kandidaatNaam: 'Eva Bakker',
    opdrachtgever: 'GreenLogistics B.V.',
    plaatsingsfee: 7200,
    jouwDeel: 3600,
    deelPercentage: 50,
    introductiekorting: false,
    status: 'wacht_op_betaling',
  },
  {
    id: 'v-4',
    datum: '2026-03-15',
    vacatureTitle: 'Financial Controller',
    kandidaatNaam: 'Priya Sharma',
    opdrachtgever: 'MedTech Solutions',
    plaatsingsfee: 10800,
    jouwDeel: 5400,
    deelPercentage: 50,
    introductiekorting: false,
    status: 'openstaand',
  },
]

export default function ScoutVerdiensten() {
  const [filter, setFilter] = useState<'alle' | 'uitbetaald' | 'openstaand' | 'wacht_op_betaling'>('alle')

  const filtered = filter === 'alle' ? mockVerdiensten : mockVerdiensten.filter(v => v.status === filter)

  const totaalVerdiend = mockVerdiensten.reduce((s, v) => s + v.jouwDeel, 0)
  const uitbetaald = mockVerdiensten.filter(v => v.status === 'uitbetaald').reduce((s, v) => s + v.jouwDeel, 0)
  const openstaand = mockVerdiensten.filter(v => v.status !== 'uitbetaald').reduce((s, v) => s + v.jouwDeel, 0)
  const aantalPlaatsingen = mockVerdiensten.length

  const fmt = (n: number) => '\u20AC' + n.toLocaleString('nl-NL', { minimumFractionDigits: 0 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn verdiensten</h1>
        <p className="text-ink-light text-sm mt-1">Overzicht van al je inkomsten als Talent Scout</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💰</span>
            <p className="text-xs text-ink-muted">Totaal verdiend</p>
          </div>
          <p className="text-2xl font-bold text-ink">{fmt(totaalVerdiend)}</p>
          <p className="text-[10px] text-ink-muted mt-1">Excl. BTW</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">✅</span>
            <p className="text-xs text-ink-muted">Uitbetaald</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{fmt(uitbetaald)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⏳</span>
            <p className="text-xs text-ink-muted">Openstaand</p>
          </div>
          <p className="text-2xl font-bold text-orange">{fmt(openstaand)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🎯</span>
            <p className="text-xs text-ink-muted">Aantal plaatsingen</p>
          </div>
          <p className="text-2xl font-bold text-ink">{aantalPlaatsingen}</p>
        </div>
      </div>

      {/* Introductiekorting banner */}
      <div className="bg-purple/5 border border-purple/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-lg">🎁</span>
        <div className="text-sm text-ink-light">
          <p><strong className="text-ink">Introductiekorting</strong></p>
          <p className="mt-1">
            Bij je eerste plaatsing geldt een introductiekorting van 50%. Je ontvangt dan 25% in plaats van 50% van de plaatsingsfee.
            Zowel jij als Refurzy dragen de korting. Na je eerste succesvolle plaatsing vervalt de korting automatisch.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['alle', 'uitbetaald', 'openstaand', 'wacht_op_betaling'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
            }`}>
            {f === 'alle' ? 'Alle' : f === 'uitbetaald' ? 'Uitbetaald' : f === 'openstaand' ? 'Openstaand' : 'Wacht op betaling'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Datum</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Vacature</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Kandidaat</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted">Opdrachtgever</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-ink-muted">Plaatsingsfee</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-ink-muted">Jouw deel</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-ink-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/30">
                  <td className="px-4 py-3.5 text-ink-light text-xs">{new Date(v.datum).toLocaleDateString('nl-NL')}</td>
                  <td className="px-4 py-3.5 text-ink text-xs font-medium">{v.vacatureTitle}</td>
                  <td className="px-4 py-3.5 text-ink text-xs">{v.kandidaatNaam}</td>
                  <td className="px-4 py-3.5 text-ink text-xs">{v.opdrachtgever}</td>
                  <td className="px-4 py-3.5 text-right text-ink text-xs">{fmt(v.plaatsingsfee)}</td>
                  <td className="px-4 py-3.5 text-right text-xs">
                    <span className="font-semibold text-ink">{fmt(v.jouwDeel)}</span>
                    <span className="text-ink-muted ml-1">({v.deelPercentage}%)</span>
                    {v.introductiekorting && (
                      <span className="ml-1.5 text-[10px] bg-purple/10 text-purple px-1.5 py-0.5 rounded-full font-medium">
                        introductiekorting
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      v.status === 'uitbetaald' ? 'bg-green-100 text-green-700' :
                      v.status === 'openstaand' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {v.status === 'uitbetaald' ? 'Uitbetaald' : v.status === 'openstaand' ? 'Openstaand' : 'Wacht op betaling'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-ink-muted text-sm">Geen verdiensten gevonden.</div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div className="text-sm text-ink-light">
          <p><strong className="text-ink">Hoe werkt uitbetaling?</strong></p>
          <p className="mt-1">
            Je ontvangt 50% van de plaatsingsfee (excl. BTW) bij elke succesvolle plaatsing.
            Uitbetaling vindt plaats zodra de opdrachtgever heeft betaald.
            Pro Scouts ontvangen daarbovenop 21% BTW. Bekijk je volledige facturen op de{' '}
            <a href="/demo/scout/facturen" className="text-cyan hover:underline">factuurpagina</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
