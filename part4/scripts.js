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

    checkAuthentication();

    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const selectedPrice = event.target.value;
            filterPlacesByPrice(selectedPrice);
        });
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
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (loginLink) {
        if (!token) {
            loginLink.style.display = 'block';
        } else {
            loginLink.style.display = 'none';
        }
    }

    if (document.getElementById('places-list')) {
        fetchPlaces(token);
    }
}

async function fetchPlaces(token) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://127.0.0.1:5000/api/v1/places/', {
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