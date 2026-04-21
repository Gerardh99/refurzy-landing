'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { allVacatures } from '@/lib/mock-data'
import { VAKGEBIEDEN, LANDEN } from '@/lib/constants'
import { useFavoriteVacatures } from '@/lib/useFavoriteVacatures'
import { useLang } from '@/lib/i18n'

const texts = {
  nl: {
    pageTitle: 'Vacatures',
    pageSubtitle: 'Bekijk openstaande vacatures en bewaar je favorieten',
    searchPlaceholder: 'Zoek op titel of bedrijf...',
    locationPlaceholder: 'Filter op locatie...',
    sortNewest: 'Nieuwste eerst',
    sortSalary: 'Salaris hoog-laag',
    sortDeadline: 'Deadline',
    filterBtn: 'Filters',
    filterFunctionArea: 'Functiegebied',
    filterAllFunctionAreas: 'Alle functiegebieden',
    filterCountry: 'Land',
    filterAllCountries: 'Alle landen',
    filterMinSalary: 'Min salaris',
    filterMinSalaryPlaceholder: 'bijv. 3000',
    filterMaxSalary: 'Max salaris',
    filterMaxSalaryPlaceholder: 'bijv. 7000',
    filterContract: 'Contract',
    filterAllContracts: 'Alle contracten',
    filterWorkModel: 'Werkmodel',
    filterAllWorkModels: 'Alle werkmodellen',
    filterEducation: 'Opleiding',
    filterAllLevels: 'Alle niveaus',
    filterExperience: 'Ervaring',
    filterAllExperience: 'Alle ervaring',
    filterExperienceUnit: 'jaar',
    clearFilters: 'Alle filters wissen',
    resultCount: (n: number) => `${n} vacature${n !== 1 ? 's' : ''} gevonden`,
    myFavorites: 'Mijn favorieten',
    otherVacancies: 'Overige vacatures',
    allVacancies: 'Alle vacatures',
    noVacancies: 'Geen vacatures gevonden.',
    deadline: 'Deadline:',
    exclusivityLabel: 'Exclusiviteit kandidaat:',
    exclusivityYes: 'Ja',
    exclusivityNo: 'Nee',
    exclusivityNote: '* incl. exclusiviteitstoeslag',
    ariaAddFavorite: 'Voeg toe aan favorieten',
    ariaRemoveFavorite: 'Verwijder uit favorieten',
    chipFunctionArea: 'Functiegebied',
    chipCountry: 'Land',
    chipMinSalary: 'Min salaris',
    chipMaxSalary: 'Max salaris',
    chipContract: 'Contract',
    chipWorkModel: 'Werkmodel',
    chipEducation: 'Opleiding',
    chipExperience: 'Ervaring',
    chipExperienceUnit: 'jaar',
  },
  en: {
    pageTitle: 'Vacancies',
    pageSubtitle: 'Browse open vacancies and save your favourites',
    searchPlaceholder: 'Search by title or company...',
    locationPlaceholder: 'Filter by location...',
    sortNewest: 'Newest first',
    sortSalary: 'Salary high-low',
    sortDeadline: 'Deadline',
    filterBtn: 'Filters',
    filterFunctionArea: 'Function area',
    filterAllFunctionAreas: 'All function areas',
    filterCountry: 'Country',
    filterAllCountries: 'All countries',
    filterMinSalary: 'Min salary',
    filterMinSalaryPlaceholder: 'e.g. 3000',
    filterMaxSalary: 'Max salary',
    filterMaxSalaryPlaceholder: 'e.g. 7000',
    filterContract: 'Contract',
    filterAllContracts: 'All contracts',
    filterWorkModel: 'Work model',
    filterAllWorkModels: 'All work models',
    filterEducation: 'Education',
    filterAllLevels: 'All levels',
    filterExperience: 'Experience',
    filterAllExperience: 'All experience',
    filterExperienceUnit: 'years',
    clearFilters: 'Clear all filters',
    resultCount: (n: number) => `${n} vacanc${n !== 1 ? 'ies' : 'y'} found`,
    myFavorites: 'My favourites',
    otherVacancies: 'Other vacancies',
    allVacancies: 'All vacancies',
    noVacancies: 'No vacancies found.',
    deadline: 'Deadline:',
    exclusivityLabel: 'Candidate exclusivity:',
    exclusivityYes: 'Yes',
    exclusivityNo: 'No',
    exclusivityNote: '* incl. exclusivity surcharge',
    ariaAddFavorite: 'Add to favourites',
    ariaRemoveFavorite: 'Remove from favourites',
    chipFunctionArea: 'Function area',
    chipCountry: 'Country',
    chipMinSalary: 'Min salary',
    chipMaxSalary: 'Max salary',
    chipContract: 'Contract',
    chipWorkModel: 'Work model',
    chipEducation: 'Education',
    chipExperience: 'Experience',
    chipExperienceUnit: 'years',
  },
}

