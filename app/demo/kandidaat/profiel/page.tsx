'use client'

import { useState } from 'react'
import { TAALNIVEAU_LABELS, VAKGEBIEDEN } from '@/lib/constants'
import type { TaalBeheersing } from '@/lib/types'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    title: 'Mijn Profiel',
    subtitle: 'Beheer je persoonlijke en professionele gegevens',
    // Sections
    personalData: 'Persoonlijke gegevens',
    professionalData: 'Professionele gegevens',
    preferredRoles: 'Voorkeursfuncties',
    preferredRolesDesc: 'Geef aan in welke functiegebieden en rollen je wilt werken. Dit helpt je scout om je bij de juiste vacatures voor te dragen.',
    preference1: 'Voorkeur 1',
    preference2: 'Voorkeur 2 (optioneel)',
    workPreferences: 'Werkvoorkeuren',
    cvSection: 'CV',
    availability: 'Beschikbaarheid',
    deleteAccount: 'Account verwijderen',
    // Fields
    name: 'Naam',
    email: 'Email',
    phone: 'Telefoon',
    city: 'Woonplaats',
    educationLevel: 'Opleidingsniveau',
    workExperience: 'Werkervaring',
    currentRole: 'Huidige functie',
    functiegebied: 'Functiegebied',
    functietitel: 'Functietitel',
    select: 'Selecteer...',
    salaryIndicator: 'Salarisindicatie (bruto/maand)',
    maxCommute: 'Maximale reistijd',
    office: 'Op kantoor',
    languages: 'Talen',
    // CV
    cvUploadText: 'Sleep je CV hierheen of klik om te uploaden',
    cvUploadSub: 'PDF, DOC of DOCX (max. 5MB)',
    cvUploaded: 'geupload op 5 maart 2026',
    // Save
    saveProfile: 'Profiel opslaan',
    // Availability
    availabilityDesc: 'Beheer je beschikbaarheidsstatus. Als je tijdelijk niet beschikbaar bent, kun je je profiel op pauze zetten. Je Talent Scout wordt hiervan op de hoogte gesteld en je wordt niet voorgedragen voor nieuwe vacatures.',
    profileReactivated: 'Profiel weer beschikbaar',
    profileReactivatedDesc: 'Je Talent Scout(s) hebben een melding ontvangen dat je weer beschikbaar bent voor vacatures.',
    availableForVacancies: 'Beschikbaar voor vacatures',
    availableDesc: 'Je kunt worden voorgedragen door je Talent Scout',
    pauseProfile: 'Pauzeer profiel',
    profilePaused: 'Profiel gepauzeerd',
    profilePausedDesc: 'Je wordt niet voorgedragen voor nieuwe vacatures. Je scout(s) zijn op de hoogte gesteld.',
    becomeAvailable: 'Weer beschikbaar',
    withdrawnProcesses: (count: number) => `Je hebt je teruggetrokken uit ${count} lopende proces${count > 1 ? 'sen' : ''}. De opdrachtgever(s) en scout(s) zijn hierover geinformeerd.`,
    // Delete account
    deleteAccountDesc: 'Je kunt je volledig terugtrekken uit Refurzy. Je profiel, Matching Scan resultaten en alle gegevens worden permanent verwijderd. Eventuele actieve processen in de pipeline worden geannuleerd. Dit kan niet ongedaan worden gemaakt.',
    deleteAccountBtn: 'Account verwijderen',
    // Pause modal
    pauseModalTitle: 'Profiel pauzeren',
    activeProcesses: (count: number) => `Je hebt ${count} lopende proces${count > 1 ? 'sen' : ''}`,
    chooseHowToPause: 'Kies hoe je wilt pauzeren:',
    pauseOnlyTitle: 'Pauzeer alleen voor nieuwe voordrachten',
    pauseOnlyDesc: 'Je lopende processen lopen gewoon door. Je wordt alleen niet meer voorgedragen op nieuwe vacatures. Scout(s) ontvangen een melding.',
    pauseAndWithdrawTitle: 'Trek je ook terug uit lopende processen',
    pauseAndWithdrawDesc: (count: number) => `Je wordt teruggetrokken uit alle ${count} lopende proces${count > 1 ? 'sen' : ''}. Opdrachtgever(s) en scout(s) ontvangen hierover een melding. Dit kan niet ongedaan worden gemaakt.`,
    cancel: 'Annuleren',
    // Company name in active process
    via: 'via',
  },
  en: {
    title: 'My Profile',
    subtitle: 'Manage your personal and professional details',
    // Sections
    personalData: 'Personal details',
    professionalData: 'Professional details',
    preferredRoles: 'Preferred roles',
    preferredRolesDesc: 'Indicate which job areas and roles you want to work in. This helps your scout nominate you for the right vacancies.',
    preference1: 'Preference 1',
    preference2: 'Preference 2 (optional)',
    workPreferences: 'Work preferences',
    cvSection: 'CV',
    availability: 'Availability',
    deleteAccount: 'Delete account',
    // Fields
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    city: 'City',
    educationLevel: 'Education level',
    workExperience: 'Work experience',
    currentRole: 'Current role',
    functiegebied: 'Job area',
    functietitel: 'Job title',
    select: 'Select...',
    salaryIndicator: 'Salary indication (gross/month)',
    maxCommute: 'Maximum commute',
    office: 'In office',
    languages: 'Languages',
    // CV
    cvUploadText: 'Drag your CV here or click to upload',
    cvUploadSub: 'PDF, DOC or DOCX (max. 5MB)',
    cvUploaded: 'uploaded on 5 March 2026',
    // Save
    saveProfile: 'Save profile',
    // Availability
    availabilityDesc: 'Manage your availability status. If you are temporarily unavailable, you can pause your profile. Your Talent Scout will be notified and you will not be nominated for new vacancies.',
    profileReactivated: 'Profile available again',
    profileReactivatedDesc: 'Your Talent Scout(s) have received a notification that you are available for vacancies again.',
    availableForVacancies: 'Available for vacancies',
    availableDesc: 'You can be nominated by your Talent Scout',
    pauseProfile: 'Pause profile',
    profilePaused: 'Profile paused',
    profilePausedDesc: 'You will not be nominated for new vacancies. Your scout(s) have been notified.',
    becomeAvailable: 'Available again',
    withdrawnProcesses: (count: number) => `You have withdrawn from ${count} active process${count > 1 ? 'es' : ''}. The employer(s) and scout(s) have been informed.`,
    // Delete account
    deleteAccountDesc: 'You can fully withdraw from Refurzy. Your profile, Matching Scan results and all data will be permanently deleted. Any active pipeline processes will be cancelled. This cannot be undone.',
    deleteAccountBtn: 'Delete account',
    // Pause modal
    pauseModalTitle: 'Pause profile',
    activeProcesses: (count: number) => `You have ${count} active process${count > 1 ? 'es' : ''}`,
    chooseHowToPause: 'Choose how you want to pause:',
    pauseOnlyTitle: 'Pause only for new nominations',
    pauseOnlyDesc: 'Your active processes continue normally. You will simply no longer be nominated for new vacancies. Scout(s) will receive a notification.',
    pauseAndWithdrawTitle: 'Also withdraw from active processes',
    pauseAndWithdrawDesc: (count: number) => `You will be withdrawn from all ${count} active process${count > 1 ? 'es' : ''}. Employer(s) and scout(s) will receive a notification. This cannot be undone.`,
    cancel: 'Cancel',
    // Company name in active process
    via: 'via',
  },
}

