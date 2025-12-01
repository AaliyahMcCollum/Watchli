// js/getMovie.js
import { addToWatchList } from "./watchlist.js";

const API_KEY = "1392ead50e45927a38f55de4658b4dcb";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";

// suggestion box (only exists on homepage)
const suggestionBox = document.getElementById("suggestion-box");
if (!suggestionBox) {
  console.warn("Suggestion box not found on this page (that's fine).");
}

let userWatchlistIds = new Set();

// ---------------------------------------
// Helper: mark ALL buttons for a movie as saved
// ---------------------------------------
function markMovieAsSaved(movieId) {
  document
    .querySelectorAll(`button.add-watchlist[data-id="${movieId}"]`)
    .forEach((btn) => {
      btn.textContent = "✓ In Watchlist";
      btn.disabled = true;
      btn.style.background = "#00bfff";
      btn.style.cursor = "default";
    });
}

async function isMovieInWatchlist(movieId) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch("http://localhost:8080/api/watchlist", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) return false;

    const list = await res.json();
    return list.some((item) => String(item.movieId) === String(movieId));
  } catch (err) {
    console.error("Error checking watchlist:", err);
    return false;
  }
}

// ---------------------------------------
// Load Watchlist FIRST (before movies)
// ---------------------------------------
async function loadUserWatchlist() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:8080/api/watchlist", {
      headers: { Authorization: "Bearer " + token },
    });

    // If backend restarted or token expired
    if (res.status === 403) {
      console.warn("Token invalid or expired. Logging out user...");
      localStorage.removeItem("token");
      userWatchlistIds = new Set();
      return;
    }

    if (!res.ok) return;

    const data = await res.json();
    userWatchlistIds = new Set(data.map((item) => item.movieId));
  } catch (err) {
    console.error("Failed loading watchlist:", err);
  }
}

// ---------------------------------------
// SEARCH SUBMIT (homepage)
// ---------------------------------------
const searchForm = document.getElementById("search-form");
if (searchForm) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("search-input").value.trim();
    if (!query) return;

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();

    displaySearchResults(data.results.slice(0, 7));
    if (suggestionBox) {
      suggestionBox.innerHTML = "";
      suggestionBox.style.display = "none";
    }
  });
}

// ---------------------------------------
// LIVE SEARCH (homepage)
// ---------------------------------------
const searchInput = document.getElementById("search-input");
if (searchInput && suggestionBox) {
  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (!query) {
      suggestionBox.innerHTML = "";
      suggestionBox.style.display = "none";
      return;
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();
    const results = data.results.slice(0, 7);

    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "block";

    results.forEach((movie) => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.textContent = movie.title;

      item.addEventListener("click", () => {
        document.getElementById("search-input").value = movie.title;
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
        displaySearchResults(results);
      });

      suggestionBox.appendChild(item);
    });
  });
}

// ---------------------------------------
// DISPLAY SEARCH RESULTS (homepage)
// ---------------------------------------
function displaySearchResults(movies) {
  const container = document.getElementById("search-results");
  const title = document.getElementById("search-title");
  if (!container || !title) return;

  container.innerHTML = "";
  title.style.display = "block";

  movies.forEach((movie) => {
    const isSaved = userWatchlistIds.has(movie.id);

    container.innerHTML += `
      <div class="movie-card">
        <div class="movie-card-inner">
          <img src="${IMG_PATH + movie.poster_path}">
          <div class="movie-overlay">
            <button class="overlay-btn view-movie" data-id="${movie.id}">
              View
            </button>

            <button class="overlay-btn add-watchlist"
              data-id="${movie.id}"
              data-title="${movie.title}"
              data-poster="${movie.poster_path}"
              ${
                isSaved
                  ? 'disabled style="background:#00bfff;cursor:default;"'
                  : ""
              }>
              ${isSaved ? "✓ In Watchlist" : "Add to Watchlist"}
            </button>
          </div>
          <p>${movie.title}</p>
        </div>
      </div>
    `;
  });
}

// ---------------------------------------
// FETCH MOVIES (homepage)
// ---------------------------------------
async function fetchMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.results.slice(0, 7);
}

