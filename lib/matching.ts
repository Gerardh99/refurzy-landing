import { HardeCriteria, Kandidaat, TaalEis, TaalBeheersing } from './types'
import {
  OPLEIDING_NIVEAU,
  ERVARING_MINIMUM,
  OP_KANTOOR_DAGEN,
  REISTIJD_MINUTEN,
  TAALNIVEAU_WAARDE,
} from './constants'

export interface CriteriumResult {
  naam: string
  voldaan: boolean
  detail?: string
}

export interface HardeCriteriaMatchResult {
  score: number                    // 0-100 percentage
  icon: 'check' | 'warning'       // check >= 80%, warning < 80%
  criteria: CriteriumResult[]
}

/**
 * Calculate hard criteria match between a vacancy and a candidate.
 * Each criterion is pass/fail. Score = (passed / total) × 100.
 */
export function calculateHardeCriteriaMatch(
  hardeCriteria: HardeCriteria,
  kandidaat: Partial<Kandidaat>
): HardeCriteriaMatchResult {
  const criteria: CriteriumResult[] = []

  // 1. Opleidingsniveau: kandidaat >= vacature minimum
  const vacOpl = OPLEIDING_NIVEAU[hardeCriteria.opleidingsniveau] ?? 0
  const kanOpl = OPLEIDING_NIVEAU[kandidaat.opleidingsniveau ?? ''] ?? 0
  criteria.push({
    naam: 'Opleidingsniveau',
    voldaan: kanOpl >= vacOpl,
    detail: `Vereist: ${hardeCriteria.opleidingsniveau}, Kandidaat: ${kandidaat.opleidingsniveau ?? 'onbekend'}`,
  })

  // 2. Werkervaring: kandidaat range >= vacature minimum
  const vacExp = ERVARING_MINIMUM[hardeCriteria.minimaleErvaring] ?? 0
  const kanExpStr = kandidaat.werkervaring ?? '0'
  // Extract first number from string like "8 jaar" or "5-10 jaar"
  const kanExpMatch = kanExpStr.match(/(\d+)/)
  const kanExp = kanExpMatch ? parseInt(kanExpMatch[1], 10) : 0
  criteria.push({
    naam: 'Werkervaring',
    voldaan: kanExp >= vacExp,
    detail: `Vereist: ${hardeCriteria.minimaleErvaring}, Kandidaat: ${kandidaat.werkervaring ?? 'onbekend'}`,
  })

  // 3. Salarisindicatie: ranges must overlap
  if (hardeCriteria.salarisMin != null && hardeCriteria.salarisMax != null) {
    const kanSalMin = kandidaat.salarisMin ?? 0
    const kanSalMax = kandidaat.salarisMax ?? 999999
    const overlap = hardeCriteria.salarisMin <= kanSalMax && hardeCriteria.salarisMax >= kanSalMin
    criteria.push({
      naam: 'Salarisindicatie',
      voldaan: overlap,
      detail: `Vacature: €${hardeCriteria.salarisMin}-€${hardeCriteria.salarisMax}, Kandidaat: €${kanSalMin}-€${kanSalMax}`,
    })
  }

  // 4. Max reistijd: kandidaat's max <= vacature's max
  const vacReistijd = REISTIJD_MINUTEN[hardeCriteria.maxReistijd] ?? 999
  const kanReistijd = REISTIJD_MINUTEN[kandidaat.maxReistijd ?? ''] ?? 999
  if (hardeCriteria.maxReistijd && hardeCriteria.maxReistijd !== 'Niet van toepassing') {
    criteria.push({
      naam: 'Max reistijd',
      voldaan: kanReistijd <= vacReistijd || kanReistijd === 999,
      detail: `Vacature: ${hardeCriteria.maxReistijd}, Kandidaat: ${kandidaat.maxReistijd ?? 'n.v.t.'}`,
    })
  }

  // 5. Op kantoor: kandidaat bereid >= vacature eis (more days = more demanding)
  const vacKantoor = OP_KANTOOR_DAGEN[hardeCriteria.opKantoor] ?? 0
  const kanKantoor = OP_KANTOOR_DAGEN[kandidaat.opKantoor ?? ''] ?? 0
  if (hardeCriteria.opKantoor) {
    criteria.push({
      naam: 'Op kantoor',
      voldaan: kanKantoor >= vacKantoor,
      detail: `Vacature: ${hardeCriteria.opKantoor}, Kandidaat: ${kandidaat.opKantoor ?? 'onbekend'}`,
    })
  }

  // 6. Talen: all required languages must be met at minimum level
  if (hardeCriteria.talen && hardeCriteria.talen.length > 0) {
    const kanTalen = kandidaat.talen ?? []
    const alleMet = hardeCriteria.talen.every(eis => {
      const beheersing = kanTalen.find(t => t.taal === eis.taal)
      if (!beheersing) return false
      const eisWaarde = TAALNIVEAU_WAARDE[eis.minimaalNiveau] ?? 0
      const kanWaarde = TAALNIVEAU_WAARDE[beheersing.niveau] ?? 0
      return kanWaarde >= eisWaarde
    })
    const missingOrLow = hardeCriteria.talen
      .filter(eis => {
        const b = kanTalen.find(t => t.taal === eis.taal)
        if (!b) return true
        return (TAALNIVEAU_WAARDE[b.niveau] ?? 0) < (TAALNIVEAU_WAARDE[eis.minimaalNiveau] ?? 0)
      })
      .map(e => e.taal)
    criteria.push({
      naam: 'Talen',
      voldaan: alleMet,
      detail: alleMet
        ? `Alle ${hardeCriteria.talen.length} taaleis(en) voldaan`
        : `Niet voldaan: ${missingOrLow.join(', ')}`,
    })
  }

  // Calculate score
  const passed = criteria.filter(c => c.voldaan).length
  const total = criteria.length
  const score = total > 0 ? Math.round((passed / total) * 100) : 100

  return {
    score,
    icon: score >= 80 ? 'check' : 'warning',
    criteria,
  }
}
