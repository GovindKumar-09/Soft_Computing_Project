
const capabilities = [
  'Drag and drop',
  'Timestamps',
  'Key points',
  'MP4 video',
  'MP3 audio',
  'WAV audio',
  'Ask anything',
  'Track progress',
  'Copy notes',
  'Revisit lectures',
  'Summarise',
  'Quiz yourself'
]

function FeatureTicker() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="marquee-shell">
        <div className="marquee-track">

          {/* First group */}
          <div className="marquee-group">
            {capabilities.map(item => (
              <span
                key={item}
                className="bg-slate-900/60 border border-white/10 px-4 py-2.5 rounded-full text-xs text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Duplicate group for seamless animation */}
          <div className="marquee-group" aria-hidden="true">
            {capabilities.map(item => (
              <span
                key={`duplicate-${item}`}
                className="bg-slate-900/60 border border-white/10 px-4 py-2.5 rounded-full text-xs text-slate-400 whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default FeatureTicker
