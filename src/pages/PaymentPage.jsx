import { useState } from 'react'
import { useCurrency } from '../context/CurrencyContext'

const presets = [500, 1000, 2000, 5000, 10000]

const methods = [
  { id: 'upi',        icon: '📱', name: 'UPI',             sub: 'Google Pay · PhonePe · Paytm' },
  { id: 'card',       icon: '💳', name: 'Debit / Credit',   sub: 'Visa · Mastercard · RuPay' },
  { id: 'netbanking', icon: '🏦', name: 'Net Banking',      sub: 'All major Indian banks' },
  { id: 'wallet',     icon: '👛', name: 'Digital Wallet',   sub: 'Paytm · Amazon Pay · Mobikwik' },
]

export default function PaymentPage({ onNavigate, walletBalance = 2450, onPaymentSuccess }) {
  const { country } = useCurrency()
  const sym = country.symbol
  const [amount, setAmount]       = useState('')
  const [method, setMethod]       = useState('upi')
  const [upiId, setUpiId]         = useState('')
  const [cardNum, setCardNum]     = useState('')
  const [cardExp, setCardExp]     = useState('')
  const [cardCvv, setCardCvv]     = useState('')
  const [cardName, setCardName]   = useState('')
  const [bank, setBank]           = useState('')
  const [step, setStep]           = useState(1)
  const [orderId]   = useState('ORD' + Math.random().toString(36).substr(2,9).toUpperCase())
  const [txnId]     = useState('TXN' + Math.random().toString(36).substr(2,12).toUpperCase())

  const canProceed = amount && parseInt(amount) >= 100

  const formatCard = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const formatExp  = v => {
    const d = v.replace(/\D/g,'').slice(0,4)
    return d.length > 2 ? d.slice(0,2) + '/' + d.slice(2) : d
  }

  const handleConfirm = () => {
    setStep(3)
    setTimeout(() => {
      if (onPaymentSuccess) onPaymentSuccess(parseInt(amount) || 0)
      setStep(4)
    }, 2000)
  }

  const amtNum = parseInt(amount) || 0
  const newBalance = walletBalance + amtNum

  /* ── Step 1: Amount & Method ───────────────────────── */
  if (step === 1) return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28 animate-fade-in">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-6 hover:underline">
        ← Back
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add Money to Wallet</h2>
        <p className="text-sm text-gray-500 mt-1">Fast & secure · Demo mode</p>
      </div>

      {/* Current balance pill */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6 text-sm">
        <span>💳</span>
        <span className="text-gray-600">Current balance:</span>
        <span className="font-bold text-blue-700 ml-auto">{sym}{walletBalance.toLocaleString()}</span>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Quick Add</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {presets.map(p => (
            <button key={p} onClick={() => setAmount(p.toString())}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                      amount === p.toString()
                        ? 'border-blue-600 bg-blue-600 text-white shadow-glow-blue'
                        : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}>
              {sym}{p.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{sym}</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                 placeholder="Custom amount"
                 className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Min {sym}100 · Max {sym}1,00,000</p>
      </div>

      {/* Method picker */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Payment Method</p>
        <div className="space-y-2">
          {methods.map(m => (
            <label key={m.id}
                   className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                     method === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                   }`}>
              <input type="radio" name="method" value={m.id} checked={method === m.id}
                     onChange={() => setMethod(m.id)} className="accent-blue-600" />
              <span className="text-xl">{m.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400">{m.sub}</p>
              </div>
              {method === m.id && <span className="text-blue-600 text-lg">✓</span>}
            </label>
          ))}
        </div>
      </div>

      <button onClick={() => setStep(2)} disabled={!canProceed}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-blue"
              style={{ background: canProceed ? 'linear-gradient(135deg,#0066FF,#6366f1)' : '#9ca3af' }}>
        Proceed to Pay — {sym}{amtNum.toLocaleString()} →
      </button>
    </div>
  )

  /* ── Step 2: Gateway ───────────────────────────────── */
  if (step === 2) return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28 animate-fade-in">
      <button onClick={() => setStep(1)} className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-6 hover:underline">
        ← Change Amount
      </button>

      {/* Branded header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-[#0066FF] to-[#6366f1] rounded-2xl p-4 mb-6 text-white">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🔐</div>
        <div>
          <p className="font-bold text-sm">Secure Payment Gateway</p>
          <p className="text-xs text-blue-200">256-bit SSL · Demo Mode</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-extrabold">{sym}{amtNum.toLocaleString()}</p>
          <p className="text-xs text-blue-200">to be added</p>
        </div>
      </div>

      {/* Order summary strip */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 border border-gray-100">
        <span>Order <span className="font-mono font-bold text-gray-700">{orderId}</span></span>
        <span>Method: <span className="font-bold text-gray-700">{methods.find(m=>m.id===method)?.name}</span></span>
        <span className="ml-auto text-emerald-600 font-bold">● Secure</span>
      </div>

      {/* Input forms */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-5 space-y-4">
        {method === 'upi' && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Enter UPI Details</p>
            <input type="text" placeholder="yourname@upi" value={upiId} onChange={e=>setUpiId(e.target.value)}
                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" />
            <div className="flex gap-2 flex-wrap">
              {['@okaxis','@ybl','@paytm','@okhdfcbank'].map(h => (
                <button key={h} onClick={() => setUpiId('yourname' + h)}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 font-medium">
                  {h}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">Demo: click any handle above or type any UPI ID</p>
          </>
        )}

        {method === 'card' && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Card Details</p>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Cardholder Name</label>
              <input type="text" placeholder="Rajesh Kumar" value={cardName} onChange={e=>setCardName(e.target.value)}
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Card Number</label>
              <input type="text" placeholder="4111 1111 1111 1111" value={cardNum} onChange={e=>setCardNum(formatCard(e.target.value))}
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Expiry</label>
                <input placeholder="MM/YY" value={cardExp} onChange={e=>setCardExp(formatExp(e.target.value))}
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">CVV</label>
                <input type="password" placeholder="•••" maxLength={4} value={cardCvv} onChange={e=>setCardCvv(e.target.value.replace(/\D/g,''))}
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Demo: use 4111 1111 1111 1111 · 12/26 · 123</p>
          </>
        )}

        {method === 'netbanking' && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Select Bank</p>
            <div className="grid grid-cols-2 gap-2">
              {['SBI','HDFC','ICICI','Axis','Kotak','PNB'].map(b => (
                <button key={b} onClick={() => setBank(b)}
                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                          bank === b ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-blue-200'
                        }`}>
                  🏦 {b}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">Demo: select any bank above</p>
          </>
        )}

        {method === 'wallet' && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Select Wallet</p>
            <div className="grid grid-cols-2 gap-2">
              {[['Paytm','🟦'],['Amazon Pay','🟠'],['Mobikwik','💜'],['Freecharge','🔵']].map(([w,em]) => (
                <button key={w} onClick={() => setBank(w)}
                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                          bank === w ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-blue-200'
                        }`}>
                  {em} {w}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Security badges */}
      <div className="flex gap-3 justify-center mb-5">
        {['🔒 SSL Encrypted','🛡️ PCI DSS','✅ RBI Compliant'].map(b => (
          <span key={b} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">{b}</span>
        ))}
      </div>

      <button onClick={handleConfirm}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm shadow-glow-blue"
              style={{ background: 'linear-gradient(135deg,#0066FF,#6366f1)' }}>
        Confirm Payment {sym}{amtNum.toLocaleString()} →
      </button>
    </div>
  )

  /* ── Step 3: Processing ────────────────────────────── */
  if (step === 3) return (
    <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center animate-fade-in">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-50" />
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
             style={{ background: 'linear-gradient(135deg,#0066FF,#6366f1)' }}>⚡</div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment…</h2>
      <p className="text-gray-500 text-sm">Please wait, do not press back</p>

      <div className="mt-10 w-full max-w-xs space-y-2">
        {['Connecting to gateway…', 'Verifying details…', 'Processing transaction…'].map((t, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-xs animate-pulse">·</span>
            <span className="text-gray-500">{t}</span>
          </div>
        ))}
      </div>
    </div>
  )

  /* ── Step 4: Success ───────────────────────────────── */
  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28 animate-fade-in">
      {/* Success hero */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center text-5xl mx-auto mb-4 shadow-glow-green">
          ✅
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
        <p className="text-gray-500 text-sm mt-1">Your BESS wallet has been credited</p>
      </div>

      {/* Receipt card */}
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden mb-6">
        {/* Green stripe */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

        <div className="p-5 space-y-0">
          <div className="text-center py-4 border-b border-dashed border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Amount Credited</p>
            <p className="text-4xl font-extrabold text-emerald-600 mt-1">{sym}{amtNum.toLocaleString()}</p>
          </div>

          <div className="pt-4 space-y-3">
            {[
              ['Transaction ID',  txnId,                                                    'font-mono text-xs'],
              ['Order ID',        orderId,                                                   'font-mono text-xs'],
              ['Payment Method',  methods.find(m=>m.id===method)?.name,                    ''],
              ['Date & Time',     new Date().toLocaleString('en-IN'),                       ''],
              ['Amount Added',    `${sym}${amtNum.toLocaleString()}`,                   'text-blue-600 font-bold'],
              ['New Balance',     `${sym}${newBalance.toLocaleString()}`,               'text-emerald-600 font-bold'],
            ].map(([label, val, cls]) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{label}</span>
                <span className={`text-gray-900 font-semibold ${cls}`}>{val}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-200 mt-4 pt-3 text-center">
            <p className="text-xs text-gray-400">Receipt sent to your registered email</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button onClick={() => onNavigate('wallet')}
                className="w-full py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#0066FF,#6366f1)' }}>
          View Wallet →
        </button>
        <button onClick={() => onNavigate('dashboard')}
                className="w-full py-3 rounded-2xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
          Back to Home
        </button>
      </div>
    </div>
  )
}
