export default function FitScore({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'w-10 h-10 text-xs', md: 'w-14 h-14 text-sm', lg: 'w-20 h-20 text-lg' }
  const color = score >= 75 ? 'from-cyan to-teal-400' : score >= 50 ? 'from-purple to-purple-light' : 'from-orange to-amber-400'
  const borderColor = score >= 75 ? 'border-cyan/40' : score >= 50 ? 'border-purple/40' : 'border-orange/40'

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white border-2 ${borderColor}`}>
      {score}%
    </div>
  )
}
