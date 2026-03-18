'use client'

import { useState, useMemo } from 'react'
import { allVacatures } from '@/lib/mock-data'

export default function ScoutVacatures() {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    return allVacatures.filter((v) => {
      const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase())
      const matchLocation = !locationFilter || v.location.toLowerCase().includes(locationFilter.toLowerCase())
      return matchSearch && matchLocation
    })
  }, [search, locationFilter])

  const favorieten = filtered.filter((v) => favorites.has(v.id))
  const overige = filtered.filter((v) => !favorites.has(v.id))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Vacatures</h1>
        <p className="text-gray-400 mt-1">Bekijk openstaande vacatures en bewaar je favorieten</p>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Zoek op titel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan/50"
        />
        <input
          type="text"
          placeholder="Filter op locatie..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-48 bg-navy border border-purple/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan/50"
        />
      </div>

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

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">
          {favorieten.length > 0 ? 'Overige vacatures' : 'Alle vacatures'}
        </h2>
        <div className="space-y-3">
          {overige.map((v) => (
            <VacatureCard key={v.id} v={v} isFav={false} onToggle={() => toggleFavorite(v.id)} />
          ))}
        </div>
        {overige.length === 0 && favorieten.length === 0 && (
          <p className="text-gray-500 text-sm">Geen vacatures gevonden.</p>
        )}
      </div>
    </div>
  )
}

function VacatureCard({ v, isFav, onToggle }: { v: any; isFav: boolean; onToggle: () => void }) {
  return (
    <div className="bg-navy-light rounded-2xl border border-purple/10 p-6 flex items-start justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-semibold">{v.title}</h3>
          <span className="text-xs text-purple-light bg-purple/10 px-2 py-0.5 rounded-full">{v.company}</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
          <span>{v.location}</span>
          <span>{v.salaris}</span>
          <span>Deadline: {new Date(v.deadline).toLocaleDateString('nl-NL')}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Harde criteria: {v.hardeCriteria.opleidingsniveau} &middot; {v.hardeCriteria.minimaleErvaring} &middot; {v.hardeCriteria.opKantoor}
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`text-2xl transition-colors flex-shrink-0 ${isFav ? 'text-cyan' : 'text-gray-600 hover:text-cyan/60'}`}
        aria-label={isFav ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
      >
        {isFav ? '★' : '☆'}
      </button>
    </div>
  )
}
