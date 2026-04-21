/**
 * Scout KVK / company registration state.
 * Persisted in localStorage so it survives navigation within the demo session.
 *
 * Business rule: a private-person scout who would exceed the country's
 * `maxScoutIncomePrivatePerson` threshold with their next placement must
 * first register as a self-employed professional (zzp / KVK).
 */

import { scoutKandidaten } from './mock-data'
import { COUNTRIES } from './pricing'

const KVK_STORAGE_KEY = 'refurzy_scout_kvk'

export interface ScoutKvkStatus {
  isRegistered: boolean
  kvkNummer: string
  bedrijfsnaam: string
  btwNummer?: string
}

export function getScoutKvkStatus(): ScoutKvkStatus {
  if (typeof window === 'undefined') return { isRegistered: false, kvkNummer: '', bedrijfsnaam: '' }
  try {
    const stored = localStorage.getItem(KVK_STORAGE_KEY)
    if (stored) return JSON.parse(stored) as ScoutKvkStatus
  } catch { /* ignore */ }
  return { isRegistered: false, kvkNummer: '', bedrijfsnaam: '' }
}

export function saveScoutKvkStatus(data: Omit<ScoutKvkStatus, 'isRegistered'>): void {
  const status: ScoutKvkStatus = { ...data, isRegistered: true }
  try {
    localStorage.setItem(KVK_STORAGE_KEY, JSON.stringify(status))
  } catch { /* ignore */ }
}

/** Total scout fees earned from all placed candidates in the demo dataset. */
export function getScoutEarnedTotal(): number {
  return scoutKandidaten
    .filter(k => k.poolStatus === 'geplaatst')
    .reduce((sum, k) => sum + (k.plaatsing?.scoutFee ?? 0), 0)
}

/** Country threshold above which private-person scouts must register. */
export function getCountryThreshold(countryCode = 'NL'): number {
  return COUNTRIES.find(c => c.code === countryCode)?.maxScoutIncomePrivatePerson ?? 18000
}

/**
 * Returns true when a new placement with the given `potentialScoutFee` would
 * push the scout's cumulative earnings past the country threshold — AND the
 * scout has not yet registered their KVK.
 */
export function wouldExceedThreshold(potentialScoutFee: number, countryCode = 'NL'): boolean {
  const status = getScoutKvkStatus()
  if (status.isRegistered) return false
  const earned = getScoutEarnedTotal()
  const threshold = getCountryThreshold(countryCode)
  return earned + potentialScoutFee > threshold
}
