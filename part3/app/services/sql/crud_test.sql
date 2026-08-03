-- ============================================
-- CRUD Test Script
-- ============================================

-- CREATE: Insert a test user
INSERT INTO users (id, first_name, last_name, email, password, is_admin)
VALUES (
    'test-user-1111-2222-3333-444455556666',
    'Test',
    'User',
    'test.crud@example.com',
    '$2b$12$testhashplaceholder',
    0
);

-- READ: Retrieve the test user
SELECT * FROM users WHERE email = 'test.crud@example.com';

-- READ: Retrieve all amenities
SELECT * FROM amenities;

-- CREATE: Insert a test place owned by the test user
INSERT INTO places (id, title, description, price, latitude, longitude, owner_id)
VALUES (
    'test-place-1111-2222-3333-444455556666',
    'Test Cabin',
    'A place for CRUD testing',
    100.0,
    45.0,
    -122.0,
    'test-user-1111-2222-3333-444455556666'
);

-- READ: Retrieve the test place
SELECT * FROM places WHERE title = 'Test Cabin';

-- CREATE: Link the test place to an amenity
INSERT INTO place_amenity (place_id, amenity_id)
VALUES (
    'test-place-1111-2222-3333-444455556666',
    'e1a2b3c4-1111-2222-3333-444455556666'
);

-- READ: Verify the place-amenity link
SELECT p.title, a.name
FROM places p
JOIN place_amenity pa ON p.id = pa.place_id
JOIN amenities a ON a.id = pa.amenity_id
WHERE p.id = 'test-place-1111-2222-3333-444455556666';

-- CREATE: Insert a test review
INSERT INTO reviews (id, text, rating, user_id, place_id)
VALUES (
    'test-review-1111-2222-3333-444455556666',
    'Great place for testing!',
    5,
    'test-user-1111-2222-3333-444455556666',
    'test-place-1111-2222-3333-444455556666'
);

-- READ: Retrieve the test review
SELECT * FROM reviews WHERE id = 'test-review-1111-2222-3333-444455556666';

-- UPDATE: Modify the test place's price
UPDATE places
SET price = 150.0
WHERE id = 'test-place-1111-2222-3333-444455556666';

-- READ: Confirm the update
SELECT title, price FROM places WHERE id = 'test-place-1111-2222-3333-444455556666';

-- DELETE: Remove the test review
DELETE FROM reviews WHERE id = 'test-review-1111-2222-3333-444455556666';

-- DELETE: Remove the place-amenity link
DELETE FROM place_amenity WHERE place_id = 'test-place-1111-2222-3333-444455556666';

-- DELETE: Remove the test place
DELETE FROM places WHERE id = 'test-place-1111-2222-3333-444455556666';

-- DELETE: Remove the test user
DELETE FROM users WHERE id = 'test-user-1111-2222-3333-444455556666';

-- READ: Confirm cleanup
SELECT * FROM users WHERE id = 'test-user-1111-2222-3333-444455556666';