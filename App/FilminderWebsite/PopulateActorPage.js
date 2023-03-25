


// fetch("Movie.json")
// .then(function(response){
//     return response.json();
// })
// .then(function(actor){
function populateActorPage(){
    // var actorID = sessionStorage.getItem("actor");
    // console.log(actorID);
    //let movie = Movies[0];

    var actor = sessionStorage.getItem("actor");
    actor = JSON.parse(actor);
    
    console.log(actor);
    
    let Grid = document.getElementsByClassName("actorPageGridContainer");
    let name = document.getElementsByClassName("Name")[0];
    var htmlString = `<h1>${actor.Name}</h1>`;
    name.innerHTML = htmlString;

    let ImageAndInformation = document.getElementsByClassName("ImageAndInformation")[0];
    var htmlString = `<img src = "${actor.image}" height = "600" width = "475">`;
    htmlString += `<h2>Average Rating: ${actor.rating}/10</h2>`;
    htmlString += `<h2>Age: ${actor.Age}</h2>`;
    htmlString += `<h2>Birth Date: ${actor.DOB}</h2>`;
    ImageAndInformation.innerHTML = htmlString;



    let movies = document.getElementsByClassName("Movies")[0];
    var htmlString = `<h2>Movies: </h2>`;
    htmlString += `<p>${actor.Movies}</p>`;
    movies.innerHTML = htmlString;

    let series = document.getElementsByClassName("Series")[0];
    var htmlString = `<h2>Series: </h2>`;
    htmlString += `<p>${actor.Series}</p>`;
    series.innerHTML = htmlString;

    let Reviews = document.getElementsByClassName("Reviews")[0];
    var htmlString = `<h2>Reviews: </h2>`;
    htmlString += `<div class = "review"> <h3>${"User1234"}: ${"6.9"}/10</h3>`;
    htmlString += `<p>${"Amazing movie"}</p></div>`;
    Reviews.innerHTML = htmlString;


}

populateActorPage();



