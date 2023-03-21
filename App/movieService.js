const http = require('http');
const fs = require('fs');
const path = require('path');
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
        }
    }

    // At the end log the query
    console.log(query);
    return query;
}

async function dbQuery(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.query(`SELECT * FROM movie WHERE title CONTAINS '${json['movie-name']}'`);
        // let res = await db.query(`SELECT * FROM movie`);

        // console.log(res[0].result[0]);
        return res[0].result[0];
    }
    catch(e){
        console.error('ERROR', e);
    }
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
        });

        return res;
    }
    catch(e){
        console.error('ERROR', e);
    }
}

const server = http.createServer((req, res) => {
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
            dbQuery(jsonData)
            .then((result) => {
                if(typeof result === 'undefined'){
                    console.log("Entry not in database");
                    fetch(prepareQuery(jsonData))
                    .then(response => response.text())
                    .then((text) => {
                        let data = JSON.parse(text);
                        if(typeof data['id'] !== 'undefined'){
                            dbAdd(data)
                            .then(ret => {
                                console.log(ret);
                                res.write(JSON.stringify(ret));
                                res.end();
                            })
                            .catch(e => console.error(e));
                        }
                        else {
                            res.write(undefined);
                            res.end();
                        }
                    })
                    .catch(e => console.error(e));
                }
                else{
                    console.log(result);
                    res.write(JSON.stringify(result));
                    res.end();
                }
            })
            .catch(e => console.error(e));
            
            // fetch(prepareQuery(jsonData))
            //    .then(response => response.text())
            //    .then(text => {
            //         res.write(text);
            //         res.end();
            //    });
            // console.log(jsonData);
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Microservice running at http://${hostname}:${port}`);
});