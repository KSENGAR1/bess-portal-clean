import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Zap, Activity, Cpu, Radio, BarChart3, Power } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useChartTheme } from '../utils/chartTheme'

const Odometer = ({value,label,color='#22c55e'}) => {
  const digits  = String(Math.floor(value)).padStart(6,'0').split('')
  const decimal = value.toFixed(2).split('.')[1]
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl px-3 sm:px-5 py-4 mb-3 w-full overflow-x-auto"
           style={{background:'#0d1117',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'inset 0 2px 12px rgba(0,0,0,0.6)'}}>
        <p className="text-[10px] font-mono uppercase tracking-widest mb-2.5 text-center"
           style={{color:'rgba(255,255,255,0.25)'}}>kWh</p>
        <div className="flex justify-center items-center gap-0.5 sm:gap-1 min-w-0">
          {digits.map((digit,idx)=>(
            <div key={idx} className="w-7 sm:w-9 h-9 sm:h-11 rounded-lg flex items-center justify-center text-lg sm:text-2xl font-black font-mono flex-shrink-0"
                 style={{background:'#151b26',border:`1px solid ${color}22`,color,textShadow:`0 0 8px ${color}88`,boxShadow:'inset 0 1px 4px rgba(0,0,0,0.5)'}}>
              {digit}
            </div>
          ))}
          <div className="w-3 sm:w-4 h-9 sm:h-11 flex items-end justify-center pb-1 text-sm sm:text-base font-black font-mono flex-shrink-0"
               style={{color:'rgba(255,255,255,0.3)'}}>.</div>
          {decimal.split('').map((d,idx)=>(
            <div key={idx} className="w-6 sm:w-7 h-9 sm:h-11 rounded-lg flex items-center justify-center text-base sm:text-xl font-black font-mono flex-shrink-0"
                 style={{background:'#151b26',border:'1px solid rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.4)',boxShadow:'inset 0 1px 4px rgba(0,0,0,0.5)'}}>
              {d}
            </div>
          ))}
        </div>
        <p className="text-[9px] font-mono uppercase text-center mt-2.5"
           style={{color:'rgba(255,255,255,0.2)'}}>{label}</p>
      </div>
    </div>
  )
}

function LoadBar({pct}) {
  const barColor=pct<60?'#22c55e':pct<80?'#f59e0b':'#ef4444'
  return (
    <div className="relative w-full h-4 rounded-full overflow-hidden" style={{background:'rgba(0,0,0,0.06)'}}>
      <div className="absolute top-0 bottom-0 w-px bg-black/10 z-10" style={{left:'60%'}}/>
      <div className="absolute top-0 bottom-0 w-px bg-black/10 z-10" style={{left:'80%'}}/>
      <div className="h-full rounded-full transition-all duration-700"
           style={{width:`${pct}%`,background:`linear-gradient(90deg,#22c55e,${barColor})`}}/>
    </div>
  )
}

function ReadingChip({icon:Icon,label,value,unit,color}) {
  return (
    <div className="stat-chip flex flex-col items-center gap-1 flex-1 min-w-0">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-0.5" style={{background:`${color}18`}}>
        <Icon size={15} style={{color}}/>
      </div>
      <p className="text-[11px] font-semibold text-gray-500 leading-none text-center">{label}</p>
      <p className="text-sm font-extrabold text-gray-900 leading-none">{value}</p>
      <p className="text-[10px] text-gray-400 leading-none">{unit}</p>
    </div>
  )
}

