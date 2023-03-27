function redirect(id){
    fetch('/movie-search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'movie-id':id})
    })
    .then(response => response.text())
    .then(text => {
        // console.log(text);
        sessionStorage.setItem("movie", text);
        document.location.href = "MoviePage.html";
    })
    .catch(e => console.error(e));
}

function populateProfilePage(){
    var userName = sessionStorage.getItem("profileUser");
    var userID = sessionStorage.getItem("profileUserID");
    let search = {'user-id': userID};
    if(userName === null || userID === null){
        userName = sessionStorage.getItem('user');
        userID = sessionStorage.getItem('userID');
        search['user-id'] = userID.split('user:')[1];
    }
    
    let profileUserName = document.getElementsByClassName("userName")[0];
    var htmlString = `<h1>${userName}</h1>`;
    profileUserName.innerHTML = htmlString;

    let Reviews = document.getElementsByClassName("Reviews")[0];

    // console.log(`userName = ${userName}`);
    // console.log(`userID = ${userID}`);


    var htmlString = `<h2>Reviews: </h2>`;

    fetch('/comment-query', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(search),
    })
    .then(response => response.text())
    .then(text => {
        let json = JSON.parse(text);
        for(let comment of json){
            htmlString += `<div class = "review" onclick="redirect('${comment.movieID}');"> <h3>${comment.name}: ${comment.rating}/10</h3>`;
            htmlString += `<p>${comment.comment}</p></div>`;
        }
        Reviews.innerHTML = htmlString;

        sessionStorage.removeItem('profileUser');
        sessionStorage.removeItem('profileUserID');
    })
    .catch(e => console.log(e));
}

populateProfilePage();