let mongoose = require("mongoose");
let Pet = require('./testServer/model/pet');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./testServer');
let should = chai.should();
chai.use(chaiHttp);
var auxRequire = require('./testServer/controllers/petsControllers.js');


function getTests() {
  //Test the route: GET /pets
  describe('/GET pets?limit=10', () => {
    it('it shouldn´t GET all the pets but show a message with errors (missing or wrong parameters)', (done) => {
      chai.request(server)
        .get('/pets?limit=10')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.contain("Wrong data in the response");
          done();
        });
    });

    auxRequire.pets = [{ //now all pets are valid: match types and contain all required parameters
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

    it('it should GET all the pets', (done) => {
      chai.request(server)
        .get('/pets')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(auxRequire.pets.length);
          done();
        });
    });
  });

  //Test the route: GET /pets?limit=3
  describe('/GET pets?limit=3', () => {
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
  });

  //Test the route: GET /unknownPath
  describe('/GET unknownPath', () => {
    it('it should show a message informing of unknown path', (done) => {
      chai.request(server)
        .get('/unknownPath')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("The requested path is not in the specification file");
          done();
        });
    });
  });

  //Test the route: GET /pets/:id
  describe('/GET/:id pets', () => {
    it('it should GET a pet by the given id', (done) => {
      let pet = { //pet already contained in the pets array
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
  });

  //Test the route: GET /pets/:id
  describe('/GET/:id pets', () => {
    it('it should not GET a pet by an id of type string instead of integer', (done) => { //TODO: It must receive the error from the validator!
      chai.request(server)
        .get('/pets/badId')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("The following parameters were not of the right type: petId");
          done();
        });
    });
  });
}

function postTests() {
  //Test the route: POST /pets
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
          res.body.should.have.property('code');
          res.body.should.have.property('message');
          res.body.message.should.be.eql("No pet was sent in the body of the request");
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
          //res.body.message.should.be.eql("Parameter of wrong type");
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
          //res.body.message.should.be.eql("Parameter missing");
          done();
        });
    });

  });

}

function putTests() {
  //Test the route: PUT /pets/:id
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
          //res.body.message.should.be.eql("Parameter missing");
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
          //res.body.message.should.be.eql("Wrong parameter type");
          done();
        });
    });
  });

}

function deleteTests() {

  //Test the route: DELETE /pets/:id
  describe('/DELETE/:id pets', () => {
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
          /*res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Pet successfully deleted!');*/
          done();
        });
    });
  });

  //Test the route: DELETE /pets
  describe('/DELETE pets', () => {
    it('it should DELETE all pets', (done) => {
        chai.request(server)
          .delete('/pets')
          .end((err, res) => {
            res.should.have.status(204);
            //res.body.should.be.a('object');
            //res.body.should.have.property('message').eql('All pets successfully deleted!');
            done();
          });
    });
  });
}

describe('Pets', () => {
  getTests();
  //postTests();
  //putTests();
  //deleteTests();
});
