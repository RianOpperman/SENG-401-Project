

function populateSearchTable(tableName, nextPageHTML, key){
    
        element = sessionStorage.getItem("searchResults");
        element = JSON.parse(element);
        console.log(element);
        let table = document.getElementById(tableName);
        var rowString = "";
        var counter = 0;
        //for(let element of AllElements){
            console.log(element);
            counter++;
            
            if(counter == 1){
                rowString += '<tr>'
            }
            
            
            var url = nextPageHTML;
            
            
            
            
            rowString += '<td>';
            rowString += `<a class = ${element.id} href = ${url} > <img src =  ${element.image} height: 400px width: 300px> </a>`;
            rowString += `<div><a class = ${element.id} href = ${url}  >  ${element.title}  </a></div>`;
            rowString += '</td>';
            
            
            
            if(counter == 5){
                rowString += '</tr>';
                counter = 0;
            }
            
        //}
        
        table.innerHTML = rowString;
        //for(let element of AllElements){
            Array.from(document.getElementsByClassName(element.id)).forEach((Component) => {
                
                Component.addEventListener('click', function(){

                    sessionStorage.setItem(key, element.id);
                    
                });

            });
        //}
    

}

// start of new
// function populateTable(){
    
    
    
// };

// populateTable();
