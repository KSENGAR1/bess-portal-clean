import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const INIT = [
  { id:1, name:'ABC Residency',  city:'Delhi',   meters:120, admins:2, consumers:120, health:'Healthy',  status:'Active',   since:'Jan 2022', energy:'1,245 kWh', revenue:'4,52,000' },
  { id:2, name:'XYZ Towers',     city:'Noida',   meters:340, admins:3, consumers:340, health:'Healthy',  status:'Active',   since:'Mar 2022', energy:'3,820 kWh', revenue:'8,21,500' },
  { id:3, name:'Elite Heights',  city:'Gurgaon', meters:180, admins:2, consumers:180, health:'Degraded', status:'Active',   since:'Jun 2022', energy:'1,890 kWh', revenue:'3,10,200' },
  { id:4, name:'Green Valley',   city:'Lucknow', meters:210, admins:2, consumers:210, health:'Healthy',  status:'Active',   since:'Sep 2022', energy:'2,340 kWh', revenue:'5,80,400' },
  { id:5, name:'Palm Court',     city:'Pune',    meters:260, admins:3, consumers:255, health:'Healthy',  status:'Active',   since:'Feb 2023', energy:'2,780 kWh', revenue:'6,44,800' },
  { id:6, name:'Sunrise Towers', city:'Mumbai',  meters:95,  admins:1, consumers:90,  health:'Healthy',  status:'Inactive', since:'Dec 2022', energy:'0 kWh',     revenue:'1,20,000' },
]

const HEALTH_STYLE = {
  Healthy:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Degraded: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Offline:  'bg-red-500/15 text-red-400 border-red-500/30',
}

const Input = ({ label, value, onChange, placeholder, type='text' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
           className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder-gray-600"/>
  </div>
)

const EMPTY_FORM = { name:'', city:'', admins:'1', meters:'0' }

export default function SuperAdminProjects() {
  const [projects, setProjects] = useState(INIT)
  const { addToast } = useToast()
  const [search, setSearch]     = useState('')
  const [detail, setDetail]     = useState(null)
  const [modal, setModal]       = useState(null) // 'add' | project-id
  const [form, setForm]         = useState(EMPTY_FORM)

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd  = ()  => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = (p) => { setForm({ name:p.name, city:p.city, admins:String(p.admins), meters:String(p.meters) }); setModal(p.id) }

  const save = () => {
    if (!form.name.trim() || !form.city.trim()) return
    if (modal === 'add') {
      setProjects(prev => [{ id: Date.now(), ...form, admins:+form.admins, meters:+form.meters,
        consumers:0, health:'Healthy', status:'Active',
        since: new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}),
        energy:'0 kWh', revenue:'0' }, ...prev])
      addToast(`✅ Project "${form.name}" created!`, 'success')
    } else {
      setProjects(prev => prev.map(p => p.id === modal ? { ...p, name:form.name, city:form.city, admins:+form.admins } : p))
      addToast(`✅ Project updated!`, 'success')
    }
    setModal(null)
  }

  const toggleStatus = (id) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p)
      const p = updated.find(x => x.id === id)
      addToast(`${p.status === 'Active' ? '✅ Activated' : '⛔ Deactivated'}: ${p.name}`, 'success')
      return updated
    })
    setDetail(null)
  }

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 text-sm mt-0.5">{projects.length} projects · {projects.filter(p=>p.status==='Active').length} active</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
          + Create Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Projects', val:projects.length,                                    from:'#1d4ed8',to:'#1e40af' },
          { label:'Active',         val:projects.filter(p=>p.status==='Active').length,     from:'#065f46',to:'#064e3b' },
          { label:'Total Meters',   val:projects.reduce((a,b)=>a+b.meters,0).toLocaleString(), from:'#4c1d95',to:'#3b0764' },
          { label:'Degraded',       val:projects.filter(p=>p.health==='Degraded').length,  from:'#92400e',to:'#78350f' },
        ].map((s,i)=>(
          <div key={i} className="rounded-2xl p-4 text-white keep-white" style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Search + grid */}
      <div>
        <input value={search} onChange={e=>setSearch(e.target.value)}
               placeholder="Search project or city…"
               className="w-full max-w-sm px-3 py-2 rounded-xl dark-card border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-purple-500 mb-4 placeholder-gray-600"/>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className={`${CARD} cursor-pointer hover:border-purple-500/40 transition-all`}
                 onClick={() => setDetail(p)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold">{p.name}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">📍 {p.city} · Since {p.since}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border flex-shrink-0 ${HEALTH_STYLE[p.health]}`}>{p.health}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[['Meters',p.meters],['Admins',p.admins],['Users',p.consumers]].map(([l,v])=>(
                  <div key={l} className="rounded-xl p-2.5 text-center dark-row border border-[rgba(255,255,255,0.05)]">
                    <p className="text-gray-400 text-[10px]">{l}</p>
                    <p className="text-white font-bold text-lg leading-tight">{v}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status==='Active'?'bg-emerald-500/15 text-emerald-400':'bg-gray-500/20 text-gray-400'}`}>
                  ● {p.status}
                </span>
                <div className="flex gap-2" onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>openEdit(p)}
                          className="px-3 py-1.5 text-xs font-bold text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all">
                    Edit
                  </button>
                  <button onClick={()=>toggleStatus(p.id)}
                          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-all ${p.status==='Active'?'text-red-400 border-red-500/30 hover:bg-red-500/10':'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'}`}>
                    {p.status==='Active'?'Disable':'Enable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50" onClick={()=>setDetail(null)}>
          <div className="h-full w-full max-w-sm dark-card border-l border-[rgba(139,92,246,0.3)] p-6 space-y-4 overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{detail.name}</h3>
              <button onClick={()=>setDetail(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${HEALTH_STYLE[detail.health]}`}>{detail.health}</span>
            <div className="space-y-2">
              {[['City',detail.city],['Status',detail.status],['Since',detail.since],['Meters',detail.meters],['Admins',detail.admins],['Consumers',detail.consumers],["Today's Energy",detail.energy],['Revenue',detail.revenue]].map(([k,v])=>(
                <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className="text-gray-200 text-xs font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={()=>{openEdit(detail);setDetail(null)}} className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>Edit Project</button>
              <button onClick={()=>toggleStatus(detail.id)} className={`w-full py-2.5 rounded-xl text-sm font-bold border transition-all ${detail.status==='Active'?'text-red-400 border-red-500/30 hover:bg-red-500/10':'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'}`}>
                {detail.status==='Active'?'Disable Project':'Enable Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={()=>setModal(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 animate-slide-up dark-card border border-[rgba(139,92,246,0.3)]" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-5">{modal==='add'?'Create New Project':'Edit Project'}</h3>
            <div className="space-y-3">
              <Input label="Project Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ABC Residency"/>
              <Input label="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Delhi"/>
              <div className="grid grid-cols-2 gap-3">
                <Input label="No. of Admins" type="number" value={form.admins} onChange={e=>setForm({...form,admins:e.target.value})} placeholder="2"/>
                <Input label="Initial Meters" type="number" value={form.meters} onChange={e=>setForm({...form,meters:e.target.value})} placeholder="100"/>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={save} disabled={!form.name.trim()||!form.city.trim()} className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40" style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
                {modal==='add'?'Create Project':'Save Changes'}
              </button>
              <button onClick={()=>setModal(null)} className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.04)] border border-gray-200 dark:border-[rgba(255,255,255,0.08)]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
