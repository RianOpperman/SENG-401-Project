const http = require('http');
const fs = require('fs');
const path = require('path');
const util = require('util');
const nodemailer =require('nodemailer');

const hostname = 'localhost';
const port = 9000;
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 2500,
    secure: false,
});

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

async function requestActorInfo(data, res){
    return new Promise((resolve, reject) => {
        // All the sending options
        let options = {
            hostname: 'localhost',
            port: 9005,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        // Creates HTTP request for movie info to microservice
        const req = http.request(options, (ActorRes) => {
            console.log(`Actor Microservice responded with: ${res.statusCode}`);
            let data = '';
            ActorRes.on('data', (chunk) => {
                data += chunk;
            });

            ActorRes.on('end', () => {
                if(data !== 'undefined'){
                    let jsonData = JSON.parse(data);
                    console.log(`Actor Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                    resolve(jsonData);
                }
                else{
                    console.log("Actor does not exist");
                    reject("Actor does not exist");
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

async function loginCheck(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (userRes) => {
            console.log(`User Microservice responded with: ${userRes.statusCode}`);
            let data = '';
            userRes.on('data', (chunk) => {
                data += chunk;
            });

            userRes.on('end', () => {
                console.log(data);
                if(data !== 'undefined'){
                    resolve(data);
                }
                else{
                    // console.log("rejected");
                    resolve('undefined');
                }
                console.log(`User Microservice sent: '${util.inspect(data, {colors: true})}'`);
            });
        });
        // Writes data to query
        req.write(json);
        // Finishes query and sends it with specified optins,
        // inside of http.request takes over now
        req.end();
    });
}

async function signupUser(json){
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for movie info to microservice
        const req = http.request(options, (userRes) => {
            console.log(`User Microservice responded with: ${userRes.statusCode}`);
            let data = '';
            userRes.on('data', (chunk) => {
                data += chunk;
            });

            userRes.on('end', () => {
                if(data !== 'undefined'){
                    resolve(data);
                }
                else{
                    reject('undefined')
                };
                console.log(`User Microservice sent: '${util.inspect(data, {colors: true})}'`);
            });
        });
        // Writes data to query
        req.write(json);
        // Finishes query and sends it with specified optins,
        // inside of http.request takes over now
        req.end();
    });
}

async function deleteUser(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/delete-user',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Series Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk.toString();
            });

            res.on('end', () => {
                // let jsonData = JSON.parse(data);
                console.log(`Series Microservice sent: '${util.inspect(data, {colors: true})}'`);
                resolve(data);
            });
        });

        req.write(json);
        req.end();
    });
}

async function updateUserPassword(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/update-password',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Series Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk.toString();
            });

            res.on('end', () => {
                // let jsonData = JSON.parse(data);
                console.log(`Series Microservice sent: '${util.inspect(data, {colors: true})}'`);
                resolve(data);
            });
        });

        req.write(json);
        req.end();
    });
}

async function addAdmin(json){
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/add-admin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for movie info to microservice
        const req = http.request(options, (userRes) => {
            console.log(`User Microservice responded with: ${userRes.statusCode}`);
            let data = '';
            userRes.on('data', (chunk) => {
                data += chunk;
            });

            userRes.on('end', () => {
                if(data !== 'undefined'){
                    resolve(data);
                }
                else{
                    reject('undefined')
                };
                console.log(`User Microservice sent: '${util.inspect(data, {colors: true})}'`);
            });
        });
        // Writes data to query
        req.write(json);
        // Finishes query and sends it with specified optins,
        // inside of http.request takes over now
        req.end();
    });
}

async function deleteAdmin(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/delete-admin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Series Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk.toString();
            });

            res.on('end', () => {
                // let jsonData = JSON.parse(data);
                console.log(`Series Microservice sent: '${util.inspect(data, {colors: true})}'`);
                resolve(data);
            });
        });

        req.write(json);
        req.end();
    });
}

async function updateAdminPassword(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/update-password-admin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Series Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk.toString();
            });

            res.on('end', () => {
                // let jsonData = JSON.parse(data);
                console.log(`Series Microservice sent: '${util.inspect(data, {colors: true})}'`);
                resolve(data);
            });
        });

        req.write(json);
        req.end();
    });
}

async function adminLogin(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/admin-login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Series Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk.toString();
            });

            res.on('end', () => {
                // let jsonData = JSON.parse(data);
                console.log(`Series Microservice sent: '${util.inspect(data, {colors: true})}'`);
                resolve(data);
            });
        });

        req.write(json);
        req.end();
    });
}

async function getSeries(json) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'localhost',
            port: 9002,
            path: '/series',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Series Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if(data !== 'undefined'){
                    let jsonData = JSON.parse(data);
                    console.log(`Series Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                    resolve(jsonData);
                }
                else{
                    console.log("No comments");
                    reject('undefined');
                }
            });
        });

        req.write(json);
        req.end();

    });
}

async function getComments(json){
    return new Promise((resolve, reject) =>{
        let options = {
            hostname: 'localhost',
            port: 9004,
            path: '/query',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Comment Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if(data !== 'undefined'){
                    let jsonData = JSON.parse(data);
                    console.log(`Comment Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                    resolve(jsonData);
                }
                else{
                    console.log("No comments");
                    reject('undefined');
                }
            });
        });

        req.write(json);
        req.end();
    });
}

async function addComment(json){
    let options = {
        hostname: 'localhost',
        port: 9004,
        path: '/add',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(json)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Movie Microservice responded with: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if(data !== 'undefined'){
                let jsonData = JSON.parse(data);
                console.log(`Movie Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
            }
            else{
                console.log("User has no comments");
            }
        });
    });

    req.write(json);
    req.end();
}

async function viewUserComments(json){
    return new Promise((resolve, reject) =>{
        let options = {
            hostname: 'localhost',
            port: 9004,
            path: '/admin-query',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Comment Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if(data !== 'undefined'){
                    let jsonData = JSON.parse(data);
                    console.log(`Comment Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                    resolve(jsonData);
                }
                else{
                    console.log("No comments");
                    reject('undefined');
                }
            });
        });

        req.write(json);
        req.end();
    });
}

async function deleteComment(json){
    return new Promise((resolve, reject) =>{
        let options = {
            hostname: 'localhost',
            port: 9004,
            path: '/admin-delete',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Comment Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if(data !== 'undefined'){
                    let jsonData = JSON.parse(data);
                    console.log(`Comment Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                    resolve(jsonData);
                }
                else{
                    console.log("No comments");
                    reject('undefined');
                }
            });
        });

        req.write(json);
        req.end();
    });
}

