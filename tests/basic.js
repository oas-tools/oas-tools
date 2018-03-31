let mongoose = require("mongoose");
let Pet = require('./testServer/model/pet');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./testServer');
let should = chai.should();
chai.use(chaiHttp);
var auxRequire = require('./testServer/controllers/petsControllers.js');


describe('Pets', () => {

  //Before starting the tests, empty the pets array and create it again:
  auxRequire.pets = [{
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
    }
  ];

  //Test the route: GET /pets
  describe('/GET pets', () => {
    it('it should GET all the pets', (done) => {
      chai.request(server)
        .get('/pets')
        .end((err, res) => {
          console.log("QUÉ HAY EN RES: " + JSON.stringify(res.text));
          res.should.have.status(200);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(auxRequire.pets.length);
          done();
        });
    });
  });

  //Test the route: GET /pets/:id
  describe('/GET/:id pets', () => {
    it('it should GET a pet by the given id', (done) => {
      let pet = new Pet({
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      });
      console.log("CREATED PET: " + pet)
      pet.save((err, pet) => {
        chai.request(server)
          .get('/pets/' + pet.id)
          .send(pet)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('name');
            res.body.should.have.property('tag');
            res.body.should.have.property('id').eql(pet.id);
            done();
          });
      });
    });
  });

  //Test the route: POST /pets
  describe('/POST pets', () => {
    it('it should not POST a pet without tag field', (done) => { //tag is not required actually...and besides that, this depends on the value of strict!
      let pet = {
        id: 11,
        name: "Pig",
      }
      chai.request(server)
        .post('/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('pages');
          res.body.errors.pages.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should POST a pet ', (done) => {
      let pet = {
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      }
      chai.request(server)
        .post('/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Pet successfully added!');
          res.body.pet.should.have.property('id');
          res.body.pet.should.have.property('name');
          res.body.pet.should.have.property('tag');
          done();
        });
    });
  });

  //Test the route: PUT /pets/:id
  describe('/PUT/:id pet', () => {
    it('it should UPDATE a pet given the id', (done) => {
      let pet = new Pet({
        id: 10,
        name: "Pig",
        tag: "Pet updated by the mocha+chai test"
      });
      pet.save((err, pet) => {
        chai.request(server)
          .put('/pets/' + pet.id)
          .send({
            id: 10,
            name: "Pig",
            tag: "Nothing"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Pet updated!');
            res.body.book.should.have.property('tag').eql("Nothing");
            done();
          });
      });
    });
  });

  //Test the route: DELETE /pets/:id
  describe('/DELETE/:id pets', () => {
    it('it should DELETE a pet given the id', (done) => {
      let pet = new Pet({
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      });
      pet.save((err, pet) => {
        chai.request(server)
          .delete('/pets/' + pet.id)
          .end((err, res) => {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Pet successfully deleted!');
            res.body.result.should.have.property('ok').eql(1);
            res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
  });

  //Test the route: DELETE /pets
  describe('/DELETE pets', () => {
    it('it should DELETE all pets', (done) => {
      pet.save((err, pet) => {
        chai.request(server)
          .delete('/pets')
          .end((err, res) => {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('All pets successfully deleted!');
            res.body.result.should.have.property('ok').eql(1);
            res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
  });
});
