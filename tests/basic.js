'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const serverProto = require('./testServer');
let server = require('./testServer');
const should = chai.should();
chai.use(chaiHttp);
const auxRequire = require('./testServer/controllers/petsController');
auxRequire.corruptPets();

describe('/A GET pets', () => {

  before((done) => {
    // await for server creation
    serverProto.init(() => {
      server = serverProto.getServer();
      done();
    });
  });

  after((done) => {
    // close()
    serverProto.close(() => {
      server = serverProto.close();
      done();
    });

  });

  it('it should get and error informing the required parameter limit was not specified in the query', (done) => {
    chai.request(server)
      .get('/api/v1/pets')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Missing parameter limit in query");
        done();
      });
  });
  /* testing of parameters in query */
  it('it should get an error informing of missing required parameters in query', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsQuery')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Missing parameter integerParam in query");
        JSON.stringify(res.body).should.contain("Missing parameter booleanParam in query");
        JSON.stringify(res.body).should.contain("Missing parameter stringParam in query");
        JSON.stringify(res.body).should.contain("Missing parameter doubleParam in query");
        done();
      });
  });
  it('it should get an error informing the required parameter integerParam was not of the right type', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsQuery?integerParam=wrong&booleanParam=true&stringParam=okay&doubleParam=1.9')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter integerParam in query");
        done();
      });
  });
  it('it should get an error informing the required parameter booleanParam was not of the right type', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsQuery?integerParam=9&booleanParam=wrong90&stringParam=okay&doubleParam=1.9')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter booleanParam in query");
        done();
      });
  });
  it('it should get an error informing the required parameter stringParam was not of the right type', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsQuery?integerParam=9&booleanParam=false&stringParam=89&doubleParam=1.9')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter stringParam in query");
        done();
      });
  });
  it('it should get an error informing the required parameter doubleParam was not of the right type', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsQuery?integerParam=9&booleanParam=false&stringParam=okay&doubleParam=wrong')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter doubleParam in query");
        done();
      });
  });
  /* end of query parameters test */

  /* testing of parameters in path */
  it('it should get an error informing the required parameter integerParam was not of the right type', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsPath/wrong/true/okay/1.9')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter integerParam in params");
        done();
      });
  });
  it('it should get an error informing the required parameter booleanParam was not of the right type', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsPath/21/wrong/okay/1.9')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter booleanParam in params");
        done();
      });
  });
  it('it should get an error informing the required parameter stringParam was not of the right type', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsPath/21/false/90/1.9')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter stringParam in params");
        done();
      });
  });
  it('it should get an error informing the required parameter doubleParam was not of the right type', (done) => {
    chai.request(server)
      .get('/api/v1/paramTestsPath/21/false/okay/wrong')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter doubleParam in params");
        done();
      });
  });
  /* end of path parameters test */

  /* test of properties type of request body */
  it('it should get an error informing of wrong data in the response: types do not match', (done) => {
    chai.request(server)
      .get('/api/v1/responseBodyTest')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong data in the response");
        JSON.stringify(res.body).should.contain("Expected type boolean but found type integer");
        JSON.stringify(res.body).should.contain("Expected type integer but found type string");
        JSON.stringify(res.body).should.contain("Expected type number but found type boolean");
        JSON.stringify(res.body).should.contain("Expected type string but found type number");
        done();
      });
  });
  /* test of properties type of request body end*/

  it('it shouldn´t GET all the pets but show a message with errors (missing/wrong parameters)', (done) => {
    chai.request(server)
      .get('/api/v1/pets?limit=10')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong data in the response");
        auxRequire.setCorrectPets();
        done();
      });
  });

  it('it should GET all the pets', (done) => {
    chai.request(server)
      .get('/api/v1/pets?limit=' + auxRequire.pets.length)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('Array');
        res.body.length.should.be.eql(auxRequire.pets.length);
        done();
      });
  });

  it('it should GET the first 3 pets', (done) => {
    chai.request(server)
      .get('/api/v1/pets?limit=3')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('Array');
        res.body.length.should.be.eql(3);
        done();
      });
  });

  it('it should GET a pet by the given id', (done) => {
    var pet = {
      id: 10,
      name: "Pig",
      tag: "Looking for mud"
    };
    chai.request(server)
      .get('/api/v1/pets/' + pet.id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('tag');
        res.body.should.have.property('id').eql(pet.id);
        res.body.should.have.property('name').eql(pet.name);
        res.body.should.have.property('tag').eql(pet.tag);
        done();
      });
  });

  it('it should not GET a pet by an id of type string instead of integer', (done) => {
    chai.request(server)
      .get('/api/v1/pets/badId')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('array');
        JSON.stringify(res.body).should.contain("Wrong parameter petId in params");
        done();
      });
  });

  it('it should not GET a pet by an id that does not exist in the DB', (done) => {
    var someId = 666;
    chai.request(server)
      .get('/api/v1/pets/' + someId)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql("There is no pet with id " + someId);
        //  postTests();
        done();
      });
  });

});

