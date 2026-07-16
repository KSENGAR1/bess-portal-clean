import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Building2, Landmark, Users, UserCheck, Gauge, DollarSign,
  FileText, ShieldCheck, Activity, ScrollText, Search, Package, Plug, HardDrive,
  CreditCard, MessageSquare, Bell, Megaphone, BarChart3, User,
  LogOut, Home, Wallet, Receipt, Building
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
import AdminTowerAdmins from './pages/Admin/AdminTowerAdmins'
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
// Tower Admin pages
import TowerAdminDashboard from './pages/TowerAdmin/TowerAdminDashboard'
import TowerAdminResidents from './pages/TowerAdmin/TowerAdminResidents'
import TowerAdminMeters from './pages/TowerAdmin/TowerAdminMeters'
import TowerAdminBilling from './pages/TowerAdmin/TowerAdminBilling'
import TowerAdminAlerts from './pages/TowerAdmin/TowerAdminAlerts'
import TowerAdminNotices from './pages/TowerAdmin/TowerAdminNotices'
// Company Admin pages
import CompanyAdminDashboard from './pages/CompanyAdmin/CompanyAdminDashboard'
import CompanyAdminSocieties from './pages/CompanyAdmin/CompanyAdminSocieties'
import CompanyAdminReports from './pages/CompanyAdmin/CompanyAdminReports'
import CompanyAdminAdmins from './pages/CompanyAdmin/CompanyAdminAdmins'
import CompanyAdminBilling from './pages/CompanyAdmin/CompanyAdminBilling'
import CompanyAdminPayments from './pages/CompanyAdmin/CompanyAdminPayments'
import CompanyAdminBESS from './pages/CompanyAdmin/CompanyAdminBESS'
import CompanyAdminAlerts from './pages/CompanyAdmin/CompanyAdminAlerts'
import CompanyAdminPerformance from './pages/CompanyAdmin/CompanyAdminPerformance'

const PAGE_NAMES = {
  'energy-flow': 'Energy Flow', 'battery-health': 'Battery Health', 'solar': 'Solar Generation',
  dashboard: 'Overview', projects: 'Projects', organizations: 'Organizations',
  admins: 'Admins', users: 'Users', meters: 'Smart Meters', tariff: 'Tariff',
  billing: 'Billing Engine', 'system-logs': 'System Logs', monitoring: 'System Monitor',
  roles: 'Roles & Permissions', firmware: 'Firmware', audit: 'Audit Logs',
  backup: 'Backups', api: 'API Monitor', consumers: 'Consumers', payments: 'Payments',
  complaints: 'Complaints', alerts: 'Alerts', notices: 'Notices', reports: 'Reports',
  profile: 'My Profile', notifications: 'Notifications',
  meter: 'Smart Meter', wallet: 'Wallet', invoices: 'Invoices', payment: 'Add Funds',
  residents: 'Residents', societies: 'Societies', 'tower-admins': 'Tower Admins',
  'ta-alerts': 'Alerts', 'ta-notices': 'Notices', 'ca-admins': 'Society Admins',
  'ca-billing': 'Billing Overview', 'ca-payments': 'Payment Tracking', 
  'ca-bess': 'BESS Fleet', 'ca-alerts': 'Alert Center', 'ca-performance': 'Performance Analytics',
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
  { q: ['profile', 'account'], page: 'profile' },
  { q: ['notification'], page: 'notifications' },
  { q: ['payment', 'pay', 'wallet'], page: 'payment' },
]

