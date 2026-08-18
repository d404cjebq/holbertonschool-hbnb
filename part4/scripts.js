document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            await loginUser(email, password);
        });
    }

    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
        const token = checkAuthenticationRedirect();
        const placeId = getPlaceIdFromURL();

        reviewForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const reviewText = document.getElementById("review").value;
            const rating = document.getElementById("rating").value;
            await submitReview(token, placeId, reviewText, rating);
        });
    } else {
        const placeId = getPlaceIdFromURL();

        if (placeId) {
            checkAuthenticationForPlace(placeId);
        } else {
            checkAuthentication();
        }
    }

    const priceFilter = document.getElementById("price-filter");
    if (priceFilter) {
        priceFilter.addEventListener("change", (event) => {
            const selectedPrice = event.target.value;
            filterPlacesByPrice(selectedPrice);
        });
    }
});

async function loginUser(email, password) {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            document.cookie = "token=" + data.access_token + "; path=/";
            window.location.href = "index.html";
        } else {
            alert("Login failed: " + response.statusText);
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
}

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

function checkAuthentication() {
    const token = getCookie("token");
    const loginLink = document.getElementById("login-link");

    if (loginLink) {
        if (!token) {
            loginLink.style.display = "block";
        } else {
            loginLink.style.display = "none";
        }
    }

    if (document.getElementById("places-list")) {
        fetchPlaces(token);
    }
}

async function fetchPlaces(token) {
    try {
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }

        const response = await fetch("http://127.0.0.1:5000/api/v1/places/", {
            method: "GET",
            headers: headers
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        }
    } catch (error) {
        console.error("Error fetching places:", error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById("places-list");
    if (!placesList) return;

    const heading = placesList.querySelector("h2");
    placesList.innerHTML = "";
    if (heading) {
        placesList.appendChild(heading);
    }

    places.forEach(place => {
        const placeCard = document.createElement("article");
        placeCard.className = "place-card";
        placeCard.setAttribute("data-price", place.price);

        placeCard.innerHTML =
            "<h3>" + place.title + "</h3>" +
            "<p class=\"place-price\">$" + place.price + " / night</p>" +
            "<button class=\"details-button\" onclick=\"window.location.href=" +
            "'place.html?id=" + place.id + "'\">View Details</button>";

        placesList.appendChild(placeCard);
    });
}

function filterPlacesByPrice(maxPrice) {
    const placeCards = document.querySelectorAll(".place-card");

    placeCards.forEach(card => {
        const price = parseFloat(card.getAttribute("data-price"));

        if (maxPrice === "all" || price <= parseFloat(maxPrice)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function checkAuthenticationForPlace(placeId) {
    const token = getCookie("token");
    const addReviewSection = document.getElementById("add-review");
    const loginLink = document.getElementById("login-link");

    if (!token) {
        if (addReviewSection) addReviewSection.style.display = "none";
        if (loginLink) loginLink.style.display = "block";
    } else {
        if (addReviewSection) addReviewSection.style.display = "block";
        if (loginLink) loginLink.style.display = "none";
    }

    fetchPlaceDetails(token, placeId);
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }

        const response = await fetch("http://127.0.0.1:5000/api/v1/places/" + placeId, {
            method: "GET",
            headers: headers
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            console.error("Failed to fetch place details:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching place details:", error);
    }
}

function displayPlaceDetails(place) {
    const placeDetails = document.getElementById("place-details");
    if (!placeDetails) return;

    const ownerName = place.owner
        ? place.owner.first_name + " " + place.owner.last_name
        : "Unknown host";

    const amenitiesHTML = place.amenities.map(a => "<li>" + a.name + "</li>").join("");

    placeDetails.innerHTML =
        "<div class=\"place-info\">" +
        "<h1>" + place.title + "</h1>" +
        "<p class=\"host\">Hosted by " + ownerName + "</p>" +
        "<p class=\"place-price\">$" + place.price + " / night</p>" +
        "<h2>Description</h2>" +
        "<p class=\"description\">" + (place.description || "") + "</p>" +
        "<h2>Amenities</h2>" +
        "<ul class=\"amenities-list\">" +
        (amenitiesHTML || "<li>No amenities listed.</li>") +
        "</ul>" +
        "</div>";

    const reviewsSection = document.getElementById("reviews");
    if (reviewsSection) {
        const reviewsHeading = reviewsSection.querySelector("h2");
        reviewsSection.innerHTML = "";
        if (reviewsHeading) {
            reviewsSection.appendChild(reviewsHeading);
        }

        if (place.reviews && place.reviews.length > 0) {
            place.reviews.forEach(review => {
                const reviewCard = document.createElement("article");
                reviewCard.className = "review-card";
                reviewCard.innerHTML =
                    "<h3 class=\"review-user\">" + (review.user_id || "Anonymous") + "</h3>" +
                    "<p class=\"review-rating\">Rating: " + review.rating + "/5</p>" +
                    "<p class=\"review-comment\">" + review.text + "</p>";
                reviewsSection.appendChild(reviewCard);
            });
        } else {
            const noReviews = document.createElement("p");
            noReviews.textContent = "No reviews yet.";
            reviewsSection.appendChild(noReviews);
        }
    }

    const addReviewLink = document.querySelector(".add-review-link");
    if (addReviewLink) {
        addReviewLink.href = "add_review.html?id=" + place.id;
    }
}

function checkAuthenticationRedirect() {
    const token = getCookie("token");
    if (!token) {
        window.location.href = "index.html";
        return null;
    }
    return token;
}

async function submitReview(token, placeId, reviewText, rating) {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/v1/reviews/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                text: reviewText,
                rating: parseInt(rating),
                place_id: placeId
            })
        });

        handleReviewResponse(response);
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
}

async function handleReviewResponse(response) {
    if (response.ok) {
        alert("Review submitted successfully!");
        const reviewForm = document.getElementById("review-form");
        if (reviewForm) reviewForm.reset();
    } else {
        const data = await response.json();
        alert("Failed to submit review: " + (data.error || response.statusText));
    }
}
