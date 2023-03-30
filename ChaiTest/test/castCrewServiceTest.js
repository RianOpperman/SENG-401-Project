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

  it('C7: getMovieTitlesInvalid', async () => {
    let input = {
        "movie_credits": {
            "cast": [
                {
                  "title": "ndalsgk241",
                  "original_title": "sadg314",
                  "popularity": 9999,
                  "poster_path": "/placeholder.jpg",
                  "character": "Neo"
                },
            ]
        }
    }
    
    let result = await castService.getMovieTitles(input);
    //expect(result).to.be.undefined;
})
})


describe('getSeriesTitles', () => {
  it('C8: getSeriesTitlesReturn', async () => {
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

  it('C9: getSeriesTitlesValid', async() => {
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

  it('C10: getSeriesTitlesInvalid', async() => {
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
    it('C11: dbAddValid', async() => {
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

    it('C12: dbaddInvalid', async() => {
        const json = {name: '', birthday: '', movie_credits: '', id: '', tv_credits: ''};
        expect(await castService.dbAdd(json)).to.undefined;
    });
});


describe('Cast: dbQuery', () => {
    it('C13: dbQueryValid', async() => {
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
    it('C14: dbQueryInvalid', async() => {
        const input = {'crew-name': 'InvalidName52645'};

        let result = await castService.dbQuery(input);
        expect(result).to.be.undefined;
    });
});


