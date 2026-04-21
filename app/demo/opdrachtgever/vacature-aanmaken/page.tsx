'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculatePrice, formatPrice, ExperienceLevel, EducationLevel, EXPERIENCE_LABELS, EDUCATION_LABELS, COUNTRIES } from '@/lib/pricing'
import {
  werkzaamheden,
  werkzaamhedenRatingScale,
  type ScaleOption,
} from '@/lib/matching-scan'
import type { TaalEis } from '@/lib/types'
import { VAKGEBIEDEN, LANDEN, TALEN, TAALNIVEAUS, TAALNIVEAU_LABELS } from '@/lib/constants'
import { useLang } from '@/lib/i18n'

// ─── Role-specific task templates (simulates AI web search for similar vacancies) ───

const ROLE_TASK_TEMPLATES: Record<string, string[]> = {
  'marketing manager': [
    'Ontwikkelen en uitvoeren van de marketingstrategie, zowel online als offline',
    'Aansturen van het marketingteam en externe bureaus (SEO, SEA, social media)',
    'Analyseren van campagneresultaten, conversiedata en ROI; bijsturen waar nodig',
    'Beheren van het marketingbudget en rapporteren aan het managementteam',
    'Positioneren van het merk in de markt en ontwikkelen van content- en communicatieplannen',
    'Samenwerken met Sales en Product om go-to-market strategieën te ontwikkelen',
  ],
  'software developer': [
    'Ontwerpen, bouwen en onderhouden van schaalbare webapplicaties en API\'s',
    'Schrijven van kwalitatief hoogwaardige, testbare code volgens best practices',
    'Deelnemen aan code reviews, sprint planningen en technische architectuurdiscussies',
    'Samenwerken met UX/UI designers om intuïtieve gebruikerservaringen te realiseren',
    'Troubleshooten van bugs en performance-issues in productieomgevingen',
    'Bijdragen aan de technische roadmap en continu verbeteren van de development workflow',
  ],
  'senior software developer': [
    'Leiden van technische architectuurbeslissingen en het ontwerpen van complexe systemen',
    'Mentoren en coachen van junior en medior developers binnen het team',
    'Bouwen van schaalbare microservices, API\'s en cloud-native applicaties',
    'Uitvoeren van code reviews en waarborgen van codekwaliteit en security standaarden',
    'Samenwerken met Product Owners om technische haalbaarheid en prioritering te bepalen',
    'Evalueren en introduceren van nieuwe technologieën en frameworks',
  ],
  'financial controller': [
    'Opstellen van maand-, kwartaal- en jaarrapportages conform IFRS/Dutch GAAP',
    'Bewaken van budgetten, forecasts en cashflowprognoses',
    'Analyseren van financiële afwijkingen en adviseren van het management over verbetermaatregelen',
    'Coördineren van de jaarlijkse accountantscontrole en contact met externe auditors',
    'Doorontwikkelen van financiële processen, systemen en interne controles',
    'Opstellen van business cases en financiële modellen voor strategische beslissingen',
  ],
  'sales manager': [
    'Ontwikkelen en uitvoeren van de salesstrategie om omzetdoelstellingen te realiseren',
    'Aansturen, coachen en motiveren van het salesteam',
    'Opbouwen en onderhouden van relaties met key accounts en strategische partners',
    'Analyseren van verkoopdata, pipeline en conversieratio\'s; vertalen naar acties',
    'Identificeren van nieuwe marktmogelijkheden en het ontwikkelen van proposities',
    'Rapporteren aan de directie over salesresultaten, forecasts en marktontwikkelingen',
  ],
  'hr manager': [
    'Ontwikkelen en implementeren van HR-beleid op het gebied van werving, ontwikkeling en retentie',
    'Adviseren van het managementteam over organisatieontwikkeling en verandermanagement',
    'Begeleiden van het recruitment- en onboardingproces voor nieuwe medewerkers',
    'Opzetten van beoordelings- en ontwikkelcycli en talent management programma\'s',
    'Waarborgen van naleving van arbeidsrechtelijke wet- en regelgeving',
    'Beheren van arbeidsvoorwaarden, verzuim en salarisadministratie',
  ],
  'project manager': [
    'Plannen, coördineren en bewaken van projecten van initiatie tot oplevering',
    'Managen van scope, budget, planning en risico\'s binnen het projectportfolio',
    'Aansturen van multidisciplinaire projectteams en externe leveranciers',
    'Opstellen van projectplannen, voortgangsrapportages en stuurgroeppresentaties',
    'Signaleren van risico\'s en bottlenecks en proactief escaleren waar nodig',
    'Implementeren van verbeteringen in projectmethodieken (Agile, Prince2, Waterfall)',
  ],
  'data analyst': [
    'Verzamelen, opschonen en analyseren van grote datasets uit diverse bronnen',
    'Bouwen van dashboards en rapportages in tools als Power BI, Tableau of Looker',
    'Vertalen van data-inzichten naar concrete aanbevelingen voor stakeholders',
    'Ontwikkelen van KPI-frameworks en monitoren van business performance',
    'Uitvoeren van ad-hoc analyses, A/B-testen en statistische modellen',
    'Samenwerken met IT en Data Engineering aan datainfrastructuur en datakwaliteit',
  ],
  'accountmanager': [
    'Beheren en uitbouwen van een eigen klantenportefeuille',
    'Signaleren van commerciële kansen en vertalen naar concrete proposities',
    'Onderhouden van langdurige klantrelaties en fungeren als eerste aanspreekpunt',
    'Opstellen van offertes, onderhandelen over voorwaarden en sluiten van deals',
    'Samenwerken met interne teams (operations, product, marketing) om klantbehoeften te realiseren',
    'Bijhouden van CRM, rapporteren op KPI\'s en bijdragen aan de teamtargets',
  ],
  'product manager': [
    'Definiëren van de productstrategie en roadmap op basis van markt- en gebruikersonderzoek',
    'Vertalen van klantbehoeften naar user stories, features en acceptatiecriteria',
    'Prioriteren van de product backlog in samenwerking met engineering en design',
    'Analyseren van productmetrics, gebruikersdata en concurrentie om kansen te identificeren',
    'Coördineren van go-to-market lanceringen met marketing, sales en customer success',
    'Faciliteren van stakeholder alignment en communiceren van productupdates aan de organisatie',
  ],
}

