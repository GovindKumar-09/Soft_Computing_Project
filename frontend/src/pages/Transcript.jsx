
import { useMemo, useState } from 'react'

import sampleTranscript from '../data/sampleTranscript'

import TranscriptHeader from '../components/transcript/TranscriptHeader'
import TranscriptStats from '../components/transcript/TranscriptStats'
import TranscriptSearch from '../components/transcript/TranscriptSearch'
import TranscriptList from '../components/transcript/TranscriptList'
import LearningNavigation from '../components/transcript/LearningNavigation'

function Transcript() {
  const [search, setSearch] = useState('')
  const [activeSegment, setActiveSegment] = useState(null)
  const [copied, setCopied] = useState(false)

  // Search transcript
  const filteredTranscript = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return sampleTranscript

    return sampleTranscript.filter(segment =>
      (segment.text || '').toLowerCase().includes(term)
    )
  }, [search])

  // Prepare complete transcript text
  const fullTranscript = sampleTranscript
    .map(segment => `[${segment.time}] ${segment.text}`)
    .join('\n\n')

  // Copy transcript
  const copyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(fullTranscript)
      setCopied(true)

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Could not copy transcript:', error)
    }
  }

  // Highlight matching search text
  const highlightText = text => {
    if (!search.trim()) return text

    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
    const term = search.trim().toLowerCase()

    return parts.map((part, index) =>
      part.toLowerCase() === term ? (
        <mark
          key={index}
          className="bg-amber-400/25 text-amber-200 rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const handleSegmentSelect = segment => {
    setActiveSegment(segment.id)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-indigo-700/20 blur-[150px] rounded-full" />
        <div className="absolute top-[550px] -right-40 w-[450px] h-[450px] bg-violet-700/15 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        <TranscriptHeader
          copied={copied}
          onCopy={copyTranscript}
          subject="Operating Systems"
          duration="05:25"
        />

        <TranscriptStats
          segmentCount={sampleTranscript.length}
          duration="05:25"
        />

        <TranscriptSearch
          search={search}
          setSearch={setSearch}
          resultCount={filteredTranscript.length}
          totalCount={sampleTranscript.length}
        />

        <TranscriptList
          segments={filteredTranscript}
          totalCount={sampleTranscript.length}
          search={search}
          activeSegment={activeSegment}
          onSelect={handleSegmentSelect}
          highlightText={highlightText}
          copied={copied}
          onCopy={copyTranscript}
        />

        <LearningNavigation />

      </div>
    </div>
  )
}

export default Transcript
