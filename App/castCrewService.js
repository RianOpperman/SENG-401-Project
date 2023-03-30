const http = require('https');
const fs = require('fs');
const Surreal = require('surrealdb.js');

let db = new Surreal.default('http://localhost:8001/rpc');

const hostname = 'localhost';
const port = 9005;
const options = {
    key: fs.readFileSync('ssl/crew.key'),
    cert: fs.readFileSync('ssl/crew.cert')
};

async function prepareQuery(json){
    let query = "https://api.themoviedb.org/3/search/person?api_key=fd466f23c2618acf3e52defb9c3869ba&query=";
    keys = ['crew-name'];
    let nameArray = json['crew-name'].split(" ");

    // For each key in the array, if it isn't empty add it to the query
    for(key of keys){
        switch(key){
            case 'crew-name':
                if(!(json[key] === '')){
                    // console.log("query here is " , query);
                    for(var i = 0; i < nameArray.length; i++){
                        if(i > 0)
                            query += '+';
                        query += nameArray[i];
                        
                    }
                }
                break;
        }
    }
    let id;
    console.log(query);
    return await fetch(query)
    .then(response => response.text())
    .then(result => {
        let json = JSON.parse(result);
        if(json.results.length > 0){
            // console.log(json);
            id = json.results[0].id;
            console.log("printing id from here:", id);
            // At the end log the query
            let detailsquery = `https://api.themoviedb.org/3/person/${id}?api_key=fd466f23c2618acf3e52defb9c3869ba&append_to_response=images,movie_credits,tv_credits`;
            console.log(detailsquery);
            return detailsquery;
        }
        else{
            return 'undefined';
        }
    })
    .catch(e => console.error(e));
}

async function dbQuery(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.query(`SELECT * FROM castCrew WHERE Name CONTAINS $name;`, {
            name: json['crew-name']
        });

        //console.log(res[0].result[0]);
        return res[0].result[0];
    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function getImage(id){
    let url = 'https://image.tmdb.org/t/p/original/';

    let imagePath = `https://api.themoviedb.org/3/person/${id}?api_key=fd466f23c2618acf3e52defb9c3869ba&append_to_response=images,movie_credits,tv_credits`;

    // console.log(imagePath);

    return await fetch(imagePath)
    .then(response => response.text())
    .then(result => {
        let json = JSON.parse(result);
        url += json['profile_path'];
        
        console.log("actor's image is: ", url);
        return url;
    })
    .catch(e => console.error(e));
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function getMovieTitles(data) {
    let movie_title = [];
    let movie_credits = data['movie_credits']['cast'];
    console.log("movie credits array length is:", Object.keys(movie_credits).length);
    let sorted_movie_title = movie_credits.sort((r1, r2) => { 
        if(r1.popularity < r2.popularity){
            // console.log(typeof r1.popularity);
            return 1;
        } 
        if(r1.popularity > r2.popularity){
            // console.log(typeof r1.popularity);
            return -1;
        } 
        return 0;
    
    });
    
    
        for(var i = 0; i <  Object.keys(sorted_movie_title).length && i < 10; i++){
        // console.log(sorted_movie_title[i]['original_title']);
        // movie_title.push(sorted_movie_title[i]['original_title']);
        let temp = {title: sorted_movie_title[i]['original_title'], image: 'https://image.tmdb.org/t/p/original/', character: sorted_movie_title[i]['character']}
        temp.image += sorted_movie_title[i]['poster_path'];
        movie_title.push(temp);
        console.log(temp);
    }
    return movie_title
}

function getSeriesTitles(data) {
    let series_title = [];
    let series_credits = data['tv_credits']['cast'];
    console.log("movie credits array length is:", Object.keys(series_credits).length);
    let sorted_series_credits = series_credits.sort((r1, r2) => (r1.popularity < r2.popularity) ? 1 : (r1.popularity > r2.popularity) ? -1 : 0);
    for(var i = 0; i <  Object.keys(sorted_series_credits).length && i < 10; i++){
        // console.log(sorted_series_credits[i]['original_name']);
        // console.log(sorted_series_credits[i]['popularity']);
        let temp = {title: sorted_series_credits[i]['original_name'], image: 'https://image.tmdb.org/t/p/original/', character: sorted_series_credits[i]['character']}
        temp.image += sorted_series_credits[i]['poster_path'];
        if(!temp.character){
            temp.character = 'self'
        }
        series_title.push(temp);
        console.log(temp);
    }
    return series_title
}

function formatDate(d)
 {
  date = new Date(d)
  var dd = date.getDate(); 
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear(); 
  if(dd<10){dd='0'+dd} 
  if(mm<10){mm='0'+mm};
  return (mm+'/'+dd+'/'+yyyy)
}

async function dbAdd(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.create(`${json['id']}`, {
            Name: json["name"],
            DOB: formatDate(json['birthday']),
            Age: getAge(json['birthday']),
            Movies: getMovieTitles(json),
            id: json['id'],
            Series: getSeriesTitles(json),
            image: json['image'],
            biography: json['biography']
        });
        console.log("DB add's result is:", res);
        return res;
    }
    catch(e){
        console.error('ERROR', e);
    }
}

const server = http.createServer(options, (req, res) => {
    // If data was sent via POST to the url /
    if(req.method === 'POST' && req.url === '/'){
        let data = '';
        
        // Must wait for all info to reach before we can begin using it
        // This is due to asynchronous nature of JS
        req.on('data', chunk => {
            data += chunk.toString();
        });
        // once we have all data, create the JSON and query for info
        req.on('end', () => {
            let jsonData = JSON.parse(data);
            // Fetches info from API, once received send back JSON
            let flag = 0;
            dbQuery(jsonData)
            .then(async result => {
                if(typeof result === 'undefined'){
                    console.log(`${jsonData['name']} not in database`);
                    let temp = await prepareQuery(jsonData);
                    if(temp !== 'undefined'){
                        return fetch(temp)
                        .then(response => response.text());
                    }
                    else{
                        return temp;
                    }
                }
                else{
                    flag = 1;
                    return result;
                }
            })
            .then(async (json) => {
                if(flag === 1){
                    return json;
                }
                else{
                    if(json !== 'undefined'){
                        let data = JSON.parse(json);
                        console.log(data);
                        if(typeof data['id'] !== 'undefined'){
                            console.log("I am here with image prep id is ", data['id']);
                            data['image'] = await getImage(data['id']); 
                            flag = 1;
                            console.log(`Adding ${data['name']} to database`);
                            let temp = dbAdd(data);
                            console.log(temp);
                            return temp;
                        }
                    }
                    else return json;
                }
            })
            .then(ret => {
                if(flag === 1){
                    res.write(JSON.stringify(ret));
                    res.end();
                }
                else {
                    res.write('undefined');
                    res.end();
                }
            })
            .catch(e => console.error(e));
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Microservice running at http://${hostname}:${port}`);
});



module.exports = { prepareQuery , getImage , dbQuery, dbAdd};