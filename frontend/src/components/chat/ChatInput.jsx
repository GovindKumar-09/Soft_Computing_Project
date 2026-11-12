
import { ArrowUp, Loader2 } from 'lucide-react'

function ChatInput({ value, onChange, onSend, onKeyDown, sending, hasLecture }) {
  return (
    <div className="p-4 sm:p-6 border-t border-white/[0.07] bg-black/10">
      <div className={`flex items-end gap-3 bg-[#0b0918] border rounded-2xl p-3 transition-colors ${
        hasLecture
          ? 'border-white/10 focus-within:border-indigo-500/50'
          : 'border-white/5 opacity-60'
      }`}>
        <textarea
          value={value}
          onChange={event => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={hasLecture ? 'Ask anything about your lecture…' : 'Select a lecture above to start chatting…'}
          disabled={!hasLecture || sending}
          rows={1}
          className="flex-1 resize-none bg-transparent text-white text-sm placeholder:text-slate-600 px-2 py-2 outline-none max-h-32 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || !hasLecture || sending}
          className="w-10 h-10 shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition-colors"
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <ArrowUp size={19} />
          )}
        </button>
      </div>

      <div className="flex flex-wrap justify-between gap-3 mt-3 px-1">
        <p className="text-[10px] text-slate-600">
          Enter to send · Shift + Enter for new line
        </p>
        <p className="text-[10px] text-slate-600">
          {sending ? 'AI is thinking…' : 'Grounded in your lecture content'}
        </p>
      </div>
    </div>
  )
}

export default ChatInput
