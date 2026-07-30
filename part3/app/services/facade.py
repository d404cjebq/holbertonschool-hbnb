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