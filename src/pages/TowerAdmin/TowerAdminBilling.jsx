import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const BILLS = [
  { flat:'101-A', name:'Rajesh Kumar',  gridUnits:245, dgUnits:32, amount:3285, status:'Paid',    due:'15 Jun 2024' },
  { flat:'102-A', name:'Priya Singh',   gridUnits:188, dgUnits:25, amount:2765, status:'Unpaid',  due:'15 Jul 2024' },
  { flat:'103-A', name:'Amit Patel',    gridUnits:0,   dgUnits:0,  amount:250,  status:'Paid',    due:'15 Jun 2024' },
  { flat:'201-A', name:'Neha Gupta',    gridUnits:210, dgUnits:28, amount:2920, status:'Paid',    due:'15 Jun 2024' },
  { flat:'202-A', name:'Vikram Singh',  gridUnits:232, dgUnits:30, amount:3150, status:'Overdue', due:'15 May 2024' },
  { flat:'203-A', name:'Sunita Sharma', gridUnits:198, dgUnits:22, amount:2700, status:'Unpaid',  due:'15 Jul 2024' },
  { flat:'301-A', name:'Ravi Verma',    gridUnits:265, dgUnits:35, amount:3540, status:'Paid',    due:'15 Jun 2024' },
  { flat:'302-A', name:'Kavita Joshi',  gridUnits:221, dgUnits:29, amount:3010, status:'Paid',    due:'15 Jun 2024' },
]

const statusStyle = {
  Paid:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Unpaid:  'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Overdue: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function TowerAdminBilling() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const [filter, setFilter] = useState('All')
  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  const visible = filter === 'All' ? BILLS : BILLS.filter(b => b.status === filter)
  const totalRev = BILLS.filter(b => b.status === 'Paid').reduce((a, b) => a + b.amount, 0)
  const pending  = BILLS.filter(b => b.status !== 'Paid').reduce((a, b) => a + b.amount, 0)

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tower A — Billing</h1>
          <p className="text-gray-400 text-sm mt-0.5">June 2024 billing summary</p>
        </div>
        <button onClick={() => addToast('Reminders sent to all unpaid residents!', 'success')}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)' }}>
          📧 Send All Reminders
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Collected',  val:`${sym}${totalRev.toLocaleString()}`, from:'#065f46', to:'#064e3b' },
          { label:'Pending',    val:`${sym}${pending.toLocaleString()}`,  from:'#92400e', to:'#78350f' },
          { label:'Overdue',    val: BILLS.filter(b=>b.status==='Overdue').length, from:'#991b1b', to:'#7f1d1d' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-white keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['All','Paid','Unpaid','Overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter === f ? 'text-white border-transparent' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}
                  style={filter === f ? { background:'linear-gradient(135deg,#0891b2,#0e7490)' } : {}}>
            {f}
          </button>
        ))}
      </div>

      <div className={CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Flat','Resident','Grid kWh','DG kWh','Amount','Status','Due Date',''].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((b, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(8,145,178,0.05)] transition-all">
                  <td className="py-3 px-3 text-white font-bold">{b.flat}</td>
                  <td className="py-3 px-3 text-gray-200">{b.name}</td>
                  <td className="py-3 px-3 text-gray-300">{b.gridUnits}</td>
                  <td className="py-3 px-3 text-gray-300">{b.dgUnits}</td>
                  <td className="py-3 px-3 text-white font-bold">{sym}{b.amount.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${statusStyle[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{b.due}</td>
                  <td className="py-3 px-3">
                    {b.status !== 'Paid' && (
                      <button onClick={() => addToast(`Reminder sent to ${b.name}`, 'success')}
                              className="px-3 py-1 rounded-lg text-xs font-bold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                        Remind
                      </button>
                    )}
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
