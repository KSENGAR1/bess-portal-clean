import { useEffect, useState } from 'react'

export default function BatteryGauge({ soc = 78, size = 120, health = 96, temp = 32, cycles = 1247 }) {
  const [animatedSoc, setAnimatedSoc] = useState(0)
  useEffect(() => { setAnimatedSoc(soc) }, [soc])

  // Reactive dark mode — updates when theme is toggled
  const [isDark, setIsDark] = useState(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (animatedSoc / 100) * circ
  const color = animatedSoc < 20 ? '#ef4444' : animatedSoc < 50 ? '#f59e0b' : '#22c55e'
  const trackColor = isDark ? '#1e293b' : '#e2e8f0'
  const textColor  = isDark ? '#f1f5f9' : '#0f172a'

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={8} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black leading-none" style={{ color: textColor }}>{animatedSoc}%</span>
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: '#64748b' }}>SOC</span>
        </div>
      </div>

      {/* Metrics below */}
      <div className="grid grid-cols-3 gap-3 mt-3 w-full">
        <Metric label="Health" value={`${health}%`} color="#3b82f6" />
        <Metric label="Temp" value={`${temp}°C`} color="#f59e0b" />
        <Metric label="Cycles" value={`${cycles}`} color="#8b5cf6" />
      </div>
    </div>
  )
}

function Metric({ label, value, color }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#64748b' }}>{label}</p>
      <p className="text-sm font-extrabold" style={{ color }}>{value}</p>
    </div>
  )
}
