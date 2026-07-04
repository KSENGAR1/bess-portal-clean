import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const METERS = [
  { id:'MTR-001', flat:'301-A', org:'ABC Residency', type:'Grid',  status:'Online',  firmware:'v2.3.1', signal:92, lastSync:'2 min ago',  balance:2450  },
  { id:'MTR-002', flat:'302-A', org:'ABC Residency', type:'Grid',  status:'Online',  firmware:'v2.3.1', signal:88, lastSync:'1 min ago',  balance:-1250 },
  { id:'MTR-003', flat:'303-A', org:'ABC Residency', type:'DG',    status:'Offline', firmware:'v2.2.0', signal:0,  lastSync:'3 hrs ago',  balance:5000  },
  { id:'MTR-004', flat:'401-B', org:'XYZ Towers',    type:'Grid',  status:'Online',  firmware:'v2.3.1', signal:95, lastSync:'30 sec ago', balance:3200  },
  { id:'MTR-005', flat:'402-B', org:'XYZ Towers',    type:'Grid',  status:'Online',  firmware:'v2.3.0', signal:78, lastSync:'5 min ago',  balance:1850  },
  { id:'MTR-006', flat:'501-C', org:'Elite Heights', type:'Grid',  status:'Tamper',  firmware:'v2.3.1', signal:45, lastSync:'10 min ago', balance:0     },
  { id:'MTR-007', flat:'102-A', org:'Green Valley',  type:'Grid',  status:'Online',  firmware:'v2.1.0', signal:60, lastSync:'8 min ago',  balance:7800  },
  { id:'MTR-008', flat:'201-A', org:'Green Valley',  type:'DG',    status:'Online',  firmware:'v2.3.1', signal:82, lastSync:'3 min ago',  balance:4300  },
  { id:'MTR-009', flat:'301-D', org:'Palm Court',    type:'Grid',  status:'Offline', firmware:'v2.0.5', signal:0,  lastSync:'2 days ago', balance:600   },
  { id:'MTR-010', flat:'401-D', org:'Palm Court',    type:'Grid',  status:'Online',  firmware:'v2.3.1', signal:90, lastSync:'1 min ago',  balance:9200  },
]

const STATUS_STYLE = {
  Online:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Offline: 'bg-red-500/15 text-red-400 border-red-500/30',
  Tamper:  'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

export default function SuperAdminMeters() {
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('All')
  const [selected, setSelected]   = useState(null)
  const { addToast } = useToast()

  const filtered = METERS.filter(m => {
    const q = search.toLowerCase()
    const matchQ = m.id.toLowerCase().includes(q) || m.org.toLowerCase().includes(q) || m.flat.toLowerCase().includes(q)
    const matchS = statusFilter === 'All' || m.status === statusFilter
    return matchQ && matchS
  })

  const detail = METERS.find(m => m.id === selected)
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  const SignalBar = ({ pct }) => {
    const col = pct > 70 ? '#10b981' : pct > 40 ? '#f59e0b' : '#ef4444'
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: col }} />
        </div>
        <span className="text-xs" style={{ color: col }}>{pct}%</span>
      </div>
    )
  }

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart Meters</h1>
          <p className="text-gray-400 text-sm mt-0.5">All {METERS.length} meters across all projects</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => addToast('Sync triggered for all meters!', 'success')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-purple-300 border border-purple-500/40 hover:bg-purple-500/10 transition-all">
            Sync All
          </button>
          <button onClick={() => addToast('📥 Meter list exported!', 'success')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.04)] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-purple-500 transition-all">
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Online',  val: METERS.filter(m=>m.status==='Online').length,  from:'#065f46', to:'#064e3b' },
          { label: 'Offline', val: METERS.filter(m=>m.status==='Offline').length, from:'#991b1b', to:'#7f1d1d' },
          { label: 'Tamper',  val: METERS.filter(m=>m.status==='Tamper').length,  from:'#92400e', to:'#78350f' },
          { label: 'Pending FW', val: METERS.filter(m=>m.firmware!=='v2.3.1').length, from:'#4c1d95', to:'#3b0764' },
        ].map((s,i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white" style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      <div className={CARD}>
        <div className="flex flex-wrap gap-3 mb-4">
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Search meter ID, org, flat…"
                 className="flex-1 min-w-[200px] px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-purple-500"/>
          <div className="flex gap-1 p-1 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)]">
            {['All','Online','Offline','Tamper'].map(s => (
              <button key={s} onClick={() => setStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter===s?'bg-purple-700 text-white':'text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Meter ID','Organization','Flat','Type','Status','Signal','Firmware','Last Sync',''].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(139,92,246,0.06)] transition-all cursor-pointer"
                    onClick={() => setSelected(selected === m.id ? null : m.id)}>
                  <td className="py-3 px-3 font-mono text-purple-300 text-xs font-bold">{m.id}</td>
                  <td className="py-3 px-3 text-gray-300 text-sm">{m.org}</td>
                  <td className="py-3 px-3 text-gray-400 text-sm">{m.flat}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{m.type}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${STATUS_STYLE[m.status]}`}>{m.status}</span>
                  </td>
                  <td className="py-3 px-3"><SignalBar pct={m.signal}/></td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-mono font-bold ${m.firmware==='v2.3.1'?'text-emerald-400':'text-amber-400'}`}>{m.firmware}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{m.lastSync}</td>
                  <td className="py-3 px-3">
                    <button onClick={e => { e.stopPropagation(); addToast(`🔄 Reboot sent to ${m.id}`, 'success') }}
                            className="text-xs font-bold text-purple-400 hover:text-purple-300">Reboot</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-sm dark-card border-l border-[rgba(139,92,246,0.3)] p-6 space-y-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{detail.id}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${STATUS_STYLE[detail.status]}`}>{detail.status}</span>
            <div className="space-y-3">
              {[['Organization',detail.org],['Flat',detail.flat],['Type',detail.type],['Firmware',detail.firmware],['Signal',`${detail.signal}%`],['Last Sync',detail.lastSync]].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className="text-gray-200 text-xs font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => addToast(`🔄 Reboot sent to ${detail.id}`, 'success')} className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>Reboot Meter</button>
              <button onClick={() => addToast('📶 Firmware update queued', 'success')} className="w-full py-2.5 rounded-xl text-sm font-bold text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">Push Firmware</button>
              <button onClick={() => addToast('🚨 Alert cleared', 'success')} className="w-full py-2.5 rounded-xl text-sm font-bold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-all">Clear Alerts</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
