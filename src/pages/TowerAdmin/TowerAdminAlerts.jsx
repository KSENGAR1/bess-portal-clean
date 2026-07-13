import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const INIT = [
  { id:1, flat:'103-A', resident:'Amit Patel',    type:'Meter Offline',     priority:'Critical', msg:'No data from MTR-003 for 3+ hours.',         time:'Today 9:30 AM',  ack:false },
  { id:2, flat:'202-A', resident:'Vikram Singh',  type:'Low Balance',       priority:'High',     msg:'Wallet balance below ₹500. Bill due in 3 days.', time:'Today 8:15 AM',  ack:false },
  { id:3, flat:'301-A', resident:'Ravi Verma',    type:'High Consumption',  priority:'High',     msg:'Load exceeding 90% of sanctioned 8kW limit.', time:'Today 7:45 AM',  ack:false },
  { id:4, flat:'102-A', resident:'Priya Singh',   type:'Negative Balance',  priority:'Medium',   msg:'Resident has overdue balance of ₹1,250.',     time:'Yesterday',      ack:true  },
  { id:5, flat:'201-A', resident:'Neha Gupta',    type:'Tamper Detected',   priority:'Critical', msg:'Possible meter tampering on MTR-004.',         time:'Jun 28 11:00 AM',ack:true  },
]

const PRI = {
  Critical: { badge:'bg-red-500/15 text-red-400 border-red-500/30',     bar:'bg-red-500',    icon:'🚨' },
  High:     { badge:'bg-orange-500/15 text-orange-400 border-orange-500/30', bar:'bg-orange-500', icon:'⚠️' },
  Medium:   { badge:'bg-amber-500/15 text-amber-400 border-amber-500/30',  bar:'bg-amber-400',  icon:'🔔' },
}

export default function TowerAdminAlerts() {
  const { addToast } = useToast()
  const [alerts, setAlerts] = useState(INIT)
  const [filter, setFilter] = useState('All')

  const ack = id => { setAlerts(p => p.map(a => a.id === id ? {...a, ack:true} : a)); addToast('Alert acknowledged', 'success') }
  const ackAll = () => { setAlerts(p => p.map(a => ({...a, ack:true}))); addToast('All alerts acknowledged', 'success') }

  const visible = filter === 'All' ? alerts
    : filter === 'Unacknowledged' ? alerts.filter(a => !a.ack)
    : alerts.filter(a => a.priority === filter)

  const unacked = alerts.filter(a => !a.ack).length
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Tower A — Alerts</h1>
          <p className="text-gray-400 text-sm mt-0.5">{unacked} unacknowledged alert{unacked !== 1 ? 's' : ''}</p>
        </div>
        {unacked > 0 && (
          <button onClick={ackAll}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)' }}>
            Acknowledge All ({unacked})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Critical', val: alerts.filter(a=>a.priority==='Critical').length, from:'#991b1b', to:'#7f1d1d' },
          { label:'High',     val: alerts.filter(a=>a.priority==='High').length,     from:'#9a3412', to:'#7c2d12' },
          { label:'Unacked',  val: unacked,                                           from:'#1e3a5f', to:'#1e3a8a' },
        ].map((s,i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All','Unacknowledged','Critical','High','Medium'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter === f ? 'text-white border-transparent' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}
                  style={filter === f ? { background:'linear-gradient(135deg,#0891b2,#0e7490)' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {visible.map(a => (
          <div key={a.id} className={`rounded-2xl border transition-all ${a.ack ? 'opacity-55 dark-card border-[rgba(255,255,255,0.04)]' : 'dark-card border-[rgba(255,255,255,0.1)]'}`}>
            <div className="flex items-start gap-3 p-4">
              <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${PRI[a.priority].bar}`} />
              <span className="text-xl flex-shrink-0">{PRI[a.priority].icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white font-bold text-sm">{a.type}</p>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${PRI[a.priority].badge}`}>{a.priority}</span>
                  {a.ack && <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-gray-500/15 text-gray-400 border border-gray-500/30">ACK</span>}
                </div>
                <p className="text-gray-300 text-sm">{a.msg}</p>
                <p className="text-gray-500 text-xs mt-1">Flat {a.flat} · {a.resident} · {a.time}</p>
              </div>
              {!a.ack && (
                <button onClick={() => ack(a.id)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                  Ack
                </button>
              )}
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-sm">No alerts in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
