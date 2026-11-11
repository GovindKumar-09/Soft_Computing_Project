
import { motion } from 'motion/react'
import {
  Sparkles,
  CheckCircle2,
  Play,
  Brain,
  MessageCircle
} from 'lucide-react'

const neonGradient = `
  conic-gradient(
    from 0deg,
    transparent 0deg 300deg,
    rgba(99,102,241,0.3) 315deg,
    #8b5cf6 335deg,
    #c4b5fd 345deg,
    #22d3ee 352deg,
    transparent 360deg
  )
`

const neonTransition = {
  duration: 5.5,
  repeat: Infinity,
  ease: 'linear'
}

function WorkspacePreview() {
  const transcriptItems = [
    ['00:12', 'Introduction to process management'],
    ['01:34', 'Understanding process states'],
    ['02:48', 'Process Control Block (PCB)'],
    ['04:16', 'Context switching explained']
  ]

  return (
    <div className="relative">

      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-indigo-600/20 blur-[90px] rounded-full" />

      {/* Floating Workspace Card */}
      <motion.div
        className="relative isolate"
        animate={{ y: [-6, 6] }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      >

        {/* Soft Travelling Neon Glow */}
        <motion.div
          aria-hidden="true"
          className="absolute -inset-[5px] rounded-[30px] pointer-events-none opacity-45"
          style={{
            background: neonGradient,
            filter: 'blur(13px)'
          }}
          animate={{ rotate: 360 }}
          transition={neonTransition}
        />

        {/* Card Border */}
        <div className="relative isolate overflow-hidden rounded-3xl p-[1.5px] bg-violet-500/30">

          {/* Sharp Rotating Neon Beam */}
          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              width: '200%',
              height: '200%',
              top: '-50%',
              left: '-50%',
              background: neonGradient
            }}
            animate={{ rotate: 360 }}
            transition={neonTransition}
          />

          {/* Original Card Content */}
          <div className="relative z-10 bg-slate-900/95 border border-white/10 rounded-[22px] p-5 sm:p-7 backdrop-blur-xl shadow-2xl shadow-indigo-950/50">

            {/* Status Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
              <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-2 rounded-full font-medium">
                <Sparkles size={12} className="inline mr-1" />
                Quiz ready: 5 questions
              </span>

              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-2 rounded-full font-medium">
                <CheckCircle2 size={12} className="inline mr-1" />
                Completed
              </span>
            </div>

            {/* Preview Tabs */}
            <div className="flex items-center gap-5 border-b border-white/10 mb-5 overflow-x-auto">
              <span className="text-white text-xs font-semibold border-b-2 border-indigo-500 pb-3 whitespace-nowrap">
                Transcript
              </span>

              <span className="text-slate-500 text-xs pb-3 whitespace-nowrap">
                Summary
              </span>

              <span className="text-slate-500 text-xs pb-3 whitespace-nowrap">
                Quiz
              </span>

              <span className="text-slate-500 text-xs pb-3 whitespace-nowrap">
                AI Chat
              </span>
            </div>

            {/* Transcript Preview */}
            <div className="space-y-3">
              {transcriptItems.map((item, index) => (
                <div
                  key={item[0]}
                  className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.05] rounded-xl px-3 py-3"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />

                  <span className="text-indigo-300 text-xs font-mono">
                    {item[0]}
                  </span>

                  <span className="text-slate-300 text-xs flex-1">
                    {item[1]}
                  </span>

                  {index === 0 && (
                    <Play size={13} className="text-slate-500" />
                  )}
                </div>
              ))}
            </div>

            {/* AI Status */}
            <div className="mt-6 flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                <Brain size={18} />
              </div>

              <div>
                <p className="text-white text-xs font-semibold">
                  AI generated learning material
                </p>

                <p className="text-slate-500 text-[11px] mt-1">
                  Transcript, notes and quiz ready
                </p>
              </div>

              <CheckCircle2 size={17} className="ml-auto text-emerald-400" />
            </div>

          </div>
        </div>
      </motion.div>

      {/* Floating Notification */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 18,
          delay: 1.2
        }}
        className="hidden sm:flex absolute -bottom-7 -right-4 lg:-right-8 bg-amber-400 text-slate-950 text-xs font-bold px-5 py-4 rounded-xl shadow-2xl items-center gap-3 border border-amber-300"
      >
        <MessageCircle size={17} />
        "What is an array?" answered
      </motion.div>

    </div>
  )
}

export default WorkspacePreview
