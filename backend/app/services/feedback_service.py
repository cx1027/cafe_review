from sqlalchemy.orm import Session
from app.models.feedback import Feedback, FavoriteAspect
from app.schemas.feedback import FeedbackCreate


def create_feedback(db: Session, data: FeedbackCreate) -> Feedback:
    feedback = Feedback(
        email=data.email,
        comment=data.comment,
        rating=data.rating,
        favorite_aspect=FavoriteAspect(data.favorite_aspect),
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def list_feedback(db: Session) -> list[Feedback]:
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()
