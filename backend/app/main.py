from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.routers import translate, signs
from app.services.gemini import init_gemini


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    settings = get_settings()
    if settings.gemini_api_key:
        init_gemini(settings.gemini_api_key)
        print("Gemini API initialized")
    else:
        print("WARNING: GEMINI_API_KEY not set")
    yield
    # Shutdown
    print("Shutting down...")


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Real-time Sign Language Translation API powered by Gemini 3",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(translate.router, prefix="/api/translate", tags=["Translation"])
app.include_router(signs.router, prefix="/api/signs", tags=["Signs"])


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": bool(settings.gemini_api_key),
    }
