
import { CheckCircle2, Target } from 'lucide-react'

function QuizProgress({ currentQuestion, totalQuestions, answeredCount }) {
  const progress = totalQuestions
    ? (answeredCount / totalQuestions) * 100
    : 0

  return (
    <div className="glass-card p-5 sm:p-6 mb-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div>
          <p className="text-slate-500 text-xs">Your progress</p>
          <h3 className="text-white font-bold mt-1">
            Question {currentQuestion + 1}
            <span className="text-slate-500 font-normal"> / {totalQuestions}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 text-indigo-300 text-xs">
          <Target size={16} />
          {answeredCount} answered
        </div>
      </div>

      <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="text-[10px] text-slate-500">
          {Math.round(progress)}% completed
        </span>

        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <CheckCircle2 size={12} className="text-emerald-400" />
          {totalQuestions - answeredCount} remaining
        </span>
      </div>
    </div>
  )
}

export default QuizProgress
