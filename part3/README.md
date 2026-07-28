# HBnB Project - Part 2: Business Logic and API Endpoints

## Overview

This is Part 2 of the HBnB Evolution project — an Airbnb-like application. This phase implements the core business logic and RESTful API endpoints using Python, Flask, and Flask-RESTx, following a layered architecture (Presentation, Business Logic, Persistence) connected through the Facade pattern.

## Project Structure
<img width="234" height="594" alt="‏لقطة الشاشة ١٤٤٨-٠٢-٠١ في ٢ ٤٠ ٥٨ م" src="https://github.com/user-attachments/assets/360de7b5-0547-4973-a9ff-e9e7f44e1070" />

## Features

- **User Management**: Register, retrieve, and update users (CRUD without DELETE)
- **Amenity Management**: Register, retrieve, and update amenities (CRUD without DELETE)
- **Place Management**: Register, retrieve, and update places, including owner and amenities relationships
- **Review Management**: Full CRUD including DELETE, with reviews linked to both users and places

## Architecture

- **Presentation Layer**: Flask-RESTx namespaces and resources defining API routes
- **Business Logic Layer**: Model classes (`User`, `Place`, `Review`, `Amenity`) inheriting from `BaseModel`, with validation and relationship handling
- **Persistence Layer**: In-memory repository (to be replaced by a database in Part 3)
- **Facade Pattern**: `HBnBFacade` mediates all communication between the API layer and the business logic layer

## Installation

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/holbertonschool-hbnb.git
cd holbertonschool-hbnb/part2
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python run.py
```

The application will start on `http://127.0.0.1:5000`.

## API Documentation

Once the server is running, the Swagger UI documentation is available at:
http://127.0.0.1:5000/api/v1/
This provides an interactive interface to explore and test all available endpoints.

## API Endpoints Summary

| Entity | POST | GET (list) | GET (by ID) | PUT | DELETE |
|---|---|---|---|---|---|
| Users | ✅ | ✅ | ✅ | ✅ | ❌ |
| Amenities | ✅ | ✅ | ✅ | ✅ | ❌ |
| Places | ✅ | ✅ | ✅ | ✅ | ❌ |
| Reviews | ✅ | ✅ | ✅ | ✅ | ✅ |

Additional endpoint: `GET /api/v1/places/<place_id>/reviews` — retrieves all reviews for a specific place.

## Testing

### Automated Unit Tests

```bash
python -m unittest tests.test_api -v
```

### Manual Testing

See `curl_tests.md` for documented cURL test cases, and `TESTING_REPORT.md` for the full testing summary.

## Authors

- Sarah Alkhubaizy
- Dhay Aldhwayan
- Rahaf Alabdalh 
