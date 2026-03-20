'use client'

import { useState, useMemo } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────
interface Uitbetaling {
  id: string
  scoutId: string
  scoutNaam: string
  bsn: string
  geboortedatum: string
  adres: string
  postcode: string
  woonplaats: string
  land: string
  landCode: string
  tinNummer: string           // Tax Identification Number (buitenland)
  iban: string
  kvkNummer: string
  btwNummer: string
  typeRelatie: 'natuurlijk_persoon' | 'zzp'
  vacatureTitle: string
  kandidaatNaam: string
  bedrag: number
  scoutFee: number
  valuta: string
  datumPlaatsing: string
  datumUitbetaling: string
  factuurNummer: string
  status: 'uitbetaald' | 'pending' | 'geblokkeerd'
}

// ─── Mock data for payments ─────────────────────────────────────────────────
const mockUitbetalingen: Uitbetaling[] = [
  {
    id: 'ub-1', scoutId: 'scout-1', scoutNaam: 'Sophie de Graaf',
    bsn: '123456789', geboortedatum: '1988-03-15',
    adres: 'Prinsengracht 123', postcode: '1015 DT', woonplaats: 'Amsterdam',
    land: 'Nederland', landCode: 'NL', tinNummer: '', iban: 'NL91ABNA0417164300',
    kvkNummer: '12345678', btwNummer: 'NL001234567B01',
    typeRelatie: 'zzp', vacatureTitle: 'Marketing Manager',
    kandidaatNaam: 'Anna de Jong', bedrag: 7200, scoutFee: 3600, valuta: 'EUR',
    datumPlaatsing: '2026-01-20', datumUitbetaling: '2026-02-05',
    factuurNummer: 'RF-2026-001', status: 'uitbetaald',
  },
  {
    id: 'ub-2', scoutId: 'scout-1', scoutNaam: 'Sophie de Graaf',
    bsn: '123456789', geboortedatum: '1988-03-15',
    adres: 'Prinsengracht 123', postcode: '1015 DT', woonplaats: 'Amsterdam',
    land: 'Nederland', landCode: 'NL', tinNummer: '', iban: 'NL91ABNA0417164300',
    kvkNummer: '12345678', btwNummer: 'NL001234567B01',
    typeRelatie: 'zzp', vacatureTitle: 'Senior Software Developer',
    kandidaatNaam: 'Thomas van Dijk', bedrag: 10800, scoutFee: 5400, valuta: 'EUR',
    datumPlaatsing: '2026-02-10', datumUitbetaling: '2026-02-28',
    factuurNummer: 'RF-2026-004', status: 'uitbetaald',
  },
  {
    id: 'ub-3', scoutId: 'scout-2', scoutNaam: 'Mark Jansen',
    bsn: '987654321', geboortedatum: '1992-07-22',
    adres: 'Coolsingel 45', postcode: '3011 AD', woonplaats: 'Rotterdam',
    land: 'Nederland', landCode: 'NL', tinNummer: '', iban: 'NL20INGB0001234567',
    kvkNummer: '', btwNummer: '',
    typeRelatie: 'natuurlijk_persoon', vacatureTitle: 'UX Designer',
    kandidaatNaam: 'Priya Sharma', bedrag: 4800, scoutFee: 2400, valuta: 'EUR',
    datumPlaatsing: '2026-01-05', datumUitbetaling: '2026-01-20',
    factuurNummer: 'RF-2026-002', status: 'uitbetaald',
  },
  {
    id: 'ub-4', scoutId: 'scout-3', scoutNaam: 'Klaus Müller',
    bsn: '', geboortedatum: '1985-11-03',
    adres: 'Friedrichstraße 78', postcode: '10117', woonplaats: 'Berlin',
    land: 'Duitsland', landCode: 'DE', tinNummer: 'DE-123456789', iban: 'DE89370400440532013000',
    kvkNummer: '', btwNummer: 'DE123456789',
    typeRelatie: 'zzp', vacatureTitle: 'Data Engineer',
    kandidaatNaam: 'Felix Weber', bedrag: 9600, scoutFee: 4800, valuta: 'EUR',
    datumPlaatsing: '2026-02-01', datumUitbetaling: '2026-02-15',
    factuurNummer: 'RF-2026-003', status: 'uitbetaald',
  },
  {
    id: 'ub-5', scoutId: 'scout-4', scoutNaam: 'Jean-Pierre Dubois',
    bsn: '', geboortedatum: '1990-05-18',
    adres: 'Rue de Rivoli 22', postcode: '75001', woonplaats: 'Parijs',
    land: 'Frankrijk', landCode: 'FR', tinNummer: 'FR-987654321', iban: 'FR7630006000011234567890189',
    kvkNummer: '', btwNummer: 'FR12345678901',
    typeRelatie: 'zzp', vacatureTitle: 'Product Manager',
    kandidaatNaam: 'Marie Laurent', bedrag: 8400, scoutFee: 4200, valuta: 'EUR',
    datumPlaatsing: '2026-03-01', datumUitbetaling: '', // not yet paid
    factuurNummer: 'RF-2026-005', status: 'pending',
  },
  {
    id: 'ub-6', scoutId: 'scout-5', scoutNaam: 'James Wilson',
    bsn: '', geboortedatum: '1987-09-10',
    adres: '42 Baker Street', postcode: 'W1U 3BW', woonplaats: 'London',
    land: 'Verenigd Koninkrijk', landCode: 'GB', tinNummer: 'GB-UTR1234567', iban: 'GB29NWBK60161331926819',
    kvkNummer: '', btwNummer: 'GB123456789',
    typeRelatie: 'zzp', vacatureTitle: 'Sales Director',
    kandidaatNaam: 'Oliver Brown', bedrag: 14400, scoutFee: 7200, valuta: 'GBP',
    datumPlaatsing: '2026-01-15', datumUitbetaling: '2026-02-01',
    factuurNummer: 'RF-2026-006', status: 'uitbetaald',
  },
  {
    id: 'ub-7', scoutId: 'scout-6', scoutNaam: 'Lotte Vermeulen',
    bsn: '', geboortedatum: '1993-02-28',
    adres: 'Rue de la Loi 120', postcode: '1000', woonplaats: 'Brussel',
    land: 'België', landCode: 'BE', tinNummer: 'BE-0123456789', iban: 'BE68539007547034',
    kvkNummer: '', btwNummer: 'BE0123456789',
    typeRelatie: 'zzp', vacatureTitle: 'HR Manager',
    kandidaatNaam: 'Emma Claessens', bedrag: 6000, scoutFee: 3000, valuta: 'EUR',
    datumPlaatsing: '2026-02-20', datumUitbetaling: '2026-03-10',
    factuurNummer: 'RF-2026-007', status: 'uitbetaald',
  },
  {
    id: 'ub-8', scoutId: 'scout-1', scoutNaam: 'Sophie de Graaf',
    bsn: '123456789', geboortedatum: '1988-03-15',
    adres: 'Prinsengracht 123', postcode: '1015 DT', woonplaats: 'Amsterdam',
    land: 'Nederland', landCode: 'NL', tinNummer: '', iban: 'NL91ABNA0417164300',
    kvkNummer: '12345678', btwNummer: 'NL001234567B01',
    typeRelatie: 'zzp', vacatureTitle: 'Financial Controller',
    kandidaatNaam: 'Bas Hendriks', bedrag: 10800, scoutFee: 5400, valuta: 'EUR',
    datumPlaatsing: '2026-03-05', datumUitbetaling: '', // not yet paid
    factuurNummer: 'RF-2026-008', status: 'pending',
  },
]

