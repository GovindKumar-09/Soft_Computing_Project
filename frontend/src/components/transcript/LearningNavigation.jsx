
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Brain } from 'lucide-react'

const learningLinks = [
  {
    path: '/notes',
    title: 'Explore smart notes',
    description: 'Review key concepts, important points and concise explanations.',
    action: 'Read notes',
    icon: BookOpen,
    color: 'text-indigo-300',
    border: 'hover:border-indigo-500/40'
  },
  {
    path: '/quiz',
    title: 'Test your knowledge',
    description: 'Attempt interactive questions and check your understanding.',
    action: 'Take a quiz',
    icon: Brain,
    color: 'text-amber-300',
    border: 'hover:border-amber-400/40'
  }
]

function LearningNavigation() {
  return (
    <section className="pb-24">
      <div className="mb-7">
        <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">
          Continue learning
        </p>

        <h2 className="text-2xl font-bold text-white mt-3">
          Go beyond the transcript.
        </h2>

        <p className="text-slate-500 text-sm mt-2">
          Turn this lecture into more ways to understand and revise.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {learningLinks.map(item => {
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group glass-card p-6 sm:p-7 transition-all ${item.border}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center ${item.color}`}>
                  <Icon size={23} />
                </div>

                <ArrowRight
                  size={19}
                  className="text-slate-500 group-hover:translate-x-1 group-hover:text-indigo-300 transition-all"
                />
              </div>

              <h3 className="text-white font-bold text-lg">
                {item.title}
              </h3>

              <p className="text-slate-400 text-xs leading-6 mt-3">
                {item.description}
              </p>

              <span className={`inline-flex items-center gap-2 ${item.color} text-xs font-semibold mt-5`}>
                {item.action} <ArrowRight size={14} />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default LearningNavigation
