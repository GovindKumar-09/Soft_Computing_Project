
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

function QuizNavigation({
  currentQuestion,
  totalQuestions,
  canContinue,
  allAnswered,
  onPrevious,
  onNext
}) {
  const isLastQuestion = currentQuestion === totalQuestions - 1

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowLeft size={17} />
        Previous
      </button>

      <div className="flex flex-col items-stretch sm:items-end gap-2">
        <button
          type="button"
          onClick={onNext}
          disabled={isLastQuestion ? !allAnswered : !canContinue}
          className="gradient-button inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLastQuestion ? (
            <>
              Finish quiz <CheckCircle2 size={17} />
            </>
          ) : (
            <>
              Next question <ArrowRight size={17} />
            </>
          )}
        </button>

        {isLastQuestion && !allAnswered && (
          <p className="text-[10px] text-slate-500">
            Answer all questions to see your results.
          </p>
        )}
      </div>
    </div>
  )
}

export default QuizNavigation
