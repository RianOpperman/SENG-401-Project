function redirect(uID){
    sessionStorage.setItem('profileUserID', uID);
    fetch('/userPage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: uID}),
    })
    .then(response => response.text())
    .then(text => {
        let json = JSON.parse(text);
        sessionStorage.setItem('profileUser', json.username);
        document.location.href = 'ProfilePage.html';
    })
}


function populateSeriesPage(){
    var series = sessionStorage.getItem("series");
    series = JSON.parse(series);
    
    
    console.log(series);
    
    
    let Title = document.getElementsByClassName("Title")[0];
    var htmlString = `<h1>${series.title}</h1>`;
    Title.innerHTML = htmlString;

    let ImageAndInformation = document.getElementsByClassName("ImageAndInformation")[0];
    var htmlString = `<img src = "${series.image}" height = "600" width = "475">`;
    htmlString += `<h2>Average Rating: ${series.rating}/10</h2>`;
    htmlString += `<h2>Genre(s): ${series.genre}</h2>`;
    htmlString += `<h2>Release Date: ${series.releaseDate}</h2>`;
    htmlString += `<h2>Seasons: ${series.season}</h2>`;
    htmlString += `<h2>Episodes: ${series.episode}</h2>`;
    htmlString += `<h2>Runtime: ${series.runtime}</h2>`;
    htmlString += `<h2>Language(s): ${series.language}</h2>`;
    ImageAndInformation.innerHTML = htmlString;

    let Description = document.getElementsByClassName("Description")[0];

    var htmlString = `<h2>Description: </h2>`;
    htmlString += `<p>${series.description}</p>`;
    Description.innerHTML = htmlString;

    let Cast = document.getElementsByClassName("Cast")[0];
    var htmlString = `<h2>Actors: </h2>`;
    htmlString += `<p>${series.actors}</p>`;
    htmlString += `<h2>Directors: </h2>`;
    htmlString += `<p>${series.directors}</p>`;
    htmlString += `<h2>Writers: </h2>`;
    htmlString += `<p>${series.writers}</p>`;
    Cast.innerHTML = htmlString;

    let currentUser = sessionStorage.getItem("user");

    if(currentUser != null){
        let ReviewForm = document.getElementsByClassName("ReviewForm")[0];
        ReviewForm.innerHTML =
        `<form id="addComment" action="/comment-add">
        <label for="rating">Rating:</label>
        <select name="rating" id="rating">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
        <label for="comment">Comment:</label>
        <input type="text" id="comment" name="comment"><br>
        <button type="submit">Submit Info</button>
        </form>`;


        const form = document.getElementById('addComment');

            form.addEventListener('submit', (event) => {
                // Prevents issues, can't remember what issues though
                event.preventDefault();

                console.log("Pressed");

                let data = new FormData(form);
                
                let commentInfo = {
                    'series-id': series.id.split('series:')[1],
                    image: series.image,
                    name: series.title,
                    'user-id': sessionStorage.getItem('userID').split('user:')[1],
                    username: sessionStorage.getItem('user'),
                };
                
                data.forEach((value, key) => {commentInfo[key] = value});
                console.log(commentInfo);

                
                fetch('/comment-add', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(commentInfo)
                })
                .then(() => {
                  return fetch('/notify', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(commentInfo)
                  })
                })
                .then(response => response.text())
                .then(() => {
                  location.reload();
                })
                .catch(error => console.log(error));

                // .then(response => response.text())
                // .then(text => {
                //     console.log("added comment");
                    
                //     // let jsonData = JSON.parse(text);
                //     // console.log(jsonData);
                    
                //     // console.log("Searched");
                    
                //     //reloads the page to show updated comment
                //     // document.location.href = "MoviePage.html";
                //     location.reload();
                // })
            });


    }
    
    // MAKE A FETCH CALL TO REVIEWS USING THIS SERIES ID

    // THEN FOR EACH REVIEW OBJECT IN THE JSON DO BELOW CODE

    let Reviews = document.getElementsByClassName("Reviews")[0];

    let seriesID = {'series-id': series.id.split('series:')[1]};

    var htmlString = `<h2>Reviews: </h2>`;

    fetch('/comment-query', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(seriesID),
    })
    .then(response => response.text())
    .then(text => {
        let json = JSON.parse(text);
        for(let comment of json){
            htmlString += `<div class = "review" onclick="redirect('${comment.userID}');"> <h3>${comment.username}: ${comment.rating}/10</h3>`;
            htmlString += `<p>${comment.comment}</p></div>`;
        }
        Reviews.innerHTML = htmlString;
    })
    .catch(e => console.log(e));


}

populateSeriesPage();

