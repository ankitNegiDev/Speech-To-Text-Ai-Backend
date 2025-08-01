# Speech to Text AI — Backend

This is the backend for the **Speech to Text AI** application. It handles audio transcription, translation (coming soon), user history, and file storage. Built with **Express.js**, it exposes a REST API and integrates with key services like **AssemblyAI**, **DeepL**, **MongoDB**, **Cloudinary**, and optional **Clerk** authentication.

🔗 Check out the live frontend here: [Speech to Text AI Frontend](https://speech-to-text-ai-frontend.vercel.app)

This backend supports:

- Uploading and storing audio files
- Transcribing audio to text
- Saving and retrieving user transcription history
- Translating transcriptions (**coming soon**) — backend implementation is complete; only integration with a free translation API (e.g., DeepL) remains.
- Guest mode (in-memory storage)
- API rate limiting and caching for optimal performance

---

## Live API

- [live backend deployed link on render is ](https://speech-to-text-ai-backend-tm9n.onrender.com/)

---

## Features

- 🎙️ Audio transcription using **AssemblyAI**
- 🌐 Translation via **DeepL API** — _coming soon_
- 💾 Persistent transcription & translation storage using **MongoDB**
- 🧠 Temporary guest transcription using in-memory storage
- ☁️ Audio file upload and hosting via **Cloudinary**
- 🔐 Authentication middleware powered by **Clerk** (optional)
- 🚦 Request throttling using custom **API rate limiter**
- ⚡ Smart caching for translations — previously translated texts are stored in DB to avoid redundant API calls and reduce costs

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js** — core backend framework
- **MongoDB** + **Mongoose** — database & ODM for storing transcriptions and translations
- **AssemblyAI API** — for speech-to-text transcription
- **DeepL API** — for future multilingual translation support
- **Cloudinary** — for hosting and streaming uploaded audio files
- **Multer** — for handling multipart/form-data file uploads
- **Clerk** — for user authentication (optional, used for auth-protected routes)
- **express-rate-limit** — for request throttling and abuse prevention

---

## Folder Structure

```plaintext
src/
├── config/             # DB, Clerk, Cloudinary, API configs
│   ├── apiConfig.js
│   ├── clerkConfig.js
│   ├── cloudinaryConfig.js
│   ├── dbConfig.js
│   └── serverConfig.js
├── controller/         # Route logic (audio/transcription)
│   └── audioController.js
├── middleware/         # Middleware (rate limiter, multer, auth)
│   ├── multer.js
│   ├── multerErrorHandler.js
│   └── rateLimiter.js
├── repository/         # DB interaction logic
│   └── audioRepository.js
├── routes/             # API route declarations
│   ├── apiRoutes.js
│   └── audioRoutes.js
├── schema/             # Mongoose schemas
│   ├── transcriptionSchema.js
│   └── translationSchema.js
├── services/           # Logic for AssemblyAI / DeepL
│   └── audioService.js
├── utils/              # Helper utilities
│   ├── speechToText.js
│   └── translationUtil.js
├── validations/        # Input validation
│   └── audioValidations.js
└── server.js           # Entry point

---

## ⚙️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/speech-to-text-ai-backend.git
cd speech-to-text-ai-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ASSEMBLY_API_KEY=your_assemblyai_api_key
DEEPL_API_KEY=your_deepl_api_key
CLERK_SECRET_KEY=your_clerk_backend_key
FRONTEND_URL=https://your-frontend-app.com
```

> Replace placeholders with your actual config values.

### 4. Run the Server

```bash
npm run dev
```

Server should start on `http://localhost:5000` (or your specified port).

---

## 🔄 Key API Routes

### 🎙️ Transcription Routes

- `POST /api/audio/upload` — Upload audio and transcribe (supports guest + authenticated users)
- `GET /api/audio/:id` — Get a specific transcription by ID
- `PUT /api/audio/:id` — Update a transcription (e.g., edit title) — **auth only**
- `DELETE /api/audio/:id` — Delete a transcription and its audio — **auth only**
- `GET /api/audio/history` — Fetch transcription history for the logged-in user — **auth only**

### 🌐 Translation Route

- `POST /api/audio/:id/translate` — Translate a transcription using DeepL (or other APIs)  
  > Uses **backend caching**: If the same text was translated before, it returns the cached version instead of making a new API call.

### Auth & Guest Support

- Middleware automatically differentiates guests and logged-in users

---

## Coming Soon

- Redis integration for rate limiting and caching

---

## 📄 License

MIT License — free for personal or commercial use.
