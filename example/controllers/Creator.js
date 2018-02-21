'use strict';

var url = require('url');

var Creator = require('./CreatorService.js');

/*module.exports.listPets = function listPets (req, res, next) {
  Default.listPets(req, res, next);
};*/

module.exports.createPets = function createPets (req, res, next) {
  Creator.createPets(req, res, next);
};
