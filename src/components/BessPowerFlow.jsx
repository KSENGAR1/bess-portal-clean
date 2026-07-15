import { useEffect, useRef, useState } from 'react'

/* ── Animated travelling dot along a line ── */
function AnimatedDot({ a, b, color, rate, compact }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const dur = Math.max(0.8, 2.5 - rate * 0.3)
    el.style.transition = 'none'
    el.setAttribute('cx', a.x)
    el.setAttribute('cy', a.y)
    void el.getBoundingClientRect()
    el.style.transition = `cx ${dur}s linear, cy ${dur}s linear`
    el.setAttribute('cx', b.x)
    el.setAttribute('cy', b.y)
  }, [a.x, a.y, b.x, b.y, rate])

  return (
    <circle ref={ref} r={compact ? 3 : 4} fill={color} opacity="0.95">
      <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
    </circle>
  )
}

/* ── Lucide-style icon paths rendered in SVG ── */
function NodeIcon({ id, color, cx, cy, r }) {
  const s = r * 0.55   // icon size relative to node radius
  const x = cx - s / 2
  const y = cy - s / 2

  const icons = {
    solar: (
      /* Sun icon */
      <g transform={`translate(${cx - s * 0.9},${cy - s * 0.9}) scale(${(s * 1.8) / 24})`}
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="2" x2="12" y2="4"/>
        <line x1="12" y1="20" x2="12" y2="22"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="2" y1="12" x2="4" y2="12"/>
        <line x1="20" y1="12" x2="22" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </g>
    ),
    battery: (
      /* Battery icon */
      <g transform={`translate(${cx - s * 0.85},${cy - s * 0.6}) scale(${(s * 1.7) / 24})`}
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="2" y="7" width="16" height="10" rx="2"/>
        <line x1="22" y1="11" x2="22" y2="13"/>
        <line x1="6" y1="11" x2="6" y2="13"/>
        <line x1="10" y1="11" x2="10" y2="13"/>
      </g>
    ),
    grid: (
      /* Zap icon */
      <g transform={`translate(${cx - s * 0.7},${cy - s * 0.9}) scale(${(s * 1.8) / 24})`}
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} fillOpacity="0.2"/>
      </g>
    ),
    load: (
      /* Home icon */
      <g transform={`translate(${cx - s * 0.85},${cy - s * 0.85}) scale(${(s * 1.7) / 24})`}
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={color} fillOpacity="0.15"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </g>
    ),
  }

  return icons[id] || null
}

