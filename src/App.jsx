import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Building2, Landmark, Users, UserCheck, Gauge, DollarSign,
  FileText, ShieldCheck, Activity, ScrollText, Search, Package, Plug, HardDrive,
  CreditCard, MessageSquare, Bell, Megaphone, BarChart3, Settings, User,
  LogOut, Home, Wallet, Receipt
} from 'lucide-react'
import { useNotifications } from './context/NotificationStore'
import { SidebarLayout, ResidentLayout } from './layouts'
import { ToastProvider } from './components/ToastProvider'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MeterPage from './pages/MeterPage'
import WalletPage from './pages/WalletPage'
import PaymentPage from './pages/PaymentPage'
import InvoicesPage from './pages/InvoicesPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminConsumers from './pages/Admin/AdminConsumers'
import AdminMeters from './pages/Admin/AdminMeters'
import AdminBilling from './pages/Admin/AdminBilling'
import AdminPayments from './pages/Admin/AdminPayments'
import AdminComplaints from './pages/Admin/AdminComplaints'
import AdminAlerts from './pages/Admin/AdminAlerts'
import AdminReports from './pages/Admin/AdminReports'
import AdminNotices from './pages/Admin/AdminNotices'
import AdminSettings from './pages/Admin/AdminSettings'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import SuperAdminProjects from './pages/SuperAdmin/SuperAdminProjects'
import SuperAdminOrganizations from './pages/SuperAdmin/SuperAdminOrganizations'
import SuperAdminAdmins from './pages/SuperAdmin/SuperAdminAdmins'
import SuperAdminUsers from './pages/SuperAdmin/SuperAdminUsers'
import SuperAdminMeters from './pages/SuperAdmin/SuperAdminMeters'
import SuperAdminTariff from './pages/SuperAdmin/SuperAdminTariff'
import SuperAdminBilling from './pages/SuperAdmin/SuperAdminBilling'
import SuperAdminLogs from './pages/SuperAdmin/SuperAdminLogs'
import SuperAdminMonitoring from './pages/SuperAdmin/SuperAdminMonitoring'
import SuperAdminRoles from './pages/SuperAdmin/SuperAdminRoles'
import SuperAdminFirmware from './pages/SuperAdmin/SuperAdminFirmware'
import SuperAdminAudit from './pages/SuperAdmin/SuperAdminAudit'
import SuperAdminBackup from './pages/SuperAdmin/SuperAdminBackup'
import SuperAdminAPI from './pages/SuperAdmin/SuperAdminAPI'
import EnergyFlowPage from './pages/EnergyFlowPage'
import BatteryHealthPage from './pages/BatteryHealthPage'
import SolarPage from './pages/SolarPage'

const PAGE_NAMES = {
  'energy-flow': 'Energy Flow', 'battery-health': 'Battery Health', 'solar': 'Solar Generation',
  dashboard: 'Overview', projects: 'Projects', organizations: 'Organizations',
  admins: 'Admins', users: 'Users', meters: 'Smart Meters', tariff: 'Tariff',
  billing: 'Billing Engine', 'system-logs': 'System Logs', monitoring: 'System Monitor',
  roles: 'Roles & Permissions', firmware: 'Firmware', audit: 'Audit Logs',
  backup: 'Backups', api: 'API Monitor', consumers: 'Consumers', payments: 'Payments',
  complaints: 'Complaints', alerts: 'Alerts', notices: 'Notices', reports: 'Reports',
  settings: 'Settings', profile: 'My Profile', notifications: 'Notifications',
  meter: 'Smart Meter', wallet: 'Wallet', invoices: 'Invoices', payment: 'Add Funds',
}

const SEARCH_MAP = [
  { q: ['energy', 'flow', 'power', 'diagram'], page: 'energy-flow' },
  { q: ['battery', 'health', 'bess'], page: 'battery-health' },
  { q: ['solar', 'pv', 'panel'], page: 'solar' },
  { q: ['overview', 'dashboard'], page: 'dashboard' },
  { q: ['project', 'projects'], page: 'projects' },
  { q: ['org', 'organization'], page: 'organizations' },
  { q: ['admin', 'admins'], page: 'admins' },
  { q: ['user', 'users', 'consumer', 'consumers'], page: 'users' },
  { q: ['meter', 'meters', 'smart meter'], page: 'meters' },
  { q: ['tariff', 'rate', 'pricing'], page: 'tariff' },
  { q: ['billing', 'bill', 'invoice'], page: 'billing' },
  { q: ['logs', 'system log'], page: 'system-logs' },
  { q: ['monitor', 'monitoring'], page: 'monitoring' },
  { q: ['role', 'permission'], page: 'roles' },
  { q: ['firmware', 'ota'], page: 'firmware' },
  { q: ['audit'], page: 'audit' },
  { q: ['backup', 'restore'], page: 'backup' },
  { q: ['api', 'key', 'endpoint'], page: 'api' },
  { q: ['complaint'], page: 'complaints' },
  { q: ['alert', 'alarm'], page: 'alerts' },
  { q: ['notice', 'announcement'], page: 'notices' },
  { q: ['report', 'analytics'], page: 'reports' },
  { q: ['setting', 'config'], page: 'settings' },
  { q: ['profile', 'account'], page: 'profile' },
  { q: ['notification'], page: 'notifications' },
  { q: ['payment', 'pay', 'wallet'], page: 'payment' },
]

