import { useState } from 'react'

export default function NavLink({ page, currentPage, onNavigate, Icon, label, activeClass, activeDotColor }) {
  const isActive = currentPage === page

  return (
    <button
      onClick={() => onNavigate(page)}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group
        ${isActive ? activeClass : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}
      `}
    >
      <span className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        <Icon size={16} />
      </span>
      <span className="truncate">{label}</span>
      {isActive && (
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: activeDotColor }}
        />
      )}
    </button>
  )
}
