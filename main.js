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

function handleSearch() {
  event.preventDefault();
  loader.style.display = "block";
  alertMsg.style.display = "none";
  getSearchResults();
}
searchInput.addEventListener("keydown", function (event) {
  (event.keyCode === 13) && handleSearch(event)
})
searchButton.addEventListener("click", handleSearch.bind(event));

function handleClick(type) {
  event.preventDefault();
  loader.style.display = "block";
  getMovies(type);
}
nowPlayingMovies.addEventListener("click", handleClick.bind(event, "Now_Playing"));
upcomingMovies.addEventListener("click", handleClick.bind(event, "Upcoming"));
popularMovies.addEventListener("click", handleClick.bind(event, "Popular"));
topRatedMovies.addEventListener("click", handleClick.bind(event, "Top_Rated"));
latestMovie.addEventListener("click", handleClick.bind(event, "Latest"));

window.onload = function () {
  nowPlayingMovies.click();
};

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

  if (result.poster_path === null) moviePoster.setAttribute("src", "assets/images/noimage.png");
  if (result.release_date === "") yearTag.innerHTML = "Year Released : unKnown ";

  moviePoster.classList.add("card-img-top");
  movieTitleTag.appendChild(movieTitle);
  movieTitleTag.classList.add("card-title");
  yearTag.appendChild(year);
  yearTag.classList.add("card-text");

  moviePageLink.appendChild(moviePoster);
  contentContainer.appendChild(movieTitleTag);
  contentContainer.appendChild(yearTag);
  contentContainer.classList.add("card-body");

  moviePageLink.appendChild(contentContainer);
  movieCard.appendChild(moviePageLink);
  moviesList.appendChild(movieCard);

  moviePageLink.onclick = function (e) {
    e.preventDefault();
    movieDetails(result.id);
  };
  loader.style.display = "none";
}

function clearInfos() {
  moviesList.innerHTML = "";
  alertMsg.style.display = "none";
  document.getElementById("movies-section-label").innerHTML = "";
  document.getElementById("movie").innerHTML = "";
}

function movieSectionName(name) {
  let headingTag = document.createElement("h1"),
    headingText = document.createTextNode(`${name}`);
  headingTag.appendChild(headingText);
  document.getElementById("movies-section-label").appendChild(headingTag);
}

function dismiss() {
  document.getElementById("dismiss").parentNode.style.display = "none";
}

async function getSearchResults() {
  if (searchInput.value === "") {
    loader.style.display = "none";
    alertMsg.style.display = "block";
  } else {
    let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc&query=${searchInput.value}`),
      data = await res.json();
    if (data.results.length == 0) {
      loader.style.display = "none";
      alertMsg.style.display = "block";
    } else {
      clearInfos();
      data.results.map((result) => {
        makeCard(result);
      });
      movieSectionName(`Results for " ${searchInput.value} "`);
    }
  }
}

async function getMovies(type) {
  clearInfos();
  let res = await fetch(`https://api.themoviedb.org/3/movie/${type.toLowerCase()}?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc`),
    data = await res.json();
  (type === "Latest")
    ? makeCard(data)
    : data.results.map((result) => {
      makeCard(result);
    });
  movieSectionName(`${type.replace(/_/g, ' ')} ${type === "Latest" ? "Movie" : "Movies"}`);
}

// MOVIE DETAILS PAGE CODE

function movieDetails(id) {
  localStorage.setItem("movieId", id);
  window.location = "details.html";
}

function stars(rating) {
  let star = "",
    countOfFilledStars = 0,
    fullStars = Math.floor(rating / 2),
    halfStar = rating % 2;

  for (let i = 0; i < fullStars; i++) {
    star += "<span class='fa fa-star checked'></span>";
    countOfFilledStars++;
  }

  if (halfStar) {
    star += "<span class='fa fa-star-half-alt checked'></span>";
    countOfFilledStars++;
  }

  let emptyStars = 5 - countOfFilledStars;

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
      if (data.poster_path === null) document.getElementById("poster").setAttribute("src", "assets/images/noimage.png");

      document.getElementById("title").innerHTML = data.title;

      document.getElementById("date").innerHTML = `<strong>Released : </strong> ${data.release_date}`;
      if (data.release_date === "") document.getElementById("date").innerHTML = "<strong>Released : </strong> Unknown";

      document.getElementById("runtime").innerHTML = `<strong>Runtime : </strong> ${data.runtime} Minutes`;
      if (data.runtime === null) document.getElementById("runtime").innerHTML = "<strong>Runtime : </strong> Unknown";

      data.overview === "" ?
        (document.getElementById("overview").innerHTML = " Overview Not Available ") :
        (document.getElementById("overview").innerHTML = data.overview);

      document.getElementById("tmdb-url").href = `https://www.themoviedb.org/movie/${movieId}`;

      let starRate = stars(data.vote_average);
      document.getElementById("rate").innerHTML = `<strong>Rating : </strong> ${starRate}`;

      let genres = "";
      data.genres.map((genre, index) => {
        index === data.genres.length - 1 ? (genres += ` ${genre.name} `) : (genres += ` ${genre.name} , `);
      });
      document.getElementById("genre").innerHTML = `<strong>Genre : </strong> ${genres}  `;
      if (data.genres.length === 0) document.getElementById("genre").innerHTML = "<strong>Genre : </strong> Unknown";
    });

  fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=9fce1e77cbf1f8f4eb80c8366d686cfc`)
    .then((res) => res.json())
    .then((data) => {
      data.crew.map((person) => {
        if (person.job === "Director") {
          document.getElementById("director").classList.add("list-group-item");
          document.getElementById("director").innerHTML = `<strong>Director : </strong> ${person.name}`;
        }
        if (person.job === "Screenplay" || person.job === "Writer") {
          document.getElementById("writer").classList.add("list-group-item");
          document.getElementById("writer").innerHTML = `<strong>Writer : </strong> ${person.name}`;
        }
      })

      let actorsList = document.getElementById("actors");
      if (data.cast.length === 0) {
        actorsList.innerHTML += "No Information";
        actorsList.style.marginLeft = "0";
        document.getElementById("prev-btn").style.display = "none";
        document.getElementById("next-btn").style.display = "none";
      } else {
        data.cast.map((cast, index) => {
          let actorContainer = document.createElement("div"),
            actor = document.createElement("div"),
            actorPage = document.createElement("a"),
            actorImg = document.createElement("img"),
            actorName = document.createElement("h6"),
            actorCharacter = document.createElement("p");

          if (index === 0) actorContainer.classList.add("active");

          actorContainer.classList.add("carousel-item");

          if (cast.profile_path === null) actorImg.setAttribute("src", "assets/images/noactorimg.jpg");
          else actorImg.setAttribute("src", `https://image.tmdb.org/t/p/original/${cast.profile_path}`);

          actorImg.classList.add("img-fluid");
          actorPage.appendChild(actorImg);
          actorPage.href = `https://www.themoviedb.org/person/${cast.id}`;
          actorPage.setAttribute("target", "_blank");
          actorName.innerHTML = cast.name;
          actorCharacter.innerHTML = `as ${cast.character}`;
          if (cast.character == "") actorCharacter.innerHTML = `UnKnown Character`;

          actor.appendChild(actorPage);
          actor.appendChild(actorName);
          actor.appendChild(actorCharacter);
          actorContainer.appendChild(actor);
          actorsList.appendChild(actorContainer);

          actorName.onclick = function () {
            actorPage.click();
          }
        })
      }
    });
}