import Link from 'next/link'

const documents = [
  { slug: 'algemene-voorwaarden', title: 'Algemene Voorwaarden', version: '1.0', audience: 'Alle gebruikers' },
  { slug: 'plaatsingsovereenkomst', title: 'Plaatsingsovereenkomst', version: '1.0', audience: 'Opdrachtgever' },
  { slug: 'scoutovereenkomst', title: 'Scoutovereenkomst', version: '1.0', audience: 'Talent Scout' },
  { slug: 'privacybeleid', title: 'Privacybeleid', version: '1.0', audience: 'Alle bezoekers' },
  { slug: 'verwerkersovereenkomst', title: 'Verwerkersovereenkomst (Opdrachtgever)', version: '1.0', audience: 'Opdrachtgever' },
  { slug: 'verwerkersovereenkomst-scout', title: 'Verwerkersovereenkomst (Scout)', version: '1.0', audience: 'Talent Scout' },
  { slug: 'toestemmingsverklaring', title: 'Toestemmingsverklaring Kandidaat', version: '1.0', audience: 'Kandidaat' },
  { slug: 'cookiebeleid', title: 'Cookiebeleid', version: '1.0', audience: 'Alle bezoekers' },
]

export default function JuridischOverzicht() {
  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/homepage" className="text-gray-500 hover:text-cyan text-sm mb-8 inline-flex items-center gap-1 transition-colors">
          ← Terug naar homepage
        </Link>

        <h1 className="text-3xl font-bold text-white mt-4 mb-2">Juridische documenten</h1>
        <p className="text-gray-400 mb-10">Alle juridische documenten van Refurzy B.V. — versie 1.0, 19 maart 2026</p>

        <div className="space-y-3">
          {documents.map((doc) => (
            <Link
              key={doc.slug}
              href={`/juridisch/${doc.slug}`}
              className="flex items-center justify-between bg-navy-light rounded-xl border border-purple/20 p-5 hover:border-cyan/30 transition-colors group"
            >
              <div>
                <h3 className="text-white font-semibold group-hover:text-cyan transition-colors">{doc.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{doc.audience}</p>
              </div>
              <span className="text-xs text-gray-600 bg-purple/10 px-2 py-1 rounded">v{doc.version}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
