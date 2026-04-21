'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { vacatures, pipelineSteps, afwijzingsRedenen, calculateFee } from '@/lib/mock-data'
import { ProcesStatus, AfwijzingsReden, Gesprek } from '@/lib/types'
import FitScore from '@/components/FitScore'
import HardeCriteriaDetail from '@/components/HardeCriteriaDetail'
import PipelineTracker from '@/components/PipelineTracker'
import { calculateHardeCriteriaMatch } from '@/lib/matching'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    backToDashboard: '← Terug naar dashboard',
    notFound: 'Kandidaat niet gevonden.',
    reject: 'Afwijzen',
    progressTitle: 'Voortgang',
    mScore: 'M-Score',
    culturalMatch: 'Culturele match',
    hardeCriteria: 'Harde Criteria',
    scoutExplanationTitle: (name: string) => `Toelichting van ${name}`,
    talentScout: 'Talent Scout',
    hardeCriteriaMatchTitle: (pct: number) => `Harde Criteria Match — ${pct}%`,
    criteriaDeviation: (n: number) => `⚠ ${n} ${n === 1 ? 'criterium wijkt af' : 'criteria wijken af'} — overweeg of dit acceptabel is voor deze rol.`,
    cvTitle: 'Curriculum Vitae',
    cvProfile: 'Profiel',
    cvWorkExperience: 'Werkervaring',
    cvEducation: 'Opleiding',
    cvSkills: 'Vaardigheden',
    cvLanguages: 'Talen',
    cvCertifications: 'Certificeringen',
    contactTitle: 'Contactgegevens',
    contactEmail: 'Email',
    contactPhone: 'Telefoon',
    contactCity: 'Woonplaats',
    contactScout: 'Scout',
    // Step 1
    step1Title: (scoutName: string) => `Kandidaat voorgesteld door ${scoutName}`,
    step1Desc: 'Om de contactgegevens van deze kandidaat te ontvangen, dient u akkoord te gaan met de plaatsingsovereenkomst. U betaalt alleen bij een succesvolle plaatsing (no cure, no pay).',
    placementTermsTitle: 'Plaatsingsvoorwaarden',
    feeLabel: 'Plaatsingsfee bij aanname (excl. BTW)',
    paymentMomentLabel: 'Betaalmoment',
    paymentMomentValue: 'Na ondertekening arbeidsovereenkomst',
    fitGuaranteeLabel: 'Fit Garantie',
    fitGuaranteeValue: '12 maanden (bij M-Score ≥80%)',
    viewContractBtn: 'Bekijk contract en ga akkoord →',
    // Step 2
    step2Title: 'Plan een kennismakingsgesprek',
    step2Desc: (name: string) => `Neem contact op met ${name} en plan een gesprek. Voer de datum hieronder in.`,
    scheduleInterviewBtn: 'Gespreksdatum invoeren →',
    // Step 3 — gesprek gepland
    gesprekGeplandTitle: (type: string) => `${type} gepland`,
    kennismaking: 'Kennismakingsgesprek',
    verdieping: 'Verdiepingsgesprek',
    arbeidsvoorwaarden: 'Arbeidsvoorwaardengesprek',
    gesprekDoneBtn: 'Gesprek is afgerond — geef feedback →',
    // Step 4 — feedback
    step4Title: 'Hoe ging het gesprek?',
    step4Desc: (type: string) => `Geef feedback over het ${type}gesprek. Dit helpt de Talent Scout u de volgende keer nog beter van dienst te zijn.`,
    feedbackRatingLabel: 'Beoordeling',
    feedbackLabel: 'Feedback *',
    feedbackPlaceholder: 'Hoe verliep het gesprek? Wat viel op?',
    saveFeedbackBtn: 'Feedback opslaan →',
    // Step 5 — vervolg
    step5Title: 'Wat is de volgende stap?',
    step5Desc: (name: string) => `Kies hoe u verder wilt met ${name}.`,
    followUpInterview: 'Vervolggesprek plannen',
    followUpInterviewDesc: 'Plan nog een gesprek met de kandidaat',
    employmentTerms: 'Arbeidsvoorwaarden bespreken',
    employmentTermsDesc: 'Ga naar de onderhandelingsfase',
    rejectOption: 'Afwijzen',
    rejectOptionDesc: 'Deze kandidaat past niet',
    // Step 6 — arbeidsvoorwaarden
    step6Title: 'Arbeidsvoorwaarden',
    step6Desc: (name: string) => `U bent in gesprek over de arbeidsvoorwaarden met ${name}.`,
    contractSignedBtn: 'Contract getekend!',
    contractSignedDesc: 'De kandidaat heeft het contract ondertekend',
    scheduleAnotherBtn: 'Nog een gesprek plannen',
    scheduleAnotherDesc: 'Nog niet rond — plan een vervolggesprek',
    // Contract getekend
    successTitle: 'Succesvolle match!',
    successDesc: (naam: string, title: string, company: string) => `${naam} is aangenomen als ${title} bij ${company}. De Fit Garantie van 12 maanden is nu actief.`,
    feeLabelSmall: 'Plaatsingsfee (excl. BTW)',
    feeNote: '+ 21% BTW. Wordt geïncasseerd via uw creditcard.',
    // Afgewezen
    rejectedTitle: 'Kandidaat afgewezen',
    rejectedScoutRating: 'Scout rating',
    // Timeline
    timelineTitle: 'Gespreksverloop',
    timelineCompleted: 'Afgerond',
    timelinePlanned: 'Gepland',
    // Contract modal
    contractModalTitle: 'Plaatsingsovereenkomst',
    contractModalSubtitle: 'Lees de voorwaarden en ga akkoord om de contactgegevens te ontsluiten.',
    art1Title: 'Artikel 1 — No cure, no pay',
    art1: 'U betaalt alleen een plaatsingsfee bij daadwerkelijke start van de kandidaat.',
    art2Title: (opleidingsniveau: string, werkervaring: string) => `Artikel 2 — Plaatsingsfee`,
    art2: (fee: number, opl: string, we: string) => `De fee bedraagt €${fee.toLocaleString('nl-NL')} excl. BTW, gebaseerd op opleidingsniveau (${opl}) en werkervaring (${we}).`,
    art3Title: 'Artikel 3 — Fit Garantie',
    art3: 'Bij een M-Score van ≥80% geldt een Fit Garantie van 12 maanden. Vertrekt de medewerker binnen die periode — ook op eigen initiatief — dan levert Refurzy eenmalig gratis een vervangende kandidaat. Uitsluitingen: afwijkende werkzaamheden, mismanagement of reorganisatie. Refurzy voert een exitgesprek met de kandidaat ter beoordeling.',
    art4Title: 'Artikel 4 — Betaling',
    art4: 'De fee wordt gefactureerd op de eerste werkdag van de kandidaat. Beide partijen bevestigen de start via het platform.',
    art5Title: 'Artikel 5 — Terugtrekking',
    art5: 'Trekt de kandidaat zich vóór de startdatum terug: geen kosten. Trekt u zich terug: 50% van de fee.',
    paymentTitle: 'Betaalgegevens',
    creditcardLabel: 'Creditcardnummer',
    creditcardPlaceholder: '1234 5678 9012 3456',
    expiryLabel: 'Vervaldatum (MM/JJ)',
    expiryPlaceholder: 'MM/JJ',
    cvcLabel: 'CVC',
    cvcPlaceholder: '123',
    signatureLabel: 'Uw naam (ter ondertekening)',
    signaturePlaceholder: 'Volledige naam',
    signatureNote: 'Door hieronder uw naam in te vullen en te klikken op \'Onderteken\', gaat u digitaal akkoord met de bovenstaande plaatsingsovereenkomst. Dit contract wordt opgeslagen en is te downloaden via Mijn Contracten.',
    cancelBtn: 'Annuleren',
    signBtn: 'Onderteken plaatsingsovereenkomst',
    // Plan gesprek modal
    planModalKennismaking: 'Kennismakingsgesprek plannen',
    planModalVerdieping: 'Verdiepingsgesprek plannen',
    planModalArbeidsvoorwaarden: 'Arbeidsvoorwaardengesprek plannen',
    dateTimeLabel: 'Datum en tijd *',
    scheduleMeetingBtn: 'Gesprek plannen',
    // Reject modal
    rejectModalTitle: 'Kandidaat afwijzen',
    rejectModalSubtitle: 'Uw beoordeling helpt de Talent Scout beter te matchen in de toekomst.',
    rejectReasonLabel: 'Reden van afwijzing *',
    rejectReasonPlaceholder: 'Selecteer een reden',
    rejectScoutRatingLabel: 'Beoordeling scout *',
    autoRating: 'Automatisch 4 sterren — kandidaat bereikte arbeidsvoorwaarden fase',
    minRatingText: (n: number) => `Minimaal ${n} sterren — kandidaat kwam tot gespreksfase`,
    scoutQualityText: 'Hoe goed was de voordracht van de scout?',
    rejectNoteLabel: 'Toelichting',
    rejectNotePlaceholder: 'Optioneel: geef extra context',
    rejectBtn: 'Afwijzen',
    // Celebrate modal
    celebrateTitle: 'Gefeliciteerd!',
    celebrateDesc: (naam: string, title: string, company: string) => `${naam} wordt de nieuwe ${title} bij ${company}!`,
    emailsTitle: '📧 E-mails worden verstuurd naar:',
    emailOpdrachtgever: 'Opdrachtgever',
    emailOpdrachtgeverDesc: 'Welkom & onboarding tips',
    emailKandidaat: 'Kandidaat',
    emailKandidaatDesc: 'Felicitatie & eerste werkdag',
    emailScout: 'Scout',
    emailScoutDesc: 'Fee bevestiging & uitbetaling',
    fitGuaranteeActiveTitle: 'Fit Garantie actief',
    fitGuaranteeActiveDesc: '12 maanden bescherming bij M-Score ≥80%',
    closeBtn: 'Sluiten',
    anonimous: (initialen: string) => `Kandidaat ${initialen}`,
    kennismakingsFeedback: 'kennismakings',
    verdiepingsFeedback: 'verdiepings',
    arbeidsvoorwaardenFeedback: 'arbeidsvoorwaarden',
  },
  en: {
    backToDashboard: '← Back to dashboard',
    notFound: 'Candidate not found.',
    reject: 'Reject',
    progressTitle: 'Progress',
    mScore: 'M-Score',
    culturalMatch: 'Cultural match',
    hardeCriteria: 'Hard Criteria',
    scoutExplanationTitle: (name: string) => `Notes from ${name}`,
    talentScout: 'Talent Scout',
    hardeCriteriaMatchTitle: (pct: number) => `Hard Criteria Match — ${pct}%`,
    criteriaDeviation: (n: number) => `⚠ ${n} ${n === 1 ? 'criterion deviates' : 'criteria deviate'} — consider whether this is acceptable for this role.`,
    cvTitle: 'Curriculum Vitae',
    cvProfile: 'Profile',
    cvWorkExperience: 'Work experience',
    cvEducation: 'Education',
    cvSkills: 'Skills',
    cvLanguages: 'Languages',
    cvCertifications: 'Certifications',
    contactTitle: 'Contact details',
    contactEmail: 'Email',
    contactPhone: 'Phone',
    contactCity: 'City',
    contactScout: 'Scout',
    // Step 1
    step1Title: (scoutName: string) => `Candidate nominated by ${scoutName}`,
    step1Desc: 'To receive the contact details of this candidate, you must agree to the placement agreement. You only pay upon a successful placement (no cure, no pay).',
    placementTermsTitle: 'Placement terms',
    feeLabel: 'Placement fee upon hire (excl. VAT)',
    paymentMomentLabel: 'Payment moment',
    paymentMomentValue: 'Upon signing of employment contract',
    fitGuaranteeLabel: 'Fit Guarantee',
    fitGuaranteeValue: '12 months (with M-Score ≥80%)',
    viewContractBtn: 'View contract and agree →',
    // Step 2
    step2Title: 'Schedule an introductory meeting',
    step2Desc: (name: string) => `Contact ${name} and schedule a meeting. Enter the date below.`,
    scheduleInterviewBtn: 'Enter meeting date →',
    // Step 3 — gesprek gepland
    gesprekGeplandTitle: (type: string) => `${type} scheduled`,
    kennismaking: 'Introductory meeting',
    verdieping: 'In-depth meeting',
    arbeidsvoorwaarden: 'Employment terms meeting',
    gesprekDoneBtn: 'Meeting completed — give feedback →',
    // Step 4 — feedback
    step4Title: 'How did the meeting go?',
    step4Desc: (type: string) => `Provide feedback on the ${type} meeting. This helps the Talent Scout serve you better next time.`,
    feedbackRatingLabel: 'Rating',
    feedbackLabel: 'Feedback *',
    feedbackPlaceholder: 'How did the meeting go? What stood out?',
    saveFeedbackBtn: 'Save feedback →',
    // Step 5 — vervolg
    step5Title: 'What is the next step?',
    step5Desc: (name: string) => `Choose how you want to proceed with ${name}.`,
    followUpInterview: 'Schedule follow-up meeting',
    followUpInterviewDesc: 'Schedule another meeting with the candidate',
    employmentTerms: 'Discuss employment terms',
    employmentTermsDesc: 'Move to the negotiation phase',
    rejectOption: 'Reject',
    rejectOptionDesc: 'This candidate is not a fit',
    // Step 6 — arbeidsvoorwaarden
    step6Title: 'Employment terms',
    step6Desc: (name: string) => `You are discussing employment terms with ${name}.`,
    contractSignedBtn: 'Contract signed!',
    contractSignedDesc: 'The candidate has signed the contract',
    scheduleAnotherBtn: 'Schedule another meeting',
    scheduleAnotherDesc: 'Not finalised yet — schedule a follow-up',
    // Contract getekend
    successTitle: 'Successful match!',
    successDesc: (naam: string, title: string, company: string) => `${naam} has been hired as ${title} at ${company}. The 12-month Fit Guarantee is now active.`,
    feeLabelSmall: 'Placement fee (excl. VAT)',
    feeNote: '+ 21% VAT. Will be charged to your credit card.',
    // Afgewezen
    rejectedTitle: 'Candidate rejected',
    rejectedScoutRating: 'Scout rating',
    // Timeline
    timelineTitle: 'Meeting history',
    timelineCompleted: 'Completed',
    timelinePlanned: 'Planned',
    // Contract modal
    contractModalTitle: 'Placement Agreement',
    contractModalSubtitle: 'Read the terms and agree to unlock the contact details.',
    art1Title: 'Article 1 — No cure, no pay',
    art1: 'You only pay a placement fee when the candidate actually starts.',
    art2Title: (opleidingsniveau: string, werkervaring: string) => `Article 2 — Placement fee`,
    art2: (fee: number, opl: string, we: string) => `The fee is €${fee.toLocaleString('nl-NL')} excl. VAT, based on education level (${opl}) and work experience (${we}).`,
    art3Title: 'Article 3 — Fit Guarantee',
    art3: 'With an M-Score of ≥80% a Fit Guarantee of 12 months applies. If the employee leaves within that period — including on their own initiative — Refurzy provides one free replacement candidate. Exclusions: changed job duties, mismanagement or reorganisation. Refurzy conducts an exit interview with the candidate for assessment.',
    art4Title: 'Article 4 — Payment',
    art4: 'The fee is invoiced on the candidate\'s first working day. Both parties confirm the start via the platform.',
    art5Title: 'Article 5 — Withdrawal',
    art5: 'If the candidate withdraws before the start date: no costs. If you withdraw: 50% of the fee.',
    paymentTitle: 'Payment details',
    creditcardLabel: 'Credit card number',
    creditcardPlaceholder: '1234 5678 9012 3456',
    expiryLabel: 'Expiry date (MM/YY)',
    expiryPlaceholder: 'MM/YY',
    cvcLabel: 'CVC',
    cvcPlaceholder: '123',
    signatureLabel: 'Your name (for signing)',
    signaturePlaceholder: 'Full name',
    signatureNote: 'By entering your name below and clicking \'Sign\', you digitally agree to the placement agreement above. This contract is saved and can be downloaded via My Contracts.',
    cancelBtn: 'Cancel',
    signBtn: 'Sign placement agreement',
    // Plan gesprek modal
    planModalKennismaking: 'Schedule introductory meeting',
    planModalVerdieping: 'Schedule in-depth meeting',
    planModalArbeidsvoorwaarden: 'Schedule employment terms meeting',
    dateTimeLabel: 'Date and time *',
    scheduleMeetingBtn: 'Schedule meeting',
    // Reject modal
    rejectModalTitle: 'Reject candidate',
    rejectModalSubtitle: 'Your rating helps the Talent Scout match better in the future.',
    rejectReasonLabel: 'Reason for rejection *',
    rejectReasonPlaceholder: 'Select a reason',
    rejectScoutRatingLabel: 'Scout rating *',
    autoRating: 'Automatic 4 stars — candidate reached employment terms phase',
    minRatingText: (n: number) => `Minimum ${n} stars — candidate reached interview phase`,
    scoutQualityText: 'How good was the scout\'s nomination?',
    rejectNoteLabel: 'Notes',
    rejectNotePlaceholder: 'Optional: provide additional context',
    rejectBtn: 'Reject',
    // Celebrate modal
    celebrateTitle: 'Congratulations!',
    celebrateDesc: (naam: string, title: string, company: string) => `${naam} will be the new ${title} at ${company}!`,
    emailsTitle: '📧 Emails will be sent to:',
    emailOpdrachtgever: 'Employer',
    emailOpdrachtgeverDesc: 'Welcome & onboarding tips',
    emailKandidaat: 'Candidate',
    emailKandidaatDesc: 'Congratulations & first working day',
    emailScout: 'Scout',
    emailScoutDesc: 'Fee confirmation & payout',
    fitGuaranteeActiveTitle: 'Fit Guarantee active',
    fitGuaranteeActiveDesc: '12 months protection with M-Score ≥80%',
    closeBtn: 'Close',
    anonimous: (initialen: string) => `Candidate ${initialen}`,
    kennismakingsFeedback: 'introductory',
    verdiepingsFeedback: 'in-depth',
    arbeidsvoorwaardenFeedback: 'employment terms',
  },
}

