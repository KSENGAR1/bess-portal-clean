import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, ChevronDown, Home, Settings, Crown, Smartphone, Mail, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useCurrency, COUNTRIES } from '../context/CurrencyContext'

/* ─── Voltage Arc Canvas ──────────────────────────────────────────── */
function VoltageCanvas({ dark }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let id
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    /* ── circuit nodes on a grid ── */
    const COLS = 14, ROWS = 8
    const nodes = []
    for (let c = 0; c <= COLS; c++)
      for (let r = 0; r <= ROWS; r++)
        nodes.push({
          x: (c / COLS) * W + (Math.random() - 0.5) * 60,
          y: (r / ROWS) * H + (Math.random() - 0.5) * 60,
          pulse: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03,
          active: Math.random() < 0.4,
        })

    /* ── edges between nearby nodes ── */
    const edges = []
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i) return
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < W / COLS * 1.6)
          edges.push({ a, b, dist, progress: Math.random(), speed: 0.003 + Math.random() * 0.006, active: Math.random() < 0.3 })
      })
    })

    /* ── floating voltage sparks ── */
    const mkSpark = () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 1.2, vy: -0.4 - Math.random() * 0.8,
      life: 1, decay: 0.008 + Math.random() * 0.012,
      size: 1 + Math.random() * 2.5,
      col: ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'][Math.floor(Math.random() * 5)],
    })
    const sparks = Array.from({ length: 60 }, mkSpark)

    /* ── lightning bolt arcs ── */
    const arcs = Array.from({ length: 5 }, () => ({
      startIdx: Math.floor(Math.random() * nodes.length),
      endIdx: Math.floor(Math.random() * nodes.length),
      progress: 0,
      speed: 0.012 + Math.random() * 0.015,
      jitter: Array.from({ length: 6 }, () => (Math.random() - 0.5) * 28),
      alpha: 0.7 + Math.random() * 0.3,
      timer: Math.floor(Math.random() * 120),
    }))

    let tick = 0
    const draw = () => {
      tick++
      W = canvas.width; H = canvas.height
      ctx.clearRect(0, 0, W, H)

      /* background gradient — medium brightness */
      const bg = ctx.createLinearGradient(0, 0, W, H)
      if (dark) {
        bg.addColorStop(0, '#0f172a')
        bg.addColorStop(0.5, '#1e293b')
        bg.addColorStop(1, '#0f172a')
      } else {
        bg.addColorStop(0, '#dbeafe')
        bg.addColorStop(0.5, '#eff6ff')
        bg.addColorStop(1, '#e0f2fe')
      }
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      /* soft ambient orbs */
      const orbCols = dark
        ? [['#1d4ed8', 0.18], ['#4f46e5', 0.14], ['#0891b2', 0.14]]
        : [['#3b82f6', 0.12], ['#6366f1', 0.10], ['#0ea5e9', 0.10]]
      const orbPos = [[W * 0.15, H * 0.3], [W * 0.82, H * 0.25], [W * 0.5, H * 0.75]]
      orbPos.forEach(([ox, oy], i) => {
        const r = Math.min(W, H) * 0.38
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r)
        const [col, alpha] = orbCols[i]
        const hex = Math.round(alpha * 255).toString(16).padStart(2, '0')
        g.addColorStop(0, col + hex)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.fill()
      })

      /* circuit edges */
      edges.forEach(e => {
        if (!e.active) return
        e.progress += e.speed
        if (e.progress > 1) e.progress = 0
        const lineAlpha = dark ? 0.12 : 0.15
        ctx.strokeStyle = dark ? `rgba(99,102,241,${lineAlpha})` : `rgba(59,130,246,${lineAlpha})`
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke()

        /* travelling dot on edge */
        const px = e.a.x + (e.b.x - e.a.x) * e.progress
        const py = e.a.y + (e.b.y - e.a.y) * e.progress
        const dotCol = dark ? '#38bdf8' : '#2563eb'
        ctx.shadowColor = dotCol; ctx.shadowBlur = 8
        ctx.fillStyle = dotCol; ctx.globalAlpha = 0.9
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })

      /* circuit nodes */
      nodes.forEach(n => {
        if (!n.active) return
        n.pulse += n.speed
        const glow = 0.4 + 0.6 * Math.abs(Math.sin(n.pulse))
        const col = dark ? '#818cf8' : '#3b82f6'
        ctx.shadowColor = col; ctx.shadowBlur = 12 * glow
        ctx.fillStyle = col; ctx.globalAlpha = 0.3 + 0.7 * glow
        ctx.beginPath(); ctx.arc(n.x, n.y, 3 * glow, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })

      /* lightning arc bolts */
      arcs.forEach(arc => {
        arc.timer--
        if (arc.timer > 0) return
        arc.progress += arc.speed
        if (arc.progress >= 1) {
          arc.progress = 0
          arc.timer = 40 + Math.floor(Math.random() * 80)
          arc.startIdx = Math.floor(Math.random() * nodes.length)
          arc.endIdx = Math.floor(Math.random() * nodes.length)
          arc.jitter = Array.from({ length: 6 }, () => (Math.random() - 0.5) * 28)
        }
        const s = nodes[arc.startIdx], e2 = nodes[arc.endIdx]
        const steps = arc.jitter.length + 1
        const pts = [s]
        for (let i = 1; i < steps; i++) {
          const t = i / steps
          pts.push({
            x: s.x + (e2.x - s.x) * t + arc.jitter[i - 1],
            y: s.y + (e2.y - s.y) * t + arc.jitter[i - 1] * 0.5,
          })
        }
        pts.push(e2)
        const drawTo = Math.floor(pts.length * Math.min(arc.progress * 1.5, 1))
        const boltCol = dark ? '#facc15' : '#f59e0b'
        ctx.shadowColor = boltCol; ctx.shadowBlur = 18
        ctx.strokeStyle = boltCol; ctx.lineWidth = 1.5
        ctx.globalAlpha = arc.alpha * (1 - arc.progress * 0.5)
        ctx.beginPath()
        for (let i = 0; i < drawTo && i < pts.length; i++) {
          i === 0 ? ctx.moveTo(pts[i].x, pts[i].y) : ctx.lineTo(pts[i].x, pts[i].y)
        }
        ctx.stroke()
        ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })

      /* floating sparks */
      sparks.forEach(sp => {
        sp.x += sp.vx; sp.y += sp.vy
        sp.life -= sp.decay
        if (sp.life <= 0) Object.assign(sp, mkSpark())
        ctx.shadowColor = sp.col; ctx.shadowBlur = 6
        ctx.fillStyle = sp.col; ctx.globalAlpha = sp.life * 0.8
        ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })

      /* horizontal voltage wave lines */
      const waveTime = tick * 0.008
      ;[
        { y: H * 0.35, amp: 18, freq: 0.012, col: dark ? '#38bdf8' : '#0ea5e9', alpha: 0.25 },
        { y: H * 0.55, amp: 12, freq: 0.018, col: dark ? '#a78bfa' : '#6366f1', alpha: 0.2 },
        { y: H * 0.72, amp: 22, freq: 0.009, col: dark ? '#34d399' : '#10b981', alpha: 0.18 },
      ].forEach(wv => {
        ctx.globalAlpha = wv.alpha; ctx.strokeStyle = wv.col; ctx.lineWidth = 1.5
        ctx.shadowColor = wv.col; ctx.shadowBlur = 4
        ctx.beginPath()
        for (let x = 0; x <= W; x += 3) {
          const y = wv.y + Math.sin(x * wv.freq + waveTime) * wv.amp + Math.sin(x * wv.freq * 2.3 + waveTime * 1.7) * wv.amp * 0.4
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })

      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', onResize) }
  }, [dark])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ display: 'block' }} />
}

