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
    a: 'Bij een M-Score van 80% of hoger biedt Refurzy een Fit Garantie van 12 maanden vanaf de bevestigde startdatum. De garantie dekt uitsluitend vertrek dat aantoonbaar het gevolg is van een mismatch op cultuurfit, waardenfit of organisatiefit — de drie dimensies die de M-Score meet. Bij een geldige claim levert Refurzy eenmalig een vervangende kandidaat zonder nieuwe plaatsingsfee.\n\nNiet gedekt: functioneringsproblemen, persoonlijke omstandigheden (verhuizing, gezin, gezondheid), extern aanbod, gewijzigde functie-inhoud, mismanagement, reorganisatie, ziekte/arbeidsongeschiktheid, en situaties waarin de input van de opdrachtgever in de Matching Scan niet overeenkomt met de praktijk (naar oordeel van de medewerker).\n\nProcedure: (1) opdrachtgever meldt vertrek binnen 30 kalenderdagen, (2) Refurzy voert binnen 10 werkdagen een exitgesprek met de medewerker, (3) de medewerker bevestigt dat het vertrek het gevolg is van een fit-mismatch, (4) Refurzy beoordeelt of de melding binnen de dekking valt. Het eindoordeel ligt te allen tijde bij Refurzy. Zonder exitgesprek met de medewerker kan geen claim worden beoordeeld en vervalt het recht op de garantie.',
    roles: 'all',
  },
  {
    q: 'Hoe werkt het no cure, no pay model?',
    a: 'U betaalt alleen als een kandidaat daadwerkelijk start. Het bekijken van anonieme voordrachten is gratis. Pas wanneer u een profiel wilt ontgrendelen, gaat u akkoord met de plaatsingsvoorwaarden. De fee wordt gefactureerd op de eerste werkdag van de kandidaat — niet bij contractondertekening. Beide partijen bevestigen de startdatum en de daadwerkelijke start via het platform.\n\nAls de kandidaat zich vóór de startdatum terugtrekt, betaalt u niets en levert Refurzy eenmalig gratis een vervangende kandidaat. Als u als opdrachtgever zich terugtrekt, wordt 50% van de fee in rekening gebracht.',
    roles: 'all',
  },
  {
    q: 'Kan ik direct berichten sturen naar andere gebruikers?',
    a: 'Nee. Refurzy gebruikt een gestructureerd communicatiemodel zonder vrije berichten. Alle communicatie verloopt via: (1) gestructureerde toelichtingen bij voordrachten, (2) gestructureerde feedback bij afwijzingen, (3) automatische herinneringen bij vertragingen, en (4) statusnotificaties. Dit beschermt de kwaliteit van het proces en de anonimiteit van kandidaten.',
    roles: 'all',
  },
  {
    q: 'Hoe worden Talent Scouts beoordeeld?',
    a: 'Talent Scouts worden beoordeeld door opdrachtgevers na elk afwijzingsmoment. Hoe verder een kandidaat in het proces komt, hoe hoger de minimale beoordeling voor de scout — omdat de kwaliteit van de voordracht bewezen is.\n\nBij een succesvolle plaatsing krijgt de scout automatisch 5 sterren. De gemiddelde scout-rating is zichtbaar bij elke voordracht.',
    roles: 'all',
  },
  {
    q: 'Hoe werkt de match op harde criteria?',
    a: 'Naast de M-Score (cultuurmatch) berekent Refurzy ook een match op harde criteria. Dit is het percentage van de objectieve eisen waaraan een kandidaat voldoet.\n\nDe harde criteria zijn:\n• Opleidingsniveau — kandidaat moet minimaal het vereiste niveau hebben\n• Werkervaring — kandidaat moet voldoende jaren ervaring hebben\n• Salarisindicatie — de salarisbandbreedte van vacature en kandidaat moet overlappen\n• Max reistijd — de reistijd van de kandidaat mag niet hoger zijn dan wat de vacature toestaat\n• Op kantoor — de kandidaat moet bereid zijn het vereiste aantal kantoordagen te werken\n• Talen — de kandidaat moet alle vereiste talen beheersen op minimaal het opgegeven ERK-niveau (A2 t/m C2)\n\nElk criterium is pass/fail. De score is het percentage voldane criteria. Bij 80% of hoger verschijnt een groen vinkje, daaronder een oranje waarschuwing.\n\nVoorbeeld: een vacature vereist HBO, 5+ jaar ervaring, €4.500-€6.000, max 45 min reistijd, 3 dagen kantoor, en Nederlands C1 + Engels B2. Een kandidaat die aan 5 van de 6 criteria voldoet scoort 83% → groen vinkje.',
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
    q: 'Hoe werkt de scout-beoordeling?',
    a: 'Bij elke afwijzing wordt u gevraagd de Talent Scout te beoordelen (1-5 sterren). Deze beoordeling telt mee in het gemiddelde van de scout en is zichtbaar voor andere opdrachtgevers.\n\nOm scouts eerlijk te beoordelen hanteert Refurzy minimumscores op basis van hoe ver de kandidaat is gekomen:\n• Afgewezen bij voordracht: u bepaalt de score (1-5)\n• Profiel ontgrendeld of na gesprek: minimaal 3 sterren\n• Arbeidsvoorwaarden bereikt: automatisch 4 sterren\n• Succesvolle plaatsing: automatisch 5 sterren\n\nU kunt altijd een hogere score geven dan het minimum. De minimumscores beschermen scouts tegen onterecht lage beoordelingen wanneer hun kandidaat aantoonbaar goed genoeg was om ver in het proces te komen.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Wanneer wordt de fee gefactureerd?',
    a: 'De fee wordt gefactureerd op de eerste werkdag van de kandidaat — niet bij contractondertekening. Na de contractfase vullen zowel u als de kandidaat de verwachte startdatum in. Op de startdatum bevestigen beide partijen via het platform dat de kandidaat daadwerkelijk is gestart. Pas bij dubbele bevestiging wordt de factuur gegenereerd.\n\nAls de kandidaat zich vóór de startdatum terugtrekt, betaalt u niets. Als u als opdrachtgever zich terugtrekt, wordt 50% van de fee in rekening gebracht.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Wat als de kandidaat niet komt opdagen op de startdatum?',
    a: 'U kunt via het platform "Kandidaat niet verschenen" melden. Refurzy verifieert de situatie bij de kandidaat en behandelt dit als een terugtrekking door de kandidaat. U betaalt dan niets en Refurzy levert eenmalig gratis een vervangende kandidaat.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Kan ik meerdere vacatures tegelijk open hebben?',
    a: 'Ja, u kunt zoveel vacatures aanmaken als u wilt. Elke vacature krijgt een eigen M-Score profiel en kan onafhankelijk kandidaten ontvangen van verschillende Talent Scouts.',
    roles: ['opdrachtgever'],
  },
  {
    q: 'Wat is de exclusiviteitsoptie?',
    a: 'Bij het aanmaken van een vacature kunt u exclusiviteit activeren (+25% op de plaatsingsfee). Kandidaten die worden voorgedragen zijn dan 14 dagen exclusief beschikbaar voor uw vacature en worden niet aan andere opdrachtgevers aangeboden voor vacatures in hetzelfde functiegebied. Sollicitaties in andere functiegebieden lopen gewoon door — een vacature in een heel ander functiegebied is immers geen concurrent voor uw positie. Let op: exclusiviteit is onherroepelijk — eenmaal geactiveerd kan het niet meer worden uitgeschakeld voor die vacature.',
    roles: ['opdrachtgever'],
  },

  // ── Scout ──
  {
    q: 'Hoe verdien ik als Talent Scout?',
    a: 'Bij elke succesvolle plaatsing ontvangt u 50% van de plaatsingsfee (excl. BTW). De uitbetaling vindt plaats nadat de kandidaat daadwerkelijk is gestart en beide partijen dit hebben bevestigd via het platform. Uw verdiensten zijn zichtbaar in het Verdiensten-dashboard.\n\nAls de opdrachtgever zich vóór de startdatum terugtrekt, wordt 50% van de fee in rekening gebracht bij de opdrachtgever. U ontvangt uw aandeel van dit bedrag — u heeft immers uw werk gedaan.',
    roles: ['scout'],
  },
  {
    q: 'Hoe wordt mijn rating berekend?',
    a: 'Uw gemiddelde rating wordt berekend op basis van beoordelingen door opdrachtgevers. Bij elke afwijzing geeft de opdrachtgever 1-5 sterren.\n\nOm u te beschermen tegen onterecht lage beoordelingen gelden minimumscores op basis van hoe ver uw kandidaat is gekomen:\n• Afgewezen bij voordracht: opdrachtgever bepaalt (1-5)\n• Profiel ontgrendeld of na gesprek: minimaal 3 sterren\n• Arbeidsvoorwaarden bereikt: automatisch 4 sterren\n• Succesvolle plaatsing: automatisch 5 sterren\n\nDe opdrachtgever kan altijd een hogere score geven dan het minimum. Uw rating is zichtbaar voor opdrachtgevers en beïnvloedt uw zichtbaarheid op het platform.',
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
    q: 'Wat gebeurt er als een voordracht verloopt?',
    a: 'Als een opdrachtgever niet binnen 7 dagen reageert op een voordracht, wordt deze automatisch geannuleerd. De kandidaat keert terug naar uw talent pool en kan opnieuw worden voorgedragen voor een andere vacature. Uitzondering: bij een exclusieve vacature blijft de kandidaat geblokkeerd tot de 14-dagen exclusiviteitsperiode is verstreken.',
    roles: ['scout'],
  },
  {
    q: 'Kan ik een kandidaat op meerdere vacatures tegelijk voordragen?',
    a: 'Nee. Zodra een kandidaat is voorgedragen op een vacature, is deze geblokkeerd voor andere voordrachten zolang het proces loopt. Na een afwijzing of verlopen voordracht komt de kandidaat direct vrij. Bij exclusieve vacatures geldt een minimale blokkade van 14 dagen, maar alleen voor vacatures in hetzelfde functiegebied — sollicitaties in andere functiegebieden lopen gewoon door. U ziet in uw talent pool een indicator wanneer een kandidaat geblokkeerd is.',
    roles: ['scout'],
  },
  {
    q: 'Wat betekent het als een vacature exclusief is?',
    a: 'Bij een exclusieve vacature betaalt de opdrachtgever 25% extra bij een succesvolle plaatsing. In ruil daarvoor zijn voorgedragen kandidaten 14 dagen exclusief beschikbaar en worden niet aan andere opdrachtgevers aangeboden voor vacatures in hetzelfde functiegebied. Lopende sollicitaties van de kandidaat in andere functiegebieden worden niet geraakt — alleen overlappende functies worden gepauzeerd. De exclusiviteitstoeslag wordt 50/50 verdeeld, dus u ontvangt ook meer fee.\n\nLet op: wanneer u een kandidaat voordraagt op een exclusieve vacature en deze kandidaat heeft lopende sollicitaties in hetzelfde functiegebied, krijgt u een melding. De kandidaat moet hiermee ook akkoord gaan voordat de voordracht kan worden ingediend.',
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
    a: 'Nee, het matching-proces loopt via uw Talent Scout. Uw scout stelt vacatures aan u voor op basis van uw profiel. U ontvangt een notificatie bij elk nieuw voorstel en kunt kiezen: Interesse (ga door), Geen interesse (met reden), of Later bekijken. Na uw interesse vult u de Matching Scan in en wordt u officieel voorgedragen.',
    roles: ['kandidaat'],
  },
  {
    q: 'Hoe werkt het voordracht-proces?',
    a: 'Het proces verloopt in stappen: (1) Uw scout stelt een vacature voor, (2) U beoordeelt het voorstel en geeft aan of u interesse heeft, (3) U vult de Matching Scan in (of de vacature-specifieke aanvulling), (4) Bij een goede match wordt u officieel voorgedragen aan de opdrachtgever, (5) Gesprekken en arbeidsvoorwaarden, (6) Contract. U heeft 5 dagen om op een voorstel te reageren.',
    roles: ['kandidaat'],
  },
  {
    q: 'Wat zijn de dual-status bevestigingen?',
    a: 'Bij elke stap in het proces (gesprek gepland, gesprek afgerond, arbeidsvoorwaarden) wordt je gevraagd om te bevestigen. Door te bevestigen krijg je sneller duidelijkheid: het systeem stuurt automatisch een herinnering naar de opdrachtgever om ook te bevestigen en een beslissing te nemen. Zo wordt voorkomen dat je lang in onzekerheid wacht.\n\nJe ziet de status als: ✓✓ (beide bevestigd — proces gaat door), ✓? (opdrachtgever wacht op jouw bevestiging), ?✓ (jij hebt bevestigd — opdrachtgever krijgt herinnering), of ?? (nog niemand heeft bevestigd).',
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
        <p className="text-ink-light font-medium mt-1">Vind antwoorden op veelgestelde vragen of neem contact met ons op.</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => { setShowForm(false); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="bg-white rounded-2xl border border-surface-border p-5 text-left hover:border-cyan/40 transition-colors group">
          <span className="text-2xl">📖</span>
          <p className="text-ink font-semibold mt-2 group-hover:text-cyan transition-colors">Veelgestelde vragen</p>
          <p className="text-ink-muted text-xs mt-1">Antwoorden op de meest gestelde vragen</p>
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
                <label className="block text-sm text-ink font-medium mb-1.5">Onderwerp *</label>
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
                <label className="block text-sm text-ink font-medium mb-1.5">Uw bericht *</label>
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
