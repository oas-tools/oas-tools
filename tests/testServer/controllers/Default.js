'use strict';

var Default = require('./DefaultService');

module.exports.showPetById = function showPetById (req, res, next) {
  Default.showPetById(req.swagger.params, res, next);
};

module.exports.listPets = function listPets (req, res, next) {
  Default.listPets(req.swagger.params, res, next);
};

module.exports.createPets = function createPets (req, res, next) {
  Default.createPets(req.swagger.params, res, next);
};

module.exports.updatePet = function updatePet (req, res, next) {
  Default.updatePet(req.swagger.params, res, next);
};

module.exports.deletePet = function deletePet (req, res, next) {
  Default.deletePet(req.swagger.params, res, next);
};

module.exports.deletePets = function deletePets (req, res, next) {
  Default.deletePets(req.swagger.params, res, next);
};

module.exports.testRequestBody = function testRequestBody (req, res, next) {
  res.status(201).send();
};