const ROLE_REQUIREMENT_TEMPLATES: Record<string, string[]> = {
  'marketing manager': [
    'Aantoonbare ervaring met digitale marketing (SEO, SEA, social media, email marketing)',
    'Data-gedreven mindset; ervaring met Google Analytics, HubSpot of vergelijkbare tools',
    'Sterke communicatieve vaardigheden in woord en geschrift (NL en EN)',
  ],
  'software developer': [
    'Ervaring met moderne frameworks (React, Next.js, Node.js of vergelijkbaar)',
    'Kennis van databases (SQL en/of NoSQL), REST API\'s en CI/CD pipelines',
    'Teamspeler met goede communicatieve vaardigheden en oog voor kwaliteit',
  ],
  'senior software developer': [
    'Diepgaande kennis van software architectuur, design patterns en cloud platforms (AWS/Azure/GCP)',
    'Ervaring met het aansturen van technische projecten en mentoren van teamleden',
    'Sterke analytische vaardigheden en vermogen om complexe problemen op te lossen',
  ],
  'financial controller': [
    'RC/RA opleiding (of gevorderde studie) is een pré',
    'Ervaring met ERP-systemen (SAP, Exact, NetSuite) en advanced Excel',
    'Nauwkeurig, analytisch en in staat om financiële data te vertalen naar managementinformatie',
  ],
  'sales manager': [
    'Bewezen track record in het behalen en overtreffen van omzetdoelstellingen',
    'Ervaring met CRM-systemen (Salesforce, HubSpot) en data-gedreven salesprocessen',
    'Coachende leiderschapsstijl en vermogen om een team te inspireren en ontwikkelen',
  ],
  'hr manager': [
    'Kennis van Nederlands arbeidsrecht en relevante wet- en regelgeving',
    'Ervaring met HRIS-systemen en HR-analytics',
    'Uitstekende gespreksvaardigheden en vermogen om vertrouwen op te bouwen',
  ],
  'project manager': [
    'Certificering in projectmanagement (Prince2, PMP, Scrum Master) is een pré',
    'Ervaring met projectmanagementtools (Jira, Asana, MS Project)',
    'Resultaatgericht, stressbestendig en in staat om meerdere projecten tegelijk te managen',
  ],
  'data analyst': [
    'Ervaring met SQL, Python of R en visualisatietools (Power BI, Tableau)',
    'Kennis van statistische methoden en data modelling',
    'Vermogen om complexe analyses helder te presenteren aan niet-technische stakeholders',
  ],
  'accountmanager': [
    'Commercieel inzicht en ervaring met consultative selling',
    'Ervaring met CRM-systemen en het beheren van een salesfunnel',
    'Resultaatgericht, proactief en in staat om zelfstandig relaties te onderhouden',
  ],
  'product manager': [
    'Ervaring met Agile/Scrum methodieken en backlog management',
    'Data-gedreven aanpak; ervaring met productanalytics (Amplitude, Mixpanel, GA)',
    'Uitstekend vermogen om technische en commerciële belangen te verbinden',
  ],
}

function getRoleSpecificTasks(title: string): string[] {
  const normalized = title.toLowerCase().trim()
  if (ROLE_TASK_TEMPLATES[normalized]) return ROLE_TASK_TEMPLATES[normalized]
  for (const [key, tasks] of Object.entries(ROLE_TASK_TEMPLATES)) {
    if (normalized.includes(key) || key.includes(normalized)) return tasks
  }
  return [
    `Verantwoordelijk voor het ontwikkelen en uitvoeren van de ${title.toLowerCase()} strategie`,
    `Samenwerken met interne teams en externe stakeholders om doelen te realiseren`,
    `Analyseren van resultaten, signaleren van trends en vertalen naar concrete verbeterplannen`,
    `Bijdragen aan innovatie en procesoptimalisatie binnen het team`,
    `Rapporteren over voortgang, KPI's en resultaten aan het managementteam`,
    `Opbouwen en onderhouden van relevante interne en externe relaties`,
  ]
}

function getRoleSpecificRequirements(title: string): string[] {
  const normalized = title.toLowerCase().trim()
  if (ROLE_REQUIREMENT_TEMPLATES[normalized]) return ROLE_REQUIREMENT_TEMPLATES[normalized]
  for (const [key, reqs] of Object.entries(ROLE_REQUIREMENT_TEMPLATES)) {
    if (normalized.includes(key) || key.includes(normalized)) return reqs
  }
  return [
    'Uitstekende communicatieve vaardigheden in woord en geschrift',
    'Proactieve houding, teamspeler en resultaatgericht',
    'Affiniteit met de sector en enthousiasme voor de rol',
  ]
}

type Step = 1 | 2 | 3 | 4 | 5 | 6
type WerkzaamhedenSubStep = 'ranking' | 'rating'

