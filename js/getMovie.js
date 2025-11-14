const API_KEY = "1392ead50e45927a38f55de4658b4dcb";
const fullImage = "https://image.tmdb.org/t/p/w500";

const IMG_PATH = "https://image.tmdb.org/t/p/w500";

async function fetchMovies(url) {
const res = await fetch(url);
const data = await res.json();
return data.results.slice(0, 5);
}

function displayMovies(list, elementId) {
const container = document.getElementById(elementId);
container.innerHTML = "";
list.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
    <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
    <p>${movie.title}</p>
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



