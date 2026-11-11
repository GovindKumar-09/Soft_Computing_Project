
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

let ffmpegInstance
let ffmpegLoadPromise

// Load FFmpeg only once
async function getFFmpeg(onStatus) {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg()
  }

  if (!ffmpegLoadPromise) {
    ffmpegLoadPromise = (async () => {
      onStatus?.('Loading audio processing engine...')

      // ESM core is recommended for Vite
      const baseURL =
        'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm'

      await ffmpegInstance.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript'
        ),

        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm'
        )
      })
    })().catch(error => {
      ffmpegLoadPromise = null
      throw error
    })
  }

  await ffmpegLoadPromise

  return ffmpegInstance
}

// Extract audio from a video file
export async function extractAudioFromVideo(file, onStatus) {
  const extension =
    file.name.split('.').pop().toLowerCase()

  const id = Date.now()

  const inputName = `lecture-input-${id}.${extension}`
  const outputName = `lecture-audio-${id}.mp3`

  const ffmpeg = await getFFmpeg(onStatus)

  try {
    onStatus?.('Preparing video for audio extraction...')

    // Write selected video into FFmpeg's virtual filesystem
    await ffmpeg.writeFile(
      inputName,
      await fetchFile(file)
    )

    onStatus?.('Extracting audio in your browser...')

    // Extract and normalize audio for speech transcription
    await ffmpeg.exec([
      '-hide_banner',
      '-loglevel', 'error',
      '-i', inputName,
      '-map', '0:a:0',
      '-vn',
      '-ac', '1',
      '-ar', '16000',
      '-b:a', '48k',
      '-f', 'mp3',
      outputName
    ])

    onStatus?.('Preparing extracted audio...')

    const audioData = await ffmpeg.readFile(outputName)

    if (!audioData || audioData.length === 0) {
      throw new Error('The extracted audio file is empty.')
    }

    const audioFile = new File(
      [audioData],
      `${file.name.replace(/\.[^/.]+$/, '')}.mp3`,
      {
        type: 'audio/mpeg',
        lastModified: Date.now()
      }
    )

    return audioFile

  } catch (error) {
    console.error('Audio extraction error:', error)

    throw new Error(
      error.message?.includes('audio')
        ? error.message
        : 'Could not extract audio. Check that the video contains an audio track and try another file.'
    )

  } finally {
    // Release temporary files from FFmpeg's virtual filesystem
    try {
      await ffmpeg.deleteFile(inputName)
    } catch {}

    try {
      await ffmpeg.deleteFile(outputName)
    } catch {}
  }
}
