import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'

const SOCIETY_DATA = [
  { name:'ABC Residency',  revenue:452000, collected:428000, pending:24000, consumers:120, collection:94.7 },
  { name:'XYZ Towers',     revenue:821500, collected:798000, pending:23500, consumers:340, collection:97.2 },
  { name:'Elite Heights',  revenue:310200, collected:285000, pending:25200, consumers:180, collection:91.9 },
  { name:'Green Valley',   revenue:580400, collected:561000, pending:19400, consumers:210, collection:96.7 },
  { name:'Sunrise Towers', revenue:120000, collected:105700, pending:14300, consumers:95,  collection:88.1 },
]

const MONTHLY = [
  { m:'Jan', revenue:145000, consumers:850 }, { m:'Feb', revenue:165000, consumers:870 },
  { m:'Mar', revenue:158000, consumers:875 }, { m:'Apr', revenue:172000, consumers:880 },
  { m:'May', revenue:168000, consumers:890 }, { m:'Jun', revenue:184000, consumers:945 },
]

export default function CompanyAdminReports() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const [generating, setGenerating] = useState(null)
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  const totalRev   = SOCIETY_DATA.reduce((a,b) => a + b.revenue, 0)
  const totalColl  = SOCIETY_DATA.reduce((a,b) => a + b.collected, 0)
  const totalPend  = SOCIETY_DATA.reduce((a,b) => a + b.pending, 0)

  const generate = type => {
    setGenerating(type)
    setTimeout(() => { setGenerating(null); addToast(`${type} generated & ready!`, 'success') }, 1800)
  }

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Company Reports</h1>
        <p className="text-gray-400 text-sm mt-0.5">Revenue & performance across all societies</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Total Billed',    val:`${sym}${(totalRev/100000).toFixed(1)}L`,   from:'#1d4ed8', to:'#1e40af' },
          { label:'Collected',       val:`${sym}${(totalColl/100000).toFixed(1)}L`,  from:'#065f46', to:'#064e3b' },
          { label:'Pending',         val:`${sym}${(totalPend/1000).toFixed(0)}K`,    from:'#991b1b', to:'#7f1d1d' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-5 text-white keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-3xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Quick generate buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Revenue Report',    type:'Revenue Report',    from:'#1d4ed8', to:'#1e40af' },
          { label:'Collection Report', type:'Collection Report', from:'#065f46', to:'#064e3b' },
          { label:'Society Summary',   type:'Society Summary',   from:'#78350f', to:'#92400e' },
          { label:'Annual Report',     type:'Annual Report',     from:'#4c1d95', to:'#3b0764' },
        ].map(b => (
          <button key={b.label} onClick={() => generate(b.type)}
                  disabled={generating === b.type}
                  className="rounded-2xl p-4 text-left keep-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ background:`linear-gradient(135deg,${b.from},${b.to})` }}>
            <div className="text-2xl mb-2">{generating === b.type ? '⏳' : '📊'}</div>
            <p className="text-white font-bold text-sm">{b.label}</p>
            <p className="text-white/60 text-xs mt-0.5">{generating === b.type ? 'Generating…' : 'Click to generate'}</p>
          </button>
        ))}
      </div>

      {/* Revenue chart */}
      <div className={CARD}>
        <h2 className="text-base font-bold text-white mb-4">Monthly Revenue (6 months)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="m" stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} />
            <YAxis stroke={axisStroke} tick={{ fontSize:11, fill:tickFill }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={v => [`${sym}${v.toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#059669" radius={[4,4,0,0]} name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-society table */}
      <div className={CARD}>
        <h2 className="text-base font-bold text-white mb-4">Per-Society Financial Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Society','Consumers','Billed','Collected','Pending','Collection Rate'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SOCIETY_DATA.map((s, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(5,150,105,0.05)] transition-all">
                  <td className="py-3 px-3 text-white font-semibold">{s.name}</td>
                  <td className="py-3 px-3 text-gray-300">{s.consumers}</td>
                  <td className="py-3 px-3 text-gray-200 font-semibold">{sym}{s.revenue.toLocaleString()}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{sym}{s.collected.toLocaleString()}</td>
                  <td className="py-3 px-3 text-red-400 font-bold">{sym}{s.pending.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full"
                             style={{ width:`${s.collection}%`, background: s.collection >= 95 ? '#10b981' : s.collection >= 90 ? '#f59e0b' : '#ef4444' }}/>
                      </div>
                      <span className={`text-xs font-bold ${s.collection >= 95 ? 'text-emerald-400' : s.collection >= 90 ? 'text-amber-400' : 'text-red-400'}`}>
                        {s.collection}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
