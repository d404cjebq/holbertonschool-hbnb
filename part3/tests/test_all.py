from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity


# ---------- User Tests ----------

def test_user_creation():
    user = User(first_name="John", last_name="Doe",
                email="john.doe@example.com", password="secret123")
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john.doe@example.com"
    assert user.is_admin is False
    assert user.is_active is True
    print("User creation test passed!")


def test_user_authenticate():
    user = User(first_name="Jane", last_name="Doe",
                email="jane.doe@example.com", password="mypassword")
    assert user.authenticate("mypassword") is True
    assert user.authenticate("wrongpassword") is False
    print("User authenticate test passed!")


def test_user_invalid_email():
    try:
        User(first_name="Bad", last_name="Email", email="not-an-email")
        print("Test failed: should have raised ValueError")
    except ValueError:
        print("User invalid email test passed!")


# ---------- Place Tests ----------

def test_place_creation():
    owner = User(first_name="Alice", last_name="Smith",
                 email="alice.smith@example.com")
    place = Place(title="Cozy Apartment", description="A nice place to stay",
                  price=100, latitude=37.7749, longitude=-122.4194,
                  owner_id=owner.id)

    assert place.title == "Cozy Apartment"
    assert place.price == 100
    assert place.owner_id == owner.id
    print("Place creation test passed!")


def test_place_add_review():
    place = Place(title="Beach House", description="Sea view",
                  price=200, latitude=10, longitude=20, owner_id="owner-1")
    review = Review(rating=5, comment="Amazing!", user_id="user-1", place_id=place.id)

    place.create_review(review)

    assert len(place.list_reviews()) == 1
    assert place.list_reviews()[0].comment == "Amazing!"
    print("Place add review test passed!")


def test_place_add_amenity():
    place = Place(title="Mountain Cabin", description="Cozy cabin",
                  price=150, latitude=30, longitude=40, owner_id="owner-2")
    wifi = Amenity(name="Wi-Fi")

    place.add_amenity(wifi)

    assert len(place.list_amenity()) == 1
    assert place.list_amenity()[0].name == "Wi-Fi"
    print("Place add amenity test passed!")


def test_place_invalid_price():
    try:
        Place(title="Bad Place", description="Invalid price",
              price=-50, latitude=0, longitude=0, owner_id="owner-3")
        print("Test failed: should have raised ValueError")
    except ValueError:
        print("Place invalid price test passed!")


# ---------- Review Tests ----------

def test_review_creation():
    review = Review(rating=4, comment="Nice place",
                     user_id="user-123", place_id="place-456")
    assert review.rating == 4
    assert review.comment == "Nice place"
    assert review.user_id == "user-123"
    assert review.place_id == "place-456"
    print("Review creation test passed!")


def test_review_invalid_rating():
    try:
        Review(rating=10, comment="Bad rating",
               user_id="user-123", place_id="place-456")
        print("Test failed: should have raised ValueError")
    except ValueError:
        print("Review invalid rating test passed!")


def test_review_missing_comment():
    try:
        Review(rating=3, comment="", user_id="user-123", place_id="place-456")
        print("Test failed: should have raised ValueError")
    except ValueError:
        print("Review missing comment test passed!")


# ---------- Amenity Tests ----------

def test_amenity_creation():
    amenity = Amenity(name="Wi-Fi", description="High-speed internet")
    assert amenity.name == "Wi-Fi"
    assert amenity.description == "High-speed internet"
    print("Amenity creation test passed!")


def test_amenity_invalid_name():
    try:
        Amenity(name="")
        print("Test failed: should have raised ValueError")
    except ValueError:
        print("Amenity invalid name test passed!")


# ---------- Run All Tests ----------

if __name__ == "__main__":
    test_user_creation()
    test_user_authenticate()
    test_user_invalid_email()

    test_place_creation()
    test_place_add_review()
    test_place_add_amenity()
    test_place_invalid_price()

    test_review_creation()
    test_review_invalid_rating()
    test_review_missing_comment()

    test_amenity_creation()
    test_amenity_invalid_name()

    print("\nAll tests passed successfully!")