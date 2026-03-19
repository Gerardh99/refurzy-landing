// ═══════════════════════════════════════════════════════════════════════════════
// Refurzy Matching Scan — Based on De Vries / VU Amsterdam research
// ═══════════════════════════════════════════════════════════════════════════════
//
// The scan measures Person-Environment fit across 3 dimensions:
//   1. Werkzaamheden/Interesses (19 items, a-s)
//   2. Waarden (9 items, a-i)
//   3. Organisatiekenmerken (7 items, a-g)
//
// Each dimension is measured 2 ways:
//   - Ranking (forced distribution, each number used once)
//   - Rating (Likert scale, each option can be used multiple times)
//
// The M-Score is calculated as:
//   m = 50 + 50 * pearson_correlation(org_POMP_profile, kandidaat_POMP_profile)
//
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Dimension 1: Werkzaamheden / Interesses (19 items) ─────────────────────

export interface ScanItem {
  id: string           // a, b, c, ... s
  labelOrg: string     // Organisation version
  labelKandidaat: string // Candidate version (slightly different wording)
  description: string  // Explanation in parentheses
}

export const werkzaamheden: ScanItem[] = [
  { id: 'a', labelOrg: 'Mensen sociaal faciliteren', labelKandidaat: 'Mensen sociaal faciliteren', description: 'personeel ondersteunen, sociale hulp verlenen, reizen organiseren' },
  { id: 'b', labelOrg: 'Zaken regelen', labelKandidaat: 'Zaken regelen', description: 'managen van een kantoor, hotel of verkoopafdeling' },
  { id: 'c', labelOrg: 'Financieel administreren', labelKandidaat: 'Financieel administreren', description: 'boekhouden, voorraden beheren, verzekeringen berekenen' },
  { id: 'd', labelOrg: 'Gegevens verwerken', labelKandidaat: 'Gegevens verwerken', description: 'data analyseren, computers programmeren' },
  { id: 'e', labelOrg: 'Met mechanica/machines werken', labelKandidaat: 'Met mechanica/machines werken', description: 'machines/instrumenten in elkaar zetten/inspecteren/repareren' },
  { id: 'f', labelOrg: 'In de natuur/voor het milieu werken', labelKandidaat: 'In de natuur/voor het milieu werken', description: 'dieren/natuur/klimaat bestuderen en beschermen' },
  { id: 'g', labelOrg: 'Artistiek werk verrichten', labelKandidaat: 'Artistiek werk verrichten', description: 'schrijven, dichten, schilderen, tekenen, beeldhouwen, musiceren' },
  { id: 'h', labelOrg: 'Mensen helpen', labelKandidaat: 'Mensen helpen', description: 'anderen helpen als pedagogisch werker, maatschappelijk werker of coach' },
  { id: 'i', labelOrg: 'Op wetenschap gestoelde zorg leveren', labelKandidaat: 'Gespecialiseerde zorg verlenen', description: 'werkzaam zijn als huisarts, psychotherapeut, jeugdcriminoloog' },
  { id: 'j', labelOrg: 'Invloedrijk werk doen', labelKandidaat: 'Invloedrijk werk doen', description: 'functies uitoefenen met grote politieke of maatschappelijke invloed' },
  { id: 'k', labelOrg: 'Met zakelijke systemen werken', labelKandidaat: 'Met zakelijke systemen werken', description: 'als systeembeheerder, bedrijfstoezichthouder, investeringsbankier' },
  { id: 'l', labelOrg: 'Kwaliteitscontroles uitvoeren', labelKandidaat: 'Kwaliteitscontroles uitvoeren', description: 'gebouwen, voorraden, productieprocessen controleren en inspecteren' },
  { id: 'm', labelOrg: 'Uitvoerend werk doen', labelKandidaat: 'Uitvoerend werk doen', description: 'als schoonmaker, chauffeur, (machine-)operateur' },
  { id: 'n', labelOrg: 'Persoonlijke diensten verlenen', labelKandidaat: 'Persoonlijke diensten verlenen', description: 'als stewardess, reisgids, barman/-vrouw, lichaamsverzorger' },
  { id: 'o', labelOrg: 'Financiën analyseren', labelKandidaat: 'Financiën analyseren', description: 'financieel advies geven, aandelen/obligaties beheren, bedrijfsbudgetten opstellen' },
  { id: 'p', labelOrg: 'Wetenschappelijk onderzoek doen', labelKandidaat: 'Gespecialiseerd onderzoek doen', description: 'aan een universiteit of onderzoeksbureau' },
  { id: 'q', labelOrg: 'In de bouw/reparatie werken', labelKandidaat: 'Bouwen/repareren', description: 'als bouwvakker, (auto-)monteur, machinist of aannemer' },
  { id: 'r', labelOrg: 'Basisdiensten verlenen', labelKandidaat: 'Basisdiensten verlenen', description: 'als bedienings- of verkoopmedewerker, receptionist, secretarieel medewerker' },
  { id: 's', labelOrg: 'Sport- en spelactiviteiten', labelKandidaat: 'Fysiek of in spel actief bezig zijn', description: 'als coach, trainer, of sportman/-vrouw' },
]

