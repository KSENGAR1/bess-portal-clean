import { useState, useEffect } from 'react'
import { Search, Sun, Moon, Bell, User, LogOut, Menu, X } from 'lucide-react'
import { useNotifications } from '../context/NotificationStore'
import NavLink from './NavLink'
import SidebarSection from './SidebarSection'

const TODAY = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export default function SidebarLayout({
  children,
  currentPage,
  onNavigate,
  userRole,
  dark,
  onToggleDark,
  onLogout,
  pageName,
  navItems = [],
  searchMap = [],
  theme = 'purple', // 'purple' for superadmin, 'amber' for admin
}) {
  const { unreadCount } = useNotifications()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const isSuperAdmin = userRole === 'superadmin'
  const themeColor = theme === 'purple' ? 'purple' : 'amber'
  const accentClass = theme === 'purple' ? 'text-purple-500 dark:text-purple-400' : 'text-amber-500 dark:text-amber-400'
  const badgeClass = theme === 'purple'
    ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
  const activeNavClass = theme === 'purple' ? 'nav-active-purple' : 'nav-active-amber'

  const handleSearch = (q) => {
    const lower = q.toLowerCase().trim()
    if (!lower) return
    const match = searchMap.find(m => m.q.some(k => lower.includes(k)))
    if (match) onNavigate(match.page)
    setSearchQuery('')
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [currentPage])

  // Close mobile sidebar on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const profileEmail = isSuperAdmin ? 'admin@bess.io' : 'admin@society.in'
  const profileName = isSuperAdmin ? 'Super Admin' : 'Society Admin'
  const profileInitials = isSuperAdmin ? 'SA' : 'AD'

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 z-50 flex flex-col
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transition-transform duration-300 ease-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <img
            src="/lith-on-logo.png"
            alt="Lith-On"
            className="h-[70px] w-auto object-contain object-left"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            if (item.type === 'section') {
              return (
                <SidebarSection
                  key={idx}
                  label={item.label}
                  className={accentClass}
                />
              )
            }
            return (
              <NavLink
                key={item.page}
                page={item.page}
                currentPage={currentPage}
                onNavigate={onNavigate}
                Icon={item.icon}
                label={item.label}
                activeClass={activeNavClass}
                activeDotColor={theme === 'purple' ? '#8b5cf6' : '#f59e0b'}
              />
            )
          })}
        </nav>

        {/* User & Version */}
        <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <button
            onClick={() => onNavigate('profile')}
            className="w-full flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: isSuperAdmin
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'linear-gradient(135deg,#d97706,#b45309)',
                color: isSuperAdmin ? '#e9d5ff' : '#fef3c7',
              }}
            >
              {profileInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-slate-900 dark:text-white">
                {profileName}
              </p>
              <p className="text-[10px] truncate text-slate-500 dark:text-slate-400">
                {profileEmail}
              </p>
            </div>
          </button>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600">
              v2.4.1
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeClass}`}>
              {isSuperAdmin ? 'PLATFORM' : 'ADMIN'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 lg:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-sm font-bold leading-tight text-slate-900 dark:text-white">
                {pageName}
              </h1>
              <p className={`text-[11px] ${accentClass}`}>{TODAY}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-1">
              <Search size={13} className="text-slate-400 dark:text-slate-500" />
              <input
                placeholder="Quick search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="bg-transparent text-xs placeholder-slate-400 dark:placeholder-slate-500 outline-none w-32 text-slate-700 dark:text-slate-300"
              />
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDark}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {dark ? <Sun size={13} /> : <Moon size={13} />}
              <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <User size={18} />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/25 hover:bg-red-100 dark:hover:bg-red-500/25"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="page-enter">{children}</main>
      </div>
    </div>
  )
}
