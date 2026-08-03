from app import db
from app.models.base_model import BaseModel
from sqlalchemy.orm import validates

class Review(BaseModel):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(1000), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    @validates('text')
    def validate_text(self, key, value):
        if not value:
            raise ValueError("Review text is required")
        return value

    @validates('rating')
    def validate_rating(self, key, value):
        if not (1 <= value <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return value
