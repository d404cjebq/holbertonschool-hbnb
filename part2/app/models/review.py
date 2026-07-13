from app.models.base_model import BaseModel


class Review(BaseModel):
    def __init__(self, rating, comment, user_id, place_id):
        super().__init__()
        if not self.validate_rating(rating):
            raise ValueError("Rating must be between 1 and 5")
        if not comment:
            raise ValueError("Comment is required")

        self.rating = rating
        self.comment = comment
        self.user_id = user_id
        self.place_id = place_id

    def validate_rating(self, rating):
        return isinstance(rating, int) and 1 <= rating <= 5

    def edit_review(self, data):
        """Edit review fields"""
        self.update(data)