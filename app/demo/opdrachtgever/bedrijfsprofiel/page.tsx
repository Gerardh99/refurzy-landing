'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'

// ─── Mock data ──────────────────────────────────────────────────────────────

const bedrijfsgegevens = {
  kvkNummer: '12345678',
  bedrijfsnaam: 'TechVentures B.V.',
  adres: 'Herengracht 100',
  postcode: '1015 BS',
  plaats: 'Amsterdam',
  land: 'Nederland',
  sector: 'Technologie & Software',
  website: 'https://techventures.nl',
}

const factuurgegevens = {
  factuurnaam: 'TechVentures B.V.',
  factuuradres: 'Herengracht 100, 1015 BS Amsterdam',
  btwNummer: 'NL123456789B01',
  iban: 'NL91ABNA0417164300',
}

const contactpersonen = [
  { naam: 'Daan Verhoeven', email: 'jan@techventures.nl', rol: 'Beheerder', actiefSinds: '2025-09-01' },
  { naam: 'Lisa Bakker', email: 'lisa@techventures.nl', rol: 'Hiring Manager', actiefSinds: '2025-11-15' },
  { naam: 'Pieter de Vries', email: 'pieter@techventures.nl', rol: 'HR Manager', actiefSinds: '2026-01-10' },
]

const mScoreProfiel = {
  ingevuld: true,
  waarden: ['Innovatie', 'Samenwerking', 'Transparantie', 'Klantgerichtheid'],
  organisatiekenmerken: ['Informele cultuur', 'Platte hiërarchie', 'Resultaatgericht', 'Internationaal team'],
}

const contracten = [
  { contractnaam: 'Plaatsingsovereenkomst RF-2026-001', vacature: 'Marketing Manager', kandidaat: 'Anna de Jong', datumGetekend: '2026-02-15', status: 'actief' },
  { contractnaam: 'Plaatsingsovereenkomst RF-2026-002', vacature: 'Senior Software Developer', kandidaat: 'Thomas van Dijk', datumGetekend: '2026-03-05', status: 'getekend' },
  { contractnaam: 'Plaatsingsovereenkomst RF-2025-047', vacature: 'Product Owner', kandidaat: 'Sanne Visser', datumGetekend: '2025-06-20', status: 'verlopen' },
]

// ─── Texts ───────────────────────────────────────────────────────────────────

