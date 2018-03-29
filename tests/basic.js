//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./testServer');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Pets', () => {
  /*
   *  beforeEach((done) => { //Before each test we empty the database
   *      Book.remove({}, (err) => {
   *         done();
   *      });
   *  });
   */

  /*
   * Test the /GET route
   */
  describe('/GET pets', () => {
    it('it should GET all the pets', (done) => {
      chai.request(server)
        .get('/pets')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST pets', () => {
    it('it should not POST a pet without tag field', (done) => {
      let pet = {
        id: 11,
        name: "Pig",
      }
      chai.request(server)
        .post('/pets')
        .send(pet)
        .end((err, res) => {
          res.should.have.status(200);
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
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Pet successfully added!');
          res.body.pet.should.have.property('id');
          res.body.pet.should.have.property('name');
          res.body.pet.should.have.property('tag');
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id pets', () => {
    it('it should GET a pet by the given id', (done) => {
      let pet = {
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      }
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

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id pet', () => {
    it('it should UPDATE a pet given the id', (done) => {
      let pet = {
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      }
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

  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id pets', () => {
    it('it should DELETE a pet given the id', (done) => {
      let pet = {
        id: 10,
        name: "Pig",
        tag: "Looking for mud"
      }
      book.save((err, pet) => {
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
});
