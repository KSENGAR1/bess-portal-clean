import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-16 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

const iconMap = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  info: <Info size={16} className="text-blue-400" />,
}

const borderMap = {
  success: 'border-emerald-500/30',
  error: 'border-red-500/30',
  warning: 'border-amber-500/30',
  info: 'border-blue-500/30',
}

const bgMap = {
  success: 'bg-emerald-500/10',
  error: 'bg-red-500/10',
  warning: 'bg-amber-500/10',
  info: 'bg-blue-500/10',
}

function ToastItem({ toast, onClose }) {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  const bgStyle = isDark
    ? {
        background: 'rgba(15,23,42,0.92)',
        border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : toast.type === 'error' ? 'rgba(239,68,68,0.3)' : toast.type === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`,
      }
    : {
        background: '#ffffff',
        border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : toast.type === 'error' ? 'rgba(239,68,68,0.4)' : toast.type === 'warning' ? 'rgba(245,158,11,0.4)' : 'rgba(59,130,246,0.4)'}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }

  const textColor = isDark ? 'text-white' : 'text-gray-900'

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-slide-up min-w-[260px] max-w-[380px]`}
      style={bgStyle}
    >
      {iconMap[toast.type]}
      <p className={`text-sm font-semibold flex-1 ${textColor}`}>{toast.message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
        <X size={14} />
      </button>
    </div>
  )
}
