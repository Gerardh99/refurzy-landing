'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRole } from '@/lib/types'
import { useLang } from '@/lib/i18n'

interface NavItem {
  href: string
  label: string
  badge?: number
}

interface NavGroup {
  titleKey?: string
  items: NavItem[]
}

// Nav group title translation keys
const groupTitleTexts = {
  nl: {
    Werven: 'Werven',
    Updates: 'Updates',
    Financieel: 'Financieel',
    Beheer: 'Beheer',
    Werving: 'Werving',
    Platform: 'Platform',
    Kwaliteit: 'Kwaliteit',
    Communicatie: 'Communicatie',
    'Mijn profiel': 'Mijn profiel',
    Sollicitaties: 'Sollicitaties',
  } as Record<string, string>,
  en: {
    Werven: 'Recruiting',
    Updates: 'Updates',
    Financieel: 'Financial',
    Beheer: 'Settings',
    Werving: 'Recruitment',
    Platform: 'Platform',
    Kwaliteit: 'Quality',
    Communicatie: 'Communication',
    'Mijn profiel': 'My profile',
    Sollicitaties: 'Applications',
  } as Record<string, string>,
}

const navLabelsNl = {
  homepage: 'Homepage',
  // scout
  talentPool: 'Talent Pool',
  vacatures: 'Vacatures',
  pipeline: 'Pipeline',
  kandidaatUitnodigen: 'Kandidaat uitnodigen',
  notificaties: 'Notificaties',
  verdiensten: 'Verdiensten',
  analytics: 'Analytics',
  facturen: 'Facturen',
  instellingen: 'Instellingen',
  // opdrachtgever
  dashboard: 'Dashboard',
  vacatureAanmaken: 'Vacature aanmaken',
  mScoreProfiel: 'M-Score Profiel',
  contracten: 'Contracten',
  fitGarantie: 'Fit Garantie',
  bedrijfsprofiel: 'Bedrijfsprofiel',
  // kandidaat
  matchingScan: 'Matching Scan',
  profiel: 'Profiel',
  mijnVoortgang: 'Mijn voortgang',
  // admin
  gebruikers: 'Gebruikers',
  landen: 'Landen',
  pricing: 'Pricing',
  uitbetalingen: 'Uitbetalingen',
  vuTestLog: 'VU Test Log',
  emailTemplates: 'Email Templates',
  fraudemeldingen: 'Fraudemeldingen',
}

const navLabelsEn = {
  homepage: 'Homepage',
  // scout
  talentPool: 'Talent Pool',
  vacatures: 'Vacancies',
  pipeline: 'Pipeline',
  kandidaatUitnodigen: 'Invite candidate',
  notificaties: 'Notifications',
  verdiensten: 'Earnings',
  analytics: 'Analytics',
  facturen: 'Invoices',
  instellingen: 'Settings',
  // opdrachtgever
  dashboard: 'Dashboard',
  vacatureAanmaken: 'Create vacancy',
  mScoreProfiel: 'M-Score Profile',
  contracten: 'Contracts',
  fitGarantie: 'Fit Guarantee',
  bedrijfsprofiel: 'Company profile',
  // kandidaat
  matchingScan: 'Matching Scan',
  profiel: 'Profile',
  mijnVoortgang: 'My progress',
  // admin
  gebruikers: 'Users',
  landen: 'Countries',
  pricing: 'Pricing',
  uitbetalingen: 'Payouts',
  vuTestLog: 'VU Test Log',
  emailTemplates: 'Email Templates',
  fraudemeldingen: 'Fraud Reports',
}

type NavLabels = typeof navLabelsNl

