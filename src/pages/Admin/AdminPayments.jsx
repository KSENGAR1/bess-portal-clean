import { useState } from 'react'
import React from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'
import { useToast } from '../../components/ToastProvider'

// Tower-level payment aggregation data (NOT individual resident payments)
const TOWER_PAYMENTS = [
  { tower:'Tower A', adminName:'Ramesh T.',      totalCollection:285420, pending:24530, collected:260890, rate:91.4, onTime:58, late:3, failed:1, lastUpdate:'2 min ago' },
  { tower:'Tower B', adminName:'Priya M.',       totalCollection:267890, pending:18200, collected:249690, rate:93.2, onTime:55, late:2, failed:1, lastUpdate:'1 min ago' },
  { tower:'Tower C', adminName:'Vikram Singh',   totalCollection:312150, pending:31200, collected:280950, rate:89.9, onTime:59, late:3, failed:1, lastUpdate:'3 min ago' },
  { tower:'Common', adminName:'Maintenance',    totalCollection:110890, pending:12100, collected:98790,  rate:89.1, onTime:52, late:2, failed:1, lastUpdate:'5 min ago' },
]

const WEEKLY_TREND = [
  { day:'Mon', tower_a:38000, tower_b:35000, tower_c:42000, common:15000 },
  { day:'Tue', tower_a:42000, tower_b:38000, tower_c:45000, common:18000 },
  { day:'Wed', tower_a:35000, tower_b:32000, tower_c:38000, common:14000 },
  { day:'Thu', tower_a:48000, tower_b:44000, tower_c:52000, common:21000 },
  { day:'Fri', tower_a:52000, tower_b:48000, tower_c:58000, common:24000 },
  { day:'Sat', tower_a:45000, tower_b:42000, tower_c:48000, common:19000 },
  { day:'Sun', tower_a:32000, tower_b:29000, tower_c:35000, common:12000 },
]

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

export default function AdminPayments() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const { addToast } = useToast()
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const totalCollection = TOWER_PAYMENTS.reduce((s, t) => s + t.totalCollection, 0)
  const totalPending = TOWER_PAYMENTS.reduce((s, t) => s + t.pending, 0)
  const totalCollected = TOWER_PAYMENTS.reduce((s, t) => s + t.collected, 0)
  const avgRate = (totalCollected / totalCollection * 100).toFixed(1)

  const filtered = filter === 'All' ? TOWER_PAYMENTS :
    filter === 'High' ? TOWER_PAYMENTS.filter(t => t.pending > 25000) :
    filter === 'Medium' ? TOWER_PAYMENTS.filter(t => t.pending >= 15000 && t.pending <= 25000) :
    TOWER_PAYMENTS.filter(t => t.pending < 15000)

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      {/* Society identity banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4 border"
           style={{ background:'rgba(217,119,6,0.08)', borderColor:'rgba(217,119,6,0.25)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
             style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>🏢</div>
        <div className="flex-1 min-w-0">
          <p className="text-amber-400 font-bold text-sm">ABC Residency</p>
          <p className="text-gray-500 text-xs">Sector 14, Delhi · 4 towers · 4 tower admins · Aggregated tower-level data</p>
        </div>
        <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ● Active
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Payment Tracking</h1>
        <p className="text-gray-400 text-sm mt-0.5">Monitor tower-level payment collection aggregated from Tower Admins</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total Collection', value:`${sym}${(totalCollection/1000).toFixed(0)}k`, from:'#065f46',to:'#064e3b' },
          { label:'Pending',          value:`${sym}${(totalPending/1000).toFixed(0)}k`,     from:'#92400e',to:'#78350f' },
          { label:'Collection Rate',  value:`${avgRate}%`,                                  from:'#4c1d95',to:'#3b0764' },
          { label:'Total Collected',  value:`${sym}${(totalCollected/1000).toFixed(0)}k`,  from:'#1e3a5f',to:'#1e3a8a' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 font-medium">{s.label}</p>
            <p className="text-2xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
        <h2 className="text-base font-bold text-white mb-4">This Week's Collection by Tower</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={WEEKLY_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="day" stroke={axisStroke} tick={{ fontSize:11, fill: tickFill }} />
            <YAxis stroke={axisStroke} tick={{ fontSize:11, fill: tickFill }} tickFormatter={v=>`${sym}${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${sym}${v.toLocaleString()}`,'']} />
            <Legend />
            <Bar dataKey="tower_a" fill={COLORS[0]} name="Tower A" radius={[8,8,0,0]} />
            <Bar dataKey="tower_b" fill={COLORS[1]} name="Tower B" radius={[8,8,0,0]} />
            <Bar dataKey="tower_c" fill={COLORS[2]} name="Tower C" radius={[8,8,0,0]} />
            <Bar dataKey="common" fill={COLORS[3]} name="Common" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All','High','Medium','Low'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter===f ? 'bg-amber-600 text-white border-amber-700' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>
            {f} {f==='High'?'(>25k)':f==='Medium'?'(15-25k)':f==='Low'?'(<15k)':''}
          </button>
        ))}
      </div>

      {/* Tower payment cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((t, i) => (
          <div key={t.tower} className="rounded-2xl dark-card border border-[rgba(255,255,255,0.07)] p-5 shadow-dark-card cursor-pointer hover:border-amber-500/30 transition-all"
               onClick={()=>setSelected(selected===t.tower?null:t.tower)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white font-bold text-base">{t.tower}</p>
                <p className="text-gray-500 text-xs mt-0.5">Tower Admin: {t.adminName}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                t.rate >= 92 ? 'bg-emerald-500/20 text-emerald-400' :
                t.rate >= 90 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {t.rate}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Total Collection</p>
                <p className="text-white font-bold text-lg">{sym}{(t.totalCollection/1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Collected</p>
                <p className="text-emerald-400 font-bold text-lg">{sym}{(t.collected/1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-amber-400 font-bold text-lg">{sym}{(t.pending/1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Collection Rate</p>
                <p className="text-blue-400 font-bold text-lg">{t.rate}%</p>
              </div>
            </div>

            {selected === t.tower && (
              <div className="pt-3 border-t border-[rgba(255,255,255,0.05)] space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <p className="text-emerald-400 font-bold">{t.onTime}</p>
                    <p className="text-gray-500">On Time</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <p className="text-amber-400 font-bold">{t.late}</p>
                    <p className="text-gray-500">Late</p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <p className="text-red-400 font-bold">{t.failed}</p>
                    <p className="text-gray-500">Failed</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Last Update: {t.lastUpdate}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
