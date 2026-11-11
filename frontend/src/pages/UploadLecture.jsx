
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Download
} from 'lucide-react'


import UploadHeader from '../components/upload/UploadHeader'
import FileDropzone from '../components/upload/FileDropzone'
import SelectedFile from '../components/upload/SelectedFile'
import LectureDetailsForm from '../components/upload/LectureDetailsForm'
import UploadInfo from '../components/upload/UploadInfo'

import { uploadLecture, uploadExtractedAudio } from '../services/lectureService'
import { extractAudioFromVideo } from '../services/audioExtractionService'

function UploadLecture() {
  const inputRef = useRef(null)
  const [uploadStage, setUploadStage] = useState('')

  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const [error, setError] = useState('')
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [processingStatus, setProcessingStatus] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const [audioFile, setAudioFile] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('')

  const [uploadedLecture, setUploadedLecture] = useState(null)

  const supportedExtensions = [
    'mp4', 'mov', 'webm', 'mp3', 'wav', 'm4a'
  ]

  const maxSize = 500 * 1024 * 1024

  // Temporary browser extraction limit for testing
  const maxBrowserExtractionSize = 100 * 1024 * 1024

  const isBusy = isProcessingAudio || isUploading

  const isAudio = file
    ? file.type.startsWith('audio/') ||
      ['mp3', 'wav', 'm4a'].includes(
        file.name.split('.').pop().toLowerCase()
      )
    : false

  // Create audio preview URL
  useEffect(() => {
    if (!audioFile) {
      setAudioPreviewUrl('')
      return
    }

    const url = URL.createObjectURL(audioFile)

    setAudioPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [audioFile])

  // File size formatter
  const formatSize = bytes => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Reset previous processing result
  const resetUploadState = () => {
    setUploadStage('')
    setUploadedLecture(null)
    setAudioFile(null)
    setProcessingStatus('')
    setUploadProgress(0)
    setError('')
  }

  // Validate selected file
  const handleFile = selectedFile => {
    if (isBusy) return

    setError('')
    resetUploadState()

    if (!selectedFile) return

    const extension = selectedFile.name
      .split('.')
      .pop()
      .toLowerCase()

    if (!supportedExtensions.includes(extension)) {
      setError(
        'Unsupported format. Please select MP4, MOV, WEBM, MP3, WAV or M4A.'
      )
      return
    }

    if (selectedFile.size > maxSize) {
      setError(
        'File size exceeds 500 MB. Please choose a smaller file.'
      )
      return
    }

    if (selectedFile.size === 0) {
      setError('This file is empty. Please choose another file.')
      return
    }

    setFile(selectedFile)
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
  }

  // Drag and drop
  const handleDragOver = event => {
    event.preventDefault()

    if (!isBusy) {
      setDragActive(true)
    }
  }

  const handleDragLeave = event => {
    event.preventDefault()
    setDragActive(false)
  }

  const handleDrop = event => {
    event.preventDefault()
    setDragActive(false)

    if (isBusy) return

    handleFile(event.dataTransfer.files[0])
  }

  // Open file picker
  const openFilePicker = () => {
    if (isBusy) return

    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.click()
    }
  }

  // Remove selected file
  const removeFile = () => {
    if (isBusy) return

    setFile(null)
    setTitle('')
    setSubject('')
    setError('')
    resetUploadState()

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  // Process lecture
  
const handleSubmit = async event => {
  event.preventDefault()

  if (isBusy) return

  setError('')
  setUploadedLecture(null)
  setAudioFile(null)
  setUploadProgress(0)
  setProcessingStatus('')
  setUploadStage('')

  if (!file) {
    setError('Please select a video or audio file first.')
    return
  }

  if (!title.trim() || !subject.trim()) {
    setError('Please enter both lecture title and subject.')
    return
  }

  if (!isAudio && file.size > maxBrowserExtractionSize) {
    setError(
      'For our initial browser extraction test, choose a video up to 100 MB.'
    )
    return
  }

  try {
    let extractedAudio

    // STEP 1: Extract audio in browser
    if (isAudio) {
      setProcessingStatus('Audio file selected. No extraction required.')
      extractedAudio = file
    } else {
      setIsProcessingAudio(true)

      extractedAudio = await extractAudioFromVideo(
        file,
        status => setProcessingStatus(status)
      )
    }

    setAudioFile(extractedAudio)
    setIsProcessingAudio(false)

    // STEP 2: Upload original video
    setIsUploading(true)
    setUploadStage('Uploading original lecture')
    setUploadProgress(0)

    const videoResponse = await uploadLecture({
      file,
      title: title.trim(),
      subject: subject.trim(),
      onProgress: setUploadProgress
    })

    if (!videoResponse.success || !videoResponse.lecture) {
      throw new Error(
        videoResponse.message || 'Original video upload failed'
      )
    }

    // STEP 3: Upload extracted audio
    setUploadStage('Uploading extracted audio')
    setUploadProgress(0)

    const audioResponse = await uploadExtractedAudio({
      audioFile: extractedAudio,

      lectureId: videoResponse.lecture.id,

      videoStoredName: videoResponse.lecture.storedName,

      onProgress: setUploadProgress
    })

    if (!audioResponse.success || !audioResponse.audio) {
      throw new Error(
        audioResponse.message || 'Audio upload failed'
      )
    }

    // Both uploads completed
    setUploadedLecture({
      ...videoResponse.lecture,
      audio: audioResponse.audio
    })

    setUploadProgress(100)
    setUploadStage('Completed')

    setProcessingStatus(
      'Original lecture and extracted audio saved successfully.'
    )

  } catch (uploadError) {
    console.error(uploadError)

    setError(
      uploadError.message ||
      'Something went wrong while processing your lecture.'
    )

  } finally {
    setIsProcessingAudio(false)
    setIsUploading(false)
  }
}


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

              {/* FILE INPUT */}
              <div className="glass-card p-5 sm:p-7">

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-white text-lg font-bold">
                      Upload your file
                    </h2>

                    <p className="text-slate-500 text-xs mt-2">
                      Select a lecture recording from your device.
                    </p>
                  </div>
                </div>

                {/* Hidden input */}
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,audio/mpeg,audio/wav,audio/mp4,.mp4,.mov,.webm,.mp3,.wav,.m4a"
                  className="hidden"
                  disabled={isBusy}
                  onChange={event =>
                    handleFile(event.target.files[0])
                  }
                />

                {/* NEON DROPZONE */}
                <div className="relative isolate group/dropzone">

                  <div
                    className={`pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 blur-xl transition-opacity duration-500 ${
                      dragActive
                        ? 'opacity-45'
                        : 'opacity-0 group-hover/dropzone:opacity-25'
                    }`}
                  />

                  <div
                    className={`relative rounded-2xl border transition-all duration-300 ${
                      dragActive
                        ? 'border-violet-400/70 bg-violet-500/[0.06] shadow-[0_0_30px_rgba(139,92,246,0.18)]'
                        : 'border-violet-500/20 bg-[#0b0818]/30 group-hover/dropzone:border-violet-400/50'
                    }`}
                  >
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

                {/* ERROR MESSAGE */}
                {error && (
                  <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-xs leading-5">
                    {error}
                  </div>
                )}

                {/* AUDIO EXTRACTION STATUS */}
                {isProcessingAudio && (
                  <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-5">

                    <div className="flex items-center gap-3">
                      <LoaderCircle
                        size={19}
                        className="animate-spin text-violet-400 shrink-0"
                      />

                      <div>
                        <p className="text-white text-sm font-semibold">
                          Processing audio
                        </p>

                        <p className="text-slate-400 text-xs mt-1">
                          {processingStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIDEO UPLOAD PROGRESS */}
                {isUploading && (
                  <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-5">

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-white text-sm font-semibold">
                        <LoaderCircle
                          size={17}
                          className="animate-spin text-violet-400"
                        />
                        {uploadStage || 'Uploading lecture'}
                      </div>

                      <span className="text-violet-300 text-sm font-bold tabular-nums">
                        {uploadProgress}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-300"
                        style={{
                          width: `${uploadProgress}%`
                        }}
                      />
                    </div>

                    <p className="text-slate-400 text-xs mt-3">
                      Please keep this page open while your lecture is uploading.
                    </p>
                  </div>
                )}

                {/* SUCCESS MESSAGE */}
                {uploadedLecture && audioFile && (
                  <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">

                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      <CheckCircle2 size={19} />
                      Lecture uploaded successfully!
                    </div>

                    <p className="text-emerald-200/70 text-xs leading-6 mt-2">
                      Original lecture saved in the backend. Audio extracted successfully in your browser.
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-emerald-100/70">
                      <p>
                        <span className="text-emerald-300">Title:</span>{' '}
                        {uploadedLecture.title}
                      </p>

                      <p>
                        <span className="text-emerald-300">Subject:</span>{' '}
                        {uploadedLecture.subject}
                      </p>

                      <p>
                        <span className="text-emerald-300">Original file:</span>{' '}
                        {uploadedLecture.originalName}
                      </p>

                      <p>
                        <span className="text-emerald-300">Original size:</span>{' '}
                        {formatSize(uploadedLecture.size)}
                      </p>

                      <p>
                        <span className="text-emerald-300">Extracted audio:</span>{' '}
                        {audioFile.name}
                      </p>

                      <p>
                        <span className="text-emerald-300">Audio size:</span>{' '}
                        {formatSize(audioFile.size)}
                      </p>
                    </div>

                    {/* AUDIO PREVIEW */}
                    {audioPreviewUrl && (
                      <div className="mt-5 pt-4 border-t border-emerald-500/20">

                        <p className="text-white text-xs font-semibold mb-3">
                          Listen to extracted audio
                        </p>

                        <audio
                          controls
                          src={audioPreviewUrl}
                          className="w-full h-10"
                        />

                        <a
                          href={audioPreviewUrl}
                          download={audioFile.name}
                          className="inline-flex items-center gap-2 mt-4 text-emerald-300 hover:text-emerald-200 text-xs font-semibold"
                        >
                          <Download size={15} />
                          Download extracted MP3
                        </a>
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* LECTURE DETAILS */}
              <LectureDetailsForm
                title={title}
                setTitle={value => {
                  if (isBusy) return

                  setTitle(value)
                  resetUploadState()
                }}
                subject={subject}
                setSubject={value => {
                  if (isBusy) return

                  setSubject(value)
                  resetUploadState()
                }}
              />

              {/* PROCESS BUTTON */}
              <button
                type="submit"
                disabled={!file || isBusy || !!uploadedLecture}
                className="gradient-button w-full rounded-xl py-4 flex items-center justify-center gap-3 font-bold text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isProcessingAudio ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Extracting audio...
                  </>
                ) : isUploading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Uploading lecture...
                  </>
                ) : uploadedLecture ? (
                  <>
                    Completed
                    <CheckCircle2 size={18} />
                  </>
                ) : (
                  <>
                    Extract audio & upload lecture
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {uploadedLecture && (
                <p className="text-center text-slate-500 text-xs">
                  Audio is currently in your browser. Sending it to the transcription backend is our next step.
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
