export default function StarRating({ rating, showValue = true, showMasterBadge = false }: { rating: number; showValue?: boolean; showMasterBadge?: boolean }) {
  const isMasterMatcher = rating >= 3.5 // >70% match score threshold mapped to rating
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? 'text-orange' : 'text-gray-300'}>
        ★
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      <span className="text-sm tracking-tight">{stars}</span>
      {showValue && <span className="text-orange font-semibold text-sm ml-1">{rating.toFixed(1)}</span>}
      {showMasterBadge && isMasterMatcher && (
        <span className="ml-1 px-1.5 py-0.5 bg-amber-50 text-orange text-[10px] font-bold rounded border border-orange/30">
          MASTER MATCHER
        </span>
      )}
    </span>
  )
}
