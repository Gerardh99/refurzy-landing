'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUser, getRolePath } from '@/lib/auth'
import { User } from '@/lib/types'

const roleLabels: Record<string, string> = {
  opdrachtgever: 'Opdrachtgever',
  scout: 'Talent Scout',
  kandidaat: 'Kandidaat',
  admin: 'Refurzy Admin',
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  return (
    <div className="min-h-screen bg-navy-dark text-white font-[Poppins]">
      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-navy-dark/80 backdrop-blur-md border-b border-purple/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/homepage">
            <img src="/logo-white.png" alt="Refurzy" className="h-7" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#hoe-het-werkt" className="hover:text-white transition-colors">Hoe het werkt</a>
            <a href="#voor-wie" className="hover:text-white transition-colors">Voor wie</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/wetenschap" className="hover:text-white transition-colors">Wetenschap</Link>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center text-purple-light text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs text-gray-400">{user.name}</span>
                <span className="px-1.5 py-0.5 bg-purple/10 rounded text-purple-light text-[10px] font-medium">{roleLabels[user.role]}</span>
              </div>
              <Link href={getRolePath(user.role)} className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
                Ga naar dashboard →
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
                Inloggen
              </Link>
              <Link href="/login" className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
                Gratis starten
              </Link>
            </div>
          )}
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
          <div className="inline-block px-4 py-1.5 bg-cyan/10 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-8 tracking-wider uppercase">
            Redefining Recruitment. Forever.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
            <span className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple bg-clip-text text-transparent">
              Werving gebouwd op wetenschap.
            </span>
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
            Niet op buikgevoel.
          </h1>
          <p className="text-lg md:text-xl text-cyan font-semibold mb-8">
            ROI vanaf 336%. No cure, no pay.
          </p>

          <p className="text-base md:text-lg text-gray-300 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
            46% van nieuwe medewerkers faalt binnen 18 maanden — niet door gebrek aan kwalificaties, maar door een mismatch in cultuur en waarden.
          </p>
          <p className="text-base text-gray-400 font-light max-w-2xl mx-auto mb-10">
            De Matching Scan, ontwikkeld met de Vrije Universiteit Amsterdam, meet die match vóór de aanname. Wetenschappelijk bewezen. No cure, no pay.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/login" className="btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              Start als opdrachtgever →
            </Link>
            <Link href="/login" className="bg-purple/15 text-purple-light font-semibold px-8 py-4 rounded-[10px] text-base border border-purple/20 hover:bg-purple/25 transition-colors">
              Word Talent Scout
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-2">🎓 VU Amsterdam</span>
            <span className="flex items-center gap-2">🔬 35-vragen Matching Scan</span>
            <span className="flex items-center gap-2">💰 No Cure No Pay</span>
          </div>
          <p className="text-[10px] text-gray-700 max-w-lg mx-auto">
            Bronnen: Leadership IQ · SHRM 2024 · VU Amsterdam (De Vries, 2026; N=309) · Resume Genius 2024
          </p>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="border-y border-purple/10 bg-navy-light/50 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '€44k–€175k', label: 'kosten per mis-hire (SHRM, 2024)' },
            { value: '46%', label: 'van hires faalt binnen 18 maanden' },
            { value: '336%+', label: 'ROI bij inzet Refurzy (conservatief)' },
            { value: '81%', label: 'managers twijfelt over aannamebeslissing' },
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
              De uitdaging
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Werving is achterhaald</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">De arbeidsmarkt is drastisch veranderd. De manier waarop we talent werven niet. Processen die ontworpen zijn voor een markt die niet meer bestaat, kosten u meer dan u denkt.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💸',
                title: 'Dure bureaus, nul garantie',
                desc: 'Traditionele bureaus rekenen 20-25% van het jaarsalaris. Dat is €16.200 per hire — zonder garantie op een goede match. Als het misgaat, begint u opnieuw en betaalt u opnieuw.',
                source: 'SHRM, 2024'
              },
              {
                icon: '🚪',
                title: 'Hoog verloop door mismatches',
                desc: 'Eén verkeerde hire kost €44.000 tot €175.000 aan herwervingskosten, productiviteitsverlies en teamschade. En het gebeurt vaker dan u denkt: 46% van nieuwe medewerkers faalt binnen 18 maanden.',
                source: 'SHRM · Leadership IQ'
              },
              {
                icon: '🎯',
                title: 'Buikgevoel in plaats van data',
                desc: '81% van hiring managers is zo onzeker over hun keuze dat ze kandidaten ghosten. Niet uit onwil, maar uit gebrek aan objectieve informatie over wie écht bij de organisatie past.',
                source: 'Resume Genius, 2024'
              },
              {
                icon: '⏳',
                title: 'Steeds korter, steeds duurder',
                desc: 'Een medewerker bleef vroeger zes jaar. Vandaag is dat anderhalf tot twee jaar. Maar de wervingskosten zijn niet gedaald — ze zijn gestegen. De terugverdientijd is korter dan de fee.',
              },
              {
                icon: '😤',
                title: 'Managers willen het niet doen',
                desc: 'Werven is niet waarvoor managers zijn aangenomen. Ze vinden het tijdrovend, onzeker en frustrerend. Als ze het leuk hadden gevonden, waren ze wel recruiter geworden.',
              },
              {
                icon: '🏜️',
                title: 'Krappe markt, dezelfde vijver',
                desc: 'De arbeidsmarkt is krapper dan ooit. Bureaus vissen in dezelfde vijver. Refurzy zet ervaren Talent Scouts in — professionals die al jaren netwerken hebben opgebouwd en weten waar het talent zit.',
              },
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hoe Refurzy werkt</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Drie rollen, één platform. Elke stap is ontworpen om werving sneller, objectiever en eerlijker te maken.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Opdrachtgever */}
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 hover:border-cyan/20 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-cyan/15 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-lg font-semibold mb-3 text-white">Opdrachtgever</h3>
              <ol className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-3"><span className="text-cyan font-bold">1.</span> Plaats een vacature en vul het profiel in</li>
                <li className="flex gap-3"><span className="text-cyan font-bold">2.</span> Bekijk geanonimiseerde kandidaten met M-Score</li>
                <li className="flex gap-3"><span className="text-cyan font-bold">3.</span> Ontgrendel profielen — betaal alleen bij een match</li>
              </ol>
            </div>

            {/* Talent Scout */}
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 hover:border-purple/20 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-purple/15 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="text-lg font-semibold mb-3 text-white">Talent Scout</h3>
              <ol className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-3"><span className="text-purple-light font-bold">1.</span> Bouw je eigen talent pool op</li>
                <li className="flex gap-3"><span className="text-purple-light font-bold">2.</span> Match kandidaten aan openstaande vacatures</li>
                <li className="flex gap-3"><span className="text-purple-light font-bold">3.</span> Verdien 50% van de fee bij een succesvolle plaatsing</li>
              </ol>
            </div>

            {/* Kandidaat */}
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 hover:border-orange/20 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-orange/15 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-lg font-semibold mb-3 text-white">Kandidaat</h3>
              <ol className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-3"><span className="text-orange font-bold">1.</span> Word uitgenodigd door een Talent Scout</li>
                <li className="flex gap-3"><span className="text-orange font-bold">2.</span> Vul de 35-vragen Matching Scan in</li>
                <li className="flex gap-3"><span className="text-orange font-bold">3.</span> Word objectief gematcht aan passende vacatures</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DE OPLOSSING ═══ */}
      <section id="voor-wie" className="py-24 bg-navy-light/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-semibold mb-4 tracking-wider uppercase">
              De oplossing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Refurzy draait het om</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Traditionele werving ontdekt of iemand past bij uw cultuur nádat u heeft geïnvesteerd. Refurzy meet die match vóór de aanname.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🧬', title: 'Matching Scan — ontwikkeld met de VU Amsterdam', desc: 'De Matching Scan meet de fit tussen kandidaat en organisatie op waarden, interesses en cultuur. 35 vragen, 5 minuten, wetenschappelijk gevalideerd (β = .30, p < .01). Ontwikkeld in samenwerking met Prof. Dr. R.E. de Vries van de Vrije Universiteit Amsterdam.', source: 'VU Amsterdam, 2026 (N=309)' },
              { icon: '💰', title: 'No cure, no pay — nul risico', desc: 'Geen abonnement, geen opstartkosten, geen fee als u niemand aanneemt. U betaalt alleen bij een succesvolle plaatsing. Vergelijk dat met €16.200 per hire bij een traditioneel bureau — zonder garantie.', source: 'Op basis van 25% fee bij gemiddeld jaarsalaris' },
              { icon: '🔍', title: 'Ervaren Talent Scouts, niet een algoritme', desc: 'Onze Talent Scouts zijn veelal ervaren recruiters die al jaren in het vak zitten. Zij kennen hun netwerk, weten waar het talent zit en kunnen de strijd aan met de beste bureaus — maar werken voor u, niet voor een bureau.', },
              { icon: '📊', title: 'Data vervangt twijfel', desc: '81% van managers twijfelt bij aannames. De M-Score geeft een objectieve, kwantitatieve indicator van de match. Geen buikgevoel meer, maar wetenschappelijk onderbouwde zekerheid vóór het eerste gesprek.', source: 'Resume Genius, 2024' },
              { icon: '⏱️', title: 'Korte terugverdientijd', desc: 'Bij een gemiddelde verblijfsduur van 1,5 jaar en bureau-fees van 25% is de terugverdientijd van traditionele werving langer dan de medewerker blijft. Refurzy kost een fractie én verlaagt het verloop met 10-30%.', source: 'SHRM 2024 · Kristof-Brown et al., 2005' },
              { icon: '🛡️', title: 'Anoniem tot ontgrendeling', desc: 'Kandidaten worden anoniem gepresenteerd. Pas na akkoord op de voorwaarden krijgt u toegang tot het profiel. Dit voorkomt bias, beschermt privacy en garandeert objectieve beoordeling.', },
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

      {/* ═══ MATCHING SCAN + WETENSCHAP ═══ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-cyan/10 via-[#06BAFF]/10 to-purple/10 rounded-3xl border border-cyan/20 p-10 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-cyan/15 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-4">
                  Ontwikkeld met de Vrije Universiteit Amsterdam
                </div>
                <h2 className="text-3xl font-bold mb-4">De Matching Scan</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  35 vragen. 5 minuten. Eén objectieve score die voorspelt hoe goed een kandidaat past bij uw organisatie — op waarden, interesses en cultuur. Niet op cv-keywords.
                </p>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> 19 werkinteresses — wat motiveert iemand</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> 9 kernwaarden — wat drijft iemand</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> 7 cultuurtypen — waar voelt iemand zich thuis</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> Voorspelt bevlogenheid, tevredenheid én retentie</li>
                </ul>
                <p className="text-[10px] text-gray-600 mt-4 italic">VU Amsterdam (De Vries, 2026; N=309) — β = .30** voor werkbevlogenheid en werktevredenheid, β = .29** voor organisatiebetrokkenheid</p>
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
              <div className="text-3xl font-bold text-cyan mb-2">β = .30**</div>
              <p className="text-sm text-gray-400">Voorspellende waarde voor werkbevlogenheid en tevredenheid</p>
              <p className="text-[10px] text-gray-600 mt-2">Na correctie voor leeftijd, opleiding, salaris</p>
            </div>
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 text-center">
              <div className="text-3xl font-bold text-purple-light mb-2">10–30%</div>
              <p className="text-sm text-gray-400">Verwachte turnover reductie bij systematische inzet</p>
              <p className="text-[10px] text-gray-600 mt-2">SHRM 2023 · Aberdeen Group · Kristof-Brown et al.</p>
            </div>
            <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 text-center">
              <div className="text-3xl font-bold text-orange mb-2">r = −.35</div>
              <p className="text-sm text-gray-400">P-O fit correleert negatief met vertrekintentie</p>
              <p className="text-[10px] text-gray-600 mt-2">Kristof-Brown et al., 2005 (meta-analyse)</p>
            </div>
          </div>

          {/* Hoe het verschilt */}
          <div className="mt-12 bg-navy-light rounded-2xl border border-purple/10 p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Vóór de aanname weten, niet achteraf ontdekken</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-red-500/20 rounded-xl p-5 bg-red-500/5">
                <p className="text-red-400 font-semibold text-sm mb-3">❌ Traditioneel</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Cultuurfit wordt pas ontdekt na aanname</li>
                  <li>Bureau kent uw organisatie nauwelijks</li>
                  <li>Fee betaald, ongeacht uitkomst</li>
                  <li>Gemiddeld 68,5 dagen time-to-hire</li>
                  <li>46% faalt binnen 18 maanden</li>
                </ul>
                <p className="text-[10px] text-gray-600 mt-3 italic">SHRM 2025 · Leadership IQ</p>
              </div>
              <div className="border border-cyan/20 rounded-xl p-5 bg-cyan/5">
                <p className="text-cyan font-semibold text-sm mb-3">✓ Refurzy</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Cultuurfit gemeten vóór het eerste gesprek</li>
                  <li>Ervaren Talent Scouts die uw profiel kennen</li>
                  <li>No cure, no pay — nul risico</li>
                  <li>Objectieve M-Score als beslissingsgrond</li>
                  <li>10-30% minder verloop, aantoonbaar</li>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparante pricing</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-12">
            Geen abonnement. Geen verborgen kosten. U betaalt alleen bij een succesvolle plaatsing.
          </p>

          <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 mb-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple/10">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Werkervaring</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">MBO</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">HBO</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">WO</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { exp: '0-2 jaar', mbo: '€1.800', hbo: '€2.400', wo: '€3.600' },
                  { exp: '2-5 jaar', mbo: '€3.600', hbo: '€4.800', wo: '€7.200' },
                  { exp: '5-10 jaar', mbo: '€5.400', hbo: '€7.200', wo: '€10.800' },
                  { exp: '>10 jaar', mbo: '€7.200', hbo: '€12.000', wo: '€12.000', equal: true },
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

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-navy rounded-xl border border-cyan/20 p-4">
              <div className="text-lg font-bold text-cyan">50%</div>
              <div className="text-[10px] text-gray-500">naar Scout</div>
            </div>
            <div className="bg-navy rounded-xl border border-purple/20 p-4">
              <div className="text-lg font-bold text-purple-light">50%</div>
              <div className="text-[10px] text-gray-500">naar Refurzy</div>
            </div>
            <div className="bg-navy rounded-xl border border-orange/20 p-4">
              <div className="text-lg font-bold text-orange">+30%</div>
              <div className="text-[10px] text-gray-500">exclusiviteit (optioneel)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Veelgestelde vragen</h2>
          <div className="space-y-3">
            {[
              { q: 'Wat kost het als ik geen kandidaat aanneem?', a: 'Niets. Refurzy werkt op basis van no cure, no pay. Geen abonnement, geen opstartkosten. U betaalt alleen wanneer u daadwerkelijk een kandidaat aanneemt. Vergelijk dat met een traditioneel bureau dat €16.200 per hire rekent — ongeacht het resultaat.' },
              { q: 'Hoe werkt de Matching Scan?', a: 'De Matching Scan is een wetenschappelijk assessment van 35 vragen, ontwikkeld in samenwerking met de Vrije Universiteit Amsterdam (Prof. Dr. R.E. de Vries). Het meet de match tussen kandidaat en organisatie op werkinteresses (19 items), kernwaarden (9 items) en cultuurvoorkeur (7 types). Het resultaat is een objectieve M-Score die werkbevlogenheid, tevredenheid en retentie voorspelt (β = .30, p < .01).' },
              { q: 'Hoe betrouwbaar is de M-Score?', a: 'De Matching Scan is gevalideerd door de Vrije Universiteit Amsterdam in een onderzoek met 309 respondenten. De voorspellende waarde (β = .29–.30) is vergelijkbaar met of sterker dan cognitieve capaciteitstests (r = .16, Sackett et al., 2024). De scan vervangt interviews niet, maar geeft een objectief datapunt dat twijfel reduceert.' },
              { q: 'Kan ik als recruiter Talent Scout worden?', a: 'Ja. Elke ervaren recruiter, HR-professional of netwerker kan zich aanmelden als Talent Scout. U bouwt uw eigen talent pool op, matcht kandidaten aan vacatures en verdient 50% van de fee bij elke succesvolle plaatsing. Hoe beter uw track record, hoe hoger uw reputatiescore.' },
              { q: 'Waarom zijn kandidaten anoniem?', a: 'Anonimiteit voorkomt onbewuste bias (halo-effect, similarity-attraction) en zorgt voor objectieve beoordeling op basis van fit, niet op basis van naam, foto of achtergrond. Pas na akkoord op de voorwaarden krijgt u toegang tot het volledige profiel.' },
              { q: 'Hoeveel kan ik besparen?', a: 'Conservatief scenario: ROI vanaf 336%. Voor een klein bedrijf met 3 hires per jaar betekent dit €44.000–€85.000 netto besparing. Voor organisaties met 100+ medewerkers: €72.000–€668.000 per jaar, afhankelijk van turnover reductie en kosten per mis-hire.' },
              { q: 'In welke landen is Refurzy beschikbaar?', a: 'Refurzy start in Nederland en België. Daarna volgt een uitrol naar 13 andere Europese landen, elk met lokale taal, valuta en pricing.' },
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop met gokken op talent.</h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            Elke dag dat u werft op buikgevoel kost het u geld. Start vandaag met wetenschappelijk onderbouwde werving. Geen verplichtingen, geen opstartkosten.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              Start als opdrachtgever →
            </Link>
            <Link href="/login" className="bg-purple/15 text-purple-light font-semibold px-8 py-4 rounded-[10px] text-base border border-purple/20 hover:bg-purple/25 transition-colors">
              Word Talent Scout
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
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Platform</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div>Voor opdrachtgevers</div>
                <div>Voor Talent Scouts</div>
                <div>Voor kandidaten</div>
                <div>Pricing</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Bedrijf</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div>Over Refurzy</div>
                <div>Wetenschap</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Legal</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div>Privacy Policy</div>
                <div>Algemene Voorwaarden</div>
                <div>Cookie Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-purple/10 pt-6 text-center text-xs text-gray-700">
            © 2026 Refurzy B.V. — Alle rechten voorbehouden
          </div>
        </div>
      </footer>
    </div>
  )
}
