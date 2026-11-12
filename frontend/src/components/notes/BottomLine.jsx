
import { Sparkles } from 'lucide-react'

function BottomLine({ text }) {
  if (!text) return null

  return (
    <section className="mb-12">

      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-950/70 via-indigo-950/60 to-[#100c20] p-6 sm:p-8">

        <div className="absolute -right-10 -top-16 w-56 h-56 bg-violet-500/15 blur-[80px] rounded-full" />

        <div className="relative">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-400/20 flex items-center justify-center text-violet-300">
              <Sparkles size={20} />
            </div>

            <div>
              <p className="text-violet-300 text-xs font-bold uppercase tracking-widest">
                The big picture
              </p>

              <h2 className="text-white text-xl font-bold mt-1">
                Bottom Line
              </h2>
            </div>

          </div>

          <p className="text-slate-200 text-sm sm:text-base leading-8 whitespace-pre-wrap max-w-4xl">
            {text}
          </p>

        </div>
      </div>
    </section>
  )
}

export default BottomLine