function getTests() { //this one calls postTests()



}

function postTests() { //this one calls putTests()
  describe('/POST pets', () => {
    var prePostSize = auxRequire.pets.length;
    it('it should POST a pet ', (done) => {
      var pet = {
        id: 11,
        name: "Frog",
        tag: "Green animal"
      }
      chai.request(server)
        .post('/api/v1/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(prePostSize + 1);
          done();
        });
    });
    it('it should POST a pet without tag ', (done) => {
      var pet = {
        id: 40,
        name: "IdontHaveTag"
      }
      chai.request(server)
        .post('/api/v1/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(prePostSize + 2);
          done();
        });
    });
    it('it should not accept a POST request without a pet in the body', (done) => {
      chai.request(server)
        .post('/api/v1/pets')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("Missing object in the request body. ");
          done();
        });
    });
    it('it should not POST a pet whose id is of type string instead of integer', (done) => {
      var pet = {
        id: "20",
        name: "Frog",
        tag: "Green animal"
      }
      chai.request(server)
        .post('/api/v1/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("INVALID_TYPE")
          done();
        });
    });
    it('it should not POST a pet which is a string instead of a JSON object', (done) => {
      var pet = "I_AM_A_PET";
      chai.request(server)
        .post('/api/v1/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("Missing object in the request body. ")
          done();
        });
    });
    it('it should not POST a pet whose name is of type integer instead of string', (done) => {
      var pet = {
        id: 29,
        name: 12345,
        tag: "Green animal"
      }
      chai.request(server)
        .post('/api/v1/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("INVALID_TYPE")
          done();
        });
    });
    it('it should not POST a pet which does not have id', (done) => {
      var pet = {
        name: "Horse",
        tag: "Another animal"
      }
      chai.request(server)
        .post('/api/v1/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("OBJECT_MISSING_REQUIRED_PROPERTY")
          done();
        });
    });
    it('it should not POST a pet which does not have name', (done) => {
      var pet = {
        id: 23,
        tag: "Another animal"
      }
      chai.request(server)
        .post('/api/v1/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("OBJECT_MISSING_REQUIRED_PROPERTY")
          done();
        });
    });
    it('it should not POST a pet whose tag is of type integer instead of string', (done) => {
      var pet = {
        id: 29,
        name: "SomeName",
        tag: 12345
      }
      chai.request(server)
        .post('/api/v1/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("INVALID_TYPE")
          // putTests();
          done();
        });
    });
  });
}

