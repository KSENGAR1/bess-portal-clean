import { useState } from 'react'

const INIT = [
  { id: 1, cid:'#C-001', flat:'301-A', name:'Rajesh Kumar',  issue:'High Reading',      category:'Billing',    assigned:'Ramesh T.',   status:'Open',        date:'2024-06-15', note:'' },
  { id: 2, cid:'#C-002', flat:'302-A', name:'Priya Singh',   issue:'Meter Not Working', category:'Meter',      assigned:'Priya M.',    status:'In Progress', date:'2024-06-14', note:'Technician scheduled for Jun 17' },
  { id: 3, cid:'#C-003', flat:'303-A', name:'Amit Patel',    issue:'Billing Dispute',   category:'Billing',    assigned:'Admin',       status:'Resolved',    date:'2024-06-13', note:'Excess charge reversed' },
  { id: 4, cid:'#C-004', flat:'401-B', name:'Neha Gupta',    issue:'Connection Issue',  category:'Connection', assigned:'Vikram S.',   status:'Open',        date:'2024-06-12', note:'' },
  { id: 5, cid:'#C-005', flat:'402-B', name:'Vikram Singh',  issue:'DG High Rate',      category:'Billing',    assigned:'Admin',       status:'In Progress', date:'2024-06-11', note:'Escalated to finance team' },
  { id: 6, cid:'#C-006', flat:'501-C', name:'Sunita Sharma', issue:'App Login Issue',   category:'App',        assigned:'IT Support',  status:'Resolved',    date:'2024-06-10', note:'Password reset done' },
]

const statusStyle = {
  'Open':        'bg-red-500/15 text-red-400 border-red-500/30',
  'In Progress': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Resolved':    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}
const statusFlow = ['Open','In Progress','Resolved']

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState(INIT)
  const [filter, setFilter]         = useState('All')
  const [selected, setSelected]     = useState(null)
  const [note, setNote]             = useState('')

  const visible = filter === 'All'
    ? complaints
    : complaints.filter(c => c.status === filter)

  const advance = (id) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c
      const idx = statusFlow.indexOf(c.status)
      return { ...c, status: statusFlow[Math.min(idx+1, statusFlow.length-1)] }
    }))
  }
  const addNote = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? {...c, note} : c))
    setNote('')
  }

  const stats = [
    { label:'Open',        value: complaints.filter(c=>c.status==='Open').length,        from:'#991b1b',to:'#7f1d1d', icon:'🔴' },
    { label:'In Progress', value: complaints.filter(c=>c.status==='In Progress').length, from:'#92400e',to:'#78350f', icon:'🟡' },
    { label:'Resolved',    value: complaints.filter(c=>c.status==='Resolved').length,    from:'#065f46',to:'#064e3b', icon:'🟢' },
  ]

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      {/* Society identity banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4 border"
           style={{ background:'rgba(217,119,6,0.08)', borderColor:'rgba(217,119,6,0.25)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
             style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>🏢</div>
        <div className="flex-1 min-w-0">
          <p className="text-amber-400 font-bold text-sm">ABC Residency</p>
          <p className="text-gray-500 text-xs">Sector 14, Delhi · 4 towers · 4 tower admins · Aggregated tower-level data</p>
        </div>
        <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ● Active
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Complaint Management</h1>
        <p className="text-gray-400 text-sm mt-0.5">Track and resolve ABC Residency complaints</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <div className="absolute right-3 top-3 text-2xl opacity-20">{s.icon}</div>
            <p className="text-xs text-white/70 font-medium">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All','Open','In Progress','Resolved'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter === f ? 'bg-amber-600 text-white border-amber-700' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {visible.map(c => (
          <div key={c.id} className="rounded-2xl dark-card border border-[rgba(255,255,255,0.07)] shadow-dark-card">
            <div className="flex items-start gap-3 p-4 cursor-pointer"
                 onClick={()=>setSelected(selected===c.id?null:c.id)}>
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 flex items-center justify-center text-lg flex-shrink-0">🗣️</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-bold text-sm">{c.cid}</p>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${statusStyle[c.status]}`}>{c.status}</span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[rgba(255,255,255,0.06)] text-gray-400">{c.category}</span>
                </div>
                <p className="text-gray-300 text-sm mt-0.5 font-medium">{c.issue}</p>
                <p className="text-gray-500 text-xs mt-0.5">{c.flat} · {c.name} · Assigned: {c.assigned}</p>
                {c.note && <p className="text-amber-400/80 text-xs mt-1 italic">📌 {c.note}</p>}
              </div>
              <p className="text-gray-600 text-xs flex-shrink-0">{c.date}</p>
            </div>

            {selected === c.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-[rgba(255,255,255,0.04)] pt-3">
                {/* Note input */}
                <div className="flex gap-2">
                  <input value={note} onChange={e=>setNote(e.target.value)}
                         placeholder="Add a note or update…"
                         className="flex-1 px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600 transition-all" />
                  <button onClick={()=>addNote(c.id)} disabled={!note.trim()}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 disabled:opacity-40 transition-all">
                    Add
                  </button>
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  {c.status !== 'Resolved' && (
                    <button onClick={()=>advance(c.id)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                            style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
                      → Move to {statusFlow[statusFlow.indexOf(c.status)+1]}
                    </button>
                  )}
                  <button onClick={()=>setSelected(null)}
                          className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] rounded-xl hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)] transition-all">
                    Collapse
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
