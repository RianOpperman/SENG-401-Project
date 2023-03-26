


// fetch("Movie.json")
// .then(function(response){
//     return response.json();
// })
// .then(function(movie)
function populateMoviePage(){
    var movie = sessionStorage.getItem("movie");
    movie = JSON.parse(movie);
    
    console.log(movie);
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

    let movieID = {'movie-id': movie.id.split('movie:')[1]};

    var htmlString = `<h2>Reviews: </h2>`;

    fetch('/comment-query', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(movieID),
    })
    .then(response => response.text())
    .then(text => {
        let json = JSON.parse(text);
        for(let comment of json){
            htmlString += `<div class = "review"> <h3>${comment.username}: ${comment.rating}/10</h3>`;
            htmlString += `<p>${comment.comment}</p></div>`;
        }
        Reviews.innerHTML = htmlString;
    })
    .catch(e => console.log(e));
}

populateMoviePage();