function putTests() { //this one calls deletePets()
  describe('/PUT/:id pet', () => {
    it('it should UPDATE a pet given the id', (done) => {
      var pet = {
        id: 10,
        name: "Pig",
        tag: "Pet updated by the mocha+chai test"
      };
      chai.request(server)
        .put('/api/v1/pets/' + pet.id)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("Updated pet");
          done();
        });
    });
    it('it should UPDATE a pet by removing its tag', (done) => {
      var pet = {
        id: 10,
        name: "Pig",
      };
      chai.request(server)
        .put('/api/v1/pets/' + pet.id)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("Updated pet");
          done();
        });
    });
    it('it should not UPDATE a pet without id', (done) => {
      var pet = {
        name: "Pig",
        tag: "Pet updated by the mocha+chai test"
      };
      chai.request(server)
        .put('/api/v1/pets/' + 2)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("OBJECT_MISSING_REQUIRED_PROPERTY")
          done();
        });
    });
    it('it should not UPDATE a pet without name', (done) => {
      var pet = {
        id: 23,
        tag: "Pet updated by the mocha+chai test"
      };
      chai.request(server)
        .put('/api/v1/pets/' + 2)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("OBJECT_MISSING_REQUIRED_PROPERTY")
          done();
        });
    });
    it('it should not UPDATE a pet whose name is of type integer instead of string', (done) => {
      var pet = {
        id: 2,
        name: 111,
        tag: "Pet updated by the mocha+chai test"
      };
      chai.request(server)
        .put('/api/v1/pets/' + pet.id)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("INVALID_TYPE")
          done();
        });
    });
    it('it should not UPDATE a pet whose tag is of type integer instead of string', (done) => {
      var pet = {
        id: 2,
        name: "SomeNameHere",
        tag: 111
      };
      chai.request(server)
        .put('/api/v1/pets/' + pet.id)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("INVALID_TYPE")
          done();
        });
    });
    it('it should not UPDATE a pet whose id is of type string instead of integer', (done) => {
      var pet = {
        id: "2",
        name: "animal1",
        tag: "Pet updated by the mocha+chai test"
      };
      chai.request(server)
        .put('/api/v1/pets/' + pet.id)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("INVALID_TYPE")
          done();
        });
    });
    it('it should not update a pet whose id does not exist in the DB', (done) => {
      var someId = 666;
      var pet = {
        id: 90,
        name: "Useless",
        tag: "This is here just to avoid another error"
      };
      chai.request(server)
        .put('/api/v1/pets/' + someId)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("There is no pet with id " + someId);
          done();
        });
    });
    it('it should not UPDATE a pet with a string instead of a JSON object', (done) => {
      var pet = "I_AM_A_PET";
      chai.request(server)
        .put('/api/v1/pets/' + 2)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("Missing object in the request body. ")
          done();
        });
    });
    it('it should show an error message indicating wrong type for the specified petId in the path', (done) => {
      var pet = {
        id: 68,
        name: "Hello",
        tag: "Pet updated by the mocha+chai test"
      };
      chai.request(server)
        .put('/api/v1/pets/badId')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('array');
          JSON.stringify(res.body).should.contain("INVALID_TYPE")
          deleteTests();
          done();
        });
    });
  });
}

function deleteTests() {
  describe('/DELETE pets', () => {
    it('it should DELETE a pet given the id', (done) => {
      var pet = {
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      };
      chai.request(server)
        .delete('/api/v1/pets/' + pet.id)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
    it('it should try to GET the previously deleted pet and get 404', (done) => {
      chai.request(server)
        .get('/api/v1/pets/10')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("There is no pet with id 10");
          done();
        })
    });
    it('Should show an error message when trying to delete an object that does not exist in the DB', (done) => {
      var someId = 666;
      chai.request(server)
        .delete('/api/v1/pets/' + someId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("There is no pet with id " + someId + " to be deleted");
          done();
        });
    });
    it('Should show an error indicating wrong type of parameter id', (done) => {
      chai.request(server)
        .delete('/api/v1/pets/wrongType')
        .end((err, res) => {
          res.should.have.status(400);
          JSON.stringify(res.body).should.contain("INVALID_TYPE")
          done();
        });
    });
    it('Before deleting all pets...it should GET all the pets: all of them matching oas-doc constraints', (done) => {
      chai.request(server)
        .get('/api/v1/pets?limit=' + auxRequire.pets.length)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(auxRequire.pets.length);
          done();
        });
    });
    it('it should DELETE all pets and then send GET request to check length==0', (done) => {
      chai.request(server)
        .delete('/api/v1/pets')
        .end((err, res) => {
          res.should.have.status(204);
          chai.request(server).get('/api/v1/pets?limit=10').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('Array');
            res.body.length.should.be.eql(0);
          });
          done();
        });
    });
  });
}

describe('Pets', () => {
  // getTests(); //this one calls postTests()
  // postTests(); //this one calls putTests()
  // putTests(); //this one calls deletePets()
});