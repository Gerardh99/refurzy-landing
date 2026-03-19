'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculatePrice, formatPrice, ExperienceLevel, EducationLevel, EXPERIENCE_LABELS, EDUCATION_LABELS, COUNTRIES } from '@/lib/pricing'
import {
  werkzaamheden,
  werkzaamhedenRatingScale,
  type ScaleOption,
} from '@/lib/matching-scan'

type Step = 1 | 2 | 3 | 4 | 5 | 6
type WerkzaamhedenSubStep = 'ranking' | 'rating'

const STEPS = [
  { nr: 1, label: 'Functie', short: 'Titel' },
  { nr: 2, label: 'Omschrijving', short: 'Tekst' },
  { nr: 3, label: 'Details', short: 'Info' },
  { nr: 4, label: 'Harde criteria', short: 'Criteria' },
  { nr: 5, label: 'Controleer & publiceer', short: 'Publiceer' },
  { nr: 6, label: 'Werkzaamheden', short: 'M-Score' },
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

  // Werkzaamheden state (step 6)
  const [werkzaamhedenSubStep, setWerkzaamhedenSubStep] = useState<WerkzaamhedenSubStep>('ranking')
  const [werkzaamhedenRankings, setWerkzaamhedenRankings] = useState<Record<string, number>>({})
  const [werkzaamhedenRatings, setWerkzaamhedenRatings] = useState<Record<string, number>>({})

  // Mock: organisation profile status
  const orgProfileFilled = true

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
      case 6: {
        if (werkzaamhedenSubStep === 'ranking') {
          const vals = Object.values(werkzaamhedenRankings)
          return vals.length >= 19 && new Set(vals).size >= 19
        }
        return Object.keys(werkzaamhedenRatings).length >= 19
      }
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

  const handleStep6Next = () => {
    if (werkzaamhedenSubStep === 'ranking') {
      const vals = Object.values(werkzaamhedenRankings)
      if (vals.length >= 19 && new Set(vals).size >= 19) {
        setWerkzaamhedenSubStep('rating')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // All ratings filled — publish
      setPublished(true)
    }
  }

  const handleStep6Back = () => {
    if (werkzaamhedenSubStep === 'rating') {
      setWerkzaamhedenSubStep('ranking')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setStep(5)
    }
  }

  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-4xl mx-auto mb-6">&#10003;</div>
          <h2 className="text-2xl font-bold text-ink mb-3">Vacature gepubliceerd!</h2>
          <p className="text-ink-light mb-2"><span className="text-ink font-semibold">{form.titel}</span> staat nu open voor Talent Scouts.</p>
          <p className="text-ink-muted text-sm mb-4">Je ontvangt een melding zodra de eerste kandidaten worden voorgedragen.</p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-6 text-sm text-green-400 font-medium">
            M-Score profiel compleet &mdash; kandidaten worden automatisch gematcht.
          </div>
          <div className="bg-white rounded-2xl border border-surface-border p-4 mb-8 text-left">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-ink-muted">Model:</span> <span className="text-green-400">No Cure No Pay</span></div>
              <div><span className="text-ink-muted">Locatie:</span> <span className="text-ink">{form.locatie}</span></div>
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
        <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">&larr; Terug naar dashboard</Link>
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
                : 'bg-surface-muted border border-surface-border text-ink-muted'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                s.nr === step ? 'bg-cyan text-navy-dark' : s.nr < step ? 'bg-green-500 text-white' : 'bg-purple/15 text-ink-muted'
              }`}>{s.nr < step ? '\u2713' : s.nr}</span>
              <span className="hidden lg:inline">{s.label}</span>
              <span className="lg:hidden">{s.short}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`w-4 h-px mx-1 ${s.nr < step ? 'bg-green-500/30' : 'bg-purple/10'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-8">

        {/* Step 1: Functietitel */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Functietitel &amp; afdeling</h2>
            <p className="text-ink-light text-sm mb-8">Geef de functie een duidelijke titel zodat Talent Scouts de juiste kandidaten kunnen vinden.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Functietitel *</label>
                <input type="text" value={form.titel} onChange={e => setForm(f => ({ ...f, titel: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Marketing Manager, Senior Developer, Sales Lead" />
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Afdeling / Team</label>
                <input type="text" value={form.afdeling} onChange={e => setForm(f => ({ ...f, afdeling: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Marketing, Engineering, Sales" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Omschrijving met AI */}
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
                {aiLoading ? <><span className="animate-spin">&#10227;</span> AI schrijft...</> : <>&#10024; Schrijf met AI</>}
              </button>
              {!form.titel && <span className="text-xs text-ink-muted">Vul eerst een functietitel in (stap 1)</span>}
              {form.titel && !aiLoading && <span className="text-xs text-ink-muted">Genereert een concept op basis van &ldquo;{form.titel}&rdquo;</span>}
            </div>
            <textarea value={form.omschrijving} onChange={e => setForm(f => ({ ...f, omschrijving: e.target.value }))} rows={14}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
              placeholder="Beschrijf de functie, verantwoordelijkheden, het team en wat u biedt..." />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-ink-muted">{form.omschrijving.length} tekens</span>
              <span className="text-xs text-ink-muted">Min. 20 tekens</span>
            </div>
          </div>
        )}

        {/* Step 3: Details + Afdelingscultuur */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Vacature details</h2>
            <p className="text-ink-light text-sm mb-8">Praktische informatie over de functie en de werkomgeving.</p>
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Locatie *</label>
                <input type="text" value={form.locatie} onChange={e => setForm(f => ({ ...f, locatie: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. Amsterdam" />
              </div>
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Salarisindicatie</label>
                <input type="text" value={form.salaris} onChange={e => setForm(f => ({ ...f, salaris: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder="bijv. &euro;4.000 - &euro;5.500" />
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
              <p className="text-xs text-ink-muted mb-3">
                Beschrijf hoe het team samenwerkt, de sfeer, het tempo en wat het uniek maakt. Dit wordt gedeeld met kandidaten en helpt bij de M-Score matching.
              </p>
              <textarea value={form.afdelingscultuur} onChange={e => setForm(f => ({ ...f, afdelingscultuur: e.target.value }))} rows={4}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
                placeholder="bijv. Ons marketingteam van 8 personen werkt in een informele, energieke omgeving. We combineren data-gedreven beslissingen met creatieve brainstorms. Het tempo is hoog maar de sfeer is open en ondersteunend. Fouten maken mag — leren is belangrijker dan perfect zijn." />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-ink-muted">{form.afdelingscultuur.length} tekens</span>
                <span className="text-xs text-ink-muted">Min. 10 tekens</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Harde criteria */}
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
                <p className="text-xs text-cyan">&#8505;&#65039; Bij &gt;10 jaar ervaring geldt voor HBO en WO hetzelfde tarief.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Samenvatting & publiceer */}
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
                  <p className="text-ink-light text-sm mt-1 leading-relaxed">{form.afdelingscultuur}</p>
                </div>
              )}
            </div>

            <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-lg">&#128161;</span>
              <div className="text-sm text-ink-light">
                <p><strong className="text-ink">Hoe werkt het?</strong></p>
                <p className="mt-1">Na publicatie kunnen Talent Scouts kandidaten voordragen. U ontvangt kandidaten met een anonieme M-Score. Wanneer u een profiel wilt bekijken, gaat u akkoord met de plaatsingsovereenkomst. U betaalt alleen bij een succesvolle plaatsing (no cure, no pay).</p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={akkoord} onChange={e => setAkkoord(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-surface-muted accent-cyan" />
              <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
                Ik bevestig dat de bovenstaande gegevens correct zijn en wil deze vacature publiceren.
              </span>
            </label>
          </div>
        )}

        {/* Step 6: Werkzaamheden profiel */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">
              Werkzaamheden profiel &mdash; specifiek voor {form.titel || 'deze vacature'}
            </h2>
            <p className="text-ink-light text-sm mb-2">
              Geef aan welke werkzaamheden het meest relevant zijn voor deze functie. Dit bepaalt de M-Score matching.
            </p>
            <p className="text-xs text-ink-muted mb-4">
              Uw organisatieprofiel (waarden &amp; kenmerken) wordt automatisch gecombineerd.
            </p>

            {/* Org profile status banner */}
            {orgProfileFilled ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
                <span className="text-green-400">&#8505;&#65039;</span>
                <span className="text-green-400 text-sm font-medium">Organisatieprofiel: &#10003; Ingevuld</span>
              </div>
            ) : (
              <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-6 flex items-center gap-2">
                <span className="text-orange">&#9888;&#65039;</span>
                <span className="text-orange text-sm">
                  Niet ingevuld &mdash;{' '}
                  <Link href="/demo/opdrachtgever/matching-profiel" className="underline font-medium hover:text-orange/80">
                    vul eerst uw organisatieprofiel in
                  </Link>
                </span>
              </div>
            )}

            {/* Sub-step progress */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                werkzaamhedenSubStep === 'ranking' ? 'bg-cyan/15 text-cyan border border-cyan/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  werkzaamhedenSubStep === 'ranking' ? 'bg-cyan text-navy-dark' : 'bg-green-500 text-white'
                }`}>{werkzaamhedenSubStep === 'ranking' ? 'a' : '\u2713'}</span>
                Rangorde
              </div>
              <div className="w-6 h-px bg-purple/10" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                werkzaamhedenSubStep === 'rating' ? 'bg-cyan/15 text-cyan border border-cyan/20' : 'bg-surface-muted border border-surface-border text-ink-muted'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  werkzaamhedenSubStep === 'rating' ? 'bg-cyan text-navy-dark' : 'bg-purple/15 text-ink-muted'
                }`}>b</span>
                Beoordeling
              </div>
            </div>

            {/* Sub-step content */}
            {werkzaamhedenSubStep === 'ranking' && (
              <WerkzaamhedenRankingStep
                rankings={werkzaamhedenRankings}
                onChange={(id, v) => setWerkzaamhedenRankings(prev => ({ ...prev, [id]: v }))}
              />
            )}

            {werkzaamhedenSubStep === 'rating' && (
              <WerkzaamhedenRatingStep
                ratings={werkzaamhedenRatings}
                onChange={(id, v) => setWerkzaamhedenRatings(prev => ({ ...prev, [id]: v }))}
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface-border">
          {step === 6 ? (
            <button onClick={handleStep6Back}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-surface-muted border border-surface-border text-ink-light hover:text-ink">
              &larr; {werkzaamhedenSubStep === 'rating' ? 'Terug naar rangorde' : 'Vorige'}
            </button>
          ) : (
            <button onClick={() => setStep((step - 1) as Step)} disabled={step === 1}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                step === 1 ? 'text-ink-muted cursor-not-allowed' : 'bg-surface-muted border border-surface-border text-ink-light hover:text-ink'
              }`}>&larr; Vorige</button>
          )}

          {step < 6 ? (
            <button onClick={() => setStep((step + 1) as Step)} disabled={!canProceed()}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed() ? 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]' : 'bg-gray-700 text-ink-muted cursor-not-allowed'
              }`}>Volgende &rarr;</button>
          ) : (
            <button onClick={handleStep6Next} disabled={!canProceed()}
              className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed()
                  ? werkzaamhedenSubStep === 'rating'
                    ? 'bg-green-500 text-white hover:bg-green-400 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)]'
                    : 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]'
                  : 'bg-gray-700 text-ink-muted cursor-not-allowed'
              }`}>
              {werkzaamhedenSubStep === 'rating' ? '\u2713 Publiceer vacature' : 'Volgende \u2192'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Werkzaamheden Ranking Sub-step ─────────────────────────────────────────

function WerkzaamhedenRankingStep({
  rankings,
  onChange,
}: {
  rankings: Record<string, number>
  onChange: (id: string, value: number) => void
}) {
  const usedValues = new Set(Object.values(rankings))
  const options = Array.from({ length: 19 }, (_, i) => i + 1)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-ink">Rangschik de werkzaamheden</h3>
        <p className="text-ink-light text-sm mt-1">
          Geef elke werkzaamheid een unieke rangorde van 1 (minst relevant voor de vacature) tot 19 (meest relevant). Elk nummer mag maar één keer gebruikt worden.
        </p>
      </div>

      <div className="space-y-3">
        {werkzaamheden.map((item) => {
          const currentVal = rankings[item.id]
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 border-b border-surface-border pb-3 last:border-0 last:pb-0"
            >
              <select
                value={currentVal || ''}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10)
                  if (!isNaN(v)) onChange(item.id, v)
                }}
                className="w-20 shrink-0 mt-0.5 rounded-lg border border-surface-border bg-surface text-ink text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/40"
              >
                <option value="">&mdash;</option>
                {options.map((n) => {
                  const taken = usedValues.has(n) && currentVal !== n
                  return (
                    <option key={n} value={n} disabled={taken}>
                      {n}{taken ? ' (in gebruik)' : ''}
                    </option>
                  )
                })}
              </select>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{item.labelOrg}</p>
                <p className="text-xs text-ink-muted mt-0.5">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-ink-muted">
        {Object.keys(rankings).length} van 19 ingevuld
      </p>
    </div>
  )
}

// ─── Werkzaamheden Rating Sub-step ──────────────────────────────────────────

function WerkzaamhedenRatingStep({
  ratings,
  onChange,
}: {
  ratings: Record<string, number>
  onChange: (id: string, value: number) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-ink">Beoordeel elke werkzaamheid</h3>
        <p className="text-ink-light text-sm mt-1">
          Geef aan in welke mate deze werkzaamheid relevant is voor de vacature.
        </p>
      </div>

      {/* Scale legend */}
      <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
        {werkzaamhedenRatingScale.filter((s) => s.label).map((s) => (
          <span key={s.value} className="bg-surface-muted px-2 py-1 rounded">
            {s.value} = {s.label}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {werkzaamheden.map((item) => {
          const currentVal = ratings[item.id]
          return (
            <div
              key={item.id}
              className="border-b border-surface-border pb-4 last:border-0 last:pb-0 space-y-2"
            >
              <div>
                <p className="text-sm font-medium text-ink">{item.labelOrg}</p>
                <p className="text-xs text-ink-muted">{item.description}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {werkzaamhedenRatingScale.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onChange(item.id, s.value)}
                    title={s.label || String(s.value)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentVal === s.value
                        ? 'bg-cyan text-navy-dark ring-2 ring-cyan/40'
                        : 'bg-surface-muted border border-surface-border text-ink-light hover:border-cyan/30'
                    }`}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-ink-muted">
        {Object.keys(ratings).length} van 19 beoordeeld
      </p>
    </div>
  )
}
