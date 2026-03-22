'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRole } from '@/lib/types'

interface NavItem {
  href: string
  label: string
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
        { href: '/homepage', label: 'Homepage' },
      ],
    },
    {
      title: 'Werven',
      items: [
        { href: '/demo/scout', label: 'Talent Pool' },
        { href: '/demo/scout/vacatures', label: 'Vacatures' },
        { href: '/demo/scout/pipeline', label: 'Pipeline' },
        { href: '/demo/scout/kandidaat-uitnodigen', label: 'Kandidaat uitnodigen' },
      ],
    },
    {
      title: 'Updates',
      items: [
        { href: '/demo/notificaties', label: 'Notificaties' },
      ],
    },
    {
      title: 'Financieel',
      items: [
        { href: '/demo/scout/verdiensten', label: 'Verdiensten' },
        { href: '/demo/scout/analytics', label: 'Analytics' },
        { href: '/demo/scout/facturen', label: 'Facturen' },
      ],
    },
    {
      title: 'Beheer',
      items: [
        { href: '/demo/scout/instellingen', label: 'Instellingen' },
      ],
    },
  ],
  opdrachtgever: [
    {
      items: [
        { href: '/homepage', label: 'Homepage' },
      ],
    },
    {
      title: 'Werving',
      items: [
        { href: '/demo/opdrachtgever', label: 'Dashboard' },
        { href: '/demo/opdrachtgever/vacature-aanmaken', label: 'Vacature aanmaken' },
        { href: '/demo/opdrachtgever/matching-profiel', label: 'M-Score Profiel' },
      ],
    },
    {
      title: 'Updates',
      items: [
        { href: '/demo/notificaties', label: 'Notificaties' },
      ],
    },
    {
      title: 'Financieel',
      items: [
        { href: '/demo/opdrachtgever/contracten', label: 'Contracten' },
        { href: '/demo/opdrachtgever/facturen', label: 'Facturen' },
        { href: '/demo/opdrachtgever/fit-garantie', label: 'Fit Garantie' },
      ],
    },
    {
      title: 'Beheer',
      items: [
        { href: '/demo/opdrachtgever/bedrijfsprofiel', label: 'Bedrijfsprofiel' },
        { href: '/demo/opdrachtgever/instellingen', label: 'Instellingen' },
      ],
    },
  ],
  kandidaat: [
    {
      items: [
        { href: '/homepage', label: 'Homepage' },
      ],
    },
    {
      title: 'Mijn profiel',
      items: [
        { href: '/demo/kandidaat', label: 'Dashboard' },
        { href: '/demo/kandidaat/matching-scan', label: 'Matching Scan' },
        { href: '/demo/kandidaat/profiel', label: 'Profiel' },
      ],
    },
    {
      title: 'Sollicitaties',
      items: [
        { href: '/demo/kandidaat/pipeline', label: 'Mijn voortgang' },
      ],
    },
    {
      title: 'Updates',
      items: [
        { href: '/demo/notificaties', label: 'Notificaties' },
      ],
    },
  ],
  admin: [
    {
      items: [
        { href: '/homepage', label: 'Homepage' },
      ],
    },
    {
      title: 'Platform',
      items: [
        { href: '/demo/admin', label: 'Dashboard' },
        { href: '/demo/admin/gebruikers', label: 'Gebruikers' },
        { href: '/demo/admin/landen', label: 'Landen' },
      ],
    },
    {
      title: 'Financieel',
      items: [
        { href: '/demo/admin/pricing', label: 'Pricing' },
        { href: '/demo/admin/facturen', label: 'Facturen' },
        { href: '/demo/admin/uitbetalingen', label: 'Uitbetalingen' },
      ],
    },
    {
      title: 'Kwaliteit',
      items: [
        { href: '/demo/admin/fit-garantie', label: 'Fit Garantie' },
        { href: '/demo/admin/scan-gebruik', label: 'VU Test Log' },
      ],
    },
    {
      title: 'Communicatie',
      items: [
        { href: '/demo/admin/email-templates', label: 'Email Templates' },
        { href: '/demo/notificaties', label: 'Notificaties' },
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
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 mb-1.5">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href || (item.href !== `/demo/${role}` && item.href !== '/homepage' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      isActive ? 'bg-purple/15 text-cyan border border-purple/20' : 'text-gray-400 hover:text-white hover:bg-purple/5'
                    }`}>
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
          className="flex items-center text-[13px] font-medium text-gray-500 hover:text-cyan transition-colors px-3 py-2">
          Help & Support
        </Link>
        <Link href="/login" onClick={() => { if (typeof window !== 'undefined') sessionStorage.removeItem('refurzy_user') }}
          className="flex items-center text-[13px] font-medium text-gray-500 hover:text-red-400 transition-colors px-3 py-2">
          Uitloggen
        </Link>
      </div>
    </aside>
  )
}
