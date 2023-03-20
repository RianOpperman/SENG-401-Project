


fetch("MovieObject.json")
.then(function(response){
    return response.json();
})
.then(function(Movies){
    
    let table = document.getElementById("HotMovies");
    var rowString = "";
    var counter = 0;
    for(let movie of Movies){
        counter++;
        
        if(counter == 1){
            rowString += '<tr>'
        }
        
        var currentPage = document.location.href;
        params = url.split('?')[1].split('&');
        
        var url = currentPage + '?name=' + encodeURIComponent(movie.key);
        //document.location.href = url
        
        rowString += '<td>';
        rowString += `<a href = ${url} > <img src =  ${movie.image} > </a>`;
        rowString += `<div><a href = ${url}  >  ${movie.title}  </a></div>`;
        rowString += '</td>';
        
        if(counter == 5){
            rowString += '</tr>';
            counter = 0;
        }
        
    }
    
    
    
    table.innerHTML = rowString;
})
// window.onload = funCall;
// start of new
// function populateTable(){
    
    
    
// };

// populateTable();
