from app.models.base_model import BaseModel


class PlaceAmenity(BaseModel):
    def __init__(self, place_id, amenity_id):
        super().__init__()
        self.place_id = place_id
        self.amenity_id = amenity_id