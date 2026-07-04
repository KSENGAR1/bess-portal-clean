import { useState } from 'react'
import { useNotifications } from '../../context/NotificationStore'
import { useToast } from '../../components/ToastProvider'

const INIT = [
  { id:1, title:'Building Maintenance', body:'Electrical maintenance in common areas on Jun 20, 9 AM–1 PM. Expect brief power interruptions.', type:'Mandatory', date:'2024-06-15', recipients:125, status:'Sent' },
  { id:2, title:'Water Supply Issue',   body:'Municipal water supply will be interrupted on Jun 18, 7 AM–11 AM. Please store water accordingly.', type:'Alert',     date:'2024-06-10', recipients:125, status:'Sent' },
  { id:3, title:'Monthly Meter Reading',body:'Meter readings for June will be taken on Jun 28–29. Please ensure meter access is available.', type:'General',   date:'2024-06-05', recipients:125, status:'Sent' },
]

const typeStyle = {
  Mandatory: 'bg-red-500/15 text-red-400 border-red-500/30',
  Alert:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  General:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
}
const typeAccent = { Mandatory:'border-l-red-500', Alert:'border-l-amber-500', General:'border-l-blue-500' }

export default function AdminNotices() {
  const { sendNotification } = useNotifications()
  const { addToast } = useToast()
  const [notices, setNotices] = useState(INIT)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ title:'', body:'', type:'General' })

  const typeToCategory = { General:'notice', Alert:'notice', Mandatory:'alert' }

  const send = () => {
    if (!form.title.trim() || !form.body.trim()) return
    // Add to local notices list
    setNotices(prev => [{
      id: Date.now(), ...form, date: new Date().toISOString().split('T')[0], recipients:125, status:'Sent'
    }, ...prev])
    // Push to shared notification store so residents see it
    sendNotification({
      title: form.title,
      message: form.body,
      type: typeToCategory[form.type] || 'notice',
      from: 'Society Admin',
    })
    setModal(false)
    setForm({ title:'', body:'', type:'General' })
    addToast(`Notice "${form.title}" sent to 125 residents!`, 'success')
  }

  return (
    <div className="admin-page p-6 space-y-5 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notices</h1>
          <p className="text-gray-400 text-sm mt-0.5">Broadcast notices to all residents</p>
        </div>
        <button onClick={()=>setModal(true)}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
          + Create Notice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Total Sent',  value: notices.length,                             from:'#1d4ed8',to:'#1e40af' },
          { label:'This Month',  value: notices.filter(n=>n.date.startsWith('2024-06')).length, from:'#065f46',to:'#064e3b' },
          { label:'Residents',   value: '125',                                       from:'#4c1d95',to:'#3b0764' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 keep-white" style={{ background:`linear-gradient(135deg,${s.from},${s.to})` }}>
            <p className="text-xs text-white/70">{s.label}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Notice list */}
      <div className="space-y-3">
        {notices.map(n => (
          <div key={n.id} className={`rounded-2xl dark-card border-l-4 border border-[rgba(255,255,255,0.06)] p-4 ${typeAccent[n.type]}`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-bold text-sm">{n.title}</p>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${typeStyle[n.type]}`}>{n.type}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500">{n.date}</span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">✓ Sent</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{n.body}</p>
            <p className="text-gray-600 text-xs mt-2">Sent to {n.recipients} residents</p>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
             onClick={()=>setModal(false)}>
          <div className="w-full max-w-md rounded-3xl p-6 animate-slide-up dark-card"
               style={{ border: '1px solid rgba(245,158,11,0.2)' }}
               onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-5">Create New Notice</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Notice Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['General','Alert','Mandatory'].map(t => (
                    <button key={t} onClick={()=>setForm({...form,type:t})}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              form.type===t ? `${typeStyle[t]} border-opacity-100` : 'dark-page-bg text-gray-400 border-[rgba(255,255,255,0.1)]'
                            }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Title</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                       placeholder="e.g. Society Meeting – July 2024"
                       className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Message</label>
                <textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})}
                          rows={4} placeholder="Write the notice message here…"
                          className="w-full px-3 py-2.5 rounded-xl dark-page-bg border border-[rgba(255,255,255,0.1)] text-white text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600 resize-none transition-all" />
              </div>

              <div className="bg-[rgba(245,158,11,0.08)] border border-amber-700/30 rounded-xl px-3 py-2.5 text-xs text-amber-400">
                📢 This notice will be sent to <strong>125 residents</strong> via app notification & SMS.
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={send} disabled={!form.title.trim()||!form.body.trim()}
                      className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40"
                      style={{ background:'linear-gradient(135deg,#d97706,#b45309)' }}>
                Send Notice →
              </button>
              <button onClick={()=>setModal(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[rgba(255,255,255,0.06)] hover:bg-gray-200 dark:hover:bg-[rgba(255,255,255,0.1)]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