async function retrieveUserInfo(json){
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/userPage',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (userRes) => {
            console.log(`User Microservice responded with: ${userRes.statusCode}`);
            let data = '';
            userRes.on('data', (chunk) => {
                data += chunk;
            });

            userRes.on('end', () => {
                console.log(data);
                if(data !== 'undefined'){
                    resolve(data);
                }
                else{
                    reject('undefined');
                }
                console.log(`User Microservice sent: '${util.inspect(data, {colors: true})}'`);
            });
        });

        req.write(json);
        req.end();
    });
}

async function getUser(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/user-search',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (userRes) => {
            console.log(`User Microservice responded with: ${userRes.statusCode}`);
            let data = '';
            userRes.on('data', (chunk) => {
                data += chunk;
            });

            userRes.on('end', () => {
                console.log(data);
                console.log(`User Microservice sent: '${util.inspect(data, {colors: true})}'`);
                resolve(data);
            });
        });

        req.write(json);
        req.end();
    });
}

async function getPopularMovies(pageNum){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9001,
            path: '/popular',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(pageNum)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (res) => {
            console.log(`User Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                let jsonData = JSON.parse(data);
                console.log(`User Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                resolve(JSON.parse(data));
            });
        });

        req.write(pageNum);
        req.end();
    });
}

async function getPopularSeries(pageNum){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9002,
            path: '/popular',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(pageNum)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (res) => {
            console.log(`User Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                let jsonData = JSON.parse(data);
                console.log(`User Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                resolve(JSON.parse(data));
            });
        });

        req.write(pageNum);
        req.end();
    });
}

async function follow(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/follow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (res) => {
            console.log(`User Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                let jsonData = JSON.parse(data);
                console.log(`User Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                resolve(JSON.parse(data));
            });
        });

        req.write(json);
        req.end();
    });
}

async function followCheck(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/follow-check',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (res) => {
            console.log(`User Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                let jsonData = JSON.parse(data);
                console.log(`User Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                resolve(JSON.parse(data));
            });
        });

        req.write(json);
        req.end();
    });
}

async function unfollow(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/unfollow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (res) => {
            console.log(`User Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                let jsonData = JSON.parse(data);
                console.log(`User Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
                resolve(JSON.parse(data));
            });
        });

        req.write(json);
        req.end();
    });
}

