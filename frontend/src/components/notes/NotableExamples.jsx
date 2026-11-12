
import { Lightbulb, ArrowRight } from 'lucide-react'

function NotableExamples({ examples = [] }) {
  if (!examples.length) return null

  return (
    <section className="mb-12">

      <div className="mb-7">
        <p className="text-fuchsia-400 text-xs font-bold tracking-widest uppercase">
          Learn through real examples
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
          Notable Examples
        </h2>

        <p className="text-slate-500 text-sm mt-2">
          Important inventions, events and applications from your lecture.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {examples.map((item, index) => {
          const name = typeof item === 'string'
            ? item
            : item.name || item.title || `Example ${index + 1}`

          const description = typeof item === 'string'
            ? ''
            : item.description || item.explanation || ''

          return (
            <article
              key={index}
              className="glass-card p-6 hover:border-fuchsia-500/30 transition-colors"
            >
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 shrink-0 rounded-xl bg-fuchsia-500/10 text-fuchsia-300 flex items-center justify-center">
                  <Lightbulb size={21} />
                </div>

                <div>
                  <h3 className="text-white font-bold text-base">
                    {name}
                  </h3>

                  {description && (
                    <p className="text-slate-400 text-sm leading-7 mt-3">
                      {description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-fuchsia-300 text-xs mt-4 font-semibold">
                    Example {String(index + 1).padStart(2, '0')}
                    <ArrowRight size={13} />
                  </div>
                </div>

              </div>
            </article>
          )
        })}

      </div>
    </section>
  )
}

export default NotableExamples
