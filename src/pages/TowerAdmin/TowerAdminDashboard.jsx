import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

const RESIDENTS = [
  { flat:'101-A', name:'Rajesh Kumar',  meter:'MTR-001', status:'Active',   balance:2450,  usage:245 },
  { flat:'102-A', name:'Priya Singh',   meter:'MTR-002', status:'Active',   balance:-1250, usage:188 },
  { flat:'103-A', name:'Amit Patel',    meter:'MTR-003', status:'Inactive', balance:5000,  usage:0   },
  { flat:'201-A', name:'Neha Gupta',    meter:'MTR-004', status:'Active',   balance:3200,  usage:210 },
  { flat:'202-A', name:'Vikram Singh',  meter:'MTR-005', status:'Active',   balance:1850,  usage:232 },
  { flat:'203-A', name:'Sunita Sharma', meter:'MTR-006', status:'Active',   balance:4200,  usage:198 },
  { flat:'301-A', name:'Ravi Verma',    meter:'MTR-007', status:'Active',   balance:750,   usage:265 },
  { flat:'302-A', name:'Kavita Joshi',  meter:'MTR-008', status:'Active',   balance:3900,  usage:221 },
]

const WEEKLY = [
  { day:'Mon', units:68 }, { day:'Tue', units:75 }, { day:'Wed', units:62 },
  { day:'Thu', units:80 }, { day:'Fri', units:72 }, { day:'Sat', units:58 }, { day:'Sun', units:45 },
]

export default function TowerAdminDashboard({ onNavigate }) {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  const totalBalance = RESIDENTS.reduce((a, b) => a + b.balance, 0)
  const negBalance   = RESIDENTS.filter(r => r.balance < 0).length
  const totalUsage   = RESIDENTS.reduce((a, b) => a + b.usage, 0)

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Tower A — Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">ABC Residency · 8 flats · June 2024</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total Residents', val: RESIDENTS.length,                                from:'#1d4ed8', to:'#1e40af' },
          { label:'Active',          val: RESIDENTS.filter(r=>r.status==='Active').length, from:'#065f46', to:'#064e3b' },
          { label:'Low / Negative',  val: negBalance,                                       from:'#991b1b', to:'#7f1d1d' },
          { label:'Tower Usage',     val: `${totalUsage} kWh`,                              from:'#78350f', to:'#92400e' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly usage chart */}
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Tower Weekly Usage (kWh)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
              <YAxis stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="units" fill="#0891b2" radius={[4,4,0,0]} name="kWh" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick resident overview */}
        <div className={CARD}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Residents Overview</h2>
            <button onClick={() => onNavigate('residents')}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300">View All →</button>
          </div>
          <div className="space-y-2">
            {RESIDENTS.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl dark-row border border-[rgba(255,255,255,0.04)]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                     style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)', color:'#cffafe' }}>
                  {r.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{r.name}</p>
                  <p className="text-gray-500 text-xs">{r.flat} · {r.usage} kWh</p>
                </div>
                <span className={`text-xs font-bold ${r.balance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {r.balance < 0 ? '-' : ''}{sym}{Math.abs(r.balance).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts banner */}
      {negBalance > 0 && (
        <div className="rounded-2xl p-4 flex items-center gap-3 border"
             style={{ background:'rgba(239,68,68,0.08)', borderColor:'rgba(239,68,68,0.25)' }}>
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-400 font-bold text-sm">{negBalance} resident(s) have negative balance</p>
            <p className="text-red-300/70 text-xs">Send reminders from the Billing section</p>
          </div>
          <button onClick={() => onNavigate('billing')}
                  className="ml-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all">
            View Billing
          </button>
        </div>
      )}
    </div>
  )
}
