'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculatePrice, formatPrice, ExperienceLevel, EducationLevel, EXPERIENCE_LABELS, EDUCATION_LABELS, COUNTRIES } from '@/lib/pricing'

type Step = 1 | 2 | 3 | 4 | 5 | 6

const STEPS = [
  { nr: 1, label: 'Functie', short: 'Titel' },
  { nr: 2, label: 'Omschrijving', short: 'Tekst' },
  { nr: 3, label: 'Details', short: 'Info' },
  { nr: 4, label: 'Harde criteria', short: 'Criteria' },
  { nr: 5, label: 'Prijs & akkoord', short: 'Prijs' },
  { nr: 6, label: 'M-Score profiel', short: 'Vragen' },
]

const MSCORE_QUESTIONS = [
  { id: 1, category: 'Persoonlijkheid', question: 'In welke mate moet de kandidaat extravert zijn?', labels: ['Introvert', 'Neutraal', 'Extravert'] },
  { id: 2, category: 'Persoonlijkheid', question: 'Hoe belangrijk is nauwkeurigheid en oog voor detail?', labels: ['Niet belangrijk', 'Gemiddeld', 'Essentieel'] },
  { id: 3, category: 'Persoonlijkheid', question: 'Hoe open moet de kandidaat staan voor nieuwe ervaringen?', labels: ['Traditioneel', 'Flexibel', 'Zeer innovatief'] },
  { id: 4, category: 'Persoonlijkheid', question: 'Hoe belangrijk is het dat de kandidaat samenwerking verkiest boven solo werk?', labels: ['Solo werker', 'Flexibel', 'Teamspeler'] },
  { id: 5, category: 'Persoonlijkheid', question: 'Hoe stressbestendig moet de kandidaat zijn?', labels: ['Rustige omgeving', 'Normaal', 'Hoge druk'] },
  { id: 6, category: 'Cognitief', question: 'Hoe belangrijk is analytisch denkvermogen?', labels: ['Niet cruciaal', 'Gemiddeld', 'Zeer belangrijk'] },
  { id: 7, category: 'Cognitief', question: 'Moet de kandidaat snel complexe informatie kunnen verwerken?', labels: ['Nee', 'Soms', 'Dagelijks'] },
  { id: 8, category: 'Cognitief', question: 'Hoe creatief moet de kandidaat problemen kunnen oplossen?', labels: ['Standaard', 'Enige creativiteit', 'Zeer creatief'] },
  { id: 9, category: 'Werkwaarden', question: 'Hoe belangrijk is autonomie in deze functie?', labels: ['Veel sturing', 'Gemiddeld', 'Volledig zelfstandig'] },
  { id: 10, category: 'Werkwaarden', question: 'Hoe ambitieus moet de kandidaat zijn qua groei?', labels: ['Stabiel', 'Enige ambitie', 'Sterk gedreven'] },
  { id: 11, category: 'Werkwaarden', question: 'Hoe belangrijk is work-life balance voor deze rol?', labels: ['Altijd beschikbaar', 'Flexibel', 'Strikte balans'] },
  { id: 12, category: 'Werkwaarden', question: 'Moet de kandidaat intrinsiek gemotiveerd zijn door de inhoud?', labels: ['Niet vereist', 'Deels', 'Essentieel'] },
  { id: 13, category: 'Cultuur', question: 'Hoe formeel is de werkcultuur?', labels: ['Zeer informeel', 'Gemiddeld', 'Formeel'] },
  { id: 14, category: 'Cultuur', question: 'Hoe snel verandert de werkomgeving?', labels: ['Stabiel', 'Enige verandering', 'Snel veranderend'] },
  { id: 15, category: 'Cultuur', question: 'Hoe belangrijk is leiderschapspotentieel?', labels: ['Niet nodig', 'Mooi meegenomen', 'Vereist'] },
]

