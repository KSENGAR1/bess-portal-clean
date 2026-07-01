import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Plus, Zap, ArrowDownLeft, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useChartTheme } from '../utils/chartTheme'

const monthly = [
  { m:'Jan',amt:2800,kWh:235 },{ m:'Feb',amt:3100,kWh:260 },{ m:'Mar',amt:2950,kWh:245 },
  { m:'Apr',amt:3200,kWh:270 },{ m:'May',amt:2800,kWh:235 },{ m:'Jun',amt:3400,kWh:285 },
]
const breakdown = [
  { name:'Grid Power',  value:70, color:'#3b82f6' },
  { name:'DG Power',    value:20, color:'#f59e0b' },
  { name:'Fixed Charge',value:10, color:'#10b981' },
]
const txns = [
  { id:1, date:'Today',   label:'Grid Deduction',      sub:'32.1 kWh × grid rate',   amt:-385.50, time:'2:45 PM', type:'debit',  icon:'bolt' },
  { id:2, date:'Today',   label:'Daily Settlement',    sub:'Closing balance sync',   amt:0,       time:'12:00 AM',type:'info',   icon:'info' },
  { id:3, date:'Jun 14',  label:'Wallet Recharge',     sub:'UPI · Google Pay',       amt:5000,    time:'3:20 PM', type:'credit', icon:'credit' },
  { id:4, date:'Jun 14',  label:'DG Deduction',        sub:'18.8 kWh × DG rate',     amt:-225.60, time:'11:30 PM',type:'debit',  icon:'dg' },
  { id:5, date:'Jun 13',  label:'Grid Deduction',      sub:'38.1 kWh × grid rate',   amt:-456.80, time:'2:15 PM', type:'debit',  icon:'bolt' },
  { id:6, date:'Jun 13',  label:'Wallet Recharge',     sub:'Net Banking',            amt:3000,    time:'10:45 AM',type:'credit', icon:'credit' },
  { id:7, date:'Jun 12',  label:'Grid Deduction',      sub:'27.9 kWh × grid rate',   amt:-335.20, time:'1:30 PM', type:'debit',  icon:'bolt' },
]

function TxIcon({ icon, type }) {
  const map = {
    bolt:   { bg:'bg-blue-100',   icon:<Zap size={15} className="text-blue-600"/> },
    credit: { bg:'bg-green-100',  icon:<ArrowDownLeft size={15} className="text-green-600"/> },
    debit:  { bg:'bg-orange-100', icon:<ArrowUpRight size={15} className="text-orange-500"/> },
    dg:     { bg:'bg-amber-100',  icon:<Zap size={15} className="text-amber-600"/> },
    info:   { bg:'bg-gray-100',   icon:<span className="text-xs text-gray-500 font-bold">i</span> },
  }
  const s = map[icon] || map.info
  return <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
}

