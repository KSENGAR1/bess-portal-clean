import { useState, useEffect } from 'react'
import {
  Sun, TrendingUp, TrendingDown, Calendar, Download, Cloud, CloudRain, CloudSun,
  ArrowRight, BarChart3, Zap, Leaf
} from 'lucide-react'
import { useToast } from '../components/ToastProvider'
import { useCurrency } from '../context/CurrencyContext'

export default function SolarPage() {
  const { addToast } = useToast()
  const { country } = useCurrency()
  const sym = country.symbol
  const [timeRange, setTimeRange] = useState('daily')
  const [currentGen, setCurrentGen] = useState(4.8)

  useEffect(() => {
    const interval = setInterval(() => setCurrentGen(3 + Math.random() * 3.5), 4000)
    return () => clearInterval(interval)
  }, [])

  const dailyData = [
    { time: '06:00', gen: 0.5 }, { time: '08:00', gen: 2.1 }, { time: '10:00', gen: 4.5 },
    { time: '12:00', gen: 6.2 }, { time: '14:00', gen: 5.8 }, { time: '16:00', gen: 3.9 },
    { time: '18:00', gen: 1.2 }, { time: '20:00', gen: 0 },
  ]

  const monthlyData = [
    { month: 'Jan', gen: 245, costSaved: 2940 }, { month: 'Feb', gen: 263, costSaved: 3156 },
    { month: 'Mar', gen: 238, costSaved: 2856 }, { month: 'Apr', gen: 287, costSaved: 3444 },
    { month: 'May', gen: 272, costSaved: 3264 }, { month: 'Jun', gen: 312, costSaved: 3744 },
  ]

  const stats = [
    { label: 'Current Output', value: `${currentGen.toFixed(1)} kW`, sub: 'Real-time', color: '#f59e0b', icon: Zap },
    { label: 'Today\'s Total', value: '28.5 kWh', sub: 'PV generation', color: '#3b82f6', icon: Sun },
    { label: 'Peak Today', value: '6.2 kW', sub: 'At 12:00 PM', color: '#22c55e', icon: TrendingUp },
    { label: 'Efficiency', value: '21.4%', sub: 'Panel rating', color: '#8b5cf6', icon: BarChart3 },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-extrabold text-gray-900">Solar Generation</h2>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Live
            </span>
          </div>
          <p className="text-sm text-gray-500">PV Array · 12 kWp · 48 panels</p>
        </div>
        <button onClick={() => addToast('Solar report exported', 'success')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}12` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-[10px] text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Hourly generation bars */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Today's Generation Curve</h3>
          <span className="text-[10px] font-bold text-gray-400">8 data points</span>
        </div>
        <div className="flex items-end gap-2 h-40">
          {dailyData.map((d, i) => {
            const pct = (d.gen / 7) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-amber-400 transition-all hover:bg-amber-500 relative group" style={{ height: `${pct}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {d.gen} kW
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gray-400">{d.time}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly summary */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Monthly Generation</h3>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {['daily', 'monthly'].map(t => (
              <button key={t} onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all capitalize ${timeRange === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {monthlyData.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-8 text-xs font-bold text-gray-500">{m.month}</span>
              <div className="flex-1 h-6 bg-gray-50 rounded-lg overflow-hidden flex">
                <div className="h-full bg-amber-400 rounded-l-lg transition-all hover:bg-amber-500"
                  style={{ width: `${(m.gen / 350) * 100}%` }} title={`Generation: ${m.gen} kWh`} />
                <div className="h-full bg-green-400 rounded-r-lg transition-all hover:bg-green-500"
                  style={{ width: `${(m.costSaved / 4000) * 100}%` }} title={`Saved: ${sym}${m.costSaved}`} />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-700">{m.gen} kWh</p>
                <p className="text-[10px] text-green-600 font-bold">{sym}{m.costSaved.toLocaleString()} saved</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-400" /> Generation</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-400" /> Cost Saved</span>
        </div>
      </div>
    </div>
  )
}
