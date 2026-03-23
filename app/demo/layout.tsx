'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUser, profileLogin } from '@/lib/auth'
import { User } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isOnboarding = pathname?.startsWith('/demo/onboarding')

  useEffect(() => {
    if (isOnboarding) return

    const roleEmails: Record<string, string> = {
      opdrachtgever: 'demo@bedrijf.nl',
      scout: 'scout@refurzy.com',
      kandidaat: 'kandidaat@email.com',
      admin: 'admin@refurzy.com',
    }

    async function checkAuth() {
      // 1. Already logged in?
      const existing = getUser()
      if (existing) {
        setUser(existing)
        setAuthChecked(true)
        return
      }

      // 2. Auto-login via ?role= query param (feedback Excel links)
      const params = new URLSearchParams(window.location.search)
      const roleParam = params.get('role')
      if (roleParam && roleEmails[roleParam]) {
        const u = await profileLogin(roleEmails[roleParam])
        if (u) {
          setUser(u)
          setAuthChecked(true)
          return
        }
      }

      // 3. No auth → redirect to login
      setAuthChecked(true)
      router.push('/login')
    }

    checkAuth()
  }, [router, isOnboarding])

  // Onboarding pages render without sidebar/topbar
  if (isOnboarding) {
    return <>{children}</>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-purple animate-pulse">Laden...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col">
        <TopBar user={user} />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
