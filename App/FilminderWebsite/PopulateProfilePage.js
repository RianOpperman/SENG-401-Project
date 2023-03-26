


// fetch("Movie.json")
// .then(function(response){
//     return response.json();
// })
// .then(function(actor){
function populateProfilePage(){
    

    var userName = sessionStorage.getItem("user");
    var userID = sessionStorage.getItem("userID");
    
    
    
    
    
    let profileUserName = document.getElementsByClassName("userName")[0];
    var htmlString = `<h1>${userName}</h1>`;
    profileUserName.innerHTML = htmlString;

    


    // MAKE A FETCH CALL TO REVIEWS USING THIS USER ID

    // THEN FOR EACH REVIEW OBJECT IN THE JSON DO BELOW CODE


    // let Reviews = document.getElementsByClassName("Reviews")[0];

    // let userID = {'user-id': userID.split('user:')[1]};

    // var htmlString = `<h2>Reviews: </h2>`;

    // fetch('/comment-query', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(userID),
    // })
    // .then(response => response.text())
    // .then(text => {
    //     let json = JSON.parse(text);
    //     for(let comment of json){
    //         htmlString += `<div class = "review"> <h3>${comment.name}: ${comment.rating}/10</h3>`;
    //         htmlString += `<p>${comment.comment}</p></div>`;
    //     }
    //     Reviews.innerHTML = htmlString;
    // })
    // .catch(e => console.log(e));


}

populateProfilePage();