async function notify(json){
    return new Promise((resolve) => {
        let options = {
            hostname: 'localhost',
            port: 9003,
            path: '/notify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(json)
            }
        };

        // Creates HTTP request for user info to microservice
        const req = http.request(options, (res) => {
            console.log(`User Microservice responded with: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                let review = JSON.parse(json);
                let jsonData = JSON.parse(data);
                console.log(`User Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);

                let message = {
                    from: 'filminder@filminder.com',
                    to: '',
                    subject: `${review.username} just posted a new review!`,
                    text: `${review.name}, Rating: ${review.rating}/10\nReview: ${review.comment}`,
                }

                for(email of jsonData){
                    message.to = email.email;
                    console.log(message);
                    transporter.sendMail(message, (error, info) => {
                        if(error)
                            console.log(`Error sending email: ${error}`);
                        else
                            console.log(`Email sent, code = ${info.response}`);
                    });
                }

                resolve(jsonData);
            });
        });

        req.write(json);
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
            requestMovieInfo(data, res)
            .then(ret => {
                console.log(JSON.stringify(ret));
                res.write(JSON.stringify(ret));
                res.end();
                console.log("Sent data");
            })
            .catch(e => console.error(e));
        })
    }
    else if(req.method === 'POST' && req.url === '/movie-popular'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            getPopularMovies(data)
            .then(result => {
                res.write(JSON.stringify(result));
                res.end();
            })
        });
    }
    else if(req.method === 'POST' && req.url === "/login"){
        // Call login service
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            console.log(`LOGIN DETAILS: ${data}`);
            loginCheck(data)
            .then(result => {
                res.write(result.toString());
                res.end();
            })
            // .then(ret => console.log(ret))
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && (req.url === "/signup" || req.url === '/admin-add-user')){
        // Call login service
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            signupUser(data)
            .then(result => {
                res.write(result.toString());
                res.end();
            })
            // .then(ret => console.log(ret))
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/userPage'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            retrieveUserInfo(data)
            .then(ret => {
                res.write(ret);
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/user-search'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            getUser(data)
            .then(ret => {
                res.write(ret);
                res.end();
            })
        });
    }
    else if(req.method === 'POST' && req.url === "/series-search"){
        // Call series service
        let data = '';
        req.on('data', chunk => data += chunk.toString());

        req.on('end', () => {
            getSeries(data, res)
            .then(ret => {
                console.log(JSON.stringify(ret));
                res.write(JSON.stringify(ret));
                res.end();
                console.log("Sent data");
            })
            .catch(e => console.error(e));
        });


    }
    else if(req.method === 'POST' && req.url === '/series-popular'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            getPopularSeries(data)
            .then(result => {
                res.write(JSON.stringify(result));
                res.end();
            })
        });
    }
    else if(req.method === 'POST' && req.url === "/actor-search"){
        // call actor service
        let data = '';
        req.on('data', chunk => data += chunk.toString());

        req.on('end', () => {
            requestActorInfo(data, res)
            .then(ret => {
                console.log(JSON.stringify(ret));
                res.write(JSON.stringify(ret));
                res.end();
                console.log("Sent data");
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/comment-query'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            getComments(data)
            .then(result => {
                res.write(JSON.stringify(result));
                res.end();
            })
            // .then(ret => console.log(ret))
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/comment-add'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            addComment(data)
            .then(() => {
                res.write('Added comment');
                res.end();
            })
            // .then(ret => console.log(ret))
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/admin-delete-user'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            deleteUser(data)
            .then(ret => {
                res.write(ret);
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/admin-update-password'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            updateUserPassword(data)
            .then(ret => {
                res.write(ret);
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/admin-add-admin'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            addAdmin(data)
            .then(ret => {
                res.write(ret);
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/admin-remove-admin'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            deleteAdmin(data)
            .then(ret => {
                res.write(ret);
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/admin-update-admin-password'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            updateAdminPassword(data)
            .then(ret => {
                res.write(ret);
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/admin-view-comments'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            viewUserComments(data)
            .then(ret => {
                res.write(JSON.stringify(ret));
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/admin-delete-comment'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            deleteComment(data)
            .then(ret => {
                res.write(JSON.stringify(ret));
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/admin-login'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            adminLogin(data)
            .then(ret => {
                res.write(ret);
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/follow'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            follow(data)
            .then(ret => {
                res.write(JSON.stringify(ret));
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/follow-check'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            followCheck(data)
            .then(ret => {
                res.write(JSON.stringify(ret));
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/unfollow'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            unfollow(data)
            .then(ret => {
                res.write(JSON.stringify(ret));
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else if(req.method === 'POST' && req.url === '/notify'){
        let data = '';
        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            notify(data)
            .then(ret => {
                if(typeof ret !== 'undefined')
                    res.write('accepted');
                else res.write('rejected');
                res.end();
            })
            .catch(e => console.error(e));
        });
    }
    else{
        console.log(`Request for ${req.url} received.`);

        // Serve index.html for root URL
        if (req.url === '/') {
            let indexPath = path.join(__dirname + "/FilminderWebsite/", 'Website.html');
            send(indexPath, res);
        }
        else if(req.url.startsWith('/admin')){
            let indexPath = path.join(__dirname + "/FilminderWebsite/AdminLogin.html");
            send(indexPath, res);
        }
        else{
            let Path = path.join(__dirname + "/FilminderWebsite/", req.url);
            send(Path, res);
        }
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});