// ─── Mock CV data per kandidaat ──────────────────────────────────────────────
interface CVData {
  samenvatting: string
  opleiding: { titel: string; instelling: string; jaar: string; extra?: string }[]
  werkervaring: { functie: string; bedrijf: string; periode: string; beschrijving: string }[]
  vaardigheden: string[]
  certificeringen?: string[]
  talen: { taal: string; niveau: string }[]
  scoutToelichting: string
}

const mockCVData: Record<string, CVData> = {
  'k-1': {
    samenvatting: 'Resultaatgerichte Marketing Manager met 8 jaar ervaring in digitale marketing, merkstrategie en teamleiderschap. Bewezen trackrecord in het opzetten van succesvolle campagnes en het aansturen van multidisciplinaire teams.',
    opleiding: [
      { titel: 'MSc Marketing Management', instelling: 'Universiteit van Amsterdam', jaar: '2016-2018' },
      { titel: 'BSc Bedrijfskunde', instelling: 'Universiteit van Amsterdam', jaar: '2012-2016' },
    ],
    werkervaring: [
      { functie: 'Senior Marketing Manager', bedrijf: 'DigitalFirst B.V.', periode: '2021 – heden', beschrijving: 'Verantwoordelijk voor de gehele marketingstrategie met een team van 6 marketeers. Realiseerde 35% groei in online conversies en 25% toename in merkbekendheid.' },
      { functie: 'Marketing Manager', bedrijf: 'BrandWorks Agency', periode: '2018 – 2021', beschrijving: 'Ontwikkelde en implementeerde cross-channel campagnes voor B2B en B2C klanten. Beheerde budget van €500K+.' },
      { functie: 'Marketing Coordinator', bedrijf: 'StartupHub Amsterdam', periode: '2016 – 2018', beschrijving: 'Content marketing, social media en eventorganisatie voor een tech-incubator met 50+ startups.' },
    ],
    vaardigheden: ['Digitale strategie', 'Google Analytics / GA4', 'HubSpot', 'Teamleiderschap', 'Budget management', 'SEO/SEA', 'Content marketing', 'A/B testing'],
    certificeringen: ['Google Analytics Certified', 'HubSpot Inbound Marketing', 'Meta Blueprint'],
    talen: [{ taal: 'Nederlands', niveau: 'Moedertaal (C2)' }, { taal: 'Engels', niveau: 'Uitstekend (C1)' }],
    scoutToelichting: 'Anna is een uitstekende match voor deze rol. Ze heeft ruime ervaring in digitale marketing en heeft bewezen dat ze een team kan aansturen. Haar trackrecord bij DigitalFirst laat zien dat ze meetbare resultaten behaalt. Cultureel past ze goed bij de innovatieve sfeer van TechVentures.',
  },
  'k-10': {
    samenvatting: 'Creatieve marketeer met 4 jaar ervaring in campagnemanagement en data-gedreven marketing. Sterk in analytics en het vertalen van data naar actiegerichte inzichten.',
    opleiding: [
      { titel: 'MSc Communication Science', instelling: 'Universiteit Leiden', jaar: '2020-2022' },
      { titel: 'BSc Communicatiewetenschap', instelling: 'Universiteit Leiden', jaar: '2017-2020' },
    ],
    werkervaring: [
      { functie: 'Marketing Specialist', bedrijf: 'DataDriven Marketing', periode: '2022 – heden', beschrijving: 'Verantwoordelijk voor campagne-optimalisatie, A/B testing en marketing automation. Verhoogde email open rates met 40%.' },
      { functie: 'Junior Marketeer', bedrijf: 'CreativeMinds Agency', periode: '2020 – 2022', beschrijving: 'Social media management en content creatie voor diverse klanten in retail en e-commerce.' },
    ],
    vaardigheden: ['Marketing automation', 'Data-analyse', 'Mailchimp/ActiveCampaign', 'Social media', 'Copywriting', 'Photoshop/Canva'],
    certificeringen: ['Google Ads Certified', 'Mailchimp Expert'],
    talen: [{ taal: 'Nederlands', niveau: 'Uitstekend (C1)' }, { taal: 'Engels', niveau: 'Goed (B2)' }],
    scoutToelichting: 'Nadia is een sterke analytische marketeer die goed past bij de data-gedreven cultuur van TechVentures. Ze heeft minder leidinggevende ervaring maar compenseert dit met haar sterke technische skills en leergierigheid.',
  },
  'k-3': {
    samenvatting: 'Ambitieuze marketing professional met 4 jaar ervaring, gespecialiseerd in social media en contentmarketing.',
    opleiding: [
      { titel: 'BSc Commerciële Economie', instelling: 'Haagse Hogeschool', jaar: '2018-2022' },
    ],
    werkervaring: [
      { functie: 'Social Media Manager', bedrijf: 'SocialBuzz', periode: '2022 – heden', beschrijving: 'Beheer van social media kanalen voor 10+ klanten. Focus op TikTok en Instagram groeistrategieën.' },
      { functie: 'Marketing Stagiair', bedrijf: 'RetailGroup NL', periode: '2021 – 2022', beschrijving: 'Ondersteuning bij campagneontwikkeling en marktonderzoek.' },
    ],
    vaardigheden: ['Social media management', 'Content creatie', 'Instagram/TikTok', 'Canva', 'Basis SEO'],
    talen: [{ taal: 'Nederlands', niveau: 'Goed (B2)' }, { taal: 'Engels', niveau: 'Redelijk (B1)' }],
    scoutToelichting: 'Lisa is een gedreven junior marketeer met veel potentieel. Ze heeft minder ervaring dan gevraagd maar haar social media expertise kan waardevol zijn voor het team.',
  },
  'k-20': {
    samenvatting: 'Veelzijdige marketeer met 6 jaar ervaring in B2B marketing, leadgeneratie en marketing automation.',
    opleiding: [
      { titel: 'BSc Marketing Management', instelling: 'Hogeschool van Amsterdam', jaar: '2015-2019' },
    ],
    werkervaring: [
      { functie: 'Marketing Manager', bedrijf: 'B2B Solutions', periode: '2021 – heden', beschrijving: 'Verantwoordelijk voor de volledige marketing funnel inclusief lead scoring, nurturing en pipeline rapportage.' },
      { functie: 'Marketing Executive', bedrijf: 'TechScale', periode: '2019 – 2021', beschrijving: 'Opzetten van HubSpot, implementatie van marketing automation flows en content strategie.' },
    ],
    vaardigheden: ['HubSpot', 'Marketing automation', 'Lead generation', 'B2B marketing', 'CRM management', 'LinkedIn Ads'],
    certificeringen: ['HubSpot Marketing Software', 'LinkedIn Marketing Certified'],
    talen: [{ taal: 'Nederlands', niveau: 'Moedertaal (C2)' }, { taal: 'Engels', niveau: 'Redelijk (B1)' }],
    scoutToelichting: 'Mees heeft sterke B2B marketing ervaring en is erg goed in marketing automation. Hij kan direct aan de slag met het opschalen van de marketing funnel.',
  },
  'k-21': {
    samenvatting: 'Jonge, energieke marketing professional met 3 jaar ervaring in brand management en event marketing.',
    opleiding: [
      { titel: 'MSc Strategic Management', instelling: 'Universiteit Utrecht', jaar: '2021-2023' },
      { titel: 'BSc Bedrijfskunde', instelling: 'Universiteit Utrecht', jaar: '2018-2021' },
    ],
    werkervaring: [
      { functie: 'Brand Manager', bedrijf: 'FreshBrands NL', periode: '2023 – heden', beschrijving: 'Verantwoordelijk voor merkpositionering en marketingstrategie van 3 FMCG-merken.' },
      { functie: 'Marketing Assistent', bedrijf: 'EventPro', periode: '2021 – 2023', beschrijving: 'Organisatie van corporate events en ondersteunende marketingactiviteiten.' },
    ],
    vaardigheden: ['Brand management', 'Event marketing', 'Strategisch denken', 'Presenteren', 'Adobe Creative Suite'],
    talen: [{ taal: 'Nederlands', niveau: 'Uitstekend (C1)' }, { taal: 'Engels', niveau: 'Uitstekend (C1)' }],
    scoutToelichting: 'Yara is strategisch sterk en heeft een frisse kijk op brand management. Ze heeft minder jaren ervaring maar haar snelle groei en WO-achtergrond compenseren dit ruimschoots.',
  },
  'k-22': {
    samenvatting: 'Ervaren marketing leider met 9 jaar ervaring in zowel corporate als agency-omgevingen. Expert in merkstrategie en digitale transformatie.',
    opleiding: [
      { titel: 'MBA', instelling: 'Rotterdam School of Management', jaar: '2019-2021', extra: 'Specialisatie Marketing & Innovation' },
      { titel: 'BSc Communicatiewetenschappen', instelling: 'Vrije Universiteit Amsterdam', jaar: '2013-2017' },
    ],
    werkervaring: [
      { functie: 'Head of Marketing', bedrijf: 'ScaleUp Ventures', periode: '2022 – heden', beschrijving: 'Leidt een team van 8 marketeers. Verantwoordelijk voor een marketingbudget van €1.2M en realiseerde 50% groei in MQLs.' },
      { functie: 'Senior Marketing Consultant', bedrijf: 'McKinnon & Partners', periode: '2019 – 2022', beschrijving: 'Strategisch advies aan Fortune 500 bedrijven op het gebied van digitale transformatie en merkstrategie.' },
      { functie: 'Marketing Manager', bedrijf: 'MediaGroup NL', periode: '2017 – 2019', beschrijving: 'Opbouw en leiding van het digitale marketing team. Lancering van 3 succesvolle productlanceringen.' },
    ],
    vaardigheden: ['Strategisch marketing leiderschap', 'Digitale transformatie', 'Team management', 'Budget planning', 'Stakeholder management', 'Google Analytics', 'Salesforce'],
    certificeringen: ['MBA Marketing & Innovation', 'Salesforce Marketing Cloud'],
    talen: [{ taal: 'Nederlands', niveau: 'Moedertaal (C2)' }, { taal: 'Engels', niveau: 'Uitstekend (C1)' }],
    scoutToelichting: 'Bram is een zeer ervaren marketing leider met een MBA en bewezen resultaten in het opschalen van marketingteams. Hij brengt zowel strategisch denken als hands-on ervaring mee.',
  },
  'k-4': {
    samenvatting: 'Full-stack developer met 10 jaar ervaring in enterprise software development. Expert in React, Node.js en cloud architectuur.',
    opleiding: [
      { titel: 'MSc Computer Science', instelling: 'TU Delft', jaar: '2014-2016' },
      { titel: 'BSc Informatica', instelling: 'TU Delft', jaar: '2010-2014' },
    ],
    werkervaring: [
      { functie: 'Lead Developer', bedrijf: 'CloudNine Technologies', periode: '2020 – heden', beschrijving: 'Leidt een team van 5 developers. Architectuur en implementatie van microservices op AWS. Migreerde legacy monolith naar cloud-native architectuur.' },
      { functie: 'Senior Software Developer', bedrijf: 'FinTech Innovations', periode: '2017 – 2020', beschrijving: 'Ontwikkeling van real-time trading platform in React/Node.js. Implementatie van CI/CD pipelines.' },
      { functie: 'Software Developer', bedrijf: 'WebAgency Pro', periode: '2016 – 2017', beschrijving: 'Full-stack development van enterprise web applicaties.' },
    ],
    vaardigheden: ['React/Next.js', 'Node.js/TypeScript', 'AWS/Azure', 'Docker/Kubernetes', 'PostgreSQL/MongoDB', 'CI/CD', 'Agile/Scrum', 'System design'],
    certificeringen: ['AWS Solutions Architect', 'Kubernetes Administrator (CKA)'],
    talen: [{ taal: 'Engels', niveau: 'Moedertaal (C2)' }, { taal: 'Nederlands', niveau: 'Goed (B2)' }],
    scoutToelichting: 'Thomas is een uitzonderlijke developer met diepe technische kennis en leidinggevende ervaring. Zijn AWS expertise en ervaring met microservices sluiten perfect aan bij de technische roadmap van TechVentures.',
  },
  'k-5': {
    samenvatting: 'Backend developer met 7 jaar ervaring in Java en Python. Sterk in data engineering en API design.',
    opleiding: [
      { titel: 'BSc Software Engineering', instelling: 'Hogeschool Rotterdam', jaar: '2015-2019' },
    ],
    werkervaring: [
      { functie: 'Senior Backend Developer', bedrijf: 'DataPipeline B.V.', periode: '2021 – heden', beschrijving: 'Ontwerp en ontwikkeling van high-throughput data pipelines. Verwerkt 10M+ events per dag.' },
      { functie: 'Backend Developer', bedrijf: 'LogiSoft', periode: '2019 – 2021', beschrijving: 'REST API development en database optimalisatie voor logistieke software.' },
    ],
    vaardigheden: ['Java/Spring Boot', 'Python', 'PostgreSQL', 'Apache Kafka', 'REST APIs', 'Docker', 'Git'],
    certificeringen: ['Oracle Java Certified Professional'],
    talen: [{ taal: 'Engels', niveau: 'Uitstekend (C1)' }, { taal: 'Nederlands', niveau: 'Goed (B2)' }, { taal: 'Hindi', niveau: 'Moedertaal (C2)' }],
    scoutToelichting: 'Priya is technisch sterk met veel ervaring in data-intensieve applicaties. Ze is pragmatisch, levert snel en werkt goed samen in teams.',
  },
}

