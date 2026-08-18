const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

let placeId = null;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await loginUser(email, password);
        });
    }

    if (document.getElementById('place-details')) {
        placeId = getPlaceIdFromURL();
        checkAuthentication();
    }

    if (document.getElementById('places-list')) {
        checkAuthenticationForIndex();
    }

    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const selectedPrice = event.target.value;
            filterPlacesByPrice(selectedPrice);
        });
    }
<<<<<<< HEAD

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const token = getCookie('token');
            await submitReview(token, placeId);
        });
    }
});

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function checkAuthentication() {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        addReviewSection.style.display = 'none';
        fetchPlaceDetails(token, placeId);
    } else {
        addReviewSection.style.display = 'block';
        fetchPlaceDetails(token, placeId);
=======
 if (document.getElementById('review-form')) {
        setupAddReviewPage();
    }
    });
    
async function loginUser(email, password) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            document.cookie = `token=${data.access_token}; path=/`;
            window.location.href = 'index.html';
        } else {
            alert('Login failed: ' + response.statusText);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
>>>>>>> c804a8e (Add Review)
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            console.error('Failed to fetch place details:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

function displayPlaceDetails(place) {
    const detailsSection = document.getElementById('place-details');

    detailsSection.innerHTML = '';

    const nameEl = document.createElement('h1');
    nameEl.textContent = place.title || 'Unnamed place';

    const hostEl = document.createElement('p');
    hostEl.className = 'host';
    hostEl.textContent = place.owner
        ? `Hosted by ${place.owner.first_name} ${place.owner.last_name}`
        : 'Host unknown';

    const priceEl = document.createElement('p');
    priceEl.className = 'place-price';
    priceEl.textContent = `$${place.price ?? 'N/A'} / night`;

    const descTitle = document.createElement('h2');
    descTitle.textContent = 'Description';

    const descEl = document.createElement('p');
    descEl.className = 'description';
    descEl.textContent = place.description || 'No description provided.';

    const amenitiesTitle = document.createElement('h2');
    amenitiesTitle.textContent = 'Amenities';

    const amenitiesList = document.createElement('ul');
    amenitiesList.className = 'amenities-list';
    if (place.amenities && place.amenities.length > 0) {
        place.amenities.forEach(amenity => {
            const li = document.createElement('li');
            li.textContent = amenity.name || amenity;
            amenitiesList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No amenities listed.';
        amenitiesList.appendChild(li);
    }

    detailsSection.appendChild(nameEl);
    detailsSection.appendChild(hostEl);
    detailsSection.appendChild(priceEl);
    detailsSection.appendChild(descTitle);
    detailsSection.appendChild(descEl);
    detailsSection.appendChild(amenitiesTitle);
    detailsSection.appendChild(amenitiesList);

    displayReviews(place.reviews);
}

function displayReviews(reviews) {
    const reviewsSection = document.getElementById('reviews');
    if (!reviewsSection) return;

    reviewsSection.innerHTML = '<h2>Reviews</h2>';

    if (!reviews || reviews.length === 0) {
        const noReviews = document.createElement('p');
        noReviews.textContent = 'No reviews yet.';
        reviewsSection.appendChild(noReviews);
        return;
    }

    reviews.forEach(review => {
        const card = document.createElement('article');
        card.className = 'review-card';

        const userEl = document.createElement('h3');
        userEl.className = 'review-user';
        userEl.textContent = review.user
            ? `${review.user.first_name} ${review.user.last_name}`
            : 'Anonymous';

        const ratingEl = document.createElement('p');
        ratingEl.className = 'review-rating';
        ratingEl.textContent = `Rating: ${review.rating ?? '—'}/5`;

        const commentEl = document.createElement('p');
        commentEl.className = 'review-comment';
        commentEl.textContent = review.text || review.comment || '';

        card.appendChild(userEl);
        card.appendChild(ratingEl);
        card.appendChild(commentEl);
        reviewsSection.appendChild(card);
    });
}

async function submitReview(token, placeId) {
    const reviewTextEl = document.getElementById('review-text');
    const reviewText = reviewTextEl ? reviewTextEl.value.trim() : '';

    if (!reviewText) {
        alert('Please write a review before submitting.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: reviewText })
        });

        if (response.ok) {
            if (reviewTextEl) reviewTextEl.value = '';
            alert('Review submitted successfully!');
            fetchPlaceDetails(token, placeId);
        } else {
            alert('Failed to submit review: ' + response.statusText);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}

function checkAuthenticationForIndex() {
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
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/places/`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places:', response.statusText);
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
    if (heading) {
        placesList.appendChild(heading);
    }

    places.forEach(place => {
        const placeCard = document.createElement('article');
        placeCard.className = 'place-card';
        placeCard.setAttribute('data-price', place.price);
        placeCard.innerHTML = `
            <h3>${place.title}</h3>
            <p class="place-price">$${place.price} / night</p>
            <button class="details-button" onclick="window.location.href='place.html?id=${place.id}'">View Details</button>
        `;
        placesList.appendChild(placeCard);
    });
}

function filterPlacesByPrice(maxPrice) {
    const placeCards = document.querySelectorAll('.place-card');
    placeCards.forEach(card => {
        const price = parseFloat(card.getAttribute('data-price'));
        if (maxPrice === 'all' || price <= parseFloat(maxPrice)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
<<<<<<< HEAD

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `token=${data.access_token}; path=/`;
            window.location.href = 'index.html';
        } else {
            alert('Login failed: ' + response.statusText);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}
=======
/* ======================================================================
   Add Review page (add_review.html)
   ====================================================================== */
function requireAuthentication() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
        return null;
    }
    return token;
}
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
async function displayPlaceName(token, placeId) {
    const nameSpan = document.getElementById('place-name-value');
    if (!nameSpan || !placeId) return;

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}/`, {
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
    return fetch('http://127.0.0.1:5000/api/v1/reviews/', {
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
async function handleResponse(response, form) {
    if (response.ok) {
        alert('Review submitted successfully!');
        if (form) {
            form.reset();
        }
    } else {
        let message = 'Failed to submit review.';
        try {
            const data = await response.json();
            if (data && data.message) {
                message = data.message;
            }
        } catch (error) {
        }
        alert(message);
    }
}

function setupAddReviewPage() {
    const token = requireAuthentication();
    if (!token) return; // already redirected

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
                await handleResponse(response, reviewForm);
            } catch (error) {
                console.error('Error submitting review:', error);
                alert('Failed to submit review. Please try again.');
            }
        });
    }
}
>>>>>>> c804a8e (Add Review)
