from app import db
from app.models.base_model import BaseModel
from sqlalchemy.orm import validates

class Place(BaseModel):
    __tablename__ = 'places'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    price = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    @validates('title')
    def validate_title(self, key, value):
        if not value or len(value) > 100:
            raise ValueError("Title is required and must be <= 100 characters")
        return value

    @validates('price')
    def validate_price(self, key, value):
        if value < 0:
            raise ValueError("Price must be positive")
        return value

    @validates('latitude')
    def validate_latitude(self, key, value):
        if not (-90 <= value <= 90):
            raise ValueError("Latitude must be between -90 and 90")
        return value

    @validates('longitude')
    def validate_longitude(self, key, value):
        if not (-180 <= value <= 180):
            raise ValueError("Longitude must be between -180 and 180")
        return value
