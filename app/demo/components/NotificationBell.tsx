'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { UserRole } from '@/lib/types'
import { mockNotifications, notificationIcons, Notification } from '@/lib/mock-notifications'

function timeAgo(timestamp: string): string {
  const now = new Date('2026-03-19T12:00:00Z')
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} min geleden`
  if (diffHours < 24) return `${diffHours} uur geleden`
  if (diffDays === 1) return 'gisteren'
  if (diffDays < 7) return `${diffDays} dagen geleden`
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

export default function NotificationBell({ role }: { role: UserRole }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications[role] || [])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-surface-border shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
            <h3 className="text-sm font-semibold text-ink">Notificaties</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-purple hover:text-purple-dark font-medium">
                  Alles gelezen
                </button>
              )}
              <Link href="/demo/notificaties" onClick={() => setOpen(false)}
                className="text-xs text-ink-muted hover:text-ink font-medium">
                Alles bekijken
              </Link>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y divide-surface-border">
            {notifications.slice(0, 6).map(notification => (
              <div key={notification.id}
                className={`px-4 py-3 flex items-start gap-3 hover:bg-surface-muted/50 transition-colors ${!notification.read ? 'bg-purple/[0.03]' : ''}`}>
                <span className="text-lg mt-0.5 flex-shrink-0">{notificationIcons[notification.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${!notification.read ? 'font-semibold text-ink' : 'font-medium text-ink-light'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && <span className="w-2 h-2 bg-purple rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">{notification.description}</p>
                  <p className="text-[11px] text-ink-muted mt-1">{timeAgo(notification.timestamp)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleRead(notification.id) }}
                  className="text-ink-muted hover:text-ink-muted mt-1 flex-shrink-0" title={notification.read ? 'Markeer als ongelezen' : 'Markeer als gelezen'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={notification.read ? 'none' : 'currentColor'} stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="px-4 py-8 text-center text-ink-muted text-sm">
              Geen notificaties
            </div>
          )}
        </div>
      )}
    </div>
  )
}
