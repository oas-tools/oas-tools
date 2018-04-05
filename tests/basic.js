let mongoose = require("mongoose");
let Pet = require('./testServer/model/pet');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./testServer');
let should = chai.should();
chai.use(chaiHttp);
var auxRequire = require('./testServer/controllers/petsControllers.js');


function getTests() {
  describe('/GET pets', () => {

    it('it should get and error informing the required parameter limit was not specified in the query', (done) => {
      chai.request(server)
        .get('/pets')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.contain("Missing parameter limit in query");
          done();
        });
    });

    var newPets = [{
        id: 1,
        name: "Wolf",
        tag: "Barks at the moon"
      },
      {
        id: 2,
        name: "Cat",
        tag: "Boring animal"
      },
      {
        id: 3,
        name: "Rabbit",
        tag: "Eats carrots"
      },
      {
        id: 4,
        name: "Bat",
        tag: "Ozzy's breakfast"
      },
      {
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      }
    ];

    it('it shouldn´t GET all the pets but show a message with errors (missing/wrong parameters)', (done) => {
      chai.request(server)
        .get('/pets?limit=10')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.contain("Wrong data in the response");
          auxRequire.setCorrectPets(newPets);
          done();
        });
    });

    it('it should GET all the pets', (done) => {
      chai.request(server)
        .get('/pets?limit=' + auxRequire.pets.length)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(auxRequire.pets.length);
          done();
        });
    });

    it('it should GET the first 3 pets', (done) => {
      chai.request(server)
        .get('/pets?limit=3')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(3);
          done();
        });
    });

    it('it should GET a pet by the given id', (done) => {
      let pet = {
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      };
      chai.request(server)
        .get('/pets/' + pet.id)
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
        .get('/pets/badId')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.contain("Wrong parameter petId in params");
          done();
        });
    });
    it('it should not GET a pet by an id that does not exist in the DB', (done) => {
      var someId = 666;
      chai.request(server)
        .get('/pets/' + someId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("There is no pet with id " + someId);
          done();
        });
    });
  });
}

function postTests() {
  describe('/POST pets', () => {
    it('it should POST a pet ', (done) => {
      let pet = {
        id: 11,
        name: "Frog",
        tag: "Green animal"
      }
      var prePostSize = auxRequire.pets.length;
      chai.request(server)
        .post('/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(prePostSize + 1);
          done();
        });
    });
    it('it should not accept a POST request without a pet in the body', (done) => {
      chai.request(server)
        .post('/pets')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("Missing object in the request body");
          done();
        });
    });
    it('it should not POST a pet whose id is of type string instead of integer', (done) => {
      let pet = {
        id: "20",
        name: "Frog",
        tag: "Green animal"
      }
      chai.request(server)
        .post('/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('it should not POST a pet which does not have id', (done) => {
      let pet = {
        name: "Horse",
        tag: "Another animal"
      }
      chai.request(server)
        .post('/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });
}

function putTests() {
  describe('/PUT/:id pet', () => {
    it('it should UPDATE a pet given the id', (done) => {
      var pet = {
        id: 10,
        name: "Pig",
        tag: "Pet updated by the mocha+chai test"
      };
      chai.request(server)
        .put('/pets/' + pet.id)
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
        .put('/pets/' + 2)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
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
        .put('/pets/' + pet.id)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          deleteTests();
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
        .put('/pets/' + someId)
        .send(pet)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("There is no pet with id " + someId);
          done();
        });
    });
  });

}

function deleteTests() {
  describe('/DELETE pets', () => {
    it('it should DELETE a pet given the id', (done) => {
      let pet = new Pet({
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      });
      chai.request(server)
        .delete('/pets/' + pet.id)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
    it('Should show an error message when trying to delete an object that does not exist in the DB', (done) => {
      var someId = 666;
      chai.request(server)
        .delete('/pets/' + someId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("There is no pet with id " + someId + " to be deleted");
          done();
        });
    });
    it('Before deleting all pets...it should GET all the pets: all of them matching oas-doc constraints', (done) => {
      chai.request(server)
        .get('/pets?limit=' + auxRequire.pets.length)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(auxRequire.pets.length);
          done();
        });
    });
    it('it should DELETE all pets and then send GET request to check length==0', (done) => {
      chai.request(server)
        .delete('/pets')
        .end((err, res) => {
          res.should.have.status(204);
          chai.request(server).get('/pets?limit=10').end((err,res)=> {
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
  getTests();
  postTests();
  putTests(); //this one calls deletePets()
});
