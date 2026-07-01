import { useState } from 'react'
import {
  Zap, FileText, Wallet, TrendingUp, TrendingDown, AlertTriangle, Plus, ArrowRight, Megaphone,
  Sun, Battery, Activity, Leaf, ChevronRight, BarChart3
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import BessPowerFlow from '../components/BessPowerFlow'
import SolarTracker from '../components/SolarTracker'
import CarbonCard from '../components/CarbonCard'
import { useToast } from '../components/ToastProvider'

const TODAY_FULL = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const GREETING = (() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening' })()

function ProgressRing({ pct, size = 80, stroke = 7, color = '#ef4444', trackColor = 'rgba(255,255,255,0.15)' }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="rotate-[-90deg]" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}

function Sparkline({ data, color = '#3b82f6' }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / max) * 100}%`, background: color, opacity: i === data.length - 1 ? 1 : 0.4 }} />
      ))}
    </div>
  )
}

export default function DashboardPage({ onNavigate, unreadCount, userRole = 'resident', walletBalance = 2450.50 }) {
  const { country } = useCurrency()
  const { addToast } = useToast()
  const sym = country.symbol
  const [monthlySpend] = useState(3250.75)
  const [lastMonthSpend] = useState(2890.50)
  const spendingChange = ((monthlySpend - lastMonthSpend) / lastMonthSpend * 100).toFixed(1)
  const balancePct = Math.min(100, Math.round((walletBalance / 5000) * 100))
  const ringColor = walletBalance < 1000 ? '#ef4444' : walletBalance < 3000 ? '#f59e0b' : '#22c55e'
  const [batterySoc] = useState(78)
  const [solarGen] = useState(4.8)
  const [gridImport] = useState(2.4)
  const [loadDemand] = useState(6.0)
  const [systemEfficiency] = useState(91.5)
  const [carbonSaved] = useState(2847)
  const [treesEq] = useState(142)

  const notices = [
    { date: 'Today, 10:30 AM', title: 'Scheduled Maintenance', tag: 'Urgent', accent: '#ef4444' },
    { date: 'Yesterday, 3:15 PM', title: 'Water Supply Interruption', tag: 'Alert', accent: '#f59e0b' },
    { date: '2 days ago', title: 'Society Annual Meeting', tag: 'General', accent: '#3b82f6' },
  ]
  const usageTrend = [8.2, 10.5, 9.8, 12.1, 11.3, 14.5, 12.8]
  const spendTrend = [220, 290, 265, 320, 305, 380, 325]
  const pendingTrend = [2, 1, 2, 1, 1, 2, 1]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">{GREETING}, Rajesh</h2>
          <p className="text-sm text-gray-500 mt-0.5">Tower A · Flat 302 · Galaxy Apartments</p>
          <p className="text-xs text-gray-400 mt-0.5">{TODAY_FULL}</p>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-200 flex-shrink-0 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live
        </span>
      </div>

      {/* Wallet hero */}
      {userRole === 'resident' && (
        <div className="keep-white relative rounded-3xl p-6 mb-6 overflow-hidden text-white shadow-glow-blue bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-500">
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(255,255,255,0.08),transparent 70%)' }} />
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Wallet Balance</p>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 border border-white/20 flex items-center gap-0.5"><Zap size={10} /> Grid</span>
              </div>
              <div className="text-5xl font-extrabold tracking-tight mb-1">{sym}{walletBalance.toFixed(0)}</div>
              <p className="text-blue-200 text-[11px] mb-5">Updated today · 2:45 PM</p>
              <div className="flex gap-3">
                <button onClick={() => onNavigate('payment')}
                  className="flex-1 bg-white text-blue-700 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-md flex items-center justify-center gap-1.5">
                  <Plus size={15} /> Add Money
                </button>
                <button onClick={() => onNavigate('wallet')}
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
                  className="flex-1 py-2.5 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-1.5 hover:opacity-90">
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <div className="relative flex-shrink-0 ml-4">
              <ProgressRing pct={balancePct} size={84} stroke={7} color={ringColor} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-white leading-none">{balancePct}%</span>
                <span className="text-[9px] text-blue-200 font-medium leading-none mt-0.5">health</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BESS Status Grid — NEW */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <Zap size={18} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">BESS Energy Status</h3>
              <p className="text-xs text-gray-400">Real-time battery storage system</p>
            </div>
          </div>
          <button onClick={() => onNavigate('energy-flow')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
            View Flow <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-blue-50 p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Battery size={14} className="text-blue-600" />
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Battery SOC</span>
            </div>
            <p className="text-2xl font-extrabold text-blue-700">{batterySoc}%</p>
            <div className="h-1.5 bg-blue-200 rounded-full overflow-hidden mt-1">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${batterySoc}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <Sun size={14} className="text-amber-600" />
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Solar Gen</span>
            </div>
            <p className="text-2xl font-extrabold text-amber-700">{solarGen} <span className="text-sm">kW</span></p>
            <p className="text-[10px] text-amber-500 font-bold">28.5 kWh today</p>
          </div>
          <div className="rounded-xl bg-green-50 p-3 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-green-600" />
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Grid Import</span>
            </div>
            <p className="text-2xl font-extrabold text-green-700">{gridImport} <span className="text-sm">kW</span></p>
            <p className="text-[10px] text-green-500 font-bold">↓ 12% vs avg</p>
          </div>
          <div className="rounded-xl bg-red-50 p-3 border border-red-100">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={14} className="text-red-600" />
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Load Demand</span>
            </div>
            <p className="text-2xl font-extrabold text-red-700">{loadDemand} <span className="text-sm">kW</span></p>
            <p className="text-[10px] text-red-500 font-bold">Normal range</p>
          </div>
        </div>

        {/* Mini Power Flow */}
        <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
          <BessPowerFlow compact />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Efficiency</p>
            <p className="text-lg font-extrabold text-purple-600">{systemEfficiency}%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CO₂ Saved</p>
            <p className="text-lg font-extrabold text-green-600">{carbonSaved.toLocaleString()} <span className="text-xs">kg</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trees Eq</p>
            <p className="text-lg font-extrabold text-emerald-600">{treesEq}</p>
          </div>
        </div>
      </div>

      {/* Quick BESS actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { id: 'energy-flow', Icon: BarChart3, label: 'Energy Flow', sub: 'Live diagram', color: '#8b5cf6' },
          { id: 'battery-health', Icon: Battery, label: 'Battery', sub: 'Health & cells', color: '#3b82f6' },
          { id: 'meter', Icon: Zap, label: 'Smart Meter', sub: 'Live usage', color: '#0066FF' },
        ].map(link => (
          <button key={link.id} onClick={() => onNavigate(link.id)}
            className="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 active:scale-95 text-left border border-gray-100 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={{ background: `${link.color}18` }}>
              <link.Icon size={18} style={{ color: link.color }} />
            </div>
            <p className="font-bold text-gray-900 text-sm">{link.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{link.sub}</p>
          </button>
        ))}
      </div>

      {/* Today's Usage */}
      <div className="rounded-2xl p-4 mb-6 flex items-center gap-4 border bg-green-50 dark:bg-emerald-900/20 border-green-200 dark:border-emerald-700/30">
        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-white keep-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-green-800 dark:text-emerald-300">Today's Usage</p>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-emerald-400 bg-green-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />LIVE
            </span>
          </div>
          <p className="text-xs text-green-700 dark:text-emerald-400">Meter reading updating in real-time</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-extrabold text-green-800 dark:text-emerald-300">12.8</p>
          <p className="text-[11px] font-semibold text-green-600 dark:text-emerald-400">kWh</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="This Month" value="287 kWh" sub="+12% vs last" subColor="text-orange-500" accent="border-orange-400" trend={usageTrend} trendColor="#f97316" />
        <StatCard label="Spent" value={`${sym}${monthlySpend.toFixed(0)}`}
          sub={`${spendingChange > 0 ? '↑' : '↓'} ${Math.abs(spendingChange)}%`}
          subColor={spendingChange > 0 ? 'text-red-500' : 'text-green-500'}
          accent="border-green-400" trend={spendTrend} trendColor="#22c55e" />
        <StatCard label="Pending" value="1 bill" sub={`${sym}4,285`} subColor="text-blue-500" accent="border-blue-400" trend={pendingTrend} trendColor="#3b82f6" />
      </div>

      {/* Secondary quick links */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { id: 'wallet', Icon: Wallet, label: 'Transactions', sub: 'History', color: '#059669' },
          { id: 'invoices', Icon: FileText, label: 'Invoices', sub: 'Bills', color: '#7c3aed' },
          { id: 'solar', Icon: Sun, label: 'Solar', sub: 'Generation', color: '#f59e0b' },
        ].map(link => (
          <button key={link.id} onClick={() => onNavigate(link.id)}
            className="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 active:scale-95 text-left border border-gray-100 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={{ background: `${link.color}18` }}>
              <link.Icon size={18} style={{ color: link.color }} />
            </div>
            <p className="font-bold text-gray-900 text-sm">{link.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{link.sub}</p>
          </button>
        ))}
      </div>

      {/* Notice Board */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-gray-700" />
            <h3 className="font-bold text-gray-900 text-sm">Notice Board</h3>
          </div>
          <button onClick={() => onNavigate('notifications')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2.5">
          {notices.map((n, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: n.accent }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{n.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-white rounded-lg border border-gray-200 text-gray-600 flex-shrink-0">{n.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Low balance alert */}
      {walletBalance < 5000 && (
        <div className="rounded-2xl p-4 border-2 flex items-center gap-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/30">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-red-800 dark:text-red-300 text-sm">Low Balance Alert</p>
            <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">Balance below {sym}5,000. Add money to avoid interruption.</p>
          </div>
          <button onClick={() => onNavigate('payment')}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all whitespace-nowrap keep-white">
            Add Now
          </button>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub, subColor, accent, trend, trendColor }) {
  const isUp = sub.includes('↑') || sub.includes('+')
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-card border-b-2 dark:border-b border-gray-100 dark:border-slate-700 ${accent} overflow-hidden`}>
      <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-2 truncate">{label}</p>
      <p className="text-[15px] font-extrabold text-gray-900 dark:text-white leading-tight mb-1">{value}</p>
      <div className="flex items-center gap-1 mb-3">
        {isUp ? <TrendingUp size={11} className="flex-shrink-0" style={{ color: trendColor }} />
          : <TrendingDown size={11} className="flex-shrink-0 text-red-400" />}
        <p className={`text-[11px] font-semibold ${subColor} truncate`}>{sub}</p>
      </div>
      <Sparkline data={trend} color={trendColor} />
    </div>
  )
}
