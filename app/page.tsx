'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function LandingPage() {
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
        showMessage('Vul een geldig e-mailadres in.', 'error'); return
      }
      if (!name) { showMessage('Vul je naam in.', 'error'); return }
      if (honeypot || elapsed < 2000) {
        showMessage('Bedankt! We houden je op de hoogte.', 'success'); return
      }

      if (btn) { (btn as HTMLButtonElement).disabled = true; btn.innerHTML = '<span class="spinner"></span>Verzenden...' }

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, role, t: elapsed })
        })
        const data = await res.json()
        if (res.ok) {
          showMessage('Bedankt ' + name + '! We houden je op de hoogte.', 'success')
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

      if (btn) { (btn as HTMLButtonElement).disabled = false; btn.textContent = 'Houd mij op de hoogte' }
    })

    function showMessage(text: string, type: string) {
      if (msg) { msg.textContent = text; msg.className = 'message ' + type }
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: landingCSS }} />

      {/* Subtiele inlogknop rechtsboven */}
      <Link
        href="/login"
        style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 10,
          color: 'rgba(249,251,255,0.3)', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif',
          textDecoration: 'none', letterSpacing: '0.5px', transition: 'color 0.3s ease',
          padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseOver={e => (e.currentTarget.style.color = 'rgba(249,251,255,0.6)')}
        onMouseOut={e => (e.currentTarget.style.color = 'rgba(249,251,255,0.3)')}
      >
        Inloggen
      </Link>

      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="container">
        <img src="/logo-white.png" alt="Refurzy" className="logo" />

        <h1><span className="gradient-text">Redefining Recruitment.</span> Forever.</h1>

        <p className="subtitle">
          De arbeidsmarkt is drastisch veranderd. De manier waarop we talent werven nauwelijks.<br /><br />
          Waar een hire vroeger zes jaar waarde cre&euml;erde, is dat vandaag anderhalf tot twee jaar. Toch blijven processen achterhaald, onnodig kostbaar en vaak gebaseerd op onderbuikgevoel.
        </p>

        <p className="body-text">
          Refurzy draait het om. Met wetenschap als fundament en technologie als motor maken wij werving sneller, objectiever en voor een fractie van de kosten.
        </p>

        <div className="divider" />

        <div className="cta-section">
          <p className="cta-label">Binnenkort live — Wees er als eerste bij</p>

          <form id="interestForm" noValidate>
            <div className="role-tabs">
              <button type="button" className="role-tab active" data-role="opdrachtgever">Opdrachtgever</button>
              <button type="button" className="role-tab" data-role="talent-scout">Talent Scout</button>
            </div>

            <input type="hidden" name="role" id="roleInput" defaultValue="opdrachtgever" />

            <div className="name-row">
              <input type="text" name="name" id="nameInput" placeholder="Je naam" required autoComplete="name" />
            </div>

            <div className="form-row">
              <div className="input-wrapper">
                <input type="email" name="email" id="emailInput" placeholder="Je e-mailadres" required autoComplete="email" />
              </div>
            </div>

            <div className="hp-field" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="t" id="formTime" defaultValue="" />

            <button type="submit" className="btn-submit" id="submitBtn">Houd mij op de hoogte</button>

            <div className="message" id="formMessage" />
          </form>
        </div>

        <div className="footer">&copy; 2026 Refurzy B.V. — Alle rechten voorbehouden</div>
      </div>
    </>
  )
}

