import { useState, useEffect } from 'react'
import { useCurrency, COUNTRIES } from '../../context/CurrencyContext'
import { useToast } from '../../components/ToastProvider'

const TABS = ['General', 'Billing Policy', 'BESS Thresholds', 'Notifications', 'Security', 'Region']

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
            ${readOnly ? 'text-gray-500 cursor-not-allowed opacity-70' : 'text-white focus:border-emerald-500'}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">{suffix}</span>
        )}
      </div>
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
        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${checked ? 'bg-emerald-600' : 'dark-row-2'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

export default function CompanyAdminSettings() {
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
    companyName: 'Lith-On Energy Pvt. Ltd.',
    registrationNo: 'U40100DL2020PTC367891',
    address: 'Plot 12, Sector 62, Noida, UP',
    email: 'company@lithonenergy.com',
    phone: '+91 11-4567-8900',
    gstin: '09AABCL1234A1Z5',
    totalSocieties: '5',
    totalBESSUnits: '12',
  })

  const [billing, setBilling] = useState({
    defaultBillFrequency: 'Monthly',
    defaultDueDay: '15',
    defaultGraceDays: '5',
    defaultLateFee: '5',
    defaultLowBalance: '1000',
    defaultCriticalBalance: '500',
    autoEscalateUnpaid: true,
    crossSocietyReporting: true,
    consolidatedInvoices: false,
  })

  const [bess, setBess] = useState({
    sohWarningThreshold: '80',
    sohCriticalThreshold: '60',
    tempWarning: '45',
    tempCritical: '55',
    chargeAlertLow: '20',
    chargeAlertHigh: '95',
    autoMaintenanceAlert: true,
    remoteControlEnabled: true,
    dailyHealthReport: true,
  })

  const [notif, setNotif] = useState({
    societyOffline: true,
    bessOffline: true,
    bessHealthDegraded: true,
    billingAnomaly: true,
    paymentEscalation: true,
    newAdminAdded: true,
    reportReady: false,
    complianceAlert: true,
  })

  const save = () => addToast('Settings saved successfully!', 'success')

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      {/* Company identity banner */}
      <div
        className="rounded-2xl p-4 flex items-center gap-4 border"
        style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
        >🏢</div>
        <div className="flex-1 min-w-0">
          <p className="text-emerald-400 font-bold text-sm">Lith-On Energy Pvt. Ltd.</p>
          <p className="text-gray-500 text-xs">5 societies · 12 BESS units · Noida, UP</p>
        </div>
        <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ● Active
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Configure company-wide defaults and preferences</p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2 rounded-xl font-bold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
        >
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 dark-page-bg p-1 rounded-xl w-fit border border-[rgba(255,255,255,0.06)]">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === t ? 'bg-emerald-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 'General' && (
        <div className={`${CARD} space-y-4 max-w-2xl`}>
          <h2 className="text-base font-bold text-white">Company Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" value={general.companyName} onChange={e => setGeneral({ ...general, companyName: e.target.value })} />
            <Input label="Registration No." value={general.registrationNo} onChange={e => setGeneral({ ...general, registrationNo: e.target.value })} />
          </div>
          <Input label="Registered Address" value={general.address} onChange={e => setGeneral({ ...general, address: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Contact Email" type="email" value={general.email} onChange={e => setGeneral({ ...general, email: e.target.value })} />
            <Input label="Contact Phone" value={general.phone} onChange={e => setGeneral({ ...general, phone: e.target.value })} />
          </div>
          <Input label="GSTIN / Tax ID" value={general.gstin} onChange={e => setGeneral({ ...general, gstin: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Societies" value={general.totalSocieties} readOnly />
            <Input label="BESS Units Deployed" value={general.totalBESSUnits} readOnly />
          </div>
        </div>
      )}

      {/* Billing Policy */}
      {tab === 'Billing Policy' && (
        <div className={`${CARD} space-y-4 max-w-2xl`}>
          <h2 className="text-base font-bold text-white">Default Billing Policy</h2>
          <p className="text-gray-500 text-xs">These defaults are applied when a new society is created. Society admins can override locally.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Default Bill Frequency</label>
              <select
                value={billing.defaultBillFrequency}
                onChange={e => setBilling({ ...billing, defaultBillFrequency: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Bi-Monthly</option>
              </select>
            </div>
            <Input label="Default Due Day" value={billing.defaultDueDay} onChange={e => setBilling({ ...billing, defaultDueDay: e.target.value })} suffix="of month" />
            <Input label="Grace Period" value={billing.defaultGraceDays} onChange={e => setBilling({ ...billing, defaultGraceDays: e.target.value })} suffix="days" />
            <Input label="Late Fee" value={billing.defaultLateFee} onChange={e => setBilling({ ...billing, defaultLateFee: e.target.value })} suffix="%" />
            <Input label="Low Balance Alert" value={billing.defaultLowBalance} onChange={e => setBilling({ ...billing, defaultLowBalance: e.target.value })} suffix={sym} />
            <Input label="Critical Balance" value={billing.defaultCriticalBalance} onChange={e => setBilling({ ...billing, defaultCriticalBalance: e.target.value })} suffix={sym} />
          </div>
          <div className="pt-2 border-t border-[rgba(255,255,255,0.05)]">
            <Toggle
              label="Auto-Escalate Unpaid Bills"
              sub="Flag overdue accounts across all societies"
              checked={billing.autoEscalateUnpaid}
              onChange={() => setBilling({ ...billing, autoEscalateUnpaid: !billing.autoEscalateUnpaid })}
            />
            <Toggle
              label="Cross-Society Reporting"
              sub="Aggregate revenue and collection data across societies"
              checked={billing.crossSocietyReporting}
              onChange={() => setBilling({ ...billing, crossSocietyReporting: !billing.crossSocietyReporting })}
            />
            <Toggle
              label="Consolidated Invoices"
              sub="Generate single invoices for multi-property residents"
              checked={billing.consolidatedInvoices}
              onChange={() => setBilling({ ...billing, consolidatedInvoices: !billing.consolidatedInvoices })}
            />
          </div>
        </div>
      )}

      {/* BESS Thresholds */}
      {tab === 'BESS Thresholds' && (
        <div className={`${CARD} space-y-4 max-w-2xl`}>
          <h2 className="text-base font-bold text-white">BESS Fleet Thresholds</h2>
          <p className="text-gray-500 text-xs">Global thresholds applied across all BESS units in your portfolio.</p>

          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">State of Health (SoH)</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Warning Threshold" value={bess.sohWarningThreshold} onChange={e => setBess({ ...bess, sohWarningThreshold: e.target.value })} suffix="%" />
            <Input label="Critical Threshold" value={bess.sohCriticalThreshold} onChange={e => setBess({ ...bess, sohCriticalThreshold: e.target.value })} suffix="%" />
          </div>

          <div className="space-y-1 pt-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Temperature</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Warning (°C)" value={bess.tempWarning} onChange={e => setBess({ ...bess, tempWarning: e.target.value })} suffix="°C" />
            <Input label="Critical (°C)" value={bess.tempCritical} onChange={e => setBess({ ...bess, tempCritical: e.target.value })} suffix="°C" />
          </div>

          <div className="space-y-1 pt-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Charge Level</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Low Charge Alert" value={bess.chargeAlertLow} onChange={e => setBess({ ...bess, chargeAlertLow: e.target.value })} suffix="%" />
            <Input label="High Charge Alert" value={bess.chargeAlertHigh} onChange={e => setBess({ ...bess, chargeAlertHigh: e.target.value })} suffix="%" />
          </div>

          <div className="pt-2 border-t border-[rgba(255,255,255,0.05)]">
            <Toggle
              label="Auto Maintenance Alerts"
              sub="Trigger maintenance request when thresholds are breached"
              checked={bess.autoMaintenanceAlert}
              onChange={() => setBess({ ...bess, autoMaintenanceAlert: !bess.autoMaintenanceAlert })}
            />
            <Toggle
              label="Remote Control Enabled"
              sub="Allow remote charge/discharge control for BESS units"
              checked={bess.remoteControlEnabled}
              onChange={() => setBess({ ...bess, remoteControlEnabled: !bess.remoteControlEnabled })}
            />
            <Toggle
              label="Daily Health Report"
              sub="Receive a daily BESS health summary email"
              checked={bess.dailyHealthReport}
              onChange={() => setBess({ ...bess, dailyHealthReport: !bess.dailyHealthReport })}
            />
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === 'Notifications' && (
        <div className={`${CARD} max-w-2xl`}>
          <h2 className="text-base font-bold text-white mb-1">Notification Preferences</h2>
          <p className="text-gray-500 text-xs mb-4">Choose which portfolio-level events notify you</p>
          <Toggle label="Society Goes Offline" sub="When a society loses connectivity" checked={notif.societyOffline} onChange={() => setNotif({ ...notif, societyOffline: !notif.societyOffline })} />
          <Toggle label="BESS Unit Offline" sub="When a BESS unit stops reporting" checked={notif.bessOffline} onChange={() => setNotif({ ...notif, bessOffline: !notif.bessOffline })} />
          <Toggle label="BESS Health Degraded" sub="When SoH drops below warning threshold" checked={notif.bessHealthDegraded} onChange={() => setNotif({ ...notif, bessHealthDegraded: !notif.bessHealthDegraded })} />
          <Toggle label="Billing Anomaly" sub="Unusual billing patterns detected" checked={notif.billingAnomaly} onChange={() => setNotif({ ...notif, billingAnomaly: !notif.billingAnomaly })} />
          <Toggle label="Payment Escalation" sub="When overdue amounts exceed policy" checked={notif.paymentEscalation} onChange={() => setNotif({ ...notif, paymentEscalation: !notif.paymentEscalation })} />
          <Toggle label="New Admin Added" sub="When a society/tower admin is created" checked={notif.newAdminAdded} onChange={() => setNotif({ ...notif, newAdminAdded: !notif.newAdminAdded })} />
          <Toggle label="Report Ready" sub="Monthly performance report generated" checked={notif.reportReady} onChange={() => setNotif({ ...notif, reportReady: !notif.reportReady })} />
          <Toggle label="Compliance Alerts" sub="Regulatory or safety compliance flags" checked={notif.complianceAlert} onChange={() => setNotif({ ...notif, complianceAlert: !notif.complianceAlert })} />
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
              { label: 'Active Sessions', icon: '💻', action: () => addToast('3 active sessions found', 'info') },
              { label: 'Admin Access Audit Log', icon: '📜', action: () => addToast('Audit log downloaded', 'success') },
              { label: 'API Access Keys', icon: '🔑', action: () => addToast('API key management (demo)', 'info') },
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
            <div className="flex gap-2">
              <button
                onClick={() => addToast('Password changed (demo)', 'success')}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all"
              >
                Reset Password
              </button>
              <button
                onClick={() => addToast('Logged out everywhere (demo)', 'success')}
                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all"
              >
                Logout All Devices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Region */}
      {tab === 'Region' && (
        <div className={`${CARD} max-w-2xl space-y-5`}>
          <div>
            <h2 className="text-base font-bold text-white">Region & Currency</h2>
            <p className="text-gray-500 text-xs mt-0.5">Sets the currency used across all societies in your portfolio</p>
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
                    ? { background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.5)' }
                    : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{c.name}</p>
                    <p className="text-gray-400 text-xs">{c.dialCode} · {c.currency} ({c.symbol})</p>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Active</span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <p className="text-xs font-bold text-emerald-400 mb-1">Currently Active</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{country.flag}</span>
              <div>
                <p className="text-white font-bold">{country.name}</p>
                <p className="text-gray-400 text-xs">
                  Currency: <strong className="text-emerald-400">{country.currency} ({country.symbol})</strong>
                  &nbsp;·&nbsp;Dial code: <strong className="text-emerald-400">{country.dialCode}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