const texts = {
  nl: {
    pageTitle: 'Bedrijfsprofiel',
    pageSubtitle: 'Beheer uw bedrijfsgegevens, facturatie en M-Score profiel',
    save: 'Opslaan',
    edit: 'Bewerken',
    // Section 1
    companyDataTitle: 'Bedrijfsgegevens',
    kvk: 'KVK-nummer',
    bedrijfsnaam: 'Bedrijfsnaam',
    adres: 'Adres',
    postcode: 'Postcode',
    plaats: 'Plaats',
    land: 'Land',
    sector: 'Sector',
    website: 'Website',
    // Section 2
    invoiceDataTitle: 'Factuurgegevens',
    factuurnaam: 'Factuurnaam',
    factuuradres: 'Factuuradres',
    btwNummer: 'BTW-nummer',
    iban: 'IBAN',
    // Section 3
    contactsTitle: 'Contactpersonen',
    colNaam: 'Naam',
    colEmail: 'Email',
    colRol: 'Rol',
    colActiefSinds: 'Actief sinds',
    inviteColleague: '+ Collega uitnodigen',
    // Section 4
    orgProfileTitle: 'Organisatie M-Score Profiel',
    status: 'Status:',
    profileFilled: 'Ingevuld',
    profileNotFilled: 'Nog niet ingevuld',
    valuesLabel: 'Waarden (Dimensie 2)',
    orgFeaturesLabel: 'Organisatiekenmerken (Dimensie 3)',
    editProfile: 'Profiel bewerken',
    profileReused: 'Dit profiel wordt hergebruikt bij alle vacatures. Alleen werkzaamheden worden per vacature ingevuld.',
    // Section 5
    contractsTitle: 'Getekende contracten',
    colContract: 'Contractnaam',
    colVacature: 'Vacature',
    colKandidaat: 'Kandidaat',
    colDateSigned: 'Datum getekend',
    colStatus: 'Status',
    colAction: 'Actie',
    downloadPdf: 'Download PDF',
    // Status display
    statusActief: 'Actief',
    statusGetekend: 'Getekend',
    statusVerlopen: 'Verlopen',
  },
  en: {
    pageTitle: 'Company profile',
    pageSubtitle: 'Manage your company data, invoicing and M-Score profile',
    save: 'Save',
    edit: 'Edit',
    // Section 1
    companyDataTitle: 'Company details',
    kvk: 'Chamber of Commerce number',
    bedrijfsnaam: 'Company name',
    adres: 'Address',
    postcode: 'Postcode',
    plaats: 'City',
    land: 'Country',
    sector: 'Sector',
    website: 'Website',
    // Section 2
    invoiceDataTitle: 'Invoice details',
    factuurnaam: 'Invoice name',
    factuuradres: 'Invoice address',
    btwNummer: 'VAT number',
    iban: 'IBAN',
    // Section 3
    contactsTitle: 'Contact persons',
    colNaam: 'Name',
    colEmail: 'Email',
    colRol: 'Role',
    colActiefSinds: 'Active since',
    inviteColleague: '+ Invite colleague',
    // Section 4
    orgProfileTitle: 'Organisation M-Score Profile',
    status: 'Status:',
    profileFilled: 'Completed',
    profileNotFilled: 'Not yet completed',
    valuesLabel: 'Values (Dimension 2)',
    orgFeaturesLabel: 'Organisation characteristics (Dimension 3)',
    editProfile: 'Edit profile',
    profileReused: 'This profile is reused for all vacancies. Only job activities are filled in per vacancy.',
    // Section 5
    contractsTitle: 'Signed contracts',
    colContract: 'Contract name',
    colVacature: 'Vacancy',
    colKandidaat: 'Candidate',
    colDateSigned: 'Date signed',
    colStatus: 'Status',
    colAction: 'Action',
    downloadPdf: 'Download PDF',
    // Status display
    statusActief: 'Active',
    statusGetekend: 'Signed',
    statusVerlopen: 'Expired',
  },
}

// ─── Section component ──────────────────────────────────────────────────────