const landingCSS = `
  :root {
    --navy: #1A0F5D;
    --blue: #06BAFF;
    --teal: #14CDD3;
    --purple: #6D40F9;
    --light: #F9FBFF;
    --gradient: linear-gradient(135deg, var(--teal), var(--blue), var(--purple));
  }
  body { background: var(--navy) !important; color: var(--light) !important; }
  .bg-orb { position:fixed; border-radius:50%; filter:blur(100px); opacity:0.15; pointer-events:none; z-index:0; }
  .bg-orb-1 { width:600px; height:600px; background:var(--teal); top:-200px; right:-100px; animation:float1 20s ease-in-out infinite; }
  .bg-orb-2 { width:500px; height:500px; background:var(--purple); bottom:-150px; left:-100px; animation:float2 25s ease-in-out infinite; }
  .bg-orb-3 { width:350px; height:350px; background:var(--blue); top:50%; left:50%; transform:translate(-50%,-50%); animation:float3 18s ease-in-out infinite; }
  @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-80px,60px)} }
  @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,-80px)} }
  @keyframes float3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.2)} }
  .container { position:relative; z-index:1; max-width:720px; margin:0 auto; padding:60px 24px; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .logo { width:220px; margin-bottom:60px; animation:fadeInDown 0.8s ease-out; }
  @keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  h1 { font-size:clamp(1.8rem,5vw,2.6rem); font-weight:600; text-align:center; margin-bottom:20px; line-height:1.3; animation:fadeInUp 0.8s ease-out 0.2s both; }
  .gradient-text { background:var(--gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .subtitle { font-size:clamp(1rem,2.5vw,1.15rem); font-weight:300; text-align:center; color:rgba(249,251,255,0.8); max-width:560px; line-height:1.7; margin-bottom:16px; animation:fadeInUp 0.8s ease-out 0.4s both; }
  .body-text { font-size:clamp(0.9rem,2vw,0.95rem); font-weight:300; text-align:center; color:rgba(249,251,255,0.6); max-width:520px; line-height:1.7; margin-bottom:48px; animation:fadeInUp 0.8s ease-out 0.5s both; }
  .divider { width:60px; height:2px; background:var(--gradient); margin:0 auto 48px; border-radius:2px; animation:fadeInUp 0.8s ease-out 0.55s both; }
  .cta-section { width:100%; max-width:500px; animation:fadeInUp 0.8s ease-out 0.6s both; }
  .cta-label { font-size:0.85rem; font-weight:500; text-align:center; color:rgba(249,251,255,0.5); text-transform:uppercase; letter-spacing:2px; margin-bottom:24px; }
  .role-tabs { display:flex; gap:4px; background:rgba(255,255,255,0.06); border-radius:12px; padding:4px; margin-bottom:20px; }
  .role-tab { flex:1; padding:12px 16px; border:none; border-radius:10px; background:transparent; color:rgba(249,251,255,0.5); font-family:'Poppins',sans-serif; font-size:0.9rem; font-weight:500; cursor:pointer; transition:all 0.3s ease; }
  .role-tab:hover { color:rgba(249,251,255,0.8); }
  .role-tab.active { background:rgba(255,255,255,0.1); color:var(--light); box-shadow:0 2px 8px rgba(0,0,0,0.2); }
  .form-row { display:flex; gap:10px; }
  .input-wrapper { flex:1; position:relative; }
  input[type="email"], input[type="text"] { width:100%; padding:14px 18px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:var(--light); font-family:'Poppins',sans-serif; font-size:0.95rem; outline:none; transition:all 0.3s ease; }
  input[type="email"]::placeholder, input[type="text"]::placeholder { color:rgba(249,251,255,0.35); }
  input[type="email"]:focus, input[type="text"]:focus { border-color:var(--blue); background:rgba(255,255,255,0.1); box-shadow:0 0 0 3px rgba(6,186,255,0.1); }
  .name-row { margin-bottom:10px; }
  .btn-submit { padding:14px 28px; background:var(--gradient); border:none; border-radius:10px; color:white; font-family:'Poppins',sans-serif; font-size:0.95rem; font-weight:600; cursor:pointer; transition:all 0.3s ease; white-space:nowrap; width:100%; margin-top:10px; }
  .btn-submit:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(6,186,255,0.3); }
  .btn-submit:active { transform:translateY(0); }
  .btn-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .hp-field { position:absolute; left:-9999px; top:-9999px; opacity:0; height:0; width:0; z-index:-1; }
  .message { text-align:center; padding:14px 20px; border-radius:10px; font-size:0.9rem; margin-top:16px; display:none; }
  .message.success { background:rgba(20,205,211,0.15); border:1px solid rgba(20,205,211,0.3); color:var(--teal); display:block; }
  .message.error { background:rgba(255,80,80,0.15); border:1px solid rgba(255,80,80,0.3); color:#ff6b6b; display:block; }
  .footer { margin-top:60px; text-align:center; color:rgba(249,251,255,0.25); font-size:0.75rem; animation:fadeInUp 0.8s ease-out 0.8s both; }
  .spinner { display:inline-block; width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-radius:50%; border-top-color:white; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px; }
  @keyframes spin { to{transform:rotate(360deg)} }
  @media(max-width:480px) { .container{padding:40px 20px} .logo{width:160px;margin-bottom:40px} }
`
