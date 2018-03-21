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

/**
 *
 */
exports.createPets = function(args, res, next) {
  if (args.body != undefined) {
    pets.push(args.body);
    res.status(201).send("New pet created");
  } else {
    res.status(201).send("No pet was sent in the body of the request");
  }
}

/**
 *
 */
exports.listPets = function(args, res, next) {
  res.status(200).send(pets.slice(0, args.query.limit));
}

/**
 *
 */
exports.showPetById = function(args, res, next) {
  /*
  var res_pet = pets[args.params.petId];
  if (res_pet != undefined) {
    res.status(200).send(res_pet);
  } else {
    res.status(404).send({
      message: "There is no pet with id " + args.params.petId
    });
  }
  */
  var res_pet = pets[res.locals.petId];
  if (res_pet != undefined) {
    res.status(200).send(res_pet);
  } else {
    res.status(404).send({
      message: "There is no pet with id " + res.locals.petId
    });
  }
}

/**
 *
 */
exports.deletePet = function(args, res, next) {
  var res_pet = pets[res.locals.petId];
  if (res_pet != undefined) {
    var index = pets.indexOf(res_pet);
    pets.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send({
      message: "There is no pet with id " + res.locals.petId + " to be deleted"
    });
  }
}

/**
 *
 */
exports.deletePets = function(args, res, next) {
  pets.splice(0,pets.length);
  res.status(200).send();
}

/**
 *
 */
exports.updatePet = function(args, res, next) {
  var res_pet = pets[res.locals.petId];
  if (res_pet != undefined) {
    var index = pets.indexOf(res_pet);
    pets.splice(index, 1);
    if (args.body != undefined) {
      pets.push(args.body);
      res.status(201).send("Updated pet");
    } else {
      res.status(201).send("No pet was sent in the body of the update request");
    }
  } else {
    res.status(404).send({
      message: "There is no pet with id " + res.locals.petId + " to be updated"
    });
  }
}

exports.pets = pets;
