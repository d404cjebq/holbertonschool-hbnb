import unittest
from app import create_app


class TestPlaceEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def _create_owner(self, email="owner.person@example.com"):
        response = self.client.post('/api/v1/users/', json={
            "first_name": "Owner", "last_name": "Person",
            "email": email, "password": "secret123"
        })
        return response.get_json()["id"]

    def test_create_place(self):
        owner_id = self._create_owner("owner1@example.com")
        response = self.client.post('/api/v1/places/', json={
            "title": "Cozy Apartment", "description": "A nice place",
            "price": 100.0, "latitude": 37.7749, "longitude": -122.4194,
            "owner_id": owner_id, "amenities": []
        })
        self.assertEqual(response.status_code, 201)

    def test_create_place_missing_title(self):
        owner_id = self._create_owner("owner2@example.com")
        response = self.client.post('/api/v1/places/', json={
            "title": "", "price": 100.0, "latitude": 37.7749,
            "longitude": -122.4194, "owner_id": owner_id, "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_create_place_negative_price(self):
        owner_id = self._create_owner("owner3@example.com")
        response = self.client.post('/api/v1/places/', json={
            "title": "Cheap", "price": -50.0, "latitude": 37.7749,
            "longitude": -122.4194, "owner_id": owner_id, "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_create_place_invalid_owner(self):
        response = self.client.post('/api/v1/places/', json={
            "title": "No Owner", "price": 100.0, "latitude": 37.7749,
            "longitude": -122.4194, "owner_id": "nonexistent-id", "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_get_all_places(self):
        response = self.client.get('/api/v1/places/')
        self.assertEqual(response.status_code, 200)

    def test_get_place_not_found(self):
        response = self.client.get('/api/v1/places/nonexistent-id')
        self.assertEqual(response.status_code, 404)

    def test_update_place_not_found(self):
        response = self.client.put('/api/v1/places/nonexistent-id', json={
            "title": "Ghost"
        })
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()