"use strict";
let movieSearch = document.getElementById("movie-search"),
    searchButton = document.getElementById("search-btn"),
    popularMovies = document.getElementById("popular-movies-btn"),
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
    getDetails();
});
popularMovies.addEventListener("click", function (event) {
    event.preventDefault();
    getPopular();
});

function makeCards(i) {
    let movieCard = document.createElement("div"),
        movieTitleTag = document.createElement("h4"),
        movieTitle = document.createTextNode(i.title),
        moviePoster = document.createElement("img"),
        contentContainer = document.createElement("div"),
        yearTag = document.createElement("p"),
        year = document.createTextNode(`Year Released : ${i.release_date}`),
        tmdbUrl = document.createElement("a");

    movieCard.classList.add("card", "border-dark");
    moviePoster.setAttribute("src", `https://image.tmdb.org/t/p/w500/${i.poster_path}`);
    if (i.poster_path == null) {
        moviePoster.setAttribute("src", "assets/images/noimage.png");
    }
    moviePoster.classList.add("card-img-top");
    tmdbUrl.href = `https://www.themoviedb.org/movie/${i.id}`;
    tmdbUrl.setAttribute("target", "_blank");
    movieTitleTag.appendChild(movieTitle);
    movieTitleTag.classList.add("card-title");
    yearTag.appendChild(year);
    yearTag.classList.add("card-text");
    tmdbUrl.appendChild(moviePoster);
    contentContainer.appendChild(movieTitleTag);
    contentContainer.appendChild(yearTag);
    contentContainer.classList.add("card-body");

    movieCard.appendChild(tmdbUrl);
    movieCard.appendChild(contentContainer);
    movieDetails.appendChild(movieCard);

};

function getDetails() {
    if (movieSearch.value === "") {
        movieDetails.innerHTML = "";
        alertMsg.style.display = "block";
        alertMsg.innerHTML = "Please Enter a Movie Title To Search";
    } else {
        movieDetails.innerHTML = "";
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc&query=${movieSearch.value}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.results.length == 0) {
                    alertMsg.innerHTML = "This is not a movie name!";
                    alertMsg.style.display = "block";
                } else {
                    alertMsg.style.display = "none";
                    data.results.map((result) => {
                        makeCards(result);
                    })
                }
            })
    }
};

function getPopular() {
    movieDetails.innerHTML = "";
    fetch("https://api.themoviedb.org/3/movie/popular?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc")
        .then((res) => res.json())
        .then((data) => {
            alertMsg.style.display = "none";
            data.results.map((popular) => {
                makeCards(popular);
            })
        })
};