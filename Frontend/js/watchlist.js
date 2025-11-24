import { supabase } from "./supabaseClient.js";

// Add movie to master watch list
export async function addToWatchList(movie) {
    const {data, error} = await supabase
        .from('watchlist')
        .insert({
            movie_id: movie.id,
            title: movie.title,
            poster: movie.poster_path
        });

    if (error) {
        console.error(error);
        alert("Error adding to Watchlist");

    } else {
        alert("Added to Watchlist!");
    }
}

// Get masterwatchlist
export async function getWatchlist() {
    const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('added_at', { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

// Load watchlist onto page
export async function loadWatchlist() {
    const container = document.getElementById("watchlist-container");
    if (!container) return;

    const movies = await getWatchlist();
    container.innerHTML = "" ;

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}">
        <p>${movie.title}</p>
        <button class="remove-btn" data-id="${movie.id}">Remove</button>
        `;
        container.appendChild(card)
    });
}

// Delete from Watchlist
export async function removeFromWatchlist(id) {
    const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("id", id);

    if (error) {
        console.error(error);
        alert("Error removing movie");
    } else {
        loadWatchlist();
    }
}

//Button Listener
document.addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
        const id = e.target.dataset.id;
        removeFromWatchlist(id);
    }
});

//Auto load page
window.addEventListener("DCOMContentLoaded", loadWatchlist);