export default function WalletPage({ onNavigate, walletBalance = 2450.50 }) {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const [expanded, setExpanded] = useState(null)
  const [tab, setTab] = useState('trend')
  const balance = walletBalance
  const spent = 3400
  const avg = Math.round(monthly.reduce((a,b)=>a+b.amt,0)/monthly.length)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 animate-fade-in">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">My Wallet</h2>
        <p className="text-sm text-gray-500 mt-0.5">Track spending · manage transactions</p>
      </div>

      {/* Balance hero */}
      <div className="keep-white relative rounded-3xl p-6 mb-6 overflow-hidden text-white"
           style={{background:'linear-gradient(135deg,#059669 0%,#047857 60%,#065f46 100%)',boxShadow:'0 8px 40px rgba(5,150,105,0.35)'}}>
        <div className="absolute inset-0 pointer-events-none"
             style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',backgroundSize:'24px 24px'}}/>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
             style={{background:'radial-gradient(circle,rgba(255,255,255,0.07),transparent 70%)'}}/>
        <div className="relative">
          <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">Available Balance</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-extrabold tracking-tight">{sym}{balance.toFixed(0)}</span>
            <span className="text-emerald-300 text-sm pb-1.5 font-medium">.50</span>
          </div>
          <p className="text-emerald-200/70 text-[11px] mb-5">Updated just now · Flat 302 · Tower A</p>
          <button onClick={() => onNavigate('payment')}
                  className="flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-lg">
            <Plus size={16}/> Add Money
          </button>
        </div>
      </div>

      {/* Quick stat chips */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        {[
          { label:'Avg Monthly', value:`${sym}${avg}`, sub:'last 6 months', Icon:null, color:'border-blue-400' },
          { label:'This Month',  value:`${sym}${spent}`, sub:'+12% vs last',
            Icon: TrendingUp, iconColor:'text-red-500', color:'border-orange-400' },
          { label:'Projected',   value:'285 kWh', sub:'this month', Icon:null, color:'border-green-400' },
        ].map(s => (
          <div key={s.label} className={`bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 shadow-card border-b-2 border-gray-100 dark:border-slate-700 ${s.color}`}>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 font-medium mb-1 truncate">{s.label}</p>
            <div className="flex items-center gap-1">
              <p className="text-sm sm:text-[15px] font-extrabold text-gray-900 dark:text-white truncate">{s.value}</p>
              {s.Icon && <s.Icon size={12} className={s.iconColor}/>}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[['trend','Spending Trend'],['usage','kWh Usage'],['split','Breakdown']].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
                    className={`flex-1 py-3 text-xs font-bold transition-all ${tab===id?'text-blue-700 border-b-2 border-blue-600':'text-gray-400 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === 'trend' && (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>
                <XAxis dataKey="m" stroke={axisStroke} tick={{fontSize:11, fill:tickFill}}/>
                <YAxis stroke={axisStroke} tick={{fontSize:11, fill:tickFill}} tickFormatter={v=>`${sym}${(v/1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${sym}${v.toLocaleString()}`,'Spending']}/>
                <Line type="monotone" dataKey="amt" stroke="#3b82f6" strokeWidth={2.5}
                      dot={{fill:'#3b82f6',r:4,strokeWidth:0}} activeDot={{r:6}}/>
              </LineChart>
            </ResponsiveContainer>
          )}
          {tab === 'usage' && (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>
                <XAxis dataKey="m" stroke={axisStroke} tick={{fontSize:11, fill:tickFill}}/>
                <YAxis stroke={axisStroke} tick={{fontSize:11, fill:tickFill}}/>
                <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${v} kWh`,'Usage']}/>
                <Bar dataKey="kWh" fill="#f59e0b" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
          {tab === 'split' && (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={170} height={170}>
                <PieChart>
                  <Pie data={breakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                       dataKey="value" paddingAngle={3}>
                    {breakdown.map((e,i) => <Cell key={i} fill={e.color} stroke="transparent"/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {breakdown.map(b => (
                  <div key={b.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{background:b.color}}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">{b.name}</p>
                      <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${b.value}%`,background:b.color}}/>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">{b.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">Transaction History</h3>
          <span className="text-xs text-gray-400">{txns.length} entries</span>
        </div>

        {/* Group by date */}
        {['Today','Jun 14','Jun 13','Jun 12'].map(date => {
          const group = txns.filter(t => t.date === date)
          if (!group.length) return null
          return (
            <div key={date}>
              <div className="px-5 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{date}</p>
              </div>
              {group.map(tx => (
                <div key={tx.id}>
                  <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-all border-b border-gray-50"
                       onClick={() => setExpanded(expanded===tx.id ? null : tx.id)}>
                    <TxIcon icon={tx.icon} type={tx.type}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{tx.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{tx.sub} · {tx.time}</p>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                      <div>
                        {tx.amt !== 0 && (
                          <p className={`text-sm font-bold ${tx.amt > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                            {tx.amt > 0 ? '+' : ''}{sym}{Math.abs(tx.amt).toFixed(2)}
                          </p>
                        )}
                      </div>
                      {expanded===tx.id ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
                    </div>
                  </div>
                  {expanded === tx.id && tx.amt !== 0 && (
                    <div className="px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-blue-100 dark:border-blue-500/20 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div><p className="text-gray-500">Amount</p><p className="font-bold text-gray-900">{sym}{Math.abs(tx.amt).toFixed(2)}</p></div>
                      <div><p className="text-gray-500">Time</p><p className="font-bold text-gray-900">{tx.time}</p></div>
                      <div className="col-span-2"><p className="text-gray-500">Details</p><p className="font-bold text-gray-900">{tx.sub}</p></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
