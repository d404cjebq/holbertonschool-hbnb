from app.models.base_model import BaseModel


class Amenity(BaseModel):
    def __init__(self, name, description=""):
        super().__init__()
        if not name or len(name) > 50:
            raise ValueError("Amenity name is required and must be <= 50 characters")

        self.name = name
        self.description = description
        self.places = []

    def assign_to_place(self, place):
        """Assign this amenity to a place (many-to-many)"""
        if place not in self.places:
            self.places.append(place)
            place.add_amenity(self)

    def remove_from_place(self, place):
        """Remove this amenity from a place"""
        if place in self.places:
            self.places.remove(place)
            place.remove_amenity(self)