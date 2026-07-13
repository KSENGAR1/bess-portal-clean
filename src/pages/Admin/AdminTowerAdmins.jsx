import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const INIT_TOWER_ADMINS = [
  {
    id: 1, name: 'Mohan Sharma',   email: 'mohan@abcresidency.com',  phone: '98100-11001',
    tower: 'Tower A', flats: 32, residents: 30, status: 'Active',  lastLogin: '10 min ago',
    collection: 94.2, pendingBills: 2, offlineMeters: 0, alerts: 1, since: 'Jan 2023',
  },
  {
    id: 2, name: 'Sunita Rao',     email: 'sunita@abcresidency.com', phone: '98100-22002',
    tower: 'Tower B', flats: 28, residents: 27, status: 'Active',  lastLogin: '2 hours ago',
    collection: 97.8, pendingBills: 1, offlineMeters: 0, alerts: 0, since: 'Mar 2023',
  },
  {
    id: 3, name: 'Deepak Verma',   email: 'deepak@abcresidency.com', phone: '98100-33003',
    tower: 'Tower C', flats: 30, residents: 28, status: 'Active',  lastLogin: '1 day ago',
    collection: 88.5, pendingBills: 4, offlineMeters: 1, alerts: 3, since: 'Jun 2023',
  },
  {
    id: 4, name: 'Kaveri Singh',   email: 'kaveri@abcresidency.com', phone: '98100-44004',
    tower: 'Tower D', flats: 25, residents: 22, status: 'Inactive', lastLogin: '5 days ago',
    collection: 91.0, pendingBills: 3, offlineMeters: 0, alerts: 0, since: 'Sep 2023',
  },
]

const TOWERS = ['Tower A', 'Tower B', 'Tower C', 'Tower D', 'Tower E']
const EMPTY_FORM = { name: '', email: '', phone: '', tower: 'Tower A', status: 'Active' }

const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
    <input {...props}
           className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500 transition-all placeholder-gray-600" />
  </div>
)

