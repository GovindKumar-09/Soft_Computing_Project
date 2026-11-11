import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, Check, Copy, LoaderCircle, Search } from 'lucide-react'

import { getLecture, getLectures } from '../services/lectureService'
import TranscriptHeader from '../components/transcript/TranscriptHeader'
import LearningNavigation from '../components/transcript/LearningNavigation'

function Transcript() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [library, setLibrary] = useState(null)
  const [libraryError, setLibraryError] = useState('')
  const [copyError, setCopyError] = useState('')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    if (!id) {
      getLectures()
        .then(data => {
          if (!active) return
          const lectures = data.lectures || []
          const latestReady = lectures.find(lecture =>
            lecture.id && (lecture.status || '').toLowerCase() === 'completed'
          )
          if (latestReady) {
            navigate(`/transcript/${encodeURIComponent(latestReady.id)}`, { replace: true })
            return
          }
          setLibrary(lectures)
        })
        .catch(error => {
          if (active) setLibraryError(error.message || 'Unable to load your lectures.')
        })
      return () => { active = false }
    }

    getLecture(id)
      .then(data => {
        if (active) setResult({ id, lecture: data.lecture || data })
      })
      .catch(err => {
        if (active) setResult({ id, error: err.message || 'Unable to load this transcript.' })
      })

    return () => { active = false }
  }, [id, navigate])

  const loading = Boolean(id) && result?.id !== id
  const libraryLoading = !id && library === null && !libraryError
  const lecture = result && result.id === id ? result.lecture : null
  const error = id && result?.id === id ? result.error : ''
  const transcript = lecture?.transcript || ''
  const highlightedTranscript = useMemo(() => {
    const term = search.trim()
    if (!term) return transcript
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return transcript.split(new RegExp(`(${escaped})`, 'gi'))
  }, [search, transcript])

  const copyTranscript = async () => {
    if (!transcript) return
    setCopyError('')
    try {
      await navigator.clipboard.writeText(transcript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError('Clipboard access is unavailable in this browser.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-indigo-700/20 blur-[150px] rounded-full" />
        <div className="absolute top-[550px] -right-40 w-[450px] h-[450px] bg-violet-700/15 blur-[150px] rounded-full" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <TranscriptHeader
          copied={copied}
          onCopy={copyTranscript}
          subject={lecture?.subject || 'Lecture'}
          duration={null}
          title={lecture?.title || 'Lecture transcript'}
          isSample={false}
        />

        {loading && (
          <div className="glass-card p-12 text-center text-slate-300 mb-10">
            <LoaderCircle className="animate-spin mx-auto mb-4 text-violet-400" />
            Loading saved transcript…
          </div>
        )}

        {!id && (libraryLoading || libraryError || library?.length === 0) && (
          <div className="glass-card p-8 text-center mb-10">
            {libraryLoading ? (
              <><LoaderCircle className="animate-spin mx-auto mb-4 text-violet-400" /><p className="text-slate-300">Finding your latest transcript…</p></>
            ) : libraryError ? (
              <><AlertCircle className="mx-auto mb-3 text-red-400" /><p className="text-slate-300">{libraryError}</p></>
            ) : (
              <><p className="text-slate-300">No lectures yet. Upload a lecture to generate its transcript.</p><Link to="/upload" className="inline-block mt-4 text-indigo-300 hover:text-white">Upload a lecture</Link></>
            )}
          </div>
        )}

        {!id && !libraryLoading && !libraryError && library?.length > 0 && (
          <section className="glass-card p-6 mb-10">
            <h2 className="text-white font-bold text-lg mb-4">Your lectures are still processing</h2>
            <p className="text-slate-400 text-sm mb-5">A transcript will open here as soon as processing finishes.</p>
            <div className="space-y-3">
              {library.map(lecture => (
                <div key={lecture.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] p-4">
                  <div><p className="text-white font-medium">{lecture.title}</p><p className="text-slate-400 text-xs mt-1">{lecture.subject} · {lecture.status}</p></div>
                  <Link to="/lectures" className="shrink-0 text-indigo-300 hover:text-white text-sm">View status</Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && error && (
          <div className="glass-card p-8 text-center mb-10">
            <AlertCircle className="mx-auto mb-3 text-red-400" />
            <p className="text-slate-300">{error}</p>
            <Link to="/lectures" className="inline-block mt-4 text-indigo-300 hover:text-white">Back to My Lectures</Link>
          </div>
        )}

        {id && !loading && !error && (
          <section className="glass-card overflow-hidden mb-10">
            <div className="px-5 sm:px-7 py-5 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-white font-bold text-lg">Combined lecture transcript</h2>
                <p className="text-slate-500 text-xs mt-1">Saved with this lecture. Transcript is shown as continuous text.</p>
              </div>
              <button type="button" onClick={copyTranscript} className="text-xs text-indigo-300 hover:text-white font-semibold flex items-center gap-2">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy transcript'}
              </button>
            </div>
            <div className="p-5 sm:p-7">
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-5">
                <Search size={16} className="text-slate-500" />
                <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search this transcript" className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-600" />
              </label>
              {copyError && <p className="text-red-300 text-xs mb-4">{copyError}</p>}
              {transcript ? (
                <p className="text-slate-200 text-sm sm:text-base leading-8 whitespace-pre-wrap break-words">
                  {Array.isArray(highlightedTranscript)
                    ? highlightedTranscript.map((part, index) => part.toLowerCase() === search.trim().toLowerCase()
                      ? <mark key={index} className="bg-amber-400/25 text-amber-200 rounded px-1">{part}</mark>
                      : part)
                    : transcript}
                </p>
              ) : (
                <p className="text-slate-400 text-sm">No transcript is saved for this lecture yet.</p>
              )}
            </div>
          </section>
        )}

        {!loading && lecture && <LearningNavigation lectureId={id} />}
      </div>
    </div>
  )
}

export default Transcript
