'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRole } from '@/lib/types'

interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

const navGroups: Record<UserRole, NavGroup[]> = {
  scout: [
    {
      items: [
        { href: '/homepage', label: 'Homepage', icon: '🏠' },
      ],
    },
    {
      title: 'Werven',
      items: [
        { href: '/demo/scout', label: 'Talent Pool', icon: '👥' },
        { href: '/demo/scout/vacatures', label: 'Vacatures', icon: '📋' },
        { href: '/demo/scout/pipeline', label: 'Pipeline', icon: '📈' },
        { href: '/demo/scout/kandidaat-uitnodigen', label: 'Kandidaat uitnodigen', icon: '✉️' },
      ],
    },
    {
      title: 'Updates',
      items: [
        { href: '/demo/notificaties', label: 'Notificaties', icon: '🔔' },
      ],
    },
    {
      title: 'Financieel',
      items: [
        { href: '/demo/scout/verdiensten', label: 'Verdiensten', icon: '💰' },
        { href: '/demo/scout/analytics', label: 'Analytics', icon: '📊' },
        { href: '/demo/scout/facturen', label: 'Facturen', icon: '🧾' },
      ],
    },
    {
      title: 'Beheer',
      items: [
        { href: '/demo/scout/instellingen', label: 'Instellingen', icon: '⚙️' },
      ],
    },
  ],
  opdrachtgever: [
    {
      items: [
        { href: '/homepage', label: 'Homepage', icon: '🏠' },
      ],
    },
    {
      title: 'Werving',
      items: [
        { href: '/demo/opdrachtgever', label: 'Dashboard', icon: '📊' },
        { href: '/demo/opdrachtgever/vacature-aanmaken', label: 'Vacature aanmaken', icon: '➕' },
        { href: '/demo/opdrachtgever/kandidaten', label: 'Kandidaten', icon: '👤' },
        { href: '/demo/opdrachtgever/matching-profiel', label: 'M-Score Profiel', icon: '🧪' },
      ],
    },
    {
      title: 'Updates',
      items: [
        { href: '/demo/notificaties', label: 'Notificaties', icon: '🔔' },
      ],
    },
    {
      title: 'Financieel',
      items: [
        { href: '/demo/opdrachtgever/contracten', label: 'Contracten', icon: '📄' },
        { href: '/demo/opdrachtgever/facturen', label: 'Facturen', icon: '🧾' },
        { href: '/demo/opdrachtgever/fit-garantie', label: 'Fit Garantie', icon: '🛡️' },
      ],
    },
    {
      title: 'Beheer',
      items: [
        { href: '/demo/opdrachtgever/bedrijfsprofiel', label: 'Bedrijfsprofiel', icon: '🏢' },
        { href: '/demo/opdrachtgever/instellingen', label: 'Instellingen', icon: '⚙️' },
      ],
    },
  ],
  kandidaat: [
    {
      items: [
        { href: '/homepage', label: 'Homepage', icon: '🏠' },
      ],
    },
    {
      title: 'Mijn profiel',
      items: [
        { href: '/demo/kandidaat', label: 'Dashboard', icon: '📊' },
        { href: '/demo/kandidaat/matching-scan', label: 'Matching Scan', icon: '🧪' },
        { href: '/demo/kandidaat/profiel', label: 'Profiel', icon: '👤' },
      ],
    },
    {
      title: 'Sollicitaties',
      items: [
        { href: '/demo/kandidaat/pipeline', label: 'Mijn voortgang', icon: '📈' },
      ],
    },
    {
      title: 'Updates',
      items: [
        { href: '/demo/notificaties', label: 'Notificaties', icon: '🔔' },
      ],
    },
  ],
  admin: [
    {
      items: [
        { href: '/homepage', label: 'Homepage', icon: '🏠' },
      ],
    },
    {
      title: 'Platform',
      items: [
        { href: '/demo/admin', label: 'Dashboard', icon: '📊' },
        { href: '/demo/admin/gebruikers', label: 'Gebruikers', icon: '👥' },
        { href: '/demo/admin/landen', label: 'Landen', icon: '🌍' },
      ],
    },
    {
      title: 'Financieel',
      items: [
        { href: '/demo/admin/pricing', label: 'Pricing', icon: '💰' },
        { href: '/demo/admin/facturen', label: 'Facturen', icon: '🧾' },
        { href: '/demo/admin/uitbetalingen', label: 'Uitbetalingen', icon: '🏦' },
      ],
    },
    {
      title: 'Kwaliteit',
      items: [
        { href: '/demo/admin/fit-garantie', label: 'Fit Garantie', icon: '🛡️' },
        { href: '/demo/admin/scan-gebruik', label: 'VU Test Log', icon: '🎓' },
      ],
    },
    {
      title: 'Communicatie',
      items: [
        { href: '/demo/admin/email-templates', label: 'Email Templates', icon: '✉️' },
        { href: '/demo/notificaties', label: 'Notificaties', icon: '🔔' },
      ],
    },
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
  const groups = navGroups[role]

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

      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 px-3 mb-1.5">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href || (item.href !== `/demo/${role}` && item.href !== '/homepage' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
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
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-purple/10 space-y-0.5">
        <Link href="/demo/help"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan transition-colors px-3 py-2">
          <span>❓</span> Help & Support
        </Link>
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
