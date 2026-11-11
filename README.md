# AI-Powered Lecture Learning Assistant

React/Vite frontend and FastAPI backend for authenticated lecture uploads, speech-to-text, structured study notes, lecture-specific RAG chat, and generated quizzes.

## Local setup

1. Copy `backend/.env.example` to `backend/.env`, add your MongoDB, Groq, Gemini, and Pinecone credentials, and set `JWT_SECRET` to a cryptographically random value of at least 32 characters. Keep `.env` private and out of version control.
2. In PowerShell, start the backend:

   ```powershell
   cd backend
   .\.venv\Scripts\Activate.ps1
   python -m uvicorn main:app --host 127.0.0.1 --port 8000
   ```

3. Copy `frontend/.env.example` to `frontend/.env` if needed. From another terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. Create an account in the app, upload a lecture, and open its Notes, Transcript, Quiz, or AI Chat page. The backend stores users and lectures in `youtube_video_rag`.

## Processing flow

The browser extracts audio from video with FFmpeg.wasm. FastAPI transcribes it with Groq Whisper, saves the combined transcript, generates structured notes with the Groq LangChain model, and indexes transcript chunks in Pinecone with `video_id` and authenticated email metadata. Chat retrieval filters by both values. Quiz questions are generated from the selected lecture transcript.

`GET /api/health` reports backend, MongoDB, Groq, Gemini, and Pinecone configuration. Cloud provider calls require valid credentials, network access, and an appropriately configured Pinecone index.

## Backend modules

- `backend/main.py` assembles the FastAPI app, middleware, routers, and health endpoint.
- `backend/app/api/routes/` contains HTTP validation, authentication, and response handling.
- `backend/app/core/` owns configuration, MongoDB connections, and authentication primitives.
- `backend/app/services/` owns uploads, transcription, lecture processing, summaries, quizzes, embeddings, retrieval, and chat.
- `backend/app/services/chains.py` builds LangChain Expression Language chains by composing prompt templates, the shared chat model, and `StrOutputParser`. Summary generation, quiz generation, and RAG answers all use these chains.

## Authentication

Registration and login issue 12-hour HMAC-signed bearer tokens. Passwords are stored as salted PBKDF2-SHA256 hashes. By default, the browser keeps a session token until the tab session ends; “Remember me” persists it in local storage. The API derives lecture ownership from the verified account and checks ownership on lecture, transcript, quiz, video, ingestion, and chat operations. Use HTTPS in deployment and keep `JWT_SECRET` stable and private.