// ─── Countries in the system ────────────────────────────────────────────────
const landen = [
  { code: 'ALL', label: 'Alle landen' },
  { code: 'NL', label: 'Nederland' },
  { code: 'DE', label: 'Duitsland' },
  { code: 'BE', label: 'België' },
  { code: 'FR', label: 'Frankrijk' },
  { code: 'GB', label: 'Verenigd Koninkrijk' },
]

const jaren = ['2026', '2025', '2024']

// ─── IB-47 info banner per country ─────────────────────────────────────────
const landInfo: Record<string, { formulier: string; toelichting: string }> = {
  NL: {
    formulier: 'IB-47 (Opgaaf uitbetaalde bedragen aan derden)',
    toelichting: 'Alleen verplicht voor betalingen aan natuurlijke personen (zonder KVK). Zakelijke relaties (ZZP met KVK) zijn uitgesloten van IB-47 logging. Jaarlijks vóór 1 februari in te dienen bij de Belastingdienst.',
  },
  DE: {
    formulier: 'Meldung nach §93c AO',
    toelichting: 'Betalingen aan zelfstandigen in Duitsland. Rapportage via het Bundeszentralamt für Steuern.',
  },
  BE: {
    formulier: 'Fiche 281.50',
    toelichting: 'Commissies, erelonen en voordelen aan derden. Jaarlijks in te dienen bij de FOD Financiën via Belcotax.',
  },
  FR: {
    formulier: 'DAS-2 / Déclaration des honoraires',
    toelichting: 'Verplichte aangifte van honoraria en commissies boven €1.200 per ontvanger per jaar.',
  },
  GB: {
    formulier: 'CIS / Self Assessment',
    toelichting: 'Rapportage aan HMRC voor betalingen aan zelfstandigen. Afhankelijk van CIS-registratie.',
  },
}