export default function MeterPage() {
  const { country } = useCurrency()
  const sym = country.symbol
  const { tooltipStyle, gridStroke, axisStroke, tickFill } = useChartTheme()
  const [viewType,       setViewType]       = useState('daily')
  const [selectedMetric, setSelectedMetric] = useState('units')
  const [activeSource,   setActiveSource]   = useState('grid')
  const [meterOn,        setMeterOn]        = useState(true)
  const [confirmOff,     setConfirmOff]     = useState(false)

  const gridMeterReading=8642.35, dgMeterReading=3215.78
  const liveLoad=2.05, gridSanctioned=8.0
  const dgLiveLoad=1.85, dgSanctioned=5.0

  const dailyData=[
    {date:'10 Jun',mains:12.5,dg:3.2,mainsCost:125,dgCost:96},
    {date:'11 Jun',mains:14.8,dg:2.1,mainsCost:148,dgCost:63},
    {date:'12 Jun',mains:11.2,dg:4.5,mainsCost:112,dgCost:135},
    {date:'13 Jun',mains:15.3,dg:2.8,mainsCost:153,dgCost:84},
    {date:'14 Jun',mains:13.6,dg:3.9,mainsCost:136,dgCost:117},
    {date:'15 Jun',mains:16.2,dg:1.5,mainsCost:162,dgCost:45},
    {date:'Today', mains:12.8,dg:2.6,mainsCost:128,dgCost:78},
  ]
  const monthlyData=[
    {month:'Jan',mains:245,dg:67,mainsCost:2450,dgCost:804},
    {month:'Feb',mains:263,dg:58,mainsCost:2630,dgCost:696},
    {month:'Mar',mains:238,dg:72,mainsCost:2380,dgCost:864},
    {month:'Apr',mains:287,dg:65,mainsCost:2870,dgCost:780},
    {month:'May',mains:272,dg:71,mainsCost:2720,dgCost:852},
    {month:'Jun',mains:312,dg:75,mainsCost:3120,dgCost:900},
  ]
  const chartData=viewType==='daily'?dailyData:monthlyData

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-extrabold text-gray-900">Smart Meter Dashboard</h2>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>LIVE
            </span>
          </div>
          <p className="text-sm text-gray-500">Real-time consumption monitoring and analytics</p>
        </div>
      </div>

      {/* ── Meter On/Off Switch ── */}
      <div className="bg-white rounded-2xl px-5 py-4 mb-6 shadow-card border border-gray-100">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Meter Supply Control</p>
        <div className="flex items-center justify-between gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${meterOn ? 'bg-green-50' : 'bg-red-50'}`}
                 style={{border: meterOn ? '2px solid #22c55e' : '2px solid #ef4444', boxShadow: meterOn ? '0 0 16px rgba(34,197,94,0.3)' : '0 0 16px rgba(239,68,68,0.3)'}}>
              <Power size={22} style={{color: meterOn ? '#22c55e' : '#ef4444'}} strokeWidth={2.5}/>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Electricity Supply</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${meterOn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}/>
                <span className={`text-xs font-semibold ${meterOn ? 'text-green-600' : 'text-red-500'}`}>
                  {meterOn ? 'Supply ON — Electricity Active' : 'Supply OFF — Disconnected'}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Meter ID: BESS-M-00412 · Unit 4B</p>
            </div>
          </div>

          {/* Toggle switch */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => {
                if (meterOn) { setConfirmOff(true) }
                else { setMeterOn(true); setConfirmOff(false) }
              }}
              className="relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: meterOn ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                boxShadow: meterOn ? '0 4px 14px rgba(34,197,94,0.4)' : '0 4px 14px rgba(239,68,68,0.4)',
                focusRingColor: meterOn ? '#22c55e' : '#ef4444',
              }}
              aria-label={meterOn ? 'Turn off meter' : 'Turn on meter'}
              aria-pressed={meterOn}
            >
              <span
                className="absolute top-1 transition-all duration-500 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                style={{left: meterOn ? 'calc(100% - 28px)' : '4px'}}>
                <Power size={12} style={{color: meterOn ? '#22c55e' : '#ef4444'}} strokeWidth={2.5}/>
              </span>
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${meterOn ? 'text-green-600' : 'text-red-500'}`}>
              {meterOn ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Confirm off dialog */}
        {confirmOff && (
          <div className="mt-4 p-4 rounded-xl border-2 border-orange-200 bg-orange-50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Power size={16} className="text-orange-500"/>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-orange-700">Confirm Disconnection</p>
              <p className="text-xs text-orange-600 mt-0.5">Turning off will cut electricity to your unit. Are you sure?</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => { setMeterOn(false); setConfirmOff(false) }}
                  className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all">
                  Yes, Turn Off
                </button>
                <button
                  onClick={() => setConfirmOff(false)}
                  className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live electrical readings */}
      <div className={`bg-white rounded-2xl px-5 py-4 mb-6 shadow-card border border-gray-100 transition-all duration-500 ${!meterOn ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Live Electrical Parameters</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ReadingChip icon={Zap}      label="Voltage"      value="231.4" unit="V"  color="#0066FF"/>
          <ReadingChip icon={Activity} label="Current"      value="8.9"   unit="A"  color="#f59e0b"/>
          <ReadingChip icon={Cpu}      label="Power Factor" value="0.94"  unit="pf" color="#7c3aed"/>
          <ReadingChip icon={Radio}    label="Frequency"    value="50.0"  unit="Hz" color="#059669"/>
        </div>
      </div>

      {/* Power source toggle */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-card border border-gray-100">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Active Power Source</p>
        <div className="flex gap-3">
          {[
            {id:'grid',label:'Grid (Mains)',desc:'BESCOM Supply',color:'#0066FF',status:'Online'},
            {id:'dg',  label:'DG Generator',desc:'Diesel Backup', color:'#f59e0b',status:'Standby'},
          ].map(src=>(
            <button key={src.id} onClick={()=>setActiveSource(src.id)}
                    className={`flex-1 flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${activeSource===src.id?'shadow-md':'border-gray-100 opacity-60'}`}
                    style={activeSource===src.id?{borderColor:src.color,background:`${src.color}08`}:{}}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{background:`${src.color}18`}}>
                <Zap size={16} style={{color:src.color}}/>
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{src.label}</p>
                <p className="text-[10px] text-gray-500 truncate">{src.desc}</p>
              </div>
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${src.status==='Online'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                {src.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Meter displays */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 transition-all duration-500 ${!meterOn ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
        <div className="bg-white rounded-3xl p-6 shadow-card border-t-4" style={{borderColor:'#0066FF'}}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Grid (Mains) Meter</p>
              <p className="text-xs text-gray-500 mt-0.5">Sanctioned Load: <strong>{gridSanctioned} kW</strong></p>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">● Online</span>
          </div>
          <Odometer value={gridMeterReading} label="Grid Energy Meter" color="#22c55e"/>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Live Load</span>
              <span className="text-xl font-extrabold text-blue-600">{liveLoad} kW</span>
            </div>
            <LoadBar pct={(liveLoad/gridSanctioned)*100}/>
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-3 text-[10px] font-semibold">
                <span className="text-green-600">■ Normal</span>
                <span className="text-yellow-500">■ Caution</span>
                <span className="text-red-500">■ Overload</span>
              </div>
              <p className="text-xs text-gray-500">{((liveLoad/gridSanctioned)*100).toFixed(1)}% capacity</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-card border-t-4" style={{borderColor:'#f59e0b'}}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">DG (Generator) Meter</p>
              <p className="text-xs text-gray-500 mt-0.5">Sanctioned Load: <strong>{dgSanctioned} kW</strong></p>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">● Online</span>
          </div>
          <Odometer value={dgMeterReading} label="DG Energy Meter" color="#f59e0b"/>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Live Load</span>
              <span className="text-xl font-extrabold text-orange-500">{dgLiveLoad} kW</span>
            </div>
            <LoadBar pct={(dgLiveLoad/dgSanctioned)*100}/>
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-3 text-[10px] font-semibold">
                <span className="text-green-600">■ Normal</span>
                <span className="text-yellow-500">■ Caution</span>
                <span className="text-red-500">■ Overload</span>
              </div>
              <p className="text-xs text-gray-500">{((dgLiveLoad/dgSanctioned)*100).toFixed(1)}% capacity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-card mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-gray-700"/>
            <h3 className="text-lg font-bold text-gray-900">Usage Analytics</h3>
          </div>
          <div className="flex gap-2">
            {['daily','monthly'].map(t=>(
              <button key={t} onClick={()=>setViewType(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${viewType===t?'bg-blue-600 text-white shadow-sm':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mb-5">
          {['units','cost'].map(m=>(
            <button key={m} onClick={()=>setSelectedMetric(m)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${selectedMetric===m?'bg-blue-100 text-blue-700 border-2 border-blue-500':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {m==='units'?'Units (kWh)':`Cost (${sym})`}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          {selectedMetric==='units'?(
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>
              <XAxis dataKey={viewType==='daily'?'date':'month'} stroke={axisStroke} tick={{fontSize:11, fill:tickFill}}/>
              <YAxis stroke={axisStroke} tick={{fontSize:11, fill:tickFill}}/>
              <Tooltip contentStyle={tooltipStyle} formatter={v=>`${v} kWh`}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Bar dataKey="mains" fill="#3b82f6" radius={[6,6,0,0]} name="Grid (Mains)"/>
              <Bar dataKey="dg"    fill="#f59e0b" radius={[6,6,0,0]} name="DG (Generator)"/>
            </BarChart>
          ):(
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>
              <XAxis dataKey={viewType==='daily'?'date':'month'} stroke={axisStroke} tick={{fontSize:11, fill:tickFill}}/>
              <YAxis stroke={axisStroke} tick={{fontSize:11, fill:tickFill}}/>
              <Tooltip contentStyle={tooltipStyle} formatter={v=>`${sym}${v}`}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Line type="monotone" dataKey="mainsCost" stroke="#3b82f6" strokeWidth={2.5} dot={{fill:'#3b82f6',r:4}} name="Grid Cost"/>
              <Line type="monotone" dataKey="dgCost"    stroke="#f59e0b" strokeWidth={2.5} dot={{fill:'#f59e0b',r:4}} name="DG Cost"/>
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {label:'Avg Daily Usage', value:'13.5 kWh', grad:'from-blue-500 to-blue-700'},
          {label:'This Month Cost', value:`${sym}2,847`,   grad:'from-emerald-500 to-emerald-700'},
          {label:'Peak Load',       value:'2.85 kW',  grad:'from-purple-500 to-purple-700'},
          {label:'Total This Month',value:'387.2 kWh',grad:'from-orange-500 to-orange-700'},
        ].map((s,i)=>(
          <div key={i} className={`keep-white bg-gradient-to-br ${s.grad} text-white rounded-2xl p-5 shadow-card`}>
            <p className="text-xs opacity-80 mb-1 font-medium">{s.label}</p>
            <p className="text-xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
