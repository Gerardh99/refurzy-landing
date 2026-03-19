'use client'

interface FactuurPreviewProps {
  factuurNummer: string
  datum: string
  // Scout info
  scoutNaam: string
  scoutBedrijf?: string
  scoutAdres: string
  scoutKvk?: string
  scoutBtw?: string
  scoutIban: string
  isProScout: boolean
  // Transaction info
  vacatureTitle: string
  kandidaatNaam: string
  opdrachtgeverNaam: string
  // Fee info
  brutoBedrag: number
  scoutFeePercentage: number // 50
  // Status
  status: 'gegenereerd' | 'betaald_door_klant' | 'uitbetaald'
}

export default function FactuurPreview({
  factuurNummer, datum, scoutNaam, scoutBedrijf, scoutAdres,
  scoutKvk, scoutBtw, scoutIban, isProScout,
  vacatureTitle, kandidaatNaam, opdrachtgeverNaam,
  brutoBedrag, scoutFeePercentage, status,
}: FactuurPreviewProps) {
  const scoutFee = brutoBedrag * (scoutFeePercentage / 100)
  const btwBedrag = isProScout ? scoutFee * 0.21 : 0
  const totaalUitbetaling = scoutFee + btwBedrag

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-ink">Factuur {factuurNummer}</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Automatisch gegenereerd op {new Date(datum).toLocaleDateString('nl-NL')}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          status === 'uitbetaald' ? 'bg-green-100 text-green-700' :
          status === 'betaald_door_klant' ? 'bg-cyan/10 text-cyan' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {status === 'uitbetaald' ? 'Uitbetaald' :
           status === 'betaald_door_klant' ? 'Klant betaald — wordt uitbetaald' :
           'Wacht op betaling klant'}
        </span>
      </div>

      {/* Two columns: scout info + transaction info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-medium text-ink-muted mb-2">Aan</p>
          <p className="text-sm font-semibold text-ink">{scoutBedrijf || scoutNaam}</p>
          {scoutBedrijf && <p className="text-xs text-ink-light">t.a.v. {scoutNaam}</p>}
          <p className="text-xs text-ink-light">{scoutAdres}</p>
          {scoutKvk && <p className="text-xs text-ink-light mt-1">KVK: {scoutKvk}</p>}
          {scoutBtw && <p className="text-xs text-ink-light">BTW: {scoutBtw}</p>}
          <p className="text-xs text-ink-light mt-1">IBAN: {scoutIban}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-ink-muted mb-2">Plaatsing</p>
          <p className="text-sm text-ink"><span className="font-medium">{kandidaatNaam}</span></p>
          <p className="text-xs text-ink-light">als {vacatureTitle}</p>
          <p className="text-xs text-ink-light">bij {opdrachtgeverNaam}</p>
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="border-t border-surface-border pt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-ink-muted">
              <th className="text-left pb-2">Omschrijving</th>
              <th className="text-right pb-2">Bedrag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1.5 text-ink">Plaatsingsfee ({vacatureTitle})</td>
              <td className="py-1.5 text-right text-ink">EUR {brutoBedrag.toLocaleString('nl-NL')}</td>
            </tr>
            <tr>
              <td className="py-1.5 text-ink">Scout fee ({scoutFeePercentage}%)</td>
              <td className="py-1.5 text-right text-ink font-medium">EUR {scoutFee.toLocaleString('nl-NL')}</td>
            </tr>
            {isProScout ? (
              <tr>
                <td className="py-1.5 text-ink">BTW (21%)</td>
                <td className="py-1.5 text-right text-ink">EUR {btwBedrag.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
              </tr>
            ) : (
              <tr>
                <td className="py-1.5 text-ink-light text-xs" colSpan={2}>
                  Geen BTW — uitbetaling als natuurlijk persoon (loonheffing wordt ingehouden)
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-surface-border">
              <td className="pt-3 font-bold text-ink">Totaal uitbetaling</td>
              <td className="pt-3 text-right font-bold text-cyan text-lg">
                EUR {totaalUitbetaling.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Info banner */}
      <div className={`rounded-xl p-3 text-xs ${
        isProScout ? 'bg-cyan/5 text-cyan' : 'bg-purple/5 text-purple'
      }`}>
        {isProScout ? (
          <p><strong>Pro Scout factuur</strong> — BTW wordt bovenop de scout fee uitbetaald. U ontvangt EUR {totaalUitbetaling.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} zodra de opdrachtgever heeft betaald.</p>
        ) : (
          <p><strong>Particuliere uitbetaling</strong> — Refurzy houdt loonheffing in conform de IB-47 regeling. Het netto bedrag wordt overgemaakt zodra de opdrachtgever heeft betaald. Word <a href="/demo/scout/instellingen" className="underline">Pro Scout</a> om BTW terug te ontvangen.</p>
        )}
      </div>
    </div>
  )
}
