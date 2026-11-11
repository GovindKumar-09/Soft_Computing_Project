
import { BookOpen, RefreshCw, Sparkles } from 'lucide-react'

function LectureSelector({ lecture, setLecture, onClear }) {
  return (
    <section className="glass-card p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
          <BookOpen size={21} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Current lecture
          </p>

          <select
            value={lecture}
            onChange={event => setLecture(event.target.value)}
            className="bg-transparent text-white text-sm font-semibold mt-1 outline-none max-w-full"
          >
            <option className="bg-slate-900" value="Operating Systems — Process Management">
              Operating Systems — Process Management
            </option>
            <option className="bg-slate-900" value="Database Management Systems">
              Database Management Systems
            </option>
            <option className="bg-slate-900" value="General conversation">
              General conversation
            </option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-full">
          <Sparkles size={12} />
          DEMO MODE
        </span>

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