// ─── Dimension 2: Waarden (9 items) ─────────────────────────────────────────

export interface WaardeItem {
  id: string
  label: string
  description: string
}

export const waarden: WaardeItem[] = [
  { id: 'a', label: 'Macht', description: 'status, controle, gezag, materiële goederen' },
  { id: 'b', label: 'Prestatie', description: 'bekwaamheid, ambitie, invloed, succes' },
  { id: 'c', label: 'Plezier', description: 'genieten van het leven, jezelf verwennen, aan je verlangens toegeven' },
  { id: 'd', label: 'Stimulatie', description: 'opwinding, afwisseling, avontuur' },
  { id: 'e', label: 'Autonomie', description: 'vrijheid, zelfstandigheid, onafhankelijkheid' },
  { id: 'f', label: 'Universalisme', description: 'gelijkheid, vrede, sociale rechtvaardigheid, tolerantie' },
  { id: 'g', label: 'Toegeeflijkheid', description: 'loyaliteit, eerlijkheid, behulpzaamheid, verantwoordelijkheid' },
  { id: 'h', label: 'Traditie', description: 'gematigdheid, respect, gehoorzaamheid, hoffelijkheid' },
  { id: 'i', label: 'Veiligheid', description: 'veiligheid voor geliefden en de natie, orde, netheid, stabiliteit' },
]

// ─── Dimension 3: Organisatiekenmerken (7 items) ────────────────────────────

export interface KenmerkItem {
  id: string
  label: string
  description: string
}

export const organisatiekenmerken: KenmerkItem[] = [
  { id: 'a', label: 'Detailgerichtheid', description: 'aandacht voor detail, kwaliteitscontrole, precisie' },
  { id: 'b', label: 'Klantgerichtheid', description: 'luisteren naar klanten en de wensen van de markt' },
  { id: 'c', label: 'Resultaatgerichtheid', description: 'hoge prestatieverwachtingen hebben, op hoog niveau werken' },
  { id: 'd', label: 'Stabiliteitsgerichtheid', description: 'zekerheid en voorspelbaarheid bieden, duidelijke regels bieden' },
  { id: 'e', label: 'Samenwerkingsgerichtheid', description: 'ondersteunend zijn, een teamcultuur hebben, goed samenwerken' },
  { id: 'f', label: 'Integriteitgerichtheid', description: 'eerlijkheid, oprechtheid en rechtvaardigheid' },
  { id: 'g', label: 'Innovatiegerichtheid', description: 'experimenteren, risico\'s nemen, snel aanpassen, kansen grijpen' },
]

// ─── Scale definitions ──────────────────────────────────────────────────────

export interface ScaleOption {
  value: number
  label: string
}

// Section 1: Ranking 1-19 (forced)
export const werkzaamhedenRankingScale = { min: 1, max: 19, forced: true }

// Section 1: Rating 1-7 (Likert)
export const werkzaamhedenRatingScale: ScaleOption[] = [
  { value: 1, label: 'In zeer lage mate' },
  { value: 2, label: 'In lage mate' },
  { value: 3, label: 'Iets minder dan gemiddeld' },
  { value: 4, label: 'In gemiddelde mate' },
  { value: 5, label: 'Iets meer dan gemiddeld' },
  { value: 6, label: 'In hoge mate' },
  { value: 7, label: 'In zeer hoge mate' },
]

