const apiKey = "7df83b8d61c64aaaf63222778899156a";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const searchApi = "AIzaSyDNADo0F71DVlsvwGRxtLFwHTLUto0ptas";

const apiPath = {
    fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}&language=en`,
    fetchMovieList: (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}&language=en`,
    fetchTrending: `${apiEndPoint}/trending/movie/day?api_key=${apiKey}&language=en`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${searchApi}`
};

function init(){
    // alert("Hello World");
    TrendingMovies();
    fetchAndBuildAllSection();
};

function TrendingMovies(){
    fetchAndBuildMovieSection(apiPath.fetchTrending, "Trending Now")
    .then(list => {
        const randomMovie = Math.floor(Math.random()*list.length);
        buildBannerSection(list[randomMovie]);
    }).catch(err => {
        console.error(err);
    });
}

function buildBannerSection(movie){
    const bannerContainer = document.getElementById('banner-section');
    bannerContainer.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
    const div = document.createElement('div');
    div.className = "banner-content container";
    div.innerHTML = `<h2 class="banner-title">${movie.title}</h2>
    <p class="banner-info">Trending in Movies | Rating : ${movie.vote_average}</p>
    <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+'...' : movie.overview}</p>
        <div class="action-button-content">
            <button class="action-button"><i class="fa-solid fa-play" style="color: #000000;"></i>&nbsp;&nbsp;Play</button>
            <button class="action-button"><i class="fa-solid fa-circle-info" style="color: #ffffff;"></i>&nbsp;&nbsp;More Info</button>
        </div>
        <div class="banner-fadeBottom"></div>`;
    bannerContainer.append(div);
}

function fetchAndBuildAllSection(){
    fetch(apiPath.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchAndBuildMovieSection(apiPath.fetchMovieList(category.id),category.name);
            })
        }
        // console.table(categories);
    })
    .catch(err => console.log(err));
};

async function fetchAndBuildMovieSection(fetchUrl,categoryName){
    // console.log(fetchUrl,category);
    try {
        const res = await fetch(fetchUrl);
        const res_1 = await res.json();
        // console.table(res.results);
        const movies = res_1.results;
        if (Array.isArray(movies) && movies.length) {
            buildMovieSection(movies, categoryName);
        }
        return movies;
    } catch (err) {
        return console.log(err);
    }
};

function buildMovieSection(list, categoryName){
    // console.log(list,categoryName);

    const moviesContainer = document.getElementById("movies-container");
    const moviesListHTML = list.map(item => {
        return `
        <div class="movie-item" onclick="searchTrailer('${item.original_title}')">
            <img src="${imgPath}${item.backdrop_path}" alt="${item.original_title}" class="movie-item-img">
            <h3 class="movie-title">${item.original_title}</h3>
            <p class="movie-rating">Ratings : ${item.vote_average}</p>
        </div>`;
    }).join('');

    // console.log(moviesListHTML);
    const moviesSectionHTML = `
        <h2 class="movies-section-heading">${categoryName}</h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `;
    // console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;
    moviesContainer.append(div);

    // console.log(moviesContainer);
}

function searchTrailer(movieName){
    if(!movieName) return;
    fetch(apiPath.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        // console.log(res.items[0]);
        // console.log(apiPath.searchOnYoutube(movieName));
        const youtubeUrl = `https://www.youtube.com/watch?v=${res.items[0].id.videoId}`;
        window.open(youtubeUrl, '_blank');
        // console.log(youtubeUrl);
    })
    .catch(err => console.log(err));
}

window.addEventListener('load', function (){
    init();
    this.window.addEventListener('scroll',function(){
        if(this.window.scrollY > 5) header.classList.add('black-bg');
        else header.classList.remove('black-bg');
    })
});