/**
 * NotificationStore — shared cross-role notification context.
 * Admin sends notices → they appear in Resident's notification bell.
 * SuperAdmin can also broadcast.
 */
import { createContext, useContext, useState, useCallback } from 'react'

const NotifContext = createContext(null)

/* seed some initial notifications so the page isn't empty */
const SEED = [
  {
    id: 's1', category: 'notice', icon: '📢', accent: '#8b5cf6',
    title: 'Welcome to BESS Portal',
    message: 'Your smart energy monitoring portal is active. Track usage, pay bills, and manage your wallet here.',
    time: 'Jun 1, 9:00 AM', read: false, from: 'System',
  },
  {
    id: 's2', category: 'billing', icon: '📄', accent: '#3b82f6',
    title: 'June Invoice Ready',
    message: 'Your June 2024 electricity invoice is ready to view. Due date: 15 July 2024.',
    time: 'Jun 30, 11:00 AM', read: false, from: 'System',
    action: { label: 'View Invoice', page: 'invoices' },
  },
  {
    id: 's3', category: 'meter', icon: '⚡', accent: '#f97316',
    title: 'Grid → DG Switch',
    message: 'Power source switched to DG (Diesel Generator) due to grid outage. Higher rates apply.',
    time: 'Jun 13, 6:15 PM', read: true, from: 'System',
    action: { label: 'View Meter', page: 'meter' },
  },
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(SEED)

  /* Admin/SuperAdmin calls this to send a notice to residents */
  const sendNotification = useCallback(({ title, message, type = 'notice', from = 'Admin' }) => {
    const accentMap = {
      notice:  '#8b5cf6',
      billing: '#3b82f6',
      alert:   '#ef4444',
      payment: '#10b981',
      meter:   '#f97316',
    }
    const iconMap = {
      notice: '📢', billing: '📄', alert: '🚨', payment: '✅', meter: '⚡',
    }
    const now = new Date()
    const timeStr = now.toLocaleDateString('en-IN', { day:'numeric', month:'short' }) +
                    ', ' + now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })

    setNotifications(prev => [{
      id: Date.now(),
      category: type,
      icon: iconMap[type] || '📢',
      accent: accentMap[type] || '#8b5cf6',
      title,
      message,
      time: timeStr,
      read: false,
      from,
    }, ...prev])
  }, [])

  const markRead    = useCallback(id  => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), [])
  const markAllRead = useCallback(()  => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), [])
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotifContext.Provider value={{ notifications, sendNotification, markRead, markAllRead, unreadCount }}>
      {children}
    </NotifContext.Provider>
  )
}

export const useNotifications = () => useContext(NotifContext)
