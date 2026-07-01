import { useState } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const PROJECTS = ['ABC Residency','XYZ Towers','Elite Heights','Green Valley','Palm Court']

export default function SuperAdminTariff() {
  const { country } = useCurrency()
  const sym = country.symbol
  const [selectedProject, setSelectedProject] = useState('ABC Residency')
  const [tariffs, setTariffs] = useState({
    'ABC Residency': { grid:'10.50', dg:'42.00', fixed:'250', gst:'18', lateFee:'5', freeUnits:'0' },
    'XYZ Towers':    { grid:'11.00', dg:'44.00', fixed:'300', gst:'18', lateFee:'5', freeUnits:'50' },
    'Elite Heights': { grid:'10.00', dg:'40.00', fixed:'200', gst:'18', lateFee:'3', freeUnits:'0' },
    'Green Valley':  { grid:'10.75', dg:'43.00', fixed:'275', gst:'18', lateFee:'5', freeUnits:'0' },
    'Palm Court':    { grid:'11.50', dg:'45.00', fixed:'350', gst:'18', lateFee:'7', freeUnits:'100' },
  })

  const t = tariffs[selectedProject]
  const setField = (k, v) => setTariffs(prev => ({ ...prev, [selectedProject]: { ...prev[selectedProject], [k]: v } }))
  const save = () => addToast(`✅ Tariff updated for ${selectedProject}!`, 'success')

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  const Field = ({ label, field, suffix }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <input type="number" value={t[field]} onChange={e => setField(field, e.target.value)}
               className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-purple-500 transition-all pr-12"/>
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">{suffix}</span>}
      </div>
    </div>
  )

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tariff Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Configure electricity rates per project</p>
        </div>
        <button onClick={save} className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>
          Save Changes
        </button>
      </div>

      <div className="p-4 rounded-xl border border-amber-700/30" style={{background:'rgba(120,53,15,0.2)'}}>
        <p className="text-xs text-amber-400">⚠️ Tariff changes apply from the next billing cycle. Changes here override society-level settings.</p>
      </div>

      {/* Project selector */}
      <div className="flex gap-2 flex-wrap">
        {PROJECTS.map(p => (
          <button key={p} onClick={() => setSelectedProject(p)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedProject===p?'text-white border-purple-500':'text-gray-400 border-[rgba(255,255,255,0.08)] hover:text-white'}`}
                  style={selectedProject===p?{background:'rgba(124,58,237,0.2)'}:{}}>
            {p}
          </button>
        ))}
      </div>

      {/* Tariff form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className={CARD + ' space-y-4'}>
          <h2 className="text-base font-bold text-white">Energy Rates — {selectedProject}</h2>
          <Field label="Grid (Mains) Rate" field="grid" suffix={`${sym}/kWh`}/>
          <Field label="DG (Generator) Rate" field="dg" suffix={`${sym}/kWh`}/>
          <Field label="Fixed Monthly Charge" field="fixed" suffix={sym}/>
          <Field label="Free Units (Slab)" field="freeUnits" suffix="kWh/month"/>
        </div>
        <div className={CARD + ' space-y-4'}>
          <h2 className="text-base font-bold text-white">Taxes & Penalties</h2>
          <Field label="GST Rate" field="gst" suffix="%"/>
          <Field label="Late Payment Fee" field="lateFee" suffix="%"/>
          <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] dark-row">
            <p className="text-xs text-gray-400 mb-3">Estimated monthly bill preview (250 kWh grid + 50 kWh DG)</p>
            {[
              ['Grid charges', (parseFloat(t.grid)||0) * 250],
              ['DG charges',   (parseFloat(t.dg)||0) * 50],
              ['Fixed charge', parseFloat(t.fixed)||0],
            ].map(([l,v])=>(
              <div key={l} className="flex justify-between text-xs py-1.5 border-b border-[rgba(255,255,255,0.04)]">
                <span className="text-gray-400">{l}</span>
                <span className="text-gray-200 font-semibold">{sym}{v.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm py-2 font-bold">
              <span className="text-white">Total (incl. {t.gst}% GST)</span>
              <span className="text-purple-400">{sym}{Math.round(((parseFloat(t.grid)||0)*250+(parseFloat(t.dg)||0)*50+(parseFloat(t.fixed)||0))*(1+(parseFloat(t.gst)||0)/100)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
