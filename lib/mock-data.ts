import { Vacature, Kandidaat, Sollicitatie } from './types'

export const vacatures: Vacature[] = [
  {
    id: 'vac-1',
    title: 'Marketing Manager',
    company: 'TechVentures B.V.',
    location: 'Amsterdam',
    salaris: '€4.500 - €6.000',
    deadline: '2026-04-15',
    status: 'open',
    createdAt: '2026-03-01',
    pmsCompleted: true,
    hardeCriteria: {
      opleidingsniveau: 'HBO',
      minimaleErvaring: '5-10 jaar',
      locatie: 'Amsterdam',
      opKantoor: 'Hybride (3 dagen)',
      maxReistijd: '45 minuten',
    },
    kandidaten: [
      {
        id: 'k-1', naam: 'Anna de Jong', initialen: 'A', anoniem: false,
        hardeCriteriaMatch: 100, hardeCriteriaIcon: 'check',
        deVriesFit: 87, scoutRating: 4.9, scoutNaam: 'Sophie de Graaf',
        status: 'aanbevolen', procesStatus: 'nieuw', unlocked: true,
        opleidingsniveau: 'WO', werkervaring: '8 jaar', woonplaats: 'Amsterdam',
        email: 'anna.dejong@email.nl', telefoon: '06-12345678',
      },
      {
        id: 'k-2', naam: 'Jamal Usan', initialen: 'M', anoniem: true,
        hardeCriteriaMatch: 92, hardeCriteriaIcon: 'check',
        deVriesFit: 71, scoutRating: 4.1, scoutNaam: 'Sophie de Graaf',
        status: 'bekijk', procesStatus: 'nieuw', unlocked: false,
        opleidingsniveau: 'HBO', werkervaring: '6 jaar', woonplaats: 'Utrecht',
      },
      {
        id: 'k-3', naam: 'Lisa Brouwer', initialen: 'L', anoniem: true,
        hardeCriteriaMatch: 76, hardeCriteriaIcon: 'warning',
        deVriesFit: 53, scoutRating: 3.2, scoutNaam: 'Mark Jansen',
        status: 'overweeg', procesStatus: 'nieuw', unlocked: false,
        opleidingsniveau: 'HBO', werkervaring: '4 jaar', woonplaats: 'Den Haag',
      },
    ],
  },
  {
    id: 'vac-2',
    title: 'Senior Software Developer',
    company: 'TechVentures B.V.',
    location: 'Amsterdam / Remote',
    salaris: '€5.500 - €7.500',
    deadline: '2026-04-30',
    status: 'open',
    createdAt: '2026-03-10',
    pmsCompleted: true,
    hardeCriteria: {
      opleidingsniveau: 'HBO',
      minimaleErvaring: '5-10 jaar',
      locatie: 'Amsterdam / Remote',
      opKantoor: 'Hybride (2 dagen)',
      maxReistijd: '60 minuten',
    },
    kandidaten: [
      {
        id: 'k-4', naam: 'Thomas van Dijk', initialen: 'T', anoniem: true,
        hardeCriteriaMatch: 95, hardeCriteriaIcon: 'check',
        deVriesFit: 82, scoutRating: 4.5, scoutNaam: 'Sophie de Graaf',
        status: 'aanbevolen', procesStatus: 'kennismaking', unlocked: false,
        opleidingsniveau: 'WO', werkervaring: '10 jaar', woonplaats: 'Amsterdam',
      },
      {
        id: 'k-5', naam: 'Priya Sharma', initialen: 'P', anoniem: true,
        hardeCriteriaMatch: 88, hardeCriteriaIcon: 'check',
        deVriesFit: 68, scoutRating: 3.8, scoutNaam: 'Mark Jansen',
        status: 'bekijk', procesStatus: 'nieuw', unlocked: false,
        opleidingsniveau: 'HBO', werkervaring: '7 jaar', woonplaats: 'Rotterdam',
      },
    ],
  },
]

