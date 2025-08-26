from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from api.routes import router

# Explicitly load env from backend/.env so running uvicorn from project root works
_ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)

app = FastAPI(title="ControlVerse API")

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the ControlVerse API"}

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://controlverse-frontend.vercel.app", # Example frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
