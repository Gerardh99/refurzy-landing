'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/i18n'
import {
  COUNTRIES,
  calculatePrice,
  formatPrice,
  EXPERIENCE_LABELS,
  EDUCATION_LABELS,
  type CountryConfig,
  type ExperienceLevel,
  type EducationLevel,
  type PricingConfig,
} from '@/lib/pricing'

const experiences: ExperienceLevel[] = ['0-2', '2-5', '5-10', '10+']
const educations: EducationLevel[] = ['MBO', 'HBO', 'WO']

const texts = {
  nl: {
    backLink: '← Terug naar admin',
    title: 'Pricing beheer',
    subtitle: 'No Cure No Pay — prijs = werkervaring × opleiding × waarde per punt',
    countryLabel: 'Land selecteren',
    statusActive: 'ACTIEF',
    statusInactive: 'INACTIEF',
    langLabel: 'Taal:',
    currencyLabel: 'Valuta:',
    inactiveOption: '(inactief)',
    sectionValuePerPoint: 'Waarde per punt',
    amountLabel: (currency: string) => `Bedrag (${currency})`,
    splitInfo: '50% Scout / 50% Refurzy',
    sectionFormula: 'Formule',
    formulaComment: 'prijs = werkervaring × opleiding × waarde_per_punt',
    exampleText: (country: string) => `Voorbeeld: HBO + 5-10 jaar (${country})`,
    sectionExp: 'Werkervaring — punten',
    sectionEdu: 'Opleiding — punten',
    normalLabel: 'Normaal',
    over10Label: '>10 jaar',
    over10Note: 'Bij >10 jaar ervaring worden HBO en WO gelijk (multiplier 2,5) omdat het opleidingsniveau minder relevant is.',
    liveTableTitle: (country: string) => `Live prijstabel — ${country}`,
    priceFootnote: (currency: string) => `Prijzen in ${currency} (ex. BTW)`,
    equalLabel: 'gelijk',
    expHeader: 'Werkervaring',
    sectionDistribution: 'Verdeling per plaatsing',
    distScout: 'Talent Scout',
    distRefurzy: 'Refurzy',
    distExclusivity: 'Exclusiviteitstoeslag',
    toScout: 'naar Scout',
    resetBtn: 'Reset',
    saveBtn: (country: string) => `Opslaan voor ${country}`,
    toastSaved: (country: string) => `Pricing voor ${country} opgeslagen`,
  },
  en: {
    backLink: '← Back to admin',
    title: 'Pricing management',
    subtitle: 'No Cure No Pay — price = work experience × education × value per point',
    countryLabel: 'Select country',
    statusActive: 'ACTIVE',
    statusInactive: 'INACTIVE',
    langLabel: 'Language:',
    currencyLabel: 'Currency:',
    inactiveOption: '(inactive)',
    sectionValuePerPoint: 'Value per point',
    amountLabel: (currency: string) => `Amount (${currency})`,
    splitInfo: '50% Scout / 50% Refurzy',
    sectionFormula: 'Formula',
    formulaComment: 'price = work_experience × education × value_per_point',
    exampleText: (country: string) => `Example: HBO + 5-10 yr (${country})`,
    sectionExp: 'Work experience — points',
    sectionEdu: 'Education — points',
    normalLabel: 'Standard',
    over10Label: '>10 yr',
    over10Note: 'With >10 yr experience, HBO and WO become equal (multiplier 2.5) as education level becomes less relevant.',
    liveTableTitle: (country: string) => `Live price table — ${country}`,
    priceFootnote: (currency: string) => `Prices in ${currency} (excl. VAT)`,
    equalLabel: 'equal',
    expHeader: 'Work experience',
    sectionDistribution: 'Distribution per placement',
    distScout: 'Talent Scout',
    distRefurzy: 'Refurzy',
    distExclusivity: 'Exclusivity fee',
    toScout: 'to Scout',
    resetBtn: 'Reset',
    saveBtn: (country: string) => `Save for ${country}`,
    toastSaved: (country: string) => `Pricing for ${country} saved`,
  },
}

