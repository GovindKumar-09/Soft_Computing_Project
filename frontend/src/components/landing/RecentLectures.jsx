
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Upload,
  Layers3,
  Brain,
  Code2
} from 'lucide-react'

const demoLectures = [
  {
    title: 'DBMS Lecture',
    subject: 'Database Management Systems',
    status: 'Completed',
    icon: Layers3,
    color: 'text-indigo-400',
    bg: 'from-indigo-600/30 to-violet-900/20'
  },
  {
    title: 'Database',
    subject: 'Database Fundamentals',
    status: 'Processing',
    icon: Brain,
    color: 'text-amber-400',
    bg: 'from-amber-500/20 to-orange-900/20'
  },
  {
    title: 'Operating System',
    subject: 'Process Management',
    status: 'Completed',
    icon: Code2,
    color: 'text-violet-400',
    bg: 'from-violet-600/30 to-purple-900/20'
  }
]

function RecentLectures() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 mb-24"
    >
      <div className="bg-slate-100 text-slate-900 py-12 sm:py-16 px-6 sm:px-10 lg:px-12 rounded-[2rem] sm:rounded-[2.5rem]">

        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <span className="text-indigo-600 font-bold text-xs tracking-widest uppercase">
              Your learning library
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">
              Pick up where you left off
            </h2>

            <p className="text-slate-600 text-sm mt-3">
              Your lectures stay in one place, with their status.
            </p>
          </div>

          <Link
            to="/lectures"
            className="inline-flex items-center gap-2 text-indigo-700 font-semibold text-sm hover:gap-3 transition-all"
          >
            View all lectures <ArrowRight size={17} />
          </Link>
        </div>

        {/* LECTURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {demoLectures.map((lecture, index) => {
            const Icon = lecture.icon

            return (
              <motion.article
                key={lecture.title}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className={`h-32 bg-gradient-to-br ${lecture.bg} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute w-36 h-36 bg-white/10 rounded-full blur-2xl" />

                  <div className="relative w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Icon size={27} className={lecture.color} />
                  </div>

                  <span className={`absolute top-3 right-3 text-[10px] font-semibold px-3 py-1 rounded-full ${
                    lecture.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {lecture.status}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-slate-900 font-bold">
                    {lecture.title}
                  </h3>

                  <p className="text-slate-500 text-xs mt-2">
                    {lecture.subject}
                  </p>

                  <Link
                    to="/lectures"
                    className="mt-5 flex items-center justify-between text-xs text-indigo-700 font-semibold"
                  >
                    View lecture <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.article>
            )
          })}

          {/* UPLOAD CARD */}
          <Link
            to="/upload"
            className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all min-h-60"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Upload size={22} />
            </div>

            <h3 className="font-bold text-slate-900">
              Upload new lecture
            </h3>

            <p className="text-slate-500 text-xs mt-2 leading-5">
              Add a video or audio file to start learning.
            </p>

            <span className="bg-indigo-600 text-white text-xs font-semibold px-5 py-2.5 rounded-lg mt-5">
              Choose file
            </span>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

export default RecentLectures
