const http = require('https');
const fs = require('fs');
const Surreal = require('surrealdb.js');

let db = new Surreal.default('http://localhost:8002/rpc');

const hostname = 'localhost';
const port = 9002;
const options = {
    key: fs.readFileSync('ssl/series.key'),
    cert: fs.readFileSync('ssl/series.cert')
};

function prepareQuery(json){
    let query = "http://www.omdbapi.com/?apikey=1cb42be6&Type=series";
    keys = ['series-name', 'series-year'];

    // For each key in the array, if it isn't empty add it to the query
    for(key of keys){
        switch(key){
            case 'series-name':
                if(!(json[key] === '')){
                    query += `&t=${json['series-name'].replace(' ', '+')}`;
                }
                break;
            case 'series-year':
                if(!(json[key] === '')){
                    query += "&y=" + json['series-year'];
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

        let res = await db.query(`SELECT * FROM series WHERE title CONTAINS '${json['series-name']}'`);
        // let res = await db.query(`SELECT * FROM movie`);

        // console.log(res[0].result[0]);
        return res[0].result[0];
    }
    catch(e){
        console.error('ERROR', e);
    }
}


async function getImage(name){ //REQUIRES SEPERATE API CALL
    // let url = 'https://image.tmdb.org/t/p/original/';
    // let imagePath = `https://api.themoviedb.org/3/movie/${id}/images?api_key=fd466f23c2618acf3e52defb9c3869ba`;

    // // console.log(imagePath);

    // return await fetch(imagePath)
    // .then(response => response.text())
    // .then(result => {
    //     let json = JSON.parse(result);
    //     url += json.posters[0].file_path;
    //     return url;
    //     // console.log(url);
    // })
    // .catch(e => console.error(e));

    // Place Holder
    
    // let url = "temporaryURL/";
    // url+=id;
    // return url;

    let url = 'https://image.tmdb.org/t/p/original';
    let idPath = `https://api.themoviedb.org/3/search/tv?api_key=fd466f23c2618acf3e52defb9c3869ba&language=en-US&query=${name}`;
    
    return await fetch(idPath)
        .then(response => response.text())
        .then(async(text)=>{
            let data = JSON.parse(text);
            let results = data['results'][0];
            url+=results['poster_path'];
            //console.log(url)
            return url;
        })
        .catch(e => console.error(e));
}



async function dbAdd(json){ // Fix later, connect with database.

    let info = {    // episode is a placeholder right now
        actors : json['Actors'],
        description : json['Plot'],
        directors: json['Director'],
        episode: '20',
        genre: json['Genre'],
        id: json['imdbID'],
        language: json['Language'],
        rating: json['imdbRating'],
        releaseDate: json['Released'],
        runtime: json['Runtime'],
        season: json['totalSeasons'],
        title: json['Title'],
        writers: json['Writer'],
        image: json['image']
    };

    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.create(`series:${json['imdbID']}`, info);
        return res;
    }
    catch(e){
        console.error('ERROR', e);
    }


    //return info;


}


const server = http.createServer(options, (req, res) => {
    let data = '';
    
    // Must wait for all info to reach before we can begin using it
    // This is due to asynchronous nature of JS
    req.on('data', chunk => {
        data += chunk.toString();
    });

    // If data was sent via POST to the url /
    if(req.method === 'POST' && req.url === '/series'){
        // once we have all data, create the JSON and query for info
        req.on('end', () => {
            let jsonData = JSON.parse(data);
            let flag = 0;
            dbQuery(jsonData)
            .then((result) => {
                if(typeof result === 'undefined'){
                    console.log("Entry not in database");
                    return fetch(prepareQuery(jsonData))
                    .then(response => response.text());
                }
                else{
                    flag = 1;
                    return result;
                }
            })
            .then(async (text) => {
                if(flag ===  1){
                    return text;
                }
                else{
                    let data = JSON.parse(text);
                    if(typeof data['Title'] !== 'undefined'){
                        data['image'] = await getImage(data['Title']);
                        flag = 1;
                        return dbAdd(data);
                    }
                }
            })
            .then(ret => {
                if(flag === 1){
                    res.write(JSON.stringify(ret));
                }
                else{
                    res.write('undefined');
                }
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/popular'){
        req.on('end', () => {
            let jsonData = JSON.parse(data);
            fetch(`https://api.themoviedb.org/3/tv/popular?api_key=fd466f23c2618acf3e52defb9c3869ba&language=en-US&page=${jsonData.num}`)
            .then(response => response.text())
            .then(text => {
                let json = JSON.parse(text);
                let url = 'https://image.tmdb.org/t/p/original/';
                let ret = [];

                for(element of json.results){
                    ret.push({title: element.name, image:url + element.poster_path});
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