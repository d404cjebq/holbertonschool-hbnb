<p align="center">
  <h1 align="center">🏠 HBnB Evolution</h1>
  <p align="center">A simplified Airbnb clone — built as part of the Holberton School Higher-Level Programming curriculum</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-RESTx-black?logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/HTML%2FCSS%2FJS-Frontend-orange?logo=javascript&logoColor=white" alt="Frontend">
  <img src="https://img.shields.io/badge/status-completed-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

---

## 📖 About the Project

**HBnB Evolution** is a multi-phase project that recreates the core of an Airbnb-style platform — from architectural design to a working REST API and a fully functional web client. It's built incrementally, with each phase adding a new layer of the system:

| Phase | Focus | Status |
|---|---|---|
| Part 1 | UML design & technical documentation | ✅ Complete |
| Part 2 | Business logic & REST API (Flask / flask-restx) | ✅ Complete |
| Part 3 | Authentication, authorization & SQL persistence | ✅ Complete |
| Part 4 | Simple Web Client (HTML/CSS/JS front-end) | ✅ Complete |

---

## 🏗️ Architecture

The system follows a **layered (N-tier) architecture**, separating concerns across three layers connected via the **Facade Pattern**:

```
Client
   │
Presentation Layer      →  API endpoints (Flask-RESTx)
   │
Business Logic Layer    →  Core entities & rules (User, Place, Review, Amenity)
   │
Persistence Layer       →  Data storage & retrieval
   │
Database
```

- **Presentation Layer** — handles incoming HTTP requests and routes them to the business logic.
- **Business Logic Layer** — enforces validation rules and models the core domain entities.
- **Persistence Layer** — abstracts data storage (in-memory repository).
- **Facade Pattern** — `HBnBFacade` exposes a single, unified interface between the API and the business logic, keeping the layers decoupled.

---

## 📁 Repository Structure

```
holbertonschool-hbnb/
├── part1/          # UML diagrams & technical documentation
│   └── README.md
├── part2/          # Flask / flask-restx API implementation
│   └── README.md
├── part3/          # Authentication, authorization & SQL persistence
│   ├── sql/
│   └── README.md
├── part4/          # Simple web client (HTML/CSS/JS)
│   └── base_model/
│       └── screenshots/
└── README.md        # You are here
```

## 📦 Part 1 — Technical Documentation

Covers the design phase, before any code was written:

- **Package Diagram** — high-level view of the three-layer architecture
- **Class Diagram** — `User`, `Place`, `Review`, and `Amenity` entities, their attributes, methods, and relationships
- **Sequence Diagrams** — request flow for `User Registration`, `Fetch Places`, `Create Place`, and `Submit Review`

➡️ Full details in [`part1/README.md`](part1/README.md)

---

## ⚙️ Part 2 — Business Logic & API

Implements the design with **Python**, **Flask**, and **flask-restx**.

### Endpoints

| Entity | POST | GET (list) | GET (by ID) | PUT | DELETE |
|---|:---:|:---:|:---:|:---:|:---:|
| Users | ✅ | ✅ | ✅ | ✅ | ❌ |
| Amenities | ✅ | ✅ | ✅ | ✅ | ❌ |
| Places | ✅ | ✅ | ✅ | ✅ | ❌ |
| Reviews | ✅ | ✅ | ✅ | ✅ | ✅ |

Additional endpoint: `GET /api/v1/places/<place_id>/reviews`

### Quick Start

```bash
https://github.com/d404cjebq/holbertonschool-hbnb.git
cd holbertonschool-hbnb/part2

python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
python run.py
```

Then open the interactive Swagger docs at:

```
http://127.0.0.1:5000/api/v1/
```

### Testing

```bash
cd part2
python -m unittest tests.test_api -v
```

Manual cURL test cases are documented in `part2/curl_tests.md`, with results summarized in `part2/TESTING_REPORT.md`.

➡️ Full setup, testing, and API details in [`part2/README.md`](part2/README.md)

---

## 🔐 Part 3 — Authentication, Authorization & Database Persistence

Extends the API with secure user authentication, role-based access control, and a transition from in-memory storage to a persistent SQL database.

### Key Features

| Feature | Description |
|---|---|
| Password Hashing | User passwords are hashed with `bcrypt` before storage — never stored or returned in plain text |
| JWT Authentication | Login endpoint issues a JWT access token embedding the user's identity and admin status |
| Route Protection | Sensitive endpoints require a valid JWT via `@jwt_required()` |
| Ownership Authorization | Users can only update/delete Places and Reviews they own |
| Admin Privileges | Admin users bypass ownership restrictions and can manage users, amenities, and any resource |
| SQLAlchemy Persistence | Data is now stored in a SQLite database (development) via SQLAlchemy ORM, replacing the in-memory repository |
| Raw SQL Scripts | Database schema, seed data, and CRUD tests are also provided as standalone `.sql` files |

### Authentication Flow

