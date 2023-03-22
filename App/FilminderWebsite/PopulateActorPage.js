


fetch("Movie.json")
.then(function(response){
    return response.json();
})
.then(function(actor){
    var actorID = sessionStorage.getItem("actor");
    console.log(actorID);
    //let movie = Movies[0];
    
    console.log(actor);
    
    let Grid = document.getElementsByClassName("actorPageGridContainer");
    let Title = document.getElementsByClassName("Title")[0];
    var htmlString = `<h1>${actor.title}</h1>`;
    Title.innerHTML = htmlString;

    let ImageAndInformation = document.getElementsByClassName("ImageAndInformation")[0];
    var htmlString = `<img src = "${actor.image}" height = "600" width = "475">`;
    htmlString += `<h2>Average Rating: ${actor.rating}/10</h2>`;
    htmlString += `<h2>Age: ${actor.runtime}</h2>`;
    htmlString += `<h2>Birth Date: ${actor.releaseDate}</h2>`;
    ImageAndInformation.innerHTML = htmlString;

    let Description = document.getElementsByClassName("Description")[0];

    var htmlString = `<h2>Description: </h2>`;
    htmlString += `<p>${actor.description}</p>`;
    Description.innerHTML = htmlString;

    let Actors = document.getElementsByClassName("Movies")[0];
    var htmlString = `<h2>Movies: </h2>`;
    htmlString += `<p>${actor.actors}</p>`;
    
    Actors.innerHTML = htmlString;

    let Reviews = document.getElementsByClassName("Reviews")[0];
    var htmlString = `<h2>Reviews: </h2>`;
    htmlString += `<div class = "review"> <h3>${"User1234"}: ${"6.9"}/10</h3>`;
    htmlString += `<p>${"Amazing movie"}</p></div>`;
    Reviews.innerHTML = htmlString;


})



