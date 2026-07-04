import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'

const INIT_ALERTS = [
  { id: 1, type: 'Tamper Alarm',          meters: ['MTR-003'],                priority: 'Critical', icon: '🚨', description: 'Possible meter tampering detected at Flat 303-A', time: '10:45 AM', ack: false },
  { id: 2, type: 'Meter Offline',          meters: ['MTR-003','MTR-007','MTR-012','MTR-015','MTR-018','MTR-022'], priority: 'Critical', icon: '❌', description: 'No communication from 6 meters for > 2 hours', time: '9:30 AM',  ack: false },
  { id: 3, type: 'High Consumption',       meters: ['MTR-001','MTR-004','MTR-009'], priority: 'High',    icon: '🔥', description: 'Meters exceeding 90% of sanctioned load', time: '8:20 AM',  ack: false },
  { id: 4, type: 'Communication Failure',  meters: ['MTR-011','MTR-016','MTR-021'], priority: 'High',    icon: '📡', description: 'MQTT heartbeat missed for 3 meters', time: 'Yesterday', ack: true },
  { id: 5, type: 'Low Balance Warning',    meters: ['MTR-002','MTR-005','MTR-008','MTR-013','MTR-017','MTR-019','MTR-020','MTR-023','MTR-024','MTR-025','MTR-026','MTR-027'], priority: 'Medium', icon: '⚠️', description: `12 consumers have low balance`, time: 'Yesterday', ack: true },
  { id: 6, type: 'Low Voltage',            meters: ['MTR-006','MTR-014'],     priority: 'Medium',  icon: '⚡', description: 'Supply voltage below 200V threshold', time: '2 days ago', ack: true },
  { id: 7, type: 'Battery Low (Meter)',    meters: ['MTR-007','MTR-008','MTR-010','MTR-019','MTR-020'], priority: 'Medium', icon: '🔋', description: 'Meter backup battery below 20%', time: '2 days ago', ack: true },
]

const pri = {
  Critical: { badge: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',    bar: 'bg-red-500',    dot: '#ef4444' },
  High:     { badge: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30', bar: 'bg-orange-500', dot: '#f97316' },
  Medium:   { badge: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30', bar: 'bg-yellow-500', dot: '#eab308' },
}

export default function AdminAlerts() {
  const { country } = useCurrency()
  const sym = country.symbol
  const [alerts, setAlerts] = useState(INIT_ALERTS)
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const ack  = id => setAlerts(prev => prev.map(a => a.id === id ? {...a, ack:true} : a))
  const ackAll = () => setAlerts(prev => prev.map(a => ({...a, ack:true})))

  const visible = filter === 'All' ? alerts : alerts.filter(a =>
    filter === 'Unacknowledged' ? !a.ack : a.priority === filter
  )

  const unacked = alerts.filter(a => !a.ack).length
  const critCount = alerts.filter(a => a.priority==='Critical').length
  const highCount  = alerts.filter(a => a.priority==='High').length

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert Center</h1>
          <p className="text-gray-400 text-sm mt-0.5">Real-time system alerts</p>
        </div>
        {unacked > 0 && (
          <button onClick={ackAll}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-white bg-gray-100 dark:bg-[rgba(255,255,255,0.08)] border border-gray-200 dark:border-[rgba(255,255,255,0.1)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.12)] transition-all">
            Acknowledge All ({unacked})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Critical',       value: critCount, from:'#991b1b', to:'#7f1d1d', icon:'🚨' },
          { label:'High Priority',  value: highCount,  from:'#9a3412', to:'#7c2d12', icon:'⚠️' },
          { label:'Unacknowledged', value: unacked,    from:'#1e3a5f', to:'#1e3a8a', icon:'🔔' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <div className="absolute right-3 top-3 text-2xl opacity-20">{s.icon}</div>
            <p className="text-xs text-white/70 font-medium">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All','Unacknowledged','Critical','High','Medium'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter === f
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {visible.map(a => (
          <div key={a.id}
               className={`rounded-2xl border transition-all ${
                 a.ack
                   ? 'dark-card border-[rgba(255,255,255,0.05)] opacity-60'
                   : 'dark-card border-[rgba(255,255,255,0.1)] shadow-dark-card'
               }`}>
            <div className="flex items-start gap-3 p-4 cursor-pointer"
                 onClick={()=>setExpanded(expanded===a.id?null:a.id)}>
              {/* Priority bar */}
              <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${pri[a.priority].bar}`} />

              <span className="text-2xl flex-shrink-0">{a.icon}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <p className="text-white font-bold text-sm">{a.type}</p>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${pri[a.priority].badge}`}>
                    {a.priority}
                  </span>
                  {a.ack && (
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-gray-500/15 text-gray-400 border border-gray-500/30">
                      ACK
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1">{a.description}</p>
                <p className="text-gray-600 text-[10px] mt-1">{a.meters.length} meter{a.meters.length>1?'s':''} affected · {a.time}</p>
              </div>

              <span className="text-gray-400 dark:text-gray-600 text-lg mt-0.5">{expanded===a.id?'▲':'▼'}</span>
            </div>

            {expanded === a.id && (
              <div className="px-4 pb-4 space-y-3" onClick={e=>e.stopPropagation()}>
                {/* Affected meters */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Affected Meters</p>
                  <div className="flex flex-wrap gap-2">
                    {a.meters.map(m => (
                      <span key={m} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] text-gray-700 dark:text-gray-300 text-xs font-mono">{m}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!a.ack && (
                    <button onClick={()=>ack(a.id)}
                            className="px-4 py-2 text-xs font-bold text-white rounded-xl"
                            style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
                      ✓ Acknowledge
                    </button>
                  )}
                  <button onClick={()=>setExpanded(null)}
                          className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] rounded-xl hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)] transition-all">
                    Collapse
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {visible.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-sm font-medium">No alerts in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