const texts = {
  nl: {
    backToDashboard: '← Terug naar dashboard',
    pageTitle: 'Vacature aanmaken',
    pageSubtitle: 'Doorloop de stappen om uw vacature te publiceren',
    steps: [
      { nr: 1, label: 'Functie', short: 'Titel' },
      { nr: 2, label: 'Details', short: 'Info' },
      { nr: 3, label: 'Harde criteria', short: 'Criteria' },
      { nr: 4, label: 'Omschrijving', short: 'Tekst' },
      { nr: 5, label: 'Controleer & publiceer', short: 'Publiceer' },
      { nr: 6, label: 'Werkzaamheden', short: 'M-Score' },
    ],
    // Step 1
    step1Title: 'Functietitel & afdeling',
    step1Subtitle: 'Geef de functie een duidelijke titel zodat Talent Scouts de juiste kandidaten kunnen vinden.',
    labelJobTitle: 'Functietitel *',
    placeholderJobTitle: 'bijv. Marketing Manager, Senior Developer, Sales Lead',
    labelDepartment: 'Afdeling / Team',
    placeholderDepartment: 'bijv. Marketing, Engineering, Sales',
    // Step 2
    step2Title: 'Vacature details',
    step2Subtitle: 'Praktische informatie over de functie en de werkomgeving.',
    labelLocation: 'Locatie *',
    placeholderLocation: 'bijv. Amsterdam',
    labelCountry: 'Land *',
    labelJobField: 'Functiegebied *',
    placeholderJobField: 'Selecteer een functiegebied...',
    labelSalary: 'Salarisindicatie (bruto per maand) *',
    placeholderSalaryMin: 'min. bijv. 4000',
    placeholderSalaryMax: 'max. bijv. 5500',
    labelContractType: 'Contracttype',
    contractOptions: ['Vast', 'Tijdelijk', 'Freelance / ZZP', 'Stage'],
    labelOfficePolicy: 'Op kantoor',
    officePolicyOptions: ['Op kantoor (5 dagen)', 'Hybride (3 dagen)', 'Hybride (2 dagen)', 'Volledig remote'],
    labelMaxCommute: 'Max reistijd',
    maxCommuteOptions: ['15 minuten', '30 minuten', '45 minuten', '60 minuten', 'Niet van toepassing'],
    labelStartDate: 'Gewenste startdatum',
    labelTasks: 'Taken & verantwoordelijkheden',
    tasksNote: 'Beschrijf de belangrijkste taken voor deze functie. Dit wordt door AI gebruikt om de vacaturetekst te genereren. Laat leeg om AI suggesties te krijgen op basis van de functietitel.',
    tasksPlaceholder: 'bijv.\n• Ontwikkelen en uitvoeren van de marketingstrategie\n• Aansturen van het marketingteam en externe bureaus\n• Analyseren van campagneresultaten en ROI',
    chars: 'tekens',
    optional: 'Optioneel',
    labelCulture: 'Afdelingscultuur & dynamiek *',
    cultureNote: 'Beschrijf hoe het team samenwerkt, de sfeer, het tempo en wat het uniek maakt. Dit wordt gedeeld met kandidaten en helpt bij de M-Score matching.',
    culturePlaceholder: 'bijv. Ons marketingteam van 8 personen werkt in een informele, energieke omgeving...',
    minChars: 'Min. 10 tekens',
    // Step 3
    step3Title: 'Harde criteria',
    step3Subtitle: 'Stel de minimale eisen in voor kandidaten op deze vacature.',
    labelEducation: 'Minimaal opleidingsniveau *',
    labelExperience: 'Minimale werkervaring *',
    labelLanguages: 'Vereiste talen',
    languagesNote: 'Voeg talen toe die de kandidaat minimaal moet beheersen.',
    selectLanguage: 'Selecteer taal...',
    addLanguage: 'Taal toevoegen',
    infoHighExp: 'Bij >10 jaar ervaring geldt voor HBO en WO hetzelfde tarief.',
    labelExclusivity: 'Exclusiviteit',
    exclusiveTitle: 'Exclusieve kandidaten',
    exclusiveSubtitle: 'Voorgedragen kandidaten zijn 14 dagen exclusief beschikbaar voor uw vacature en worden in die periode niet aan andere opdrachtgevers aangeboden voor vacatures in hetzelfde functiegebied. Sollicitaties in andere functiegebieden lopen gewoon door — een vacature in een heel ander functiegebied is immers geen concurrent voor uw positie. De exclusiviteitstoeslag van 25% wordt bij een succesvolle plaatsing toegevoegd aan de plaatsingsfee.',
    exclusiveMore: 'Meer kandidaten:',
    exclusiveMoreText: 'de hogere fee motiveert Talent Scouts extra om voor uw vacature aan de slag te gaan. Exclusieve vacatures ontvangen gemiddeld aanzienlijk meer voorgedragen kandidaten.',
    exclusiveWarning: 'Let op:',
    exclusiveWarningText: 'na publicatie kan exclusiviteit niet meer worden uitgeschakeld voor deze vacature.',
    priceLabel: 'Prijsindicatie (no cure, no pay)',
    exclVat: 'excl. BTW',
    exclusivity: 'exclusiviteit',
    scoutShare: 'Scout:',
    refurzyShare: 'Refurzy:',
    // Step 4
    step4Title: 'Functieomschrijving',
    step4Subtitle: 'Schrijf een aantrekkelijke vacaturetekst of laat AI een concept genereren op basis van de informatie die u eerder heeft ingevuld.',
    aiContextLabel: 'AI gebruikt deze context:',
    aiGenerateBtn: '✨ Genereer met AI',
    aiWriting: 'AI schrijft...',
    aiFillFirst: (fields: string) => `Vul eerst ${fields} in (stap 1-3)`,
    aiGeneratesFrom: 'Genereert een vacaturetekst op basis van alle ingevulde gegevens',
    descriptionPlaceholder: 'Beschrijf de functie, verantwoordelijkheden, het team en wat u biedt. Of gebruik de AI-knop hierboven om automatisch een concept te genereren op basis van de stappen die u al heeft doorlopen.',
    minChars20: 'Min. 20 tekens',
    ownTasksProvided: 'Eigen taken opgegeven',
    cultureDescribed: 'Cultuur beschreven',
    culture: 'Cultuur',
    functionTitle: 'Functietitel',
    locationLabel: 'Locatie',
    educationLabel: 'Opleiding',
    experienceLabel: 'Ervaring',
    // Step 5
    step5Title: 'Controleer & publiceer',
    step5Subtitle: 'Controleer uw vacature en publiceer deze. Talent Scouts kunnen daarna kandidaten voordragen.',
    vacancySummaryTitle: 'Samenvatting vacature',
    labelFunction: 'Functie:',
    labelDept: 'Afdeling:',
    labelLoc: 'Locatie:',
    labelLandLabel: 'Land:',
    labelJobFieldLabel: 'Functiegebied:',
    labelSalaryLabel: 'Salarisindicatie:',
    labelContract: 'Contract:',
    labelOffice: 'Op kantoor:',
    labelMaxCommuteLabel: 'Max reistijd:',
    labelEduc: 'Opleiding:',
    labelExp: 'Ervaring:',
    labelLanguagesLabel: 'Talen:',
    labelExclusivityLabel: 'Exclusiviteit:',
    labelFeeLabel: 'Plaatsingsfee:',
    notFilled: 'Niet ingevuld',
    vacancyTextLabel: 'Vacaturetekst:',
    cultureLabel: 'Afdelingscultuur:',
    howItWorksTitle: 'Hoe werkt het?',
    howItWorksText: 'Na publicatie kunnen Talent Scouts kandidaten voordragen. U ontvangt kandidaten met een anonieme M-Score. Wanneer u een profiel wilt bekijken, gaat u akkoord met de plaatsingsovereenkomst. U betaalt alleen bij een succesvolle plaatsing (no cure, no pay).',
    confirmCheckbox: 'Ik bevestig dat de bovenstaande gegevens correct zijn en wil deze vacature publiceren.',
    exclusiveYes: 'Ja (14 dagen, +25%)',
    exclusiveNo: 'Nee',
    // Step 6
    step6Title: (title: string) => `Werkzaamheden profiel — specifiek voor ${title || 'deze vacature'}`,
    step6Subtitle: 'Geef aan welke werkzaamheden het meest relevant zijn voor deze functie. Dit bepaalt de M-Score matching.',
    step6OrgNote: 'Uw organisatieprofiel (waarden & kenmerken) wordt automatisch gecombineerd.',
    orgProfileFilled: 'Organisatieprofiel: ✓ Ingevuld',
    orgProfileNotFilled: 'Niet ingevuld —',
    orgProfileLink: 'vul eerst uw organisatieprofiel in',
    subStepRanking: 'Rangorde',
    subStepRating: 'Beoordeling',
    rankingTitle: 'Rangschik de werkzaamheden',
    rankingDesc: 'Geef elke werkzaamheid een unieke rangorde van 1 (minst relevant voor de vacature) tot 19 (meest relevant). Elk nummer mag maar één keer gebruikt worden.',
    ratingTitle: 'Beoordeel elke werkzaamheid',
    ratingDesc: 'Geef aan in welke mate deze werkzaamheid relevant is voor de vacature.',
    inUse: '(in gebruik)',
    filledOf: (done: number, total: number) => `${done} van ${total} ingevuld`,
    ratedOf: (done: number, total: number) => `${done} van ${total} beoordeeld`,
    // Navigation
    previous: '← Vorige',
    next: 'Volgende →',
    backToRanking: '← Terug naar rangorde',
    publishVacancy: '✓ Publiceer vacature',
    // Published
    publishedTitle: 'Vacature gepubliceerd!',
    publishedDesc: (title: string) => `${title} staat nu open voor Talent Scouts.`,
    publishedNote: 'Je ontvangt een melding zodra de eerste kandidaten worden voorgedragen.',
    publishedMScore: 'M-Score profiel compleet — kandidaten worden automatisch gematcht.',
    labelModel: 'Model:',
    labelExcl: 'Exclusief:',
    labelFee: 'Fee:',
    backToDashboardBtn: 'Terug naar dashboard',
    exclusiveWithPct: 'Ja (+25%)',
    exclusiveNoBtn: 'Nee',
  },
  en: {
    backToDashboard: '← Back to dashboard',
    pageTitle: 'Create vacancy',
    pageSubtitle: 'Complete the steps to publish your vacancy',
    steps: [
      { nr: 1, label: 'Role', short: 'Title' },
      { nr: 2, label: 'Details', short: 'Info' },
      { nr: 3, label: 'Hard criteria', short: 'Criteria' },
      { nr: 4, label: 'Description', short: 'Text' },
      { nr: 5, label: 'Review & publish', short: 'Publish' },
      { nr: 6, label: 'Job activities', short: 'M-Score' },
    ],
    // Step 1
    step1Title: 'Job title & department',
    step1Subtitle: 'Give the role a clear title so Talent Scouts can find the right candidates.',
    labelJobTitle: 'Job title *',
    placeholderJobTitle: 'e.g. Marketing Manager, Senior Developer, Sales Lead',
    labelDepartment: 'Department / Team',
    placeholderDepartment: 'e.g. Marketing, Engineering, Sales',
    // Step 2
    step2Title: 'Vacancy details',
    step2Subtitle: 'Practical information about the role and work environment.',
    labelLocation: 'Location *',
    placeholderLocation: 'e.g. Amsterdam',
    labelCountry: 'Country *',
    labelJobField: 'Job field *',
    placeholderJobField: 'Select a job field...',
    labelSalary: 'Salary indication (gross per month) *',
    placeholderSalaryMin: 'min. e.g. 4000',
    placeholderSalaryMax: 'max. e.g. 5500',
    labelContractType: 'Contract type',
    contractOptions: ['Permanent', 'Temporary', 'Freelance / Self-employed', 'Internship'],
    labelOfficePolicy: 'Office policy',
    officePolicyOptions: ['On-site (5 days)', 'Hybrid (3 days)', 'Hybrid (2 days)', 'Fully remote'],
    labelMaxCommute: 'Max commute time',
    maxCommuteOptions: ['15 minutes', '30 minutes', '45 minutes', '60 minutes', 'Not applicable'],
    labelStartDate: 'Desired start date',
    labelTasks: 'Tasks & responsibilities',
    tasksNote: 'Describe the main tasks for this role. This is used by AI to generate the vacancy text. Leave blank to get AI suggestions based on the job title.',
    tasksPlaceholder: 'e.g.\n• Develop and execute the marketing strategy\n• Manage the marketing team and external agencies\n• Analyse campaign results and ROI',
    chars: 'characters',
    optional: 'Optional',
    labelCulture: 'Department culture & dynamics *',
    cultureNote: 'Describe how the team works together, the atmosphere, pace and what makes it unique. This is shared with candidates and helps with M-Score matching.',
    culturePlaceholder: 'e.g. Our marketing team of 8 works in an informal, energetic environment...',
    minChars: 'Min. 10 characters',
    // Step 3
    step3Title: 'Hard criteria',
    step3Subtitle: 'Set the minimum requirements for candidates on this vacancy.',
    labelEducation: 'Minimum education level *',
    labelExperience: 'Minimum work experience *',
    labelLanguages: 'Required languages',
    languagesNote: 'Add languages the candidate must have at minimum.',
    selectLanguage: 'Select language...',
    addLanguage: 'Add language',
    infoHighExp: 'For >10 years experience HBO and WO carry the same rate.',
    labelExclusivity: 'Exclusivity',
    exclusiveTitle: 'Exclusive candidates',
    exclusiveSubtitle: 'Nominated candidates are exclusively available for your vacancy for 14 days and will not be offered to other employers for vacancies in the same job field during that period. Applications in other job fields continue as normal — a vacancy in a completely different field is not a competitor for your position. The exclusivity surcharge of 25% is added to the placement fee on successful placement.',
    exclusiveMore: 'More candidates:',
    exclusiveMoreText: 'the higher fee gives Talent Scouts extra motivation to work for your vacancy. Exclusive vacancies receive significantly more nominated candidates on average.',
    exclusiveWarning: 'Note:',
    exclusiveWarningText: 'after publishing, exclusivity can no longer be disabled for this vacancy.',
    priceLabel: 'Price indication (no cure, no pay)',
    exclVat: 'excl. VAT',
    exclusivity: 'exclusivity',
    scoutShare: 'Scout:',
    refurzyShare: 'Refurzy:',
    // Step 4
    step4Title: 'Job description',
    step4Subtitle: 'Write an attractive vacancy text or let AI generate a draft based on the information you filled in earlier.',
    aiContextLabel: 'AI uses this context:',
    aiGenerateBtn: '✨ Generate with AI',
    aiWriting: 'AI writing...',
    aiFillFirst: (fields: string) => `First fill in ${fields} (steps 1–3)`,
    aiGeneratesFrom: 'Generates a vacancy text based on all filled-in information',
    descriptionPlaceholder: 'Describe the role, responsibilities, team and what you offer. Or use the AI button above to automatically generate a draft based on the steps you have already completed.',
    minChars20: 'Min. 20 characters',
    ownTasksProvided: 'Own tasks provided',
    cultureDescribed: 'Culture described',
    culture: 'Culture',
    functionTitle: 'Job title',
    locationLabel: 'Location',
    educationLabel: 'Education',
    experienceLabel: 'Experience',
    // Step 5
    step5Title: 'Review & publish',
    step5Subtitle: 'Review your vacancy and publish it. Talent Scouts can then nominate candidates.',
    vacancySummaryTitle: 'Vacancy summary',
    labelFunction: 'Role:',
    labelDept: 'Department:',
    labelLoc: 'Location:',
    labelLandLabel: 'Country:',
    labelJobFieldLabel: 'Job field:',
    labelSalaryLabel: 'Salary indication:',
    labelContract: 'Contract:',
    labelOffice: 'Office policy:',
    labelMaxCommuteLabel: 'Max commute:',
    labelEduc: 'Education:',
    labelExp: 'Experience:',
    labelLanguagesLabel: 'Languages:',
    labelExclusivityLabel: 'Exclusivity:',
    labelFeeLabel: 'Placement fee:',
    notFilled: 'Not filled in',
    vacancyTextLabel: 'Vacancy text:',
    cultureLabel: 'Department culture:',
    howItWorksTitle: 'How does it work?',
    howItWorksText: 'After publishing, Talent Scouts can nominate candidates. You receive candidates with an anonymous M-Score. When you want to view a profile, you agree to the placement agreement. You only pay on successful placement (no cure, no pay).',
    confirmCheckbox: 'I confirm that the above information is correct and want to publish this vacancy.',
    exclusiveYes: 'Yes (14 days, +25%)',
    exclusiveNo: 'No',
    // Step 6
    step6Title: (title: string) => `Job activities profile — specific to ${title || 'this vacancy'}`,
    step6Subtitle: 'Indicate which job activities are most relevant for this role. This determines M-Score matching.',
    step6OrgNote: 'Your organisation profile (values & characteristics) is automatically combined.',
    orgProfileFilled: 'Organisation profile: ✓ Completed',
    orgProfileNotFilled: 'Not completed —',
    orgProfileLink: 'first complete your organisation profile',
    subStepRanking: 'Ranking',
    subStepRating: 'Rating',
    rankingTitle: 'Rank the job activities',
    rankingDesc: 'Give each job activity a unique rank from 1 (least relevant for the vacancy) to 19 (most relevant). Each number may only be used once.',
    ratingTitle: 'Rate each job activity',
    ratingDesc: 'Indicate the extent to which this job activity is relevant for the vacancy.',
    inUse: '(in use)',
    filledOf: (done: number, total: number) => `${done} of ${total} filled in`,
    ratedOf: (done: number, total: number) => `${done} of ${total} rated`,
    // Navigation
    previous: '← Previous',
    next: 'Next →',
    backToRanking: '← Back to ranking',
    publishVacancy: '✓ Publish vacancy',
    // Published
    publishedTitle: 'Vacancy published!',
    publishedDesc: (title: string) => `${title} is now open for Talent Scouts.`,
    publishedNote: 'You will receive a notification when the first candidates are nominated.',
    publishedMScore: 'M-Score profile complete — candidates are automatically matched.',
    labelModel: 'Model:',
    labelExcl: 'Exclusivity:',
    labelFee: 'Fee:',
    backToDashboardBtn: 'Back to dashboard',
    exclusiveWithPct: 'Yes (+25%)',
    exclusiveNoBtn: 'No',
  },
}

