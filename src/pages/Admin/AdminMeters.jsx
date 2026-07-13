import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

// Tower-level meter aggregation data (not individual resident meters)
const TOWER_METERS = [
  { tower:'Tower A', adminName:'Ramesh T.',      metersTotal:62, online:60,  offline:2,  tamper:0,  avgLoad:2.15, totalCollection:285420, pendingBills:24, healthScore:97, lastSync:'2 min ago' },
  { tower:'Tower B', adminName:'Priya M.',       metersTotal:58, online:57,  offline:1,  tamper:0,  avgLoad:1.88, totalCollection:267890, pendingBills:18, healthScore:98, lastSync:'1 min ago' },
  { tower:'Tower C', adminName:'Vikram Singh',   metersTotal:63, online:59,  offline:3,  tamper:1,  avgLoad:2.42, totalCollection:312150, pendingBills:31, healthScore:94, lastSync:'3 min ago' },
  { tower:'Common', adminName:'Maintenance',    metersTotal:55, online:53,  offline:2,  tamper:0,  avgLoad:1.67, totalCollection:110890, pendingBills:12, healthScore:96, lastSync:'5 min ago' },
]

const LOAD_TREND = [
  { time: '6 AM',  tower_a: 0.8, tower_b: 0.6, tower_c: 0.9, common: 0.4 },
  { time: '9 AM',  tower_a: 2.1, tower_b: 1.8, tower_c: 2.3, common: 1.2 },
  { time: '12 PM', tower_a: 2.5, tower_b: 2.2, tower_c: 2.8, common: 1.5 },
  { time: '3 PM',  tower_a: 3.1, tower_b: 2.7, tower_c: 3.2, common: 2.1 },
  { time: '6 PM',  tower_a: 3.5, tower_b: 3.1, tower_c: 3.6, common: 2.5 },
  { time: '9 PM',  tower_a: 2.8, tower_b: 2.5, tower_c: 3.0, common: 1.9 },
]

const statusStyle = {
  Online:  { badge:'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot:'bg-emerald-400' },
  Offline: { badge:'bg-red-500/15 text-red-400 border-red-500/30',             dot:'bg-red-500' },
  Tamper:  { badge:'bg-purple-500/15 text-purple-400 border-purple-500/30',    dot:'bg-purple-500' },
}
const signalColor = { Strong:'text-emerald-400', Medium:'text-amber-400', Weak:'text-red-400' }
const signalBars = { Strong: [1,1,1], Medium: [1,1,0], Weak: [1,0,0] }

export default function AdminMeters() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const { addToast } = useToast()
  const [towers] = useState(TOWER_METERS)
  const [detail, setDetail] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = towers.filter(t => 
    t.tower.toLowerCase().includes(search.toLowerCase()) ||
    t.adminName.toLowerCase().includes(search.toLowerCase())
  )

  const totalMeters = towers.reduce((s, t) => s + t.metersTotal, 0)
  const totalOnline = towers.reduce((s, t) => s + t.online, 0)
  const totalOffline = towers.reduce((s, t) => s + t.offline, 0)
  const totalTamper = towers.reduce((s, t) => s + t.tamper, 0)
  const totalCollection = towers.reduce((s, t) => s + t.totalCollection, 0)
  const totalPending = towers.reduce((s, t) => s + t.pendingBills, 0)

  const stats = [
    { label:'Total Meters',     value: totalMeters,                   from:'#1d4ed8',to:'#1e40af' },
    { label:'Online',           value: totalOnline,                   from:'#065f46',to:'#064e3b' },
    { label:'Offline',          value: totalOffline,                  from:'#991b1b',to:'#7f1d1d' },
    { label:'Tamper Detected',  value: totalTamper,                   from:'#5b21b6',to:'#4c1d95' },
  ]

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
        <h1 className="text-2xl font-bold text-white">Meter Management</h1>
        <p className="text-gray-400 text-sm mt-0.5">Monitor tower-level meter data aggregated from Tower Admins</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Load trend chart */}
      <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
        <h2 className="text-base font-bold text-white mb-4">Hourly Load Trend by Tower</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={LOAD_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="time" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
            <YAxis stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} tickFormatter={v=>`${v}kW`} />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${v}kW`,'']} />
            <Bar dataKey="tower_a" fill="#f59e0b" name="Tower A" radius={[8,8,0,0]} />
            <Bar dataKey="tower_b" fill="#10b981" name="Tower B" radius={[8,8,0,0]} />
            <Bar dataKey="tower_c" fill="#3b82f6" name="Tower C" radius={[8,8,0,0]} />
            <Bar dataKey="common" fill="#8b5cf6" name="Common" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tower, admin…"
               className="flex-1 min-w-48 px-4 py-2.5 rounded-xl dark-card border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-amber-500 placeholder-gray-500 transition-all" />
      </div>

      {/* Tower cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(t => (
          <div key={t.tower} className="rounded-2xl dark-card border border-[rgba(255,255,255,0.07)] p-5 shadow-dark-card cursor-pointer hover:border-amber-500/30 transition-all"
               onClick={()=>setDetail(detail===t.tower?null:t.tower)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white font-bold text-base">{t.tower}</p>
                <p className="text-gray-500 text-xs mt-0.5">Tower Admin: {t.adminName}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                t.healthScore >= 95 ? 'bg-emerald-500/20 text-emerald-400' :
                t.healthScore >= 90 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {t.healthScore}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Total Meters</p>
                <p className="text-white font-bold text-lg">{t.metersTotal}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Online</p>
                <p className="text-emerald-400 font-bold text-lg">{t.online}/{t.metersTotal}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Load</p>
                <p className="text-blue-400 font-bold text-lg">{t.avgLoad}kW</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Collection</p>
                <p className="text-green-400 font-bold text-lg">{sym}{(t.totalCollection/1000).toFixed(0)}k</p>
              </div>
            </div>

            {detail === t.tower && (
              <div className="pt-3 border-t border-[rgba(255,255,255,0.05)] space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <p className="text-red-400 font-bold">{t.offline}</p>
                    <p className="text-gray-500">Offline</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <p className="text-purple-400 font-bold">{t.tamper}</p>
                    <p className="text-gray-500">Tamper</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <p className="text-amber-400 font-bold">{t.pendingBills}</p>
                    <p className="text-gray-500">Pending Bills</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Last Sync: {t.lastSync}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
