import express from 'express';
import { gemini, pinecone } from '../utils/aiConfig.js';

const router = express.Router();
const THRESHOLD = 0.65; // Similarity threshold \tau[cite: 2]

router.post('/ask', async (req, res) => {
    const { videoId, question } = req.body;

    try {
        // 1. Embed Student Question
        const embeddingModel = gemini.getGenerativeModel({ model: "text-embedding-004" });
        const queryEmbedding = await embeddingModel.embedContent(question);

        // 2. Search Pinecone (Top 3-5 chunks)[cite: 2]
        const index = pinecone.index(process.env.PINECONE_INDEX);
        const searchResults = await index.query({
            vector: queryEmbedding.embedding.values,
            topK: 4,
            filter: { videoId: { $eq: videoId } }, // Keep lectures isolated[cite: 2]
            includeMetadata: true
        });

        // 3. Apply Similarity Threshold
        if (!searchResults.matches.length || searchResults.matches[0].score < THRESHOLD) {
            return res.json({ answer: "This topic is NOT IN LECTURE." });
        }

        // 4. Grounded Generation with Gemini[cite: 1, 2]
        let context = "";
        searchResults.matches.forEach((match, i) => {
            context += `[Source ${i+1} - Time: ${match.metadata.start}s to ${match.metadata.end}s]: ${match.metadata.text}\n`;
        });

        const generativeModel = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a helpful study assistant. Answer the student's question using ONLY the provided lecture sources below. 
        If the sources do not contain the answer, reply exactly with "NOT IN LECTURE". 
        After every sentence you write, you MUST cite the source number in brackets, e.g., [Source 1].\n\n
        Sources:\n${context}\n\nQuestion: ${question}`;

        const result = await generativeModel.generateContent(prompt);
        let answerText = result.response.text();

        res.json({ answer: answerText, sources: searchResults.matches.map(m => m.metadata) });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export default router;