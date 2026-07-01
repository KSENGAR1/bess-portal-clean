import { useState, useEffect } from 'react'
import {
  Battery, Thermometer, Activity, RotateCcw, AlertTriangle, CheckCircle, Wrench,
  TrendingUp, TrendingDown, Calendar, Zap, ArrowRight, Clock
} from 'lucide-react'
import BatteryGauge from '../components/BatteryGauge'
import { useToast } from '../components/ToastProvider'

export default function BatteryHealthPage() {
  const { addToast } = useToast()
  const [cells, setCells] = useState([])
  const [alerts, setAlerts] = useState([])
  const [maintenance, setMaintenance] = useState([])

  useEffect(() => {
    // Generate 16 cell data points
    const cellData = Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      voltage: 3.65 + (Math.random() - 0.5) * 0.15,
      temp: 28 + Math.random() * 8,
      soc: 75 + (Math.random() - 0.5) * 20,
      health: 95 + (Math.random() - 0.5) * 10,
      status: Math.random() > 0.85 ? 'warning' : 'good',
    }))
    setCells(cellData)

    setAlerts([
      { id: 1, level: 'warning', title: 'Cell #7 temperature elevated', time: '10 min ago', detail: 'Cell temp: 38.2°C (threshold: 35°C)' },
      { id: 2, level: 'info', title: 'Scheduled balancing completed', time: '2 hours ago', detail: 'All cells balanced within 0.05V' },
      { id: 3, level: 'good', title: 'Capacity test passed', time: '1 day ago', detail: 'Measured: 98.2% of rated capacity' },
    ])

    setMaintenance([
      { id: 1, task: 'Cooling system filter replacement', due: '3 days', status: 'upcoming', priority: 'medium' },
      { id: 2, task: 'Annual capacity test', due: '15 days', status: 'upcoming', priority: 'high' },
      { id: 3, task: 'BMS firmware update v2.4.1', due: 'Completed', status: 'done', priority: 'low' },
      { id: 4, task: 'Terminal torque inspection', due: 'Completed', status: 'done', priority: 'medium' },
    ])
  }, [])

  const avgTemp = cells.length ? (cells.reduce((a, c) => a + c.temp, 0) / cells.length).toFixed(1) : 0
  const avgVolt = cells.length ? (cells.reduce((a, c) => a + c.voltage, 0) / cells.length).toFixed(3) : 0
  const minHealth = cells.length ? Math.min(...cells.map(c => c.health)) : 0
  const cycleCount = 1247
  const soh = 96.8

  const stats = [
    { label: 'State of Health', value: `${soh}%`, sub: 'Capacity retention', color: '#3b82f6', icon: Battery },
    { label: 'Avg Cell Temp', value: `${avgTemp}°C`, sub: 'Normal range', color: '#f59e0b', icon: Thermometer },
    { label: 'Cycle Count', value: `${cycleCount.toLocaleString()}`, sub: 'Lifetime cycles', color: '#8b5cf6', icon: RotateCcw },
    { label: 'Avg Voltage', value: `${avgVolt}V`, sub: 'Per cell', color: '#22c55e', icon: Zap },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-extrabold text-gray-900">Battery Health</h2>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Healthy
            </span>
          </div>
          <p className="text-sm text-gray-500">BESS Pack diagnostics · 16 cells · 48V 200Ah</p>
        </div>
        <button onClick={() => addToast('Battery health report downloaded', 'success')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
          <Activity size={13} /> Run Diagnostics
        </button>
      </div>

      {/* Battery gauge + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex flex-col items-center justify-center">
          <BatteryGauge soc={78} health={soh} temp={+avgTemp} cycles={cycleCount} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}12` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cell grid */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Cell-Level Status</h3>
          <span className="text-[10px] font-bold text-gray-400">16 cells · 4 modules</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {cells.map(cell => (
            <div key={cell.id}
              className={`rounded-xl p-2.5 border text-center transition-all hover:scale-105 cursor-pointer ${
                cell.status === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'
              }`}
              onClick={() => addToast(`Cell ${cell.id}: ${cell.voltage.toFixed(3)}V · ${cell.temp.toFixed(1)}°C`, cell.status === 'warning' ? 'warning' : 'info')}
            >
              <p className="text-[9px] font-bold text-gray-400 mb-1">C{cell.id}</p>
              <p className={`text-xs font-extrabold ${cell.status === 'warning' ? 'text-amber-700' : 'text-gray-700'}`}>
                {cell.voltage.toFixed(2)}V
              </p>
              <p className={`text-[9px] font-bold mt-0.5 ${cell.temp > 35 ? 'text-red-500' : 'text-gray-400'}`}>
                {cell.temp.toFixed(1)}°C
              </p>
              <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${cell.soc}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Good</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Warning</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
        </div>
      </div>

      {/* Alerts + Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">System Alerts</h3>
            <span className="text-[10px] font-bold text-gray-400">{alerts.length} events</span>
          </div>
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border ${
                a.level === 'warning' ? 'bg-amber-50 border-amber-100' :
                a.level === 'good' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'
              }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  a.level === 'warning' ? 'bg-amber-100' : a.level === 'good' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {a.level === 'warning' ? <AlertTriangle size={14} className="text-amber-600" /> :
                   a.level === 'good' ? <CheckCircle size={14} className="text-green-600" /> :
                   <Activity size={14} className="text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900">{a.title}</p>
                    <span className="text-[10px] font-bold text-gray-400">{a.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Maintenance Schedule</h3>
            <span className="text-[10px] font-bold text-gray-400">{maintenance.filter(m => m.status === 'upcoming').length} upcoming</span>
          </div>
          <div className="space-y-2">
            {maintenance.map(m => (
              <div key={m.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                m.status === 'done' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    m.status === 'done' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {m.status === 'done' ? <CheckCircle size={14} className="text-green-600" /> : <Wrench size={14} className="text-blue-600" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{m.task}</p>
                    <p className="text-[10px] text-gray-400">Due: {m.due}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  m.priority === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                  m.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                  'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  {m.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
