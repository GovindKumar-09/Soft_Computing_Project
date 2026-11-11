
import { useEffect, useState } from 'react'
import {
  useLocation,
  useParams,
  useSearchParams
} from 'react-router-dom'

import {
  LoaderCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

import {
  getLectures,
  getLectureSummary
} from '../services/lectureService'

import NotesHeader from '../components/notes/NotesHeader'
import SummaryCard from '../components/notes/SummaryCard'
import ConceptCard from '../components/notes/ConceptCard'
import ImportantPoints from '../components/notes/ImportantPoints'
import RevisionAccordion from '../components/notes/RevisionAccordion'
import LearningLinks from '../components/notes/LearningLinks'
import NotableExamples from '../components/notes/NotableExamples'
import BottomLine from '../components/notes/BottomLine'

function Notes() {
  const location = useLocation()
  const params = useParams()
  const [searchParams] = useSearchParams()

  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState(null)

  const requestedLectureId =
    params.lectureId ||
    params.id ||
    searchParams.get('lectureId') ||
    searchParams.get('id') ||
    location.state?.lectureId ||
    location.state?.lecture?.id ||
    location.state?.lecture?.lectureId ||
    ''

  const loadNotes = async () => {
    setLoading(true)
    setError('')
    setNotes(null)

    try {
      let lectureId = requestedLectureId

      // Load the latest lecture if no ID was provided
      if (!lectureId) {
        const lecturesResponse = await getLectures()

        const latestLecture = lecturesResponse.lectures?.[0]

        lectureId =
          latestLecture?.lectureId ||
          latestLecture?.id

        if (!lectureId) {
          throw new Error(
            'No saved lectures found. Upload a lecture first.'
          )
        }
      }

      // Fetch generated summary from MongoDB
      const response = await getLectureSummary(lectureId)

      const lecture = response.lecture || response

      const summaryData =
        lecture.summaryData ||
        lecture.summary_data ||
        {}

      const concepts = summaryData.important_concepts || []
      const points = summaryData.key_points || []
      const examples = summaryData.notable_examples || []
      const questions = summaryData.revision_questions || []

      const overview =
        summaryData.overview ||
        lecture.summary ||
        ''

      if (!response.success || (!overview && !summaryData.main_topic)) {
        throw new Error(
          'No generated summary is available for this lecture.'
        )
      }

      setNotes({
        id: lectureId,
        title: lecture.title || 'Untitled Lecture',
        subject: lecture.subject || 'General',

        summary: overview,
        summaryData,

        keyConcepts: concepts,
        importantPoints: points,
        notableExamples: examples,
        revision: questions,
        bottomLine: summaryData.bottom_line || ''
      })

    } catch (err) {
      console.error('Notes loading error:', err)

      setError(
        err.message || 'Unable to load lecture notes.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Loading state is set as part of this async data-fetch lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedLectureId])

  const concepts = notes?.keyConcepts || []
  const points = notes?.importantPoints || []
  const examples = notes?.notableExamples || []
  const questions = notes?.revision || []

  const getText = item => {
    if (typeof item === 'string') return item

    return (
      item.question ||
      item.title ||
      item.concept ||
      item.name ||
      item.text ||
      ''
    )
  }

  const copyNotes = async () => {
    if (!notes) return

    const conceptText = concepts.map(item => {
      if (typeof item === 'string') return item

      return `${item.concept}: ${item.explanation}`
    })

    const exampleText = examples.map(item => {
      if (typeof item === 'string') return item

      return `${item.name}: ${item.description}`
    })

    const questionText = questions.map(item => {
      if (typeof item === 'string') return item

      return `${item.question}\nAnswer: ${item.answer}`
    })

    const content = [
      notes.title,
      notes.subject,
      '',
      'MAIN TOPIC',
      notes.summaryData.main_topic || '',
      '',
      'OVERVIEW',
      notes.summary,
      '',
      'IMPORTANT CONCEPTS',
      ...conceptText,
      '',
      'KEY POINTS',
      ...points.map(getText),
      '',
      'NOTABLE EXAMPLES',
      ...exampleText,
      '',
      'REVISION QUESTIONS',
      ...questionText,
      '',
      'BOTTOM LINE',
      notes.bottomLine
    ].join('\n')

    try {
      await navigator.clipboard.writeText(content)

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

    } catch (err) {
      console.error('Could not copy notes:', err)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-indigo-700/20 blur-[150px] rounded-full" />

        <div className="absolute top-[550px] -right-40 w-[450px] h-[450px] bg-violet-700/15 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* LOADING */}
        {loading && (
          <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">

            <LoaderCircle
              size={38}
              className="text-violet-400 animate-spin mb-5"
            />

            <h2 className="text-white text-xl font-bold">
              Creating your study space
            </h2>

            <p className="text-slate-500 text-sm mt-2">
              Fetching your saved lecture notes.
            </p>

          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="min-h-[65vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto">

            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <AlertCircle
                size={26}
                className="text-red-400"
              />
            </div>

            <h2 className="text-white text-xl font-bold">
              Unable to load lecture notes
            </h2>

            <p className="text-slate-400 text-sm mt-3 leading-6">
              {error}
            </p>

            <button
              onClick={loadNotes}
              className="mt-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
            >
              <RefreshCw size={16} />
              Try again
            </button>

          </div>
        )}

        {/* GENERATED NOTES */}
        {!loading && !error && notes && (
          <>

            <NotesHeader
              notes={notes}
              conceptsCount={concepts.length}
              copied={copied}
              onCopy={copyNotes}
            />

            <SummaryCard
              summary={notes.summary}
              summaryData={notes.summaryData}
            />

            {/* IMPORTANT CONCEPTS */}
            {concepts.length > 0 && (
              <section className="mb-12">

                <div className="mb-7">
                  <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">
                    Understand the fundamentals
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                    Important Concepts
                  </h2>

                  <p className="text-slate-500 text-sm mt-2">
                    The main ideas covered in your lecture, explained clearly.
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
            )}

            {/* KEY POINTS */}
            {points.length > 0 && (
              <ImportantPoints points={points} />
            )}

            {/* EXAMPLES */}
            <NotableExamples examples={examples} />

            {/* REVISION */}
            {questions.length > 0 && (
              <RevisionAccordion questions={questions} />
            )}

            {/* CONCLUSION */}
            <BottomLine text={notes.bottomLine} />

            <LearningLinks />

          </>
        )}

      </div>
    </div>
  )
}

export default Notes
