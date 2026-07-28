from app.models.base_model import BaseModel


class Amenity(BaseModel):
    def __init__(self, name, description=""):
        super().__init__()
        if not name or len(name) > 50:
            raise ValueError("Amenity name is required and must be <= 50 characters")

        self.name = name
        self.description = description

    def create_amenity(self):
        """Register this amenity (placeholder, actual persistence via facade)"""
        self.save()