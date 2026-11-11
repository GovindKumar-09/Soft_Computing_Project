
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  Code2,
  BookOpen,
  Brain,
  MessageCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react'

function FeatureCard({ feature, cardVariants }) {
  const Icon = feature.icon

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -10,
        rotateX: 2,
        scale: 1.01
      }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20
      }}
      style={{ transformPerspective: 1000 }}
      className="group bg-slate-900/50 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(108,59,255,0.2)] transition-colors duration-300 flex flex-col"
    >
      {/* PREVIEW BOX */}
      <div className="relative bg-slate-950/80 border border-white/5 rounded-xl p-4 mb-6 h-44 flex flex-col justify-between overflow-hidden">

        {/* TRANSCRIPT PREVIEW */}
        {feature.type === 'transcript' && (
          <>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <Code2 size={20} />
              </div>
              <span className="text-[10px] text-emerald-400">
                ● Live transcript
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-indigo-300 font-mono">
                00:12 <span className="text-slate-400">Process management...</span>
              </p>
              <p className="text-[10px] text-indigo-300 font-mono">
                01:34 <span className="text-slate-400">Process states...</span>
              </p>
              <p className="text-[10px] text-indigo-300 font-mono">
                02:48 <span className="text-slate-400">PCB structure...</span>
              </p>
            </div>

            {/* Transcript shimmer */}
            <div className="absolute inset-0 preview-shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </>
        )}

        {/* SUMMARY PREVIEW */}
        {feature.type === 'summary' && (
          <>
            <div className="flex items-center gap-2 text-amber-300">
              <BookOpen size={19} />
              <span className="text-xs font-bold">Key concepts</span>
            </div>

            <div className="bg-amber-50/10 border border-amber-300/20 p-3 rounded-lg space-y-3">
              <p className="text-amber-200 text-xs font-semibold">
                01. Process states
              </p>
              <p className="text-amber-100/70 text-[10px]">
                02. Process Control Block
              </p>
              <p className="text-amber-100/70 text-[10px]">
                03. Context switching
              </p>
            </div>
          </>
        )}

        {/* QUIZ PREVIEW */}
        {feature.type === 'quiz' && (
          <>
            <p className="text-white text-xs font-bold">
              Q1. What is an array?
            </p>

            <div className="space-y-2">
              <div className="quiz-choice-active px-3 py-2 rounded-lg text-[10px] bg-amber-300 text-slate-950 font-semibold">
                A. Collection of elements
              </div>

              <div className="px-3 py-2 rounded-lg text-[10px] bg-white/5 text-slate-400">
                B. A loop
              </div>

              <div className="px-3 py-2 rounded-lg text-[10px] bg-white/5 text-slate-400">
                C. A function
              </div>
            </div>
          </>
        )}

        {/* AI CHAT PREVIEW */}
        {feature.type === 'chat' && (
          <>
            <div className="bg-indigo-950/80 border border-indigo-500/30 rounded-lg p-3">
              <p className="text-indigo-200 text-[10px]">
                What is an array?
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-3 ml-5 overflow-hidden">
              <p className="typing-preview text-slate-300 text-[10px] leading-5">
                An array stores multiple elements of the same type...
              </p>
            </div>

            <div className="flex items-center gap-2 text-indigo-300 text-[10px]">
              <Sparkles size={13} />
              Lecture-aware AI response
            </div>
          </>
        )}
      </div>

      {/* FEATURE TITLE */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-300">
          <Icon size={19} />
        </div>

        <h3 className="text-lg font-bold text-white">
          {feature.title}
        </h3>
      </div>

      {/* DESCRIPTION */}
      <p className="text-slate-400 text-xs leading-6 mb-5 flex-1">
        {feature.description}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-5">
        {feature.tags.map(tag => (
          <span
            key={tag}
            className="text-[10px] text-slate-400 border border-white/10 px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ACTION */}
      <Link
        to={feature.path}
        className="w-full bg-white text-slate-950 font-semibold py-3 rounded-xl text-sm text-center hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
      >
        {feature.action}
        <ChevronRight size={15} />
      </Link>
    </motion.article>
  )
}

export default FeatureCard
