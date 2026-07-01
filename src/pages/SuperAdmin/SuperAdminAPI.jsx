import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const ENDPOINTS = [
  { method:'GET',    path:'/api/v1/meters',          calls:12540, latency:45,  uptime:99.9, status:'Healthy' },
  { method:'POST',   path:'/api/v1/readings',         calls:89200, latency:62,  uptime:99.8, status:'Healthy' },
  { method:'GET',    path:'/api/v1/consumers',        calls:5230,  latency:38,  uptime:100,  status:'Healthy' },
  { method:'POST',   path:'/api/v1/payments',         calls:3410,  latency:120, uptime:99.5, status:'Degraded' },
  { method:'GET',    path:'/api/v1/billing/invoices', calls:8920,  latency:55,  uptime:99.9, status:'Healthy' },
  { method:'PUT',    path:'/api/v1/meters/:id/relay', calls:1240,  latency:88,  uptime:99.7, status:'Healthy' },
  { method:'GET',    path:'/api/v1/alerts',           calls:2100,  latency:32,  uptime:100,  status:'Healthy' },
  { method:'POST',   path:'/api/v1/auth/login',       calls:4560,  latency:95,  uptime:100,  status:'Healthy' },
]

const API_KEYS = [
  { name:'Mobile App (Android)',  key:'bess_mob_a3f2...c9d1', created:'Jan 2024', lastUsed:'2 min ago',   calls:45200, status:'Active' },
  { name:'Mobile App (iOS)',      key:'bess_mob_b7e1...f2a4', created:'Jan 2024', lastUsed:'5 min ago',   calls:38900, status:'Active' },
  { name:'IoT Gateway — Delhi',   key:'bess_iot_c5d8...1e3b', created:'Mar 2024', lastUsed:'30 sec ago',  calls:89200, status:'Active' },
  { name:'IoT Gateway — Mumbai',  key:'bess_iot_d9f3...2c7e', created:'Apr 2024', lastUsed:'1 min ago',   calls:67100, status:'Active' },
  { name:'Finance Integration',   key:'bess_fin_e2a1...9d5f', created:'May 2024', lastUsed:'2 hours ago', calls:3200,  status:'Active' },
  { name:'Old Dashboard v1',      key:'bess_old_f8b4...7a2c', created:'Jun 2023', lastUsed:'3 months ago',calls:100,   status:'Revoked' },
]

const METHOD_COLOR = { GET:'bg-blue-500/20 text-blue-400', POST:'bg-emerald-500/20 text-emerald-400', PUT:'bg-amber-500/20 text-amber-400', DELETE:'bg-red-500/20 text-red-400' }

export default function SuperAdminAPI() {
  const [tab, setTab] = useState('endpoints')
  const { addToast } = useToast()
  const [showKey, setShowKey] = useState(null)

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Monitor</h1>
          <p className="text-gray-400 text-sm mt-0.5">Platform API health, usage & key management</p>
        </div>
        <button onClick={() => addToast('New API key generated!', 'success')}
                className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
          Generate Key
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:'Total Calls Today', val:'1,27,340', from:'#1d4ed8',to:'#1e40af' },
          { label:'Avg Latency',       val:'67ms',      from:'#065f46',to:'#064e3b' },
          { label:'Uptime',            val:'99.8%',     from:'#4c1d95',to:'#3b0764' },
          { label:'Active Keys',       val: API_KEYS.filter(k=>k.status==='Active').length, from:'#78350f',to:'#92400e' },
        ].map((s,i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white" style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 p-1 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)] w-fit">
        {['endpoints','api keys'].map(t => (
          <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${tab===t?'bg-purple-700 text-white':'text-gray-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {tab === 'endpoints' && (
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Endpoint Health</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  {['Method','Endpoint','Calls/Day','Avg Latency','Uptime','Status'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map((e,i) => (
                  <tr key={i} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(139,92,246,0.05)] transition-all">
                    <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${METHOD_COLOR[e.method]}`}>{e.method}</span></td>
                    <td className="py-3 px-3 text-purple-300 font-mono text-xs">{e.path}</td>
                    <td className="py-3 px-3 text-gray-300">{e.calls.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold text-sm ${e.latency<80?'text-emerald-400':e.latency<150?'text-amber-400':'text-red-400'}`}>{e.latency}ms</span>
                    </td>
                    <td className="py-3 px-3 text-gray-300">{e.uptime}%</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${e.status==='Healthy'?'bg-emerald-500/15 text-emerald-400 border-emerald-500/30':'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'api keys' && (
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">API Keys</h2>
          <div className="space-y-2">
            {API_KEYS.map((k,i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-[rgba(255,255,255,0.05)] dark-row">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm">{k.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${k.status==='Active'?'bg-emerald-500/20 text-emerald-400':'bg-red-500/20 text-red-400'}`}>{k.status}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{k.calls.toLocaleString()} calls</span>
                    <span>Created {k.created}</span>
                    <span>Last used {k.lastUsed}</span>
                  </div>
                  <p className="font-mono text-xs text-purple-400 mt-0.5">
                    {showKey===i ? 'bess_real_key_would_show_here_xxxx' : k.key}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowKey(showKey===i?null:i)} className="px-3 py-1.5 text-xs font-bold text-gray-400 border border-[rgba(255,255,255,0.08)] rounded-lg hover:text-white transition-all">{showKey===i?'Hide':'Show'}</button>
                  <button onClick={() => { navigator.clipboard?.writeText(k.key); addToast('Key copied!', 'success') }} className="px-3 py-1.5 text-xs font-bold text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all">Copy</button>
                  {k.status === 'Active' && <button onClick={() => addToast(`${k.name} key rotated!`, 'success')} className="px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-all">Rotate</button>}
                  {k.status === 'Active' && <button onClick={() => addToast(`${k.name} revoked`, 'warning')} className="px-3 py-1.5 text-xs font-bold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all">Revoke</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
