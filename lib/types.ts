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
  salaris: string
  deadline: string
  status: 'open' | 'gesloten'
  hardeCriteria: HardeCriteria
  kandidaten: KandidaatMatch[]
  createdAt: string
  pmsCompleted: boolean
}

export interface HardeCriteria {
  opleidingsniveau: 'MBO' | 'HBO' | 'WO'
  minimaleErvaring: string
  locatie: string
  opKantoor: string
  maxReistijd: string
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

export interface Nudge {
  id: string
  type: 'friendly' | 'urgent' | 'rapport'
  datum: string
  bericht: string
  vanScout: boolean        // true = from scout, false = from Refurzy
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
  nudges?: Nudge[]
  afwijzingsReden?: AfwijzingsReden
  afwijzingsToelichting?: string
  afwijzingsRating?: number  // 1-5 stars
  contractDatum?: string     // When contract was signed
  fitGarantieStart?: string  // Start of 12-month guarantee
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

export interface Kandidaat {
  id: string
  naam: string
  email: string
  telefoon: string
  woonplaats: string
  opleidingsniveau: 'MBO' | 'HBO' | 'WO'
  werkervaring: string
  huidigeRol: string
  scanCompleted: boolean
  cvUploaded: boolean
  scoutId: string
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
