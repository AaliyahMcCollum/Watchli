console.log("writeReview.js loaded!");

// -----------------------------
// CONSTANTS
// -----------------------------
const API_URL = "http://localhost:8080/api/ratings/save";
const TMDB_BASE = "https://api.themoviedb.org/3/movie/";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_KEY = "1392ead50e45927a38f55de4658b4dcb";

// -----------------------------
// AUTH + VALIDATION
// -----------------------------
const token = localStorage.getItem("token");
if (!token) {
  alert("Please log in to write a review.");
  window.location.href = "/html/login.html";
}

// -----------------------------
// GET MOVIE ID FROM URL
// -----------------------------
const params = new URLSearchParams(window.location.search);
const movieId = params.get("movieId");

if (!movieId) {
  alert("Missing movie ID in URL.");
  window.location.href = "/index.html";
}

// -----------------------------
// LOAD MOVIE INFO FROM TMDB
// -----------------------------
async function loadMovieInfo() {
  console.log("Loading movie info for ID:", movieId);

  try {
    const res = await fetch(`${TMDB_BASE}${movieId}?api_key=${TMDB_KEY}`);
    if (!res.ok) {
      console.error("TMDB error:", res.status);
      return "";
    }

    const movie = await res.json();

    // If TMDB gives us an error response
    if (movie.success === false) {
      console.error("TMDB returned an error:", movie.status_message);
      return "";
    }

    // FILL UI
    document.getElementById("moviePoster").src = POSTER_URL + movie.poster_path;
    document.getElementById("movieTitle").textContent = movie.title;

    console.log("Loaded:", movie.title);

    return movie.poster_path;
  } catch (err) {
    console.error("Failed to load movie:", err);
    return "";
  }
}

// -----------------------------
// CREATE STAR SELECTOR
// -----------------------------
let selectedRating = 0;

function generateStars(current = 0) {
  const starDiv = document.getElementById("starSelector");
  starDiv.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = i <= current ? "★" : "☆";
    star.classList.add("star");

    star.addEventListener("click", () => {
      selectedRating = i;
      generateStars(selectedRating);
    });

    starDiv.appendChild(star);
  }
}

// -----------------------------
// LOAD EXISTING REVIEW (EDIT MODE)
// -----------------------------
async function loadExistingReview() {
  console.log("Checking if user has an existing review...");

  try {
    const res = await fetch(`http://localhost:8080/api/ratings/${movieId}`, {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) return;

    const review = await res.json();
    if (!review || !review.id) return;

    console.log("Existing review found:", review);

    document.getElementById("reviewTitle").value = review.reviewTitle || "";
    document.getElementById("reviewText").value = review.description || "";
    selectedRating = review.rating;

    generateStars(selectedRating);
  } catch (err) {
    console.error("Error loading existing review:", err);
  }
}

// -----------------------------
// SUBMIT REVIEW
// -----------------------------
async function submitReview(posterPath) {
  const reviewTitle = document.getElementById("reviewTitle").value.trim();
  const description = document.getElementById("reviewText").value.trim();

  if (selectedRating === 0) {
    alert("Please select a star rating.");
    return;
  }

  if (!reviewTitle || !description) {
    alert("Please fill out both the review title and text.");
    return;
  }

  const body = {
    movieId: Number(movieId),
    rating: selectedRating,
    reviewTitle,
    description,
    poster: posterPath,
  };

  console.log("Submitting review:", body);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("Review submitted!");
      window.location.href = "./reviewLibrary.html";
    } else {
      const text = await res.text();
      alert("Error submitting review: " + text);
      console.error("Review error:", text);
    }
  } catch (err) {
    console.error("Submit failed:", err);
  }
}

// -----------------------------
// INITIALIZATION
// -----------------------------
(async function init() {
  generateStars(0);

  console.log("Starting writeReview INIT...");

  const posterPath = await loadMovieInfo();
  await loadExistingReview();

  document.getElementById("submitReview").addEventListener("click", () => {
    submitReview(posterPath);
  });

  console.log("writeReview.js fully initialized.");
})();
