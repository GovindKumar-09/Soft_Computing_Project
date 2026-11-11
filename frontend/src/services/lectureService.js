
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Common upload handler
function sendFile(endpoint, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('POST', `${API_URL}${endpoint}`)

    xhr.upload.onprogress = event => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round(
          (event.loaded / event.total) * 100
        )

        onProgress(progress)
      }
    }

    xhr.onload = () => {
      let response

      try {
        response = JSON.parse(xhr.responseText)
      } catch {
        reject(new Error('Invalid response received from backend'))
        return
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(response)
      } else {
        reject(
          new Error(response.message || 'File upload failed')
        )
      }
    }

    xhr.onerror = () => {
      reject(new Error('Unable to connect to backend'))
    }

    xhr.onabort = () => {
      reject(new Error('Upload was cancelled'))
    }

    xhr.send(formData)
  })
}

// Upload original lecture
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

// Upload extracted audio
export function uploadExtractedAudio({
  audioFile,
  lectureId,
  videoStoredName,
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
