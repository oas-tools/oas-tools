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
    id: 10,
    name: "Pig",
    tag: "Looking for mud"
  },
  {
    id: 28,
    name: "Bat",
    tag: "At night"
  },
  {
    id: 200,
    name: "AnimalZ",
    tag: "This is an object",
  }
];

function corruptPets() {
  pets = [{
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
      name: "Bat",
      tag: "At night"
    },
    {
      id: 200,
      name: "AnimalZ",
      tag: "This is supposed to be a wrong object",
      extraProperty: "Extra property, wrong!"
    }
  ];
  exports.pets = pets;
}

function setCorrectPets() {
  pets = [{
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
    },
    {
      id: 10,
      name: "Pig",
      tag: "Looking for mud"
    },
    {
      id: 200,
      name: "AnimalZ",
      tag: "It is not wrong anymore"
    }
  ];
}

// args = req.swagger.params

/**
 *  Creates a pet
 */
exports.createPets = function(args, res, next) {
  pets.push(args);
  exports.pets = pets;
  res.status(201).send(pets);
}

/**
 *  Retrieves the whole pets collection
 */
exports.listPets = function(args, res, next) {
  exports.pets = pets;
  res.status(200).send(pets.slice(0, args.limit));
}

/**
 *  Retrieves a single pet
 */
exports.showPetById = function(args, res, next) {
  exports.pets = pets;
  var res_pet;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.petId) {
      res_pet = pets[i];
      break;
    }
  }
  if (res_pet == undefined) {
    res.status(404).send({
      message: "There is no pet with id " + args.petId
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
    if (pets[i].id == args.petId) {
      index = i;
    }
  }
  if (index == -1) {
    res.status(404).send({
      message: "There is no pet with id " + args.petId + " to be deleted"
    });
  } else {
    pets.splice(index, 1);
    res.status(204).send(); //{message: "Pet successfully deleted!"}
  }
  exports.pets = pets;
}

/**
 *  Deletes all the pets in the collection
 */
exports.deletePets = function(args, res, next) {
  exports.pets = pets;
  pets.splice(0, pets.length);
  exports.pets = pets;
  res.status(204).send(); //{message: "All pets successfully deleted!"}
}

/**
 *  Updates a pet
 */
exports.updatePet = function(args, res, next) {
  var present = false;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.params.petId) {
      present = true;
      pets[i] = args.body;
      res.status(200).send({
        message: "Updated pet"
      });
    }
  }
  if (present == false) {
    res.status(404).send({
      message: "There is no pet with id " + args.params.petId
    });
  }
  exports.pets = pets;
}

exports.pets = pets;
exports.corruptPets = corruptPets;
exports.setCorrectPets = setCorrectPets;
