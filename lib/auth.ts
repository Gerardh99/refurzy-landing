'use client'

import { User, UserRole } from './types'

const DEMO_USERS: Record<string, User> = {
  'demo@refurzy.com': {
    email: 'demo@refurzy.com',
    name: 'Demo Gebruiker',
    role: 'opdrachtgever',
  },
  'demo@bedrijf.nl': {
    email: 'demo@bedrijf.nl',
    name: 'Daan Verhoeven',
    role: 'opdrachtgever',
    company: 'TechVentures B.V.',
  },
  'scout@refurzy.com': {
    email: 'scout@refurzy.com',
    name: 'Lisa de Groot',
    role: 'scout',
  },
  'kandidaat@email.com': {
    email: 'kandidaat@email.com',
    name: 'Thomas Bakker',
    role: 'kandidaat',
  },
  'admin@refurzy.com': {
    email: 'admin@refurzy.com',
    name: 'Refurzy Admin',
    role: 'admin',
    company: 'Refurzy B.V.',
  },
  // Keep old .nl entries for backwards compatibility
  'scout@refurzy.nl': {
    email: 'scout@refurzy.nl',
    name: 'Sophie de Graaf',
    role: 'scout',
  },
  'kandidaat@refurzy.nl': {
    email: 'kandidaat@refurzy.nl',
    name: 'Anna de Jong',
    role: 'kandidaat',
  },
  'admin@refurzy.nl': {
    email: 'admin@refurzy.nl',
    name: 'Refurzy Admin',
    role: 'admin',
    company: 'Refurzy B.V.',
  },
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) return null
    const { user } = await res.json()
    if (user && typeof window !== 'undefined') {
      sessionStorage.setItem('refurzy_user', JSON.stringify(user))
    }
    return user
  } catch {
    return null
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const data = sessionStorage.getItem('refurzy_user')
  if (!data) return null
  try { return JSON.parse(data) } catch { return null }
}

export function logout() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('refurzy_user')
  }
}

export function getRolePath(role: UserRole): string {
  switch (role) {
    case 'opdrachtgever': return '/demo/opdrachtgever'
    case 'scout': return '/demo/scout'
    case 'kandidaat': return '/demo/kandidaat'
    case 'admin': return '/demo/admin'
  }
}
