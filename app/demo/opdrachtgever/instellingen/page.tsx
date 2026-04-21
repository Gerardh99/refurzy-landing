'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LANDEN } from '@/lib/constants'
import { useLang } from '@/lib/i18n'

// ─── Types ──────────────────────────────────────────────────────────────────
type Tab = 'bedrijf' | 'team' | 'betaling' | 'beveiliging'
type TeamRole = 'owner' | 'admin' | 'gebruiker'

type TeamMember = {
  id: string
  naam: string
  email: string
  role: TeamRole
  toegevoegd: string
}

type Invite = {
  id: string
  email: string
  role: 'admin' | 'gebruiker'
  verloopt: string
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const mockMembers: TeamMember[] = [
  { id: '1', naam: 'Gerard Hoedjes', email: 'gerard@techcorp.nl', role: 'owner', toegevoegd: '2026-01-15' },
  { id: '2', naam: 'Lisa van Dijk', email: 'lisa@techcorp.nl', role: 'admin', toegevoegd: '2026-02-03' },
  { id: '3', naam: 'Mark de Boer', email: 'mark@techcorp.nl', role: 'gebruiker', toegevoegd: '2026-02-20' },
  { id: '4', naam: 'Sophie Jansen', email: 'sophie@techcorp.nl', role: 'gebruiker', toegevoegd: '2026-03-01' },
]

const mockInvites: Invite[] = [
  { id: 'inv-1', email: 'jan@techcorp.nl', role: 'gebruiker', verloopt: '2026-03-26' },
]

// ─── Texts ───────────────────────────────────────────────────────────────────

const texts = {
  nl: {
    backToDashboard: '← Terug naar dashboard',
    pageTitle: 'Instellingen',
    pageSubtitle: 'Beheer uw bedrijfsprofiel, team en betaalgegevens',
    tabs: {
      bedrijf: 'Bedrijf',
      team: 'Team',
      betaling: 'Betaling',
      beveiliging: 'Beveiliging',
    },
    // Bedrijf tab
    companyDataTitle: 'Bedrijfsgegevens',
    labelCompanyName: 'Bedrijfsnaam',
    labelKvk: 'KVK-nummer',
    labelAddress: 'Adres',
    labelPostcodeCity: 'Postcode & Plaats',
    labelCountry: 'Land',
    labelCountryNote: 'Dit land wordt standaard ingesteld bij nieuwe vacatures',
    labelWebsite: 'Website',
    labelPhone: 'Telefoonnummer',
    companyProfileTitle: 'Bedrijfsprofiel',
    companyProfileNote: 'Deze informatie wordt getoond bij uw vacatures',
    labelIndustry: 'Branche',
    labelSize: 'Bedrijfsgrootte',
    industryOptions: ['IT & Software', 'Finance & Banking', 'Zorg & Welzijn', 'Bouw & Techniek', 'Retail & E-commerce', 'Onderwijs', 'Overheid', 'Consultancy', 'Logistiek & Transport', 'Marketing & Communicatie', 'Anders'],
    sizeOptions: [
      { value: '1-10', label: '1 - 10 medewerkers' },
      { value: '11-50', label: '11 - 50 medewerkers' },
      { value: '50-200', label: '50 - 200 medewerkers' },
      { value: '200-1000', label: '200 - 1.000 medewerkers' },
      { value: '1000+', label: '1.000+ medewerkers' },
    ],
    labelCulture: 'Bedrijfscultuur',
    culturePlaceholder: 'Bijv. informeel, resultaatgericht, teamwork',
    aboutTitle: 'Over uw bedrijf',
    aboutNote: 'Vertel kandidaten wat uw bedrijf uniek maakt',
    aboutPlaceholder: 'Beschrijf uw bedrijf, missie, cultuur en wat u een aantrekkelijke werkgever maakt...',
    markdownSupported: 'Markdown wordt ondersteund',
    logoTitle: 'Bedrijfslogo',
    logoUpload: 'Logo uploaden',
    logoNote: 'PNG, JPG of SVG. Max 2MB. Aanbevolen: 400×400px',
    saveChanges: 'Wijzigingen opslaan',
    // Team tab
    teamMembersTitle: 'Teamleden',
    teamMembersNote: 'Beheer wie toegang heeft tot uw bedrijfsaccount',
    inviteTeamMember: '+ Teamlid uitnodigen',
    usersIncluded: (n: number) => `${n} van 5 gebruikers inbegrepen`,
    extraUsersNote: 'Extra gebruikers kunnen worden uitgenodigd voor €15/maand per gebruiker (ex. 21% BTW).',
    rolesLabel: 'Rollen:',
    roleOwnerDesc: '= volledige controle + eigenaarschap overdragen',
    roleAdminDesc: '= team & bedrijfsgegevens beheren',
    roleUserDesc: '= eigen vacatures schrijven & beheren',
    colName: 'Naam',
    colEmail: 'E-mail',
    colRole: 'Rol',
    colAdded: 'Toegevoegd',
    colActions: 'Acties',
    transferOwnership: '⇄ Overdragen',
    deleteTitle: 'Verwijderen',
    pendingInvites: 'Openstaande uitnodigingen',
    colExpires: 'Verloopt op',
    colAction: 'Actie',
    revoke: 'Intrekken',
    roleLabels: { owner: '👑 Owner', admin: '🛡 Admin', gebruiker: '👤 Gebruiker' },
    // Invite modal
    inviteTitle: 'Teamlid uitnodigen',
    inviteSubtitle: 'Stuur een uitnodiging per e-mail. De link is 7 dagen geldig.',
    emailLabel: 'E-mailadres',
    emailPlaceholder: 'naam@bedrijf.nl',
    roleLabel: 'Rol',
    adminRoleDesc: 'Kan team en bedrijfsgegevens beheren, betaalgegevens aanpassen',
    userRoleDesc: 'Kan eigen vacatures schrijven en kandidaten beheren',
    cancel: 'Annuleren',
    sendInvite: '✉️ Uitnodiging versturen',
    // Transfer modal
    transferTitle: 'Eigenaarschap overdragen',
    transferWarning: 'na de overdracht wordt u zelf admin en kan alleen de nieuwe eigenaar dit terugdraaien.',
    transferWarningBold: 'Let op:',
    newOwnerLabel: 'Nieuwe eigenaar',
    newOwnerPlaceholder: 'Selecteer een teamlid...',
    confirmPasswordLabel: 'Bevestig met uw wachtwoord',
    confirmPasswordPlaceholder: 'Uw huidige wachtwoord',
    transferBtn: '⇄ Eigenaarschap overdragen',
    // Betaling tab
    currentPlanTitle: 'Huidig plan',
    perMonth: 'per maand (ex. BTW)',
    usersIncludedLabel: 'gebruikers inbegrepen',
    vacanciesLabel: 'vacatures',
    paymentMethodTitle: 'Betaalmethode',
    cardExpires: 'Verloopt',
    change: 'Wijzigen',
    invoiceDataTitle: 'Factuurgegevens',
    invoiceName: 'Bedrijfsnaam',
    vatNumber: 'BTW-nummer',
    invoiceAddress: 'Factuuradres',
    invoiceEmail: 'Facturatie e-mail',
    recentInvoicesTitle: 'Recente facturen',
    invoiceStatusPaid: 'Betaald',
    // Beveiliging tab
    twoFATitle: 'Tweestapsverificatie (2FA)',
    twoFADesc: 'Voeg een extra beveiligingslaag toe aan je account met een authenticator app.',
    twoFAActive: 'Tweestapsverificatie is actief',
    twoFAActiveDesc: 'Je account is extra beveiligd met 2FA.',
    disable: 'Uitschakelen',
    twoFAInactive: 'Tweestapsverificatie is niet actief',
    twoFAInactiveDesc: 'Activeer 2FA om je account beter te beveiligen.',
    activate: 'Activeren',
    step1Title: 'Stap 1: Scan de QR-code',
    step1ScanHint: 'Scan deze QR-code met je authenticator app',
    step1UseApps: 'Gebruik een van deze apps:',
    step1ManualCode: 'Of voer deze code handmatig in',
    step2Title: 'Stap 2: Voer de verificatiecode in',
    confirm: 'Bevestigen',
    demoHint: 'Demo: voer een willekeurige 6-cijferige code in',
  },
  en: {
    backToDashboard: '← Back to dashboard',
    pageTitle: 'Settings',
    pageSubtitle: 'Manage your company profile, team and payment details',
    tabs: {
      bedrijf: 'Company',
      team: 'Team',
      betaling: 'Payment',
      beveiliging: 'Security',
    },
    // Bedrijf tab
    companyDataTitle: 'Company details',
    labelCompanyName: 'Company name',
    labelKvk: 'Chamber of Commerce number',
    labelAddress: 'Address',
    labelPostcodeCity: 'Postcode & City',
    labelCountry: 'Country',
    labelCountryNote: 'This country is set by default for new vacancies',
    labelWebsite: 'Website',
    labelPhone: 'Phone number',
    companyProfileTitle: 'Company profile',
    companyProfileNote: 'This information is shown on your vacancies',
    labelIndustry: 'Industry',
    labelSize: 'Company size',
    industryOptions: ['IT & Software', 'Finance & Banking', 'Healthcare & Welfare', 'Construction & Technology', 'Retail & E-commerce', 'Education', 'Government', 'Consultancy', 'Logistics & Transport', 'Marketing & Communications', 'Other'],
    sizeOptions: [
      { value: '1-10', label: '1 - 10 employees' },
      { value: '11-50', label: '11 - 50 employees' },
      { value: '50-200', label: '50 - 200 employees' },
      { value: '200-1000', label: '200 - 1,000 employees' },
      { value: '1000+', label: '1,000+ employees' },
    ],
    labelCulture: 'Company culture',
    culturePlaceholder: 'E.g. informal, results-oriented, teamwork',
    aboutTitle: 'About your company',
    aboutNote: 'Tell candidates what makes your company unique',
    aboutPlaceholder: 'Describe your company, mission, culture and what makes you an attractive employer...',
    markdownSupported: 'Markdown is supported',
    logoTitle: 'Company logo',
    logoUpload: 'Upload logo',
    logoNote: 'PNG, JPG or SVG. Max 2MB. Recommended: 400×400px',
    saveChanges: 'Save changes',
    // Team tab
    teamMembersTitle: 'Team members',
    teamMembersNote: 'Manage who has access to your company account',
    inviteTeamMember: '+ Invite team member',
    usersIncluded: (n: number) => `${n} of 5 users included`,
    extraUsersNote: 'Additional users can be invited for €15/month per user (excl. 21% VAT).',
    rolesLabel: 'Roles:',
    roleOwnerDesc: '= full control + transfer ownership',
    roleAdminDesc: '= manage team & company details',
    roleUserDesc: '= write & manage own vacancies',
    colName: 'Name',
    colEmail: 'Email',
    colRole: 'Role',
    colAdded: 'Added',
    colActions: 'Actions',
    transferOwnership: '⇄ Transfer',
    deleteTitle: 'Delete',
    pendingInvites: 'Pending invitations',
    colExpires: 'Expires on',
    colAction: 'Action',
    revoke: 'Revoke',
    roleLabels: { owner: '👑 Owner', admin: '🛡 Admin', gebruiker: '👤 User' },
    // Invite modal
    inviteTitle: 'Invite team member',
    inviteSubtitle: 'Send an invitation by email. The link is valid for 7 days.',
    emailLabel: 'Email address',
    emailPlaceholder: 'name@company.com',
    roleLabel: 'Role',
    adminRoleDesc: 'Can manage team and company details, adjust payment information',
    userRoleDesc: 'Can write vacancies and manage candidates',
    cancel: 'Cancel',
    sendInvite: '✉️ Send invitation',
    // Transfer modal
    transferTitle: 'Transfer ownership',
    transferWarning: 'after the transfer you will become admin yourself and only the new owner can reverse this.',
    transferWarningBold: 'Note:',
    newOwnerLabel: 'New owner',
    newOwnerPlaceholder: 'Select a team member...',
    confirmPasswordLabel: 'Confirm with your password',
    confirmPasswordPlaceholder: 'Your current password',
    transferBtn: '⇄ Transfer ownership',
    // Betaling tab
    currentPlanTitle: 'Current plan',
    perMonth: 'per month (excl. VAT)',
    usersIncludedLabel: 'users included',
    vacanciesLabel: 'vacancies',
    paymentMethodTitle: 'Payment method',
    cardExpires: 'Expires',
    change: 'Change',
    invoiceDataTitle: 'Invoice details',
    invoiceName: 'Company name',
    vatNumber: 'VAT number',
    invoiceAddress: 'Invoice address',
    invoiceEmail: 'Billing email',
    recentInvoicesTitle: 'Recent invoices',
    invoiceStatusPaid: 'Paid',
    // Beveiliging tab
    twoFATitle: 'Two-factor authentication (2FA)',
    twoFADesc: 'Add an extra security layer to your account with an authenticator app.',
    twoFAActive: 'Two-factor authentication is active',
    twoFAActiveDesc: 'Your account is additionally secured with 2FA.',
    disable: 'Disable',
    twoFAInactive: 'Two-factor authentication is inactive',
    twoFAInactiveDesc: 'Activate 2FA to better secure your account.',
    activate: 'Activate',
    step1Title: 'Step 1: Scan the QR code',
    step1ScanHint: 'Scan this QR code with your authenticator app',
    step1UseApps: 'Use one of these apps:',
    step1ManualCode: 'Or enter this code manually',
    step2Title: 'Step 2: Enter the verification code',
    confirm: 'Confirm',
    demoHint: 'Demo: enter any 6-digit code',
  },
}

// ─── Role badge ─────────────────────────────────────────────────────────────
function RoleBadge({ role, labels }: { role: TeamRole; labels: { owner: string; admin: string; gebruiker: string } }) {
  const styles: Record<TeamRole, string> = {
    owner: 'bg-purple/15 text-purple border-purple/30',
    admin: 'bg-cyan/15 text-cyan border-cyan/30',
    gebruiker: 'bg-gray-500/15 text-ink-light border-gray-500/30',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${styles[role]}`}>
      {labels[role]}
    </span>
  )
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ═══════════════════════════════════════════════════════════════════════════
export default function InstellingenPage() {
  const { lang } = useLang()
  const t = texts[lang]

  const [activeTab, setActiveTab] = useState<Tab>('bedrijf')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'bedrijf', label: t.tabs.bedrijf, icon: '🏢' },
    { key: 'team', label: t.tabs.team, icon: '👥' },
    { key: 'betaling', label: t.tabs.betaling, icon: '💳' },
    { key: 'beveiliging', label: t.tabs.beveiliging, icon: '🛡' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          {t.backToDashboard}
        </Link>
        <h1 className="text-2xl font-bold text-ink mt-3">{t.pageTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.pageSubtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-surface-border w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-purple/15 text-cyan border border-surface-border'
                : 'text-ink-light hover:text-ink hover:bg-surface-muted'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'bedrijf' && <BedrijfTab t={t} />}
      {activeTab === 'team' && (
        <TeamTab
          t={t}
          inviteModalOpen={inviteModalOpen}
          setInviteModalOpen={setInviteModalOpen}
          transferModalOpen={transferModalOpen}
          setTransferModalOpen={setTransferModalOpen}
        />
      )}
      {activeTab === 'betaling' && <BetalingTab t={t} />}
      {activeTab === 'beveiliging' && <BeveiligingTab t={t} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB: Bedrijf
// ═══════════════════════════════════════════════════════════════════════════
function BedrijfTab({ t }: { t: typeof texts['nl'] }) {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Bedrijfsgegevens */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-6">{t.companyDataTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelCompanyName}</label>
            <input type="text" defaultValue="TechCorp Solutions B.V." className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelKvk}</label>
            <input type="text" defaultValue="12345678" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelAddress}</label>
            <input type="text" defaultValue="Herengracht 182" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelPostcodeCity}</label>
            <input type="text" defaultValue="1016 BR Amsterdam" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelCountry}</label>
            <select defaultValue="Nederland" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
              {LANDEN.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <p className="text-xs text-ink-muted mt-1">{t.labelCountryNote}</p>
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelWebsite}</label>
            <input type="text" defaultValue="https://techcorp.nl" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelPhone}</label>
            <input type="text" defaultValue="+31 20 123 4567" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
        </div>
      </div>

      {/* Bedrijfsprofiel */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-2">{t.companyProfileTitle}</h2>
        <p className="text-ink-muted text-xs mb-6">{t.companyProfileNote}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelIndustry}</label>
            <select defaultValue="IT & Software" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
              {t.industryOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelSize}</label>
            <select defaultValue="50-200" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
              {t.sizeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-ink-muted mb-1.5 block">{t.labelCulture}</label>
            <input type="text" defaultValue="Informeel, innovatief, hybride werken" placeholder={t.culturePlaceholder} className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
        </div>
      </div>

      {/* Over uw bedrijf */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-2">{t.aboutTitle}</h2>
        <p className="text-ink-muted text-xs mb-4">{t.aboutNote}</p>
        <textarea
          rows={5}
          defaultValue="TechCorp Solutions is een snelgroeiend technologiebedrijf dat gespecialiseerd is in AI-gedreven HR-oplossingen. Wij geloven in de kracht van data om betere beslissingen te nemen. Ons team van 120 professionals werkt vanuit Amsterdam en remote aan innovatieve producten die de toekomst van werk vormgeven."
          className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted resize-none"
          placeholder={t.aboutPlaceholder}
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-ink-muted">{t.markdownSupported}</span>
          <span className="text-xs text-ink-muted">348 / 1000 tekens</span>
        </div>
      </div>

      {/* Logo upload */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-4">{t.logoTitle}</h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-surface-muted border-2 border-dashed border-surface-border flex items-center justify-center text-ink-muted">
            <span className="text-3xl">🏢</span>
          </div>
          <div>
            <button className="bg-purple/15 text-purple px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple/25 transition-colors border border-surface-border">
              {t.logoUpload}
            </button>
            <p className="text-xs text-ink-muted mt-2">{t.logoNote}</p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
          {t.saveChanges}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB: Team
// ═══════════════════════════════════════════════════════════════════════════
function TeamTab({
  t,
  inviteModalOpen,
  setInviteModalOpen,
  transferModalOpen,
  setTransferModalOpen,
}: {
  t: typeof texts['nl']
  inviteModalOpen: boolean
  setInviteModalOpen: (v: boolean) => void
  transferModalOpen: boolean
  setTransferModalOpen: (v: boolean) => void
}) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header met invite knop */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-ink font-semibold">{t.teamMembersTitle}</h2>
          <p className="text-ink-muted text-xs mt-1">{t.teamMembersNote}</p>
        </div>
        <button
          onClick={() => setInviteModalOpen(true)}
          className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>+</span> {t.inviteTeamMember.replace('+ ', '')}
        </button>
      </div>

      {/* Gebruikers indicator */}
      <div className="bg-white rounded-2xl border border-surface-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-light flex items-center gap-2">
            <span>👥</span> {t.usersIncluded(4)}
          </span>
          <span className="text-xs text-ink-muted">4 / 5</span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan via-blue to-purple transition-all duration-500" style={{ width: '80%' }} />
        </div>
        <p className="text-xs text-ink-muted mt-2">{t.extraUsersNote}</p>
      </div>

      {/* Rollen uitleg */}
      <div className="bg-white rounded-2xl border border-surface-border p-4">
        <div className="flex items-center gap-6 text-xs text-ink-light">
          <span className="font-semibold text-ink">{t.rolesLabel}</span>
          <span><span className="text-purple font-medium">Owner</span> {t.roleOwnerDesc}</span>
          <span><span className="text-cyan font-medium">Admin</span> {t.roleAdminDesc}</span>
          <span><span className="text-ink-light font-medium">{t.tabs.team === 'Team' ? 'User' : 'Gebruiker'}</span> {t.roleUserDesc}</span>
        </div>
      </div>

      {/* Members tabel */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_2fr_1.2fr_1.2fr_1.5fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
          <div>{t.colName}</div>
          <div>{t.colEmail}</div>
          <div>{t.colRole}</div>
          <div>{t.colAdded}</div>
          <div className="text-right">{t.colActions}</div>
        </div>

        {mockMembers.map(member => (
          <div key={member.id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.2fr_1.2fr_1.5fr] gap-2 px-6 py-4 border-b border-surface-border items-center hover:bg-surface-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center text-purple font-bold text-xs">
                {member.naam.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className="text-ink font-medium text-sm">{member.naam}</span>
            </div>
            <div className="text-ink-muted text-sm">{member.email}</div>
            <div><RoleBadge role={member.role} labels={t.roleLabels} /></div>
            <div className="text-ink-muted text-sm">{formatDate(member.toegevoegd)}</div>
            <div className="flex justify-end gap-2">
              {member.role === 'owner' ? (
                <button
                  onClick={() => setTransferModalOpen(true)}
                  className="text-xs text-purple hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  {t.transferOwnership}
                </button>
              ) : (
                <>
                  <select
                    defaultValue={member.role}
                    className="bg-surface-muted border border-surface-border rounded-lg px-2 py-1 text-xs text-ink-light focus:outline-none focus:border-cyan/50"
                  >
                    <option value="admin">Admin</option>
                    <option value="gebruiker">{t.roleLabels.gebruiker.replace('👤 ', '')}</option>
                  </select>
                  <button className="rounded-lg p-1.5 text-ink-muted hover:bg-red-500/10 hover:text-red-400 transition-colors" title={t.deleteTitle}>
                    🗑
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Openstaande uitnodigingen */}
      {mockInvites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-ink font-semibold">
            {t.pendingInvites} <span className="text-ink-muted font-normal text-sm">({mockInvites.length})</span>
          </h3>
          <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
              <div>{t.colEmail}</div>
              <div>{t.colRole}</div>
              <div>{t.colExpires}</div>
              <div className="text-right">{t.colAction}</div>
            </div>
            {mockInvites.map(invite => (
              <div key={invite.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-6 py-4 border-b border-surface-border items-center">
                <div className="flex items-center gap-2 text-ink-light text-sm">
                  <span>✉️</span> {invite.email}
                </div>
                <div><RoleBadge role={invite.role} labels={t.roleLabels} /></div>
                <div className="text-ink-muted text-sm">{formatDate(invite.verloopt)}</div>
                <div className="text-right">
                  <button className="text-xs text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">
                    {t.revoke}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Invite modal ─────────────────────────────────────── */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-surface-border p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-ink mb-2">{t.inviteTitle}</h3>
            <p className="text-ink-light font-medium text-sm mb-6">{t.inviteSubtitle}</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-ink-muted mb-1.5 block">{t.emailLabel}</label>
                <input type="email" placeholder={t.emailPlaceholder} className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
              </div>

              <div>
                <label className="text-xs text-ink-muted mb-3 block">{t.roleLabel}</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 rounded-xl border border-cyan/20 bg-cyan/5 p-4 cursor-pointer">
                    <input type="radio" name="invite-role" value="admin" className="mt-0.5 accent-cyan" />
                    <div>
                      <div className="text-sm font-medium text-ink">Admin</div>
                      <div className="text-xs text-ink-muted">{t.adminRoleDesc}</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 rounded-xl border border-surface-border bg-purple/5 p-4 cursor-pointer">
                    <input type="radio" name="invite-role" value="gebruiker" defaultChecked className="mt-0.5 accent-purple" />
                    <div>
                      <div className="text-sm font-medium text-ink">{t.roleLabels.gebruiker.replace('👤 ', '')}</div>
                      <div className="text-xs text-ink-muted">{t.userRoleDesc}</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1 bg-surface-muted border border-surface-border text-ink-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-ink transition-colors"
                >
                  {t.cancel}
                </button>
                <button className="flex-1 bg-gradient-to-r from-cyan via-blue to-purple text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  {t.sendInvite}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Transfer modal ───────────────────────────────────── */}
      {transferModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-surface-border p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-ink mb-2">{t.transferTitle}</h3>

            <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-6">
              <p className="text-sm text-orange">
                <strong>{t.transferWarningBold}</strong> {t.transferWarning}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-ink-muted mb-1.5 block">{t.newOwnerLabel}</label>
                <select className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
                  <option value="">{t.newOwnerPlaceholder}</option>
                  {mockMembers.filter(m => m.role !== 'owner').map(m => (
                    <option key={m.id} value={m.id}>{m.naam} — {m.role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-ink-muted mb-1.5 block">{t.confirmPasswordLabel}</label>
                <input type="password" placeholder={t.confirmPasswordPlaceholder} className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setTransferModalOpen(false)}
                  className="flex-1 bg-surface-muted border border-surface-border text-ink-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-ink transition-colors"
                >
                  {t.cancel}
                </button>
                <button className="flex-1 bg-purple/20 text-purple px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple/30 transition-colors border border-purple/30">
                  {t.transferBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB: Betaling
// ═══════════════════════════════════════════════════════════════════════════
function BetalingTab({ t }: { t: typeof texts['nl'] }) {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Huidig plan */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-ink font-semibold">{t.currentPlanTitle}</h2>
          <span className="px-3 py-1 bg-cyan/15 text-cyan rounded-lg text-xs font-bold border border-cyan/20">PROFESSIONAL</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-muted rounded-xl border border-surface-border p-4 text-center">
            <div className="text-2xl font-bold text-ink">€299</div>
            <div className="text-xs text-ink-muted mt-1">{t.perMonth}</div>
          </div>
          <div className="bg-surface-muted rounded-xl border border-surface-border p-4 text-center">
            <div className="text-2xl font-bold text-ink">5</div>
            <div className="text-xs text-ink-muted mt-1">{t.usersIncludedLabel}</div>
          </div>
          <div className="bg-surface-muted rounded-xl border border-surface-border p-4 text-center">
            <div className="text-2xl font-bold text-ink">∞</div>
            <div className="text-xs text-ink-muted mt-1">{t.vacanciesLabel}</div>
          </div>
        </div>
      </div>

      {/* Betaalmethode */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-4">{t.paymentMethodTitle}</h2>
        <div className="flex items-center gap-4 bg-surface-muted rounded-xl border border-surface-border p-4">
          <div className="w-12 h-8 rounded bg-gradient-to-r from-blue to-purple flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
          <div>
            <div className="text-ink text-sm font-medium">•••• •••• •••• 4242</div>
            <div className="text-xs text-ink-muted">{t.cardExpires} 12/2028</div>
          </div>
          <button className="ml-auto text-xs text-purple hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors border border-surface-border">
            {t.change}
          </button>
        </div>
      </div>

      {/* Factuurgegevens */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-4">{t.invoiceDataTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.invoiceName}</label>
            <input type="text" defaultValue="TechCorp Solutions B.V." className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" readOnly />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.vatNumber}</label>
            <input type="text" defaultValue="NL123456789B01" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.invoiceAddress}</label>
            <input type="text" defaultValue="Herengracht 182" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">{t.invoiceEmail}</label>
            <input type="text" defaultValue="facturen@techcorp.nl" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
          </div>
        </div>
      </div>

      {/* Factuurhistorie */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-4">{t.recentInvoicesTitle}</h2>
        <div className="space-y-2">
          {[
            { datum: '01-03-2026', bedrag: '€299,00', status: t.invoiceStatusPaid },
            { datum: '01-02-2026', bedrag: '€299,00', status: t.invoiceStatusPaid },
            { datum: '01-01-2026', bedrag: '€299,00', status: t.invoiceStatusPaid },
          ].map((factuur, i) => (
            <div key={i} className="flex items-center justify-between bg-surface-muted rounded-xl border border-surface-border p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-ink-light">{factuur.datum}</span>
                <span className="text-sm text-ink font-medium">{factuur.bedrag}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">{factuur.status}</span>
                <button className="text-xs text-purple hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors">
                  📄 PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
          {t.saveChanges}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB: Beveiliging
// ═══════════════════════════════════════════════════════════════════════════
function BeveiligingTab({ t }: { t: typeof texts['nl'] }) {
  const [twoFAActive, setTwoFAActive] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [totpCode, setTotpCode] = useState('')

  const handleActivate = () => {
    if (totpCode.length === 6) {
      setTwoFAActive(true)
      setShowSetup(false)
      setTotpCode('')
    }
  }

  const handleDeactivate = () => {
    setTwoFAActive(false)
    setShowSetup(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-2">{t.twoFATitle}</h2>
        <p className="text-ink-muted text-xs mb-6">{t.twoFADesc}</p>

        {twoFAActive && !showSetup && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="text-green-800 font-semibold text-sm">{t.twoFAActive}</p>
                  <p className="text-green-600 text-xs mt-0.5">{t.twoFAActiveDesc}</p>
                </div>
              </div>
              <button onClick={handleDeactivate} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors">
                {t.disable}
              </button>
            </div>
          </div>
        )}

        {!twoFAActive && !showSetup && (
          <div className="bg-surface-muted border border-surface-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <p className="text-ink font-semibold text-sm">{t.twoFAInactive}</p>
                  <p className="text-ink-muted text-xs mt-0.5">{t.twoFAInactiveDesc}</p>
                </div>
              </div>
              <button onClick={() => setShowSetup(true)} className="px-4 py-2 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-dark transition-colors">
                {t.activate}
              </button>
            </div>
          </div>
        )}

        {showSetup && (
          <div className="space-y-5">
            <div className="bg-surface-muted border border-surface-border rounded-xl p-6">
              <h3 className="text-ink font-semibold text-sm mb-4">{t.step1Title}</h3>
              <div className="flex items-center gap-6">
                <div className="w-40 h-40 bg-white border-2 border-dashed border-surface-border rounded-xl flex items-center justify-center text-center p-4">
                  <div>
                    <svg className="w-8 h-8 text-ink-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    <p className="text-xs text-ink-muted">{t.step1ScanHint}</p>
                  </div>
                </div>
                <div className="text-sm text-ink-muted">
                  <p className="mb-2">{t.step1UseApps}</p>
                  <ul className="space-y-1 text-xs">
                    <li>- Google Authenticator</li>
                    <li>- Microsoft Authenticator</li>
                    <li>- Authy</li>
                  </ul>
                  <p className="mt-3 text-xs bg-surface-muted rounded-lg p-2 border border-surface-border font-mono break-all">
                    DEMO-XXXX-XXXX-XXXX-XXXX
                  </p>
                  <p className="text-xs text-ink-muted mt-1">{t.step1ManualCode}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-muted border border-surface-border rounded-xl p-6">
              <h3 className="text-ink font-semibold text-sm mb-3">{t.step2Title}</h3>
              <div className="flex gap-3">
                <input type="text" value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6}
                  className="flex-1 px-4 py-3 rounded-lg border border-surface-border bg-white text-ink text-center text-xl tracking-[0.5em] font-mono placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                <button onClick={handleActivate}
                  disabled={totpCode.length !== 6}
                  className="px-6 py-3 bg-purple text-white rounded-lg font-semibold text-sm hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {t.confirm}
                </button>
              </div>
              <p className="text-xs text-ink-muted mt-2">{t.demoHint}</p>
            </div>

            <button onClick={() => setShowSetup(false)} className="text-sm text-ink-muted hover:text-ink transition-colors">
              {t.cancel ?? 'Annuleren'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
