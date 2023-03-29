const http = require('http');
const Surreal = require('surrealdb.js');

let db = new Surreal.default('http://localhost:8000/rpc');

const hostname = 'localhost';
const port = 9001;

function prepareQuery(json){
    let query = "http://www.omdbapi.com/?apikey=1cb42be6";
    keys = ['movie-name', 'movie-year'];

    // For each key in the array, if it isn't empty add it to the query
    for(key of keys){
        switch(key){
            case 'movie-name':
                if(!(json[key] === '')){
                    query += `&t=${json['movie-name'].replace(' ', '+')}`;
                }
                break;
            case 'movie-year':
                if(!(json[key] === '')){
                    query += "&y=" + json['movie-year'];
                }
                break;
            case 'movie-id':
                if(!(json[key] === '')){
                    query += "&i=" + json['movie-id'];
                }
                break;
        }
    }

    // At the end log the query
    //console.log(query);
    return query;
}

async function dbQuery(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        // console.log(json);

        let str = '';
        if(json['movie-id'] !== '' && typeof json['movie-id'] !== 'undefined'){
            str = `SELECT * FROM movie:${json['movie-id']}`;
        }
        else{
            str = `SELECT * FROM movie WHERE title CONTAINS '${json['movie-name']}'`;
        }
        let res = await db.query(str);
        // let res = await db.query(`SELECT * FROM movie`);

        // console.log(res[0].result[0]);
        // console.log(str);
        // console.log(typeof json['movie-id'] !== 'undefined');
        return res[0].result[0];
    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function getImage(id){
    let url = 'https://image.tmdb.org/t/p/original/';

    let imagePath = `https://api.themoviedb.org/3/movie/${id}/images?api_key=fd466f23c2618acf3e52defb9c3869ba`;

    // console.log(imagePath);

    return await fetch(imagePath)
    .then(response => response.text())
    .then(result => {
        let json = JSON.parse(result);
        url += json.posters[0].file_path;
        //console.log(url);
        return url;
    })
    .catch(e => console.error(e));
}

async function dbAdd(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.create(`movie:${json['imdbID']}`, {
            actors: json["Actors"],
            description: json['Plot'],
            directors: json['Director'],
            genre: json['Genre'],
            id: json['imdbID'],
            language: json['Language'],
            rating: json['imdbRating'],
            releaseDate: json['Released'],
            runtime: json['Runtime'],
            title: json['Title'],
            writers: json['Writer'],
            image: json['image'],
        });

        return res;
    }
    catch(e){
        console.error('ERROR', e);
    }
}

const server = http.createServer((req, res) => {
    let data = '';
    
    // Must wait for all info to reach before we can begin using it
    // This is due to asynchronous nature of JS
    req.on('data', chunk => {
        data += chunk.toString();
    });

    // If data was sent via POST to the url /
    if(req.method === 'POST' && req.url === '/'){
        // once we have all data, create the JSON and query for info
        req.on('end', () => {
            let jsonData = JSON.parse(data);
            // Fetches info from API, once received send back JSON
            let flag = 0;
            dbQuery(jsonData)
            .then(result => {
                // console.log(result);
                if(typeof result === 'undefined'){
                    console.log(`${jsonData['movie-name']} not in database`);
                    return fetch(prepareQuery(jsonData))
                    .then(response => response.text());
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
                    let data = JSON.parse(json);
                    if(typeof data['imdbID'] !== 'undefined'){
                        data['image'] = await getImage(data['imdbID']);
                        flag = 1;
                        console.log(`Adding ${data['Title']} to database`);
                        return dbAdd(data);
                    }
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
    else if(req.method === 'POST' && req.url === '/popular'){
        req.on('end', () => {
            let jsonData = JSON.parse(data);
            fetch(`https://api.themoviedb.org/3/movie/popular?api_key=fd466f23c2618acf3e52defb9c3869ba&language=en-US&page=${jsonData.num}`)
            .then(response => response.text())
            .then(text => {
                let json = JSON.parse(text);
                let url = 'https://image.tmdb.org/t/p/original/';
                let ret = [];

                for(element of json.results){
                    ret.push({title: element.title, image:url + element.poster_path});
                }
                res.write(JSON.stringify(ret));
                res.end();
            })
            .catch(e => console.error(e));
        })
    }
});

server.listen(port, hostname, () => {
    console.log(`Microservice running at http://${hostname}:${port}`);
});





module.exports = { prepareQuery , getImage , dbQuery, dbAdd};