# HBnB Evolution – Technical Documentation

## Introduction

This document provides the technical documentation for the HBnB Evolution project. It combines the architectural and design artifacts created during the previous tasks into a single reference document.

The purpose of this documentation is to describe the system architecture, the business logic structure, and the interactions between the different components of the application. It serves as a blueprint for the implementation phase and helps developers understand the overall design before coding begins.

This document includes:

- High-Level Package Diagram
- Detailed Class Diagram
- Sequence Diagrams for API Calls

---

# 1. High-Level Architecture
<img width="838" height="784" alt="Package Diagram" src="https://github.com/user-attachments/assets/6ed8c2f1-ff42-452f-987c-731c68ac85f9" />

## Overview

The HBnB application follows a **layered architecture** to separate responsibilities between different parts of the system. This design improves maintainability, scalability, and readability.

The architecture is divided into three layers:

- Presentation Layer
- Business Logic Layer
- Persistence Layer

The Presentation Layer communicates with the Business Logic Layer using the **Facade Pattern**, while the Business Logic Layer handles all interactions with the Persistence Layer.

---

## High-Level Package Diagram

> *(Insert your Package Diagram image here.)*

Example:

```
images/package_diagram.png
```

or

```md
![Package Diagram](images/package_diagram.png)
```

---

## Explanation

### Presentation Layer

Responsible for receiving client requests through REST API endpoints and forwarding them to the business layer.

Main components:

- API Endpoints
- Services

---

### Business Logic Layer

Contains the application's business rules and core entities.

Entities include:

- User
- Place
- Review
- Amenity

This layer validates requests and coordinates application logic.

---

### Persistence Layer

Responsible for storing and retrieving data.

Components:

- Database
- Repositories

---

## Design Decisions

The layered architecture was selected because it:

- Separates responsibilities.
- Makes the application easier to maintain.
- Allows independent development of each layer.
- Improves scalability.

The Facade Pattern simplifies communication between the Presentation Layer and Business Logic Layer by exposing a unified interface.

---

# 2. Business Logic Layer
<img width="1021" height="739" alt="class Digram" src="https://github.com/user-attachments/assets/d17d3dfd-848e-49bb-aef7-d41868656c42" />

## Overview

The Business Logic Layer contains the main entities of the system and defines their relationships and behaviors.

---

## Detailed Class Diagram

> *(Insert your Class Diagram here.)*

Example:

```md
![Class Diagram](images/class_diagram.png)
```

---

## Main Classes

### User

Represents registered users.

Responsibilities:

- Register
- Authenticate
- Manage owned places
- Submit reviews

Main methods:

- create()
- update()
- delete()
- authenticate()

---

### Place

Represents rental properties.

Responsibilities:

- Store property information
- Manage amenities
- Manage reviews

Main methods:

- create()
- update()
- delete()
- list_reviews()
- list_amenities()

---

### Review

Represents user feedback.

Responsibilities:

- Store ratings
- Store comments
- Connect users and places

Main methods:

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

Main methods:

- create()
- update()
- delete()

---

## Relationships

The class diagram defines the following relationships:

- One User can own multiple Places.
- One User can write multiple Reviews.
- One Place can receive multiple Reviews.
- One Place can contain multiple Amenities.

---

## Design Decisions

The model separates each entity into an independent class to improve modularity and maintainability.

Relationships are implemented using object associations rather than tightly coupling classes together.

---

# 3. API Interaction Flow

## Overview

The sequence diagrams describe how requests travel through the system, starting from the client and ending at the database.

Each diagram demonstrates communication between:

- Client
- API
- Service
- Model
- Database

---

# User Registration
<img width="930" height="593" alt="User Registration" src="https://github.com/user-attachments/assets/aacd1dac-04d5-4ca9-a3e9-faf31d0ad043" />

### Endpoint

```
POST /users
```

> *(Insert User Registration Sequence Diagram here.)*

```md
![User Registration](images/user_registration.png)
```

### Description

1. Client submits registration data.
2. API forwards the request to UserService.
3. UserService validates the input.
4. If validation succeeds:
   - UserModel creates the user.
   - Database stores the record.
   - API returns **201 Created**.
5. Otherwise:
   - API returns **400 Bad Request**.

---

# Fetch Places
<img width="930" height="593" alt="Fetching a List of Places" src="https://github.com/user-attachments/assets/a1cd0845-0994-4ddf-9bbd-7e898fa720c1" />

### Endpoint

```
GET /places?city=Riyadh
```

> *(Insert Fetch Places Diagram here.)*

```md
![Fetch Places](images/fetch_places.png)
```

### Description

1. Client requests available places.
2. API forwards the request to PlaceService.
3. PlaceService queries PlaceModel.
4. Database returns matching places.
5. API returns **200 OK**.

---

# Create Place
<img width="930" height="575" alt="Place Creation" src="https://github.com/user-attachments/assets/8537a759-5de8-40dd-bf20-3a9b4d07db9c" />

### Endpoint

```
POST /places
```

> *(Insert Create Place Diagram here.)*

```md
![Create Place](images/create_place.png)
```

### Description

1. Client submits place information.
2. PlaceService validates the data.
3. PlaceModel creates the object.
4. Database stores the place.
5. API returns **201 Created**.

If validation fails, the API returns **400 Bad Request**.

---

# Submit Review
<img width="930" height="593" alt="Review Submission" src="https://github.com/user-attachments/assets/450cb761-1630-421a-9b6f-b28cdb481fcd" />

### Endpoint

```
POST /reviews
```

> *(Insert Review Diagram here.)*

```md
![Submit Review](images/review_submission.png)
```

### Description

1. Client submits review data.
2. ReviewService validates the request.
3. ReviewModel creates the review.
4. Database stores it.
5. API returns **201 Created**.

If validation fails, the API returns **400 Bad Request**.

---

# Overall Architecture

The implementation follows a clean layered architecture where each layer has a single responsibility.

- The Presentation Layer handles client communication.
- The Business Logic Layer applies business rules.
- The Persistence Layer manages data storage.

This separation simplifies testing, maintenance, and future expansion of the application.

---

# Conclusion

This technical documentation combines the architectural, structural, and behavioral views of the HBnB Evolution application.

The package diagram provides a high-level overview of the system architecture.

The class diagram defines the business entities and their relationships.

The sequence diagrams demonstrate how API requests flow through the application.

Together, these diagrams provide a complete reference for the implementation phase and ensure that developers have a clear understanding of the system design before development begins.