// Section 2: Ranking 1-9 (forced)
export const waardenRankingScale = { min: 1, max: 9, forced: true }

// Section 2: Rating 1-9 — Organisation version
export const waardenRatingScaleOrg: ScaleOption[] = [
  { value: 1, label: 'Tegengesteld aan de waarden van mijn organisatie' },
  { value: 2, label: 'Niet belangrijk voor mijn organisatie' },
  { value: 3, label: '' },
  { value: 4, label: '' },
  { value: 5, label: 'Belangrijk' },
  { value: 6, label: '' },
  { value: 7, label: '' },
  { value: 8, label: 'Zeer belangrijk' },
  { value: 9, label: 'Uiterst belangrijk voor mijn organisatie' },
]

// Section 2: Rating 1-9 — Kandidaat version
export const waardenRatingScaleKandidaat: ScaleOption[] = [
  { value: 1, label: 'Tegengesteld aan mijn waarden' },
  { value: 2, label: 'Niet belangrijk voor mij' },
  { value: 3, label: 'Weinig belangrijk voor mij' },
  { value: 4, label: 'Enigszins belangrijk voor mij' },
  { value: 5, label: 'Belangrijk voor mij' },
  { value: 6, label: 'Duidelijk belangrijk voor mij' },
  { value: 7, label: 'Zeer duidelijk belangrijk voor mij' },
  { value: 8, label: 'Zeer belangrijk voor mij' },
  { value: 9, label: 'Uiterst belangrijk voor mij' },
]

// Section 3: Ranking 1-7 (forced)
export const kenmerkenRankingScale = { min: 1, max: 7, forced: true }

// Section 3: Rating 1-7 (Likert, same as werkzaamheden)
export const kenmerkenRatingScale = werkzaamhedenRatingScale

// ─── Response types ─────────────────────────────────────────────────────────

export interface ScanResponses {
  // Section 1: Werkzaamheden (19 items × 2 methods)
  werkzaamheden_ranking: Record<string, number>  // a-s → 1-19
  werkzaamheden_rating: Record<string, number>   // a-s → 1-7

  // Section 2: Waarden (9 items × 2 methods)
  waarden_ranking: Record<string, number>         // a-i → 1-9
  waarden_rating: Record<string, number>          // a-i → 1-9

  // Section 3: Organisatiekenmerken (7 items × 2 methods)
  kenmerken_ranking: Record<string, number>        // a-g → 1-7
  kenmerken_rating: Record<string, number>         // a-g → 1-7
}

// ─── POMP Score Calculation ─────────────────────────────────────────────────
// POMP = Percentage Of Maximum Possible score (0-100)

function toPOMP(value: number, scaleMin: number, scaleMax: number): number {
  return (100 / (scaleMax - scaleMin)) * (value - scaleMin)
}

export function calculatePOMPProfile(responses: ScanResponses): number[] {
  const profile: number[] = []

  // Section 1: Werkzaamheden (19 items)
  for (const item of werkzaamheden) {
    const rankingPOMP = toPOMP(responses.werkzaamheden_ranking[item.id] || 10, 1, 19)
    const ratingPOMP = toPOMP(responses.werkzaamheden_rating[item.id] || 4, 1, 7)
    profile.push((rankingPOMP + ratingPOMP) / 2)
  }

  // Section 2: Waarden (9 items)
  for (const item of waarden) {
    const rankingPOMP = toPOMP(responses.waarden_ranking[item.id] || 5, 1, 9)
    const ratingPOMP = toPOMP(responses.waarden_rating[item.id] || 5, 1, 9)
    profile.push((rankingPOMP + ratingPOMP) / 2)
  }

  // Section 3: Organisatiekenmerken (7 items)
  for (const item of organisatiekenmerken) {
    const rankingPOMP = toPOMP(responses.kenmerken_ranking[item.id] || 4, 1, 7)
    const ratingPOMP = toPOMP(responses.kenmerken_rating[item.id] || 4, 1, 7)
    profile.push((rankingPOMP + ratingPOMP) / 2)
  }

  return profile // 35 values, each 0-100
}

