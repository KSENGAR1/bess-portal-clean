import { useState } from 'react'

const LOGS = [
  { id:1,  level:'ERROR',   service:'API Gateway',     message:'Rate limit exceeded for IP 192.168.1.45',            time:'10:45:22',  ts:'2024-06-15' },
  { id:2,  level:'WARN',    service:'Redis Cache',      message:'Memory usage at 88%, approaching threshold',         time:'10:44:11',  ts:'2024-06-15' },
  { id:3,  level:'INFO',    service:'Billing Engine',   message:'Monthly bills generated for 245 consumers',          time:'10:00:00',  ts:'2024-06-15' },
  { id:4,  level:'INFO',    service:'MQTT Broker',      message:'Meter MTR-045 reconnected after 2h offline',         time:'09:52:34',  ts:'2024-06-15' },
  { id:5,  level:'ERROR',   service:'Payment Gateway',  message:'Transaction TXN9B4G3D timed out after 30s',          time:'09:30:15',  ts:'2024-06-15' },
  { id:6,  level:'WARN',    service:'MQTT Broker',      message:'6 meters missed heartbeat — MTR-003,007,012,015,018,022', time:'09:28:40', ts:'2024-06-15' },
  { id:7,  level:'INFO',    service:'Auth Service',     message:'Admin Rajesh Kumar logged in from 103.21.x.x',       time:'09:15:00',  ts:'2024-06-15' },
  { id:8,  level:'DEBUG',   service:'Tariff Engine',    message:'Tariff calculation completed in 142ms',              time:'08:00:01',  ts:'2024-06-15' },
  { id:9,  level:'ERROR',   service:'Database',         message:'Slow query detected: 4200ms on consumer_readings',   time:'07:45:10',  ts:'2024-06-15' },
  { id:10, level:'INFO',    service:'Kafka',            message:'Consumer group meter-events lag: 0 messages',        time:'07:00:00',  ts:'2024-06-15' },
]

const lvlStyle = {
  ERROR: { badge:'bg-red-500/20 text-red-400 border-red-500/30',    dot:'bg-red-500',    bar:'border-l-red-500' },
  WARN:  { badge:'bg-amber-500/20 text-amber-400 border-amber-500/30', dot:'bg-amber-500', bar:'border-l-amber-500' },
  INFO:  { badge:'bg-blue-500/20 text-blue-400 border-blue-500/30',  dot:'bg-blue-500',   bar:'border-l-blue-500' },
  DEBUG: { badge:'bg-gray-500/20 text-gray-400 border-gray-500/30',  dot:'bg-gray-500',   bar:'border-l-gray-600' },
}

export default function SuperAdminLogs() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const visible = LOGS
    .filter(l => filter==='All' || l.level===filter)
    .filter(l => [l.message, l.service].some(v => v.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Logs</h1>
          <p className="text-gray-400 text-sm mt-0.5">Platform-wide event log stream</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs dark-card border border-[rgba(139,92,246,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300">Live Stream</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['ERROR',LOGS.filter(l=>l.level==='ERROR').length,'#991b1b','#7f1d1d'],
          ['WARN', LOGS.filter(l=>l.level==='WARN').length, '#92400e','#78350f'],
          ['INFO', LOGS.filter(l=>l.level==='INFO').length, '#1d4ed8','#1e40af'],
          ['DEBUG',LOGS.filter(l=>l.level==='DEBUG').length,'#374151','#1f2937'],
        ].map(([level,count,f,t])=>(
          <button key={level} onClick={()=>setFilter(filter===level?'All':level)}
                  className={`rounded-2xl p-3 text-center transition-all keep-white ${filter===level?'ring-2 ring-white/20':''}`}
                  style={{ background:`linear-gradient(135deg,${f},${t})` }}>
            <p className="text-xs text-white/70">{level}</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{count}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search logs, services…"
             className="w-full px-4 py-2.5 rounded-xl dark-card border border-[rgba(139,92,246,0.2)] text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-500 transition-all" />

      {/* Log stream */}
      <div className="rounded-2xl border dark-card border-[rgba(139,92,246,0.15)] overflow-hidden">
        <div className="dark-row px-4 py-2.5 border-b border-[rgba(139,92,246,0.15)] flex items-center gap-2">
          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">● LIVE LOG STREAM</span>
          <span className="text-gray-500 text-xs ml-auto">{visible.length} entries</span>
        </div>
        <div className="font-mono text-xs divide-y divide-[rgba(255,255,255,0.03)]">
          {visible.map(log => (
            <div key={log.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-[rgba(139,92,246,0.05)] transition-all border-l-2 ${lvlStyle[log.level].bar}`}>
              <span className="text-gray-500 flex-shrink-0 text-[10px] mt-0.5 w-14">{log.time}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${lvlStyle[log.level].badge}`}>{log.level}</span>
              <span className="text-purple-600 dark:text-purple-400 flex-shrink-0 text-[10px] w-28 truncate font-medium">[{log.service}]</span>
              <span className="text-gray-700 dark:text-gray-300 flex-1 min-w-0 break-words leading-relaxed">{log.message}</span>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">No logs match filter</div>
          )}
        </div>
      </div>
    </div>
  )
}
