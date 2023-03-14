const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 9001;

function prepareQuery(json){
    query = "http://www.omdbapi.com/?apikey=1cb42be6&";
    keys = ['movie-name', 'movie-year'];

    // For each key in the array, if it isn't empty add it to the query
    for(key of keys){
        switch(key){
            case 'movie-name':
                if(!(json[key] === '')){
                    query += `t=${json['movie-name'].replace(' ', '+')}`;
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
            fetch(prepareQuery(jsonData))
               .then(response => response.text())
               .then(text => {
                    res.write(text);
                    res.end();
               });
            console.log(jsonData);
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Microservice running at http://${hostname}:${port}`);
});