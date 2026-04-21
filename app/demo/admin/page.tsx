'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'

// ─── Translations ────────────────────────────────────────────────────────────

const texts = {
  nl: {
    title: 'Refurzy Admin Dashboard',
    subtitle: 'Platform overzicht en beheer',
    stats: [
      { label: 'Actieve vacatures', sub: '+3 deze week' },
      { label: 'Plaatsingen deze maand', sub: '↑ vs. vorige maand (2)' },
      { label: 'Omzet deze maand', sub: 'excl. BTW' },
      { label: 'Actieve scouts', sub: '12 Pro Scouts' },
      { label: 'Actieve opdrachtgevers', sub: '3 nieuwe deze maand' },
      { label: 'Openstaande escalaties', sub: 'actie vereist' },
    ],
    omzetMaanden: ['Okt', 'Nov', 'Dec', 'Jan', 'Feb', 'Mrt'],
    activiteiten: [
      { tekst: 'Scout Jan de Vries heeft kandidaat voorgedragen voor Marketing Manager', tijd: '2u geleden' },
      { tekst: 'Contract getekend: Lisa Jansen bij TechCorp', tijd: '5u geleden' },
      { tekst: 'Escalatie: Opdrachtgever reageert niet op nudges', tijd: '1d geleden' },
      { tekst: 'Nieuwe opdrachtgever: GreenLogistics B.V. geregistreerd', tijd: '1d geleden' },
      { tekst: 'Pro Scout upgrade: Sophie de Graaf heeft KVK ingevuld', tijd: '2d geleden' },
      { tekst: 'Matching Scan afgenomen voor vacature HR Business Partner', tijd: '2d geleden' },
      { tekst: 'Factuur RF-2026-003 betaald door MedTech Solutions', tijd: '3d geleden' },
      { tekst: 'Scout Mark Jansen heeft 2 kandidaten uitgenodigd', tijd: '3d geleden' },
    ],
    escalatiesHeaders: ['Opdrachtgever', 'Vacature', 'Scout', 'Nudges verstuurd', 'Laatste nudge', 'Actie'],
    belKnop: 'Bel opdrachtgever',
    fitHeaders: ['Kandidaat', 'Opdrachtgever', 'Plaatsingsdatum', 'Claim datum', 'Reden', 'Status'],
    fitStatus: {
      in_behandeling: 'In behandeling',
      goedgekeurd: 'Goedgekeurd',
      afgewezen: 'Afgewezen',
    },
    fitReden: {
      'Culturele mismatch': 'Culturele mismatch',
      'Waarden mismatch': 'Waarden mismatch',
    },
    sectionOmzet: 'Omzet overzicht',
    sectionActiviteit: 'Recente activiteit',
    sectionEscalaties: 'Escalaties',
    sectionFit: 'Fit Garantie claims',
    sectionSnelkoppelingen: 'Snelkoppelingen',
    snelkoppelingen: [
      { label: 'Uitbetalingen', href: '/demo/admin/uitbetalingen', icon: '🏦' },
      { label: 'Facturen', href: '/demo/admin/facturen', icon: '🧾' },
      { label: 'VU Test Log', href: '/demo/admin/scan-gebruik', icon: '🎓' },
      { label: 'Email Templates', href: '/demo/admin/email-templates', icon: '✉️' },
      { label: 'Gebruikersbeheer', href: '/demo/admin/gebruikers', icon: '👥' },
    ],
  },
  en: {
    title: 'Refurzy Admin Dashboard',
    subtitle: 'Platform overview and management',
    stats: [
      { label: 'Active vacancies', sub: '+3 this week' },
      { label: 'Placements this month', sub: '↑ vs. last month (2)' },
      { label: 'Revenue this month', sub: 'excl. VAT' },
      { label: 'Active scouts', sub: '12 Pro Scouts' },
      { label: 'Active employers', sub: '3 new this month' },
      { label: 'Open escalations', sub: 'action required' },
    ],
    omzetMaanden: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    activiteiten: [
      { tekst: 'Scout Jan de Vries nominated a candidate for Marketing Manager', tijd: '2h ago' },
      { tekst: 'Contract signed: Lisa Jansen at TechCorp', tijd: '5h ago' },
      { tekst: 'Escalation: Employer not responding to nudges', tijd: '1d ago' },
      { tekst: 'New employer: GreenLogistics B.V. registered', tijd: '1d ago' },
      { tekst: 'Pro Scout upgrade: Sophie de Graaf completed KVK verification', tijd: '2d ago' },
      { tekst: 'Matching Scan taken for vacancy HR Business Partner', tijd: '2d ago' },
      { tekst: 'Invoice RF-2026-003 paid by MedTech Solutions', tijd: '3d ago' },
      { tekst: 'Scout Mark Jansen invited 2 candidates', tijd: '3d ago' },
    ],
    escalatiesHeaders: ['Employer', 'Vacancy', 'Scout', 'Nudges sent', 'Last nudge', 'Action'],
    belKnop: 'Call employer',
    fitHeaders: ['Candidate', 'Employer', 'Placement date', 'Claim date', 'Reason', 'Status'],
    fitStatus: {
      in_behandeling: 'Under review',
      goedgekeurd: 'Approved',
      afgewezen: 'Rejected',
    },
    fitReden: {
      'Culturele mismatch': 'Cultural mismatch',
      'Waarden mismatch': 'Values mismatch',
    },
    sectionOmzet: 'Revenue overview',
    sectionActiviteit: 'Recent activity',
    sectionEscalaties: 'Escalations',
    sectionFit: 'Fit Guarantee claims',
    sectionSnelkoppelingen: 'Quick links',
    snelkoppelingen: [
      { label: 'Payouts', href: '/demo/admin/uitbetalingen', icon: '🏦' },
      { label: 'Invoices', href: '/demo/admin/facturen', icon: '🧾' },
      { label: 'VU Test Log', href: '/demo/admin/scan-gebruik', icon: '🎓' },
      { label: 'Email Templates', href: '/demo/admin/email-templates', icon: '✉️' },
      { label: 'User management', href: '/demo/admin/gebruikers', icon: '👥' },
    ],
  },
}

