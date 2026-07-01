import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const USERS = [
  { id:1, name:'Rajesh Kumar',  flat:'301-A', org:'ABC Residency', meter:'MTR-001', balance:2450,  status:'Active',   lastSeen:'2 min ago',  phone:'+91 98765 43210' },
  { id:2, name:'Priya Singh',   flat:'302-A', org:'ABC Residency', meter:'MTR-002', balance:-1250, status:'Active',   lastSeen:'1 hour ago', phone:'+91 87654 32109' },
  { id:3, name:'Amit Patel',    flat:'303-A', org:'ABC Residency', meter:'MTR-003', balance:5000,  status:'Inactive', lastSeen:'2 days ago', phone:'+91 76543 21098' },
  { id:4, name:'Neha Gupta',    flat:'401-B', org:'XYZ Towers',    meter:'MTR-004', balance:3200,  status:'Active',   lastSeen:'30 min ago', phone:'+91 65432 10987' },
  { id:5, name:'Vikram Singh',  flat:'402-B', org:'XYZ Towers',    meter:'MTR-005', balance:1850,  status:'Active',   lastSeen:'5 min ago',  phone:'+91 54321 09876' },
  { id:6, name:'Sunita Sharma', flat:'501-C', org:'Elite Heights',  meter:'MTR-006', balance:0,    status:'Suspended',lastSeen:'1 week ago', phone:'+91 43210 98765' },
  { id:7, name:'Ravi Verma',    flat:'102-A', org:'Green Valley',   meter:'MTR-007', balance:7800,  status:'Active',   lastSeen:'Just now',   phone:'+91 32109 87654' },
]

export default function SuperAdminUsers() {
  const [search, setSearch] = useState('')
  const { addToast } = useToast()
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.flat.toLowerCase().includes(search.toLowerCase()) ||
      u.org.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || u.status === statusFilter
    return matchSearch && matchStatus
  })

  const detail = USERS.find(u => u.id === selected)
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">All Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">{USERS.length} registered consumers across all organizations</p>
        </div>
        <button onClick={() => addToast('📥 User list exported!', 'success')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 dark-row border border-[rgba(255,255,255,0.08)] hover:border-purple-500 transition-all">
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {label:'Active', value:USERS.filter(u=>u.status==='Active').length, from:'#065f46',to:'#064e3b'},
          {label:'Inactive',value:USERS.filter(u=>u.status==='Inactive').length,from:'#92400e',to:'#78350f'},
          {label:'Suspended',value:USERS.filter(u=>u.status==='Suspended').length,from:'#991b1b',to:'#7f1d1d'},
        ].map((s,i)=>(
          <div key={i} className="rounded-2xl p-4 text-white keep-white" style={{background:`linear-gradient(135deg,${s.from},${s.to})`}}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className={CARD}>
        <div className="flex flex-wrap gap-3 mb-4">
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Search name, flat, org…"
                 className="flex-1 min-w-[200px] px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-purple-500"/>
          <div className="flex gap-1 p-1 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)]">
            {['All','Active','Inactive','Suspended'].map(s=>(
              <button key={s} onClick={()=>setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter===s?'bg-purple-700 text-white':'text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['User','Organization','Flat / Meter','Balance','Status','Last Seen',''].map(h=>(
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(139,92,246,0.06)] transition-all cursor-pointer"
                    onClick={()=>setSelected(selected===u.id?null:u.id)}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                           style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#e9d5ff'}}>
                        {u.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{u.name}</p>
                        <p className="text-gray-500 text-xs">{u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-300 text-sm">{u.org}</td>
                  <td className="py-3 px-3">
                    <p className="text-gray-200 text-sm">{u.flat}</p>
                    <p className="text-gray-500 text-xs font-mono">{u.meter}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold text-sm ${u.balance<0?'text-red-400':u.balance===0?'text-yellow-400':'text-emerald-400'}`}>
                      {u.balance<0?'-':''}{Math.abs(u.balance).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                      u.status==='Active'?'bg-emerald-500/15 text-emerald-400 border-emerald-500/30':
                      u.status==='Suspended'?'bg-red-500/15 text-red-400 border-red-500/30':
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>{u.status}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{u.lastSeen}</td>
                  <td className="py-3 px-3">
                    <button onClick={e=>{e.stopPropagation();setSelected(u.id)}}
                            className="text-purple-400 hover:text-purple-300 text-xs font-bold">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50" onClick={()=>setSelected(null)}>
          <div className="h-full w-full max-w-sm dark-card border-l border-[rgba(139,92,246,0.3)] p-6 space-y-5 overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">User Details</h3>
              <button onClick={()=>setSelected(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black"
                   style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#e9d5ff'}}>
                {detail.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <p className="text-white font-bold">{detail.name}</p>
                <p className="text-gray-400 text-xs">{detail.phone}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[['Organization',detail.org],['Flat',detail.flat],['Meter ID',detail.meter],['Status',detail.status],['Last Seen',detail.lastSeen]].map(([k,v])=>(
                <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className="text-gray-200 text-xs font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={()=>addToast('📧 Password reset sent!', 'success')} className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>Reset Password</button>
              <button onClick={()=>addToast(detail.status==='Suspended'?'✅ User activated':'⛔ User suspended!', 'success')} className="w-full py-2.5 rounded-xl text-sm font-bold text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">{detail.status==='Suspended'?'Activate User':'Suspend User'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
