'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Types ──────────────────────────────────────────────────────────────────
type Tab = 'bedrijf' | 'team' | 'betaling'
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
    owner: 'bg-purple/15 text-purple-light border-purple/30',
    admin: 'bg-cyan/15 text-cyan border-cyan/30',
    gebruiker: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
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
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/demo/opdrachtgever" className="text-gray-400 hover:text-cyan text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          ← Terug naar dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mt-3">Instellingen</h1>
        <p className="text-gray-400 mt-1">Beheer uw bedrijfsprofiel, team en betaalgegevens</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-navy-light rounded-xl p-1 border border-purple/10 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-purple/15 text-cyan border border-purple/20'
                : 'text-gray-400 hover:text-white hover:bg-purple/5'
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
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
        <h2 className="text-white font-semibold mb-6">Bedrijfsgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Bedrijfsnaam</label>
            <input type="text" defaultValue="TechCorp Solutions B.V." className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">KVK-nummer</label>
            <input type="text" defaultValue="12345678" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Adres</label>
            <input type="text" defaultValue="Herengracht 182" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Postcode &amp; Plaats</label>
            <input type="text" defaultValue="1016 BR Amsterdam" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Website</label>
            <input type="text" defaultValue="https://techcorp.nl" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Telefoonnummer</label>
            <input type="text" defaultValue="+31 20 123 4567" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
          </div>
        </div>
      </div>

      {/* Gestructureerde velden */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
        <h2 className="text-white font-semibold mb-2">Bedrijfsprofiel</h2>
        <p className="text-gray-500 text-xs mb-6">Deze informatie wordt getoond bij uw vacatures</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Branche</label>
            <select defaultValue="IT & Software" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50">
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
            <label className="text-xs text-gray-500 mb-1.5 block">Bedrijfsgrootte</label>
            <select defaultValue="50-200" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50">
              <option value="1-10">1 - 10 medewerkers</option>
              <option value="11-50">11 - 50 medewerkers</option>
              <option value="50-200">50 - 200 medewerkers</option>
              <option value="200-1000">200 - 1.000 medewerkers</option>
              <option value="1000+">1.000+ medewerkers</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1.5 block">Bedrijfscultuur</label>
            <input type="text" defaultValue="Informeel, innovatief, hybride werken" placeholder="Bijv. informeel, resultaatgericht, teamwork" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
          </div>
        </div>
      </div>

      {/* Vrij tekstveld */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
        <h2 className="text-white font-semibold mb-2">Over uw bedrijf</h2>
        <p className="text-gray-500 text-xs mb-4">Vertel kandidaten wat uw bedrijf uniek maakt</p>
        <textarea
          rows={5}
          defaultValue="TechCorp Solutions is een snelgroeiend technologiebedrijf dat gespecialiseerd is in AI-gedreven HR-oplossingen. Wij geloven in de kracht van data om betere beslissingen te nemen. Ons team van 120 professionals werkt vanuit Amsterdam en remote aan innovatieve producten die de toekomst van werk vormgeven."
          className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600 resize-none"
          placeholder="Beschrijf uw bedrijf, missie, cultuur en wat u een aantrekkelijke werkgever maakt..."
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-600">Markdown wordt ondersteund</span>
          <span className="text-xs text-gray-600">348 / 1000 tekens</span>
        </div>
      </div>

      {/* Logo upload */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
        <h2 className="text-white font-semibold mb-4">Bedrijfslogo</h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-navy border-2 border-dashed border-purple/20 flex items-center justify-center text-gray-600">
            <span className="text-3xl">🏢</span>
          </div>
          <div>
            <button className="bg-purple/15 text-purple-light px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple/25 transition-colors border border-purple/20">
              Logo uploaden
            </button>
            <p className="text-xs text-gray-600 mt-2">PNG, JPG of SVG. Max 2MB. Aanbevolen: 400×400px</p>
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
          <h2 className="text-white font-semibold">Teamleden</h2>
          <p className="text-gray-500 text-xs mt-1">Beheer wie toegang heeft tot uw bedrijfsaccount</p>
        </div>
        <button
          onClick={() => setInviteModalOpen(true)}
          className="bg-gradient-to-r from-cyan via-blue to-purple text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>+</span> Teamlid uitnodigen
        </button>
      </div>

      {/* Gebruikers indicator */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 flex items-center gap-2">
            <span>👥</span> 4 van 5 gebruikers inbegrepen
          </span>
          <span className="text-xs text-gray-600">4 / 5</span>
        </div>
        <div className="h-2 w-full rounded-full bg-navy overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan via-blue to-purple transition-all duration-500" style={{ width: '80%' }} />
        </div>
        <p className="text-xs text-gray-600 mt-2">Extra gebruikers kunnen worden uitgenodigd voor €15/maand per gebruiker (ex. 21% BTW).</p>
      </div>

      {/* Rollen uitleg */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-4">
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <span className="font-semibold text-white">Rollen:</span>
          <span><span className="text-purple-light font-medium">Owner</span> = volledige controle + eigenaarschap overdragen</span>
          <span><span className="text-cyan font-medium">Admin</span> = team &amp; bedrijfsgegevens beheren</span>
          <span><span className="text-gray-300 font-medium">Gebruiker</span> = eigen vacatures schrijven &amp; beheren</span>
        </div>
      </div>

      {/* Members tabel */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_2fr_1.2fr_1.2fr_1.5fr] gap-2 px-6 py-3 text-xs text-gray-500 uppercase tracking-wider border-b border-purple/10 bg-navy-dark/50">
          <div>Naam</div>
          <div>E-mail</div>
          <div>Rol</div>
          <div>Toegevoegd</div>
          <div className="text-right">Acties</div>
        </div>

        {mockMembers.map(member => (
          <div key={member.id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.2fr_1.2fr_1.5fr] gap-2 px-6 py-4 border-b border-purple/5 items-center hover:bg-purple/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center text-purple-light font-bold text-xs">
                {member.naam.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className="text-white font-medium text-sm">{member.naam}</span>
            </div>
            <div className="text-gray-500 text-sm">{member.email}</div>
            <div><RoleBadge role={member.role} /></div>
            <div className="text-gray-500 text-sm">{formatDate(member.toegevoegd)}</div>
            <div className="flex justify-end gap-2">
              {member.role === 'owner' ? (
                <button
                  onClick={() => setTransferModalOpen(true)}
                  className="text-xs text-purple-light hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  ⇄ Overdragen
                </button>
              ) : (
                <>
                  <select
                    defaultValue={member.role}
                    className="bg-navy border border-purple/20 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-cyan/50"
                  >
                    <option value="admin">Admin</option>
                    <option value="gebruiker">Gebruiker</option>
                  </select>
                  <button className="rounded-lg p-1.5 text-gray-600 hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Verwijderen">
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
          <h3 className="text-white font-semibold">
            Openstaande uitnodigingen <span className="text-gray-500 font-normal text-sm">({mockInvites.length})</span>
          </h3>
          <div className="bg-navy-light rounded-2xl border border-purple/10 overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-6 py-3 text-xs text-gray-500 uppercase tracking-wider border-b border-purple/10 bg-navy-dark/50">
              <div>E-mail</div>
              <div>Rol</div>
              <div>Verloopt op</div>
              <div className="text-right">Actie</div>
            </div>
            {mockInvites.map(invite => (
              <div key={invite.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-6 py-4 border-b border-purple/5 items-center">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span>✉️</span> {invite.email}
                </div>
                <div><RoleBadge role={invite.role} /></div>
                <div className="text-gray-500 text-sm">{formatDate(invite.verloopt)}</div>
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
          <div className="bg-navy-light rounded-2xl border border-purple/20 p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Teamlid uitnodigen</h3>
            <p className="text-gray-400 text-sm mb-6">Stuur een uitnodiging per e-mail. De link is 7 dagen geldig.</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">E-mailadres</label>
                <input type="email" placeholder="naam@bedrijf.nl" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-3 block">Rol</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 rounded-xl border border-cyan/20 bg-cyan/5 p-4 cursor-pointer">
                    <input type="radio" name="invite-role" value="admin" className="mt-0.5 accent-cyan" />
                    <div>
                      <div className="text-sm font-medium text-white">Admin</div>
                      <div className="text-xs text-gray-500">Kan team en bedrijfsgegevens beheren, betaalgegevens aanpassen</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 rounded-xl border border-purple/20 bg-purple/5 p-4 cursor-pointer">
                    <input type="radio" name="invite-role" value="gebruiker" defaultChecked className="mt-0.5 accent-purple" />
                    <div>
                      <div className="text-sm font-medium text-white">Gebruiker</div>
                      <div className="text-xs text-gray-500">Kan eigen vacatures schrijven en kandidaten beheren</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1 bg-navy border border-purple/20 text-gray-400 px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-white transition-colors"
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
          <div className="bg-navy-light rounded-2xl border border-purple/20 p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Eigenaarschap overdragen</h3>

            <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-6">
              <p className="text-sm text-orange">
                <strong>Let op:</strong> na de overdracht wordt u zelf admin en kan alleen de nieuwe eigenaar dit terugdraaien.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Nieuwe eigenaar</label>
                <select className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50">
                  <option value="">Selecteer een teamlid...</option>
                  {mockMembers.filter(m => m.role !== 'owner').map(m => (
                    <option key={m.id} value={m.id}>{m.naam} — {m.role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Bevestig met uw wachtwoord</label>
                <input type="password" placeholder="Uw huidige wachtwoord" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setTransferModalOpen(false)}
                  className="flex-1 bg-navy border border-purple/20 text-gray-400 px-4 py-2.5 rounded-lg text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuleren
                </button>
                <button className="flex-1 bg-purple/20 text-purple-light px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple/30 transition-colors border border-purple/30">
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
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Huidig plan</h2>
          <span className="px-3 py-1 bg-cyan/15 text-cyan rounded-lg text-xs font-bold border border-cyan/20">PROFESSIONAL</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-navy rounded-xl border border-purple/10 p-4 text-center">
            <div className="text-2xl font-bold text-white">€299</div>
            <div className="text-xs text-gray-500 mt-1">per maand (ex. BTW)</div>
          </div>
          <div className="bg-navy rounded-xl border border-purple/10 p-4 text-center">
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-xs text-gray-500 mt-1">gebruikers inbegrepen</div>
          </div>
          <div className="bg-navy rounded-xl border border-purple/10 p-4 text-center">
            <div className="text-2xl font-bold text-white">∞</div>
            <div className="text-xs text-gray-500 mt-1">vacatures</div>
          </div>
        </div>
      </div>

      {/* Betaalmethode */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
        <h2 className="text-white font-semibold mb-4">Betaalmethode</h2>
        <div className="flex items-center gap-4 bg-navy rounded-xl border border-purple/10 p-4">
          <div className="w-12 h-8 rounded bg-gradient-to-r from-blue to-purple flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
          <div>
            <div className="text-white text-sm font-medium">•••• •••• •••• 4242</div>
            <div className="text-xs text-gray-500">Verloopt 12/2028</div>
          </div>
          <button className="ml-auto text-xs text-purple-light hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors border border-purple/20">
            Wijzigen
          </button>
        </div>
      </div>

      {/* Factuurgegevens */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
        <h2 className="text-white font-semibold mb-4">Factuurgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Bedrijfsnaam</label>
            <input type="text" defaultValue="TechCorp Solutions B.V." className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50" readOnly />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">BTW-nummer</label>
            <input type="text" defaultValue="NL123456789B01" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50 placeholder-gray-600" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Factuuradres</label>
            <input type="text" defaultValue="Herengracht 182" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Facturatie e-mail</label>
            <input type="text" defaultValue="facturen@techcorp.nl" className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan/50" />
          </div>
        </div>
      </div>

      {/* Factuurhistorie */}
      <div className="bg-navy-light rounded-2xl border border-purple/10 p-6">
        <h2 className="text-white font-semibold mb-4">Recente facturen</h2>
        <div className="space-y-2">
          {[
            { datum: '01-03-2026', bedrag: '€299,00', status: 'Betaald' },
            { datum: '01-02-2026', bedrag: '€299,00', status: 'Betaald' },
            { datum: '01-01-2026', bedrag: '€299,00', status: 'Betaald' },
          ].map((factuur, i) => (
            <div key={i} className="flex items-center justify-between bg-navy rounded-xl border border-purple/10 p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">{factuur.datum}</span>
                <span className="text-sm text-white font-medium">{factuur.bedrag}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">{factuur.status}</span>
                <button className="text-xs text-purple-light hover:bg-purple/10 px-3 py-1.5 rounded-lg transition-colors">
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
