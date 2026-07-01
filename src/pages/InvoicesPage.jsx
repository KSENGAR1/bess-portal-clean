import { useState } from 'react'
import { useCurrency } from '../context/CurrencyContext'
import { useToast } from '../components/ToastProvider'

const INVOICES = [
  {
    id: 1, number: 'INV-2024-06-001', month: 'June 2024', period: '1 Jun – 30 Jun',
    generated: '30 Jun 2024', due: '15 Jul 2024', status: 'Unpaid',
    mainsUnits: 312.5, dgUnits: 74.7, mainsRate: 12, dgRate: 45,
    fixed: 250, gstRate: 0.18, total: 5285,
  },
  {
    id: 2, number: 'INV-2024-05-001', month: 'May 2024', period: '1 May – 31 May',
    generated: '31 May 2024', due: '15 Jun 2024', status: 'Paid',
    mainsUnits: 272.5, dgUnits: 58.2, mainsRate: 12, dgRate: 45,
    fixed: 250, gstRate: 0.18, total: 4765,
  },
  {
    id: 3, number: 'INV-2024-04-001', month: 'April 2024', period: '1 Apr – 30 Apr',
    generated: '30 Apr 2024', due: '15 May 2024', status: 'Paid',
    mainsUnits: 238.3, dgUnits: 60.0, mainsRate: 12, dgRate: 45,
    fixed: 250, gstRate: 0.18, total: 4408,
  },
  {
    id: 4, number: 'INV-2024-03-001', month: 'March 2024', period: '1 Mar – 31 Mar',
    generated: '31 Mar 2024', due: '15 Apr 2024', status: 'Paid',
    mainsUnits: 255.8, dgUnits: 60.0, mainsRate: 12, dgRate: 45,
    fixed: 250, gstRate: 0.18, total: 4570,
  },
]