/* ── Tower Admin navigation ── */
const TOWER_ADMIN_NAV = [
  { page: 'dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'residents',   icon: Users,           label: 'Residents' },
  { page: 'meters',      icon: Gauge,           label: 'Meters' },
  { type: 'section',     label: 'Financial' },
  { page: 'billing',     icon: FileText,        label: 'Billing' },
  { type: 'section',     label: 'Operations' },
  { page: 'ta-alerts',   icon: Bell,            label: 'Alerts' },
  { page: 'ta-notices',  icon: Megaphone,       label: 'Notices' },
]

/* ── Company Admin navigation ── */
const COMPANY_ADMIN_NAV = [
  { page: 'dashboard',      icon: LayoutDashboard, label: 'Overview' },
  { page: 'societies',      icon: Building2,       label: 'Societies' },
  { page: 'ca-admins',      icon: Users,           label: 'Society Admins' },
  { type: 'section',        label: 'Financial' },
  { page: 'ca-billing',     icon: FileText,        label: 'Billing' },
  { page: 'ca-payments',    icon: CreditCard,      label: 'Payments' },
  { type: 'section',        label: 'Operations' },
  { page: 'ca-bess',        icon: Activity,        label: 'BESS Fleet' },
  { page: 'ca-alerts',      icon: Bell,            label: 'Alerts' },
  { type: 'section',        label: 'Analytics' },
  { page: 'ca-performance', icon: BarChart3,       label: 'Performance' },
  { page: 'reports',        icon: FileText,        label: 'Reports' },
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
  { page: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'tower-admins',  icon: Building2,       label: 'Tower Admins' },
  { page: 'meters',        icon: Gauge,           label: 'Meters' },
  { type: 'section',       label: 'Financial' },
  { page: 'billing',       icon: FileText,        label: 'Billing' },
  { page: 'payments',      icon: CreditCard,      label: 'Payments' },
  { type: 'section',       label: 'Operations' },
  { page: 'complaints',    icon: MessageSquare,   label: 'Complaints' },
  { page: 'alerts',        icon: Bell,            label: 'Alerts' },
  { page: 'notices',       icon: Megaphone,       label: 'Notices' },
  { type: 'section',       label: 'Analytics' },
  { page: 'reports',       icon: BarChart3,       label: 'Reports' },
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [userRole, setUserRole] = useState('resident')
  const { markAllRead } = useNotifications()
  const [dark, setDark] = useState(() => localStorage.getItem('bess_dark') !== 'false')
  const [showDemoBanner, setShowDemoBanner] = useState(() => localStorage.getItem('bess_hide_demo_banner') !== 'true')

  // Shared wallet balance — updated when payment succeeds
  const [walletBalance, setWalletBalance] = useState(2450.50)
  const addToWallet = (amount) => setWalletBalance(prev => +(prev + amount).toFixed(2))

  const hideDemoBanner = () => {
    setShowDemoBanner(false)
    localStorage.setItem('bess_hide_demo_banner', 'true')
  }

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
        case 'tower-admins': return <AdminTowerAdmins />
        case 'meters': return <AdminMeters onNavigate={setCurrentPage} />
        case 'billing': return <AdminBilling onNavigate={setCurrentPage} />
        case 'payments': return <AdminPayments onNavigate={setCurrentPage} />
        case 'complaints': return <AdminComplaints onNavigate={setCurrentPage} />
        case 'alerts': return <AdminAlerts onNavigate={setCurrentPage} />
        case 'reports': return <AdminReports onNavigate={setCurrentPage} />
        case 'notices': return <AdminNotices onNavigate={setCurrentPage} />
        case 'profile': return <ProfilePage onNavigate={setCurrentPage} />
        case 'notifications': return <NotificationsPage onNavigate={setCurrentPage} />
        default: return <AdminDashboard onNavigate={setCurrentPage} />
      }
    }
    if (userRole === 'toweradmin') {
      switch (currentPage) {
        case 'dashboard':    return <TowerAdminDashboard onNavigate={setCurrentPage} />
        case 'residents':    return <TowerAdminResidents />
        case 'meters':       return <TowerAdminMeters />
        case 'billing':      return <TowerAdminBilling />
        case 'ta-alerts':    return <TowerAdminAlerts />
        case 'ta-notices':   return <TowerAdminNotices />
        case 'profile':      return <ProfilePage onNavigate={setCurrentPage} />
        case 'notifications': return <NotificationsPage onNavigate={setCurrentPage} />
        default:             return <TowerAdminDashboard onNavigate={setCurrentPage} />
      }
    }
    if (userRole === 'companyadmin') {
      switch (currentPage) {
        case 'dashboard':      return <CompanyAdminDashboard onNavigate={setCurrentPage} />
        case 'societies':      return <CompanyAdminSocieties />
        case 'ca-admins':      return <CompanyAdminAdmins />
        case 'ca-billing':     return <CompanyAdminBilling />
        case 'ca-payments':    return <CompanyAdminPayments />
        case 'ca-bess':        return <CompanyAdminBESS />
        case 'ca-alerts':      return <CompanyAdminAlerts />
        case 'ca-performance': return <CompanyAdminPerformance />
        case 'reports':        return <CompanyAdminReports />
        case 'profile':        return <ProfilePage onNavigate={setCurrentPage} />
        case 'notifications':  return <NotificationsPage onNavigate={setCurrentPage} />
        default:               return <CompanyAdminDashboard onNavigate={setCurrentPage} />
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

  const DemoBanner = () => !showDemoBanner ? null : (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg animate-pulse">🎭</span>
          <div className="min-w-0">
            <p className="font-bold text-sm">Demo Mode</p>
            <p className="text-xs text-white/90 truncate">All data is simulated for demonstration purposes</p>
          </div> 
        </div>
        <button onClick={hideDemoBanner}
                className="flex-shrink-0 px-3 py-1 text-xs font-bold bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm border border-white/30">
          Dismiss
        </button>
      </div>
    </div>
  )

  return (
    <ToastProvider>
      <DemoBanner />
      {userRole === 'toweradmin' && (
        <SidebarLayout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userRole={userRole}
          dark={dark}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
          pageName={PAGE_NAMES[currentPage] || 'Dashboard'}
          navItems={TOWER_ADMIN_NAV}
          searchMap={SEARCH_MAP}
          theme="cyan"
        >
          <div className={showDemoBanner ? 'pt-14' : ''}>
            {renderPage()}
          </div>
        </SidebarLayout>
      )}

      {userRole === 'companyadmin' && (
        <SidebarLayout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userRole={userRole}
          dark={dark}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
          pageName={PAGE_NAMES[currentPage] || 'Dashboard'}
          navItems={COMPANY_ADMIN_NAV}
          searchMap={SEARCH_MAP}
          theme="green"
        >
          <div className={showDemoBanner ? 'pt-14' : ''}>
            {renderPage()}
          </div>
        </SidebarLayout>
      )}

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
          <div className={showDemoBanner ? 'pt-14' : ''}>
            {renderPage()}
          </div>
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
          <div className={showDemoBanner ? 'pt-14' : ''}>
            {renderPage()}
          </div>
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
          <div className={showDemoBanner ? 'pt-14' : ''}>
            {renderPage()}
          </div>
        </ResidentLayout>
      )}
    </ToastProvider>
  )
}                                                             

