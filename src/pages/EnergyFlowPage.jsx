import { useState, useEffect } from 'react'
import {
  Zap, Battery, Sun, ArrowRight, Activity, TrendingUp, Download, Filter, BarChart3,
  ChevronDown, ChevronUp, Clock, AlertTriangle, CheckCircle
} from 'lucide-react'
import BessPowerFlow from '../components/BessPowerFlow'
import { useToast } from '../components/ToastProvider'

export default function EnergyFlowPage() {
  const { addToast } = useToast()
  const [timeRange, setTimeRange] = useState('24h')
  const [liveData, setLiveData] = useState({
    gridImport: 2.4, gridExport: 0, solarGen: 4.8,
    batteryCharge: 3.2, batteryDischarge: 0, loadDemand: 6.0,
    batterySoc: 78, systemEfficiency: 91.5
  })
  const [history, setHistory] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        const solar = 3 + Math.random() * 4.5
        const load = 4 + Math.random() * 4
        const soc = Math.min(100, Math.max(10, prev.batterySoc + (Math.random() - 0.5) * 0.5))
        const net = solar - load
        const charge = net > 0 ? Math.min(net, 5) : 0
        const discharge = net < 0 ? Math.min(-net, 5) : 0
        const gridImp = net < 0 && -net > 5 ? Math.min(-net - 5, 8) : 0
        const gridExp = net > 0 && net > 5 ? Math.min(net - 5, 8) : 0
        return {
          gridImport: gridImp, gridExport: gridExp, solarGen: solar,
          batteryCharge: charge, batteryDischarge: discharge, loadDemand: load,
          batterySoc: soc, systemEfficiency: 88 + Math.random() * 6
        }
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const now = new Date()
    const arr = []
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 3600 * 1000)
      const solar = Math.max(0, 5 * Math.sin((t.getHours() - 6) * Math.PI / 12) + Math.random() * 1.5)
      const load = 3 + Math.random() * 4
      const battery = solar > load ? solar - load : 0
      const grid = load > solar + 5 ? load - solar - 5 : 0
      arr.push({
        time: `${t.getHours()}:00`, solar: +solar.toFixed(1), load: +load.toFixed(1),
        battery: +battery.toFixed(1), grid: +grid.toFixed(1)
      })
    }
    setHistory(arr)
  }, [timeRange])

  const metrics = [
    { label: 'Grid Import', value: liveData.gridImport, unit: 'kW', color: '#22c55e', icon: Zap, trend: '↓ 12% vs avg' },
    { label: 'Solar Gen', value: liveData.solarGen, unit: 'kW', color: '#f59e0b', icon: Sun, trend: '↑ 8% vs avg' },
    { label: 'Battery SOC', value: liveData.batterySoc, unit: '%', color: '#3b82f6', icon: Battery, trend: 'Charging' },
    { label: 'Load Demand', value: liveData.loadDemand, unit: 'kW', color: '#ef4444', icon: Activity, trend: 'Normal' },
  ]

  const events = [
    { time: '2:45 PM', type: 'Charge', detail: 'Battery charging from solar surplus', status: 'active' },
    { time: '2:30 PM', type: 'Peak Shave', detail: 'Battery discharged to reduce grid peak', status: 'completed' },
    { time: '12:15 PM', type: 'Grid Export', detail: 'Surplus solar exported to grid', status: 'completed' },
    { time: '10:00 AM', type: 'Charge', detail: 'Battery charging from solar', status: 'completed' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-extrabold text-gray-900">Energy Flow</h2>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
            </span>
          </div>
          <p className="text-sm text-gray-500">Real-time energy flow between Grid, Solar, Battery, and Load</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {['1h', '24h', '7d', '30d'].map(r => (
              <button key={r} onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={() => addToast('Energy report exported successfully', 'success')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Live metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${m.color}12` }}>
                <m.icon size={16} style={{ color: m.color }} />
              </div>
              <span className="text-[10px] font-bold text-gray-400">{m.trend}</span>
            </div>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-extrabold text-gray-900">{m.value.toFixed(1)}</span>
              <span className="text-xs font-bold text-gray-400 mb-1">{m.unit}</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Power Flow Diagram */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Real-time Power Flow</h3>
            <p className="text-xs text-gray-400">Animated energy paths show active flows</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Grid</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Solar</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Battery</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Load</span>
          </div>
        </div>
        <BessPowerFlow />
      </div>

      {/* History chart + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm mb-4">24-Hour Energy History</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-gray-400 font-mono">{h.time}</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden flex">
                  <div className="h-full bg-amber-400" style={{ width: `${(h.solar / 8) * 100}%` }} title={`Solar: ${h.solar} kW`} />
                  <div className="h-full bg-blue-400" style={{ width: `${(h.battery / 8) * 100}%` }} title={`Battery: ${h.battery} kW`} />
                  <div className="h-full bg-green-400" style={{ width: `${(h.grid / 8) * 100}%` }} title={`Grid: ${h.grid} kW`} />
                </div>
                <span className="w-12 text-right font-bold text-gray-600">{(h.solar + h.battery + h.grid).toFixed(1)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-400" /> Solar</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400" /> Battery</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-400" /> Grid</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Recent Events</h3>
          <div className="space-y-3">
            {events.map((e, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${e.status === 'active' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {e.status === 'active' ? <Zap size={14} className="text-green-600" /> : <CheckCircle size={14} className="text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900">{e.type}</p>
                    <span className="text-[10px] font-bold text-gray-400">{e.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{e.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Efficiency & System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'System Efficiency', value: `${liveData.systemEfficiency.toFixed(1)}%`, sub: 'Round-trip', color: '#8b5cf6' },
          { label: 'Peak Shaving', value: '2.4 kW', sub: 'Today', color: '#ec4899' },
          { label: 'Self-Consumption', value: '68%', sub: 'Solar used on-site', color: '#f59e0b' },
          { label: 'Grid Export', value: '12.5 kWh', sub: 'Today', color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
