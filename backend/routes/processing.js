import express from 'express';
import fs from 'fs';
import { openai, gemini, pinecone } from '../utils/aiConfig.js';
// Assume Video and Transcript are Mongoose models imported here

const router = express.Router();

router.post('/process/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        // 1. Get audio file path from DB (Assuming already uploaded via Multer)
        const audioFilePath = `./uploads/${videoId}.mp3`; 

        // 2. Whisper API Transcription
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: "whisper-1",
            response_format: "verbose_json", // Gets timestamps
        });

        // 3. Chunking (approx 300-500 words per chunk)[cite: 2]
        const chunks = [];
        let currentChunk = "";
        let startTime = transcription.segments[0].start;
        
        transcription.segments.forEach((seg, index) => {
            currentChunk += seg.text + " ";
            // Simple logic: chunk every 5 segments
            if ((index + 1) % 5 === 0 || index === transcription.segments.length - 1) {
                chunks.push({ text: currentChunk, start: startTime, end: seg.end });
                currentChunk = "";
                if (index < transcription.segments.length - 1) {
                    startTime = transcription.segments[index + 1].start;
                }
            }
        });

        // 4. Generate Embeddings & Store in Pinecone[cite: 2]
        const embeddingModel = gemini.getGenerativeModel({ model: "text-embedding-004" });
        const index = pinecone.index(process.env.PINECONE_INDEX);
        
        const vectors = await Promise.all(chunks.map(async (chunk, i) => {
            const result = await embeddingModel.embedContent(chunk.text);
            return {
                id: `${videoId}-chunk-${i}`,
                values: result.embedding.values,
                metadata: { videoId, text: chunk.text, start: chunk.start, end: chunk.end }
            };
        }));

        await index.upsert(vectors);
        res.json({ success: true, message: "Processing completed" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export default router;