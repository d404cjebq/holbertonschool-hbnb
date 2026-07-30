from app.persistence.repository import InMemoryRepository, SQLAlchemyRepository
from app.models.user import User
from app.models.amenity import Amenity
from app.models.place import Place
from app.models.review import Review


class HBnBFacade:
    def __init__(self):
        self.user_repo = SQLAlchemyRepository(User)
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)

    def get_all_users(self):
        return self.user_repo.get_all()

    def update_user(self, user_id, user_data):
        user = self.user_repo.get(user_id)
        if not user:
            return None

        if 'email' in user_data:
            user.validate_email(user_data['email'])

        if 'password' in user_data:
            password = user_data.pop('password')
            if len(password) < 8:
                raise ValueError('Password must be at least 8 characters long')
            user.hash_password(password)

        self.user_repo.update(user_id, user_data)
        return user

    def create_amenity(self, amenity_data):
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, amenity_data):
        amenity = self.amenity_repo.get(amenity_id)
        if not amenity:
            return None
        self.amenity_repo.update(amenity_id, amenity_data)
        return amenity

    def create_place(self, place_data):
        owner_id = place_data.get('owner_id')
        owner = self.user_repo.get(owner_id)
        if not owner:
            raise ValueError('Owner not found')

        amenity_ids = place_data.pop('amenities', [])

        place = Place(
            title=place_data['title'],
            description=place_data.get('description', ''),
            price=place_data['price'],
            latitude=place_data['latitude'],
            longitude=place_data['longitude'],
            owner=owner
        )

        for amenity_id in amenity_ids:
            amenity = self.amenity_repo.get(amenity_id)
            if amenity:
                place.add_amenity(amenity)

        self.place_repo.add(place)
        return place

    def get_place(self, place_id):
        return self.place_repo.get(place_id)

    def get_all_places(self):
        return self.place_repo.get_all()

    def update_place(self, place_id, place_data):
        place = self.place_repo.get(place_id)
        if not place:
            return None

        if 'price' in place_data and place_data['price'] < 0:
            raise ValueError('Price must be positive')
        if 'latitude' in place_data and not (-90 <= place_data['latitude'] <= 90):
            raise ValueError('Latitude must be between -90 and 90')
        if 'longitude' in place_data and not (-180 <= place_data['longitude'] <= 180):
            raise ValueError('Longitude must be between -180 and 180')

        self.place_repo.update(place_id, place_data)
        return place

    def create_review(self, review_data):
        user_id = review_data.get('user_id')
        place_id = review_data.get('place_id')

        user = self.user_repo.get(user_id)
        if not user:
            raise ValueError('User not found')

        place = self.place_repo.get(place_id)
        if not place:
            raise ValueError('Place not found')

        review = Review(
            rating=review_data['rating'],
            text=review_data['text'],
            place=place,
            user=user
        )

        self.review_repo.add(review)
        place.add_review(review)
        return review

    def has_user_reviewed_place(self, user_id, place_id):
        """Check if a user has already reviewed a specific place"""
        reviews = self.review_repo.get_all()
        return any(r.user.id == user_id and r.place.id == place_id for r in reviews)

    def get_review(self, review_id):
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def get_reviews_by_place(self, place_id):
        place = self.place_repo.get(place_id)
        if not place:
            return None
        return place.list_reviews()

    def update_review(self, review_id, review_data):
        review = self.review_repo.get(review_id)
        if not review:
            return None

        if 'rating' in review_data:
            if not review.validate_rating(review_data['rating']):
                raise ValueError('Rating must be between 1 and 5')

        if 'text' in review_data:
            if not review_data['text']:
                raise ValueError('Text is required')

        review.update(review_data)
        return review

    def delete_review(self, review_id):
        review = self.review_repo.get(review_id)
        if not review:
            return False
        self.review_repo.delete(review_id)
        return True

    def amenity_delete(self, amenity_id):
        """Helper to delete an amenity directly via repository"""
        if self.amenity_repo.get(amenity_id):
            self.amenity_repo.delete(amenity_id)
            return True
        return False

    def place_delete(self, place_id):
        """Helper to delete a place directly via repository"""
        if self.place_repo.get(place_id):
            self.place_repo.delete(place_id)
            return True
        return False
    