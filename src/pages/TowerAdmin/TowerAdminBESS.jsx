import { useState, useEffect } from 'react'
import {
  Battery, Thermometer, Activity, RotateCcw, AlertTriangle, CheckCircle,
  Wrench, Zap, TrendingUp, TrendingDown, Sun, Home, Clock
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts'
import BatteryGauge from '../../components/BatteryGauge'
import { useChartTheme } from '../../utils/chartTheme'
import { useToast } from '../../components/ToastProvider'

// ── Simulated data ──────────────────────────────────────────────────────────
const POWER_HISTORY = [
  { time: '00:00', solar: 0,  grid: 12, bess: -2, load: 10 },
  { time: '03:00', solar: 0,  grid: 10, bess: -1, load: 9  },
  { time: '06:00', solar: 4,  grid: 8,  bess: 2,  load: 14 },
  { time: '09:00', solar: 18, grid: 2,  bess: 8,  load: 28 },
  { time: '12:00', solar: 28, grid: 0,  bess: 12, load: 32 },
  { time: '15:00', solar: 22, grid: 0,  bess: 6,  load: 26 },
  { time: '18:00', solar: 8,  grid: 6,  bess: -4, load: 22 },
  { time: '21:00', solar: 0,  grid: 14, bess: -6, load: 18 },
]

const SOC_HISTORY = [
  { time: '00:00', soc: 72 }, { time: '03:00', soc: 68 }, { time: '06:00', soc: 65 },
  { time: '09:00', soc: 71 }, { time: '12:00', soc: 82 }, { time: '15:00', soc: 87 },
  { time: '18:00', soc: 84 }, { time: '21:00', soc: 76 },
]

const INITIAL_CELLS = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  voltage: +(3.62 + (Math.random() - 0.5) * 0.12).toFixed(3),
  temp:    +(30 + Math.random() * 9).toFixed(1),
  soc:     +(72 + (Math.random() - 0.5) * 18).toFixed(0),
  status:  Math.random() > 0.88 ? 'warning' : 'good',
}))

const ALERTS = [
  { id: 1, level: 'warning', title: 'Cell #7 temperature elevated', time: '14 min ago', detail: 'Measured 38.4 °C — threshold 35 °C' },
  { id: 2, level: 'info',    title: 'Scheduled cell balancing complete', time: '3 h ago',    detail: 'All cells within ±0.04 V' },
  { id: 3, level: 'good',    title: 'Capacity verification passed', time: '1 day ago',  detail: 'Measured 97.8 % of rated 48 V / 200 Ah' },
  { id: 4, level: 'info',    title: 'Grid supply restored after outage', time: '2 days ago', detail: 'BESS provided 28 min of backup' },
]

const MAINTENANCE = [
  { id: 1, task: 'Cooling filter replacement',  due: '3 days',  status: 'upcoming', priority: 'medium' },
  { id: 2, task: 'Annual capacity test',         due: '12 days', status: 'upcoming', priority: 'high'   },
  { id: 3, task: 'BMS firmware v2.4.1',          due: 'Done',    status: 'done',     priority: 'low'    },
  { id: 4, task: 'Terminal torque inspection',   due: 'Done',    status: 'done',     priority: 'medium' },
]

