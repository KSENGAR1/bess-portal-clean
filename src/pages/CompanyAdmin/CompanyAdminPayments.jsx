import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

const PAYMENT_DATA = [
  { society: 'ABC Residency',      collected: 407120, pending: 45230, consumers: 245, avgPayment: 1662, onTime: 217, late: 22, failed: 6 },
  { society: 'Green Valley',       collected: 296900, pending: 28500, consumers: 180, avgPayment: 1650, onTime: 165, late: 12, failed: 3 },
  { society: 'Sunrise Apartments', collected: 513500, pending: 65400, consumers: 312, avgPayment: 1646, onTime: 275, late: 28, failed: 9 },
  { society: 'Palm Springs',       collected: 271400, pending: 18200, consumers: 156, avgPayment: 1740, onTime: 148, late: 7, failed: 1 },
  { society: 'Royal Gardens',      collected: 360700, pending: 52100, consumers: 220, avgPayment: 1640, onTime: 192, late: 21, failed: 7 },
]

const WEEKLY_TREND = [
  { day: 'Mon', abc: 52000, green: 38000, sunrise: 65000, palm: 32000, royal: 45000 },
  { day: 'Tue', abc: 48000, green: 42000, sunrise: 58000, palm: 28000, royal: 40000 },
  { day: 'Wed', abc: 55000, green: 35000, sunrise: 72000, palm: 35000, royal: 48000 },
  { day: 'Thu', abc: 62000, green: 45000, sunrise: 68000, palm: 30000, royal: 52000 },
  { day: 'Fri', abc: 58000, green: 40000, sunrise: 75000, palm: 33000, royal: 49000 },
  { day: 'Sat', abc: 45000, green: 32000, sunrise: 55000, palm: 25000, royal: 38000 },
  { day: 'Sun', abc: 35000, green: 28000, sunrise: 42000, palm: 20000, royal: 30000 },
]

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

export default function CompanyAdminPayments() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const [filter, setFilter] = useState('All')

  const totalCollected = PAYMENT_DATA.reduce((sum, s) => sum + s.collected, 0)
  const totalPending   = PAYMENT_DATA.reduce((sum, s) => sum + s.pending, 0)
  const totalConsumers = PAYMENT_DATA.reduce((sum, s) => sum + s.consumers, 0)
  const avgRate = (totalCollected / (totalCollected + totalPending) * 100).toFixed(1)

  const filtered = filter === 'All' ? PAYMENT_DATA :
    filter === 'High' ? PAYMENT_DATA.filter(s => s.pending > 50000) :
    filter === 'Medium' ? PAYMENT_DATA.filter(s => s.pending >= 30000 && s.pending <= 50000) :
    PAYMENT_DATA.filter(s => s.pending < 30000)

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      {/* Company identity banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4 border"
           style={{ background:'rgba(16,185,129,0.08)', borderColor:'rgba(16,185,129,0.25)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
             style={{ background:'linear-gradient(135deg,#10b981,#059669)' }}>🏢</div>
        <div className="flex-1 min-w-0">
          <p className="text-emerald-400 font-bold text-sm">EcoEnergy Solutions Pvt Ltd</p>
          <p className="text-gray-500 text-xs">Managing 5 societies · 1,113 consumers · Your company portfolio</p>
        </div>
        <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ● Active
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Payment Tracking</h1>
        <p className="text-gray-400 text-sm mt-0.5">Monitor payment collection across all societies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total Collected', value:`${sym}${(totalCollected/1000).toFixed(0)}k`, from:'#065f46',to:'#064e3b' },
          { label:'Pending',         value:`${sym}${(totalPending/1000).toFixed(0)}k`,   from:'#92400e',to:'#78350f' },
          { label:'Collection Rate', value:`${avgRate}%`,                                from:'#4c1d95',to:'#3b0764' },
          { label:'Active Payers',   value:totalConsumers,                              from:'#1d4ed8',to:'#1e40af' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly trend */}
      <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
        <h2 className="text-base font-bold text-white mb-4">This Week's Collection by Society</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={WEEKLY_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="day" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
            <YAxis stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} tickFormatter={v=>`${sym}${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${sym}${v.toLocaleString()}`,'']} />
            <Legend />
            <Line type="monotone" dataKey="abc" stroke={COLORS[0]} strokeWidth={2} name="ABC Residency" dot={{ r:3 }} />
            <Line type="monotone" dataKey="green" stroke={COLORS[1]} strokeWidth={2} name="Green Valley" dot={{ r:3 }} />
            <Line type="monotone" dataKey="sunrise" stroke={COLORS[2]} strokeWidth={2} name="Sunrise Apartments" dot={{ r:3 }} />
            <Line type="monotone" dataKey="palm" stroke={COLORS[3]} strokeWidth={2} name="Palm Springs" dot={{ r:3 }} />
            <Line type="monotone" dataKey="royal" stroke={COLORS[4]} strokeWidth={2} name="Royal Gardens" dot={{ r:3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All','High','Medium','Low'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter===f ? 'bg-emerald-600 text-white border-emerald-700' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>
            {f} {f==='High'?'(>50k)':f==='Medium'?'(30-50k)':f==='Low'?'(<30k)':''}
          </button>
        ))}
      </div>

      {/* Society cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((s, i) => (
          <div key={s.society} className="rounded-2xl dark-card border border-[rgba(255,255,255,0.07)] p-5 shadow-dark-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white font-bold text-base">{s.society}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.consumers} consumers</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                   style={{ background: COLORS[i % COLORS.length], opacity: 0.2 }}>
                💰
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Collected</p>
                <p className="text-emerald-400 font-bold text-lg">{sym}{s.collected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-amber-400 font-bold text-lg">{sym}{s.pending.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[rgba(255,255,255,0.05)]">
              <div>
                <p className="text-emerald-400 font-bold text-sm">{s.onTime}</p>
                <p className="text-gray-500 text-xs">On Time</p>
              </div>
              <div>
                <p className="text-amber-400 font-bold text-sm">{s.late}</p>
                <p className="text-gray-500 text-xs">Late</p>
              </div>
              <div>
                <p className="text-red-400 font-bold text-sm">{s.failed}</p>
                <p className="text-gray-500 text-xs">Failed</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
