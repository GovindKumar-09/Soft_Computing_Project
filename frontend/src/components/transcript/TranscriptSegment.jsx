
import { Check, Play } from 'lucide-react'

function TranscriptSegment({
  segment,
  index,
  selected,
  onSelect,
  highlightText
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(segment)}
      className={`w-full text-left flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border transition-all ${
        selected
          ? 'bg-indigo-500/10 border-indigo-400/40 shadow-lg shadow-indigo-950/20'
          : 'bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15'
      }`}
    >
      <div className="flex flex-col items-center gap-2 shrink-0">
        <span className={`text-xs font-mono font-semibold ${
          selected ? 'text-indigo-300' : 'text-slate-500'
        }`}>
          {segment.time}
        </span>

        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          selected
            ? 'bg-indigo-500 text-white'
            : 'bg-white/[0.05] text-slate-500'
        }`}>
          {selected
            ? <Play size={13} fill="currentColor" />
            : <span className="text-[10px]">{index + 1}</span>
          }
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm sm:text-[15px] leading-7 ${
          selected ? 'text-white' : 'text-slate-300'
        }`}>
          {highlightText(segment.text)}
        </p>

        {selected && (
          <div className="flex items-center gap-2 text-indigo-300 text-[10px] font-semibold mt-3">
            <Check size={12} />
            Selected segment
          </div>
        )}
      </div>
    </button>
  )
}

export default TranscriptSegment
