
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, FileText, Sparkles, Copy, Check } from 'lucide-react'

function NotesHeader({ notes, conceptsCount, copied, onCopy }) {
  return (
    <section className="pt-16 sm:pt-20 pb-12">
      <Link
        to="/lectures"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-9"
      >
        <ArrowLeft size={16} /> Back to lectures
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <Sparkles size={15} /> Your personal revision material
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Smart <span className="gradient-text">Notes.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-8 mt-6 max-w-2xl">
            The important parts, without the hours of searching.
            Review concepts, understand key points and prepare for exams.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <span className="px-3 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
              <BookOpen size={13} className="inline mr-2" />
              {notes.subject || 'Lecture subject'}
            </span>
            <span className="px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 text-xs">
              <FileText size={13} className="inline mr-2" />
              {conceptsCount} key concepts
            </span>
            <span className="px-3 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <Sparkles size={13} className="inline mr-2" />
              Sample notes
            </span>
          </div>
        </div>

        <button
          onClick={onCopy}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.04] text-white text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? 'Copied!' : 'Copy all notes'}
        </button>
      </div>
    </section>
  )
}

export default NotesHeader
