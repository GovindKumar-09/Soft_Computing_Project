
import { useRef } from 'react'
import {
  Code2,
  BookOpen,
  ClipboardCheck,
  MessageCircle,
  ArrowUpRight,
  Search,
  Sparkles,
  CheckCircle2,
  Send
} from 'lucide-react'

import { Link } from 'react-router-dom'
import './FeatureGrid.css'

const features = [
  {
    id: 'transcript',
    number: '01',
    label: 'UNDERSTAND',
    title: 'Smart Transcripts',
    description:
      'Every lecture, transformed into searchable knowledge. Jump to the exact moment that matters.',
    icon: Code2,
    path: '/transcript',
    accent: 'from-violet-500 to-indigo-500',
    preview: 'transcript'
  },
  {
    id: 'summary',
    number: '02',
    label: 'SIMPLIFY',
    title: 'AI Summaries',
    description:
      'Turn lengthy lectures into concise notes, key concepts, and revision-ready takeaways.',
    icon: BookOpen,
    path: '/notes',
    accent: 'from-fuchsia-500 to-purple-500',
    preview: 'summary'
  },
  {
    id: 'quiz',
    number: '03',
    label: 'PRACTICE',
    title: 'Smart Quizzes',
    description:
      'Test what you have learned with AI-generated questions and track your progress.',
    icon: ClipboardCheck,
    path: '/quiz',
    accent: 'from-indigo-500 to-blue-500',
    preview: 'quiz'
  },
  {
    id: 'chat',
    number: '04',
    label: 'EXPLORE',
    title: 'Ask AI',
    description:
      'Ask questions about your lectures and get answers grounded in your learning material.',
    icon: MessageCircle,
    path: '/chat',
    accent: 'from-purple-500 to-pink-500',
    preview: 'chat'
  }
]

function TranscriptPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
        <Search size={14} className="text-violet-400" />
        <span className="text-xs text-white/40">
          Search in lecture...
        </span>
        <span className="ml-auto text-[10px] text-white/30">
          ⌘ K
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <span className="text-xs font-medium text-violet-400">
            02:14
          </span>
          <p className="text-xs leading-relaxed text-white/65">
            A binary tree is a hierarchical data structure...
          </p>
        </div>

        <div className="flex gap-3 rounded-lg border border-violet-400/20 bg-violet-500/[0.08] p-2">
          <span className="text-xs font-medium text-violet-300">
            04:38
          </span>
          <p className="text-xs leading-relaxed text-white/85">
            Each node can have at most two children.
          </p>
        </div>

        <div className="flex gap-3">
          <span className="text-xs font-medium text-violet-400">
            06:52
          </span>
          <p className="text-xs leading-relaxed text-white/50">
            Let's understand traversal techniques...
          </p>
        </div>
      </div>
    </div>
  )
}

function SummaryPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-fuchsia-400" />
        <span className="text-xs font-semibold text-white/80">
          Lecture Highlights
        </span>
      </div>

      {[
        'Binary trees contain nodes and edges.',
        'Each node has at most two children.',
        'Traversal includes inorder, preorder and postorder.'
      ].map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <CheckCircle2
            size={14}
            className="mt-0.5 shrink-0 text-fuchsia-400"
          />
          <p className="text-xs leading-relaxed text-white/65">
            {item}
          </p>
        </div>
      ))}

      <div className="rounded-lg bg-fuchsia-500/10 p-3">
        <p className="text-[10px] uppercase tracking-wider text-fuchsia-300">
          Quick revision
        </p>
        <p className="mt-1 text-xs text-white/70">
          3 key concepts extracted
        </p>
      </div>
    </div>
  )
}

function QuizPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/80">
          Knowledge Check
        </span>
        <span className="text-[10px] text-indigo-300">
          01 / 05
        </span>
      </div>

      <p className="text-sm font-medium leading-relaxed text-white/85">
        Which traversal visits the root node first?
      </p>

      {['Inorder', 'Preorder', 'Postorder'].map((option, index) => (
        <div
          key={option}
          className={`rounded-lg border px-3 py-2 text-xs ${
            index === 1
              ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-200'
              : 'border-white/10 bg-white/[0.03] text-white/50'
          }`}
        >
          <span className="mr-2 text-white/30">
            {String.fromCharCode(65 + index)}.
          </span>
          {option}

          {index === 1 && (
            <CheckCircle2
              size={13}
              className="float-right text-indigo-300"
            />
          )}
        </div>
      ))}
    </div>
  )
}

