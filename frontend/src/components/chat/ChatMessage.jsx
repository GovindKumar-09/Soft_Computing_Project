
import {
  Bot,
  GraduationCap,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react'

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

function ChatMessage({ message, onCopy, copied }) {
  const isUser = message.role === 'user'
  const isError = message.isError
  const isThinking = message.thinking

  return (
    <div className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {!isUser && (
        <div className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center ${
          isError
            ? 'bg-red-500/15 border-red-500/20 text-red-400'
            : 'bg-indigo-500/15 border-indigo-500/20 text-indigo-300'
        }`}>
          {isError ? <AlertCircle size={19} /> : <Bot size={19} />}
        </div>
      )}

      <div className={`max-w-[88%] sm:max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div className={`rounded-2xl px-4 sm:px-5 py-4 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : isError
              ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-tl-sm'
              : 'bg-white/[0.05] border border-white/[0.07] text-slate-200 rounded-tl-sm'
        }`}>
          {isThinking ? (
            <ThinkingDots />
          ) : (
            <p className="text-sm leading-7 whitespace-pre-wrap break-words">
              {message.text}
            </p>
          )}
        </div>

        <div className={`flex items-center gap-3 mt-2 text-[10px] text-slate-500 ${isUser ? 'justify-end' : ''}`}>
          <span>{isUser ? 'You' : 'AI Tutor'}</span>
          <span>•</span>
          <span>{message.time}</span>

          {!isUser && !isThinking && !isError && (
            <button
              type="button"
              onClick={() => onCopy(message)}
              className="hover:text-white transition-colors flex items-center gap-1"
              title="Copy response"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-9 h-9 shrink-0 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
          <GraduationCap size={19} />
        </div>
      )}
    </div>
  )
}

export default ChatMessage
