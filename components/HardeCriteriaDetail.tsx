'use client'

import { useState } from 'react'
import { KandidaatMatch, HardeCriteria } from '@/lib/types'
import { calculateHardeCriteriaMatch, CriteriumResult } from '@/lib/matching'

interface Props {
  kandidaat: KandidaatMatch
  hardeCriteria?: HardeCriteria
  size?: 'sm' | 'lg'
}

// Mock kandidaat data for matching (in production this comes from the kandidaat profile)
function getMockKandidaatData(k: KandidaatMatch) {
  // Generate plausible mock data based on hardeCriteriaMatch score
  const mockData: Record<string, { salarisMin: number; salarisMax: number; maxReistijd: string; opKantoor: string; talen: { taal: string; niveau: 'A2' | 'B1' | 'B2' | 'C1' | 'C2' }[] }> = {
    'k-1': { salarisMin: 4800, salarisMax: 5800, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-10': { salarisMin: 4000, salarisMax: 5000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'B2' }] },
    'k-3': { salarisMin: 4500, salarisMax: 6500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-4': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-5': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Engels', niveau: 'C1' }] },
    'k-20': { salarisMin: 4200, salarisMax: 5500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-21': { salarisMin: 3500, salarisMax: 4500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-22': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-23': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-24': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '30 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Engels', niveau: 'B2' }] },
    'k-25': { salarisMin: 7000, salarisMax: 8500, maxReistijd: '30 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-30': { salarisMin: 4000, salarisMax: 5000, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'B2' }] },
    'k-31': { salarisMin: 3800, salarisMax: 4800, maxReistijd: '30 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-32': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-33': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' }, { taal: 'Engels', niveau: 'B1' }] },
  }
  return mockData[k.id] || { salarisMin: 4000, salarisMax: 5500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' }, { taal: 'Engels', niveau: 'B1' }] }
}

export default function HardeCriteriaDetail({ kandidaat, hardeCriteria, size = 'sm' }: Props) {
  const [open, setOpen] = useState(false)

  if (!hardeCriteria) {
    return (
      <div className="flex items-center gap-1.5">
        <span className={kandidaat.hardeCriteriaIcon === 'check' ? 'text-green-400' : 'text-orange'}>
          {kandidaat.hardeCriteriaIcon === 'check' ? '✓' : '⚠'}
        </span>
        <span className={`font-semibold ${size === 'lg' ? 'text-base' : 'text-sm'} ${kandidaat.hardeCriteriaIcon === 'check' ? 'text-green-400' : 'text-orange'}`}>
          {kandidaat.hardeCriteriaMatch}%
        </span>
      </div>
    )
  }

  const mockData = getMockKandidaatData(kandidaat)
  const result = calculateHardeCriteriaMatch(hardeCriteria, {
    opleidingsniveau: kandidaat.opleidingsniveau,
    werkervaring: kandidaat.werkervaring,
    ...mockData,
  })

  const icon = kandidaat.hardeCriteriaIcon === 'check' ? '✓' : '⚠'
  const color = kandidaat.hardeCriteriaIcon === 'check' ? 'text-green-400' : 'text-orange'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className={`flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer`}
        title="Klik voor details"
      >
        <span className={color}>{icon}</span>
        <span className={`font-semibold ${size === 'lg' ? 'text-base' : 'text-sm'} ${color}`}>
          {kandidaat.hardeCriteriaMatch}%
        </span>
        <span className={`text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`} style={{ fontSize: '10px' }}>▼</span>
      </button>

      {open && (
        <div className="absolute z-30 left-0 mt-2 w-80 bg-white border border-surface-border rounded-xl shadow-lg p-4" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-ink uppercase tracking-wider">Harde Criteria Detail</p>
            <span className={`text-sm font-bold ${color}`}>{kandidaat.hardeCriteriaMatch}%</span>
          </div>
          <div className="space-y-2">
            {result.criteria.map((c, i) => (
              <div key={i} className={`flex items-start gap-2 text-xs rounded-lg p-2 ${c.voldaan ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className="mt-0.5 shrink-0">{c.voldaan ? '✅' : '❌'}</span>
                <div className="min-w-0">
                  <span className={`font-semibold ${c.voldaan ? 'text-green-700' : 'text-red-700'}`}>{c.naam}</span>
                  {c.detail && (
                    <p className="text-ink-muted mt-0.5 leading-snug">{c.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={(e) => { e.stopPropagation(); setOpen(false) }} className="mt-3 w-full text-xs text-ink-muted hover:text-ink text-center transition-colors">
            Sluiten
          </button>
        </div>
      )}
    </div>
  )
}
