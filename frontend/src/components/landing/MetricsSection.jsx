
import AnimatedCounter from '../motion/AnimatedCounter'

const metrics = [
  {
    value: 4,
    suffix: ' tools',
    description: 'Transcript, summary, quiz and chat for every lecture',
    accent: false
  },
  {
    value: 2,
    suffix: ' summaries',
    description: 'Short for revision, detailed for deep study',
    accent: false
  },
  {
    value: 1,
    suffix: ' upload',
    description: 'Everything else is generated for you',
    accent: true
  }
]

function MetricsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {metrics.map(item => (
          <div
            key={item.suffix}
            className={`rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 ${
              item.accent
                ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40'
                : 'bg-slate-900/40 border-white/10 hover:border-indigo-500/40'
            }`}
          >
            <h3 className="text-3xl font-extrabold text-white mb-2">
              <AnimatedCounter
                value={item.value}
                suffix={item.suffix}
              />
            </h3>

            <p className={`text-xs leading-6 ${
              item.accent ? 'text-indigo-100' : 'text-slate-400'
            }`}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MetricsSection
