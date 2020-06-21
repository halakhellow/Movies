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
                            moviePoster = document.createElement("img"),
                            contentContainer = document.createElement("div"),
                            yearTag = document.createElement("p"),
                            year = document.createTextNode(`Year Released : ${i.release_date}`),
                            tmdbUrl = document.createElement("a");

                        movieCard.classList.add("card", "border-info");
                        moviePoster.setAttribute("src", `https://image.tmdb.org/t/p/w500/${i.poster_path}`);
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
                    })



                }
            })
    }
}