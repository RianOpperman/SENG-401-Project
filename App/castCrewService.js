const http = require('http');
const fs = require('fs');
const path = require('path');
const Surreal = require('surrealdb.js');

let db = new Surreal.default('http://localhost:8001/rpc');

const hostname = 'localhost';
const port = 9001;

function prepareQuery(json){
    let query = "https://api.themoviedb.org/3/search/person?api_key=fd466f23c2618acf3e52defb9c3869ba&query=";
    keys = ['crew-name'];

    // For each key in the array, if it isn't empty add it to the query
    for(key of keys){
        switch(key){
            case 'crew-name':
                if(!(json[key] === '')){
                    query += `${json['crew-name']}`;
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

        let res = await db.query(`SELECT * FROM castCrew WHERE Name CONTAINS '${json['crew-name']}'`);
        // let res = await db.query(`SELECT * FROM movie`);

        // console.log(res[0].result[0]);
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
        url += json.profiles[0].file_path;
        return url;
        // console.log(url);
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

async function dbAdd(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.create(`castCrew:${json['imdb_id']}`, {
            Name: json["name"],
            DOB: json['birthday'],
            Age: getAge(json['birthday']),
            Movies: json['movie_credits'],
            id: json['imdb_ID'],
            Series: json['tv_credits'],
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
                    .then(async (text) => {
                        let data = JSON.parse(text);
                        if(typeof data['imdbID'] !== 'undefined'){
                            data['image'] = await getImage(data['imdbID']);
                            dbAdd(data)
                            .then(ret => {
                                console.log(ret);
                                res.write(JSON.stringify(ret));
                                res.end();
                            })
                            .catch(e => console.error(e));
                        }
                        else {
                            res.write('undefined');
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