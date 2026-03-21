'use client'

import { useState, useEffect } from 'react'
import { getUser } from '@/lib/auth'
import { UserRole } from '@/lib/types'

// ─── FAQ data per role ─────────────────────────────────────────────────────────

interface FaqItem {
  q: string
  a: string
  roles: UserRole[] | 'all'
}

const faqItems: FaqItem[] = [
  // ── Algemeen (alle rollen) ──
  {
    q: 'Wat is de M-Score?',
    a: 'De M-Score is het resultaat van de wetenschappelijke Matching Scan, ontwikkeld met de Vrije Universiteit Amsterdam. De score (0-100%) meet hoe goed een kandidaat past bij een organisatie op drie dimensies: werkzaamheden, waarden en organisatiekenmerken. Een M-Score van 80% of hoger activeert de Fit Garantie.',
    roles: 'all',
  },
  {
    q: 'Wat is de Fit Garantie?',
    a: 'Bij een M-Score van 80% of hoger biedt Refurzy een Fit Garantie van 12 maanden. Als de kandidaat binnen die periode vertrekt (niet op eigen initiatief), ontvangt de opdrachtgever een gratis vervangende kandidaat of restitutie van de fee.',
    roles: 'all',
  },
  {
    q: 'Hoe werkt het no cure, no pay model?',
    a: 'U betaalt alleen als een kandidaat daadwerkelijk wordt aangenomen. Het bekijken van anonieme voordrachten is gratis. Pas wanneer u een profiel wilt ontgrendelen, gaat u akkoord met de plaatsingsvoorwaarden. De fee wordt pas gefactureerd na ondertekening van het arbeidscontract.',
    roles: 'all',
  },
  {
    q: 'Kan ik direct berichten sturen naar andere gebruikers?',
    a: 'Nee. Refurzy gebruikt een gestructureerd communicatiemodel zonder vrije berichten. Alle communicatie verloopt via: (1) gestructureerde toelichtingen bij voordrachten, (2) gestructureerde feedback bij afwijzingen, (3) automatische herinneringen bij vertragingen, en (4) statusnotificaties. Dit beschermt de kwaliteit van het proces en de anonimiteit van kandidaten.',
    roles: 'all',
  },

  // ── Opdrachtgever ──
  {
    q: 'Hoe lang heb ik om een voordracht te reviewen?',
    a: 'U heeft 7 dagen om een voordracht te reviewen. Op dag 3 en dag 6 ontvangt u een herinnering. Reageert u niet binnen 7 dagen, dan wordt de voordracht automatisch geannuleerd en keert de kandidaat terug naar de talent pool van de scout.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Wat gebeurt er als ik een profiel ontgrendel?',
    a: 'Wanneer u een profiel ontgrendelt, gaat u akkoord met de plaatsingsovereenkomst en worden de contactgegevens van de kandidaat zichtbaar. U heeft vervolgens 7 dagen om een kennismakingsgesprek te plannen.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Hoe wordt de plaatsingsfee berekend?',
    a: 'De fee is gebaseerd op het opleidingsniveau en de werkervaring van de kandidaat. De exacte prijs wordt vooraf getoond bij elke vacature. Voorbeeld: een WO-kandidaat met 5-10 jaar ervaring kost \u20AC10.800 excl. BTW. Zie de pricingpagina voor het volledige overzicht.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Wat zijn de maximale doorlooptijden per fase?',
    a: 'Refurzy hanteert maximale doorlooptijden om een snel en professioneel wervingsproces te garanderen:\n\n\u2022 Review voordracht: 7 dagen\n\u2022 Gesprek plannen (na ontgrendeling): 7 dagen\n\u2022 Gesprek laten plaatsvinden: 10 dagen\n\u2022 Feedback geven na gesprek: 7 dagen\n\u2022 Vervolggesprek: 10 dagen\n\u2022 Arbeidsvoorwaardenfase: 14 dagen\n\nBij overschrijding stuurt Refurzy automatisch herinneringen. Na de deadline wordt geescaleerd.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Kan ik meerdere vacatures tegelijk open hebben?',
    a: 'Ja, u kunt zoveel vacatures aanmaken als u wilt. Elke vacature krijgt een eigen M-Score profiel en kan onafhankelijk kandidaten ontvangen van verschillende Talent Scouts.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Wat is de exclusiviteitsoptie?',
    a: 'Bij het aanmaken van een vacature kunt u exclusiviteit activeren (+25% op de plaatsingsfee). Kandidaten die worden voorgedragen zijn dan 14 dagen exclusief beschikbaar voor uw vacature en worden niet aan andere opdrachtgevers aangeboden voor vacatures in hetzelfde vakgebied. Sollicitaties in andere vakgebieden lopen gewoon door — een vacature in een heel ander vakgebied is immers geen concurrent voor uw positie. Let op: exclusiviteit is onherroepelijk — eenmaal geactiveerd kan het niet meer worden uitgeschakeld voor die vacature.',
    roles: ['opdrachtgever'],
  },

  // ── Scout ──
  {
    q: 'Hoe verdien ik als Talent Scout?',
    a: 'Bij elke succesvolle plaatsing ontvangt u 50% van de plaatsingsfee (excl. BTW). De uitbetaling vindt plaats nadat het contract is getekend en bevestigd door de opdrachtgever. Uw verdiensten zijn zichtbaar in het Verdiensten-dashboard.',
    roles: ['scout'],
  },
  {
    q: 'Wat is een Pro Scout?',
    a: 'Na 2 succesvolle plaatsingen kunt u upgraden naar Pro Scout. Hiervoor heeft u een KVK-registratie nodig. Pro Scouts krijgen toegang tot extra features en een hogere zichtbaarheid op het platform.',
    roles: ['scout'],
  },
  {
    q: 'Moet ik zelf opdrachtgevers herinneren?',
    a: 'Nee. Refurzy stuurt automatisch herinneringen naar opdrachtgevers bij vertragingen. U hoeft zelf geen actie te ondernemen. Het systeem bewaakt alle doorlooptijden en escaleert automatisch als dat nodig is.',
    roles: ['scout'],
  },
  {
    q: 'Wat zijn de doorlooptijden waar het systeem op bewaakt?',
    a: 'Het systeem hanteert de volgende maximale doorlooptijden:\n\n\u2022 Review voordracht: 7 dagen (herinnering op dag 3 en 6)\n\u2022 Gesprek plannen na ontgrendeling: 7 dagen (herinnering op dag 4 en 6)\n\u2022 Gesprek laten plaatsvinden: 10 dagen\n\u2022 Feedback na gesprek: 7 dagen (herinnering op dag 5 en 6)\n\u2022 Arbeidsvoorwaardenfase: 14 dagen (herinnering op dag 10)\n\nBij overschrijding ontvangt u een notificatie en neemt Refurzy contact op met de opdrachtgever.',
    roles: ['scout'],
  },
  {
    q: 'Wat gebeurt er als een voordracht verloopt?',
    a: 'Als een opdrachtgever niet binnen 7 dagen reageert op een voordracht, wordt deze automatisch geannuleerd. De kandidaat keert terug naar uw talent pool en kan opnieuw worden voorgedragen voor een andere vacature. Uitzondering: bij een exclusieve vacature blijft de kandidaat geblokkeerd tot de 14-dagen exclusiviteitsperiode is verstreken.',
    roles: ['scout'],
  },
  {
    q: 'Kan ik een kandidaat op meerdere vacatures tegelijk voordragen?',
    a: 'Nee. Zodra een kandidaat is voorgedragen op een vacature, is deze geblokkeerd voor andere voordrachten zolang het proces loopt. Na een afwijzing of verlopen voordracht komt de kandidaat direct vrij. Bij exclusieve vacatures geldt een minimale blokkade van 14 dagen, maar alleen voor vacatures in hetzelfde vakgebied — sollicitaties in andere vakgebieden lopen gewoon door. U ziet in uw talent pool een indicator wanneer een kandidaat geblokkeerd is.',
    roles: ['scout'],
  },
  {
    q: 'Wat betekent het als een vacature exclusief is?',
    a: 'Bij een exclusieve vacature betaalt de opdrachtgever 25% extra bij een succesvolle plaatsing. In ruil daarvoor zijn voorgedragen kandidaten 14 dagen exclusief beschikbaar en worden niet aan andere opdrachtgevers aangeboden voor vacatures in hetzelfde vakgebied. Lopende sollicitaties van de kandidaat in andere vakgebieden worden niet geraakt — alleen overlappende functies worden gepauzeerd. De exclusiviteitstoeslag wordt 50/50 verdeeld, dus u ontvangt ook meer fee.\n\nLet op: wanneer u een kandidaat voordraagt op een exclusieve vacature en deze kandidaat heeft lopende sollicitaties in hetzelfde vakgebied, krijgt u een melding. De kandidaat moet hiermee ook akkoord gaan voordat de voordracht kan worden ingediend.',
    roles: ['scout'],
  },
  {
    q: 'Kan een kandidaat door meerdere scouts worden bemiddeld?',
    a: 'Ja. Een kandidaat kan in de talent pool van meerdere scouts staan en door elk van hen worden voorgedragen op vacatures. Wel geldt: een kandidaat kan slechts één keer op dezelfde vacature worden voorgedragen — de scout die als eerste voordraagt wint die voordracht (first-come-first-served). De plaatsingsfee gaat naar de scout wiens voordracht leidt tot een succesvolle plaatsing. U ziet een melding "reeds voorgedragen door een andere scout" als een andere scout de kandidaat al heeft voorgedragen op dezelfde vacature.',
    roles: ['scout'],
  },
  {
    q: 'Hoe werkt de Matching Scan voor mijn kandidaten?',
    a: 'U nodigt kandidaten uit via het platform. Zij ontvangen een e-mail met een link naar de Matching Scan (35 vragen, ~10 minuten). Na invulling wordt de M-Score automatisch berekend en zichtbaar in uw talent pool.',
    roles: ['scout'],
  },

  // ── Kandidaat ──
  {
    q: 'Hoe lang duurt de Matching Scan?',
    a: 'De Matching Scan bestaat uit 35 vragen en duurt gemiddeld 10 minuten. Er zijn geen goede of foute antwoorden. De scan meet uw voorkeuren op het gebied van werkzaamheden, waarden en organisatiecultuur.',
    roles: ['kandidaat'],
  },
  {
    q: 'Wie kan mijn profiel zien?',
    a: 'Uw profiel is standaard anoniem. Opdrachtgevers zien alleen uw initialen, M-Score en harde criteria (opleiding, ervaring). Pas wanneer een opdrachtgever besluit uw profiel te ontgrendelen (en akkoord gaat met de plaatsingsovereenkomst) worden uw contactgegevens zichtbaar.',
    roles: ['kandidaat'],
  },
  {
    q: 'Kost het mij iets om via Refurzy te solliciteren?',
    a: 'Nee, Refurzy is volledig gratis voor kandidaten. De kosten worden gedragen door de opdrachtgever bij een succesvolle plaatsing.',
    roles: ['kandidaat'],
  },
  {
    q: 'Kan ik zelf vacatures zoeken?',
    a: 'Nee, het matching-proces loopt via uw Talent Scout. Uw scout stelt vacatures aan u voor op basis van uw profiel. U ontvangt een notificatie bij elk nieuw voorstel en kunt kiezen: Interesse (ga door), Niet interesse (met reden), of Later bekijken. Na uw interesse vult u de Matching Scan in en wordt u officieel voorgedragen.',
    roles: ['kandidaat'],
  },
  {
    q: 'Hoe werkt het voordracht-proces?',
    a: 'Het proces verloopt in stappen: (1) Uw scout stelt een vacature voor, (2) U beoordeelt het voorstel en geeft aan of u interesse heeft, (3) U vult de Matching Scan in (of de vacature-specifieke aanvulling), (4) Bij een goede match wordt u officieel voorgedragen aan de opdrachtgever, (5) Gesprekken en arbeidsvoorwaarden, (6) Contract. U heeft 5 dagen om op een voorstel te reageren.',
    roles: ['kandidaat'],
  },
  {
    q: 'Wat zijn de dual-status bevestigingen?',
    a: 'Bij elke stap in het proces (gesprek gepland, gesprek afgerond, arbeidsvoorwaarden) wordt u gevraagd om te bevestigen. Dit is vrijblijvend maar helpt de transparantie: als u bevestigt dat een gesprek heeft plaatsgevonden maar de opdrachtgever dit nog niet heeft bijgewerkt, stuurt het systeem automatisch een herinnering. U ziet de status als ✓✓ (beide bevestigd), ✓? (alleen opdrachtgever), of ?✓ (alleen u).',
    roles: ['kandidaat'],
  },
  {
    q: 'Kan ik door meerdere Talent Scouts worden bemiddeld?',
    a: 'Ja. U kunt in de talent pool van meerdere scouts staan. Elke scout kan u onafhankelijk voordragen op vacatures, maar u kunt slechts één keer op dezelfde vacature worden voorgedragen. U ziet al uw scouts in uw dashboard. De fee gaat naar de scout wiens voordracht leidt tot een succesvolle plaatsing — voor u als kandidaat maakt dit geen verschil, het is altijd gratis.',
    roles: ['kandidaat'],
  },

  // ── Admin ──
  {
    q: 'Hoe werkt de escalatie bij overschrijding van doorlooptijden?',
    a: 'Het systeem bewaakt alle fases automatisch. Bij overschrijding van de maximale doorlooptijd ontvangt u een escalatiemelding in het dashboard. De standaard doorlooptijden zijn: review 7d, gesprek plannen 7d, gesprek 10d, feedback 7d, arbeidsvoorwaarden 14d. Bij escalatie neemt Refurzy direct contact op met de opdrachtgever.',
    roles: ['admin'],
  },
]

