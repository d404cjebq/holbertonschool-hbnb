from app.models.review import Review


def test_review_creation():
    review = Review(rating=4, comment="Nice place", user_id="user-123", place_id="place-456")
    assert review.rating == 4
    assert review.comment == "Nice place"
    print("Review creation test passed!")


def test_review_invalid_rating():
    try:
        Review(rating=10, comment="Bad rating", user_id="user-123", place_id="place-456")
        print("Test failed: should have raised ValueError")
    except ValueError:
        print("Review invalid rating test passed!")


test_review_creation()
test_review_invalid_rating()