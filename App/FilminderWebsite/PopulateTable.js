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
        .then(response => response.text(), setTimeout(function(){ window.alert("Sorry IMDb does not have this title")}, 1000))
        
        .then(text => {
            if(text !== 'undefined'){
            let jsonData = JSON.parse(text);
            sessionStorage.setItem(key, JSON.stringify(jsonData));
            
            document.location.href = nextPageHTML;
            }
            else{
                window.alert("Sorry IMDb does not have this title");
            }
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
            if(text !== 'undefined'){
            console.log("returned from search");
            
            let jsonData = JSON.parse(text);
            sessionStorage.setItem(key, JSON.stringify(jsonData));
            
            document.location.href = nextPageHTML;
            }
            else{
                window.alert("Sorry IMDb does not have this title");
            }
            
        })
        .catch(error => console.log(error))
    }


}


function populateTable(tableName, nextPageHTML, key, pageNumber){

    //fetch list of popular movies/series
    var json;
    if(key == "movie"){
        //do a popular movie search
        

        let pageInfo = {
            'num': pageNumber
        };
    
        fetch('/movie-popular', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(pageInfo),
        })
        .then(response => response.text())
        .then(text => {
            json = JSON.parse(text);
            // now populate table with json information
            let table = document.getElementById(tableName);
            var rowString = "";
            var counter = 0;
            for(let element of json){
                
                if(element.image.endsWith("null")){
                    continue;
                }

                counter++;
                
                if(counter == 1){
                    rowString += '<tr>'
                }


                rowString += '<td>';
                rowString += `<a href = "javascript:redirect('${nextPageHTML}', '${key}', '${element.title}')"> <img src =  ${element.image} > </a>`;
                rowString += `<div><a href = "javascript:redirect('${nextPageHTML}', '${key}', '${element.title}')">  ${element.title}  </a></div>`;
                rowString += '</td>';

                if(counter == 5){
                    rowString += '</tr>';
                    counter = 0;
                }
                
            }
                
            table.innerHTML = rowString;
            
        })
        .catch(e => console.log(e));
    }

    else if(key == "series"){
        //do a popular series search
        

        let pageInfo = {
            'num': pageNumber,
        };
    
        fetch('/series-popular', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(pageInfo),
        })
        .then(response => response.text())
        .then(text => {
            json = JSON.parse(text);
            // now populate table with json information
            let table = document.getElementById(tableName);
            var rowString = "";
            var counter = 0;
            for(let element of json){
                if(element.image.endsWith("null")){
                    continue;
                }

                counter++;
                
                if(counter == 1){
                    rowString += '<tr>'
                }


                rowString += '<td>';
                rowString += `<a href = "javascript:redirect('${nextPageHTML}', '${key}', '${element.title}')"> <img src =  ${element.image} > </a>`;
                rowString += `<div><a href = "javascript:redirect('${nextPageHTML}', '${key}', '${element.title}')">  ${element.title}  </a></div>`;
                rowString += '</td>';

                if(counter == 5){
                    rowString += '</tr>';
                    counter = 0;
                }
                
            }
                
            table.innerHTML = rowString;
        })
        .catch(e => console.log(e));
    }

    

    
    

}
