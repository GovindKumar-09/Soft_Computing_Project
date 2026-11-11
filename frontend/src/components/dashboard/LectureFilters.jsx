
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react'

const filters = [
  { label: 'All lectures', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Processing', value: 'processing' }
]

function LectureFilters({
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
  sortOrder,
  setSortOrder,
  loading,
  onRefresh
}) {
  return (
    <div className="glass-card p-3 sm:p-4 mb-7">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search lectures or subjects..."
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-1 text-slate-500">
            <SlidersHorizontal size={15} />
            <span className="text-xs">Filter</span>
          </div>

          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === filter.value
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}

          <select
            value={sortOrder}
            onChange={event => setSortOrder(event.target.value)}
            className="bg-[#171426] border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2.5 outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh lectures"
            className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LectureFilters
