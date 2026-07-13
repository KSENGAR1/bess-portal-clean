import { useState, useEffect } from 'react'
import { useCurrency, COUNTRIES } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const TABS = ['General','Tariff','Notifications','Security','Region']

export default function AdminSettings() {
  const [tab, setTab]     = useState('General')
  const [saved, setSaved] = useState(false)
  const { country, setCountry } = useCurrency()
  const { addToast } = useToast()
  const sym = country.symbol
  const [isDark, setIsDark] = useState(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  )
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const [general, setGeneral] = useState({
    societyName:'ABC Residency', address:'123 Main Street, Sector 14, Delhi',
    email:'admin@abcresidency.com', phone:'98765-43210',
    billFrequency:'Monthly', lateFee:'5', billDueDay:'15',
  })

  const [tariff, setTariff] = useState({
    mainsRate:'12', dgRate:'45', fixedCharge:'250', gstRate:'18',
    lowBalanceAlert:'1000', criticalBalance:'500',
  })

  const [notif, setNotif] = useState({
    lowBalance: true, billGenerated: true, paymentReceived: true,
    meterOffline: true, tamperAlert: true, societyNotices: false,
  })

  const showToast = msg => addToast(msg, 'success')
  const save = () => { setSaved(true); addToast('Settings saved successfully!', 'success') }

  const Input = ({ label, value, onChange, type='text', suffix }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={onChange}
               className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500 transition-all" />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">{suffix}</span>}
      </div>
    </div>
  )

  const Toggle = ({ label, sub, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)]">
      <div>
        <p className="text-white font-medium text-sm">{label}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
      <button onClick={onChange}
              className={`w-11 h-6 rounded-full transition-all relative ${checked?'bg-amber-600':'dark-row-2'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked?'left-5':'left-0.5'}`} />
      </button>
    </div>
  )

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      {/* Society identity banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4 border"
           style={{ background:'rgba(217,119,6,0.08)', borderColor:'rgba(217,119,6,0.25)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
             style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>🏢</div>
        <div className="flex-1 min-w-0">
          <p className="text-amber-400 font-bold text-sm">ABC Residency</p>
          <p className="text-gray-500 text-xs">Sector 14, Delhi · 4 towers · 4 tower admins · Aggregated tower-level data</p>
        </div>
        <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ● Active
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Configure ABC Residency settings</p>
        </div>
        <button onClick={save}
                className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 dark-page-bg p-1 rounded-xl w-fit border border-[rgba(255,255,255,0.06)]">
        {TABS.map(t => (
          <button key={t} onClick={()=>setTab(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab===t ? 'bg-amber-700 text-white' : 'text-gray-400 hover:text-white'
                  }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'General' && (
        <div className={CARD + ' space-y-4 max-w-2xl'}>
          <h2 className="text-base font-bold text-white">Society Information</h2>
          <Input label="Society Name" value={general.societyName} onChange={e=>setGeneral({...general,societyName:e.target.value})} />
          <Input label="Address" value={general.address} onChange={e=>setGeneral({...general,address:e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Contact Email" type="email" value={general.email} onChange={e=>setGeneral({...general,email:e.target.value})} />
            <Input label="Contact Phone" value={general.phone} onChange={e=>setGeneral({...general,phone:e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Billing Frequency</label>
              <select value={general.billFrequency} onChange={e=>setGeneral({...general,billFrequency:e.target.value})}
                      className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500">
                <option>Monthly</option><option>Quarterly</option>
              </select>
            </div>
            <Input label="Bill Due Day" value={general.billDueDay} onChange={e=>setGeneral({...general,billDueDay:e.target.value})} suffix="of month" />
            <Input label="Late Payment Fee" value={general.lateFee} onChange={e=>setGeneral({...general,lateFee:e.target.value})} suffix="%" />
          </div>
        </div>
      )}

      {tab === 'Tariff' && (
        <div className={CARD + ' space-y-4 max-w-2xl'}>
          <h2 className="text-base font-bold text-white">Tariff Configuration</h2>
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl px-4 py-3 text-xs text-amber-400">
            ⚠️ Tariff changes will apply to future billing cycles only. Contact SuperAdmin to change rates mid-cycle.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Mains Rate" value={tariff.mainsRate} onChange={e=>setTariff({...tariff,mainsRate:e.target.value})} suffix={`${sym}/kWh`} />
            <Input label="DG Rate" value={tariff.dgRate} onChange={e=>setTariff({...tariff,dgRate:e.target.value})} suffix={`${sym}/kWh`} />
            <Input label="Fixed Monthly Charge" value={tariff.fixedCharge} onChange={e=>setTariff({...tariff,fixedCharge:e.target.value})} suffix={`${sym}`} />
            <Input label="GST Rate" value={tariff.gstRate} onChange={e=>setTariff({...tariff,gstRate:e.target.value})} suffix="%" />
            <Input label="Low Balance Alert" value={tariff.lowBalanceAlert} onChange={e=>setTariff({...tariff,lowBalanceAlert:e.target.value})} suffix={`${sym}`} />
            <Input label="Critical Balance" value={tariff.criticalBalance} onChange={e=>setTariff({...tariff,criticalBalance:e.target.value})} suffix={`${sym}`} />
          </div>
        </div>
      )}

      {tab === 'Notifications' && (
        <div className={CARD + ' max-w-2xl'}>
          <h2 className="text-base font-bold text-white mb-2">Alert & Notification Preferences</h2>
          <p className="text-gray-500 text-xs mb-4">Control which events trigger notifications to residents and admins</p>
          <Toggle label="Low Balance Alerts"    sub="Notify when wallet < threshold"         checked={notif.lowBalance}       onChange={()=>setNotif({...notif,lowBalance:!notif.lowBalance})} />
          <Toggle label="Bill Generated"         sub="Notify when monthly bill is ready"      checked={notif.billGenerated}    onChange={()=>setNotif({...notif,billGenerated:!notif.billGenerated})} />
          <Toggle label="Payment Received"       sub="Confirm wallet top-ups"                checked={notif.paymentReceived}  onChange={()=>setNotif({...notif,paymentReceived:!notif.paymentReceived})} />
          <Toggle label="Meter Offline Alerts"   sub="Alert admin when meter goes offline"   checked={notif.meterOffline}     onChange={()=>setNotif({...notif,meterOffline:!notif.meterOffline})} />
          <Toggle label="Tamper Alerts"          sub="Immediate alert on tamper detection"   checked={notif.tamperAlert}      onChange={()=>setNotif({...notif,tamperAlert:!notif.tamperAlert})} />
          <Toggle label="Society Notices"        sub="Broadcast notices to all residents"    checked={notif.societyNotices}   onChange={()=>setNotif({...notif,societyNotices:!notif.societyNotices})} />
        </div>
      )}

      {tab === 'Security' && (
        <div className={CARD + ' max-w-2xl space-y-4'}>
          <h2 className="text-base font-bold text-white">Security Settings</h2>
          <div className="space-y-3">
            {[
              { label:'Change Admin Password', icon:'🔐', action:()=>addToast('Password reset email sent!', 'success') },
              { label:'Enable 2-Factor Authentication', icon:'📱', action:()=>addToast('2FA setup link sent to your email!', 'success') },
              { label:'Active Sessions', icon:'💻', action:()=>addToast('2 active sessions found', 'success') },
              { label:'Download Audit Log', icon:'📜', action:()=>addToast('📥 Audit log downloaded', 'success') },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                      className="w-full flex items-center gap-3 p-4 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)] transition-all text-left">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white font-medium text-sm">{item.label}</span>
                <span className="ml-auto text-gray-500">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {tab === 'Region' && (
        <div className={CARD + ' max-w-2xl space-y-5'}>
          <div>
            <h2 className="text-base font-bold text-white">Region & Currency</h2>
            <p className="text-gray-500 text-xs mt-0.5">Choose your country to set the default currency and dial code across the app</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COUNTRIES.map(c => {
              const isSelected = c.code === country.code
              return (
                <button key={c.code} onClick={() => { setCountry(c.code); addToast(`✅ Region set to ${c.name} (${c.currency})`, 'success') }}
                        className="flex items-center gap-3 p-4 rounded-xl border transition-all text-left"
                        style={isSelected
                          ? { background:'rgba(245,158,11,0.12)', borderColor:'rgba(245,158,11,0.5)', boxShadow:'0 0 16px rgba(245,158,11,0.15)' }
                          : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)' }}>
                  <span className="text-2xl">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{c.name}</p>
                    <p className="text-gray-400 text-xs">{c.dialCode} · {c.currency} ({c.symbol})</p>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background:'rgba(245,158,11,0.2)', color: isDark ? '#fcd34d' : '#b45309' }}>Active</span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="p-4 rounded-xl border" style={{ background:'rgba(245,158,11,0.08)', borderColor:'rgba(245,158,11,0.2)' }}>
            <p className="text-xs font-bold text-amber-400 mb-1">Currently Active</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{country.flag}</span>
              <div>
                <p className="text-white font-bold">{country.name}</p>
                <p className="text-gray-400 text-xs">
                  Currency: <strong className="text-amber-400">{country.currency} ({country.symbol})</strong>
                  &nbsp;·&nbsp;Dial code: <strong className="text-amber-400">{country.dialCode}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
