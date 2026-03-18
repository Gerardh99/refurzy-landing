import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="landing-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient orbs via CSS */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <main className="text-center px-6 max-w-[720px] relative z-10 animate-[fadeIn_0.8s_ease-out]">
        <img src="/assets/refurzy-logo-white.png" alt="Refurzy" className="w-[220px] mx-auto mb-[60px]" />

        <h1 className="text-[clamp(1.8rem,5vw,2.6rem)] font-semibold leading-[1.3] mb-5">
          <span className="gradient-text">Redefining Recruitment.</span> Forever.
        </h1>

        <p className="text-[clamp(1rem,2.5vw,1.15rem)] font-light text-[rgba(249,251,255,0.8)] max-w-[560px] mx-auto leading-relaxed mb-4">
          De arbeidsmarkt is drastisch veranderd. De manier waarop we talent werven nauwelijks.
        </p>
        <p className="text-[clamp(0.9rem,2vw,0.95rem)] font-light text-[rgba(249,251,255,0.6)] max-w-[520px] mx-auto leading-relaxed mb-12">
          Refurzy draait het om. Met wetenschap als fundament en technologie als motor maken wij werving sneller, objectiever en voor een fractie van de kosten.
        </p>

        <div className="w-[60px] h-[2px] btn-gradient mx-auto mb-12 rounded-full" />

        <p className="text-[0.85rem] font-medium text-[rgba(249,251,255,0.5)] uppercase tracking-[2px] mb-6">
          Binnenkort live — Wees er als eerste bij
        </p>

        <Link
          href="/login"
          className="inline-block btn-gradient text-white font-semibold px-10 py-3.5 rounded-[10px] text-[0.95rem] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all"
        >
          Demo bekijken
        </Link>

        <p className="mt-[60px] text-[rgba(249,251,255,0.25)] text-[0.75rem]">&copy; 2026 Refurzy B.V. — Alle rechten voorbehouden</p>
      </main>
    </div>
  )
}
