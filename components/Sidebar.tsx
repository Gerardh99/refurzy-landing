'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRole } from '@/lib/types'

const navItems: Record<UserRole, { href: string; label: string; icon: string; badge?: number }[]> = {
  opdrachtgever: [
    { href: '/homepage', label: 'Homepage', icon: '🏠' },
    { href: '/demo/opdrachtgever', label: 'Dashboard', icon: '📊' },
    { href: '/demo/opdrachtgever/vacature-aanmaken', label: 'Vacature aanmaken', icon: '➕' },
    { href: '/demo/opdrachtgever/kandidaten', label: 'Kandidaten', icon: '👤' },
    { href: '/demo/opdrachtgever/matching-profiel', label: 'M-Score Profiel', icon: '🧪' },
    { href: '/demo/opdrachtgever/fit-garantie', label: 'Fit Garantie', icon: '🛡️' },
    { href: '/demo/opdrachtgever/bedrijfsprofiel', label: 'Bedrijfsprofiel', icon: '🏢' },
    { href: '/demo/opdrachtgever/contracten', label: 'Contracten', icon: '📄' },
    { href: '/demo/opdrachtgever/facturen', label: 'Facturen', icon: '🧾' },
    { href: '/demo/berichten', label: 'Berichten', icon: '💬', badge: 1 },
    { href: '/demo/opdrachtgever/instellingen', label: 'Instellingen', icon: '⚙️' },
    { href: '/demo/notificaties', label: 'Notificaties', icon: '🔔' },
  ],
  scout: [
    { href: '/homepage', label: 'Homepage', icon: '🏠' },
    { href: '/demo/scout', label: 'Talent Pool', icon: '👥' },
    { href: '/demo/scout/vacatures', label: 'Vacatures', icon: '📋' },
    { href: '/demo/scout/pipeline', label: 'Pipeline', icon: '📈' },
    { href: '/demo/scout/analytics', label: 'Analytics', icon: '📊' },
    { href: '/demo/scout/verdiensten', label: 'Verdiensten', icon: '💰' },
    { href: '/demo/scout/facturen', label: 'Facturen', icon: '🧾' },
    { href: '/demo/scout/kandidaat-uitnodigen', label: 'Kandidaat uitnodigen', icon: '✉️' },
    { href: '/demo/berichten', label: 'Berichten', icon: '💬', badge: 2 },
    { href: '/demo/scout/meldingen', label: 'Meldingen', icon: '🔔' },
    { href: '/demo/scout/instellingen', label: 'Instellingen', icon: '⚙️' },
    { href: '/demo/notificaties', label: 'Notificaties', icon: '🔔' },
  ],
  kandidaat: [
    { href: '/homepage', label: 'Homepage', icon: '🏠' },
    { href: '/demo/kandidaat', label: 'Dashboard', icon: '📊' },
    { href: '/demo/kandidaat/matching-scan', label: 'Matching Scan', icon: '🧪' },
    { href: '/demo/kandidaat/pipeline', label: 'Mijn voortgang', icon: '📈' },
    { href: '/demo/kandidaat/profiel', label: 'Profiel', icon: '👤' },
    { href: '/demo/berichten', label: 'Berichten', icon: '💬', badge: 1 },
    { href: '/demo/notificaties', label: 'Notificaties', icon: '🔔' },
  ],
  admin: [
    { href: '/homepage', label: 'Homepage', icon: '🏠' },
    { href: '/demo/admin', label: 'Dashboard', icon: '📊' },
    { href: '/demo/admin/pricing', label: 'Pricing', icon: '💰' },
    { href: '/demo/admin/landen', label: 'Landen', icon: '🌍' },
    { href: '/demo/admin/gebruikers', label: 'Gebruikers', icon: '👥' },
    { href: '/demo/admin/facturen', label: 'Facturen', icon: '🧾' },
    { href: '/demo/admin/uitbetalingen', label: 'Uitbetalingen', icon: '🏦' },
    { href: '/demo/admin/fit-garantie', label: 'Fit Garantie', icon: '🛡️' },
    { href: '/demo/admin/scan-gebruik', label: 'VU Test Log', icon: '🎓' },
    { href: '/demo/admin/email-templates', label: 'Email Templates', icon: '✉️' },
    { href: '/demo/berichten', label: 'Berichten', icon: '💬' },
    { href: '/demo/notificaties', label: 'Notificaties', icon: '🔔' },
  ],
}

const roleLabels: Record<UserRole, string> = {
  opdrachtgever: 'Opdrachtgever',
  scout: 'Talent Scout',
  kandidaat: 'Kandidaat',
  admin: 'Refurzy Admin',
}

export default function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const items = navItems[role]

  return (
    <aside className="w-64 bg-navy-light border-r border-purple/10 min-h-screen flex flex-col">
      <div className="p-6 border-b border-purple/10">
        <Link href={`/demo/${role}`} className="block">
          <img src="/assets/refurzy-logo-white.png" alt="Refurzy" className="h-8" />
        </Link>
        <div className="mt-3 px-2 py-1 bg-purple/10 rounded text-purple-light text-xs font-medium inline-block">
          {roleLabels[role]}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map(item => {
          const isActive = pathname === item.href || (item.href !== `/demo/${role}` && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-purple/15 text-cyan border border-purple/20' : 'text-gray-400 hover:text-white hover:bg-purple/5'
              }`}>
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-cyan text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-purple/10 space-y-1">
        <Link href="/demo/theme-preview"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan transition-colors px-3 py-2">
          <span>🎨</span> Theme preview
        </Link>
        <Link href="/login" onClick={() => { if (typeof window !== 'undefined') sessionStorage.removeItem('refurzy_user') }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors px-3 py-2">
          <span>↩</span> Uitloggen
        </Link>
      </div>
    </aside>
  )
}
