import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'

const INIT = [
  { id: 1, flat: '301-A', name: 'Rajesh Kumar',  email: 'rajesh@email.com',  phone: '98765-43210', meterId: 'MTR-001', status: 'Active',   balance: 2450,  joinDate: '2023-01-15' },
  { id: 2, flat: '302-A', name: 'Priya Singh',   email: 'priya@email.com',   phone: '98765-43211', meterId: 'MTR-002', status: 'Active',   balance: -1250, joinDate: '2023-02-10' },
  { id: 3, flat: '303-A', name: 'Amit Patel',    email: 'amit@email.com',    phone: '98765-43212', meterId: 'MTR-003', status: 'Inactive', balance: 5000,  joinDate: '2023-03-05' },
  { id: 4, flat: '401-B', name: 'Neha Gupta',    email: 'neha@email.com',    phone: '98765-43213', meterId: 'MTR-004', status: 'Active',   balance: 3200,  joinDate: '2023-04-12' },
  { id: 5, flat: '402-B', name: 'Vikram Singh',  email: 'vikram@email.com',  phone: '98765-43214', meterId: 'MTR-005', status: 'Active',   balance: 1850,  joinDate: '2023-05-08' },
  { id: 6, flat: '501-C', name: 'Sunita Sharma', email: 'sunita@email.com',  phone: '98765-43215', meterId: 'MTR-006', status: 'Active',   balance: 4200,  joinDate: '2023-06-20' },
]

const EMPTY = { flat:'', name:'', email:'', phone:'', meterId:'', status:'Active', balance:0 }

const CARD  = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500 transition-all" />
  </div>
)

export default function AdminConsumers() {
  const { country } = useCurrency()
  const sym = country.symbol
  const [consumers, setConsumers] = useState(INIT)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('All')
  const [modal, setModal]         = useState(null)   // null | 'add' | consumer-obj
  const [form,  setForm]          = useState(EMPTY)
  const [detail, setDetail]       = useState(null)

  const filtered = consumers
    .filter(c => filter === 'All' || c.status === filter)
    .filter(c => [c.name, c.flat, c.meterId].some(v => v.toLowerCase().includes(search.toLowerCase())))

  const openEdit = c => { setForm({...c}); setModal('edit') }
  const openAdd  = () => { setForm(EMPTY); setModal('add') }

  const save = () => {
    if (modal === 'add') {
      setConsumers(prev => [...prev, { ...form, id: Date.now() }])
    } else {
      setConsumers(prev => prev.map(c => c.id === form.id ? form : c))
    }
    setModal(null)
  }

  const del = id => {
    setConsumers(prev => prev.filter(c => c.id !== id))
    setDetail(null)
  }

  const stats = [
    { label: 'Total',    value: consumers.length,                              from:'#1d4ed8', to:'#1e40af' },
    { label: 'Active',   value: consumers.filter(c=>c.status==='Active').length, from:'#065f46', to:'#064e3b' },
    { label: 'Inactive', value: consumers.filter(c=>c.status==='Inactive').length, from:'#7f1d1d', to:'#991b1b' },
    { label: 'Negative', value: consumers.filter(c=>c.balance<0).length,        from:'#78350f', to:'#92400e' },
  ]

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Consumer Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage all society consumers</p>
        </div>
        <button onClick={openAdd}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
          + Add Consumer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 font-medium">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e=>setSearch(e.target.value)}
               placeholder="Search name, flat, meter…"
               className="flex-1 min-w-48 px-4 py-2.5 rounded-xl dark-card border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-amber-500 placeholder-gray-500 transition-all" />
        {['All','Active','Inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === f ? 'bg-amber-600 text-white' : 'dark-card text-gray-400 border border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>
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
                {['Flat','Consumer','Meter ID','Balance','Status','Actions'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)] transition-all">
                  <td className="py-3 px-3 text-white font-bold text-sm">{c.flat}</td>
                  <td className="py-3 px-3">
                    <button onClick={()=>setDetail(c)} className="text-left hover:text-amber-400 transition-all">
                      <p className="text-white font-semibold text-sm">{c.name}</p>
                      <p className="text-gray-500 text-xs">{c.email}</p>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs font-mono">{c.meterId}</td>
                  <td className={`py-3 px-3 font-bold text-sm ${c.balance<0?'text-red-400':'text-emerald-400'}`}>
                    {c.balance<0?'-':''}{sym}{Math.abs(c.balance).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                      c.status==='Active'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>{c.status}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(c)}
                              className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-xs font-bold hover:bg-blue-600/30 transition-all">
                        Edit
                      </button>
                      <button onClick={()=>del(c.id)}
                              className="px-3 py-1 bg-red-600/15 text-red-400 border border-red-600/25 rounded-lg text-xs font-bold hover:bg-red-600/25 transition-all">
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-500 text-sm">No consumers match the search.</p>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={()=>setDetail(null)}>
          <div className="w-full max-w-sm rounded-3xl p-6 animate-slide-up dark-card"
               style={{ border: '1px solid rgba(245,158,11,0.2)' }}
               onClick={e=>e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                   style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>👤</div>
              <div>
                <p className="text-white font-bold">{detail.name}</p>
                <p className="text-amber-400 text-xs">{detail.flat} · {detail.meterId}</p>
              </div>
            </div>
            {[
              ['Email',  detail.email],
              ['Phone',  detail.phone],
              ['Status', detail.status],
              ['Balance', `${detail.balance<0?'-':''}${sym}${Math.abs(detail.balance).toLocaleString()}`],
              ['Joined', detail.joinDate],
            ].map(([l,v])=>(
              <div key={l} className="flex justify-between py-2.5 border-b border-[rgba(255,255,255,0.06)] text-sm">
                <span className="text-gray-500">{l}</span>
                <span className="text-white font-semibold">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-5">
              <button onClick={()=>{openEdit(detail);setDetail(null)}}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
                Edit
              </button>
              <button onClick={()=>setDetail(null)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={()=>setModal(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 animate-slide-up dark-card"
               style={{ border: '1px solid rgba(245,158,11,0.2)' }}
               onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-5">{modal==='add'?'Add Consumer':'Edit Consumer'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Flat Number"  value={form.flat}    onChange={e=>setForm({...form, flat:e.target.value})} placeholder="301-A" />
                <Input label="Meter ID"     value={form.meterId} onChange={e=>setForm({...form, meterId:e.target.value})} placeholder="MTR-001" />
              </div>
              <Input label="Full Name"    value={form.name}    onChange={e=>setForm({...form, name:e.target.value})}    placeholder="Rajesh Kumar" />
              <Input label="Email"        type="email" value={form.email}   onChange={e=>setForm({...form, email:e.target.value})}   placeholder="email@example.com" />
              <Input label="Phone"        value={form.phone}   onChange={e=>setForm({...form, phone:e.target.value})}   placeholder="98765-43210" />
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Status</label>
                <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}
                        className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500">
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save}
                      className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                      style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
                {modal==='add'?'Add Consumer':'Save Changes'}
              </button>
              <button onClick={()=>setModal(null)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
