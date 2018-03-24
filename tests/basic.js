//send requests to localhost:8383 testing everything.
//Compare the return with what I know it should return!

var request = require('request');

request('http://localhost:8383/pets', {
  json: true
}, (err, res, body) => {
  console.log("/////////FIRST TEST");
  if (err) {
    return console.log(err);
  }
  console.log(body);
});

request('http://localhost:8383/pets/2', {
  json: true
}, (err, res, body) => {
  console.log("/////////SECOND TEST");
  if (err) {
    return console.log(err);
  }
  console.log(body);
});

request.post({
  //headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url: 'http://localhost:8383/pets',
  json: {
    id: 666,
    name: "Goat",
    tag: "It is just a goat"
  }
}, function(error, response, body) {
  console.log("/////////THIRD TEST");
  console.log(body);
  console.log(response.statusCode);
});


request({
  url: 'http://localhost:8383/pets/2',
  method: 'PUT',
  json: {
    id: 2,
    name: "UpdatedCat",
    tag: "Updated from the test application"
  }
}, function(error, response, body) {
  if(error){
    console.log(error)
  }
  console.log("/////////FOURTH TEST");
  console.log(body)
});


/* SOME TESTING WITH DELETE METHOD */
