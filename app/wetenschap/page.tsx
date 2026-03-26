'use client'

import { useState } from 'react'
import Link from 'next/link'
export default function WetenschapPage() {
  const [showWetenschapMisHire, setShowWetenschapMisHire] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFBFE] text-slate-800 font-[Poppins]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <Link href="/homepage"><img src="/logo-white.png" alt="Refurzy" className="h-7" /></Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-500 absolute left-1/2 -translate-x-1/2">
            <Link href="/homepage#hoe-het-werkt" className="hover:text-slate-800 transition-colors">Hoe het werkt</Link>
            <Link href="/homepage#pricing" className="hover:text-slate-800 transition-colors">Pricing</Link>
            <span className="text-cyan font-medium">Wetenschap</span>
            <Link href="/homepage#faq" className="hover:text-slate-800 transition-colors">FAQ</Link>
          </div>
          <Link href="/login" className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            Inloggen
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block px-3 py-1 bg-cyan/10 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-6 tracking-wider uppercase">
            Wetenschappelijke onderbouwing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            De wetenschap achter de{' '}
            <span className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple bg-clip-text text-transparent">Matching Scan</span>
          </h1>
          <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            De Matching Scan is ontwikkeld in samenwerking met de Vrije Universiteit Amsterdam. Dit document vat de wetenschappelijke basis samen en laat zien hoe dit zich vertaalt naar het Refurzy platform.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-24">

        {/* Executive Summary */}
        <section className="mb-16">
          <div className="bg-purple/5 rounded-2xl border border-purple/20 p-8">
            <h2 className="text-xl font-bold mb-2 text-center">Samenvatting — overtuig je manager in 60 seconden</h2>
            <p className="text-slate-500 text-sm text-center mb-6">De 5 redenen waarom Refurzy een betere keuze is dan een traditioneel bureau</p>
            <div className="space-y-4">
              {[
                { icon: '🎯', text: <>De Matching Scan voorspelt of een kandidaat past bij je organisatie — vóór de aanname. Ontwikkeld met de Vrije Universiteit Amsterdam, getest bij 309 werknemers.<sup>1</sup> De scan meet werkinteresses, kernwaarden en cultuurvoorkeur — drie factoren die statistisch zeer sterk correleren met bevlogenheid, werkgeluk en retentie. Het resultaat: 39–59% minder mis-hires.<sup>2</sup></> },
                { icon: '📉', text: <>46% van alle aannames faalt binnen 18 maanden.<sup>3</sup> Eén verkeerde hire kost €44.000–€175.000 (bij een bruto maandsalaris van €5.000).<sup>4</sup> Refurzy vermindert dit risico met 39–59% door wetenschappelijk bewezen matching.<sup>2</sup></> },
                { icon: '💰', text: <>Gemiddeld 60% goedkoper dan een traditioneel bureau. Vaste, transparante tarieven. No cure, no pay — je betaalt alleen bij een succesvolle plaatsing.</> },
                { icon: '📊', text: <>ROI van 455–1370% in het eerste jaar, zelfs voor een klein bedrijf met 3 hires per jaar. Cumulatief over 5 jaar: €272.000–€748.000 besparing.*</> },
                { icon: '🔬', text: <>Niet gebaseerd op buikgevoel maar op onderzoek. De scan meet werkinteresses, kernwaarden en cultuurvoorkeur — drie factoren die werkgeluk en retentie zeer sterk voorspellen.<sup>1</sup></> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-400 italic space-y-0.5">
              <p><sup>1</sup> VU Amsterdam (De Vries, 2026; N=309)</p>
              <p><sup>2</sup> Aberdeen Group (2015): 39% bij pre-hire assessments · Gallup: 59% bij hoog engagement</p>
              <p><sup>3</sup> Leadership IQ</p>
              <p><sup>4</sup> SHRM (2024): 50–200% van jaarsalaris</p>
              <p>* Berekeningen zijn gebaseerd op een bruto maandsalaris van €5.000.</p>
            </div>
          </div>
        </section>

        {/* Doorvertaling: wat betekent dit voor de opdrachtgever */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📌</span>
            <h2 className="text-2xl font-bold">Wat betekent dit voor uw organisatie?</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6 ml-11">De Matching Scan voorspelt bevlogenheid, werkgeluk en retentie. Hieronder de concrete effecten — onderbouwd door onafhankelijk onderzoek.</p>

          <div className="space-y-3">
            {[
              {
                title: '39–59% minder verloop',
                description: 'Bedrijven die pre-hire assessments inzetten rapporteren 39% minder verloop (Aberdeen Group). Bij organisaties met hoog engagement — sterk gecorreleerd met goede P-O fit — loopt dit op tot 59% (Gallup). Case studies met vergelijkbare culture fit tools bevestigen dit (PRADCO, ASK).',
                source: 'Aberdeen Group · Gallup · PRADCO · ASK/AssessCandidates · Kristof-Brown et al., 2005'
              },
              {
                title: '€44.000–€175.000 bespaard per voorkomen mis-hire',
                description: '46% van alle aannames faalt binnen 18 maanden. De totale kosten per mis-hire bedragen 50–200% van het jaarsalaris + werkgeverslasten (bij een bruto maandsalaris van €5.000).',
                source: 'SHRM (2024); Leadership IQ'
              },
              {
                title: 'Hogere productiviteit',
                description: 'Bevlogen medewerkers presteren aantoonbaar beter. De Matching Scan voorspelt bevlogenheid met β = .30** — een sterk effect in organisatieonderzoek.',
                source: 'Halbesleben & Wheeler, 2008'
              },
              {
                title: '4× meer geneigd om te blijven',
                description: 'Medewerkers met een positieve cultuurmatch zijn bijna 4× meer geneigd te blijven. Bij slechte fit zoekt 57% actief een nieuwe baan, tegenover slechts 15% bij goede fit.',
                source: 'SHRM, 2024 (N=11.080, 15 landen)'
              },
              {
                title: 'Snellere besluitvorming',
                description: 'De gemiddelde time-to-hire is 68,5 dagen. 81% van hiring managers twijfelt over de juiste keuze. De M-Score geeft zekerheid en versnelt beslissingen.',
                source: 'SHRM, 2025; Resume Genius, 2024'
              },
              {
                title: 'Positieve spiraal na 2–3 jaar',
                description: 'Bij systematisch gebruik wordt de organisatiecultuur sterker. Een sterkere cultuur trekt betere kandidaten aan, wat de cultuur verder versterkt.',
                source: 'SHRM, 2024; Kristof-Brown et al., 2005'
              },
            ].map((item, i) => (
              <div key={i} className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan font-bold text-xs">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-800 font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                  <p className="text-slate-500 text-[11px] mt-1.5 italic">Bron: {item.source}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 ml-12">
            <button onClick={() => setShowWetenschapMisHire(!showWetenschapMisHire)} className="text-cyan text-xs hover:underline">
              {showWetenschapMisHire ? 'Kostenopbouw verbergen ↑' : 'Hoe is €44.000–€175.000 opgebouwd? ↓'}
            </button>
            {showWetenschapMisHire && (
              <div className="mt-2 bg-white shadow-sm border border-slate-200 rounded-xl p-4 text-xs text-slate-500 space-y-1.5">
                <p className="text-slate-500 font-medium">SHRM becijfert de totale kosten van een mis-hire op 50–200% van het jaarsalaris + werkgeverslasten. Bij een bruto maandsalaris van €5.000 bedragen de totale loonkosten €87.480/jaar (€60.000 salaris + €4.800 vakantiegeld + €22.680 werkgeverslasten). 50% daarvan = €44.000, 200% = €175.000. Opgebouwd uit:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-slate-500">Herwervingskosten</strong> — vacature, jobboards, recruiter-tijd, gehele selectieprocedure opnieuw</li>
                  <li><strong className="text-slate-500">Verloren productiviteit</strong> — de vertrekkende medewerker presteert weken tot maanden onder niveau, de positie staat vervolgens maanden open</li>
                  <li><strong className="text-slate-500">Onboarding en training</strong> — alles wat u investeerde in inwerken, cursussen en begeleiding is verloren</li>
                  <li><strong className="text-slate-500">Managementtijd</strong> — leidinggevenden besteden honderden uren aan coaching, functioneringsgesprekken en afhandeling</li>
                  <li><strong className="text-slate-500">Teamschade</strong> — verloop ondermijnt het moreel en de productiviteit van het hele team. Kennis en relaties verdwijnen</li>
                  <li><strong className="text-slate-500">Ontslagkosten (VSO/transitievergoeding)</strong> — in Nederland moet bij gedwongen vertrek vaak een vaststellingsovereenkomst worden gesloten, gemiddeld 1–3 bruto maandsalarissen extra</li>
                </ul>
                <p className="text-yellow-600 text-[11px] mt-2">&#x26A0;&#xFE0F; Let op: de SHRM-schatting van 50–200% is gebaseerd op Amerikaans onderzoek, waar ontslagkosten lager zijn. In Nederland komen hier vaak nog VSO-kosten bovenop. De werkelijke kosten per mis-hire liggen daarmee gemiddeld genomen nog hoger.</p>
                <a href="https://www.shrm.org/topics-tools/news/talent-acquisition/real-costs-recruitment" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-cyan hover:underline">Bron: SHRM, The Real Costs of Recruitment &rarr;</a>
              </div>
            )}
          </div>

          <div className="mt-6 bg-purple/5 rounded-xl border border-purple/20 p-5">
            <p className="text-slate-600 text-sm leading-relaxed text-center font-medium">
              Kort gezegd: medewerkers die passen bij uw organisatie zijn <span className="text-cyan">productiever</span>, <span className="text-cyan">gelukkiger</span> en <span className="text-cyan">blijven langer</span> — en dat bespaart <span className="text-slate-800 font-bold">&euro;44.000&ndash;&euro;175.000</span> per voorkomen mis-hire (o.b.v. bruto maandsalaris &euro;5.000).
            </p>
          </div>
        </section>

        {/* Vergelijkingstabel */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">1</span>
            <h2 className="text-2xl font-bold">Refurzy vs. traditioneel werven</h2>
          </div>
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-6 py-4 text-slate-500 font-medium"></th>
                  <th className="text-center px-6 py-4 text-slate-500 font-medium">Traditioneel bureau</th>
                  <th className="text-center px-6 py-4 text-cyan font-semibold">Refurzy</th>
                </tr>
              </thead>
              <tbody className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-3">Kosten per hire</td>
                  <td className="px-6 py-3 text-center text-red-600">20–30% bruto jaarsalaris<br/><span className="text-[10px] text-slate-500">gem. &euro;16.000</span></td>
                  <td className="px-6 py-3 text-center text-cyan">Vast tarief<br/><span className="text-[10px] text-slate-500">gem. &euro;4.333</span></td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-3">Wetenschappelijke matching</td>
                  <td className="px-6 py-3 text-center text-red-600">Nee — buikgevoel</td>
                  <td className="px-6 py-3 text-center text-cyan">Ja — VU Amsterdam</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-3">Mis-hire risico</td>
                  <td className="px-6 py-3 text-center text-red-600">46% faalt &lt;18 mnd</td>
                  <td className="px-6 py-3 text-center text-cyan">39–59% lager risico</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-3">Betalingsmodel</td>
                  <td className="px-6 py-3 text-center text-red-600">Retainer verplicht<br/><span className="text-[10px] text-slate-500">kwijt bij eigen match</span></td>
                  <td className="px-6 py-3 text-center text-cyan">No cure, no pay<br/><span className="text-[10px] text-slate-500">geen retainer</span></td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-3">Exclusiviteit</td>
                  <td className="px-6 py-3 text-center text-red-600">Vaak verplicht<br/><span className="text-[10px] text-slate-500">je zit vast aan het bureau</span></td>
                  <td className="px-6 py-3 text-center text-cyan">Niet verplicht<br/><span className="text-[10px] text-slate-500">vrij om parallel te werven</span></td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-3">Voorspelling van werkgeluk</td>
                  <td className="px-6 py-3 text-center text-slate-500">Niet gemeten</td>
                  <td className="px-6 py-3 text-center text-cyan">M-Score (0–100%)</td>
                </tr>
                <tr>
                  <td className="px-6 py-3">Fit Garantie</td>
                  <td className="px-6 py-3 text-center text-slate-500">Zelden</td>
                  <td className="px-6 py-3 text-center text-cyan">Standaard</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Wat meet de scan */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">2</span>
            <h2 className="text-2xl font-bold">Wat meet de Matching Scan?</h2>
          </div>
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8">
            <p className="text-slate-500 leading-relaxed mb-4">
              De Matching Scan meet hoe goed een kandidaat bij uw organisatie past — niet op basis van cv of ervaring, maar op <strong className="text-slate-800">waarden, interesses en cultuur</strong>. Dit heet in de wetenschap &quot;Person-Organization fit&quot;: de compatibiliteit tussen persoon en organisatie.
            </p>
            <p className="text-slate-500 leading-relaxed mb-6">
              Onderzoek toont aan dat deze match een veel sterkere voorspeller is van werkgeluk en retentie dan traditionele selectiemethoden zoals capaciteitstests of ongestructureerde interviews.
            </p>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500 italic">
                Bronnen: Kristof-Brown et al. (2005, 2023), Granillo-Velasquez et al. (2024), Liu et al. (2024).
              </p>
            </div>
          </div>
        </section>

        {/* 3. De vier dimensies */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">3</span>
            <h2 className="text-2xl font-bold">De 35 vragen — wat meten ze?</h2>
          </div>
          <p className="text-slate-500 mb-6">De scan bestaat uit 35 vragen verdeeld over vier categorieën. Drie daarvan worden gebruikt voor matching. Gevalideerd door de VU Amsterdam bij 309 werknemers (2026).</p>

          <div className="space-y-4">
            {[
              {
                title: 'Werkinteresses (19 vragen)',
                desc: 'Wat doet iemand graag? Welke taken en activiteiten geven energie? Als dit aansluit bij de functie, is iemand gemotiveerder en productiever.',
                stats: 'Sterke voorspeller van werkgeluk, tevredenheid en betrokkenheid',
                regression: 'Effect blijft na correctie voor leeftijd, opleiding en salaris',
                color: 'cyan',
              },
              {
                title: 'Kernwaarden (9 vragen)',
                desc: 'Wat vindt iemand écht belangrijk? Eerlijkheid, innovatie, zekerheid? Als de waarden van een medewerker overeenkomen met die van de organisatie, blijft iemand langer, is diegene gelukkiger en productiever.',
                stats: 'De sterkste voorspeller van alle drie de werkuitkomsten',
                regression: 'Grootste effect — de belangrijkste dimensie',
                color: 'purple',
              },
              {
                title: 'Cultuurvoorkeur (7 vragen)',
                desc: 'In welke werkomgeving voelt iemand zich thuis? Formeel of informeel? Hiërarchisch of plat? Resultaatgericht of procesgericht? Dit bepaalt of iemand zich thuisvoelt.',
                stats: 'Voorspelt of iemand zich thuisvoelt in de organisatie',
                regression: 'Draagt significant bij aan het totaalbeeld',
                color: 'orange',
              },
              {
                title: 'Competenties (9 vragen) — bewust NIET gebruikt voor matching',
                desc: 'Verrassend: uit het VU-onderzoek blijkt dat de overlap tussen gewenste en zelfgerapporteerde competenties géén verband heeft met werkgeluk of retentie. Anders gezegd: of iemand denkt de juiste vaardigheden te hebben voor een rol, voorspelt niet of diegene er gelukkig van wordt of blijft. Wat wél voorspelt of iemand gelukkig wordt: of de waarden, interesses en cultuurvoorkeur overeenkomen. Niet "kan iemand dit?" maar "past iemand hier?". Competenties beoordeelt u zelf via cv, gesprek en proefopdracht.',
                stats: 'Geen verband tussen competentie-match en werkgeluk of retentie',
                regression: '',
                color: 'gray',
              },
            ].map(dim => (
              <div key={dim.title} className={`bg-white shadow-sm border rounded-2xl ${dim.color === 'gray' ? 'border-slate-300' : 'border-slate-200'} p-6`}>
                <h3 className={`font-semibold mb-2 ${dim.color === 'cyan' ? 'text-cyan' : dim.color === 'purple' ? 'text-purple' : dim.color === 'orange' ? 'text-orange' : 'text-slate-500'}`}>{dim.title}</h3>
                <p className="text-sm text-slate-500 mb-3 leading-relaxed">{dim.desc}</p>
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 space-y-1">
                  <p><span className="text-slate-500 font-medium">Resultaat:</span> {dim.stats}</p>
                  {dim.regression && <p><span className="text-slate-500 font-medium">Na correctie:</span> {dim.regression}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. De M-Score */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">4</span>
            <h2 className="text-2xl font-bold">De M-Score: uw objectieve matchindicator</h2>
          </div>
          <div className="bg-purple/5 rounded-2xl border border-purple/20 p-8">
            <p className="text-slate-500 leading-relaxed mb-6">
              Zowel de organisatie als de kandidaat vullen dezelfde 35 vragen in (~15 minuten). Het systeem berekent hoe goed beide profielen op elkaar aansluiten. Het resultaat is de <strong className="text-slate-800">M-Score</strong>: een percentage van 0–100% dat aangeeft hoe goed de match is.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-cyan mb-1">Werkgeluk</div>
                <p className="text-xs text-slate-500">Zeer sterke voorspeller&#xB9;</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple mb-1">Tevredenheid</div>
                <p className="text-xs text-slate-500">Zeer sterke voorspeller&#xB9;</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-orange mb-1">Retentie</div>
                <p className="text-xs text-slate-500">Zeer sterke voorspeller&#xB9;</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-slate-500 leading-relaxed">
                <strong className="text-slate-800">Wat betekent dit concreet?</strong> Een hogere M-Score betekent dat een kandidaat beter past bij uw organisatie. Dit voorspelt dat hij of zij gelukkiger, productiever en langer bij u zal werken. Het werkt beter dan traditionele selectiemethoden zoals cv-screening of ongestructureerde interviews.&#xB9;
              </p>
              <p className="text-[10px] text-slate-500 mt-3 italic">&#xB9; Onderzocht bij 309 werknemers door de VU Amsterdam (2026). Effect blijft na correctie voor leeftijd, opleiding, salaris en dienstjaren. Ter vergelijking: traditionele capaciteitstests voorspellen werkprestaties met r = .16 (Sackett et al., 2024).</p>
            </div>
          </div>
        </section>

        {/* 5. Hoe werkt het in de praktijk */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">5</span>
            <h2 className="text-2xl font-bold">Hoe werkt het in de praktijk?</h2>
          </div>

          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 mb-6">
            <h3 className="text-slate-800 font-semibold mb-4">Van vacature tot match in 4 stappen</h3>
            <div className="space-y-4">
              {[
                { nr: '1', title: 'U vult de Matching Scan in', desc: 'Eénmalig ~15 minuten. U beantwoordt 35 vragen over de waarden, interesses en cultuur van uw organisatie.' },
                { nr: '2', title: 'Kandidaten vullen dezelfde scan in', desc: 'Kandidaten die door een Talent Scout worden voorgedragen, vullen dezelfde 35 vragen in. Dit duurt ook ~15 minuten.' },
                { nr: '3', title: 'Het systeem berekent de match', desc: 'De M-Score (0–100%) wordt automatisch berekend: hoe hoger de score, hoe beter de kandidaat past bij uw organisatie.' },
                { nr: '4', title: 'U ziet het resultaat in uw dashboard', desc: 'Per kandidaat ziet u de M-Score, of iemand voldoet aan de harde criteria (opleiding, ervaring), en de beoordeling van de Talent Scout.' },
              ].map(step => (
                <div key={step.nr} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center text-cyan font-bold text-sm flex-shrink-0 mt-0.5">{step.nr}</div>
                  <div>
                    <p className="text-slate-800 font-medium text-sm">{step.title}</p>
                    <p className="text-slate-500 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8">
            <h3 className="text-slate-800 font-semibold mb-4">Het verschil: weten voor je aanneemt</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Normaal ontdek je pas na maanden of iemand echt bij je organisatie past. Dan is het te laat — 46% van alle aannames faalt binnen 18 maanden (Leadership IQ). Met Refurzy weet u dit <strong className="text-slate-800">voor</strong> de aanname.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-cyan font-semibold text-sm mb-2">Betere selectie</p>
                <p className="text-slate-500 text-xs leading-relaxed">U besteedt uw tijd aan kandidaten die echt passen. Kandidaten met een lage match worden eruit gefilterd voordat u ze spreekt.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-cyan font-semibold text-sm mb-2">Minder twijfel</p>
                <p className="text-slate-500 text-xs leading-relaxed">81% van hiring managers twijfelt bij aannames (Resume Genius, 2024). De M-Score geeft een objectief antwoord naast uw eigen gevoel.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Wat levert het op */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">6</span>
            <h2 className="text-2xl font-bold">Wat levert het op?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Minder verkeerde aannames', desc: 'Een mis-hire kost €44.000–€175.000 (50–200% van het jaarsalaris + werkgeverslasten, o.b.v. bruto maandsalaris €5.000). Door vooraf te meten of iemand past, vermindert u dit risico met 39–59%.', source: 'SHRM, 2024 · Kristof-Brown et al., 2005' },
              { title: 'Gelukkigere medewerkers', desc: 'Medewerkers die passen bij de organisatie zijn aantoonbaar gelukkiger, gemotiveerder en meer betrokken. Win-win: lagere kosten voor u, hoger welzijn voor hen.', source: 'VU Amsterdam, 2026 (N=309)' },
              { title: 'Hogere productiviteit', desc: 'Betrokken medewerkers presteren aantoonbaar beter. Werkbevlogenheid — een directe uitkomst van goede P-O fit — voorspelt hogere werkprestaties en minder verzuim.', source: 'Halbesleben & Wheeler, 2008' },
              { title: 'Mensen blijven langer', desc: 'Medewerkers die passen bij de cultuur zijn minder geneigd om weg te gaan. Organisaties met hoge betrokkenheid hebben 59% minder verloop. Case studies tonen reducties van 40–59%.', source: 'Kristof-Brown et al., 2005 · PRADCO · ASK/AssessCandidates' },
              { title: '39% minder verloop met assessments', desc: 'Bedrijven die pre-hire assessments inzetten (zoals de Matching Scan) rapporteren gemiddeld 39% lagere turnover dan bedrijven zonder.', source: 'Aberdeen Group' },
              { title: '4× meer kans dat mensen blijven', desc: 'Medewerkers die hun organisatiecultuur als positief beoordelen zijn bijna 4× meer geneigd om te blijven. Bij een slechte cultuur zoekt 57% actief naar een nieuwe baan.', source: 'SHRM, 2024 (N=11.080, 15 landen)' },
              { title: 'Sneller beslissen', desc: '81% van hiring managers twijfelt bij aannames. De gemiddelde time-to-hire is 68,5 dagen. De M-Score geeft een objectief datapunt, zodat u sneller en zekerder kunt beslissen.', source: 'Resume Genius, 2024 · SHRM, 2025' },
              { title: 'Werkt wereldwijd', desc: 'P-O fit is universeel voorspellend voor werkuitkomsten, bevestigd in Oost-Azië, Europa en Noord-Amerika. Het principe geldt ongeacht land of cultuur.', source: 'Oh et al., 2014 (meta-analyse)' },
              { title: 'Minder vooroordelen', desc: 'Traditionele sollicitatiegesprekken zijn gevoelig voor vooroordelen en eerste indrukken. De Matching Scan is gestandaardiseerd en objectief — dezelfde maatstaf voor iedereen.', source: 'Sackett et al., 2024' },
              { title: 'Sterkere bedrijfscultuur', desc: 'Wanneer nieuwe medewerkers qua waarden beter passen, versterken zij de cultuur. Dit trekt weer betere kandidaten aan — een positieve spiraal die na 2–3 jaar duidelijk zichtbaar wordt.', source: 'SHRM, 2024' },
              { title: 'Minder werkdruk voor HR', desc: 'Minder verloop betekent minder vacatures, minder inwerken en minder herhaalde selectieprocessen. Stabielere teams en minder "draaideureffect".', source: 'Wetenschappelijke onderbouwing Refurzy' },
              { title: 'Sterker werkgeversmerk', desc: 'Betere P-O fit leidt tot hogere engagement scores, betere Glassdoor reviews en sterkere aantrekkingskracht voor toekomstige kandidaten.', source: 'Wetenschappelijke onderbouwing Refurzy' },
            ].map(v => (
              <div key={v.title} className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
                <h3 className="text-slate-800 font-semibold mb-2 text-sm">{v.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-2">{v.desc}</p>
                <p className="text-xs text-slate-500 italic">{v.source}</p>
              </div>
            ))}
          </div>

          {/* Extra: Wnuk study */}
          <div className="mt-6 bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
            <h3 className="text-slate-800 font-semibold mb-2 text-sm">Internationaal bevestigd: P-O fit vermindert vertrekintentie via zingeving</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-2">
              Een recente studie onder 1.071 werknemers bevestigt dat P-O fit zowel direct als indirect (via zingeving in het werk) negatief samenhangt met vertrekintentie. Medewerkers die passen bij hun organisatie ervaren meer betekenis in hun werk, en vertrekken daardoor minder snel.
            </p>
            <p className="text-xs text-slate-500 italic">Wnuk & Chudzicka-Czupala, 2026 (N=1.071)</p>
          </div>
        </section>

        {/* 6. Business cases */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">7</span>
            <h2 className="text-2xl font-bold">Doorgerekend: de business case</h2>
          </div>

          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 mb-6">
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              De financiële impact van Refurzy komt uit <strong className="text-slate-800">twee bronnen</strong>:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl border border-cyan/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan text-lg">📉</span>
                  <h4 className="text-slate-800 font-semibold text-sm">Minder mis-hires</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Eén verkeerde aanname kost 50–200% van het jaarsalaris + werkgeverslasten (SHRM, 2024). Door wetenschappelijk bewezen matching op basis van Person-Organization fit daalt het verloop met 39–59%. Bij een gemiddeld salaris van €60.000 bespaart dat €30.000–€120.000 per vermeden mis-hire.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-cyan/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan text-lg">💰</span>
                  <h4 className="text-slate-800 font-semibold text-sm">Lagere wervingskosten</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Traditionele bureaus rekenen 15–27% van het bruto jaarsalaris. Refurzy werkt met vaste, transparante tarieven per plaatsing op basis van opleidingsniveau en ervaring — gemiddeld 60% goedkoper. No cure, no pay: u betaalt alleen bij een succesvolle plaatsing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8">
              <h3 className="text-slate-800 font-semibold mb-1">Middelgroot bedrijf</h3>
              <p className="text-slate-500 text-xs mb-4">100 medewerkers · 13,5% turnover · gemiddeld salaris €5.000/mnd</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Refurzy kosten jaar 1</span><span className="text-slate-800 font-semibold">€58.496</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Netto besparing/jaar (39% reductie)</span><span className="text-cyan font-semibold">€196.000</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Netto besparing/jaar (59% reductie)</span><span className="text-cyan font-semibold">€1.370.000</span></div>
                <div className="border-t border-slate-200 pt-3 flex justify-between"><span className="text-slate-500">Cumulatief over 5 jaar</span><span className="text-slate-800 font-bold">€793.000 – €5.489.000</span></div>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8">
              <h3 className="text-slate-800 font-semibold mb-1">Klein bedrijf</h3>
              <p className="text-slate-500 text-xs mb-4">3 hires/jaar · geen interne recruiter · gemiddeld salaris €5.000/mnd</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Traditioneel bureau (3 hires)</span><span className="text-red-600 font-semibold">€48.600/jaar</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Refurzy (3 hires)</span><span className="text-cyan font-semibold">€12.999/jaar</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Netto besparing/jaar</span><span className="text-cyan font-semibold">€59.000 – €178.000</span></div>
                <div className="flex justify-between"><span className="text-slate-500">ROI</span><span className="text-slate-800 font-bold">455% – 1370%</span></div>
                <div className="border-t border-slate-200 pt-3 flex justify-between"><span className="text-slate-500">Cumulatief over 5 jaar</span><span className="text-slate-800 font-bold">€272.000 – €748.000</span></div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 italic text-center">Financiële berekeningen opgesteld door Refurzy op basis van industrie-data (SHRM, BLS). Wetenschappelijke validatie door de Vrije Universiteit Amsterdam betreft de Matching Scan en werkuitkomsten, niet de financiële doorrekeningen.</p>
        </section>

        {/* 7. Beperkingen */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange font-bold">8</span>
            <h2 className="text-2xl font-bold">Eerlijk over de beperkingen</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">Transparantie is belangrijk. De Matching Scan is een krachtig hulpmiddel, maar geen kristallen bol.</p>
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8">
            <div className="space-y-4 text-sm text-slate-500 leading-relaxed">
              <div>
                <p className="text-slate-800 font-medium mb-1">Een sterke indicator, geen garantie</p>
                <p>De scan voorspelt werkgeluk en retentie zeer sterk, maar er spelen ook andere factoren mee: salaris, leiderschapskwaliteit, werk-privé balans. Daarom combineert u de M-Score altijd met uw eigen gesprekken en beoordeling.</p>
              </div>
              <div>
                <p className="text-slate-800 font-medium mb-1">Gebaseerd op eerlijke antwoorden</p>
                <p>Kandidaten vullen de scan zelf in. De vragen zijn zo ontworpen dat er geen &quot;goede&quot; antwoorden zijn — het gaat om voorkeur, niet om prestatie. Dit maakt sociaal wenselijke antwoorden onwaarschijnlijk.</p>
              </div>
              <div>
                <p className="text-slate-800 font-medium mb-1">Eén persoon vult het organisatieprofiel in</p>
                <p>De cultuur kan per afdeling verschillen. In grote organisaties kan het zinvol zijn om meerdere profielen aan te maken per team of afdeling.</p>
              </div>
              <div>
                <p className="text-slate-800 font-medium mb-1">Onderzocht in Nederland</p>
                <p>Het VU-onderzoek is uitgevoerd met Nederlandse werknemers. Internationaal onderzoek toont aan dat het principe universeel werkt, maar lokale validatie volgt.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusie */}
        <section className="mb-16">
          <div className="bg-purple/5 rounded-2xl border border-purple/20 p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Conclusie</h2>
            <p className="text-slate-500 leading-relaxed text-center max-w-3xl mx-auto mb-4">
              Refurzy combineert wetenschappelijk bewezen matching met ervaren recruiters en AI-technologie. Het resultaat: betere kandidaten, minder risico, en gemiddeld 60% lagere kosten dan een traditioneel bureau.
            </p>
            <p className="text-slate-500 leading-relaxed text-center max-w-3xl mx-auto mb-6">
              No cure, no pay. U betaalt alleen bij een succesvolle plaatsing. Met Fit Garantie.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/demo/onboarding/opdrachtgever" className="btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
                Start vandaag &rarr;
              </Link>
              <Link href="/homepage#pricing" className="border border-purple/30 text-slate-500 font-semibold px-8 py-4 rounded-[10px] text-base hover:border-purple/50 hover:text-slate-800 transition-all">
                Bekijk tarieven
              </Link>
            </div>
            <p className="text-[10px] text-slate-500 text-center italic mt-6">
              Wetenschappelijk gevalideerd door de Vrije Universiteit Amsterdam (2026, N=309).
            </p>
          </div>
        </section>

        {/* Referenties */}
        <section>
          <h2 className="text-xl font-bold mb-4">Referenties</h2>
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
            <div className="space-y-3">
              {[
                'Aberdeen Group. Pre-hire assessments and turnover reduction benchmarks.',
                'Arthur, W., Jr., Bell, S. T., Villado, A. J., & Doverspike, D. (2006). The use of person-organization fit in employment decision making. Journal of Applied Psychology, 91(4), 786-801.',
                'Funder, D. C., & Ozer, D. J. (2019). Evaluating effect size in psychological research. Advances in Methods and Practices in Psychological Science, 2(2), 156-168.',
                'Halbesleben, J. R. B., & Wheeler, A. R. (2008). The relative roles of engagement and embeddedness in predicting job performance and intention to leave. Work & Stress, 22(3), 242-256.',
                'Kristof-Brown, A. L., Zimmerman, R. D., & Johnson, E. C. (2005). Consequences of individuals\' fit at work: A meta-analysis. Personnel Psychology, 58(2), 281-342.',
                'Leadership IQ. Why new hires fail: 46% failure rate within 18 months. Industry report.',
                'O\'Reilly, C. A., Chatman, J., & Caldwell, D. F. (2014). People and organizational culture. Academy of Management Journal, 34(3), 487-516.',
                'Oh, I.-S., Guay, R. P., Kim, K., Harold, C. M., Lee, J.-H., Heo, C.-G., & Shin, K.-H. (2014). Fit happens globally: A meta-analytic comparison of the relationships of person-environment fit dimensions with work attitudes and performance across East Asia, Europe, and North America. Personnel Psychology, 67(1), 99-152.',
                'PRADCO. Culture fit assessment case study: 40% turnover reduction.',
                'ASK/AssessCandidates. Pre-hire culture assessment case study: 59% turnover reduction.',
                'Resume Genius (2024). Hiring manager survey: 81% report ghosting candidates due to uncertainty.',
                'Sackett, P. R., et al. (2024). Revisiting meta-analytic estimates of validity in personnel selection. Journal of Applied Psychology.',
                'SHRM (2024). The Real Costs of Recruitment. N=11.080, 15 landen. Society for Human Resource Management.',
                'SHRM (2025). Average time-to-hire benchmark: 68,5 dagen.',
                'Vrije Universiteit Amsterdam (2026). Profiel Match Scan: empirisch onderzoek naar P-O fit en werkuitkomsten. N=309.',
                'Wnuk, M. & Chudzicka-Czupała, A. (2026). P-O fit, meaning in work and turnover intention. N=1.071.',
              ].map((ref, i) => (
                <p key={i} className="text-sm text-slate-500 leading-relaxed pl-4 border-l-2 border-slate-200">{ref}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Back link */}
        <div className="mt-16 text-center">
          <Link href="/homepage" className="text-slate-500 hover:text-slate-800 text-sm transition-colors">
            &larr; Terug naar homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