export default function VacatureAanmakenPage() {
  const { lang } = useLang()
  const t = texts[lang]

  const STEPS = t.steps

  const [step, setStep] = useState<Step>(1)
  const [aiLoading, setAiLoading] = useState(false)
  const [akkoord, setAkkoord] = useState(false)
  const [published, setPublished] = useState(false)

  const [form, setForm] = useState({
    titel: '',
    afdeling: '',
    omschrijving: '',
    locatie: '',
    land: 'Nederland',
    vakgebied: '',
    salarisMin: '',
    salarisMax: '',
    taken: '',
    contractType: lang === 'en' ? 'Permanent' : 'Vast',
    opKantoor: lang === 'en' ? 'Hybrid (3 days)' : 'Hybride (3 dagen)',
    maxReistijd: lang === 'en' ? '45 minutes' : '45 minuten',
    startdatum: '',
    afdelingscultuur: '',
    opleiding: '' as EducationLevel | '',
    ervaring: '' as ExperienceLevel | '',
    exclusief: false,
  })
  const [taalEisen, setTaalEisen] = useState<TaalEis[]>([])

  // Werkzaamheden state (step 6)
  const [werkzaamhedenSubStep, setWerkzaamhedenSubStep] = useState<WerkzaamhedenSubStep>('ranking')
  const [werkzaamhedenRankings, setWerkzaamhedenRankings] = useState<Record<string, number>>({})
  const [werkzaamhedenRatings, setWerkzaamhedenRatings] = useState<Record<string, number>>({})

  // Mock: organisation profile status
  const orgProfileFilled = true

  const pricing = COUNTRIES.find(c => c.code === 'NL')!.pricing
  const basePrice = form.opleiding && form.ervaring
    ? calculatePrice(form.ervaring as ExperienceLevel, form.opleiding as EducationLevel, pricing)
    : 0
  const exclusiviteitToeslag = form.exclusief ? Math.round(basePrice * 0.25) : 0
  const price = basePrice + exclusiviteitToeslag

  const aiReady = form.titel.length > 0 && form.locatie.length > 0 && form.opleiding !== '' && form.ervaring !== ''
  const aiMissingFields = [
    ...(!form.titel ? [t.functionTitle.toLowerCase()] : []),
    ...(!form.locatie ? [t.locationLabel.toLowerCase()] : []),
    ...(!form.opleiding ? [t.educationLabel.toLowerCase()] : []),
    ...(!form.ervaring ? [t.experienceLabel.toLowerCase()] : []),
  ]

  const canProceed = () => {
    switch (step) {
      case 1: return form.titel.length > 0
      case 2: return form.locatie.length > 0 && form.vakgebied.length > 0 && form.afdelingscultuur.length > 10 && form.maxReistijd !== ''
      case 3: return form.opleiding !== '' && form.ervaring !== ''
      case 4: return form.omschrijving.length > 20
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
    if (!aiReady) return
    setAiLoading(true)
    setTimeout(() => {
      const titel = form.titel
      const afdeling = form.afdeling || 'het team'
      const locatie = form.locatie
      const salarisLabel = form.salarisMin && form.salarisMax
        ? `€${form.salarisMin} - €${form.salarisMax} bruto per maand`
        : 'marktconform salaris'
      const contract = form.contractType
      const kantoor = form.opKantoor
      const ervaring = EXPERIENCE_LABELS[form.ervaring as ExperienceLevel] || ''
      const opleiding = form.opleiding
      const cultuur = form.afdelingscultuur

      const userTaken = form.taken.trim()
      const takenList = userTaken
        ? userTaken.split('\n').map(t => t.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
        : getRoleSpecificTasks(titel)

      let omschrijving = `Ben jij een ervaren ${titel} en zoek je een nieuwe uitdaging in ${locatie}? Wij zoeken een gedreven professional voor ${afdeling}.`
      omschrijving += `\n\n`
      if (cultuur) {
        omschrijving += `Over het team\n${cultuur}\n\n`
      }
      omschrijving += `Wat ga je doen?\n`
      omschrijving += takenList.map(t => `• ${t}`).join('\n')
      omschrijving += `\n\nWat vragen wij?\n`
      omschrijving += `• Minimaal ${ervaring.toLowerCase()} relevante werkervaring\n`
      omschrijving += `• ${opleiding} werk- en denkniveau\n`
      omschrijving += getRoleSpecificRequirements(titel).map(r => `• ${r}`).join('\n')
      omschrijving += `\n\nWat bieden wij?\n`
      omschrijving += `• Salaris: ${salarisLabel}\n`
      omschrijving += `• ${contract} contract\n`
      omschrijving += `• ${kantoor}\n`
      omschrijving += `• Locatie: ${locatie}\n`
      omschrijving += `• 25 vakantiedagen + persoonlijk ontwikkelingsbudget\n`
      omschrijving += `• Pensioenregeling en reiskostenvergoeding`

      setForm(f => ({ ...f, omschrijving }))
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
          <h2 className="text-2xl font-bold text-ink mb-3">{t.publishedTitle}</h2>
          <p className="text-ink-light mb-2"><span className="text-ink font-semibold">{form.titel}</span> {t.publishedDesc('').replace(form.titel, '').trim()}</p>
          <p className="text-ink-muted text-sm mb-4">{t.publishedNote}</p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-6 text-sm text-green-400 font-medium">
            {t.publishedMScore}
          </div>
          <div className="bg-white rounded-2xl border border-surface-border p-4 mb-8 text-left">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-ink-muted">{t.labelModel}</span> <span className="text-green-400">No Cure No Pay</span></div>
              <div><span className="text-ink-muted">{t.labelLoc}</span> <span className="text-ink">{form.locatie}</span></div>
              <div><span className="text-ink-muted">{t.labelEduc}</span> <span className="text-ink">{form.opleiding}</span></div>
              <div><span className="text-ink-muted">{t.labelExp}</span> <span className="text-ink">{EXPERIENCE_LABELS[form.ervaring as ExperienceLevel]}</span></div>
              <div><span className="text-ink-muted">{t.labelExcl}</span> <span className={form.exclusief ? 'text-purple font-medium' : 'text-ink'}>{form.exclusief ? t.exclusiveWithPct : t.exclusiveNoBtn}</span></div>
              <div><span className="text-ink-muted">{t.labelFee}</span> <span className="text-ink font-medium">{formatPrice(price, pricing)}</span></div>
            </div>
          </div>
          <Link href="/demo/opdrachtgever" className="btn-gradient text-white font-semibold px-6 py-3 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            {t.backToDashboardBtn}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">{t.backToDashboard}</Link>
        <h1 className="text-2xl font-bold text-ink mt-3">{t.pageTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.pageSubtitle}</p>
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

        {/* ═══ STEP 1 ═══ */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">{t.step1Title}</h2>
            <p className="text-ink-light text-sm font-medium mb-8">{t.step1Subtitle}</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelJobTitle}</label>
                <input type="text" value={form.titel} onChange={e => setForm(f => ({ ...f, titel: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder={t.placeholderJobTitle} />
              </div>
              <div>
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelDepartment}</label>
                <input type="text" value={form.afdeling} onChange={e => setForm(f => ({ ...f, afdeling: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder={t.placeholderDepartment} />
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 ═══ */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">{t.step2Title}</h2>
            <p className="text-ink-light text-sm font-medium mb-8">{t.step2Subtitle}</p>
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelLocation}</label>
                <input type="text" value={form.locatie} onChange={e => setForm(f => ({ ...f, locatie: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                  placeholder={t.placeholderLocation} />
              </div>
              <div>
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelCountry}</label>
                <select value={form.land} onChange={e => setForm(f => ({ ...f, land: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  {LANDEN.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelJobField}</label>
                <select value={form.vakgebied} onChange={e => setForm(f => ({ ...f, vakgebied: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  <option value="">{t.placeholderJobField}</option>
                  {VAKGEBIEDEN.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelSalary}</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted text-sm">€</span>
                    <input type="number" value={form.salarisMin} onChange={e => setForm(f => ({ ...f, salarisMin: e.target.value }))}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg pl-8 pr-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                      placeholder={t.placeholderSalaryMin} />
                  </div>
                  <span className="text-ink-muted text-sm">–</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted text-sm">€</span>
                    <input type="number" value={form.salarisMax} onChange={e => setForm(f => ({ ...f, salarisMax: e.target.value }))}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg pl-8 pr-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors"
                      placeholder={t.placeholderSalaryMax} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelContractType}</label>
                <select value={form.contractType} onChange={e => setForm(f => ({ ...f, contractType: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  {t.contractOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelOfficePolicy}</label>
                <select value={form.opKantoor} onChange={e => setForm(f => ({ ...f, opKantoor: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  {t.officePolicyOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelMaxCommute}</label>
                <select value={form.maxReistijd} onChange={e => setForm(f => ({ ...f, maxReistijd: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors">
                  {t.maxCommuteOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink font-medium mb-1.5">{t.labelStartDate}</label>
                <input type="date" value={form.startdatum} onChange={e => setForm(f => ({ ...f, startdatum: e.target.value }))}
                  className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink focus:outline-none focus:border-cyan transition-colors" />
              </div>
            </div>

            {/* Taken */}
            <div className="border-t border-surface-border pt-6">
              <label className="block text-sm text-ink font-medium mb-1.5">{t.labelTasks}</label>
              <p className="text-xs text-ink-muted mb-3">{t.tasksNote}</p>
              <textarea value={form.taken} onChange={e => setForm(f => ({ ...f, taken: e.target.value }))} rows={4}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
                placeholder={t.tasksPlaceholder} />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-ink-muted">{form.taken.length} {t.chars}</span>
                <span className="text-xs text-ink-muted">{t.optional}</span>
              </div>
            </div>

            {/* Afdelingscultuur */}
            <div className="border-t border-surface-border pt-6">
              <label className="block text-sm text-ink font-medium mb-1.5">{t.labelCulture}</label>
              <p className="text-xs text-ink-muted mb-3">{t.cultureNote}</p>
              <textarea value={form.afdelingscultuur} onChange={e => setForm(f => ({ ...f, afdelingscultuur: e.target.value }))} rows={4}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
                placeholder={t.culturePlaceholder} />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-ink-muted">{form.afdelingscultuur.length} {t.chars}</span>
                <span className="text-xs text-ink-muted">{t.minChars}</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3 ═══ */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">{t.step3Title}</h2>
            <p className="text-ink-light text-sm font-medium mb-8">{t.step3Subtitle}</p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm text-ink-light mb-3">{t.labelEducation}</label>
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
                <label className="block text-sm text-ink-light mb-3">{t.labelExperience}</label>
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

            {/* Talen */}
            <div className="mt-8 pt-6 border-t border-surface-border">
              <label className="block text-sm text-ink-light mb-1">{t.labelLanguages}</label>
              <p className="text-xs text-ink-muted mb-3">{t.languagesNote}</p>

              {taalEisen.map((eis, idx) => (
                <div key={idx} className="flex items-center gap-3 mb-2">
                  <select value={eis.taal}
                    onChange={e => {
                      const updated = [...taalEisen]
                      updated[idx] = { ...updated[idx], taal: e.target.value }
                      setTaalEisen(updated)
                    }}
                    className="flex-1 bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-cyan transition-colors">
                    <option value="">{t.selectLanguage}</option>
                    {TALEN.filter(tl => tl === eis.taal || !taalEisen.some(e => e.taal === tl)).map(tl => (
                      <option key={tl} value={tl}>{tl}</option>
                    ))}
                  </select>
                  <select value={eis.minimaalNiveau}
                    onChange={e => {
                      const updated = [...taalEisen]
                      updated[idx] = { ...updated[idx], minimaalNiveau: e.target.value as TaalEis['minimaalNiveau'] }
                      setTaalEisen(updated)
                    }}
                    className="w-48 bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-cyan transition-colors">
                    {TAALNIVEAUS.map(n => (
                      <option key={n} value={n}>{n} — {TAALNIVEAU_LABELS[n]}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setTaalEisen(prev => prev.filter((_, i) => i !== idx))}
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={lang === 'en' ? 'Remove' : 'Verwijderen'}>
                    ✕
                  </button>
                </div>
              ))}

              <button type="button"
                onClick={() => setTaalEisen(prev => [...prev, { taal: '', minimaalNiveau: 'B2' }])}
                className="mt-2 flex items-center gap-2 text-sm text-cyan hover:text-cyan/80 font-medium transition-colors">
                <span className="w-5 h-5 rounded-full border-2 border-cyan/40 flex items-center justify-center text-xs">+</span>
                {t.addLanguage}
              </button>
            </div>

            {form.opleiding && form.ervaring && form.opleiding !== 'MBO' && form.ervaring === '10+' && (
              <div className="mt-4 bg-cyan/5 border border-cyan/20 rounded-xl p-3">
                <p className="text-xs text-cyan">&#8505;&#65039; {t.infoHighExp}</p>
              </div>
            )}

            {/* Exclusiviteit */}
            <div className="mt-8 pt-6 border-t border-surface-border">
              <label className="block text-sm text-ink-light mb-3">{t.labelExclusivity}</label>
              <div
                onClick={() => { if (!form.exclusief) setForm(f => ({ ...f, exclusief: true })) }}
                className={`rounded-xl border-2 p-5 transition-all ${
                  form.exclusief ? 'bg-purple/5 border-purple/30' : 'bg-surface-muted border-surface-border hover:border-purple/30 cursor-pointer'
                }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    form.exclusief ? 'bg-purple border-purple text-white' : 'border-surface-border'
                  }`}>
                    {form.exclusief && <span className="text-xs font-bold">&#10003;</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-semibold text-sm">{t.exclusiveTitle}</span>
                      <span className="px-2 py-0.5 bg-purple/10 text-purple text-[10px] font-bold rounded-full uppercase tracking-wider">+25%</span>
                    </div>
                    <p className="text-xs text-ink-light mt-1.5 leading-relaxed">{t.exclusiveSubtitle}</p>
                    <div className="mt-3 bg-cyan/10 border border-cyan/20 rounded-lg p-2.5 flex items-start gap-2">
                      <span className="text-cyan-700 text-xs">🚀</span>
                      <p className="text-xs text-cyan-700">
                        <strong>{t.exclusiveMore}</strong> {t.exclusiveMoreText}
                      </p>
                    </div>
                    {form.exclusief && (
                      <div className="mt-3 bg-orange/10 border border-orange/20 rounded-lg p-2.5 flex items-start gap-2">
                        <span className="text-orange-700 text-xs">&#9888;&#65039;</span>
                        <p className="text-xs text-orange-700">
                          <strong>{t.exclusiveWarning}</strong> {t.exclusiveWarningText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Live price */}
              {form.opleiding && form.ervaring && (
                <div className="mt-4 bg-white rounded-xl border border-surface-border p-4">
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">{t.priceLabel}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-ink">{formatPrice(price, pricing)}</span>
                        <span className="text-xs text-ink-muted">{t.exclVat}</span>
                      </div>
                      {form.exclusief && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-ink-muted line-through">{formatPrice(basePrice, pricing)}</span>
                          <span className="text-xs text-purple font-medium">+ {formatPrice(exclusiviteitToeslag, pricing)} {t.exclusivity}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-ink-muted">
                      <p>{t.scoutShare} {formatPrice(Math.round(price / 2), pricing)}</p>
                      <p>{t.refurzyShare} {formatPrice(Math.round(price / 2), pricing)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ STEP 4 ═══ */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">{t.step4Title}</h2>
            <p className="text-ink-light text-sm mb-6">{t.step4Subtitle}</p>

            {/* AI context summary */}
            <div className="bg-surface-muted rounded-xl border border-surface-border p-4 mb-4">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">{t.aiContextLabel}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className={form.titel ? 'text-green-500' : 'text-ink-muted'}>{form.titel ? '✓' : '○'}</span>
                  <span className={form.titel ? 'text-ink' : 'text-ink-muted'}>{form.titel || t.functionTitle}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={form.locatie ? 'text-green-500' : 'text-ink-muted'}>{form.locatie ? '✓' : '○'}</span>
                  <span className={form.locatie ? 'text-ink' : 'text-ink-muted'}>{form.locatie || t.locationLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={form.opleiding ? 'text-green-500' : 'text-ink-muted'}>{form.opleiding ? '✓' : '○'}</span>
                  <span className={form.opleiding ? 'text-ink' : 'text-ink-muted'}>{form.opleiding || t.educationLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={form.ervaring ? 'text-green-500' : 'text-ink-muted'}>{form.ervaring ? '✓' : '○'}</span>
                  <span className={form.ervaring ? 'text-ink' : 'text-ink-muted'}>
                    {form.ervaring ? EXPERIENCE_LABELS[form.ervaring as ExperienceLevel] : t.experienceLabel}
                  </span>
                </div>
                {form.afdeling && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span>
                    <span className="text-ink">{form.afdeling}</span>
                  </div>
                )}
                {(form.salarisMin || form.salarisMax) && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span>
                    <span className="text-ink">{form.salarisMin && form.salarisMax ? `€${form.salarisMin} - €${form.salarisMax} /maand` : 'Salaris deels ingevuld'}</span>
                  </div>
                )}
                {form.taken && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span>
                    <span className="text-ink">{t.ownTasksProvided}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span className="text-ink">{form.contractType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={form.afdelingscultuur ? 'text-green-500' : 'text-ink-muted'}>
                    {form.afdelingscultuur ? '✓' : '○'}
                  </span>
                  <span className={form.afdelingscultuur ? 'text-ink' : 'text-ink-muted'}>
                    {form.afdelingscultuur ? t.cultureDescribed : t.culture}
                  </span>
                </div>
              </div>
            </div>

            {/* AI generate button */}
            <div className="flex items-center gap-3 mb-4">
              <button onClick={handleAiGenerate} disabled={aiLoading || !aiReady}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  aiLoading ? 'bg-purple/20 text-purple cursor-wait'
                  : aiReady ? 'btn-gradient text-white hover:-translate-y-px'
                  : 'bg-surface-muted border border-surface-border text-ink-muted cursor-not-allowed'
                }`}>
                {aiLoading ? <><span className="animate-spin">&#10227;</span> {t.aiWriting}</> : <>{t.aiGenerateBtn}</>}
              </button>
              {!aiReady && (
                <span className="text-xs text-ink-muted">
                  {t.aiFillFirst(aiMissingFields.join(', '))}
                </span>
              )}
              {aiReady && !aiLoading && (
                <span className="text-xs text-ink-muted">{t.aiGeneratesFrom}</span>
              )}
            </div>

            <textarea value={form.omschrijving} onChange={e => setForm(f => ({ ...f, omschrijving: e.target.value }))} rows={16}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-cyan transition-colors resize-none text-sm leading-relaxed"
              placeholder={t.descriptionPlaceholder} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-ink-muted">{form.omschrijving.length} {t.chars}</span>
              <span className="text-xs text-ink-muted">{t.minChars20}</span>
            </div>
          </div>
        )}

        {/* ═══ STEP 5 ═══ */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">{t.step5Title}</h2>
            <p className="text-ink-light text-sm font-medium mb-8">{t.step5Subtitle}</p>

            <div className="bg-surface-muted rounded-2xl border border-surface-border p-6 mb-6">
              <h3 className="text-ink font-semibold mb-4">{t.vacancySummaryTitle}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-ink-muted">{t.labelFunction}</span> <span className="text-ink font-medium">{form.titel}</span></div>
                <div><span className="text-ink-muted">{t.labelDept}</span> <span className="text-ink">{form.afdeling || '—'}</span></div>
                <div><span className="text-ink-muted">{t.labelLoc}</span> <span className="text-ink">{form.locatie}</span></div>
                <div><span className="text-ink-muted">{t.labelLandLabel}</span> <span className="text-ink">{form.land}</span></div>
                <div><span className="text-ink-muted">{t.labelJobFieldLabel}</span> <span className="text-cyan font-medium">{form.vakgebied}</span></div>
                <div><span className="text-ink-muted">{t.labelSalaryLabel}</span> <span className="text-ink">{form.salarisMin && form.salarisMax ? `€${form.salarisMin} - €${form.salarisMax} /maand` : t.notFilled}</span></div>
                <div><span className="text-ink-muted">{t.labelContract}</span> <span className="text-ink">{form.contractType}</span></div>
                <div><span className="text-ink-muted">{t.labelOffice}</span> <span className="text-ink">{form.opKantoor}</span></div>
                <div><span className="text-ink-muted">{t.labelMaxCommuteLabel}</span> <span className="text-ink">{form.maxReistijd}</span></div>
                <div><span className="text-ink-muted">{t.labelEduc}</span> <span className="text-cyan font-medium">{form.opleiding}</span></div>
                <div><span className="text-ink-muted">{t.labelExp}</span> <span className="text-cyan font-medium">{EXPERIENCE_LABELS[form.ervaring as ExperienceLevel]}</span></div>
                {taalEisen.length > 0 && (
                  <div><span className="text-ink-muted">{t.labelLanguagesLabel}</span> <span className="text-ink">{taalEisen.filter(e => e.taal).map(e => `${e.taal} (${e.minimaalNiveau})`).join(', ')}</span></div>
                )}
                <div><span className="text-ink-muted">{t.labelExclusivityLabel}</span> <span className={form.exclusief ? 'text-purple font-medium' : 'text-ink'}>{form.exclusief ? t.exclusiveYes : t.exclusiveNo}</span></div>
                <div><span className="text-ink-muted">{t.labelFeeLabel}</span> <span className="text-ink font-medium">{formatPrice(price, pricing)} <span className="text-ink-muted font-normal">{t.exclVat}</span></span></div>
              </div>
              {form.omschrijving && (
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <span className="text-ink-muted text-sm">{t.vacancyTextLabel}</span>
                  <p className="text-ink-light text-sm mt-1 leading-relaxed whitespace-pre-line line-clamp-6">{form.omschrijving}</p>
                </div>
              )}
              {form.afdelingscultuur && (
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <span className="text-ink-muted text-sm">{t.cultureLabel}</span>
                  <p className="text-ink-light text-sm mt-1 leading-relaxed">{form.afdelingscultuur}</p>
                </div>
              )}
            </div>

            <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-lg">&#128161;</span>
              <div className="text-sm text-ink-light">
                <p><strong className="text-ink">{t.howItWorksTitle}</strong></p>
                <p className="mt-1">{t.howItWorksText}</p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={akkoord} onChange={e => setAkkoord(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-surface-muted accent-cyan" />
              <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
                {t.confirmCheckbox}
              </span>
            </label>
          </div>
        )}

        {/* ═══ STEP 6 ═══ */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">
              {t.step6Title(form.titel)}
            </h2>
            <p className="text-ink-light text-sm mb-2">{t.step6Subtitle}</p>
            <p className="text-xs text-ink-muted mb-4">{t.step6OrgNote}</p>

            {/* Org profile status banner */}
            {orgProfileFilled ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
                <span className="text-green-400">&#8505;&#65039;</span>
                <span className="text-green-400 text-sm font-medium">{t.orgProfileFilled}</span>
              </div>
            ) : (
              <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-6 flex items-center gap-2">
                <span className="text-orange">&#9888;&#65039;</span>
                <span className="text-orange text-sm">
                  {t.orgProfileNotFilled}{' '}
                  <Link href="/demo/opdrachtgever/matching-profiel" className="underline font-medium hover:text-orange/80">
                    {t.orgProfileLink}
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
                {t.subStepRanking}
              </div>
              <div className="w-6 h-px bg-purple/10" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                werkzaamhedenSubStep === 'rating' ? 'bg-cyan/15 text-cyan border border-cyan/20' : 'bg-surface-muted border border-surface-border text-ink-muted'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  werkzaamhedenSubStep === 'rating' ? 'bg-cyan text-navy-dark' : 'bg-purple/15 text-ink-muted'
                }`}>b</span>
                {t.subStepRating}
              </div>
            </div>

            {werkzaamhedenSubStep === 'ranking' && (
              <WerkzaamhedenRankingStep
                rankings={werkzaamhedenRankings}
                onChange={(id, v) => setWerkzaamhedenRankings(prev => ({ ...prev, [id]: v }))}
                t={t}
              />
            )}

            {werkzaamhedenSubStep === 'rating' && (
              <WerkzaamhedenRatingStep
                ratings={werkzaamhedenRatings}
                onChange={(id, v) => setWerkzaamhedenRatings(prev => ({ ...prev, [id]: v }))}
                t={t}
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface-border">
          {step === 6 ? (
            <button onClick={handleStep6Back}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-surface-muted border border-surface-border text-ink-light hover:text-ink">
              {werkzaamhedenSubStep === 'rating' ? t.backToRanking : t.previous}
            </button>
          ) : (
            <button onClick={() => setStep((step - 1) as Step)} disabled={step === 1}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                step === 1 ? 'text-ink-muted cursor-not-allowed' : 'bg-surface-muted border border-surface-border text-ink-light hover:text-ink'
              }`}>{t.previous}</button>
          )}

          {step < 6 ? (
            <button onClick={() => setStep((step + 1) as Step)} disabled={!canProceed()}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed() ? 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]' : 'bg-gray-700 text-ink-muted cursor-not-allowed'
              }`}>{t.next}</button>
          ) : (
            <button onClick={handleStep6Next} disabled={!canProceed()}
              className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed()
                  ? werkzaamhedenSubStep === 'rating'
                    ? 'bg-green-500 text-white hover:bg-green-400 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)]'
                    : 'btn-gradient text-white hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)]'
                  : 'bg-gray-700 text-ink-muted cursor-not-allowed'
              }`}>
              {werkzaamhedenSubStep === 'rating' ? t.publishVacancy : t.next}
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
  t,
}: {
  rankings: Record<string, number>
  onChange: (id: string, value: number) => void
  t: typeof texts['nl']
}) {
  const usedValues = new Set(Object.values(rankings))
  const options = Array.from({ length: 19 }, (_, i) => i + 1)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-ink">{t.rankingTitle}</h3>
        <p className="text-ink-light text-sm mt-1">{t.rankingDesc}</p>
      </div>

      <div className="space-y-3">
        {werkzaamheden.map((item) => {
          const currentVal = rankings[item.id]
          return (
            <div key={item.id} className="flex items-start gap-4 border-b border-surface-border pb-3 last:border-0 last:pb-0">
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
                      {n}{taken ? ` ${t.inUse}` : ''}
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

      <p className="text-xs text-ink-muted">{t.filledOf(Object.keys(rankings).length, 19)}</p>
    </div>
  )
}

// ─── Werkzaamheden Rating Sub-step ──────────────────────────────────────────

function WerkzaamhedenRatingStep({
  ratings,
  onChange,
  t,
}: {
  ratings: Record<string, number>
  onChange: (id: string, value: number) => void
  t: typeof texts['nl']
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-ink">{t.ratingTitle}</h3>
        <p className="text-ink-light text-sm mt-1">{t.ratingDesc}</p>
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
            <div key={item.id} className="border-b border-surface-border pb-4 last:border-0 last:pb-0 space-y-2">
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

      <p className="text-xs text-ink-muted">{t.ratedOf(Object.keys(ratings).length, 19)}</p>
    </div>
  )
}