/* ── SuperAdmin navigation ── */
const SUPERADMIN_NAV = [
  { page: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
  { page: 'projects', icon: Building2, label: 'Projects' },
  { page: 'organizations', icon: Landmark, label: 'Organizations' },
  { page: 'admins', icon: Users, label: 'Admins' },
  { page: 'users', icon: UserCheck, label: 'Users' },
  { page: 'meters', icon: Gauge, label: 'Meters' },
  { type: 'section', label: 'Configuration' },
  { page: 'tariff', icon: DollarSign, label: 'Tariff' },
  { page: 'billing', icon: FileText, label: 'Billing Engine' },
  { page: 'roles', icon: ShieldCheck, label: 'Roles & Perms' },
  { type: 'section', label: 'Monitoring' },
  { page: 'monitoring', icon: Activity, label: 'System Monitor' },
  { page: 'system-logs', icon: ScrollText, label: 'System Logs' },
  { page: 'audit', icon: Search, label: 'Audit Logs' },
  { page: 'firmware', icon: Package, label: 'Firmware' },
  { type: 'section', label: 'Infrastructure' },
  { page: 'api', icon: Plug, label: 'API Monitor' },
  { page: 'backup', icon: HardDrive, label: 'Backups' },
]

/* ── Admin navigation ── */
const ADMIN_NAV = [
  { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'consumers', icon: Users, label: 'Consumers' },
  { page: 'meters', icon: Gauge, label: 'Meters' },
  { type: 'section', label: 'Financial' },
  { page: 'billing', icon: FileText, label: 'Billing' },
  { page: 'payments', icon: CreditCard, label: 'Payments' },
  { type: 'section', label: 'Operations' },
  { page: 'complaints', icon: MessageSquare, label: 'Complaints' },
  { page: 'alerts', icon: Bell, label: 'Alerts' },
  { page: 'notices', icon: Megaphone, label: 'Notices' },
  { type: 'section', label: 'Analytics' },
  { page: 'reports', icon: BarChart3, label: 'Reports' },
  { type: 'section', label: 'System' },
  { page: 'settings', icon: Settings, label: 'Settings' },
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [userRole, setUserRole] = useState('resident')
  const { markAllRead } = useNotifications()
  const [dark, setDark] = useState(() => localStorage.getItem('bess_dark') !== 'false')

  // Shared wallet balance — updated when payment succeeds
  const [walletBalance, setWalletBalance] = useState(2450.50)
  const addToWallet = (amount) => setWalletBalance(prev => +(prev + amount).toFixed(2))

  const toggleDark = () => setDark(d => {
    localStorage.setItem('bess_dark', String(!d))
    return !d
  })

  // Keep <html> class in sync for Tailwind dark: variants
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const savedLogin = localStorage.getItem('bess_logged_in')
    const savedRole = localStorage.getItem('bess_user_role')
    if (savedLogin) { setIsLoggedIn(true); setUserRole(savedRole || 'resident') }
  }, [])

  const handleLogin = (role = 'resident') => {
    setIsLoggedIn(true); setUserRole(role)
    localStorage.setItem('bess_logged_in', 'true')
    localStorage.setItem('bess_user_role', role)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false); setCurrentPage('dashboard')
    localStorage.removeItem('bess_logged_in')
    localStorage.removeItem('bess_user_role')
  }

  const renderPage = () => {
    if (userRole === 'resident') {
      switch (currentPage) {
        case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} unreadCount={0} userRole={userRole} walletBalance={walletBalance} />
        case 'meter': return <MeterPage onNavigate={setCurrentPage} />
        case 'wallet': return <WalletPage onNavigate={setCurrentPage} walletBalance={walletBalance} />
        case 'payment': return <PaymentPage onNavigate={setCurrentPage} walletBalance={walletBalance} onPaymentSuccess={addToWallet} />
        case 'invoices': return <InvoicesPage onNavigate={setCurrentPage} />
        case 'notifications': return <NotificationsPage onNavigate={setCurrentPage} />
        case 'profile': return <ProfilePage onNavigate={setCurrentPage} />
        case 'energy-flow': return <EnergyFlowPage />
        case 'battery-health': return <BatteryHealthPage />
        case 'solar': return <SolarPage />
        default: return <DashboardPage onNavigate={setCurrentPage} unreadCount={0} userRole={userRole} walletBalance={walletBalance} />
      }
    }
    if (userRole === 'admin') {
      switch (currentPage) {
        case 'dashboard': return <AdminDashboard onNavigate={setCurrentPage} />
        case 'consumers': return <AdminConsumers onNavigate={setCurrentPage} />
        case 'meters': return <AdminMeters onNavigate={setCurrentPage} />
        case 'billing': return <AdminBilling onNavigate={setCurrentPage} />
        case 'payments': return <AdminPayments onNavigate={setCurrentPage} />
        case 'complaints': return <AdminComplaints onNavigate={setCurrentPage} />
        case 'alerts': return <AdminAlerts onNavigate={setCurrentPage} />
        case 'reports': return <AdminReports onNavigate={setCurrentPage} />
        case 'notices': return <AdminNotices onNavigate={setCurrentPage} />
        case 'settings': return <AdminSettings onNavigate={setCurrentPage} />
        case 'profile': return <ProfilePage onNavigate={setCurrentPage} />
        case 'notifications': return <NotificationsPage onNavigate={setCurrentPage} />
        default: return <AdminDashboard onNavigate={setCurrentPage} />
      }
    }
    if (userRole === 'superadmin') {
      switch (currentPage) {
        case 'dashboard': return <SuperAdminDashboard onNavigate={setCurrentPage} />
        case 'projects': return <SuperAdminProjects onNavigate={setCurrentPage} />
        case 'organizations': return <SuperAdminOrganizations onNavigate={setCurrentPage} />
        case 'admins': return <SuperAdminAdmins onNavigate={setCurrentPage} />
        case 'users': return <SuperAdminUsers onNavigate={setCurrentPage} />
        case 'meters': return <SuperAdminMeters onNavigate={setCurrentPage} />
        case 'tariff': return <SuperAdminTariff onNavigate={setCurrentPage} />
        case 'billing': return <SuperAdminBilling onNavigate={setCurrentPage} />
        case 'system-logs': return <SuperAdminLogs onNavigate={setCurrentPage} />
        case 'monitoring': return <SuperAdminMonitoring onNavigate={setCurrentPage} />
        case 'roles': return <SuperAdminRoles onNavigate={setCurrentPage} />
        case 'firmware': return <SuperAdminFirmware onNavigate={setCurrentPage} />
        case 'audit': return <SuperAdminAudit onNavigate={setCurrentPage} />
        case 'backup': return <SuperAdminBackup onNavigate={setCurrentPage} />
        case 'api': return <SuperAdminAPI onNavigate={setCurrentPage} />
        case 'profile': return <ProfilePage onNavigate={setCurrentPage} />
        case 'notifications': return <NotificationsPage onNavigate={setCurrentPage} />
        default: return <SuperAdminDashboard onNavigate={setCurrentPage} />
      }
    }
    return <DashboardPage onNavigate={setCurrentPage} unreadCount={0} userRole={userRole} />
  }

  if (!isLoggedIn) return (
    <ToastProvider>
      <LoginPage onLogin={handleLogin} dark={dark} onToggleDark={toggleDark} />
    </ToastProvider>
  )

  const pageName = PAGE_NAMES[currentPage] || 'Dashboard'

  return (
    <ToastProvider>
      {userRole === 'superadmin' && (
        <SidebarLayout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userRole={userRole}
          dark={dark}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
          pageName={pageName}
          navItems={SUPERADMIN_NAV}
          searchMap={SEARCH_MAP}
          theme="purple"
        >
          {renderPage()}
        </SidebarLayout>
      )}

      {userRole === 'admin' && (
        <SidebarLayout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userRole={userRole}
          dark={dark}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
          pageName={pageName}
          navItems={ADMIN_NAV}
          searchMap={SEARCH_MAP}
          theme="amber"
        >
          {renderPage()}
        </SidebarLayout>
      )}

      {userRole === 'resident' && (
        <ResidentLayout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          dark={dark}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
        >
          {renderPage()}
        </ResidentLayout>
      )}
    </ToastProvider>
  )
}