/* ── Main component ── */
export default function BessPowerFlow({ compact = false }) {
  const [values, setValues] = useState({
    gridImport: 3.8,
    gridExport: 0,
    solarGen: 4.2,
    batteryCharge: 0,
    batteryDischarge: 2.0,
    loadDemand: 8.0,
    batterySoc: 78,
  })

  // Reactive dark mode detection
  const [isDark, setIsDark] = useState(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  )
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => {
        // More realistic ranges:
        // Solar: 1.5–6.5 kW (clouds, time of day variation)
        // Load:  5–10 kW (society load is always significant)
        // Battery max discharge: 2 kW (limited capacity)
        const solar = 1.5 + Math.random() * 5      // 1.5–6.5 kW
        const load  = 5   + Math.random() * 5      // 5–10 kW
        const soc   = Math.min(100, Math.max(10, prev.batterySoc + (Math.random() - 0.5) * 0.3))

        const net = solar - load  // almost always negative (load > solar for societies)

        let charge = 0, discharge = 0, gridImp = 0, gridExp = 0

        if (net >= 0) {
          // Rare surplus — charge battery, export rest
          charge  = Math.min(net, 3)
          gridExp = Math.max(0, net - charge)
        } else {
          // Deficit (common) — battery + grid share the load
          const deficit = -net
          discharge = Math.min(deficit, 2)          // battery covers up to 2 kW
          gridImp   = Math.max(0, deficit - discharge) // grid covers the rest
        }

        return {
          gridImport: +gridImp.toFixed(2),
          gridExport: +gridExp.toFixed(2),
          solarGen:   +solar.toFixed(2),
          batteryCharge:    +charge.toFixed(2),
          batteryDischarge: +discharge.toFixed(2),
          loadDemand: +load.toFixed(2),
          batterySoc: +soc.toFixed(1),
        }
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Layout constants
  const W      = compact ? 340 : 600
  const H      = compact ? 310 : 480
  const cx     = W / 2
  const cy     = H / 2 - (compact ? 8 : 14)
  const nodeR  = compact ? 26 : 42
  const outerR = compact ? 88 : 148
  const labelOffset   = compact ? 18 : 26
  const valueOffset   = compact ? 30 : 42
  const fontSize      = compact ? 10 : 12
  const valueFontSize = compact ? 9  : 11

  const nodes = [
    { id: 'solar',   x: cx,          y: cy - outerR, label: 'Solar',   color: '#f59e0b', value: `${values.solarGen.toFixed(1)} kW`, labelAbove: true },
    { id: 'battery', x: cx - outerR, y: cy,           label: 'Battery', color: '#3b82f6', value: `${values.batterySoc.toFixed(0)}%` },
    { id: 'grid',    x: cx + outerR, y: cy,           label: 'Grid',    color: '#22c55e', value: `${(values.gridImport > 0 ? values.gridImport : values.gridExport).toFixed(1)} kW` },
    { id: 'load',    x: cx,          y: cy + outerR,  label: 'Load',    color: '#ef4444', value: `${values.loadDemand.toFixed(1)} kW` },
  ]

  const flows = [
    { from: 'solar',   to: 'battery', active: values.batteryCharge > 0.1,   rate: values.batteryCharge,   color: '#f59e0b' },
    { from: 'solar',   to: 'load',    active: values.solarGen > 0.1,         rate: values.solarGen,        color: '#f59e0b' },
    { from: 'solar',   to: 'grid',    active: values.gridExport > 0.1,       rate: values.gridExport,      color: '#f59e0b' },
    { from: 'battery', to: 'load',    active: values.batteryDischarge > 0.1, rate: values.batteryDischarge,color: '#3b82f6' },
    { from: 'grid',    to: 'load',    active: values.gridImport > 0.1,       rate: values.gridImport,      color: '#22c55e' },
    { from: 'grid',    to: 'battery', active: values.batteryCharge > 0.1 && values.solarGen < values.batteryCharge,
                                                                               rate: values.batteryCharge - values.solarGen, color: '#22c55e' },
  ]

  const getNode = id => nodes.find(n => n.id === id)

  // Theme colours
  const trackColor   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const nodeBg       = isDark ? '#0f172a' : '#ffffff'
  const nodeRingBg   = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const labelColor   = isDark ? '#e2e8f0' : '#1e293b'
  const centerBg     = isDark ? '#1e293b' : '#f1f5f9'
  const centerBorder = '#8b5cf6'
  const centerText   = isDark ? '#c4b5fd' : '#6d28d9'
  const gridLabelColor = isDark ? '#64748b' : '#94a3b8'

  return (
    <div className={`relative ${compact ? 'w-full max-w-[340px] mx-auto' : 'w-full'}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true" style={{ height: compact ? '310px' : '480px' }}>
        <defs>
          <filter id="bpf-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="bpf-subtle" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Connection tracks (inactive paths) ── */}
        {flows.map((f, i) => {
          const a = getNode(f.from), b = getNode(f.to)
          if (!a || !b) return null
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const nx = dx / dist, ny = dy / dist
          const sx = a.x + nx * (nodeR + 4), sy = a.y + ny * (nodeR + 4)
          const ex = b.x - nx * (nodeR + 8), ey = b.y - ny * (nodeR + 8)
          return (
            <line key={`track-${i}`}
              x1={sx} y1={sy} x2={ex} y2={ey}
              stroke={trackColor} strokeWidth={2}
              strokeDasharray="5 4"
            />
          )
        })}

        {/* ── Active flow lines ── */}
        {flows.filter(f => f.active).map((f, i) => {
          const a = getNode(f.from), b = getNode(f.to)
          if (!a || !b) return null
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const nx = dx / dist, ny = dy / dist
          const sx = a.x + nx * (nodeR + 4), sy = a.y + ny * (nodeR + 4)
          const ex = b.x - nx * (nodeR + 8), ey = b.y - ny * (nodeR + 8)
          const strokeW = Math.max(1.5, Math.min(f.rate * 0.8, 4))
          return (
            <g key={`flow-${i}`}>
              {/* Glow line */}
              <line x1={sx} y1={sy} x2={ex} y2={ey}
                stroke={f.color} strokeWidth={strokeW + 3}
                opacity="0.18" strokeLinecap="round"/>
              {/* Main line */}
              <line x1={sx} y1={sy} x2={ex} y2={ey}
                stroke={f.color} strokeWidth={strokeW}
                opacity="0.85" strokeLinecap="round"/>
              {/* Travelling dot */}
              <AnimatedDot a={{ x: sx, y: sy }} b={{ x: ex, y: ey }}
                color={f.color} rate={f.rate} compact={compact} />
            </g>
          )
        })}

        {/* ── Nodes ── */}
        {nodes.map(n => (
          <g key={n.id}>
            {/* Outer pulse ring */}
            <circle cx={n.x} cy={n.y} r={nodeR + 9}
              fill="none" stroke={n.color} strokeWidth="1.5" opacity="0.15"/>
            {/* Inner ring */}
            <circle cx={n.x} cy={n.y} r={nodeR + 4}
              fill="none" stroke={n.color} strokeWidth="2" opacity="0.35"/>
            {/* Node background */}
            <circle cx={n.x} cy={n.y} r={nodeR}
              fill={nodeBg} stroke={n.color} strokeWidth="2.5"/>
            {/* Icon */}
            <NodeIcon id={n.id} color={n.color} cx={n.x} cy={n.y} r={nodeR} />
            
            {/* Label - above for Solar, below for others */}
            {n.labelAbove ? (
              <>
                <text x={n.x} y={n.y - nodeR - valueOffset}
                  textAnchor="middle" fill={n.color}
                  fontSize={valueFontSize} fontWeight="700" fontFamily="Inter, system-ui, sans-serif">
                  {n.value}
                </text>
                <text x={n.x} y={n.y - nodeR - labelOffset}
                  textAnchor="middle" fill={labelColor}
                  fontSize={fontSize} fontWeight="600" fontFamily="Inter, system-ui, sans-serif">
                  {n.label}
                </text>
              </>
            ) : (
              <>
                <text x={n.x} y={n.y + nodeR + labelOffset}
                  textAnchor="middle" fill={labelColor}
                  fontSize={fontSize} fontWeight="600" fontFamily="Inter, system-ui, sans-serif">
                  {n.label}
                </text>
                <text x={n.x} y={n.y + nodeR + valueOffset}
                  textAnchor="middle" fill={n.color}
                  fontSize={valueFontSize} fontWeight="700" fontFamily="Inter, system-ui, sans-serif">
                  {n.value}
                </text>
              </>
            )}
          </g>
        ))}

        {/* ── Centre BESS badge ── */}
        <circle cx={cx} cy={cy} r={compact ? 20 : 28}
          fill={centerBg} stroke={centerBorder} strokeWidth="2"/>
        <text x={cx} y={cy + 1}
          textAnchor="middle" dominantBaseline="middle"
          fill={centerText} fontSize={compact ? 9 : 10}
          fontWeight="800" fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.5">
          BESS
        </text>
      </svg>

      {/* ── Legend ── */}
      {!compact && (
        <div className="flex items-center justify-center gap-5 mt-1 pb-1">
          {[
            { color: '#f59e0b', label: 'Solar' },
            { color: '#3b82f6', label: 'Battery' },
            { color: '#22c55e', label: 'Grid' },
            { color: '#ef4444', label: 'Load' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }}/>
              <span className="text-[11px] font-medium" style={{ color: gridLabelColor }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
