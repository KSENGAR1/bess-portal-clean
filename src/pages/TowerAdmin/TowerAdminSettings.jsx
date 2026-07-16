import { useState, useEffect } from 'react'
import { useCurrency, COUNTRIES } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const TABS = ['General', 'Billing', 'Alerts', 'Security', 'Region']

function Input({ label, value, onChange, type = 'text', suffix, readOnly }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-sm focus:outline-none transition-all
            ${readOnly
              ? 'text-gray-500 cursor-not-allowed opacity-70'
              : 'text-white focus:border-cyan-500'
            }`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
            {suffix}
          </span>
        )}
      </div>
      {readOnly && (
        <p className="text-[10px] text-gray-600 mt-0.5">Managed by Society Admin</p>
      )}
    </div>
  )
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)]">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-white font-medium text-sm">{label}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${checked ? 'bg-cyan-600' : 'dark-row-2'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`}
        />
      </button>
    </div>
  )
}

const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

export default function TowerAdminSettings() {
  const [tab, setTab] = useState('General')
  const { country, setCountry } = useCurrency()
  const { addToast } = useToast()
  const sym = country.symbol

  const [isDark, setIsDark] = useState(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const [general, setGeneral] = useState({
    towerName: 'Tower A',
    society: 'ABC Residency',
    address: '123 Main Street, Sector 14, Delhi',
    email: 'towerA@abcresidency.com',
    phone: '+91 98765-43210',
    totalFloors: '12',
    totalFlats: '48',
  })

  const [billing, setBilling] = useState({
    billDueDay: '15',
    gracePeriodDays: '5',
    lateFee: '5',
    lowBalanceAlert: '1000',
    criticalBalance: '500',
    autoDisconnect: false,
    autoReconnect: true,
  })

  const [alerts, setAlerts] = useState({
    meterOffline: true,
    tamperDetection: true,
    lowBalance: true,
    billGenerated: true,
    paymentReceived: true,
    dgSwitch: true,
    residentComplaints: false,
    noticePublished: true,
  })

  const save = () => addToast('Settings saved successfully!', 'success')

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      {/* Tower identity banner */}
      <div
        className="rounded-2xl p-4 flex items-center gap-4 border"
        style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.25)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)' }}
        >🏗️</div>
        <div className="flex-1 min-w-0">
          <p className="text-cyan-400 font-bold text-sm">Tower A — ABC Residency</p>
          <p className="text-gray-500 text-xs">12 floors · 48 flats · Sector 14, Delhi</p>
        </div>
        <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ● Active
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Configure Tower A preferences</p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2 rounded-xl font-bold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)' }}
        >
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 dark-page-bg p-1 rounded-xl w-fit border border-[rgba(255,255,255,0.06)]">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === t ? 'bg-cyan-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 'General' && (
        <div className={`${CARD} space-y-4 max-w-2xl`}>
          <h2 className="text-base font-bold text-white">Tower Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tower Name" value={general.towerName} onChange={e => setGeneral({ ...general, towerName: e.target.value })} />
            <Input label="Society" value={general.society} readOnly />
          </div>
          <Input label="Address" value={general.address} readOnly />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Contact Email" type="email" value={general.email} onChange={e => setGeneral({ ...general, email: e.target.value })} />
            <Input label="Contact Phone" value={general.phone} onChange={e => setGeneral({ ...general, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Floors" value={general.totalFloors} readOnly />
            <Input label="Total Flats" value={general.totalFlats} readOnly />
          </div>
          <div
            className="p-3 rounded-xl border text-xs text-cyan-300"
            style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.2)' }}
          >
            ℹ️ Some fields are managed by your Society Admin and cannot be changed here.
          </div>
        </div>
      )}

      {/* Billing */}
      {tab === 'Billing' && (
        <div className={`${CARD} space-y-4 max-w-2xl`}>
          <h2 className="text-base font-bold text-white">Billing Defaults</h2>
          <div
            className="p-3 rounded-xl border text-xs text-amber-400"
            style={{ background: 'rgba(217,119,6,0.08)', borderColor: 'rgba(217,119,6,0.25)' }}
          >
            ⚠️ Tariff rates are set by your Society Admin. You can configure collection thresholds and alerts here.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Bill Due Day" value={billing.billDueDay} onChange={e => setBilling({ ...billing, billDueDay: e.target.value })} suffix="of month" />
            <Input label="Grace Period" value={billing.gracePeriodDays} onChange={e => setBilling({ ...billing, gracePeriodDays: e.target.value })} suffix="days" />
            <Input label="Late Payment Fee" value={billing.lateFee} onChange={e => setBilling({ ...billing, lateFee: e.target.value })} suffix="%" />
            <Input label="Low Balance Alert" value={billing.lowBalanceAlert} onChange={e => setBilling({ ...billing, lowBalanceAlert: e.target.value })} suffix={sym} />
            <Input label="Critical Balance" value={billing.criticalBalance} onChange={e => setBilling({ ...billing, criticalBalance: e.target.value })} suffix={sym} />
          </div>
          <div className="pt-2 border-t border-[rgba(255,255,255,0.05)] space-y-0">
            <Toggle
              label="Auto Disconnect on Zero Balance"
              sub="Automatically cut power when wallet hits 0"
              checked={billing.autoDisconnect}
              onChange={() => setBilling({ ...billing, autoDisconnect: !billing.autoDisconnect })}
            />
            <Toggle
              label="Auto Reconnect on Recharge"
              sub="Restore supply when wallet is topped up"
              checked={billing.autoReconnect}
              onChange={() => setBilling({ ...billing, autoReconnect: !billing.autoReconnect })}
            />
          </div>
        </div>
      )}

      {/* Alerts */}
      {tab === 'Alerts' && (
        <div className={`${CARD} max-w-2xl`}>
          <h2 className="text-base font-bold text-white mb-1">Alert & Notification Preferences</h2>
          <p className="text-gray-500 text-xs mb-4">Choose which events send you notifications</p>
          <Toggle label="Meter Offline" sub="Alert when a meter stops communicating" checked={alerts.meterOffline} onChange={() => setAlerts({ ...alerts, meterOffline: !alerts.meterOffline })} />
          <Toggle label="Tamper Detection" sub="Immediate alert on tamper events" checked={alerts.tamperDetection} onChange={() => setAlerts({ ...alerts, tamperDetection: !alerts.tamperDetection })} />
          <Toggle label="DG / Source Switch" sub="Notify when supply switches between mains and DG" checked={alerts.dgSwitch} onChange={() => setAlerts({ ...alerts, dgSwitch: !alerts.dgSwitch })} />
          <Toggle label="Low Balance" sub="When resident wallet drops below threshold" checked={alerts.lowBalance} onChange={() => setAlerts({ ...alerts, lowBalance: !alerts.lowBalance })} />
          <Toggle label="Bill Generated" sub="When monthly bills are created" checked={alerts.billGenerated} onChange={() => setAlerts({ ...alerts, billGenerated: !alerts.billGenerated })} />
          <Toggle label="Payment Received" sub="Confirm resident top-ups" checked={alerts.paymentReceived} onChange={() => setAlerts({ ...alerts, paymentReceived: !alerts.paymentReceived })} />
          <Toggle label="Resident Complaints" sub="New complaint submitted by a resident" checked={alerts.residentComplaints} onChange={() => setAlerts({ ...alerts, residentComplaints: !alerts.residentComplaints })} />
          <Toggle label="Notice Published" sub="When a new notice is posted" checked={alerts.noticePublished} onChange={() => setAlerts({ ...alerts, noticePublished: !alerts.noticePublished })} />
        </div>
      )}

      {/* Security */}
      {tab === 'Security' && (
        <div className={`${CARD} max-w-2xl space-y-4`}>
          <h2 className="text-base font-bold text-white">Security</h2>
          <div className="space-y-3">
            {[
              { label: 'Change Password', icon: '🔐', action: () => addToast('Password reset email sent!', 'success') },
              { label: 'Enable 2-Factor Authentication', icon: '📱', action: () => addToast('2FA setup link sent to your email!', 'success') },
              { label: 'Active Sessions', icon: '💻', action: () => addToast('2 active sessions found', 'info') },
              { label: 'Download Activity Log', icon: '📜', action: () => addToast('Activity log downloaded', 'success') },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-4 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)] transition-all text-left"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white font-medium text-sm flex-1">{item.label}</span>
                <span className="text-gray-500">→</span>
              </button>
            ))}
          </div>
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
            <p className="text-sm font-bold text-red-400 mb-3">Danger Zone</p>
            <button
              onClick={() => addToast('Logged out of all devices (demo)', 'success')}
              className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all"
            >
              Logout All Devices
            </button>
          </div>
        </div>
      )}

      {/* Region */}
      {tab === 'Region' && (
        <div className={`${CARD} max-w-2xl space-y-5`}>
          <div>
            <h2 className="text-base font-bold text-white">Region & Currency</h2>
            <p className="text-gray-500 text-xs mt-0.5">Sets the currency symbol used across billing and invoices</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COUNTRIES.map(c => {
              const isSelected = c.code === country.code
              return (
                <button
                  key={c.code}
                  onClick={() => { setCountry(c.code); addToast(`Region set to ${c.name} (${c.currency})`, 'success') }}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all text-left"
                  style={isSelected
                    ? { background: 'rgba(6,182,212,0.12)', borderColor: 'rgba(6,182,212,0.5)' }
                    : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{c.name}</p>
                    <p className="text-gray-400 text-xs">{c.dialCode} · {c.currency} ({c.symbol})</p>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">Active</span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}>
            <p className="text-xs font-bold text-cyan-400 mb-1">Currently Active</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{country.flag}</span>
              <div>
                <p className="text-white font-bold">{country.name}</p>
                <p className="text-gray-400 text-xs">
                  Currency: <strong className="text-cyan-400">{country.currency} ({country.symbol})</strong>
                  &nbsp;·&nbsp;Dial code: <strong className="text-cyan-400">{country.dialCode}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
