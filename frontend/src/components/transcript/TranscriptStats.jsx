
import { FileText, Clock, Check } from 'lucide-react'

function TranscriptStats({ segmentCount, duration }) {
  const stats = [
    {
      title: 'Transcript segments',
      value: segmentCount,
      icon: FileText,
      color: 'text-indigo-300',
      background: 'bg-indigo-500/15'
    },
    {
      title: 'Lecture duration',
      value: duration,
      icon: Clock,
      color: 'text-violet-300',
      background: 'bg-violet-500/15'
    },
    {
      title: 'Transcription status',
      value: 'Completed',
      icon: Check,
      color: 'text-emerald-400',
      background: 'bg-emerald-500/10'
    }
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-9">
      {stats.map(stat => {
        const Icon = stat.icon

        return (
          <div
            key={stat.title}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.background} ${stat.color}`}>
              <Icon size={21} />
            </div>

            <div>
              <p className="text-slate-500 text-xs">{stat.title}</p>
              <h3 className={`text-xl font-bold mt-1 ${stat.title === 'Transcription status' ? 'text-emerald-400' : 'text-white'}`}>
                {stat.value}
              </h3>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default TranscriptStats
