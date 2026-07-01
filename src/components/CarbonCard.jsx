import { Leaf, TreePine, Cloud } from 'lucide-react'

export default function CarbonCard({ compact = false }) {
  const co2Saved = 2847
  const treesEquivalent = 142
  const coalAvoided = 1250
  const offsetPct = 68

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <Leaf size={16} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Carbon Offset</p>
            <p className="text-[10px] text-gray-400">This month</p>
          </div>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-extrabold text-green-600">{co2Saved.toLocaleString()}</span>
          <span className="text-xs font-bold text-gray-400 mb-1">kg CO₂</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
          <TreePine size={12} />
          <span>{treesEquivalent} trees equivalent</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <Leaf size={20} className="text-green-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Environmental Impact</h3>
          <p className="text-xs text-gray-400">Your contribution to sustainability</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-green-50 p-3 border border-green-100 text-center">
          <Cloud size={18} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-extrabold text-green-700">{co2Saved.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-green-500 uppercase">kg CO₂ saved</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3 border border-green-100 text-center">
          <TreePine size={18} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-extrabold text-green-700">{treesEquivalent}</p>
          <p className="text-[10px] font-bold text-green-500 uppercase">Trees equivalent</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3 border border-green-100 text-center">
          <Leaf size={18} className="mx-auto mb-1 text-green-600" />
          <p className="text-lg font-extrabold text-green-700">{coalAvoided}</p>
          <p className="text-[10px] font-bold text-green-500 uppercase">kg coal avoided</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-gray-500">Grid Independence</span>
          <span className="text-xs font-extrabold text-green-600">{offsetPct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-green-500 transition-all duration-1000" style={{ width: `${offsetPct}%` }} />
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">{offsetPct}% of your energy needs met by solar + battery</p>
      </div>
    </div>
  )
}
