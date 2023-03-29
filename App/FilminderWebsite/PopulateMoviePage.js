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

function populateMoviePage(){
    var movie = sessionStorage.getItem("movie");
    movie = JSON.parse(movie);
    
    console.log(movie);
    
    let Title = document.getElementsByClassName("Title")[0];
var htmlString = `<style>
    .u-section-1 {
        background-image: linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${movie.image}");
        background-position: 50% 68.3%;
}
</style>
<section class="u-align-center u-clearfix u-image u-shading u-section-1" src="" data-image-width="950" data-image-height="633" id="sec-bfd7">
    <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
      <h1 class="u-custom-font u-font-oswald u-text u-text-default u-text-1">${movie.title}</h1>
    </div>
</section>
<section class="u-clearfix u-grey-5 u-section-2" id="sec-3c43">
    <div class="u-clearfix u-sheet u-sheet-1">
      <div class="u-clearfix u-expanded-width u-gutter-10 u-layout-wrap u-layout-wrap-1">
        <div class="u-layout" style="">
          <div class="u-layout-row" style="">
            <div class="u-container-style u-layout-cell u-left-cell u-size-30 u-size-xs-60 u-layout-cell-1" src="">
              <div class="u-container-layout u-container-layout-1">
                <h2 class="u-align-center u-text u-text-1">Plot</h2>
                <p class="u-align-center u-text u-text-2"> ${movie.description}</p>
              </div>
            </div>
            <div class="u-align-center u-container-style u-image u-layout-cell u-right-cell u-size-30 u-size-xs-60 u-image-1" src="" data-image-width="950" data-image-height="633">
              <div class="u-container-layout u-valign-middle u-container-layout-2 u-size-30 u-size-xs-60" src="" data-image-width="950" data-image-height="633"><img src = "${movie.image}" width="500" height="633"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
</section>
  
    
    <section class="u-align-center u-clearfix u-section-4" id="sec-7301">
      <div class="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xl u-sheet-1">
        <div class="u-expanded-width u-tabs u-tabs-1">
          <ul class="u-border-1 u-border-grey-25 u-tab-list u-unstyled" role="tablist">
            <li class="u-tab-item" role="presentation">
              <a class="active u-active-white u-border-2 u-border-active-grey-15 u-border-hover-grey-15 u-border-no-bottom u-button-style u-tab-link u-text-active-palette-2-base u-text-hover-black u-tab-link-1" id="link-tab-9a29" href="#tab-9a29" role="tab" aria-controls="tab-9a29" aria-selected="true">Movie Details</a>
            </li>
            <li class="u-tab-item" role="presentation">
              <a class="u-active-white u-border-2 u-border-active-grey-15 u-border-hover-grey-15 u-border-no-bottom u-button-style u-tab-link u-text-active-palette-2-base u-text-hover-black u-tab-link-2" id="link-tab-0da5" href="#tab-0da5" role="tab" aria-controls="tab-0da5" aria-selected="false">Actors</a>
            </li>
            <li class="u-tab-item" role="presentation">
              <a class="u-active-white u-border-2 u-border-active-grey-15 u-border-hover-grey-15 u-border-no-bottom u-button-style u-tab-link u-text-active-palette-2-base u-text-hover-black u-tab-link-3" id="link-tab-14b7" href="#tab-14b7" role="tab" aria-controls="tab-14b7" aria-selected="false">Directors</a>
            </li>
            <li class="u-tab-item" role="presentation">
              <a class="u-active-white u-border-2 u-border-active-grey-15 u-border-hover-grey-15 u-border-no-bottom u-button-style u-tab-link u-text-active-palette-2-base u-text-hover-black u-tab-link-4" id="link-tab-2917" href="#tab-2917" role="tab" aria-controls="tab-2917" aria-selected="false">Writers</a>
            </li>
          </ul>
          <div class="u-tab-content">
            <div class="u-container-style u-tab-active u-tab-pane u-white u-tab-pane-1" id="tab-9a29" role="tabpanel" aria-labelledby="link-tab-9a29">
              <div class="u-container-layout u-container-layout-1">
                <h4 class="u-text u-text-default u-text-1"></h4>
                <p class="u-text u-text-default u-text-2">Genre: ${movie.genre}</p>
                <p class="u-text u-text-default u-text-2">Release Date: ${movie.releaseDate}</p>
                <p class="u-text u-text-default u-text-2">Movie Runtime: ${movie.runtime}</p>
                <p class="u-text u-text-default u-text-2">Movie Language: ${movie.language}</p>
              </div>
            </div>
            <div class="u-container-style u-tab-pane u-white u-tab-pane-2" id="tab-0da5" role="tabpanel" aria-labelledby="link-tab-0da5">
              <div class="u-container-layout u-container-layout-2">
                <p class="u-text u-text-4">${movie.actors}</p>
              </div>
            </div>
            <div class="u-align-left u-container-style u-tab-pane u-white u-tab-pane-3" id="tab-14b7" role="tabpanel" aria-labelledby="link-tab-14b7">
              <div class="u-container-layout u-valign-top u-container-layout-3">
                <p class="u-text u-text-default u-text-5">${movie.directors}
                </p>
              </div>
            </div>
            <div class="u-container-style u-tab-pane u-white u-tab-pane-4" id="tab-2917" role="tabpanel" aria-labelledby="link-tab-2917">
              <div class="u-container-layout u-container-layout-4">
                <p class="u-text u-text-default u-text-5">${movie.writers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`
  ;
    Title.innerHTML = htmlString;

    let ImageAndInformation = document.getElementsByClassName("ImageAndInformation")[0];
    var htmlString = ``;
    ImageAndInformation.innerHTML = htmlString;

    let Description = document.getElementsByClassName("Description")[0];

    var htmlString = ``;
    Description.innerHTML = htmlString;

    let Cast = document.getElementsByClassName("Cast")[0];
    var htmlString = ``;
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
                    'movie-id': movie.id.split('movie:')[1],
                    image: movie.image,
                    name: movie.title,
                    'user-id': sessionStorage.getItem('userID').split('user:')[1],
                    username: sessionStorage.getItem('user'),
                };
                data.forEach((value, key) => {commentInfo[key] = value});

                console.log(commentInfo);

                // Fetches movie info from main server
                // Need to revamp for dynamic web pages
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
            });


    }
    
    let Reviews = document.getElementsByClassName("Reviews")[0];

    let movieID = {'movie-id': movie.id.split('movie:')[1]};

    var htmlString = `<h2>Reviews: </h2>`;

    fetch('/comment-query', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(movieID),
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

populateMoviePage();

