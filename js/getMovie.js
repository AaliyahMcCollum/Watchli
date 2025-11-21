const API_KEY = "1392ead50e45927a38f55de4658b4dcb";
const fullImage = "https://image.tmdb.org/t/p/w500";

const IMG_PATH = "https://image.tmdb.org/t/p/w500";

async function fetchMovies(url) {
const res = await fetch(url);
const data = await res.json();
return data.results.slice(0, 7);
}

function displayMovies(list, elementId) {
const container = document.getElementById(elementId);
container.innerHTML = "";
list.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
    <div class="movie-card-inner">
        <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
        <div class="movie-overlay">
            <button class="overlay-btn view-movie" data-id="${movie.id}">
                View
            </button>
            <button class="overlay-btn add-watchlist" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}">
                Watchlist   
            </button>
        </div>
        <p>${movie.title}</p>
    </div>
    `;
    container.appendChild(div);
});
}

async function loadMovies() {
const newMoviesURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`;
const trendingMoviesURL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;

const newMovies = await fetchMovies(newMoviesURL);
const trendingMovies = await fetchMovies(trendingMoviesURL);

displayMovies(newMovies, "new-movies");
displayMovies(trendingMovies, "trending-movies");
}

loadMovies();

// JS For movie card buttons overlay (Add to Watchlist & Nav to Movie page)
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-movie")) {
        const id = e.target.dataset.id;
        window.location.href = `movie.html?id=${id}`;
    }
    if (e.target.classList.contains("add-watchlist")){
        const movie = {
            id: e.target.dataset.id,
            title: e.target.dataset.title,
            poster_path: e.target.dataset.poster
        };

        addToWatchList(movie)
    }
})

