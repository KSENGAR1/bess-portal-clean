import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useCurrency } from '../../context/CurrencyContext'
import { useChartTheme } from '../../utils/chartTheme'
import { useToast } from '../../components/ToastProvider'

const REPORT_LIST = [
  { name:'Monthly Consumption Report', type:'PDF',   date:'Jun 2024',  size:'2.3 MB', icon:'📊' },
  { name:'Revenue & Collection Report',type:'PDF',   date:'Jun 2024',  size:'1.8 MB', icon:'💰' },
  { name:'Meter Health Report',         type:'Excel', date:'Jun 2024',  size:'856 KB', icon:'⚡' },
  { name:'Billing Summary',             type:'PDF',   date:'Jun 2024',  size:'1.2 MB', icon:'📋' },
  { name:'Consumer Analytics',          type:'PDF',   date:'May 2024',  size:'3.1 MB', icon:'👥' },
  { name:'Alerts & Incidents Log',      type:'CSV',   date:'May 2024',  size:'445 KB', icon:'🚨' },
]

const MONTHLY = [
  { m:'Jan', units:1820, rev:452000 }, { m:'Feb', units:1950, rev:498000 },
  { m:'Mar', units:1780, rev:441000 }, { m:'Apr', units:2100, rev:521000 },
  { m:'May', units:1990, rev:494000 }, { m:'Jun', units:2240, rev:552000 },
]

const DAILY = [
  { d:'Mon', units:68 }, { d:'Tue', units:75 }, { d:'Wed', units:62 },
  { d:'Thu', units:80 }, { d:'Fri', units:72 }, { d:'Sat', units:58 }, { d:'Sun', units:45 },
]

export default function AdminReports() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const { addToast } = useToast()
  const [generating, setGenerating] = useState(null)

  const generate = type => {
    setGenerating(type)
    setTimeout(() => { setGenerating(null); addToast(`${type} generated & ready to download!`, 'success') }, 1800)
  }

  const exportCSV = (data, filename, headers) => {
    const rows = [headers, ...data.map(r => headers.map(h => r[h] ?? r[Object.keys(r)[headers.indexOf(h)]] ?? ''))]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = filename; a.click()
    addToast(`${filename} downloaded!`, 'success')
  }

  const exportConsumers = () => {
    const data = [
      {Flat:'301-A',Owner:'Rajesh Kumar',Meter:'MTR-001',Units:'245',Amount:'2940',Status:'Paid'},
      {Flat:'302-A',Owner:'Priya Singh',Meter:'MTR-002',Units:'188',Amount:'2256',Status:'Unpaid'},
      {Flat:'303-A',Owner:'Amit Patel',Meter:'MTR-003',Units:'210',Amount:'2520',Status:'Paid'},
      {Flat:'401-B',Owner:'Neha Gupta',Meter:'MTR-004',Units:'195',Amount:'2340',Status:'Paid'},
      {Flat:'402-B',Owner:'Vikram Singh',Meter:'MTR-005',Units:'232',Amount:'2784',Status:'Pending'},
    ]
    exportCSV(data, 'consumer_report.csv', ['Flat','Owner','Meter','Units','Amount','Status'])
  }

  const exportRevenue = () => {
    const data = MONTHLY.map(m => ({Month:m.m, Units:m.units, Revenue:m.rev}))
    exportCSV(data, 'revenue_report.csv', ['Month','Units','Revenue'])
  }

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 text-sm mt-0.5">ABC Residency · generate and download detailed reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportConsumers}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-all">
            ↓ Consumer CSV
          </button>
          <button onClick={exportRevenue}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 transition-all">
            ↓ Revenue CSV
          </button>
        </div>
      </div>

      {/* Quick generate */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Monthly Report',    icon:'📊', type:'Monthly Report',    from:'#1d4ed8',to:'#1e40af' },
          { label:'Revenue Report',    icon:'💰', type:'Revenue Report',    from:'#065f46',to:'#064e3b' },
          { label:'Consumption',       icon:'⚡', type:'Consumption Report',from:'#92400e',to:'#78350f' },
          { label:'Analytics Report',  icon:'📈', type:'Analytics Report',  from:'#4c1d95',to:'#3b0764' },
        ].map(b => (
          <button key={b.label} onClick={()=>generate(b.type)}
                  disabled={generating===b.type}
                  className="rounded-2xl p-4 text-left relative overflow-hidden transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 keep-white"
                  style={{ background:`linear-gradient(135deg,${b.from},${b.to})` }}>
            <div className="text-2xl mb-2 opacity-90">{generating===b.type?'⏳':b.icon}</div>
            <p className="text-white font-bold text-sm">{b.label}</p>
            <p className="text-white/60 text-xs mt-0.5">{generating===b.type?'Generating…':'Click to generate'}</p>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Monthly Energy Consumption (kWh)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="m" stroke={axisStroke} tick={{fontSize:11,fill:tickFill}} />
              <YAxis stroke={axisStroke} tick={{fontSize:11,fill:tickFill}} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="units" fill="#f59e0b" radius={[4,4,0,0]} name="kWh" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Monthly Revenue (${sym})</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="m" stroke={axisStroke} tick={{fontSize:11,fill:tickFill}} />
              <YAxis stroke={axisStroke} tick={{fontSize:11,fill:tickFill}} tickFormatter={v=>`${sym}${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${sym}${v.toLocaleString()}`,'Revenue']} />
              <Line type="monotone" dataKey="rev" stroke="#8b5cf6" strokeWidth={2.5} dot={{fill:'#8b5cf6',r:4,strokeWidth:0}} activeDot={{r:6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly usage */}
      <div className={CARD}>
        <h2 className="text-base font-bold text-white mb-4">This Week's Daily Usage</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={DAILY}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="d" stroke={axisStroke} tick={{fontSize:11,fill:tickFill}} />
            <YAxis stroke={axisStroke} tick={{fontSize:11,fill:tickFill}} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="units" fill="#3b82f6" radius={[4,4,0,0]} name="kWh" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Generated reports list */}
      <div className={CARD}>
        <h2 className="text-base font-bold text-white mb-4">Generated Reports</h2>
        <div className="space-y-2">
          {REPORT_LIST.map((r,i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-all">
              <div className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-lg flex-shrink-0">{r.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{r.name}</p>
                <p className="text-gray-500 text-xs">{r.type} · {r.date} · {r.size}</p>
              </div>
              <button onClick={()=>addToast(`Downloading ${r.name}…`, 'info')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-900/20 border border-blue-700/30 hover:bg-blue-900/30 transition-all flex-shrink-0">
                ↓ Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
