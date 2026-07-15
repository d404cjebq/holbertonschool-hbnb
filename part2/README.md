# HBnB Evolution — Part 2: Business Logic & API Endpoints

Implementation of the Presentation and Business Logic layers for the HBnB
project, matching the class diagram (`BaseModel` → `User`, `Place`,
`Review`, `Amenity`), using Flask + flask-restx, the Facade pattern, and
in-memory persistence.

## Project structure

```
hbnb/
├── app/
│   ├── __init__.py            # Flask app factory, registers all namespaces
│   ├── api/
│   │   └── v1/
│   │       ├── users.py       # /api/v1/users endpoints
│   │       ├── places.py      # /api/v1/places endpoints
│   │       ├── reviews.py     # /api/v1/reviews endpoints
│   │       └── amenities.py   # /api/v1/amenities endpoints
│   ├── models/
│   │   ├── base_model.py      # BaseModel: id, created_at, updated_at, save/update
│   │   ├── user.py
│   │   ├── place.py
│   │   ├── review.py
│   │   └── amenity.py
│   ├── services/
│   │   └── facade.py          # HBnBFacade: single entry point for the API layer
│   └── persistence/
│       └── repository.py      # Repository interface + InMemoryRepository
├── run.py                     # Entry point
├── config.py
└── requirements.txt
```

## Architecture

- **Presentation layer** (`app/api`): flask-restx `Resource`/`Namespace`
  classes. They only talk to the `facade`, never to models or repositories
  directly.
- **Business Logic layer** (`app/models`): plain Python classes holding
  attributes, validation, and relationships (owner/places, place/amenities,
  place/reviews, user/reviews).
- **Facade** (`app/services/facade.py`): the single object the API imports.
  It hides which repository/backing store is used, and centralizes cross
  entity operations (e.g. creating a `Place` validates the owner exists and
  resolves amenity IDs into `Amenity` objects).
- **Persistence layer** (`app/persistence`): `InMemoryRepository` implements
  a generic `Repository` interface (add/get/get_all/update/delete). Because
  the facade only depends on the interface, swapping in a database-backed
  repository later (Part 3/4) won't require touching the API or model code.

## Setup

```bash
cd hbnb
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 run.py
```

The API will be available at `http://127.0.0.1:5000/`, with interactive
Swagger docs at `http://127.0.0.1:5000/api/v1/`.

## Endpoints

| Entity   | Method | Path                              | Description                     |
|----------|--------|------------------------------------|----------------------------------|
| User     | POST   | /api/v1/users/                    | Register a user                 |
| User     | GET    | /api/v1/users/                    | List all users                  |
| User     | GET    | /api/v1/users/\<id\>               | Get a user                      |
| User     | PUT    | /api/v1/users/\<id\>               | Update a user                   |
| Amenity  | POST   | /api/v1/amenities/                | Create an amenity                |
| Amenity  | GET    | /api/v1/amenities/                | List all amenities              |
| Amenity  | GET    | /api/v1/amenities/\<id\>           | Get an amenity                  |
| Amenity  | PUT    | /api/v1/amenities/\<id\>           | Update an amenity                |
| Place    | POST   | /api/v1/places/                   | Create a place                   |
| Place    | GET    | /api/v1/places/                   | List all places                 |
| Place    | GET    | /api/v1/places/\<id\>              | Get a place (owner + amenities + reviews) |
| Place    | PUT    | /api/v1/places/\<id\>              | Update a place                   |
| Place    | GET    | /api/v1/places/\<id\>/reviews      | List reviews for a place        |
| Review   | POST   | /api/v1/reviews/                  | Create a review                  |
| Review   | GET    | /api/v1/reviews/                  | List all reviews                |
| Review   | GET    | /api/v1/reviews/\<id\>             | Get a review                     |
| Review   | PUT    | /api/v1/reviews/\<id\>             | Update a review                  |
| Review   | DELETE | /api/v1/reviews/\<id\>             | Delete a review                  |

## Example: create a full flow with cURL

```bash
# 1. Create a user
curl -X POST http://127.0.0.1:5000/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com"}'

# 2. Create an amenity
curl -X POST http://127.0.0.1:5000/api/v1/amenities/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Wifi","description":"Fast internet"}'

# 3. Create a place (use the returned user id and amenity id)
curl -X POST http://127.0.0.1:5000/api/v1/places/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Cozy Flat","description":"Nice place","price":100.0,"latitude":40.0,"longitude":-73.0,"owner_id":"<USER_ID>","amenities":["<AMENITY_ID>"]}'

# 4. Fetch the place - includes owner, amenities and reviews
curl http://127.0.0.1:5000/api/v1/places/<PLACE_ID>

# 5. Create a review
curl -X POST http://127.0.0.1:5000/api/v1/reviews/ \
  -H "Content-Type: application/json" \
  -d '{"text":"Great stay!","rating":5,"user_id":"<USER_ID>","place_id":"<PLACE_ID>"}'
```

## Validation implemented

- `User`: first/last name required (≤50 chars), email must match a basic
  email pattern, and emails must be unique.
- `Place`: title required (≤100 chars), price ≥ 0, latitude in [-90, 90],
  longitude in [-180, 180], owner must exist.
- `Review`: rating must be an integer between 1 and 5, user and place must
  exist.
- `Amenity`: name required (≤50 chars).

All validation errors return `400` with a JSON `{"error": "..."}` body;
missing resources return `404`.

## Notes for Part 3

Authentication (JWT) and role-based access control are intentionally not
implemented here — this part only covers CRUD and business logic. The code
is structured so those can be layered on top of the existing facade and API
routes without restructuring.

