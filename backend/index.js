
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const app = express()

const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const videoUploadDir = path.join(__dirname, 'uploads', 'videos')
const audioUploadDir = path.join(__dirname, 'uploads', 'audio')

// Create storage directories
fs.mkdirSync(videoUploadDir, { recursive: true })
fs.mkdirSync(audioUploadDir, { recursive: true })

app.use(cors({ origin: CLIENT_URL }))
app.use(express.json())

// Supported formats
const videoExtensions = new Set([
  '.mp4',
  '.mov',
  '.webm',
  '.mp3',
  '.wav',
  '.m4a'
])

const audioExtensions = new Set([
  '.mp3',
  '.wav',
  '.m4a'
])

// File validation
const createFileFilter = (extensions, type) => {
  return (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()

    const validMime =
      file.mimetype.startsWith(type) ||
      file.mimetype === 'application/octet-stream'

    if (!extensions.has(extension) || !validMime) {
      return cb(new Error(`Unsupported ${type} file format`))
    }

    cb(null, true)
  }
}

// Create disk storage
const createStorage = destination => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination)
    },

    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase()
      cb(null, `${crypto.randomUUID()}${extension}`)
    }
  })
}

// Video upload configuration
const videoUpload = multer({
  storage: createStorage(videoUploadDir),
  limits: {
    fileSize: 500 * 1024 * 1024,
    files: 1,
    fields: 2,
    fieldSize: 200,
    parts: 3
  },
  fileFilter: createFileFilter(videoExtensions, 'video')
})

// Audio upload configuration
const audioUpload = multer({
  storage: createStorage(audioUploadDir),
  limits: {
    fileSize: 500 * 1024 * 1024,
    files: 1,
    fields: 2,
    fieldSize: 200,
    parts: 3
  },
  fileFilter: createFileFilter(audioExtensions, 'audio')
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Lecture backend is running'
  })
})

// Upload original lecture video/audio
app.post(
  '/api/lectures/upload',
  videoUpload.single('lecture'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please select a lecture file'
        })
      }

      const title = req.body.title?.trim()
      const subject = req.body.subject?.trim()

      if (!title || !subject) {
        await fs.promises.unlink(req.file.path)

        return res.status(400).json({
          success: false,
          message: 'Lecture title and subject are required'
        })
      }

      const lectureId = crypto.randomUUID()

      const videoUrl =
        `/api/videos/${encodeURIComponent(req.file.filename)}`

      res.status(201).json({
        success: true,
        message: 'Lecture uploaded successfully',

        lecture: {
          id: lectureId,
          title,
          subject,
          originalName: req.file.originalname,
          storedName: req.file.filename,
          size: req.file.size,
          mimeType: req.file.mimetype,
          videoUrl,
          status: 'uploaded'
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

// Upload extracted audio
app.post(
  '/api/lectures/audio',
  audioUpload.single('audio'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an audio file'
        })
      }

      const lectureId = req.body.lectureId?.trim()
      const videoStoredName = req.body.videoStoredName?.trim()

      if (!lectureId || !videoStoredName) {
        await fs.promises.unlink(req.file.path)

        return res.status(400).json({
          success: false,
          message: 'Lecture ID and video filename are required'
        })
      }

      // Prevent path traversal
      if (path.basename(videoStoredName) !== videoStoredName) {
        await fs.promises.unlink(req.file.path)

        return res.status(400).json({
          success: false,
          message: 'Invalid video filename'
        })
      }

      // Check that the original video exists
      const videoPath = path.join(videoUploadDir, videoStoredName)

      try {
        await fs.promises.access(videoPath)
      } catch {
        await fs.promises.unlink(req.file.path)

        return res.status(404).json({
          success: false,
          message: 'Original lecture video was not found'
        })
      }

      const audioUrl =
        `/api/audio/${encodeURIComponent(req.file.filename)}`

      res.status(201).json({
        success: true,
        message: 'Extracted audio saved successfully',

        audio: {
          lectureId,
          videoStoredName,
          originalName: req.file.originalname,
          storedName: req.file.filename,
          size: req.file.size,
          mimeType: req.file.mimetype,
          audioUrl,
          status: 'saved'
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

// Serve original video
app.get('/api/videos/:filename', (req, res, next) => {
  const filename = req.params.filename

  if (path.basename(filename) !== filename) {
    return res.sendStatus(400)
  }

  const filePath = path.join(videoUploadDir, filename)

  res.sendFile(filePath, error => {
    if (error && !res.headersSent) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          message: 'Video not found'
        })
      }

      next(error)
    }
  })
})

// Serve extracted audio
app.get('/api/audio/:filename', (req, res, next) => {
  const filename = req.params.filename

  if (path.basename(filename) !== filename) {
    return res.sendStatus(400)
  }

  const filePath = path.join(audioUploadDir, filename)

  res.sendFile(filePath, error => {
    if (error && !res.headersSent) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          message: 'Audio not found'
        })
      }

      next(error)
    }
  })
})

// Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  if (error instanceof multer.MulterError) {
    const status =
      error.code === 'LIMIT_FILE_SIZE' ? 413 : 400

    return res.status(status).json({
      success: false,
      message:
        error.code === 'LIMIT_FILE_SIZE'
          ? 'File size cannot exceed 500 MB'
          : error.message
    })
  }

  res.status(400).json({
    success: false,
    message: error.message || 'Something went wrong'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})
