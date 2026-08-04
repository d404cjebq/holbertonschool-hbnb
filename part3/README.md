# HBnB Project — Part 3: Enhanced Backend with Authentication and Database Integration

## Overview

Part 3 extends the HBnB backend from Parts 1 and 2 by replacing in-memory storage with a persistent, relational database and by securing the API with JWT-based authentication and role-based access control. This phase moves the project from a prototype-friendly design toward a scalable, production-ready backend.

## Objectives

- **Authentication & Authorization** — JWT-based user authentication via Flask-JWT-Extended, with role-based access control enforced through the `is_admin` attribute on protected endpoints.
- **Database Integration** — Replace in-memory repositories with SQLite for development, using SQLAlchemy as the ORM, with the application structured to support MySQL in production.
- **CRUD with Persistence** — All CRUD operations for `User`, `Place`, `Review`, and `Amenity` are refactored to read from and write to the database.
- **Database Design & Visualization** — The schema is modeled and documented as a Mermaid.js ER diagram (see [`ER_DIAGRAM.md`](./ER_DIAGRAM.md)), covering entities and their relationships.
- **Data Consistency & Validation** — Validation and constraints are enforced at the model layer (e.g. required fields, format checks, numeric ranges) via SQLAlchemy `@validates` decorators.

## Tech Stack

| Layer | Technology |
|---|---|
| Web framework | Flask |
| ORM | SQLAlchemy (Flask-SQLAlchemy) |
| Database (dev) | SQLite |
| Database (prod) | MySQL |
| Authentication | Flask-JWT-Extended (JWT) |
| Password hashing | bcrypt (Flask-Bcrypt) |

## Project Structure
<img width="165" height="763" alt="‏لقطة الشاشة ١٤٤٨-٠٢-٢١ في ١٢ ٣٧ ٢٥ م" src="https://github.com/user-attachments/assets/f514f267-21a8-474c-85a0-d61c3c097d1e" />


## Database Schema

The schema covers five entities: `User`, `Place`, `Review`, `Amenity`, and the `place_amenity` association table that resolves the many-to-many relationship between `Place` and `Amenity`.

Key relationships:
- A **User** owns many **Places** and writes many **Reviews**.
- A **Place** receives many **Reviews** and has many **Amenities** (and vice versa) through `place_amenity`.

Full column-level detail and design notes are in [`ER_DIAGRAM.md`](./ER_DIAGRAM.md).

## Authentication & Authorization

- Users authenticate via a login endpoint that verifies credentials against the bcrypt-hashed password and issues a JWT access token.
- Protected endpoints require a valid JWT (`@jwt_required()`), and admin-only actions additionally check `is_admin` on the current user before allowing the operation.
- Passwords are never stored in plaintext — `User.hash_password()` hashes with bcrypt before persisting, and `User.verify_password()` handles login checks.

## Setup

1. Clone the repository and navigate to `part3/`.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set environment variables (e.g. `SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`) — SQLite is used by default for development.
5. Run the application:
   ```bash
   python run.py
   ```

## Running Tests

```bash
python -m unittest discover tests
```

## Notes / Design Decisions

- `BaseModel` supplies a UUID (`String(36)`) primary key and timestamp fields to all models, but `Place`, `Review`, and `Amenity` override `id` with an auto-incrementing integer primary key — only `User` keeps the inherited UUID. All foreign keys are typed consistently with their target column.
- Validation (e.g. rating range 1–5, coordinate bounds, string length limits) happens at the model layer via `@validates`, not via database `CHECK` constraints.
- Relationships use SQLAlchemy's `backref` pattern rather than paired `back_populates`.

## Authors

- Sarah Alkhubaizy
- Dhay Aldhwayan
- Rahaf Alabdalh

