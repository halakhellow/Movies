"use strict";
let movieSearch = document.getElementById("search-input"),
    searchButton = document.getElementById("search-btn"),
    nowPlayingMovies = document.getElementById("nowplaying-btn"),
    popularMovies = document.getElementById("popular-btn"),
    upcomingMovies = document.getElementById("upcoming-btn"),
    loader = document.getElementById("loader"),
    alertMsg = document.getElementById("alert-msg"),
    movieDetails = document.getElementById("movie-details");

movieSearch.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        getDetails();
    }
});

searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    loader.style.display = "block";
    getDetails();
});

nowPlayingMovies.addEventListener("click", function (event) {
    event.preventDefault();
    loader.style.display = "block";
    getnowPlaying();
});

upcomingMovies.addEventListener("click", function (event) {
    event.preventDefault();
    loader.style.display = "block";
    getUpcoming();
});

popularMovies.addEventListener("click", function (event) {
    event.preventDefault();
    getPopular();
});

window.onload = function () {
    nowPlayingMovies.click();
}

function makeCard(result) {
    let movieCard = document.createElement("div"),
        movieTitleTag = document.createElement("h4"),
        movieTitle = document.createTextNode(result.title),
        moviePoster = document.createElement("img"),
        contentContainer = document.createElement("div"),
        yearTag = document.createElement("p"),
        year = document.createTextNode(`Year Released : ${result.release_date}`),
        tmdbUrl = document.createElement("a");

    movieCard.classList.add("card", "border-dark");
    moviePoster.setAttribute("src", `https://image.tmdb.org/t/p/w500/${result.poster_path}`);
    if (result.poster_path == null) {
        moviePoster.setAttribute("src", "assets/images/noimage.png");
    }
    moviePoster.classList.add("card-img-top");
    tmdbUrl.href = `https://www.themoviedb.org/movie/${result.id}`;
    tmdbUrl.setAttribute("target", "_blank");
    movieTitleTag.appendChild(movieTitle);
    movieTitleTag.classList.add("card-title");
    yearTag.appendChild(year);
    yearTag.classList.add("card-text");

    if (result.release_date == "") {
        yearTag.innerHTML = "Year Released : unKnown "
    }

    tmdbUrl.appendChild(moviePoster);
    contentContainer.appendChild(movieTitleTag);
    contentContainer.appendChild(yearTag);
    contentContainer.classList.add("card-body");

    movieCard.appendChild(tmdbUrl);
    movieCard.appendChild(contentContainer);
    movieDetails.appendChild(movieCard);

    document.getElementById("home-title").style.display = "none";
    loader.style.display = "none";

};

function clearInfos() {
    loader.style.display = "none";
    movieDetails.innerHTML = "";
    alertMsg.style.display = "block";
    document.getElementById("home-title").style.display = "none";

}

async function getDetails() {
    if (movieSearch.value === "") {
        clearInfos();
        alertMsg.innerHTML = "Please Enter a Movie Title To Search";
    } else {
        movieDetails.innerHTML = "";
        let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc&query=${movieSearch.value}`),
            data = await res.json();
        if (data.results.length == 0) {
            clearInfos();
            alertMsg.innerHTML = "No Results, Please Try Again";
        } else {
            alertMsg.style.display = "none";
            data.results.map((result) => {
                makeCard(result);
            })
        }
    }
};

async function getPopular() {
    movieDetails.innerHTML = "";
    alertMsg.style.display = "none";
    let res = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc"),
        data = await res.json();
    data.results.map((result) => {
        makeCard(result);
    })
};
async function getnowPlaying() {
    movieDetails.innerHTML = "";
    alertMsg.style.display = "none";
    let res = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc"),
        data = await res.json();
    data.results.map((result) => {
        makeCard(result);
        document.getElementById("home-title").style.display = "block";
    })
};
async function getUpcoming() {
    movieDetails.innerHTML = "";
    alertMsg.style.display = "none";
    let res = await fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc"),
        data = await res.json();
    data.results.map((result) => {
        makeCard(result);
    })
};