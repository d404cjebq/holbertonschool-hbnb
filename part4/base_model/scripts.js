/**
 * scripts.js
 * -----------
 * Front-end logic for the HBnB web client.
 * Handles: login, register, listing places (with price/region filters),
 * viewing place details (with image gallery + reviews), and adding reviews.
 *
 * All requests go to the Flask REST API defined by API_URL below.
 */

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:5000/api/v1'
    : 'https://holbertonschool-hbnb-cgs0.onrender.com/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    // --- Login form (present on login.html) ---
    // Attaches a submit handler that calls the /auth/login endpoint
    // and stores the returned JWT in a cookie on success.
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await loginUser(email, password);
        });
    }

    // --- Register form (present on register.html) ---
    // NOTE: user creation (POST /users/) requires a valid admin JWT,
    // so this form only succeeds if an admin is currently logged in
    // (their token is read from the cookie and sent with the request).
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const firstName = document.getElementById('firstname').value;
            const lastName = document.getElementById('lastname').value;
            const birthdate = document.getElementById('birthdate').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await registerUser(firstName, lastName, birthdate, email, password);
        });
    }

    // --- Price filter dropdown (present on index.html) ---
    // Re-filters the already-rendered place cards client-side; no new
    // API call is made when the filter changes.
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            filterPlacesByPrice(event.target.value);
        });
    }

    // --- Destination filter cards (Red Sea / AlUla banners on index.html) ---
    // Clicking a destination card filters the place list by region
    // in place, without reloading or navigating the page.
    const destinationCards = document.querySelectorAll('.destination-card[data-region]');
    destinationCards.forEach((card) => {
        card.addEventListener('click', (event) => {
            event.preventDefault();
            const region = card.dataset.region;
            filterPlacesByRegion(region);
        });
    });

    // --- Page routing ---
    // Each HTML page reuses this same script file, so we detect which
    // page we're on by checking for a page-specific element, and only
    // run the matching initialization logic.
    if (document.getElementById('review-form')) {
        // add_review.html
        setupAddReviewPage();
    } else if (getPlaceIdFromURL()) {
        // place.html (has an ?id= or ?place_id= query param)
        checkAuthenticationForPlace(getPlaceIdFromURL());
    } else if (document.getElementById('places-list')) {
        // index.html
        checkAuthentication();
    }

});

// ---------------- Login ----------------

/**
 * Sends email/password to the auth endpoint. On success, stores the
 * returned JWT access token in a cookie (used for authenticated
 * requests elsewhere) and redirects to the home page.
 */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `token=${data.access_token}; path=/; max-age=86400`;
            window.location.href = 'index.html';
        } else {
            alert('Login failed: ' + response.statusText);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}

/**
 * Registers a new user via POST /users/. This endpoint is admin-only
 * on the backend, so we attach the current admin's JWT (from the
 * cookie, if present) as an Authorization header.
 */
async function registerUser(firstName, lastName, birthdate, email, password) {
    try {
        const token = getCookie('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/users/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                birthdate: birthdate,
                email: email,
                password: password
            })
        });

        if (response.ok) {
            alert('Registration successful! Please log in.');
            window.location.href = 'login.html';
        } else {
            const data = await response.json().catch(() => null);
            const message = (data && (data.message || data.error)) || 'Registration failed.';
            alert(message);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}

/** Reads a single cookie value by name (used for the stored JWT token). */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// ---------------- Index / places list ----------------

/**
 * Checks whether the user is logged in (has a token cookie), toggles
 * the visibility of the "Login" link accordingly, then fetches and
 * renders the list of places.
 */
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (loginLink) {
        loginLink.style.display = token ? 'none' : 'block';
    }

    fetchPlaces(token);
}

