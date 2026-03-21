export type UserRole = 'opdrachtgever' | 'scout' | 'kandidaat' | 'admin'

export interface User {
  email: string
  name: string
  role: UserRole
  company?: string
  avatar?: string
}

export interface Vacature {
  id: string
  title: string
  company: string
  location: string
  land: string
  vakgebied: string
  salaris: string
  salarisMin?: number
  salarisMax?: number
  deadline: string
  status: 'open' | 'gesloten' | 'vervuld'
  hardeCriteria: HardeCriteria
  kandidaten: KandidaatMatch[]
  createdAt: string
  pmsCompleted: boolean
}

export interface TaalEis {
  taal: string
  minimaalNiveau: 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

export interface TaalBeheersing {
  taal: string
  niveau: 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

export interface HardeCriteria {
  opleidingsniveau: 'MBO' | 'HBO' | 'WO'
  minimaleErvaring: string
  locatie: string
  opKantoor: string
  maxReistijd: string
  salarisMin?: number          // bruto per maand in euros
  salarisMax?: number          // bruto per maand in euros
  talen?: TaalEis[]            // required languages with minimum level
}

// ─── Pipeline statuses (ordered) ────────────────────────────────────────────
export type ProcesStatus =
  | 'voorgesteld'          // Scout has proposed the candidate
  | 'contract_akkoord'     // Employer accepted contract, profile unlocked
  | 'gesprek_plannen'      // Contact details visible, needs to schedule interview
  | 'gesprek_gepland'      // Interview date set
  | 'feedback_geven'       // Interview done, awaiting feedback
  | 'vervolggesprek'       // Follow-up interview(s)
  | 'arbeidsvoorwaarden'   // Salary negotiation phase
  | 'contract_getekend'    // 🎉 Hired!
  | 'afgewezen'            // Rejected at any stage

export type AfwijzingsReden =
  | 'ervaring'             // Niet de juiste ervaring
  | 'cultuur'              // Culturele mismatch
  | 'salaris'              // Salariseis te hoog
  | 'andere_kandidaat'     // Andere kandidaat gekozen
  | 'anders'               // Anders

export interface Gesprek {
  id: string
  type: 'kennismaking' | 'verdieping' | 'arbeidsvoorwaarden'
  datum: string            // ISO date
  feedback?: string        // Free text feedback
  rating?: number          // 1-5 stars (only on rejection or completion)
  status: 'gepland' | 'afgerond' | 'geannuleerd'
}

export interface KandidaatMatch {
  id: string
  naam: string
  initialen: string
  anoniem: boolean
  hardeCriteriaMatch: number
  hardeCriteriaIcon: 'check' | 'warning'
  deVriesFit: number
  scoutRating: number
  scoutNaam: string
  scoutId?: string
  status: 'aanbevolen' | 'bekijk' | 'overweeg' | 'afgewezen' | 'aangenomen'
  procesStatus: ProcesStatus
  unlocked: boolean
  opleidingsniveau: 'MBO' | 'HBO' | 'WO'
  werkervaring: string
  woonplaats: string
  email?: string
  telefoon?: string
  gesprekken?: Gesprek[]
  afwijzingsReden?: AfwijzingsReden
  afwijzingsToelichting?: string
  afwijzingsRating?: number  // 1-5 stars
  contractDatum?: string     // When contract was signed
  fitGarantieStart?: string  // Start of 12-month guarantee
  // ─── Scout pipeline detail fields (filled by opdrachtgever/kandidaat) ───
  stapStartDatum?: string           // When current step started (ISO date)
  laatsteActiviteit?: string        // Last update timestamp (ISO date)
  gesprekDatum?: string             // Scheduled interview date/time
  kandidaatBevestigd?: boolean      // Whether candidate confirmed the interview
  feedbackScore?: number            // 1-5 score from employer
  feedbackSamenvatting?: string     // Short feedback summary
  vervolggesprekDatum?: string      // Follow-up interview date
  arbeidsvoorwaardenStatus?: 'voorstel_verstuurd' | 'in_onderhandeling' | 'akkoord'
  startDatum?: string               // First working day (confirmed)
  startDatumBevestigdKandidaat?: boolean
  startDatumBevestigdOpdrachtgever?: boolean
}

export interface TalentScout {
  id: string
  naam: string
  rating: number
  aantalPlaatsingen: number
  anoniem: boolean
  // Pro Scout fields
  isProScout: boolean
  kvkNummer?: string
  bedrijfsnaam?: string
  btwNummer?: string
  zakelijkIban?: string
}

export type KandidaatPoolStatus = 'beschikbaar' | 'in_proces' | 'geplaatst' | 'inactief'

export interface Plaatsing {
  vacatureTitle: string
  bedrijf: string
  datum: string
  fee: number
  scoutFee: number
}

export interface Kandidaat {
  id: string
  naam: string
  email: string
  telefoon: string
  woonplaats: string
  opleidingsniveau: 'MBO' | 'HBO' | 'WO'
  werkervaring: string
  huidigeRol: string
  voorkeursFunctie: string
  // ─── Hard criteria matching fields ───
  salarisMin?: number            // bruto per maand verwachting
  salarisMax?: number            // bruto per maand verwachting
  maxReistijd?: string           // e.g. '45 minuten'
  opKantoor?: string             // e.g. 'Hybride (3 dagen)'
  talen?: TaalBeheersing[]       // languages with proficiency level
  scanCompleted: boolean
  cvUploaded: boolean
  scoutIds: string[]        // Multi-scout: kandidaat kan door meerdere scouts bemiddeld worden
  poolStatus?: KandidaatPoolStatus
  plaatsing?: Plaatsing
  inactiefReden?: string
  inactiefDatum?: string
}

export interface Sollicitatie {
  id: string
  vacatureTitle: string
  company: string
  status: string
  datum: string
  procesStatus?: ProcesStatus
  vacatureId?: string
}

export interface Contract {
  id: string
  contractNummer: string
  datum: string                    // ISO date when signed
  // Parties
  opdrachtgeverNaam: string
  opdrachtgeverBedrijf: string
  opdrachtgeverKvk: string
  opdrachtgeverAdres: string
  // Vacancy
  vacatureId: string
  vacatureTitle: string
  // Candidate
  kandidaatId: string
  kandidaatNaam: string
  kandidaatInitialen: string
  // Scout
  scoutNaam: string
  // Financials
  opleidingsniveau: string
  werkervaring: string
  plaatsingsfee: number            // excl BTW
  btw: number                      // 21%
  totaalInclBtw: number
  scoutFee: number                 // 50% excl BTW
  // Terms
  fitGarantie: boolean             // M-Score >= 80%
  mScore: number
  // Status
  status: 'getekend' | 'actief' | 'verlopen'
  // Signature
  ondertekendDoor: string          // Name typed
  ondertekendOp: string            // ISO datetime
}
