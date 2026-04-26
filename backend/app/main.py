from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.feedback import router as feedback_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.database import init_db
    init_db()
    yield


app = FastAPI(title="Cafe Review API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://backend:8000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feedback_router)


@app.get("/health")
def health():
    return {"status": "ok"}
