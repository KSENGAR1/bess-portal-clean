import { useState } from 'react'
import { useAlerts } from '../context/AlertsContext'
import { X, Bell, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export default function AlertCenter() {
  let alerts = [], dismissAlert, dismissAll, markAsRead, markAllAsRead, getUnreadCount = () => 0
  
  try {
    const context = useAlerts()
    alerts = context.alerts
    dismissAlert = context.dismissAlert
    dismissAll = context.dismissAll
    markAsRead = context.markAsRead
    markAllAsRead = context.markAllAsRead
    getUnreadCount = context.getUnreadCount
  } catch (e) {
    // AlertsProvider not available, render nothing
    return null
  }
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('All')

  const unreadCount = getUnreadCount()
  const filtered = filter === 'All' ? alerts :
    filter === 'Critical' ? alerts.filter(a => a.type === 'critical') :
    filter === 'Warning' ? alerts.filter(a => a.type === 'warning') :
    alerts.filter(a => a.type === 'info')

  const typeStyle = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/30 border-l-red-500',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30 border-l-amber-500',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30 border-l-blue-500',
  }

  const typeIcon = {
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  return (
    <>
      {/* Alert Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-all"
        title="Alerts & Notifications"
      >
        <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Alert Dropdown Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 w-96 max-h-[600px] rounded-2xl dark-card border border-[rgba(255,255,255,0.1)] shadow-2xl z-40 overflow-hidden flex flex-col animate-slide-down">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-white font-bold">Alerts & Notifications</h3>
              <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-all"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Filters */}
          <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.06)] flex gap-1 flex-shrink-0 bg-[rgba(255,255,255,0.02)]">
            {['All', 'Critical', 'Warning', 'Info'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No alerts</p>
              </div>
            ) : (
              <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {filtered.map(alert => {
                  const Icon = typeIcon[alert.type]
                  return (
                    <div
                      key={alert.id}
                      className={`px-3 py-3 border-l-4 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-all ${typeStyle[alert.type]} ${
                        !alert.read ? 'bg-[rgba(255,255,255,0.02)]' : ''
                      }`}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <div className="flex gap-3">
                        <span className="text-xl flex-shrink-0">{alert.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm text-white">{alert.title}</p>
                            {!alert.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{alert.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-600">{alert.time}</span>
                            {alert.action && (
                              <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                                {alert.action} →
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dismissAlert(alert.id)
                          }}
                          className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded-lg flex-shrink-0 transition-all"
                        >
                          <X className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {alerts.length > 0 && (
            <div className="px-3 py-2 border-t border-[rgba(255,255,255,0.06)] flex gap-2 flex-shrink-0 bg-[rgba(255,255,255,0.02)]">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
                >
                  Mark All Read
                </button>
              )}
              <button
                onClick={dismissAll}
                className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-all"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
