import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Download,
  BookOpen,
  MessageCircle,
  AlertTriangle,
  Brain
} from 'lucide-react'

import UploadHeader from '../components/upload/UploadHeader'
import FileDropzone from '../components/upload/FileDropzone'
import SelectedFile from '../components/upload/SelectedFile'
import LectureDetailsForm from '../components/upload/LectureDetailsForm'
import UploadInfo from '../components/upload/UploadInfo'

import {
  uploadLecture,
  uploadExtractedAudio
} from '../services/lectureService'

import {
  extractAudioFromVideo
} from '../services/audioExtractionService'

// Processing stage definitions
const STAGES = [
  { key: 'extracting',   label: 'Extracting audio',           detail: 'FFmpeg is extracting audio from your video in the browser.' },
  { key: 'uploading',    label: 'Uploading lecture',           detail: 'Saving original lecture file and metadata.' },
  { key: 'transcribing', label: 'Transcribing',               detail: 'Groq Whisper is converting your audio to text.' },
  { key: 'summarising',  label: 'Generating study notes',     detail: 'AI is creating structured notes from the transcript.' },
  { key: 'indexing',     label: 'Indexing for AI chat',       detail: 'Pinecone is indexing your lecture for the AI tutor.' },
  { key: 'done',         label: 'Complete',                   detail: 'Your lecture is ready.' }
]

