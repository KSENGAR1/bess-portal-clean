import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const ORGS = [
  { id:1, name:'ABC Residency',    city:'Delhi',   projects:3, meters:120, admins:2, status:'Active',   revenue:'4,52,000', since:'Jan 2022' },
  { id:2, name:'XYZ Towers',       city:'Noida',   projects:2, meters:340, admins:3, status:'Active',   revenue:'8,21,500', since:'Mar 2022' },
  { id:3, name:'Elite Heights',    city:'Gurgaon', projects:1, meters:180, admins:2, status:'Active',   revenue:'3,10,200', since:'Jun 2022' },
  { id:4, name:'Green Valley',     city:'Lucknow', projects:2, meters:210, admins:2, status:'Active',   revenue:'5,80,400', since:'Sep 2022' },
  { id:5, name:'Sunrise Towers',   city:'Mumbai',  projects:1, meters:95,  admins:1, status:'Inactive', revenue:'1,20,000', since:'Dec 2022' },
  { id:6, name:'Palm Court',       city:'Pune',    projects:2, meters:260, admins:3, status:'Active',   revenue:'6,44,800', since:'Feb 2023' },
]

export default function SuperAdminOrganizations() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)


  const filtered = ORGS.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.city.toLowerCase().includes(search.toLowerCase())
  )

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Organizations</h1>
          <p className="text-gray-400 text-sm mt-0.5">{ORGS.length} registered organizations</p>
        </div>
        <button onClick={() => setShowAdd(true)}
                className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
          + Add Organization
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {label:'Total Orgs',     value: ORGS.length,                          from:'#1d4ed8',to:'#1e40af'},
          {label:'Active',         value: ORGS.filter(o=>o.status==='Active').length, from:'#065f46',to:'#064e3b'},
          {label:'Total Meters',   value: ORGS.reduce((a,b)=>a+b.meters,0),    from:'#4c1d95',to:'#3b0764'},
          {label:'Total Revenue',  value: `${sym}28.2L`,                         from:'#78350f',to:'#92400e'},
        ].map((s,i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white" style={{background:`linear-gradient(135deg,${s.from},${s.to})`}}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div className={CARD}>
        <div className="flex items-center gap-3 mb-4">
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Search by name or city…"
                 className="flex-1 px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-purple-500"/>
          <span className="text-gray-500 text-xs">{filtered.length} results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Organization','City','Projects','Meters','Admins','Revenue','Status',''].map(h=>(
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o=>(
                <tr key={o.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(139,92,246,0.06)] transition-all cursor-pointer"
                    onClick={()=>setSelected(selected===o.id?null:o.id)}>
                  <td className="py-3 px-3">
                    <p className="text-white font-semibold">{o.name}</p>
                    <p className="text-gray-500 text-xs">Since {o.since}</p>
                  </td>
                  <td className="py-3 px-3 text-gray-300">{o.city}</td>
                  <td className="py-3 px-3 text-gray-300 text-center">{o.projects}</td>
                  <td className="py-3 px-3 text-gray-300 text-center">{o.meters}</td>
                  <td className="py-3 px-3 text-gray-300 text-center">{o.admins}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{sym}{o.revenue}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${o.status==='Active'?'bg-emerald-500/15 text-emerald-400 border-emerald-500/30':'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button onClick={e=>{e.stopPropagation();addToast(`Viewing ${o.name}`, 'success')}}
                            className="text-purple-400 hover:text-purple-300 text-xs font-bold">View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={()=>setShowAdd(false)}>
          <div className="rounded-2xl p-6 w-full max-w-md space-y-4 dark-card border border-[rgba(139,92,246,0.3)]" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">Add Organization</h3>
            {['Organization Name','City','Contact Email','Contact Phone'].map(f=>(
              <div key={f}>
                <label className="block text-xs text-gray-400 mb-1">{f}</label>
                <input className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-purple-500"/>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={()=>{addToast('✅ Organization added!', 'success');setShowAdd(false)}}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white"
                      style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>Add</button>
              <button onClick={()=>setShowAdd(false)}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.04)] border border-gray-200 dark:border-[rgba(255,255,255,0.08)]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
