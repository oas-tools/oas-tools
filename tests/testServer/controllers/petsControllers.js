'use strict';

var pets = [{
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

/**
 *  Creates a pet
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
 *  Retrieves the whole pets collection
 */
exports.listPets = function(args, res, next) {
  res.status(200).send(pets.slice(0, args.query.limit));
}

/**
 *  Retrieves a single pet
 */
exports.showPetById = function(args, res, next) {
  var res_pet;
  for (var i = 0; i<pets.length; i++) {
    if (pets[i].id == args.params.petId) {
      res_pet = pets[i];
      break;
    }
  }
  console.log(res_pet)
  if (res_pet == undefined) {
    res.status(404).send({
      message: "There is no pet with id " + args.params.petId
    });
  } else {
    res.status(200).send(res_pet);
  }
}

/**
 *  Deletes a single pet from the collection
 */
exports.deletePet = function(args, res, next) {
  var index = -1;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.params.petId) {
      index = i;
    }
  }
  if (index == -1) {
    res.status(404).send({
      message: "There is no pet with id " + args.params.petId + " to be deleted"
    });
  } else {
    pets.splice(index, 1);
    res.status(200).send();
  }
}

/**
 *  Deletes all the pets in the collection
 */
exports.deletePets = function(args, res, next) {
  pets.splice(0, pets.length);
  res.status(200).send();
}

/**
 *  Updates a pet
 */
exports.updatePet = function(args, res, next) {
  var index = -1;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.params.petId) {
      if (args.body != undefined) {
        pets[i] = args.body;
        res.status(201).send("Updated pet");
      } else {
        res.status(201).send("No pet was sent in the body of the update request");
      }
    }
  }
}

exports.pets = pets;