function UploadLecture() {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')

  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const [isBusy, setIsBusy] = useState(false)
  const [currentStage, setCurrentStage] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingDetail, setProcessingDetail] = useState('')

  const [audioFile, setAudioFile] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('')

  const [result, setResult] = useState(null)
  // result shape: { lectureId, title, subject, originalName, transcript, summaryData, ragStatus, ragChunks }

  const supportedExtensions = ['mp4', 'mov', 'webm', 'mp3', 'wav', 'm4a']
  const maxSize = 500 * 1024 * 1024
  const maxBrowserExtractionSize = 100 * 1024 * 1024

  const isAudio = file
    ? file.type.startsWith('audio/') ||
      ['mp3', 'wav', 'm4a'].includes(file.name.split('.').pop().toLowerCase())
    : false

  // Audio preview URL
  useEffect(() => {
    // Create/revoke the browser object URL when the selected audio changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!audioFile) { setAudioPreviewUrl(''); return }
    const url = URL.createObjectURL(audioFile)
    setAudioPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [audioFile])

  const formatSize = bytes => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const resetUploadState = () => {
    setResult(null)
    setAudioFile(null)
    setAudioPreviewUrl('')
    setCurrentStage('')
    setUploadProgress(0)
    setProcessingDetail('')
    setError('')
  }

  const handleFile = selectedFile => {
    if (isBusy) return
    setError('')
    resetUploadState()
    if (!selectedFile) return
    const extension = selectedFile.name.split('.').pop().toLowerCase()
    if (!supportedExtensions.includes(extension)) {
      setError('Unsupported format. Select MP4, MOV, WEBM, MP3, WAV or M4A.')
      return
    }
    if (selectedFile.size > maxSize) { setError('File size exceeds 500 MB.'); return }
    if (selectedFile.size === 0) { setError('This file is empty.'); return }
    setFile(selectedFile)
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
  }

  const handleDragOver = e => { e.preventDefault(); if (!isBusy) setDragActive(true) }
  const handleDragLeave = e => { e.preventDefault(); setDragActive(false) }
  const handleDrop = e => {
    e.preventDefault(); setDragActive(false)
    if (!isBusy) handleFile(e.dataTransfer.files[0])
  }

  const openFilePicker = () => {
    if (isBusy) return
    if (inputRef.current) { inputRef.current.value = ''; inputRef.current.click() }
  }

  const removeFile = () => {
    if (isBusy) return
    setFile(null); setTitle(''); setSubject('')
    resetUploadState()
    if (inputRef.current) inputRef.current.value = ''
  }

  const setStage = (key) => {
    const s = STAGES.find(s => s.key === key)
    setCurrentStage(key)
    setProcessingDetail(s?.detail || '')
    setUploadProgress(0)
  }

  // Complete lecture processing pipeline
  const handleSubmit = async event => {
    event.preventDefault()
    if (isBusy) return
    setError('')
    setResult(null)
    setAudioFile(null)
    setUploadProgress(0)
    setCurrentStage('')
    setProcessingDetail('')

    if (!file) { setError('Please select a lecture file first.'); return }
    if (!title.trim() || !subject.trim()) {
      setError('Please enter both lecture title and subject.')
      return
    }
    if (!isAudio && file.size > maxBrowserExtractionSize) {
      setError('For initial testing, please select a video smaller than 100 MB.')
      return
    }

    setIsBusy(true)

    try {
      let extractedAudio

      // STEP 1: Extract audio in browser
      setStage('extracting')

      if (isAudio) {
        setProcessingDetail('Audio file selected. Extraction not required.')
        extractedAudio = file
      } else {
        extractedAudio = await extractAudioFromVideo(
          file,
          detail => setProcessingDetail(detail)
        )
      }

      setAudioFile(extractedAudio)

      // STEP 2: Upload original video
      setStage('uploading')

      const videoResponse = await uploadLecture({
        file,
        title: title.trim(),
        subject: subject.trim(),
        onProgress: setUploadProgress
      })

      if (!videoResponse.success || !videoResponse.lecture) {
        throw new Error(videoResponse.message || 'Video upload failed.')
      }

      const lectureId = videoResponse.lecture.id
      const storedName = videoResponse.lecture.videoStoredName || ''

      // STEP 3+4+5: Upload audio → triggers transcription, summary + RAG indexing on backend
      setStage('transcribing')

      const audioResponse = await uploadExtractedAudio({
        audioFile: extractedAudio,
        lectureId,
        videoStoredName: storedName,
        onProgress: p => {
          setUploadProgress(p)
          if (p >= 100) {
            setProcessingDetail('Audio uploaded. Transcription, study notes, and RAG indexing are running on the backend.')
          }
        }
      })

      if (!audioResponse.success || !audioResponse.transcript) {
        throw new Error(audioResponse.message || 'Transcription failed.')
      }

      setStage('done')
      setUploadProgress(100)

      const ragInfo = audioResponse.ragIngestion || {}

      setResult({
        lectureId,
        title: videoResponse.lecture.title || title.trim(),
        subject: videoResponse.lecture.subject || subject.trim(),
        originalName: videoResponse.lecture.originalName || file.name,
        transcript: audioResponse.transcript,
        summaryData: audioResponse.summaryData || {},
        summary: audioResponse.summary || '',
        ragStatus: ragInfo.status || 'unknown',
        ragChunks: ragInfo.chunks || 0
      })

    } catch (uploadError) {
      console.error('Lecture processing error:', uploadError)
      setError(uploadError.message || 'Something went wrong while processing your lecture.')
      setCurrentStage('')
    } finally {
      setIsBusy(false)
    }
  }

  const stageIndex = STAGES.findIndex(s => s.key === currentStage)

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-indigo-700/20 blur-[150px] rounded-full" />
        <div className="absolute top-[500px] -right-40 w-[450px] h-[450px] bg-violet-700/15 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        <UploadHeader />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">

            {/* LEFT SIDE */}
            <div className="lg:col-span-7 space-y-6">

              {/* FILE UPLOAD CARD */}
              <div className="glass-card p-5 sm:p-7">

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-white text-lg font-bold">Upload your file</h2>
                    <p className="text-slate-500 text-xs mt-2">Select a lecture recording from your device.</p>
                  </div>
                </div>

                {/* HIDDEN FILE INPUT */}
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,audio/mpeg,audio/wav,audio/mp4,.mp4,.mov,.webm,.mp3,.wav,.m4a"
                  className="hidden"
                  disabled={isBusy}
                  onChange={event => handleFile(event.target.files[0])}
                />

                {/* NEON DROPZONE */}
                <div className="relative isolate group/dropzone">
                  <div className={`pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 blur-xl transition-opacity duration-500 ${
                    dragActive ? 'opacity-45' : 'opacity-0 group-hover/dropzone:opacity-25'
                  }`} />

                  <div className={`relative rounded-2xl border transition-all duration-300 ${
                    dragActive
                      ? 'border-violet-400/70 bg-violet-500/[0.06] shadow-[0_0_30px_rgba(139,92,246,0.18)]'
                      : 'border-violet-500/20 bg-[#0b0818]/30 group-hover/dropzone:border-violet-400/50'
                  }`}>
                    {!file ? (
                      <FileDropzone
                        dragActive={dragActive}
                        onBrowse={openFilePicker}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      />
                    ) : (
                      <SelectedFile
                        file={file}
                        isAudio={isAudio}
                        formatSize={formatSize}
                        onRemove={removeFile}
                        onChoose={openFilePicker}
                      />
                    )}
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-xs leading-5">
                    {error}
                  </div>
                )}

                {/* PROCESSING STAGES */}
                {isBusy && (
                  <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-5">

                    {/* Stage progress bar */}
                    <div className="flex gap-1 mb-4">
                      {STAGES.slice(0, -1).map((s, i) => (
                        <div
                          key={s.key}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            i < stageIndex
                              ? 'bg-emerald-400'
                              : i === stageIndex
                                ? 'bg-violet-400'
                                : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <LoaderCircle size={19} className="animate-spin text-violet-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-semibold">
                            {STAGES.find(s => s.key === currentStage)?.label || 'Processing…'}
                          </p>
                          {uploadProgress > 0 && (
                            <span className="text-violet-300 text-sm font-bold tabular-nums">
                              {uploadProgress}%
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mt-1 truncate">
                          {processingDetail}
                        </p>
                      </div>
                    </div>

                    {uploadProgress > 0 && (
                      <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* SUCCESS AND RESULTS */}
                {result && (
                  <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">

                    {/* SUCCESS HEADER */}
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      <CheckCircle2 size={19} />
                      Lecture processed successfully!
                    </div>

                    {/* STATUS ROW */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={11} /> Transcript
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={11} /> Study Notes
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border ${
                        result.ragStatus === 'completed'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                      }`}>
                        {result.ragStatus === 'completed'
                          ? <><CheckCircle2 size={11} /> AI Chat Ready ({result.ragChunks} chunks)</>
                          : <><AlertTriangle size={11} /> RAG indexing failed</>
                        }
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="mt-4 space-y-1.5 text-xs text-emerald-100/70">
                      <p><span className="text-emerald-300">Title:</span> {result.title}</p>
                      <p><span className="text-emerald-300">Subject:</span> {result.subject}</p>
                      <p><span className="text-emerald-300">File:</span> {result.originalName}</p>
                      <p><span className="text-emerald-300">Video size:</span> {formatSize(file?.size ?? 0)}</p>
                      {audioFile && (
                        <p><span className="text-emerald-300">Audio size:</span> {formatSize(audioFile.size)}</p>
                      )}
                      {result.transcript?.language && (
                        <p><span className="text-emerald-300">Language:</span> {result.transcript.language.toUpperCase()}</p>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/notes/${result.lectureId}`)}
                        className="flex items-center justify-center gap-2 bg-white text-slate-950 py-3 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                      >
                        <BookOpen size={14} />
                        View Notes
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/quiz/${result.lectureId}`)}
                        className="flex items-center justify-center gap-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 py-3 rounded-xl text-xs font-bold hover:bg-indigo-600/30 transition-colors"
                      >
                        <Brain size={14} />
                        Take Quiz
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/chat/${result.lectureId}`)}
                        className="flex items-center justify-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 py-3 rounded-xl text-xs font-bold hover:bg-violet-600/30 transition-colors"
                      >
                        <MessageCircle size={14} />
                        Ask AI Tutor
                      </button>
                    </div>

                    {/* AUDIO PLAYER */}
                    {audioPreviewUrl && (
                      <div className="mt-5 pt-4 border-t border-emerald-500/20">
                        <p className="text-white text-xs font-semibold mb-3">Extracted audio</p>
                        <audio controls src={audioPreviewUrl} className="w-full h-10" />
                        <a
                          href={audioPreviewUrl}
                          download={audioFile?.name}
                          className="inline-flex items-center gap-2 mt-4 text-emerald-300 hover:text-emerald-200 text-xs font-semibold"
                        >
                          <Download size={15} />
                          Download MP3
                        </a>
                      </div>
                    )}

                    {/* COMBINED TRANSCRIPT */}
                    <div className="mt-6 pt-5 border-t border-emerald-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-sm">Generated transcript</h3>
                        <CheckCircle2 size={20} className="text-emerald-400" />
                      </div>

                      <div className="max-h-[400px] overflow-y-auto rounded-xl border border-violet-500/15 bg-[#0b0818]/60 p-4">
                        <p className="text-slate-200 text-sm leading-7 whitespace-pre-wrap">
                          {result.transcript?.text || 'No speech was detected.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* LECTURE DETAILS */}
              <LectureDetailsForm
                title={title}
                setTitle={value => { if (isBusy) return; setTitle(value); resetUploadState() }}
                subject={subject}
                setSubject={value => { if (isBusy) return; setSubject(value); resetUploadState() }}
              />

              {/* PROCESS BUTTON */}
              <button
                type="submit"
                disabled={!file || isBusy || !!result}
                className="gradient-button w-full rounded-xl py-4 flex items-center justify-center gap-3 font-bold text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isBusy ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    {STAGES.find(s => s.key === currentStage)?.label || 'Processing…'}
                  </>
                ) : result ? (
                  <>
                    Processing completed
                    <CheckCircle2 size={18} />
                  </>
                ) : (
                  <>
                    Extract audio &amp; generate transcript
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {result && (
                <p className="text-center text-slate-500 text-xs">
                  Your lecture notes and AI chat are ready.
                </p>
              )}

            </div>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-5">
              <UploadInfo />
            </div>

          </div>
        </form>

      </div>
    </div>
  )
}

export default UploadLecture
