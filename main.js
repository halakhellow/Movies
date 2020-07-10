"use strict";
let searchInput = document.getElementById("search-input"),
    searchButton = document.getElementById("search-btn"),
    nowPlayingMovies = document.getElementById("nowplaying-btn"),
    popularMovies = document.getElementById("popular-btn"),
    upcomingMovies = document.getElementById("upcoming-btn"),
    topRatedMovies = document.getElementById("top-rated"),
    latestMovie = document.getElementById("latest"),
    loader = document.getElementById("loader"),
    alertMsg = document.getElementById("alert-msg"),
    moviesList = document.getElementById("movies");

searchInput.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        loader.style.display = "none";
        getMoviesList();
    }
});

searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    loader.style.display = "block";
    getMoviesList();
});

nowPlayingMovies.addEventListener("click", function (event) {
    event.preventDefault();
    loader.style.display = "block";
    getnowPlaying();
});

upcomingMovies.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("home-title").style.display = "none";
    loader.style.display = "block";
    getUpcoming();
});

popularMovies.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("home-title").style.display = "none";
    getPopular();
});
topRatedMovies.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("home-title").style.display = "none";
    loader.style.display = "block";
    getTopRated();
});
latestMovie.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("home-title").style.display = "none";
    loader.style.display = "block";
    getLatest();
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
        moviePageLink = document.createElement("a");

    movieCard.classList.add("card", "border-dark");
    moviePoster.setAttribute("src", `https://image.tmdb.org/t/p/w500/${result.poster_path}`);
    if (result.poster_path == null) {
        moviePoster.setAttribute("src", "assets/images/noimage.png");
    }
    moviePoster.classList.add("card-img-top");
    movieTitleTag.appendChild(movieTitle);
    movieTitleTag.classList.add("card-title");
    yearTag.appendChild(year);
    yearTag.classList.add("card-text");

    if (result.release_date == "") {
        yearTag.innerHTML = "Year Released : unKnown "
    }

    moviePageLink.appendChild(moviePoster);
    contentContainer.appendChild(movieTitleTag);
    contentContainer.appendChild(yearTag);
    contentContainer.classList.add("card-body");

    movieCard.appendChild(moviePageLink);
    movieCard.appendChild(contentContainer);
    moviesList.appendChild(movieCard);

    moviePageLink.onclick = function (e) {
        e.preventDefault();
        movieDetails(result.id);
    }
    loader.style.display = "none";
};

function clearInfos() {
    loader.style.display = "none";
    moviesList.innerHTML = "";
    alertMsg.style.display = "block";
    document.getElementById("home-title").style.display = "none";
}

async function getMoviesList() {
    if (searchInput.value === "") {
        clearInfos();
        alertMsg.innerHTML = "Please Enter a Movie Title To Search";
    } else {
        moviesList.innerHTML = "";
        let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc&query=${searchInput.value}`),
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
    moviesList.innerHTML = "";
    alertMsg.style.display = "none";
    let res = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc"),
        data = await res.json();
    data.results.map((result) => {
        makeCard(result);
    })
};
async function getnowPlaying() {
    moviesList.innerHTML = "";
    alertMsg.style.display = "none";
    let res = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc"),
        data = await res.json();
    data.results.map((result) => {
        makeCard(result);
        document.getElementById("home-title").style.display = "block";
    })
};
async function getUpcoming() {
    moviesList.innerHTML = "";
    alertMsg.style.display = "none";
    let res = await fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc"),
        data = await res.json();
    data.results.map((result) => {
        makeCard(result);
    })
};
async function getTopRated() {
    moviesList.innerHTML = "";
    alertMsg.style.display = "none";
    let res = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc"),
        data = await res.json();
    data.results.map((result) => {
        makeCard(result);
    })
};
async function getLatest() {
    moviesList.innerHTML = "";
    alertMsg.style.display = "none";
    let res = await fetch("https://api.themoviedb.org/3/movie/latest?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc"),
        data = await res.json();
    makeCard(data);
};

// MOVIE DETAILS PAGE CODE

function movieDetails(id) {
    localStorage.setItem("movieId", id);
    window.location = "details.html";
}

function stars(rating) {

    let star = "",
        count = 0,
        fullStars = Math.floor(rating / 2),
        halfStar = rating % 2;

    for (let i = 0; i < fullStars; i++) {
        star += "<span class='fa fa-star checked'></span>";
        count++;
    }

    if (halfStar) {
        star += "<span class='fa fa-star-half-alt checked'></span>";
        count++;
    }

    let emptyStars = 5 - count;

    for (let i = 0; i < emptyStars; i++) {
        star += "<span class='far fa-star'></span>";
    }

    return star;
}

function getMovie() {
    let movieId = localStorage.getItem("movieId");

    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc`)
        .then((res) => res.json())
        .then((data) => {
            document.getElementById("poster").setAttribute("src", `https://image.tmdb.org/t/p/original/${data.poster_path}`);
            if (data.poster_path == null) {
                document.getElementById("poster").setAttribute("src", "assets/images/noimage.png");
            }
            document.getElementById("title").innerHTML = data.title;
            document.getElementById("date").innerHTML = `<strong>Released : </strong> ${data.release_date}`;
            document.getElementById("runtime").innerHTML = `<strong>Runtime : </strong> ${data.runtime} Minutes`;
            (data.overview == "") ? document.getElementById("overview").innerHTML = " Overview Not Available ": document.getElementById("overview").innerHTML = data.overview;
            document.getElementById("tmdb-url").href = `https://www.themoviedb.org/movie/${movieId}`;

            let starRate = stars(data.vote_average);
            document.getElementById("rate").innerHTML = `<strong>Rating : </strong> ${starRate}`;

            let genre = "";
            for (let i = 0; i < data.genres.length; i++) {
                (i == data.genres.length - 1) ? genre += ` ${data.genres[i].name} `: genre += ` ${data.genres[i].name} , `;
            }
            document.getElementById("genre").innerHTML = `<strong>Genre : </strong> ${genre}  `;


        });



    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc`)
        .then((res) => res.json())
        .then((data) => {
            for (let i = 0; i < data.crew.length; i++) {
                if (data.crew[i].job == "Director") {
                    document.getElementById("director").innerHTML = `<strong>Director : </strong> ${data.crew[i].name}`
                }
                if (data.crew[i].job == "Screenplay") {
                    document.getElementById("writer").classList.add("list-group-item");
                    document.getElementById("writer").innerHTML = `<strong>Writer : </strong> ${data.crew[i].name}`;
                }
            }


            let actorsList = document.getElementById("actors");
            for (let i = 0; i < 7; i++) {
                let actor = document.createElement("li"),
                    actorPage = document.createElement("a"),
                    actorImg = document.createElement("img"),
                    actorName = document.createElement("h6"),
                    actorCharacter = document.createElement("p");

                actor.classList.add("list-inline-item");
                if (data.cast[i].profile_path == null) {
                    actorImg.setAttribute("src", "assets/images/noactorimg.jpg");
                } else {
                    actorImg.setAttribute("src", `https://image.tmdb.org/t/p/original/${data.cast[i].profile_path}`);
                }
                actorImg.classList.add("img-fluid");
                actorPage.appendChild(actorImg);
                actorPage.href = `https://www.themoviedb.org/person/${data.cast[i].id}`;
                actorPage.setAttribute("target", "_blank");
                actorName.innerHTML = data.cast[i].name;
                actorCharacter.innerHTML = `as ${data.cast[i].character}`;

                actor.appendChild(actorPage);
                actor.appendChild(actorName);
                actor.appendChild(actorCharacter);
                actorsList.appendChild(actor);

            }

        })

};