// ─── CSV generation ─────────────────────────────────────────────────────────
function generateCSV(data: Uitbetaling[], landCode: string): string {
  const headers = [
    'Scout naam', 'BSN / TIN', 'Geboortedatum', 'Adres', 'Postcode',
    'Woonplaats', 'Land', 'IBAN', 'KVK-nummer', 'BTW-nummer',
    'Type relatie', 'Vacature', 'Kandidaat', 'Bruto bedrag',
    'Scout fee (50%)', 'Valuta', 'Datum plaatsing', 'Datum uitbetaling',
    'Factuurnummer', 'Status',
  ]

  const rows = data.map(u => [
    u.scoutNaam, u.bsn || u.tinNummer, u.geboortedatum, u.adres, u.postcode,
    u.woonplaats, u.land, u.iban, u.kvkNummer, u.btwNummer,
    u.typeRelatie === 'natuurlijk_persoon' ? 'Natuurlijk persoon' : 'ZZP / eenmanszaak',
    u.vacatureTitle, u.kandidaatNaam, u.bedrag.toString(),
    u.scoutFee.toString(), u.valuta, u.datumPlaatsing, u.datumUitbetaling || '-',
    u.factuurNummer, u.status,
  ])

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  return [headers.map(escape).join(';'), ...rows.map(r => r.map(escape).join(';'))].join('\n')
}

