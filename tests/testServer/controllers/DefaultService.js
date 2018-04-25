'use strict';

var pets = [{
    name: "Wrong",
    /* This object doesn't match the requirements of the specification file */
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
    id: "4",
    /* wrong object as this is string instead of integer */
    name: "Bat",
    tag: "Ozzy's breakfast"
  }
]


exports.listPets = function(args, res, next) {
  res.status(200).send(pets.slice(0, args.query.limit));
}

exports.createPets = function(args, res, next) {
  var newPet = {
    id: 99,
    name: "newPet",
    tag: "just for testing..."
  };
  pets.push(newPet);
  res.status(201).send();
}

exports.showPetById = function(args, res, next) {
  var res_pet = pets[res.locals.petId];
  if (res_pet != undefined) {
    res.status(200).send(res_pet);
  } else {
    res.status(404).send({
      message: "There is no pet with id " + res.locals.petId
    });
  }
}
