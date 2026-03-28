'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'

const texts = {
  nl: {
    login: 'Inloggen',
    subtitle: 'Eén verkeerde hire kost 50-200% van het jaarsalaris + werkgeverslasten.¹ Bij een bruto maandsalaris van €5.000 is dat €44.000 tot €175.000. En het overkomt 46% van alle aannames.²',
    body: 'Refurzy combineert wetenschappelijk bewezen matching — ontwikkeld met de Vrije Universiteit Amsterdam — met ervaren recruiters en AI-technologie. U ontvangt alleen kandidaten die écht passen. Gemiddeld 60% goedkoper. No cure, no pay.³',
    sources: '¹ SHRM, 2024 \u00a0·\u00a0 ² Leadership IQ \u00a0·\u00a0 ³ Op basis van SHRM, Kristof-Brown et al. en VU Amsterdam',
    ctaLabel: 'Binnenkort live — Wees er als eerste bij',
    tabEmployer: 'Opdrachtgever',
    tabScout: 'Talent Scout',
    namePlaceholder: 'Je naam',
    emailPlaceholder: 'Je e-mailadres',
    submit: 'Houd mij op de hoogte',
    sending: 'Verzenden...',
    thanks: (name: string) => `Bedankt ${name}! We houden je op de hoogte.`,
    invalidEmail: 'Vul een geldig e-mailadres in.',
    invalidName: 'Vul je naam in.',
    footer: '© 2026 Refurzy B.V. — Alle rechten voorbehouden',
  },
  en: {
    login: 'Log in',
    subtitle: 'One wrong hire costs 50-200% of the annual salary + employer costs.¹ At an average salary, that\'s €44,000 to €175,000. And it happens to 46% of all hires.²',
    body: 'Refurzy combines scientifically proven matching — developed with Vrije Universiteit Amsterdam — with experienced recruiters and AI technology. You only receive candidates who truly fit. On average 60% cheaper. No cure, no pay.³',
    sources: '¹ SHRM, 2024 \u00a0·\u00a0 ² Leadership IQ \u00a0·\u00a0 ³ Based on SHRM, Kristof-Brown et al. and VU Amsterdam',
    ctaLabel: 'Coming soon — Be the first to know',
    tabEmployer: 'Employer',
    tabScout: 'Talent Scout',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Your email address',
    submit: 'Keep me posted',
    sending: 'Sending...',
    thanks: (name: string) => `Thanks ${name}! We'll keep you posted.`,
    invalidEmail: 'Please enter a valid email address.',
    invalidName: 'Please enter your name.',
    footer: '© 2026 Refurzy B.V. — All rights reserved',
  },
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('nl')

  useEffect(() => {
    const saved = localStorage.getItem('refurzy_lang') as Lang
    if (saved === 'en' || saved === 'nl') setLang(saved)
  }, [])

  const switchLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('refurzy_lang', l)
  }

  const t = texts[lang]

  useEffect(() => {
    const pageLoadTime = Date.now()
    const formTime = document.getElementById('formTime') as HTMLInputElement
    if (formTime) formTime.value = String(pageLoadTime)

    document.querySelectorAll('.role-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'))
        tab.classList.add('active')
        const roleInput = document.getElementById('roleInput') as HTMLInputElement
        if (roleInput) roleInput.value = (tab as HTMLElement).dataset.role || 'opdrachtgever'
      })
    })

    const form = document.getElementById('interestForm')
    const btn = document.getElementById('submitBtn')
    const msg = document.getElementById('formMessage')

    form?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = (document.getElementById('emailInput') as HTMLInputElement).value.trim()
      const name = (document.getElementById('nameInput') as HTMLInputElement).value.trim()
      const role = (document.getElementById('roleInput') as HTMLInputElement).value
      const honeypot = (document.getElementById('website') as HTMLInputElement).value
      const elapsed = Date.now() - pageLoadTime

      if (!email || !email.includes('@') || !email.includes('.')) {
        showMessage(t.invalidEmail, 'error'); return
      }
      if (!name) { showMessage(t.invalidName, 'error'); return }
      if (honeypot || elapsed < 2000) {
        showMessage(t.thanks(name), 'success'); return
      }

      if (btn) { (btn as HTMLButtonElement).disabled = true; btn.innerHTML = `<span class="spinner"></span>${t.sending}` }

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, role, t: elapsed })
        })
        const data = await res.json()
        if (res.ok) {
          showMessage(t.thanks(name), 'success')
          ;(form as HTMLFormElement).reset()
          document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'))
          document.querySelector('[data-role="opdrachtgever"]')?.classList.add('active')
          ;(document.getElementById('roleInput') as HTMLInputElement).value = 'opdrachtgever'
        } else {
          showMessage(data.error || 'Er ging iets mis. Probeer het opnieuw.', 'error')
        }
      } catch {
        showMessage('Er ging iets mis. Probeer het later opnieuw.', 'error')
      }

      if (btn) { (btn as HTMLButtonElement).disabled = false; btn.textContent = t.submit }
    })

    function showMessage(text: string, type: string) {
      if (msg) { msg.textContent = text; msg.className = 'message ' + type }
    }
  }, [t])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: landingCSS }} />

      {/* Top-right: lang toggle + login */}
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', borderRadius: '8px', padding: '2px', border: '1px solid rgba(0,0,0,0.08)' }}>
          <button
            onClick={() => switchLang('nl')}
            style={{
              padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Poppins, sans-serif',
              background: lang === 'nl' ? 'rgba(0,0,0,0.08)' : 'transparent',
              color: lang === 'nl' ? '#334155' : '#94a3b8',
              transition: 'all 0.2s ease',
            }}
          >
            NL
          </button>
          <button
            onClick={() => switchLang('en')}
            style={{
              padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Poppins, sans-serif',
              background: lang === 'en' ? 'rgba(0,0,0,0.08)' : 'transparent',
              color: lang === 'en' ? '#334155' : '#94a3b8',
              transition: 'all 0.2s ease',
            }}
          >
            EN
          </button>
        </div>
        <Link
          href="/login"
          style={{
            color: '#64748b', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif',
            textDecoration: 'none', letterSpacing: '0.5px', transition: 'color 0.3s ease',
            padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0',
          }}
          onMouseOver={e => (e.currentTarget.style.color = '#334155')}
          onMouseOut={e => (e.currentTarget.style.color = '#64748b')}
        >
          {t.login}
        </Link>
      </div>

      <div className="container">
        <img src="/logo-dark.jpg" alt="Refurzy" className="logo" />

        <h1><span className="gradient-text">Redefining Recruitment.</span> Forever.</h1>

        <p className="subtitle">{t.subtitle}</p>

        <p className="body-text">{t.body}</p>

        <p style={{fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', maxWidth: '500px', marginBottom: '48px', lineHeight: '1.6'}}>
          {t.sources}
        </p>

        <div className="divider" />

        <div className="cta-section">
          <p className="cta-label">{t.ctaLabel}</p>

          <form id="interestForm" noValidate>
            <div className="role-tabs">
              <button type="button" className="role-tab active" data-role="opdrachtgever">{t.tabEmployer}</button>
              <button type="button" className="role-tab" data-role="talent-scout">{t.tabScout}</button>
            </div>

            <input type="hidden" name="role" id="roleInput" defaultValue="opdrachtgever" />

            <div className="name-row">
              <input type="text" name="name" id="nameInput" placeholder={t.namePlaceholder} required autoComplete="name" />
            </div>

            <div className="form-row">
              <div className="input-wrapper">
                <input type="email" name="email" id="emailInput" placeholder={t.emailPlaceholder} required autoComplete="email" />
              </div>
            </div>

            <div className="hp-field" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="t" id="formTime" defaultValue="" />

            <button type="submit" className="btn-submit" id="submitBtn">{t.submit}</button>

            <div className="message" id="formMessage" />
          </form>
        </div>

        <div className="footer">{t.footer}</div>
      </div>
    </>
  )
}

