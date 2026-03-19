'use client'

import { useState } from 'react'
import Link from 'next/link'

type AccountStatus = 'actief' | 'geblokkeerd_temp' | 'geblokkeerd_perm'
type OrgRole = 'owner' | 'admin' | 'gebruiker'

interface Organization {
  id: string
  naam: string
  kvk: string
  status: AccountStatus
  aangemeld: string
  plan: string
  leden: OrgMember[]
  vacatures: number
  plaatsingen: number
}

interface OrgMember {
  id: string
  naam: string
  email: string
  role: OrgRole
  laatsteActiviteit: string
  status: AccountStatus
}

interface ScoutAccount {
  id: string
  naam: string
  email: string
  status: AccountStatus
  aangemeld: string
  rating: number
  plaatsingen: number
  poolSize: number
}

const mockOrganizations: Organization[] = [
  {
    id: 'org-1', naam: 'TechVentures B.V.', kvk: '12345678', status: 'actief', aangemeld: '2026-01-10', plan: 'Professional', vacatures: 3, plaatsingen: 1,
    leden: [
      { id: '1', naam: 'Jan van der Berg', email: 'jan@techventures.nl', role: 'owner', laatsteActiviteit: '2026-03-18', status: 'actief' },
      { id: '2', naam: 'Lisa van Dijk', email: 'lisa@techventures.nl', role: 'admin', laatsteActiviteit: '2026-03-17', status: 'actief' },
      { id: '3', naam: 'Mark de Boer', email: 'mark@techventures.nl', role: 'gebruiker', laatsteActiviteit: '2026-03-15', status: 'actief' },
    ],
  },
  {
    id: 'org-2', naam: 'GrowthCo', kvk: '87654321', status: 'actief', aangemeld: '2026-01-22', plan: 'Starter', vacatures: 5, plaatsingen: 2,
    leden: [
      { id: '4', naam: 'Lisa de Wit', email: 'lisa@growthco.nl', role: 'owner', laatsteActiviteit: '2026-03-17', status: 'actief' },
      { id: '5', naam: 'Tom Bakker', email: 'tom@growthco.nl', role: 'gebruiker', laatsteActiviteit: '2026-03-10', status: 'actief' },
    ],
  },
  {
    id: 'org-3', naam: 'Enterprise Solutions', kvk: '11223344', status: 'geblokkeerd_temp', aangemeld: '2026-02-05', plan: 'Professional', vacatures: 1, plaatsingen: 0,
    leden: [
      { id: '6', naam: 'Peter Bakker', email: 'peter@enterprise.nl', role: 'owner', laatsteActiviteit: '2026-03-01', status: 'geblokkeerd_temp' },
    ],
  },
]

const mockScouts: ScoutAccount[] = [
  { id: 's1', naam: 'Sophie de Graaf', email: 'sophie@refurzy.nl', status: 'actief', aangemeld: '2025-12-01', rating: 4.9, plaatsingen: 8, poolSize: 24 },
  { id: 's2', naam: 'Mark Jansen', email: 'mark@talent.nl', status: 'actief', aangemeld: '2026-01-15', rating: 3.2, plaatsingen: 2, poolSize: 8 },
  { id: 's3', naam: 'Eva van Leeuwen', email: 'eva@recruit.nl', status: 'geblokkeerd_perm', aangemeld: '2026-02-10', rating: 0, plaatsingen: 0, poolSize: 0 },
]

function StatusBadge({ status }: { status: AccountStatus }) {
  const styles: Record<AccountStatus, string> = {
    actief: 'bg-green-500/15 text-green-400 border-green-500/20',
    geblokkeerd_temp: 'bg-orange/15 text-orange border-orange/20',
    geblokkeerd_perm: 'bg-red-500/15 text-red-400 border-red-500/20',
  }
  const labels: Record<AccountStatus, string> = {
    actief: 'Actief',
    geblokkeerd_temp: '⏸ Tijdelijk',
    geblokkeerd_perm: '🚫 Permanent',
  }
  return <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${styles[status]}`}>{labels[status]}</span>
}

function RoleBadge({ role }: { role: OrgRole }) {
  const s: Record<OrgRole, string> = {
    owner: 'bg-purple/15 text-purple border-surface-border',
    admin: 'bg-cyan/15 text-cyan border-cyan/20',
    gebruiker: 'bg-gray-500/15 text-ink-light border-gray-500/20',
  }
  const l: Record<OrgRole, string> = { owner: '👑', admin: '🛡', gebruiker: '👤' }
  return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${s[role]}`}>{l[role]} {role}</span>
}

