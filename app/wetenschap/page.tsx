'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Lang } from '@/lib/i18n'
import LangToggle from '@/components/LangToggle'

const texts = {
  nl: {
    nav: {
      howItWorks: 'Hoe het werkt',
      pricing: 'Pricing',
      science: 'Wetenschap',
      faq: 'FAQ',
      login: 'Inloggen',
    },
    hero: {
      badge: 'Wetenschappelijke onderbouwing',
      h1a: 'De wetenschap achter de',
      h1b: 'Matching Scan',
      sub: 'De Matching Scan is ontwikkeld in samenwerking met de Vrije Universiteit Amsterdam. Dit document vat de wetenschappelijke basis samen en laat zien hoe dit zich vertaalt naar het Refurzy platform.',
    },
    summary: {
      title: 'Samenvatting — overtuig je manager in 60 seconden',
      sub: 'De 5 redenen waarom Refurzy een betere keuze is dan een traditioneel bureau',
      items: [
        { icon: '🎯', text: 'De Matching Scan voorspelt of een kandidaat past bij je organisatie — vóór de aanname. Ontwikkeld met de Vrije Universiteit Amsterdam, getest bij 309 werknemers. De scan meet werkinteresses, kernwaarden en cultuurvoorkeur — drie factoren die statistisch zeer sterk correleren met bevlogenheid, werkgeluk en retentie. Het resultaat: 39–59% minder mis-hires.' },
        { icon: '📉', text: '46% van alle aannames faalt binnen 18 maanden. Eén verkeerde hire kost €44.000–€175.000 (bij een bruto maandsalaris van €5.000). Refurzy vermindert dit risico met 39–59% door wetenschappelijk bewezen matching.' },
        { icon: '💰', text: 'Gemiddeld 60% goedkoper dan een traditioneel bureau. Vaste, transparante tarieven. No cure, no pay — je betaalt alleen bij een succesvolle plaatsing.' },
        { icon: '📊', text: 'ROI van 455–1370% in het eerste jaar, zelfs voor een klein bedrijf met 3 hires per jaar. Cumulatief over 5 jaar: €272.000–€748.000 besparing.*' },
        { icon: '🔬', text: 'Niet gebaseerd op buikgevoel maar op onderzoek. De scan meet werkinteresses, kernwaarden en cultuurvoorkeur — drie factoren die werkgeluk en retentie zeer sterk voorspellen.' },
      ],
      fn1: 'VU Amsterdam (De Vries, 2026; N=309)',
      fn2: 'Aberdeen Group (2015): 39% bij pre-hire assessments · Gallup: 59% bij hoog engagement',
      fn3: 'Leadership IQ',
      fn4: 'SHRM (2024): 50–200% van jaarsalaris',
      fn5: 'Berekeningen zijn gebaseerd op een bruto maandsalaris van €5.000.',
    },
    org: {
      title: 'Wat betekent dit voor uw organisatie?',
      sub: 'De Matching Scan voorspelt bevlogenheid, werkgeluk en retentie. Hieronder de concrete effecten — onderbouwd door onafhankelijk onderzoek.',
      items: [
        { title: '39–59% minder verloop', desc: 'Bedrijven die pre-hire assessments inzetten rapporteren 39% minder verloop (Aberdeen Group). Bij organisaties met hoog engagement — sterk gecorreleerd met goede P-O fit — loopt dit op tot 59% (Gallup). Case studies met vergelijkbare culture fit tools bevestigen dit (PRADCO, ASK).', source: 'Aberdeen Group · Gallup · PRADCO · ASK/AssessCandidates · Kristof-Brown et al., 2005' },
        { title: '€44.000–€175.000 bespaard per voorkomen mis-hire', desc: '46% van alle aannames faalt binnen 18 maanden. De totale kosten per mis-hire bedragen 50–200% van het jaarsalaris + werkgeverslasten (bij een bruto maandsalaris van €5.000).', source: 'SHRM (2024); Leadership IQ' },
        { title: 'Hogere productiviteit', desc: 'Bevlogen medewerkers presteren aantoonbaar beter. De Matching Scan voorspelt bevlogenheid met β = .30** — een sterk effect in organisatieonderzoek.', source: 'Halbesleben & Wheeler, 2008' },
        { title: '4× meer geneigd om te blijven', desc: 'Medewerkers met een positieve cultuurmatch zijn bijna 4× meer geneigd te blijven. Bij slechte fit zoekt 57% actief een nieuwe baan, tegenover slechts 15% bij goede fit.', source: 'SHRM, 2024 (N=11.080, 15 landen)' },
        { title: 'Snellere besluitvorming', desc: 'De gemiddelde time-to-hire is 68,5 dagen. 81% van hiring managers twijfelt over de juiste keuze. De M-Score geeft zekerheid en versnelt beslissingen.', source: 'SHRM, 2025; Resume Genius, 2024' },
        { title: 'Positieve spiraal na 2–3 jaar', desc: 'Bij systematisch gebruik wordt de organisatiecultuur sterker. Een sterkere cultuur trekt betere kandidaten aan, wat de cultuur verder versterkt.', source: 'SHRM, 2024; Kristof-Brown et al., 2005' },
      ],
      misHireToggleShow: 'Hoe is €44.000–€175.000 opgebouwd? ↓',
      misHireToggleHide: 'Kostenopbouw verbergen ↑',
      misHireTitle: 'SHRM becijfert de totale kosten van een mis-hire op 50–200% van het jaarsalaris + werkgeverslasten. Bij een bruto maandsalaris van €5.000 bedragen de totale loonkosten €87.480/jaar (€60.000 salaris + €4.800 vakantiegeld + €22.680 werkgeverslasten). 50% daarvan = €44.000, 200% = €175.000. Opgebouwd uit:',
      misHireItems: [
        { label: 'Herwervingskosten', desc: 'vacature, jobboards, recruiter-tijd, gehele selectieprocedure opnieuw' },
        { label: 'Verloren productiviteit', desc: 'de vertrekkende medewerker presteert weken tot maanden onder niveau, de positie staat vervolgens maanden open' },
        { label: 'Onboarding en training', desc: 'alles wat u investeerde in inwerken, cursussen en begeleiding is verloren' },
        { label: 'Managementtijd', desc: 'leidinggevenden besteden honderden uren aan coaching, functioneringsgesprekken en afhandeling' },
        { label: 'Teamschade', desc: 'verloop ondermijnt het moreel en de productiviteit van het hele team. Kennis en relaties verdwijnen' },
        { label: 'Ontslagkosten (VSO/transitievergoeding)', desc: 'in Nederland moet bij gedwongen vertrek vaak een vaststellingsovereenkomst worden gesloten, gemiddeld 1–3 bruto maandsalarissen extra' },
      ],
      misHireWarning: '⚠️ Let op: de SHRM-schatting van 50–200% is gebaseerd op Amerikaans onderzoek, waar ontslagkosten lager zijn. In Nederland komen hier vaak nog VSO-kosten bovenop. De werkelijke kosten per mis-hire liggen daarmee gemiddeld genomen nog hoger.',
      misHireSource: 'Bron: SHRM, The Real Costs of Recruitment →',
      conclusion: 'Kort gezegd: medewerkers die passen bij uw organisatie zijn productiever, gelukkiger en blijven langer — en dat bespaart €44.000–€175.000 per voorkomen mis-hire (o.b.v. bruto maandsalaris €5.000).',
    },
    comparison: {
      title: 'Refurzy vs. traditioneel werven',
      cols: ['', 'Traditioneel bureau', 'Refurzy'],
      rows: [
        { label: 'Kosten per hire', traditional: '20–30% bruto jaarsalaris\ngem. €16.000', refurzy: 'Vast tarief\ngem. €4.333' },
        { label: 'Wetenschappelijke matching', traditional: 'Nee — buikgevoel', refurzy: 'Ja — VU Amsterdam' },
        { label: 'Mis-hire risico', traditional: '46% faalt <18 mnd', refurzy: '39–59% lager risico' },
        { label: 'Betalingsmodel', traditional: 'Retainer verplicht\nkwijt bij eigen match', refurzy: 'No cure, no pay\ngeen retainer' },
        { label: 'Exclusiviteit', traditional: 'Vaak verplicht\nje zit vast aan het bureau', refurzy: 'Niet verplicht\nvrij om parallel te werven' },
        { label: 'Voorspelling van werkgeluk', traditional: 'Niet gemeten', refurzy: 'M-Score (0–100%)' },
        { label: 'Fit Garantie', traditional: 'Zelden', refurzy: 'Standaard' },
      ],
    },
    scan: {
      title: 'Wat meet de Matching Scan?',
      p1: 'De Matching Scan meet hoe goed een kandidaat bij uw organisatie past — niet op basis van cv of ervaring, maar op waarden, interesses en cultuur. Dit heet in de wetenschap "Person-Organization fit": de compatibiliteit tussen persoon en organisatie.',
      p2: 'Onderzoek toont aan dat deze match een veel sterkere voorspeller is van werkgeluk en retentie dan traditionele selectiemethoden zoals capaciteitstests of ongestructureerde interviews.',
      sources: 'Bronnen: Kristof-Brown et al. (2005, 2023), Granillo-Velasquez et al. (2024), Liu et al. (2024).',
    },
    questions: {
      title: 'De 35 vragen — wat meten ze?',
      sub: 'De scan bestaat uit 35 vragen verdeeld over vier categorieën. Drie daarvan worden gebruikt voor matching. Gevalideerd door de VU Amsterdam bij 309 werknemers (2026).',
      items: [
        { title: 'Werkinteresses (19 vragen)', desc: 'Wat doet iemand graag? Welke taken en activiteiten geven energie? Als dit aansluit bij de functie, is iemand gemotiveerder en productiever.', stats: 'Sterke voorspeller van werkgeluk, tevredenheid en betrokkenheid', regression: 'Effect blijft na correctie voor leeftijd, opleiding en salaris', color: 'cyan' },
        { title: 'Kernwaarden (9 vragen)', desc: 'Wat vindt iemand écht belangrijk? Eerlijkheid, innovatie, zekerheid? Als de waarden van een medewerker overeenkomen met die van de organisatie, blijft iemand langer, is diegene gelukkiger en productiever.', stats: 'De sterkste voorspeller van alle drie de werkuitkomsten', regression: 'Grootste effect — de belangrijkste dimensie', color: 'purple' },
        { title: 'Cultuurvoorkeur (7 vragen)', desc: 'In welke werkomgeving voelt iemand zich thuis? Formeel of informeel? Hiërarchisch of plat? Resultaatgericht of procesgericht? Dit bepaalt of iemand zich thuisvoelt.', stats: 'Voorspelt of iemand zich thuisvoelt in de organisatie', regression: 'Draagt significant bij aan het totaalbeeld', color: 'orange' },
        { title: 'Competenties (9 vragen) — bewust NIET gebruikt voor matching', desc: 'Verrassend: uit het VU-onderzoek blijkt dat de overlap tussen gewenste en zelfgerapporteerde competenties géén verband heeft met werkgeluk of retentie. Anders gezegd: of iemand denkt de juiste vaardigheden te hebben voor een rol, voorspelt niet of diegene er gelukkig van wordt of blijft. Wat wél voorspelt of iemand gelukkig wordt: of de waarden, interesses en cultuurvoorkeur overeenkomen. Niet "kan iemand dit?" maar "past iemand hier?". Competenties beoordeelt u zelf via cv, gesprek en proefopdracht.', stats: 'Geen verband tussen competentie-match en werkgeluk of retentie', regression: '', color: 'gray' },
      ],
      resultLabel: 'Resultaat:',
      correctionLabel: 'Na correctie:',
    },
    mscore: {
      title: 'De M-Score: uw objectieve matchindicator',
      p: 'Zowel de organisatie als de kandidaat vullen dezelfde 35 vragen in (~15 minuten). Het systeem berekent hoe goed beide profielen op elkaar aansluiten. Het resultaat is de M-Score: een percentage van 0–100% dat aangeeft hoe goed de match is.',
      card1: 'Werkgeluk',
      card2: 'Tevredenheid',
      card3: 'Retentie',
      cardSub: 'Zeer sterke voorspeller¹',
      whatTitle: 'Wat betekent dit concreet?',
      whatText: 'Een hogere M-Score betekent dat een kandidaat beter past bij uw organisatie. Dit voorspelt dat hij of zij gelukkiger, productiever en langer bij u zal werken. Het werkt beter dan traditionele selectiemethoden zoals cv-screening of ongestructureerde interviews.¹',
      footnote: '¹ Onderzocht bij 309 werknemers door de VU Amsterdam (2026). Effect blijft na correctie voor leeftijd, opleiding, salaris en dienstjaren. Ter vergelijking: traditionele capaciteitstests voorspellen werkprestaties met r = .16 (Sackett et al., 2024).',
    },
    practice: {
      title: 'Hoe werkt het in de praktijk?',
      stepsTitle: 'Van vacature tot match in 4 stappen',
      steps: [
        { nr: '1', title: 'U vult de Matching Scan in', desc: 'Eénmalig ~15 minuten. U beantwoordt 35 vragen over de waarden, interesses en cultuur van uw organisatie.' },
        { nr: '2', title: 'Kandidaten vullen dezelfde scan in', desc: 'Kandidaten die door een Talent Scout worden voorgedragen, vullen dezelfde 35 vragen in. Dit duurt ook ~15 minuten.' },
        { nr: '3', title: 'Het systeem berekent de match', desc: 'De M-Score (0–100%) wordt automatisch berekend: hoe hoger de score, hoe beter de kandidaat past bij uw organisatie.' },
        { nr: '4', title: 'U ziet het resultaat in uw dashboard', desc: 'Per kandidaat ziet u de M-Score, of iemand voldoet aan de harde criteria (opleiding, ervaring), en de beoordeling van de Talent Scout.' },
      ],
      diffTitle: 'Het verschil: weten voor je aanneemt',
      diffText: 'Normaal ontdek je pas na maanden of iemand echt bij je organisatie past. Dan is het te laat — 46% van alle aannames faalt binnen 18 maanden (Leadership IQ). Met Refurzy weet u dit voor de aanname.',
      card1Title: 'Betere selectie',
      card1Text: 'U besteedt uw tijd aan kandidaten die echt passen. Kandidaten met een lage match worden eruit gefilterd voordat u ze spreekt.',
      card2Title: 'Minder twijfel',
      card2Text: '81% van hiring managers twijfelt bij aannames (Resume Genius, 2024). De M-Score geeft een objectief antwoord naast uw eigen gevoel.',
    },
    delivers: {
      title: 'Wat levert het op?',
      items: [
        { title: 'Minder verkeerde aannames', desc: 'Een mis-hire kost €44.000–€175.000 (50–200% van het jaarsalaris + werkgeverslasten, o.b.v. bruto maandsalaris €5.000). Door vooraf te meten of iemand past, vermindert u dit risico met 39–59%.', source: 'SHRM, 2024 · Kristof-Brown et al., 2005' },
        { title: 'Gelukkigere medewerkers', desc: 'Medewerkers die passen bij de organisatie zijn aantoonbaar gelukkiger, gemotiveerder en meer betrokken. Win-win: lagere kosten voor u, hoger welzijn voor hen.', source: 'VU Amsterdam, 2026 (N=309)' },
        { title: 'Hogere productiviteit', desc: 'Betrokken medewerkers presteren aantoonbaar beter. Werkbevlogenheid — een directe uitkomst van goede P-O fit — voorspelt hogere werkprestaties en minder verzuim.', source: 'Halbesleben & Wheeler, 2008' },
        { title: 'Mensen blijven langer', desc: 'Medewerkers die passen bij de cultuur zijn minder geneigd om weg te gaan. Organisaties met hoge betrokkenheid hebben 59% minder verloop. Case studies tonen reducties van 40–59%.', source: 'Kristof-Brown et al., 2005 · PRADCO · ASK/AssessCandidates' },
        { title: '39% minder verloop met assessments', desc: 'Bedrijven die pre-hire assessments inzetten (zoals de Matching Scan) rapporteren gemiddeld 39% lagere turnover dan bedrijven zonder.', source: 'Aberdeen Group' },
        { title: '4× meer kans dat mensen blijven', desc: 'Medewerkers die hun organisatiecultuur als positief beoordelen zijn bijna 4× meer geneigd om te blijven. Bij een slechte cultuur zoekt 57% actief naar een nieuwe baan.', source: 'SHRM, 2024 (N=11.080, 15 landen)' },
        { title: 'Sneller beslissen', desc: '81% van hiring managers twijfelt bij aannames. De gemiddelde time-to-hire is 68,5 dagen. De M-Score geeft een objectief datapunt, zodat u sneller en zekerder kunt beslissen.', source: 'Resume Genius, 2024 · SHRM, 2025' },
        { title: 'Werkt wereldwijd', desc: 'P-O fit is universeel voorspellend voor werkuitkomsten, bevestigd in Oost-Azië, Europa en Noord-Amerika. Het principe geldt ongeacht land of cultuur.', source: 'Oh et al., 2014 (meta-analyse)' },
        { title: 'Minder vooroordelen', desc: 'Traditionele sollicitatiegesprekken zijn gevoelig voor vooroordelen en eerste indrukken. De Matching Scan is gestandaardiseerd en objectief — dezelfde maatstaf voor iedereen.', source: 'Sackett et al., 2024' },
        { title: 'Sterkere bedrijfscultuur', desc: 'Wanneer nieuwe medewerkers qua waarden beter passen, versterken zij de cultuur. Dit trekt weer betere kandidaten aan — een positieve spiraal die na 2–3 jaar duidelijk zichtbaar wordt.', source: 'SHRM, 2024' },
        { title: 'Minder werkdruk voor HR', desc: 'Minder verloop betekent minder vacatures, minder inwerken en minder herhaalde selectieprocessen. Stabielere teams en minder "draaideureffect".', source: 'Wetenschappelijke onderbouwing Refurzy' },
        { title: 'Sterker werkgeversmerk', desc: 'Betere P-O fit leidt tot hogere engagement scores, betere Glassdoor reviews en sterkere aantrekkingskracht voor toekomstige kandidaten.', source: 'Wetenschappelijke onderbouwing Refurzy' },
      ],
      wnukTitle: 'Internationaal bevestigd: P-O fit vermindert vertrekintentie via zingeving',
      wnukText: 'Een recente studie onder 1.071 werknemers bevestigt dat P-O fit zowel direct als indirect (via zingeving in het werk) negatief samenhangt met vertrekintentie. Medewerkers die passen bij hun organisatie ervaren meer betekenis in hun werk, en vertrekken daardoor minder snel.',
      wnukSource: 'Wnuk & Chudzicka-Czupala, 2026 (N=1.071)',
    },
    business: {
      title: 'Doorgerekend: de business case',
      intro: 'De financiële impact van Refurzy komt uit twee bronnen:',
      source1Title: 'Minder mis-hires',
      source1Text: 'Eén verkeerde aanname kost 50–200% van het jaarsalaris + werkgeverslasten (SHRM, 2024). Door wetenschappelijk bewezen matching op basis van Person-Organization fit daalt het verloop met 39–59%. Bij een gemiddeld salaris van €60.000 bespaart dat €30.000–€120.000 per vermeden mis-hire.',
      source2Title: 'Lagere wervingskosten',
      source2Text: 'Traditionele bureaus rekenen 15–27% van het bruto jaarsalaris. Refurzy werkt met vaste, transparante tarieven per plaatsing op basis van opleidingsniveau en ervaring — gemiddeld 60% goedkoper. No cure, no pay: u betaalt alleen bij een succesvolle plaatsing.',
      case1Title: 'Middelgroot bedrijf',
      case1Sub: '100 medewerkers · 13,5% turnover · gemiddeld salaris €5.000/mnd',
      case1Rows: [
        { label: 'Refurzy kosten jaar 1', value: '€58.496' },
        { label: 'Netto besparing/jaar (39% reductie)', value: '€196.000' },
        { label: 'Netto besparing/jaar (59% reductie)', value: '€1.370.000' },
        { label: 'Cumulatief over 5 jaar', value: '€793.000 – €5.489.000', bold: true },
      ],
      case2Title: 'Klein bedrijf',
      case2Sub: '3 hires/jaar · geen interne recruiter · gemiddeld salaris €5.000/mnd',
      case2Rows: [
        { label: 'Traditioneel bureau (3 hires)', value: '€48.600/jaar', red: true },
        { label: 'Refurzy (3 hires)', value: '€12.999/jaar' },
        { label: 'Netto besparing/jaar', value: '€59.000 – €178.000' },
        { label: 'ROI', value: '455% – 1370%', bold: true },
        { label: 'Cumulatief over 5 jaar', value: '€272.000 – €748.000', bold: true },
      ],
      disclaimer: 'Financiële berekeningen opgesteld door Refurzy op basis van industrie-data (SHRM, BLS). Wetenschappelijke validatie door de Vrije Universiteit Amsterdam betreft de Matching Scan en werkuitkomsten, niet de financiële doorrekeningen.',
    },
    limitations: {
      title: 'Eerlijk over de beperkingen',
      sub: 'Transparantie is belangrijk. De Matching Scan is een krachtig hulpmiddel, maar geen kristallen bol.',
      items: [
        { title: 'Een sterke indicator, geen garantie', text: 'De scan voorspelt werkgeluk en retentie zeer sterk, maar er spelen ook andere factoren mee: salaris, leiderschapskwaliteit, werk-privé balans. Daarom combineert u de M-Score altijd met uw eigen gesprekken en beoordeling.' },
        { title: 'Gebaseerd op eerlijke antwoorden', text: 'Kandidaten vullen de scan zelf in. De vragen zijn zo ontworpen dat er geen "goede" antwoorden zijn — het gaat om voorkeur, niet om prestatie. Dit maakt sociaal wenselijke antwoorden onwaarschijnlijk.' },
        { title: 'Eén persoon vult het organisatieprofiel in', text: 'De cultuur kan per afdeling verschillen. In grote organisaties kan het zinvol zijn om meerdere profielen aan te maken per team of afdeling.' },
        { title: 'Onderzocht in Nederland', text: 'Het VU-onderzoek is uitgevoerd met Nederlandse werknemers. Internationaal onderzoek toont aan dat het principe universeel werkt, maar lokale validatie volgt.' },
      ],
    },
    conclusion: {
      title: 'Conclusie',
      p1: 'Refurzy combineert wetenschappelijk bewezen matching met ervaren recruiters en AI-technologie. Het resultaat: betere kandidaten, minder risico, en gemiddeld 60% lagere kosten dan een traditioneel bureau.',
      p2: 'No cure, no pay. U betaalt alleen bij een succesvolle plaatsing. Met Fit Garantie.',
      cta1: 'Start vandaag →',
      cta2: 'Bekijk tarieven',
      validated: 'Wetenschappelijk gevalideerd door de Vrije Universiteit Amsterdam (2026, N=309).',
    },
    references: {
      title: 'Referenties',
      items: [
        'Aberdeen Group. Pre-hire assessments and turnover reduction benchmarks.',
        'Arthur, W., Jr., Bell, S. T., Villado, A. J., & Doverspike, D. (2006). The use of person-organization fit in employment decision making. Journal of Applied Psychology, 91(4), 786-801.',
        'Funder, D. C., & Ozer, D. J. (2019). Evaluating effect size in psychological research. Advances in Methods and Practices in Psychological Science, 2(2), 156-168.',
        'Halbesleben, J. R. B., & Wheeler, A. R. (2008). The relative roles of engagement and embeddedness in predicting job performance and intention to leave. Work & Stress, 22(3), 242-256.',
        'Kristof-Brown, A. L., Zimmerman, R. D., & Johnson, E. C. (2005). Consequences of individuals\' fit at work: A meta-analysis. Personnel Psychology, 58(2), 281-342.',
        'Leadership IQ. Why new hires fail: 46% failure rate within 18 months. Industry report.',
        'O\'Reilly, C. A., Chatman, J., & Caldwell, D. F. (2014). People and organizational culture. Academy of Management Journal, 34(3), 487-516.',
        'Oh, I.-S., Guay, R. P., Kim, K., Harold, C. M., Lee, J.-H., Heo, C.-G., & Shin, K.-H. (2014). Fit happens globally: A meta-analytic comparison of the relationships of person-environment fit dimensions with work attitudes and performance across East Asia, Europe, and North America. Personnel Psychology, 67(1), 99-152.',
        'PRADCO. Culture fit assessment case study: 40% turnover reduction.',
        'ASK/AssessCandidates. Pre-hire culture assessment case study: 59% turnover reduction.',
        'Resume Genius (2024). Hiring manager survey: 81% report ghosting candidates due to uncertainty.',
        'Sackett, P. R., et al. (2024). Revisiting meta-analytic estimates of validity in personnel selection. Journal of Applied Psychology.',
        'SHRM (2024). The Real Costs of Recruitment. N=11.080, 15 landen. Society for Human Resource Management.',
        'SHRM (2025). Average time-to-hire benchmark: 68,5 dagen.',
        'Vrije Universiteit Amsterdam (2026). Profiel Match Scan: empirisch onderzoek naar P-O fit en werkuitkomsten. N=309.',
        'Wnuk, M. & Chudzicka-Czupała, A. (2026). P-O fit, meaning in work and turnover intention. N=1.071.',
      ],
    },
    backLink: '← Terug naar homepage',
  },
  en: {
    nav: {
      howItWorks: 'How it works',
      pricing: 'Pricing',
      science: 'Science',
      faq: 'FAQ',
      login: 'Log in',
    },
    hero: {
      badge: 'Scientific foundation',
      h1a: 'The science behind the',
      h1b: 'Matching Scan',
      sub: 'The Matching Scan was developed in collaboration with Vrije Universiteit Amsterdam. This document summarises the scientific basis and shows how it translates to the Refurzy platform.',
    },
    summary: {
      title: 'Summary — convince your manager in 60 seconds',
      sub: 'The 5 reasons why Refurzy is a better choice than a traditional agency',
      items: [
        { icon: '🎯', text: 'The Matching Scan predicts whether a candidate fits your organisation — before hiring. Developed with Vrije Universiteit Amsterdam, tested on 309 employees. The scan measures work interests, core values and culture preference — three factors that statistically correlate strongly with engagement, job happiness and retention. The result: 39–59% fewer mis-hires.' },
        { icon: '📉', text: '46% of all hires fail within 18 months. One wrong hire costs €44,000–€175,000 (at a gross monthly salary of €5,000). Refurzy reduces this risk by 39–59% through scientifically proven matching.' },
        { icon: '💰', text: 'On average 60% cheaper than a traditional agency. Fixed, transparent rates. No cure, no pay — you only pay on a successful placement.' },
        { icon: '📊', text: 'ROI of 455–1370% in the first year, even for a small company with 3 hires per year. Cumulative over 5 years: €272,000–€748,000 in savings.*' },
        { icon: '🔬', text: 'Not based on gut feeling but on research. The scan measures work interests, core values and culture preference — three factors that strongly predict job happiness and retention.' },
      ],
      fn1: 'VU Amsterdam (De Vries, 2026; N=309)',
      fn2: 'Aberdeen Group (2015): 39% with pre-hire assessments · Gallup: 59% with high engagement',
      fn3: 'Leadership IQ',
      fn4: 'SHRM (2024): 50–200% of annual salary',
      fn5: 'Calculations based on a gross monthly salary of €5,000.',
    },
    org: {
      title: 'What does this mean for your organisation?',
      sub: 'The Matching Scan predicts engagement, job happiness and retention. Below are the concrete effects — backed by independent research.',
      items: [
        { title: '39–59% less turnover', desc: 'Companies using pre-hire assessments report 39% less turnover (Aberdeen Group). In organisations with high engagement — strongly correlated with good P-O fit — this rises to 59% (Gallup). Case studies with comparable culture fit tools confirm this (PRADCO, ASK).', source: 'Aberdeen Group · Gallup · PRADCO · ASK/AssessCandidates · Kristof-Brown et al., 2005' },
        { title: '€44,000–€175,000 saved per prevented mis-hire', desc: '46% of all hires fail within 18 months. The total cost per mis-hire is 50–200% of annual salary + employer costs (at a gross monthly salary of €5,000).', source: 'SHRM (2024); Leadership IQ' },
        { title: 'Higher productivity', desc: 'Engaged employees demonstrably perform better. The Matching Scan predicts engagement with β = .30** — a strong effect in organisational research.', source: 'Halbesleben & Wheeler, 2008' },
        { title: '4× more likely to stay', desc: 'Employees with a positive culture match are nearly 4× more likely to stay. With poor fit, 57% actively look for a new job, versus only 15% with good fit.', source: 'SHRM, 2024 (N=11,080, 15 countries)' },
        { title: 'Faster decision-making', desc: 'The average time-to-hire is 68.5 days. 81% of hiring managers doubt their choice. The M-Score provides certainty and speeds up decisions.', source: 'SHRM, 2025; Resume Genius, 2024' },
        { title: 'Positive spiral after 2–3 years', desc: 'With systematic use, organisational culture becomes stronger. A stronger culture attracts better candidates, which further strengthens the culture.', source: 'SHRM, 2024; Kristof-Brown et al., 2005' },
      ],
      misHireToggleShow: 'How is €44,000–€175,000 calculated? ↓',
      misHireToggleHide: 'Hide cost breakdown ↑',
      misHireTitle: 'SHRM estimates the total cost of a mis-hire at 50–200% of annual salary + employer costs. At a gross monthly salary of €5,000, total employment costs are €87,480/year (€60,000 salary + €4,800 holiday pay + €22,680 employer costs). 50% = €44,000, 200% = €175,000. Made up of:',
      misHireItems: [
        { label: 'Recruitment costs', desc: 'job posting, job boards, recruiter time, entire selection process repeated' },
        { label: 'Lost productivity', desc: 'the departing employee underperforms for weeks to months, the position then remains open for months' },
        { label: 'Onboarding and training', desc: 'everything invested in induction, courses and guidance is lost' },
        { label: 'Management time', desc: 'managers spend hundreds of hours on coaching, performance reviews and resolution' },
        { label: 'Team damage', desc: 'turnover undermines the morale and productivity of the entire team. Knowledge and relationships disappear' },
        { label: 'Severance costs', desc: 'in many countries, forced departure requires a settlement agreement or statutory severance pay, averaging 1–3 gross monthly salaries extra' },
      ],
      misHireWarning: '⚠️ Note: the SHRM estimate of 50–200% is based on US research, where severance costs are lower. In the Netherlands, VSO costs often apply on top of this. The actual cost per mis-hire is therefore on average even higher.',
      misHireSource: 'Source: SHRM, The Real Costs of Recruitment →',
      conclusion: 'In short: employees who fit your organisation are more productive, happier and stay longer — saving €44,000–€175,000 per prevented mis-hire (based on gross monthly salary €5,000).',
    },
    comparison: {
      title: 'Refurzy vs. traditional recruitment',
      cols: ['', 'Traditional agency', 'Refurzy'],
      rows: [
        { label: 'Cost per hire', traditional: '20–30% gross annual salary\navg. €16,000', refurzy: 'Fixed rate\navg. €4,333' },
        { label: 'Scientific matching', traditional: 'No — gut feeling', refurzy: 'Yes — VU Amsterdam' },
        { label: 'Mis-hire risk', traditional: '46% fail <18 months', refurzy: '39–59% lower risk' },
        { label: 'Payment model', traditional: 'Retainer required\nlost if you find your own match', refurzy: 'No cure, no pay\nno retainer' },
        { label: 'Exclusivity', traditional: 'Often mandatory\nyou are tied to the agency', refurzy: 'Not mandatory\nfree to recruit in parallel' },
        { label: 'Job happiness prediction', traditional: 'Not measured', refurzy: 'M-Score (0–100%)' },
        { label: 'Fit Guarantee', traditional: 'Rarely', refurzy: 'Standard' },
      ],
    },
    scan: {
      title: 'What does the Matching Scan measure?',
      p1: 'The Matching Scan measures how well a candidate fits your organisation — not based on CV or experience, but on values, interests and culture. In science this is called "Person-Organization fit": the compatibility between person and organisation.',
      p2: 'Research shows that this match is a much stronger predictor of job happiness and retention than traditional selection methods such as aptitude tests or unstructured interviews.',
      sources: 'Sources: Kristof-Brown et al. (2005, 2023), Granillo-Velasquez et al. (2024), Liu et al. (2024).',
    },
    questions: {
      title: 'The 35 questions — what do they measure?',
      sub: 'The scan consists of 35 questions divided into four categories. Three of them are used for matching. Validated by VU Amsterdam on 309 employees (2026).',
      items: [
        { title: 'Work interests (19 questions)', desc: 'What does someone enjoy doing? Which tasks and activities give energy? When this matches the role, someone is more motivated and productive.', stats: 'Strong predictor of job happiness, satisfaction and engagement', regression: 'Effect persists after correction for age, education and salary', color: 'cyan' },
        { title: 'Core values (9 questions)', desc: 'What does someone really care about? Honesty, innovation, security? When an employee\'s values align with those of the organisation, they stay longer, are happier and more productive.', stats: 'The strongest predictor of all three work outcomes', regression: 'Largest effect — the most important dimension', color: 'purple' },
        { title: 'Culture preference (7 questions)', desc: 'In what work environment does someone feel at home? Formal or informal? Hierarchical or flat? Results-oriented or process-oriented? This determines whether someone feels at home.', stats: 'Predicts whether someone feels at home in the organisation', regression: 'Contributes significantly to the overall picture', color: 'orange' },
        { title: 'Competencies (9 questions) — deliberately NOT used for matching', desc: 'Surprisingly: VU research shows that the overlap between desired and self-reported competencies has no relationship with job happiness or retention. In other words: whether someone thinks they have the right skills for a role does not predict whether they will be happy or stay. What does predict happiness: whether values, interests and culture preference align. Not "can someone do this?" but "does someone fit here?". You assess competencies yourself via CV, interview and test assignment.', stats: 'No relationship between competency match and job happiness or retention', regression: '', color: 'gray' },
      ],
      resultLabel: 'Result:',
      correctionLabel: 'After correction:',
    },
    mscore: {
      title: 'The M-Score: your objective match indicator',
      p: 'Both the organisation and the candidate complete the same 35 questions (~15 minutes). The system calculates how well both profiles align. The result is the M-Score: a percentage from 0–100% indicating how good the match is.',
      card1: 'Job happiness',
      card2: 'Satisfaction',
      card3: 'Retention',
      cardSub: 'Very strong predictor¹',
      whatTitle: 'What does this mean in practice?',
      whatText: 'A higher M-Score means a candidate fits your organisation better. This predicts that they will be happier, more productive and stay longer with you. It works better than traditional selection methods such as CV screening or unstructured interviews.¹',
      footnote: '¹ Researched on 309 employees by VU Amsterdam (2026). Effect persists after correction for age, education, salary and years of service. For comparison: traditional aptitude tests predict job performance with r = .16 (Sackett et al., 2024).',
    },
    practice: {
      title: 'How does it work in practice?',
      stepsTitle: 'From vacancy to match in 4 steps',
      steps: [
        { nr: '1', title: 'You complete the Matching Scan', desc: 'Once, ~15 minutes. You answer 35 questions about your organisation\'s values, interests and culture.' },
        { nr: '2', title: 'Candidates complete the same scan', desc: 'Candidates put forward by a Talent Scout complete the same 35 questions. This also takes ~15 minutes.' },
        { nr: '3', title: 'The system calculates the match', desc: 'The M-Score (0–100%) is automatically calculated: the higher the score, the better the candidate fits your organisation.' },
        { nr: '4', title: 'You see the result in your dashboard', desc: 'Per candidate you see the M-Score, whether someone meets the hard criteria (education, experience), and the Talent Scout\'s assessment.' },
      ],
      diffTitle: 'The difference: knowing before you hire',
      diffText: 'Normally you only discover after months whether someone truly fits your organisation. By then it is too late — 46% of all hires fail within 18 months (Leadership IQ). With Refurzy you know this before hiring.',
      card1Title: 'Better selection',
      card1Text: 'You spend your time on candidates who truly fit. Candidates with a low match are filtered out before you speak to them.',
      card2Title: 'Less doubt',
      card2Text: '81% of hiring managers doubt when making hires (Resume Genius, 2024). The M-Score provides an objective answer alongside your own judgement.',
    },
    delivers: {
      title: 'What does it deliver?',
      items: [
        { title: 'Fewer wrong hires', desc: 'A mis-hire costs €44,000–€175,000 (50–200% of annual salary + employer costs, based on gross monthly salary €5,000). By measuring fit upfront, you reduce this risk by 39–59%.', source: 'SHRM, 2024 · Kristof-Brown et al., 2005' },
        { title: 'Happier employees', desc: 'Employees who fit the organisation are demonstrably happier, more motivated and more engaged. Win-win: lower costs for you, higher well-being for them.', source: 'VU Amsterdam, 2026 (N=309)' },
        { title: 'Higher productivity', desc: 'Engaged employees demonstrably perform better. Work engagement — a direct outcome of good P-O fit — predicts higher performance and less absenteeism.', source: 'Halbesleben & Wheeler, 2008' },
        { title: 'People stay longer', desc: 'Employees who fit the culture are less likely to leave. Organisations with high engagement have 59% less turnover. Case studies show reductions of 40–59%.', source: 'Kristof-Brown et al., 2005 · PRADCO · ASK/AssessCandidates' },
        { title: '39% less turnover with assessments', desc: 'Companies using pre-hire assessments (such as the Matching Scan) report on average 39% lower turnover than companies without.', source: 'Aberdeen Group' },
        { title: '4× more likely to stay', desc: 'Employees who rate their organisational culture positively are nearly 4× more likely to stay. With a poor culture, 57% actively look for a new job.', source: 'SHRM, 2024 (N=11,080, 15 countries)' },
        { title: 'Decide faster', desc: '81% of hiring managers doubt when making hires. The average time-to-hire is 68.5 days. The M-Score provides an objective data point so you can decide faster and with more confidence.', source: 'Resume Genius, 2024 · SHRM, 2025' },
        { title: 'Works worldwide', desc: 'P-O fit is universally predictive of work outcomes, confirmed in East Asia, Europe and North America. The principle holds regardless of country or culture.', source: 'Oh et al., 2014 (meta-analysis)' },
        { title: 'Less bias', desc: 'Traditional job interviews are susceptible to bias and first impressions. The Matching Scan is standardised and objective — the same measure for everyone.', source: 'Sackett et al., 2024' },
        { title: 'Stronger company culture', desc: 'When new employees fit better in terms of values, they strengthen the culture. This attracts better candidates in turn — a positive spiral that becomes clearly visible after 2–3 years.', source: 'SHRM, 2024' },
        { title: 'Less workload for HR', desc: 'Less turnover means fewer vacancies, less onboarding and fewer repeated selection processes. More stable teams and less "revolving door effect".', source: 'Refurzy Scientific Foundation' },
        { title: 'Stronger employer brand', desc: 'Better P-O fit leads to higher engagement scores, better Glassdoor reviews and stronger appeal for future candidates.', source: 'Refurzy Scientific Foundation' },
      ],
      wnukTitle: 'Internationally confirmed: P-O fit reduces turnover intention via meaning',
      wnukText: 'A recent study of 1,071 employees confirms that P-O fit is both directly and indirectly (via meaning in work) negatively associated with turnover intention. Employees who fit their organisation experience more meaning in their work and therefore leave less quickly.',
      wnukSource: 'Wnuk & Chudzicka-Czupala, 2026 (N=1,071)',
    },
    business: {
      title: 'The numbers: the business case',
      intro: 'The financial impact of Refurzy comes from two sources:',
      source1Title: 'Fewer mis-hires',
      source1Text: 'One wrong hire costs 50–200% of annual salary + employer costs (SHRM, 2024). Through scientifically proven matching based on Person-Organization fit, turnover drops by 39–59%. At an average salary of €60,000 that saves €30,000–€120,000 per avoided mis-hire.',
      source2Title: 'Lower recruitment costs',
      source2Text: 'Traditional agencies charge 15–27% of gross annual salary. Refurzy works with fixed, transparent rates per placement based on education level and experience — on average 60% cheaper. No cure, no pay: you only pay on a successful placement.',
      case1Title: 'Mid-size company',
      case1Sub: '100 employees · 13.5% turnover · average salary €5,000/month',
      case1Rows: [
        { label: 'Refurzy costs year 1', value: '€58,496' },
        { label: 'Net saving/year (39% reduction)', value: '€196,000' },
        { label: 'Net saving/year (59% reduction)', value: '€1,370,000' },
        { label: 'Cumulative over 5 years', value: '€793,000 – €5,489,000', bold: true },
      ],
      case2Title: 'Small company',
      case2Sub: '3 hires/year · no internal recruiter · average salary €5,000/month',
      case2Rows: [
        { label: 'Traditional agency (3 hires)', value: '€48,600/year', red: true },
        { label: 'Refurzy (3 hires)', value: '€12,999/year' },
        { label: 'Net saving/year', value: '€59,000 – €178,000' },
        { label: 'ROI', value: '455% – 1370%', bold: true },
        { label: 'Cumulative over 5 years', value: '€272,000 – €748,000', bold: true },
      ],
      disclaimer: 'Financial calculations prepared by Refurzy based on industry data (SHRM, BLS). Scientific validation by Vrije Universiteit Amsterdam relates to the Matching Scan and work outcomes, not the financial projections.',
    },
    limitations: {
      title: 'Honest about the limitations',
      sub: 'Transparency matters. The Matching Scan is a powerful tool, but not a crystal ball.',
      items: [
        { title: 'A strong indicator, not a guarantee', text: 'The scan predicts job happiness and retention very strongly, but other factors also play a role: salary, leadership quality, work-life balance. That is why you always combine the M-Score with your own conversations and assessment.' },
        { title: 'Based on honest answers', text: 'Candidates complete the scan themselves. The questions are designed so there are no "right" answers — it is about preference, not performance. This makes socially desirable answers unlikely.' },
        { title: 'One person fills in the organisation profile', text: 'Culture can vary by department. In large organisations it may be useful to create multiple profiles per team or department.' },
        { title: 'Researched in the Netherlands', text: 'The VU study was conducted with Dutch employees. International research shows that the principle works universally, but local validation is ongoing.' },
      ],
    },
    conclusion: {
      title: 'Conclusion',
      p1: 'Refurzy combines scientifically proven matching with experienced recruiters and AI technology. The result: better candidates, less risk, and on average 60% lower costs than a traditional agency.',
      p2: 'No cure, no pay. You only pay on a successful placement. With Fit Guarantee.',
      cta1: 'Get started today →',
      cta2: 'View pricing',
      validated: 'Scientifically validated by Vrije Universiteit Amsterdam (2026, N=309).',
    },
    references: {
      title: 'References',
      items: [
        'Aberdeen Group. Pre-hire assessments and turnover reduction benchmarks.',
        'Arthur, W., Jr., Bell, S. T., Villado, A. J., & Doverspike, D. (2006). The use of person-organization fit in employment decision making. Journal of Applied Psychology, 91(4), 786-801.',
        'Funder, D. C., & Ozer, D. J. (2019). Evaluating effect size in psychological research. Advances in Methods and Practices in Psychological Science, 2(2), 156-168.',
        'Halbesleben, J. R. B., & Wheeler, A. R. (2008). The relative roles of engagement and embeddedness in predicting job performance and intention to leave. Work & Stress, 22(3), 242-256.',
        'Kristof-Brown, A. L., Zimmerman, R. D., & Johnson, E. C. (2005). Consequences of individuals\' fit at work: A meta-analysis. Personnel Psychology, 58(2), 281-342.',
        'Leadership IQ. Why new hires fail: 46% failure rate within 18 months. Industry report.',
        'O\'Reilly, C. A., Chatman, J., & Caldwell, D. F. (2014). People and organizational culture. Academy of Management Journal, 34(3), 487-516.',
        'Oh, I.-S., Guay, R. P., Kim, K., Harold, C. M., Lee, J.-H., Heo, C.-G., & Shin, K.-H. (2014). Fit happens globally: A meta-analytic comparison of the relationships of person-environment fit dimensions with work attitudes and performance across East Asia, Europe, and North America. Personnel Psychology, 67(1), 99-152.',
        'PRADCO. Culture fit assessment case study: 40% turnover reduction.',
        'ASK/AssessCandidates. Pre-hire culture assessment case study: 59% turnover reduction.',
        'Resume Genius (2024). Hiring manager survey: 81% report ghosting candidates due to uncertainty.',
        'Sackett, P. R., et al. (2024). Revisiting meta-analytic estimates of validity in personnel selection. Journal of Applied Psychology.',
        'SHRM (2024). The Real Costs of Recruitment. N=11,080, 15 countries. Society for Human Resource Management.',
        'SHRM (2025). Average time-to-hire benchmark: 68.5 days.',
        'Vrije Universiteit Amsterdam (2026). Profiel Match Scan: empirical research on P-O fit and work outcomes. N=309.',
        'Wnuk, M. & Chudzicka-Czupała, A. (2026). P-O fit, meaning in work and turnover intention. N=1,071.',
      ],
    },
    backLink: '← Back to homepage',
  },
}

