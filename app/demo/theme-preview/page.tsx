'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Light theme showcase ───────────────────────────────────────────────────
// Vergelijk het huidige donkere thema met het voorgestelde lichte thema
// Alle Refurzy kleuren (teal, purple, gradient) blijven identiek

type Theme = 'dark' | 'light'

const mockKandidaten = [
  { naam: 'Kandidaat JB', score: 87, criteria: 92, rating: 4.9, status: 'aanbevolen' },
  { naam: 'Kandidaat LM', score: 71, criteria: 85, rating: 4.1, status: 'bekijk' },
  { naam: 'Kandidaat RK', score: 53, criteria: 60, rating: 3.2, status: 'overweeg' },
]

export default function ThemePreviewPage() {
  const [theme, setTheme] = useState<Theme>('light')

  const t = theme === 'dark' ? {
    bg: 'bg-navy-dark',
    surface: 'bg-navy-light',
    card: 'bg-navy',
    border: 'border-purple/10',
    borderHover: 'hover:border-purple/25',
    title: 'text-white',
    body: 'text-gray-400',
    muted: 'text-gray-500',
    faint: 'text-gray-600',
    input: 'bg-navy border-purple/20 text-white placeholder-gray-600 focus:border-cyan/50',
    tableHeader: 'bg-navy-dark/50 text-gray-500',
    rowHover: 'hover:bg-purple/5',
    sidebarBg: 'bg-navy-light border-r border-purple/10',
    sidebarActive: 'bg-purple/15 text-cyan border border-purple/20',
    sidebarInactive: 'text-gray-400 hover:text-white hover:bg-purple/5',
    badge: {
      aanbevolen: 'bg-cyan/15 text-cyan',
      bekijk: 'bg-purple/15 text-purple-light',
      overweeg: 'bg-orange/15 text-orange',
    },
  } : {
    bg: 'bg-surface',
    surface: 'bg-white',
    card: 'bg-surface-muted',
    border: 'border-surface-border',
    borderHover: 'hover:border-purple/30',
    title: 'text-ink',
    body: 'text-ink-light',
    muted: 'text-ink-muted',
    faint: 'text-ink-faint',
    input: 'bg-white border-surface-border text-ink placeholder-ink-faint focus:border-cyan',
    tableHeader: 'bg-surface-muted text-ink-muted',
    rowHover: 'hover:bg-surface-muted/50',
    sidebarBg: 'bg-white border-r border-surface-border',
    sidebarActive: 'bg-purple/10 text-purple border border-purple/20',
    sidebarInactive: 'text-ink-light hover:text-ink hover:bg-surface-muted',
    badge: {
      aanbevolen: 'bg-cyan/10 text-cyan-dark',
      bekijk: 'bg-purple/10 text-purple',
      overweeg: 'bg-orange/10 text-orange',
    },
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-300`}>
      {/* Theme toggle bar */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white text-sm">← Terug</Link>
          <h1 className="text-white font-bold">Refurzy Theme Preview</h1>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
          <button
            onClick={() => setTheme('dark')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === 'dark' ? 'bg-navy text-white' : 'text-gray-400 hover:text-white'}`}
          >
            🌙 Dark
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === 'light' ? 'bg-white text-ink' : 'text-gray-400 hover:text-white'}`}
          >
            ☀️ Light
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar preview */}
        <aside className={`w-64 min-h-[calc(100vh-52px)] flex flex-col ${t.sidebarBg} transition-colors duration-300`}>
          <div className={`p-6 border-b ${t.border}`}>
            {theme === 'dark' ? (
              <img src="/assets/refurzy-logo-white.png" alt="Refurzy" className="h-8" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan via-blue to-purple flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <span className={`font-bold text-lg ${t.title}`}>Refurzy</span>
              </div>
            )}
            <div className="mt-3 px-2 py-1 bg-purple/10 rounded text-purple text-xs font-medium inline-block">
              Opdrachtgever
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: 'Dashboard', icon: '📊', active: true },
              { label: 'Vacature aanmaken', icon: '➕', active: false },
              { label: 'Instellingen', icon: '⚙️', active: false },
            ].map(item => (
              <div key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${item.active ? t.sidebarActive : t.sidebarInactive}`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-2xl font-bold ${t.title}`}>Dashboard</h1>
            <p className={`${t.body} mt-1`}>Overzicht van uw vacatures en kandidaten</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Actieve vacatures', value: '2', icon: '📋' },
              { label: 'Totaal kandidaten', value: '5', icon: '👥' },
              { label: 'Gem. M-Score', value: '72%', icon: '🎯' },
            ].map(stat => (
              <div key={stat.label} className={`${t.surface} rounded-2xl border ${t.border} p-6 transition-colors duration-300 ${theme === 'light' ? 'shadow-sm' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`${t.body} text-sm`}>{stat.label}</span>
                </div>
                <div className={`text-3xl font-bold ${t.title}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className={`${t.surface} rounded-2xl border ${t.border} p-6 mb-6 ${theme === 'light' ? 'shadow-sm' : ''}`}>
            <h2 className={`${t.title} font-semibold mb-4`}>Knoppen (CTA)</h2>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-cyan via-[#06BAFF] to-purple text-white px-6 py-3 rounded-[10px] font-semibold text-sm hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
                Primaire actie
              </button>
              <button className={`${theme === 'dark' ? 'bg-purple/15 text-purple-light border-purple/20' : 'bg-purple/10 text-purple border-purple/20'} border px-6 py-3 rounded-[10px] font-semibold text-sm hover:bg-purple/20 transition-colors`}>
                Secundaire actie
              </button>
              <button className={`${theme === 'dark' ? 'bg-navy border-purple/20 text-gray-400' : 'bg-white border-surface-border text-ink-light'} border px-6 py-3 rounded-[10px] font-semibold text-sm hover:opacity-80 transition-colors`}>
                Tertiaire actie
              </button>
              <button className="bg-cyan text-white px-6 py-3 rounded-[10px] font-semibold text-sm hover:bg-cyan-light transition-colors">
                Ontgrendel profiel
              </button>
            </div>
          </div>

          {/* Kandidaten tabel */}
          <div className={`${t.surface} rounded-2xl border ${t.border} overflow-hidden mb-6 ${theme === 'light' ? 'shadow-sm' : ''}`}>
            <div className={`p-6 border-b ${t.border}`}>
              <h2 className={`${t.title} font-semibold`}>Kandidaten (3)</h2>
            </div>

            <div className={`hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-6 py-3 text-xs uppercase tracking-wider border-b ${t.border} ${t.tableHeader}`}>
              <div>Kandidaat</div>
              <div className="text-center">M-Score</div>
              <div className="text-center">Harde Criteria</div>
              <div className="text-center">Scout Rating</div>
              <div className="text-center">Status</div>
            </div>

            {mockKandidaten.map(k => (
              <div key={k.naam} className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-6 py-4 border-b ${t.border} items-center ${t.rowHover} transition-colors`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-purple/20 border-purple/30 text-purple-light' : 'bg-purple/10 border-purple/20 text-purple'} border flex items-center justify-center font-bold text-sm`}>
                    {k.naam.split(' ')[1]}
                  </div>
                  <span className={`${t.title} font-medium text-sm`}>{k.naam}</span>
                </div>
                <div className="flex justify-center">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${k.score >= 75 ? 'from-cyan to-cyan-light' : k.score >= 50 ? 'from-purple to-purple-light' : 'from-orange to-orange-light'} flex items-center justify-center font-bold text-white text-xs border-2 ${k.score >= 75 ? 'border-cyan/40' : k.score >= 50 ? 'border-purple/40' : 'border-orange/40'}`}>
                    {k.score}%
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className={`text-sm font-semibold ${k.criteria >= 80 ? 'text-green-500' : 'text-orange'}`}>
                    {k.criteria >= 80 ? '✓' : '⚠'} {k.criteria}%
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className={`text-sm ${t.body}`}>⭐ {k.rating}</span>
                </div>
                <div className="flex justify-center">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${t.badge[k.status as keyof typeof t.badge]}`}>
                    {k.status.charAt(0).toUpperCase() + k.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Form elements */}
          <div className={`${t.surface} rounded-2xl border ${t.border} p-6 mb-6 ${theme === 'light' ? 'shadow-sm' : ''}`}>
            <h2 className={`${t.title} font-semibold mb-4`}>Formulier elementen</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={`text-xs ${t.muted} mb-1.5 block`}>Tekstveld</label>
                <input
                  type="text"
                  defaultValue="Voorbeeldtekst"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors ${t.input}`}
                />
              </div>
              <div>
                <label className={`text-xs ${t.muted} mb-1.5 block`}>Dropdown</label>
                <select className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors ${t.input}`}>
                  <option>HBO</option>
                  <option>WO</option>
                  <option>MBO</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={`text-xs ${t.muted} mb-1.5 block`}>Tekstvak</label>
                <textarea
                  rows={3}
                  defaultValue="Dit is een voorbeeldomschrijving van een bedrijf."
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${t.input}`}
                />
              </div>
            </div>
          </div>

          {/* Color palette */}
          <div className={`${t.surface} rounded-2xl border ${t.border} p-6 ${theme === 'light' ? 'shadow-sm' : ''}`}>
            <h2 className={`${t.title} font-semibold mb-4`}>Kleurenpalet — {theme === 'dark' ? 'Donker thema' : 'Licht thema'}</h2>
            <div className="grid grid-cols-4 gap-4">
              {theme === 'dark' ? (
                <>
                  <ColorSwatch color="#1A0F5D" name="Navy (bg)" textColor="white" />
                  <ColorSwatch color="#231470" name="Navy Light" textColor="white" />
                  <ColorSwatch color="#130B45" name="Navy Dark" textColor="white" />
                  <ColorSwatch color="#F9FBFF" name="Light (tekst)" textColor="black" />
                </>
              ) : (
                <>
                  <ColorSwatch color="#FAFBFE" name="Surface (bg)" textColor="black" />
                  <ColorSwatch color="#FFFFFF" name="Card" textColor="black" />
                  <ColorSwatch color="#F3F4F8" name="Muted" textColor="black" />
                  <ColorSwatch color="#1E293B" name="Ink (tekst)" textColor="white" />
                </>
              )}
              <ColorSwatch color="#14CDD3" name="Teal" textColor="white" />
              <ColorSwatch color="#06BAFF" name="Blue" textColor="white" />
              <ColorSwatch color="#6D40F9" name="Purple" textColor="white" />
              <ColorSwatch color="#F59E0B" name="Orange" textColor="white" />
            </div>
            <p className={`text-xs ${t.muted} mt-4`}>
              Accent kleuren (teal, blue, purple, orange) zijn identiek in beide thema&apos;s. Alleen de achtergrond- en tekstkleuren wijzigen.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

function ColorSwatch({ color, name, textColor }: { color: string; name: string; textColor: string }) {
  return (
    <div className="text-center">
      <div className="w-full h-16 rounded-xl border border-black/10 mb-2" style={{ backgroundColor: color }} />
      <div className="text-xs font-medium" style={{ color: textColor === 'white' ? '#F9FBFF' : '#1E293B' }}>{name}</div>
      <div className="text-[10px] text-gray-500">{color}</div>
    </div>
  )
}
