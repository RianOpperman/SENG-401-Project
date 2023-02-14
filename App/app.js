const Surreal = require('surrealdb.js');
const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1'
const port = 9000

async function initDB() {
	console.log("Before connecting to DB");
	await Surreal.Instance.connect('https://localhost:8000');
	console.log("After connecting to DB, before useing certain DB");
	await Surreal.Instance.use("test", "test");
	console.log("After using certain DB");
}

async function testGet() {
	let results = await Surreal.Instance.query('SELECT * FROM users');
	return results;
}

const server = http.createServer((req, res) => {
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})
