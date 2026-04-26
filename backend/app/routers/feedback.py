from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.services import feedback_service

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def post_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    return feedback_service.create_feedback(db, data)


@router.get("", response_model=list[FeedbackResponse])
def get_feedback(db: Session = Depends(get_db)):
    return feedback_service.list_feedback(db)
