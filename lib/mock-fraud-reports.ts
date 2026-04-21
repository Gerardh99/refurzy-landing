export type FraudType =
  | 'buiten_platform'
  | 'cv_fraude'
  | 'betalingsfraude'
  | 'identiteitsfraude'
  | 'overig'

export type FraudReportStatus = 'nieuw' | 'in_behandeling' | 'gesloten'

export interface FraudReport {
  id: string
  createdAt: string
  reporter: { name: string; email: string; role: 'scout' | 'opdrachtgever' }
  subject: { name: string; email: string; role: 'scout' | 'opdrachtgever' | 'kandidaat' }
  fraudType: FraudType
  description: string
  context?: string   // e.g. "Senior Developer — TechVentures B.V."
  status: FraudReportStatus
  adminNote?: string
}

const STORAGE_KEY = 'refurzy_fraud_reports'

const DEMO_REPORTS: FraudReport[] = [
  {
    id: 'fr-001',
    createdAt: '2026-04-10T09:23:00Z',
    reporter: { name: 'Lisa de Groot', email: 'scout@refurzy.com', role: 'scout' },
    subject: { name: 'Daan Verhoeven', email: 'demo@bedrijf.nl', role: 'opdrachtgever' },
    fraudType: 'buiten_platform',
    description:
      'De opdrachtgever heeft mij via LinkedIn benaderd om de kandidaat buiten het platform om te plaatsen en zo de bemiddelingsvergoeding te omzeilen. Dit is al twee keer geprobeerd.',
    context: 'Senior Full-Stack Developer — TechVentures B.V.',
    status: 'in_behandeling',
    adminNote: 'Contact opgenomen met opdrachtgever. Eerste officiële waarschuwing verstuurd op 12-04-2026.',
  },
  {
    id: 'fr-002',
    createdAt: '2026-04-14T14:05:00Z',
    reporter: { name: 'Daan Verhoeven', email: 'demo@bedrijf.nl', role: 'opdrachtgever' },
    subject: { name: 'Thomas Bakker', email: 'kandidaat@email.com', role: 'kandidaat' },
    fraudType: 'cv_fraude',
    description:
      'De kandidaat heeft een vervalst CV ingediend. De opgegeven werkervaring bij Accenture (2019–2022) kon niet worden geverifieerd. Na confrontatie gaf de kandidaat toe dat hij in die periode niet bij Accenture heeft gewerkt.',
    context: 'Data Analist — TechVentures B.V.',
    status: 'nieuw',
  },
]

export function getFraudReports(): FraudReport[] {
  if (typeof window === 'undefined') return DEMO_REPORTS
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as FraudReport[]
  } catch {
    // ignore parse errors
  }
  return DEMO_REPORTS
}

export function addFraudReport(
  report: Omit<FraudReport, 'id' | 'createdAt' | 'status'>
): FraudReport {
  const newReport: FraudReport = {
    ...report,
    id: `fr-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'nieuw',
  }
  const existing = getFraudReports()
  const updated = [newReport, ...existing]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore storage errors
  }
  return newReport
}

export function updateFraudReport(
  id: string,
  patch: Partial<Pick<FraudReport, 'status' | 'adminNote'>>
): void {
  const reports = getFraudReports()
  const updated = reports.map(r => (r.id === id ? { ...r, ...patch } : r))
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

export const fraudTypeLabels: Record<FraudType, { nl: string; en: string }> = {
  buiten_platform: {
    nl: 'Benadering buiten het platform',
    en: 'Contact outside the platform',
  },
  cv_fraude: {
    nl: 'CV-fraude (vervalste gegevens)',
    en: 'CV fraud (falsified information)',
  },
  betalingsfraude: {
    nl: 'Betalingsfraude',
    en: 'Payment fraud',
  },
  identiteitsfraude: {
    nl: 'Identiteitsfraude',
    en: 'Identity fraud',
  },
  overig: {
    nl: 'Overig',
    en: 'Other',
  },
}

export const statusLabels: Record<FraudReportStatus, { nl: string; en: string }> = {
  nieuw: { nl: 'Nieuw', en: 'New' },
  in_behandeling: { nl: 'In behandeling', en: 'Under review' },
  gesloten: { nl: 'Gesloten', en: 'Closed' },
}

export const statusColors: Record<FraudReportStatus, string> = {
  nieuw: 'bg-red-100 text-red-700 border-red-200',
  in_behandeling: 'bg-amber-100 text-amber-700 border-amber-200',
  gesloten: 'bg-green-100 text-green-700 border-green-200',
}
