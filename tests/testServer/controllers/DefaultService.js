'use strict';

let pets = [
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
  pets = [
    {
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
    }
  ];
  exports.pets = pets;
}

function setCorrectPets() {
  pets = [
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
exports.createPets = (args, res) => {
  pets.push(args.pet.value);
  exports.pets = pets;
  res.status(201).send(pets);
}

/**
 *  Retrieves the whole pets collection
 */
exports.listPets = (args, res) => {
  exports.pets = pets;
  res.status(200).send(pets.slice(0, args.limit.value));
}

/**
 *  Retrieves a single pet
 */
exports.showPetById = (args, res) => {
  exports.pets = pets;
  var res_pet;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.petId.value) {
      res_pet = pets[i];
      break;
    }
  }
  if (res_pet == undefined) {
    res.status(404).send({
      message: "There is no pet with id " + args.petId.value
    });
  } else {
    res.status(200).send(res_pet);
  }
}

/**
 *  Deletes a single pet from the collection
 */
exports.deletePet = (args, res) => {
  var index = -1;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.petId.value) {
      index = i;
    }
  }
  if (index == -1) {
    res.status(404).send({
      message: "There is no pet with id " + args.petId.value + " to be deleted"
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
exports.deletePets = (args, res) => {
  exports.pets = pets;
  pets.splice(0, pets.length);
  exports.pets = pets;
  res.status(204).send(); //{message: "All pets successfully deleted!"}
}

/**
 *  Updates a pet
 */
exports.updatePet = (args, res) => {
  var present = false;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.petId.value) {
      present = true;
      pets[i] = args.pet.value;
      res.status(200).send({
        message: "Updated pet"
      });
    }
  }
  if (present == false) {
    res.status(404).send({
      message: "There is no pet with id " + args.petId.value
    });
  }
  exports.pets = pets;
}

exports.pets = pets;
exports.corruptPets = corruptPets;
exports.setCorrectPets = setCorrectPets;
