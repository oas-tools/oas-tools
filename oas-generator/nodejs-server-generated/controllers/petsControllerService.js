'use strict'

module.exports.listPets = function listPets(req, res, next) {
  res.send({
    message: 'This is the raw controller for listPets'
  });
};

module.exports.createPets = function createPets(req, res, next) {
  res.send({
    message: 'This is the raw controller for createPets'
  });
};

module.exports.deletePets = function deletePets(req, res, next) {
  res.send({
    message: 'This is the raw controller for deletePets'
  });
};

module.exports.showPetById = function showPetById(req, res, next) {
  res.send({
    message: 'This is the raw controller for showPetById'
  });
};

module.exports.updatePet = function updatePet(req, res, next) {
  res.send({
    message: 'This is the raw controller for updatePet'
  });
};

module.exports.deletePet = function deletePet(req, res, next) {
  res.send({
    message: 'This is the raw controller for deletePet'
  });
};