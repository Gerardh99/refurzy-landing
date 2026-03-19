'use client'

import { useState, useRef, useEffect } from 'react'
import { User } from '@/lib/types'
import NotificationBell from '@/app/demo/components/NotificationBell'
import Link from 'next/link'

export default function TopBar({ user }: { user: User }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-8">
      <Link href="/homepage" className="text-sm text-ink-muted hover:text-ink transition-colors flex items-center gap-1.5">
        <span>←</span> Homepage
      </Link>
      <div className="flex items-center gap-3">
        <NotificationBell role={user.role} />

        {/* Avatar met dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </div>
            <svg className={`w-4 h-4 text-ink-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-surface-border py-1 z-50">
              <Link
                href={`/demo/${user.role === 'opdrachtgever' ? 'opdrachtgever' : user.role === 'scout' ? 'scout' : user.role === 'kandidaat' ? 'kandidaat' : 'admin'}`}
                className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-muted transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href={`/demo/${user.role === 'opdrachtgever' ? 'opdrachtgever/bedrijfsprofiel' : user.role === 'scout' ? 'scout/analytics' : user.role === 'kandidaat' ? 'kandidaat' : 'admin'}`}
                className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-muted transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Instellingen
              </Link>
              <div className="border-t border-surface-border my-1" />
              <Link
                href="/login"
                className="block px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Uitloggen
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
