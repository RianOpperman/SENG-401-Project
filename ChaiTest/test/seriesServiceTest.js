const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const chaiHttp = require('chai-http');
const expect = chai.expect;
const request = require("request");
chai.use(chaiHttp);
const http = require('http');
const Surreal = require('../../App/node_modules/surrealdb.js');


const seriesService = require('../../App/seriesService.js');
let db = new Surreal.default('http://localhost:8002/rpc');



describe('Series: PrepareQueryTest', () => {
	it('S1: PrepareQueryTestWithNameSeries', async () => {
		let input = {
			'series-name': 'Game of Thrones',
		};
		const expected = 'http://www.omdbapi.com/?apikey=1cb42be6&Type=series&t=Game+of Thrones&y=undefined';
        
		let result = seriesService.prepareQuery(input);
		//console.log(result);

		expect(result).to.equal(expected);
	});

	it('S2: PrepareQueryTestWithNameAndYearSeries', async () => {
		let input = {
			'series-name': 'Game of Thrones',
            'series-year': '2011'
		};
		const expected = 'http://www.omdbapi.com/?apikey=1cb42be6&Type=series&t=Game+of Thrones&y=2011';
        expect(seriesService.prepareQuery(input)).to.equal(expected);
	});

});



describe('Series: getImageTest', () => {

	it('S3: getImageValidReturn', async () => {
		const name = 'Game of Thrones';
		expect(await seriesService.getImage(name)).to.be.a('string');
	})

	it('S4: getImageWithValidSeriesName', async () => {
		const expected = 'https://image.tmdb.org/t/p/original/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg';
		let result = await seriesService.getImage("Game of Thrones")
		//let result = await seriesService.getImage("Invalid")
		//console.log(result);
        expect(result).to.equal(expected);
	});

	it('S5: getImageWithInvalidSeriesName', async () => {
		let result = undefined;
		result = await seriesService.getImage("Invalid")
		
		//This test passes as it should be but it print TypeError of can not read undefined in the console
		//expect(await seriesService.getImage("Invalid")).to.be.undefined;

		expect(result).to.be.undefined;
	});


});

describe('Series: dbQueryTest', () => {

	it('S6: dbQueryReturnValid', () => {
		let json = {
			'series-name': 'Game of Thrones'
		};
		seriesService.dbQuery(json).then((result) => {
			expect(result).to.be.an('object');
		});
	});

	it('S7: dbQueryReturnInvalid', () => {

		let str = '';
		str = "DELETE * FROM movie WHERE title CONTAINS 'Game of Thrones']}"
		db.query(str)

		let json = {
			'series-name': 'Game of Thrones'
		};
		seriesService.dbQuery(json).then((result) => {
			expect(result).to.equal('undefined');
		});
	});

});


describe('Series: dbAddTest', () => {

	let str = '';
	str = "DELETE * FROM movie WHERE title CONTAINS 'Game of Thrones'}"
	db.query(str)

	it('S8: DatabaseAddData', () => {
		let json = {
			actors: 'Peter Dinklage, Lena Headey, Emilia Clarke',
            description: 'Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for thousands of years.',
            directors: 'N/A',
            episode: '20',
            genre: 'Action, Adventure, Drama',
            id: 'tt0944947',
            language: 'English',
            rating: '9.3',
            releaseDate: '17 Apr 2011',
            runtime: '57 min',
            season: '8',
            title: 'Game of Thrones',
            writers: 'David Benioff, D.B. Weiss, George R.R. Martin',
            image: 'https://image.tmdb.org/t/p/original/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg'
		};
		seriesService.dbAdd(json).then(result => {
			expect(result).to.be.an('array');
		});
	});

	db.query(str)

	it('S9: DatabaseAddDataIdMatch', () => {
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
        seriesService.dbAdd(json).then(result => {
            expect(result[0].id).to.equal('imdbID:tt0073195');
        });
    });

});



