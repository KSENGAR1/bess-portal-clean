import { useEffect, useState } from 'react'
import { Sun, CloudSun, TrendingUp, TrendingDown } from 'lucide-react'

export default function SolarTracker({ compact = false }) {
  const [currentGen, setCurrentGen] = useState(4.8)
  const [dailyGen, setDailyGen] = useState(28.5)
  const [peakToday, setPeakToday] = useState(5.2)
  const [efficiency, setEfficiency] = useState(21.4)
  const [forecast, setForecast] = useState([4.2, 5.1, 4.8, 3.5, 2.1])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGen(3 + Math.random() * 3.5)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Sun size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Solar Generation</p>
              <p className="text-[10px] text-gray-400">Real-time PV output</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600">{efficiency}% eff</span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-extrabold text-gray-900">{currentGen.toFixed(1)}</span>
          <span className="text-xs font-bold text-gray-400 mb-1">kW</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full bg-amber-500 transition-all duration-1000" style={{ width: `${(currentGen / 7) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400">
          <span>Today: {dailyGen} kWh</span>
          <span>Peak: {peakToday} kW</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Sun size={20} className="text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Solar Generation</h3>
            <p className="text-xs text-gray-400">PV Array · 12 kWp capacity</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Generating
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-amber-50 p-3 border border-amber-100">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Current Output</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-extrabold text-amber-700">{currentGen.toFixed(1)}</span>
            <span className="text-xs font-bold text-amber-500 mb-1">kW</span>
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 border border-blue-100">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Today's Total</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-extrabold text-blue-700">{dailyGen}</span>
            <span className="text-xs font-bold text-blue-500 mb-1">kWh</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">5-Day Forecast</p>
        <div className="flex gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div key={day} className="flex-1 rounded-xl bg-gray-50 p-2 text-center border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400">{day}</p>
              <CloudSun size={14} className="mx-auto my-1 text-amber-500" />
              <p className="text-xs font-extrabold text-gray-700">{forecast[i]}<span className="text-[9px]">kWh</span></p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400 font-medium">Peak today: <strong className="text-gray-700">{peakToday} kW</strong></span>
        <span className="text-gray-400 font-medium">Efficiency: <strong className="text-amber-600">{efficiency}%</strong></span>
      </div>
    </div>
  )
}
