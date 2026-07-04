import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'
import { useToast } from '../../components/ToastProvider'

const TREND = [
  { m:'Jan',collected:285000,pending:45000 },{ m:'Feb',collected:312000,pending:38000 },
  { m:'Mar',collected:298000,pending:52000 },{ m:'Apr',collected:341000,pending:29000 },
  { m:'May',collected:325000,pending:41000 },{ m:'Jun',collected:368000,pending:35000 },
]
const PROJECTS_DATA = [
  { name:'ABC Residency', billed:452000, collected:428000, pending:24000, consumers:120, rate:94.7 },
  { name:'XYZ Towers',    billed:821000, collected:798000, pending:23000, consumers:340, rate:97.2 },
  { name:'Elite Heights', billed:310000, collected:285000, pending:25000, consumers:180, rate:91.9 },
  { name:'Green Valley',  billed:580000, collected:561000, pending:19000, consumers:210, rate:96.7 },
  { name:'Palm Court',    billed:644000, collected:601000, pending:43000, consumers:260, rate:93.3 },
]

export default function SuperAdminBilling() {
  const { country } = useCurrency()
  const sym = country.symbol
  const [tab, setTab] = useState('overview')
  const { addToast } = useToast()
  const { tooltipStyleSuperAdmin, gridStroke, axisStroke, tickFill } = useChartTheme()

  const totalBilled    = PROJECTS_DATA.reduce((a,b) => a+b.billed, 0)
  const totalCollected = PROJECTS_DATA.reduce((a,b) => a+b.collected, 0)
  const totalPending   = PROJECTS_DATA.reduce((a,b) => a+b.pending, 0)
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing Engine</h1>
          <p className="text-gray-400 text-sm mt-0.5">Platform-wide billing overview & controls</p>
        </div>
        <button onClick={() => addToast('Bills generated for all projects!', 'success')}
                className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
          Generate All Bills
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Total Billed',    val:`${sym}${(totalBilled/100000).toFixed(1)}L`,    from:'#1d4ed8',to:'#1e40af' },
          { label:'Collected',       val:`${sym}${(totalCollected/100000).toFixed(1)}L`, from:'#065f46',to:'#064e3b' },
          { label:'Pending',         val:`${sym}${(totalPending/1000).toFixed(0)}K`,     from:'#991b1b',to:'#7f1d1d' },
        ].map((s,i) => (
          <div key={i} className="rounded-2xl p-5 text-white keep-white" style={{ background: `linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-3xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)] w-fit">
        {['overview','projects'].map(t => (
          <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${tab===t?'bg-purple-700 text-white':'text-gray-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">6-Month Collection Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>
              <XAxis dataKey="m" stroke={axisStroke} tick={{ fontSize:11, fill: tickFill }}/>
              <YAxis stroke={axisStroke} tick={{ fontSize:11, fill: tickFill }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}K`}/>
              <Tooltip contentStyle={tooltipStyleSuperAdmin}
                       formatter={v => [`${sym}${v.toLocaleString()}`, '']}/>
              <Bar dataKey="collected" fill="#7c3aed" radius={[4,4,0,0]} name="Collected"/>
              <Bar dataKey="pending"   fill="#991b1b" radius={[4,4,0,0]} name="Pending"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'projects' && (
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Per-Project Billing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  {['Project','Consumers','Billed','Collected','Pending','Collection Rate',''].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROJECTS_DATA.map((p,i) => (
                  <tr key={i} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(139,92,246,0.05)] transition-all">
                    <td className="py-3 px-3 text-white font-semibold">{p.name}</td>
                    <td className="py-3 px-3 text-gray-300">{p.consumers}</td>
                    <td className="py-3 px-3 text-gray-200 font-semibold">{sym}{p.billed.toLocaleString()}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{sym}{p.collected.toLocaleString()}</td>
                    <td className="py-3 px-3 text-red-400 font-bold">{sym}{p.pending.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-white/10">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width:`${p.rate}%` }}/>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold">{p.rate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={() => addToast(`Reminders sent for ${p.name}!`, 'success')}
                              className="text-xs font-bold text-purple-400 hover:text-purple-300">Send Reminder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
