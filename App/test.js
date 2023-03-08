// fetch('http://www.omdbapi.com/?apikey=1cb42be6&t=Breaking+Bad')
//    .then(response => response.text())
//    .then(text => console.log(text))
const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 9000;

function sendHTML(filename, res){
  fs.readFile(filename, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error loading ${indexPath}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url} received.`);

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

  // Return 404 for all other requests
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

