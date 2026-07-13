import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

const PERFORMANCE_DATA = [
  { 
    society: 'ABC Residency', 
    collectionRate: 89.9, consumerSat: 4.2, energyEff: 91.5, 
    responseTime: 2.1, uptime: 99.8, complaintRes: 85,
    revenue: 452350, growth: 12.5, color: '#f59e0b'
  },
  { 
    society: 'Green Valley', 
    collectionRate: 91.2, consumerSat: 4.5, energyEff: 93.2, 
    responseTime: 1.8, uptime: 99.9, complaintRes: 92,
    revenue: 325400, growth: 15.2, color: '#10b981'
  },
  { 
    society: 'Sunrise Apartments', 
    collectionRate: 88.7, consumerSat: 4.0, energyEff: 90.1, 
    responseTime: 2.5, uptime: 99.5, complaintRes: 78,
    revenue: 578900, growth: 8.3, color: '#3b82f6'
  },
  { 
    society: 'Palm Springs', 
    collectionRate: 93.7, consumerSat: 4.7, energyEff: 94.8, 
    responseTime: 1.5, uptime: 99.9, complaintRes: 95,
    revenue: 289600, growth: 18.9, color: '#8b5cf6'
  },
  { 
    society: 'Royal Gardens', 
    collectionRate: 87.4, consumerSat: 3.9, energyEff: 89.3, 
    responseTime: 2.8, uptime: 99.3, complaintRes: 75,
    revenue: 412800, growth: 6.7, color: '#ec4899'
  },
]

// Radar chart data for comparison
const radarData = [
  { metric: 'Collection', abc: 89.9, green: 91.2, sunrise: 88.7, palm: 93.7, royal: 87.4 },
  { metric: 'Satisfaction', abc: 84, green: 90, sunrise: 80, palm: 94, royal: 78 },
  { metric: 'Energy Eff', abc: 91.5, green: 93.2, sunrise: 90.1, palm: 94.8, royal: 89.3 },
  { metric: 'Response', abc: 79, green: 88, sunrise: 70, palm: 95, royal: 65 },
  { metric: 'Uptime', abc: 99.8, green: 99.9, sunrise: 99.5, palm: 99.9, royal: 99.3 },
]

export default function CompanyAdminPerformance() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const [selected, setSelected] = useState(null)

  const avgCollection = (PERFORMANCE_DATA.reduce((s, d) => s + d.collectionRate, 0) / PERFORMANCE_DATA.length).toFixed(1)
  const avgSat = (PERFORMANCE_DATA.reduce((s, d) => s + d.consumerSat, 0) / PERFORMANCE_DATA.length).toFixed(1)
  const totalRevenue = PERFORMANCE_DATA.reduce((s, d) => s + d.revenue, 0)
  const avgGrowth = (PERFORMANCE_DATA.reduce((s, d) => s + d.growth, 0) / PERFORMANCE_DATA.length).toFixed(1)

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
        <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
        <p className="text-gray-400 text-sm mt-0.5">Compare performance across all societies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Avg Collection', value:`${avgCollection}%`,          from:'#065f46',to:'#064e3b' },
          { label:'Avg Satisfaction', value:`${avgSat}/5`,              from:'#4c1d95',to:'#3b0764' },
          { label:'Total Revenue', value:`${sym}${(totalRevenue/1000).toFixed(0)}k`, from:'#1d4ed8',to:'#1e40af' },
          { label:'Avg Growth', value:`${avgGrowth}%`,                  from:'#059669',to:'#047857' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Radar comparison */}
      <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
        <h2 className="text-base font-bold text-white mb-4">Performance Comparison Radar</h2>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={gridStroke} />
            <PolarAngleAxis dataKey="metric" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
            <PolarRadiusAxis stroke={axisStroke} tick={{ fontSize:10, fill:tickFill }} />
            <Radar name="ABC Residency" dataKey="abc" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
            <Radar name="Green Valley" dataKey="green" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Radar name="Sunrise Apartments" dataKey="sunrise" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Radar name="Palm Springs" dataKey="palm" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            <Radar name="Royal Gardens" dataKey="royal" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue comparison */}
      <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
        <h2 className="text-base font-bold text-white mb-4">Revenue & Growth Comparison</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={PERFORMANCE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="society" stroke={axisStroke} tick={{ fontSize:10, fill:tickFill }} 
                   angle={-15} textAnchor="end" height={80} />
            <YAxis yAxisId="left" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} 
                   tickFormatter={v=>`${sym}${(v/1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} 
                   tickFormatter={v=>`${v}%`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[8,8,0,0]} />
            <Bar yAxisId="right" dataKey="growth" fill="#10b981" name="Growth %" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {PERFORMANCE_DATA.map(s => (
          <div key={s.society} className="rounded-2xl dark-card border border-[rgba(255,255,255,0.07)] p-5 shadow-dark-card cursor-pointer hover:border-emerald-500/30 transition-all"
               onClick={()=>setSelected(selected===s.society?null:s.society)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white font-bold text-base">{s.society}</p>
                <p className="text-gray-500 text-xs mt-0.5">Performance Metrics</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                   style={{ background: s.color, opacity: 0.2 }}>
                📊
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Collection Rate</p>
                <p className={`font-bold text-base ${s.collectionRate>=90?'text-emerald-400':s.collectionRate>=85?'text-amber-400':'text-red-400'}`}>
                  {s.collectionRate}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Satisfaction</p>
                <p className="text-emerald-400 font-bold text-base">{s.consumerSat}/5</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Energy Efficiency</p>
                <p className="text-blue-400 font-bold text-base">{s.energyEff}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Uptime</p>
                <p className="text-green-400 font-bold text-base">{s.uptime}%</p>
              </div>
            </div>

            {selected === s.society && (
              <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Response Time</span>
                  <span className="text-white font-semibold">{s.responseTime} hours</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Complaint Resolution</span>
                  <span className="text-white font-semibold">{s.complaintRes}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Revenue</span>
                  <span className="text-white font-semibold">{sym}{s.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Growth</span>
                  <span className="text-emerald-400 font-bold">+{s.growth}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
