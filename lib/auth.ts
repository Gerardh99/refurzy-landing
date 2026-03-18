'use client'

import { User, UserRole } from './types'

const DEMO_USERS: Record<string, User> = {
  'demo@bedrijf.nl': {
    email: 'demo@bedrijf.nl',
    name: 'Jan van der Berg',
    role: 'opdrachtgever',
    company: 'TechVentures B.V.',
  },
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
}

const DEMO_PASSWORD = 'Nummer1platform'

export function login(email: string, password: string): User | null {
  const user = DEMO_USERS[email.toLowerCase()]
  if (user && password === DEMO_PASSWORD) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('refurzy_user', JSON.stringify(user))
    }
    return user
  }
  return null
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
  }
}