const CONTRACT_TYPES = ['Vast', 'Tijdelijk', 'Freelance']
const WERKMODELLEN = ['Op kantoor', 'Hybride', 'Volledig remote']
const OPLEIDINGEN = ['MBO', 'HBO', 'WO']
const ERVARINGEN = ['0-2', '2-5', '5-10', '10+']

// Legacy mappings for vacatures without explicit fields
const vacatureContractTypes: Record<string, string> = {
  'vac-1': 'Vast',
  'vac-2': 'Vast',
  'vac-3': 'Tijdelijk',
  'vac-4': 'Vast',
}
const vacatureWerkmodellen: Record<string, string> = {
  'vac-1': 'Hybride',
  'vac-2': 'Volledig remote',
  'vac-3': 'Op kantoor',
  'vac-4': 'Hybride',
}

interface Filters {
  vakgebied: string
  land: string
  salarisMin: string
  salarisMax: string
  contractType: string
  werkmodel: string
  opleiding: string
  ervaring: string
}

const emptyFilters: Filters = {
  vakgebied: '',
  land: '',
  salarisMin: '',
  salarisMax: '',
  contractType: '',
  werkmodel: '',
  opleiding: '',
  ervaring: '',
}

function parseSalaris(s: string): number {
  const match = s.match(/[\d.,]+/g)
  if (!match) return 0
  return parseInt(match[match.length - 1].replace('.', '').replace(',', ''), 10)
}

function parseSalarisMin(s: string): number {
  const match = s.match(/[\d.,]+/g)
  if (!match) return 0
  return parseInt(match[0].replace('.', '').replace(',', ''), 10)
}

