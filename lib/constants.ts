// ─── Vakgebieden (professional fields) ────────────────────────────────────────
export const VAKGEBIEDEN = [
  'Accountancy & Finance',
  'Administratie',
  'Bouw & Civiele Techniek',
  'Communicatie & PR',
  'Customer Service',
  'Data & Analytics',
  'Design & Creative',
  'Facilitair & Services',
  'HR & Recruitment',
  'ICT & Development',
  'Inkoop & Supply Chain',
  'Juridisch',
  'Logistiek & Transport',
  'Management & Directie',
  'Marketing & E-commerce',
  'Onderwijs & Training',
  'Operations',
  'Productie & Techniek',
  'Sales & Business Development',
  'Zorg & Welzijn',
  'Overig',
] as const

export type Vakgebied = (typeof VAKGEBIEDEN)[number]

// ─── Landen (countries) ──────────────────────────────────────────────────────
export const LANDEN = [
  'Nederland',
  'België',
  'Duitsland',
  'Verenigd Koninkrijk',
  'Frankrijk',
  'Spanje',
  'Italië',
  'Zwitserland',
  'Oostenrijk',
  'Ierland',
  'Luxemburg',
  'Zweden',
  'Noorwegen',
  'Denemarken',
  'Finland',
  'Polen',
  'Portugal',
  'Anders',
] as const

export type Land = (typeof LANDEN)[number]

// ─── Talen (languages) ─────────────────────────────────────────────────────
export const TALEN = [
  'Nederlands',
  'Engels',
  'Duits',
  'Frans',
  'Spaans',
  'Italiaans',
  'Portugees',
  'Pools',
  'Turks',
  'Arabisch',
  'Mandarijn',
  'Japans',
  'Russisch',
  'Anders',
] as const

export type Taal = (typeof TALEN)[number]

// ─── Taalniveaus (CEFR/ERK levels) ──────────────────────────────────────────
export const TAALNIVEAUS = ['A2', 'B1', 'B2', 'C1', 'C2'] as const
export type Taalniveau = (typeof TAALNIVEAUS)[number]

export const TAALNIVEAU_LABELS: Record<Taalniveau, string> = {
  A2: 'Basis',
  B1: 'Redelijk',
  B2: 'Goed',
  C1: 'Uitstekend',
  C2: 'Moedertaal / Near-native',
}

// Numeric value for comparison (higher = better)
export const TAALNIVEAU_WAARDE: Record<Taalniveau, number> = {
  A2: 1,
  B1: 2,
  B2: 3,
  C1: 4,
  C2: 5,
}

// ─── Op kantoor numeric mapping ─────────────────────────────────────────────
export const OP_KANTOOR_DAGEN: Record<string, number> = {
  'Op kantoor (5 dagen)': 5,
  'Hybride (3 dagen)': 3,
  'Hybride (2 dagen)': 2,
  'Volledig remote': 0,
}

// ─── Reistijd numeric mapping (minutes) ─────────────────────────────────────
export const REISTIJD_MINUTEN: Record<string, number> = {
  '15 minuten': 15,
  '30 minuten': 30,
  '45 minuten': 45,
  '60 minuten': 60,
  'Niet van toepassing': 999,
}

// ─── Ervaring numeric mapping ───────────────────────────────────────────────
export const ERVARING_MINIMUM: Record<string, number> = {
  '0-2': 0,
  '0-2 jaar': 0,
  '2-5': 2,
  '2-5 jaar': 2,
  '5-10': 5,
  '5-10 jaar': 5,
  '10+': 10,
  '10+ jaar': 10,
}

// ─── Opleiding numeric mapping ──────────────────────────────────────────────
export const OPLEIDING_NIVEAU: Record<string, number> = {
  'MBO': 1,
  'HBO': 2,
  'WO': 3,
}
