'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, getRolePath } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const user = login(email, password)
    if (user) {
      router.push(getRolePath(user.role))
    } else {
      setError('Ongeldige inloggegevens.')
    }
  }

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/assets/refurzy-logo-white.png" alt="Refurzy" className="h-10 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Demo Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-navy-light rounded-2xl p-8 border border-purple/20">
          <h2 className="text-xl font-semibold mb-6">Inloggen</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1.5">E-mailadres</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-colors"
              placeholder="je@email.nl" required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1.5">Wachtwoord</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-navy border border-purple/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-colors"
              placeholder="••••••••" required
            />
          </div>

          <button type="submit" className="w-full btn-gradient text-white font-semibold py-3 rounded-[10px] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
            Inloggen
          </button>

        </form>

        {/* Demo accounts */}
        <div className="mt-6 bg-navy-light/50 rounded-2xl p-5 border border-purple/10">
          <p className="text-xs text-gray-600 mb-3 font-medium uppercase tracking-wider">Demo accounts</p>
          <div className="space-y-2">
            {[
              { email: 'demo@bedrijf.nl', label: 'Opdrachtgever', icon: '🏢' },
              { email: 'scout@refurzy.nl', label: 'Talent Scout', icon: '🔍' },
              { email: 'kandidaat@refurzy.nl', label: 'Kandidaat', icon: '👤' },
              { email: 'admin@refurzy.nl', label: 'Refurzy Admin', icon: '⚙️' },
            ].map(acc => (
              <button
                key={acc.email}
                onClick={() => { setEmail(acc.email) }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-purple/10 transition-colors text-left"
              >
                <span>{acc.icon}</span>
                <span className="flex-1">{acc.label}</span>
                <span className="text-xs text-gray-600">{acc.email}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-700 mt-3">Klik op een account om het e-mailadres in te vullen. Voer het wachtwoord handmatig in.</p>
        </div>
      </div>
    </div>
  )
}
