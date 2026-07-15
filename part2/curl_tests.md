# Manual cURL Testing Report

## User Endpoints

### 1. Create User (Valid)
```bash
curl -X POST "http://127.0.0.1:5000/api/v1/users/" -H "Content-Type: application/json" -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
}'
```
**Expected:** 201 Created
**Result:** ✅ Passed

### 2. Create User (Invalid Email)
```bash
curl -X POST "http://127.0.0.1:5000/api/v1/users/" -H "Content-Type: application/json" -d '{
    "first_name": "",
    "last_name": "",
    "email": "invalid-email"
}'
```
**Expected:** 400 Bad Request
**Result:** ✅ Passed

### 3. Get Non-existent User
```bash
curl -X GET "http://127.0.0.1:5000/api/v1/users/fake-id-123"
```
**Expected:** 404 Not Found
**Result:** ✅ Passed

## Amenity Endpoints

### 4. Create Amenity (Valid)
```bash
curl -X POST "http://127.0.0.1:5000/api/v1/amenities/" -H "Content-Type: application/json" -d '{
    "name": "Wi-Fi"
}'
```
**Expected:** 201 Created
**Result:** ✅ Passed

### 5. Create Amenity (Empty Name)
```bash
curl -X POST "http://127.0.0.1:5000/api/v1/amenities/" -H "Content-Type: application/json" -d '{
    "name": ""
}'
```
**Expected:** 400 Bad Request
**Result:** ✅ Passed

## Place Endpoints

### 6. Create Place (Invalid Latitude - Boundary Test)
```bash
curl -X POST "http://127.0.0.1:5000/api/v1/places/" -H "Content-Type: application/json" -d '{
    "title": "Bad Place",
    "price": 100.0,
    "latitude": 200,
    "longitude": 0,
    "owner_id": "some-valid-id",
    "amenities": []
}'
```
**Expected:** 400 Bad Request
**Result:** ✅ Passed

### 7. Create Place (Negative Price)
```bash
curl -X POST "http://127.0.0.1:5000/api/v1/places/" -H "Content-Type: application/json" -d '{
    "title": "Bad Price",
    "price": -50.0,
    "latitude": 0,
    "longitude": 0,
    "owner_id": "some-valid-id",
    "amenities": []
}'
```
**Expected:** 400 Bad Request
**Result:** ✅ Passed

## Review Endpoints

### 8. Create Review (Invalid Rating - Out of Range)
```bash
curl -X POST "http://127.0.0.1:5000/api/v1/reviews/" -H "Content-Type: application/json" -d '{
    "text": "Bad rating",
    "rating": 10,
    "user_id": "some-valid-id",
    "place_id": "some-valid-id"
}'
```
**Expected:** 400 Bad Request
**Result:** ✅ Passed

### 9. Delete Non-existent Review
```bash
curl -X DELETE "http://127.0.0.1:5000/api/v1/reviews/fake-id-123"
```
**Expected:** 404 Not Found
**Result:** ✅ Passed