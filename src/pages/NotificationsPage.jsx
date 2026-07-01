import { useState, useEffect } from 'react'
import { useCurrency } from '../context/CurrencyContext'
import { useNotifications } from '../context/NotificationStore'

const FILTERS = ['all', 'billing', 'meter', 'payment', 'notice']

export default function NotificationsPage({ onNavigate }) {
  const { country } = useCurrency()
  const sym = country.symbol
  const { notifications, markRead, markAllRead } = useNotifications()

  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)

  // Mark all as read when page opens
  useEffect(() => { markAllRead() }, []) // eslint-disable-line

  const visible = filter === 'all' ? notifications : notifications.filter(n => n.category === filter)
  const unread  = notifications.filter(n => !n.read).length

  /* Category filter button colours — work in both light and dark */
  const catStyle = {
    billing: { active: { background:'rgba(59,130,246,0.15)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.4)' } },
    payment: { active: { background:'rgba(16,185,129,0.15)', color:'#34d399', border:'1px solid rgba(16,185,129,0.4)' } },
    meter:   { active: { background:'rgba(249,115,22,0.15)', color:'#fb923c', border:'1px solid rgba(249,115,22,0.4)' } },
    notice:  { active: { background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.4)' } },
    all:     { active: { background:'rgba(100,116,139,0.15)',color:'#94a3b8', border:'1px solid rgba(100,116,139,0.4)' } },
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {unread > 0
              ? <span className="font-semibold" style={{color:'#ef4444'}}>{unread} unread</span>
              : <span>All caught up ✓</span>}
            &nbsp;· {notifications.length} total
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                  style={{background:'rgba(59,130,246,0.1)',color:'#60a5fa',border:'1px solid rgba(59,130,246,0.3)'}}>
            Mark all read
          </button>
        )}
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label:'Billing', count:notifications.filter(n=>n.category==='billing').length, icon:'📄', bg:'#1d4ed8' },
          { label:'Meter',   count:notifications.filter(n=>n.category==='meter').length,   icon:'⚡', bg:'#ea580c' },
          { label:'Payment', count:notifications.filter(n=>n.category==='payment').length, icon:'💰', bg:'#059669' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 shadow-card border border-gray-100 flex items-center gap-3 bg-white">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                 style={{background:s.bg}}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-extrabold text-gray-900 leading-tight">{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {FILTERS.map(f => {
          const isActive = filter === f
          return (
            <button key={f} onClick={() => setFilter(f)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap"
                    style={isActive
                      ? catStyle[f].active
                      : { background:'rgba(0,0,0,0.04)', color:'#64748b', border:'1px solid rgba(0,0,0,0.08)' }}>
              {f === 'all' ? `All (${notifications.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          )
        })}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {visible.length === 0 && (
          <div className="text-center py-14">
            <div className="text-5xl mb-3">🔕</div>
            <p className="text-sm font-medium text-gray-500">No notifications in this category</p>
          </div>
        )}

        {visible.map(n => (
          <div key={n.id}
               onClick={() => { setExpanded(expanded === n.id ? null : n.id); markRead(n.id) }}
               className="rounded-2xl border cursor-pointer transition-all overflow-hidden"
               style={{
                 background: !n.read ? '#ffffff' : '#f8fafc',
                 border: !n.read ? '1px solid #dbeafe' : '1px solid #e2e8f0',
                 boxShadow: !n.read ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
               }}>

            <div className="flex items-start gap-3 p-4">
              {/* Colour bar */}
              <div className="w-1 self-stretch rounded-full flex-shrink-0"
                   style={{ background: n.accent, minHeight:'40px' }}/>

              {/* Icon */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                   style={{ background: n.accent + '20' }}>
                {n.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold leading-snug"
                     style={{ color: !n.read ? '#0f172a' : '#334155' }}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background:'#3b82f6' }}/>
                  )}
                </div>
                <p className="text-xs mt-1 leading-relaxed"
                   style={{
                     color: !n.read ? '#475569' : '#94a3b8',
                     display: expanded === n.id ? 'block' : '-webkit-box',
                     WebkitLineClamp: expanded === n.id ? 'unset' : 2,
                     WebkitBoxOrient: 'vertical',
                     overflow: expanded === n.id ? 'visible' : 'hidden',
                   }}>
                  {n.message}
                </p>
                <p className="text-[10px] mt-1.5 font-medium" style={{ color:'#94a3b8' }}>
                  {n.time}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {expanded === n.id && n.action && (
              <div className="px-4 pb-4 flex gap-2" onClick={e => e.stopPropagation()}>
                <button onClick={() => onNavigate(n.action.page)}
                        className="px-4 py-2 text-xs font-bold text-white rounded-xl transition-all"
                        style={{ background:'linear-gradient(135deg,#0066FF,#6366f1)' }}>
                  {n.action.label} →
                </button>
                <button onClick={() => setExpanded(null)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
                        style={{ background:'#f1f5f9', color:'#64748b' }}>
                  Dismiss
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
