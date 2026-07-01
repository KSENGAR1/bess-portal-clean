import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const VERSIONS = [
  { ver:'v2.3.1', date:'Jun 15 2024', status:'Stable', meters:5234, notes:'Bug fix: MQTT reconnect loop, improved power factor logging' },
  { ver:'v2.3.0', date:'May 20 2024', status:'Stable', meters:0,    notes:'Feature: Remote relay control, OTA batch update support' },
  { ver:'v2.2.0', date:'Apr 10 2024', status:'Legacy', meters:186,  notes:'Feature: DG metering support, tamper detection v2' },
  { ver:'v2.1.0', date:'Feb 5 2024',  status:'Legacy', meters:340,  notes:'Performance: Faster data sync, memory optimisation' },
  { ver:'v2.0.5', date:'Jan 1 2024',  status:'EOL',    meters:44,   notes:'Hotfix: timestamp drift on RTC module' },
]

const PROJECTS = [
  { name:'ABC Residency', total:120, updated:120, pending:0,  ver:'v2.3.1' },
  { name:'XYZ Towers',    total:340, updated:340, pending:0,  ver:'v2.3.1' },
  { name:'Elite Heights', total:180, updated:150, pending:30, ver:'v2.3.0' },
  { name:'Green Valley',  total:210, updated:150, pending:60, ver:'v2.2.0' },
  { name:'Palm Court',    total:260, updated:216, pending:44, ver:'v2.0.5' },
]

const VER_BADGE = { Stable:'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', Legacy:'bg-amber-500/15 text-amber-400 border-amber-500/30', EOL:'bg-red-500/15 text-red-400 border-red-500/30' }

export default function SuperAdminFirmware() {
  const { addToast } = useToast()
  const [pushing, setPushing]     = useState(null)

  const push = proj => {
    setPushing(proj)
    setTimeout(() => { setPushing(null); addToast(`Firmware v2.3.1 queued for ${proj}`, 'success') }, 1500, 'success')
  }

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Firmware Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">OTA updates for all smart meters</p>
        </div>
        <button onClick={() => addToast('Upload new firmware version (demo)', 'info', 'success')}
                className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
          Upload Firmware
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'On Latest (v2.3.1)', val: VERSIONS[0].meters.toLocaleString(), from:'#065f46',to:'#064e3b' },
          { label:'Pending Update',     val: PROJECTS.reduce((a,b)=>a+b.pending,0), from:'#92400e',to:'#78350f' },
          { label:'EOL Firmware',       val: VERSIONS.find(v=>v.status==='EOL')?.meters || 0, from:'#991b1b',to:'#7f1d1d' },
        ].map((s,i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white" style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Version list */}
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Firmware Versions</h2>
          <div className="space-y-3">
            {VERSIONS.map(v => (
              <div key={v.ver} className="p-3 rounded-xl border border-[rgba(255,255,255,0.05)] dark-row">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold font-mono text-sm">{v.ver}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${VER_BADGE[v.status]}`}>{v.status}</span>
                  </div>
                  <span className="text-gray-500 text-xs">{v.date}</span>
                </div>
                <p className="text-gray-400 text-xs">{v.notes}</p>
                {v.meters > 0 && <p className="text-gray-500 text-xs mt-1">{v.meters.toLocaleString()} meters on this version</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Project rollout */}
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Rollout Status by Project</h2>
          <div className="space-y-4">
            {PROJECTS.map(p => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-white font-semibold text-sm">{p.name}</p>
                    <p className="text-gray-500 text-xs">{p.updated}/{p.total} updated · Current: {p.ver}</p>
                  </div>
                  {p.pending > 0 ? (
                    <button onClick={() => push(p.name)}
                            disabled={pushing === p.name}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                      {pushing === p.name ? '⏳ Queuing…' : `Push v2.3.1`}
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-xs font-bold">✓ Up to date</span>
                  )}
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{ width:`${(p.updated/p.total)*100}%`, background: p.pending>0?'#f59e0b':'#10b981' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
