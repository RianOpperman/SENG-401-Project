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
    var htmlString = `<style>
    .u-section-1 {
        background-image: linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${series.image}");
        background-position: 50% 68.3%;
}
</style>
<section class="u-align-center u-clearfix u-image u-shading u-section-1" src="" data-image-width="950" data-image-height="633" id="sec-bfd7">
    <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
      <h1 class="u-custom-font u-font-oswald u-text u-text-default u-text-1">${series.title}</h1>
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
                <p class="u-align-center u-text u-text-2"> ${series.description}</p>
              </div>
            </div>
            <div class="u-align-center u-container-style u-image u-layout-cell u-right-cell u-size-30 u-size-xs-60 u-image-1" src="" data-image-width="950" data-image-height="633">
              <div class="u-container-layout u-valign-middle u-container-layout-2 u-size-30 u-size-xs-60" src="" data-image-width="950" data-image-height="633"><img src = "${series.image}" width="500" height="633"></div>
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
              <a class="active u-active-white u-border-2 u-border-active-grey-15 u-border-hover-grey-15 u-border-no-bottom u-button-style u-tab-link u-text-active-palette-2-base u-text-hover-black u-tab-link-1" id="link-tab-9a29" href="#tab-9a29" role="tab" aria-controls="tab-9a29" aria-selected="true">Series Details</a>
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
                <p class="u-text u-text-default u-text-2">Average Rating: ${series.rating}/10</p>
                <p class="u-text u-text-default u-text-2">Genre: ${series.genre}</p>
                <p class="u-text u-text-default u-text-2">Release Date: ${series.releaseDate}</p>
                <p class="u-text u-text-default u-text-2">Series Runtime: ${series.runtime}</p>
                <p class="u-text u-text-default u-text-2">Series Language: ${series.language}</p>
                <p class="u-text u-text-default u-text-2">Seasons: ${series.season}</p>
                <p class="u-text u-text-default u-text-2">Runtime: ${series.runtime}</p>
              </div>
            </div>
            <div class="u-container-style u-tab-pane u-white u-tab-pane-2" id="tab-0da5" role="tabpanel" aria-labelledby="link-tab-0da5">
              <div class="u-container-layout u-container-layout-2">
                <p class="u-text u-text-4">${series.actors}</p>
              </div>
            </div>
            <div class="u-align-left u-container-style u-tab-pane u-white u-tab-pane-3" id="tab-14b7" role="tabpanel" aria-labelledby="link-tab-14b7">
              <div class="u-container-layout u-valign-top u-container-layout-3">
                <p class="u-text u-text-default u-text-5">${series.directors}
                </p>
              </div>
            </div>
            <div class="u-container-style u-tab-pane u-white u-tab-pane-4" id="tab-2917" role="tabpanel" aria-labelledby="link-tab-2917">
              <div class="u-container-layout u-container-layout-4">
                <p class="u-text u-text-default u-text-5">${series.writers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
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
        <div class="u-form-group u-form-number u-form-number-layout-range-number u-form-group-1">
              <label for="range-46b6" class="u-custom-font u-font-oswald u-label">Rating</label>
              <div class="u-input-row" data-value="0">
                <input type="number" placeholder="" id="rating" name="rating" class="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white" min="0" max="10" step="1" value="0">
              </div>
            </div>
            <div class="u-form-group u-form-message">
              <label for="comment" class="u-custom-font u-font-oswald u-label">Message</label>
              <textarea placeholder="Enter your message" rows="4" cols="50" id="comment" name="comment" class="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white"></textarea>
            </div>
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
            htmlString += `<section class="u-align-center u-clearfix u-grey-10 u-section-2" id="sec-b51e">
            <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
            <div class="u-list u-list-1">
              <div class="u-repeater u-repeater-1">
                <div class="u-align-left u-container-style u-list-item u-repeater-item u-white u-list-item-1">
                  <div class="u-container-layout u-similar-container u-container-layout-1">
                    <h4 onclick="redirect('${comment.userID}');" class="u-text u-text-default u-text-1" style="cursor: pointer;">${comment.username}: ${comment.rating}/10</h4>
                    <p class="u-text u-text-default u-text-2">${comment.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>`;
        }
        Reviews.innerHTML = htmlString;
    })
    .catch(e => console.log(e));


}

populateSeriesPage();

