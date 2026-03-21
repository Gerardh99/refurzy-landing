import { NextRequest, NextResponse } from 'next/server'

const DEMO_USERS: Record<string, { email: string; name: string; role: string; company?: string }> = {
  'demo@refurzy.com': { email: 'demo@refurzy.com', name: 'Demo Gebruiker', role: 'opdrachtgever' },
  'demo@bedrijf.nl': { email: 'demo@bedrijf.nl', name: 'Daan Verhoeven', role: 'opdrachtgever', company: 'TechVentures B.V.' },
  'scout@refurzy.com': { email: 'scout@refurzy.com', name: 'Lisa de Groot', role: 'scout' },
  'kandidaat@email.com': { email: 'kandidaat@email.com', name: 'Thomas Bakker', role: 'kandidaat' },
  'admin@refurzy.com': { email: 'admin@refurzy.com', name: 'Refurzy Admin', role: 'admin', company: 'Refurzy B.V.' },
  'scout@refurzy.nl': { email: 'scout@refurzy.nl', name: 'Sophie de Graaf', role: 'scout' },
  'kandidaat@refurzy.nl': { email: 'kandidaat@refurzy.nl', name: 'Anna de Jong', role: 'kandidaat' },
  'admin@refurzy.nl': { email: 'admin@refurzy.nl', name: 'Refurzy Admin', role: 'admin', company: 'Refurzy B.V.' },
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const demoPassword = process.env.DEMO_PASSWORD
  if (!demoPassword) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const user = DEMO_USERS[email?.toLowerCase()]
  if (user && password === demoPassword) {
    return NextResponse.json({ user })
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
