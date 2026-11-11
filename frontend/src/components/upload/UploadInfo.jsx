
import {
  Sparkles,
  FileText,
  BookOpen,
  Clock,
  ShieldCheck
} from 'lucide-react'

const learningTools = [
  {
    icon: FileText,
    title: 'Smart transcript',
    description: 'Searchable text with timestamps.'
  },
  {
    icon: BookOpen,
    title: 'Detailed notes',
    description: 'Summaries and important concepts.'
  },
  {
    icon: Clock,
    title: 'Interactive quiz',
    description: 'Questions to test your understanding.'
  },
  {
    icon: Sparkles,
    title: 'AI study tutor',
    description: 'Ask questions about your lecture.'
  }
]

function UploadInfo() {
  return (
    <div className="space-y-6">

      <div className="glass-card p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
            <Sparkles size={21} />
          </div>

          <div>
            <h3 className="text-white font-bold">
              Your lecture becomes
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Four ways to learn
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {learningTools.map(item => {
            const Icon = item.icon

            return (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-300 shrink-0">
                  <Icon size={19} />
                </div>

                <div>
                  <h4 className="text-white text-sm font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 text-xs mt-1 leading-5">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/35 via-[#171126] to-[#0b0918] p-6">
        <ShieldCheck size={25} className="text-indigo-300 mb-5" />

        <h3 className="text-white text-lg font-bold">
          Your files, your learning
        </h3>

        <p className="text-slate-400 text-xs leading-6 mt-3">
          This demo currently validates files locally in your browser.
          Permanent storage and secure processing will be added with
          the backend.
        </p>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-white font-bold text-sm mb-4">
          Supported formats
        </h3>

        <div className="flex flex-wrap gap-2">
          {['MP4', 'MOV', 'WEBM', 'MP3', 'WAV', 'M4A'].map(format => (
            <span
              key={format}
              className="bg-white/[0.05] border border-white/10 text-slate-300 text-xs px-3 py-2 rounded-lg"
            >
              {format}
            </span>
          ))}
        </div>

        <p className="text-slate-500 text-xs mt-4">
          Maximum file size: 500 MB
        </p>
      </div>
    </div>
  )
}

export default UploadInfo
