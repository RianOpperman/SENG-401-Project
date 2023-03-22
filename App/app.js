const http = require('http');
const fs = require('fs');
const path = require('path');
const util = require('util');

const hostname = 'localhost';
const port = 9000;

// Sends a request file to users' browser
function send(filename, res) {
    fs.readFile(filename, (err, data) => {
        if(err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(`Error loading ${filename}`);
        }

        let contentType = '';
        let fileType = filename.split(".").pop();
        switch (fileType) {
            case 'png':
                contentType = 'image/png';
                break;
            case 'jpg':
                contentType = 'image/jpg';
                break;
            case 'jpeg':
                contentType = 'image/jpeg';
                break;
            case 'html':
                contentType = 'text/html';
                break;
            case 'js':
                contentType = 'text/javascript';
                break;
            case 'css':
                contentType = 'text/css';
                break;
            default:
                contentType = 'text/plain';
                break;
        }

        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    });
}

// Sends movie request to movie microservice
async function requestMovieInfo(data, res){
    return new Promise((resolve, reject) => {
        // All the sending options
        let options = {
            hostname: 'localhost',
            port: 9001,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        // Creates HTTP request for movie info to microservice
        const req = http.request(options, (MovieRes) => {
            console.log(`Movie Microservice responded with: ${res.statusCode}`);
            let data = '';
            MovieRes.on('data', (chunk) => {
                data += chunk;
            });

            MovieRes.on('end', () => {
                if(data !== 'undefined'){
                    let jsonData = JSON.parse(data);
                    console.log(`Movie Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                    resolve(jsonData);
                }
                else{
                    console.log("Movie does not exist");
                    reject("Movie does not exist");
                }
            });
        });
        // Writes data to query
        req.write(data);
        // Finishes query and sends it with specified optins,
        // inside of http.request takes over now
        req.end();
    });
}

const server = http.createServer((req, res) => {
    if(req.method === 'POST' && req.url === "/movie-search"){
        let data = '';

        // Must wait for all info to reach before we can begin using it
        // This is due to asynchronous nature of JS
        req.on('data', chunk => {
            data += chunk.toString();
        });

        // once we have all data, create the JSON and query for info
        req.on('end', () => {
            // let jsonData = JSON.parse(data);
            // console.log(jsonData);
            requestMovieInfo(data, res)
            .then(ret => {
                console.log(JSON.stringify(ret));
                res.write(JSON.stringify(ret));
                res.end();
                console.log("Sent data");
            })
            .catch(e => console.error(e));
        })

        // console.log(data);
    }
    else if(req.method === 'POST' && req.url === "/login"){
        // Call login service
    }
    else if(req.method === 'POST' && req.url === "/series-search"){
        // Call series service
    }
    else if(req.method === 'POST' && req.url === "/actor-search"){
        // call actor service
    }
    else{
        console.log(`Request for ${req.url} received.`);

        // Serve index.html for root URL
        if (req.url === '/') {
            let indexPath = path.join(__dirname, 'index.html');
            send(indexPath, res);
        }
        else{
            let Path = path.join(__dirname, req.url);
            send(Path, res);
        }
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});