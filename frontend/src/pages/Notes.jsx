
import { useState } from 'react'

import sampleNotes from '../data/sampleNotes'

import NotesHeader from '../components/notes/NotesHeader'
import SummaryCard from '../components/notes/SummaryCard'
import ConceptCard from '../components/notes/ConceptCard'
import ImportantPoints from '../components/notes/ImportantPoints'
import RevisionAccordion from '../components/notes/RevisionAccordion'
import LearningLinks from '../components/notes/LearningLinks'

function Notes() {
  const [copied, setCopied] = useState(false)

  const notes = sampleNotes

  const concepts = notes.keyConcepts || []
  const points = notes.importantPoints || []
  const questions =
    notes.revision ||
    notes.quickRevision ||
    notes.revisionQuestions ||
    []

  const getText = item => {
    if (typeof item === 'string') return item

    return item.question || item.title || item.text || ''
  }

  const copyNotes = async () => {
    const content = [
      notes.title,
      notes.subject,
      '',
      'SUMMARY',
      notes.summary,
      '',
      'KEY CONCEPTS',
      ...concepts.map(getText),
      '',
      'IMPORTANT POINTS',
      ...points.map(getText),
      '',
      'REVISION QUESTIONS',
      ...questions.map(getText)
    ].join('\n')

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Could not copy notes:', error)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-indigo-700/20 blur-[150px] rounded-full" />
        <div className="absolute top-[550px] -right-40 w-[450px] h-[450px] bg-violet-700/15 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        <NotesHeader
          notes={notes}
          conceptsCount={concepts.length}
          copied={copied}
          onCopy={copyNotes}
        />

        <SummaryCard summary={notes.summary} />

        <section className="mb-12">
          <div className="mb-7">
            <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">
              Understand the fundamentals
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
              Key Concepts
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              The main ideas covered in your lecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {concepts.map((item, index) => (
              <ConceptCard
                key={index}
                item={item}
                index={index}
              />
            ))}
          </div>
        </section>

        <ImportantPoints points={points} />

        <RevisionAccordion questions={questions} />

        <LearningLinks />

      </div>
    </div>
  )
}

export default Notes
