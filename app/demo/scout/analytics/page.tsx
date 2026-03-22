'use client'

import { scoutKandidaten } from '@/lib/mock-data'

// ─── Derived stats from mock data ───────────────────────────────────────────

const geplaatst = scoutKandidaten.filter(k => k.poolStatus === 'geplaatst')
const actief = scoutKandidaten.filter(k => k.poolStatus === 'beschikbaar' || k.poolStatus === 'in_proces')
const aantalPlaatsingen = geplaatst.length
const totaalVerdiend = geplaatst.reduce((sum, k) => sum + (k.plaatsing?.scoutFee ?? 0), 0)
const conversieRatio = scoutKandidaten.length > 0
  ? Math.round((aantalPlaatsingen / scoutKandidaten.length) * 100)
  : 0

const stats = [
  { label: 'Totaal plaatsingen', value: String(aantalPlaatsingen), trend: `${actief.length} actieve kandidaten`, trendUp: true, icon: '🎯' },
  { label: 'Gemiddelde rating', value: '4.2/5', trend: '⭐', trendUp: true, icon: '⭐' },
  { label: 'Conversieratio', value: `${conversieRatio}%`, trend: 'voorgedragen → geplaatst', trendUp: true, icon: '📈' },
  { label: 'Totaal verdiend', value: `€${totaalVerdiend.toLocaleString('nl-NL')}`, trend: '+€3.200 deze maand', trendUp: true, icon: '💰' },
]

const maandData = [
  { maand: 'Okt', plaatsingen: 1, max: 3 },
  { maand: 'Nov', plaatsingen: 0, max: 3 },
  { maand: 'Dec', plaatsingen: 2, max: 3 },
  { maand: 'Jan', plaatsingen: 1, max: 3 },
  { maand: 'Feb', plaatsingen: 1, max: 3 },
  { maand: 'Mrt', plaatsingen: 2, max: 3 },
]

const reviews = [
  { opdrachtgever: 'Anoniem (Technologie)', vacature: 'Marketing Manager', sterren: 5, datum: '2026-03-10', tekst: 'Uitstekende kandidaat aangeleverd. Snelle communicatie.' },
  { opdrachtgever: 'Anoniem (Finance)', vacature: 'Financial Controller', sterren: 4, datum: '2026-02-20', tekst: 'Goede match, kandidaat paste goed bij het team.' },
  { opdrachtgever: 'Anoniem (Logistiek)', vacature: 'HR Business Partner', sterren: 4, datum: '2026-01-15', tekst: 'Professionele aanpak. Kandidaat had iets meer ervaring mogen hebben.' },
  { opdrachtgever: 'Anoniem (Retail)', vacature: 'Brand Strategist', sterren: 3, datum: '2025-12-08', tekst: 'Redelijke match. Communicatie kon beter.' },
]

const vakgebieden = [
  { naam: 'Marketing', percentage: 45, kleur: 'bg-cyan' },
  { naam: 'IT', percentage: 30, kleur: 'bg-purple' },
  { naam: 'Finance', percentage: 25, kleur: 'bg-orange' },
]

const gemiddeldeRating = (reviews.reduce((sum, r) => sum + r.sterren, 0) / reviews.length).toFixed(1)

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ScoutAnalyticsPage() {
  const plaatsingenNodig = 2
  const plaatsingenVoltooid = aantalPlaatsingen
  const proScoutBereikt = plaatsingenVoltooid >= plaatsingenNodig

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Analytics</h1>
        <p className="text-ink-light font-medium mt-1">Jouw prestaties en statistieken als Talent Scout</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-surface-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-ink-muted text-xs font-medium">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-ink">{stat.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {stat.trendUp && <span className="text-green-600 text-xs">&#8593;</span>}
              <span className="text-xs text-ink-muted">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prestaties per maand */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
            <span className="text-xl">📊</span> Prestaties per maand
          </h2>
          <div className="flex items-end gap-4 h-48">
            {maandData.map((m) => {
              const heightPercent = m.max > 0 ? (m.plaatsingen / 3) * 100 : 0
              return (
                <div key={m.maand} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-xs text-ink font-semibold mb-1">{m.plaatsingen}</span>
                  <div className="w-full bg-surface-muted rounded-t-lg relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple to-cyan rounded-t-lg transition-all"
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-muted mt-2">{m.maand}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top vakgebieden */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
            <span className="text-xl">🏆</span> Top vakgebieden
          </h2>
          <div className="space-y-5">
            {vakgebieden.map((v) => (
              <div key={v.naam}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-ink font-medium">{v.naam}</span>
                  <span className="text-sm text-ink font-bold">{v.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${v.kleur} rounded-full transition-all`}
                    style={{ width: `${v.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pro Scout status */}
          <div className="mt-8 pt-6 border-t border-surface-border">
            <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
              <span>🏅</span> Pro Scout status
            </h3>
            {proScoutBereikt ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="text-green-600 text-sm font-bold flex-shrink-0">&#10003;</span>
                </div>
                <p className="text-xs text-green-700 font-semibold">{plaatsingenVoltooid} van {plaatsingenNodig} plaatsingen voltooid &mdash; Pro Scout bereikt!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange rounded-full" style={{ width: `${(plaatsingenVoltooid / plaatsingenNodig) * 100}%` }} />
                </div>
                <p className="text-xs text-ink-muted">{plaatsingenVoltooid} van {plaatsingenNodig} plaatsingen &mdash; Nog {plaatsingenNodig - plaatsingenVoltooid} plaatsing tot Pro Scout</p>
              </div>
            )}
            <div className="mt-3 space-y-1.5">
              <p className="text-xs text-ink-muted font-medium">Voordelen Pro Scout:</p>
              <ul className="text-xs text-ink-muted space-y-1 ml-3">
                <li>&#8226; Hogere uitbetaling (geen loonheffing)</li>
                <li>&#8226; Onbeperkt scouten</li>
                <li>&#8226; Pro Scout badge</li>
                <li>&#8226; Wereldwijd werken</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recente reviews */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
            <span className="text-xl">💬</span> Recente reviews
          </h2>
          <div className="flex items-center gap-2 bg-surface-muted px-3 py-1.5 rounded-lg">
            <span className="text-sm text-ink-muted">Gemiddeld:</span>
            <span className="text-sm font-bold text-ink">{gemiddeldeRating}</span>
            <span className="text-yellow-500">&#9733;</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="bg-surface-muted rounded-xl p-4 border border-surface-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-ink-muted">{r.opdrachtgever}</span>
                <span className="text-xs text-ink-muted">{new Date(r.datum).toLocaleDateString('nl-NL')}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={j < r.sterren ? 'text-yellow-500' : 'text-surface-border'}>
                    &#9733;
                  </span>
                ))}
              </div>
              <p className="text-xs text-ink-light font-medium mb-1">{r.vacature}</p>
              <p className="text-xs text-ink-muted">{r.tekst}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
