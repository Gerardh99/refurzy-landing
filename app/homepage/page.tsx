'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Inloggen
            </Link>
            <Link href="/login" className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              Gratis starten
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
          <div className="inline-block px-4 py-1.5 bg-cyan/10 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-8 tracking-wider uppercase">
            No Cure No Pay — Binnenkort live
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple bg-clip-text text-transparent">
              Werving die werkt.
            </span>
            <br />
            Wetenschappelijk bewezen.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
            Waar een hire vroeger zes jaar bleef, is dat vandaag anderhalf jaar.
            Toch blijven wervingsprocessen achterhaald en onnodig duur.
          </p>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto mb-10">
            Refurzy combineert een wetenschappelijk assessment met een netwerk van Talent Scouts.
            Het resultaat: betere matches, sneller en voor een fractie van de kosten.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/login" className="btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              Start als opdrachtgever →
            </Link>
            <Link href="/login" className="bg-purple/15 text-purple-light font-semibold px-8 py-4 rounded-[10px] text-base border border-purple/20 hover:bg-purple/25 transition-colors">
              Word Talent Scout
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">🎓 VU Amsterdam</span>
            <span className="flex items-center gap-2">🔬 35-vragen M-Score</span>
            <span className="flex items-center gap-2">💰 No Cure No Pay</span>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="border-y border-purple/10 bg-navy-light/50 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '60%', label: 'goedkoper dan traditionele werving' },
            { value: '35', label: 'wetenschappelijke vragen in de M-Score' },
            { value: '< 5 min', label: 'assessment invullen' },
            { value: '50/50', label: 'eerlijke verdeling Scout & platform' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
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
                <li className="flex gap-3"><span className="text-orange font-bold">2.</span> Vul de 35-vragen M-Score assessment in</li>
                <li className="flex gap-3"><span className="text-orange font-bold">3.</span> Word objectief gematcht aan passende vacatures</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VOOR WIE / USPs ═══ */}
      <section id="voor-wie" className="py-24 bg-navy-light/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Waarom Refurzy</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Gebouwd op wetenschap. Aangedreven door technologie. Eerlijk voor iedereen.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🧬', title: 'Wetenschappelijk onderbouwd', desc: 'De M-Score is ontwikkeld i.s.m. Prof. Dr. R.E. de Vries van de Vrije Universiteit Amsterdam. Gebaseerd op Big Five persoonlijkheid, cognitieve capaciteit en werkwaarden.' },
              { icon: '💰', title: 'No Cure No Pay', desc: 'Geen abonnementskosten, geen opstartkosten. U betaalt alleen wanneer u daadwerkelijk een kandidaat aanneemt. De prijs hangt af van werkervaring en opleidingsniveau.' },
              { icon: '🎯', title: 'Objectieve matching', desc: 'Geen onderbuikgevoel meer. De M-Score matcht kandidaten objectief op basis van 35 wetenschappelijke vragen. Elke kandidaat wordt eerlijk beoordeeld.' },
              { icon: '🕵️', title: 'Anoniem tot ontgrendeling', desc: 'Kandidaten worden anoniem gepresenteerd. Pas na het tekenen van de voorwaarden krijgt u toegang tot het volledige profiel en contactgegevens.' },
              { icon: '⚡', title: 'Sneller dan traditioneel', desc: 'Geen weken wachten op shortlists. Talent Scouts leveren voorgescreende kandidaten. De M-Score filtert direct op fit met uw vacature.' },
              { icon: '🤝', title: 'Eerlijk voor Scouts', desc: 'Talent Scouts ontvangen 50% van de vergoeding. Bouw een reputatiescore op en verdien meer. Master Scouts krijgen prioriteit.' },
            ].map(usp => (
              <div key={usp.title} className="bg-navy-light rounded-2xl border border-purple/10 p-6 flex gap-5 hover:border-purple/20 transition-colors">
                <div className="text-3xl flex-shrink-0">{usp.icon}</div>
                <div>
                  <h3 className="text-white font-semibold mb-2">{usp.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{usp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ M-SCORE SECTIE ═══ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-cyan/10 via-[#06BAFF]/10 to-purple/10 rounded-3xl border border-cyan/20 p-10 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-cyan/15 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-4">
                  Wetenschappelijke basis
                </div>
                <h2 className="text-3xl font-bold mb-4">De M-Score</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  35 vragen. 5 minuten. Eén objectieve score die voorspelt hoe goed een kandidaat past bij uw vacature.
                </p>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> Big Five persoonlijkheidsmeting</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> Cognitieve capaciteit</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> Werkwaarden en motivatie</li>
                  <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs">✓</span> Ontwikkeld met VU Amsterdam</li>
                </ul>
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
              { q: 'Wat kost het als ik geen kandidaat aanneem?', a: 'Niets. Refurzy werkt op basis van No Cure No Pay. U betaalt alleen wanneer u daadwerkelijk een kandidaat aanneemt via het platform.' },
              { q: 'Hoe werkt de M-Score?', a: 'De M-Score is een wetenschappelijk assessment van 35 vragen, ontwikkeld i.s.m. de Vrije Universiteit Amsterdam. Het meet persoonlijkheid (Big Five), cognitieve capaciteit en werkwaarden om een objectieve match-score te berekenen.' },
              { q: 'Kan ik als recruiter Talent Scout worden?', a: 'Ja! Elke recruiter, HR-professional of netwerker kan zich aanmelden als Talent Scout. U bouwt uw eigen talent pool op en verdient 50% van de fee bij elke succesvolle plaatsing.' },
              { q: 'Waarom zijn kandidaten anoniem?', a: 'Anonimiteit voorkomt onbewuste bias en zorgt voor objectieve beoordeling. Pas na het ontgrendelen van een profiel (en akkoord op de voorwaarden) krijgt u toegang tot de identiteit en contactgegevens.' },
              { q: 'In welke landen is Refurzy beschikbaar?', a: 'Refurzy start in Nederland en België. Daarna volgt een uitrol naar 13 andere Europese landen, elk met lokale taal en valuta.' },
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Klaar om werving te veranderen?</h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            Meld u aan als opdrachtgever of word Talent Scout. Geen verplichtingen, geen opstartkosten.
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
                Redefining recruitment met wetenschap en technologie.
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
