import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const INIT = [
  { id:1, name:'Rajesh Kumar',  email:'rajesh@abc.com',    phone:'98765-00001', society:'ABC Residency',  city:'Delhi',   towers:3, consumers:120, status:'Active',   lastLogin:'5 min ago',   since:'Jan 2022', collection:94.7 },
  { id:2, name:'Priya Singh',   email:'priya@xyz.com',     phone:'98765-00002', society:'XYZ Towers',     city:'Noida',   towers:4, consumers:340, status:'Active',   lastLogin:'2 hours ago', since:'Mar 2022', collection:97.2 },
  { id:3, name:'Amit Patel',    email:'amit@elite.com',    phone:'98765-00003', society:'Elite Heights',  city:'Gurgaon', towers:2, consumers:180, status:'Inactive', lastLogin:'1 day ago',   since:'Jun 2022', collection:88.5 },
  { id:4, name:'Sunita Mehta',  email:'sunita@gv.com',     phone:'98765-00004', society:'Green Valley',   city:'Lucknow', towers:3, consumers:210, status:'Active',   lastLogin:'30 min ago',  since:'Sep 2022', collection:96.7 },
  { id:5, name:'Kiran Sharma',  email:'kiran@sun.com',     phone:'98765-00005', society:'Sunrise Towers', city:'Mumbai',  towers:2, consumers:95,  status:'Active',   lastLogin:'1 hour ago',  since:'Dec 2022', collection:88.1 },
]

const SOCIETIES = ['ABC Residency','XYZ Towers','Elite Heights','Green Valley','Sunrise Towers']
const EMPTY = { name:'', email:'', phone:'', society: SOCIETIES[0], city:'' }
const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-600" />
  </div>
)

export default function CompanyAdminAdmins() {
  const { addToast } = useToast()
  const [admins, setAdmins] = useState(INIT)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modal,  setModal]  = useState(null)
  const [detail, setDetail] = useState(null)
  const [form,   setForm]   = useState(EMPTY)

  const filtered = admins
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a => [a.name, a.society, a.city].some(v => v.toLowerCase().includes(search.toLowerCase())))

  const openAdd  = () => { setForm(EMPTY); setModal('add') }
  const openEdit = a  => { setForm({ name:a.name, email:a.email, phone:a.phone, society:a.society, city:a.city }); setModal(a) }

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return
    if (modal === 'add') {
      setAdmins(p => [...p, { ...form, id:Date.now(), towers:0, consumers:0, status:'Active', lastLogin:'Never', since: new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}), collection:0 }])
      addToast(`✅ Society Admin "${form.name}" added!`, 'success')
    } else {
      setAdmins(p => p.map(a => a.id === modal.id ? { ...a, ...form } : a))
      addToast(`✅ "${form.name}" updated!`, 'success')
    }
    setModal(null)
  }

  const toggle = id => {
    setAdmins(p => p.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a))
    const a = admins.find(x => x.id === id)
    addToast(`${a.status === 'Active' ? '⛔ Disabled' : '✅ Enabled'}: ${a.name}`, 'success')
    setDetail(null)
  }

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Society Admins</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage society admins under Lith-On Energy</p>
        </div>
        <button onClick={openAdd}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>
          + Add Society Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Total Admins', val: admins.length,                                  from:'#1d4ed8', to:'#1e40af' },
          { label:'Active',       val: admins.filter(a=>a.status==='Active').length,  from:'#065f46', to:'#064e3b' },
          { label:'Inactive',     val: admins.filter(a=>a.status==='Inactive').length, from:'#7f1d1d', to:'#991b1b' },
        ].map((s,i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)}
               placeholder="Search name, society, city…"
               className="flex-1 min-w-48 px-4 py-2.5 rounded-xl dark-card border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-emerald-500 placeholder-gray-500 transition-all" />
        {['All','Active','Inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === f ? 'text-white' : 'dark-card text-gray-400 border border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}
                  style={filter === f ? { background:'linear-gradient(135deg,#059669,#047857)' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {/* Admin cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(a => (
          <div key={a.id} className={`${CARD} cursor-pointer hover:border-emerald-500/30 transition-all`}
               onClick={() => setDetail(a)}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                   style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>👨‍💼</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-bold text-sm">{a.name}</p>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                    a.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>{a.status}</span>
                </div>
                <p className="text-emerald-400 text-xs font-semibold mt-0.5">{a.society} · {a.city}</p>
                <p className="text-gray-500 text-xs">{a.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[['Towers',a.towers],['Consumers',a.consumers],['Collection',`${a.collection}%`],['Since',a.since]].map(([l,v]) => (
                <div key={l} className="rounded-xl p-2 text-center dark-row border border-[rgba(255,255,255,0.05)]">
                  <p className="text-gray-500 text-[9px] uppercase font-semibold">{l}</p>
                  <p className="text-white font-bold text-xs mt-0.5 truncate">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.05)]">
              <p className="text-gray-600 text-xs">Last login: {a.lastLogin}</p>
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button onClick={() => openEdit(a)}
                        className="px-3 py-1.5 text-xs font-bold text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all">Edit</button>
                <button onClick={() => toggle(a.id)}
                        className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-all ${
                          a.status === 'Active' ? 'text-red-400 border-red-500/30 hover:bg-red-500/10' : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                        }`}>{a.status === 'Active' ? 'Disable' : 'Enable'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50" onClick={() => setDetail(null)}>
          <div className="h-full w-full max-w-sm dark-card border-l border-[rgba(5,150,105,0.3)] p-6 space-y-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{detail.name}</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="space-y-2">
              {[['Society',detail.society],['City',detail.city],['Email',detail.email],['Phone',detail.phone],
                ['Towers',detail.towers],['Consumers',detail.consumers],['Collection',`${detail.collection}%`],
                ['Status',detail.status],['Last Login',detail.lastLogin],['Since',detail.since]
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className="text-gray-200 text-xs font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => { openEdit(detail); setDetail(null) }}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>Edit Admin</button>
              <button onClick={() => { addToast(`🔑 Reset link sent to ${detail.email}`, 'success'); setDetail(null) }}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 transition-all">Send Password Reset</button>
              <button onClick={() => toggle(detail.id)}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        detail.status === 'Active' ? 'text-red-400 border-red-500/30 hover:bg-red-500/10' : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                      }`}>{detail.status === 'Active' ? '⛔ Disable Admin' : '✅ Enable Admin'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 dark-card border border-[rgba(5,150,105,0.25)]" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-5">{modal === 'add' ? 'Add Society Admin' : `Edit — ${modal.name}`}</h3>
            <div className="space-y-3">
              <Input label="Full Name"  value={form.name}  onChange={e => setForm({...form, name:e.target.value})}  placeholder="Rajesh Kumar" />
              <Input label="Email"      type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="admin@society.com" />
              <Input label="Phone"      value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="98765-XXXXX" />
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Assign Society</label>
                <select value={form.society} onChange={e => setForm({...form, society:e.target.value})}
                        className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-emerald-500">
                  {SOCIETIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Input label="City" value={form.city} onChange={e => setForm({...form, city:e.target.value})} placeholder="Delhi" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={!form.name.trim() || !form.email.trim()}
                      className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40"
                      style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>
                {modal === 'add' ? 'Add Admin' : 'Save Changes'}
              </button>
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
