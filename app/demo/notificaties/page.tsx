'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { UserRole } from '@/lib/types'
import { mockNotifications, notificationIcons, notificationTypeLabels, NotificationType, Notification } from '@/lib/mock-notifications'

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

const allTypes: NotificationType[] = ['vacancy', 'match', 'contract', 'message', 'system']

export default function NotificatiesPage() {
  const [role, setRole] = useState<UserRole>('opdrachtgever')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all')

  useEffect(() => {
    const user = getUser()
    if (user) {
      setRole(user.role)
      setNotifications(mockNotifications[user.role] || [])
    }
  }, [])

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const filtered = filterType === 'all'
    ? notifications
    : notifications.filter(n => n.type === filterType)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Notificaties</h1>
          <p className="text-ink-muted mt-1">
            {unreadCount > 0 ? `${unreadCount} ongelezen` : 'Alles gelezen'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="px-4 py-2 text-sm font-medium text-purple border border-purple/20 rounded-lg hover:bg-purple/5 transition-colors">
            Alles als gelezen markeren
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            filterType === 'all' ? 'bg-purple text-white border-purple' : 'bg-white text-ink border-surface-border hover:border-purple/40'
          }`}>
          Alles ({notifications.length})
        </button>
        {allTypes.map(type => {
          const count = notifications.filter(n => n.type === type).length
          if (count === 0) return null
          return (
            <button key={type} onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filterType === type ? 'bg-purple text-white border-purple' : 'bg-white text-ink border-surface-border hover:border-purple/40'
              }`}>
              {notificationIcons[type]} {notificationTypeLabels[type]} ({count})
            </button>
          )
        })}
      </div>

      {/* Notification list */}
      <div className="bg-white rounded-xl border border-surface-border divide-y divide-surface-border overflow-hidden">
        {filtered.map(notification => (
          <div key={notification.id}
            className={`flex items-start gap-4 p-5 hover:bg-surface-muted/30 transition-colors ${!notification.read ? 'bg-purple/[0.02]' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center flex-shrink-0 text-lg">
              {notificationIcons[notification.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-sm ${!notification.read ? 'font-semibold text-ink' : 'font-medium text-ink-light'}`}>
                  {notification.title}
                </span>
                {!notification.read && <span className="w-2 h-2 bg-purple rounded-full flex-shrink-0" />}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-muted text-ink-muted ml-auto flex-shrink-0">
                  {notificationTypeLabels[notification.type]}
                </span>
              </div>
              <p className="text-sm text-ink-light">{notification.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-ink-muted">{timeAgo(notification.timestamp)}</span>
                {notification.link && (
                  <Link href={notification.link} className="text-xs text-purple hover:text-purple-dark font-medium">
                    Bekijken
                  </Link>
                )}
              </div>
            </div>
            <button onClick={() => toggleRead(notification.id)}
              className="text-ink-muted hover:text-ink-muted mt-1 flex-shrink-0 p-1" title={notification.read ? 'Markeer als ongelezen' : 'Markeer als gelezen'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={notification.read ? 'none' : 'currentColor'} stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-ink-muted">
            Geen notificaties gevonden{filterType !== 'all' ? ` voor type "${notificationTypeLabels[filterType]}"` : ''}.
          </div>
        )}
      </div>
    </div>
  )
}
