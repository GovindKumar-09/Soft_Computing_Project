
import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

import ChatHeader from '../components/chat/ChatHeader'
import LectureSelector from '../components/chat/LectureSelector'
import ChatWindow from '../components/chat/ChatWindow'

import { getLectures } from '../services/lectureService'
import { authenticatedFetch } from '../services/authService'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const WELCOME_MESSAGE = {
  id: 1,
  role: 'assistant',
  text: "Hey! I'm your AI Study Tutor, grounded in your lecture content. Select a lecture above, then ask me anything — concepts, explanations, revision questions, or exam tips.",
  time: 'Just now'
}

function timestamp() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function Chat() {
  const params = useParams()
  const location = useLocation()

  // Resolve initial lecture ID from URL params or navigation state
  const initialLectureId =
    params.lectureId ||
    location.state?.lectureId ||
    location.state?.lecture?.id ||
    ''

  const [lectures, setLectures] = useState([])
  const [lecturesLoading, setLecturesLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(initialLectureId)

  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const abortRef = useRef(null)

  // Load available lectures on mount
  useEffect(() => {
    getLectures()
      .then(data => {
        const list = data.lectures || []
        setLectures(list)
        // Auto-select first lecture if none provided in URL
        if (!selectedId && list.length > 0) {
          setSelectedId(list[0].lectureId || list[0].id || '')
        }
      })
      .catch(err => console.error('Could not load lectures:', err))
      .finally(() => setLecturesLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When user changes lecture, reset conversation
  const handleSelectLecture = id => {
    setSelectedId(id)
    setMessages([WELCOME_MESSAGE])
    setInput('')
  }

  // Send a message to the RAG backend
  const sendMessage = useCallback(async (text = input) => {
    const question = text.trim()
    if (!question || sending) return

    if (!selectedId) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          text: 'Please select a lecture from the dropdown above before asking a question.',
          time: timestamp()
        }
      ])
      return
    }

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: question,
      time: timestamp()
    }

    const thinkingMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      text: '',
      thinking: true,
      time: timestamp()
    }

    setMessages(prev => [...prev, userMsg, thinkingMsg])
    setInput('')
    setSending(true)

    try {
      const response = await authenticatedFetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          video_id: selectedId
        }),
        signal: abortRef.current?.signal
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Chat request failed')
      }

      const aiMsg = {
        id: Date.now() + 2,
        role: 'assistant',
        text: data.answer || "I couldn't find relevant information in this lecture.",
        time: timestamp()
      }

      setMessages(prev => prev.filter(m => !m.thinking).concat(aiMsg))

    } catch (err) {
      if (err.name === 'AbortError') return

      const errorMsg = {
        id: Date.now() + 2,
        role: 'assistant',
        text: err.message?.includes('fetch') || err.message?.includes('connect')
          ? 'Could not reach the backend. Make sure the FastAPI server is running on port 8000.'
          : `Error: ${err.message}`,
        time: timestamp(),
        isError: true
      }

      setMessages(prev => prev.filter(m => !m.thinking).concat(errorMsg))
    } finally {
      setSending(false)
    }
  }, [input, selectedId, sending])

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE])
    setCopiedId(null)
    setInput('')
  }

  const copyMessage = async message => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopiedId(message.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (e) {
      console.error('Could not copy:', e)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-indigo-700/20 blur-[150px] rounded-full" />
        <div className="absolute top-[450px] -right-40 w-[450px] h-[450px] bg-violet-700/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">

        <ChatHeader />

        <LectureSelector
          lectures={lectures}
          loading={lecturesLoading}
          selectedId={selectedId}
          onSelect={handleSelectLecture}
          onClear={clearChat}
        />

        <ChatWindow
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={() => sendMessage()}
          onCopy={copyMessage}
          copiedId={copiedId}
          onSuggestion={sendMessage}
          sending={sending}
          hasLecture={!!selectedId}
        />

        <div className="py-8 flex justify-center">
          <p className="text-xs text-slate-600 flex items-center gap-2 text-center">
            <Sparkles size={13} className="text-indigo-400" />
            Answers are grounded exclusively in your uploaded lecture content.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Chat