function buildNavGroups(role: UserRole, lbl: NavLabels): NavGroup[] {
  switch (role) {
    case 'scout':
      return [
        {
          items: [
            { href: '/homepage', label: lbl.homepage },
          ],
        },
        {
          titleKey: 'Werven',
          items: [
            { href: '/demo/scout', label: lbl.talentPool },
            { href: '/demo/scout/vacatures', label: lbl.vacatures },
            { href: '/demo/scout/pipeline', label: lbl.pipeline },
            { href: '/demo/scout/kandidaat-uitnodigen', label: lbl.kandidaatUitnodigen },
          ],
        },
        {
          titleKey: 'Updates',
          items: [
            { href: '/demo/notificaties', label: lbl.notificaties },
          ],
        },
        {
          titleKey: 'Financieel',
          items: [
            { href: '/demo/scout/verdiensten', label: lbl.verdiensten },
            { href: '/demo/scout/analytics', label: lbl.analytics },
            { href: '/demo/scout/facturen', label: lbl.facturen },
          ],
        },
        {
          titleKey: 'Beheer',
          items: [
            { href: '/demo/scout/instellingen', label: lbl.instellingen },
          ],
        },
      ]
    case 'opdrachtgever':
      return [
        {
          items: [
            { href: '/homepage', label: lbl.homepage },
          ],
        },
        {
          titleKey: 'Werving',
          items: [
            { href: '/demo/opdrachtgever', label: lbl.dashboard },
            { href: '/demo/opdrachtgever/vacature-aanmaken', label: lbl.vacatureAanmaken },
            { href: '/demo/opdrachtgever/matching-profiel', label: lbl.mScoreProfiel },
          ],
        },
        {
          titleKey: 'Updates',
          items: [
            { href: '/demo/notificaties', label: lbl.notificaties },
          ],
        },
        {
          titleKey: 'Financieel',
          items: [
            { href: '/demo/opdrachtgever/contracten', label: lbl.contracten },
            { href: '/demo/opdrachtgever/facturen', label: lbl.facturen },
            { href: '/demo/opdrachtgever/fit-garantie', label: lbl.fitGarantie },
          ],
        },
        {
          titleKey: 'Beheer',
          items: [
            { href: '/demo/opdrachtgever/bedrijfsprofiel', label: lbl.bedrijfsprofiel },
            { href: '/demo/opdrachtgever/instellingen', label: lbl.instellingen },
          ],
        },
      ]
    case 'kandidaat':
      return [
        {
          items: [
            { href: '/homepage', label: lbl.homepage },
          ],
        },
        {
          titleKey: 'Mijn profiel',
          items: [
            { href: '/demo/kandidaat', label: lbl.dashboard },
            { href: '/demo/kandidaat/matching-scan', label: lbl.matchingScan },
            { href: '/demo/kandidaat/profiel', label: lbl.profiel },
          ],
        },
        {
          titleKey: 'Sollicitaties',
          items: [
            { href: '/demo/kandidaat/pipeline', label: lbl.mijnVoortgang },
          ],
        },
        {
          titleKey: 'Updates',
          items: [
            { href: '/demo/notificaties', label: lbl.notificaties },
          ],
        },
      ]
    case 'admin':
      return [
        {
          items: [
            { href: '/homepage', label: lbl.homepage },
          ],
        },
        {
          titleKey: 'Platform',
          items: [
            { href: '/demo/admin', label: lbl.dashboard },
            { href: '/demo/admin/gebruikers', label: lbl.gebruikers },
            { href: '/demo/admin/landen', label: lbl.landen },
          ],
        },
        {
          titleKey: 'Financieel',
          items: [
            { href: '/demo/admin/pricing', label: lbl.pricing },
            { href: '/demo/admin/facturen', label: lbl.facturen },
            { href: '/demo/admin/uitbetalingen', label: lbl.uitbetalingen },
          ],
        },
        {
          titleKey: 'Kwaliteit',
          items: [
            { href: '/demo/admin/fit-garantie', label: lbl.fitGarantie },
            { href: '/demo/admin/scan-gebruik', label: lbl.vuTestLog },
            { href: '/demo/admin/fraudemeldingen', label: lbl.fraudemeldingen },
          ],
        },
        {
          titleKey: 'Communicatie',
          items: [
            { href: '/demo/admin/email-templates', label: lbl.emailTemplates },
            { href: '/demo/notificaties', label: lbl.notificaties },
          ],
        },
      ]
  }
}

const roleLabels = {
  nl: {
    opdrachtgever: 'Opdrachtgever',
    scout: 'Talent Scout',
    kandidaat: 'Kandidaat',
    admin: 'Refurzy Admin',
  } as Record<UserRole, string>,
  en: {
    opdrachtgever: 'Client',
    scout: 'Talent Scout',
    kandidaat: 'Candidate',
    admin: 'Refurzy Admin',
  } as Record<UserRole, string>,
}

const footerTexts = {
  nl: {
    helpSupport: 'Help & Support',
    logout: 'Uitloggen',
  },
  en: {
    helpSupport: 'Help & Support',
    logout: 'Log out',
  },
}

export default function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const { lang } = useLang()

  const navLabels = lang === 'en' ? navLabelsEn : navLabelsNl
  const groups = buildNavGroups(role, navLabels)
  const groupTitles = groupTitleTexts[lang]
  const roleLbl = roleLabels[lang][role]
  const footer = footerTexts[lang]

  return (
    <aside className="w-64 bg-navy-light border-r border-purple/10 min-h-screen flex flex-col">
      <div className="p-6 border-b border-purple/10">
        <Link href={`/demo/${role}`} className="block">
          <img src="/assets/refurzy-logo-white.png" alt="Refurzy" className="h-8" />
        </Link>
        <div className="mt-3 px-2 py-1 bg-purple/10 rounded text-purple-light text-xs font-medium inline-block">
          {roleLbl}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.titleKey && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 mb-1.5">
                {groupTitles[group.titleKey] ?? group.titleKey}
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
          {footer.helpSupport}
        </Link>
        <Link href="/login" onClick={() => { if (typeof window !== 'undefined') sessionStorage.removeItem('refurzy_user') }}
          className="flex items-center text-[13px] font-medium text-gray-500 hover:text-red-400 transition-colors px-3 py-2">
          {footer.logout}
        </Link>
      </div>
    </aside>
  )
}
