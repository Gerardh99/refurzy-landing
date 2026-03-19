'use client'

import Link from 'next/link'
import { COUNTRIES } from '@/lib/pricing'

export default function AdminDashboard() {
  const activeLanden = COUNTRIES.filter(c => c.active).length
  const totalLanden = COUNTRIES.length

  const stats = [
    { label: 'Actieve landen', value: activeLanden, icon: '🌍', sub: `van ${totalLanden} geconfigureerd` },
    { label: 'Opdrachtgevers', value: 24, icon: '🏢', sub: 'actieve accounts' },
    { label: 'Talent Scouts', value: 87, icon: '🔍', sub: 'geregistreerd' },
    { label: 'Kandidaten', value: 312, icon: '👤', sub: 'profiel compleet' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Refurzy Admin</h1>
        <p className="text-gray-400 mt-1">Platform beheer en configuratie</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-navy-light rounded-2xl border border-purple/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-600 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/demo/admin/pricing" className="bg-navy-light rounded-2xl border border-purple/10 p-6 hover:border-purple/25 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💰</span>
            <h2 className="text-lg font-semibold text-white group-hover:text-cyan transition-colors">Pricing beheer</h2>
          </div>
          <p className="text-gray-400 text-sm">Pas puntwaarden, ervarings- en opleidingsmultipliers aan per land. No Cure No Pay model.</p>
        </Link>

        <Link href="/demo/admin/landen" className="bg-navy-light rounded-2xl border border-purple/10 p-6 hover:border-purple/25 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🌍</span>
            <h2 className="text-lg font-semibold text-white group-hover:text-cyan transition-colors">Landen configuratie</h2>
          </div>
          <p className="text-gray-400 text-sm">Beheer actieve landen, talen en valuta-instellingen voor de internationale uitrol.</p>
        </Link>

        <Link href="/demo/admin/gebruikers" className="bg-navy-light rounded-2xl border border-purple/10 p-6 hover:border-purple/25 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👥</span>
            <h2 className="text-lg font-semibold text-white group-hover:text-cyan transition-colors">Gebruikers overzicht</h2>
          </div>
          <p className="text-gray-400 text-sm">Overzicht van alle opdrachtgevers, scouts en kandidaten op het platform.</p>
        </Link>

        <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📈</span>
            <h2 className="text-lg font-semibold text-white">Analytics</h2>
          </div>
          <p className="text-gray-400 text-sm">Platform statistieken en rapportages. <span className="text-purple-light">(Binnenkort)</span></p>
        </div>
      </div>
    </div>
  )
}
