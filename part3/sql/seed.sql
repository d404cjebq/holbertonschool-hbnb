-- ============================================
-- Initial Data (Seed)
-- ============================================

-- Administrator User
INSERT INTO users (id, first_name, last_name, email, password, is_admin)
VALUES (
    '36c9050e-ddd3-4c3b-9731-9f487208bbc1',
    'Admin',
    'HBnB',
    'admin@hbnb.io',
    '$2b$12$IXCFqLKdZgpEuqu9zremG.M97zDRAZBhmPlaDh.js4xEupyhU873W',
    1
);

-- Initial Amenities
INSERT INTO amenities (id, name) VALUES
    ('e1a2b3c4-1111-2222-3333-444455556666', 'WiFi'),
    ('e1a2b3c4-1111-2222-3333-444455557777', 'Swimming Pool'),
    ('e1a2b3c4-1111-2222-3333-444455558888', 'Air Conditioning');