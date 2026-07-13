import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

const SOCIETIES = [
  { id:1, name:'ABC Residency',  city:'Delhi',   admins:2, towers:3, consumers:120, meters:120, revenue:452000, collection:94.7, status:'Active',   health:'Healthy'  },
  { id:2, name:'XYZ Towers',     city:'Noida',   admins:3, towers:4, consumers:340, meters:340, revenue:821500, collection:97.2, status:'Active',   health:'Healthy'  },
  { id:3, name:'Elite Heights',  city:'Gurgaon', admins:2, towers:2, consumers:180, meters:180, revenue:310200, collection:91.9, status:'Active',   health:'Degraded' },
  { id:4, name:'Green Valley',   city:'Lucknow', admins:2, towers:3, consumers:210, meters:210, revenue:580400, collection:96.7, status:'Active',   health:'Healthy'  },
  { id:5, name:'Sunrise Towers', city:'Mumbai',  admins:1, towers:2, consumers:95,  meters:95,  revenue:120000, collection:88.1, status:'Inactive', health:'Healthy'  },
]

const TREND = [
  { m:'Jan', revenue:145000 }, { m:'Feb', revenue:165000 }, { m:'Mar', revenue:158000 },
  { m:'Apr', revenue:172000 }, { m:'May', revenue:168000 }, { m:'Jun', revenue:184000 },
]

export default function CompanyAdminDashboard({ onNavigate }) {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  const totalRev    = SOCIETIES.reduce((a, b) => a + b.revenue, 0)
  const totalCons   = SOCIETIES.reduce((a, b) => a + b.consumers, 0)
  const activeSoc   = SOCIETIES.filter(s => s.status === 'Active').length
  const degraded    = SOCIETIES.filter(s => s.health === 'Degraded').length
  const avgCollection = (SOCIETIES.reduce((a, b) => a + b.collection, 0) / SOCIETIES.length).toFixed(1)

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">Lith-On Energy Pvt Ltd · {SOCIETIES.length} societies · June 2024</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Active Societies', val: activeSoc,                      from:'#1d4ed8', to:'#1e40af' },
          { label:'Total Consumers',  val: totalCons.toLocaleString(),     from:'#065f46', to:'#064e3b' },
          { label:'Monthly Revenue',  val:`${sym}${(totalRev/100000).toFixed(1)}L`, from:'#78350f', to:'#92400e' },
          { label:'Avg Collection',   val:`${avgCollection}%`,             from:'#4c1d95', to:'#3b0764' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue trend */}
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Revenue Trend (6 months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="m" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
              <YAxis stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [`${sym}${v.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5}
                    dot={{ fill:'#059669', r:4, strokeWidth:0 }} activeDot={{ r:6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Society collection rate */}
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Collection Rate by Society</h2>
          <div className="space-y-3">
            {SOCIETIES.filter(s => s.status === 'Active').map(s => (
              <div key={s.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-white text-xs font-semibold">{s.name}</span>
                  <span className="text-emerald-400 text-xs font-bold">{s.collection}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full transition-all"
                       style={{ width:`${s.collection}%`, background: s.collection >= 95 ? '#10b981' : s.collection >= 90 ? '#f59e0b' : '#ef4444' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Societies quick table */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Societies Overview</h2>
          <button onClick={() => onNavigate('societies')} className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
            Manage Societies →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Society','City','Consumers','Revenue','Collection','Health','Status'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SOCIETIES.map(s => (
                <tr key={s.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(5,150,105,0.05)] transition-all">
                  <td className="py-3 px-3 text-white font-semibold">{s.name}</td>
                  <td className="py-3 px-3 text-gray-300">{s.city}</td>
                  <td className="py-3 px-3 text-gray-300">{s.consumers}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{sym}{s.revenue.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-bold ${s.collection >= 95 ? 'text-emerald-400' : s.collection >= 90 ? 'text-amber-400' : 'text-red-400'}`}>
                      {s.collection}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${
                      s.health === 'Healthy' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>{s.health}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${
                      s.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {degraded > 0 && (
        <div className="rounded-2xl p-4 border flex items-center gap-3"
             style={{ background:'rgba(245,158,11,0.08)', borderColor:'rgba(245,158,11,0.25)' }}>
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-amber-400 font-bold text-sm">{degraded} society with degraded health</p>
            <p className="text-amber-300/70 text-xs">Contact the society admin to investigate</p>
          </div>
        </div>
      )}
    </div>
  )
}
