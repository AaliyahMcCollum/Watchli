console.log("watchlist.js loaded!");
const API_BASE = "https://watchli-api.onrender.com";
const API_WATCHLIST = "${API_BASE}/api/watchlist";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

// --- Exported: add movie to watchlist ---
export async function addToWatchList(movie) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to add movies.");
    return false;
  }

  const body = {
    movieId: Number(movie.id),
    title: movie.title,
    poster: POSTER_URL + movie.poster_path,
  };

  try {
    const res = await fetch(`${API_WATCHLIST}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const msg = await res.text();
      alert("Error: " + msg);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    alert("Network error adding to watchlist.");
    return false;
  }
}

// ---------------- WATCHLIST PAGE ONLY ----------------
if (document.getElementById("watchlist-container")) {
  loadWatchlist();
}

async function loadWatchlist() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to view your watchlist.");
    window.location.href = "../html/login.html";
    return;
  }

  const res = await fetch(API_WATCHLIST, {
    headers: { Authorization: "Bearer " + token },
  });

  if (!res.ok) {
    console.error("Failed to load watchlist:", res.status);
    return;
  }

  const data = await res.json();
  displayWatchlist(data);
}

function displayWatchlist(list) {
  const container = document.getElementById("watchlist-container");
  if (!container) return;

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p style="color:#ccc; text-align:center;">Your watchlist is empty.</p>`;
    return;
  }

  list.forEach((item) => {
    container.innerHTML += `
      <div class="movie-card">

        <div class="movie-card-inner" data-id="${item.id}" data-movie="${item.movieId}">
          
          <img src="${item.poster}" alt="${item.title}">

          <div class="movie-overlay">
            <button class="overlay-btn view-btn" data-movie="${item.movieId}">
              View
            </button>

            <button class="overlay-btn remove-btn" data-id="${item.id}">
              Remove
            </button>
          </div>
        </div>

        <p>${item.title}</p>
      </div>
    `;
  });

  // Add button listeners
  document
    .querySelectorAll(".remove-btn")
    .forEach((btn) => btn.addEventListener("click", removeItem));

  document
    .querySelectorAll(".view-btn")
    .forEach((btn) => btn.addEventListener("click", goToMovie));
}

// ----- REMOVE -----
async function removeItem(e) {
  e.stopPropagation();
  const token = localStorage.getItem("token");
  const id = e.target.dataset.id;

  await fetch(`${API_WATCHLIST}/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  loadWatchlist();
}

// ----- VIEW MOVIE -----
function goToMovie(e) {
  e.stopPropagation();
  const movieId = e.target.dataset.movie;
  window.location.href = `./movieInfo.html?id=${movieId}`;
}