export default function AdminTowerAdmins() {
  const { addToast } = useToast()
  const [admins, setAdmins]   = useState(INIT_TOWER_ADMINS)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('All')
  const [modal, setModal]     = useState(null)   // null | 'add' | admin-obj for edit
  const [detail, setDetail]   = useState(null)
  const [form, setForm]       = useState(EMPTY_FORM)

  const filtered = admins
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a => [a.name, a.tower, a.email].some(v => v.toLowerCase().includes(search.toLowerCase())))

  const openAdd  = () => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = (a) => { setForm({ name: a.name, email: a.email, phone: a.phone, tower: a.tower, status: a.status }); setModal(a) }

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return
    if (modal === 'add') {
      setAdmins(prev => [...prev, {
        ...form, id: Date.now(), flats: 0, residents: 0,
        lastLogin: 'Never', collection: 0, pendingBills: 0,
        offlineMeters: 0, alerts: 0, since: new Date().toLocaleDateString('en-IN', { month:'short', year:'numeric' }),
      }])
      addToast(`✅ Tower Admin "${form.name}" added for ${form.tower}!`, 'success')
    } else {
      setAdmins(prev => prev.map(a => a.id === modal.id
        ? { ...a, name: form.name, email: form.email, phone: form.phone, tower: form.tower, status: form.status }
        : a
      ))
      addToast(`✅ "${form.name}" updated!`, 'success')
    }
    setModal(null)
  }

  const toggleStatus = (id) => {
    setAdmins(prev => prev.map(a => a.id === id
      ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' }
      : a
    ))
    const a = admins.find(x => x.id === id)
    addToast(`${a.status === 'Active' ? '⛔ Disabled' : '✅ Enabled'}: ${a.name}`, 'success')
    setDetail(null)
  }

  const sendReset = (a) => {
    addToast(`🔑 Password reset link sent to ${a.email}`, 'success')
  }

  const totalResidents  = admins.reduce((s, a) => s + a.residents, 0)
  const totalAlerts     = admins.reduce((s, a) => s + a.alerts, 0)
  const totalPending    = admins.reduce((s, a) => s + a.pendingBills, 0)
  const avgCollection   = admins.length
    ? (admins.filter(a => a.status === 'Active').reduce((s, a) => s + a.collection, 0) /
       admins.filter(a => a.status === 'Active').length).toFixed(1)
    : 0

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

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Tower Admin Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage tower admins for ABC Residency</p>
        </div>
        <button onClick={openAdd}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#d97706,#b45309)' }}>
          + Add Tower Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Tower Admins',     val: admins.length,                                  from:'#1d4ed8', to:'#1e40af' },
          { label:'Active',           val: admins.filter(a=>a.status==='Active').length,  from:'#065f46', to:'#064e3b' },
          { label:'Avg Collection',   val: `${avgCollection}%`,                            from:'#4c1d95', to:'#3b0764' },
          { label:'Pending Bills',    val: totalPending,                                   from:'#92400e', to:'#78350f' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Alerts banner */}
      {totalAlerts > 0 && (
        <div className="rounded-2xl p-4 flex items-center gap-3 border"
             style={{ background:'rgba(245,158,11,0.08)', borderColor:'rgba(245,158,11,0.25)' }}>
          <span className="text-2xl">⚠️</span>
          <p className="text-amber-400 font-semibold text-sm">
            {totalAlerts} unresolved alert{totalAlerts > 1 ? 's' : ''} across towers —
            <button className="underline ml-1" onClick={() => {}}>review with tower admins</button>
          </p>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)}
               placeholder="Search name, tower, email…"
               className="flex-1 min-w-48 px-4 py-2.5 rounded-xl dark-card border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-amber-500 placeholder-gray-500 transition-all" />
        {['All', 'Active', 'Inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === f ? 'text-white' : 'dark-card text-gray-400 border border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}
                  style={filter === f ? { background:'linear-gradient(135deg,#d97706,#b45309)' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {/* Tower Admin cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(a => (
          <div key={a.id} className={`${CARD} hover:border-amber-500/30 transition-all cursor-pointer`}
               onClick={() => setDetail(a)}>

            {/* Top row */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                   style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>🏗️</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-bold text-sm">{a.name}</p>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                    a.status === 'Active'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>{a.status}</span>
                </div>
                <p className="text-amber-400 text-xs mt-0.5 font-semibold">{a.tower}</p>
                <p className="text-gray-500 text-xs">{a.email}</p>
              </div>
              {a.alerts > 0 && (
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {a.alerts}
                </span>
              )}
            </div>

            {/* Stats mini grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                ['Flats',       a.flats],
                ['Residents',   a.residents],
                ['Collection',  `${a.collection}%`],
                ['Pending',     a.pendingBills],
              ].map(([label, val]) => (
                <div key={label} className="rounded-xl p-2 text-center dark-row border border-[rgba(255,255,255,0.05)]">
                  <p className="text-gray-500 text-[9px] font-semibold uppercase">{label}</p>
                  <p className={`text-sm font-extrabold mt-0.5 ${
                    label === 'Collection' && parseFloat(a.collection) < 90 ? 'text-red-400'
                    : label === 'Pending' && a.pendingBills > 2 ? 'text-amber-400'
                    : label === 'Collection' && a.offlineMeters > 0 ? 'text-amber-400'
                    : 'text-white'
                  }`}>{val}</p>
                </div>
              ))}
            </div>

            {/* Offline meters warning */}
            {a.offlineMeters > 0 && (
              <div className="mb-3 px-3 py-2 rounded-lg text-xs text-red-400 font-semibold"
                   style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                ❌ {a.offlineMeters} offline meter{a.offlineMeters > 1 ? 's' : ''} in this tower
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.05)]">
              <p className="text-gray-600 text-xs">Last login: {a.lastLogin}</p>
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button onClick={() => openEdit(a)}
                        className="px-3 py-1.5 text-xs font-bold text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all">
                  Edit
                </button>
                <button onClick={() => toggleStatus(a.id)}
                        className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-all ${
                          a.status === 'Active'
                            ? 'text-red-400 border-red-500/30 hover:bg-red-500/10'
                            : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                        }`}>
                  {a.status === 'Active' ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">🏗️</p>
            <p className="text-sm font-medium">No tower admins match this filter.</p>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50"
             onClick={() => setDetail(null)}>
          <div className="h-full w-full max-w-sm dark-card border-l border-[rgba(245,158,11,0.3)] p-6 space-y-4 overflow-y-auto"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{detail.name}</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>

            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                 style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>🏗️</div>

            <div className="space-y-2">
              {[
                ['Tower',          detail.tower],
                ['Email',          detail.email],
                ['Phone',          detail.phone],
                ['Status',         detail.status],
                ['Flats',          detail.flats],
                ['Residents',      detail.residents],
                ['Collection',     `${detail.collection}%`],
                ['Pending Bills',  detail.pendingBills],
                ['Offline Meters', detail.offlineMeters],
                ['Alerts',         detail.alerts],
                ['Last Login',     detail.lastLogin],
                ['Admin Since',    detail.since],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className={`text-xs font-semibold ${
                    k === 'Status' && v === 'Active' ? 'text-emerald-400'
                    : k === 'Status' ? 'text-gray-400'
                    : k === 'Offline Meters' && v > 0 ? 'text-red-400'
                    : k === 'Alerts' && v > 0 ? 'text-amber-400'
                    : 'text-gray-200'
                  }`}>{v}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => { openEdit(detail); setDetail(null) }}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
                Edit Admin
              </button>
              <button onClick={() => { sendReset(detail); setDetail(null) }}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 transition-all">
                🔑 Send Password Reset
              </button>
              <button onClick={() => toggleStatus(detail.id)}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        detail.status === 'Active'
                          ? 'text-red-400 border-red-500/30 hover:bg-red-500/10'
                          : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                      }`}>
                {detail.status === 'Active' ? '⛔ Disable Admin' : '✅ Enable Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 dark-card border border-[rgba(245,158,11,0.25)]"
               onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-5">
              {modal === 'add' ? 'Add Tower Admin' : `Edit — ${modal.name}`}
            </h3>
            <div className="space-y-3">
              <Input label="Full Name" value={form.name}
                     onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mohan Sharma" />
              <Input label="Email" type="email" value={form.email}
                     onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@society.com" />
              <Input label="Phone" value={form.phone}
                     onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="98100-XXXXX" />
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Assign Tower</label>
                <select value={form.tower} onChange={e => setForm({ ...form, tower: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500">
                  {TOWERS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {modal !== 'add' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save}
                      disabled={!form.name.trim() || !form.email.trim()}
                      className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40 transition-all"
                      style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
                {modal === 'add' ? 'Add Admin' : 'Save Changes'}
              </button>
              <button onClick={() => setModal(null)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
