
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, Upload } from 'lucide-react'

function DashboardHeader() {
  return (
    <section className="pt-20 sm:pt-24 pb-14">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <Sparkles size={15} />
            Your learning workspace
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            My <span className="gradient-text">Lectures.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-8 mt-6 max-w-xl">
            Every lecture, every insight, all in one place.
            Pick up where you left off and keep learning at your own pace.
          </p>
        </div>

        <Link
          to="/upload"
          className="gradient-button inline-flex items-center justify-center gap-3 text-white font-semibold px-7 py-4 rounded-full shadow-xl shadow-indigo-600/25 shrink-0"
        >
          <Upload size={18} />
          Upload a lecture
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  )
}

export default DashboardHeader
