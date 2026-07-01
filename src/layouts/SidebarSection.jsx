export default function SidebarSection({ label, className = '' }) {
  return (
    <div className="pt-4 pb-1 px-2">
      <p className={`text-[10px] font-bold uppercase tracking-widest ${className}`}>
        {label}
      </p>
    </div>
  )
}
