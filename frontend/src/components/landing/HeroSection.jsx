
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react'
import WorkspacePreview from './WorkspacePreview'

const headlineVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.15
    }
  }
}

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: 'blur(8px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

function HeroSection() {
  const animatedWords = ['Turn', 'any', 'lecture', 'into']

  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">

      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-32 right-0 w-80 h-80 bg-violet-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-7">

          <div className="inline-flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-[0.2em] uppercase mb-7">
            <Sparkles size={15} />
            Upload. Learn. Ask. Grow.
          </div>

          <motion.h1
            variants={headlineVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl lg:text-[66px] font-extrabold text-white leading-[1.13] tracking-tight mb-8"
          >
            {animatedWords.map(word => (
              <motion.span
                key={word}
                variants={wordVariants}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}

            <motion.span
              variants={wordVariants}
              className="inline-block border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded-xl text-amber-300 mr-2"
            >
              notes, quizzes
            </motion.span>

            <motion.span variants={wordVariants} className="inline-block mr-[0.25em]">
              and
            </motion.span>

            <motion.span variants={wordVariants} className="inline-block">
              answers.
            </motion.span>
          </motion.h1>

          <p className="text-slate-400 text-base sm:text-lg leading-8 max-w-xl mb-10">
            Drop in a video or audio file. Get a timestamped transcript,
            a summary, a quiz and an AI tutor that knows your lecture.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/upload"
              className="gradient-button inline-flex items-center gap-3 text-white font-semibold px-7 py-4 rounded-full text-sm sm:text-base shadow-xl shadow-indigo-600/30"
            >
              Start learning
              <ArrowRight size={19} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-3 border border-white/15 hover:border-white/40 text-slate-200 font-medium px-7 py-4 rounded-full text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              <Play size={17} />
              Explore features
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-12 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              One upload, four tools
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Learn at your own pace
            </span>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-5">
          <WorkspacePreview />
        </div>

      </div>
    </section>
  )
}

export default HeroSection
