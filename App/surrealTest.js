const Surreal = require('surrealdb.js')

let db = new Surreal.default('http://localhost:8000/rpc');

async function dbQuery(title){
    try{
        await db.signin({
            user:'root',
            pass:'root',
        });

        await db.use('test', 'test');

        let users = await db.query(`SELECT * FROM movie WHERE title CONTAINS '${title}'`);
        return users[0].result[0];
        // console.log(users[0].result[0]['title']);

        // users.forEach(tuple => console.log(tuple));

        // let record = await db.create('users:NordVPN', {
        //     email:'NordVPN@gmail.com',
        //     id:'NordVPN',
        //     username:'Nord',
        // });

        // users = await db.query('SELECT * FROM users');

        // users.forEach(tuple => console.log(tuple));
    }
    catch(e){
        console.error('ERROR', e)
    }
}

async function getImage(id){
    let url = 'https://image.tmdb.org/t/p/original/';

    let imagePath = `https://api.themoviedb.org/3/movie/${id}/images?api_key=fd466f23c2618acf3e52defb9c3869ba`;

    // console.log(imagePath);

    return await fetch(imagePath)
    .then(response => response.text())
    .then(result => {
        let json = JSON.parse(result);
        url += json.posters[0].file_path;
        return url;
        // console.log(url);
    })
    .catch(e => console.error(e));
}

async function dbAdd(json){
    try{
        await db.signin({
            user:'root',
            pass:'root'
        });

        await db.use('test', 'test');

        let res = await db.create(`movie:${json['imdbID']}`, {
            actors: json["Actors"],
            description: json['Plot'],
            directors: json['Director'],
            genre: json['Genre'],
            id: json['imdbID'],
            language: json['Language'],
            rating: json['imdbRating'],
            releaseDate: json['Released'],
            runtime: json['Runtime'],
            title: json['Title'],
            writers: json['Writer'],
            image: json['image'],
        });

        return res;
    }
    catch(e){
        console.error('ERROR', e);
    }
}

function main(){
    let title = 'City of God';
    dbQuery(title)
    .then((result) => {
        if(typeof result === 'undefined'){
            console.log("Entry not in database");
            fetch(`http://www.omdbapi.com/?apikey=1cb42be6&t=${title.replace(' ', '+')}`)
            .then(response => response.text())
            .then(async (text) => {
                let data = JSON.parse(text);
                // console.log(data['imdbID']);
                // console.log(await getImage(data['imdbID']));
                data['image'] = await getImage(data['imdbID']);
                // console.log(data);
                dbAdd(data)
                // .then(() => console.log(`Added ${title} to DB`))
                .catch(e => console.error(e));
                // console.log(data);
            })
            .catch(e => console.error(e));
        }
        else{
            console.log(result);
            console.log(result['image']);
        }
    })
    .catch(e => console.error(e));
}

main();
