
//fake data
const contentList = [
    //row1
    {title: "Shrek", image: "Shrek.jpg", url: "https://en.wikipedia.org/wiki/Shrek"},{title: "Toy Story", image: "ToyStory.jpg", url: "https://en.wikipedia.org/wiki/Shrek"},{title: "Avatar The Way Of Water", image: "Avatar2.jpg", url: "https://en.wikipedia.org/wiki/Shrek"}, {title: "Shrek", image: "Shrek.jpg", url: "https://en.wikipedia.org/wiki/Shrek"}, {title: "Shrek", image: "Shrek.jpg", url: "https://en.wikipedia.org/wiki/Shrek"},
    //row2
    {title: "Shrek", image: "Shrek.jpg", url: "https://en.wikipedia.org/wiki/Shrek"},{title: "Toy Story", image: "ToyStory.jpg", url: "https://en.wikipedia.org/wiki/Shrek"},{title: "Avatar The Way Of Water", image: "Avatar2.jpg", url: "https://en.wikipedia.org/wiki/Shrek"},
    //row3
    {title: "Shrek", image: "Shrek.jpg", url: "https://en.wikipedia.org/wiki/Shrek"},{title: "Toy Story", image: "ToyStory.jpg", url: "https://en.wikipedia.org/wiki/Shrek"},{title: "Avatar The Way Of Water", image: "Avatar2.jpg", url: "https://en.wikipedia.org/wiki/Shrek"}
];
// window.onload = funCall;
// start of new
function funCall(){
    
    var rowString = "";
    
    for(var i = 0, counter = 0; i < contentList.length; i++){
        counter++;
        
        if(counter == 1){
            rowString += '<tr>'
        }
        
        
        rowString += '<td>';
        rowString += '<a href = ' + contentList[i].url + '>' + '<img src = ' + contentList[i].image + '>' + '</a>';
        rowString += '<div><a href = ' + contentList[i].url + '>' + contentList[i].title + '</a></div>';
        rowString += '</td>';
        
        if(counter == 5){
            rowString += '</tr>';
            counter = 0;
        }
        
    }
    
    let table = document.getElementById("HotMovies");
    
    table.innerHTML = rowString;
    
};

funCall();
