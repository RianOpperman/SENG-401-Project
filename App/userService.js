const http = require('https');
const fs = require('fs');
const Surreal = require('surrealdb.js');

let db = new Surreal.default('http://localhost:8003/rpc');

const hostname = 'localhost';
const port = 9003;
const options = {
    key: fs.readFileSync('ssl/user.key'),
    cert: fs.readFileSync('ssl/user.cert')
};

async function dbQuery(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');
        
        // let str = `SELECT * FROM user WHERE email='${json['email']}' AND password='${json['password']}'`;
        let str = `SELECT * FROM user WHERE email=$email AND password=$password`;
        let vars = {
            email: json.email,
            password: json.password
        }
        // console.log(str);

        let res = await db.query(str, vars);
        // let res = await db.query(`SELECT * FROM movie`);

        // console.log(res[0].result[0]);
        // console.log(res);
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

        let res = await db.create(`user`, {
            email: json['email'],
            password: json.password,
            username: json['username'],
        });
            
        console.log(res);
        return res;
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
        // let vars = {
        //     id: json.id
        // };

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

        // let str = `SELECT username, id FROM user WHERE username='${json.username}'`;
        let str = `SELECT username, id FROM user WHERE username=$username`;
        let vars = {
            username: json.username
        };

        // console.log(str);
        console.log(str);
        console.log(vars);
        let res = await db.query(str, vars);

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

        let substr = `username=$username`;
        let vars = {username: json.username};
        if(json.username === ''){
            substr = `email=$email`;
            vars = {email: json.email};
        }

        let str = `DELETE FROM user WHERE ${substr}`;

        let res = await db.query(str, vars);

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

        let substr = `username=$username`;
        let vars = {usernme: json.username};
        if(json.username === ''){
            substr = `email='${json.email}'`;
            vars = {email: json.email};
        }

        let str = `UPDATE user SET password=$password WHERE ${substr}`;
        vars.password = json.password;

        console.log(str);

        let res = await db.query(str, vars);

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

        let res = await db.create('admin', {
            email: json.email,
            username: json.username,
            password: json.password,
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

        let substr = `username=$username`;
        let vars = {username: json.username};
        if(json.username === ''){
            substr = `email=$email`;
            vars = {email: json.email};
        }

        let str = `DELETE FROM admin WHERE ${substr}`;

        let res = await db.query(str, vars);

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

        let substr = `username=$username`;
        let vars = {username: json.username};
        if(json.username === ''){
            substr = `email=$email`;
            vars = {email: json.email};
        }

        let str = `UPDATE admin SET password=$password WHERE ${substr}`;
        vars.password = json.password;

        let res = await db.query(str, vars);

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

        let str = `SELECT * FROM admin WHERE username=$username AND password=$password`;
        let vars = {
            username: json.username,
            password: json.password
        }

        let res = await db.query(str, vars);

        return res[0].result[0];

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function follow(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.create('follow', {
            reviewer: json.reviewer,
            follower: json.follower,
        });

        return res;

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function followCheck(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.query(`SELECT * FROM follow WHERE reviewer=$reviewer AND follower=$follower`, {
            reviewer: json.reviewer,
            follower: json.follower
        });

        return res[0].result[0];

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function unfollow(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.query(`DELETE FROM follow WHERE follower=$follower AND reviewer=$reviewer`, {
            reviewer: json.reviewer,
            follower: json.follower
        });

        return res;

    }
    catch(e){
        console.error('ERROR', e);
    }
}

async function notify(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let str = `SELECT email FROM (SELECT *, (SELECT * FROM follow) as follower FROM user SPLIT follower) WHERE username = follower.follower AND follower.reviewer=$username`;
        let vars = {username: json.username};
        console.log(str);
        console.log(vars);

        let res = await db.query(str, vars);

        return res[0].result;
    }
    catch(e){
        console.error('ERROR', e);
    }
}

const server = http.createServer(options, (req, res) => {
    let data = '';

    req.on('data', chunk => data += chunk.toString());
    req.on('end', () => {
        console.log(data);
        let json ={};
        try{
            json = JSON.parse(data);
        }
        catch(e){
            json = {};
            res.write('undefined');
            res.end();
            return;
        }
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
        else if(req.method === 'POST' && req.url === '/follow'){
            follow(json)
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
        else if(req.method === 'POST' && req.url === '/follow-check'){
            followCheck(json)
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
        else if(req.method === 'POST' && req.url === '/unfollow'){
            unfollow(json)
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
        else if(req.method === 'POST' && req.url === '/notify'){
            notify(json)
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