<p align="center">
  <h1 align="center">🏠 HBnB Evolution</h1>
  <p align="center">A simplified Airbnb clone — built as part of the Holberton School Higher-Level Programming curriculum</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-RESTx-black?logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/status-completed-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

---

## 📖 About the Project

**HBnB Evolution** is a multi-phase project that recreates the core of an Airbnb-style platform — from architectural design to a working REST API. It's built incrementally, with each phase adding a new layer of the system:

| Phase | Focus | Status |
|---|---|---|
| **Part 1** | UML design & technical documentation | ✅ Complete |
| **Part 2** | Business logic & REST API (Flask / flask-restx) | ✅ Complete |

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
└── README.md        # You are here
```

---

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
git clone https://github.com/SarahAlkhubaizy/holbertonschool-hbnb.git
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

➡️ Full setup, testing, and API details in [`part2/README.md`](part2/README.md)

---

## 🧪 Testing

```bash
python -m unittest tests.test_api -v
```

Manual cURL test cases are documented in `part2/curl_tests.md`, with results summarized in `part2/TESTING_REPORT.md`.

---

## 👥 Authors

| Sarah Alkhubaizy | 
| Dhay Aldhwayan | 
| Rahaf Alabdalh | 