export default function ScoutVacatures() {
  const { lang } = useLang()
  const t = texts[lang]

  const SORT_OPTIONS = [
    { value: 'nieuwste', label: t.sortNewest },
    { value: 'salaris', label: t.sortSalary },
    { value: 'deadline', label: t.sortDeadline },
  ]

  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const { favorites, toggleFavorite } = useFavoriteVacatures()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [sortBy, setSortBy] = useState('nieuwste')

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const removeFilter = (key: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [key]: '' }))
  }

  const activeFilterChips = useMemo(() => {
    const chips: { key: keyof Filters; label: string }[] = []
    if (filters.vakgebied) chips.push({ key: 'vakgebied', label: `${t.chipFunctionArea}: ${filters.vakgebied}` })
    if (filters.land) chips.push({ key: 'land', label: `${t.chipCountry}: ${filters.land}` })
    if (filters.salarisMin) chips.push({ key: 'salarisMin', label: `${t.chipMinSalary}: \u20AC${filters.salarisMin}` })
    if (filters.salarisMax) chips.push({ key: 'salarisMax', label: `${t.chipMaxSalary}: \u20AC${filters.salarisMax}` })
    if (filters.contractType) chips.push({ key: 'contractType', label: `${t.chipContract}: ${filters.contractType}` })
    if (filters.werkmodel) chips.push({ key: 'werkmodel', label: `${t.chipWorkModel}: ${filters.werkmodel}` })
    if (filters.opleiding) chips.push({ key: 'opleiding', label: `${t.chipEducation}: ${filters.opleiding}` })
    if (filters.ervaring) chips.push({ key: 'ervaring', label: `${t.chipExperience}: ${filters.ervaring} ${t.chipExperienceUnit}` })
    return chips
  }, [filters, t])

  const filtered = useMemo(() => {
    let result = allVacatures.filter((v) => {
      const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.company.toLowerCase().includes(search.toLowerCase())
      const matchLocation = !locationFilter || v.location.toLowerCase().includes(locationFilter.toLowerCase())
      const matchVakgebied = !filters.vakgebied || v.vakgebied === filters.vakgebied
      const matchLand = !filters.land || v.land === filters.land
      const matchContract = !filters.contractType || vacatureContractTypes[v.id] === filters.contractType
      const matchWerkmodel = !filters.werkmodel || vacatureWerkmodellen[v.id] === filters.werkmodel
      const matchOpleiding = !filters.opleiding || v.hardeCriteria.opleidingsniveau === filters.opleiding
      const matchErvaring = !filters.ervaring || v.hardeCriteria.minimaleErvaring.startsWith(filters.ervaring)

      let matchSalarisMin = true
      let matchSalarisMax = true
      if (filters.salarisMin) {
        const min = parseInt(filters.salarisMin, 10)
        matchSalarisMin = parseSalaris(v.salaris) >= min
      }
      if (filters.salarisMax) {
        const max = parseInt(filters.salarisMax, 10)
        matchSalarisMax = parseSalarisMin(v.salaris) <= max
      }

      return matchSearch && matchLocation && matchVakgebied && matchLand && matchContract && matchWerkmodel && matchOpleiding && matchErvaring && matchSalarisMin && matchSalarisMax
    })

    // Sort
    if (sortBy === 'nieuwste') {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'salaris') {
      result = [...result].sort((a, b) => parseSalaris(b.salaris) - parseSalaris(a.salaris))
    } else if (sortBy === 'deadline') {
      result = [...result].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    }

    return result
  }, [search, locationFilter, filters, sortBy])

  const favorieten = filtered.filter((v) => favorites.has(v.id))
  const overige = filtered.filter((v) => !favorites.has(v.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="text-ink-light font-medium mt-1">{t.pageSubtitle}</p>
      </div>

      {/* Search bar + location + sort */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
        />
        <input
          type="text"
          placeholder={t.locationPlaceholder}
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-48 bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
            filtersOpen || activeFilterChips.length > 0
              ? 'bg-purple/10 border-purple/30 text-purple'
              : 'bg-surface-muted border-surface-border text-ink-light hover:border-purple/20'
          }`}
        >
          {t.filterBtn} {activeFilterChips.length > 0 && `(${activeFilterChips.length})`}
        </button>
      </div>

      {/* Collapsible filter panel */}
      {filtersOpen && (
        <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Functiegebied */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">{t.filterFunctionArea}</label>
              <select
                value={filters.vakgebied}
                onChange={(e) => updateFilter('vakgebied', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">{t.filterAllFunctionAreas}</option>
                {VAKGEBIEDEN.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            {/* Land */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">{t.filterCountry}</label>
              <select
                value={filters.land}
                onChange={(e) => updateFilter('land', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">{t.filterAllCountries}</option>
                {LANDEN.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Salaris range */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">{t.filterMinSalary}</label>
              <input
                type="number"
                placeholder={t.filterMinSalaryPlaceholder}
                value={filters.salarisMin}
                onChange={(e) => updateFilter('salarisMin', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">{t.filterMaxSalary}</label>
              <input
                type="number"
                placeholder={t.filterMaxSalaryPlaceholder}
                value={filters.salarisMax}
                onChange={(e) => updateFilter('salarisMax', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>

            {/* Contract type */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">{t.filterContract}</label>
              <select
                value={filters.contractType}
                onChange={(e) => updateFilter('contractType', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">{t.filterAllContracts}</option>
                {CONTRACT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Werkmodel */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">{t.filterWorkModel}</label>
              <select
                value={filters.werkmodel}
                onChange={(e) => updateFilter('werkmodel', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">{t.filterAllWorkModels}</option>
                {WERKMODELLEN.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {/* Opleiding */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">{t.filterEducation}</label>
              <select
                value={filters.opleiding}
                onChange={(e) => updateFilter('opleiding', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">{t.filterAllLevels}</option>
                {OPLEIDINGEN.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Ervaring */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">{t.filterExperience}</label>
              <select
                value={filters.ervaring}
                onChange={(e) => updateFilter('ervaring', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">{t.filterAllExperience}</option>
                {ERVARINGEN.map((e) => <option key={e} value={e}>{e} {t.filterExperienceUnit}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setFilters(emptyFilters)}
              className="text-sm text-ink-light hover:text-purple transition-colors"
            >
              {t.clearFilters}
            </button>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilterChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 bg-purple/10 text-purple text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {chip.label}
              <button
                onClick={() => removeFilter(chip.key)}
                className="hover:text-purple-dark transition-colors"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Result count */}
      <p className="text-sm text-ink-light">
        {t.resultCount(filtered.length)}
      </p>

      {/* Favorites section */}
      {favorieten.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-cyan flex items-center gap-2">
            <span>&#9733;</span> {t.myFavorites}
          </h2>
          <div className="space-y-3">
            {favorieten.map((v) => (
              <VacatureCard key={v.id} v={v} isFav={true} onToggle={() => toggleFavorite(v.id)} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* All / remaining vacatures */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">
          {favorieten.length > 0 ? t.otherVacancies : t.allVacancies}
        </h2>
        <div className="space-y-3">
          {overige.map((v) => (
            <VacatureCard key={v.id} v={v} isFav={false} onToggle={() => toggleFavorite(v.id)} t={t} />
          ))}
        </div>
        {overige.length === 0 && favorieten.length === 0 && (
          <p className="text-ink-muted text-sm">{t.noVacancies}</p>
        )}
      </div>
    </div>
  )
}

function VacatureCard({ v, isFav, onToggle, t }: { v: any; isFav: boolean; onToggle: () => void; t: typeof texts['nl'] }) {
  const contractType = vacatureContractTypes[v.id] || 'Vast'
  const werkmodel = vacatureWerkmodellen[v.id] || 'Hybride'
  const fee = v.scoutVergoeding ?? 0
  const hasExcl = v.exclusiviteit === true

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 flex items-start justify-between gap-4 hover:border-purple/30 transition-colors">
      <Link href={`/demo/scout/vacature/${v.id}`} className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-ink hover:text-purple transition-colors">{v.title}</h3>
          <span className="text-sm text-purple bg-purple/10 px-2.5 py-0.5 rounded-full font-medium">{v.company}</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink">
          <span className="font-medium">{v.location}, {v.land}</span>
          <span className="font-medium">{v.salaris}</span>
          <span>{t.deadline} {new Date(v.deadline).toLocaleDateString('nl-NL')}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-sm bg-cyan/10 text-cyan px-2.5 py-0.5 rounded-full font-medium">{v.vakgebied}</span>
          <span className="text-sm bg-slate-100 text-ink px-2.5 py-0.5 rounded-full font-medium">{v.land}</span>
          <span className="text-sm bg-slate-100 text-ink px-2.5 py-0.5 rounded-full font-medium">{contractType}</span>
          <span className="text-sm bg-slate-100 text-ink px-2.5 py-0.5 rounded-full font-medium">{werkmodel}</span>
          <span className="text-sm bg-slate-100 text-ink px-2.5 py-0.5 rounded-full font-medium">{v.hardeCriteria.opleidingsniveau}</span>
          <span className="text-sm bg-slate-100 text-ink px-2.5 py-0.5 rounded-full font-medium">{v.hardeCriteria.minimaleErvaring}</span>
        </div>
      </Link>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button
          onClick={onToggle}
          className={`text-2xl transition-colors ${isFav ? 'text-cyan' : 'text-ink-muted hover:text-cyan/60'}`}
          aria-label={isFav ? t.ariaRemoveFavorite : t.ariaAddFavorite}
        >
          {isFav ? '\u2605' : '\u2606'}
        </button>
        {fee > 0 && (
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">{'\u20AC'}{fee.toLocaleString('nl-NL')}{hasExcl ? ' *' : ''}</p>
            <p className="text-xs text-ink-light mt-0.5">
              {t.exclusivityLabel} <span className={`font-semibold ${hasExcl ? 'text-green-600' : 'text-ink-muted'}`}>{hasExcl ? t.exclusivityYes : t.exclusivityNo}</span>
            </p>
            {hasExcl && <p className="text-[10px] text-ink-muted">{t.exclusivityNote}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
