
import { useState } from 'react'

import sampleQuiz from '../data/sampleQuiz'

import QuizHeader from '../components/quiz/QuizHeader'
import QuizProgress from '../components/quiz/QuizProgress'
import QuestionCard from '../components/quiz/QuestionCard'
import QuizNavigation from '../components/quiz/QuizNavigation'
import QuizResults from '../components/quiz/QuizResults'

function Quiz() {
  const questions = Array.isArray(sampleQuiz)
    ? sampleQuiz
    : sampleQuiz.questions || []

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const answeredCount = Object.keys(answers).length

  const score = questions.reduce((total, question, index) => {
    return total + (
      answers[index] === question.correctAnswer ? 1 : 0
    )
  }, 0)

  const selectAnswer = answerIndex => {
    setAnswers(previous => ({
      ...previous,
      [currentQuestion]: answerIndex
    }))
  }

  const handlePrevious = () => {
    setCurrentQuestion(previous => Math.max(0, previous - 1))
  }

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      if (answeredCount === questions.length) {
        setSubmitted(true)
      }
      return
    }

    if (answers[currentQuestion] === undefined) return

    setCurrentQuestion(previous => previous + 1)
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

        <QuizHeader questionCount={questions.length} />

        {!hasQuestions ? (
          <div className="glass-card p-10 text-center mb-24">
            <h2 className="text-white text-xl font-bold">
              No questions available
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Quiz questions will appear here once they are added.
            </p>
          </div>
        ) : submitted ? (
          <div className="pb-24">
            <QuizResults
              questions={questions}
              answers={answers}
              score={score}
              onRetake={handleRetake}
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
        )}
      </div>
    </div>
  )
}

export default Quiz
