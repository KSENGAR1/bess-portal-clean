import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const BACKUPS = [
  { id:1, name:'Full System Backup',    date:'Today 2:00 AM',     size:'2.4 GB', type:'Auto',   status:'Success',  includes:['DB','Configs','Logs','Meter Data'] },
  { id:2, name:'Database Backup',       date:'Today 2:15 AM',     size:'840 MB', type:'Auto',   status:'Success',  includes:['DB'] },
  { id:3, name:'Pre-Firmware Snapshot', date:'Jun 25 11:00 AM',   size:'1.8 GB', type:'Manual', status:'Success',  includes:['DB','Configs','Meter Data'] },
  { id:4, name:'Full System Backup',    date:'Jun 24 2:00 AM',    size:'2.3 GB', type:'Auto',   status:'Success',  includes:['DB','Configs','Logs','Meter Data'] },
  { id:5, name:'Database Backup',       date:'Jun 23 2:15 AM',    size:'820 MB', type:'Auto',   status:'Failed',   includes:['DB'] },
  { id:6, name:'Full System Backup',    date:'Jun 23 2:00 AM',    size:'2.3 GB', type:'Auto',   status:'Success',  includes:['DB','Configs','Logs','Meter Data'] },
]

export default function SuperAdminBackup() {
  const { addToast } = useToast()
  const [running, setRunning] = useState(false)

  const triggerBackup = () => {
    setRunning(true)
    setTimeout(() => { setRunning(false); addToast('Manual backup completed successfully!', 'success') }, 2500, 'success')
  }

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Backup & Recovery</h1>
          <p className="text-gray-400 text-sm mt-0.5">Automated daily backups · Retention: 30 days</p>
        </div>
        <button onClick={triggerBackup} disabled={running}
                className="px-5 py-2 rounded-xl font-bold text-sm text-white disabled:opacity-50 flex items-center gap-2"
                style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
          {running ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Running…</> : '▶ Run Backup Now'}
        </button>
      </div>

      {/* Schedule info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { icon:'🗄️', title:'Full Backup',     freq:'Daily at 2:00 AM',     next:'Tomorrow 2:00 AM', color:'#7c3aed' },
          { icon:'💾', title:'DB Only Backup',  freq:'Daily at 2:15 AM',     next:'Tomorrow 2:15 AM', color:'#0066FF' },
          { icon:'☁️', title:'Cloud Sync',      freq:'Every 6 hours',        next:'In 2 hours',       color:'#059669' },
        ].map(s => (
          <div key={s.title} className={`${CARD} flex items-start gap-3`}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm">{s.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.freq}</p>
              <p className="text-xs mt-1 font-semibold" style={{color:s.color}}>Next: {s.next}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Backup history */}
      <div className={CARD}>
        <h2 className="text-base font-bold text-white mb-4">Backup History</h2>
        <div className="space-y-2">
          {BACKUPS.map(b => (
            <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl border border-[rgba(255,255,255,0.05)] dark-row">
              <span className={`text-lg flex-shrink-0 ${b.status==='Failed'?'grayscale':''}`}>
                {b.status==='Success'?'✅':'❌'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm">{b.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.type==='Auto'?'bg-blue-500/20 text-blue-400':'bg-purple-500/20 text-purple-400'}`}>{b.type}</span>
                </div>
                <div className="flex gap-3 mt-0.5">
                  <p className="text-gray-400 text-xs">{b.date}</p>
                  <p className="text-gray-500 text-xs">{b.size}</p>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {b.includes.map(inc => (
                    <span key={inc} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{inc}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {b.status === 'Success' && (
                  <>
                    <button onClick={() => addToast(`Downloading ${b.name}…`, 'info', 'success')}
                            className="px-3 py-1.5 text-xs font-bold text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all">
                      Download
                    </button>
                    <button onClick={() => addToast(`Restore initiated from ${b.date}`, 'info', 'success')}
                            className="px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-all">
                      Restore
                    </button>
                  </>
                )}
                {b.status === 'Failed' && (
                  <button onClick={() => addToast('Retry queued', 'info', 'success')}
                          className="px-3 py-1.5 text-xs font-bold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all">
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
