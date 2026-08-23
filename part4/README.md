# HBnB — Simple Web Client (Part 4)

Static HTML/CSS/JS front end for the HBnB project. Talks to the Flask
REST API (Part 3) to list places, view details, log in, and add reviews.

## Structure

```
index.html         # Home: hero, region banners, list of places
login.html          # Login form
register.html        # Register form (admin only — see note below)
place.html          # Place details, image gallery, reviews
add_review.html      # Add a review form
styles.css           # Styling
scripts.js           # All front-end logic
images/              # Local images
```

## Run it

1. Start the backend (from `part3/`):
   ```
   python run.py
   ```
2. Serve the front end (from `part4/`), e.g. VS Code Live Server or:
   ```
   python -m http.server 5500
   ```
3. Open `http://127.0.0.1:5500/index.html`.

API base URL is set at the top of `scripts.js` — change it there if
your backend runs elsewhere.

## Test accounts

| Role  | Email                        |
|-------|-------------------------------|
| Admin | admin@hbnb.com                |
| User  | sara.ahmed@example.com        |
| User  | khalid.omar@example.com       |
| User  | mohammed.ali@example.com      |
| User  | fatima.hassan@example.com     |
| User  | noura.saad@example.com        |
| User  | testadmin@hbnb.com            |
| User  | testuser@hbnb.com             |

## Notes

- `POST /users/` is admin-only, so **register.html only works while
  an admin is logged in** (their token is sent with the request).
- Login stores the JWT in a `token` cookie; used for authenticated
  requests (add review, register).
- Invalid place IDs show an on-page error instead of a blank page.
