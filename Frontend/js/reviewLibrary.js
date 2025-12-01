console.log("reviewLibrary.js loaded!");

// -----------------------------
// CONSTANTS
// -----------------------------
const API_URL = "http://localhost:8080/api/ratings";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

const token = localStorage.getItem("token");

// -----------------------------
// REQUIRE LOGIN
// -----------------------------
if (!token) {
  window.location.href = "./login.html";
}

let ratingsData = []; // local in-memory list

// -----------------------------
// STAR RENDERING
// -----------------------------
function renderStars(num) {
  return "★".repeat(num) + "☆".repeat(5 - num);
}

// -----------------------------
// LOAD USER RATINGS
// -----------------------------
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

// -----------------------------
// RENDER THE GRID
// -----------------------------
function renderGrid(list) {
  const grid = document.getElementById("reviewGrid");
  grid.innerHTML = "";

  if (!list || list.length === 0) {
    grid.innerHTML =
      "<p style='color:#ccc; text-align:center; grid-column:1/-1;'>You have not written any reviews yet.</p>";
    return;
  }

  list.forEach((r) => {
    grid.innerHTML += `
      <div class="movie_card"
           data-movie-id="${r.movieId}"
           data-rating-id="${r.id}">

        <div class="stars">${renderStars(r.rating)}</div>

        <img src="${POSTER_URL + r.poster}" 
             alt="${r.reviewTitle || "Movie"}" />

        <h3>${r.reviewTitle || "Untitled Review"}</h3>

        <div class="card_buttons">
          <button class="card_btn view_btn">View</button>
          <button class="card_btn edit_btn">Edit</button>
          <button class="card_btn delete_btn">Delete</button>
        </div>
      </div>
    `;
  });
}

// -----------------------------
// EVENT HANDLER — View / Edit / Delete
// -----------------------------
document.addEventListener("click", async (e) => {
  const card = e.target.closest(".movie_card");
  if (!card) return;

  const movieId = card.dataset.movieId;
  const ratingId = card.dataset.ratingId;

  // --- VIEW ---
  if (e.target.classList.contains("view_btn")) {
    window.location.href = `./movieInfo.html?id=${movieId}`;
    return;
  }

  // --- EDIT ---
  if (e.target.classList.contains("edit_btn")) {
    window.location.href = `./writeReview.html?movieId=${movieId}`;
    return;
  }

  // --- DELETE ---
  if (e.target.classList.contains("delete_btn")) {
    const sure = confirm("Are you sure you want to delete this review?");
    if (!sure) return;

    try {
      const res = await fetch(`${API_URL}/${ratingId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) {
        alert("Error deleting review.");
        return;
      }

      // Remove from list locally + re-render
      ratingsData = ratingsData.filter(
        (r) => String(r.id) !== String(ratingId)
      );

      renderGrid(ratingsData);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }
});

// -----------------------------
// SORTING
// -----------------------------
document.getElementById("sort").addEventListener("change", (e) => {
  const value = e.target.value;
  let sorted = [...ratingsData];

  if (value === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (value === "title") {
    sorted.sort((a, b) =>
      (a.reviewTitle || "").localeCompare(b.reviewTitle || "")
    );
  } else if (value === "recent") {
    sorted.sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() -
        new Date(a.updatedAt || 0).getTime()
    );
  }

  renderGrid(sorted);
});

// -----------------------------
// INIT
// -----------------------------
loadRatings();
