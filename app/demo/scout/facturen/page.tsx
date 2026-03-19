'use client'

import { useState } from 'react'
import FactuurPreview from '@/components/FactuurPreview'

// Mock facturen data
const mockFacturen = [
  {
    factuurNummer: 'RF-2026-001',
    datum: '2026-01-20',
    scoutNaam: 'Sophie de Graaf',
    scoutBedrijf: 'Scout Solutions',
    scoutAdres: 'Prinsengracht 123, 1015 DT Amsterdam',
    scoutKvk: '12345678',
    scoutBtw: 'NL001234567B01',
    scoutIban: 'NL91ABNA0417164300',
    isProScout: true,
    vacatureTitle: 'Marketing Manager',
    kandidaatNaam: 'Anna de Jong',
    opdrachtgeverNaam: 'TechVentures B.V.',
    brutoBedrag: 7200,
    scoutFeePercentage: 50,
    status: 'uitbetaald' as const,
  },
  {
    factuurNummer: 'RF-2026-004',
    datum: '2026-02-10',
    scoutNaam: 'Sophie de Graaf',
    scoutBedrijf: 'Scout Solutions',
    scoutAdres: 'Prinsengracht 123, 1015 DT Amsterdam',
    scoutKvk: '12345678',
    scoutBtw: 'NL001234567B01',
    scoutIban: 'NL91ABNA0417164300',
    isProScout: true,
    vacatureTitle: 'Senior Software Developer',
    kandidaatNaam: 'Thomas van Dijk',
    opdrachtgeverNaam: 'TechVentures B.V.',
    brutoBedrag: 10800,
    scoutFeePercentage: 50,
    status: 'betaald_door_klant' as const,
  },
]

export default function ScoutFacturen() {
  const [filter, setFilter] = useState<'alle' | 'uitbetaald' | 'openstaand'>('alle')

  const filtered = filter === 'alle'
    ? mockFacturen
    : filter === 'uitbetaald'
      ? mockFacturen.filter(f => f.status === 'uitbetaald')
      : mockFacturen.filter(f => f.status !== 'uitbetaald')

  const totaalVerdiend = mockFacturen
    .filter(f => f.status === 'uitbetaald')
    .reduce((sum, f) => {
      const fee = f.brutoBedrag * (f.scoutFeePercentage / 100)
      const btw = f.isProScout ? fee * 0.21 : 0
      return sum + fee + btw
    }, 0)

  const openstaand = mockFacturen
    .filter(f => f.status !== 'uitbetaald')
    .reduce((sum, f) => {
      const fee = f.brutoBedrag * (f.scoutFeePercentage / 100)
      const btw = f.isProScout ? fee * 0.21 : 0
      return sum + fee + btw
    }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn Facturen</h1>
        <p className="text-ink-light mt-1">Overzicht van alle gegenereerde facturen en uitbetalingen</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Totaal verdiend</p>
          <p className="text-2xl font-bold text-green-600 mt-1">EUR {totaalVerdiend.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-ink-muted mt-1">Incl. BTW (indien Pro Scout)</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Openstaand</p>
          <p className="text-2xl font-bold text-cyan mt-1">EUR {openstaand.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-ink-muted mt-1">Wordt uitbetaald zodra klant betaalt</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Aantal plaatsingen</p>
          <p className="text-2xl font-bold text-ink mt-1">{mockFacturen.length}</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div className="text-sm text-ink-light">
          <p><strong className="text-ink">Hoe werkt uitbetaling?</strong></p>
          <p className="mt-1">
            Na elke succesvolle plaatsing genereert Refurzy automatisch een factuur.
            Zodra de opdrachtgever heeft betaald, wordt uw fee direct overgemaakt op uw IBAN.
            {' '}<strong>Pro Scouts</strong> ontvangen 50% van de plaatsingsfee + 21% BTW.
            {' '}<strong>Particuliere scouts</strong> ontvangen 50% bruto — geen inhouding. Refurzy rapporteert dit jaarlijks aan de Belastingdienst (IB-47).
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['alle', 'uitbetaald', 'openstaand'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
            }`}>
            {f === 'alle' ? 'Alle' : f === 'uitbetaald' ? 'Uitbetaald' : 'Openstaand'}
          </button>
        ))}
      </div>

      {/* Facturen */}
      <div className="space-y-4">
        {filtered.map(f => (
          <FactuurPreview key={f.factuurNummer} {...f} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-surface-border p-8 text-center">
          <p className="text-ink-muted text-sm">Geen facturen gevonden.</p>
        </div>
      )}
    </div>
  )
}
