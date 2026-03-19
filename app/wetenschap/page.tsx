'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getUser, getRolePath } from '@/lib/auth'
import { User } from '@/lib/types'

const roleLabels: Record<string, string> = {
  opdrachtgever: 'Opdrachtgever',
  scout: 'Talent Scout',
  kandidaat: 'Kandidaat',
  admin: 'Refurzy Admin',
}

export default function WetenschapPage() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => { setUser(getUser()) }, [])

  return (
    <div className="min-h-screen bg-navy text-white font-[Poppins]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-navy/80 backdrop-blur-md border-b border-purple/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/homepage"><img src="/logo-white.png" alt="Refurzy" className="h-7" /></Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="/homepage" className="hover:text-white transition-colors">Homepage</Link>
            <Link href="/homepage#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <span className="text-cyan font-medium">Wetenschap</span>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center text-purple-light text-xs font-bold">{user.name.charAt(0)}</div>
                <span className="text-xs text-gray-400">{user.name}</span>
                <span className="px-1.5 py-0.5 bg-purple/10 rounded text-purple-light text-[10px] font-medium">{roleLabels[user.role]}</span>
              </div>
              <Link href={getRolePath(user.role)} className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
                Dashboard →
              </Link>
            </div>
          ) : (
            <Link href="/login" className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              Gratis starten
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-cyan rounded-full filter blur-[100px] opacity-10 -top-[200px] -right-[100px]" />
          <div className="absolute w-[400px] h-[400px] bg-purple rounded-full filter blur-[100px] opacity-10 bottom-0 -left-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block px-3 py-1 bg-cyan/10 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-6 tracking-wider uppercase">
            Wetenschappelijke onderbouwing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            De wetenschap achter de{' '}
            <span className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple bg-clip-text text-transparent">Matching Scan</span>
          </h1>
          <p className="text-lg text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            De Matching Scan is ontwikkeld in samenwerking met Prof. Dr. R.E. de Vries van de Vrije Universiteit Amsterdam. Dit document vat de wetenschappelijke basis samen en laat zien hoe dit zich vertaalt naar het Refurzy platform.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-24">

        {/* 1. Theoretisch kader */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/15 flex items-center justify-center text-cyan font-bold">1</span>
            <h2 className="text-2xl font-bold">Theoretisch kader: Person-Organization Fit</h2>
          </div>
          <div className="bg-navy-light rounded-2xl border border-purple/10 p-8">
            <p className="text-gray-300 leading-relaxed mb-4">
              De Matching Scan is gebaseerd op het <strong className="text-white">Person-Organization (P-O) fit</strong> model — de compatibiliteit tussen een persoon en een organisatie op het gebied van waarden, doelen en cultuur.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              P-O fit theorie onderscheidt twee vormen. Refurzy meet primair de <em>supplementary fit</em>: de overlap tussen de waarden, interesses en cultuurvoorkeuren van de kandidaat en de organisatie. Empirisch onderzoek toont aan dat supplementary fit sterker samenhangt met affectieve werkuitkomsten dan competentie-matching.
            </p>
            <div className="bg-navy rounded-xl border border-purple/10 p-5">
              <p className="text-sm text-gray-400 italic">
                De meest recente methoden voor P-O fit meting worden beschreven door Granillo-Velasquez et al. (2024), Kristof-Brown et al. (2023), en Liu et al. (2024).
              </p>
            </div>
          </div>
        </section>

        {/* 2. De vier dimensies */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/15 flex items-center justify-center text-cyan font-bold">2</span>
            <h2 className="text-2xl font-bold">De vier dimensies van de Matching Scan</h2>
          </div>
          <p className="text-gray-400 mb-6">De scan meet vier dimensies, waarvan drie worden gebruikt voor matching in Refurzy. Het onderzoek is uitgevoerd door de VU Amsterdam in een steekproef van 309 werknemers (De Vries, 2026).</p>

          <div className="space-y-4">
            {[
              {
                title: 'Werkinteresses (19 items)',
                desc: 'Meten wat iemand graag doet in het werk: welke activiteiten, taken en werkcontexten iemand energiek en gemotiveerd maken.',
                stats: 'Sterke voorspeller van bevlogenheid, tevredenheid en betrokkenheid',
                regression: 'Effect blijft significant na correctie voor achtergrondvariabelen¹',
                color: 'cyan',
              },
              {
                title: 'Kernwaarden (9 items)',
                desc: 'Meten wat iemand belangrijk vindt: de diepere overtuigingen die gedrag sturen. De sterkste voorspeller van affectieve binding.',
                stats: 'Sterkste voorspeller van alle drie de werkuitkomsten',
                regression: 'Grootste effect na correctie — de belangrijkste dimensie¹',
                color: 'purple',
              },
              {
                title: 'Organisatiecultuur (7 types)',
                desc: 'Meet de voorkeur voor bepaalde werksferen en samenwerkingsstijlen, gebaseerd op O\'Reilly et al. (2014).',
                stats: 'Voorspelt organisatiebetrokkenheid',
                regression: 'Minder sterk dan waarden en interesses, maar draagt bij aan het totaalbeeld¹',
                color: 'orange',
              },
              {
                title: 'Competenties (9 items) — bewust NIET gebruikt',
                desc: 'Het onderzoek toont aan dat de match van gewenste en zelfgerapporteerde competenties geen relatie heeft met werkuitkomsten (r = n.s.). Competenties worden beoordeeld via traditionele methoden: cv, proefopdracht, gestructureerd interview.',
                stats: 'Geen significante correlatie met werkuitkomsten',
                regression: '',
                color: 'gray',
              },
            ].map(dim => (
              <div key={dim.title} className={`bg-navy-light rounded-2xl border ${dim.color === 'gray' ? 'border-gray-700' : 'border-purple/10'} p-6`}>
                <h3 className={`font-semibold mb-2 ${dim.color === 'cyan' ? 'text-cyan' : dim.color === 'purple' ? 'text-purple-light' : dim.color === 'orange' ? 'text-orange' : 'text-gray-500'}`}>{dim.title}</h3>
                <p className="text-sm text-gray-400 mb-3 leading-relaxed">{dim.desc}</p>
                <div className="bg-navy rounded-lg p-3 text-xs text-gray-500 space-y-1">
                  <p><span className="text-gray-400 font-medium">Resultaat:</span> {dim.stats}</p>
                  {dim.regression && <p><span className="text-gray-400 font-medium">Na correctie:</span> {dim.regression}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Het 35-variabelen profiel */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/15 flex items-center justify-center text-cyan font-bold">3</span>
            <h2 className="text-2xl font-bold">Het 35-variabelen profiel</h2>
          </div>
          <div className="bg-gradient-to-r from-cyan/10 via-[#06BAFF]/10 to-purple/10 rounded-2xl border border-cyan/20 p-8">
            <p className="text-gray-300 leading-relaxed mb-6">
              Het matchingprofiel bestaat uit een vaste set van 35 vragen (19 interesses + 9 waarden + 7 cultuurtypen). Dit profiel wordt voor zowel de kandidaat als de organisatie ingevuld. De M-Score wordt berekend als de correlatie tussen beide profielen, getransformeerd naar een schaal van 0-100%.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-navy/50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-cyan mb-1">Zeer sterk</div>
                <p className="text-xs text-gray-400">Voorspeller van werkbevlogenheid¹</p>
              </div>
              <div className="bg-navy/50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple-light mb-1">Zeer sterk</div>
                <p className="text-xs text-gray-400">Voorspeller van werktevredenheid¹</p>
              </div>
              <div className="bg-navy/50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-orange mb-1">Zeer sterk</div>
                <p className="text-xs text-gray-400">Voorspeller van organisatiebetrokkenheid¹</p>
              </div>
            </div>

            <div className="bg-navy/50 rounded-xl p-5">
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white">Wat betekent dit?</strong> De Matching Scan voorspelt werkgeluk, tevredenheid en betrokkenheid sterker dan traditionele capaciteitstests.¹ Dat maakt het een van de krachtigste beschikbare instrumenten voor het voorspellen van een succesvolle plaatsing.
              </p>
              <p className="text-[10px] text-gray-600 mt-3 italic">¹ Statistisch: β = .29–.30 (p &lt; .01) — een zeer sterk effect in organisatieonderzoek (Funder &amp; Ozer, 2019). Ter vergelijking: cognitieve capaciteitstests voorspellen job performance met r = .16 (Sackett et al., 2024). Na correctie voor geslacht, leeftijd, opleiding, dienstjaren, salaris en thuiswerk. VU Amsterdam (De Vries, 2026; N=309)</p>
            </div>
          </div>
        </section>

        {/* 4. Doorvertaling naar Refurzy */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/15 flex items-center justify-center text-cyan font-bold">4</span>
            <h2 className="text-2xl font-bold">Doorvertaling naar het Refurzy platform</h2>
          </div>

          <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 mb-6">
            <h3 className="text-white font-semibold mb-4">Het matching-algoritme in 4 stappen</h3>
            <div className="space-y-4">
              {[
                { nr: '1', title: 'Organisatieprofiel invullen', desc: 'De opdrachtgever vult éénmalig de Matching Scan in (~15 min). Dit resulteert in een 35-item organisatieprofiel.' },
                { nr: '2', title: 'Kandidaatprofiel invullen', desc: 'Kandidaten die door een Talent Scout worden uitgenodigd, vullen de Matching Scan in (~15 min). Dit resulteert in een 35-item kandidaatprofiel.' },
                { nr: '3', title: 'M-Score berekenen', desc: 'Het systeem berekent de Pearson correlatie tussen beide profielen. Na transformatie (BESD) resulteert dit in een score van 0-100%.' },
                { nr: '4', title: 'Presentatie in dashboard', desc: 'De opdrachtgever ziet per kandidaat: harde criteria match, M-Score, en scout rating. Dit stelt hen in staat om op basis van P-O fit te beslissen.' },
              ].map(step => (
                <div key={step.nr} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan/15 flex items-center justify-center text-cyan font-bold text-sm flex-shrink-0 mt-0.5">{step.nr}</div>
                  <div>
                    <p className="text-white font-medium text-sm">{step.title}</p>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-light rounded-2xl border border-purple/10 p-8">
            <h3 className="text-white font-semibold mb-4">Het cruciale verschil: vóór vs. na de aanname</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              In traditionele processen wordt P-O fit pas na aanname ontdekt. Dit leidt tot kandidaten die wel de harde kwalificaties hebben maar niet bij de cultuur passen — 46% faalt binnen 18 maanden (Leadership IQ). Refurzy verschuift deze ontdekking naar vóór de aanname.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-navy rounded-xl p-4">
                <p className="text-cyan font-semibold text-sm mb-2">Selectie-effect</p>
                <p className="text-gray-400 text-xs leading-relaxed">Opdrachtgevers filteren kandidaten met lage fit-scores en richten hun tijd op kandidaten met hogere kans op langetermijnsucces.</p>
              </div>
              <div className="bg-navy rounded-xl p-4">
                <p className="text-cyan font-semibold text-sm mb-2">Besluitvormings-effect</p>
                <p className="text-gray-400 text-xs leading-relaxed">De M-Score vermindert de afhankelijkheid van buikgevoel. 81% van hiring managers ghostt kandidaten uit twijfel (Resume Genius, 2024). De M-Score geeft een data-driven antwoord.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Verwachte voordelen */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/15 flex items-center justify-center text-cyan font-bold">5</span>
            <h2 className="text-2xl font-bold">Verwachte voordelen</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Lagere mis-hire kosten', desc: 'Mis-hires kosten €44.000-€175.000 per geval (SHRM: 50-200% jaarsalaris). Door lage P-O fit vooraf te filteren, vermindert Refurzy de kans op mis-hires. Verwachte turnover reductie: 10-30%.', source: 'SHRM 2024 · Kristof-Brown et al., 2005 · Aberdeen Group' },
              { title: 'Hoger baangeluk', desc: 'Medewerkers met hogere P-O fit ervaren zeer significant meer werkbevlogenheid, tevredenheid en betrokkenheid.¹ Win-win: lagere kosten voor werkgever, hoger welzijn voor medewerker.', source: 'VU Amsterdam, 2026' },
              { title: 'Hogere retentie', desc: 'P-O fit hangt negatief samen met vertrekintentie (r = -.35). Medewerkers die passen bij de cultuur zijn minder geneigd externe aanbiedingen te accepteren.', source: 'Kristof-Brown et al., 2005' },
              { title: 'Minder onzekerheid', desc: '81% van hiring managers ghostt kandidaten uit twijfel. De M-Score geeft een kwantitatieve indicator die twijfel reduceert en besluitvorming versnelt.', source: 'Resume Genius, 2024 · SHRM 2025' },
              { title: 'Objectieve selectie', desc: 'Traditionele interviews zijn vatbaar voor halo-effect, confirmation bias en similarity-attraction. De Matching Scan is gestandaardiseerd en gebaseerd op correlatie, niet op subjectieve interpretatie.', source: 'Dipboye, 1982 · Sackett et al., 2024' },
              { title: 'Cultuurversterking', desc: 'Wanneer nieuwe medewerkers qua waarden beter passen, versterken zij gezamenlijk de gewenste cultuur. Dit leidt tot een positieve spiraal: sterkere cultuur trekt meer passende kandidaten aan.', source: 'SHRM, 2024' },
            ].map(v => (
              <div key={v.title} className="bg-navy-light rounded-2xl border border-purple/10 p-6">
                <h3 className="text-white font-semibold mb-2 text-sm">{v.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-2">{v.desc}</p>
                <p className="text-[10px] text-gray-600 italic">{v.source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Business cases */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/15 flex items-center justify-center text-cyan font-bold">6</span>
            <h2 className="text-2xl font-bold">Business cases</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-8">
              <h3 className="text-white font-semibold mb-1">Middelgroot bedrijf</h3>
              <p className="text-gray-500 text-xs mb-4">100 medewerkers · 13,5% turnover · gemiddeld salaris €5.000/mnd</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Refurzy kosten jaar 1</span><span className="text-white font-semibold">€58.496</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Netto besparing/jaar (20% reductie)</span><span className="text-cyan font-semibold">€72.000 – €426.000</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Netto besparing/jaar (30% reductie)</span><span className="text-cyan font-semibold">€137.000 – €668.000</span></div>
                <div className="border-t border-purple/10 pt-3 flex justify-between"><span className="text-gray-400">Cumulatief over 5 jaar</span><span className="text-white font-bold">€297.000 – €2.680.000</span></div>
              </div>
            </div>

            <div className="bg-navy-light rounded-2xl border border-purple/10 p-8">
              <h3 className="text-white font-semibold mb-1">Klein bedrijf</h3>
              <p className="text-gray-500 text-xs mb-4">3 hires/jaar · geen interne recruiter · gemiddeld salaris €5.000/mnd</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Traditioneel bureau (3 hires)</span><span className="text-red-400 font-semibold">€48.600/jaar</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Refurzy (3 hires)</span><span className="text-cyan font-semibold">€12.999/jaar</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Netto besparing/jaar</span><span className="text-cyan font-semibold">€44.000 – €85.000</span></div>
                <div className="flex justify-between"><span className="text-gray-400">ROI</span><span className="text-white font-bold">336% – 651%</span></div>
                <div className="border-t border-purple/10 pt-3 flex justify-between"><span className="text-gray-400">Cumulatief over 5 jaar</span><span className="text-white font-bold">€220.000 – €465.000</span></div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-4 italic text-center">Financiële berekeningen opgesteld door Refurzy op basis van industrie-data (SHRM, BLS). Wetenschappelijke validatie door Prof. Dr. R.E. de Vries betreft de Matching Scan en werkuitkomsten, niet de financiële doorrekeningen.</p>
        </section>

        {/* 7. Beperkingen */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-orange/15 flex items-center justify-center text-orange font-bold">7</span>
            <h2 className="text-2xl font-bold">Beperkingen en kanttekeningen</h2>
          </div>
          <div className="bg-navy-light rounded-2xl border border-purple/10 p-8">
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
              <div>
                <p className="text-white font-medium mb-1">P-O fit is geen garantie</p>
                <p>P-O fit is een significante maar niet allesverklarende voorspeller. Een substantieel deel van de variantie wordt door andere factoren verklaard: salaris, leiderschapskwaliteit, werk-privé balans, etc.</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Zelfrapportage</p>
                <p>De scan is gebaseerd op zelfrapportage. Mitigerende factoren: ipsatieve items (geforceerde keuzes), combinatie met interviews, en meta-analytisch bewijs dat zelfrapportage P-O fit nog steeds voorspellende validiteit heeft.</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Organisatieprofiel-validiteit</p>
                <p>Het organisatieprofiel wordt ingevuld door één persoon. In grote organisaties kan de cultuur per afdeling verschillen. Toekomstige versies kunnen profielen aggregeren.</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Internationale generaliseerbaarheid</p>
                <p>Het onderzoek is uitgevoerd in Nederland. Meta-analyses tonen aan dat P-O fit universeel voorspellend is, maar replicatieonderzoek in doelmarkten wordt aanbevolen.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusie */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-cyan/10 via-[#06BAFF]/10 to-purple/10 rounded-2xl border border-cyan/20 p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Conclusie</h2>
            <p className="text-gray-300 leading-relaxed text-center max-w-3xl mx-auto mb-6">
              De Matching Scan biedt een wetenschappelijk gevalideerde methode om Person-Organization fit te meten. Het 35-item profiel voorspelt werkbevlogenheid, werktevredenheid en organisatiebetrokkenheid met zeer sterke voorspellende waarde¹, zelfs na correctie voor achtergrondvariabelen.
            </p>
            <p className="text-[10px] text-gray-600 text-center italic">
              Gereviewed door Prof. Dr. R.E. de Vries, Vrije Universiteit Amsterdam.
            </p>
          </div>
        </section>

        {/* Referenties */}
        <section>
          <h2 className="text-xl font-bold mb-4">Referenties</h2>
          <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 text-xs text-gray-500 leading-relaxed space-y-2">
            <p>Arthur, W., Jr., Bell, S. T., Villado, A. J., &amp; Doverspike, D. (2006). The use of person-organization fit in employment decision making. <em>Journal of Applied Psychology, 91</em>(4), 786-801.</p>
            <p>De Vries, R.E. (2026). Profiel Match Scan: empirisch onderzoek naar P-O fit en werkuitkomsten. Vrije Universiteit Amsterdam. N=309.</p>
            <p>Funder, D. C., &amp; Ozer, D. J. (2019). Evaluating effect size in psychological research. <em>Advances in Methods and Practices in Psychological Science, 2</em>(2), 156-168.</p>
            <p>Kristof-Brown, A. L., Zimmerman, R. D., &amp; Johnson, E. C. (2005). Consequences of individuals&apos; fit at work: A meta-analysis. <em>Personnel Psychology, 58</em>(2), 281-342.</p>
            <p>O&apos;Reilly, C. A., Chatman, J., &amp; Caldwell, D. F. (2014). People and organizational culture. <em>Academy of Management Journal, 34</em>(3), 487-516.</p>
            <p>Sackett, P. R., et al. (2024). Revisiting meta-analytic estimates of validity in personnel selection. <em>Journal of Applied Psychology.</em></p>
            <p>SHRM (2024). The Real Costs of Recruitment. Society for Human Resource Management.</p>
            <p>Wnuk, M. &amp; Chudzicka-Czupała, A. (2026). P-O fit, meaning in work and turnover intention. N=1.071.</p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/homepage" className="btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            ← Terug naar homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
