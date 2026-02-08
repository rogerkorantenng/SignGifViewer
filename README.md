# SignBridge

Real-time Sign Language Translator powered by Gemini 3.

![SignBridge Demo](./docs/demo.gif)

## Overview

SignBridge breaks communication barriers by providing real-time translation between sign language and text. Built for the **Gemini 3 Hackathon** by Google DeepMind.

### Features

- **Sign to Text**: Real-time translation of sign language gestures using your webcam
- **Text to Sign**: Learn how to sign any word or phrase with step-by-step guidance
- **Multiple Languages**: Support for ASL (American Sign Language), with more coming soon
- **Privacy First**: No data is stored - all processing happens in real-time

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, MediaPipe |
| AI | Google Gemini 3 API |
| Deployment | Vercel (FE), Railway (BE) |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    Next.js 14 (React)                       │
│              WebRTC Camera → Base64 Frames                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API / WebSocket
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Python Backend                          │
│                   FastAPI + Uvicorn                          │
│                                                              │
│  MediaPipe (Hand Detection) → Gemini 3 (Translation)        │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/signbridge.git
   cd signbridge
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies
   npm run install:all

   # Or manually:
   npm install
   cd backend && pip install -r requirements.txt
   ```

3. **Configure environment variables**

   Frontend (`frontend/.env.local`):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   Backend (`backend/.env`):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development servers**
   ```bash
   # Run both frontend and backend
   npm run dev

   # Or run separately:
   npm run dev:frontend  # http://localhost:3000
   npm run dev:backend   # http://localhost:8000
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Translation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/translate/frame` | POST | Translate a single image frame |
| `/api/translate/stream` | WebSocket | Real-time video translation |

### Sign Guidance

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/signs/guidance` | POST | Get signing instructions for text |
| `/api/signs/alphabet/{letter}` | GET | Get guidance for a single letter |
| `/api/signs/common` | GET | List common signs |

### Health

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check API health status |

## Gemini 3 Integration

SignBridge leverages Gemini 3's multimodal capabilities:

1. **Image Understanding**: Gemini analyzes webcam frames to identify hand shapes, positions, and movements
2. **Contextual Translation**: Uses reasoning to translate gesture sequences into coherent text
3. **Instructional Generation**: Creates detailed signing instructions with hand position descriptions

```python
# Example: Translating a sign language gesture
response = model.generate_content([
    "Identify the sign language gesture in this image",
    image_data
])
```

## Project Structure

```
signbridge/
├── frontend/                 # Next.js application
│   ├── app/                  # App router pages
│   ├── components/           # React components
│   └── lib/                  # Utilities and store
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── routers/          # API endpoints
│   │   ├── services/         # Business logic
│   │   └── models/           # Pydantic schemas
│   └── requirements.txt
├── docs/                     # Documentation
└── README.md
```

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL`

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set root directory to `backend`
3. Add environment variable: `GEMINI_API_KEY`

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Acknowledgments

- Google DeepMind for Gemini 3 API access
- MediaPipe team for hand detection models
- The deaf and hard-of-hearing community for inspiration

---

Built with ❤️ for the Gemini 3 Hackathon 2026
