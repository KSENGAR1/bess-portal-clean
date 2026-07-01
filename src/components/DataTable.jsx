import { useState, useMemo } from 'react'
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react'

export default function DataTable({
  data = [],
  columns = [],
  searchable = true,
  sortable = true,
  pageSize = 10,
  exportable = true,
  emptyMessage = 'No data available',
}) {
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter(row =>
      columns.some(col => {
        const val = row[col.key]
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  }, [data, search, columns])

  const sorted = useMemo(() => {
    if (!sortCol || !sortable) return filtered
    const dir = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const av = a[sortCol]
      const bv = b[sortCol]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
  }, [filtered, sortCol, sortDir, sortable])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (key) => {
    if (!sortable) return
    if (sortCol === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(key)
      setSortDir('asc')
    }
  }

  const handleExport = () => {
    const headers = columns.map(c => c.label).join(',')
    const rows = sorted.map(row => columns.map(c => `"${row[c.key] ?? ''}"`).join(',')).join('\n')
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Toolbar */}
      {(searchable || exportable) && (
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-slate-700">
          {searchable && (
            <div className="flex items-center gap-2 flex-1 max-w-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600">
              <Search size={14} className="text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="bg-transparent text-xs text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 outline-none w-full"
              />
            </div>
          )}
          {exportable && (
            <button onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all">
              <Download size={13} /> Export CSV
            </button>
          )}
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium ml-auto">{sorted.length} records</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-700">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 ${sortable ? 'cursor-pointer hover:text-gray-600 dark:hover:text-slate-200' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortable && sortCol === col.key && (
                      <ArrowUpDown size={11} className={sortDir === 'desc' ? 'rotate-180' : ''} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-sm font-medium text-gray-400 dark:text-slate-500">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-blue-50/30 dark:hover:bg-slate-700/40 transition-all">
                  {columns.map(col => (
                    <td key={col.key} className="py-3 px-4 text-gray-700 dark:text-slate-300">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all"
          >
            <ChevronLeft size={13} /> Prev
          </button>
          <span className="text-xs font-bold text-gray-400 dark:text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all"
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  )
}
