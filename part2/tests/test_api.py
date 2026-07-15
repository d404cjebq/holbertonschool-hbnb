#!/usr/bin/python3
import unittest
from app import create_app


class TestHBnBAPI(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    # ---------- User Tests ----------

    def test_create_user_valid(self):
        response = self.client.post('/api/v1/users/', json={
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane.doe@example.com"
        })
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data['first_name'], "Jane")
        self.assertNotIn('password', data)

    def test_create_user_invalid_email(self):
        response = self.client.post('/api/v1/users/', json={
            "first_name": "Bad",
            "last_name": "Email",
            "email": "invalid-email"
        })
        self.assertEqual(response.status_code, 400)

    def test_create_user_duplicate_email(self):
        self.client.post('/api/v1/users/', json={
            "first_name": "First",
            "last_name": "User",
            "email": "duplicate@example.com"
        })
        response = self.client.post('/api/v1/users/', json={
            "first_name": "Second",
            "last_name": "User",
            "email": "duplicate@example.com"
        })
        self.assertEqual(response.status_code, 400)

    def test_get_all_users(self):
        response = self.client.get('/api/v1/users/')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.get_json(), list)

    def test_get_user_not_found(self):
        response = self.client.get('/api/v1/users/fake-id-123')
        self.assertEqual(response.status_code, 404)

    # ---------- Amenity Tests ----------

    def test_create_amenity_valid(self):
        response = self.client.post('/api/v1/amenities/', json={
            "name": "Wi-Fi"
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()['name'], "Wi-Fi")

    def test_create_amenity_empty_name(self):
        response = self.client.post('/api/v1/amenities/', json={
            "name": ""
        })
        self.assertEqual(response.status_code, 400)

    def test_get_amenity_not_found(self):
        response = self.client.get('/api/v1/amenities/fake-id-123')
        self.assertEqual(response.status_code, 404)

    # ---------- Place Tests ----------

    def test_create_place_valid(self):
        user_resp = self.client.post('/api/v1/users/', json={
            "first_name": "Owner",
            "last_name": "Test",
            "email": "owner.place@example.com"
        })
        owner_id = user_resp.get_json()['id']

        response = self.client.post('/api/v1/places/', json={
            "title": "Cozy Apartment",
            "description": "Nice place",
            "price": 100.0,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "owner_id": owner_id,
            "amenities": []
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()['title'], "Cozy Apartment")

    def test_create_place_invalid_price(self):
        user_resp = self.client.post('/api/v1/users/', json={
            "first_name": "Owner2",
            "last_name": "Test",
            "email": "owner2.place@example.com"
        })
        owner_id = user_resp.get_json()['id']

        response = self.client.post('/api/v1/places/', json={
            "title": "Bad Place",
            "description": "Invalid price",
            "price": -50.0,
            "latitude": 0,
            "longitude": 0,
            "owner_id": owner_id,
            "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_create_place_invalid_latitude(self):
        user_resp = self.client.post('/api/v1/users/', json={
            "first_name": "Owner3",
            "last_name": "Test",
            "email": "owner3.place@example.com"
        })
        owner_id = user_resp.get_json()['id']

        response = self.client.post('/api/v1/places/', json={
            "title": "Bad Latitude",
            "description": "Out of range",
            "price": 100.0,
            "latitude": 200,
            "longitude": 0,
            "owner_id": owner_id,
            "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_create_place_invalid_longitude(self):
        user_resp = self.client.post('/api/v1/users/', json={
            "first_name": "Owner4",
            "last_name": "Test",
            "email": "owner4.place@example.com"
        })
        owner_id = user_resp.get_json()['id']

        response = self.client.post('/api/v1/places/', json={
            "title": "Bad Longitude",
            "description": "Out of range",
            "price": 100.0,
            "latitude": 0,
            "longitude": 300,
            "owner_id": owner_id,
            "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_create_place_owner_not_found(self):
        response = self.client.post('/api/v1/places/', json={
            "title": "No Owner",
            "description": "Invalid owner",
            "price": 100.0,
            "latitude": 0,
            "longitude": 0,
            "owner_id": "fake-owner-id",
            "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_get_place_not_found(self):
        response = self.client.get('/api/v1/places/fake-id-123')
        self.assertEqual(response.status_code, 404)

    # ---------- Review Tests ----------

    def test_create_review_valid(self):
        user_resp = self.client.post('/api/v1/users/', json={
            "first_name": "Reviewer",
            "last_name": "Test",
            "email": "reviewer@example.com"
        })
        owner_id = user_resp.get_json()['id']

        place_resp = self.client.post('/api/v1/places/', json={
            "title": "Review Place",
            "description": "For review test",
            "price": 100.0,
            "latitude": 0,
            "longitude": 0,
            "owner_id": owner_id,
            "amenities": []
        })
        place_id = place_resp.get_json()['id']

        response = self.client.post('/api/v1/reviews/', json={
            "text": "Great place!",
            "rating": 5,
            "user_id": owner_id,
            "place_id": place_id
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()['rating'], 5)

    def test_create_review_invalid_rating(self):
        user_resp = self.client.post('/api/v1/users/', json={
            "first_name": "Reviewer2",
            "last_name": "Test",
            "email": "reviewer2@example.com"
        })
        owner_id = user_resp.get_json()['id']

        place_resp = self.client.post('/api/v1/places/', json={
            "title": "Review Place 2",
            "description": "For review test",
            "price": 100.0,
            "latitude": 0,
            "longitude": 0,
            "owner_id": owner_id,
            "amenities": []
        })
        place_id = place_resp.get_json()['id']

        response = self.client.post('/api/v1/reviews/', json={
            "text": "Bad rating",
            "rating": 10,
            "user_id": owner_id,
            "place_id": place_id
        })
        self.assertEqual(response.status_code, 400)

    def test_create_review_invalid_user(self):
        response = self.client.post('/api/v1/reviews/', json={
            "text": "No user",
            "rating": 5,
            "user_id": "fake-user-id",
            "place_id": "fake-place-id"
        })
        self.assertEqual(response.status_code, 400)

    def test_get_review_not_found(self):
        response = self.client.get('/api/v1/reviews/fake-id-123')
        self.assertEqual(response.status_code, 404)

    def test_delete_review_not_found(self):
        response = self.client.delete('/api/v1/reviews/fake-id-123')
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()
