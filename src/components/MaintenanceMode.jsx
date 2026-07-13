import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

export default function MaintenanceMode() {
  const estimatedTime = "2-3 hours"
  const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-4">
              <AlertCircle size={48} className="text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">Maintenance Mode</h1>
          <p className="text-blue-200 text-lg">We're working to improve your experience</p>
        </div>

        {/* Message Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-semibold">Estimated Time</p>
                <p className="text-gray-300 text-sm">{estimatedTime}</p>
              </div>
            </div>

            <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-2/3 animate-pulse"></div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Our team is performing essential maintenance. We'll be back online shortly with improved performance and new features.
            </p>

            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <CheckCircle2 size={16} />
              <span>Your data is safe and will be available when we return</span>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <p className="text-gray-300 text-sm mb-2">
            <span className="text-blue-400 font-semibold">Last Updated:</span> {currentDate} at {currentTime}
          </p>
          <p className="text-gray-400 text-xs">
            For support, please contact us at: <span className="text-blue-300">support@bess-systems.com</span>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Thank you for your patience
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
