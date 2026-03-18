const statusStyles: Record<string, string> = {
  aanbevolen: 'bg-cyan/15 text-cyan border-cyan/30',
  bekijk: 'bg-purple/15 text-purple-light border-purple/30',
  overweeg: 'bg-orange/15 text-orange border-orange/30',
  afgewezen: 'bg-red-500/15 text-red-400 border-red-500/30',
  aangenomen: 'bg-green-500/15 text-green-400 border-green-500/30',
  nieuw: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  kennismaking: 'bg-purple/15 text-purple-light border-purple/30',
  arbeidsvoorwaarden: 'bg-orange/15 text-orange border-orange/30',
  contract_getekend: 'bg-green-500/15 text-green-400 border-green-500/30',
}

const statusLabels: Record<string, string> = {
  aanbevolen: 'Aanbevolen',
  bekijk: 'Bekijk',
  overweeg: 'Overweeg',
  afgewezen: 'Afgewezen',
  aangenomen: 'Aangenomen',
  nieuw: 'Nieuw',
  kennismaking: 'Kennismaking',
  arbeidsvoorwaarden: 'Arbeidsvoorwaarden',
  contract_getekend: 'Contract getekend',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
      {statusLabels[status] || status}
    </span>
  )
}
