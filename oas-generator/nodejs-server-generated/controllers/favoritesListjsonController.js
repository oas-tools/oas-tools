'use strict'

var favoritesListjsonController = require('./favoritesListjsonControllerService');

module.exports.favoritesList = function favoritesList(req, res, next) {
  favoritesListjsonController.favoritesList(req.swagger.params, res, next);
};

module.exports.favoritesListJsonPARAMETERS = function favoritesListJsonPARAMETERS(req, res, next) {
  favoritesListjsonController.favoritesListJsonPARAMETERS(req.swagger.params, res, next);
};