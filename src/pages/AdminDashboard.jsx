import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import {
  Battery, Sun, Zap, Activity, TrendingUp, ArrowRight, Download, Filter, Search, BarChart3,
  Thermometer, Leaf, AlertTriangle, CheckCircle, Wrench, Users, XCircle, Wallet, Clock,
  MessageSquare, Flame, Wifi, Building
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import DataTable from '../components/DataTable'
import { useToast } from '../components/ToastProvider'
import { useChartTheme } from '../utils/chartTheme'

const Badge = ({ status }) => {
  const map = {
    Active:        'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    Inactive:      'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30',
    Open:          'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    'In Progress': 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Resolved:      'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    Critical:      'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    High:          'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    Medium:        'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
    Healthy:       'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    Degraded:      'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${map[status] || map.Medium}`}>
      {status}
    </span>
  )
}

export default function AdminDashboard() {
  const { country } = useCurrency()
  const { addToast } = useToast()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()

  const stats = [
    { label: 'Total Towers', value: '4', icon: Building, from: '#1d4ed8', to: '#1e40af' },
    { label: 'Tower Admins', value: '4', icon: Users, from: '#065f46', to: '#064e3b' },
    { label: 'Active Meters', value: '238', icon: CheckCircle, from: '#92400e', to: '#78350f' },
    { label: 'Offline Meters', value: '6', icon: XCircle, from: '#991b1b', to: '#7f1d1d' },
    { label: 'Monthly Revenue', value: `${sym}4,52,350`, icon: Wallet, from: '#4c1d95', to: '#3b0764' },
    { label: 'Pending Payments', value: '38', icon: Clock, from: '#9a3412', to: '#7c2d12' },
    { label: 'Critical Alarms', value: '12', icon: AlertTriangle, from: '#9d174d', to: '#831843' },
    { label: 'Open Complaints', value: '5', icon: MessageSquare, from: '#1e3a5f', to: '#1e3a8a' },
  ]

  const bessStats = [
    { label: 'BESS Units', value: '12', sub: 'Active', color: '#3b82f6', icon: Battery },
    { label: 'Avg SOC', value: '74%', sub: 'Charging', color: '#22c55e', icon: Zap },
    { label: 'Solar Gen', value: '58.2 kWh', sub: 'Today', color: '#f59e0b', icon: Sun },
    { label: 'Peak Shaved', value: '24.5 kW', sub: 'This month', color: '#ec4899', icon: Activity },
    { label: 'CO₂ Offset', value: '1,247 kg', sub: 'This month', color: '#10b981', icon: Leaf },
    { label: 'Efficiency', value: '91.5%', sub: 'Round-trip', color: '#8b5cf6', icon: TrendingUp },
  ]

  const bessFleet = [
    { id: 'BESS-001', location: 'Tower A', soc: 82, health: 98, temp: 31, status: 'Healthy', solar: 5.2, load: 4.8 },
    { id: 'BESS-002', location: 'Tower B', soc: 64, health: 96, temp: 34, status: 'Healthy', solar: 4.1, load: 6.2 },
    { id: 'BESS-003', location: 'Tower C', soc: 91, health: 99, temp: 29, status: 'Healthy', solar: 6.8, load: 3.5 },
    { id: 'BESS-004', location: 'Common Area', soc: 45, health: 94, temp: 36, status: 'Degraded', solar: 2.1, load: 8.5 },
    { id: 'BESS-005', location: 'Parking', soc: 78, health: 97, temp: 32, status: 'Healthy', solar: 3.9, load: 5.1 },
  ]

  const bessColumns = [
    { key: 'id', label: 'Unit ID' },
    { key: 'location', label: 'Location' },
    { key: 'soc', label: 'SOC', render: (v) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs font-bold">{v}%</span>
      </div>
    ) },
    { key: 'health', label: 'Health' },
    { key: 'temp', label: 'Temp', render: (v) => <span className={v > 35 ? 'text-amber-400 font-bold' : 'text-gray-300'}>{v}°C</span> },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> },
  ]

  const meterStatus = [
    { status: 'Online', count: 148, color: '#10b981' },
    { status: 'Offline', count: 6, color: '#ef4444' },
    { status: 'Comm Lost', count: 3, color: '#f97316' },
    { status: 'Low Balance', count: 12, color: '#eab308' },
  ]

  const consumerData = [
    { flat: '301-A', owner: 'Rajesh Kumar', meterId: 'MTR-001', status: 'Active', balance: `${sym}2,450` },
    { flat: '302-A', owner: 'Priya Singh', meterId: 'MTR-002', status: 'Active', balance: `-${sym}1,250` },
    { flat: '303-A', owner: 'Amit Patel', meterId: 'MTR-003', status: 'Inactive', balance: `${sym}5,000` },
    { flat: '401-B', owner: 'Neha Gupta', meterId: 'MTR-004', status: 'Active', balance: `${sym}3,200` },
    { flat: '402-B', owner: 'Vikram Singh', meterId: 'MTR-005', status: 'Active', balance: `${sym}1,850` },
    { flat: '403-B', owner: 'Suresh Mehta', meterId: 'MTR-006', status: 'Active', balance: `${sym}4,100` },
    { flat: '501-C', owner: 'Anita Sharma', meterId: 'MTR-007', status: 'Active', balance: `${sym}980` },
    { flat: '502-C', owner: 'Ravi Kapoor', meterId: 'MTR-008', status: 'Inactive', balance: `-${sym}2,400` },
  ]

  const consumerColumns = [
    { key: 'flat', label: 'Flat' },
    { key: 'owner', label: 'Owner' },
    { key: 'meterId', label: 'Meter ID' },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> },
    { key: 'balance', label: 'Balance', render: (v) => <span className={String(v).startsWith('-') ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{v}</span> },
  ]

  const billingData = [
    { month: 'Jan', generated: 245, pending: 23, paid: 222 },
    { month: 'Feb', generated: 245, pending: 18, paid: 227 },
    { month: 'Mar', generated: 245, pending: 22, paid: 223 },
    { month: 'Apr', generated: 245, pending: 16, paid: 229 },
    { month: 'May', generated: 245, pending: 20, paid: 225 },
    { month: 'Jun', generated: 245, pending: 38, paid: 207 },
  ]

  const revenueData = [
    { day: 'Mon', collection: 45000 },
    { day: 'Tue', collection: 52000 },
    { day: 'Wed', collection: 48000 },
    { day: 'Thu', collection: 61000 },
    { day: 'Fri', collection: 55000 },
    { day: 'Sat', collection: 58000 },
    { day: 'Sun', collection: 35000 },
  ]

  const bessEnergyData = [
    { hour: '00:00', grid: 12, solar: 0, battery: -8, load: 20 },
    { hour: '04:00', grid: 10, solar: 0, battery: -6, load: 16 },
    { hour: '08:00', grid: 8, solar: 15, battery: 10, load: 13 },
    { hour: '12:00', grid: 2, solar: 35, battery: 20, load: 17 },
    { hour: '16:00', grid: 5, solar: 25, battery: 5, load: 15 },
    { hour: '20:00', grid: 18, solar: 0, battery: -12, load: 30 },
  ]

  const complaintData = [
    { id: '#C-001', flat: '301-A', issue: 'High Reading', assigned: 'Rajesh', status: 'Open' },
    { id: '#C-002', flat: '302-A', issue: 'Meter Not Working', assigned: 'Priya', status: 'In Progress' },
    { id: '#C-003', flat: '303-A', issue: 'Billing Dispute', assigned: 'Admin', status: 'Resolved' },
  ]

  const alertData = [
    { id: 1, type: 'BESS Overheat', source: 'BESS-004', priority: 'Critical', icon: Flame },
    { id: 2, type: 'High Consumption', source: '3 meters', priority: 'High', icon: AlertTriangle },
    { id: 3, type: 'Meter Offline', source: '6 meters', priority: 'Critical', icon: XCircle },
    { id: 4, type: 'Solar Array Fault', source: 'BESS-002', priority: 'High', icon: Sun },
    { id: 5, type: 'Communication Failure', source: '3 meters', priority: 'High', icon: Wifi },
    { id: 6, type: 'Battery Low SOC', source: 'BESS-004', priority: 'Medium', icon: Battery },
  ]

  const CARD = 'rounded-2xl p-5 border'
  const DARK_CARD = `${CARD} dark-card border-[rgba(255,255,255,0.06)]`

  return (
    <div className="admin-page p-6 space-y-6 animate-fade-in">

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

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">ABC Residency · Society management & BESS analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => addToast('Report exported successfully', 'success')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
            <Download size={13} /> Export
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 dark-row px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.06)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live · Updated just now
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-4 relative overflow-hidden keep-white"
            style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>
            <div className="absolute right-3 top-3 opacity-20"><s.icon size={24} className="text-white" /></div>
            <p className="text-xs text-white/70 font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* BESS Fleet Overview — NEW */}
      <div className={DARK_CARD}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Battery size={18} className="text-blue-400" />
            <h2 className="text-base font-bold text-white">BESS Fleet Overview</h2>
          </div>
          <button onClick={() => addToast('Navigating to BESS details (demo)', 'info')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-all">
            View Details <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {bessStats.map((s, i) => (
            <div key={i} className="rounded-xl p-3 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={14} style={{ color: s.color }} />
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* BESS Fleet Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  {['Unit ID', 'Location', 'SOC', 'Health', 'Temp', 'Status'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bessFleet.map((row, i) => (
                  <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)] transition-all">
                    <td className="py-3 px-3 text-white font-semibold text-sm font-mono">{row.id}</td>
                    <td className="py-3 px-3 text-gray-300 text-sm">{row.location}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${row.soc}%` }} />
                        </div>
                        <span className="text-xs font-bold">{row.soc}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold text-sm">{row.health}%</td>
                    <td className={`py-3 px-3 text-sm font-bold ${row.temp > 35 ? 'text-amber-400' : 'text-gray-300'}`}>{row.temp}°C</td>
                    <td className="py-3 px-3"><Badge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Energy Flow Chart */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">24h Energy Flow</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={bessEnergyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="hour" stroke={axisStroke} tick={{ fontSize: 10, fill: tickFill }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 10, fill: tickFill }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="grid" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Grid" />
                <Area type="monotone" dataKey="solar" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Solar" />
                <Area type="monotone" dataKey="battery" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Battery" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Meter status + billing monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={DARK_CARD}>
          <h2 className="text-base font-bold text-white mb-4">Live Meter Status</h2>
          <div className="space-y-3">
            {meterStatus.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300 font-medium">{m.status}</span>
                    <span className="text-sm font-bold text-white">{m.count}</span>
                  </div>
                  <div className="h-1.5 dark-row rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(m.count / 169) * 100}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={DARK_CARD}>
          <h2 className="text-base font-bold text-white mb-4">Billing Monitor</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Generated', value: 245, from: '#1d4ed8', to: '#1e40af' },
              { label: 'Pending', value: 38, from: '#c2410c', to: '#9a3412' },
              { label: 'Paid', value: 207, from: '#065f46', to: '#064e3b' },
              { label: 'Overdue', value: 15, from: '#9b1c1c', to: '#7f1d1d' },
            ].map((b, i) => (
              <div key={i} className="rounded-xl p-3 keep-white"
                style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})`, border: `1px solid ${b.from}40` }}>
                <p className="text-xs text-white/70 font-medium">{b.label}</p>
                <p className="text-2xl font-extrabold text-white">{b.value}</p>
              </div>
            ))}
          </div>
          <button onClick={() => addToast('Bills generated for June 2024', 'success')}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all bg-gradient-to-br from-amber-600 to-amber-700">
            Generate Bills
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={DARK_CARD}>
          <h2 className="text-base font-bold text-white mb-4">Billing Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={billingData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="month" stroke={axisStroke} tick={{ fontSize: 11, fill: tickFill }} />
              <YAxis stroke={axisStroke} tick={{ fontSize: 11, fill: tickFill }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="generated" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="paid" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={DARK_CARD}>
          <h2 className="text-base font-bold text-white mb-4">Revenue Collection</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" stroke={axisStroke} tick={{ fontSize: 11, fill: tickFill }} />
              <YAxis stroke={axisStroke} tick={{ fontSize: 11, fill: tickFill }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="collection" stroke="#8b5cf6" strokeWidth={2.5}
                dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consumer table using DataTable */}
      <div className={DARK_CARD}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Consumer Summary</h2>
          <span className="text-[10px] font-bold text-gray-400">{consumerData.length} records</span>
        </div>
        <DataTable data={consumerData} columns={consumerColumns} searchable sortable pageSize={5} />
      </div>

      {/* Complaints + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={DARK_CARD}>
          <h2 className="text-base font-bold text-white mb-4">Recent Complaints</h2>
          <div className="space-y-2">
            {complaintData.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.05)]">
                <div>
                  <p className="text-sm font-semibold text-white">{c.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.flat} · {c.issue}</p>
                </div>
                <Badge status={c.status} />
              </div>
            ))}
          </div>
        </div>

        <div className={DARK_CARD}>
          <h2 className="text-base font-bold text-white mb-4">Critical Alerts</h2>
          <div className="space-y-2">
            {alertData.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-3">
                  <span className="text-white/70"><a.icon size={20} /></span>
                  <div>
                    <p className="text-sm font-semibold text-white">{a.type}</p>
                    <p className="text-xs text-gray-400">{a.source}</p>
                  </div>
                </div>
                <Badge status={a.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
