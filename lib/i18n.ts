export type Lang = 'nl' | 'en'

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
  'hero.roi': { nl: 'ROI vanaf 336%. No cure, no pay.', en: 'ROI from 336%. No cure, no pay.' },
  'hero.sub1': {
    nl: 'Eén verkeerde hire kost 50-200% van het jaarsalaris.¹ Bij een modaal salaris is dat €44.000 tot €175.000. En het overkomt 46% van alle aannames.²',
    en: 'One wrong hire costs 50-200% of the annual salary.¹ At an average salary, that\'s €44,000 to €175,000. And it happens to 46% of all hires.²'
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
    nl: 'Eén verkeerde hire kost 50-200% van het jaarsalaris aan herwervingskosten, productiviteitsverlies en teamschade. Bij een modaal salaris is dat €44.000 tot €175.000. En 46% van nieuwe medewerkers faalt binnen 18 maanden.',
    en: 'One wrong hire costs 50-200% of the annual salary in re-recruitment, lost productivity and team damage. At an average salary, that\'s €44,000 to €175,000. And 46% of new hires fail within 18 months.'
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
    nl: 'Werven is niet waarvoor managers zijn aangenomen. Ze vinden het tijdrovend, onzeker en frustrerend. Als ze het leuk hadden gevonden, waren ze wel recruiter geworden.',
    en: 'Recruiting is not what managers were hired for. They find it time-consuming, uncertain and frustrating. If they had enjoyed it, they would have become recruiters.'
  },
  'pain.market.title': { nl: 'Eén bureau, één vijver. Honderden scouts, oneindig bereik.', en: 'One agency, one pond. Hundreds of scouts, infinite reach.' },
  'pain.market.desc': {
    nl: 'Bureaus zoeken allemaal in dezelfde LinkedIn-vijver. Onze Talent Scouts werken gericht binnen hun eigen netwerk — mensen die ze kennen, hebben gesproken en kunnen inschatten. En omdat honderden scouts tegelijk voor u zoeken, is uw bereik vele malen groter dan dat van één bureau.',
    en: 'Agencies all fish in the same LinkedIn pond. Our Talent Scouts work their own networks — people they know, have spoken to, and can assess. And with hundreds of scouts searching for you simultaneously, your reach is far greater than any single agency.'
  },

  // ─── How it works ──────────────────────────────────────────────────────────
  'how.title': { nl: 'Hoe Refurzy werkt', en: 'How Refurzy works' },
  'how.subtitle': {
    nl: 'Drie rollen, één platform. Elke stap is ontworpen om werving sneller, objectiever en eerlijker te maken.',
    en: 'Three roles, one platform. Every step is designed to make recruitment faster, more objective and fairer.'
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

  // ─── FAQ ───────────────────────────────────────────────────────────────────
  'faq.title': { nl: 'Veelgestelde vragen', en: 'Frequently asked questions' },

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
