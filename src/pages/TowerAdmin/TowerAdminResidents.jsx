import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const INIT = [
  { id:1, flat:'101-A', name:'Rajesh Kumar',  phone:'98765-43210', email:'rajesh@email.com', meter:'MTR-001', status:'Active',   balance:2450,  usage:245, joinDate:'Jan 2023' },
  { id:2, flat:'102-A', name:'Priya Singh',   phone:'87654-32109', email:'priya@email.com',  meter:'MTR-002', status:'Active',   balance:-1250, usage:188, joinDate:'Feb 2023' },
  { id:3, flat:'103-A', name:'Amit Patel',    phone:'76543-21098', email:'amit@email.com',   meter:'MTR-003', status:'Inactive', balance:5000,  usage:0,   joinDate:'Mar 2023' },
  { id:4, flat:'201-A', name:'Neha Gupta',    phone:'65432-10987', email:'neha@email.com',   meter:'MTR-004', status:'Active',   balance:3200,  usage:210, joinDate:'Apr 2023' },
  { id:5, flat:'202-A', name:'Vikram Singh',  phone:'54321-09876', email:'vikram@email.com', meter:'MTR-005', status:'Active',   balance:1850,  usage:232, joinDate:'May 2023' },
  { id:6, flat:'203-A', name:'Sunita Sharma', phone:'43210-98765', email:'sunita@email.com', meter:'MTR-006', status:'Active',   balance:4200,  usage:198, joinDate:'Jun 2023' },
  { id:7, flat:'301-A', name:'Ravi Verma',    phone:'32109-87654', email:'ravi@email.com',   meter:'MTR-007', status:'Active',   balance:750,   usage:265, joinDate:'Jul 2023' },
  { id:8, flat:'302-A', name:'Kavita Joshi',  phone:'21098-76543', email:'kavita@email.com', meter:'MTR-008', status:'Active',   balance:3900,  usage:221, joinDate:'Aug 2023' },
]

const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

export default function TowerAdminResidents() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const [residents] = useState(INIT)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [detail, setDetail] = useState(null)

  const filtered = residents
    .filter(r => filter === 'All' || r.status === filter)
    .filter(r => [r.name, r.flat, r.meter].some(v => v.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Tower A — Residents</h1>
        <p className="text-gray-400 text-sm mt-0.5">All residents in your tower</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total',      val: residents.length,                                  from:'#0c4a6e', to:'#075985' },
          { label:'Active',     val: residents.filter(r=>r.status==='Active').length,   from:'#065f46', to:'#064e3b' },
          { label:'Negative Bal', val: residents.filter(r=>r.balance<0).length,         from:'#991b1b', to:'#7f1d1d' },
          { label:'Total Usage',  val: `${residents.reduce((a,b)=>a+b.usage,0)} kWh`,  from:'#1e3a5f', to:'#1e3a8a' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)}
               placeholder="Search name, flat, meter…"
               className="flex-1 min-w-48 px-4 py-2.5 rounded-xl dark-card border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-cyan-500 placeholder-gray-500 transition-all" />
        {['All','Active','Inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === f ? 'text-white' : 'dark-card text-gray-400 border border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}
                  style={filter === f ? { background:'linear-gradient(135deg,#0891b2,#0e7490)' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Flat','Resident','Meter','Usage','Balance','Status',''].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(8,145,178,0.05)] transition-all cursor-pointer"
                    onClick={() => setDetail(r)}>
                  <td className="py-3 px-3 text-white font-bold text-sm">{r.flat}</td>
                  <td className="py-3 px-3">
                    <p className="text-white font-semibold text-sm">{r.name}</p>
                    <p className="text-gray-500 text-xs">{r.phone}</p>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs font-mono">{r.meter}</td>
                  <td className="py-3 px-3 text-gray-300">{r.usage} kWh</td>
                  <td className={`py-3 px-3 font-bold text-sm ${r.balance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {r.balance < 0 ? '-' : ''}{sym}{Math.abs(r.balance).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                      r.status === 'Active'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>{r.status}</span>
                  </td>
                  <td className="py-3 px-3">
                    <button onClick={e => { e.stopPropagation(); addToast(`Reminder sent to ${r.name}`, 'success') }}
                            className="px-3 py-1 rounded-lg text-xs font-bold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                      📧 Remind
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-500 text-sm">No residents found.</p>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50"
             onClick={() => setDetail(null)}>
          <div className="h-full w-full max-w-sm dark-card border-l border-[rgba(8,145,178,0.3)] p-6 space-y-4 overflow-y-auto"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{detail.name}</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
                 style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)', color:'#cffafe' }}>
              {detail.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div className="space-y-2">
              {[['Flat', detail.flat], ['Meter', detail.meter], ['Phone', detail.phone],
                ['Email', detail.email], ['Usage', `${detail.usage} kWh`],
                ['Balance', `${detail.balance < 0 ? '-' : ''}${sym}${Math.abs(detail.balance).toLocaleString()}`],
                ['Status', detail.status], ['Member Since', detail.joinDate]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className="text-gray-200 text-xs font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => { addToast(`Payment reminder sent to ${detail.name}`, 'success'); setDetail(null) }}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)' }}>
                Send Reminder
              </button>
              <button onClick={() => setDetail(null)}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
