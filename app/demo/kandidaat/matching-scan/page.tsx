'use client'

import { useState, useCallback } from 'react'

// ─── Item definitions ────────────────────────────────────────────────────────

const werkzaamhedenItems = [
  { key: 'a', label: 'Mensen sociaal faciliteren' },
  { key: 'b', label: 'Zaken regelen' },
  { key: 'c', label: 'Financieel administreren' },
  { key: 'd', label: 'Gegevens verwerken' },
  { key: 'e', label: 'Met mechanica/machines werken' },
  { key: 'f', label: 'In de natuur/voor het milieu werken' },
  { key: 'g', label: 'Artistiek werk verrichten' },
  { key: 'h', label: 'Mensen helpen' },
  { key: 'i', label: 'Gespecialiseerde zorg verlenen' },
  { key: 'j', label: 'Invloedrijk werk doen' },
  { key: 'k', label: 'Met zakelijke systemen werken' },
  { key: 'l', label: 'Kwaliteitscontroles uitvoeren' },
  { key: 'm', label: 'Uitvoerend werk doen' },
  { key: 'n', label: 'Persoonlijke diensten verlenen' },
  { key: 'o', label: 'Financien analyseren' },
  { key: 'p', label: 'Gespecialiseerd onderzoek doen' },
  { key: 'q', label: 'Bouwen/repareren' },
  { key: 'r', label: 'Basisdiensten verlenen' },
  { key: 's', label: 'Sport- en spelactiviteiten' },
]

const waardenItems = [
  { key: 'a', label: 'Macht' },
  { key: 'b', label: 'Prestatie' },
  { key: 'c', label: 'Plezier' },
  { key: 'd', label: 'Stimulatie' },
  { key: 'e', label: 'Autonomie' },
  { key: 'f', label: 'Universalisme' },
  { key: 'g', label: 'Toegeeflijkheid' },
  { key: 'h', label: 'Traditie' },
  { key: 'i', label: 'Veiligheid' },
]

const organisatieItems = [
  { key: 'a', label: 'Detailgerichtheid' },
  { key: 'b', label: 'Klantgerichtheid' },
  { key: 'c', label: 'Resultaatgerichtheid' },
  { key: 'd', label: 'Stabiliteitgerichtheid' },
  { key: 'e', label: 'Samenwerkingsgerichtheid' },
  { key: 'f', label: 'Integriteitgerichtheid' },
  { key: 'g', label: 'Innovatiegerichtheid' },
]

type StepKey = 'intro' | 'werk-ranking' | 'werk-rating' | 'waarden-ranking' | 'waarden-rating' | 'org-ranking' | 'org-rating' | 'resultaat'

const steps: { key: StepKey; label: string }[] = [
  { key: 'intro', label: 'Introductie' },
  { key: 'werk-ranking', label: 'Werkzaamheden - Ranking' },
  { key: 'werk-rating', label: 'Werkzaamheden - Rating' },
  { key: 'waarden-ranking', label: 'Waarden - Ranking' },
  { key: 'waarden-rating', label: 'Waarden - Rating' },
  { key: 'org-ranking', label: 'Organisatie - Ranking' },
  { key: 'org-rating', label: 'Organisatie - Rating' },
  { key: 'resultaat', label: 'Resultaat' },
]

// ─── Components ──────────────────────────────────────────────────────────────

