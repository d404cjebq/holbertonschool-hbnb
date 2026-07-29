from app.models.base_model import BaseModel
from app.models.user import User
from app.models.place import Place


class Review(BaseModel):
    def __init__(self, rating, text, place, user):
        super().__init__()
        if not self.validate_rating(rating):
            raise ValueError("Rating must be between 1 and 5")
        if not text:
            raise ValueError("Text is required")
        if not isinstance(place, Place):
            raise ValueError("place must be a valid Place instance")
        if not isinstance(user, User):
            raise ValueError("user must be a valid User instance")

        self.rating = rating
        self.text = text
        self.place = place
        self.user = user

    def validate_rating(self, rating):
        return isinstance(rating, int) and 1 <= rating <= 5