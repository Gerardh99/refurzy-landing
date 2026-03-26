// Stijl 3: Soft navy — donker maar sophisticated, geen orbs/glow
export default function Stijl3() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-[Poppins]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/logo-white.png" alt="Refurzy" className="h-7" />
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a className="hover:text-slate-200 transition-colors">Hoe het werkt</a>
            <a className="hover:text-slate-200 transition-colors">Pricing</a>
            <a className="hover:text-slate-200 transition-colors">Wetenschap</a>
          </div>
          <a className="bg-gradient-to-r from-purple to-cyan text-white text-sm font-semibold px-5 py-2.5 rounded-xl">Inloggen</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4 text-white">
            <span className="bg-gradient-to-r from-purple via-[#06BAFF] to-cyan bg-clip-text text-transparent">Redefining Recruitment.</span>
            <br />Forever.
          </h1>
          <p className="text-lg text-slate-400 mb-2 mt-6">Werving gebouwd op wetenschap. Niet op buikgevoel.</p>
          <p className="text-lg text-cyan font-semibold mb-8">ROI vanaf 455%. No cure, no pay.</p>
          <p className="text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Eén verkeerde hire kost 50-200% van het jaarsalaris. Bij een bruto maandsalaris van €5.000 is dat €44.000 tot €175.000. En het overkomt 46% van alle aannames.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a className="bg-gradient-to-r from-purple to-cyan text-white font-semibold px-8 py-4 rounded-xl text-base">Start als opdrachtgever →</a>
            <a className="text-slate-300 font-semibold px-8 py-4 rounded-xl text-base border border-slate-600 hover:border-slate-500 hover:text-white transition-all">Word Talent Scout</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-700/50 bg-[#1e293b]/50 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-4 gap-6 text-center">
          {[
            { value: '50–200%', label: 'van jaarsalaris per mis-hire' },
            { value: '46%', label: 'van hires faalt binnen 18 mnd' },
            { value: '455%+', label: 'ROI bij inzet Refurzy' },
            { value: '81%', label: 'managers twijfelt' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple to-cyan bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Bureaus raden. Wij matchen.</h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">De arbeidsmarkt is drastisch veranderd. De manier waarop we talent werven niet.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '💸', title: 'Dure bureaus, nul garantie', desc: 'Traditionele bureaus rekenen 20-30% van het jaarsalaris — gemiddeld €16.000 per hire. Zonder garantie.' },
              { icon: '🚪', title: 'Hoog verloop door mismatches', desc: 'Eén verkeerde hire kost €44.000 tot €175.000. En 46% faalt binnen 18 maanden.' },
              { icon: '🎯', title: 'Buikgevoel in plaats van data', desc: '81% van hiring managers twijfelt bij aannames. Niet uit onwil, maar uit gebrek aan objectieve informatie.' },
            ].map((c, i) => (
              <div key={i} className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600 transition-all">
                <div className="text-2xl mb-4">{c.icon}</div>
                <h3 className="font-semibold mb-2 text-white">{c.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[#1e293b]/30">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Hoe Refurzy werkt</h2>
          <p className="text-slate-400 text-center max-w-xl mx-auto mb-12">Drie rollen, één platform.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { color: 'cyan', icon: '🏢', title: 'Opdrachtgever', items: ['Beschrijf uw ideale kandidaat', 'Ontvang gematcht talent', 'Bespaar tienduizenden'] },
              { color: 'purple', icon: '🔍', title: 'Talent Scout', items: ['Gebruik je netwerk', 'M-Score bewijst de match', 'Verdien 50% per plaatsing'] },
              { color: 'orange', icon: '👤', title: 'Kandidaat', items: ['Ontdek wat bij je past', 'Word gematcht op wie je bent', 'Vind je droombaan'] },
            ].map((c, i) => (
              <div key={i} className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-8">
                <div className="text-3xl mb-4">{c.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-white">{c.title}</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  {c.items.map((item, j) => <li key={j} className="flex gap-2"><span className={`text-${c.color} font-bold`}>{j+1}.</span> {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-700/50 py-8 text-center text-xs text-slate-500">
        <p className="font-semibold text-lg text-white mb-2">Stijl 3: Soft navy</p>
        <p>Donker thema (slate-900), geen orbs/glow, subtiele borders, zachte kleuren</p>
      </footer>
    </div>
  )
}
