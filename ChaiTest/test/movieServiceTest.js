const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const chaiHttp = require('chai-http');
const expect = chai.expect;
const request = require("request");
chai.use(chaiHttp);
const http = require('http');
const Surreal = require('../../App/node_modules/surrealdb.js');


const movieService = require('../../App/movieService.js');
let db = new Surreal.default('http://localhost:8000/rpc');



describe('Movie: PrepareQueryTest', () => {
	it('M1: PrepareQueryTestWithName', async () => {
		let input = {
			'movie-name': 'The Avengers',
		};
		const expected = 'http://www.omdbapi.com/?apikey=1cb42be6&t=The+Avengers&y=undefined';
        expect(movieService.prepareQuery(input)).to.equal(expected);
	});

	it('M2: PrepareQueryTestWithNameAndYear', async () => {
		let input = {
			'movie-name': 'The Avengers',
			'movie-year': '2012'
		};
		const expected = 'http://www.omdbapi.com/?apikey=1cb42be6&t=The+Avengers&y=2012';
        expect(movieService.prepareQuery(input)).to.equal(expected);
	});

	// it('APIQuerywithId', async () => {
    //     let input = {
    //         'movie-id': 'tt0133093'
    //     };
	// 	console.log(movieService.prepareQuery(input));

	// 	const expected = 'http://www.omdbapi.com/?apikey=1cb42be6&i=tt0133093';
    //     expect(movieService.prepareQuery(input)).to.equal(expected);
	// 	console.log(movieService.prepareQuery(input));
	// });
});



describe('Movie: getImageTest', () => {

	it('M3: getImageWithValidMoiveId', async () => {
		const expected = 'https://image.tmdb.org/t/p/original//pEoqbqtLc4CcwDUDqxmEDSWpWTZ.jpg';
		let result = await movieService.getImage("tt0133093")
		//let result = await movieService.getImage("Invalid")
		//console.log(result);
        expect(result).to.equal(expected);
	});

	it('M4: getImageWithInvalidMoiveId', async () => {
		let result = undefined;
		result = await movieService.getImage("Invalid")
		
		//This test passes as it should be but it print TypeError of can not read undefined in the console
		//expect(await movieService.getImage("Invalid")).to.be.undefined;

		expect(result).to.be.undefined;
	});

	it('M5: getImageValidReturn', async () => {
		const name = 'tt0133093';
		expect(await movieService.getImage(name)).to.be.a('string');
	})

});

describe('Movie: dbQueryTest', () => {

	it('M6: dbQueryReturnValid', () => {
		let json = {
			'movie-name': 'The Matrix',
			'movie-year': 1999
		};
		movieService.dbQuery(json).then((result) => {
			expect(result).to.be.an('object');
		});
	});

	it('M7: dbQueryReturnInvalid', () => {

		let str = '';
		str = "DELETE * FROM movie WHERE title CONTAINS 'Radhe']}"
		db.query(str)

		let json = {
			'movie-name': 'Radhe',
			'movie-year': 2021
		};
		movieService.dbQuery(json).then((result) => {
			expect(result).to.equal('undefined');
		});
	});

});


describe('Movie: dbAddTest', () => {

	let str = '';
	str = "DELETE * FROM movie WHERE title CONTAINS 'Jaws'}"
	db.query(str)

	it('M8: DatabaseAddData', () => {
		let json = {
			'imdbID': 'tt0073195',
			'Actors': 'Roy Scheider, Robert Shaw, Richard Dreyfuss, Lorraine Gary',
			'Plot': 'When a gigantic great white shark begins to menace the small island community of Amity, a police chief, a marine scientist and grizzled fisherman set out to stop it.',
			'Director': 'Steven Spielberg',
			'Genre': 'Adventure, Horror, Thriller',
			'Language': 'English',
			'imdbRating': '8.1',
			'Released': '20 Jun 1975',
			'Runtime': '124 min',
			'Title': 'Jaws',
			'Writer': 'Peter Benchley (screenplay by), Carl Gottlieb (screenplay by), Peter Benchley (based on the novel by)',
			'image': 'https://image.tmdb.org/t/p/original//l1yltvzILaZcx2jYvc5sEMkM7Eh.jpg'
		};
		movieService.dbAdd(json).then(result => {
			expect(result).to.be.an('array');
		});
	});

	db.query(str)

	it('M9: DatabaseAddDataIdMatch', () => {
        let json = {
            'imdbID': 'tt0073195',
            'Actors': 'Roy Scheider, Robert Shaw, Richard Dreyfuss, Lorraine Gary',
            'Plot': 'When a gigantic great white shark begins to menace the small island community of Amity, a police chief, a marine scientist and grizzled fisherman set out to stop it.',
            'Director': 'Steven Spielberg',
            'Genre': 'Adventure, Horror, Thriller',
            'Language': 'English',
            'imdbRating': '8.1',
            'Released': '20 Jun 1975',
            'Runtime': '124 min',
            'Title': 'Jaws',
            'Writer': 'Peter Benchley (screenplay by), Carl Gottlieb (screenplay by), Peter Benchley (based on the novel by)',
            'image': 'https://image.tmdb.org/t/p/original//l1yltvzILaZcx2jYvc5sEMkM7Eh.jpg'
        };
        movieService.dbAdd(json).then(result => {
            expect(result[0].id).to.equal('movie:tt0073195');
        });
    });
});



