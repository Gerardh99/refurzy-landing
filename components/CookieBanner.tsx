'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('refurzy_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('refurzy_cookie_consent', JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      functional: true,
      analytics: false,
    }))
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('refurzy_cookie_consent', JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      functional: true,
      analytics: false,
    }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-surface-border shadow-xl p-5">
        <div className="flex items-start gap-4">
          <span className="text-2xl flex-shrink-0">🍪</span>
          <div className="flex-1">
            <h3 className="text-ink font-semibold text-sm mb-1">Cookies</h3>
            <p className="text-ink-light text-xs leading-relaxed">
              Wij gebruiken uitsluitend functionele cookies voor het functioneren van het platform.
              Wij gebruiken geen tracking- of marketingcookies.
              Lees ons{' '}
              <a href="/juridisch/cookiebeleid" className="text-cyan underline">Cookiebeleid</a>
              {' '}en{' '}
              <a href="/juridisch/privacybeleid" className="text-cyan underline">Privacybeleid</a>
              .
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-xs font-medium text-ink-light hover:text-ink border border-surface-border rounded-lg transition-colors"
            >
              Alleen noodzakelijk
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-xs font-semibold text-navy-dark bg-cyan hover:bg-cyan/90 rounded-lg transition-colors"
            >
              Akkoord
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
