
import { CheckCircle2, Circle, HelpCircle } from 'lucide-react'

function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelect
}) {
  const questionText = question.question || question.text || ''
  const options = question.options || []

  return (
    <section className="glass-card p-5 sm:p-8">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
          <HelpCircle size={22} />
        </div>

        <div>
          <p className="text-indigo-300 text-[10px] font-bold tracking-widest uppercase">
            Question {questionNumber}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Choose the best answer
          </p>
        </div>
      </div>

      <h2 className="text-white text-xl sm:text-2xl font-bold leading-relaxed mb-8">
        {questionText}
      </h2>

      <div className="space-y-3">
        {options.map((option, index) => {
          const optionText = typeof option === 'string'
            ? option
            : option.text || option.label || ''

          const isSelected = selectedAnswer === index

          return (
            <button
              type="button"
              key={index}
              onClick={() => onSelect(index)}
              className={`w-full flex items-center gap-4 p-4 sm:p-5 text-left rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-500/15 border-indigo-400/50 shadow-lg shadow-indigo-950/20'
                  : 'bg-white/[0.025] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/20'
              }`}
            >
              <span className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                isSelected
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/[0.06] text-slate-400'
              }`}>
                {String.fromCharCode(65 + index)}
              </span>

              <span className={`text-sm leading-6 flex-1 ${
                isSelected ? 'text-white font-medium' : 'text-slate-300'
              }`}>
                {optionText}
              </span>

              {isSelected
                ? <CheckCircle2 size={19} className="text-indigo-300 shrink-0" />
                : <Circle size={19} className="text-slate-600 shrink-0" />
              }
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default QuestionCard
