import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const ROLES = [
  { id:1, name:'Super Admin', users:2, color:'#7c3aed', desc:'Full platform access — all modules, all projects', perms:['All Organizations','All Projects','Billing Config','Tariff Management','User Management','Firmware Updates','API Keys','Audit Logs','System Logs'] },
  { id:2, name:'Society Admin', users:12, color:'#d97706', desc:'Manage one society — consumers, meters, billing', perms:['Own Project Consumers','Own Project Meters','Billing (own)','Payment Reports','Complaints','Alerts','Notices','Settings (own)'] },
  { id:3, name:'Resident', users:5420, color:'#0066FF', desc:'Self-service portal — usage, invoices, wallet', perms:['View Own Usage','View Own Invoices','Wallet Top-up','Raise Complaints','View Notices','Update Profile'] },
  { id:4, name:'Read-Only Admin', users:3, color:'#059669', desc:'View-only access to all admin data', perms:['View Consumers','View Meters','View Reports','View Billing','View Payments'] },
]

export default function SuperAdminRoles() {
  const [selected, setSelected] = useState(ROLES[0])
  const { addToast } = useToast()

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl animate-slide-up"
             style={{background:'linear-gradient(135deg,#065f46,#047857)'}}>
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage access levels across the platform</p>
        </div>
        <button onClick={() => addToast('✅ Custom role creation coming soon!', 'success')}
                className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
          + Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Role list */}
        <div className="space-y-2">
          {ROLES.map(r => (
            <button key={r.id} onClick={() => setSelected(r)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all dark-card ${
                      selected.id===r.id ? 'border-purple-500' : 'border-[rgba(255,255,255,0.06)]'
                    }`}
                    style={selected.id===r.id ? { background:'rgba(124,58,237,0.12)' } : {}}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                     style={{background:`${r.color}33`, border:`1px solid ${r.color}55`, color: r.color}}>
                  {r.name.split(' ').map(w=>w[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.users.toLocaleString()} users</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Permission detail */}
        <div className="lg:col-span-2 rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full" style={{background:selected.color}}/>
                <h2 className="text-lg font-bold text-white">{selected.name}</h2>
              </div>
              <p className="text-gray-400 text-sm">{selected.desc}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{background:`${selected.color}20`, color:selected.color, border:`1px solid ${selected.color}40`}}>
              {selected.users.toLocaleString()} users
            </span>
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Permissions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selected.perms.map(p => (
              <div key={p} className="flex items-center gap-2 p-3 rounded-xl border border-[rgba(255,255,255,0.05)] dark-row">
                <span className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{background:`${selected.color}25`, color:selected.color}}>✓</span>
                <span className="text-white text-sm">{p}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-5 pt-5 border-t border-[rgba(255,255,255,0.06)]">
            <button onClick={() => addToast(`✏️ Editing ${selected.name} (demo)`, 'success')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                    style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
              Edit Permissions
            </button>
            {selected.id > 2 && (
              <button onClick={() => addToast(`🗑️ Delete role (demo)`, 'success')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 border border-red-500/30 hover:bg-red-500/10 transition-all">
                Delete Role
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