// Fallback CV generator for kandidaten without specific mock data
function getDefaultCV(k: { naam: string; opleidingsniveau: string; werkervaring: string; woonplaats: string; scoutNaam: string }): CVData {
  return {
    samenvatting: `Ervaren professional met ${k.werkervaring} werkervaring op ${k.opleidingsniveau}-niveau. Zoekt een nieuwe uitdaging in de regio ${k.woonplaats}.`,
    opleiding: [
      { titel: k.opleidingsniveau === 'WO' ? 'MSc Bedrijfskunde' : 'BSc Bedrijfskunde', instelling: k.opleidingsniveau === 'WO' ? 'Universiteit Utrecht' : 'Hogeschool Utrecht', jaar: '2014-2018' },
    ],
    werkervaring: [
      { functie: 'Senior Professional', bedrijf: 'Vorig Bedrijf B.V.', periode: '2020 – heden', beschrijving: 'Verantwoordelijk voor diverse projecten en taken binnen het functiegebied.' },
    ],
    vaardigheden: ['Projectmanagement', 'Communicatie', 'Analyse', 'Teamwerk'],
    talen: [{ taal: 'Nederlands', niveau: 'Uitstekend (C1)' }, { taal: 'Engels', niveau: 'Goed (B2)' }],
    scoutToelichting: `Kandidaat is voorgedragen door ${k.scoutNaam} vanwege een goede match met het profiel en de organisatiecultuur.`,
  }
}

