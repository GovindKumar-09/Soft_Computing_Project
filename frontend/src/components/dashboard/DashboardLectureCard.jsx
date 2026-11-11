
import { Link } from 'react-router-dom'
import {
  FileText,
  FileVideo,
  Clock,
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  BookOpen,
  Play,
  ArrowUpRight
} from 'lucide-react'

function DashboardLectureCard({
  lecture,
  getStatus,
  formatDate,
  formatDuration
}) {
  const id = lecture._id || lecture.id
  const status = getStatus(lecture)

  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'
  const Icon = isCompleted ? FileText : FileVideo

  return (
    <article className="group bg-slate-900/65 border border-white/[0.08] rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/10">

      {/* THUMBNAIL */}
      <div className="h-40 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-[#17112e] to-[#0c0b19] flex items-center justify-center">
        <div className="absolute -top-16 -left-10 w-52 h-52 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-52 h-52 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.07] border border-white/10 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform duration-300">
          <Icon size={30} />
        </div>

        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold border ${
            isCompleted
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : isFailed
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300 processing-glow'
          }`}>
            {isCompleted
              ? <CheckCircle2 size={12} />
              : <LoaderCircle size={12} className={isFailed ? '' : 'animate-spin'} />
            }

            {isCompleted ? 'Completed' : isFailed ? 'Failed' : 'Processing'}
          </span>
        </div>

        <span className="absolute bottom-4 right-4 text-[10px] font-medium text-slate-400 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <Clock size={11} className="inline mr-1" />
          {formatDuration(lecture.duration)}
        </span>
      </div>

      {/* CARD DETAILS */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-white font-bold text-base truncate group-hover:text-indigo-300 transition-colors">
              {lecture.title || 'Untitled lecture'}
            </h3>

            <p className="text-slate-500 text-xs mt-2 truncate">
              {lecture.subject || 'General'}
            </p>
          </div>

          <div className="w-9 h-9 shrink-0 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-slate-400">
            <BookOpen size={17} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs mt-5 pt-4 border-t border-white/[0.07]">
          <CalendarDays size={14} />
          {formatDate(lecture.date || lecture.createdAt)}
        </div>

        {isCompleted ? (
          <Link
            to={id ? `/transcript/${id}` : '/transcript'}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-white text-slate-950 py-3 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <Play size={14} fill="currentColor" />
            Open lecture
            <ArrowUpRight size={14} />
          </Link>
        ) : (
          <div className="mt-5 w-full flex items-center justify-center gap-2 bg-white/[0.05] text-slate-400 py-3 rounded-xl text-xs font-semibold">
            {isFailed ? 'Processing failed' : 'Being processed'}
          </div>
        )}
      </div>
    </article>
  )
}

export default DashboardLectureCard