function RankingStep({
  items,
  rankings,
  onRankingChange,
}: {
  items: { key: string; label: string }[]
  rankings: Record<string, number>
  onRankingChange: (key: string, rank: number) => void
}) {
  const usedRanks = new Set(Object.values(rankings).filter(r => r > 0))
  const maxRank = items.length

  // Sort items by their current ranking for display
  const sortedItems = [...items].sort((a, b) => {
    const ra = rankings[a.key] || 0
    const rb = rankings[b.key] || 0
    if (ra === 0 && rb === 0) return 0
    if (ra === 0) return 1
    if (rb === 0) return -1
    return ra - rb
  })

  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-muted mb-3">
        Geef elk item een unieke positie van 1 (meest belangrijk) tot {maxRank} (minst belangrijk).
      </p>
      {sortedItems.map(item => {
        const currentRank = rankings[item.key] || 0
        return (
          <div key={item.key} className="flex items-center gap-3 bg-white rounded-xl border border-surface-border p-3 hover:border-purple/20 transition-colors">
            <select
              value={currentRank || ''}
              onChange={e => onRankingChange(item.key, parseInt(e.target.value) || 0)}
              className="w-14 text-center py-1.5 rounded-lg border border-surface-border text-sm font-semibold text-ink bg-surface-muted focus:ring-2 focus:ring-purple/30 focus:outline-none"
            >
              <option value="">-</option>
              {Array.from({ length: maxRank }, (_, i) => i + 1).map(rank => {
                const isUsed = usedRanks.has(rank) && currentRank !== rank
                return (
                  <option key={rank} value={rank} disabled={isUsed}>
                    {rank}
                  </option>
                )
              })}
            </select>
            <span className="text-sm text-ink flex-1">{item.label}</span>
            <div className="flex gap-1">
              {currentRank > 1 && (
                <button
                  onClick={() => {
                    // Find the item that currently has rank currentRank - 1 and swap
                    const swapKey = Object.entries(rankings).find(([, r]) => r === currentRank - 1)?.[0]
                    if (swapKey) {
                      onRankingChange(swapKey, currentRank)
                    }
                    onRankingChange(item.key, currentRank - 1)
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded bg-surface-muted text-ink-muted hover:bg-purple/10 hover:text-purple text-xs transition-colors"
                  title="Omhoog"
                >
                  &#9650;
                </button>
              )}
              {currentRank > 0 && currentRank < maxRank && (
                <button
                  onClick={() => {
                    const swapKey = Object.entries(rankings).find(([, r]) => r === currentRank + 1)?.[0]
                    if (swapKey) {
                      onRankingChange(swapKey, currentRank)
                    }
                    onRankingChange(item.key, currentRank + 1)
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded bg-surface-muted text-ink-muted hover:bg-purple/10 hover:text-purple text-xs transition-colors"
                  title="Omlaag"
                >
                  &#9660;
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RatingStep({
  items,
  ratings,
  onRatingChange,
  maxScale,
}: {
  items: { key: string; label: string }[]
  ratings: Record<string, number>
  onRatingChange: (key: string, value: number) => void
  maxScale: number
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-ink-muted mb-3">
        Beoordeel elk item op een schaal van 1 (helemaal niet belangrijk) tot {maxScale} (zeer belangrijk).
      </p>
      {items.map(item => {
        const currentRating = ratings[item.key] || 0
        return (
          <div key={item.key} className="bg-white rounded-xl border border-surface-border p-4">
            <p className="text-sm text-ink font-medium mb-2">{item.label}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxScale }, (_, i) => i + 1).map(val => (
                <button
                  key={val}
                  onClick={() => onRatingChange(item.key, val)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentRating === val
                      ? 'bg-purple text-white shadow-sm'
                      : 'bg-surface-muted text-ink-muted hover:bg-purple/10 hover:text-purple'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-ink-faint">Niet belangrijk</span>
              <span className="text-[10px] text-ink-faint">Zeer belangrijk</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ResultChart({
  werkRatings,
  waardenRatings,
  orgRatings,
}: {
  werkRatings: Record<string, number>
  waardenRatings: Record<string, number>
  orgRatings: Record<string, number>
}) {
  const sections = [
    { title: 'Werkzaamheden', items: werkzaamhedenItems, ratings: werkRatings, maxScale: 7, color: 'bg-cyan' },
    { title: 'Waarden', items: waardenItems, ratings: waardenRatings, maxScale: 9, color: 'bg-purple' },
    { title: 'Organisatiekenmerken', items: organisatieItems, ratings: orgRatings, maxScale: 7, color: 'bg-cyan-light' },
  ]

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-ink mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.items.map(item => {
              const value = section.ratings[item.key] || 0
              const pct = (value / section.maxScale) * 100
              return (
                <div key={item.key} className="flex items-center gap-3">
                  <span className="text-xs text-ink-light w-48 truncate">{item.label}</span>
                  <div className="flex-1 h-4 bg-surface-muted rounded-full overflow-hidden">
                    <div className={`h-full ${section.color} rounded-full transition-all duration-300`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-ink font-medium w-6 text-right">{value}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function MatchingScan() {
  const [currentStep, setCurrentStep] = useState(0)

  // Rankings state
  const [werkRankings, setWerkRankings] = useState<Record<string, number>>({})
  const [waardenRankings, setWaardenRankings] = useState<Record<string, number>>({})
  const [orgRankings, setOrgRankings] = useState<Record<string, number>>({})

  // Ratings state
  const [werkRatings, setWerkRatings] = useState<Record<string, number>>({})
  const [waardenRatings, setWaardenRatings] = useState<Record<string, number>>({})
  const [orgRatings, setOrgRatings] = useState<Record<string, number>>({})

  const [validationError, setValidationError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleRankingChange = useCallback((setter: React.Dispatch<React.SetStateAction<Record<string, number>>>) => {
    return (key: string, rank: number) => {
      setter(prev => {
        const next = { ...prev }
        if (rank === 0) {
          delete next[key]
        } else {
          next[key] = rank
        }
        return next
      })
      setValidationError(null)
    }
  }, [])

  const handleRatingChange = useCallback((setter: React.Dispatch<React.SetStateAction<Record<string, number>>>) => {
    return (key: string, value: number) => {
      setter(prev => ({ ...prev, [key]: value }))
      setValidationError(null)
    }
  }, [])

  const validateStep = (): boolean => {
    const step = steps[currentStep].key

    if (step === 'werk-ranking') {
      const ranked = Object.values(werkRankings).filter(r => r > 0).length
      if (ranked < werkzaamhedenItems.length) {
        setValidationError(`Geef alle ${werkzaamhedenItems.length} items een positie (${ranked}/${werkzaamhedenItems.length} ingevuld).`)
        return false
      }
    }
    if (step === 'werk-rating') {
      const rated = Object.values(werkRatings).filter(r => r > 0).length
      if (rated < werkzaamhedenItems.length) {
        setValidationError(`Beoordeel alle ${werkzaamhedenItems.length} items (${rated}/${werkzaamhedenItems.length} ingevuld).`)
        return false
      }
    }
    if (step === 'waarden-ranking') {
      const ranked = Object.values(waardenRankings).filter(r => r > 0).length
      if (ranked < waardenItems.length) {
        setValidationError(`Geef alle ${waardenItems.length} items een positie (${ranked}/${waardenItems.length} ingevuld).`)
        return false
      }
    }
    if (step === 'waarden-rating') {
      const rated = Object.values(waardenRatings).filter(r => r > 0).length
      if (rated < waardenItems.length) {
        setValidationError(`Beoordeel alle ${waardenItems.length} items (${rated}/${waardenItems.length} ingevuld).`)
        return false
      }
    }
    if (step === 'org-ranking') {
      const ranked = Object.values(orgRankings).filter(r => r > 0).length
      if (ranked < organisatieItems.length) {
        setValidationError(`Geef alle ${organisatieItems.length} items een positie (${ranked}/${organisatieItems.length} ingevuld).`)
        return false
      }
    }
    if (step === 'org-rating') {
      const rated = Object.values(orgRatings).filter(r => r > 0).length
      if (rated < organisatieItems.length) {
        setValidationError(`Beoordeel alle ${organisatieItems.length} items (${rated}/${organisatieItems.length} ingevuld).`)
        return false
      }
    }

    setValidationError(null)
    return true
  }

  const goNext = () => {
    if (currentStep === 0 || validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
      window.scrollTo(0, 0)
    }
  }

  const goPrev = () => {
    setValidationError(null)
    setCurrentStep(prev => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const handleSave = () => {
    setSaved(true)
    alert('Je voortgang is opgeslagen. Je kunt later verdergaan.')
  }

  const renderStep = () => {
    const step = steps[currentStep].key

    if (step === 'intro') {
      return (
        <div className="space-y-4 text-sm text-ink-light leading-relaxed">
          <h2 className="text-xl font-bold text-ink">Welkom bij de Matching Scan</h2>
          <p>
            De Matching Scan is een wetenschappelijk onderbouwde vragenlijst, ontwikkeld in samenwerking met de
            Vrije Universiteit Amsterdam. De scan meet hoe goed jij past bij een bepaalde vacature op drie dimensies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 text-center">
              <span className="text-2xl">💼</span>
              <p className="font-semibold text-ink mt-2">Werkzaamheden</p>
              <p className="text-xs text-ink-muted mt-1">19 activiteiten die je rangschikt en beoordeelt</p>
            </div>
            <div className="bg-purple/5 border border-purple/20 rounded-xl p-4 text-center">
              <span className="text-2xl">💎</span>
              <p className="font-semibold text-ink mt-2">Waarden</p>
              <p className="text-xs text-ink-muted mt-1">9 persoonlijke waarden die je prioriteert</p>
            </div>
            <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 text-center">
              <span className="text-2xl">🏢</span>
              <p className="font-semibold text-ink mt-2">Organisatiekenmerken</p>
              <p className="text-xs text-ink-muted mt-1">7 kenmerken van de ideale werkplek</p>
            </div>
          </div>
          <p>
            <strong className="text-ink">Hoe werkt het?</strong> Per dimensie doorloop je twee stappen: eerst rangschik je de
            items van meest naar minst belangrijk, daarna beoordeel je elk item op een schaal.
          </p>
          <p>
            <strong className="text-ink">Tijdsindicatie:</strong> De volledige scan duurt ongeveer 10-15 minuten.
            Je kunt op elk moment opslaan en later verdergaan.
          </p>
          <p>
            <strong className="text-ink">Resultaat:</strong> Na afronding wordt je POMP-profiel berekend en opgeslagen.
            Dit profiel wordt gebruikt om je M-Score te berekenen voor elke vacature waarvoor je wordt voorgedragen.
          </p>
        </div>
      )
    }

    if (step === 'werk-ranking') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">Werkzaamheden - Ranking</h2>
          <p className="text-sm text-ink-light mb-4">Rangschik de 19 werkactiviteiten van meest (1) naar minst (19) belangrijk voor jou.</p>
          <RankingStep items={werkzaamhedenItems} rankings={werkRankings} onRankingChange={handleRankingChange(setWerkRankings)} />
        </div>
      )
    }

    if (step === 'werk-rating') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">Werkzaamheden - Rating</h2>
          <p className="text-sm text-ink-light mb-4">Beoordeel elke werkactiviteit op een schaal van 1 tot 7.</p>
          <RatingStep items={werkzaamhedenItems} ratings={werkRatings} onRatingChange={handleRatingChange(setWerkRatings)} maxScale={7} />
        </div>
      )
    }

    if (step === 'waarden-ranking') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">Waarden - Ranking</h2>
          <p className="text-sm text-ink-light mb-4">Rangschik de 9 waarden van meest (1) naar minst (9) belangrijk voor jou.</p>
          <RankingStep items={waardenItems} rankings={waardenRankings} onRankingChange={handleRankingChange(setWaardenRankings)} />
        </div>
      )
    }

    if (step === 'waarden-rating') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">Waarden - Rating</h2>
          <p className="text-sm text-ink-light mb-4">Beoordeel elke waarde op een schaal van 1 tot 9.</p>
          <RatingStep items={waardenItems} ratings={waardenRatings} onRatingChange={handleRatingChange(setWaardenRatings)} maxScale={9} />
        </div>
      )
    }

    if (step === 'org-ranking') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">Organisatiekenmerken - Ranking</h2>
          <p className="text-sm text-ink-light mb-4">Rangschik de 7 organisatiekenmerken van meest (1) naar minst (7) belangrijk voor jou.</p>
          <RankingStep items={organisatieItems} rankings={orgRankings} onRankingChange={handleRankingChange(setOrgRankings)} />
        </div>
      )
    }

    if (step === 'org-rating') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">Organisatiekenmerken - Rating</h2>
          <p className="text-sm text-ink-light mb-4">Beoordeel elk organisatiekenmerk op een schaal van 1 tot 7.</p>
          <RatingStep items={organisatieItems} ratings={orgRatings} onRatingChange={handleRatingChange(setOrgRatings)} maxScale={7} />
        </div>
      )
    }

    if (step === 'resultaat') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-green-100 items-center justify-center text-3xl mb-3">
              &#10003;
            </div>
            <h2 className="text-xl font-bold text-ink">Uw profiel is opgeslagen</h2>
            <p className="text-sm text-ink-light mt-2">
              Uw POMP-profiel is succesvol berekend en opgeslagen. Hieronder ziet u een overzicht van uw scores.
            </p>
          </div>
          <ResultChart werkRatings={werkRatings} waardenRatings={waardenRatings} orgRatings={orgRatings} />
          <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 text-center">
            <p className="text-sm text-ink-light">
              Dit profiel wordt gebruikt om uw M-Score te berekenen voor vacatures waarvoor u wordt voorgedragen.
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-ink-muted mb-2">
          <span>Stap {currentStep + 1} van {steps.length}</span>
          <span>{steps[currentStep].label}</span>
        </div>
        <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan to-purple rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        {/* Step indicators */}
        <div className="flex justify-between mt-2">
          {steps.map((s, i) => (
            <div key={s.key} className={`w-2 h-2 rounded-full ${
              i <= currentStep ? 'bg-purple' : 'bg-surface-border'
            }`} />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 md:p-8">
        {renderStep()}
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {validationError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {!isFirstStep && !isLastStep && (
            <button onClick={goPrev}
              className="px-5 py-2.5 rounded-[10px] text-sm font-medium text-ink-light hover:text-ink border border-surface-border hover:border-ink/20 transition-colors">
              &larr; Vorige
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isLastStep && !isFirstStep && (
            <button onClick={handleSave}
              className="px-5 py-2.5 rounded-[10px] text-sm font-medium text-ink-muted hover:text-ink border border-surface-border hover:border-ink/20 transition-colors">
              Opslaan en later verder
            </button>
          )}
          {!isLastStep && (
            <button onClick={goNext}
              className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-[10px] text-sm hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              {isFirstStep ? 'Start scan' : 'Volgende'} &rarr;
            </button>
          )}
          {isLastStep && (
            <a href="/demo/kandidaat"
              className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-[10px] text-sm hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all inline-block">
              Terug naar dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