function downloadCSV(csv: string, filename: string) {
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Aggregate per scout for summary ────────────────────────────────────────
interface ScoutSamenvatting {
  scoutId: string
  scoutNaam: string
  bsn: string
  tinNummer: string
  geboortedatum: string
  adres: string
  postcode: string
  woonplaats: string
  land: string
  iban: string
  kvkNummer: string
  btwNummer: string
  typeRelatie: string
  aantalUitbetalingen: number
  totaalBedrag: number
  totaalScoutFee: number
  valuta: string
  eersteBetaling: string
  laatsteBetaling: string
}

function aggregatePerScout(data: Uitbetaling[]): ScoutSamenvatting[] {
  const map = new Map<string, ScoutSamenvatting>()
  data.forEach(u => {
    const existing = map.get(u.scoutId)
    if (existing) {
      existing.aantalUitbetalingen++
      existing.totaalBedrag += u.bedrag
      existing.totaalScoutFee += u.scoutFee
      if (u.datumUitbetaling && (!existing.eersteBetaling || u.datumUitbetaling < existing.eersteBetaling))
        existing.eersteBetaling = u.datumUitbetaling
      if (u.datumUitbetaling && (!existing.laatsteBetaling || u.datumUitbetaling > existing.laatsteBetaling))
        existing.laatsteBetaling = u.datumUitbetaling
    } else {
      map.set(u.scoutId, {
        scoutId: u.scoutId, scoutNaam: u.scoutNaam,
        bsn: u.bsn, tinNummer: u.tinNummer, geboortedatum: u.geboortedatum,
        adres: u.adres, postcode: u.postcode, woonplaats: u.woonplaats,
        land: u.land, iban: u.iban, kvkNummer: u.kvkNummer, btwNummer: u.btwNummer,
        typeRelatie: u.typeRelatie === 'natuurlijk_persoon' ? 'Natuurlijk persoon' : 'ZZP / eenmanszaak',
        aantalUitbetalingen: 1, totaalBedrag: u.bedrag, totaalScoutFee: u.scoutFee,
        valuta: u.valuta,
        eersteBetaling: u.datumUitbetaling || '', laatsteBetaling: u.datumUitbetaling || '',
      })
    }
  })
  return Array.from(map.values())
}

function generateSummaryCSV(scouts: ScoutSamenvatting[]): string {
  const headers = [
    'Scout naam', 'BSN / TIN', 'Geboortedatum', 'Adres', 'Postcode',
    'Woonplaats', 'Land', 'IBAN', 'KVK-nummer', 'BTW-nummer',
    'Type relatie', 'Aantal uitbetalingen', 'Totaal bruto bedrag',
    'Totaal scout fee', 'Valuta', 'Eerste betaling', 'Laatste betaling',
  ]
  const rows = scouts.map(s => [
    s.scoutNaam, s.bsn || s.tinNummer, s.geboortedatum, s.adres, s.postcode,
    s.woonplaats, s.land, s.iban, s.kvkNummer, s.btwNummer,
    s.typeRelatie, s.aantalUitbetalingen.toString(), s.totaalBedrag.toString(),
    s.totaalScoutFee.toString(), s.valuta, s.eersteBetaling || '-', s.laatsteBetaling || '-',
  ])
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  return [headers.map(escape).join(';'), ...rows.map(r => r.map(escape).join(';'))].join('\n')
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminUitbetalingen() {
  const [selectedLand, setSelectedLand] = useState('ALL')
  const [selectedJaar, setSelectedJaar] = useState('2026')
  const [selectedType, setSelectedType] = useState<'ALL' | 'natuurlijk_persoon' | 'zzp'>('ALL')
  const [view, setView] = useState<'overzicht' | 'detail'>('overzicht')

  const filtered = useMemo(() => {
    return mockUitbetalingen.filter(u => {
      const matchLand = selectedLand === 'ALL' || u.landCode === selectedLand
      const matchJaar = u.datumPlaatsing.startsWith(selectedJaar)
      const matchType = selectedType === 'ALL' || u.typeRelatie === selectedType
      return matchLand && matchJaar && matchType
    })
  }, [selectedLand, selectedJaar, selectedType])

  // Payments that require tax authority logging (IB-47): only natuurlijk_persoon (no KVK)
  const loggingVereist = filtered.filter(u => u.typeRelatie === 'natuurlijk_persoon')
  const loggingNietVereist = filtered.filter(u => u.typeRelatie === 'zzp')

  const scoutSamenvatting = useMemo(() => aggregatePerScout(filtered), [filtered])

  const totaalBedrag = filtered.reduce((sum, u) => sum + u.bedrag, 0)
  const totaalScoutFee = filtered.reduce((sum, u) => sum + u.scoutFee, 0)
  const aantalScouts = new Set(filtered.map(u => u.scoutId)).size

  const handleDownloadDetail = () => {
    const csv = generateCSV(filtered, selectedLand)
    const landLabel = landen.find(l => l.code === selectedLand)?.label || 'alle-landen'
    downloadCSV(csv, `Refurzy_Uitbetalingen_${landLabel}_${selectedJaar}_detail.csv`)
  }

  const handleDownloadSamenvatting = () => {
    const csv = generateSummaryCSV(scoutSamenvatting)
    const landLabel = landen.find(l => l.code === selectedLand)?.label || 'alle-landen'
    downloadCSV(csv, `Refurzy_Uitbetalingen_${landLabel}_${selectedJaar}_samenvatting.csv`)
  }

  const info = selectedLand !== 'ALL' ? landInfo[selectedLand] : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Uitbetalingen</h1>
        <p className="text-ink-light mt-1">
          Overzicht van alle uitbetalingen aan Talent Scouts. Exporteer per land voor belastingaangifte (IB-47 / lokaal equivalent).
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Land</label>
          <select
            value={selectedLand}
            onChange={(e) => setSelectedLand(e.target.value)}
            className="bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50"
          >
            {landen.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Jaar</label>
          <select
            value={selectedJaar}
            onChange={(e) => setSelectedJaar(e.target.value)}
            className="bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50"
          >
            {jaren.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Type relatie</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'ALL' | 'natuurlijk_persoon' | 'zzp')}
            className="bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50"
          >
            <option value="ALL">Alle types</option>
            <option value="natuurlijk_persoon">Particulier (logging vereist)</option>
            <option value="zzp">Zakelijk / ZZP (geen logging)</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleDownloadSamenvatting}
            className="px-4 py-2.5 bg-purple text-white rounded-lg text-sm font-medium hover:bg-purple/90 transition-colors inline-flex items-center gap-2"
          >
            <span>📊</span> Download samenvatting
          </button>
          <button
            onClick={handleDownloadDetail}
            className="px-4 py-2.5 bg-cyan text-navy-dark rounded-lg text-sm font-medium hover:bg-cyan/90 transition-colors inline-flex items-center gap-2"
          >
            <span>📥</span> Download detail export
          </button>
        </div>
      </div>

      {/* Tax info banner */}
      {info && (
        <div className="bg-purple/5 border border-purple/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">📋</span>
            <div>
              <p className="text-sm font-medium text-ink">{info.formulier}</p>
              <p className="text-xs text-ink-light mt-0.5">{info.toelichting}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Totaal uitbetalingen</p>
          <p className="text-2xl font-bold text-ink mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Unieke scouts</p>
          <p className="text-2xl font-bold text-ink mt-1">{aantalScouts}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Totaal bruto</p>
          <p className="text-2xl font-bold text-ink mt-1">€{totaalBedrag.toLocaleString('nl-NL')}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">Totaal scout fees</p>
          <p className="text-2xl font-bold text-cyan mt-1">€{totaalScoutFee.toLocaleString('nl-NL')}</p>
        </div>
      </div>

      {/* Logging status banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">📋</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Belastingdienst logging vereist</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {loggingVereist.length} betaling{loggingVereist.length !== 1 ? 'en' : ''} aan particulieren (zonder KVK) —
                totaal €{loggingVereist.reduce((s, u) => s + u.scoutFee, 0).toLocaleString('nl-NL')}
              </p>
              <p className="text-[10px] text-amber-600 mt-1">Deze betalingen moeten worden opgenomen in de IB-47 / lokale belastingaangifte</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">✅</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Geen logging vereist (zakelijk)</p>
              <p className="text-xs text-green-700 mt-0.5">
                {loggingNietVereist.length} betaling{loggingNietVereist.length !== 1 ? 'en' : ''} aan ZZP/zakelijke relaties (met KVK) —
                totaal €{loggingNietVereist.reduce((s, u) => s + u.scoutFee, 0).toLocaleString('nl-NL')}
              </p>
              <p className="text-[10px] text-green-600 mt-1">Zakelijke relaties met KVK-nummer zijn vrijgesteld van IB-47 rapportage</p>
            </div>
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-surface-muted rounded-lg p-1 w-fit">
        <button
          onClick={() => setView('overzicht')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            view === 'overzicht' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Samenvatting per scout
        </button>
        <button
          onClick={() => setView('detail')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            view === 'detail' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Alle transacties
        </button>
      </div>

      {/* Summary view */}
      {view === 'overzicht' && (
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted/50">
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Scout</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">BSN / TIN</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Geboortedatum</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Woonplaats</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">IBAN</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Type</th>
                  <th className="text-center px-4 py-3 text-ink-muted font-medium">Logging</th>
                  <th className="text-right px-4 py-3 text-ink-muted font-medium"># Betalingen</th>
                  <th className="text-right px-4 py-3 text-ink-muted font-medium">Totaal fee</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Periode</th>
                </tr>
              </thead>
              <tbody>
                {scoutSamenvatting.map((s) => (
                  <tr key={s.scoutId} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-ink font-medium">{s.scoutNaam}</p>
                        <p className="text-xs text-ink-muted">{s.adres}, {s.postcode} {s.woonplaats}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink font-mono text-xs">{s.bsn || s.tinNummer || '—'}</td>
                    <td className="px-4 py-3 text-ink">{new Date(s.geboortedatum).toLocaleDateString('nl-NL')}</td>
                    <td className="px-4 py-3">
                      <span className="text-ink">{s.woonplaats}</span>
                      <span className="text-ink-muted text-xs ml-1">({s.land})</span>
                    </td>
                    <td className="px-4 py-3 text-ink font-mono text-xs">{s.iban}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        s.typeRelatie === 'ZZP / eenmanszaak'
                          ? 'bg-cyan/10 text-cyan'
                          : 'bg-purple/10 text-purple'
                      }`}>
                        {s.typeRelatie}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {s.kvkNummer ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Niet vereist</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">IB-47 vereist</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-ink">{s.aantalUitbetalingen}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">€{s.totaalScoutFee.toLocaleString('nl-NL')}</td>
                    <td className="px-4 py-3 text-xs text-ink-light">
                      {s.eersteBetaling ? new Date(s.eersteBetaling).toLocaleDateString('nl-NL') : '—'}
                      {s.eersteBetaling && s.laatsteBetaling && s.eersteBetaling !== s.laatsteBetaling && (
                        <> – {new Date(s.laatsteBetaling).toLocaleDateString('nl-NL')}</>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {scoutSamenvatting.length === 0 && (
            <div className="p-8 text-center text-ink-muted text-sm">
              Geen uitbetalingen gevonden voor deze selectie.
            </div>
          )}
        </div>
      )}

      {/* Detail view */}
      {view === 'detail' && (
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted/50">
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Factuur</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Scout</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Vacature</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Kandidaat</th>
                  <th className="text-right px-4 py-3 text-ink-muted font-medium">Bruto</th>
                  <th className="text-right px-4 py-3 text-ink-muted font-medium">Scout fee</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Plaatsing</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Uitbetaling</th>
                  <th className="text-left px-4 py-3 text-ink-muted font-medium">Status</th>
                  <th className="text-center px-4 py-3 text-ink-muted font-medium">Logging</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-ink">{u.factuurNummer}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-ink font-medium">{u.scoutNaam}</p>
                        <p className="text-xs text-ink-muted">{u.woonplaats}, {u.land}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink">{u.vacatureTitle}</td>
                    <td className="px-4 py-3 text-ink">{u.kandidaatNaam}</td>
                    <td className="px-4 py-3 text-right text-ink">{u.valuta === 'GBP' ? '£' : '€'}{u.bedrag.toLocaleString('nl-NL')}</td>
                    <td className="px-4 py-3 text-right font-medium text-cyan">{u.valuta === 'GBP' ? '£' : '€'}{u.scoutFee.toLocaleString('nl-NL')}</td>
                    <td className="px-4 py-3 text-ink text-xs">{new Date(u.datumPlaatsing).toLocaleDateString('nl-NL')}</td>
                    <td className="px-4 py-3 text-ink text-xs">{u.datumUitbetaling ? new Date(u.datumUitbetaling).toLocaleDateString('nl-NL') : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        u.status === 'uitbetaald' ? 'bg-green-100 text-green-700' :
                        u.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {u.status === 'uitbetaald' ? 'Uitbetaald' : u.status === 'pending' ? 'In afwachting' : 'Geblokkeerd'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.kvkNummer ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Nee</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Ja</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-ink-muted text-sm">
              Geen uitbetalingen gevonden voor deze selectie.
            </div>
          )}
        </div>
      )}

      {/* IB-47 required fields info */}
      <div className="bg-white rounded-2xl border border-surface-border p-6">
        <h2 className="text-sm font-semibold text-ink mb-4">Verplichte velden in export (IB-47 / lokaal equivalent)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <h3 className="font-medium text-ink-muted mb-2">Persoonsgegevens</h3>
            <ul className="space-y-1 text-ink-light">
              <li>• Volledige naam</li>
              <li>• BSN / TIN (fiscaal nummer)</li>
              <li>• Geboortedatum</li>
              <li>• Adres + postcode</li>
              <li>• Woonplaats + land</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-ink-muted mb-2">Financieel</h3>
            <ul className="space-y-1 text-ink-light">
              <li>• IBAN</li>
              <li>• Bruto uitbetaald bedrag</li>
              <li>• Scout fee (50%)</li>
              <li>• Valuta</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-ink-muted mb-2">Bedrijfsgegevens</h3>
            <ul className="space-y-1 text-ink-light">
              <li>• KVK-nummer (indien van toepassing)</li>
              <li>• BTW-nummer</li>
              <li>• Type relatie (ZZP / natuurlijk persoon)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-ink-muted mb-2">Transactiedetails</h3>
            <ul className="space-y-1 text-ink-light">
              <li>• Factuurnummer</li>
              <li>• Datum plaatsing</li>
              <li>• Datum uitbetaling</li>
              <li>• Vacature / kandidaat</li>
              <li>• Betalingsstatus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
