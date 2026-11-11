
import { useCallback, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { LoaderCircle, AlertCircle, RefreshCw } from 'lucide-react'

import QuizHeader from '../components/quiz/QuizHeader'
import QuizProgress from '../components/quiz/QuizProgress'
import QuestionCard from '../components/quiz/QuestionCard'
import QuizNavigation from '../components/quiz/QuizNavigation'
import QuizResults from '../components/quiz/QuizResults'
import { getLectures } from '../services/lectureService'
import { authenticatedFetch } from '../services/authService'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

function Quiz() {
  const params = useParams()
  const location = useLocation()

  // Resolve lecture ID from URL params or navigation state
  const urlLectureId =
    params.lectureId ||
    location.state?.lectureId ||
    location.state?.lecture?.id ||
    ''

  const [lectures, setLectures] = useState([])
  const [lecturesLoading, setLecturesLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(urlLectureId)

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const fetchQuiz = useCallback(async lectureId => {
    if (!lectureId) return
    setLoading(true)
    setError('')
    setQuestions([])
    setAnswers({})
    setSubmitted(false)
    setCurrentQuestion(0)

    try {
      const response = await authenticatedFetch(
        `${API_URL}/api/lectures/${encodeURIComponent(lectureId)}/quiz?num_questions=10`
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Quiz generation failed.')
      if (!data.questions?.length) throw new Error('No questions were generated for this lecture.')
      setQuestions(data.questions)
    } catch (err) {
      setError(err.message || 'Failed to generate quiz.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load lectures list
  useEffect(() => {
    getLectures()
      .then(data => {
        const list = data.lectures || []
        setLectures(list)
        if (!selectedId && list.length > 0) {
          const first = list[0]
          setSelectedId(first.lectureId || first.id || '')
        }
      })
      .catch(() => {})
      .finally(() => setLecturesLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When selectedId changes, update title and fetch quiz
  useEffect(() => {
    if (!selectedId) return
    // Fetching on selection is intentionally async; the loader is updated by fetchQuiz.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuiz(selectedId)
  }, [selectedId, fetchQuiz])

  const handleSelectLecture = id => {
    setSelectedId(id)
  }

  const answeredCount = Object.keys(answers).length
  const score = questions.reduce((total, q, i) => (
    total + (answers[i] === q.correctAnswer ? 1 : 0)
  ), 0)

  const selectAnswer = answerIndex => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answerIndex }))
  }

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      if (answeredCount === questions.length) setSubmitted(true)
      return
    }
    if (answers[currentQuestion] === undefined) return
    setCurrentQuestion(prev => prev + 1)
  }

  const handleRetake = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSubmitted(false)
  }

  const hasQuestions = questions.length > 0
  const question = questions[currentQuestion]

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-indigo-700/20 blur-[150px] rounded-full" />
        <div className="absolute top-[550px] -right-40 w-[450px] h-[450px] bg-violet-700/15 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">

        <QuizHeader questionCount={hasQuestions ? questions.length : 0} />

        {/* LECTURE SELECTOR */}
        <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                Quiz lecture
              </p>
              {lecturesLoading ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <LoaderCircle size={14} className="animate-spin" />
                  Loading…
                </div>
              ) : lectures.length > 0 ? (
                <select
                  value={selectedId}
                  onChange={e => handleSelectLecture(e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold outline-none cursor-pointer max-w-full"
                >
                  <option className="bg-slate-900" value="">— select a lecture —</option>
                  {lectures.map(l => {
                    const id = l.lectureId || l.id
                    return (
                      <option key={id} className="bg-slate-900" value={id}>
                        {l.title || 'Untitled'} — {l.subject || 'General'}
                      </option>
                    )
                  })}
                </select>
              ) : (
                <p className="text-slate-400 text-sm">No lectures found. Upload one first.</p>
              )}
            </div>
          </div>

          {selectedId && !loading && (
            <button
              type="button"
              onClick={() => fetchQuiz(selectedId)}
              className="shrink-0 flex items-center gap-2 text-xs text-indigo-300 hover:text-white bg-indigo-500/15 border border-indigo-500/20 px-4 py-2 rounded-xl transition-colors"
            >
              <RefreshCw size={14} />
              Regenerate
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="glass-card p-10 text-center mb-24">
            <LoaderCircle size={36} className="text-violet-400 animate-spin mx-auto mb-5" />
            <h2 className="text-white text-xl font-bold">Generating your quiz</h2>
            <p className="text-slate-400 text-sm mt-3">
              AI is creating questions from your lecture content.
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="glass-card p-10 text-center mb-24">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={26} className="text-red-400" />
            </div>
            <h2 className="text-white text-xl font-bold">Quiz generation failed</h2>
            <p className="text-slate-400 text-sm mt-3 leading-6">{error}</p>
            {selectedId && (
              <button
                type="button"
                onClick={() => fetchQuiz(selectedId)}
                className="mt-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors mx-auto"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            )}
          </div>
        )}

        {/* NO LECTURE SELECTED */}
        {!loading && !error && !hasQuestions && !selectedId && (
          <div className="glass-card p-10 text-center mb-24">
            <h2 className="text-white text-xl font-bold">Select a lecture to begin</h2>
            <p className="text-slate-400 text-sm mt-3">
              Choose a lecture from the dropdown above. The AI will generate quiz questions from its content.
            </p>
          </div>
        )}

        {/* QUIZ */}
        {!loading && !error && hasQuestions && (
          submitted ? (
            <div className="pb-24">
              <QuizResults
                questions={questions}
                answers={answers}
                score={score}
                onRetake={handleRetake}
                lectureId={selectedId}
              />
            </div>
          ) : (
            <section className="pb-24">
              <QuizProgress
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                answeredCount={answeredCount}
              />

              <QuestionCard
                question={question}
                questionNumber={currentQuestion + 1}
                selectedAnswer={answers[currentQuestion]}
                onSelect={selectAnswer}
              />

              <QuizNavigation
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                canContinue={answers[currentQuestion] !== undefined}
                allAnswered={answeredCount === questions.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </section>
          )
        )}
      </div>
    </div>
  )
}

export default Quiz
