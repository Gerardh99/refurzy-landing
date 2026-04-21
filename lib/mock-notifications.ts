import { UserRole } from './types'

export type NotificationType = 'vacancy' | 'match' | 'contract' | 'message' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: { nl: string; en: string }
  description: { nl: string; en: string }
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
    {
      id: 'n-og-1', type: 'match',
      title: { nl: 'Nieuwe kandidaat voorgedragen', en: 'New candidate nominated' },
      description: { nl: 'Kandidaat M is voorgedragen voor Marketing Manager met een M-Score van 71%.', en: 'Candidate M has been nominated for Marketing Manager with an M-Score of 71%.' },
      timestamp: '2026-03-19T09:15:00Z', read: false, link: '/demo/opdrachtgever/vacature/vac-1',
    },
    {
      id: 'n-og-2', type: 'system',
      title: { nl: 'Herinnering: gesprek plannen', en: 'Reminder: schedule interview' },
      description: { nl: 'Thomas van Dijk wacht op een uitnodiging voor een kennismakingsgesprek voor Senior Software Developer. Plan het gesprek deze week in.', en: 'Thomas van Dijk is waiting for an invitation for an introductory interview for Senior Software Developer. Schedule the meeting this week.' },
      timestamp: '2026-03-18T14:30:00Z', read: false, link: '/demo/opdrachtgever/vacature/vac-2',
    },
    {
      id: 'n-og-3', type: 'contract',
      title: { nl: 'Contract klaar voor ondertekening', en: 'Contract ready for signing' },
      description: { nl: 'Het contract voor Anna de Jong (Marketing Manager) staat klaar ter ondertekening.', en: 'The contract for Anna de Jong (Marketing Manager) is ready for signing.' },
      timestamp: '2026-03-17T11:00:00Z', read: false, link: '/demo/opdrachtgever/contracten',
    },
    {
      id: 'n-og-4', type: 'vacancy',
      title: { nl: 'Vacature verloopt binnenkort', en: 'Vacancy expiring soon' },
      description: { nl: 'De deadline voor Senior Software Developer is over 6 weken.', en: 'The deadline for Senior Software Developer is in 6 weeks.' },
      timestamp: '2026-03-16T08:00:00Z', read: true, link: '/demo/opdrachtgever/vacature/vac-2',
    },
    {
      id: 'n-og-5', type: 'match',
      title: { nl: 'Nieuwe kandidaat voorgedragen', en: 'New candidate nominated' },
      description: { nl: 'Kandidaat P is voorgedragen voor Senior Software Developer met M-Score 68%.', en: 'Candidate P has been nominated for Senior Software Developer with M-Score 68%.' },
      timestamp: '2026-03-15T16:45:00Z', read: true, link: '/demo/opdrachtgever/vacature/vac-2',
    },
    {
      id: 'n-og-6', type: 'system',
      title: { nl: 'Fit Garantie check-in', en: 'Fit Guarantee check-in' },
      description: { nl: 'De 3-maanden check-in voor Product Owner (Sanne Visser) staat gepland.', en: 'The 3-month check-in for Product Owner (Sanne Visser) is scheduled.' },
      timestamp: '2026-03-14T10:00:00Z', read: true,
    },
    {
      id: 'n-og-7', type: 'message',
      title: { nl: 'Feedback herinnering', en: 'Feedback reminder' },
      description: { nl: 'Geef feedback over het gesprek met kandidaat P voor Senior Software Developer.', en: 'Please give feedback on the interview with candidate P for Senior Software Developer.' },
      timestamp: '2026-03-14T08:30:00Z', read: true, link: '/demo/opdrachtgever/vacature/vac-2',
    },
    {
      id: 'n-og-8', type: 'vacancy',
      title: { nl: 'Vacature gepubliceerd', en: 'Vacancy published' },
      description: { nl: 'Uw vacature Senior Software Developer is live en zichtbaar voor scouts.', en: 'Your vacancy Senior Software Developer is live and visible to scouts.' },
      timestamp: '2026-03-10T09:00:00Z', read: true, link: '/demo/opdrachtgever/vacature/vac-2',
    },
  ],
  scout: [
    {
      id: 'n-sc-1', type: 'match',
      title: { nl: 'Matchingsuggestie', en: 'Matching suggestion' },
      description: { nl: 'Nieuwe vacature HR Business Partner bij GreenLogistics matcht met 2 kandidaten in je pool.', en: 'New vacancy HR Business Partner at GreenLogistics matches 2 candidates in your pool.' },
      timestamp: '2026-03-19T10:00:00Z', read: false, link: '/demo/scout/vacatures',
    },
    {
      id: 'n-sc-2', type: 'contract',
      title: { nl: 'Profiel ontgrendeld', en: 'Profile unlocked' },
      description: { nl: 'TechVentures B.V. heeft het profiel van Thomas van Dijk ontgrendeld voor Senior Software Developer.', en: 'TechVentures B.V. has unlocked the profile of Thomas van Dijk for Senior Software Developer.' },
      timestamp: '2026-03-18T15:20:00Z', read: false, link: '/demo/scout/pipeline',
    },
    {
      id: 'n-sc-3', type: 'message',
      title: { nl: 'Kandidaat heeft scan ingevuld', en: 'Candidate completed scan' },
      description: { nl: 'Eva Bakker heeft de Matching Scan ingevuld. M-Score: 76%.', en: 'Eva Bakker has completed the Matching Scan. M-Score: 76%.' },
      timestamp: '2026-03-18T11:45:00Z', read: false, link: '/demo/scout',
    },
    {
      id: 'n-sc-4', type: 'vacancy',
      title: { nl: 'Nieuwe vacature beschikbaar', en: 'New vacancy available' },
      description: { nl: 'Financial Controller bij MedTech Solutions — WO, 5-10 jaar ervaring, Eindhoven.', en: 'Financial Controller at MedTech Solutions — Master\'s degree, 5-10 years experience, Eindhoven.' },
      timestamp: '2026-03-17T09:30:00Z', read: true, link: '/demo/scout/vacatures',
    },
    {
      id: 'n-sc-5', type: 'contract',
      title: { nl: 'Contract getekend!', en: 'Contract signed!' },
      description: { nl: 'Anna de Jong is aangenomen als Marketing Manager bij TechVentures. Fee: €5.400.', en: 'Anna de Jong has been hired as Marketing Manager at TechVentures. Fee: €5,400.' },
      timestamp: '2026-03-15T14:00:00Z', read: true, link: '/demo/scout/pipeline',
    },
    {
      id: 'n-sc-6', type: 'message',
      title: { nl: 'Gesprek gepland', en: 'Interview scheduled' },
      description: { nl: 'TechVentures heeft een kennismakingsgesprek gepland met Priya Sharma op 12 maart.', en: 'TechVentures has scheduled an introductory interview with Priya Sharma on 12 March.' },
      timestamp: '2026-03-11T10:15:00Z', read: true, link: '/demo/scout/pipeline',
    },
    {
      id: 'n-sc-7', type: 'system',
      title: { nl: 'Welkom bij Refurzy', en: 'Welcome to Refurzy' },
      description: { nl: 'Je account is aangemaakt. Begin met het uitnodigen van kandidaten.', en: 'Your account has been created. Start by inviting candidates.' },
      timestamp: '2026-03-01T12:00:00Z', read: true,
    },
    {
      id: 'n-sc-8', type: 'match',
      title: { nl: 'Kandidaat voorgedragen', en: 'Candidate nominated' },
      description: { nl: 'Je hebt Jamal Usan voorgedragen voor Marketing Manager. Status: voorgesteld.', en: 'You have nominated Jamal Usan for Marketing Manager. Status: proposed.' },
      timestamp: '2026-03-08T16:30:00Z', read: true, link: '/demo/scout/pipeline',
    },
    {
      id: 'n-sc-9', type: 'vacancy',
      title: { nl: 'Vacature verloopt', en: 'Vacancy expiring' },
      description: { nl: 'HR Business Partner bij GreenLogistics verloopt over 4 weken.', en: 'HR Business Partner at GreenLogistics expires in 4 weeks.' },
      timestamp: '2026-03-14T08:00:00Z', read: true, link: '/demo/scout/vacatures',
    },
    {
      id: 'n-sc-10', type: 'system',
      title: { nl: 'Pro Scout upgrade beschikbaar', en: 'Pro Scout upgrade available' },
      description: { nl: 'Na nog 1 succesvolle plaatsing kun je upgraden naar Pro Scout.', en: 'After 1 more successful placement you can upgrade to Pro Scout.' },
      timestamp: '2026-03-15T15:00:00Z', read: true,
    },
  ],
  kandidaat: [
    {
      id: 'n-ka-1', type: 'match',
      title: { nl: 'Voorgedragen voor vacature', en: 'Nominated for vacancy' },
      description: { nl: 'Je bent voorgedragen voor Marketing Manager bij TechVentures B.V.', en: 'You have been nominated for Marketing Manager at TechVentures B.V.' },
      timestamp: '2026-03-19T08:30:00Z', read: false, link: '/demo/kandidaat/pipeline',
    },
    {
      id: 'n-ka-2', type: 'contract',
      title: { nl: 'Gesprek gepland', en: 'Interview scheduled' },
      description: { nl: 'Er is een verdiepingsgesprek gepland bij TechVentures B.V. op 14 maart.', en: 'An in-depth interview has been scheduled at TechVentures B.V. on 14 March.' },
      timestamp: '2026-03-13T09:00:00Z', read: false, link: '/demo/kandidaat/pipeline',
    },
    {
      id: 'n-ka-3', type: 'message',
      title: { nl: 'Feedback ontvangen', en: 'Feedback received' },
      description: { nl: 'De opdrachtgever was zeer positief over het kennismakingsgesprek.', en: 'The client was very positive about the introductory interview.' },
      timestamp: '2026-03-11T16:00:00Z', read: false, link: '/demo/kandidaat/pipeline',
    },
    {
      id: 'n-ka-4', type: 'contract',
      title: { nl: 'Arbeidsvoorwaarden fase', en: 'Employment terms phase' },
      description: { nl: 'Het proces voor Marketing Manager is in de arbeidsvoorwaarden fase.', en: 'The process for Marketing Manager has reached the employment terms phase.' },
      timestamp: '2026-03-15T10:30:00Z', read: true, link: '/demo/kandidaat/pipeline',
    },
    {
      id: 'n-ka-5', type: 'match',
      title: { nl: 'Voorgedragen voor vacature', en: 'Nominated for vacancy' },
      description: { nl: 'Je bent voorgedragen voor Brand Strategist bij CreativeCo.', en: 'You have been nominated for Brand Strategist at CreativeCo.' },
      timestamp: '2026-03-12T14:00:00Z', read: true, link: '/demo/kandidaat/pipeline',
    },
    {
      id: 'n-ka-6', type: 'system',
      title: { nl: 'Matching Scan resultaat', en: 'Matching Scan result' },
      description: { nl: 'Je M-Score is berekend: 87%. Dit kwalificeert voor de Fit Garantie.', en: 'Your M-Score has been calculated: 87%. This qualifies for the Fit Guarantee.' },
      timestamp: '2026-03-07T11:00:00Z', read: true, link: '/demo/kandidaat/scan',
    },
    {
      id: 'n-ka-7', type: 'system',
      title: { nl: 'Welkom bij Refurzy', en: 'Welcome to Refurzy' },
      description: { nl: 'Je account is aangemaakt door Sophie de Graaf. Vul je Matching Scan in.', en: 'Your account has been created by Sophie de Graaf. Please complete your Matching Scan.' },
      timestamp: '2026-03-06T09:00:00Z', read: true,
    },
    {
      id: 'n-ka-8', type: 'message',
      title: { nl: 'Gesprek herinnering', en: 'Interview reminder' },
      description: { nl: 'Morgen om 10:00 heb je een kennismakingsgesprek bij TechVentures B.V.', en: 'Tomorrow at 10:00 you have an introductory interview at TechVentures B.V.' },
      timestamp: '2026-03-09T08:00:00Z', read: true, link: '/demo/kandidaat/pipeline',
    },
  ],
  admin: [
    {
      id: 'n-ad-1', type: 'system',
      title: { nl: 'Escalatie melding', en: 'Escalation notice' },
      description: { nl: 'Scout Sophie de Graaf rapporteert: geen reactie van TechVentures op voordracht Thomas van Dijk.', en: 'Scout Sophie de Graaf reports: no response from TechVentures regarding nomination of Thomas van Dijk.' },
      timestamp: '2026-03-19T11:00:00Z', read: false,
    },
    {
      id: 'n-ad-2', type: 'contract',
      title: { nl: 'Contract getekend', en: 'Contract signed' },
      description: { nl: 'Anna de Jong aangenomen als Marketing Manager bij TechVentures. Fee: €10.800.', en: 'Anna de Jong hired as Marketing Manager at TechVentures. Fee: €10,800.' },
      timestamp: '2026-03-18T14:00:00Z', read: false,
    },
    {
      id: 'n-ad-3', type: 'system',
      title: { nl: 'Nieuwe registratie', en: 'New registration' },
      description: { nl: 'Nieuw bedrijf geregistreerd: MedTech Solutions (KVK: 99887766).', en: 'New company registered: MedTech Solutions (Chamber of Commerce: 99887766).' },
      timestamp: '2026-03-17T09:15:00Z', read: false, link: '/demo/admin/gebruikers',
    },
    {
      id: 'n-ad-4', type: 'match',
      title: { nl: 'KVK duplicaat verzoek', en: 'Duplicate company registration request' },
      description: { nl: 'Iemand heeft een toegangsverzoek gestuurd voor TechVentures B.V. (KVK: 12345678).', en: 'Someone has sent an access request for TechVentures B.V. (CoC: 12345678).' },
      timestamp: '2026-03-16T13:00:00Z', read: true, link: '/demo/admin/gebruikers',
    },
    {
      id: 'n-ad-5', type: 'vacancy',
      title: { nl: 'Nieuwe vacature', en: 'New vacancy' },
      description: { nl: 'Financial Controller aangemaakt door MedTech Solutions.', en: 'Financial Controller created by MedTech Solutions.' },
      timestamp: '2026-03-12T10:00:00Z', read: true,
    },
    {
      id: 'n-ad-6', type: 'system',
      title: { nl: 'VU scan gebruik rapport', en: 'VU scan usage report' },
      description: { nl: 'Maandelijks overzicht: 23 scans afgenomen in februari, waarvan 3 test.', en: 'Monthly overview: 23 scans taken in February, of which 3 were tests.' },
      timestamp: '2026-03-01T08:00:00Z', read: true, link: '/demo/admin/scan-gebruik',
    },
    {
      id: 'n-ad-7', type: 'contract',
      title: { nl: 'Uitbetaling verwerkt', en: 'Payout processed' },
      description: { nl: 'Scout fee van €5.400 uitbetaald aan Sophie de Graaf.', en: 'Scout fee of €5,400 paid out to Sophie de Graaf.' },
      timestamp: '2026-03-16T16:00:00Z', read: true, link: '/demo/admin/uitbetalingen',
    },
    {
      id: 'n-ad-8', type: 'system',
      title: { nl: 'Pro Scout upgrade', en: 'Pro Scout upgrade' },
      description: { nl: 'Sophie de Graaf heeft 2 plaatsingen bereikt. Pro Scout upgrade vereist.', en: 'Sophie de Graaf has reached 2 placements. Pro Scout upgrade required.' },
      timestamp: '2026-03-15T15:30:00Z', read: true, link: '/demo/admin/gebruikers',
    },
    {
      id: 'n-ad-9', type: 'vacancy',
      title: { nl: 'Vacature verlopen', en: 'Vacancy expired' },
      description: { nl: 'Data Analyst bij StartupCo is verlopen zonder plaatsing.', en: 'Data Analyst at StartupCo has expired without a placement.' },
      timestamp: '2026-03-10T08:00:00Z', read: true,
    },
    {
      id: 'n-ad-10', type: 'system',
      title: { nl: 'Systeem update', en: 'System update' },
      description: { nl: 'Pricing matrix bijgewerkt voor Duitsland en Belgie.', en: 'Pricing matrix updated for Germany and Belgium.' },
      timestamp: '2026-03-05T14:00:00Z', read: true, link: '/demo/admin/landen',
    },
  ],
}
