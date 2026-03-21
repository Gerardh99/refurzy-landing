'use client'

import { useState } from 'react'

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

// ─── Section component ──────────────────────────────────────────────────────

function Section({ title, icon, children, editMode, onToggleEdit }: {
  title: string
  icon: string
  children: React.ReactNode
  editMode?: boolean
  onToggleEdit?: () => void
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
            {editMode ? 'Opslaan' : 'Bewerken'}
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
  const [editBedrijf, setEditBedrijf] = useState(false)
  const [editFactuur, setEditFactuur] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Bedrijfsprofiel</h1>
        <p className="text-ink-light mt-1">Beheer uw bedrijfsgegevens, facturatie en M-Score profiel</p>
      </div>

      {/* 1. Bedrijfsgegevens */}
      <Section title="Bedrijfsgegevens" icon="🏢" editMode={editBedrijf} onToggleEdit={() => setEditBedrijf(!editBedrijf)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <Field label="KVK-nummer" value={bedrijfsgegevens.kvkNummer} editing={editBedrijf} />
          <Field label="Bedrijfsnaam" value={bedrijfsgegevens.bedrijfsnaam} editing={editBedrijf} />
          <Field label="Adres" value={bedrijfsgegevens.adres} editing={editBedrijf} />
          <Field label="Postcode" value={bedrijfsgegevens.postcode} editing={editBedrijf} />
          <Field label="Plaats" value={bedrijfsgegevens.plaats} editing={editBedrijf} />
          <Field label="Land" value={bedrijfsgegevens.land} editing={editBedrijf} />
          <Field label="Sector" value={bedrijfsgegevens.sector} editing={editBedrijf} />
          <Field label="Website" value={bedrijfsgegevens.website} editing={editBedrijf} />
        </div>
      </Section>

      {/* 2. Factuurgegevens */}
      <Section title="Factuurgegevens" icon="🧾" editMode={editFactuur} onToggleEdit={() => setEditFactuur(!editFactuur)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <Field label="Factuurnaam" value={factuurgegevens.factuurnaam} editing={editFactuur} />
          <Field label="Factuuradres" value={factuurgegevens.factuuradres} editing={editFactuur} />
          <Field label="BTW-nummer" value={factuurgegevens.btwNummer} editing={editFactuur} />
          <Field label="IBAN" value={factuurgegevens.iban} editing={editFactuur} />
        </div>
      </Section>

      {/* 3. Contactpersonen */}
      <Section title="Contactpersonen" icon="👥">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Naam</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Email</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Rol</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Actief sinds</th>
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
            + Collega uitnodigen
          </button>
        </div>
      </Section>

      {/* 4. Organisatie M-Score Profiel */}
      <Section title="Organisatie M-Score Profiel" icon="🧪">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-ink-muted">Status:</span>
            {mScoreProfiel.ingevuld ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                Ingevuld
              </span>
            ) : (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange/10 text-orange border border-orange/30">
                Nog niet ingevuld
              </span>
            )}
          </div>

          {mScoreProfiel.ingevuld && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs text-ink-muted font-medium mb-2">Waarden (Dimensie 2)</h4>
                <div className="flex flex-wrap gap-2">
                  {mScoreProfiel.waarden.map((w) => (
                    <span key={w} className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan/10 text-cyan border border-cyan/20">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-ink-muted font-medium mb-2">Organisatiekenmerken (Dimensie 3)</h4>
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
            Profiel bewerken
          </button>

          <p className="text-xs text-ink-muted italic">
            Dit profiel wordt hergebruikt bij alle vacatures. Alleen werkzaamheden worden per vacature ingevuld.
          </p>
        </div>
      </Section>

      {/* 5. Getekende contracten */}
      <Section title="Getekende contracten" icon="📄">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Contractnaam</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Vacature</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Kandidaat</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Datum getekend</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Status</th>
                <th className="text-left py-3 px-2 text-ink-muted font-medium text-xs">Actie</th>
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
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button className="text-purple hover:text-purple-dark text-xs font-medium hover:underline">
                      Download PDF
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
