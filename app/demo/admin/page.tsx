'use client'

import Link from 'next/link'

// ─── Mock data ──────────────────────────────────────────────────────────────

const stats = [
  { label: 'Actieve vacatures', value: 23, icon: '📋', sub: '+3 deze week' },
  { label: 'Plaatsingen deze maand', value: 4, icon: '🎯', sub: '↑ vs. vorige maand (2)' },
  { label: 'Omzet deze maand', value: '€28.800', icon: '💰', sub: 'excl. BTW' },
  { label: 'Actieve scouts', value: 47, icon: '🔍', sub: '12 Pro Scouts' },
  { label: 'Actieve opdrachtgevers', value: 12, icon: '🏢', sub: '3 nieuwe deze maand' },
  { label: 'Openstaande escalaties', value: 2, icon: '🚨', sub: 'actie vereist' },
]

const omzetData = [
  { maand: 'Okt', omzet: 18200, max: 32000 },
  { maand: 'Nov', omzet: 22400, max: 32000 },
  { maand: 'Dec', omzet: 14800, max: 32000 },
  { maand: 'Jan', omzet: 31200, max: 32000 },
  { maand: 'Feb', omzet: 24600, max: 32000 },
  { maand: 'Mrt', omzet: 28800, max: 32000 },
]

const activiteiten = [
  { tekst: 'Scout Jan de Vries heeft kandidaat voorgedragen voor Marketing Manager', tijd: '2u geleden', icon: '📋' },
  { tekst: 'Contract getekend: Lisa Jansen bij TechCorp', tijd: '5u geleden', icon: '🎉' },
  { tekst: 'Escalatie: Opdrachtgever reageert niet op nudges', tijd: '1d geleden', icon: '🚨' },
  { tekst: 'Nieuwe opdrachtgever: GreenLogistics B.V. geregistreerd', tijd: '1d geleden', icon: '🏢' },
  { tekst: 'Pro Scout upgrade: Sophie de Graaf heeft KVK ingevuld', tijd: '2d geleden', icon: '🏅' },
  { tekst: 'Matching Scan afgenomen voor vacature HR Business Partner', tijd: '2d geleden', icon: '🧪' },
  { tekst: 'Factuur RF-2026-003 betaald door MedTech Solutions', tijd: '3d geleden', icon: '💰' },
  { tekst: 'Scout Mark Jansen heeft 2 kandidaten uitgenodigd', tijd: '3d geleden', icon: '✉️' },
]

const escalaties = [
  { opdrachtgever: 'FinanceFirst B.V.', vacature: 'Senior Accountant', scout: 'Mark Jansen', nudgesVerstuurd: 3, laatsteNudge: '2026-03-15', },
  { opdrachtgever: 'RetailPlus', vacature: 'Store Manager', scout: 'Sophie de Graaf', nudgesVerstuurd: 2, laatsteNudge: '2026-03-17', },
]

const fitGarantieClaims: Array<{ kandidaat: string; opdrachtgever: string; plaatsingsdatum: string; claimDatum: string; reden: string; status: 'in_behandeling' | 'goedgekeurd' | 'afgewezen' }> = [
  { kandidaat: 'Sanne Visser', opdrachtgever: 'TechVentures B.V.', plaatsingsdatum: '2025-06-20', claimDatum: '2026-02-10', reden: 'Culturele mismatch', status: 'in_behandeling' },
  { kandidaat: 'Tom Hendriks', opdrachtgever: 'DataDrive B.V.', plaatsingsdatum: '2025-09-01', claimDatum: '2026-03-01', reden: 'Waarden mismatch', status: 'goedgekeurd' },
]

const snelkoppelingen = [
  { label: 'Uitbetalingen', href: '/demo/admin/uitbetalingen', icon: '🏦' },
  { label: 'Facturen', href: '/demo/admin/facturen', icon: '🧾' },
  { label: 'VU Test Log', href: '/demo/admin/scan-gebruik', icon: '🎓' },
  { label: 'Email Templates', href: '/demo/admin/email-templates', icon: '✉️' },
  { label: 'Gebruikersbeheer', href: '/demo/admin/gebruikers', icon: '👥' },
]

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Refurzy Admin Dashboard</h1>
        <p className="text-ink-light mt-1">Platform overzicht en beheer</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-surface-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-ink-muted text-xs font-medium">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-ink">{stat.value}</div>
            <div className="text-xs text-ink-faint mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Omzet overzicht */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
            <span className="text-xl">💰</span> Omzet overzicht
          </h2>
          <div className="flex items-end gap-3 h-48">
            {omzetData.map((m) => {
              const heightPercent = (m.omzet / 32000) * 100
              return (
                <div key={m.maand} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[10px] text-ink font-semibold mb-1">€{(m.omzet / 1000).toFixed(1)}k</span>
                  <div className="w-full bg-surface-muted rounded-t-lg relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple to-cyan rounded-t-lg transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-muted mt-2">{m.maand}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recente activiteit */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
            <span className="text-xl">📢</span> Recente activiteit
          </h2>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
            {activiteiten.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-surface-border/50 last:border-0">
                <span className="text-base flex-shrink-0 mt-0.5">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink leading-relaxed">{a.tekst}</p>
                  <p className="text-xs text-ink-faint mt-0.5">{a.tijd}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Escalaties */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
          <span className="text-xl">🚨</span> Escalaties
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Opdrachtgever</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Vacature</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Scout</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Nudges verstuurd</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Laatste nudge</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Actie</th>
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
                  <td className="py-3 px-2 text-ink-light">{new Date(e.laatsteNudge).toLocaleDateString('nl-NL')}</td>
                  <td className="py-3 px-2">
                    <button className="bg-cyan text-navy-dark px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-cyan-light transition-colors">
                      Bel opdrachtgever
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
          <span className="text-xl">🛡️</span> Fit Garantie claims
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Kandidaat</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Opdrachtgever</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Plaatsingsdatum</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Claim datum</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Reden</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {fitGarantieClaims.map((c, i) => (
                <tr key={i} className="border-b border-surface-border/50 last:border-0">
                  <td className="py-3 px-2 text-ink font-medium">{c.kandidaat}</td>
                  <td className="py-3 px-2 text-ink-light">{c.opdrachtgever}</td>
                  <td className="py-3 px-2 text-ink-light">{new Date(c.plaatsingsdatum).toLocaleDateString('nl-NL')}</td>
                  <td className="py-3 px-2 text-ink-light">{new Date(c.claimDatum).toLocaleDateString('nl-NL')}</td>
                  <td className="py-3 px-2 text-ink-light">{c.reden}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.status === 'goedgekeurd'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : c.status === 'afgewezen'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-orange/10 text-orange border border-orange/30'
                    }`}>
                      {c.status === 'in_behandeling' ? 'In behandeling' : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
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
          <span className="text-xl">🔗</span> Snelkoppelingen
        </h2>
        <div className="flex flex-wrap gap-3">
          {snelkoppelingen.map((s) => (
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
