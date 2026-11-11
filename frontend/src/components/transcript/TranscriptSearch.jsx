
import { Search, ListFilter } from 'lucide-react'

function TranscriptSearch({
  search,
  setSearch,
  resultCount,
  totalCount
}) {
  return (
    <section className="glass-card p-4 sm:p-5 mb-7">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search words, topics or concepts..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-slate-500 text-xs flex items-center gap-2">
            <ListFilter size={14} />
            {resultCount} of {totalCount} results
          </span>

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs text-indigo-300 hover:text-white font-semibold"
            >
              Clear search
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default TranscriptSearch
