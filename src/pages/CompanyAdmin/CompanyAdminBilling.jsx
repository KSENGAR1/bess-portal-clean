import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

const SOCIETIES = [
  { id: 1, name: 'ABC Residency',      location: 'Sector 14, Delhi',   consumers: 245, generated: 452350, pending: 45230, collected: 407120, rate: 89.9 },
  { id: 2, name: 'Green Valley',       location: 'Sector 22, Delhi',   consumers: 180, generated: 325400, pending: 28500, collected: 296900, rate: 91.2 },
  { id: 3, name: 'Sunrise Apartments', location: 'Sector 18, Noida',   consumers: 312, generated: 578900, pending: 65400, collected: 513500, rate: 88.7 },
  { id: 4, name: 'Palm Springs',       location: 'Sector 45, Gurgaon', consumers: 156, generated: 289600, pending: 18200, collected: 271400, rate: 93.7 },
  { id: 5, name: 'Royal Gardens',      location: 'Sector 8, Ghaziabad', consumers: 220, generated: 412800, pending: 52100, collected: 360700, rate: 87.4 },
]

const MONTHLY_TREND = [
  { month: 'Jan', generated: 1850000, collected: 1680000 },
  { month: 'Feb', generated: 1920000, collected: 1750000 },
  { month: 'Mar', generated: 2100000, collected: 1890000 },
  { month: 'Apr', generated: 2250000, collected: 2050000 },
  { month: 'May', generated: 2350000, collected: 2120000 },
  { month: 'Jun', generated: 2059000, collected: 1849620 },
]

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6']

export default function CompanyAdminBilling() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const [search, setSearch] = useState('')

  const filtered = SOCIETIES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  )

  const totalGenerated = SOCIETIES.reduce((sum, s) => sum + s.generated, 0)
  const totalCollected = SOCIETIES.reduce((sum, s) => sum + s.collected, 0)
  const totalPending   = SOCIETIES.reduce((sum, s) => sum + s.pending, 0)
  const avgRate = (totalCollected / totalGenerated * 100).toFixed(1)

  const pieData = SOCIETIES.map(s => ({ name: s.name, value: s.generated }))

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
        <h1 className="text-2xl font-bold text-white">Billing Overview</h1>
        <p className="text-gray-400 text-sm mt-0.5">Monitor billing across all societies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total Generated', value:`${sym}${(totalGenerated/1000).toFixed(0)}k`, from:'#1d4ed8',to:'#1e40af' },
          { label:'Total Collected', value:`${sym}${(totalCollected/1000).toFixed(0)}k`, from:'#065f46',to:'#064e3b' },
          { label:'Pending',         value:`${sym}${(totalPending/1000).toFixed(0)}k`,   from:'#92400e',to:'#78350f' },
          { label:'Collection Rate', value:`${avgRate}%`,                                from:'#4c1d95',to:'#3b0764' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly trend */}
        <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
          <h2 className="text-base font-bold text-white mb-4">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="month" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
              <YAxis stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} tickFormatter={v=>`${sym}${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${sym}${v.toLocaleString()}`,'']} />
              <Bar dataKey="generated" fill="#3b82f6" name="Generated" radius={[8,8,0,0]} />
              <Bar dataKey="collected" fill="#10b981" name="Collected" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Society breakdown */}
        <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
          <h2 className="text-base font-bold text-white mb-4">Billing by Society</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                   label={entry => `${((entry.value/totalGenerated)*100).toFixed(0)}%`}>
                {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${sym}${v.toLocaleString()}`,'']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search societies..."
             className="w-full md:w-80 px-4 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-emerald-500 placeholder-gray-600 transition-all" />

      {/* Society table */}
      <div className="rounded-2xl border dark-card border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Society','Location','Consumers','Generated','Collected','Pending','Rate'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-all">
                  <td className="py-3 px-3">
                    <p className="text-white font-semibold text-sm">{s.name}</p>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{s.location}</td>
                  <td className="py-3 px-3 text-white font-semibold">{s.consumers}</td>
                  <td className="py-3 px-3 text-blue-400 font-bold">{sym}{s.generated.toLocaleString()}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{sym}{s.collected.toLocaleString()}</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">{sym}{s.pending.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                      s.rate >= 90 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                      s.rate >= 85 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                      'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}>
                      {s.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
