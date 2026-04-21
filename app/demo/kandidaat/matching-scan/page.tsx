'use client'

import { useState, useCallback } from 'react'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    stepLabel: 'Stap',
    of: 'van',
    rankInstruction: (max: number) => `Geef elk item een unieke positie van 1 (meest belangrijk) tot ${max} (minst belangrijk).`,
    ratingInstruction: (max: number) => `Beoordeel elk item op een schaal van 1 (helemaal niet belangrijk) tot ${max} (zeer belangrijk).`,
    notImportant: 'Niet belangrijk',
    veryImportant: 'Zeer belangrijk',
    rankingValidation: (total: number, done: number) => `Geef alle ${total} items een positie (${done}/${total} ingevuld).`,
    ratingValidation: (total: number, done: number) => `Beoordeel alle ${total} items (${done}/${total} ingevuld).`,
    up: 'Omhoog',
    down: 'Omlaag',
    // Steps
    introTitle: 'Welkom bij de Matching Scan',
    introP1: 'De Matching Scan is een wetenschappelijk onderbouwde vragenlijst, ontwikkeld in samenwerking met de Vrije Universiteit Amsterdam. De scan meet hoe goed jij past bij een bepaalde vacature op drie dimensies:',
    cardWork: 'Werkzaamheden',
    cardWorkDesc: '19 activiteiten die je rangschikt en beoordeelt',
    cardValues: 'Waarden',
    cardValuesDesc: '9 persoonlijke waarden die je prioriteert',
    cardOrg: 'Organisatiekenmerken',
    cardOrgDesc: '7 kenmerken van de ideale werkplek',
    howTitle: 'Hoe werkt het?',
    howDesc: 'Per dimensie doorloop je twee stappen: eerst rangschik je de items van meest naar minst belangrijk, daarna beoordeel je elk item op een schaal.',
    timeTitle: 'Tijdsindicatie:',
    timeDesc: 'De volledige scan duurt ongeveer 10-15 minuten. Je kunt op elk moment opslaan en later verdergaan.',
    resultTitle: 'Resultaat:',
    resultDesc: 'Na afronding wordt je POMP-profiel berekend en opgeslagen. Dit profiel wordt gebruikt om je M-Score te berekenen voor elke vacature waarvoor je wordt voorgedragen.',
    // Work ranking/rating
    workRankingTitle: 'Werkzaamheden - Ranking',
    workRankingDesc: 'Rangschik de 19 werkactiviteiten van meest (1) naar minst (19) belangrijk voor jou.',
    workRatingTitle: 'Werkzaamheden - Rating',
    workRatingDesc: 'Beoordeel elke werkactiviteit op een schaal van 1 tot 7.',
    // Values ranking/rating
    valuesRankingTitle: 'Waarden - Ranking',
    valuesRankingDesc: 'Rangschik de 9 waarden van meest (1) naar minst (9) belangrijk voor jou.',
    valuesRatingTitle: 'Waarden - Rating',
    valuesRatingDesc: 'Beoordeel elke waarde op een schaal van 1 tot 9.',
    // Org ranking/rating
    orgRankingTitle: 'Organisatiekenmerken - Ranking',
    orgRankingDesc: 'Rangschik de 7 organisatiekenmerken van meest (1) naar minst (7) belangrijk voor jou.',
    orgRatingTitle: 'Organisatiekenmerken - Rating',
    orgRatingDesc: 'Beoordeel elk organisatiekenmerk op een schaal van 1 tot 7.',
    // Result
    resultSaved: 'Uw profiel is opgeslagen',
    resultSavedDesc: 'Uw POMP-profiel is succesvol berekend en opgeslagen. Hieronder ziet u een overzicht van uw scores.',
    resultUsage: 'Dit profiel wordt gebruikt om uw M-Score te berekenen voor vacatures waarvoor u wordt voorgedragen.',
    // Section titles in chart
    chartWork: 'Werkzaamheden',
    chartValues: 'Waarden',
    chartOrg: 'Organisatiekenmerken',
    // Nav buttons
    prev: '← Vorige',
    saveAndContinueLater: 'Opslaan en later verder',
    next: 'Volgende →',
    startScan: 'Start scan →',
    backToDashboard: 'Terug naar dashboard',
    saveProgress: 'Je voortgang is opgeslagen. Je kunt later verdergaan.',
  },
  en: {
    stepLabel: 'Step',
    of: 'of',
    rankInstruction: (max: number) => `Give each item a unique position from 1 (most important) to ${max} (least important).`,
    ratingInstruction: (max: number) => `Rate each item on a scale from 1 (not at all important) to ${max} (very important).`,
    notImportant: 'Not important',
    veryImportant: 'Very important',
    rankingValidation: (total: number, done: number) => `Give all ${total} items a position (${done}/${total} filled in).`,
    ratingValidation: (total: number, done: number) => `Rate all ${total} items (${done}/${total} filled in).`,
    up: 'Up',
    down: 'Down',
    // Steps
    introTitle: 'Welcome to the Matching Scan',
    introP1: 'The Matching Scan is a scientifically grounded questionnaire, developed in collaboration with Vrije Universiteit Amsterdam. The scan measures how well you fit a particular vacancy on three dimensions:',
    cardWork: 'Work activities',
    cardWorkDesc: '19 activities that you rank and rate',
    cardValues: 'Values',
    cardValuesDesc: '9 personal values that you prioritize',
    cardOrg: 'Organizational traits',
    cardOrgDesc: '7 characteristics of the ideal workplace',
    howTitle: 'How does it work?',
    howDesc: 'For each dimension you go through two steps: first you rank the items from most to least important, then you rate each item on a scale.',
    timeTitle: 'Time indication:',
    timeDesc: 'The full scan takes about 10-15 minutes. You can save at any time and continue later.',
    resultTitle: 'Result:',
    resultDesc: 'After completion, your POMP profile is calculated and saved. This profile is used to calculate your M-Score for each vacancy you are nominated for.',
    // Work ranking/rating
    workRankingTitle: 'Work activities - Ranking',
    workRankingDesc: 'Rank the 19 work activities from most (1) to least (19) important for you.',
    workRatingTitle: 'Work activities - Rating',
    workRatingDesc: 'Rate each work activity on a scale from 1 to 7.',
    // Values ranking/rating
    valuesRankingTitle: 'Values - Ranking',
    valuesRankingDesc: 'Rank the 9 values from most (1) to least (9) important for you.',
    valuesRatingTitle: 'Values - Rating',
    valuesRatingDesc: 'Rate each value on a scale from 1 to 9.',
    // Org ranking/rating
    orgRankingTitle: 'Organizational traits - Ranking',
    orgRankingDesc: 'Rank the 7 organizational traits from most (1) to least (7) important for you.',
    orgRatingTitle: 'Organizational traits - Rating',
    orgRatingDesc: 'Rate each organizational trait on a scale from 1 to 7.',
    // Result
    resultSaved: 'Your profile has been saved',
    resultSavedDesc: 'Your POMP profile has been successfully calculated and saved. Below you can see an overview of your scores.',
    resultUsage: 'This profile is used to calculate your M-Score for vacancies you are nominated for.',
    // Section titles in chart
    chartWork: 'Work activities',
    chartValues: 'Values',
    chartOrg: 'Organizational traits',
    // Nav buttons
    prev: '← Previous',
    saveAndContinueLater: 'Save and continue later',
    next: 'Next →',
    startScan: 'Start scan →',
    backToDashboard: 'Back to dashboard',
    saveProgress: 'Your progress has been saved. You can continue later.',
  },
}

