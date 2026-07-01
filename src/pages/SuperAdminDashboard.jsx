import { useState } from 'react'
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts'
import { useCurrency } from '../context/CurrencyContext'
import DataTable from '../components/DataTable'
import { useToast } from '../components/ToastProvider'
import { useChartTheme } from '../utils/chartTheme'

const ServiceDot = ({ color, healthy }) => (
  <span className="relative flex-shrink-0">
    <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: color }} />
    {healthy && <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: color }} />}
  </span>
)

export default function SuperAdminDashboard() {
  const { country } = useCurrency()
  const { addToast } = useToast()
  const sym = country.symbol
  const { tooltipStyleSuperAdmin, gridStrokeSA, axisStrokeSA, tickFill } = useChartTheme()

  const stats = [
    { label: 'Total Projects', value: '12', icon: '🏢', from: '#1d4ed8', to: '#1e40af' },
    { label: 'Total Admins', value: '24', icon: '👨‍💼', from: '#5b21b6', to: '#4c1d95' },
    { label: 'Total Consumers', value: '5,420', icon: '👥', from: '#065f46', to: '#064e3b' },
    { label: 'Online Meters', value: '5,234', icon: '✅', from: '#065f46', to: '#064e3b' },
    { label: 'Offline Meters', value: '186', icon: '❌', from: '#991b1b', to: '#7f1d1d' },
    { label: "Today's Revenue", value: `${sym}8,45,200`, icon: '💰', from: '#78350f', to: '#92400e' },
    { label: 'Platform Health', value: '98.5%', icon: '❤️', from: '#9d174d', to: '#831843' },
    { label: 'Server Status', value: 'Healthy', icon: '🟢', from: '#064e3b', to: '#065f46' },
  ]

  const bessPlatformStats = [
    { label: 'BESS Fleet', value: '156', sub: 'Units across 12 projects', color: '#3b82f6', icon: '🔋' },
    { label: 'Total Storage', value: '312 MWh', sub: 'Installed capacity', color: '#8b5cf6', icon: '⚡' },
    { label: 'Solar Capacity', value: '1.8 MWp', sub: 'PV arrays', color: '#f59e0b', icon: '☀️' },
    { label: 'CO₂ Offset', value: '48,520 kg', sub: 'This month', color: '#10b981', icon: '🌱' },
    { label: 'Peak Shaved', value: '245 kW', sub: 'Demand reduction', color: '#ec4899', icon: '📉' },
    { label: 'Arbitrage', value: `${sym}1,24,000`, sub: 'Monthly savings', color: '#22c55e', icon: '💹' },
  ]

  const bessFleet = [
    { project: 'ABC Residency', units: 12, totalSoc: 78, avgHealth: 97, solarToday: 245, peakShave: 18, status: 'Healthy' },
    { project: 'XYZ Towers', units: 34, totalSoc: 82, avgHealth: 98, solarToday: 620, peakShave: 45, status: 'Healthy' },
    { project: 'Elite Heights', units: 18, totalSoc: 64, avgHealth: 94, solarToday: 310, peakShave: 22, status: 'Degraded' },
    { project: 'Green Valley', units: 21, totalSoc: 91, avgHealth: 99, solarToday: 385, peakShave: 28, status: 'Healthy' },
    { project: 'Sunrise Park', units: 15, totalSoc: 55, avgHealth: 92, solarToday: 180, peakShave: 15, status: 'Degraded' },
  ]

  const bessFleetColumns = [
    { key: 'project', label: 'Project' },
    { key: 'units', label: 'Units' },
    { key: 'totalSoc', label: 'Avg SOC', render: (v) => (
      <div className="flex items-center gap-2">
        <div className="w-12 h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs font-bold">{v}%</span>
      </div>
    ) },
    { key: 'avgHealth', label: 'Health' },
    { key: 'solarToday', label: 'Solar (kWh)' },
    { key: 'peakShave', label: 'Peak Shave' },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
        v === 'Healthy' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      }`}>{v}</span>
    ) },
  ]

  const systemServices = [
    { name: 'Database', status: 'Healthy', color: '#10b981', ok: true },
    { name: 'API Gateway', status: 'Healthy', color: '#10b981', ok: true },
    { name: 'MQTT Broker', status: 'Healthy', color: '#10b981', ok: true },
    { name: 'Redis Cache', status: 'Degraded', color: '#f59e0b', ok: false },
    { name: 'Kafka Stream', status: 'Healthy', color: '#10b981', ok: true },
    { name: 'Payment Gateway', status: 'Healthy', color: '#10b981', ok: true },
  ]

  const projectData = [
    { name: 'ABC Residency', meters: 120, admins: 2, health: 'Healthy', city: 'Delhi' },
    { name: 'XYZ Towers', meters: 340, admins: 3, health: 'Healthy', city: 'Noida' },
    { name: 'Elite Heights', meters: 180, admins: 2, health: 'Degraded', city: 'Gurgaon' },
    { name: 'Green Valley', meters: 210, admins: 2, health: 'Healthy', city: 'Lucknow' },
  ]

  const revenueData = [
    { month: 'Jan', revenue: 145000 },
    { month: 'Feb', revenue: 152000 },
    { month: 'Mar', revenue: 148000 },
    { month: 'Apr', revenue: 161000 },
    { month: 'May', revenue: 155000 },
    { month: 'Jun', revenue: 168000 },
  ]

  const energyArbitrageData = [
    { day: 'Mon', chargeCost: 12000, dischargeRevenue: 18500, net: 6500 },
    { day: 'Tue', chargeCost: 11500, dischargeRevenue: 19200, net: 7700 },
    { day: 'Wed', chargeCost: 13000, dischargeRevenue: 17800, net: 4800 },
    { day: 'Thu', chargeCost: 11000, dischargeRevenue: 21000, net: 10000 },
    { day: 'Fri', chargeCost: 12500, dischargeRevenue: 19500, net: 7000 },
    { day: 'Sat', chargeCost: 10500, dischargeRevenue: 16000, net: 5500 },
    { day: 'Sun', chargeCost: 9500, dischargeRevenue: 14500, net: 5000 },
  ]

  const meterFleetData = [
    { name: 'Online', value: 5234, color: '#10b981' },
    { name: 'Offline', value: 186, color: '#ef4444' },
    { name: 'Firmware Pending', value: 340, color: '#f59e0b' },
  ]

  const bessStatusPie = [
    { name: 'Healthy', value: 128, color: '#10b981' },
    { name: 'Degraded', value: 18, color: '#f59e0b' },
    { name: 'Maintenance', value: 10, color: '#3b82f6' },
  ]

  const auditLogs = [
    { action: 'Changed Tariff', user: 'Rajesh Kumar', timestamp: '10:45 AM', severity: 'High' },
    { action: 'Deleted User', user: 'Priya Singh', timestamp: '11:22 AM', severity: 'High' },
    { action: 'Generated Bills', user: 'System', timestamp: '12:00 PM', severity: 'Medium' },
    { action: 'Created Admin', user: 'Admin', timestamp: '2:30 PM', severity: 'High' },
    { action: 'Exported Report', user: 'Finance Team', timestamp: '3:45 PM', severity: 'Low' },
  ]

  const adminManagement = [
    { name: 'Rajesh Kumar', project: 'ABC Residency', users: 120, status: 'Active', lastLogin: '5 min' },
    { name: 'Priya Singh', project: 'XYZ Towers', users: 340, status: 'Active', lastLogin: '2 hours' },
    { name: 'Amit Patel', project: 'Elite Heights', users: 180, status: 'Inactive', lastLogin: '1 day' },
  ]

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(139,92,246,0.15)] dark-card'

  const severityStyle = {
    High: 'bg-red-500/15 text-red-400 border border-red-500/25',
    Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    Low: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  }

  return (
    <div className="admin-page p-6 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Complete system monitoring, BESS fleet & management</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => addToast('Platform report exported', 'success')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
            Export
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 dark-card px-3 py-2 rounded-xl border border-[rgba(139,92,246,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-4 relative overflow-hidden keep-white"
            style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>
            <div className="absolute right-3 top-3 text-2xl opacity-20">{s.icon}</div>
            <p className="text-xs text-white/70 font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* BESS Platform Overview — NEW */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔋</span>
            <h2 className="text-base font-bold text-white">BESS Platform Analytics</h2>
          </div>
          <span className="text-[10px] font-bold text-gray-400">156 units · 12 projects</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {bessPlatformStats.map((s, i) => (
            <div key={i} className="rounded-xl p-3 border border-slate-200 dark:border-[rgba(139,92,246,0.15)] bg-slate-50 dark:bg-[rgba(139,92,246,0.05)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{s.icon}</span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Energy Arbitrage Chart */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Energy Arbitrage (7-day)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={energyArbitrageData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeSA} />
                <XAxis dataKey="day" stroke={axisStrokeSA} tick={{ fontSize: 10, fill: tickFill }} />
                <YAxis stroke={axisStrokeSA} tick={{ fontSize: 10, fill: tickFill }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyleSuperAdmin} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="chargeCost" fill="#ef4444" radius={[4, 4, 0, 0]} name="Charge Cost" />
                <Bar dataKey="dischargeRevenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Discharge Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* BESS Fleet Status Pie */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">BESS Fleet Status</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={bessStatusPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {bessStatusPie.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-4">
                {bessStatusPie.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-xs text-gray-400">{item.name}</p>
                      <p className="text-base font-bold text-white">{item.value} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BESS Fleet Table */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Project BESS Fleet</h2>
          <span className="text-[10px] font-bold text-gray-400">5 projects</span>
        </div>
        <DataTable data={bessFleet} columns={bessFleetColumns} searchable sortable pageSize={5} />
      </div>

      {/* System services + Project health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">System Services</h2>
          <div className="space-y-2">
            {systemServices.map((svc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl dark-row border border-[rgba(255,255,255,0.04)]">
                <span className="text-sm font-medium text-gray-200">{svc.name}</span>
                <div className="flex items-center gap-2">
                  <ServiceDot color={svc.color} healthy={svc.ok} />
                  <span className="text-xs font-semibold" style={{ color: svc.color }}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Project Health</h2>
          <div className="space-y-3">
            {projectData.map((p, i) => (
              <div key={i} className="p-3 rounded-xl dark-row border border-[rgba(255,255,255,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${
                    p.health === 'Healthy'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {p.health}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[['Meters', p.meters], ['Admins', p.admins], ['City', p.city]].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-gray-500">{k}</p>
                      <p className="text-gray-200 font-bold">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue chart + Meter fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Platform Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeSA} />
              <XAxis dataKey="month" stroke={axisStrokeSA} tick={{ fontSize: 11, fill: tickFill }} />
              <YAxis stroke={axisStrokeSA} tick={{ fontSize: 11, fill: tickFill }} />
              <Tooltip contentStyle={tooltipStyleSuperAdmin} />
              <Line type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={2.5}
                dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }} activeDot={{ r: 7, fill: '#c4b5fd' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Meter Fleet Status</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={meterFleetData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {meterFleetData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              {meterFleetData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-xs text-gray-400">{item.name}</p>
                    <p className="text-base font-bold text-white">{item.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin management */}
      <div className={CARD}>
        <h2 className="text-base font-bold text-white mb-4">Admin Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                {['Admin Name', 'Project', 'Users', 'Status', 'Last Login'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminManagement.map((a, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(139,92,246,0.04)] transition-all">
                  <td className="py-3 px-3 text-white font-semibold text-sm">{a.name}</td>
                  <td className="py-3 px-3 text-gray-300 text-sm">{a.project}</td>
                  <td className="py-3 px-3 text-white font-bold">{a.users}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                      a.status === 'Active'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{a.lastLogin} ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit logs */}
      <div className={CARD}>
        <h2 className="text-base font-bold text-white mb-4">Recent Audit Logs</h2>
        <div className="space-y-2">
          {auditLogs.map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl dark-row border-l-2 border-purple-600 border border-[rgba(255,255,255,0.04)]">
              <div>
                <p className="text-sm font-semibold text-white">{log.action}</p>
                <p className="text-xs text-gray-400 mt-0.5">By <span className="text-gray-300">{log.user}</span> · {log.timestamp}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${severityStyle[log.severity]}`}>
                {log.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
