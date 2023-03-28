const http = require('http');
const fs = require('fs');
const path = require('path');
const Surreal = require('surrealdb.js');

let db = new Surreal.default('http://localhost:8001/rpc');

const hostname = 'localhost';
const port = 9005;

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
        // console.log(result);
        let json = JSON.parse(result);
        // console.log(json);
        id = json.results[0].id;
       console.log("printing id from here:", id);
       // At the end log the query
        let detailsquery = `https://api.themoviedb.org/3/person/${id}?api_key=fd466f23c2618acf3e52defb9c3869ba&append_to_response=images,movie_credits,tv_credits`;
        console.log(detailsquery);
        return detailsquery;
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

        let res = await db.query(`SELECT * FROM castCrew WHERE Name CONTAINS '${json['crew-name']}'`);

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

function getMovieTitles(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function getSeriesTitles(dateString) {
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

        let res = await db.create(`${json['id']}`, {
            Name: json["name"],
            DOB: json['birthday'],
            Age: getAge(json['birthday']),
            Movies: json['movie_credits'],
            id: json['id'],
            Series: json['tv_credits'],
        });
        console.log("DB add's result is:", res);
        return res;
    }
    catch(e){
        console.error('ERROR', e);
    }
}

const server = http.createServer((req, res) => {
    // If data was sent via POST to the url /
    console.log("got here 1");
    if(req.method === 'POST' && req.url === '/'){
        let data = '';
        
        // Must wait for all info to reach before we can begin using it
        // This is due to asynchronous nature of JS
        req.on('data', chunk => {
            data += chunk.toString();
        });
        console.log("got here 2 and data is", data);
        // once we have all data, create the JSON and query for info
        req.on('end', () => {
            console.log("got here 3 and");
            let jsonData = JSON.parse(data);
            // Fetches info from API, once received send back JSON
            let flag = 0;
            dbQuery(jsonData)
            .then(async result => {
                console.log("got here 4 and result is", result);
                if(typeof result === 'undefined'){
                    console.log(`${jsonData['name']} not in database`);
                    let temp = await prepareQuery(jsonData);
                    return fetch(temp)
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
                    console.log(data);
                    if(typeof data['id'] !== 'undefined'){
                        flag = 1;
                        console.log(`Adding ${data['name']} to database`);
                        let temp = dbAdd(data);
                        console.log(temp);
                        return temp;
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
});

server.listen(port, hostname, () => {
    console.log(`Microservice running at http://${hostname}:${port}`);
});