type Tab = 'organisaties' | 'scouts'

export default function GebruikersPage() {
  const [tab, setTab] = useState<Tab>('organisaties')
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null)
  const [blockModal, setBlockModal] = useState<{ id: string; type: 'org' | 'user' | 'scout'; action: 'temp' | 'perm' | 'unblock'; naam: string } | null>(null)
  const [blockReason, setBlockReason] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  function handleBlock() {
    if (!blockModal) return
    const actionLabel = blockModal.action === 'unblock' ? 'gedeblokkeerd' : blockModal.action === 'temp' ? 'tijdelijk geblokkeerd' : 'permanent geblokkeerd'
    setToast(`${blockModal.naam} is ${actionLabel}`)
    setTimeout(() => setToast(null), 3000)
    setBlockModal(null)
    setBlockReason('')
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-pulse">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <Link href="/demo/admin" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          ← Terug naar admin
        </Link>
        <h1 className="text-2xl font-bold text-ink mt-3">Gebruikers overzicht</h1>
        <p className="text-ink-light mt-1">Gegroepeerd per organisatie en type</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Organisaties', value: mockOrganizations.length, color: 'text-purple' },
          { label: 'Gebruikers', value: mockOrganizations.reduce((s, o) => s + o.leden.length, 0), color: 'text-ink' },
          { label: 'Talent Scouts', value: mockScouts.length, color: 'text-cyan' },
          { label: 'Actief', value: mockOrganizations.filter(o => o.status === 'actief').length + mockScouts.filter(s => s.status === 'actief').length, color: 'text-green-400' },
          { label: 'Geblokkeerd', value: mockOrganizations.filter(o => o.status !== 'actief').length + mockScouts.filter(s => s.status !== 'actief').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-surface-border p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-ink-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-surface-border w-fit mb-6">
        <button onClick={() => setTab('organisaties')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'organisaties' ? 'bg-purple/15 text-cyan border border-surface-border' : 'text-ink-light hover:text-ink'}`}>
          🏢 Organisaties ({mockOrganizations.length})
        </button>
        <button onClick={() => setTab('scouts')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'scouts' ? 'bg-purple/15 text-cyan border border-surface-border' : 'text-ink-light hover:text-ink'}`}>
          🔍 Talent Scouts ({mockScouts.length})
        </button>
      </div>

      {/* Organisaties tab */}
      {tab === 'organisaties' && (
        <div className="space-y-4">
          {mockOrganizations.map(org => (
            <div key={org.id} className={`bg-white rounded-2xl border border-surface-border overflow-hidden ${org.status !== 'actief' ? 'opacity-60' : ''}`}>
              {/* Org header */}
              <button
                onClick={() => setExpandedOrg(expandedOrg === org.id ? null : org.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-surface-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple/15 flex items-center justify-center text-lg">🏢</div>
                  <div className="text-left">
                    <div className="text-ink font-semibold flex items-center gap-2">
                      {org.naam}
                      <StatusBadge status={org.status} />
                    </div>
                    <div className="text-xs text-ink-muted flex items-center gap-3 mt-0.5">
                      <span>KVK: {org.kvk}</span>
                      <span>Plan: {org.plan}</span>
                      <span>{org.leden.length} leden</span>
                      <span>{org.vacatures} vacatures</span>
                      <span>{org.plaatsingen} plaatsingen</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {org.status === 'actief' ? (
                    <button
                      onClick={e => { e.stopPropagation(); setBlockModal({ id: org.id, type: 'org', action: 'temp', naam: org.naam }) }}
                      className="text-xs text-orange hover:bg-orange/10 px-3 py-1.5 rounded-lg transition-colors border border-orange/20"
                    >
                      ⏸ Blokkeer
                    </button>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); setBlockModal({ id: org.id, type: 'org', action: 'unblock', naam: org.naam }) }}
                      className="text-xs text-green-400 hover:bg-green-500/10 px-3 py-1.5 rounded-lg transition-colors border border-green-500/20"
                    >
                      ✓ Deblokkeer
                    </button>
                  )}
                  <span className={`text-ink-muted transition-transform ${expandedOrg === org.id ? 'rotate-90' : ''}`}>▶</span>
                </div>
              </button>

              {/* Expanded: members */}
              {expandedOrg === org.id && (
                <div className="border-t border-surface-border px-5 pb-5">
                  <div className="grid grid-cols-[2fr_2.5fr_1fr_1fr_1.5fr] gap-2 px-4 py-2 text-[10px] text-ink-faint uppercase tracking-wider mt-3">
                    <div>Naam</div>
                    <div>E-mail</div>
                    <div>Rol</div>
                    <div>Status</div>
                    <div className="text-right">Acties</div>
                  </div>
                  {org.leden.map(lid => (
                    <div key={lid.id} className="grid grid-cols-[2fr_2.5fr_1fr_1fr_1.5fr] gap-2 px-4 py-3 items-center hover:bg-surface-muted rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple/20 flex items-center justify-center text-purple text-[10px] font-bold">
                          {lid.naam.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-ink text-sm font-medium">{lid.naam}</span>
                      </div>
                      <div className="text-ink-light text-sm">{lid.email}</div>
                      <div><RoleBadge role={lid.role} /></div>
                      <div><StatusBadge status={lid.status} /></div>
                      <div className="flex justify-end gap-2">
                        {lid.status === 'actief' && lid.role !== 'owner' && (
                          <button
                            onClick={() => setBlockModal({ id: lid.id, type: 'user', action: 'temp', naam: lid.naam })}
                            className="text-[10px] text-orange hover:bg-orange/10 px-2 py-1 rounded transition-colors"
                          >
                            ⏸
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scouts tab */}
      {tab === 'scouts' && (
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_1.5fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
            <div>Naam</div>
            <div>E-mail</div>
            <div className="text-center">Rating</div>
            <div className="text-center">Pool</div>
            <div className="text-center">Plaatsingen</div>
            <div className="text-center">Status</div>
            <div className="text-right">Acties</div>
          </div>
          {mockScouts.map(scout => (
            <div key={scout.id} className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_1.5fr] gap-2 px-6 py-4 border-b border-surface-border items-center hover:bg-surface-muted transition-colors ${scout.status !== 'actief' ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan/15 flex items-center justify-center text-cyan text-xs font-bold">
                  {scout.naam.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span className="text-ink font-medium text-sm">{scout.naam}</span>
              </div>
              <div className="text-ink-light text-sm">{scout.email}</div>
              <div className="text-center text-sm text-yellow-400">⭐ {scout.rating > 0 ? scout.rating : '—'}</div>
              <div className="text-center text-sm text-gray-300">{scout.poolSize}</div>
              <div className="text-center text-sm text-cyan font-semibold">{scout.plaatsingen}</div>
              <div className="flex justify-center"><StatusBadge status={scout.status} /></div>
              <div className="flex justify-end gap-2">
                {scout.status === 'actief' ? (
                  <>
                    <button onClick={() => setBlockModal({ id: scout.id, type: 'scout', action: 'temp', naam: scout.naam })} className="text-xs text-orange hover:bg-orange/10 px-3 py-1.5 rounded-lg transition-colors border border-orange/20">⏸</button>
                    <button onClick={() => setBlockModal({ id: scout.id, type: 'scout', action: 'perm', naam: scout.naam })} className="text-xs text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20">🚫</button>
                  </>
                ) : (
                  <button onClick={() => setBlockModal({ id: scout.id, type: 'scout', action: 'unblock', naam: scout.naam })} className="text-xs text-green-400 hover:bg-green-500/10 px-3 py-1.5 rounded-lg transition-colors border border-green-500/20">✓</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Block modal */}
      {blockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-surface-border p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-ink mb-2">
              {blockModal.action === 'unblock' ? 'Deblokkeren' : blockModal.action === 'perm' ? 'Permanent blokkeren' : 'Tijdelijk blokkeren'}
            </h3>
            <p className="text-ink-light text-sm mb-4">{blockModal.naam}</p>

            {blockModal.action === 'perm' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                <p className="text-sm text-red-400"><strong>Let op:</strong> {blockModal.type === 'org' ? 'Alle leden van deze organisatie verliezen toegang. Actieve vacatures worden bevroren.' : 'Dit account verliest permanent alle toegang tot het platform.'}</p>
              </div>
            )}

            {blockModal.action !== 'unblock' && (
              <div className="mb-4">
                <label className="text-xs text-ink-muted mb-1.5 block">Reden</label>
                <textarea rows={3} value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="Geef een reden op..." className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-faint resize-none" />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setBlockModal(null); setBlockReason('') }} className="flex-1 bg-surface-muted border border-surface-border text-ink-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-ink transition-colors">Annuleren</button>
              <button onClick={handleBlock} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                blockModal.action === 'unblock' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                blockModal.action === 'perm' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-orange/20 text-orange border border-orange/30'
              }`}>
                {blockModal.action === 'unblock' ? '✓ Deblokkeren' : blockModal.action === 'perm' ? '🚫 Permanent' : '⏸ Tijdelijk'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
