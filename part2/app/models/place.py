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

    def remove_amenity(self, amenity):
        """Remove an amenity from this place"""
        if amenity in self.amenities:
            self.amenities.remove(amenity)

    def calculate_average_rating(self):
        """Calculate the average rating from all reviews"""
        if not self.reviews:
            return 0
        total = sum(review.rating for review in self.reviews)
        return total / len(self.reviews)

    def update_details(self, data):
        """Update place details"""
        self.update(data)

    def add_review(self, review):
        self.reviews.append(review)

    def list_amenities(self):
        return self.amenities

    def list_reviews(self):
        return self.reviews