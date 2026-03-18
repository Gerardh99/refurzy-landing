'use client'

import { useState } from 'react'

export default function KandidaatProfiel() {
  const [form, setForm] = useState({
    naam: 'Anna de Jong',
    email: 'anna.dejong@email.nl',
    telefoon: '06-12345678',
    woonplaats: 'Amsterdam',
    opleidingsniveau: 'WO',
    werkervaring: '8 jaar',
    huidigeRol: 'Marketing Lead bij CreativeAgency',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Mijn Profiel</h1>
        <p className="text-gray-400 mt-1">Beheer je persoonlijke en professionele gegevens</p>
      </div>

      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Persoonlijke gegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Naam" value={form.naam} onChange={(v) => handleChange('naam', v)} />
          <Field label="Email" value={form.email} onChange={(v) => handleChange('email', v)} type="email" />
          <Field label="Telefoon" value={form.telefoon} onChange={(v) => handleChange('telefoon', v)} />
          <Field label="Woonplaats" value={form.woonplaats} onChange={(v) => handleChange('woonplaats', v)} />
        </div>
      </div>

      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Professionele gegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Opleidingsniveau</label>
            <select
              value={form.opleidingsniveau}
              onChange={(e) => handleChange('opleidingsniveau', e.target.value)}
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50"
            >
              <option value="MBO">MBO</option>
              <option value="HBO">HBO</option>
              <option value="WO">WO</option>
            </select>
          </div>
          <Field label="Werkervaring" value={form.werkervaring} onChange={(v) => handleChange('werkervaring', v)} />
          <div className="md:col-span-2">
            <Field label="Huidige rol" value={form.huidigeRol} onChange={(v) => handleChange('huidigeRol', v)} />
          </div>
        </div>
      </div>

      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">CV</h2>
        <div className="border-2 border-dashed border-purple/20 rounded-xl p-8 text-center">
          <div className="text-gray-500 space-y-2">
            <p className="text-3xl">&#128196;</p>
            <p className="text-sm">Sleep je CV hierheen of klik om te uploaden</p>
            <p className="text-xs text-gray-600">PDF, DOC of DOCX (max. 5MB)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-400">&#10003;</span>
          <span className="text-gray-300">CV_Anna_de_Jong_2026.pdf</span>
          <span className="text-gray-600">geupload op 5 maart 2026</span>
        </div>
      </div>

      <button className="px-6 py-3 bg-cyan text-navy-dark rounded-lg font-medium text-sm hover:bg-cyan/90 transition-colors">
        Profiel opslaan
      </button>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50"
      />
    </div>
  )
}
