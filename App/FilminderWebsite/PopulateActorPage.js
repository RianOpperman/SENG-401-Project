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
    var htmlString = `
    <style>
    .u-section-1 .u-image-1 {
        background-image: url("${actor.image}");
        background-position: 50% 50%;
        min-height: 655px;
      }
    </style>
    <section class="u-clearfix u-section-1" id="sec-4c7e">
    <div class="u-clearfix u-sheet u-sheet-1">
      <div class="u-clearfix u-expanded-width u-gutter-0 u-layout-wrap u-layout-wrap-1">
        <div class="u-gutter-0 u-layout">
          <div class="u-layout-row">
            <div class="u-align-center u-container-style u-image u-layout-cell u-size-30 u-image-1" data-image-width="950" data-image-height="633">
              <div class="u-container-layout u-valign-middle u-container-layout-1" src=""></div>
            </div>
            <div class="u-align-center u-container-style u-grey-10 u-layout-cell u-size-30 u-layout-cell-2">
              <div class="u-container-layout u-valign-middle u-container-layout-2">
                <h1 class="u-custom-font u-font-oswald u-text u-text-default u-title u-text-1">${actor.Name}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
    name.innerHTML = htmlString;

    let ImageAndInformation = document.getElementsByClassName("ImageAndInformation")[0];
    var htmlString = ``;
    ImageAndInformation.innerHTML = htmlString;

    let Description = document.getElementsByClassName("Description")[0];
    var htmlString = `<section class="u-clearfix u-grey-5 u-section-2" id="sec-4405">
    <div class="u-clearfix u-sheet u-sheet-1">
    <h3 class="u-text u-text-1">AGE</h3>
      <p class="u-text u-text-2">${actor.Age}
      <h3 class="u-text u-text-1">DATE OF BIRTH</h3>
      <p class="u-text u-text-2">${actor.DOB}
      </p>
      <h3 class="u-text u-text-1">BIOGRAPHY</h3>
      <p class="u-text u-text-2">${actor.biography}
      </p>
    </div>
  </section>
  
  `;
    Description.innerHTML = htmlString;

    // populating movie list
    let movieList = actor.Movies;
    let movieTable = document.getElementById("movieTable");
    let moviePageHTML = "MoviePage.html";
    let movieKey = "movie";
    var rowString = `<h2>Popular Movies Featured In: </h2>`;
    var counter = 0;
    var goodgod = 1;
    for(let movie of movieList){
        counter++;
        
        
        if(counter == 1){
            rowString += '<tr>';
            rowString += `<section class="u-clearfix u-container-align-center u-section-1" id="sec-1f90">
            <div class="u-clearfix u-sheet u-sheet-1">
              <div class="u-clearfix u-group-elements u-group-elements-1">
                <h3 class="u-custom-font u-font-oswald u-text u-text-body-alt-color u-text-default u-text-1">Sample Headline</h3>
                <div class="u-clearfix u-expanded-width u-group-elements u-group-elements-2"></div>
              </div>`;
        }

        
        rowString += '<td>';
        rowString += `<div class="u-clearfix u-group-elements u-group-elements-${goodgod+2}}">
        
        <img onclick = "redirect('${moviePageHTML}', '${movieKey}', '${movie.title}')" class="u-expanded u-image u-image-default u-image-${goodgod}" src="${movie.image}" alt="" data-image-width="950" data-image-height="633">
        <h3 onclick = "redirect('${moviePageHTML}', '${movieKey}', '${movie.title}')" class="u-custom-font u-font-oswald  u-text-body-alt-color u-text-${goodgod+1}" style="cursor: pointer">${movie.title}</h3>
      </div>`
        //rowString += `<a href = "javascript:redirect('${moviePageHTML}', '${movieKey}', '${movie.title}')"> <img src =  ${movie.image} > </a>`;
        //rowString += `<div><a href = "javascript:redirect('${moviePageHTML}', '${movieKey}', '${movie.title}')">  ${movie.title}  </a></div>`;
        //rowString += `<div><a href = "javascript:redirect('${moviePageHTML}', '${movieKey}', '${movie.title}')">  Role: ${movie.character}  </a></div>`;
        rowString += '</td>';
        goodgod++;

        if(counter == 5){
            rowString += `</div>
            </section>`;
            rowString += '</tr>';
            counter = 0;
        }
        
        if (goodgod == 6) {
            goodgod = 1;
        }
    }
        
    movieTable.innerHTML = rowString;


    // populating series list
    let seriesList = actor.Series;
    let seriesTable = document.getElementById("seriesTable");
    let seriesPageHTML = "SeriesPage.html";
    let seriesKey = "series";
    var seriesRowString = ``;
    var seriesCounter = 0;
    goodgod = 1;
    for(let series of seriesList){
        seriesCounter++;
        
        if(seriesCounter == 1){
            seriesRowString += '<tr>'
            seriesRowString += `<section class="u-clearfix u-container-align-center u-section-1" id="sec-1f90">
            <div class="u-clearfix u-sheet u-sheet-1">
              <div class="u-clearfix u-group-elements u-group-elements-1">
                <h3 class="u-custom-font u-font-oswald u-text u-text-body-alt-color u-text-default u-text-1">Sample Headline</h3>
                <div class="u-clearfix u-expanded-width u-group-elements u-group-elements-2"></div>
              </div>`;
        }


        seriesRowString += '<td>';
        seriesRowString += '<td>';
        seriesRowString += `<div class="u-clearfix u-group-elements u-group-elements-${goodgod+2}}">
        
        <img onclick = "redirect('${seriesPageHTML}', '${seriesKey}', '${series.title}')" class="u-expanded u-image u-image-default u-image-${goodgod}" src="${series.image}" alt="" data-image-width="950" data-image-height="633">
        <h3 onclick = "redirect('${seriesPageHTML}', '${seriesKey}', '${series.title}')" class="u-custom-font u-font-oswald  u-text-body-alt-color u-text-${goodgod+1}" style="cursor: pointer;">${series.title}</h3>
      </div>`
        //seriesRowString += `<a href = "javascript:redirect('${seriesPageHTML}', '${seriesKey}', '${series.title}')"> <img src =  ${series.image} > </a>`;
        //seriesRowString += `<div><a href = "javascript:redirect('${seriesPageHTML}', '${seriesKey}', '${series.title}')">  ${series.title}  </a></div>`;
        //seriesRowString += `<div><a href = "javascript:redirect('${seriesPageHTML}', '${seriesKey}', '${series.title}')">  Role: ${series.character}  </a></div>`;
        //seriesRowString += '</td>';
        goodgod++;

        if(seriesCounter == 5){
            seriesRowString += `</div>
            </section>`;
            seriesRowString += '</tr>';
            seriesCounter = 0;
        }
        
        if(goodgod = 6) {
            goodgod = 1;
        }
    }
        
    seriesTable.innerHTML = seriesRowString;




    

}

populateActorPage();



