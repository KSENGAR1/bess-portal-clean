import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

const BESS_FLEET = [
  { id: 1, society: 'ABC Residency',      units: 12, avgSOC: 74, avgHealth: 97, temp: 31, status: 'Healthy',  solarGen: 58.2, peakShaved: 24.5, co2: 1247 },
  { id: 2, society: 'Green Valley',       units: 8,  avgSOC: 68, avgHealth: 96, temp: 33, status: 'Healthy',  solarGen: 42.1, peakShaved: 18.2, co2: 892 },
  { id: 3, society: 'Sunrise Apartments', units: 15, avgSOC: 81, avgHealth: 98, temp: 29, status: 'Healthy',  solarGen: 72.5, peakShaved: 31.8, co2: 1580 },
  { id: 4, society: 'Palm Springs',       units: 6,  avgSOC: 58, avgHealth: 94, temp: 35, status: 'Degraded', solarGen: 28.4, peakShaved: 12.1, co2: 645 },
  { id: 5, society: 'Royal Gardens',      units: 10, avgSOC: 72, avgHealth: 95, temp: 32, status: 'Healthy',  solarGen: 48.9, peakShaved: 21.3, co2: 1025 },
]

const EFFICIENCY_DATA = BESS_FLEET.map(s => ({ name: s.society.split(' ')[0], health: s.avgHealth, soc: s.avgSOC }))

const statusStyle = {
  Healthy:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Degraded: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function CompanyAdminBESS() {
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const [filter, setFilter] = useState('All')

  const totalUnits = BESS_FLEET.reduce((sum, s) => sum + s.units, 0)
  const avgSOC = (BESS_FLEET.reduce((sum, s) => sum + s.avgSOC, 0) / BESS_FLEET.length).toFixed(1)
  const totalSolar = BESS_FLEET.reduce((sum, s) => sum + s.solarGen, 0).toFixed(1)
  const totalCO2 = BESS_FLEET.reduce((sum, s) => sum + s.co2, 0)

  const filtered = filter === 'All' ? BESS_FLEET :
    filter === 'Healthy' ? BESS_FLEET.filter(s => s.status === 'Healthy') :
    BESS_FLEET.filter(s => s.status === 'Degraded')

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
        <h1 className="text-2xl font-bold text-white">BESS Fleet Management</h1>
        <p className="text-gray-400 text-sm mt-0.5">Monitor all BESS units across societies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total BESS Units', value:totalUnits,        from:'#1d4ed8',to:'#1e40af', icon:'🔋' },
          { label:'Avg. SOC',         value:`${avgSOC}%`,      from:'#065f46',to:'#064e3b', icon:'⚡' },
          { label:'Solar Gen Today',  value:`${totalSolar}kWh`,from:'#f59e0b',to:'#d97706', icon:'☀️' },
          { label:'CO₂ Offset MTD',   value:`${totalCO2}kg`,   from:'#10b981',to:'#059669', icon:'🌱' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <div className="absolute right-3 top-3 text-2xl opacity-20">{s.icon}</div>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Efficiency chart */}
      <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
        <h2 className="text-base font-bold text-white mb-4">BESS Health & SOC by Society</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={EFFICIENCY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="name" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
            <YAxis stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v,name)=>[`${v}%`,name==='health'?'Health':'SOC']} />
            <Bar dataKey="health" fill="#10b981" name="Health" radius={[8,8,0,0]} />
            <Bar dataKey="soc" fill="#3b82f6" name="SOC" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All','Healthy','Degraded'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter===f ? 'bg-emerald-600 text-white border-emerald-700' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>
            {f}
          </button>
        ))}
      </div>

      {/* BESS fleet table */}
      <div className="rounded-2xl border dark-card border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Society','Units','Avg SOC','Health','Temp','Solar Gen','Peak Shaved','CO₂ Offset','Status'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-all">
                  <td className="py-3 px-3 text-white font-semibold">{s.society}</td>
                  <td className="py-3 px-3 text-blue-400 font-bold">{s.units}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{s.avgSOC}%</td>
                  <td className="py-3 px-3 text-green-400 font-bold">{s.avgHealth}%</td>
                  <td className="py-3 px-3 text-amber-400 font-semibold">{s.temp}°C</td>
                  <td className="py-3 px-3 text-yellow-400 font-semibold">{s.solarGen} kWh</td>
                  <td className="py-3 px-3 text-purple-400 font-semibold">{s.peakShaved} kW</td>
                  <td className="py-3 px-3 text-green-400 font-semibold">{s.co2} kg</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${statusStyle[s.status]}`}>
                      {s.status}
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
