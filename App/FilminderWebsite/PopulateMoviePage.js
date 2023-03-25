


// fetch("Movie.json")
// .then(function(response){
//     return response.json();
// })
// .then(function(movie)
function populateMoviePage(){
    var movie = sessionStorage.getItem("movie");
    movie = JSON.parse(movie);
    // var movieID = sessionStorage.getItem("movie");
    // console.log(movieID);
    // let movie = Movies[0];
    
    console.log(movie);
    console.log("hello");
    let Grid = document.getElementsByClassName("moviePageGridContainer");
    let Title = document.getElementsByClassName("Title")[0];
    var htmlString = `<h1>${movie.title}</h1>`;
    Title.innerHTML = htmlString;

    let ImageAndInformation = document.getElementsByClassName("ImageAndInformation")[0];
    var htmlString = `<img src = "${movie.image}" height = "600" width = "475">`;
    htmlString += `<h2>Average Rating: ${movie.rating}/10</h2>`;
    htmlString += `<h2>Genre(s): ${movie.genre}</h2>`;
    htmlString += `<h2>Release Date: ${movie.releaseDate}</h2>`;
    htmlString += `<h2>Runtime: ${movie.runtime}</h2>`;
    htmlString += `<h2>Language(s): ${movie.language}</h2>`;
    ImageAndInformation.innerHTML = htmlString;

    let Description = document.getElementsByClassName("Description")[0];

    var htmlString = `<h2>Description: </h2>`;
    htmlString += `<p>${movie.description}</p>`;
    Description.innerHTML = htmlString;

    let Actors = document.getElementsByClassName("Cast")[0];
    var htmlString = `<h2>Actors: </h2>`;
    htmlString += `<p>${movie.actors}</p>`;
    htmlString += `<h2>Directors: </h2>`;
    htmlString += `<p>${movie.directors}</p>`;
    htmlString += `<h2>Writers: </h2>`;
    htmlString += `<p>${movie.writers}</p>`;
    Actors.innerHTML = htmlString;

    let Reviews = document.getElementsByClassName("Reviews")[0];
    var htmlString = `<h2>Reviews: </h2>`;
    htmlString += `<div class = "review"> <h3>${"User1234"}: ${"6.9"}/10</h3>`;
    htmlString += `<p>${"Amazing movie"}</p></div>`;
    Reviews.innerHTML = htmlString;


}

populateMoviePage();

