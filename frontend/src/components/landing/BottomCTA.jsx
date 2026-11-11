
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

function BottomCTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden cta-gradient rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-600/20"
      >
        <div className="absolute -top-28 -right-20 w-80 h-80 bg-violet-400/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 -left-20 w-72 h-72 bg-indigo-900/40 rounded-full blur-3xl" />

        <div className="relative max-w-xl">
          <span className="text-indigo-200 text-xs font-bold tracking-widest uppercase">
            Start learning differently
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 leading-tight">
            Your next lecture is ready to be understood.
          </h2>
        </div>

        <Link
          to="/register"
          className="relative shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-4 rounded-full text-sm sm:text-base whitespace-nowrap shadow-lg transition-all hover:scale-105 flex items-center gap-2 pulse-ring"
        >
          Create free account
          <ArrowRight size={18} />
        </Link>
      </motion.div>
    </section>
  )
}

export default BottomCTA
