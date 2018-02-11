'use strict';

var url = require('url');

var Default = require('./DefaultService.js');

module.exports.listPets = function listPets (req, res, next) {
  Default.listPets(req, res, next);
};

module.exports.createPets = function createPets (req, res, next) {
  Default.createPets(req, res, next);
};
