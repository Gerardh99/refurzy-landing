'use client'

import { User } from '@/lib/types'

export default function TopBar({ user }: { user: User }) {
  return (
    <header className="h-16 bg-navy-light border-b border-purple/10 flex items-center justify-between px-8">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-500">{user.company || user.email}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center text-sm font-bold text-navy-dark">
          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      </div>
    </header>
  )
}
