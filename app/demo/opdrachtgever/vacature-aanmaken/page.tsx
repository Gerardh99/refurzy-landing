'use client'

import { useState } from 'react'
import Link from 'next/link'

const steps = [
  { nr: 1, label: 'Vacature info' },
  { nr: 2, label: 'Harde criteria' },
  { nr: 3, label: 'Profiel Match Scan' },
  { nr: 4, label: 'Bevestiging' },
]

const sampleQuestions = [
  'Ik werk het liefst in een team met duidelijke structuur en rolverdeling.',
  'Bij tegenslag zoek ik eerst zelf naar een oplossing voordat ik hulp vraag.',
  'Ik vind het belangrijk dat mijn werk bijdraagt aan een groter doel.',
  'Ik neem graag het initiatief in vergaderingen en groepsgesprekken.',
  'Ik heb een voorkeur voor planmatig werken boven improviseren.',
]

export default function VacatureAanmaken() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: '',
    locatie: '',
    salaris: '',
    deadline: '',
    opleidingsniveau: 'HBO',
    minimaleErvaring: '2-5 jaar',
    criteriaLocatie: '',
    opKantoor: 'Hybride (3 dagen)',
    maxReistijd: '45 minuten',
  })
  const [published, setPublished] = useState(false)

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-navy-light rounded-2xl border border-purple/10 p-12 text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Vacature gepubliceerd!</h2>
          <p className="text-gray-400 mb-6">
            Uw vacature is live. Talent Scouts kunnen nu kandidaten aandragen.
          </p>
          <Link
            href="/demo/opdrachtgever"
            className="bg-cyan text-navy-dark px-6 py-3 rounded-lg font-semibold hover:bg-cyan-light transition-colors inline-block"
          >
            Naar dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/demo/opdrachtgever"
          className="text-gray-400 hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors"
        >
          ← Terug naar dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mt-3">Vacature aanmaken</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.nr} className="flex items-center">
            <button
              onClick={() => s.nr < step && setStep(s.nr)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                s.nr === step
                  ? 'bg-cyan text-navy-dark'
                  : s.nr < step
                  ? 'bg-cyan/15 text-cyan cursor-pointer'
                  : 'bg-navy-light text-gray-500 border border-purple/10'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                s.nr === step
                  ? 'bg-navy-dark text-cyan'
                  : s.nr < step
                  ? 'bg-cyan/30 text-cyan'
                  : 'bg-purple/10 text-gray-500'
              }`}>
                {s.nr < step ? '✓' : s.nr}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-1 ${s.nr < step ? 'bg-cyan/40' : 'bg-purple/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-8 max-w-2xl">
        {/* Step 1: Vacature info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4">Vacature informatie</h2>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Functietitel</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Bijv. Marketing Manager"
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Locatie</label>
              <input
                type="text"
                value={form.locatie}
                onChange={(e) => updateField('locatie', e.target.value)}
                placeholder="Bijv. Amsterdam"
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Salarisindicatie</label>
              <input
                type="text"
                value={form.salaris}
                onChange={(e) => updateField('salaris', e.target.value)}
                placeholder="Bijv. €4.500 - €6.000"
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => updateField('deadline', e.target.value)}
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>
          </div>
        )}

        {/* Step 2: Harde criteria */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4">Harde criteria</h2>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Opleidingsniveau</label>
              <select
                value={form.opleidingsniveau}
                onChange={(e) => updateField('opleidingsniveau', e.target.value)}
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="MBO">MBO</option>
                <option value="HBO">HBO</option>
                <option value="WO">WO</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Minimale werkervaring</label>
              <select
                value={form.minimaleErvaring}
                onChange={(e) => updateField('minimaleErvaring', e.target.value)}
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="0-2 jaar">0-2 jaar</option>
                <option value="2-5 jaar">2-5 jaar</option>
                <option value="5-10 jaar">5-10 jaar</option>
                <option value=">10 jaar">&gt;10 jaar</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Locatie</label>
              <input
                type="text"
                value={form.criteriaLocatie}
                onChange={(e) => updateField('criteriaLocatie', e.target.value)}
                placeholder="Bijv. Amsterdam of Randstad"
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Op kantoor</label>
              <select
                value={form.opKantoor}
                onChange={(e) => updateField('opKantoor', e.target.value)}
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="Op kantoor (5 dagen)">Op kantoor (5 dagen)</option>
                <option value="Hybride (3 dagen)">Hybride (3 dagen)</option>
                <option value="Hybride (2 dagen)">Hybride (2 dagen)</option>
                <option value="Volledig remote">Volledig remote</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Maximale reistijd</label>
              <select
                value={form.maxReistijd}
                onChange={(e) => updateField('maxReistijd', e.target.value)}
                className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="15 minuten">15 minuten</option>
                <option value="30 minuten">30 minuten</option>
                <option value="45 minuten">45 minuten</option>
                <option value="60 minuten">60 minuten</option>
                <option value="Geen voorkeur">Geen voorkeur</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Profiel Match Scan */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Profiel Match Scan</h2>
            <p className="text-gray-400 text-sm mb-6">
              De 35 vragen van de Profiel Match Scan worden hier geladen. Hieronder een preview van het type vragen.
            </p>

            <div className="bg-navy rounded-xl border border-purple/10 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-cyan text-lg">🧪</span>
                <span className="text-purple-light text-sm font-semibold">Preview - Voorbeeldvragen</span>
              </div>
              <div className="space-y-4">
                {sampleQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs text-gray-600 mt-1 w-5 text-right flex-shrink-0">{i + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-2">{q}</p>
                      <div className="flex gap-2">
                        {['Helemaal mee oneens', 'Oneens', 'Neutraal', 'Eens', 'Helemaal mee eens'].map((label) => (
                          <div
                            key={label}
                            className="flex-1 text-center py-1.5 bg-purple/5 border border-purple/10 rounded text-[10px] text-gray-500 cursor-default"
                          >
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4 text-center">... en nog 30 vragen</p>
            </div>

            <div className="bg-cyan/10 border border-cyan/20 rounded-xl p-4 text-sm text-cyan">
              In de volledige applicatie vult de opdrachtgever hier de gehele Profiel Match Scan in. De antwoorden worden gebruikt om kandidaten te matchen op basis van de De Vries Fit score.
            </div>
          </div>
        )}

        {/* Step 4: Bevestiging */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-6">Bevestiging</h2>

            <div className="space-y-4 mb-8">
              <div className="bg-navy rounded-xl border border-purple/10 p-4">
                <div className="text-xs text-gray-500 mb-1">Functietitel</div>
                <div className="text-white font-medium">{form.title || '—'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy rounded-xl border border-purple/10 p-4">
                  <div className="text-xs text-gray-500 mb-1">Locatie</div>
                  <div className="text-white font-medium">{form.locatie || '—'}</div>
                </div>
                <div className="bg-navy rounded-xl border border-purple/10 p-4">
                  <div className="text-xs text-gray-500 mb-1">Salaris</div>
                  <div className="text-white font-medium">{form.salaris || '—'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy rounded-xl border border-purple/10 p-4">
                  <div className="text-xs text-gray-500 mb-1">Deadline</div>
                  <div className="text-white font-medium">{form.deadline || '—'}</div>
                </div>
                <div className="bg-navy rounded-xl border border-purple/10 p-4">
                  <div className="text-xs text-gray-500 mb-1">Opleiding</div>
                  <div className="text-white font-medium">{form.opleidingsniveau}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-navy rounded-xl border border-purple/10 p-4">
                  <div className="text-xs text-gray-500 mb-1">Ervaring</div>
                  <div className="text-white font-medium">{form.minimaleErvaring}</div>
                </div>
                <div className="bg-navy rounded-xl border border-purple/10 p-4">
                  <div className="text-xs text-gray-500 mb-1">Op kantoor</div>
                  <div className="text-white font-medium">{form.opKantoor}</div>
                </div>
                <div className="bg-navy rounded-xl border border-purple/10 p-4">
                  <div className="text-xs text-gray-500 mb-1">Max reistijd</div>
                  <div className="text-white font-medium">{form.maxReistijd}</div>
                </div>
              </div>
              <div className="bg-navy rounded-xl border border-cyan/20 p-4">
                <div className="text-xs text-gray-500 mb-1">Profiel Match Scan</div>
                <div className="text-cyan font-medium">Ingevuld (demo)</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-purple/10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="bg-navy border border-purple/20 text-gray-400 px-6 py-2.5 rounded-lg text-sm font-semibold hover:text-white hover:border-purple/40 transition-colors"
            >
              Vorige
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-cyan text-navy-dark px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-cyan-light transition-colors"
            >
              Volgende
            </button>
          ) : (
            <button
              onClick={() => setPublished(true)}
              className="bg-cyan text-navy-dark px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-cyan-light transition-colors"
            >
              Vacature publiceren
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
