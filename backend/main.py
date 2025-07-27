from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import routes

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://controlverse-frontend.vercel.app", # Example frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)
