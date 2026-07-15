# HBnB Part 2 - Testing Report (Task 6)

## Overview
This report documents the testing and validation process for all API endpoints implemented in Part 2 of the HBnB project (Users, Amenities, Places, Reviews).

---

## 1. Validation Summary

Basic validation has been implemented at the model level for all entities:

| Entity | Validation Rules |
|---|---|
| User | `first_name`, `last_name` required (max 50 chars); `email` must match valid format |
| Place | `title` required (max 100 chars); `price` must be positive; `latitude` between -90 and 90; `longitude` between -180 and 180 |
| Review | `text`/`comment` required; `rating` must be an integer between 1-5; `user_id` and `place_id` must reference existing entities |
| Amenity | `name` required (max 50 chars) |

---

## 2. Automated Unit Tests (unittest)

**File:** `tests/test_api.py`
**Command:** `python -m unittest tests.test_api -v`

**Result:**
