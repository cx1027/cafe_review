from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.db_base import Base

_engine = None
_SessionLocal = None


def get_engine():
    global _engine
    if _engine is None:
        import os
        from dotenv import load_dotenv
        load_dotenv()
        DATABASE_URL = os.getenv(
            "DATABASE_URL",
            "postgresql://postgres:postgres@localhost:5432/cafe_review"
        )
        _engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    return _engine


def get_session_local():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return _SessionLocal


def get_db():
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models.feedback import Feedback
    Base.metadata.create_all(bind=get_engine())
