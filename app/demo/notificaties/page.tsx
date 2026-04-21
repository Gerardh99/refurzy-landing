'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { UserRole } from '@/lib/types'
import { mockNotifications, notificationIcons, NotificationType, Notification } from '@/lib/mock-notifications'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    title: 'Notificaties',
    unread: (count: number) => `${count} ongelezen`,
    allRead: 'Alles gelezen',
    markAllRead: 'Alles als gelezen markeren',
    filterAll: (count: number) => `Alles (${count})`,
    view: 'Bekijken',
    markAsUnread: 'Markeer als ongelezen',
    markAsRead: 'Markeer als gelezen',
    noNotifications: (label: string | null) =>
      label ? `Geen notificaties gevonden voor type "${label}".` : 'Geen notificaties gevonden.',
    typeLabels: {
      vacancy: 'Vacature',
      match: 'Match',
      contract: 'Contract',
      message: 'Bericht',
      system: 'Systeem',
    } as Record<NotificationType, string>,
    timeAgo: {
      minutesAgo: (n: number) => `${n} min geleden`,
      hoursAgo: (n: number) => `${n} uur geleden`,
      yesterday: 'gisteren',
      daysAgo: (n: number) => `${n} dagen geleden`,
    },
  },
  en: {
    title: 'Notifications',
    unread: (count: number) => `${count} unread`,
    allRead: 'All read',
    markAllRead: 'Mark all as read',
    filterAll: (count: number) => `All (${count})`,
    view: 'View',
    markAsUnread: 'Mark as unread',
    markAsRead: 'Mark as read',
    noNotifications: (label: string | null) =>
      label ? `No notifications found for type "${label}".` : 'No notifications found.',
    typeLabels: {
      vacancy: 'Vacancy',
      match: 'Match',
      contract: 'Contract',
      message: 'Message',
      system: 'System',
    } as Record<NotificationType, string>,
    timeAgo: {
      minutesAgo: (n: number) => `${n} min ago`,
      hoursAgo: (n: number) => `${n} hours ago`,
      yesterday: 'yesterday',
      daysAgo: (n: number) => `${n} days ago`,
    },
  },
}

const allTypes: NotificationType[] = ['vacancy', 'match', 'contract', 'message', 'system']

export default function NotificatiesPage() {
  const { lang } = useLang()
  const t = texts[lang]

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

  function timeAgo(timestamp: string): string {
    const now = new Date('2026-03-19T12:00:00Z')
    const date = new Date(timestamp)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return t.timeAgo.minutesAgo(diffMins)
    if (diffHours < 24) return t.timeAgo.hoursAgo(diffHours)
    if (diffDays === 1) return t.timeAgo.yesterday
    if (diffDays < 7) return t.timeAgo.daysAgo(diffDays)
    return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'nl-NL', { day: 'numeric', month: 'short' })
  }

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
          <h1 className="text-2xl font-semibold text-ink">{t.title}</h1>
          <p className="text-ink-muted mt-1">
            {unreadCount > 0 ? t.unread(unreadCount) : t.allRead}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="px-4 py-2 text-sm font-medium text-purple border border-purple/20 rounded-lg hover:bg-purple/5 transition-colors">
            {t.markAllRead}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            filterType === 'all' ? 'bg-purple text-white border-purple' : 'bg-white text-ink border-surface-border hover:border-purple/40'
          }`}>
          {t.filterAll(notifications.length)}
        </button>
        {allTypes.map(type => {
          const count = notifications.filter(n => n.type === type).length
          if (count === 0) return null
          return (
            <button key={type} onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filterType === type ? 'bg-purple text-white border-purple' : 'bg-white text-ink border-surface-border hover:border-purple/40'
              }`}>
              {notificationIcons[type]} {t.typeLabels[type]} ({count})
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
                  {notification.title[lang]}
                </span>
                {!notification.read && <span className="w-2 h-2 bg-purple rounded-full flex-shrink-0" />}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-muted text-ink-muted ml-auto flex-shrink-0">
                  {t.typeLabels[notification.type]}
                </span>
              </div>
              <p className="text-sm text-ink-light">{notification.description[lang]}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-ink-muted">{timeAgo(notification.timestamp)}</span>
                {notification.link && (
                  <Link href={notification.link} className="text-xs text-purple hover:text-purple-dark font-medium">
                    {t.view}
                  </Link>
                )}
              </div>
            </div>
            <button onClick={() => toggleRead(notification.id)}
              className="text-ink-muted hover:text-ink-muted mt-1 flex-shrink-0 p-1" title={notification.read ? t.markAsUnread : t.markAsRead}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={notification.read ? 'none' : 'currentColor'} stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-ink-muted">
            {t.noNotifications(filterType !== 'all' ? t.typeLabels[filterType] : null)}
          </div>
        )}
      </div>
    </div>
  )
}
