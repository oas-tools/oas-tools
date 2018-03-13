'use strict';

var pets = [{
    name: "Wrong", /* This object doesn't match the requirements of the specification file */
    tag: "Wrong object as it doesn't have id"
  },
  {
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
    id: "4", /* wrong object as this is string instead of integer */
    name: "Bat",
    tag: "Ozzy's breakfast"
  }
]
var identifier = 5;
exports.createPets = function(args, res, next) {
  var newPet = {
    id: identifier,
    name: "newPet",
    tag: "just for testing..."
  };
  pets.push(newPet);
  identifier = identifier+1;
  res.status(201).send();
}

exports.listPets = function(args, res, next) {
  res.status(200).send(pets);
}

exports.showPetById = function (args,res,next){
  res.status.send(200).send({
    message: "The controller for showPetById is not implemented yet but works!"
  });
}

exports.pets = pets;
