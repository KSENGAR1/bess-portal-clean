import { useState } from 'react'

const INIT = [
  { id:1, name:'Rajesh Kumar',    email:'rajesh@abc.com',   project:'ABC Residency', city:'Delhi',   meters:120, consumers:115, status:'Active',   lastLogin:'5 min ago',  role:'Society Admin' },
  { id:2, name:'Priya Singh',     email:'priya@xyz.com',    project:'XYZ Towers',    city:'Noida',   meters:340, consumers:330, status:'Active',   lastLogin:'2 hours ago', role:'Society Admin' },
  { id:3, name:'Amit Patel',      email:'amit@elite.com',   project:'Elite Heights', city:'Gurgaon', meters:180, consumers:172, status:'Inactive', lastLogin:'1 day ago',   role:'Society Admin' },
  { id:4, name:'Sunita Mehta',    email:'sunita@gv.com',    project:'Green Valley',  city:'Lucknow', meters:210, consumers:200, status:'Active',   lastLogin:'30 min ago',  role:'Society Admin' },
  { id:5, name:'Kiran Sharma',    email:'kiran@bk.com',     project:'Blue Knolls',   city:'Pune',    meters:95,  consumers:90,  status:'Active',   lastLogin:'1 hour ago',  role:'Society Admin' },
]

const EMPTY = { name:'', email:'', project:'', city:'', role:'Society Admin', status:'Active' }

const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(139,92,246,0.15)]'
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 rounded-xl dark-row border border-[rgba(139,92,246,0.2)] text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder-gray-600" />
  </div>
)

export default function SuperAdminAdmins() {
  const [admins, setAdmins]  = useState(INIT)
  const [modal,  setModal]   = useState(null)
  const [form,   setForm]    = useState(EMPTY)
  const [search, setSearch]  = useState('')
  const [detail, setDetail]  = useState(null)

  const filtered = admins.filter(a =>
    [a.name, a.project, a.city].some(v => v.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd  = () => { setForm(EMPTY); setModal('add') }
  const openEdit = a  => { setForm({...a}); setModal('edit'); setDetail(null) }

  const save = () => {
    if (modal === 'add') setAdmins(p => [...p, {...form, id:Date.now(), meters:0, consumers:0, lastLogin:'Never'}])
    else setAdmins(p => p.map(a => a.id === form.id ? form : a))
    setModal(null)
  }

  const toggle = id => setAdmins(p => p.map(a => a.id===id ? {...a, status: a.status==='Active'?'Inactive':'Active'} : a))

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage all society admins across projects</p>
        </div>
        <button onClick={openAdd}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
          + Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Total Admins', value: admins.length,                             from:'#1d4ed8',to:'#1e40af' },
          { label:'Active',       value: admins.filter(a=>a.status==='Active').length, from:'#065f46',to:'#064e3b' },
          { label:'Inactive',     value: admins.filter(a=>a.status==='Inactive').length,from:'#7f1d1d',to:'#991b1b' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 keep-white" style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search admins, projects, cities…"
             className="w-full px-4 py-2.5 rounded-xl dark-card border border-[rgba(139,92,246,0.2)] text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-500 transition-all" />

      {/* Admin cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(a => (
          <div key={a.id} className={CARD + ' cursor-pointer hover:border-purple-500/40 transition-all'}
               onClick={()=>setDetail(a)}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                   style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>👨‍💼</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-bold text-sm">{a.name}</p>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                    a.status==='Active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>{a.status}</span>
                </div>
                <p className="text-purple-400 text-xs mt-0.5">{a.project} · {a.city}</p>
                <p className="text-gray-500 text-xs">{a.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              {[['Meters',a.meters],['Consumers',a.consumers],['Last Login',a.lastLogin]].map(([k,v])=>(
                <div key={k} className="bg-[rgba(139,92,246,0.06)] rounded-xl p-2 text-center border border-[rgba(139,92,246,0.1)]">
                  <p className="text-gray-500">{k}</p>
                  <p className="text-white font-bold mt-0.5 truncate">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={e=>{e.stopPropagation();openEdit(a)}}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all">
                Edit
              </button>
              <button onClick={e=>{e.stopPropagation();toggle(a.id)}}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        a.status==='Active'
                          ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                          : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                      }`}>
                {a.status==='Active'?'Disable':'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={()=>setDetail(null)}>
          <div className="w-full max-w-sm rounded-3xl p-6 animate-slide-up dark-card"
               style={{ border: '1px solid rgba(139,92,246,0.3)' }}
               onClick={e=>e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl text-2xl flex items-center justify-center"
                   style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>👨‍💼</div>
              <div>
                <p className="text-white font-bold">{detail.name}</p>
                <p className="text-purple-400 text-xs">{detail.role}</p>
              </div>
            </div>
            {[['Project',detail.project],['City',detail.city],['Email',detail.email],['Meters',detail.meters],['Consumers',detail.consumers],['Last Login',detail.lastLogin],['Status',detail.status]].map(([l,v])=>(
              <div key={l} className="flex justify-between py-2.5 border-b border-[rgba(255,255,255,0.05)] text-sm">
                <span className="text-gray-500">{l}</span>
                <span className="text-white font-semibold">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-5">
              <button onClick={()=>openEdit(detail)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>Edit</button>
              <button onClick={()=>setDetail(null)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={()=>setModal(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 animate-slide-up dark-card"
               style={{ border: '1px solid rgba(139,92,246,0.3)' }}
               onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-5">{modal==='add'?'Add Admin':'Edit Admin'}</h3>
            <div className="space-y-3">
              <Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Rajesh Kumar" />
              <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="admin@project.com" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Project" value={form.project} onChange={e=>setForm({...form,project:e.target.value})} placeholder="Society Name" />
                <Input label="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Delhi" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                      style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                {modal==='add'?'Add Admin':'Save Changes'}
              </button>
              <button onClick={()=>setModal(null)} className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
