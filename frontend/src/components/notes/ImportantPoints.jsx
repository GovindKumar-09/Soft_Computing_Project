
import { Check } from 'lucide-react'

function ImportantPoints({ points = [] }) {
  return (
    <section className="mb-12">
      <div className="mb-7">
        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase">
          Remember these
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
          Important Points
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Useful facts and exam-focused takeaways.
        </p>
      </div>

      <div className="glass-card p-5 sm:p-7">
        <div className="space-y-5">
          {points.map((item, index) => {
            const text = typeof item === 'string'
              ? item
              : item.text || item.description || item.title || item.point

            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-7 h-7 shrink-0 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mt-0.5">
                  <Check size={15} />
                </div>

                <p className="text-slate-300 text-sm leading-7">
                  {text}
                </p>
              </div>
            )
          })}

          {points.length === 0 && (
            <p className="text-slate-500 text-sm">No important points available.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default ImportantPoints