export default function VacatureAanmakenPage() {
  const [step, setStep] = useState<Step>(1)
  const [aiLoading, setAiLoading] = useState(false)
  const [akkoord, setAkkoord] = useState(false)
  const [published, setPublished] = useState(false)

  const [form, setForm] = useState({
    titel: '',
    afdeling: '',
    omschrijving: '',
    locatie: '',
    salaris: '',
    contractType: 'Vast',
    opKantoor: 'Hybride (3 dagen)',
    maxReistijd: '45 minuten',
    startdatum: '',
    afdelingscultuur: '',
    opleiding: '' as EducationLevel | '',
    ervaring: '' as ExperienceLevel | '',
  })

  const [mscoreAnswers, setMscoreAnswers] = useState<Record<number, number>>({})

  const pricing = COUNTRIES.find(c => c.code === 'NL')!.pricing
  const price = form.opleiding && form.ervaring
    ? calculatePrice(form.ervaring as ExperienceLevel, form.opleiding as EducationLevel, pricing)
    : 0

  const canProceed = () => {
    switch (step) {
      case 1: return form.titel.length > 0
      case 2: return form.omschrijving.length > 20
      case 3: return form.locatie.length > 0 && form.afdelingscultuur.length > 10
      case 4: return form.opleiding !== '' && form.ervaring !== ''
      case 5: return akkoord
      case 6: return Object.keys(mscoreAnswers).length >= 10
      default: return false
    }
  }

  const handleAiGenerate = () => {
    setAiLoading(true)
    setTimeout(() => {
      const titel = form.titel || 'deze functie'
      setForm(f => ({
        ...f,
        omschrijving: `Als ${titel} bij ons bedrijf ben je verantwoordelijk voor het aansturen van strategische projecten en het realiseren van meetbare resultaten.\n\nJe werkt nauw samen met cross-functionele teams om innovatieve oplossingen te ontwikkelen die bijdragen aan onze groeidoelstellingen. Je combineert analytisch denken met een hands-on mentaliteit.\n\nWat je gaat doen:\n• Ontwikkelen en uitvoeren van de strategie voor jouw vakgebied\n• Aansturen van projecten van concept tot oplevering\n• Samenwerken met stakeholders op alle niveaus\n• Analyseren van data en vertalen naar actionable insights\n• Bijdragen aan de doorontwikkeling van processen en tooling\n\nWat wij bieden:\n• Een dynamische werkomgeving met ruimte voor eigen inbreng\n• Persoonlijke ontwikkeling en opleidingsbudget\n• Flexibele werkplek en -tijden\n• Competitief salaris met uitstekende secundaire arbeidsvoorwaarden`
      }))
      setAiLoading(false)
    }, 2000)
  }

  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
          <h2 className="text-2xl font-bold text-ink mb-3">Vacature gepubliceerd!</h2>
          <p className="text-ink-light mb-2"><span className="text-ink font-semibold">{form.titel}</span> staat nu open voor Talent Scouts.</p>
          <p className="text-ink-muted text-sm mb-8">Je ontvangt een melding zodra de eerste kandidaten worden voorgedragen.</p>
          <div className="bg-white rounded-2xl border border-surface-border p-4 mb-8 text-left">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-ink-muted">Prijs:</span> <span className="text-cyan font-semibold">{formatPrice(price, pricing)}</span></div>
              <div><span className="text-ink-muted">Model:</span> <span className="text-green-400">No Cure No Pay</span></div>
              <div><span className="text-ink-muted">Opleiding:</span> <span className="text-ink">{form.opleiding}</span></div>
              <div><span className="text-ink-muted">Ervaring:</span> <span className="text-ink">{EXPERIENCE_LABELS[form.ervaring as ExperienceLevel]}</span></div>
            </div>
          </div>
          <Link href="/demo/opdrachtgever" className="btn-gradient text-white font-semibold px-6 py-3 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            Terug naar dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">← Terug naar dashboard</Link>
        <h1 className="text-2xl font-bold text-ink mt-3">Vacature aanmaken</h1>
        <p className="text-ink-light mt-1">Doorloop de stappen om uw vacature te publiceren</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.nr} className="flex items-center flex-1">
            <button
              onClick={() => s.nr <= step ? setStep(s.nr as Step) : null}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full ${
                s.nr === step ? 'bg-cyan/15 text-cyan border border-cyan/20'
                : s.nr < step ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-pointer'
                : 'bg-surface-muted border border-surface-border text-ink-faint'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                s.nr === step ? 'bg-cyan text-navy-dark' : s.nr < step ? 'bg-green-500 text-white' : 'bg-purple/15 text-ink-faint'
              }`}>{s.nr < step ? '✓' : s.nr}</span>
              <span className="hidden lg:inline">{s.label}</span>
              <span className="lg:hidden">{s.short}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`w-4 h-px mx-1 ${s.nr < step ? 'bg-green-500/30' : 'bg-purple/10'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-8">

        {/* ═══ STEP 1: Functietitel ═══ */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Functietitel &amp; afdeling</h2>
            <p className="text-ink-light text-sm mb-8">Geef de functie een duidelijke titel zodat Talent Scouts de juiste kandidaten kunnen vinden.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Functietitel *</label>
                <input type="text" value={form.titel} onChange={e => setForm(f => ({ ...f, titel: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-faint focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Marketing Manager, Senior Developer, Sales Lead" />
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Afdeling / Team</label>
                <input type="text" value={form.afdeling} onChange={e => setForm(f => ({ ...f, afdeling: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-faint focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Marketing, Engineering, Sales" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Omschrijving met AI ═══ */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Functieomschrijving</h2>
            <p className="text-ink-light text-sm mb-6">Schrijf een aantrekkelijke omschrijving of laat AI een concept genereren.</p>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={handleAiGenerate} disabled={aiLoading || !form.titel}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  aiLoading ? 'bg-purple/20 text-purple cursor-wait'
                  : form.titel ? 'btn-gradient text-white hover:-translate-y-px'
                  : 'bg-gray-700 text-ink-muted cursor-not-allowed'
                }`}>
                {aiLoading ? <><span className="animate-spin">⟳</span> AI schrijft...</> : <>✨ Schrijf met AI</>}
              </button>
              {!form.titel && <span className="text-xs text-ink-faint">Vul eerst een functietitel in (stap 1)</span>}
              {form.titel && !aiLoading && <span className="text-xs text-ink-muted">Genereert een concept op basis van &ldquo;{form.titel}&rdquo;</span>}
            </div>
            <textarea value={form.omschrijving} onChange={e => setForm(f => ({ ...f, omschrijving: e.target.value }))} rows={14}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-faint focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
              placeholder="Beschrijf de functie, verantwoordelijkheden, het team en wat u biedt..." />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-ink-faint">{form.omschrijving.length} tekens</span>
              <span className="text-xs text-ink-faint">Min. 20 tekens</span>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Details + Afdelingscultuur ═══ */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Vacature details</h2>
            <p className="text-ink-light text-sm mb-8">Praktische informatie over de functie en de werkomgeving.</p>
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Locatie *</label>
                <input type="text" value={form.locatie} onChange={e => setForm(f => ({ ...f, locatie: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-faint focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Amsterdam" />
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Salarisindicatie</label>
                <input type="text" value={form.salaris} onChange={e => setForm(f => ({ ...f, salaris: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-faint focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. €4.000 - €5.500" />
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Contracttype</label>
                <select value={form.contractType} onChange={e => setForm(f => ({ ...f, contractType: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  <option>Vast</option><option>Tijdelijk</option><option>Freelance / ZZP</option><option>Stage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Op kantoor</label>
                <select value={form.opKantoor} onChange={e => setForm(f => ({ ...f, opKantoor: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  <option>Op kantoor (5 dagen)</option><option>Hybride (3 dagen)</option><option>Hybride (2 dagen)</option><option>Volledig remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Max reistijd</label>
                <select value={form.maxReistijd} onChange={e => setForm(f => ({ ...f, maxReistijd: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  <option>15 minuten</option><option>30 minuten</option><option>45 minuten</option><option>60 minuten</option><option>Niet van toepassing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Gewenste startdatum</label>
                <input type="date" value={form.startdatum} onChange={e => setForm(f => ({ ...f, startdatum: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors" />
              </div>
            </div>

            {/* Afdelingscultuur */}
            <div className="border-t border-surface-border pt-6">
              <label className="block text-sm text-ink-light mb-1.5">Afdelingscultuur &amp; dynamiek *</label>
              <p className="text-xs text-ink-faint mb-3">
                Beschrijf hoe het team samenwerkt, de sfeer, het tempo en wat het uniek maakt. Dit wordt gedeeld met kandidaten en helpt bij de M-Score matching.
              </p>
              <textarea value={form.afdelingscultuur} onChange={e => setForm(f => ({ ...f, afdelingscultuur: e.target.value }))} rows={4}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-faint focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
                placeholder="bijv. Ons marketingteam van 8 personen werkt in een informele, energieke omgeving. We combineren data-gedreven beslissingen met creatieve brainstorms. Het tempo is hoog maar de sfeer is open en ondersteunend. Fouten maken mag — leren is belangrijker dan perfect zijn." />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-ink-faint">{form.afdelingscultuur.length} tekens</span>
                <span className="text-xs text-ink-faint">Min. 10 tekens</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Harde criteria ═══ */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Harde criteria</h2>
            <p className="text-ink-light text-sm mb-8">Stel de minimale eisen in voor kandidaten op deze vacature.</p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm text-ink-light mb-3">Minimaal opleidingsniveau *</label>
                <div className="space-y-2">
                  {(['MBO', 'HBO', 'WO'] as EducationLevel[]).map(edu => (
                    <button key={edu} onClick={() => setForm(f => ({ ...f, opleiding: edu }))}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        form.opleiding === edu ? 'bg-cyan/15 border-cyan/30 text-cyan' : 'bg-surface-muted border-surface-border text-ink-light hover:border-purple/40 hover:text-ink'
                      }`}>
                      <span>{EDUCATION_LABELS[edu]}</span>
                      <span className="text-xs opacity-60">{edu === 'MBO' ? 'Vocational' : edu === 'HBO' ? 'Applied' : 'Academic'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-3">Minimale werkervaring *</label>
                <div className="space-y-2">
                  {(['0-2', '2-5', '5-10', '10+'] as ExperienceLevel[]).map(exp => (
                    <button key={exp} onClick={() => setForm(f => ({ ...f, ervaring: exp }))}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        form.ervaring === exp ? 'bg-cyan/15 border-cyan/30 text-cyan' : 'bg-surface-muted border-surface-border text-ink-light hover:border-purple/40 hover:text-ink'
                      }`}>
                      <span>{EXPERIENCE_LABELS[exp]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {form.opleiding && form.ervaring && form.opleiding !== 'MBO' && form.ervaring === '10+' && (
              <div className="mt-4 bg-cyan/5 border border-cyan/20 rounded-xl p-3">
                <p className="text-xs text-cyan">ℹ️ Bij &gt;10 jaar ervaring geldt voor HBO en WO hetzelfde tarief.</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ STEP 5: Samenvatting & publiceer ═══ */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Controleer &amp; publiceer</h2>
            <p className="text-ink-light text-sm mb-8">Controleer uw vacature en publiceer deze. Talent Scouts kunnen daarna kandidaten voordragen.</p>

            <div className="bg-surface-muted rounded-2xl border border-surface-border p-6 mb-6">
              <h3 className="text-ink font-semibold mb-4">Samenvatting vacature</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-ink-muted">Functie:</span> <span className="text-ink font-medium">{form.titel}</span></div>
                <div><span className="text-ink-muted">Afdeling:</span> <span className="text-ink">{form.afdeling || '—'}</span></div>
                <div><span className="text-ink-muted">Locatie:</span> <span className="text-ink">{form.locatie}</span></div>
                <div><span className="text-ink-muted">Salaris:</span> <span className="text-ink">{form.salaris || '—'}</span></div>
                <div><span className="text-ink-muted">Contract:</span> <span className="text-ink">{form.contractType}</span></div>
                <div><span className="text-ink-muted">Op kantoor:</span> <span className="text-ink">{form.opKantoor}</span></div>
                <div><span className="text-ink-muted">Opleiding:</span> <span className="text-cyan font-medium">{form.opleiding}</span></div>
                <div><span className="text-ink-muted">Ervaring:</span> <span className="text-cyan font-medium">{EXPERIENCE_LABELS[form.ervaring as ExperienceLevel]}</span></div>
              </div>
              {form.afdelingscultuur && (
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <span className="text-ink-muted text-sm">Afdelingscultuur:</span>
                  <p className="text-gray-300 text-sm mt-1 leading-relaxed">{form.afdelingscultuur}</p>
                </div>
              )}
            </div>

            <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div className="text-sm text-ink-light">
                <p><strong className="text-ink">Hoe werkt het?</strong></p>
                <p className="mt-1">Na publicatie kunnen Talent Scouts kandidaten voordragen. U ontvangt kandidaten met een anonieme M-Score. Wanneer u een profiel wilt bekijken, gaat u akkoord met de plaatsingsovereenkomst. U betaalt alleen bij een succesvolle plaatsing (no cure, no pay).</p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={akkoord} onChange={e => setAkkoord(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-surface-muted accent-cyan" />
              <span className="text-sm text-gray-300 group-hover:text-ink transition-colors">
                Ik bevestig dat de bovenstaande gegevens correct zijn en wil deze vacature publiceren.
              </span>
            </label>
          </div>
        )}

        {/* ═══ STEP 6: M-Score profiel ═══ */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">M-Score profiel invullen</h2>
            <p className="text-ink-light text-sm mb-2">
              Beantwoord onderstaande vragen om het ideale kandidaatprofiel voor <span className="text-ink font-medium">{form.titel}</span> te bepalen.
            </p>
            <p className="text-xs text-ink-muted mb-8">
              {Object.keys(mscoreAnswers).length} / {MSCORE_QUESTIONS.length} vragen beantwoord · Minimaal 10 vereist
            </p>

            <div className="w-full bg-surface-muted rounded-full h-2 mb-8">
              <div className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${(Object.keys(mscoreAnswers).length / MSCORE_QUESTIONS.length) * 100}%` }} />
            </div>

            <div className="space-y-6">
              {MSCORE_QUESTIONS.map((q, idx) => {
                const prevCategory = idx > 0 ? MSCORE_QUESTIONS[idx - 1].category : null
                const showCategory = q.category !== prevCategory
                return (
                  <div key={q.id}>
                    {showCategory && (
                      <div className="flex items-center gap-3 mb-4 mt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple bg-purple/10 px-2.5 py-1 rounded">{q.category}</span>
                        <div className="flex-1 h-px bg-purple/10" />
                      </div>
                    )}
                    <div className="bg-surface-muted rounded-xl border border-surface-border p-5">
                      <p className="text-sm text-ink font-medium mb-4">{q.id}. {q.question}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-ink-faint w-20 text-right">{q.labels[0]}</span>
                        <div className="flex-1 flex justify-between">
                          {[1, 2, 3, 4, 5].map(val => (
                            <button key={val} onClick={() => setMscoreAnswers(a => ({ ...a, [q.id]: val }))}
                              className={`w-10 h-10 rounded-full border-2 text-xs font-bold transition-all ${
                                mscoreAnswers[q.id] === val
                                  ? 'bg-gradient-to-br from-cyan to-purple border-cyan text-white scale-110'
                                  : 'bg-surface-muted border-surface-border text-ink-muted hover:border-purple/40 hover:text-ink'
                              }`}>{val}</button>
                          ))}
                        </div>
                        <span className="text-[10px] text-ink-faint w-20">{q.labels[2]}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface-border">
          <button onClick={() => setStep((step - 1) as Step)} disabled={step === 1}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              step === 1 ? 'text-ink-faint cursor-not-allowed' : 'bg-surface-muted border border-surface-border text-ink-light hover:text-ink'
            }`}>← Vorige</button>

          {step < 6 ? (
            <button onClick={() => setStep((step + 1) as Step)} disabled={!canProceed()}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed() ? 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]' : 'bg-gray-700 text-ink-muted cursor-not-allowed'
              }`}>Volgende →</button>
          ) : (
            <button onClick={() => setPublished(true)} disabled={!canProceed()}
              className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed() ? 'bg-green-500 text-white hover:bg-green-400 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)]' : 'bg-gray-700 text-ink-muted cursor-not-allowed'
              }`}>✓ Publiceer vacature</button>
          )}
        </div>
      </div>
    </div>
  )
}
