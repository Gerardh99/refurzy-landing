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