export default function TowerAdminBESS() {
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const { addToast } = useToast()
  const [cells]    = useState(INITIAL_CELLS)
  const [activeTab, setActiveTab] = useState('overview')

  const avgTemp  = (cells.reduce((s, c) => s + c.temp, 0) / cells.length).toFixed(1)
  const avgVolt  = (cells.reduce((s, c) => s + c.voltage, 0) / cells.length).toFixed(3)
  const warnCount = cells.filter(c => c.status === 'warning').length
  const soh = 96.8
  const soc = 76
  const cycles = 1247

  const TABS = ['overview', 'cells', 'power flow', 'alerts', 'maintenance']

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      {/* Identity banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4 border"
           style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.25)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
             style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)' }}>🔋</div>
        <div className="flex-1 min-w-0">
          <p className="text-cyan-400 font-bold text-sm">Tower A — BESS Unit #TA-01</p>
          <p className="text-gray-500 text-xs">48 V / 200 Ah · 16 cells · 4 modules · ABC Residency</p>
        </div>
        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${
          warnCount > 0
            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        }`}>
          ● {warnCount > 0 ? `${warnCount} Warning${warnCount > 1 ? 's' : ''}` : 'Healthy'}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">BESS Health Monitor</h1>
          <p className="text-gray-400 text-sm mt-0.5">Real-time diagnostics for Tower A battery system</p>
        </div>
        <button
          onClick={() => addToast('Diagnostic report generated (demo)', 'success')}
          className="px-4 py-2 rounded-xl font-bold text-sm text-white flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)' }}
        >
          <Activity size={14} /> Run Diagnostics
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 dark-page-bg p-1 rounded-xl w-fit border border-[rgba(255,255,255,0.06)] flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    activeTab === t ? 'bg-cyan-700 text-white' : 'text-gray-400 hover:text-white'
                  }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'State of Health', value: `${soh}%`,       icon: Battery,     color: '#22d3ee', from: '#164e63', to: '#155e75' },
              { label: 'Avg Cell Temp',   value: `${avgTemp} °C`,  icon: Thermometer, color: '#fbbf24', from: '#78350f', to: '#92400e' },
              { label: 'Cycle Count',     value: cycles.toLocaleString(), icon: RotateCcw, color: '#a78bfa', from: '#3b0764', to: '#4c1d95' },
              { label: 'Avg Voltage',     value: `${avgVolt} V`,   icon: Zap,         color: '#34d399', from: '#064e3b', to: '#065f46' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
                   style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
                <s.icon size={32} className="absolute right-3 top-3 opacity-10" style={{ color: s.color }} />
                <p className="text-xs text-white/70">{s.label}</p>
                <p className="text-2xl font-extrabold text-white mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Gauge + SOC chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl p-6 border dark-card border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Live Battery Status</p>
              <BatteryGauge soc={soc} health={soh} temp={+avgTemp} cycles={cycles} />
            </div>
            <div className="lg:col-span-2 rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
              <p className="text-sm font-bold text-white mb-1">State of Charge — Today</p>
              <p className="text-xs text-gray-500 mb-4">Hourly SOC % across the day</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={SOC_HISTORY}>
                  <defs>
                    <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="time" stroke={axisStroke} tick={{ fontSize: 10, fill: tickFill }} />
                  <YAxis domain={[50, 100]} stroke={axisStroke} tick={{ fontSize: 10, fill: tickFill }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v}%`, 'SOC']} />
                  <Area type="monotone" dataKey="soc" stroke="#06b6d4" strokeWidth={2} fill="url(#socGrad)" dot={{ r: 3, fill: '#06b6d4' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick status cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Cells OK',      value: `${16 - warnCount}/16`, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Cells Warning', value: `${warnCount}/16`,      icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Today Solar',   value: '58.2 kWh',            icon: Sun,           color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'Peak Shaved',   value: '24.5 kW',             icon: TrendingDown,  color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 border dark-card border-[rgba(255,255,255,0.06)] flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon size={16} className={s.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CELLS TAB ────────────────────────────────────────────────── */}
      {activeTab === 'cells' && (
        <div className="space-y-5">
          <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-white">Cell-Level Status</p>
                <p className="text-xs text-gray-500 mt-0.5">16 cells across 4 modules — click any cell for details</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>Good</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/>Warning</span>
              </div>
            </div>

            {/* Module headers */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {['Module 1', 'Module 2', 'Module 3', 'Module 4'].map(m => (
                <p key={m} className="text-[10px] font-bold text-center text-cyan-500 uppercase tracking-wider">{m}</p>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {cells.map(cell => (
                <button key={cell.id} onClick={() =>
                  addToast(`Cell ${cell.id}: ${cell.voltage}V · ${cell.temp}°C · SOC ${cell.soc}%`,
                    cell.status === 'warning' ? 'warning' : 'info')}
                  className={`rounded-xl p-3 border text-center transition-all hover:scale-105 ${
                    cell.status === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'dark-card border-[rgba(255,255,255,0.08)]'
                  }`}
                >
                  <p className="text-[9px] font-bold text-gray-500 mb-1">C{cell.id}</p>
                  <p className={`text-sm font-extrabold ${cell.status === 'warning' ? 'text-amber-400' : 'text-white'}`}>
                    {cell.voltage}V
                  </p>
                  <p className={`text-[10px] font-bold mt-0.5 ${cell.temp > 35 ? 'text-red-400' : 'text-gray-400'}`}>
                    {cell.temp}°C
                  </p>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full bg-cyan-500" style={{ width: `${cell.soc}%` }} />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5">{cell.soc}%</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cell stats summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Min Voltage', value: `${Math.min(...cells.map(c => c.voltage)).toFixed(3)} V`, color: 'text-red-400' },
              { label: 'Avg Voltage', value: `${avgVolt} V`, color: 'text-cyan-400' },
              { label: 'Max Voltage', value: `${Math.max(...cells.map(c => c.voltage)).toFixed(3)} V`, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 border dark-card border-[rgba(255,255,255,0.06)] text-center">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POWER FLOW TAB ───────────────────────────────────────────── */}
      {activeTab === 'power flow' && (
        <div className="space-y-5">
          {/* Live source indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Solar Input',   value: '22.4 kW', trend: '+3.1', icon: Sun,        color: '#fbbf24', from: '#78350f', to: '#92400e' },
              { label: 'Grid Import',   value: '3.2 kW',  trend: '-8.4', icon: Zap,        color: '#60a5fa', from: '#1e3a5f', to: '#1e40af' },
              { label: 'BESS Output',   value: '6.1 kW',  trend: '+1.2', icon: Battery,    color: '#34d399', from: '#064e3b', to: '#065f46' },
              { label: 'Tower Load',    value: '28.7 kW', trend: '+2.4', icon: Home,       color: '#a78bfa', from: '#3b0764', to: '#4c1d95' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
                   style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
                <s.icon size={32} className="absolute right-3 top-3 opacity-10" style={{ color: s.color }} />
                <p className="text-xs text-white/70">{s.label}</p>
                <p className="text-2xl font-extrabold text-white mt-1">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                  {s.trend.startsWith('+')
                    ? <TrendingUp size={10} className="text-emerald-300" />
                    : <TrendingDown size={10} className="text-red-300" />}
                  {s.trend} kW vs yesterday
                </p>
              </div>
            ))}
          </div>

          {/* Power flow chart */}
          <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
            <p className="text-sm font-bold text-white mb-1">Power Flow — Today</p>
            <p className="text-xs text-gray-500 mb-4">Solar generation, grid import, BESS output and tower load (kW)</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={POWER_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="time" stroke={axisStroke} tick={{ fontSize: 10, fill: tickFill }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 10, fill: tickFill }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v} kW`, n]} />
                <Line type="monotone" dataKey="solar" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} name="Solar" />
                <Line type="monotone" dataKey="grid"  stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} name="Grid" />
                <Line type="monotone" dataKey="bess"  stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} name="BESS" />
                <Line type="monotone" dataKey="load"  stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} name="Load" strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-3 text-[10px] font-bold text-gray-400">
              {[['Solar','#fbbf24'],['Grid','#60a5fa'],['BESS','#34d399'],['Load','#a78bfa']].map(([n,c]) => (
                <span key={n} className="flex items-center gap-1">
                  <span className="w-3 h-0.5 inline-block rounded" style={{ background: c }}/>
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Energy summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Solar Generated Today', value: '58.2 kWh', icon: Sun,         color: '#fbbf24' },
              { label: 'Grid Energy Used',       value: '12.4 kWh', icon: Zap,         color: '#60a5fa' },
              { label: 'BESS Energy Dispatched', value: '34.8 kWh', icon: Battery,     color: '#34d399' },
              { label: 'Peak Load Shaved',       value: '24.5 kW',  icon: TrendingDown,color: '#a78bfa' },
              { label: 'Self-Sufficiency',        value: '82.7%',    icon: Activity,    color: '#22d3ee' },
              { label: 'CO₂ Offset Today',       value: '24.3 kg',  icon: TrendingUp,  color: '#86efac' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 border dark-card border-[rgba(255,255,255,0.06)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: `${s.color}18` }}>
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="font-extrabold text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ALERTS TAB ───────────────────────────────────────────────── */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-white">BESS System Alerts</p>
              <span className="text-[10px] font-bold text-gray-500">{ALERTS.length} events</span>
            </div>
            <div className="space-y-3">
              {ALERTS.map(a => (
                <div key={a.id} className={`flex items-start gap-3 p-4 rounded-xl border ${
                  a.level === 'warning' ? 'bg-amber-500/10 border-amber-500/25' :
                  a.level === 'good'    ? 'bg-emerald-500/10 border-emerald-500/25' :
                                         'bg-cyan-500/10 border-cyan-500/25'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    a.level === 'warning' ? 'bg-amber-500/20' :
                    a.level === 'good'    ? 'bg-emerald-500/20' : 'bg-cyan-500/20'
                  }`}>
                    {a.level === 'warning' ? <AlertTriangle size={14} className="text-amber-400" /> :
                     a.level === 'good'    ? <CheckCircle   size={14} className="text-emerald-400" /> :
                                            <Activity       size={14} className="text-cyan-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-white">{a.title}</p>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 flex-shrink-0">
                        <Clock size={9} />{a.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{a.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert config quick-access */}
          <div className="rounded-2xl p-4 border border-cyan-500/20 bg-cyan-500/5">
            <p className="text-xs font-bold text-cyan-400 mb-2">Alert thresholds are configured in Settings → Alerts</p>
            <button
              onClick={() => addToast('Navigate to Settings → Alerts to adjust thresholds', 'info')}
              className="text-xs font-bold text-cyan-400 underline underline-offset-2"
            >
              Go to Alert Settings →
            </button>
          </div>
        </div>
      )}

      {/* ── MAINTENANCE TAB ──────────────────────────────────────────── */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-white">Maintenance Schedule</p>
              <span className="text-[10px] font-bold text-gray-500">
                {MAINTENANCE.filter(m => m.status === 'upcoming').length} upcoming
              </span>
            </div>
            <div className="space-y-3">
              {MAINTENANCE.map(m => (
                <div key={m.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  m.status === 'done'
                    ? 'dark-card border-[rgba(255,255,255,0.04)] opacity-50'
                    : 'dark-card border-[rgba(255,255,255,0.08)]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      m.status === 'done' ? 'bg-emerald-500/15' : 'bg-cyan-500/15'
                    }`}>
                      {m.status === 'done'
                        ? <CheckCircle size={15} className="text-emerald-400" />
                        : <Wrench      size={15} className="text-cyan-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{m.task}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                        <Clock size={9} /> Due: {m.due}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    m.priority === 'high'   ? 'bg-red-500/15    text-red-400    border-red-500/30' :
                    m.priority === 'medium' ? 'bg-amber-500/15  text-amber-400  border-amber-500/30' :
                                             'bg-blue-500/15   text-blue-400   border-blue-500/30'
                  }`}>
                    {m.priority}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => addToast('Maintenance request submitted (demo)', 'success')}
              className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-cyan-500/30 text-cyan-400 text-sm font-bold hover:bg-cyan-500/5 transition-all"
            >
              + Request New Maintenance
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
