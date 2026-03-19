'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { allVacatures } from '@/lib/mock-data'

const SECTORS = ['IT', 'Marketing', 'Finance', 'HR', 'Sales', 'Operations', 'Overig']
const CONTRACT_TYPES = ['Vast', 'Tijdelijk', 'Freelance']
const WERKMODELLEN = ['Op kantoor', 'Hybride', 'Volledig remote']
const OPLEIDINGEN = ['MBO', 'HBO', 'WO']
const ERVARINGEN = ['0-2', '2-5', '5-10', '10+']
const SORT_OPTIONS = [
  { value: 'nieuwste', label: 'Nieuwste eerst' },
  { value: 'salaris', label: 'Salaris hoog-laag' },
  { value: 'deadline', label: 'Deadline' },
]

// Map vacatures to sectors for demo
const vacatureSectors: Record<string, string> = {
  'vac-1': 'Marketing',
  'vac-2': 'IT',
  'vac-3': 'HR',
  'vac-4': 'Finance',
}
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
  sector: string
  salarisMin: string
  salarisMax: string
  contractType: string
  werkmodel: string
  opleiding: string
  ervaring: string
}

const emptyFilters: Filters = {
  sector: '',
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
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [sortBy, setSortBy] = useState('nieuwste')

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const removeFilter = (key: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [key]: '' }))
  }

  const activeFilterChips = useMemo(() => {
    const chips: { key: keyof Filters; label: string }[] = []
    if (filters.sector) chips.push({ key: 'sector', label: `Sector: ${filters.sector}` })
    if (filters.salarisMin) chips.push({ key: 'salarisMin', label: `Min salaris: \u20AC${filters.salarisMin}` })
    if (filters.salarisMax) chips.push({ key: 'salarisMax', label: `Max salaris: \u20AC${filters.salarisMax}` })
    if (filters.contractType) chips.push({ key: 'contractType', label: `Contract: ${filters.contractType}` })
    if (filters.werkmodel) chips.push({ key: 'werkmodel', label: `Werkmodel: ${filters.werkmodel}` })
    if (filters.opleiding) chips.push({ key: 'opleiding', label: `Opleiding: ${filters.opleiding}` })
    if (filters.ervaring) chips.push({ key: 'ervaring', label: `Ervaring: ${filters.ervaring} jaar` })
    return chips
  }, [filters])

  const filtered = useMemo(() => {
    let result = allVacatures.filter((v) => {
      const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.company.toLowerCase().includes(search.toLowerCase())
      const matchLocation = !locationFilter || v.location.toLowerCase().includes(locationFilter.toLowerCase())
      const matchSector = !filters.sector || vacatureSectors[v.id] === filters.sector
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

      return matchSearch && matchLocation && matchSector && matchContract && matchWerkmodel && matchOpleiding && matchErvaring && matchSalarisMin && matchSalarisMax
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
        <h1 className="text-2xl font-bold text-ink">Vacatures</h1>
        <p className="text-ink-light mt-1">Bekijk openstaande vacatures en bewaar je favorieten</p>
      </div>

      {/* Search bar + location + sort */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Zoek op titel of bedrijf..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
        />
        <input
          type="text"
          placeholder="Filter op locatie..."
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
          Filters {activeFilterChips.length > 0 && `(${activeFilterChips.length})`}
        </button>
      </div>

      {/* Collapsible filter panel */}
      {filtersOpen && (
        <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Sector */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">Sector</label>
              <select
                value={filters.sector}
                onChange={(e) => updateFilter('sector', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">Alle sectoren</option>
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Salaris range */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">Min salaris</label>
              <input
                type="number"
                placeholder="bijv. 3000"
                value={filters.salarisMin}
                onChange={(e) => updateFilter('salarisMin', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">Max salaris</label>
              <input
                type="number"
                placeholder="bijv. 7000"
                value={filters.salarisMax}
                onChange={(e) => updateFilter('salarisMax', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>

            {/* Contract type */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">Contract</label>
              <select
                value={filters.contractType}
                onChange={(e) => updateFilter('contractType', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">Alle contracten</option>
                {CONTRACT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Werkmodel */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">Werkmodel</label>
              <select
                value={filters.werkmodel}
                onChange={(e) => updateFilter('werkmodel', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">Alle werkmodellen</option>
                {WERKMODELLEN.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {/* Opleiding */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">Opleiding</label>
              <select
                value={filters.opleiding}
                onChange={(e) => updateFilter('opleiding', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">Alle niveaus</option>
                {OPLEIDINGEN.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Ervaring */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">Ervaring</label>
              <select
                value={filters.ervaring}
                onChange={(e) => updateFilter('ervaring', e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-cyan/50"
              >
                <option value="">Alle ervaring</option>
                {ERVARINGEN.map((e) => <option key={e} value={e}>{e} jaar</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setFilters(emptyFilters)}
              className="text-sm text-ink-light hover:text-purple transition-colors"
            >
              Alle filters wissen
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
        {filtered.length} vacature{filtered.length !== 1 ? 's' : ''} gevonden
      </p>

      {/* Favorites section */}
      {favorieten.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-cyan flex items-center gap-2">
            <span>&#9733;</span> Mijn favorieten
          </h2>
          <div className="space-y-3">
            {favorieten.map((v) => (
              <VacatureCard key={v.id} v={v} isFav={true} onToggle={() => toggleFavorite(v.id)} />
            ))}
          </div>
        </div>
      )}

      {/* All / remaining vacatures */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">
          {favorieten.length > 0 ? 'Overige vacatures' : 'Alle vacatures'}
        </h2>
        <div className="space-y-3">
          {overige.map((v) => (
            <VacatureCard key={v.id} v={v} isFav={false} onToggle={() => toggleFavorite(v.id)} />
          ))}
        </div>
        {overige.length === 0 && favorieten.length === 0 && (
          <p className="text-ink-muted text-sm">Geen vacatures gevonden.</p>
        )}
      </div>
    </div>
  )
}

function VacatureCard({ v, isFav, onToggle }: { v: any; isFav: boolean; onToggle: () => void }) {
  const sector = vacatureSectors[v.id] || 'Overig'
  const contractType = vacatureContractTypes[v.id] || 'Vast'
  const werkmodel = vacatureWerkmodellen[v.id] || 'Hybride'

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 flex items-start justify-between gap-4 hover:border-purple/30 transition-colors">
      <Link href={`/demo/scout/vacature/${v.id}`} className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-ink font-semibold hover:text-purple transition-colors">{v.title}</h3>
          <span className="text-xs text-purple bg-purple/10 px-2 py-0.5 rounded-full">{v.company}</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-light">
          <span>{v.location}</span>
          <span>{v.salaris}</span>
          <span>Deadline: {new Date(v.deadline).toLocaleDateString('nl-NL')}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-xs bg-surface-muted text-ink-light px-2 py-0.5 rounded-full">{sector}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-2 py-0.5 rounded-full">{contractType}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-2 py-0.5 rounded-full">{werkmodel}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-2 py-0.5 rounded-full">{v.hardeCriteria.opleidingsniveau}</span>
          <span className="text-xs bg-surface-muted text-ink-light px-2 py-0.5 rounded-full">{v.hardeCriteria.minimaleErvaring}</span>
        </div>
      </Link>
      <button
        onClick={onToggle}
        className={`text-2xl transition-colors flex-shrink-0 ${isFav ? 'text-cyan' : 'text-ink-muted hover:text-cyan/60'}`}
        aria-label={isFav ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
      >
        {isFav ? '\u2605' : '\u2606'}
      </button>
    </div>
  )
}
