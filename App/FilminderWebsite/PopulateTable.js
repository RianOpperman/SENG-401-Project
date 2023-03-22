

function populateTable(JSONFile, tableName, nextPageHTML, key){
    fetch(JSONFile)
    .then(function(response){
        return response.json();
    })
    .then(function(AllElements){
        
        let table = document.getElementById(tableName);
        var rowString = "";
        var counter = 0;
        for(let element of AllElements){
            counter++;
            
            if(counter == 1){
                rowString += '<tr>'
            }
            
            
            var url = nextPageHTML;
            
            
            
            
            rowString += '<td>';
            rowString += `<a class = ${element.id} href = ${url} > <img src =  ${element.image} > </a>`;
            rowString += `<div><a class = ${element.id} href = ${url}  >  ${element.title}  </a></div>`;
            rowString += '</td>';
            
            
            
            if(counter == 5){
                rowString += '</tr>';
                counter = 0;
            }
            
        }
        
        table.innerHTML = rowString;
        for(let element of AllElements){
            Array.from(document.getElementsByClassName(element.id)).forEach((Component) => {
                
                Component.addEventListener('click', function(){

                    sessionStorage.setItem(key, element.id);
                    
                });

            });
        }
    })

}

// start of new
// function populateTable(){
    
    
    
// };

// populateTable();