const landingCSS = `
  :root {
    --navy: #0f172a;
    --blue: #06BAFF;
    --teal: #14CDD3;
    --purple: #6D40F9;
    --ink: #0f172a;
    --ink-light: #475569;
    --ink-muted: #64748b;
    --surface: #F1F5F9;
    --gradient: linear-gradient(135deg, var(--purple), var(--blue), var(--teal));
  }
  .container { position:relative; z-index:1; max-width:720px; margin:0 auto; padding:60px 24px; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .logo { width:220px; margin-bottom:60px; animation:fadeInDown 0.8s ease-out; }
  @keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  h1 { font-size:clamp(1.8rem,5vw,2.6rem); font-weight:600; text-align:center; margin-bottom:20px; line-height:1.3; color:var(--ink); animation:fadeInUp 0.8s ease-out 0.2s both; }
  .gradient-text { background:var(--gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .subtitle { font-size:clamp(1rem,2.5vw,1.15rem); font-weight:300; text-align:center; color:var(--ink-light); max-width:560px; line-height:1.7; margin-bottom:20px; animation:fadeInUp 0.8s ease-out 0.4s both; }
  .body-text { font-size:clamp(1rem,2.5vw,1.15rem); font-weight:300; text-align:center; color:var(--ink-light); max-width:560px; line-height:1.7; margin-bottom:16px; animation:fadeInUp 0.8s ease-out 0.5s both; }
  .divider { width:60px; height:2px; background:var(--gradient); margin:0 auto 48px; border-radius:2px; animation:fadeInUp 0.8s ease-out 0.55s both; }
  .cta-section { width:100%; max-width:500px; animation:fadeInUp 0.8s ease-out 0.6s both; }
  .cta-label { font-size:0.85rem; font-weight:500; text-align:center; color:var(--ink-muted); text-transform:uppercase; letter-spacing:2px; margin-bottom:24px; }
  .role-tabs { display:flex; gap:4px; background:rgba(0,0,0,0.04); border-radius:12px; padding:4px; margin-bottom:20px; }
  .role-tab { flex:1; padding:12px 16px; border:none; border-radius:10px; background:transparent; color:var(--ink-muted); font-family:'Poppins',sans-serif; font-size:0.9rem; font-weight:500; cursor:pointer; transition:all 0.3s ease; }
  .role-tab:hover { color:var(--ink-light); }
  .role-tab.active { background:white; color:var(--ink); box-shadow:0 2px 8px rgba(0,0,0,0.12); }
  .form-row { display:flex; gap:10px; }
  .input-wrapper { flex:1; position:relative; }
  input[type="email"], input[type="text"] { width:100%; padding:14px 18px; background:white; border:1px solid #cbd5e1; border-radius:10px; color:var(--ink); font-family:'Poppins',sans-serif; font-size:0.95rem; outline:none; transition:all 0.3s ease; box-shadow:0 1px 2px rgba(0,0,0,0.05); }
  input[type="email"]::placeholder, input[type="text"]::placeholder { color:var(--ink-muted); }
  input[type="email"]:focus, input[type="text"]:focus { border-color:var(--blue); background:white; box-shadow:0 0 0 3px rgba(6,186,255,0.1); }
  .name-row { margin-bottom:10px; }
  .btn-submit { padding:14px 28px; background:var(--gradient); border:none; border-radius:10px; color:white; font-family:'Poppins',sans-serif; font-size:0.95rem; font-weight:600; cursor:pointer; transition:all 0.3s ease; white-space:nowrap; width:100%; margin-top:10px; }
  .btn-submit:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(6,186,255,0.3); }
  .btn-submit:active { transform:translateY(0); }
  .btn-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .hp-field { position:absolute; left:-9999px; top:-9999px; opacity:0; height:0; width:0; z-index:-1; }
  .message { text-align:center; padding:14px 20px; border-radius:10px; font-size:0.9rem; margin-top:16px; display:none; }
  .message.success { background:rgba(20,205,211,0.1); border:1px solid rgba(20,205,211,0.25); color:#0d9488; display:block; }
  .message.error { background:rgba(255,80,80,0.1); border:1px solid rgba(255,80,80,0.25); color:#dc2626; display:block; }
  .footer { margin-top:60px; text-align:center; color:var(--ink-muted); font-size:0.75rem; animation:fadeInUp 0.8s ease-out 0.8s both; }
  .spinner { display:inline-block; width:18px; height:18px; border:2px solid rgba(109,64,249,0.3); border-radius:50%; border-top-color:var(--purple); animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px; }
  @keyframes spin { to{transform:rotate(360deg)} }
  @media(max-width:480px) { .container{padding:40px 20px} .logo{width:160px;margin-bottom:40px} }
`