// Mock active pipeline processes for this candidate
const lopendeProcessen = [
  { id: 'lp-1', vacatureTitle: 'Marketing Manager', bedrijf: 'TechVentures B.V.', stap: 'Gesprek gepland', scout: 'Sophie de Graaf' },
  { id: 'lp-2', vacatureTitle: 'Brand Strategist', bedrijf: 'Anoniem', stap: 'Voorgedragen', scout: 'Sophie de Graaf' },
]

export default function KandidaatProfiel() {
  const { lang } = useLang()
  const t = texts[lang]

  const [beschikbaar, setBeschikbaar] = useState(true)
  const [showReactivatedBanner, setShowReactivatedBanner] = useState(false)
  const [showPauzeModal, setShowPauzeModal] = useState(false)
  const [teruggetrokkenProcessen, setTeruggetrokkenProcessen] = useState<Set<string>>(new Set())
  const [form, setForm] = useState({
    naam: 'Anna de Jong',
    email: 'anna.dejong@email.nl',
    telefoon: '06-12345678',
    woonplaats: 'Amsterdam',
    opleidingsniveau: 'WO',
    werkervaring: '8 jaar',
    huidigeRol: 'Senior Marketeer',
    voorkeursFunctiegebied1: 'Marketing & E-commerce',
    voorkeursFunctietitel1: 'Marketing Manager',
    voorkeursFunctiegebied2: 'Management & Directie',
    voorkeursFunctietitel2: 'Head of Marketing',
    salarisMin: '4500',
    salarisMax: '6000',
    maxReistijd: '45 minuten',
    opKantoor: 'Hybride (3 dagen)',
  })
  const [talen] = useState<TaalBeheersing[]>([
    { taal: 'Nederlands', niveau: 'C2' },
    { taal: 'Engels', niveau: 'B2' },
  ])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePauzeerClick = () => {
    const actieveProcessen = lopendeProcessen.filter(p => !teruggetrokkenProcessen.has(p.id))
    if (actieveProcessen.length > 0) {
      setShowPauzeModal(true)
    } else {
      setBeschikbaar(false)
      setShowReactivatedBanner(false)
    }
  }

  const handlePauzeerAlleen = () => {
    setBeschikbaar(false)
    setShowPauzeModal(false)
    setShowReactivatedBanner(false)
  }

  const handlePauzeerEnTerugtrekken = () => {
    setBeschikbaar(false)
    setShowPauzeModal(false)
    setShowReactivatedBanner(false)
    const actieveIds = lopendeProcessen.filter(p => !teruggetrokkenProcessen.has(p.id)).map(p => p.id)
    setTeruggetrokkenProcessen(prev => {
      const next = new Set(prev)
      actieveIds.forEach(id => next.add(id))
      return next
    })
  }

  const actieveProcessen = lopendeProcessen.filter(p => !teruggetrokkenProcessen.has(p.id))

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.title}</h1>
        <p className="text-ink-light font-medium mt-1">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">{t.personalData}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t.name} value={form.naam} onChange={(v) => handleChange('naam', v)} />
          <Field label={t.email} value={form.email} onChange={(v) => handleChange('email', v)} type="email" />
          <Field label={t.phone} value={form.telefoon} onChange={(v) => handleChange('telefoon', v)} />
          <Field label={t.city} value={form.woonplaats} onChange={(v) => handleChange('woonplaats', v)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">{t.professionalData}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">{t.educationLevel}</label>
            <select
              value={form.opleidingsniveau}
              onChange={(e) => handleChange('opleidingsniveau', e.target.value)}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50"
            >
              <option value="MBO">MBO</option>
              <option value="HBO">HBO</option>
              <option value="WO">WO</option>
            </select>
          </div>
          <Field label={t.workExperience} value={form.werkervaring} onChange={(v) => handleChange('werkervaring', v)} />
          <Field label={t.currentRole} value={form.huidigeRol} onChange={(v) => handleChange('huidigeRol', v)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">{t.preferredRoles}</h2>
        <p className="text-sm text-ink-light">{t.preferredRolesDesc}</p>
        <div className="bg-purple/5 border border-purple/15 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-purple uppercase tracking-wider">{t.preference1}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-ink-muted mb-1.5">{t.functiegebied}</label>
              <select value={form.voorkeursFunctiegebied1} onChange={(e) => handleChange('voorkeursFunctiegebied1', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-purple/50">
                <option value="">{t.select}</option>
                {VAKGEBIEDEN.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <Field label={t.functietitel} value={form.voorkeursFunctietitel1} onChange={(v) => handleChange('voorkeursFunctietitel1', v)} />
          </div>
        </div>
        <div className="bg-cyan/5 border border-cyan/15 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-cyan uppercase tracking-wider">{t.preference2}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-ink-muted mb-1.5">{t.functiegebied}</label>
              <select value={form.voorkeursFunctiegebied2} onChange={(e) => handleChange('voorkeursFunctiegebied2', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
                <option value="">{t.select}</option>
                {VAKGEBIEDEN.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <Field label={t.functietitel} value={form.voorkeursFunctietitel2} onChange={(v) => handleChange('voorkeursFunctietitel2', v)} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">{t.workPreferences}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-ink-muted mb-1.5">{t.salaryIndicator}</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">&euro;</span>
                <input type="number" value={form.salarisMin} onChange={(e) => handleChange('salarisMin', e.target.value)}
                  placeholder="min" className="w-full pl-8 pr-4 bg-surface-muted border border-surface-border rounded-lg py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
              </div>
              <span className="text-ink-muted">&ndash;</span>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">&euro;</span>
                <input type="number" value={form.salarisMax} onChange={(e) => handleChange('salarisMax', e.target.value)}
                  placeholder="max" className="w-full pl-8 pr-4 bg-surface-muted border border-surface-border rounded-lg py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">{t.maxCommute}</label>
            <select value={form.maxReistijd} onChange={(e) => handleChange('maxReistijd', e.target.value)}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
              <option>15 minuten</option>
              <option>30 minuten</option>
              <option>45 minuten</option>
              <option>60 minuten</option>
              <option>90 minuten</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">{t.office}</label>
            <select value={form.opKantoor} onChange={(e) => handleChange('opKantoor', e.target.value)}
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
              <option>Op kantoor (5 dagen)</option>
              <option>Hybride (4 dagen)</option>
              <option>Hybride (3 dagen)</option>
              <option>Hybride (2 dagen)</option>
              <option>Hybride (1 dag)</option>
              <option>Volledig remote</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-ink-muted mb-1.5">{t.languages}</label>
            <div className="space-y-2">
              {talen.map((tl, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-surface-muted border border-surface-border rounded-lg text-sm text-ink">
                  <span className="font-medium">{tl.taal}</span>
                  <span className="text-ink-muted">&mdash;</span>
                  <span>{tl.niveau} ({TAALNIVEAU_LABELS[tl.niveau]})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink">{t.cvSection}</h2>
        <div className="border-2 border-dashed border-surface-border rounded-xl p-8 text-center">
          <div className="text-ink-muted space-y-2">
            <p className="text-3xl">&#128196;</p>
            <p className="text-sm">{t.cvUploadText}</p>
            <p className="text-xs text-ink-muted">{t.cvUploadSub}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-400">&#10003;</span>
          <span className="text-ink-light">CV_Anna_de_Jong_2026.pdf</span>
          <span className="text-ink-muted">{t.cvUploaded}</span>
        </div>
      </div>

      <button className="px-6 py-3 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors">
        {t.saveProfile}
      </button>

      {/* Beschikbaarheid & Account */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-5">
        <h2 className="text-lg font-semibold text-ink">{t.availability}</h2>
        <p className="text-ink-light text-sm">{t.availabilityDesc}</p>

        {showReactivatedBanner && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-green-600 text-lg mt-0.5">&#10003;</span>
            <div className="flex-1">
              <p className="text-green-800 font-semibold text-sm">{t.profileReactivated}</p>
              <p className="text-green-700 text-xs mt-0.5">{t.profileReactivatedDesc}</p>
            </div>
            <button onClick={() => setShowReactivatedBanner(false)} className="text-green-400 hover:text-green-600 text-sm">&times;</button>
          </div>
        )}

        {beschikbaar ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <div>
                <p className="text-ink font-medium text-sm">{t.availableForVacancies}</p>
                <p className="text-ink-muted text-xs">{t.availableDesc}</p>
              </div>
            </div>
            <button
              onClick={handlePauzeerClick}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all"
            >
              {t.pauseProfile}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <div>
                  <p className="text-ink font-medium text-sm">{t.profilePaused}</p>
                  <p className="text-ink-muted text-xs">{t.profilePausedDesc}</p>
                </div>
              </div>
              <button
                onClick={() => { setBeschikbaar(true); setShowReactivatedBanner(true) }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all"
              >
                {t.becomeAvailable}
              </button>
            </div>
            {teruggetrokkenProcessen.size > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-700 text-xs font-medium">{t.withdrawnProcesses(teruggetrokkenProcessen.size)}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink">{t.deleteAccount}</h2>
        <p className="text-ink-light text-sm">{t.deleteAccountDesc}</p>
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all">
          {t.deleteAccountBtn}
        </button>
      </div>

      {/* Pauzeer modal met lopende processen */}
      {showPauzeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-border w-full max-w-lg mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">{t.pauseModalTitle}</h3>
              <button
                onClick={() => setShowPauzeModal(false)}
                className="text-ink-muted hover:text-ink text-xl transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 text-lg">&#9888;</span>
                <p className="text-amber-800 font-semibold text-sm">{t.activeProcesses(actieveProcessen.length)}</p>
              </div>
              <div className="space-y-2">
                {actieveProcessen.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                    <div>
                      <p className="text-ink font-medium text-sm">{p.vacatureTitle}</p>
                      <p className="text-ink-muted text-xs">{p.bedrijf} &middot; {t.via} {p.scout}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple/10 text-purple">{p.stap}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-ink-light text-sm">{t.chooseHowToPause}</p>

            <div className="space-y-3">
              <button
                onClick={handlePauzeerAlleen}
                className="w-full text-left p-4 rounded-xl border-2 border-surface-border hover:border-cyan/50 transition-all space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyan font-bold text-sm">&#10004;</span>
                  <p className="text-ink font-semibold text-sm">{t.pauseOnlyTitle}</p>
                </div>
                <p className="text-ink-muted text-xs pl-6">{t.pauseOnlyDesc}</p>
              </button>

              <button
                onClick={handlePauzeerEnTerugtrekken}
                className="w-full text-left p-4 rounded-xl border-2 border-surface-border hover:border-red-300 transition-all space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold text-sm">&times;</span>
                  <p className="text-ink font-semibold text-sm">{t.pauseAndWithdrawTitle}</p>
                </div>
                <p className="text-ink-muted text-xs pl-6">{t.pauseAndWithdrawDesc(actieveProcessen.length)}</p>
              </button>
            </div>

            <button
              onClick={() => setShowPauzeModal(false)}
              className="w-full py-2 text-sm text-ink-light hover:text-ink transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm text-ink-muted mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50"
      />
    </div>
  )
}
