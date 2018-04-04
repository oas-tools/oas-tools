'use strict';

var pets = [{
    id: "1",
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
    id: 10,
    name: "Pig",
    tag: "Looking for mud"
  },
  {
    //id: 11,
    name: "Bat",
    tag: "At night"
  }
];

function setCorrectPets(newPets) {
  pets = newPets;
}

/**
 *  Creates a pet: Here the controller should not check whether there is a pet in the request body, that must be done by oas-tools!
 */
exports.createPets = function(args, res, next) {
  pets.push(args.body);
  res.status(201).send(pets);
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
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.params.petId) {
      res_pet = pets[i];
      break;
    }
  }
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
    res.status(204).send(); //{message: "Pet successfully deleted!"}
  }
}

/**
 *  Deletes all the pets in the collection
 */
exports.deletePets = function(args, res, next) {
  pets.splice(0, pets.length);
  res.status(204).send(); //{message: "All pets successfully deleted!"}
}

/**
 *  Updates a pet: Here the controller should not check whether there is a pet in the request body, that must be done by oas-tools!
 */
exports.updatePet = function(args, res, next) {
  var present = false;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.params.petId) {
      present = true;
      if (args.body != undefined) {
        pets[i] = args.body;
        res.status(200).send({
          message: "Updated pet"
        });
      } else {
        res.status(400).send({
          code: 400,
          message: "No pet was sent in the body of the update request"
        });
      }
    }
  }
  if (present == false) {
    res.status(404).send({
      message: "There is no pet with id " + args.params.petId
    });
  }
}

exports.pets = pets;
exports.setCorrectPets = setCorrectPets;
