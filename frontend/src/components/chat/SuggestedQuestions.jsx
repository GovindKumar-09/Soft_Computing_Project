
import {
  Brain,
  BookOpen,
  Lightbulb,
  FileText,
  ArrowUp
} from 'lucide-react'

const suggestions = [
  {
    icon: Brain,
    title: 'Explain process states',
    prompt: 'Explain the different states of a process with an example.'
  },
  {
    icon: BookOpen,
    title: 'What is a PCB?',
    prompt: 'Explain Process Control Block (PCB) in simple words.'
  },
  {
    icon: Lightbulb,
    title: 'Context switching',
    prompt: 'What is context switching and why is it needed?'
  },
  {
    icon: FileText,
    title: 'Revision questions',
    prompt: 'Give me 5 important revision questions from this lecture.'
  }
]

function SuggestedQuestions({ onSelect }) {
  return (
    <div className="px-5 sm:px-7 pb-6">
      <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
        Try asking
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map(suggestion => {
          const Icon = suggestion.icon

          return (
            <button
              type="button"
              key={suggestion.title}
              onClick={() => onSelect(suggestion.prompt)}
              className="flex items-center gap-3 text-left bg-white/[0.03] border border-white/[0.07] hover:bg-indigo-500/10 hover:border-indigo-500/30 rounded-xl px-4 py-3 transition-all group"
            >
              <Icon size={17} className="text-indigo-300 shrink-0" />

              <span className="text-xs text-slate-300 group-hover:text-white">
                {suggestion.title}
              </span>

              <ArrowUp size={14} className="ml-auto text-slate-600 group-hover:text-indigo-300 rotate-45" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SuggestedQuestions
