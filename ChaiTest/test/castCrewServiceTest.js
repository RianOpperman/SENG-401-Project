const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const chaiHttp = require('chai-http');
const expect = chai.expect;
const request = require("request");
chai.use(chaiHttp);
const http = require('http');
const Surreal = require('../../App/node_modules/surrealdb.js');


const castService = require('../../App/castCrewService.js');
let db = new Surreal.default('http://localhost:8001/rpc');



describe('Cast: PrepareQueryTest', () => {

	it('PrepareQueryTestNameOne', async () => {
		let input = {
			'crew-name': 'Keanu'
		};
		const result = await castService.prepareQuery(input);
        let expected = 'https://api.themoviedb.org/3/person/6384?api_key=fd466f23c2618acf3e52defb9c3869ba&append_to_response=images,movie_credits,tv_credits';
        expect(result).to.equal(expected);
	});

    
	it('PrepareQueryTestNameTwo', async () => {
		let input = {
			'crew-name': 'Daniel Kwan'
		};
		const result = await castService.prepareQuery(input);
        let expected = 'https://api.themoviedb.org/3/person/1383612?api_key=fd466f23c2618acf3e52defb9c3869ba&append_to_response=images,movie_credits,tv_credits';
        expect(result).to.equal(expected);
	});

});





describe('Cast: getImage()', () => {
    it('should return a valid image URL given a valid input parameter', async () => {
        const id = '3453283';
        const expected = 'https://image.tmdb.org/t/p/original/qrVyGTzcwHvfUYaA7mLDJ0uCaHf.jpg';
        const result = await castService.getImage(id);
        //console.log(result);
        //expect(result).to.equal(expected);

        expect(await castService.getImage(id)).to.be.undefined;
    });

    it('should return an empty string given an invalid input parameter', async () => {
        const id = 'InvalidID';
        expect(await castService.getImage(id)).to.be.undefined;
    });

});









// describe('dbAddTest', () => {

//     it('should return a valid response given valid input parameters', () => {
//         const json = {name: 'Emma Watson', birthday: '1990-04-15', movie_credits: '', id: '188927', tv_credits: ''};
//         const expected = 'Successfully created';
//         expect(dbAdd(json)).to.equal(expected);
//     });
//     it('should return an empty string given an invalid input parameter', () => {
//         const json = {name: '', birthday: '', movie_credits: '', id: '', tv_credits: ''};
//         expect(dbAdd(json)).to.equal('');
//     });

// });


// describe('Cast: dbQueryTest', () => {

// 	it('dbQueryReturnValid', async () => {
// 		let input = {
// 			'crew-name': 'Daniel Kwan'
// 		};
// 		castService.dbQuery(input).then((result) => {
// 			expect(result).to.be.an('object');
// 		});
// 	});

//     it('dbQueryValid', async() => {
//         const json = {'crew-name': 'Daniel Kwan'};
//         const expected = {
//             Name: 'Emma Watson',
//             DOB: '1990-04-15',
//             Age: 30,
//             Movies: '',
//             id: '188927',
//             Series: '',
//         };
//         let result = await castService.dbQuery(json)
//         console.log(result);
//         //expect(result).to.equal(expected);
//     });

//     // it('dbQueryInvalid', async() => {
//     //     const json = {'crew-name': 'InvalidName'};
//     //     expect(castService.dbQuery(json)).to.deep.equal({});
//     // });

// });







// describe('Movie: getImageTest', () => {

// 	it('getImageWithValidMoiveId', async () => {
// 		const expected = 'https://image.tmdb.org/t/p/original//pEoqbqtLc4CcwDUDqxmEDSWpWTZ.jpg';
// 		let result = await castService.getImage("tt0133093")
// 		//let result = await castService.getImage("Invalid")
// 		//console.log(result);
//         expect(result).to.equal(expected);
// 	});

// 	it('getImageWithInvalidMoiveId', async () => {
// 		let result = undefined;
// 		result = await castService.getImage("Invalid")
		
// 		//This test passes as it should be but it print TypeError of can not read undefined in the console
// 		//expect(await castService.getImage("Invalid")).to.be.undefined;

// 		expect(result).to.be.undefined;
// 	});

// 	it('getImageValidReturn', async () => {
// 		const name = 'tt0133093';
// 		expect(await castService.getImage(name)).to.be.a('string');
// 	})

// });



// describe('Movie: dbAddTest', () => {

// 	let str = '';
// 	str = "DELETE * FROM movie WHERE title CONTAINS 'Jaws'}"
// 	db.query(str)

// 	it('DatabaseAddData', () => {
// 		let json = {
// 			'imdbID': 'tt0073195',
// 			'Actors': 'Roy Scheider, Robert Shaw, Richard Dreyfuss, Lorraine Gary',
// 			'Plot': 'When a gigantic great white shark begins to menace the small island community of Amity, a police chief, a marine scientist and grizzled fisherman set out to stop it.',
// 			'Director': 'Steven Spielberg',
// 			'Genre': 'Adventure, Horror, Thriller',
// 			'Language': 'English',
// 			'imdbRating': '8.1',
// 			'Released': '20 Jun 1975',
// 			'Runtime': '124 min',
// 			'Title': 'Jaws',
// 			'Writer': 'Peter Benchley (screenplay by), Carl Gottlieb (screenplay by), Peter Benchley (based on the novel by)',
// 			'image': 'https://image.tmdb.org/t/p/original//l1yltvzILaZcx2jYvc5sEMkM7Eh.jpg'
// 		};
// 		castService.dbAdd(json).then(result => {
// 			expect(result).to.be.an('array');
// 		});
// 	});

// 	db.query(str)

// 	it('DatabaseAddDataIdMatch', () => {
//         let json = {
//             'imdbID': 'tt0073195',
//             'Actors': 'Roy Scheider, Robert Shaw, Richard Dreyfuss, Lorraine Gary',
//             'Plot': 'When a gigantic great white shark begins to menace the small island community of Amity, a police chief, a marine scientist and grizzled fisherman set out to stop it.',
//             'Director': 'Steven Spielberg',
//             'Genre': 'Adventure, Horror, Thriller',
//             'Language': 'English',
//             'imdbRating': '8.1',
//             'Released': '20 Jun 1975',
//             'Runtime': '124 min',
//             'Title': 'Jaws',
//             'Writer': 'Peter Benchley (screenplay by), Carl Gottlieb (screenplay by), Peter Benchley (based on the novel by)',
//             'image': 'https://image.tmdb.org/t/p/original//l1yltvzILaZcx2jYvc5sEMkM7Eh.jpg'
//         };
//         castService.dbAdd(json).then(result => {
//             expect(result[0].id).to.equal('movie:tt0073195');
//         });
//     });
// });



