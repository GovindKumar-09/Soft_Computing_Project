
import { BookOpen, RefreshCw, Loader2 } from 'lucide-react'

function LectureSelector({
  lectures = [],
  loading,
  selectedId,
  onSelect,
  onClear
}) {
  const hasLectures = lectures.length > 0

  return (
    <section className="glass-card p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
          <BookOpen size={21} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Current lecture
          </p>

          {loading ? (
            <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Loading lectures…
            </div>
          ) : hasLectures ? (
            <select
              value={selectedId}
              onChange={e => onSelect(e.target.value)}
              className="bg-transparent text-white text-sm font-semibold mt-1 outline-none max-w-full cursor-pointer"
            >
              <option className="bg-slate-900" value="">— select a lecture —</option>
              {lectures.map(l => {
                const id = l.lectureId || l.id
                return (
                  <option key={id} className="bg-slate-900" value={id}>
                    {l.title || 'Untitled'} — {l.subject || 'General'}
                  </option>
                )
              })}
            </select>
          ) : (
            <p className="text-slate-400 text-sm mt-1">
              No lectures uploaded yet.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {selectedId && (
          <span className="flex items-center gap-2 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-full">
            RAG ACTIVE
          </span>
        )}

        {!selectedId && !loading && (
          <span className="flex items-center gap-2 text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-full">
            SELECT LECTURE
          </span>
        )}

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw size={14} />
          Clear chat
        </button>
      </div>
    </section>
  )
}

export default LectureSelector