// ─── Item definitions ────────────────────────────────────────────────────────

const werkzaamhedenItemsNl = [
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

const werkzaamhedenItemsEn = [
  { key: 'a', label: 'Facilitating people socially' },
  { key: 'b', label: 'Organizing matters' },
  { key: 'c', label: 'Financial administration' },
  { key: 'd', label: 'Processing data' },
  { key: 'e', label: 'Working with mechanics/machines' },
  { key: 'f', label: 'Working in nature/for the environment' },
  { key: 'g', label: 'Performing artistic work' },
  { key: 'h', label: 'Helping people' },
  { key: 'i', label: 'Providing specialized care' },
  { key: 'j', label: 'Doing influential work' },
  { key: 'k', label: 'Working with business systems' },
  { key: 'l', label: 'Performing quality checks' },
  { key: 'm', label: 'Doing operational work' },
  { key: 'n', label: 'Providing personal services' },
  { key: 'o', label: 'Analyzing finances' },
  { key: 'p', label: 'Doing specialized research' },
  { key: 'q', label: 'Building/repairing' },
  { key: 'r', label: 'Providing basic services' },
  { key: 's', label: 'Sports and play activities' },
]

const waardenItemsNl = [
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

const waardenItemsEn = [
  { key: 'a', label: 'Power' },
  { key: 'b', label: 'Achievement' },
  { key: 'c', label: 'Pleasure' },
  { key: 'd', label: 'Stimulation' },
  { key: 'e', label: 'Autonomy' },
  { key: 'f', label: 'Universalism' },
  { key: 'g', label: 'Benevolence' },
  { key: 'h', label: 'Tradition' },
  { key: 'i', label: 'Security' },
]

const organisatieItemsNl = [
  { key: 'a', label: 'Detailgerichtheid' },
  { key: 'b', label: 'Klantgerichtheid' },
  { key: 'c', label: 'Resultaatgerichtheid' },
  { key: 'd', label: 'Stabiliteitgerichtheid' },
  { key: 'e', label: 'Samenwerkingsgerichtheid' },
  { key: 'f', label: 'Integriteitgerichtheid' },
  { key: 'g', label: 'Innovatiegerichtheid' },
]

const organisatieItemsEn = [
  { key: 'a', label: 'Detail orientation' },
  { key: 'b', label: 'Customer orientation' },
  { key: 'c', label: 'Results orientation' },
  { key: 'd', label: 'Stability orientation' },
  { key: 'e', label: 'Collaboration orientation' },
  { key: 'f', label: 'Integrity orientation' },
  { key: 'g', label: 'Innovation orientation' },
]

type StepKey = 'intro' | 'werk-ranking' | 'werk-rating' | 'waarden-ranking' | 'waarden-rating' | 'org-ranking' | 'org-rating' | 'resultaat'

const stepsNl: { key: StepKey; label: string }[] = [
  { key: 'intro', label: 'Introductie' },
  { key: 'werk-ranking', label: 'Werkzaamheden - Ranking' },
  { key: 'werk-rating', label: 'Werkzaamheden - Rating' },
  { key: 'waarden-ranking', label: 'Waarden - Ranking' },
  { key: 'waarden-rating', label: 'Waarden - Rating' },
  { key: 'org-ranking', label: 'Organisatie - Ranking' },
  { key: 'org-rating', label: 'Organisatie - Rating' },
  { key: 'resultaat', label: 'Resultaat' },
]

const stepsEn: { key: StepKey; label: string }[] = [
  { key: 'intro', label: 'Introduction' },
  { key: 'werk-ranking', label: 'Work activities - Ranking' },
  { key: 'werk-rating', label: 'Work activities - Rating' },
  { key: 'waarden-ranking', label: 'Values - Ranking' },
  { key: 'waarden-rating', label: 'Values - Rating' },
  { key: 'org-ranking', label: 'Organizational traits - Ranking' },
  { key: 'org-rating', label: 'Organizational traits - Rating' },
  { key: 'resultaat', label: 'Result' },
]

// ─── Components ──────────────────────────────────────────────────────────────

function RankingStep({
  items,
  rankings,
  onRankingChange,
  instruction,
  upLabel,
  downLabel,
}: {
  items: { key: string; label: string }[]
  rankings: Record<string, number>
  onRankingChange: (key: string, rank: number) => void
  instruction: string
  upLabel: string
  downLabel: string
}) {
  const usedRanks = new Set(Object.values(rankings).filter(r => r > 0))
  const maxRank = items.length

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
      <p className="text-xs text-ink-muted mb-3">{instruction}</p>
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
                    const swapKey = Object.entries(rankings).find(([, r]) => r === currentRank - 1)?.[0]
                    if (swapKey) {
                      onRankingChange(swapKey, currentRank)
                    }
                    onRankingChange(item.key, currentRank - 1)
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded bg-surface-muted text-ink-muted hover:bg-purple/10 hover:text-purple text-xs transition-colors"
                  title={upLabel}
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
                  title={downLabel}
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
  instruction,
  notImportant,
  veryImportant,
}: {
  items: { key: string; label: string }[]
  ratings: Record<string, number>
  onRatingChange: (key: string, value: number) => void
  maxScale: number
  instruction: string
  notImportant: string
  veryImportant: string
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-ink-muted mb-3">{instruction}</p>
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
              <span className="text-[10px] text-ink-muted">{notImportant}</span>
              <span className="text-[10px] text-ink-muted">{veryImportant}</span>
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
  chartWork,
  chartValues,
  chartOrg,
}: {
  werkRatings: Record<string, number>
  waardenRatings: Record<string, number>
  orgRatings: Record<string, number>
  chartWork: string
  chartValues: string
  chartOrg: string
}) {
  const { lang } = useLang()
  const werkzaamhedenItems = lang === 'en' ? werkzaamhedenItemsEn : werkzaamhedenItemsNl
  const waardenItems = lang === 'en' ? waardenItemsEn : waardenItemsNl
  const organisatieItems = lang === 'en' ? organisatieItemsEn : organisatieItemsNl

  const sections = [
    { title: chartWork, items: werkzaamhedenItems, ratings: werkRatings, maxScale: 7, color: 'bg-cyan' },
    { title: chartValues, items: waardenItems, ratings: waardenRatings, maxScale: 9, color: 'bg-purple' },
    { title: chartOrg, items: organisatieItems, ratings: orgRatings, maxScale: 7, color: 'bg-cyan-light' },
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
  const { lang } = useLang()
  const t = texts[lang]
  const steps = lang === 'en' ? stepsEn : stepsNl
  const werkzaamhedenItems = lang === 'en' ? werkzaamhedenItemsEn : werkzaamhedenItemsNl
  const waardenItems = lang === 'en' ? waardenItemsEn : waardenItemsNl
  const organisatieItems = lang === 'en' ? organisatieItemsEn : organisatieItemsNl

  const [currentStep, setCurrentStep] = useState(0)

  const [werkRankings, setWerkRankings] = useState<Record<string, number>>({})
  const [waardenRankings, setWaardenRankings] = useState<Record<string, number>>({})
  const [orgRankings, setOrgRankings] = useState<Record<string, number>>({})

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
        setValidationError(t.rankingValidation(werkzaamhedenItems.length, ranked))
        return false
      }
    }
    if (step === 'werk-rating') {
      const rated = Object.values(werkRatings).filter(r => r > 0).length
      if (rated < werkzaamhedenItems.length) {
        setValidationError(t.ratingValidation(werkzaamhedenItems.length, rated))
        return false
      }
    }
    if (step === 'waarden-ranking') {
      const ranked = Object.values(waardenRankings).filter(r => r > 0).length
      if (ranked < waardenItems.length) {
        setValidationError(t.rankingValidation(waardenItems.length, ranked))
        return false
      }
    }
    if (step === 'waarden-rating') {
      const rated = Object.values(waardenRatings).filter(r => r > 0).length
      if (rated < waardenItems.length) {
        setValidationError(t.ratingValidation(waardenItems.length, rated))
        return false
      }
    }
    if (step === 'org-ranking') {
      const ranked = Object.values(orgRankings).filter(r => r > 0).length
      if (ranked < organisatieItems.length) {
        setValidationError(t.rankingValidation(organisatieItems.length, ranked))
        return false
      }
    }
    if (step === 'org-rating') {
      const rated = Object.values(orgRatings).filter(r => r > 0).length
      if (rated < organisatieItems.length) {
        setValidationError(t.ratingValidation(organisatieItems.length, rated))
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
    alert(t.saveProgress)
  }

  const renderStep = () => {
    const step = steps[currentStep].key

    if (step === 'intro') {
      return (
        <div className="space-y-4 text-sm text-ink-light leading-relaxed">
          <h2 className="text-xl font-bold text-ink">{t.introTitle}</h2>
          <p>{t.introP1}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 text-center">
              <span className="text-2xl">💼</span>
              <p className="font-semibold text-ink mt-2">{t.cardWork}</p>
              <p className="text-xs text-ink-muted mt-1">{t.cardWorkDesc}</p>
            </div>
            <div className="bg-purple/5 border border-purple/20 rounded-xl p-4 text-center">
              <span className="text-2xl">💎</span>
              <p className="font-semibold text-ink mt-2">{t.cardValues}</p>
              <p className="text-xs text-ink-muted mt-1">{t.cardValuesDesc}</p>
            </div>
            <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 text-center">
              <span className="text-2xl">🏢</span>
              <p className="font-semibold text-ink mt-2">{t.cardOrg}</p>
              <p className="text-xs text-ink-muted mt-1">{t.cardOrgDesc}</p>
            </div>
          </div>
          <p>
            <strong className="text-ink">{t.howTitle}</strong> {t.howDesc}
          </p>
          <p>
            <strong className="text-ink">{t.timeTitle}</strong> {t.timeDesc}
          </p>
          <p>
            <strong className="text-ink">{t.resultTitle}</strong> {t.resultDesc}
          </p>
        </div>
      )
    }

    if (step === 'werk-ranking') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">{t.workRankingTitle}</h2>
          <p className="text-sm text-ink-light mb-4">{t.workRankingDesc}</p>
          <RankingStep items={werkzaamhedenItems} rankings={werkRankings} onRankingChange={handleRankingChange(setWerkRankings)} instruction={t.rankInstruction(werkzaamhedenItems.length)} upLabel={t.up} downLabel={t.down} />
        </div>
      )
    }

    if (step === 'werk-rating') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">{t.workRatingTitle}</h2>
          <p className="text-sm text-ink-light mb-4">{t.workRatingDesc}</p>
          <RatingStep items={werkzaamhedenItems} ratings={werkRatings} onRatingChange={handleRatingChange(setWerkRatings)} maxScale={7} instruction={t.ratingInstruction(7)} notImportant={t.notImportant} veryImportant={t.veryImportant} />
        </div>
      )
    }

    if (step === 'waarden-ranking') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">{t.valuesRankingTitle}</h2>
          <p className="text-sm text-ink-light mb-4">{t.valuesRankingDesc}</p>
          <RankingStep items={waardenItems} rankings={waardenRankings} onRankingChange={handleRankingChange(setWaardenRankings)} instruction={t.rankInstruction(waardenItems.length)} upLabel={t.up} downLabel={t.down} />
        </div>
      )
    }

    if (step === 'waarden-rating') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">{t.valuesRatingTitle}</h2>
          <p className="text-sm text-ink-light mb-4">{t.valuesRatingDesc}</p>
          <RatingStep items={waardenItems} ratings={waardenRatings} onRatingChange={handleRatingChange(setWaardenRatings)} maxScale={9} instruction={t.ratingInstruction(9)} notImportant={t.notImportant} veryImportant={t.veryImportant} />
        </div>
      )
    }

    if (step === 'org-ranking') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">{t.orgRankingTitle}</h2>
          <p className="text-sm text-ink-light mb-4">{t.orgRankingDesc}</p>
          <RankingStep items={organisatieItems} rankings={orgRankings} onRankingChange={handleRankingChange(setOrgRankings)} instruction={t.rankInstruction(organisatieItems.length)} upLabel={t.up} downLabel={t.down} />
        </div>
      )
    }

    if (step === 'org-rating') {
      return (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">{t.orgRatingTitle}</h2>
          <p className="text-sm text-ink-light mb-4">{t.orgRatingDesc}</p>
          <RatingStep items={organisatieItems} ratings={orgRatings} onRatingChange={handleRatingChange(setOrgRatings)} maxScale={7} instruction={t.ratingInstruction(7)} notImportant={t.notImportant} veryImportant={t.veryImportant} />
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
            <h2 className="text-xl font-bold text-ink">{t.resultSaved}</h2>
            <p className="text-sm text-ink-light mt-2">{t.resultSavedDesc}</p>
          </div>
          <ResultChart werkRatings={werkRatings} waardenRatings={waardenRatings} orgRatings={orgRatings} chartWork={t.chartWork} chartValues={t.chartValues} chartOrg={t.chartOrg} />
          <div className="bg-cyan/5 border border-cyan/20 rounded-xl p-4 text-center">
            <p className="text-sm text-ink-light">{t.resultUsage}</p>
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
          <span>{t.stepLabel} {currentStep + 1} {t.of} {steps.length}</span>
          <span>{steps[currentStep].label}</span>
        </div>
        <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan to-purple rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
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
              {t.prev}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isLastStep && !isFirstStep && (
            <button onClick={handleSave}
              className="px-5 py-2.5 rounded-[10px] text-sm font-medium text-ink-muted hover:text-ink border border-surface-border hover:border-ink/20 transition-colors">
              {t.saveAndContinueLater}
            </button>
          )}
          {!isLastStep && (
            <button onClick={goNext}
              className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-[10px] text-sm hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all">
              {isFirstStep ? t.startScan : t.next}
            </button>
          )}
          {isLastStep && (
            <a href="/demo/kandidaat"
              className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-[10px] text-sm hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(6,186,255,0.3)] transition-all inline-block">
              {t.backToDashboard}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