export default function InvoicesPage({ onNavigate }) {
  const { country } = useCurrency()
  const sym = country.symbol
  const { addToast } = useToast()
  const [sel, setSel] = useState(null)

  if (sel) {
    const inv = sel
    const mainsChrg  = inv.mainsUnits * inv.mainsRate
    const dgChrg     = inv.dgUnits    * inv.dgRate
    const subtotal   = mainsChrg + dgChrg + inv.fixed
    const sgst       = +(subtotal * inv.gstRate / 2).toFixed(2)
    const cgst       = sgst
    const grandTotal = +(subtotal + sgst + cgst).toFixed(2)

    const handleDownload = () => {
      addToast(`${inv.number}.pdf downloaded successfully`, 'success')
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-28 animate-fade-in">
        <button onClick={() => setSel(null)}
                className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-6 hover:underline">
          ← All Invoices
        </button>

        {/* Invoice card */}
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
          {/* Header stripe */}
          <div className="px-6 py-5 flex items-start justify-between"
               style={{ background: 'linear-gradient(135deg,#0047cc,#6366f1)' }}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-white font-bold text-lg">BESS Systems</span>
              </div>
              <p className="text-blue-200 text-xs">Energy Management Portal</p>
              <p className="text-blue-200 text-xs mt-0.5">Galaxy Apartments, Mumbai</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-sm">INVOICE</p>
              <p className="text-blue-200 text-xs font-mono mt-1">{inv.number}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                inv.status === 'Unpaid' ? 'bg-red-400 text-white' : 'bg-emerald-400 text-white'
              }`}>
                {inv.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Bill to / billing details */}
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-dashed border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                <p className="font-bold text-gray-900">Rajesh Kumar</p>
                <p className="text-sm text-gray-500">Tower A, Flat 302</p>
                <p className="text-sm text-gray-500">Galaxy Apartments</p>
                <p className="text-sm text-gray-500">Mumbai – 400001</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing Info</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Period</span>
                    <span className="font-semibold text-gray-700">{inv.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Generated</span>
                    <span className="font-semibold text-gray-700">{inv.generated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Due Date</span>
                    <span className={`font-bold ${inv.status === 'Unpaid' ? 'text-red-600' : 'text-gray-700'}`}>{inv.due}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Flat ID</span>
                    <span className="font-semibold text-gray-700 font-mono">FL-302-GA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Charges</p>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                      <th className="text-left px-4 py-2.5 font-semibold">Description</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Units</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Rate</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Grid (Mains) Electricity', `${inv.mainsUnits} kWh`, `${sym}${inv.mainsRate}/kWh`, mainsChrg],
                      ['DG Electricity',           `${inv.dgUnits} kWh`,  `${sym}${inv.dgRate}/kWh`,    dgChrg],
                      ['Fixed / Maintenance Charge','—',                 `${sym}${inv.fixed}`,           inv.fixed],
                    ].map(([desc, units, rate, amt], i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-700">{desc}</td>
                        <td className="px-3 py-3 text-right text-gray-500">{units}</td>
                        <td className="px-3 py-3 text-right text-gray-500">{rate}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">{sym}{amt.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="ml-auto w-64 space-y-2 text-sm mb-6">
              {[
                ['Subtotal', subtotal],
                ['SGST (9%)', sgst],
                ['CGST (9%)', cgst],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-gray-500">
                  <span>{label}</span>
                  <span className="font-semibold text-gray-700">{sym}{val.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-200 text-base">
                <span className="font-bold text-gray-900">Total Due</span>
                <span className="font-extrabold text-blue-700">{sym}{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {inv.status === 'Unpaid' && (
                <button onClick={() => onNavigate('payment')}
                        className="flex-1 py-3 rounded-2xl font-bold text-white text-sm"
                        style={{ background: 'linear-gradient(135deg,#0066FF,#6366f1)' }}>
                  Pay {sym}{grandTotal.toLocaleString()} →
                </button>
              )}
              <button onClick={handleDownload}
                      className={`${inv.status === 'Unpaid' ? '' : 'flex-1'} px-5 py-3 rounded-2xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center gap-2`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const unpaid = INVOICES.filter(i => i.status === 'Unpaid')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Invoices</h2>
        <p className="text-sm text-gray-500 mt-1">Monthly billing statements</p>
      </div>

      {/* Alert for unpaid */}
      {unpaid.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <span className="text-2xl">🔴</span>
          <div className="flex-1">
            <p className="font-bold text-red-800 text-sm">{unpaid.length} invoice pending payment</p>
            <p className="text-xs text-red-600 mt-0.5">Due: {unpaid[0].due} · {sym}{unpaid[0].total.toLocaleString()}</p>
          </div>
          <button onClick={() => setSel(unpaid[0])}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all">
            Pay Now
          </button>
        </div>
      )}

      {/* Summary pills */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'Total Bills', value: INVOICES.length, icon: '📄', color: 'bg-blue-600' },
          { label: 'Paid',        value: INVOICES.filter(i=>i.status==='Paid').length,   icon: '✅', color: 'bg-emerald-600' },
          { label: 'Unpaid',      value: INVOICES.filter(i=>i.status==='Unpaid').length, icon: '⏳', color: 'bg-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-3 shadow-card border border-gray-100 flex items-center gap-3">
            <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-extrabold text-gray-900 leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice list */}
      <div className="space-y-3">
        {INVOICES.map(inv => (
          <button key={inv.id} onClick={() => setSel(inv)}
                  className="w-full bg-white rounded-2xl p-4 shadow-card border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all text-left">
            <div className="flex items-start justify-between gap-3">
              {/* Icon */}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${
                inv.status === 'Unpaid' ? 'bg-red-100' : 'bg-emerald-100'
              }`}>
                {inv.status === 'Unpaid' ? '📋' : '✅'}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-900 text-sm">{inv.month}</p>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                    inv.status === 'Unpaid'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  }`}>
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{inv.number}</p>
                <p className="text-xs text-gray-500 mt-1">{inv.period} · Due {inv.due}</p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="font-extrabold text-gray-900">{sym}{inv.total.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{inv.mainsUnits + inv.dgUnits} kWh</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
