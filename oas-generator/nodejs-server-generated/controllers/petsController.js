'use strict'

var petsController = require('./petsControllerService');

module.exports.listPets = function listPets(req, res, next) {
  petsController.listPets(req.swagger.params, res, next);
};

module.exports.createPets = function createPets(req, res, next) {
  petsController.createPets(req.swagger.params, res, next);
};

module.exports.deletePets = function deletePets(req, res, next) {
  petsController.deletePets(req.swagger.params, res, next);
};

module.exports.showPetById = function showPetById(req, res, next) {
  petsController.showPetById(req.swagger.params, res, next);
};

module.exports.updatePet = function updatePet(req, res, next) {
  petsController.updatePet(req.swagger.params, res, next);
};

module.exports.deletePet = function deletePet(req, res, next) {
  petsController.deletePet(req.swagger.params, res, next);
};