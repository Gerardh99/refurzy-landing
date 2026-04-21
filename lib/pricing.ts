// ─── Refurzy Pricing Engine ─────────────────────────────────────────────────
// No Cure No Pay: prijs = werkervaring (punten) × opleiding (punten) × waarde per punt
// Regel: >10 jaar ervaring → HBO en WO krijgen dezelfde multiplier (2,5)
// 50% naar Talent Scout, 50% naar Refurzy

export type ExperienceLevel = '0-2' | '2-5' | '5-10' | '10+'
export type EducationLevel = 'MBO' | 'HBO' | 'WO'
export type CountryCode = 'NL' | 'BE' | 'DE' | 'FR' | 'UK' | 'ES' | 'IT' | 'PT' | 'AT' | 'CH' | 'SE' | 'NO' | 'DK' | 'FI' | 'PL'

export interface PricingConfig {
  valuePerPoint: number
  experiencePoints: Record<ExperienceLevel, number>
  educationPoints: Record<EducationLevel, number>
  educationPoints10yr: Record<EducationLevel, number> // override for >10yr experience
  currency: string
  locale: string
}

export interface CountryConfig {
  code: CountryCode
  name: string
  localName: string
  language: string
  currency: string
  locale: string
  active: boolean
  pricing: PricingConfig
  /** Max. annual income (in local currency) a private person may earn as a Talent Scout
   *  before being required to register as a freelancer / company.
   *  Based on national tax / self-employment thresholds. */
  maxScoutIncomePrivatePerson: number
}

// ─── Default pricing (Netherlands) ──────────────────────────────────────────
const DEFAULT_PRICING: PricingConfig = {
  valuePerPoint: 1200,
  experiencePoints: { '0-2': 1, '2-5': 2, '5-10': 3, '10+': 4 },
  educationPoints: { MBO: 1.5, HBO: 2, WO: 3 },
  educationPoints10yr: { MBO: 1.5, HBO: 2.5, WO: 2.5 },
  currency: 'EUR',
  locale: 'nl-NL',
}

