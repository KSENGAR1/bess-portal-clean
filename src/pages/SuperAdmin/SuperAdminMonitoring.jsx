import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

const SERVICES = [
  { name:'Database (PostgreSQL)', status:'Healthy',  uptime:'99.98%', latency:'4ms',   load:28,  icon:'🗄️' },
  { name:'API Gateway',           status:'Healthy',  uptime:'99.95%', latency:'12ms',  load:45,  icon:'🔌' },
  { name:'MQTT Broker',           status:'Healthy',  uptime:'99.99%', latency:'8ms',   load:62,  icon:'📡' },
  { name:'Redis Cache',           status:'Degraded', uptime:'98.10%', latency:'156ms', load:88,  icon:'⚡' },
  { name:'Kafka Streams',         status:'Healthy',  uptime:'99.90%', latency:'18ms',  load:55,  icon:'🌊' },
  { name:'Payment Gateway',       status:'Healthy',  uptime:'99.99%', latency:'210ms', load:15,  icon:'💳' },
  { name:'Notification Service',  status:'Healthy',  uptime:'99.80%', latency:'35ms',  load:22,  icon:'🔔' },
  { name:'Object Storage (S3)',    status:'Healthy',  uptime:'100%',   latency:'55ms',  load:8,   icon:'💾' },
]

const genTrend = () => Array.from({length:20}, (_,i) => ({
  t: i, cpu: 20+Math.random()*40, mem: 40+Math.random()*30, req: 800+Math.random()*600
}))

export default function SuperAdminMonitoring() {
  const [trend, setTrend] = useState(genTrend())
  const [tick, setTick]   = useState(0)
  const { tooltipStyleSuperAdmin, gridStrokeSA, axisStrokeSA, tickFill } = useChartTheme()

  // Simulate live updates
  useEffect(() => {
    const id = setInterval(() => {
      setTrend(prev => {
        const next = [...prev.slice(1), { t: prev[prev.length-1].t+1, cpu: 20+Math.random()*40, mem: 40+Math.random()*30, req: 800+Math.random()*600 }]
        return next
      })
      setTick(t => t+1)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const cpu = Math.round(trend[trend.length-1].cpu)
  const mem = Math.round(trend[trend.length-1].mem)
  const rps = Math.round(trend[trend.length-1].req)

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(139,92,246,0.15)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Monitoring</h1>
          <p className="text-gray-400 text-sm mt-0.5">Real-time infrastructure health</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs dark-card border border-[rgba(139,92,246,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300">Live · updates every 3s</span>
        </div>
      </div>

      {/* Live vitals */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'CPU Usage',    value:`${cpu}%`,  icon:'⚙️', from: cpu>75?'#991b1b':'#1d4ed8', to: cpu>75?'#7f1d1d':'#1e40af', warn: cpu>75 },
          { label:'Memory',       value:`${mem}%`,  icon:'🧠', from: mem>80?'#92400e':'#065f46', to: mem>80?'#78350f':'#064e3b', warn: mem>80 },
          { label:'Requests / s', value:`${rps}`,   icon:'🌐', from:'#4c1d95', to:'#3b0764', warn:false },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 relative overflow-hidden keep-white ${s.warn?'ring-2 ring-red-500/50':''}`}
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <div className="absolute right-3 top-3 text-2xl opacity-20">{s.icon}</div>
            <p className="text-xs text-white/70 font-medium">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
            {s.warn && <p className="text-red-300 text-[10px] mt-1 font-bold">⚠ HIGH</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={CARD}>
          <h2 className="text-sm font-bold text-white mb-4">CPU + Memory Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeSA} />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0,100]} stroke={axisStrokeSA} tick={{fontSize:10,fill:tickFill}} tickFormatter={v=>`${v}%`} />
              <Tooltip contentStyle={tooltipStyleSuperAdmin} />
              <Line type="monotone" dataKey="cpu" stroke="#60a5fa" strokeWidth={2} dot={false} name="CPU %" />
              <Line type="monotone" dataKey="mem" stroke="#a78bfa" strokeWidth={2} dot={false} name="Memory %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={CARD}>
          <h2 className="text-sm font-bold text-white mb-4">Requests / second</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeSA} />
              <XAxis dataKey="t" hide />
              <YAxis stroke={axisStrokeSA} tick={{fontSize:10,fill:tickFill}} />
              <Tooltip contentStyle={tooltipStyleSuperAdmin} />
              <Area type="monotone" dataKey="req" stroke="#8b5cf6" fill="url(#reqGrad)" strokeWidth={2} name="Req/s" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service health */}
      <div className={CARD}>
        <h2 className="text-base font-bold text-white mb-4">Service Health</h2>
        <div className="space-y-3">
          {SERVICES.map((svc,i) => (
            <div key={i} className="dark-row rounded-xl p-3 border border-[rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{svc.icon}</span>
                <p className="text-white font-semibold text-sm flex-1">{svc.name}</p>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                  svc.status==='Healthy'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>{svc.status}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 dark-row rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{ width:`${svc.load}%`, background: svc.load>80?'#ef4444': svc.load>60?'#f59e0b':'#10b981' }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{svc.load}%</span>
                <span className="text-xs text-gray-500">{svc.latency}</span>
                <span className="text-xs text-gray-500">{svc.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
