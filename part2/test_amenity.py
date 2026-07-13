from app.models.amenity import Amenity
from app.models.place import Place


def test_amenity_creation():
    amenity = Amenity(name="Wi-Fi")
    assert amenity.name == "Wi-Fi"
    print("Amenity creation test passed!")


def test_amenity_assign_to_place():
    amenity = Amenity(name="Parking")
    place = Place(title="Beach House", description="Sea view",
                  price=200, latitude=10, longitude=20, owner_id="fake-owner-id")

    amenity.assign_to_place(place)
    assert place in amenity.places
    assert amenity in place.amenities
    print("Amenity assign to place test passed!")


test_amenity_creation()
test_amenity_assign_to_place()