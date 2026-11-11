
import { Sparkles } from 'lucide-react'

function SummaryCard({ summary }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/70 via-[#17112d] to-[#0d0b1b] p-6 sm:p-9 mb-8">
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-indigo-500/15 rounded-full blur-[100px]" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center text-indigo-300">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
              At a glance
            </p>
            <h2 className="text-white font-bold text-xl mt-1">
              Lecture Summary
            </h2>
          </div>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-8 max-w-4xl">
          {summary || 'No summary available yet.'}
        </p>
      </div>
    </section>
  )
}

export default SummaryCard