// ─── Doorlooptijden tabel ──────────────────────────────────────────────────────

const doorlooptijden = [
  { fase: 'Review voordracht', status: 'voorgesteld \u2192 contract_akkoord', dagen: '7 dagen', herinnering: 'Dag 3, dag 6' },
  { fase: 'Gesprek plannen', status: 'contract_akkoord \u2192 gesprek_gepland', dagen: '7 dagen', herinnering: 'Dag 4, dag 6' },
  { fase: 'Gesprek laten plaatsvinden', status: 'gesprek_gepland \u2192 feedback_geven', dagen: '10 dagen', herinnering: '\u2014' },
  { fase: 'Feedback geven', status: 'feedback_geven \u2192 volgende stap', dagen: '7 dagen', herinnering: 'Dag 5, dag 6' },
  { fase: 'Vervolggesprek', status: 'vervolggesprek', dagen: '10 dagen', herinnering: '\u2014' },
  { fase: 'Arbeidsvoorwaarden', status: 'arbeidsvoorwaarden', dagen: '14 dagen', herinnering: 'Dag 10' },
]

// ─── Component ─────────────────────────────────────────────────────────────────

export default function HelpPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [contactForm, setContactForm] = useState({
    onderwerp: '',
    bericht: '',
  })

  useEffect(() => {
    const user = getUser()
    if (user) setUserRole(user.role)
  }, [])

  const visibleFaqs = faqItems.filter(f =>
    f.roles === 'all' || (userRole && f.roles.includes(userRole))
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock: in production this sends email to hello@refurzy.com
    setFormSent(true)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Help & Ondersteuning</h1>
        <p className="text-ink-light mt-1">Vind antwoorden op veelgestelde vragen of neem contact met ons op.</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => { setShowForm(false); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="bg-white rounded-2xl border border-surface-border p-5 text-left hover:border-cyan/40 transition-colors group">
          <span className="text-2xl">📖</span>
          <p className="text-ink font-semibold mt-2 group-hover:text-cyan transition-colors">Veelgestelde vragen</p>
          <p className="text-ink-muted text-xs mt-1">Antwoorden op de meest gestelde vragen</p>
        </button>
        <button onClick={() => { setShowForm(false); document.getElementById('doorlooptijden')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="bg-white rounded-2xl border border-surface-border p-5 text-left hover:border-cyan/40 transition-colors group">
          <span className="text-2xl">⏱️</span>
          <p className="text-ink font-semibold mt-2 group-hover:text-cyan transition-colors">Doorlooptijden</p>
          <p className="text-ink-muted text-xs mt-1">Maximale doorlooptijden per fase</p>
        </button>
        <button onClick={() => { setShowForm(true); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
          className="bg-white rounded-2xl border border-surface-border p-5 text-left hover:border-cyan/40 transition-colors group">
          <span className="text-2xl">✉️</span>
          <p className="text-ink font-semibold mt-2 group-hover:text-cyan transition-colors">Contact opnemen</p>
          <p className="text-ink-muted text-xs mt-1">Stuur ons een bericht</p>
        </button>
      </div>

      {/* FAQ Section */}
      <div id="faq">
        <h2 className="text-lg font-semibold text-ink mb-4">Veelgestelde vragen</h2>
        <div className="space-y-2">
          {visibleFaqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-surface-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-muted/50 transition-colors"
              >
                <span className="text-sm font-medium text-ink pr-4">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-ink-muted shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 border-t border-surface-border pt-3">
                  <p className="text-sm text-ink-light leading-relaxed whitespace-pre-line">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Doorlooptijden tabel */}
      <div id="doorlooptijden">
        <h2 className="text-lg font-semibold text-ink mb-2">Doorlooptijden per fase</h2>
        <p className="text-ink-muted text-sm mb-4">
          Refurzy bewaakt automatisch de doorlooptijden. Bij overschrijding worden herinneringen gestuurd en indien nodig escaleert Refurzy.
        </p>
        <div className="bg-white rounded-xl border border-surface-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-muted border-b border-surface-border">
                <th className="text-left px-4 py-3 text-ink-muted font-medium">Fase</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">Max. doorlooptijd</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">Herinneringen</th>
              </tr>
            </thead>
            <tbody>
              {doorlooptijden.map((row, i) => (
                <tr key={i} className={i < doorlooptijden.length - 1 ? 'border-b border-surface-border' : ''}>
                  <td className="px-4 py-3 text-ink font-medium">{row.fase}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan/10 text-cyan text-xs font-medium rounded-full">
                      {row.dagen}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-light">{row.herinnering}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-cyan/5 border border-cyan/20 rounded-xl p-3 flex items-start gap-2">
          <span className="text-sm">🤖</span>
          <p className="text-xs text-ink-light">
            <strong className="text-ink">Automatische herinneringen:</strong> Refurzy stuurt automatisch herinneringen naar opdrachtgevers bij vertragingen. Scouts hoeven zelf niets te doen. Bij overschrijding van de deadline wordt geescaleerd naar het Refurzy team.
          </p>
        </div>
      </div>

      {/* Contact / niet gevonden banner */}
      {!showForm && (
        <div className="bg-white rounded-2xl border border-surface-border p-6 text-center">
          <p className="text-ink font-semibold">Antwoord niet gevonden?</p>
          <p className="text-ink-muted text-sm mt-1 mb-4">Neem contact met ons op en we helpen u zo snel mogelijk verder.</p>
          <button onClick={() => { setShowForm(true); setFormSent(false) }}
            className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-[10px] text-sm hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            Contact opnemen
          </button>
        </div>
      )}

      {/* Contact form */}
      {showForm && (
        <div id="contact" className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-ink mb-1">Contact opnemen</h2>
          <p className="text-ink-muted text-sm mb-6">Uw bericht wordt verstuurd naar het Refurzy support team (hello@refurzy.com).</p>

          {formSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                ✓
              </div>
              <p className="text-ink font-semibold text-lg">Bericht verstuurd!</p>
              <p className="text-ink-muted text-sm mt-2">
                We streven ernaar binnen 1 werkdag te reageren. U ontvangt een bevestiging per e-mail.
              </p>
              <button onClick={() => { setShowForm(false); setFormSent(false) }}
                className="mt-4 text-sm text-cyan hover:underline">
                Terug naar FAQ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-ink-light mb-1.5">Onderwerp *</label>
                <select
                  value={contactForm.onderwerp}
                  onChange={e => setContactForm(f => ({ ...f, onderwerp: e.target.value }))}
                  required
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-cyan transition-colors"
                >
                  <option value="">Selecteer een onderwerp...</option>
                  <option value="vacature">Vraag over een vacature</option>
                  <option value="matching-scan">Vraag over de Matching Scan / M-Score</option>
                  <option value="pipeline">Vraag over het wervingsproces / pipeline</option>
                  <option value="financieel">Financiele vraag (facturen, fees, uitbetalingen)</option>
                  <option value="technisch">Technisch probleem</option>
                  <option value="account">Account / instellingen</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-ink-light mb-1.5">Uw bericht *</label>
                <textarea
                  value={contactForm.bericht}
                  onChange={e => setContactForm(f => ({ ...f, bericht: e.target.value }))}
                  required
                  rows={5}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink text-sm placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none leading-relaxed"
                  placeholder="Beschrijf uw vraag of probleem zo duidelijk mogelijk..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="text-sm text-ink-muted hover:text-ink transition-colors">
                  Annuleren
                </button>
                <button type="submit"
                  disabled={!contactForm.onderwerp || !contactForm.bericht.trim()}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    contactForm.onderwerp && contactForm.bericht.trim()
                      ? 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]'
                      : 'bg-surface-muted border border-surface-border text-ink-muted cursor-not-allowed'
                  }`}>
                  Verstuur bericht
                </button>
              </div>

              <p className="text-xs text-ink-muted text-center pt-2">
                We reageren doorgaans binnen 1 werkdag. Voor urgente zaken kunt u ook mailen naar{' '}
                <a href="mailto:hello@refurzy.com" className="text-cyan hover:underline">hello@refurzy.com</a>.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
