
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'

function ChatHeader() {
  return (
    <section className="pt-16 sm:pt-20 pb-10">
      <Link
        to="/lectures"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to lectures
      </Link>

      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
          <Sparkles size={14} />
          Your personal study companion
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Ask. Understand. <span className="gradient-text">Learn.</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-7 mt-5 max-w-xl mx-auto">
          Get explanations, clear your doubts and explore concepts
          from your lecture through conversation.
        </p>
      </div>
    </section>
  )
}

export default ChatHeader