// ---------------------------------------
// DISPLAY HOMEPAGE MOVIES
// ---------------------------------------
function displayMovies(list, elementId) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = "";

  list.forEach((movie) => {
    const isSaved = userWatchlistIds.has(movie.id);

    container.innerHTML += `
      <div class="movie-card">
        <div class="movie-card-inner">
          <img src="${IMG_PATH + movie.poster_path}">
          <div class="movie-overlay">
            <button class="overlay-btn view-movie" data-id="${movie.id}">
              View
            </button>

            <button class="overlay-btn add-watchlist"
              data-id="${movie.id}"
              data-title="${movie.title}"
              data-poster="${movie.poster_path}"
              ${
                isSaved
                  ? 'disabled style="background:#00bfff;cursor:default;"'
                  : ""
              }>
              ${isSaved ? "✓ Watchlisted" : "Watchlist"}
            </button>
          </div>
          <p>${movie.title}</p>
        </div>
      </div>
    `;
  });
}

// ---------------------------------------
// LOAD WATCHLIST FIRST → THEN MOVIES (homepage)
// ---------------------------------------
async function loadMovies() {
  const newMovies = await fetchMovies(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
  );
  const trendingMovies = await fetchMovies(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
  );

  displayMovies(newMovies, "new-movies");
  displayMovies(trendingMovies, "trending-movies");
}

async function initHomepage() {
  // Only run on pages that actually have those sections
  const hasHomepageSections =
    document.getElementById("new-movies") ||
    document.getElementById("trending-movies") ||
    document.getElementById("search-results");

  if (!hasHomepageSections) return;

  await loadUserWatchlist();
  await loadMovies();
}

initHomepage();

// ---------------------------------------
// GLOBAL BUTTON CLICK HANDLER (homepage)
// ---------------------------------------
document.addEventListener("click", async (e) => {
  // VIEW from cards
  if (e.target.classList.contains("view-movie")) {
    window.location.href = "./html/movieInfo.html?id=" + e.target.dataset.id;
    return;
  }

  // ADD TO WATCHLIST from cards (homepage)
  if (e.target.classList.contains("add-watchlist")) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "./html/login.html";
      return;
    }

    const movieId = Number(e.target.dataset.id);

    const movie = {
      id: movieId,
      title: e.target.dataset.title,
      poster_path: e.target.dataset.poster,
    };

    const success = await addToWatchList(movie);
    if (!success) return;

    userWatchlistIds.add(movieId);
    markMovieAsSaved(movieId);
  }
});

// ---------------------------------------
// Dynamic Movie Page (movieInfo.html)
// ---------------------------------------
(async function loadMovieInfoPage() {
  // Only run on movieInfo.html
  if (!window.location.pathname.toLowerCase().endsWith("movieinfo.html"))
    return;

  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  if (!movieId) return;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    const movie = await res.json();

    // Fill UI

    const poster = document.getElementById("movie-poster");
    const title = document.getElementById("movie-title");
    const description = document.getElementById("movie-description");

    if (poster) poster.src = IMG_PATH + movie.poster_path;
    if (title) title.textContent = movie.title;
    if (description) description.textContent = movie.overview;

    // --- CHECK if this movie is already in watchlist ---
    const watchBtn = document.querySelector(".addWishList_btn");

    if (watchBtn) {
      const alreadyInList = await isMovieInWatchlist(movieId);

      if (alreadyInList) {
        watchBtn.textContent = "✓ In Watchlist";
        watchBtn.disabled = true;
        watchBtn.style.background = "#00bfff";
        watchBtn.style.cursor = "default";
      }

      // Attach click handler (your previous working code)
      watchBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "../html/login.html";
          return;
        }

        const payload = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        };

        const added = await addToWatchList(payload);

        watchBtn.textContent = "✓ In Watchlist";
        watchBtn.disabled = true;
        watchBtn.style.background = "#00bfff";
        watchBtn.style.cursor = "default";
      });
    }
  } catch (err) {
    console.error("Failed loading movie info: ", err);
  }
})();
