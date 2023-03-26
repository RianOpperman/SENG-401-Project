


// fetch("Movie.json")
// .then(function(response){
//     return response.json();
// })
// .then(function(actor){
function populateProfilePage(){
    // var actorID = sessionStorage.getItem("actor");
    // console.log(actorID);
    //let movie = Movies[0];

    var userName = sessionStorage.getItem("user");
    var userID = sessionStorage.getItem("userID");
    
    
    
    
    let Grid = document.getElementsByClassName("actorPageGridContainer");
    let profileUserName = document.getElementsByClassName("Name")[0];
    var htmlString = `<h1>${userName}</h1>`;
    profileUserName.innerHTML = htmlString;

    

    let reviewSection = document.getElementsByClassName("Reviews")[0];
    var htmlString = `<h2>Number of Reviews: </h2>`;
    htmlString += `<div class = "review"> <h3>${"User1234"}: ${"6.9"}/10</h3>`;
    htmlString += `<p>${"Amazing movie"}</p></div>`;
    reviewSection.innerHTML = htmlString;


}

populateProfilePage();