// ─── Static mock data (non-translated) ──────────────────────────────────────

const statsValues = [23, 4, '€28.800', 47, 12, 2]
const statsIcons = ['📋', '🎯', '💰', '🔍', '🏢', '🚨']

const omzetData = [
  { omzet: 18200, max: 32000 },
  { omzet: 22400, max: 32000 },
  { omzet: 14800, max: 32000 },
  { omzet: 31200, max: 32000 },
  { omzet: 24600, max: 32000 },
  { omzet: 28800, max: 32000 },
]

const escalaties = [
  { opdrachtgever: 'FinanceFirst B.V.', vacature: 'Senior Accountant', scout: 'Mark Jansen', nudgesVerstuurd: 3, laatsteNudge: '2026-03-15' },
  { opdrachtgever: 'RetailPlus', vacature: 'Store Manager', scout: 'Sophie de Graaf', nudgesVerstuurd: 2, laatsteNudge: '2026-03-17' },
]

const fitGarantieClaims: Array<{
  kandidaat: string
  opdrachtgever: string
  plaatsingsdatum: string
  claimDatum: string
  reden: string
  status: 'in_behandeling' | 'goedgekeurd' | 'afgewezen'
}> = [
  { kandidaat: 'Sanne Visser', opdrachtgever: 'TechVentures B.V.', plaatsingsdatum: '2025-06-20', claimDatum: '2026-02-10', reden: 'Culturele mismatch', status: 'in_behandeling' },
  { kandidaat: 'Tom Hendriks', opdrachtgever: 'DataDrive B.V.', plaatsingsdatum: '2025-09-01', claimDatum: '2026-03-01', reden: 'Waarden mismatch', status: 'goedgekeurd' },
]

