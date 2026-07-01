/**
 * Returns Recharts tooltip contentStyle and axis stroke colours
 * that adapt to the current dark/light mode.
 *
 * Usage:
 *   import { useChartTheme } from '../../utils/chartTheme'
 *   const { tooltipStyle, gridStroke, axisStroke } = useChartTheme()
 */
export function useChartTheme() {
  // Read directly from the <html> element so we don't need a prop
  const isDark = document.documentElement.classList.contains('dark')

  const tooltipStyle = isDark
    ? { backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 10, color: '#e5e7eb', fontSize: 12 }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', fontSize: 12 }

  const tooltipStyleSuperAdmin = isDark
    ? { backgroundColor: '#0d1230', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, color: '#e5e7eb', fontSize: 12 }
    : { backgroundColor: '#ffffff', border: '1px solid #ddd6fe', borderRadius: 10, color: '#0f172a', fontSize: 12 }

  const gridStroke    = isDark ? '#1f2937' : '#e2e8f0'
  const gridStrokeSA  = isDark ? '#1a2035' : '#e2e8f0'
  const axisStroke    = isDark ? '#4b5563' : '#94a3b8'
  const axisStrokeSA  = isDark ? '#374151' : '#94a3b8'
  const tickFill      = isDark ? '#6b7280' : '#64748b'

  return { tooltipStyle, tooltipStyleSuperAdmin, gridStroke, gridStrokeSA, axisStroke, axisStrokeSA, tickFill, isDark }
}