/** Fetches all places from the API and hands them to displayPlaces(). */
async function fetchPlaces(token) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/places/`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places:', response.status);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }

}

/**
 * Renders one card per place inside #places-list. Each card stores
 * its price/title in data attributes so the price and region filters
 * can show/hide cards without re-fetching from the API.
 */
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    const heading = placesList.querySelector('h2');
    placesList.innerHTML = '';
    if (heading) placesList.appendChild(heading);

    places.forEach((place) => {
        const placeCard = document.createElement('article');
        placeCard.className = 'place-card';
        placeCard.dataset.price = place.price;
        placeCard.dataset.title = place.title;
        placeCard.innerHTML = `
              <img src="${place.image_url || (PLACE_IMAGES[place.title] && PLACE_IMAGES[place.title][0]) || 'images/placeholder.jpg'}" alt="${place.title}" class="place-image">
    <h3>${place.title}</h3>
    <p class="place-price">$${place.price} / night</p>
    <a href="place.html?id=${place.id}" class="details-button">View Details</a>
`;

        placesList.appendChild(placeCard);
    });
    // If the page URL already has a ?region= param (e.g. after a
    // destination-card click set it earlier), re-apply that filter
    // to the freshly rendered cards.
    const region = getRegionFromURL();
    if (region) filterPlacesByRegion(region);
}

/** Hides/shows rendered place cards client-side based on max price. */
function filterPlacesByPrice(maxPrice) {
    const placeCards = document.querySelectorAll('.place-card');
    placeCards.forEach((card) => {
        const price = parseFloat(card.dataset.price);
        card.style.display = (maxPrice === 'all' || price <= parseFloat(maxPrice)) ? 'block' : 'none';
    });
}

// ---------------- Place details ----------------

/** Reads the place id from the URL, accepting either ?id= or ?place_id=. */
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('place_id');
}

/**
 * Shows/hides the "Add a review" section and the login link based on
 * whether the visitor is authenticated, then loads the place details.
 */
function checkAuthenticationForPlace(placeId) {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        if (addReviewSection) addReviewSection.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
    } else {
        if (addReviewSection) addReviewSection.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';

        const addReviewLink = document.querySelector('.add-review-link');
        if (addReviewLink) addReviewLink.href = `add_review.html?id=${placeId}`;
    }

    fetchPlaceDetails(token, placeId);
}

// NOTE: our reviews endpoint (/places/{id}/reviews) only returns
// id/text/rating/user_id right now — no embedded reviews array on
// the place object itself. Fetching them separately so this doesn't
// silently show "No reviews yet." if the backend never embeds them.
/**
 * Fetches both the place record and its reviews in parallel, then
 * renders them. If the place fetch fails (e.g. invalid id), a
 * user-facing error message is shown instead of a blank page.
 */
async function fetchPlaceDetails(token, placeId) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [placeResponse, reviewsResponse] = await Promise.all([
            fetch(`${API_URL}/places/${placeId}`, { method: 'GET', headers }),
            fetch(`${API_URL}/places/${placeId}/reviews`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        ]);

        if (!placeResponse.ok) {
            console.error('Failed to fetch place details:', placeResponse.status);
            showPlaceError(placeResponse.status);
            return;
        }

        const place = await placeResponse.json();
        const reviews = reviewsResponse.ok ? await reviewsResponse.json() : [];

        displayPlaceDetails(place, reviews);
    } catch (error) {
        console.error('Error fetching place details:', error);
        showPlaceError(0);
    }
}

/**
 * Shows a user-facing error message when the place details fail to
 * load (e.g. an invalid or deleted place id), hiding the details
 * section so the page doesn't look broken/empty.
 */
function showPlaceError(status) {
    const placeDetails = document.getElementById('place-details');
    const errorBox = document.getElementById('error-message');
    const reviewsSection = document.getElementById('reviews');
    const addReviewSection = document.getElementById('add-review');

    if (placeDetails) placeDetails.style.display = 'none';
    if (reviewsSection) reviewsSection.style.display = 'none';
    if (addReviewSection) addReviewSection.style.display = 'none';

    if (errorBox) {
        const message = status === 404
            ? 'This place could not be found. It may have been removed.'
            : 'Something went wrong while loading this place. Please try again.';
        errorBox.textContent = message;
        errorBox.style.display = 'block';
    }
}

/**
 * Renders the place's image gallery, info, amenities, and its list
 * of reviews (or a "No reviews yet." message when there are none).
 */
function displayPlaceDetails(place, reviews) {
    const placeDetails = document.getElementById('place-details');
    if (!placeDetails) return;

    const ownerName = place.owner
        ? `${place.owner.first_name} ${place.owner.last_name}`
        : 'Unknown host';

    // Guarded: don't crash the whole render if amenities is missing/undefined.
    const amenitiesHTML = (place.amenities || []).map((a) => `<li>${a.name}</li>`).join('');

    // Image gallery: prefer a curated local image set (PLACE_IMAGES) keyed
    // by title; fall back to the API's image_url, then a placeholder.
    const gallery = PLACE_IMAGES[place.title] || [place.image_url || 'images/placeholder.jpg'];
    const galleryHTML = `
        <img src="${gallery[0]}" alt="${place.title}" class="main-image">
        ${gallery.length > 1 ? `
        <div class="thumbnail-row">
            ${gallery.map((img, i) => `<img src="${img}" alt="${place.title} ${i + 1}" class="thumbnail-image">`).join('')}
        </div>` : ''}
    `;
    placeDetails.innerHTML = `
          ${galleryHTML}
    <div class="place-info">
            <h1>${place.title}</h1>
            <p class="host">Hosted by ${ownerName}</p>
            <p class="place-price">$${place.price} / night</p>
            <h2>Description</h2>
            <p class="description">${place.description || ''}</p>
            <h2>Amenities</h2>
            <ul class="amenities-list">${amenitiesHTML || '<li>No amenities listed.</li>'}</ul>
        </div>
    `;

    // Clicking a thumbnail swaps the main gallery image.
    const mainImg = placeDetails.querySelector('.main-image');
    placeDetails.querySelectorAll('.thumbnail-image').forEach((thumb) => {
        thumb.addEventListener('click', () => {
            mainImg.src = thumb.src;
        });
    });

    const reviewsSection = document.getElementById('reviews');
    if (!reviewsSection) return;

    const reviewsHeading = reviewsSection.querySelector('h2');
    reviewsSection.innerHTML = '';
    if (reviewsHeading) reviewsSection.appendChild(reviewsHeading);

    if (reviews && reviews.length > 0) {
        reviews.forEach((review) => {
            const reviewCard = document.createElement('article');
            reviewCard.className = 'review-card';
            // Backend doesn't return a reviewer name on this endpoint yet,
            // so we fall back to user_id until that's added.
            reviewCard.innerHTML = `
                <h3 class="review-user">${review.user_id || 'Anonymous'}</h3>
                <p class="review-rating">Rating: ${review.rating}/5</p>
                <p class="review-comment">${review.text}</p>
            `;
            reviewsSection.appendChild(reviewCard);
        });
    } else {
        const noReviews = document.createElement('p');
        noReviews.textContent = 'No reviews yet.';
        reviewsSection.appendChild(noReviews);
    }

}

// ---------------- Add review ----------------

/**
 * Guards the add_review.html page: redirects to index.html if the
 * visitor has no token cookie (i.e. isn't logged in).
 */
function requireAuthentication() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
        return null;
    }
    return token;
}

/** Fills in the place name on the "Add a Review" page. */
async function displayPlaceName(token, placeId) {
    const nameSpan = document.getElementById('place-name-value');
    if (!nameSpan || !placeId) return;

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/places/${placeId}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const place = await response.json();
            nameSpan.textContent = place.title;
        }
    } catch (error) {
        console.error('Error fetching place name:', error);
    }
}

/** POSTs a new review (text + rating) for the given place. */
async function submitReview(token, placeId, reviewText, rating) {
    return fetch(`${API_URL}/reviews/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            text: reviewText,
            rating: parseInt(rating, 10),
            place_id: placeId
        })
    });
}

