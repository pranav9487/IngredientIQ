function SafetyGauge({ score, size = 80, showLabel = true }) {
  const getColor = (s) => {
    if (s >= 75) return 'var(--status-safe)'
    if (s >= 40) return 'var(--status-caution)'
    return 'var(--status-harmful)'
  }

  const getRating = (s) => {
    if (s >= 75) return 'GOOD'
    if (s >= 40) return 'FAIR'
    return 'POOR'
  }

  const color = getColor(score)
  const rating = getRating(score)
  const circumference = 2 * Math.PI * 15.9155
  const dashArray = `${(score / 100) * circumference}, ${circumference}`

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="var(--surface-variant)"
          strokeWidth="3"
        />
        <path
          className="transition-all duration-1000 ease-in-out"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-body-main font-bold leading-none text-on-surface" style={{ fontSize: size * 0.3 }}>
          {score}
        </span>
        {showLabel && (
          <span 
            className="font-chemical-name font-semibold uppercase tracking-widest mt-0.5" 
            style={{ fontSize: Math.max(8, size * 0.12), color }}
          >
            {rating}
          </span>
        )}
      </div>
    </div>
  )
}

export default SafetyGauge
