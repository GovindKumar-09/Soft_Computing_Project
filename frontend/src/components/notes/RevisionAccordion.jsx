
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function RevisionAccordion({ questions = [] }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <section className="mb-12">
      <div className="mb-7">
        <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">
          Test your recall
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
          Quick Revision
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Expand a question to reveal its answer.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((item, index) => {
          const isOpen = expanded === index
          const question = typeof item === 'string'
            ? item
            : item.question || item.q || ''

          const answer = typeof item === 'string'
            ? ''
            : item.answer || item.a || item.explanation || ''

          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? 'bg-indigo-500/[0.08] border-indigo-500/30'
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 text-left p-5"
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 shrink-0 rounded-lg bg-indigo-500/15 text-indigo-300 flex items-center justify-center text-xs font-bold">
                    Q{index + 1}
                  </span>
                  <span className="text-white text-sm font-semibold leading-6">
                    {question}
                  </span>
                </div>

                {isOpen
                  ? <ChevronUp size={19} className="text-indigo-300 shrink-0" />
                  : <ChevronDown size={19} className="text-slate-500 shrink-0" />
                }
              </button>

              {isOpen && (
                <div className="px-5 pb-6 pl-[4.5rem]">
                  <div className="border-l-2 border-indigo-500/40 pl-5">
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3">
                      Answer
                    </p>
                    <p className="text-slate-300 text-sm leading-7 whitespace-pre-wrap">
                      {answer || 'No answer available.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {questions.length === 0 && (
          <p className="glass-card p-6 text-slate-500 text-sm">
            No revision questions available.
          </p>
        )}
      </div>
    </section>
  )
}

export default RevisionAccordion
