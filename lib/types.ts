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
  status: 'aanbevolen' | 'bekijk' | 'overweeg' | 'afgewezen' | 'aangenomen'
  procesStatus?: 'nieuw' | 'kennismaking' | 'arbeidsvoorwaarden' | 'contract_getekend' | 'afgewezen' | 'aangenomen'
  unlocked: boolean
  opleidingsniveau: 'MBO' | 'HBO' | 'WO'
  werkervaring: string
  woonplaats: string
  email?: string
  telefoon?: string
}

export interface TalentScout {
  id: string
  naam: string
  rating: number
  aantalPlaatsingen: number
  anoniem: boolean
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
}
