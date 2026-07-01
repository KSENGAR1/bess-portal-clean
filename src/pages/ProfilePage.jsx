import { useState } from 'react'
import { User, Mail, Phone, MapPin, Home, Users, Bell, Shield, LogOut, ChevronRight, Edit3, Check, X } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useToast } from '../components/ToastProvider'

const TABS = [
  { id:'profile',  label:'Profile',       Icon: User },
  { id:'flat',     label:'My Flat',       Icon: Home },
  { id:'notif',    label:'Notifications', Icon: Bell },
  { id:'security', label:'Security',      Icon: Shield },
]

function Toggle({ checked, onChange }) {
  return (
    <button onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked?'bg-blue-600':'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${checked?'left-5.5':'left-0.5'}`}
            style={{left: checked ? '1.375rem' : '0.125rem'}}/>
    </button>
  )
}

function Field({ label, value, isEditing, onChange, type='text', Icon }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-blue-600"/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        {isEditing ? (
          <input type={type} value={value} onChange={e=>onChange(e.target.value)}
                 className="w-full px-3 py-1.5 border-2 border-blue-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 bg-blue-50 transition-all"/>
        ) : (
          <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage({ onNavigate }) {
  const { country } = useCurrency()
  const sym = country.symbol
  const [tab, setTab]           = useState('profile')
  const [isEditing, setEditing] = useState(false)
  const { addToast } = useToast()
  const [info, setInfo]         = useState({
    name:'Rajesh Kumar', email:'rajesh.kumar@email.com',
    phone:'+91 9876543210', city:'Mumbai',
  })
  const [draft, setDraft] = useState({...info})
  const [notifs, setNotifs] = useState({
    lowBalance:true, invoiceReady:true, paymentDone:true, notices:false, meterAlert:true
  })

  const saveEdit  = () => { setInfo({...draft}); setEditing(false); addToast('Profile updated', 'success') }
  const cancelEdit = () => { setDraft({...info}); setEditing(false) }

  const flat = { flatNumber:'302', tower:'Tower A', society:'Galaxy Apartments', type:'Self Occupied', since:'Jan 2023' }
  const otherFlats = [
    { n:'405', t:'Tower B', s:'Galaxy Apartments' },
    { n:'101', t:'Tower C', s:'Stellar Heights' },
  ]

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 animate-fade-in">

      {/* Avatar header */}
      <div className="flex items-center gap-4 mb-6 p-5 bg-white rounded-2xl shadow-card border border-gray-100">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
             style={{background:'linear-gradient(135deg,#0066FF,#6366f1)'}}>
          RK
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-gray-900 text-lg leading-tight truncate">{info.name}</p>
          <p className="text-sm text-gray-500 truncate">{info.email}</p>
          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>Active · Flat {flat.flatNumber}
          </span>
        </div>
        <button onClick={() => { setTab('profile'); setEditing(true) }}
                className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-all flex-shrink-0">
          <Edit3 size={15} className="text-blue-600"/>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[11px] font-bold transition-all ${tab===t.id?'bg-white text-blue-700 shadow-sm':'text-gray-400 hover:text-gray-600'}`}>
            <t.Icon size={14}/>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {tab === 'profile' && (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-900 text-sm">Personal Information</p>
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={saveEdit}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all">
                  <Check size={12}/> Save
                </button>
                <button onClick={cancelEdit}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-all">
                  <X size={12}/> Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                <Edit3 size={12}/> Edit
              </button>
            )}
          </div>
          <div className="px-5">
            <Field label="Full Name"   value={draft.name}  onChange={v=>setDraft({...draft,name:v})}  isEditing={isEditing} Icon={User}/>
            <Field label="Email"       value={draft.email} onChange={v=>setDraft({...draft,email:v})} isEditing={isEditing} Icon={Mail}   type="email"/>
            <Field label="Phone"       value={draft.phone} onChange={v=>setDraft({...draft,phone:v})} isEditing={isEditing} Icon={Phone}  type="tel"/>
            <Field label="City"        value={draft.city}  onChange={v=>setDraft({...draft,city:v})}  isEditing={isEditing} Icon={MapPin}/>
          </div>
        </div>
      )}

      {/* ── Flat tab ── */}
      {tab === 'flat' && (
        <div className="space-y-4">
          {/* Current flat */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-bold text-gray-900 text-sm">Current Flat</p>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200">Active</span>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-6">
              {[['Flat',flat.flatNumber],['Tower',flat.tower],['Society',flat.society],['Type',flat.type],['Since',flat.since]].map(([l,v])=>(
                <div key={l}>
                  <p className="text-xs text-gray-500 mb-0.5">{l}</p>
                  <p className="font-bold text-gray-900 text-sm">{v}</p>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <button onClick={()=>addToast('📍 Edit flat details (demo)', 'success')}
                      className="w-full py-2.5 rounded-xl border-2 border-blue-200 text-blue-700 text-sm font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                <Edit3 size={14}/> Edit Flat Details
              </button>
            </div>
          </div>

          {/* Other flats */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900 text-sm">My Other Flats</p>
            </div>
            <div className="p-4 space-y-2">
              {otherFlats.map(f=>(
                <button key={f.n} onClick={()=>addToast(`Switched to Flat ${f.n} (demo)`, 'info')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-xs font-black text-blue-700 flex-shrink-0">
                    {f.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">Flat {f.n}</p>
                    <p className="text-xs text-gray-500">{f.t} · {f.s}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600">Switch <ChevronRight size={12} className="inline"/></span>
                </button>
              ))}
              <button onClick={()=>addToast('Register new flat (demo)', 'success')}
                      className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 text-sm font-semibold hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5">
                <span className="text-lg leading-none">+</span> Register New Flat
              </button>
            </div>
          </div>

          {/* Tenant */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-bold text-gray-900 text-sm">Tenant</p>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200">Active</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-sm font-black text-purple-700 flex-shrink-0">PS</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Priya Sharma</p>
                  <p className="text-xs text-gray-500">Jan 2024 – Dec 2024</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>addToast('Edit tenant (demo)', 'success')}
                        className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all">Edit</button>
                <button onClick={()=>addToast('Remove tenant (demo)', 'success')}
                        className="flex-1 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-all">Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Notifications tab ── */}
      {tab === 'notif' && (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-900 text-sm">Notification Preferences</p>
            <p className="text-xs text-gray-500 mt-0.5">Choose what you want to be notified about</p>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { key:'lowBalance', label:'Low Balance Alert',   sub:`When wallet drops below ${sym}1,000` },
              { key:'invoiceReady',label:'Invoice Ready',      sub:'When monthly bill is generated' },
              { key:'paymentDone', label:'Payment Confirmed',  sub:'After every recharge' },
              { key:'meterAlert',  label:'Meter Alerts',       sub:'High load / DG switch warnings' },
              { key:'notices',     label:'Society Notices',    sub:'Announcements from management' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between px-5 py-4">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-semibold text-gray-900">{n.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.sub}</p>
                </div>
                <Toggle checked={notifs[n.key]} onChange={() => setNotifs({...notifs,[n.key]:!notifs[n.key]})}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Security tab ── */}
      {tab === 'security' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900 text-sm">Account Security</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { Icon:Shield, label:'Change Password',           sub:'Update your login password',            action:'🔐 Password reset link sent (demo)' },
                { Icon:Bell,   label:'Enable 2FA',                sub:'Add an extra layer of security',        action:'📱 2FA setup link sent (demo)' },
                { Icon:Users,  label:'Active Sessions',           sub:'View and manage login sessions',        action:'💻 2 active sessions (demo)' },
                { Icon:Shield, label:'Download Audit Log',        sub:'All account activity history',          action:'📥 Audit log downloaded (demo)' },
              ].map(item => (
                <button key={item.label} onClick={() => addToast(item.action, 'info')}
                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-all text-left">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.Icon size={15} className="text-blue-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0"/>
                </button>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-sm font-bold text-red-800 mb-3">Danger Zone</p>
            <div className="flex gap-2">
              <button onClick={()=>addToast('Password changed (demo)', 'success')}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all">
                Reset Password
              </button>
              <button onClick={()=>addToast('Logged out everywhere (demo)', 'success')}
                      className="flex-1 py-2.5 rounded-xl border-2 border-red-300 text-red-700 text-xs font-bold hover:bg-red-100 transition-all">
                Logout All Devices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
