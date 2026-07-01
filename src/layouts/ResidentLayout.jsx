import { Sun, Moon, Bell, User, LogOut, Home, Gauge, Wallet, Receipt } from 'lucide-react'
import { useNotifications } from '../context/NotificationStore'

const TODAY = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', Icon: Home },
  { id: 'meter', label: 'Meter', Icon: Gauge },
  { id: 'wallet', label: 'Wallet', Icon: Wallet },
  { id: 'invoices', label: 'Invoices', Icon: Receipt },
]

export default function ResidentLayout({
  children,
  currentPage,
  onNavigate,
  dark,
  onToggleDark,
  onLogout,
}) {
  const { unreadCount } = useNotifications()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/lith-on-logo.png"
              alt="Lith-On"
              className="h-11 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="hidden sm:block text-[11px] mr-2 font-medium text-slate-500 dark:text-slate-400">
              {TODAY}
            </span>
            <button
              onClick={onToggleDark}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 mr-1"
            >
              {dark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
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
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <User size={18} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-24 page-enter">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {NAV_ITEMS.map((nav) => {
            const isActive = currentPage === nav.id
            return (
              <button
                key={nav.id}
                onClick={() => onNavigate(nav.id)}
                className={`
                  relative flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'text-blue-500'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-xl -z-10 bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/15 dark:border-blue-500/20" />
                )}
                <nav.Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold">{nav.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-blue-500 mt-0.5 animate-pulse" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
