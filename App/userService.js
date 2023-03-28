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

        let str = `SELECT * FROM user WHERE email='${json['email']}'`;
        let returned = await db.query(str);
        

        if(returned[0].result.length == 0){
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

async function deleteUser(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let substr = `username='${json.username}'`;
        if(json.username === ''){
            substr = `email='${json.email}'`;
        }

        let str = `DELETE FROM user WHERE ${substr}`;

        let res = await db.query(str);

        return res[0].result;

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function updateUserPassword(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let substr = `username='${json.username}'`;
        if(json.username === ''){
            substr = `email='${json.email}'`;
        }

        let str = `UPDATE user SET password=crypto::sha512('${json.password}') WHERE ${substr}`;
        console.log(str);

        let res = await db.query(str);

        return res[0].result[0];

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function addAdmin(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let str = await db.query(`SELECT * FROM crypto::sha512('${json.password}')`);

        // console.log(str);

        let res = await db.create('admin', {
            email: json.email,
            username: json.username,
            password: str[0].result[0],
        });

        return res;

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function deleteAdmin(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let substr = `username='${json.username}'`;
        if(json.username === ''){
            substr = `email='${json.email}'`;
        }

        let str = `DELETE FROM admin WHERE ${substr}`;

        let res = await db.query(str);

        return res[0].result;

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function updateAdminPassword(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let substr = `username='${json.username}'`;
        if(json.username === ''){
            substr = `email='${json.email}'`;
        }

        let str = `UPDATE admin SET password=crypto::sha512('${json.password}') WHERE ${substr}`;
        console.log(str);

        let res = await db.query(str);

        return res[0].result[0];

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function getAdmin(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let str = `SELECT * FROM admin WHERE username='${json.username}' AND password=crypto::sha512('${json.password}')`;
        console.log(str);

        let res = await db.query(str);

        return res[0].result[0];

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
        else if(req.method === 'POST' && req.url === '/delete-user'){
            deleteUser(json)
            .then(ret => {
                if(ret.length === 0){
                    res.write('accepted');
                }
                else{
                    res.write(JSON.stringify(ret));
                }
                res.end();
            })
        }
        else if(req.method === 'POST' && req.url === '/update-password'){
            updateUserPassword(json)
            .then(ret => {
                if(typeof ret !== 'undefined')
                    res.write('accepted');
                else 
                    res.write('rejected');
                res.end();
            })
        }
        else if(req.method === 'POST' && req.url === '/add-admin'){
            addAdmin(json)
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
        else if(req.method === 'POST' && req.url === '/delete-admin'){
            deleteAdmin(json)
            .then(ret => {
                if(ret.length === 0){
                    res.write('accepted');
                }
                else{
                    res.write(JSON.stringify(ret));
                }
                res.end();
            })
        }
        else if(req.method === 'POST' && req.url === '/update-password-admin'){
            updateAdminPassword(json)
            .then(ret => {
                if(typeof ret !== 'undefined')
                    res.write('accepted');
                else 
                    res.write('rejected');
                res.end();
            })
        }
        else if(req.method === 'POST' && req.url === '/admin-login'){
            getAdmin(json)
            .then(ret => {
                console.log(ret);
                let status = {status: 'accepted'};
                if(typeof ret === 'undefined'){
                    status.status = 'rejected';
                }
                res.write(JSON.stringify(status));
                res.end();
            })
            .catch(e => console.error(e));
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Microservice running at http://${hostname}:${port}`);
});