function Section({ title, icon, children, editMode, onToggleEdit, saveLabel, editLabel }: {
  title: string
  icon: string
  children: React.ReactNode
  editMode?: boolean
  onToggleEdit?: () => void
  saveLabel?: string
  editLabel?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
        </div>
        {onToggleEdit && (
          <button
            onClick={onToggleEdit}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              editMode
                ? 'bg-cyan text-navy-dark hover:bg-cyan-light'
                : 'bg-surface-muted text-ink-light hover:bg-surface-border'
            }`}
          >
            {editMode ? (saveLabel || 'Opslaan') : (editLabel || 'Bewerken')}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, editing }: { label: string; value: string; editing: boolean }) {
  return (
    <div>
      <label className="text-xs text-ink-muted font-medium block mb-1">{label}</label>
      {editing ? (
        <input
          type="text"
          defaultValue={value}
          className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-ink text-sm focus:outline-none focus:border-purple/40"
        />
      ) : (
        <div className="text-sm text-ink font-medium">{value}</div>
      )}
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function BedrijfsprofielPage() {
  const { lang } = useLang()
  const t = texts[lang]

  const [editBedrijf, setEditBedrijf] = useState(false)
  const [editFactuur, setEditFactuur] = useState(false)

  const getStatusDisplay = (status: string) => {
    if (status === 'actief') return t.statusActief
    if (status === 'getekend') return t.statusGetekend
    if (status === 'verlopen') return t.statusVerlopen
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.pageSubtitle}</p>
      </div>

      {/* 1. Bedrijfsgegevens */}
      <Section title={t.companyDataTitle} icon="🏢" editMode={editBedrijf} onToggleEdit={() => setEditBedrijf(!editBedrijf)} saveLabel={t.save} editLabel={t.edit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <Field label={t.kvk} value={bedrijfsgegevens.kvkNummer} editing={editBedrijf} />
          <Field label={t.bedrijfsnaam} value={bedrijfsgegevens.bedrijfsnaam} editing={editBedrijf} />
          <Field label={t.adres} value={bedrijfsgegevens.adres} editing={editBedrijf} />
          <Field label={t.postcode} value={bedrijfsgegevens.postcode} editing={editBedrijf} />
          <Field label={t.plaats} value={bedrijfsgegevens.plaats} editing={editBedrijf} />
          <Field label={t.land} value={bedrijfsgegevens.land} editing={editBedrijf} />
          <Field label={t.sector} value={bedrijfsgegevens.sector} editing={editBedrijf} />
          <Field label={t.website} value={bedrijfsgegevens.website} editing={editBedrijf} />
        </div>
      </Section>

      {/* 2. Factuurgegevens */}
      <Section title={t.invoiceDataTitle} icon="🧾" editMode={editFactuur} onToggleEdit={() => setEditFactuur(!editFactuur)} saveLabel={t.save} editLabel={t.edit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <Field label={t.factuurnaam} value={factuurgegevens.factuurnaam} editing={editFactuur} />
          <Field label={t.factuuradres} value={factuurgegevens.factuuradres} editing={editFactuur} />
          <Field label={t.btwNummer} value={factuurgegevens.btwNummer} editing={editFactuur} />
          <Field label={t.iban} value={factuurgegevens.iban} editing={editFactuur} />
        </div>
      </Section>

      {/* 3. Contactpersonen */}
      <Section title={t.contactsTitle} icon="👥">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colNaam}</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colEmail}</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colRol}</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colActiefSinds}</th>
              </tr>
            </thead>
            <tbody>
              {contactpersonen.map((p) => (
                <tr key={p.email} className="border-b border-surface-border/50 last:border-0">
                  <td className="py-3 px-2 text-ink font-medium">{p.naam}</td>
                  <td className="py-3 px-2 text-ink-light">{p.email}</td>
                  <td className="py-3 px-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple/10 text-purple">
                      {p.rol}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-ink-light">{new Date(p.actiefSinds).toLocaleDateString('nl-NL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button className="bg-cyan text-navy-dark px-4 py-2 rounded-lg text-xs font-semibold hover:bg-cyan-light transition-colors">
            {t.inviteColleague}
          </button>
        </div>
      </Section>

      {/* 4. Organisatie M-Score Profiel */}
      <Section title={t.orgProfileTitle} icon="🧪">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-ink-muted">{t.status}</span>
            {mScoreProfiel.ingevuld ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                {t.profileFilled}
              </span>
            ) : (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange/10 text-orange border border-orange/30">
                {t.profileNotFilled}
              </span>
            )}
          </div>

          {mScoreProfiel.ingevuld && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs text-ink-muted font-medium mb-2">{t.valuesLabel}</h4>
                <div className="flex flex-wrap gap-2">
                  {mScoreProfiel.waarden.map((w) => (
                    <span key={w} className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan/10 text-cyan border border-cyan/20">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-ink-muted font-medium mb-2">{t.orgFeaturesLabel}</h4>
                <div className="flex flex-wrap gap-2">
                  {mScoreProfiel.organisatiekenmerken.map((k) => (
                    <span key={k} className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-purple/10 text-purple border border-purple/20">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button className="bg-surface-muted text-ink-light px-4 py-2 rounded-lg text-xs font-semibold hover:bg-surface-border transition-colors">
            {t.editProfile}
          </button>

          <p className="text-xs text-ink-muted italic">
            {t.profileReused}
          </p>
        </div>
      </Section>

      {/* 5. Getekende contracten */}
      <Section title={t.contractsTitle} icon="📄">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colContract}</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colVacature}</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colKandidaat}</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colDateSigned}</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colStatus}</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">{t.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {contracten.map((c) => (
                <tr key={c.contractnaam} className="border-b border-surface-border/50 last:border-0">
                  <td className="py-3 px-2 text-ink font-medium">{c.contractnaam}</td>
                  <td className="py-3 px-2 text-ink-light">{c.vacature}</td>
                  <td className="py-3 px-2 text-ink-light">{c.kandidaat}</td>
                  <td className="py-3 px-2 text-ink-light">{new Date(c.datumGetekend).toLocaleDateString('nl-NL')}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.status === 'actief'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : c.status === 'getekend'
                        ? 'bg-cyan/10 text-cyan border border-cyan/20'
                        : 'bg-surface-muted text-ink-muted border border-surface-border'
                    }`}>
                      {getStatusDisplay(c.status)}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button className="text-purple hover:text-purple-dark text-xs font-medium hover:underline">
                      {t.downloadPdf}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}
