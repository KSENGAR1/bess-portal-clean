import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const INIT = [
  { id:'MTR-001', flat:'301-A', consumer:'Rajesh Kumar',  status:'Online',  balance:2450,  lastSync:'2 min ago',  signal:'Strong', fw:'v2.4.1', load:2.05 },
  { id:'MTR-002', flat:'302-A', consumer:'Priya Singh',   status:'Online',  balance:-1250, lastSync:'1 min ago',  signal:'Medium', fw:'v2.4.1', load:1.20 },
  { id:'MTR-003', flat:'303-A', consumer:'Amit Patel',    status:'Offline', balance:5000,  lastSync:'2 hrs ago',  signal:'Weak',   fw:'v2.3.0', load:0 },
  { id:'MTR-004', flat:'401-B', consumer:'Neha Gupta',    status:'Online',  balance:3200,  lastSync:'1 min ago',  signal:'Strong', fw:'v2.4.1', load:3.40 },
  { id:'MTR-005', flat:'402-B', consumer:'Vikram Singh',  status:'Online',  balance:1850,  lastSync:'3 min ago',  signal:'Strong', fw:'v2.4.1', load:1.85 },
  { id:'MTR-006', flat:'501-C', consumer:'Sunita Sharma', status:'Tamper',  balance:4200,  lastSync:'10 min ago', signal:'Medium', fw:'v2.3.0', load:0.90 },
]

const statusStyle = {
  Online:  { badge:'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot:'bg-emerald-400' },
  Offline: { badge:'bg-red-500/15 text-red-400 border-red-500/30',             dot:'bg-red-500' },
  Tamper:  { badge:'bg-purple-500/15 text-purple-400 border-purple-500/30',    dot:'bg-purple-500' },
}
const signalColor = { Strong:'text-emerald-400', Medium:'text-amber-400', Weak:'text-red-400' }
const signalBars = { Strong: [1,1,1], Medium: [1,1,0], Weak: [1,0,0] }

export default function AdminMeters() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const [meters] = useState(INIT)
  const [detail, setDetail] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const visible = meters
    .filter(m => filter==='All' || m.status===filter)
    .filter(m => [m.id, m.flat, m.consumer].some(v=>v.toLowerCase().includes(search.toLowerCase())))

  const stats = [
    { label:'Total',   value: meters.length,                              from:'#1d4ed8',to:'#1e40af' },
    { label:'Online',  value: meters.filter(m=>m.status==='Online').length,  from:'#065f46',to:'#064e3b' },
    { label:'Offline', value: meters.filter(m=>m.status==='Offline').length, from:'#991b1b',to:'#7f1d1d' },
    { label:'Tamper',  value: meters.filter(m=>m.status==='Tamper').length,  from:'#5b21b6',to:'#4c1d95' },
  ]

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div>
        <h1 className="text-2xl font-bold text-white">Meter Management</h1>
        <p className="text-gray-400 text-sm mt-0.5">Monitor all smart meters in the society</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search meter, flat…"
               className="flex-1 min-w-48 px-4 py-2.5 rounded-xl dark-card border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-amber-500 placeholder-gray-500 transition-all" />
        {['All','Online','Offline','Tamper'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    filter===f ? 'bg-amber-600 text-white border-amber-700' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>{f}</button>
        ))}
      </div>

      <div className="rounded-2xl border dark-card border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Meter ID','Flat / Consumer','Status','Balance','Load','Signal','Last Sync','FW'].map(h=>(
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(m => (
                <tr key={m.id}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)] transition-all cursor-pointer"
                    onClick={()=>setDetail(m)}>
                  <td className="py-3 px-3 text-white font-mono text-xs font-bold">{m.id}</td>
                  <td className="py-3 px-3">
                    <p className="text-white font-semibold text-sm">{m.flat}</p>
                    <p className="text-gray-500 text-xs">{m.consumer}</p>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusStyle[m.status].dot} ${m.status==='Online'?'animate-pulse':''}`} />
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${statusStyle[m.status].badge}`}>{m.status}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-3 font-bold text-sm ${m.balance<0?'text-red-400':'text-emerald-400'}`}>
                    {m.balance<0?'-':''}{sym}{Math.abs(m.balance).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-gray-300 text-xs">{m.load} kW</td>
                  <td className="py-3 px-3">
                    <div className="flex items-end gap-0.5">
                      {signalBars[m.signal].map((on,i)=>(
                        <div key={i} className={`w-1.5 rounded-sm ${on?signalColor[m.signal].replace('text-','bg-'):'bg-gray-700'}`} style={{height:`${8+i*4}px`}} />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{m.lastSync}</td>
                  <td className="py-3 px-3 text-gray-500 text-xs font-mono">{m.fw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={()=>setDetail(null)}>
          <div className="w-full max-w-sm rounded-3xl p-6 animate-slide-up dark-card"
               style={{ border: '1px solid rgba(245,158,11,0.2)' }}
               onClick={e=>e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                   style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>⚡</div>
              <div>
                <p className="text-white font-bold font-mono">{detail.id}</p>
                <p className="text-amber-400 text-xs">{detail.flat} · {detail.consumer}</p>
              </div>
            </div>

            {[
              ['Status',    detail.status],
              ['Balance',   `${detail.balance<0?'-':''}${sym}${Math.abs(detail.balance).toLocaleString()}`],
              ['Live Load', `${detail.load} kW`],
              ['Signal',    detail.signal],
              ['Firmware',  detail.fw],
              ['Last Sync', detail.lastSync],
            ].map(([l,v])=>(
              <div key={l} className="flex justify-between py-2.5 border-b border-[rgba(255,255,255,0.06)] text-sm">
                <span className="text-gray-500">{l}</span>
                <span className="text-white font-semibold">{v}</span>
              </div>
            ))}

            <div className="flex gap-2 mt-5">
              <button onClick={() => { addToast(`Pinging ${detail.id}… Signal: ${detail.signal}`, 'info'); setDetail(null, 'success') }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
                Remote Ping
              </button>
              <button onClick={()=>setDetail(null)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