// ─── Country configurations ─────────────────────────────────────────────────
// maxScoutIncomePrivatePerson: national threshold (in local currency) above which
// a Talent Scout must be registered as a freelancer / company.
// Sources: national tax authorities & self-employment thresholds (2025).
export const COUNTRIES: CountryConfig[] = [
  { code: 'NL', name: 'Netherlands', localName: 'Nederland', language: 'nl', currency: 'EUR', locale: 'nl-NL', active: true, maxScoutIncomePrivatePerson: 18000, pricing: { ...DEFAULT_PRICING } },
  { code: 'BE', name: 'Belgium', localName: 'België', language: 'nl', currency: 'EUR', locale: 'nl-BE', active: true, maxScoutIncomePrivatePerson: 25000, pricing: { ...DEFAULT_PRICING, locale: 'nl-BE' } },
  { code: 'DE', name: 'Germany', localName: 'Deutschland', language: 'de', currency: 'EUR', locale: 'de-DE', active: false, maxScoutIncomePrivatePerson: 22000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 1400, locale: 'de-DE' } },
  { code: 'FR', name: 'France', localName: 'France', language: 'fr', currency: 'EUR', locale: 'fr-FR', active: false, maxScoutIncomePrivatePerson: 15000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 1300, locale: 'fr-FR' } },
  { code: 'UK', name: 'United Kingdom', localName: 'United Kingdom', language: 'en', currency: 'GBP', locale: 'en-GB', active: false, maxScoutIncomePrivatePerson: 12500, pricing: { ...DEFAULT_PRICING, valuePerPoint: 1100, currency: 'GBP', locale: 'en-GB' } },
  { code: 'ES', name: 'Spain', localName: 'España', language: 'es', currency: 'EUR', locale: 'es-ES', active: false, maxScoutIncomePrivatePerson: 14000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 1000, locale: 'es-ES' } },
  { code: 'IT', name: 'Italy', localName: 'Italia', language: 'it', currency: 'EUR', locale: 'it-IT', active: false, maxScoutIncomePrivatePerson: 13000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 1100, locale: 'it-IT' } },
  { code: 'PT', name: 'Portugal', localName: 'Portugal', language: 'pt', currency: 'EUR', locale: 'pt-PT', active: false, maxScoutIncomePrivatePerson: 10000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 900, locale: 'pt-PT' } },
  { code: 'AT', name: 'Austria', localName: 'Österreich', language: 'de', currency: 'EUR', locale: 'de-AT', active: false, maxScoutIncomePrivatePerson: 20000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 1350, locale: 'de-AT' } },
  { code: 'CH', name: 'Switzerland', localName: 'Schweiz', language: 'de', currency: 'CHF', locale: 'de-CH', active: false, maxScoutIncomePrivatePerson: 100000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 1800, currency: 'CHF', locale: 'de-CH' } },
  { code: 'SE', name: 'Sweden', localName: 'Sverige', language: 'sv', currency: 'SEK', locale: 'sv-SE', active: false, maxScoutIncomePrivatePerson: 190000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 12000, currency: 'SEK', locale: 'sv-SE' } },
  { code: 'NO', name: 'Norway', localName: 'Norge', language: 'no', currency: 'NOK', locale: 'nb-NO', active: false, maxScoutIncomePrivatePerson: 180000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 14000, currency: 'NOK', locale: 'nb-NO' } },
  { code: 'DK', name: 'Denmark', localName: 'Danmark', language: 'da', currency: 'DKK', locale: 'da-DK', active: false, maxScoutIncomePrivatePerson: 50000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 9000, currency: 'DKK', locale: 'da-DK' } },
  { code: 'FI', name: 'Finland', localName: 'Suomi', language: 'fi', currency: 'EUR', locale: 'fi-FI', active: false, maxScoutIncomePrivatePerson: 15000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 1250, locale: 'fi-FI' } },
  { code: 'PL', name: 'Poland', localName: 'Polska', language: 'pl', currency: 'PLN', locale: 'pl-PL', active: false, maxScoutIncomePrivatePerson: 75000, pricing: { ...DEFAULT_PRICING, valuePerPoint: 4000, currency: 'PLN', locale: 'pl-PL' } },
]

// ─── Calculate price ────────────────────────────────────────────────────────
export function calculatePrice(
  experience: ExperienceLevel,
  education: EducationLevel,
  pricing: PricingConfig = DEFAULT_PRICING
): number {
  const expPoints = pricing.experiencePoints[experience]
  const eduPoints = experience === '10+'
    ? pricing.educationPoints10yr[education]
    : pricing.educationPoints[education]
  return expPoints * eduPoints * pricing.valuePerPoint
}

// ─── Format price ───────────────────────────────────────────────────────────
export function formatPrice(amount: number, pricing: PricingConfig = DEFAULT_PRICING): string {
  return new Intl.NumberFormat(pricing.locale, {
    style: 'currency',
    currency: pricing.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─── Generate full price table ──────────────────────────────────────────────
export function generatePriceTable(pricing: PricingConfig = DEFAULT_PRICING) {
  const experiences: ExperienceLevel[] = ['0-2', '2-5', '5-10', '10+']
  const educations: EducationLevel[] = ['MBO', 'HBO', 'WO']

  return experiences.map(exp => ({
    experience: exp,
    prices: Object.fromEntries(
      educations.map(edu => [edu, calculatePrice(exp, edu, pricing)])
    ) as Record<EducationLevel, number>,
  }))
}

// ─── Experience & education labels ──────────────────────────────────────────
export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  '0-2': '0-2 jaar',
  '2-5': '2-5 jaar',
  '5-10': '5-10 jaar',
  '10+': '>10 jaar',
}

export const EDUCATION_LABELS: Record<EducationLevel, string> = {
  MBO: 'MBO',
  HBO: 'HBO',
  WO: 'WO',
}
