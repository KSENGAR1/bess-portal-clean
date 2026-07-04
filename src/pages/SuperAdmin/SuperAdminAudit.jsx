import { useState } from 'react'

const LOGS = [
  { id:1, action:'Tariff Updated',       user:'Super Admin',   role:'superadmin', module:'Tariff',    project:'ABC Residency', ip:'192.168.1.1',  time:'Today 10:45 AM',  severity:'High' },
  { id:2, action:'Admin Created',        user:'Super Admin',   role:'superadmin', module:'Users',     project:'XYZ Towers',    ip:'192.168.1.1',  time:'Today 9:30 AM',   severity:'High' },
  { id:3, action:'Bill Generated',       user:'System',        role:'system',     module:'Billing',   project:'All',           ip:'127.0.0.1',    time:'Today 8:00 AM',   severity:'Medium' },
  { id:4, action:'Consumer Suspended',   user:'Rajesh Admin',  role:'admin',      module:'Consumers', project:'ABC Residency', ip:'10.0.0.5',     time:'Yesterday 4:20 PM',severity:'High' },
  { id:5, action:'Report Exported',      user:'Finance Team',  role:'admin',      module:'Reports',   project:'XYZ Towers',    ip:'10.0.0.8',     time:'Yesterday 3:15 PM',severity:'Low' },
  { id:6, action:'Login Success',        user:'Priya Admin',   role:'admin',      module:'Auth',      project:'Elite Heights', ip:'10.0.0.12',    time:'Yesterday 2:00 PM',severity:'Low' },
  { id:7, action:'Login Failed (3x)',    user:'Unknown',       role:'unknown',    module:'Auth',      project:'—',             ip:'203.45.67.89', time:'Yesterday 1:45 PM',severity:'Critical' },
  { id:8, action:'Firmware Pushed',      user:'Super Admin',   role:'superadmin', module:'Firmware',  project:'Green Valley',  ip:'192.168.1.1',  time:'Jun 25 11:00 AM', severity:'High' },
  { id:9, action:'Backup Created',       user:'System',        role:'system',     module:'Backup',    project:'All',           ip:'127.0.0.1',    time:'Jun 25 2:00 AM',  severity:'Low' },
  { id:10,action:'API Key Rotated',      user:'Super Admin',   role:'superadmin', module:'API',       project:'—',             ip:'192.168.1.1',  time:'Jun 24 5:30 PM',  severity:'High' },
]

const SEV = {
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  High:     'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Medium:   'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  Low:      'bg-blue-500/15 text-blue-400 border-blue-500/30',
}

export default function SuperAdminAudit() {
  const [search, setSearch] = useState('')
  const [sevFilter, setSevFilter] = useState('All')

  const filtered = LOGS.filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase())
    const matchSev = sevFilter === 'All' || l.severity === sevFilter
    return matchSearch && matchSev
  })

  const exportCSV = () => {
    const rows = [['Action','User','Role','Module','Project','IP','Time','Severity'],
      ...filtered.map(l=>[l.action,l.user,l.role,l.module,l.project,l.ip,l.time,l.severity])]
    const csv = rows.map(r=>r.join(',')).join('\n')
    const a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv)
    a.download='audit_logs.csv'; a.click()
  }

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-gray-400 text-sm mt-0.5">Complete history of all admin and system actions</p>
        </div>
        <button onClick={exportCSV}
                className="px-4 py-2 rounded-xl text-xs font-bold text-purple-300 border border-purple-500/40 hover:bg-purple-500/10 transition-all">
          ↓ Export CSV
        </button>
      </div>

      {/* Severity stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['Critical','#ef4444'],['High','#f97316'],['Medium','#eab308'],['Low','#3b82f6']].map(([s,c])=>(
          <div key={s} className="rounded-2xl p-4 border dark-card border-[rgba(255,255,255,0.06)]">
            <p className="text-xs font-bold mb-1" style={{color:c}}>{s}</p>
            <p className="text-2xl font-extrabold text-white">{LOGS.filter(l=>l.severity===s).length}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
        <div className="flex flex-wrap gap-3 mb-4">
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Search action, user, module…"
                 className="flex-1 min-w-[200px] px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-purple-500"/>
          <div className="flex gap-1 p-1 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)] flex-wrap">
            {['All','Critical','High','Medium','Low'].map(s=>(
              <button key={s} onClick={()=>setSevFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sevFilter===s?'bg-purple-700 text-white':'text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Action','User','Module','Project','IP','Time','Severity'].map(h=>(
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l=>(
                <tr key={l.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(139,92,246,0.05)] transition-all">
                  <td className="py-3 px-3 text-white font-semibold text-sm">{l.action}</td>
                  <td className="py-3 px-3">
                    <p className="text-gray-200 text-sm">{l.user}</p>
                    <p className="text-gray-500 text-xs capitalize">{l.role}</p>
                  </td>
                  <td className="py-3 px-3 text-gray-300 text-sm">{l.module}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{l.project}</td>
                  <td className="py-3 px-3 text-gray-500 text-xs font-mono">{l.ip}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{l.time}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${SEV[l.severity]}`}>{l.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">Showing {filtered.length} of {LOGS.length} entries</p>
      </div>
    </div>
  )
}
