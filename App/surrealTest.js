const Surreal = require('surrealdb.js')

let db = new Surreal.default('http://localhost:8000/rpc');

async function main(){
    try{
        await db.signin({
            user:'root',
            pass:'root',
        });

        await db.use('test', 'test');

        let users = await db.query('SELECT * FROM users');

        users.forEach()

        console.log(users[0].result);

        let record = await db.create('users:NordVPN', {
            email:'NordVPN@gmail.com',
            id:'NordVPN',
            username:'Nord',
        });

    }
    catch(e){
        console.error('ERROR', e)
    }
}

main();