/**
 * Shows a success/error alert for a submitReview() response and
 * resets the form on success.
 */
async function handleReviewResponse(response, form) {
    if (response.ok) {
        alert('Review submitted successfully!');
        if (form) form.reset();
    } else {
        let message = 'Failed to submit review.';
        try {
            const data = await response.json();
            if (data && (data.message || data.error)) {
                message = data.message || data.error;
            }
        } catch (e) {
            // response body wasn't JSON — keep the default message
        }
        alert(message);
    }
}
// ===== إضافة جديدة: تفعيل قائمة الهامبرغر =====
// Toggles the mobile hamburger nav menu open/closed on click.
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }
});

/**
 * Initializes the add_review.html page: requires login, fills in the
 * place name, and wires up the review form's submit handler.
 */
function setupAddReviewPage() {
    const token = requireAuthentication();
    if (!token) return; // already redirected to index.html

    const placeId = getPlaceIdFromURL();
    const reviewForm = document.getElementById('review-form');

    displayPlaceName(token, placeId);

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const reviewText = document.getElementById('review').value;
            const rating = document.getElementById('rating').value;

            try {
                const response = await submitReview(token, placeId, reviewText, rating);
                await handleReviewResponse(response, reviewForm);
            } catch (error) {
                console.error('Error submitting review:', error);
                alert('Failed to submit review. Please try again.');
            }
        });
    }
}

