
import { useState } from 'react'
import { Sparkles } from 'lucide-react'

import ChatHeader from '../components/chat/ChatHeader'
import LectureSelector from '../components/chat/LectureSelector'
import ChatWindow from '../components/chat/ChatWindow'

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: "Hey! I'm your AI Study Tutor. Ask me anything about your lecture. I can explain concepts, simplify difficult topics, or help you prepare for exams.",
    time: 'Just now'
  }
]

function getDemoResponse(question) {
  const q = question.toLowerCase()

  if (q.includes('process state') || q.includes('states of a process')) {
    return `A process moves through different states during its life cycle.

1. New — The process is being created.
2. Ready — It is waiting for CPU allocation.
3. Running — The CPU is executing the process.
4. Waiting — It is waiting for an event, such as I/O completion.
5. Terminated — The process has finished execution.

Example: When you open a browser, it is created, waits for CPU time, runs when scheduled, and may wait while loading a webpage.

Remember: The operating system manages these transitions using the process scheduler.`
  }

  if (q.includes('pcb') || q.includes('control block')) {
    return `A Process Control Block (PCB) is a data structure maintained by the operating system for every process.

It stores important information such as:

1. Process ID — Unique process identification.
2. Process state — Ready, running, waiting, etc.
3. Program counter — Address of the next instruction.
4. CPU registers — Values needed to resume execution.
5. Scheduling information — Priority and scheduling details.
6. Memory information — Details about allocated memory.

Think of a PCB as the identity card and record file of a process.`
  }

  if (q.includes('context switch')) {
    return `Context switching is the process of saving the state of one running process and loading the saved state of another process.

How it works:

1. The CPU stops executing the current process.
2. The OS saves its current state in its PCB.
3. The scheduler selects another process.
4. The OS restores that process's saved state.
5. The CPU resumes its execution.

Example: The OS switches CPU execution between your browser and music player.

Context switching enables multitasking, but saving and restoring state creates overhead.`
  }

  if (
    q.includes('revision') ||
    q.includes('questions') ||
    q.includes('quiz')
  ) {
    return `Here are 5 useful revision questions from Operating Systems:

1. What are the different states of a process?
2. What is a Process Control Block (PCB)?
3. Explain context switching.
4. Differentiate between a process and a program.
5. What is the role of a process scheduler?

Try answering them without looking at your notes.`
  }

  if (
    q.includes('summary') ||
    q.includes('summarize') ||
    q.includes('summarise')
  ) {
    return `Quick summary — Process Management:

• A process is a program currently in execution.
• Each process has its own PCB.
• A process moves through New, Ready, Running, Waiting and Terminated states.
• The CPU scheduler selects a process for execution.
• Context switching allows the OS to switch between processes.

Key exam point: The PCB stores information needed by the OS to manage and resume processes.`
  }

  if (q.includes('simple') || q.includes('example')) {
    return `Let's understand it with a simple example.

Imagine you are studying while listening to music on your laptop.

The operating system manages both applications. It decides which process gets CPU time, saves their execution states and switches between them.

This is how multitasking works.

Tell me which specific concept you want to understand, and I can break it down step by step.`
  }

  return `Good question!

I'm currently running in demo mode, so I can answer a few sample Operating Systems topics:

• Process states
• Process Control Block (PCB)
• Context switching
• Process management revision

For your question, the real lecture-aware AI tutor needs to be connected to our backend and Gemini API.`
}

function Chat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [lecture, setLecture] = useState(
    'Operating Systems — Process Management'
  )
  const [copiedId, setCopiedId] = useState(null)

  // Send a message
  const sendMessage = (text = input) => {
    const question = text.trim()

    if (!question) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: question,
      time: 'Just now'
    }

    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      text: getDemoResponse(question),
      time: 'Just now'
    }

    setMessages(previous => [
      ...previous,
      userMessage,
      assistantMessage
    ])

    setInput('')
  }

  // Clear conversation
  const clearChat = () => {
    setMessages(initialMessages)
    setCopiedId(null)
  }

  // Copy assistant response
  const copyMessage = async message => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopiedId(message.id)
    } catch (error) {
      console.error('Could not copy message:', error)
      setCopiedId(null)
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
          lecture={lecture}
          setLecture={setLecture}
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
        />

        <div className="py-8 flex justify-center">
          <p className="text-xs text-slate-600 flex items-center gap-2 text-center">
            <Sparkles size={13} className="text-indigo-400" />
            Your learning assistant, designed around your lectures.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Chat
