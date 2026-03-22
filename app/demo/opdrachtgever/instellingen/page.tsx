'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LANDEN } from '@/lib/constants'

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

// ─── Role badge ─────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: TeamRole }) {
  const styles: Record<TeamRole, string> = {
    owner: 'bg-purple/15 text-purple border-purple/30',
    admin: 'bg-cyan/15 text-cyan border-cyan/30',
    gebruiker: 'bg-gray-500/15 text-ink-light border-gray-500/30',
  }
  const labels: Record<TeamRole, string> = {
    owner: '👑 Owner',
    admin: '🛡 Admin',
    gebruiker: '👤 Gebruiker',
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
  const [activeTab, setActiveTab] = useState<Tab>('bedrijf')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'bedrijf', label: 'Bedrijf', icon: '🏢' },
    { key: 'team', label: 'Team', icon: '👥' },
    { key: 'betaling', label: 'Betaling', icon: '💳' },
    { key: 'beveiliging', label: 'Beveiliging', icon: '🛡' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          ← Terug naar dashboard
        </Link>
        <h1 className="text-2xl font-bold text-ink mt-3">Instellingen</h1>
        <p className="text-ink-light font-medium mt-1">Beheer uw bedrijfsprofiel, team en betaalgegevens</p>
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
      {activeTab === 'bedrijf' && <BedrijfTab />}
      {activeTab === 'team' && (
        <TeamTab
          inviteModalOpen={inviteModalOpen}
          setInviteModalOpen={setInviteModalOpen}
          transferModalOpen={transferModalOpen}
          setTransferModalOpen={setTransferModalOpen}
        />
      )}
      {activeTab === 'betaling' && <BetalingTab />}
      {activeTab === 'beveiliging' && <BeveiligingTab />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB: Bedrijf
// ═══════════════════════════════════════════════════════════════════════════
function BedrijfTab() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Bedrijfsgegevens */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-6">Bedrijfsgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Bedrijfsnaam</label>
            <input type="text" defaultValue="TechCorp Solutions B.V." className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">KVK-nummer</label>
            <input type="text" defaultValue="12345678" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Adres</label>
            <input type="text" defaultValue="Herengracht 182" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Postcode &amp; Plaats</label>
            <input type="text" defaultValue="1016 BR Amsterdam" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Land</label>
            <select defaultValue="Nederland" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
              {LANDEN.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <p className="text-xs text-ink-muted mt-1">Dit land wordt standaard ingesteld bij nieuwe vacatures</p>
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Website</label>
            <input type="text" defaultValue="https://techcorp.nl" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Telefoonnummer</label>
            <input type="text" defaultValue="+31 20 123 4567" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
        </div>
      </div>

      {/* Gestructureerde velden */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-2">Bedrijfsprofiel</h2>
        <p className="text-ink-muted text-xs mb-6">Deze informatie wordt getoond bij uw vacatures</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Branche</label>
            <select defaultValue="IT & Software" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
              <option>IT & Software</option>
              <option>Finance & Banking</option>
              <option>Zorg & Welzijn</option>
              <option>Bouw & Techniek</option>
              <option>Retail & E-commerce</option>
              <option>Onderwijs</option>
              <option>Overheid</option>
              <option>Consultancy</option>
              <option>Logistiek & Transport</option>
              <option>Marketing & Communicatie</option>
              <option>Anders</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Bedrijfsgrootte</label>
            <select defaultValue="50-200" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
              <option value="1-10">1 - 10 medewerkers</option>
              <option value="11-50">11 - 50 medewerkers</option>
              <option value="50-200">50 - 200 medewerkers</option>
              <option value="200-1000">200 - 1.000 medewerkers</option>
              <option value="1000+">1.000+ medewerkers</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-ink-muted mb-1.5 block">Bedrijfscultuur</label>
            <input type="text" defaultValue="Informeel, innovatief, hybride werken" placeholder="Bijv. informeel, resultaatgericht, teamwork" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
        </div>
      </div>

      {/* Vrij tekstveld */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-2">Over uw bedrijf</h2>
        <p className="text-ink-muted text-xs mb-4">Vertel kandidaten wat uw bedrijf uniek maakt</p>
        <textarea
          rows={5}
          defaultValue="TechCorp Solutions is een snelgroeiend technologiebedrijf dat gespecialiseerd is in AI-gedreven HR-oplossingen. Wij geloven in de kracht van data om betere beslissingen te nemen. Ons team van 120 professionals werkt vanuit Amsterdam en remote aan innovatieve producten die de toekomst van werk vormgeven."
          className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted resize-none"
          placeholder="Beschrijf uw bedrijf, missie, cultuur en wat u een aantrekkelijke werkgever maakt..."
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-ink-muted">Markdown wordt ondersteund</span>
          <span className="text-xs text-ink-muted">348 / 1000 tekens</span>
        </div>
      </div>

      {/* Logo upload */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-4">Bedrijfslogo</h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-surface-muted border-2 border-dashed border-surface-border flex items-center justify-center text-ink-muted">
            <span className="text-3xl">🏢</span>
          </div>
          <div>
            <button className="bg-purple/15 text-purple px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple/25 transition-colors border border-surface-border">
              Logo uploaden
            </button>
            <p className="text-xs text-ink-muted mt-2">PNG, JPG of SVG. Max 2MB. Aanbevolen: 400×400px</p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
          Wijzigingen opslaan
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB: Team
// ═══════════════════════════════════════════════════════════════════════════
function TeamTab({
  inviteModalOpen,
  setInviteModalOpen,
  transferModalOpen,
  setTransferModalOpen,
}: {
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
          <h2 className="text-ink font-semibold">Teamleden</h2>
          <p className="text-ink-muted text-xs mt-1">Beheer wie toegang heeft tot uw bedrijfsaccount</p>
        </div>
        <button
          onClick={() => setInviteModalOpen(true)}
          className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>+</span> Teamlid uitnodigen
        </button>
      </div>

      {/* Gebruikers indicator */}
      <div className="bg-white rounded-2xl border border-surface-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-light flex items-center gap-2">
            <span>👥</span> 4 van 5 gebruikers inbegrepen
          </span>
          <span className="text-xs text-ink-muted">4 / 5</span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan via-blue to-purple transition-all duration-500" style={{ width: '80%' }} />
        </div>
        <p className="text-xs text-ink-muted mt-2">Extra gebruikers kunnen worden uitgenodigd voor €15/maand per gebruiker (ex. 21% BTW).</p>
      </div>

      {/* Rollen uitleg */}
      <div className="bg-white rounded-2xl border border-surface-border p-4">
        <div className="flex items-center gap-6 text-xs text-ink-light">
          <span className="font-semibold text-ink">Rollen:</span>
          <span><span className="text-purple font-medium">Owner</span> = volledige controle + eigenaarschap overdragen</span>
          <span><span className="text-cyan font-medium">Admin</span> = team &amp; bedrijfsgegevens beheren</span>
          <span><span className="text-ink-light font-medium">Gebruiker</span> = eigen vacatures schrijven &amp; beheren</span>
        </div>
      </div>

      {/* Members tabel */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_2fr_1.2fr_1.2fr_1.5fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
          <div>Naam</div>
          <div>E-mail</div>
          <div>Rol</div>
          <div>Toegevoegd</div>
          <div className="text-right">Acties</div>
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
            <div><RoleBadge role={member.role} /></div>
            <div className="text-ink-muted text-sm">{formatDate(member.toegevoegd)}</div>
            <div className="flex justify-end gap-2">
              {member.role === 'owner' ? (
                <button
                  onClick={() => setTransferModalOpen(true)}
                  className="text-xs text-purple hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  ⇄ Overdragen
                </button>
              ) : (
                <>
                  <select
                    defaultValue={member.role}
                    className="bg-surface-muted border border-surface-border rounded-lg px-2 py-1 text-xs text-ink-light focus:outline-none focus:border-cyan/50"
                  >
                    <option value="admin">Admin</option>
                    <option value="gebruiker">Gebruiker</option>
                  </select>
                  <button className="rounded-lg p-1.5 text-ink-muted hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Verwijderen">
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
            Openstaande uitnodigingen <span className="text-ink-muted font-normal text-sm">({mockInvites.length})</span>
          </h3>
          <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-6 py-3 text-xs text-ink-muted uppercase tracking-wider border-b border-surface-border bg-surface-muted">
              <div>E-mail</div>
              <div>Rol</div>
              <div>Verloopt op</div>
              <div className="text-right">Actie</div>
            </div>
            {mockInvites.map(invite => (
              <div key={invite.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-6 py-4 border-b border-surface-border items-center">
                <div className="flex items-center gap-2 text-ink-light text-sm">
                  <span>✉️</span> {invite.email}
                </div>
                <div><RoleBadge role={invite.role} /></div>
                <div className="text-ink-muted text-sm">{formatDate(invite.verloopt)}</div>
                <div className="text-right">
                  <button className="text-xs text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">
                    Intrekken
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
            <h3 className="text-xl font-bold text-ink mb-2">Teamlid uitnodigen</h3>
            <p className="text-ink-light font-medium text-sm mb-6">Stuur een uitnodiging per e-mail. De link is 7 dagen geldig.</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-ink-muted mb-1.5 block">E-mailadres</label>
                <input type="email" placeholder="naam@bedrijf.nl" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
              </div>

              <div>
                <label className="text-xs text-ink-muted mb-3 block">Rol</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 rounded-xl border border-cyan/20 bg-cyan/5 p-4 cursor-pointer">
                    <input type="radio" name="invite-role" value="admin" className="mt-0.5 accent-cyan" />
                    <div>
                      <div className="text-sm font-medium text-ink">Admin</div>
                      <div className="text-xs text-ink-muted">Kan team en bedrijfsgegevens beheren, betaalgegevens aanpassen</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 rounded-xl border border-surface-border bg-purple/5 p-4 cursor-pointer">
                    <input type="radio" name="invite-role" value="gebruiker" defaultChecked className="mt-0.5 accent-purple" />
                    <div>
                      <div className="text-sm font-medium text-ink">Gebruiker</div>
                      <div className="text-xs text-ink-muted">Kan eigen vacatures schrijven en kandidaten beheren</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1 bg-surface-muted border border-surface-border text-ink-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-ink transition-colors"
                >
                  Annuleren
                </button>
                <button className="flex-1 bg-gradient-to-r from-cyan via-blue to-purple text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  ✉️ Uitnodiging versturen
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
            <h3 className="text-xl font-bold text-ink mb-2">Eigenaarschap overdragen</h3>

            <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-6">
              <p className="text-sm text-orange">
                <strong>Let op:</strong> na de overdracht wordt u zelf admin en kan alleen de nieuwe eigenaar dit terugdraaien.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-ink-muted mb-1.5 block">Nieuwe eigenaar</label>
                <select className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
                  <option value="">Selecteer een teamlid...</option>
                  {mockMembers.filter(m => m.role !== 'owner').map(m => (
                    <option key={m.id} value={m.id}>{m.naam} — {m.role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-ink-muted mb-1.5 block">Bevestig met uw wachtwoord</label>
                <input type="password" placeholder="Uw huidige wachtwoord" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setTransferModalOpen(false)}
                  className="flex-1 bg-surface-muted border border-surface-border text-ink-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-ink transition-colors"
                >
                  Annuleren
                </button>
                <button className="flex-1 bg-purple/20 text-purple px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple/30 transition-colors border border-purple/30">
                  ⇄ Eigenaarschap overdragen
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
function BetalingTab() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Huidig plan */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-ink font-semibold">Huidig plan</h2>
          <span className="px-3 py-1 bg-cyan/15 text-cyan rounded-lg text-xs font-bold border border-cyan/20">PROFESSIONAL</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-muted rounded-xl border border-surface-border p-4 text-center">
            <div className="text-2xl font-bold text-ink">€299</div>
            <div className="text-xs text-ink-muted mt-1">per maand (ex. BTW)</div>
          </div>
          <div className="bg-surface-muted rounded-xl border border-surface-border p-4 text-center">
            <div className="text-2xl font-bold text-ink">5</div>
            <div className="text-xs text-ink-muted mt-1">gebruikers inbegrepen</div>
          </div>
          <div className="bg-surface-muted rounded-xl border border-surface-border p-4 text-center">
            <div className="text-2xl font-bold text-ink">∞</div>
            <div className="text-xs text-ink-muted mt-1">vacatures</div>
          </div>
        </div>
      </div>

      {/* Betaalmethode */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-4">Betaalmethode</h2>
        <div className="flex items-center gap-4 bg-surface-muted rounded-xl border border-surface-border p-4">
          <div className="w-12 h-8 rounded bg-gradient-to-r from-blue to-purple flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
          <div>
            <div className="text-ink text-sm font-medium">•••• •••• •••• 4242</div>
            <div className="text-xs text-ink-muted">Verloopt 12/2028</div>
          </div>
          <button className="ml-auto text-xs text-purple hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors border border-surface-border">
            Wijzigen
          </button>
        </div>
      </div>

      {/* Factuurgegevens */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-4">Factuurgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Bedrijfsnaam</label>
            <input type="text" defaultValue="TechCorp Solutions B.V." className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" readOnly />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">BTW-nummer</label>
            <input type="text" defaultValue="NL123456789B01" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50 placeholder-ink-muted" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Factuuradres</label>
            <input type="text" defaultValue="Herengracht 182" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
          </div>
          <div>
            <label className="text-xs text-ink-muted mb-1.5 block">Facturatie e-mail</label>
            <input type="text" defaultValue="facturen@techcorp.nl" className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
          </div>
        </div>
      </div>

      {/* Factuurhistorie */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-ink font-semibold mb-4">Recente facturen</h2>
        <div className="space-y-2">
          {[
            { datum: '01-03-2026', bedrag: '€299,00', status: 'Betaald' },
            { datum: '01-02-2026', bedrag: '€299,00', status: 'Betaald' },
            { datum: '01-01-2026', bedrag: '€299,00', status: 'Betaald' },
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
          Wijzigingen opslaan
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB: Beveiliging
// ═══════════════════════════════════════════════════════════════════════════
function BeveiligingTab() {
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
        <h2 className="text-ink font-semibold mb-2">Tweestapsverificatie (2FA)</h2>
        <p className="text-ink-muted text-xs mb-6">Voeg een extra beveiligingslaag toe aan je account met een authenticator app.</p>

        {twoFAActive && !showSetup && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="text-green-800 font-semibold text-sm">Tweestapsverificatie is actief</p>
                  <p className="text-green-600 text-xs mt-0.5">Je account is extra beveiligd met 2FA.</p>
                </div>
              </div>
              <button onClick={handleDeactivate} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors">
                Uitschakelen
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
                  <p className="text-ink font-semibold text-sm">Tweestapsverificatie is niet actief</p>
                  <p className="text-ink-muted text-xs mt-0.5">Activeer 2FA om je account beter te beveiligen.</p>
                </div>
              </div>
              <button onClick={() => setShowSetup(true)} className="px-4 py-2 bg-purple text-white rounded-lg text-xs font-semibold hover:bg-purple-dark transition-colors">
                Activeren
              </button>
            </div>
          </div>
        )}

        {showSetup && (
          <div className="space-y-5">
            <div className="bg-surface-muted border border-surface-border rounded-xl p-6">
              <h3 className="text-ink font-semibold text-sm mb-4">Stap 1: Scan de QR-code</h3>
              <div className="flex items-center gap-6">
                <div className="w-40 h-40 bg-white border-2 border-dashed border-surface-border rounded-xl flex items-center justify-center text-center p-4">
                  <div>
                    <svg className="w-8 h-8 text-ink-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    <p className="text-xs text-ink-muted">Scan deze QR-code met je authenticator app</p>
                  </div>
                </div>
                <div className="text-sm text-ink-muted">
                  <p className="mb-2">Gebruik een van deze apps:</p>
                  <ul className="space-y-1 text-xs">
                    <li>- Google Authenticator</li>
                    <li>- Microsoft Authenticator</li>
                    <li>- Authy</li>
                  </ul>
                  <p className="mt-3 text-xs bg-surface-muted rounded-lg p-2 border border-surface-border font-mono break-all">
                    DEMO-XXXX-XXXX-XXXX-XXXX
                  </p>
                  <p className="text-xs text-ink-muted mt-1">Of voer deze code handmatig in</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-muted border border-surface-border rounded-xl p-6">
              <h3 className="text-ink font-semibold text-sm mb-3">Stap 2: Voer de verificatiecode in</h3>
              <div className="flex gap-3">
                <input type="text" value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6}
                  className="flex-1 px-4 py-3 rounded-lg border border-surface-border bg-white text-ink text-center text-xl tracking-[0.5em] font-mono placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple" />
                <button onClick={handleActivate}
                  disabled={totpCode.length !== 6}
                  className="px-6 py-3 bg-purple text-white rounded-lg font-semibold text-sm hover:bg-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Bevestigen
                </button>
              </div>
              <p className="text-xs text-ink-muted mt-2">Demo: voer een willekeurige 6-cijferige code in</p>
            </div>

            <button onClick={() => setShowSetup(false)} className="text-sm text-ink-muted hover:text-ink transition-colors">
              Annuleren
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
