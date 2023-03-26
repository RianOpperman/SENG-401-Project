


// fetch("series.json")
// .then(function(response){
//     return response.json();
// })
// .then(function(series)
function populateSeriesPage(){
    var series = sessionStorage.getItem("series");
    series = JSON.parse(series);
    // var seriesID = sessionStorage.getItem("series");
    // console.log(seriesID);
    // let series = series[0];
    
    console.log(series);
    console.log("hello");
    let Grid = document.getElementsByClassName("seriesPageGridContainer");
    let Title = document.getElementsByClassName("Title")[0];
    var htmlString = `<h1>${series.title}</h1>`;
    Title.innerHTML = htmlString;

    let ImageAndInformation = document.getElementsByClassName("ImageAndInformation")[0];
    var htmlString = `<img src = "${series.image}" height = "600" width = "475">`;
    htmlString += `<h2>Average Rating: ${series.rating}/10</h2>`;
    htmlString += `<h2>Genre(s): ${series.genre}</h2>`;
    htmlString += `<h2>Release Date: ${series.releaseDate}</h2>`;
    htmlString += `<h2>Seasons: ${series.season}</h2>`;
    htmlString += `<h2>Episodes: ${series.episode}</h2>`;
    htmlString += `<h2>Runtime: ${series.runtime}</h2>`;
    htmlString += `<h2>Language(s): ${series.language}</h2>`;
    ImageAndInformation.innerHTML = htmlString;

    let Description = document.getElementsByClassName("Description")[0];

    var htmlString = `<h2>Description: </h2>`;
    htmlString += `<p>${series.description}</p>`;
    Description.innerHTML = htmlString;

    let Actors = document.getElementsByClassName("Cast")[0];
    var htmlString = `<h2>Actors: </h2>`;
    htmlString += `<p>${series.actors}</p>`;
    htmlString += `<h2>Directors: </h2>`;
    htmlString += `<p>${series.directors}</p>`;
    htmlString += `<h2>Writers: </h2>`;
    htmlString += `<p>${series.writers}</p>`;
    Actors.innerHTML = htmlString;

    let Reviews = document.getElementsByClassName("Reviews")[0];
    var htmlString = `<h2>Reviews: </h2>`;
    htmlString += `<div class = "review"> <h3>${"User1234"}: ${"6.9"}/10</h3>`;
    htmlString += `<p>${"Amazing series"}</p></div>`;
    Reviews.innerHTML = htmlString;


}

populateseriesPage();