export const allVacatures: Vacature[] = [
  ...vacatures,
  {
    id: 'vac-3',
    title: 'HR Business Partner',
    company: 'GreenLogistics B.V.',
    location: 'Rotterdam',
    salaris: '€4.000 - €5.500',
    deadline: '2026-04-20',
    status: 'open',
    createdAt: '2026-03-05',
    pmsCompleted: true,
    hardeCriteria: {
      opleidingsniveau: 'HBO',
      minimaleErvaring: '2-5 jaar',
      locatie: 'Rotterdam',
      opKantoor: 'Op kantoor (5 dagen)',
      maxReistijd: '30 minuten',
    },
    kandidaten: [],
  },
  {
    id: 'vac-4',
    title: 'Financial Controller',
    company: 'MedTech Solutions',
    location: 'Eindhoven',
    salaris: '€5.000 - €6.500',
    deadline: '2026-05-01',
    status: 'open',
    createdAt: '2026-03-12',
    pmsCompleted: true,
    hardeCriteria: {
      opleidingsniveau: 'WO',
      minimaleErvaring: '5-10 jaar',
      locatie: 'Eindhoven',
      opKantoor: 'Hybride (3 dagen)',
      maxReistijd: '45 minuten',
    },
    kandidaten: [],
  },
]

export const scoutKandidaten: Kandidaat[] = [
  {
    id: 'k-1', naam: 'Anna de Jong', email: 'anna.dejong@email.nl',
    telefoon: '06-12345678', woonplaats: 'Amsterdam',
    opleidingsniveau: 'WO', werkervaring: '8 jaar',
    huidigeRol: 'Marketing Lead bij CreativeAgency',
    scanCompleted: true, cvUploaded: true, scoutId: 'scout-1',
  },
  {
    id: 'k-2', naam: 'Jamal Usan', email: 'jamal.usan@email.nl',
    telefoon: '06-23456789', woonplaats: 'Utrecht',
    opleidingsniveau: 'HBO', werkervaring: '6 jaar',
    huidigeRol: 'Digital Marketing Specialist',
    scanCompleted: true, cvUploaded: true, scoutId: 'scout-1',
  },
  {
    id: 'k-4', naam: 'Thomas van Dijk', email: 'thomas.vdijk@email.nl',
    telefoon: '06-34567890', woonplaats: 'Amsterdam',
    opleidingsniveau: 'WO', werkervaring: '10 jaar',
    huidigeRol: 'Lead Developer bij FinTechCo',
    scanCompleted: true, cvUploaded: true, scoutId: 'scout-1',
  },
  {
    id: 'k-6', naam: 'Eva Bakker', email: 'eva.bakker@email.nl',
    telefoon: '06-45678901', woonplaats: 'Haarlem',
    opleidingsniveau: 'HBO', werkervaring: '3 jaar',
    huidigeRol: 'Junior Accountant',
    scanCompleted: false, cvUploaded: true, scoutId: 'scout-1',
  },
]

export const kandidaatSollicitaties: Sollicitatie[] = [
  { id: 's-1', vacatureTitle: 'Marketing Manager', company: 'TechVentures B.V.', status: 'Aanbevolen', datum: '2026-03-08' },
  { id: 's-2', vacatureTitle: 'Brand Strategist', company: 'CreativeCo', status: 'In behandeling', datum: '2026-03-12' },
]

export function calculateFee(opleidingsniveau: string, werkervaring: string): { fee: number; scoutFee: number; refurzyFee: number } {
  const expPoints: Record<string, number> = { '0-2 jaar': 1, '2-5 jaar': 2, '5-10 jaar': 3, '>10 jaar': 4 }
  const eduPoints: Record<string, number> = { 'MBO': 1.5, 'HBO': 2, 'WO': 3 }
  const exp = expPoints[werkervaring] || 2
  const edu = eduPoints[opleidingsniveau] || 2
  const fee = exp * edu * 1200
  return { fee, scoutFee: fee * 0.5, refurzyFee: fee * 0.5 }
}
