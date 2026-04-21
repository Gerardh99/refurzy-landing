'use client'

import { scoutKandidaten } from '@/lib/mock-data'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    pageTitle: 'Analytics',
    pageSubtitle: 'Jouw prestaties en statistieken als Talent Scout',
    statTotalPlacements: 'Totaal plaatsingen',
    statActiveCandidates: (n: number) => `${n} actieve kandidaten`,
    statAvgRating: 'Gemiddelde rating',
    statConversionRatio: 'Conversieratio',
    statConversionTrend: 'voorgedragen → geplaatst',
    statTotalEarned: 'Totaal verdiend',
    statThisMonth: '+€3.200 deze maand',
    chartTitle: 'Prestaties per maand',
    topAreasTitle: 'Top functiegebieden',
    proScoutTitle: 'Pro Scout status',
    proScoutReached: (done: number, needed: number) => `${done} van ${needed} plaatsingen voltooid — Pro Scout bereikt!`,
    proScoutProgress: (done: number, needed: number) => `${done} van ${needed} plaatsingen — Nog ${needed - done} plaatsing tot Pro Scout`,
    proScoutBenefitsTitle: 'Voordelen Pro Scout:',
    proScoutBenefit1: 'Hogere uitbetaling (geen loonheffing)',
    proScoutBenefit2: 'Onbeperkt scouten',
    proScoutBenefit3: 'Pro Scout badge',
    proScoutBenefit4: 'Wereldwijd werken',
    reviewsTitle: 'Recente reviews',
    reviewsAverage: 'Gemiddeld:',
  },
  en: {
    pageTitle: 'Analytics',
    pageSubtitle: 'Your performance and statistics as a Talent Scout',
    statTotalPlacements: 'Total placements',
    statActiveCandidates: (n: number) => `${n} active candidates`,
    statAvgRating: 'Average rating',
    statConversionRatio: 'Conversion ratio',
    statConversionTrend: 'nominated → placed',
    statTotalEarned: 'Total earned',
    statThisMonth: '+€3,200 this month',
    chartTitle: 'Performance per month',
    topAreasTitle: 'Top function areas',
    proScoutTitle: 'Pro Scout status',
    proScoutReached: (done: number, needed: number) => `${done} of ${needed} placements completed — Pro Scout reached!`,
    proScoutProgress: (done: number, needed: number) => `${done} of ${needed} placements — ${needed - done} more placement${needed - done !== 1 ? 's' : ''} to Pro Scout`,
    proScoutBenefitsTitle: 'Pro Scout benefits:',
    proScoutBenefit1: 'Higher payout (no wage tax)',
    proScoutBenefit2: 'Unlimited scouting',
    proScoutBenefit3: 'Pro Scout badge',
    proScoutBenefit4: 'Work worldwide',
    reviewsTitle: 'Recent reviews',
    reviewsAverage: 'Average:',
  },
}

// ─── Derived stats from mock data ───────────────────────────────────────────

const geplaatst = scoutKandidaten.filter(k => k.poolStatus === 'geplaatst')
const actief = scoutKandidaten.filter(k => k.poolStatus === 'beschikbaar' || k.poolStatus === 'in_proces')
const aantalPlaatsingen = geplaatst.length
const totaalVerdiend = geplaatst.reduce((sum, k) => sum + (k.plaatsing?.scoutFee ?? 0), 0)
const conversieRatio = scoutKandidaten.length > 0
  ? Math.round((aantalPlaatsingen / scoutKandidaten.length) * 100)
  : 0

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
  const { lang } = useLang()
  const t = texts[lang]

  const stats = [
    { label: t.statTotalPlacements, value: String(aantalPlaatsingen), trend: t.statActiveCandidates(actief.length), trendUp: true, icon: '🎯' },
    { label: t.statAvgRating, value: '4.2/5', trend: '⭐', trendUp: true, icon: '⭐' },
    { label: t.statConversionRatio, value: `${conversieRatio}%`, trend: t.statConversionTrend, trendUp: true, icon: '📈' },
    { label: t.statTotalEarned, value: `€${totaalVerdiend.toLocaleString('nl-NL')}`, trend: t.statThisMonth, trendUp: true, icon: '💰' },
  ]

  const plaatsingenNodig = 2
  const plaatsingenVoltooid = aantalPlaatsingen
  const proScoutBereikt = plaatsingenVoltooid >= plaatsingenNodig

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.pageSubtitle}</p>
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
            <span className="text-xl">📊</span> {t.chartTitle}
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

        {/* Top functiegebieden */}
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
            <span className="text-xl">🏆</span> {t.topAreasTitle}
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
              <span>🏅</span> {t.proScoutTitle}
            </h3>
            {proScoutBereikt ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="text-green-600 text-sm font-bold flex-shrink-0">&#10003;</span>
                </div>
                <p className="text-xs text-green-700 font-semibold">{t.proScoutReached(plaatsingenVoltooid, plaatsingenNodig)}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange rounded-full" style={{ width: `${(plaatsingenVoltooid / plaatsingenNodig) * 100}%` }} />
                </div>
                <p className="text-xs text-ink-muted">{t.proScoutProgress(plaatsingenVoltooid, plaatsingenNodig)}</p>
              </div>
            )}
            <div className="mt-3 space-y-1.5">
              <p className="text-xs text-ink-muted font-medium">{t.proScoutBenefitsTitle}</p>
              <ul className="text-xs text-ink-muted space-y-1 ml-3">
                <li>&#8226; {t.proScoutBenefit1}</li>
                <li>&#8226; {t.proScoutBenefit2}</li>
                <li>&#8226; {t.proScoutBenefit3}</li>
                <li>&#8226; {t.proScoutBenefit4}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recente reviews */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
            <span className="text-xl">💬</span> {t.reviewsTitle}
          </h2>
          <div className="flex items-center gap-2 bg-surface-muted px-3 py-1.5 rounded-lg">
            <span className="text-sm text-ink-muted">{t.reviewsAverage}</span>
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
