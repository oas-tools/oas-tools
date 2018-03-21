'use strict';

var pets = [{
    name: "Wrong",
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
    name: "Bat",
    tag: "Wrong object as its id is string instead of integer"
  }
];

/**
 *  Creates a pet
 */
exports.createPets = function(args, res, next) {

  console.log("IS IT HERE???")

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
  var res_pet = pets[args.params.petId];
  if (res_pet != undefined) {
    res.status(200).send(res_pet);
  } else {
    res.status(404).send({
      message: "There is no pet with id " + args.params.petId
    });
  }
}

/**
 *  Deletes a single pet from the collection
 */
exports.deletePet = function(args, res, next) {
  var index = -1;
  for(var i = 0; i<pets.length; i++){
    if(pets[i].id == args.params.petId){
      index = i;
    }
  }
  if(index == -1){
    res.status(404).send({
      message: "There is no pet with id " + args.params.petId + " to be deleted"
    });
  }else{
    pets.splice(index,1);
    res.status(200).send();
  }
}

/**
 *  Deletes all the pets in the collection
 */
exports.deletePets = function(args, res, next) {
  pets.splice(0,pets.length);
  res.status(200).send();
}

/**
 *  Updates a pet
 */
exports.updatePet = function(args, res, next) {
  var res_pet = pets[args.params.petId];
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
      message: "There is no pet with id " + args.params.petId + " to be updated"
    });
  }
}

exports.pets = pets;
