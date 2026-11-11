import { authenticatedFetch, getAccessToken } from './authService'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '')



// --------------------------------------------------
// COMMON GET REQUEST
// --------------------------------------------------

async function getData(endpoint) {
  let response

  try {
    response = await authenticatedFetch(`${API_URL}${endpoint}`)
  } catch {
    throw new Error('Unable to connect to FastAPI backend')
  }

  let data

  try {
    data = await response.json()
  } catch {
    throw new Error('Invalid response from FastAPI')
  }

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || 'Request failed'
    )
  }

  return data
}


// --------------------------------------------------
// FILE UPLOAD REQUEST
// --------------------------------------------------

function sendFile(endpoint, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('POST', `${API_URL}${endpoint}`)
    const token = getAccessToken()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = event => {
      if (event.lengthComputable && onProgress) {
        onProgress(
          Math.round((event.loaded / event.total) * 100)
        )
      }
    }

    xhr.onload = () => {
      let response

      try {
        response = JSON.parse(xhr.responseText)
      } catch {
        reject(new Error('Invalid response from FastAPI'))
        return
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(response)
      } else {
        if (xhr.status === 401) window.dispatchEvent(new Event('auth:expired'))
        reject(
          new Error(
            response.detail ||
            response.message ||
            'Upload failed'
          )
        )
      }
    }

    xhr.onerror = () => {
      reject(
        new Error('Unable to connect to FastAPI backend')
      )
    }

    xhr.onabort = () => {
      reject(new Error('Upload cancelled'))
    }

    xhr.send(formData)
  })
}


// --------------------------------------------------
// UPLOAD ORIGINAL VIDEO
// --------------------------------------------------

export function uploadLecture({
  file,
  title,
  subject,
  onProgress
}) {
  const formData = new FormData()

  formData.append('lecture', file)
  formData.append('title', title)
  formData.append('subject', subject)

  return sendFile(
    '/api/lectures/upload',
    formData,
    onProgress
  )
}


// --------------------------------------------------
// UPLOAD EXTRACTED AUDIO + TRANSCRIPTION + SUMMARY
// --------------------------------------------------

export function uploadExtractedAudio({
  audioFile,
  lectureId,
  videoStoredName = '',
  onProgress
}) {
  const formData = new FormData()

  formData.append('audio', audioFile)
  formData.append('lectureId', lectureId)
  formData.append('videoStoredName', videoStoredName)

  return sendFile(
    '/api/lectures/audio',
    formData,
    onProgress
  )
}


// --------------------------------------------------
// GET ALL SAVED LECTURES — MY LECTURES PAGE
// --------------------------------------------------

export function getLectures() {
  return getData('/api/lectures')
}


// --------------------------------------------------
// GET ONE LECTURE — COMPLETE DETAILS
// --------------------------------------------------

export function getLecture(lectureId) {
  if (!lectureId) {
    throw new Error('Lecture ID is required')
  }

  return getData(
    `/api/lectures/${encodeURIComponent(lectureId)}`
  )
}


// --------------------------------------------------
// GET GENERATED SUMMARY — SUMMARY PAGE
// --------------------------------------------------

export function getLectureSummary(lectureId) {
  if (!lectureId) {
    throw new Error('Lecture ID is required')
  }

  return getData(
    `/api/lectures/${encodeURIComponent(lectureId)}/summary`
  )
}


// --------------------------------------------------
// GENERATE QUIZ — QUIZ PAGE
// --------------------------------------------------

export function getLectureQuiz(lectureId, numQuestions = 10) {
  if (!lectureId) {
    throw new Error('Lecture ID is required')
  }

  return getData(
    `/api/lectures/${encodeURIComponent(lectureId)}/quiz?num_questions=${numQuestions}`
  )
}