const https = require('https');
const fs = require('fs');
const path = require('path');
const util = require('util');
const nodemailer =require('nodemailer');
const crypto = require('crypto');

const hostname = 'localhost';
const port = 9000;
const SSLOptions = {
    key: fs.readFileSync('ssl/app.key'),
    cert: fs.readFileSync('ssl/app.cert')
};
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 2500,
    secure: false,
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

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

function getOptions(port, path, data){
    return {
        hostname: 'localhost',
        port: port,
        path: path,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        },
        ca: [fs.readFileSync('ssl/movie.cert')]
        // key: SSLOptions.key,
        // cert: SSLOptions.cert
    }
}

// Sends movie request to movie microservice
async function requestMovieInfo(data, res){
    return new Promise((resolve) => {
        let options = getOptions(9001, '/', data);
        // options.agent = new https.Agent(options);

        // Creates HTTP request for movie info to microservice
        const req = https.request(options, (MovieRes) => {
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
                    resolve("undefined");
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
    return new Promise((resolve) => {
        let options = getOptions(9005, '/', data);

        // Creates HTTP request for movie info to microservice
        const req = https.request(options, (ActorRes) => {
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
                    resolve("undefined");
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
        try{
            json = JSON.parse(json);
            json.password = crypto.createHash('sha512')
                            .update(json.password)
                            .digest('hex');
            json = JSON.stringify(json);
            let options = getOptions(9003, '/login', json);

            // Creates HTTP request for user info to microservice
            const req = https.request(options, (userRes) => {
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
        }
        catch(e){
            resolve({status: 'rejected'});
        }
    });
}

async function signupUser(json){
    return new Promise((resolve) => {
        try{
            json = JSON.parse(json);
            json.password = crypto.createHash('sha512')
                            .update(json.password)
                            .digest('hex');
            json = JSON.stringify(json);
            let options = getOptions(9003, '/signup', json);

            // Creates HTTP request for movie info to microservice
            const req = https.request(options, (userRes) => {
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
                        resolve('undefined');
                    };
                    console.log(`User Microservice sent: '${util.inspect(data, {colors: true})}'`);
                });
            });
            // Writes data to query
            req.write(json);
            // Finishes query and sends it with specified optins,
            // inside of http.request takes over now
            req.end();
        }
        catch(e){
            resolve('undefined');
        }
    });
}

async function deleteUser(json){
    return new Promise((resolve) => {
        let options = getOptions(9003, '/delete-user', json);

        const req = https.request(options, (res) => {
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
        json = JSON.parse(json);
        json.password = crypto.createHash('sha512')
                        .update(json.password)
                        .digest('hex');
        json = JSON.stringify(json);
        let options = getOptions(9003, '/update-password', json);

        const req = https.request(options, (res) => {
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
        json = JSON.parse(json);
        json.password = crypto.createHash('sha512')
                        .update(json.password)
                        .digest('hex');
        json = JSON.stringify(json);
        let options = getOptions(9003, '/add-admin', json);

        // Creates HTTP request for movie info to microservice
        const req = https.request(options, (userRes) => {
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
        let options = getOptions(9003, '/delete-admin', json);

        const req = https.request(options, (res) => {
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
        json = JSON.parse(json);
        json.password = crypto.createHash('sha512')
                        .update(json.password)
                        .digest('hex');
        json = JSON.stringify(json);
        let options = getOptions(9003, '/update-password-admin', json);

        const req = https.request(options, (res) => {
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
        json = JSON.parse(json);
        json.password = crypto.createHash('sha512')
                        .update(json.password)
                        .digest('hex');
        json = JSON.stringify(json);
        let options = getOptions(9003, '/admin-login', json);

        const req = https.request(options, (res) => {
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
    return new Promise((resolve) => {
        let options = getOptions(9002, '/series', json);

        const req = https.request(options, (res) => {
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
                    resolve('undefined');
                }
            });
        });

        req.write(json);
        req.end();

    });
}

async function getComments(json){
    return new Promise((resolve, reject) =>{
        let options = getOptions(9004, '/query', json);

        const req = https.request(options, (res) => {
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
    let options = getOptions(9004, '/add', json);

    const req = https.request(options, (res) => {
        console.log(`Comment Microservice responded with: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if(data !== 'undefined'){
                let jsonData = JSON.parse(data);
                console.log(`Comment Microservice sent: '${util.inspect(jsonData, {colors: true})}'`);
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
        let options = getOptions(9004, '/admin-query', json);

        const req = https.request(options, (res) => {
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
        let options = getOptions(9004, '/admin-delete', json);

        const req = https.request(options, (res) => {
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
        let options = getOptions(9003, '/userPage', json);

        // Creates https request for user info to microservice
        const req = https.request(options, (userRes) => {
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
        let options = getOptions(9003, '/user-search', json);

        // Creates https request for user info to microservice
        const req = https.request(options, (userRes) => {
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
        let options = getOptions(9001, '/popular', pageNum);

        // Creates HTTP request for user info to microservice
        const req = https.request(options, (res) => {
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
        let options = getOptions(9002, '/popular', pageNum);

        // Creates HTTP request for user info to microservice
        const req = https.request(options, (res) => {
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
        let options = getOptions(9003, '/follow', json);

        // Creates HTTP request for user info to microservice
        const req = https.request(options, (res) => {
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
        let options = getOptions(9003, '/follow-check', json);

        // Creates HTTP request for user info to microservice
        const req = https.request(options, (res) => {
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
        let options = getOptions(9003, '/unfollow', json);

        // Creates HTTP request for user info to microservice
        const req = https.request(options, (res) => {
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
        let options = getOptions(9003, '/notify', json);

        // Creates HTTP request for user info to microservice
        const req = https.request(options, (res) => {
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
                    text: `${review.name}\nRating: ${review.rating}/10\nReview: ${review.comment}`,
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


function handleRequests(fn, data, res) {
    fn(data)
        .then((ret) => {
            res.write(ret);
            res.end();
        })
        .catch(e => console.error(e));
}




const server = https.createServer(SSLOptions, (req, res) => {
    if (req.method !== "POST") {}

    let data = '';
    req.on('data', chunk => data += chunk.toString());
    req.on('end', ()=>{
        switch(req.url) {
            case '/movie-search':
                console.log('Requesting movie info');
                requestMovieInfo(data, res)
                .then(ret => {
                    if(ret === 'undefined')
                        res.write('undefined');
                    else
                        res.write(JSON.stringify(ret));
                    res.end();
                    console.log("Sent data");
                })
                .catch(e => console.error(e));
                break;
                
            case '/movie-popular':
                getPopularMovies(data)
                .then(result => {
                    res.write(JSON.stringify(result));
                    res.end();
                })
                break;

            case '/login':
                console.log(`LOGIN DETAILS: ${data}`);
                loginCheck(data)
                .then(result => {
                    res.write(result.toString());
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/signup':
            case '/admin-add-user':
                signupUser(data)
                .then(result => {
                    res.write(result.toString());
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/userPage':
                retrieveUserInfo(data)
                .then(ret => {
                    res.write(ret);
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/user-search':
                getUser(data)
                .then(ret => {
                    res.write(ret);
                    res.end();
                })
                break;

            case '/series-search':
                getSeries(data, res)
                .then(ret => {
                    if(ret === 'undefined') res.write('undefined');
                    else {
                        res.write(JSON.stringify(ret));
                    }
                    res.end();
                })
                .catch(e => console.error(e));
                break;

            case '/series-popular':
                getPopularSeries(data)
                .then(result => {
                    res.write(JSON.stringify(result));
                    res.end();
                })
                break;
            
            case '/actor-search':
                requestActorInfo(data, res)
                .then(ret => {
                    console.log(JSON.stringify(ret));
                    if (ret !== 'undefined') res.write(JSON.stringify(ret));
                    else {res.write(ret);}
                    res.end();
                    console.log("Sent data");
                })
                .catch(e => console.error(e));
                break;

            case '/comment-query':
                getComments(data)
                .then(result => {
                    res.write(JSON.stringify(result));
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/comment-add':
                addComment(data)
                .then(() => {
                    res.write('Added comment');
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/admin-delete-user':
                handleRequests(deleteUser, data, res);
                break;

            case '/admin-update-password':
                handleRequests(updateUserPassword, data, res);
                break;
            
            case '/admin-add-admin':
                handleRequests(addAdmin, data, res);
                break;

            case '/admin-remove-admin':
                handleRequests(deleteAdmin, data, res);
                break;

            case '/admin-update-admin-password':
                handleRequests(updateAdminPassword, data, res);
                break;
            
            case '/admin-view-comments':
                viewUserComments(data)
                .then(ret => {
                    res.write(JSON.stringify(ret));
                    res.end();
                })
                .catch(e => console.error(e));
                break;

            case '/admin-delete-comment':
                deleteComment(data)
                .then(ret => {
                    res.write(JSON.stringify(ret));
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/admin-login':
                handleRequests(adminLogin, data, res);
                break;
            
            case '/follow':
                follow(data)
                .then(ret => {
                    res.write(JSON.stringify(ret));
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/follow-check':
                followCheck(data)
                .then(ret => {
                    res.write(JSON.stringify(ret));
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/unfollow':
                unfollow(data)
                .then(ret => {
                    res.write(JSON.stringify(ret));
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            case '/notify':
                notify(data)
                .then(ret => {
                    if(typeof ret !== 'undefined')
                        res.write('accepted');
                    else res.write('rejected');
                    res.end();
                })
                .catch(e => console.error(e));
                break;
            
            default:
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


    

});


server.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port}/`);
});