'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'refurzy-scout-favorieten'

/**
 * Shared hook for managing favorited vacatures across scout pages.
 * Persists to localStorage so favorites survive page navigation.
 */
export function useFavoriteVacatures() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)))
      }
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)))
    } catch {
      // ignore
    }
  }, [favorites, loaded])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites])

  return { favorites, toggleFavorite, isFavorite, loaded }
}
