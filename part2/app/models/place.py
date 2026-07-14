from app.models.base_model import BaseModel


class Place(BaseModel):
    def __init__(self, title, description, price, latitude, longitude, owner_id):
        super().__init__()
        if not title or len(title) > 100:
            raise ValueError("Title is required and must be <= 100 characters")
        if price < 0:
            raise ValueError("Price must be positive")
        if not (-90 <= latitude <= 90):
            raise ValueError("Latitude must be between -90 and 90")
        if not (-180 <= longitude <= 180):
            raise ValueError("Longitude must be between -180 and 180")

        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner_id = owner_id
        self.reviews = []
        self.amenities = []

    def add_amenity(self, amenity):
        """Add an amenity to this place (many-to-many)"""
        if amenity not in self.amenities:
            self.amenities.append(amenity)

    def list_amenity(self):
        """List all amenities for this place"""
        return self.amenities

    def list_reviews(self):
        """List all reviews for this place"""
        return self.reviews

    def create_review(self, review):
        """Attach a newly created review to this place"""
        self.reviews.append(review)