import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const INIT = [
  { id:1, name:'ABC Residency',  city:'Delhi',   admins:2, towers:3, consumers:120, meters:120, revenue:452000, collection:94.7, status:'Active',   health:'Healthy',  since:'Jan 2022' },
  { id:2, name:'XYZ Towers',     city:'Noida',   admins:3, towers:4, consumers:340, meters:340, revenue:821500, collection:97.2, status:'Active',   health:'Healthy',  since:'Mar 2022' },
  { id:3, name:'Elite Heights',  city:'Gurgaon', admins:2, towers:2, consumers:180, meters:180, revenue:310200, collection:91.9, status:'Active',   health:'Degraded', since:'Jun 2022' },
  { id:4, name:'Green Valley',   city:'Lucknow', admins:2, towers:3, consumers:210, meters:210, revenue:580400, collection:96.7, status:'Active',   health:'Healthy',  since:'Sep 2022' },
  { id:5, name:'Sunrise Towers', city:'Mumbai',  admins:1, towers:2, consumers:95,  meters:95,  revenue:120000, collection:88.1, status:'Inactive', health:'Healthy',  since:'Dec 2022' },
]

const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

export default function CompanyAdminSocieties() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const [societies] = useState(INIT)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name:'', city:'' })

  const filtered = societies.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Societies</h1>
          <p className="text-gray-400 text-sm mt-0.5">{societies.length} societies under your company</p>
        </div>
        <button onClick={() => setShowAdd(true)}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>
          + Add Society
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total',         val: societies.length,                                  from:'#1d4ed8', to:'#1e40af' },
          { label:'Active',        val: societies.filter(s=>s.status==='Active').length,  from:'#065f46', to:'#064e3b' },
          { label:'Total Consumers', val: societies.reduce((a,b)=>a+b.consumers,0),       from:'#4c1d95', to:'#3b0764' },
          { label:'Total Meters',  val: societies.reduce((a,b)=>a+b.meters,0),            from:'#78350f', to:'#92400e' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)}
             placeholder="Search society or city…"
             className="w-full max-w-sm px-4 py-2.5 rounded-xl dark-card border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-emerald-500 placeholder-gray-500 transition-all" />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className={`${CARD} cursor-pointer hover:border-emerald-500/30 transition-all`}
               onClick={() => setSelected(s)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold">{s.name}</h3>
                <p className="text-gray-400 text-xs mt-0.5">📍 {s.city} · Since {s.since}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border flex-shrink-0 ${
                s.health === 'Healthy' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}>{s.health}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[['Admins',s.admins],['Towers',s.towers],['Consumers',s.consumers]].map(([l,v]) => (
                <div key={l} className="rounded-xl p-2.5 text-center dark-row border border-[rgba(255,255,255,0.05)]">
                  <p className="text-gray-400 text-[10px]">{l}</p>
                  <p className="text-white font-bold text-lg leading-tight">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.05)]">
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-emerald-400 font-bold text-sm">{sym}{s.revenue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Collection</p>
                <p className={`font-bold text-sm ${s.collection >= 95 ? 'text-emerald-400' : s.collection >= 90 ? 'text-amber-400' : 'text-red-400'}`}>
                  {s.collection}%
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                s.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
              }`}>● {s.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50"
             onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-sm dark-card border-l border-[rgba(5,150,105,0.3)] p-6 space-y-4 overflow-y-auto"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="space-y-2">
              {[['City', selected.city], ['Status', selected.status], ['Health', selected.health],
                ['Since', selected.since], ['Towers', selected.towers], ['Admins', selected.admins],
                ['Consumers', selected.consumers], ['Meters', selected.meters],
                ['Revenue', `${sym}${selected.revenue.toLocaleString()}`],
                ['Collection Rate', `${selected.collection}%`]
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className="text-gray-200 text-xs font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => { addToast(`Viewing society admin for ${selected.name}`, 'success'); setSelected(null) }}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>
                Contact Society Admin
              </button>
              <button onClick={() => setSelected(null)}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Society Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-3xl p-6 dark-card border border-[rgba(5,150,105,0.3)]"
               onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-5">Add New Society</h3>
            <div className="space-y-3">
              {['Society Name','City','Contact Email','Contact Phone'].map(f => (
                <div key={f}>
                  <label className="block text-xs text-gray-400 mb-1">{f}</label>
                  <input className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-emerald-500"/>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { addToast('✅ Society added!', 'success'); setShowAdd(false) }}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white"
                      style={{ background:'linear-gradient(135deg,#059669,#047857)' }}>Add</button>
              <button onClick={() => setShowAdd(false)}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