```
POST /api/v1/users/          → Register a new user (password hashed via bcrypt)
POST /api/v1/auth/login      → Authenticate and receive a JWT access token
GET  /api/v1/auth/protected  → Example endpoint requiring a valid token
```

### Authorization Rules

| Action | Regular User | Owner | Admin |
|---|---|---|---|
| Create Place / Review | ✅ (authenticated) | — | ✅ |
| Update/Delete own Place or Review | ❌ | ✅ | ✅ |
| Update/Delete others' Place or Review | ❌ | ❌ | ✅ |
| Create/Update Amenities | ❌ | — | ✅ |
| Create/Update any User (incl. email/password) | ❌ | — | ✅ |

### Database Schema

The system uses 5 tables: `users`, `places`, `reviews`, `amenities`, and `place_amenity` (many-to-many junction table). Raw SQL scripts are available under `part3/sql/`:

- `schema.sql` — creates all tables and foreign key relationships
- `seed.sql` — inserts an administrator user and initial amenities (WiFi, Swimming Pool, Air Conditioning)
- `crud_test.sql` — verifies Create, Read, Update, and Delete operations against the schema

### Quick Start

```bash
git clone https://github.com/d404cjebq/holbertonschool-hbnb.git
cd holbertonschool-hbnb/part3
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python run.py
```

Swagger docs available at:

```
http://127.0.0.1:5000/api/v1/
```

### Testing

```bash
cd part3
python -m unittest discover tests -v
```

Part 3 SQL scripts are located in `part3/sql/` and can be tested independently (see the Database Schema section above).

---

## 🖥️ Part 4 — Simple Web Client

A responsive front-end built with plain **HTML5**, **CSS3**, and **vanilla JavaScript**, consuming the Part 3 REST API to deliver a full browsing and review experience — no framework, no build step.

### What was built

- A **home page** with a full-width hero banner and a dynamically rendered grid of places, each pulled live from `GET /api/v1/places/`.
- **Client-side filtering**: a "Max Price" dropdown and clickable destination banners (Red Sea / AlUla) filter the already-rendered place cards instantly, with no extra API calls.
- A **place details page** with an image gallery (clickable thumbnails swap the main image), host info, description, amenities, and the full list of reviews for that place.
- A **reviews system** that shows the reviewer's real first and last name (instead of a raw user ID or "Anonymous") by joining review data with the associated user on the backend.
- An **authenticated "Add a Review" flow**: logged-in users can rate a place (1–5) and leave a text review via `POST /api/v1/reviews/`; the section is hidden for visitors who aren't logged in.
- **Login / Sign up pages**: login stores the JWT returned by `POST /api/v1/auth/login` in a cookie; the cookie is then attached as an `Authorization` header on every authenticated request (adding reviews, etc.).
- A **responsive hamburger menu** for mobile viewports.
- Graceful error handling: an invalid or deleted place ID shows a clear "This place could not be found" message instead of a blank page.

### Pages

| Page | Description |
|---|---|
| `index.html` | Landing page — hero banner, destination shortcuts, filterable list of all places |
| `place.html` | Place details — image gallery, host info, amenities, and reviews |
| `login.html` | Login form; stores the returned JWT in a cookie |
| `register.html` | Sign-up form for creating a new account |
| `add_review.html` | Authenticated-only form to submit a review for a place |
| `about.html` | Static about page |

### 
<img width="1911" height="919" alt="Screenshot 2026-08-25 122103" src="https://github.com/user-attachments/assets/7526f0dc-4532-4706-9771-0ea4598012aa" /><img width="1916" height="919" alt="Screenshot 2026-08-25 122132" src="https://github.com/user-attachments/assets/9dd9d2bc-c9f0-4544-bfc0-166702df89f9" />
<img width="1915" height="924" alt="Screenshot 2026-08-25 122118" src="https://github.com/user-attachments/assets/5aad12d2-c6e3-49b3-8132-42453a6777f6" />
<img width="1013" height="857" alt="Screenshot 2026-08-25 125100" src="https://github.com/user-attachments/assets/f66d0f23-03dd-41ff-8f6b-6739afe47d1b" />
<img width="462" height="341" alt="Screenshot 2026-08-25 125114" src="https://github.com/user-attachments/assets/aaca7b2b-a7d2-425c-8e9a-de99070ecd92" />
<img width="1016" height="639" alt="Screenshot 2026-08-25 125048" src="https://github.com/user-attachments/assets/8dff9252-a203-4771-8183-6b7bbe98ac59" />

### Quick Start

```bash
cd part4/base_model
# Serve with any static file server, e.g.:
python -m http.server 8000
```

Then open:
```
http://127.0.0.1:8000/index.html
```

> Make sure the Part 3 API is running at `http://127.0.0.1:5000` — the client points there automatically when accessed via `localhost` / `127.0.0.1`.

---

## 👥 Authors

| Sarah Alkhubaizy |
| Dhay Aldhwayan |
| Rahaf Alabdalh |
