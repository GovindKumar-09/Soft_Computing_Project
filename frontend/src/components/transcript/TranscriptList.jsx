
import { Check, Copy, Search } from 'lucide-react'
import TranscriptSegment from './TranscriptSegment'

function TranscriptList({
  segments,
  totalCount,
  search,
  activeSegment,
  onSelect,
  highlightText,
  copied,
  onCopy
}) {
  return (
    <section className="glass-card overflow-hidden mb-10">

      {/* HEADER */}
      <div className="px-5 sm:px-7 py-5 border-b border-white/[0.07] flex items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-lg">
            Lecture transcript
          </h2>

          <p className="text-slate-500 text-xs mt-1">
            Select any segment to highlight it.
          </p>
        </div>

        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full px-3 py-2 font-semibold">
          <Check size={12} className="inline mr-1" />
          Ready
        </span>
      </div>

      {/* SEGMENTS */}
      <div className="p-4 sm:p-7">
        {segments.length > 0 ? (
          <div className="space-y-3">
            {segments.map((segment, index) => (
              <TranscriptSegment
                key={segment.id}
                segment={segment}
                index={index}
                selected={activeSegment === segment.id}
                onSelect={onSelect}
                highlightText={highlightText}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Search size={30} className="text-slate-600 mx-auto mb-5" />

            <h3 className="text-white font-bold text-lg">
              No matching text
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              Try another search term.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-5 sm:px-7 py-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-500 text-xs">
          Showing {segments.length} of {totalCount} segments
        </p>

        <button
          type="button"
          onClick={onCopy}
          className="text-xs text-indigo-300 hover:text-white font-semibold flex items-center gap-2"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy all text'}
        </button>
      </div>
    </section>
  )
}

export default TranscriptList
