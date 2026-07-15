import { useState } from 'react'
import { Settings, Save, Bell, Database, Zap, CheckCircle } from 'lucide-react'

export default function CompanyAdminSettings() {
  const [settings, setSettings] = useState({
    companyName: 'LithOn Energy Solutions',
    email: 'admin@lithon.com',
    phone: '+91-9876543210',
    address: '123 Innovation Street, Tech Park, Delhi',
    timezone: 'IST (UTC+5:30)',
    defaultTariff: '₹8.50 per kWh',
    billingCycle: 'Monthly',
    paymentGateway: 'Razorpay',
    alertThreshold: '25% SOC',
    emailNotifications: true,
    smsNotifications: false,
    dataBackup: 'Daily',
    apiAccess: true,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, checked, type, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage company configuration and preferences</p>
      </div>

      {/* Save Success Message */}
      {saved && (
        <div className="p-4 rounded-xl bg-green-900/20 border border-green-700/30 flex items-start gap-3">
          <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-300 text-sm">Settings saved successfully</p>
            <p className="text-xs text-green-400 mt-0.5">All changes have been applied</p>
          </div>
        </div>
      )}

      {/* Company Information */}
      <div className="rounded-2xl p-6 dark-card border border-[rgba(255,255,255,0.06)]">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-blue-400" />
          Company Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Timezone</label>
            <input
              type="text"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Address</label>
            <textarea
              name="address"
              value={settings.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Billing & Operations */}
      <div className="rounded-2xl p-6 dark-card border border-[rgba(255,255,255,0.06)]">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Database size={18} className="text-amber-400" />
          Billing & Operations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Billing Cycle</label>
            <select
              name="billingCycle"
              value={settings.billingCycle}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Default Tariff</label>
            <input
              type="text"
              name="defaultTariff"
              value={settings.defaultTariff}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Payment Gateway</label>
            <select
              name="paymentGateway"
              value={settings.paymentGateway}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Razorpay</option>
              <option>PayU</option>
              <option>Instamojo</option>
              <option>Stripe</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Alert Threshold</label>
            <input
              type="text"
              name="alertThreshold"
              value={settings.alertThreshold}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications & Security */}
      <div className="rounded-2xl p-6 dark-card border border-[rgba(255,255,255,0.06)]">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell size={18} className="text-cyan-400" />
          Notifications & Security
        </h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 cursor-pointer transition-all">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="font-semibold text-white text-sm">Email Notifications</p>
              <p className="text-xs text-gray-400">Receive alerts via email</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 cursor-pointer transition-all">
            <input
              type="checkbox"
              name="smsNotifications"
              checked={settings.smsNotifications}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="font-semibold text-white text-sm">SMS Notifications</p>
              <p className="text-xs text-gray-400">Receive critical alerts via SMS</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 cursor-pointer transition-all">
            <input
              type="checkbox"
              name="apiAccess"
              checked={settings.apiAccess}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="font-semibold text-white text-sm">API Access</p>
              <p className="text-xs text-gray-400">Enable API integrations</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 cursor-pointer transition-all">
            <input
              type="checkbox"
              name="dataBackup"
              checked={settings.dataBackup === 'Daily'}
              onChange={(e) => setSettings(prev => ({ ...prev, dataBackup: e.target.checked ? 'Daily' : 'Weekly' }))}
              className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="font-semibold text-white text-sm">Daily Backups</p>
              <p className="text-xs text-gray-400">Automatic daily data backups</p>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2.5 rounded-xl font-bold text-sm border border-gray-700 text-gray-300 hover:bg-slate-700/50 transition-all">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  )
}