export default function OpdrachtgeverKandidaatProces() {
  const params = useParams()
  const { lang } = useLang()
  const t = texts[lang]

  const vacature = vacatures.find(v => v.id === params.id)
  const kandidaat = vacature?.kandidaten.find(k => k.id === params.kandidaatId)

  const [procesStatus, setProcesStatus] = useState<ProcesStatus>(kandidaat?.procesStatus || 'voorgesteld')
  const [unlocked, setUnlocked] = useState(kandidaat?.unlocked || false)
  const [contractAccepted, setContractAccepted] = useState(procesStatus !== 'voorgesteld')
  const [gesprekken, setGesprekken] = useState<Gesprek[]>(kandidaat?.gesprekken || [])
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [showCelebrateModal, setShowCelebrateModal] = useState(false)
  const [rejectRating, setRejectRating] = useState(0)
  const [rejectReason, setRejectReason] = useState<AfwijzingsReden | ''>('')
  const [rejectNote, setRejectNote] = useState('')
  const [newGesprekDatum, setNewGesprekDatum] = useState('')
  const [newGesprekType, setNewGesprekType] = useState<'kennismaking' | 'verdieping' | 'arbeidsvoorwaarden'>('kennismaking')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [isRejected, setIsRejected] = useState(false)
  const [ondertekeningNaam, setOndertekeningNaam] = useState('')
  const [creditcardNummer, setCreditcardNummer] = useState('')
  const [creditcardExpiry, setCreditcardExpiry] = useState('')
  const [creditcardCvc, setCreditcardCvc] = useState('')

  // Minimum scout rating based on pipeline phase reached
  const getMinRating = (status: string) => {
    if (['contract_akkoord', 'gesprek_plannen', 'gesprek_gepland', 'feedback_geven'].includes(status)) return 3
    if (status === 'arbeidsvoorwaarden') return 4
    return 0 // voorgesteld: no minimum
  }
  const minRating = getMinRating(procesStatus)

  if (!vacature || !kandidaat) {
    return <div className="flex items-center justify-center h-64"><p className="text-ink-light">{t.notFound}</p></div>
  }

  const fee = calculateFee(kandidaat.opleidingsniveau, kandidaat.werkervaring)
  const lastGesprek = gesprekken[gesprekken.length - 1]
  const needsFeedback = lastGesprek && lastGesprek.status === 'afgerond' && !lastGesprek.feedback
  const cv = mockCVData[kandidaat.id] || getDefaultCV(kandidaat)

  const displayName = unlocked ? kandidaat.naam : t.anonimous(kandidaat.initialen)

  // Calculate detailed harde criteria match using same mock data as HardeCriteriaDetail
  const mockKandidaatData: Record<string, { salarisMin: number; salarisMax: number; maxReistijd: string; opKantoor: string; talen: { taal: string; niveau: 'A2' | 'B1' | 'B2' | 'C1' | 'C2' }[] }> = {
    'k-1': { salarisMin: 4800, salarisMax: 5800, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-10': { salarisMin: 4000, salarisMax: 5000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'B2' }] },
    'k-3': { salarisMin: 4500, salarisMax: 6500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-4': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-5': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Engels', niveau: 'C1' }] },
    'k-20': { salarisMin: 4200, salarisMax: 5500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-21': { salarisMin: 3500, salarisMax: 4500, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-22': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-23': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-24': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '30 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Engels', niveau: 'B2' }] },
    'k-25': { salarisMin: 7000, salarisMax: 8500, maxReistijd: '30 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Engels', niveau: 'C2' }] },
    'k-30': { salarisMin: 4000, salarisMax: 5000, maxReistijd: '30 minuten', opKantoor: 'Op kantoor (5 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'B2' }] },
    'k-31': { salarisMin: 3800, salarisMax: 4800, maxReistijd: '30 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C1' }, { taal: 'Engels', niveau: 'B1' }] },
    'k-32': { salarisMin: 5000, salarisMax: 6500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'C2' }, { taal: 'Engels', niveau: 'C1' }] },
    'k-33': { salarisMin: 5500, salarisMax: 7000, maxReistijd: '60 minuten', opKantoor: 'Hybride (2 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' }, { taal: 'Engels', niveau: 'B1' }] },
  }
  const kData = mockKandidaatData[kandidaat.id] || { salarisMin: 4000, salarisMax: 5500, maxReistijd: '45 minuten', opKantoor: 'Hybride (3 dagen)', talen: [{ taal: 'Nederlands', niveau: 'B2' as const }, { taal: 'Engels', niveau: 'B1' as const }] }
  const hardeCriteriaResult = vacature.hardeCriteria ? calculateHardeCriteriaMatch(vacature.hardeCriteria, {
    opleidingsniveau: kandidaat.opleidingsniveau,
    werkervaring: kandidaat.werkervaring,
    ...kData,
  }) : null
  const failedCriteria = hardeCriteriaResult?.criteria.filter(c => !c.voldaan) || []

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleAcceptContract = () => {
    setContractAccepted(true)
    setUnlocked(true)
    setProcesStatus('gesprek_plannen')
    setShowContractModal(false)
  }

  const handlePlanGesprek = () => {
    if (!newGesprekDatum) return
    const gesprek: Gesprek = {
      id: `g-new-${Date.now()}`,
      type: newGesprekType,
      datum: newGesprekDatum,
      status: 'gepland',
    }
    setGesprekken([...gesprekken, gesprek])
    setProcesStatus('gesprek_gepland')
    setShowPlanModal(false)
    setNewGesprekDatum('')
  }

  const handleMarkGesprekDone = (gesprekId: string) => {
    setGesprekken(gesprekken.map(g => g.id === gesprekId ? { ...g, status: 'afgerond' as const } : g))
    setProcesStatus('feedback_geven')
  }

  const handleSubmitFeedback = (gesprekId: string) => {
    if (!feedbackText) return
    setGesprekken(gesprekken.map(g =>
      g.id === gesprekId ? { ...g, feedback: feedbackText, rating: feedbackRating || undefined } : g
    ))
    setProcesStatus('vervolggesprek')
    setFeedbackText('')
    setFeedbackRating(0)
  }

  const handleStartArbeidsvoorwaarden = () => {
    setProcesStatus('arbeidsvoorwaarden')
    setNewGesprekType('arbeidsvoorwaarden')
  }

  const handleContractGetekend = () => {
    setProcesStatus('contract_getekend')
    setShowCelebrateModal(true)
  }

  const handleReject = () => {
    if (!rejectReason || rejectRating === 0) return
    setIsRejected(true)
    setProcesStatus('afgewezen')
    setShowRejectModal(false)
  }

  // ─── Star rating component ─────────────────────────────────────────────────
  const StarRating = ({ value, onChange, size = 'md' }: { value: number; onChange: (v: number) => void; size?: 'sm' | 'md' }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} onClick={() => onChange(star)}
          className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} transition-colors ${star <= value ? 'text-yellow-400' : 'text-surface-border hover:text-yellow-300'}`}>
          ★
        </button>
      ))}
    </div>
  )

  // Helper: get translated meeting type label
  const getMeetingTypeLabel = (type: string) => {
    if (type === 'kennismaking') return t.kennismaking
    if (type === 'verdieping') return t.verdieping
    return t.arbeidsvoorwaarden
  }

  // Helper: get feedback prefix for meeting type
  const getFeedbackTypePrefix = (type: string) => {
    if (type === 'kennismaking') return t.kennismakingsFeedback
    if (type === 'verdieping') return t.verdiepingsFeedback
    return t.arbeidsvoorwaardenFeedback
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm inline-flex items-center gap-1 transition-colors">
        {t.backToDashboard}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple/20 text-purple flex items-center justify-center text-lg font-bold">
              {kandidaat.initialen}
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">
                {displayName}
              </h1>
              <p className="text-ink-light text-sm">{vacature.title} · {vacature.company}</p>
            </div>
          </div>
        </div>
        {!isRejected && procesStatus !== 'contract_getekend' && (
          <button onClick={() => { setRejectRating(minRating > 0 ? minRating : 0); setShowRejectModal(true) }}
            className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors">
            {t.reject}
          </button>
        )}
      </div>

      {/* Pipeline tracker */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-xs font-medium text-ink-muted mb-4 uppercase tracking-wider">{t.progressTitle}</h2>
        <PipelineTracker currentStatus={procesStatus} isRejected={isRejected} />
      </div>

      {/* M-Score + Criteria */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted mb-2">{t.mScore}</p>
          <div className="flex items-center gap-3">
            <FitScore score={kandidaat.deVriesFit} size="lg" />
            <div>
              <p className="text-ink font-semibold">{kandidaat.deVriesFit}%</p>
              <p className="text-xs text-ink-muted">{t.culturalMatch}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted mb-2">{t.hardeCriteria}</p>
          <div className="flex items-center gap-3">
            <FitScore score={kandidaat.hardeCriteriaMatch} size="lg" />
            <div>
              <HardeCriteriaDetail kandidaat={kandidaat} hardeCriteria={vacature?.hardeCriteria} size="lg" />
              <p className="text-xs text-ink-muted">{kandidaat.opleidingsniveau} · {kandidaat.werkervaring}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scout Toelichting ──────────────────────────────────────────────── */}
      <div className="bg-purple/5 rounded-2xl border border-purple/20 p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-purple/20 text-purple flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
            {kandidaat.scoutNaam.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-semibold text-ink">{t.scoutExplanationTitle(kandidaat.scoutNaam)}</h2>
              <span className="text-[10px] text-ink-muted bg-surface-muted px-1.5 py-0.5 rounded">{t.talentScout}</span>
            </div>
            <p className="text-sm text-ink-light leading-relaxed">{cv.scoutToelichting}</p>
          </div>
        </div>
      </div>

      {/* ─── Harde Criteria Detail (afwijkingen prominent) ──────────────────── */}
      {hardeCriteriaResult && (
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">{t.hardeCriteriaMatchTitle(kandidaat.hardeCriteriaMatch)}</h2>
          <div className="space-y-2">
            {hardeCriteriaResult.criteria.map((c, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${
                c.voldaan ? 'bg-green-50/50' : 'bg-red-50 border border-red-100'
              }`}>
                <span className={`text-base flex-shrink-0 ${c.voldaan ? 'text-green-500' : 'text-red-400'}`}>
                  {c.voldaan ? '✓' : '✕'}
                </span>
                <span className={`font-medium flex-shrink-0 w-28 ${c.voldaan ? 'text-ink' : 'text-red-700'}`}>
                  {c.naam}
                </span>
                <span className={`flex-1 ${c.voldaan ? 'text-ink-light' : 'text-red-600'}`}>
                  {c.detail}
                </span>
              </div>
            ))}
          </div>
          {failedCriteria.length > 0 && (
            <div className="mt-3 pt-3 border-t border-surface-border">
              <p className="text-xs text-orange font-medium">
                {t.criteriaDeviation(failedCriteria.length)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── CV / Profiel ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">{t.cvTitle}</h2>

        {/* Samenvatting */}
        <div>
          <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">{t.cvProfile}</h3>
          <p className="text-sm text-ink-light leading-relaxed">{cv.samenvatting}</p>
        </div>

        {/* Werkervaring */}
        <div>
          <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-3">{t.cvWorkExperience}</h3>
          <div className="space-y-4">
            {cv.werkervaring.map((w, i) => (
              <div key={i} className="relative pl-5 border-l-2 border-purple/20">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-purple" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{w.functie}</p>
                    <p className="text-xs text-purple font-medium">{w.bedrijf}</p>
                  </div>
                  <span className="text-xs text-ink-muted flex-shrink-0 ml-4">{w.periode}</span>
                </div>
                <p className="text-sm text-ink-light mt-1 leading-relaxed">{w.beschrijving}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Opleiding */}
        <div>
          <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-3">{t.cvEducation}</h3>
          <div className="space-y-3">
            {cv.opleiding.map((o, i) => (
              <div key={i} className="relative pl-5 border-l-2 border-cyan/20">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{o.titel}</p>
                    <p className="text-xs text-cyan font-medium">{o.instelling}</p>
                    {o.extra && <p className="text-xs text-ink-muted mt-0.5">{o.extra}</p>}
                  </div>
                  <span className="text-xs text-ink-muted flex-shrink-0 ml-4">{o.jaar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vaardigheden + Talen in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">{t.cvSkills}</h3>
            <div className="flex flex-wrap gap-1.5">
              {cv.vaardigheden.map((v, i) => (
                <span key={i} className="px-2.5 py-1 bg-surface-muted text-ink text-xs rounded-lg border border-surface-border">{v}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">{t.cvLanguages}</h3>
            <div className="space-y-1.5">
              {cv.talen.map((tl, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{tl.taal}</span>
                  <span className="text-ink-muted text-xs">{tl.niveau}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificeringen */}
        {cv.certificeringen && cv.certificeringen.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">{t.cvCertifications}</h3>
            <div className="flex flex-wrap gap-1.5">
              {cv.certificeringen.map((c, i) => (
                <span key={i} className="px-2.5 py-1 bg-cyan/10 text-cyan text-xs rounded-lg border border-cyan/20 font-medium">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact details (only when unlocked) */}
      {unlocked && (
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <h2 className="text-sm font-medium text-ink mb-3">{t.contactTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-ink-muted text-xs">{t.contactEmail}</p>
              <p className="text-ink font-medium">{kandidaat.email || 'anna.dejong@email.nl'}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">{t.contactPhone}</p>
              <p className="text-ink font-medium">{kandidaat.telefoon || '06-12345678'}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">{t.contactCity}</p>
              <p className="text-ink font-medium">{kandidaat.woonplaats}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">{t.contactScout}</p>
              <p className="text-ink font-medium">{kandidaat.scoutNaam}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 1: Profiel bekijken → Contract accepteren ─────────────────────── */}
      {procesStatus === 'voorgesteld' && !contractAccepted && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">{t.step1Title(kandidaat.scoutNaam)}</h2>
              <p className="text-ink-light text-sm mt-1">{t.step1Desc}</p>
            </div>
          </div>

          <div className="bg-surface-muted rounded-xl p-4">
            <h3 className="text-sm font-medium text-ink mb-2">{t.placementTermsTitle}</h3>
            <div className="space-y-2 text-sm text-ink-light">
              <div className="flex justify-between">
                <span>{t.feeLabel}</span>
                <span className="text-ink font-semibold">€{fee.fee.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.paymentMomentLabel}</span>
                <span className="text-ink">{t.paymentMomentValue}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.fitGuaranteeLabel}</span>
                <span className="text-ink">{t.fitGuaranteeValue}</span>
              </div>
            </div>
          </div>

          <button onClick={() => setShowContractModal(true)}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            {t.viewContractBtn}
          </button>
        </div>
      )}

      {/* ─── Step 2: Gesprek plannen ────────────────────────────────────────────── */}
      {procesStatus === 'gesprek_plannen' && (
        <div className="bg-white rounded-2xl border-2 border-orange/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">{t.step2Title}</h2>
              <p className="text-ink-light text-sm mt-1">{t.step2Desc(displayName)}</p>
            </div>
          </div>

          <button onClick={() => { setNewGesprekType('kennismaking'); setShowPlanModal(true) }}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            {t.scheduleInterviewBtn}
          </button>
        </div>
      )}

      {/* ─── Step 3: Gesprek gepland ────────────────────────────────────────────── */}
      {procesStatus === 'gesprek_gepland' && lastGesprek && (
        <div className="bg-white rounded-2xl border-2 border-blue-300/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {t.gesprekGeplandTitle(getMeetingTypeLabel(lastGesprek.type))}
              </h2>
              <p className="text-ink-light text-sm mt-1">
                Op <strong className="text-ink">{new Date(lastGesprek.datum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </p>
            </div>
          </div>

          <button onClick={() => handleMarkGesprekDone(lastGesprek.id)}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            {t.gesprekDoneBtn}
          </button>
        </div>
      )}

      {/* ─── Step 4: Feedback geven ─────────────────────────────────────────────── */}
      {procesStatus === 'feedback_geven' && lastGesprek && (
        <div className="bg-white rounded-2xl border-2 border-yellow-300/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">{t.step4Title}</h2>
              <p className="text-ink-light text-sm mt-1">
                {t.step4Desc(getFeedbackTypePrefix(lastGesprek.type))}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">{t.feedbackRatingLabel}</label>
            <StarRating value={feedbackRating} onChange={setFeedbackRating} />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">{t.feedbackLabel}</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              placeholder={t.feedbackPlaceholder}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none"
            />
          </div>

          <button onClick={() => handleSubmitFeedback(lastGesprek.id)}
            disabled={!feedbackText}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {t.saveFeedbackBtn}
          </button>
        </div>
      )}

      {/* ─── Step 5: Vervolg bepalen ────────────────────────────────────────────── */}
      {procesStatus === 'vervolggesprek' && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">{t.step5Title}</h2>
              <p className="text-ink-light text-sm mt-1">{t.step5Desc(displayName)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={() => { setNewGesprekType('verdieping'); setShowPlanModal(true) }}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-cyan/5 hover:border-cyan/30 border border-surface-border transition-colors">
              <span className="text-lg">🤝</span>
              <p className="text-sm font-medium text-ink mt-2">{t.followUpInterview}</p>
              <p className="text-xs text-ink-muted mt-1">{t.followUpInterviewDesc}</p>
            </button>
            <button onClick={handleStartArbeidsvoorwaarden}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-green-50 hover:border-green-300 border border-surface-border transition-colors">
              <span className="text-lg">💼</span>
              <p className="text-sm font-medium text-ink mt-2">{t.employmentTerms}</p>
              <p className="text-xs text-ink-muted mt-1">{t.employmentTermsDesc}</p>
            </button>
            <button onClick={() => { setRejectRating(minRating > 0 ? minRating : 0); setShowRejectModal(true) }}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-red-50 hover:border-red-300 border border-surface-border transition-colors">
              <span className="text-lg">✕</span>
              <p className="text-sm font-medium text-ink mt-2">{t.rejectOption}</p>
              <p className="text-xs text-ink-muted mt-1">{t.rejectOptionDesc}</p>
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 6: Arbeidsvoorwaarden ─────────────────────────────────────────── */}
      {procesStatus === 'arbeidsvoorwaarden' && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💼</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">{t.step6Title}</h2>
              <p className="text-ink-light text-sm mt-1">{t.step6Desc(displayName)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button onClick={handleContractGetekend}
              className="p-4 bg-green-50 rounded-xl text-left hover:bg-green-100 border border-green-200 transition-colors">
              <span className="text-2xl">🎉</span>
              <p className="text-sm font-semibold text-green-700 mt-2">{t.contractSignedBtn}</p>
              <p className="text-xs text-green-600 mt-1">{t.contractSignedDesc}</p>
            </button>
            <button onClick={() => { setNewGesprekType('arbeidsvoorwaarden'); setShowPlanModal(true) }}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-cyan/5 border border-surface-border transition-colors">
              <span className="text-lg">📅</span>
              <p className="text-sm font-medium text-ink mt-2">{t.scheduleAnotherBtn}</p>
              <p className="text-xs text-ink-muted mt-1">{t.scheduleAnotherDesc}</p>
            </button>
          </div>
        </div>
      )}

      {/* ─── Contract getekend! ─────────────────────────────────────────────────── */}
      {procesStatus === 'contract_getekend' && (
        <div className="bg-gradient-to-br from-green-50 to-cyan/10 rounded-2xl border-2 border-green-300 p-8 text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-2xl font-bold text-ink">{t.successTitle}</h2>
          <p className="text-ink-light max-w-md mx-auto">
            {t.successDesc(kandidaat.naam, vacature.title, vacature.company)}
          </p>
          <div className="bg-white rounded-xl p-4 max-w-sm mx-auto">
            <p className="text-xs text-ink-muted">{t.feeLabelSmall}</p>
            <p className="text-2xl font-bold text-ink">€{fee.fee.toLocaleString('nl-NL')}</p>
            <p className="text-xs text-ink-muted mt-1">{t.feeNote}</p>
          </div>
        </div>
      )}

      {/* ─── Afgewezen ──────────────────────────────────────────────────────────── */}
      {isRejected && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✕</span>
            <div>
              <h2 className="text-lg font-semibold text-red-700">{t.rejectedTitle}</h2>
              <p className="text-red-600 text-sm mt-1">
                {afwijzingsRedenen.find(r => r.key === rejectReason)?.label}
                {rejectNote && ` — "${rejectNote}"`}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`text-sm ${s <= rejectRating ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                ))}
                <span className="text-xs text-ink-muted ml-1">{t.rejectedScoutRating}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Gesprekken timeline ─────────────────────────────────────────────────── */}
      {gesprekken.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-sm font-medium text-ink-muted mb-4">{t.timelineTitle}</h2>
          <div className="space-y-4">
            {gesprekken.map((g, i) => (
              <div key={g.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    g.status === 'afgerond' ? 'bg-green-100 text-green-600' :
                    g.status === 'gepland' ? 'bg-blue-100 text-blue-600' : 'bg-surface-muted text-ink-muted'
                  }`}>
                    {g.status === 'afgerond' ? '✓' : g.status === 'gepland' ? '📅' : '—'}
                  </div>
                  {i < gesprekken.length - 1 && <div className="w-px h-full bg-surface-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink">
                      {getMeetingTypeLabel(g.type)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      g.status === 'afgerond' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {g.status === 'afgerond' ? t.timelineCompleted : t.timelinePlanned}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {new Date(g.datum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  {g.feedback && (
                    <div className="mt-2 bg-surface-muted rounded-lg p-3">
                      <p className="text-sm text-ink-light">{g.feedback}</p>
                      {g.rating && (
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`text-xs ${s <= g.rating! ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Contract Modal ──────────────────────────────────────────────────────── */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-purple/5 p-6 border-b border-surface-border">
              <h2 className="text-xl font-bold text-ink">{t.contractModalTitle}</h2>
              <p className="text-ink-light text-sm mt-1">{t.contractModalSubtitle}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-surface-muted rounded-xl p-4 space-y-3 text-sm text-ink-light">
                <p><strong className="text-ink">{t.art1Title}</strong><br />{t.art1}</p>
                <p><strong className="text-ink">{t.art2Title(kandidaat.opleidingsniveau, kandidaat.werkervaring)}</strong><br />{t.art2(fee.fee, kandidaat.opleidingsniveau, kandidaat.werkervaring)}</p>
                <p><strong className="text-ink">{t.art3Title}</strong><br />{t.art3}</p>
                <p><strong className="text-ink">{t.art4Title}</strong><br />{t.art4}</p>
                <p><strong className="text-ink">{t.art5Title}</strong><br />{t.art5}</p>
              </div>

              {/* Creditcard gegevens */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-ink">{t.paymentTitle}</h3>
                <div>
                  <label className="block text-xs text-ink-muted mb-1">{t.creditcardLabel}</label>
                  <input type="text" value={creditcardNummer} onChange={(e) => setCreditcardNummer(e.target.value)}
                    placeholder={t.creditcardPlaceholder} maxLength={19}
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-ink-muted mb-1">{t.expiryLabel}</label>
                    <input type="text" value={creditcardExpiry} onChange={(e) => setCreditcardExpiry(e.target.value)}
                      placeholder={t.expiryPlaceholder} maxLength={5}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-ink-muted mb-1">{t.cvcLabel}</label>
                    <input type="text" value={creditcardCvc} onChange={(e) => setCreditcardCvc(e.target.value)}
                      placeholder={t.cvcPlaceholder} maxLength={4}
                      className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50" />
                  </div>
                </div>
              </div>

              {/* Ondertekening */}
              <div className="space-y-3 border-t border-surface-border pt-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{t.signatureLabel}</label>
                  <input type="text" value={ondertekeningNaam} onChange={(e) => setOndertekeningNaam(e.target.value)}
                    placeholder={t.signaturePlaceholder}
                    className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50" />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">{t.signatureNote}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowContractModal(false)}
                  className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                  {t.cancelBtn}
                </button>
                <button onClick={handleAcceptContract}
                  disabled={!ondertekeningNaam.trim()}
                  className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {t.signBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Plan gesprek modal ──────────────────────────────────────────────────── */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-ink">
              {newGesprekType === 'kennismaking' ? t.planModalKennismaking :
               newGesprekType === 'verdieping' ? t.planModalVerdieping : t.planModalArbeidsvoorwaarden}
            </h2>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">{t.dateTimeLabel}</label>
              <input type="datetime-local" value={newGesprekDatum} onChange={(e) => setNewGesprekDatum(e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPlanModal(false)}
                className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                {t.cancelBtn}
              </button>
              <button onClick={handlePlanGesprek} disabled={!newGesprekDatum}
                className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40">
                {t.scheduleMeetingBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Reject modal ────────────────────────────────────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-ink">{t.rejectModalTitle}</h2>
            <p className="text-ink-light text-sm">{t.rejectModalSubtitle}</p>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">{t.rejectReasonLabel}</label>
              <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value as AfwijzingsReden)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
                <option value="">{t.rejectReasonPlaceholder}</option>
                {afwijzingsRedenen.map(r => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">{t.rejectScoutRatingLabel}</label>
              {procesStatus === 'arbeidsvoorwaarden' ? (
                <>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-2xl ${star <= 4 ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-xs text-green-600 mt-1">{t.autoRating}</p>
                </>
              ) : (
                <>
                  <StarRating value={rejectRating} onChange={(v) => setRejectRating(Math.max(v, minRating))} />
                  {minRating >= 3 ? (
                    <p className="text-xs text-ink-muted mt-1">{t.minRatingText(minRating)}</p>
                  ) : (
                    <p className="text-xs text-ink-muted mt-1">{t.scoutQualityText}</p>
                  )}
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">{t.rejectNoteLabel}</label>
              <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={2}
                placeholder={t.rejectNotePlaceholder}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                {t.cancelBtn}
              </button>
              <button onClick={handleReject} disabled={!rejectReason || rejectRating === 0}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-40">
                {t.rejectBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Celebrate modal ─────────────────────────────────────────────────────── */}
      {showCelebrateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-br from-cyan via-blue-500 to-purple p-8 text-center text-white">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold">{t.celebrateTitle}</h2>
              <p className="text-white/90 mt-2">{t.celebrateDesc(kandidaat.naam, vacature.title, vacature.company)}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-surface-muted rounded-xl p-4 space-y-2 text-sm">
                <p className="text-ink-muted">{t.emailsTitle}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">{t.emailOpdrachtgever}</p>
                    <p className="text-ink-muted">{t.emailOpdrachtgeverDesc}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">{t.emailKandidaat}</p>
                    <p className="text-ink-muted">{t.emailKandidaatDesc}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">{t.emailScout}</p>
                    <p className="text-ink-muted">{t.emailScoutDesc}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-700">{t.fitGuaranteeActiveTitle}</p>
                    <p className="text-xs text-green-600">{t.fitGuaranteeActiveDesc}</p>
                  </div>
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
              <button onClick={() => setShowCelebrateModal(false)}
                className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
