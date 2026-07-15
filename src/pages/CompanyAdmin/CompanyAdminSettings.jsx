import { useState } from 'react'
import { useToast } from '../../components/ToastProvider'

const TABS = ['General', 'Billing', 'Notifications', 'Security']

export default function CompanyAdminSettings() {
  console.log('✅ COMPANY ADMIN SETTINGS PAGE LOADED')
  const [tab, setTab] = useState('General')
  const { addToast } = useToast()

  const [general, setGeneral] = useState({
    companyName: 'LithOn Energy Solutions',
    email: 'admin@lithon.com',
    phone: '+91-9876543210',
    address: '123 Innovation Street, Tech Park, Delhi',
    timezone: 'IST (UTC+5:30)',
  })

  const [billing, setBilling] = useState({
    billingCycle: 'Monthly',
    defaultTariff: '₹8.50 per kWh',
    paymentGateway: 'Razorpay',
    alertThreshold: '25% SOC',
  })

  const [notif, setNotif] = useState({
    emailNotifications: true,
    smsNotifications: false,
    dailyReports: true,
    alertsOnly: false,
  })

  const [security, setSecurity] = useState({
    apiAccess: true,
    dataBackup: true,
  })

  const save = () => {
    addToast('Settings saved successfully!', 'success')
  }

  const Input = ({ label, value, onChange, type = 'text', suffix }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-green-500 transition-all"
        />
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
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-all relative ${checked ? 'bg-green-600' : 'dark-row-2'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  )

  const CARD = 'rounded-2xl p-5 border dark-card border-[rgba(255,255,255,0.06)]'

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage company configuration and preferences</p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2 rounded-xl font-bold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}
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
              tab === t ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {tab === 'General' && (
        <div className={CARD + ' space-y-4 max-w-2xl'}>
          <h2 className="text-base font-bold text-white">Company Information</h2>
          <Input
            label="Company Name"
            value={general.companyName}
            onChange={e => setGeneral({ ...general, companyName: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={general.email}
              onChange={e => setGeneral({ ...general, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={general.phone}
              onChange={e => setGeneral({ ...general, phone: e.target.value })}
            />
          </div>
          <Input
            label="Address"
            value={general.address}
            onChange={e => setGeneral({ ...general, address: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Timezone</label>
            <select
              value={general.timezone}
              onChange={e => setGeneral({ ...general, timezone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option>IST (UTC+5:30)</option>
              <option>EST (UTC-5:00)</option>
              <option>GMT (UTC+0:00)</option>
            </select>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {tab === 'Billing' && (
        <div className={CARD + ' space-y-4 max-w-2xl'}>
          <h2 className="text-base font-bold text-white">Billing Configuration</h2>
          <div className="bg-green-900/20 border border-green-700/30 rounded-xl px-4 py-3 text-xs text-green-400">
            ⚠️ Billing changes will apply to future cycles. Contact support for mid-cycle changes.
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Billing Cycle</label>
            <select
              value={billing.billingCycle}
              onChange={e => setBilling({ ...billing, billingCycle: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <Input
            label="Default Tariff"
            value={billing.defaultTariff}
            onChange={e => setBilling({ ...billing, defaultTariff: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Payment Gateway</label>
            <select
              value={billing.paymentGateway}
              onChange={e => setBilling({ ...billing, paymentGateway: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option>Razorpay</option>
              <option>PayU</option>
              <option>Stripe</option>
              <option>Instamojo</option>
            </select>
          </div>
          <Input
            label="Alert Threshold"
            value={billing.alertThreshold}
            onChange={e => setBilling({ ...billing, alertThreshold: e.target.value })}
          />
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'Notifications' && (
        <div className={CARD + ' max-w-2xl'}>
          <h2 className="text-base font-bold text-white mb-2">Notification Preferences</h2>
          <p className="text-gray-500 text-xs mb-4">Control which notifications you receive</p>
          <Toggle
            label="Email Notifications"
            sub="Receive alerts and updates via email"
            checked={notif.emailNotifications}
            onChange={() => setNotif({ ...notif, emailNotifications: !notif.emailNotifications })}
          />
          <Toggle
            label="SMS Notifications"
            sub="Receive critical alerts via SMS"
            checked={notif.smsNotifications}
            onChange={() => setNotif({ ...notif, smsNotifications: !notif.smsNotifications })}
          />
          <Toggle
            label="Daily Reports"
            sub="Get daily summary reports"
            checked={notif.dailyReports}
            onChange={() => setNotif({ ...notif, dailyReports: !notif.dailyReports })}
          />
          <Toggle
            label="Alerts Only"
            sub="Only receive critical alerts"
            checked={notif.alertsOnly}
            onChange={() => setNotif({ ...notif, alertsOnly: !notif.alertsOnly })}
          />
        </div>
      )}

      {/* Security Tab */}
      {tab === 'Security' && (
        <div className={CARD + ' max-w-2xl space-y-4'}>
          <h2 className="text-base font-bold text-white">Security Settings</h2>
          <div className="space-y-3">
            <Toggle
              label="API Access"
              sub="Enable third-party API integrations"
              checked={security.apiAccess}
              onChange={() => setSecurity({ ...security, apiAccess: !security.apiAccess })}
            />
            <Toggle
              label="Daily Backups"
              sub="Automatic daily data backups"
              checked={security.dataBackup}
              onChange={() => setSecurity({ ...security, dataBackup: !security.dataBackup })}
            />
          </div>
          <div className="pt-4 space-y-2">
            {[
              { label: 'Change Password', icon: '🔐', action: () => addToast('Password reset email sent!', 'success') },
              { label: 'Enable 2-Factor Authentication', icon: '📱', action: () => addToast('2FA setup link sent!', 'success') },
              { label: 'Download Audit Log', icon: '📜', action: () => addToast('Audit log downloading...', 'success') },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)] transition-all text-left"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-white font-medium text-sm flex-1">{item.label}</span>
                <span className="text-gray-500">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
