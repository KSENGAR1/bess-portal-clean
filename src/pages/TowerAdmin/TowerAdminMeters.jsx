import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const METERS = [
  { id:'MTR-001', flat:'101-A', resident:'Rajesh Kumar',  status:'Online',  signal:92, fw:'v2.4.1', lastSync:'2 min ago',  load:2.05, balance:2450  },
  { id:'MTR-002', flat:'102-A', resident:'Priya Singh',   status:'Online',  signal:78, fw:'v2.4.1', lastSync:'1 min ago',  load:1.20, balance:-1250 },
  { id:'MTR-003', flat:'103-A', resident:'Amit Patel',    status:'Offline', signal:0,  fw:'v2.3.0', lastSync:'2 hrs ago',  load:0,    balance:5000  },
  { id:'MTR-004', flat:'201-A', resident:'Neha Gupta',    status:'Online',  signal:95, fw:'v2.4.1', lastSync:'30 sec ago', load:3.40, balance:3200  },
  { id:'MTR-005', flat:'202-A', resident:'Vikram Singh',  status:'Online',  signal:85, fw:'v2.4.1', lastSync:'3 min ago',  load:1.85, balance:1850  },
  { id:'MTR-006', flat:'203-A', resident:'Sunita Sharma', status:'Tamper',  signal:45, fw:'v2.3.0', lastSync:'10 min ago', load:0.90, balance:4200  },
  { id:'MTR-007', flat:'301-A', resident:'Ravi Verma',    status:'Online',  signal:88, fw:'v2.4.1', lastSync:'1 min ago',  load:2.60, balance:750   },
  { id:'MTR-008', flat:'302-A', resident:'Kavita Joshi',  status:'Online',  signal:91, fw:'v2.4.1', lastSync:'2 min ago',  load:1.95, balance:3900  },
]

const STATUS = {
  Online:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Offline: 'bg-red-500/15 text-red-400 border-red-500/30',
  Tamper:  'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

export default function TowerAdminMeters() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(null)
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  const visible = METERS
    .filter(m => filter === 'All' || m.status === filter)
    .filter(m => [m.id, m.flat, m.resident].some(v => v.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Tower A — Meters</h1>
        <p className="text-gray-400 text-sm mt-0.5">Live meter status for all flats in your tower</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total',   val: METERS.length,                                  from:'#0c4a6e', to:'#075985' },
          { label:'Online',  val: METERS.filter(m=>m.status==='Online').length,  from:'#065f46', to:'#064e3b' },
          { label:'Offline', val: METERS.filter(m=>m.status==='Offline').length, from:'#991b1b', to:'#7f1d1d' },
          { label:'Tamper',  val: METERS.filter(m=>m.status==='Tamper').length,  from:'#92400e', to:'#78350f' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
               placeholder="Search meter, flat, resident…"
               className="flex-1 min-w-48 px-4 py-2.5 rounded-xl dark-card border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-cyan-500 placeholder-gray-500 transition-all" />
        {['All','Online','Offline','Tamper'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    filter === f ? 'text-white border-transparent' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}
                  style={filter === f ? { background:'linear-gradient(135deg,#0891b2,#0e7490)' } : {}}>
            {f}
          </button>
        ))}
      </div>

      <div className={CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Meter ID','Flat / Resident','Status','Signal','Live Load','Balance','FW',''].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(m => (
                <tr key={m.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(8,145,178,0.05)] transition-all cursor-pointer"
                    onClick={() => setDetail(m)}>
                  <td className="py-3 px-3 text-cyan-300 font-mono text-xs font-bold">{m.id}</td>
                  <td className="py-3 px-3">
                    <p className="text-white font-semibold text-sm">{m.flat}</p>
                    <p className="text-gray-500 text-xs">{m.resident}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${STATUS[m.status]}`}>{m.status}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full"
                             style={{ width:`${m.signal}%`, background: m.signal > 70 ? '#10b981' : m.signal > 40 ? '#f59e0b' : '#ef4444' }}/>
                      </div>
                      <span className="text-xs text-gray-400">{m.signal}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-300 text-xs">{m.load} kW</td>
                  <td className={`py-3 px-3 font-bold text-sm ${m.balance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {m.balance < 0 ? '-' : ''}{sym}{Math.abs(m.balance).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-xs font-mono">{m.fw}</td>
                  <td className="py-3 px-3">
                    <button onClick={e => { e.stopPropagation(); addToast(`Pinging ${m.id}…`, 'info') }}
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300">Ping</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={() => setDetail(null)}>
          <div className="w-full max-w-sm rounded-3xl p-6 dark-card border border-[rgba(8,145,178,0.3)]"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                   style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)' }}>⚡</div>
              <div>
                <p className="text-white font-bold font-mono">{detail.id}</p>
                <p className="text-cyan-400 text-xs">{detail.flat} · {detail.resident}</p>
              </div>
            </div>
            {[['Status',detail.status],['Signal',`${detail.signal}%`],['Live Load',`${detail.load} kW`],
              ['Balance',`${detail.balance<0?'-':''}${sym}${Math.abs(detail.balance).toLocaleString()}`],
              ['Firmware',detail.fw],['Last Sync',detail.lastSync]
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                <span className="text-gray-400 text-xs">{k}</span>
                <span className="text-gray-200 text-xs font-semibold">{v}</span>
              </div>
            ))}
            <div className="flex gap-3 mt-5">
              <button onClick={() => { addToast(`Remote ping sent to ${detail.id}`, 'success'); setDetail(null) }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)' }}>Remote Ping</button>
              <button onClick={() => setDetail(null)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
