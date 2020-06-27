'use strict';

var pets = [
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
    tag: undefined
  },
  {
    id: 28,
    name: "Bat",
    tag: "At night"
  },
  {
    id: 200,
    name: "AnimalZ",
    tag: "This is an object"
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
      extraProperty: "Extra property, wrong!"
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
      tag: undefined
    },
    {
      id: 200,
      name: "AnimalZ",
      tag: "It is not wrong anymore"
    }
  ];
}

/**
 *  Path for testing path parameters
 */
exports.paramTestsPath = (req, res) => {
  res.send({
    message: 'Path for path parameters tests was requested, this it its controller response'
  });
};

/**
 *  Path for testing query parameters
 */
exports.paramTestsQuery = (req, res) => {
  res.send({
    message: 'Path for query parameters tests was requested, this it its controller response'
  });
};

/**
 *  Path for testing ownership
 */
exports.ownershipTest = (req, res) => {
  res.send({
    message: 'Path for ownership tests was requested, this is its controller response'
  });
};

/**
 *  Path for testing operation property
 */
exports.operationTests = (req, res) => {
  res.send({
    operation: req.swagger.operation
  });
};


/**
 *  Path for testing ownership with acl binding
 */
exports.ownershipBindingTest = (req, res) => {
  res.send({
    message: 'Path for ownership with acl binding tests was requested, this is its controller response'
  });
};

/**
 *  Path for testing properties type on responses
 */
exports.responseBodyTest = (req, res) => {
  var arrayRes = [];
  var okay = {
    integerProperty: 2,
    booleanProperty: true,
    stringProperty: "okay",
    doubleProperty: 2.8
  }
  var wrong = {
    integerProperty: "wrong",
    booleanProperty: 23,
    stringProperty: 6.8,
    doubleProperty: false
  }
  arrayRes.push(okay);
  arrayRes.push(wrong);
  res.send(arrayRes);
};

/**
 *  Creates a pet
 */
exports.createPets = (args, res) => {
  pets.push(args.body);
  exports.pets = pets;
  res.status(201).send(pets);
}

/**
 *  Creates a pet with associated binary file upload
 */
exports.createPetsViaMultipartFormdata = (args, res) => {
  const pet = {
    id: Number(args.body.id), // form fields arrive always as strings
    name: args.body.name,
    tag: 'not important'
  }
  pets.push(pet);
  exports.pets = pets;
  res.status(201).send(pets);
}

/**
 *  Retrieves the whole pets collection
 */
exports.listPets = (args, res) => {
  exports.pets = pets;
  res.status(200).send(pets.slice(0, args.query.limit));
}

/**
 *  Retrieves a single pet
 */
exports.showPetById = (args, res) => {
  exports.pets = pets;
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
 * Retrieves headers for pet
 */
exports.getPetHeaders = (args, res) => {
  res.status(200).send();
}

/**
 *  Deletes a single pet from the collection
 */
exports.deletePet = (args, res) => {
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

/**
 * Updates a tag of a pet
 */
exports.updateTag = (args, res) => {
  var present = false;
  for (var i = 0; i < pets.length; i++) {
    if (pets[i].id == args.params.petId) {
      present = true;
      pets[i].tag = args.body.tag;
      res.status(200).send({
        message: "Updated pet"
      });
    }
  }
  if (!present) {
    res.status(404).send({
      message: "There is no pet with id " + args.params.petId
    });
  }
  exports.pets = pets;
};

 /**
  * Sends a security config file
  */
exports.securityFile = (req, res) => {
  res.send({
    issuer: 'ISA Auth',
    key: 'test'
  });
};

/**
 * Sends an auth config file
 */
exports.grantsFile = (req, res) => {
  res.send({
    anonymous: {
      paramTestsQuery: {
        "create:any": [
          "*"
        ],
        "read:any": [
          "*"
        ],
        "update:any": [
          "*"
        ],
        "delete:any": [
          "*"
        ]
      },
      paramTestsPath: {
        "create:any": [
          "*"
        ],
        "read:any": [
          "*"
        ],
        "update:any": [
          "*"
        ],
        "delete:any": [
          "*"
        ]
      },
      ownershipTest: {
        "read:own": [
          "*"
        ]
      },
      ownershipBindingTest: {
        "read:own": [
          "*"
        ]
      },
      commonParamTest: {
        "read:any": [
          "*"
        ]
      },
      overrideCommonParamTest: {
        "read:any": [
          "*"
        ]
      },
      responseBodyTest: {
        "create:any": [
          "*"
        ],
        "read:any": [
          "*"
        ],
        "update:any": [
          "*"
        ],
        "delete:any": [
          "*"
        ]
      },
      pets: {
        "create:any": [
          "*"
        ],
        "read:any": [
          "*"
        ],
        "update:any": [
          "*"
        ],
        "delete:any": [
          "*"
        ]
      },
      multipartFormdata: {
        "create:any": [
          "*"
        ],
        "read:any": [
          "*"
        ],
        "update:any": [
          "*"
        ],
        "delete:any": [
          "*"
        ]
      },
      requestBodyTest: {
        "create:any": [
          "*"
        ]
      },
    },
    user: {
      pets: {
        "read:any": [
          "*"
        ]
      }
    },
    userWithoutPermissions: {},
    extendeduser: {
      "$extend": ["user"]
    }
  });
};

/**
 * Sends a sample object
 */
exports.tokenVerificationTest = (req, res) => {
  res.send({
    samplestring: "testing"
  });
};

/**
 * Sends a sample response for common parameter tests
 */
exports.commonParamTest = (req, res) => {
  res.send({
    id: parseInt(req.query.testParam)
  });
};


/**
 * Echos the first elemet from the param
 */
exports.arrayWithStringsTest = (req, res) => {
  res.send({
    value: req.swagger.params.listTestParam.value[0]
  });
};

/**
 * Sends a sample response for content type tests
 */
exports.contentTypeTest = (req, res) => {
  res.send({
    id: 123
  });
};

/**
 * Sends a sample response with a 400 code
 */
exports.wrongResponseCode = (req, res) => {
  res.status(400).send({
    message: "This is a test"
  });
};

/**
 * Sends a sample response with a null field
 */
exports.nullableResponse = (req, res) => {
  res.send({
    id: 123,
    text: null
  });
};

/**
 * Sends a sample response for c
 */
exports.defaultResponseCode = (req, res) => {
  res.send({
    id: 123
  });
};

exports.pets = pets;
exports.corruptPets = corruptPets;
exports.setCorrectPets = setCorrectPets;
