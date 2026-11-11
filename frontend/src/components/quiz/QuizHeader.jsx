
import { Link } from 'react-router-dom'
import { ArrowLeft, Brain, Sparkles } from 'lucide-react'

function QuizHeader({ questionCount }) {
  return (
    <section className="pt-16 sm:pt-20 pb-10">
      <Link
        to="/lectures"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-9"
      >
        <ArrowLeft size={16} />
        Back to lectures
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
          <Sparkles size={15} />
          Test your understanding
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Knowledge <span className="gradient-text">Check.</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg leading-8 mt-5 max-w-2xl">
          Challenge yourself with questions based on your lecture.
          Learn from every answer and track your progress.
        </p>

        <div className="flex flex-wrap gap-3 mt-7">
          <span className="px-3 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
            <Brain size={13} className="inline mr-2" />
            Operating Systems
          </span>

          <span className="px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 text-xs">
            {questionCount} questions
          </span>

          <span className="px-3 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            Practice mode
          </span>
        </div>
      </div>
    </section>
  )
}

export default QuizHeader
