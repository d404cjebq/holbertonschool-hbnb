"""Defines the PlaceAmenity class"""


class PlaceAmenity:
    """Represents the link between a Place and an Amenity"""

    def __init__(self, place_id, amenity_id):
        """Initialize a new PlaceAmenity instance

        Args:
            place_id (str): the UUID4 of the associated Place
            amenity_id (str): the UUID4 of the associated Amenity
        """
        self.place_id = place_id
        self.amenity_id = amenity_id