from app.models.base_model import BaseModel
import re
import hashlib


class User(BaseModel):
    def __init__(self, first_name, last_name, email, birth_date=None,
                 password="", is_admin=False, is_active=True):
        super().__init__()
        if not first_name or len(first_name) > 50:
            raise ValueError("First name is required and must be <= 50 characters")
        if not last_name or len(last_name) > 50:
            raise ValueError("Last name is required and must be <= 50 characters")

        self.first_name = first_name
        self.last_name = last_name
        self.email = self.validate_email(email)
        self.birth_date = birth_date
        self.password_hash = self.hash_password(password)
        self.is_admin = is_admin
        self.is_active = is_active
        self.places = []
        self.reviews = []

    def validate_email(self, email):
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(pattern, email):
            raise ValueError("Invalid email format")
        return email

    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def register(self):
        """Register the user"""
        self.save()

    def update_profile(self, data):
        """Update profile fields"""
        self.update(data)

    def deactivate(self):
        """Deactivate the user account"""
        self.is_active = False
        self.save()

    def authenticate(self, password):
        return self.password_hash == self.hash_password(password)

    def add_place(self, place):
        self.places.append(place)

    def add_review(self, review):
        self.reviews.append(review)