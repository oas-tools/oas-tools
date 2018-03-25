

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./testServer');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Pets', () => {
  /*
    beforeEach((done) => { //Before each test we empty the database
        Book.remove({}, (err) => {
           done();
        });
    });
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
      it('it should not POST a book without pages field', (done) => {
        let pet = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954
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
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
        }
        chai.request(server)
            .post('/pets')
            .send(pet)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book successfully added!');
                res.body.book.should.have.property('title');
                res.body.book.should.have.property('author');
                res.body.book.should.have.property('pages');
                res.body.book.should.have.property('year');
              done();
            });
      });

  });
  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id pets', () => {
      it('it should GET a pet by the given id', (done) => {
        let pet = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
        book.save((err, pet) => {
            chai.request(server)
            .get('/pets/' + pet.id)
            .send(pet)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('author');
                res.body.should.have.property('pages');
                res.body.should.have.property('year');
                res.body.should.have.property('_id').eql(book.id);
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
        let pet = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
        book.save((err, pet) => {
                chai.request(server)
                .put('/pets/' + pet.id)
                .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book updated!');
                    res.body.book.should.have.property('year').eql(1950);
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
        let pet = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
        book.save((err, pet) => {
                chai.request(server)
                .delete('/pets/' + pet.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                  done();
                });
          });
      });
  });

});
