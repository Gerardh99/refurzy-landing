import { NextRequest, NextResponse } from 'next/server'

const submissions = new Map<string, { count: number; first: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const record = submissions.get(ip)
  if (!record) { submissions.set(ip, { count: 1, first: now }); return false }
  if (now - record.first > 60000) { submissions.set(ip, { count: 1, first: now }); return false }
  record.count++
  return record.count > 3
}

function escapeHtml(str: string) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Te veel verzoeken. Probeer het later opnieuw.' }, { status: 429 })
  }

  const { email, name, role, t } = await req.json()

  if (!email || !name || !role) return NextResponse.json({ error: 'Vul alle velden in.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Ongeldig e-mailadres.' }, { status: 400 })
  if (typeof t === 'number' && t < 2000) return NextResponse.json({ ok: true })
  if (!['opdrachtgever', 'talent-scout'].includes(role)) return NextResponse.json({ error: 'Ongeldige rol.' }, { status: 400 })

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: 'Serverconfiguratie fout.' }, { status: 500 })

  const subject = role === 'opdrachtgever' ? 'Interesse opdrachtgever' : 'Interesse talent scout'
  const roleName = role === 'opdrachtgever' ? 'Opdrachtgever' : 'Talent Scout'

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Refurzy Website <noreply@refurzy.com>',
        to: ['gerard@refurzy.com'],
        subject,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1A0F5D">Nieuwe interesse via refurzy.com</h2><table style="width:100%;border-collapse:collapse;margin-top:20px"><tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;color:#1A0F5D;width:120px">Type:</td><td style="padding:10px;border-bottom:1px solid #eee">${roleName}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;color:#1A0F5D">Naam:</td><td style="padding:10px;border-bottom:1px solid #eee">${escapeHtml(name)}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;color:#1A0F5D">E-mail:</td><td style="padding:10px;border-bottom:1px solid #eee"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr><tr><td style="padding:10px;font-weight:bold;color:#1A0F5D">Tijdstip:</td><td style="padding:10px">${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}</td></tr></table></div>`,
      }),
    })

    if (!response.ok) {
      console.error('Resend error:', await response.json())
      return NextResponse.json({ error: 'E-mail kon niet worden verzonden.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Er ging iets mis.' }, { status: 500 })
  }
}
