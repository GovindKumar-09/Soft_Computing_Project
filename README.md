# AI-Powered Lecture Review Platform

Speech Recognition and Retrieval-Augmented Generation for Time-Stamped Study Assistance.

## Overview
This platform allows students to efficiently study from recorded lectures by converting audio into time-stamped, searchable transcripts using OpenAI Whisper. Built on a Retrieval-Augmented Generation (RAG) architecture, it uses Google Gemini and Pinecone to answer student questions strictly from the lecture context, providing clickable timestamp citations. 

## Core Features
*   **Browser Audio Extraction**: Uses `FFmpeg.wasm` to extract audio tracks locally in the browser, saving server upload bandwidth and processing time.
*   **Time-Stamped Grounding**: Every AI-generated answer includes source markers (timestamps), allowing students to click and jump to the exact moment in the transcript.
*   **Instructor in the Loop**: Lecturers maintain control by correcting technical terms in the transcript and approving AI-generated quizzes before they are published to students.
*   **Fuzzy Logic Recommendations**: Uses a fuzzy membership function to evaluate quiz accuracy and rank weak topics for targeted revision recommendations.

## Technology Stack
*   **Frontend**: React, Vite, Tailwind CSS
*   **Backend**: Node.js, Express, Mongoose, JWT
*   **Databases**: MongoDB (Application data), Pinecone (Vector database)
*   **AI Services**: OpenAI Whisper API, Google Gemini API

## Project Structure
```text
SoftComputing/
│
├── backend/
│   ├── routes/          # API endpoints (auth, processing, chat, etc.)
│   ├── utils/           # AI configs and Fuzzy logic helpers
│   ├── server.js        # Main Express entry point
│   ├── .env             # API keys and secrets
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (Upload, Chat, etc.)
│   │   ├── App.jsx      # Main layout
│   │   └── main.jsx
│   ├── .env             # Frontend environment variables
│   └── package.json
│
└── README.md