function ChatPreview() {
  return (
    <div className="space-y-3">
      <div className="ml-5 rounded-xl rounded-tr-sm border border-purple-400/20 bg-purple-500/15 p-3">
        <p className="text-xs leading-relaxed text-white/80">
          Explain binary tree traversal in simple words.
        </p>
      </div>

      <div className="mr-5 rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.05] p-3">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={13} className="text-purple-400" />
          <span className="text-[10px] font-semibold text-purple-300">
            AI ASSISTANT
          </span>
        </div>

        <p className="text-xs leading-relaxed text-white/65">
          Traversal means visiting every node in a tree. The three
          common methods are inorder, preorder and postorder.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
        <span className="flex-1 text-[10px] text-white/30">
          Ask a follow-up...
        </span>
        <Send size={13} className="text-purple-400" />
      </div>
    </div>
  )
}

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)
  const Icon = feature.icon

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse') return

    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateY = ((x - centerX) / centerX) * 9
    const rotateX = ((centerY - y) / centerY) * 9

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
      scale3d(1.015, 1.015, 1.015)
    `

    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  const handlePointerLeave = () => {
    const card = cardRef.current
    if (!card) return

    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0px)
      scale3d(1, 1, 1)
    `

    card.style.setProperty('--mouse-x', '50%')
    card.style.setProperty('--mouse-y', '50%')
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="neon-card group relative h-full min-h-[340px] rounded-[24px]"
      style={{
        '--neon-delay': `${index * 0.7}s`,
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {/* Inner card background */}
      <div
        className="neon-card__surface"
        style={{
          backgroundImage: `
            radial-gradient(
              350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(139, 92, 246, 0.13),
              transparent 65%
            )
          `
        }}
      />

      {/* Decorative ambient glow */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 z-[2] h-48 w-48 rounded-full bg-gradient-to-br ${feature.accent} opacity-[0.12] blur-[65px] transition-opacity duration-500 group-hover:opacity-25`}
      />

      {/* Card content */}
      <div
        className="relative z-10 flex h-full flex-col p-5"
        style={{ transform: 'translateZ(25px)' }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${feature.accent} bg-opacity-10 shadow-lg`}
          >
            <Icon size={21} className="text-white" />
          </div>

          <span className="text-xs font-medium tracking-[0.2em] text-white/25">
            {feature.number}
          </span>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.22em] text-violet-300">
            {feature.label}
          </p>

          <h3 className="text-2xl font-bold tracking-tight text-white">
            {feature.title}
          </h3>

          <p className="text-sm leading-6 text-white/50">
            {feature.description}
          </p>
        </div>

        {/* Feature preview */}
        <div className="relative mb-4 h-[125px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090711]/80 p-3">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.035] to-transparent" />

          <div className="relative">
            {feature.preview === 'transcript' && <TranscriptPreview />}
            {feature.preview === 'summary' && <SummaryPreview />}
            {feature.preview === 'quiz' && <QuizPreview />}
            {feature.preview === 'chat' && <ChatPreview />}
          </div>
        </div>

        <Link
          to={feature.path}
          className="flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-white/75 transition-colors hover:text-violet-300"
        >
          Explore feature

          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-all duration-300 group-hover:border-violet-400/40 group-hover:bg-violet-500/15">
            <ArrowUpRight size={16} />
          </span>
        </Link>
      </div>
    </div>
  )
}

function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-24 relative overflow-hidden px-5 py-24 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/[0.09] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2">
            <Sparkles size={13} className="text-violet-300" />

            <span className="text-[10px] font-semibold tracking-[0.2em] text-violet-200">
              YOUR LEARNING TOOLKIT
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            One platform.

            <span className="block bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Smarter learning.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-white/45 sm:text-base">
            Everything you need to turn recorded lectures into
            meaningful learning experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureGrid
