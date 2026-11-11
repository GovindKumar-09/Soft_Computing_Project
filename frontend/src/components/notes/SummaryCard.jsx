
import { Sparkles, BookOpen } from 'lucide-react'

function SummaryCard({ summary, summaryData = {} }) {
  const mainTopic =
    summaryData.main_topic ||
    summaryData.mainTopic ||
    ''

  const overview =
    summaryData.overview ||
    summary ||
    ''

  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/70 via-[#17112d] to-[#0d0b1b] p-6 sm:p-9 mb-8">

      <div className="absolute -top-24 -right-16 w-72 h-72 bg-indigo-500/15 rounded-full blur-[100px]" />

      <div className="relative">

        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center text-indigo-300">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
              Your lecture, simplified
            </p>

            <h2 className="text-white font-bold text-xl mt-1">
              Episode Summary
            </h2>
          </div>
        </div>

        {mainTopic && (
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-indigo-300" />

              <h3 className="text-indigo-300 text-xs font-bold tracking-widest uppercase">
                Main Topic
              </h3>
            </div>

            <p className="text-white text-lg sm:text-xl font-semibold leading-8">
              {mainTopic}
            </p>
          </div>
        )}

        {overview && (
          <div className={mainTopic ? 'border-t border-white/10 pt-6' : ''}>
            <h3 className="text-slate-300 text-xs font-bold tracking-widest uppercase mb-3">
              Overview
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-8 max-w-4xl whitespace-pre-wrap">
              {overview}
            </p>
          </div>
        )}

        {!mainTopic && !overview && (
          <p className="text-slate-400 text-sm">
            No summary available yet.
          </p>
        )}

      </div>
    </section>
  )
}

export default SummaryCard
