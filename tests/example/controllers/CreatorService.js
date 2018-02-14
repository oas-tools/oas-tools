'use strict';
var validatorAux = require('./DefaultService.js');

/*
var pets = [{
    name: "Wolf",
    tag: "Barks at the moon"
  },
  {
    name: "Cat",
    tag: "Boring animal"
  },
  {
    name: "Rabbit",
    tag: "Eats carrots"
  },
  {
    name: "Bat",
    tag: "Ozzy's breakfast"
  }
]
*/

exports.createPets = function(args, res, next) {
  var newPet = {
    name: "newPet",
    tag: "just for testing..."
  };
  //pets.push(newPet);
  try {
    validatorAux.pets.push(newPet);
  } catch (err) {
    console.log(err);
  }
  res.status(201).send();
}

/*
exports.listPets = function(args, res, next) { // the following two work the same way:
  //res.status(200).end(JSON.stringify(pets));
  res.status(200).send(pets);
}
*/
