import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="landing-bg min-h-screen flex items-center justify-center relative">
      <main className="text-center px-8 max-w-[700px] relative z-10 animate-[fadeIn_2s_ease-out]">
        {/* Refurzy Logo */}
        <div className="mb-16">
          <img src="/assets/refurzy-logo-white.png" alt="Refurzy" className="h-16 mx-auto drop-shadow-[0_0_30px_rgba(0,229,199,0.15)]" />
        </div>

        <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-white leading-tight mb-6">
          Goedkoper sourcen.<br />
          <span className="text-cyan">Betere matches.</span><br />
          Minder mis-hires.
        </h1>

        <div className="w-[80px] h-[2px] bg-gradient-to-r from-purple via-cyan to-purple mx-auto my-8 opacity-50" />

        <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-[500px] mx-auto">
          Wetenschappelijk gevalideerde matching. No cure, no pay. Ontwikkeld i.s.m. VU Amsterdam.
        </p>

        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="text-center">
            <div className="text-cyan font-bold text-2xl">70%</div>
            <div className="text-gray-500 text-xs">lagere kosten</div>
          </div>
          <div className="w-px h-10 bg-purple/30" />
          <div className="text-center">
            <div className="text-purple-light font-bold text-2xl">&beta;=.30**</div>
            <div className="text-gray-500 text-xs">bewezen effect</div>
          </div>
          <div className="w-px h-10 bg-purple/30" />
          <div className="text-center">
            <div className="text-orange font-bold text-2xl">651%</div>
            <div className="text-gray-500 text-xs">ROI</div>
          </div>
        </div>

        <p className="text-sm text-gray-600 italic">
          Exclusief platform &mdash; toegang via uitnodiging
        </p>
      </main>

      <Link
        href="/login"
        className="fixed bottom-4 right-4 text-gray-700 hover:text-cyan/60 text-xs transition-colors duration-300"
      >
        demo &rarr;
      </Link>
    </div>
  )
}
