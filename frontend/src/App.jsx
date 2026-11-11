
import { Routes, Route, Navigate } from 'react-router-dom'

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

function App() {
  return (
    <Routes>
      {/* Pages with the main navigation */}
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/lectures" element={<Dashboard />} />
        <Route path="/upload" element={<UploadLecture />} />

        <Route path="/transcript" element={<Transcript />} />
        <Route path="/transcript/:id" element={<Transcript />} />

        <Route path="/notes" element={<Notes />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/chat" element={<Chat />} />
      </Route>

      {/* Authentication pages without the main navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
