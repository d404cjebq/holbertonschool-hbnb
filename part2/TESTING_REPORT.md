# HBnB Part 2 - Testing Report (Task 6)

## Overview
This report documents the testing and validation process for all API endpoints implemented in Part 2 of the HBnB project (Users, Amenities, Places, Reviews).

---

## 1. Validation Summary

Basic validation has been implemented at the model level for all entities:

| Entity | Validation Rules |
|---|---|
| User | first_name, last_name required (max 50 chars); email must match valid format |
| Place | title required (max 100 chars); price must be positive; latitude between -90 and 90; longitude between -180 and 180 |
| Review | text/comment required; rating must be an integer between 1-5; user_id and place_id must reference existing entities |
| Amenity | name required (max 50 chars) |

---

## 2. Automated Unit Tests (unittest)

File: tests/test_api.py
Command: python -m unittest tests.test_api -v

Result:
Ran 19 tests in 0.533s

OK

Coverage:

| Entity | Tests |
|---|---|
| User | create valid, invalid email, duplicate email, get all, get not found |
| Amenity | create valid, empty name, get not found |
| Place | create valid, invalid price, invalid latitude, invalid longitude, owner not found, get not found |
| Review | create valid, invalid rating, invalid user, get not found, delete not found |

Total: 19/19 tests passed

---

## 3. Manual cURL Testing

File: curl_tests.md

Manual black-box testing was performed using cURL commands against the running Flask server, covering positive cases, boundary values, and error handling.

Summary:

| # | Endpoint | Scenario | Expected | Result |
|---|---|---|---|---|
| 1 | POST /users/ | Valid data | 201 | Passed |
| 2 | POST /users/ | Invalid email | 400 | Passed |
| 3 | GET /users/id | Non-existent user | 404 | Passed |
| 4 | POST /amenities/ | Valid data | 201 | Passed |
| 5 | POST /amenities/ | Empty name | 400 | Passed |
| 6 | POST /places/ | Invalid latitude | 400 | Passed |
| 7 | POST /places/ | Negative price | 400 | Passed |
| 8 | POST /reviews/ | Invalid rating | 400 | Passed |
| 9 | DELETE /reviews/id | Non-existent review | 404 | Passed |

See curl_tests.md for full command details and outputs.

---

## 4. Swagger Documentation

Swagger UI was reviewed at http://127.0.0.1:5000/api/v1/ to confirm that all endpoints, request/response models, and status codes are accurately documented and match the actual API behavior.

Namespaces verified:
- users
- amenities
- places
- reviews

---

## 5. Manual Interactive Testing (Swagger UI)

All endpoints were manually tested end-to-end through Swagger UI, confirming full CRUD workflows:

| Entity | POST | GET list | GET by ID | PUT | DELETE |
|---|---|---|---|---|---|
| User | 201 | 200 | 200 | 200 | N/A |
| Amenity | 201 | 200 | 200 | 200 | N/A |
| Place | 201 | 200 | 200 with owner and amenities | 200 | N/A |
| Review | 201 | 200 | 200 | 200 | 200 |

Also verified: GET /api/v1/places/place_id/reviews returns all reviews for a place.

---

## Conclusion

All endpoints implemented in Part 2 have been validated and tested using three methods: automated unit tests, manual cURL commands, and interactive Swagger UI testing. All 19 automated tests passed, and all manual test cases produced the expected status codes and response formats.
