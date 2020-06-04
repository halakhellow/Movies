"use strict";
let movieTitle = document.getElementById("movie-title"),
    searchButton = document.getElementById("btn"),
    movieDetails = document.getElementById("movie-details");

movieTitle.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        getDetails();
    }
});

searchButton.onclick = function () {
    getDetails();
};

function getDetails() {
    if (movieTitle.value === "") {
        movieDetails.innerHTML = "";
        movieDetails.innerHTML = "Please Enter a Movie Title To Search";
    } else {
        movieDetails.innerHTML = "";
        fetch(`https://www.omdbapi.com/?s=${movieTitle.value}&apikey=7e9170bb`)
            .then((res) => res.json())
            .then((data) => {
                if (data.Response == "False") {
                    movieDetails.innerHTML = "This is not a Movie name";
                } else {
                    let title = data.Search[0].Title,
                        year = data.Search[0].Year,
                        imdbUrl = `https://www.imdb.com/title/${data.Search[0].imdbID}/`,
                        posterUrl = data.Search[0].Poster;
                    movieDetails.innerHTML = "<h1>" + title + "</h1> <br> <img src='" + posterUrl + "'> <br> <p> Year Released : " +
                        year + "</p> <br> <p> IMDB Page : <a href='" + imdbUrl + "' target='_blank'> Click Here</a> For More Details </p>";
                }
            })
    }
}