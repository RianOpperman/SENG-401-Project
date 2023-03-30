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
    let search = {};
    if(userName === null || userID === null){
        userName = sessionStorage.getItem('user');
        userID = sessionStorage.getItem('userID');
        search['user-id'] = userID.split('user:')[1];
    }
    else{
      search['user-id'] = userID.split('user:')[1];
    }
    
    let profileUserName = document.getElementsByClassName("userName")[0];
    var htmlString = `<section class="u-clearfix u-section-1" id="sec-e1df">
    <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
      <div class="u-clearfix u-gutter-0 u-layout-wrap u-layout-wrap-1">
        <div class="u-layout" style="">
          <div class="u-layout-row" style="">
            <div class="u-align-center u-container-style u-grey-15 u-layout-cell u-right-cell u-size-60 u-size-xs-60 u-layout-cell-1" src="">
              <div class="u-container-layout u-valign-middle u-container-layout-1">
                <h2 id = "displayUsername" class="u-align-center u-text u-text-default u-text-1">${userName}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
    profileUserName.innerHTML = htmlString;

    let Reviews = document.getElementsByClassName("Reviews")[0];

    // console.log(`userName = ${userName}`);
    // console.log(`userID = ${userID}`);


    var htmlString = ``;

    fetch('/comment-query', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(search),
    })
    .then(response => response.text())
    .then(text => {
        let json = JSON.parse(text);

        htmlString += `<section class="u-align-center u-clearfix u-section-2" id="sec-85e5">
        <div class="u-clearfix u-sheet u-sheet-1">
          <h2 class="u-text u-text-default u-text-1">Reviews</h2>
          <div class="u-expanded-width u-layout-horizontal u-list u-list-1">
            <div class="u-repeater u-repeater-1">
            `;
        for(let comment of json){
            htmlString += `<div class="u-align-left u-container-style u-list-item u-repeater-item">
              <div class="u-container-layout u-similar-container u-container-layout-1">
                <img class="u-expanded-width u-image u-image-default u-image-1" alt="" data-image-width="950" data-image-height="633" src="${comment.image}">
                <h4 class="u-text u-text-2">${comment.name}</h4>
                <p class="u-text u-text-3">Comment: ${comment.comment}</p>
                <p class="u-text u-text-3">Rating: ${comment.rating}</p>

                <button OnClick = "redirect('${comment.movieID}');">Learn More</button> 
              </div>
            </div>`
        }
        htmlString += `</div>
        <a class="u-absolute-vcenter u-gallery-nav u-gallery-nav-prev u-grey-70 u-icon-circle u-opacity u-opacity-70 u-spacing-10 u-text-white u-gallery-nav-1" href="#" role="button">
          <span aria-hidden="true">
            <svg viewBox="0 0 451.847 451.847"><path d="M97.141,225.92c0-8.095,3.091-16.192,9.259-22.366L300.689,9.27c12.359-12.359,32.397-12.359,44.751,0
c12.354,12.354,12.354,32.388,0,44.748L173.525,225.92l171.903,171.909c12.354,12.354,12.354,32.391,0,44.744
c-12.354,12.365-32.386,12.365-44.745,0l-194.29-194.281C100.226,242.115,97.141,234.018,97.141,225.92z"></path></svg>
          </span>
          <span class="sr-only">
            <svg viewBox="0 0 451.847 451.847"><path d="M97.141,225.92c0-8.095,3.091-16.192,9.259-22.366L300.689,9.27c12.359-12.359,32.397-12.359,44.751,0
c12.354,12.354,12.354,32.388,0,44.748L173.525,225.92l171.903,171.909c12.354,12.354,12.354,32.391,0,44.744
c-12.354,12.365-32.386,12.365-44.745,0l-194.29-194.281C100.226,242.115,97.141,234.018,97.141,225.92z"></path></svg>
          </span>
        </a>
        <a class="u-absolute-vcenter u-gallery-nav u-gallery-nav-next u-grey-70 u-icon-circle u-opacity u-opacity-70 u-spacing-10 u-text-white u-gallery-nav-2" href="#" role="button">
          <span aria-hidden="true">
            <svg viewBox="0 0 451.846 451.847"><path d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744
L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284
c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"></path></svg>
          </span>
          <span class="sr-only">
            <svg viewBox="0 0 451.846 451.847"><path d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744
L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284
c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"></path></svg>
          </span>
        </a>
      </div>
    </div>
  </section>`
        Reviews.innerHTML = htmlString;

        
    })
    .catch(e => console.log(e));
}

populateProfilePage();