'use client'

import { useState } from 'react'
import { scoutKandidaten } from '@/lib/mock-data'
import type { Kandidaat } from '@/lib/types'

type Tab = 'beschikbaar' | 'geplaatst' | 'inactief'

export default function ScoutDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('beschikbaar')

  const beschikbaar = scoutKandidaten.filter(k => !k.poolStatus || k.poolStatus === 'beschikbaar' || k.poolStatus === 'in_proces')
  const geplaatst = scoutKandidaten.filter(k => k.poolStatus === 'geplaatst')
  const inactief = scoutKandidaten.filter(k => k.poolStatus === 'inactief')

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'beschikbaar', label: 'Beschikbaar', count: beschikbaar.length },
    { key: 'geplaatst', label: 'Geplaatst', count: geplaatst.length },
    { key: 'inactief', label: 'Inactief', count: inactief.length },
  ]

  const currentList = activeTab === 'beschikbaar' ? beschikbaar : activeTab === 'geplaatst' ? geplaatst : inactief

  const totalFee = geplaatst.reduce((sum, k) => sum + (k.plaatsing?.scoutFee || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mijn Talent Pool</h1>
        <p className="text-ink-light mt-1">{scoutKandidaten.length} kandidaten in je netwerk</p>
      </div>

      {/* Introductiekorting banner */}
      {activeTab === 'beschikbaar' && (
        <div className="bg-gradient-to-r from-green-50 to-cyan/5 border border-green-200 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h3 className="text-ink font-bold text-sm">Jouw eerste match met introductiekorting</h3>
              <p className="text-ink-light text-sm mt-1 leading-relaxed">
                Als nieuwe scout bieden we jouw kandidaten aan met <span className="text-green-600 font-semibold">50% korting</span> voor de opdrachtgever.
                Dit maakt het extra aantrekkelijk om jouw kandidaat een kans te geven. Na je eerste succesvolle plaatsing
                bouw je je reputatie op en gelden de reguliere tarieven.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="text-ink-muted">Eerste plaatsing: 25% fee voor jou (i.p.v. 50%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan"></span>
                  <span className="text-ink-muted">Daarna: reguliere 50% fee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-muted rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink-light'
            }`}
          >
            {tab.label}
            <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.key ? 'bg-cyan/15 text-cyan' : 'bg-surface-border/50 text-ink-muted'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Geplaatst summary */}
      {activeTab === 'geplaatst' && geplaatst.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🎉</span>
            </div>
            <div>
              <h3 className="text-ink font-bold text-sm">Succesvolle plaatsingen via jouw netwerk</h3>
              <p className="text-ink-light text-sm mt-1">
                {geplaatst.length} kandidaten geplaatst — totaal verdiend: <span className="text-green-600 font-semibold">€{totalFee.toLocaleString('nl-NL')}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inactief info */}
      {activeTab === 'inactief' && inactief.length > 0 && (
        <div className="bg-surface-muted border border-surface-border rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-surface-border/50 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💤</span>
            </div>
            <div>
              <h3 className="text-ink font-bold text-sm">Inactieve kandidaten</h3>
              <p className="text-ink-light text-sm mt-1">
                Deze kandidaten zijn tijdelijk of permanent niet beschikbaar. Je kunt ze opnieuw activeren als ze weer beschikbaar zijn.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Candidate grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentList.map((k) => (
          <CandidateCard key={k.id} kandidaat={k} tab={activeTab} />
        ))}
      </div>

      {currentList.length === 0 && (
        <div className="text-center py-12 text-ink-muted">
          <p className="text-lg">Geen kandidaten in deze categorie</p>
        </div>
      )}
    </div>
  )
}

function CandidateCard({ kandidaat: k, tab }: { kandidaat: Kandidaat; tab: Tab }) {
  const isGeplaatst = tab === 'geplaatst'
  const isInactief = tab === 'inactief'

  return (
    <div className={`bg-white rounded-2xl border border-surface-border p-6 space-y-4 ${isInactief ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">{k.naam}</h3>
          <p className="text-purple text-sm">{k.huidigeRol}</p>
        </div>
        <div className="flex gap-2">
          {isGeplaatst ? (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
              Geplaatst
            </span>
          ) : isInactief ? (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-500 border-gray-200">
              Inactief
            </span>
          ) : !k.scanCompleted ? (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-orange/15 text-orange border-orange/30">
              Scan pending
            </span>
          ) : !k.cvUploaded ? (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-600 border-amber-200">
              CV ontbreekt
            </span>
          ) : (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-cyan/10 text-cyan border-cyan/30">
              Beschikbaar
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-ink-light text-xs font-medium">Woonplaats</span>
          <p className="text-ink font-medium">{k.woonplaats}</p>
        </div>
        <div>
          <span className="text-ink-light text-xs font-medium">Opleiding</span>
          <p className="text-ink font-medium">{k.opleidingsniveau}</p>
        </div>
        <div>
          <span className="text-ink-light text-xs font-medium">Werkervaring</span>
          <p className="text-ink font-medium">{k.werkervaring}</p>
        </div>
        <div>
          <span className="text-ink-light text-xs font-medium">CV</span>
          <p className="text-ink font-medium">{k.cvUploaded ? 'Geupload' : 'Ontbreekt'}</p>
        </div>
      </div>

      {/* Plaatsing details */}
      {isGeplaatst && k.plaatsing && (
        <div className="bg-green-50/50 rounded-xl p-3 space-y-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-ink-light text-xs font-medium">Geplaatst als</span>
              <p className="text-ink font-semibold">{k.plaatsing.vacatureTitle}</p>
            </div>
            <div>
              <span className="text-ink-light text-xs font-medium">Bij</span>
              <p className="text-ink font-semibold">{k.plaatsing.bedrijf}</p>
            </div>
            <div>
              <span className="text-ink-light text-xs font-medium">Datum</span>
              <p className="text-ink font-medium">{new Date(k.plaatsing.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <span className="text-ink-muted">Jouw fee</span>
              <p className="text-green-600 font-semibold">€{k.plaatsing.scoutFee.toLocaleString('nl-NL')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Inactief reden */}
      {isInactief && k.inactiefReden && (
        <div className="bg-gray-50 rounded-xl p-3 text-sm">
          <span className="text-ink-muted">Reden: </span>
          <span className="text-ink-light">{k.inactiefReden}</span>
          {k.inactiefDatum && (
            <p className="text-ink-muted text-xs mt-1">
              Sinds {new Date(k.inactiefDatum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-surface-border">
        <span className="text-sm text-ink-light">{k.email}</span>
        {isGeplaatst ? (
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-muted text-ink-light hover:bg-surface-border transition-all">
            Bekijk details
          </button>
        ) : isInactief ? (
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all">
            Heractiveren
          </button>
        ) : (
          <button
            disabled={!k.scanCompleted}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              k.scanCompleted
                ? 'bg-cyan text-navy-dark hover:bg-cyan/90 cursor-pointer'
                : 'bg-gray-700 text-ink-muted cursor-not-allowed'
            }`}
          >
            Voordragen
          </button>
        )}
      </div>
    </div>
  )
}
