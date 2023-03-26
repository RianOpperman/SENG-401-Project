const http = require('http');
const Surreal = require('surrealdb.js');

let db = new Surreal.default('http://localhost:8004/rpc');

const hostname = 'localhost';
const port = 9004;

const Table = {
    movie:'movieComment',
    movieField:'movieID',
    series:'seriesComment',
    seriesField:'seriesID',
}

async function dbQuery(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let flag = 0;

        let str = '';
        if(json['movie-id'] !== '' && typeof json['movie-id'] !== 'undefined'){
            str = `SELECT * FROM ${Table.movie} WHERE ${Table.movieField}='${json['movie-id']}'`;
        }
        else if(json['series-id'] !== '' && typeof json['series-id'] !== 'undefined'){
            str = `SELECT * FROM ${Table.series} WHERE ${Table.seriesField}='${json['series-id']}'`;
        }
        else{
            str = `SELECT * FROM ${Table.movie}, ${Table.series} WHERE userID=${json['user-id']}`;
            flag = 1;
        }
        console.log(str);
        let res = await db.query(str);
        // let res = await db.query(`SELECT * FROM movie`);

        // console.log(res[0].result[0]);
        if(flag === 1){
            return res[0].result;
        }
        else
            return res[0].result;
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

        let res = {};
        if(json['movie-id'] !== '' && typeof json['movie-id'] !== 'undefined'){
            res = await db.create(`${Table.movie}`, {
                comment: json.comment,
                image: json.image,
                movieID: json['movie-id'],
                name: json.name,
                rating: json.rating,
                userID: json['user-id'],
                username: json.username,
            });
        }
        else if(json['series-id'] !== '' && typeof json['series-id'] !== 'undefined'){
            res = await db.create(`${Table.series}`, {
                comment: json.comment,
                image: json.image,
                movieID: json['series-id'],
                name: json.name,
                rating: json.rating,
                userID: json['user-id'],
                username: json.username,
            });
        }

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
    if(req.method === 'POST' && req.url === '/query'){
        // once we have all data, create the JSON and query for info
        req.on('end', () => {
            console.log(data);
            let jsonData = JSON.parse(data);
            console.log(jsonData);
            // Fetches info from API, once received send back JSON
            dbQuery(jsonData)
            .then(result => {
                console.log(result);
                res.write(JSON.stringify(result));
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/add'){
        req.on('end', () => {
            let jsonData = JSON.parse(data);
            // Fetches info from API, once received send back JSON
            dbAdd(jsonData)
            .then(result => {
                console.log(result);
                res.write(JSON.stringify(result));
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Microservice running at http://${hostname}:${port}`);
});