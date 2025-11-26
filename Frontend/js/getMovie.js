// js/getMovie.js
import { addToWatchList } from "./watchlist.js";

const API_KEY = "1392ead50e45927a38f55de4658b4dcb";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const suggestionBox = document.getElementById("suggestion-box");

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
      localStorage.removeItem("token"); // clear broken token
      userWatchlistIds = new Set(); // empty list so UI behaves correctly
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
// SEARCH SUBMIT
// ---------------------------------------
document.getElementById("search-form").addEventListener("submit", async (e) => {
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
  suggestionBox.innerHTML = "";
  suggestionBox.style.display = "none";
});

// ---------------------------------------
// LIVE SEARCH
// ---------------------------------------
document.getElementById("search-input").addEventListener("input", async (e) => {
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

// ---------------------------------------
// DISPLAY SEARCH RESULTS
// ---------------------------------------
function displaySearchResults(movies) {
  const container = document.getElementById("search-results");
  const title = document.getElementById("search-title");

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
// FETCH MOVIES
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
// LOAD WATCHLIST FIRST → THEN MOVIES
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
  await loadUserWatchlist();
  await loadMovies();
}

initHomepage();

// ---------------------------------------
// BUTTON CLICK HANDLER
// ---------------------------------------
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view-movie")) {
      window.location.href = "./html/movieInfo.html?id=" + e.target.dataset.id;
  }

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

    // Update our local set
    userWatchlistIds.add(movieId);

    // Update ALL buttons for this movie
    markMovieAsSaved(movieId);
  }
});

// Dynamic Movie Page (movieInfo.html)

(async function loadMovieInfoPage() {
  if(!window.location.pathname.includes("movieInfo.html")) return;

  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  if (!movieId) return;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`

    );
    const movie = await res.json();

    //UI Fill In 
    const poster = document.getElementById("movie-poster");
    const title = document.getElementById("movie-title");
    const description = document.getElementById("movie-description");
    
    //validation
    if (poster) poster.src = IMG_PATH + movie.poster_path;
    if (title) title.textContent = movie.title;
    if (description) description.textContent = movie.overview;

  }
  catch (err) {
    console.error("Failed loading movie info: ", err);
  }
}) ();