# HBnB Evolution - UML Diagrams

This project contains the UML diagrams developed for the HBnB Evolution project. The diagrams document the architecture, business logic, and API interactions required in the first three tasks.

---

# Task 0: High-Level Package Diagram

## Objective

The High-Level Package Diagram illustrates the overall architecture of the application by organizing the system into logical layers and showing how they interact.

## Description

The application is divided into three main layers:

### Presentation Layer
Responsible for handling client requests through API endpoints and forwarding them to the business logic.

Components:
- API Endpoints
- Services

### Business Logic Layer
Contains the core functionality of the application.

Main modules:
- User
- Place
- Review
- Amenity

This layer processes requests, applies business rules, and coordinates communication with the persistence layer.

### Persistence Layer
Responsible for data storage and retrieval.

Components:
- Database
- Repositories

## Architecture

```
Client
      │
Presentation Layer
      │
Business Logic Layer
      │
Persistence Layer
      │
Database
```

The Presentation Layer communicates with the Business Logic Layer using the **Facade Pattern**, while the Business Logic Layer performs all database operations through the Persistence Layer.

---

# Task 1: Detailed Class Diagram for Business Logic Layer

## Objective

The Detailed Class Diagram describes the core entities of the system, their attributes, methods, and relationships.

## Classes

### User

Represents a system user.

Responsibilities:
- User registration
- Authentication
- Managing owned places
- Writing reviews

Main Operations:
- create()
- update()
- delete()
- authenticate()

---

### Place

Represents a property available for booking.

Responsibilities:
- Store property information
- Manage amenities
- Store reviews

Main Operations:
- create()
- update()
- delete()
- list_amenities()
- list_reviews()

---

### Review

Represents feedback written by users.

Responsibilities:
- Store rating
- Store comments
- Associate users with places

Main Operations:
- create()
- update()
- delete()

---

### Amenity

Represents services available for a place.

Examples:
- Wi-Fi
- Parking
- Pool
- Air Conditioning

Main Operations:
- create()
- update()
- delete()

---

## Relationships

- One User can own multiple Places.
- One User can write multiple Reviews.
- One Place can have multiple Reviews.
- One Place can contain multiple Amenities.

---

# Task 2: Sequence Diagrams for API Calls

The following sequence diagrams describe how the system processes common API requests across the Presentation, Business Logic, and Persistence layers.

---

## 1. User Registration

**Endpoint**

```
POST /users
```

### Flow

1. Client sends registration data.
2. API forwards the request to UserService.
3. UserService validates the input.
4. If the data is valid:
   - UserModel creates a new user.
   - The user is stored in the database.
   - API returns **201 Created**.
5. Otherwise:
   - API returns **400 Bad Request**.

---

## 2. Fetch Places

**Endpoint**

```
GET /places?city=Riyadh
```

### Flow

1. Client sends a search request.
2. API calls PlaceService.
3. PlaceService requests matching places from PlaceModel.
4. PlaceModel retrieves the data from the database.
5. API returns **200 OK** with the list of places.

---

## 3. Create Place

**Endpoint**

```
POST /places
```

### Flow

1. Client submits place information.
2. API forwards the request to PlaceService.
3. PlaceService validates the submitted data.
4. If validation succeeds:
   - PlaceModel creates the place.
   - Database stores the record.
   - API returns **201 Created**.
5. Otherwise:
   - API returns **400 Bad Request**.

---

## 4. Submit Review

**Endpoint**

```
POST /reviews
```

### Flow

1. Client submits review data.
2. API sends the request to ReviewService.
3. ReviewService validates the review.
4. If valid:
   - ReviewModel creates the review.
   - Database stores it.
   - API returns **201 Created**.
5. Otherwise:
   - API returns **400 Bad Request**.

---

# Summary

The UML diagrams collectively describe:

- The high-level layered architecture of the application.
- The business entities and their relationships.
- The interaction flow for major REST API operations.

Together, these diagrams provide a clear view of both the static structure and dynamic behavior of the HBnB Evolution system.<img width="930" height="593" alt="Review Submission" src="https://github.com/user-attachments/assets/df84a0f8-be91-4490-9eca-5be6eec9bfe8" />
<img width="930" height="575" alt="Place Creation" src="https://github.com/user-attachments/assets/d08ce8de-a877-40ec-a985-c48e59a26975" />
<img width="930" height="593" alt="Fetching a List of Places" src="https://github.com/user-attachments/assets/9a2707df-538b-4774-b2de-f4eb2d490187" />
<img width="930" height="593" alt="User Registration" src="https://github.com/user-attachments/assets/0eaa19f3-354d-4df8-afaf-23ae3443540c" />
<img width="1021" height="739" alt="WhatsApp Image 2026-06-30 at 3 38 16 PM (1)" src="https://github.com/user-attachments/assets/afd09051-2d88-4d53-ab18-3947c479c880" />
<img width="838" height="784" alt="WhatsApp Image 2026-06-30 at 3 38 16 PM" src="https://github.com/user-attachments/assets/7c09b4e7-37d5-486d-86cf-35269019bd25" />
