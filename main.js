"use strict";
let movieSearch = document.getElementById("movie-search"),
    searchButton = document.getElementById("search-btn"),
    latestMovies = document.getElementById("latest-movies-btn"),
    movieDetails = document.getElementById("movie-details");

movieSearch.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        getDetails();
    }
});

searchButton.onclick = function () {
    getDetails();
};

function getDetails() {
    if (movieSearch.value === "") {
        movieDetails.innerHTML = "";
        movieDetails.innerHTML = "Please Enter a Movie Title To Search";
    } else {
        movieDetails.innerHTML = "";
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc&query=${movieSearch.value}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.results.length == 0) {
                    movieDetails.innerHTML = "This is not a Movie name";
                } else {
                    data.results.map((i) => {
                        let movieCard = document.createElement("div"),
                            movieTitleTag = document.createElement("h4"),
                            movieTitle = document.createTextNode(i.title),
                            posterContainer = document.createElement("div"),
                            moviePoster = document.createElement("img"),
                            contentContainer = document.createElement("div"),
                            yearTag = document.createElement("p"),
                            year = document.createTextNode(`Year Released : ${i.release_date}`),
                            tmdbUrl = document.createElement("a");

                        movieCard.classList.add("card");
                        moviePoster.setAttribute("src", `https://image.tmdb.org/t/p/w500/${i.poster_path}`);
                        tmdbUrl.href = `https://www.themoviedb.org/movie/${i.id}`;
                        tmdbUrl.setAttribute("target", "_blank");
                        movieTitleTag.appendChild(movieTitle);
                        yearTag.appendChild(year);
                        tmdbUrl.appendChild(moviePoster);
                        posterContainer.appendChild(tmdbUrl);
                        posterContainer.classList.add("poster-container");
                        contentContainer.appendChild(movieTitleTag);
                        contentContainer.appendChild(yearTag);
                        contentContainer.classList.add("content-container");

                        movieCard.appendChild(posterContainer);
                        movieCard.appendChild(contentContainer);
                        movieDetails.appendChild(movieCard);
                    })



                }
            })
    }
}