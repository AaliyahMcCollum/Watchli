// js/watchlist.js
console.log("watchlist.js loaded!");

const API_WATCHLIST = "http://localhost:8080/api/watchlist";

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
    poster: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
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

  list.forEach((item) => {
    container.innerHTML += `
      <div class="movie-card">
        <img src="${item.poster}">
        <p>${item.title}</p>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", removeItem);
  });
}

async function removeItem(e) {
  const token = localStorage.getItem("token");
  const id = e.target.dataset.id;

  await fetch(`${API_WATCHLIST}/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  loadWatchlist();
}
