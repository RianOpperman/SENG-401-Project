const http = require('http');
const fs = require('fs');
const path = require('path');
const Surreal = require('surrealdb.js');

let db = new Surreal.default('http://localhost:8003/rpc');

const hostname = 'localhost';
const port = 9003;

async function dbQuery(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');
        
        let str = `SELECT * FROM user WHERE email='${json['email']}' AND password=crypto::sha512('${json['password']}')`;
        // console.log(str);

        let res = await db.query(str);
        // let res = await db.query(`SELECT * FROM movie`);

        // console.log(res[0].result[0]);
        return res[0].result[0];
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

        let emailStr = `SELECT * FROM user WHERE email='${json['email']}'`;
        let usersEmailReturned = await db.query(emailStr);
        
        let usernameStr = `SELECT * FROM user WHERE username='${json['username']}'`;
        let usersUsernameReturned = await db.query(usernameStr);

        if((usersEmailReturned[0].result.length == 0) && (usersUsernameReturned[0].result.length == 0)){
            // if there are no users with this this username or email then we can create a new account with these credentials
            console.log("new account");

            let ps = await db.query(`SELECT * FROM crypto::sha512('${json['password']}')`);
            console.log(ps[0].result[0]);


            let res = await db.create(`user`, {
                email: json['email'],
                password: ps[0].result[0],
                username: json['username'],
            });
            

            return res;
        }
        console.log("already in use");
        return undefined;
    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function getUserInfo(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let str = `SELECT username, id FROM user:${json.id}`;

        // console.log(str);

        let res = await db.query(str);

        return res[0].result[0];

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function getUser(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let str = `SELECT username, id FROM user WHERE username='${json.username}'`;

        // console.log(str);

        let res = await db.query(str);

        return res[0].result;

    }
    catch(e){
        console.error('ERROR', e);
    }
}

const server = http.createServer((req, res) => {
    let data = '';

    req.on('data', chunk => data += chunk.toString());
    req.on('end', () => {
        let json = JSON.parse(data);
        console.log(json);

        // If data was sent via POST to the url /
        if(req.method === 'POST' && req.url === '/login'){
            dbQuery(json)
            .then(ret => {
                console.log(ret);
                if(typeof ret !== 'undefined'){
                    res.write(JSON.stringify(ret));
                }
                else {
                    res.write('undefined');
                }
                res.end();
            });
        }
        else if(req.method === 'POST' && req.url === '/signup'){
            dbAdd(json)
            .then(ret => {
                console.log(ret);
                if(typeof ret !== 'undefined'){
                    res.write(JSON.stringify(ret));
                }
                else{
                    console.log("rejected");
                    res.write('undefined');
                }
                res.end();
            });
        }
        else if(req.method === 'POST' && req.url === '/userPage'){
            getUserInfo(json)
            .then(ret => {
                console.log(ret);
                if(typeof ret !== 'undefined'){
                    res.write(JSON.stringify(ret));
                }
                else{
                    res.write('undefined');
                }
                res.end();
            })
            .catch(e => console.error(e));
        }
        else if(req.method === 'POST' && req.url === '/user-search'){
            getUser(json)
            .then(ret => {
                console.log(ret);
                res.write(JSON.stringify(ret));
                res.end();
            })
            .catch(e => console.error(e));
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Microservice running at http://${hostname}:${port}`);
});