const activiteitIcons = ['📋', '🎉', '🚨', '🏢', '🏅', '🧪', '💰', '✉️']

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { lang } = useLang()
  const t = texts[lang]
  const locale = lang === 'nl' ? 'nl-NL' : 'en-GB'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.title}</h1>
        <p className="text-ink-light font-medium mt-1">{t.subtitle}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {t.stats.map((stat, i) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-surface-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{statsIcons[i]}</span>
              <span className="text-ink-muted text-xs font-medium">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-ink">{statsValues[i]}</div>
            <div className="text-xs text-ink-muted mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Omzet overzicht */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
            <span className="text-xl">💰</span> {t.sectionOmzet}
          </h2>
          <div className="flex items-end gap-3 h-48">
            {omzetData.map((m, i) => {
              const heightPercent = (m.omzet / 32000) * 100
              return (
                <div key={t.omzetMaanden[i]} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[10px] text-ink font-semibold mb-1">€{(m.omzet / 1000).toFixed(1)}k</span>
                  <div className="w-full bg-surface-muted rounded-t-lg relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple to-cyan rounded-t-lg transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-muted mt-2">{t.omzetMaanden[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recente activiteit */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
            <span className="text-xl">📢</span> {t.sectionActiviteit}
          </h2>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
            {t.activiteiten.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-surface-border/50 last:border-0">
                <span className="text-base flex-shrink-0 mt-0.5">{activiteitIcons[i]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink leading-relaxed">{a.tekst}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{a.tijd}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Escalaties */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
          <span className="text-xl">🚨</span> {t.sectionEscalaties}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {t.escalatiesHeaders.map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {escalaties.map((e, i) => (
                <tr key={i} className="border-b border-surface-border/50 last:border-0">
                  <td className="py-3 px-2 text-ink font-medium">{e.opdrachtgever}</td>
                  <td className="py-3 px-2 text-ink-light">{e.vacature}</td>
                  <td className="py-3 px-2 text-ink-light">{e.scout}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      e.nudgesVerstuurd >= 3 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange/10 text-orange border border-orange/30'
                    }`}>
                      {e.nudgesVerstuurd}x
                    </span>
                  </td>
                  <td className="py-3 px-2 text-ink-light">{new Date(e.laatsteNudge).toLocaleDateString(locale)}</td>
                  <td className="py-3 px-2">
                    <button className="bg-cyan text-navy-dark px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-cyan-light transition-colors">
                      {t.belKnop}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fit Garantie claims */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
          <span className="text-xl">🛡️</span> {t.sectionFit}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {t.fitHeaders.map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fitGarantieClaims.map((c, i) => (
                <tr key={i} className="border-b border-surface-border/50 last:border-0">
                  <td className="py-3 px-2 text-ink font-medium">{c.kandidaat}</td>
                  <td className="py-3 px-2 text-ink-light">{c.opdrachtgever}</td>
                  <td className="py-3 px-2 text-ink-light">{new Date(c.plaatsingsdatum).toLocaleDateString(locale)}</td>
                  <td className="py-3 px-2 text-ink-light">{new Date(c.claimDatum).toLocaleDateString(locale)}</td>
                  <td className="py-3 px-2 text-ink-light">{t.fitReden[c.reden as keyof typeof t.fitReden] ?? c.reden}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.status === 'goedgekeurd'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : c.status === 'afgewezen'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-orange/10 text-orange border border-orange/30'
                    }`}>
                      {t.fitStatus[c.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snelkoppelingen */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
          <span className="text-xl">🔗</span> {t.sectionSnelkoppelingen}
        </h2>
        <div className="flex flex-wrap gap-3">
          {t.snelkoppelingen.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="flex items-center gap-2 bg-surface-muted hover:bg-surface-border text-ink px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-surface-border hover:border-purple/20"
            >
              <span>{s.icon}</span>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