// ─── Pearson Correlation ────────────────────────────────────────────────────

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length
  if (n !== y.length || n === 0) return 0

  const meanX = x.reduce((a, b) => a + b, 0) / n
  const meanY = y.reduce((a, b) => a + b, 0) / n

  let sumXY = 0, sumX2 = 0, sumY2 = 0
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX
    const dy = y[i] - meanY
    sumXY += dx * dy
    sumX2 += dx * dx
    sumY2 += dy * dy
  }

  const denominator = Math.sqrt(sumX2 * sumY2)
  if (denominator === 0) return 0

  return sumXY / denominator
}

// ─── M-Score Calculation (BESD) ─────────────────────────────────────────────
// m = 50 + 50 * correlation(org_profile, kandidaat_profile)
// Range: 0-100, where 50 = no correlation, 100 = perfect match

export function calculateMScore(
  orgResponses: ScanResponses,
  kandidaatResponses: ScanResponses
): number {
  const orgProfile = calculatePOMPProfile(orgResponses)
  const kandidaatProfile = calculatePOMPProfile(kandidaatResponses)

  const r = pearsonCorrelation(orgProfile, kandidaatProfile)
  const mScore = 50 + 50 * r

  // Clamp to 0-100 and round
  return Math.round(Math.max(0, Math.min(100, mScore)))
}

// ─── Scan step definitions ──────────────────────────────────────────────────

export type ScanStep =
  | 'intro'
  | 'werkzaamheden_ranking'
  | 'werkzaamheden_rating'
  | 'waarden_ranking'
  | 'waarden_rating'
  | 'kenmerken_ranking'
  | 'kenmerken_rating'
  | 'result'

export const scanSteps: { key: ScanStep; label: string; description: string }[] = [
  { key: 'intro', label: 'Introductie', description: 'Welkom bij de Matching Scan' },
  { key: 'werkzaamheden_ranking', label: 'Werkzaamheden (rangorde)', description: 'Breng een rangorde aan in 19 werkzaamheden' },
  { key: 'werkzaamheden_rating', label: 'Werkzaamheden (beoordeling)', description: 'Beoordeel elke werkzaamheid op een 7-puntsschaal' },
  { key: 'waarden_ranking', label: 'Waarden (rangorde)', description: 'Rangschik 9 waarden van minst tot meest belangrijk' },
  { key: 'waarden_rating', label: 'Waarden (beoordeling)', description: 'Beoordeel elke waarde op een 9-puntsschaal' },
  { key: 'kenmerken_ranking', label: 'Organisatiekenmerken (rangorde)', description: 'Rangschik 7 organisatiekenmerken' },
  { key: 'kenmerken_rating', label: 'Organisatiekenmerken (beoordeling)', description: 'Beoordeel elk kenmerk op een 7-puntsschaal' },
  { key: 'result', label: 'Resultaat', description: 'Uw profiel is compleet' },
]

// ─── Demo data: pre-filled organisation responses ───────────────────────────
// For TechVentures B.V. (Marketing Manager vacancy)

export const demoOrgResponses: ScanResponses = {
  werkzaamheden_ranking: {
    a: 14, b: 17, c: 5, d: 12, e: 2, f: 1, g: 8, h: 11, i: 3,
    j: 15, k: 10, l: 6, m: 4, n: 7, o: 9, p: 3, q: 1, r: 13, s: 16,
  },
  werkzaamheden_rating: {
    a: 6, b: 7, c: 3, d: 5, e: 1, f: 1, g: 4, h: 5, i: 2,
    j: 6, k: 4, l: 3, m: 2, n: 3, o: 4, p: 2, q: 1, r: 5, s: 6,
  },
  waarden_ranking: { a: 4, b: 8, c: 5, d: 6, e: 7, f: 3, g: 9, h: 2, i: 1 },
  waarden_rating: { a: 4, b: 8, c: 6, d: 6, e: 7, f: 5, g: 9, h: 3, i: 4 },
  kenmerken_ranking: { a: 3, b: 7, c: 6, d: 2, e: 5, f: 4, g: 1 },
  kenmerken_rating: { a: 4, b: 7, c: 6, d: 3, e: 5, f: 5, g: 3 },
}
