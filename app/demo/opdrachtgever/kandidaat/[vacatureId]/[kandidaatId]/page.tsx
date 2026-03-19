'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { vacatures, pipelineSteps, afwijzingsRedenen, calculateFee } from '@/lib/mock-data'
import { ProcesStatus, AfwijzingsReden, Gesprek } from '@/lib/types'
import FitScore from '@/components/FitScore'
import PipelineTracker from '@/components/PipelineTracker'

export default function OpdrachtgeverKandidaatProces() {
  const params = useParams()
  const vacature = vacatures.find(v => v.id === params.vacatureId)
  const kandidaat = vacature?.kandidaten.find(k => k.id === params.kandidaatId)

  const [procesStatus, setProcesStatus] = useState<ProcesStatus>(kandidaat?.procesStatus || 'voorgesteld')
  const [unlocked, setUnlocked] = useState(kandidaat?.unlocked || false)
  const [contractAccepted, setContractAccepted] = useState(procesStatus !== 'voorgesteld')
  const [gesprekken, setGesprekken] = useState<Gesprek[]>(kandidaat?.gesprekken || [])
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [showCelebrateModal, setShowCelebrateModal] = useState(false)
  const [rejectRating, setRejectRating] = useState(0)
  const [rejectReason, setRejectReason] = useState<AfwijzingsReden | ''>('')
  const [rejectNote, setRejectNote] = useState('')
  const [newGesprekDatum, setNewGesprekDatum] = useState('')
  const [newGesprekType, setNewGesprekType] = useState<'kennismaking' | 'verdieping' | 'arbeidsvoorwaarden'>('kennismaking')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [isRejected, setIsRejected] = useState(false)

  if (!vacature || !kandidaat) {
    return <div className="flex items-center justify-center h-64"><p className="text-ink-light">Kandidaat niet gevonden.</p></div>
  }

  const fee = calculateFee(kandidaat.opleidingsniveau, kandidaat.werkervaring)
  const lastGesprek = gesprekken[gesprekken.length - 1]
  const needsFeedback = lastGesprek && lastGesprek.status === 'afgerond' && !lastGesprek.feedback

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleAcceptContract = () => {
    setContractAccepted(true)
    setUnlocked(true)
    setProcesStatus('gesprek_plannen')
    setShowContractModal(false)
  }

  const handlePlanGesprek = () => {
    if (!newGesprekDatum) return
    const gesprek: Gesprek = {
      id: `g-new-${Date.now()}`,
      type: newGesprekType,
      datum: newGesprekDatum,
      status: 'gepland',
    }
    setGesprekken([...gesprekken, gesprek])
    setProcesStatus('gesprek_gepland')
    setShowPlanModal(false)
    setNewGesprekDatum('')
  }

  const handleMarkGesprekDone = (gesprekId: string) => {
    setGesprekken(gesprekken.map(g => g.id === gesprekId ? { ...g, status: 'afgerond' as const } : g))
    setProcesStatus('feedback_geven')
  }

  const handleSubmitFeedback = (gesprekId: string) => {
    if (!feedbackText) return
    setGesprekken(gesprekken.map(g =>
      g.id === gesprekId ? { ...g, feedback: feedbackText, rating: feedbackRating || undefined } : g
    ))
    setProcesStatus('vervolggesprek')
    setFeedbackText('')
    setFeedbackRating(0)
  }

  const handleStartArbeidsvoorwaarden = () => {
    setProcesStatus('arbeidsvoorwaarden')
    setNewGesprekType('arbeidsvoorwaarden')
  }

  const handleContractGetekend = () => {
    setProcesStatus('contract_getekend')
    setShowCelebrateModal(true)
  }

  const handleReject = () => {
    if (!rejectReason || rejectRating === 0) return
    setIsRejected(true)
    setProcesStatus('afgewezen')
    setShowRejectModal(false)
  }

  // ─── Star rating component ─────────────────────────────────────────────────
  const StarRating = ({ value, onChange, size = 'md' }: { value: number; onChange: (v: number) => void; size?: 'sm' | 'md' }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} onClick={() => onChange(star)}
          className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} transition-colors ${star <= value ? 'text-yellow-400' : 'text-surface-border hover:text-yellow-300'}`}>
          ★
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link href="/demo/opdrachtgever" className="text-ink-light hover:text-cyan text-sm inline-flex items-center gap-1 transition-colors">
        ← Terug naar dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple/20 text-purple flex items-center justify-center text-lg font-bold">
              {kandidaat.initialen}
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">
                {unlocked ? kandidaat.naam : `Kandidaat ${kandidaat.initialen}`}
              </h1>
              <p className="text-ink-light text-sm">{vacature.title} · {vacature.company}</p>
            </div>
          </div>
        </div>
        {!isRejected && procesStatus !== 'contract_getekend' && (
          <button onClick={() => setShowRejectModal(true)}
            className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors">
            Afwijzen
          </button>
        )}
      </div>

      {/* Pipeline tracker */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-xs font-medium text-ink-muted mb-4 uppercase tracking-wider">Voortgang</h2>
        <PipelineTracker currentStatus={procesStatus} isRejected={isRejected} />
      </div>

      {/* M-Score + Criteria */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted mb-2">M-Score</p>
          <div className="flex items-center gap-3">
            <FitScore score={kandidaat.deVriesFit} size="lg" />
            <div>
              <p className="text-ink font-semibold">{kandidaat.deVriesFit}%</p>
              <p className="text-xs text-ink-muted">Culturele match</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted mb-2">Harde Criteria</p>
          <div className="flex items-center gap-3">
            <FitScore score={kandidaat.hardeCriteriaMatch} size="lg" />
            <div>
              <p className="text-ink font-semibold">{kandidaat.hardeCriteriaMatch}%</p>
              <p className="text-xs text-ink-muted">{kandidaat.opleidingsniveau} · {kandidaat.werkervaring}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact details (only when unlocked) */}
      {unlocked && (
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <h2 className="text-sm font-medium text-ink mb-3">Contactgegevens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-ink-muted text-xs">Email</p>
              <p className="text-ink font-medium">{kandidaat.email || 'anna.dejong@email.nl'}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">Telefoon</p>
              <p className="text-ink font-medium">{kandidaat.telefoon || '06-12345678'}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">Woonplaats</p>
              <p className="text-ink font-medium">{kandidaat.woonplaats}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">Scout</p>
              <p className="text-ink font-medium">{kandidaat.scoutNaam}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 1: Profiel bekijken → Contract accepteren ─────────────────────── */}
      {procesStatus === 'voorgesteld' && !contractAccepted && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Kandidaat voorgesteld door {kandidaat.scoutNaam}</h2>
              <p className="text-ink-light text-sm mt-1">
                Om de contactgegevens van deze kandidaat te ontvangen, dient u akkoord te gaan met de plaatsingsovereenkomst.
                U betaalt alleen bij een succesvolle plaatsing (no cure, no pay).
              </p>
            </div>
          </div>

          <div className="bg-surface-muted rounded-xl p-4">
            <h3 className="text-sm font-medium text-ink mb-2">Plaatsingsvoorwaarden</h3>
            <div className="space-y-2 text-sm text-ink-light">
              <div className="flex justify-between">
                <span>Plaatsingsfee bij aanname</span>
                <span className="text-ink font-semibold">€{fee.fee.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span>Betaalmoment</span>
                <span className="text-ink">Na ondertekening arbeidsovereenkomst</span>
              </div>
              <div className="flex justify-between">
                <span>Fit Garantie</span>
                <span className="text-ink">12 maanden (bij M-Score ≥80%)</span>
              </div>
            </div>
          </div>

          <button onClick={() => setShowContractModal(true)}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            Bekijk contract en ga akkoord →
          </button>
        </div>
      )}

      {/* ─── Step 2: Gesprek plannen ────────────────────────────────────────────── */}
      {procesStatus === 'gesprek_plannen' && (
        <div className="bg-white rounded-2xl border-2 border-orange/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Plan een kennismakingsgesprek</h2>
              <p className="text-ink-light text-sm mt-1">
                Neem contact op met {unlocked ? kandidaat.naam : `Kandidaat ${kandidaat.initialen}`} en plan een gesprek. Voer de datum hieronder in.
              </p>
            </div>
          </div>

          {kandidaat.nudges && kandidaat.nudges.length > 0 && (
            <div className="bg-orange/5 border border-orange/20 rounded-xl p-3 space-y-2">
              <p className="text-xs font-medium text-orange">Herinneringen van scout:</p>
              {kandidaat.nudges.map(n => (
                <div key={n.id} className="flex items-start gap-2 text-sm">
                  <span className="text-orange">{n.type === 'friendly' ? '💬' : n.type === 'urgent' ? '⚠️' : '🚨'}</span>
                  <div>
                    <p className="text-ink-light">{n.bericht}</p>
                    <p className="text-xs text-ink-muted">{new Date(n.datum).toLocaleDateString('nl-NL')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => { setNewGesprekType('kennismaking'); setShowPlanModal(true) }}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            Gespreksdatum invoeren →
          </button>
        </div>
      )}

      {/* ─── Step 3: Gesprek gepland ────────────────────────────────────────────── */}
      {procesStatus === 'gesprek_gepland' && lastGesprek && (
        <div className="bg-white rounded-2xl border-2 border-blue-300/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {lastGesprek.type === 'kennismaking' ? 'Kennismakingsgesprek' :
                 lastGesprek.type === 'verdieping' ? 'Verdiepingsgesprek' : 'Arbeidsvoorwaardengesprek'} gepland
              </h2>
              <p className="text-ink-light text-sm mt-1">
                Op <strong className="text-ink">{new Date(lastGesprek.datum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </p>
            </div>
          </div>

          <button onClick={() => handleMarkGesprekDone(lastGesprek.id)}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
            Gesprek is afgerond — geef feedback →
          </button>
        </div>
      )}

      {/* ─── Step 4: Feedback geven ─────────────────────────────────────────────── */}
      {procesStatus === 'feedback_geven' && lastGesprek && (
        <div className="bg-white rounded-2xl border-2 border-yellow-300/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Hoe ging het gesprek?</h2>
              <p className="text-ink-light text-sm mt-1">
                Geef feedback over het {lastGesprek.type === 'kennismaking' ? 'kennismakings' : lastGesprek.type === 'verdieping' ? 'verdiepings' : 'arbeidsvoorwaarden'}gesprek.
                Dit is verplicht voordat u verder kunt.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Beoordeling</label>
            <StarRating value={feedbackRating} onChange={setFeedbackRating} />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Feedback *</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              placeholder="Hoe verliep het gesprek? Wat viel op?"
              className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none"
            />
          </div>

          <button onClick={() => handleSubmitFeedback(lastGesprek.id)}
            disabled={!feedbackText}
            className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Feedback opslaan →
          </button>
        </div>
      )}

      {/* ─── Step 5: Vervolg bepalen ────────────────────────────────────────────── */}
      {procesStatus === 'vervolggesprek' && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Wat is de volgende stap?</h2>
              <p className="text-ink-light text-sm mt-1">
                Kies hoe u verder wilt met {unlocked ? kandidaat.naam : `Kandidaat ${kandidaat.initialen}`}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={() => { setNewGesprekType('verdieping'); setShowPlanModal(true) }}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-cyan/5 hover:border-cyan/30 border border-surface-border transition-colors">
              <span className="text-lg">🤝</span>
              <p className="text-sm font-medium text-ink mt-2">Vervolggesprek plannen</p>
              <p className="text-xs text-ink-muted mt-1">Plan nog een gesprek met de kandidaat</p>
            </button>
            <button onClick={handleStartArbeidsvoorwaarden}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-green-50 hover:border-green-300 border border-surface-border transition-colors">
              <span className="text-lg">💼</span>
              <p className="text-sm font-medium text-ink mt-2">Arbeidsvoorwaarden bespreken</p>
              <p className="text-xs text-ink-muted mt-1">Ga naar de onderhandelingsfase</p>
            </button>
            <button onClick={() => setShowRejectModal(true)}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-red-50 hover:border-red-300 border border-surface-border transition-colors">
              <span className="text-lg">✕</span>
              <p className="text-sm font-medium text-ink mt-2">Afwijzen</p>
              <p className="text-xs text-ink-muted mt-1">Deze kandidaat past niet</p>
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 6: Arbeidsvoorwaarden ─────────────────────────────────────────── */}
      {procesStatus === 'arbeidsvoorwaarden' && (
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💼</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Arbeidsvoorwaarden</h2>
              <p className="text-ink-light text-sm mt-1">
                U bent in gesprek over de arbeidsvoorwaarden met {unlocked ? kandidaat.naam : `Kandidaat ${kandidaat.initialen}`}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button onClick={handleContractGetekend}
              className="p-4 bg-green-50 rounded-xl text-left hover:bg-green-100 border border-green-200 transition-colors">
              <span className="text-2xl">🎉</span>
              <p className="text-sm font-semibold text-green-700 mt-2">Contract getekend!</p>
              <p className="text-xs text-green-600 mt-1">De kandidaat heeft het contract ondertekend</p>
            </button>
            <button onClick={() => { setNewGesprekType('arbeidsvoorwaarden'); setShowPlanModal(true) }}
              className="p-4 bg-surface-muted rounded-xl text-left hover:bg-cyan/5 border border-surface-border transition-colors">
              <span className="text-lg">📅</span>
              <p className="text-sm font-medium text-ink mt-2">Nog een gesprek plannen</p>
              <p className="text-xs text-ink-muted mt-1">Nog niet rond — plan een vervolggesprek</p>
            </button>
          </div>
        </div>
      )}

      {/* ─── Contract getekend! ─────────────────────────────────────────────────── */}
      {procesStatus === 'contract_getekend' && (
        <div className="bg-gradient-to-br from-green-50 to-cyan/10 rounded-2xl border-2 border-green-300 p-8 text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-2xl font-bold text-ink">Succesvolle match!</h2>
          <p className="text-ink-light max-w-md mx-auto">
            {kandidaat.naam} is aangenomen als {vacature.title} bij {vacature.company}.
            De Fit Garantie van 12 maanden is nu actief.
          </p>
          <div className="bg-white rounded-xl p-4 max-w-sm mx-auto">
            <p className="text-xs text-ink-muted">Plaatsingsfee</p>
            <p className="text-2xl font-bold text-ink">€{fee.fee.toLocaleString('nl-NL')}</p>
            <p className="text-xs text-ink-muted mt-1">Wordt in rekening gebracht via uw creditcard</p>
          </div>
        </div>
      )}

      {/* ─── Afgewezen ──────────────────────────────────────────────────────────── */}
      {isRejected && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✕</span>
            <div>
              <h2 className="text-lg font-semibold text-red-700">Kandidaat afgewezen</h2>
              <p className="text-red-600 text-sm mt-1">
                {afwijzingsRedenen.find(r => r.key === rejectReason)?.label}
                {rejectNote && ` — "${rejectNote}"`}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`text-sm ${s <= rejectRating ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                ))}
                <span className="text-xs text-ink-muted ml-1">Scout rating</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Gesprekken timeline ─────────────────────────────────────────────────── */}
      {gesprekken.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h2 className="text-sm font-medium text-ink-muted mb-4">Gespreksverloop</h2>
          <div className="space-y-4">
            {gesprekken.map((g, i) => (
              <div key={g.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    g.status === 'afgerond' ? 'bg-green-100 text-green-600' :
                    g.status === 'gepland' ? 'bg-blue-100 text-blue-600' : 'bg-surface-muted text-ink-muted'
                  }`}>
                    {g.status === 'afgerond' ? '✓' : g.status === 'gepland' ? '📅' : '—'}
                  </div>
                  {i < gesprekken.length - 1 && <div className="w-px h-full bg-surface-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink">
                      {g.type === 'kennismaking' ? 'Kennismakingsgesprek' :
                       g.type === 'verdieping' ? 'Verdiepingsgesprek' : 'Arbeidsvoorwaardengesprek'}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      g.status === 'afgerond' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {g.status === 'afgerond' ? 'Afgerond' : 'Gepland'}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {new Date(g.datum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  {g.feedback && (
                    <div className="mt-2 bg-surface-muted rounded-lg p-3">
                      <p className="text-sm text-ink-light">{g.feedback}</p>
                      {g.rating && (
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`text-xs ${s <= g.rating! ? 'text-yellow-400' : 'text-surface-border'}`}>★</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Contract Modal ──────────────────────────────────────────────────────── */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-purple/5 p-6 border-b border-surface-border">
              <h2 className="text-xl font-bold text-ink">Plaatsingsovereenkomst</h2>
              <p className="text-ink-light text-sm mt-1">Lees de voorwaarden en ga akkoord om de contactgegevens te ontsluiten.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-surface-muted rounded-xl p-4 space-y-3 text-sm text-ink-light">
                <p><strong className="text-ink">Artikel 1 — No cure, no pay</strong><br />U betaalt alleen een plaatsingsfee bij daadwerkelijke ondertekening van een arbeidsovereenkomst.</p>
                <p><strong className="text-ink">Artikel 2 — Plaatsingsfee</strong><br />De fee bedraagt €{fee.fee.toLocaleString('nl-NL')} excl. BTW, gebaseerd op opleidingsniveau ({kandidaat.opleidingsniveau}) en werkervaring ({kandidaat.werkervaring}).</p>
                <p><strong className="text-ink">Artikel 3 — Fit Garantie</strong><br />Bij een M-Score van ≥80% geldt een Fit Garantie van 12 maanden. Als de medewerker vertrekt vanwege een mismatch in cultuur, waarden of interesses, wordt de fee gerestitueerd.</p>
                <p><strong className="text-ink">Artikel 4 — Betaling</strong><br />De fee wordt geïncasseerd via uw creditcard na ondertekening van de arbeidsovereenkomst.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowContractModal(false)}
                  className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                  Annuleren
                </button>
                <button onClick={handleAcceptContract}
                  className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors">
                  Akkoord — ontsluit profiel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Plan gesprek modal ──────────────────────────────────────────────────── */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-ink">
              {newGesprekType === 'kennismaking' ? 'Kennismakingsgesprek plannen' :
               newGesprekType === 'verdieping' ? 'Verdiepingsgesprek plannen' : 'Arbeidsvoorwaardengesprek plannen'}
            </h2>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Datum en tijd *</label>
              <input type="datetime-local" value={newGesprekDatum} onChange={(e) => setNewGesprekDatum(e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPlanModal(false)}
                className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                Annuleren
              </button>
              <button onClick={handlePlanGesprek} disabled={!newGesprekDatum}
                className="flex-1 py-2.5 bg-cyan text-navy-dark rounded-lg font-semibold text-sm hover:bg-cyan/90 transition-colors disabled:opacity-40">
                Gesprek plannen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Reject modal ────────────────────────────────────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-ink">Kandidaat afwijzen</h2>
            <p className="text-ink-light text-sm">Uw beoordeling helpt de Talent Scout beter te matchen in de toekomst.</p>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Reden van afwijzing *</label>
              <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value as AfwijzingsReden)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
                <option value="">Selecteer een reden</option>
                {afwijzingsRedenen.map(r => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Beoordeling scout *</label>
              <StarRating value={rejectRating} onChange={setRejectRating} />
              <p className="text-xs text-ink-muted mt-1">Hoe goed was de voordracht van de scout?</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Toelichting</label>
              <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={2}
                placeholder="Optioneel: geef extra context"
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors">
                Annuleren
              </button>
              <button onClick={handleReject} disabled={!rejectReason || rejectRating === 0}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-40">
                Afwijzen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Celebrate modal ─────────────────────────────────────────────────────── */}
      {showCelebrateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-br from-cyan via-blue-500 to-purple p-8 text-center text-white">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold">Gefeliciteerd!</h2>
              <p className="text-white/90 mt-2">{kandidaat.naam} wordt de nieuwe {vacature.title} bij {vacature.company}!</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-surface-muted rounded-xl p-4 space-y-2 text-sm">
                <p className="text-ink-muted">📧 E-mails worden verstuurd naar:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">Opdrachtgever</p>
                    <p className="text-ink-muted">Welkom & onboarding tips</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">Kandidaat</p>
                    <p className="text-ink-muted">Felicitatie & eerste werkdag</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-medium text-ink">Scout</p>
                    <p className="text-ink-muted">Fee bevestiging & uitbetaling</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-700">Fit Garantie actief</p>
                    <p className="text-xs text-green-600">12 maanden bescherming bij M-Score ≥80%</p>
                  </div>
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
              <button onClick={() => setShowCelebrateModal(false)}
                className="w-full py-3 bg-cyan text-navy-dark rounded-xl font-semibold text-sm hover:bg-cyan/90 transition-colors">
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
