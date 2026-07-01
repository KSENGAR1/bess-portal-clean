import { useState } from 'react'
import React from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartTheme } from '../../utils/chartTheme'
import { useToast } from '../../components/ToastProvider'

const PAYMENTS = [
  { id:'PAY-001', consumer:'Rajesh Kumar',  flat:'301-A', amount:5285, date:'Jun 15 2024', method:'UPI',         status:'Completed', txnId:'TXN8A3F2C' },
  { id:'PAY-002', consumer:'Priya Singh',   flat:'302-A', amount:1500, date:'Jun 14 2024', method:'Net Banking', status:'Pending',   txnId:'TXN9B4G3D' },
  { id:'PAY-003', consumer:'Neha Gupta',    flat:'401-B', amount:4920, date:'Jun 13 2024', method:'UPI',         status:'Completed', txnId:'TXNAC5H4E' },
  { id:'PAY-004', consumer:'Vikram Singh',  flat:'402-B', amount:3850, date:'Jun 12 2024', method:'Card',        status:'Completed', txnId:'TXNBD6I5F' },
  { id:'PAY-005', consumer:'Sunita Sharma', flat:'501-C', amount:5100, date:'Jun 11 2024', method:'UPI',         status:'Completed', txnId:'TXNCE7J6G' },
  { id:'PAY-006', consumer:'Amit Patel',    flat:'303-A', amount:4408, date:'Jun 08 2024', method:'Cash',        status:'Failed',    txnId:'TXNDF8K7H' },
]

const TREND = [
  { day:'Mon', amt:45000 }, { day:'Tue', amt:62000 }, { day:'Wed', amt:48000 },
  { day:'Thu', amt:71000 }, { day:'Fri', amt:55000 }, { day:'Sat', amt:58000 }, { day:'Sun', amt:35000 },
]

const stStyle = {
  Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Pending:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Failed:    'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function AdminPayments() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const { addToast } = useToast()
  const [filter, setFilter]     = useState('All')
  const [selected, setSelected] = useState(null)

  const visible = filter === 'All' ? PAYMENTS : PAYMENTS.filter(p => p.status === filter)

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div>
        <h1 className="text-2xl font-bold text-white">Payment Tracking</h1>
        <p className="text-gray-400 text-sm mt-0.5">Monitor payment collection and status</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Collected Today', value:`${sym}52,450`, from:'#065f46',to:'#064e3b' },
          { label:'Pending',         value:`${sym}45,230`, from:'#92400e',to:'#78350f' },
          { label:'Collection Rate', value:'94.2%',   from:'#4c1d95',to:'#3b0764' },
          { label:'Avg. Payment',    value:`${sym}4,530`,  from:'#1e3a5f',to:'#1e3a8a' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden keep-white"
               style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70 font-medium">{s.label}</p>
            <p className="text-2xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]">
        <h2 className="text-base font-bold text-white mb-4">This Week's Collection</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="day" stroke={axisStroke} tick={{ fontSize:11, fill: tickFill }} />
            <YAxis stroke={axisStroke} tick={{ fontSize:11, fill: tickFill }} tickFormatter={v=>`${sym}${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle}
                     formatter={v=>[`${sym}${v.toLocaleString()}`, 'Collection']} />
            <Line type="monotone" dataKey="amt" stroke="#f59e0b" strokeWidth={2.5}
                  dot={{ fill:'#f59e0b', r:4, strokeWidth:0 }} activeDot={{ r:6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All','Completed','Pending','Failed'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filter===f ? 'bg-amber-600 text-white border-amber-700' : 'dark-card text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Payment list */}
      <div className="rounded-2xl border dark-card border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Payment ID','Consumer','Amount','Date','Method','Status',''].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <React.Fragment key={p.id}>
                  <tr key={p.id}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-all cursor-pointer"
                      onClick={()=>setSelected(selected===p.id?null:p.id)}>
                    <td className="py-3 px-3 text-white font-mono text-xs font-semibold">{p.id}</td>
                    <td className="py-3 px-3">
                      <p className="text-white font-semibold text-sm">{p.consumer}</p>
                      <p className="text-gray-500 text-xs">{p.flat}</p>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold text-sm">{sym}{p.amount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-gray-400 text-xs">{p.date}</td>
                    <td className="py-3 px-3 text-gray-300 text-xs">{p.method}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${stStyle[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-600 text-lg">{selected===p.id?'▲':'▼'}</td>
                  </tr>
                  {selected === p.id && (
                    <tr key={p.id+'d'} className="border-b border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)]">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="flex flex-wrap gap-6 text-xs">
                          <div><p className="text-gray-500">Transaction ID</p><p className="text-gray-200 font-mono mt-0.5">{p.txnId}</p></div>
                          <div><p className="text-gray-500">Consumer</p><p className="text-gray-200 font-semibold mt-0.5">{p.consumer} · {p.flat}</p></div>
                          <div><p className="text-gray-500">Payment Method</p><p className="text-gray-200 font-semibold mt-0.5">{p.method}</p></div>
                          <div><p className="text-gray-500">Amount</p><p className="text-emerald-400 font-bold mt-0.5">{sym}{p.amount.toLocaleString()}</p></div>
                          {p.status === 'Pending' && (
                            <button onClick={() => addToast(`Reminder sent to ${p.consumer}!`, 'success')}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 self-end transition-all">
                              Send Reminder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
