import { useState, useEffect } from 'react'

export type Lang = 'nl' | 'en'

export function useLang() {
  const [lang, setLang] = useState<Lang>('nl')
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('refurzy_lang') as Lang : null
    if (saved === 'en' || saved === 'nl') setLang(saved)
  }, [])
  return { lang }
}

export const translations = {
  // ─── Navigation ────────────────────────────────────────────────────────────
  'nav.howItWorks': { nl: 'Hoe het werkt', en: 'How it works' },
  'nav.forWhom': { nl: 'Voor wie', en: 'For whom' },
  'nav.pricing': { nl: 'Pricing', en: 'Pricing' },
  'nav.faq': { nl: 'FAQ', en: 'FAQ' },
  'nav.science': { nl: 'Wetenschap', en: 'Science' },
  'nav.login': { nl: 'Inloggen', en: 'Log in' },
  'nav.getStarted': { nl: 'Gratis starten', en: 'Get started free' },
  'nav.dashboard': { nl: 'Ga naar dashboard →', en: 'Go to dashboard →' },

  // ─── Hero ──────────────────────────────────────────────────────────────────
  'hero.tagline': { nl: 'Redefining Recruitment. Forever.', en: 'Redefining Recruitment. Forever.' },
  'hero.h1a': { nl: 'Werving gebouwd op wetenschap.', en: 'Recruitment built on science.' },
  'hero.h1b': { nl: 'Niet op buikgevoel.', en: 'Not on gut feeling.' },
  'hero.roi': { nl: 'ROI vanaf 455%. No cure, no pay.', en: 'ROI from 455%. No cure, no pay.' },
  'hero.sub1': {
    nl: 'Eén verkeerde hire kost 50-200% van het jaarsalaris + werkgeverslasten.¹ Bij een bruto maandsalaris van €5.000 is dat €44.000 tot €175.000. En het overkomt 46% van alle aannames.²',
    en: 'One wrong hire costs 50-200% of the annual salary + employer costs.¹ At a gross monthly salary of €5,000, that\'s €44,000 to €175,000. And it happens to 46% of all hires.²'
  },
  'hero.sub2': {
    nl: 'De Matching Scan — ontwikkeld met de Vrije Universiteit Amsterdam — meet vóór de aanname of iemand bij uw organisatie past. Wetenschappelijk bewezen. No cure, no pay.',
    en: 'The Matching Scan — developed with Vrije Universiteit Amsterdam — measures before hiring whether someone fits your organization. Scientifically proven. No cure, no pay.'
  },
  'hero.ctaEmployer': { nl: 'Start als opdrachtgever →', en: 'Start as employer →' },
  'hero.ctaScout': { nl: 'Word Talent Scout', en: 'Become a Talent Scout' },
  'hero.trust1': { nl: '🎓 VU Amsterdam', en: '🎓 VU Amsterdam' },
  'hero.trust2': { nl: '🔬 35-vragen Matching Scan', en: '🔬 35-question Matching Scan' },
  'hero.trust3': { nl: '💰 No Cure No Pay', en: '💰 No Cure No Pay' },
  'hero.sources': {
    nl: '¹ SHRM, 2024 · ² Leadership IQ · ³ Op basis van SHRM, Kristof-Brown et al. en VU Amsterdam',
    en: '¹ SHRM, 2024 · ² Leadership IQ · ³ Based on SHRM, Kristof-Brown et al. and VU Amsterdam'
  },

  // ─── Social proof bar ──────────────────────────────────────────────────────
  'stats.mishireCost': { nl: 'van jaarsalaris per mis-hire (SHRM, 2024)', en: 'of annual salary per mis-hire (SHRM, 2024)' },
  'stats.failRate': { nl: 'van hires faalt binnen 18 maanden', en: 'of hires fail within 18 months' },
  'stats.roi': { nl: 'ROI bij inzet Refurzy (conservatief)', en: 'ROI with Refurzy (conservative)' },
  'stats.doubt': { nl: 'managers twijfelt over aannamebeslissing', en: 'of managers doubt their hiring decision' },

  // ─── Problem section ───────────────────────────────────────────────────────
  'problem.label': { nl: 'De uitdaging', en: 'The challenge' },
  'problem.title': { nl: 'Bureaus raden. Wij matchen.', en: 'Agencies guess. We match.' },
  'problem.subtitle': {
    nl: 'De arbeidsmarkt is drastisch veranderd. De manier waarop we talent werven niet. Processen die ontworpen zijn voor een markt die niet meer bestaat, kosten u meer dan u denkt.',
    en: 'The labor market has changed drastically. The way we recruit talent has not. Processes designed for a market that no longer exists cost you more than you think.'
  },

  // Pain points
  'pain.agencies.title': { nl: 'Dure bureaus, nul garantie', en: 'Expensive agencies, zero guarantee' },
  'pain.agencies.desc': {
    nl: 'Traditionele bureaus rekenen 20-30% van het jaarsalaris — gemiddeld €16.000 per hire.⁴ Zonder garantie op een goede match. Als het misgaat, begint u opnieuw en betaalt u opnieuw.',
    en: 'Traditional agencies charge 20-30% of the annual salary — on average €16,000 per hire.⁴ With no guarantee of a good match. If it fails, you start over and pay again.'
  },
  'pain.turnover.title': { nl: 'Hoog verloop door mismatches', en: 'High turnover from mismatches' },
  'pain.turnover.desc': {
    nl: 'Eén verkeerde hire kost 50-200% van het jaarsalaris + werkgeverslasten aan herwervingskosten, productiviteitsverlies en teamschade. Bij een bruto maandsalaris van €5.000 is dat €44.000 tot €175.000. En 46% van nieuwe medewerkers faalt binnen 18 maanden.',
    en: 'One wrong hire costs 50-200% of the annual salary + employer costs in re-recruitment, lost productivity and team damage. At a gross monthly salary of €5,000, that\'s €44,000 to €175,000. And 46% of new hires fail within 18 months.'
  },
  'pain.gut.title': { nl: 'Buikgevoel in plaats van data', en: 'Gut feeling instead of data' },
  'pain.gut.desc': {
    nl: '81% van hiring managers is zo onzeker over hun keuze dat ze kandidaten ghosten. Niet uit onwil, maar uit gebrek aan objectieve informatie over wie écht bij de organisatie past.',
    en: '81% of hiring managers are so uncertain about their choice that they ghost candidates. Not from unwillingness, but from lack of objective information about who truly fits the organization.'
  },
  'pain.expensive.title': { nl: 'Steeds korter, steeds duurder', en: 'Shorter tenure, higher costs' },
  'pain.expensive.desc': {
    nl: 'Een medewerker bleef vroeger zes jaar. Vandaag is dat anderhalf tot twee jaar. Maar de wervingskosten zijn niet gedaald — ze zijn gestegen. En bij een verkeerde match begint het hele circus opnieuw.',
    en: 'An employee used to stay six years. Today it\'s one and a half to two years. But recruitment costs haven\'t dropped — they\'ve increased. And with a bad hire, the whole cycle starts over.'
  },
  'pain.managers.title': { nl: 'Managers willen het niet doen', en: 'Managers don\'t want to do it' },
  'pain.managers.desc': {
    nl: 'Werven is niet waarvoor managers zijn aangenomen. Ze vinden het tijdrovend, onzeker en frustrerend. Als ze het leuk hadden gevonden, waren ze wel recruiter geworden. Bovendien: een ongestructureerd sollicitatiegesprek door een onervaren interviewer heeft een zeer lage voorspellende waarde (r = .20, Schmidt & Hunter, 1998). Valkuilen als confirmation bias en het halo-effect leiden ertoe dat de eerste indruk wordt bevestigd in plaats van objectief getoetst.',
    en: 'Recruiting is not what managers were hired for. They find it time-consuming, uncertain and frustrating. If they had enjoyed it, they would have become recruiters. Moreover: an unstructured interview by an inexperienced interviewer has a very low predictive value (r = .20, Schmidt & Hunter, 1998). Pitfalls like confirmation bias and the halo effect mean the first impression gets confirmed rather than objectively tested.'
  },
  'pain.market.title': { nl: 'Eén bureau, één vijver. Honderden scouts, oneindig bereik.', en: 'One agency, one pond. Hundreds of scouts, infinite reach.' },
  'pain.market.desc': {
    nl: 'Bureaus zoeken allemaal in dezelfde LinkedIn-vijver. Onze Talent Scouts werken gericht binnen hun eigen netwerk — mensen die ze kennen, hebben gesproken en kunnen inschatten. En omdat honderden scouts tegelijk voor u zoeken, is uw bereik vele malen groter dan dat van één bureau.',
    en: 'Agencies all fish in the same LinkedIn pond. Our Talent Scouts work their own networks — people they know, have spoken to, and can assess. And with hundreds of scouts searching for you simultaneously, your reach is far greater than any single agency.'
  },

  // ─── How it works ──────────────────────────────────────────────────────────
  'how.title': { nl: 'Hoe Refurzy werkt', en: 'How Refurzy works' },
  'how.subtitle': {
    nl: 'Drie rollen, één platform. Elke stap is ontworpen om werving sneller, objectiever en stukken goedkoper te maken.',
    en: 'Three roles, one platform. Every step is designed to make recruitment faster, more objective and significantly more affordable.'
  },
  'how.employer': { nl: 'Opdrachtgever', en: 'Employer' },
  'how.employer.1': { nl: 'Beschrijf uw ideale kandidaat in 5 minuten', en: 'Describe your ideal candidate in 5 minutes' },
  'how.employer.2': { nl: 'Ontvang kandidaten die écht passen — bewezen met data', en: 'Receive candidates that truly fit — proven with data' },
  'how.employer.3': { nl: 'Neem met vertrouwen aan. Bespaar tienduizenden aan mis-hires', en: 'Hire with confidence. Save tens of thousands on mis-hires' },
  'how.scout': { nl: 'Talent Scout', en: 'Talent Scout' },
  'how.scout.1': { nl: 'Gebruik je netwerk — jij kent het talent', en: 'Use your network — you know the talent' },
  'how.scout.2': { nl: 'De M-Score bewijst wat jij al wist: het is een match', en: 'The M-Score proves what you already knew: it\'s a match' },
  'how.scout.3': { nl: 'Verdien 50% bij elke plaatsing. Betere data, betere matches', en: 'Earn 50% per placement. Better data, better matches' },
  'how.candidate': { nl: 'Kandidaat', en: 'Candidate' },
  'how.candidate.1': { nl: 'Ontdek in 10 minuten wat écht bij je past', en: 'Discover what truly fits you in 10 minutes' },
  'how.candidate.2': { nl: 'Geen eindeloos solliciteren — word gematcht op wie je bent', en: 'No endless applications — get matched on who you are' },
  'how.candidate.3': { nl: 'Vind je droombaan. Wetenschappelijk bewezen fit', en: 'Find your dream job. Scientifically proven fit' },

  // ─── Solution section ──────────────────────────────────────────────────────
  'solution.label': { nl: 'De oplossing', en: 'The solution' },
  'solution.title': { nl: 'Refurzy draait het om', en: 'Refurzy turns it around' },
  'solution.subtitle': {
    nl: 'Traditionele werving ontdekt of iemand past bij uw cultuur nádat u heeft geïnvesteerd. Refurzy meet die match vóór de aanname.',
    en: 'Traditional recruitment discovers whether someone fits your culture after you\'ve invested. Refurzy measures that match before hiring.'
  },

  // ─── Pricing ───────────────────────────────────────────────────────────────
  'pricing.title': { nl: 'Transparante pricing', en: 'Transparent pricing' },
  'pricing.subtitle': {
    nl: 'Geen abonnement. Geen verborgen kosten. U betaalt alleen bij een succesvolle plaatsing.',
    en: 'No subscription. No hidden costs. You only pay on a successful placement.'
  },

  // ─── CTA ───────────────────────────────────────────────────────────────────
  'cta.title': { nl: 'Stop met gokken op talent.', en: 'Stop gambling on talent.' },
  'cta.subtitle': {
    nl: 'Elke dag dat u werft op buikgevoel kost het u geld. Start vandaag met wetenschappelijk onderbouwde werving. Geen verplichtingen, geen opstartkosten.',
    en: 'Every day you recruit on gut feeling costs you money. Start today with scientifically backed recruitment. No obligations, no setup costs.'
  },

  // ─── Solution USPs ────────────────────────────────────────────────────────
  'usp.scan.title': { nl: 'Matching Scan — ontwikkeld met de VU Amsterdam', en: 'Matching Scan — developed with VU Amsterdam' },
  'usp.scan.desc': {
    nl: 'De Matching Scan meet de fit tussen kandidaat en organisatie op waarden, interesses en cultuur. 35 vragen, 5 minuten, wetenschappelijk gevalideerd met zeer sterke voorspellende waarde.⁵ Ontwikkeld in samenwerking met de Vrije Universiteit Amsterdam.',
    en: 'The Matching Scan measures the fit between candidate and organization on values, interests and culture. 35 questions, 5 minutes, scientifically validated with very strong predictive value.⁵ Developed in collaboration with Vrije Universiteit Amsterdam.'
  },
  'usp.cheaper.title': { nl: 'Gemiddeld 60% goedkoper — en no cure, no pay', en: 'On average 60% cheaper — and no cure, no pay' },
  'usp.cheaper.desc': {
    nl: 'Refurzy is gemiddeld 60% goedkoper dan een traditioneel werving- en selectiebureau. Geen abonnement, geen opstartkosten, geen fee als u niemand aanneemt. U betaalt alleen bij een succesvolle plaatsing — met Fit Garantie.',
    en: 'Refurzy is on average 60% cheaper than a traditional recruitment agency. No subscription, no setup costs, no fee if you don\'t hire anyone. You only pay on a successful placement — with Fit Guarantee.'
  },
  'usp.scouts.title': { nl: 'Ervaren Talent Scouts, niet een algoritme', en: 'Experienced Talent Scouts, not an algorithm' },
  'usp.scouts.desc': {
    nl: 'Onze Talent Scouts zijn veelal ervaren recruiters die al jaren in het vak zitten. Zij kennen hun netwerk, weten waar het talent zit en kunnen de strijd aan met de beste bureaus — maar werken voor u, niet voor een bureau.',
    en: 'Our Talent Scouts are mostly experienced recruiters who have been in the field for years. They know their network, know where the talent is and can compete with the best agencies — but work for you, not for an agency.'
  },
  'usp.data.title': { nl: 'Data vervangt twijfel', en: 'Data replaces doubt' },
  'usp.data.desc': {
    nl: '81% van managers twijfelt bij aannames. De M-Score geeft een objectieve, kwantitatieve indicator van de match. Geen buikgevoel meer, maar wetenschappelijk onderbouwde zekerheid vóór het eerste gesprek.',
    en: '81% of managers doubt their hiring decisions. The M-Score provides an objective, quantitative indicator of the match. No more gut feeling, but scientifically backed certainty before the first interview.'
  },
  'usp.retention.title': { nl: 'Lager verloop, hogere retentie', en: 'Lower turnover, higher retention' },
  'usp.retention.desc': {
    nl: 'Medewerkers die passen bij de cultuur en waarden van een organisatie blijven langer en presteren beter. De Matching Scan voorkomt mis-hires en verlaagt het verloop met 39-59%.',
    en: 'Employees who fit the culture and values of an organization stay longer and perform better. The Matching Scan prevents mis-hires and reduces turnover by 39-59%.'
  },
  'usp.anonymous.title': { nl: 'Anoniem tot ontgrendeling', en: 'Anonymous until unlocked' },
  'usp.anonymous.desc': {
    nl: 'Kandidaten worden anoniem gepresenteerd. Pas na akkoord op de voorwaarden krijgt u toegang tot het profiel. Dit voorkomt bias, beschermt privacy en garandeert objectieve beoordeling.',
    en: 'Candidates are presented anonymously. Only after agreeing to the terms you get access to the profile. This prevents bias, protects privacy and guarantees objective assessment.'
  },

  // ─── Matching Scan section ───────────────────────────────────────────────
  'scan.badge': { nl: 'Ontwikkeld met de Vrije Universiteit Amsterdam', en: 'Developed with Vrije Universiteit Amsterdam' },
  'scan.title': { nl: 'De Matching Scan', en: 'The Matching Scan' },
  'scan.desc': {
    nl: '35 vragen. 5 minuten. Eén objectieve score die voorspelt hoe goed een kandidaat past bij uw organisatie — op waarden, interesses en cultuur. Niet op cv-keywords.',
    en: '35 questions. 5 minutes. One objective score that predicts how well a candidate fits your organization — on values, interests and culture. Not on CV keywords.'
  },
  'scan.item1': { nl: '19 werkinteresses — wat motiveert iemand', en: '19 work interests — what motivates someone' },
  'scan.item2': { nl: '9 kernwaarden — wat drijft iemand', en: '9 core values — what drives someone' },
  'scan.item3': { nl: '7 cultuurtypen — waar voelt iemand zich thuis', en: '7 culture types — where someone feels at home' },
  'scan.item4': { nl: 'Voorspelt bevlogenheid, tevredenheid én retentie', en: 'Predicts engagement, satisfaction and retention' },
  'scan.footnote': {
    nl: '⁵ VU Amsterdam (2026; N=309) — Zeer sterke voorspellende waarde voor werkbevlogenheid, werktevredenheid en organisatiebetrokkenheid (β = .29–.30, p < .01)',
    en: '⁵ VU Amsterdam (2026; N=309) — Very strong predictive value for work engagement, job satisfaction and organizational commitment (β = .29–.30, p < .01)'
  },
  'scan.stat1.value': { nl: 'Zeer sterk', en: 'Very strong' },
  'scan.stat1.label': { nl: 'Wetenschappelijk bewezen voorspeller van werkgeluk⁵', en: 'Scientifically proven predictor of work happiness⁵' },
  'scan.stat1.sub': { nl: 'Na correctie voor leeftijd, opleiding en salaris', en: 'After correction for age, education and salary' },
  'scan.stat2.label': { nl: 'Verwachte turnover reductie bij systematische inzet', en: 'Expected turnover reduction with systematic use' },
  'scan.stat2.sub': { nl: 'SHRM 2023 · Aberdeen Group · Kristof-Brown et al.', en: 'SHRM 2023 · Aberdeen Group · Kristof-Brown et al.' },
  'scan.stat3.label': { nl: 'P-O fit correleert negatief met vertrekintentie', en: 'P-O fit correlates negatively with turnover intention' },
  'scan.stat3.sub': { nl: 'Kristof-Brown et al., 2005 (meta-analyse)', en: 'Kristof-Brown et al., 2005 (meta-analysis)' },
  'scan.compare.title': { nl: 'Vóór de aanname weten, niet achteraf ontdekken', en: 'Know before hiring, not discover after' },
  'scan.trad.label': { nl: '❌ Traditioneel', en: '❌ Traditional' },
  'scan.trad.1': { nl: 'Cultuurfit wordt pas ontdekt na aanname', en: 'Culture fit is only discovered after hiring' },
  'scan.trad.2': { nl: 'Bureau kent uw organisatie nauwelijks', en: 'Agency barely knows your organization' },
  'scan.trad.3': { nl: 'Fee betaald, ongeacht uitkomst', en: 'Fee paid, regardless of outcome' },
  'scan.trad.4': { nl: 'Gemiddeld 68,5 dagen time-to-hire', en: 'Average 68.5 days time-to-hire' },
  'scan.trad.5': { nl: '46% faalt binnen 18 maanden', en: '46% fail within 18 months' },
  'scan.ref.label': { nl: '✓ Refurzy', en: '✓ Refurzy' },
  'scan.ref.1': { nl: 'Cultuurfit gemeten vóór het eerste gesprek', en: 'Culture fit measured before the first interview' },
  'scan.ref.2': { nl: 'Ervaren Talent Scouts die uw profiel kennen', en: 'Experienced Talent Scouts who know your profile' },
  'scan.ref.3': { nl: 'No cure, no pay — nul risico', en: 'No cure, no pay — zero risk' },
  'scan.ref.4': { nl: 'Objectieve M-Score als beslissingsgrond', en: 'Objective M-Score as decision basis' },
  'scan.ref.5': { nl: '39-59% minder verloop, aantoonbaar', en: '39-59% less turnover, demonstrable' },

  // ─── Pricing table ───────────────────────────────────────────────────────
  'pricing.colExp': { nl: 'Werkervaring', en: 'Experience' },
  'pricing.row1': { nl: '0-2 jaar', en: '0-2 years' },
  'pricing.row2': { nl: '2-5 jaar', en: '2-5 years' },
  'pricing.row3': { nl: '5-10 jaar', en: '5-10 years' },
  'pricing.row4': { nl: '>10 jaar', en: '>10 years' },
  'pricing.toScout': { nl: 'naar Scout', en: 'to Scout' },
  'pricing.toRefurzy': { nl: 'naar Refurzy', en: 'to Refurzy' },
  'pricing.exclusivity': { nl: 'exclusiviteit (optioneel)', en: 'exclusivity (optional)' },

  // ─── FAQ ───────────────────────────────────────────────────────────────────
  'faq.title': { nl: 'Veelgestelde vragen', en: 'Frequently asked questions' },
  'faq.q1': { nl: 'Wat kost het als ik geen kandidaat aanneem?', en: 'What does it cost if I don\'t hire a candidate?' },
  'faq.a1': {
    nl: 'Niets. Refurzy werkt op basis van no cure, no pay. Geen abonnement, geen opstartkosten. U betaalt alleen wanneer u daadwerkelijk een kandidaat aanneemt. Vergelijk dat met een traditioneel bureau dat gemiddeld €16.000 per hire rekent — ongeacht het resultaat.',
    en: 'Nothing. Refurzy works on a no cure, no pay basis. No subscription, no setup costs. You only pay when you actually hire a candidate. Compare that to a traditional agency that charges an average of €16,000 per hire — regardless of the outcome.'
  },
  'faq.q2': { nl: 'Hoe werkt de Matching Scan?', en: 'How does the Matching Scan work?' },
  'faq.a2': {
    nl: 'De Matching Scan is een wetenschappelijk assessment van 35 vragen, ontwikkeld met de Vrije Universiteit Amsterdam. Het meet de match op werkinteresses (19 items), kernwaarden (9 items) en cultuurvoorkeur (7 types). Het resultaat is een objectieve M-Score die werkgeluk, tevredenheid en retentie zeer sterk voorspelt.⁵',
    en: 'The Matching Scan is a scientific assessment of 35 questions, developed with Vrije Universiteit Amsterdam. It measures the match on work interests (19 items), core values (9 items) and culture preference (7 types). The result is an objective M-Score that very strongly predicts work happiness, satisfaction and retention.⁵'
  },
  'faq.q3': { nl: 'Hoe betrouwbaar is de M-Score?', en: 'How reliable is the M-Score?' },
  'faq.a3': {
    nl: 'De Matching Scan is gevalideerd door de VU Amsterdam in een onderzoek met 309 respondenten. De voorspellende waarde is zeer sterk — sterker dan traditionele capaciteitstests.⁵ De scan vervangt interviews niet, maar geeft een objectief datapunt dat twijfel reduceert.',
    en: 'The Matching Scan has been validated by VU Amsterdam in a study with 309 respondents. The predictive value is very strong — stronger than traditional aptitude tests.⁵ The scan doesn\'t replace interviews, but provides an objective data point that reduces doubt.'
  },
  'faq.q4': { nl: 'Kan ik als recruiter Talent Scout worden?', en: 'Can I become a Talent Scout as a recruiter?' },
  'faq.a4': {
    nl: 'Ja. Elke ervaren recruiter, HR-professional of netwerker kan zich aanmelden als Talent Scout. U bouwt uw eigen talent pool op, matcht kandidaten aan vacatures en verdient 50% van de fee bij elke succesvolle plaatsing. Hoe beter uw track record, hoe hoger uw reputatiescore.',
    en: 'Yes. Any experienced recruiter, HR professional or networker can sign up as a Talent Scout. You build your own talent pool, match candidates to vacancies and earn 50% of the fee on every successful placement. The better your track record, the higher your reputation score.'
  },
  'faq.q5': { nl: 'Waarom zijn kandidaten anoniem?', en: 'Why are candidates anonymous?' },
  'faq.a5': {
    nl: 'Anonimiteit voorkomt onbewuste bias (halo-effect, similarity-attraction) en zorgt voor objectieve beoordeling op basis van fit, niet op basis van naam, foto of achtergrond. Pas na akkoord op de voorwaarden krijgt u toegang tot het volledige profiel.',
    en: 'Anonymity prevents unconscious bias (halo effect, similarity-attraction) and ensures objective assessment based on fit, not on name, photo or background. Only after agreeing to the terms do you get access to the full profile.'
  },
  'faq.q6': { nl: 'Hoeveel kan ik besparen?', en: 'How much can I save?' },
  'faq.a6': {
    nl: 'Conservatief scenario: ROI vanaf 455%. Voor een klein bedrijf met 3 hires per jaar betekent dit €59.000–€178.000 netto besparing. Voor organisaties met 100+ medewerkers: €196.000–€1.370.000 per jaar, afhankelijk van turnover reductie en kosten per mis-hire.',
    en: 'Conservative scenario: ROI from 455%. For a small company with 3 hires per year, this means €59,000–€178,000 net savings. For organizations with 100+ employees: €196,000–€1,370,000 per year, depending on turnover reduction and cost per mis-hire.'
  },
  'faq.q7': { nl: 'Waarom kost een mis-hire €44.000–€175.000?', en: 'Why does a mis-hire cost €44,000–€175,000?' },
  'faq.a7': {
    nl: 'De meeste bedrijven onderschatten de werkelijke kosten van een verkeerde aanname enorm. SHRM becijfert de totale kosten op 50–200% van het jaarsalaris (o.b.v. bruto maandsalaris €5.000). Dit bedrag is opgebouwd uit vijf componenten:\n\n1. Herwervingskosten — vacaturetekst, jobboards, recruiter-tijd, gesprekken voeren, selectieprocedure opnieuw doorlopen.\n2. Verloren productiviteit — de vertrekkende medewerker presteert weken tot maanden onder niveau, en de positie staat vervolgens maanden open.\n3. Onboarding en training — alles wat u investeerde in inwerken, cursussen en begeleiding is verloren.\n4. Managementtijd — leidinggevenden besteden honderden uren aan coaching, functioneringsgesprekken en het afhandelen van het vertrek.\n5. Teamschade — verloop ondermijnt het moreel en de productiviteit van het hele team. Kennis en relaties verdwijnen.\n6. Ontslagkosten (VSO/transitievergoeding) — in Nederland moet bij gedwongen vertrek vaak een vaststellingsovereenkomst worden gesloten, gemiddeld 1–3 bruto maandsalarissen extra.\n\n⚠️ Let op: de SHRM-schatting van 50–200% is gebaseerd op Amerikaans onderzoek, waar ontslagkosten lager zijn. In Nederland komen hier vaak nog VSO-kosten bovenop. De werkelijke kosten per mis-hire liggen daarmee gemiddeld genomen nóg hoger.\n\nBij een bruto maandsalaris van €5.000 bedragen de totale loonkosten €87.480 per jaar (€60.000 salaris + €4.800 vakantiegeld + €22.680 werkgeverslasten). 50% daarvan is €44.000, 200% is €175.000. En dit overkomt 46% van alle nieuwe aannames binnen 18 maanden (Leadership IQ). Refurzy vermindert dit risico met 39–59% door cultuur- en waardenfit vóór de aanname te meten.',
    en: 'Most companies vastly underestimate the true cost of a bad hire. SHRM estimates total costs at 50–200% of annual salary (based on €5,000 gross monthly salary). This amount consists of five components:\n\n1. Re-recruitment costs — job ads, job boards, recruiter time, interviews, running the selection process again.\n2. Lost productivity — the departing employee underperforms for weeks to months, and the position then stays vacant for months.\n3. Onboarding and training — everything invested in orientation, courses and mentoring is lost.\n4. Management time — managers spend hundreds of hours on coaching, performance reviews and handling the departure.\n5. Team damage — turnover undermines morale and productivity of the entire team. Knowledge and relationships disappear.\n6. Severance costs (settlement agreement) — in the Netherlands, involuntary departures often require a settlement agreement, averaging 1–3 gross monthly salaries extra.\n\n⚠️ Note: the SHRM estimate of 50–200% is based on US research, where severance costs are lower. In the Netherlands, settlement costs are often added on top. Actual mis-hire costs are therefore on average even higher.\n\nAt a gross monthly salary of €5,000, total employer costs are €87,480 per year (€60,000 salary + €4,800 holiday pay + €22,680 employer contributions). 50% of that is €44,000, 200% is €175,000. And this happens to 46% of all new hires within 18 months (Leadership IQ). Refurzy reduces this risk by 39–59% by measuring culture and values fit before hiring.'
  },
  'faq.q8': { nl: 'Geven jullie garantie op resultaat?', en: 'Do you guarantee results?' },
  'faq.a8': {
    nl: 'Ja. Refurzy werkt op basis van no cure, no pay — u betaalt dus nooit voor een kandidaat die u niet aanneemt. Daarbovenop bieden wij de Fit Garantie: neemt u een kandidaat aan met een M-Score van 80% of hoger en vertrekt deze binnen 12 maanden — ook op eigen initiatief — dan leveren wij eenmalig gratis een vervangende kandidaat. U betaalt hiervoor geen nieuwe plaatsingsfee. De garantie is alleen niet geldig als: (1) de werkzaamheden afwijken van de vacatureomschrijving, (2) er sprake is van aantoonbaar mismanagement, of (3) de functie verdwijnt door een reorganisatie. Wij durven dit aan te bieden omdat de wetenschap aantoont dat een hoge M-Score samenhangt met significant hogere retentie.',
    en: 'Yes. Refurzy works on a no cure, no pay basis — so you never pay for a candidate you don\'t hire. On top of that, we offer the Fit Guarantee: if you hire a candidate with an M-Score of 80% or higher and they leave within 12 months — including voluntary resignation — we provide a one-time free replacement candidate. You pay no new placement fee. The guarantee only does not apply if: (1) job activities deviate from the vacancy description, (2) there is demonstrable mismanagement, or (3) the position disappears due to reorganization. We dare to offer this because science shows that a high M-Score correlates with significantly higher retention.'
  },
  'faq.q9': { nl: 'In welke landen is Refurzy beschikbaar?', en: 'In which countries is Refurzy available?' },
  'faq.a9': {
    nl: 'Refurzy start in Nederland en België. Daarna volgt een uitrol naar 13 andere Europese landen, elk met lokale taal, valuta en pricing.',
    en: 'Refurzy launches in the Netherlands and Belgium. After that, a rollout to 13 other European countries follows, each with local language, currency and pricing.'
  },
  'faq.q10': { nl: 'Wat houdt exclusiviteit in?', en: 'What does exclusivity mean?' },
  'faq.a10': {
    nl: 'Bij het aanmaken van een vacature kunt u exclusiviteit activeren (+25% op de plaatsingsfee). Voorgedragen kandidaten zijn dan 14 dagen exclusief beschikbaar voor uw vacature en worden niet aan andere opdrachtgevers aangeboden voor vacatures in hetzelfde vakgebied. Sollicitaties in andere vakgebieden lopen gewoon door — een vacature in een heel ander vakgebied is immers geen concurrent voor uw positie. U betaalt alleen de toeslag bij een succesvolle plaatsing (no cure, no pay).',
    en: 'When creating a vacancy, you can activate exclusivity (+25% on the placement fee). Nominated candidates are then exclusively available for your vacancy for 14 days and will not be offered to other employers for vacancies in the same professional field. Applications in other fields continue as normal — a vacancy in a completely different field is not competing for your position. You only pay the surcharge upon a successful placement (no cure, no pay).'
  },

  // ─── CTA buttons ─────────────────────────────────────────────────────────
  'cta.btnEmployer': { nl: 'Start als opdrachtgever →', en: 'Start as employer →' },
  'cta.btnScout': { nl: 'Word Talent Scout', en: 'Become a Talent Scout' },

  // ─── Footer ────────────────────────────────────────────────────────────────
  'footer.platform': { nl: 'Platform', en: 'Platform' },
  'footer.company': { nl: 'Bedrijf', en: 'Company' },
  'footer.legal': { nl: 'Legal', en: 'Legal' },
  'footer.forEmployers': { nl: 'Voor opdrachtgevers', en: 'For employers' },
  'footer.forScouts': { nl: 'Voor Talent Scouts', en: 'For Talent Scouts' },
  'footer.forCandidates': { nl: 'Voor kandidaten', en: 'For candidates' },
  'footer.about': { nl: 'Over Refurzy', en: 'About Refurzy' },
  'footer.science': { nl: 'Wetenschap', en: 'Science' },
  'footer.contact': { nl: 'Contact', en: 'Contact' },
  'footer.privacy': { nl: 'Privacy Policy', en: 'Privacy Policy' },
  'footer.terms': { nl: 'Algemene Voorwaarden', en: 'Terms & Conditions' },
  'footer.cookies': { nl: 'Cookie Policy', en: 'Cookie Policy' },
  'footer.rights': { nl: '© 2026 Refurzy B.V. — Alle rechten voorbehouden', en: '© 2026 Refurzy B.V. — All rights reserved' },
} as const

export type TranslationKey = keyof typeof translations

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? key
}
