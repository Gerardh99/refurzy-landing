'use client'

import { useState } from 'react'
import Link from 'next/link'
import { scoutKandidaten, allVacatures } from '@/lib/mock-data'
import type { Kandidaat } from '@/lib/types'
import { useFavoriteVacatures } from '@/lib/useFavoriteVacatures'
import { useLang } from '@/lib/i18n'

type Tab = 'beschikbaar' | 'geplaatst' | 'inactief'

const texts = {
  nl: {
    pageTitle: 'Mijn Talent Pool',
    pageSubtitle: (count: number) => `${count} kandidaten in je netwerk`,
    banner2FATitle: 'Beveilig je account met tweestapsverificatie (2FA)',
    banner2FASubtitle: 'Dit beschermt je account tegen onbevoegde toegang.',
    banner2FAActivate: 'Nu activeren',
    introTitle: 'Refurzy investeert mee in jouw eerste plaatsing',
    introBody: (
      <>
        Bij je eerste voordracht bieden we de opdrachtgever{' '}
        <span className="text-green-600 font-semibold">50% korting</span> op de plaatsingsfee.
        Refurzy neemt de helft van die korting voor eigen rekening — zo investeren we samen in jouw track record.
        De opdrachtgever betaalt minder, jij bouwt reputatie op, en na je eerste succesvolle plaatsing gelden de reguliere tarieven.
      </>
    ),
    introBullet1: 'Eerste plaatsing: 25% fee voor jou (i.p.v. 50%)',
    introBullet2: 'Refurzy draagt de andere 25%',
    introBullet3: 'Daarna: reguliere 50/50 verdeling',
    tabAvailable: 'Beschikbaar',
    tabPlaced: 'Geplaatst',
    tabInactive: 'Inactief',
    placedSummaryTitle: 'Succesvolle plaatsingen via jouw netwerk',
    placedSummaryBody: (count: number, fee: string) =>
      `${count} kandidaten geplaatst — totaal verdiend: `,
    placedSummaryFee: (fee: string) => fee,
    inactiveTitle: 'Inactieve kandidaten',
    inactiveBody: 'Deze kandidaten zijn tijdelijk of permanent niet beschikbaar. Je kunt ze opnieuw activeren als ze weer beschikbaar zijn.',
    emptyCategory: 'Geen kandidaten in deze categorie',
    labelLookingFor: 'Zoekt naar',
    labelCity: 'Woonplaats',
    labelEducation: 'Opleiding',
    labelExperience: 'Werkervaring',
    labelReadiness: 'Gereedheid',
    labelContactDetails: 'Contactgegevens',
    labelCurrentRole: 'Huidige rol',
    labelPreference1: 'Voorkeur 1',
    labelPreference2: 'Voorkeur 2',
    labelMatchingScan: 'Matching Scan',
    labelCVStatus: 'CV status',
    scanCompleted: '✓ Voltooid',
    scanNotCompleted: '✗ Niet voltooid',
    cvUploaded: '✓ Geupload',
    cvMissing: '✗ Ontbreekt',
    nominatedOn: 'Voorgedragen op:',
    badgeNominated: 'Voorgedragen',
    badgePlaced: 'Geplaatst',
    badgeInactive: 'Inactief',
    badgeScanPending: 'Scan pending',
    badgeCVMissing: 'CV ontbreekt',
    badgeAvailable: 'Beschikbaar',
    labelPlacedAs: 'Geplaatst als',
    labelAt: 'Bij',
    labelDate: 'Datum',
    labelYourFee: 'Jouw fee',
    labelReason: 'Reden: ',
    labelSince: 'Sinds',
    btnCollapse: 'Inklappen',
    btnViewDetails: 'Bekijk details',
    btnReactivate: 'Heractiveren',
    btnNominated: '✓ Voorgedragen',
    btnNominate: 'Voordragen',
    dropdownTitle: 'Kies een vacature',
    dropdownSubtitle: 'Je favoriete vacatures worden getoond',
    noFavorites: 'Geen favoriete vacatures',
    noFavoritesHint: 'Markeer eerst vacatures als favoriet',
    toVacancies: 'Naar vacatures →',
  },
  en: {
    pageTitle: 'My Talent Pool',
    pageSubtitle: (count: number) => `${count} candidates in your network`,
    banner2FATitle: 'Secure your account with two-factor authentication (2FA)',
    banner2FASubtitle: 'This protects your account against unauthorized access.',
    banner2FAActivate: 'Activate now',
    introTitle: 'Refurzy co-invests in your first placement',
    introBody: (
      <>
        For your first nomination we offer the client a{' '}
        <span className="text-green-600 font-semibold">50% discount</span> on the placement fee.
        Refurzy covers half of that discount — so we invest together in your track record.
        The client pays less, you build reputation, and after your first successful placement the regular rates apply.
      </>
    ),
    introBullet1: 'First placement: 25% fee for you (instead of 50%)',
    introBullet2: 'Refurzy covers the other 25%',
    introBullet3: 'After that: regular 50/50 split',
    tabAvailable: 'Available',
    tabPlaced: 'Placed',
    tabInactive: 'Inactive',
    placedSummaryTitle: 'Successful placements through your network',
    placedSummaryBody: (count: number, fee: string) =>
      `${count} candidates placed — total earned: `,
    placedSummaryFee: (fee: string) => fee,
    inactiveTitle: 'Inactive candidates',
    inactiveBody: 'These candidates are temporarily or permanently unavailable. You can reactivate them when they become available again.',
    emptyCategory: 'No candidates in this category',
    labelLookingFor: 'Looking for',
    labelCity: 'City',
    labelEducation: 'Education',
    labelExperience: 'Work experience',
    labelReadiness: 'Readiness',
    labelContactDetails: 'Contact details',
    labelCurrentRole: 'Current role',
    labelPreference1: 'Preference 1',
    labelPreference2: 'Preference 2',
    labelMatchingScan: 'Matching Scan',
    labelCVStatus: 'CV status',
    scanCompleted: '✓ Completed',
    scanNotCompleted: '✗ Not completed',
    cvUploaded: '✓ Uploaded',
    cvMissing: '✗ Missing',
    nominatedOn: 'Nominated for:',
    badgeNominated: 'Nominated',
    badgePlaced: 'Placed',
    badgeInactive: 'Inactive',
    badgeScanPending: 'Scan pending',
    badgeCVMissing: 'CV missing',
    badgeAvailable: 'Available',
    labelPlacedAs: 'Placed as',
    labelAt: 'At',
    labelDate: 'Date',
    labelYourFee: 'Your fee',
    labelReason: 'Reason: ',
    labelSince: 'Since',
    btnCollapse: 'Collapse',
    btnViewDetails: 'View details',
    btnReactivate: 'Reactivate',
    btnNominated: '✓ Nominated',
    btnNominate: 'Nominate',
    dropdownTitle: 'Choose a vacancy',
    dropdownSubtitle: 'Your favourite vacancies are shown',
    noFavorites: 'No favourite vacancies',
    noFavoritesHint: 'Mark vacancies as favourite first',
    toVacancies: 'Go to vacancies →',
  },
}

