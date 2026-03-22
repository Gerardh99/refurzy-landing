'use client'

import { useState } from 'react'
import { TAALNIVEAU_LABELS } from '@/lib/constants'
import type { TaalBeheersing } from '@/lib/types'

export default function KandidaatProfiel() {
  const [form, setForm] = useState({
    naam: 'Anna de Jong',
    email: 'anna.dejong@email.nl',
    telefoon: '06-12345678',
    woonplaats: 'Amsterdam',
    opleidingsniveau: 'WO',
    werkervaring: '8 jaar',
    huidigeRol: 'Senior Marketeer',
    voorkeursFunctie: 'Marketing Manager',
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

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn Profiel</h1>
        <p className="text-ink-light font-medium mt-1">Beheer je persoonlijke en professionele gegevens</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">Persoonlijke gegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Naam" value={form.naam} onChange={(v) => handleChange('naam', v)} />
          <Field label="Email" value={form.email} onChange={(v) => handleChange('email', v)} type="email" />
          <Field label="Telefoon" value={form.telefoon} onChange={(v) => handleChange('telefoon', v)} />
          <Field label="Woonplaats" value={form.woonplaats} onChange={(v) => handleChange('woonplaats', v)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">Professionele gegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">Opleidingsniveau</label>
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
          <Field label="Werkervaring" value={form.werkervaring} onChange={(v) => handleChange('werkervaring', v)} />
          <Field label="Huidige functie" value={form.huidigeRol} onChange={(v) => handleChange('huidigeRol', v)} />
          <Field label="Gewenste functie" value={form.voorkeursFunctie} onChange={(v) => handleChange('voorkeursFunctie', v)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">Werkvoorkeuren</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-ink-muted mb-1.5">Salarisindicatie (bruto/maand)</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">€</span>
                <input type="number" value={form.salarisMin} onChange={(e) => handleChange('salarisMin', e.target.value)}
                  placeholder="min" className="w-full pl-8 pr-4 bg-surface-muted border border-surface-border rounded-lg py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
              </div>
              <span className="text-ink-muted">–</span>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">€</span>
                <input type="number" value={form.salarisMax} onChange={(e) => handleChange('salarisMax', e.target.value)}
                  placeholder="max" className="w-full pl-8 pr-4 bg-surface-muted border border-surface-border rounded-lg py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">Maximale reistijd</label>
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
            <label className="block text-sm text-ink-muted mb-1.5">Op kantoor</label>
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
            <label className="block text-sm text-ink-muted mb-1.5">Talen</label>
            <div className="space-y-2">
              {talen.map((t, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-surface-muted border border-surface-border rounded-lg text-sm text-ink">
                  <span className="font-medium">{t.taal}</span>
                  <span className="text-ink-muted">—</span>
                  <span>{t.niveau} ({TAALNIVEAU_LABELS[t.niveau]})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink">CV</h2>
        <div className="border-2 border-dashed border-surface-border rounded-xl p-8 text-center">
          <div className="text-ink-muted space-y-2">
            <p className="text-3xl">&#128196;</p>
            <p className="text-sm">Sleep je CV hierheen of klik om te uploaden</p>
            <p className="text-xs text-ink-muted">PDF, DOC of DOCX (max. 5MB)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-400">&#10003;</span>
          <span className="text-ink-light">CV_Anna_de_Jong_2026.pdf</span>
          <span className="text-ink-muted">geupload op 5 maart 2026</span>
        </div>
      </div>

      <button className="px-6 py-3 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors">
        Profiel opslaan
      </button>

      {/* Beschikbaarheid & Account */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-5">
        <h2 className="text-lg font-semibold text-ink">Beschikbaarheid</h2>
        <p className="text-ink-light text-sm">
          Beheer je beschikbaarheidsstatus. Als je tijdelijk niet beschikbaar bent, kun je je profiel op pauze zetten.
          Je Talent Scout wordt hiervan op de hoogte gesteld en je wordt niet voorgedragen voor nieuwe vacatures.
        </p>

        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <div>
              <p className="text-ink font-medium text-sm">Beschikbaar voor vacatures</p>
              <p className="text-ink-muted text-xs">Je kunt worden voorgedragen door je Talent Scout</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all">
            Pauzeer profiel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink">Account verwijderen</h2>
        <p className="text-ink-light text-sm">
          Je kunt je volledig terugtrekken uit Refurzy. Je profiel, Matching Scan resultaten en alle gegevens worden permanent verwijderd.
          Eventuele actieve processen in de pipeline worden geannuleerd. Dit kan niet ongedaan worden gemaakt.
        </p>
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all">
          Account verwijderen
        </button>
      </div>
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
