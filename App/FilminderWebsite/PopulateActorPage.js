function redirect(nextPageHTML, key, title){
    console.log("movie/series was pressed");
    //do individual movie/series fetch here
    if(key == "movie"){
        let movieInfo = {
            'movie-name': title,
        };

        fetch('/movie-search', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(movieInfo)
        })
        .then(response => response.text())
        
        .then(text => {
            
            let jsonData = JSON.parse(text);
            sessionStorage.setItem(key, JSON.stringify(jsonData));
            
            document.location.href = nextPageHTML;
        })
        .catch(error => console.log(error));
    
    }


    else if(key == "series"){
        let seriesInfo = {
            'series-name': title,
        };
        // Fetches series info from main server
        
        fetch('/series-search', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(seriesInfo)
        })
        .then(response => response.text())
        
        .then(text => {
            console.log("returned from search");
            
            let jsonData = JSON.parse(text);
            sessionStorage.setItem(key, JSON.stringify(jsonData));
            
            document.location.href = nextPageHTML;
            
        })
        .catch(error => console.log(error))
    }


}


function populateActorPage(){
    

    var actor = sessionStorage.getItem("actor");
    actor = JSON.parse(actor);
    
    console.log(actor);
    
    
    let name = document.getElementsByClassName("Name")[0];
    var htmlString = `<h1>${actor.Name}</h1>`;
    name.innerHTML = htmlString;

    let ImageAndInformation = document.getElementsByClassName("ImageAndInformation")[0];
    var htmlString = `<img src = "${actor.image}" height = "600" width = "475">`;
    htmlString += `<h2>Age: ${actor.Age}</h2>`;
    htmlString += `<h2>Date of Birth: ${actor.DOB}</h2>`;
    ImageAndInformation.innerHTML = htmlString;

    let Description = document.getElementsByClassName("Description")[0];
    var htmlString = `<h2>Biography: </h2>`;
    htmlString += `<p>${actor.biography}</p>`;
    Description.innerHTML = htmlString;

    // populating movie list
    let movieList = actor.Movies;
    let movieTable = document.getElementById("movieTable");
    let moviePageHTML = "MoviePage.html";
    let movieKey = "movie";
    var rowString = `<h2>Popular Movies: </h2>`;
    var counter = 0;
    for(let movie of movieList){
        counter++;
        
        if(counter == 1){
            rowString += '<tr>'
        }


        rowString += '<td>';
        rowString += `<a href = "javascript:redirect('${moviePageHTML}', '${movieKey}', '${movie.title}')"> <img src =  ${movie.image} > </a>`;
        rowString += `<div><a href = "javascript:redirect('${moviePageHTML}', '${movieKey}', '${movie.title}')">  ${movie.title}  </a></div>`;
        rowString += `<div><a href = "javascript:redirect('${moviePageHTML}', '${movieKey}', '${movie.title}')">  Role: ${movie.character}  </a></div>`;
        rowString += '</td>';

        if(counter == 5){
            rowString += '</tr>';
            counter = 0;
        }
        
    }
        
    movieTable.innerHTML = rowString;


    // populating series list
    let seriesList = actor.Series;
    let seriesTable = document.getElementById("seriesTable");
    let seriesPageHTML = "SeriesPage.html";
    let seriesKey = "series";
    var seriesRowString = `<h2>Popular Series: </h2>`;
    var seriesCounter = 0;
    for(let series of seriesList){
        seriesCounter++;
        
        if(seriesCounter == 1){
            seriesRowString += '<tr>'
        }


        seriesRowString += '<td>';
        seriesRowString += `<a href = "javascript:redirect('${seriesPageHTML}', '${seriesKey}', '${series.title}')"> <img src =  ${series.image} > </a>`;
        seriesRowString += `<div><a href = "javascript:redirect('${seriesPageHTML}', '${seriesKey}', '${series.title}')">  ${series.title}  </a></div>`;
        seriesRowString += `<div><a href = "javascript:redirect('${seriesPageHTML}', '${seriesKey}', '${series.title}')">  Role: ${series.character}  </a></div>`;
        seriesRowString += '</td>';

        if(seriesCounter == 5){
            seriesRowString += '</tr>';
            seriesCounter = 0;
        }
        
    }
        
    seriesTable.innerHTML = seriesRowString;




    

}

populateActorPage();



