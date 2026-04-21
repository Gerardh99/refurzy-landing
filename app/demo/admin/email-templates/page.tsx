'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'

interface EmailTemplate {
  id: number
  name: { nl: string; en: string }
  recipientRole: { nl: string; en: string }
  trigger: { nl: string; en: string }
  subject: { nl: string; en: string }
  bodyPreview: string
}

const texts = {
  nl: {
    pageTitle: 'Email Templates',
    subtitle: (n: number) => `Overzicht van alle ${n} email templates in het systeem.`,
    triggerLabel: 'Trigger:',
    subjectLabel: 'Onderwerp:',
    previewLabel: 'Email preview',
  },
  en: {
    pageTitle: 'Email Templates',
    subtitle: (n: number) => `Overview of all ${n} email templates in the system.`,
    triggerLabel: 'Trigger:',
    subjectLabel: 'Subject:',
    previewLabel: 'Email preview',
  },
}

const templates: EmailTemplate[] = [
  {
    id: 1,
    name: { nl: 'Uitnodiging kandidaat (door scout)', en: 'Candidate invitation (by scout)' },
    recipientRole: { nl: 'Kandidaat', en: 'Candidate' },
    trigger: { nl: 'Scout nodigt kandidaat uit', en: 'Scout invites candidate' },
    subject: { nl: 'Je bent uitgenodigd voor een unieke kans bij {{bedrijf}}!', en: 'You have been invited for a unique opportunity at {{company}}!' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6D40F9, #14CDD3); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Je bent uitgenodigd!</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{kandidaat_naam}}</strong>,</p>
        <p style="color: #64748B;">{{scout_naam}} denkt dat jij een goede match bent voor de functie <strong>{{vacature_titel}}</strong> bij <strong>{{bedrijf}}</strong>.</p>
        <p style="color: #64748B;">Maak een account aan en vul de Matching Scan in om je M-Score te berekenen. Dit duurt ongeveer 15 minuten.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #6D40F9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Account aanmaken</a>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">Je gegevens worden geanonimiseerd gedeeld. Pas na akkoord van de opdrachtgever worden je contactgegevens zichtbaar.</p>
      </div>
    </div>`,
  },
  {
    id: 2,
    name: { nl: 'Matching Scan herinnering', en: 'Matching Scan reminder' },
    recipientRole: { nl: 'Kandidaat', en: 'Candidate' },
    trigger: { nl: 'Scan niet ingevuld na 48 uur', en: 'Scan not completed after 48 hours' },
    subject: { nl: 'Vergeet je Matching Scan niet!', en: "Don't forget your Matching Scan!" },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6D40F9, #14CDD3); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Herinnering: Matching Scan</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{kandidaat_naam}}</strong>,</p>
        <p style="color: #64748B;">Je hebt je Matching Scan nog niet ingevuld. Dit is nodig om je M-Score te berekenen en gematcht te worden met vacatures.</p>
        <p style="color: #64748B;">Het invullen duurt slechts 15 minuten en is gebaseerd op wetenschappelijk onderzoek van de VU Amsterdam.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #6D40F9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Scan invullen</a>
        </div>
      </div>
    </div>`,
  },
  {
    id: 3,
    name: { nl: 'Nieuwe matchingsuggestie (naar scout)', en: 'New match suggestion (to scout)' },
    recipientRole: { nl: 'Scout', en: 'Scout' },
    trigger: { nl: 'Nieuwe vacature matcht met talent pool', en: 'New vacancy matches with talent pool' },
    subject: { nl: 'Nieuwe match gevonden: {{vacature_titel}} bij {{bedrijf}}', en: 'New match found: {{vacancy_title}} at {{company}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6D40F9, #14CDD3); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Nieuwe matchingsuggestie</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{scout_naam}}</strong>,</p>
        <p style="color: #64748B;">Er is een nieuwe vacature die matcht met kandidaten in je talent pool:</p>
        <div style="background: #FAFBFE; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #1E293B; font-weight: 600; margin: 0 0 8px;">{{vacature_titel}}</p>
          <p style="color: #64748B; margin: 0; font-size: 14px;">{{bedrijf}} &middot; {{locatie}}</p>
          <p style="color: #6D40F9; margin: 8px 0 0; font-size: 14px;">{{aantal}} kandidaten matchen</p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #6D40F9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Bekijk suggesties</a>
        </div>
      </div>
    </div>`,
  },
  {
    id: 4,
    name: { nl: 'Kandidaat voorgedragen (naar opdrachtgever)', en: 'Candidate nominated (to employer)' },
    recipientRole: { nl: 'Opdrachtgever', en: 'Employer' },
    trigger: { nl: 'Scout draagt kandidaat voor', en: 'Scout nominates candidate' },
    subject: { nl: 'Nieuwe kandidaat voorgedragen voor {{vacature_titel}}', en: 'New candidate nominated for {{vacancy_title}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6D40F9, #14CDD3); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Nieuwe kandidaat!</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{opdrachtgever_naam}}</strong>,</p>
        <p style="color: #64748B;">Er is een nieuwe kandidaat voorgedragen voor <strong>{{vacature_titel}}</strong>.</p>
        <div style="background: #FAFBFE; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #1E293B; font-weight: 600; margin: 0 0 4px;">Kandidaat {{initialen}}</p>
          <p style="color: #64748B; margin: 0; font-size: 14px;">M-Score: <span style="color: #14CDD3; font-weight: 600;">{{m_score}}%</span> &middot; Harde criteria: {{hc_match}}%</p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #6D40F9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Bekijk kandidaat</a>
        </div>
      </div>
    </div>`,
  },
  {
    id: 5,
    name: { nl: 'Contract akkoord bevestiging', en: 'Contract approval confirmation' },
    recipientRole: { nl: 'Scout', en: 'Scout' },
    trigger: { nl: 'Opdrachtgever accepteert profiel', en: 'Employer accepts profile' },
    subject: { nl: 'Profiel ontgrendeld: {{kandidaat_naam}} voor {{vacature_titel}}', en: 'Profile unlocked: {{candidate_name}} for {{vacancy_title}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6D40F9, #14CDD3); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Profiel ontgrendeld!</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{scout_naam}}</strong>,</p>
        <p style="color: #64748B;">Goed nieuws! {{opdrachtgever_bedrijf}} heeft het profiel van <strong>{{kandidaat_naam}}</strong> ontgrendeld voor de functie {{vacature_titel}}.</p>
        <p style="color: #64748B;">De opdrachtgever kan nu contact opnemen om een gesprek in te plannen.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #6D40F9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Bekijk pipeline</a>
        </div>
      </div>
    </div>`,
  },
  {
    id: 6,
    name: { nl: 'Gespreksdatum herinnering', en: 'Interview date reminder' },
    recipientRole: { nl: 'Kandidaat, Scout', en: 'Candidate, Scout' },
    trigger: { nl: '24 uur voor gepland gesprek', en: '24 hours before scheduled interview' },
    subject: { nl: 'Morgen: gesprek bij {{bedrijf}} voor {{vacature_titel}}', en: 'Tomorrow: interview at {{company}} for {{vacancy_title}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6D40F9, #14CDD3); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Gesprek morgen</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{naam}}</strong>,</p>
        <p style="color: #64748B;">Dit is een herinnering dat er morgen een gesprek gepland staat:</p>
        <div style="background: #FAFBFE; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #1E293B; font-weight: 600; margin: 0;">{{vacature_titel}} bij {{bedrijf}}</p>
          <p style="color: #64748B; font-size: 14px; margin: 8px 0 0;">Datum: {{gesprek_datum}} &middot; Type: {{gesprek_type}}</p>
        </div>
        <p style="color: #64748B;">Veel succes!</p>
      </div>
    </div>`,
  },
  {
    id: 7,
    name: { nl: 'Nudge 1 — Vriendelijke herinnering', en: 'Nudge 1 — Friendly reminder' },
    recipientRole: { nl: 'Opdrachtgever', en: 'Employer' },
    trigger: { nl: 'Scout stuurt nudge (niveau 1)', en: 'Scout sends nudge (level 1)' },
    subject: { nl: 'Herinnering: plan het gesprek in voor {{vacature_titel}}', en: 'Reminder: schedule the interview for {{vacancy_title}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #f59e0b; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Vriendelijke herinnering</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{opdrachtgever_naam}}</strong>,</p>
        <p style="color: #64748B;">De Talent Scout vraagt of u het kennismakingsgesprek met kandidaat <strong>{{kandidaat_initialen}}</strong> voor <strong>{{vacature_titel}}</strong> deze week kunt inplannen.</p>
        <p style="color: #64748B;">Een snelle reactie wordt gewaardeerd door zowel de scout als de kandidaat.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #6D40F9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Gesprek plannen</a>
        </div>
      </div>
    </div>`,
  },
  {
    id: 8,
    name: { nl: 'Nudge 2 — Urgente herinnering', en: 'Nudge 2 — Urgent reminder' },
    recipientRole: { nl: 'Opdrachtgever', en: 'Employer' },
    trigger: { nl: 'Scout stuurt nudge (niveau 2)', en: 'Scout sends nudge (level 2)' },
    subject: { nl: 'Urgent: kandidaat wacht op reactie voor {{vacature_titel}}', en: 'Urgent: candidate awaiting response for {{vacancy_title}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #ef4444; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Urgente herinnering</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{opdrachtgever_naam}}</strong>,</p>
        <p style="color: #64748B;">Kandidaat <strong>{{kandidaat_initialen}}</strong> wacht al geruime tijd op een reactie voor de functie <strong>{{vacature_titel}}</strong>.</p>
        <p style="color: #ef4444; font-weight: 500;">Als er niet snel gereageerd wordt, kan de kandidaat afhaken of wordt het dossier geescaleerd naar Refurzy.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #6D40F9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Nu reageren</a>
        </div>
      </div>
    </div>`,
  },
  {
    id: 9,
    name: { nl: 'Escalatie naar Refurzy', en: 'Escalation to Refurzy' },
    recipientRole: { nl: 'Admin', en: 'Admin' },
    trigger: { nl: 'Na 2 onbeantwoorde nudges', en: 'After 2 unanswered nudges' },
    subject: { nl: 'Escalatie: geen reactie van {{bedrijf}} op {{vacature_titel}}', en: 'Escalation: no response from {{company}} on {{vacancy_title}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #dc2626; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Escalatie rapport</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;"><strong>Escalatie melding</strong></p>
        <p style="color: #64748B;">Scout <strong>{{scout_naam}}</strong> rapporteert dat <strong>{{bedrijf}}</strong> niet reageert op de voordracht voor {{vacature_titel}}.</p>
        <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #1E293B; font-size: 14px; margin: 0 0 4px;"><strong>Details:</strong></p>
          <p style="color: #64748B; font-size: 14px; margin: 0;">Nudge 1: {{nudge1_datum}} &middot; Nudge 2: {{nudge2_datum}}</p>
          <p style="color: #64748B; font-size: 14px; margin: 4px 0 0;">Kandidaat: {{kandidaat_initialen}} &middot; Dagen zonder reactie: {{dagen}}</p>
        </div>
        <p style="color: #64748B;">Actie vereist: bel opdrachtgever binnen 24 uur.</p>
      </div>
    </div>`,
  },
  {
    id: 10,
    name: { nl: 'Feedback na gesprek herinnering', en: 'Post-interview feedback reminder' },
    recipientRole: { nl: 'Opdrachtgever', en: 'Employer' },
    trigger: { nl: 'Gesprek afgerond, geen feedback na 48u', en: 'Interview completed, no feedback after 48h' },
    subject: { nl: 'Geef feedback over het gesprek met kandidaat {{initialen}}', en: 'Give feedback on the interview with candidate {{initials}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6D40F9, #14CDD3); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Feedback gevraagd</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{opdrachtgever_naam}}</strong>,</p>
        <p style="color: #64748B;">Heeft het gesprek met kandidaat <strong>{{initialen}}</strong> voor <strong>{{vacature_titel}}</strong> plaatsgevonden? Geef uw feedback zodat we het proces kunnen voortzetten.</p>
        <p style="color: #64748B;">Feedback is verplicht om door te gaan naar de volgende stap.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #6D40F9; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Feedback geven</a>
        </div>
      </div>
    </div>`,
  },
  {
    id: 11,
    name: { nl: 'Felicitatie contract getekend', en: 'Contract signed congratulations' },
    recipientRole: { nl: 'Opdrachtgever, Kandidaat, Scout', en: 'Employer, Candidate, Scout' },
    trigger: { nl: 'Arbeidsovereenkomst getekend', en: 'Employment contract signed' },
    subject: { nl: 'Gefeliciteerd! Contract getekend voor {{vacature_titel}}', en: 'Congratulations! Contract signed for {{vacancy_title}}' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #14CDD3, #6D40F9, #f59e0b); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
        <p style="font-size: 48px; margin: 0;">🎉</p>
        <h1 style="color: white; margin: 8px 0 0; font-size: 24px;">Gefeliciteerd!</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Het contract voor <strong>{{vacature_titel}}</strong> is getekend!</p>
        <p style="color: #64748B;">Dit is een bijzonder moment — een match gemaakt door wetenschap en menselijk inzicht.</p>
        <div style="background: #FAFBFE; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
          <p style="color: #1E293B; font-weight: 600; margin: 0;">M-Score: <span style="color: #14CDD3;">{{m_score}}%</span></p>
          <p style="color: #64748B; font-size: 14px; margin: 4px 0 0;">{{fit_garantie_tekst}}</p>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">3 versies: opdrachtgever (met factuurinfo), kandidaat (met startdatum), scout (met fee-overzicht).</p>
      </div>
    </div>`,
  },
  {
    id: 12,
    name: { nl: 'Fit Garantie check-in', en: 'Fit Guarantee check-in' },
    recipientRole: { nl: 'Opdrachtgever', en: 'Employer' },
    trigger: { nl: '3, 6 en 12 maanden na startdatum', en: '3, 6 and 12 months after start date' },
    subject: { nl: 'Fit Garantie check-in: hoe gaat het met {{kandidaat_naam}}?', en: 'Fit Guarantee check-in: how is {{candidate_name}} doing?' },
    bodyPreview: `<div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #14CDD3, #06BAFF); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Fit Garantie check-in</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">{{maanden}} maanden check-in</p>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #1E293B;">Hallo <strong>{{opdrachtgever_naam}}</strong>,</p>
        <p style="color: #64748B;"><strong>{{kandidaat_naam}}</strong> is nu {{maanden}} maanden werkzaam als {{vacature_titel}}. Hoe verloopt de samenwerking?</p>
        <p style="color: #64748B;">De Fit Garantie dekt vertrek binnen 12 maanden na startdatum — ook op eigen initiatief van de kandidaat. Uitsluitingen: afwijkende werkzaamheden, mismanagement of reorganisatie.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a style="background: #14CDD3; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Check-in invullen</a>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">Check-ins worden verstuurd op 3, 6 en 12 maanden na startdatum.</p>
      </div>
    </div>`,
  },
]

const roleColors: Record<string, string> = {
  // English keys
  'Candidate': 'bg-cyan/10 text-cyan-dark',
  'Scout': 'bg-purple/10 text-purple',
  'Employer': 'bg-orange/10 text-orange',
  'Admin': 'bg-red-100 text-red-700',
  'Employer, Candidate, Scout': 'bg-green-100 text-green-700',
  'Candidate, Scout': 'bg-blue-100 text-blue-700',
  // Dutch keys (backwards compat)
  'Kandidaat': 'bg-cyan/10 text-cyan-dark',
  'Opdrachtgever': 'bg-orange/10 text-orange',
  'Opdrachtgever, Kandidaat, Scout': 'bg-green-100 text-green-700',
  'Kandidaat, Scout': 'bg-blue-100 text-blue-700',
}

export default function EmailTemplatesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const { lang } = useLang()
  const t = texts[lang]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-muted mt-1">{t.subtitle(templates.length)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map(template => {
          const roleDisplay = template.recipientRole[lang]
          return (
            <div key={template.id}
              className={`bg-white rounded-xl border transition-all ${
                expandedId === template.id ? 'border-purple col-span-1 md:col-span-2 xl:col-span-3' : 'border-surface-border hover:border-purple/40'
              }`}>
              <div className="p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink-muted">{String(template.id).padStart(2, '0')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[roleDisplay] || 'bg-surface-muted text-ink-muted'}`}>
                      {roleDisplay}
                    </span>
                  </div>
                  <span className={`text-ink-muted transition-transform ${expandedId === template.id ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-ink mb-2">{template.name[lang]}</h3>
                <div className="space-y-1.5">
                  <p className="text-xs text-ink-muted">
                    <span className="font-medium text-ink-light">{t.triggerLabel}</span> {template.trigger[lang]}
                  </p>
                  <p className="text-xs text-ink-muted">
                    <span className="font-medium text-ink-light">{t.subjectLabel}</span> {template.subject[lang]}
                  </p>
                </div>
              </div>

              {expandedId === template.id && (
                <div className="border-t border-surface-border p-5">
                  <h4 className="text-sm font-medium text-ink mb-3">{t.previewLabel}</h4>
                  <div className="bg-surface-muted rounded-lg p-6 overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: template.bodyPreview }} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
