
import { ArrowUp } from 'lucide-react'

function ChatInput({ value, onChange, onSend, onKeyDown }) {
  return (
    <div className="p-4 sm:p-6 border-t border-white/[0.07] bg-black/10">
      <div className="flex items-end gap-3 bg-[#0b0918] border border-white/10 rounded-2xl p-3 focus-within:border-indigo-500/50 transition-colors">
        <textarea
          value={value}
          onChange={event => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about your lecture..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-white text-sm placeholder:text-slate-600 px-2 py-2 outline-none max-h-32"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim()}
          className="w-10 h-10 shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition-colors"
          aria-label="Send message"
        >
          <ArrowUp size={19} />
        </button>
      </div>

      <div className="flex flex-wrap justify-between gap-3 mt-3 px-1">
        <p className="text-[10px] text-slate-600">
          Enter to send · Shift + Enter for a new line
        </p>

        <p className="text-[10px] text-slate-600">
          Demo responses · AI integration pending
        </p>
      </div>
    </div>
  )
}

export default ChatInput