export default function PricingAdminPage() {
  const { lang } = useLang()
  const t = texts[lang]

  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(
    COUNTRIES.find(c => c.code === 'NL')!
  )
  const [pricing, setPricing] = useState<PricingConfig>({ ...selectedCountry.pricing })
  const [toast, setToast] = useState<string | null>(null)

  function handleCountryChange(code: string) {
    const country = COUNTRIES.find(c => c.code === code)!
    setSelectedCountry(country)
    setPricing({ ...country.pricing })
  }

  function handleSave() {
    setToast(t.toastSaved(selectedCountry.localName))
    setTimeout(() => setToast(null), 3000)
  }

  function updateValuePerPoint(val: number) {
    setPricing(p => ({ ...p, valuePerPoint: val }))
  }

  function updateExpPoints(level: ExperienceLevel, val: number) {
    setPricing(p => ({ ...p, experiencePoints: { ...p.experiencePoints, [level]: val } }))
  }

  function updateEduPoints(level: EducationLevel, val: number) {
    setPricing(p => ({ ...p, educationPoints: { ...p.educationPoints, [level]: val } }))
  }

  function updateEdu10yrPoints(level: EducationLevel, val: number) {
    setPricing(p => ({ ...p, educationPoints10yr: { ...p.educationPoints10yr, [level]: val } }))
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
          {t.backLink}
        </Link>
        <h1 className="text-2xl font-bold text-ink mt-3">{t.title}</h1>
        <p className="text-ink-light font-medium mt-1">{t.subtitle}</p>
      </div>

      {/* Country selector */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🌍</span>
            <div>
              <label className="text-xs text-ink-muted block mb-1">{t.countryLabel}</label>
              <select
                value={selectedCountry.code}
                onChange={e => handleCountryChange(e.target.value)}
                className="bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 min-w-[250px]"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.localName} ({c.code}) — {c.currency} {c.active ? '' : t.inactiveOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
              selectedCountry.active
                ? 'bg-green-500/15 text-green-400 border-green-500/20'
                : 'bg-gray-500/15 text-ink-light border-gray-500/20'
            }`}>
              {selectedCountry.active ? t.statusActive : t.statusInactive}
            </span>
            <span className="text-sm text-ink-muted">{t.langLabel} {selectedCountry.language} | {t.currencyLabel} {selectedCountry.currency}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Value per point */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-ink font-semibold mb-4">{t.sectionValuePerPoint}</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-xs text-ink-muted mb-1.5 block">{t.amountLabel(pricing.currency)}</label>
              <input
                type="number"
                value={pricing.valuePerPoint}
                onChange={e => updateValuePerPoint(Number(e.target.value))}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-lg font-bold focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div className="text-xs text-ink-muted pb-3">
              {t.splitInfo}
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-ink font-semibold mb-4">{t.sectionFormula}</h2>
          <div className="bg-surface-muted rounded-xl border border-surface-border p-4 font-mono text-sm">
            <div className="text-cyan mb-2">{t.formulaComment}</div>
            <div className="text-ink-muted text-xs mt-3">{t.exampleText(selectedCountry.localName)}</div>
            <div className="text-ink">
              {pricing.experiencePoints['5-10']} × {pricing.educationPoints['HBO']} × {formatPrice(pricing.valuePerPoint, pricing)} = <span className="text-cyan font-bold">{formatPrice(calculatePrice('5-10', 'HBO', pricing), pricing)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Work experience points */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-ink font-semibold mb-4">{t.sectionExp}</h2>
          <div className="space-y-3">
            {experiences.map(exp => (
              <div key={exp} className="flex items-center justify-between">
                <span className="text-sm text-ink-light w-24">{EXPERIENCE_LABELS[exp]}</span>
                <input
                  type="number"
                  step="0.5"
                  value={pricing.experiencePoints[exp]}
                  onChange={e => updateExpPoints(exp, Number(e.target.value))}
                  className="w-24 bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm text-center focus:outline-none focus:border-cyan/50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Education points */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-ink font-semibold mb-4">{t.sectionEdu}</h2>
          <div className="space-y-3">
            {educations.map(edu => (
              <div key={edu} className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink-light w-16">{EDUCATION_LABELS[edu]}</span>
                <div className="flex items-center gap-2">
                  <div>
                    <label className="text-[10px] text-ink-muted block text-center">{t.normalLabel}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={pricing.educationPoints[edu]}
                      onChange={e => updateEduPoints(edu, Number(e.target.value))}
                      className="w-20 bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm text-center focus:outline-none focus:border-cyan/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-ink-muted block text-center">{t.over10Label}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={pricing.educationPoints10yr[edu]}
                      onChange={e => updateEdu10yrPoints(edu, Number(e.target.value))}
                      className="w-20 bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm text-center focus:outline-none focus:border-cyan/50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-purple/10 rounded-lg p-3 border border-surface-border">
            <p className="text-xs text-purple">
              {t.over10Note}
            </p>
          </div>
        </div>
      </div>

      {/* Live price table */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-ink font-semibold">{t.liveTableTitle(selectedCountry.localName)}</h2>
          <span className="text-xs text-ink-muted">{t.priceFootnote(pricing.currency)}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-3 px-4 text-xs text-ink-muted uppercase">{t.expHeader}</th>
                {educations.map(edu => (
                  <th key={edu} className="text-center py-3 px-4 text-xs text-ink-muted uppercase">{edu}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {experiences.map(exp => (
                <tr key={exp} className="border-b border-surface-border hover:bg-surface-muted transition-colors">
                  <td className="py-3 px-4 text-sm text-ink-light font-medium">{EXPERIENCE_LABELS[exp]}</td>
                  {educations.map(edu => {
                    const price = calculatePrice(exp, edu, pricing)
                    const isEqual = exp === '10+' && (edu === 'HBO' || edu === 'WO')
                    return (
                      <td key={edu} className="text-center py-3 px-4">
                        <span className={`text-sm font-bold ${isEqual ? 'text-cyan' : 'text-ink'}`}>
                          {formatPrice(price, pricing)}
                        </span>
                        {isEqual && <span className="text-[10px] text-cyan/60 block">{t.equalLabel}</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-ink font-semibold mb-4">{t.sectionDistribution}</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-muted rounded-xl border border-cyan/20 p-4 text-center">
            <div className="text-xs text-ink-muted mb-1">{t.distScout}</div>
            <div className="text-2xl font-bold text-cyan">50%</div>
          </div>
          <div className="bg-surface-muted rounded-xl border border-surface-border p-4 text-center">
            <div className="text-xs text-ink-muted mb-1">{t.distRefurzy}</div>
            <div className="text-2xl font-bold text-purple">50%</div>
          </div>
          <div className="bg-surface-muted rounded-xl border border-orange/20 p-4 text-center">
            <div className="text-xs text-ink-muted mb-1">{t.distExclusivity}</div>
            <div className="text-2xl font-bold text-orange">+30%</div>
            <div className="text-[10px] text-orange/60">{t.toScout}</div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setPricing({ ...selectedCountry.pricing })}
          className="bg-surface-muted border border-surface-border text-ink-light px-6 py-3 rounded-xl font-semibold text-sm hover:text-ink transition-colors"
        >
          {t.resetBtn}
        </button>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          {t.saveBtn(selectedCountry.localName)}
        </button>
      </div>
    </div>
  )
}