export default function ScoutDashboard() {
  const { lang } = useLang()
  const t = texts[lang]

  const { favorites, isFavorite } = useFavoriteVacatures()
  const favorieteVacatures = allVacatures.filter(v => isFavorite(v.id))
  const [show2FABanner, setShow2FABanner] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('beschikbaar')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [voordragenId, setVoordragenId] = useState<string | null>(null)
  const [voorgedragenMap, setVoorgedragenMap] = useState<Record<string, string>>({})

  const beschikbaar = scoutKandidaten.filter(k => !k.poolStatus || k.poolStatus === 'beschikbaar' || k.poolStatus === 'in_proces')
  const geplaatst = scoutKandidaten.filter(k => k.poolStatus === 'geplaatst')
  const inactief = scoutKandidaten.filter(k => k.poolStatus === 'inactief')

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'beschikbaar', label: t.tabAvailable, count: beschikbaar.length },
    { key: 'geplaatst', label: t.tabPlaced, count: geplaatst.length },
    { key: 'inactief', label: t.tabInactive, count: inactief.length },
  ]

  const currentList = activeTab === 'beschikbaar' ? beschikbaar : activeTab === 'geplaatst' ? geplaatst : inactief

  const totalFee = geplaatst.reduce((sum, k) => sum + (k.plaatsing?.scoutFee || 0), 0)

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
    if (voordragenId === id) setVoordragenId(null)
  }

  const handleVoordragen = (kandidaatId: string, vacatureId: string, vacatureTitle: string) => {
    setVoorgedragenMap(prev => ({ ...prev, [kandidaatId]: vacatureTitle }))
    setVoordragenId(null)
  }

  return (
    <div className="space-y-6">
      {/* 2FA Banner */}
      {show2FABanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p className="text-amber-800 font-semibold text-sm">{t.banner2FATitle}</p>
              <p className="text-amber-700 text-xs mt-0.5">{t.banner2FASubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/demo/scout/instellingen" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors">
              {t.banner2FAActivate}
            </Link>
            <button onClick={() => setShow2FABanner(false)} className="text-amber-400 hover:text-amber-600 transition-colors text-lg" title="Sluiten">
              ✕
            </button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.pageSubtitle(scoutKandidaten.length)}</p>
      </div>

      {/* Introductiekorting banner */}
      {activeTab === 'beschikbaar' && (
        <div className="bg-gradient-to-r from-green-50 to-cyan/5 border border-green-200 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h3 className="text-ink font-bold text-sm">{t.introTitle}</h3>
              <p className="text-ink-light text-sm mt-1 leading-relaxed">
                {t.introBody}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="text-ink-muted">{t.introBullet1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="text-ink-muted">{t.introBullet2}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan"></span>
                  <span className="text-ink-muted">{t.introBullet3}</span>
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
              <h3 className="text-ink font-bold text-sm">{t.placedSummaryTitle}</h3>
              <p className="text-ink-light text-sm mt-1">
                {t.placedSummaryBody(geplaatst.length, `€${totalFee.toLocaleString('nl-NL')}`)}<span className="text-green-600 font-semibold">€{totalFee.toLocaleString('nl-NL')}</span>
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
              <h3 className="text-ink font-bold text-sm">{t.inactiveTitle}</h3>
              <p className="text-ink-light text-sm mt-1">
                {t.inactiveBody}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Candidate grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentList.map((k) => (
          <CandidateCard
            key={k.id}
            kandidaat={k}
            tab={activeTab}
            isExpanded={expandedId === k.id}
            onToggleExpand={() => toggleExpand(k.id)}
            showVoordragen={voordragenId === k.id}
            onToggleVoordragen={() => setVoordragenId(voordragenId === k.id ? null : k.id)}
            onVoordragen={(vacId, vacTitle) => handleVoordragen(k.id, vacId, vacTitle)}
            voorgedragenAls={voorgedragenMap[k.id]}
            favorieteVacatures={favorieteVacatures}
            t={t}
          />
        ))}
      </div>

      {currentList.length === 0 && (
        <div className="text-center py-12 text-ink-muted">
          <p className="text-lg">{t.emptyCategory}</p>
        </div>
      )}
    </div>
  )
}

function CandidateCard({
  kandidaat: k,
  tab,
  isExpanded,
  onToggleExpand,
  showVoordragen,
  onToggleVoordragen,
  onVoordragen,
  voorgedragenAls,
  favorieteVacatures,
  t,
}: {
  kandidaat: Kandidaat
  tab: Tab
  isExpanded: boolean
  onToggleExpand: () => void
  showVoordragen: boolean
  onToggleVoordragen: () => void
  onVoordragen: (vacId: string, vacTitle: string) => void
  voorgedragenAls?: string
  favorieteVacatures: typeof allVacatures
  t: typeof texts['nl']
}) {
  const isGeplaatst = tab === 'geplaatst'
  const isInactief = tab === 'inactief'

  return (
    <div className={`bg-white rounded-2xl border border-surface-border overflow-hidden transition-all ${isInactief ? 'opacity-60' : ''} ${isExpanded ? 'ring-2 ring-purple/20' : ''}`}>
      {/* Clickable header area */}
      <button
        onClick={onToggleExpand}
        className="w-full text-left p-6 pb-0 hover:bg-surface-muted/30 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink">{k.naam}</h3>
            <p className="text-purple text-sm font-medium">{k.huidigeRol}</p>
          </div>
          <div className="flex items-center gap-2">
            {voorgedragenAls && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-purple/10 text-purple border-purple/30">
                {t.badgeNominated}
              </span>
            )}
            {isGeplaatst ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
                {t.badgePlaced}
              </span>
            ) : isInactief ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-500 border-gray-200">
                {t.badgeInactive}
              </span>
            ) : !k.scanCompleted ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-orange/15 text-orange border-orange/30">
                {t.badgeScanPending}
              </span>
            ) : !k.cvUploaded ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-600 border-amber-200">
                {t.badgeCVMissing}
              </span>
            ) : (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-cyan/10 text-cyan border-cyan/30">
                {t.badgeAvailable}
              </span>
            )}
            <svg
              className={`w-5 h-5 text-ink-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Always-visible summary */}
      <div className="px-6 py-4 space-y-3">
        {/* Voorkeursfuncties */}
        <div className="space-y-1.5">
          <span className="text-ink-light text-xs font-medium">{t.labelLookingFor}</span>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-xs">
              <span className="text-green-700 font-semibold">{k.voorkeursFunctietitel1}</span>
              <span className="text-green-600/70">({k.voorkeursFunctiegebied1})</span>
            </span>
            {k.voorkeursFunctiegebied2 && k.voorkeursFunctietitel2 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-xs">
                <span className="text-green-700 font-semibold">{k.voorkeursFunctietitel2}</span>
                <span className="text-green-600/70">({k.voorkeursFunctiegebied2})</span>
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-ink-light text-xs font-medium">{t.labelCity}</span>
            <p className="text-ink font-medium">{k.woonplaats}</p>
          </div>
          <div>
            <span className="text-ink-light text-xs font-medium">{t.labelEducation}</span>
            <p className="text-ink font-medium">{k.opleidingsniveau}</p>
          </div>
          <div>
            <span className="text-ink-light text-xs font-medium">{t.labelExperience}</span>
            <p className="text-ink font-medium">{k.werkervaring}</p>
          </div>
          <div>
            <span className="text-ink-light text-xs font-medium">{t.labelReadiness}</span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className={`text-xs font-medium ${k.cvUploaded ? 'text-green-600' : 'text-orange'}`}>
                {k.cvUploaded ? '✓' : '✗'} CV
              </span>
              <span className={`text-xs font-medium ${k.scanCompleted ? 'text-green-600' : 'text-orange'}`}>
                {k.scanCompleted ? '✓' : '✗'} Scan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-6 pb-4 space-y-4 border-t border-surface-border pt-4">
          {/* Contact info */}
          <div className="bg-surface-muted rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-ink uppercase tracking-wider">{t.labelContactDetails}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-ink-muted">📧</span>
                <a href={`mailto:${k.email}`} className="text-purple font-medium hover:underline">{k.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-ink-muted">📱</span>
                <a href={`tel:${k.telefoon}`} className="text-purple font-medium hover:underline">{k.telefoon}</a>
              </div>
            </div>
          </div>

          {/* Extra details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-ink-light text-xs font-medium">{t.labelCurrentRole}</span>
              <p className="text-ink font-medium">{k.huidigeRol}</p>
            </div>
            <div>
              <span className="text-ink-light text-xs font-medium">{t.labelPreference1}</span>
              <p className="text-ink font-medium">{k.voorkeursFunctietitel1} <span className="text-ink-muted text-xs">({k.voorkeursFunctiegebied1})</span></p>
            </div>
            {k.voorkeursFunctiegebied2 && k.voorkeursFunctietitel2 && (
              <div>
                <span className="text-ink-light text-xs font-medium">{t.labelPreference2}</span>
                <p className="text-ink font-medium">{k.voorkeursFunctietitel2} <span className="text-ink-muted text-xs">({k.voorkeursFunctiegebied2})</span></p>
              </div>
            )}
            <div>
              <span className="text-ink-light text-xs font-medium">{t.labelMatchingScan}</span>
              <p className={`font-medium ${k.scanCompleted ? 'text-green-600' : 'text-orange'}`}>
                {k.scanCompleted ? t.scanCompleted : t.scanNotCompleted}
              </p>
            </div>
            <div>
              <span className="text-ink-light text-xs font-medium">{t.labelCVStatus}</span>
              <p className={`font-medium ${k.cvUploaded ? 'text-green-600' : 'text-orange'}`}>
                {k.cvUploaded ? t.cvUploaded : t.cvMissing}
              </p>
            </div>
          </div>

          {/* Voorgedragen feedback */}
          {voorgedragenAls && (
            <div className="bg-purple/5 border border-purple/15 rounded-xl p-3 flex items-center gap-2">
              <span>📤</span>
              <p className="text-sm text-purple font-medium">{t.nominatedOn} {voorgedragenAls}</p>
            </div>
          )}
        </div>
      )}

      {/* Plaatsing details */}
      {isGeplaatst && k.plaatsing && (
        <div className="px-6 pb-4">
          <div className="bg-green-50/50 rounded-xl p-3 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-ink-light text-xs font-medium">{t.labelPlacedAs}</span>
                <p className="text-ink font-semibold">{k.plaatsing.vacatureTitle}</p>
              </div>
              <div>
                <span className="text-ink-light text-xs font-medium">{t.labelAt}</span>
                <p className="text-ink font-semibold">{k.plaatsing.bedrijf}</p>
              </div>
              <div>
                <span className="text-ink-light text-xs font-medium">{t.labelDate}</span>
                <p className="text-ink font-medium">{new Date(k.plaatsing.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <span className="text-ink-light text-xs font-medium">{t.labelYourFee}</span>
                <p className="text-green-600 font-semibold">€{k.plaatsing.scoutFee.toLocaleString('nl-NL')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inactief reden */}
      {isInactief && k.inactiefReden && (
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-xl p-3 text-sm">
            <span className="text-ink-muted">{t.labelReason}</span>
            <span className="text-ink-light">{k.inactiefReden}</span>
            {k.inactiefDatum && (
              <p className="text-ink-muted text-xs mt-1">
                {t.labelSince} {new Date(k.inactiefDatum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="px-6 pb-5 pt-2 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-light">{k.email}</span>
          {isGeplaatst ? (
            <button
              onClick={onToggleExpand}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-muted text-ink-light hover:bg-surface-border transition-all"
            >
              {isExpanded ? t.btnCollapse : t.btnViewDetails}
            </button>
          ) : isInactief ? (
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all">
              {t.btnReactivate}
            </button>
          ) : (
            <div className="relative">
              {voorgedragenAls ? (
                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 inline-flex items-center gap-1.5">
                  {t.btnNominated}
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (k.scanCompleted) onToggleVoordragen()
                  }}
                  disabled={!k.scanCompleted}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    k.scanCompleted
                      ? 'bg-cyan text-navy-dark hover:bg-cyan/90 cursor-pointer'
                      : 'bg-gray-700 text-ink-muted cursor-not-allowed'
                  }`}
                >
                  {t.btnNominate}
                </button>
              )}

              {/* Vacature dropdown */}
              {showVoordragen && (
                <div className="absolute right-0 bottom-full mb-2 w-80 bg-white rounded-xl border border-surface-border shadow-lg z-10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-surface-border bg-surface-muted">
                    <p className="text-sm font-semibold text-ink">{t.dropdownTitle}</p>
                    <p className="text-xs text-ink-light mt-0.5">{t.dropdownSubtitle}</p>
                  </div>
                  {favorieteVacatures.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-sm text-ink-muted">{t.noFavorites}</p>
                      <p className="text-xs text-ink-muted mt-1">{t.noFavoritesHint}</p>
                      <Link
                        href="/demo/scout/vacatures"
                        className="inline-block mt-2 px-3 py-1.5 bg-cyan/10 text-cyan text-xs font-medium rounded-lg hover:bg-cyan/20 transition-colors"
                      >
                        {t.toVacancies}
                      </Link>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto">
                      {favorieteVacatures.map(v => (
                        <button
                          key={v.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onVoordragen(v.id, v.title)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-surface-muted transition-colors border-b border-surface-border last:border-b-0"
                        >
                          <p className="text-sm font-semibold text-ink">{v.title}</p>
                          <p className="text-xs text-ink-light mt-0.5">{v.company} · {v.location} · {v.salaris}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
