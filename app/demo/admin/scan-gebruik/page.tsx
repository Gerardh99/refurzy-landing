'use client'

import { useState, useMemo } from 'react'
import { useLang } from '@/lib/i18n'

// ─── Texts ──────────────────────────────────────────────────────────────────
const texts = {
  nl: {
    title: 'Matching Scan Gebruik',
    subtitle: 'Log van alle Matching Scan afnames. Facturabel gebruik wordt gerapporteerd aan de VU Amsterdam.',
    infoBannerTitle: 'VU Amsterdam licentie',
    infoBannerBody: 'Refurzy betaalt de VU Amsterdam per afgenomen Matching Scan. Intern testgebruik wordt automatisch uitgefilterd op basis van testaccounts. Gebruik de configuratie hieronder om test-emailadressen te beheren.',
    filterJaar: 'Jaar',
    filterMaand: 'Maand',
    btnConfigEmail: 'Test-emails configureren',
    btnExport: 'Export facturabel gebruik',
    emailConfigTitle: 'Test-emailadressen (uitgesloten van facturatie)',
    emailConfigDesc: 'Scan-afnames door deze emailadressen worden automatisch als testgebruik gemarkeerd en niet meegerekend in het facturabel gebruik richting de VU Amsterdam. Eén emailadres per regel.',
    emailCount: (n: number) => `${n} emailadres(sen) geconfigureerd`,
    statTotaal: 'Totaal afnames',
    statFacturabel: 'Facturabel (VU)',
    statTest: 'Testgebruik (uitgesloten)',
    statKandidaat: 'Kandidaat scans',
    statOrganisatie: 'Organisatie scans',
    pillAlle: (n: number) => `Alle (${n})`,
    pillFacturabel: (n: number) => `Facturabel (${n})`,
    pillTest: (n: number) => `Test (${n})`,
    colDatum: 'Datum',
    colType: 'Type',
    colGebruiker: 'Gebruiker',
    colEmail: 'Email',
    colVacature: 'Vacature',
    colStatus: 'Status',
    colActie: 'Actie',
    typeKandidaat: 'Kandidaat',
    typeOrganisatie: 'Organisatie',
    statusHandmatig: 'Handmatig uitgesloten',
    statusTestEmail: 'Test-email',
    statusTest: 'Test',
    statusFacturabel: 'Facturabel',
    btnTerugzetten: '↩ Terugzetten',
    btnUitsluiten: '✕ Uitsluiten',
    tooltipTerugzetten: 'Terugzetten als facturabel',
    tooltipUitsluiten: 'Handmatig uitsluiten',
    emptyState: 'Geen scan-gebruik gevonden voor deze selectie.',
    footerTitle: 'Hoe werkt de filtering?',
    footerAuto: 'Automatisch:',
    footerAutoDesc: 'Scan-afnames door emailadressen in de test-lijst worden automatisch als testgebruik gemarkeerd.',
    footerHandmatig: 'Handmatig:',
    footerHandmatigDesc: 'Individuele afnames kunnen handmatig worden uitgesloten via de "Uitsluiten" knop.',
    footerExport: 'Export:',
    footerExportDesc: 'De CSV-export bevat alleen facturabel gebruik en kan direct aan de VU Amsterdam worden doorgestuurd.',
    maanden: [
      { value: 'alle', label: 'Alle maanden' },
      { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
      { value: '03', label: 'Maart' }, { value: '04', label: 'April' },
      { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
      { value: '07', label: 'Juli' }, { value: '08', label: 'Augustus' },
      { value: '09', label: 'September' }, { value: '10', label: 'Oktober' },
      { value: '11', label: 'November' }, { value: '12', label: 'December' },
    ],
  },
  en: {
    title: 'Matching Scan Usage',
    subtitle: 'Log of all Matching Scan sessions. Billable usage is reported to VU Amsterdam.',
    infoBannerTitle: 'VU Amsterdam licence',
    infoBannerBody: 'Refurzy pays VU Amsterdam per completed Matching Scan. Internal test usage is automatically filtered out based on test accounts. Use the configuration below to manage test email addresses.',
    filterJaar: 'Year',
    filterMaand: 'Month',
    btnConfigEmail: 'Configure test emails',
    btnExport: 'Export billable usage',
    emailConfigTitle: 'Test email addresses (excluded from billing)',
    emailConfigDesc: 'Scan sessions by these email addresses are automatically marked as test usage and not counted towards billable usage to VU Amsterdam. One email address per line.',
    emailCount: (n: number) => `${n} email address(es) configured`,
    statTotaal: 'Total sessions',
    statFacturabel: 'Billable (VU)',
    statTest: 'Test usage (excluded)',
    statKandidaat: 'Candidate scans',
    statOrganisatie: 'Organisation scans',
    pillAlle: (n: number) => `All (${n})`,
    pillFacturabel: (n: number) => `Billable (${n})`,
    pillTest: (n: number) => `Test (${n})`,
    colDatum: 'Date',
    colType: 'Type',
    colGebruiker: 'User',
    colEmail: 'Email',
    colVacature: 'Job',
    colStatus: 'Status',
    colActie: 'Action',
    typeKandidaat: 'Candidate',
    typeOrganisatie: 'Organisation',
    statusHandmatig: 'Manually excluded',
    statusTestEmail: 'Test email',
    statusTest: 'Test',
    statusFacturabel: 'Billable',
    btnTerugzetten: '↩ Restore',
    btnUitsluiten: '✕ Exclude',
    tooltipTerugzetten: 'Restore as billable',
    tooltipUitsluiten: 'Manually exclude',
    emptyState: 'No scan usage found for this selection.',
    footerTitle: 'How does filtering work?',
    footerAuto: 'Automatic:',
    footerAutoDesc: 'Scan sessions by email addresses in the test list are automatically marked as test usage.',
    footerHandmatig: 'Manual:',
    footerHandmatigDesc: 'Individual sessions can be manually excluded via the "Exclude" button.',
    footerExport: 'Export:',
    footerExportDesc: 'The CSV export contains only billable usage and can be sent directly to VU Amsterdam.',
    maanden: [
      { value: 'alle', label: 'All months' },
      { value: '01', label: 'January' }, { value: '02', label: 'February' },
      { value: '03', label: 'March' }, { value: '04', label: 'April' },
      { value: '05', label: 'May' }, { value: '06', label: 'June' },
      { value: '07', label: 'July' }, { value: '08', label: 'August' },
      { value: '09', label: 'September' }, { value: '10', label: 'October' },
      { value: '11', label: 'November' }, { value: '12', label: 'December' },
    ],
  },
}

// ─── Types ──────────────────────────────────────────────────────────────────
interface ScanGebruik {
  id: string
  datum: string
  type: 'kandidaat' | 'organisatie'
  gebruikerNaam: string
  gebruikerEmail: string
  vacatureTitle?: string
  company?: string
  isTest: boolean       // Auto-detected as test usage
  handmatigUitgesloten: boolean // Manually excluded
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const testEmails = ['gerard@etage0.nl', 'test@refurzy.com', 'demo@refurzy.com', 'admin@refurzy.com']

const mockScanGebruik: ScanGebruik[] = [
  { id: 'sg-1', datum: '2026-03-01T10:23:00', type: 'kandidaat', gebruikerNaam: 'Anna de Jong', gebruikerEmail: 'anna.dejong@email.nl', vacatureTitle: 'Marketing Manager', company: 'TechVentures B.V.', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-2', datum: '2026-03-01T14:05:00', type: 'organisatie', gebruikerNaam: 'HR TechVentures', gebruikerEmail: 'hr@techventures.nl', vacatureTitle: 'Marketing Manager', company: 'TechVentures B.V.', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-3', datum: '2026-03-02T09:12:00', type: 'kandidaat', gebruikerNaam: 'Gerard Hoedjes', gebruikerEmail: 'gerard@etage0.nl', vacatureTitle: 'Test vacature', company: 'Refurzy B.V.', isTest: true, handmatigUitgesloten: false },
  { id: 'sg-4', datum: '2026-03-03T11:45:00', type: 'kandidaat', gebruikerNaam: 'Jamal Usan', gebruikerEmail: 'jamal.usan@email.nl', vacatureTitle: 'Marketing Manager', company: 'TechVentures B.V.', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-5', datum: '2026-03-04T16:30:00', type: 'organisatie', gebruikerNaam: 'HR GreenLogistics', gebruikerEmail: 'hr@greenlogistics.nl', vacatureTitle: 'HR Business Partner', company: 'GreenLogistics B.V.', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-6', datum: '2026-03-05T08:55:00', type: 'kandidaat', gebruikerNaam: 'Test Account', gebruikerEmail: 'test@refurzy.com', vacatureTitle: 'Demo test', company: 'Refurzy B.V.', isTest: true, handmatigUitgesloten: false },
  { id: 'sg-7', datum: '2026-03-06T13:20:00', type: 'kandidaat', gebruikerNaam: 'Thomas van Dijk', gebruikerEmail: 'thomas.vdijk@email.nl', vacatureTitle: 'Senior Software Developer', company: 'TechVentures B.V.', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-8', datum: '2026-03-07T10:10:00', type: 'organisatie', gebruikerNaam: 'HR MedTech', gebruikerEmail: 'hr@medtech.nl', vacatureTitle: 'Financial Controller', company: 'MedTech Solutions', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-9', datum: '2026-03-08T15:40:00', type: 'kandidaat', gebruikerNaam: 'Priya Sharma', gebruikerEmail: 'priya.sharma@email.nl', vacatureTitle: 'Senior Software Developer', company: 'TechVentures B.V.', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-10', datum: '2026-03-09T09:00:00', type: 'kandidaat', gebruikerNaam: 'Demo User', gebruikerEmail: 'demo@refurzy.com', vacatureTitle: 'Test Marketing', company: 'Refurzy B.V.', isTest: true, handmatigUitgesloten: false },
  { id: 'sg-11', datum: '2026-03-10T11:30:00', type: 'kandidaat', gebruikerNaam: 'Eva Bakker', gebruikerEmail: 'eva.bakker@email.nl', vacatureTitle: 'HR Business Partner', company: 'GreenLogistics B.V.', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-12', datum: '2026-03-12T14:15:00', type: 'organisatie', gebruikerNaam: 'Admin Test', gebruikerEmail: 'admin@refurzy.com', vacatureTitle: 'Admin test vacature', company: 'Refurzy B.V.', isTest: true, handmatigUitgesloten: false },
  { id: 'sg-13', datum: '2026-03-14T10:00:00', type: 'kandidaat', gebruikerNaam: 'Lisa Brouwer', gebruikerEmail: 'lisa.brouwer@email.nl', vacatureTitle: 'Marketing Manager', company: 'TechVentures B.V.', isTest: false, handmatigUitgesloten: false },
  { id: 'sg-14', datum: '2026-03-15T09:45:00', type: 'kandidaat', gebruikerNaam: 'Extern Tester', gebruikerEmail: 'tester@externepartij.nl', vacatureTitle: 'Test vacature extern', company: 'Test B.V.', isTest: false, handmatigUitgesloten: false },
]

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminScanGebruik() {
  const { lang } = useLang()
  const t = texts[lang]

  const locale = lang === 'nl' ? 'nl-NL' : 'en-GB'

  const [data, setData] = useState(mockScanGebruik)
  const [filter, setFilter] = useState<'alle' | 'facturabel' | 'test'>('alle')
  const [selectedJaar, setSelectedJaar] = useState('2026')
  const [selectedMaand, setSelectedMaand] = useState('alle')
  const [testEmailsInput, setTestEmailsInput] = useState(testEmails.join('\n'))
  const [showEmailConfig, setShowEmailConfig] = useState(false)

  // Parse test email list
  const testEmailList = useMemo(() =>
    testEmailsInput.split('\n').map(e => e.trim().toLowerCase()).filter(Boolean),
    [testEmailsInput]
  )

  // Auto-detect test usage based on email
  const processedData = useMemo(() =>
    data.map(item => ({
      ...item,
      isTest: testEmailList.includes(item.gebruikerEmail.toLowerCase()) || item.handmatigUitgesloten,
    })),
    [data, testEmailList]
  )

  // Filter by period
  const periodFiltered = useMemo(() =>
    processedData.filter(item => {
      const matchJaar = item.datum.startsWith(selectedJaar)
      const matchMaand = selectedMaand === 'alle' || item.datum.substring(5, 7) === selectedMaand
      return matchJaar && matchMaand
    }),
    [processedData, selectedJaar, selectedMaand]
  )

  // Filter by type
  const filtered = useMemo(() => {
    if (filter === 'facturabel') return periodFiltered.filter(i => !i.isTest)
    if (filter === 'test') return periodFiltered.filter(i => i.isTest)
    return periodFiltered
  }, [periodFiltered, filter])

  // Stats
  const totaalGebruik = periodFiltered.length
  const facturabelGebruik = periodFiltered.filter(i => !i.isTest).length
  const testGebruik = periodFiltered.filter(i => i.isTest).length
  const kandidaatScans = periodFiltered.filter(i => !i.isTest && i.type === 'kandidaat').length
  const orgScans = periodFiltered.filter(i => !i.isTest && i.type === 'organisatie').length

  // Toggle manual exclusion
  const toggleUitsluiting = (id: string) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, handmatigUitgesloten: !item.handmatigUitgesloten } : item
    ))
  }

  // CSV export
  const handleExport = () => {
    const facturabel = periodFiltered.filter(i => !i.isTest)
    const headers = ['Datum', 'Type', 'Gebruiker', 'Email', 'Vacature', 'Bedrijf']
    const rows = facturabel.map(i => [
      new Date(i.datum).toLocaleDateString(locale),
      i.type === 'kandidaat' ? 'Kandidaat scan' : 'Organisatie scan',
      i.gebruikerNaam, i.gebruikerEmail, i.vacatureTitle || '', i.company || '',
    ])
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
    const csv = [headers.map(escape).join(';'), ...rows.map(r => r.map(escape).join(';'))].join('\n')
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Refurzy_VU_Scan_Gebruik_${selectedJaar}${selectedMaand !== 'alle' ? '-' + selectedMaand : ''}_facturabel.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">{t.title}</h1>
        <p className="text-ink-light font-medium mt-1">
          {t.subtitle}
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-purple/5 border border-purple/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-lg">🎓</span>
        <div className="text-sm text-ink-light">
          <p><strong className="text-ink">{t.infoBannerTitle}</strong></p>
          <p className="mt-1">{t.infoBannerBody}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">{t.filterJaar}</label>
          <select value={selectedJaar} onChange={e => setSelectedJaar(e.target.value)}
            className="bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">{t.filterMaand}</label>
          <select value={selectedMaand} onChange={e => setSelectedMaand(e.target.value)}
            className="bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-cyan/50">
            {t.maanden.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => setShowEmailConfig(!showEmailConfig)}
            className="px-4 py-2.5 border border-surface-border text-ink-light rounded-lg text-sm hover:bg-surface-muted transition-colors inline-flex items-center gap-2">
            <span>⚙️</span> {t.btnConfigEmail}
          </button>
          <button onClick={handleExport}
            className="px-4 py-2.5 bg-cyan text-navy-dark rounded-lg text-sm font-medium hover:bg-cyan/90 transition-colors inline-flex items-center gap-2">
            <span>📥</span> {t.btnExport}
          </button>
        </div>
      </div>

      {/* Test email config */}
      {showEmailConfig && (
        <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-ink">{t.emailConfigTitle}</h2>
          <p className="text-xs text-ink-light">{t.emailConfigDesc}</p>
          <textarea
            value={testEmailsInput}
            onChange={e => setTestEmailsInput(e.target.value)}
            rows={6}
            className="w-full bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-ink text-sm font-mono placeholder:text-ink-muted focus:outline-none focus:border-cyan/50 resize-none"
            placeholder="test@refurzy.com&#10;demo@refurzy.com"
          />
          <p className="text-xs text-ink-muted">{t.emailCount(testEmailList.length)}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">{t.statTotaal}</p>
          <p className="text-2xl font-bold text-ink mt-1">{totaalGebruik}</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-purple/30 p-5">
          <p className="text-xs text-purple font-medium">{t.statFacturabel}</p>
          <p className="text-2xl font-bold text-purple mt-1">{facturabelGebruik}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">{t.statTest}</p>
          <p className="text-2xl font-bold text-ink-muted mt-1">{testGebruik}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">{t.statKandidaat}</p>
          <p className="text-2xl font-bold text-cyan mt-1">{kandidaatScans}</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5">
          <p className="text-xs text-ink-muted">{t.statOrganisatie}</p>
          <p className="text-2xl font-bold text-ink mt-1">{orgScans}</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {([
          { key: 'alle' as const, label: t.pillAlle(totaalGebruik) },
          { key: 'facturabel' as const, label: t.pillFacturabel(facturabelGebruik) },
          { key: 'test' as const, label: t.pillTest(testGebruik) },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.key ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:text-ink'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted/50">
                <th className="text-left px-4 py-3 text-ink-muted font-medium">{t.colDatum}</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">{t.colType}</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">{t.colGebruiker}</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">{t.colEmail}</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">{t.colVacature}</th>
                <th className="text-center px-4 py-3 text-ink-muted font-medium">{t.colStatus}</th>
                <th className="text-center px-4 py-3 text-ink-muted font-medium">{t.colActie}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className={`border-b border-surface-border last:border-0 ${
                  item.isTest ? 'bg-red-50/30' : 'hover:bg-surface-muted/30'
                }`}>
                  <td className="px-4 py-3 text-ink text-xs">
                    {new Date(item.datum).toLocaleDateString(locale)}
                    <span className="text-ink-muted ml-1">
                      {new Date(item.datum).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.type === 'kandidaat' ? 'bg-cyan/10 text-cyan' : 'bg-purple/10 text-purple'
                    }`}>
                      {item.type === 'kandidaat' ? t.typeKandidaat : t.typeOrganisatie}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink font-medium">{item.gebruikerNaam}</td>
                  <td className="px-4 py-3 text-ink-light font-mono text-xs">{item.gebruikerEmail}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink text-xs">{item.vacatureTitle}</p>
                    <p className="text-ink-muted text-[10px]">{item.company}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.isTest ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                        {item.handmatigUitgesloten ? t.statusHandmatig :
                         testEmailList.includes(item.gebruikerEmail.toLowerCase()) ? t.statusTestEmail : t.statusTest}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        {t.statusFacturabel}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleUitsluiting(item.id)}
                      className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                        item.handmatigUitgesloten
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-surface-muted text-ink-muted hover:bg-red-100 hover:text-red-600'
                      }`}
                      title={item.handmatigUitgesloten ? t.tooltipTerugzetten : t.tooltipUitsluiten}
                    >
                      {item.handmatigUitgesloten ? t.btnTerugzetten : t.btnUitsluiten}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-ink-muted text-sm">
            {t.emptyState}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="bg-surface-muted rounded-xl p-4 text-xs text-ink-light space-y-1">
        <p><strong className="text-ink">{t.footerTitle}</strong></p>
        <p>• <strong>{t.footerAuto}</strong> {t.footerAutoDesc}</p>
        <p>• <strong>{t.footerHandmatig}</strong> {t.footerHandmatigDesc}</p>
        <p>• <strong>{t.footerExport}</strong> {t.footerExportDesc}</p>
      </div>
    </div>
  )
}