// ===== تحديث: فلترة حسب الوجهة بالاعتماد على اسم المكان =====

/**
 * Local image gallery per place, keyed by title. Used because the
 * backend currently only stores a single image_url (or none) per
 * place; this lets the UI show a richer photo set without backend
 * changes.
 */
const PLACE_IMAGES = {
    'Shebara': ['images/shein.png', 'images/shein1.png', 'images/shein2.png', 'images/sheout.png', 'images/sheout1.png', 'images/sheout2.png'],
    'Dar Tantora': ['images/dtin.png', 'images/dtin1.png', 'images/dtin2.png', 'images/dtout.png', 'images/dtout1.png', 'images/dtout2.png'],
    'Four Seasons': ['images/Fourin.png', 'images/Fourin1.png', 'images/Fourin2.png', 'images/Fourout.png', 'images/Fourout1.png', 'images/Fourout2.png'],
    'Banyan Tree': ['images/btin.png', 'images/btin1.png', 'images/btin2.png', 'images/btout.png', 'images/btout1.png', 'images/btout2.png'],
    'InterContinental': ['images/interin.png', 'images/interin1.png', 'images/interin2.png', 'images/interout.png', 'images/interout1.png', 'images/interout2.png'],
    'Our Habitas': ['images/ohin.png', 'images/ohin1.png', 'images/ohin2.png', 'images/ohout.png', 'images/ohout1.png', 'images/ohout2.png'],
};

/** Maps each region filter (from the destination banners) to the place titles it includes. */
const REGION_PLACES = {
    redsea: ['Shebara', 'InterContinental', 'Four Seasons'],
    alula: ['Banyan Tree', 'Our Habitas', 'Dar Tantora']
};

/** Reads the ?region= query param from the current URL, if any. */
function getRegionFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('region');
}

/** Hides/shows rendered place cards client-side based on region. */
function filterPlacesByRegion(region) {
    const placeCards = document.querySelectorAll('.place-card');
    const allowedTitles = REGION_PLACES[region];

    placeCards.forEach((card) => {
        const title = card.dataset.title;
        const matches = !allowedTitles || allowedTitles.includes(title);
        card.style.display = matches ? 'block' : 'none';
    });
}