/* ─── Login Page ──────────────────────────────────────────────────── */
export default function LoginPage({ onLogin, dark, onToggleDark }) {
  const [loginMethod,  setLoginMethod]  = useState('otp')
  const [phone,        setPhone]        = useState('')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [otp,          setOtp]          = useState('')
  const [step,         setStep]         = useState(1)
  const [selectedRole, setSelectedRole] = useState('resident')
  const [showPass,     setShowPass]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [showDialDrop, setShowDialDrop] = useState(false)

  const { country, setCountry } = useCurrency()

  const handleSendOTP = () => { if (phone.length >= 8 && phone.length <= 12) setStep(2) }
  const handleVerifyOTP = () => {
    if (otp !== '1234') return
    setLoading(true); setTimeout(() => { setLoading(false); onLogin(selectedRole) }, 900)
  }
  const handleEmailLogin = () => {
    if (!email || !password) return
    setLoading(true); setTimeout(() => { setLoading(false); onLogin(selectedRole) }, 900)
  }

  const roles = [
    { value: 'resident',   label: 'Resident',   sub: 'Home user',     icon: Home, color: '#0066FF' },
    { value: 'admin',      label: 'Admin',       sub: 'Society mgmt',  icon: Settings, color: '#d97706' },
    { value: 'superadmin', label: 'Super Admin', sub: 'Platform ctrl', icon: Crown, color: '#7c3aed' },
  ]

  /* theme tokens */
  const T = dark ? {
    card:    'rgba(15,23,42,0.55)',
    border:  'rgba(255,255,255,0.10)',
    text:    '#f1f5f9',
    sub:     '#94a3b8',
    label:   '#64748b',
    input:   'rgba(255,255,255,0.07)',
    inputBorder: 'rgba(255,255,255,0.12)',
    tabBg:   'rgba(255,255,255,0.06)',
    tabActive:'rgba(255,255,255,0.14)',
    hint:    'rgba(59,130,246,0.12)',
    hintBorder:'rgba(59,130,246,0.25)',
  } : {
    card:    'rgba(255,255,255,0.55)',
    border:  'rgba(0,0,0,0.08)',
    text:    '#0f172a',
    sub:     '#475569',
    label:   '#64748b',
    input:   'rgba(255,255,255,0.7)',
    inputBorder: 'rgba(0,0,0,0.12)',
    tabBg:   'rgba(0,0,0,0.05)',
    tabActive:'rgba(255,255,255,0.9)',
    hint:    'rgba(59,130,246,0.08)',
    hintBorder:'rgba(59,130,246,0.2)',
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex">
      <VoltageCanvas dark={dark} />

      {/* glass overlay tint */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: dark
          ? 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.10) 0%, transparent 60%)'
          : 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)',
        zIndex: 1,
      }}/>

      {/* dark/light toggle — top right */}
      <button onClick={onToggleDark}
              className="absolute top-5 right-5 z-50 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs transition-all"
              style={{
                background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'}`,
                backdropFilter: 'blur(12px)',
                color: dark ? '#f1f5f9' : '#1e293b',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}>
        {dark ? <Sun size={14}/> : <Moon size={14}/>}
        {dark ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* ── Left panel — logo + title ── */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 relative z-10 px-16 py-12 gap-8">
        <div className="flex flex-col items-center gap-6"
             style={{
               background: dark ? 'rgba(15,23,42,0.35)' : 'rgba(255,255,255,0.35)',
               backdropFilter: 'blur(24px)',
               WebkitBackdropFilter: 'blur(24px)',
               border: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.70)'}`,
               borderRadius: '32px',
               padding: '48px 56px',
               boxShadow: dark ? '0 8px 48px rgba(0,0,0,0.4)' : '0 8px 48px rgba(99,102,241,0.12)',
             }}>
          <img src="/lith-on-logo.png" alt="Lith-On"
               className="w-[280px] h-auto object-contain"
               style={{ filter: 'drop-shadow(0 4px 24px rgba(59,130,246,0.35))' }}/>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-wide" style={{ color: T.text }}>
              BESS Monitoring System
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-xs font-semibold" style={{ color: dark ? '#34d399' : '#059669' }}>
                Platform Online · 5,234 Meters Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — glass card form ── */}
      <div className="relative z-10 w-full lg:w-[480px] flex-shrink-0 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm rounded-3xl p-6 sm:p-8 transition-all duration-500"
             style={{
               background: T.card,
               backdropFilter: 'blur(28px)',
               WebkitBackdropFilter: 'blur(28px)',
               border: `1px solid ${T.border}`,
               boxShadow: dark
                 ? '0 8px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
                 : '0 8px 56px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
             }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-6">
            <img src="/lith-on-logo.png" alt="Lith-On" className="w-[150px] h-auto object-contain"/>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black mb-1" style={{ color: T.text }}>Welcome back</h2>
            <p className="text-sm" style={{ color: T.sub }}>BESS Monitoring System</p>
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: T.label }}>Select role</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button key={r.value} onClick={() => setSelectedRole(r.value)}
                        className="py-3 px-2 rounded-2xl transition-all flex flex-col items-center gap-1.5 border"
                        style={selectedRole === r.value
                          ? { background: `${r.color}22`, borderColor: `${r.color}66`, boxShadow: `0 0 14px ${r.color}30` }
                          : { background: T.input, borderColor: T.inputBorder }}>
                  <span className="text-xl" style={{ color: selectedRole === r.value ? (dark ? '#fff' : '#0f172a') : T.sub }}><r.icon size={20} /></span>
                  <span className="text-xs font-bold" style={{ color: selectedRole === r.value ? (dark ? '#fff' : '#0f172a') : T.sub }}>{r.label}</span>
                  <span className="text-[9px]" style={{ color: selectedRole === r.value ? r.color : T.label }}>{r.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Method tabs */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: T.tabBg }}>
            {['otp', 'email'].map(m => (
              <button key={m} onClick={() => { setLoginMethod(m); setStep(1) }}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1"
                      style={loginMethod === m
                        ? { background: T.tabActive, color: dark ? '#fff' : '#0f172a', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                        : { color: T.label }}>
                {m === 'otp' ? <><Smartphone size={14} /> OTP Login</> : <><Mail size={14} /> Email</>}
              </button>
            ))}
          </div>

          {/* OTP flow */}
          {loginMethod === 'otp' && (
            <div className="space-y-4">
              {step === 1 ? (
                <form onSubmit={e => { e.preventDefault(); handleSendOTP() }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: T.label }}>Mobile Number</label>
                    <div className="flex gap-2 min-w-0">
                      {/* Country dial code dropdown */}
                      <div className="relative flex-shrink-0">
                        <button type="button" onClick={() => setShowDialDrop(d => !d)}
                                className="flex items-center gap-1 px-2.5 py-3 rounded-xl text-sm font-bold whitespace-nowrap"
                                style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text }}>
                          <span>{country.flag}</span>
                          <span className="text-xs">{country.dialCode}</span>
                          <ChevronDown size={11} style={{ color: T.label }}/>
                        </button>
                        {showDialDrop && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowDialDrop(false)}/>
                            <div className="absolute top-full left-0 mt-1 z-50 rounded-2xl overflow-hidden shadow-2xl"
                               style={{ background: dark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)',
                                        border: `1px solid ${T.inputBorder}`, backdropFilter:'blur(20px)',
                                        minWidth:'220px', maxHeight:'280px', overflowY:'auto' }}>
                            {COUNTRIES.map(c => (
                              <button key={c.code} type="button"
                                      onClick={() => { setCountry(c.code); setShowDialDrop(false); setPhone('') }}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all"
                                      style={{
                                        background: c.code === country.code
                                          ? (dark ? 'rgba(99,102,241,0.2)' : 'rgba(59,130,246,0.08)')
                                          : 'transparent',
                                        color: T.text,
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
                                      onMouseLeave={e => e.currentTarget.style.background = c.code === country.code ? (dark ? 'rgba(99,102,241,0.2)' : 'rgba(59,130,246,0.08)') : 'transparent'}>
                                <span className="text-lg">{c.flag}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{c.name}</p>
                                  <p className="text-[10px]" style={{ color: T.label }}>{c.dialCode} · {c.currency}</p>
                                </div>
                                {c.code === country.code && <span className="text-blue-400 text-xs">✓</span>}
                              </button>
                            ))}
                          </div>
                          </>
                        )}
                      </div>
                      <input type="tel" maxLength={country.maxLen} value={phone}
                             onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                             placeholder={'0'.repeat(country.maxLen)}
                             className="flex-1 min-w-0 px-3 py-3 rounded-xl text-sm outline-none transition-all"
                             style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text }}
                             onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.7)'}
                             onBlur={e => e.target.style.borderColor = T.inputBorder}/>
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: T.label }}>Demo: any valid number</p>
                  </div>
                  <button type="submit" disabled={phone.length < 7}
                          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-30"
                          style={{ background: 'linear-gradient(135deg,#0066FF,#6366f1)', boxShadow: '0 4px 20px rgba(0,102,255,0.35)' }}>
                    Send OTP →
                  </button>
                </form>
              ) : (
                <form onSubmit={e => { e.preventDefault(); handleVerifyOTP() }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: T.label }}>Enter OTP</label>
                    <input type="text" maxLength="4" value={otp}
                           onChange={e => {
                             const v = e.target.value.replace(/\D/g, '')
                             setOtp(v)
                             if (v.length === 4) setTimeout(() => handleVerifyOTP(), 100)
                           }}
                           placeholder="· · · ·"
                           autoFocus
                           className="w-full px-4 py-4 rounded-xl text-center text-3xl font-black tracking-[0.6em] outline-none transition-all"
                           style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text }}
                           onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.7)'}
                           onBlur={e => e.target.style.borderColor = T.inputBorder}/>
                    <p className="text-xs mt-1.5 text-center" style={{ color: T.label }}>
                      Demo OTP: <strong style={{ color: T.text }}>1234</strong>
                    </p>
                  </div>
                  <button type="submit" disabled={otp.length !== 4 || loading}
                          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                          style={{ background: 'linear-gradient(135deg,#0066FF,#6366f1)', boxShadow: '0 4px 20px rgba(0,102,255,0.35)' }}>
                    {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Verifying…</> : 'Verify & Login ✓'}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-sm font-semibold transition-all"
                          style={{ color: T.label }}>← Change Number</button>
                </form>
              )}
            </div>
          )}

          {/* Email flow */}
          {loginMethod === 'email' && (
            <form onSubmit={e => { e.preventDefault(); handleEmailLogin() }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: T.label }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                       placeholder="you@example.com"
                       className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                       style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text }}
                       onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.7)'}
                       onBlur={e => e.target.style.borderColor = T.inputBorder}/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: T.label }}>Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password}
                         onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                         className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none transition-all"
                         style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text }}
                         onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.7)'}
                         onBlur={e => e.target.style.borderColor = T.inputBorder}/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-all"
                          style={{ color: T.label }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs mt-1.5" style={{ color: T.label }}>Demo: any email + password</p>
              </div>
              <button type="submit" disabled={!email || !password || loading}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg,#0066FF,#6366f1)', boxShadow: '0 4px 20px rgba(0,102,255,0.35)' }}>
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Signing in…</> : 'Sign In →'}
              </button>
            </form>
          )}

          {/* Demo hint */}
          <div className="mt-5 rounded-2xl p-4 transition-all" style={{ background: T.hint, border: `1px solid ${T.hintBorder}` }}>
            <p className="text-xs font-bold text-blue-500 mb-2 flex items-center gap-1"><Sparkles size={14} /> Demo Credentials</p>
            <ul className="text-xs space-y-1" style={{ color: T.sub }}>
              <li>• OTP: any 10 digits → code <strong style={{ color: T.text }}>1234</strong></li>
              <li>• Email: any email + any password</li>
              <li>• Pick a role above to explore that view</li>
            </ul>
          </div>

          <p className="text-center text-[10px] tracking-widest mt-5 uppercase" style={{ color: T.label }}>
            Demo Portal · No Real Data
          </p>
        </div>
      </div>
    </div>
  )
}
