'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getUser, getRolePath } from '@/lib/auth'
import { User } from '@/lib/types'
import { t, Lang } from '@/lib/i18n'
import LangToggle from '@/components/LangToggle'

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [lang, setLang] = useState<Lang>('nl')
  const [showMisHireDetail, setShowMisHireDetail] = useState(false)
  const [showCalcDetail, setShowCalcDetail] = useState(false)

  // Calculator state – string inputs for free keyboard editing, numeric values for calculation
  const [calcMedewerkersInput, setCalcMedewerkersInput] = useState('50')
  const [calcSalarisInput, setCalcSalarisInput] = useState('5000')
  const [calcVerloopInput, setCalcVerloopInput] = useState('10')
  const calcMedewerkers = Math.max(1, Math.min(10000, Number(calcMedewerkersInput) || 1))
  const calcSalaris = Math.max(2000, Math.min(20000, Number(calcSalarisInput) || 2000))
  const calcVerloop = Math.max(1, Math.min(50, Number(calcVerloopInput) || 1))

  const formatEur = useMemo(() => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }), [])

  const calcResults = useMemo(() => {
    // V7 model: medewerkers × verloop% = hires per jaar
    const hiresPerJaar = calcMedewerkers * (calcVerloop / 100)
    const jaarsalaris = calcSalaris * 12
    const jaarsalarisInclVakantiegeld = jaarsalaris * 1.08
    const totaleLoonkosten = jaarsalarisInclVakantiegeld * 1.35 // €87.480 bij €5.000/mnd
    const kostenPerMisHireLow = totaleLoonkosten * 0.50  // SHRM: 50% jaarsalaris
    const kostenPerMisHireHigh = totaleLoonkosten * 2.00  // SHRM: 200% jaarsalaris
    // 46% van nieuwe hires faalt binnen 18 maanden (Leadership IQ)
    const mishiresPerJaar = hiresPerJaar * 0.46
    // Refurzy voorkomt 39-59% daarvan (Aberdeen Group / Gallup)
    const voorkomenMisHiresLow = mishiresPerJaar * 0.39
    const voorkomenMisHiresHigh = mishiresPerJaar * 0.59
    const besparingMisHireLow = voorkomenMisHiresLow * kostenPerMisHireLow
    const besparingMisHireHigh = voorkomenMisHiresHigh * kostenPerMisHireHigh
    // Directe besparing: bureau 25% vs Refurzy €4.333
    const traditioneleBureauKosten = hiresPerJaar * jaarsalarisInclVakantiegeld * 0.25
    const refurzyKosten = hiresPerJaar * 4333
    const directeBesparing = traditioneleBureauKosten - refurzyKosten
    const totaalBesparingLow = directeBesparing + besparingMisHireLow
    const totaalBesparingHigh = directeBesparing + besparingMisHireHigh
    const roi = refurzyKosten > 0 ? Math.round((totaalBesparingLow / refurzyKosten) * 100) : 0
    const vijfJaarLow = totaalBesparingLow * 5
    const vijfJaarHigh = totaalBesparingHigh * 5
    return { totaalBesparingLow, totaalBesparingHigh, roi, directeBesparing, vijfJaarLow, vijfJaarHigh, hiresPerJaar: Math.round(hiresPerJaar * 10) / 10 }
  }, [calcMedewerkers, calcSalaris, calcVerloop])

  useEffect(() => {
    setUser(getUser())
    const saved = typeof window !== 'undefined' ? localStorage.getItem('refurzy_lang') as Lang : null
    if (saved === 'en' || saved === 'nl') setLang(saved)
  }, [])

  const changeLang = (l: Lang) => {
    setLang(l)
    if (typeof window !== 'undefined') localStorage.setItem('refurzy_lang', l)
  }

  return (
    <div className="min-h-screen bg-navy text-white font-[Poppins]">
      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-navy/80 backdrop-blur-md border-b border-purple/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <Link href="/homepage">
            <img src="/logo-white.png" alt="Refurzy" className="h-7" />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 absolute left-1/2 -translate-x-1/2">
            <a href="#hoe-het-werkt" className="hover:text-white transition-colors">{t('nav.howItWorks', lang)}</a>
            <a href="#pricing" className="hover:text-white transition-colors">{t('nav.pricing', lang)}</a>
            <Link href="/wetenschap" className="hover:text-white transition-colors">{t('nav.science', lang)}</Link>
            <a href="#faq" className="hover:text-white transition-colors">{t('nav.faq', lang)}</a>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle lang={lang} setLang={changeLang} />
            <Link href="/login" className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              {t('nav.login', lang)}
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-cyan rounded-full filter blur-[100px] opacity-15 -top-[200px] -right-[100px] animate-pulse" style={{ animationDuration: '20s' }} />
          <div className="absolute w-[500px] h-[500px] bg-purple rounded-full filter blur-[100px] opacity-15 -bottom-[150px] -left-[100px] animate-pulse" style={{ animationDuration: '25s' }} />
          <div className="absolute w-[350px] h-[350px] bg-[#06BAFF] rounded-full filter blur-[100px] opacity-15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDuration: '18s' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-2">
            <span className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple bg-clip-text text-transparent">
              {t('hero.tagline', lang).split('.')[0]}.
            </span>
            <br />
            {t('hero.tagline', lang).split('.')[1]?.trim()}.
          </h1>
          <p className="text-lg md:text-xl text-[rgba(249,251,255,0.65)] font-normal mb-2 mt-6">
            {t('hero.h1a', lang)} {t('hero.h1b', lang)}
          </p>
          <p className="text-lg md:text-xl text-cyan font-semibold mb-8">
            {t('hero.roi', lang)}
          </p>

          <p className="text-base md:text-lg text-[rgba(249,251,255,0.65)] font-normal max-w-2xl mx-auto mb-4 leading-relaxed">
            {t('hero.sub1', lang)}
          </p>
          <p className="text-base md:text-lg text-[rgba(249,251,255,0.65)] font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.sub2', lang)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/demo/onboarding/opdrachtgever" className="btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              {t('hero.ctaEmployer', lang)}
            </Link>
            <Link href="/demo/onboarding/scout" className="bg-purple/15 text-purple-light font-semibold px-8 py-4 rounded-[10px] text-base border border-purple/20 hover:bg-purple/25 transition-colors">
              {t('hero.ctaScout', lang)}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-2">{t('hero.trust1', lang)}</span>
            <span className="flex items-center gap-2">{t('hero.trust2', lang)}</span>
            <span className="flex items-center gap-2">{t('hero.trust3', lang)}</span>
          </div>
          <p className="text-[10px] text-gray-700 max-w-lg mx-auto">
            {t('hero.sources', lang)}
          </p>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="border-y border-purple/10 bg-navy-light/50 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '50–200%', label: t('stats.mishireCost', lang) },
            { value: '46%', label: t('stats.failRate', lang) },
            { value: '396%+', label: t('stats.roi', lang) },
            { value: '81%', label: t('stats.doubt', lang) },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HET PROBLEEM ═══ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-orange/10 border border-orange/20 rounded-full text-orange text-xs font-semibold mb-4 tracking-wider uppercase">
              {t('problem.label', lang)}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('problem.title', lang)}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('problem.subtitle', lang)}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💸', title: t('pain.agencies.title', lang), desc: t('pain.agencies.desc', lang), source: 'SHRM, 2024' },
              { icon: '🚪', title: t('pain.turnover.title', lang), desc: t('pain.turnover.desc', lang), source: 'SHRM · Leadership IQ' },
              { icon: '🎯', title: t('pain.gut.title', lang), desc: t('pain.gut.desc', lang), source: 'Resume Genius, 2024' },
              { icon: '⏳', title: t('pain.expensive.title', lang), desc: t('pain.expensive.desc', lang) },
              { icon: '😤', title: t('pain.managers.title', lang), desc: t('pain.managers.desc', lang) },
              { icon: '🏜️', title: t('pain.market.title', lang), desc: t('pain.market.desc', lang) },
            ].map(pain => (
              <div key={pain.title} className="bg-navy-light rounded-2xl border border-purple/10 p-6 hover:border-orange/20 transition-colors group">
                <div className="text-2xl mb-4">{pain.icon}</div>
                <h3 className="text-white font-semibold mb-2">{pain.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-2">{pain.desc}</p>
                {pain.source && <p className="text-[10px] text-gray-600 italic">{pain.source}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOE HET WERKT ═══ */}
      <section id="hoe-het-werkt" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('how.title', lang)}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">{t('how.subtitle', lang)}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Opdrachtgever */}
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 hover:border-cyan/20 transition-colors group flex flex-col">
              <div className="w-14 h-14 rounded-xl bg-cyan/15 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('how.employer', lang)}</h3>
              <ol className="space-y-3 text-sm text-gray-400 flex-1">
                <li className="flex gap-3"><span className="text-cyan font-bold">1.</span> {t('how.employer.1', lang)}</li>
                <li className="flex gap-3"><span className="text-cyan font-bold">2.</span> {t('how.employer.2', lang)}</li>
                <li className="flex gap-3"><span className="text-cyan font-bold">3.</span> {t('how.employer.3', lang)}</li>
              </ol>
              <div className="mt-5 pt-5 border-t border-cyan/10">
                <p className="text-xs text-cyan font-medium">
                  {lang === 'nl'
                    ? '💰 No cure, no pay. Geen risico, alleen resultaat.'
                    : '💰 No cure, no pay. Zero risk, only results.'}
                </p>
              </div>
            </div>

            {/* Talent Scout */}
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 hover:border-purple/20 transition-colors group flex flex-col">
              <div className="w-14 h-14 rounded-xl bg-purple/15 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('how.scout', lang)}</h3>
              <ol className="space-y-3 text-sm text-gray-400 flex-1">
                <li className="flex gap-3"><span className="text-purple-light font-bold">1.</span> {t('how.scout.1', lang)}</li>
                <li className="flex gap-3"><span className="text-purple-light font-bold">2.</span> {t('how.scout.2', lang)}</li>
                <li className="flex gap-3"><span className="text-purple-light font-bold">3.</span> {t('how.scout.3', lang)}</li>
              </ol>
              <div className="mt-5 pt-5 border-t border-purple/10">
                <p className="text-xs text-purple-light font-medium">
                  {lang === 'nl'
                    ? '🌍 Amsterdam, Bali of Barcelona — jouw laptop is je kantoor.'
                    : '🌍 Amsterdam, Bali or Barcelona — your laptop is your office.'}
                </p>
              </div>
            </div>

            {/* Kandidaat */}
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 hover:border-orange/20 transition-colors group flex flex-col">
              <div className="w-14 h-14 rounded-xl bg-orange/15 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('how.candidate', lang)}</h3>
              <ol className="space-y-3 text-sm text-gray-400 flex-1">
                <li className="flex gap-3"><span className="text-orange font-bold">1.</span> {t('how.candidate.1', lang)}</li>
                <li className="flex gap-3"><span className="text-orange font-bold">2.</span> {t('how.candidate.2', lang)}</li>
                <li className="flex gap-3"><span className="text-orange font-bold">3.</span> {t('how.candidate.3', lang)}</li>
              </ol>
              <div className="mt-5 pt-5 border-t border-orange/10">
                <p className="text-xs text-orange font-medium">
                  {lang === 'nl'
                    ? '✨ Gratis. Geen sollicitatiestress. Alleen kansen die bij je passen.'
                    : '✨ Free. No application stress. Only opportunities that fit you.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DE OPLOSSING ═══ */}
      <section id="voor-wie" className="py-24 bg-navy-light/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-semibold mb-4 tracking-wider uppercase">
              {t('solution.label', lang)}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('solution.title', lang)}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('solution.subtitle', lang)}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🧬', title: t('usp.scan.title', lang), desc: t('usp.scan.desc', lang), source: 'VU Amsterdam, 2026 (N=309)' },
              { icon: '💰', title: t('usp.cheaper.title', lang), desc: t('usp.cheaper.desc', lang), source: lang === 'nl' ? 'Op basis van gemiddelde bureau-fee van 20-30%' : 'Based on average agency fee of 20-30%' },
              { icon: '🔍', title: t('usp.scouts.title', lang), desc: t('usp.scouts.desc', lang) },
              { icon: '📊', title: t('usp.data.title', lang), desc: t('usp.data.desc', lang), source: 'Resume Genius, 2024' },
              { icon: '⏱️', title: t('usp.retention.title', lang), desc: t('usp.retention.desc', lang), source: 'SHRM 2024 · Kristof-Brown et al., 2005' },
              { icon: '🛡️', title: t('usp.anonymous.title', lang), desc: t('usp.anonymous.desc', lang) },
            ].map(usp => (
              <div key={usp.title} className="bg-navy-light rounded-2xl border border-purple/10 p-6 flex gap-5 hover:border-cyan/20 transition-colors">
                <div className="text-3xl flex-shrink-0">{usp.icon}</div>
                <div>
                  <h3 className="text-white font-semibold mb-2">{usp.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-1">{usp.desc}</p>
                  {usp.source && <p className="text-[10px] text-gray-600 italic">{usp.source}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BEWEZEN RESULTATEN ═══ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-cyan/10 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-4 tracking-wider uppercase">
              {lang === 'nl' ? 'Wetenschappelijk bewezen' : 'Scientifically proven'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {lang === 'nl' ? 'Bewezen resultaten voor opdrachtgevers' : 'Proven results for employers'}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {lang === 'nl'
                ? 'Onafhankelijk onderzoek van toonaangevende instituten toont aan wat betere matching oplevert.'
                : 'Independent research from leading institutions shows what better matching delivers.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Lager verloop */}
            <div className="bg-navy-light rounded-2xl border border-cyan/20 p-8 text-center hover:border-cyan/40 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-cyan/15 flex items-center justify-center text-3xl mx-auto mb-5">📉</div>
              <div className="text-4xl font-bold text-cyan mb-2">39–59%</div>
              <p className="text-white font-semibold mb-3">
                {lang === 'nl' ? 'Minder verloop' : 'Less turnover'}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {lang === 'nl'
                  ? 'Bedrijven die pre-hire assessments inzetten rapporteren 39% minder verloop. Organisaties met hoge betrokkenheid zien zelfs 59% minder uitstroom.'
                  : 'Companies using pre-hire assessments report 39% less turnover. Organizations with high engagement see up to 59% less attrition.'}
              </p>
              <p className="text-[10px] text-gray-600 italic">Aberdeen Group · Halbesleben & Wheeler, 2008</p>
            </div>

            {/* Lagere mis-hire kosten */}
            <div className="bg-navy-light rounded-2xl border border-purple/20 p-8 text-center hover:border-purple/40 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-purple/15 flex items-center justify-center text-3xl mx-auto mb-5">💰</div>
              <div className="text-4xl font-bold text-purple-light mb-2">39–59%</div>
              <p className="text-white font-semibold mb-3">
                {lang === 'nl' ? 'Minder verloop' : 'Less turnover'}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {lang === 'nl'
                  ? 'Eén verkeerde aanname kost €44.000–€175.000 (o.b.v. bruto maandsalaris €5.000). Door P-O fit vooraf te meten, daalt het verloop met 39–59%. Dat bespaart tot €1.370.000 per jaar per 100 medewerkers.'
                  : 'One bad hire costs €44,000–€175,000 (based on €5,000 gross monthly salary). By measuring P-O fit upfront, turnover drops 39–59%. That saves up to €1,370,000 per year per 100 employees.'}
              </p>
              <button onClick={() => setShowMisHireDetail(!showMisHireDetail)} className="text-cyan text-xs mt-2 hover:underline">
                {showMisHireDetail ? 'Minder tonen ↑' : 'Waarom zo hoog? ↓'}
              </button>
              {showMisHireDetail && (
                <div className="mt-2 text-xs text-gray-500 space-y-1 text-left">
                  <p>Een mis-hire kost 50–200% van het jaarsalaris, opgebouwd uit:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Herwervingskosten — vacature, jobboards, selectie opnieuw</li>
                    <li>Verloren productiviteit — onderprestatie + maanden vacature open</li>
                    <li>Onboarding en training — investering verloren</li>
                    <li>Managementtijd — coaching en afhandeling vertrek</li>
                    <li>Teamschade — moreel, kennis en relaties verdwijnen</li>
                    <li>Ontslagkosten (VSO/transitievergoeding) — gemiddeld 1–3 bruto maandsalarissen extra</li>
                  </ul>
                  <p className="text-yellow-500/80 text-[10px] mt-1">⚠️ De SHRM-schatting is gebaseerd op Amerikaans onderzoek. In Nederland komen VSO-kosten hier vaak nog bovenop.</p>
                  <a href="https://www.shrm.org/topics-tools/news/talent-acquisition/real-costs-recruitment" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">Bron: SHRM, The Real Costs of Recruitment →</a>
                </div>
              )}
              <p className="text-[10px] text-gray-600 italic">SHRM, 2024 · Kristof-Brown et al., 2005</p>
            </div>

            {/* Hogere productiviteit */}
            <div className="bg-navy-light rounded-2xl border border-orange/20 p-8 text-center hover:border-orange/40 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-orange/15 flex items-center justify-center text-3xl mx-auto mb-5">🚀</div>
              <div className="text-4xl font-bold text-orange mb-2">+</div>
              <p className="text-white font-semibold mb-3">
                {lang === 'nl' ? 'Hogere productiviteit' : 'Higher productivity'}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {lang === 'nl'
                  ? 'Medewerkers die passen bij de organisatie zijn bevlogener, en werkbevlogenheid voorspelt direct hogere werkprestaties. Ze zijn productiever, minder vaak ziek en presteren beter in hun team.'
                  : 'Employees who fit the organization are more engaged, and engagement directly predicts higher job performance. They are more productive, take fewer sick days, and perform better.'}
              </p>
              <p className="text-[10px] text-gray-600 italic">Halbesleben & Wheeler, 2008 · VU Amsterdam, 2026</p>
            </div>
          </div>

          {/* Extra bewijs-strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-navy-light/70 rounded-xl border border-purple/10 p-4 text-center">
              <div className="text-xl font-bold text-cyan">4×</div>
              <p className="text-[11px] text-gray-500 mt-1">
                {lang === 'nl' ? 'meer kans dat mensen blijven bij goede cultuurmatch' : 'more likely to stay with good culture match'}
              </p>
              <p className="text-[9px] text-gray-700 mt-1">SHRM, 2024</p>
            </div>
            <div className="bg-navy-light/70 rounded-xl border border-purple/10 p-4 text-center">
              <div className="text-xl font-bold text-purple-light">N=309</div>
              <p className="text-[11px] text-gray-500 mt-1">
                {lang === 'nl' ? 'werknemers gevalideerd door VU Amsterdam' : 'employees validated by VU Amsterdam'}
              </p>
              <p className="text-[9px] text-gray-700 mt-1">VU Amsterdam, 2026</p>
            </div>
            <div className="bg-navy-light/70 rounded-xl border border-purple/10 p-4 text-center">
              <div className="text-xl font-bold text-orange">68,5</div>
              <p className="text-[11px] text-gray-500 mt-1">
                {lang === 'nl' ? 'dagen gemiddelde time-to-hire — sneller met data' : 'days average time-to-hire — faster with data'}
              </p>
              <p className="text-[9px] text-gray-700 mt-1">SHRM, 2025</p>
            </div>
            <div className="bg-navy-light/70 rounded-xl border border-purple/10 p-4 text-center">
              <div className="text-xl font-bold text-cyan">15 🌍</div>
              <p className="text-[11px] text-gray-500 mt-1">
                {lang === 'nl' ? 'landen bevestigen: cultuurmatch = retentie' : 'countries confirm: culture match = retention'}
              </p>
              <p className="text-[9px] text-gray-700 mt-1">SHRM, 2024 · N=11.080</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/wetenschap" className="text-cyan text-sm font-medium hover:underline transition-colors">
              {lang === 'nl' ? 'Bekijk alle wetenschappelijke onderbouwing →' : 'View all scientific evidence →'}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ MATCHING SCAN + WETENSCHAP ═══ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-cyan/10 via-[#06BAFF]/10 to-purple/10 rounded-3xl border border-cyan/20 p-10 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-cyan/15 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-4">
                  {t('scan.badge', lang)}
                </div>
                <h2 className="text-3xl font-bold mb-4">{t('scan.title', lang)}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('scan.desc', lang)}
                </p>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> {t('scan.item1', lang)}</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> {t('scan.item2', lang)}</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> {t('scan.item3', lang)}</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> {t('scan.item4', lang)}</li>
                </ul>
                <p className="text-[10px] text-gray-600 mt-4 italic">{t('scan.footnote', lang)}</p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan via-[#06BAFF] to-purple flex items-center justify-center shadow-[0_0_60px_rgba(6,186,255,0.3)]">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white">87%</div>
                      <div className="text-sm text-white/70 font-light mt-1">M-Score</div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-lg">✓</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wetenschap samenvatting */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 text-center">
              <div className="text-3xl font-bold text-cyan mb-2">{t('scan.stat1.value', lang)}</div>
              <p className="text-sm text-gray-400">{t('scan.stat1.label', lang)}</p>
              <p className="text-[10px] text-gray-600 mt-2">{t('scan.stat1.sub', lang)}</p>
            </div>
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 text-center">
              <div className="text-3xl font-bold text-purple-light mb-2">39–59%</div>
              <p className="text-sm text-gray-400">{t('scan.stat2.label', lang)}</p>
              <p className="text-[10px] text-gray-600 mt-2">{t('scan.stat2.sub', lang)}</p>
            </div>
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 text-center">
              <div className="text-3xl font-bold text-orange mb-2">r = −.35</div>
              <p className="text-sm text-gray-400">{t('scan.stat3.label', lang)}</p>
              <p className="text-[10px] text-gray-600 mt-2">{t('scan.stat3.sub', lang)}</p>
            </div>
          </div>

          {/* Hoe het verschilt */}
          <div className="mt-12 bg-navy-light rounded-2xl border border-purple/10 p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">{t('scan.compare.title', lang)}</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-red-500/20 rounded-xl p-5 bg-red-500/5">
                <p className="text-red-400 font-semibold text-sm mb-3">{t('scan.trad.label', lang)}</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>{t('scan.trad.1', lang)}</li>
                  <li>{t('scan.trad.2', lang)}</li>
                  <li>{t('scan.trad.3', lang)}</li>
                  <li>{t('scan.trad.4', lang)}</li>
                  <li>{t('scan.trad.5', lang)}</li>
                </ul>
                <p className="text-[10px] text-gray-600 mt-3 italic">SHRM 2025 · Leadership IQ</p>
              </div>
              <div className="border border-cyan/20 rounded-xl p-5 bg-cyan/5">
                <p className="text-cyan font-semibold text-sm mb-3">{t('scan.ref.label', lang)}</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>{t('scan.ref.1', lang)}</li>
                  <li>{t('scan.ref.2', lang)}</li>
                  <li>{t('scan.ref.3', lang)}</li>
                  <li>{t('scan.ref.4', lang)}</li>
                  <li>{t('scan.ref.5', lang)}</li>
                </ul>
                <p className="text-[10px] text-gray-600 mt-3 italic">VU Amsterdam · SHRM · Aberdeen Group</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 bg-navy-light/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricing.title', lang)}</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-12">
            {t('pricing.subtitle', lang)}
          </p>

          <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 mb-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple/10">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">{t('pricing.colExp', lang)}</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">MBO</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">HBO</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">WO</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { exp: t('pricing.row1', lang), mbo: '€1.800', hbo: '€2.400', wo: '€3.600' },
                  { exp: t('pricing.row2', lang), mbo: '€3.600', hbo: '€4.800', wo: '€7.200' },
                  { exp: t('pricing.row3', lang), mbo: '€5.400', hbo: '€7.200', wo: '€10.800' },
                  { exp: t('pricing.row4', lang), mbo: '€7.200', hbo: '€12.000', wo: '€12.000', equal: true },
                ].map(row => (
                  <tr key={row.exp} className="border-b border-purple/5">
                    <td className="py-3 px-4 text-gray-300 font-medium">{row.exp}</td>
                    <td className="py-3 px-4 text-center text-white font-semibold">{row.mbo}</td>
                    <td className={`py-3 px-4 text-center font-semibold ${row.equal ? 'text-cyan' : 'text-white'}`}>{row.hbo}</td>
                    <td className={`py-3 px-4 text-center font-semibold ${row.equal ? 'text-cyan' : 'text-white'}`}>{row.wo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ═══ BESPARINGSCALCULATOR ═══ */}
      <section id="calculator" className="py-24 bg-navy-light/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-cyan/10 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-4 tracking-wider uppercase">
              {lang === 'nl' ? 'Besparingscalculator' : 'Savings calculator'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {lang === 'nl' ? 'Bereken uw besparing' : 'Calculate your savings'}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {lang === 'nl' ? 'Ontdek hoeveel uw organisatie kan besparen met Refurzy' : 'Discover how much your organization can save with Refurzy'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'nl' ? 'Aantal medewerkers' : 'Number of employees'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={calcMedewerkersInput}
                  onChange={(e) => setCalcMedewerkersInput(e.target.value.replace(/[^0-9]/g, ''))}
                  onBlur={() => { const v = Math.max(1, Math.min(10000, Number(calcMedewerkersInput) || 1)); setCalcMedewerkersInput(String(v)) }}
                  className="w-full bg-navy border border-purple/20 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'nl' ? 'Gemiddeld bruto maandsalaris' : 'Average gross monthly salary'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">&euro;</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={calcSalarisInput}
                    onChange={(e) => setCalcSalarisInput(e.target.value.replace(/[^0-9]/g, ''))}
                    onBlur={() => { const v = Math.max(2000, Math.min(20000, Number(calcSalarisInput) || 2000)); setCalcSalarisInput(String(v)) }}
                    className="w-full bg-navy border border-purple/20 rounded-xl pl-10 pr-4 py-3 text-white text-lg font-semibold focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'nl' ? 'Huidig verloop (%)' : 'Current turnover (%)'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={calcVerloopInput}
                    onChange={(e) => setCalcVerloopInput(e.target.value.replace(/[^0-9]/g, ''))}
                    onBlur={() => { const v = Math.max(1, Math.min(50, Number(calcVerloopInput) || 1)); setCalcVerloopInput(String(v)) }}
                    className="w-full bg-navy border border-purple/20 rounded-xl px-4 pr-10 py-3 text-white text-lg font-semibold focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">%</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  {lang === 'nl'
                    ? 'Het gemiddelde vrijwillige verloop in Nederland is circa 10% per jaar (CBS/Intelligence Group, 2025). De verwachting is dat dit naar 19% gaat stijgen (Mercer, 2025).'
                    : 'The average voluntary turnover in the Netherlands is approximately 10% per year (CBS/Intelligence Group, 2025). It is expected to rise to 19% (Mercer, 2025).'}
                </p>
              </div>
            </div>

            {/* Results display */}
            <div className="bg-gradient-to-br from-cyan/10 via-[#06BAFF]/10 to-purple/10 rounded-3xl border border-cyan/20 p-8 flex flex-col justify-center">
              {/* Main savings number */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-medium">
                  {lang === 'nl' ? 'Geschatte jaarlijkse besparing' : 'Estimated annual savings'}
                </p>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan via-[#06BAFF] to-purple bg-clip-text text-transparent leading-tight">
                  {formatEur.format(Math.round(calcResults.totaalBesparingLow))} &ndash; {formatEur.format(Math.round(calcResults.totaalBesparingHigh))}
                </div>
              </div>

              {/* Hires context */}
              <p className="text-xs text-gray-500 text-center mb-6">
                {lang === 'nl'
                  ? `${calcMedewerkers} medewerkers × ${calcVerloop}% verloop = ${calcResults.hiresPerJaar} hires per jaar`
                  : `${calcMedewerkers} employees × ${calcVerloop}% turnover = ${calcResults.hiresPerJaar} hires per year`}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan">{calcResults.roi}%</div>
                  <p className="text-[11px] text-gray-500 mt-1">Return on Investment</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{formatEur.format(Math.round(calcResults.directeBesparing))}</div>
                  <p className="text-[11px] text-gray-500 mt-1">{lang === 'nl' ? 'besparing op bureau fees' : 'savings on agency fees'}</p>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-white leading-tight">{formatEur.format(Math.round(calcResults.vijfJaarLow))} &ndash; {formatEur.format(Math.round(calcResults.vijfJaarHigh))}</div>
                  <p className="text-[11px] text-gray-500 mt-1">{lang === 'nl' ? 'cumulatief over 5 jaar' : 'cumulative over 5 years'}</p>
                </div>
              </div>

              {/* Footnote */}
              <p className="text-[10px] text-gray-600 text-center leading-relaxed mb-6">
                {lang === 'nl'
                  ? '* Berekening: medewerkers × verloop% = hires/jaar. 46% mis-hire rate (Leadership IQ), Refurzy voorkomt 39-59% (Aberdeen Group, Gallup). Mis-hire kosten: 50-200% jaarsalaris (SHRM). Bureau fee: 25% vs. Refurzy €4.333.'
                  : '* Calculation: employees × turnover% = hires/year. 46% mis-hire rate (Leadership IQ), Refurzy prevents 39-59% (Aberdeen Group, Gallup). Mis-hire costs: 50-200% annual salary (SHRM). Agency fee: 25% vs. Refurzy €4,333.'}
              </p>

              {/* Mis-hire cost breakdown */}
              <div className="mt-4 text-center">
                <button onClick={() => setShowCalcDetail(!showCalcDetail)} className="text-cyan text-xs hover:underline">
                  {showCalcDetail ? 'Minder tonen ↑' : 'Hoe zijn de kosten van een mis-hire opgebouwd? ↓'}
                </button>
                {showCalcDetail && (
                  <div className="mt-3 bg-navy-light rounded-xl border border-purple/10 p-4 text-left text-xs text-gray-400 space-y-1.5">
                    <p className="text-gray-300 font-medium">Een mis-hire kost 50–200% van het jaarsalaris (SHRM). Dit is opgebouwd uit:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong className="text-gray-300">Herwervingskosten</strong> — vacature, jobboards, recruiter-tijd, selectieprocedure opnieuw doorlopen</li>
                      <li><strong className="text-gray-300">Verloren productiviteit</strong> — de vertrekkende medewerker presteert weken onder niveau, de positie staat maanden open</li>
                      <li><strong className="text-gray-300">Onboarding en training</strong> — alles wat u investeerde in inwerken, cursussen en begeleiding is verloren</li>
                      <li><strong className="text-gray-300">Managementtijd</strong> — leidinggevenden besteden honderden uren aan coaching en afhandeling</li>
                      <li><strong className="text-gray-300">Teamschade</strong> — verloop ondermijnt moreel en productiviteit. Kennis en relaties verdwijnen</li>
                      <li><strong className="text-gray-300">Ontslagkosten (VSO/transitievergoeding)</strong> — in Nederland gemiddeld 1–3 bruto maandsalarissen extra</li>
                    </ul>
                    <p className="text-yellow-500/80 text-[11px] mt-2">⚠️ Let op: de SHRM-schatting van 50–200% is gebaseerd op Amerikaans onderzoek, waar ontslagkosten lager zijn. In Nederland komen hier vaak nog VSO-kosten bovenop. De werkelijke kosten per mis-hire liggen daarmee gemiddeld genomen nóg hoger.</p>
                    <a href="https://www.shrm.org/topics-tools/news/talent-acquisition/real-costs-recruitment" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-cyan hover:underline">Bron: SHRM, The Real Costs of Recruitment →</a>
                  </div>
                )}
              </div>

              {/* CTA button */}
              <div className="text-center">
                <Link
                  href="/demo/onboarding/opdrachtgever"
                  className="inline-block btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all"
                >
                  {lang === 'nl' ? 'Start vandaag \u2014 bereken uw exacte besparing \u2192' : 'Start today \u2014 calculate your exact savings \u2192'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">{t('faq.title', lang)}</h2>
          <div className="space-y-3">
            {[
              { q: t('faq.q1', lang), a: t('faq.a1', lang) },
              { q: t('faq.q2', lang), a: t('faq.a2', lang) },
              { q: t('faq.q3', lang), a: t('faq.a3', lang) },
              { q: t('faq.q4', lang), a: t('faq.a4', lang) },
              { q: t('faq.q5', lang), a: t('faq.a5', lang) },
              { q: t('faq.q6', lang), a: t('faq.a6', lang) },
              { q: t('faq.q7', lang), a: t('faq.a7', lang) },
              { q: t('faq.q8', lang), a: t('faq.a8', lang) },
              { q: t('faq.q9', lang), a: t('faq.a9', lang) },
            ].map((faq, i) => (
              <div key={i} className="bg-navy-light rounded-2xl border border-purple/10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                  <span className={`text-gray-500 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-purple/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 bg-navy-light/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('cta.title', lang)}</h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            {t('cta.subtitle', lang)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo/onboarding/opdrachtgever" className="btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              {t('cta.btnEmployer', lang)}
            </Link>
            <Link href="/demo/onboarding/scout" className="bg-purple/15 text-purple-light font-semibold px-8 py-4 rounded-[10px] text-base border border-purple/20 hover:bg-purple/25 transition-colors">
              {t('cta.btnScout', lang)}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-purple/10 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo-white.png" alt="Refurzy" className="h-6 mb-4 opacity-60" />
              <p className="text-xs text-gray-600 leading-relaxed">
                Redefining Recruitment. Forever.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">{t('footer.platform', lang)}</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <a href="#hoe-het-werkt" className="block hover:text-gray-400 transition-colors">{t('footer.forEmployers', lang)}</a>
                <a href="#hoe-het-werkt" className="block hover:text-gray-400 transition-colors">{t('footer.forScouts', lang)}</a>
                <a href="#hoe-het-werkt" className="block hover:text-gray-400 transition-colors">{t('footer.forCandidates', lang)}</a>
                <a href="#pricing" className="block hover:text-gray-400 transition-colors">{t('nav.pricing', lang)}</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">{t('footer.company', lang)}</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <a href="#hoe-het-werkt" className="block hover:text-gray-400 transition-colors">{t('footer.about', lang)}</a>
                <Link href="/wetenschap" className="block hover:text-gray-400 transition-colors">{t('footer.science', lang)}</Link>
                <a href="mailto:info@refurzy.com" className="block hover:text-gray-400 transition-colors">{t('footer.contact', lang)}</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">{t('footer.legal', lang)}</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <Link href="/juridisch/privacybeleid" className="block hover:text-gray-400 transition-colors">{t('footer.privacy', lang)}</Link>
                <Link href="/juridisch/algemene-voorwaarden" className="block hover:text-gray-400 transition-colors">{t('footer.terms', lang)}</Link>
                <Link href="/juridisch/cookiebeleid" className="block hover:text-gray-400 transition-colors">{t('footer.cookies', lang)}</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-purple/10 pt-6 text-center text-xs text-gray-700">
            {t('footer.rights', lang)}
          </div>
        </div>
      </footer>
    </div>
  )
}