export default function WetenschapPage() {
  const [showWetenschapMisHire, setShowWetenschapMisHire] = useState(false)
  const [lang, setLangState] = useState<Lang>('nl')

  useEffect(() => {
    const saved = localStorage.getItem('refurzy_lang') as Lang
    if (saved === 'nl' || saved === 'en') setLangState(saved)
  }, [])

  function changeLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('refurzy_lang', l)
  }

  const t = texts[lang]

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-[Poppins]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-300 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <Link href="/homepage"><img src="/logo-dark.png" alt="Refurzy" className="h-7" /></Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-700 absolute left-1/2 -translate-x-1/2">
            <Link href="/homepage#hoe-het-werkt" className="hover:text-slate-900 transition-colors">{t.nav.howItWorks}</Link>
            <Link href="/homepage#pricing" className="hover:text-slate-900 transition-colors">{t.nav.pricing}</Link>
            <span className="text-cyan font-medium">{t.nav.science}</span>
            <Link href="/homepage#faq" className="hover:text-slate-900 transition-colors">{t.nav.faq}</Link>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle lang={lang} setLang={changeLang} variant="light" />
            <Link href="/login" className="btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              {t.nav.login}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block px-3 py-1 bg-cyan/10 border border-cyan/20 rounded-full text-cyan text-xs font-semibold mb-6 tracking-wider uppercase">
            {t.hero.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {t.hero.h1a}{' '}
            <span className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple bg-clip-text text-transparent">{t.hero.h1b}</span>
          </h1>
          <p className="text-lg text-slate-700 font-light max-w-2xl mx-auto leading-relaxed">
            {t.hero.sub}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-24">

        {/* Executive Summary */}
        <section className="mb-16">
          <div className="bg-purple/5 rounded-2xl border border-purple/20 p-8">
            <h2 className="text-xl font-bold mb-2 text-center">{t.summary.title}</h2>
            <p className="text-slate-700 text-sm text-center mb-6">{t.summary.sub}</p>
            <div className="space-y-4">
              {t.summary.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {item.text}
                    {i === 0 && <><sup>1</sup></>}
                    {i === 0 && <> {lang === 'nl' ? '' : ''}<sup>2</sup></>}
                    {i === 1 && <><sup>3</sup>{' '}<sup>4</sup></>}
                    {i === 1 && <><sup>2</sup></>}
                    {i === 4 && <><sup>1</sup></>}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 italic space-y-0.5">
              <p><sup>1</sup> {t.summary.fn1}</p>
              <p><sup>2</sup> {t.summary.fn2}</p>
              <p><sup>3</sup> {t.summary.fn3}</p>
              <p><sup>4</sup> {t.summary.fn4}</p>
              <p>* {t.summary.fn5}</p>
            </div>
          </div>
        </section>

        {/* Doorvertaling */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📌</span>
            <h2 className="text-2xl font-bold">{t.org.title}</h2>
          </div>
          <p className="text-slate-700 text-sm mb-6 ml-11">{t.org.sub}</p>

          <div className="space-y-3">
            {t.org.items.map((item, i) => (
              <div key={i} className="bg-white shadow-md border border-slate-300 rounded-xl p-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan font-bold text-xs">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-900 font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{item.desc}</p>
                  <p className="text-slate-700 text-[11px] mt-1.5 italic">{lang === 'nl' ? 'Bron' : 'Source'}: {item.source}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 ml-12">
            <button onClick={() => setShowWetenschapMisHire(!showWetenschapMisHire)} className="text-cyan text-xs hover:underline">
              {showWetenschapMisHire ? t.org.misHireToggleHide : t.org.misHireToggleShow}
            </button>
            {showWetenschapMisHire && (
              <div className="mt-2 bg-white shadow-md border border-slate-300 rounded-xl p-4 text-xs text-slate-700 space-y-1.5">
                <p className="text-slate-700 font-medium">{t.org.misHireTitle}</p>
                <ul className="list-disc list-inside space-y-1">
                  {t.org.misHireItems.map((item, i) => (
                    <li key={i}><strong className="text-slate-700">{item.label}</strong> — {item.desc}</li>
                  ))}
                </ul>
                <p className="text-yellow-600 text-[11px] mt-2">{t.org.misHireWarning}</p>
                <a href="https://www.shrm.org/topics-tools/news/talent-acquisition/real-costs-recruitment" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-cyan hover:underline">{t.org.misHireSource}</a>
              </div>
            )}
          </div>

          <div className="mt-6 bg-purple/5 rounded-xl border border-purple/20 p-5">
            <p className="text-slate-700 text-sm leading-relaxed text-center font-medium">
              {t.org.conclusion}
            </p>
          </div>
        </section>

        {/* Vergelijkingstabel */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">1</span>
            <h2 className="text-2xl font-bold">{t.comparison.title}</h2>
          </div>
          <div className="bg-white shadow-md border border-slate-300 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300">
                  {t.comparison.cols.map((col, i) => (
                    <th key={i} className={`text-left px-6 py-4 font-medium ${i === 2 ? 'text-center text-cyan font-semibold' : i === 1 ? 'text-center text-slate-700' : 'text-slate-700'}`}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className={i < t.comparison.rows.length - 1 ? 'border-b border-slate-300' : ''}>
                    <td className="px-6 py-3">{row.label}</td>
                    <td className="px-6 py-3 text-center text-red-600 whitespace-pre-line text-sm">{row.traditional.split('\n').map((line, j) => j === 0 ? line : <><br key={j}/><span className="text-[10px] text-slate-700">{line}</span></>)}</td>
                    <td className="px-6 py-3 text-center text-cyan whitespace-pre-line text-sm">{row.refurzy.split('\n').map((line, j) => j === 0 ? line : <><br key={j}/><span className="text-[10px] text-slate-700">{line}</span></>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Wat meet de scan */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">2</span>
            <h2 className="text-2xl font-bold">{t.scan.title}</h2>
          </div>
          <div className="bg-white shadow-md border border-slate-300 rounded-2xl p-8">
            <p className="text-slate-700 leading-relaxed mb-4">{t.scan.p1}</p>
            <p className="text-slate-700 leading-relaxed mb-6">{t.scan.p2}</p>
            <div className="bg-slate-100 rounded-xl border border-slate-300 p-5">
              <p className="text-sm text-slate-700 italic">{t.scan.sources}</p>
            </div>
          </div>
        </section>

        {/* 35 vragen */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">3</span>
            <h2 className="text-2xl font-bold">{t.questions.title}</h2>
          </div>
          <p className="text-slate-700 mb-6">{t.questions.sub}</p>
          <div className="space-y-4">
            {t.questions.items.map((dim, idx) => (
              <div key={idx} className="bg-white shadow-md border border-slate-300 rounded-2xl p-6">
                <h3 className={`font-semibold mb-2 ${dim.color === 'cyan' ? 'text-cyan' : dim.color === 'purple' ? 'text-purple' : dim.color === 'orange' ? 'text-orange' : 'text-slate-700'}`}>{dim.title}</h3>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed">{dim.desc}</p>
                <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                  <p><span className="text-slate-700 font-medium">{t.questions.resultLabel}</span> {dim.stats}</p>
                  {dim.regression && <p><span className="text-slate-700 font-medium">{t.questions.correctionLabel}</span> {dim.regression}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* M-Score */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">4</span>
            <h2 className="text-2xl font-bold">{t.mscore.title}</h2>
          </div>
          <div className="bg-purple/5 rounded-2xl border border-purple/20 p-8">
            <p className="text-slate-700 leading-relaxed mb-6">{t.mscore.p}</p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-100 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-cyan mb-1">{t.mscore.card1}</div>
                <p className="text-xs text-slate-700">{t.mscore.cardSub}</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple mb-1">{t.mscore.card2}</div>
                <p className="text-xs text-slate-700">{t.mscore.cardSub}</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-orange mb-1">{t.mscore.card3}</div>
                <p className="text-xs text-slate-700">{t.mscore.cardSub}</p>
              </div>
            </div>
            <div className="bg-slate-100 rounded-xl p-5">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900">{t.mscore.whatTitle}</strong> {t.mscore.whatText}
              </p>
              <p className="text-[10px] text-slate-700 mt-3 italic">{t.mscore.footnote}</p>
            </div>
          </div>
        </section>

        {/* Hoe werkt het in de praktijk */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">5</span>
            <h2 className="text-2xl font-bold">{t.practice.title}</h2>
          </div>
          <div className="bg-white shadow-md border border-slate-300 rounded-2xl p-8 mb-6">
            <h3 className="text-slate-900 font-semibold mb-4">{t.practice.stepsTitle}</h3>
            <div className="space-y-4">
              {t.practice.steps.map(step => (
                <div key={step.nr} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center text-cyan font-bold text-sm flex-shrink-0 mt-0.5">{step.nr}</div>
                  <div>
                    <p className="text-slate-900 font-medium text-sm">{step.title}</p>
                    <p className="text-slate-700 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white shadow-md border border-slate-300 rounded-2xl p-8">
            <h3 className="text-slate-900 font-semibold mb-4">{t.practice.diffTitle}</h3>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">{t.practice.diffText}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-cyan font-semibold text-sm mb-2">{t.practice.card1Title}</p>
                <p className="text-slate-700 text-xs leading-relaxed">{t.practice.card1Text}</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-cyan font-semibold text-sm mb-2">{t.practice.card2Title}</p>
                <p className="text-slate-700 text-xs leading-relaxed">{t.practice.card2Text}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Wat levert het op */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">6</span>
            <h2 className="text-2xl font-bold">{t.delivers.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {t.delivers.items.map((v, i) => (
              <div key={i} className="bg-white shadow-md border border-slate-300 rounded-2xl p-6">
                <h3 className="text-slate-900 font-semibold mb-2 text-sm">{v.title}</h3>
                <p className="text-slate-700 text-xs leading-relaxed mb-2">{v.desc}</p>
                <p className="text-xs text-slate-700 italic">{v.source}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white shadow-md border border-slate-300 rounded-2xl p-6">
            <h3 className="text-slate-900 font-semibold mb-2 text-sm">{t.delivers.wnukTitle}</h3>
            <p className="text-slate-700 text-xs leading-relaxed mb-2">{t.delivers.wnukText}</p>
            <p className="text-xs text-slate-700 italic">{t.delivers.wnukSource}</p>
          </div>
        </section>

        {/* Business case */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold">7</span>
            <h2 className="text-2xl font-bold">{t.business.title}</h2>
          </div>
          <div className="bg-white shadow-md border border-slate-300 rounded-2xl p-6 mb-6">
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              {t.business.intro}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-100 rounded-xl border border-cyan/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan text-lg">📉</span>
                  <h4 className="text-slate-900 font-semibold text-sm">{t.business.source1Title}</h4>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{t.business.source1Text}</p>
              </div>
              <div className="bg-slate-100 rounded-xl border border-cyan/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan text-lg">💰</span>
                  <h4 className="text-slate-900 font-semibold text-sm">{t.business.source2Title}</h4>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{t.business.source2Text}</p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md border border-slate-300 rounded-2xl p-8">
              <h3 className="text-slate-900 font-semibold mb-1">{t.business.case1Title}</h3>
              <p className="text-slate-700 text-xs mb-4">{t.business.case1Sub}</p>
              <div className="space-y-3 text-sm">
                {t.business.case1Rows.map((row, i) => (
                  <div key={i} className={`flex justify-between ${row.bold ? 'border-t border-slate-300 pt-3' : ''}`}>
                    <span className="text-slate-700">{row.label}</span>
                    <span className={row.bold ? 'text-slate-900 font-bold' : 'text-cyan font-semibold'}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white shadow-md border border-slate-300 rounded-2xl p-8">
              <h3 className="text-slate-900 font-semibold mb-1">{t.business.case2Title}</h3>
              <p className="text-slate-700 text-xs mb-4">{t.business.case2Sub}</p>
              <div className="space-y-3 text-sm">
                {t.business.case2Rows.map((row, i) => (
                  <div key={i} className={`flex justify-between ${row.bold ? 'border-t border-slate-300 pt-3' : ''}`}>
                    <span className="text-slate-700">{row.label}</span>
                    <span className={(row as any).red ? 'text-red-600 font-semibold' : row.bold ? 'text-slate-900 font-bold' : 'text-cyan font-semibold'}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-700 mt-4 italic text-center">{t.business.disclaimer}</p>
        </section>

        {/* Beperkingen */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange font-bold">8</span>
            <h2 className="text-2xl font-bold">{t.limitations.title}</h2>
          </div>
          <p className="text-slate-700 text-sm mb-4">{t.limitations.sub}</p>
          <div className="bg-white shadow-md border border-slate-300 rounded-2xl p-8">
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              {t.limitations.items.map((item, i) => (
                <div key={i}>
                  <p className="text-slate-900 font-medium mb-1">{item.title}</p>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conclusie */}
        <section className="mb-16">
          <div className="bg-purple/5 rounded-2xl border border-purple/20 p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">{t.conclusion.title}</h2>
            <p className="text-slate-700 leading-relaxed text-center max-w-3xl mx-auto mb-4">{t.conclusion.p1}</p>
            <p className="text-slate-700 leading-relaxed text-center max-w-3xl mx-auto mb-6">{t.conclusion.p2}</p>
            <div className="flex justify-center gap-4">
              <Link href="/demo/onboarding/opdrachtgever" className="btn-gradient text-white font-semibold px-8 py-4 rounded-[10px] text-base hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
                {t.conclusion.cta1}
              </Link>
              <Link href="/homepage#pricing" className="border border-purple/30 text-slate-700 font-semibold px-8 py-4 rounded-[10px] text-base hover:border-purple/50 hover:text-slate-900 transition-all">
                {t.conclusion.cta2}
              </Link>
            </div>
            <p className="text-[10px] text-slate-700 text-center italic mt-6">{t.conclusion.validated}</p>
          </div>
        </section>

        {/* Referenties */}
        <section>
          <h2 className="text-xl font-bold mb-4">{t.references.title}</h2>
          <div className="bg-white shadow-md border border-slate-300 rounded-2xl p-6">
            <div className="space-y-3">
              {t.references.items.map((ref, i) => (
                <p key={i} className="text-sm text-slate-700 leading-relaxed pl-4 border-l-2 border-slate-300">{ref}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Back link */}
        <div className="mt-16 text-center">
          <Link href="/homepage" className="text-slate-700 hover:text-slate-900 text-sm transition-colors">
            {t.backLink}
          </Link>
        </div>
      </div>
    </div>
  )
}
