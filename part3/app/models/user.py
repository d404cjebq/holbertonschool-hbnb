import re
from app import db, bcrypt
from app.models.base_model import BaseModel
from sqlalchemy.orm import validates

class User(BaseModel):
    __tablename__ = 'users'

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    birth_date = db.Column(db.Date, nullable=True)
    password = db.Column(db.String(128), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)

    @validates('first_name')
    def validate_first_name(self, key, value):
        if not value or len(value) > 50:
            raise ValueError("First name is required and must be <= 50 characters")
        return value

    @validates('last_name')
    def validate_last_name(self, key, value):
        if not value or len(value) > 50:
            raise ValueError("Last name is required and must be <= 50 characters")
        return value

    @validates('email')
    def validate_email(self, key, email):
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(pattern, email):
            raise ValueError("Invalid email format")
        return email

    def hash_password(self, password):
        """Hashes the password before storing it."""
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)

    def authenticate(self, password):
        return self.verify_password(password)

    def register(self):
        self.save()

    def update_profile(self, data):
        self.update(data)

    def deactivate(self):
        self.is_active = False
        self.save()
