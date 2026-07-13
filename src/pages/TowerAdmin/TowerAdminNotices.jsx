import { useState } from 'react'
import { useNotifications } from '../../context/NotificationStore'
import { useToast } from '../../components/ToastProvider'

// Notices received from Society Admin, plus local tower-level notices
const RECEIVED = [
  { id:1, from:'Society Admin', title:'Building Maintenance – Jun 20', body:'Electrical maintenance in common areas on Jun 20, 9 AM–1 PM. Expect brief power interruptions. Please inform all Tower A residents.', type:'Mandatory', date:'Jun 15, 2024' },
  { id:2, from:'Society Admin', title:'Water Supply Interruption', body:'Municipal water supply will be cut on Jun 18, 7 AM–11 AM. Please store water accordingly and notify residents.', type:'Alert', date:'Jun 10, 2024' },
  { id:3, from:'Society Admin', title:'Monthly Meter Reading', body:'Meter readings for June will be taken on Jun 28–29. Ensure access to all meters in Tower A.', type:'General', date:'Jun 5, 2024' },
]

const typeStyle = {
  Mandatory: 'bg-red-500/15 text-red-400 border-red-500/30',
  Alert:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  General:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
}
const typeAccent = { Mandatory:'border-l-red-500', Alert:'border-l-amber-500', General:'border-l-blue-500' }

export default function TowerAdminNotices() {
  const { sendNotification } = useNotifications()
  const { addToast } = useToast()
  const [tab, setTab] = useState('received')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', body:'', type:'General' })

  const forwardToResidents = (notice) => {
    sendNotification({ title: notice.title, message: notice.body, type: 'notice', from: 'Tower A Admin' })
    addToast(`✅ Forwarded "${notice.title}" to Tower A residents`, 'success')
  }

  const sendLocalNotice = () => {
    if (!form.title.trim() || !form.body.trim()) return
    sendNotification({ title: form.title, message: form.body, type: 'notice', from: 'Tower A Admin' })
    addToast(`📢 Notice sent to Tower A residents!`, 'success')
    setForm({ title:'', body:'', type:'General' })
    setShowForm(false)
  }

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Tower A — Notices</h1>
          <p className="text-gray-400 text-sm mt-0.5">Notices from Society Admin + forward to residents</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)' }}>
          + Send Tower Notice
        </button>
      </div>

      {/* Local notice form */}
      {showForm && (
        <div className="rounded-2xl p-5 border dark-card border-[rgba(8,145,178,0.3)]">
          <h3 className="text-base font-bold text-white mb-4">Send Notice to Tower A Residents</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Type</label>
              <div className="flex gap-2">
                {['General','Alert','Mandatory'].map(t => (
                  <button key={t} onClick={() => setForm({...form, type:t})}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            form.type === t ? typeStyle[t] : 'dark-page-bg text-gray-400 border-[rgba(255,255,255,0.1)]'
                          }`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Title</label>
              <input value={form.title} onChange={e => setForm({...form, title:e.target.value})}
                     placeholder="Notice title…"
                     className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-cyan-500 placeholder-gray-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Message</label>
              <textarea value={form.body} onChange={e => setForm({...form, body:e.target.value})}
                        rows={3} placeholder="Notice message…"
                        className="w-full px-3 py-2 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-cyan-500 resize-none placeholder-gray-600" />
            </div>
            <div className="flex gap-3">
              <button onClick={sendLocalNotice} disabled={!form.title.trim() || !form.body.trim()}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40"
                      style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)' }}>
                Send to Tower A
              </button>
              <button onClick={() => setShowForm(false)}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-300 dark-row border border-[rgba(255,255,255,0.08)]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.06)] w-fit">
        {[['received','From Society Admin'],['forward','Forward to Residents']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab === id ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  style={tab === id ? { background:'linear-gradient(135deg,#0891b2,#0e7490)' } : {}}>
            {label}
          </button>
        ))}
      </div>

      {/* Received notices list */}
      <div className="space-y-3">
        {RECEIVED.map(n => (
          <div key={n.id} className={`rounded-2xl dark-card border-l-4 border border-[rgba(255,255,255,0.06)] p-4 ${typeAccent[n.type]}`}>
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-bold text-sm">{n.title}</p>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${typeStyle[n.type]}`}>{n.type}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <span className="text-xs text-gray-500">{n.date}</span>
                <span className="text-xs text-gray-500">From: {n.from}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">{n.body}</p>
            {tab === 'forward' && (
              <button onClick={() => forwardToResidents(n)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)' }}>
                📢 Forward to Tower A Residents
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
