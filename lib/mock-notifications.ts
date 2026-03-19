import { UserRole } from './types'

export type NotificationType = 'vacancy' | 'match' | 'contract' | 'message' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string // ISO
  read: boolean
  link?: string
}

const notificationIcons: Record<NotificationType, string> = {
  vacancy: '📋',
  match: '🎯',
  contract: '📄',
  message: '💬',
  system: '⚙️',
}

const notificationTypeLabels: Record<NotificationType, string> = {
  vacancy: 'Vacature',
  match: 'Match',
  contract: 'Contract',
  message: 'Bericht',
  system: 'Systeem',
}

export { notificationIcons, notificationTypeLabels }

export const mockNotifications: Record<UserRole, Notification[]> = {
  opdrachtgever: [
    { id: 'n-og-1', type: 'match', title: 'Nieuwe kandidaat voorgedragen', description: 'Kandidaat M is voorgedragen voor Marketing Manager met een M-Score van 71%.', timestamp: '2026-03-19T09:15:00Z', read: false, link: '/demo/opdrachtgever/vacature/vac-1' },
    { id: 'n-og-2', type: 'message', title: 'Nudge van Talent Scout', description: 'Sophie de Graaf vraagt of u het gesprek met Thomas van Dijk kunt inplannen.', timestamp: '2026-03-18T14:30:00Z', read: false, link: '/demo/opdrachtgever/vacature/vac-2' },
    { id: 'n-og-3', type: 'contract', title: 'Contract klaar voor ondertekening', description: 'Het contract voor Anna de Jong (Marketing Manager) staat klaar ter ondertekening.', timestamp: '2026-03-17T11:00:00Z', read: false, link: '/demo/opdrachtgever/contracten' },
    { id: 'n-og-4', type: 'vacancy', title: 'Vacature verloopt binnenkort', description: 'De deadline voor Senior Software Developer is over 6 weken.', timestamp: '2026-03-16T08:00:00Z', read: true, link: '/demo/opdrachtgever/vacature/vac-2' },
    { id: 'n-og-5', type: 'match', title: 'Nieuwe kandidaat voorgedragen', description: 'Kandidaat P is voorgedragen voor Senior Software Developer met M-Score 68%.', timestamp: '2026-03-15T16:45:00Z', read: true, link: '/demo/opdrachtgever/vacature/vac-2' },
    { id: 'n-og-6', type: 'system', title: 'Fit Garantie check-in', description: 'De 3-maanden check-in voor Product Owner (Sanne Visser) staat gepland.', timestamp: '2026-03-14T10:00:00Z', read: true },
    { id: 'n-og-7', type: 'message', title: 'Feedback herinnering', description: 'Geef feedback over het gesprek met kandidaat P voor Senior Software Developer.', timestamp: '2026-03-14T08:30:00Z', read: true, link: '/demo/opdrachtgever/vacature/vac-2' },
    { id: 'n-og-8', type: 'vacancy', title: 'Vacature gepubliceerd', description: 'Uw vacature Senior Software Developer is live en zichtbaar voor scouts.', timestamp: '2026-03-10T09:00:00Z', read: true, link: '/demo/opdrachtgever/vacature/vac-2' },
  ],
  scout: [
    { id: 'n-sc-1', type: 'match', title: 'Matchingsuggestie', description: 'Nieuwe vacature HR Business Partner bij GreenLogistics matcht met 2 kandidaten in je pool.', timestamp: '2026-03-19T10:00:00Z', read: false, link: '/demo/scout/vacatures' },
    { id: 'n-sc-2', type: 'contract', title: 'Profiel ontgrendeld', description: 'TechVentures B.V. heeft het profiel van Thomas van Dijk ontgrendeld voor Senior Software Developer.', timestamp: '2026-03-18T15:20:00Z', read: false, link: '/demo/scout/pipeline' },
    { id: 'n-sc-3', type: 'message', title: 'Kandidaat heeft scan ingevuld', description: 'Eva Bakker heeft de Matching Scan ingevuld. M-Score: 76%.', timestamp: '2026-03-18T11:45:00Z', read: false, link: '/demo/scout' },
    { id: 'n-sc-4', type: 'vacancy', title: 'Nieuwe vacature beschikbaar', description: 'Financial Controller bij MedTech Solutions — WO, 5-10 jaar ervaring, Eindhoven.', timestamp: '2026-03-17T09:30:00Z', read: true, link: '/demo/scout/vacatures' },
    { id: 'n-sc-5', type: 'contract', title: 'Contract getekend!', description: 'Anna de Jong is aangenomen als Marketing Manager bij TechVentures. Fee: €5.400.', timestamp: '2026-03-15T14:00:00Z', read: true, link: '/demo/scout/pipeline' },
    { id: 'n-sc-6', type: 'message', title: 'Gesprek gepland', description: 'TechVentures heeft een kennismakingsgesprek gepland met Priya Sharma op 12 maart.', timestamp: '2026-03-11T10:15:00Z', read: true, link: '/demo/scout/pipeline' },
    { id: 'n-sc-7', type: 'system', title: 'Welkom bij Refurzy', description: 'Je account is aangemaakt. Begin met het uitnodigen van kandidaten.', timestamp: '2026-03-01T12:00:00Z', read: true },
    { id: 'n-sc-8', type: 'match', title: 'Kandidaat voorgedragen', description: 'Je hebt Jamal Usan voorgedragen voor Marketing Manager. Status: voorgesteld.', timestamp: '2026-03-08T16:30:00Z', read: true, link: '/demo/scout/pipeline' },
    { id: 'n-sc-9', type: 'vacancy', title: 'Vacature verloopt', description: 'HR Business Partner bij GreenLogistics verloopt over 4 weken.', timestamp: '2026-03-14T08:00:00Z', read: true, link: '/demo/scout/vacatures' },
    { id: 'n-sc-10', type: 'system', title: 'Pro Scout upgrade beschikbaar', description: 'Na nog 1 succesvolle plaatsing kun je upgraden naar Pro Scout.', timestamp: '2026-03-15T15:00:00Z', read: true },
  ],
  kandidaat: [
    { id: 'n-ka-1', type: 'match', title: 'Voorgedragen voor vacature', description: 'Je bent voorgedragen voor Marketing Manager bij TechVentures B.V.', timestamp: '2026-03-19T08:30:00Z', read: false, link: '/demo/kandidaat/pipeline' },
    { id: 'n-ka-2', type: 'contract', title: 'Gesprek gepland', description: 'Er is een verdiepingsgesprek gepland bij TechVentures B.V. op 14 maart.', timestamp: '2026-03-13T09:00:00Z', read: false, link: '/demo/kandidaat/pipeline' },
    { id: 'n-ka-3', type: 'message', title: 'Feedback ontvangen', description: 'De opdrachtgever was zeer positief over het kennismakingsgesprek.', timestamp: '2026-03-11T16:00:00Z', read: false, link: '/demo/kandidaat/pipeline' },
    { id: 'n-ka-4', type: 'contract', title: 'Arbeidsvoorwaarden fase', description: 'Het proces voor Marketing Manager is in de arbeidsvoorwaarden fase.', timestamp: '2026-03-15T10:30:00Z', read: true, link: '/demo/kandidaat/pipeline' },
    { id: 'n-ka-5', type: 'match', title: 'Voorgedragen voor vacature', description: 'Je bent voorgedragen voor Brand Strategist bij CreativeCo.', timestamp: '2026-03-12T14:00:00Z', read: true, link: '/demo/kandidaat/pipeline' },
    { id: 'n-ka-6', type: 'system', title: 'Matching Scan resultaat', description: 'Je M-Score is berekend: 87%. Dit kwalificeert voor de Fit Garantie.', timestamp: '2026-03-07T11:00:00Z', read: true, link: '/demo/kandidaat/scan' },
    { id: 'n-ka-7', type: 'system', title: 'Welkom bij Refurzy', description: 'Je account is aangemaakt door Sophie de Graaf. Vul je Matching Scan in.', timestamp: '2026-03-06T09:00:00Z', read: true },
    { id: 'n-ka-8', type: 'message', title: 'Gesprek herinnering', description: 'Morgen om 10:00 heb je een kennismakingsgesprek bij TechVentures B.V.', timestamp: '2026-03-09T08:00:00Z', read: true, link: '/demo/kandidaat/pipeline' },
  ],
  admin: [
    { id: 'n-ad-1', type: 'system', title: 'Escalatie melding', description: 'Scout Sophie de Graaf rapporteert: geen reactie van TechVentures op voordracht Thomas van Dijk.', timestamp: '2026-03-19T11:00:00Z', read: false },
    { id: 'n-ad-2', type: 'contract', title: 'Contract getekend', description: 'Anna de Jong aangenomen als Marketing Manager bij TechVentures. Fee: €10.800.', timestamp: '2026-03-18T14:00:00Z', read: false },
    { id: 'n-ad-3', type: 'system', title: 'Nieuwe registratie', description: 'Nieuw bedrijf geregistreerd: MedTech Solutions (KVK: 99887766).', timestamp: '2026-03-17T09:15:00Z', read: false, link: '/demo/admin/gebruikers' },
    { id: 'n-ad-4', type: 'match', title: 'KVK duplicaat verzoek', description: 'Iemand heeft een toegangsverzoek gestuurd voor TechVentures B.V. (KVK: 12345678).', timestamp: '2026-03-16T13:00:00Z', read: true, link: '/demo/admin/gebruikers' },
    { id: 'n-ad-5', type: 'vacancy', title: 'Nieuwe vacature', description: 'Financial Controller aangemaakt door MedTech Solutions.', timestamp: '2026-03-12T10:00:00Z', read: true },
    { id: 'n-ad-6', type: 'system', title: 'VU scan gebruik rapport', description: 'Maandelijks overzicht: 23 scans afgenomen in februari, waarvan 3 test.', timestamp: '2026-03-01T08:00:00Z', read: true, link: '/demo/admin/scan-gebruik' },
    { id: 'n-ad-7', type: 'contract', title: 'Uitbetaling verwerkt', description: 'Scout fee van €5.400 uitbetaald aan Sophie de Graaf.', timestamp: '2026-03-16T16:00:00Z', read: true, link: '/demo/admin/uitbetalingen' },
    { id: 'n-ad-8', type: 'system', title: 'Pro Scout upgrade', description: 'Sophie de Graaf heeft 2 plaatsingen bereikt. Pro Scout upgrade vereist.', timestamp: '2026-03-15T15:30:00Z', read: true, link: '/demo/admin/gebruikers' },
    { id: 'n-ad-9', type: 'vacancy', title: 'Vacature verlopen', description: 'Data Analyst bij StartupCo is verlopen zonder plaatsing.', timestamp: '2026-03-10T08:00:00Z', read: true },
    { id: 'n-ad-10', type: 'system', title: 'Systeem update', description: 'Pricing matrix bijgewerkt voor Duitsland en Belgie.', timestamp: '2026-03-05T14:00:00Z', read: true, link: '/demo/admin/landen' },
  ],
}
