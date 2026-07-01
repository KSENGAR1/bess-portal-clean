import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const DATA = [
  { month:'June 2024',     gen:245, pending:38, paid:207, overdue:15, revenue:452350 },
  { month:'May 2024',      gen:245, pending:18, paid:227, overdue:5,  revenue:498200 },
  { month:'April 2024',    gen:245, pending:16, paid:229, overdue:3,  revenue:512000 },
  { month:'March 2024',    gen:245, pending:22, paid:223, overdue:10, revenue:478500 },
  { month:'February 2024', gen:245, pending:14, paid:231, overdue:2,  revenue:524000 },
  { month:'January 2024',  gen:245, pending:20, paid:225, overdue:7,  revenue:465000 },
]

const CONSUMERS = [
  { flat:'301-A', name:'Rajesh Kumar',  amount:5285, status:'Unpaid', due:'15 Jul 2024' },
  { flat:'302-A', name:'Priya Singh',   amount:4765, status:'Paid',   due:'15 Jun 2024' },
  { flat:'303-A', name:'Amit Patel',    amount:4408, status:'Overdue',due:'15 May 2024' },
  { flat:'401-B', name:'Neha Gupta',    amount:4920, status:'Paid',   due:'15 Jun 2024' },
  { flat:'402-B', name:'Vikram Singh',  amount:3850, status:'Unpaid', due:'15 Jul 2024' },
  { flat:'501-C', name:'Sunita Sharma', amount:5100, status:'Paid',   due:'15 Jun 2024' },
]

const billStatus = {
  Paid:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Unpaid:  'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Overdue: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function AdminBilling() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const [tab, setTab]           = useState('overview')
  const [sending, setSending]   = useState(null)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    setGenerated(true)
    addToast('Bills generated for 245 consumers!', 'success')
  }

  const handleReminder = flat => {
    setSending(flat)
    setTimeout(() => { setSending(null); addToast(`Reminder sent to ${flat}`, 'success') }, 1200, 'success')
  }

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Generate bills and track collection</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGenerate}
                  className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                  style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
            ⚡ Generate Bills
          </button>
          <button onClick={()=>addToast('Report downloaded', 'info', 'success')}
                  className="px-4 py-2 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] transition-all">
            ↓ Export
          </button>
        </div>
      </div>

      {/* Generation banner */}
      {generated && (
        <div className="rounded-2xl p-4 flex items-center gap-3 border"
             style={{ background:'rgba(16,185,129,0.08)', borderColor:'rgba(16,185,129,0.25)' }}>
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-emerald-400 font-bold text-sm">Bills Generated Successfully</p>
            <p className="text-emerald-300/70 text-xs">245 bills created for July 2024 · Sending notifications…</p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Generated', value: DATA[0].gen,     from:'#1d4ed8',to:'#1e40af' },
          { label:'Paid',      value: DATA[0].paid,    from:'#065f46',to:'#064e3b' },
          { label:'Pending',   value: DATA[0].pending, from:'#92400e',to:'#78350f' },
          { label:'Overdue',   value: DATA[0].overdue, from:'#991b1b',to:'#7f1d1d' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 font-medium">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
            <p className="text-white/50 text-xs mt-1">June 2024</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 dark-page-bg p-1 rounded-xl w-fit border border-[rgba(255,255,255,0.06)]">
        {['overview','individual'].map(t => (
          <button key={t} onClick={()=>setTab(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    tab===t ? 'bg-amber-700 text-white' : 'text-gray-400 hover:text-white'
                  }`}>
            {t === 'overview' ? 'Monthly Overview' : 'Individual Bills'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Billing History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  {['Month','Generated','Paid','Pending','Overdue','Revenue'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DATA.map((row,i) => (
                  <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-all">
                    <td className="py-3 px-3 text-white font-semibold text-sm">{row.month}</td>
                    <td className="py-3 px-3 text-gray-300">{row.gen}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{row.paid}</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">{row.pending}</td>
                    <td className="py-3 px-3 text-red-400 font-bold">{row.overdue}</td>
                    <td className="py-3 px-3 text-yellow-300 font-bold">{sym}{row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'individual' && (
        <div className={CARD}>
          <h2 className="text-base font-bold text-white mb-4">Current Month Bills</h2>
          <div className="space-y-2">
            {CONSUMERS.map((c,i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.04)]">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">{c.name}</p>
                    <span className="text-gray-500 text-xs">· {c.flat}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">Due: {c.due}</p>
                </div>
                <p className="font-bold text-white">{sym}{c.amount.toLocaleString()}</p>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${billStatus[c.status]}`}>{c.status}</span>
                {c.status !== 'Paid' && (
                  <button onClick={()=>handleReminder(c.flat)}
                          disabled={sending===c.flat}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-700/60 border border-blue-600/40 hover:bg-blue-700/80 disabled:opacity-50 transition-all">
                    {sending===c.flat ? '…' : '📧 Remind'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
