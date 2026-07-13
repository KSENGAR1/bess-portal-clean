import { useState } from 'react'

const ALERTS = [
  { id: 1, society: 'Palm Springs',       priority: 'Critical', type: 'BESS Health', message: 'BESS-004 health degraded to 94%', time: '2 min ago', ack: false },
  { id: 2, society: 'ABC Residency',      priority: 'High',     type: 'Meter',       message: '6 meters offline in Tower A',      time: '15 min ago', ack: false },
  { id: 3, society: 'Royal Gardens',      priority: 'High',     type: 'Payment',     message: 'Payment collection below 90%',     time: '1 hour ago', ack: false },
  { id: 4, society: 'Sunrise Apartments', priority: 'Medium',   type: 'Meter',       message: 'High load detected in Block C',    time: '2 hours ago', ack: true },
  { id: 5, society: 'Green Valley',       priority: 'Critical', type: 'BESS Temp',   message: 'BESS-003 temperature 38°C',        time: '3 hours ago', ack: false },
  { id: 6, society: 'ABC Residency',      priority: 'Medium',   type: 'Billing',     message: 'Pending bills: 38 consumers',      time: '5 hours ago', ack: true },
  { id: 7, society: 'Palm Springs',       priority: 'High',     type: 'Meter',       message: 'Tamper alert on Meter MTR-045',    time: '6 hours ago', ack: false },
  { id: 8, society: 'Sunrise Apartments', priority: 'Low',      type: 'System',      message: 'Firmware update available',        time: '8 hours ago', ack: true },
]

const priorityStyle = {
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  High:     'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Medium:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Low:      'bg-blue-500/15 text-blue-400 border-blue-500/30',
}

const priorityAccent = {
  Critical: 'border-l-red-500',
  High:     'border-l-orange-500',
  Medium:   'border-l-amber-500',
  Low:      'border-l-blue-500',
}

export default function CompanyAdminAlerts() {
  const [alerts, setAlerts] = useState(ALERTS)
  const [filter, setFilter]   = useState('All')

  const visible = filter === 'All' ? alerts :
    filter === 'Unacknowledged' ? alerts.filter(a => !a.ack) :
    alerts.filter(a => a.priority === filter)

  const ackAlert = (id) => setAlerts(prev => prev.map(a => a.id === id ? {...a, ack: true} : a))
  const ackAll = () => setAlerts(prev => prev.map(a => ({...a, ack: true})))

  const unacked = alerts.filter(a => !a.ack).length
  const critCount = alerts.filter(a => a.priority === 'Critical').length
  const highCount = alerts.filter(a => a.priority === 'High').length

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert Center</h1>
          <p className="text-gray-400 text-sm mt-0.5">Monitor critical issues across all societies</p>
        </div>
        {unacked > 0 && (
          <button onClick={ackAll}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition-all">
            Acknowledge All ({unacked})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Critical',       value: critCount, from:'#991b1b', to:'#7f1d1d', icon:'🚨' },
          { label:'High Priority',  value: highCount, from:'#9a3412', to:'#7c2d12', icon:'⚠️' },
          { label:'Unacknowledged', value: unacked,   from:'#92400e', to:'#78350f', icon:'🔔' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <div className="absolute right-3 top-3 text-2xl opacity-20">{s.icon}</div>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All','Unacknowledged','Critical','High','Medium','Low'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter===f ? 'bg-emerald-600 text-white border-emerald-700' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {visible.map(a => (
          <div key={a.id} className={`rounded-2xl dark-card border-l-4 border border-[rgba(255,255,255,0.06)] p-4 ${priorityAccent[a.priority]}`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap flex-1">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${priorityStyle[a.priority]}`}>
                  {a.priority}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-[rgba(255,255,255,0.06)] text-gray-400 text-xs font-bold">
                  {a.type}
                </span>
                <span className="text-gray-500 text-xs">·</span>
                <span className="text-emerald-400 text-xs font-semibold">{a.society}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500">{a.time}</span>
                {!a.ack && (
                  <button onClick={()=>ackAlert(a.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition-all">
                    Acknowledge
                  </button>
                )}
                {a.ack && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    ✓ Ack
                  </span>
                )}
              </div>
            </div>
            <p className="text-white font-semibold text-sm">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
