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


afterEach(function() {
  if (this.currentTest.state !== 'failed') return;
  console.log( fs.readFileSync('/your/logfile').toString() );
});








describe('Cast: PrepareQueryTest', () => {

	it('C1: PrepareQueryTestNameOne', async () => {
		let input = {
			'crew-name': 'Keanu'
		};
		const result = await castService.prepareQuery(input);
        let expected = 'https://api.themoviedb.org/3/person/6384?api_key=fd466f23c2618acf3e52defb9c3869ba&append_to_response=images,movie_credits,tv_credits';
        expect(result).to.equal(expected);
	});

    
	it('C2: PrepareQueryTestNameTwo', async () => {
		let input = {
			'crew-name': 'Daniel Kwan'
		};
		const result = await castService.prepareQuery(input);
        let expected = 'https://api.themoviedb.org/3/person/1383612?api_key=fd466f23c2618acf3e52defb9c3869ba&append_to_response=images,movie_credits,tv_credits';
        expect(result).to.equal(expected);
	});

});


describe('Cast: getImage()', () => {
    it('C3: getImageValid', async () => {
        const id = '6384';
        const expected = 'https://image.tmdb.org/t/p/original//4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg';
        const result = await castService.getImage(id);
        //console.log(result);
        expect(result).to.equal(expected);

        //expect(await castService.getImage(id)).to.be.undefined;
    });

    it('C4: getImageInvalid', async () => {
        const id = 'InvalidID';
        const expected = 'https://image.tmdb.org/t/p/original/undefined';
        const result = await castService.getImage(id);
        //console.log(result);
        expect(result).to.equal(expected);

    });

});


describe('getMovieTitles', () => {
    it('C5: getMovieTitlesReturn', async () => {
        let input = {
            "movie_credits": {
                "cast": [
                    {
                      "title": "The Matrix",
                      "original_title": "The Matrix",
                      "popularity": 35.739,
                      "poster_path": "/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg",
                      "character": "Neo"
                    },
                ]
            }
        }
        
        let result = await castService.getMovieTitles(input);

        expect(result).to.be.an('array');
    })

    it('C6: getMovieTitlesValid', async () => {
      let input = {
          "movie_credits": {
              "cast": [
                  {
                    "title": "The Matrix",
                    "original_title": "The Matrix",
                    "popularity": 35.739,
                    "poster_path": "/placeholder.jpg",
                    "character": "Neo"
                  },
              ]
          }
      }
      
      let result = await castService.getMovieTitles(input);

      expect(result[0]).to.have.property('title', 'The Matrix');
      expect(result[0]).to.have.property('image', 'https://image.tmdb.org/t/p/original//placeholder.jpg');
      expect(result[0]).to.have.property('character', 'Neo');
  })
})


describe('getSeriesTitles', () => {
  it('C7: getSeriesTitlesReturn', async () => {
      let input = {
          "tv_credits": {
              "cast": [
                  {
                    "title": "The Matrix",
                    "popularity": 10,
                    "poster_path": "/placeholder",
                    "character": "ellie"
                  },
              ]
          }
      }
      
      let result = await castService.getSeriesTitles(input);

      expect(result).to.be.an('array');
  })

  it('C8: getSeriesTitlesValid', async() => {
    let data = {
        "tv_credits": {
            "cast": [
                {
                    "original_name": "The Last of Us",
                    "popularity": 11.75,
                    "poster_path": "example_poster_path.jpg",
                    "character": "Ellie"
                }
            ]
        }
    }
    let expected = [{title: "The Last of Us", image: "https://image.tmdb.org/t/p/original/example_poster_path.jpg", character: "Ellie"}]
    assert.deepEqual(await castService.getSeriesTitles(data), expected);
});

  it('C9: getSeriesTitlesInvalid', async() => {
    let data = {
        "tv_credits": {
            "cast": [
                {
                    "original_name": "sdfsdfs",
                    "popularity": 15,
                    "poster_path": "example_poster_path.jpg",
                    "character": "Ellie"
                }
            ]
        }
    }
    //let expected = [{title: "The Last of Us", image: "https://image.tmdb.org/t/p/original/example_poster_path.jpg", character: "Ellie"}]
    //assert.deepEqual(await castService.getSeriesTitles(data), expected);

    //let result = await castService.getSeriesTitles(data);

    //expect(result).to.be.undefined;
  });


})





describe('Cast: dbAdd', () => {
    it('C5: dbAddValid', async() => {
      let json = {
        "name": "Test Person",
        "birthday": "01/01/2000",
        "id": 1234,
        "image": "example_image_path.jpg",
        "biography": "Example biography."
      }

        const expected = 'Successfully created';
        let result = await castService.dbAdd(json);

        console.log(result);

        //expect(result).to.equal(expected);
    });

    it('C6: dbaddInvalid', async() => {
        const json = {name: '', birthday: '', movie_credits: '', id: '', tv_credits: ''};
        expect(await castService.dbAdd(json)).to.undefined;
    });
});


describe('Cast: dbQuery', () => {
    it('C11: dbQueryValid', async() => {
        const input = {'crew-name': 'Keanu'};
        const expected = {
            Name: 'Emma Watson',
            DOB: '1990-04-15',
            Age: 30,
            Movies: '',
            id: '188927',
            Series: '',
        };
        
        let result = await castService.dbQuery(input);
        console.log(result);
        //expect(result).to.equal(expected);
    });
    it('C12: dbQueryInvalid', async() => {
        const input = {'crew-name': 'InvalidName52645'};

        let result = await castService.dbQuery(input);
        expect(result).to.be.undefined;
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



