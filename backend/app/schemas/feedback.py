from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Literal
from datetime import datetime


VALID_ASPECTS = Literal["Food", "Coffee", "Service", "Atmosphere"]


class FeedbackCreate(BaseModel):
    email: EmailStr
    comment: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)
    favorite_aspect: VALID_ASPECTS

    @field_validator("rating")
    @classmethod
    def rating_must_be_integer(cls, v: int) -> int:
        if not isinstance(v, int):
            raise ValueError("rating must be an integer")
        return v


class FeedbackResponse(BaseModel):
    id: int
    email: str
    comment: str
    rating: int
    favorite_aspect: str
    created_at: datetime

    model_config = {"from_attributes": True}
