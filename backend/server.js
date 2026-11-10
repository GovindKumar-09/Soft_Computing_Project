import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import processingRoutes from './routes/processing.js';
import chatRoutes from './routes/chat.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Connects to Vite React frontend[cite: 2]
app.use(express.json());

// Routes setup[cite: 2]
app.use('/api/videos', processingRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});