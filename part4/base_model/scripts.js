const API_URL = 'http://127.0.0.1:5000/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    // --- Login form (present on index.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await loginUser(email, password);
        });
    }

    // --- Price filter (index.html) ---
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            filterPlacesByPrice(event.target.value);
        });
    }

    // --- Page routing: only one of these should match per page ---
    if (document.getElementById('review-form')) {
        // add_review.html
        setupAddReviewPage();
    } else if (getPlaceIdFromURL()) {
        // place.html
        checkAuthenticationForPlace(getPlaceIdFromURL());
    } else if (document.getElementById('places-list')) {
        // index.html
        checkAuthentication();
    }

});

// ---------------- Login ----------------

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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// ---------------- Index / places list ----------------

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (loginLink) {
        loginLink.style.display = token ? 'none' : 'block';
    }

    fetchPlaces(token);
}

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

        placeCard.innerHTML = `
            <h3>${place.title}</h3>
            <p class="place-price">$${place.price} / night</p>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;

        placesList.appendChild(placeCard);
    });
}

function filterPlacesByPrice(maxPrice) {
    const placeCards = document.querySelectorAll('.place-card');
    placeCards.forEach((card) => {
        const price = parseFloat(card.dataset.price);
        card.style.display = (maxPrice === 'all' || price <= parseFloat(maxPrice)) ? 'block' : 'none';
    });
}

// ---------------- Place details ----------------

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('place_id');
}

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
            return;
        }

        const place = await placeResponse.json();
        const reviews = reviewsResponse.ok ? await reviewsResponse.json() : [];

        displayPlaceDetails(place, reviews);
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

function displayPlaceDetails(place, reviews) {
    const placeDetails = document.getElementById('place-details');
    if (!placeDetails) return;

    const ownerName = place.owner
        ? `${place.owner.first_name} ${place.owner.last_name}`
        : 'Unknown host';

    // Guarded: don't crash the whole render if amenities is missing/undefined.
    const amenitiesHTML = (place.amenities || []).map((a) => `<li>${a.name}</li>`).join('');

    placeDetails.innerHTML = `
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

function requireAuthentication() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
        return null;
    }
    return token;
}

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
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }
});
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