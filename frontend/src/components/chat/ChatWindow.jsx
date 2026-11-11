
import { useEffect, useRef } from 'react'
import { Bot, GraduationCap } from 'lucide-react'

import ChatMessage from './ChatMessage'
import SuggestedQuestions from './SuggestedQuestions'
import ChatInput from './ChatInput'

function ChatWindow({
  messages,
  input,
  setInput,
  onSend,
  onCopy,
  copiedId,
  onSuggestion
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <section className="bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-black/20">

      {/* CHAT HEADER */}
      <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot size={22} className="text-white" />
          </div>

          <div>
            <h2 className="text-white text-sm font-bold">
              AI Study Tutor
            </h2>
            <p className="text-emerald-400 text-[10px] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Interface ready
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 border border-white/10 rounded-full px-3 py-2">
          <GraduationCap size={13} className="inline mr-1" />
          Learning mode
        </span>
      </div>

      {/* MESSAGE LIST */}
      <div className="h-[480px] sm:h-[540px] overflow-y-auto p-5 sm:p-7 space-y-7">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            onCopy={onCopy}
            copied={copiedId === message.id}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* SUGGESTED QUESTIONS */}
      {messages.length === 1 && (
        <SuggestedQuestions onSelect={onSuggestion} />
      )}

      {/* MESSAGE INPUT */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={onSend}
        onKeyDown={handleKeyDown}
      />
    </section>
  )
}

export default ChatWindow
