
import { Link } from 'react-router-dom'
import {
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react'

function QuizResults({ questions, answers, score, onRetake }) {
  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0

  const getOptionText = (question, index) => {
    if (index === undefined || index === null) return 'Not answered'

    const option = question.options?.[index]

    if (typeof option === 'string') return option

    return option?.text || option?.label || 'Not answered'
  }

  const getResultLabel = () => {
    if (percentage >= 80) return 'Excellent work!'
    if (percentage >= 60) return 'Good effort!'
    if (percentage >= 40) return 'Keep practising!'
    return 'Time to revise!'
  }

  return (
    <div className="space-y-8">

      {/* SCORE */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/80 via-[#17112d] to-[#0d0b1b] p-7 sm:p-10 text-center">
        <div className="absolute -top-24 left-1/3 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />

        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-6">
            <Trophy size={37} />
          </div>

          <p className="text-indigo-300 text-xs font-bold tracking-widest uppercase">
            Quiz completed
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            {getResultLabel()}
          </h2>

          <div className="mt-8">
            <span className="text-6xl sm:text-7xl font-extrabold gradient-text">
              {percentage}%
            </span>
          </div>

          <p className="text-slate-400 text-sm mt-4">
            You scored <span className="text-white font-bold">{score}</span> out of{' '}
            <span className="text-white font-bold">{questions.length}</span> questions.
          </p>

          <div className="flex justify-center flex-wrap gap-4 mt-8">
            <div className="bg-white/[0.05] border border-white/10 rounded-xl px-6 py-4">
              <CheckCircle2 size={19} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-white text-xl font-bold">{score}</p>
              <p className="text-slate-500 text-[10px] mt-1">Correct</p>
            </div>

            <div className="bg-white/[0.05] border border-white/10 rounded-xl px-6 py-4">
              <Target size={19} className="text-red-400 mx-auto mb-2" />
              <p className="text-white text-xl font-bold">{questions.length - score}</p>
              <p className="text-slate-500 text-[10px] mt-1">Incorrect</p>
            </div>
          </div>

          <button
            onClick={onRetake}
            className="gradient-button inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm mt-9"
          >
            <RotateCcw size={16} />
            Retake quiz
          </button>
        </div>
      </section>

      {/* ANSWER REVIEW */}
      <section>
        <div className="mb-6">
          <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">
            Learn from your answers
          </p>
          <h3 className="text-2xl font-bold text-white mt-3">
            Answer Review
          </h3>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const correctAnswer = question.correctAnswer
            const selectedAnswer = answers[index]
            const isCorrect = selectedAnswer === correctAnswer

            return (
              <article
                key={question.id || index}
                className="glass-card p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  {isCorrect
                    ? <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                    : <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                  }

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                      Question {index + 1}
                    </p>

                    <h4 className="text-white text-sm font-semibold leading-6 mt-2">
                      {question.question || question.text}
                    </h4>

                    <p className="text-xs text-slate-400 mt-4">
                      Your answer:{' '}
                      <span className={isCorrect ? 'text-emerald-300' : 'text-red-300'}>
                        {getOptionText(question, selectedAnswer)}
                      </span>
                    </p>

                    {!isCorrect && (
                      <p className="text-xs text-slate-400 mt-2">
                        Correct answer:{' '}
                        <span className="text-emerald-300">
                          {getOptionText(question, correctAnswer)}
                        </span>
                      </p>
                    )}

                    {question.explanation && (
                      <div className="mt-4 p-4 rounded-xl bg-indigo-500/[0.07] border border-indigo-500/15">
                        <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                          Explanation
                        </p>
                        <p className="text-slate-300 text-xs leading-6">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <Link
        to="/notes"
        className="glass-card p-5 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen size={21} className="text-indigo-300" />
          <div>
            <p className="text-white text-sm font-semibold">Revise your notes</p>
            <p className="text-slate-500 text-xs mt-1">Review the concepts you just practised.</p>
          </div>
        </div>
        <span className="text-indigo-300 text-xs font-semibold">Open notes →</span>
      </Link>
    </div>
  )
}

export default QuizResults
