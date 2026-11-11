
import { Link } from 'react-router-dom'
import { FileText, Brain, MessageCircle, ArrowRight } from 'lucide-react'

const links = [
  {
    path: '/transcript',
    title: 'Transcript',
    description: 'Revisit the original lecture text and timestamps.',
    action: 'Read transcript',
    icon: FileText,
    color: 'text-indigo-300',
    border: 'hover:border-indigo-500/40'
  },
  {
    path: '/quiz',
    title: 'Take a quiz',
    description: 'Check your understanding with interactive questions.',
    action: 'Test yourself',
    icon: Brain,
    color: 'text-amber-300',
    border: 'hover:border-amber-400/40'
  },
  {
    path: '/chat',
    title: 'Ask AI Tutor',
    description: 'Ask questions and explore difficult concepts.',
    action: 'Start chatting',
    icon: MessageCircle,
    color: 'text-violet-300',
    border: 'hover:border-violet-400/40'
  }
]

function LearningLinks() {
  return (
    <section className="pb-24">
      <div className="mb-7">
        <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">
          What's next?
        </p>
        <h2 className="text-2xl font-bold text-white mt-3">
          Continue learning.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {links.map(item => {
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group glass-card p-6 transition-all ${item.border}`}
            >
              <Icon size={24} className={`${item.color} mb-5`} />

              <h3 className="text-white font-bold">{item.title}</h3>

              <p className="text-slate-400 text-xs leading-6 mt-3">
                {item.description}
              </p>

              <span className={`inline-flex items-center gap-2 ${item.color} text-xs font-semibold mt-5 group-hover:gap-3 transition-all`}>
                {item.action} <ArrowRight size={14} />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default LearningLinks
