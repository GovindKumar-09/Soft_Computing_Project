
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  AudioLines,
  BookOpen,
  Check,
  Copy,
  Clock,
  Sparkles
} from 'lucide-react'

function TranscriptHeader({ copied, onCopy, subject = 'Operating Systems', duration = '05:25' }) {
  return (
    <section className="pt-16 sm:pt-20 pb-12">
      <Link
        to="/lectures"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-9"
      >
        <ArrowLeft size={16} />
        Back to lectures
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <AudioLines size={16} />
            Your lecture, word by word
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Smart <span className="gradient-text">Transcript.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-8 mt-6 max-w-2xl">
            Find any concept in seconds. Search your lecture,
            explore timestamps and revisit important explanations.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-7">
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
              <BookOpen size={13} />
              {subject}
            </span>

            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 text-xs">
              <Clock size={13} />
              {duration} minutes
            </span>

            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <Sparkles size={13} />
              Sample transcript
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.04] text-white text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? 'Copied!' : 'Copy transcript'}
        </button>
      </div>
    </section>
  )
}

export default TranscriptHeader
