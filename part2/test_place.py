from app.models.place import Place
from app.models.user import User
from app.models.review import Review
from app.models.amenity import Amenity


def test_place_creation():
    owner = User(first_name="Alice", last_name="Smith", email="alice.smith@example.com")
    place = Place(title="Cozy Apartment", description="A nice place to stay",
                  price=100, latitude=37.7749, longitude=-122.4194, owner_id=owner.id)

    review = Review(rating=5, comment="Great stay!", user_id=owner.id, place_id=place.id)
    place.add_review(review)

    wifi = Amenity(name="Wi-Fi")
    place.add_amenity(wifi)

    assert place.title == "Cozy Apartment"
    assert place.price == 100
    assert len(place.reviews) == 1
    assert place.reviews[0].comment == "Great stay!"
    assert len(place.amenities) == 1
    assert place.calculate_average_rating() == 5
    print("Place creation and relationship test passed!")


test_place_creation()