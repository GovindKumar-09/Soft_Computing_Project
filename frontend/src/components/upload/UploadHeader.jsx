
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'

function UploadHeader() {
  return (
    <section className="pt-16 sm:pt-20 pb-12">
      <Link
        to="/lectures"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-9 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to lectures
      </Link>

      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-bold tracking-[0.2em] uppercase mb-6">
          <Sparkles size={15} />
          Start a new learning experience
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
          Upload your <span className="gradient-text">lecture.</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg leading-8 mt-6 max-w-2xl">
          Bring your recordings here. Turn long lectures into searchable
          transcripts, smart notes, interactive quizzes and conversations
          with your AI tutor.
        </p>
      </div>
    </section>
  )
}

export default UploadHeader
