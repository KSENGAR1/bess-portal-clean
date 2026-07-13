import { createContext, useContext, useState, useCallback } from 'react'

const AlertsContext = createContext()

export const useAlerts = () => {
  const context = useContext(AlertsContext)
  if (!context) {
    throw new Error('useAlerts must be used within AlertsProvider')
  }
  return context
}

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([
    // Sample critical alerts
    { id: 1, type: 'critical', title: 'Meter Offline', message: 'MTR-042 in Tower C is offline for 30 mins', time: '2 min ago', read: false, icon: '🔴', action: 'Check meter' },
    { id: 2, type: 'warning', title: 'High Temperature', message: 'BESS-004 temperature at 38°C (critical level)', time: '5 min ago', read: false, icon: '🌡️', action: 'Cool down' },
    { id: 3, type: 'critical', title: 'Payment Overdue', message: 'Consumer RAJ-301A overdue by ₹2,450 for 15 days', time: '1 hour ago', read: false, icon: '💳', action: 'Send notice' },
    { id: 4, type: 'info', title: 'Billing Generated', message: 'Monthly billing for 245 consumers completed successfully', time: '3 hours ago', read: true, icon: '📋', action: null },
    { id: 5, type: 'warning', title: 'Low SOC', message: 'Tower A battery at 25% SOC, charging recommended', time: '4 hours ago', read: true, icon: '🔋', action: 'Start charging' },
  ])

  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: Date.now(),
      time: 'now',
      read: false,
      ...alert,
    }
    setAlerts(prev => [newAlert, ...prev])
    return newAlert
  }, [])

  const markAsRead = useCallback((alertId) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })))
  }, [])

  const dismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }, [])

  const dismissAll = useCallback(() => {
    setAlerts([])
  }, [])

  const getUnreadCount = useCallback(() => {
    return alerts.filter(a => !a.read).length
  }, [alerts])

  const getAlertsByType = useCallback((type) => {
    return alerts.filter(a => a.type === type)
  }, [alerts])

  const getCriticalAlerts = useCallback(() => {
    return alerts.filter(a => a.type === 'critical' && !a.read)
  }, [alerts])

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        addAlert,
        markAsRead,
        markAllAsRead,
        dismissAlert,
        dismissAll,
        getUnreadCount,
        getAlertsByType,
        getCriticalAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}
