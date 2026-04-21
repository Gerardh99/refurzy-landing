'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COUNTRIES, formatPrice, type CountryConfig } from '@/lib/pricing'
import { useLang } from '@/lib/i18n'

const FLAGS: Record<string, string> = {
  NL: '🇳🇱', BE: '🇧🇪', DE: '🇩🇪', FR: '🇫🇷', UK: '🇬🇧', ES: '🇪🇸', IT: '🇮🇹',
  PT: '🇵🇹', AT: '🇦🇹', CH: '🇨🇭', SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰', FI: '🇫🇮', PL: '🇵🇱',
}

const texts = {
  nl: {
    back: '← Terug naar admin',
    title: 'Landen configuratie',
    subtitle: 'Beheer de internationale uitrol van Refurzy',
    statActive: 'Actieve landen',
    statConfigured: 'Geconfigureerd',
    statCurrencies: 'Valuta\'s',
    colCountry: 'Land',
    colLanguage: 'Taal',
    colCurrency: 'Valuta',
    colPointValue: 'Punt waarde',
    colPriceRange: 'Prijsrange',
    colMaxIncome: 'Max. inkomen privéscout',
    colStatus: 'Status',
    colActions: 'Acties',
    active: 'Actief',
    inactive: 'Inactief',
    saveBtn: 'Wijzigingen opslaan',
    toastSaved: 'Landenconfiguratie opgeslagen',
    maxIncomeTooltip: 'Drempelwaarde (in lokale valuta) waarboven een privépersoon zich als ondernemer/freelancer moet registreren om als Talent Scout te mogen opereren. Scouts die dit bedrag overschrijden worden automatisch gemarkeerd voor verificatie.',
    maxIncomeNote: 'Scouts die dit bedrag overschrijden worden gemarkeerd voor registratieverificatie.',
  },
  en: {
    back: '← Back to admin',
    title: 'Countries configuration',
    subtitle: 'Manage the international rollout of Refurzy',
    statActive: 'Active countries',
    statConfigured: 'Configured',
    statCurrencies: 'Currencies',
    colCountry: 'Country',
    colLanguage: 'Language',
    colCurrency: 'Currency',
    colPointValue: 'Point value',
    colPriceRange: 'Price range',
    colMaxIncome: 'Max. income (private scout)',
    colStatus: 'Status',
    colActions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    saveBtn: 'Save changes',
    toastSaved: 'Country configuration saved',
    maxIncomeTooltip: 'Threshold (in local currency) above which a private person must register as a self-employed / company to operate as a Talent Scout. Scouts exceeding this amount are automatically flagged for verification.',
    maxIncomeNote: 'Scouts exceeding this amount are flagged for registration verification.',
  },
}

export default function LandenPage() {
  const { lang } = useLang()
  const t = texts[lang]

  const [countries, setCountries] = useState<CountryConfig[]>(COUNTRIES.map(c => ({ ...c })))
  const [toast, setToast] = useState<string | null>(null)
  const [editingIncome, setEditingIncome] = useState<string | null>(null)
  const [incomeInput, setIncomeInput] = useState('')

  function toggleActive(code: string) {
    setCountries(prev => prev.map(c =>
      c.code === code ? { ...c, active: !c.active } : c
    ))
  }

  function startEditIncome(country: CountryConfig) {
    setEditingIncome(country.code)
    setIncomeInput(String(country.maxScoutIncomePrivatePerson))
  }

  function saveIncome(code: string) {
    const val = parseInt(incomeInput.replace(/\D/g, ''), 10)
    if (!isNaN(val) && val > 0) {
      setCountries(prev => prev.map(c =>
        c.code === code ? { ...c, maxScoutIncomePrivatePerson: val } : c
      ))
    }
    setEditingIncome(null)
  }

  function formatIncome(country: CountryConfig) {
    return new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(country.maxScoutIncomePrivatePerson)
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
          {t.back}
        </Link>
        <h1 className="text-2xl font-bold text-ink mt-3">{t.title}</h1>
        <p className="text-ink-light font-medium mt-1">{t.subtitle}</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-surface-border p-6 text-center">
          <div className="text-3xl font-bold text-cyan">{countries.filter(c => c.active).length}</div>
          <div className="text-xs text-ink-muted mt-1">{t.statActive}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-6 text-center">
          <div className="text-3xl font-bold text-purple">{countries.length}</div>
          <div className="text-xs text-ink-muted mt-1">{t.statConfigured}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-6 text-center">
          <div className="text-3xl font-bold text-ink">{new Set(countries.map(c => c.currency)).size}</div>
          <div className="text-xs text-ink-muted mt-1">{t.statCurrencies}</div>
        </div>
      </div>

      {/* Max-income info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">⚖️</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">{t.colMaxIncome}</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{t.maxIncomeTooltip}</p>
        </div>
      </div>

      {/* Countries table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_0.7fr_0.7fr_0.8fr_1.2fr_1.4fr_0.8fr_0.8fr] gap-2 px-5 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
          <div>{t.colCountry}</div>
          <div className="text-center">{t.colLanguage}</div>
          <div className="text-center">{t.colCurrency}</div>
          <div className="text-center">{t.colPointValue}</div>
          <div className="text-center">{t.colPriceRange}</div>
          <div className="text-center">{t.colMaxIncome}</div>
          <div className="text-center">{t.colStatus}</div>
          <div className="text-right">{t.colActions}</div>
        </div>

        {countries.map(country => {
          const minPrice = country.pricing.experiencePoints['0-2'] * country.pricing.educationPoints['MBO'] * country.pricing.valuePerPoint
          const maxPrice = country.pricing.experiencePoints['10+'] * country.pricing.educationPoints10yr['WO'] * country.pricing.valuePerPoint
          const isEditingThis = editingIncome === country.code

          return (
            <div key={country.code} className={`grid grid-cols-1 lg:grid-cols-[2fr_0.7fr_0.7fr_0.8fr_1.2fr_1.4fr_0.8fr_0.8fr] gap-2 px-5 py-4 border-b border-surface-border items-center hover:bg-surface-muted/40 transition-colors ${!country.active ? 'opacity-50' : ''}`}>

              {/* Country name */}
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

              {/* Max income — editable */}
              <div className="flex items-center justify-center">
                {isEditingThis ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={incomeInput}
                      onChange={e => setIncomeInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveIncome(country.code); if (e.key === 'Escape') setEditingIncome(null) }}
                      className="w-28 text-xs border border-purple/40 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple text-ink text-center"
                      autoFocus
                    />
                    <button onClick={() => saveIncome(country.code)} className="text-xs text-green-600 hover:text-green-700 font-bold px-1">✓</button>
                    <button onClick={() => setEditingIncome(null)} className="text-xs text-red-400 hover:text-red-500 font-bold px-1">✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditIncome(country)}
                    className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition-colors"
                    title={t.maxIncomeNote}
                  >
                    {formatIncome(country)}
                  </button>
                )}
              </div>

              {/* Active toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => toggleActive(country.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    country.active
                      ? 'bg-green-500/15 text-green-400 border-green-500/20 hover:bg-green-500/25'
                      : 'bg-gray-500/15 text-ink-muted border-gray-500/20 hover:bg-gray-500/25'
                  }`}
                >
                  {country.active ? t.active : t.inactive}
                </button>
              </div>

              {/* Actions */}
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
          onClick={() => { setToast(t.toastSaved); setTimeout(() => setToast(null), 3000) }}
          className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          {t.saveBtn}
        </button>
      </div>
    </div>
  )
}
