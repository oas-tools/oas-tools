'use strict'

var favoritesCreatejsonController = require('./favoritesCreatejsonControllerService');

module.exports.favoritesCreateJsonPARAMETERS = function favoritesCreateJsonPARAMETERS(req, res, next) {
  favoritesCreatejsonController.favoritesCreateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.favoritesCreate = function favoritesCreate(req, res, next) {
  favoritesCreatejsonController.favoritesCreate(req.swagger.params, res, next);
};