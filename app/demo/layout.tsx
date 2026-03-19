'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { User } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const u = getUser()
    if (!u) {
      router.push('/login')
      return
    }
    setUser(u)
  }, [router])

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
