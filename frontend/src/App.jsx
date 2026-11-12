
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'

import Layout from './components/layout/Layout'

import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import UploadLecture from './pages/UploadLecture'
import Transcript from './pages/Transcript'
import Notes from './pages/Notes'
import Quiz from './pages/Quiz'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import RequireAuth from './components/auth/RequireAuth'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'

    const restorePosition = () => {
      if (hash) {
        document.querySelector(hash)?.scrollIntoView({ block: 'start' })
        return
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    restorePosition()
    const frame = requestAnimationFrame(restorePosition)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Pages with the main navigation */}
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route element={<RequireAuth />}>
          <Route path="/lectures" element={<Dashboard />} />
          <Route path="/upload" element={<UploadLecture />} />
          <Route path="/transcript" element={<Transcript />} />
          <Route path="/transcript/:id" element={<Transcript />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:lectureId" element={<Notes />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:lectureId" element={<Quiz />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:lectureId" element={<Chat />} />
        </Route>
      </Route>

      {/* Authentication pages without the main navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
