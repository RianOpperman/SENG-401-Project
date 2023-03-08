const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 9000;

function sendHTML(filename, res){
    fs.readFile(filename, (err, data) => {
        if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error loading ${filename}`);
        return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

function sendCSS(filename, res) {
    fs.readFile(filename, (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(`Error loading ${filename}`)
        }
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(data);
    });
}

function sendJS(filename, res) {
    fs.readFile(filename, (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(`Error loading ${filename}`)
        }
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(data);
    });
}

function sendImage(filename, res) {
    fs.readFile(filename, (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(`Error loading ${filename}`)
        }
        let contentType = 'text/plain';
        if(filename.endsWith('.png')){
            contentType = 'image/png';
        }
        else if(filename.endsWith('jpg')){
            contentType = 'image/jpg';
        }
        else if(filename.endsWith('.jpeg')){
            contentType = 'image/jpeg';
        }
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} received.`);
    // let Path = path.join(__dirname, req.url);

    // Serve index.html for root URL
    if (req.url === '/') {
        let indexPath = path.join(__dirname, 'index.html');
        sendHTML(indexPath, res);
    }

    // Serve other HTML files for their respective URLs
    else if (req.url.endsWith('.html')) {
        let htmlPath = path.join(__dirname, req.url);
        sendHTML(htmlPath, res);
    }

    else if (req.url.endsWith('.css')) {
        let cssPath = path.join(__dirname, req.url);
        sendCSS(cssPath, res);
    }

    else if (req.url.endsWith('.js')) {
        let Path = path.join(__dirname, req.url);
        sendJS(Path, res);
    }

    else if (req.url.endsWith('.png')) {
        let Path = path.join(__dirname, req.url);
        sendImage(Path, res);
    }

    else if (req.url.endsWith('.jpg')) {
        let Path = path.join(__dirname, req.url);
        sendImage(Path, res);
    }

    else if (req.url.endsWith('.jpeg')) {
        let Path = path.join(__dirname, req.url);
        sendImage(Path, res);
    }

    // Return 404 for all other requests
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});