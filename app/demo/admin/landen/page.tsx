'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COUNTRIES, formatPrice, type CountryConfig } from '@/lib/pricing'

const FLAGS: Record<string, string> = {
  NL: '🇳🇱', BE: '🇧🇪', DE: '🇩🇪', FR: '🇫🇷', UK: '🇬🇧', ES: '🇪🇸', IT: '🇮🇹',
  PT: '🇵🇹', AT: '🇦🇹', CH: '🇨🇭', SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰', FI: '🇫🇮', PL: '🇵🇱',
}

export default function LandenPage() {
  const [countries, setCountries] = useState<CountryConfig[]>(COUNTRIES.map(c => ({ ...c })))
  const [toast, setToast] = useState<string | null>(null)

  function toggleActive(code: string) {
    setCountries(prev => prev.map(c =>
      c.code === code ? { ...c, active: !c.active } : c
    ))
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-pulse">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <Link href="/demo/admin" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          ← Terug naar admin
        </Link>
        <h1 className="text-2xl font-bold text-ink mt-3">Landen configuratie</h1>
        <p className="text-ink-light mt-1">Beheer de internationale uitrol van Refurzy</p>
      </div>

      {/* Samenvatting */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-surface-border p-6 text-center">
          <div className="text-3xl font-bold text-cyan">{countries.filter(c => c.active).length}</div>
          <div className="text-xs text-ink-muted mt-1">Actieve landen</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-6 text-center">
          <div className="text-3xl font-bold text-purple">{countries.length}</div>
          <div className="text-xs text-ink-muted mt-1">Geconfigureerd</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-6 text-center">
          <div className="text-3xl font-bold text-ink">{new Set(countries.map(c => c.currency)).size}</div>
          <div className="text-xs text-ink-muted mt-1">Valuta&apos;s</div>
        </div>
      </div>

      {/* Landen tabel */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1.5fr_1fr_1fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
          <div>Land</div>
          <div className="text-center">Taal</div>
          <div className="text-center">Valuta</div>
          <div className="text-center">Punt waarde</div>
          <div className="text-center">Prijsrange</div>
          <div className="text-center">Status</div>
          <div className="text-right">Acties</div>
        </div>

        {countries.map(country => {
          const minPrice = country.pricing.experiencePoints['0-2'] * country.pricing.educationPoints['MBO'] * country.pricing.valuePerPoint
          const maxPrice = country.pricing.experiencePoints['10+'] * country.pricing.educationPoints10yr['WO'] * country.pricing.valuePerPoint
          return (
            <div key={country.code} className={`grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1fr_1fr_1.5fr_1fr_1fr] gap-2 px-6 py-4 border-b border-surface-border items-center hover:bg-surface-muted transition-colors ${!country.active ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{FLAGS[country.code] || '🏳️'}</span>
                <div>
                  <div className="text-ink font-medium text-sm">{country.localName}</div>
                  <div className="text-xs text-ink-muted">{country.name}</div>
                </div>
              </div>
              <div className="text-center text-sm text-ink-light">{country.language.toUpperCase()}</div>
              <div className="text-center text-sm text-ink-light font-medium">{country.currency}</div>
              <div className="text-center text-sm text-cyan font-bold">
                {formatPrice(country.pricing.valuePerPoint, country.pricing)}
              </div>
              <div className="text-center text-xs text-ink-light">
                {formatPrice(minPrice, country.pricing)} – {formatPrice(maxPrice, country.pricing)}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => toggleActive(country.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    country.active
                      ? 'bg-green-500/15 text-green-400 border-green-500/20 hover:bg-green-500/25'
                      : 'bg-gray-500/15 text-ink-muted border-gray-500/20 hover:bg-gray-500/25'
                  }`}
                >
                  {country.active ? 'Actief' : 'Inactief'}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/demo/admin/pricing?country=${country.code}`}
                  className="text-xs text-purple hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors border border-surface-border"
                >
                  Pricing →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Save */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => { setToast('Landenconfiguratie opgeslagen'); setTimeout(() => setToast(null), 3000) }}
          className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Wijzigingen opslaan
        </button>
      </div>
    </div>
  )
}
