from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone
import enum
from app.core.db_base import Base


class FavoriteAspect(str, enum.Enum):
    Food = "Food"
    Coffee = "Coffee"
    Service = "Service"
    Atmosphere = "Atmosphere"


def utcnow():
    return datetime.now(timezone.utc)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False)
    comment = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)
    favorite_aspect = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)
