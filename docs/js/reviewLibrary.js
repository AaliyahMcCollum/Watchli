console.log("reviewLibrary.js loaded!");
const API_BASE = "https://watchli-api.onrender.com";
const API_URL = "${API_BASE}/api/ratings";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
  window.location.href = "./login.html";
}

let ratingsData = [];

// Convert rating → star string
function renderStars(num) {
  return "★".repeat(num) + "☆".repeat(5 - num);
}

// Fetch all ratings
async function loadRatings() {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) {
      console.error("Failed to load ratings:", res.status);
      return;
    }

    ratingsData = await res.json();
    renderGrid(ratingsData);
  } catch (err) {
    console.error("Error fetching ratings:", err);
  }
}

// Render grid using homepage-style structure
function renderGrid(list) {
  const grid = document.getElementById("reviewGrid");
  grid.innerHTML = "";

  if (!list || list.length === 0) {
    grid.innerHTML = `
      <p style="color:#ccc; text-align:center; grid-column:1/-1;">
        You have not written any reviews yet.
      </p>
    `;
    return;
  }

  list.forEach((r) => {
    grid.innerHTML += `
      <div class="movie-card">

        <div class="movie-card-inner" 
             data-movie-id="${r.movieId}" 
             data-rating-id="${r.id}">
          
          <img src="${POSTER_URL + r.poster}" alt="${r.reviewTitle || "Movie"}">

          <div class="movie-overlay">
            <button class="overlay-btn view_btn">View</button>
            <button class="overlay-btn edit_btn">Edit</button>
            <button class="overlay-btn delete_btn">Delete</button>
          </div>
        </div>

        <p>${r.reviewTitle || "Untitled Review"}</p>
        <div class="stars">${renderStars(r.rating)}</div>

      </div>
    `;
  });
}

// Click handler (View / Edit / Delete)
document.addEventListener("click", async (e) => {
  const cardInner = e.target.closest(".movie-card-inner");
  if (!cardInner) return;

  const movieId = cardInner.dataset.movieId;
  const ratingId = cardInner.dataset.ratingId;

  // VIEW
  if (e.target.classList.contains("view_btn")) {
    window.location.href = `./movieInfo.html?id=${movieId}`;
    return;
  }

  // EDIT
  if (e.target.classList.contains("edit_btn")) {
    window.location.href = `./writeReview.html?movieId=${movieId}`;
    return;
  }

  // DELETE
  if (e.target.classList.contains("delete_btn")) {
    if (!confirm("Delete this review?")) return;

    try {
      const res = await fetch(`${API_URL}/${ratingId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) {
        alert("Error deleting review.");
        return;
      }

      ratingsData = ratingsData.filter((r) => r.id != ratingId);
      renderGrid(ratingsData);
    } catch (err) {
      console.error(err);
    }
  }
});

// Sort dropdown
document.getElementById("sort").addEventListener("change", (e) => {
  const value = e.target.value;
  const sorted = [...ratingsData];

  if (value === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (value === "title") {
    sorted.sort((a, b) =>
      (a.reviewTitle || "").localeCompare(b.reviewTitle || "")
    );
  } else if (value === "recent") {
    sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  renderGrid(sorted);
});

// Initialize
loadRatings();
