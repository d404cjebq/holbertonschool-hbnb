from app import db
from app.models.base_model import BaseModel
from sqlalchemy.orm import validates

class Amenity(BaseModel):
    __tablename__ = 'amenities'

 
    name = db.Column(db.String(100), nullable=False, unique=True)

    @validates('name')
    def validate_name(self, key, value):
        if not value or len(value) > 100:
            raise ValueError("Amenity name is required and must be <= 100 characters")
        return value
