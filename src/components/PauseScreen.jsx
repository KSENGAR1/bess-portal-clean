import { Play } from 'lucide-react'

export default function PauseScreen({ onResume }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        {/* Pause icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8">
              <div className="flex gap-2 justify-center h-16">
                <div className="w-2 bg-white rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                <div className="w-2 bg-white rounded-full animate-[pulse_1.5s_ease-in-out_infinite_0.3s]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl font-bold text-white mb-3">BESS Portal</h1>
        <p className="text-xl font-semibold text-blue-200 mb-2">Currently Paused</p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          This website is temporarily paused. Click the button below to resume and continue.
        </p>

        {/* Resume Button */}
        <button
          onClick={onResume}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
        >
          <Play size={24} className="fill-current" />
          Resume
        </button>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-8">Ready to continue? Click Resume</p>
      </div>
    </div>
  )
}
